//#region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 MOVE] Enable modifying move speeds.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-BASE
 * @orderAfter J-BASE
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW:
 * This plugin enables modifications of movespeed for characters on the map.
 *
 * This plugin requires JABS.
 * This plugin requires no plugin parameter configuration.
 * ----------------------------------------------------------------------------
 * DETAILS:
 * The new parameter of "movement speed boost" is a calculated parameter that
 * gets cached when things change on battlers.
 * ============================================================================
 * MOVEMENT SPEED BOOST:
 * Have you ever wanted to have your battlers on the map move a little bit
 * slower or faster when afflicted with haste or wearing heavy boots, etc?
 * Well now you can! By applying the appropriate tag to various database
 * locations, you can control how fast or slow the battler's movement speed
 * is while on the map.
 *
 * NOTE1:
 * The movement speed boost does NOT calculate the same way that event
 * movespeed is described. See the next section to understand better how the
 * calculations work.
 *
 * NOTE2:
 * The amount of all tags will be added together first and then calculated for
 * a single battler's movement speed modifier.
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
 *  <speedBoost:NUM>
 * Where NUM is the positive/negative amount to add.
 *
 * EXAMPLE:
 *  <speedBoost:4>
 * This battler's movement speed will be increased by ~40%.
 *
 *  <speedBoost:-2>
 * This battler's movement speed will be decreased by ~6%.
 *
 *  <speedBoost:11>
 * This battler's movement speed will be increased by ~77.5%.
 *
 *  <speedBoost:7>
 *  <speedBoost:-5>
 *  <speedBoost:-1>
 *  <speedBoost:3>
 * This battlers movement speed will be increased by ~40%.
 * ============================================================================
 * MOVEMENT SPEED BOOST CALCULATIONS:
 * The movement speed boosts as seen are just whole numbers. They are added
 * together and there is some math under the covers that calculates the amount
 * into an actual speed boost modifier. What does the formula look like you
 * ask? Let us look together.
 *
 * NOTE:
 * There is no upper limit for move speed, but the lower limit is right around
 * about -75% movespeed (approximately equivalent to movespeed of 1).
 * ----------------------------------------------------------------------------
 * FOR POSITIVE:
 * There are three scaling tiers in speed boosts for positive tags.
 *
 * TIER 1:
 * For the first five positive points into speed boost, movespeed will be
 * increased by 10% per point.
 *  <speedBoost:1> = 10% speed boost.
 *  <speedBoost:2> = 20% speed boost.
 *  <speedBoost:3> = 30% speed boost.
 *  <speedBoost:4> = 40% speed boost.
 *  <speedBoost:5> = 50% speed boost.
 *
 * TIER 2:
 * For the second five positive points into speed boost, movespeed will be
 * increased by 5% per point.
 *  <speedBoost:6>  = (50% from before) +  5 = 55% speed boost.
 *  <speedBoost:7>  = (50% from before) + 10 = 60% speed boost.
 *  <speedBoost:8>  = (50% from before) + 15 = 65% speed boost.
 *  <speedBoost:9>  = (50% from before) + 20 = 55% speed boost.
 *  <speedBoost:10> = (50% from before) + 25 = 75% speed boost.
 *
 * TIER 3+:
 * And for all positive points after the second five, movespeed will be
 * increased by 2.5% per point.
 *  <speedBoost:11>  = (75% from before) +  2.5 = 55% speed boost.
 *  <speedBoost:12>  = (75% from before) +    5 = 60% speed boost.
 *  ...
 *  <speedBoost:25>  = (75% from before) + 37.5 = 112.5% speed boost.
 * ----------------------------------------------------------------------------
 * FOR NEGATIVE:
 * There are also three scaling tiers in speed boosts for negative tags.
 *
 * TIER 1:
 * For the first five negative points into speed boost, movespeed will be
 * decreased by 3% per point.
 *  <speedBoost:-1> = -3% speed boost.
 *  <speedBoost:-2> = -6% speed boost.
 *  <speedBoost:-3> = -9% speed boost.
 *  <speedBoost:-4> = -12% speed boost.
 *  <speedBoost:-5> = -15% speed boost.
 *
 * TIER 2:
 * For the second five negative points into speed boost, movespeed will be
 * decreased by 2% per point.
 *  <speedBoost:-6>  = (-15% from before) -  2 = -17% speed boost.
 *  <speedBoost:-7>  = (-15% from before) -  4 = -19% speed boost.
 *  <speedBoost:-8>  = (-15% from before) -  6 = -21% speed boost.
 *  <speedBoost:-9>  = (-15% from before) -  8 = -23% speed boost.
 *  <speedBoost:-10> = (-15% from before) - 10 = -25% speed boost.
 *
 * TIER 3+:
 * And for all positive points after the second five, movespeed will be
 * increased by 1% per point.
 *  <speedBoost:-11>  = (-25% from before) -  1 = -26% speed boost.
 *  <speedBoost:-12>  = (-25% from before) -  2 = -27% speed boost.
 *  ...
 *  <speedBoost:-25>  = (-25% from before) - 15 = -40% speed boost.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this extension plugin.
 */
J.ABS.EXT_SPEED = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ABS.EXT_SPEED.Metadata = {
  /**
   * The name of this plugin.
   */
  Name: `J-ABS-SpeedBoosts`,

  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.ABS.EXT_SPEED.PluginParameters = PluginManager.parameters(J.ABS.EXT_SPEED.Metadata.Name);

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.EXT_SPEED.Aliased = {
  Game_Actor: new Map(),
  Game_Character: new Map(),
  Game_Battler: new Map(),
  Game_Enemy: new Map(),
};

/**
 * All regular expressions used by this plugin.
 */
J.ABS.EXT_SPEED.RegExp = {
  BaseCastSpeed: /<baseCastTime:\[([+\-*/ ().\w]+)]>/gi,
};
//#endregion Introduction

//#region Game objects
//#region Game_Actor
/**
 * Extends {@link #onBattlerDataChange}.
 * Refreshes movement speed boosts when the battler's data changes.
 */
J.ABS.EXT_SPEED.Aliased.Game_Actor.set('onBattlerDataChange', Game_Actor.prototype.onBattlerDataChange);
Game_Actor.prototype.onBattlerDataChange = function()
{
  // perform original logic.
  J.ABS.EXT_SPEED.Aliased.Game_Actor.get('onBattlerDataChange').call(this);

  // update JABS-related things.
  this.refreshSpeedBoosts();
};
//#endregion Game_Actor

//#region Game_Battler
/**
 * Extends {@link Game_Battler.initMembers}.
 */
J.ABS.EXT_SPEED.Aliased.Game_Battler.set('initMembers', Game_Battler.prototype.initMembers);
Game_Battler.prototype.initMembers = function()
{
  // perform original logic.
  J.ABS.EXT_SPEED.Aliased.Game_Battler.get('initMembers').call(this);

  // initialize the extra members.
  this.initSpeedBoosts();
};

/**
 * Initializes the members for movement speed boosts.
 */
Game_Battler.prototype.initSpeedBoosts = function()
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
   * A grouping of all JABS properties associated with the speed boosts.
   */
  this._j._abs._speed = {};

  /**
   * The cached value for speed boosts modifier.
   * @type {number}
   */
  this._j._abs._speed._walkBoost = 0;

  // TODO: add dashing speed boost too?
};

/**
 * Gets the current walking speed boost scale for this battler.
 * @returns {number}
 */
Game_Battler.prototype.getWalkSpeedBoosts = function()
{
  return this._j._abs._speed._walkBoost;
};

/**
 * Sets the current speed bost scale for this battler.
 * @param {number} amount The new walking speed boost amount.
 */
Game_Battler.prototype.setWalkSpeedBoost = function(amount)
{
  this._j._abs._speed._walkBoost = amount;
};

/**
 * Updates the speed boost scale for this battler based on available notes.
 */
Game_Battler.prototype.refreshSpeedBoosts = function()
{
  // default to 0 of speed boost.
  let speedBoosts = 0;

  // get all things that have notes.
  const objectsToCheck = this.getAllNotes();

  // iterate over all valid note objects this battler has.
  objectsToCheck
    .filter(obj => obj.jabsSpeedBoost)
    .forEach(obj => speedBoosts += obj.jabsSpeedBoost);

  // update the speed boost value with the latest.
  this.setWalkSpeedBoost(speedBoosts);
};
//#endregion Game_Battler

//#region Game_Character
/**
 * Extends {@link Game_Character.distancePerFrame}.
 * Enables modification of the character's movement speed on the map.
 * @return {number} The modified distance per frame to move.
 */
J.ABS.EXT_SPEED.Aliased.Game_Character.set('distancePerFrame', Game_Character.prototype.distancePerFrame);
Game_Character.prototype.distancePerFrame = function()
{
  // determine base distance per frame.
  const base = J.ABS.EXT_SPEED.Aliased.Game_Character.get('distancePerFrame').call(this);

  // calculate the speed boost bonus based on the base.
  const bonus = this.calculateSpeedBoostBonus(base);

  // determine the sum of base + bonus.
  const total = (base + bonus);

  // make sure the total is within our minimum threshold so we don't moonwalk.
  // seriously, disable this line and get the result to be negative and see what happens.
  const constrainedTotal = Math.max(total, this.minimumDistancePerFrame());

  // return the sum.
  return constrainedTotal;
};

/**
 * Determines the bonus (or penalty) move speed for the player based on equipment.
 * @param {number} baseMoveSpeed The base distance per frame.
 */
Game_Character.prototype.calculateSpeedBoostBonus = function(baseMoveSpeed)
{
  // grab the battler that is moving.
  const battler = this.getJabsBattler();

  // if we have no player, then do not move
  if (!battler) return 0;

  // get the current speed boosts associated with the battler.
  const scale = battler.getBattler().getWalkSpeedBoosts();

  // if we have no boosts, then don't process.
  if (scale === 0) return 0;

  // get the multiplier.
  //const multiplier = (scale > 0) ? this.translatePositiveSpeedBoost(scale) : this.translateNegativeSpeedBoost(scale);
  const multiplier = (scale / 100);

  // calculate the move speed.
  const calculatedMoveSpeed = baseMoveSpeed * multiplier;

  // return the product.
  return calculatedMoveSpeed;
};

/**
 * Translates a scale of positive points into bonus move speed multiplier.
 * @param {number} scale The scale of points to translate into bonus move speed.
 * @returns {number} The multiplier against the base move speed.
 */
Game_Character.prototype.translatePositiveSpeedBoost = function(scale)
{
  // localize the scale because its a good practice.
  let localScale = scale;

  // initialize the boost.
  let boost = 0;

  // tier 1 boost = 10% per scale for 5 ranks (max +50%).
  if (localScale > 5)
  {
    // shortcut the calculated boost.
    boost += 0.5;

    // reduce the scale to continue.
    localScale -= 5;
  }
  // we have less than 5 so lets math it out.
  else
  {
    // math out the new movespeed boost.
    boost += (localScale * 0.1);

    // return the calculated boost.
    return boost;
  }

  // tier 2 boost = 5% per scale for 5 ranks (max +25%).
  if (localScale > 5)
  {
    // shortcut the calculated boost.
    boost += 0.25;

    // reduce the scale to continue.
    localScale -= 5;
  }
  // we have less than 5 so lets math it out.
  else
  {
    // math out the new movespeed boost.
    boost += (localScale * 0.05);

    // return the calculated boost.
    return boost;
  }

  // tier 3 boost = 2.5% per scale for all remaining ranks.
  const t3scale = 0.025;
  boost += (localScale * t3scale);

  // return our calculated boost from all tiers of speed boost.
  return boost;
};

/**
 * Translates a scale of positive points into penalty move speed multiplier.
 * @param {number} scale The scale of points to translate into penalty move speed.
 * @returns {number} The multiplier against the base move speed.
 */
Game_Character.prototype.translateNegativeSpeedBoost = function(scale)
{
  // normalize the scale because its easier that way.
  let normalizedScale = Math.abs(scale);
  let boost = 0.00000;

  // tier 1 boost = 3% per scale for 5 ranks (max -15%).
  const t1scale = 0.03;
  if (scale > 5)
  {
    boost -= (t1scale * 5);
    normalizedScale -= 5;
  }
  else
  {
    boost -= (normalizedScale * t1scale);
    return boost;
  }

  // tier 2 boost = 2% per scale for 5 ranks (max -10%) again.
  const t2scale = 0.02;
  if (scale > 5)
  {
    boost -= (t2scale * 5);
    normalizedScale -= 5;
  }
  else
  {
    boost -= (normalizedScale * t2scale);
    return boost;
  }

  // tier 3 boost = 1% per scale for all remaining ranks.
  const t3scale = 0.01;
  boost -= (normalizedScale * t3scale);

  // return our calculated boost from all tiers of speed boost.
  return boost;
};

/**
 * Gets the minimum distance to move per frame.
 * @returns {number}
 */
Game_Character.prototype.minimumDistancePerFrame = function()
{
  // the minimum speed is "2" aka "4x slower" according to events.
  const minimumDistance = 0.015625;

  // return the calculated amount.
  return minimumDistance;
};
//#endregion Game_Character

//#region Game_Enemy
/**
 * Extends {@link #onBattlerDataChange}.
 * Refreshes movement speed boosts when the battler's data changes.
 */
J.ABS.EXT_SPEED.Aliased.Game_Enemy.set('onBattlerDataChange', Game_Enemy.prototype.onBattlerDataChange);
Game_Enemy.prototype.onBattlerDataChange = function()
{
  // perform original logic.
  J.ABS.EXT_SPEED.Aliased.Game_Enemy.get('onBattlerDataChange').call(this);

  // update JABS-related things.
  this.refreshSpeedBoosts();
};
//#endregion Game_Enemy
//#endregion Game objects

//#region RPG objects
//#region RPG_Base
/**
 * The movement speed modifier from this from database object.
 * @type {number|null}
 */
Object.defineProperty(RPG_Base.prototype, "jabsSpeedBoost",
  {
    get: function()
    {
      return this.getJabsSpeedBoost();
    },
  });

/**
 * Gets the movement speed modifier from this database object.
 * @returns {number|null}
 */
RPG_Base.prototype.getJabsSpeedBoost = function()
{
  return this.extractJabsSpeedBoost()
};

/**
 * Gets the value from its notes.
 * @returns {number|null}
 */
RPG_Base.prototype.extractJabsSpeedBoost = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SpeedBoost, true);
};
//#endregion RPG_Base
//#endregion RPG objects