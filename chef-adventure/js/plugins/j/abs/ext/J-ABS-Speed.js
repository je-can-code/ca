//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 MOVE] Enable modifying move speeds.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW
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
 * Multiple tags across multiple objects on a single battler will stack
 * additively.
 *
 * NOTE2:
 * There is no upper limit of move speed, so be careful!
 * There is a(n arbitrary) lower limit, of -90% move speed multiplier.
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
 * Where NUM is the positive/negative percent modifier against base movespeed.
 *
 * EXAMPLE:
 *  <speedBoost:40>
 * This battler's movement speed will be increased by ~40%.
 *
 *  <speedBoost:-26>
 * This battler's movement speed will be decreased by ~26%.
 *
 *  <speedBoost:11>
 * This battler's movement speed will be increased by ~11%.
 *
 *  <speedBoost:70>
 *  <speedBoost:-50>
 *  <speedBoost:-10>
 *  <speedBoost:30>
 * This battler's movement speed will be increased by ~40%.
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
J.ABS.EXT.SPEED = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ABS.EXT.SPEED.Metadata = {
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
J.ABS.EXT.SPEED.PluginParameters = PluginManager.parameters(J.ABS.EXT.SPEED.Metadata.Name);

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.EXT.SPEED.Aliased = {
  Game_Actor: new Map(),
  Game_Character: new Map(),
  Game_Battler: new Map(),
  Game_Enemy: new Map(),

  TextManager: new Map(),
  IconManager: new Map(),
};

/**
 * All regular expressions used by this plugin.
 */
J.ABS.EXT.SPEED.RegExp = {
  WalkSpeedBoost: /<speedBoost:[ ]?([-]?\d+)>/gi,
};
//endregion Introduction

//region RPG_Base
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
  return this.getNumberFromNotesByRegex(J.ABS.EXT.SPEED.RegExp.WalkSpeedBoost, true);
};
//endregion RPG_Base

//region IconManager
/**
 * Extend {@link #longParam}.<br>
 * First checks if the paramId was the move speed boost, then checks others.
 */
J.ABS.EXT.SPEED.Aliased.IconManager.set('longParam', IconManager.longParam)
IconManager.longParam = function(paramId)
{
  switch (paramId)
  {
    case 31:
      return this.movespeed(); // move
    default:
      return J.ABS.EXT.SPEED.Aliased.IconManager.get('longParam').call(this, paramId);
  }
};

/**
 * Gets the icon index for the move speed boost.
 * @returns {number}
 */
IconManager.movespeed = function()
{
  return 978;
};
//endregion IconManager

//region TextManager
/**
 * Extends {@link #longParam}.<br>
 * First checks if this is the move speed parameter, then checks others.
 */
J.ABS.EXT.SPEED.Aliased.TextManager.set('longParam', TextManager.longParam);
TextManager.longParam = function(paramId)
{
  switch (paramId)
  {
    case 31:
      return this.movespeed(); // move speed boost
    default:
      // perform original logic.
      return J.ABS.EXT.SPEED.Aliased.TextManager.get('longParam').call(this, paramId);
  }
};

/**
 * Gets the proper name of "move speed boost".
 * @returns {string}
 */
TextManager.movespeed = function()
{
  return "Move Boost";
};

/**
 * Extends {@link #longParamDescription}.<br>
 * First checks if this is the move speed parameter, then checks others.
 */
J.ABS.EXT.SPEED.Aliased.TextManager.set('longParamDescription', TextManager.longParamDescription);
TextManager.longParamDescription = function(paramId)
{
  switch (paramId)
  {
    case 31:
      return this.moveSpeedDescription(); // move speed boost
    default:
      // perform original logic.
      return J.ABS.EXT.SPEED.Aliased.TextManager.get('longParamDescription').call(this, paramId);
  }
};

/**
 * Gets the description text for the move speed boost.
 * @returns {string[]}
 */
TextManager.moveSpeedDescription = function()
{
  return [
    "The percentage modifier against this character's base movespeed.",
    "Higher amounts of this result in faster walk and run speeds."
  ];
};
//endregion TextManager

//region Game_Actor
/**
 * Extends {@link #onBattlerDataChange}.<br>
 * Refreshes movement speed boosts when the battler's data changes.
 */
J.ABS.EXT.SPEED.Aliased.Game_Actor.set('onBattlerDataChange', Game_Actor.prototype.onBattlerDataChange);
Game_Actor.prototype.onBattlerDataChange = function()
{
  // perform original logic.
  J.ABS.EXT.SPEED.Aliased.Game_Actor.get('onBattlerDataChange').call(this);

  // update JABS-related things.
  this.refreshSpeedBoosts();
};
//endregion Game_Actor

//region Game_Battler
/**
 * Extends {@link Game_Battler.initMembers}.<br>
 */
J.ABS.EXT.SPEED.Aliased.Game_Battler.set('initMembers', Game_Battler.prototype.initMembers);
Game_Battler.prototype.initMembers = function()
{
  // perform original logic.
  J.ABS.EXT.SPEED.Aliased.Game_Battler.get('initMembers').call(this);

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
//endregion Game_Battler

//region Game_Character
/**
 * Extends {@link Game_Character.distancePerFrame}.<br>
 * Enables modification of the character's movement speed on the map.
 * @return {number} The modified distance per frame to move.
 */
J.ABS.EXT.SPEED.Aliased.Game_Character.set('distancePerFrame', Game_Character.prototype.distancePerFrame);
Game_Character.prototype.distancePerFrame = function()
{
  // determine base distance per frame.
  const base = J.ABS.EXT.SPEED.Aliased.Game_Character.get('distancePerFrame').call(this);

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

  // constrained scale, to prevent going into moonwalk mode; defaults to minimum -90% penalty.
  const constrainedScale = Math.max(this.minimumWalkSpeedBoost(), scale);

  // get the multiplier.
  const multiplier = (constrainedScale / 100);

  // calculate the move speed.
  const calculatedMoveSpeed = baseMoveSpeed * multiplier;

  // return the product.
  return calculatedMoveSpeed;
};

Game_Character.prototype.minimumWalkSpeedBoost = function()
{
  return -90;
};

/**
 * Gets the minimum distance to move per frame.
 * @returns {number}
 */
Game_Character.prototype.minimumDistancePerFrame = function()
{
  // the minimum speed is "2" aka "4x slower" according to events.
  // remove comment to let it go lower, but be careful, thats really low!
  const minimumDistance = 0.015625; // / 2;

  // return the calculated amount.
  return minimumDistance;
};
//endregion Game_Character

//region Game_Enemy
/**
 * Extends {@link #onBattlerDataChange}.<br>
 * Refreshes movement speed boosts when the battler's data changes.
 */
J.ABS.EXT.SPEED.Aliased.Game_Enemy.set('onBattlerDataChange', Game_Enemy.prototype.onBattlerDataChange);
Game_Enemy.prototype.onBattlerDataChange = function()
{
  // perform original logic.
  J.ABS.EXT.SPEED.Aliased.Game_Enemy.get('onBattlerDataChange').call(this);

  // update JABS-related things.
  this.refreshSpeedBoosts();
};
//endregion Game_Enemy