//region Scene_Base
/**
 * Extend the highest level `Scene_Base.update()` to also update time when applicable.
 */
J.TIME.Aliased.Scene_Base.update = Scene_Base.prototype.update;
Scene_Base.prototype.update = function()
{
  J.TIME.Aliased.Scene_Base.update.call(this);
  if (this.shouldUpdateTime())
  {
    $gameTime.update();
  }
};

/**
 * Determines whether or not we should update artificial time while within the
 * current scene.
 * @returns {boolean}
 */
Scene_Base.prototype.shouldUpdateTime = function()
{
  const noTimeScenes = [Scene_Boot, Scene_File, Scene_Save, Scene_Load, Scene_Title, Scene_Gameover];
  const checkIfNoTimeScene = scene => SceneManager._scene instanceof scene;
  const isNoTimeScene = !noTimeScenes.some(checkIfNoTimeScene);
  const isTimeActive = $gameTime.isActive();
  const isTimeUnblocked = !$gameTime.isBlocked();

  return isNoTimeScene && isTimeActive && isTimeUnblocked;
};
//endregion Scene_Base