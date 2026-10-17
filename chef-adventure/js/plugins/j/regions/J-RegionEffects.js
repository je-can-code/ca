//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.3.0 REGIONS] A plugin that controls passage by region ids.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-Base-Save
 * @help
 * ============================================================================
 * Please refer to J-RegionEffects's book for more details:
 * https://github.com/je-can-code/rmmz-plugins/blob/main/docs/plugins/regions/core/index.md
 * ============================================================================
 *
 * @param globalAllowRegions
 * @type number[]
 * @text Global Allowed Regions
 * @desc The region ids that are always allowed on every map.
 * @default []
 *
 * @param globalDenyRegions
 * @type number[]
 * @text Global Denied Regions
 * @desc The region ids that are always denied on every map.
 * @default []
 *
 * @param globalDenyTerrainTags
 * @type number[]
 * @text Global Denied Terrain Tags
 * @desc The terrain tags that are always impassable on every map. Terrain tags live on the tileset, not the map.
 * @default []
 */
//endregion annotations

//#region src/plugins/regions/core/_metadata/_pluginMetadata.js
var J_RegionEffectsPluginMetadata = class extends PluginMetadata {
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
		this.initializeMetadata();
	}
	/**
	* Initializes the metadata associated with this plugin.
	*/
	initializeMetadata() {
		/**
		* The global region ids that allow passage on all maps.
		* @type {number[]}
		*/
		this.globalAllowRegions = J.REGIONS.Helpers.translateRegionIds(this.parsedPluginParameters["globalAllowRegions"]);
		/**
		* The global region ids that deny passage on all maps.
		* @type {number[]}
		*/
		this.globalDenyRegions = J.REGIONS.Helpers.translateRegionIds(this.parsedPluginParameters["globalDenyRegions"]);
		/**
		* The terrain tags that deny passage on all maps.
		*
		* Terrain tags are authored on the tileset rather than the map, which makes them the cheaper
		* way to mark a whole family of tiles unwalkable- ceilings, cliff faces, anything that reads as
		* scenery but happens to sit on a passable tile. Marking those by region would mean painting
		* every map that uses the tileset.
		* @type {number[]}
		*/
		this.globalDenyTerrainTags = J.REGIONS.Helpers.translateRegionIds(this.parsedPluginParameters["globalDenyTerrainTags"]);
	}
};

//#endregion
//#region src/plugins/regions/core/_metadata/initialization.js
/**
* The core where all of my extensions live = in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.REGIONS = {};
/**
* The parent namespace for all REGIONS extensions.
*/
J.REGIONS.EXT = {};
/**
* A collection of helpful functions for use within this plugin.
*/
J.REGIONS.Helpers = {};
/**
* Translates the JSON blob from the plugin parameters into the expected region ids.
* @param {string} regionsBlob The json blob from the plugin parameters to translate.
* @returns {number[]} The translated region ids.
*/
J.REGIONS.Helpers.translateRegionIds = (regionsBlob) => {
	const parsedRegions = JSON.parse(regionsBlob);
	return parsedRegions.map((id) => parseInt(id));
};
/**
* The `metadata` associated with this plugin; such as version.
*/
J.REGIONS.Metadata = new J_RegionEffectsPluginMetadata("J-RegionEffects", "1.3.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.REGIONS.Aliased = {};
J.REGIONS.Aliased.Game_Map = new Map();
/**
* All regular expressions used by this plugin.
*/
J.REGIONS.RegExp = {};
J.REGIONS.RegExp.AllowRegions = /<allowRegions:[ ]?(\[[\d, ]+])>/gi;
J.REGIONS.RegExp.DenyRegions = /<denyRegions:[ ]?(\[[\d, ]+])>/gi;

//#endregion
//#region src/plugins/regions/core/objects/Game_Map.js
/**
* Extends {@link #initMembers}.<br/>
* Also initializes the region effects properties.
*/
J.REGIONS.Aliased.Game_Map.set("initMembers", Game_Map.prototype.initMembers);
Game_Map.prototype.initMembers = function() {
	J.REGIONS.Aliased.Game_Map.get("initMembers").call(this);
	this.initRegionEffectsMembers();
};
/**
* Initializes all region effects properties for the map.
*/
Game_Map.prototype.initRegionEffectsMembers = function() {
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* The grouping of all properties related to region effects.
	*/
	this._j._regions = {};
	/**
	* The collection of region ids that deny passage.
	* @type {number[]}
	*/
	this._j._regions._deny = Array.empty;
	/**
	* The collection of region ids that allow passage.
	* @type {number[]}
	*/
	this._j._regions._allow = Array.empty;
};
/**
* Get the collection of passage-allowing region ids.
* @returns {number[]}
*/
Game_Map.prototype.getAllowEffectRegionIds = function() {
	return this._j._regions._allow;
};
/**
* Adds the region id to the list of passage-allowing ids.
* @param {number} allowRegionId The region id to add.
*/
Game_Map.prototype.addAllowEffectRegionId = function(allowRegionId) {
	const allowRegionIds = this.getAllowEffectRegionIds();
	if (allowRegionIds.includes(allowRegionId)) return;
	allowRegionIds.push(allowRegionId);
};
/**
* Clears the region ids for allowing passage from this map.
*/
Game_Map.prototype.clearAllowEffectRegionIds = function() {
	this._j._regions._allow = Array.empty;
};
/**
* Get the collection of passage-denying region ids.
* @returns {number[]}
*/
Game_Map.prototype.getDenyEffectRegionIds = function() {
	return this._j._regions._deny;
};
/**
* Adds the region id to the list of passage-denying ids.
* @param {number} denyRegionId The region id to add.
*/
Game_Map.prototype.addDenyEffectRegionId = function(denyRegionId) {
	const denyRegionIds = this.getDenyEffectRegionIds();
	if (denyRegionIds.includes(denyRegionId)) return;
	denyRegionIds.push(denyRegionId);
};
/**
* Clears the region ids for denying passage from this map.
*/
Game_Map.prototype.clearDenyEffectRegionIds = function() {
	this._j._regions._deny = Array.empty;
};
/**
* Extends {@link #setup}.<br/>
* Also initializes this map's allow/deny region ids.
*/
J.REGIONS.Aliased.Game_Map.set("setup", Game_Map.prototype.setup);
Game_Map.prototype.setup = function(mapId) {
	J.REGIONS.Aliased.Game_Map.get("setup").call(this, mapId);
	this.setupRegionEffects();
};
/**
* Sets up the region effects based on tags for this map.
*/
Game_Map.prototype.setupRegionEffects = function() {
	this.clearRegionEffects();
	this.refreshRegionEffects();
};
/**
* Clears all region effects from cache.
*/
Game_Map.prototype.clearRegionEffects = function() {
	this.clearAllowEffectRegionIds();
	this.clearDenyEffectRegionIds();
};
/**
* Refreshes all region effects and stores them in the cache.
*/
Game_Map.prototype.refreshRegionEffects = function() {
	if (!this.canRefreshRegionEffects()) return;
	this.refreshAllowRegionEffects();
	this.refreshDenyRegionEffects();
	if (globalThis.PIXEL_CollisionManager) {
		PIXEL_CollisionManager.setupCollision();
	}
};
/**
* Determines whether or not the region effects can be refreshed.
* @returns {boolean}
*/
Game_Map.prototype.canRefreshRegionEffects = function() {
	if (!$dataMap) return false;
	return true;
};
/**
* Refreshes the allow region effects for the map.
*/
Game_Map.prototype.refreshAllowRegionEffects = function() {
	const allowedRegions = RPGManager.getArrayFromNotesByRegex({ note: this.note() }, J.REGIONS.RegExp.AllowRegions);
	allowedRegions.forEach(this.addAllowEffectRegionId, this);
};
/**
* Refreshes the deny region effects for the map.
*/
Game_Map.prototype.refreshDenyRegionEffects = function() {
	const deniedRegions = RPGManager.getArrayFromNotesByRegex({ note: this.note() }, J.REGIONS.RegExp.DenyRegions);
	deniedRegions.forEach(this.addDenyEffectRegionId, this);
};
/**
* Extends {@link #isPassable}.<br/>
* Also considers region effects for passability.
*/
J.REGIONS.Aliased.Game_Map.set("isPassable", Game_Map.prototype.isPassable);
Game_Map.prototype.isPassable = function(x, y, d) {
	const [projectedX, projectedY] = this.projectCoordinatesByDirection(x, y, d);
	const regionId = this.regionId(projectedX, projectedY);
	if (this.isDenyRegionId(regionId)) {
		return false;
	}
	if (this.isAllowRegionId(regionId)) {
		return true;
	}
	return J.REGIONS.Aliased.Game_Map.get("isPassable").call(this, x, y, d);
};
/**
* Overwrites {@link #checkPassage}.<br/>
* Also refuses passage over any tile carrying a globally-denied terrain tag.
*
* Vanilla decides passability from the tileset's direction bits alone, which leaves no way to say
* "this tile is scenery" for something drawn on an otherwise walkable layer- ceilings and cliff
* faces being the usual offenders. Terrain tags already mark those on the tileset, so honoring them
* here blocks the whole family across every map at once, and it stops forced displacement such as
* knockback from parking a battler somewhere unreachable.
* @param {number} x The `x` coordinate.
* @param {number} y The `y` coordinate.
* @param {number} bit The bitwise operator being checked.
* @returns {boolean} True if the tile can be walked on, false otherwise.
*/
Game_Map.prototype.checkPassage = function(x, y, bit) {
	const flags = this.tilesetFlags();
	const tiles = this.allTiles(x, y);
	const deniedTerrainTags = J.REGIONS.Metadata.globalDenyTerrainTags;
	for (const tile of tiles) {
		const flag = flags[tile];
		if ((flag & 16) !== 0) {
			continue;
		}
		if (deniedTerrainTags.includes(flag >> 12)) {
			return false;
		}
		if ((flag & bit) === 0) {
			return true;
		}
		if ((flag & bit) === bit) {
			return false;
		}
	}
	return false;
};
/**
* Determines whether or not the given region id is a deny region id.
* @param {number} regionId The given region id.
* @returns {boolean} True if the region id will deny passage, false otherwise.
*/
Game_Map.prototype.isDenyRegionId = function(regionId) {
	const globalDenyRegionIds = J.REGIONS.Metadata.globalDenyRegions;
	const currentDenyRegionIds = this.getDenyEffectRegionIds();
	const allDenyRegionIds = globalDenyRegionIds.concat(currentDenyRegionIds);
	const isDenied = allDenyRegionIds.includes(regionId);
	return isDenied;
};
/**
* Determines whether or not the given region id is an allow region id.
* @param {number} regionId The given region id.
* @returns {boolean} True if the region id will allow passage, false otherwise.
*/
Game_Map.prototype.isAllowRegionId = function(regionId) {
	const globalAllowRegionIds = J.REGIONS.Metadata.globalAllowRegions;
	const currentAllowRegionIds = this.getAllowEffectRegionIds();
	const allAllowRegionIds = globalAllowRegionIds.concat(currentAllowRegionIds);
	const isAllowed = allAllowRegionIds.includes(regionId);
	return isAllowed;
};
/**
* Calculates the coordinates of where the player will step next based on their
* current location and trajectory.
* @param {number} x The x coordinate.
* @param {number} y The y coordinate.
* @param {number} d The direction faced.
* @returns {[number, number]} An array of the projected x and y coordinates.
*/
Game_Map.prototype.projectCoordinatesByDirection = function(x, y, d) {
	let projectedX = x;
	let projectedY = y;
	switch (d) {
		case 2:
			projectedY += 1;
			break;
		case 4:
			projectedX -= 1;
			break;
		case 6:
			projectedX += 1;
			break;
		case 8:
			projectedY -= 1;
			break;
	}
	return [projectedX, projectedY];
};

//#endregion
//#region src/plugins/regions/core/registerRegionsSaveRoutes.js
/**
* Lifts this plugin's slice out of whatever host carries it and into its own section file.
*
* Without this the namespace still saves correctly - it simply rides inline on the host it was
* assigned to, which is where every plugin's state lived before the router existed. Registering
* is what gives J-RegionEffects a file of its own to read.
*
* The namespace check is the one this codebase allows: J-Base-Save is genuinely optional, and
* without it the engine's own save path carries this state inline just as it always did.
*/
if (J.BASE.EXT.SAVE) {
	SaveSectionRouter.registerNamespace("_regions", "regions");
}

//#endregion
//# sourceMappingURL=J-RegionEffects.js.map