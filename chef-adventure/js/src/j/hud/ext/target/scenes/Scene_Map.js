//#region Scene_Map
/**
 * Hooks into `initialize` to add our hud.
 */
J.HUD.EXT_TARGET.Aliased.Scene_Map.set('initialize', Scene_Map.prototype.initialize);
Scene_Map.prototype.initialize = function()
{
  // perform original logic.
  J.HUD.EXT_TARGET.Aliased.Scene_Map.get('initialize').call(this);

  /**
   * All encompassing _j object for storing this plugin's properties.
   * @type {{}}
   * @private
   */
  this._j ||= {};

  /**
   * The log window on the map.
   * @type {Window_TargetFrame}
   */
  this._j._targetFrame = null;
};

/**
 * Once the map is loaded, create the text log.
 */
J.HUD.EXT_TARGET.Aliased.Scene_Map.set('createAllWindows', Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function()
{
  // perform original logic.
  J.HUD.EXT_TARGET.Aliased.Scene_Map.get('createAllWindows').call(this);

  // create the target frame.
  this.createTargetFrame();
};

/**
 * Creates the log window and adds it to tracking.
 */
Scene_Map.prototype.createTargetFrame = function()
{
  // create the rectangle of the window.
  const rect = this.targetFrameWindowRect();

  // assign the window to our reference.
  this._j._targetFrame = new Window_TargetFrame(rect);

  // add window to tracking.
  this.addWindow(this._j._targetFrame);
};

/**
 * Creates the rectangle representing the window for the target frame.
 * @returns {Rectangle}
 */
Scene_Map.prototype.targetFrameWindowRect = function()
{
  const width = J.HUD.EXT_TARGET.Metadata.TargetFrameWidth;
  const height = J.HUD.EXT_TARGET.Metadata.TargetFrameHeight;
  const x = J.HUD.EXT_TARGET.Metadata.TargetFrameX;
  const y = J.HUD.EXT_TARGET.Metadata.TargetFrameY;
  return new Rectangle(x, y, width, height);
};

/**
 * The update loop for the hud manager.
 */
J.HUD.EXT_TARGET.Aliased.Scene_Map.set('updateHudFrames', Scene_Map.prototype.updateHudFrames);
Scene_Map.prototype.updateHudFrames = function()
{
  // perform original logic.
  J.HUD.EXT_TARGET.Aliased.Scene_Map.get('updateHudFrames').call(this);

  // manages target frame assignments.
  this.handleAssignTarget();
};

/**
 * Handles incoming requests to assign a target to the target frame.
 */
Scene_Map.prototype.handleAssignTarget = function()
{
  // handles incoming requests to assign a target.
  if ($hudManager.hasRequestAssignTarget())
  {
    // grab the new target.
    const newTarget = $hudManager.getNewTarget();

    // set the target frame's target to this new target.
    this._j._targetFrame.setTarget(newTarget);

    // let the hud manager know we've done the deed.
    $hudManager.acknowledgeAssignedTarget();
  }
};
//#endregion Scene_Map