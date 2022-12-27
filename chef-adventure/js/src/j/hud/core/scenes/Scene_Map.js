//region Scene_Map
/**
 * Extends {@link #initMembers}.
 * Also initializes the HUD members.
 */
J.HUD.Aliased.Scene_Map.set('initMembers', Scene_Map.prototype.initMembers);
Scene_Map.prototype.initMembers = function()
{
  // perform original logic.
  J.HUD.Aliased.Scene_Map.get('initMembers').call(this);

  // also initialize the HUD members.
  this.initHudMembers();
};

/**
 * A hook for initializing HUD members.
 */
Scene_Map.prototype.initHudMembers = function()
{
  /**
   * A grouping of all properties that are associated with J's plugins.
   */
  this._j ||= {};

  /**
   * A grouping of all properties that belong to the HUD.
   */
  this._j._hud ||= {};
};

/**
 * Extends the `update()` function to also monitor updates for the hud.
 */
J.HUD.Aliased.Scene_Map.set('update', Scene_Map.prototype.update);
Scene_Map.prototype.update = function()
{
  // perform original logic.
  J.HUD.Aliased.Scene_Map.get('update').call(this);

  // keep our HUD up to date.
  this.updateHudFrames();
};

/**
 * The update loop for the hud manager.
 */
Scene_Map.prototype.updateHudFrames = function()
{
  // the update loop for the hud manager.
  $hudManager.update();
};

/**
 * A hook for refreshing all frames of the HUD.
 */
Scene_Map.prototype.refreshHud = function()
{
};
//endregion Scene_Map