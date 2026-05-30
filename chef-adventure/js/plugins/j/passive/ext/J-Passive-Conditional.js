//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 PASSIVE-CONDITIONAL] Gates and scales J-Passive grants via source rules (JABS map combat).
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-Passive
 * @base J-Passive-Affix
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-Passive
 * @orderAfter J-Passive-Affix
 * @help
 * ============================================================================
 * OVERVIEW
 * Extends J-Passive so passive grants from a source can be gated and scaled.
 * Unconditional passives are simply grants with no rules.
 *
 * Three tag families live on the same rows as <passive:[...]>:
 *  passiveSourceRule  — gates every passive from this source
 *  passiveStateRule   — gates one state id from this source
 *  passiveStateCount  — stack contribution for one state id from this source
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
 * CHANGELOG:
 * - 1.0.0
 *    Initial release (passive rule framework).
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
J.PASSIVE.EXT.CONDITIONAL.Aliased.JABS_Battler = new Map();
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
J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveSourceRule = /<passiveSourceRule:[ ]?(\[[^]]+])>/gi;
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
J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveStateRule = /<passiveStateRule:[ ]?(\[[^]]+])>/gi;
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
J.PASSIVE.EXT.CONDITIONAL.RegExp.PassiveStateCount = /<passiveStateCount:[ ]?(\[[^]]+])>/gi;

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
	* Opposing battlers within default proximity.<br/>
	* Used by {@code enemiesNearby} gate rules that require a minimum threat count.
	* @param {Game_Battler} battler The battler whose neighborhood we measure.
	* @returns {JABS_Battler[]} Opposing JABS battlers within the default tile radius.
	*/
	static nearbyEnemies(battler) {
		const jabsBattler = this.getJabsBattler(battler);
		if (!jabsBattler) return [];
		const proximity = this.defaultProximity();
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
* Extends {@link #gainHp}.<br/>
* Records damage timestamps for {@link passiveStateRule} kinds that care about hit windows.
*/
J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.set("gainHp", Game_Battler.prototype.gainHp);
Game_Battler.prototype.gainHp = function(value) {
	if (value < 0) {
		this.stampPassiveRuleHitFrame();
	}
	J.PASSIVE.EXT.CONDITIONAL.Aliased.Game_Battler.get("gainHp").call(this, value);
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
* Re-runs the gated collectors so live rule context is reflected without applying states.
* @returns {string} Stable JSON fingerprint of unique ids and stack entries.
*/
Game_Battler.prototype.buildPassiveCollectionFingerprint = function() {
	const uniqueIds = [...this.getAllUniquePassiveStateIds()].sort((left, right) => left - right);
	const stackEntries = [...this.getAllStackablePassiveStateIds().entries()].sort((left, right) => left[0] - right[0]);
	return JSON.stringify({
		uniqueIds,
		stackEntries
	});
};
/**
* Stores the latest passive collection fingerprint after a refresh pass.<br/>
* Becomes the baseline for subsequent drift checks on the map.
*/
Game_Battler.prototype.updatePassiveRuleCollectionFingerprint = function() {
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
	this.refreshPassiveStates();
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
};
/**
* Delegates throttled passive rule reconciliation to the underlying battler.<br/>
* Called every JABS update tick while this map battler is active.
*/
JABS_Battler.prototype.updatePassiveRuleReconcile = function() {
	const battler = this.getBattler();
	if (!battler) return;
	battler.updatePassiveRuleReconcileTimer();
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
};

//#endregion
//# sourceMappingURL=J-Passive-Conditional.js.map