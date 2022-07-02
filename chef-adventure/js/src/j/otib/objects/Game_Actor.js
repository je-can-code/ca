//#region Game_Actor
/**
 * Adds new properties to the actors that manage the SDP system.
 */
J.OTIB.Aliased.Game_Actor.initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function()
{
  J.OTIB.Aliased.Game_Actor.initMembers.call(this);
  /**
   * The J object where all my additional properties live.
   */
  this._j = this._j || {};
  /**
   * A grouping of all boosts this actor has can potentially consume.
   * @type {OneTimeItemBoost[]}
   */
  this._j._otibs = this._j._otibs || J.OTIB.Metadata.OneTimeItemBoosts;
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
 * @param {number} sexParamId The id of the parameter to get the bonus for.
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
  /** @type {OneTimeItemBoost[]} */
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

      const boost = otibParam.boost;
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
J.OTIB.Aliased.Game_Actor.param = Game_Actor.prototype.param;
Game_Actor.prototype.param = function(paramId)
{
  const baseParam = J.OTIB.Aliased.Game_Actor.param.call(this, paramId);
  const otibModifications = this.getOtibBonusForCoreParam(paramId, baseParam);
  const result = baseParam + otibModifications;
  return parseFloat(result);
};

/**
 * Extends the ex-parameters with the OTIB bonuses.
 */
J.OTIB.Aliased.Game_Actor.xparam = Game_Actor.prototype.xparam;
Game_Actor.prototype.xparam = function(xparamId)
{
  const baseParam = J.OTIB.Aliased.Game_Actor.xparam.call(this, xparamId);
  const otibModifications = this.getOtibBonusForNonCoreParam(xparamId, baseParam, 8);
  const result = baseParam + otibModifications;
  return result;
};

/**
 * Extends the sp-parameters with the OTIB bonuses.
 */
J.OTIB.Aliased.Game_Actor.sparam = Game_Actor.prototype.sparam;
Game_Actor.prototype.sparam = function(sparamId)
{
  const baseParam = J.OTIB.Aliased.Game_Actor.sparam.call(this, sparamId);
  const otibModifications = this.getOtibBonusForNonCoreParam(sparamId, baseParam, 18);
  const result = baseParam + otibModifications;
  return result;
};

/**
 * Extends the max TP to include any bonuses for that, too.
 */
J.OTIB.Aliased.Game_Actor.maxTp = Game_Actor.prototype.maxTp;
Game_Actor.prototype.maxTp = function()
{
  const baseMaxTp = J.OTIB.Aliased.Game_Actor.maxTp.call(this);
  const otibModifications = this.getOtibBonusForMaxTp();
  return baseMaxTp + otibModifications;
};
//#endregion Game_Actor