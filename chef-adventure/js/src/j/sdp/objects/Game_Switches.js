//#region Game_Switches
/**
 * Hooks into the `onChange` function for updating the JABS quick menu when switches change.
 */
J.SDP.Aliased.Game_Switches.onChange = Game_Switches.prototype.onChange;
Game_Switches.prototype.onChange = function()
{
  $gameMap.requestRefresh();
  if (J.ABS)
  {
    $jabsEngine.requestJabsMenuRefresh = true;
  }
};
//#endregion Game_Switches