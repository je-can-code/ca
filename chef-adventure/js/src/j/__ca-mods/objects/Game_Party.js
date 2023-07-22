//region Game_Party
/**
 * Gets any additional sources to scan for drops when determining a drop item list on
 * an enemy. In this case, we are including passive skill states to potentially add
 * new items to every enemy.
 * @returns {RPG_BaseItem[]}
 */
Game_Party.prototype.extraDropSources = function()
{
  const extraSources = [];

  // grab all passive skill states from all the members in the party.
  $gameParty.battleMembers()
    .forEach(member => extraSources.push(...member.allStates()));

  return extraSources;
};
//endregion Game_Party