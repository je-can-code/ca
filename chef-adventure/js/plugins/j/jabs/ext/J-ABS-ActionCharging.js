//#region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 CHARGE] Enable skills to be charged to perform other skills.
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
J.ABS.EXT_CHARGE = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ABS.EXT_CHARGE.Metadata = {
  /**
   * The name of this plugin.
   */
  Name: `J-ABS-ActionCharging`,

  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.ABS.EXT_CHARGE.PluginParameters = PluginManager.parameters(J.ABS.EXT_CHARGE.Metadata.Name);

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.EXT_CHARGE.Aliased = {
  Game_Actor: new Map(),
  Game_Battler: new Map(),
  Game_BattlerBase: new Map(),
  Game_Enemy: new Map(),
  JABS_Action: new Map(),
  JABS_Battler: new Map(),
  JABS_InputController: new Map(),
};

/**
 * All regular expressions used by this plugin.
 */
J.ABS.EXT_CHARGE.RegExp = {
  BaseCastSpeed: /<baseCastTime:\[([+\-*/ ().\w]+)]>/gi,
};
//#endregion Introduction

//#region existing JABS objects
//#region JABS_Inputcontroller
J.ABS.EXT_CHARGE.Aliased.JABS_InputController
  .set('updateMainhandAction', JABS_InputController.prototype.updateMainhandAction);
JABS_InputController.prototype.updateMainhandAction = function()
{
  // perform original logic.
  J.ABS.EXT_CHARGE.Aliased.JABS_InputController.get('updateMainhandAction').call(this);

  if (this.isMainhandActionCharging())
  {
    this.performMainhandChargeAction();
  }
  else
  {
    this.performMainhandChargeAlterAction();
  }
};

/**
 * Checks the inputs of the mainhand action currently assigned (A default).
 * @returns {boolean}
 */
JABS_InputController.prototype.isMainhandActionCharging = function()
{
  // if the player is preparing to use a skill, don't do this as well.
  if (!this.canChargeMainhandAction()) return false;

  // this action requires A to be held down.
  if (Input.isLongPressed(J.ABS.Input.Mainhand)) return true;

  // A is not being held down.
  return false;
};

JABS_InputController.prototype.canChargeMainhandAction = function()
{
  // do not charge if we are just mashing the button.
  if (this.isMainhandActionTriggered()) return false;

  // do not charge the mainhand if we are trying to use combat skills.
  if (this.isCombatSkillUsageEnabled()) return false;

  // we can charge!
  return true;
};

JABS_InputController.prototype.performMainhandChargeAction = function()
{
  console.log('charging!');
};

JABS_InputController.prototype.performMainhandChargeAlterAction = function()
{
  console.log('not charging...');
};
//#endregion JABS_Inputcontroller

//#region JABS_Battler
/**
 * Extends {@link JABS_Battler.initBattleInfo}.
 * Also initializes the charge-related data.
 */
J.ABS.EXT_CHARGE.Aliased.JABS_Battler.set('initBattleInfo', JABS_Battler.prototype.initBattleInfo);
JABS_Battler.prototype.initBattleInfo = function()
{
  // perform original logic.
  J.ABS.EXT_CHARGE.Aliased.JABS_Battler.get('initBattleInfo').call(this);

  // initialize the charge-related members.
  this.initChargeData();
};

/**
 * Initialize the properties associated with charging skills.
 */
JABS_Battler.prototype.initChargeData = function()
{
  /**
   * Whether or not this battler is charging up a skill for use.
   * @type {boolean}
   */
  this._charging = false;

  /**
   * The slot associated with the current charging.
   * @type {null|string}
   */
  this._chargeSlot = null;

  /**
   * The number of frames the slot being charged has been charged for in the current tier.
   * @type {number}
   */
  this._chargeDuration = 0;

  /**
   * The total number of frames that this slot has been charging, all tiers included.
   * @type {number}
   */
  this._chargeTotalDuration = 0;

  /**
   * The maximum number of frames the slot being charged can be charged to.
   * @type {number}
   */
  this._chargeMax = 0;

  /**
   * The tier of which this skill is currently charged to.
   * @type {number}
   */
  this._chargeTier = 0;

  /**
   * The maximum tier of charging this skill can be charged to.
   * @type {number}
   */
  this._chargeTierMax = 0;

};

/**
 * Gets whether or not this battler is charging a skill.
 * @returns {boolean}
 */
JABS_Battler.prototype.isCharging = function()
{
  return this._charging;
};

/**
 * Begins the charging process.
 */
JABS_Battler.prototype.beginCharging = function()
{
  this._charging = true;
};

/**
 * Stops the charging process.
 */
JABS_Battler.prototype.stopCharging = function()
{
  this._charging = false;
};

/**
 * Gets the slot that is currently being charged.
 * @returns {string|null} The slot being charged, or `null` if nothing is being charged.
 */
JABS_Battler.prototype.getChargingSlot = function()
{
  return this._chargeSlot;
};

/**
 * Sets the slot that is currently being charged.
 * @param {string} slot The slot being charged.
 */
JABS_Battler.prototype.setChargingSlot = function(slot)
{
  this._chargeSlot = slot;
};

/**
 * Gets the current number of frames that the battler has been charging this tier.
 * @returns {number}
 */
JABS_Battler.prototype.getCurrentChargeDuration = function()
{
  return this._chargeDuration;
};

/**
 * Sets the current number of frames that the battler has been charging.
 * @param {number} amount The new duration.
 */
JABS_Battler.prototype.setCurrentChargeDuration = function(amount)
{
  this._chargeDuration = amount;
};

/**
 * Gets the total number of frames that the battler has been charging.
 * @returns {number}
 */
JABS_Battler.prototype.getTotalChargeDuration = function()
{
  return this._chargeTotalDuration;
};

/**
 * Sets the total number of frames that the battler has been charging.
 * @param {number} amount The new duration.
 */
JABS_Battler.prototype.setTotalChargeDuration = function(amount)
{
  this._chargeTotalDuration = amount;
};

/**
 * Gets the max duration that can be charged for the current tier.
 * @returns {number}
 */
JABS_Battler.prototype.getMaxChargeDuration = function()
{
  return this._chargeMax;
};

/**
 * Sets the max duration that can be charged for the current tier.
 * @param {number} amount The new duration.
 */
JABS_Battler.prototype.setMaxChargeDuration = function(amount)
{
  this._chargeMax = amount;
};

/**
 * Gets the max tier of charging the skill can be charged to.
 * @returns {number}
 */
JABS_Battler.prototype.getMaxChargeTier = function()
{
  return this._chargeTierMax;
};

/**
 * Sets the max duration that can be charged for the current tier.
 * @param {number} amount The new tier level.
 */
JABS_Battler.prototype.setMaxChargeTier = function(amount)
{
  this._chargeTierMax = amount;
};

/**
 * Resets all charge-related data back to default values.
 */
JABS_Battler.prototype.resetChargeData = function()
{
  // remove the set charging slot.
  this.setChargingSlot(null);

  // zero the current charge duration.
  this.setCurrentChargeDuration(0);

  // zero the max charge duration of this tier.
  this.setMaxChargeDuration(0);

  // zero the max charge tier.
  this.setMaxChargeTier(0);

  // zero the total duration charged.
  this.setTotalChargeDuration(0);
};

/**
 * Sets up the required data points for charging a skill.
 * @param {string} slot The slot that is being charged.
 * @param {number} maxChargeTier The maximum number of tiers the slot can be charged.
 * @param {number} maxChargeDuration The number of frames required to
 */
JABS_Battler.prototype.setupCharging = function(slot, maxChargeTier, maxChargeDuration)
{
  // battlers cannot setup charging if already charging.
  if (this.isCharging()) return;

  // setup the required data points for charging.
  this.setChargingSlot(slot);
  this.setMaxChargeTier(maxChargeTier);
  this.setMaxChargeDuration(maxChargeDuration);
};
//#endregion JABS_Battler
//#endregion existing JABS objects

//#region new JABS objects
//#region JABS_ChargingTier
/**
 * A single charging tier derived from a skill in a slot to be charged.
 */
class JABS_ChargingTier
{
  /**
   * The number of frames that this tier must be charged to be completed.
   * @type {number}
   */
  duration = 0;

  /**
   * The tier number for this {@link JABS_ChargingTier}.
   * @type {number}
   */
  tier = 0;

  /**
   * The skill id that can be executed when this tier is charged.
   * @type {number}
   */
  skillId = 0;

  /**
   * Whether or not this tier has completed charging.
   * @type {boolean}
   */
  completed = false;

  /**
   * Constructor.
   * @param {number} duration The duration for this tier.
   * @param {number} tier The number of tier this is.
   * @param {number} skillId The skill to be executed on charge-up.
   */
  constructor(duration, tier, skillId)
  {
    this.duration = duration;
    this.tier = tier;
    this.skillId = skillId;
  }
}
//#endregion JABS_ChargingTier
//#endregion new JABS objects