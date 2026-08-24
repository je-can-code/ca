//region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v2.2.0 HUD] Provides core functionality for this HUD system.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-Base-Save
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is the core of the J-HUD system, and contains plugin commands
 * for managing the state of your JABS HUD.
 *
 * Integrates with others of mine plugins:
 * - J-HUD-PartyFrame; enables on-the-map display of the player and ally data.
 * - J-HUD-InputFrame; enables on-the-map display of the player's skill slots.
 * - J-HUD-TargetFrame; enables on-the-map display of the player's last target.
 *
 * NOTE:
 * If using the J-HUD-TargetFrame plugin, there is additional information in
 * the plugin help that you will want to review at least once before using it.
 *
 * ============================================================================
 * CONTROLLING THE HUD:
 * Have you ever wanted to have any degree of control over the HUD that exists
 * as an information data overlay to your JABS-tastical fun? Well now you can!
 * By leveraging the plugin commands below, you too can manipulate your HUD!
 *
 * DETAILS:
 * The "HUD" is controlled as a collection of its frames. The below plugin
 * commands all work to show/hide all portions of the "HUD" at once.
 *
 * NOTE:
 * The Party and Input frames both are forcefully hidden while the message
 * window is open and the $gameInterpreter believes an event is running.
 *
 * ----------------------------------------------------------------------------
 * SHOW/HIDE COMMANDS
 * Leveraging these commands will give you the control over showing or hiding
 * the entirety of the HUD. This is the type of command you could use to
 * - "Show HUD"
 *    Shows the entire HUD.
 * - "Hide HUD"
 *    Hides the entire HUD.
 *
 * ----------------------------------------------------------------------------
 * ALLY SHOW/HIDE COMMANDS
 * Leveraging these commands will give you the control over showing or hiding
 * any allies other than the leader from the HUD.
 * - "Show Allies"
 *    Shows the allies' section of the party frame.
 * - "Hide Allies"
 *    Hides the allies' section of the party frame.
 *
 * ----------------------------------------------------------------------------
 * REFRESH COMMANDS
 * Leveraging these commands will give you control over refreshing the HUD.
 * These commands are very circumstancial in nature, but will enable you to
 * forcefully refresh the HUD and it's image cache on-demand in the instance
 * that you make changes to assets or have some other plugin requiring some
 * sort of data update to a member of the party.
 * - "Refresh HUD"
 *    Refreshes the data of the HUD, such as actor parameters and states.
 * - "Refresh HUD Image Cache"
 *    Refreshes the image cache of the HUD, for when you change faces.
 *
 * ============================================================================
 * NOTE ABOUT NOTETAGS:
 * This plugin has no notetags of its own- HUD control is entirely
 * plugin-command driven.
 * ============================================================================
 * CHANGELOG:
 * - 2.2.0
 *    Routed the _hud namespace into its own save section, so HUD state lands
 *    in systems/hud.json rather than inside the system blob.
 *    Moved the _hud namespace seeding from the initialize alias to initMembers,
 *    so a decoded save can establish it without running a constructor.
 *    Fixed four broken import paths in the state affliction presenter's tests
 *    that resolved outside the repository entirely.
 * - 2.1.0
 *    Added a dual-row (negative/positive) state affliction presenter to the
 *    party HUD frame- icons, timers, and stack counts, sprite-cached per
 *    battler and cleaned up on target switch.
 *    Added an explicit J-ABS 4.0.0+ version requirement check at boot.
 *    Fixed a self-referencing @base/@orderAfter J-HUD declaration on this
 *    plugin's own header.
 * ============================================================================
 * @command hideHud
 * @text Hide HUD
 * @desc Hides the HUD on the map.
 *
 * @command showHud
 * @text Show HUD
 * @desc Shows the HUD on the map.
 *
 * @command hideAllies
 * @text Hide Allies
 * @desc Hides the display of allies in the hud.
 *
 * @command showAllies
 * @text Show Allies
 * @desc Shows allies' data in the hud.
 *
 * @command refreshHud
 * @text Refresh HUD
 * @desc Forcefully refreshes the hud.
 *
 * @command refreshImageCache
 * @text Refresh HUD Image Cache
 * @desc Forcefully refreshes the image cache of the hud.
 */

//#region src/plugins/hud/core/_metadata/_pluginMetadata.js
var JHud_PluginMetadata = class extends PluginMetadata {
	/**
	
	* Constructor.
	
	* @param {string} name The plugin name.
	
	* @param {string} version The plugin version.
	
	*/
	constructor(name, version) {
		super(name, version);
	}
};

//#endregion
//#region src/plugins/hud/core/_metadata/initialization.js
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
	const requiredAbsVersion = "4.0.0";
	const hasAbsRequirement = J.ABS && J.BASE.Helpers.satisfies(J.ABS.Metadata.version.version(), requiredAbsVersion);
	if (hasAbsRequirement === false) {
		throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredAbsVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.HUD = {};
/**
* A collection of all extensions for the HUD.
*/
J.HUD.EXT = {};
/**
* The `metadata` associated with this plugin, such as version.
* @type {JHud_PluginMetadata}
*/
J.HUD.Metadata = new JHud_PluginMetadata("J-HUD", "2.2.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.HUD.Aliased = {
	Game_System: new Map(),
	Scene_Map: new Map(),
	DataManager: new Map()
};
globalThis.$hudManager ??= null;
/**
* Plugin command for hiding the hud.
*/
PluginManager.registerCommand(J.HUD.Metadata.name, "hideHud", () => {
	$hudManager.requestHideHud();
});
/**
* Plugin command for showing the hud.
*/
PluginManager.registerCommand(J.HUD.Metadata.name, "showHud", () => {
	$hudManager.requestShowHud();
});
/**
* Plugin command for hiding allies in the hud.
*/
PluginManager.registerCommand(J.HUD.Metadata.name, "hideAllies", () => {
	$hudManager.requestHideAllies();
});
/**
* Plugin command for showing allies in the hud.
*/
PluginManager.registerCommand(J.HUD.Metadata.name, "showAllies", () => {
	$hudManager.requestShowAllies();
});
/**
* Plugin command for refreshing the hud.
*/
PluginManager.registerCommand(J.HUD.Metadata.name, "refreshHud", () => {
	$hudManager.requestRefreshHud();
});
/**
* Plugin command for refreshing the hud's image cache.
*/
PluginManager.registerCommand(J.HUD.Metadata.name, "refreshImageCache", () => {
	$hudManager.requestRefreshImageCache();
});

//#endregion
//#region src/plugins/hud/core/objects/Game_System.js
/**
* Extends the `initialize()` to include our hud data for remembering.
*/
J.HUD.Aliased.Game_System.set("initMembers", Game_System.prototype.initMembers);
Game_System.prototype.initMembers = function() {
	J.HUD.Aliased.Game_System.get("initMembers").call(this);
	this._j ||= {};
	this._j._hud ||= {
		_hudVisible: true,
		_alliesVisible: true
	};
};
/**
* Remembers the setting of hud visibility.
* @param {boolean} visible True if the hud is visible, false otherwise.
*/
Game_System.prototype.setHudVisible = function(visible) {
	this._j._hud._hudVisible = visible;
};
/**
* Gets whether or not the hud was last identified as visible.
* @returns {boolean} True if it was visible, false otherwise.
*/
Game_System.prototype.getHudVisible = function() {
	return this._j._hud._hudVisible;
};
/**
* Remembers the setting of the hud's allies' visibility.
* @param {boolean} visible True if the hud's allies' are visible, false otherwise.
*/
Game_System.prototype.setHudAlliesVisible = function(visible) {
	this._j._hud._alliesVisible = visible;
};
/**
* Gets whether or not the hud's allies were last identified as visible.
* @returns {boolean} True if they were visible, false otherwise.
*/
Game_System.prototype.getHudAlliesVisible = function() {
	return this._j._hud._alliesVisible;
};

//#endregion
//#region src/plugins/hud/core/managers/HudManager.js
/**
* A manager class for the hud.
* Use this class to issue requests to show/hide the hud.
*/
var HudManager = class {
	/**
	* Whether or not the allies are currently being displayed in the hud.
	* @type {boolean}
	* @private
	*/
	#alliesVisible = true;
	/**
	* Whether or not we have a request to show allies in the hud.
	* @type {boolean}
	* @private
	*/
	#requestShowAllies = false;
	/**
	* Whether or not we have a request to hide allies in the hud.
	* @type {boolean}
	* @private
	*/
	#requestHideAllies = false;
	/**
	* Whether or not the hud is visible.
	* @type {boolean}
	* @private
	*/
	#hudVisible = true;
	/**
	* Whether or not we have a request to show the hud.
	* @type {boolean}
	* @private
	*/
	#requestShowHud = false;
	/**
	* Whether or not we have a request to hide the hud.
	* @type {boolean}
	* @private
	*/
	#requestHideHud = false;
	/**
	* Whether or not we have a request to refresh the hud.
	* @type {boolean}
	* @private
	*/
	#requestRefresh = false;
	/**
	* Whether or not we have a request to refresh the image cache of the hud.
	* @type {boolean}
	* @private
	*/
	#requestRefreshImageCache = false;
	/**
	* The current target being tracked.
	* @type {FramedTarget|null}
	*/
	#newTarget = null;
	/**
	* Whether or not we have a request to refresh the inactivity timer of the target frame.
	* @type {boolean}
	*/
	#requestTargetFrameRefreshInactivity = false;
	/**
	* Whether or not we have a request to refresh the input frame.
	* @type {boolean}
	*/
	#requestRefreshInputFrame = false;
	/**
	* Whether or not the hud manager is ready to do things.
	* @type {boolean}
	* @private
	*/
	#ready = false;
	/**
	* Sets up this hud based on info from the saved data if available.
	*/
	setup() {
		if (this.#isReady()) return;
		this.initMembers();
		this.#setHudVisible($gameSystem.getHudVisible() ?? true);
		this.#setShowAllies($gameSystem.getHudAlliesVisible() ?? true);
		this.#setReady(true);
	}
	initMembers() {}
	/**
	* The update loop for the manager.
	* Handles incoming requests to manage visibility for the hud.
	*/
	update() {
		if (!this.#canUpdate()) return;
		if (this.#hasRequestShowHud()) {
			this.#showHud();
			this.requestRefreshHud();
		}
		if (this.#hasRequestHideHud()) {
			this.#hideHud();
			this.requestRefreshHud();
		}
		if (this.#hasRequestShowAllies()) {
			this.#showAllies();
			this.requestRefreshHud();
		}
		if (this.#hasRequestHideAllies()) {
			this.#hideAllies();
			this.requestRefreshHud();
		}
	}
	/**
	* Whether or not this hud can update its incoming request processing.
	* @returns {boolean} True if the manager is ready, false otherwise.
	*/
	#canUpdate() {
		if (!this.#isReady()) return false;
		return true;
	}
	/**
	* Whether or not we can show the hud.
	* @returns {boolean} True if we can show the hud, false otherwise.
	*/
	canShowHud() {
		return this.#hudVisible;
	}
	/**
	* Whether or not we can show allies.
	* @returns {boolean} True if we can show allies, false otherwise.
	*/
	canShowAllies() {
		return this.#alliesVisible;
	}
	/**
	* Issue a request to the hud to show allies in the hud.
	*/
	requestShowAllies() {
		this.#setRequestShowAllies(true);
	}
	/**
	* Issue a request to the hud to hide the allies from view.
	*/
	requestHideAllies() {
		this.#setRequestHideAllies(true);
	}
	/**
	* Issue a request to show the hud.
	*/
	requestShowHud() {
		this.#setRequestShowHud(true);
	}
	/**
	* Issue a request to hide the hud.
	*/
	requestHideHud() {
		this.#setRequestHideHud(true);
	}
	/**
	* Issue a request to refresh the hud.
	*/
	requestRefreshHud() {
		this.#setRequestRefreshHud(true);
	}
	/**
	* Checks whether or not we have a request to refresh the hud.
	* @returns {boolean} True if we have a request, false otherwise.
	*/
	hasRequestRefreshHud() {
		return this.#requestRefresh;
	}
	/**
	* Acknowledge the request to refresh the hud.
	*/
	acknowledgeRefreshHud() {
		this.#setRequestRefreshHud(false);
	}
	/**
	* Issue a request to refresh the image cache of the hud.
	*/
	requestRefreshImageCache() {
		this.#setRequestRefreshImageCache(true);
	}
	/**
	* Whether or not we have a request to refresh the hud's image cache.
	* @returns {boolean} True if we have a request, false otherwise.
	*/
	hasRequestRefreshImageCache() {
		return this.#requestRefreshImageCache;
	}
	/**
	* Acknowledge the request to refresh the hud's image cache.
	*/
	acknowledgeRefreshImageCache() {
		this.#setRequestRefreshImageCache(false);
	}
	/**
	* Whether or not we have a request to assign a new target to the target frame.
	* @returns {boolean} True if we have a request, false otherwise.
	*/
	hasRequestAssignTarget() {
		return this.#newTarget !== null;
	}
	/**
	* Gets the currently tracked target.
	* @returns {FramedTarget|null}
	*/
	getNewTarget() {
		return this.#newTarget;
	}
	/**
	* Sets the provided target to the tracker.
	* @param {FramedTarget|null} newTarget The target to track.
	*/
	setNewTarget(newTarget) {
		this.#newTarget = newTarget;
	}
	/**
	* Requests the target frame to refresh its inactivity timer.
	*/
	requestTargetFrameRefresh() {
		this.#setRequestTargetFrameRefreshInactivity(true);
	}
	/**
	* Gets whether or not we have a request to refresh the target frame's
	* inactivity timer.
	* @returns {boolean}
	*/
	hasRequestTargetFrameRefreshInactivityTimer() {
		return this.#requestTargetFrameRefreshInactivity;
	}
	/**
	* Acknowledges the request to refresh the target frame's inactivity timer.
	*/
	acknowledgeTargetFrameInactivityTimerRefresh() {
		this.#setRequestTargetFrameRefreshInactivity(false);
	}
	/**
	* Acknowledges the request to assign a new target to the target frame.
	*/
	acknowledgeAssignedTarget() {
		this.setNewTarget(null);
	}
	/**
	* Issue a request to refresh the input frame.
	*/
	requestRefreshInputFrame() {
		this.#setRequestRefreshInputFrame(true);
	}
	/**
	* Checks whether or not we have a request to refresh the input frame.
	* @returns {boolean} True if we have a request, false otherwise.
	*/
	hasRequestRefreshInputFrame() {
		return this.#requestRefreshInputFrame;
	}
	/**
	* Acknowledge the request to refresh the input frame.
	*/
	acknowledgeRefreshInputFrame() {
		this.#setRequestRefreshInputFrame(false);
	}
	/**
	* Whether or not the hud manager is ready to get started.
	* @returns {boolean} True if it is ready, false otherwise.
	* @private
	*/
	#isReady() {
		return this.#ready;
	}
	/**
	* Sets whether or not the target frame window to refresh the timer.
	* @param request
	*/
	#setRequestTargetFrameRefreshInactivity(request) {
		this.#requestTargetFrameRefreshInactivity = request;
	}
	/**
	* Sets whether or not the hud's image cache needs refreshing.
	* @param {boolean} request True if refresh is required, false otherwise.
	* @private
	*/
	#setRequestRefreshImageCache(request) {
		this.#requestRefreshImageCache = request;
	}
	/**
	* Sets whether or not the hud requires a refresh.
	* @param {boolean} request True if refresh is required, false otherwise.
	* @private
	*/
	#setRequestRefreshHud(request) {
		this.#requestRefresh = request;
	}
	/**
	* Sets whether or not the input frame requires a refresh.
	* @param {boolean} request True if refresh is required, false otherwise.
	* @private
	*/
	#setRequestRefreshInputFrame(request) {
		this.#requestRefreshInputFrame = request;
	}
	/**
	* Sets whether or not this hud manager is ready to go.
	* @param {boolean} ready True if ready, false otherwise.
	* @private
	*/
	#setReady(ready) {
		this.#ready = ready;
	}
	/**
	* Sets the request to show allies to the given value.
	* @param {boolean} request True to issue the request to show allies, false otherwise.
	* @private
	*/
	#setRequestShowAllies(request) {
		this.#requestShowAllies = request;
	}
	/**
	* Sets the showing of allies.
	* @param {boolean} showAllies True to show allies, false otherwise.
	* @private
	*/
	#setShowAllies(showAllies) {
		this.#alliesVisible = showAllies;
	}
	/**
	* Whether or not we have a request to show allies in the hud.
	* @returns {boolean} True if we need to show allies, false otherwise.
	*/
	#hasRequestShowAllies() {
		return this.#requestShowAllies;
	}
	/**
	* Shows all allies.
	* This is not designed to be used directly.
	* Please use the `requestShowAllies(true)` for that.
	*/
	#showAllies() {
		this.#setShowAllies(true);
		this.#setRequestShowAllies(false);
		$gameSystem.setHudAlliesVisible(true);
	}
	/**
	* Sets the request to hide allies to the given value.
	* @param {boolean} request True to issue the request to hide allies, false otherwise.
	* @private
	*/
	#setRequestHideAllies(request) {
		this.#requestHideAllies = request;
	}
	/**
	* Whether or not we have a request to hide allies in the hud.
	* @returns {boolean} True if we need to hide allies, false otherwise.
	*/
	#hasRequestHideAllies() {
		return this.#requestHideAllies;
	}
	/**
	* Disables the showing of your allies in the hud.
	*/
	#hideAllies() {
		this.#setShowAllies(false);
		this.#setRequestHideAllies(false);
		$gameSystem.setHudAlliesVisible(false);
	}
	/**
	* Sets whether or not the hud is visible.
	* @param {boolean} hudVisible True if the hud is visible, false otherwise.
	* @private
	*/
	#setHudVisible(hudVisible) {
		this.#hudVisible = hudVisible;
	}
	/**
	* Shows the hud.
	* This is not designed to be used directly.
	* Please use the `setRequestShowHud(true)` for that.
	*/
	#showHud() {
		this.#setHudVisible(true);
		this.#setRequestShowHud(false);
		$gameSystem.setHudVisible(true);
	}
	/**
	* Hides the hud.
	* This is not designed to be used directly.
	* Please use the `setRequestHideHud(true)` for that.
	*/
	#hideHud() {
		this.#setHudVisible(false);
		this.#setRequestHideHud(false);
		$gameSystem.setHudVisible(false);
	}
	/**
	* Whether or not we have a request to show the hud.
	* @returns {boolean} True if we need to show the hud, false otherwise.
	*/
	#hasRequestShowHud() {
		return this.#requestShowHud;
	}
	/**
	* Whether or not we have a request to hide the hud.
	* @returns {boolean} True if we need to hide the hud, false otherwise.
	*/
	#hasRequestHideHud() {
		return this.#requestHideHud;
	}
	/**
	* Sets the request to show the hud to the given value.
	* @param {boolean} request True to issue the request to show the hud, false otherwise.
	* @private
	*/
	#setRequestShowHud(request) {
		this.#requestShowHud = request;
	}
	/**
	* Sets the request to hide the hud to the given value.
	* @param {boolean} request True to issue the request to hide the hud, false otherwise.
	* @private
	*/
	#setRequestHideHud(request) {
		this.#requestHideHud = request;
	}
};

//#endregion
//#region src/plugins/hud/core/managers/DataManager.js
/**
* Instantiates the hud manager after the rest of the objects are created.
*/
J.HUD.Aliased.DataManager.set("createGameObjects", DataManager.createGameObjects);
DataManager.createGameObjects = function() {
	J.HUD.Aliased.DataManager.get("createGameObjects").call(this);
	if (!$hudManager) {
		$hudManager = new HudManager();
	}
};
J.HUD.Aliased.DataManager.set("extractSaveContents", DataManager.extractSaveContents);
DataManager.extractSaveContents = function(contents) {
	J.HUD.Aliased.DataManager.get("extractSaveContents").call(this, contents);
	$hudManager.setup();
};
J.HUD.Aliased.DataManager.set("setupNewGame", DataManager.setupNewGame);
DataManager.setupNewGame = function() {
	J.HUD.Aliased.DataManager.get("setupNewGame").call(this);
	$hudManager.setup();
};

//#endregion
//#region src/plugins/hud/core/windows/Window_Frame.js
/**
* A base class with some common sprite-cache-management features.
*/
var Window_Frame = class extends Window_Base {
	/**
	* Constructor.
	* @param {Rectangle} rect The shape of this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Initializes the properties of this class.
	* @param {Rectangle} rect The rectangle representing this window.
	*/
	initialize(rect) {
		super.initialize(rect);
		this.initMembers();
		this.configure();
	}
	/**
	* Initializes all members of this class.
	*/
	initMembers() {
		/**
		* The over-arching object that contains all properties for this plugin.
		*/
		this._j ||= {};
		/**
		* The cached collection of sprites.
		* @type {Map<string,
		*   Sprite_Icon|Sprite_BaseText|Sprite_SkillCost|Sprite_CooldownGauge|Sprite_ActorValue|Sprite_MapGauge|Sprite_Gauge|Sprite_FlowingGauge|Sprite_Face|Sprite>}
		*/
		this._j._spriteCache = new Map();
	}
	/**
	* Gets the j.
	* @returns {{_spriteCache: Map<string, Sprite>}} The j.
	*/
	j() {
		return this._j;
	}
	/**
	* Executes any one-time configuration required for this window.
	*/
	configure() {
		this.refreshCache();
	}
	/**
	* Empties and recreates the entire cache of sprites.
	*/
	refreshCache() {
		this.emptyCache();
		this.createCache();
	}
	/**
	* Empties the cache of all sprites.
	*/
	emptyCache() {
		this.j()._spriteCache.forEach((value, _) => value.destroy());
		this.j()._spriteCache.clear();
	}
	/**
	* Empties and recreates the entire cache of sprites.
	*/
	createCache() {}
	/**
	* Hooks into the update loop to include updating for this frame.
	*/
	update() {
		super.update();
		this.updateFrame();
	}
	/**
	* Updates the logic for this window frame.
	*/
	updateFrame() {}
};

//#endregion
//#region src/plugins/hud/core/scenes/Scene_Map.js
/**
* Extends {@link #initMembers}.<br/>
* Also initializes the HUD members.
*/
J.HUD.Aliased.Scene_Map.set("initMembers", Scene_Map.prototype.initMembers);
Scene_Map.prototype.initMembers = function() {
	J.HUD.Aliased.Scene_Map.get("initMembers").call(this);
	this.initHudMembers();
};
/**
* A hook for initializing HUD members.
*/
Scene_Map.prototype.initHudMembers = function() {
	/**
	* A grouping of all properties that are associated with J's plugins.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties that belong to the HUD.
	*/
	this._j._hud ||= {};
};
/**
* Extends the `update()` function to also monitor updates for the hud.
*/
J.HUD.Aliased.Scene_Map.set("update", Scene_Map.prototype.update);
Scene_Map.prototype.update = function() {
	J.HUD.Aliased.Scene_Map.get("update").call(this);
	this.updateHudFrames();
};
/**
* The update loop for the hud manager.
*/
Scene_Map.prototype.updateHudFrames = function() {
	$hudManager.update();
};
/**
* Extends {@link #onPartyRotate}.<br/>
* Refreshes the HUD on party rotation.
*/
J.HUD.Aliased.Scene_Map.set("onPartyRotate", Scene_Map.prototype.onPartyRotate);
Scene_Map.prototype.onPartyRotate = function() {
	J.HUD.Aliased.Scene_Map.get("onPartyRotate").call(this);
	this.refreshHud();
};
/**
* A hook for refreshing all frames of the HUD.
*/
Scene_Map.prototype.refreshHud = function() {};

//#endregion
//#region src/plugins/hud/core/models/StateAfflictionHudLayoutSpec.js
/**
* Layout coordinates for the dual-row HUD affliction presenter.
*/
var StateAfflictionHudLayoutSpec = class {
	/**
	* The origin x coordinate for the first slot in each row.
	* @type {number}
	*/
	originX = 0;
	/**
	* The origin y coordinate for the negative row.
	* @type {number}
	*/
	originY = 0;
	/**
	* Horizontal distance between icon slots.
	* @type {number}
	*/
	iconPitch = ImageManager.iconWidth + 2;
	/**
	* Vertical gap between the negative and positive rows.
	* @type {number}
	*/
	rowGap = 8;
	/**
	* The y coordinate for the negative row.
	* @returns {number}
	*/
	negativeRowY() {
		return this.originY;
	}
	/**
	* The y coordinate for the positive row.
	* @returns {number}
	*/
	positiveRowY() {
		return this.originY + ImageManager.iconHeight + this.rowGap;
	}
	/**
	* The x coordinate for a slot at the given index.
	* @param {number} index The slot index within a row.
	* @returns {number}
	*/
	slotX(index) {
		return this.originX + index * this.iconPitch;
	}
};

//#endregion
//#region src/plugins/hud/core/presenters/StateAfflictionHudPresenter.js
/**
* Renders dual-row HUD afflictions with icons, timers, and stack counts.
*/
var StateAfflictionHudPresenter = class StateAfflictionHudPresenter {
	/**
	* The host window that owns child sprites.
	* @type {Window_Base}
	*/
	#hostWindow = null;
	/**
	* The sprite cache map shared with the host window.
	* @type {Map<string, Sprite_Icon|Sprite_BaseText|Sprite>}
	*/
	#spriteCache = null;
	/**
	* The battler rendered in the previous frame, used to detect target switches.
	* @type {Game_Battler|null}
	*/
	#lastBattler = null;
	/**
	* Constructor.
	* @param {Window_Base} hostWindow The window that parents affliction sprites.
	* @param {Map<string, Sprite_Icon|Sprite_BaseText|Sprite>} spriteCache The host sprite cache.
	*/
	constructor(hostWindow, spriteCache) {
		this.#hostWindow = hostWindow;
		this.#spriteCache = spriteCache;
	}
	/**
	* Renders negative and positive affliction rows for a battler.
	* @param {Game_Battler} battler The afflicted battler.
	* @param {StateAfflictionHudLayoutSpec} layoutSpec The layout coordinates.
	*/
	render(battler, layoutSpec) {
		if (this.#lastBattler !== battler) {
			this.#hideAllSpritesForBattler(this.#lastBattler);
			this.#lastBattler = battler;
		}
		const collection = StateAfflictionProvider.collectForBattler(battler);
		this.hideStaleSlots(battler, collection);
		if (collection.isEmpty() === true) {
			return;
		}
		for (let index = 0; index < collection.negative.length; index++) {
			const viewModel = collection.negative[index];
			const x = layoutSpec.slotX(index);
			const y = layoutSpec.negativeRowY();
			this.renderSlot(battler, viewModel, x, y);
		}
		for (let index = 0; index < collection.positive.length; index++) {
			const viewModel = collection.positive[index];
			const x = layoutSpec.slotX(index);
			const y = layoutSpec.positiveRowY();
			this.renderSlot(battler, viewModel, x, y);
		}
	}
	/**
	* Hides all affliction sprites belonging to the given battler.
	* Called when the presenter switches to a different battler so ghost sprites
	* from the previous target do not persist in the shared sprite cache.
	* @param {Game_Battler|null} battler The battler whose sprites should be hidden.
	*/
	#hideAllSpritesForBattler(battler) {
		if (!battler) return;
		const uuid = battler.getUuid();
		for (const [key, sprite] of this.#spriteCache) {
			if (key.endsWith(`-${uuid}`)) {
				sprite.hide();
			}
		}
	}
	/**
	* Hides sprites for expired or removed afflictions.
	* @param {Game_Battler} battler The afflicted battler.
	* @param {StateAfflictionCollection} collection The active affliction collection.
	*/
	hideStaleSlots(battler, collection) {
		const identity = StateAfflictionBattlerIdentity.fromBattler(battler);
		const activeStateIds = new Set();
		for (const viewModel of collection.allActive()) {
			activeStateIds.add(viewModel.stateId);
		}
		if (StateAfflictionProvider.canCollect() === true) {
			const trackedStateValues = $jabsEngine.getJabsStatesByUuid(battler.getUuid()).values();
			const trackedStates = Array.from(trackedStateValues);
			for (const trackedState of trackedStates) {
				if (trackedState.expired === false) {
					continue;
				}
				this.hideSlotSprites(identity, trackedState.stateId);
			}
		}
		for (const key of this.#spriteCache.keys()) {
			const stateId = StateAfflictionHudPresenter.parseCachedStateId(key, identity.uuid);
			if (stateId === null) {
				continue;
			}
			if (activeStateIds.has(stateId) === true) {
				continue;
			}
			this.hideSlotSprites(identity, stateId);
		}
	}
	/**
	* Parses a cached affliction sprite key into a state id when it belongs to the battler.
	* @param {string} key The sprite cache key.
	* @param {string} uuid The battler uuid.
	* @returns {number|null}
	*/
	static parseCachedStateId(key, uuid) {
		const prefixes = [
			"affliction-icon-",
			"affliction-timer-",
			"affliction-stack-"
		];
		let matchedPrefix = null;
		for (const prefix of prefixes) {
			if (key.startsWith(prefix) === true) {
				matchedPrefix = prefix;
				break;
			}
		}
		if (matchedPrefix === null) {
			return null;
		}
		if (key.endsWith(`-${uuid}`) === false) {
			return null;
		}
		const middle = key.slice(matchedPrefix.length, key.length - uuid.length - 1);
		const stateId = Number(middle);
		if (Number.isFinite(stateId) === false) {
			return null;
		}
		return stateId;
	}
	/**
	* Renders a single affliction slot.
	* @param {Game_Battler} battler The afflicted battler.
	* @param {StateAfflictionViewModel} viewModel The row to render.
	* @param {number} ox The origin x coordinate.
	* @param {number} y The origin y coordinate.
	*/
	renderSlot(battler, viewModel, ox, y) {
		const state = battler.state(viewModel.stateId);
		const iconIndex = state ? state.iconIndex : 0;
		const timerSprite = this.getOrCreateTimerSprite(battler, viewModel.stateId);
		if (viewModel.isEternal === false) {
			const seconds = (viewModel.durationFrames / 60).toFixed(1);
			timerSprite.setText(seconds);
			timerSprite.move(ox, y + 20);
			timerSprite.show();
		} else {
			timerSprite.setText(String.empty);
			timerSprite.hide();
		}
		const iconSprite = this.getOrCreateIconSprite(battler, viewModel.stateId, iconIndex);
		iconSprite.move(ox, y);
		iconSprite.show();
		const stackSprite = this.getOrCreateStackSprite(battler, viewModel.stateId);
		if (viewModel.stackCount > 1) {
			stackSprite.setText(`x${viewModel.stackCount}`);
			stackSprite.move(ox, y - ImageManager.iconHeight);
			stackSprite.show();
		} else {
			stackSprite.setText(String.empty);
			stackSprite.hide();
		}
	}
	/**
	* Hides the icon, timer, and stack sprites for one state id.
	* @param {StateAfflictionBattlerIdentity} identity The battler cache identity.
	* @param {number} stateId The database state id.
	*/
	hideSlotSprites(identity, stateId) {
		const iconKey = identity.buildIconKey(stateId);
		const timerKey = identity.buildTimerKey(stateId);
		const stackKey = identity.buildStackKey(stateId);
		if (this.#spriteCache.has(iconKey) === true) {
			this.#spriteCache.get(iconKey).hide();
		}
		if (this.#spriteCache.has(timerKey) === true) {
			const timerSprite = this.#spriteCache.get(timerKey);
			timerSprite.setText(String.empty);
			timerSprite.hide();
		}
		if (this.#spriteCache.has(stackKey) === true) {
			const stackSprite = this.#spriteCache.get(stackKey);
			stackSprite.setText(String.empty);
			stackSprite.hide();
		}
	}
	/**
	* Creates or retrieves the icon sprite for a state.
	* @param {Game_Battler} battler The afflicted battler.
	* @param {number} stateId The database state id.
	* @param {number} iconIndex The icon index to display.
	* @returns {Sprite_Icon}
	*/
	getOrCreateIconSprite(battler, stateId, iconIndex) {
		const identity = StateAfflictionBattlerIdentity.fromBattler(battler);
		const key = identity.buildIconKey(stateId);
		if (this.#spriteCache.has(key) === true) {
			const sprite = this.#spriteCache.get(key);
			sprite.setIconIndex(iconIndex);
			return sprite;
		}
		const sprite = new Sprite_Icon(iconIndex);
		this.#spriteCache.set(key, sprite);
		sprite.hide();
		this.#hostWindow.addChild(sprite);
		return sprite;
	}
	/**
	* Creates or retrieves the timer sprite for a state.
	* @param {Game_Battler} battler The afflicted battler.
	* @param {number} stateId The database state id.
	* @returns {Sprite_BaseText}
	*/
	getOrCreateTimerSprite(battler, stateId) {
		const identity = StateAfflictionBattlerIdentity.fromBattler(battler);
		const key = identity.buildTimerKey(stateId);
		if (this.#spriteCache.has(key) === true) {
			return this.#spriteCache.get(key);
		}
		const spriteText = new Sprite_BaseText();
		spriteText.setFontFace($gameSystem.numberFontFace());
		spriteText.setFontSize($gameSystem.mainFontSize() - 6);
		spriteText.setAlignment(Sprite_BaseText.Alignments.Center);
		spriteText.setMinWidth(ImageManager.iconWidth);
		this.#spriteCache.set(key, spriteText);
		spriteText.hide();
		this.#hostWindow.addChild(spriteText);
		return spriteText;
	}
	/**
	* Creates or retrieves the stack sprite for a state.
	* @param {Game_Battler} battler The afflicted battler.
	* @param {number} stateId The database state id.
	* @returns {Sprite_BaseText}
	*/
	getOrCreateStackSprite(battler, stateId) {
		const identity = StateAfflictionBattlerIdentity.fromBattler(battler);
		const key = identity.buildStackKey(stateId);
		if (this.#spriteCache.has(key) === true) {
			return this.#spriteCache.get(key);
		}
		const spriteText = new Sprite_BaseText();
		spriteText.setFontFace($gameSystem.numberFontFace());
		spriteText.setFontSize($gameSystem.mainFontSize() - 4);
		spriteText.setAlignment(Sprite_BaseText.Alignments.Center);
		spriteText.setMinWidth(ImageManager.iconWidth);
		this.#spriteCache.set(key, spriteText);
		spriteText.hide();
		this.#hostWindow.addChild(spriteText);
		return spriteText;
	}
};

//#endregion
//#region src/plugins/hud/core/registerHudSaveRoutes.js
/**
* Lifts this plugin's slice out of whatever host carries it and into its own section file.
*
* Without this the namespace still saves correctly - it simply rides inline on the host it was
* assigned to, which is where every plugin's state lived before the router existed. Registering
* is what gives J-HUD a file of its own to read.
*
* The namespace check is the one this codebase allows: J-Base-Save is genuinely optional, and
* without it the engine's own save path carries this state inline just as it always did.
*/
if (J.BASE.EXT.SAVE) {
	SaveSectionRouter.registerNamespace("_hud", "hud");
}

//#endregion
//# sourceMappingURL=J-HUD.js.map