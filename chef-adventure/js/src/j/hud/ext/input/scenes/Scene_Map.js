//region Scene_Map
/**
 * Hooks into `initialize` to add our hud.
 */
J.HUD.EXT.INPUT.Aliased.Scene_Map.set('initHudMembers', Scene_Map.prototype.initHudMembers);
Scene_Map.prototype.initHudMembers = function()
{
  // perform original logic.
  J.HUD.EXT.INPUT.Aliased.Scene_Map.get('initHudMembers').call(this);

  /**
   * The input frame window on the map.
   * @type {Window_InputFrame}
   */
  this._j._hud._inputFrame = null;
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
  this.createInputFrameWindow();
};

//region input frame
/**
 * Creates the input frame window and adds it to tracking.
 */
Scene_Map.prototype.createInputFrameWindow = function()
{
  // create the window.
  const window = this.buildInputFrameWindow();

  // update the tracker with the new window.
  this.setInputFrameWindow(window);

  // add the window to the scene manager's tracking.
  this.addWindow(window);
};

/**
 * Sets up and defines the input frame window.
 * @returns {Window_InputFrame}
 */
Scene_Map.prototype.buildInputFrameWindow = function()
{
  // define the rectangle of the window.
  const rectangle = this.inputFrameWindowRect();

  // create the window with the rectangle.
  const window = new Window_InputFrame(rectangle);

  // return the built and configured window.
  return window;
}

/**
 * Creates the rectangle representing the window for the input frame.
 * @returns {Rectangle}
 */
Scene_Map.prototype.inputFrameWindowRect = function()
{
  // if using the keyboard layout, apply a modifier against the width.
  const usingKeyboardWidthModifier = J.HUD.EXT.INPUT.Metadata.UseGamepadLayout
    ? 0     // no bonus for gamepads.
    : 220;  // bonus width for all-in-one row.

  // define the width of the window.
  const width = 500 + usingKeyboardWidthModifier;

  // if using the keyboard layout, apply a modifier against the height.
  const usingKeyboardHeightModifier = J.HUD.EXT.INPUT.Metadata.UseGamepadLayout
    ? 0
    : -60;

  // define the height of the window.
  const height = 160 + usingKeyboardHeightModifier;

  // define the origin x of the window.
  const x = Graphics.boxWidth - width;

  // define the origin y of the window.
  const y = Graphics.boxHeight - height;

  // return the built rectangle.
  return new Rectangle(x, y, width, height);
};

/**
 * Gets the currently tracked input frame window.
 * @returns {Window_InputFrame}
 */
Scene_Map.prototype.getInputFrameWindow = function()
{
  return this._j._hud._inputFrame;
}

/**
 * Set the currently tracked input frame window to the given window.
 * @param {Window_InputFrame} window The window to track.
 */
Scene_Map.prototype.setInputFrameWindow = function(window)
{
  this._j._hud._inputFrame = window;
}
//endregion input frame

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

  // manage the visibility of the input frame.
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
    this.getInputFrameWindow().refresh();

    // let the hud manager know we've done the deed.
    $hudManager.acknowledgeRefreshInputFrame();
  }
};

/**
 * Processes incoming requests regarding the input frame.
 */
Scene_Map.prototype.handleVisibilityInputFrame = function()
{
  // grab the window itself.
  const inputFrameWindow = this.getInputFrameWindow();

  // handles incoming requests to refresh the input frame.
  if ($hudManager.canShowHud())
  {
    // hide the input frame.
    inputFrameWindow.show();
  }
  else
  {
    // show the input frame.
    inputFrameWindow.hide();
    inputFrameWindow.hideSprites();
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

  // grab the window.
  const inputFrameWindow = this.getInputFrameWindow();

  // refresh the input frame.
  inputFrameWindow.refreshCache();
  inputFrameWindow.refresh();
};
//endregion Scene_Map