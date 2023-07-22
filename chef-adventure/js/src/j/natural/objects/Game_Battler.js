//region Game_Battler
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

//region properties
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
  this._j._natural._maxTpGrowthPlus = 0;

  /**
   * The permanent multiplier bonus for max tp.
   * @type {number}
   */
  this._j._natural._maxTpGrowthRate = 0;

  /**
   * The cache of the temporary flat bonus for max tp.
   * @type {number}
   */
  this._j._natural._maxTpBuffPlus = 0;

  /**
   * The cache of the temporary multiplier bonus for max tp.
   * @type {number}
   */
  this._j._natural._maxTpBuffRate = 0;

  /**
   * The permanent flat bonuses for each of the base parameters.
   * @type {number[]}
   */
  this._j._natural._bParamsGrowthPlus = [0, 0, 0, 0, 0, 0, 0, 0];

  /**
   * The permanent multiplier bonuses for each of the base parameters.
   * @type {number[]}
   */
  this._j._natural._bParamsGrowthRate = [0, 0, 0, 0, 0, 0, 0, 0];

  /**
   * The cache of temporary flat bonuses for each of the base parameters.
   * @type {number[]}
   */
  this._j._natural._bParamsBuffPlus = [0, 0, 0, 0, 0, 0, 0, 0];

  /**
   * The cache of temporary multiplier bonuses for each of the base parameters.
   * @type {number[]}
   */
  this._j._natural._bParamsBuffRate = [0, 0, 0, 0, 0, 0, 0, 0];

  /**
   * The permanent flat bonuses for each of the sp-parameters.
   * @type {number[]}
   */
  this._j._natural._sParamsGrowthPlus = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  /**
   * The permanent multiplier bonuses for each of the sp-parameters.
   * @type {number[]}
   */
  this._j._natural._sParamsGrowthRate = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  /**
   * The cache of temporary flat bonuses for each of the sp-parameters.
   * @type {number[]}
   */
  this._j._natural._sParamsBuffPlus = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  /**
   * The cache of temporary multiplier bonuses for each of the sp-parameters.
   * @type {number[]}
   */
  this._j._natural._sParamsBuffRate = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  /**
   * The permanent flat bonuses for each of the ex-parameters.
   * @type {number[]}
   */
  this._j._natural._xParamsGrowthPlus = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  /**
   * The permanent multiplier bonuses for each of the ex-parameters.
   * @type {number[]}
   */
  this._j._natural._xParamsGrowthRate = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  /**
   * The cache of temporary flat bonuses for each of the ex-parameters.
   * @type {number[]}
   */
  this._j._natural._xParamsBuffPlus = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  /**
   * The cache of temporary multiplier bonuses for each of the ex-parameters.
   * @type {number[]}
   */
  this._j._natural._xParamsBuffRate = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
};

//region max tp
/**
 * Gets the permanent flat bonus for max tp.
 * @returns {number}
 */
Game_Battler.prototype.maxTpGrowthPlus = function()
{
  return this._j._natural._maxTpGrowthPlus;
};

/**
 * Modifies the permanent flat bonus for max tp by a given amount.
 * @param {number} amount The amount to modify the bonus by.
 */
Game_Battler.prototype.modMaxTpGrowthPlus = function(amount)
{
  this._j._natural._maxTpGrowthPlus += amount;
};

/**
 * Gets the permanent multiplicative bonus for max tp.
 * @returns {number}
 */
Game_Battler.prototype.maxTpGrowthRate = function()
{
  return this._j._natural._maxTpGrowthRate;
};

/**
 * Modifies the permanent multiplicative bonus for max tp by a given amount.
 * @param {number} amount The amount to modify the bonus by.
 */
Game_Battler.prototype.modMaxTpGrowthRate = function(amount)
{
  this._j._natural._maxTpGrowthRate += amount;
};

/**
 * Gets the temporary flat bonus for max tp.
 * @returns {number}
 */
Game_Battler.prototype.maxTpBuffPlus = function()
{
  return this._j._natural._maxTpBuffPlus;
};

/**
 * Modifies the temporary flat bonus for max tp by a given amount.
 * @param {number} amount The amount to modify the bonus by.
 */
Game_Battler.prototype.setMaxTpBuffPlus = function(amount)
{
  this._j._natural._maxTpBuffPlus = amount;
};

/**
 * Gets the temporary multiplicative bonus for max tp.
 * @returns {number}
 */
Game_Battler.prototype.maxTpBuffRate = function()
{
  return this._j._natural._maxTpBuffRate;
};

/**
 * Modifies the temporary multiplicative bonus for max tp by a given amount.
 * @param {number} amount The amount to modify the bonus by.
 */
Game_Battler.prototype.setMaxTpBuffRate = function(amount)
{
  this._j._natural._maxTpBuffRate = amount;
};
//endregion max tp

//region b-params
/**
 * Gets the permanent flat bonus for a base parameter of the given id.
 * @param {number} paramId The id of the parameter.
 * @returns {number}
 */
Game_Battler.prototype.bParamGrowthPlus = function(paramId)
{
  return this._j._natural._bParamsGrowthPlus[paramId] ?? 0;
};

/**
 * Modifies the permanent flat bonus value of the given id by a given amount.
 * @param {number} paramId The id of the parameter.
 * @param {number} amount The amount to modify the parameter by.
 */
Game_Battler.prototype.modBparamGrowthPlus = function(paramId, amount)
{
  this._j._natural._bParamsGrowthPlus[paramId] += amount;
};

/**
 * Gets the permanent multiplier bonus for a base parameter of the given id.
 * @param {number} paramId The id of the parameter.
 * @returns {number}
 */
Game_Battler.prototype.bParamGrowthRate = function(paramId)
{
  return this._j._natural._bParamsGrowthRate[paramId] ?? 0;
};

/**
 * Modifies the permanent multiplier bonus value of the given id by a given amount.
 * @param {number} paramId The id of the parameter.
 * @param {number} amount The amount to modify the parameter by.
 */
Game_Battler.prototype.modBparamGrowthRate = function(paramId, amount)
{
  this._j._natural._bParamsGrowthRate[paramId] += amount;
};

/**
 * Gets the temporary flat bonus for a base parameter of the given id.
 * @param {number} paramId The id of the parameter.
 * @returns {number}
 */
Game_Battler.prototype.bParamBuffPlus = function(paramId)
{
  return this._j._natural._bParamsBuffPlus[paramId] ?? 0;
};

/**
 * Modifies the temporary flat bonus value of the given id by a given amount.
 * @param {number} paramId The id of the parameter.
 * @param {number} amount The amount to modify the parameter by.
 */
Game_Battler.prototype.setBparamBuffPlus = function(paramId, amount)
{
  this._j._natural._bParamsBuffPlus[paramId] = amount;
};

/**
 * Gets the temporary multiplier bonus for a base parameter of the given id.
 * @param {number} paramId The id of the parameter.
 * @returns {number}
 */
Game_Battler.prototype.bParamBuffRate = function(paramId)
{
  return this._j._natural._bParamsBuffRate[paramId] ?? 0;
};

/**
 * Modifies the temporary multiplier bonus value of the given id by a given amount.
 * @param {number} paramId The id of the parameter.
 * @param {number} amount The amount to modify the parameter by.
 */
Game_Battler.prototype.setBparamBuffRate = function(paramId, amount)
{
  this._j._natural._bParamsBuffRate[paramId] = amount;
};
//endregion b-params

//region s-params
/**
 * Gets the permanent flat bonus for a base parameter of the given id.
 * @param {number} paramId The id of the parameter.
 * @returns {number}
 */
Game_Battler.prototype.sParamGrowthPlus = function(paramId)
{
  return this._j._natural._sParamsGrowthPlus[paramId] ?? 0;
};

/**
 * Modifies the permanent flat bonus value of the given id by a given amount.
 * @param {number} paramId The id of the parameter.
 * @param {number} amount The amount to modify the parameter by.
 */
Game_Battler.prototype.modSparamGrowthPlus = function(paramId, amount)
{
  this._j._natural._sParamsGrowthPlus[paramId] += amount;
};

/**
 * Gets the permanent multiplier bonus for a base parameter of the given id.
 * @param {number} paramId The id of the parameter.
 * @returns {number}
 */
Game_Battler.prototype.sParamGrowthRate = function(paramId)
{
  return this._j._natural._sParamsGrowthRate[paramId] ?? 0;
};

/**
 * Modifies the permanent multiplier bonus value of the given id by a given amount.
 * @param {number} paramId The id of the parameter.
 * @param {number} amount The amount to modify the parameter by.
 */
Game_Battler.prototype.modSparamGrowthRate = function(paramId, amount)
{
  this._j._natural._sParamsGrowthRate[paramId] += amount;
};

/**
 * Gets the temporary flat bonus for a base parameter of the given id.
 * @param {number} paramId The id of the parameter.
 * @returns {number}
 */
Game_Battler.prototype.sParamBuffPlus = function(paramId)
{
  return this._j._natural._sParamsBuffPlus[paramId] ?? 0;
};

/**
 * Modifies the temporary flat bonus value of the given id by a given amount.
 * @param {number} paramId The id of the parameter.
 * @param {number} amount The amount to modify the parameter by.
 */
Game_Battler.prototype.setSparamBuffPlus = function(paramId, amount)
{
  this._j._natural._sParamsBuffPlus[paramId] = amount;
};

/**
 * Gets the temporary multiplier bonus for a base parameter of the given id.
 * @param {number} paramId The id of the parameter.
 * @returns {number}
 */
Game_Battler.prototype.sParamBuffRate = function(paramId)
{
  return this._j._natural._sParamsBuffRate[paramId] ?? 0;
};

/**
 * Modifies the temporary multiplier bonus value of the given id by a given amount.
 * @param {number} paramId The id of the parameter.
 * @param {number} amount The amount to modify the parameter by.
 */
Game_Battler.prototype.setSparamBuffRate = function(paramId, amount)
{
  this._j._natural._sParamsBuffRate[paramId] = amount;
};
//endregion s-params

//region x-params
/**
 * Gets the permanent flat bonus for a base parameter of the given id.
 * @param {number} paramId The id of the parameter.
 * @returns {number}
 */
Game_Battler.prototype.xParamGrowthPlus = function(paramId)
{
  return this._j._natural._xParamsGrowthPlus[paramId] ?? 0;
};

/**
 * Modifies the permanent flat bonus value of the given id by a given amount.
 * @param {number} paramId The id of the parameter.
 * @param {number} amount The amount to modify the parameter by.
 */
Game_Battler.prototype.modXparamGrowthPlus = function(paramId, amount)
{
  this._j._natural._xParamsGrowthPlus[paramId] += amount;
};

/**
 * Gets the permanent multiplier bonus for a base parameter of the given id.
 * @param {number} paramId The id of the parameter.
 * @returns {number}
 */
Game_Battler.prototype.xParamGrowthRate = function(paramId)
{
  return this._j._natural._xParamsGrowthRate[paramId] ?? 0;
};

/**
 * Modifies the permanent multiplier bonus value of the given id by a given amount.
 * @param {number} paramId The id of the parameter.
 * @param {number} amount The amount to modify the parameter by.
 */
Game_Battler.prototype.modXparamGrowthRate = function(paramId, amount)
{
  this._j._natural._xParamsGrowthRate[paramId] += amount;
};

/**
 * Gets the temporary flat bonus for a x parameter of the given id.
 * @param {number} paramId The id of the parameter.
 * @returns {number}
 */
Game_Battler.prototype.xParamBuffPlus = function(paramId)
{
  return this._j._natural._xParamsBuffPlus[paramId] ?? 0;
};

/**
 * Modifies the temporary flat bonus value of the given id by a given amount.
 * @param {number} paramId The id of the parameter.
 * @param {number} amount The amount to modify the parameter by.
 */
Game_Battler.prototype.setXparamBuffPlus = function(paramId, amount)
{
  this._j._natural._xParamsBuffPlus[paramId] = amount;
};

/**
 * Gets the temporary multiplier bonus for a x parameter of the given id.
 * @param {number} paramId The id of the parameter.
 * @returns {number}
 */
Game_Battler.prototype.xParamBuffRate = function(paramId)
{
  return this._j._natural._xParamsBuffRate[paramId] ?? 0;
};

/**
 * Modifies the temporary multiplier bonus value of the given id by a given amount.
 * @param {number} paramId The id of the parameter.
 * @param {number} amount The amount to modify the parameter by.
 */
Game_Battler.prototype.setXparamBuffRate = function(paramId, amount)
{
  this._j._natural._xParamsBuffRate[paramId] = amount;
};
//endregion x-params
//endregion properties

/**
 * Refreshes both plus/rate buffs for all parameters.
 */
Game_Battler.prototype.refreshAllParameterBuffs = function()
{
  // clear all the current buffs.
  this.clearAllParameterBuffs();

  // refresh them one by one.
  this.refreshMaxTpBuffs();
  this.refreshBParamBuffs();
  this.refreshSParamBuffs();
  this.refreshXParamBuffs();
};

/**
 * Clears all parameter buffs on this battler.
 */
Game_Battler.prototype.clearAllParameterBuffs = function()
{
  // zero everything out.
  this._j._natural._maxTpBuffPlus = 0;
  this._j._natural._maxTpBuffRate = 0;
  this._j._natural._bParamsBuffPlus = [0, 0, 0, 0, 0, 0, 0, 0];
  this._j._natural._bParamsBuffRate = [0, 0, 0, 0, 0, 0, 0, 0];
  this._j._natural._sParamsBuffPlus = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this._j._natural._sParamsBuffRate = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this._j._natural._xParamsBuffPlus = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this._j._natural._xParamsBuffRate = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
};

/**
 * Refreshes both max tp plus/rate buffs.
 */
Game_Battler.prototype.refreshMaxTpBuffs = function()
{
  // get the base max tp for this battler.
  const baseParam = this.getBaseMaxTp();

  // destructure out the plus and rate structures for buffs.
  const [plusStructure, rateStructure,,] = this.getRegexForMaxTp();

  // determine buff plus for this param.
  const buffPlus = this.naturalParamBuff(plusStructure, baseParam);

  // determine buff rate for this param.
  const buffRate = (this.naturalParamBuff(rateStructure, baseParam) / 100);

  // set the max tp buff flat modifier to this amount.
  this.setMaxTpBuffPlus(buffPlus);

  // set the max tp buff rate modifier to this amount.
  this.setMaxTpBuffRate(buffRate);
};

/**
 * Refreshes both base parameter plus/rate buffs.
 */
J.NATURAL.Aliased.Game_Battler.set('paramBase', Game_Battler.prototype.paramBase);
Game_Battler.prototype.refreshBParamBuffs = function()
{
  // a collection of known base parameter ids.
  const paramIds = Game_BattlerBase.knownBaseParameterIds();

  // iterate over all of the known base parameter ids.
  paramIds.forEach(paramId =>
  {
    // get original value.
    const baseParam = J.NATURAL.Aliased.Game_Battler.get('paramBase').call(this, paramId);

    // determine the structure for this parameter.
    const [plusStructure, rateStructure] = this.getRegexByParamId(paramId);

    // determine buff plus for this param.
    const buffPlus = this.naturalParamBuff(plusStructure, baseParam);

    // determine buff rate for this param.
    const buffRate = (this.naturalParamBuff(rateStructure, baseParam) / 100);

    // set the b-param buff flat modifier to this amount.
    this.setBparamBuffPlus(paramId, buffPlus);

    // set the b-param buff rate modifier to this amount.
    this.setBparamBuffRate(paramId, buffRate);
  }, this);
};

/**
 * Refreshes both ex-parameter plus/rate buffs.
 */
J.NATURAL.Aliased.Game_Battler.set('xparam', Game_Battler.prototype.xparam);
Game_Battler.prototype.refreshXParamBuffs = function()
{
  // a collection of known ex parameter ids.
  const paramIds = Game_BattlerBase.knownExParameterIds();

  // iterate over all of the known ex parameter ids.
  paramIds.forEach(paramId =>
  {
    // get original value.
    const baseParam = J.NATURAL.Aliased.Game_Battler.get('xparam').call(this, paramId);

    // determine the structure for this parameter.
    const [plusStructure, rateStructure] = this.getRegexByExParamId(paramId);

    // determine buff plus for this param- divided by 100 because its fractional.
    const buffPlus = (this.naturalParamBuff(plusStructure, baseParam) / 100);

    // determine buff rate for this param.
    const buffRate = (this.naturalParamBuff(rateStructure, baseParam) / 100);

    // set the x-param buff flat modifier to this amount.
    this.setXparamBuffPlus(paramId, buffPlus);

    // set the x-param buff rate modifier to this amount.
    this.setXparamBuffRate(paramId, buffRate);
  }, this);
};

/**
 * Refreshes both sp-parameter plus/rate buffs.
 */
J.NATURAL.Aliased.Game_Battler.set('sparam', Game_Battler.prototype.sparam);
Game_Battler.prototype.refreshSParamBuffs = function()
{
  // a collection of known sp parameter ids.
  const paramIds = Game_BattlerBase.knownSpParameterIds();

  // iterate over all of the known sp parameter ids.
  paramIds.forEach(paramId =>
  {
    // get original value.
    const baseParam = J.NATURAL.Aliased.Game_Battler.get('sparam').call(this, paramId);

    // determine the structure for this parameter.
    const [plusStructure, rateStructure] = this.getRegexBySpParamId(paramId);

    // determine buff plus for this param- divided by 100 because its fractional.
    const buffPlus = (this.naturalParamBuff(plusStructure, baseParam) / 100);

    // determine buff rate for this param.
    const buffRate = (this.naturalParamBuff(rateStructure, baseParam) / 100);

    // set the s-param buff flat modifier to this amount.
    this.setSparamBuffPlus(paramId, buffPlus);

    // set the s-param buff rate modifier to this amount.
    this.setSparamBuffRate(paramId, buffRate);
  }, this);
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
        const result = structure.exec(line);

        // make sure we had a real formula first.
        if (result)
        {
          // shove it into the formula container.
          paramGrowthFormulai.push(result[1]);
        }
      });
    }
  });

  // return the formula container.
  return paramGrowthFormulai;
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
 * Gets all natural growths for this base parameter.
 * @param {number} paramId The parameter id in question.
 * @param {number} baseParam The base parameter.
 * @returns {number} The added value of the `baseParam` + `paramBuff` + `paramGrowth`.
 */
Game_Battler.prototype.getParamBaseNaturalBonuses = function(paramId, baseParam)
{
  // this is intended to be implemented in subclasses.
  console.warn(`Leveraged a Game_Battler subclass that isn't recognized by this plugin.`, this)
  return 0;
};

/**
 * Gets the temporary buff for a given base param for this battler.
 * @param {number} paramId The b param id.
 * @param {number} baseParam The base value of the parameter in question.
 * @returns {number} The calculated buff amount for this parameter.
 */
Game_Battler.prototype.calculateBParamBuff = function(paramId, baseParam)
{
  // get the plus rate for this param.
  const buffPlus = this.bParamBuffPlus(paramId);

  // get the plus rate for this param.
  const buffRate = this.bParamBuffRate(paramId) / 100;

  // calculate the result into a variable for debugging.
  const result = (baseParam * buffRate) + buffPlus;

  // return result.
  return result;
};

/**
 * Gets the calculated buff for a given ex-param for this battler.
 * @param {number} paramId The ex param id.
 * @param {number} baseParam The base value of the parameter in question.
 * @returns {number} The calculated buff amount for this parameter.
 */
Game_Battler.prototype.calculateExParamBuff = function(paramId, baseParam)
{
  // determine buff plus for this param.
  const buffPlus = (this.xParamBuffPlus() / 100);

  // determine buff rate for this param.
  const buffRate = (this.xParamBuffRate() / 100);

  // don't calculate if we don't have anything.
  if (!buffPlus && !buffRate) return 0;

  // return result.
  return this.calculatePlusRate(baseParam, buffPlus, buffRate);
};

/**
 * Gets the calculated buff for a given sp-param for this battler.
 * @param {number} paramId The sp param id.
 * @param {number} baseParam The base value of the parameter in question.
 * @returns {number} The calculated buff amount for this parameter.
 */
Game_Battler.prototype.calculateSpParamBuff = function(paramId, baseParam)
{
  // determine buff plus for this param.
  const buffPlus = (this.sParamBuffPlus() / 100);

  // determine buff rate for this param.
  const buffRate = (this.sParamBuffRate() / 100);

  // don't calculate if we don't have anything.
  if (!buffPlus && !buffRate) return 0;

  // return result.
  return this.calculatePlusRate(baseParam, buffPlus, buffRate);
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

//region max tp
/**
 * OVERWRITE Replaces the `maxTp()` function with our custom one that will respect
 * formulas and apply rates from tags, etc.
 * @returns {number}
 */
Game_Battler.prototype.maxTp = function()
{
  // calculate our actual max tp.
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
  // determine the buffs to the parameter.
  const maxTpBuff = this.getMaxTpBuff(baseParam);

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
 * @returns {number}
 */
Game_Battler.prototype.getMaxTpBuff = function(baseParam)
{
  // determine buff plus for max tp.
  const buffPlus = this.maxTpBuffPlus();

  // determine buff rate for max tp.
  const buffRate = this.maxTpBuffRate();

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
//endregion max tp
//endregion Game_Battler