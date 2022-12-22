//region Game_Troop
/**
 * Upon defeating a troop of enemies, scales the earned experience based on
 * average actor level vs each of the enemies.
 */
J.LEVEL.Aliased.Game_Troop.set('expTotal', Game_Troop.prototype.expTotal);
Game_Troop.prototype.expTotal = function()
{
  // check if the level scaling functionality is enabled.
  if (J.LEVEL.Metadata.Enabled)
  {
    // return the scaled result instead.
    return this.getScaledExpResult();
  }
  // the scaling is not enabled.
  else
  {
    // return the default logic instead.
    return J.LEVEL.Aliased.Game_Troop.get('expTotal').call(this);
  }
};

/**
 * Determines the amount of experience gained based on the average battle party compared to
 * each defeated enemy.
 *
 * This method is used in place of the current `.reduce()` to find total experience.
 * @returns {number} The scaled amount of EXP this enemy troop yielded.
 */
Game_Troop.prototype.getScaledExpResult = function()
{
  // grab all the dead enemies of this troop.
  const deadEnemies = this.deadMembers();

  // calculate the average actor level of the party.
  const averageActorLevel = $gameParty.averageActorLevel();

  // the reducer function for adding up experience.
  const reducer = (accumulativeExpTotal, currentEnemy) =>
  {
    // determine the experience factor for this defeated enemy level vs the average party level.
    // if the enemy is higher, then the rewards will be greater.
    // if the actor is higher, then the rewards will be lesser.
    const expFactor = LevelScaling.multiplier(averageActorLevel, currentEnemy.level);

    // multiply the factor against the experience amount to get the actual amount.
    const total = Math.round(expFactor * currentEnemy.exp());

    // add it to the running total.
    return (accumulativeExpTotal + total);
  };

  // return the rounded sum of scaled experience.
  return Math.round(deadEnemies.reduce(reducer, 0));
};
//endregion Game_Troop