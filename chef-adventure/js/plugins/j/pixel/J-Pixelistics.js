//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.1 PIXEL] Enables sub-tile (pixel-accurate) movement on the map.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is J-Pixelistics: pixel-accurate movement for RPG Maker MZ.
 *
 * It replaces the default tile-locked movement with a fractional-coordinate
 * system, allowing characters to occupy any point within the map rather than
 * only the center of a tile. Sub-tile collision is handled via a subcell
 * table built from the engine's own tile passability data.
 *
 * All J-plugins that provide optional integration with this plugin (such as
 * J-ABS-Pixelistics for JABS combat support) load after this plugin.
 *
 * ----------------------------------------------------------------------------
 * DETAILS
 * Characters move in fractional tile units each frame (e.g. 0.15 tiles). A
 * subcell collision table (PIXEL_CollisionManager) is built on each map load,
 * dividing every tile into a configurable number of subcells (default 4x4).
 *
 * Collision is resolved by checking subcell edge crossings in the direction
 * of travel, using directional passability codes derived from the tileset.
 *
 * JABS integration (ally AI formation, smart battler movement, action
 * distance scaling, etc.) is handled by the separate J-ABS-Pixelistics
 * extension, which must be loaded after this plugin.
 *
 * ----------------------------------------------------------------------------
 * LAYERING
 * The source for this plugin is organized as follows:
 *   src/plugins/pixel/core  — this plugin (engine-facing movement)
 *   src/plugins/pixel/ext/abs  — JABS bridge (loads after J-ABS + this)
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.1
 *    Optional foot-touch trigger delay after map setup (plugin parameter).
 * - 1.0.0
 *    Initial release as standalone J-Pixelistics.
 *    Sub-tile fractional-coordinate movement with AABB subcell collision grid.
 *    Wall-sliding on cardinal and diagonal movement.
 *    Visual depth pivot (characters rendered with feet at the tile center).
 *    Vector (360-degree) movement via raw analog gamepad axes; falls back to
 *    8-direction for keyboard and d-pad input.
 *    Subcell collision debug overlay (toggle with backslash key).
 * ============================================================================
 *
 *
 * @param collisionConfigs
 * @text COLLISION SETUP
 *
 * @param collisionStepCount
 * @parent collisionConfigs
 * @type select
 * @option 1 (coarse)
 * @value 1
 * @option 2 (medium)
 * @value 2
 * @option 4 (fine, default)
 * @value 4
 * @text Subcells Per Tile
 * @desc The number of subcells to divide each tile into along each axis. Higher = more precise edges but more memory.
 * @default 4
 *
 * @param collisionRadius
 * @parent collisionConfigs
 * @type number
 * @decimals 2
 * @min 0.05
 * @max 0.49
 * @text Collision Radius
 * @desc Half-size of the character's square hitbox in tile units. 0.3 is a reasonable default.
 * @default 0.30
 *
 *
 * @param movementConfigs
 * @text MOVEMENT
 *
 * @param vectorMovementEnabled
 * @parent movementConfigs
 * @type boolean
 * @text Enable Vector (360°) Movement
 * @desc When true, the player can move at any angle via analog stick or mouse direction. Falls back to 8-dir if no analog input.
 * @default false
 *
 * @param footTouchEventDelayFrames
 * @parent movementConfigs
 * @type number
 * @min 0
 * @max 120
 * @text Foot Touch Trigger Delay (frames)
 * @desc After a map loads, suppress Player Touch / Event Touch on the tile under the player for this many frames (0 = off). Reduces spurious saves after load.
 * @default 15
 *
 *
 * @param debugConfigs
 * @text DEBUG
 *
 * @param overlayInitiallyVisible
 * @parent debugConfigs
 * @type boolean
 * @text Overlay Initially Visible
 * @desc Show the subcell collision overlay on map load. Toggle at runtime with the backslash key.
 * @default false
 *
 */
//endregion annotations

//#region src/plugins/pixel/core/_metadata/_pluginMetadata.js
/**
* Plugin metadata class for J-Pixelistics.
*/
var JPixelistics_PluginMetadata = class extends PluginMetadata {
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
	* Includes translation of plugin parameters.
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
		* Whether or not 360-degree vector movement is enabled.
		* When false, movement snaps to the standard 8 directions.
		* @type {boolean}
		*/
		this.VectorMovementEnabled = this.parsedPluginParameters["vectorMovementEnabled"] === "true";
		/**
		* Frames after map setup during which player/event touch triggers underfoot are ignored.
		* @type {number}
		*/
		this.FootTouchEventDelayFrames = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["footTouchEventDelayFrames"], 15);
		/**
		* The number of subcells per tile axis to use for collision resolution.
		* Valid values: 1, 2, or 4.
		* @type {number}
		*/
		this.CollisionStepCount = parseInt(this.parsedPluginParameters["collisionStepCount"]) || 4;
		/**
		* The half-size of the character hitbox in tile units used for AABB collision.
		* @type {number}
		*/
		this.CollisionRadius = parseFloat(this.parsedPluginParameters["collisionRadius"]) || .3;
		/**
		* Whether or not the subcell collision overlay should be visible on map load.
		* @type {boolean}
		*/
		this.OverlayInitiallyVisible = this.parsedPluginParameters["overlayInitiallyVisible"] === "true";
	}
};

//#endregion
//#region src/plugins/pixel/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.PIXEL = {};
/**
* The parent namespace for all J-Pixelistics extensions.
*/
J.PIXEL.EXT ||= {};
/**
* The metadata associated with this plugin.
*/
J.PIXEL.Metadata = new JPixelistics_PluginMetadata("J-Pixelistics", "1.0.1");
/**
* A collection of all aliased methods for this plugin.
*/
J.PIXEL.Aliased = {
	Game_Character: new Map(),
	Game_CharacterBase: new Map(),
	Game_Follower: new Map(),
	Game_Map: new Map(),
	Game_Player: new Map(),
	Spriteset_Map: new Map()
};
/**
* Directional constants matching RMMZ engine conventions.
* Defined here so the pixel core does not depend on J-ABS for basic direction numerics.
*/
J.PIXEL.Directions = {
	DOWN: 2,
	LEFT: 4,
	RIGHT: 6,
	UP: 8,
	LOWERLEFT: 1,
	LOWERRIGHT: 3,
	UPPERLEFT: 7,
	UPPERRIGHT: 9
};
/**
* A small debug container for one-frame collision sampling traces.
* Populated by the pixel passage helpers and consumed by Sprite_PixelCollisionOverlay.
*/
J.PIXEL.Debug = {
	/**
	* Controls whether subcell samples are collected.
	* Set to true only when the collision overlay is actively visible.
	* Leave false in production to avoid per-frame object allocations in the probe loops.
	* @type {boolean}
	*/
	enabled: false,
	/**
	* @type {{x:number,y:number,color:string}[]}
	*/
	samples: [],
	/**
	* Queues a subcell sample to be drawn this frame by the overlay.
	* @param {number} x Fractional tile x (seam-aligned).
	* @param {number} y Fractional tile y (seam-aligned).
	* @param {string} color A rgba color string.
	*/
	push(x, y, color) {
		if (this.enabled === false) return;
		this.samples.push({
			x,
			y,
			color
		});
	},
	/**
	* Clears all queued samples at the end of each frame.
	*/
	clear() {
		this.samples.length = 0;
	}
};

//#endregion
//#region src/plugins/pixel/core/managers/PIXEL_CollisionManager.js
/**
* A static manager that builds and serves a subcell collision table per map.
* It derives all subcell data only from the engine's tile passability.
* No external plugin references are used.
*/
var PIXEL_CollisionManager = class {
	/**
	* Initializes configuration for collision table density and storage.
	* Reads the step count from J.PIXEL.Metadata if available, otherwise defaults to 4.
	*/
	static initConfig() {
		const metaCount = J.PIXEL && J.PIXEL.Metadata ? J.PIXEL.Metadata.CollisionStepCount : 4;
		this.collisionStepCount = metaCount;
		this.collisionSize = 1 / this.collisionStepCount;
		this._table = [];
	}
	/**
	* Builds the subcell collision table from the current map.
	* Call on map setup after the map is loaded.
	*/
	static setupCollision() {
		if (this.collisionStepCount === undefined) {
			this.initConfig();
		}
		if (!$gameMap || !$dataMap) {
			return;
		}
		const subW = $dataMap.width * this.collisionStepCount;
		const subH = $dataMap.height * this.collisionStepCount;
		this._table = new Array(subW * subH);
		this._loadDefaultCollisionTable();
	}
	/**
	* Populates the subcell collision table using engine tile passability.
	*/
	static _loadDefaultCollisionTable() {
		for (let y = 0; y < $dataMap.height; y++) {
			for (let x = 0; x < $dataMap.width; x++) {
				const canEnterFromBelow = $gameMap.isPassable(x, y + 1, J.PIXEL.Directions.UP);
				const canEnterFromAbove = $gameMap.isPassable(x, y - 1, J.PIXEL.Directions.DOWN);
				const canEnterFromLeft = $gameMap.isPassable(x - 1, y, J.PIXEL.Directions.RIGHT);
				const canEnterFromRight = $gameMap.isPassable(x + 1, y, J.PIXEL.Directions.LEFT);
				const canBeEntered = canEnterFromBelow || canEnterFromAbove || canEnterFromLeft || canEnterFromRight;
				if (canBeEntered === false) {
					this._fillTile(x, y, this.Codes.Solid);
					continue;
				}
				const passDown = $gameMap.isPassable(x, y, J.PIXEL.Directions.DOWN);
				const passLeft = $gameMap.isPassable(x, y, J.PIXEL.Directions.LEFT);
				const passRight = $gameMap.isPassable(x, y, J.PIXEL.Directions.RIGHT);
				const passUp = $gameMap.isPassable(x, y, J.PIXEL.Directions.UP);
				this._applyTileCollision(x, y, passDown, passLeft, passRight, passUp);
			}
		}
	}
	/**
	* Computes the flattened index into the subcell table for a fractional coordinate.
	* RAW indexer: no global shift applied here. Writers use this (build-time).
	* @param {number} px The fractional x (tile units).
	* @param {number} py The fractional y (tile units).
	* @returns {number} The subcell index.
	*/
	static _index(px, py) {
		const step = this.collisionStepCount;
		const widthInSub = $gameMap.width() * step;
		const heightInSub = $gameMap.height() * step;
		let ix = Math.floor(px * step);
		let iy = Math.floor(py * step);
		ix = (ix % widthInSub + widthInSub) % widthInSub;
		iy = (iy % heightInSub + heightInSub) % heightInSub;
		return iy * widthInSub + ix;
	}
	/**
	* Writes a collision code into the table at a fractional coordinate.
	* @param {number} px The fractional x (tile units).
	* @param {number} py The fractional y (tile units).
	* @param {number} code The collision code to write.
	*/
	static _set(px, py, code) {
		const idx = this._index(px, py);
		this._table[idx] = code;
	}
	/**
	* Fills an entire integer tile with a single collision code.
	* @param {number} x The integer tile x.
	* @param {number} y The integer tile y.
	* @param {number} code The collision code to fill with.
	*/
	static _fillTile(x, y, code) {
		const step = this.collisionSize;
		for (let subX = x; subX < x + 1; subX += step) {
			for (let subY = y; subY < y + 1; subY += step) {
				this._set(subX, subY, code);
			}
		}
	}
	/**
	* Draws a one-subcell-thick edge line along a tile's boundary.
	* @param {number} x The tile x.
	* @param {number} y The tile y.
	* @param {2|4|6|8} d The boundary direction to draw along.
	* @param {number} code The collision code to write.
	*/
	static _drawEdge(x, y, d, code) {
		const step = this.collisionSize;
		if (d === J.PIXEL.Directions.DOWN || d === J.PIXEL.Directions.UP) {
			const subY = d === J.PIXEL.Directions.DOWN ? y + 1 - step : y;
			for (let subX = x; subX < x + 1; subX += step) {
				this._set(subX, subY, code);
			}
			return;
		}
		const subX = d === J.PIXEL.Directions.RIGHT ? x + 1 - step : x;
		for (let subY = y; subY < y + 1; subY += step) {
			this._set(subX, subY, code);
		}
	}
	/**
	* Places a single corner subcell blocker at the specified tile corner.
	* @param {number} x The tile x.
	* @param {number} y The tile y.
	* @param {4|6} horz The horizontal side (LEFT/RIGHT).
	* @param {2|8} vert The vertical side (DOWN/UP).
	* @param {number} code The collision code to write.
	*/
	static _drawCorner(x, y, horz, vert, code) {
		const step = this.collisionSize;
		const subY = vert === J.PIXEL.Directions.DOWN ? y + 1 - step : y;
		const subX = horz === J.PIXEL.Directions.RIGHT ? x + 1 - step : x;
		this._set(subX, subY, code);
	}
	/**
	* Applies four direction passabilities to the tile's subcells using codes.
	* @param {number} x The tile x.
	* @param {number} y The tile y.
	* @param {boolean} passDown Whether moving DOWN is allowed from this tile.
	* @param {boolean} passLeft Whether moving LEFT is allowed from this tile.
	* @param {boolean} passRight Whether moving RIGHT is allowed from this tile.
	* @param {boolean} passUp Whether moving UP is allowed from this tile.
	*/
	static _applyTileCollision(x, y, passDown, passLeft, passRight, passUp) {
		if (passDown === passLeft && passDown === passRight && passDown === passUp) {
			const code = passDown === true ? this.Codes.Open : this.Codes.Solid;
			this._fillTile(x, y, code);
			return;
		}
		if (this.collisionStepCount === 1) {
			const merged = this._mergeSingleTile(!passUp, !passDown, !passLeft, !passRight);
			this._set(x, y, merged);
			return;
		}
		this._fillTile(x, y, this.Codes.Open);
		if (passLeft === false) {
			this._drawEdge(x, y, J.PIXEL.Directions.LEFT, this.Codes.EdgeLeft);
		}
		if (passRight === false) {
			this._drawEdge(x, y, J.PIXEL.Directions.RIGHT, this.Codes.EdgeRight);
		}
		if (passDown === false) {
			this._drawEdge(x, y, J.PIXEL.Directions.DOWN, this.Codes.EdgeDown);
			if (passLeft === false) {
				this._drawCorner(x, y, J.PIXEL.Directions.LEFT, J.PIXEL.Directions.DOWN, this.Codes.CornerBottomLeft);
			}
			if (passRight === false) {
				this._drawCorner(x, y, J.PIXEL.Directions.RIGHT, J.PIXEL.Directions.DOWN, this.Codes.CornerBottomRight);
			}
		}
		if (passUp === false) {
			this._drawEdge(x, y, J.PIXEL.Directions.UP, this.Codes.EdgeUp);
			if (passLeft === false) {
				this._drawCorner(x, y, J.PIXEL.Directions.LEFT, J.PIXEL.Directions.UP, this.Codes.CornerTopLeft);
			}
			if (passRight === false) {
				this._drawCorner(x, y, J.PIXEL.Directions.RIGHT, J.PIXEL.Directions.UP, this.Codes.CornerTopRight);
			}
		}
	}
	/**
	* Merges directional edge blocks into a single code when only one subcell is used.
	* @param {boolean} blockUp Whether the up edge is blocked.
	* @param {boolean} blockDown Whether the down edge is blocked.
	* @param {boolean} blockLeft Whether the left edge is blocked.
	* @param {boolean} blockRight Whether the right edge is blocked.
	* @returns {number} The representative collision code.
	*/
	static _mergeSingleTile(blockUp, blockDown, blockLeft, blockRight) {
		if (blockUp && blockDown && blockLeft && blockRight) {
			return this.Codes.Solid;
		}
		if (blockUp && blockDown && !blockLeft && !blockRight) {
			return this.Codes.VerticalLine;
		}
		if (blockLeft && blockRight && !blockUp && !blockDown) {
			return this.Codes.HorizontalLine;
		}
		if (blockUp && !blockDown && !blockLeft && !blockRight) {
			return this.Codes.EdgeUp;
		}
		if (blockDown && !blockUp && !blockLeft && !blockRight) {
			return this.Codes.EdgeDown;
		}
		if (blockLeft && !blockRight && !blockUp && !blockDown) {
			return this.Codes.EdgeLeft;
		}
		if (blockRight && !blockLeft && !blockUp && !blockDown) {
			return this.Codes.EdgeRight;
		}
		if (blockUp && blockLeft && !blockRight && !blockDown) {
			return this.Codes.CornerTopLeft;
		}
		if (blockUp && blockRight && !blockLeft && !blockDown) {
			return this.Codes.CornerTopRight;
		}
		if (blockDown && blockLeft && !blockRight && !blockUp) {
			return this.Codes.CornerBottomLeft;
		}
		if (blockDown && blockRight && !blockLeft && !blockUp) {
			return this.Codes.CornerBottomRight;
		}
		return this.Codes.Open;
	}
	/**
	* Determines if a fractional subcell allows movement in a given direction.
	* Applies the global half-tile grid shift on READS to align with visual seams.
	* @param {number} px The fractional x (tile units).
	* @param {number} py The fractional y (tile units).
	* @param {2|4|6|8} d The entering direction.
	* @returns {boolean} True if passable, false otherwise.
	*/
	static isPositionPassable(px, py, d) {
		const sx = px + this.GridShiftX;
		const sy = py + this.GridShiftY;
		const tx = Math.floor(sx);
		const ty = Math.floor(sy);
		if (tx < 0 || ty < 0 || tx >= $gameMap.width() || ty >= $gameMap.height()) {
			return false;
		}
		const code = this._table[this._index(sx, sy)] || this.Codes.Open;
		if (code === this.Codes.Open) {
			return true;
		}
		if (code === this.Codes.Solid) {
			return false;
		}
		if (code === this.Codes.VerticalLine) {
			if (d === J.PIXEL.Directions.UP || d === J.PIXEL.Directions.DOWN) {
				return false;
			}
			return true;
		}
		if (code === this.Codes.HorizontalLine) {
			if (d === J.PIXEL.Directions.LEFT || d === J.PIXEL.Directions.RIGHT) {
				return false;
			}
			return true;
		}
		if (code === this.Codes.EdgeLeft) {
			return d !== J.PIXEL.Directions.LEFT;
		}
		if (code === this.Codes.EdgeRight) {
			return d !== J.PIXEL.Directions.RIGHT;
		}
		if (code === this.Codes.EdgeDown) {
			return d !== J.PIXEL.Directions.DOWN;
		}
		if (code === this.Codes.EdgeUp) {
			return d !== J.PIXEL.Directions.UP;
		}
		if (code === this.Codes.CornerBottomLeft || code === this.Codes.CornerBottomRight || code === this.Codes.CornerTopLeft || code === this.Codes.CornerTopRight) {
			return false;
		}
		return true;
	}
};
/**
* Attach an enumeration of collision codes to the manager class.
* These codes represent the logical shape located at a given subcell.
*/
PIXEL_CollisionManager.Codes = {
	Open: 1,
	Solid: 2,
	VerticalLine: 4,
	HorizontalLine: 5,
	EdgeLeft: 14,
	EdgeRight: 16,
	EdgeDown: 12,
	EdgeUp: 18,
	CornerBottomLeft: 11,
	CornerBottomRight: 13,
	CornerTopLeft: 17,
	CornerTopRight: 19
};
/**
* Global collision-lattice shift (in tiles) applied on the X axis inside the indexer.
* Use +0.5 when character/world coords are edge-based but movement logic expects center alignment.
* Flip to -0.5 if your incoming sample coords are already center-shifted elsewhere.
* @type {number}
*/
PIXEL_CollisionManager.GridShiftX = 0;
/**
* Global collision-lattice shift (in tiles) applied on the Y axis inside the indexer.
* See GridShiftX for guidance on selecting the sign.
* @type {number}
*/
PIXEL_CollisionManager.GridShiftY = 0;

//#endregion
//#region src/plugins/pixel/core/objects/Game_Character.js
/**
* The set of move route command codes that should be repeated per subcell when in pixel mode.
* These correspond to the "Move X" commands in RPG Maker's event move route.
* @type {number[]}
*/
Game_Character.pixelRepeatableMoveCommandCodes = [
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13
];
/**
* Extends {@link processMoveCommand}.<br/>
* Ensures when move routes are being processed, that we adjust the x,y coordinates.
* @param {RPG_EventListCommand} command The commands associated with this movement.
*/
J.PIXEL.Aliased.Game_Character.set("processMoveCommand", Game_Character.prototype.processMoveCommand);
Game_Character.prototype.processMoveCommand = function(command) {
	this.setMovePressed(false);
	J.PIXEL.Aliased.Game_Character.get("processMoveCommand").call(this, command);
};
/**
* Overwrites {@link #searchLimit}.<br/>
* Uses a different value to have a broader search distance.
* @returns {number}
*/
Game_Character.prototype.searchLimit = function() {
	return 40;
};
/**
* Extends {@link #updateRoutineMove}.<br/>
* Repeats move-route movement commands by the collision step count so that
* scripted movement (event pages, move routes) covers the intended full-tile distance.
* JABS actions are excluded and use default logic unchanged.
*/
J.PIXEL.Aliased.Game_Character.set("updateRoutineMove", Game_Character.prototype.updateRoutineMove);
Game_Character.prototype.updateRoutineMove = function() {
	if (J.ABS && this.isJabsAction()) {
		J.PIXEL.Aliased.Game_Character.get("updateRoutineMove").call(this);
		return;
	}
	this.handlePixelRoutineMove();
};
/**
* Handles updating event move routes with pixel-aware repetition.
* Repeats each movement command by the collision step count before advancing
* to the next command in the route, so scripted movement covers the full tile.
*/
Game_Character.prototype.handlePixelRoutineMove = function() {
	if (this._waitCount > 0) {
		this._waitCount--;
		return;
	}
	this.setMovementSuccess(true);
	const command = this._moveRoute.list[this._moveRouteIndex];
	if (command === undefined) return;
	if (this.canStartPixelRepeatMove(command)) {
		this.beginRepeatMove();
		this.setRepeatMoveCount(this.pixelRepeatCountForRoute());
	}
	this.processMoveCommand(command);
	if (this.isRepeatMoveActive()) {
		this.decrementRepeatMoveCount();
		if (this.getRepeatMoveCount() === 0) {
			this.stopRepeatMove();
		}
	}
	if (this.isRepeatMoveActive() === false) {
		this.advanceMoveRouteIndex();
	}
};
/**
* Determines whether a repeat cycle should be started for the given command.
* @param {RPG_EventListCommand} command The current move route command.
* @returns {boolean} True if a new repeat cycle should begin.
*/
Game_Character.prototype.canStartPixelRepeatMove = function(command) {
	if (this.isRepeatMoveActive()) return false;
	if (Game_Character.pixelRepeatableMoveCommandCodes.includes(command.code) === false) return false;
	return true;
};

//#endregion
//#region src/plugins/pixel/core/objects/Game_CharacterBase.js
/**
* Extends {@link Game_CharacterBase.initMembers}.<br/>
* Includes this plugin's extra properties as well.
*/
J.PIXEL.Aliased.Game_CharacterBase.set("initMembers", Game_CharacterBase.prototype.initMembers);
Game_CharacterBase.prototype.initMembers = function() {
	J.PIXEL.Aliased.Game_CharacterBase.get("initMembers").call(this);
	this.initPixelMovementMembers();
};
/**
* Initializes the new members related to this plugin.
* Uses ??= so that pre-existing values on a loaded save are never overwritten,
* making this method safe to call defensively at any point.
*/
Game_CharacterBase.prototype.initPixelMovementMembers = function() {
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* The pixel movement namespace, scoped under _j to avoid collisions
	* with properties introduced by other plugins.
	*/
	this._j._pixel ||= {};
	/**
	* The collection for tracking the {@link Point} coordinates for all members.
	* This is managed in a first-in-first-out (FIFO) style.
	* @type {Point[]}
	*/
	this._j._pixel._positionalRecords ??= [];
	/**
	* Whether or not one of the directional inputs are being held down.
	* @type {boolean} True if at least one direction is being held, false otherwise.
	*/
	this._j._pixel._movePressing ??= false;
	/**
	* The move distance for tracking steps.
	* @type {number}
	*/
	this._j._pixel._moveDistance ??= 0;
	/**
	* The number of steps this character has taken.
	* @type {number}
	*/
	this._j._pixel._steps ??= 0;
	/**
	* Cooldown frames after a pixel move before another can be issued.
	* Prevents AllyAI from pushing every single frame.
	* @type {number}
	*/
	this._j._pixel._moveCooldown ??= 0;
	/**
	* Whether a pixel-route repeat is currently active for this character.
	* Used to repeat a single move-route command multiple times to cover the intended distance.
	* @type {boolean}
	*/
	this._j._pixel._repeatMoveActive ??= false;
	/**
	* How many remaining repeat-ticks are left for the current route command.
	* @type {number}
	*/
	this._j._pixel._repeatMoveCount ??= 0;
	/**
	* Flag indicating whether a pixel step occurred this frame.
	* Used to preserve walk animation even when render coords snap each update.
	* @type {boolean}
	*/
	this._j._pixel._movedThisFrame ??= false;
	/**
	* The cached direction for the micro-route (if any).
	* @type {number}
	*/
	this._j._pixel._mrDir ??= 0;
	/**
	* The remaining frames to apply the cached micro-route direction.
	* @type {number}
	*/
	this._j._pixel._mrFrames ??= 0;
};
/**
* Returns the pixel movement state namespace for this character.
* If the namespace is absent — for example when loading a save created before
* this plugin was installed — it is initialized on demand so that no individual
* getter or setter needs its own defensive guard.
* @returns {object} The `this._j._pixel` state object.
*/
Game_CharacterBase.prototype._pixelState = function() {
	if (!this._j || !this._j._pixel) {
		this.initPixelMovementMembers();
	}
	return this._j._pixel;
};
/**
* Gets the remaining cooldown frames before another pixel move can be issued.
* @returns {number} The remaining cooldown frames.
*/
Game_CharacterBase.prototype.getPixelMoveCooldown = function() {
	return this._pixelState()._moveCooldown;
};
/**
* Sets the remaining cooldown frames for pixel movement.
* @param {number} frames The number of frames to set for cooldown.
*/
Game_CharacterBase.prototype.setPixelMoveCooldown = function(frames) {
	this._pixelState()._moveCooldown = frames;
};
/**
* Gets whether or not a pixel-route command repeat is currently active.
* @returns {boolean} True if a repeat is ongoing, false otherwise.
*/
Game_CharacterBase.prototype.isRepeatMoveActive = function() {
	return this._pixelState()._repeatMoveActive === true;
};
/**
* Begins a pixel-route command repeat cycle.
*/
Game_CharacterBase.prototype.beginRepeatMove = function() {
	this._pixelState()._repeatMoveActive = true;
};
/**
* Ends the current pixel-route command repeat cycle.
*/
Game_CharacterBase.prototype.stopRepeatMove = function() {
	this._pixelState()._repeatMoveActive = false;
};
/**
* Gets how many repeat-ticks remain for the current route command.
* @returns {number} The remaining repeat count.
*/
Game_CharacterBase.prototype.getRepeatMoveCount = function() {
	return this._pixelState()._repeatMoveCount;
};
/**
* Sets the repeat-tick counter to a given number.
* @param {number} count The number of ticks to hold the current command.
*/
Game_CharacterBase.prototype.setRepeatMoveCount = function(count) {
	this._pixelState()._repeatMoveCount = count;
};
/**
* Decrements the repeat-tick counter by one.
*/
Game_CharacterBase.prototype.decrementRepeatMoveCount = function() {
	if (this.getRepeatMoveCount() > 0) {
		this.setRepeatMoveCount(this.getRepeatMoveCount() - 1);
	}
};
/**
* Gets the default repeat count for a single route command based on collision density.
* This ensures that scripted movement commands cover the full intended tile distance.
* @returns {number} The collision step count.
*/
Game_CharacterBase.prototype.pixelRepeatCountForRoute = function() {
	return Math.ceil(1 / this.distancePerFrame());
};
/**
* Decrements the pixel-move cooldown by one frame if applicable.
*/
Game_CharacterBase.prototype.decrementPixelMoveCooldown = function() {
	if (this.getPixelMoveCooldown() > 0) {
		this.setPixelMoveCooldown(this.getPixelMoveCooldown() - 1);
	}
};
/**
* Determines whether or not we are currently on a cooldown for pixel movement.
* @returns {boolean}
*/
Game_CharacterBase.prototype.isPixelOnCooldown = function() {
	return this.getPixelMoveCooldown() > 0;
};
/**
* Flags whether or not this character performed a pixel step this frame.
* @param {boolean=} moved Whether or not we moved this frame; defaults to true.
*/
Game_CharacterBase.prototype.setMovedThisFrame = function(moved = true) {
	this._pixelState()._movedThisFrame = moved;
};
/**
* Gets whether or not this character performed a pixel step this frame.
* @returns {boolean} True if we moved this frame, false otherwise.
*/
Game_CharacterBase.prototype.didMoveThisFrame = function() {
	return this._pixelState()._movedThisFrame === true;
};
/**
* Clears the per-frame pixel movement flag.
*/
Game_CharacterBase.prototype.clearMovedThisFrame = function() {
	this._pixelState()._movedThisFrame = false;
};
/**
* Gets the cached micro-route direction.
* @returns {number} The cached 8-dir code, or 0 if unset.
*/
Game_CharacterBase.prototype.getMicroRouteDirection = function() {
	return this._pixelState()._mrDir;
};
/**
* Sets the cached micro-route direction.
* @param {number} newDirection The 8-dir code to cache.
*/
Game_CharacterBase.prototype.setMicroRouteDirection = function(newDirection) {
	this._pixelState()._mrDir = newDirection;
};
/**
* Gets the remaining micro-route frames.
* @returns {number} The remaining frames for the cached direction.
*/
Game_CharacterBase.prototype.getMicroRouteFrames = function() {
	return this._pixelState()._mrFrames;
};
/**
* Sets the remaining micro-route frames to apply the cached direction.
* @param {number} frames The number of frames to hold the cached direction.
*/
Game_CharacterBase.prototype.setMicroRouteFrames = function(frames) {
	this._pixelState()._mrFrames = frames;
};
/**
* Decrements the remaining micro-route frames by one if applicable.
*/
Game_CharacterBase.prototype.decrementMicroRouteFrames = function() {
	if (this.getMicroRouteFrames() > 0) {
		this.setMicroRouteFrames(this.getMicroRouteFrames() - 1);
	}
};
/**
* Clears the cached micro-route direction and remaining frames.
*/
Game_CharacterBase.prototype.clearMicroRoute = function() {
	this.setMicroRouteDirection(0);
	this.setMicroRouteFrames(0);
};
/**
* Gets whether or not this character is currently following a cached micro-route.
* @returns {boolean} True if there are frames remaining, false otherwise.
*/
Game_CharacterBase.prototype.isMicroRouting = function() {
	return this.getMicroRouteFrames() > 0;
};
/**
* Gets the collection of positional records for this character.
* @returns {Point[]}
*/
Game_CharacterBase.prototype.positionalRecords = function() {
	return this._pixelState()._positionalRecords;
};
/**
* Clears the positional cache for characters on the map.
*/
Game_CharacterBase.prototype.clearPositionalRecords = function() {
	this._pixelState()._positionalRecords = [];
};
/**
* Adds a positional record to the collection and maintains the max collection size.
* @param {Point} positionalRecord A single positional record as a point.
*/
Game_CharacterBase.prototype.addPositionalRecord = function(positionalRecord) {
	const records = this.positionalRecords();
	records.push(positionalRecord);
	while (records.length > 10) {
		records.shift();
	}
};
/**
* Gets the first-added record from the collection of coordinate tracking.
* @returns {Point}
*/
Game_CharacterBase.prototype.oldestPositionalRecord = function() {
	const records = this.positionalRecords();
	if (records.length > 0) {
		return records.at(0);
	}
	return null;
};
/**
* Gets the last-added record from the collection of coordinate tracking.
* @returns {Point}
*/
Game_CharacterBase.prototype.mostRecentPositionalRecord = function() {
	const records = this.positionalRecords();
	if (records.length > 0) {
		return records.at(-1);
	}
	return null;
};
/**
* Extends {@link Game_CharacterBase.update}.<br/>
* Ensures render coordinates match logical coordinates and clears per-frame flags.
*/
J.PIXEL.Aliased.Game_CharacterBase.set("update", Game_CharacterBase.prototype.update);
Game_CharacterBase.prototype.update = function() {
	J.PIXEL.Aliased.Game_CharacterBase.get("update").call(this);
	if ((this._realX !== this._x || this._realY !== this._y) && !this.isJumping()) {
		this._realX = this._x;
		this._realY = this._y;
	}
	if (this.isPixelOnCooldown()) {
		this.decrementPixelMoveCooldown();
	}
	if (this.didMoveThisFrame()) {
		this.clearMovedThisFrame();
	}
};
/**
* Gets the move distance this character has moved.
* @returns {number}
*/
Game_CharacterBase.prototype.moveDistance = function() {
	return this._pixelState()._moveDistance;
};
/**
* Modifies the move distance by a given amount.
* @param {number} distance The distance in pixels.
*/
Game_CharacterBase.prototype.modMoveDistance = function(distance) {
	this._pixelState()._moveDistance += distance;
};
/**
* Gets how many pixel steps this character has taken.
* @returns {number}
*/
Game_CharacterBase.prototype.pixelSteps = function() {
	return this._pixelState()._steps;
};
/**
* Modifies the pixel step counter.
* @param {number=} steps The number of steps to take; defaults to 1.
*/
Game_CharacterBase.prototype.takePixelSteps = function(steps = 1) {
	this._pixelState()._steps += steps;
};
/**
* Clears the number of pixel steps taken by this character.
*/
Game_CharacterBase.prototype.clearPixelSteps = function() {
	this._pixelState()._steps = 0;
};
/**
* Checks if this character has moved far enough to be considered a "step".
*/
Game_CharacterBase.prototype.updatePixelStepping = function() {
	const tookStep = this.moveDistance() >= this.stepDistance();
	if (tookStep) {
		this.onStep();
		this.clearMoveDistance();
	}
};
/**
* Resets the move distance for this character.
*/
Game_CharacterBase.prototype.clearMoveDistance = function() {
	this._pixelState()._moveDistance = 0;
};
/**
* Extends {@link Game_CharacterBase.isMoving}.<br/>
* Includes whether or not a pixel movement occurred this frame.
* @returns {boolean}
*/
J.PIXEL.Aliased.Game_CharacterBase.set("isMoving", Game_CharacterBase.prototype.isMoving);
Game_CharacterBase.prototype.isMoving = function() {
	const original = J.PIXEL.Aliased.Game_CharacterBase.get("isMoving").call(this);
	const movedThisFrame = this.didMoveThisFrame();
	return original || movedThisFrame;
};
/**
* Gets whether or not the move input is being pressed.
* @returns {boolean}
*/
Game_CharacterBase.prototype.isMovePressed = function() {
	return this._pixelState()._movePressing;
};
/**
* Sets whether or not the move input is being held down.
* @param {boolean} pressed The new value of whether or not the button is being pressed.
*/
Game_CharacterBase.prototype.setMovePressed = function(pressed) {
	this._pixelState()._movePressing = pressed;
};
/**
* Adds a hook for performing actions when this character takes a step.
*/
Game_CharacterBase.prototype.onStep = function() {
	this.takePixelSteps(1);
};
/**
* Gets the distance that it takes to travel to achieve one step.
* @returns {number}
*/
Game_CharacterBase.prototype.stepDistance = function() {
	return 1;
};
/**
* Records this character's current fractional position into the breadcrumb trail.
* Keeps a rolling window of the last 10 positions for follower-train chasing.
* Flushes the cache when the player teleports (delta > 2 tiles).
*/
Game_CharacterBase.prototype.recordPixelPosition = function() {
	const last = this.mostRecentPositionalRecord();
	const deltaDistance = last === null ? 0 : $gameMap.distance(last.x, last.y, this.x, this.y);
	if (deltaDistance > 2) {
		this.clearPositionalRecords();
	} else if (last === null || deltaDistance > .1) {
		const point = {
			x: this.x,
			y: this.y
		};
		this.addPositionalRecord(point);
	}
};
/**
* Forcefully relocates this character to a different set of coordinates.
* @param {number} x The x coordinate.
* @param {number} y The y coordinate.
*/
Game_CharacterBase.prototype.relocate = function(x, y) {
	this._x = x;
	this._y = y;
	this._realX = x;
	this._realY = y;
	this._stopCount = 0;
};
/**
* Enables the "pixel moving" state and updates pixel position.
*/
Game_CharacterBase.prototype.startPixelMoving = function() {
	this.setMovePressed(true);
	this.recordPixelPosition();
};
/**
* Disables the "pixel moving" state and updates pixel position.
*/
Game_CharacterBase.prototype.stopPixelMoving = function() {
	this.setMovePressed(false);
	this._realX = this._x;
	this._realY = this._y;
	this.recordPixelPosition();
};
/**
* Determine the distance per frame when moving diagonally.
* It is reduced thanks to the power of math.
* @returns {number} The distance in pixels to move.
*/
Game_CharacterBase.prototype.diagonalDistancePerFrame = function() {
	return this.distancePerFrame() * Math.SQRT1_2;
};
/**
* Moves this character in the given direction a given distance in pixels.
*
* This is used in tandem with movement control and not intended to move characters otherwise.
* @param {1|2|3|4|6|7|8|9} direction The direction to move.
* @param {number} distance The number of pixels to move.
*/
Game_CharacterBase.prototype.movePixelDistance = function(direction, distance) {
	const prevX = this._x;
	const prevY = this._y;
	const isStraight = this.isStraightDirection(direction);
	const isDiagonal = this.isDiagonalDirection(direction);
	if (isStraight) {
		this.moveStraightDistance(direction, distance);
	} else if (isDiagonal) {
		this.moveDiagonalDistance(direction, distance);
	}
	const radius = this.getEffectiveRadius();
	if (this.isThrough() === false && this.isDebugThrough() === false && this.isOverlappingSolidTiles(this._x + this.getCollisionPivotX(), this._y + this.getCollisionPivotY(), radius)) {
		this._x = prevX;
		this._y = prevY;
		this._realX = this._x;
		this._realY = this._y;
		this.setMovementSuccess(false);
		return;
	}
	this.setMovedThisFrame(true);
	this._realX = this._x;
	this._realY = this._y;
	this.modMoveDistance(distance);
	this.updatePixelStepping();
};
/**
* Moves this character one of the four cardinal directions a given distance in pixels.
* @param {2|4|6|8} direction The straight direction to move.
* @param {number} pixelDistance The number of pixels to move in that direction.
*/
Game_CharacterBase.prototype.moveStraightDistance = function(direction, pixelDistance) {
	switch (direction) {
		case J.PIXEL.Directions.DOWN:
			this.moveStraight2Down(pixelDistance);
			break;
		case J.PIXEL.Directions.LEFT:
			this.moveStraight4Left(pixelDistance);
			break;
		case J.PIXEL.Directions.RIGHT:
			this.moveStraight6Right(pixelDistance);
			break;
		case J.PIXEL.Directions.UP:
			this.moveStraight8Up(pixelDistance);
			break;
		default:
			console.warn("attempted to move an invalid straight direction: ", direction);
			break;
	}
};
/**
* Moves this character one one of the four cardinal directions.
* @param {1|3|7|9} direction The straight direction to move.
* @param {number} pixelDistance The number of pixels to move in that direction.
*/
Game_CharacterBase.prototype.moveDiagonalDistance = function(direction, pixelDistance) {
	switch (direction) {
		case J.PIXEL.Directions.LOWERLEFT:
			this.moveDiagonal1DownLeft(pixelDistance);
			break;
		case J.PIXEL.Directions.LOWERRIGHT:
			this.moveDiagonal3DownRight(pixelDistance);
			break;
		case J.PIXEL.Directions.UPPERLEFT:
			this.moveDiagonal7UpLeft(pixelDistance);
			break;
		case J.PIXEL.Directions.UPPERRIGHT:
			this.moveDiagonal9UpRight(pixelDistance);
			break;
		default:
			console.warn("attempted to move an invalid diagonal direction: ", direction);
			break;
	}
};
/**
* Move straight down the given distance.
* @param {number} pixelDistance The distance in pixels.
*/
Game_CharacterBase.prototype.moveStraight2Down = function(pixelDistance) {
	this._y += pixelDistance;
};
/**
* Move straight left the given distance.
* @param {number} pixelDistance The distance in pixels.
*/
Game_CharacterBase.prototype.moveStraight4Left = function(pixelDistance) {
	this._x -= pixelDistance;
};
/**
* Move straight right the given distance.
* @param {number} pixelDistance The distance in pixels.
*/
Game_CharacterBase.prototype.moveStraight6Right = function(pixelDistance) {
	this._x += pixelDistance;
};
/**
* Move straight up the given distance.
* @param {number} pixelDistance The distance in pixels.
*/
Game_CharacterBase.prototype.moveStraight8Up = function(pixelDistance) {
	this._y -= pixelDistance;
};
/**
* Move diagonally down-left the given distance.
* @param {number} pixelDistance The distance in pixels.
*/
Game_CharacterBase.prototype.moveDiagonal1DownLeft = function(pixelDistance) {
	this._x -= pixelDistance;
	this._y += pixelDistance;
};
/**
* Move diagonally down-right the given distance.
* @param {number} pixelDistance The distance in pixels.
*/
Game_CharacterBase.prototype.moveDiagonal3DownRight = function(pixelDistance) {
	this._x += pixelDistance;
	this._y += pixelDistance;
};
/**
* Move diagonally up-left the given distance.
* @param {number} pixelDistance The distance in pixels.
*/
Game_CharacterBase.prototype.moveDiagonal7UpLeft = function(pixelDistance) {
	this._x -= pixelDistance;
	this._y -= pixelDistance;
};
/**
* Move diagonally up-right the given distance.
* @param {number} pixelDistance The distance in pixels.
*/
Game_CharacterBase.prototype.moveDiagonal9UpRight = function(pixelDistance) {
	this._x += pixelDistance;
	this._y -= pixelDistance;
};
/**
* Determines whether or not this character can pass in the given straight direction.
* Substeps the probe at collision subgrid resolution to avoid skipping edges, then
* uses your edge-subgrid checks per substep. Character AABB collisions are checked
* only at the final landing point.
*
* @param {2|4|6|8} direction The cardinal direction being moved.
* @param {number} distance The distance to move (in tiles, fractional).
* @returns {boolean} True if movement is permitted this frame, false otherwise.
*/
Game_CharacterBase.prototype.canPassStraight = function(direction, distance = this.distancePerFrame()) {
	const x0 = this._x;
	const y0 = this._y;
	if (this.isThrough() || this.isDebugThrough()) {
		return true;
	}
	const subCount = this._pixelCollisionSubCount();
	const radius = this.getEffectiveRadius();
	const hitbox = this._pixelHitbox(radius);
	const subStepSize = 1 / subCount;
	let dx = 0;
	let dy = 0;
	if (direction === J.PIXEL.Directions.RIGHT) {
		dx = 1;
	} else if (direction === J.PIXEL.Directions.LEFT) {
		dx = -1;
	} else if (direction === J.PIXEL.Directions.DOWN) {
		dy = 1;
	} else if (direction === J.PIXEL.Directions.UP) {
		dy = -1;
	} else {
		return false;
	}
	const maxStep = subStepSize;
	const steps = Math.max(1, Math.ceil(distance / maxStep));
	const stepSize = distance / steps;
	let probeX = x0;
	let probeY = y0;
	for (let i = 0; i < steps; i++) {
		const x1 = probeX + dx * stepSize;
		const y1 = probeY + dy * stepSize;
		if (dx !== 0) {
			if (dx < 0) {
				if (this._pixelCheckLeftPassage(probeX, probeY, x1, hitbox, subCount) === false) return false;
				if (this._pixelCheckRightPassage(x1, probeY, probeX, hitbox, subCount) === false) return false;
				if (this._pixelCheckVerticalAtNewXColumn(probeX, x1, probeY, hitbox, subCount) === false) return false;
			} else {
				if (this._pixelCheckRightPassage(probeX, probeY, x1, hitbox, subCount) === false) return false;
				if (this._pixelCheckLeftPassage(x1, probeY, probeX, hitbox, subCount) === false) return false;
				if (this._pixelCheckVerticalAtNewXColumn(probeX, x1, probeY, hitbox, subCount) === false) return false;
			}
		}
		if (dy !== 0) {
			if (dy < 0) {
				if (this._pixelCheckUpPassage(probeX, probeY, y1, hitbox, subCount) === false) return false;
				if (this._pixelCheckDownPassage(probeX, y1, probeY, hitbox, subCount) === false) return false;
				if (this._pixelCheckHorizontalAtNewYRow(probeY, y1, probeX, hitbox, subCount) === false) return false;
			} else {
				if (this._pixelCheckDownPassage(probeX, probeY, y1, hitbox, subCount) === false) return false;
				if (this._pixelCheckUpPassage(probeX, y1, probeY, hitbox, subCount) === false) return false;
				if (this._pixelCheckHorizontalAtNewYRow(probeY, y1, probeX, hitbox, subCount) === false) return false;
			}
		}
		probeX = x1;
		probeY = y1;
	}
	if (this.isThrough() === false && this.isDebugThrough() === false && this.isOverlappingSolidTiles(probeX + this.getCollisionPivotX(), probeY + this.getCollisionPivotY(), radius)) {
		return false;
	}
	const characterBlocked = this.isCharacterCollisionAt(probeX, probeY, radius);
	return characterBlocked === false;
};
/**
* Checks if the character's AABB at the given position would overlap any "solid wall" tiles.
* A "solid wall" tile is defined here as out-of-bounds or a tile that is not passable in
* any cardinal direction (2/4/6/8). This prevents slipping into impassable terrain corners
* while allowing wall sliding that the edge-lane rule enables.
* @param {number} px The proposed x center in tile units (fractional).
* @param {number} py The proposed y center in tile units (fractional).
* @param {number} radius The half-size of the square AABB in tiles.
* @returns {boolean} True if any overlapped tile is solid, false otherwise.
*/
Game_CharacterBase.prototype.isOverlappingSolidTiles = function(px, py, radius) {
	const eps = 1e-6;
	const minCol = Math.floor(px - radius + eps);
	const maxCol = Math.floor(px + radius - eps);
	const minRow = Math.floor(py - radius + eps);
	const maxRow = Math.floor(py + radius - eps);
	for (let ty = minRow; ty <= maxRow; ty++) {
		for (let tx = minCol; tx <= maxCol; tx++) {
			if ($gameMap.isValid(tx, ty) === false) {
				return true;
			}
			const anyPass = $gameMap.isPassable(tx, ty, J.PIXEL.Directions.DOWN) || $gameMap.isPassable(tx, ty, J.PIXEL.Directions.LEFT) || $gameMap.isPassable(tx, ty, J.PIXEL.Directions.RIGHT) || $gameMap.isPassable(tx, ty, J.PIXEL.Directions.UP);
			if (anyPass === false) {
				return true;
			}
		}
	}
	return false;
};
/**
* Extends {@link Game_CharacterBase.canPass}.<br/>
* Rounds fractional pixel coordinates to the nearest tile integer before delegating
* to the tile-based passability check. With pixel movement, `_x`/`_y` are fractional;
* the base RMMZ method uses them as array indices, so non-integer inputs produce
* incorrect results without this normalization.
* @param {number} x The x tile coordinate (may be fractional with pixel movement).
* @param {number} y The y tile coordinate (may be fractional with pixel movement).
* @param {2|4|6|8} d The direction to check passage toward.
* @returns {boolean} Whether passage is allowed from the nearest tile in direction d.
*/
J.PIXEL.Aliased.Game_CharacterBase.set("canPass", Game_CharacterBase.prototype.canPass);
Game_CharacterBase.prototype.canPass = function(x, y, d) {
	return J.PIXEL.Aliased.Game_CharacterBase.get("canPass").call(this, Math.round(x), Math.round(y), d);
};
/**
* Extends {@link Game_CharacterBase#regionId}.<br/>
* Samples the map region at the character's collision pivot tile. With pixel movement,
* `_x`/`_y` are fractional; vanilla forwards them into {@link Game_Map#tileId}, which
* indexes `$dataMap.data` and returns wrong regions when coordinates are not integers.
* @returns {number} The region id at the pivot tile.
*/
J.PIXEL.Aliased.Game_CharacterBase.set("regionId", Game_CharacterBase.prototype.regionId);
Game_CharacterBase.prototype.regionId = function() {
	const tileX = Math.floor(this._x + this.getCollisionPivotX());
	const tileY = Math.floor(this._y + this.getCollisionPivotY());
	return $gameMap.regionId(tileX, tileY);
};
/**
* Moves straight in a given direction.
* If there is an underlying diagonal direction, then move diagonally.
* @param {number} direction The direction being moved.
*/
J.PIXEL.Aliased.Game_CharacterBase.set("moveStraight", Game_CharacterBase.prototype.moveStraight);
Game_CharacterBase.prototype.moveStraight = function(direction) {
	this.setMovementSuccess(this.canPassStraight(direction));
	this.setDirection(direction);
	if (this.isMovementSucceeded()) {
		this.movePixelDistance(direction, this.distancePerFrame());
	} else {
		this.checkEventTriggerTouchFront(direction);
	}
};
/**
* Extends {@link Game_CharacterBase.moveDiagonally}.<br/>
* Evaluates pixel-aware diagonal passability and executes pixel-distance movement.
* Direction is updated unconditionally (matching rmmz default behavior) so that
* a blocked diagonal step still rotates the character away from a wall.
* @param {4|6} horz The horizontal component direction (4=left, 6=right).
* @param {2|8} vert The vertical component direction (2=down, 8=up).
*/
J.PIXEL.Aliased.Game_CharacterBase.set("moveDiagonally", Game_CharacterBase.prototype.moveDiagonally);
Game_CharacterBase.prototype.moveDiagonally = function(horz, vert) {
	this.setMovementSuccess(this.canPassDiagonally(this._x, this._y, horz, vert));
	if (this.isMovementSucceeded()) {
		const direction = this.directionFromHorzVert(horz, vert);
		this.movePixelDistance(direction, this.diagonalDistancePerFrame());
		this.setDirection(direction);
	}
	if (this._direction === this.reverseDir(horz)) {
		this.setDirection(horz);
	}
	if (this._direction === this.reverseDir(vert)) {
		this.setDirection(vert);
	}
};
/**
* Executes pixel movement in the given direction if possible.
* This also returns the cardinal-normalized direction that should be faced.
*
* Notes:
* - This version removes all “offset lane” probes. canPassStraight no longer
*   accepts a perpendicular offset, so legacy offset-driven logic has been
*   eliminated to prevent biased early/late decisions that felt like “+0.5”.
* - Snapping is now epsilon-based around the orthogonal axis after a straight
*   move to avoid jitter without over-snapping.
* @param {2|4|6|8|1|3|7|9} direction The desired direction to be moved.
* @returns {number} The cardinal-normalized direction to face while moving.
*/
Game_CharacterBase.prototype.pixelMoveByInput = function(direction) {
	let innerDirection = direction;
	const straightDistance = this.distancePerFrame();
	const diagonalDistance = this.diagonalDistancePerFrame();
	const canDown = () => this.canPassStraight(J.PIXEL.Directions.DOWN, straightDistance);
	const canUp = () => this.canPassStraight(J.PIXEL.Directions.UP, straightDistance);
	const canLeft = () => this.canPassStraight(J.PIXEL.Directions.LEFT, straightDistance);
	const canRight = () => this.canPassStraight(J.PIXEL.Directions.RIGHT, straightDistance);
	const roundX = Math.round(this._x);
	const roundY = Math.round(this._y);
	const SNAP_EPSILON = .1;
	const tryDiagonal = (diagDir) => {
		if (this.canPassDiagonalByDirection(diagDir) === false) {
			return 0;
		}
		this.setMovementSuccess(true);
		this.movePixelDistance(diagDir, diagonalDistance);
		switch (diagDir) {
			case J.PIXEL.Directions.LOWERLEFT:
			case J.PIXEL.Directions.LOWERRIGHT: {
				this.setDirection(J.PIXEL.Directions.DOWN);
				return J.PIXEL.Directions.DOWN;
			}
			case J.PIXEL.Directions.UPPERLEFT:
			case J.PIXEL.Directions.UPPERRIGHT: {
				this.setDirection(J.PIXEL.Directions.UP);
				return J.PIXEL.Directions.UP;
			}
		}
		return 0;
	};
	const diagonalFallback = (preferHorzDir, preferVertDir, chooseHorizontalPredicate) => {
		if (chooseHorizontalPredicate()) {
			return this.pixelMoveByInput(preferHorzDir);
		} else {
			return this.pixelMoveByInput(preferVertDir);
		}
	};
	const recenterXAfterVertical = () => {
		if (Math.abs(this._x - roundX) <= SNAP_EPSILON) {
			this._x = roundX;
		}
	};
	const recenterYAfterHorizontal = () => {
		if (Math.abs(this._y - roundY) <= SNAP_EPSILON) {
			this._y = roundY;
		}
	};
	const doStraightMove = (cardinalDir) => {
		this.setMovementSuccess(true);
		this.movePixelDistance(cardinalDir, straightDistance);
		switch (cardinalDir) {
			case J.PIXEL.Directions.DOWN:
			case J.PIXEL.Directions.UP: {
				recenterXAfterVertical();
				break;
			}
			case J.PIXEL.Directions.LEFT:
			case J.PIXEL.Directions.RIGHT: {
				recenterYAfterHorizontal();
				break;
			}
		}
		this.setDirection(cardinalDir);
		return cardinalDir;
	};
	const handleDiagonal = (diagDir) => {
		switch (diagDir) {
			case J.PIXEL.Directions.LOWERLEFT: {
				if (canLeft() && canDown()) {
					const faced = tryDiagonal(J.PIXEL.Directions.LOWERLEFT);
					if (faced > 0) return faced;
					return diagonalFallback(J.PIXEL.Directions.LEFT, J.PIXEL.Directions.DOWN, () => this.x - roundX < roundY - this.y);
				}
				if (canLeft()) return this.pixelMoveByInput(J.PIXEL.Directions.LEFT);
				if (canDown()) return this.pixelMoveByInput(J.PIXEL.Directions.DOWN);
				innerDirection = J.PIXEL.Directions.DOWN;
				return innerDirection;
			}
			case J.PIXEL.Directions.LOWERRIGHT: {
				if (canRight() && canDown()) {
					const faced = tryDiagonal(J.PIXEL.Directions.LOWERRIGHT);
					if (faced > 0) return faced;
					return diagonalFallback(J.PIXEL.Directions.RIGHT, J.PIXEL.Directions.DOWN, () => roundX - this.x < roundY - this.y);
				}
				if (canRight()) return this.pixelMoveByInput(J.PIXEL.Directions.RIGHT);
				if (canDown()) return this.pixelMoveByInput(J.PIXEL.Directions.DOWN);
				innerDirection = J.PIXEL.Directions.DOWN;
				return innerDirection;
			}
			case J.PIXEL.Directions.UPPERLEFT: {
				if (canLeft() && canUp()) {
					const faced = tryDiagonal(J.PIXEL.Directions.UPPERLEFT);
					if (faced > 0) return faced;
					return diagonalFallback(J.PIXEL.Directions.LEFT, J.PIXEL.Directions.UP, () => this.x - roundX < this.y - roundY);
				}
				if (canLeft()) return this.pixelMoveByInput(J.PIXEL.Directions.LEFT);
				if (canUp()) return this.pixelMoveByInput(J.PIXEL.Directions.UP);
				innerDirection = J.PIXEL.Directions.UP;
				return innerDirection;
			}
			case J.PIXEL.Directions.UPPERRIGHT: {
				if (canRight() && canUp()) {
					const faced = tryDiagonal(J.PIXEL.Directions.UPPERRIGHT);
					if (faced > 0) return faced;
					return diagonalFallback(J.PIXEL.Directions.RIGHT, J.PIXEL.Directions.UP, () => roundX - this.x < this.y - roundY);
				}
				if (canRight()) return this.pixelMoveByInput(J.PIXEL.Directions.RIGHT);
				if (canUp()) return this.pixelMoveByInput(J.PIXEL.Directions.UP);
				innerDirection = J.PIXEL.Directions.UP;
				return innerDirection;
			}
			default: {
				return 0;
			}
		}
	};
	const tryWallSlide = (blockedDir) => {
		const isHorizontal = blockedDir === J.PIXEL.Directions.LEFT || blockedDir === J.PIXEL.Directions.RIGHT;
		const radius = this.getEffectiveRadius();
		if (isHorizontal) {
			const targetY = Math.round(this._y);
			const residual = targetY - this._y;
			if (Math.abs(residual) < .001) return 0;
			const nudge = Math.sign(residual) * Math.min(Math.abs(residual), straightDistance);
			const nudgedY = this._y + nudge;
			if (this.isOverlappingSolidTiles(this._x + this.getCollisionPivotX(), nudgedY + this.getCollisionPivotY(), radius)) {
				return 0;
			}
			this._y = nudgedY;
			this._realY = this._y;
			if (this.canPassStraight(blockedDir, straightDistance)) {
				return doStraightMove(blockedDir);
			}
			this.setMovedThisFrame(true);
			return 0;
		} else {
			const targetX = Math.round(this._x);
			const residual = targetX - this._x;
			if (Math.abs(residual) < .001) return 0;
			const nudge = Math.sign(residual) * Math.min(Math.abs(residual), straightDistance);
			const nudgedX = this._x + nudge;
			if (this.isOverlappingSolidTiles(nudgedX + this.getCollisionPivotX(), this._y + this.getCollisionPivotY(), radius)) {
				return 0;
			}
			this._x = nudgedX;
			this._realX = this._x;
			if (this.canPassStraight(blockedDir, straightDistance)) {
				return doStraightMove(blockedDir);
			}
			this.setMovedThisFrame(true);
			return 0;
		}
	};
	const handleStraight = (cardinalDir) => {
		switch (cardinalDir) {
			case J.PIXEL.Directions.DOWN: {
				if (canDown()) return doStraightMove(J.PIXEL.Directions.DOWN);
				return tryWallSlide(J.PIXEL.Directions.DOWN);
			}
			case J.PIXEL.Directions.UP: {
				if (canUp()) return doStraightMove(J.PIXEL.Directions.UP);
				return tryWallSlide(J.PIXEL.Directions.UP);
			}
			case J.PIXEL.Directions.LEFT: {
				if (canLeft()) return doStraightMove(J.PIXEL.Directions.LEFT);
				return tryWallSlide(J.PIXEL.Directions.LEFT);
			}
			case J.PIXEL.Directions.RIGHT: {
				if (canRight()) return doStraightMove(J.PIXEL.Directions.RIGHT);
				return tryWallSlide(J.PIXEL.Directions.RIGHT);
			}
			default: {
				return 0;
			}
		}
	};
	if (this.isDiagonalDirection(direction)) {
		const faced = handleDiagonal(direction);
		if (faced > 0) return faced;
	}
	if (this.isStraightDirection(direction)) {
		const faced = handleStraight(direction);
		if (faced > 0) return faced;
	}
	return innerDirection;
};
/**
* Overwrites {@link Game_CharacterBase.canPassDiagonally} with Cyclone-like semantics.
* Requires both legs at current, re-validates at new X and at new Y, validates reverse
* at destination, and rejects if a character occupies the diagonal landing point.
* @param {number} x The current x.
* @param {number} y The current y.
* @param {4|6} horz The horizontal leg.
* @param {2|8} vert The vertical leg.
* @returns {boolean} True if diagonal is permitted.
*/
Game_CharacterBase.prototype.canPassDiagonally = function(x, y, horz, vert) {
	const oldX = this._x;
	const oldY = this._y;
	this._x = x;
	this._y = y;
	if (this.isThrough() || this.isDebugThrough()) {
		this._x = oldX;
		this._y = oldY;
		return true;
	}
	const straightStep = this.distancePerFrame();
	const diagStep = this.diagonalDistancePerFrame();
	const radius = this.getEffectiveRadius();
	const hitbox = this._pixelHitbox(radius);
	const subCount = this._pixelCollisionSubCount();
	let nx = this._x;
	let ny = this._y;
	if (horz === J.PIXEL.Directions.RIGHT) {
		nx = this._x + diagStep;
	} else if (horz === J.PIXEL.Directions.LEFT) {
		nx = this._x - diagStep;
	}
	if (vert === J.PIXEL.Directions.DOWN) {
		ny = this._y + diagStep;
	} else if (vert === J.PIXEL.Directions.UP) {
		ny = this._y - diagStep;
	}
	if ($gameMap.isValid(nx, ny) === false) {
		this._x = oldX;
		this._y = oldY;
		return false;
	}
	if (horz === J.PIXEL.Directions.LEFT) {
		if (this._pixelCheckLeftPassage(this._x, this._y, this._x - straightStep, hitbox, subCount) === false) {
			this._x = oldX;
			this._y = oldY;
			return false;
		}
	} else {
		if (this._pixelCheckRightPassage(this._x, this._y, this._x + straightStep, hitbox, subCount) === false) {
			this._x = oldX;
			this._y = oldY;
			return false;
		}
	}
	if (vert === J.PIXEL.Directions.UP) {
		if (this._pixelCheckUpPassage(this._x, this._y, this._y - straightStep, hitbox, subCount) === false) {
			this._x = oldX;
			this._y = oldY;
			return false;
		}
	} else {
		if (this._pixelCheckDownPassage(this._x, this._y, this._y + straightStep, hitbox, subCount) === false) {
			this._x = oldX;
			this._y = oldY;
			return false;
		}
	}
	let y2 = this._y;
	if (vert === J.PIXEL.Directions.DOWN) {
		y2 = this._y + straightStep;
	} else if (vert === J.PIXEL.Directions.UP) {
		y2 = this._y - straightStep;
	}
	if (horz === J.PIXEL.Directions.LEFT) {
		if (this._pixelCheckLeftPassage(this._x, y2, this._x - straightStep, hitbox, subCount) === false) {
			this._x = oldX;
			this._y = oldY;
			return false;
		}
	} else {
		if (this._pixelCheckRightPassage(this._x, y2, this._x + straightStep, hitbox, subCount) === false) {
			this._x = oldX;
			this._y = oldY;
			return false;
		}
	}
	let x2 = this._x;
	if (horz === J.PIXEL.Directions.RIGHT) {
		x2 = this._x + straightStep;
	} else if (horz === J.PIXEL.Directions.LEFT) {
		x2 = this._x - straightStep;
	}
	if (vert === J.PIXEL.Directions.UP) {
		if (this._pixelCheckUpPassage(x2, this._y, this._y - straightStep, hitbox, subCount) === false) {
			this._x = oldX;
			this._y = oldY;
			return false;
		}
	} else {
		if (this._pixelCheckDownPassage(x2, this._y, this._y + straightStep, hitbox, subCount) === false) {
			this._x = oldX;
			this._y = oldY;
			return false;
		}
	}
	if (horz === J.PIXEL.Directions.LEFT) {
		if (this._pixelCheckRightPassage(nx, ny, nx + straightStep, hitbox, subCount) === false) {
			this._x = oldX;
			this._y = oldY;
			return false;
		}
	} else {
		if (this._pixelCheckLeftPassage(nx, ny, nx - straightStep, hitbox, subCount) === false) {
			this._x = oldX;
			this._y = oldY;
			return false;
		}
	}
	if (vert === J.PIXEL.Directions.UP) {
		if (this._pixelCheckDownPassage(nx, ny, ny + straightStep, hitbox, subCount) === false) {
			this._x = oldX;
			this._y = oldY;
			return false;
		}
	} else {
		if (this._pixelCheckUpPassage(nx, ny, ny - straightStep, hitbox, subCount) === false) {
			this._x = oldX;
			this._y = oldY;
			return false;
		}
	}
	const blocked = this.isCharacterCollisionAt(nx, ny, radius);
	this._x = oldX;
	this._y = oldY;
	return blocked === false;
};
/**
* Determines whether or not a diagonal by its 8-dir code is passable for the next frame.
* Requires both component straight legs to be passable using the tile-centered straight check,
* then rejects if a character-vs-character AABB would collide at the diagonal landing point.
* No lateral offset columns or lane sampling.
* @param {1|3|7|9} diagonalDir The diagonal direction (1,3,7,9).
* @param {number=} straightDistance Optional straight distance per frame to probe with.
* @returns {boolean} True if the diagonal can be taken this frame, false otherwise.
*/
Game_CharacterBase.prototype.canPassDiagonalByDirection = function(diagonalDir, straightDistance = this.distancePerFrame()) {
	const canDown = () => this.canPassStraight(J.PIXEL.Directions.DOWN, straightDistance);
	const canUp = () => this.canPassStraight(J.PIXEL.Directions.UP, straightDistance);
	const canLeft = () => this.canPassStraight(J.PIXEL.Directions.LEFT, straightDistance);
	const canRight = () => this.canPassStraight(J.PIXEL.Directions.RIGHT, straightDistance);
	let legsOk = false;
	if (diagonalDir === J.PIXEL.Directions.LOWERLEFT) legsOk = canLeft() && canDown();
	if (diagonalDir === J.PIXEL.Directions.LOWERRIGHT) legsOk = canRight() && canDown();
	if (diagonalDir === J.PIXEL.Directions.UPPERLEFT) legsOk = canLeft() && canUp();
	if (diagonalDir === J.PIXEL.Directions.UPPERRIGHT) legsOk = canRight() && canUp();
	if (legsOk === false) return false;
	const step = this.diagonalDistancePerFrame();
	let nx = this._x;
	let ny = this._y;
	if (diagonalDir === J.PIXEL.Directions.LOWERLEFT) {
		nx -= step;
		ny += step;
	}
	if (diagonalDir === J.PIXEL.Directions.LOWERRIGHT) {
		nx += step;
		ny += step;
	}
	if (diagonalDir === J.PIXEL.Directions.UPPERLEFT) {
		nx -= step;
		ny -= step;
	}
	if (diagonalDir === J.PIXEL.Directions.UPPERRIGHT) {
		nx += step;
		ny -= step;
	}
	const radius = this.getEffectiveRadius();
	return this.isCharacterCollisionAt(nx, ny, radius) === false;
};
/**
* Checks for a collision against other solid characters at a fractional point.
* Uses simple AABB (square) overlap in tile space for stable, flat boundaries.
* Party members (player and followers) never block each other.
* Only events with normal priority ("Same as characters") are considered blockers.
* @param {number} px Proposed x (fractional tiles).
* @param {number} py Proposed y (fractional tiles).
* @param {number=} radius Optional collision half-size in tiles (default 0.35).
* @returns {boolean} True if any solid character would collide at (px, py).
*/
Game_CharacterBase.prototype.isCharacterCollisionAt = function(px, py, radius = .35) {
	const player = $gamePlayer;
	const followers = player._followers._data;
	const party = [player].concat(followers);
	const selfIsParty = party.includes(this);
	const events = $gameMap.events();
	const candidates = [];
	events.forEach((ev) => {
		if (ev === this) return;
		if (ev.isErased()) return;
		if (ev.isThrough()) return;
		if (ev.isNormalPriority() === false) return;
		if (J.ABS && ev.isJabsAction()) return;
		candidates.push(ev);
	});
	if (selfIsParty === false) {
		if (player !== this && player.isThrough() === false) {
			candidates.push(player);
		}
		followers.forEach((f) => {
			if (f === this) return;
			if (f.isThrough()) return;
			candidates.push(f);
		});
	}
	const aabbOverlap = function(ax, ay, ahw, ahh, bx, by, bhw, bhh) {
		const dx = Math.abs(ax - bx);
		const dy = Math.abs(ay - by);
		return dx < ahw + bhw && dy < ahh + bhh;
	};
	for (let i = 0; i < candidates.length; i++) {
		const ch = candidates[i];
		if (J.ABS && ch.isJabsAction()) {
			continue;
		}
		const cx = ch.x;
		const cy = ch.y;
		const cr = ch.getEffectiveRadius();
		if (aabbOverlap(px, py, radius, radius, cx, cy, cr, cr)) {
			return true;
		}
	}
	return false;
};
/**
* Gets the collision radius for this character in tile units.
* This radius is used for pixel-accurate character-vs-character collision checks.
* @returns {number} The collision radius in tiles.
*/
Game_CharacterBase.prototype.getCollisionRadius = function() {
	return .3;
};
/**
* Gets the effective collision radius, clamped so the hitbox never extends past the
* tile boundary below the character. Enforces the invariant:
*   pivotY + effectiveRadius < 1.0
* This prevents the hitbox from bleeding into the tile below, which would cause false
* solid-overlap detections against deny-region tiles and similar boundary conditions.
* @returns {number} The clamped collision radius in tile units.
*/
Game_CharacterBase.prototype.getEffectiveRadius = function() {
	const maxRadius = 1 - this.getCollisionPivotY() - 1e-6;
	return Math.min(this.getCollisionRadius(), maxRadius);
};
/**
* Gets the collision pivot X in tile units for this character.
* The pivot offsets the hitbox center from the character's logical `_x` coordinate.
* A value of 0.5 places the hitbox at the horizontal center of the sprite tile.
* @returns {number} The X pivot offset in tile units.
*/
Game_CharacterBase.prototype.getCollisionPivotX = function() {
	return .5;
};
/**
* Gets the collision pivot Y in tile units for this character.
* The pivot offsets the hitbox center from the character's logical `_y` coordinate.
* A value of 0.5 centers the hitbox on the character's tile, giving symmetric collision
* margins on all four sides and eliminating the half-tile early-block from below/right.
* @returns {number} The Y pivot offset in tile units.
*/
Game_CharacterBase.prototype.getCollisionPivotY = function() {
	return .5;
};
/**
* Computes a square hitbox derived from the configured collision radius.
* The hitbox is centered on the collision pivot on both axes, matching the player’s
* visual center to eliminate perceived half-tile skew.
* @param {number} radius The collision half-size in tiles.
* @returns {{w:number,h:number,hx:number,hy:number}}
*/
Game_CharacterBase.prototype._pixelHitbox = function(radius) {
	const half = radius;
	const width = half * 2;
	const height = half * 2;
	return {
		w: width,
		h: height,
		hx: -half,
		hy: -half
	};
};
/**
* Returns the collision subgrid resolution from the plugin metadata.
* @returns {number} The collision subgrid count.
*/
Game_CharacterBase.prototype._pixelCollisionSubCount = function() {
	if (PIXEL_CollisionManager.collisionStepCount === undefined) {
		PIXEL_CollisionManager.initConfig();
	}
	return PIXEL_CollisionManager.collisionStepCount;
};
/**
* Determines passability at a fractional subcell against the PIXEL collision table.
* Expects coordinates already in the collision-table’s integer-aligned space
* (seam-aligned), which are produced by the first/last collision helpers.
* @param {number} px The fractional x at the sampled subcell (tile units).
* @param {number} py The fractional y at the sampled subcell (tile units).
* @param {2|4|6|8} d The direction to test (entering direction).
* @returns {boolean} True if passable, false otherwise.
*/
Game_CharacterBase.prototype._pixelIsPositionPassable = function(px, py, d) {
	return PIXEL_CollisionManager.isPositionPassable(px, py, d);
};
/**
* Returns 180-degree reverse of a 4-dir direction.
* @param {2|4|6|8} d The direction.
* @returns {2|4|6|8} The reverse direction.
*/
Game_CharacterBase.prototype._pixelReverseDir = function(d) {
	if (d === 2) return 8;
	if (d === 8) return 2;
	if (d === 4) return 6;
	if (d === 6) return 4;
	return d;
};
/**
* First collision X for hitbox at center x with subgrid count.
* Uses an inward-biased floor to pick the first overlapped subcolumn.
* Applies the per-character pivot for alignment.
* @param {number} x The character’s tile x.
* @param {{hx:number,w:number}} hb Hitbox.
* @param {number} count Subgrid count.
* @returns {number} First subcell x.
*/
Game_CharacterBase.prototype._pixelFirstCollisionXAt = function(x, hb, count) {
	const px = x + this.getCollisionPivotX();
	const raw = (px + hb.hx) * count;
	const eps = 1e-7;
	return Math.floor(raw + eps) / count;
};
/**
* Last collision X for hitbox at center x with subgrid count.
* Uses an inward-biased floor on the right edge minus epsilon to include the last overlapped subcolumn.
* Applies the per-character pivot for alignment.
* @param {number} x The character’s tile x.
* @param {{hx:number,w:number}} hb Hitbox.
* @param {number} count Subgrid count.
* @returns {number} Last subcell x.
*/
Game_CharacterBase.prototype._pixelLastCollisionXAt = function(x, hb, count) {
	const px = x + this.getCollisionPivotX();
	const raw = (px + hb.hx + hb.w) * count;
	const eps = 1e-7;
	return Math.floor(raw - eps) / count;
};
/**
* First collision Y for hitbox at center y with subgrid count.
* Uses an inward-biased floor to pick the first overlapped subrow.
* Applies the per-character pivot for alignment.
* @param {number} y The character’s tile y.
* @param {{hy:number,h:number}} hb Hitbox.
* @param {number} count Subgrid count.
* @returns {number} First subcell y.
*/
Game_CharacterBase.prototype._pixelFirstCollisionYAt = function(y, hb, count) {
	const py = y + this.getCollisionPivotY();
	const raw = (py + hb.hy) * count;
	const eps = 1e-7;
	return Math.floor(raw + eps) / count;
};
/**
* Last collision Y for hitbox at center y with subgrid count.
* Uses an inward-biased floor on the bottom edge minus epsilon to include the last overlapped subrow.
* Applies the per-character pivot for alignment.
* @param {number} y The character’s tile y.
* @param {{hy:number,h:number}} hb Hitbox.
* @param {number} count Subgrid count.
* @returns {number} Last subcell y.
*/
Game_CharacterBase.prototype._pixelLastCollisionYAt = function(y, hb, count) {
	const py = y + this.getCollisionPivotY();
	const raw = (py + hb.hy + hb.h) * count;
	const eps = 1e-7;
	return Math.floor(raw - eps) / count;
};
/**
* Checks leftward passage from current center at y across edge subcells.
* Uses integer subcell indices to detect true seam crossings and sample spans.
* @param {number} x Current center x.
* @param {number} y Current center y.
* @param {number} xDest Destination center x.
* @param {{hx:number,hy:number,w:number,h:number}} hb Hitbox.
* @param {number} count Subgrid count.
* @returns {boolean} True if passage allowed.
*/
Game_CharacterBase.prototype._pixelCheckLeftPassage = function(x, y, xDest, hb, count) {
	const px0 = x + this.getCollisionPivotX();
	const px1 = xDest + this.getCollisionPivotX();
	const py = y + this.getCollisionPivotY();
	const eps = 1e-7;
	const curLeftIdx = Math.floor((px0 + hb.hx) * count + eps);
	const destLeftIdx = Math.floor((px1 + hb.hx) * count + eps);
	const crossed = destLeftIdx === curLeftIdx - 1;
	if (crossed === false) {
		return true;
	}
	const firstRowIdx = Math.floor((py + hb.hy) * count + eps);
	const lastRowIdx = Math.floor((py + hb.hy + hb.h) * count - eps);
	const curColX = curLeftIdx / count;
	const destColX = destLeftIdx / count;
	for (let row = firstRowIdx; row <= lastRowIdx; row++) {
		const ny = row / count;
		J.PIXEL.Debug.push(curColX, ny, "rgba(255, 255, 0, 0.6)");
		J.PIXEL.Debug.push(destColX, ny, "rgba(0, 255, 255, 0.6)");
		if (this._pixelIsPositionPassable(curColX, ny, J.PIXEL.Directions.LEFT) === false) return false;
		if (this._pixelIsPositionPassable(destColX, ny, J.PIXEL.Directions.RIGHT) === false) return false;
	}
	return true;
};
/**
* Checks rightward passage across edge subcells using integer indices.
* Validates current-right vs destination-left along all overlapped rows.
* @param {number} x Current center x.
* @param {number} y Current center y.
* @param {number} xDest Destination center x.
* @param {{hx:number,hy:number,w:number,h:number}} hb Hitbox.
* @param {number} count Subgrid count.
* @returns {boolean} True if passage allowed.
*/
Game_CharacterBase.prototype._pixelCheckRightPassage = function(x, y, xDest, hb, count) {
	const px0 = x + this.getCollisionPivotX();
	const px1 = xDest + this.getCollisionPivotX();
	const py = y + this.getCollisionPivotY();
	const eps = 1e-7;
	const curRightIdx = Math.floor((px0 + hb.hx + hb.w) * count - eps);
	const destRightIdx = Math.floor((px1 + hb.hx + hb.w) * count + eps);
	const crossed = destRightIdx === curRightIdx + 1;
	if (crossed === false) {
		return true;
	}
	const firstRowIdx = Math.floor((py + hb.hy) * count + eps);
	const lastRowIdx = Math.floor((py + hb.hy + hb.h) * count - eps);
	const curColX = curRightIdx / count;
	const destColX = destRightIdx / count;
	for (let row = firstRowIdx; row <= lastRowIdx; row++) {
		const ny = row / count;
		J.PIXEL.Debug.push(curColX, ny, "rgba(255, 255, 0, 0.6)");
		J.PIXEL.Debug.push(destColX, ny, "rgba(0, 255, 255, 0.6)");
		if (this._pixelIsPositionPassable(curColX, ny, J.PIXEL.Directions.RIGHT) === false) return false;
		if (this._pixelIsPositionPassable(destColX, ny, J.PIXEL.Directions.LEFT) === false) return false;
	}
	return true;
};
/**
* Checks upward passage across edge subcells using integer indices.
* Validates current-top vs destination-bottom along all overlapped columns.
* @param {number} x Current center x.
* @param {number} y Current center y.
* @param {number} yDest Destination center y.
* @param {{hx:number,hy:number,w:number,h:number}} hb Hitbox.
* @param {number} count Subgrid count.
* @returns {boolean} True if passage allowed.
*/
Game_CharacterBase.prototype._pixelCheckUpPassage = function(x, y, yDest, hb, count) {
	const py0 = y + this.getCollisionPivotY();
	const py1 = yDest + this.getCollisionPivotY();
	const px = x + this.getCollisionPivotX();
	const eps = 1e-7;
	const curTopIdx = Math.floor((py0 + hb.hy) * count + eps);
	const destTopIdx = Math.floor((py1 + hb.hy) * count + eps);
	const crossed = destTopIdx === curTopIdx - 1;
	if (crossed === false) {
		return true;
	}
	const firstColIdx = Math.floor((px + hb.hx) * count + eps);
	const lastColIdx = Math.floor((px + hb.hx + hb.w) * count - eps);
	const curRowY = curTopIdx / count;
	const destRowY = destTopIdx / count;
	for (let col = firstColIdx; col <= lastColIdx; col++) {
		const nx = col / count;
		J.PIXEL.Debug.push(nx, curRowY, "rgba(255, 255, 0, 0.6)");
		J.PIXEL.Debug.push(nx, destRowY, "rgba(0, 255, 255, 0.6)");
		if (this._pixelIsPositionPassable(nx, curRowY, J.PIXEL.Directions.UP) === false) return false;
		if (this._pixelIsPositionPassable(nx, destRowY, J.PIXEL.Directions.DOWN) === false) return false;
	}
	return true;
};
/**
* Checks downward passage across edge subcells using integer indices.
* Validates current-bottom vs destination-top along all overlapped columns.
* @param {number} x Current center x.
* @param {number} y Current center y.
* @param {number} yDest Destination center y.
* @param {{hx:number,hy:number,w:number,h:number}} hb Hitbox.
* @param {number} count Subgrid count.
* @returns {boolean} True if passage allowed.
*/
Game_CharacterBase.prototype._pixelCheckDownPassage = function(x, y, yDest, hb, count) {
	const py0 = y + this.getCollisionPivotY();
	const py1 = yDest + this.getCollisionPivotY();
	const px = x + this.getCollisionPivotX();
	const eps = 1e-7;
	const curBottomIdx = Math.floor((py0 + hb.hy + hb.h) * count - eps);
	const destBottomIdx = Math.floor((py1 + hb.hy + hb.h) * count + eps);
	const crossed = destBottomIdx === curBottomIdx + 1;
	if (crossed === false) {
		return true;
	}
	const firstColIdx = Math.floor((px + hb.hx) * count + eps);
	const lastColIdx = Math.floor((px + hb.hx + hb.w) * count - eps);
	const curRowY = curBottomIdx / count;
	const destRowY = destBottomIdx / count;
	for (let col = firstColIdx; col <= lastColIdx; col++) {
		const nx = col / count;
		J.PIXEL.Debug.push(nx, curRowY, "rgba(255, 255, 0, 0.6)");
		J.PIXEL.Debug.push(nx, destRowY, "rgba(0, 255, 255, 0.6)");
		if (this._pixelIsPositionPassable(nx, curRowY, J.PIXEL.Directions.DOWN) === false) return false;
		if (this._pixelIsPositionPassable(nx, destRowY, J.PIXEL.Directions.UP) === false) return false;
	}
	return true;
};
/**
* Validates vertical lanes (up/down) at the specific new X-edge column we are entering.
* Now uses integer column indices and runs only when a seam was truly crossed.
* @param {number} xCurrent The current center x before the step.
* @param {number} xDest The destination center x after the step.
* @param {number} y The current center y (for edge sampling across vertical lanes).
* @param {{hx:number,hy:number,w:number,h:number}} hb The hitbox metrics.
* @param {number} count The collision subgrid count.
* @returns {boolean} True if lanes ok.
*/
Game_CharacterBase.prototype._pixelCheckVerticalAtNewXColumn = function(xCurrent, xDest, y, hb, count) {
	if (xDest === xCurrent) return true;
	const px0 = xCurrent + this.getCollisionPivotX();
	const px1 = xDest + this.getCollisionPivotX();
	const py = y + this.getCollisionPivotY();
	const eps = 1e-7;
	const curRightIdx = Math.floor((px0 + hb.hx + hb.w) * count - eps);
	const curLeftIdx = Math.floor((px0 + hb.hx) * count + eps);
	const destLeftIdx = Math.floor((px1 + hb.hx) * count + eps);
	const destRightIdx = Math.floor((px1 + hb.hx + hb.w) * count - eps);
	const movingRight = xDest > xCurrent;
	const crossed = movingRight ? destLeftIdx === curRightIdx + 1 : destRightIdx === curLeftIdx - 1;
	if (crossed === false) return true;
	const columnIdx = movingRight ? destLeftIdx : destRightIdx;
	const columnX = columnIdx / count;
	const firstRowIdx = Math.floor((py + hb.hy) * count + eps);
	const lastRowIdx = Math.floor((py + hb.hy + hb.h) * count - eps);
	for (let row = firstRowIdx; row <= lastRowIdx; row++) {
		const ny = row / count;
		J.PIXEL.Debug.push(columnX, ny, "rgba(0, 128, 255, 0.6)");
		const upOk = this._pixelIsPositionPassable(columnX, ny, J.PIXEL.Directions.UP);
		const downOk = this._pixelIsPositionPassable(columnX, ny, J.PIXEL.Directions.DOWN);
		if (upOk === false && downOk === false) return false;
	}
	return true;
};
/**
* Validates horizontal lanes (left/right) at the specific new Y-edge row we are entering.
* Now uses integer row indices and runs only when a seam was truly crossed.
* @param {number} yCurrent The current center y before the step.
* @param {number} yDest The destination center y after the step.
* @param {number} x The current center x (for edge sampling across horizontal lanes).
* @param {{hx:number,hy:number,w:number,h:number}} hb The hitbox metrics.
* @param {number} count The collision subgrid count.
* @returns {boolean} True if lanes ok.
*/
Game_CharacterBase.prototype._pixelCheckHorizontalAtNewYRow = function(yCurrent, yDest, x, hb, count) {
	if (yDest === yCurrent) return true;
	const py0 = yCurrent + this.getCollisionPivotY();
	const py1 = yDest + this.getCollisionPivotY();
	const px = x + this.getCollisionPivotX();
	const eps = 1e-7;
	const curBottomIdx = Math.floor((py0 + hb.hy + hb.h) * count - eps);
	const curTopIdx = Math.floor((py0 + hb.hy) * count + eps);
	const destTopIdx = Math.floor((py1 + hb.hy) * count + eps);
	const destBottomIdx = Math.floor((py1 + hb.hy + hb.h) * count - eps);
	const movingDown = yDest > yCurrent;
	const crossed = movingDown ? destTopIdx === curBottomIdx + 1 : destBottomIdx === curTopIdx - 1;
	if (crossed === false) return true;
	const rowIdx = movingDown ? destTopIdx : destBottomIdx;
	const rowY = rowIdx / count;
	const firstColIdx = Math.floor((px + hb.hx) * count + eps);
	const lastColIdx = Math.floor((px + hb.hx + hb.w) * count - eps);
	for (let col = firstColIdx; col <= lastColIdx; col++) {
		const nx = col / count;
		J.PIXEL.Debug.push(nx, rowY, "rgba(0, 128, 255, 0.6)");
		const leftOk = this._pixelIsPositionPassable(nx, rowY, J.PIXEL.Directions.LEFT);
		const rightOk = this._pixelIsPositionPassable(nx, rowY, J.PIXEL.Directions.RIGHT);
		if (leftOk === false && rightOk === false) return false;
	}
	return true;
};
/**
* Moves this character at an arbitrary angle in degrees.
* The angle follows the RMMZ map convention: 0° = right, 90° = down, 180° = left, 270° = up.
* Movement is blocked if pixel collision prevents passage in the chosen direction.
* @param {number} angleDegrees The angle in degrees (0–360, clockwise from right).
* @param {number=} speed The movement speed in tile units; defaults to distancePerFrame.
* @returns {boolean} True if the character moved, false if blocked.
*/
Game_CharacterBase.prototype.vectorMoveByAngle = function(angleDegrees, speed = this.distancePerFrame()) {
	const radians = angleDegrees * Math.PI / 180;
	const dx = Math.cos(radians) * speed;
	const dy = Math.sin(radians) * speed;
	const prevX = this._x;
	const prevY = this._y;
	const radius = this.getEffectiveRadius();
	let horzDir = 0;
	if (dx > 0) {
		horzDir = J.PIXEL.Directions.RIGHT;
	} else if (dx < 0) {
		horzDir = J.PIXEL.Directions.LEFT;
	}
	let vertDir = 0;
	if (dy > 0) {
		vertDir = J.PIXEL.Directions.DOWN;
	} else if (dy < 0) {
		vertDir = J.PIXEL.Directions.UP;
	}
	let canMoveX = dx === 0;
	if (dx !== 0) {
		canMoveX = this.canPassStraight(horzDir, Math.abs(dx));
	}
	let canMoveY = dy === 0;
	if (dy !== 0) {
		canMoveY = this.canPassStraight(vertDir, Math.abs(dy));
	}
	const finalDx = canMoveX ? dx : 0;
	const finalDy = canMoveY ? dy : 0;
	if (finalDx === 0 && finalDy === 0) {
		return false;
	}
	this._x += finalDx;
	this._y += finalDy;
	if (this.isThrough() === false && this.isDebugThrough() === false && this.isOverlappingSolidTiles(this._x + this.getCollisionPivotX(), this._y + this.getCollisionPivotY(), radius)) {
		this._x = prevX;
		this._y = prevY;
		this._realX = this._x;
		this._realY = this._y;
		return false;
	}
	this.setMovedThisFrame(true);
	this._realX = this._x;
	this._realY = this._y;
	this.modMoveDistance(speed);
	this.updatePixelStepping();
	const facingDirection = this.angleToNearestDirection(angleDegrees);
	if (facingDirection > 0) {
		this.setDirection(facingDirection);
	}
	return true;
};
/**
* Converts an angle in degrees to the nearest 4-direction code for sprite facing.
* Uses cardinal-only snapping since RMMZ sprites only have 4 facing directions.
* @param {number} angleDegrees The angle in degrees (0° = right, 90° = down).
* @returns {2|4|6|8} The nearest cardinal direction code.
*/
Game_CharacterBase.prototype.angleToNearestDirection = function(angleDegrees) {
	const normalized = (angleDegrees % 360 + 360) % 360;
	if (normalized >= 315 || normalized < 45) {
		return J.PIXEL.Directions.RIGHT;
	}
	if (normalized >= 45 && normalized < 135) {
		return J.PIXEL.Directions.DOWN;
	}
	if (normalized >= 135 && normalized < 225) {
		return J.PIXEL.Directions.LEFT;
	}
	return J.PIXEL.Directions.UP;
};

//#endregion
//#region src/plugins/pixel/core/objects/Game_Event.js
/**
* Determines whether or not one this event is collided with other events given the point.
* @param {number} x The x coordinate.
* @param {number} y The y coordinate.
* @returns {boolean}
*/
Game_Event.prototype.isCollidedWithEvents = function(x, y) {
	const events = $gameMap.eventsXyNt(x, y);
	const colliders = events.filter((ev) => {
		if (ev === this) return false;
		if (ev.isErased()) return false;
		if (ev.isThrough()) return false;
		return true;
	});
	return colliders.length > 0;
};
/**
* Overwrites {@link Game_CharacterBase.getCollisionPivotY}.<br/>
* Anchors NPC and enemy event collision near their feet for natural depth feel.
* JABS action events (projectiles) are flagged as through and bypass tile collision
* entirely, so this override does not affect them.
* @returns {number} The Y pivot offset in tile units.
*/
Game_Event.prototype.getCollisionPivotY = function() {
	return .7;
};

//#endregion
//#region src/plugins/pixel/core/objects/Game_Follower.js
/**
* Updates the direction and position based on the preceding character.
* This forces followers to always face the character infront of them in the follower train.
* @param {Game_Follower|Game_Player} otherCharacter The character in front of this character in order.
*/
Game_Follower.prototype.pixelFaceCharacter = function(otherCharacter = $gamePlayer) {
	const otherPosition = otherCharacter.oldestPositionalRecord();
	if (!otherPosition) return;
	const isFacingVertically = Math.abs(otherPosition.y - this._y) > Math.abs(otherPosition.x - this._x);
	const shouldFaceDown = isFacingVertically && otherPosition.y > this._y;
	const shouldFaceUp = isFacingVertically && otherPosition.y < this._y;
	const shouldFaceRight = !isFacingVertically && otherPosition.x > this._x;
	const shouldFaceLeft = !isFacingVertically && otherPosition.x < this._x;
	switch (true) {
		case shouldFaceDown:
			this.setDirection(J.PIXEL.Directions.DOWN);
			break;
		case shouldFaceUp:
			this.setDirection(J.PIXEL.Directions.UP);
			break;
		case shouldFaceLeft:
			this.setDirection(J.PIXEL.Directions.LEFT);
			break;
		case shouldFaceRight:
			this.setDirection(J.PIXEL.Directions.RIGHT);
			break;
	}
};
/**
* Extends {@link Game_Follower.chaseCharacter}.<br/>
* Suppresses vanilla chasing when ALLYAI controls this follower, so formation owns movement.
* @param {Game_Character} character The character to chase (usually the preceding character).
*/
J.PIXEL.Aliased.Game_Follower.set("chaseCharacter", Game_Follower.prototype.chaseCharacter);
Game_Follower.prototype.chaseCharacter = function(character) {
	if (J.ABS.EXT.ALLYAI && this.getJabsBattler()) return;
	J.PIXEL.Aliased.Game_Follower.get("chaseCharacter").call(this, character);
};
/**
* Extends {@link Game_Follower.update}.<br/>
* Ensures follower render coordinates always match logical coordinates.
*/
J.PIXEL.Aliased.Game_Follower.set("update", Game_Follower.prototype.update);
Game_Follower.prototype.update = function() {
	J.PIXEL.Aliased.Game_Follower.get("update").call(this);
	if (this._realX !== this._x || this._realY !== this._y) {
		this._realX = this._x;
		this._realY = this._y;
	}
	if (J.ABS.EXT.ALLYAI && this.getJabsBattler()) {
		if (this.isMovePressed() === false) {
			this._stopCount = 0;
			this._realX = this._x;
			this._realY = this._y;
		}
	}
};
/**
* Extends {@link Game_Follower.moveStraight}.<br/>
* When AllyAI controls this follower and it is idle (not alerted/engaged),
* block generic straight movement unless PIXEL is actively driving movement.
* @param {2|4|6|8} direction The cardinal direction to move.
*/
J.PIXEL.Aliased.Game_Follower.set("moveStraight", Game_Follower.prototype.moveStraight);
Game_Follower.prototype.moveStraight = function(direction) {
	if (J.ABS.EXT.ALLYAI && this.getJabsBattler()) {
		const jabsBattler = this.getJabsBattler();
		if (!jabsBattler.isEngaged() && !jabsBattler.isAlerted()) {
			if (this.isMovePressed() === false) {
				return;
			}
		}
	}
	J.PIXEL.Aliased.Game_Follower.get("moveStraight").call(this, direction);
};
/**
* Extends {@link Game_Follower.moveDiagonally}.<br/>
* When AllyAI controls this follower and it is idle (not alerted/engaged),
* block generic diagonal movement unless PIXEL is actively driving movement.
* @param {4|6} horz The horizontal component direction (4=left, 6=right).
* @param {2|8} vert The vertical component direction (2=down, 8=up).
*/
J.PIXEL.Aliased.Game_Follower.set("moveDiagonally", Game_Follower.prototype.moveDiagonally);
Game_Follower.prototype.moveDiagonally = function(horz, vert) {
	if (J.ABS.EXT.ALLYAI && this.getJabsBattler()) {
		const jabsBattler = this.getJabsBattler();
		if (!jabsBattler.isEngaged() && !jabsBattler.isAlerted()) {
			if (this.isMovePressed() === false) {
				return;
			}
		}
	}
	J.PIXEL.Aliased.Game_Follower.get("moveDiagonally").call(this, horz, vert);
};
/**
* Overwrites {@link Game_CharacterBase.getCollisionPivotY}.<br/>
* Anchors the follower's collision center near their feet to match the player's
* depth-biased collision feel. Keeps the follower train visually consistent.
* @returns {number} The Y pivot offset in tile units.
*/
Game_Follower.prototype.getCollisionPivotY = function() {
	return .7;
};

//#endregion
//#region src/plugins/pixel/core/objects/Game_Map.js
/**
* Extends {@link Game_Map.setup}.<br/>
* Builds the PIXEL subcell collision table when a new map loads.
* @param {number} mapId The id of the map to setup.
*/
J.PIXEL.Aliased.Game_Map.set("setup", Game_Map.prototype.setup);
Game_Map.prototype.setup = function(mapId) {
	J.PIXEL.Aliased.Game_Map.get("setup").call(this, mapId);
	PIXEL_CollisionManager.setupCollision();
	this._pixelFootTouchTriggerCooldown = J.PIXEL.Metadata.FootTouchEventDelayFrames;
};

//#endregion
//#region src/plugins/pixel/core/objects/Game_Player.js
/**
* Overwrites {@link Game_Player.checkEventTriggerHere}.<br/>
* Includes the rounding of the x,y coordinates when checking event triggers for things beneath you.
* @param {number[]} triggers The numeric triggers for this event.
*/
Game_Player.prototype.checkEventTriggerHere = function(triggers) {
	if (this.canStartLocalEvents()) {
		let effectiveTriggers = triggers;
		if (($gameMap._pixelFootTouchTriggerCooldown || 0) > 0) {
			effectiveTriggers = triggers.filter((t) => t !== 1 && t !== 2);
			if (effectiveTriggers.length === 0) {
				return;
			}
		}
		const roundX = Math.round(this.x);
		const roundY = Math.round(this.y);
		this.startMapEvent(roundX, roundY, effectiveTriggers, false);
	}
};
/**
* Extends {@link Game_Player.update}.<br/>
* Ticks down the foot-touch trigger cooldown after all movement and trigger logic for the frame.
*/
J.PIXEL.Aliased.Game_Player.set("update", Game_Player.prototype.update);
Game_Player.prototype.update = function(sceneActive) {
	J.PIXEL.Aliased.Game_Player.get("update").call(this, sceneActive);
	if ($gameMap._pixelFootTouchTriggerCooldown > 0) {
		$gameMap._pixelFootTouchTriggerCooldown--;
	}
};
/**
* Overwrites {@link Game_Player.checkEventTriggerThere}.<br/>
* Computes the front tile from the current facing using rounded base coordinates,
* then starts map events there; if that tile is a counter, also checks one tile beyond.
* @param {number[]} triggers The triggers associated with checking the event at the location.
*/
Game_Player.prototype.checkEventTriggerThere = function(triggers) {
	if (this.canStartLocalEvents() === false) return;
	const baseX = Math.round(this.x);
	const baseY = Math.round(this.y);
	const dir = this.direction();
	const x1 = $gameMap.roundXWithDirection(baseX, dir);
	const y1 = $gameMap.roundYWithDirection(baseY, dir);
	this.startMapEvent(x1, y1, triggers, true);
	const isCounter = $gameMap.isCounter(x1, y1);
	if (isCounter) {
		const x2 = $gameMap.roundXWithDirection(x1, dir);
		const y2 = $gameMap.roundYWithDirection(y1, dir);
		this.startMapEvent(x2, y2, triggers, true);
	}
};
/**
* Extends {@link checkEventTriggerTouch}.<br/>
* Handles the triggering of events by using a threshold-type formula to determine if actually touched.
*/
J.PIXEL.Aliased.Game_Player.set("checkEventTriggerTouch", Game_Player.prototype.checkEventTriggerTouch);
Game_Player.prototype.checkEventTriggerTouch = function(x, y) {
	const roundX = Math.round(x);
	const roundY = Math.round(y);
	const didTrigger = Math.abs(roundX - x) < .3 && Math.abs(roundY - y) < .3;
	if (didTrigger) {
		return J.PIXEL.Aliased.Game_Player.get("checkEventTriggerTouch").call(this, roundX, roundY);
	}
	return false;
};
/**
* Overwrites {@link Game_Player.checkEventTriggerTouchFront}.<br/>
* Computes the front tile from the current facing using rounded base coordinates,
* checks for touch triggers there via PIXEL threshold logic, and if the front tile
* is a counter, also checks the tile beyond.
* @param {number} direction The attempted move direction (ignored; uses current facing).
* @returns {boolean} True if a touch trigger fired, false otherwise.
*/
Game_Player.prototype.checkEventTriggerTouchFront = function(direction) {
	const baseX = Math.round(this.x);
	const baseY = Math.round(this.y);
	const dir = this.direction();
	const x1 = $gameMap.roundXWithDirection(baseX, dir);
	const y1 = $gameMap.roundYWithDirection(baseY, dir);
	if (this.checkEventTriggerTouch(x1, y1)) {
		return true;
	}
	const isCounter = $gameMap.isCounter(x1, y1);
	if (isCounter) {
		const x2 = $gameMap.roundXWithDirection(x1, dir);
		const y2 = $gameMap.roundYWithDirection(y1, dir);
		if (this.checkEventTriggerTouch(x2, y2)) {
			return true;
		}
	}
	return false;
};
/**
* Updates whether or not the player is dashing.
*/
Game_Player.prototype.updateDashing = function() {
	if (this.isMoving() && !this.isMovePressed()) return;
	if (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled()) {
		this._dashing = this.isDashButtonPressed() || $gameTemp.isDestinationValid();
		return;
	}
	this._dashing = false;
};
/**
* Gets the analog input angle for the player in degrees, if vector movement is active.
* Reads raw gamepad axis data directly from the Gamepad API to preserve sub-45° precision.
* Falls back to keyboard/d-pad dir8-to-angle conversion when no analog stick is active.
* Returns null if vector movement is disabled or there is no directional input at all.
* @returns {number|null} Angle in degrees (0=right, 90=down), or null if not applicable.
*/
Game_Player.prototype.getVectorInputAngle = function() {
	if (J.PIXEL.Metadata.VectorMovementEnabled === false) {
		return null;
	}
	const analogAngle = this._readGamepadAnalogAngle();
	if (analogAngle !== null) {
		return analogAngle;
	}
	const rawDir8 = Input.dir8;
	if (rawDir8 === 0) {
		return null;
	}
	return this.dir8ToAngle(rawDir8);
};
/**
* Reads the left analog stick from the first connected gamepad and returns the angle
* in degrees, or null if no gamepad is present or the stick is inside the dead zone.
*
* RMMZ's Input system discards raw axis floats before they reach Input.dir8, converting
* them to digital button states with a 0.5 threshold. To get true arbitrary angles we
* must bypass RMMZ and read navigator.getGamepads() directly.
*
* Dead zone of 0.15 (smaller than RMMZ's 0.5 threshold) filters joystick drift while
* still detecting gentle pushes before RMMZ's digital conversion fires.
*
* @returns {number|null} Angle in degrees (0=right, 90=down in RMMZ Y-down space), or null.
*/
Game_Player.prototype._readGamepadAnalogAngle = function() {
	if (!navigator.getGamepads) {
		return null;
	}
	const gamepads = navigator.getGamepads();
	if (!gamepads) {
		return null;
	}
	for (const gamepad of gamepads) {
		if (!gamepad || gamepad.connected === false) {
			continue;
		}
		const [axisX, axisY] = gamepad.axes;
		const magnitude = Math.sqrt(axisX * axisX + axisY * axisY);
		if (magnitude < .15) {
			continue;
		}
		return Math.atan2(axisY, axisX) * 180 / Math.PI;
	}
	return null;
};
/**
* Converts an 8-direction input code to an angle in degrees.
* @param {1|2|3|4|6|7|8|9} dir8 The 8-direction code.
* @returns {number} The angle in degrees (0=right, 90=down).
*/
Game_Player.prototype.dir8ToAngle = function(dir8) {
	switch (dir8) {
		case J.PIXEL.Directions.RIGHT: return 0;
		case J.PIXEL.Directions.LOWERRIGHT: return 45;
		case J.PIXEL.Directions.DOWN: return 90;
		case J.PIXEL.Directions.LOWERLEFT: return 135;
		case J.PIXEL.Directions.LEFT: return 180;
		case J.PIXEL.Directions.UPPERLEFT: return 225;
		case J.PIXEL.Directions.UP: return 270;
		case J.PIXEL.Directions.UPPERRIGHT: return 315;
		default: return 0;
	}
};
/**
* Overwrites {@link Game_Player.moveByInput}.<br/>
* The meat and potatoes for pixel movement of the player.
* Handles keyboard/gamepad directional input and click-to-move via destination coordinates.
*/
Game_Player.prototype.moveByInput = function() {
	const notMovingButShouldBe = !this.isMoving() || this.isMovePressed();
	if (notMovingButShouldBe && this.canMove()) {
		let direction = Input.dir8;
		if (direction > 0) {
			$gameTemp.clearDestination();
			const vectorAngle = this.getVectorInputAngle();
			if (vectorAngle !== null) {
				const moved = this.vectorMoveByAngle(vectorAngle);
				if (moved) {
					this.processFollowersPixelMoving();
					this.setMovePressed(true);
				} else {
					this.stopFollowersPixelMoving();
					this.setMovePressed(false);
					this.checkEventTriggerTouchFront(direction);
				}
				return;
			}
			if (!this.isMovePressed()) {
				this.clearPositionalRecords();
				const followers = this._followers._data;
				followers.forEach((follower) => follower.clearPositionalRecords());
			}
			this.setMovementSuccess(false);
			direction = this.pixelMoveByInput(direction);
			if (direction > 0) {
				this.setDirection(direction);
			}
			if (this.isMovementSucceeded()) {
				this.processFollowersPixelMoving();
				this.setMovePressed(true);
			} else {
				this.stopFollowersPixelMoving();
				this.setMovePressed(false);
				this.checkEventTriggerTouchFront(direction);
			}
			return;
		}
		if ($gameTemp.isDestinationValid()) {
			this.pixelMoveTowardDestination();
			return;
		}
	}
	this.stopFollowersPixelMoving();
	this.setMovePressed(false);
};
/**
* Moves the player one pixel step toward the current click-to-move destination.
* Clears the destination when the player arrives at the target tile.
*/
Game_Player.prototype.pixelMoveTowardDestination = function() {
	const destX = $gameTemp.destinationX();
	const destY = $gameTemp.destinationY();
	const roundX = Math.round(this.x);
	const roundY = Math.round(this.y);
	if (roundX === destX && roundY === destY) {
		$gameTemp.clearDestination();
		this.stopFollowersPixelMoving();
		this.setMovePressed(false);
		return;
	}
	const dir = this.findDirectionTo(destX, destY);
	if (dir === 0) {
		$gameTemp.clearDestination();
		this.stopFollowersPixelMoving();
		this.setMovePressed(false);
		return;
	}
	this.setMovementSuccess(false);
	const facedDirection = this.pixelMoveByInput(dir);
	if (facedDirection > 0) {
		this.setDirection(facedDirection);
	}
	if (this.isMovementSucceeded()) {
		this.processFollowersPixelMoving();
		this.setMovePressed(true);
	} else {
		this.stopFollowersPixelMoving();
		this.setMovePressed(false);
	}
};
/**
* Extends {@link #onStep}.<br/>
* Also processes on-step effects for the player.
*/
J.PIXEL.Aliased.Game_Player.set("onStep", Game_Player.prototype.onStep);
Game_Player.prototype.onStep = function() {
	J.PIXEL.Aliased.Game_Player.get("onStep").call(this);
	this.handleOnStepEffects();
};
/**
* Handles the various things to do on-step.
*/
Game_Player.prototype.handleOnStepEffects = function() {
	this.increaseSteps();
	this.checkEventTriggerHere([1, 2]);
};
/**
* Processes the pixel movement for followers.
*/
Game_Player.prototype.processFollowersPixelMoving = function() {
	this.recordPixelPosition();
	const followers = this._followers._data;
	followers.forEach((follower, index) => {
		if (J.ABS.EXT.ALLYAI && follower.getJabsBattler()) return;
		const precedingCharacter = index > 0 ? followers.at(index - 1) : $gamePlayer;
		follower.pixelFaceCharacter(precedingCharacter);
		const last = precedingCharacter.oldestPositionalRecord();
		if (last) {
			follower.relocate(last.x, last.y);
		}
		follower.startPixelMoving();
	});
};
/**
* Stops the pixel movement for followers.
*/
Game_Player.prototype.stopFollowersPixelMoving = function() {
	this._followers._data.forEach((follower) => {
		if (J.ABS.EXT.ALLYAI && follower.getJabsBattler()) return;
		follower.stopPixelMoving();
	});
};
/**
* Overwrites {@link Game_CharacterBase.getCollisionPivotY}.<br/>
* Anchors the player's collision center near their feet rather than the tile center.
* This gives the implied top-down perspective its natural depth feel: the player can
* slide closer to objects from below (approaching northward) and is gently blocked
* sooner from above (approaching southward), matching visual depth expectations.
* @returns {number} The Y pivot offset in tile units.
*/
Game_Player.prototype.getCollisionPivotY = function() {
	return .7;
};

//#endregion
//#region src/plugins/pixel/core/sprites/Sprite_PixelCollisionOverlay.js
/**
* A sprite that visualizes the PIXEL subcell collision table and the player's hitbox.
* Draws only the currently visible subcells for performance.
*/
function Sprite_PixelCollisionOverlay() {
	this.initialize(...arguments);
}
Sprite_PixelCollisionOverlay.prototype = Object.create(Sprite.prototype);
Sprite_PixelCollisionOverlay.prototype.constructor = Sprite_PixelCollisionOverlay;
/**
* Initializes the overlay's bitmap and configuration.
*/
Sprite_PixelCollisionOverlay.prototype.initialize = function() {
	Sprite.prototype.initialize.call(this);
	this.bitmap = new Bitmap(Graphics.width, Graphics.height);
	this.z = 10;
	this.bitmap.smooth = false;
	this._throttle = 0;
	this._lastDisplayX = -9999;
	this._lastDisplayY = -9999;
	this._lastPlayerX = -9999;
	this._lastPlayerY = -9999;
	this._showGridLines = true;
	this.opacity = 180;
};
/**
* Updates the overlay each frame.
*/
Sprite_PixelCollisionOverlay.prototype.update = function() {
	Sprite.prototype.update.call(this);
	if (this.visible === false) return;
	if (!$gameMap || !$dataMap) {
		return;
	}
	const tw = $gameMap.tileWidth();
	const th = $gameMap.tileHeight();
	const dx = $gameMap.displayX();
	const dy = $gameMap.displayY();
	this.x = -Math.floor(dx * tw);
	this.y = -Math.floor(dy * th);
	this._throttle++;
	const needThrottleRedraw = this._throttle % 6 === 0;
	const cameraMoved = dx !== this._lastDisplayX || dy !== this._lastDisplayY;
	const player = $gamePlayer;
	const playerMoved = player && (player.x !== this._lastPlayerX || player.y !== this._lastPlayerY);
	if (!needThrottleRedraw && cameraMoved === false && playerMoved === false) {
		return;
	}
	this._lastDisplayX = dx;
	this._lastDisplayY = dy;
	if (player) {
		this._lastPlayerX = player.x;
		this._lastPlayerY = player.y;
	}
	this.redrawVisibleRegion();
};
/**
* Redraws the bitmap for the currently visible region of the map.
*/
Sprite_PixelCollisionOverlay.prototype.redrawVisibleRegion = function() {
	this.bitmap.clear();
	if (PIXEL_CollisionManager.collisionStepCount === undefined) {
		PIXEL_CollisionManager.initConfig();
	}
	const stepCount = PIXEL_CollisionManager.collisionStepCount;
	const subSizeX = $gameMap.tileWidth() / stepCount;
	const subSizeY = $gameMap.tileHeight() / stepCount;
	const tw = $gameMap.tileWidth();
	const th = $gameMap.tileHeight();
	const dx = $gameMap.displayX();
	const dy = $gameMap.displayY();
	const tilesWide = Math.ceil(Graphics.width / tw) + 2;
	const tilesHigh = Math.ceil(Graphics.height / th) + 2;
	const tileStartX = Math.floor(dx);
	const tileStartY = Math.floor(dy);
	const tileEndX = Math.min(tileStartX + tilesWide, $gameMap.width());
	const tileEndY = Math.min(tileStartY + tilesHigh, $gameMap.height());
	for (let ty = tileStartY; ty < tileEndY; ty++) {
		for (let tx = tileStartX; tx < tileEndX; tx++) {
			for (let sy = 0; sy < stepCount; sy++) {
				const subWorldY = ty + sy / stepCount;
				const py = Math.floor((subWorldY - dy) * th);
				for (let sx = 0; sx < stepCount; sx++) {
					const subWorldX = tx + sx / stepCount;
					const code = this._readCode(subWorldX, subWorldY);
					const color = this._colorForCode(code);
					if (!color) {
						continue;
					}
					const px = Math.floor((subWorldX - dx) * tw);
					this.bitmap.fillRect(px, py, Math.ceil(subSizeX), Math.ceil(subSizeY), color);
				}
			}
		}
	}
	if (this._showGridLines) {
		this._drawGridLines(tileStartX, tileStartY, tileEndX, tileEndY, stepCount, tw, th, dx, dy);
	}
	this._drawPlayerHitbox();
	this._drawSampleTraces();
	J.PIXEL.Debug.clear();
};
/**
* Reads a code from the collision table for a fractional tile coordinate.
* @param {number} subWorldX The fractional tile x.
* @param {number} subWorldY The fractional tile y.
* @returns {number} The stored code (or Open if missing).
*/
Sprite_PixelCollisionOverlay.prototype._readCode = function(subWorldX, subWorldY) {
	const idx = PIXEL_CollisionManager._index(subWorldX, subWorldY);
	return PIXEL_CollisionManager._table[idx] || PIXEL_CollisionManager.Codes.Open;
};
/**
* Maps collision codes to semi-transparent colors for display.
* @param {number} code The collision code.
* @returns {string|null} A CSS color string, or null for transparent skip.
*/
Sprite_PixelCollisionOverlay.prototype._colorForCode = function(code) {
	switch (code) {
		case PIXEL_CollisionManager.Codes.Open: return null;
		case PIXEL_CollisionManager.Codes.Solid: return "rgba(255, 0, 0, 0.35)";
		case PIXEL_CollisionManager.Codes.VerticalLine: return "rgba(40, 120, 255, 0.35)";
		case PIXEL_CollisionManager.Codes.HorizontalLine: return "rgba(0, 220, 220, 0.35)";
		case PIXEL_CollisionManager.Codes.EdgeLeft: return "rgba(255, 140, 0, 0.40)";
		case PIXEL_CollisionManager.Codes.EdgeRight: return "rgba(255, 110, 0, 0.40)";
		case PIXEL_CollisionManager.Codes.EdgeDown: return "rgba(220, 0, 180, 0.40)";
		case PIXEL_CollisionManager.Codes.EdgeUp: return "rgba(180, 0, 220, 0.40)";
		case PIXEL_CollisionManager.Codes.CornerBottomLeft:
		case PIXEL_CollisionManager.Codes.CornerBottomRight:
		case PIXEL_CollisionManager.Codes.CornerTopLeft:
		case PIXEL_CollisionManager.Codes.CornerTopRight: return "rgba(255, 255, 0, 0.40)";
		default: return "rgba(200, 200, 200, 0.25)";
	}
};
/**
* Draws faint subgrid lines to visualize seam alignment.
* @param {number} tileStartX Start tile x.
* @param {number} tileStartY Start tile y.
* @param {number} tileEndX End tile x.
* @param {number} tileEndY End tile y.
* @param {number} stepCount Subcells per tile edge.
* @param {number} tw Tile width in pixels.
* @param {number} th Tile height in pixels.
* @param {number} dx Display origin x in tiles.
* @param {number} dy Display origin y in tiles.
*/
Sprite_PixelCollisionOverlay.prototype._drawGridLines = function(tileStartX, tileStartY, tileEndX, tileEndY, stepCount, tw, th, dx, dy) {
	const tileLine = "rgba(255,255,255,0.12)";
	const subLine = "rgba(255,255,255,0.06)";
	const pxStart = Math.floor((tileStartX - dx) * tw);
	const pyStart = Math.floor((tileStartY - dy) * th);
	const pxEnd = Math.ceil((tileEndX - dx) * tw);
	const pyEnd = Math.ceil((tileEndY - dy) * th);
	for (let tx = tileStartX; tx <= tileEndX; tx++) {
		const px = Math.floor((tx - dx) * tw);
		this.bitmap.fillRect(px, pyStart, 1, pyEnd - pyStart, tileLine);
		for (let s = 1; s < stepCount; s++) {
			const psx = Math.floor((tx - dx) * tw + s * (tw / stepCount));
			this.bitmap.fillRect(psx, pyStart, 1, pyEnd - pyStart, subLine);
		}
	}
	for (let ty = tileStartY; ty <= tileEndY; ty++) {
		const py = Math.floor((ty - dy) * th);
		this.bitmap.fillRect(pxStart, py, pxEnd - pxStart, 1, tileLine);
		for (let s = 1; s < stepCount; s++) {
			const psy = Math.floor((ty - dy) * th + s * (th / stepCount));
			this.bitmap.fillRect(pxStart, psy, pxEnd - pxStart, 1, subLine);
		}
	}
};
/**
* Draws the player's collision hitbox rectangle over the overlay.
*/
Sprite_PixelCollisionOverlay.prototype._drawPlayerHitbox = function() {
	if (!$gamePlayer) {
		return;
	}
	const cx = $gamePlayer.x + $gamePlayer.getCollisionPivotX();
	const cy = $gamePlayer.y + $gamePlayer.getCollisionPivotY();
	const radius = $gamePlayer.getEffectiveRadius();
	const hb = $gamePlayer._pixelHitbox(radius);
	const left = cx + hb.hx;
	const top = cy + hb.hy;
	const widthTiles = hb.w;
	const heightTiles = hb.h;
	const tw = $gameMap.tileWidth();
	const th = $gameMap.tileHeight();
	const dx = $gameMap.displayX();
	const dy = $gameMap.displayY();
	const px = Math.floor((left - dx) * tw);
	const py = Math.floor((top - dy) * th);
	const pw = Math.ceil(widthTiles * tw);
	const ph = Math.ceil(heightTiles * th);
	this._strokeRect(px, py, pw, ph, "rgba(0, 255, 0, 0.9)");
	const cxp = Math.floor((cx - dx) * tw);
	const cyp = Math.floor((cy - dy) * th);
	this.bitmap.fillRect(cxp - 2, cyp, 5, 1, "rgba(0,255,0,0.9)");
	this.bitmap.fillRect(cxp, cyp - 2, 1, 5, "rgba(0,255,0,0.9)");
};
/**
* Draws one-frame sample traces emitted by the collision checks.
*/
Sprite_PixelCollisionOverlay.prototype._drawSampleTraces = function() {
	if (!J.PIXEL.Debug) return;
	const dbg = J.PIXEL.Debug;
	if (!dbg.samples || dbg.samples.length === 0) return;
	const tw = $gameMap.tileWidth();
	const th = $gameMap.tileHeight();
	const dx = $gameMap.displayX();
	const dy = $gameMap.displayY();
	if (PIXEL_CollisionManager.collisionStepCount === undefined) PIXEL_CollisionManager.initConfig();
	const step = PIXEL_CollisionManager.collisionStepCount;
	const subW = Math.max(2, Math.ceil(tw / step) - 1);
	const subH = Math.max(2, Math.ceil(th / step) - 1);
	dbg.samples.forEach((s) => {
		const px = Math.floor((s.x - dx) * tw);
		const py = Math.floor((s.y - dy) * th);
		this.bitmap.fillRect(px, py, subW, subH, s.color);
	});
};
/**
* Draws a 1px rectangle stroke.
* @param {number} x The x in pixels.
* @param {number} y The y in pixels.
* @param {number} w The width in pixels.
* @param {number} h The height in pixels.
* @param {string} color The CSS color.
*/
Sprite_PixelCollisionOverlay.prototype._strokeRect = function(x, y, w, h, color) {
	this.bitmap.fillRect(x, y, w, 1, color);
	this.bitmap.fillRect(x, y + h - 1, w, 1, color);
	this.bitmap.fillRect(x, y, 1, h, color);
	this.bitmap.fillRect(x + w - 1, y, 1, h, color);
};

//#endregion
//#region src/plugins/pixel/core/sprites/Spriteset_Map.js
/**
* Extends {@link Spriteset_Map.createUpperLayer}.<br/>
* Creates the PIXEL collision overlay sprite and adds it to the spriteset.
*/
J.PIXEL.Aliased.Spriteset_Map.set("createUpperLayer", Spriteset_Map.prototype.createUpperLayer);
Spriteset_Map.prototype.createUpperLayer = function() {
	J.PIXEL.Aliased.Spriteset_Map.get("createUpperLayer").call(this);
	this.createPixelCollisionOverlay();
};
/**
* Creates the PIXEL collision overlay sprite and adds it as a child.
*/
Spriteset_Map.prototype.createPixelCollisionOverlay = function() {
	this.setupPixelOverlayKeymap();
	const initialVisibility = J.PIXEL && J.PIXEL.Metadata ? J.PIXEL.Metadata.OverlayInitiallyVisible : false;
	this._pixelOverlayVisible = this._pixelOverlayVisible || initialVisibility;
	J.PIXEL.Debug.enabled = this._pixelOverlayVisible;
	this._pixelCollisionOverlay = new Sprite_PixelCollisionOverlay();
	this._pixelCollisionOverlay.visible = this._pixelOverlayVisible;
	this.addChild(this._pixelCollisionOverlay);
};
/**
* Ensures a key is mapped for toggling the overlay.
* Uses the backslash key (keyCode 220) by default.
*/
Spriteset_Map.prototype.setupPixelOverlayKeymap = function() {
	if (!Input.keyMapper[220]) {
		Input.keyMapper[220] = "pixelOverlay";
	}
};
/**
* Extends {@link Spriteset_Map.update}.<br/>
* Handles toggle input and forwards updates to the overlay.
*/
J.PIXEL.Aliased.Spriteset_Map.set("update", Spriteset_Map.prototype.update);
Spriteset_Map.prototype.update = function() {
	J.PIXEL.Aliased.Spriteset_Map.get("update").call(this);
	if (Input.isTriggered("pixelOverlay")) {
		this._pixelOverlayVisible = !this._pixelOverlayVisible;
		if (this._pixelCollisionOverlay) {
			this._pixelCollisionOverlay.visible = this._pixelOverlayVisible;
		}
		J.PIXEL.Debug.enabled = this._pixelOverlayVisible;
	}
};

//#endregion
//# sourceMappingURL=J-Pixelistics.js.map