/*:
 * @target MZ
 * @plugindesc 
 * [v3.0 JABS] Mods/Adds for the various scene object classes.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-ABS
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * A component of JABS.
 * This is a cluster of all changes/overwrites/additions to the objects that
 * would otherwise be found in the rmmz_scenes.js, such as Scene_Menu.
 * ============================================================================
 */

//#region Scene_Load
/**
 * OVERWRITE When loading, the map needs to be refreshed to load the enemies
 * properly.
 */
J.ABS.Aliased.Scene_Load.reloadMapIfUpdated = Scene_Load.prototype.reloadMapIfUpdated;
Scene_Load.prototype.reloadMapIfUpdated = function()
{
  if ($gameBattleMap.absEnabled)
  {
    const mapId = $gameMap.mapId();
    const x = $gamePlayer.x;
    const y = $gamePlayer.y;
    $gamePlayer.reserveTransfer(mapId, x, y);
    $gamePlayer.requestMapReload();
  }
  else
  {
    J.ABS.Aliased.Scene_Load.reloadMapIfUpdated.call(this);
  }
};
//#endregion Scene_Load

//#region Scene_Map
/**
 * Hooks into the `Scene_Map.initialize` function and adds the JABS objects for tracking.
 */
J.ABS.Aliased.Scene_Map.initialize = Scene_Map.prototype.initialize;
Scene_Map.prototype.initialize = function()
{
  J.ABS.Aliased.Scene_Map.initialize.call(this);
  this._j = this._j || {};
  this.initJabsMembers();
};

/**
 * Initializes the player's `JABS_Battler` if it was not already initialized.
 */
J.ABS.Aliased.Scene_Map.onMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function()
{
  if ($gameBattleMap.absEnabled)
  {
    $gameBattleMap.initializePlayerBattler();
  }

  J.ABS.Aliased.Scene_Map.onMapLoaded.call(this);
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
  this._j._absMenu = {};
  this._j._absMenu._windowFocus = null;
  this._j._absMenu._equipType = null;
  this._j._absMenu._mainWindow = null;
  this._j._absMenu._skillWindow = null;
  this._j._absMenu._toolWindow = null;
  this._j._absMenu._dodgeWindow = null;
  this._j._absMenu._equipSkillWindow = null;
  this._j._absMenu._equipToolWindow = null;
  this._j._absMenu._equipDodgeWindow = null;
};

/**
 * Create the Hud with all the rest of the windows.
 */
J.ABS.Aliased.Scene_Map.createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function()
{
  this.createJabsAbsMenu();
  J.ABS.Aliased.Scene_Map.createAllWindows.call(this);
};

/**
 * Update the `JABS_BattlerManager` while updating the regular scene map.
 */
J.ABS.Aliased.Scene_Map.update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function()
{
  J.ABS.Aliased.Scene_Map.update.call(this);
  this.handleJabsWindowsVisibility();

  // if the ABS is disabled, then don't update it.
  if (!$gameBattleMap.absEnabled) return;

  // update the JABS engine!
  JABS_AiManager.update();

  // handle the JABS menu.
  if ($gameBattleMap.requestAbsMenu)
  {
    this.manageAbsMenu();
  }
  else
  {
    this.hideAllJabsWindows();
  }

  // handle rotation.
  if ($gameBattleMap.requestPartyRotation)
  {
    this.handlePartyRotation();
  }

  // handle requests for refreshing the JABS quick menu.
  if ($gameBattleMap.requestJabsMenuRefresh)
  {
    this.refreshJabsMenu();
  }
};

/**
 * Manages the party rotation.
 */
Scene_Map.prototype.handlePartyRotation = function()
{
  $gameBattleMap.requestPartyRotation = false;
  if (J.HUD)
  {
    this.refreshHud();
  }
};

/**
 * Manages visibility for all extraneous windows that are used by JABS.
 */
Scene_Map.prototype.handleJabsWindowsVisibility = function()
{
  if ($gameBattleMap.absEnabled && !$gameMessage.isBusy())
  {
    if (J.KEYS && J.KEYS.Metadata.Enabled) this.toggleKeys(true);
  }
  else
  {
    if (J.KEYS && J.KEYS.Metadata.Enabled) this.toggleKeys(false);
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
J.ABS.Aliased.Scene_Map.callMenu = Scene_Map.prototype.callMenu;
Scene_Map.prototype.callMenu = function()
{
  // if the ABS is disabled, then allow the menu to be called.
  if (!$gameBattleMap.absEnabled)
  {
    J.ABS.Aliased.Scene_Map.callMenu.call(this);
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
  const w = 400;
  const h = 334;
  const x = Graphics.boxWidth - w;
  const y = 200;
  const rect = new Rectangle(x, y, w, h);
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
  $gameBattleMap.requestJabsMenuRefresh = false;
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
//ENDFILE