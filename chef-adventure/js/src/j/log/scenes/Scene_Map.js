//region Scene_Map
/**
 * Hooks into `initialize` to add our log.
 */
J.LOG.Aliased.Scene_Map.set('initialize', Scene_Map.prototype.initialize);
Scene_Map.prototype.initialize = function()
{
  // perform original logic.
  J.LOG.Aliased.Scene_Map.get('initialize').call(this);

  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with this plugin.
   */
  this._j._log = {};

  /**
   * The action log for the map.
   * @type {Window_MapLog}
   */
  this._j._log._actionLog = null;
};

/**
 * Extends {@link #onMapLoaded}.
 * Creates the action log as well.
 * // TODO: can this be migrated to the {@link #createAllWindows} method like normal windows?
 */
J.LOG.Aliased.Scene_Map.set('onMapLoaded', Scene_Map.prototype.onMapLoaded);
Scene_Map.prototype.onMapLoaded = function()
{
  // perform original logic.
  J.LOG.Aliased.Scene_Map.get('onMapLoaded').call(this);

  // create the log.
  this.createActionLogWindow();
};

//region action log
/**
 * Creates the action log window and adds it to tracking.
 */
Scene_Map.prototype.createActionLogWindow = function()
{
  // create the window.
  const window = this.buildActionLogWindow();

  // update the tracker with the new window.
  this.setActionLogWindow(window);

  // add the window to the scene manager's tracking.
  this.addWindow(window);
};

/**
 * Sets up and defines the action log window.
 * @returns {Window_MapLog}
 */
Scene_Map.prototype.buildActionLogWindow = function()
{
  // define the rectangle of the window.
  const rectangle = this.actionLogWindowRect();

  // create the window with the rectangle.
  const window = new Window_MapLog(rectangle);

  // deselect/deactivate the window so we don't have it look interactable.
  window.deselect();
  window.deactivate();

  // return the built and configured window.
  return window;
}

/**
 * Creates the rectangle representing the window for the action log.
 * @returns {Rectangle}
 */
Scene_Map.prototype.actionLogWindowRect = function()
{
  // an arbitrary number of rows.
  const rows = 8;

  // define the width of the window.
  const width = 600;

  // define the height of the window.
  const height = (Window_MapLog.rowHeight * (rows + 2)) - 8;

  // define the origin x of the window.
  const x = Graphics.boxWidth - width;

  // define the origin y of the window.
  const y = Graphics.boxHeight - height - 72;

  // return the built rectangle.
  return new Rectangle(x, y, width, height);
};

/**
 * Gets the currently tracked action log window.
 * @returns {Window_MapLog}
 */
Scene_Map.prototype.getActionLogWindow = function()
{
  return this._j._log._actionLog;
}

/**
 * Set the currently tracked action log window to the given window.
 * @param {Window_MapLog} window The window to track.
 */
Scene_Map.prototype.setActionLogWindow = function(window)
{
  this._j._log._actionLog = window;
}
//endregion action log
//endregion Scene_Map