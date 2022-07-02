//#region Game_Actor
/**
 * Gets all natural bonuses for max tp.
 * Actors have both buffs and growths.
 * @param {number} baseParam The base max tp value.
 * @returns {number} The natural bonuses applied.
 */
Game_Actor.prototype.getMaxTpNaturalBonuses = function(baseParam)
{
  // destructure out the plus and rate structures for buffs.
  const [buffPlusStructure, buffRateStructure,,] = this.getRegexForMaxTp();

  // calculate the max tp bonuses from buffs.
  const maxTpBuff = this.getMaxTpBuff(baseParam, buffPlusStructure, buffRateStructure);

  // calculate the max tp bonuses from growths.
  const maxTpGrowth = this.getMaxTpGrowth(baseParam);

  // return that combination.
  return (maxTpBuff + maxTpGrowth);
};

/**
 * Gets the base max tp for this actor.
 * @returns {number}
 */
Game_Actor.prototype.getBaseMaxTp = function()
{
  return J.NATURAL.Metadata.BaseTpMaxActors;
};

/**
 * Gets the current amount of max tp bonuses added from growths.
 * @param {number} baseParam The base parameter value.
 * @returns {number}
 */
Game_Actor.prototype.getMaxTpGrowth = function(baseParam)
{
  // get the permanent flat bonus to this parameter.
  const growthPlus = this.maxTpPlus();

  // get the permanent rate bonus to this parameter.
  const growthRate = this.maxTpRate();

  // short circuit if we have no bonuses of any kind.
  if (!growthPlus && !growthRate) return 0;

  // return result.
  return this.calculatePlusRate(baseParam, growthPlus, growthRate);
};

/**
 * Extends `.paramBase()` to include any additional growth bonuses as part of the base.
 */
J.NATURAL.Aliased.Game_Actor.set('paramBase', Game_Actor.prototype.paramBase);
Game_Actor.prototype.paramBase = function(paramId)
{
  // get original value.
  const baseParam = J.NATURAL.Aliased.Game_Actor.get('paramBase').call(this, paramId);

  // determine the structure for this parameter.
  const paramBaseNaturalBonuses = this.paramBaseNaturalBonuses(paramId);

  // return result.
  return (baseParam + paramBaseNaturalBonuses);
};

/**
 * This is exclusively for access to the natural growth values, without the base parameter value added.
 * @param {number} paramId The parameter id in question.
 * @returns {number}
 */
Game_Actor.prototype.paramBaseNaturalBonuses = function(paramId)
{
  // get original value.
  const baseParam = J.NATURAL.Aliased.Game_Actor.get('paramBase').call(this, paramId);

  // determine the structure for this parameter.
  const structures = this.getRegexByParamId(paramId);

  // if there is no regexp, then don't try to do things.
  if (!structures) return 0;

  // destructure into the plus and rate regexp structures.
  const paramNaturalBonuses = this.getParamBaseNaturalBonuses(paramId, structures, baseParam);

  // return result.
  return (paramNaturalBonuses);
};

/**
 * Gets all natural growths for this base parameter.
 * @param {number} paramId The parameter id in question.
 * @param {[RegExp, RegExp]} structures The pair of regex structures for plus and rate.
 * @param {number} baseParam The base parameter.
 * @returns {number} The added value of the `baseParam` + `paramBuff` + `paramGrowth`.
 */
Game_Actor.prototype.getParamBaseNaturalBonuses = function(paramId, structures, baseParam)
{
  // destructure into the plus and rate regexp structures.
  const [plusStructure, rateStructure] = structures;

  // determine temporary buff for this param.
  const paramBuff = this.getParamBuff(baseParam, plusStructure, rateStructure);

  // determine permanent growth for this param.
  const paramGrowth = this.getBparamGrowth(paramId, baseParam);

  // return result.
  return (paramBuff + paramGrowth);
};

/**
 * Extends `.xparam()` to include any additional growth bonuses.
 */
J.NATURAL.Aliased.Game_Actor.set('xparam', Game_Actor.prototype.xparam);
Game_Actor.prototype.xparam = function(xparamId)
{
  // get original value.
  const baseParam = J.NATURAL.Aliased.Game_Actor.get('xparam').call(this, xparamId);

  // determine the structure for this parameter.
  const xparamNaturalBonuses = this.xparamNaturalBonuses(xparamId);

  // return result.
  return (baseParam + xparamNaturalBonuses);
};

/**
 * This is exclusively for access to the natural growth values, without the ex-parameter value added.
 * @param {number} xparamId The parameter id in question.
 * @returns {number}
 */
Game_Actor.prototype.xparamNaturalBonuses = function(xparamId)
{
  // get original value.
  const baseParam = J.NATURAL.Aliased.Game_Actor.get('xparam').call(this, xparamId);

  // determine the structure for this parameter.
  const structures = this.getRegexByExParamId(xparamId);

  // if there is no regexp, then don't try to do things.
  if (!structures) return 0;

  // destructure into the plus and rate regexp structures.
  const paramNaturalBonuses = this.getXparamNaturalBonuses(xparamId, structures, baseParam);

  // return result.
  return (paramNaturalBonuses);
};

/**
 * Gets all natural growths for this ex-parameter.
 * @param {number} xparamId The parameter id in question.
 * @param {[RegExp, RegExp]} structures The pair of regex structures for plus and rate.
 * @param {number} baseParam The base parameter.
 * @returns {number} The added value of the `baseParam` + `paramBuff` + `paramGrowth`.
 */
Game_Actor.prototype.getXparamNaturalBonuses = function(xparamId, structures, baseParam)
{
  // destructure into the plus and rate regexp structures.
  const [plusStructure, rateStructure] = structures;

  // determine temporary buff for this param.
  const paramBuff = this.getSXParamBuff(baseParam, plusStructure, rateStructure);

  // determine permanent growth for this param.
  const paramGrowth = (this.getXparamGrowth(xparamId, baseParam) / 100);

  // return result.
  return (paramBuff + paramGrowth);
};

/**
 * Extends `.sparam()` to include any additional growth bonuses.
 */
J.NATURAL.Aliased.Game_Actor.set('sparam', Game_Actor.prototype.sparam);
Game_Actor.prototype.sparam = function(sparamId)
{
  // get original value.
  const baseParam = J.NATURAL.Aliased.Game_Actor.get('sparam').call(this, sparamId);

  // determine the structure for this parameter.
  const sparamNaturalBonuses = this.sparamNaturalBonuses(sparamId);

  // return result.
  return (baseParam + sparamNaturalBonuses);
};

/**
 * This is exclusively for access to the natural growth values, without the sp-parameter value added.
 * @param {number} sparamId The parameter id in question.
 * @returns {number}
 */
Game_Actor.prototype.sparamNaturalBonuses = function(sparamId)
{
  // get original value.
  const baseParam = J.NATURAL.Aliased.Game_Actor.get('sparam').call(this, sparamId);

  // determine the structure for this parameter.
  const structures = this.getRegexBySpParamId(sparamId);

  // if there is no regexp, then don't try to do things.
  if (!structures) return 0;

  // destructure into the plus and rate regexp structures.
  const sparamNaturalBonuses = this.getSparamNaturalBonuses(sparamId, structures, baseParam);

  // return result.
  return (sparamNaturalBonuses);
};

/**
 * Gets all natural growths for this sp-parameter.
 * Actors have buffs and growths.
 * @param {number} sparamId The parameter id in question.
 * @param {[RegExp, RegExp]} structures The pair of regex structures for plus and rate.
 * @param {number} baseParam The base parameter.
 * @returns {number} The added value of the `baseParam` + `paramBuff` + `paramGrowth`.
 */
Game_Actor.prototype.getSparamNaturalBonuses = function(sparamId, structures, baseParam)
{
  // destructure into the plus and rate regexp structures.
  const [plusStructure, rateStructure] = structures;

  // determine temporary buff for this param.
  const paramBuff = this.getSXParamBuff(baseParam, plusStructure, rateStructure);

  // determine permanent growth for this param.
  const paramGrowth = (this.getSparamGrowth(sparamId, baseParam) / 100);

  // return result.
  return (paramBuff + paramGrowth);
};

/**
 * Gets the temporary buff for a given parameter based on the provided regexp structures.
 * @param {number} baseParam The base value of the parameter in question.
 * @param {RegExp} plusStructure The RegExp for the flat buff for this parameter.
 * @param {RegExp} rateStructure The RegExp for the rate buff for this parameter.
 * @returns {number} The calculated buff amount for this parameter.
 */
Game_Battler.prototype.getParamBuff = function(baseParam, plusStructure, rateStructure)
{
  // determine buff plus for this param.
  const buffPlus = this.naturalParamBuff(plusStructure, baseParam);

  // determine buff rate fort his param.
  const buffRate = (this.naturalParamBuff(rateStructure, baseParam) / 100);

  // calculate the result into a variable for debugging.
  const result = (baseParam * buffRate) + buffPlus;

  // return result.
  return result;
};

/**
 * Gets the temporary buff for a given ex/sp-parameter based on the provided regexp structures.
 * @param {number} baseParam The base value of the parameter in question.
 * @param {RegExp} plusStructure The RegExp for the flat buff for this parameter.
 * @param {RegExp} rateStructure The RegExp for the rate buff for this parameter.
 * @returns {number} The calculated buff amount for this parameter.
 */
Game_Battler.prototype.getSXParamBuff = function(baseParam, plusStructure, rateStructure)
{
  // determine buff plus for this param.
  const buffPlus = (this.naturalParamBuff(plusStructure, baseParam) / 100);

  // determine buff rate for this param.
  const buffRate = (this.naturalParamBuff(rateStructure, baseParam) / 100);

  // don't calculate if we don't have anything.
  if (!buffPlus && !buffRate) return 0;

  // return result.
  return this.calculatePlusRate(baseParam, buffPlus, buffRate);
};

/**
 * Gets the permanent growth for a given base parameter based on the provided id.
 * @param {number} paramId The parameter id to get the growth for.
 * @param {number} baseParam The current value of the given parameter for rate multipliers.
 * @returns {number} The calculated growth amount for this parameter.
 */
Game_Actor.prototype.getBparamGrowth = function(paramId, baseParam)
{
  // get the permanent flat bonus to this parameter.
  const growthPlus = this.bParamPlus(paramId);

  // get the permanent rate bonus to this parameter.
  const growthRate = this.bParamRate(paramId);

  // short circuit if we have no bonuses of any kind.
  if (!growthPlus && !growthRate) return 0;

  // return result.
  return this.calculatePlusRate(baseParam, growthPlus, growthRate);
};

/**
 * Gets the permanent growth for a given ex-parameter based on the provided id.
 * @param {number} paramId The parameter id to get the growth for.
 * @param {number} baseParam The current value of the given parameter for rate multipliers.
 * @returns {number} The calculated growth amount for this parameter.
 */
Game_Actor.prototype.getXparamGrowth = function(paramId, baseParam)
{
  // get the permanent flat bonus to this parameter.
  const growthPlus = this.xParamPlus(paramId);

  // get the permanent rate bonus to this parameter.
  const growthRate = this.xParamRate(paramId);

  // short circuit if we have no bonuses of any kind.
  if (!growthPlus && !growthRate) return 0;

  // return result.
  return this.calculatePlusRate(baseParam, growthPlus, growthRate);
};

/**
 * Gets the permanent growth for a given sp-parameter based on the provided id.
 * @param {number} paramId The parameter id to get the growth for.
 * @param {number} baseParam The current value of the given parameter for rate multipliers.
 * @returns {number} The calculated growth amount for this parameter.
 */
Game_Actor.prototype.getSparamGrowth = function(paramId, baseParam)
{
  // get the permanent flat bonus to this parameter.
  const growthPlus = this.sParamPlus(paramId);

  // get the permanent rate bonus to this parameter.
  const growthRate = this.sParamRate(paramId);

  // short circuit if we have no bonuses of any kind.
  if (!growthPlus && !growthRate) return 0;

  // return result.
  return this.calculatePlusRate(baseParam, growthPlus, growthRate);
};

/**
 * Extends `.levelUp()` to include applying any natural growths the battler has.
 */
J.NATURAL.Aliased.Game_Actor.set('levelUp', Game_Actor.prototype.levelUp);
Game_Actor.prototype.levelUp = function()
{
  // perform original logic.
  J.NATURAL.Aliased.Game_Actor.get('levelUp').call(this);

  // applies all natural growths- permanent stat growths for this battler.
  this.applyNaturalGrowths();
};

/**
 * Applies all natural growths applied to this actor at the present moment.
 */
Game_Actor.prototype.applyNaturalGrowths = function()
{
  // apply all growth types.
  this.applyNaturalMaxTpGrowths();
  this.applyNaturalBparamGrowths();
  this.applyNaturalXparamGrowths();
  this.applyNaturalSparamGrowths();
  this.applyNaturalCustomGrowths();
};

/**
 * Applies the growths for max tp.
 */
Game_Actor.prototype.applyNaturalMaxTpGrowths = function()
{
  // destructure out the plus and rate structures for growths.
  const [,,growthPlusStructure, growthRateStructure] = this.getRegexForMaxTp();

  // grab the base max tp for value basing.
  const baseMaxTp = this.getBaseMaxTp();

  // calculate the flat growth for this parameter.
  const growthPlus = this.naturalParamBuff(growthPlusStructure, baseMaxTp);

  // add it to the running total of permanent growth pluses.
  this.modMaxTpPlus(growthPlus);

  // calculate the rate growth for this parameter.
  const growthRate = this.naturalParamBuff(growthRateStructure, baseMaxTp);

  // add it to the running total of permanent growth rates.
  this.modMaxTpRate(growthRate);
};

/**
 * Applies the growths for base parameters.
 */
Game_Actor.prototype.applyNaturalBparamGrowths = function()
{
  // iterate over the current collection of the base parameters.
  this._j._natural._bParamsPlus.forEach((value, paramId) =>
  {
    // grab the regexp structures for this parameter id.
    const structures = this.getGrowthRegexByBparamId(paramId);

    // if we have no structures for some reason, then skip it.
    if (!structures) return;

    // destructure into the plus and rate regexp structures.
    const [plusStructure, rateStructure] = structures;

    // calculate the flat growth for this parameter.
    const growthPlus = this.naturalParamBuff(plusStructure, value);

    // add it to the running total of permanent growth pluses.
    this.modBparamPlus(paramId, growthPlus);

    // calculate the rate growth for this parameter.
    const growthRate = this.naturalParamBuff(rateStructure, value);

    // add it to the running total of permanent growth rates.
    this.modBparamRate(paramId, growthRate);
  }, this);
};

/**
 * Translates a base parameter id into its corresponding RegExp growth plus and rate structures.
 * @param {number} paramId The parameter id to find the RegExp structures for.
 * @returns {[RegExp, RegExp]} The relevant RegExp structures for this parameter id.
 */
Game_Actor.prototype.getGrowthRegexByBparamId = function(paramId)
{
  switch (paramId)
  {
    case 0: return [J.NATURAL.RegExp.MaxLifeGrowthPlus, J.NATURAL.RegExp.MaxLifeGrowthRate];
    case 1: return [J.NATURAL.RegExp.MaxMagiGrowthPlus, J.NATURAL.RegExp.MaxMagiGrowthRate];
    case 2: return [J.NATURAL.RegExp.PowerGrowthPlus, J.NATURAL.RegExp.PowerGrowthRate];
    case 3: return [J.NATURAL.RegExp.DefenseGrowthPlus, J.NATURAL.RegExp.DefenseGrowthRate];
    case 4: return [J.NATURAL.RegExp.ForceGrowthPlus, J.NATURAL.RegExp.ForceGrowthRate];
    case 5: return [J.NATURAL.RegExp.ResistGrowthPlus, J.NATURAL.RegExp.ResistGrowthRate];
    case 6: return [J.NATURAL.RegExp.SpeedGrowthPlus, J.NATURAL.RegExp.SpeedGrowthRate];
    case 7: return [J.NATURAL.RegExp.LuckGrowthPlus, J.NATURAL.RegExp.LuckGrowthRate];
    default: return null;
  }
};

/**
 * Applies the growths for ex-parameters.
 */
Game_Actor.prototype.applyNaturalXparamGrowths = function()
{
  // iterate over the current collection of the base parameters.
  this._j._natural._xParamsPlus.forEach((value, paramId) =>
  {
    // grab the regexp structures for this parameter id.
    const structures = this.getGrowthRegexByXparamId(paramId);

    // if we have no structures for some reason, then skip it.
    if (!structures) return;

    // destructure into the plus and rate regexp structures.
    const [plusStructure, rateStructure] = structures;

    // calculate the flat growth for this parameter.
    const growthPlus = this.naturalParamBuff(plusStructure, value);

    // add it to the running total of permanent growth pluses.
    this.modXparamPlus(paramId, growthPlus);

    // calculate the rate growth for this parameter.
    const growthRate = this.naturalParamBuff(rateStructure, value);

    // add it to the running total of permanent growth rates.
    this.modXparamRate(paramId, growthRate);
  }, this);
};

/**
 * Translates a ex-parameter id into its corresponding RegExp growth plus and rate structures.
 * @param {number} xparamId The parameter id to find the RegExp structures for.
 * @returns {[RegExp, RegExp]} The relevant RegExp structures for this parameter id.
 */
Game_Actor.prototype.getGrowthRegexByXparamId = function(xparamId)
{
  switch (xparamId)
  {
    case 0: return [J.NATURAL.RegExp.HitGrowthPlus, J.NATURAL.RegExp.HitGrowthRate];
    case 1: return [J.NATURAL.RegExp.EvadeGrowthPlus, J.NATURAL.RegExp.EvadeGrowthRate];
    case 2: return [J.NATURAL.RegExp.CritChanceGrowthPlus, J.NATURAL.RegExp.CritChanceGrowthRate];
    case 3: return [J.NATURAL.RegExp.CritEvadeGrowthPlus, J.NATURAL.RegExp.CritEvadeGrowthRate];
    case 4: return [J.NATURAL.RegExp.MagiEvadeGrowthPlus, J.NATURAL.RegExp.MagiEvadeGrowthRate];
    case 5: return [J.NATURAL.RegExp.MagiReflectGrowthPlus, J.NATURAL.RegExp.MagiReflectGrowthRate];
    case 6: return [J.NATURAL.RegExp.CounterGrowthPlus, J.NATURAL.RegExp.CounterGrowthRate];
    case 7: return [J.NATURAL.RegExp.LifeRegenGrowthPlus, J.NATURAL.RegExp.LifeRegenGrowthRate];
    case 8: return [J.NATURAL.RegExp.MagiRegenGrowthPlus, J.NATURAL.RegExp.MagiRegenGrowthRate];
    case 9: return [J.NATURAL.RegExp.TechRegenGrowthPlus, J.NATURAL.RegExp.TechRegenGrowthRate];
    default: return null;
  }
};

/**
 * Applies the growths for sp-parameters.
 */
Game_Actor.prototype.applyNaturalSparamGrowths = function()
{
  // iterate over the current collection of the base parameters.
  this._j._natural._sParamsPlus.forEach((value, paramId) =>
  {
    // grab the regexp structures for this parameter id.
    const structures = this.getGrowthRegexBySparamId(paramId);

    // if we have no structures for some reason, then skip it.
    if (!structures) return;

    // destructure into the plus and rate regexp structures.
    const [plusStructure, rateStructure] = structures;

    // calculate the flat growth for this parameter.
    const growthPlus = this.naturalParamBuff(plusStructure, value);

    // add it to the running total of permanent growth pluses.
    this.modSparamPlus(paramId, growthPlus);

    // calculate the rate growth for this parameter.
    const growthRate = this.naturalParamBuff(rateStructure, value);

    // add it to the running total of permanent growth rates.
    this.modSparamRate(paramId, growthRate);
  }, this);
};

/**
 * Translates a sp-parameter id into its corresponding RegExp growth plus and rate structures.
 * @param {number} sparamId The parameter id to find the RegExp structures for.
 * @returns {[RegExp, RegExp]} The relevant RegExp structures for this parameter id.
 */
Game_Actor.prototype.getGrowthRegexBySparamId = function(sparamId)
{
  switch (sparamId)
  {
    case 0: return [J.NATURAL.RegExp.AggroGrowthPlus, J.NATURAL.RegExp.AggroGrowthRate];
    case 1: return [J.NATURAL.RegExp.ParryGrowthPlus, J.NATURAL.RegExp.ParryGrowthRate];
    case 2: return [J.NATURAL.RegExp.HealingGrowthPlus, J.NATURAL.RegExp.HealingGrowthRate];
    case 3: return [J.NATURAL.RegExp.ItemFxGrowthPlus, J.NATURAL.RegExp.ItemFxGrowthRate];
    case 4: return [J.NATURAL.RegExp.MagiCostRateGrowthPlus, J.NATURAL.RegExp.MagiCostRateGrowthRate];
    case 5: return [J.NATURAL.RegExp.TechCostRateGrowthPlus, J.NATURAL.RegExp.TechCostRateGrowthRate];
    case 6: return [J.NATURAL.RegExp.PhysDmgRateGrowthPlus, J.NATURAL.RegExp.PhysDmgRateGrowthRate];
    case 7: return [J.NATURAL.RegExp.MagiDmgRateGrowthPlus, J.NATURAL.RegExp.MagiDmgRateGrowthRate];
    case 8: return [J.NATURAL.RegExp.FloorDmgRateGrowthPlus, J.NATURAL.RegExp.FloorDmgRateGrowthRate];
    case 9: return [J.NATURAL.RegExp.ExpGainRateGrowthPlus, J.NATURAL.RegExp.ExpGainRateGrowthRate];
    default: return null;
  }
};

/**
 * A hook for applying additional custom growths that aren't native to RMMZ.
 */
Game_Actor.prototype.applyNaturalCustomGrowths = function()
{
};
//#endregion Game_Actor