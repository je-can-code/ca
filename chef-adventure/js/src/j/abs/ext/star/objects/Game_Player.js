/**
 * Extends {@link Game_Player.clearTransferInfo}.
 * Parse out enemy data from the troop and convert them into JABS battlers.
 */
J.ABS.EXT.STAR.Aliased.Game_Player.set('clearTransferInfo', Game_Player.prototype.clearTransferInfo);
Game_Player.prototype.clearTransferInfo = function() 
{
  // perform original logic.
  J.ABS.EXT.STAR.Aliased.Game_Player.get('clearTransferInfo').call(this);

  // also parse the event data to produce JABS Battlers.
  $gameMap.postTransferEnemyParsing();
};

/**
 * Extends {@link Game_Player.executeEncounter}.
 * Includes preparation for the stars of battle.
 */
J.ABS.EXT.STAR.Aliased.Game_Player.set('executeEncounter', Game_Player.prototype.executeEncounter);
Game_Player.prototype.executeEncounter = function() 
{
  // intercept original logic.
  const base = J.ABS.EXT.STAR.Aliased.Game_Player.get('executeEncounter').call(this);

  // check if we have an encounter.
  if (base) 
  {
    // prepare the stars of battle!
    BattleManager.setStarPhase(StarPhases.PREPARING);
  }

  // return to continue with flow.
  return base;
};

Game_Player.prototype.reserveOriginTransfer = function()
{
  const { mapId, x, y } = BattleManager.origin();
  this.reserveTransfer(mapId, x, y);
};