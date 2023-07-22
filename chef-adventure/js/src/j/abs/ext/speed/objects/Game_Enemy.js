//region Game_Enemy
/**
 * Extends {@link #onBattlerDataChange}.
 * Refreshes movement speed boosts when the battler's data changes.
 */
J.ABS.EXT.SPEED.Aliased.Game_Enemy.set('onBattlerDataChange', Game_Enemy.prototype.onBattlerDataChange);
Game_Enemy.prototype.onBattlerDataChange = function()
{
  // perform original logic.
  J.ABS.EXT.SPEED.Aliased.Game_Enemy.get('onBattlerDataChange').call(this);

  // update JABS-related things.
  this.refreshSpeedBoosts();
};
//endregion Game_Enemy