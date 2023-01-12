//region Game_Enemy
/**
 * Extends {@link #param}.
 * Also modifies the value based on the applied difficulty.
 * @returns {number}
 */
J.DIFFICULTY.Aliased.Game_Enemy.set("param", Game_Enemy.prototype.param);
Game_Enemy.prototype.param = function(paramId)
{
  // grab the original value.
  const originalValue = J.DIFFICULTY.Aliased.Game_Enemy.get("param").call(this, paramId);

  // grab the currently applied difficulty.
  const appliedDifficulty = $gameTemp.getAppliedDifficulty();

  // determine the multiplier for the parameter according to the difficulty.
  const multiplier = appliedDifficulty.enemyEffects.bparams[paramId] / 100;

  // return the rounded product of the multiplier and the original value.
  return Math.round(originalValue * multiplier);
};

/**
 * Extends {@link #sparam}.
 * Also modifies the value based on the applied difficulty.
 * @returns {number}
 */
J.DIFFICULTY.Aliased.Game_Enemy.set("sparam", Game_Enemy.prototype.sparam);
Game_Enemy.prototype.sparam = function(sparamId)
{
  // grab the original value.
  const originalValue = J.DIFFICULTY.Aliased.Game_Enemy.get("sparam").call(this, sparamId);

  // grab the currently applied difficulty.
  const appliedDifficulty = $gameTemp.getAppliedDifficulty();

  // determine the multiplier for the parameter according to the difficulty.
  const multiplier = appliedDifficulty.enemyEffects.sparams[sparamId] / 100;

  // return the rounded product of the multiplier and the original value.
  return (originalValue * multiplier);
};

/**
 * Extends {@link #xparam}.
 * Also modifies the value based on the applied difficulty.
 * @returns {number}
 */
J.DIFFICULTY.Aliased.Game_Enemy.set("xparam", Game_Enemy.prototype.xparam);
Game_Enemy.prototype.xparam = function(xparamId)
{
  // grab the original value.
  const originalValue = J.DIFFICULTY.Aliased.Game_Enemy.get("xparam").call(this, xparamId);

  // grab the currently applied difficulty.
  const appliedDifficulty = $gameTemp.getAppliedDifficulty();

  // determine the multiplier for the parameter according to the difficulty.
  const multiplier = appliedDifficulty.enemyEffects.xparams[xparamId] / 100;

  // return the rounded product of the multiplier and the original value.
  return (originalValue * multiplier);
};

/**
 * Extends the `.exp()` function to modify by difficulty.
 * @returns {number}
 */
J.DIFFICULTY.Aliased.Game_Enemy.set("exp", Game_Enemy.prototype.exp);
Game_Enemy.prototype.exp = function()
{
  // grab the original value.
  const originalValue = J.DIFFICULTY.Aliased.Game_Enemy.get("exp").call(this);

  // grab the currently applied difficulty.
  const appliedDifficulty = $gameTemp.getAppliedDifficulty();

  // determine the multiplier for the bonus according to the difficulty.
  const multiplier = appliedDifficulty.exp / 100;

  // return the rounded product of the multiplier and the original value.
  return Math.round(originalValue * multiplier);
};

/**
 * Extends the `.gold()` function to modify by difficulty.
 * @returns {number}
 */
J.DIFFICULTY.Aliased.Game_Enemy.set("gold", Game_Enemy.prototype.gold);
Game_Enemy.prototype.gold = function()
{
  // grab the original value.
  const originalValue = J.DIFFICULTY.Aliased.Game_Enemy.get("gold").call(this);

  // grab the currently applied difficulty.
  const appliedDifficulty = $gameTemp.getAppliedDifficulty();

  // determine the multiplier for the bonus according to the difficulty.
  const multiplier = appliedDifficulty.gold / 100;

  // return the rounded product of the multiplier and the original value.
  return Math.round(originalValue * multiplier);
};

// in order to to properly multiply drop rates, we need to use my drops plugin;
// `J-DropsControl` gives easy access to modify the drop rates, so we'll extend that!
if (J.DROPS)
{
  /**
   * Extends the `.getBaseDropRate()` function to modify by difficulty.
   * @returns {number}
   */
  J.DIFFICULTY.Aliased.Game_Enemy.set("getBaseDropRate", Game_Enemy.prototype.getBaseDropRate);
  Game_Enemy.prototype.getBaseDropRate = function()
  {
    // grab the original value.
    const originalValue = J.DIFFICULTY.Aliased.Game_Enemy.get("getBaseDropRate").call(this);

    // grab the currently applied difficulty.
    const appliedDifficulty = $gameTemp.getAppliedDifficulty();

    // determine the multiplier for the bonus according to the difficulty.
    const multiplier = appliedDifficulty.drops / 100;

    // return the rounded product of the multiplier and the original value.
    return Math.round(originalValue * multiplier);
  };
}

// to modify the SDP system, we actually need to have the SDP system implemented.
if (J.SDP)
{
  /**
   * Extends the `.sdpPoints()` function to modify by difficulty.
   * @returns {number}
   */
  J.DIFFICULTY.Aliased.Game_Enemy.set("sdpPoints", Game_Enemy.prototype.sdpPoints);
  Game_Enemy.prototype.sdpPoints = function()
  {
    // grab the original value.
    const originalValue = J.DIFFICULTY.Aliased.Game_Enemy.get("sdpPoints").call(this);

    // grab the currently applied difficulty.
    const appliedDifficulty = $gameTemp.getAppliedDifficulty();

    // determine the multiplier for the bonus according to the difficulty.
    const multiplier = appliedDifficulty.sdp / 100;

    // return the rounded product of the multiplier and the original value.
    return Math.round(originalValue * multiplier);
  };
}
//endregion Game_Enemy