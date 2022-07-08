/*  BUNDLED TIME: Fri Jul 08 2022 13:51:42 GMT-0700 (Pacific Daylight Time)  */

//#region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 TIMING] Enable modifying cooldowns/casting for actions.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-ABS
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW:
 * This plugin enables modifications for cast times and cooldowns for actions.
 *
 * Enables:
 * - NEW! added param "Fast Cooldown", for modifying cooldown times.
 * - NEW! added param "Cast Speed", for modifying cast speeds.
 *
 * This plugin requires JABS.
 * This plugin requires no plugin parameter configuration.
 * ----------------------------------------------------------------------------
 * DETAILS:
 * The new parameters of fast cooldown and cast speed are both cached to
 * minimize processing time. The cache is refreshed on the following events:
 *
 * For all battlers:
 * - a new state is added.
 * - a current state is removed.
 * For only actors:
 * - new equipment is equipped.
 * - existing equipment is unequipped.
 * - leveling up.
 * - leveling down.
 * ============================================================================
 * FAST COOLDOWN:
 * Have you ever wanted skills to have a base cooldown time, but maybe when
 * a battler has a particular state applied or equipment equipped, they now
 * have even faster cooldown times (or slower???)? Well now you can! By
 * applying the appropriate tag to various database locations, you can control
 * how fast (or slow) a battler's cooldown times are!
 *
 * DETAILS:
 * By constructing tags using the format described below, you are given access
 * to a "Formula" box that behaves similar to a "Formula" box that defines the
 * damage of a skill. None of the tags are case sensitive, but the order is
 * specific. If you find yourself having trouble building the tags, you can
 * peek at the source code of this file and search for
 * "J.ABS.EXT_TIMING.RegExp =" to find the grand master list of all
 * combinations of tags. Do note that the hard brackets of [] are required to
 * wrap the formula in the note tag.
 *
 * NOTE1:
 * If you want faster cooldowns, the formula should result in a NEGATIVE value.
 * If you want slower cooldowns, the formula should result in a POSITIVE value.
 *
 * NOTE2:
 * The minimum amount of time for cooldowns is 0 frames.
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
 *  <baseFastCooldown:[FORMULA]>
 *  <fastCooldownFlat:[FORMULA]>
 *  <fastCooldownRate:[FORMULA]>
 * Where [FORMULA] is the formula to produce the fast cooldown value.
 *
 * EXAMPLE:
 *  <baseFastCooldown:[3]>
 * Base fast cooldown will be set to +3 frames.
 *
 *  <fastCooldownFlat:[(a.level * -2)]>
 * All cooldowns are reduced by 2 frames per level.
 *
 *  <fastCooldownRate:[b * -5]>
 * All cooldowns will be reduced by 5% per point of base fast cooldown.
 * (not a practical formula, but demonstrating use)
 * ============================================================================
 * CAST SPEED:
 * Have you ever wanted skills to have a base cast speed, but maybe when
 * a battler has a particular state applied or equipment equipped, they now
 * have even faster cast times (or slower???)? Well now you can! By
 * applying the appropriate tag to various database locations, you can control
 * how fast (or slow) a battler's cast times are!
 *
 * DETAILS:
 * By constructing tags using the format described below, you are given access
 * to a "Formula" box that behaves similar to a "Formula" box that defines the
 * damage of a skill. None of the tags are case sensitive, but the order is
 * specific. If you find yourself having trouble building the tags, you can
 * peek at the source code of this file and search for
 * "J.ABS.EXT_TIMING.RegExp =" to find the grand master list of all
 * combinations of tags. Do note that the hard brackets of [] are required to
 * wrap the formula in the note tag.
 *
 * NOTE1:
 * If you want faster casting, the formula should result in a NEGATIVE value.
 * If you want slower casting, the formula should result in a POSITIVE value.
 *
 * NOTE2:
 * The minimum amount of time for casting is 0 frames.
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
 *  <baseCastSpeed:[FORMULA]>
 *  <castSpeedFlat:[FORMULA]>
 *  <castSpeedRate:[FORMULA]>
 * Where [FORMULA] is the formula to produce the fast cooldown value.
 *
 * EXAMPLE:
 *  <baseCastSpeed:[3]>
 * Base cast speed will be set to +3 frames.
 *
 *  <castSpeedFlat:[(a.level * -2)]>
 * All cast times are reduced by 2 frames per level.
 *
 *  <castSpeedRate:[b * -5]>
 * All cast times will be reduced by 5% per point of base fast cooldown.
 * (not a practical formula, but demonstrating use)
 * ==============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release.
 * ==============================================================================
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this extension plugin.
 */
J.ABS.EXT_TIMING = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ABS.EXT_TIMING.Metadata = {
  /**
   * The name of this plugin.
   */
  Name: `J-ABS-Timing`,

  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

J.ABS.EXT_TIMING.PluginParameters = PluginManager.parameters(J.ABS.EXT_TIMING.Metadata.Name);

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.EXT_TIMING.Aliased = {
  Game_Actor: new Map(),
  Game_Battler: new Map(),
  Game_BattlerBase: new Map(),
  Game_Enemy: new Map(),
  JABS_Action: new Map(),
};

/**
 * All regular expressions used by this plugin.
 */
J.ABS.EXT_TIMING.RegExp = {
  BaseCastSpeed: /<baseCastTime:\[([+\-*/ ().\w]+)]>/gi,
  CastSpeedFlat: /<castTimeFlat:\[([+\-*/ ().\w]+)]>/gi,
  CastSpeedRate: /<castTimePercent:\[([+\-*/ ().\w]+)]>/gi,
  BaseFastCooldown: /<baseFastCooldown:\[([+\-*/ ().\w]+)]>/gi,
  FastCooldownFlat: /<fastCooldownFlat:\[([+\-*/ ().\w]+)]>/gi,
  FastCooldownRate: /<fastCooldownRate:\[([+\-*/ ().\w]+)]>/gi,
};
//#endregion Introduction

//#region JABS_Action
/**
 * Extends {@link JABS_Action.getCastTime}.
 * Applies cast speed into the equation of determining cast time.
 */
J.ABS.EXT_TIMING.Aliased.JABS_Action.set('getCastTime', JABS_Action.prototype.getCastTime);
JABS_Action.prototype.getCastTime = function()
{
  // perform original logic to get regular cast time.
  const skillCastTime = J.ABS.EXT_TIMING.Aliased.JABS_Action.get('getCastTime').call(this);

  // grab the caster.
  const caster = this.getCaster().getBattler();

  // if we have no caster, then don't try to calculate it.
  if (!caster) return skillCastTime;

  // calculate the cast time.
  const actualCastTime = caster.applyCastSpeed(skillCastTime);

  // return the actual cast time.
  return actualCastTime;
};

/**
 * Extends {@link JABS_Action.getCooldown}.
 * Applies fast cooldown into the equation of determining cooldown time.
 */
J.ABS.EXT_TIMING.Aliased.JABS_Action.set('getCooldown', JABS_Action.prototype.getCooldown);
JABS_Action.prototype.getCooldown = function()
{
  // perform original logic to get regular cooldown.
  const skillCooldown = J.ABS.EXT_TIMING.Aliased.JABS_Action.get('getCooldown').call(this);

  // grab the caster.
  const caster = this.getCaster().getBattler();

  // if we have no caster, then don't try to calculate it.
  if (!caster) return skillCooldown;

  // calculate the cooldown.
  const actualCooldown = caster.applyFastCooldown(skillCooldown);

  // return the actual cooldown.
  return actualCooldown;
};
//#endregion JABS_Action

//#region Game_Battler
/**
 * Extends `initMembers()` to include initialization of our new parameters.
 */
J.ABS.EXT_TIMING.Aliased.Game_Battler.set('initMembers', Game_Battler.prototype.initMembers);
Game_Battler.prototype.initMembers = function()
{
  // perform original logic.
  J.ABS.EXT_TIMING.Aliased.Game_Battler.get('initMembers').call(this);

  // initialize the extra members.
  this.initActionUpgrades1();
};

/**
 * Initializes the extra properties for the action upgrades..
 */
Game_Battler.prototype.initActionUpgrades1 = function()
{
  /**
   * The J object where all my additional properties live.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with JABS.
   */
  this._j._abs ||= {};

  /**
   * A grouping of all JABS properties associated with the set-1 of action upgrades.
   */
  this._j._abs._timing = {};

  /**
   * The cached value for fast cooldown's base modifier.
   * @type {number}
   */
  this._j._abs._timing._baseFastCooldown = 0;

  /**
   * The cached value for fast cooldown's flat modifier.
   * @type {number}
   */
  this._j._abs._timing._fastCooldownFlat = 0;

  /**
   * The cached value for the fast cooldown's multiplicative modifier.
   * @type {number}
   */
  this._j._abs._timing._fastCooldownRate = 0;

  /**
   * The cached value for the cast speed's base modifier.
   * @type {number}
   */
  this._j._abs._timing._baseCastSpeed = 0;

  /**
   * The cached value for the cast speed's flat modifier.
   * @type {number}
   */
  this._j._abs._timing._castSpeedFlat = 0;

  /**
   * The cached value for the cast speed's multiplicative modifier.
   * @type {number}
   */
  this._j._abs._timing._castSpeedRate = 0;
};

//#region getters & setters & updates
/**
 * Gets the cached fast cooldown base value.
 * @returns {number}
 */
Game_Battler.prototype.getBaseFastCooldown = function()
{
  return this._j._abs._timing._baseFastCooldown;
};

/**
 * Sets the cached fast cooldown base value.
 * @param {number} amount The new amount.
 */
Game_Battler.prototype.setBaseFastCooldown = function(amount)
{
  this._j._abs._timing._baseFastCooldown = amount;
};

/**
 * Updates the cached fast cooldown base value with the latest.
 */
Game_Battler.prototype.updateBaseFastCooldown = function()
{
  // get the current fast cooldown base modifier.
  const currentFastCooldownFlat = this.baseFastCooldown();

  // update the fast cooldown base modifier.
  this.setBaseFastCooldown(currentFastCooldownFlat);
};


/**
 * Gets the cached fast cooldown flat value.
 * @returns {number}
 */
Game_Battler.prototype.getFastCooldownFlat = function()
{
  return this._j._abs._timing._fastCooldownFlat;
};

/**
 * Sets the cached fast cooldown flat value.
 * @param {number} amount The new amount.
 */
Game_Battler.prototype.setFastCooldownFlat = function(amount)
{
  this._j._abs._timing._fastCooldownFlat = amount;
};

/**
 * Updates the cached fast cooldown flat value with the latest.
 */
Game_Battler.prototype.updateFastCooldownFlat = function()
{
  // get the current fast cooldown flat modifier.
  const currentFastCooldownFlat = this.fastCooldownFlat();

  // update the fast cooldown flat modifier.
  this.setFastCooldownFlat(currentFastCooldownFlat);
};

/**
 * Gets the cached fast cooldown rate value.
 * @returns {number}
 */
Game_Battler.prototype.getFastCooldownRate = function()
{
  return this._j._abs._timing._fastCooldownRate;
};

/**
 * Sets the cached fast cooldown rate value.
 * @param {number} amount The new amount.
 */
Game_Battler.prototype.setFastCooldownRate = function(amount)
{
  this._j._abs._timing._fastCooldownRate = amount;
};

/**
 * Updates the cached fast cooldown rate value with the latest.
 */
Game_Battler.prototype.updateFastCooldownRate = function()
{
  // get the current fast cooldown rate modifier.
  const currentFastCooldownRate = this.fastCooldownRate();

  // update the fast cooldown rate modifier.
  this.setFastCooldownRate(currentFastCooldownRate);
};

/**
 * Gets the cached cast speed base value.
 * @returns {number}
 */
Game_Battler.prototype.getBaseCastSpeed = function()
{
  return this._j._abs._timing._baseCastSpeed;
};

/**
 * Sets the cached cast speed base value.
 * @param {number} amount The new amount.
 */
Game_Battler.prototype.setBaseCastSpeed = function(amount)
{
  this._j._abs._timing._baseCastSpeed = amount;
};

/**
 * Updates the cached cast speed base value with the latest.
 */
Game_Battler.prototype.updateBaseCastSpeed = function()
{
  // get the current cast speed base modifier.
  const currentBaseCastSpeed = this.baseCastSpeed();

  // update the cast speed base modifier.
  this.setBaseCastSpeed(currentBaseCastSpeed);
};

/**
 * Gets the cached cast speed flat value.
 * @returns {number}
 */
Game_Battler.prototype.getCastSpeedFlat = function()
{
  return this._j._abs._timing._castSpeedFlat;
};

/**
 * Sets the cached cast speed flat value.
 * @param {number} amount The new amount.
 */
Game_Battler.prototype.setCastSpeedFlat = function(amount)
{
  this._j._abs._timing._castSpeedFlat = amount;
};

/**
 * Updates the cached cast speed flat value with the latest.
 */
Game_Battler.prototype.updateCastSpeedFlat = function()
{
  // get the current cast speed flat modifier.
  const currentCastSpeedFlat = this.castSpeedFlat();

  // update the cast speed flat modifier.
  this.setCastSpeedFlat(currentCastSpeedFlat);
};

/**
 * Gets the cached cast speed rate value.
 * @returns {number}
 */
Game_Battler.prototype.getCastSpeedRate = function()
{
  return this._j._abs._timing._castSpeedRate;
};

/**
 * Sets the cached cast speed rate value.
 * @param {number} amount The new amount.
 */
Game_Battler.prototype.setCastSpeedRate = function(amount)
{
  this._j._abs._timing._castSpeedRate = amount;
};

/**
 * Updates the cached cast speed rate value with the latest.
 */
Game_Battler.prototype.updateCastSpeedRate = function()
{
  // get the current cast speed rate modifier.
  const currentCastSpeedRate = this.castSpeedFlat();

  // update the cast speed rate modifier.
  this.setCastSpeedRate(currentCastSpeedRate);
};
//#endregion getters & setters & updates

//#region cast speed
/**
 * The base cast speed multiplier.
 * A battler's base cast speed defines the default multiplier for how long it takes to cast.
 * @returns {number} The base multiplier for this battler.
 */
Game_Battler.prototype.baseCastSpeed = function()
{
  // grab everything with notes.
  const objectsToCheck = this.getAllNotes();

  // TODO: add to plugin parameters?
  const baseParam = 0;

  // sum together all the csp flat modifiers.
  const baseFcd = RPGManager.getResultsFromAllNotesByRegex(
    objectsToCheck,
    J.ABS.EXT_TIMING.RegExp.BaseCastSpeed,
    baseParam,
    this);

  // return the sum of base flat csp found.
  return baseFcd;
};

/**
 * Gets the flat modifier for this battler's cast speed.
 * @returns {number}
 */
Game_Battler.prototype.castSpeedFlat = function()
{
  // grab everything with notes.
  const objectsToCheck = this.getAllNotes();

  // grab the base parameter value.
  const baseParam = this.baseCastSpeed();

  // sum together all the csp flat modifiers.
  const cspFlat = RPGManager.getResultsFromAllNotesByRegex(
    objectsToCheck,
    J.ABS.EXT_TIMING.RegExp.CastSpeedFlat,
    baseParam,
    this);

  // return the sum of flat csp found.
  return cspFlat;
};

/**
 * Gets the multiplier for this battler's cast speed.
 * @returns {number}
 */
Game_Battler.prototype.castSpeedRate = function()
{
  // grab everything with notes.
  const objectsToCheck = this.getAllNotes();

  // grab the base parameter value.
  const baseParam = this.baseCastSpeed();

  // grab the base parameter value.
  const cspRate = RPGManager.getResultsFromAllNotesByRegex(
    objectsToCheck,
    J.ABS.EXT_TIMING.RegExp.CastSpeedRate,
    baseParam,
    this);

  // return the amount.
  return cspRate;
};

/**
 * Calculates the cast speed based on the various parameters.
 * @param {number} originalCastTime The original cast time in frames.
 * @returns {number} The new amount of frames to wait.
 */
Game_Battler.prototype.applyCastSpeed = function(originalCastTime)
{
  // short circuit for no cast times.
  if (!originalCastTime) return 0;

  // get the base multiplier.
  const baseParam = this.baseCastSpeed();

  // grab the flat modifier.
  const flatModifier = this.castSpeedFlat();

  // grab the multiplier from effective locations.
  const multModifier = this.castSpeedRate();

  // short circuit before calculations if we have no values.
  if (!baseParam && !flatModifier && !multModifier) return originalCastTime;

  // determine the true base value.
  const baseCastTime = (baseParam + flatModifier);

  // determine the true multiplicative value.
  const castTimeMultiplier = ((multModifier + 100) / 100);

  // grab the minimum cooldown value.
  const minimumCastTime = this.minimumCastTime();

  // perform calculation- minimum of 1 frame cooldown time.
  const calculatedCastTime = (originalCastTime * castTimeMultiplier) + baseCastTime;

  // the actual cast time considering the minimum.
  const actualCastTime = Math.max(calculatedCastTime, minimumCastTime);

  // no fractions of frames!
  return Math.round(actualCastTime);
};

/**
 * The minimum cast time for this battler.
 * @returns {number}
 */
Game_Battler.prototype.minimumCastTime = function()
{
  // TODO: parameterize minimum into plugin parameter.
  return 0;
};
//#endregion castspeed

//#region fast cooldown
/**
 * The base faster cooldown flat modifier.
 * A battler's faster cooldown value will reduce the number of frames
 * required to cooldown after a skill is executed.
 *
 * The mininum number of frames is 1 for a cooldown.
 * @returns {number} The base modifier for this battler.
 */
Game_Battler.prototype.baseFastCooldown = function()
{
  // grab everything with notes.
  const objectsToCheck = this.getAllNotes();

  // TODO: add to plugin parameters?
  const baseParam = 0;

  // sum together all the fcd flat modifiers.
  const baseFcd = RPGManager.getResultsFromAllNotesByRegex(
    objectsToCheck,
    J.ABS.EXT_TIMING.RegExp.BaseFastCooldown,
    baseParam,
    this);

  // return the sum of base flat fcd found.
  return baseFcd;
};

/**
 * Gets the flat modifier for this battler's fast cooldown.
 * @returns {number}
 */
Game_Battler.prototype.fastCooldownFlat = function()
{
  // grab everything with notes.
  const objectsToCheck = this.getAllNotes();

  // grab the base parameter value.
  const baseParam = this.baseFastCooldown();

  // sum together all the fcd flat modifiers.
  const fcdFlat = RPGManager.getResultsFromAllNotesByRegex(
    objectsToCheck,
    J.ABS.EXT_TIMING.RegExp.FastCooldownFlat,
    baseParam,
    this);

  // return the sum of flat fcd found.
  return fcdFlat;
};

/**
 * Gets the multiplicative modifier for this battler's fast cooldown.
 * @returns {number}
 */
Game_Battler.prototype.fastCooldownRate = function()
{
  // grab everything with notes.
  const objectsToCheck = this.getAllNotes();

  // grab the base parameter value.
  const baseParam = this.baseFastCooldown();

  // grab the base parameter value.
  const fcdRate = RPGManager.getResultsFromAllNotesByRegex(
    objectsToCheck,
    J.ABS.EXT_TIMING.RegExp.FastCooldownRate,
    baseParam,
    this);

  // return the amount.
  return fcdRate;
};

/**
 * Calculates the cooldown time based on the various parameters.
 * @param {number} originalCooldownTime The original cooldown time in frames.
 * @returns {number} The new amount of frames to wait.
 */
Game_Battler.prototype.applyFastCooldown = function(originalCooldownTime)
{
  // short circuit before parameter checks if no required cooldown value.
  if (!originalCooldownTime) return 0;

  // get the base value.
  const baseParam = this.baseFastCooldown(); // this.getBaseFastCooldown();

  // grab the flat modifier.
  const flatModifier = this.fastCooldownFlat(); //this.getFastCooldownFlat();

  // grab the multiplicative modifier, and add the base-100 to the value.
  const multModifier = this.fastCooldownRate(); //this.getFastCooldownRate();

  // short circuit before calculations if we have no values.
  if (!baseParam && !flatModifier && !multModifier) return originalCooldownTime;

  // determine the true base value.
  const baseFastCooldown = (baseParam + flatModifier);

  // determine the true multiplicative value.
  const cooldownMultiplier = ((multModifier + 100) / 100);

  // grab the minimum cooldown value.
  const minimumCooldown = this.minimumCooldown();

  // determine the true cooldown value.
  const calculatedCooldown = (originalCooldownTime * cooldownMultiplier) + baseFastCooldown;

  // perform calculation- minimum of 1 frame cooldown time.
  const actualCooldown = Math.max(calculatedCooldown, minimumCooldown);

  // no fractions of frames!
  return Math.round(actualCooldown);
};

/**
 * The minimum cooldown for this battler.
 * @returns {number}
 */
Game_Battler.prototype.minimumCooldown = function()
{
  // TODO: parameterize minimum into plugin parameter.
  return 0;
};
//#endregion fast cooldown
//#endregion Game_Battler