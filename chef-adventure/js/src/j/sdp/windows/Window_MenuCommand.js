//#region Window_MenuCommand
/**
 * Extends the make command list for the main menu to include SDP, if it meets the conditions.
 */
J.SDP.Aliased.Window_MenuCommand.makeCommandList = Window_MenuCommand.prototype.makeCommandList;
Window_MenuCommand.prototype.makeCommandList = function()
{
  J.SDP.Aliased.Window_MenuCommand.makeCommandList.call(this);
  // if the SDP switch is not ON, then this menu command is not present.
  if (!$gameSwitches.value(J.SDP.Metadata.Switch)) return;

  // if we're using JABS but not allowing to show this command in both menus, then skip.
  if (J.ABS && !J.SDP.Metadata.JabsShowBoth) return;

  // The menu shouldn't be accessible if there are no panels to work with.
  const enabled = $gameSystem.getUnlockedSdps().length;

  const sdpCommand = J.SDP.MenuCommand(enabled);
  const lastCommand = this._list[this._list.length - 1];
  if (lastCommand.symbol === "gameEnd")
  {
    this._list.splice(this._list.length - 2, 0, sdpCommand);
  }
  else
  {
    this._list.splice(this._list.length - 1, 0, sdpCommand);
  }
};
//#endregion Window_MenuCommand