//region Game_Map
/**
 * Extends {@link Game_Map.parseBattlers}.
 * Also parses ally battlers as well as events.
 * @returns {JABS_Battler[]}
 */
J.ABS.EXT.ALLYAI.Aliased.Game_Map.set('parseBattlers', Game_Map.prototype.parseBattlers);
Game_Map.prototype.parseBattlers = function()
{
  // perform original logic.
  const originalParsedBattlers = J.ABS.EXT.ALLYAI.Aliased.Game_Map.get('parseBattlers').call(this);

  // also parse ally battlers.
  const parsedAllyBattlers = this.parseAllyBattlers();

  // combine all battlers.
  const parsedBattlers = originalParsedBattlers.concat(parsedAllyBattlers);

  // return the combined conversion.
  return parsedBattlers;
};

/**
 * Parses all followers that are active into their battler form.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.parseAllyBattlers = function()
{
  return JABS_AiManager
    .convertFollowersToBattlers($gamePlayer.followers().data());
};

/**
 * Gets all ally battlers out of the collection of battlers.
 * This does not include the player.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getFollowerBattlers = function()
{
  return JABS_AiManager.getAllBattlers()
    .filter(battler => battler.isFollower());
};

/**
 * Updates all ally battlers in-place.
 * For use with party-cycling.
 */
Game_Map.prototype.updateAllies = function()
{
  // get all the ally battlers from the current collection.
  const allyJabsBattlers = this.getFollowerBattlers();

  // first remove all battlers.
  this.removeBattlers(allyJabsBattlers);

  // then re-add the updated ones.
  const allies = this.parseAllyBattlers();

  // check to make sure we have allies.
  if (allies.length)
  {
    // add any parsed allies.
    JABS_AiManager.addOrUpdateBattlers(allies);
  }
};

/**
 * Removes all provided battlers from the battler tracking.
 * @param {JABS_Battler[]} battlers The battlers to be removed.
 */
Game_Map.prototype.removeBattlers = function(battlers)
{
  // disengage all battlers.
  battlers.forEach(battler => battler.disengageTarget());

  // remove them from tracking.
  JABS_AiManager.removeBattlers(battlers);
};
//endregion Game_Map