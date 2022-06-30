//#region Window_AbsMenu
/**
 * Extends the JABS quick menu to include ally ai management.
 */
J.ALLYAI.Aliased.Window_AbsMenu.makeCommandList = Window_AbsMenu.prototype.makeCommandList;
Window_AbsMenu.prototype.makeCommandList = function()
{
  J.ALLYAI.Aliased.Window_AbsMenu.makeCommandList.call(this);
  if (!$dataSystem) return;

  // if the switch is disabled, then the command won't even appear in the menu.
  if (!$gameSwitches.value(J.ALLYAI.Metadata.AllyAiCommandSwitchId)) return;

  // if followers aren't being used, then this command will be disabled.
  const enabled = $gamePlayer.followers()
    .isVisible();
  const newCommand = J.ALLYAI.MenuCommand(enabled);
  this._list.splice(this._list.length - 2, 0, newCommand);
};
//#endregion Window_AbsMenu