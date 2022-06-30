//#region Game_Switches
J.ALLYAI.Aliased.Game_Switches.onChange = Game_Switches.prototype.onChange;
Game_Switches.prototype.onChange = function()
{
  J.ALLYAI.Aliased.Game_Switches.onChange.call(this);
  $jabsEngine.requestJabsMenuRefresh = true;
};
//#endregion Game_Switches