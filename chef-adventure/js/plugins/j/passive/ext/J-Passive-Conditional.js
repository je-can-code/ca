//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 PASSIVE-CONDITIONAL] Gates passives and auto-applies combat states (JABS map).
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-Passive
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-Passive
 * @orderAfter J-Passive-Affix
 * @orderAfter J-CriticalFactors
 * @orderAfter J-Pixelistics
 * @help
 * ============================================================================
 * OVERVIEW
 * Extends J-Passive so passive grants from a source can be gated and scaled.
 * Unconditional passives are simply grants with no rules.
 *
 * Tag families on database rows (skills, states, equip, class, actor, enemy, etc.):
 *  passiveSourceRule  — gates every passive from this source
 *  passiveStateRule   — gates one state id from this source
 *  passiveStateCount  — stack contribution for one state id from this source
 *  autoApplyState     — applies a real combat state on a timer or combat event
 *  autoExecuteSkill   — executes a map skill on a timer or combat event
 *
 * Map battlers re-check on a throttled timer; any passive refresh re-evaluates.
 * ============================================================================
 * GATE TAGS
 *  <passiveSourceRule:[KIND, PARAM?]>
 *  <passiveStateRule:[STATE_ID, KIND, PARAM?]>
 *
 * Threshold kinds use *Above (>=) and *Below (<=):
 *  hp/mp/tp — current resource percent; mhp/mmp/mtp — flat max values
 *  {registryKey}Above/Below — flat or hundred-scale per ParameterRegistry
 *  allAllies{Key}Above/Below — every allied JABS battler (incl. self) must pass
 *
 * Discrete kinds include alliesNearby, enemiesNearby, hasState, negativeStateCount,
 * slotOnCooldown, slotOffCooldown, allOnCooldown, allOffCooldown,
 * sinceLastMoved/Hit/Attacked, movedWithin/hitWithin/attackedWithin (frames).
 *
 * EXAMPLES:
 *  <passive:[12]>
 *  <passiveStateRule:[12, hpBelow, 25]>
 *  <passiveSourceRule:[allOffCooldown]>
 * ============================================================================
 * STACK COUNT TAG
 *  <passiveStateCount:[STATE_ID, KIND, PARAM]>
 *
 * Kinds: negativeStateCount, alliesNearby (excludes self), lessIsMoreHp/Mp/Tp,
 * moreIsMoreHp/Mp/Tp, per-{registryKey} (integer points per stack).
 * ============================================================================
 * AUTO-APPLY STATE TAG
 *  <autoApplyState:[STATE_ID, CONDITION, PARAM]>
 *
 * Applies a normal JABS state (shield, buff, etc.) — not a passive grant.
 * Do not also list the same state id in <passive:[...]> on the same row.
 * PARAM meaning depends on CONDITION (see below).
 *
 * CONDITIONS — PARAM is minimum FRAMES between applies (per source+state+condition):
 *  time            — periodic while on the ABS map (interval = PARAM)
 *  hpDmg / mpDmg / tpDmg — combat loss via gain* < 0 (not skill MP/TP pay)
 *  anyDmg          — when HP, MP, or TP takes combat damage
 *  whenCrit        — when THIS battler is critically hit (victim; not onCritApply)
 *  negaStateAdded  — when a <negative> (jabsNegative) state is added
 *  posiStateAdded  — when a non-negative state is added
 *  anyStateAdded   — when any combat state is added
 *  move            — PARAM = whole TILES per apply (Pixelistics updatePixelStepping; requires J-Pixelistics)
 *  stand           — PARAM = frames between applies while standing still on the map
 *
 * EXAMPLES:
 *  <autoApplyState:[50, time, 900]>
 *  <autoApplyState:[51, hpDmg, 60]>
 *  <autoApplyState:[52, anyDmg, 120]>
 *  <autoApplyState:[53, whenCrit, 120]>
 *  <autoApplyState:[54, negaStateAdded, 180]>
 *  <autoApplyState:[55, posiStateAdded, 180]>
 *  <autoApplyState:[56, anyStateAdded, 60]>
 *  <autoApplyState:[MOMENTUM_ID, move, 2]>
 *  <autoApplyState:[BUFF_ID, stand, 120]>
 * ============================================================================
 * AUTO-EXECUTE SKILL TAG
 *  <autoExecuteSkill:[SKILL_ID, CONDITION, PARAM]>
 *
 * Fires a map skill through JABS forceMapAction — no MP/TP cost, no skill cooldown.
 * Victims may parry and retaliate. Payload skill owns radius, hitbox, and formula.
 * Do not tag the payload skill with autoExecuteSkill (depth guard).
 * PARAM meaning matches autoApplyState CONDITIONS, plus:
 *  enemiesNearby — four- or five-value tuple:
 *    <autoExecuteSkill:[SKILL_ID, enemiesNearby, MIN_COUNT, FRAMES]>
 *    optional fifth TRIGGER_TILES overrides default-proximity-tiles for the gate only.
 *
 * EXAMPLES:
 *  <autoExecuteSkill:[1021, time, 60]>
 *  <autoExecuteSkill:[1022, enemiesNearby, 1, 60]>
 *  <autoExecuteSkill:[1023, move, 1]>
 *  <autoExecuteSkill:[1024, stand, 120]>
 * ============================================================================
 * REMOVE ON SKILL EXECUTION (state note only)
 *  <removeOnSkillExecution:[STYPE_ID, CHANCE]>
 *
 * On this battler executing a map skill, rolls CHANCE (1–100). STYPE_ID 0 = any type.
 * On success, peels stacks via decrementStateStacks (respects loseAllStacksAtOnce on
 * this state row). Tag lives on the state that may be removed — not on skills/equip.
 *
 * EXAMPLES:
 *  <removeOnSkillExecution:[7, 100]>
 *  <removeOnSkillExecution:[0, 25]>
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release. Passive gates (passiveSourceRule, passiveStateRule,
 *    passiveStateCount) with map reconcile and combat timestamps (movement, hit,
 *    attack, onHealHp/Mp/Tp). autoApplyState schedules real JABS states on time,
 *    hpDmg/mpDmg/tpDmg/anyDmg (combat gain* loss only, not skill pay), whenCrit
 *    (victim), negaStateAdded/posiStateAdded/anyStateAdded, move (whole tiles via
 *    Pixelistics updatePixelStepping), and stand (idle on map). removeOnSkillExecution on state
 *    rows (stype filter, chance, stack-aware decrementStateStacks).
 * ============================================================================
 *
 * @param parentConfigPassiveConditional
 * @text PASSIVE CONDITIONAL
 *
 * @param reconcile-delay-frames
 * @parent parentConfigPassiveConditional
 * @type number
 * @min 1
 * @max 600
 * @text Reconcile Delay (frames)
 * @desc Frames between passive rule re-checks per map battler.
 * @default 15
 *
 * @param default-proximity-tiles
 * @parent parentConfigPassiveConditional
 * @type number
 * @min 1
 * @max 99
 * @text Default Proximity (tiles)
 * @desc Tile radius for alliesNearby/enemiesNearby rules and stack counts.
 * @default 5
 *
 * @param auto-execute-skill-max-depth
 * @parent parentConfigPassiveConditional
 * @type number
 * @min 1
 * @max 8
 * @text Auto-Execute Max Depth
 * @desc Max nested autoExecuteSkill firings per synchronous call stack.
 * @default 1
 */
//endregion annotations


//#region src/plugins/passive/ext/conditional/_metadata/_pluginMetadata.js
var JPassiveConditional_PluginMetadata = class extends PluginMetadata {
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
	* Parses the plugin parameters and assigns them to the metadata.
	*/
	initializeMetadata() {
		const reconcileParsed = parseInt(this.parsedPluginParameters["reconcile-delay-frames"], 10);
		/**
		* Frames between map-side passive rule reconciles per {@link JABS_Battler}.
		* @type {number}
		*/
		this.reconcileDelayFrames = Number.isNaN(reconcileParsed) ? 15 : reconcileParsed;
		const proximityParsed = parseInt(this.parsedPluginParameters["default-proximity-tiles"], 10);
		/**
		* Default tile radius for alliesNearby/enemiesNearby rules and stack counts.
		* @type {number}
		*/
		this.defaultProximityTiles = Number.isNaN(proximityParsed) ? 5 : proximityParsed;
		const depthParsed = parseInt(this.parsedPluginParameters["auto-execute-skill-max-depth"], 10);
		/**
		* Maximum nested {@link AutoExecuteSkillManager} executions per synchronous call stack.
		* @type {number}
		*/
		this.autoExecuteSkillMaxDepth = Number.isNaN(depthParsed) ? 1 : depthParsed;
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs conditional passive states on the map.
*/
J.PASSIVE.EXT.CONDITIONAL = {};
/**
* The metadata associated with this plugin.
*/
J.PASSIVE.EXT.CONDITIONAL.Metadata = new JPassiveConditional_PluginMetadata("J-Passive-Conditional", "1.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased = {};
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler = new Map();
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Action = new Map();
J.PASSIVE.EXT.CONDITIONAL.Aliased.JABS_Battler = new Map();
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_CharacterBase = new Map();
J.PASSIVE.EXT.CONDITIONAL.Aliased.Window_PassiveDetail = new Map();
/**
* All regular expressions used by this plugin.
*/
J.PASSIVE.EXT.CONDITIONAL.RegExp = {};
/**
* Captures {@code passiveSourceRule} bracket tuples from database notes.<br/>
* Parsed by {@link RPGManager.getArraysFromNotesByRegex} (Path 1: outer tag + inner bracket capture).<br/>
* Each match contributes one tuple that gates <strong>every</strong> passive state id declared on the same row.
* <p>
* Author shape: {@code <passiveSourceRule:[kind]>}, or {@code <passiveSourceRule:[kind, param]>}.<br/>
* After parsing, tuples look like:
* </p>
* <ul>
*   <li>{@code ['allOffCooldown']}</li>
*   <li>{@code ['alliesNearby', 2]}</li>
*   <li>{@code ['hpBelow', 25]}</li>
* </ul>
* <p>
* Multiple source rules on one row are AND-ed: every tuple must pass for any passive from that source to count.
* </p>
* @type {RegExp}
*/
J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveSourceRule = /<passiveSourceRule:[ ]?(\[[^\]]+])>/gi;
/**
* Captures {@code passiveStateRule} bracket tuples from database notes.<br/>
* Parsed by {@link RPGManager.getArraysFromNotesByRegex} (Path 1: outer tag + inner bracket capture).<br/>
* Each match gates one passive state id declared on the same row; other passives on that row are unaffected.
* <p>
* Author shape: {@code <passiveStateRule:[stateId, kind]>}, or {@code <passiveStateRule:[stateId, kind, param]>}.<br/>
* After parsing, tuples look like:
* </p>
* <ul>
*   <li>{@code [12, 'hpBelow', 25]}</li>
*   <li>{@code [5, 'hasState', 14]}</li>
*   <li>{@code [6, 'slotOffCooldown', 'mainhand']}</li>
* </ul>
* <p>
* Source-wide rules still apply first; state rules AND with any {@link PassiveSourceRule} tuples on the row.
* </p>
* @type {RegExp}
*/
J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveStateRule = /<passiveStateRule:[ ]?(\[[^\]]+])>/gi;
/**
* Captures {@code passiveStateCount} bracket tuples from database notes.<br/>
* Parsed by {@link RPGManager.getArraysFromNotesByRegex} (Path 1: outer tag + inner bracket capture).<br/>
* Each match scales how many stacks one source contributes for one passive state id (0 stacks is valid).
* <p>
* Author shape: {@code <passiveStateCount:[stateId, kind, param]>}.<br/>
* After parsing, tuples look like:
* </p>
* <ul>
*   <li>{@code [77, 'moreIsMoreHp', 25]} — floor(current hp% / 25) stacks</li>
*   <li>{@code [12, 'per-cri', 3]} — floor(crit rate / 3) stacks (hundred-scale params use tag integers)</li>
*   <li>{@code [8, 'alliesNearby', 2]} — floor(nearby allies excluding self / 2) stacks</li>
* </ul>
* <p>
* When no count tuple targets a state, {@link Game_Battler#getPassiveStackContributionFromSource} falls back to 1.
* </p>
* @type {RegExp}
*/
J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveStateCount = /<passiveStateCount:[ ]?(\[[^\]]+])>/gi;
/**
* Captures {@code autoApplyState} bracket tuples from database notes.<br/>
* Parsed by {@link RPGManager.getArraysFromNotesByRegex} (Path 1: outer tag + inner bracket capture).<br/>
* Each match schedules a real JABS state application (not a passive grant).
* <p>
* Author shape: {@code <autoApplyState:[stateId, condition, param]>}.<br/>
* The third value is condition-specific — see plugin help for the glossary.
* After parsing, tuples look like:
* </p>
* <ul>
*   <li>{@code [12, 'time', 900]} — every 900 frames while on the ABS map</li>
*   <li>{@code [14, 'hpDmg', 60]} — on HP damage, at most once per 60 frames</li>
*   <li>{@code [15, 'whenCrit', 120]} — when this battler is critically hit (victim)</li>
*   <li>{@code [16, 'anyDmg', 90]} — when HP, MP, or TP takes damage</li>
*   <li>{@code [17, 'posiStateAdded', 180]} — when a non-negative state is added</li>
*   <li>{@code [18, 'anyStateAdded', 60]} — when any combat state is added</li>
*   <li>{@code [42, 'move', 2]} — one apply per 2 whole tiles traveled (Pixelistics updatePixelStepping)</li>
*   <li>{@code [43, 'stand', 120]} — while idle on map, at most once per 120 frames</li>
* </ul>
* @type {RegExp}
*/
J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoApplyState = /<autoApplyState:[ ]?(\[[^\]]+])>/gi;
/**
* Captures {@code autoExecuteSkill} bracket tuples from database notes.<br/>
* Parsed by {@link RPGManager.getArraysFromNotesByRegex} (Path 1: outer tag + inner bracket capture).<br/>
* Each match schedules a map skill via {@link AutoExecuteSkillManager} and {@link JABS_Engine#forceMapAction}.
* <p>
* Author shape: {@code <autoExecuteSkill:[skillId, condition, param]>}, or a four- or five-value
* {@code enemiesNearby} tuple. After parsing, tuples look like:
* </p>
* <ul>
*   <li>{@code [1021, 'time', 60]} — every 60 frames while on the ABS map</li>
*   <li>{@code [1022, 'enemiesNearby', 1, 60]} — every 60 frames when at least one enemy is in range</li>
*   <li>{@code [1023, 'enemiesNearby', 1, 30, 2]} — same with a 2-tile trigger gate radius</li>
*   <li>{@code [1024, 'move', 1]} — one execution per whole tile traveled</li>
*   <li>{@code [1025, 'stand', 120]} — while idle, at most once per 120 frames</li>
* </ul>
* @type {RegExp}
*/
J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoExecuteSkill = /<autoExecuteSkill:[ ]?(\[[^\]]+])>/gi;
/**
* Captures {@code removeOnSkillExecution} bracket tuples from <strong>state</strong> notes only.<br/>
* On skill execution, rolls chance and may peel stacks via {@link Game_Battler#decrementStateStacks}.
* <p>
* Author shape: {@code <removeOnSkillExecution:[stypeId, chance]>}.<br/>
* {@code stypeId} 0 matches any skill type. {@code chance} is 1–100 for {@link RPGManager.chanceIn100}.
* </p>
* @type {RegExp}
*/
J.PASSIVE.EXT.CONDITIONAL.RegExp.RemoveOnSkillExecution = /<removeOnSkillExecution:[ ]?(\[[^\]]+])>/gi;
/**
* Captures {@code removeStateOnMove} bracket tuples from <strong>state</strong> notes only.<br/>
* When the owning battler moves, strips the target state via {@link Game_Battler#decrementStateStacks}.
* Respects {@code jabsLoseAllStacksAtOnce} on the target state — one call collapses all stacks if set.
* <p>
* Author shape: {@code <removeStateOnMove:[stateId]>}.<br/>
* After parsing, tuples look like:
* </p>
* <ul>
*   <li>{@code [1031]} — strip state 1031 when this battler moves</li>
* </ul>
* <p>
* Intended use: mastery states pair {@code autoApplyState:[PAYLOAD, stand, F]} with
* {@code removeStateOnMove:[PAYLOAD]} to build a movement-reset stack counter.
* </p>
* @type {RegExp}
*/
J.PASSIVE.EXT.CONDITIONAL.RegExp.RemoveStateOnMove = /<removeStateOnMove:[ ]?(\[[^\]]+])>/gi;

//#endregion
//#region src/plugins/passive/ext/conditional/database/RPG_BaseBattler.js
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveSourceRule} tuples from this row.<br/>
* Actor and enemy database rows extend {@link RPG_BaseBattler} — same getters as {@link RPG_BaseItem}.
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseBattler.prototype, "passiveSourceRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveSourceRule, true);
} });
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveStateRule} tuples from this row.<br/>
* Each tuple targets one passive state id; collection hooks filter by state when evaluating inclusion.
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseBattler.prototype, "passiveStateRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveStateRule, true);
} });
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveStateCount} tuples from this row.<br/>
* Used by {@link Game_Battler#getPassiveStackContributionFromSource} instead of the default +1 stack.
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseBattler.prototype, "passiveStateCounts", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveStateCount, true);
} });
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoApplyState} tuples from this row.<br/>
* Each tuple schedules a real state via {@link AutoApplyStateManager} (not the passive pipeline).
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseBattler.prototype, "autoApplyStateRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoApplyState, true);
} });
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoExecuteSkill} tuples from this row.<br/>
* Each tuple schedules a map skill via {@link AutoExecuteSkillManager}.
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseBattler.prototype, "autoExecuteSkillRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoExecuteSkill, true);
} });

//#endregion
//#region src/plugins/passive/ext/conditional/database/RPG_BaseItem.js
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveSourceRule} tuples from this row.<br/>
* These live on the same database object as {@code <passive:[…]>} — not a parallel append pipeline.
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseItem.prototype, "passiveSourceRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveSourceRule, true);
} });
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveStateRule} tuples from this row.<br/>
* Each tuple targets one passive state id; collection hooks filter by state when evaluating inclusion.
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseItem.prototype, "passiveStateRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveStateRule, true);
} });
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveStateCount} tuples from this row.<br/>
* Used by {@link Game_Battler#getPassiveStackContributionFromSource} instead of the default +1 stack.
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseItem.prototype, "passiveStateCounts", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveStateCount, true);
} });
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoApplyState} tuples from this row.<br/>
* Each tuple schedules a real state via {@link AutoApplyStateManager} (not the passive pipeline).
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseItem.prototype, "autoApplyStateRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoApplyState, true);
} });
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoExecuteSkill} tuples from this row.<br/>
* Each tuple schedules a map skill via {@link AutoExecuteSkillManager}.
* @type {any[][]}
*/
Object.defineProperty(RPG_BaseItem.prototype, "autoExecuteSkillRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoExecuteSkill, true);
} });

//#endregion
//#region src/plugins/passive/ext/conditional/database/RPG_State.js
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.RemoveOnSkillExecution} tuples from this state row.<br/>
* Each tuple is {@code [stypeId, chance]}; {@code stypeId} 0 matches any skill type.
* @type {any[][]}
*/
Object.defineProperty(RPG_State.prototype, "removeOnSkillExecutionRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.RemoveOnSkillExecution, true);
} });
/**
* Parsed {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.RemoveStateOnMove} tuples from this state row.<br/>
* Each tuple is {@code [stateId]}; when the owning battler moves, that state is stripped.
* @type {any[][]}
*/
Object.defineProperty(RPG_State.prototype, "removeStateOnMoveRules", { get() {
	return RPGManager.getArraysFromNotesByRegex(this, J.PASSIVE.EXT.CONDITIONAL.RegExp.RemoveStateOnMove, true);
} });

//#endregion
//#region src/plugins/passive/ext/conditional/helpers/PassiveRuleThreshold.js
/**
* Shared threshold comparisons for passive gate rules ({@code *Above/*Below} and {@code allAllies*}).<br/>
* Authors write hundred-scale integers in tags for x/sparam registry keys (e.g. {@code 25} means 25% crit).
*/
var PassiveRuleThreshold = class {
	/**
	* Current hp/mp/tp keys compared as percent of max.
	* @type {string[]}
	*/
	static CURRENT_RESOURCE_KEYS = [
		"hp",
		"mp",
		"tp"
	];
	/**
	* Max hp/mp/tp keys compared as flat values from {@link Game_Battler#parameter}.
	* @type {string[]}
	*/
	static MAX_RESOURCE_KEYS = [
		"mhp",
		"mmp",
		"mtp"
	];
	/**
	* Compares one battler against a threshold using inclusive Above/Below semantics.<br/>
	* {@code hpAbove, 50} passes at exactly 50%; {@code hpBelow, 25} passes at exactly 25%.
	* @param {Game_Battler} battler The battler whose live value we read.
	* @param {string} key Resource or registry key (hp, cri, mhp, etc.).
	* @param {string} direction {@code 'above'} or {@code 'below'} parsed from the rule kind suffix.
	* @param {number} threshold Tag integer to compare against (percent or flat per key type).
	* @returns {boolean} Whether the battler satisfies the inclusive threshold.
	*/
	static compare(battler, key, direction, threshold) {
		const value = this.resolveRuleValue(battler, key);
		if (direction === "above") {
			return value >= threshold;
		}
		return value <= threshold;
	}
	/**
	* Resolves the left-hand value for a threshold key on one battler.<br/>
	* Routes current resources to percent, max resources to flat totals, everything else to registry.
	* @param {Game_Battler} battler The battler whose value we resolve.
	* @param {string} key Resource or registry key from the parsed rule kind.
	* @returns {number} Integer comparison value in tag authoring units.
	*/
	static resolveRuleValue(battler, key) {
		if (this.CURRENT_RESOURCE_KEYS.includes(key)) {
			return this.#currentResourcePercent(battler, key);
		}
		if (this.MAX_RESOURCE_KEYS.includes(key)) {
			return battler.parameter(key);
		}
		return this.#registryIntegerValue(battler, key);
	}
	/**
	* Converts current hp/mp/tp into a whole-number percent of max for threshold and stack math.
	* @param {Game_Battler} battler The battler whose resource we read.
	* @param {string} resource One of {@code hp}, {@code mp}, or {@code tp}.
	* @returns {number} Rounded percent 0–100; zero when max is zero.
	*/
	static #currentResourcePercent(battler, resource) {
		switch (resource) {
			case "hp": {
				const { mhp } = battler;
				if (mhp <= 0) return 0;
				return Math.round(battler.hp / mhp * 100);
			}
			case "mp": {
				const { mmp } = battler;
				if (mmp <= 0) return 0;
				return Math.round(battler.mp / mmp * 100);
			}
			case "tp": {
				const mtp = battler.maxTp();
				if (mtp <= 0) return 0;
				return Math.round(battler.tp / mtp * 100);
			}
			default: return 0;
		}
	}
	/**
	* Resolves a {@link ParameterRegistry} key into tag integer units for comparison.
	* @param {Game_Battler} battler The battler passed to the registry resolver.
	* @param {string} key Registry key such as {@code cri} or {@code rec}.
	* @returns {number} Whole-number value; unknown keys return zero (fail closed).
	*/
	static #registryIntegerValue(battler, key) {
		const definition = ParameterRegistry.get(key);
		if (!definition) return 0;
		const raw = definition.resolveValue(battler);
		if (this.#usesHundredScale(definition.format)) {
			return Math.round(raw * 100);
		}
		return raw;
	}
	/**
	* Whether a registry format stores fractional values that authors write as hundred-scale integers.
	* @param {string} format {@link ParameterDefinition} format id.
	* @returns {boolean} True when tag values should be compared after multiplying raw by 100.
	*/
	static #usesHundredScale(format) {
		return format === "percent" || format === "percentSuffix" || format === "percentCentered" || format === "multiplierPercent" || format === "scaledPoints" || format === "scaledOffset";
	}
	/**
	* Parses an {@code *Above/*Below} kind into key + direction when present.<br/>
	* Example: {@code hpBelow} → {@code { key: 'hp', direction: 'below' }}.
	* @param {string} kind Full rule kind from a parsed note tuple.
	* @returns {{ key: string, direction: string }|null} Parsed key/direction, or null when not a threshold kind.
	*/
	static parseThresholdKind(kind) {
		if (kind.endsWith("Above")) {
			return {
				key: kind.slice(0, -5),
				direction: "above"
			};
		}
		if (kind.endsWith("Below")) {
			return {
				key: kind.slice(0, -5),
				direction: "below"
			};
		}
		return null;
	}
	/**
	* Parses an {@code allAllies*Above/Below} kind when present.<br/>
	* Every allied JABS battler (including self) must satisfy the same threshold.
	* @param {string} kind Full rule kind from a parsed note tuple.
	* @returns {{ key: string, direction: string }|null} Parsed key/direction after the allAllies prefix.
	*/
	static parseAllAlliesThresholdKind(kind) {
		if (kind.startsWith("allAllies") === false) return null;
		const remainder = kind.slice("allAllies".length);
		return this.parseThresholdKind(remainder);
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/helpers/PassiveRuleJabsAccess.js
/**
* Resolves {@link JABS_Battler} context and proximity helpers for passive rule evaluation.<br/>
* Ally and enemy checks use JABS battlers — not {@link $gameParty} — so map AI context stays authoritative.
*/
var PassiveRuleJabsAccess = class {
	/**
	* Looks up the map-side {@link JABS_Battler} wrapper for a {@link Game_Battler}.<br/>
	* Returns null when the battler is not registered with ABS (menu-only actors, etc.).
	* @param {Game_Battler} battler The battler whose uuid we resolve on the map.
	* @returns {JABS_Battler|null} The live JABS wrapper, or null when off-map / unregistered.
	*/
	static getJabsBattler(battler) {
		if (!battler || !battler.getUuid) return null;
		return JABS_AiManager.getBattlerByUuid(battler.getUuid()) ?? null;
	}
	/**
	* Default proximity radius in tiles from plugin metadata.<br/>
	* Used when authors omit an explicit radius on alliesNearby / enemiesNearby rules.
	* @returns {number} Tile radius from {@link default-proximity-tiles} plugin param.
	*/
	static defaultProximity() {
		return J.PASSIVE.EXT.CONDITIONAL.Metadata.defaultProximityTiles;
	}
	/**
	* Allied battlers within default proximity, excluding self.<br/>
	* Used by {@code alliesNearby} gates and stack counts — self never counts toward the tally.
	* @param {Game_Battler} battler The battler whose neighborhood we measure.
	* @returns {JABS_Battler[]} Allied JABS battlers in range, never including the evaluator.
	*/
	static nearbyAlliesExcludingSelf(battler) {
		const jabsBattler = this.getJabsBattler(battler);
		if (!jabsBattler) return [];
		const proximity = this.defaultProximity();
		return JABS_AiManager.getAlliedBattlersWithinRange(jabsBattler, proximity).filter((ally) => ally.getUuid() !== jabsBattler.getUuid());
	}
	/**
	* Opposing battlers within proximity of this battler.<br/>
	* Used by {@code enemiesNearby} gate rules and auto-execute trigger gates.
	* @param {Game_Battler} battler The battler whose neighborhood we measure.
	* @param {number|null} proximityTiles Optional tile radius; defaults to plugin param.
	* @returns {JABS_Battler[]} Opposing JABS battlers within the requested tile radius.
	*/
	static nearbyEnemies(battler, proximityTiles = null) {
		const jabsBattler = this.getJabsBattler(battler);
		if (!jabsBattler) return [];
		const proximity = proximityTiles ?? this.defaultProximity();
		return JABS_AiManager.getOpposingBattlersWithinRange(jabsBattler, proximity);
	}
	/**
	* Allied battlers for {@code allAllies*} threshold checks (includes self when on the map).<br/>
	* Every member of the returned set must satisfy the same threshold for the gate to pass.
	* @param {Game_Battler} battler The battler whose party context we collect.
	* @returns {Game_Battler[]} Allied battlers plus self when map context exists.
	*/
	static allAlliedBattlersIncludingSelf(battler) {
		const jabsBattler = this.getJabsBattler(battler);
		if (!jabsBattler) return [battler];
		const allies = JABS_AiManager.getAlliedBattlers(jabsBattler).map((ally) => ally.getBattler()).filter((allyBattler) => !!allyBattler);
		if (allies.includes(battler) === false) {
			allies.push(battler);
		}
		return allies;
	}
	/**
	* Maps author-facing slot names to {@link JABS_Button} keys.<br/>
	* Accepts shorthand like {@code mainhand} / {@code skill1} as well as raw button keys.
	* @param {string|number} slotParam Author tag value for a skill slot.
	* @returns {string} Resolved {@link JABS_Button} key for cooldown queries.
	*/
	static resolveSlotKey(slotParam) {
		const normalized = String(slotParam).toLowerCase();
		switch (normalized) {
			case "main":
			case "mainhand": return JABS_Button.Mainhand;
			case "offhand": return JABS_Button.Offhand;
			case "tool": return JABS_Button.Tool;
			case "dodge": return JABS_Button.Dodge;
			case "combatskill1":
			case "skill1": return JABS_Button.CombatSkill1;
			case "combatskill2":
			case "skill2": return JABS_Button.CombatSkill2;
			case "combatskill3":
			case "skill3": return JABS_Button.CombatSkill3;
			case "combatskill4":
			case "skill4": return JABS_Button.CombatSkill4;
			default: return String(slotParam);
		}
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/managers/AutoApplyStateManager.js
/**
* Schedules real JABS state applications from {@link RPG_BaseItem#autoApplyStateRules} /
* {@link RPG_BaseBattler#autoApplyStateRules} tuples.<br/>
* Separate from the passive grant pipeline — uses {@link Game_Battler#addState} on the map.
*/
var AutoApplyStateManager = class {
	/**
	* Evaluates every {@code time} rule on this battler while they are active on the ABS map.
	* @param {Game_Actor|Game_Enemy} battler The battler receiving scheduled states.
	*/
	static processTimeRules(battler) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		this.tryApply(battler, "time");
	}
	/**
	* Evaluates {@code stand} rules while this battler is idle on the ABS map.
	* @param {Game_Actor|Game_Enemy} battler The battler receiving scheduled states.
	*/
	static processStandRules(battler) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		const lastMovedFrame = battler.getPassiveRuleLastMovedFrame();
		const framesSinceMoved = Graphics.frameCount - lastMovedFrame;
		if (framesSinceMoved === 0) return;
		this.tryApply(battler, "stand");
	}
	/**
	* Credits one whole tile of travel toward {@code move} auto-apply rules.<br/>
	* Called from {@link Game_CharacterBase#updatePixelStepping} after Pixelistics tile stepping.
	* @param {Game_Actor|Game_Enemy} battler The battler that took a map tile step.
	*/
	static creditTileStep(battler) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		const rules = this.collectRules(battler);
		for (const entry of rules) {
			const { source, tuple, tupleIndex } = entry;
			const stateId = Number(tuple[0]);
			const kind = String(tuple[1]);
			const tilesPerApply = Number(tuple[2]);
			if (Number.isNaN(stateId) || stateId <= 0) continue;
			if (kind !== "move") continue;
			if (Number.isNaN(tilesPerApply) || tilesPerApply <= 0) continue;
			const ruleKey = this.buildRuleKey(source, tupleIndex, stateId, kind);
			const priorCredit = battler.getAutoApplyTileCredit(ruleKey);
			const nextCredit = priorCredit + 1;
			if (nextCredit < tilesPerApply) {
				battler.setAutoApplyTileCredit(ruleKey, nextCredit);
				continue;
			}
			this.#applyState(battler, stateId);
			battler.setAutoApplyTileCredit(ruleKey, 0);
		}
	}
	/**
	* Forwards one Pixelistics tile step from a map character to its underlying battler.
	* @param {Game_Character} character The character that just completed a whole-tile step.
	*/
	static processTileStepFromCharacter(character) {
		const jabsBattler = character.getJabsBattler();
		if (!jabsBattler) return;
		const battler = jabsBattler.getBattler();
		if (!battler) return;
		this.creditTileStep(battler);
	}
	/**
	* Fires resource-specific and {@code anyDmg} auto-apply rules after damage to one pool.
	* @param {Game_Actor|Game_Enemy} battler The battler that took damage.
	* @param {'hpDmg'|'mpDmg'|'tpDmg'} resourceKind Which resource decreased.
	*/
	static scheduleDamageTriggers(battler, resourceKind) {
		battler.tryAutoApplyStates(resourceKind);
		battler.tryAutoApplyStates("anyDmg");
	}
	/**
	* Fires state-polarity and {@code anyStateAdded} auto-apply after a combat state lands.
	* @param {Game_Actor|Game_Enemy} battler The battler that received the state.
	* @param {number} stateId The database state id that was added.
	*/
	static scheduleStateAddedTriggers(battler, stateId) {
		battler.tryAutoApplyStates("anyStateAdded");
		const state = $dataStates[stateId];
		if (!state) return;
		if (state.jabsNegative === true) {
			battler.tryAutoApplyStates("negaStateAdded");
		} else {
			battler.tryAutoApplyStates("posiStateAdded");
		}
	}
	/**
	* Tries to apply states for every rule on this battler that matches the given condition kind.
	* @param {Game_Actor|Game_Enemy} battler The battler receiving scheduled states.
	* @param {string} conditionKind The condition kind to match (time, hpDmg, whenCrit, etc.).
	*/
	static tryApply(battler, conditionKind) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		const rules = this.collectRules(battler);
		for (const entry of rules) {
			const { source, tuple, tupleIndex } = entry;
			const stateId = Number(tuple[0]);
			const kind = String(tuple[1]);
			const param = Number(tuple[2]);
			if (Number.isNaN(stateId) || stateId <= 0) continue;
			if (kind !== conditionKind) continue;
			if (Number.isNaN(param) || param < 0) continue;
			if (kind === "move") continue;
			this.#tryApplyRule(battler, source, tupleIndex, stateId, kind, param);
		}
	}
	/**
	* Gathers auto-apply tuples from every passive-capable source on this battler.
	* @param {Game_Actor|Game_Enemy} battler The battler whose sources should be scanned.
	* @returns {{ source: RPG_BaseItem, tuple: any[], tupleIndex: number }[]} Rules with their originating database row.
	*/
	static collectRules(battler) {
		const collected = [];
		const sources = battler.getPassiveStateSources();
		for (const source of sources) {
			const tuples = source.autoApplyStateRules || [];
			for (let tupleIndex = 0; tupleIndex < tuples.length; tupleIndex++) {
				collected.push({
					source,
					tuple: tuples[tupleIndex],
					tupleIndex
				});
			}
		}
		return collected;
	}
	/**
	* Builds a stable cooldown key for one authored rule on one source row.<br/>
	* {@link tupleIndex} is the tag's position in {@link RPG_BaseItem#autoApplyStateRules} so duplicate
	* state/condition pairs on the same row stay independent.
	* @param {RPG_BaseItem} source The database row carrying the tag.
	* @param {number} tupleIndex Zero-based index of this tuple on {@code source}.
	* @param {number} stateId The state id to apply.
	* @param {string} condition The condition kind string.
	* @returns {string} Unique key for last-apply frame tracking.
	*/
	static buildRuleKey(source, tupleIndex, stateId, condition) {
		const sourceLabel = source.constructor.name || "Unknown";
		const sourceId = source.id;
		return `${sourceLabel}:${sourceId}:${tupleIndex}:${stateId}:${condition}`;
	}
	/**
	* Applies one rule when its per-key frame cooldown has elapsed.
	* @param {Game_Actor|Game_Enemy} battler The battler receiving the state.
	* @param {RPG_BaseItem} source The database row that declared the rule.
	* @param {number} tupleIndex Zero-based index of this tuple on {@code source}.
	* @param {number} stateId The state id to apply.
	* @param {string} condition The condition kind string.
	* @param {number} cooldownFrames Minimum frames between applications for this key.
	*/
	static #tryApplyRule(battler, source, tupleIndex, stateId, condition, cooldownFrames) {
		const ruleKey = this.buildRuleKey(source, tupleIndex, stateId, condition);
		const now = Graphics.frameCount;
		const lastFrame = battler.getAutoApplyLastFrame(ruleKey);
		const elapsed = now - lastFrame;
		if (lastFrame > 0 && elapsed < cooldownFrames) return;
		const applied = this.#applyState(battler, stateId);
		if (applied === true) {
			battler.setAutoApplyLastFrame(ruleKey, now);
		}
	}
	/**
	* Pushes a real combat state onto the battler through the JABS addState path.
	* @param {Game_Actor|Game_Enemy} battler The battler receiving the state.
	* @param {number} stateId The database state id to apply.
	* @returns {boolean} True when addState was attempted and the state is addable.
	*/
	static #applyState(battler, stateId) {
		if (battler.isStateAddable(stateId) === false) return false;
		battler.addState(stateId, battler);
		return true;
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/managers/AutoExecuteSkillManager.js
/**
* Schedules map skill executions from {@link RPG_BaseItem#autoExecuteSkillRules} /
* {@link RPG_BaseBattler#autoExecuteSkillRules} tuples.<br/>
* Separate from the passive grant pipeline — uses {@link JABS_Engine#forceMapAction}.
*/
var AutoExecuteSkillManager = class AutoExecuteSkillManager {
	/**
	* Nested auto-execute depth for the synchronous call stack guard.
	* @type {number}
	*/
	static #executionDepth = 0;
	/**
	* Evaluates every {@code time} rule on this battler while they are active on the ABS map.
	* @param {Game_Actor|Game_Enemy} battler The battler whose skills may fire.
	*/
	static processTimeRules(battler) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		this.tryExecute(battler, "time");
	}
	/**
	* Evaluates every {@code enemiesNearby} rule on this battler while on the ABS map.
	* @param {Game_Actor|Game_Enemy} battler The battler whose skills may fire.
	*/
	static processEnemiesNearbyRules(battler) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		this.tryExecute(battler, "enemiesNearby");
	}
	/**
	* Evaluates {@code stand} rules while this battler is idle on the ABS map.
	* @param {Game_Actor|Game_Enemy} battler The battler whose skills may fire.
	*/
	static processStandRules(battler) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		const lastMovedFrame = battler.getPassiveRuleLastMovedFrame();
		const framesSinceMoved = Graphics.frameCount - lastMovedFrame;
		if (framesSinceMoved === 0) return;
		this.tryExecute(battler, "stand");
	}
	/**
	* Credits one whole tile of travel toward {@code move} auto-execute rules.<br/>
	* Called from {@link Game_CharacterBase#updatePixelStepping} after Pixelistics tile stepping.
	* @param {Game_Actor|Game_Enemy} battler The battler that took a map tile step.
	*/
	static creditTileStep(battler) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		const rules = this.collectRules(battler);
		for (const entry of rules) {
			const { source, tuple, tupleIndex } = entry;
			const skillId = Number(tuple[0]);
			const kind = String(tuple[1]);
			const tilesPerExecute = Number(tuple[2]);
			if (Number.isNaN(skillId) || skillId <= 0) continue;
			if (kind !== "move") continue;
			if (Number.isNaN(tilesPerExecute) || tilesPerExecute <= 0) continue;
			const ruleKey = this.buildRuleKey(source, tupleIndex, skillId, kind);
			const priorCredit = battler.getAutoExecuteSkillTileCredit(ruleKey);
			const nextCredit = priorCredit + 1;
			if (nextCredit < tilesPerExecute) {
				battler.setAutoExecuteSkillTileCredit(ruleKey, nextCredit);
				continue;
			}
			this.#executeSkill(battler, skillId);
			battler.setAutoExecuteSkillTileCredit(ruleKey, 0);
		}
	}
	/**
	* Forwards one Pixelistics tile step from a map character to its underlying battler.
	* @param {Game_Character} character The character that just completed a whole-tile step.
	*/
	static processTileStepFromCharacter(character) {
		const jabsBattler = character.getJabsBattler();
		if (!jabsBattler) return;
		const battler = jabsBattler.getBattler();
		if (!battler) return;
		this.creditTileStep(battler);
	}
	/**
	* Fires resource-specific and {@code anyDmg} auto-execute rules after damage to one pool.
	* @param {Game_Actor|Game_Enemy} battler The battler that took damage.
	* @param {'hpDmg'|'mpDmg'|'tpDmg'} resourceKind Which resource decreased.
	*/
	static scheduleDamageTriggers(battler, resourceKind) {
		battler.tryAutoExecuteSkills(resourceKind);
		battler.tryAutoExecuteSkills("anyDmg");
	}
	/**
	* Fires state-polarity and {@code anyStateAdded} auto-execute after a combat state lands.
	* @param {Game_Actor|Game_Enemy} battler The battler that received the state.
	* @param {number} stateId The database state id that was added.
	*/
	static scheduleStateAddedTriggers(battler, stateId) {
		battler.tryAutoExecuteSkills("anyStateAdded");
		const state = $dataStates[stateId];
		if (!state) return;
		if (state.jabsNegative === true) {
			battler.tryAutoExecuteSkills("negaStateAdded");
		} else {
			battler.tryAutoExecuteSkills("posiStateAdded");
		}
	}
	/**
	* Tries to execute skills for every rule on this battler that matches the given condition kind.
	* @param {Game_Actor|Game_Enemy} battler The battler whose skills may fire.
	* @param {string} conditionKind The condition kind to match (time, hpDmg, whenCrit, etc.).
	*/
	static tryExecute(battler, conditionKind) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		const rules = this.collectRules(battler);
		for (const entry of rules) {
			const { source, tuple, tupleIndex } = entry;
			const skillId = Number(tuple[0]);
			const kind = String(tuple[1]);
			if (Number.isNaN(skillId) || skillId <= 0) continue;
			if (kind !== conditionKind) continue;
			if (kind === "move") continue;
			if (kind === "enemiesNearby") {
				const minCount = Number(tuple[2]);
				const cooldownFrames = Number(tuple[3]);
				const triggerTilesRaw = tuple.length >= 5 ? Number(tuple[4]) : null;
				const triggerTiles = triggerTilesRaw !== null && Number.isNaN(triggerTilesRaw) === false ? triggerTilesRaw : null;
				if (Number.isNaN(minCount) || minCount < 1) continue;
				if (Number.isNaN(cooldownFrames) || cooldownFrames < 0) continue;
				const nearbyCount = PassiveRuleJabsAccess.nearbyEnemies(battler, triggerTiles).length;
				if (nearbyCount < minCount) continue;
				this.#tryExecuteRule(battler, source, tupleIndex, skillId, kind, cooldownFrames);
				continue;
			}
			const param = Number(tuple[2]);
			if (Number.isNaN(param) || param < 0) continue;
			this.#tryExecuteRule(battler, source, tupleIndex, skillId, kind, param);
		}
	}
	/**
	* Gathers auto-execute tuples from every passive-capable source on this battler.
	* @param {Game_Actor|Game_Enemy} battler The battler whose sources should be scanned.
	* @returns {{ source: RPG_BaseItem, tuple: any[], tupleIndex: number }[]} Rules with their originating database row.
	*/
	static collectRules(battler) {
		const collected = [];
		const sources = battler.getPassiveStateSources();
		for (const source of sources) {
			const tuples = source.autoExecuteSkillRules || [];
			for (let tupleIndex = 0; tupleIndex < tuples.length; tupleIndex++) {
				collected.push({
					source,
					tuple: tuples[tupleIndex],
					tupleIndex
				});
			}
		}
		return collected;
	}
	/**
	* Builds a stable cooldown key for one authored rule on one source row.<br/>
	* {@link tupleIndex} is the tag's position in {@link RPG_BaseItem#autoExecuteSkillRules} so duplicate
	* skill/condition pairs on the same row stay independent.
	* @param {RPG_BaseItem} source The database row carrying the tag.
	* @param {number} tupleIndex Zero-based index of this tuple on {@code source}.
	* @param {number} skillId The skill id to execute.
	* @param {string} condition The condition kind string.
	* @returns {string} Unique key for last-execute frame tracking.
	*/
	static buildRuleKey(source, tupleIndex, skillId, condition) {
		const sourceLabel = source.constructor.name || "Unknown";
		const sourceId = source.id;
		return `${sourceLabel}:${sourceId}:${tupleIndex}:${skillId}:${condition}`;
	}
	/**
	* Whether nested auto-execute is blocked by the configured max depth.
	* @returns {boolean}
	*/
	static #isDepthBlocked() {
		const maxDepth = J.PASSIVE.EXT.CONDITIONAL.Metadata.autoExecuteSkillMaxDepth || 1;
		return AutoExecuteSkillManager.#executionDepth >= maxDepth;
	}
	/**
	* Executes one rule when its per-key frame cooldown has elapsed.
	* @param {Game_Actor|Game_Enemy} battler The battler firing the skill.
	* @param {RPG_BaseItem} source The database row that declared the rule.
	* @param {number} tupleIndex Zero-based index of this tuple on {@code source}.
	* @param {number} skillId The skill id to execute.
	* @param {string} condition The condition kind string.
	* @param {number} cooldownFrames Minimum frames between executions for this key.
	*/
	static #tryExecuteRule(battler, source, tupleIndex, skillId, condition, cooldownFrames) {
		if (this.#isDepthBlocked()) return;
		const ruleKey = this.buildRuleKey(source, tupleIndex, skillId, condition);
		const now = Graphics.frameCount;
		const lastFrame = battler.getAutoExecuteSkillLastFrame(ruleKey);
		const elapsed = now - lastFrame;
		if (lastFrame > 0 && elapsed < cooldownFrames) return;
		const executed = this.#executeSkill(battler, skillId);
		if (executed === true) {
			battler.setAutoExecuteSkillLastFrame(ruleKey, now);
		}
	}
	/**
	* Forces one map skill through JABS without cost or cooldown on the payload row.
	* @param {Game_Actor|Game_Enemy} battler The battler firing the skill.
	* @param {number} skillId The database skill id to execute.
	* @returns {boolean} True when forceMapAction was invoked.
	*/
	static #executeSkill(battler, skillId) {
		const jabsBattler = PassiveRuleJabsAccess.getJabsBattler(battler);
		if (!jabsBattler) return false;
		if (Number.isNaN(skillId) || skillId <= 0) return false;
		if (!$dataSkills[skillId]) return false;
		AutoExecuteSkillManager.#executionDepth += 1;
		try {
			const preview = jabsBattler.createJabsActionFromSkill(skillId);
			if (!$jabsEngine.canExecuteMapActions(jabsBattler, preview)) return false;
			$jabsEngine.forceMapAction(jabsBattler, skillId, false);
			return true;
		} finally {
			AutoExecuteSkillManager.#executionDepth -= 1;
		}
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/managers/SkillExecutionStateRemovalManager.js
/**
* Processes {@link RPG_State#removeOnSkillExecutionRules} when a map battler executes a skill.<br/>
* Peels stacks via {@link Game_Battler#decrementStateStacks} using {@code loseAllStacksAtOnce} policy.
*/
var SkillExecutionStateRemovalManager = class {
	/**
	* Rolls removal rules on every combat state this battler currently carries.
	* @param {Game_Actor|Game_Enemy} battler The battler that executed the skill.
	* @param {number} skillId The database skill id that was executed.
	*/
	static process(battler, skillId) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		const skill = $dataSkills[skillId];
		if (!skill) return;
		const executedStype = skill.stypeId;
		const activeStates = battler.states();
		for (const state of activeStates) {
			if (!state) continue;
			const rules = state.removeOnSkillExecutionRules || [];
			for (const tuple of rules) {
				const stypeId = Number(tuple[0]);
				const chance = Number(tuple[1]);
				if (Number.isNaN(chance) || chance <= 0) continue;
				if (stypeId !== 0 && stypeId !== executedStype) continue;
				if (RPGManager.chanceIn100(chance) === false) continue;
				const stateId = state.id;
				const stacksLossCount = this.#resolveStacksLossCount(battler, stateId);
				battler.decrementStateStacks(stateId, stacksLossCount);
			}
		}
	}
	/**
	* Mirrors {@link JABS_State#handleStackLossFromDuration} stack peel amount for one state id.
	* @param {Game_Actor|Game_Enemy} battler The battler losing stacks.
	* @param {number} stateId The database state id to peel.
	* @returns {number} How many stacks to remove in one proc.
	*/
	static #resolveStacksLossCount(battler, stateId) {
		const stateRow = $dataStates[stateId];
		if (!stateRow) return 1;
		const loseAllStacksAtOnce = stateRow.jabsLoseAllStacksAtOnce === true;
		const tracked = $jabsEngine.getJabsStateByUuidAndStateId(battler.getUuid(), stateId);
		if (loseAllStacksAtOnce === true && tracked) {
			return tracked.stackCount;
		}
		return 1;
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/managers/MoveStateRemovalManager.js
/**
* Processes {@link RPG_State#removeStateOnMoveRules} when a map battler moves.<br/>
* Peels stacks via {@link Game_Battler#decrementStateStacks} using {@code loseAllStacksAtOnce} policy,
* then resets the stand cooldown for matching {@code autoApplyState} rules so the rebuild
* interval starts fresh from the moment the battler stops moving.
*/
var MoveStateRemovalManager = class {
	/**
	* Strips states declared by move-removal rules on every state this battler currently carries,
	* then resets the stand auto-apply cooldown for the matching payload so stacking restarts
	* from a full interval rather than firing immediately on the next stand tick.
	* @param {Game_Actor|Game_Enemy} battler The battler that just moved.
	*/
	static process(battler) {
		if (!$jabsEngine || $jabsEngine.absEnabled === false) return;
		const activeStates = battler.allStates();
		for (const state of activeStates) {
			if (!state) continue;
			const rules = state.removeStateOnMoveRules || [];
			for (const tuple of rules) {
				const stateId = Number(tuple[0]);
				if (Number.isNaN(stateId) || stateId <= 0) continue;
				const stacksLossCount = this.#resolveStacksLossCount(battler, stateId);
				battler.decrementStateStacks(stateId, stacksLossCount);
				this.#resetStandCooldown(battler, state, stateId);
			}
		}
	}
	/**
	* Resets the autoApplyState stand cooldown for a given payload state on a given source row.
	* Finds the matching stand tuple by payload state id and stamps its cooldown to now,
	* ensuring the battler must wait the full interval before the first stack reapplies.
	* @param {Game_Actor|Game_Enemy} battler The battler that moved.
	* @param {RPG_State} sourceState The state row carrying the removeStateOnMove + autoApplyState tags.
	* @param {number} payloadStateId The payload state id to match against autoApplyState tuples.
	*/
	static #resetStandCooldown(battler, sourceState, payloadStateId) {
		const tuples = sourceState.autoApplyStateRules || [];
		for (let tupleIndex = 0; tupleIndex < tuples.length; tupleIndex++) {
			const tuple = tuples[tupleIndex];
			const tupleStateId = Number(tuple[0]);
			const condition = String(tuple[1]).toLowerCase();
			if (tupleStateId !== payloadStateId) continue;
			if (condition !== "stand") continue;
			const ruleKey = AutoApplyStateManager.buildRuleKey(sourceState, tupleIndex, payloadStateId, "stand");
			battler.setAutoApplyLastFrame(ruleKey, Graphics.frameCount);
		}
	}
	/**
	* Mirrors {@link JABS_State#handleStackLossFromDuration} stack peel amount for one state id.
	* @param {Game_Actor|Game_Enemy} battler The battler losing stacks.
	* @param {number} stateId The database state id to peel.
	* @returns {number} How many stacks to remove in one proc.
	*/
	static #resolveStacksLossCount(battler, stateId) {
		const stateRow = $dataStates[stateId];
		if (!stateRow) return 1;
		const loseAllStacksAtOnce = stateRow.jabsLoseAllStacksAtOnce === true;
		const tracked = $jabsEngine.getJabsStateByUuidAndStateId(battler.getUuid(), stateId);
		if (loseAllStacksAtOnce === true && tracked) {
			return tracked.stackCount;
		}
		return 1;
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/managers/PassiveGateEvaluator.js
/**
* Evaluates {@link passiveSourceRule}/{@link passiveStateRule} tuples against live battler context.<br/>
* Every tuple on a source/state pair must pass (AND semantics); cross-source stacking is handled upstream in J-Passive.
*/
var PassiveGateEvaluator = class {
	/**
	* Evaluates one gate rule kind against the battler's current map context.<br/>
	* Discrete kinds dispatch in the switch; threshold kinds fall through to {@link #evaluateThresholdKind}.
	* @param {Game_Battler} battler The battler whose context we evaluate.
	* @param {string} kind Rule kind from a parsed note tuple.
	* @param {number|string|null} param Optional tag parameter (count, threshold, slot name, frame count).
	* @returns {boolean} Whether this single tuple passes right now.
	*/
	static evaluate(battler, kind, param) {
		switch (kind) {
			case "alliesNearby": return PassiveRuleJabsAccess.nearbyAlliesExcludingSelf(battler).length >= Number(param);
			case "enemiesNearby": return PassiveRuleJabsAccess.nearbyEnemies(battler).length >= Number(param);
			case "hasState": return battler.isStateAffected(Number(param));
			case "negativeStateCount": return this.countNegativeStates(battler) >= Number(param);
			case "slotOnCooldown": return this.#isSlotOnCooldown(battler, param) === true;
			case "slotOffCooldown": return this.#isSlotOnCooldown(battler, param) === false;
			case "allOnCooldown": return this.#areAllSlotsOnCooldown(battler) === true;
			case "allOffCooldown": return this.#areAllSlotsOnCooldown(battler) === false;
			case "sinceLastMoved": return this.#framesSince(battler.getPassiveRuleLastMovedFrame()) >= Number(param);
			case "sinceLastHit": return this.#framesSince(battler.getPassiveRuleLastHitFrame()) >= Number(param);
			case "sinceLastAttacked": return this.#framesSince(battler.getPassiveRuleLastAttackedFrame()) >= Number(param);
			case "movedWithin": return this.#framesSince(battler.getPassiveRuleLastMovedFrame()) <= Number(param);
			case "hitWithin": return this.#framesSince(battler.getPassiveRuleLastHitFrame()) <= Number(param);
			case "attackedWithin": return this.#framesSince(battler.getPassiveRuleLastAttackedFrame()) <= Number(param);
			case "onHealHp": return this.#framesSince(battler.getPassiveRuleLastHpHealFrame()) <= Number(param);
			case "onHealMp": return this.#framesSince(battler.getPassiveRuleLastMpHealFrame()) <= Number(param);
			case "onHealTp": return this.#framesSince(battler.getPassiveRuleLastTpHealFrame()) <= Number(param);
			default: return this.#evaluateThresholdKind(battler, kind, param);
		}
	}
	/**
	* Evaluates {@code *Above/*Below} and {@code allAllies*} threshold kinds.<br/>
	* Unknown kinds fail closed so tag typos do not silently grant passives.
	* @param {Game_Battler} battler The battler whose values we compare.
	* @param {string} kind Full threshold kind from the note tuple.
	* @param {number|string|null} param Tag threshold integer.
	* @returns {boolean} Whether the threshold gate passes.
	*/
	static #evaluateThresholdKind(battler, kind, param) {
		const allAllies = PassiveRuleThreshold.parseAllAlliesThresholdKind(kind);
		if (allAllies) {
			return PassiveRuleJabsAccess.allAlliedBattlersIncludingSelf(battler).every((allyBattler) => PassiveRuleThreshold.compare(allyBattler, allAllies.key, allAllies.direction, Number(param)));
		}
		const threshold = PassiveRuleThreshold.parseThresholdKind(kind);
		if (!threshold) return false;
		return PassiveRuleThreshold.compare(battler, threshold.key, threshold.direction, Number(param));
	}
	/**
	* Counts negative states currently affecting this battler.<br/>
	* Negative classification comes from {@code state.jabsNegative} / J-ABS {@code <negative>} tag.
	* @param {Game_Battler} battler The battler whose active states we inspect.
	* @returns {number} Count of states flagged negative by J-ABS.
	*/
	static countNegativeStates(battler) {
		return battler.allStates().filter((state) => state && state.jabsNegative === true).length;
	}
	/**
	* Whether one JABS skill slot is currently on cooldown for this battler.<br/>
	* Used by {@code slotOnCooldown} / {@code slotOffCooldown} gate kinds.
	* @param {Game_Battler} battler The battler whose slot we inspect.
	* @param {string|number} slotParam Author tag value (mainhand, skill1, raw button key, etc.).
	* @returns {boolean} True when the slot is cooling down; false when ready or off-map.
	*/
	static #isSlotOnCooldown(battler, slotParam) {
		const jabsBattler = PassiveRuleJabsAccess.getJabsBattler(battler);
		if (!jabsBattler) return false;
		const slotKey = PassiveRuleJabsAccess.resolveSlotKey(slotParam);
		return jabsBattler.isSkillTypeCooldownReady(slotKey) === false;
	}
	/**
	* Whether every registered JABS skill slot is on cooldown simultaneously.<br/>
	* Used by {@code allOnCooldown} / {@code allOffCooldown} source-wide gate kinds.
	* @param {Game_Battler} battler The battler whose slot manager we inspect.
	* @returns {boolean} True only when every slot reports not-ready.
	*/
	static #areAllSlotsOnCooldown(battler) {
		const jabsBattler = PassiveRuleJabsAccess.getJabsBattler(battler);
		if (!jabsBattler) return false;
		const slotManager = jabsBattler.getBattler().getSkillSlotManager();
		if (!slotManager) return false;
		return slotManager.getAllSlots().every((slot) => jabsBattler.isSkillTypeCooldownReady(slot.key) === false);
	}
	/**
	* Frames elapsed since a passive-rule timestamp was stamped.<br/>
	* Never-stamped events behave as "since forever" for sinceLast* kinds.
	* @param {number} stampFrame {@link Graphics.frameCount} when the event last occurred (0 = never).
	* @returns {number} Elapsed frames since the stamp.
	*/
	static #framesSince(stampFrame) {
		if (stampFrame <= 0) return Graphics.frameCount;
		return Graphics.frameCount - stampFrame;
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/managers/PassiveStackCountEvaluator.js
/**
* Evaluates {@link passiveStateCount} tuples into stack contribution counts.<br/>
* Returns integer stack totals per source; 0 is valid and excludes that source from the stack map upstream.
*/
var PassiveStackCountEvaluator = class {
	/**
	* Evaluates one parsed {@code passiveStateCount} tuple from database notes.<br/>
	* Delegates to {@link #evaluate} after unpacking {@code [stateId, kind, param]}.
	* @param {Game_Battler} battler The battler whose live context drives the count.
	* @param {any[]} tuple Parsed note tuple {@code [stateId, kind, param]}.
	* @returns {number} Stack contribution from this source (0 is valid).
	*/
	static evaluateTuple(battler, tuple) {
		const [, kind, param] = tuple;
		return this.evaluate(battler, kind, param);
	}
	/**
	* Resolves a stack-count kind into an integer contribution for one source.<br/>
	* All formulas use {@code Math.floor(value / param)} so partial thresholds do not grant extra stacks.
	* @param {Game_Battler} battler The battler whose live context drives the count.
	* @param {string} kind Stack scaler kind from the note tuple.
	* @param {number|string|null} param Divisor or points-per-stack from the note tuple.
	* @returns {number} Stack contribution from this source (0 when kind is unknown).
	*/
	static evaluate(battler, kind, param) {
		if (kind.startsWith("per-")) {
			return this.#evaluatePerParam(battler, kind.slice(4), Number(param));
		}
		switch (kind) {
			case "negativeStateCount": return Math.floor(PassiveGateEvaluator.countNegativeStates(battler) / Number(param));
			case "alliesNearby": return Math.floor(PassiveRuleJabsAccess.nearbyAlliesExcludingSelf(battler).length / Number(param));
			case "lessIsMoreHp": return Math.floor(this.#missingResourcePercent(battler, "hp") / Number(param));
			case "lessIsMoreMp": return Math.floor(this.#missingResourcePercent(battler, "mp") / Number(param));
			case "lessIsMoreTp": return Math.floor(this.#missingResourcePercent(battler, "tp") / Number(param));
			case "moreIsMoreHp": return Math.floor(PassiveRuleThreshold.resolveRuleValue(battler, "hp") / Number(param));
			case "moreIsMoreMp": return Math.floor(PassiveRuleThreshold.resolveRuleValue(battler, "mp") / Number(param));
			case "moreIsMoreTp": return Math.floor(PassiveRuleThreshold.resolveRuleValue(battler, "tp") / Number(param));
			default: return 0;
		}
	}
	/**
	* Scales stacks from a registry or resource key using {@code per-{key}, pointsPerStack} tags.<br/>
	* Example: {@code per-cri, 3} at 9% crit → {@code floor(9 / 3) = 3} stacks.
	* @param {Game_Battler} battler The battler whose parameter value we read.
	* @param {string} key Registry or resource key after the {@code per-} prefix.
	* @param {number} pointsPerStack Tag param — every this-many points grants one stack.
	* @returns {number} Floored stack count; zero when pointsPerStack is invalid.
	*/
	static #evaluatePerParam(battler, key, pointsPerStack) {
		if (pointsPerStack <= 0) return 0;
		const value = PassiveRuleThreshold.resolveRuleValue(battler, key);
		return Math.floor(value / pointsPerStack);
	}
	/**
	* Computes how much of a resource is missing, as a percent, for {@code lessIsMore*} stack kinds.<br/>
	* Full resource → 0 missing; empty resource → 100 missing.
	* @param {Game_Battler} battler The battler whose resource we inspect.
	* @param {string} resource One of {@code hp}, {@code mp}, or {@code tp}.
	* @returns {number} Whole-number percent missing (0–100).
	*/
	static #missingResourcePercent(battler, resource) {
		const current = PassiveRuleThreshold.resolveRuleValue(battler, resource);
		return Math.max(0, 100 - current);
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/objects/Game_Battler.js
/**
* Extends {@link #initPassiveStatesMembers}.<br/>
* Adds passive rule tracking frames and reconcile timer storage.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.set("initPassiveStatesMembers", Game_Battler.prototype.initPassiveStatesMembers);
Game_Battler.prototype.initPassiveStatesMembers = function() {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.get("initPassiveStatesMembers").call(this);
	this.initPassiveRuleMembers();
};
/**
* Initializes members used by passive rule evaluation and drift reconciliation.<br/>
* Stored under {@code _j._passive._conditional} alongside passive core's state tracker.
*/
Game_Battler.prototype.initPassiveRuleMembers = function() {
	/**
	* A grouping of passive rule runtime data.
	*/
	this._j._passive._conditional = {};
	/**
	* Cached passive collection fingerprint for cheap drift checks on the map.
	* @type {string}
	*/
	this._j._passive._conditional._collectionFingerprint = String.empty;
	/**
	* Fingerprint computed by the current drift check, held briefly so the post-refresh
	* alias can apply it directly instead of re-running both collectors a third time.
	* Null outside of an active reconcilePassiveRules call.
	* @type {string|null}
	*/
	this._j._passive._conditional._pendingFingerprint = null;
	/**
	* Throttled reconcile timer for map-side rule drift.
	* @type {JABS_Timer}
	*/
	const delay = J.PASSIVE.EXT.CONDITIONAL.Metadata.reconcileDelayFrames || 15;
	this._j._passive._conditional._timer = new JABS_Timer(delay);
	/**
	* Last map frame this battler moved.
	* @type {number}
	*/
	this._j._passive._conditional._lastMovedFrame = 0;
	/**
	* Last map frame this battler took damage.
	* @type {number}
	*/
	this._j._passive._conditional._lastHitFrame = 0;
	/**
	* Last map frame this battler executed a map skill.
	* @type {number}
	*/
	this._j._passive._conditional._lastAttackedFrame = 0;
	/**
	* Last known real X coordinate of the map character; seeded on first JABS update.
	* @type {number|null}
	*/
	this._j._passive._conditional._lastTrackedX = null;
	/**
	* Last known real Y coordinate of the map character; seeded on first JABS update.
	* @type {number|null}
	*/
	this._j._passive._conditional._lastTrackedY = null;
	/**
	* Last map frame this battler received positive HP recovery.
	* @type {number}
	*/
	this._j._passive._conditional._lastHpHealFrame = 0;
	/**
	* Last map frame this battler received positive MP recovery.
	* @type {number}
	*/
	this._j._passive._conditional._lastMpHealFrame = 0;
	/**
	* Last map frame this battler received positive TP recovery.
	* @type {number}
	*/
	this._j._passive._conditional._lastTpHealFrame = 0;
	/**
	* Per-rule cooldown stamps for {@link AutoApplyStateManager} (rule key → frame).
	* @type {Map<string, number>}
	*/
	this._j._passive._conditional._autoApplyLastFrame = new Map();
	/**
	* Per-rule whole-tile credit toward {@code move} auto-apply rules (rule key → tiles).
	* @type {Map<string, number>}
	*/
	this._j._passive._conditional._autoApplyTileCredit = new Map();
	/**
	* Per-rule cooldown stamps for {@link AutoExecuteSkillManager} (rule key → frame).
	* @type {Map<string, number>}
	*/
	this._j._passive._conditional._autoExecuteSkillLastFrame = new Map();
	/**
	* Per-rule whole-tile credit toward {@code move} auto-execute rules (rule key → tiles).
	* @type {Map<string, number>}
	*/
	this._j._passive._conditional._autoExecuteSkillTileCredit = new Map();
};
/**
* Returns per-rule whole-tile credit toward {@code move} auto-apply rules.
* @returns {Map<string, number>}
*/
Game_Battler.prototype.getAutoApplyTileCreditMap = function() {
	return this._j._passive._conditional._autoApplyTileCredit;
};
/**
* Reads accumulated whole-tile credit for one {@code move} rule key.
* @param {string} ruleKey Stable key from {@link AutoApplyStateManager.buildRuleKey}.
* @returns {number}
*/
Game_Battler.prototype.getAutoApplyTileCredit = function(ruleKey) {
	return this.getAutoApplyTileCreditMap().get(ruleKey) || 0;
};
/**
* Stores accumulated whole-tile credit for one {@code move} rule key.
* @param {string} ruleKey Stable key from {@link AutoApplyStateManager.buildRuleKey}.
* @param {number} tiles Whole tiles credited toward the next apply.
*/
Game_Battler.prototype.setAutoApplyTileCredit = function(ruleKey, tiles) {
	this.getAutoApplyTileCreditMap().set(ruleKey, tiles);
};
/**
* Returns per-rule frame cooldown stamps for auto-apply rules.
* @returns {Map<string, number>}
*/
Game_Battler.prototype.getAutoApplyLastFrameMap = function() {
	return this._j._passive._conditional._autoApplyLastFrame;
};
/**
* Reads the last map frame an auto-apply rule key fired.
* @param {string} ruleKey Stable key from {@link AutoApplyStateManager.buildRuleKey}.
* @returns {number}
*/
Game_Battler.prototype.getAutoApplyLastFrame = function(ruleKey) {
	return this.getAutoApplyLastFrameMap().get(ruleKey) || 0;
};
/**
* Stamps the last map frame an auto-apply rule key fired.
* @param {string} ruleKey Stable key from {@link AutoApplyStateManager.buildRuleKey}.
* @param {number} frame {@link Graphics.frameCount} when the rule last applied.
*/
Game_Battler.prototype.setAutoApplyLastFrame = function(ruleKey, frame) {
	this.getAutoApplyLastFrameMap().set(ruleKey, frame);
};
/**
* Delegates auto-apply scheduling for one condition kind to {@link AutoApplyStateManager}.
* @param {string} conditionKind The condition kind to evaluate (time, hpDmg, whenCrit, etc.).
*/
Game_Battler.prototype.tryAutoApplyStates = function(conditionKind) {
	AutoApplyStateManager.tryApply(this, conditionKind);
};
/**
* Returns per-rule whole-tile credit toward {@code move} auto-execute rules.
* @returns {Map<string, number>}
*/
Game_Battler.prototype.getAutoExecuteSkillTileCreditMap = function() {
	return this._j._passive._conditional._autoExecuteSkillTileCredit;
};
/**
* Reads accumulated whole-tile credit for one {@code move} auto-execute rule key.
* @param {string} ruleKey Stable key from {@link AutoExecuteSkillManager.buildRuleKey}.
* @returns {number}
*/
Game_Battler.prototype.getAutoExecuteSkillTileCredit = function(ruleKey) {
	return this.getAutoExecuteSkillTileCreditMap().get(ruleKey) || 0;
};
/**
* Stores accumulated whole-tile credit for one {@code move} auto-execute rule key.
* @param {string} ruleKey Stable key from {@link AutoExecuteSkillManager.buildRuleKey}.
* @param {number} tiles Whole tiles credited toward the next execution.
*/
Game_Battler.prototype.setAutoExecuteSkillTileCredit = function(ruleKey, tiles) {
	this.getAutoExecuteSkillTileCreditMap().set(ruleKey, tiles);
};
/**
* Returns per-rule frame cooldown stamps for auto-execute rules.
* @returns {Map<string, number>}
*/
Game_Battler.prototype.getAutoExecuteSkillLastFrameMap = function() {
	return this._j._passive._conditional._autoExecuteSkillLastFrame;
};
/**
* Reads the last map frame an auto-execute rule key fired.
* @param {string} ruleKey Stable key from {@link AutoExecuteSkillManager.buildRuleKey}.
* @returns {number}
*/
Game_Battler.prototype.getAutoExecuteSkillLastFrame = function(ruleKey) {
	return this.getAutoExecuteSkillLastFrameMap().get(ruleKey) || 0;
};
/**
* Stamps the last map frame an auto-execute rule key fired.
* @param {string} ruleKey Stable key from {@link AutoExecuteSkillManager.buildRuleKey}.
* @param {number} frame {@link Graphics.frameCount} when the rule last executed.
*/
Game_Battler.prototype.setAutoExecuteSkillLastFrame = function(ruleKey, frame) {
	this.getAutoExecuteSkillLastFrameMap().set(ruleKey, frame);
};
/**
* Delegates auto-execute scheduling for one condition kind to {@link AutoExecuteSkillManager}.
* @param {string} conditionKind The condition kind to evaluate (time, hpDmg, whenCrit, etc.).
*/
Game_Battler.prototype.tryAutoExecuteSkills = function(conditionKind) {
	AutoExecuteSkillManager.tryExecute(this, conditionKind);
};
/**
* Returns the last map frame this battler moved.<br/>
* Read by {@code sinceLastMoved} / {@code movedWithin} gate kinds.
* @returns {number} {@link Graphics.frameCount} stamp, or 0 when never moved on the map.
*/
Game_Battler.prototype.getPassiveRuleLastMovedFrame = function() {
	return this._j._passive._conditional._lastMovedFrame;
};
/**
* Returns the last map frame this battler took damage.<br/>
* Read by {@code sinceLastHit} / {@code hitWithin} gate kinds.
* @returns {number} {@link Graphics.frameCount} stamp, or 0 when never hit on the map.
*/
Game_Battler.prototype.getPassiveRuleLastHitFrame = function() {
	return this._j._passive._conditional._lastHitFrame;
};
/**
* Returns the last map frame this battler executed a map skill.<br/>
* Read by {@code sinceLastAttacked} / {@code attackedWithin} gate kinds.
* @returns {number} {@link Graphics.frameCount} stamp, or 0 when never attacked on the map.
*/
Game_Battler.prototype.getPassiveRuleLastAttackedFrame = function() {
	return this._j._passive._conditional._lastAttackedFrame;
};
/**
* Stamps the current frame as the last time this battler moved on the map.<br/>
* Called from {@link JABS_Battler#updatePassiveRuleMovementTracking} when coordinates change.
*/
Game_Battler.prototype.stampPassiveRuleMovedFrame = function() {
	this._j._passive._conditional._lastMovedFrame = Graphics.frameCount;
};
/**
* Stamps the current frame as the last time this battler took damage.<br/>
* Called from the {@link #gainHp} alias when hp loss is applied.
*/
Game_Battler.prototype.stampPassiveRuleHitFrame = function() {
	this._j._passive._conditional._lastHitFrame = Graphics.frameCount;
};
/**
* Stamps the current frame as the last time this battler executed a map skill.<br/>
* Called from {@link JABS_Battler#setLastUsedSkillId} after a real skill use.
*/
Game_Battler.prototype.stampPassiveRuleAttackedFrame = function() {
	this._j._passive._conditional._lastAttackedFrame = Graphics.frameCount;
};
/**
* Returns the last frame this battler received positive HP recovery.<br/>
* Read by the {@code onHealHp} gate kind.
* @returns {number} {@link Graphics.frameCount} stamp, or 0 when never healed.
*/
Game_Battler.prototype.getPassiveRuleLastHpHealFrame = function() {
	return this._j._passive._conditional._lastHpHealFrame;
};
/**
* Returns the last frame this battler received positive MP recovery.<br/>
* Read by the {@code onHealMp} gate kind.
* @returns {number} {@link Graphics.frameCount} stamp, or 0 when never healed.
*/
Game_Battler.prototype.getPassiveRuleLastMpHealFrame = function() {
	return this._j._passive._conditional._lastMpHealFrame;
};
/**
* Returns the last frame this battler received positive TP recovery.<br/>
* Read by the {@code onHealTp} gate kind.
* @returns {number} {@link Graphics.frameCount} stamp, or 0 when never healed.
*/
Game_Battler.prototype.getPassiveRuleLastTpHealFrame = function() {
	return this._j._passive._conditional._lastTpHealFrame;
};
/**
* Stamps the current frame as the last time this battler received HP healing.
*/
Game_Battler.prototype.stampPassiveRuleHpHealFrame = function() {
	this._j._passive._conditional._lastHpHealFrame = Graphics.frameCount;
};
/**
* Stamps the current frame as the last time this battler received MP healing.
*/
Game_Battler.prototype.stampPassiveRuleMpHealFrame = function() {
	this._j._passive._conditional._lastMpHealFrame = Graphics.frameCount;
};
/**
* Stamps the current frame as the last time this battler received TP healing.
*/
Game_Battler.prototype.stampPassiveRuleTpHealFrame = function() {
	this._j._passive._conditional._lastTpHealFrame = Graphics.frameCount;
};
/**
* Extends {@link #gainHp}.<br/>
* Records damage timestamps for {@link passiveStateRule} kinds that care about hit windows.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.set("gainHp", Game_Battler.prototype.gainHp);
Game_Battler.prototype.gainHp = function(value) {
	if (value < 0) {
		this.stampPassiveRuleHitFrame();
	}
	J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.get("gainHp").call(this, value);
	if (value < 0) {
		AutoApplyStateManager.scheduleDamageTriggers(this, "hpDmg");
		AutoExecuteSkillManager.scheduleDamageTriggers(this, "hpDmg");
	}
};
/**
* Extends {@link #gainMp}.<br/>
* Fires mpDmg auto-apply rules when MP is reduced.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.set("gainMp", Game_Battler.prototype.gainMp);
Game_Battler.prototype.gainMp = function(value) {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.get("gainMp").call(this, value);
	if (value < 0) {
		AutoApplyStateManager.scheduleDamageTriggers(this, "mpDmg");
		AutoExecuteSkillManager.scheduleDamageTriggers(this, "mpDmg");
	}
};
/**
* Extends {@link #gainTp}.<br/>
* Fires tpDmg auto-apply rules when TP is reduced.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.set("gainTp", Game_Battler.prototype.gainTp);
Game_Battler.prototype.gainTp = function(value) {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.get("gainTp").call(this, value);
	if (value < 0) {
		AutoApplyStateManager.scheduleDamageTriggers(this, "tpDmg");
		AutoExecuteSkillManager.scheduleDamageTriggers(this, "tpDmg");
	}
};
/**
* Extends {@link #onHeal}.<br/>
* Stamps the appropriate heal-frame counter so {@link PassiveGateEvaluator} can check
* whether a heal occurred recently enough for an {@code onHealHp/Mp/Tp} gate to pass.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.set("onHeal", Game_Battler.prototype.onHeal);
Game_Battler.prototype.onHeal = function(resource, amount) {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.get("onHeal").call(this, resource, amount);
	if (resource === J.BASE.Resource.HP) {
		this.stampPassiveRuleHpHealFrame();
	} else if (resource === J.BASE.Resource.MP) {
		this.stampPassiveRuleMpHealFrame();
	} else if (resource === J.BASE.Resource.TP) {
		this.stampPassiveRuleTpHealFrame();
	}
};
/**
* Extends {@link #canIncludePassiveStateFromSource}.<br/>
* Applies passiveSourceRule and passiveStateRule gates for this source/state pair.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.set("canIncludePassiveStateFromSource", Game_Battler.prototype.canIncludePassiveStateFromSource);
Game_Battler.prototype.canIncludePassiveStateFromSource = function(baseItem, stateId) {
	if (J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.get("canIncludePassiveStateFromSource").call(this, baseItem, stateId) === false) {
		return false;
	}
	return this.evaluatePassiveGateRulesForSource(baseItem, stateId);
};
/**
* Extends {@link #getPassiveStackContributionFromSource}.<br/>
* Applies passiveStateCount scaling when declared for this source/state pair.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.set("getPassiveStackContributionFromSource", Game_Battler.prototype.getPassiveStackContributionFromSource);
Game_Battler.prototype.getPassiveStackContributionFromSource = function(baseItem, stateId) {
	const countTuple = this.findPassiveStateCountTuple(baseItem, stateId);
	if (countTuple === null) {
		return J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.get("getPassiveStackContributionFromSource").call(this, baseItem, stateId);
	}
	return PassiveStackCountEvaluator.evaluateTuple(this, countTuple);
};
/**
* Evaluates every gate rule on a source that applies to the given passive state id.<br/>
* Returns true when no rules apply (unconditional passive) or when every tuple passes.
* @param {RPG_BaseItem} baseItem Database row carrying passive and rule tags.
* @param {number} stateId Passive state id being collected from this source.
* @returns {boolean} Whether this source may contribute the given passive state right now.
*/
Game_Battler.prototype.evaluatePassiveGateRulesForSource = function(baseItem, stateId) {
	const rules = this.collectPassiveGateRuleTuples(baseItem, stateId);
	if (rules.length === 0) return true;
	return rules.every((tuple) => {
		const kind = tuple.length === 2 ? tuple[0] : tuple[1];
		const param = tuple.length === 2 ? tuple[1] : tuple[2];
		return PassiveGateEvaluator.evaluate(this, kind, param);
	});
};
/**
* Collects source-wide and state-specific gate tuples for one passive state id.<br/>
* Source rules always apply; state rules are filtered to the requested state id.
* @param {RPG_BaseItem} baseItem Database row carrying passive and rule tags.
* @param {number} stateId Passive state id being collected from this source.
* @returns {any[][]} Combined gate tuples in evaluation order.
*/
Game_Battler.prototype.collectPassiveGateRuleTuples = function(baseItem, stateId) {
	const sourceRules = baseItem.passiveSourceRules || [];
	const stateRules = (baseItem.passiveStateRules || []).filter((tuple) => Number(tuple[0]) === stateId);
	return sourceRules.concat(stateRules);
};
/**
* Finds the first passiveStateCount tuple targeting a passive state id on this source.<br/>
* When authors duplicate tags, the first match wins.
* @param {RPG_BaseItem} baseItem Database row carrying passive and rule tags.
* @param {number} stateId Passive state id whose stack scaler we want.
* @returns {any[]|null} Parsed {@code [stateId, kind, param]} tuple, or null when none.
*/
Game_Battler.prototype.findPassiveStateCountTuple = function(baseItem, stateId) {
	const matches = (baseItem.passiveStateCounts || []).filter((tuple) => Number(tuple[0]) === stateId);
	if (matches.length === 0) return null;
	return matches[0];
};
/**
* Builds a fingerprint of the current passive collection without mutating the tracker.<br/>
* Uses the pre-filtered {@link #passiveCapableSources} list from the last refresh rather than
* re-invoking the full collectors — sources like weapon combat skills that carry no passive tags
* are already excluded, so only the relevant subset is evaluated against live gate rules.
* @returns {string} Stable JSON fingerprint of unique ids and stack entries.
*/
Game_Battler.prototype.buildPassiveCollectionFingerprint = function() {
	const sources = this.passiveCapableSources();
	const uniqueIds = [];
	/** @type {Map<number, number>} */
	const stackMap = new Map();
	sources.forEach((source) => {
		let uniqueSourceIds = source.uniquePassiveStateIds || [];
		if (source instanceof RPG_EquipItem) {
			uniqueSourceIds = uniqueSourceIds.concat(source.uniqueEquippedPassiveStateIds || []);
		}
		uniqueSourceIds.forEach((id) => {
			if (this.canIncludePassiveStateFromSource(source, id)) {
				uniqueIds.push(id);
			}
		});
		let stackableSourceIds = source.passiveStateIds || [];
		if (source instanceof RPG_EquipItem) {
			stackableSourceIds = stackableSourceIds.concat(source.equippedPassiveStateIds || []);
		}
		stackableSourceIds.forEach((id) => {
			if (this.canIncludePassiveStateFromSource(source, id) === false) return;
			const contribution = this.getPassiveStackContributionFromSource(source, id);
			if (contribution <= 0) return;
			const running = stackMap.has(id) ? stackMap.get(id) : 0;
			stackMap.set(id, running + contribution);
		});
	});
	uniqueIds.sort((left, right) => left - right);
	const stackEntries = [...stackMap.entries()].sort((left, right) => left[0] - right[0]);
	return JSON.stringify({
		uniqueIds,
		stackEntries
	});
};
/**
* Stores the latest passive collection fingerprint after a refresh pass.<br/>
* When called from within a {@link reconcilePassiveRules} cycle the pending fingerprint is
* reused directly — the drift check already ran both collectors, so running them a third
* time would be redundant.  Outside that cycle (e.g. equip/unequip) both collectors run
* fresh to produce an accurate baseline.
*/
Game_Battler.prototype.updatePassiveRuleCollectionFingerprint = function() {
	const pending = this._j._passive._conditional._pendingFingerprint;
	if (pending !== null) {
		this._j._passive._conditional._collectionFingerprint = pending;
		return;
	}
	this._j._passive._conditional._collectionFingerprint = this.buildPassiveCollectionFingerprint();
};
/**
* Re-checks whether passive rule drift changed the collection; refreshes when it did.<br/>
* Called from the throttled reconcile timer while the battler is active on the map.
*/
Game_Battler.prototype.reconcilePassiveRules = function() {
	const nextFingerprint = this.buildPassiveCollectionFingerprint();
	const previousFingerprint = this._j._passive._conditional._collectionFingerprint;
	if (nextFingerprint === previousFingerprint) return;
	this._j._passive._conditional._pendingFingerprint = nextFingerprint;
	this.refreshPassiveStates();
	this._j._passive._conditional._pendingFingerprint = null;
};
/**
* Returns the throttled reconcile timer used while this battler is active on the map.<br/>
* Interval comes from {@link reconcile-delay-frames} plugin param.
* @returns {JABS_Timer} Repeating timer owned by this battler's conditional storage.
*/
Game_Battler.prototype.passiveRuleReconcileTimer = function() {
	return this._j._passive._conditional._timer;
};
/**
* Advances the reconcile timer and triggers a passive refresh when rule drift is detected.<br/>
* Reset-after-fire pattern keeps reconcile work off every single map frame.
*/
Game_Battler.prototype.updatePassiveRuleReconcileTimer = function() {
	const timer = this.passiveRuleReconcileTimer();
	timer.update();
	if (timer.isTimerComplete() === false) return;
	timer.reset();
	this.reconcilePassiveRules();
};
/**
* Extends {@link #refreshPassiveStates}.<br/>
* Updates the cached collection fingerprint after passive core rebuilds the tracker.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.set("refreshPassiveStates", Game_Battler.prototype.refreshPassiveStates);
Game_Battler.prototype.refreshPassiveStates = function() {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.get("refreshPassiveStates").call(this);
	this.updatePassiveRuleCollectionFingerprint();
};
/**
* Extends {@link #onStateAdded}.<br/>
* Fires anyStateAdded plus posi/nega polarity auto-apply when a combat state lands.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.set("onStateAdded", Game_Battler.prototype.onStateAdded);
Game_Battler.prototype.onStateAdded = function(stateId) {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.get("onStateAdded").call(this, stateId);
	AutoApplyStateManager.scheduleStateAddedTriggers(this, stateId);
	AutoExecuteSkillManager.scheduleStateAddedTriggers(this, stateId);
};

//#endregion
//#region src/plugins/passive/ext/conditional/objects/Game_Action.js
/**
* Extends {@link #apply}.<br/>
* When the target is critically hit, runs {@code whenCrit} auto-apply rules on the victim.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Action.set("apply", Game_Action.prototype.apply);
Game_Action.prototype.apply = function(target) {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Action.get("apply").call(this, target);
	if (target.result().critical === false) return;
	target.tryAutoApplyStates("whenCrit");
	target.tryAutoExecuteSkills("whenCrit");
};

//#endregion
//#region src/plugins/passive/ext/conditional/objects/Game_CharacterBase.js
/**
* Extends {@link Game_CharacterBase#updatePixelStepping}.<br/>
* Credits whole tiles toward {@code move} auto-apply after Pixelistics fires a step.<br/>
* Hooks stepping instead of {@link Game_CharacterBase#onStep} because J-Pixelistics aliases
* {@link Game_Player#onStep} on its own prototype (player steps never reach a base-only onStep chain).
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_CharacterBase.set("updatePixelStepping", Game_CharacterBase.prototype.updatePixelStepping);
Game_CharacterBase.prototype.updatePixelStepping = function() {
	const tookStep = this.moveDistance() >= this.stepDistance();
	J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_CharacterBase.get("updatePixelStepping").call(this);
	if (tookStep === false) return;
	AutoApplyStateManager.processTileStepFromCharacter(this);
	AutoExecuteSkillManager.processTileStepFromCharacter(this);
};

//#endregion
//#region src/plugins/passive/ext/conditional/managers/JABS_Battler.js
/**
* Extends {@link JABS_Battler#update}.<br/>
* Throttles passive rule reconciles and stamps movement timestamps for sinceLast/movedWithin rules.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.JABS_Battler.set("update", JABS_Battler.prototype.update);
JABS_Battler.prototype.update = function() {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.JABS_Battler.get("update").call(this);
	this.updatePassiveRuleMovementTracking();
	this.updatePassiveRuleReconcile();
};
/**
* Extends {@link JABS_Battler#setLastUsedSkillId}.<br/>
* Stamps attack timestamps when this battler executes map skills.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.JABS_Battler.set("setLastUsedSkillId", JABS_Battler.prototype.setLastUsedSkillId);
JABS_Battler.prototype.setLastUsedSkillId = function(skillId) {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.JABS_Battler.get("setLastUsedSkillId").call(this, skillId);
	const battler = this.getBattler();
	if (!battler) return;
	battler.stampPassiveRuleAttackedFrame();
	SkillExecutionStateRemovalManager.process(battler, skillId);
};
/**
* Delegates throttled passive rule reconciliation to the underlying battler.<br/>
* Called every JABS update tick while this map battler is active.
*/
JABS_Battler.prototype.updatePassiveRuleReconcile = function() {
	const battler = this.getBattler();
	if (!battler) return;
	battler.updatePassiveRuleReconcileTimer();
	AutoApplyStateManager.processTimeRules(battler);
	AutoExecuteSkillManager.processTimeRules(battler);
	AutoExecuteSkillManager.processEnemiesNearbyRules(battler);
	AutoApplyStateManager.processStandRules(battler);
	AutoExecuteSkillManager.processStandRules(battler);
};
/**
* Stamps movement when this map battler's character coordinates change.<br/>
* Feeds {@code sinceLastMoved} and {@code movedWithin} gate kinds on the underlying battler.
*/
JABS_Battler.prototype.updatePassiveRuleMovementTracking = function() {
	const character = this.getCharacter();
	if (!character) return;
	const battler = this.getBattler();
	if (!battler) return;
	const tracker = battler._j._passive._conditional;
	const currentX = character._realX;
	const currentY = character._realY;
	if (tracker._lastTrackedX === null) {
		tracker._lastTrackedX = currentX;
		tracker._lastTrackedY = currentY;
		return;
	}
	if (tracker._lastTrackedX === currentX && tracker._lastTrackedY === currentY) return;
	tracker._lastTrackedX = currentX;
	tracker._lastTrackedY = currentY;
	battler.stampPassiveRuleMovedFrame();
	MoveStateRemovalManager.process(battler);
};

//#endregion
//#region src/plugins/passive/ext/conditional/__models/AutoApplyStateDisplay.js
/**
* Player-facing prose for {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoApplyState} tuples.<br/>
* Handles {@code time} and {@code stand} conditions; other kinds are skipped until a passive needs them.
*/
var AutoApplyStateDisplay = class AutoApplyStateDisplay {
	/**
	* Formats map-timer param as a player-facing seconds phrase.
	* @param {number} frames Interval in frames (60 frames ≈ 1 second).
	* @returns {string}
	*/
	static intervalPhrase(frames) {
		const sec = frames / 60;
		if (Number.isInteger(sec)) {
			return `${sec} seconds`;
		}
		const rounded = Math.round(sec * 100) / 100;
		const display = parseFloat(rounded.toFixed(2));
		return `~${display} seconds`;
	}
	/**
	* Wraps one highlight fragment with italic, bold, and color for drawTextEx.
	* @param {Window_Base} window Host window supplying text style helpers.
	* @param {number} colorIndex Palette index for {@link Window_Base#colorizeText}.
	* @param {string} text Inner phrase to emphasize.
	* @returns {string}
	*/
	static highlightPhrase(window, colorIndex, text) {
		return window.colorizeText(colorIndex, window.boldenText(window.italicizeText(text)));
	}
	/**
	* Formats one parsed time autoApplyState tuple as drawTextEx prose.
	* Applied state renders via {@code \\state[STATE_ID]} (J-Message icon + name).
	* @param {number} stateId Database state id from the parsed tuple.
	* @param {number} param Frame interval from the parsed tuple.
	* @param {Window_Base} window Host window supplying bold/color text helpers.
	* @returns {string}
	*/
	static formatTimeProse(stateId, param, window) {
		const interval = AutoApplyStateDisplay.highlightPhrase(window, 6, AutoApplyStateDisplay.intervalPhrase(param));
		return `Every ${interval}, gain \\state[${stateId}].`;
	}
	/**
	* Formats one parsed stand autoApplyState tuple as drawTextEx prose.
	* @param {number} stateId Database state id from the parsed tuple.
	* @param {number} param Frame interval from the parsed tuple.
	* @param {Window_Base} window Host window supplying bold/color text helpers.
	* @returns {string}
	*/
	static formatStandProse(stateId, param, window) {
		const interval = AutoApplyStateDisplay.highlightPhrase(window, 6, AutoApplyStateDisplay.intervalPhrase(param));
		return `While standing still, gain \\state[${stateId}] every ${interval}.`;
	}
	/**
	* Builds drawTextEx prose lines for every time autoApplyState tag on a database row.
	* @param {RPG_BaseItem} dataRow State, skill, or equip row bearing notes.
	* @param {Window_Base} window Host window supplying bold/color text helpers.
	* @returns {string[]}
	*/
	static collectTimeProseLines(dataRow, window) {
		return AutoApplyStateDisplay.#collectProseLinesByCondition(dataRow, window, "time");
	}
	/**
	* Builds drawTextEx prose lines for every stand autoApplyState tag on a database row.
	* @param {RPG_BaseItem} dataRow State, skill, or equip row bearing notes.
	* @param {Window_Base} window Host window supplying bold/color text helpers.
	* @returns {string[]}
	*/
	static collectStandProseLines(dataRow, window) {
		return AutoApplyStateDisplay.#collectProseLinesByCondition(dataRow, window, "stand");
	}
	/**
	* Shared collector — filters autoApplyState tuples by condition kind and formats prose.
	* @param {RPG_BaseItem} dataRow State, skill, or equip row bearing notes.
	* @param {Window_Base} window Host window supplying bold/color text helpers.
	* @param {string} conditionKind The condition kind to match ('time' or 'stand').
	* @returns {string[]}
	*/
	static #collectProseLinesByCondition(dataRow, window, conditionKind) {
		const tuples = RPGManager.getArraysFromNotesByRegex(dataRow, J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoApplyState, true);
		const lines = [];
		for (const tuple of tuples) {
			const stateId = Number(tuple[0]);
			const condition = String(tuple[1]).toLowerCase();
			const param = Number(tuple[2]);
			if (Number.isNaN(stateId) || stateId < 1) continue;
			if (condition !== conditionKind) continue;
			if (Number.isNaN(param) || param < 1) continue;
			if (conditionKind === "time") {
				lines.push(AutoApplyStateDisplay.formatTimeProse(stateId, param, window));
			} else if (conditionKind === "stand") {
				lines.push(AutoApplyStateDisplay.formatStandProse(stateId, param, window));
			}
		}
		return lines;
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/__models/RemoveStateOnMoveDisplay.js
/**
* Player-facing prose for {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.RemoveStateOnMove} tuples.
*/
var RemoveStateOnMoveDisplay = class RemoveStateOnMoveDisplay {
	/**
	* Formats one parsed removeStateOnMove tuple as drawTextEx prose.
	* @param {number} stateId Database state id to be stripped on movement.
	* @param {Window_Base} window Host window supplying bold/color text helpers.
	* @returns {string}
	*/
	static formatProse(stateId, window) {
		const stateName = window.colorizeText(14, window.boldenText(`\\state[${stateId}]`));
		return `Moving removes all ${stateName} stacks.`;
	}
	/**
	* Builds drawTextEx prose lines for every removeStateOnMove tag on a database row.
	* @param {RPG_BaseItem} dataRow State, skill, or equip row bearing notes.
	* @param {Window_Base} window Host window supplying bold/color text helpers.
	* @returns {string[]}
	*/
	static collectProseLines(dataRow, window) {
		if (!J.PASSIVE || !J.PASSIVE.EXT || !J.PASSIVE.EXT.CONDITIONAL) return [];
		const tuples = RPGManager.getArraysFromNotesByRegex(dataRow, J.PASSIVE.EXT.CONDITIONAL.RegExp.RemoveStateOnMove, true);
		const lines = [];
		for (const tuple of tuples) {
			const stateId = Number(tuple[0]);
			if (Number.isNaN(stateId) || stateId < 1) continue;
			lines.push(RemoveStateOnMoveDisplay.formatProse(stateId, window));
		}
		return lines;
	}
};

//#endregion
//#region src/plugins/passive/ext/conditional/windows/Window_PassiveDetail.js
/**
* Extends {@link Window_PassiveDetail#drawStateHeader}.<br/>
* Injects autoApplyState (stand condition) and removeStateOnMove prose under the header.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Window_PassiveDetail.set("drawStateHeader", Window_PassiveDetail.prototype.drawStateHeader);
Window_PassiveDetail.prototype.drawStateHeader = function(state) {
	J.PASSIVE.EXT.CONDITIONAL.Aliased.Window_PassiveDetail.get("drawStateHeader").call(this, state);
	this.drawAutoApplyStandProse(state);
	this.drawRemoveStateOnMoveProse(state);
};
/**
* Draws player-facing prose for each stand {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.AutoApplyState} tag.
* Skipped when the state carries no stand auto-apply rules.
* @param {RPG_State} state The state being detailed.
*/
Window_PassiveDetail.prototype.drawAutoApplyStandProse = function(state) {
	const lines = AutoApplyStateDisplay.collectStandProseLines(state, this);
	if (lines.length === 0) return;
	const width = this.innerWidth - 4;
	lines.forEach((text) => {
		this.drawTextEx(text, 4, this.currentY, width);
		this.currentY += this.textSizeEx(text).height + 4;
	});
};
/**
* Draws player-facing prose for each {@link J.PASSIVE.EXT.CONDITIONAL.RegExp.RemoveStateOnMove} tag.
* Skipped when the state carries no move-removal rules.
* @param {RPG_State} state The state being detailed.
*/
Window_PassiveDetail.prototype.drawRemoveStateOnMoveProse = function(state) {
	const lines = RemoveStateOnMoveDisplay.collectProseLines(state, this);
	if (lines.length === 0) return;
	const width = this.innerWidth - 4;
	lines.forEach((text) => {
		this.drawTextEx(text, 4, this.currentY, width);
		this.currentY += this.textSizeEx(text).height + 4;
	});
};

//#endregion
//# sourceMappingURL=J-Passive-Conditional.js.map