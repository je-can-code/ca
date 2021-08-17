/**
 * OVERWRITE Disables Scene_Map's base encounter scene management.
 */
Scene_Map.prototype.updateEncounter = function() {
  if ($gamePlayer.executeEncounter()) {
    this.startFadeOut();
  }
};

/**
 * `updateEncounterEffect` handles the zoom/flashing battle transition.
 */
J.STAR.Aliased.Scene_Map.update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
  J.STAR.Aliased.Scene_Map.update.call(this);
  //? TODO: Modify encountereffect here.
};