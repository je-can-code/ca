//#region Introduction
/*:
 * @target MZ
 * @plugindesc 
 * [v1.0 TPGROW] Allows TP max to be dynamic rather than static 100.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @help
 * ============================================================================
 * This plugin enables the ability to have TP grow on battlers by means of
 * a provided formula.
 * 
 * By overwriting the .maxTp() function, we have added the ability to grow by
 * whatever means you, the RM dev, feel is appropriate.
 * ============================================================================
 * BATTLER MAX TP FORMULA:
 * By applying the appropriate tag to the various database locations
 * applicable, you can now have a dynamically determined maximum TP!
 * 
 * NOTE:
 * If multiple sources provide tp growth formulai, then all formulai will be
 * calculated and the sum of them will be the battler's maximum TP. Also, if
 * the source of a formula is something that is temporary
 * (equips/states/classes), then the maximum TP will adjust accordingly once
 * those sources are changed.
 * 
 * TAG USAGE:
 * - Actors
 * - Enemies
 * - Weapons
 * - Armors
 * - Skills
 * - States
 * - Classes
 * 
 * TAG FORMAT:
 *  <tpGrowth:[FORMULA]>
 * 
 * TAG EXAMPLES:
 *  <tpGrowth:[100]> on battler (either actor or enemy).
 * This battler has a static 100 max TP.
 * 
 *  <tpGrowth:[100]> on battler (either actor or enemy).
 *  <tpGrowth:[50]> on weapon (only applicable to actors).
 * This actor has a static 150 max TP.
 * This enemy has a static 100 max TP.
 * 
 *  <tpGrowth:[100]> on battler (either actor or enemy).
 *  <tpGrowth:[a.level ** 1.3]> on class (only applicable to actors).
 *  <tpGrowth:[a.atk * 0.1]> on state.
 * This actor would have a dynamic max TP of:
 * (100) + (battler's level to the 1.3 power) + (battler's attack * 0.1)
 * This enemy would have a dynamic max TP of:
 * (100) + (battler's attack * 0.1)
 * ============================================================================
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
J.TPGROW = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.TPGROW.Metadata = {
  /**
   * The version of this plugin.
   */
  Name: `J-TpGrowth`,

  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};
J.TPGROW.PluginParameters = PluginManager.parameters(J.TPGROW.Metadata.Name);
J.TPGROW.Metadata.BaseTpMaxActors = Number(J.TPGROW.PluginParameters['actorBaseTp']);
J.TPGROW.Metadata.BaseTpMaxEnemies = Number(J.TPGROW.PluginParameters['enemyBaseTp']);

J.TPGROW.Aliased = {
  Game_Actor: new Map(),
  Game_Enemy: new Map(),
};
//#endregion Introduction

//#region Game objects

//#region Game_Actor
/**
 * OVERWRITE Replaces the `maxTp()` function with our custom one that will respect
 * formulas and apply rates from tags, etc.
 * @returns {number}
 */
J.TPGROW.Aliased.Game_Actor.set("maxTp", Game_Actor.prototype.maxTp);
Game_Actor.prototype.maxTp = function()
{
  const originalFormula = J.TPGROW.Aliased.Game_Actor.get("maxTp").call(this);
  const customFormulai = this.getTpGrowthFormulai();
  if (!customFormulai.length)
  {
    return originalFormula;
  }

  // establish the base max TP.
  let baseTpMax = J.TPGROW.Metadata.BaseTpMaxActors;
  const a = this; // this battler, used in the formula.
  customFormulai.forEach(formula =>
  {
    const result = Math.round(eval(formula));
    baseTpMax += result;
  });

  // apply the max TP rate modifier.
  baseTpMax *= this.getMaxTpRate();

  // clamp the minimum to 0 in case it went negative.
  baseTpMax = Math.max(baseTpMax, 0);
  return baseTpMax;
};

/**
 * Gets all formulai for tp growth on this actor.
 * @returns {string[]} All formulai to process for tp growth.
 */
Game_Actor.prototype.getTpGrowthFormulai = function()
{
  const objectsToCheck = this.getEverythingWithNotes();

  const tpGrowthFormulai = [];
  objectsToCheck.forEach(referenceData =>
  {
    const tpGrowthFormula = this.extractTpGrowthFormula(referenceData);
    if (tpGrowthFormula)
    {
      tpGrowthFormulai.push(tpGrowthFormula);
    }
  });

  return tpGrowthFormulai;
};
//#endregion Game_Actor

//#region Game_Battler
/**
 * Scans an object with notes to extract out the tp growth formula,
 * if it exists.
 * @param {rm.types.BaseItem} referenceData The item with notes to scan.
 * @returns {string}
 */
Game_Battler.prototype.extractTpGrowthFormula = function(referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return [];

  const notedata = referenceData.note.split(/[\r\n]+/);
  const structure = /<tpGrowth:\[([+\-*\/ ().\w]+)]>/gmi;
  let formula = null;
  notedata.forEach(line =>
  {
    if (line.match(structure))
    {
      formula = RegExp.$1;
    }
  });

  return formula;
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
 * @param {rm.types.BaseItem} referenceData The database object to check.
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
 * The maximum TP that this enemy has.
 * @returns {number}
 */
J.TPGROW.Aliased.Game_Enemy.set("maxTp", Game_Enemy.prototype.maxTp);
Game_Enemy.prototype.maxTp = function()
{
  const originalFormula = J.TPGROW.Aliased.Game_Enemy.get("maxTp").call(this);
  const customFormulai = this.getTpGrowthFormulai();
  if (!customFormulai.length)
  {
    return originalFormula;
  }

  // establish the base max TP.
  let baseTpMax = J.TPGROW.Metadata.BaseTpMaxEnemies;
  const a = this; // this battler, used in the formula.
  customFormulai.forEach(formula =>
  {
    const result = Math.round(eval(formula));
    baseTpMax += result;
  });

  // apply the max TP rate modifier.
  baseTpMax *= this.getMaxTpRate();

  // clamp the minimum to 0 in case it went negative.
  baseTpMax = Math.max(baseTpMax, 0);
  return baseTpMax;
};

/**
 * Gets all formulai for tp growth on this enemy.
 * @returns {string[]} All formulai to process for tp growth.
 */
Game_Enemy.prototype.getTpGrowthFormulai = function()
{
  const objectsToCheck = this.getEverythingWithNotes();

  const tpGrowthFormulai = [];
  objectsToCheck.forEach(referenceData =>
  {
    const tpGrowthFormula = this.extractTpGrowthFormula(referenceData);
    if (tpGrowthFormula)
    {
      tpGrowthFormulai.push(tpGrowthFormula);
    }
  });

  return tpGrowthFormulai;
};
//#endregion Game_Enemy

//#endregion Game objects