//#region Scene_Map
/**
 * Hooks into the `Scene_Map.initialize` function and adds the JABS objects for tracking.
 */
J.ABS.Aliased.Scene_Map.set('initialize', Scene_Map.prototype.initialize);
Scene_Map.prototype.initialize = function()
{
  // perform original logic.
  J.ABS.Aliased.Scene_Map.get('initialize').call(this);

  /**
   * The over-arching J object to contain all additional plugin parameters.
   */
  this._j ||= {};

  // initialize custom class members.
  this.initJabsMembers();
};

/**
 * Initializes the player's `JABS_Battler` if it was not already initialized.
 */
J.ABS.Aliased.Scene_Map.set('onMapLoaded', Scene_Map.prototype.onMapLoaded);
Scene_Map.prototype.onMapLoaded = function()
{
  // check if JABS is enabled.
  if ($jabsEngine.absEnabled)
  {
    // initialize player 1.
    $jabsEngine.initializePlayer1();
  }

  // perform original logic.
  J.ABS.Aliased.Scene_Map.get('onMapLoaded').call(this);
};

/**
 * Initializes all JABS components.
 */
Scene_Map.prototype.initJabsMembers = function()
{
  this.initJabsMenu();
};

/**
 * Initializes the JABS menu.
 */
Scene_Map.prototype.initJabsMenu = function()
{
  /**
   * The over-arching container for all things relating to the JABS menu.
   */
  this._j._absMenu = {};

  /**
   * The current focus that represents which submenu is selected.
   * @type {string|null}
   */
  this._j._absMenu._windowFocus = null;

  /**
   * The type of equip that is being equipped.
   * @type {string|null}
   */
  this._j._absMenu._equipType = null;

  /**
   * The primary list window of commands within the JABS menu.
   * @type {Window_AbsMenu|null}
   */
  this._j._absMenu._mainWindow = null;

  /**
   * The window containing the list of equippable combat skills.
   * @type {Window_AbsMenuSelect|null}
   */
  this._j._absMenu._skillWindow = null;

  /**
   * The window containing the list of equippable tools.
   * @type {Window_AbsMenuSelect|null}
   */
  this._j._absMenu._toolWindow = null;

  /**
   * The window containing the list of equippable dodge skills.
   * @type {Window_AbsMenuSelect|null}
   */
  this._j._absMenu._dodgeWindow = null;

  /**
   * The window containing the currently equipped combat skills.
   * @type {Window_AbsMenuSelect|null}
   */
  this._j._absMenu._equipSkillWindow = null;

  /**
   * The window containing the currently equipped tool.
   * @type {Window_AbsMenuSelect|null}
   */
  this._j._absMenu._equipToolWindow = null;

  /**
   * The window containing the currently equipped dodge skill.
   * @type {Window_AbsMenuSelect|null}
   */
  this._j._absMenu._equipDodgeWindow = null;
};

/**
 * Gets the main list window of the JABS menu.
 * @returns {Window_AbsMenu|null}
 */
Scene_Map.prototype.getJabsMainListWindow = function()
{
  return this._j._absMenu._mainWindow;
};

/**
 * Gets the window containing the list of equippable combat skills.
 * @returns {Window_AbsMenuSelect|null}
 */
Scene_Map.prototype.getJabsCombatSkillEquippablesListWindow = function()
{
  return this._j._absMenu._skillWindow;
};

/**
 * Gets the window containing the list of equippable tools.
 * @returns {Window_AbsMenuSelect|null}
 */
Scene_Map.prototype.getJabsToolEquippablesListWindow = function()
{
  return this._j._absMenu._toolWindow;
};

/**
 * Gets the window containing the list of equippable dodge skills.
 * @returns {Window_AbsMenuSelect|null}
 */
Scene_Map.prototype.getJabsDodgeSkillEquippablesListWindow = function()
{
  return this._j._absMenu._dodgeWindow;
};

/**
 * Gets the window containing the list of equipped combat skills.
 * @returns {Window_AbsMenuSelect|null}
 */
Scene_Map.prototype.getJabsEquippedCombatSkillsWindow = function()
{
  return this._j._absMenu._equipSkillWindow;
};

/**
 * Gets the window containing the equipped tool.
 * @returns {Window_AbsMenuSelect|null}
 */
Scene_Map.prototype.getJabsEquippedToolWindow = function()
{
  return this._j._absMenu._equipToolWindow;
};

/**
 * Gets the window containing the equipped dodge skill.
 * @returns {Window_AbsMenuSelect|null}
 */
Scene_Map.prototype.getJabsEquippedDodgeSkillWindow = function()
{
  return this._j._absMenu._equipDodgeWindow;
};

/**
 * Create the Hud with all the rest of the windows.
 */
J.ABS.Aliased.Scene_Map.set('createAllWindows', Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function()
{
  // generate the JABS quick menu.
  this.createJabsAbsMenu();

  // perform original logic.
  J.ABS.Aliased.Scene_Map.get('createAllWindows').call(this);
};

/**
 * Update the `JABS_BattlerManager` while updating the regular scene map.
 */
J.ABS.Aliased.Scene_Map.set('update', Scene_Map.prototype.update);
Scene_Map.prototype.update = function()
{
  // perform original logic.
  J.ABS.Aliased.Scene_Map.get('update').call(this);

  // update JABS.
  this.updateJabs();
};

/**
 * Frame-updates associated with the JABS engine.
 */
Scene_Map.prototype.updateJabs = function()
{
  // if the ABS is disabled, then don't update it.
  if (!$jabsEngine.absEnabled) return;

  // update the JABS engine!
  JABS_AiManager.update();

  // handle the JABS menu.
  if ($jabsEngine.requestAbsMenu)
  {
    this.manageAbsMenu();
  }
  else
  {
    this.hideAllJabsWindows();
  }

  // handle rotation.
  if ($jabsEngine.requestPartyRotation)
  {
    this.handlePartyRotation();
  }

  // handle requests for refreshing the JABS quick menu.
  if ($jabsEngine.requestJabsMenuRefresh)
  {
    this.refreshJabsMenu();
  }
};

/**
 * Manages the party rotation.
 */
Scene_Map.prototype.handlePartyRotation = function()
{
  $jabsEngine.requestPartyRotation = false;
  if (J.HUD)
  {
    this.refreshHud();
  }
};

/**
 * Hides all windows of the JABS menu.
 */
Scene_Map.prototype.hideAllJabsWindows = function()
{
  this._j._absMenu._mainWindow.hide();
  this._j._absMenu._skillWindow.hide();
  this._j._absMenu._equipSkillWindow.hide();
  this._j._absMenu._toolWindow.hide();
  this._j._absMenu._equipToolWindow.hide();
  this._j._absMenu._dodgeWindow.hide();
  this._j._absMenu._equipDodgeWindow.hide();
};

//#region JABS Menu
/**
 * OVERWRITE Disable the primary menu from being called while JABS is enabled.
 */
J.ABS.Aliased.Scene_Map.set('callMenu', Scene_Map.prototype.callMenu);
Scene_Map.prototype.callMenu = function()
{
  // if the ABS is disabled, then allow the menu to be called normally.
  if (!$jabsEngine.absEnabled)
  {
    J.ABS.Aliased.Scene_Map.get('callMenu').call(this);
  }
};

/**
 * Creates the Jabs quick menu for use.
 */
Scene_Map.prototype.createJabsAbsMenu = function()
{
  // the main window that forks into the other three.
  this.createJabsAbsMenuMainWindow();

  // the three main windows of the ABS menu.
  this.createJabsAbsMenuSkillListWindow();
  this.createJabsAbsMenuToolListWindow();
  this.createJabsAbsMenuDodgeListWindow();

  // the assignment of the the windows.
  this.createJabsAbsMenuEquipSkillWindow();
  this.createJabsAbsMenuEquipToolWindow();
  this.createJabsAbsMenuEquipDodgeWindow();
};

/**
 * Creates the first/main window of the Jabs quick menu.
 */
Scene_Map.prototype.createJabsAbsMenuMainWindow = function()
{
  const rect = this.jabsAbsMenuMainWindowRectangle();
  const mainMenu = new Window_AbsMenu(rect);
  mainMenu.setHandler("skill-assign", this.commandSkill.bind(this));
  mainMenu.setHandler("dodge-assign", this.commandDodge.bind(this));
  mainMenu.setHandler("item-assign", this.commandItem.bind(this));
  mainMenu.setHandler("main-menu", this.commandMenu.bind(this));
  mainMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "main"));
  this._j._absMenu._mainWindow = mainMenu;
  this._j._absMenu._mainWindow.close();
  this._j._absMenu._mainWindow.hide();
  this.addWindow(this._j._absMenu._mainWindow);
};

/**
 * Get the rectangle associated with the main list of the JABS menu.
 * @returns {Rectangle}
 */
Scene_Map.prototype.jabsAbsMenuMainWindowRectangle = function()
{
  const commandHeight = 36;
  const w = 400;
  const h = commandHeight * 8;
  const x = Graphics.boxWidth - w;
  const y = 200;
  return new Rectangle(x, y, w, h);
};

/**
 * Creates the skill assignment window of the Jabs quick menu.
 */
Scene_Map.prototype.createJabsAbsMenuSkillListWindow = function()
{
  const w = 400;
  const h = 300;
  const x = Graphics.boxWidth - (w);
  const y = 200;
  const rect = new Rectangle(x, y, w, h);
  const skillMenu = new Window_AbsMenuSelect(rect, "skill");
  skillMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "skill"));
  skillMenu.setHandler("skill", this.commandEquipSkill.bind(this));
  this._j._absMenu._skillWindow = skillMenu;
  this._j._absMenu._skillWindow.close();
  this._j._absMenu._skillWindow.hide();
  this.addWindow(this._j._absMenu._skillWindow);
};

/**
 * Creates the skill assignment window of the Jabs quick menu.
 */
Scene_Map.prototype.createJabsAbsMenuEquipSkillWindow = function()
{
  const w = 400;
  const h = 380;
  const x = Graphics.boxWidth - (w);
  const y = 200;
  const rect = new Rectangle(x, y, w, h);
  const skillMenu = new Window_AbsMenuSelect(rect, "equip-skill");
  skillMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "assign"));
  skillMenu.setHandler("slot", this.commandAssign.bind(this));
  this._j._absMenu._equipSkillWindow = skillMenu;
  this._j._absMenu._equipSkillWindow.close();
  this._j._absMenu._equipSkillWindow.hide();
  this.addWindow(this._j._absMenu._equipSkillWindow);
};

/**
 * Creates the item assignment window of the Jabs quick menu.
 */
Scene_Map.prototype.createJabsAbsMenuToolListWindow = function()
{
  const w = 400;
  const h = 300;
  const x = Graphics.boxWidth - w;
  const y = 200;
  const rect = new Rectangle(x, y, w, h);
  const itemMenu = new Window_AbsMenuSelect(rect, "tool");
  itemMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "tool"));
  itemMenu.setHandler("tool", this.commandEquipTool.bind(this));
  this._j._absMenu._toolWindow = itemMenu;
  this._j._absMenu._toolWindow.close();
  this._j._absMenu._toolWindow.hide();
  this.addWindow(this._j._absMenu._toolWindow);
};

/**
 * Creates the skill assignment window of the Jabs quick menu.
 */
Scene_Map.prototype.createJabsAbsMenuEquipToolWindow = function()
{
  const w = 400;
  const h = 70;
  const x = Graphics.boxWidth - (w);
  const y = 200;
  const rect = new Rectangle(x, y, w, h);
  const itemMenu = new Window_AbsMenuSelect(rect, "equip-tool");
  itemMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "assign"));
  itemMenu.setHandler("slot", this.commandAssign.bind(this));
  this._j._absMenu._equipToolWindow = itemMenu;
  this._j._absMenu._equipToolWindow.close();
  this._j._absMenu._equipToolWindow.hide();
  this.addWindow(this._j._absMenu._equipToolWindow);
};

/**
 * Creates the dodge assignment window of the Jabs quick menu.
 */
Scene_Map.prototype.createJabsAbsMenuDodgeListWindow = function()
{
  const w = 400;
  const h = 300;
  const x = Graphics.boxWidth - w;
  const y = 200;
  const rect = new Rectangle(x, y, w, h);
  const dodgeMenu = new Window_AbsMenuSelect(rect, "dodge");
  dodgeMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "dodge"));
  dodgeMenu.setHandler("dodge", this.commandEquipDodge.bind(this));
  this._j._absMenu._dodgeWindow = dodgeMenu;
  this._j._absMenu._dodgeWindow.close();
  this._j._absMenu._dodgeWindow.hide();
  this.addWindow(this._j._absMenu._dodgeWindow);
};

/**
 * Creates the skill assignment window of the Jabs quick menu.
 */
Scene_Map.prototype.createJabsAbsMenuEquipDodgeWindow = function()
{
  const w = 400;
  const h = 70;
  const x = Graphics.boxWidth - (w);
  const y = 200;
  const rect = new Rectangle(x, y, w, h);
  const assignMenu = new Window_AbsMenuSelect(rect, "equip-dodge");
  assignMenu.setHandler("cancel", this.closeAbsWindow.bind(this, "assign"));
  assignMenu.setHandler("slot", this.commandAssign.bind(this));
  this._j._absMenu._equipDodgeWindow = assignMenu;
  this._j._absMenu._equipDodgeWindow.close();
  this._j._absMenu._equipDodgeWindow.hide();
  this.addWindow(this._j._absMenu._equipDodgeWindow);
};

/**
 * Manages the ABS main menu's interactivity.
 */
Scene_Map.prototype.manageAbsMenu = function()
{
  switch (this._j._absMenu._windowFocus)
  {
    case "main":
      this._j._absMenu._mainWindow.show();
      this._j._absMenu._mainWindow.open();
      this._j._absMenu._mainWindow.activate();
      break;
    case "skill":
      this._j._absMenu._mainWindow.hide();
      this._j._absMenu._mainWindow.close();
      this._j._absMenu._mainWindow.deactivate();
      this._j._absMenu._skillWindow.show();
      this._j._absMenu._skillWindow.open();
      this._j._absMenu._skillWindow.activate();
      break;
    case "tool":
      this._j._absMenu._mainWindow.hide();
      this._j._absMenu._mainWindow.close();
      this._j._absMenu._mainWindow.deactivate();
      this._j._absMenu._toolWindow.show();
      this._j._absMenu._toolWindow.open();
      this._j._absMenu._toolWindow.activate();
      break;
    case "dodge":
      this._j._absMenu._mainWindow.hide();
      this._j._absMenu._mainWindow.close();
      this._j._absMenu._mainWindow.deactivate();
      this._j._absMenu._dodgeWindow.show();
      this._j._absMenu._dodgeWindow.open();
      this._j._absMenu._dodgeWindow.activate();
      break;
    case null:
      this._j._absMenu._windowFocus = "main";
      break;
  }
};

/**
 * When the "assign skills" option is chosen, it prioritizes this window.
 */
Scene_Map.prototype.commandSkill = function()
{
  this._j._absMenu._windowFocus = "skill";
  this._j._absMenu._skillWindow.refresh();
  this._j._absMenu._skillWindow.show();
  this._j._absMenu._skillWindow.open();
  this._j._absMenu._skillWindow.activate();
  this._j._absMenu._equipType = "skill";
};

/**
 * When the "assign items" option is chosen, it prioritizes this window.
 */
Scene_Map.prototype.commandItem = function()
{
  this._j._absMenu._windowFocus = "tool";
  this._j._absMenu._toolWindow.refresh();
  this._j._absMenu._toolWindow.show();
  this._j._absMenu._toolWindow.open();
  this._j._absMenu._toolWindow.activate();
  this._j._absMenu._equipType = "tool";
};

/**
 * When the "assign dodge" option is chosen, it prioritizes this window.
 */
Scene_Map.prototype.commandDodge = function()
{
  this._j._absMenu._windowFocus = "dodge";
  this._j._absMenu._dodgeWindow.refresh();
  this._j._absMenu._dodgeWindow.show();
  this._j._absMenu._dodgeWindow.open();
  this._j._absMenu._dodgeWindow.activate();
  this._j._absMenu._equipType = "dodge";
};

/**
 * Brings up the main menu.
 */
Scene_Map.prototype.commandMenu = function()
{
  SceneManager.push(Scene_Menu);
};

Scene_Map.prototype.refreshJabsMenu = function()
{
  $jabsEngine.requestJabsMenuRefresh = false;
  this._j._absMenu._mainWindow.refresh();
};

/**
 * When a decision is made in skill assign, prioritize the equip window.
 */
Scene_Map.prototype.commandEquipSkill = function()
{
  this._j._absMenu._windowFocus = "assign";
  this._j._absMenu._skillWindow.close();
  this._j._absMenu._skillWindow.deactivate();
  this._j._absMenu._equipSkillWindow.refresh();
  this._j._absMenu._equipSkillWindow.show();
  this._j._absMenu._equipSkillWindow.open();
  this._j._absMenu._equipSkillWindow.activate();
};

/**
 * When a decision is made in tool assign, prioritize the equip window.
 */
Scene_Map.prototype.commandEquipTool = function()
{
  this._j._absMenu._windowFocus = "assign";
  this._j._absMenu._toolWindow.close();
  this._j._absMenu._toolWindow.deactivate();
  this._j._absMenu._equipToolWindow.refresh();
  this._j._absMenu._equipToolWindow.show();
  this._j._absMenu._equipToolWindow.open();
  this._j._absMenu._equipToolWindow.activate();
};

/**
 * When a decision is made in tool assign, prioritize the equip window.
 */
Scene_Map.prototype.commandEquipDodge = function()
{
  this._j._absMenu._windowFocus = "assign";
  this._j._absMenu._dodgeWindow.close();
  this._j._absMenu._dodgeWindow.deactivate();
  this._j._absMenu._equipDodgeWindow.refresh();
  this._j._absMenu._equipDodgeWindow.show();
  this._j._absMenu._equipDodgeWindow.open();
  this._j._absMenu._equipDodgeWindow.activate();
};

/**
 * When assigning a slot, determine the last opened window and use that.
 */
Scene_Map.prototype.commandAssign = function()
{
  const actor = $gameParty.leader();
  let nextActionSkill = 0
  let equippedActionSlot = 0;
  switch (this._j._absMenu._equipType)
  {
    case "skill":
      equippedActionSlot = this._j._absMenu._equipSkillWindow.currentExt();
      nextActionSkill = this._j._absMenu._skillWindow.currentExt();
      break;
    case "tool":
      equippedActionSlot = this._j._absMenu._equipToolWindow.currentExt();
      nextActionSkill = this._j._absMenu._toolWindow.currentExt();
      break;
    case "dodge":
      equippedActionSlot = this._j._absMenu._equipDodgeWindow.currentExt();
      nextActionSkill = this._j._absMenu._dodgeWindow.currentExt();
      break;
    default:
      break;
  }

  actor.setEquippedSkill(equippedActionSlot, nextActionSkill);
  this.closeAbsWindow("assign");
};

/**
 * Closes a given Abs menu window.
 * @param {string} absWindow The type of abs window being closed.
 */
Scene_Map.prototype.closeAbsWindow = function(absWindow)
{
  switch (absWindow)
  {
    case "main":
      this._j._absMenu._mainWindow.deactivate();
      this._j._absMenu._mainWindow.close();
      this.closeAbsMenu();
      break;
    case "skill":
      this._j._absMenu._skillWindow.deactivate();
      this._j._absMenu._skillWindow.close();
      this._j._absMenu._windowFocus = "main";
      break;
    case "tool":
      this._j._absMenu._toolWindow.deactivate();
      this._j._absMenu._toolWindow.close();
      this._j._absMenu._windowFocus = "main";
      break;
    case "dodge":
      this._j._absMenu._dodgeWindow.deactivate();
      this._j._absMenu._dodgeWindow.close();
      this._j._absMenu._windowFocus = "main";
      break;
    case "assign":
      this._j._absMenu._equipSkillWindow.deactivate();
      this._j._absMenu._equipSkillWindow.close();
      this._j._absMenu._equipToolWindow.deactivate();
      this._j._absMenu._equipToolWindow.close();
      this._j._absMenu._equipDodgeWindow.deactivate();
      this._j._absMenu._equipDodgeWindow.close();
      this._j._absMenu._skillWindow.deactivate();
      this._j._absMenu._skillWindow.close();
      this._j._absMenu._toolWindow.deactivate();
      this._j._absMenu._toolWindow.close();
      this._j._absMenu._dodgeWindow.deactivate();
      this._j._absMenu._dodgeWindow.close();
      this._j._absMenu._mainWindow.activate();
      this._j._absMenu._mainWindow.open();
      this._j._absMenu._mainWindow.show();
      this._j._absMenu._windowFocus = "main"
      break;
  }
};

/**
 * Close out from the Abs menu.
 */
Scene_Map.prototype.closeAbsMenu = function()
{
  this._j._absMenu._mainWindow.closeMenu();
};
//#endregion JABS Menu
//#endregion Scene_Map