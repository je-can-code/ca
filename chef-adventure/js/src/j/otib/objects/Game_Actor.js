//region Game_Actor
/**
 * Adds new properties to the actors that manage the SDP system.
 */
J.OTIB.Aliased.Game_Actor.set('initMembers', Game_Actor.prototype.initMembers);
Game_Actor.prototype.initMembers = function()
{
  // perform original logic.
  J.OTIB.Aliased.Game_Actor.get('initMembers').call(this);

  /**
   * The J object where all my additional properties live.
   */
  this._j ||= {};

  /**
   * A grouping of all boosts this actor has can potentially consume.
   * @type {OneTimeItemBoost[]}
   */
  this._j._otibs ||= J.OTIB.Metadata.OneTimeItemBoosts;
};

/**
 * Gets all of this actor's boosts.
 * @returns {OneTimeItemBoost[]}
 */
Game_Actor.prototype.getAllOtibs = function()
{
  return this._j._otibs;
};

/**
 * Gets the boost associated with the itemId.
 * @param {number} itemId The itemId to find the boost for.
 * @returns {OneTimeItemBoost}
 */
Game_Actor.prototype.getOtibById = function(itemId)
{
  return this.getAllOtibs().find(otib => otib.itemId === itemId);
};

/**
 * Gets whether or not the boost associated with the given itemId is unlocked.
 * If the boost doesn't exist, we return true to skip processing.
 * @param {number} itemId The itemId to check if the boost is unlocked for.
 * @returns
 */
Game_Actor.prototype.isOtibUnlocked = function(itemId)
{
  const otib = this.getOtibById(itemId);

  // if there is no boost for this itemId, then return true to take no action.
  if (!otib) return true;

  return otib.isUnlocked();
};

/**
 * Unlocks a specific boost by it's itemId.
 * @param {number} itemId The itemId of the boost to unlock.
 */
Game_Actor.prototype.unlockOtib = function(itemId)
{
  // don't process an already unlocked boost.
  if (this.isOtibUnlocked(itemId)) return;

  // get the boost and unlock it.
  this.getOtibById(itemId).unlock();
};

/**
 * Calculates the value of the bonus stats for a designated core parameter.
 * @param {number} paramId The id of the parameter to get the bonus for.
 * @param {number} baseParam The base value of the designated parameter.
 * @returns {number}
 */
Game_Actor.prototype.getOtibBonusForCoreParam = function(paramId, baseParam)
{
  // if we have no boosts, then don't process.
  let otibs = this.getAllOtibs();
  if (!otibs.length) return 0;

  // filter to only the unlocked boosts.
  otibs = otibs.filter(otib => otib.isUnlocked());
  if (!otibs.length) return 0;

  let otibsModifications = 0;
  otibs.forEach(otib =>
  {
    otib.parameterData.forEach(otibParam =>
    {
      // don't process this boost param.
      if (!(otibParam.paramId === paramId)) return 0;

      const boost = parseFloat(otibParam.boost);
      if (otibParam.isPercent)
      {
        // if it is a percent, then add it as a percent of the base parameter.
        otibsModifications += Math.floor(baseParam * (boost / 100));
      }
      else
      {
        // otherwise it is a flat boost.
        otibsModifications += boost;
      }
    });
  });

  return otibsModifications;
};

/**
 * Calculates the value of the bonus stats for a designated [sp|ex]-parameter.
 * @param {number} spexParamId The id of the parameter to get the bonus for.
 * @param {number} baseParam The base value of the designated parameter.
 * @param {number} idExtra The id modifier for s/x params.
 * @returns {number}
 */
Game_Actor.prototype.getOtibBonusForNonCoreParam = function(spexParamId, baseParam, idExtra)
{
  // if we have no boosts, then don't process.
  let otibs = this.getAllOtibs();
  if (!otibs.length) return 0;

  // filter to only the unlocked boosts.
  otibs = otibs.filter(otib => otib.isUnlocked());
  if (!otibs.length) return 0;

  let otibsModifications = 0;
  otibs.forEach(otib =>
  {
    otib.parameterData.forEach(otibParam =>
    {
      // don't process this boost param.
      if (!(otibParam.paramId - idExtra === spexParamId)) return 0;

      const boost = parseFloat((otibParam.boost / 100).toFixed(2));
      if (otibParam.isPercent)
      {
        // if it is a percent, then multiply and divide
        otibsModifications += Math.floor(baseParam * (boost / 100));
      }
      else
      {
        // otherwise it is a flat boost.
        otibsModifications += boost;
      }
    });
  });

  return otibsModifications;
};

/**
 * Calculates the value of the bonus stats for this actor's max TP.
 * @returns {number}
 */
Game_Actor.prototype.getOtibBonusForMaxTp = function()
{
  // if we have no boosts, then don't process.
  let otibs = this.getAllOtibs();
  if (!otibs.length) return 0;

  // filter to only the unlocked boosts.
  otibs = otibs.filter(otib => otib.isUnlocked());
  if (!otibs.length) return 0;

  let otibsModifications = 0;
  otibs.forEach(otib =>
  {
    otib.parameterData.forEach(otibParam =>
    {
      // don't process this boost param.
      if (!(otibParam.paramId === 28)) return;

      const { boost } = otibParam;
      if (otibParam.isPercent)
      {
        // if it is a percent, then multiply and divide
        otibsModifications += Math.floor(baseParam * (boost / 100));
      }
      else
      {
        // otherwise it is a flat boost.
        otibsModifications += boost;
      }
    });
  });

  return otibsModifications;
};

/**
 * Extends the base parameters with the OTIB bonuses.
 */
J.OTIB.Aliased.Game_Actor.set('param', Game_Actor.prototype.param);
Game_Actor.prototype.param = function(paramId)
{
  // perform original logic.
  const baseParam = J.OTIB.Aliased.Game_Actor.get('param').call(this, paramId);

  // grab the modifications of this parameter.
  const otibModifications = this.getOtibBonusForCoreParam(paramId, baseParam);

  // combine the results.
  const result = baseParam + otibModifications;

  // return the result.
  return parseFloat(result.toFixed(3));
};

/**
 * Extends the ex-parameters with the OTIB bonuses.
 */
J.OTIB.Aliased.Game_Actor.set('xparam', Game_Actor.prototype.xparam);
Game_Actor.prototype.xparam = function(xparamId)
{
  // perform original logic.
  const baseParam = J.OTIB.Aliased.Game_Actor.get('xparam').call(this, xparamId);

  // grab the modifications of this parameter.
  const otibModifications = this.getOtibBonusForNonCoreParam(xparamId, baseParam, 8);

  // combine the results.
  const result = baseParam + otibModifications;

  // return the result.
  return result;
};

/**
 * Extends the sp-parameters with the OTIB bonuses.
 */
J.OTIB.Aliased.Game_Actor.set('sparam', Game_Actor.prototype.sparam);
Game_Actor.prototype.sparam = function(sparamId)
{
  // perform original logic.
  const baseParam = J.OTIB.Aliased.Game_Actor.get('sparam').call(this, sparamId);

  // grab the modifications of this parameter.
  const otibModifications = this.getOtibBonusForNonCoreParam(sparamId, baseParam, 18);

  // combine the results.
  const result = baseParam + otibModifications;

  // return the result.
  return result;
};

/**
 * Extends the max TP to include any bonuses for that, too.
 */
J.OTIB.Aliased.Game_Actor.set('maxTp', Game_Actor.prototype.maxTp);
Game_Actor.prototype.maxTp = function()
{
  // perform original logic.
  const baseMaxTp = J.OTIB.Aliased.Game_Actor.get('maxTp').call(this);

  // grab the modifications of this parameter.
  const otibModifications = this.getOtibBonusForMaxTp();

  // combine the results.
  const result = baseMaxTp + otibModifications;

  // return the result.
  return result;
};
//endregion Game_Actor