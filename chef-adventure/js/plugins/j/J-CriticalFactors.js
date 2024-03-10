//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 CRIT] Manages critical damage multiplier/reduction of battlers.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
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
 *        J-NaturalGrowths
 *
 * plugin? Well now you can! By taking advantage of the same builder-like
 * pattern already established by the natural growths plugin, you too can start
 * growing your CDR and CDM by flat or rate multipliers as you level up!
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
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//endregion version check

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.CRIT = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.CRIT.Metadata =
  {
    /**
     * The name of this plugin.
     */
    Name: `J-CriticalFactors`,

    /**
     * The version of this plugin.
     */
    Version: '1.0.0',
  };

/**
 * A collection of all aliased methods for this plugin.
 */
J.CRIT.Aliased =
  {
    Game_Action: new Map(),
    Game_Actor: new Map(),
    Game_Battler: new Map(),
    Game_BattlerBase: new Map(),
    Game_Enemy: new Map(),
    IconManager: new Map(),
    TextManager: new Map(),
    Window_SDP_Details: new Map(),
  };

/**
 * All regular expressions used by this plugin.
 */
J.CRIT.RegExp = {
  // base functionality.
  CritDamageReductionBase: /<critReductionBase:[ ]?(\d+)>/gi,
  CritDamageReduction: /<critReduction:[ ]?(\d+)>/gi,
  CritDamageMultiplierBase: /<critMultiplierBase:[ ]?(\d+)>/gi,
  CritDamageMultiplier: /<critMultiplier:[ ]?(\d+)>/gi,

  // for natural growths compatability.
  CritDamageReductionBuffPlus: /<cdrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  CritDamageReductionBuffRate: /<cdrBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  CritDamageReductionGrowthPlus: /<cdrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  CritDamageReductionGrowthRate: /<cdrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,

  // for natural growths compatability.
  CritDamageMultiplierBuffPlus: /<cdmBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  CritDamageMultiplierBuffRate: /<cdmBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  CritDamageMultiplierGrowthPlus: /<cdmGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  CritDamageMultiplierGrowthRate: /<cdmGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
};
//endregion Introduction

//region IconManager
/**
 * Extend {@link #longParam}.<br>
 * First checks if the paramId was a critical param before checking others.
 */
J.CRIT.Aliased.IconManager.set('longParam', IconManager.longParam)
IconManager.longParam = function(paramId)
{
  switch (paramId)
  {
    case 28:
      return this.critParam(0);   // cdm
    case 29:
      return this.critParam(1);   // cdr
    default:
      return J.CRIT.Aliased.IconManager.get('longParam').call(this, paramId);
  }
};

/**
 * Gets the icon index for the critical damage parameters.
 * @param {number} paramId The id of the crit param to get an icon index for.
 * @returns {number}
 */
IconManager.critParam = function(paramId)
{
  switch (paramId)
  {
    case 0:
      return 976;    // cdm
    case 1:
      return 977;    // cdr
  }
};
//endregion IconManager

//region TextManager
/**
 * Extends {@link #longParam}.<br>
 * First searches for our critical damage text ids before searching for others.
 */
J.CRIT.Aliased.TextManager.set('longParam', TextManager.longParam);
TextManager.longParam = function(paramId)
{
  switch (paramId)
  {
    case 28:
      return this.critParam(0);   // cdm
    case 29:
      return this.critParam(1);   // cdr
    default:
      // perform original logic.
      return J.CRIT.Aliased.TextManager.get('longParam').call(this, paramId);
  }
};

/**
 * Gets the text for the critical damage parameters from "J-CriticalFactors".
 * @param {number} paramId The id of the crit param to get a name for.
 * @returns {string} The name of the parameter.
 */
TextManager.critParam = function(paramId)
{
  switch (paramId)
  {
    case 0:
      return "Crit Amp";
    case 1:
      return "Crit Block";
  }
};

/**
 * Extends {@link #longParamDescription}.<br>
 * First searches for our critical damage text ids before searching for others.
 */
J.CRIT.Aliased.TextManager.set('longParamDescription', TextManager.longParamDescription);
TextManager.longParamDescription = function(paramId)
{
  switch (paramId)
  {
    case 28:
      return this.critParamDescription(0);   // cdm
    case 29:
      return this.critParamDescription(1);   // cdr
    default:
      // perform original logic.
      return J.CRIT.Aliased.TextManager.get('longParamDescription').call(this, paramId);
  }
};

/**
 * Gets the description text for the critical damage parameters.
 * @param {number} paramId The id of the crit param to get a description for.
 * @returns {string[]}
 */
TextManager.critParamDescription = function(paramId)
{
  switch (paramId)
  {
    case 0:
      return [
        "The numeric value to the intensity of one's critical hits.",
        "Higher amounts of this yield bigger critical hits."
      ];
    case 1:
      return [
        "The numeric value to one's percent reduction of critical damage.",
        "Enemy critical amp is directly reduced by this amount."
      ];
  }
};
//endregion TextManager

//region Game_Action
/**
 * Extends the `initialize()` function to include initializing our new target tracker.
 * Note that the target tracker will remain null on this action until after our custom logic
 * within `apply()` has been executed (before aliased function logic).
 */
J.CRIT.Aliased.Game_Action.set('initialize', Game_Action.prototype.initialize);
Game_Action.prototype.initialize = function(subject, forcing)
{
  // perform original logic.
  J.CRIT.Aliased.Game_Action.get('initialize').call(this, subject, forcing);

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
Game_Action.prototype.setTargetBattler = function(targetBattler)
{
  this._targetBattler = targetBattler;
};

/**
 * Gets the current target of this action.
 * This will always yield `null` if this is accessed before `apply()` has started running.
 * @returns {Game_Actor|Game_Enemy|null}
 */
Game_Action.prototype.targetBattler = function()
{
  return this._targetBattler;
};

/**
 * Extends `apply()` to also set the target for more universal use throughout the calculations.
 */
J.CRIT.Aliased.Game_Action.set('apply', Game_Action.prototype.apply);
Game_Action.prototype.apply = function(target)
{
  // set the target for more universal use.
  this.setTargetBattler(target);

  // perform whatever the base action application is to the target.
  J.CRIT.Aliased.Game_Action.get('apply').call(this, target);
};

/**
 * OVERWRITE Replaces the way critical damage is calculated by
 * adding multiplier and reduction modifiers for actors and enemies alike.
 * @param {number} baseDamage The base damage before crit modification.
 * @returns {number} The critically modified damage.
 */
Game_Action.prototype.applyCritical = function(baseDamage)
{
  // get the actual amount of bonus critical damage to add to the base damage.
  const criticalBonusDamage = this.applyCriticalDamageMultiplier(baseDamage);

  // reduce the above bonus critical damage by any reductions on the target.
  const reducedCriticalBonusDamage = this.applyCriticalDamageReduction(criticalBonusDamage);

  // add the remaining bonus critical
  const criticalDamage = baseDamage + reducedCriticalBonusDamage;

  // return the total damage including critical modifiers.
  return criticalDamage;
};

/**
 * Calculates the amount of critical damage to add onto the base damage.
 * @param {number} baseDamage The base damage before crit modification.
 * @returns {number} The amount of critical damage to add onto the base.
 */
Game_Action.prototype.applyCriticalDamageMultiplier = function(baseDamage)
{
  // get the attacker for this action.
  const attacker = this.subject();

  // get the base crit multiplier.
  let critMultiplier = attacker.baseCriticalMultiplier();

  // get the attacker's bonus crit multiplier.
  critMultiplier += attacker.cdm;

  // calculate the bonus damage.
  const criticalDamage = (baseDamage * critMultiplier);

  // return the calculated amount of critical bonus damage to add onto the base.
  return criticalDamage;
};

/**
 * Calculates the amount of critical damage that will be removed from the bonus crit damage.
 * @param {number} criticalDamage The critical damage to be added.
 * @returns {number} The amount of critical damage after mitigations.
 */
Game_Action.prototype.applyCriticalDamageReduction = function(criticalDamage)
{
  // get the target for this action.
  const defender = this.targetBattler();

  // if somehow we don't have a defender/target, then just return the base damage.
  if (!defender) return criticalDamage;

  // this gives us a multiplier representing how reduced the crit damage is.
  const baseCriticalReductionRate = (1 - defender.cdr)

  // this cannot reduce the crit bonus damage below 0.
  const criticalReductionRate = Math.max(baseCriticalReductionRate, 0);

  // the newly modified amount of damage after reduction.
  const modifiedCriticalDamage = criticalDamage * criticalReductionRate;

  // return the calculated amount of remaining critical damage after reductions.
  return modifiedCriticalDamage;
};
//endregion Game_Action

//region Game_Actor
if (J.NATURAL)
{
  /**
   * Extend `.applyNaturalCustomGrowths()` to include our cdm/cdr growths.
   */
  J.NATURAL.Aliased.Game_Actor.set('applyNaturalCustomGrowths', Game_Actor.prototype.applyNaturalCustomGrowths);
  Game_Actor.prototype.applyNaturalCustomGrowths = function()
  {
    // perform original logic.
    J.NATURAL.Aliased.Game_Actor.get('applyNaturalCustomGrowths').call(this);

    // do natural cdm growths.
    this.applyNaturalCdmGrowths();

    // do natural cdr growths.
    this.applyNaturalCdrGrowths();
  };
}

/**
 * Extend `.longParam()` to first check for our crit params.
 */
J.CRIT.Aliased.Game_Actor.set('longParam', Game_Actor.prototype.longParam);
Game_Actor.prototype.longParam = function(longParamId)
{
  switch (longParamId)
  {
    case 28:
      return this.cdm;
    case 29:
      return this.cdr;
    default:
      return J.CRIT.Aliased.Game_Actor.get('longParam').call(this, longParamId);
  }
};

/**
 * Applies the natural CDM growths to this battler.
 */
Game_Actor.prototype.applyNaturalCdmGrowths = function()
{
  // destructure out the plus and rate structures for growths.
  const [,,growthPlusStructure, growthRateStructure] = this.getNaturalGrowthsRegexForCrit();

  // grab the base CDM for value basing.
  const baseCdm = this.baseCriticalMultiplier();

  // calculate the flat growth.
  const growthPlus = this.naturalParamBuff(growthPlusStructure, baseCdm);

  // add the flat growth to this battler.
  this.modCdmPlus(growthPlus);

  // calculate the rate growth.
  const growthRate = this.naturalParamBuff(growthRateStructure, baseCdm);

  // add the rate growth to this battler.
  this.modCdmRate(growthRate);
};

/**
 * Applies the natural CDR growths to this battler.
 */
Game_Actor.prototype.applyNaturalCdrGrowths = function()
{
  // destructure out the plus and rate structures for growths.
  const [growthPlusStructure, growthRateStructure,,] = this.getNaturalGrowthsRegexForCrit();

  // grab the base CDR for value basing.
  const baseCdr = this.baseCriticalReduction();

  // calculate the flat growth.
  const growthPlus = this.naturalParamBuff(growthPlusStructure, baseCdr);

  // add the flat growth to this battler.
  this.modCdrPlus(growthPlus);

  // calculate the rate growth.
  const growthRate = this.naturalParamBuff(growthRateStructure, baseCdr);

  // add the rate growth to this battler.
  this.modCdrRate(growthRate);
};

/**
 * Gets the various regular expressions used for getting CDM/CDR growth values.
 * @returns {[RegExp,RegExp,RegExp,RegExp]}
 */
Game_Actor.prototype.getNaturalGrowthsRegexForCrit = function()
{
  return [
    J.CRIT.RegExp.CritDamageReductionGrowthPlus,
    J.CRIT.RegExp.CritDamageReductionGrowthRate,
    J.CRIT.RegExp.CritDamageMultiplierGrowthPlus,
    J.CRIT.RegExp.CritDamageMultiplierGrowthRate,
  ];
};

if (J.SDP)
{
  /**
   * Gets all SDP bonuses for the given crit parameter id.
   * @param {number} critParamId The id of the crit parameter.
   * @param {number} baseParam The base value of the crit parameter in question.
   * @returns {number}
   */
  Game_Actor.prototype.critSdpBonuses = function(critParamId, baseParam)
  {
    // grab all the rankings this actor has earned.
    const panelRankings = this.getAllSdpRankings();

    // short circuit if we have no rankings.
    if (!panelRankings.length) return 0;

    // crit params start at 28.
    const actualCritParamId = 28 + critParamId;

    // initialize the running value.
    let val = 0;

    // iterate over each of the earned rankings.
    panelRankings.forEach(panelRanking =>
    {
      // grab our panel by its key.
      const panel = $gameParty.getSdpByKey(panelRanking.key);

      // protect our players against changed keys mid-save file!
      if (!panel) return;

      // add the calculated bonus.
      val += panel.calculateBonusByRank(actualCritParamId, panelRanking.currentRank, baseParam, false);
    });

    // return the summed value.
    return val;
  };
}
//endregion Game_Actor

//region Game_Battler
/**
 * Extends `.initNaturalGrowthParameters()` to include the new critical damage parameters as growth-ready.
 */
J.CRIT.Aliased.Game_Battler.set("initNaturalGrowthParameters", Game_Battler.prototype.initNaturalGrowthParameters);
Game_Battler.prototype.initNaturalGrowthParameters = function()
{
  // short circuit if not using the natural growths plugin.
  if (!J.NATURAL) return;

  // perform original logic.
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

//region properties
/**
 * Gets the permanent flat bonus for CDM.
 * @returns {number}
 */
Game_Battler.prototype.cdmPlus = function()
{
  return this._j._natural._cdmPlus;
};

/**
 * Modifies the permanent flat bonus for CDM.
 * @param {number} amount The amount to modify the bonus by.
 */
Game_Battler.prototype.modCdmPlus = function(amount)
{
  this._j._natural._cdmPlus += amount;
};

/**
 * Gets the permanent multiplicative bonus for CDM.
 * @returns {number}
 */
Game_Battler.prototype.cdmRate = function()
{
  return this._j._natural._cdmRate;
};

/**
 * Modifies the permanent multiplicative bonus for CDM.
 * @param {number} amount The amount to modify the bonus by.
 */
Game_Battler.prototype.modCdmRate = function(amount)
{
  this._j._natural._cdmRate += amount;
};

/**
 * Gets the current growths applied to CDR plus.
 * @returns {number}
 */
Game_Battler.prototype.cdrPlus = function()
{
  return this._j._natural._cdrPlus;
};

/**
 * Modifies the permanent flat bonus for CDR.
 * @param {number} amount The amount to modify the bonus by.
 */
Game_Battler.prototype.modCdrPlus = function(amount)
{
  this._j._natural._cdrPlus += amount;
};

/**
 * Gets the current growths applied to CDR rate.
 * @returns {number}
 */
Game_Battler.prototype.cdrRate = function()
{
  return this._j._natural._cdrRate;
};

/**
 * Modifies the permanent multiplicative bonus for CDR.
 * @param {number} amount The amount to modify the bonus by.
 */
Game_Battler.prototype.modCdrRate = function(amount)
{
  this._j._natural._cdrRate += amount;
};
//endregion properties

/**
 * Gets the base multiplier for this battler's critical hits.
 * @returns {number}
 */
Game_Battler.prototype.baseCriticalMultiplier = function()
{
  // grab everything with notes.
  const objectsToCheck = this.getAllNotes();

  // sum together all the base CDM tags.
  const baseCriticalMultiplier = RPGManager.getSumFromAllNotesByRegex(
    objectsToCheck,
    J.CRIT.RegExp.CritDamageMultiplierBase);

  // calculate the factor for the CDM.
  const baseCdmFactor = baseCriticalMultiplier / 100;

  // return the factor.
  return baseCdmFactor;
};

/**
 * Calculates this battler's current critical damage multiplier.
 * @returns {number}
 */
Game_Battler.prototype.criticalDamageMultiplier = function()
{
  // sum together all cdm values across the notes.
  const cdmBonuses = this.getCriticalDamageMultiplier();

  // grab all natural bonuses for cdm.
  const cdmNaturalBonuses = this.cdmNaturalBonuses();

  // grab all sdp bonuses for cdm.
  const cdmSdpBonuses = this.critSdpBonuses(0, this.baseCriticalMultiplier());

  // calculate the factor for the CDM.
  const cdmFactor = (cdmBonuses + cdmNaturalBonuses + cdmSdpBonuses) / 100;

  // return the factor.
  return cdmFactor;
};

/**
 * Gets the sum of all critical damage multipliers from all notes.
 * @returns {number}
 */
Game_Battler.prototype.getCriticalDamageMultiplier = function()
{
  // grab everything with notes.
  const objectsToCheck = this.getAllNotes();

  // sum together all cdm values across the notes.
  const cdmBonuses = RPGManager.getSumFromAllNotesByRegex(
    objectsToCheck,
    J.CRIT.RegExp.CritDamageMultiplier);

  // return the sum of all bonuses.
  return cdmBonuses;
};

/**
 * Gets all natural bonuses for cdm, excluding the base cdm itself.
 * @returns {number}
 */
Game_Battler.prototype.cdmNaturalBonuses = function()
{
  // short circuit if we aren't using the natural growths plugin.
  if (!J.NATURAL) return 0;

  // calculate the natural buffs for this parameter.
  const cdmBuffs = this.cdmNaturalBuffs();

  // calculate the natural growths for this parameter.
  const cdmGrowths = this.cdmNaturalGrowths();

  // sum together the two natural bonuses.
  return (cdmBuffs + cdmGrowths);
};

/**
 * Calculates the buffs for critical damage multipliers.
 * @returns {number}
 */
Game_Battler.prototype.cdmNaturalBuffs = function()
{
  // grab everything with notes.
  const objectsToCheck = this.getAllNotes();

  // grab the base parameter value.
  const baseParam = this.baseCriticalMultiplier();

  // sum together all the cdm buff pluses across the notes.
  const cdmBuffPlus = RPGManager.getResultsFromAllNotesByRegex(
    objectsToCheck,
    J.CRIT.RegExp.CritDamageMultiplierBuffPlus,
    baseParam,
    this);

  // sum together all the cdm buff rates across the notes.
  const cdmBuffRate = RPGManager.getResultsFromAllNotesByRegex(
    objectsToCheck,
    J.CRIT.RegExp.CritDamageMultiplierBuffRate,
    baseParam,
    this);

  // don't calculate if we don't have anything.
  if (!cdmBuffPlus && !cdmBuffRate) return 0;

  // return result.
  return this.calculatePlusRate(baseParam, cdmBuffPlus, cdmBuffRate);
};

/**
 * Calculates the growths associated with critical damage multipliers.
 * @returns {number}
 */
Game_Battler.prototype.cdmNaturalGrowths = function()
{
  // grab the base param for calculations.
  const baseCdm = this.baseCriticalMultiplier();

  // get the current plus growth for cdm.
  const growthPlus = this.cdmPlus();

  // get the current rate growth for cdm.
  const growthRate = this.cdmRate();

  // don't calculate if we don't have anything.
  if (!growthPlus && !growthRate) return 0;

  // calculate the result.
  return this.calculatePlusRate(baseCdm, growthPlus, growthRate);
};

/**
 * Gets all SDP bonuses for cdm.
 * @returns {number}
 */
Game_Battler.prototype.critSdpBonuses = function()
{
  return 0;
};

/**
 * Gets the base reduction for this battler's critical hits.
 * @returns {number}
 */
Game_Battler.prototype.baseCriticalReduction = function()
{
  // grab everything with notes.
  const objectsToCheck = this.getAllNotes();

  // sum together all the base CDR tags.
  const baseCriticalReduction = RPGManager.getSumFromAllNotesByRegex(
    objectsToCheck,
    J.CRIT.RegExp.CritDamageReductionBase);

  // calculate the factor for the CDR.
  const baseCdmFactor = baseCriticalReduction / 100;

  // return the factor.
  return baseCdmFactor;
};

/**
 * Gets the reduction factor for when this battler receives a critical hit.
 * @returns {number} The CDR factor for this battler.
 */
Game_Battler.prototype.criticalDamageReduction = function()
{
  // sum together all cdr values across the notes.
  const cdrBonuses = this.getCriticalDamageReduction();

  // grab all natural bonuses for cdr.
  const cdrNaturalBonuses = this.cdrNaturalBonuses();

  // grab all sdp bonuses for cdm.
  const cdrSdpBonuses = this.critSdpBonuses(1, this.baseCriticalReduction());

  // calculate the factor for the CDR.
  const cdrFactor = (cdrBonuses + cdrNaturalBonuses + cdrSdpBonuses) / 100;

  // return the factor.
  return cdrFactor;
};

/**
 * Gets the sum of all critical damage reductions from all notes.
 * @returns {number}
 */
Game_Battler.prototype.getCriticalDamageReduction = function()
{
  // grab everything with notes.
  const objectsToCheck = this.getAllNotes();

  // sum together all cdm values across the notes.
  const cdrBonuses = RPGManager.getSumFromAllNotesByRegex(
    objectsToCheck,
    J.CRIT.RegExp.CritDamageReduction);

  // return the sum of all bonuses.
  return cdrBonuses;
};

/**
 * Gets all natural bonuses for cdr, excluding the base cdr itself.
 * @returns {number}
 */
Game_Battler.prototype.cdrNaturalBonuses = function()
{
  // short circuit if we aren't using the natural growths plugin.
  if (!J.NATURAL) return 0;

  // calculate the natural buffs for this parameter.
  const cdmBuffs = this.cdrNaturalBuffs();

  // calculate the natural growths for this parameter.
  const cdmGrowths = this.cdrNaturalGrowths();

  // sum together the two natural bonuses.
  return (cdmBuffs + cdmGrowths);
};

/**
 * Calculates the buffs for critical damage reductions.
 * @returns {number}
 */
Game_Battler.prototype.cdrNaturalBuffs = function()
{
  // grab everything with notes.
  const objectsToCheck = this.getAllNotes();

  // grab the base parameter value.
  const baseParam = this.baseCriticalReduction();

  // sum together all the cdm buff pluses across the notes.
  const cdrBuffPlus = RPGManager.getResultsFromAllNotesByRegex(
    objectsToCheck,
    J.CRIT.RegExp.CritDamageReductionBuffPlus,
    baseParam,
    this);

  // sum together all the cdm buff rates across the notes.
  const cdrBuffRate = RPGManager.getResultsFromAllNotesByRegex(
    objectsToCheck,
    J.CRIT.RegExp.CritDamageReductionBuffRate,
    baseParam,
    this);

  // don't calculate if we don't have anything.
  if (!cdrBuffPlus && !cdrBuffRate) return 0;

  // grab the base param for calculations.
  const baseCdr = this.baseCriticalReduction();

  // return result.
  return this.calculatePlusRate(baseCdr, cdrBuffPlus, cdrBuffRate);
};

/**
 * Calculates the growths associated with critical damage reductions.
 * @returns {number}
 */
Game_Battler.prototype.cdrNaturalGrowths = function()
{
  // grab the base param for calculations.
  const baseCdr = this.baseCriticalReduction();

  // get the current plus growth for cdr.
  const growthPlus = this.cdrPlus();

  // get the current rate growth for cdr.
  const growthRate = this.cdrRate();

  // don't calculate if we don't have anything.
  if (!growthPlus && !growthRate) return 0;

  // calculate the result.
  return this.calculatePlusRate(baseCdr, growthPlus, growthRate);
};
//endregion Game_Battler

//region Game_BattlerBase
// add our new critical-related parameters to all battlers.
Object.defineProperties(
  Game_BattlerBase.prototype,
  {
    /**
     * The battler's critical damage multiplier.
     * Critical hits are multiplied by this amount to determine the total critical hit damage.
     * @type {number}
     */
    cdm:
      {
        get: function()
        {
          return this.criticalDamageMultiplier();
        },
        configurable: true
      },

    /**
     * The battler's critical damage reduction.
     * Critical hit damage is reduced by this percent before being applied.
     * @type {number}
     */
    cdr:
      {
        get: function()
        {
          return this.criticalDamageReduction();
        },
        configurable: true
      },
  });

/**
 * The base critical damage multiplier.
 * A battler's critical damage multiplier acts as the base bonus multiplier for all
 * critical hits. The individual battler's `cdm` is added to this amount to calculate
 * the damage a critical hit can potentially deal.
 * @returns {number} The base multiplier for this battler.
 */
Game_BattlerBase.prototype.baseCriticalMultiplier = function()
{
  return 0.5;
};

/**
 * Gets the multiplier for this battler's critical hits.
 * @returns {number}
 */
Game_BattlerBase.prototype.criticalDamageMultiplier = function()
{
  return 0.0;
};

/**
 * The base critical damage reduction.
 * A battler's critical damage reduction acts as the base crit reduction for all incoming
 * critical hits. The individual battler's `cdr` is added to this amount to calculate
 * the damage a critical hit can potentially deal.
 * @returns {number} The base reduction for this battler.
 */
Game_BattlerBase.prototype.baseCriticalReduction = function()
{
  return 0.5;
};

/**
 * Gets the reduction factor for when this battler receives a critical hit.
 * @returns {number}
 */
Game_BattlerBase.prototype.criticalDamageReduction = function()
{
  return 0.0;
};
//endregion Game_BattlerBase