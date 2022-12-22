//region JABS_BattlerCoreData
/**
 * A class containing all the data extracted from the comments of an event's
 * comments and contained with friendly methods to access and manipulate.
 */
function JABS_BattlerCoreData()
{
  this.initialize(...arguments);
}

JABS_BattlerCoreData.prototype = {};
JABS_BattlerCoreData.prototype.constructor = JABS_BattlerCoreData;

/**
 * Initializes this battler data object.
 * @param {number} battlerId This enemy id.
 * @param {number} teamId This battler's team id.
 * @param {JABS_EnemyAI} battlerAI This battler's converted AI.
 * @param {number} sightRange The sight range.
 * @param {number} alertedSightBoost The boost to sight range while alerted.
 * @param {number} pursuitRange The pursuit range.
 * @param {number} alertedPursuitBoost The boost to pursuit range while alerted.
 * @param {number} alertDuration The duration in frames of how long to remain alerted.
 * @param {boolean} canIdle Whether or not this battler can idle.
 * @param {boolean} showHpBar Whether or not to show the hp bar.
 * @param {boolean} showBattlerName Whether or not to show the battler's name.
 * @param {boolean} isInvincible Whether or not this battler is invincible.
 * @param {boolean} isInanimate Whether or not this battler is inanimate.
 */
JABS_BattlerCoreData.prototype.initialize = function({
  battlerId,
  teamId,
  battlerAI,
  sightRange,
  alertedSightBoost,
  pursuitRange,
  alertedPursuitBoost,
  alertDuration,
  canIdle,
  showHpBar,
  showBattlerName,
  isInvincible,
  isInanimate
})
{
  /**
   * The id of the enemy that this battler represents.
   * @type {number}
   */
  this._battlerId = battlerId;

  /**
   * The id of the team this battler belongs to.
   * @type {number}
   */
  this._teamId = teamId;

  /**
   * The converted-from-binary AI of this battler.
   * @type {JABS_EnemyAI}
   */
  this._battlerAI = battlerAI;

  /**
   * The base range that this enemy can and engage targets within.
   * @type {number}
   */
  this._sightRange = sightRange;

  /**
   * The boost to sight range this enemy gains while alerted.
   * @type {number}
   */
  this._alertedSightBoost = alertedSightBoost;

  /**
   * The base range that this enemy will pursue it's engaged target.
   * @type {number}
   */
  this._pursuitRange = pursuitRange;

  /**
   * The boost to pursuit range this enemy gains while alerted.
   * @type {number}
   */
  this._alertedPursuitBoost = alertedPursuitBoost;

  /**
   * The duration in frames that this enemy will remain alerted.
   * @type {number}
   */
  this._alertDuration = alertDuration;

  /**
   * Whether or not this battler will move around while idle.
   * @type {boolean} True if the battler can move while idle, false otherwise.
   */
  this._canIdle = canIdle;

  /**
   * Whether or not this battler's hp bar will be visible.
   * @type {boolean} True if the battler's hp bar should show, false otherwise.
   */
  this._showHpBar = showHpBar;

  /**
   * Whether or not this battler's name will be visible.
   * @type {boolean} True if the battler's name should show, false otherwise.
   */
  this._showBattlerName = showBattlerName;

  /**
   * Whether or not this battler is invincible.
   *
   * Invincible is defined as: `actions will not collide with this battler`.
   * @type {boolean} True if the battler is invincible, false otherwise.
   */
  this._isInvincible = isInvincible;

  /**
   * Whether or not this battler is inanimate. Inanimate battlers have a few
   * unique traits, those being: cannot idle, hp bar is hidden, cannot be alerted,
   * does not play deathcry when defeated, and cannot engage in battle.
   * @type {boolean} True if the battler is inanimate, false otherwise.
   */
  this._isInanimate = isInanimate;

  this.initMembers()
};

/**
 * Initializes all properties of this class.
 * This is effectively a hook for adding extra properties into this object.
 */
JABS_BattlerCoreData.prototype.initMembers = function()
{ };

/**
 * Gets this battler's enemy id.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.battlerId = function()
{
  return this._battlerId;
};

/**
 * Gets this battler's team id.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.team = function()
{
  return this._teamId;
};

/**
 * Gets this battler's AI.
 * @returns {JABS_EnemyAI}
 */
JABS_BattlerCoreData.prototype.ai = function()
{
  return this._battlerAI;
};

/**
 * Gets the base range that this enemy can engage targets within.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.sightRange = function()
{
  return this._sightRange;
};

/**
 * Gets the boost to sight range while alerted.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.alertedSightBoost = function()
{
  return this._alertedSightBoost;
};

/**
 * Gets the base range that this enemy will pursue it's engaged target.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.pursuitRange = function()
{
  return this._pursuitRange;
};

/**
 * Gets the boost to pursuit range while alerted.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.alertedPursuitBoost = function()
{
  return this._alertedPursuitBoost;
};

/**
 * Gets the duration in frames for how long this battler remains alerted.
 * @returns {number}
 */
JABS_BattlerCoreData.prototype.alertDuration = function()
{
  return this._alertDuration;
};

/**
 * Gets whether or not this battler will move around while idle.
 * @returns {boolean}
 */
JABS_BattlerCoreData.prototype.canIdle = function()
{
  return this._canIdle;
};

/**
 * Gets whether or not this battler's hp bar will be visible.
 * @returns {boolean}
 */
JABS_BattlerCoreData.prototype.showHpBar = function()
{
  return this._showHpBar;
};

/**
 * Gets whether or not this battler's name will be visible.
 * @returns {boolean}
 */
JABS_BattlerCoreData.prototype.showBattlerName = function()
{
  return this._showBattlerName;
};

/**
 * Gets whether or not this battler is `invincible`.
 * @returns {boolean}
 */
JABS_BattlerCoreData.prototype.isInvincible = function()
{
  return this._isInvincible;
};

/**
 * Gets whether or not this battler is `inanimate`.
 * @returns {boolean}
 */
JABS_BattlerCoreData.prototype.isInanimate = function()
{
  return this._isInanimate;
};
//endregion JABS_BattlerCoreData