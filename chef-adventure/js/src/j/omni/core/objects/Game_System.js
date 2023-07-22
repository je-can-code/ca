//region Game_System
/**
 * Calls the omnipedia scene if possible.
 * @param {boolean=} force Whether or not to force-call the scene; defaults to false.
 */
Game_System.prototype.callOmnipediaScene = function(force = false)
{
  // check if the omnipedia scene can be called.
  if (this.canCallOmnipediaScene() || force)
  {
    // call it.
    Scene_Omnipedia.callScene();
  }
  // cannot call the omnipedia scene.
  else
  {
    // sorry!
    SoundManager.playBuzzer();
  }
};

/**
 * Determines whether or not the omnipedia scene can be called.
 * @returns {boolean}
 */
Game_System.prototype.canCallOmnipediaScene = function()
{
  // peek at the omnipedia!
  return true;
};
//endregion Game_System