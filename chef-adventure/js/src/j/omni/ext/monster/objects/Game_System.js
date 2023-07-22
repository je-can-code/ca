//region Game_System
/**
 * Update the saved data with the running cache.
 */
J.OMNI.EXT.MONSTER.Aliased.Game_System.set('onBeforeSave', Game_System.prototype.onBeforeSave);
Game_System.prototype.onBeforeSave = function()
{
  // perform original logic.
  J.OMNI.EXT.MONSTER.Aliased.Game_System.get('onBeforeSave').call(this);

  // update the cache into saveable data.
  $gameParty.synchronizeMonsterpediaDataBeforeSave();
};

/**
 * Setup the caches to work with from the saved data.
 */
J.OMNI.EXT.MONSTER.Aliased.Game_System.set('onAfterLoad', Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function()
{
  // perform original logic.
  J.OMNI.EXT.MONSTER.Aliased.Game_System.get('onAfterLoad').call(this);

  // update the savable data into the cache.
  $gameParty.synchronizeMonsterpediaAfterLoad();
};
//endregion Game_System