//region Scene_Map
/**
 * Extends `Scene_Map.initialize()` to also initialize the TIME window.
 */
J.TIME.Aliased.Scene_Map.initialize = Scene_Map.prototype.initialize;
Scene_Map.prototype.initialize = function()
{
  J.TIME.Aliased.Scene_Map.initialize.call(this);
  this._j = this._j || {};
  this.initTimeWindow();
};

/**
 * Initializes the property containing the TIME window.
 */
Scene_Map.prototype.initTimeWindow = function()
{
  /**
   * The window that displays the current time, real or artificial.
   * @type {Window_Time}
   */
  this._j._timeWindow = null;
};

/**
 * Extends `Scene_Map.createAllWindows()` to also create the TIME window.
 */
J.TIME.Aliased.Scene_Map.createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function()
{
  J.TIME.Aliased.Scene_Map.createAllWindows.call(this);
  this.createTimeWindow();
};

/**
 * Creates the TIME window.
 */
Scene_Map.prototype.createTimeWindow = function()
{
  const w = 200;
  const h = 180;
  const x = J.TIME.Metadata.TimeWindowX;
  const y = J.TIME.Metadata.TimeWindowY;
  const rect = new Rectangle(x, y, w, h);
  const wind = new Window_Time(rect);
  this._j._timeWindow = wind;
  this.addWindow(this._j._timeWindow);
};

/**
 * Extends the `Scene_Map.update()` to also update the TIME window.
 */
J.TIME.Aliased.Scene_Map.update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function()
{
  J.TIME.Aliased.Scene_Map.update.call(this);

  if (this._j._timeWindow)
  {
    this._j._timeWindow.update();
    this.manageTimeVisibility();
  }
};

/**
 * Manages the visibility of the TIME window.
 */
Scene_Map.prototype.manageTimeVisibility = function()
{
  if ($gameTime.isMapWindowVisible())
  {
    this._j._timeWindow.show();
    this._j._timeWindow.open();
  }
  else
  {
    this._j._timeWindow.close();
    this._j._timeWindow.hide();
  }
};

/**
 * Extends the `Scene_Map.onMapLoaded()` function to handle blocking/unblocking by tag.
 */
J.TIME.Aliased.Scene_Map.onMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function()
{
  if (this._transfer)
  {
    this.blockIfTagged();
  }

  J.TIME.Aliased.Scene_Map.onMapLoaded.call(this);
};

/**
 * Blocks the flow of time if the target map is tagged with the specified tag.
 */
Scene_Map.prototype.blockIfTagged = function()
{
  if ($dataMap.meta && $dataMap.meta['timeBlock'])
  {
    $gameTime.block();
  }
  else
  {
    if ($gameTime.isBlocked())
    {
      // console.log('Time is no longer blocked.');
    }

    $gameTime.unblock();
  }
};
//endregion Scene_Map