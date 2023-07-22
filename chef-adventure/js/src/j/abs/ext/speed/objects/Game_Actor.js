//region Game_Actor
/**
 * Extends {@link #onBattlerDataChange}.
 * Refreshes movement speed boosts when the battler's data changes.
 */
J.ABS.EXT.SPEED.Aliased.Game_Actor.set('onBattlerDataChange', Game_Actor.prototype.onBattlerDataChange);
Game_Actor.prototype.onBattlerDataChange = function()
{
  // perform original logic.
  J.ABS.EXT.SPEED.Aliased.Game_Actor.get('onBattlerDataChange').call(this);

  // update JABS-related things.
  this.refreshSpeedBoosts();
};
//endregion Game_Actor