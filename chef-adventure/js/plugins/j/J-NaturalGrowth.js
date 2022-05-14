//#region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 NATURAL] Enables level-based growth of all parameters.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @help
 * ==============================================================================
 * This plugin enables growth of all parameters parameters via level.
 *
 * Use:
 *  <(PARAM)(BUFF|GROWTH)(PLUS|RATE):[FORMULAIC_AMOUNT]>
 *
 * Example:
 *  <hrgGrowthRate:[5]>
 *  gain a permanent 5 HRG per level up.
 *
 * Example:
 *  <exrBuffPlus:[25]>
 *  gain a flat 25 EXR while this tag is applied to this battler.
 *
 * Example:
 *  <atkGrowthPlus:[a.level * 3]>
 *  gain (the battler's leve multiplied by 3) attack per level.
 *  this would result in gaining an ever-increasing amount of attack per level.
 * ==============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release.
 * ==============================================================================
 * @param actorBaseTp
 * @type number
 * @min 0
 * @text Actor Base TP Max
 * @desc The base TP for actors is this amount. Any formulai add onto this.
 * @default 0
 *
 * @param enemyBaseTp
 * @type number
 * @min 0
 * @text Enemy Base TP Max
 * @desc The base TP for enemies is this amount. Any formulai add onto this.
 * @default 100
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.NATURAL = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.NATURAL.Metadata = {
  /**
   * The name of this plugin.
   */
  Name: `J-NaturalGrowth`,

  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

J.NATURAL.PluginParameters = PluginManager.parameters(J.NATURAL.Metadata.Name);
J.NATURAL.Metadata.BaseTpMaxActors = Number(J.NATURAL.PluginParameters['actorBaseTp']);
J.NATURAL.Metadata.BaseTpMaxEnemies = Number(J.NATURAL.PluginParameters['enemyBaseTp']);


/**
 * A collection of all aliased methods for this plugin.
 */
J.NATURAL.Aliased = {
  Game_Actor: new Map(),
  Game_Battler: new Map(),
  Game_Enemy: new Map(),
};

/**
 * All regular expressions used by this plugin.
 */
J.NATURAL.RegExp = {
  // base parameters.
  // base parameter buffs flat (temporary).
  MaxLifeBuffPlus: /<mhpBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  MaxMagiBuffPlus: /<mmpBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  PowerBuffPlus: /<atkBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  DefenseBuffPlus: /<defBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  ForceBuffPlus: /<matBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  ResistBuffPlus: /<mdfBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  SpeedBuffPlus: /<agiBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  LuckBuffPlus: /<lukBuffPlus:\[([+\-*/ ().\w]+)]>/gi,

  // base parameter buffs rate (temporary).
  MaxLifeBuffRate: /<mhpBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  MaxMagiBuffRate: /<mmpBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  PowerBuffRate: /<atkBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  DefenseBuffRate: /<defBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  ForceBuffRate: /<matBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  ResistBuffRate: /<mdfBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  SpeedBuffRate: /<agiBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  LuckBuffRate: /<lukBuffRate:\[([+\-*/ ().\w]+)]>/gi,

  // base parameter growths flat (permanent)
  MaxLifeGrowthPlus: /<mhpGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  MaxMagiGrowthPlus: /<mmpGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  PowerGrowthPlus: /<atkGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  DefenseGrowthPlus: /<defGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  ForceGrowthPlus: /<matGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  ResistGrowthPlus: /<mdfGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  SpeedGrowthPlus: /<agiGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  LuckGrowthPlus: /<lukGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,

  // base parameter growths rate (permanent)
  MaxLifeGrowthRate: /<mhpGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  MaxMagiGrowthRate: /<mmpGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  PowerGrowthRate: /<atkGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  DefenseGrowthRate: /<defGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  ForceGrowthRate: /<matGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  ResistGrowthRate: /<mdfGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  SpeedGrowthRate: /<agiGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  LuckGrowthRate: /<lukGrowthRate:\[([+\-*/ ().\w]+)]>/gi,

  // ex parameters.
  // ex parameter buffs flat (temporary).
  HitBuffPlus: /<hitBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  EvadeBuffPlus: /<evaBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  CritChanceBuffPlus: /<criBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  CritEvadeBuffPlus: /<cevBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  MagiEvadeBuffPlus: /<mevBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  MagiReflectBuffPlus: /<mrfBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  CounterBuffPlus: /<cntBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  LifeRegenBuffPlus: /<hrgBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  MagiRegenBuffPlus: /<mrgBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  TechRegenBuffPlus: /<trgBuffPlus:\[([+\-*/ ().\w]+)]>/gi,

  // ex parameter buffs rate (temporary).
  HitBuffRate: /<hitBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  EvadeBuffRate: /<evaBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  CritChanceBuffRate: /<criBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  CritEvadeBuffRate: /<cevBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  MagiEvadeBuffRate: /<mevBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  MagiReflectBuffRate: /<mrfBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  CounterBuffRate: /<cntBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  LifeRegenBuffRate: /<hrgBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  MagiRegenBuffRate: /<mrgBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  TechRegenBuffRate: /<trgBuffRate:\[([+\-*/ ().\w]+)]>/gi,

  // ex parameter growths flat (permanent)
  HitGrowthPlus: /<hitGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  EvadeGrowthPlus: /<evaGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  CritChanceGrowthPlus: /<criGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  CritEvadeGrowthPlus: /<cevGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  MagiEvadeGrowthPlus: /<mevGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  MagiReflectGrowthPlus: /<mrfGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  CounterGrowthPlus: /<cntGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  LifeRegenGrowthPlus: /<hrgGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  MagiRegenGrowthPlus: /<mrgGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  TechRegenGrowthPlus: /<trgGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,

  // ex parameter growths rate (permanent)
  HitGrowthRate: /<hitGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  EvadeGrowthRate: /<evaGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  CritChanceGrowthRate: /<criGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  CritEvadeGrowthRate: /<cevGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  MagiEvadeGrowthRate: /<mevGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  MagiReflectGrowthRate: /<mrfGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  CounterGrowthRate: /<cntGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  LifeRegenGrowthRate: /<hrgGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  MagiRegenGrowthRate: /<mrgGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  TechRegenGrowthRate: /<trgGrowthRate:\[([+\-*/ ().\w]+)]>/gi,

  // sp parameters.
  // sp parameter buffs flat (temporary).
  AggroBuffPlus: /<tgrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  ParryBuffPlus: /<grdBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  HealingBuffPlus: /<recBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  ItemFxBuffPlus: /<phaBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  MagiCostRateBuffPlus: /<mcrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  TechCostRateBuffPlus: /<tcrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  PhysDmgRateBuffPlus: /<pdrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  MagiDmgRateBuffPlus: /<mdrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  FloorDmgRateBuffPlus: /<fdrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  ExpGainRateBuffPlus: /<exrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,

  // sp parameter buffs rate (temporary).
  AggroBuffRate: /<tgrBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  ParryBuffRate: /<grdBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  HealingBuffRate: /<recBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  ItemFxBuffRate: /<phaBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  MagiCostRateBuffRate: /<mcrBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  TechCostRateBuffRate: /<tcrBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  PhysDmgRateBuffRate: /<pdrBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  MagiDmgRateBuffRate: /<mdrBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  FloorDmgRateBuffRate: /<fdrBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  ExpGainRateBuffRate: /<exrBuffRate:\[([+\-*/ ().\w]+)]>/gi,

  // sp parameter growths flat (permanent).
  AggroGrowthPlus: /<tgrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  ParryGrowthPlus: /<grdGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  HealingGrowthPlus: /<recGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  ItemFxGrowthPlus: /<phaGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  MagiCostRateGrowthPlus: /<mcrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  TechCostRateGrowthPlus: /<tcrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  PhysDmgRateGrowthPlus: /<pdrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  MagiDmgRateGrowthPlus: /<mdrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  FloorDmgRateGrowthPlus: /<fdrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  ExpGainRateGrowthPlus: /<exrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,

  // sp parameter buffs rate (permanent).
  AggroGrowthRate: /<tgrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  ParryGrowthRate: /<grdGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  HealingGrowthRate: /<recGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  ItemFxGrowthRate: /<phaGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  MagiCostRateGrowthRate: /<mcrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  TechCostRateGrowthRate: /<tcrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  PhysDmgRateGrowthRate: /<pdrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  MagiDmgRateGrowthRate: /<mdrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  FloorDmgRateGrowthRate: /<fdrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
  ExpGainRateGrowthRate: /<exrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,

  // additionally supported parameters.
  // TP-related parameters.
  MaxTechGrowth: /<mtpGrowth:\[([+\-*/ ().\w]+)]>/gi,
  MaxTechRate: /<mtpRate:\[([+\-*/ ().\w]+)]>/gi,
};
//#endregion Introduction

//#region Game objects
//#region Game_Actor
J.NATURAL.Aliased.Game_Actor.set('initMembers', Game_Actor.prototype.initMembers);
Game_Actor.prototype.initMembers = function()
{
  // perform original logic.
  J.NATURAL.Aliased.Game_Actor.get('initMembers').call(this);

  // initialize the natural parameter collections.
  this.initNaturalParams();
};

/**
 * Initializes the natural growth parameters for this actor.
 */
Game_Actor.prototype.initNaturalParams = function()
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
   * The permanent flat bonuses for each of the base parameters.
   * @type {number[]}
   */
  this._j._natural._bParamsPlus = [  0,   0,   0,   0,   0,   0,   0,   0];

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
 * Gets the permanent flat bonus for a base parameter of the given id.
 * @param {number} paramId The id of the parameter.
 * @returns {number}
 */
Game_Actor.prototype.bParamPlus = function(paramId)
{
  if (!this._j._natural)
  {
    this.initNaturalParams();
  }

  return this._j._natural._bParamsPlus[paramId] ?? 0;
};

/**
 * Modifies the permanent flat bonus value of the given id by a given amount.
 * @param {number} paramId The id of the parameter.
 * @param {number} amount The amount to modify the parameter by.
 */
Game_Actor.prototype.modBparamPlus = function(paramId, amount)
{
  this._j._natural._bParamsPlus[paramId] += amount;
};

/**
 * Gets the permanent multiplier bonus for a base parameter of the given id.
 * @param {number} paramId The id of the parameter.
 * @returns {number}
 */
Game_Actor.prototype.bParamRate = function(paramId)
{
  if (!this._j._natural)
  {
    this.initNaturalParams();
  }

  return this._j._natural._bParamsRate[paramId] ?? 0;
};

/**
 * Modifies the permanent multiplier bonus value of the given id by a given amount.
 * @param {number} paramId The id of the parameter.
 * @param {number} amount The amount to modify the parameter by.
 */
Game_Actor.prototype.modBparamRate = function(paramId, amount)
{
  this._j._natural._bParamsRate[paramId] += amount;
};

/**
 * Gets the permanent flat bonus for a base parameter of the given id.
 * @param {number} paramId The id of the parameter.
 * @returns {number}
 */
Game_Actor.prototype.sParamPlus = function(paramId)
{
  if (!this._j._natural)
  {
    this.initNaturalParams();
  }

  return this._j._natural._sParamsPlus[paramId] ?? 0;
};

/**
 * Modifies the permanent flat bonus value of the given id by a given amount.
 * @param {number} paramId The id of the parameter.
 * @param {number} amount The amount to modify the parameter by.
 */
Game_Actor.prototype.modSparamPlus = function(paramId, amount)
{
  this._j._natural._sParamsPlus[paramId] += amount;
};

/**
 * Gets the permanent multiplier bonus for a base parameter of the given id.
 * @param {number} paramId The id of the parameter.
 * @returns {number}
 */
Game_Actor.prototype.sParamRate = function(paramId)
{
  if (!this._j._natural)
  {
    this.initNaturalParams();
  }

  return this._j._natural._sParamsRate[paramId] ?? 0;
};

/**
 * Modifies the permanent multiplier bonus value of the given id by a given amount.
 * @param {number} paramId The id of the parameter.
 * @param {number} amount The amount to modify the parameter by.
 */
Game_Actor.prototype.modSparamRate = function(paramId, amount)
{
  this._j._natural._sParamsRate[paramId] += amount;
};

/**
 * Gets the permanent flat bonus for a base parameter of the given id.
 * @param {number} paramId The id of the parameter.
 * @returns {number}
 */
Game_Actor.prototype.xParamPlus = function(paramId)
{
  if (!this._j._natural)
  {
    this.initNaturalParams();
  }

  return this._j._natural._xParamsPlus[paramId] ?? 0;
};

/**
 * Modifies the permanent flat bonus value of the given id by a given amount.
 * @param {number} paramId The id of the parameter.
 * @param {number} amount The amount to modify the parameter by.
 */
Game_Actor.prototype.modXparamPlus = function(paramId, amount)
{
  this._j._natural._xParamsPlus[paramId] += amount;
};

/**
 * Gets the permanent multiplier bonus for a base parameter of the given id.
 * @param {number} paramId The id of the parameter.
 * @returns {number}
 */
Game_Actor.prototype.xParamRate = function(paramId)
{
  if (!this._j._natural)
  {
    this.initNaturalParams();
  }

  return this._j._natural._xParamsRate[paramId] ?? 0;
};

/**
 * Modifies the permanent multiplier bonus value of the given id by a given amount.
 * @param {number} paramId The id of the parameter.
 * @param {number} amount The amount to modify the parameter by.
 */
Game_Actor.prototype.modXparamRate = function(paramId, amount)
{
  this._j._natural._xParamsRate[paramId] += amount;
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
Game_Actor.prototype.getParamBuff = function(baseParam, plusStructure, rateStructure)
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
Game_Actor.prototype.getSXParamBuff = function(baseParam, plusStructure, rateStructure)
{
  // determine buff plus for this param.
  const buffPlus = (this.naturalParamBuff(plusStructure, baseParam) / 100);

  // determine buff rate fort his param.
  const buffRate = (this.naturalParamBuff(rateStructure, baseParam) / 100);

  // don't calculate if we don't have anything.
  if (!buffPlus && !buffRate) return 0;

  // determine the modified buff rate.
  const buffFactor = ((buffRate + 100) / 100);

  // determine the modified base parameter.
  const buffBase = (baseParam + buffPlus);

  // remove the value of base param since it is added at the end.
  const result = (buffBase * buffFactor) - baseParam;

  // return result.
  return result;
};

/**
 * Gets the permanent growth for a given base parameter based on the provided id.
 * @param {number} paramId The parameter id to get the growth for.
 * @param {number} currentParam The current value of the given parameter for rate multipliers.
 * @returns {number} The calculated growth amount for this parameter.
 */
Game_Actor.prototype.getBparamGrowth = function(paramId, currentParam)
{
  // get the permanent flat bonus to this parameter.
  const paramGrowthPlus = this.bParamPlus(paramId);

  // get the permanent rate bonus to this parameter.
  const paramGrowthRate = this.bParamRate(paramId);

  // short circuit if we have no bonuses of any kind.
  if (!paramGrowthPlus && !paramGrowthRate) return 0;

  // calculate the result.
  const paramGrowthResult = ((currentParam * paramGrowthRate) / 100) + paramGrowthPlus;

  // return the growth modifier.
  return paramGrowthResult;
};

/**
 * Gets the permanent growth for a given ex-parameter based on the provided id.
 * @param {number} paramId The parameter id to get the growth for.
 * @param {number} currentParam The current value of the given parameter for rate multipliers.
 * @returns {number} The calculated growth amount for this parameter.
 */
Game_Actor.prototype.getXparamGrowth = function(paramId, currentParam)
{
  // get the permanent flat bonus to this parameter.
  const paramGrowthPlus = this.xParamPlus(paramId);

  // get the permanent rate bonus to this parameter.
  const paramGrowthRate = this.xParamRate(paramId);

  // short circuit if we have no bonuses of any kind.
  if (!paramGrowthPlus && !paramGrowthRate) return 0;

  // calculate the result.
  const paramGrowthResult = ((currentParam * paramGrowthRate) / 100) + paramGrowthPlus;

  // return the growth modifier.
  return paramGrowthResult;
};

/**
 * Gets the permanent growth for a given sp-parameter based on the provided id.
 * @param {number} paramId The parameter id to get the growth for.
 * @param {number} currentParam The current value of the given parameter for rate multipliers.
 * @returns {number} The calculated growth amount for this parameter.
 */
Game_Actor.prototype.getSparamGrowth = function(paramId, currentParam)
{
  // get the permanent flat bonus to this parameter.
  const paramGrowthPlus = this.sParamPlus(paramId);

  // get the permanent rate bonus to this parameter.
  const paramGrowthRate = this.sParamRate(paramId);

  // short circuit if we have no bonuses of any kind.
  if (!paramGrowthPlus && !paramGrowthRate) return 0;

  // calculate the result.
  const paramGrowthResult = ((currentParam * paramGrowthRate) / 100) + paramGrowthPlus;

  // return the growth modifier.
  return paramGrowthResult;
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

Game_Actor.prototype.applyNaturalGrowths = function()
{
  // apply all parameters growth types.
  this.applyNaturalBparamGrowths();
  this.applyNaturalXparamGrowths();
  this.applyNaturalSparamGrowths();
  this.applyNaturalCustomGrowths();
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

Game_Actor.prototype.applyNaturalCustomGrowths = function()
{

};
//#endregion Game_Actor

//#region Game_Battler
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
  const objectsToCheck = this.getEverythingWithNotes();

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
 * OVERWRITE Replaces the `maxTp()` function with our custom one that will respect
 * formulas and apply rates from tags, etc.
 * @returns {number}
 */
J.NATURAL.Aliased.Game_Actor.set("maxTp", Game_Battler.prototype.maxTp);
Game_Battler.prototype.maxTp = function()
{
  // check to make sure we have custom max tp formulai.
  if (!this.getTpGrowthFormulai().length)
  {
    // we have no custom formulai; return the original logic.
    return J.NATURAL.Aliased.Game_Actor.get("maxTp").call(this);
  }

  // TODO: mirror plus and rate strategy as with other parameters.

  // return the max tp based on our custom formulai.
  return this.getCustomMaxTp();
};

/**
 * Calculates the max tp based on the various formulai found being applied to this battler.
 * @returns {number}
 */
Game_Battler.prototype.getCustomMaxTp = function()
{
  // we initialize to 0 max tp.
  let additionalMaxTp = 0;

  // grab all the formulai for evaluation.
  const customFormulai = this.getTpGrowthFormulai();

  // this battler, used in the formula.
  // eslint-disable-next-line no-unused-vars
  const a = this;

  // iterate over each custom formula to evaluate it.
  customFormulai.forEach(formula =>
  {
    // eval the formula to get the max tp.
    const result = Math.round(eval(formula));

    // add this result to the running total.
    additionalMaxTp += result;
  });

  // add together the base and calculated from formulai.
  const tempMaxTp = this.getBaseMaxTp() + additionalMaxTp;

  // multiply the temp max tp against the tp rate.
  const totalMaxTp = tempMaxTp * this.getMaxTpRate();

  // clamp the minimum to 0 in case it went negative.
  return Math.max(totalMaxTp, 0);
};

/**
 * Gets all formulai for tp growth on this battler.
 * @returns {string[]} All formulai to process for tp growth.
 */
Game_Battler.prototype.getTpGrowthFormulai = function()
{
  // start the formula container with none.
  const tpGrowthFormulai = [];

  // the regular expression to scan for.
  const structure = J.NATURAL.RegExp.MaxTechGrowth;

  // grab all things with notes that a battler could gain parameters from.
  const objectsToCheck = this.getEverythingWithNotes();

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
        const result = structure.exec(line)[1];

        // make sure we had a real formula first.
        if (result)
        {
          // shove it into the formula container.
          tpGrowthFormulai.push(result);
        }
      });
    }
  });

  // return the formula container.
  return tpGrowthFormulai;
};

/**
 * Gets the base max tp for this battler.
 * @returns {number}
 */
Game_Battler.prototype.getBaseMaxTp = function()
{
  return 0;
};

/**
 * Gets the maximum TP rate for this battler.
 * @returns {number}
 */
Game_Battler.prototype.getMaxTpRate = function()
{
  // the base max tp rate.
  let maxTpRate = 1;

  // all objects we'll be considering for max tp rate.
  const objectsToCheck = this.getEverythingWithNotes();

  // scan all the objects and extract their max tp rates.
  objectsToCheck.forEach(obj => (maxTpRate += this.extractMaxTpRate(obj)), this);

  // clamp the minimum to a 0 multiplier, we probably shouldn't try to have negatives.
  maxTpRate = Math.max(maxTpRate, 0);

  // we have to return it in factor form.
  return maxTpRate;
};

/**
 * Extracts the maximum TP rate from the given database object.
 * @param {RPG_BaseItem} referenceData The database object to check.
 * @returns {number}
 */
Game_Battler.prototype.extractMaxTpRate = function(referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return 0;

  const notedata = referenceData.note.split(/[\r\n]+/);
  const structure = /<maxTpRate:[ ]?(-?[\d]+)>/i;
  let rate = 0;
  notedata.forEach(line =>
  {
    if (line.match(structure))
    {
      const multiplier = parseInt(RegExp.$1);
      rate += multiplier;
    }
  });

  return (rate / 100);
};
//#endregion Game_Battler

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
  const structure = this.getRegexByParamId(paramId);

  // if there is no regexp, then don't try to do things.
  if (!structure) return baseParam;

  // determine additional growth rates.
  const additionalGrowths = this.naturalParamBuff(structure, baseParam);

  // combine results.
  const result = baseParam + additionalGrowths;

  // return result.
  return result;
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
  const structure = this.getRegexByExParamId(xparamId);

  // if there is no regexp, then don't try to do things.
  if (!structure) return baseParam;

  // determine additional growth rates.
  const additionalGrowths = this.naturalParamBuff(structure, baseParam) / 100;

  // combine results.
  const result = baseParam + additionalGrowths;

  // return result.
  return result;
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
  const structure = this.getRegexBySpParamId(sparamId);

  // if there is no regexp, then don't try to do things.
  if (!structure) return baseParam;

  // determine additional growth rates.
  const additionalGrowths = this.naturalParamBuff(structure, baseParam) / 100;

  // combine results.
  const result = baseParam + additionalGrowths;

  // return result.
  return result;
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
//#endregion Game objects

//ENDOFFILE