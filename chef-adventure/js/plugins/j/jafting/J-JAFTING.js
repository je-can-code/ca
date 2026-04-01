//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v2.0.0 JAFTING-Core] Root JAFTING menu; extensions provide Creation and Refinement.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is the core menu system that other JAFTING menus plug into.
 * It was designed as an extensible wrapper scene for all JAFTING modes.
 *
 * NOTE ABOUT THIS PLUGIN:
 * This is a base plugin that offers no actual crafting functionality itself.
 * It offers instead a root "JAFTING" menu that the other extensions will
 * connect to for singular JAFTING access. Chances are, if you are using
 * this plugin, you probably also want to grab the "Creation" extension and/or
 * the "Refinement" extension and place them below this one.
 * ============================================================================
 * ORGANIZATION:
 * Have you ever wanted a menu that has a single purpose, such as granting
 * access to all the other crafting menus built to work with JAFTING? Well now
 * you can! Just drop this plugin above your other installed JAFTING extension
 * plugins, and voila! It works.
 *
 * NOTE ABOUT THIS PLUGIN:
 * It isn't really necessary. It is literally just a wrapper scene and menu
 * that unifies access to all JAFTING scenes. You could also just directly
 * call the other JAFTING scenes directly if you preferred.
 * ============================================================================
 * CHANGELOG:
 * - 2.0.0
 *    Removed all references to refinement logic.
 *    Extracted the crafting logic entirely into its own plugin.
 *    Repurposes this plugin to be the "core" or "root" crafting menu only.
 *    Retroactively added this CHANGELOG.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 *
 * @command call-menu
 * @text Call Core Menu
 * @desc Brings up the core JAFTING menu.
 *
 */

//region plugin metadata
/**
 * Plugin metadata for the core JAFTING plugin.
 * Because this plugin offers little actual functionality, there is little that
 * can be configured.
 */
class J_CraftingPluginMetadata
  extends PluginMetadata
{
  /**
   * Constructor.
   */
  constructor(name, version)
  {
    super(name, version);
  }
}

//endregion plugin metadata

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.3';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//endregion version check

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.JAFTING = {};

/**
 * A collection of all extensions for JAFTING.
 */
J.JAFTING.EXT = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.JAFTING.Metadata = new J_CraftingPluginMetadata('J-JAFTING', '2.0.0');

/**
 * A helpful mapping of all the various RMMZ classes being extended.
 */
J.JAFTING.Aliased = {};
J.JAFTING.Aliased.Game_Party = new Map();
//endregion Introduction

//region plugin commands
/**
 * A plugin command.<br>
 * Calls the core JAFTING menu.
 */
PluginManager.registerCommand(J.JAFTING.Metadata.name, "call-menu", () =>
{
  Scene_Jafting.callScene();
});
//endregion plugin commands

//region Scene_Jafting
class Scene_Jafting
  extends Scene_MenuBase
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
   * Initialize all properties for the root JAFTING hub scene.
   */
  initMembers()
  {
    // perform original logic.
    super.initMembers();

    // initialize the root-namespace definition members.
    this.initCoreMembers();

    // initialize the primary list and header windows.
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
     * A grouping of all properties associated with this JAFTING scene.
     */
    this._j._crafting = {};
  }

  /**
   * The primary properties of the scene: the command list and header windows
   * for the root JAFTING menu.
   */
  initPrimaryMembers()
  {
    /**
     * The window that lists Creation, Refinement, and other registered JAFTING modes.
     * @type {Window_JaftingList}
     */
    this._j._crafting._commandList = null;

    /**
     * The window that displays at the top while the JAFTING list is active.
     * @type {Window_JaftingListHeader}
     */
    this._j._crafting._listHeader = null;
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
    this.createJaftingRootWindows();
  }

  //endregion create

  //region windows
  /**
   * Creates the root-level JAFTING hub windows.
   */
  createJaftingRootWindows()
  {
    this.createJaftingListWindow();

    // create the header window.
    this.createJaftingListHeaderWindow();
  }

  //region header window
  /**
   * Creates a header window for the JAFTING command list.
   */
  createJaftingListHeaderWindow()
  {
    // create the window.
    const window = this.buildJaftingListHeaderWindow();

    // update the tracker with the new window.
    this.setJaftingListHeaderWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the JAFTING list header window.
   * @returns {Window_JaftingListHeader}
   */
  buildJaftingListHeaderWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.jaftingListHeaderRectangle();

    // create the window with the rectangle.
    const window = new Window_JaftingListHeader(rectangle);

    window.refresh();

    return window;
  }

  /**
   * Gets the rectangle associated with the JAFTING list header window.
   * @returns {Rectangle}
   */
  jaftingListHeaderRectangle()
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
   * Gets the currently tracked JAFTING list header window.
   * @returns {Window_JaftingListHeader}
   */
  getJaftingListHeaderWindow()
  {
    return this._j._crafting._listHeader;
  }

  /**
   * Set the currently tracked JAFTING list header window to the given window.
   * @param {Window_JaftingListHeader} listHeaderWindow The header window to track.
   */
  setJaftingListHeaderWindow(listHeaderWindow)
  {
    this._j._crafting._listHeader = listHeaderWindow;
  }

  /**
   * Opens the root header window.
   */
  openRootHeaderWindow()
  {
    // grab the root header window.
    const rootHeaderWindow = this.getJaftingListHeaderWindow();

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
    const rootHeaderWindow = this.getJaftingListHeaderWindow();

    // close and hide the root header window.
    rootHeaderWindow.close();
    rootHeaderWindow.hide();
  }

  //endregion header window

  //region list window
  /**
   * Creates the list of JAFTING modes available to the player.
   */
  createJaftingListWindow()
  {
    // create the window.
    const window = this.buildJaftingListWindow();

    // update the tracker with the new window.
    this.setJaftingListWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the JAFTING command list window.
   * @returns {Window_JaftingList}
   */
  buildJaftingListWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.jaftingListRectangle();

    // create the window with the rectangle.
    const window = new Window_JaftingList(rectangle);

    // assign cancel functionality.
    window.setHandler('cancel', this.popScene.bind(this));

    // assign on-select functionality.
    window.setHandler('ok', this.onRootJaftingSelection.bind(this));

    return window;
  }

  /**
   * Gets the rectangle associated with the JAFTING command list window.
   * @returns {Rectangle}
   */
  jaftingListRectangle()
  {
    // define the width of the list.
    const width = 800;

    // calculate the X for where the origin of the list window should be.
    const x = (Graphics.boxWidth / 2) - (width * 0.5);

    // define the height of the list.
    const height = 240;

    // calculate the Y for where the origin of the list window should be.
    const y = (Graphics.boxHeight / 2) - (height * 0.5);

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked JAFTING command list window.
   * @returns {Window_JaftingList}
   */
  getJaftingListWindow()
  {
    return this._j._crafting._commandList;
  }

  /**
   * Set the currently tracked JAFTING command list window to the given window.
   * @param {Window_JaftingList} listWindow The list window to track.
   */
  setJaftingListWindow(listWindow)
  {
    this._j._crafting._commandList = listWindow;
  }

  /**
   * Opens the root list window and activates it.
   */
  openRootListWindow()
  {
    const rootListWindow = this.getJaftingListWindow();

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
    const rootListWindow = this.getJaftingListWindow();

    // close and deactivate the root list window.
    rootListWindow.close();
    rootListWindow.deactivate();
  }

  /**
   * Gets the current symbol of the root JAFTING list (the highlighted command key).
   * @returns {string}
   */
  getRootJaftingKey()
  {
    return this.getJaftingListWindow()
      .currentSymbol();
  }

  //endregion list window

  /**
   * Opens all windows associated with the root JAFTING hub.
   */
  openRootJaftingWindows()
  {
    // open the root list window.
    this.openRootListWindow();

    // open the root header window.
    this.openRootHeaderWindow();
  }

  /**
   * Closes all windows associated with the root JAFTING hub.
   */
  closeRootJaftingWindows()
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
   * When a jafting choice is made, execute this logic.
   * This is only implemented/extended by the jafting types.
   */
  onRootJaftingSelection()
  {
  }

  //endregion root actions
  //endregion actions
}

//endregion Scene_Jafting

//region Window_JaftingList
/**
 * Root JAFTING hub list: commands registered by Creation, Refinement, and other extensions.
 */
class Window_JaftingList
  extends Window_Command
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
   * Builds the hub command list from {@link #buildCommands}.
   */
  makeCommandList()
  {
    const commands = this.buildCommands();

    // add all the built commands.
    commands.forEach(this.addBuiltCommand, this);
  }

  /**
   * Returns hub commands from extensions; core does not add modes here by default.
   * @returns {BuiltWindowCommand[]}
   */
  buildCommands()
  {
    /*
    const refinementCommand = new WindowCommandBuilder("Refinement")
      .setSymbol("refinement")
      .addSubTextLine("The niche hobbiest dream.")
      .addSubTextLine("Update equips by consuming other equips and materials- to an extent.")
      .setIconIndex(2566)
      .build();

    const freestyleCommand = new WindowCommandBuilder("Freestyle")
      .setSymbol("freestyle")
      .addSubTextLine("Submit to RNGesus.")
      .addSubTextLine("Freestyle with some materials to experience creation- with a touch of random.")
      .setIconIndex(2569)
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

//endregion Window_JaftingList

//region Window_JaftingListHeader
class Window_JaftingListHeader
  extends Window_Base
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
   * Draws the JAFTING hub title and short description.
   */
  drawContent()
  {
    // define the origin x,y coordinates.
    const [ x, y ] = [ 0, 0 ];

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
    const headerText = 'The Jafting System';

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
    const detailText = 'Item Creation of all kinds, at your doorstep.';

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

//endregion Window_JaftingListHeader

//# sourceMappingURL=J-JAFTING.js.map
