//region Game_Battler
/**
 * Extends `.initNaturalGrowthParameters()` to include the new critical damage parameters as growth-ready.
 */
J.CRIT.Aliased.Game_Battler.set("initNaturalGrowthParameters", Game_Battler.prototype.initNaturalGrowthParameters);
Game_Battler.prototype.initNaturalGrowthParameters = function()
{
  // short circuit if not using the natural growths plugin.
  if (!J.NATURAL) return;

  // perform original logic.
  J.CRIT.Aliased.Game_Battler.get("initNaturalGrowthParameters").call(this);

  /**
   * The J object where all my additional properties live.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with natural growth.
   */
  this._j._natural ||= {};

  /**
   * The permanent flat bonus for CDM.
   * @type {number}
   */
  this._j._natural._cdmPlus = 0;

  /**
   * The permanent multiplier bonus for CDR.
   * @type {number}
   */
  this._j._natural._cdmRate = 0;

  /**
   * The permanent flat bonus for CDM.
   * @type {number}
   */
  this._j._natural._cdrPlus = 0;

  /**
   * The permanent multiplier bonus for CDR.
   * @type {number}
   */
  this._j._natural._cdrRate = 0;
};

//region properties
/**
 * Gets the permanent flat bonus for CDM.
 * @returns {number}
 */
Game_Battler.prototype.cdmPlus = function()
{
  return this._j._natural._cdmPlus;
};

/**
 * Modifies the permanent flat bonus for CDM.
 * @param {number} amount The amount to modify the bonus by.
 */
Game_Battler.prototype.modCdmPlus = function(amount)
{
  this._j._natural._cdmPlus += amount;
};

/**
 * Gets the permanent multiplicative bonus for CDM.
 * @returns {number}
 */
Game_Battler.prototype.cdmRate = function()
{
  return this._j._natural._cdmRate;
};

/**
 * Modifies the permanent multiplicative bonus for CDM.
 * @param {number} amount The amount to modify the bonus by.
 */
Game_Battler.prototype.modCdmRate = function(amount)
{
  this._j._natural._cdmRate += amount;
};

/**
 * Gets the current growths applied to CDR plus.
 * @returns {number}
 */
Game_Battler.prototype.cdrPlus = function()
{
  return this._j._natural._cdrPlus;
};

/**
 * Modifies the permanent flat bonus for CDR.
 * @param {number} amount The amount to modify the bonus by.
 */
Game_Battler.prototype.modCdrPlus = function(amount)
{
  this._j._natural._cdrPlus += amount;
};

/**
 * Gets the current growths applied to CDR rate.
 * @returns {number}
 */
Game_Battler.prototype.cdrRate = function()
{
  return this._j._natural._cdrRate;
};

/**
 * Modifies the permanent multiplicative bonus for CDR.
 * @param {number} amount The amount to modify the bonus by.
 */
Game_Battler.prototype.modCdrRate = function(amount)
{
  this._j._natural._cdrRate += amount;
};
//endregion properties

/**
 * Gets the base multiplier for this battler's critical hits.
 * @returns {number}
 */
Game_Battler.prototype.baseCriticalMultiplier = function()
{
  // grab everything with notes.
  const objectsToCheck = this.getAllNotes();

  // sum together all the base CDM tags.
  const baseCriticalMultiplier = RPGManager.getSumFromAllNotesByRegex(
    objectsToCheck,
    J.CRIT.RegExp.CritDamageMultiplierBase);

  // calculate the factor for the CDM.
  const baseCdmFactor = baseCriticalMultiplier / 100;

  // return the factor.
  return baseCdmFactor;
};

/**
 * Calculates this battler's current critical damage multiplier.
 * @returns {number}
 */
Game_Battler.prototype.criticalDamageMultiplier = function()
{
  // sum together all cdm values across the notes.
  const cdmBonuses = this.getCriticalDamageMultiplier();

  // grab all natural bonuses for cdm.
  const cdmNaturalBonuses = this.cdmNaturalBonuses();

  // grab all sdp bonuses for cdm.
  const cdmSdpBonuses = this.critSdpBonuses(0, this.baseCriticalMultiplier());

  // calculate the factor for the CDM.
  const cdmFactor = (cdmBonuses + cdmNaturalBonuses + cdmSdpBonuses) / 100;

  // return the factor.
  return cdmFactor;
};

/**
 * Gets the sum of all critical damage multipliers from all notes.
 * @returns {number}
 */
Game_Battler.prototype.getCriticalDamageMultiplier = function()
{
  // grab everything with notes.
  const objectsToCheck = this.getAllNotes();

  // sum together all cdm values across the notes.
  const cdmBonuses = RPGManager.getSumFromAllNotesByRegex(
    objectsToCheck,
    J.CRIT.RegExp.CritDamageMultiplier);

  // return the sum of all bonuses.
  return cdmBonuses;
};

/**
 * Gets all natural bonuses for cdm, excluding the base cdm itself.
 * @returns {number}
 */
Game_Battler.prototype.cdmNaturalBonuses = function()
{
  // short circuit if we aren't using the natural growths plugin.
  if (!J.NATURAL) return 0;

  // calculate the natural buffs for this parameter.
  const cdmBuffs = this.cdmNaturalBuffs();

  // calculate the natural growths for this parameter.
  const cdmGrowths = this.cdmNaturalGrowths();

  // sum together the two natural bonuses.
  return (cdmBuffs + cdmGrowths);
};

/**
 * Calculates the buffs for critical damage multipliers.
 * @returns {number}
 */
Game_Battler.prototype.cdmNaturalBuffs = function()
{
  // grab everything with notes.
  const objectsToCheck = this.getAllNotes();

  // grab the base parameter value.
  const baseParam = this.baseCriticalMultiplier();

  // sum together all the cdm buff pluses across the notes.
  const cdmBuffPlus = RPGManager.getResultsFromAllNotesByRegex(
    objectsToCheck,
    J.CRIT.RegExp.CritDamageMultiplierBuffPlus,
    baseParam,
    this);

  // sum together all the cdm buff rates across the notes.
  const cdmBuffRate = RPGManager.getResultsFromAllNotesByRegex(
    objectsToCheck,
    J.CRIT.RegExp.CritDamageMultiplierBuffRate,
    baseParam,
    this);

  // don't calculate if we don't have anything.
  if (!cdmBuffPlus && !cdmBuffRate) return 0;

  // return result.
  return this.calculatePlusRate(baseParam, cdmBuffPlus, cdmBuffRate);
};

/**
 * Calculates the growths associated with critical damage multipliers.
 * @returns {number}
 */
Game_Battler.prototype.cdmNaturalGrowths = function()
{
  // grab the base param for calculations.
  const baseCdm = this.baseCriticalMultiplier();

  // get the current plus growth for cdm.
  const growthPlus = this.cdmPlus();

  // get the current rate growth for cdm.
  const growthRate = this.cdmRate();

  // don't calculate if we don't have anything.
  if (!growthPlus && !growthRate) return 0;

  // calculate the result.
  return this.calculatePlusRate(baseCdm, growthPlus, growthRate);
};

/**
 * Gets all SDP bonuses for cdm.
 * @returns {number}
 */
Game_Battler.prototype.critSdpBonuses = function()
{
  return 0;
};

/**
 * Gets the base reduction for this battler's critical hits.
 * @returns {number}
 */
Game_Battler.prototype.baseCriticalReduction = function()
{
  // grab everything with notes.
  const objectsToCheck = this.getAllNotes();

  // sum together all the base CDR tags.
  const baseCriticalReduction = RPGManager.getSumFromAllNotesByRegex(
    objectsToCheck,
    J.CRIT.RegExp.CritDamageReductionBase);

  // calculate the factor for the CDR.
  const baseCdmFactor = baseCriticalReduction / 100;

  // return the factor.
  return baseCdmFactor;
};

/**
 * Gets the reduction factor for when this battler receives a critical hit.
 * @returns {number} The CDR factor for this battler.
 */
Game_Battler.prototype.criticalDamageReduction = function()
{
  // sum together all cdr values across the notes.
  const cdrBonuses = this.getCriticalDamageReduction();

  // grab all natural bonuses for cdr.
  const cdrNaturalBonuses = this.cdrNaturalBonuses();

  // grab all sdp bonuses for cdm.
  const cdrSdpBonuses = this.critSdpBonuses(1, this.baseCriticalReduction());

  // calculate the factor for the CDR.
  const cdrFactor = (cdrBonuses + cdrNaturalBonuses + cdrSdpBonuses) / 100;

  // return the factor.
  return cdrFactor;
};

/**
 * Gets the sum of all critical damage reductions from all notes.
 * @returns {number}
 */
Game_Battler.prototype.getCriticalDamageReduction = function()
{
  // grab everything with notes.
  const objectsToCheck = this.getAllNotes();

  // sum together all cdm values across the notes.
  const cdrBonuses = RPGManager.getSumFromAllNotesByRegex(
    objectsToCheck,
    J.CRIT.RegExp.CritDamageReduction);

  // return the sum of all bonuses.
  return cdrBonuses;
};

/**
 * Gets all natural bonuses for cdr, excluding the base cdr itself.
 * @returns {number}
 */
Game_Battler.prototype.cdrNaturalBonuses = function()
{
  // short circuit if we aren't using the natural growths plugin.
  if (!J.NATURAL) return 0;

  // calculate the natural buffs for this parameter.
  const cdmBuffs = this.cdrNaturalBuffs();

  // calculate the natural growths for this parameter.
  const cdmGrowths = this.cdrNaturalGrowths();

  // sum together the two natural bonuses.
  return (cdmBuffs + cdmGrowths);
};

/**
 * Calculates the buffs for critical damage reductions.
 * @returns {number}
 */
Game_Battler.prototype.cdrNaturalBuffs = function()
{
  // grab everything with notes.
  const objectsToCheck = this.getAllNotes();

  // grab the base parameter value.
  const baseParam = this.baseCriticalReduction();

  // sum together all the cdm buff pluses across the notes.
  const cdrBuffPlus = RPGManager.getResultsFromAllNotesByRegex(
    objectsToCheck,
    J.CRIT.RegExp.CritDamageReductionBuffPlus,
    baseParam,
    this);

  // sum together all the cdm buff rates across the notes.
  const cdrBuffRate = RPGManager.getResultsFromAllNotesByRegex(
    objectsToCheck,
    J.CRIT.RegExp.CritDamageReductionBuffRate,
    baseParam,
    this);

  // don't calculate if we don't have anything.
  if (!cdrBuffPlus && !cdrBuffRate) return 0;

  // grab the base param for calculations.
  const baseCdr = this.baseCriticalReduction();

  // return result.
  return this.calculatePlusRate(baseCdr, cdrBuffPlus, cdrBuffRate);
};

/**
 * Calculates the growths associated with critical damage reductions.
 * @returns {number}
 */
Game_Battler.prototype.cdrNaturalGrowths = function()
{
  // grab the base param for calculations.
  const baseCdr = this.baseCriticalReduction();

  // get the current plus growth for cdr.
  const growthPlus = this.cdrPlus();

  // get the current rate growth for cdr.
  const growthRate = this.cdrRate();

  // don't calculate if we don't have anything.
  if (!growthPlus && !growthRate) return 0;

  // calculate the result.
  return this.calculatePlusRate(baseCdr, growthPlus, growthRate);
};
//endregion Game_Battler