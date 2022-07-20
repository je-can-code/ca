/**
 * Extends {@link Game_Temp.initialize}.
 * Initializes all members of this class and adds our custom members.
 */
J.UTILS.Aliased.Game_Temp.set('initialize', Game_Temp.prototype.initialize);
Game_Temp.prototype.initialize = function()
{
  // perform original logic.
  J.UTILS.Aliased.Game_Temp.get('initialize').call(this);

  this.initMembers();
};

/**
 * Intializes all additional members of this class.
 */
Game_Temp.prototype.initMembers = function()
{
  this._j = {};
  this._j._utils = {};

  /**
   * Whether or not to use the click-to-log-event functionality.
   * @type {boolean}
   */
  this._j._utils._useClickToLogEvent = true;
};

/**
 * Gets whether or not to use the click-to-log-event functionality.
 * @returns {boolean}
 */
Game_Temp.prototype.canClickToLogEvent = function()
{
  return this._j._utils._useClickToLogEvent;
};

/**
 * Enables the click-to-log-event functionality.
 */
Game_Temp.prototype.enableClickToLogEvent = function()
{
  this._j._utils._useClickToLogEvent = true;
};

/**
 * Disables the click-to-log-event functionality.
 */
Game_Temp.prototype.disableClickToLogEvent = function()
{
  this._j._utils._useClickToLogEvent = false;
};