//region Game_Actor
/**
 * Extends {@link #param}.
 * Also modifies the value based on the applied difficulty.
 * @returns {number}
 */
J.DIFFICULTY.Aliased.Game_Actor.set("param", Game_Actor.prototype.param);
Game_Actor.prototype.param = function(paramId)
{
  // grab the original value.
  const originalValue = J.DIFFICULTY.Aliased.Game_Actor.get("param").call(this, paramId);

  // grab the currently applied difficulty.
  const appliedDifficulty = $gameTemp.getAppliedDifficulty();

  // determine the multiplier for the parameter according to the difficulty.
  const multiplier = appliedDifficulty.actorEffects.bparams[paramId] / 100;

  // return the rounded product of the multiplier and the original value.
  return Math.round(originalValue * multiplier);
};

/**
 * Extends {@link #sparam}.
 * Also modifies the value based on the applied difficulty.
 * @returns {number}
 */
J.DIFFICULTY.Aliased.Game_Actor.set("sparam", Game_Actor.prototype.sparam);
Game_Actor.prototype.sparam = function(sparamId)
{
  // grab the original value.
  const originalValue = J.DIFFICULTY.Aliased.Game_Actor.get("sparam").call(this, sparamId);

  // grab the currently applied difficulty.
  const appliedDifficulty = $gameTemp.getAppliedDifficulty();

  // determine the multiplier for the parameter according to the difficulty.
  const multiplier = appliedDifficulty.actorEffects.sparams[sparamId] / 100;

  // return the rounded product of the multiplier and the original value.
  return (originalValue * multiplier);
};

/**
 * Extends {@link #xparam}.
 * Also modifies the value based on the applied difficulty.
 * @returns {number}
 */
J.DIFFICULTY.Aliased.Game_Actor.set("xparam", Game_Actor.prototype.xparam);
Game_Actor.prototype.xparam = function(xparamId)
{
  // grab the original value.
  const originalValue = J.DIFFICULTY.Aliased.Game_Actor.get("xparam").call(this, xparamId);

  // grab the currently applied difficulty.
  const appliedDifficulty = $gameTemp.getAppliedDifficulty();

  // determine the multiplier for the parameter according to the difficulty.
  const multiplier = appliedDifficulty.actorEffects.xparams[xparamId] / 100;

  // return the rounded product of the multiplier and the original value.
  return (originalValue * multiplier);
};
//endregion Game_Actor