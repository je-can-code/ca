//region Game_Actor
/**
 * The base or default level for this battler.
 * Actors have a level tracker, so we'll use that for the base.
 * @returns {number}
 */
Game_Actor.prototype.getBattlerBaseLevel = function()
{
  return this._level;
};

/**
 * Gets all database sources we can get levels from.
 * @returns {RPG_BaseItem[]}
 */
Game_Actor.prototype.getLevelSources = function()
{
  // our sources of data that a level can be retrieved from.
  return this.getAllNotes();
};

/**
 * The variable level modifier for this actor.
 * @returns {number}
 */
Game_Actor.prototype.getLevelBalancer = function()
{
  // check if we have a variable set for the fixed balancing.
  if (J.LEVEL.Metadata.ActorBalanceVariable)
  {
    // return the adjustment from the variable value instead.
    return $gameVariables.value(J.LEVEL.Metadata.ActorBalanceVariable);
  }

  // we don't have any balancing required.
  return 0;
};
//endregion Game_Actor