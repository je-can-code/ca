/**
 * Extends {@link #buildCommands}.
 * Adds the monsterpedia command to the list of commands in the omnipedia.
 */
J.OMNI.EXT.MONSTER.Aliased.Window_OmnipediaList.set('buildCommands', Window_OmnipediaList.prototype.buildCommands);
Window_OmnipediaList.prototype.buildCommands = function()
{
  // perform original logic.
  const previousCommands = J.OMNI.EXT.MONSTER.Aliased.Window_OmnipediaList.get('buildCommands').call(this);

  // build the monsterpedia command.
  const monsterpediaCommand = new WindowCommandBuilder("Monsterpedia")
    .setSymbol("monster-pedia")
    .addSubTextLine("Your standard fare in monsterologies across the universe.")
    .addSubTextLine("It is adapted to the local monsterology of Erocia.")
    .setIconIndex(14)
    .build();

  // return all the commands.
  return [
    ...previousCommands,
    monsterpediaCommand
  ];
};