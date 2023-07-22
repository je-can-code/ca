//region Window_AbsMenu
if (J.ABS)
{
  /**
   * Extends {@link #buildCommands}.
   * Adds the sdp command at the end of the list.
   * @returns {BuiltWindowCommand[]}
   */
  J.SDP.Aliased.Window_AbsMenu.set('buildCommands', Window_AbsMenu.prototype.buildCommands);
  Window_AbsMenu.prototype.buildCommands = function()
  {
    // perform original logic to get the base commands.
    const originalCommands = J.SDP.Aliased.Window_AbsMenu.get('buildCommands').call(this);

    // if the SDP switch is not ON, then this menu command is not present.
    if (!this.canAddSdpCommand()) return originalCommands;

    // The menu shouldn't be accessible if there are no panels to work with?
    const enabled = $gameSystem.getAllSdps().length > 0;

    // build the command.
    const command = new WindowCommandBuilder(J.SDP.Metadata.CommandName)
      .setSymbol("sdp-menu")
      .setEnabled(enabled)
      .setIconIndex(J.SDP.Metadata.JabsMenuIcon)
      .setColorIndex(1)
      .setHelpText(this.sdpHelpText())
      .build();

    // add the new command.
    originalCommands.push(command);

    // return the updated command list.
    return originalCommands;
  };

  /**
   * Determines whether or not the sdp command can be added to the JABS menu.
   * @returns {boolean} True if the command should be added, false otherwise.
   */
  Window_AbsMenu.prototype.canAddSdpCommand = function()
  {
    // if the necessary switch isn't ON, don't render the command at all.
    if (!$gameSwitches.value(J.SDP.Metadata.Switch)) return false;

    // render the command!
    return true;
  };

  /**
   * The help text for the JABS sdp menu.
   * @returns {string}
   */
  Window_AbsMenu.prototype.sdpHelpText = function()
  {
    const description = [
      "The ever-growing list of stat distribution panels, aka your junction system.",
      "Junction points can be spent here to modify your stats- permanently."
    ];

    return description.join("\n");
  };
}
//endregion Window_AbsMenu