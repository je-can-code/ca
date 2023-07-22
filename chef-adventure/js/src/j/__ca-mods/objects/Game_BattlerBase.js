//region Game_BattlerBase
/**
 * Extends {@link #recoverAll}.
 * Using the event command for "Recover All" also restores all TP to the battler.
 */
J.CAMods.Aliased.Game_BattlerBase.set('recoverAll', Game_BattlerBase.prototype.recoverAll);
Game_BattlerBase.prototype.recoverAll = function()
{
  // perform original logic.
  J.CAMods.Aliased.Game_BattlerBase.get('recoverAll').call(this);

  // also set current TP to max.
  this._tp = this.maxTp();
};
//endregion Game_BattlerBase