//region Scene_Map
/**
 * Hooks into `initialize` to add our hud.
 */
J.HUD.EXT.INPUT.Aliased.Scene_Map.set('initialize', Scene_Map.prototype.initialize);
Scene_Map.prototype.initialize = function()
{
  // perform original logic.
  J.HUD.EXT.INPUT.Aliased.Scene_Map.get('initialize').call(this);

  /**
   * All encompassing _j object for storing my custom properties.
   */
  this._j ||= {};

  /**
   * The input frame window on the map.
   * @type {Window_InputFrame}
   */
  this._j._inputFrame = null;
};

/**
 * Once the map is loaded, create the text log.
 */
J.HUD.EXT.INPUT.Aliased.Scene_Map.set('createAllWindows', Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function()
{
  // perform original logic.
  J.HUD.EXT.INPUT.Aliased.Scene_Map.get('createAllWindows').call(this);

  // create the target frame.
  this.createInputFrame();
};

/**
 * Creates the log window and adds it to tracking.
 */
Scene_Map.prototype.createInputFrame = function()
{
  // create the rectangle of the window.
  const rect = this.inputFrameWindowRect();

  // assign the window to our reference.
  this._j._inputFrame = new Window_InputFrame(rect);

  // add window to tracking.
  this.addWindow(this._j._inputFrame);
};

/**
 * Creates the rectangle representing the window for the map hud.
 * @returns {Rectangle}
 */
Scene_Map.prototype.inputFrameWindowRect = function()
{
  const width = 500;
  const height = 160;
  const x = Graphics.boxWidth - width;
  const y = Graphics.boxHeight - height;
  return new Rectangle(x, y, width, height);
};

/**
 * Extend the update loop for the input frame.
 */
J.HUD.EXT.INPUT.Aliased.Scene_Map.set('updateHudFrames', Scene_Map.prototype.updateHudFrames);
Scene_Map.prototype.updateHudFrames = function()
{
  // perform original logic.
  J.HUD.EXT.INPUT.Aliased.Scene_Map.get('updateHudFrames').call(this);

  // manages hud refreshes.
  this.handleInputFrameUpdate();
};

/**
 * Processes incoming requests regarding the input frame.
 */
Scene_Map.prototype.handleInputFrameUpdate = function()
{
  // handles incoming requests to refresh the input frame.
  this.handleRefreshInputFrame();

  //
  this.handleVisibilityInputFrame();
};

/**
 * Processes incoming requests regarding refreshing the input frame.
 */
Scene_Map.prototype.handleRefreshInputFrame = function()
{
  // handles incoming requests to refresh the input frame.
  if ($hudManager.hasRequestRefreshInputFrame())
  {
    // refresh the input frame.
    this._j._inputFrame.refresh();

    // let the hud manager know we've done the deed.
    $hudManager.acknowledgeRefreshInputFrame();
  }
};

/**
 * Processes incoming requests regarding the input frame.
 */
Scene_Map.prototype.handleVisibilityInputFrame = function()
{
  // handles incoming requests to refresh the input frame.
  if ($hudManager.canShowHud())
  {
    // hide the input frame.
    this._j._inputFrame.show();
  }
  else
  {
    // show the input frame.
    this._j._inputFrame.hide();
    this._j._inputFrame.hideSprites();
  }
};

/**
 * Refreshes the hud on-command.
 */
J.HUD.EXT.INPUT.Aliased.Scene_Map.set('refreshHud', Scene_Map.prototype.refreshHud);
Scene_Map.prototype.refreshHud = function()
{
  // perform original logic.
  J.HUD.EXT.INPUT.Aliased.Scene_Map.get('refreshHud').call(this);

  // refresh the input frame.
  this._j._inputFrame.refreshCache();
  this._j._inputFrame.refresh();
};
//endregion Scene_Map