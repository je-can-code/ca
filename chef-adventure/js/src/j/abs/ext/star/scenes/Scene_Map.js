/**
 * Overwrites {@link Scene_Map.updateEncounter}.
 * Disables base encounter scene management.
 */
Scene_Map.prototype.updateEncounter = function() 
{
  // checks to see if we can execute an encounter from this perspective.
  if ($gamePlayer.executeEncounter()) 
  {
    // performs a visual fade out effect.
    this.startFadeOut();
  }
};

/**
 * `updateEncounterEffect` handles the zoom/flashing battle transition.
 */
J.ABS.EXT.STAR.Aliased.Scene_Map.set('update', Scene_Map.prototype.update);
Scene_Map.prototype.update = function() 
{
  // perform original logic.
  J.ABS.EXT.STAR.Aliased.Scene_Map.get('update').call(this);

  //? TODO: Modify encountereffect here.
};