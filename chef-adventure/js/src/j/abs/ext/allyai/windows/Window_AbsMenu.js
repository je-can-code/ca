//region Window_AbsMenu
/**
 * Extends {@link #buildCommands}.
 * Adds the ally ai management command at the end of the list.
 * @returns {BuiltWindowCommand[]}
 */
J.ABS.EXT.ALLYAI.Aliased.Window_AbsMenu.set('buildCommands', Window_AbsMenu.prototype.buildCommands);
Window_AbsMenu.prototype.buildCommands = function()
{
  // perform original logic to get base commands.
  const originalCommands = J.ABS.EXT.ALLYAI.Aliased.Window_AbsMenu.get('buildCommands').call(this);

  // if the switch is disabled, then the command won't even appear in the menu.
  if (!this.canAddAllyAiCommand()) return originalCommands;

  // if followers aren't being used, then this command will be disabled.
  const enabled = $gamePlayer.followers().isVisible();

  // build the command.
  const command = new WindowCommandBuilder(J.ABS.EXT.ALLYAI.Metadata.AllyAiCommandName)
    .setSymbol('ally-ai')
    .setEnabled(enabled)
    .setIconIndex(J.ABS.EXT.ALLYAI.Metadata.AllyAiCommandIconIndex)
    .setColorIndex(27)
    .build();

  // add the new command.
  originalCommands.push(command);

  // return the updated command list.
  return originalCommands;
};

/**
 * Determines whether or not the ally ai management command can be added to the JABS menu.
 * @returns {boolean} True if the command should be added, false otherwise.
 */
Window_AbsMenu.prototype.canAddAllyAiCommand = function()
{
  // if the necessary switch isn't ON, don't render the command at all.
  if (!$gameSwitches.value(J.ABS.EXT.ALLYAI.Metadata.AllyAiCommandSwitchId)) return false;

  // render the command!
  return true;
};
//endregion Window_AbsMenu