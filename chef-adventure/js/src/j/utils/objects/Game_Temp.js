/**
 * Extends {@link Game_Temp.prototype.initMembers}.
 * Intializes all additional members of this class.
 */
J.UTILS.Aliased.Game_Temp.set('initMembers', Game_Temp.prototype.initMembers);
Game_Temp.prototype.initMembers = function()
{
  // perform original logic.
  J.UTILS.Aliased.Game_Temp.get('initMembers').call(this);

  /**
   * The over-arching J object to contain all additional plugin parameters.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with JABS.
   */
  this._j._utils ||= {};

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