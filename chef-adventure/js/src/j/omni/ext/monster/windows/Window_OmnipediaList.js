/**
 * Extends {@link #buildCommands}.
 * Adds the monsterpedia command to the list of commands in the omnipedia.
 */
J.OMNI.EXT.MONSTER.Aliased.Window_OmnipediaList.set('buildCommands', Window_OmnipediaList.prototype.buildCommands);
Window_OmnipediaList.prototype.buildCommands = function()
{
  // perform original logic.
  const originalCommands = J.OMNI.EXT.MONSTER.Aliased.Window_OmnipediaList.get('buildCommands').call(this);

  // check if the monsterpedia command should be added.
  if (this.canAddMonsterpediaCommand())
  {
    // build the monsterpedia command.
    const monsterpediaCommand = new WindowCommandBuilder(J.OMNI.EXT.MONSTER.Metadata.Command.Name)
      .setSymbol(J.OMNI.EXT.MONSTER.Metadata.Command.Symbol)
      .addSubTextLine("Your standard fare in monsterologies across the universe.")
      .addSubTextLine("It is adapted to the local monsterology of Erocia.")
      .setIconIndex(J.OMNI.EXT.MONSTER.Metadata.Command.IconIndex)
      .build();

    // add the monsterpedia command to the running list.
    originalCommands.push(monsterpediaCommand);
  }

  // return all the commands.
  return originalCommands;
};

/**
 * Determines whether or not the monsterpedia command should be added to the Omnipedia.
 * @returns {boolean}
 */
Window_OmnipediaList.prototype.canAddMonsterpediaCommand = function()
{
  // add the command!
  return true;
};