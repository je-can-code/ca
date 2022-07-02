//#region Game_Map
/**
 * Extends the `.encounterStep()` function to modify by difficulty.
 * @returns {number}
 */
J.DIFF.Aliased.Game_Map.set("encounterStep", Game_Map.prototype.encounterStep);
Game_Map.prototype.encounterStep = function()
{
  // grab the original value.
  const originalValue = J.DIFF.Aliased.Game_Map.get("encounterStep").call(this);

  // grab the currently applied difficulty.
  const appliedDifficulty = $gameSystem.getAppliedDifficulty();

  // determine the multiplier for the bonus according to the difficulty.
  const multiplier = appliedDifficulty.encounters / 100;

  // return the rounded product of the multiplier and the original value.
  return Math.round(originalValue * multiplier);
};
//#endregion Game_Map