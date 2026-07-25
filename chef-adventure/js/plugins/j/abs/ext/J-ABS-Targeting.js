//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 TARGETING] An extension for JABS that adds cursor-driven tactical targeting.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-ABS-InputManager
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-ABS-InputManager
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin adds a cursor-driven target-selection mode to JABS. Skills
 * flagged for targeting pause combat (reusing the same soft-pause the JABS
 * quick menu already uses) and let the player aim a reticle at allies or
 * enemies, scoped per skill, before the action fires.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-ABS; this is an extension of the core JABS engine.
 * - J-ABS-InputManager; needed so the cursor recognizes d-pad input the same way the standard
 *   controller's own menu windows do (its custom d-pad symbols aren't visible to the vanilla
 *   `Input.dir8` accessor).
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * TODO: flesh out once the targeting mode's shape is finalized.
 *
 * ============================================================================
 * TAG USAGE:
 * - Skills
 *
 * TAG FORMAT:
 *  <targeted>
 *    Marks a skill as requiring the tactical targeting UX instead of firing
 *    immediately.
 *
 * TAG EXAMPLES:
 *  <targeted>
 * This skill will pause combat and prompt for a target before executing.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 *
 * @param reticleImage
 * @text Reticle Image
 * @type file
 * @dir img/system
 * @desc The image shown as the aiming reticle. Defaults to the stock RMMZ window-scroll arrow.
 * @default WindowArrow
 *
 * @param targetingListWindowX
 * @text List Window X
 * @type number
 * @min 0
 * @desc The screen X of the cycle-select list window.
 * @default 576
 *
 * @param targetingListWindowY
 * @text List Window Y
 * @type number
 * @min 0
 * @desc The screen Y of the cycle-select list window.
 * @default 186
 */
//endregion annotations


//#region src/plugins/abs/ext/targeting/_metadata/_pluginMetadata.js
var JTargeting_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br>
	* Includes translation of plugin parameters.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeMetadata();
	}
	/**
	* Initializes the metadata associated with this plugin.
	*/
	initializeMetadata() {
		/**
		* The filename (under img/system/) of the reticle sprite shown while aiming.
		* @type {string}
		*/
		this.reticleImage = this.parsedPluginParameters["reticleImage"] ?? "WindowArrow";
		/**
		* The screen X of the cycle-select list window.
		* @type {number}
		*/
		this.targetingListWindowX = parseInt(this.parsedPluginParameters["targetingListWindowX"]);
		/**
		* The screen Y of the cycle-select list window.
		* @type {number}
		*/
		this.targetingListWindowY = parseInt(this.parsedPluginParameters["targetingListWindowY"]);
	}
};

//#endregion
//#region src/plugins/abs/ext/targeting/_metadata/initialization.js
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.2.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (!hasBaseRequirement) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
	const requiredJabsVersion = "4.13.0";
	const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.version.version(), requiredJabsVersion);
	if (!hasJabsRequirement) {
		throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.ABS.EXT.TARGETING = {};
/**
* The metadata associated with this plugin.
*/
J.ABS.EXT.TARGETING.Metadata = new JTargeting_PluginMetadata("J-ABS-Targeting", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.ABS.EXT.TARGETING.Aliased = {};
J.ABS.EXT.TARGETING.Aliased.JABS_InputAdapter = new Map();
J.ABS.EXT.TARGETING.Aliased.Scene_Map = new Map();
J.ABS.EXT.TARGETING.Aliased.JABS_AiManager = new Map();
J.ABS.EXT.TARGETING.Aliased.JABS_Engine = new Map();
J.ABS.EXT.TARGETING.Aliased.Game_Player = new Map();
J.ABS.EXT.TARGETING.Aliased.JABS_Battler = new Map();
J.ABS.EXT.TARGETING.Aliased.Spriteset_Map = new Map();
/**
* All regular expressions used by this plugin.
*/
J.ABS.EXT.TARGETING.RegExp = { 
/**
* Skill: `<targeted>`
*/
Targeted: /<targeted>/i };

//#endregion
//#region src/plugins/abs/ext/targeting/database/RPG_Skill.js
/**
* Whether this skill requires the tactical targeting UX (cursor-driven target selection)
* instead of firing immediately, via the `<targeted>` tag.
*/
Object.defineProperty(RPG_Skill.prototype, "targeted", { get: function() {
	return RPGManager.checkForBooleanFromNoteByRegex(this, J.ABS.EXT.TARGETING.RegExp.Targeted);
} });

//#endregion
//#region src/plugins/abs/ext/targeting/_models/JABS_TargetingSession.js
/**
* Represents the state of a single in-progress tactical-targeting aim.<br/>
* Holds the actions that were already fully built (skill resolved, permissions and costs
* checked) but deliberately not yet committed via `setDecidedAction`, pending the player
* confirming (or cancelling) a target through the targeting cursor.
*/
var JABS_TargetingSession = class {
	/**
	* The battler who initiated this targeting session.
	* @type {JABS_Battler}
	*/
	#battler = null;
	/**
	* The fully-built actions awaiting a confirmed target location.
	* @type {JABS_Action[]}
	*/
	#actions = [];
	/**
	* The slot-specific commit tail (cooldown type, combo reset, etc.) to run once a target is
	* confirmed. Mirrors whatever the intercepted `JABS_InputAdapter` method would have done
	* after `getAttackData`, since only the caller knows which slot this came from.
	* @type {function(JABS_Action[]): void}
	*/
	#onCommit;
	/**
	* Constructor.
	* @param {JABS_Battler} battler The battler who initiated this session.
	* @param {JABS_Action[]} actions The pending actions awaiting a target.
	* @param {function(JABS_Action[]): void} onCommit The slot-specific commit tail to run on confirm.
	*/
	constructor(battler, actions, onCommit) {
		this.#battler = battler;
		this.#actions = actions;
		this.#onCommit = onCommit;
	}
	/**
	* Gets the battler who initiated this targeting session.
	* @returns {JABS_Battler}
	*/
	getBattler() {
		return this.#battler;
	}
	/**
	* Gets the pending actions awaiting a confirmed target location.
	* @returns {JABS_Action[]}
	*/
	getActions() {
		return this.#actions;
	}
	/**
	* Gets the slot-specific commit tail to run once a target is confirmed.
	* @returns {function(JABS_Action[]): void}
	*/
	getOnCommit() {
		return this.#onCommit;
	}
};

//#endregion
//#region src/plugins/abs/ext/targeting/_models/JABS_TargetingCursor.js
/**
* Represents the aiming state for one in-progress targeting session.<br/>
* Two distinct modes, chosen once at session start based on the skill's `jabsDirect` flag:
* - **cycle**: a discrete pool of eligible battlers (direct skills) that the player cycles
*   through; `getSelectedBattler()` is the current pick.
* - **freeRoam**: a continuous point in world space (non-direct skills), clamped to range.
*/
var JABS_TargetingCursor = class JABS_TargetingCursor {
	/**
	* `'cycle'` or `'freeRoam'`.
	* @type {string}
	*/
	#mode = "freeRoam";
	/**
	* The caster doing the aiming.
	* @type {JABS_Battler}
	*/
	#caster = null;
	/**
	* The maximum distance (world/tile units) the cursor may be from the caster.
	* @type {number}
	*/
	#range = 0;
	/**
	* The eligible battlers to cycle between, in mode `'cycle'`.
	* @type {JABS_Battler[]}
	*/
	#candidates = [];
	/**
	* The index into `#candidates` currently selected, in mode `'cycle'`.
	* @type {number}
	*/
	#selectedIndex = 0;
	/**
	* The cursor's current world X, in mode `'freeRoam'`.
	* @type {number}
	*/
	#x = 0;
	/**
	* The cursor's current world Y, in mode `'freeRoam'`.
	* @type {number}
	*/
	#y = 0;
	/**
	* Builds a cycle-mode cursor over the given candidates.
	* @param {JABS_Battler} caster The battler doing the aiming.
	* @param {JABS_Battler[]} candidates The eligible battlers to cycle between.
	* @param {number} range The proximity range the candidates were gathered from.
	* @returns {JABS_TargetingCursor}
	*/
	static Cycle(caster, candidates, range) {
		const cursor = new JABS_TargetingCursor();
		cursor.#mode = "cycle";
		cursor.#caster = caster;
		cursor.#candidates = candidates;
		cursor.#range = range;
		return cursor;
	}
	/**
	* Builds a free-roam cursor starting at the caster's own position.
	* @param {JABS_Battler} caster The battler doing the aiming.
	* @param {number} range The maximum distance the cursor may travel from the caster.
	* @returns {JABS_TargetingCursor}
	*/
	static FreeRoam(caster, range) {
		const cursor = new JABS_TargetingCursor();
		cursor.#mode = "freeRoam";
		cursor.#caster = caster;
		cursor.#range = range;
		cursor.#x = caster.getX();
		cursor.#y = caster.getY();
		return cursor;
	}
	/**
	* Whether this cursor is in cycle-select mode.
	* @returns {boolean}
	*/
	isCycleMode() {
		return this.#mode === "cycle";
	}
	/**
	* Whether this cursor is in free-roam mode.
	* @returns {boolean}
	*/
	isFreeRoamMode() {
		return this.#mode === "freeRoam";
	}
	/**
	* Gets the caster doing the aiming.
	* @returns {JABS_Battler}
	*/
	getCaster() {
		return this.#caster;
	}
	/**
	* Gets the maximum range this cursor may travel/select from the caster.
	* @returns {number}
	*/
	getRange() {
		return this.#range;
	}
	/**
	* Gets the full eligible candidate pool, in cycle mode.
	* @returns {JABS_Battler[]}
	*/
	getCandidates() {
		return this.#candidates;
	}
	/**
	* Gets the currently-selected index into the candidate pool, in cycle mode.
	* @returns {number}
	*/
	getSelectedIndex() {
		return this.#selectedIndex;
	}
	/**
	* Sets the currently-selected index into the candidate pool, in cycle mode.
	* @param {number} index The index to select.
	*/
	setSelectedIndex(index) {
		this.#selectedIndex = index;
	}
	/**
	* Gets the currently-selected battler, in cycle mode. Null if the candidate pool is empty.
	* @returns {JABS_Battler|null}
	*/
	getSelectedBattler() {
		return this.#candidates.at(this.#selectedIndex) ?? null;
	}
	/**
	* Steps the current selection to the best-aligned candidate in the given direction, in cycle
	* mode. A no-op if there's nothing to cycle between, or nothing meaningfully lines up with the
	* pressed direction.<br/>
	* Candidates are scored by how well they line up with the pressed direction (higher dot
	* product with the direction vector = more "in that direction"), with distance as a tiebreak,
	* so cycling feels directional rather than jumping to whatever's merely closest.
	* @param {number} dirX Unit-vector X component of the pressed direction.
	* @param {number} dirY Unit-vector Y component of the pressed direction.
	*/
	selectTowards(dirX, dirY) {
		if (this.#candidates.length <= 1) return;
		const current = this.getSelectedBattler();
		let bestIndex = this.#selectedIndex;
		let bestScore = -Infinity;
		this.#candidates.forEach((candidate, index) => {
			if (candidate === current) return;
			const candidateDx = candidate.getX() - current.getX();
			const candidateDy = candidate.getY() - current.getY();
			const distance = Math.hypot(candidateDx, candidateDy);
			if (distance === 0) return;
			const alignment = (candidateDx * dirX + candidateDy * dirY) / distance;
			if (alignment <= 0) return;
			const score = alignment - distance * .01;
			if (score > bestScore) {
				bestScore = score;
				bestIndex = index;
			}
		});
		this.#selectedIndex = bestIndex;
	}
	/**
	* Steps the current selection forward/backward through the candidate list by raw index,
	* wrapping around at either end, in cycle mode. Unlike {@link #selectTowards}, this never
	* skips a candidate based on directional alignment — every candidate gets a turn.
	* @param {number} delta The number of steps to advance (negative to go backward).
	*/
	stepIndex(delta) {
		if (this.#candidates.length <= 1) return;
		const { length } = this.#candidates;
		this.#selectedIndex = ((this.#selectedIndex + delta) % length + length) % length;
	}
	/**
	* Gets the cursor's current world X, in free-roam mode.
	* @returns {number}
	*/
	getX() {
		return this.#x;
	}
	/**
	* Gets the cursor's current world Y, in free-roam mode.
	* @returns {number}
	*/
	getY() {
		return this.#y;
	}
	/**
	* Sets the cursor's current world position, in free-roam mode.
	* @param {number} x The world X.
	* @param {number} y The world Y.
	*/
	setPosition(x, y) {
		this.#x = x;
		this.#y = y;
	}
};

//#endregion
//#region src/plugins/abs/ext/targeting/_models/JABS_TargetingSentinelAction.js
/**
* A reusable stand-in for a spawned `Game_Event` action-sprite, so the cursor's hypothetical
* position can be run through the real collision math (`JABS_Engine.isTargetWithinRange` and its
* per-shape helpers) without anything actually being spawned.<br/>
* Verified that every hitbox shape touches its `action` argument through exactly three members:
* `screenX()`, `screenY()`, and `getJabsAction()` (needing `.direction()`, `.getBaseSkill()`,
* `.getThicknessTiles()` — all of which the real {@link JABS_Action} already provides). This
* class supplies the first two by wrapping a headless `Game_Character` (so screen-pixel
* conversion reuses vanilla RMMZ math instead of hand-rolled tile-to-pixel formulas), and the
* third by simply holding a reference to whichever real action is currently being aimed.<br/>
* Meant to be a single reusable instance: `set()` when a session begins, position updated every
* frame the cursor moves, `reset()` when the session ends.
*/
var JABS_TargetingSentinelAction = class {
	/**
	* The headless character used purely for its `screenX()`/`screenY()` conversion math.
	* @type {Game_Character}
	*/
	#character = new Game_Character();
	/**
	* The real action currently being aimed, or null if no session is active.
	* @type {JABS_Action|null}
	*/
	#jabsAction = null;
	/**
	* Half the height (in pixels) of whichever battler's hitbox the origin is currently centered
	* on, or 0 when the origin isn't a battler at all (free-roam mode aims at open ground, which
	* has no hitbox to center on). Set externally by whoever positions this sentinel, since only
	* they know which battler (if any) the origin represents; see {@link #screenY} for why this
	* exists at all.
	* @type {number}
	*/
	#verticalCenterOffset = 0;
	/**
	* Assigns the real action this sentinel stands in for.
	* @param {JABS_Action} jabsAction The real action being aimed.
	*/
	set(jabsAction) {
		this.#jabsAction = jabsAction;
	}
	/**
	* Clears the assigned action; this sentinel no longer stands in for anything.
	*/
	reset() {
		this.#jabsAction = null;
		this.#verticalCenterOffset = 0;
	}
	/**
	* Sets half the height of whichever battler's hitbox the origin is currently centered on (0
	* if the origin isn't a battler at all). See {@link #screenY} for why this matters.
	* @param {number} offset Half the target battler's hitbox height in pixels, or 0.
	*/
	setVerticalCenterOffset(offset) {
		this.#verticalCenterOffset = offset;
	}
	/**
	* Moves the sentinel's position to match the cursor's current world position.
	* @param {number} x The world X.
	* @param {number} y The world Y.
	*/
	setPosition(x, y) {
		this.#character.locate(x, y);
	}
	/**
	* The sentinel's screen X, pre-adjusted to cancel out the melee origin offset that
	* {@link JABS_Engine.getActionOriginPixels} applies internally. That offset exists to
	* correct a melee swing performed by the *caster's own body* for their sprite's facing — it
	* has nothing to do with an AoE centered on a chosen target's position, so without this
	* cancellation, an otherwise-symmetric AoE would land biased in whichever direction the
	* caster happened to be facing when they attacked, regardless of the actual target.
	* @returns {number}
	*/
	screenX() {
		const { ox } = JABS_Engine.resolveMeleeOriginPixelOffsetsForFacing(this.#jabsAction.direction());
		return this.#character.screenX() - ox;
	}
	/**
	* The sentinel's screen Y, pre-adjusted for the same reason as {@link #screenX}, *and*
	* further shifted up by {@link #verticalCenterOffset}. Every battler's hitbox (whether the
	* generic tile-sized default or a custom per-enemy rectangle, e.g. 2x1, 1x0.5, 4x3 tiles — see
	* `Game_Event#getPixelAbsBattlerAabbModel`) is feet-anchored and extends upward only — so a
	* circle centered exactly on a target's feet is *not* centered on their hitbox, it's centered
	* on the hitbox's bottom edge. That bias is invisible for a single target, but it's exactly
	* what made an otherwise-symmetric row of targets catch only whichever neighbor sat below
	* (closer, since that neighbor's own box reaches upward toward the origin) and not the one
	* above (whose box only reaches further away). Shifting up by half of *that specific
	* battler's* hitbox height lands on its true vertical center, symmetric for both neighbors.
	* @returns {number}
	*/
	screenY() {
		const facing = this.#jabsAction.direction();
		const { oy } = JABS_Engine.resolveMeleeOriginPixelOffsetsForFacing(facing);
		const liftPx = JABS_Engine.resolveMeleeVerticalLiftPxForFacing(facing);
		return this.#character.screenY() + liftPx - oy - this.#verticalCenterOffset;
	}
	/**
	* The real action this sentinel currently stands in for.
	* @returns {JABS_Action|null}
	*/
	getJabsAction() {
		return this.#jabsAction;
	}
	/**
	* The sentinel's raw, unadjusted ground screen position — the actual point being aimed at,
	* with none of {@link #screenX}/{@link #screenY}'s hit-test-specific corrections applied.
	* Meant for purely decorative positioning (e.g. the reticle sprite hovering above this point),
	* not for anything that feeds into collision math.
	* @returns {{x: number, y: number}}
	*/
	groundScreenPosition() {
		return {
			x: this.#character.screenX(),
			y: this.#character.screenY()
		};
	}
};

//#endregion
//#region src/plugins/abs/ext/targeting/managers/JABS_TargetingManager.js
/**
* A static manager that owns the lifecycle of an in-progress tactical-targeting aim.<br/>
* Two modes, chosen once at session start based on {@link JABS_Action#isDirectAction}:
* - **cycle** (direct skills): the player cycles a discrete pool of eligible battlers gathered
*   from `<proximity:N>`, scoped to allies/enemies per the skill's own scope.
* - **freeRoam** (non-direct skills): the player freely aims a continuous point in space,
*   clamped to `<proximity:N>` from the caster.<br/>
* The soft-pause itself is NOT implemented via `$jabsEngine.absPause` (that flag is
* single-owner: the quick menu's own per-frame cleanup unconditionally resets it to `false`
* every frame the menu isn't open, which would stomp this feature's use of it). Instead,
* `isActive()` is checked directly by aliases on the handful of gates that `absPause` used to
* satisfy: {@link JABS_AiManager.canUpdate}, {@link JABS_Engine#canUpdateInput},
* {@link Game_Player#canMove}, and {@link JABS_Battler#canUpdateEngagement}.
*/
var JABS_TargetingManager = class JABS_TargetingManager {
	/**
	* The currently active targeting session, or null if nobody is aiming.
	* @type {JABS_TargetingSession|null}
	*/
	static _session = null;
	/**
	* The aiming state (cycle-select or free-roam) for the active session, or null.
	* @type {JABS_TargetingCursor|null}
	*/
	static _cursor = null;
	/**
	* The shared sentinel action-event, reused across sessions; see its own class doc for why it
	* exists. Only meaningful while a session is active.
	* @type {JABS_TargetingSentinelAction}
	*/
	static _sentinel = new JABS_TargetingSentinelAction();
	/**
	* The native dir8 (keyboard + analog stick) read on the previous frame, used to edge-detect a
	* fresh directional press in cycle mode (so holding a direction doesn't spam-cycle every
	* frame). Tracked separately from the d-pad below so each input channel gets its own turn.
	* @type {number}
	*/
	static _previousDir8 = 0;
	/**
	* The d-pad step (-1/0/1) read on the previous frame, used to edge-detect a fresh d-pad press
	* in cycle mode, independently of the native dir8 channel above.
	* @type {number}
	*/
	static _previousDpadStep = 0;
	/**
	* True for the remainder of the frame a session begins on. The button that opened the
	* session (e.g. mainhand attack) may be the same physical key as a raw `Input` symbol like
	* "ok" (both commonly bind to Z), so polling input on that same frame would immediately
	* confirm/cancel the session it just opened. Skip one frame before accepting input.
	* @type {boolean}
	*/
	static _justBegan = false;
	/**
	* How many world tiles per frame the free-roam cursor moves while a direction is held.
	* @type {number}
	*/
	static FreeRoamSpeedPerFrame = .15;
	/**
	* Whether or not a targeting session is currently active.
	* @returns {boolean}
	*/
	static isActive() {
		return this._session !== null;
	}
	/**
	* Gets the active aiming state, or null if nobody is aiming.
	* @returns {JABS_TargetingCursor|null}
	*/
	static getCursor() {
		return this._cursor;
	}
	/**
	* Gets the shared sentinel action-event, standing in for whatever is currently being aimed.
	* @returns {JABS_TargetingSentinelAction}
	*/
	static getSentinel() {
		return this._sentinel;
	}
	/**
	* Whether the primary of the given already-built actions requires the tactical targeting UX
	* instead of firing immediately.
	* @param {JABS_Action[]} actions The already-built pending actions.
	* @returns {boolean}
	*/
	static isTargetedAttempt(actions) {
		return actions.length > 0 && actions[0].getBaseSkill().targeted;
	}
	/**
	* Peeks at what the given slot would fire without committing anything, returning the built
	* actions only if the attempt is both valid (non-empty, not global-cooldown-blocked) and
	* actually `<targeted>`. Centralizes the identical validation each `JABS_InputAdapter` choke
	* point needs, since only the caller knows which slot-specific gates/commit-tail apply.
	* @param {JABS_Battler} jabsBattler The battler attempting the action.
	* @param {string} slot The cooldown/skill slot being attempted.
	* @returns {JABS_Action[]} The pending actions if this is a valid targeted attempt; `[]` otherwise.
	*/
	static peekTargetedActions(jabsBattler, slot) {
		const actions = jabsBattler.getAttackData(slot);
		if (actions.length === 0) return [];
		if (JABS_GlobalCooldown.isGlobalBlockingSkillId(jabsBattler, actions[0].getBaseSkill().id)) return [];
		if (!this.isTargetedAttempt(actions)) return [];
		return actions;
	}
	/**
	* Begins a new targeting session for the given battler and already-built pending actions.
	* @param {JABS_Battler} battler The battler who is aiming.
	* @param {JABS_Action[]} actions The fully-built actions awaiting a confirmed target.
	* @param {function(JABS_Action[]): void} onCommit The slot-specific commit tail (cooldown
	* type, combo reset, etc.) to run once a target is confirmed.
	*/
	static beginTargeting(battler, actions, onCommit) {
		if (this.isActive()) return;
		this._session = new JABS_TargetingSession(battler, actions, onCommit);
		const [primaryAction] = actions;
		this._cursor = primaryAction.isDirectAction() ? this.#buildCycleCursor(battler, primaryAction) : JABS_TargetingCursor.FreeRoam(battler, primaryAction.getProximity());
		this._sentinel.set(primaryAction);
		this.#syncSentinelPosition();
		this._justBegan = true;
		this._previousDir8 = 0;
		this._previousDpadStep = 0;
	}
	/**
	* Gathers the eligible candidate pool for cycle mode, scoped to allies/enemies per the
	* skill's own scope, and builds a cursor over it.
	* @param {JABS_Battler} battler The battler doing the aiming.
	* @param {JABS_Action} primaryAction The primary action being aimed.
	* @returns {JABS_TargetingCursor}
	*/
	static #buildCycleCursor(battler, primaryAction) {
		const proximity = primaryAction.getProximity();
		const candidates = this.gatherScopedCandidates(battler, primaryAction, proximity);
		return JABS_TargetingCursor.Cycle(battler, candidates, proximity);
	}
	/**
	* Gathers every battler within range that's actually a legitimate target for this action's
	* scope — allies only for an ally-scope skill, or anything not on the caster's own team
	* (inanimate/neutral objects included) for an enemy-scope skill. Shared by cycle-mode
	* candidate gathering and the AoE highlight preview, so a skill's AoE never highlights allies
	* as "about to be hit" when it can only actually affect enemies, or vice versa.<br/>
	* The enemy-scope branch deliberately does not reuse
	* {@link JABS_AiManager.getOpposingBattlersWithinRange} — that helper excludes neutral-team
	* battlers entirely (core's own auto-target priority chain only reaches them as a
	* special-cased last resort), but a player explicitly choosing a target via `<targeted>`
	* should be able to pick anything targetable, inanimate objects included.
	* @param {JABS_Battler} battler The battler doing the aiming.
	* @param {JABS_Action} action The action whose scope determines ally vs. enemy.
	* @param {number} range The range to search within.
	* @returns {JABS_Battler[]}
	*/
	static gatherScopedCandidates(battler, action, range) {
		if (action.isSupportAction()) {
			return JABS_AiManager.getAlliedBattlersWithinRange(battler, range);
		}
		return JABS_AiManager.getBattlersWithinRange(battler, range).filter((candidate) => !battler.isFriendlyTeam(candidate.getTeam())).filter((candidate) => !(candidate.isFollower() && candidate.getCharacter().isVisible() === false));
	}
	/**
	* Per-frame update while a targeting session may be active.<br/>
	* Stage 1 placeholder input: "ok" confirms, "cancel" aborts.
	*/
	static update() {
		if (!this.isActive()) return;
		if (this._justBegan) {
			this._justBegan = false;
			return;
		}
		this.#updateCursorMovement();
		this.#syncSentinelPosition();
		if (Input.isTriggered("ok")) {
			this.confirm();
			return;
		}
		if (Input.isTriggered("cancel")) {
			this.cancel();
		}
	}
	/**
	* Reads directional input and moves the cursor according to its current mode.
	*/
	static #updateCursorMovement() {
		if (this._cursor.isCycleMode()) {
			this.#updateCycleSelection();
			return;
		}
		const dir8 = this.#readDirectionalInput();
		if (dir8 === 0) return;
		const { x: dx, y: dy } = $jabsEngine.dir8ToUnitVector(dir8);
		const cursor = this._cursor;
		const caster = cursor.getCaster();
		let nextX = cursor.getX() + dx * JABS_TargetingManager.FreeRoamSpeedPerFrame;
		let nextY = cursor.getY() + dy * JABS_TargetingManager.FreeRoamSpeedPerFrame;
		const fromCasterX = nextX - caster.getX();
		const fromCasterY = nextY - caster.getY();
		const distanceFromCaster = Math.hypot(fromCasterX, fromCasterY);
		const range = cursor.getRange();
		if (distanceFromCaster > range && distanceFromCaster > 0) {
			const scale = range / distanceFromCaster;
			nextX = caster.getX() + fromCasterX * scale;
			nextY = caster.getY() + fromCasterY * scale;
		}
		cursor.setPosition(nextX, nextY);
	}
	/**
	* Drives cycle-mode selection from two independent input channels, each edge-detected
	* separately so holding a direction doesn't spam-step every frame:
	* - native dir8 (keyboard + analog stick) drives {@link JABS_TargetingCursor#selectTowards},
	*   which jumps straight to whatever candidate best lines up with the pressed direction. This
	*   can skip over a candidate that isn't well-aligned even if it's spatially "in between."
	* - the d-pad instead drives {@link JABS_TargetingCursor#stepIndex}, which just advances
	*   through the candidate list one at a time, wrapping at either end, regardless of alignment
	*   — a reliable fallback for exactly the case above, where the alignment math doesn't
	*   cooperate and a candidate becomes otherwise unreachable.
	*/
	static #updateCycleSelection() {
		const { dir8 } = Input;
		if (dir8 !== 0 && this._previousDir8 === 0) {
			const { x: dirX, y: dirY } = $jabsEngine.dir8ToUnitVector(dir8);
			this._cursor.selectTowards(dirX, dirY);
		}
		this._previousDir8 = dir8;
		const dpadStep = this.#readDpadStep();
		if (dpadStep !== 0 && this._previousDpadStep === 0) {
			this._cursor.stepIndex(dpadStep);
		}
		this._previousDpadStep = dpadStep;
	}
	/**
	* Reads the d-pad as a simple list-stepping direction: right/down advance forward, left/up
	* advance backward. Diagonals resolve to whichever axis is checked first (right/left before
	* up/down) rather than being treated as a distinct step.
	* @returns {-1|0|1}
	*/
	static #readDpadStep() {
		const { Symbols } = J.ABS.EXT.INPUT;
		if (Input.isPressed(Symbols.DPadRight)) return 1;
		if (Input.isPressed(Symbols.DPadLeft)) return -1;
		if (Input.isPressed(Symbols.DPadDown)) return 1;
		if (Input.isPressed(Symbols.DPadUp)) return -1;
		return 0;
	}
	/**
	* Reads a numpad-style dir8 code (0 for none) from either native `Input.dir8` (keyboard
	* arrows and the analog stick — RMMZ reads the stick via hardcoded axis thresholds, unaffected
	* by symbol remapping) or, failing that, the d-pad. The d-pad's button codes get remapped to
	* custom `J.ABS.EXT.INPUT.Symbols.DPad*` symbols instead of the vanilla `'up'`/`'down'`/etc.
	* ones `Input.dir8` reads internally, so it never sees d-pad presses on its own — this mirrors
	* the same fix `Window_Selectable` already applies for menu navigation.
	* @returns {number}
	*/
	static #readDirectionalInput() {
		const { dir8 } = Input;
		if (dir8 !== 0) return dir8;
		const { Symbols } = J.ABS.EXT.INPUT;
		const up = Input.isPressed(Symbols.DPadUp);
		const down = Input.isPressed(Symbols.DPadDown);
		const left = Input.isPressed(Symbols.DPadLeft);
		const right = Input.isPressed(Symbols.DPadRight);
		if (up && left) return 7;
		if (up && right) return 9;
		if (down && left) return 1;
		if (down && right) return 3;
		if (up) return 8;
		if (down) return 2;
		if (left) return 4;
		if (right) return 6;
		return 0;
	}
	/**
	* Keeps the shared sentinel's position aligned with the cursor's current effective position
	* (the selected battler in cycle mode, or the live point in free-roam mode), along with the
	* vertical centering offset that position requires — see
	* {@link JABS_TargetingSentinelAction#screenY} for why that offset varies: cycle mode centers
	* on a specific battler's own hitbox (whatever size it actually is), while free-roam mode aims
	* at open ground with no hitbox to center on at all.
	*/
	static #syncSentinelPosition() {
		const cursor = this._cursor;
		if (cursor.isCycleMode()) {
			const selected = cursor.getSelectedBattler();
			if (selected) {
				const character = selected.getCharacter();
				this._sentinel.setPosition(selected.getX(), selected.getY());
				this._sentinel.setVerticalCenterOffset(JABS_Engine.getBattlerAabbModel(character).h / 2);
			}
			return;
		}
		this._sentinel.setPosition(cursor.getX(), cursor.getY());
		this._sentinel.setVerticalCenterOffset(0);
	}
	/**
	* Confirms the current targeting session and commits the pending actions exactly as the
	* intercepted input-adapter method would have, using the cursor's actual resolved target.
	*/
	static confirm() {
		const session = this._session;
		if (!session) return;
		const battler = session.getBattler();
		const actions = session.getActions();
		const [primaryAction] = actions;
		if (primaryAction.getBaseSkill().jabsDirectLock) {
			this.#confirmDirectLock(battler, primaryAction, session);
			return;
		}
		const { x, y } = this.#resolveTargetXY(battler);
		const location = JABS_Location.Builder().setX(x).setY(y).setDirection(battler.getCharacter().direction()).build();
		actions.forEach((action) => {
			const existing = action.getActionOptions();
			const rebuilt = JABS_ActionOptions.Builder().setIsRetaliation(existing.isActionRetaliation()).setCooldownKey(existing.getCooldownKey()).setLocation(location).setIsTerrainDamage(existing.isTerrainDamage()).setSpawnOffset(existing.getSpawnOffsetX(), existing.getSpawnOffsetY()).setProjectileTravelAngleDegrees(existing.getProjectileTravelAngleDegrees()).setRetaliationTarget(existing.getRetaliationTarget()).build();
			action.setActionOptions(rebuilt);
		});
		session.getOnCommit()(actions);
		this.#endSession();
	}
	/**
	* Confirms a `<directLock>` session: rather than freezing a location, hands the player's
	* explicit cycle-mode pick to whichever "known target" reference live resolution consults for
	* this action's scope, then commits without ever attaching a location at all. `<directLock>`
	* only ever applies to direct (cycle-mode) skills, so the cursor is guaranteed to be in cycle
	* mode here.
	* @param {JABS_Battler} battler The battler who confirmed the target.
	* @param {JABS_Action} primaryAction The primary action driving scope (ally vs. opponent).
	* @param {JABS_TargetingSession} session The active session being confirmed.
	*/
	static #confirmDirectLock(battler, primaryAction, session) {
		const selected = this._cursor.getSelectedBattler();
		if (selected) {
			if (primaryAction.isSupportAction()) {
				battler.setAllyTarget(selected);
			} else {
				battler.setTarget(selected);
			}
		}
		session.getOnCommit()(session.getActions());
		this.#endSession();
	}
	/**
	* Resolves the world X/Y the confirmed action should target: the selected battler's position
	* in cycle mode, or the cursor's own live position in free-roam mode.
	* @param {JABS_Battler} battler The battler doing the aiming, used as a cycle-mode fallback if
	* the candidate pool somehow ended up empty.
	* @returns {{x: number, y: number}}
	*/
	static #resolveTargetXY(battler) {
		const cursor = this._cursor;
		if (cursor.isCycleMode()) {
			const target = cursor.getSelectedBattler() ?? battler;
			return {
				x: target.getX(),
				y: target.getY()
			};
		}
		return {
			x: cursor.getX(),
			y: cursor.getY()
		};
	}
	/**
	* Cancels the current targeting session. Nothing was ever committed via `setDecidedAction`,
	* so no cooldown or cast time is consumed by backing out.
	*/
	static cancel() {
		if (!this.isActive()) return;
		this.#endSession();
	}
	/**
	* Tears down the active session and restores normal JABS flow.
	*/
	static #endSession() {
		this._session = null;
		this._cursor = null;
		this._sentinel.reset();
	}
};

//#endregion
//#region src/plugins/abs/ext/targeting/managers/JABS_AiManager.js
/**
* Extends {@link JABS_AiManager.canUpdate}.<br/>
* Also blocks AI decision-making while a targeting session is active, mirroring the soft-pause
* the quick menu gets via `absPause` (see {@link JABS_TargetingManager} for why this doesn't
* reuse that flag directly).
*/
J.ABS.EXT.TARGETING.Aliased.JABS_AiManager.set("canUpdate", JABS_AiManager.canUpdate);
JABS_AiManager.canUpdate = function() {
	if (JABS_TargetingManager.isActive()) return false;
	return J.ABS.EXT.TARGETING.Aliased.JABS_AiManager.get("canUpdate").call(this);
};

//#endregion
//#region src/plugins/abs/ext/targeting/managers/JABS_Engine.js
/**
* Extends {@link JABS_Engine#canUpdateInput}.<br/>
* Also blocks JABS input processing while a targeting session is active. This does not affect
* the targeting session's own confirm/cancel polling, which happens independently via
* {@link JABS_TargetingManager.update}.
*/
J.ABS.EXT.TARGETING.Aliased.JABS_Engine.set("canUpdateInput", JABS_Engine.prototype.canUpdateInput);
JABS_Engine.prototype.canUpdateInput = function() {
	if (JABS_TargetingManager.isActive()) return false;
	return J.ABS.EXT.TARGETING.Aliased.JABS_Engine.get("canUpdateInput").call(this);
};

//#endregion
//#region src/plugins/abs/ext/targeting/models/JABS_InputAdapter.js
/**
* Extends {@link JABS_InputAdapter.performMainhandAction}.<br/>
* Diverts `<targeted>` skills into a targeting session instead of committing immediately.
* Replicates the same non-`getAttackData` gates the original privately enforces, since those
* private checks can't be called directly from here.
*/
J.ABS.EXT.TARGETING.Aliased.JABS_InputAdapter.set("performMainhandAction", JABS_InputAdapter.performMainhandAction);
JABS_InputAdapter.performMainhandAction = function(jabsBattler) {
	if ($gameMap.hasInteractableEventInFront(jabsBattler) || !jabsBattler.canBattlerUseAttacks() || !jabsBattler.isSkillTypeCooldownReady(JABS_Button.Mainhand) || jabsBattler.isCastingOrChanneling()) {
		J.ABS.EXT.TARGETING.Aliased.JABS_InputAdapter.get("performMainhandAction").call(this, jabsBattler);
		return;
	}
	const actions = JABS_TargetingManager.peekTargetedActions(jabsBattler, JABS_Button.Mainhand);
	if (actions.length === 0) {
		J.ABS.EXT.TARGETING.Aliased.JABS_InputAdapter.get("performMainhandAction").call(this, jabsBattler);
		return;
	}
	JABS_TargetingManager.beginTargeting(jabsBattler, actions, (committedActions) => {
		committedActions.forEach((action) => action.setCooldownType(JABS_Button.Mainhand));
		jabsBattler.setDecidedAction(committedActions);
		jabsBattler.setCastCountdown(committedActions[0].getCastTime());
		jabsBattler.resetComboData(JABS_Button.Mainhand);
	});
};
/**
* Extends {@link JABS_InputAdapter.performOffhandAction}.<br/>
* Diverts `<targeted>` skills into a targeting session instead of committing immediately.
*/
J.ABS.EXT.TARGETING.Aliased.JABS_InputAdapter.set("performOffhandAction", JABS_InputAdapter.performOffhandAction);
JABS_InputAdapter.performOffhandAction = function(jabsBattler) {
	if ($gameMap.hasInteractableEventInFront(jabsBattler) || !jabsBattler.canBattlerUseAttacks() || !jabsBattler.isSkillTypeCooldownReady(JABS_Button.Offhand) || jabsBattler.isCastingOrChanneling()) {
		J.ABS.EXT.TARGETING.Aliased.JABS_InputAdapter.get("performOffhandAction").call(this, jabsBattler);
		return;
	}
	const actions = JABS_TargetingManager.peekTargetedActions(jabsBattler, JABS_Button.Offhand);
	if (actions.length === 0) {
		J.ABS.EXT.TARGETING.Aliased.JABS_InputAdapter.get("performOffhandAction").call(this, jabsBattler);
		return;
	}
	JABS_TargetingManager.beginTargeting(jabsBattler, actions, (committedActions) => {
		committedActions.forEach((action) => action.setCooldownType(JABS_Button.Offhand));
		jabsBattler.setDecidedAction(committedActions);
		jabsBattler.setCastCountdown(committedActions[0].getCastTime());
		jabsBattler.resetComboData(JABS_Button.Offhand);
	});
};
/**
* Extends {@link JABS_InputAdapter.performCombatAction}.<br/>
* Diverts `<targeted>` skills into a targeting session instead of committing immediately.
*/
J.ABS.EXT.TARGETING.Aliased.JABS_InputAdapter.set("performCombatAction", JABS_InputAdapter.performCombatAction);
JABS_InputAdapter.performCombatAction = function(slot, jabsBattler) {
	if (!jabsBattler.canBattlerUseSkills() || jabsBattler.getBattler().getSkillSlot(slot).isEmpty() || !jabsBattler.isSkillTypeCooldownReady(slot) || jabsBattler.isCastingOrChanneling()) {
		J.ABS.EXT.TARGETING.Aliased.JABS_InputAdapter.get("performCombatAction").call(this, slot, jabsBattler);
		return;
	}
	const actions = JABS_TargetingManager.peekTargetedActions(jabsBattler, slot);
	if (actions.length === 0) {
		J.ABS.EXT.TARGETING.Aliased.JABS_InputAdapter.get("performCombatAction").call(this, slot, jabsBattler);
		return;
	}
	JABS_TargetingManager.beginTargeting(jabsBattler, actions, (committedActions) => {
		jabsBattler.setDecidedAction(committedActions);
		jabsBattler.setCastCountdown(committedActions[0].getCastTime());
	});
};

//#endregion
//#region src/plugins/abs/ext/targeting/models/JABS_Battler.js
/**
* Extends {@link JABS_Battler#canUpdateEngagement}.<br/>
* Also blocks new engagement/aggro while a targeting session is active, so nothing can freshly
* aggro onto the player mid-aim.
*/
J.ABS.EXT.TARGETING.Aliased.JABS_Battler.set("canUpdateEngagement", JABS_Battler.prototype.canUpdateEngagement);
JABS_Battler.prototype.canUpdateEngagement = function() {
	if (JABS_TargetingManager.isActive()) return false;
	return J.ABS.EXT.TARGETING.Aliased.JABS_Battler.get("canUpdateEngagement").call(this);
};

//#endregion
//#region src/plugins/abs/ext/targeting/objects/Game_Player.js
/**
* Extends {@link Game_Player#canMove}.<br/>
* Also blocks player movement while a targeting session is active.
*/
J.ABS.EXT.TARGETING.Aliased.Game_Player.set("canMove", Game_Player.prototype.canMove);
Game_Player.prototype.canMove = function() {
	if (JABS_TargetingManager.isActive()) return false;
	return J.ABS.EXT.TARGETING.Aliased.Game_Player.get("canMove").call(this);
};

//#endregion
//#region src/plugins/abs/ext/targeting/windows/Window_TargetingList.js
/**
* A passive list window showing every eligible battler in a cycle-select targeting session.<br/>
* Purely a visual aid — it never processes its own input/navigation. The manager drives which
* entry is highlighted by calling {@link #select} whenever the cycle selection changes.
*/
var Window_TargetingList = class Window_TargetingList extends Window_Command {
	/**
	* How many font sizes smaller than normal the list entries render at.
	* @type {number}
	*/
	static FontSizeDelta = -8;
	/**
	* Constructor.
	* @param {Rectangle} rect The shape of this window.
	*/
	constructor(rect) {
		super(rect);
		this.deactivate();
	}
	/**
	* Rebuilds the list from the given candidate battlers.
	* @param {JABS_Battler[]} candidates The eligible battlers to list.
	*/
	setCandidates(candidates) {
		this._candidates = candidates;
		this.refresh();
	}
	/**
	* Extends {@link Window_Command#makeCommandList}.<br/>
	* Builds one command per eligible battler, rendered smaller than normal.
	*/
	makeCommandList() {
		if (!this._candidates) return;
		this._candidates.forEach((candidate) => {
			const name = this.modFontSizeForText(Window_TargetingList.FontSizeDelta, candidate.battlerName());
			this.addCommand(name, candidate.getUuid(), true, candidate);
		});
	}
};

//#endregion
//#region src/plugins/abs/ext/targeting/sprites/Sprite_TargetingCursor.js
/**
* The reticle sprite tracking the current aim point/selected battler while a targeting session
* is active. Defaults to the stock RMMZ window-scroll arrow (light-blue gradient triangle,
* points down) via the `reticleImage` plugin parameter.<br/>
* Purely decorative: in cycle mode it hovers above the targeted battler (there's a body to
* hover over); in free-roam mode there's no battler at the origin, just an aim point, so it
* points exactly at that point instead — the AoE preview shape is the primary "where am I
* aiming" signal there. Either way it does NOT track the corrected origin the AoE preview/
* containment test use (see {@link JABS_TargetingSentinelAction#screenY}) — that correction
* exists to make the *hitbox math* symmetric, not to say where a hover indicator should sit.
*/
var Sprite_TargetingCursor = class Sprite_TargetingCursor extends Sprite {
	/**
	* How many pixels above the target's ground position the reticle hovers, before bobbing.
	* @type {number}
	*/
	static HoverHeightPx = 48;
	/**
	* The amplitude, in pixels, of the idle bobbing animation.
	* @type {number}
	*/
	static BobAmplitudePx = 3;
	/**
	* How fast the idle bobbing animation cycles, in radians per frame.
	* @type {number}
	*/
	static BobSpeed = .05;
	/**
	* Constructor.
	*/
	constructor() {
		super();
		this.initMembers();
	}
	/**
	* Initializes this sprite's bitmap and anchor.
	*/
	initMembers() {
		const filename = J.ABS.EXT.TARGETING.Metadata.reticleImage;
		this.bitmap = ImageManager.loadSystem(filename);
		this.anchor.x = .5;
		this.anchor.y = 1;
	}
	/**
	* Extends {@link Sprite#update}.<br/>
	* Hovers above the ground position currently being aimed at, with a gentle bob.
	*/
	update() {
		super.update();
		if (!JABS_TargetingManager.isActive()) {
			this.visible = false;
			return;
		}
		const hoverHeight = JABS_TargetingManager.getCursor().isCycleMode() ? Sprite_TargetingCursor.HoverHeightPx : 0;
		this.visible = true;
		const sentinel = JABS_TargetingManager.getSentinel();
		const ground = sentinel.groundScreenPosition();
		const bob = Math.sin(Graphics.frameCount * Sprite_TargetingCursor.BobSpeed) * Sprite_TargetingCursor.BobAmplitudePx;
		this.x = ground.x;
		this.y = ground.y - hoverHeight + bob;
	}
};

//#endregion
//#region src/plugins/abs/ext/targeting/sprites/Spriteset_Map.js
/**
* Extends {@link Spriteset_Map#createLowerLayer}.<br/>
* Also creates the targeting reticle sprite and the tracking dictionary for AoE-highlight
* outline sprites.
*/
J.ABS.EXT.TARGETING.Aliased.Spriteset_Map.set("createLowerLayer", Spriteset_Map.prototype.createLowerLayer);
Spriteset_Map.prototype.createLowerLayer = function() {
	J.ABS.EXT.TARGETING.Aliased.Spriteset_Map.get("createLowerLayer").call(this);
	this.createTargetingOverlay();
};
/**
* Creates the targeting reticle sprite and AoE-highlight tracking dictionary.
*/
Spriteset_Map.prototype.createTargetingOverlay = function() {
	this._j ||= {};
	this._j._targeting ||= {};
	this._j._targeting._reticle = new Sprite_TargetingCursor();
	this.addChild(this._j._targeting._reticle);
	this._j._targeting._highlightSprites = {};
	this._j._targeting._previewPulse = null;
	this._j._targeting._rangeRing = null;
};
/**
* Extends {@link Spriteset_Map#update}.<br/>
* Drives the AoE hitbox preview and per-battler highlight outlines while a free-roam targeting
* session with an AoE radius is active.
*/
J.ABS.EXT.TARGETING.Aliased.Spriteset_Map.set("update", Spriteset_Map.prototype.update);
Spriteset_Map.prototype.update = function() {
	J.ABS.EXT.TARGETING.Aliased.Spriteset_Map.get("update").call(this);
	this.updateTargetingAoePreview();
	this.updateTargetingRangeRing();
};
/**
* Updates the max-range ring, a faint-filled but clearly-outlined circle centered on the caster
* showing how far the cursor may travel/search — active in either mode, styled distinctly from
* the AoE preview so the two are never confused for one another.
*/
Spriteset_Map.prototype.updateTargetingRangeRing = function() {
	if (!JABS_TargetingManager.isActive()) {
		this.hideTargetingRangeRing();
		return;
	}
	this.showTargetingRangeRing(JABS_TargetingManager.getCursor());
};
/**
* Hides the max-range ring, if one was ever created.
*/
Spriteset_Map.prototype.hideTargetingRangeRing = function() {
	const ring = this._j._targeting._rangeRing;
	if (ring) {
		ring.visible = false;
	}
};
/**
* Positions/updates the reusable max-range ring against the caster's current position.
* @param {JABS_TargetingCursor} cursor The active aiming cursor.
*/
Spriteset_Map.prototype.showTargetingRangeRing = function(cursor) {
	let ring = this._j._targeting._rangeRing;
	if (!ring) {
		ring = new Sprite_HitboxPulse();
		JABS_HitboxPulseManager.getLayer().addChild(ring);
		this._j._targeting._rangeRing = ring;
	}
	const options = JABS_HitboxPulseOptions.from({
		shape: J.ABS.Shapes.Circle,
		range: cursor.getRange(),
		sustained: true,
		duration: 999999,
		startAlpha: 1,
		endAlpha: 1,
		scaleStart: 1,
		scaleEnd: 1,
		lineColor: 16766720,
		lineAlpha: 1,
		lineWidth: 3,
		fillAlpha: .05
	}, JABS_HitboxPulseManager.getDefaultOptions());
	const casterCharacter = cursor.getCaster().getCharacter();
	ring.visible = true;
	ring.reset();
	ring.setup(options.toPlain());
	ring.setWorldPosition(casterCharacter.screenX(), casterCharacter.screenY());
};
/**
* Updates the AoE hitbox preview pulse and the per-battler highlight outlines.<br/>
* Applicable in either mode whenever the skill has an AoE radius (`<radius:N>`) — a direct
* (cycle-mode) skill can just as easily resolve to one chosen target and still be an AoE
* centered on them, not only a non-direct (free-roam) placed skill.
*/
Spriteset_Map.prototype.updateTargetingAoePreview = function() {
	const cursor = JABS_TargetingManager.getCursor();
	const sentinel = JABS_TargetingManager.getSentinel();
	const action = sentinel.getJabsAction();
	const shouldPreview = JABS_TargetingManager.isActive() && action.getRange() !== null;
	if (!shouldPreview) {
		this.hideTargetingAoePreview();
		return;
	}
	this.showTargetingAoePreviewPulse(cursor, sentinel, action);
	this.refreshTargetingHighlightSprites(cursor, sentinel, action);
};
/**
* Hides/clears the AoE preview pulse and purges all highlight sprites.
*/
Spriteset_Map.prototype.hideTargetingAoePreview = function() {
	const pulse = this._j._targeting._previewPulse;
	if (pulse) {
		pulse.visible = false;
	}
	this.purgeTargetingHighlightSprites([]);
};
/**
* Positions/updates the reusable AoE preview pulse against the sentinel's current position.<br/>
* Styled more boldly in free-roam mode, where the reticle is absent and this shape is the
* primary "where am I aiming" signal; cycle mode keeps the subtler original style, since the
* reticle and list window are already the primary indicators there and this is just a
* secondary "here's what else gets caught" preview.
* @param {JABS_TargetingCursor} cursor The active aiming cursor.
* @param {JABS_TargetingSentinelAction} sentinel The sentinel standing in for the cursor.
* @param {JABS_Action} action The real action being aimed.
*/
Spriteset_Map.prototype.showTargetingAoePreviewPulse = function(cursor, sentinel, action) {
	let pulse = this._j._targeting._previewPulse;
	if (!pulse) {
		pulse = new Sprite_HitboxPulse();
		JABS_HitboxPulseManager.getLayer().addChild(pulse);
		this._j._targeting._previewPulse = pulse;
	}
	const degrees = $jabsEngine.getActionDegrees(sentinel) ?? 180;
	const thickness = $jabsEngine.getActionThicknessTiles(sentinel) ?? 1;
	const scopedColor = action.isSupportAction() ? 3066993 : 16737860;
	const style = cursor.isFreeRoamMode() ? {
		startAlpha: .55,
		endAlpha: .55,
		fillColor: scopedColor,
		lineColor: scopedColor,
		lineAlpha: 1,
		lineWidth: 3
	} : {
		startAlpha: .2,
		endAlpha: .2,
		fillColor: scopedColor,
		lineColor: scopedColor
	};
	const options = JABS_HitboxPulseOptions.from({
		shape: action.getShape(),
		range: action.getRange(),
		facing: action.direction(),
		degrees,
		thickness,
		sustained: true,
		duration: 999999,
		scaleStart: 1,
		scaleEnd: 1,
		...style
	}, JABS_HitboxPulseManager.getDefaultOptions());
	const origin = JABS_Engine.getActionOriginPixels(sentinel);
	pulse.visible = true;
	pulse.reset();
	pulse.setup(options.toPlain());
	pulse.setWorldPosition(origin.x, origin.y);
	pulse.setRotation(JABS_HitboxPulseManager.directionToRadians(action.direction()));
};
/**
* Builds/refreshes/purges highlight outline sprites for every battler currently inside the
* previewed AoE shape, reusing the same collision math real hit-resolution uses.<br/>
* Scoped the same way cycle-mode candidate gathering is (see
* {@link JABS_TargetingManager.gatherScopedCandidates}) — an enemy-scope AoE can only actually
* hit enemies, so it must not highlight allies/self as "about to be hit," and vice versa for an
* ally-scope skill.
* @param {JABS_TargetingCursor} cursor The active aiming cursor.
* @param {JABS_TargetingSentinelAction} sentinel The sentinel standing in for the cursor.
* @param {JABS_Action} action The real action being aimed.
*/
Spriteset_Map.prototype.refreshTargetingHighlightSprites = function(cursor, sentinel, action) {
	const caster = cursor.getCaster();
	const shape = action.getShape();
	const range = action.getRange();
	const facing = action.direction();
	const searchRange = cursor.getRange() + range;
	const candidates = JABS_TargetingManager.gatherScopedCandidates(caster, action, searchRange);
	const caught = candidates.filter((battler) => $jabsEngine.isTargetWithinRange(facing, battler.getCharacter(), sentinel, range, shape));
	const colliding = !action.isSupportAction();
	const dict = this._j._targeting._highlightSprites;
	const layer = this.getJabsHitboxLayer();
	const tw = $gameMap.tileWidth();
	const th = $gameMap.tileHeight();
	caught.forEach((battler) => {
		const key = battler.getUuid();
		let sprite = dict[key];
		if (!sprite) {
			sprite = this.createBattlerHitboxSprite({
				key,
				type: "battler",
				source: battler.getCharacter()
			});
			layer.addChild(sprite);
			dict[key] = sprite;
		}
		const character = battler.getCharacter();
		sprite.x = character.screenX();
		sprite.y = character.screenY();
		const aabb = JABS_Engine.getBattlerAabbModel(character);
		this.drawBattlerHitboxInto(sprite, "battler", tw, th, colliding, aabb);
	});
	this.purgeTargetingHighlightSprites(caught);
};
/**
* Removes highlight sprites for battlers no longer caught in the previewed AoE shape.
* @param {JABS_Battler[]} stillCaught The battlers still caught this frame.
*/
Spriteset_Map.prototype.purgeTargetingHighlightSprites = function(stillCaught) {
	const dict = this._j._targeting._highlightSprites;
	const layer = this.getJabsHitboxLayer();
	const activeKeys = new Set(stillCaught.map((battler) => battler.getUuid()));
	Object.keys(dict).forEach((key) => {
		if (activeKeys.has(key)) return;
		const sprite = dict[key];
		if (sprite.parent === layer) {
			layer.removeChild(sprite);
		}
		delete dict[key];
	});
};

//#endregion
//#region src/plugins/abs/ext/targeting/scenes/Scene_Map.js
/**
* Extends {@link Scene_Map#createAllWindows}.<br/>
* Also creates the passive cycle-select list window, hidden until a cycle-mode session begins.
*/
J.ABS.EXT.TARGETING.Aliased.Scene_Map.set("createAllWindows", Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function() {
	J.ABS.EXT.TARGETING.Aliased.Scene_Map.get("createAllWindows").call(this);
	this.createTargetingListWindow();
};
/**
* Creates the passive list window used by cycle-mode targeting sessions.
*/
Scene_Map.prototype.createTargetingListWindow = function() {
	const rect = this.targetingListWindowRect();
	this._targetingListWindow = new Window_TargetingList(rect);
	this._targetingListWindow.hide();
	this.addWindow(this._targetingListWindow);
};
/**
* Determines the shape of the targeting list window. Position is configurable via plugin
* parameters (defaulting to vertically centered); size is fixed.
* @returns {Rectangle}
*/
Scene_Map.prototype.targetingListWindowRect = function() {
	const width = 240;
	const height = (Graphics.boxHeight - 120) / 2;
	const { targetingListWindowX: x, targetingListWindowY: y } = J.ABS.EXT.TARGETING.Metadata;
	return new Rectangle(x, y, width, height);
};
/**
* Extends {@link Scene_Map#update}.<br/>
* Ticks the targeting manager, then keeps the cycle-mode list window in sync.
*/
J.ABS.EXT.TARGETING.Aliased.Scene_Map.set("update", Scene_Map.prototype.update);
Scene_Map.prototype.update = function() {
	J.ABS.EXT.TARGETING.Aliased.Scene_Map.get("update").call(this);
	const wasActive = this._targetingWasActive === true;
	JABS_TargetingManager.update();
	this.updateTargetingListWindow(wasActive);
};
/**
* Shows/hides/populates the cycle-mode list window based on the targeting manager's state.
* @param {boolean} wasActive Whether a session was active before this frame's tick.
*/
Scene_Map.prototype.updateTargetingListWindow = function(wasActive) {
	const isActive = JABS_TargetingManager.isActive();
	const cursor = JABS_TargetingManager.getCursor();
	const isCycleMode = isActive && cursor.isCycleMode();
	if (isCycleMode) {
		if (!wasActive) {
			this._targetingListWindow.setCandidates(cursor.getCandidates());
			this._targetingListWindow.show();
		}
		this._targetingListWindow.select(cursor.getSelectedIndex());
	} else if (this._targetingListWindow.visible) {
		this._targetingListWindow.hide();
	}
	this._targetingWasActive = isActive;
};

//#endregion
//# sourceMappingURL=J-ABS-Targeting.js.map