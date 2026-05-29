//region Introduction
/*:
 * @target MZ
 * @plugindesc [v1.0.2 CRIT] Manages critical damage multiplier/reduction of battlers.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-NaturalGrowth
 * @help
 * ============================================================================
 * This plugin enables the ability to control the multiplier of critical damage
 * based on a pair of tags.
 *
 * Integrates with others of mine plugins:
 * - J-SDP            (can earn CDM and CDR from panels)
 * - J-NaturalGrowths (can grow CDM and CDR via levels)
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * This overwrites the "applyCritical()" function in its entirety and replaces
 * the functionality with two new parameters on battlers: cdm and cdr, which
 * are described below. One significant difference to note is that critical hit
 * damage is calculated and managed separately, allowing for a battler's CDR
 * parameter to mitigate the critical portion entirely while still taking the
 * base damage. Additionally, the base critical damage multiplier is reduced by
 * default, and is parameterized for your convenience- because lets face it:
 * triple damage for a crit is an awful lot for the default.
 *
 * ============================================================================
 * THIS ACTION CRITICAL MODIFIERS:
 * Have you ever wanted to modify the current action's critical chance and/or
 * modifier? Well now you can! By applying the appropriate tag to the database
 * objects in question, you can control the critical chance and critical
 * damage modifiers for a specific skill's execution!
 * 
 * NOTE:
 * This stacks additively with other crit effects.
 * 
 * NOTE:
 * The effects of these tags do not apply to skills that cannot crit, so be
 * sure to make certain the critical dropdown is set to "YES" in the damage
 * formula box for the given skill. 
 * 
 * TAG USAGE:
 * - Items
 * - Skills
 * 
 * TAG FORMAT:
 *  <thisCritChance:[FORMULA]>
 *  <thisCritDamageMultiplier:[FORMULA]>
 *  <thisCritsAlways>
 * 
 * TAG EXAMPLES:
 *  <thisCritChance:[25]>
 * Increases the critical chance of this particular skill by 25%.
 * 
 *  <thisCritDamageMultiplier:[10 + a.agi]>
 * Increases the critical damage multiplier by 10% plus the battler's agility.
 * 
 *  <thisCritsAlways>
 * The skill or item with this tag will ALWAYS crit.
 * 
 * ============================================================================
 * CRITICAL DAMAGE MULTIPLIER:
 * Have you ever wanted to have any amount of control over critical damage?
 * Well now you can! By applying the appropriate tag to various database
 * locations, you can now control how hard (or weak) a battler's crit will be!
 *
 * DETAILS:
 * Four new tags are available for use across the various applicable database
 * objects: two for base values, and two for adding onto the base. While you
 * can use any of the four on any of the database locations listed below, it
 * was designed so that the "base" tags would live on static objects, like the
 * actor itself, while the non-base tags would live everywhere else.
 *
 * The two base values have greater impact when used in the context of
 * "J-NaturalGrowths", as they are a new value that can be leveraged within
 * the formulas you write, allowing for complex buff/growth formulas revolving
 * around incoming/outgoing critical hit damage.
 *
 * NOTE:
 * If multiple tags are present on a single battler, then all tag amounts will
 * be added together for a single multiplier amount as seen in the examples.
 *
 * USING "J-NATURALGROWTHS":
 * If using my "J-NaturalGrowths" plugin as well, these tags will function in
 * a near identical fashion to the "(cdm|cdr)(Buff)(Plus):[flat amount]" type
 * of tags. To spare the extra unnecessary loops, it is recommended that if
 * using the "J-NaturalGrowths" plugin as well, then to use the suggested format
 * provided by that plugin instead of this.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - States
 *
 * TAG FORMAT:
 *  <critMultiplierBase:NUM>
 *  <critMultiplier:NUM>
 * Where NUM is the amount to add to the battler's critical damage multiplier.
 *
 * TAG EXAMPLE(S):
 *  <critMultiplier:50>
 * Increases the outgoing critical damage multiplier by 50% for this battler.
 *
 *  <critMultiplier:10>
 *  <critMultiplier:40>
 *  <critMultiplier:150>
 * Increases the outgoing critical damage multiplier by 200% for this battler.
 *
 * ============================================================================
 * CRITICAL DAMAGE REDUCTION:
 * Have you ever regreted adding a ton of critical damage multipliers across
 * the various database locations and now need to counterbalance that somehow?
 * Well now you can! By applying the appropriate tag in various database
 * locations, you can now reduce the amount of damage received when an enemy
 * battler lands a critical hit!
 *
 * NOTE:
 * This reduces the amount of CRITICAL damage, and does not actually impact the
 * base damage that the critical hit is based on. See the overview details for
 * more information.
 *
 * USING "J-NATURALGROWTHS":
 * If using my "J-NaturalGrowths" plugin as well, these tags will function in
 * a near identical fashion to the "(cdm|cdr)(Buff)(Plus):[flat amount]" type
 * of tags. To spare the extra unnecessary loops, it is recommended that if
 * using the "J-NaturalGrowths" plugin as well, then to use the suggested format
 * provided by that plugin instead of this.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - Enemies
 * - States
 *
 * TAG FORMAT:
 *  <critReductionBase:NUM>
 *  <critReduction:NUM>
 * Where NUM is the amount to add to the battler's critical damage reduction.
 *
 * TAG EXAMPLE(S):
 *  <critReduction:30>
 * Reduces critical damage against this battler by 30%.
 *
 *  <critReduction:10>
 *  <critReduction:30>
 *  <critReduction:80>
 * The three amounts above total to above 100. This means that this battler
 * will NOT take any bonus damage from critical hits. All critical hits will
 * be the same as non-critical hits. However, for the sake of other possible
 * effects, the attack will still be classified as a "critical hit".
 * ============================================================================
 * NATURAL GROWTH + CRITICAL DAMAGE MULTIPLIERS/REDUCTIONS:
 * Have you ever wanted to permanently grow your CDM/CDR stats along with your
 * other growths that you have setup because you're also using my
 *
 *        J-NaturalGrowth
 *
 * plugin? Well now you can! By taking advantage of the same builder-like
 * pattern already established by the natural growths plugin, you too can start
 * growing your CDR and CDM by flat or rate multipliers as you level up!
 *
 * NOTE ABOUT NATURAL "BUFFS" FOR CDM/CDR:
 * Unlike other natural buffs, cdm/cdr are not tracked and only used during the
 * calculation of a critical hit.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - Enemies
 * - States
 *
 * TAG FORMAT:
 *  <(PARAM)(BUFF|GROWTH)(PLUS|RATE):[FORMULA]>
 * Where (PARAM) is the (base/sp/ex) parameter shorthand.
 * Where (BUFF|GROWTH) is literally one of either "Buff" or "Growth".
 * Where (PLUS|RATE) is literally one of either "Plus" or "Rate".
 * Where [FORMULA] is the formula to produce the amount.
 *
 * EXAMPLE:
 *  <cdmGrowthRate:[5]>
 * Gain +5% crit damage multiplier (cdm) per level.
 * This would result in gaining an ever-increasing amount of crit damage
 * multiplier per level.
 *
 *  <cdrBuffPlus:[25]>
 * Gain a flat 25 crit damage reduction (cdr) while this tag is applied to
 * this battler.
 * This would be lost if the object this tag lived on was removed.
 *
 *  <cdmGrowthPlus:[a.level * 3]>
 * Gain (the battler's level multiplied by 3) crit damage multiplier (cdm) per
 * level.
 * This would result in gaining an ever-increasing amount of crit damage
 * multiplier per level.
 *
 * Please refer to the other plugin's documentation for more details.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.2
 *    Added dependency note about NaturalGrowth.
 *    Added ordering annotation for coming after J-NaturalGrowth.
 * - 1.0.1
 *    Fixed issue where CDM and CDR were not being calculated for SDP bonuses.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */

//#region src/plugins/crit/core/_metadata/_pluginMetadata.js
var J_CriticalFactorsPluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
};

//#endregion
//#region src/plugins/crit/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "2.1.0";
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
J.CRIT.Metadata = new J_CriticalFactorsPluginMetadata("J-CriticalFactors", "1.0.2");
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
	CritDamageReductionBase: /<critReductionBase: ?(\d+)>/gi,
	CritDamageReduction: /<critReduction: ?(\d+)>/gi,
	CritDamageMultiplierBase: /<critMultiplierBase: ?(\d+)>/gi,
	CritDamageMultiplier: /<critMultiplier: ?(\d+)>/gi,
	CritDamageReductionBuffPlus: /<cdrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	CritDamageReductionBuffRate: /<cdrBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	CritDamageReductionGrowthPlus: /<cdrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	CritDamageReductionGrowthRate: /<cdrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	CritDamageMultiplierBuffPlus: /<cdmBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	CritDamageMultiplierBuffRate: /<cdmBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	CritDamageMultiplierGrowthPlus: /<cdmGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	CritDamageMultiplierGrowthRate: /<cdmGrowthRate:\[([+\-*/ ().\w]+)]>/gi
};

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
* Extends `apply()` to also set the target for more universal use throughout the calculations.
*/
J.CRIT.Aliased.Game_Action.set("apply", Game_Action.prototype.apply);
Game_Action.prototype.apply = function(target) {
	this.setTargetBattler(target);
	J.CRIT.Aliased.Game_Action.get("apply").call(this, target);
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
* Calculates the amount of critical damage that will be removed from the bonus crit damage.
* @param {number} criticalDamage The critical damage to be added.
* @returns {number} The amount of critical damage after mitigations.
*/
Game_Action.prototype.applyCriticalDamageReduction = function(criticalDamage) {
	const defender = this.targetBattler();
	if (!defender) return criticalDamage;
	const baseCriticalReductionRate = 1 - defender.cdr;
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
	let critChance = this.subject().cri;
	critChance += this.ownCriticalChanceBonus();
	critChance -= target.cev;
	return Math.max(critChance, 0);
};
/**
* Calculates this action's own bonus to crit damage multipliers.
* @returns {number}
*/
Game_Action.prototype.ownCriticalDamageMultiplier = function() {
	return RPGManager.getSumFromAllNotesByRegex([this.item()], J.CRIT.RegExp.ThisCritDamageMultiplier) / 100;
};
/**
* Checks if this action is a guaranteed critical hit.
* @returns {boolean}
*/
Game_Action.prototype.isGuaranteedCrit = function() {
	return RPGManager.checkForBooleanFromNoteByRegex(this.item(), J.CRIT.RegExp.ThisCritsAlways);
};
/**
* Calculates this action's own bonus to crit chance.
* @returns {number}
*/
Game_Action.prototype.ownCriticalChanceBonus = function() {
	return RPGManager.getSumFromAllNotesByRegex([this.item()], J.CRIT.RegExp.ThisCritDamageChance) / 100;
};

//#endregion
//#region src/plugins/crit/core/objects/Game_Actor.js
/**
* Extend `.applyNaturalCustomGrowths()` to include our cdm/cdr growths.
*/
J.CRIT.Aliased.Game_Actor.set("applyNaturalCustomGrowths", Game_Actor.prototype.applyNaturalCustomGrowths);
Game_Actor.prototype.applyNaturalCustomGrowths = function() {
	J.CRIT.Aliased.Game_Actor.get("applyNaturalCustomGrowths").call(this);
	if (!J.NATURAL) return;
	this.applyNaturalCdmGrowths();
	this.applyNaturalCdrGrowths();
};
/**
* Applies the natural CDM growths to this battler.
*/
Game_Actor.prototype.applyNaturalCdmGrowths = function() {
	const [, , growthPlusStructure, growthRateStructure] = this.getNaturalGrowthsRegexForCrit();
	const baseCdm = this.baseCriticalMultiplier();
	const growthPlus = this.naturalParamBuff(growthPlusStructure, baseCdm);
	this.modCdmPlus(growthPlus);
	const growthRate = this.naturalParamBuff(growthRateStructure, baseCdm);
	this.modCdmRate(growthRate);
};
/**
* Applies the natural CDR growths to this battler.
*/
Game_Actor.prototype.applyNaturalCdrGrowths = function() {
	const [growthPlusStructure, growthRateStructure, ,] = this.getNaturalGrowthsRegexForCrit();
	const baseCdr = this.baseCriticalReduction();
	const growthPlus = this.naturalParamBuff(growthPlusStructure, baseCdr);
	this.modCdrPlus(growthPlus);
	const growthRate = this.naturalParamBuff(growthRateStructure, baseCdr);
	this.modCdrRate(growthRate);
};
/**
* Gets the various regular expressions used for getting CDM/CDR growth values.
* @returns {[RegExp,RegExp,RegExp,RegExp]}
*/
Game_Actor.prototype.getNaturalGrowthsRegexForCrit = function() {
	return [
		J.CRIT.RegExp.CritDamageReductionGrowthPlus,
		J.CRIT.RegExp.CritDamageReductionGrowthRate,
		J.CRIT.RegExp.CritDamageMultiplierGrowthPlus,
		J.CRIT.RegExp.CritDamageMultiplierGrowthRate
	];
};
/**
* Gets all SDP bonuses for the given crit parameter id.
* @param {number} critParamId The id of the crit parameter.
* @param {number} baseParam The base value of the crit parameter in question.
* @returns {number}
*/
Game_Actor.prototype.critSdpBonuses = function(critParamId, baseParam) {
	const parameterKey = critParamId === 0 ? "cdm" : "cdr";
	return this.getSdpBonusForParameterKey(parameterKey, baseParam);
};

//#endregion
//#region src/plugins/crit/core/core/registerCritParameters.js
/**
* Registers CDM and CDR with the parameter catalog.
*/
function registerCritParameters() {
	ParameterRegistry.register(ParameterDefinition.Builder().key("cdm").group(ParameterGroups.PRECISION).sortOrder(6).label(() => TextManager.critParam(0)).description(() => TextManager.critParamDescription(0)).iconIndex(() => IconManager.critParam(0)).format(ParameterFormat.PERCENT_SUFFIX).getValue((battler) => battler.cdm).sdpBinding(SdpParameterBinding.byKey("cdm", (actor) => actor.baseCriticalMultiplier())).build());
	ParameterRegistry.register(ParameterDefinition.Builder().key("cdr").group(ParameterGroups.PRECISION).sortOrder(7).label(() => TextManager.critParam(1)).description(() => TextManager.critParamDescription(1)).iconIndex(() => IconManager.critParam(1)).format(ParameterFormat.PERCENT_SUFFIX).getValue((battler) => battler.cdr).sdpBinding(SdpParameterBinding.byKey("cdr", (actor) => actor.baseCriticalReduction())).build());
}
registerCritParameters();

//#endregion
//#region src/plugins/crit/core/objects/Game_Battler.js
/**
* Extends `.initNaturalGrowthParameters()` to include the new critical damage parameters as growth-ready.
*/
J.CRIT.Aliased.Game_Battler.set("initNaturalGrowthParameters", Game_Battler.prototype.initNaturalGrowthParameters);
Game_Battler.prototype.initNaturalGrowthParameters = function() {
	if (!J.NATURAL) return;
	J.CRIT.Aliased.Game_Battler.get("initNaturalGrowthParameters").call(this);
	/**
	* The J object where all my additional properties live.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with natural growth.
	*/
	this._j._natural ||= {};
	/**
	* The permanent flat bonus for CDM.
	* @type {number}
	*/
	this._j._natural._cdmPlus = 0;
	/**
	* The permanent multiplier bonus for CDR.
	* @type {number}
	*/
	this._j._natural._cdmRate = 0;
	/**
	* The permanent flat bonus for CDM.
	* @type {number}
	*/
	this._j._natural._cdrPlus = 0;
	/**
	* The permanent multiplier bonus for CDR.
	* @type {number}
	*/
	this._j._natural._cdrRate = 0;
};
/**
* Gets the permanent flat bonus for CDM.
* @returns {number}
*/
Game_Battler.prototype.cdmPlus = function() {
	return this._j._natural._cdmPlus;
};
/**
* Modifies the permanent flat bonus for CDM.
* @param {number} amount The amount to modify the bonus by.
*/
Game_Battler.prototype.modCdmPlus = function(amount) {
	this._j._natural._cdmPlus += amount;
};
/**
* Gets the permanent multiplicative bonus for CDM.
* @returns {number}
*/
Game_Battler.prototype.cdmRate = function() {
	return this._j._natural._cdmRate;
};
/**
* Modifies the permanent multiplicative bonus for CDM.
* @param {number} amount The amount to modify the bonus by.
*/
Game_Battler.prototype.modCdmRate = function(amount) {
	this._j._natural._cdmRate += amount;
};
/**
* Gets the current growths applied to CDR plus.
* @returns {number}
*/
Game_Battler.prototype.cdrPlus = function() {
	return this._j._natural._cdrPlus;
};
/**
* Modifies the permanent flat bonus for CDR.
* @param {number} amount The amount to modify the bonus by.
*/
Game_Battler.prototype.modCdrPlus = function(amount) {
	this._j._natural._cdrPlus += amount;
};
/**
* Gets the current growths applied to CDR rate.
* @returns {number}
*/
Game_Battler.prototype.cdrRate = function() {
	return this._j._natural._cdrRate;
};
/**
* Modifies the permanent multiplicative bonus for CDR.
* @param {number} amount The amount to modify the bonus by.
*/
Game_Battler.prototype.modCdrRate = function(amount) {
	this._j._natural._cdrRate += amount;
};
/**
* Gets the base multiplier for this battler's critical hits.
* @returns {number}
*/
Game_Battler.prototype.baseCriticalMultiplier = function() {
	const objectsToCheck = this.getAllNotes();
	const baseCriticalMultiplier = RPGManager.getSumFromAllNotesByRegex(objectsToCheck, J.CRIT.RegExp.CritDamageMultiplierBase);
	const baseCdmFactor = baseCriticalMultiplier / 100;
	return baseCdmFactor;
};
/**
* Calculates this battler's current critical damage multiplier.
* @returns {number}
*/
Game_Battler.prototype.criticalDamageMultiplier = function() {
	const cdmBonuses = this.getCriticalDamageMultiplier();
	const cdmNaturalBonuses = this.cdmNaturalBonuses();
	const cdmSdpBonuses = this.critSdpBonuses(0, this.baseCriticalMultiplier());
	const cdmFactor = (cdmBonuses + cdmNaturalBonuses + cdmSdpBonuses) / 100;
	return cdmFactor;
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
* Gets all natural bonuses for cdm, excluding the base cdm itself.
* @returns {number}
*/
Game_Battler.prototype.cdmNaturalBonuses = function() {
	if (!J.NATURAL) return 0;
	const cdmBuffs = this.cdmNaturalBuffs();
	const cdmGrowths = this.cdmNaturalGrowths();
	return cdmBuffs + cdmGrowths;
};
/**
* Calculates the buffs for critical damage multipliers.
* @returns {number}
*/
Game_Battler.prototype.cdmNaturalBuffs = function() {
	const objectsToCheck = this.getAllNotes();
	const baseParam = this.baseCriticalMultiplier();
	const cdmBuffPlus = RPGManager.getResultsFromAllNotesByRegex(objectsToCheck, J.CRIT.RegExp.CritDamageMultiplierBuffPlus, baseParam, this);
	const cdmBuffRate = RPGManager.getResultsFromAllNotesByRegex(objectsToCheck, J.CRIT.RegExp.CritDamageMultiplierBuffRate, baseParam, this);
	if (!cdmBuffPlus && !cdmBuffRate) return 0;
	return this.calculatePlusRate(baseParam, cdmBuffPlus, cdmBuffRate);
};
/**
* Calculates the growths associated with critical damage multipliers.
* @returns {number}
*/
Game_Battler.prototype.cdmNaturalGrowths = function() {
	const baseCdm = this.baseCriticalMultiplier();
	const growthPlus = this.cdmPlus();
	const growthRate = this.cdmRate();
	if (!growthPlus && !growthRate) return 0;
	return this.calculatePlusRate(baseCdm, growthPlus, growthRate);
};
/**
* Gets the base reduction for this battler's critical hits.
* @returns {number}
*/
Game_Battler.prototype.baseCriticalReduction = function() {
	const objectsToCheck = this.getAllNotes();
	const baseCriticalReduction = RPGManager.getSumFromAllNotesByRegex(objectsToCheck, J.CRIT.RegExp.CritDamageReductionBase);
	const baseCdmFactor = baseCriticalReduction / 100;
	return baseCdmFactor;
};
/**
* Gets the reduction factor for when this battler receives a critical hit.
* @returns {number} The CDR factor for this battler.
*/
Game_Battler.prototype.criticalDamageReduction = function() {
	const cdrBonuses = this.getCriticalDamageReduction();
	const cdrNaturalBonuses = this.cdrNaturalBonuses();
	const cdrSdpBonuses = this.critSdpBonuses(1, this.baseCriticalReduction());
	const cdrFactor = (cdrBonuses + cdrNaturalBonuses + cdrSdpBonuses) / 100;
	return cdrFactor;
};
/**
* Gets the sum of all critical damage reductions from all notes.
* @returns {number}
*/
Game_Battler.prototype.getCriticalDamageReduction = function() {
	const objectsToCheck = this.getAllNotes();
	const cdrBonuses = RPGManager.getSumFromAllNotesByRegex(objectsToCheck, J.CRIT.RegExp.CritDamageReduction);
	return cdrBonuses;
};
/**
* Gets all natural bonuses for cdr, excluding the base cdr itself.
* @returns {number}
*/
Game_Battler.prototype.cdrNaturalBonuses = function() {
	if (!J.NATURAL) return 0;
	const cdmBuffs = this.cdrNaturalBuffs();
	const cdmGrowths = this.cdrNaturalGrowths();
	return cdmBuffs + cdmGrowths;
};
/**
* Calculates the buffs for critical damage reductions.
* @returns {number}
*/
Game_Battler.prototype.cdrNaturalBuffs = function() {
	const objectsToCheck = this.getAllNotes();
	const baseParam = this.baseCriticalReduction();
	const cdrBuffPlus = RPGManager.getResultsFromAllNotesByRegex(objectsToCheck, J.CRIT.RegExp.CritDamageReductionBuffPlus, baseParam, this);
	const cdrBuffRate = RPGManager.getResultsFromAllNotesByRegex(objectsToCheck, J.CRIT.RegExp.CritDamageReductionBuffRate, baseParam, this);
	if (!cdrBuffPlus && !cdrBuffRate) return 0;
	const baseCdr = this.baseCriticalReduction();
	return this.calculatePlusRate(baseCdr, cdrBuffPlus, cdrBuffRate);
};
/**
* Calculates the growths associated with critical damage reductions.
* @returns {number}
*/
Game_Battler.prototype.cdrNaturalGrowths = function() {
	const baseCdr = this.baseCriticalReduction();
	const growthPlus = this.cdrPlus();
	const growthRate = this.cdrRate();
	if (!growthPlus && !growthRate) return 0;
	return this.calculatePlusRate(baseCdr, growthPlus, growthRate);
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
	* The battler's critical damage reduction.
	* Critical hit damage is reduced by this percent before being applied.
	* @type {number}
	*/
	cdr: {
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
* @returns {number} The base multiplier for this battler.
*/
Game_BattlerBase.prototype.baseCriticalMultiplier = function() {
	return .5;
};
/**
* Gets the multiplier for this battler's critical hits.
* @returns {number}
*/
Game_BattlerBase.prototype.criticalDamageMultiplier = function() {
	return 0;
};
/**
* The base critical damage reduction.
* A battler's critical damage reduction acts as the base crit reduction for all incoming
* critical hits. The individual battler's `cdr` is added to this amount to calculate
* the damage a critical hit can potentially deal.
* @returns {number} The base reduction for this battler.
*/
Game_BattlerBase.prototype.baseCriticalReduction = function() {
	return .5;
};
/**
* Gets the reduction factor for when this battler receives a critical hit.
* @returns {number}
*/
Game_BattlerBase.prototype.criticalDamageReduction = function() {
	return 0;
};

//#endregion
//#region src/plugins/crit/core/scenes/Scene_Boot.js
/**
* Extends {@link #onDatabaseLoaded}.<br/>
* No initialization required for J-Crit on database load at this time;
* the passive detail window draws J-Crit data directly from the state note.
*/
J.CRIT.Aliased.Scene_Boot.set("onDatabaseLoaded", Scene_Boot.prototype.onDatabaseLoaded);
Scene_Boot.prototype.onDatabaseLoaded = function() {
	J.CRIT.Aliased.Scene_Boot.get("onDatabaseLoaded").call(this);
};

//#endregion
//# sourceMappingURL=J-CriticalFactors.js.map