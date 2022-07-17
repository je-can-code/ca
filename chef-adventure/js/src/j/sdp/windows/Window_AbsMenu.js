//#region Window_AbsMenu
if (J.ABS)
{
  /**
   * Extends the make command list for the JABS quick menu to include SDP, if it meets the conditions.
   */
  J.SDP.Aliased.Window_AbsMenu.makeCommandList = Window_AbsMenu.prototype.makeCommandList;
  Window_AbsMenu.prototype.makeCommandList = function()
  {
    J.SDP.Aliased.Window_AbsMenu.makeCommandList.call(this);
    // if the SDP switch is not ON, then this menu command is not present.
    if (!$gameSwitches.value(J.SDP.Metadata.Switch)) return;

    // The menu shouldn't be accessible if there are no panels to work with.
    const enabled = true;//$gameSystem.getUnlockedSdps().length;

    const sdpCommand = J.SDP.MenuCommand(enabled);
    this._list.splice(this._list.length - 2, 0, sdpCommand);
  };
}
//#endregion Window_AbsMenu