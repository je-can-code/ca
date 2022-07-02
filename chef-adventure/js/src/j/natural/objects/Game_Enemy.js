//#region Game_Enemy
/**
 * Extends `.paramBase()` to include any additional growth bonuses as part of the base.
 */
J.NATURAL.Aliased.Game_Enemy.set('paramBase', Game_Enemy.prototype.paramBase);
Game_Enemy.prototype.paramBase = function(paramId)
{
  // get original value.
  const baseParam = J.NATURAL.Aliased.Game_Enemy.get('paramBase').call(this, paramId);

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
Game_Enemy.prototype.paramBaseNaturalBonuses = function(paramId)
{
  // get original value.
  const baseParam = J.NATURAL.Aliased.Game_Enemy.get('paramBase').call(this, paramId);

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
 * Enemies only have buffs.
 * @param {number} paramId The parameter id in question.
 * @param {[RegExp, RegExp]} structures The pair of regex structures for plus and rate.
 * @param {number} baseParam The base parameter.
 * @returns {number} The added value of the `baseParam` + `paramBuff` + `paramGrowth`.
 */
Game_Enemy.prototype.getParamBaseNaturalBonuses = function(paramId, structures, baseParam)
{
  // destructure into the plus and rate regexp structures.
  const [plusStructure, rateStructure] = structures;

  // determine temporary buff for this param.
  const paramBuff = this.getParamBuff(baseParam, plusStructure, rateStructure);

  // return result.
  return paramBuff;
};

/**
 * Extends `.xparam()` to include any additional growth bonuses.
 */
J.NATURAL.Aliased.Game_Enemy.set('xparam', Game_Enemy.prototype.xparam);
Game_Enemy.prototype.xparam = function(xparamId)
{
  // get original value.
  const baseParam = J.NATURAL.Aliased.Game_Enemy.get('xparam').call(this, xparamId);

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
Game_Enemy.prototype.xparamNaturalBonuses = function(xparamId)
{
  // get original value.
  const baseParam = J.NATURAL.Aliased.Game_Enemy.get('xparam').call(this, xparamId);

  // determine the structure for this parameter.
  const structures = this.getRegexByExParamId(xparamId);

  // if there is no regexp, then don't try to do things.
  if (!structures) return 0;

  // destructure into the plus and rate regexp structures.
  const paramNaturalBonuses = this.getXparamNaturalBonuses(xparamId, structures, baseParam);

  // return result.
  return paramNaturalBonuses;
};

/**
 * Gets all natural growths for this ex-parameter.
 * @param {number} xparamId The parameter id in question.
 * @param {[RegExp, RegExp]} structures The pair of regex structures for plus and rate.
 * @param {number} baseParam The base parameter.
 * @returns {number} The added value of the `baseParam` + `paramBuff` + `paramGrowth`.
 */
Game_Enemy.prototype.getXparamNaturalBonuses = function(xparamId, structures, baseParam)
{
  // destructure into the plus and rate regexp structures.
  const [plusStructure, rateStructure] = structures;

  // determine temporary buff for this param.
  const paramBuff = this.getSXParamBuff(baseParam, plusStructure, rateStructure);

  // return result.
  return paramBuff;
};

/**
 * Extends `.sparam()` to include any additional growth bonuses.
 */
J.NATURAL.Aliased.Game_Enemy.set('sparam', Game_Enemy.prototype.sparam);
Game_Enemy.prototype.sparam = function(sparamId)
{
  // get original value.
  const baseParam = J.NATURAL.Aliased.Game_Enemy.get('sparam').call(this, sparamId);

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
Game_Enemy.prototype.sparamNaturalBonuses = function(sparamId)
{
  // get original value.
  const baseParam = J.NATURAL.Aliased.Game_Enemy.get('sparam').call(this, sparamId);

  // determine the structure for this parameter.
  const structures = this.getRegexBySpParamId(sparamId);

  // if there is no regexp, then don't try to do things.
  if (!structures) return 0;

  // destructure into the plus and rate regexp structures.
  const sparamNaturalBonuses = this.getSparamNaturalBonuses(sparamId, structures, baseParam);

  // return result.
  return sparamNaturalBonuses;
};

/**
 * Gets all natural growths for this sp-parameter.
 * Enemies only have buffs.
 * @param {number} sparamId The parameter id in question.
 * @param {[RegExp, RegExp]} structures The pair of regex structures for plus and rate.
 * @param {number} baseParam The base parameter.
 * @returns {number} The added value of the `baseParam` + `paramBuff` + `paramGrowth`.
 */
Game_Enemy.prototype.getSparamNaturalBonuses = function(sparamId, structures, baseParam)
{
  // destructure into the plus and rate regexp structures.
  const [plusStructure, rateStructure] = structures;

  // determine temporary buff for this param.
  const paramBuff = this.getSXParamBuff(baseParam, plusStructure, rateStructure);

  // return result.
  return paramBuff;
};

/**
 * Gets the base max tp for this enemy.
 * @returns {number}
 */
Game_Enemy.prototype.getBaseMaxTp = function()
{
  return J.NATURAL.Metadata.BaseTpMaxEnemies;
};
//#endregion Game_Enemy