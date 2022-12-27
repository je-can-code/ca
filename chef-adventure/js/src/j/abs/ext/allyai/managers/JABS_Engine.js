//region JABS_Engine
/**
 * Extends {@link JABS_Engine.prePartyCycling}.
 * Jumps all followers to the player upon party cycling.
 */
J.ABS.EXT.ALLYAI.Aliased.Game_BattleMap.set('prePartyCycling', JABS_Engine.prototype.prePartyCycling);
JABS_Engine.prototype.prePartyCycling = function()
{
  // perform original logic.
  J.ABS.EXT.ALLYAI.Aliased.Game_BattleMap.get('prePartyCycling').call(this);

  // when cycling, jump all followers to the player.
  $gamePlayer.jumpFollowersToMe();
};


/**
 * Overwrites {@link JABS_Engine.handlePartyCycleMemberChanges}.
 * Jumps all followers to the player upon party cycling.
 */
J.ABS.EXT.ALLYAI.Aliased.Game_BattleMap.set('handlePartyCycleMemberChanges', JABS_Engine.prototype.handlePartyCycleMemberChanges);
JABS_Engine.prototype.handlePartyCycleMemberChanges = function()
{
  // grab the current data for removing after to prevent duplicate players.
  const formerLeader = $gameParty.leaderJabsBattler();

  // check to make sure we have a leader.
  if (formerLeader)
  {
    // remove the former leader to make room for them as a follower!
    JABS_AiManager.removeBattler(formerLeader);
  }

  // perform original logic, updating the player to the latest.
  J.ABS.EXT.ALLYAI.Aliased.Game_BattleMap.get('handlePartyCycleMemberChanges').call(this);

  // rebuild all allies.
  $gameMap.updateAllies();
};
//endregion JABS_Engine