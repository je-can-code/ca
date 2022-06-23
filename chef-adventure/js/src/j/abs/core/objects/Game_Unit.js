//#region Game_Unit
/**
 * OVERWRITE If Jabs is enabled, then you are always "in battle"!
 * Otherwise, it is dependent on the default method.
 */
J.ABS.Aliased.Game_Unit.inBattle = Game_Unit.prototype.inBattle;
Game_Unit.prototype.inBattle = function()
{
  return $jabsEngine.absEnabled
    ? true
    : J.ABS.Aliased.Game_Unit.inBattle.call(this);
}
//#endregion Game_Unit