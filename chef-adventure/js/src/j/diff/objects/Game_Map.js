//region Game_Map
/**
 * Extends the `.encounterStep()` function to modify by difficulty.
 * @returns {number}
 */
J.DIFFICULTY.Aliased.Game_Map.set("encounterStep", Game_Map.prototype.encounterStep);
Game_Map.prototype.encounterStep = function()
{
  // grab the original value.
  const originalValue = J.DIFFICULTY.Aliased.Game_Map.get("encounterStep").call(this);

  // grab the currently applied difficulty.
  const appliedDifficulty = $gameTemp.getAppliedDifficulty();

  // determine the multiplier for the bonus according to the difficulty.
  const multiplier = appliedDifficulty.encounters / 100;

  // return the rounded product of the multiplier and the original value.
  return Math.round(originalValue * multiplier);
};
//endregion Game_Map