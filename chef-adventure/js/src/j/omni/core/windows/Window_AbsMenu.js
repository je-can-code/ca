//region Window_AbsMenu
if (J.ABS)
{
  /**
   * Extends {@link #buildCommands}.
   * Adds the sdp command at the end of the list.
   * @returns {BuiltWindowCommand[]}
   */
  J.OMNI.Aliased.Window_AbsMenu.set('buildCommands', Window_AbsMenu.prototype.buildCommands);
  Window_AbsMenu.prototype.buildCommands = function()
  {
    // perform original logic to get the base commands.
    const originalCommands = J.OMNI.Aliased.Window_AbsMenu.get('buildCommands').call(this);

    // if the switch is not ON, then this command is not present.
    if (!this.canAddOmnipediaCommand()) return originalCommands;

    // build the command.
    const command = new WindowCommandBuilder(J.OMNI.Metadata.Command.Name)
      .setSymbol(J.OMNI.Metadata.Command.Symbol)
      .setIconIndex(J.OMNI.Metadata.Command.IconIndex)
      .setColorIndex(J.OMNI.Metadata.Command.ColorIndex)
      .setHelpText(this.omnipediaHelpText())
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
  Window_AbsMenu.prototype.canAddOmnipediaCommand = function()
  {
    // if the necessary switch isn't ON, don't render the command at all.
    if (!$gameSwitches.value(J.OMNI.Metadata.InJabsMenuSwitch)) return false;

    // render the command!
    return true;
  };

  /**
   * The help text for the JABS omnipedia menu.
   * @returns {string}
   */
  Window_AbsMenu.prototype.omnipediaHelpText = function()
  {
    const description = [
      "An encyclopedia-like system full of data-driven entries.",
      "It can contain many sub-categories, such as the Monsterpedia."
    ];

    return description.join("\n");
  };
}
//endregion Window_AbsMenu