//region Window_AbsMenu
/**
 * The main JABS menu window called from the map.
 * This window contains mostly combat-setup options relating to JABS.
 */
class Window_AbsMenu extends Window_Command
{
  /**
   * Constructor.
   * @param {Rectangle} rect The shape of the window.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Generates the command list for the JABS menu.
   */
  makeCommandList()
  {
    // build all the commands.
    const commands = this.buildCommands();

    // add the built commands.
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
      .setEnabled($gameSystem.isMenuEnabled())
      .setIconIndex(189)
      .setHelpText(this.mainMenuHelpText())
      .build();

    // build the combat skills command.
    const combatSkillsCommand = new WindowCommandBuilder(J.ABS.Metadata.EquipCombatSkillsText)
      .setSymbol('skill-assign')
      .setEnabled(true)
      .setIconIndex(77)
      .setColorIndex(10)
      .setHelpText(this.combatSkillsHelpText())
      .build();

    // build the dodge skill command.
    const dodgeSkillCommand = new WindowCommandBuilder(J.ABS.Metadata.EquipDodgeSkillsText)
      .setSymbol('dodge-assign')
      .setEnabled(true)
      .setIconIndex(82)
      .setColorIndex(24)
      .setHelpText(this.dodgeSkillHelpText())
      .build();

    // build the tool command.
    const toolCommand = new WindowCommandBuilder(J.ABS.Metadata.EquipToolsText)
      .setSymbol('item-assign')
      .setEnabled(true)
      .setIconIndex(83)
      .setColorIndex(17)
      .setHelpText(this.toolHelpText())
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
   * The help text for the JABS main menu.
   * @returns {string}
   */
  mainMenuHelpText()
  {
    const description = [
      "The unabbreviated main menu with access to player status, descriptions, etc.",
      "This is colloquially referred to as the 'The Main Menu™' by protagonists all across the universe."
    ];

    return description.join("\n");
  }

  /**
   * The help text for the JABS combat skills menu.
   * @returns {string}
   */
  combatSkillsHelpText()
  {
    const description = [
      "The `Combat Skills` are more powerful variants of your basic attacks that may require resources to execute.",
      "Typical things like sword techs and magic spells will show up here."
    ];

    return description.join("\n");
  }

  /**
   * The help text for the JABS dodge skill menu.
   * @returns {string}
   */
  dodgeSkillHelpText()
  {
    const description = [
      "The `Dodge Skills` are ones that grant some form of mobility.",
      "It is encouraged to use these liberally to maneuver around the field, in and out of combat."
    ];

    return description.join("\n");
  }

  /**
   * The help text for the JABS tool menu.
   * @returns {string}
   */
  toolHelpText()
  {
    const description = [
      "Your tool list, where you can find any and all equippable items.",
      "Not all items will show up in the list- only ones usable in combat somehow will be available."
    ];

    return description.join("\n");
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