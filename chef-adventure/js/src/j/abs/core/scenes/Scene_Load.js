//region Scene_Load
/**
 * Overwrites {@link Scene_Load.reloadMapIfUpdated}.
 * When loading, the map needs to be refreshed to load the enemies properly.
 */
J.ABS.Aliased.Scene_Load.set('reloadMapIfUpdated', Scene_Load.prototype.reloadMapIfUpdated);
Scene_Load.prototype.reloadMapIfUpdated = function()
{
  if ($jabsEngine.absEnabled)
  {
    const mapId = $gameMap.mapId();
    const x = $gamePlayer.x;
    const y = $gamePlayer.y;
    $gamePlayer.reserveTransfer(mapId, x, y);
    $gamePlayer.requestMapReload();
  }
  else
  {
    // perform original logic.
    J.ABS.Aliased.Scene_Load.get('reloadMapIfUpdated').call(this);
  }
};
//endregion Scene_Load