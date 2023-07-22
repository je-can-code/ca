//region Scene_Map
/**
 * Extends {@link #initHudMembers}.
 * Includes initialization of the boss frame members.
 */
J.HUD.EXT.BOSS.Aliased.Scene_Map.set('initHudMembers', Scene_Map.prototype.initHudMembers);
Scene_Map.prototype.initHudMembers = function()
{
  // perform original logic.
  J.HUD.EXT.BOSS.Aliased.Scene_Map.get('initHudMembers').call(this);

  /**
   * A grouping of all properties that belong to the boss frame
   * extension of the HUD.
   */
  this._j._hud._boss = {};

  /**
   * The target frame showing boss data.
   * This is much bigger than the regular target frame.
   * @type {Window_BossFrame}
   */
  this._j._hud._boss._frame = null;
};

/**
 * Extends {@link #createAllWindows}.
 * Includes creation of the boss frame window.
 */
J.HUD.EXT.BOSS.Aliased.Scene_Map.set('createAllWindows', Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function()
{
  // perform original logic.
  J.HUD.EXT.BOSS.Aliased.Scene_Map.get('createAllWindows').call(this);

  // create the boss frame.
  this.createBossFrameWindow();
};

//region boss frame
/**
 * Creates the boss frame window and adds it to tracking.
 */
Scene_Map.prototype.createBossFrameWindow = function()
{
  // create the window.
  const window = this.buildBossFrameWindow();

  // update the tracker with the new window.
  this.setBossFrameWindow(window);

  // add the window to the scene manager's tracking.
  this.addWindow(window);
};

/**
 * Sets up and defines the boss frame window.
 * @returns {Window_BossFrame}
 */
Scene_Map.prototype.buildBossFrameWindow = function()
{
  // define the rectangle of the window.
  const rectangle = this.bossFrameWindowRect();

  // create the window with the rectangle.
  const window = new Window_BossFrame(rectangle);

  // return the built and configured window.
  return window;
}

/**
 * Creates the rectangle representing the window for the boss frame.
 * @returns {Rectangle}
 */
Scene_Map.prototype.bossFrameWindowRect = function()
{
  // define the width of the window.
  const width = Graphics.boxWidth - 400;

  // define the height of the window.
  const height = 120;

  // define the origin x of the window.
  const x = (Graphics.boxWidth - width) / 2;

  // define the origin y of the window.
  const y = 0;

  // return the built rectangle.
  return new Rectangle(x, y, width, height);
};

/**
 * Gets the currently tracked boss frame window.
 * @returns {Window_BossFrame}
 */
Scene_Map.prototype.getBossFrameWindow = function()
{
  return this._j._hud._boss._frame;
}

/**
 * Set the currently tracked boss frame window to the given window.
 * @param {Window_BossFrame} window The window to track.
 */
Scene_Map.prototype.setBossFrameWindow = function(window)
{
  this._j._hud._boss._frame = window;
}
//endregion boss frame

/**
 * Extends {@link #updateHudFrames}.
 * Includes updating the target frame.
 */
J.HUD.EXT.BOSS.Aliased.Scene_Map.set('updateHudFrames', Scene_Map.prototype.updateHudFrames);
Scene_Map.prototype.updateHudFrames = function()
{
  // perform original logic.
  J.HUD.EXT.BOSS.Aliased.Scene_Map.get('updateHudFrames').call(this);

  // manages boss frame assignments.
  this.handleAssignBoss();

  // manage boss frame visibility.
  this.handleBossFrameVisibility();
};

/**
 * Handles incoming requests to assign a boss to the boss frame.
 */
Scene_Map.prototype.handleAssignBoss = function()
{
  // if there is no request, then don't process.
  if (!BossFrameManager.needsBossFrameRefresh()) return;

  // grab the new boss.
  const newBoss = BossFrameManager.getBossFrame();

  // set the target frame's target to this new target.
  this.getBossFrameWindow().setTarget(newBoss);

  // let the boss manager know we've done the deed.
  BossFrameManager.acknowledgeBossFrameRefresh();
};

Scene_Map.prototype.handleBossFrameVisibility = function()
{
  // manage visibility if necessary.
  this.handleHideBossFrame();
  this.handleShowBossFrame();
};

Scene_Map.prototype.handleHideBossFrame = function()
{
  // do nothing if we have no request.
  if (!BossFrameManager.needsBossFrameHiding()) return;

  // request the boss frame to be hidden.
  this.getBossFrameWindow().requestHideBossFrame();

  // let the manager know we've done the deed.
  BossFrameManager.acknowledgeBossFrameHidden();
};

Scene_Map.prototype.handleShowBossFrame = function()
{
  // do nothing if we have no request.
  if (!BossFrameManager.needsBossFrameShowing()) return;

  // request the boss frame to be shown.
  this.getBossFrameWindow().requestShowBossFrame();

  // let the manager know we've done the deed.
  BossFrameManager.acknowledgeBossFrameHidden();
};