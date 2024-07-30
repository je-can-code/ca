//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.1 OMNI] Enables the "omnipedia" data-centric scene.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin enables a new scene called the "Omnipedia".
 * This scene is designed with extendability in mind, and can/will/does
 * contain a number of other sub-datasets, such as:
 * - Bestiary
 * - Items
 * - Weapons
 * - Armors
 *
 * Integrates with others of mine plugins:
 * - J-ControlledDrops; enables viewing of dropped loot in the bestiary.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.1
 *    Updated JABS menu integration with help text.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */
//endregion Introduction

//region Metadata
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.OMNI = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.OMNI.Metadata = {};

/**
 * The name of this plugin.
 */
J.OMNI.Metadata.Name = 'J-Omnipedia';

/**
 * The version of this plugin.
 */
J.OMNI.Metadata.Version = '1.0.1';

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.OMNI.PluginParameters = PluginManager.parameters(J.OMNI.Metadata.Name);

/**
 * The various data points that define the command for the Omnipedia.
 */
J.OMNI.Metadata.Command = {};
J.OMNI.Metadata.Command.Name = "The Omnipedia";
J.OMNI.Metadata.Command.Symbol = "omni-menu";
J.OMNI.Metadata.Command.IconIndex = 232;
J.OMNI.Metadata.Command.ColorIndex = 5;

/**
 * The id of the switch that will represent whether or not the command
 * should be visible in the JABS menu.
 * @type {number}
 */
J.OMNI.Metadata.InJabsMenuSwitch = 102;

/**
 * The id of the switch that will represent whether or not the command
 * should be visible in the main menu.
 * @type {number}
 */
J.OMNI.Metadata.InMainMenuSwitch = 102;

/**
 * A collection of all aliased methods for this plugin.
 */
J.OMNI.Aliased = {};
J.OMNI.Aliased.Game_Party = new Map();
J.OMNI.Aliased.Scene_Map = new Map();
J.OMNI.Aliased.Scene_Menu = new Map();
J.OMNI.Aliased.Window_AbsMenu = new Map();
J.OMNI.Aliased.Window_MenuCommand = new Map();
//endregion Metadata

//region Game_Party
/**
 * Extends {@link #initialize}.<br>
 * Adds a hook for omnipedia extensions to initialize their members.
 */
J.OMNI.Aliased.Game_Party.set('initialize', Game_Party.prototype.initialize);
Game_Party.prototype.initialize = function()
{
  // perform original logic.
  J.OMNI.Aliased.Game_Party.get('initialize').call(this);

  // initialize all omnipedia-related members.
  this.initOmnipediaMembers();
};

/**
 * Initializes all members related to the omnipedia.
 */
Game_Party.prototype.initOmnipediaMembers = function()
{
};

/**
 * Determines whether or not the omnipedia has been initialized.
 * @returns {boolean}
 */
Game_Party.prototype.isOmnipediaInitialized = function()
{
  return !!this._j._omni;
};
//endregion Game_Party

//region Game_System
/**
 * Calls the omnipedia scene if possible.
 * @param {boolean=} force Whether or not to force-call the scene; defaults to false.
 */
Game_System.prototype.callOmnipediaScene = function(force = false)
{
  // check if the omnipedia scene can be called.
  if (this.canCallOmnipediaScene() || force)
  {
    // call it.
    Scene_Omnipedia.callScene();
  }
  // cannot call the omnipedia scene.
  else
  {
    // sorry!
    SoundManager.playBuzzer();
  }
};

/**
 * Determines whether or not the omnipedia scene can be called.
 * @returns {boolean}
 */
Game_System.prototype.canCallOmnipediaScene = function()
{
  // peek at the omnipedia!
  return true;
};
//endregion Game_System

//region Scene_Map
/**
 * Extends {@link #createJabsAbsMenuMainWindow}.<br>
 * Adds additional handling in the list for the omnipedia command.
 */
J.OMNI.Aliased.Scene_Map.set('createJabsAbsMenuMainWindow', Scene_Map.prototype.createJabsAbsMenuMainWindow);
Scene_Map.prototype.createJabsAbsMenuMainWindow = function()
{
  // perform original logic.
  J.OMNI.Aliased.Scene_Map.get('createJabsAbsMenuMainWindow').call(this);

  // grab the list window.
  const mainMenuWindow = this.getJabsMainListWindow();

  // add an additional handler for the new menu.
  mainMenuWindow.setHandler(J.OMNI.Metadata.Command.Symbol, this.commandOmnipedia.bind(this));
};

/**
 * Calls forth the omnipedia scene.
 */
Scene_Map.prototype.commandOmnipedia = function()
{
  Scene_Omnipedia.callScene();
};
//endregion Scene_Map

//region Scene_Menu
/**
 * Hooks into the command window creation of the menu to add functionality for the SDP menu.
 */
J.OMNI.Aliased.Scene_Menu.set('createCommandWindow', Scene_Menu.prototype.createCommandWindow);
Scene_Menu.prototype.createCommandWindow = function()
{
  // perform original logic.
  J.OMNI.Aliased.Scene_Menu.get('createCommandWindow').call(this);

  // add an additional handler for the new menu.
  this._commandWindow.setHandler(J.OMNI.Metadata.Command.Symbol, this.commandOmnipedia.bind(this));
};

/**
 * Calls forth the omnipedia scene.
 */
Scene_Menu.prototype.commandOmnipedia = function()
{
  Scene_Omnipedia.callScene();
};
//endregion Scene_Menu

//region Scene_Omnipedia
/**
 * A scene containing access to all available and implemented pedia entries.
 */
class Scene_Omnipedia extends Scene_MenuBase
{
  /**
   * Pushes this current scene onto the stack, forcing it into action.
   */
  static callScene()
  {
    SceneManager.push(this);
  }

  /**
   * Constructor.
   */
  constructor()
  {
    // call super when having extended constructors.
    super();

    // jumpstart initialization on creation.
    this.initialize();
  }

  //region init
  /**
   * Initialize all properties for our omnipedia.
   */
  initMembers()
  {
    // perform original logic.
    super.initMembers();

    // initialize the root-namespace definition members.
    this.initCoreMembers();

    // initialize the main omnipedia base list of pedias.
    this.initPrimaryMembers();
  }

  /**
   * The core properties of this scene are the root namespace definitions for this plugin.
   */
  initCoreMembers()
  {
    /**
     * The shared root namespace for all of J's plugin data.
     */
    this._j ||= {};

    /**
     * A grouping of all properties associated with the omnipedia.
     */
    this._j._omni = {};
  }

  /**
   * The primary properties of the scene are the initial properties associated with
   * the main list containing all pedias unlocked by the player along with some subtext of
   * what the pedia entails.
   */
  initPrimaryMembers()
  {
    /**
     * The window that shows the list of available pedias.
     * @type {Window_OmnipediaList}
     */
    this._j._omni._pediaList = null;

    /**
     * The window that displays at the top while the omnipedia list is active.
     * @type {Window_OmnipediaListHeader}
     */
    this._j._omni._pediaListHeader = null;
  }
  //endregion init

  //region create
  /**
   * Initialize all resources required for this scene.
   */
  create()
  {
    // perform original logic.
    super.create();

    // create the various display objects on the screen.
    this.createDisplayObjects();
  }

  /**
   * Creates the display objects for this scene.
   */
  createDisplayObjects()
  {
    // create all our windows.
    this.createAllWindows();
  }

  /**
   * Creates all windows associated with this scene.
   */
  createAllWindows()
  {
    // create all root windows for the main listing.
    this.createOmnipediaRootWindows();
  }
  //endregion create

  //region windows
  /**
   * Creates the root-level omnipedia windows.
   */
  createOmnipediaRootWindows()
  {
    // create the root omnipedia list of pedias.
    this.createOmnipediaListWindow();

    // create the header window.
    this.createOmnipediaListHeaderWindow();
  }

  //region header window
  /**
   * Creates a header window for the omnipedia list.
   */
  createOmnipediaListHeaderWindow()
  {
    // create the window.
    const window = this.buildOmnipediaListHeaderWindow();

    // update the tracker with the new window.
    this.setOmnipediaListHeaderWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the omnipedia list header window.
   * @returns {Window_OmnipediaListHeader}
   */
  buildOmnipediaListHeaderWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.omnipediaListHeaderRectangle();

    // create the window with the rectangle.
    const window = new Window_OmnipediaListHeader(rectangle);

    window.refresh();

    // return the built and configured omnipedia list window.
    return window;
  }

  /**
   * Gets the rectangle associated with the omnipedia list header window.
   * @returns {Rectangle}
   */
  omnipediaListHeaderRectangle()
  {
    // define the width of the list.
    const width = 1000;

    // determine the x based on the width.
    const x = (Graphics.boxWidth / 2) - (width * 0.5);

    // define the height of the rectangle.
    const height = 100;

    // arbitrarily decide the y.
    const y = 100;

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked omnipedia list header window.
   * @returns {Window_OmnipediaListHeader}
   */
  getOmnipediaListHeaderWindow()
  {
    return this._j._omni._pediaListHeader;
  }

  /**
   * Set the currently tracked omnipedia list header window to the given window.
   * @param {Window_OmnipediaListHeader} listHeaderWindow The omnipedia list header window to track.
   */
  setOmnipediaListHeaderWindow(listHeaderWindow)
  {
    this._j._omni._pediaListHeader = listHeaderWindow;
  }

  /**
   * Opens the root header window.
   */
  openRootHeaderWindow()
  {
    // grab the root header window.
    const rootHeaderWindow = this.getOmnipediaListHeaderWindow();

    // open and show the root header window.
    rootHeaderWindow.open();
    rootHeaderWindow.show();
  }

  /**
   * Closes the root header window.
   */
  closeRootHeaderWindow()
  {
    // grab the root header window.
    const rootHeaderWindow = this.getOmnipediaListHeaderWindow();

    // close and hide the root header window.
    rootHeaderWindow.close();
    rootHeaderWindow.hide();
  }
  //endregion header window

  //region list window
  /**
   * Creates the list of pedias available to the player to peruse.
   */
  createOmnipediaListWindow()
  {
    // create the window.
    const window = this.buildOmnipediaListWindow();

    // update the tracker with the new window.
    this.setOmnipediaListWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the omnipedia listing window.
   * @returns {Window_OmnipediaList}
   */
  buildOmnipediaListWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.omnipediaListRectangle();

    // create the window with the rectangle.
    const window = new Window_OmnipediaList(rectangle);

    // assign cancel functionality.
    window.setHandler('cancel', this.popScene.bind(this));

    // assign on-select functionality.
    window.setHandler('ok', this.onRootPediaSelection.bind(this));

    // return the built and configured omnipedia list window.
    return window;
  }

  /**
   * Gets the rectangle associated with the omnipedia list command window.
   * @returns {Rectangle}
   */
  omnipediaListRectangle()
  {
    // define the width of the list.
    const width = 800;

    // calculate the X for where the origin of the list window should be.
    const x = (Graphics.boxWidth / 2) - (width * 0.5);

    // define the height of the list.
    const height = 400;

    // calculate the Y for where the origin of the list window should be.
    const y = (Graphics.boxHeight / 2) - (height * 0.5);

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked omnipedia list window.
   * @returns {Window_OmnipediaList}
   */
  getOmnipediaListWindow()
  {
    return this._j._omni._pediaList;
  }

  /**
   * Set the currently tracked omnipedia list window to the given window.
   * @param {Window_OmnipediaList} listWindow The omnipedia list window to track.
   */
  setOmnipediaListWindow(listWindow)
  {
    this._j._omni._pediaList = listWindow;
  }

  /**
   * Opens the root list window and activates it.
   */
  openRootListWindow()
  {
    // grab the root omnipedia list window.
    const rootListWindow = this.getOmnipediaListWindow();

    // open, show, and activate the root list window.
    rootListWindow.open();
    rootListWindow.show();
    rootListWindow.activate();
  }

  /**
   * Closes the root list window.
   */
  closeRootListWindow()
  {
    // grab the root omnipedia list window.
    const rootListWindow = this.getOmnipediaListWindow();

    // close and deactivate the root list window.
    rootListWindow.close();
    rootListWindow.deactivate();
  }

  /**
   * Gets the current symbol of the root omnipedia.
   * This is effectively the currently highlighted selection's key of that window.
   * @returns {string}
   */
  getRootOmnipediaKey()
  {
    return this.getOmnipediaListWindow().currentSymbol();
  }
  //endregion list window

  /**
   * Opens all windows associated with the root omnipedia.
   */
  openRootPediaWindows()
  {
    // open the root list window.
    this.openRootListWindow();

    // open the root header window.
    this.openRootHeaderWindow();
  }

  /**
   * Closes all windows associated with the root omnipedia.
   */
  closeRootPediaWindows()
  {
    // close the list window.
    this.closeRootListWindow();

    // close the header window.
    this.closeRootHeaderWindow();
  }
  //endregion windows

  //region actions
  //region root actions
  /**
   * When an pedia choice is made, execute this logic.
   * This is only implemented/extended by the pedias.
   */
  onRootPediaSelection()
  {
    console.debug(`selected "${this.getRootOmnipediaKey()}" option.`);
  }
  //endregion root actions
  //endregion actions
}
//endregion Scene_Omnipedia

//region Window_AbsMenu
if (J.ABS)
{
  /**
   * Extends {@link #buildCommands}.<br>
   * Adds the sdp command at the end of the list.
   * @returns {BuiltWindowCommand[]}
   */
  J.OMNI.Aliased.Window_AbsMenu.set('buildCommands', Window_AbsMenu.prototype.buildCommands);
  Window_AbsMenu.prototype.buildCommands = function()
  {
    // perform original logic to get the base commands.
    const originalCommands = J.OMNI.Aliased.Window_AbsMenu.get('buildCommands').call(this);

    // if the switch is not ON, then this command is not present.
    if (!this.canAddOmnipediaCommand()) return originalCommands;

    // build the command.
    const command = new WindowCommandBuilder(J.OMNI.Metadata.Command.Name)
      .setSymbol(J.OMNI.Metadata.Command.Symbol)
      .setIconIndex(J.OMNI.Metadata.Command.IconIndex)
      .setColorIndex(J.OMNI.Metadata.Command.ColorIndex)
      .setHelpText(this.omnipediaHelpText())
      .build();

    // add the new command.
    originalCommands.push(command);

    // return the updated command list.
    return originalCommands;
  };

  /**
   * Determines whether or not the sdp command can be added to the JABS menu.
   * @returns {boolean} True if the command should be added, false otherwise.
   */
  Window_AbsMenu.prototype.canAddOmnipediaCommand = function()
  {
    // if the necessary switch isn't ON, don't render the command at all.
    if (!$gameSwitches.value(J.OMNI.Metadata.InJabsMenuSwitch)) return false;

    // render the command!
    return true;
  };

  /**
   * The help text for the JABS omnipedia menu.
   * @returns {string}
   */
  Window_AbsMenu.prototype.omnipediaHelpText = function()
  {
    const description = [
      "An encyclopedia-like system full of data-driven entries.",
      "It can contain many sub-categories, such as the Monsterpedia."
    ];

    return description.join("\n");
  };
}
//endregion Window_AbsMenu

//region Window_MenuCommand
/**
 * Extends {@link #makeCommandList}.<br>
 * Also adds the omnipedia command.
 */
J.OMNI.Aliased.Window_MenuCommand.set('makeCommandList', Window_MenuCommand.prototype.makeCommandList);
Window_MenuCommand.prototype.makeCommandList = function()
{
  // perform original logic.
  J.OMNI.Aliased.Window_MenuCommand.get('makeCommandList').call(this);

  // if we cannot add the command, then do not.
  if (!this.canAddOmnipediaCommand()) return;

  // build the command.
  const command = new WindowCommandBuilder(J.OMNI.Metadata.Command.Name)
    .setSymbol(J.OMNI.Metadata.Command.Symbol)
    .setIconIndex(J.OMNI.Metadata.Command.IconIndex)
    .setColorIndex(J.OMNI.Metadata.Command.ColorIndex)
    .build();

  // determine what the last command is.
  const lastCommand = this._list.at(-1);

  // check if the last command is the "End Game" command.
  if (lastCommand.symbol === "gameEnd")
  {
    // add it before the "End Game" command.
    this._list.splice(this._list.length - 2, 0, command);
  }
  // the last command is something else.
  else
  {
    // just add it to the end.
    this.addBuiltCommand(command);
  }
};

/**
 * Determines whether or not the sdp command can be added to the JABS menu.
 * @returns {boolean} True if the command should be added, false otherwise.
 */
Window_MenuCommand.prototype.canAddOmnipediaCommand = function()
{
  // if the necessary switch isn't ON, don't render the command at all.
  if (!$gameSwitches.value(J.OMNI.Metadata.InMainMenuSwitch)) return false;

  // render the command!
  return true;
};
//endregion Window_MenuCommand

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
   * Implements {@link #makeCommandList}.<br>
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
   * Overrides {@link #itemHeight}.<br>
   * Makes the command rows bigger so there can be additional lines.
   * @returns {number}
   */
  itemHeight()
  {
    return this.lineHeight() * 2;
  }
}
//endregion Window_OmnipediaList

//region Window_OmnipediaListHeader
class Window_OmnipediaListHeader extends Window_Base
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
   * Implements {@link Window_Base.drawContent}.<br>
   * Draws a header and some detail for the omnipedia list header.
   */
  drawContent()
  {
    // define the origin x,y coordinates.
    const [x, y] = [0, 0];

    // shorthand the lineHeight.
    const lh = this.lineHeight();

    // draw the header.
    this.drawHeader(x, y);

    // draw the detail under the header.
    const detailY = y + (lh * 1);
    this.drawDetail(x, detailY);
  }

  /**
   * Draws the header text.
   * @param {number} x The base x coordinate for this section.
   * @param {number} y The base y coordinate for this section.
   */
  drawHeader(x, y)
  {
    // make the font size nice and big.
    this.modFontSize(10);

    // define the text for this section.
    const headerText = `The Omnipedia`;

    // when using "center"-alignment, you center across the width of the window.
    const headerTextWidth = this.width;

    // enable italics.
    this.toggleBold(true);

    // render the headline title text.
    this.drawText(headerText, x, y, headerTextWidth, "center");

    // reset any lingering font settings.
    this.resetFontSettings();
  }

  /**
   * Draws the detail text.
   * @param {number} x The base x coordinate for this section.
   * @param {number} y The base y coordinate for this section.
   */
  drawDetail(x, y)
  {
    // define the text for this section.
    const detailText = `Where you can find a pedia for everything.`;

    // when using "center"-alignment, you center across the width of the window.
    const detailTextWidth = this.width;

    // enable italics.
    this.toggleItalics(true);

    // render the headline title text.
    this.drawText(detailText, x, y, detailTextWidth, "center");

    // reset any lingering font settings.
    this.resetFontSettings();
  }
}
//endregion Window_OmnipediaListHeader