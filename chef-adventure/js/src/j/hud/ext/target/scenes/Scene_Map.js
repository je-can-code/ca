//region Scene_Map
/**
 * Extends {@link #initHudMembers}.
 * Includes initialization of the target frame members.
 */
J.HUD.EXT.TARGET.Aliased.Scene_Map.set('initHudMembers', Scene_Map.prototype.initHudMembers);
Scene_Map.prototype.initHudMembers = function()
{
  // perform original logic.
  J.HUD.EXT.TARGET.Aliased.Scene_Map.get('initHudMembers').call(this);

  /**
   * A grouping of all properties that belong to target extension
   * of the HUD.
   */
  this._j._hud._target = {};

  /**
   * The target frame showing enemy data.
   * @type {Window_TargetFrame}
   */
  this._j._hud._target._targetFrame = null;

  /**
   * The target frame showing boss data.
   * This is much bigger than the regular target frame.
   * @type {Window_TargetFrame}
   * @private
   */
  this._j._hud._target._bossFrame = null;
};

/**
 * Extends {@link #createAllWindows}.
 * Includes creation of the target frame window.
 */
J.HUD.EXT.TARGET.Aliased.Scene_Map.set('createAllWindows', Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function()
{
  // perform original logic.
  J.HUD.EXT.TARGET.Aliased.Scene_Map.get('createAllWindows').call(this);

  // create the target frame.
  this.createTargetFrameWindow();
};

//region target frame
/**
 * Creates the target frame window and adds it to tracking.
 */
Scene_Map.prototype.createTargetFrameWindow = function()
{
  // create the window.
  const window = this.buildTargetFrameWindow();

  // update the tracker with the new window.
  this.setTargetFrameWindow(window);

  // add the window to the scene manager's tracking.
  this.addWindow(window);
};

/**
 * Sets up and defines the target frame window.
 * @returns {Window_TargetFrame}
 */
Scene_Map.prototype.buildTargetFrameWindow = function()
{
  // define the rectangle of the window.
  const rectangle = this.targetFrameWindowRect();

  // create the window with the rectangle.
  const window = new Window_TargetFrame(rectangle);

  // return the built and configured window.
  return window;
}

/**
 * Creates the rectangle representing the window for the target frame.
 * @returns {Rectangle}
 */
Scene_Map.prototype.targetFrameWindowRect = function()
{
  // define the width of the window.
  const width = J.HUD.EXT.TARGET.Metadata.TargetFrameWidth;

  // define the height of the window.
  const height = J.HUD.EXT.TARGET.Metadata.TargetFrameHeight;

  // define the origin x of the window.
  const x = J.HUD.EXT.TARGET.Metadata.TargetFrameX;

  // define the origin y of the window.
  const y = J.HUD.EXT.TARGET.Metadata.TargetFrameY;

  // return the built rectangle.
  return new Rectangle(x, y, width, height);
};

/**
 * Gets the currently tracked target frame window.
 * @returns {Window_TargetFrame}
 */
Scene_Map.prototype.getTargetFrameWindow = function()
{
  return this._j._hud._target._targetFrame;
}

/**
 * Set the currently tracked target frame window to the given window.
 * @param {Window_TargetFrame} window The window to track.
 */
Scene_Map.prototype.setTargetFrameWindow = function(window)
{
  this._j._hud._target._targetFrame = window;
}
//endregion target frame

/**
 * Extends {@link #updateHudFrames}.
 * Includes updating the target frame.
 */
J.HUD.EXT.TARGET.Aliased.Scene_Map.set('updateHudFrames', Scene_Map.prototype.updateHudFrames);
Scene_Map.prototype.updateHudFrames = function()
{
  // perform original logic.
  J.HUD.EXT.TARGET.Aliased.Scene_Map.get('updateHudFrames').call(this);

  // manages target frame assignments.
  this.handleAssignTarget();
};

/**
 * Handles incoming requests to assign a target to the target frame.
 */
Scene_Map.prototype.handleAssignTarget = function()
{
  // if there is no request, then don't process.
  if (!$hudManager.hasRequestAssignTarget()) return;

  // grab the new target.
  const newTarget = $hudManager.getNewTarget();

  // set the target frame's target to this new target.
  this.getTargetFrameWindow().setTarget(newTarget);

  // let the hud manager know we've done the deed.
  $hudManager.acknowledgeAssignedTarget();
};
//endregion Scene_Map