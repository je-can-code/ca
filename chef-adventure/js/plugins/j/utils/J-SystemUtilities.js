/*:
 * @target MZ
 * @plugindesc
 * [v1.1.4 UTIL] Various system utilities.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin provides a small set of system utility functions that may or
 * may not be helpful to all users.
 *
 * NEW FUNCTIONS:
 * - F6 toggles all sound on/off.
 * - autostart newgame on testplay (when plugin parameter enabled).
 * - pull up devtools window in background upon testplay (always).
 * - $gameParty.removeInvalidItemsFromParty() strips junk bag rows and equipment
 *   (missing DB rows, blank names, or names starting with "===").
 * ============================================================================
 * NOTE ABOUT NOTETAGS:
 * This plugin has no notetags of its own- everything here is a system-wide
 * utility function or plugin-parameter/testplay convenience.
 * ============================================================================
 * CHANGELOG:
 * - 1.1.4
 *    Inventory purge is Game_Party.prototype.removeInvalidItemsFromParty (was J.UTILS.GameParty).
 * - 1.1.3
 *    Added helpers to purge invalid inventory after database ID shifts.
 * - 1.1.2
 *    Added debugging for helping diagnose recursive saved things.
 * - 1.1.1
 *    Added debugger for gamepad inputs.
 * - 1.1.0
 *    Implements strongly-typed plugin metadata.
 *    Added "pull up devtools upon testplay" functionality.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 * @param autostart-newgame
 * @type boolean
 * @text Autostart Newgame
 * @desc Automatically start a new game when playtesting the game.
 * @default true
 *
 * @param autoload-devtools
 * @type boolean
 * @text Autoload Devtools
 * @desc Automatically load the devtools console when playtesting the game.
 * @default true
 */

//#region src/plugins/utils/core/_metadata/_pluginMetadata.js
var J_UtilsPluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	*  Extends {@link #postInitialize}.<br>
	*  Includes translation of plugin parameters.
	*/
	postInitialize() {
		super.postInitialize();
		/**
		* Whether or not to use the "auto-newgame" feature.
		* @type {boolean}
		*/
		this.autostartNewgame = this.parsedPluginParameters["autostart-newgame"] === "true";
		/**
		* Whether or not to use the "auto-newgame" feature.
		* @type {boolean}
		*/
		this.autoloadDevtools = this.parsedPluginParameters["autoload-devtools"] === "true";
		/**
		* A toggle for circular save data check.
		* The console gets very noisy when this is true, but is helpful for identifying issues
		* with serialization that is blocking saving.
		* @type {boolean}
		*/
		this.useCircularSaveDataCheck = false;
	}
};

//#endregion
//#region src/plugins/utils/core/_metadata/initialization.js
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
J.UTILS = {};
/**
* The metadata associated with this plugin, such as name and version.
*/
J.UTILS.Metadata = new J_UtilsPluginMetadata("J-SystemUtilities", "1.1.4");
/**
* A collection of all aliased methods for this plugin.
*/
J.UTILS.Aliased = {
	DataManager: new Map(),
	Game_Actor: new Map(),
	Game_Temp: new Map(),
	Input: new Map(),
	Scene_Base: new Map(),
	Scene_Boot: new Map(),
	Scene_Map: new Map()
};
/**
* A collection of all helper functions that don't need to live anywhere specific.
*/
J.UTILS.Helpers = {};
/**
* Checks recursively how deep an object goes.
*
* This was used once to help troubleshoot where I accidentally created an infinitely nested
* save object. I used this function to check each of the chunks of data in the save file to
* see which was the one that was infinitely deep.
* @param {any} o The object to check.
* @returns {number} Chances are if this returns a number you're fine, otherwise it'll hang.
*/
J.UTILS.Helpers.depth = (o) => Object(o) === o ? 1 + Math.max(-1, ...Object.values(o).map(J.UTILS.Helpers.depth)) : 0;
J.UTILS.GamepadLog ||= {};
J.UTILS.GamepadLog.enabled = J.UTILS.GamepadLog.enabled || false;
/**
* Enables console logging of fresh gamepad presses.
*/
J.UTILS.GamepadLog.enable = function() {
	this.enabled = true;
	console.log("[InputLog] Enabled.");
};
/**
* Disables console logging of fresh gamepad presses.
*/
J.UTILS.GamepadLog.disable = function() {
	this.enabled = false;
	console.log("[InputLog] Disabled.");
};
/**
* Logs only newly-pressed physical inputs resolved through Input.gamepadMapper.
* Uses centralized symbols from J.ABS.EXT.INPUT when available.
* @param {Gamepad} pad The active gamepad instance.
* @param {boolean[]} prev The previous button-state array (by index).
* @param {boolean[]} next The new button-state array (by index).
*/
J.UTILS.GamepadLog.logFreshPresses = function(pad, prev, next) {
	if (this.enabled === false) {
		return;
	}
	const symbols = [];
	for (let i = 0; i < next.length; i++) {
		const now = next[i] === true;
		const was = prev[i] === true;
		if (now && was === false) {
			const mapped = Input.gamepadMapper[i];
			if (mapped) {
				symbols.push(mapped);
			}
		}
	}
	if (symbols.length === 0) {
		return;
	}
	const label = pad.id ? `${pad.id} (Index ${pad.index})` : `Gamepad ${pad.index}`;
	console.log(`[InputLog] ${label} pressed:`, symbols.join(", "));
};

//#endregion
//#region src/plugins/utils/core/Bitmap.js
/**
* Overwrites {@link Bitmap#_createCanvas}.<br/>
* Adds an additional "willReadFrequently" attribute set to true on the canvas.
* This forces software-based rendering, which is supposedly optimal based
* on the way this code is written, according to Chromium's warning.
* @param {number} width The width in pixels of the canvas.
* @param {number} height The height in pixels of the canvas.
* @private
* @override
*/
Bitmap.prototype._createCanvas = function(width, height) {
	this._canvas = document.createElement("canvas");
	this.setContext(this._canvas.getContext("2d", { willReadFrequently: true }));
	this._canvas.width = width;
	this._canvas.height = height;
	this._createBaseTexture(this._canvas);
};
/**
* Sets the 2d drawing context this bitmap renders through.
* @param {CanvasRenderingContext2D} newContext The drawing context.
*/
Bitmap.prototype.setContext = function(newContext) {
	this._context = newContext;
};

//#endregion
//#region src/plugins/utils/core/managers/DataManager.js
/**
* Extends {@link DataManager.makeSaveContents}.<br/>
* Reviews the save contents to ensure that there are no circular references.
*/
J.UTILS.Aliased.DataManager.set("makeSaveContents", DataManager.makeSaveContents);
DataManager.makeSaveContents = function() {
	const contents = J.UTILS.Aliased.DataManager.get("makeSaveContents").call(this);
	if (J.UTILS.Metadata.useCircularSaveDataCheck) {
		console.log(contents);
		console.log(contents.map);
		for (const event of contents.map._events) {
			console.log(event);
			console.log(J.UTILS.Helpers.depth(event));
		}
	}
	return contents;
};

//#endregion
//#region src/plugins/utils/core/managers/Input.js
/**
* Extends the existing mapper to track additional inputs.
*/
Input.keyMapper = {
	...Input.keyMapper,
	117: "volumeToggle"
};
/**
* Extends {@link #_updateGamepadState}.<br/>
* Also logs only freshly pressed gamepad buttons/directions.
*/
J.UTILS.Aliased.Input.set("_updateGamepadState", Input._updateGamepadState);
Input._updateGamepadState = function(gamepad) {
	const prev = this.gamepadStates()[gamepad.index] || [];
	J.UTILS.Aliased.Input.get("_updateGamepadState").call(this, gamepad);
	const next = this.gamepadStates()[gamepad.index] || [];
	J.UTILS.GamepadLog.logFreshPresses(gamepad, prev, next);
};

//#endregion
//#region src/plugins/utils/core/objects/Game_Actor.js
/**
* Extends {@link Game_Actor.onLearnNewSkill}.<br/>
* Wraps the function so that if a new skill is learned, it'll echo to the console.
*/
J.UTILS.Aliased.Game_Actor.set("onLearnNewSkill", Game_Actor.prototype.onLearnNewSkill);
Game_Actor.prototype.onLearnNewSkill = function(skillId) {
	J.UTILS.Aliased.Game_Actor.get("onLearnNewSkill").call(this, skillId);
	return `[${skillId}] {${this.skill(skillId).name}} was learned.`;
};
/**
* Extends {@link Game_Actor.onForgetSkill}.<br/>
* Wraps the function so that if a skill is forgotten, it'll echo back to the console.
*/
J.UTILS.Aliased.Game_Actor.set("onForgetSkill", Game_Actor.prototype.onForgetSkill);
Game_Actor.prototype.onForgetSkill = function(skillId) {
	J.UTILS.Aliased.Game_Actor.get("onForgetSkill").call(this, skillId);
	return `[${skillId}] {${this.skill(skillId).name}} was not learned.`;
};

//#endregion
//#region src/plugins/utils/core/objects/Game_Party.js
/**
* Determines whether an item, weapon, or armor datum should be stripped from the party.
* Treats missing rows, blank names after trim, and names starting with "===" as invalid.
*
* @param {RPG.BaseItem|undefined|null} datum The `$dataItems` / `$dataWeapons` / `$dataArmors` row.
* @returns {boolean} True when the row should be removed from bags and equipment.
*/
Game_Party.isInvalidInventoryDatum = function(datum) {
	if (datum === undefined || datum === null) {
		return true;
	}
	const rawName = datum.name;
	if (rawName === undefined || rawName === null) {
		return true;
	}
	const name = String(rawName).trim();
	if (name === "") {
		return true;
	}
	if (name.indexOf("===") === 0) {
		return true;
	}
	return false;
};
/**
* Removes invalid items, weapons, and armors from party containers and from equipped slots.
* Invalid rows are null/undefined database entries, blank display names, or names starting with "===".
*
* Call after load or from a Common Event when migrating saves.
*/
Game_Party.prototype.removeInvalidItemsFromParty = function() {
	const purgeContainer = (container, dataTable) => {
		const keys = Object.keys(container);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const id = Number(key);
			const datum = dataTable[id];
			if (Game_Party.isInvalidInventoryDatum(datum)) {
				delete container[key];
			}
		}
	};
	purgeContainer(this.rawItems(), $dataItems);
	purgeContainer(this.rawWeapons(), $dataWeapons);
	purgeContainer(this.rawArmors(), $dataArmors);
	const members = this.members();
	for (let i = 0; i < members.length; i++) {
		const actor = members[i];
		const equips = actor.equips();
		for (let s = 0; s < equips.length; s++) {
			const datum = equips[s];
			if (datum && Game_Party.isInvalidInventoryDatum(datum)) {
				actor.discardEquip(datum);
			}
		}
		actor.refresh();
	}
	$gameMap.requestRefresh();
};

//#endregion
//#region src/plugins/utils/core/objects/Game_Player.js
/**
* Now you can retrieve the player's battler from the player.
* This is synonymous with {@link Game_Party.leader}.<br>
* @returns {Game_Actor|null}
*/
Game_Player.prototype.battler = function() {
	const battler = $gameParty.leader();
	if (!battler) {
		console.warn("There is currently no leader.");
		return null;
	}
	return battler;
};

//#endregion
//#region src/plugins/utils/core/objects/Game_Temp.js
/**
* Extends {@link Game_Temp.prototype.initMembers}.<br/>
* Intializes all additional members of this class.
*/
J.UTILS.Aliased.Game_Temp.set("initMembers", Game_Temp.prototype.initMembers);
Game_Temp.prototype.initMembers = function() {
	J.UTILS.Aliased.Game_Temp.get("initMembers").call(this);
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with JABS.
	*/
	this._j._utils ||= {};
	/**
	* Whether or not to use the click-to-log-event functionality.
	* @type {boolean}
	*/
	this._j._utils._useClickToLogEvent = true;
};
/**
* Gets whether or not to use the click-to-log-event functionality.
* @returns {boolean}
*/
Game_Temp.prototype.canClickToLogEvent = function() {
	return this._j._utils._useClickToLogEvent;
};
/**
* Enables the click-to-log-event functionality.
*/
Game_Temp.prototype.enableClickToLogEvent = function() {
	this._j._utils._useClickToLogEvent = true;
};
/**
* Disables the click-to-log-event functionality.
*/
Game_Temp.prototype.disableClickToLogEvent = function() {
	this._j._utils._useClickToLogEvent = false;
};
Game_Temp.prototype.getAllArmorNames = function() {
	const mapping = (armor) => {
		if (!armor) return;
		if (armor.name.startsWith("===")) return;
		return {
			key: armor._key(),
			name: armor.name,
			description: armor.description
		};
	};
	return $dataArmors.map(mapping);
};

//#endregion
//#region src/plugins/utils/core/scenes/Scene_Base.js
/**
* Extends the `.update()` to include a watcher for whether or not
* the volume toggle button is pressed.
*/
J.UTILS.Aliased.Scene_Base.set("update", Scene_Base.prototype.update);
Scene_Base.prototype.update = function() {
	J.UTILS.Aliased.Scene_Base.get("update").call(this);
	if (this.isVolumeToggling()) {
		this.toggleVolume();
	}
};
/**
* Gets whether or not the player is pressing the "volume toggle" button.
*
* This button is F6 by default.
* @returns {boolean}
*/
Scene_Base.prototype.isVolumeToggling = function() {
	return Input.isTriggered("volumeToggle");
};
/**
* Flips the volume on or off.
*/
Scene_Base.prototype.toggleVolume = function() {
	const { bgmVolume, bgsVolume, meVolume, seVolume } = ConfigManager;
	const isMuted = !bgmVolume || !bgsVolume || !meVolume || !seVolume;
	if (isMuted) {
		ConfigManager.bgmVolume = 100;
		ConfigManager.bgsVolume = 100;
		ConfigManager.meVolume = 100;
		ConfigManager.seVolume = 100;
	} else {
		ConfigManager.bgmVolume = 0;
		ConfigManager.bgsVolume = 0;
		ConfigManager.meVolume = 0;
		ConfigManager.seVolume = 0;
	}
};

//#endregion
//#region src/plugins/utils/core/scenes/Scene_Boot.js
/**
* Extends `startNormalGame()` to accommodate plugin parameters.
* If the "auto-newgame" parameter is true, then we skip straight into a new game,
* bypassing the title screen altogether.
*/
J.UTILS.Aliased.Scene_Boot.set("startNormalGame", Scene_Boot.prototype.startNormalGame);
Scene_Boot.prototype.startNormalGame = function() {
	if (J.UTILS.Metadata.autostartNewgame) {
		this.checkPlayerLocation();
		DataManager.setupNewGame();
		SceneManager.goto(Scene_Map);
	} else {
		J.UTILS.Aliased.Scene_Boot.get("startNormalGame").call(this);
	}
};
/**
* Extends {@link #start}.<br/>
* Also shows the devtools window because I need that to do dev things.
*/
J.UTILS.Aliased.Scene_Boot.set("start", Scene_Boot.prototype.start);
Scene_Boot.prototype.start = function() {
	J.UTILS.Aliased.Scene_Boot.get("start").call(this);
	if (J.UTILS.Metadata.autoloadDevtools) {
		SceneManager.showDevTools();
		setTimeout(() => nw.Window.get().focus(), 1e3);
	}
};

//#endregion
//#region src/plugins/utils/core/scenes/Scene_Map.js
/**
* Overwrites {@link Scene_Map.onMapTouch}.<br/>
* Disables auto-movement when clicking a tile on the map.
* Logs event data of clicked events.
*/
Scene_Map.prototype.onMapTouch = function() {
	const x = $gameMap.canvasToMapX(TouchInput.x);
	const y = $gameMap.canvasToMapY(TouchInput.y);
	this.logClickedTarget(x, y);
};
Scene_Map.prototype.logClickedTarget = function(x, y) {
	if (!$gameTemp.canClickToLogEvent()) return;
	this.logClickedEvents(x, y);
	this.logClickedPlayer(x, y);
	this.logClickedAnyAllies(x, y);
};
Scene_Map.prototype.logClickedEvents = function(x, y) {
	const clickedEvents = $gameMap.eventsXy(x, y);
	clickedEvents.forEach((event) => {
		this.extractAndLogBattlerData(event, x, y);
	});
};
Scene_Map.prototype.logClickedPlayer = function(x, y) {
	if ($gamePlayer.pos(x, y)) {
		this.extractAndLogBattlerData($gamePlayer, x, y);
	}
};
Scene_Map.prototype.logClickedAnyAllies = function(x, y) {
	if (!$gamePlayer.followers().isVisible()) {
		return;
	}
	$gamePlayer.followers().data().forEach((follower) => {
		if (follower.pos(x, y)) {
			this.extractAndLogBattlerData(follower, x, y);
		}
	});
};
Scene_Map.prototype.extractAndLogBattlerData = function(target, x, y) {
	if (!target) return;
	const battler = target.getJabsBattler();
	if (!battler) {
		console.log(`[x:${x}, y:${y}]`, "NOT A JABS BATTLER", target);
		return;
	}
	console.log(`[x:${x}, y:${y}]\n[uuid:${battler.getUuid()}]\n[name:${battler.getBattler().name()}]\n`, battler);
};

//#endregion
//#region src/plugins/utils/core/windows/Tilemap.js
/**
* Overwrites {@link #_addShadow}.<br/>
* Fuck those autoshadows.
*/
Tilemap.prototype._addShadow = function(layer, shadowBits, dx, dy) {};

//#endregion
//# sourceMappingURL=J-SystemUtilities.js.map