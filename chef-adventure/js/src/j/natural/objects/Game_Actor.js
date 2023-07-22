//region Game_Actor
/**
 * Extends {@link #setup}.
 * Includes parameter buff initialization.
 */
J.NATURAL.Aliased.Game_Actor.set('setup', Game_Actor.prototype.setup);
Game_Actor.prototype.setup = function(actorId)
{
  // perform original logic.
  J.NATURAL.Aliased.Game_Actor.get('setup').call(this, actorId);

  // initialize the parameter buffs on this battler.
  this.refreshAllParameterBuffs();
};

/**
 * Extends {@link #onBattlerDataChange}.
 * Also refreshes all natural parameter buff values on the battler.
 */
J.NATURAL.Aliased.Game_Actor.set('onBattlerDataChange', Game_Actor.prototype.onBattlerDataChange);
Game_Actor.prototype.onBattlerDataChange = function()
{
  // perform original logic.
  J.NATURAL.Aliased.Game_Actor.get('onBattlerDataChange').call(this);

  // refresh all our buffs, something could've changed.
  this.refreshAllParameterBuffs();
};

//region max tp
/**
 * OVERWRITE Replaces the `maxTp()` function with our custom one that will respect
 * formulas and apply rates from tags, etc.
 * @returns {number}
 */
Game_Actor.prototype.maxTp = function()
{
  // calculate our actual max tp.
  return this.actualMaxTp();
};

/**
 * Gets all natural bonuses for max tp.
 * Actors have growths as well as buffs.
 * @param {number} baseParam The base max tp value.
 * @returns {number} The natural bonuses applied.
 */
Game_Actor.prototype.getMaxTpNaturalBonuses = function(baseParam)
{
  // calculate the max tp bonuses from buffs.
  const maxTpBuff = this.getMaxTpBuff(baseParam);

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
  const growthPlus = this.maxTpGrowthPlus();

  // get the permanent rate bonus to this parameter.
  const growthRate = this.maxTpGrowthRate();

  // short circuit if we have no bonuses of any kind.
  if (!growthPlus && !growthRate) return 0;

  // return result.
  return this.calculatePlusRate(baseParam, growthPlus, growthRate);
};
//endregion max tp

//region b params
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
  // determine the structure for this parameter.
  const structures = this.getRegexByParamId(paramId);

  // if there is no regexp, then don't try to do things.
  if (!structures) return 0;

  // get original value.
  const baseParam = J.NATURAL.Aliased.Game_Actor.get('paramBase').call(this, paramId);

  // destructure into the plus and rate regexp structures.
  const paramNaturalBonuses = this.getParamBaseNaturalBonuses(paramId, baseParam);

  // return result.
  return (paramNaturalBonuses);
};

/**
 * Gets all natural growths for this base parameter.
 * @param {number} paramId The parameter id in question.
 * @param {number} baseParam The base parameter.
 * @returns {number} The added value of the `baseParam` + `paramBuff` + `paramGrowth`.
 */
Game_Actor.prototype.getParamBaseNaturalBonuses = function(paramId, baseParam)
{
  // determine temporary buff for this param.
  const paramBuff = this.calculateBParamBuff(paramId, baseParam);

  // determine permanent growth for this param.
  const paramGrowth = this.getBparamGrowth(paramId, baseParam);

  // return result.
  return (paramBuff + paramGrowth);
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
  const growthPlus = this.bParamGrowthPlus(paramId);

  // get the permanent rate bonus to this parameter.
  const growthRate = this.bParamGrowthRate(paramId);

  // short circuit if we have no bonuses of any kind.
  if (!growthPlus && !growthRate) return 0;

  // return result.
  return this.calculatePlusRate(baseParam, growthPlus, growthRate);
};
//endregion b params

//region ex params
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
  // determine the structure for this parameter.
  const structures = this.getRegexByExParamId(xparamId);

  // if there is no regexp, then don't try to do things.
  if (!structures) return 0;

  // get original value.
  const baseParam = J.NATURAL.Aliased.Game_Actor.get('xparam').call(this, xparamId);

  // destructure into the plus and rate regexp structures.
  const paramNaturalBonuses = this.getXparamNaturalBonuses(xparamId, structures, baseParam);

  // return result.
  return (paramNaturalBonuses);
};

/**
 * Gets all natural growths for this ex-parameter.
 * @param {number} xparamId The parameter id in question.
 * @param {number} baseParam The base parameter.
 * @returns {number} The added value of the `baseParam` + `paramBuff` + `paramGrowth`.
 */
Game_Actor.prototype.getXparamNaturalBonuses = function(xparamId, baseParam)
{

  // determine temporary buff for this param.
  const paramBuff = this.calculateExParamBuff(xparamId, baseParam);

  // determine permanent growth for this param.
  const paramGrowth = this.getXparamGrowth(xparamId, baseParam) / 100;

  // return result.
  return (paramBuff + paramGrowth);
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
  const growthPlus = this.xParamGrowthPlus(paramId);

  // get the permanent rate bonus to this parameter.
  const growthRate = this.xParamGrowthRate(paramId);

  // short circuit if we have no bonuses of any kind.
  if (!growthPlus && !growthRate) return 0;

  // return result.
  return this.calculatePlusRate(baseParam, growthPlus, growthRate);
};
//endregion ex params

//region sp params
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
  // determine temporary buff for this param.
  const paramBuff = this.calculateSpParamBuff(baseParam, sparamId);

  // determine permanent growth for this param.
  const paramGrowth = (this.getSparamGrowth(sparamId, baseParam) / 100);

  // return result.
  return (paramBuff + paramGrowth);
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
  const growthPlus = this.sParamGrowthPlus(paramId);

  // get the permanent rate bonus to this parameter.
  const growthRate = this.sParamGrowthRate(paramId);

  // short circuit if we have no bonuses of any kind.
  if (!growthPlus && !growthRate) return 0;

  // return result.
  return this.calculatePlusRate(baseParam, growthPlus, growthRate);
};
//endregion sp params

//region apply growths
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
  this.modMaxTpGrowthPlus(growthPlus);

  // calculate the rate growth for this parameter.
  const growthRate = this.naturalParamBuff(growthRateStructure, baseMaxTp);

  // add it to the running total of permanent growth rates.
  this.modMaxTpGrowthRate(growthRate);
};

/**
 * Applies the growths for base parameters.
 */
Game_Actor.prototype.applyNaturalBparamGrowths = function()
{
  // grab all known base parameter ids.
  const paramIds = Game_BattlerBase.knownBaseParameterIds();

  // iterate over the known base parameter ids.
  paramIds.forEach(paramId =>
  {
    // destructure into the plus and rate regexp structures.
    const [plusStructure, rateStructure] = this.getGrowthRegexByBparamId(paramId);

    // get original value.
    const baseParam = J.NATURAL.Aliased.Game_Actor.get('paramBase').call(this, paramId);

    // calculate the flat growth for this parameter.
    const growthPlus = this.naturalParamBuff(plusStructure, baseParam);

    // add it to the running total of permanent growth pluses.
    this.modBparamGrowthPlus(paramId, growthPlus);

    // calculate the rate growth for this parameter.
    const growthRate = this.naturalParamBuff(rateStructure, baseParam);

    // add it to the running total of permanent growth rates.
    this.modBparamGrowthRate(paramId, growthRate);
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
  // grab all known base parameter ids.
  const paramIds = Game_BattlerBase.knownExParameterIds();

  // iterate over the known ex parameter ids.
  paramIds.forEach(paramId =>
  {
    // destructure into the plus and rate regexp structures.
    const [plusStructure, rateStructure] = this.getGrowthRegexByXparamId(paramId);

    // get original value.
    const baseParam = J.NATURAL.Aliased.Game_Actor.get('xparam').call(this, paramId);

    // calculate the flat growth for this parameter.
    const growthPlus = this.naturalParamBuff(plusStructure, baseParam);

    // add it to the running total of permanent growth pluses.
    this.modXparamGrowthPlus(paramId, growthPlus);

    // calculate the rate growth for this parameter.
    const growthRate = this.naturalParamBuff(rateStructure, baseParam);

    // add it to the running total of permanent growth rates.
    this.modXparamGrowthRate(paramId, growthRate);
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
  // grab all known base parameter ids.
  const paramIds = Game_BattlerBase.knownSpParameterIds();

  // iterate over the known sp parameter ids.
  paramIds.forEach(paramId =>
  {
    // destructure into the plus and rate regexp structures.
    const [plusStructure, rateStructure] = this.getGrowthRegexBySparamId(paramId);

    // get original value.
    const baseParam = J.NATURAL.Aliased.Game_Actor.get('sparam').call(this, paramId);

    // calculate the flat growth for this parameter.
    const growthPlus = this.naturalParamBuff(plusStructure, baseParam);

    // add it to the running total of permanent growth pluses.
    this.modSparamGrowthPlus(paramId, growthPlus);

    // calculate the rate growth for this parameter.
    const growthRate = this.naturalParamBuff(rateStructure, baseParam);

    // add it to the running total of permanent growth rates.
    this.modSparamGrowthRate(paramId, growthRate);
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
//endregion apply growths
//endregion Game_Actor