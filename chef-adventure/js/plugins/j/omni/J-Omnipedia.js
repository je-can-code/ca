//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.1.0 OMNI] Enables the "omnipedia" data-centric scene.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-Base-Save
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
 * NOTE ABOUT NOTETAGS:
 * This plugin has no notetags of its own- it is purely the extendable
 * scene/menu shell that its sub-dataset extensions (Monster, Quest, etc.)
 * plug into. Those extensions own their own respective tags.
 * ============================================================================
 * CHANGELOG:
 * - 1.1.0
 *    Routed the _omni namespace into its own save section, so every
 *    omnipedia extension's data lands in systems/omni.json together rather
 *    than inside the party and system blobs.
 *    Moved the _omni namespace seeding from the initialize alias to
 *    initMembers, so a decoded save can establish it without a constructor.
 * - 1.0.1
 *    Updated JABS menu integration with help text.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */
//endregion Introduction

//#region src/plugins/omni/core/_metadata/_pluginMetadata.js
var J_Omnipedia_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	* @param {string} name The plugin name.
	* @param {string} version The plugin version.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br/>
	* Maps static command and switch metadata used by menu integration.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeMetadata();
	}
	/**
	* Initializes the metadata associated with this plugin.
	*/
	initializeMetadata() {
		/**
		* The various data points that define the command for the Omnipedia.
		*/
		this.Command = {
			Name: "The Omnipedia",
			Symbol: "omni-menu",
			IconIndex: 232,
			ColorIndex: 5
		};
		/**
		* The id of the switch that will represent whether or not the command
		* should be visible in the JABS menu.
		* @type {number}
		*/
		this.InJabsMenuSwitch = 102;
		/**
		* The id of the switch that will represent whether or not the command
		* should be visible in the main menu.
		* @type {number}
		*/
		this.InMainMenuSwitch = 102;
	}
};

//#endregion
//#region src/plugins/omni/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.2.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (hasBaseRequirement === false) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.OMNI = {};
/**
* The `metadata` associated with this plugin, such as version.
*/
J.OMNI.Metadata = new J_Omnipedia_PluginMetadata("J-Omnipedia", "1.1.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.OMNI.Aliased = {};
J.OMNI.Aliased.Game_Party = new Map();
J.OMNI.Aliased.Scene_Map = new Map();
J.OMNI.Aliased.Scene_Menu = new Map();
J.OMNI.Aliased.Window_MenuCommand = new Map();

//#endregion
//#region src/plugins/omni/core/windows/Window_OmnipediaListHeader.js
var Window_OmnipediaListHeader = class extends Window_Base {
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Implements {@link Window_Base.drawContent}.<br/>
	* Draws a header and some detail for the omnipedia list header.
	*/
	drawContent() {
		const [x, y] = [0, 0];
		const lh = this.lineHeight();
		this.drawHeader(x, y);
		const detailY = y + lh * 1;
		this.drawDetail(x, detailY);
	}
	/**
	* Draws the header text.
	* @param {number} x The base x coordinate for this section.
	* @param {number} y The base y coordinate for this section.
	*/
	drawHeader(x, y) {
		this.modFontSize(10);
		const headerText = `The Omnipedia`;
		const headerTextWidth = this.width;
		this.toggleBold(true);
		this.drawText(headerText, x, y, headerTextWidth, "center");
		this.resetFontSettings();
	}
	/**
	* Draws the detail text.
	* @param {number} x The base x coordinate for this section.
	* @param {number} y The base y coordinate for this section.
	*/
	drawDetail(x, y) {
		const detailText = `Where you can find a pedia for everything.`;
		const detailTextWidth = this.width;
		this.toggleItalics(true);
		this.drawText(detailText, x, y, detailTextWidth, "center");
		this.resetFontSettings();
	}
};

//#endregion
//#region src/plugins/omni/core/windows/Window_OmnipediaList.js
/**
* A window displaying the list of pedias available.
*/
var Window_OmnipediaList = class extends Window_Command {
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Implements {@link #makeCommandList}.<br/>
	* Creates the command list of omnipedia entries available for this window.
	*/
	makeCommandList() {
		const commands = this.buildCommands();
		commands.forEach(this.addBuiltCommand, this);
	}
	/**
	* Builds all commands for this command window.
	* Adds all omnipedia commands to the list that are available.
	* @returns {BuiltWindowCommand[]}
	*/
	buildCommands() {
		return [];
	}
	/**
	* Overwrites {@link #itemHeight}.<br/>
	* Makes the command rows bigger so there can be additional lines.
	* @returns {number}
	*/
	itemHeight() {
		return this.lineHeight() * 2;
	}
};

//#endregion
//#region src/plugins/omni/core/scenes/Scene_Omnipedia.js
/**
* A scene containing access to all available and implemented pedia entries.
*/
var Scene_Omnipedia = class extends Scene_MenuBase {
	/**
	* Pushes this current scene onto the stack, forcing it into action.
	*/
	static callScene() {
		SceneManager.push(this);
	}
	/**
	* Constructor.
	*/
	constructor() {
		super();
		this.initialize();
	}
	/**
	* Initialize all properties for our omnipedia.
	*/
	initMembers() {
		super.initMembers();
		this.initCoreMembers();
		this.initPrimaryMembers();
	}
	/**
	* The core properties of this scene are the root namespace definitions for this plugin.
	*/
	initCoreMembers() {
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
	initPrimaryMembers() {
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
	/**
	* Initialize all resources required for this scene.
	*/
	create() {
		super.create();
		this.createDisplayObjects();
	}
	/**
	* Creates the display objects for this scene.
	*/
	createDisplayObjects() {
		this.createAllWindows();
	}
	/**
	* Creates all windows associated with this scene.
	*/
	createAllWindows() {
		this.createOmnipediaRootWindows();
	}
	/**
	* Creates the root-level omnipedia windows.
	*/
	createOmnipediaRootWindows() {
		this.createOmnipediaListWindow();
		this.createOmnipediaListHeaderWindow();
	}
	/**
	* Creates a header window for the omnipedia list.
	*/
	createOmnipediaListHeaderWindow() {
		const window = this.buildOmnipediaListHeaderWindow();
		this.setOmnipediaListHeaderWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the omnipedia list header window.
	* @returns {Window_OmnipediaListHeader}
	*/
	buildOmnipediaListHeaderWindow() {
		const rectangle = this.omnipediaListHeaderRectangle();
		const window = new Window_OmnipediaListHeader(rectangle);
		window.refresh();
		return window;
	}
	/**
	* Gets the rectangle associated with the omnipedia list header window.
	* @returns {Rectangle}
	*/
	omnipediaListHeaderRectangle() {
		const width = 1e3;
		const x = Graphics.boxWidth / 2 - width * .5;
		const height = 100;
		const y = 100;
		return new Rectangle(x, y, width, height);
	}
	/**
	* Gets the currently tracked omnipedia list header window.
	* @returns {Window_OmnipediaListHeader}
	*/
	getOmnipediaListHeaderWindow() {
		return this._j._omni._pediaListHeader;
	}
	/**
	* Set the currently tracked omnipedia list header window to the given window.
	* @param {Window_OmnipediaListHeader} listHeaderWindow The omnipedia list header window to track.
	*/
	setOmnipediaListHeaderWindow(listHeaderWindow) {
		this._j._omni._pediaListHeader = listHeaderWindow;
	}
	/**
	* Opens the root header window.
	*/
	openRootHeaderWindow() {
		const rootHeaderWindow = this.getOmnipediaListHeaderWindow();
		rootHeaderWindow.open();
		rootHeaderWindow.show();
	}
	/**
	* Closes the root header window.
	*/
	closeRootHeaderWindow() {
		const rootHeaderWindow = this.getOmnipediaListHeaderWindow();
		rootHeaderWindow.close();
		rootHeaderWindow.hide();
	}
	/**
	* Creates the list of pedias available to the player to peruse.
	*/
	createOmnipediaListWindow() {
		const window = this.buildOmnipediaListWindow();
		this.setOmnipediaListWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the omnipedia listing window.
	* @returns {Window_OmnipediaList}
	*/
	buildOmnipediaListWindow() {
		const rectangle = this.omnipediaListRectangle();
		const window = new Window_OmnipediaList(rectangle);
		window.setHandler("cancel", this.popScene.bind(this));
		window.setHandler("ok", this.onRootPediaSelection.bind(this));
		return window;
	}
	/**
	* Gets the rectangle associated with the omnipedia list command window.
	* @returns {Rectangle}
	*/
	omnipediaListRectangle() {
		const width = 800;
		const x = Graphics.boxWidth / 2 - width * .5;
		const height = 400;
		const y = Graphics.boxHeight / 2 - height * .5;
		return new Rectangle(x, y, width, height);
	}
	/**
	* Gets the currently tracked omnipedia list window.
	* @returns {Window_OmnipediaList}
	*/
	getOmnipediaListWindow() {
		return this._j._omni._pediaList;
	}
	/**
	* Set the currently tracked omnipedia list window to the given window.
	* @param {Window_OmnipediaList} listWindow The omnipedia list window to track.
	*/
	setOmnipediaListWindow(listWindow) {
		this._j._omni._pediaList = listWindow;
	}
	/**
	* Opens the root list window and activates it.
	*/
	openRootListWindow() {
		const rootListWindow = this.getOmnipediaListWindow();
		rootListWindow.open();
		rootListWindow.show();
		rootListWindow.activate();
	}
	/**
	* Closes the root list window.
	*/
	closeRootListWindow() {
		const rootListWindow = this.getOmnipediaListWindow();
		rootListWindow.close();
		rootListWindow.deactivate();
	}
	/**
	* Gets the current symbol of the root omnipedia.
	* This is effectively the currently highlighted selection's key of that window.
	* @returns {string}
	*/
	getRootOmnipediaKey() {
		return this.getOmnipediaListWindow().currentSymbol();
	}
	/**
	* Opens all windows associated with the root omnipedia.
	*/
	openRootPediaWindows() {
		this.openRootListWindow();
		this.openRootHeaderWindow();
	}
	/**
	* Closes all windows associated with the root omnipedia.
	*/
	closeRootPediaWindows() {
		this.closeRootListWindow();
		this.closeRootHeaderWindow();
	}
	/**
	* When an pedia choice is made, execute this logic.
	* This is only implemented/extended by the pedias.
	*/
	onRootPediaSelection() {
		console.debug(`selected "${this.getRootOmnipediaKey()}" option.`);
	}
};

//#endregion
//#region src/plugins/omni/core/objects/Game_Party.js
/**
* Extends {@link #initMembers}.<br/>
* Adds a hook for omnipedia extensions to initialize their members.
*/
J.OMNI.Aliased.Game_Party.set("initMembers", Game_Party.prototype.initMembers);
Game_Party.prototype.initMembers = function() {
	J.OMNI.Aliased.Game_Party.get("initMembers").call(this);
	this.initOmnipediaMembers();
};
/**
* Initializes all members related to the omnipedia.
*/
Game_Party.prototype.initOmnipediaMembers = function() {};
/**
* Determines whether or not the omnipedia has been initialized.
* @returns {boolean}
*/
Game_Party.prototype.isOmnipediaInitialized = function() {
	return !!this._j._omni;
};

//#endregion
//#region src/plugins/omni/core/objects/Game_System.js
/**
* Calls the omnipedia scene if possible.
* @param {boolean=} force Whether or not to force-call the scene; defaults to false.
*/
Game_System.prototype.callOmnipediaScene = function(force = false) {
	if (this.canCallOmnipediaScene() || force) {
		Scene_Omnipedia.callScene();
	} else {
		SoundManager.playBuzzer();
	}
};
/**
* Determines whether or not the omnipedia scene can be called.
* @returns {boolean}
*/
Game_System.prototype.canCallOmnipediaScene = function() {
	return true;
};

//#endregion
//#region src/plugins/omni/core/scenes/Scene_Menu.js
/**
* Hooks into the command window creation of the menu to add functionality for the SDP menu.
*/
J.OMNI.Aliased.Scene_Menu.set("createCommandWindow", Scene_Menu.prototype.createCommandWindow);
Scene_Menu.prototype.createCommandWindow = function() {
	J.OMNI.Aliased.Scene_Menu.get("createCommandWindow").call(this);
	this.commandWindow().setHandler(J.OMNI.Metadata.Command.Symbol, this.commandOmnipedia.bind(this));
};
/**
* Calls forth the omnipedia scene.
*/
Scene_Menu.prototype.commandOmnipedia = function() {
	Scene_Omnipedia.callScene();
};

//#endregion
//#region src/plugins/omni/core/windows/Window_MenuCommand.js
/**
* Extends {@link #makeCommandList}.<br/>
* Also adds the omnipedia command.
*/
J.OMNI.Aliased.Window_MenuCommand.set("makeCommandList", Window_MenuCommand.prototype.makeCommandList);
Window_MenuCommand.prototype.makeCommandList = function() {
	J.OMNI.Aliased.Window_MenuCommand.get("makeCommandList").call(this);
	if (!this.canAddOmnipediaCommand()) return;
	const command = new WindowCommandBuilder(J.OMNI.Metadata.Command.Name).setSymbol(J.OMNI.Metadata.Command.Symbol).setHelpText("Browse everything the party has discovered so far.").setIconIndex(J.OMNI.Metadata.Command.IconIndex).setColorIndex(J.OMNI.Metadata.Command.ColorIndex).build();
	const lastCommand = this.commandList().at(-1);
	if (lastCommand.symbol === "gameEnd") {
		this.commandList().splice(this.commandList().length - 2, 0, command);
	} else {
		this.addBuiltCommand(command);
	}
};
/**
* Determines whether or not the sdp command can be added to the JABS menu.
* @returns {boolean} True if the command should be added, false otherwise.
*/
Window_MenuCommand.prototype.canAddOmnipediaCommand = function() {
	if (!$gameSwitches.value(J.OMNI.Metadata.InMainMenuSwitch)) return false;
	return true;
};

//#endregion
//#region src/plugins/omni/core/registerOmniSaveRoutes.js
/**
* Lifts this plugin's slice out of whatever host carries it and into its own section file.
*
* Without this the namespace still saves correctly - it simply rides inline on the host it was
* assigned to, which is where every plugin's state lived before the router existed. Registering
* is what gives J-Omnipedia a file of its own to read.
*
* The namespace check is the one this codebase allows: J-Base-Save is genuinely optional, and
* without it the engine's own save path carries this state inline just as it always did.
*/
if (J.BASE.EXT.SAVE) {
	SaveSectionRouter.registerNamespace("_omni", "omni");
}

//#endregion
//# sourceMappingURL=J-Omnipedia.js.map