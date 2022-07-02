//#region Scene_Map
/**
 * Hooks into `initialize` to add our log.
 */
J.LOG.Aliased.Scene_Map.initialize = Scene_Map.prototype.initialize;
Scene_Map.prototype.initialize = function()
{
  // perform original logic.
  J.LOG.Aliased.Scene_Map.initialize.call(this);

  /**
   * All encompassing _j object for storing this plugin's properties.
   * @type {{}}
   * @private
   */
  this._j ||= {};

  /**
   * The log window on the map.
   * @type {Window_MapLog}
   */
  this._j._log = null;
};

/**
 * Once the map is loaded, create the text log.
 */
J.LOG.Aliased.Scene_Map.onMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function()
{
  // perform original logic.
  J.LOG.Aliased.Scene_Map.onMapLoaded.call(this);

  // create the log.
  this.createTextLog();
};

/**
 * Creates the log window and adds it to tracking.
 */
Scene_Map.prototype.createTextLog = function()
{
  // create the rectangle of the window.
  const rect = this.textLogWindowRect();

  // assign the window to our reference.
  this._j._log = new Window_MapLog(rect);

  // deselect/deactivate the window so we don't have it look interactable.
  this._j._log.deselect();
  this._j._log.deactivate();

  // add window to tracking.
  this.addWindow(this._j._log);
};

/**
 * Creates the rectangle representing the window for the log.
 * @returns {Rectangle}
 */
Scene_Map.prototype.textLogWindowRect = function()
{
  // an arbitrary number of rows.
  const rows = 12;

  const width = 600;
  const height = (Window_MapLog.rowHeight * rows) - 8;
  const x = 0;
  const y = Graphics.boxHeight - height;
  return new Rectangle(x, y, width, height);
};
//#endregion Scene_Map