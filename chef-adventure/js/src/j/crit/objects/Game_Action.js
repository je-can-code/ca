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