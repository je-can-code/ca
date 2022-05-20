//#region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 NATURAL] Enables level-based growth of all parameters.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-BASE
 * @help
 * ============================================================================
 * OVERVIEW:
 * This plugin enables "Natural Growth", aka formulaic parameter growth, for
 * actors. This "Natural Growth" enables temporary/permanent stat growth while
 * various tags are applied.
 *
 * Integrates with others of mine plugins:
 * - J-CriticalFactors; enables natural growths of CDM/CDR.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * The "Natural Growths" are separated into two categories:
 * - "Buffs":   has effect while applied.
 * - "Growths": effect is applied permanently for every level gained.
 *
 * Additionally, each "Natural Growth" can be applied in two ways:
 * - "Plus": a flat bonus to the base parameter.
 * - "Rate": a multiplicative bonus to the (base parameter + "plus" bonus).
 * ============================================================================
 * NATURAL GROWTH:
 * Have you ever wanted an actor to gain a particular stat, but couldn't quite
 * make it as customizable as you wanted it to be? Well now you can! By adding
 * the correct tags to your notes across the various entries in the database,
 * you too can make your actors gain more specific stats!
 *
 * DETAILS:
 * By constructing tags using the format described below, you are given access
 * to a "Formula" box that behaves similar to a "Formula" box that defines the
 * damage of a skill. None of the tags are case sensitive, but the order is
 * specific. If you find yourself having trouble building the tags, you can
 * peek at the source code of this file and search for "J.NATURAL.RegExp =" to
 * find the grand master list of all combinations of tags. Do note that the
 * hard brackets of [] are required to wrap the formula in the note tag.
 *
 * THE PERMANENCE OF BUFF:
 * The "Buffs" effect, as indicated above, is applied temporarily at whatever
 * the formula would calculate out to when the parameter is requested. This
 * allows the application of these "buffs" to live on dynamic objects, such as
 * equipment or states, giving greater control over what stats are gained and
 * how much. However, it is important to note that if you put a "buff" tag on
 * a non-temporary object, such as the actor itself, it would be functionally
 * a permanent "buff".
 *
 * THE PERMANENCE OF GROWTH:
 * The "Growths" effect, as indicated above, is applied permanently for every
 * level gained. However, it is important to note that due to the nature of the
 * growth being permanent, it WILL NOT be lost if the level is reduced in some
 * way, and WILL be gained AGAIN if the level increases once more.
 *
 * NOTE1:
 * The "stats" word choice was deliberate vague because this can apply to any
 * of the 8 base parameters, 10 sp-parameters, or 10 ex-parameters, or max tp.
 *
 * TIP:
 * Within the FORMULA of the tag, the variable "a" is can be used to access
 * the actor for more complex calculations.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - Enemies
 * - States
 *
 * TAG FORMAT:
 *  <(PARAM)(BUFF|GROWTH)(PLUS|RATE):[FORMULA]>
 * Where (PARAM) is the (base/sp/ex) parameter shorthand.
 * Where (BUFF|GROWTH) is literally one of either "Buff" or "Growth".
 * Where (PLUS|RATE) is literally one of either "Plus" or "Rate".
 * Where [FORMULA] is the formula to produce the amount.
 *
 * EXAMPLE:
 *  <hrgGrowthRate:[5]>
 * Gain +5% hp regen (hrg) per level.
 * This would result in gaining an ever-increasing amount of hp regen per level.
 *
 *  <exrBuffPlus:[25]>
 * Gain a flat 25 exp rate (exr) while this tag is applied to this battler.
 * This would be lost if the object this tag lived on was removed.
 *
 *  <atkGrowthPlus:[a.level * 3]>
 * Gain (the battler's level multiplied by 3) attack (atk) per level.
 * This would result in gaining an ever-increasing amount of attack per level.
 * ==============================================================================
 * EXAMPLE IDEAS:
 * While you can read about the syntax in the next section below, here I wanted
 * to present you a few ideas of things you can do with this plugin, to better
 * illustrate what exactly this plugin can do.
 *
 * TAG:
 *  <mtpBuffPlus:[80]>
 * LOCATION:
 *  An actor.
 * EFFECT:
 *  The actor now has a permanent bonus of 80 to their max tp.
 *
 * TAG:
 *  <grdGrowthRate:[a.grd / 2]>
 * LOCATION:
 *  A class.
 * EFFECT:
 *  For every level gained by an actor using this class, they will gain a
 *  a permanent bonus of 50% of their current GRD added as a "rate" bonus,
 *  meaning it is a multiplied percent bonus against their base and plus
 *  values combined.
 *
 * TAG:
 *  <hrgBuffPlus:[(a.level**1.3)+(a.level*5)]>
 * LOCATION:
 *  An armor.
 * EFFECT:
 *  The actor will have a bonus of (5x their level) and (their level to the
 *  1.3rd power) added together worth of HRG.
 *
 * TAG:
 *  <atkGrowthPlus:[a.level]>
 * LOCATION:
 *  A state.
 * EFFECT:
 *  For every level gained by an actor afflicted with this state, they will
 *  gain their level's worth of attack permanently.
 *
 * ==============================================================================
 * GLOSSARY:
 * There are a lot of shorthands available for use with this plugin to build your
 * various buff and growth tags. Here is a comprehensive list of the shorthands
 * along with a translation to the actual parameter of all supported shorthands.
 *
 * NOTE:
 * Custom parameters will require their respective plugins added above this one.
 *
 * Base Parameters:
 * - mhp (max hp)
 * - mmp (max mp)
 * - atk (attack)
 * - def (defense)
 * - mat (magic attack)
 * - mdf (magic defense)
 * - agi (agility)
 * - luk (luck)
 *
 * Ex Parameters:
 * - hit (hit rate)
 * - eva (evasion rate)
 * - cri (critical hit rate)
 * - cev (critical evasion rate)
 * - mev (magic evasion rate)
 * - mrf (magic reflect rate)
 * - cnt (counter attack rate)
 * - hrg (hp regen rate)
 * - mrg (mp regen rate)
 * - trg (tp regen rate)
 *
 * Sp Parameters:
 * - trg (targeting rate)
 * - grd (guarding rate)
 * - rec (recovery rate)
 * - pha (pharmacy rate)
 * - mcr (mp cost reduction rate)
 * - tcr (tp cost reduction rate)
 * - pdr (physical damage reduction rate)
 * - mdr (magical damage reduction rate)
 * - fdr (floor damage reduction rate)
 * - exr (experience gained rate)
 *
 * Custom Parameters:
 * - mtp (max tp)
 *
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
  Game_BattlerBase: new Map(),
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
  BaseMaxTech: /<baseMaxTp:\[([+\-*/ ().\w]+)]>/gi,
  MaxTechBuffPlus: /mtpBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  MaxTechBuffRate: /mtpBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  MaxTechGrowthPlus: /mtpGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  MaxTechGrowthRate: /mtpGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
};
//#endregion Introduction

//#region Static objects

//#endregion Static objects

//#region Game objects
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
//#endregion Game objects

//ENDOFFILE