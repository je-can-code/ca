//region Game_Party
Game_Party.prototype.extraOnHitSelfStateSources = function()
{
  const extraSources = [];

  // if we're using passive skill states...
  if (J.PASSIVE)
  {
    // get all the members of the battle party.
    const members = $gameParty.battleMembers();
    members.forEach(member =>
    {
      // and shove their current array of states into the sources to check.
      extraSources.push(...member.allStates());
    });
  }

  // return all found sources.
  return extraSources;
};

Game_Party.prototype.extraOnCastSelfStateSources = function()
{
  const extraSources = [];

  // if we're using passive skill states...
  if (J.PASSIVE)
  {
    // get all the members of the battle party.
    const members = $gameParty.battleMembers();
    members.forEach(member =>
    {
      // and shove their current array of states into the sources to check.
      extraSources.push(...member.allStates());
    });
  }

  // return all found sources.
  return extraSources;
};
//endregion Game_Party