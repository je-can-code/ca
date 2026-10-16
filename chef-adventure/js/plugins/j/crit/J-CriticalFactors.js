//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.5.0 CRIT] Manages critical damage multiplier/reduction of battlers.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-NaturalGrowth
 * @orderAfter J-Extend
 * @help
 * ============================================================================
 * Please refer to J-CriticalFactors's book for more details:
 * https://github.com/je-can-code/rmmz-plugins/blob/main/docs/plugins/crit/core/index.md
 * ============================================================================
 *
 * @param critMultiplierBaseDefault
 * @type number
 * @decimals 2
 * @min 0
 * @text Base Critical Damage Multiplier
 * @desc The default bonus critical damage (%) for battlers with no <critMultiplierBase> tags. 50 = +50% (x1.5 total).
 * @default 50.00
 *
 * @param critReductionBaseDefault
 * @type number
 * @decimals 2
 * @min 0
 * @text Base Critical Damage Reduction
 * @desc The critical damage reduction (%) every battler starts from, against every crit. 0 = crits land in full; 25 = -25% of the bonus.
 * @default 0.00
 */
//endregion annotations

//#region src/plugins/crit/core/_metadata/_pluginMetadata.js
var J_CriticalFactorsPluginMetadata = class J_CriticalFactorsPluginMetadata extends PluginMetadata {
	/**
	* The factor used for critical damage multiplication when the plugin parameter is absent or
	* unreadable. This is a static rather than a field initializer on purpose: the parent
	* constructor reaches `initializeMetadata` before any subclass field initializer has run, so a
	* field would still be `undefined` at the moment the fallback is needed - and would then
	* overwrite the parsed result on its way in.
	* @type {number}
	*/
	static #DEFAULT_CDM_FACTOR = .5;
	/**
	* The factor used for critical damage reduction when the plugin parameter is absent or
	* unreadable. None: the base reduction counts against every critical hit a battler takes, so
	* anything above zero would blunt every crit in the game before a single tag asked it to.
	* Static for the same reason as {@link #DEFAULT_CDM_FACTOR}.
	* @type {number}
	*/
	static #DEFAULT_CTR_FACTOR = 0;
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	*  Extends {@link #postInitialize}.<br>
	*  Includes translation of plugin parameters.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeMetadata();
	}
	/**
	* Initializes the metadata associated with this plugin.
	*/
	initializeMetadata() {
		const { parsedPluginParameters: p } = this;
		/**
		* The default critical damage multiplier factor applied to every battler that carries no
		* `<critMultiplierBase:NUM>` notetags. A percent-point value (e.g. `50` becomes `0.5`).
		* @type {number}
		*/
		this.baseCdmFactor = J_CriticalFactorsPluginMetadata.#parsePercentFactorOr(p["critMultiplierBaseDefault"], J_CriticalFactorsPluginMetadata.#DEFAULT_CDM_FACTOR);
		/**
		* The default critical damage reduction factor applied to every battler that carries no
		* `<critReductionBase:NUM>` notetags. A percent-point value (e.g. `50` becomes `0.5`).
		* @type {number}
		*/
		this.baseCtrFactor = J_CriticalFactorsPluginMetadata.#parsePercentFactorOr(p["critReductionBaseDefault"], J_CriticalFactorsPluginMetadata.#DEFAULT_CTR_FACTOR);
	}
	/**
	* Parses a percent-point plugin parameter (e.g. `"50.00"`) into its `/100` factor.
	* @param {string|number|undefined|null} value The raw plugin parameter value.
	* @param {number} fallback The fallback factor to use when the value is absent or invalid.
	* @returns {number}
	*/
	static #parsePercentFactorOr(value, fallback) {
		const parsed = Number.parseFloat(value);
		if (!Number.isFinite(parsed)) {
			return fallback;
		}
		return parsed / 100;
	}
};

//#endregion
//#region src/plugins/crit/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "4.0.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (!hasBaseRequirement) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.CRIT = {};
/**
* The `metadata` associated with this plugin, such as version.
*/
J.CRIT.Metadata = new J_CriticalFactorsPluginMetadata("J-CriticalFactors", "1.5.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.CRIT.Aliased = {
	Game_Action: new Map(),
	Game_Actor: new Map(),
	Game_Battler: new Map(),
	Game_BattlerBase: new Map(),
	Game_Enemy: new Map(),
	IconManager: new Map(),
	TextManager: new Map(),
	Window_SDP_Details: new Map(),
	Scene_Boot: new Map()
};
/**
* All regular expressions used by this plugin.
*/
J.CRIT.RegExp = {
	ThisCritDamageChance: /<thisCritChance:\[([+\-*/ ().\w]+)]>/gi,
	ThisCritDamageMultiplier: /<thisCritMultiplier:\[([+\-*/ ().\w]+)]>/gi,
	ThisCritsAlways: /<thisCritsAlways>/gi,
	ThisCritChanceIfState: /<thisCritChanceIfState:(\[\d+,[ ]?\d+])>/gi,
	ThisCritChanceIfStateType: /<thisCritChanceIfStateType:(\[[a-zA-Z][a-zA-Z0-9_-]*,[ ]?\d+])>/gi,
	ThisCritsAlwaysIfState: /<thisCritsAlwaysIfState:(\[\d+(?:,[ ]?\d+)*])>/gi,
	ThisCritsAlwaysIfStateType: /<thisCritsAlwaysIfStateType:([a-zA-Z][a-zA-Z0-9_-]*)>/gi,
	ThisCritApply: /<thisCritApply:[ ]?(\[\d+,[ ]?\d+])>/gi,
	ThisCritSelf: /<thisCritSelf:[ ]?(\[\d+,[ ]?\d+])>/gi,
	CritChanceIfState: /<critChanceIfState:(\[\d+,[ ]?\d+])>/gi,
	CritChanceIfStateType: /<critChanceIfStateType:(\[[a-zA-Z][a-zA-Z0-9_-]*,[ ]?\d+])>/gi,
	CritAlwaysIfState: /<critAlwaysIfState:(\[\d+(?:,[ ]?\d+)*])>/gi,
	CritAlwaysIfStateType: /<critAlwaysIfStateType:([a-zA-Z][a-zA-Z0-9_-]*)>/gi,
	OnCritApply: /<onCritApply:[ ]?(\[\d+,[ ]?\d+])>/gi,
	OnCritSelf: /<onCritSelf:[ ]?(\[\d+,[ ]?\d+])>/gi,
	ForceCritProcs: /<forceCritProcs>/i,
	CritDamageReductionBase: /<critReductionBase: ?(-?\d+)>/gi,
	CritDamageReduction: /<critReduction: ?(-?\d+)>/gi,
	CritDamageMultiplierBase: /<critMultiplierBase: ?(\d+)>/gi,
	CritDamageMultiplier: /<critMultiplier: ?(\d+)>/gi,
	CritTakenRateBuffPlus: /<ctrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	CritTakenRateBuffRate: /<ctrBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	CritTakenRateGrowthPlus: /<ctrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	CritTakenRateGrowthRate: /<ctrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	CritDamageMultiplierBuffPlus: /<cdmBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	CritDamageMultiplierBuffRate: /<cdmBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	CritDamageMultiplierGrowthPlus: /<cdmGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	CritDamageMultiplierGrowthRate: /<cdmGrowthRate:\[([+\-*/ ().\w]+)]>/gi
};

//#endregion
//#region src/plugins/crit/core/database/RPG_BaseItem.js
/**
* The conditional crit chance bonuses on this note source, keyed by target state id.
* Each entry is a [stateId, bonusChance] pair — the bonus applies to all actions executed
* by the attacker when the target has the specified state active.
* Covers actors, classes, skills, weapons, armors, enemies, and states.
* @type {[number, number][]|null}
*/
Object.defineProperty(RPG_BaseItem.prototype, "critChanceIfStates", { get: function() {
	return RPGManager.getArraysFromNotesByRegex(this, J.CRIT.RegExp.CritChanceIfState);
} });
/**
* The conditional crit chance bonuses on this note source, keyed by state type classifier.
* Each entry is a [type, bonusChance] pair — the bonus applies to all actions executed by
* the attacker when the target has any active state carrying the specified type classifier.
* @type {[string, number][]}
*/
Object.defineProperty(RPG_BaseItem.prototype, "critChanceIfStateTypes", { get: function() {
	return RPGManager.getArraysFromNotesByRegex(this, J.CRIT.RegExp.CritChanceIfStateType);
} });
/**
* The flat list of state ids that guarantee a critical hit for all actions while this note
* source is active on the attacker, when the target has any one of them active.
* Aggregated across all <critAlwaysIfState> tags on this note source.
* @type {number[]}
*/
Object.defineProperty(RPG_BaseItem.prototype, "critAlwaysIfStates", { get: function() {
	return RPGManager.getArraysFromNotesByRegex(this, J.CRIT.RegExp.CritAlwaysIfState).flat();
} });
/**
* The list of state type classifiers that guarantee a critical hit for all actions while this
* note source is active on the attacker, when the target has any active state carrying one of them.
* @type {string[]}
*/
Object.defineProperty(RPG_BaseItem.prototype, "critAlwaysIfStateTypes", { get: function() {
	return RPGManager.getStringsFromNoteByRegex(this, J.CRIT.RegExp.CritAlwaysIfStateType);
} });

//#endregion
//#region src/plugins/crit/core/database/RPG_Skill.js
/**
* The conditional crit chance bonuses for this skill, keyed by target state id.
* Each entry is a [stateId, bonusChance] pair — the bonus applies only when the
* target has the specified state active at the time this skill is executed.
* @type {[number, number][]|null}
*/
Object.defineProperty(RPG_Skill.prototype, "thisCritChanceIfStates", { get: function() {
	return RPGManager.getArraysFromNotesByRegex(this, J.CRIT.RegExp.ThisCritChanceIfState);
} });
/**
* The conditional crit chance bonuses for this skill, keyed by state type classifier.
* Each entry is a [type, bonusChance] pair — the bonus applies when the target has any
* active state carrying the specified type classifier.
* @type {[string, number][]|null}
*/
Object.defineProperty(RPG_Skill.prototype, "thisCritChanceIfStateTypes", { get: function() {
	return RPGManager.getArraysFromNotesByRegex(this, J.CRIT.RegExp.ThisCritChanceIfStateType);
} });
/**
* The flat list of state ids that guarantee a critical hit for this skill when the target
* has any one of them active. Aggregated across all <thisCritsAlwaysIfState> tags on this skill.
* @type {number[]}
*/
Object.defineProperty(RPG_Skill.prototype, "thisCritsAlwaysIfStates", { get: function() {
	return RPGManager.getArraysFromNotesByRegex(this, J.CRIT.RegExp.ThisCritsAlwaysIfState).flat();
} });
/**
* The list of state type classifiers that guarantee a critical hit for this skill when the
* target has any active state carrying one of them.
* @type {string[]}
*/
Object.defineProperty(RPG_Skill.prototype, "thisCritsAlwaysIfStateTypes", { get: function() {
	return RPGManager.getStringsFromNoteByRegex(this, J.CRIT.RegExp.ThisCritsAlwaysIfStateType);
} });

//#endregion
//#region src/plugins/crit/core/managers/IconManager.js
/**
* Gets the icon index for the critical damage parameters.
* @param {number} paramId The id of the crit param to get an icon index for.
* @returns {number}
*/
IconManager.critParam = function(paramId) {
	switch (paramId) {
		case 0: return 976;
		case 1: return 977;
	}
};

//#endregion
//#region src/plugins/crit/core/managers/TextManager.js
/**
* Gets the text for the critical damage parameters from "J-CriticalFactors".
* @param {number} paramId The id of the crit param to get a name for.
* @returns {string} The name of the parameter.
*/
TextManager.critParam = function(paramId) {
	switch (paramId) {
		case 0: return "Crit Amp";
		case 1: return "Crit Block";
	}
};
/**
* Gets the description text for the critical damage parameters.
* @param {number} paramId The id of the crit param to get a description for.
* @returns {string[]}
*/
TextManager.critParamDescription = function(paramId) {
	switch (paramId) {
		case 0: return ["The numeric value to the intensity of one's critical hits.", "Higher amounts of this yield bigger critical hits."];
		case 1: return ["The numeric value to one's percent reduction of critical damage.", "Enemy critical amp is directly reduced by this amount."];
	}
};

//#endregion
//#region src/plugins/crit/core/objects/Game_Action.js
/**
* Extends the `initialize()` function to include initializing our new target tracker.
* Note that the target tracker will remain null on this action until after our custom logic
* within `apply()` has been executed (before aliased function logic).
*/
J.CRIT.Aliased.Game_Action.set("initialize", Game_Action.prototype.initialize);
Game_Action.prototype.initialize = function(subject, forcing) {
	J.CRIT.Aliased.Game_Action.get("initialize").call(this, subject, forcing);
	/**
	* The target of this action.
	* This remains null until the `apply()` function is executed.
	* @type {Game_Actor|Game_Enemy|null}
	*/
	this._targetBattler = null;
};
/**
* Sets the target battler of this action.
* This is primarily used in functions that do not normally have access to the target,
* such as the `applyCritical()` function.
* @param {Game_Actor|Game_Enemy|null} targetBattler The target of this action.
*/
Game_Action.prototype.setTargetBattler = function(targetBattler) {
	this._targetBattler = targetBattler;
};
/**
* Gets the current target of this action.
* This will always yield `null` if this is accessed before `apply()` has started running.
* @returns {Game_Actor|Game_Enemy|null}
*/
Game_Action.prototype.targetBattler = function() {
	return this._targetBattler;
};
/**
* Extends {@link #apply}.<br/>
* Tracks the target for use in critical calculations, then fires any on-crit state effects
* when the result confirms a critical hit landed.
*/
J.CRIT.Aliased.Game_Action.set("apply", Game_Action.prototype.apply);
Game_Action.prototype.apply = function(target) {
	this.setTargetBattler(target);
	J.CRIT.Aliased.Game_Action.get("apply").call(this, target);
	if (target.result().critical) {
		this.applyOnCriticalStateEffects(target);
	}
};
/**
* Applies all on-crit state effects — states to the target and states to self — from both
* the executing skill and any global crit tags present anywhere on the attacker.
* Guarded by J-ABS availability since on-chance effects depend on {@link JABS_OnChanceEffect}.
* @param {Game_Actor|Game_Enemy} target The target that received the critical hit.
*/
Game_Action.prototype.applyOnCriticalStateEffects = function(target) {
	if (!J.ABS) return;
	this.applyOnCriticalTargetStates(target);
	this.applyOnCriticalSelfStates();
};
/**
* Rolls and applies all on-crit states that target the enemy that was just critically hit.
* Checks both the executing skill ({@link thisCritApply}) and all attacker notes ({@link onCritApply}).
* @param {Game_Actor|Game_Enemy} target The target to apply states to.
*/
Game_Action.prototype.applyOnCriticalTargetStates = function(target) {
	this.rollAndApplyCritStates(target, this.thisCritTargetStates());
	this.rollAndApplyCritStates(target, this.onCritTargetStates());
};
/**
* Rolls and applies all on-crit states that target the attacker themselves.
* Checks both the executing skill ({@link thisCritSelf}) and all attacker notes ({@link onCritSelf}).
*/
Game_Action.prototype.applyOnCriticalSelfStates = function() {
	const attacker = this.subject();
	this.rollAndApplyCritStates(attacker, this.thisCritSelfStates());
	this.rollAndApplyCritStates(attacker, this.onCritSelfStates());
};
/**
* Iterates a list of on-chance effects and applies any that pass their roll to the recipient.
* @param {Game_Actor|Game_Enemy} recipient The battler receiving the state applications.
* @param {JABS_OnChanceEffect[]} onChanceEffects The effects to roll and apply.
*/
Game_Action.prototype.rollAndApplyCritStates = function(recipient, onChanceEffects) {
	if (onChanceEffects.length === 0) return;
	const attacker = this.subject();
	onChanceEffects.forEach((effect) => {
		const skill = effect.baseSkill(attacker);
		const positiveRolls = 1 + attacker.getPositiveRollsForSkill(skill);
		const negativeRolls = recipient.getNegativeRolls();
		const positiveRoller = attacker.isForceCritProcs() ? {
			isVeryLucky: () => true,
			isVeryCursed: () => false,
			isAccumulating: () => attacker.isAccumulating(),
			getEncoreRepeats: () => attacker.getEncoreRepeats()
		} : attacker;
		const procCount = effect.resolveProcCount(positiveRolls, negativeRolls, positiveRoller);
		for (let i = 0; i < procCount; i++) {
			recipient.addState(effect.skillId, attacker, skill);
		}
	});
};
/**
* Gets all on-crit target states sourced from the executing skill only.
* Uses the {@link thisCritApply} tag — independent of what the attacker has globally.
* @returns {JABS_OnChanceEffect[]}
*/
Game_Action.prototype.thisCritTargetStates = function() {
	return RPGManager.getOnChanceEffectsFromDatabaseObjects([this.item()], J.CRIT.RegExp.ThisCritApply);
};
/**
* Gets all on-crit self states sourced from the executing skill only.
* Uses the {@link thisCritSelf} tag — independent of what the attacker has globally.
* @returns {JABS_OnChanceEffect[]}
*/
Game_Action.prototype.thisCritSelfStates = function() {
	return RPGManager.getOnChanceEffectsFromDatabaseObjects([this.item()], J.CRIT.RegExp.ThisCritSelf);
};
/**
* Gets all on-crit target states sourced from anywhere on the attacker.
* Uses the {@link onCritApply} tag — fires whenever any crit lands, regardless of the skill used.
* @returns {JABS_OnChanceEffect[]}
*/
Game_Action.prototype.onCritTargetStates = function() {
	const notes = this.subject().getAllNotes();
	return RPGManager.getOnChanceEffectsFromDatabaseObjects(notes, J.CRIT.RegExp.OnCritApply);
};
/**
* Gets all on-crit self states sourced from anywhere on the attacker.
* Uses the {@link onCritSelf} tag — fires whenever any crit lands, regardless of the skill used.
* @returns {JABS_OnChanceEffect[]}
*/
Game_Action.prototype.onCritSelfStates = function() {
	const notes = this.subject().getAllNotes();
	return RPGManager.getOnChanceEffectsFromDatabaseObjects(notes, J.CRIT.RegExp.OnCritSelf);
};
/**
* Overwrites {@link #applyCritical}.<br/>
* Replaces the way critical damage is calculated by
* adding multiplier and reduction modifiers for actors and enemies alike.
* @param {number} baseDamage The base damage before crit modification.
* @returns {number} The critically modified damage.
*/
Game_Action.prototype.applyCritical = function(baseDamage) {
	const criticalBonusDamage = this.applyCriticalDamageMultiplier(baseDamage);
	const reducedCriticalBonusDamage = this.applyCriticalDamageReduction(criticalBonusDamage);
	return baseDamage + reducedCriticalBonusDamage;
};
/**
* Calculates the amount of critical damage to add onto the base damage.
* @param {number} baseDamage The base damage before crit modification.
* @returns {number} The amount of critical damage to add onto the base.
*/
Game_Action.prototype.applyCriticalDamageMultiplier = function(baseDamage) {
	const attacker = this.subject();
	let critMultiplier = attacker.baseCriticalMultiplier();
	critMultiplier += attacker.cdm;
	critMultiplier += this.ownCriticalDamageMultiplier();
	return baseDamage * critMultiplier;
};
/**
* Calculates the amount of critical damage that will be removed from the bonus crit damage.<br/>
* The defender's base reduction counts against every crit it takes, the same way the attacker's
* base multiplier counts toward every crit it lands.
* @param {number} criticalDamage The critical damage to be added.
* @returns {number} The amount of critical damage after mitigations.
*/
Game_Action.prototype.applyCriticalDamageReduction = function(criticalDamage) {
	const defender = this.targetBattler();
	if (!defender) return criticalDamage;
	let critReduction = defender.baseCriticalReduction();
	critReduction += defender.ctr;
	const baseCriticalReductionRate = 1 - critReduction;
	const criticalReductionRate = Math.max(baseCriticalReductionRate, 0);
	return criticalDamage * criticalReductionRate;
};
/**
* Overwrites {@link #itemCri}.<br/>
* Includes the addition of potential action-based crit rate boosts.
* @param {Game_Battler} target The target being struck with the critical.
* @returns {number} The calculated critical chance of this action.
*/
Game_Action.prototype.itemCri = function(target) {
	if (!this.item().damage.critical) return 0;
	if (this.isGuaranteedCrit()) return 9999;
	if (this.isGuaranteedCritVsTarget(target)) return 9999;
	let critChance = this.subject().cri;
	critChance += this.ownCriticalChanceBonus();
	critChance += this.thisCritChanceIfStateBonus(target);
	critChance += this.critChanceIfStateBonus(target);
	critChance -= target.cev;
	return Math.max(critChance, 0);
};
/**
* Calculates this action's own bonus to crit damage multipliers.
* Formula context: `a` is this action's subject (the attacker), `b` is 0 (no meaningful
* per-skill base value to expose), `v` is `$gameVariables._data`.
* @returns {number}
*/
Game_Action.prototype.ownCriticalDamageMultiplier = function() {
	return RPGManager.getResultsFromAllNotesByRegex([this.item()], J.CRIT.RegExp.ThisCritDamageMultiplier, 0, this.subject()) / 100;
};
/**
* Checks if this action is an unconditional guaranteed critical hit.
* @returns {boolean}
*/
Game_Action.prototype.isGuaranteedCrit = function() {
	return RPGManager.checkForBooleanFromNoteByRegex(this.item(), J.CRIT.RegExp.ThisCritsAlways);
};
/**
* Checks if the target's current states trigger a guaranteed critical hit for this action.
* Checks both the skill's own {@link thisCritsAlwaysIfState} tags and the attacker's global
* {@link critAlwaysIfState} tags across all note sources.
* @param {Game_Battler} target The target being struck.
* @returns {boolean} True if the target has any state that guarantees a crit, false otherwise.
*/
Game_Action.prototype.isGuaranteedCritVsTarget = function(target) {
	const skillStateIds = this.item().thisCritsAlwaysIfStates;
	if (skillStateIds.some((stateId) => target.isStateAffected(stateId))) return true;
	const skillStateTypes = this.item().thisCritsAlwaysIfStateTypes;
	if (skillStateTypes.some((type) => this.targetHasActiveStateType(target, type))) return true;
	const globalStateIds = this.subject().getAllNotes().flatMap((noteSource) => noteSource.critAlwaysIfStates);
	if (globalStateIds.some((stateId) => target.isStateAffected(stateId))) return true;
	const globalStateTypes = this.subject().getAllNotes().flatMap((noteSource) => noteSource.critAlwaysIfStateTypes);
	return globalStateTypes.some((type) => this.targetHasActiveStateType(target, type));
};
/**
* Calculates this action's own bonus to crit chance.
* Formula context: `a` is this action's subject (the attacker), `b` is 0 (no meaningful
* per-skill base value to expose), `v` is `$gameVariables._data`.
* @returns {number}
*/
Game_Action.prototype.ownCriticalChanceBonus = function() {
	return RPGManager.getResultsFromAllNotesByRegex([this.item()], J.CRIT.RegExp.ThisCritDamageChance, 0, this.subject()) / 100;
};
/**
* Calculates the conditional crit chance bonus from this skill's own state-gated tags.
* Reads all {@link thisCritChanceIfState} pairs on the executing skill and sums the bonus
* for each pair whose state the target currently has active.
* @param {Game_Battler} target The target being struck.
* @returns {number} The total conditional bonus as a 0–1 rate addend.
*/
Game_Action.prototype.thisCritChanceIfStateBonus = function(target) {
	const pairs = this.item().thisCritChanceIfStates;
	const typePairs = this.item().thisCritChanceIfStateTypes;
	if (!pairs.length && !typePairs.length) return 0;
	const stateIdBonus = pairs.reduce((total, [stateId, bonusChance]) => {
		return total + (target.isStateAffected(stateId) ? bonusChance / 100 : 0);
	}, 0);
	const stateTypeBonus = typePairs.reduce((total, [type, bonusChance]) => {
		return total + (this.targetHasActiveStateType(target, type) ? bonusChance / 100 : 0);
	}, 0);
	return stateIdBonus + stateTypeBonus;
};
/**
* Calculates the conditional crit chance bonus from the attacker's global state-gated tags.
* Reads all {@link critChanceIfState} pairs from every note source on the attacker and sums
* the bonus for each pair whose state the target currently has active.
* @param {Game_Battler} target The target being struck.
* @returns {number} The total conditional bonus as a 0–1 rate addend.
*/
Game_Action.prototype.critChanceIfStateBonus = function(target) {
	const allPairs = this.subject().getAllNotes().flatMap((noteSource) => noteSource.critChanceIfStates);
	const allTypePairs = this.subject().getAllNotes().flatMap((noteSource) => noteSource.critChanceIfStateTypes);
	if (!allPairs.length && !allTypePairs.length) return 0;
	const stateIdBonus = allPairs.reduce((total, [stateId, bonusChance]) => {
		return total + (target.isStateAffected(stateId) ? bonusChance / 100 : 0);
	}, 0);
	const stateTypeBonus = allTypePairs.reduce((total, [type, bonusChance]) => {
		return total + (this.targetHasActiveStateType(target, type) ? bonusChance / 100 : 0);
	}, 0);
	return stateIdBonus + stateTypeBonus;
};
/**
* Checks whether the target has any active state carrying the specified type classifier.
* The comparison is case-insensitive.
* @param {Game_Battler} target The target whose active states are checked.
* @param {string} type The type classifier to look for.
* @returns {boolean} True if any active state on the target carries this type.
*/
Game_Action.prototype.targetHasActiveStateType = function(target, type) {
	return target.states().some((state) => state.types().some((stateType) => stateType.toLowerCase() === type.toLowerCase()));
};

//#endregion
//#region src/plugins/crit/core/objects/Game_Actor.js
/**
* Gets all SDP bonuses for the given crit parameter id.
* @param {number} critParamId The id of the crit parameter.
* @param {number} baseParam The base value of the crit parameter in question, in the percent points the
* panels are summed in.
* @returns {number}
*/
Game_Actor.prototype.critSdpBonuses = function(critParamId, baseParam) {
	const parameterKey = critParamId === 0 ? "cdm" : "ctr";
	return this.getSdpBonusForParameterKey(parameterKey, baseParam);
};

//#endregion
//#region src/plugins/crit/core/core/registerCritParameters.js
/**
* Boot-time registration for J-Crit parameters in {@link ParameterRegistry}.
*/
var CritParameterRegistration = class {
	/**
	* Registers CDM and CTR with the parameter catalog.
	*/
	static registerAll() {
		const criticalDamageMultiplier = ParameterDefinition.Builder().key("cdm").group(ParameterGroups.PRECISION).sortOrder(6).label(() => TextManager.critParam(0)).description(() => TextManager.critParamDescription(0)).iconIndex(() => IconManager.critParam(0)).format(ParameterFormat.PERCENT_SUFFIX).getValue((battler) => battler.cdm).sdpBinding(SdpParameterBinding.byKey("cdm", (actor) => actor.baseCriticalMultiplier() * 100)).build();
		ParameterRegistry.register(criticalDamageMultiplier);
		const criticalDamageNatural = new NaturalParameterBinding(J.CRIT.RegExp.CritDamageMultiplierBuffPlus, J.CRIT.RegExp.CritDamageMultiplierBuffRate, J.CRIT.RegExp.CritDamageMultiplierGrowthPlus, J.CRIT.RegExp.CritDamageMultiplierGrowthRate, (battler) => battler.baseCriticalMultiplier());
		ParameterRegistry.bindNatural("cdm", criticalDamageNatural);
		const criticalToleranceRate = ParameterDefinition.Builder().key("ctr").group(ParameterGroups.PRECISION).sortOrder(7).label(() => TextManager.critParam(1)).description(() => TextManager.critParamDescription(1)).iconIndex(() => IconManager.critParam(1)).format(ParameterFormat.PERCENT_SUFFIX).getValue((battler) => battler.ctr).sdpBinding(SdpParameterBinding.byKey("ctr", (actor) => actor.baseCriticalReduction() * 100)).build();
		ParameterRegistry.register(criticalToleranceRate);
		const criticalToleranceNatural = new NaturalParameterBinding(J.CRIT.RegExp.CritTakenRateBuffPlus, J.CRIT.RegExp.CritTakenRateBuffRate, J.CRIT.RegExp.CritTakenRateGrowthPlus, J.CRIT.RegExp.CritTakenRateGrowthRate, (battler) => battler.baseCriticalReduction());
		ParameterRegistry.bindNatural("ctr", criticalToleranceNatural);
	}
};

//#endregion
//#region src/plugins/crit/core/objects/Game_BattlerBase.js
Object.defineProperties(Game_BattlerBase.prototype, {
	/**
	* The battler's critical damage multiplier.
	* Critical hits are multiplied by this amount to determine the total critical hit damage.
	* @type {number}
	*/
	cdm: {
		get: function() {
			return this.criticalDamageMultiplier();
		},
		configurable: true
	},
	/**
	* The battler's critical taken rate.
	* Critical hit damage is reduced by this percent before being applied.
	* @type {number}
	*/
	ctr: {
		get: function() {
			return this.criticalDamageReduction();
		},
		configurable: true
	}
});
/**
* The base critical damage multiplier.
* A battler's critical damage multiplier acts as the base bonus multiplier for all
* critical hits. The individual battler's `cdm` is added to this amount to calculate
* the damage a critical hit can potentially deal.
* Sourced from the plugin parameter so designers can retune the default without
* touching code- see {@link J_CriticalFactorsPluginMetadata#baseCdmFactor}.
* @returns {number} The base multiplier for this battler.
*/
Game_BattlerBase.prototype.baseCriticalMultiplier = function() {
	return J.CRIT.Metadata.baseCdmFactor;
};
/**
* Gets the multiplier for this battler's critical hits.
* @returns {number}
*/
Game_BattlerBase.prototype.criticalDamageMultiplier = function() {
	return 0;
};
/**
* The base critical taken rate.
* A battler's critical taken rate acts as the base crit reduction for all incoming
* critical hits. The individual battler's `ctr` is added to this amount to calculate
* how much of a critical hit's bonus damage the battler shrugs off.
* Sourced from the plugin parameter so designers can retune the default without
* touching code- see {@link J_CriticalFactorsPluginMetadata#baseCtrFactor}.
* @returns {number} The base reduction for this battler.
*/
Game_BattlerBase.prototype.baseCriticalReduction = function() {
	return J.CRIT.Metadata.baseCtrFactor;
};
/**
* Gets the reduction factor for when this battler receives a critical hit.
* @returns {number}
*/
Game_BattlerBase.prototype.criticalDamageReduction = function() {
	return 0;
};

//#endregion
//#region src/plugins/crit/core/objects/Game_Battler.js
/**
* Extends {@link Game_BattlerBase#baseCriticalMultiplier}.<br/>
* Adds any `<critMultiplierBase:NUM>` notetag contributions on top of the plugin-configured
* floor value inherited from {@link Game_BattlerBase}, instead of replacing it outright-
* without this alias, every battler without a notetag would floor out at 0 instead of the
* designer-configured default.
*/
J.CRIT.Aliased.Game_Battler.set("baseCriticalMultiplier", Game_Battler.prototype.baseCriticalMultiplier);
Game_Battler.prototype.baseCriticalMultiplier = function() {
	const baseFactor = J.CRIT.Aliased.Game_Battler.get("baseCriticalMultiplier").call(this);
	const objectsToCheck = this.getAllNotes();
	const baseCriticalMultiplier = RPGManager.getSumFromAllNotesByRegex(objectsToCheck, J.CRIT.RegExp.CritDamageMultiplierBase);
	const baseCdmFactor = baseCriticalMultiplier / 100;
	return baseFactor + baseCdmFactor;
};
/**
* Calculates this battler's current critical damage multiplier.
* @returns {number}
*/
Game_Battler.prototype.criticalDamageMultiplier = function() {
	const cdmBonuses = this.getCriticalDamageMultiplier();
	const baseCdmPoints = this.baseCriticalMultiplier() * 100;
	const cdmSdpBonuses = this.critSdpBonuses(0, baseCdmPoints);
	const cdmFactor = (cdmBonuses + cdmSdpBonuses) / 100;
	const cdmNaturalBonus = this.naturalBonus("cdm");
	return cdmFactor + cdmNaturalBonus;
};
/**
* Gets the sum of all critical damage multipliers from all notes.
* @returns {number}
*/
Game_Battler.prototype.getCriticalDamageMultiplier = function() {
	const objectsToCheck = this.getAllNotes();
	const cdmBonuses = RPGManager.getSumFromAllNotesByRegex(objectsToCheck, J.CRIT.RegExp.CritDamageMultiplier);
	return cdmBonuses;
};
/**
* Extends {@link Game_BattlerBase#baseCriticalReduction}.<br/>
* Adds any `<critReductionBase:NUM>` notetag contributions on top of the plugin-configured
* floor value inherited from {@link Game_BattlerBase}, instead of replacing it outright-
* without this alias, every battler without a notetag would floor out at 0 instead of the
* designer-configured default.
*/
J.CRIT.Aliased.Game_Battler.set("baseCriticalReduction", Game_Battler.prototype.baseCriticalReduction);
Game_Battler.prototype.baseCriticalReduction = function() {
	const baseFactor = J.CRIT.Aliased.Game_Battler.get("baseCriticalReduction").call(this);
	const objectsToCheck = this.getAllNotes();
	const baseCriticalReduction = RPGManager.getSumFromAllNotesByRegex(objectsToCheck, J.CRIT.RegExp.CritDamageReductionBase);
	const baseCdrFactor = baseCriticalReduction / 100;
	return baseFactor + baseCdrFactor;
};
/**
* Gets the reduction factor for when this battler receives a critical hit.
* @returns {number} The CDR factor for this battler.
*/
Game_Battler.prototype.criticalDamageReduction = function() {
	const ctrBonuses = this.getCriticalDamageReduction();
	const baseCtrPoints = this.baseCriticalReduction() * 100;
	const ctrSdpBonuses = this.critSdpBonuses(1, baseCtrPoints);
	const ctrFactor = (ctrBonuses + ctrSdpBonuses) / 100;
	const ctrNaturalBonus = this.naturalBonus("ctr");
	return ctrFactor + ctrNaturalBonus;
};
/**
* Gets the sum of all critical damage reductions from all notes.
* @returns {number}
*/
Game_Battler.prototype.getCriticalDamageReduction = function() {
	const objectsToCheck = this.getAllNotes();
	const ctrBonuses = RPGManager.getSumFromAllNotesByRegex(objectsToCheck, J.CRIT.RegExp.CritDamageReduction);
	return ctrBonuses;
};
/**
* Whether or not this battler's on-crit state applications should skip their own chance roll and
* always land. Scoped specifically to {@link Game_Action.rollAndApplyCritStates}- unlike
* `isVeryLucky()`, this does not bypass any other roll site (hit chance, regular state-apply,
* retaliation, etc). Sourced from any of this battler's own note sources via `<forceCritProcs>`.
* @returns {boolean}
*/
Game_Battler.prototype.isForceCritProcs = function() {
	return RPGManager.checkForBooleanFromAllNotesByRegex(this.getAllNotes(), J.CRIT.RegExp.ForceCritProcs) === true;
};

//#endregion
//#region src/plugins/crit/core/core/describeCritNotetags.js
/**
* The lines describing the notetags this plugin reads, registered with {@link NotetagDescriber} at boot.
*
* No words are written here. Each sentence is the game's, kept in its config under the tag's key; this class reads
* the tag and supplies what the sentence names.
*/
var CritNotetagDescriptions = class {
	/**
	* The constructor is not designed to be called.
	* This is a static class.
	*/
	constructor() {
		throw new Error("This is a static class.");
	}
	/**
	* Registers the describer of every tag this plugin reads that has its words so far.
	*/
	static registerAll() {
		NotetagDescriber.register(J.CRIT.RegExp.CritDamageMultiplier, (match) => this.critAmountLines(match, "critMultiplier"));
		NotetagDescriber.register(J.CRIT.RegExp.CritDamageMultiplierBase, (match) => this.critAmountLines(match, "critMultiplierBase"));
		NotetagDescriber.register(J.CRIT.RegExp.CritDamageReduction, (match) => this.critReductionLines(match));
		NotetagDescriber.register(J.CRIT.RegExp.CritDamageReductionBase, (match) => this.critReductionBaseLines(match));
		NotetagDescriber.register(J.CRIT.RegExp.OnCritApply, (match) => this.critStateLines(match, "onCritApply"));
		NotetagDescriber.register(J.CRIT.RegExp.OnCritSelf, (match) => this.critStateLines(match, "onCritSelf"));
		NotetagDescriber.register(J.CRIT.RegExp.ThisCritApply, (match) => this.critStateLines(match, "thisCritApply"));
		NotetagDescriber.register(J.CRIT.RegExp.ThisCritSelf, (match) => this.critStateLines(match, "thisCritSelf"));
		NotetagDescriber.register(J.CRIT.RegExp.ForceCritProcs, () => this.forceCritProcsLines());
		NotetagDescriber.register(J.CRIT.RegExp.CritChanceIfState, (match) => this.critChanceIfStateLines(match, "critChanceIfState"));
		NotetagDescriber.register(J.CRIT.RegExp.ThisCritChanceIfState, (match) => this.critChanceIfStateLines(match, "thisCritChanceIfState"));
		NotetagDescriber.register(J.CRIT.RegExp.CritChanceIfStateType, (match) => this.critChanceIfStateTypeLines(match, "critChanceIfStateType"));
		NotetagDescriber.register(J.CRIT.RegExp.ThisCritChanceIfStateType, (match) => this.critChanceIfStateTypeLines(match, "thisCritChanceIfStateType"));
		NotetagDescriber.register(J.CRIT.RegExp.CritAlwaysIfState, (match) => this.critAlwaysIfStateLines(match, "critAlwaysIfState"));
		NotetagDescriber.register(J.CRIT.RegExp.ThisCritsAlwaysIfState, (match) => this.critAlwaysIfStateLines(match, "thisCritsAlwaysIfState"));
		NotetagDescriber.register(J.CRIT.RegExp.CritAlwaysIfStateType, (match) => this.critAlwaysIfStateTypeLines(match, "critAlwaysIfStateType"));
		NotetagDescriber.register(J.CRIT.RegExp.ThisCritsAlwaysIfStateType, (match) => this.critAlwaysIfStateTypeLines(match, "thisCritsAlwaysIfStateType"));
	}
	/**
	* The line describing a crit multiplier tag, or its base counterpart, in the sentence the game's config keeps
	* under the given key.
	*
	* The sentence may name `{value}`, the amount (`+50%`).
	* @param {RegExpExecArray} match The tag as its regex matched it; the first capture is its amount, in percent.
	* @param {string} templateKey The key of the tag's sentence.
	* @returns {NotetagLine[]}
	*/
	static critAmountLines(match, templateKey) {
		const [, writtenAmount] = match;
		const amount = Number(writtenAmount);
		const iconIndex = IconManager.critParam(0);
		const value = RPG_Trait.asDeltaPercent(amount);
		const holderImpact = this.amountImpact(amount);
		return NotetagDescriber.line(templateKey, {
			iconIndex,
			holderImpact,
			value
		});
	}
	/**
	* Which way a crit amount cuts for whoever carries it: one of {@link NotetagLine.Impacts}.
	*
	* Harder or likelier crits help their holder, and an amount of nothing changes nothing. The tags only ever carry
	* whole numbers of zero or more, so there is no amount that hurts.
	* @param {number} amount The amount, in percent.
	* @returns {number}
	*/
	static amountImpact(amount) {
		if (amount > 0) return NotetagLine.Impacts.HELPS;
		return NotetagLine.Impacts.NEITHER;
	}
	/**
	* The line describing a crit reduction tag, in the sentence the game's config keeps under `critReduction`.
	*
	* A reduction trims only the extra damage a critical hit deals, never the hit itself, so the sentence speaks of
	* that damage and shows it moving: a reduction of 30 is `-30%`, and a negative one, which lets crits land harder,
	* is `+10%`. The sentence may name `{value}`.
	* @param {RegExpExecArray} match The tag as its regex matched it; the first capture is its amount, in percent.
	* @returns {NotetagLine[]}
	*/
	static critReductionLines(match) {
		const [, writtenAmount] = match;
		const amount = Number(writtenAmount);
		const value = RPG_Trait.asDeltaPercent(-amount);
		return this.reductionLines("critReduction", amount, value);
	}
	/**
	* The line describing a base crit reduction tag, in the sentence the game's config keeps under
	* `critReductionBase`.
	*
	* The base is a reduction in its own right, so its amount is shown as written (`+20%`). The sentence may name
	* `{value}`.
	* @param {RegExpExecArray} match The tag as its regex matched it; the first capture is its amount, in percent.
	* @returns {NotetagLine[]}
	*/
	static critReductionBaseLines(match) {
		const [, writtenAmount] = match;
		const amount = Number(writtenAmount);
		const value = RPG_Trait.asDeltaPercent(amount);
		return this.reductionLines("critReductionBase", amount, value);
	}
	/**
	* The line for either crit reduction tag, drawn with crit block's own face.
	* @param {string} templateKey The key of the tag's sentence.
	* @param {number} amount The reduction as written, in percent, which decides which way the line cuts.
	* @param {string} value The amount as the sentence shows it.
	* @returns {NotetagLine[]}
	*/
	static reductionLines(templateKey, amount, value) {
		const iconIndex = IconManager.critParam(1);
		const holderImpact = this.reductionImpact(amount);
		return NotetagDescriber.line(templateKey, {
			iconIndex,
			holderImpact,
			value
		});
	}
	/**
	* Which way a crit reduction cuts for whoever carries it: one of {@link NotetagLine.Impacts}.
	*
	* Unlike a multiplier, a reduction may be negative: a debuff that lets critical hits land harder.
	* @param {number} amount The reduction, in percent.
	* @returns {number}
	*/
	static reductionImpact(amount) {
		if (amount > 0) return NotetagLine.Impacts.HELPS;
		if (amount < 0) return NotetagLine.Impacts.HURTS;
		return NotetagLine.Impacts.NEITHER;
	}
	/**
	* The line describing an on-crit state tag, in the sentence the game's config keeps under the given key: every
	* critical hit rolls a chance to apply a state, to whoever was hit or to whoever landed it.
	*
	* The sentence may name `{value}`, the chance (`50%`), and `{state}`, the state itself. A proc is carried for its
	* holder's sake, whichever battler it lands on, so the line always helps whoever carries it.
	* @param {RegExpExecArray} match The tag as its regex matched it; the first capture is `[STATE_ID, CHANCE]`.
	* @param {string} templateKey The key of the tag's sentence.
	* @returns {NotetagLine[]}
	*/
	static critStateLines(match, templateKey) {
		const [, writtenPair] = match;
		const [stateId, chance] = JsonMapper.parseObject(writtenPair);
		const iconIndex = IconManager.critParam(0);
		const state = this.stateToken(stateId);
		const value = `${chance}%`;
		const holderImpact = NotetagLine.Impacts.HELPS;
		return NotetagDescriber.line(templateKey, {
			iconIndex,
			holderImpact,
			value,
			tokens: { state }
		});
	}
	/**
	* The line describing a conditional crit chance tag, in the sentence the game's config keeps under the given key:
	* better odds of a critical hit against a target already carrying a given state.
	*
	* The sentence may name `{value}`, the bonus chance (`+30%`), and `{state}`, the state the target must carry.
	* @param {RegExpExecArray} match The tag as its regex matched it; the first capture is `[STATE_ID, BONUS_CHANCE]`.
	* @param {string} templateKey The key of the tag's sentence.
	* @returns {NotetagLine[]}
	*/
	static critChanceIfStateLines(match, templateKey) {
		const [, writtenPair] = match;
		const [stateId, bonusChance] = JsonMapper.parseObject(writtenPair);
		const state = this.stateToken(stateId);
		return this.critChanceLines(templateKey, bonusChance, { state });
	}
	/**
	* The line describing a conditional crit chance tag keyed by state type, in the sentence the game's config keeps
	* under the given key: better odds of a critical hit against a target carrying any state of a given type.
	*
	* A type is a classifier the game's own states declare with `<type:NAME>` rather than a row anywhere in the
	* database, so no text code can draw it: it is named exactly as the tag writes it. The sentence may name
	* `{value}`, the bonus chance (`+50%`), and `{type}`, the classifier.
	* @param {RegExpExecArray} match The tag as its regex matched it; the first capture is `[TYPE, BONUS_CHANCE]`.
	* @param {string} templateKey The key of the tag's sentence.
	* @returns {NotetagLine[]}
	*/
	static critChanceIfStateTypeLines(match, templateKey) {
		const [, writtenPair] = match;
		const [stateType, bonusChance] = JsonMapper.parseObject(writtenPair);
		const type = {
			text: stateType,
			kind: NotetagDescriber.TokenKinds.SUBJECT
		};
		return this.critChanceLines(templateKey, bonusChance, { type });
	}
	/**
	* The line for any conditional crit chance tag, drawn with crit chance's own face.
	* @param {string} templateKey The key of the tag's sentence.
	* @param {number} bonusChance The bonus to crit chance, in percent.
	* @param {Object<string, {text: string, kind: string}>} tokens What the target must carry, however it is named.
	* @returns {NotetagLine[]}
	*/
	static critChanceLines(templateKey, bonusChance, tokens) {
		const iconIndex = IconManager.xparam(2);
		const value = RPG_Trait.asDeltaPercent(bonusChance);
		const holderImpact = this.amountImpact(bonusChance);
		return NotetagDescriber.line(templateKey, {
			iconIndex,
			holderImpact,
			value,
			tokens
		});
	}
	/**
	* The lines describing a guaranteed-crit tag keyed by state, in the sentence the game's config keeps under the
	* given key: every hit able to crit is a critical hit against a target carrying any of the listed states.
	*
	* Any one of the states is enough, so each gets a line of its own, and every one of those lines is true alone.
	* The sentence may name `{state}`; there is no amount to show.
	* @param {RegExpExecArray} match The tag as its regex matched it; the first capture is `[STATE_ID, ...]`.
	* @param {string} templateKey The key of the tag's sentence.
	* @returns {NotetagLine[]}
	*/
	static critAlwaysIfStateLines(match, templateKey) {
		const [, writtenIds] = match;
		const stateIds = JsonMapper.parseObject(writtenIds);
		return stateIds.flatMap((stateId) => {
			const state = this.stateToken(stateId);
			return this.critAlwaysLines(templateKey, { state });
		});
	}
	/**
	* The line describing a guaranteed-crit tag keyed by state type, in the sentence the game's config keeps under the
	* given key: every hit able to crit is a critical hit against a target carrying any state of the given type.
	*
	* Like every type, it is named exactly as the tag writes it. The sentence may name `{type}`; there is no amount to
	* show.
	* @param {RegExpExecArray} match The tag as its regex matched it; the first capture is the type.
	* @param {string} templateKey The key of the tag's sentence.
	* @returns {NotetagLine[]}
	*/
	static critAlwaysIfStateTypeLines(match, templateKey) {
		const [, stateType] = match;
		const type = {
			text: stateType,
			kind: NotetagDescriber.TokenKinds.SUBJECT
		};
		return this.critAlwaysLines(templateKey, { type });
	}
	/**
	* The line for any guaranteed-crit tag, drawn with crit chance's own face.
	* @param {string} templateKey The key of the tag's sentence.
	* @param {Object<string, {text: string, kind: string}>} tokens What the target must carry, however it is named.
	* @returns {NotetagLine[]}
	*/
	static critAlwaysLines(templateKey, tokens) {
		const iconIndex = IconManager.xparam(2);
		const holderImpact = NotetagLine.Impacts.HELPS;
		return NotetagDescriber.line(templateKey, {
			iconIndex,
			holderImpact,
			tokens
		});
	}
	/**
	* A state named in a line, as the text code that draws its icon and name from the database when the line is drawn.
	* @param {number} stateId The state's id.
	* @returns {{text: string, kind: string}}
	*/
	static stateToken(stateId) {
		return {
			text: `\\state[${stateId}]`,
			kind: NotetagDescriber.TokenKinds.CODE
		};
	}
	/**
	* The line describing the tag that makes every on-crit state roll succeed, in the sentence the game's config
	* keeps under `forceCritProcs`.
	*
	* The tag carries no amount, so the sentence has nothing to name, and a guaranteed proc always helps whoever
	* carries it.
	* @returns {NotetagLine[]}
	*/
	static forceCritProcsLines() {
		const iconIndex = IconManager.critParam(0);
		const holderImpact = NotetagLine.Impacts.HELPS;
		return NotetagDescriber.line("forceCritProcs", {
			iconIndex,
			holderImpact
		});
	}
};

//#endregion
//#region src/plugins/crit/core/scenes/Scene_Boot.js
/**
* Extends {@link #onDatabaseLoaded}.<br/>
* Registers J-Crit stats with the parameter catalog after vanilla seeding, and describes this plugin's tags.
*/
J.CRIT.Aliased.Scene_Boot.set("onDatabaseLoaded", Scene_Boot.prototype.onDatabaseLoaded);
Scene_Boot.prototype.onDatabaseLoaded = function() {
	J.CRIT.Aliased.Scene_Boot.get("onDatabaseLoaded").call(this);
	CritParameterRegistration.registerAll();
	CritNotetagDescriptions.registerAll();
	J.EXTEND.Metadata.registerNonCombiningKey(J.CRIT.RegExp.ThisCritChanceIfState);
	J.EXTEND.Metadata.registerNonCombiningKey(J.CRIT.RegExp.ThisCritChanceIfStateType);
	J.EXTEND.Metadata.registerNonCombiningKey(J.CRIT.RegExp.CritChanceIfState);
	J.EXTEND.Metadata.registerNonCombiningKey(J.CRIT.RegExp.CritChanceIfStateType);
	J.EXTEND.Metadata.registerNonCombiningKey(J.CRIT.RegExp.ThisCritsAlwaysIfState);
	J.EXTEND.Metadata.registerNonCombiningKey(J.CRIT.RegExp.ThisCritsAlwaysIfStateType);
	J.EXTEND.Metadata.registerNonCombiningKey(J.CRIT.RegExp.CritAlwaysIfState);
	J.EXTEND.Metadata.registerNonCombiningKey(J.CRIT.RegExp.CritAlwaysIfStateType);
};

//#endregion
//# sourceMappingURL=J-CriticalFactors.js.map