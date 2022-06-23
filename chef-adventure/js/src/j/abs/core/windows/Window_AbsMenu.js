//#region Window_AbsMenu
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
    // to adjust the icons, change the number that is the last parameter of these commands.
    this.addCommand(J.ABS.Metadata.EquipCombatSkillsText, "skill-assign", true, null, 77);
    this.addCommand(J.ABS.Metadata.EquipDodgeSkillsText, "dodge-assign", true, null, 82);
    this.addCommand(J.ABS.Metadata.EquipToolsText, "item-assign", true, null, 83);
    this.addCommand(J.ABS.Metadata.MainMenuText, "main-menu", true, null, 189);
    this.addCommand(J.ABS.Metadata.CancelText, "cancel", true, null, 73);
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
//#endregion Window_AbsMenu