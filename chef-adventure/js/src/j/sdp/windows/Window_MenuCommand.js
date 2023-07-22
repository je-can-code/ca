//region Window_MenuCommand
/**
 * Extends the make command list for the main menu to include SDP, if it meets the conditions.
 */
J.SDP.Aliased.Window_MenuCommand.set('makeCommandList', Window_MenuCommand.prototype.makeCommandList);
Window_MenuCommand.prototype.makeCommandList = function()
{
  // perform original logic.
  J.SDP.Aliased.Window_MenuCommand.get('makeCommandList').call(this);

  // if we cannot add the command, then do not.
  if (!this.canAddSdpCommand()) return;

  // The menu shouldn't be accessible if there are no panels to work with.
  const enabled = $gameSystem.getUnlockedSdps().length;

  // build the command.
  const command = new WindowCommandBuilder(J.SDP.Metadata.CommandName)
    .setSymbol("sdp-menu")
    .setEnabled(enabled)
    .setIconIndex(J.SDP.Metadata.JabsMenuIcon)
    .setColorIndex(1)
    .build();

  // determine what the last command is.
  const lastCommand = this._list.at(-1);

  // check if the last command is the "End Game" command.
  if (lastCommand.symbol === "gameEnd")
  {
    // add it before the "End Game" command.
    this._list.splice(this._list.length - 2, 0, command);
  }
  // the last command is something else.
  else
  {
    // just add it to the end.
    this.addBuiltCommand(command);
  }
};

/**
 * Determines whether or not the sdp command can be added to the JABS menu.
 * @returns {boolean} True if the command should be added, false otherwise.
 */
Window_MenuCommand.prototype.canAddSdpCommand = function()
{
  // if the necessary switch isn't ON, don't render the command at all.
  if (!$gameSwitches.value(J.SDP.Metadata.Switch)) return false;

  // if we're using JABS but not allowing to show this command in both menus, then skip.
  if (J.ABS && !J.SDP.Metadata.JabsShowBoth) return false;

  // render the command!
  return true;
};
//endregion Window_MenuCommand