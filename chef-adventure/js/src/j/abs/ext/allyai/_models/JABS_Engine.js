//#region JABS_Engine
/**
 * OVERWRITE Updates the party cycle functionality to cycle to the next follower instead
 * of generating a new player for every party cycle.
 */
J.ALLYAI.Aliased.Game_BattleMap.performPartyCycling = JABS_Engine.prototype.performPartyCycling;
JABS_Engine.prototype.performPartyCycling = function()
{
  // if followers aren't enabled, then do it like normal.
  if (!$gamePlayer.followers().isVisible())
  {
    J.ALLYAI.Aliased.Game_BattleMap.performPartyCycling.call(this);
    return;
  }

  // determine which battler in the party is the next living battler.
  const nextLivingAllyIndex = $gameParty._actors.findIndex(this.canCycleToAlly);

  // can't cycle if there are no living/valid members.
  if (nextLivingAllyIndex === -1) return;

  // when cycling, jump all followers to the player.
  $gamePlayer.jumpFollowersToMe();

  // grab the current data for removing after to prevent duplicate players.
  const previousUuid = $gameParty.leader().getUuid();

  // take a snapshot of the next battler for the player to control.
  const nextUuid = $gameParty.members()[nextLivingAllyIndex].getUuid();
  const nextJabsBattler = $gameMap.getBattlerByUuid(nextUuid);
  if (!nextJabsBattler)
  {
    console.warn(`the next follower of uuid: [${nextUuid}], wasn't able to be retrieved.`);
    return;
  }

  // swap to the next party member in the sequence.
  $gameParty._actors = $gameParty._actors.concat($gameParty._actors.splice(0, nextLivingAllyIndex));
  $gamePlayer.refresh();
  $gamePlayer.requestAnimation(40, false);

  // recreate the JABS player battler and set it to the player character.
  nextJabsBattler.setCharacter($gamePlayer);
  this._player1 = nextJabsBattler;
  const newPlayer = this.getPlayer1().getCharacter();
  newPlayer.setMapBattler(this._player1.getUuid());
  newPlayer.setThrough(false);

  // assign
  const oldPlayerIndex = $gamePlayer
    .followers()
    ._data
    .findIndex(follower => follower.actor().getUuid() === previousUuid);
  $gamePlayer.followers()
    .follower(oldPlayerIndex)
    .setMapBattler(previousUuid);

  // request the scene overlord to take notice and react accordingly (refresh hud etc).
  this.requestPartyRotation = true;
  if (J.LOG)
  {
    const log = new MapLogBuilder()
      .setupPartyCycle(this.getPlayer1().battlerName())
      .build();
    $gameTextLog.addLog(log);
  }

  // refresh all battlers on the map.
  $gameMap.updateAllies();

  // remove all followers that existed as a player at some point.
  $gamePlayer.followers()._data.forEach(follower =>
  {
    // if the follower is invalid, it isn't the player.
    if (!follower || !follower.actor()) return;

    // find the index of the old player of all available battlers.
    const oldIndex = $gameMap._j._allBattlers.findIndex(battler =>
    {
      // skip enemies- we only care about actors.
      if (battler.isEnemy()) return false;

      // if the actor id matches the follower and the character is a player,
      // we have a match and need to nuke it.
      const sameActorId = (battler.getBattler().actorId() === follower.actor().actorId());
      const isPlayer = (battler._event instanceof Game_Player);

      // return true if this is indeed the same actor id and character.
      return sameActorId && isPlayer;
    });

    // if we have a match, nuke it.
    if (oldIndex > -1)
    {
      $gameMap._j._allBattlers.splice(oldIndex, 1);
    }
  });

  // request a map-wide sprite refresh on cycling.
  this.requestSpriteRefresh = true;
};
//#endregion JABS_Engine