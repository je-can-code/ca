//#region Game_Battler
/**
 * Extends `.initMembers()` to include initializing the natural growth parameters.
 */
J.NATURAL.Aliased.Game_Battler.set('initMembers', Game_Battler.prototype.initMembers);
Game_Battler.prototype.initMembers = function()
{
  // perform original logic.
  J.NATURAL.Aliased.Game_Battler.get('initMembers').call(this);

  // initialize the natural parameter collections.
  this.initNaturalGrowthParameters();
};

/**
 * Initializes the natural growth parameters for this battler.
 */
Game_Battler.prototype.initNaturalGrowthParameters = function()
{
  /**
   * The J object where all my additional properties live.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with natural growth.
   */
  this._j._natural ||= {};

  /**
   * The permanent flat bonus for max tp.
   * @type {number}
   */
  this._j._natural._maxTpPlus = 0;

  /**
   * The permanent multiplier bonus for max tp.
   * @type {number}
   */
  this._j._natural._maxTpRate = 0;

  /**
   * The permanent flat bonuses for each of the base parameters.
   * @type {number[]}
   */
  this._j._natural._bParamsPlus = [0, 0, 0, 0, 0, 0, 0, 0];

  /**
   * The permanent multiplier bonuses for each of the base parameters.
   * @type {number[]}
   */
  this._j._natural._bParamsRate = [0, 0, 0, 0, 0, 0, 0, 0];

  /**
   * The permanent flat bonuses for each of the sp-parameters.
   * @type {number[]}
   */
  this._j._natural._sParamsPlus = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  /**
   * The permanent multiplier bonuses for each of the sp-parameters.
   * @type {number[]}
   */
  this._j._natural._sParamsRate = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  /**
   * The permanent flat bonuses for each of the ex-parameters.
   * @type {number[]}
   */
  this._j._natural._xParamsPlus = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  /**
   * The permanent multiplier bonuses for each of the ex-parameters.
   * @type {number[]}
   */
  this._j._natural._xParamsRate = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
};

/**
 * Gets the permanent flat bonus for max tp.
 * @returns {number}
 */
Game_Battler.prototype.maxTpPlus = function()
{
  return this._j._natural._maxTpPlus;
};

/**
 * Modifies the permanent flat bonus for max tp by a given amount.
 * @param {number} amount The amount to modify the bonus by.
 */
Game_Battler.prototype.modMaxTpPlus = function(amount)
{
  this._j._natural._maxTpPlus += amount;
};

/**
 * Gets the permanent multiplicative bonus for max tp.
 * @returns {number}
 */
Game_Battler.prototype.maxTpRate = function()
{
  return this._j._natural._maxTpRate;
};

/**
 * Modifies the permanent multiplicative bonus for max tp by a given amount.
 * @param {number} amount The amount to modify the bonus by.
 */
Game_Battler.prototype.modMaxTpRate = function(amount)
{
  this._j._natural._maxTpRate += amount;
};

/**
 * Gets the permanent flat bonus for a base parameter of the given id.
 * @param {number} paramId The id of the parameter.
 * @returns {number}
 */
Game_Battler.prototype.bParamPlus = function(paramId)
{
  return this._j._natural._bParamsPlus[paramId] ?? 0;
};

/**
 * Modifies the permanent flat bonus value of the given id by a given amount.
 * @param {number} paramId The id of the parameter.
 * @param {number} amount The amount to modify the parameter by.
 */
Game_Battler.prototype.modBparamPlus = function(paramId, amount)
{
  this._j._natural._bParamsPlus[paramId] += amount;
};

/**
 * Gets the permanent multiplier bonus for a base parameter of the given id.
 * @param {number} paramId The id of the parameter.
 * @returns {number}
 */
Game_Battler.prototype.bParamRate = function(paramId)
{
  return this._j._natural._bParamsRate[paramId] ?? 0;
};

/**
 * Modifies the permanent multiplier bonus value of the given id by a given amount.
 * @param {number} paramId The id of the parameter.
 * @param {number} amount The amount to modify the parameter by.
 */
Game_Battler.prototype.modBparamRate = function(paramId, amount)
{
  this._j._natural._bParamsRate[paramId] += amount;
};

/**
 * Gets the permanent flat bonus for a base parameter of the given id.
 * @param {number} paramId The id of the parameter.
 * @returns {number}
 */
Game_Battler.prototype.sParamPlus = function(paramId)
{
  return this._j._natural._sParamsPlus[paramId] ?? 0;
};

/**
 * Modifies the permanent flat bonus value of the given id by a given amount.
 * @param {number} paramId The id of the parameter.
 * @param {number} amount The amount to modify the parameter by.
 */
Game_Battler.prototype.modSparamPlus = function(paramId, amount)
{
  this._j._natural._sParamsPlus[paramId] += amount;
};

/**
 * Gets the permanent multiplier bonus for a base parameter of the given id.
 * @param {number} paramId The id of the parameter.
 * @returns {number}
 */
Game_Battler.prototype.sParamRate = function(paramId)
{
  return this._j._natural._sParamsRate[paramId] ?? 0;
};

/**
 * Modifies the permanent multiplier bonus value of the given id by a given amount.
 * @param {number} paramId The id of the parameter.
 * @param {number} amount The amount to modify the parameter by.
 */
Game_Battler.prototype.modSparamRate = function(paramId, amount)
{
  this._j._natural._sParamsRate[paramId] += amount;
};

/**
 * Gets the permanent flat bonus for a base parameter of the given id.
 * @param {number} paramId The id of the parameter.
 * @returns {number}
 */
Game_Battler.prototype.xParamPlus = function(paramId)
{
  return this._j._natural._xParamsPlus[paramId] ?? 0;
};

/**
 * Modifies the permanent flat bonus value of the given id by a given amount.
 * @param {number} paramId The id of the parameter.
 * @param {number} amount The amount to modify the parameter by.
 */
Game_Battler.prototype.modXparamPlus = function(paramId, amount)
{
  this._j._natural._xParamsPlus[paramId] += amount;
};

/**
 * Gets the permanent multiplier bonus for a base parameter of the given id.
 * @param {number} paramId The id of the parameter.
 * @returns {number}
 */
Game_Battler.prototype.xParamRate = function(paramId)
{
  return this._j._natural._xParamsRate[paramId] ?? 0;
};

/**
 * Modifies the permanent multiplier bonus value of the given id by a given amount.
 * @param {number} paramId The id of the parameter.
 * @param {number} amount The amount to modify the parameter by.
 */
Game_Battler.prototype.modXparamRate = function(paramId, amount)
{
  this._j._natural._xParamsRate[paramId] += amount;
};

/**
 * Translates a base parameter id into its corresponding RegExp buff plus and rate structures.
 * @param {number} paramId The parameter id to find the RegExp structures for.
 * @returns {[RegExp, RegExp]} The relevant RegExp structures for this parameter id.
 */
Game_Battler.prototype.getRegexByParamId = function(paramId)
{
  switch (paramId)
  {
    case 0: return [J.NATURAL.RegExp.MaxLifeBuffPlus, J.NATURAL.RegExp.MaxLifeBuffRate];
    case 1: return [J.NATURAL.RegExp.MaxMagiBuffPlus, J.NATURAL.RegExp.MaxMagiBuffRate];
    case 2: return [J.NATURAL.RegExp.PowerBuffPlus, J.NATURAL.RegExp.PowerBuffRate];
    case 3: return [J.NATURAL.RegExp.DefenseBuffPlus, J.NATURAL.RegExp.DefenseBuffRate];
    case 4: return [J.NATURAL.RegExp.ForceBuffPlus, J.NATURAL.RegExp.ForceBuffRate];
    case 5: return [J.NATURAL.RegExp.ResistBuffPlus, J.NATURAL.RegExp.ResistBuffRate];
    case 6: return [J.NATURAL.RegExp.SpeedBuffPlus, J.NATURAL.RegExp.SpeedBuffRate];
    case 7: return [J.NATURAL.RegExp.LuckBuffPlus, J.NATURAL.RegExp.LuckBuffRate];
    default: return null;
  }
};

/**
 * Translates a ex-parameter id into its corresponding RegExp buff plus and rate structures.
 * @param {number} xParamId The ex-parameter id to find the RegExp structures for.
 * @returns {RegExp} The relevant RegExp structures for this parameter id.
 */
Game_Battler.prototype.getRegexByExParamId = function(xParamId)
{
  switch (xParamId)
  {
    case 0: return [J.NATURAL.RegExp.HitBuffPlus, J.NATURAL.RegExp.HitBuffRate];
    case 1: return [J.NATURAL.RegExp.EvadeBuffPlus, J.NATURAL.RegExp.EvadeBuffRate];
    case 2: return [J.NATURAL.RegExp.CritChanceBuffPlus, J.NATURAL.RegExp.CritChanceBuffRate];
    case 3: return [J.NATURAL.RegExp.CritEvadeBuffPlus, J.NATURAL.RegExp.CritEvadeBuffRate];
    case 4: return [J.NATURAL.RegExp.MagiEvadeBuffPlus, J.NATURAL.RegExp.MagiEvadeBuffRate];
    case 5: return [J.NATURAL.RegExp.MagiReflectBuffPlus, J.NATURAL.RegExp.MagiReflectBuffRate];
    case 6: return [J.NATURAL.RegExp.CounterBuffPlus, J.NATURAL.RegExp.CounterBuffRate];
    case 7: return [J.NATURAL.RegExp.LifeRegenBuffPlus, J.NATURAL.RegExp.LifeRegenBuffRate];
    case 8: return [J.NATURAL.RegExp.MagiRegenBuffPlus, J.NATURAL.RegExp.MagiReflectBuffRate];
    case 9: return [J.NATURAL.RegExp.TechRegenBuffPlus, J.NATURAL.RegExp.MagiReflectBuffRate];
    default: return null;
  }
};

/**
 * Translates a sp-parameter id into its corresponding RegExp buff plus and rate structures.
 * @param {number} sParamId The sp-parameter id to find the RegExp structures for.
 * @returns {RegExp} The relevant RegExp structures for this parameter id.
 */
Game_Battler.prototype.getRegexBySpParamId = function(sParamId)
{
  switch (sParamId)
  {
    case 0: return [J.NATURAL.RegExp.AggroBuffPlus, J.NATURAL.RegExp.AggroBuffRate];
    case 1: return [J.NATURAL.RegExp.ParryBuffPlus, J.NATURAL.RegExp.ParryBuffRate];
    case 2: return [J.NATURAL.RegExp.HealingBuffPlus, J.NATURAL.RegExp.HealingBuffRate];
    case 3: return [J.NATURAL.RegExp.ItemFxBuffPlus, J.NATURAL.RegExp.ItemFxBuffRate];
    case 4: return [J.NATURAL.RegExp.MagiCostRateBuffPlus, J.NATURAL.RegExp.MagiCostRateBuffRate];
    case 5: return [J.NATURAL.RegExp.TechCostRateBuffPlus, J.NATURAL.RegExp.TechCostRateBuffRate];
    case 6: return [J.NATURAL.RegExp.PhysDmgRateBuffPlus, J.NATURAL.RegExp.PhysDmgRateBuffRate];
    case 7: return [J.NATURAL.RegExp.MagiDmgRateBuffPlus, J.NATURAL.RegExp.MagiDmgRateBuffRate];
    case 8: return [J.NATURAL.RegExp.FloorDmgRateBuffPlus, J.NATURAL.RegExp.FloorDmgRateBuffRate];
    case 9: return [J.NATURAL.RegExp.ExpGainRateBuffPlus, J.NATURAL.RegExp.ExpGainRateBuffRate];
    default: return null;
  }
};

/**
 * Calculates the bonus growth based on the provided regular expression.
 * @param {RegExp} structure The RegExp structure for this parameter.
 * @param {number} baseParam The original value of the given parameter.
 * @returns {number} The growth amount.
 */
Game_Battler.prototype.naturalParamBuff = function(structure, baseParam)
{
  // add the extracted formulai to an array.
  const paramGrowthFormulai = this.extractParameterFormulai(structure);

  // if no formulai were found, then stop processing.
  if (!paramGrowthFormulai.length) return 0;

  // allows access to the battler and base parameter values in formula.
  /* eslint-disable no-unused-vars */
  const a = this;
  const b = baseParam;
  /* eslint-enable no-unused-vars */

  // the growth amount from the formula.
  let bonusParam = 0;

  // iterate over each of the found formulai.
  paramGrowthFormulai.forEach(formula =>
  {
    // evaluate the result of the formula and add it to the bonuses.
    const result = parseFloat(eval(formula).toFixed(3));
    bonusParam += result;
  });

  // return the new addition to this parameter.
  return bonusParam;
};

/**
 * Extracts the formulai matching the regexp structure provided from all possible
 * note objects that this battler has.
 * @param {RegExp} structure The regular expression to scan for.
 * @returns {string[]} The found collection of formulai to apply.
 */
Game_Battler.prototype.extractParameterFormulai = function(structure)
{
  // start the formula container with none.
  const paramGrowthFormulai = [];

  // grab all things with notes that a battler could gain parameters from.
  const objectsToCheck = this.getAllNotes();

  // iterate over all relevant objects.
  objectsToCheck.forEach(databaseData =>
  {
    // grab the formulai matching the regex from this object.
    const matchingFormulai = databaseData.getFilteredNotesByRegex(structure);

    // check to make sure we have matching formulai.
    if (matchingFormulai.length)
    {
      // iterate over the found formulai.
      matchingFormulai.forEach(line =>
      {
        // extract the captured formula.
        // eslint-disable-next-line prefer-destructuring
        const result = structure.exec(line)[1];

        // make sure we had a real formula first.
        if (result)
        {
          // shove it into the formula container.
          paramGrowthFormulai.push(result);
        }
      });
    }
  });

  // return the formula container.
  return paramGrowthFormulai;
};

/**
 * Calculates the combination of base parameter value, param plus, and param rate.
 * This can be overridden if alternative calculations is desired.
 * @param {number} baseValue The base value of the parameter.
 * @param {number} paramPlus The flat bonus value of the parameter.
 * @param {number} paramRate The multiplier bonus value of the parameter.
 * @returns {number} The calculated result.
 */
Game_Battler.prototype.calculatePlusRate = function(baseValue, paramPlus, paramRate)
{
  // determine the modified buff rate.
  const paramFactor = ((paramRate + 100) / 100);

  // determine the modified base parameter.
  const paramBase = (baseValue + paramPlus);

  // remove the value of base param since it is added at the end.
  const result = (paramBase * paramFactor) - baseValue;

  // return result.
  return result;
};

/**
 * OVERWRITE Replaces the `maxTp()` function with our custom one that will respect
 * formulas and apply rates from tags, etc.
 * @returns {number}
 */
J.NATURAL.Aliased.Game_BattlerBase.set("maxTp", Game_Battler.prototype.maxTp);
Game_Battler.prototype.maxTp = function()
{
  // check to make sure we have custom max tp formulai.
  return this.actualMaxTp();
};

/**
 * Get the actual calculated max tp for this battler.
 * @returns {number}
 */
Game_Battler.prototype.actualMaxTp = function()
{
  // get the base max tp defined
  const baseParam = this.getBaseMaxTp();

  // get all bonuses to max tp from natural bonuses.
  const maxTpNaturalBonuses = this.maxTpNaturalBonuses();

  // return result.
  return (baseParam + maxTpNaturalBonuses);
};

/**
 * This is exclusively for access to the natural growth values, without the base max tp value added.
 * @returns {number}
 */
Game_Battler.prototype.maxTpNaturalBonuses = function()
{
  // get the base max tp for this battler.
  const baseParam = this.getBaseMaxTp();

  // return the calculated natural bonuses.
  return this.getMaxTpNaturalBonuses(baseParam);
};

/**
 * Gets all natural bonuses for max tp.
 * @param {number} baseParam The base max tp value.
 * @returns {number} The natural bonuses applied.
 */
Game_Battler.prototype.getMaxTpNaturalBonuses = function(baseParam)
{
  return 0;
};

/**
 * Gets all natural bonuses for max tp.
 * Enemies have only buffs.
 * @param {number} baseParam The base max tp value.
 * @returns {number} The natural bonuses applied.
 */
Game_Enemy.prototype.getMaxTpNaturalBonuses = function(baseParam)
{
  // destructure out the plus and rate structures for buffs.
  const [buffPlusStructure, buffRateStructure,,] = this.getRegexForMaxTp();

  // determine the buffs to the parameter.
  const maxTpBuff = this.getMaxTpBuff(baseParam, buffPlusStructure, buffRateStructure);

  // return the natural growth buffs currently applied.
  return maxTpBuff;
};

/**
 * Retrieves the four regular RegExps governing max tp buffs and growths.
 * @returns {[RegExp, RegExp, RegExp, RegExp]} The [buffplus, buffrate, growthplus, growthrate] regex structures.
 */
Game_Battler.prototype.getRegexForMaxTp = function()
{
  return [
    J.NATURAL.RegExp.MaxTechBuffPlus,
    J.NATURAL.RegExp.MaxTechBuffRate,
    J.NATURAL.RegExp.MaxTechGrowthPlus,
    J.NATURAL.RegExp.MaxTechGrowthRate,
  ];
};

/**
 * Get the current amount of max tp bonuses added from buffs.
 * @param {number} baseParam The base parameter value.
 * @param {RegExp} plusStructure The regex for the plus structure.
 * @param {RegExp} rateStructure The regex for the rate structure.
 * @returns {number}
 */
Game_Battler.prototype.getMaxTpBuff = function(baseParam, plusStructure, rateStructure)
{
  // determine buff plus for max tp.
  const buffPlus = this.naturalParamBuff(plusStructure, baseParam);

  // determine buff rate for max tp.
  const buffRate = this.naturalParamBuff(rateStructure, baseParam);

  // don't calculate if we don't have anything.
  if (!buffPlus && !buffRate) return 0;

  // return result.
  return this.calculatePlusRate(baseParam, buffPlus, buffRate);
};

/**
 * Gets the base max tp for this battler.
 * @returns {number}
 */
Game_Battler.prototype.getBaseMaxTp = function()
{
  return 0;
};
//#endregion Game_Battler