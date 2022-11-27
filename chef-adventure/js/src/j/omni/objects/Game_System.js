//#region Game_System
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

/**
 * Update the saved data with the running cache.
 */
J.OMNI.Aliased.Game_System.set('onBeforeSave', Game_System.prototype.onBeforeSave);
Game_System.prototype.onBeforeSave = function()
{
  // perform original logic.
  J.OMNI.Aliased.Game_System.get('onBeforeSave').call(this);

  // update the cache into saveable data.
  $gameParty.synchronizeMonsterpediaDataBeforeSave();
};

/**
 * Setup the caches to work with from the saved data.
 */
J.OMNI.Aliased.Game_System.set('onAfterLoad', Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function()
{
  // perform original logic.
  J.OMNI.Aliased.Game_System.get('onAfterLoad').call(this);

  // update the savable data into the cache.
  $gameParty.synchronizeMonsterpediaAfterLoad();
};
//#endregion Game_System