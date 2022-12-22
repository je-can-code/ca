//region Window_OmnipediaList
/**
 * A window displaying the list of pedias available.
 */
class Window_OmnipediaList extends Window_Command
{
  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Implements {@link #makeCommandList}.
   * Creates the command list of omnipedia entries available for this window.
   */
  makeCommandList()
  {
    // grab all the omnipedia listings available.
    const commands = this.buildCommands();

    // add all the built commands.
    commands.forEach(this.addBuiltCommand, this);
  }

  /**
   * Builds all commands for this command window.
   * Adds all omnipedia commands to the list that are available.
   * @returns {BuiltWindowCommand[]}
   */
  buildCommands()
  {
    /*
    const weaponpediaCommand = new WindowCommandBuilder("Weapon-pedia")
      .setSymbol("weapon-pedia")
      .addSubTextLine("It has your weapon information in it, duh.")
      .addSubTextLine("You can review various weapon attributes within.")
      .setIconIndex(112)
      .build();

    const armorpediaCommand = new WindowCommandBuilder("Armor-pedia")
      .setSymbol("armor-pedia")
      .addSubTextLine("Your armor information is in this thing.")
      .addSubTextLine("You can review various armor attributes within.")
      .setIconIndex(482)
      .build();

    const itempediaCommand = new WindowCommandBuilder("Item-pedia")
      .setSymbol("item-pedia")
      .addSubTextLine("Your item data is all stored in here.")
      .addSubTextLine("You can review various details about consumables.")
      .setIconIndex(208)
      .build();
     */

    return [];
  }

  /**
   * Overwrites {@link #itemHeight}.
   * Makes the command rows bigger so there can be additional lines.
   * @returns {number}
   */
  itemHeight()
  {
    return this.lineHeight() * 2;
  }
}
//endregion Window_OmnipediaList