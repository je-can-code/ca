//region Scene_Map
/**
 * Hooks into `initialize` to add our hud.
 */
J.HUD.EXT.PARTY.Aliased.Scene_Map.set('initialize', Scene_Map.prototype.initialize);
Scene_Map.prototype.initialize = function()
{
  // perform original logic.
  J.HUD.EXT.PARTY.Aliased.Scene_Map.get('initialize').call(this);

  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * The hud window on the map.
   * @type {Window_PartyFrame}
   */
  this._j._partyFrame = null;
};

/**
 * Once the map is loaded, create the text log.
 */
J.HUD.EXT.PARTY.Aliased.Scene_Map.set('createAllWindows', Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function()
{
  // perform original logic.
  J.HUD.EXT.PARTY.Aliased.Scene_Map.get('createAllWindows').call(this);

  // create the hud.
  this.createPartyFrameWindow();
};

//region party frame
/**
 * Creates the party frame window and adds it to tracking.
 */
Scene_Map.prototype.createPartyFrameWindow = function()
{
  // create the rectangle of the window.
  const rect = this.partyFrameWindowRectangle();

  // assign the window to our reference.
  this._j._partyFrame = new Window_PartyFrame(rect);

  // add window to tracking.
  this.addWindow(this._j._partyFrame);
};

/**
 * Creates the rectangle representing the window for the map hud.
 * @returns {Rectangle}
 */
Scene_Map.prototype.partyFrameWindowRectangle = function()
{
  // define the width of the window.
  const width = 360;

  // define the height of the window.
  const height = 400;

  // define the origin x of the window.
  const x = 0;

  // define the origin y of the window.
  const y = Graphics.boxHeight - height;

  // return the built rectangle.
  return new Rectangle(x, y, width, height);
};
//endregion party frame

/**
 * OVERWRITE Relocates the map display name window to not overlap the hud.
 */
Scene_Map.prototype.mapNameWindowRect = function()
{
  const wx = 400;
  const wy = 0;
  const ww = 360;
  const wh = this.calcWindowHeight(1, false);
  return new Rectangle(wx, wy, ww, wh);
};

/**
 * Refreshes the hud on-command.
 */
J.HUD.EXT.PARTY.Aliased.Scene_Map.set('refreshHud', Scene_Map.prototype.refreshHud);
Scene_Map.prototype.refreshHud = function()
{
  // perform original logic.
  J.HUD.EXT.PARTY.Aliased.Scene_Map.get('refreshHud').call(this);

  // refresh the party frame.
  this._j._partyFrame.refresh();
};

/**
 * Extend the update loop for the party frame.
 */
J.HUD.EXT.PARTY.Aliased.Scene_Map.set('updateHudFrames', Scene_Map.prototype.updateHudFrames);
Scene_Map.prototype.updateHudFrames = function()
{
  // perform original logic.
  J.HUD.EXT.PARTY.Aliased.Scene_Map.get('updateHudFrames').call(this);

  // manages hud refreshes.
  this.handleRefreshPartyFrame();

  // manages hud image cache refreshes.
  this.handleRefreshPartyFrameImageCache();
};

/**
 * Handles incoming requests to refresh the hud.
 */
Scene_Map.prototype.handleRefreshPartyFrame = function()
{
  // handles incoming requests to refresh the hud.
  if ($hudManager.hasRequestRefreshHud())
  {
    // refresh the hud.
    this._j._partyFrame.refresh();

    // let the hud manager know we've done the deed.
    $hudManager.acknowledgeRefreshHud();
  }
};

/**
 * Handles incoming requests to refresh the hud's image cache.
 */
Scene_Map.prototype.handleRefreshPartyFrameImageCache = function()
{
  // handles incoming requests to refresh the hud.
  if ($hudManager.hasRequestRefreshImageCache())
  {
    // refresh the hud's image cache.
    this._j._partyFrame.refreshCache();

    // and then refresh the hud with the new refreshed assets.
    this._j._partyFrame.refresh();

    // let the hud manager know we've done the deed.
    $hudManager.acknowledgeRefreshImageCache();
  }
};
//endregion Scene_Map