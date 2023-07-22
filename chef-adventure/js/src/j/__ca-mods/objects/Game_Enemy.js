//region Game_Enemy
/**
 * Extends the drop sources to include passive skill states.
 * This isn't a flavor everyone might like, so this is personal functionality instead.
 * @returns {RPG_BaseItem[]}
 */
J.CAMods.Aliased.Game_Enemy.set("dropSources", Game_Enemy.prototype.dropSources);
Game_Enemy.prototype.dropSources = function()
{
  // perform original logic to determine base drop sources.
  const sources = J.CAMods.Aliased.Game_Enemy.get("dropSources").call(this);

  // also add all the passive states applied to oneself.
  sources.push(...this.allStates());

  // also add all the passive states associated with the party.
  sources.push(...$gameParty.extraDropSources());

  // return the updated collection.
  return sources;
};
//endregion Game_Enemy