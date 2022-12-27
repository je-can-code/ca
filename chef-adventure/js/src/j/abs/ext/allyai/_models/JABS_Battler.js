//region JABS_Battler
/**
 * Extends the engagement determination to handle aggro/passive party toggling.
 * @param {JABS_Battler} target The target to see if we should engage with.
 * @returns {boolean}
 */
J.ABS.EXT.ALLYAI.Aliased.JABS_Battler.set('shouldEngage', JABS_Battler.prototype.shouldEngage);
JABS_Battler.prototype.shouldEngage = function(target, distance)
{
  // enemies follow standard behavior.
  if (this.isEnemy())
  {
    // perform original logic.
    return J.ABS.EXT.ALLYAI.Aliased.JABS_Battler.get('shouldEngage').call(this, target, distance);
  }

  // aggro allies against non-inanimate targets also follow standard behavior.
  if ($gameParty.isAggro() && !target.isInanimate())
  {
    // perform original logic.
    return J.ABS.EXT.ALLYAI.Aliased.JABS_Battler.get('shouldEngage').call(this, target, distance);
  }

  // determine if the ally should engage the foe.
  return this.shouldAllyEngage(target, distance);
};

/**
 * Determines whether or not the ally should engage in combat with the target.
 * @param {JABS_Battler} target The target to potentially engage with.
 * @param {number} distance The distance from this battler to the nearest potential target.
 * @returns {boolean} True if this ally should engage in combat, false otherwise.
 */
JABS_Battler.prototype.shouldAllyEngage = function(target, distance)
{
  // allies cannot engage against inanimate targets.
  if (target.isInanimate()) return false;

  // check if the target is visible to this ally.
  if (!this.inSightRange(target, distance)) return false;

  // check if this ally is alerted.
  const isAlerted = this.isAlerted();

  // check if the player has a "last hit" target.
  const playerHitSomething = $jabsEngine.getPlayer1().hasBattlerLastHit();

  // if we are alerted or the player is attacking something, lets fight.
  const shouldEngage = (isAlerted || playerHitSomething);

  // return the determination.
  return shouldEngage;
};
//endregion JABS_Battler