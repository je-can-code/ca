//region Scene_Map
//region init
/**
 * Extends {@link #initialize}.
 * Also initializes all additional properties for JABS.
 */
J.ABS.Aliased.Scene_Map.set('initialize', Scene_Map.prototype.initialize);
Scene_Map.prototype.initialize = function()
{
  // perform original logic.
  J.ABS.Aliased.Scene_Map.get('initialize').call(this);

  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  // initialize custom class members.
  this.initJabsMembers();
};

/**
 * Extends {@link #onMapLoaded}.
 * Safety net for ensuring the player's battler is initialized with the map load.
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

  /**
   * The help window for displaying information on the highlighted item.
   * @type {Window_Help|null}
   */
  this._j._absMenu._helpWindow = null;
};

//region properties
/**
 * Gets the current window focus of the JABS menu.
 * @returns {string|null}
 */
Scene_Map.prototype.getJabsMenuFocus = function()
{
  return this._j._absMenu._windowFocus;
};

/**
 * Sets the current window focus of the JABS menu.
 * @param {string} focus The key of the new JABS menu window to focus on.
 */
Scene_Map.prototype.setJabsMenuFocus = function(focus)
{
  this._j._absMenu._windowFocus = focus;
}

/**
 * Gets the currently selected menu equip type being perused.
 * @returns {string|null}
 */
Scene_Map.prototype.getJabsMenuEquipType = function()
{
  return this._j._absMenu._equipType;
};

/**
 * Sets the currently selected menu equip type being perused.
 * @param {string} equipType The currently selected menu equip type.
 */
Scene_Map.prototype.setJabsMenuEquipType = function(equipType)
{
  this._j._absMenu._equipType = equipType;
}

/**
 * Gets the currently tracked JABS menu help window.
 * @returns {Window_AbsHelp|null}
 */
Scene_Map.prototype.getJabsMenuHelpWindow = function()
{
  return this._j._absMenu._helpWindow;
};

/**
 * Sets the currently tracked JABS menu help window to the given window.
 * @param {Window_AbsHelp} window The help window to track.
 */
Scene_Map.prototype.setJabsMenuHelpWindow = function(window)
{
  this._j._absMenu._helpWindow = window;
};

/**
 * Gets the currently tracked JABS main menu window.
 * @returns {Window_AbsMenu}
 */
Scene_Map.prototype.getJabsMainListWindow = function()
{
  return this._j._absMenu._mainWindow;
};

/**
 * Sets the currently tracked JABS main menu window to the given window.
 * @param {Window_AbsMenu} window The JABS main menu window to track.
 */
Scene_Map.prototype.setJabsMenuMainWindow = function(window)
{
  this._j._absMenu._mainWindow = window;
};

/**
 * Get the currently tracked JABS menu skill list window.
 * @returns {Window_DifficultyList}
 */
Scene_Map.prototype.getJabsSkillListWindow = function()
{
  return this._j._absMenu._skillWindow;
};

/**
 * Set the currently tracked JABS menu combat skill list window to the given window.
 * @param {Window_AbsMenu} window The combat skill list window to track.
 */
Scene_Map.prototype.setJabsSkillListWindow = function(window)
{
  this._j._absMenu._skillWindow = window;
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
 * Set the currently tracked JABS menu equipped combat skills window to the given window.
 * @param {Window_AbsMenu} window The equipped combat skills window to track.
 */
Scene_Map.prototype.setJabsEquippedCombatSkillsWindow = function(window)
{
  this._j._absMenu._equipSkillWindow = window;
};

/**
 * Gets the window containing the list of equippable tools.
 * @returns {Window_AbsMenuSelect|null}
 */
Scene_Map.prototype.getJabsToolListWindow = function()
{
  return this._j._absMenu._toolWindow;
};

/**
 * Set the currently tracked JABS menu tool list window to the given window.
 * @param {Window_AbsMenu} window The tool list window to track.
 */
Scene_Map.prototype.setJabsToolListWindow = function(window)
{
  this._j._absMenu._toolWindow = window;
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
 * Set the currently tracked JABS menu equipped tool window to the given window.
 * @param {Window_AbsMenuSelect} window The equipped tool window to track.
 */
Scene_Map.prototype.setJabsEquippedToolWindow = function(window)
{
  this._j._absMenu._equipToolWindow = window;
};

/**
 * Gets the window containing the list of equippable dodge skills.
 * @returns {Window_AbsMenuSelect|null}
 */
Scene_Map.prototype.getJabsDodgeSkillListWindow = function()
{
  return this._j._absMenu._dodgeWindow;
};

/**
 * Set the currently tracked JABS menu dodge skill list window to the given window.
 * @param {Window_AbsMenuSelect} window The dodge skill list window to track.
 */
Scene_Map.prototype.setJabsDodgeSkillListWindow = function(window)
{
  this._j._absMenu._dodgeWindow = window;
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
 * Set the currently tracked JABS menu equipped dodge skill window to the given window.
 * @param {Window_AbsMenu} window The equipped combat skills window to track.
 */
Scene_Map.prototype.setJabsEquippedDodgeSkillWindow = function(window)
{
  this._j._absMenu._equipDodgeWindow = window;
};
//endregion properties
//endregion init

//region create
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
 * Creates the Jabs quick menu for use.
 */
Scene_Map.prototype.createJabsAbsMenu = function()
{
  // the help window used by all menus.
  this.createJabsAbsMenuHelpWindow();

  // the main window that forks into the other three.
  this.createJabsAbsMenuMainWindow();

  // the three main windows of the ABS menu.
  this.createJabsAbsSkillListWindow();
  this.createJabsAbsMenuToolListWindow();
  this.createJabsAbsMenuDodgeListWindow();

  // the assignment of the the windows.
  this.createJabsAbsMenuEquipSkillWindow();
  this.createJabsAbsMenuEquipToolWindow();
  this.createJabsAbsMenuEquipDodgeWindow();
};

//region help
/**
 * Creates a help window for use across all menus in the JABS menu.
 */
Scene_Map.prototype.createJabsAbsMenuHelpWindow = function()
{
  // create the window.
  const window = this.buildJabsMenuHelpWindow();

  // update the tracker with the new window.
  this.setJabsMenuHelpWindow(window);

  // add the window to the scene manager's tracking.
  this.addWindow(window);
};

/**
 * Sets up and defines the JABS menu help window.
 * @returns {Window_AbsHelp}
 */
Scene_Map.prototype.buildJabsMenuHelpWindow = function()
{
  // define the rectangle of the window.
  const rectangle = this.jabsMenuHelpWindowRectangle();

  // create the window with the rectangle.
  const window = new Window_AbsHelp(rectangle);

  // close and hide the window by default upon creation.
  window.close();
  window.hide();

  // return the built and configured window.
  return window;
};

/**
 * Get the rectangle associated with the main list of the JABS menu.
 * @returns {Rectangle}
 */
Scene_Map.prototype.jabsMenuHelpWindowRectangle = function()
{
  // the width is the full window.
  const width = Graphics.boxWidth;

  // define the height arbitrarily.
  const height = 100;

  // the x:y is the upper left.
  const x = 0;
  const y = 0;

  // build the rectangle to return.
  return new Rectangle(x, y, width, height);
};
//endregion help

//region main menu
/**
 * Creates the JABS main menu window containing the list of other options
 * available for use while on the map.
 */
Scene_Map.prototype.createJabsAbsMenuMainWindow = function()
{
  // create the window.
  const window = this.buildJabsMenuMainWindow();

  // update the tracker with the new window.
  this.setJabsMenuMainWindow(window);

  // perform this once to begin with.
  window.onIndexChange();

  // add the window to the scene manager's tracking.
  this.addWindow(window);
};

/**
 * Sets up and defines the JABS main menu window.
 * @returns {Window_AbsMenu}
 */
Scene_Map.prototype.buildJabsMenuMainWindow = function()
{
  // define the rectangle of the window.
  const rectangle = this.jabsMenuMainWindowRectangle();

  // create the window with the rectangle.
  const window = new Window_AbsMenu(rectangle);

  // assign functionality for each of the commands.
  window.setHandler("skill-assign", this.commandSkill.bind(this));
  window.setHandler("dodge-assign", this.commandDodge.bind(this));
  window.setHandler("item-assign", this.commandItem.bind(this));
  window.setHandler("main-menu", this.commandMenu.bind(this));
  window.setHandler("cancel", this.closeAbsWindow.bind(this, JABS_MenuType.Main));

  // overwrite the onIndexChange hook with our local onHoverChange hook.
  window.onIndexChange = this.onJabsMenuHoverChange.bind(this);

  // close and hide the window by default upon creation.
  window.close();
  window.hide();

  // return the built and configured window.
  return window;
};

/**
 * Get the rectangle associated with the main list of the JABS menu.
 * @returns {Rectangle}
 */
Scene_Map.prototype.jabsMenuMainWindowRectangle = function()
{
  // the general height of a command item is this many pixels.
  const commandHeight = 36;

  // define the width arbitrarily.
  const width = 400;

  // the height should be 8 items tall.
  const height = commandHeight * 8;

  // the x coordinate should push the window against the right side.
  const x = Graphics.boxWidth - width;

  // define the y coordinate arbitrarily.
  const y = 100;

  // build the rectangle to return.
  return new Rectangle(x, y, width, height);
};
//endregion main menu

//region skill list
/**
 * Creates the skill assignment window of the Jabs quick menu.
 */
Scene_Map.prototype.createJabsAbsSkillListWindow = function()
{
  // create the window.
  const window = this.buildJabsSkillListWindow();

  // update the tracker with the new window.
  this.setJabsSkillListWindow(window);

  // add the window to the scene manager's tracking.
  this.addWindow(window);
}

/**
 * Sets up and defines the skill list of the JABS menu.
 * @returns {Window_AbsMenuSelect}
 */
Scene_Map.prototype.buildJabsSkillListWindow = function()
{
  // define the rectangle of the window.
  const rectangle = this.jabsSkillListWindowRectangle();

  // create the window with the rectangle.
  const window = new Window_AbsMenuSelect(rectangle, Window_AbsMenuSelect.SelectionTypes.SkillList);

  // assign functionality for each of the commands.
  window.setHandler("cancel", this.closeAbsWindow.bind(this, Window_AbsMenuSelect.SelectionTypes.SkillList));
  window.setHandler("skill", this.commandEquipSkill.bind(this));

  // overwrite the onIndexChange hook with our local onHoverChange hook.
  window.onIndexChange = this.onJabsCombatSkillListHoverChange.bind(this);

  // close and hide the window by default upon creation.
  window.close();
  window.hide();

  // return the built and configured window.
  return window;
};

/**
 * Get the rectangle associated with the skill list of the JABS menu.
 * @returns {Rectangle}
 */
Scene_Map.prototype.jabsSkillListWindowRectangle = function()
{
  // define the width arbitrarily.
  const width = 400;

  // the general height of a command item is this many pixels.
  const commandHeight = 36;

  // the height should be 8 items tall.
  const height = commandHeight * 8;

  // the x coordinate should push the window against the right side.
  const x = Graphics.boxWidth - width;

  // define the y coordinate arbitrarily.
  const y = 100;

  // build the rectangle to return.
  return new Rectangle(x, y, width, height);
};
//endregion skill list

//region equip skill
/**
 * Creates the skill assignment window of the Jabs quick menu.
 */
Scene_Map.prototype.createJabsAbsMenuEquipSkillWindow = function()
{
  // create the window.
  const window = this.buildJabsEquippedCombatSkillsWindow();

  // update the tracker with the new window.
  this.setJabsEquippedCombatSkillsWindow(window);

  // add the window to the scene manager's tracking.
  this.addWindow(window);
};

/**
 * Sets up and defines the equipped combat skills window of the JABS menu.
 * @returns {Window_AbsMenuSelect}
 */
Scene_Map.prototype.buildJabsEquippedCombatSkillsWindow = function()
{
  // define the rectangle of the window.
  const rectangle = this.jabsEquippedCombatSkillsWindowRectangle();

  // create the window with the rectangle.
  const window = new Window_AbsMenuSelect(rectangle, Window_AbsMenuSelect.SelectionTypes.SkillEquip);

  // assign functionality for each of the commands.
  window.setHandler("cancel", this.closeAbsWindow.bind(this, JABS_MenuType.Assign));
  window.setHandler("slot", this.commandAssign.bind(this));

  // overwrite the onIndexChange hook with our local onHoverChange hook.
  window.onIndexChange = this.onJabsEquippedCombatSkillsHoverChange.bind(this);

  // close and hide the window by default upon creation.
  window.close();
  window.hide();

  // return the built and configured window.
  return window;
};

/**
 * Get the rectangle associated with the equipped combat skills of the JABS menu.
 * @returns {Rectangle}
 */
Scene_Map.prototype.jabsEquippedCombatSkillsWindowRectangle = function()
{
  // define the width arbitrarily.
  const width = 400;

  // the general height of a command item is this many pixels.
  const commandHeight = 36;

  // the height should be 5 items tall with some padding on top and bottom.
  const height = (commandHeight * 5) + 20;

  // the x coordinate should push the window against the right side.
  const x = Graphics.boxWidth - width;

  // grab the parent rectangle for location details.
  const parentRectangle = this.jabsSkillListWindowRectangle();

  // define the y coordinate arbitrarily.
  const y = parentRectangle.y + parentRectangle.height;

  // build the rectangle to return.
  return new Rectangle(x, y, width, height);
};
//endregion equip skill

//region tool list
/**
 * Creates the item assignment window of the Jabs quick menu.
 */
Scene_Map.prototype.createJabsAbsMenuToolListWindow = function()
{
  // create the window.
  const window = this.buildJabsToolListWindow();

  // update the tracker with the new window.
  this.setJabsToolListWindow(window);

  // add the window to the scene manager's tracking.
  this.addWindow(window);
};

/**
 * Sets up and defines the tool list of the JABS menu.
 * @returns {Window_AbsMenuSelect}
 */
Scene_Map.prototype.buildJabsToolListWindow = function()
{
  // define the rectangle of the window.
  const rectangle = this.jabsToolListWindowRectangle();

  // create the window with the rectangle.
  const window = new Window_AbsMenuSelect(rectangle, Window_AbsMenuSelect.SelectionTypes.ToolList);

  // assign functionality for each of the commands.
  window.setHandler("cancel", this.closeAbsWindow.bind(this, Window_AbsMenuSelect.SelectionTypes.ToolList));
  window.setHandler("tool", this.commandEquipTool.bind(this));

  // overwrite the onIndexChange hook with our local onHoverChange hook.
  window.onIndexChange = this.onJabsToolListHoverChange.bind(this);

  // close and hide the window by default upon creation.
  window.close();
  window.hide();

  // return the built and configured window.
  return window;
};

/**
 * Get the rectangle associated with the tool list of the JABS menu.
 * @returns {Rectangle}
 */
Scene_Map.prototype.jabsToolListWindowRectangle = function()
{
  // define the width arbitrarily.
  const width = 400;

  // the general height of a command item is this many pixels.
  const commandHeight = 36;

  // the height should be 8 items tall.
  const height = commandHeight * 8;

  // the x coordinate should push the window against the right side.
  const x = Graphics.boxWidth - width;

  // define the y coordinate arbitrarily.
  const y = 100;

  // build the rectangle to return.
  return new Rectangle(x, y, width, height);
};
//endregion tool list

//region equip tool
/**
 * Creates the equip tool window of the JABS menu.
 */
Scene_Map.prototype.createJabsAbsMenuEquipToolWindow = function()
{
  // create the window.
  const window = this.buildJabsEquippedToolWindow();

  // update the tracker with the new window.
  this.setJabsEquippedToolWindow(window);

  // add the window to the scene manager's tracking.
  this.addWindow(window);
};

/**
 * Sets up and defines the equipped tool window of the JABS menu.
 * @returns {Window_AbsMenuSelect}
 */
Scene_Map.prototype.buildJabsEquippedToolWindow = function()
{
  // define the rectangle of the window.
  const rectangle = this.jabsEquippedToolWindowRectangle();

  // create the window with the rectangle.
  const window = new Window_AbsMenuSelect(rectangle, Window_AbsMenuSelect.SelectionTypes.ToolEquip);

  // assign functionality for each of the commands.
  window.setHandler("cancel", this.closeAbsWindow.bind(this, JABS_MenuType.Assign));
  window.setHandler("slot", this.commandAssign.bind(this));

  // overwrite the onIndexChange hook with our local onHoverChange hook.
  window.onIndexChange = this.onJabsEquippedToolHoverChange.bind(this);

  // close and hide the window by default upon creation.
  window.close();
  window.hide();

  // return the built and configured window.
  return window;
};

/**
 * Get the rectangle associated with the equipped tool of the JABS menu.
 * @returns {Rectangle}
 */
Scene_Map.prototype.jabsEquippedToolWindowRectangle = function()
{
  // define the width arbitrarily.
  const width = 400;

  // the height should be just enough to fit the single tool in there.
  const height = 70;

  // the x coordinate should push the window against the right side.
  const x = Graphics.boxWidth - width;

  // grab the parent rectangle for location details.
  const parentRectangle = this.jabsToolListWindowRectangle();

  // define the y coordinate arbitrarily.
  const y = parentRectangle.y + parentRectangle.height;

  // build the rectangle to return.
  return new Rectangle(x, y, width, height);
};
//endregion equip tool

//region dodge list
/**
 * Creates the dodge skill list window of the JABS menu.
 */
Scene_Map.prototype.createJabsAbsMenuDodgeListWindow = function()
{
  // create the window.
  const window = this.buildJabsDodgeSkillListWindow();

  // update the tracker with the new window.
  this.setJabsDodgeSkillListWindow(window);

  // add the window to the scene manager's tracking.
  this.addWindow(window);
};

/**
 * Sets up and defines the dodge skill list of the JABS menu.
 * @returns {Window_AbsMenuSelect}
 */
Scene_Map.prototype.buildJabsDodgeSkillListWindow = function()
{
  // define the rectangle of the window.
  const rectangle = this.jabsDodgeSkillListWindowRectangle();

  // create the window with the rectangle.
  const window = new Window_AbsMenuSelect(rectangle, Window_AbsMenuSelect.SelectionTypes.DodgeList);

  // assign functionality for each of the commands.
  window.setHandler("cancel", this.closeAbsWindow.bind(this, JABS_MenuType.Dodge));
  window.setHandler("dodge", this.commandEquipDodge.bind(this));

  // overwrite the onIndexChange hook with our local onHoverChange hook.
  window.onIndexChange = this.onJabsDodgeSkillListHoverChange.bind(this);

  // close and hide the window by default upon creation.
  window.close();
  window.hide();

  // return the built and configured window.
  return window;
};

/**
 * Get the rectangle associated with the dodge skill list of the JABS menu.
 * @returns {Rectangle}
 */
Scene_Map.prototype.jabsDodgeSkillListWindowRectangle = function()
{
  // define the width arbitrarily.
  const width = 400;

  // the general height of a command item is this many pixels.
  const commandHeight = 36;

  // the height should be 8 items tall.
  const height = commandHeight * 8;

  // the x coordinate should push the window against the right side.
  const x = Graphics.boxWidth - width;

  // define the y coordinate arbitrarily.
  const y = 100;

  // build the rectangle to return.
  return new Rectangle(x, y, width, height);
};
//endregion dodge list

//region equip dodge
/**
 * Creates the equip dodge skill window of the JABS menu.
 */
Scene_Map.prototype.createJabsAbsMenuEquipDodgeWindow = function()
{
  // create the window.
  const window = this.buildJabsEquippedDodgeSkillWindow();

  // update the tracker with the new window.
  this.setJabsEquippedDodgeSkillWindow(window);

  // add the window to the scene manager's tracking.
  this.addWindow(window);
};

/**
 * Sets up and defines the equipped dodge skill window of the JABS menu.
 * @returns {Window_AbsMenuSelect}
 */
Scene_Map.prototype.buildJabsEquippedDodgeSkillWindow = function()
{
  // define the rectangle of the window.
  const rectangle = this.jabsEquippedDodgeSkillWindowRectangle();

  // create the window with the rectangle.
  const window = new Window_AbsMenuSelect(rectangle, Window_AbsMenuSelect.SelectionTypes.DodgeEquip);

  // assign functionality for each of the commands.
  window.setHandler("cancel", this.closeAbsWindow.bind(this, JABS_MenuType.Assign));
  window.setHandler("slot", this.commandAssign.bind(this));

  // overwrite the onIndexChange hook with our local onHoverChange hook.
  window.onIndexChange = this.onJabsEquippedDodgeSkillHoverChange.bind(this);

  // close and hide the window by default upon creation.
  window.close();
  window.hide();

  // return the built and configured window.
  return window;
};

/**
 * Get the rectangle associated with the equipped dodge skill of the JABS menu.
 * @returns {Rectangle}
 */
Scene_Map.prototype.jabsEquippedDodgeSkillWindowRectangle = function()
{
  // define the width arbitrarily.
  const width = 400;

  // the height should be just enough to fit the single dodge skill in there.
  const height = 70;

  // the x coordinate should push the window against the right side.
  const x = Graphics.boxWidth - width;

  // grab the parent rectangle for location details.
  const parentRectangle = this.jabsDodgeSkillListWindowRectangle();

  // define the y coordinate arbitrarily.
  const y = parentRectangle.y + parentRectangle.height;

  // build the rectangle to return.
  return new Rectangle(x, y, width, height);
};
//endregion equip dodge
//endregion create

//region actions
//region onHover
Scene_Map.prototype.onJabsMenuHoverChange = function()
{
  // grab the main menu.
  const menu = this.getJabsMainListWindow();

  // extract the text out of the current selection.
  const text = menu.currentHelpText();

  // update the help window with some text.
  this.getJabsMenuHelpWindow().setText(text);
};

Scene_Map.prototype.onJabsCombatSkillListHoverChange = function()
{
  // grab the menu.
  const menu = this.getJabsSkillListWindow();

  // extract the text out of the current selection.
  const text = menu.currentHelpText();

  // update the help window with some text.
  this.getJabsMenuHelpWindow().setText(text);
};

Scene_Map.prototype.onJabsEquippedCombatSkillsHoverChange = function()
{
  // grab the menu.
  const menu = this.getJabsEquippedCombatSkillsWindow();

  // extract the text out of the current selection.
  const text = menu.currentHelpText();

  // update the help window with some text.
  this.getJabsMenuHelpWindow().setText(text);
};

Scene_Map.prototype.onJabsToolListHoverChange = function()
{
  // grab the menu.
  const menu = this.getJabsToolListWindow();

  // extract the text out of the current selection.
  const text = menu.currentHelpText();

  // update the help window with some text.
  this.getJabsMenuHelpWindow().setText(text);
};

Scene_Map.prototype.onJabsEquippedToolHoverChange = function()
{
  // grab the menu.
  const menu = this.getJabsEquippedToolWindow();

  // extract the text out of the current selection.
  const text = menu.currentHelpText();

  // update the help window with some text.
  this.getJabsMenuHelpWindow().setText(text);
};

Scene_Map.prototype.onJabsDodgeSkillListHoverChange = function()
{
  // grab the menu.
  const menu = this.getJabsDodgeSkillListWindow();

  // extract the text out of the current selection.
  const text = menu.currentHelpText();

  // update the help window with some text.
  this.getJabsMenuHelpWindow().setText(text);
};

Scene_Map.prototype.onJabsEquippedDodgeSkillHoverChange = function()
{
  // grab the menu.
  const menu = this.getJabsDodgeSkillListWindow();

  // extract the text out of the current selection.
  const text = menu.currentHelpText();

  // update the help window with some text.
  this.getJabsMenuHelpWindow().setText(text);
};
//endregion onHover

//region command execution
/**
 * Brings up the main menu.
 */
Scene_Map.prototype.commandMenu = function()
{
  SceneManager.push(Scene_Menu);
};

/**
 * When the "assign skills" option is chosen, it prioritizes this window.
 */
Scene_Map.prototype.commandSkill = function()
{
  // adjust the focus.
  this.setJabsMenuFocus(JABS_MenuType.Skill);

  // refresh the window.
  this.getJabsSkillListWindow().refresh();

  // show the related equipped window.
  this.getJabsEquippedCombatSkillsWindow().refresh();
  this.showJabsEquippedCombatSkillsWindow();
  this.getJabsEquippedCombatSkillsWindow().deselect();
  this.getJabsEquippedCombatSkillsWindow().deactivate();

  // show the window.
  this.showJabsSkillListWindow();

  // set the assignment type to combat skills.
  this.setJabsMenuEquipType(JABS_MenuType.Skill);
};

/**
 * When the "assign items" option is chosen, it prioritizes this window.
 */
Scene_Map.prototype.commandItem = function()
{
  // adjust the focus.
  this.setJabsMenuFocus(JABS_MenuType.Tool);

  // refresh the window.
  this.getJabsToolListWindow().refresh();

  // show the related equipped window.
  this.getJabsEquippedToolWindow().refresh();
  this.showJabsEquippedToolWindow();
  this.getJabsEquippedToolWindow().deselect();
  this.getJabsEquippedToolWindow().deactivate();

  // show the window.
  this.showJabsToolListWindow();

  // set the assignment type to tools.
  this.setJabsMenuEquipType(JABS_MenuType.Tool);
};

/**
 * When the "assign dodge" option is chosen, it prioritizes this window.
 */
Scene_Map.prototype.commandDodge = function()
{
  // adjust the focus.
  this.setJabsMenuFocus(JABS_MenuType.Dodge);

  // refresh the window.
  this.getJabsDodgeSkillListWindow().refresh();

  // show the related equipped window.
  this.getJabsEquippedDodgeSkillWindow().refresh();
  this.showJabsEquippedDodgeSkillWindow();
  this.getJabsEquippedDodgeSkillWindow().deselect();
  this.getJabsEquippedDodgeSkillWindow().deactivate();

  // show the window.
  this.showJabsDodgeSkillListWindow();

  // set the assignment type to dodge skills.
  this.setJabsMenuEquipType(JABS_MenuType.Dodge);
};

/**
 * When a decision is made in skill assign, prioritize the equip window.
 */
Scene_Map.prototype.commandEquipSkill = function()
{
  // adjust the focus.
  this.setJabsMenuFocus(JABS_MenuType.Assign);

  // grab the window.
  const window = this.getJabsEquippedCombatSkillsWindow();

  // refresh the window.
  window.refresh();
  window.select(0);

  // show the window.
  this.showJabsEquippedCombatSkillsWindow();

};

/**
 * When a decision is made in tool assign, prioritize the equip window.
 */
Scene_Map.prototype.commandEquipTool = function()
{
  // adjust the focus.
  this.setJabsMenuFocus(JABS_MenuType.Assign);

  // grab the window.
  const window = this.getJabsEquippedToolWindow();

  // refresh the window.
  window.refresh();
  window.select(0);

  // show the window.
  this.showJabsEquippedToolWindow();
};

/**
 * When a decision is made in tool assign, prioritize the equip window.
 */
Scene_Map.prototype.commandEquipDodge = function()
{
  // adjust the focus.
  this.setJabsMenuFocus(JABS_MenuType.Assign);

  // grab the window.
  const window = this.getJabsEquippedDodgeSkillWindow();

  // refresh the window.
  window.refresh();
  window.select(0);

  // show the window.
  this.showJabsEquippedDodgeSkillWindow();
};

/**
 * When assigning a slot, determine the last opened window and use that.
 */
Scene_Map.prototype.commandAssign = function()
{
  // grab the leader for reference.
  const actor = $gameParty.leader();

  // initialize the skill and slot variables.
  let nextActionSkill = 0
  let equippedActionSlot = 0;

  // pivot on the currently perused equip type.
  switch (this.getJabsMenuEquipType())
  {
    case JABS_MenuType.Skill:
      // update with combat skill information and the given slot.
      equippedActionSlot = this.getJabsEquippedCombatSkillsWindow().currentExt();
      nextActionSkill = this.getJabsSkillListWindow().currentExt();
      break;
    case JABS_MenuType.Tool:
      // update with tool information and the given slot.
      equippedActionSlot = this.getJabsEquippedToolWindow().currentExt();
      nextActionSkill = this.getJabsToolListWindow().currentExt();
      break;
    case JABS_MenuType.Dodge:
      // update with dodge skill information and the given slot.
      equippedActionSlot = this.getJabsEquippedDodgeSkillWindow().currentExt();
      nextActionSkill = this.getJabsDodgeSkillListWindow().currentExt();
      break;
  }

  // update the leader's equipped slots with the skill.
  actor.setEquippedSkill(equippedActionSlot, nextActionSkill);

  // automatically return back to the list.
  this.closeAbsWindow(JABS_MenuType.Assign);
};
//endregion command execution

/**
 * Sets the item parsed in the JABS menu help window.
 * @param {RPG_BaseItem} item The item to parse into the help window.
 */
Scene_Map.prototype.setJabsHelpItem = function(item)
{
  this.getJabsMenuHelpWindow().setItem(item);
};

/**
 * Sets the text of the JABS menu help window.
 * @param {string} text The text to put into the window.
 */
Scene_Map.prototype.setJabsHelpText = function(text)
{
  this.getJabsMenuHelpWindow().setText(text);
};
//endregion actions

//region update
/**
 * Extends {@link #update}.
 * Also updates JABS.
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
 * Performs update logic for the JABS engine.
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
 * Handles the logic in the scene for a party rotation.
 */
Scene_Map.prototype.handlePartyRotation = function()
{
  // acknowledge the party rotation request.
  $jabsEngine.requestPartyRotation = false;

  // add a hook for logic on-rotation.
  this.onPartyRotate();
};

/**
 * A hook for performing action when there was a party rotation request.
 */
Scene_Map.prototype.onPartyRotate = function()
{
};

/**
 * Refreshes the contents of the JABS menu.
 */
Scene_Map.prototype.refreshJabsMenu = function()
{
  // refresh the main menu window.
  this.getJabsMainListWindow().refresh();

  // acknowledge jabs menu refresh request.
  $jabsEngine.requestJabsMenuRefresh = false;
};

/**
 * Manages the ABS main menu's interactivity.
 */
Scene_Map.prototype.manageAbsMenu = function()
{
  switch (this.getJabsMenuFocus())
  {
    case JABS_MenuType.Main:
      this.showJabsMenuHelpWindow();
      this.showJabsMainListWindow();
      break;
    case JABS_MenuType.Skill:
      this.hideJabsMainWindow();
      this.showJabsSkillListWindow();
      break;
    case JABS_MenuType.Tool:
      this.hideJabsMainWindow();
      this.showJabsToolListWindow();
      break;
    case JABS_MenuType.Dodge:
      this.hideJabsMainWindow();
      this.showJabsDodgeSkillListWindow();
      break;
    case null:
      this.setJabsMenuFocus(JABS_MenuType.Main);
      break;
  }
};
//endregion update

/**
 * Extends {@link #callMenu}.
 * Disables the ability to directly call the menu by pressing the given key.
 */
J.ABS.Aliased.Scene_Map.set('callMenu', Scene_Map.prototype.callMenu);
Scene_Map.prototype.callMenu = function()
{
  // while JABS is enabled, the call to the menu will always fail.
  if ($jabsEngine.absEnabled) return;

  // perform original logic.
  J.ABS.Aliased.Scene_Map.get('callMenu').call(this);
};

//region show/hide
//region help
/**
 * Shows the JABS menu help window.
 */
Scene_Map.prototype.showJabsMenuHelpWindow = function()
{
  // grab the window.
  const window = this.getJabsMenuHelpWindow();

  // show the window.
  this.showJabsMenuWindow(window);
};

/**
 * Hides the JABS menu help window.
 */
Scene_Map.prototype.hideJabsMenuHelpWindow = function()
{
  // grab the window.
  const window = this.getJabsMenuHelpWindow();

  // hide the window.
  this.hideJabsMenuWindow(window);
};
//endregion help

//region main
/**
 * Shows the JABS menu main list window.
 */
Scene_Map.prototype.showJabsMainListWindow = function()
{
  // grab the window.
  const window = this.getJabsMainListWindow();

  // show the window.
  this.showJabsMenuWindow(window);
};

/**
 * Hides the JABS menu main list window.
 */
Scene_Map.prototype.hideJabsMainWindow = function()
{
  // grab the window.
  const window = this.getJabsMainListWindow();

  // hide the window.
  this.hideJabsMenuWindow(window);
};
//endregion main

//region combat skills
/**
 * Shows the JABS menu skill list window.
 */
Scene_Map.prototype.showJabsSkillListWindow = function()
{
  // grab the window.
  const window = this.getJabsSkillListWindow();

  // show the window.
  this.showJabsMenuWindow(window);
};

/**
 * Hides the JABS menu skill list window.
 */
Scene_Map.prototype.hideJabsCombatSkillListWindow = function()
{
  // grab the window.
  const window = this.getJabsSkillListWindow();

  // hide the window.
  this.hideJabsMenuWindow(window);
};
//endregion combat skills

//region tools
/**
 * Shows the JABS menu tool list window.
 */
Scene_Map.prototype.showJabsToolListWindow = function()
{
  // grab the window.
  const window = this.getJabsToolListWindow();

  // show the window.
  this.showJabsMenuWindow(window);
};

/**
 * Hides the JABS menu tool list window.
 */
Scene_Map.prototype.hideJabsToolListWindow = function()
{
  // grab the window.
  const window = this.getJabsToolListWindow();

  // hide the window.
  this.hideJabsMenuWindow(window);
};
//endregion tools

//region dodge skills
/**
 * Shows the JABS menu dodge skill list window.
 */
Scene_Map.prototype.showJabsDodgeSkillListWindow = function()
{
  // grab the window.
  const window = this.getJabsDodgeSkillListWindow();

  // show the window.
  this.showJabsMenuWindow(window);
};

/**
 * Hides the JABS menu dodge skill list window.
 */
Scene_Map.prototype.hideJabsDodgeSkillListWindow = function()
{
  // grab the window.
  const window = this.getJabsDodgeSkillListWindow();

  // hide the window.
  this.hideJabsMenuWindow(window);
};
//endregion dodge skills

//region equip combat skills
/**
 * Shows the JABS menu equip combat skill window.
 */
Scene_Map.prototype.showJabsEquippedCombatSkillsWindow = function()
{
  // grab the window.
  const window = this.getJabsEquippedCombatSkillsWindow();

  // show the window.
  this.showJabsMenuWindow(window);
};

/**
 * Hides the JABS menu equip combat skill window.
 */
Scene_Map.prototype.hideJabsEquippedCombatSkillsWindow = function()
{
  // grab the window.
  const window = this.getJabsEquippedCombatSkillsWindow();

  // hide the window.
  this.hideJabsMenuWindow(window);
};
//endregion equip combat skills

//region equip tool
/**
 * Shows the JABS menu equip tool window.
 */
Scene_Map.prototype.showJabsEquippedToolWindow = function()
{
  // grab the window.
  const window = this.getJabsEquippedToolWindow();

  // show the window.
  this.showJabsMenuWindow(window);
};

/**
 * Hides the JABS menu equip tool window.
 */
Scene_Map.prototype.hideJabsEquippedToolWindow = function()
{
  // grab the window.
  const window = this.getJabsEquippedToolWindow();

  // hide the window.
  this.hideJabsMenuWindow(window);
};
//endregion equip tool

//region equip dodge skill
/**
 * Shows the JABS menu equip dodge skill window.
 */
Scene_Map.prototype.showJabsEquippedDodgeSkillWindow = function()
{
  // grab the window.
  const window = this.getJabsEquippedDodgeSkillWindow();

  // show the window.
  this.showJabsMenuWindow(window);
};

/**
 * Hides the JABS menu equip dodge skill window.
 */
Scene_Map.prototype.hideJabsEquippedDodgeSkillWindow = function()
{
  // grab the window.
  const window = this.getJabsEquippedDodgeSkillWindow();

  // hide the window.
  this.hideJabsMenuWindow(window);
};
//endregion equip dodge skill

/**
 * Hides all windows of the JABS menu.
 */
Scene_Map.prototype.hideAllJabsWindows = function()
{
  // hide the help window.
  this.getJabsMenuHelpWindow().hide();

  // hide the main window.
  this.getJabsMainListWindow().hide();

  // hide the skill windows.
  this.getJabsSkillListWindow().hide();
  this.getJabsEquippedCombatSkillsWindow().hide();

  // hide the tool windows.
  this.getJabsToolListWindow().hide();
  this.getJabsEquippedToolWindow().hide();

  // hide the dodge windows.
  this.getJabsDodgeSkillListWindow().hide();
  this.getJabsEquippedDodgeSkillWindow().hide();
};

/**
 * Shows a JABS menu window.
 * @param {Window_AbsMenu|Window_AbsHelp|Window_AbsMenuSelect} window The window to show.
 */
Scene_Map.prototype.showJabsMenuWindow = function(window)
{
  // positively open it.
  window.show();
  window.open();
  window.activate();
};

/**
 * Hides a JABS menu window.
 * @param {Window_AbsMenu|Window_AbsHelp|Window_AbsMenuSelect} window The window to hide.
 */
Scene_Map.prototype.hideJabsMenuWindow = function(window)
{
  // negatively close it.
  window.hide();
  window.close();
  window.deactivate();
};
//endregion show/hide

/**
 * Closes a given JABS menu window.
 * @param {string} absWindow The type of abs window being closed.
 */
Scene_Map.prototype.closeAbsWindow = function(absWindow)
{
  switch (absWindow)
  {
    case JABS_MenuType.Main:
      this.hideJabsMainWindow();
      this.closeAbsMenu();
      break;
    case JABS_MenuType.Skill:
      this.hideJabsCombatSkillListWindow();
      this.hideJabsEquippedCombatSkillsWindow();
      this.setJabsMenuFocus(JABS_MenuType.Main);
      break;
    case JABS_MenuType.Tool:
      this.hideJabsToolListWindow();
      this.hideJabsEquippedToolWindow();
      this.setJabsMenuFocus(JABS_MenuType.Main);
      break;
    case JABS_MenuType.Dodge:
      this.hideJabsDodgeSkillListWindow();
      this.hideJabsEquippedDodgeSkillWindow();
      this.setJabsMenuFocus(JABS_MenuType.Main);
      break;
    case JABS_MenuType.Assign:
      this.redirectToParentAssignMenu();
      break;
  }
};

/**
 * Redirects the player's control to the parent assignment menu.
 */
Scene_Map.prototype.redirectToParentAssignMenu = function()
{
  // grab the current equip type.
  const equipType = this.getJabsMenuEquipType();

  // pivot on current equip type.
  switch (equipType)
  {
    case JABS_MenuType.Skill:
      const equippedCombatSkillsWindow = this.getJabsEquippedCombatSkillsWindow();
      equippedCombatSkillsWindow.deselect();
      equippedCombatSkillsWindow.refresh();
      this.getJabsSkillListWindow().activate();
      break;
    case JABS_MenuType.Tool:
      const equippedToolWindow = this.getJabsEquippedToolWindow();
      equippedToolWindow.deselect();
      equippedToolWindow.refresh();
      this.getJabsToolListWindow().activate();
      break;
    case JABS_MenuType.Dodge:
      const equippedDodgeSkillWindow = this.getJabsEquippedDodgeSkillWindow();
      equippedDodgeSkillWindow.deselect();
      equippedDodgeSkillWindow.refresh();
      this.getJabsDodgeSkillListWindow().activate();
      break;
  }
};

/**
 * Close out from the Abs menu.
 */
Scene_Map.prototype.closeAbsMenu = function()
{
  this.getJabsMainListWindow().closeMenu();
};
//endregion Scene_Map