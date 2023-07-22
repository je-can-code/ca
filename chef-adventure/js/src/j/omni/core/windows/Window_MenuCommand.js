//region Window_MenuCommand
/**
 * Extends {@link #makeCommandList}.
 * Also adds the omnipedia command.
 */
J.OMNI.Aliased.Window_MenuCommand.set('makeCommandList', Window_MenuCommand.prototype.makeCommandList);
Window_MenuCommand.prototype.makeCommandList = function()
{
  // perform original logic.
  J.OMNI.Aliased.Window_MenuCommand.get('makeCommandList').call(this);

  // if we cannot add the command, then do not.
  if (!this.canAddOmnipediaCommand()) return;

  // build the command.
  const command = new WindowCommandBuilder(J.OMNI.Metadata.Command.Name)
    .setSymbol(J.OMNI.Metadata.Command.Symbol)
    .setIconIndex(J.OMNI.Metadata.Command.IconIndex)
    .setColorIndex(J.OMNI.Metadata.Command.ColorIndex)
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
Window_MenuCommand.prototype.canAddOmnipediaCommand = function()
{
  // if the necessary switch isn't ON, don't render the command at all.
  if (!$gameSwitches.value(J.OMNI.Metadata.InMainMenuSwitch)) return false;

  // render the command!
  return true;
};
//endregion Window_MenuCommand