/**
 * Now you can retrieve the player's battler from the player.
 * This is synonymous with {@link Game_Party.leader}.
 * @returns {Game_Actor|null}
 */
Game_Player.prototype.battler = function()
{
  // the leader is synonymous for the player.
  const battler = $gameParty.leader();

  // check if we have a leader battler.
  if (!battler)
  {
    console.warn("There is currently no leader.");
    return null;
  }

  // return the found battler.
  return battler;
};