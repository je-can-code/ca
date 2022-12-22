//region Scene_Map
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
{ };
//endregion Scene_Map