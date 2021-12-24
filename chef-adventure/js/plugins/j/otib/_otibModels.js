/*:
 * @target MZ
 * @plugindesc
 * [v1.0 OTIB] The various custom models created for OTIB.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-OneTimeItemBoost
 * @orderBefore J-OneTimeItemBoost
 * @help
 * ============================================================================
 * A component of OTIB (one time item boost).
 * This is a cluster of all models that honestly deserved their own file, but
 * that is mighty inconvenient for plugin consumers, so now its all in one.
 * ============================================================================
 */

//#region OneTimeItemBoost
/**
 * A class representing the permanent data of a one time boost from a single item.
 */
function OneTimeItemBoost()
{
  this.initialize(...arguments);
}

OneTimeItemBoost.prototype = {};
OneTimeItemBoost.prototype.constructor = OneTimeItemBoost;
OneTimeItemBoost.prototype.initialize = function(itemId, parameterData)
{
  /**
   * The item id this one time item boost represents.
   * @type {number}
   */
  this.itemId = itemId;

  /**
   * The parameter data this boost will grant permanently upon consumption.
   * @type {OneTimeItemBoostParam[]}
   */
  this.parameterData = parameterData;
  this.initMembers();
};

/**
 * Initializes the rest of the members of this class with default parameters.
 */
OneTimeItemBoost.prototype.initMembers = function()
{
  /**
   * Whether or not this boost has been unlocked.
   * @type {boolean}
   */
  this.unlocked = false;
};

/**
 * Gets whether or not this boost is unlocked.
 * @returns {boolean}
 */
OneTimeItemBoost.prototype.isUnlocked = function()
{
  return this.unlocked;
};

/**
 * Unlocks this boost.
 */
OneTimeItemBoost.prototype.unlock = function()
{
  this.unlocked = true;
};

/**
 * Locks this boost.
 */
OneTimeItemBoost.prototype.lock = function()
{
  this.unlocked = false;
};
//#endregion OneTimeItemBoost

//#region OneTimeItemBoostParam
/**
 * A class representing the permanent data of a one time boost from a single item.
 */
function OneTimeItemBoostParam()
{
  this.initialize(...arguments);
}

OneTimeItemBoostParam.prototype = {};
OneTimeItemBoostParam.prototype.constructor = OneTimeItemBoostParam;
OneTimeItemBoostParam.prototype.initialize = function(paramId, boost, isPercent)
{
  /**
   * The parameter id this parameter boost represents.
   * @type {number}
   */
  this.paramId = paramId;

  /**
   * The value of the parameter boost.
   * @type {number}
   */
  this.boost = boost;

  /**
   * Whether or not this boost is a multiplicative parameter boost or not.
   * @type {boolean}
   */
  this.isPercent = isPercent;
};
//#endregion OneTimeItemBoostParam
//ENDOFFILE