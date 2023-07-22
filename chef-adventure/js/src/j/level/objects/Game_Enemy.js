//region Game_Enemy
/**
 * Gets all database sources we can get levels from.
 * @returns {RPG_BaseItem[]}
 */
Game_Enemy.prototype.getLevelSources = function()
{
  // our sources of data that a level can be retrieved from.
  return [
    this.enemy(),     // this enemy is a source.
    ...this.states(), // all states applied to this enemy are sources.
  ];
};

/**
 * The base or default level for this battler.
 * Enemies do not have a base level.
 * @returns {number}
 */
Game_Enemy.prototype.getBattlerBaseLevel = function()
{
  return 0;
};

/**
 * The variable level modifier for this enemy.
 * @returns {number}
 */
Game_Enemy.prototype.getLevelBalancer = function()
{
  // check if we have a variable set for the fixed balancing.
  if (J.LEVEL.Metadata.EnemyBalanceVariable)
  {
    // return the adjustment from the variable value instead.
    return $gameVariables.value(J.LEVEL.Metadata.EnemyBalanceVariable);
  }

  // we don't have any balancing required.
  return 0;
};
//endregion Game_Enemy