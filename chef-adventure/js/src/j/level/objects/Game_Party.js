//region Game_Party
/**
 * Checks the current battle party and averages all levels.
 * @returns {number} The average battle party level (rounded).
 */
Game_Party.prototype.averageActorLevel = function()
{
  // grab all allies.
  const allies = this.battleMembers();

  // if we have no party, then the average is 0.
  if (!allies.length) return 0;

  // the reducer function for summing the party's levels.
  const reducer = (runningTotal, currentActor) => runningTotal + currentActor.level;

  // the sum of the levels of the party.
  const levelTotal = allies.reduce(reducer, 0);

  // the average level of the party.
  return Math.round(levelTotal / allies.length);
}
//endregion Game_Party