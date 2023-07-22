//region Game_TextLog
/**
 * TODO: make static, rename to TextLogManager.
 * The manager that handles all logs in the `Window_TextLog`.
 */
function Game_TextLog()
{
  this.initialize(...arguments);
}

Game_TextLog.prototype = {};
Game_TextLog.prototype.constructor = Game_TextLog;

/**
 * Initializes this class.
 */
Game_TextLog.prototype.initialize = function()
{
  this.initMembers();
};

/**
 * Initializes all properties for this class.
 */
Game_TextLog.prototype.initMembers = function()
{
  /**
   * The logs currently being managed.
   * @type {Map_Log[]}
   */
  this._logs = [];

  /**
   * Whether or not we have an unattended log.
   * @type {boolean}
   */
  this._hasNewLog = false;

  /**
   * Whether or not the log window should be visible.
   * @type {boolean}
   */
  this._isVisible = true;
};

/**
 * Gets whether or not we are tracking any logs.
 * @returns {boolean} True if we are, false otherwise.
 */
Game_TextLog.prototype.hasLogs = function()
{
  return this._logs.length > 0;
};

/**
 * Gets whether or not we have an unattended log.
 * @returns {boolean} True if we have unattended logs, false otherwise.
 */
Game_TextLog.prototype.hasNewLog = function()
{
  return this._hasNewLog;
};

/**
 * Sets whether or not we have an unattended log.
 * @param {boolean} hasNewLog True if we need to handle a new log, false otherwise.
 */
Game_TextLog.prototype.setHasNewLog = function(hasNewLog = true)
{
  this._hasNewLog = hasNewLog;
};

/**
 * Untoggles the flag and acknowledges the newly received log.
 */
Game_TextLog.prototype.acknowledgeNewLog = function()
{
  this._hasNewLog = false;
};

/**
 * Gets all currently pending logs.
 * @returns {Map_Log[]} All logs currently in queue.
 */
Game_TextLog.prototype.getLogs = function()
{
  return this._logs;
};

/**
 * Adds a new text log to the window.
 * @param {Map_Log} log The log to add to the window.
 */
Game_TextLog.prototype.addLog = function(log)
{
  // add a log to the collection.
  this._logs.push(log);

  // make sure we don't have too many logs to work with.
  this.handleLogCount();

  // alert any listeners that we have a new log.
  this.setHasNewLog();
};

/**
 * Manages the logs in our local store to ensure we don't have too many.
 */
Game_TextLog.prototype.handleLogCount = function()
{
  // check if we have too many logs.
  while (this.hasTooManyLogs())
  {
    // remove from the front until we are within the threshold.
    this._logs.shift();
  }
};

/**
 * Determines whether or not we have too many logs in our local store.
 * @returns {boolean} True if we have too many, false otherwise.
 */
Game_TextLog.prototype.hasTooManyLogs = function()
{
  return (this._logs.length > 100);
};

/**
 * Empties the currently pending logs.
 */
Game_TextLog.prototype.clearLogs = function()
{
  this._logs.splice(0, this._logs.length);
};

/**
 * Gets whether or not the log window should be visible.
 * @returns {boolean}
 */
Game_TextLog.prototype.isVisible = function()
{
  return this._isVisible;
};

/**
 * Sets the log window's visibility.
 * @param {boolean} visible Whether or not the log window should be visible.
 */
Game_TextLog.prototype.setLogVisibility = function(visible)
{
  this._isVisible = visible;
};
//endregion Game_TextLog