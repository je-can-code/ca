//region OneTimeItemBoost
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
//endregion OneTimeItemBoost