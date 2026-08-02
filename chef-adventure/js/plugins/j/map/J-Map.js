//region annoations
/*:
 * @target MZ
 * @plugindesc [v1.1.0 MAP] Renders a passability-driven minimap on the screen.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-HUD
 * @orderafter J-TIME
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin renders a minimap onto the map.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-ABS; reveals battlers on the map.
 * - J-HUD; respects "should hide HUD" logic.
 * - J-TIME; visibility syncs with TIME window if available.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * The minimap will render the player, your followers, and if using JABS, it'll
 * also render enemy battlers and any dropped loot.
 *
 * You can use the plugin commands to toggle minimap visibility.
 *
 * ============================================================================
 * PLUGIN PARAMETERS BREAKDOWN:
 * - Minimap X:
 *    Represents the X coordinate this will be rendered at by default.
 *    -1 = will automatically show up at the bottom right.
 * - Minimap Y:
 *    Represents the Y coordinate this will be rendered at by default.
 *    -1 = will automatically show up at the bottom right.
 * - Start Visible:
 *    Whether or not this minimap should be rendered when a game is started.
 *    This state is false by default, and is not persisted into game state.
 * - Respect JABS HUD Visibility:
 *    Whether or not to sync the show/hide toggling with the rest of the JABS
 *    HUD elements.
 * - Overlap Opacity %:
 *    The opacity to switch to when the player overlaps with the minimap.
 *
 * ============================================================================
 * PLUGIN COMMAND BREAKDOWN:
 * - Toggle Minimap:
 *    Choose to show/hide the minimap on-demand.
 *
 * ============================================================================
 * MINIMAP MARKER TAGS
 * Have you ever wanted your minimap to reveal particular events as one of a
 * few categories, like NPCs, loot, or interactable objects? Well now you can!
 * By adding the appropriate tags to the desired events inside a comment event
 * command, you too can have your minimap decorated with additional markers!
 *
 * NOTE ABOUT MARKER TYPES
 * There are multiple marker types that show up on the minimap, here is a
 * brief description of all of them:
 * - Player
 *    The player is a teal plus-shape marker.
 * - Follower
 *    The followers of the player are sky-blue square markers.
 * - JABS Enemy (hostile)
 *    Does not show up at all if not using JABS. Rendered as a red diamond.
 * - JABS Enemy (inanimate)
 *    Enemy-backed but non-combative objects (pots, crates). Rendered as an
 *    orange diamond.
 * - NPC
 *    An NPC event marker is rendered as a bright purple circle shape.
 * - Loot
 *    A loot event marker is rendered as a bright green diamond shape.
 * - Interactable Object
 *    An object event marker is rendered as a yellow diamond shape.
 * - Teleport
 *    A hollow light-blue square. Can be stretched to represent a
 *    multi-tile teleport zone with <areaEvent:WxH> (see below).
 * - Quest Offer
 *    A yellow square marking a quest available to accept.
 * - Quest Progress
 *    A blue diamond marking where to advance a quest's next objective.
 * - Quest Turn-In
 *    A green circle marking where to complete/turn in a quest.
 *
 * If multiple marker tags are present on a single event, the last one
 * found will be prioritized.
 *
 * TAG USAGE:
 * - Events on the map
 *
 * TAG FORMAT:
 *  <minimap:MARKER_TYPE> or <mm:MARKER_TYPE>
 * Where MARKER_TYPE is one of "npc", "loot", "object", "teleport",
 * "questOffer", "questProgress", or "questTurnIn" (without quotes).
 *
 * TAG EXAMPLES:
 *  <minimap:npc> or <mm:npc>
 * An event with this tag will show up as an NPC marker on the minimap.
 *
 *  <minimap:loot> or <mm:loot>
 * An event with this tag will show up as a loot marker on the minimap.
 *
 *  <minimap:object> or <mm:object>
 * An event with this tag will show up as an object marker on the minimap.
 *
 *  <minimap:teleport> or <mm:teleport>
 * An event with this tag will show up as a hollow-square teleport marker.
 *
 * ----------------------------------------------------------------------------
 * TELEPORT ZONE SIZE
 * By default, a <minimap:teleport> marker is drawn as a single-tile hollow
 * square. If the teleport actually spans multiple tiles, stretch its marker
 * to match using this tag on the same event.
 *
 * TAG USAGE:
 * - Events on the map (typically alongside <minimap:teleport>)
 *
 * TAG FORMAT:
 *  <areaEvent:WIDTHxHEIGHT>
 * Where WIDTH and HEIGHT are the tile dimensions of the zone. Defaults to
 * 1x1 (a single tile) if this tag is absent or malformed.
 *
 * TAG EXAMPLES:
 *  <minimap:teleport>
 *  <areaEvent:3x2>
 * This teleport event's minimap marker is stretched to a 3-wide by 2-tall
 * hollow square instead of a single tile.
 *
 * ============================================================================
 * BLOCKING THE MINIMAP:
 * Some maps- like tight indoor corridors, cutscene-only maps, or maps where
 * you simply don't want the minimap distracting the player- can suppress
 * the minimap outright.
 *
 * TAG USAGE:
 * - Maps (the map's own note field)
 *
 * TAG FORMAT:
 *  <blockMinimap>
 *
 * TAG EXAMPLES:
 *  <blockMinimap>
 * The minimap never renders while the player is on this map, regardless of
 * the plugin's "Start Visible" setting or any toggle command.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.1.0
 *    Added an orange-diamond minimap marker for inanimate JABS enemies
 *    (pots, crates), distinct from the red-diamond hostile marker.
 *    Added <minimap:teleport>/<mm:teleport> markers (hollow light-blue
 *    square), stretchable to a multi-tile zone via <areaEvent:WxH>.
 *    Added quest markers (questOffer/questProgress/questTurnIn) for
 *    Omni-Quest integration.
 *    Added <blockMinimap> to suppress the minimap outright on a given map.
 * - 1.0.2
 *    Adapted for updates to J-ABS-InputManager (input namespace).
 * - 1.0.1
 *    Adds support for JABS-based input remapping.
 *    Removes connection between TIME system and minimap visibility.
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 * @param BASEconfigs
 * @text BASE SETUP
 *
 * @param minimapX
 * @parent BASEconfigs
 * @type number
 * @min -1
 * @text Minimap X
 * @desc X position of the minimap in screen pixels; -1 = auto bottom-right.
 * @default -1
 *
 * @param minimapY
 * @parent BASEconfigs
 * @type number
 * @min -1
 * @text Minimap Y
 * @desc Y position of the minimap in screen pixels; -1 = auto bottom-right.
 * @default -1
 *
 * @param startVisible
 * @parent BASEconfigs
 * @type boolean
 * @text Start Visible
 * @desc If true, the minimap starts visible on new game/load.
 * @on Visible
 * @off Hidden
 * @default true
 *
 * @param respectHudHide
 * @parent BASEconfigs
 * @type boolean
 * @text Respect JABS HUD Visibility
 * @desc If true, the minimap hides when the HUD is hidden via input.
 * @on Respect
 * @off Ignore
 * @default true
 *
 * @param overlapOpacityPercent
 * @parent BASEconfigs
 * @type number
 * @min 0
 * @max 100
 * @text Overlap Opacity (%)
 * @desc Minimap alpha when overlapping other windows (0=invisible,100=opaque).
 * @default 40
 *
 *
 * @command toggle-minimap
 * @text Toggle MiniMap
 * @desc Toggles visibility of the minimap to the designated state.
 * @arg action
 * @type boolean
 * @desc True for visible, false for invisible.
 * @default true
 */
//endregion annotations

//#region src/plugins/map/core/_metadata/_pluginMetadata.js
var J_MAP__PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br/>
	* Maps plugin parameters into instance fields used by the minimap.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeMetadata();
	}
	initializeMetadata() {
		const pp = this.parsedPluginParameters ?? {};
		/**
		* The minimap's X position in pixels; -1 = auto bottom-right.
		* @type {number}
		*/
		this.minimapX = parseInt(pp["minimapX"] ?? -1);
		/**
		* The minimap's Y position in pixels; -1 = auto bottom-right.
		* @type {number}
		*/
		this.minimapY = parseInt(pp["minimapY"] ?? -1);
		/**
		* Start visibility for the minimap on load/new game.
		* @type {boolean}
		*/
		this.startVisible = (pp["startVisible"] ?? "true") === "true";
		/**
		* If true, the minimap hides when the HUD is hidden via input.
		* @type {boolean}
		*/
		this.respectHudHide = (pp["respectHudHide"] ?? "true") === "true";
		/**
		* The alpha to use when overlapping other HUD windows (0.0-1.0).
		* @type {number}
		*/
		const overlapPct = parseInt(pp["overlapOpacityPercent"] ?? 40);
		this.overlapOpacity = Math.max(0, Math.min(1, overlapPct / 100));
	}
};

//#endregion
//#region src/plugins/map/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.MAP = {};
/**
* The plugin umbrella that governs all extensions related to the parent.
*/
J.MAP.EXT ||= {};
/**
* The metadata associated with this plugin.
*/
J.MAP.Metadata = new J_MAP__PluginMetadata("J-MAP", "1.1.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.MAP.Aliased = {};
J.MAP.Aliased.DataManager = new Map();
J.MAP.Aliased.Game_Event = new Map();
J.MAP.Aliased.Game_Map = new Map();
J.MAP.Aliased.Game_System = new Map();
J.MAP.Aliased.JABS_Engine = new Map();
J.MAP.Aliased.JABS_StandardController = new Map();
J.MAP.Aliased.Scene_Map = new Map();
J.MAP.Aliased.Window_JabsRemapActions = new Map();
J.MAP.RegExp = {};
J.MAP.RegExp.MinimapEvent = /<(?:mm|minimap):(npc|loot|object|teleport|questOffer|questProgress|questTurnIn)>/gi;
J.MAP.RegExp.BlockMinimap = /<blockMinimap>/gi;
J.MAP.RegExp.AreaEvent = /<areaEvent: ?(\d+)x(\d+)>/i;

//#endregion
//#region src/plugins/map/core/objects/Game_System.js
/**
* Extends {@link #initMembers}.<br/>
* Also seeds persistent minimap state.
*/
J.MAP.Aliased.Game_System.set("initMembers", Game_System.prototype.initMembers);
Game_System.prototype.initMembers = function() {
	J.MAP.Aliased.Game_System.get("initMembers").call(this);
	/**
	* The shared root namespace for all J-plugins temporary data.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with the map/minimap plugin.
	*/
	this._j._map ||= {};
	/**
	* Current desired minimap visibility.
	* @type {boolean}
	*/
	this._j._map._minimapVisible = J.MAP.Metadata.startVisible;
};
/**
* Get whether the minimap should be visible (before HUD auto-hide rules).
*/
Game_System.prototype.isMinimapVisible = function() {
	return this._j._map._minimapVisible;
};
/**
* Show the minimap.
*/
Game_System.prototype.showMinimap = function() {
	this.setMinimapVisibility(true);
};
/**
* Hide the minimap.
*/
Game_System.prototype.hideMinimap = function() {
	this.setMinimapVisibility(false);
};
/**
* Toggles to the opposite of the current visibility for the minimap.
*/
Game_System.prototype.toggleMinimapVisibility = function() {
	this.setMinimapVisibility(!this.isMinimapVisible());
};
/**
* Sets visibility of the minimap to the given value.
*/
Game_System.prototype.setMinimapVisibility = function(visibility) {
	this._j._map._minimapVisible = visibility;
};
/**
* Extends {@link #onAfterLoad}.<br/>
* Also handles the possibility of loading a save that was created before using this plugin.
*/
J.MAP.Aliased.Game_System.set("onAfterLoad", Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function() {
	J.MAP.Aliased.Game_System.get("onAfterLoad").call(this);
	this._j ||= {};
	this._j._map ||= {};
	this.setMinimapVisibility(this.isMinimapVisible() ?? J.MAP.Metadata.startVisible);
};

//#endregion
//#region src/plugins/map/core/objects/Game_Map.js
/**
* Checks whether the current map blocks the minimap via note tag.
* @returns {boolean}
*/
Game_Map.prototype.isMinimapBlocked = function() {
	J.MAP.RegExp.BlockMinimap.lastIndex = 0;
	return J.MAP.RegExp.BlockMinimap.test(this.note() ?? String.empty);
};

//#endregion
//#region src/plugins/map/core/__models/MinimapEventType.js
/**
* The structure of a minimap event type.
*/
var MinimapEventType = class MinimapEventType {
	/**
	* The string value of the type of this minimap event type.
	* @type {string}
	*/
	type = "unset";
	/**
	* The color to render onto the minimap.
	* @type {string}
	*/
	color = "#aa66ffcc";
	/**
	* The default shape to render for this minimap event type.
	* Supported: 'disk' | 'square' | 'diamond' | 'plus'
	* @type {string}
	*/
	shape = "disk";
	/**
	* The various shapes that a minimap event marker can be.
	* @type {{Disk: string, Square: string, Diamond: string, Plus: string}}
	*/
	static Shapes = {
		Disk: "disk",
		Square: "square",
		Diamond: "diamond",
		Plus: "plus",
		HollowSquare: "hollow-square"
	};
	/**
	* The minimap event type of unset, used for when an event explicitly does not have a minimap tag on it.
	* @type {MinimapEventType}
	*/
	static Unset = new MinimapEventType("unset", "#99999999", MinimapEventType.Shapes.Disk);
	/**
	* The minimap event type of Player, used for rendering the player onto the minimap.
	* @type {MinimapEventType}
	*/
	static Player = new MinimapEventType("player", "#00aaaacc", MinimapEventType.Shapes.Plus);
	/**
	* The minimap event type of Follower, used for rendering your party allies onto the minimap.
	* @type {MinimapEventType}
	*/
	static Follower = new MinimapEventType("follower", "#44aaffcc", MinimapEventType.Shapes.Square);
	/**
	* The minimap event type of Enemy, used for rendering hostile combatants onto the minimap.
	* @type {MinimapEventType}
	*/
	static EnemyHostile = new MinimapEventType("enemyHostile", "#ff4444cc", MinimapEventType.Shapes.Diamond);
	/**
	* The minimap event type of Inanimate, used for rendering inanimate objects that are backed by an enemy onto the
	* minimap.
	* @type {MinimapEventType}
	*/
	static EnemyInanimate = new MinimapEventType("enemyInanimate", "#ffaa44cc", MinimapEventType.Shapes.Diamond);
	/**
	* The minimap event type of NPC, used for various characters that aren't that important.
	* @type {MinimapEventType}
	*/
	static Npc = new MinimapEventType("npc", "#dd66ffcc", MinimapEventType.Shapes.Disk);
	/**
	* The minimap event type of loot, used for events generated by loot dropped on the ground.
	* @type {MinimapEventType}
	*/
	static Loot = new MinimapEventType("loot", "#44ff66cc", MinimapEventType.Shapes.Diamond);
	/**
	* The minimap event type of object, used for various interactables around the game like doors or levers.
	* @type {MinimapEventType}
	*/
	static Object = new MinimapEventType("object", "#dddd00cc", MinimapEventType.Shapes.Diamond);
	/**
	* The minimap event type of teleport, rendered as a hollow square. May stretch if <areaEvent:WxH> is present.
	* @type {MinimapEventType}
	*/
	static Teleport = new MinimapEventType("teleport", "#66ccffcc", MinimapEventType.Shapes.HollowSquare);
	/**
	* The minimap event type for quests: offer available (not yet started).
	* @type {MinimapEventType}
	*/
	static QuestOffer = new MinimapEventType("questOffer", "#ffdd33cc", MinimapEventType.Shapes.Square);
	/**
	* The minimap event type for quests: can progress the next objective here.
	* @type {MinimapEventType}
	*/
	static QuestProgress = new MinimapEventType("questProgress", "#3399ffcc", MinimapEventType.Shapes.Diamond);
	/**
	* The minimap event type for quests: turn-in / about to complete.
	* @type {MinimapEventType}
	*/
	static QuestTurnIn = new MinimapEventType("questTurnIn", "#66ff66cc", MinimapEventType.Shapes.Disk);
	constructor(type, color = "#00000066", shape = "disk") {
		this.type = type;
		this.color = color;
		this.shape = shape;
	}
};

//#endregion
//#region src/plugins/map/core/objects/Game_Event.js
/**
* Extends {@link Game_Event.initMembers}.<br/>
* Initializes minimap-related properties.
*/
J.MAP.Aliased.Game_Event.set("initMembers", Game_Event.prototype.initMembers);
Game_Event.prototype.initMembers = function() {
	J.MAP.Aliased.Game_Event.get("initMembers").call(this);
	/**
	* The J object where all my additional properties live.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with minimaps.
	*/
	this._j._map ||= {};
	/**
	* The cached event type to display on the minimap.
	* @type {MinimapEventType|null}
	*/
	this._j._map._cachedMinimapEventType = null;
	/**
	* The cached check of whether or not to show the event on the minimap.
	* @type {boolean}
	*/
	this._j._map._cachedShowOnMinimap = null;
};
/**
* Sets the type of minimap event this event is.
* @param {MinimapEventType|null} type The type of minimap event.
*/
Game_Event.prototype.setCachedMinimapEventType = function(type) {
	this._j._map._cachedMinimapEventType = type;
};
/**
* Gets the type of minimap event this event is.
* @returns {MinimapEventType|null}
*/
Game_Event.prototype.getCachedMinimapEventType = function() {
	return this._j._map._cachedMinimapEventType;
};
/**
* Sets whether or not to show this event on the minimap.
* @param {boolean} shouldShow True if this should be shown on the minimap, false otherwise.
*/
Game_Event.prototype.setCachedShowOnMinimap = function(shouldShow) {
	this._j._map._cachedShowOnMinimap = shouldShow;
};
/**
* Gets whether or not to show this event on the minimap.
* @returns {boolean|null}
*/
Game_Event.prototype.getCachedShowOnMinimap = function() {
	return this._j._map._cachedShowOnMinimap;
};
/**
* Extends {@link #refresh}.<br/>
* Also clears the minimap cache forcing the next fetch to recalculate the data.
*/
J.MAP.Aliased.Game_Event.set("refresh", Game_Event.prototype.refresh);
Game_Event.prototype.refresh = function() {
	J.MAP.Aliased.Game_Event.get("refresh").call(this);
	this.clearMinimapCache();
};
/**
* Clears the cache for the minimap data.
*/
Game_Event.prototype.clearMinimapCache = function() {
	this.setCachedShowOnMinimap(null);
	this.setCachedMinimapEventType(null);
};
/**
* Determines if it should be shown for this event.
* @returns {boolean} True if it should be shown, false otherwise.
*/
Game_Event.prototype.shouldShowOnMinimap = function() {
	if (J.ABS) {
		if (this.isErased() === false && this.isJabsLoot()) return true;
		const enemy = this.getJabsBattler();
		if (enemy) {
			return !enemy.isDead() && !enemy.isHidden();
		}
	}
	if (this.getCachedShowOnMinimap() !== null) {
		return this.getCachedShowOnMinimap();
	}
	let shouldShow = false;
	this.getValidCommentCommands().forEach((command) => {
		const [comment] = command.parameters;
		J.MAP.RegExp.MinimapEvent.lastIndex = 0;
		if (J.MAP.RegExp.MinimapEvent.test(comment)) {
			shouldShow = true;
		}
	});
	if (!shouldShow && this.isTeleportEvent()) {
		shouldShow = true;
	}
	if (!shouldShow && this.isQuestEvent()) {
		shouldShow = true;
	}
	this.setCachedShowOnMinimap(shouldShow);
	return shouldShow;
};
/**
* Identify what kind of minimap event type this event is.
* @returns {MinimapEventType} The type of minimap event.
*/
Game_Event.prototype.minimapEventType = function() {
	if (J.ABS) {
		if (this.isErased() === false && this.isJabsLoot()) return MinimapEventType.Loot;
		const enemy = this.getJabsBattler();
		if (enemy) {
			if (enemy.isHidden() || enemy.isDead()) return MinimapEventType.Unset;
			return enemy.isInanimate() ? MinimapEventType.EnemyInanimate : MinimapEventType.EnemyHostile;
		}
	}
	if (this.getCachedMinimapEventType() !== null) {
		return this.getCachedMinimapEventType();
	}
	let minimapEventType = MinimapEventType.Unset;
	this.getValidCommentCommands().forEach((command) => {
		const [comment] = command.parameters;
		J.MAP.RegExp.MinimapEvent.lastIndex = 0;
		const match = J.MAP.RegExp.MinimapEvent.exec(comment);
		if (!match) return;
		switch (match[1]) {
			case "npc":
				minimapEventType = MinimapEventType.Npc;
				break;
			case "loot":
				minimapEventType = MinimapEventType.Loot;
				break;
			case "object":
				minimapEventType = MinimapEventType.Object;
				break;
			case "teleport":
				minimapEventType = MinimapEventType.Teleport;
				break;
			case "questOffer":
				minimapEventType = MinimapEventType.QuestOffer;
				break;
			case "questProgress":
				minimapEventType = MinimapEventType.QuestProgress;
				break;
			case "questTurnIn":
				minimapEventType = MinimapEventType.QuestTurnIn;
				break;
		}
	});
	if (this.hasQuestPluginCommand(["finalize-quest"])) {
		minimapEventType = MinimapEventType.QuestTurnIn;
	} else if ((minimapEventType === MinimapEventType.Unset || minimapEventType === MinimapEventType.QuestOffer) && this.hasQuestPluginCommand(["progress-quest"])) {
		minimapEventType = MinimapEventType.QuestProgress;
	}
	if (minimapEventType === MinimapEventType.Unset && this.hasQuestPluginCommand(["unlock-quests"])) {
		minimapEventType = MinimapEventType.QuestOffer;
	}
	if (minimapEventType === MinimapEventType.Unset && this.isTeleportEvent()) {
		minimapEventType = MinimapEventType.Teleport;
	}
	this.setCachedMinimapEventType(minimapEventType);
	return minimapEventType;
};
/**
* Determines whether this event’s current page contains a transfer (teleport) action.
* @returns {boolean}
*/
Game_Event.prototype.isTeleportEvent = function() {
	const list = this.getEventCommandList();
	const hasTransfer = !!list.find((cmd) => cmd && cmd.code === 201);
	return !!hasTransfer;
};
/**
* Determines whether this event's current page contains any quest-related plugin commands.
* @returns {boolean}
*/
Game_Event.prototype.isQuestEvent = function() {
	if (!J.OMNI || !J.OMNI.EXT || !J.OMNI.EXT.QUEST) return false;
	return this.hasQuestPluginCommand([
		"unlock-quests",
		"progress-quest",
		"finalize-quest"
	]);
};
/**
* Determines whether or not one or more plugin commands are present by their name in an event.
* @param {string[]} commandNames The plugin command names to seek.
* @returns {boolean}
*/
Game_Event.prototype.hasQuestPluginCommand = function(commandNames) {
	if (!J.OMNI || !J.OMNI.EXT || !J.OMNI.EXT.QUEST) return false;
	const found = this.hasPluginCommand(J.OMNI.EXT.QUEST.Metadata.name, commandNames);
	return found;
};
/**
* Parses and returns the area rectangle for this event from <areaEvent:WxH>.
* Defaults to 1x1 when not present or invalid.
* @returns {{w:number,h:number}}
*/
Game_Event.prototype.getAreaEventRect = function() {
	let w = 1;
	let h = 1;
	const commands = this.getValidCommentCommands();
	for (let i = 0; i < commands.length; i++) {
		const [comment] = commands[i].parameters;
		if (!comment) continue;
		J.MAP.RegExp.AreaEvent.lastIndex = 0;
		const match = J.MAP.RegExp.AreaEvent.exec(comment);
		if (match) {
			const [, unparsedW, unparsedH] = match;
			w = Math.max(1, parseInt(unparsedW));
			h = Math.max(1, parseInt(unparsedH));
			break;
		}
	}
	return {
		w,
		h
	};
};

//#endregion
//#region src/plugins/map/core/sprites/Sprite_MiniMap.js
/**
* A lightweight, cached mini-map sprite:
* - Builds a padded cache of the map background and impassability edges.
* - Renders the current view window by blitting from the cache.
* - Draws dynamic overlay markers each frame (enemies, followers).
* - Draws the player marker (green circle) onto the base bitmap when the viewport changes.
*
* External environment and global dependencies (RPG Maker MZ + JABS):
* - $gameMap: Game_Map
* - $gamePlayer: Game_Player
* - Graphics: PIXI / RM screen dimensions
* - Bitmap: RMMZ Bitmap
* - Sprite: RMMZ Sprite
* - J.ABS, JABS_AiManager: JABS battle system (optional)
*/
var Sprite_MiniMap = class extends Sprite {
	/**
	* Gets the cache ready.
	* @returns {boolean} The cacheReady.
	*/
	isCacheReady() {
		return this._cacheReady;
	}
	/**
	* Sets the cache ready.
	* @param {boolean} newCacheReady The new cacheReady.
	*/
	setCacheReady(newCacheReady) {
		this._cacheReady = newCacheReady;
	}
	/**
	* Gets the focus mode.
	* @returns {*} The focusMode.
	*/
	isFocusMode() {
		return this._focusMode;
	}
	/**
	* Sets the focus mode.
	* @param {boolean} newFocusMode The new focusMode.
	*/
	setFocusMode(newFocusMode) {
		this._focusMode = newFocusMode;
	}
	/**
	* Gets the cached map id.
	* @returns {number} The cachedMapId.
	*/
	cachedMapId() {
		return this._cachedMapId;
	}
	/**
	* Sets the cached map id.
	* @param {number} newCachedMapId The new cachedMapId.
	*/
	setCachedMapId(newCachedMapId) {
		this._cachedMapId = newCachedMapId;
	}
	/**
	* Gets the smooth fx.
	* @returns {*} The smoothFx.
	*/
	smoothFx() {
		return this._smoothFx;
	}
	/**
	* Sets the smooth fx.
	* @param {*} newSmoothFx The new smoothFx.
	*/
	setSmoothFx(newSmoothFx) {
		this._smoothFx = newSmoothFx;
	}
	/**
	* Gets the smooth fy.
	* @returns {*} The smoothFy.
	*/
	smoothFy() {
		return this._smoothFy;
	}
	/**
	* Sets the smooth fy.
	* @param {*} newSmoothFy The new smoothFy.
	*/
	setSmoothFy(newSmoothFy) {
		this._smoothFy = newSmoothFy;
	}
	/**
	* Gets the last x.
	* @returns {number} The lastX.
	*/
	lastX() {
		return this._lastX;
	}
	/**
	* Sets the last x.
	* @param {number} newLastX The new lastX.
	*/
	setLastX(newLastX) {
		this._lastX = newLastX;
	}
	/**
	* Gets the last y.
	* @returns {number} The lastY.
	*/
	lastY() {
		return this._lastY;
	}
	/**
	* Sets the last y.
	* @param {number} newLastY The new lastY.
	*/
	setLastY(newLastY) {
		this._lastY = newLastY;
	}
	/**
	* Gets the minimap frame sprite.
	* @returns {Sprite} The minimapFrameSprite.
	*/
	minimapFrameSprite() {
		return this._minimapFrameSprite;
	}
	/**
	* Gets the pre focus state.
	* @returns {*} The preFocusState.
	*/
	preFocusState() {
		return this._preFocusState;
	}
	/**
	* Sets the pre focus state.
	* @param {*} newPreFocusState The new preFocusState.
	*/
	setPreFocusState(newPreFocusState) {
		this._preFocusState = newPreFocusState;
	}
	/**
	* Gets the width.
	* @returns {number} The width.
	*/
	minimapWidth() {
		return this._width;
	}
	/**
	* Sets the width.
	* @param {number} newWidth The new width.
	*/
	setMinimapWidth(newWidth) {
		this._width = newWidth;
	}
	/**
	* Gets the height.
	* @returns {number} The height.
	*/
	minimapHeight() {
		return this._height;
	}
	/**
	* Sets the height.
	* @param {number} newHeight The new height.
	*/
	setMinimapHeight(newHeight) {
		this._height = newHeight;
	}
	/**
	* Gets the view tiles.
	* @returns {number} The viewTiles.
	*/
	viewTiles() {
		return this._viewTiles;
	}
	/**
	* Sets the view tiles.
	* @param {number} newViewTiles The new viewTiles.
	*/
	setViewTiles(newViewTiles) {
		this._viewTiles = newViewTiles;
	}
	/**
	* Gets the overlay sprite.
	* @returns {Sprite} The overlaySprite.
	*/
	overlaySprite() {
		return this._overlaySprite;
	}
	/**
	* Gets the overlay.
	* @returns {Bitmap} The overlay.
	*/
	overlay() {
		return this._overlay;
	}
	/**
	* Sets the overlay.
	* @param {Bitmap} newOverlay The new overlay.
	*/
	setOverlay(newOverlay) {
		this._overlay = newOverlay;
	}
	/**
	* Gets the chrome sprite.
	* @returns {Sprite} The chromeSprite.
	*/
	chromeSprite() {
		return this._chromeSprite;
	}
	/**
	* Gets the chrome bitmap.
	* @returns {Bitmap} The chromeBitmap.
	*/
	chromeBitmap() {
		return this._chromeBitmap;
	}
	/**
	* Sets the chrome bitmap.
	* @param {Bitmap} newChromeBitmap The new chromeBitmap.
	*/
	setChromeBitmap(newChromeBitmap) {
		this._chromeBitmap = newChromeBitmap;
	}
	/**
	* Gets the cache offset tiles.
	* @returns {number} The cacheOffsetTiles.
	*/
	cacheOffsetTiles() {
		return this._cacheOffsetTiles;
	}
	/**
	* Sets the cache offset tiles.
	* @param {number} newCacheOffsetTiles The new cacheOffsetTiles.
	*/
	setCacheOffsetTiles(newCacheOffsetTiles) {
		this._cacheOffsetTiles = newCacheOffsetTiles;
	}
	/**
	* Gets the cache bitmap.
	* @returns {Bitmap} The cacheBitmap.
	*/
	cacheBitmap() {
		return this._cacheBitmap;
	}
	/**
	* Sets the cache bitmap.
	* @param {Bitmap} newCacheBitmap The new cacheBitmap.
	*/
	setCacheBitmap(newCacheBitmap) {
		this._cacheBitmap = newCacheBitmap;
	}
	/**
	* Number of tiles to show from the player in each direction.
	* Viewport width/height in tiles = (MAP_RANGE * 2 + 1).
	* @type {number}
	*/
	MAP_RANGE = 12;
	/**
	* The pixel size of each minimap tile.
	* @type {number}
	*/
	SCALE = 8;
	/**
	* Minimap X position in screen pixels; -1 = auto bottom-right.
	* @type {number}
	*/
	POS_X = -1;
	/**
	* Minimap Y position in screen pixels; -1 = auto bottom-right.
	* @type {number}
	*/
	POS_Y = -1;
	/**
	* Background color surrounding/behind the minimap.
	* Accepts #rrggbb or #rrggbbaa; converted to CSS via toCss().
	* @type {string}
	*/
	BG_COLOR = "#00000066";
	/**
	* General floor/ground fill color.
	* @type {string}
	*/
	FLOOR_COLOR = "#ffffff33";
	/**
	* Edge (directional block) stroke color.
	* @type {string}
	*/
	EDGE_COLOR = "#e6f0ffcc";
	/**
	* Fill color for wholly impassable tiles (blocked in all directions).
	* @type {string}
	*/
	IMPASSABLE_COLOR = "#330000aa";
	/**
	* Minimum marker size in pixels.
	* @type {number}
	*/
	MARKER_MIN = 2;
	/**
	* Whether or not to use smooth scrolling for the map rather than tile-step based scrolling.
	* @type {boolean}
	*/
	SMOOTH_SCROLL = true;
	/**
	* The smoothness of scrolling- use 0 to follow the real position, or decimal for a little drag.
	* @type {number}
	*/
	SMOOTH_LERP = 0;
	/**
	* Constructs a new minimap sprite and initializes the cache, overlay, and positioning.
	*/
	constructor() {
		super();
		this.initCoreData();
		this.initCacheData();
		this.initOverlayLayer();
		this.initChromeLayer();
		this.initFrameLayer();
	}
	initCoreData() {
		/**
		* The number of padding tiles applied on each side of the cached map.
		* This is equal to MAP_RANGE and allows player-centered scrolling near edges.
		* @type {number}
		*/
		this._cacheOffsetTiles = 0;
		/**
		* Viewport dimension, in tiles, along a single axis (width or height).
		* Computed as (MAP_RANGE * 2 + 1).
		* @type {number}
		*/
		this._viewTiles = this.MAP_RANGE * 2 + 1;
		/**
		* Viewport width in pixels.
		* @type {number}
		*/
		this._width = this._viewTiles * this.SCALE;
		/**
		* Viewport height in pixels.
		* @type {number}
		*/
		this._height = this._viewTiles * this.SCALE;
		/**
		* The displayed bitmap containing only the visible window (cache slice + player marker).
		* @type {Bitmap}
		*/
		this.bitmap = new Bitmap(this._width, this._height);
		this.anchor.set(.5, .5);
		this.x = J.MAP.Metadata.minimapX >= 0 ? J.MAP.Metadata.minimapX : Graphics.boxWidth - this._width / 2 - 10;
		this.y = J.MAP.Metadata.minimapY >= 0 ? J.MAP.Metadata.minimapY : Graphics.boxHeight - this._height / 2 - 10;
		this.z = 200;
		/**
		* Last known player x tile; used to detect when to re-blit the window.
		* @type {number}
		*/
		this._lastX = -1;
		/**
		* Last known player y tile; used to detect when to re-blit the window.
		* @type {number}
		*/
		this._lastY = -1;
	}
	initCacheData() {
		/**
		* Full-map cached bitmap (map + padding around it), rebuilt per-map.
		* @type {Bitmap}
		*/
		this._cacheBitmap = new Bitmap(1, 1);
		/**
		* Whether the full-map cache is currently built.
		* @type {boolean}
		*/
		this._cacheReady = false;
		/**
		* The mapId associated with the current cache.
		* @type {number}
		*/
		this._cachedMapId = 0;
		this._smoothFx = 0;
		this._smoothFy = 0;
	}
	initOverlayLayer() {
		/**
		* Dynamic overlay bitmap drawn every frame (enemies, followers, etc.).
		* @type {Bitmap}
		*/
		this._overlay = new Bitmap(this._width, this._height);
		/**
		* Sprite child for the overlay bitmap.
		* @type {Sprite}
		*/
		this._overlaySprite = new Sprite(this._overlay);
		this._overlaySprite.anchor.set(.5, .5);
		this.addChild(this._overlaySprite);
	}
	initChromeLayer() {
		this._chromeBitmap = new Bitmap(this._width, this._height);
		this._chromeSprite = new Sprite(this._chromeBitmap);
		this._chromeSprite.anchor.set(.5, .5);
		this.addChild(this._chromeSprite);
		this.redrawChrome();
	}
	initFrameLayer() {
		/**
		* The minimap's frame sprite.
		* @type {Sprite}
		*/
		this._minimapFrameSprite = new Sprite(new Bitmap(this._width, this._height));
		this._minimapFrameSprite.anchor.set(.5, .5);
		this._minimapFrameSprite.x = 0;
		this._minimapFrameSprite.y = 0;
		this.addChild(this._minimapFrameSprite);
		this.drawPixelArtMinimapFrame(this._minimapFrameSprite.bitmap, 0, 0, this._minimapFrameSprite.bitmap.width, this._minimapFrameSprite.bitmap.height, {
			thickness: 3,
			rim: 1,
			highlight: 1
		});
	}
	/**
	* Flags the full-map cache to be rebuilt on the next update tick.
	* Useful when tileset or rendering settings change.
	*/
	refresh() {
		this.setCacheReady(false);
	}
	/**
	* Per-frame update. Ensures cache is built for the active map,
	* re-blits the visible window when the player has changed tiles,
	* and refreshes the overlay every frame.
	*/
	update() {
		super.update();
		if (!$gameMap) return;
		const mapId = $gameMap.mapId ? $gameMap.mapId() : 0;
		if (!this.isCacheReady() || this.cachedMapId() !== mapId) {
			this.buildCache();
			this.setCachedMapId(mapId);
			this.setCacheReady(true);
			const { fx, fy } = this.srcFloatFromPlayer();
			this.setSmoothFx(fx);
			this.setSmoothFy(fy);
			this.setLastX(-99999);
			this.setLastY(-99999);
		}
		if (this.SMOOTH_SCROLL) {
			this.redrawWindowSmooth();
			this.refreshMinimapFrame();
			this.setLastX($gamePlayer.x);
			this.setLastY($gamePlayer.y);
		} else if (this.needsUpdate()) {
			this.redrawWindow();
			this.setLastX($gamePlayer.x);
			this.setLastY($gamePlayer.y);
			this.refreshMinimapFrame();
		}
		this.redrawOverlay();
	}
	refreshMinimapFrame() {
		if (!this.minimapFrameSprite()) return;
		const w = this.bitmap.width;
		const h = this.bitmap.height;
		if (this.minimapFrameSprite().bitmap.width !== w || this.minimapFrameSprite().bitmap.height !== h) {
			this.minimapFrameSprite().bitmap = new Bitmap(w, h);
			this.minimapFrameSprite().anchor.set(.5, .5);
			this.minimapFrameSprite().x = 0;
			this.minimapFrameSprite().y = 0;
		} else {
			this.minimapFrameSprite().bitmap.clear();
		}
		this.drawPixelArtMinimapFrame(this.minimapFrameSprite().bitmap, 0, 0, w, h);
	}
	/**
	* Enters a temporary focus mode: the minimap is moved to the middle-right of the screen and greatly expand scope.
	* While focused, overlap dimming is disabled and the map is always visible.
	* Calling this while already focused is a no-op.
	*/
	enterFocusMode() {
		if (this.isFocusMode()) return;
		this.setFocusMode(true);
		this.setPreFocusState({
			mapRange: this.MAP_RANGE,
			scale: this.SCALE,
			width: this.minimapWidth(),
			height: this.minimapHeight(),
			x: this.x,
			y: this.y,
			smoothFx: this.smoothFx(),
			smoothFy: this.smoothFy()
		});
		const focusMultiplier = 3;
		this.MAP_RANGE = Math.max(4, Math.floor(this.MAP_RANGE * focusMultiplier));
		this.setViewTiles(this.MAP_RANGE * 2 + 1);
		this.setMinimapWidth(this.viewTiles() * this.SCALE);
		this.setMinimapHeight(this.viewTiles() * this.SCALE);
		this.bitmap = new Bitmap(this.minimapWidth(), this.minimapHeight());
		if (this.overlaySprite()) {
			this.setOverlay(new Bitmap(this.minimapWidth(), this.minimapHeight()));
			this.overlaySprite().bitmap = this.overlay();
			this.overlaySprite().anchor.set(.5, .5);
		}
		if (this.chromeSprite()) {
			this.setChromeBitmap(new Bitmap(this.minimapWidth(), this.minimapHeight()));
			this.chromeSprite().bitmap = this.chromeBitmap();
			this.chromeSprite().anchor.set(.5, .5);
			this.redrawChrome();
		}
		this.refreshMinimapFrame();
		this.x = Math.floor(Graphics.boxWidth - this.minimapWidth() / 2 - 10);
		this.y = Math.floor(Graphics.boxHeight / 2);
		this.refresh();
		const { fx, fy } = this.srcFloatFromPlayer();
		this.setSmoothFx(fx);
		this.setSmoothFy(fy);
		this.setLastX(-99999);
		this.setLastY(-99999);
		this.visible = true;
	}
	/**
	* Exits focus mode and restores the previous minimap size, scope, and position.
	* Calling this when not focused is a no-op.
	*/
	exitFocusMode() {
		if (!this.isFocusMode()) return;
		this.setFocusMode(false);
		const st = this.preFocusState() || null;
		this.setPreFocusState(null);
		if (!st) return;
		this.MAP_RANGE = st.mapRange;
		this.SCALE = st.scale;
		this.setViewTiles(this.MAP_RANGE * 2 + 1);
		this.setMinimapWidth(this.viewTiles() * this.SCALE);
		this.setMinimapHeight(this.viewTiles() * this.SCALE);
		this.bitmap = new Bitmap(this.minimapWidth(), this.minimapHeight());
		if (this.overlaySprite()) {
			this.setOverlay(new Bitmap(this.minimapWidth(), this.minimapHeight()));
			this.overlaySprite().bitmap = this.overlay();
			this.overlaySprite().anchor.set(.5, .5);
		}
		if (this.chromeSprite()) {
			this.setChromeBitmap(new Bitmap(this.minimapWidth(), this.minimapHeight()));
			this.chromeSprite().bitmap = this.chromeBitmap();
			this.chromeSprite().anchor.set(.5, .5);
			this.redrawChrome();
		}
		this.refreshMinimapFrame();
		this.anchor.set(.5, .5);
		this.x = J.MAP.Metadata.minimapX >= 0 ? J.MAP.Metadata.minimapX : Graphics.boxWidth - this.minimapWidth() / 2 - 10;
		this.y = J.MAP.Metadata.minimapY >= 0 ? J.MAP.Metadata.minimapY : Graphics.boxHeight - this.minimapHeight() / 2 - 10;
		this.refresh();
		const { fx, fy } = this.srcFloatFromPlayer();
		this.setSmoothFx(fx);
		this.setSmoothFy(fy);
		this.setLastX(-99999);
		this.setLastY(-99999);
	}
	/**
	* Whether the minimap is in the temporary focus mode.
	* @returns {boolean}
	*/
	isInFocusMode() {
		return !!this.isFocusMode();
	}
	/**
	* Returns true if the player changed tiles since the last redraw.
	* @returns {boolean}
	*/
	needsUpdate() {
		if (!$gamePlayer) return false;
		return $gamePlayer.x !== this.lastX() || $gamePlayer.y !== this.lastY();
	}
	/**
	* Rebuilds the full cached bitmap of the map (with padding), drawing:
	* - Background
	* - Base floor tiles
	* - Edge strokes according to passability flags
	* Subclasses may override drawCell(...) to fully customize tile rendering.
	*/
	buildCache() {
		const mapWidth = $gameMap.width();
		const mapHeight = $gameMap.height();
		const pad = this.MAP_RANGE;
		this.setCacheOffsetTiles(pad);
		const cacheTilesW = mapWidth + pad * 2;
		const cacheTilesH = mapHeight + pad * 2;
		const pixelWidth = cacheTilesW * this.SCALE;
		const pixelHeight = cacheTilesH * this.SCALE;
		this.setCacheBitmap(new Bitmap(pixelWidth, pixelHeight));
		this.cacheBitmap().fillRect(0, 0, pixelWidth, pixelHeight, this.toCss(this.BG_COLOR));
		/** @type {number[]} */
		const flags = $gameMap.tilesetFlags();
		const loopH = $gameMap.isLoopHorizontal();
		const loopV = $gameMap.isLoopVertical();
		this.drawMapCopyAt(pad, pad, flags);
		if (loopH) {
			this.drawMapCopyAt(pad - mapWidth, pad, flags);
			this.drawMapCopyAt(pad + mapWidth, pad, flags);
		}
		if (loopV) {
			this.drawMapCopyAt(pad, pad - mapHeight, flags);
			this.drawMapCopyAt(pad, pad + mapHeight, flags);
		}
		if (loopH && loopV) {
			this.drawMapCopyAt(pad - mapWidth, pad - mapHeight, flags);
			this.drawMapCopyAt(pad + mapWidth, pad - mapHeight, flags);
			this.drawMapCopyAt(pad - mapWidth, pad + mapHeight, flags);
			this.drawMapCopyAt(pad + mapWidth, pad + mapHeight, flags);
		}
	}
	/**
	* Clears the base window bitmap and blits the appropriate slice
	* from the full cached bitmap, then draws the player marker at the center.
	*/
	redrawWindow() {
		if (!this.cacheBitmap()) return;
		this.bitmap.clear();
		const { srcX, srcY } = this.cacheSrcFromPlayer();
		this.bitmap.blt(this.cacheBitmap(), srcX, srcY, this.minimapWidth(), this.minimapHeight(), 0, 0);
		this.drawPlayerMarker();
	}
	/**
	* Draws the static layer after the overlay layer.
	*/
	redrawChrome() {
		if (!this.chromeBitmap()) return;
		this.chromeBitmap().clear();
		this.drawNorthNotch(this.chromeBitmap());
		this.setChildIndex(this.chromeSprite(), this.children.length - 1);
	}
	/**
	* Clears and redraws the dynamic overlay (enemies, followers, etc.).
	*/
	redrawOverlay() {
		this.overlay().clear();
		this.drawOverlay(this.overlay());
	}
	redrawWindowSmooth() {
		if (!this.cacheBitmap()) return;
		const { fx: tfx, fy: tfy } = this.srcFloatFromPlayer();
		if (this.SMOOTH_LERP > 0) {
			const a = this.SMOOTH_LERP;
			this.setSmoothFx(this.smoothFx() + (tfx - this.smoothFx()) * a);
			this.setSmoothFy(this.smoothFy() + (tfy - this.smoothFy()) * a);
		} else {
			this.setSmoothFx(tfx);
			this.setSmoothFy(tfy);
		}
		const maxSx = Math.max(0, this.cacheBitmap().width - this.minimapWidth());
		const maxSy = Math.max(0, this.cacheBitmap().height - this.minimapHeight());
		const sfx = Math.min(Math.max(this.smoothFx(), 0), maxSx);
		const sfy = Math.min(Math.max(this.smoothFy(), 0), maxSy);
		const srcX = Math.floor(sfx);
		const srcY = Math.floor(sfy);
		const dx = -(sfx - srcX);
		const dy = -(sfy - srcY);
		this.bitmap.clear();
		this.bitmap.blt(this.cacheBitmap(), srcX, srcY, this.minimapWidth(), this.minimapHeight(), dx, dy);
		this.drawPlayerMarker();
	}
	/**
	* Draws the player marker (a centered plus "+") at the center tile
	* of the current window on the base bitmap.
	*/
	drawPlayerMarker() {
		const { leftPx, topPx } = this.tileLeftTopPx(this.MAP_RANGE, this.MAP_RANGE);
		this.drawPlusOn(this.bitmap, leftPx, topPx, this.SCALE - 2, MinimapEventType.Player.color);
		const dir = $gamePlayer.direction();
		this.drawFacingPerpLineOn(this.bitmap, leftPx, topPx, this.SCALE, MinimapEventType.Player.color, dir);
	}
	/**
	* Draws edge strokes for a single tile according to the blocked-direction bitmask.
	* Bits: 0x01=down, 0x02=left, 0x04=right, 0x08=up
	* @param {Bitmap} targetBitmap - The bitmap to draw onto.
	* @param {number} sx - Tile top-left x in pixels on targetBitmap.
	* @param {number} sy - Tile top-left y in pixels on targetBitmap.
	* @param {number} mask - Blocked-direction mask.
	*/
	drawEdges(targetBitmap, sx, sy, mask) {
		const c = this.toCss(this.EDGE_COLOR);
		const s = this.SCALE;
		const t = 2;
		if (mask & 1) targetBitmap.fillRect(sx, sy + s - t, s, t, c);
		if (mask & 2) targetBitmap.fillRect(sx, sy, t, s, c);
		if (mask & 4) targetBitmap.fillRect(sx + s - t, sy, t, s, c);
		if (mask & 8) targetBitmap.fillRect(sx, sy, s, t, c);
	}
	/**
	* Draws one full map copy into the cache, offset by whole-tile origins.
	* originTileX/Y are in cache tile space, relative to the cache’s (0,0).
	* @param {number} originTileX The origin tile x driving this step.
	* @param {number} originTileY The origin tile y driving this step.
	* @param {number[]} flags - tileset flags (pre-fetched)
	*/
	drawMapCopyAt(originTileX, originTileY, flags) {
		const mapWidth = $gameMap.width();
		const mapHeight = $gameMap.height();
		for (let y = 0; y < mapHeight; y++) {
			for (let x = 0; x < mapWidth; x++) {
				const sx = (originTileX + x) * this.SCALE;
				const sy = (originTileY + y) * this.SCALE;
				const mask = this.blockedMaskAt(x, y, flags);
				if (this.drawCell(x, y, sx, sy, mask)) continue;
				if (mask === 15) {
					this.cacheBitmap().fillRect(sx, sy, this.SCALE, this.SCALE, this.toCss(this.IMPASSABLE_COLOR));
				} else {
					this.cacheBitmap().fillRect(sx, sy, this.SCALE, this.SCALE, this.toCss(this.FLOOR_COLOR));
					this.drawEdges(this.cacheBitmap(), sx, sy, mask);
				}
			}
		}
	}
	/**
	* Draws a marker using a {@link MinimapEventType}'s shape and color.
	*/
	drawByType(targetBitmap, lx, ly, sizePx, type) {
		const size = Math.max(this.MARKER_MIN, Math.min(this.SCALE, sizePx));
		switch (type.shape) {
			case MinimapEventType.Shapes.Square:
				this.drawSquareOn(targetBitmap, lx, ly, size, type.color);
				break;
			case MinimapEventType.Shapes.Diamond:
				this.drawDiamondOn(targetBitmap, lx, ly, size, type.color);
				break;
			case MinimapEventType.Shapes.Plus:
				this.drawPlusOn(targetBitmap, lx, ly, size, type.color);
				break;
			case MinimapEventType.Shapes.HollowSquare:
				this.drawHollowSquareOn(targetBitmap, lx, ly, size, type.color);
				break;
			case MinimapEventType.Shapes.Disk:
			default:
				this.drawDiskOn(targetBitmap, lx, ly, size, type.color);
				break;
		}
	}
	drawNorthNotch(targetBitmap) {
		const w = this.minimapWidth();
		const centerX = Math.floor(w / 2);
		const fillCol = this.toCss(this.EDGE_COLOR);
		const underCol = "rgba(0,0,0,0.40)";
		const triH = Math.max(4, Math.min(7, Math.floor(this.SCALE / 2)));
		const topY = 6;
		for (let i = 0; i < triH; i++) {
			const span = i + 1;
			const y = topY + i;
			targetBitmap.fillRect(centerX - span - 1, y, span * 2 + 1 + 2, 1, underCol);
		}
		for (let i = 0; i < triH; i++) {
			const span = i;
			const y = topY + i;
			targetBitmap.fillRect(centerX - span, y, span * 2 + 1, 1, fillCol);
		}
	}
	/**
	* Draws dynamic markers for enemies and followers onto the overlay bitmap.
	* - Hostile enemies: red diamonds.
	* - Inanimate/non-hostile enemies: orange diamonds.
	* - Followers: blue squares.
	* @param {Bitmap} overlayBitmap - The overlay bitmap to draw on.
	*/
	drawOverlay(overlayBitmap) {
		if (!$gameMap || !$gamePlayer) return;
		this.drawFollowers(overlayBitmap);
		this.drawEvents(overlayBitmap);
	}
	/**
	* Draws the followers onto the overlay bitmap.
	*/
	drawFollowers(overlayBitmap) {
		const scale = this.SCALE;
		const followers = $gamePlayer.followers().visibleFollowers();
		followers.forEach((follower) => {
			const wx = follower._realX ?? follower.x;
			const wy = follower._realY ?? follower.y;
			const { lx, ly } = this.worldToLocalAroundPlayer(wx, wy);
			if (!this.inView(lx, ly)) return;
			this.drawByType(overlayBitmap, lx, ly, Math.max(2, scale - 4), MinimapEventType.Follower);
		}, this);
	}
	/**
	* Draws the various events onto the overlay bitmap.
	*/
	drawEvents(overlayBitmap) {
		$gameMap.events().forEach((event) => this.drawEvent(overlayBitmap, event), this);
	}
	/**
	* Draws a particular event onto the bitmap overlay.
	* @param {Bitmap} overlayBitmap The bitmap being rendered onto.
	* @param {Game_Event} event The event potentially being rendered onto the map.
	*/
	drawEvent(overlayBitmap, event) {
		if (!this.isEventRenderable(event)) return;
		const wx = event._realX ?? event.x;
		const wy = event._realY ?? event.y;
		const { lx, ly } = this.worldToLocalAroundPlayer(wx, wy);
		if (!this.inView(lx, ly)) return;
		const type = event.minimapEventType();
		if (type === MinimapEventType.Teleport) {
			const { w, h } = event.getAreaEventRect();
			if (w > 1 || h > 1) {
				const areaWpx = Math.max(1, Math.floor(w * this.SCALE));
				const areaHpx = Math.max(1, Math.floor(h * this.SCALE));
				const t = Math.max(1, Math.floor(this.SCALE / 6));
				const outlineCol = this.toCss(type.color);
				const fillCol = this.fillCssFrom(type.color, .35);
				overlayBitmap.fillRect(lx, ly, areaWpx, t, outlineCol);
				overlayBitmap.fillRect(lx, ly + areaHpx - t, areaWpx, t, outlineCol);
				overlayBitmap.fillRect(lx, ly, t, areaHpx, outlineCol);
				overlayBitmap.fillRect(lx + areaWpx - t, ly, t, areaHpx, outlineCol);
				const innerW = areaWpx - t * 2;
				const innerH = areaHpx - t * 2;
				if (innerW > 0 && innerH > 0) {
					overlayBitmap.fillRect(lx + t, ly + t, innerW, innerH, fillCol);
				}
				return;
			}
			this.drawByType(overlayBitmap, lx, ly, Math.max(2, this.SCALE - 4), type);
			return;
		}
		this.drawByType(overlayBitmap, lx, ly, Math.max(2, this.SCALE - 4), type);
	}
	/**
	* Returns true if the upper-left pixel of a tile (lx, ly) falls within the visible window bounds.
	* Accepts coordinates that may be slightly outside to avoid drawing off-screen.
	* @param {number} lx - Local x in pixels (tile origin).
	* @param {number} ly - Local y in pixels (tile origin).
	* @returns {boolean}
	*/
	inView(lx, ly) {
		const s = this.SCALE;
		return !(lx < -s || ly < -s || lx >= this.minimapWidth() || ly >= this.minimapHeight());
	}
	/**
	* Computes the centered inner box within one tile for a marker of a given size.
	* @param {number} sizePx - Desired marker size in pixels (clamped to [MARKER_MIN..SCALE]).
	* @returns {{size:number, ox:number, oy:number, r:number}} Object containing:
	* - size: clamped size in pixels
	* - ox: left offset inside the tile
	* - oy: top offset inside the tile
	* - r: radius/falloff (floor(size/2)), useful for disks/diamonds
	*/
	innerBox(sizePx) {
		const s = this.SCALE;
		const size = Math.max(this.MARKER_MIN, Math.min(s, Math.floor(sizePx)));
		const ox = Math.floor((s - size) / 2);
		const oy = Math.floor((s - size) / 2);
		const r = Math.floor(size / 2);
		return {
			size,
			ox,
			oy,
			r
		};
	}
	/**
	* Converts world tile coordinates (may be fractional for smooth movement)
	* to local window pixel coordinates (tile top-left).
	* @param {number} wx - World x in tiles (can be fractional).
	* @param {number} wy - World y in tiles (can be fractional).
	* @param {number} leftTile - Current window's top-left world tile X.
	* @param {number} topTile - Current window's top-left world tile Y.
	* @returns {{lx:number, ly:number}} Local pixel coords.
	*/
	worldToLocal(wx, wy, leftTile, topTile) {
		const s = this.SCALE;
		return {
			lx: Math.floor((wx - leftTile) * s),
			ly: Math.floor((wy - topTile) * s)
		};
	}
	/**
	* Converts an in-window tile coordinate (0..viewTiles-1) to the pixel top-left in the bitmap.
	* @param {number} tx - Tile X within the window.
	* @param {number} ty - Tile Y within the window.
	* @returns {{leftPx:number, topPx:number}}
	*/
	tileLeftTopPx(tx, ty) {
		const s = this.SCALE;
		return {
			leftPx: tx * s,
			topPx: ty * s
		};
	}
	/**
	* Draws a filled disk (circle) centered inside the tile at (lx, ly).
	* @param {Bitmap} targetBitmap - Target bitmap to draw on.
	* @param {number} lx - Tile top-left x in pixels.
	* @param {number} ly - Tile top-left y in pixels.
	* @param {number} sizePx - Desired marker size in pixels.
	* @param {string} color - Hex or hex+alpha string (e.g., #rrggbb or #rrggbbaa).
	*/
	drawDiskOn(targetBitmap, lx, ly, sizePx, color) {
		if (!this.inView(lx, ly)) return;
		const { ox, oy, r } = this.innerBox(sizePx);
		const cx = lx + ox + r;
		const cy = ly + oy + r;
		const col = this.toCss(color);
		for (let dy = -r; dy <= r; dy++) {
			const span = Math.floor(Math.sqrt(r * r - dy * dy));
			targetBitmap.fillRect(cx - span, cy + dy, span * 2 + 1, 1, col);
		}
	}
	/**
	* Draws a filled diamond (rotated square) centered inside the tile at (lx, ly).
	* @param {Bitmap} targetBitmap - Target bitmap to draw on.
	* @param {number} lx - Tile top-left x in pixels.
	* @param {number} ly - Tile top-left y in pixels.
	* @param {number} sizePx - Desired marker size in pixels.
	* @param {string} color - Hex or hex+alpha string (e.g., #rrggbb or #rrggbbaa).
	*/
	drawDiamondOn(targetBitmap, lx, ly, sizePx, color) {
		if (!this.inView(lx, ly)) return;
		const { ox, oy, r } = this.innerBox(sizePx);
		const cx = lx + ox + r;
		const cy = ly + oy + r;
		const col = this.toCss(color);
		for (let dy = -r; dy <= r; dy++) {
			const span = r - Math.abs(dy);
			targetBitmap.fillRect(cx - span, cy + dy, span * 2 + 1, 1, col);
		}
	}
	/**
	* Draws a filled square centered inside the tile at (lx, ly).
	* @param {Bitmap} targetBitmap - Target bitmap to draw on.
	* @param {number} lx - Tile top-left x in pixels.
	* @param {number} ly - Tile top-left y in pixels.
	* @param {number} sizePx - Desired marker size in pixels.
	* @param {string} color - Hex or hex+alpha string (e.g., #rrggbb or #rrggbbaa).
	*/
	drawSquareOn(targetBitmap, lx, ly, sizePx, color) {
		if (!this.inView(lx, ly)) return;
		const { size, ox, oy } = this.innerBox(sizePx);
		targetBitmap.fillRect(lx + ox, ly + oy, size, size, this.toCss(color));
	}
	/**
	* Draws a centered plus "+" inside the tile at (lx, ly).
	* The plus scales with sizePx and uses an adaptive arm thickness.
	* @param {Bitmap} targetBitmap - Target bitmap to draw on.
	* @param {number} lx - Tile top-left x in pixels.
	* @param {number} ly - Tile top-left y in pixels.
	* @param {number} sizePx - Desired marker size in pixels.
	* @param {string} color - Hex or hex+alpha string (e.g., #rrggbb or #rrggbbaa).
	*/
	drawPlusOn(targetBitmap, lx, ly, sizePx, color) {
		if (!this.inView(lx, ly)) return;
		const { size, ox, oy, r } = this.innerBox(sizePx);
		const cx = lx + ox + r;
		const cy = ly + oy + r;
		const col = this.toCss(color);
		const thickness = Math.max(1, Math.floor(size / 3));
		const halfT = Math.floor(thickness / 2);
		const vLeft = cx - halfT;
		const vTop = ly + oy;
		targetBitmap.fillRect(vLeft, vTop, thickness, size, col);
		const hLeft = lx + ox;
		const hTop = cy - halfT;
		targetBitmap.fillRect(hLeft, hTop, size, thickness, col);
	}
	/**
	* Draws a hollow square or series of squares based on the given size.
	* @param {Bitmap} targetBitmap - Target bitmap to draw on.
	* @param {number} lx - Tile top-left x in pixels.
	* @param {number} ly - Tile top-left y in pixels.
	* @param {number} sizePx - Desired marker size in pixels.
	* @param {string} color - Hex or hex+alpha string (e.g., #rrggbb or #rrggbbaa).
	*/
	drawHollowSquareOn(targetBitmap, lx, ly, sizePx, color) {
		if (!this.inView(lx, ly)) return;
		const { size: s, ox, oy } = this.innerBox(sizePx);
		const x0 = lx + ox;
		const y0 = ly + oy;
		const w = s;
		const h = s;
		const t = Math.max(1, Math.floor(this.SCALE / 6));
		const outlineCol = this.toCss(color);
		const fillCol = this.fillCssFrom(color, .35);
		targetBitmap.fillRect(x0, y0, w, t, outlineCol);
		targetBitmap.fillRect(x0, y0 + h - t, w, t, outlineCol);
		targetBitmap.fillRect(x0, y0, t, h, outlineCol);
		targetBitmap.fillRect(x0 + w - t, y0, t, h, outlineCol);
		const innerW = w - t * 2;
		const innerH = h - t * 2;
		if (innerW > 0 && innerH > 0) {
			targetBitmap.fillRect(x0 + t, y0 + t, innerW, innerH, fillCol);
		}
	}
	/**
	* Draws a small flat line ("T-cap") perpendicular to the plus arm for the
	* player's facing direction. The line sits near the tip of the faced arm
	* and stays within the inner marker box to avoid clipping.
	*
	* @param {Bitmap} targetBitmap The target bitmap driving this step.
	* @param {number} lx - tile top-left x in pixels
	* @param {number} ly - tile top-left y in pixels
	* @param {number} sizePx - desired marker size in pixels
	* @param {string} color - hex or hex+alpha (#rrggbb or #rrggbbaa)
	* @param {number} dir - facing direction (2=down,4=left,6=right,8=up)
	*/
	drawFacingPerpLineOn(targetBitmap, lx, ly, sizePx, color, dir) {
		if (!this.inView(lx, ly)) return;
		const { size, ox, oy, r } = this.innerBox(sizePx);
		const cx = lx + ox + r;
		const cy = ly + oy + r;
		const col = this.toCss(color);
		const ix0 = lx + ox;
		const iy0 = ly + oy;
		const ix1 = ix0 + size - 1;
		const iy1 = iy0 + size - 1;
		const thickness = Math.max(2, Math.floor(size / 3));
		const capThickness = Math.max(1, Math.floor(thickness / 2));
		const capLen = Math.max(thickness + 1, Math.min(size - 2, Math.floor(size * .6)));
		const margin = 1;
		switch (dir) {
			case 8: {
				const y = iy0 + margin;
				const x = cx - Math.floor(capLen / 2);
				targetBitmap.fillRect(x, y, capLen, capThickness, col);
				break;
			}
			case 2: {
				const y = iy1 - margin - (capThickness - 1);
				const x = cx - Math.floor(capLen / 2);
				targetBitmap.fillRect(x, y, capLen, capThickness, col);
				break;
			}
			case 4: {
				const x = ix0 + margin;
				const y = cy - Math.floor(capLen / 2);
				targetBitmap.fillRect(x, y, capThickness, capLen, col);
				break;
			}
			case 6: {
				const x = ix1 - margin - (capThickness - 1);
				const y = cy - Math.floor(capLen / 2);
				targetBitmap.fillRect(x, y, capThickness, capLen, col);
				break;
			}
			default: break;
		}
	}
	/**
	* Computes the blocked-direction mask for a tile using the same precedence
	* as Game_Map.prototype.checkPassage.
	* Bits:
	* - 0x01 = down blocked
	* - 0x02 = left blocked
	* - 0x04 = right blocked
	* - 0x08 = up blocked
	* 0x0f indicates wholly impassable.
	* @param {number} x - Tile X.
	* @param {number} y - Tile Y.
	* @param {number[]} [flagsRef] - Optional pre-fetched tilesetFlags array.
	* @returns {number} The blocked-direction mask.
	*/
	blockedMaskAt(x, y, flagsRef) {
		if (!$gameMap.isValid(x, y)) return 15;
		const flags = flagsRef || $gameMap.tilesetFlags();
		const tiles = $gameMap.allTiles(x, y);
		for (const tileId of tiles) {
			const flag = flags[tileId] || 0;
			if (flag & 16) continue;
			return flag & 15;
		}
		return 15;
	}
	/**
	* Converts #rrggbb or #rrggbbaa into a CSS color string.
	* @param {string} hex - Hex color string (#rrggbb or #rrggbbaa). Whitespace is ignored.
	* @returns {string} CSS color string.
	*/
	toCss(hex) {
		const clean = hex.replace(/\s+/g, String.empty);
		if (!clean.startsWith("#")) return "#ff00ff";
		if (clean.length === 7) return clean;
		if (clean.length === 9) {
			const r = parseInt(clean.slice(1, 3), 16);
			const g = parseInt(clean.slice(3, 5), 16);
			const b = parseInt(clean.slice(5, 7), 16);
			const a = parseInt(clean.slice(7, 9), 16) / 255;
			return `rgba(${r},${g},${b},${a})`;
		}
		return "#ff00ff";
	}
	fillCssFrom(hex, ratio = .35) {
		const raw = hex && hex[0] === "#" ? hex.slice(1) : hex ?? "";
		const r = parseInt(raw.slice(0, 2) || "00", 16);
		const g = parseInt(raw.slice(2, 4) || "00", 16);
		const b = parseInt(raw.slice(4, 6) || "00", 16);
		const a = raw.length >= 8 ? parseInt(raw.slice(6, 8), 16) / 255 : 1;
		const fillA = Math.max(0, Math.min(1, a * ratio));
		return `rgba(${r},${g},${b},${fillA.toFixed(3)})`;
	}
	/**
	* Computes the top-left pixel in the padded cache to blit from,
	* based on the player's current tile position (kept centered).
	* @returns {{srcX:number, srcY:number}}
	*/
	cacheSrcFromPlayer() {
		const pad = this.cacheOffsetTiles();
		const srcX = ($gamePlayer.x - this.MAP_RANGE + pad) * this.SCALE;
		const srcY = ($gamePlayer.y - this.MAP_RANGE + pad) * this.SCALE;
		return {
			srcX,
			srcY
		};
	}
	srcFloatFromPlayer() {
		const pad = this.cacheOffsetTiles();
		const rx = $gamePlayer._realX ?? $gamePlayer.x;
		const ry = $gamePlayer._realY ?? $gamePlayer.y;
		const fx = (rx - this.MAP_RANGE + pad) * this.SCALE;
		const fy = (ry - this.MAP_RANGE + pad) * this.SCALE;
		return {
			fx,
			fy
		};
	}
	/**
	* Converts world tile coords to local overlay pixel coords using the shortest
	* wrapped delta around the player. Ensures markers near map seams appear on
	* the closest side in looping maps.
	* @param {number} wx - World x in tiles (can be fractional).
	* @param {number} wy - World y in tiles (can be fractional).
	* @returns {{lx:number, ly:number}}
	*/
	worldToLocalAroundPlayer(wx, wy) {
		const s = this.SCALE;
		const px = $gamePlayer._realX ?? $gamePlayer.x;
		const py = $gamePlayer._realY ?? $gamePlayer.y;
		let dx = wx - px;
		let dy = wy - py;
		const loopH = $gameMap.isLoopHorizontal();
		const loopV = $gameMap.isLoopVertical();
		const mapW = $gameMap.width();
		const mapH = $gameMap.height();
		if (loopH && mapW > 0) {
			if (dx > mapW / 2) dx -= mapW;
			if (dx < -mapW / 2) dx += mapW;
		}
		if (loopV && mapH > 0) {
			if (dy > mapH / 2) dy -= mapH;
			if (dy < -mapH / 2) dy += mapH;
		}
		const tileX = this.MAP_RANGE + dx;
		const tileY = this.MAP_RANGE + dy;
		return {
			lx: Math.floor(tileX * s),
			ly: Math.floor(tileY * s)
		};
	}
	/**
	* Returns whether an event should be rendered on the minimap.
	* @param {Game_Event} event The event being inspected for rendering as an overlay on the minimap.
	*/
	isEventRenderable(event) {
		if (!event) return false;
		if (event.isErased()) return false;
		if (event.isTransparent()) return false;
		return event.shouldShowOnMinimap();
	}
	/**
	* Hook for subclasses to fully override how a single map cell is drawn into the cache.
	* Return true to indicate you handled drawing for this cell; false to use default rendering.
	* @param {number} x - Map tile X.
	* @param {number} y - Map tile Y.
	* @param {number} sx - Pixel x origin within the cache bitmap (top-left of the tile).
	* @param {number} sy - Pixel y origin within the cache bitmap (top-left of the tile).
	* @param {number} blockedMask - Directional block mask for this tile.
	* @returns {boolean} True if the tile was fully handled; false to fall back to default rendering.
	*/
	drawCell(x, y, sx, sy, blockedMask) {
		return false;
	}
	/**
	* Computes the top-left world tile (x, y) for the visible window (no clamping).
	* The cached bitmap has padding, so un-clamped values are safe to render.
	* @returns {[number, number]} Tuple [leftTile, topTile].
	*/
	currentViewOrigin() {
		const half = this.MAP_RANGE;
		const leftTile = $gamePlayer.x - half;
		const topTile = $gamePlayer.y - half;
		return [leftTile, topTile];
	}
	/**
	* Draw a pixel-art frame onto a bitmap.
	* - bitmap: target Bitmap (already sized to the minimap area or overlay).
	* - x, y, w, h: frame rectangle.
	* - opts: colors and thickness options.
	*/
	drawPixelArtMinimapFrame(bitmap, x, y, w, h, opts = {}) {
		const thickness = opts.thickness ?? 3;
		const rim = opts.rim ?? 1;
		const hl = opts.highlight ?? 1;
		const cDark = opts.cDark ?? "rgba(18,18,22,1.0)";
		const cMid = opts.cMid ?? "rgba(255,220,180,0.3)";
		const cInner = opts.cInner ?? "rgba(200,200,220,1.0)";
		const cShadow = opts.cShadow ?? "rgba(0,0,0,0.35)";
		const cAccent = opts.cAccent ?? "rgba(255,215,120,1.0)";
		const sh = 2;
		bitmap.fillRect(x - sh, y - sh, w + sh * 2, sh, cShadow);
		bitmap.fillRect(x - sh, y + h, w + sh * 2, sh, cShadow);
		bitmap.fillRect(x - sh, y, sh, h, cShadow);
		bitmap.fillRect(x + w, y, sh, h, cShadow);
		bitmap.fillRect(x, y, w, rim, cDark);
		bitmap.fillRect(x, y + h - rim, w, rim, cDark);
		bitmap.fillRect(x, y, rim, h, cDark);
		bitmap.fillRect(x + w - rim, y, rim, h, cDark);
		const innerX = x + rim;
		const innerY = y + rim;
		const innerW = w - rim * 2;
		const innerH = h - rim * 2;
		bitmap.fillRect(innerX, innerY, innerW, thickness, cMid);
		bitmap.fillRect(innerX, innerY + innerH - thickness, innerW, thickness, cMid);
		bitmap.fillRect(innerX, innerY, thickness, innerH, cMid);
		bitmap.fillRect(innerX + innerW - thickness, innerY, thickness, innerH, cMid);
		const ihX = innerX + thickness;
		const ihY = innerY + thickness;
		const ihW = innerW - thickness * 2;
		const ihH = innerH - thickness * 2;
		if (ihW > 0 && ihH > 0) {
			bitmap.fillRect(ihX, ihY, ihW, hl, cInner);
			bitmap.fillRect(ihX, ihY, hl, ihH, cInner);
			const cInner2 = "rgba(180,180,200,0.9)";
			bitmap.fillRect(ihX, ihY + ihH - hl, ihW, hl, cInner2);
			bitmap.fillRect(ihX + ihW - hl, ihY, hl, ihH, cInner2);
		}
		const dot = 2;
		const pad = 3;
		bitmap.fillRect(x + pad, y + pad, dot, dot, cAccent);
		bitmap.fillRect(x + w - pad - dot, y + pad, dot, dot, cAccent);
		bitmap.fillRect(x + pad, y + h - pad - dot, dot, dot, cAccent);
		bitmap.fillRect(x + w - pad - dot, y + h - pad - dot, dot, dot, cAccent);
	}
};

//#endregion
//#region src/plugins/map/core/managers/DataManager.js
/**
* Extends {@link #createGameObjects}.<br/>
* Also registers J.MAP minimap input actions and defaults.
*/
J.MAP.Aliased.DataManager.set("createGameObjects", DataManager.createGameObjects);
DataManager.createGameObjects = function() {
	J.MAP.Aliased.DataManager.get("createGameObjects").call(this);
	DataManager.registerMinimapInputActions();
};
/**
* Registers the minimap actions and seeds defaults into the engine-owned Input registry.
* Called each time game objects are (re)created.
*/
DataManager.registerMinimapInputActions = function() {
	Input.registerAction("J.MAP", {
		key: "minimap-toggle",
		label: "Toggle Minimap",
		defaults: [J.ABS.EXT.INPUT.Symbols.DPadUp],
		category: "ui"
	});
	Input.registerAction("J.MAP", {
		key: "expand-minimap",
		label: "Expand Minimap (Hold)",
		defaults: [J.ABS.EXT.INPUT.Symbols.DPadDown],
		category: "ui"
	});
	Input.seedDefaultBindings("J.MAP", {
		"minimap-toggle": [J.ABS.EXT.INPUT.Symbols.DPadUp],
		"expand-minimap": [J.ABS.EXT.INPUT.Symbols.DPadDown]
	});
	Input.getAllBindings("J.MAP");
};

//#endregion
//#region src/plugins/map/core/managers/JABS_Engine.js
/**
* Extends {@link JABS_Engine.addLootDropToMap}.<br/>
* Injects a minimap loot comment tag into freshly spawned loot events.
*/
J.MAP.Aliased.JABS_Engine.set("addLootDropToMap", JABS_Engine.prototype.addLootDropToMap);
JABS_Engine.prototype.addLootDropToMap = function(x, y, item) {
	const lootEvent = J.MAP.Aliased.JABS_Engine.get("addLootDropToMap").call(this, x, y, item);
	if (!lootEvent) return lootEvent;
	const eventId = lootEvent.eventId();
	const eventData = $dataMap.events[eventId];
	if (!eventData) return lootEvent;
	const minimapLootComment = {
		code: 108,
		indent: 0,
		parameters: ["<mm:loot>"]
	};
	const [firstPage] = eventData.pages;
	firstPage.list.unshift(minimapLootComment);
	lootEvent.refresh();
	return lootEvent;
};

//#endregion
//#region src/plugins/map/core/managers/JABS_InputAdapter.js
if (J.ABS) {
	/**
	* Toggles visibility of the minimap on the screen.
	* If J.TIME is used, the visibility will sync with the time window.
	*/
	JABS_InputAdapter.performMinimapWindowAction = function() {
		if (this._canPerformMinimapWindowAction() === false) {
			return;
		}
		$gameSystem.toggleMinimapVisibility();
	};
	/**
	* Determines whether or not the player can toggle the time window.
	* @returns {boolean}
	*/
	JABS_InputAdapter._canPerformMinimapWindowAction = function() {
		if ($gameMap.isMinimapBlocked()) {
			return false;
		}
		return true;
	};
	/**
	* Starts the temporary minimap focus mode (centered, expanded scope).
	*/
	JABS_InputAdapter.performMinimapFocusStart = function() {
		if ($gameMap.isMinimapBlocked()) return;
		if (!SceneManager._scene.isMapScene()) return;
		const mini = SceneManager._scene.getMiniMap();
		if (!mini) return;
		mini.enterFocusMode();
	};
	/**
	* Ends the temporary minimap focus mode and restores prior size/position.
	*/
	JABS_InputAdapter.performMinimapFocusEnd = function() {
		if (!SceneManager._scene.isMapScene()) return;
		const mini = SceneManager._scene.getMiniMap();
		if (!mini) return;
		mini.exitFocusMode();
	};
}

//#endregion
//#region src/plugins/map/core/objects/JABS_InputController.js
if (J.ABS) {
	/**
	* Extends {@link #initMembers}.<br/>
	* Also initializes the minimap controller-local state without lazy init.
	*/
	J.MAP.Aliased.JABS_StandardController.set("initMembers", JABS_StandardController.prototype.initMembers);
	JABS_StandardController.prototype.initMembers = function() {
		const original = J.MAP.Aliased.JABS_StandardController.get("initMembers").call(this);
		this._minimapFocusPressedPrev = false;
		return original;
	};
	/**
	* Gets whether or not the expand-minimap action was pressed in the prior frame.
	* @returns {boolean}
	*/
	JABS_StandardController.prototype.getMinimapFocusPressedPrev = function() {
		return this.minimapFocusPressedPrev() === true;
	};
	/**
	* Sets whether or not the expand-minimap action was pressed in the prior frame.
	* @param {boolean} v The new pressed state.
	*/
	JABS_StandardController.prototype.setMinimapFocusPressedPrev = function(v) {
		this._minimapFocusPressedPrev = v === true;
	};
	/**
	* Extends {@link #update}.<br/>
	* Also handles input detection for the the minimap window toggle shortcut key.
	*/
	J.MAP.Aliased.JABS_StandardController.set("update", JABS_StandardController.prototype.update);
	JABS_StandardController.prototype.update = function() {
		J.MAP.Aliased.JABS_StandardController.get("update").call(this);
		this.updateMiniMapWindowAction();
		this.updateMinimapFocusPeekAction();
	};
	/**
	* Monitors and takes action based on player input regarding the minimap window toggle shortcut key.
	*/
	JABS_StandardController.prototype.updateMiniMapWindowAction = function() {
		if (this.isMiniMapWindowActionTriggered()) {
			this.performMiniMapWindowAction();
		}
	};
	/**
	* Checks the inputs of the minimap window action.
	* @returns {boolean}
	*/
	JABS_StandardController.prototype.isMiniMapWindowActionTriggered = function() {
		if (Input.isActionTriggered("J.MAP", "minimap-toggle")) {
			return true;
		}
		return false;
	};
	/**
	* Executes the time window toggle action.
	*/
	JABS_StandardController.prototype.performMiniMapWindowAction = function() {
		JABS_InputAdapter.performMinimapWindowAction();
	};
	/**
	* Handles press-and-hold on the MobilitySkill input to show a centered, expanded minimap.
	* On press: enter focus mode; on release: exit focus mode.
	*/
	JABS_StandardController.prototype.updateMinimapFocusPeekAction = function() {
		if ($gameMap.isMinimapBlocked()) return;
		if (this.isMinimapFocusPeekActionHeld()) {
			this.performMinimapFocusStart();
		}
		if (this.isMinimapFocusPeekActionLifted()) {
			this.performMinimapFocusEnd();
		}
		this.setMinimapFocusPressedPrev(Input.isActionPressed("J.MAP", "expand-minimap"));
	};
	JABS_StandardController.prototype.isMinimapFocusPeekActionHeld = function() {
		if (Input.isActionPressed("J.MAP", "expand-minimap") && this.getMinimapFocusPressedPrev() === false) {
			return true;
		}
		return false;
	};
	JABS_StandardController.prototype.isMinimapFocusPeekActionLifted = function() {
		if (Input.isActionPressed("J.MAP", "expand-minimap") === false && this.getMinimapFocusPressedPrev() === true) {
			return true;
		}
		return false;
	};
	/**
	* Begins the minimap focus mode.
	*/
	JABS_StandardController.prototype.performMinimapFocusStart = function() {
		JABS_InputAdapter.performMinimapFocusStart();
	};
	/**
	* Ends the minimap focus mode.
	*/
	JABS_StandardController.prototype.performMinimapFocusEnd = function() {
		JABS_InputAdapter.performMinimapFocusEnd();
	};
}
/**
* Gets the minimap focus pressed prev.
* @returns {*} The minimapFocusPressedPrev.
*/
JABS_StandardController.prototype.minimapFocusPressedPrev = function() {
	return this._minimapFocusPressedPrev;
};

//#endregion
//#region src/plugins/map/core/windows/Window_JabsRemapActions.js
/**
* Extends {@link #buildPostExtensionGroups}.<br/>
* Also appends a "Map Actions" section for external (J.MAP) actions.
* @param {BuiltWindowCommand[]} rows The rows being built.
* @param {Set<string>} can The set of assignable logical action keys.
*/
J.MAP.Aliased.Window_JabsRemapActions.set("buildPostExtensionGroups", Window_JabsRemapActions.prototype.buildPostExtensionGroups);
Window_JabsRemapActions.prototype.buildPostExtensionGroups = function(rows, can) {
	J.MAP.Aliased.Window_JabsRemapActions.get("buildPostExtensionGroups").call(this, rows, can);
	rows.push(this.buildHeaderCommand("Map Actions"));
	rows.push(this.buildExternalActionCommand("J.MAP", "minimap-toggle", "Toggle Minimap", 190));
	rows.push(this.buildExternalActionCommand("J.MAP", "expand-minimap", "Expand Minimap (Hold)", 2480));
};

//#endregion
//#region src/plugins/map/core/scenes/Scene_Map.js
/**
* Extends {@link #initMembers}.<br/>
* Also initializes the minimap-related members.
*/
J.MAP.Aliased.Scene_Map.set("initMembers", Scene_Map.prototype.initMembers);
Scene_Map.prototype.initMembers = function() {
	J.MAP.Aliased.Scene_Map.get("initMembers").call(this);
	this.initMiniMapMembers();
};
/**
* Initializes the minimap-related members.
*/
Scene_Map.prototype.initMiniMapMembers = function() {
	/**
	* The J object where all my additional properties live.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with this plugin.
	*/
	this._j._map ||= {};
	/**
	* The tracked minimap.
	* @type {Sprite_MiniMap}
	*/
	this._j._map._miniMap = null;
};
/**
* Extends {@link #createAllWindows}.<br/>
* Also creates the minimap sprite.
*/
J.MAP.Aliased.Scene_Map.set("createAllWindows", Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function() {
	J.MAP.Aliased.Scene_Map.get("createAllWindows").call(this);
	this.createMiniMap();
};
/**
* Creates and attaches the minimap to the scene.
*/
Scene_Map.prototype.createMiniMap = function() {
	this.setMiniMap(new Sprite_MiniMap());
	let shouldBeVisible = $gameSystem.isMinimapVisible();
	if ($gameMap.isMinimapBlocked()) {
		shouldBeVisible = false;
	}
	this.getMiniMap().visible = shouldBeVisible;
	this.addChild(this.getMiniMap());
};
/**
* Gets the minimap sprite.
* @returns {Sprite_MiniMap|null}
*/
Scene_Map.prototype.getMiniMap = function() {
	return this._j._map._miniMap;
};
/**
* Sets the minimap sprite.
* @param {Sprite_MiniMap} miniMap The sprite to track.
*/
Scene_Map.prototype.setMiniMap = function(miniMap) {
	this._j._map._miniMap = miniMap;
};
/**
* Extends {@link #update}.<br/>
* Also keeps the visibility of the minimap in sync.
*/
J.MAP.Aliased.Scene_Map.set("update", Scene_Map.prototype.update);
Scene_Map.prototype.update = function() {
	J.MAP.Aliased.Scene_Map.get("update").call(this);
	this.updateMiniMapVisibilityAndOpacity();
};
/**
* Manages minimap visibility and overlap-opacity per frame.
*/
Scene_Map.prototype.updateMiniMapVisibilityAndOpacity = function() {
	const miniMap = this.getMiniMap();
	if (!miniMap) return;
	if ($gameMap.isMinimapBlocked()) {
		miniMap.visible = false;
		return;
	}
	if (miniMap.isInFocusMode()) {
		miniMap.visible = true;
		miniMap.alpha = 1;
		return;
	}
	let shouldBeVisible = $gameSystem.isMinimapVisible();
	if (J.HUD && J.MAP.Metadata.respectHudHide && !$hudManager.canShowHud()) {
		shouldBeVisible = false;
	}
	miniMap.visible = shouldBeVisible;
	if (!miniMap.visible) return;
	const overlapping = this.hasMinimapInterference();
	const overlapAlpha = J.MAP.Metadata.overlapOpacity ?? .4;
	miniMap.alpha = overlapping ? overlapAlpha : 1;
};
/**
* Determine if the minimap overlaps with the player.
* @returns {boolean}
*/
Scene_Map.prototype.hasMinimapInterference = function() {
	const mini = this.getMiniMap();
	if (!mini || !mini.bitmap) return false;
	const mmW = mini.bitmap.width;
	const mmH = mini.bitmap.height;
	const mmLeft = Math.round(mini.x - mmW / 2);
	const mmTop = Math.round(mini.y - mmH / 2);
	const mmRight = mmLeft + mmW;
	const mmBottom = mmTop + mmH;
	const px = $gamePlayer.screenX();
	const py = $gamePlayer.screenY();
	const pW = $gameMap.tileWidth && $gameMap.tileWidth() || 48;
	const pH = $gameMap.tileHeight && $gameMap.tileHeight() || 48;
	const pLeft = Math.round(px - pW / 2);
	const pTop = Math.round(py - pH);
	const pRight = pLeft + pW;
	const pBottom = pTop + pH;
	const noOverlap = mmRight <= pLeft || mmLeft >= pRight || mmBottom <= pTop || mmTop >= pBottom;
	return !noOverlap;
};

//#endregion
//#region src/plugins/map/core/_metadata/pluginCommands.js
/**
* Toggle the minimap visibility on the map scene.
*/
PluginManager.registerCommand(J.MAP.Metadata.name, "toggle-minimap", (args) => {
	const shouldShow = `${args.action}` === "true";
	if ($gameMap.isMinimapBlocked()) {
		$gameSystem.hideMinimap();
		if (SceneManager._scene.isMapScene()) {
			const miniMap = SceneManager._scene.getMiniMap();
			if (miniMap) {
				miniMap.visible = false;
			}
		}
		return;
	}
	if (shouldShow) {
		$gameSystem.showMinimap();
	} else {
		$gameSystem.hideMinimap();
	}
	if (SceneManager._scene.isMapScene()) {
		const miniMap = SceneManager._scene.getMiniMap();
		if (miniMap) {
			miniMap.visible = shouldShow;
		}
	}
});

//#endregion
//# sourceMappingURL=J-Map.js.map