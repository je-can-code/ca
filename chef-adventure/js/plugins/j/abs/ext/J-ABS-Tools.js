//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.3 TOOLS] Enable new tool-like tags for use with skills.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin enables new tags that give tool-like functionality to skills.
 *
 * Enables:
 * - NEW! added "gap close" aka "hookshot" functionality.
 *
 * TODO:
 * - gloves for carrying events.
 *
 * This plugin requires JABS.
 * ============================================================================
 * GAP CLOSING:
 * Have you ever wanted to be able to use a skill and gap close to a target
 * without having to take the painstaking effort of manually moving to the
 * given target? Well now you can! By applying the appropriate tags to various
 * database locations, you can enable/disable gap closing for your battlers!
 *
 * HEADS UP:
 * There are a number of tags required to make this work, so this will deviate
 * from normal tag explanations a bit.
 *
 * TAG USAGE:
 * (primarily)
 * - Events
 * - Skills
 * - Enemies
 *
 * (secondarily)
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - States
 *
 * TAG FORMAT:
 *  <gapClose:key>
 * This tag is required on skills that you want to be "gap closing skills".
 * The key must match the key on the target for gap closing to occur.
 *
 *  <gapCloseTarget:key>
 * This tag is required on the things you want to be "gap closable", such as
 * enemies or on events representing enemies. This tag can also be applied to
 * things that a battler can be affected by, such as equipment or states.
 * The key must match the key on the skill for gap closing to occur.
 *
 * KEYS:
 * Keys are arbitrary strings (word characters only). They act as a namespace
 * so that different gap-close mechanics cannot accidentally cross-trigger.
 * For example, a hookshot skill with <gapClose:hookshot> will never warp the
 * player to an enemy bearing <gapCloseTarget:pierce>, and vice versa.
 *
 * EXAMPLE:
 *  <gapClose:hookshot> on skill ID 25.
 *  <gapCloseTarget:hookshot> on an event representing a grapple anchor.
 * Using skill 25 against that event will pull the player to it.
 *
 *  <gapClose:pierce> on skill ID 34 (spear pin).
 *  <gapCloseTarget:pierce> on state ID 4 (pinned state).
 * An enemy hit by skill 34 receives state 4.
 * Using skill 34 again against that pinned enemy will pull the player to it.
 * Hookshot anchors are unaffected because their key does not match.
 *
 * GAP CLOSE ANY:
 *  <gapCloseAny>
 * Put this on a skill instead of <gapClose:key> to skip key-matching
 * entirely. A skill with this tag gap closes to whatever single target its
 * hitbox connects with, no matter what (or whether) that target carries a
 * <gapCloseTarget:key> of its own. Intended for melee gap-closers that just
 * need to close distance to whatever they hit — no pre-tagging required.
 *
 * BLOCK GAP CLOSE:
 *  <blockGapClose>
 * Put this on an enemy, state, or equipment to make that battler immune to
 * ALL gap closing, including <gapCloseAny> skills. This is the only way to
 * opt a target out of an "any" gapcloser — useful for bosses, flying units,
 * or holding a hookshot-only chasm as a genuine traversal gate instead of
 * letting a combat gapcloser trivialize it.
 *
 * GAP CLOSE MODE:
 *  <gapCloseMode:MODE>
 * Put this on the gap-closing skill to control HOW the caster travels to
 * the resolved destination. MODE is one of: blink (instant teleport), jump
 * (arcing hop- the default when omitted), or travel (steps tile-by-tile,
 * respecting collision along the way). All modes bypass terrain by default
 * unless the skill also carries <respectTerrain>.
 *
 * GAP CLOSE POSITION:
 *  <gapClosePosition:POSITION>
 * Put this on the gap-closing skill to control WHERE relative to the target
 * the caster lands. POSITION is one of: infront (adjacent, facing the
 * target), behind (adjacent, on the target's far side), or same (directly
 * on the target's tile- the default when omitted).
 *
 * RESPECT TERRAIN:
 *  <respectTerrain>
 * Put this on the gap-closing skill to cancel the gap close entirely if the
 * caster cannot legally reach the computed destination tile (blocked by
 * impassible terrain). Without this tag, gap close bypasses terrain checks
 * the way all gap-close modes normally do.
 *
 * ON GAP CLOSE END:
 *  <thisOnGapCloseEnd:[SKILL_IDS...]>
 * Put this on the gap-closing skill itself to fire the listed skill ids
 * immediately once the caster arrives at the destination- useful for a
 * follow-up strike the instant a hookshot connects.
 *
 *  <onGapCloseEnd:[SKILL_IDS...]>
 * Put this on any of the caster's note sources (actor, class, weapon,
 * armor, state) to fire the listed skill ids on every gap close this
 * battler performs, regardless of which skill triggered it. IDs from both
 * this tag and <thisOnGapCloseEnd> are merged and de-duplicated before
 * firing.
 *
 * ============================================================================
 * PULL FORWARD:
 * The inverse of gap close: instead of the caster traveling to the target,
 * the target is pulled toward the caster. Unlike gap close, this is NOT
 * key-gated- it behaves like knockback in reverse, and any target without
 * enough <knockbackResist> to fully negate it gets pulled.
 *
 * If a skill carries both a pull-forward tag and a gap-close tag, the
 * target is pulled first, then the caster gap-closes to wherever the
 * target ends up- the two meet partway instead of gap-close eating the
 * entire distance.
 *
 * TAG USAGE:
 * - Skills
 *
 * TAG FORMAT:
 *  <pullForward:MAGNITUDE>
 * Where MAGNITUDE is the number of tiles to pull the target toward the
 * caster.
 *
 * TAG EXAMPLES:
 *  <pullForward:3>
 * On hit, this skill pulls the target 3 tiles toward the caster (before any
 * knockbackResist reduction).
 * ============================================================================
 * GRAB AND THROW:
 * A separate, plugin-parameter-only feature (no notetags of its own) for
 * globally toggling grab-and-throw behavior and whether throw direction is
 * always fixed. See the plugin parameters below.
 * ============================================================================
 * CHANGELOG:
 * - 1.1.0
 *    Gap close tags now require a key: <gapClose:key> / <gapCloseTarget:key>.
 *    Keys must match for gap closing to occur — no cross-mechanic bypass.
 *    Removed canGapCloseByDefault plugin parameter.
 * - 1.0.3
 *    Raised minimum J-ABS version requirement to 4.7.0.
 * - 1.0.2
 *    Raised minimum J-ABS version requirement to 4.6.0.
 * - 1.0.1
 *    Consumed `RPGManager` update.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 * @param grabThrowConfigs
 * @text GRAB AND THROW DEFAULTS
 *
 * @param grabThrowEnabled
 * @parent grabThrowConfigs
 * @type boolean
 * @text Grab and Throw Enabled
 * @desc True if grab and throw functionality is enabled globally by default.
 * @default true
 *
 * @param directionFixAlways
 * @parent grabThrowConfigs
 * @type boolean
 * @text Always Fix Throw Direction
 * @desc True if the throw direction is always fixed regardless of input.
 * @default false
 *
 */

//#region src/plugins/abs/ext/tools/_metadata/_pluginMetadata.js
var J_ToolsPluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br/>
	* Maps gap-close and grab/throw defaults from plugin parameters.
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
		* Whether or not grab and throw functionality is enabled globally by default.
		* @type {boolean}
		*/
		this.GrabThrowEnabled = this.parsedPluginParameters["grabThrowEnabled"] !== "false";
		/**
		* Whether or not the throw direction is always fixed regardless of input.
		* @type {boolean}
		*/
		this.DirectionFixAlways = this.parsedPluginParameters["directionFixAlways"] === "true";
	}
};

//#endregion
//#region src/plugins/abs/ext/tools/_metadata/initialization.js
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.0.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (!hasBaseRequirement) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
	const requiredJabsVersion = "4.6.0";
	const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.version.version(), requiredJabsVersion);
	if (!hasJabsRequirement) {
		throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.ABS.EXT.TOOLS = {};
/**
* The metadata associated with this plugin.
*/
J.ABS.EXT.TOOLS.Metadata = new J_ToolsPluginMetadata("J-ABS-Tools", "1.0.3");
/**
* A collection of all aliased methods for this plugin.
*/
J.ABS.EXT.TOOLS.Aliased = {
	Game_Character: new Map(),
	Game_CharacterBase: new Map(),
	Game_Event: new Map(),
	Game_Follower: new Map(),
	Game_Player: new Map(),
	Game_System: new Map(),
	JABS_Engine: new Map(),
	JABS_Battler: new Map()
};
/**
* All regular expressions used by this plugin.
*/
J.ABS.EXT.TOOLS.RegExp = {
	GapClose: /<gapClose:(\w+)>/i,
	GapCloseAny: /<gapCloseAny>/i,
	GapCloseTarget: /<gapCloseTarget:(\w+)>/i,
	GapCloseMode: /<gapCloseMode:(blink|jump|travel)>/i,
	GapClosePosition: /<gapClosePosition:(infront|behind|same)>/i,
	GapCloseEndThis: /<thisOnGapCloseEnd:[ ]?(\[[\d, ]+])>/i,
	GapCloseEnd: /<onGapCloseEnd:[ ]?(\[[\d, ]+])>/i,
	BlockGapClose: /<blockGapClose>/i,
	RespectTerrain: /<respectTerrain>/i,
	PullForward: /<pullForward:[ ]?(\d+)>/i
};
/**
* All types of gap close modes that are available to pick from.
* The mode is the means of which the battler will travel the to the destination.
* All modes bypass terrain.
* If they should not bypass terrain, consider eventing instead.
*/
J.ABS.EXT.TOOLS.GapCloseModes = {
	/**
	* Blinks instantly to the target.
	*/
	Blink: "blink",
	/**
	* Jumps to the target.
	*/
	Jump: "jump",
	/**
	* Glides to the target- same destination as a jump, but renders as a flat ground-level
	* slide instead of a parabolic hop.
	*/
	Travel: "travel"
};
/**
* All types of gap close positions that are available to pick from.
* The position is ultimately the destination, defined as where the battler
* should end up when they are done gap closing.
*/
J.ABS.EXT.TOOLS.GapClosePositions = {
	/**
	* Infront translates to being on the same side of the target as the gap-closing
	* battler was when they started the gap closing process, and does not consider the
	* facing of the target battler considering that can change wildly.
	*/
	Infront: "infront",
	/**
	* Behind translates to being on the opposite side of the target as the gap-closing
	* battler was when they started the gap closing process, and does not consider the
	* facing of the target battler considering that can change wildly.
	*/
	Behind: "behind",
	/**
	* Same translates to arriving at the same coordinates as the target is, meaning the
	* gap-closing battler will be ontop of the target.
	*/
	Same: "same"
};

//#endregion
//#region src/plugins/abs/ext/tools/_models/JABS_Battler.js
/**
* Initializes the properties of this battler that are not related to anything in particular.
*/
J.ABS.EXT.TOOLS.Aliased.JABS_Battler.set("initGeneralInfo", JABS_Battler.prototype.initGeneralInfo);
JABS_Battler.prototype.initGeneralInfo = function() {
	J.ABS.EXT.TOOLS.Aliased.JABS_Battler.get("initGeneralInfo").call(this);
	/**
	* The counter for how long this battler is waiting.
	* @type {boolean}
	*/
	this._gapClosing = false;
	/**
	* The destination coordinates of where this battler is gap closing to.
	* @type {[number, number]}
	*/
	this._gapCloseDestination = [0, 0];
	/**
	* The ID of the skill that initiated the current gap close.
	* Used at landing to read <thisOnGapCloseEnd> from that skill.
	* @type {number}
	*/
	this._gapCloseSourceSkillId = 0;
};
/**
* Begins the process of gap closing.
*/
JABS_Battler.prototype.beginGapClosing = function() {
	this._gapClosing = true;
};
/**
* Ends the process of gap closing.
*/
JABS_Battler.prototype.endGapClosing = function() {
	this._gapClosing = false;
};
/**
* Gets whether or not this battler is currently gap closing.
* @returns {boolean}
*/
JABS_Battler.prototype.isGapClosing = function() {
	return this._gapClosing;
};
/**
* Gets the destination coordinates of where this battler is gap closing to.
* @returns {[number,number]}
*/
JABS_Battler.prototype.gapCloseDestination = function() {
	return this._gapCloseDestination;
};
/**
* Sets the destination coordinates for this battler's gap close.
* @param {[number, number]} destination The destination x:y coordinates.
*/
JABS_Battler.prototype.setGapCloseDestination = function(destination) {
	this._gapCloseDestination = destination;
};
/**
* Determines whether or not we have a valid gap close destination.
* @returns {boolean} True if we have a valid destination, false otherwise.
*/
JABS_Battler.prototype.hasGapCloseDestination = function() {
	const [goalX, goalY] = this.gapCloseDestination();
	if (goalX === 0 && goalY === 0) return false;
	return true;
};
/**
* Clears the destination coordinates for gap closing.
*/
JABS_Battler.prototype.clearGapCloseDestination = function() {
	this._gapCloseDestination = [0, 0];
};
/**
* Extends {@link JABS_Battler.update}.<br/>
* Also updates the gap closing process.
*/
J.ABS.EXT.TOOLS.Aliased.JABS_Battler.set("update", JABS_Battler.prototype.update);
JABS_Battler.prototype.update = function() {
	J.ABS.EXT.TOOLS.Aliased.JABS_Battler.get("update").call(this);
	this.updateGapClosing();
};
/**
* The update flow for managing gap closing.
*/
JABS_Battler.prototype.updateGapClosing = function() {
	if (this.isGapClosing()) {
		if (this.hasGapCloseDestination()) {
			if (this.hasReachedGapCloseDestination()) {
				this.clearGapCloseDestination();
				this.onGapCloseFinished();
				this.endGapClosing();
			}
		} else {
			this.clearGapCloseDestination();
			this.endGapClosing();
		}
	}
};
/**
* Gets the gap close target key for this battler, or null if it cannot be gap closed to.
* Checks the underlying battler's notes first, then the character's event comments if applicable.
* @returns {string|null} The gap close target key, or null if not present.
*/
JABS_Battler.prototype.isGapClosable = function() {
	const battler = this.getBattler();
	const battlerKey = battler.gapCloseKey();
	if (battlerKey !== null) return battlerKey;
	if (this.isEvent()) {
		const character = this.getCharacter();
		return character.gapCloseKey();
	}
	return null;
};
/**
* Executes a gap close to the target based on the provided action.
* @param {JABS_Action} action The JABS action containing the action data.
* @param {JABS_Battler} target The target having the action applied against.
*/
JABS_Battler.prototype.gapCloseToTarget = function(action, target) {
	if (this.isGapClosing()) return;
	let { jabsGapCloseMode, jabsGapClosePosition } = action.getBaseSkill();
	const { jabsRespectTerrain } = action.getBaseSkill();
	jabsGapClosePosition ??= J.ABS.EXT.TOOLS.GapClosePositions.Same;
	const [x, y] = this.determineGapCloseCoordinates(target, jabsGapClosePosition);
	const casterCharacter = this.getCharacter();
	if (jabsRespectTerrain && !casterCharacter.canReachTileDelta(x, y)) return;
	this.beginGapClosing();
	this._gapCloseSourceSkillId = action.getBaseSkill().id;
	this.setGapCloseDestination([this.getX() + x, this.getY() + y]);
	jabsGapCloseMode ??= J.ABS.EXT.TOOLS.GapCloseModes.Jump;
	switch (jabsGapCloseMode) {
		case J.ABS.EXT.TOOLS.GapCloseModes.Jump:
			casterCharacter.jump(x, y);
			break;
		case J.ABS.EXT.TOOLS.GapCloseModes.Blink:
			casterCharacter.locate(casterCharacter.x + x, casterCharacter.y + y);
			break;
		case J.ABS.EXT.TOOLS.GapCloseModes.Travel:
			casterCharacter.glideTo(x, y);
			break;
	}
};
/**
* Fires when this battler has arrived at its gap close destination.
* Executes all skills collected by {@link resolveGapCloseEndSkillIds} as forced map actions.
*/
JABS_Battler.prototype.onGapCloseFinished = function() {
	const skillIds = this.resolveGapCloseEndSkillIds();
	if (skillIds.length === 0) return;
	skillIds.forEach((id) => $jabsEngine.forceMapAction(this, id));
};
/**
* Pulls this battler toward the caster- the inverse of gap close (the caster travels to the
* target) and the inverse of knockback (the target is shoved away from the caster). Called on
* the afflicted target, not the caster, since this battler is the one being displaced.
* @param {JABS_Action} action The JABS action containing the action data.
* @param {JABS_Battler} caster The battler being pulled toward.
*/
JABS_Battler.prototype.pullToCaster = function(action, caster) {
	if (this.getCharacter().isJumping()) return;
	const pullMagnitude = action.getBaseSkill().jabsPullForward;
	if (pullMagnitude === null) return;
	const resist = RPGManager.getSumFromAllNotesByRegex(this.getBattler().getAllNotes(), J.ABS.RegExp.KnockbackResist);
	if (resist >= 100) return;
	const effectiveMagnitude = pullMagnitude * ((100 - resist) / 100);
	const { unitX, unitY, maxPullDistance } = this.resolvePullVector(caster);
	const distance = Math.min(effectiveMagnitude, maxPullDistance);
	if (distance <= 0) return;
	const rawX = unitX * distance;
	const rawY = unitY * distance;
	const targetCharacter = this.getCharacter();
	let finalX = rawX;
	let finalY = rawY;
	if (!action.getBaseSkill().jabsIgnoreTerrain) {
		const horizontalDominant = Math.abs(rawX) >= Math.abs(rawY);
		let direction;
		if (horizontalDominant) {
			direction = rawX >= 0 ? J.ABS.Directions.RIGHT : J.ABS.Directions.LEFT;
		} else {
			direction = rawY >= 0 ? J.ABS.Directions.DOWN : J.ABS.Directions.UP;
		}
		const roundedDistance = Math.max(Math.abs(rawX), Math.abs(rawY));
		[finalX, finalY] = targetCharacter.walkInDirectionClamped(direction, roundedDistance);
	}
	targetCharacter.jump(finalX, finalY);
};
/**
* Resolves the unit vector and maximum safe travel distance for pulling this battler toward
* the caster. Mirrors the vector math in {@link determineGapCloseCoordinates}, but the roles
* are reversed- this battler is the mover, and the caster is the fixed goal point.
* @param {JABS_Battler} caster The battler being pulled toward.
* @returns {{unitX: number, unitY: number, maxPullDistance: number}}
*/
JABS_Battler.prototype.resolvePullVector = function(caster) {
	const casterCharacter = caster.getCharacter();
	const [x, y] = [this.getX(), this.getY()];
	const goalX = casterCharacter.deltaXFrom(x);
	const goalY = casterCharacter.deltaYFrom(y);
	const magnitude = Math.sqrt(goalX * goalX + goalY * goalY);
	const unitX = magnitude > 0 ? goalX / magnitude : 0;
	const unitY = magnitude > 0 ? goalY / magnitude : 0;
	const edgeOffset = casterCharacter.getEffectiveRadius() + this.getCharacter().getEffectiveRadius() + .05;
	const maxPullDistance = Math.max(0, magnitude - edgeOffset);
	return {
		unitX,
		unitY,
		maxPullDistance
	};
};
/**
* Collects all skill IDs that should fire when this battler's gap close lands.
* Merges IDs from <thisOnGapCloseEnd> on the initiating skill with IDs from
* <onGapCloseEnd> across all of the caster's note sources.
* @returns {number[]} The merged list of skill IDs to execute on landing.
*/
JABS_Battler.prototype.resolveGapCloseEndSkillIds = function() {
	const sourceSkill = $dataSkills[this._gapCloseSourceSkillId];
	const thisIds = sourceSkill ? sourceSkill.jabsThisOnGapCloseEnd : [];
	const battlerIds = this.getBattler().gapCloseEndSkillIds();
	return [...thisIds, ...battlerIds];
};
/**
* Determines the jump delta coordinates for the gap close based on the desired landing position.
* Returns a delta (not absolute coordinates) suitable for passing to {@link Game_Character.jump}.
* Axis convention: +X = right, -X = left, +Y = down, -Y = up.
* @param {JABS_Battler} target The target being gap closed to.
* @param {J.ABS.EXT.TOOLS.GapClosePositions} position The desired landing position relative to the target.
* @returns {[number, number]} The [dx, dy] delta to jump.
*/
JABS_Battler.prototype.determineGapCloseCoordinates = function(target, position) {
	const targetCharacter = target.getCharacter();
	const [x, y] = [this.getX(), this.getY()];
	const goalX = targetCharacter.deltaXFrom(x);
	const goalY = targetCharacter.deltaYFrom(y);
	const magnitude = Math.sqrt(goalX * goalX + goalY * goalY);
	const unitX = magnitude > 0 ? goalX / magnitude : 0;
	const unitY = magnitude > 0 ? goalY / magnitude : 0;
	const casterCharacter = this.getCharacter();
	const radiiSum = targetCharacter.getEffectiveRadius() + casterCharacter.getEffectiveRadius() + .05;
	const dominantAxisComponent = Math.max(Math.abs(unitX), Math.abs(unitY));
	const edgeOffset = dominantAxisComponent > 0 ? radiiSum / dominantAxisComponent : 0;
	if (position === J.ABS.EXT.TOOLS.GapClosePositions.Infront) {
		return [goalX - unitX * edgeOffset, goalY - unitY * edgeOffset];
	}
	if (position === J.ABS.EXT.TOOLS.GapClosePositions.Behind) {
		return [goalX + unitX * edgeOffset, goalY + unitY * edgeOffset];
	}
	return [goalX, goalY];
};
/**
* Determines if this battler has reached its gap close destination coordinates yet.
* @returns {boolean} True if it has reached the destination, false otherwise.
*/
JABS_Battler.prototype.hasReachedGapCloseDestination = function() {
	if (!this.hasGapCloseDestination()) {
		this.endGapClosing();
		return true;
	}
	const [goalX, goalY] = this.gapCloseDestination();
	const [actualX, actualY] = [this.getX(), this.getY()];
	const fuzzy = JABS_Battler.gapCloseWiggleRoom();
	const xOk = actualX >= goalX - fuzzy && actualX <= goalX + fuzzy;
	const yOk = actualY >= goalY - fuzzy && actualY <= goalY + fuzzy;
	const doneMoving = !this.getCharacter().isMoving();
	if (xOk && yOk && doneMoving) return true;
	return false;
};
/**
* A static value representing some degree of variance allowed for gap closing
* to a target destination.
* @returns {number} The amount of x:y coordinate wiggle room to identify as "close enough".
*/
JABS_Battler.gapCloseWiggleRoom = function() {
	return .5;
};

//#endregion
//#region src/plugins/abs/ext/tools/database/RPG_Skill.js
/**
* The gap close key for this skill, or null if this skill does not gap close.
* A skill gap closes only when its key matches the target's gap close target key.
* @type {string|null}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsGapClose", { get: function() {
	return RPGManager.getStringFromNoteByRegex(this, J.ABS.EXT.TOOLS.RegExp.GapClose, true);
} });
/**
* Whether this skill gap closes to whatever single target it hits, regardless of that target's
* own gap close key- skips the key-matching gate entirely. A target carrying <blockGapClose>
* still blocks this, so bosses/environmental holdouts can opt out even of an "any" gapcloser.
* @type {boolean}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsGapCloseAny", { get: function() {
	return RPGManager.checkForBooleanFromNoteByRegex(this, J.ABS.EXT.TOOLS.RegExp.GapCloseAny);
} });
/**
* The type of gap close mode this skill uses.
* If there is no gap close mode available, then it'll be null instead.
* @type {J.ABS.EXT.TOOLS.GapCloseModes|null}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsGapCloseMode", { get: function() {
	return RPGManager.getStringFromNoteByRegex(this, J.ABS.EXT.TOOLS.RegExp.GapCloseMode, true);
} });
/**
* The type of gap close position this skill uses.
* If there is no gap close position available, then it'll be null instead.
* @type {J.ABS.EXT.TOOLS.GapClosePositions|null}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsGapClosePosition", { get: function() {
	return RPGManager.getStringFromNoteByRegex(this, J.ABS.EXT.TOOLS.RegExp.GapClosePosition, true);
} });
/**
* The skill IDs to force-execute when this skill's gap close lands, sourced only from this skill's note.
* Returns an empty array if the tag is absent.
* @type {number[]}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsThisOnGapCloseEnd", { get: function() {
	return RPGManager.getArrayFromNotesByRegex(this, J.ABS.EXT.TOOLS.RegExp.GapCloseEndThis, true);
} });
/**
* Whether this skill's gap close should respect terrain passability instead of its default
* unconditional bypass. When true, the full tile-by-tile path to the target is validated
* first- if every tile along the way is passable, the caster jumps straight to the target as
* normal; if any tile blocks the path, the gap close doesn't happen at all.
* @type {boolean}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsRespectTerrain", { get: function() {
	return RPGManager.checkForBooleanFromNoteByRegex(this, J.ABS.EXT.TOOLS.RegExp.RespectTerrain);
} });
/**
* The number of tiles this skill pulls its target toward the caster, or null if this skill
* does not pull-forward. The inverse of knockback- the target is dragged toward the caster
* instead of shoved away, clamped so it can never travel past the caster's own position.
* @type {number|null}
*/
Object.defineProperty(RPG_Skill.prototype, "jabsPullForward", { get: function() {
	return RPGManager.getNumberFromNoteByRegex(this, J.ABS.EXT.TOOLS.RegExp.PullForward, true);
} });

//#endregion
//#region src/plugins/abs/ext/tools/managers/JABS_Engine.js
/**
* Processes the various on-hit effects against the target.
* @param {JABS_Action} action The JABS action containing the action data.
* @param {JABS_Battler} target The target having the action applied against.
*/
J.ABS.EXT.TOOLS.Aliased.JABS_Engine.set("processOnHitEffects", JABS_Engine.prototype.processOnHitEffects);
JABS_Engine.prototype.processOnHitEffects = function(action, target) {
	J.ABS.EXT.TOOLS.Aliased.JABS_Engine.get("processOnHitEffects").call(this, action, target);
	this.handlePullForward(action, target);
	this.handleGapClose(action, target);
};
JABS_Engine.prototype.handleGapClose = function(action, target) {
	if (!this.canGapClose(action, target)) return;
	const caster = action.getCaster();
	caster.gapCloseToTarget(action, target);
};
/**
* Handles pull-forward logic against the target- the inverse of gap close (the caster travels
* to the target). Universal like knockback rather than key-gated like gap close: any target
* without enough knockbackResist to fully negate it gets pulled.
* @param {JABS_Action} action The JABS action containing the action data.
* @param {JABS_Battler} target The target having the action applied against.
*/
JABS_Engine.prototype.handlePullForward = function(action, target) {
	if (!this.canBeKnockedBack(action, target)) return;
	if (action.getBaseSkill().jabsPullForward === null) return;
	const caster = action.getCaster();
	target.pullToCaster(action, caster);
};
/**
* Determine whether or not the target can be gap closed to.
* Both the skill and the target must carry matching gap close keys for this to succeed.
* @param {JABS_Action} action The JABS action containing the action data.
* @param {JABS_Battler} target The target having the action applied against.
* @returns {boolean} True if the skill and target keys match, false otherwise.
*/
JABS_Engine.prototype.canGapClose = function(action, target) {
	if (target.getBattler().isGapCloseBlocked()) return false;
	const skill = action.getBaseSkill();
	if (skill.jabsGapCloseAny) return true;
	const skillKey = skill.jabsGapClose;
	if (skillKey === null) return false;
	const targetKey = target.isGapClosable();
	if (targetKey === null) return false;
	if (skillKey !== targetKey) return false;
	return true;
};

//#endregion
//#region src/plugins/abs/ext/tools/objects/Game_Battler.js
/**
* Gets the gap close target key from this battler's notes, or null if not a gap close target.
* Searches all note sources (actor/enemy, equipment, states) and returns the first key found.
* @returns {string|null} The gap close target key, or null if not present.
*/
Game_Battler.prototype.gapCloseKey = function() {
	for (const note of this.getAllNotes()) {
		const key = RPGManager.getStringFromNoteByRegex(note, J.ABS.EXT.TOOLS.RegExp.GapCloseTarget, true);
		if (key !== null) return key;
	}
	return null;
};
/**
* Whether this battler is immune to gap closing, regardless of the key-matching outcome or
* whether the initiating skill carries <gapCloseAny>. Checked across all note sources so a
* state alone can grant temporary immunity (e.g. a boss phase, a hookshot-only chasm guard).
* @returns {boolean} True if any note source carries the <blockGapClose> tag.
*/
Game_Battler.prototype.isGapCloseBlocked = function() {
	return this.getAllNotes().some((note) => RPGManager.checkForBooleanFromNoteByRegex(note, J.ABS.EXT.TOOLS.RegExp.BlockGapClose));
};
/**
* Collects all skill IDs from the <onGapCloseEnd> tag across all of this battler's note sources.
* Unlike {@link jabsThisOnGapCloseEnd}, this aggregates across actor/enemy, equipment, and states.
* @returns {number[]} All gap-close-end skill IDs sourced from notes, or an empty array if none.
*/
Game_Battler.prototype.gapCloseEndSkillIds = function() {
	const ids = [];
	for (const note of this.getAllNotes()) {
		const found = RPGManager.getArrayFromNotesByRegex(note, J.ABS.EXT.TOOLS.RegExp.GapCloseEnd, true, true);
		if (found === null) continue;
		ids.push(...found);
	}
	return ids;
};

//#endregion
//#region src/plugins/abs/ext/tools/objects/Game_CharacterBase.js
/**
* Extends {@link Game_CharacterBase.initMembers}.<br/>
* Also initializes our new members.
*/
J.ABS.EXT.TOOLS.Aliased.Game_CharacterBase.set("initMembers", Game_CharacterBase.prototype.initMembers);
Game_CharacterBase.prototype.initMembers = function() {
	J.ABS.EXT.TOOLS.Aliased.Game_CharacterBase.get("initMembers").call(this);
	this.initToolsMembers();
};
Game_CharacterBase.prototype.initToolsMembers = function() {
	/**
	* The over-arching object that contains all properties for this plugin.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with the tools extension.
	*/
	this._j._tools ||= {};
	/**
	* A grouping of all properties associated with the grab and throw tool functionality.
	*/
	this._j._tools._grabThrow ||= {};
	this._j._tools._grabThrow._grab ||= {};
	this._j._tools._grabThrow._grab._enabled = false;
	this._j._tools._grabThrow._grab._wait = new JABS_Timer(0);
	this._j._tools._grabThrow._grab._check = false;
	this._j._tools._grabThrow._throw ||= {};
	this._j._tools._grabThrow._throw._enabled = false;
	this._j._tools._grabThrow._throw._through = false;
	this._j._tools._grabThrow._throw._directionFixAlways = J.ABS.EXT.TOOLS.Metadata.DirectionFixAlways;
	this._j._tools._grabThrow._throw._directionFix = false;
	this._j._tools._grabThrow._throw._range = 0;
	this._j._tools._grabThrow._throw._wait = new JABS_Timer(0);
};

//#endregion
//#region src/plugins/abs/ext/tools/objects/Game_Event.js
/**
* Gets the gap close target key from this event's comment commands, or null if not a gap close target.
* @returns {string|null} The gap close target key, or null if not present.
*/
Game_Event.prototype.gapCloseKey = function() {
	let foundKey = null;
	this.getValidCommentCommands().forEach((command) => {
		const [comment] = command.parameters;
		const result = J.ABS.EXT.TOOLS.RegExp.GapCloseTarget.exec(comment);
		if (!result) return;
		[, foundKey] = result;
	});
	return foundKey;
};

//#endregion
//#region src/plugins/abs/ext/tools/objects/Game_System.js
/**
* Extends {@link Game_System.initMembers}.<br/>
* Also initializes our new members.
*/
J.ABS.EXT.TOOLS.Aliased.Game_System.set("initMembers", Game_System.prototype.initMembers);
Game_System.prototype.initMembers = function() {
	J.ABS.EXT.TOOLS.Aliased.Game_System.get("initMembers").call(this);
	this.initToolsMembers();
};
Game_System.prototype.initToolsMembers = function() {
	/**
	* The over-arching object that contains all properties for this plugin.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with the tools extension.
	*/
	this._j._tools ||= {};
	/**
	* Whether or not the grab and throw functionality is currently enabled.
	* @type {boolean}
	*/
	this._j._tools._grabThrowEnabled = J.ABS.EXT.TOOLS.Metadata.GrabThrowEnabled;
};
/**
* Gets whether or not grab and throw functionality is enabled.
* @returns {boolean}
*/
Game_System.prototype.isGrabThrowEnabled = function() {
	return this._j._tools._grabThrowEnabled;
};
/**
* Sets whether or not grab and throw functionality is enabled.
* @param {boolean} isEnabled The is enabled driving this step.
*/
Game_System.prototype.setGrabThrowEnabled = function(isEnabled) {
	this._j._tools._grabThrowEnabled = isEnabled;
};
/**
* Toggles whether or not grab and throw functionality is enabled.
*/
Game_System.prototype.toggleGrabThrowEnabled = function() {
	this._j._tools._grabThrowEnabled = !this.isGrabThrowEnabled();
};

//#endregion
//# sourceMappingURL=J-ABS-Tools.js.map