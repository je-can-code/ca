//#region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0 CRIT] Manages critical damage multiplier/reduction of battlers.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @help
 * ============================================================================
 * This plugin enables the ability to control the multiplier of critical damage
 * based on a pair of tags.
 *
 * DETAILS:
 * This overwrites the "applyCritical()" function in its entirety and replaces
 * the functionality with two new parameters on battlers: cdm and cdr, which
 * are described below. One significant difference to note is that critical hit
 * damage is calculated and managed separately, allowing for a battler's CDR
 * parameter to mitigate the critical portion entirely while still taking the
 * base damage. Additionally, the base critical damage multiplier is reduced by
 * default, and is parameterized for your convenience- because lets face it:
 * triple damage for a crit is an awful lot for the default.
 * ============================================================================
 * CRITICAL DAMAGE MULTIPLIER:
 * Have you ever wanted to have any amount of control over critical damage?
 * Well now you can! By applying the appropriate tag to various database
 * locations, you can now control how hard (or weak) a battler's crit will be!
 *
 * NOTE:
 * If multiple tags are present on a single battler, then all tag amounts will
 * be added together for a single multiplier amount as seen in the examples.
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
 *  <cdm:NUM>
 *
 * TAG EXAMPLE(S):
 *  <cdm:50>
 * Increases the critical hit damage multiplier by 50% for this battler.
 *
 *  <cdm:10>
 *  <cdm:40>
 *  <cdm:150>
 * Increases the critical hit damage multiplier by 200% for this battler.
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
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - States
 *
 * TAG FORMAT:
 *  <cdr:NUM>
 * Where NUM is the amount of critical hit reduction added.
 *
 * TAG EXAMPLE(S):
 *  <cdr:30>
 * Reduces critical hit damage against this battler by 30%.
 *
 *  <cdr:10>
 *  <cdr:30>
 *  <cdr:80>
 * The three amounts above total to above 100. This means that this battler
 * will NOT take any bonus damage from critical hits. All critical hits will
 * be the same as non-critical hits. However, for the sake of other possible
 * effects, the attack will still be classified as a "critical hit".
 * ============================================================================
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

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

J.CRIT.Aliased =
  {
    Game_Action: new Map(),
    Game_Actor: new Map(),
    Game_Battler: new Map(),
    Game_BattlerBase: new Map(),
    Game_Enemy: new Map(),
  };
//#endregion Introduction

//#region Game objects
//#region Game_Action
/**
 * Extends the `initialize()` function to include initializing our new target tracker.
 * Note that the target tracker will remain null on this action until after our custom logic
 * within `apply()` has been executed (before aliased function logic).
 */
J.CRIT.Aliased.Game_Action.set('initialize', Game_Action.prototype.initialize);
Game_Action.prototype.initialize = function(subject, forcing)
{
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
//#endregion Game_Action

//#region Game_BattlerBase
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
  return 0.5; // TODO: parameterize this.
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
 * Gets the reduction factor for when this battler receives a critical hit.
 * @returns {number}
 */
Game_BattlerBase.prototype.criticalDamageReduction = function()
{
  return 0.0;
};
//#endregion Game_BattlerBase

//#region Game_Battler
/**
 * Gets the multiplier for this battler's critical hits.
 * @returns {number}
 */
Game_Battler.prototype.criticalDamageMultiplier = function()
{
  let criticalDamageMultiplier = 0;
  const objectsToCheck = this.getEverythingWithNotes();
  objectsToCheck.forEach(obj => (criticalDamageMultiplier += this.extractCritDamageMultipliers(obj)));

  return (criticalDamageMultiplier / 100);
};

/**
 * Extracts the critical damage multiplier out of the notes of the given database object.
 * The object given can be any database object with a note.
 * @param {rm.types.BaseItem} referenceData The database object.
 * @returns {number} The 100x form of the critical damage multiplier from this database object.
 */
Game_Battler.prototype.extractCritDamageMultipliers = function(referenceData)
{
  let criticalDamageMultiplier = 0;
  const structure = /<cdm:[ ]?(\d+)>/i;
  const lines = referenceData.note.split(/[\r\n]+/);
  lines.forEach(line =>
  {
    if (line.match(structure))
    {
      criticalDamageMultiplier += parseInt(RegExp.$1);
    }
  });

  return criticalDamageMultiplier;
};

/**
 * Gets the reduction factor for when this battler receives a critical hit.
 * @returns {number}
 */
Game_Battler.prototype.criticalDamageReduction = function()
{
  let criticalDamageReduction = 0;
  const objectsToCheck = this.getEverythingWithNotes();
  objectsToCheck.forEach(obj => (criticalDamageReduction += this.extractCritDamageReductions(obj)));

  return (criticalDamageReduction / 100);
};

/**
 * Extracts the critical damage reduction out of the notes of the given database object.
 * The object given can be any database object with a note.
 * @param {rm.types.BaseItem} referenceData The database object.
 * @returns {number} The 100x form of the critical damage reduction from this database object.
 */
Game_Battler.prototype.extractCritDamageReductions = function(referenceData)
{
  let criticalDamageReduction = 0;
  const structure = /<cdr:[ ]?(\d+)>/i;
  const lines = referenceData.note.split(/[\r\n]+/);
  lines.forEach(line =>
  {
    if (line.match(structure))
    {
      criticalDamageReduction += parseInt(RegExp.$1);
    }
  });

  return criticalDamageReduction;
};
//#endregion Game_Battler

//#endregion Game objects

//ENDOFFILE