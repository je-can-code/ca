//#region JABS_Battler
/**
 * Extends the engagement determination to handle aggro/passive party toggling.
 * @param {JABS_Battler} target The target to see if we should engage with.
 * @returns {boolean}
 */
J.ALLYAI.Aliased.JABS_Battler.shouldEngage = JABS_Battler.prototype.shouldEngage;
JABS_Battler.prototype.shouldEngage = function(target, distance)
{
  if (this.isEnemy() || ($gameParty.isAggro() && !target.isInanimate()))
  {
    // if this is an enemy, or the party is aggro and this isn't the player, do nothing different.
    return J.ALLYAI.Aliased.JABS_Battler.shouldEngage.call(this, target, distance);
  }
  else
  {
    // if this is an ally, use the ally engagement determination to see if this ally should engage.
    return this.shouldAllyEngage(target, distance);
  }
};

/**
 * A custom determination for seeing if an ally should engage it's nearest target or not.
 *
 * Allies do not aggro against inanimate objects while passive!
 * @param {JABS_Battler} target The target to potentially engage with.
 * @param {number} distance The distance from this battler to the nearest potential target.
 * @returns {boolean}
 */
JABS_Battler.prototype.shouldAllyEngage = function(target, distance)
{
  const isAlerted = this.isAlerted();
  const playerHitSomething = $jabsEngine.getPlayer1()
    .hasBattlerLastHit();
  const inSight = this.inSightRange(target, distance);
  const targetInanimate = target.isInanimate();
  const shouldEngage = (isAlerted || playerHitSomething) && !targetInanimate;
  return inSight && shouldEngage;
};
//#endregion JABS_Battler