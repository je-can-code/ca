//region Game_BattlerBase
/**
 * Returns a list of known base parameter ids.
 * @returns {number[]}
 */
Game_BattlerBase.knownBaseParameterIds = function()
{
  return [0, 1, 2, 3, 4, 5, 6, 7];
};

/**
 * Returns a list of known sp-parameter ids.
 * @returns {number[]}
 */
Game_BattlerBase.knownSpParameterIds = function()
{
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
};

/**
 * Returns a list of known ex-parameter ids.
 * @returns {number[]}
 */
Game_BattlerBase.knownExParameterIds = function()
{
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
};

/**
 * Gets the maximum tp/tech for this battler.
 */
Object.defineProperty(Game_BattlerBase.prototype, "mtp",
  {
    get: function() 
    {
      return this.maxTp();
    },
    configurable: true
  });
//endregion Game_BattlerBase