//region Window_AbsMenu
/**
 * The window representing what is called and manages the player's assigned skill slots.
 */
class Window_AbsMenu extends Window_Command
{
  /**
   * @constructor
   * @param {Rectangle} rect The shape of the window.
   */
  constructor(rect)
  {
    super(rect);
    this.initialize(rect);
  }

  /**
   * Initializes this window.
   * @param {Rectangle} rect The shape of the window.
   */
  initialize(rect)
  {
    super.initialize(rect);
    this.refresh();
    this.select(0);
    this.activate();
  }

  /**
   * Generates the command list for the JABS menu.
   */
  makeCommandList()
  {
    const commands = this.buildCommands();

    // build all the commands.
    commands.forEach(this.addBuiltCommand, this);
  }

  /**
   * Builds all commands that exist in the JABS menu.
   * @returns {BuiltWindowCommand[]}
   */
  buildCommands()
  {
    // build the main menu command.
    const mainMenuCommand = new WindowCommandBuilder(J.ABS.Metadata.MainMenuText)
      .setSymbol('main-menu')
      .setEnabled(true)
      .setIconIndex(189)
      .build();

    // build the combat skills command.
    const combatSkillsCommand = new WindowCommandBuilder(J.ABS.Metadata.EquipCombatSkillsText)
      .setSymbol('skill-assign')
      .setEnabled(true)
      .setIconIndex(77)
      .setColorIndex(10)
      .build();

    // build the dodge skill command.
    const dodgeSkillCommand = new WindowCommandBuilder(J.ABS.Metadata.EquipDodgeSkillsText)
      .setSymbol('dodge-assign')
      .setEnabled(true)
      .setIconIndex(82)
      .setColorIndex(24)
      .build();

    // build the tool command.
    const toolCommand = new WindowCommandBuilder(J.ABS.Metadata.EquipToolsText)
      .setSymbol('item-assign')
      .setEnabled(true)
      .setIconIndex(83)
      .setColorIndex(17)
      .build();

    // return the built commands.
    return [
      mainMenuCommand,
      combatSkillsCommand,
      dodgeSkillCommand,
      toolCommand,
    ];
  }

  /**
   * Closes the Abs menu.
   */
  closeMenu()
  {
    if (!this.isClosed())
    {
      this.close();
      $jabsEngine.absPause = false;
      $jabsEngine.requestAbsMenu = false;
    }
  }
}
//endregion Window_AbsMenu