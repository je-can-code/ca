 
//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.6 PIXEL-ABS] Bridges J-Pixelistics with J-ABS for combat-aware pixel movement.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-Pixelistics
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-Pixelistics
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is J-ABS-Pixelistics: the JABS integration layer for
 * J-Pixelistics.
 *
 * It adapts JABS-specific behavior (ally AI formation movement, JABS battler
 * hitbox queries, action/projectile pixel distance scaling, and the dodge
 * step-count multiplier) to work with the fractional-coordinate system
 * provided by J-Pixelistics.
 *
 * ----------------------------------------------------------------------------
 * REQUIREMENTS
 * - J-Base  (any recent version)
 * - J-ABS   (v4.11.0+)
 * - J-Pixelistics (v1.0.0+)
 *
 * Load order in RPG Maker plugin manager:
 *   J-Base → J-ABS → J-Pixelistics → J-ABS-Pixelistics
 *
 * ----------------------------------------------------------------------------
 * HITBOX SIZE
 * Enemy battlers now share one rectangular hitbox model across:
 *  - PIXEL movement/body collision
 *  - JABS battler targeting/collision
 *  - JABS battler hitbox overlays
 *
 * The hitbox is centered horizontally on the event and anchored vertically to
 * the event's feet, meaning the feet are the bottom-center of the rectangle.
 *
 * Apply hitbox size in either place:
 *  - enemy note
 *  - event comments on the battler page
 *
 * If both exist, the event comment wins.
 * If neither exists, the plugin parameter defaults are used.
 *
 * Tag formats:
 *   <hitboxSize:N>
 *    Square shorthand. N is both the width and height in tiles.
 *
 *   <hitboxSize:[W, H]>
 *    Explicit rectangle. W is width in tiles, H is height in tiles.
 *
 * Examples:
 *   <hitboxSize:1.0>
 *    A 1.0 x 1.0 tile square hitbox.
 *
 *   <hitboxSize:[0.8, 0.5]>
 *    A rectangle 0.8 tiles wide and 0.5 tiles tall.
 *
 * ----------------------------------------------------------------------------
 * HITBOX REVEAL
 * Enemy battlers can optionally reveal a faint hitbox outline when the player
 * is nearby, using the same battler AABB model as combat collision.
 *
 * Apply reveal range in either place:
 *  - enemy note
 *  - event comments on the battler page
 *
 * If both exist, the event comment wins.
 * If neither exists, the plugin parameter default is used.
 *
 * Tag format:
 *   <hitboxReveal:N>
 *    Reveal this battler's hitbox outline while the player is within N tiles.
 *
 * Example:
 *   <hitboxReveal:4.5>
 *    The outline is visible when the player is within 4.5 tiles.
 *
 * If the default range is 0, then proximity-based outlines are disabled unless
 * the always-active plugin parameter is enabled.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.6
 *    Added enemy `hitboxReveal` support for proximity-based hitbox outlines in `J-ABS-Pixelistics`.
 *    Added an always-active outline option and a default reveal-range plugin parameter.
 * - 1.0.5
 *    Added unified enemy `hitboxSize` support across PIXEL movement, JABS battler collision,
 *    and battler hitbox overlays.
 *    `event > enemy > default` precedence now applies to enemy hitbox sizing.
 *    Added default enemy hitbox width/height plugin parameters.
 * - 1.0.4
 *    `angleToDirection` folds atan2 vs `dir8ToAngle` degrees into one sector map so keyboard north and analog aim agree.
 * - 1.0.3
 *    `JABS_AiManager` and `JABS_Battler` integration for defensive dodge with pixel movement and formation rules.
 * - 1.0.2
 *    While strafe (direction fix) is active on the leader, projectile base direction follows
 *    sprite facing instead of movement vector — avoids firing opposite the drawn facing.
 * - 1.0.1
 *    Leader projectile aim uses vector / analog input (8-dir) so diagonals match movement.
 *    Sprites stay 4-dir; load order remains J-Base → J-ABS → J-Pixelistics → this plugin.
 * - 1.0.0
 *    Initial release as the JABS integration layer for J-Pixelistics.
 *    Pixel-aware idle wander state machine: idle enemies pick a random
 *    passable destination within the configured wander radius, walk to it,
 *    wait 2–5 seconds, then repeat.
 *    idleWanderRadius plugin parameter (default 1.5 tiles).
 *    Stuck detection: abandons unreachable destinations after 1.5s.
 *    Dodge step count scaled by subcell density so dodge distance matches
 *    the intended tile distance.
 *    Collision table rebuilt when an enemy is defeated.
 *    Smart pixel-aware movement for ally formation, retreating, and
 *    returning to home point.
 *    While the party leader is in pivot guard (one input: lock in place, guard
 *    when eligible), player map movement and dash reassert are disabled.
 * ============================================================================
 *
 *
 * @param idleConfigs
 * @text IDLE MOVEMENT
 *
 * @param idleWanderRadius
 * @parent idleConfigs
 * @type number
 * @decimals 2
 * @min 0.50
 * @max 10.00
 * @text Idle Wander Radius
 * @desc Distance in tiles from home an enemy may wander while idle. Default 1.5 gives a 3x3-tile area.
 * @default 1.50
 *
 * @param enemyHitboxConfigs
 * @text ENEMY HITBOX
 *
 * @param defaultEnemyHitboxWidth
 * @parent enemyHitboxConfigs
 * @type number
 * @decimals 2
 * @min 0.05
 * @text Default Enemy Hitbox Width
 * @desc Full enemy hitbox width in tiles when no event or enemy override exists.
 * @default 0.80
 *
 * @param defaultEnemyHitboxHeight
 * @parent enemyHitboxConfigs
 * @type number
 * @decimals 2
 * @min 0.05
 * @text Default Enemy Hitbox Height
 * @desc Full enemy hitbox height in tiles when no event or enemy override exists.
 * @default 0.50
 *
 * @param outlineAlwaysActive
 * @parent enemyHitboxConfigs
 * @type boolean
 * @text Outline Always Active
 * @desc If true, all eligible battler hitbox outlines are always visible regardless of range.
 * @default false
 *
 * @param defaultHitboxRevealRange
 * @parent enemyHitboxConfigs
 * @type number
 * @decimals 2
 * @min 0
 * @text Default Hitbox Reveal Range
 * @desc Reveal hitbox outlines within this many tiles when no event or enemy override exists. 0 disables proximity mode.
 * @default 6.00
 *
 */
//endregion annotations

//#region src/plugins/pixel/ext/abs/_metadata/_pluginMetadata.js
/**
* Plugin metadata class for J-ABS-Pixelistics.
*/
var JAbsPixelistics_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	* @param {string} name The plugin name.
	* @param {string} version The plugin version.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br>
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
		* The radius in tiles from home that an idle enemy may wander.
		* A value of 1.5 produces a 3x3-tile wander area centered on the home point.
		* @type {number}
		*/
		this.IdleWanderRadius = parseFloat(this.parsedPluginParameters["idleWanderRadius"]) || 1.5;
		/**
		* The default enemy hitbox width in tiles when no override is provided.
		* This is the full width, not a half-width/radius.
		* @type {number}
		*/
		this.DefaultEnemyHitboxWidth = parseFloat(this.parsedPluginParameters["defaultEnemyHitboxWidth"]) || .8;
		/**
		* The default enemy hitbox height in tiles when no override is provided.
		* This is the full height, not a half-height/radius.
		* @type {number}
		*/
		this.DefaultEnemyHitboxHeight = parseFloat(this.parsedPluginParameters["defaultEnemyHitboxHeight"]) || .5;
		/**
		* Whether or not all eligible battler hitbox outlines should always be visible.
		* When enabled, reveal range requirements are ignored completely.
		* @type {boolean}
		*/
		this.EnemyHitboxOutlineAlwaysActive = this.parsedPluginParameters["outlineAlwaysActive"] === "true";
		const configuredRevealRange = parseFloat(this.parsedPluginParameters["defaultHitboxRevealRange"]);
		/**
		* The default range in tiles for revealing enemy hitbox outlines.
		* A value of 0 disables proximity-based outlines unless always-active mode is enabled.
		* @type {number}
		*/
		this.DefaultEnemyHitboxRevealRange = Number.isNaN(configuredRevealRange) ? 6 : configuredRevealRange;
	}
};

//#endregion
//#region src/plugins/pixel/ext/abs/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
* Nested under J.PIXEL.EXT to follow the extension convention:
* J.PIXEL owns this namespace; ABS is the consuming context.
*/
J.PIXEL.EXT ||= {};
/**
* The extension namespace for J-ABS-Pixelistics.
* Sentinel: check `J.PIXEL.EXT.ABS` to detect whether this plugin is loaded.
*/
J.PIXEL.EXT.ABS = {};
/**
* The metadata associated with this plugin.
*/
J.PIXEL.EXT.ABS.Metadata = new JAbsPixelistics_PluginMetadata("J-ABS-Pixelistics", "1.0.6");
/**
* A collection of regex patterns for this plugin.
*/
J.PIXEL.EXT.ABS.RegExp = {};
/**
* Optional per-enemy hitbox size override.
* Supports either a square shorthand or explicit width/height rectangle in tiles.
*/
J.PIXEL.EXT.ABS.RegExp.HitboxSize = /<hitboxSize:[ ]?(\[[ ]?[+-]?\d+(?:\.\d+)?[ ]?,[ ]?[+-]?\d+(?:\.\d+)?[ ]?]|[+-]?\d+(?:\.\d+)?)>/i;
/**
* Optional per-enemy hitbox reveal range override.
*
* <pre>
* Structure:
*  <hitboxReveal:RANGE>
*
* Example:
*  <hitboxReveal:6.5>
*
* Translation:
*  Reveal this battler's hitbox outline while the player is within 6.5 tiles.
* </pre>
* @type {RegExp}
*/
J.PIXEL.EXT.ABS.RegExp.HitboxReveal = /<hitboxReveal:[ ]?([+-]?\d+(?:\.\d+)?)>/i;
/**
* A collection of all aliased methods for this plugin.
*/
J.PIXEL.EXT.ABS.Aliased = {
	Game_CharacterBase: new Map(),
	Game_Event: new Map(),
	Game_Player: new Map(),
	JABS_AiManager: new Map(),
	JABS_Battler: new Map(),
	JABS_Engine: new Map(),
	Spriteset_Map: new Map()
};

//#endregion
//#region src/plugins/pixel/ext/abs/database/RPG_Enemy.js
/**
* Normalizes raw hitbox size note data into the canonical width/height model.
* @param {string|number|number[]|null} rawHitboxSize The raw hitbox size data.
* @returns {{widthTiles:number,heightTiles:number}|null}
*/
RPG_Enemy.hitboxSizeDataFromRaw = function(rawHitboxSize) {
	if (rawHitboxSize === null || rawHitboxSize === undefined) return null;
	const parsedHitboxSize = JsonMapper.parseObject(rawHitboxSize);
	if (typeof parsedHitboxSize === "number") {
		if (parsedHitboxSize <= 0) return null;
		return {
			widthTiles: parsedHitboxSize,
			heightTiles: parsedHitboxSize
		};
	}
	if (Array.isArray(parsedHitboxSize)) {
		const [widthTiles, heightTiles] = parsedHitboxSize;
		if (widthTiles <= 0 || heightTiles <= 0) return null;
		return {
			widthTiles,
			heightTiles
		};
	}
	return null;
};
/**
* The enemy hitbox size override from this database note, if any.
* @type {{widthTiles:number,heightTiles:number}|null}
*/
Object.defineProperty(RPG_Enemy.prototype, "hitboxSizeData", { get: function() {
	const rawHitboxSize = RPGManager.getStringFromNoteByRegex(this, J.PIXEL.EXT.ABS.RegExp.HitboxSize, true);
	return RPG_Enemy.hitboxSizeDataFromRaw(rawHitboxSize);
} });
/**
* The enemy hitbox reveal range override from this database note, if any.
* @type {number|null}
*/
Object.defineProperty(RPG_Enemy.prototype, "hitboxRevealRange", { get: function() {
	return RPGManager.getNumberFromNoteByRegex(this, J.PIXEL.EXT.ABS.RegExp.HitboxReveal, true);
} });

//#endregion
//#region src/plugins/pixel/ext/abs/managers/JABS_AiManager.js
/**
* Overrides {@link #canMoveIdly}.<br/>
* With pixel-idle wander the timing is managed entirely by the destination/wait
* state machine on the battler. The external frame-gate and random roll are not needed.
* @param {JABS_Battler} battler The battler checking idle movement readiness.
* @returns {boolean} Always true; the battler's own state machine controls pacing.
*/
J.PIXEL.EXT.ABS.Aliased.JABS_AiManager.set("canMoveIdly", JABS_AiManager.canMoveIdly);
JABS_AiManager.canMoveIdly = function(battler) {
	return true;
};
/**
* Overrides {@link #moveIdly}.<br/>
* Delegates to the battler's pixel-aware idle wander state machine rather than
* calling the tile-step moveRandom, which only advances a single distancePerFrame pixel.
* @param {JABS_Battler} battler The battler moving idly.
*/
J.PIXEL.EXT.ABS.Aliased.JABS_AiManager.set("moveIdly", JABS_AiManager.moveIdly);
JABS_AiManager.moveIdly = function(battler) {
	battler.updatePixelIdleWander();
};
/**
* Overrides {@link #goHome}.<br/>
* Uses pixel-aware smart movement toward the home coordinates so the battler glides
* home smoothly instead of shuffling one distancePerFrame pixel at a time via moveStraight.
* @param {JABS_Battler} battler The battler returning to its home point.
*/
J.PIXEL.EXT.ABS.Aliased.JABS_AiManager.set("goHome", JABS_AiManager.goHome);
JABS_AiManager.goHome = function(battler) {
	battler.smartMoveTowardCoordinates(battler.getHomeX(), battler.getHomeY());
	if (battler.isHome()) {
		battler.setIdle(true);
	}
};
/**
* Keeps allies within leash range of the leader, even during combat.
* If beyond leash, snap back and clear movement to avoid drift.
* @param {JABS_Battler} allyBattler The ally battler.
*/
J.PIXEL.EXT.ABS.Aliased.JABS_AiManager.set("rubberbandAlly", JABS_AiManager.rubberbandAlly);
JABS_AiManager.rubberbandAlly = function(allyBattler) {
	const allyCharacter = allyBattler.getCharacter();
	allyBattler.lockEngagement();
	allyBattler.disengageTarget();
	allyBattler.resetAllAggro(null, true);
	allyBattler.unlockEngagement();
	allyCharacter.jumpToPlayer();
	allyCharacter.stopPixelMoving();
};
/**
* Extends {@link #moveTowardSlotIfNeeded}.<br/>
* Replaces movement with PIXEL-aware hysteresis and near-target throttling to prevent sliding.
* This implementation does NOT call the original; it fully handles formation movement.
* @param {JABS_Battler} allyBattler The ally battler.
* @param {number} desiredX The desired slot x (fractional center).
* @param {number} desiredY The desired slot y (fractional center).
*/
J.PIXEL.EXT.ABS.Aliased.JABS_AiManager.set("moveTowardSlotIfNeeded", JABS_AiManager.moveTowardSlotIfNeeded);
JABS_AiManager.moveTowardSlotIfNeeded = function(allyBattler, desiredX, desiredY) {
	if (allyBattler.isDodging()) {
		return;
	}
	if (allyBattler.guarding()) {
		return;
	}
	const chr = allyBattler.getCharacter();
	let tolerance = .45;
	const hysteresis = .25;
	if (J.ABS.EXT.ALLYAI && J.ABS.EXT.ALLYAI.Metadata) {
		tolerance = J.ABS.EXT.ALLYAI.Metadata.FormationTolerance;
	}
	const dx = chr.x - desiredX;
	const dy = chr.y - desiredY;
	const dist = Math.sqrt(dx * dx + dy * dy);
	if (dist <= tolerance) {
		chr.stopPixelMoving();
		return;
	}
	const nearThreshold = tolerance + hysteresis;
	if (dist <= nearThreshold) {
		if (chr.isPixelOnCooldown()) {
			return;
		}
		if (allyBattler.canBattlerMove()) {
			allyBattler.smartMoveTowardCoordinates(desiredX, desiredY);
			chr.setPixelMoveCooldown(1);
		}
		return;
	}
	if (allyBattler.canBattlerMove()) {
		allyBattler.smartMoveTowardCoordinates(desiredX, desiredY);
	}
};
/**
* Overrides {@link #calculateFormationSlotCoordinates}.<br/>
* Calculates considering the tile center.
* @param {number} lx The leader's x coordinate.
* @param {number} rx The rotated x.
* @param {number} ly The leader's y coordinate.
* @param {number} ry The rotated y.
* @returns {[number, number]}
*/
JABS_AiManager.calculateFormationSlotCoordinates = function(lx, rx, ly, ry) {
	const sx = lx + rx + .5;
	const sy = ly + ry + .5;
	return [sx, sy];
};
/**
* Overrides {@link #isWithinTolerance}.<br/>
* Checks if a battler is within a Euclidean tolerance of the target point.
* @param {JABS_Battler} allyBattler The ally battler.
* @param {number} targetX The target x (fractional center).
* @param {number} targetY The target y (fractional center).
* @param {number} tolerance The allowed range before moving.
* @returns {boolean} True if within tolerance, false otherwise.
*/
JABS_AiManager.isWithinTolerance = function(allyBattler, targetX, targetY, tolerance) {
	const chr = allyBattler.getCharacter();
	const dx = chr.x - targetX;
	const dy = chr.y - targetY;
	const dist = Math.sqrt(dx * dx + dy * dy);
	return dist <= tolerance;
};

//#endregion
//#region src/plugins/pixel/ext/abs/managers/JABS_Engine.js
/**
* Extends {@link JABS_Engine.getBattlerAabbModel}.<br>
* Enemy battlers with PIXEL hitbox-size data provide their own feet-anchored
* rectangular AABB so JABS combat collision and overlays stay synchronized.
* @param {Game_CharacterBase} character The character whose AABB is being queried.
* @returns {JABS_Aabb}
*/
J.PIXEL.EXT.ABS.Aliased.JABS_Engine.set("getBattlerAabbModel", JABS_Engine.getBattlerAabbModel);
JABS_Engine.getBattlerAabbModel = function(character) {
	if (character && typeof character.getPixelAbsBattlerAabbModel === "function") {
		const customAabb = character.getPixelAbsBattlerAabbModel();
		if (customAabb) {
			return customAabb;
		}
	}
	return J.PIXEL.EXT.ABS.Aliased.JABS_Engine.get("getBattlerAabbModel").call(this, character);
};

//#endregion
//#region src/plugins/pixel/ext/abs/objects/Game_CharacterBase.js
/**
* Extends {@link Game_CharacterBase.isOverlappingSolidTiles}.<br>
* Enemy battlers with rectangular hitboxes need tile overlap checks based on the
* full feet-anchored rectangle instead of a square radius around the center.
* @param {number} px The proposed pivot x in tile units.
* @param {number} py The proposed pivot y in tile units.
* @param {number} radius The compatibility radius from PIXEL core.
* @returns {boolean}
*/
J.PIXEL.EXT.ABS.Aliased.Game_CharacterBase.set("isOverlappingSolidTiles", Game_CharacterBase.prototype.isOverlappingSolidTiles);
Game_CharacterBase.prototype.isOverlappingSolidTiles = function(px, py, radius) {
	if (typeof this.hasCustomPixelHitbox !== "function" || this.hasCustomPixelHitbox() === false) {
		return J.PIXEL.EXT.ABS.Aliased.Game_CharacterBase.get("isOverlappingSolidTiles").call(this, px, py, radius);
	}
	const hitbox = this._pixelHitbox(this.getEffectiveRadius());
	const left = px + hitbox.hx;
	const right = left + hitbox.w;
	const top = py + hitbox.hy;
	const bottom = top + hitbox.h;
	const eps = 1e-6;
	const minCol = Math.floor(left + eps);
	const maxCol = Math.floor(right - eps);
	const minRow = Math.floor(top + eps);
	const maxRow = Math.floor(bottom - eps);
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
* Extends {@link Game_CharacterBase.isCharacterCollisionAt}.<br>
* Character-vs-character overlap needs one shared PIXEL AABB builder so every
* battler is compared in the same pivot-aware coordinate space.
* @param {number} px Proposed x in fractional tiles.
* @param {number} py Proposed y in fractional tiles.
* @param {number=} radius Optional collision half-size in tiles.
* @returns {boolean}
*/
J.PIXEL.EXT.ABS.Aliased.Game_CharacterBase.set("isCharacterCollisionAt", Game_CharacterBase.prototype.isCharacterCollisionAt);
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
	/**
	* Builds a tile-space AABB for collision testing from the character's current
	* PIXEL pivot and hitbox data.
	* @param {Game_CharacterBase} character The character being represented.
	* @param {number} logicalX The logical x coordinate to evaluate.
	* @param {number} logicalY The logical y coordinate to evaluate.
	* @param {number} halfRadius The compatibility radius for square footprints.
	* @returns {{left:number,right:number,top:number,bottom:number}}
	*/
	const buildCharacterAabb = function(character, logicalX, logicalY, halfRadius) {
		const pivotX = logicalX + character.getCollisionPivotX();
		const pivotY = logicalY + character.getCollisionPivotY();
		const hitbox = character._pixelHitbox(halfRadius);
		const left = pivotX + hitbox.hx;
		const top = pivotY + hitbox.hy;
		return {
			left,
			right: left + hitbox.w,
			top,
			bottom: top + hitbox.h
		};
	};
	/**
	* Determines whether or not two tile-space rectangles overlap.
	* Edge-touching is not treated as overlap, matching the legacy scalar logic.
	* @param {{left:number,right:number,top:number,bottom:number}} a The first rect.
	* @param {{left:number,right:number,top:number,bottom:number}} b The second rect.
	* @returns {boolean}
	*/
	const rectanglesOverlap = function(a, b) {
		return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
	};
	const selfAabb = buildCharacterAabb(this, px, py, radius);
	for (let i = 0; i < candidates.length; i++) {
		const ch = candidates[i];
		if (J.ABS && ch.isJabsAction()) {
			continue;
		}
		const candidateRadius = ch.getEffectiveRadius();
		const candidateAabb = buildCharacterAabb(ch, ch.x, ch.y, candidateRadius);
		if (rectanglesOverlap(selfAabb, candidateAabb)) {
			return true;
		}
	}
	return false;
};

//#endregion
//#region src/plugins/pixel/ext/abs/objects/Game_Event.js
/**
* Extends {@link #initMembers}.<br>
* Also initializes the cached enemy hitbox size data.
*/
J.PIXEL.EXT.ABS.Aliased.Game_Event.set("initMembers", Game_Event.prototype.initMembers);
Game_Event.prototype.initMembers = function() {
	J.PIXEL.EXT.ABS.Aliased.Game_Event.get("initMembers").call(this);
	this.initPixelAbsHitboxData();
};
/**
* Extends {@link #setupPageSettings}.<br>
* Rebuilds the cached hitbox data whenever the active page changes.
*/
J.PIXEL.EXT.ABS.Aliased.Game_Event.set("setupPageSettings", Game_Event.prototype.setupPageSettings);
Game_Event.prototype.setupPageSettings = function() {
	J.PIXEL.EXT.ABS.Aliased.Game_Event.get("setupPageSettings").call(this);
	this.refreshPixelAbsHitboxSizeData();
	this.refreshPixelAbsHitboxRevealRange();
};
/**
* Initializes the cached pixel-ABS enemy hitbox data.
*/
Game_Event.prototype.initPixelAbsHitboxData = function() {
	this._j ||= {};
	this._j._pixel ||= {};
	this._j._pixel._abs ||= {};
	this._j._pixel._abs._hitboxSizeData = null;
	this._j._pixel._abs._hitboxRevealRange = null;
};
/**
* Gets the cached enemy hitbox size data for this event.
* @returns {{widthTiles:number,heightTiles:number}|null}
*/
Game_Event.prototype.getPixelAbsHitboxSizeData = function() {
	if (!this._j || !this._j._pixel || !this._j._pixel._abs) {
		this.initPixelAbsHitboxData();
	}
	return this._j._pixel._abs._hitboxSizeData;
};
/**
* Sets the cached enemy hitbox size data for this event.
* @param {{widthTiles:number,heightTiles:number}|null} hitboxSizeData The resolved data.
*/
Game_Event.prototype.setPixelAbsHitboxSizeData = function(hitboxSizeData) {
	if (!this._j || !this._j._pixel || !this._j._pixel._abs) {
		this.initPixelAbsHitboxData();
	}
	if (hitboxSizeData === null) {
		this._j._pixel._abs._hitboxSizeData = null;
		return;
	}
	this._j._pixel._abs._hitboxSizeData = {
		widthTiles: hitboxSizeData.widthTiles,
		heightTiles: hitboxSizeData.heightTiles
	};
};
/**
* Refreshes the resolved enemy hitbox size for this event.
*/
Game_Event.prototype.refreshPixelAbsHitboxSizeData = function() {
	if (this.canUsePixelAbsHitboxSize() === false) {
		this.setPixelAbsHitboxSizeData(null);
		return;
	}
	const hitboxSizeData = this.getPixelAbsHitboxSizeCommentOverride() ?? this.getPixelAbsHitboxSizeEnemyFallback() ?? this.getPixelAbsDefaultHitboxSizeData();
	this.setPixelAbsHitboxSizeData(hitboxSizeData);
};
/**
* Determines whether or not this event should use PIXEL-ABS battler hitbox data.
* @returns {boolean}
*/
Game_Event.prototype.canUsePixelAbsEnemyHitboxData = function() {
	if (typeof this.isJabsBattler !== "function") return false;
	if (this.isJabsBattler() === false) return false;
	if (typeof this.getBattlerId !== "function") return false;
	if (this.getBattlerId() <= 0) return false;
	return true;
};
/**
* Determines whether or not this event should use the unified enemy hitbox model.
* @returns {boolean}
*/
Game_Event.prototype.canUsePixelAbsHitboxSize = function() {
	return this.canUsePixelAbsEnemyHitboxData();
};
/**
* Whether or not this event currently has a resolved custom hitbox model.
* @returns {boolean}
*/
Game_Event.prototype.hasCustomPixelHitbox = function() {
	return !!this.getPixelAbsHitboxSizeData();
};
/**
* Gets the event comment override for hitbox size, if any.
* @returns {{widthTiles:number,heightTiles:number}|null}
*/
Game_Event.prototype.getPixelAbsHitboxSizeCommentOverride = function() {
	if (typeof this.extractValueByRegex !== "function") return null;
	const rawHitboxSize = this.extractValueByRegex(J.PIXEL.EXT.ABS.RegExp.HitboxSize, null, false);
	return RPG_Enemy.hitboxSizeDataFromRaw(rawHitboxSize);
};
/**
* Gets the cached enemy hitbox reveal range for this event.
* @returns {number|null}
*/
Game_Event.prototype.getPixelAbsHitboxRevealRange = function() {
	if (!this._j || !this._j._pixel || !this._j._pixel._abs) {
		this.initPixelAbsHitboxData();
	}
	return this._j._pixel._abs._hitboxRevealRange;
};
/**
* Sets the cached enemy hitbox reveal range for this event.
* @param {number|null} hitboxRevealRange The resolved reveal range.
*/
Game_Event.prototype.setPixelAbsHitboxRevealRange = function(hitboxRevealRange) {
	if (!this._j || !this._j._pixel || !this._j._pixel._abs) {
		this.initPixelAbsHitboxData();
	}
	this._j._pixel._abs._hitboxRevealRange = hitboxRevealRange;
};
/**
* Refreshes the resolved enemy hitbox reveal range for this event.
*/
Game_Event.prototype.refreshPixelAbsHitboxRevealRange = function() {
	if (this.canUsePixelAbsEnemyHitboxData() === false) {
		this.setPixelAbsHitboxRevealRange(null);
		return;
	}
	const commentOverride = this.getPixelAbsHitboxRevealCommentOverride();
	if (commentOverride !== null) {
		this.setPixelAbsHitboxRevealRange(commentOverride);
		return;
	}
	const enemyFallback = this.getPixelAbsHitboxRevealEnemyFallback();
	if (enemyFallback !== null) {
		this.setPixelAbsHitboxRevealRange(enemyFallback);
		return;
	}
	this.setPixelAbsHitboxRevealRange(this.getPixelAbsDefaultHitboxRevealRange());
};
/**
* Gets the event comment override for hitbox reveal range, if any.
* @returns {number|null}
*/
Game_Event.prototype.getPixelAbsHitboxRevealCommentOverride = function() {
	if (typeof this.extractValueByRegex !== "function") return null;
	return this.extractValueByRegex(J.PIXEL.EXT.ABS.RegExp.HitboxReveal, null, true);
};
/**
* Gets the enemy database fallback hitbox size, if any.
* @returns {{widthTiles:number,heightTiles:number}|null}
*/
Game_Event.prototype.getPixelAbsHitboxSizeEnemyFallback = function() {
	const enemyData = this.getPixelAbsEnemyData();
	if (!enemyData) return null;
	return enemyData.hitboxSizeData;
};
/**
* Gets the enemy database fallback hitbox reveal range, if any.
* @returns {number|null}
*/
Game_Event.prototype.getPixelAbsHitboxRevealEnemyFallback = function() {
	const enemyData = this.getPixelAbsEnemyData();
	if (!enemyData) return null;
	return enemyData.hitboxRevealRange;
};
/**
* Gets the shared enemy database data for this battler event.
* @returns {RPG_Enemy|null}
*/
Game_Event.prototype.getPixelAbsEnemyData = function() {
	const battlerId = this.getBattlerId();
	if (battlerId <= 0) return null;
	const enemyBattler = $gameEnemies.enemy(battlerId);
	if (!enemyBattler) return null;
	return enemyBattler.enemy();
};
/**
* Gets the plugin-default hitbox size for enemy battlers.
* @returns {{widthTiles:number,heightTiles:number}}
*/
Game_Event.prototype.getPixelAbsDefaultHitboxSizeData = function() {
	return {
		widthTiles: J.PIXEL.EXT.ABS.Metadata.DefaultEnemyHitboxWidth,
		heightTiles: J.PIXEL.EXT.ABS.Metadata.DefaultEnemyHitboxHeight
	};
};
/**
* Gets the plugin-default hitbox reveal range for enemy battlers.
* @returns {number}
*/
Game_Event.prototype.getPixelAbsDefaultHitboxRevealRange = function() {
	return J.PIXEL.EXT.ABS.Metadata.DefaultEnemyHitboxRevealRange;
};
/**
* Determines whether or not hitbox outlines should be visible for all eligible battlers.
* @returns {boolean}
*/
Game_Event.prototype.isPixelAbsHitboxRevealAlwaysActive = function() {
	return J.PIXEL.EXT.ABS.Metadata.EnemyHitboxOutlineAlwaysActive;
};
/**
* Determines whether or not this battler's hitbox outline should currently be shown.
* @returns {boolean}
*/
Game_Event.prototype.canShowPixelAbsHitboxReveal = function() {
	if (this.canUsePixelAbsEnemyHitboxData() === false) {
		return false;
	}
	const jabsBattler = this.getJabsBattler();
	if (!jabsBattler) return false;
	if (jabsBattler.isInvincible()) {
		return false;
	}
	if (this.isPixelAbsHitboxRevealAlwaysActive()) {
		return true;
	}
	const revealRange = this.getPixelAbsHitboxRevealRange();
	if (revealRange <= 0) {
		return false;
	}
	return revealRange >= this.distanceFromPlayer();
};
/**
* Gets this event's hitbox as a PIXEL-style tile-space AABB.
* @param {number=} logicalX The logical map x to evaluate from.
* @param {number=} logicalY The logical map y to evaluate from.
* @returns {{left:number,top:number,right:number,bottom:number,width:number,height:number}}
*/
Game_Event.prototype.getPixelAbsHitboxTileAabb = function(logicalX = this.x, logicalY = this.y) {
	const pivotX = logicalX + this.getCollisionPivotX();
	const pivotY = logicalY + this.getCollisionPivotY();
	const hitbox = this._pixelHitbox(this.getEffectiveRadius());
	const left = pivotX + hitbox.hx;
	const top = pivotY + hitbox.hy;
	return {
		left,
		top,
		right: left + hitbox.w,
		bottom: top + hitbox.h,
		width: hitbox.w,
		height: hitbox.h
	};
};
/**
* Builds the battler AABB model for JABS using this event's resolved hitbox.
* @returns {JABS_Aabb|null}
*/
Game_Event.prototype.getPixelAbsBattlerAabbModel = function() {
	if (this.hasCustomPixelHitbox() === false) return null;
	const { widthTiles, heightTiles } = this.getPixelAbsHitboxSizeData();
	const widthPixels = widthTiles * $gameMap.tileWidth();
	const heightPixels = heightTiles * $gameMap.tileHeight();
	const left = this.screenX() - widthPixels / 2;
	const top = this.screenY() - heightPixels;
	return new JABS_Aabb(left, top, widthPixels, heightPixels);
};
/**
* Extends {@link Game_Event.getCollisionRadius}.<br>
* The rectangle is canonical, but PIXEL still asks for a scalar in some paths.
* Use the larger half-extent as the compatibility radius.
* @returns {number}
*/
J.PIXEL.EXT.ABS.Aliased.Game_Event.set("getCollisionRadius", Game_Event.prototype.getCollisionRadius);
Game_Event.prototype.getCollisionRadius = function() {
	if (this.hasCustomPixelHitbox() === false) {
		return J.PIXEL.EXT.ABS.Aliased.Game_Event.get("getCollisionRadius").call(this);
	}
	const { widthTiles, heightTiles } = this.getPixelAbsHitboxSizeData();
	return Math.max(widthTiles, heightTiles) / 2;
};
/**
* Extends {@link Game_Event.getEffectiveRadius}.<br>
* Feet-anchored rectangles are already normalized, so the compatibility radius
* should not be clamped by the legacy downward-bleed rule.
* @returns {number}
*/
J.PIXEL.EXT.ABS.Aliased.Game_Event.set("getEffectiveRadius", Game_Event.prototype.getEffectiveRadius);
Game_Event.prototype.getEffectiveRadius = function() {
	if (this.hasCustomPixelHitbox() === false) {
		return J.PIXEL.EXT.ABS.Aliased.Game_Event.get("getEffectiveRadius").call(this);
	}
	return this.getCollisionRadius();
};
/**
* Extends {@link Game_Event.getCollisionPivotY}.<br>
* Enemy hitboxes are feet-anchored, so the pivot becomes the event feet.
* @returns {number}
*/
J.PIXEL.EXT.ABS.Aliased.Game_Event.set("getCollisionPivotY", Game_Event.prototype.getCollisionPivotY);
Game_Event.prototype.getCollisionPivotY = function() {
	if (this.hasCustomPixelHitbox() === false) {
		return J.PIXEL.EXT.ABS.Aliased.Game_Event.get("getCollisionPivotY").call(this);
	}
	return 1;
};
/**
* Extends {@link Game_Event._pixelHitbox}.<br>
* Builds the rectangular, feet-anchored hitbox for PIXEL movement checks.
* @param {number} radius The incoming compatibility radius.
* @returns {{w:number,h:number,hx:number,hy:number}}
*/
J.PIXEL.EXT.ABS.Aliased.Game_Event.set("_pixelHitbox", Game_Event.prototype._pixelHitbox);
Game_Event.prototype._pixelHitbox = function(radius) {
	if (this.hasCustomPixelHitbox() === false) {
		return J.PIXEL.EXT.ABS.Aliased.Game_Event.get("_pixelHitbox").call(this, radius);
	}
	const { widthTiles, heightTiles } = this.getPixelAbsHitboxSizeData();
	return {
		w: widthTiles,
		h: heightTiles,
		hx: -(widthTiles / 2),
		hy: -heightTiles
	};
};

//#endregion
//#region src/plugins/pixel/ext/abs/objects/Game_Player.js
/**
* Pivot guard is one input: movement lock in place, with guard layered when the offhand is guard-ready.
* Pixel {@link #pixelMoveByInput} applies steps before JABS can reject them, so skip map motion while pivoting.
*/
J.PIXEL.EXT.ABS.Aliased.Game_Player.set("moveByInput", Game_Player.prototype.moveByInput);
Game_Player.prototype.moveByInput = function() {
	const jabsPlayer = $jabsEngine && $jabsEngine.getPlayer1();
	const leaderCharacterMatches = jabsPlayer && jabsPlayer.getCharacter() === this;
	const pivotGuardBlocksMotion = leaderCharacterMatches && (jabsPlayer.canBattlerMove() === false || jabsPlayer.guarding());
	if (pivotGuardBlocksMotion) {
		$gameTemp.clearDestination();
		this.stopFollowersPixelMoving();
		this.setMovePressed(false);
		this.setMovementSuccess(false);
		let faceDir = 0;
		const vAngle = this.getVectorInputAngle();
		if (vAngle !== null) {
			faceDir = this.angleToNearestDirection(vAngle);
		} else {
			const d8 = Input.dir8;
			if (d8 > 0) {
				faceDir = this.angleToNearestDirection(this.dir8ToAngle(d8));
			}
		}
		if (faceDir > 0) {
			this.setDirection(faceDir);
			this.checkEventTriggerTouchFront(faceDir);
		}
		return;
	}
	J.PIXEL.EXT.ABS.Aliased.Game_Player.get("moveByInput").call(this);
};
/**
* Dash cannot reassert during pivot guard (pixel {@link #updateDashing} vs click-to-move).
*/
J.PIXEL.EXT.ABS.Aliased.Game_Player.set("updateDashing", Game_Player.prototype.updateDashing);
Game_Player.prototype.updateDashing = function() {
	const jabsPlayer = $jabsEngine && $jabsEngine.getPlayer1();
	const leaderCharacterMatches = jabsPlayer && jabsPlayer.getCharacter() === this;
	const pivotGuardBlocksMotion = leaderCharacterMatches && (jabsPlayer.canBattlerMove() === false || jabsPlayer.guarding());
	if (pivotGuardBlocksMotion) {
		this._dashing = false;
		return;
	}
	J.PIXEL.EXT.ABS.Aliased.Game_Player.get("updateDashing").call(this);
};

//#endregion
//#region src/plugins/pixel/ext/abs/objects/JABS_Battler.js
/**
* Extends {@link #initIdleInfo}.<br/>
* Adds pixel-movement-aware idle destination and wait timer state.
*/
J.PIXEL.EXT.ABS.Aliased.JABS_Battler.set("initIdleInfo", JABS_Battler.prototype.initIdleInfo);
JABS_Battler.prototype.initIdleInfo = function() {
	J.PIXEL.EXT.ABS.Aliased.JABS_Battler.get("initIdleInfo").call(this);
	/**
	* The pixel-space destination this battler is currently wandering toward.
	* Null when the battler has no current wander target.
	* @type {{x: number, y: number}|null}
	*/
	this._pixelIdleDest ??= null;
	/**
	* The number of frames remaining before this battler picks a new wander destination.
	* @type {number}
	*/
	this._pixelIdleWait ??= 0;
	/**
	* The number of consecutive frames this battler has been unable to reach its
	* current wander destination. Used to detect and escape stuck states.
	* @type {number}
	*/
	this._pixelIdleStuckFrames ??= 0;
};
/**
* Overrides {@link #isHome}.<br/>
* Uses a distance-based check instead of integer tile equality, since pixel
* movement coordinates are fractional and exact equality is never satisfied.
* @returns {boolean} True if within half a tile of home, false otherwise.
*/
J.PIXEL.EXT.ABS.Aliased.JABS_Battler.set("isHome", JABS_Battler.prototype.isHome);
JABS_Battler.prototype.isHome = function() {
	return this.distanceToHome() < .5;
};
/**
* The number of consecutive traveling frames allowed before a destination is
* abandoned. At 60 fps this is 1.5 seconds, which is enough time to cross the
* entire wander radius; if the battler hasn't arrived by then it is stuck.
* @type {number}
*/
JABS_Battler.pixelIdleStuckLimit = 90;
/**
* Executes the pixel-aware idle wander state machine for one game frame.
*
* States:
*  - Waiting: decrement the wait timer; do not move.
*  - Traveling: move toward the current destination; on arrival, transition to Waiting.
*              Abandons the destination and enters Waiting if stuck for too long.
*  - Choosing: no destination and no wait; roll a new destination or wait if none found.
*/
JABS_Battler.prototype.updatePixelIdleWander = function() {
	this._pixelIdleDest ??= null;
	this._pixelIdleWait ??= 0;
	this._pixelIdleStuckFrames ??= 0;
	if (this._pixelIdleWait > 0) {
		this._pixelIdleWait--;
		return;
	}
	if (this._pixelIdleDest !== null) {
		const { x, y } = this._pixelIdleDest;
		const arrived = Math.hypot(this.getX() - x, this.getY() - y) < .25;
		if (arrived === false) {
			this._pixelIdleStuckFrames++;
			if (this._pixelIdleStuckFrames >= JABS_Battler.pixelIdleStuckLimit) {
				this._pixelIdleDest = null;
				this._pixelIdleStuckFrames = 0;
				this._pixelIdleWait = this._rollIdleWaitDuration();
				return;
			}
			this.smartMoveTowardCoordinates(x, y);
			return;
		}
		this._pixelIdleDest = null;
		this._pixelIdleStuckFrames = 0;
		this._pixelIdleWait = this._rollIdleWaitDuration();
		return;
	}
	const dest = this._rollIdleDestination();
	if (dest === null) {
		this._pixelIdleWait = this._rollIdleWaitDuration();
		return;
	}
	this._pixelIdleDest = dest;
	this._pixelIdleStuckFrames = 0;
};
/**
* Rolls a random wait duration before this battler picks its next wander destination.
* Returns a random multiple of 30 frames between 30 and 300 (one to ten seconds at 30 fps).
* @returns {number} The number of frames to wait.
*/
JABS_Battler.prototype._rollIdleWaitDuration = function() {
	const multiplier = Math.randomInt(7) + 4;
	return multiplier * 30;
};
/**
* Rolls a random wander destination within the configured idle wander radius of home.
* Retries up to five times to find a tile that is passable in at least one cardinal direction.
* Returns null if every candidate lands on impassable terrain.
* @returns {{x: number, y: number}|null} The chosen destination, or null if none found.
*/
JABS_Battler.prototype._rollIdleDestination = function() {
	const homeX = this.getHomeX();
	const homeY = this.getHomeY();
	const range = J.PIXEL.EXT.ABS.Metadata.IdleWanderRadius;
	for (let attempt = 0; attempt < 5; attempt++) {
		const dx = Math.random() * range * 2 - range;
		const dy = Math.random() * range * 2 - range;
		const destX = homeX + dx;
		const destY = homeY + dy;
		const tx = Math.round(destX);
		const ty = Math.round(destY);
		const walkable = $gameMap.isPassable(tx, ty, 2) || $gameMap.isPassable(tx, ty, 4) || $gameMap.isPassable(tx, ty, 6) || $gameMap.isPassable(tx, ty, 8);
		if (walkable) {
			return {
				x: destX,
				y: destY
			};
		}
	}
	return null;
};
/**
* Extends {@link #setDodgeSteps}.<br/>
* Scales the step count by the pixel collision density so dodge distance
* covers the same visual distance as it would in tile-locked movement.
* @param {number} stepCount The number of steps to dodge.
*/
J.PIXEL.EXT.ABS.Aliased.JABS_Battler.set("setDodgeSteps", JABS_Battler.prototype.setDodgeSteps);
JABS_Battler.prototype.setDodgeSteps = function(stepCount) {
	if (PIXEL_CollisionManager.collisionStepCount === undefined) {
		PIXEL_CollisionManager.initConfig();
	}
	const scaledStepCount = stepCount * PIXEL_CollisionManager.collisionStepCount;
	J.PIXEL.EXT.ABS.Aliased.JABS_Battler.get("setDodgeSteps").call(this, scaledStepCount);
};
/**
* Extends {@link #destroy}.<br/>
* Rebuilds the pixel collision table when an enemy battler is defeated,
* in case the enemy event occupied passability cells that are now vacated.
*/
J.PIXEL.EXT.ABS.Aliased.JABS_Battler.set("destroy", JABS_Battler.prototype.destroy);
JABS_Battler.prototype.destroy = function() {
	const isEnemy = this.getBattler().isActor() === false;
	J.PIXEL.EXT.ABS.Aliased.JABS_Battler.get("destroy").call(this);
	if (isEnemy) {
		PIXEL_CollisionManager.setupCollision();
	}
};
/**
* Tries to move this battler away from its current target until leaving the "close" band.
* Chooses the direction that maximizes separation next frame based on simulated steps.
* Falls back to a passable direction if none increases separation to get unstuck.
*/
JABS_Battler.prototype.smartMoveAwayFromTarget = function() {
	const target = this.getTarget();
	if (!target) {
		return;
	}
	if (this.isDodging()) {
		return;
	}
	if (this.guarding()) {
		return;
	}
	const chr = this.getCharacter();
	const dx = chr.x - target.getX();
	const dy = chr.y - target.getY();
	const currentDistance = Math.sqrt(dx * dx + dy * dy);
	if (JABS_Battler.isClose(currentDistance) === false) {
		return;
	}
	const hysteresis = .25;
	if (currentDistance >= JABS_Battler.closeDistance + hysteresis) {
		return;
	}
	if (chr.isMicroRouting()) {
		const cachedDirection = chr.getMicroRouteDirection();
		let cachedPassable;
		if (chr.isDiagonalDirection(cachedDirection)) {
			cachedPassable = chr.canPassDiagonalByDirection(cachedDirection);
		} else {
			cachedPassable = chr.canPassStraight(cachedDirection);
		}
		if (cachedPassable) {
			chr.pixelMoveByInput(cachedDirection);
			chr.decrementMicroRouteFrames();
			return;
		}
		chr.clearMicroRoute();
	}
	const directions = [
		J.ABS.Directions.LOWERLEFT,
		J.ABS.Directions.DOWN,
		J.ABS.Directions.LOWERRIGHT,
		J.ABS.Directions.LEFT,
		J.ABS.Directions.RIGHT,
		J.ABS.Directions.UPPERLEFT,
		J.ABS.Directions.UP,
		J.ABS.Directions.UPPERRIGHT
	];
	const straightStep = chr.distancePerFrame();
	const diagonalStep = chr.diagonalDistancePerFrame();
	let bestDirection = 0;
	let bestSeparation = currentDistance;
	const epsilon = .01;
	directions.forEach((dir) => {
		const isDiagonal = chr.isDiagonalDirection(dir);
		if (isDiagonal) {
			if (chr.canPassDiagonalByDirection(dir) === false) return;
		} else {
			if (chr.canPassStraight(dir) === false) return;
		}
		let simX = chr.x;
		let simY = chr.y;
		if (dir === J.ABS.Directions.LOWERLEFT) {
			simX -= diagonalStep;
			simY += diagonalStep;
		} else if (dir === J.ABS.Directions.LOWERRIGHT) {
			simX += diagonalStep;
			simY += diagonalStep;
		} else if (dir === J.ABS.Directions.UPPERLEFT) {
			simX -= diagonalStep;
			simY -= diagonalStep;
		} else if (dir === J.ABS.Directions.UPPERRIGHT) {
			simX += diagonalStep;
			simY -= diagonalStep;
		} else if (dir === J.ABS.Directions.DOWN) {
			simY += straightStep;
		} else if (dir === J.ABS.Directions.UP) {
			simY -= straightStep;
		} else if (dir === J.ABS.Directions.RIGHT) {
			simX += straightStep;
		} else if (dir === J.ABS.Directions.LEFT) {
			simX -= straightStep;
		}
		const sdx = simX - target.getX();
		const sdy = simY - target.getY();
		const simulatedDistance = Math.sqrt(sdx * sdx + sdy * sdy);
		if (simulatedDistance - bestSeparation > epsilon) {
			bestSeparation = simulatedDistance;
			bestDirection = dir;
		}
	});
	if (bestDirection === 0) {
		const diagonalFallbacks = [
			J.ABS.Directions.LOWERLEFT,
			J.ABS.Directions.LOWERRIGHT,
			J.ABS.Directions.UPPERLEFT,
			J.ABS.Directions.UPPERRIGHT
		];
		let chosen = 0;
		diagonalFallbacks.forEach((dir) => {
			if (chosen === 0 && chr.canPassDiagonalByDirection(dir)) {
				chosen = dir;
			}
		});
		if (chosen === 0) {
			const cardinalFallbacks = [
				J.ABS.Directions.LEFT,
				J.ABS.Directions.RIGHT,
				J.ABS.Directions.UP,
				J.ABS.Directions.DOWN
			];
			cardinalFallbacks.forEach((dir) => {
				if (chosen === 0 && chr.canPassStraight(dir)) {
					chosen = dir;
				}
			});
		}
		bestDirection = chosen;
	}
	if (bestDirection === 0) {
		this.setWaitCountdown(2);
		return;
	}
	chr.pixelMoveByInput(bestDirection);
	const taxi = Math.abs(dx) + Math.abs(dy);
	let frames = 1;
	if (taxi < 1.25) {
		frames = 2;
	}
	chr.setMicroRouteDirection(bestDirection);
	chr.setMicroRouteFrames(frames);
};
/**
* Tries to move this battler toward a set of coordinates.
* Chooses a direction based on angle, prefers diagonals, and holds that
* direction for a few frames (a "micro-route") before re-deciding.
* @param {number} targetX The x coordinate to reach.
* @param {number} targetY The y coordinate to reach.
*/
JABS_Battler.prototype.smartMoveTowardCoordinates = function(targetX, targetY) {
	if (this.isDodging()) {
		return;
	}
	if (this.guarding()) {
		return;
	}
	const chr = this.getCharacter();
	const deltaX = targetX - chr.x;
	const deltaY = targetY - chr.y;
	const arrived = Math.abs(deltaX) + Math.abs(deltaY) < .1;
	if (arrived) {
		return;
	}
	const continueMicroRouteIfValid = () => {
		if (chr.getMicroRouteFrames() <= 0) return false;
		const cachedDir = chr.getMicroRouteDirection();
		const cachedOk = chr.isDiagonalDirection(cachedDir) ? chr.canPassDiagonalByDirection(cachedDir) : chr.canPassStraight(cachedDir);
		if (cachedOk === false) {
			chr.clearMicroRoute();
			return false;
		}
		chr.pixelMoveByInput(cachedDir);
		chr.decrementMicroRouteFrames();
		return true;
	};
	if (continueMicroRouteIfValid()) return;
	const angleDegrees = this.calculateAngle(targetX, targetY);
	const primaryDirection = this.angleToDirection(angleDegrees);
	const canGoStraight = (dir) => chr.canPassStraight(dir);
	const canGoDiagonal = (dir) => chr.canPassDiagonalByDirection(dir);
	const choosePrimaryIfPossible = () => {
		if (chr.isDiagonalDirection(primaryDirection) && canGoDiagonal(primaryDirection)) {
			return primaryDirection;
		}
		if (chr.isStraightDirection(primaryDirection) && canGoStraight(primaryDirection)) {
			return primaryDirection;
		}
		return 0;
	};
	const buildDiagonalCandidate = () => {
		const wantLeft = deltaX < 0;
		const wantRight = deltaX > 0;
		const wantUp = deltaY < 0;
		const wantDown = deltaY > 0;
		if (wantDown && wantLeft) return J.ABS.Directions.LOWERLEFT;
		if (wantDown && wantRight) return J.ABS.Directions.LOWERRIGHT;
		if (wantUp && wantLeft) return J.ABS.Directions.UPPERLEFT;
		if (wantUp && wantRight) return J.ABS.Directions.UPPERRIGHT;
		return 0;
	};
	const buildCardinalCandidates = () => {
		const wantLeft = deltaX < 0;
		const wantRight = deltaX > 0;
		const wantUp = deltaY < 0;
		const wantDown = deltaY > 0;
		const preferHorizontal = Math.abs(deltaX) >= Math.abs(deltaY);
		const candidates = [];
		if (preferHorizontal) {
			if (wantRight) candidates.push(J.ABS.Directions.RIGHT);
			if (wantLeft) candidates.push(J.ABS.Directions.LEFT);
			if (wantDown) candidates.push(J.ABS.Directions.DOWN);
			if (wantUp) candidates.push(J.ABS.Directions.UP);
		} else {
			if (wantDown) candidates.push(J.ABS.Directions.DOWN);
			if (wantUp) candidates.push(J.ABS.Directions.UP);
			if (wantRight) candidates.push(J.ABS.Directions.RIGHT);
			if (wantLeft) candidates.push(J.ABS.Directions.LEFT);
		}
		return candidates;
	};
	const decideDirection = () => {
		const primary = choosePrimaryIfPossible();
		if (primary !== 0) return primary;
		const diagonalCandidate = buildDiagonalCandidate();
		if (diagonalCandidate !== 0 && canGoDiagonal(diagonalCandidate)) return diagonalCandidate;
		const cards = buildCardinalCandidates();
		let chosen = 0;
		cards.forEach((dir) => {
			if (chosen === 0 && canGoStraight(dir)) chosen = dir;
		});
		return chosen;
	};
	let decidedDirection = decideDirection();
	if (decidedDirection === 0) {
		const aStarDir = chr.findDirectionTo(Math.round(targetX), Math.round(targetY));
		if (aStarDir > 0) decidedDirection = aStarDir;
	}
	if (decidedDirection === 0) {
		this.setWaitCountdown(2);
		return;
	}
	chr.pixelMoveByInput(decidedDirection);
	const taxiDistance = Math.abs(deltaX) + Math.abs(deltaY);
	let framesToHold = 1;
	if (taxiDistance > 3) {
		framesToHold = 16;
	} else if (taxiDistance > 1.5) {
		framesToHold = 8;
	}
	chr.setMicroRouteDirection(decidedDirection);
	chr.setMicroRouteFrames(framesToHold);
};
/**
* Calculates the angle to the target coordinates.
* @param {number} targetX The targetX coordinate of the target point.
* @param {number} targetY The targetY coordinate of the target point.
* @returns {number} The angle in degrees.
*/
JABS_Battler.prototype.calculateAngle = function(targetX, targetY) {
	const selfX = this.getX();
	const selfY = this.getY();
	const dx = targetX - selfX;
	const dy = targetY - selfY;
	const angle = Math.atan2(dy, dx) * 180 / Math.PI;
	return angle;
};
/**
* Calculates the 8-directional direction based on the angle.
* RMMZ map coords are Y-down, so:
*  0°  = RIGHT(6)
* +90° = DOWN(2)
* ±180°= LEFT(4)
* -90° = UP(8)
* Sectors are 45° wide with boundaries at ±22.5°, ±67.5°, ±112.5°, ±157.5°.
*
* {@link Game_Player.prototype.dir8ToAngle} uses 0..360 (UP=270°), while analog sticks use atan2
* in [-180,180] (UP=-90°). Normalize first so keyboard north never lands in the LEFT bucket.
*
* @param {number} angle The angle in degrees (atan2 or dir8ToAngle).
* @returns {1|2|3|4|6|7|8|9}
*/
JABS_Battler.prototype.angleToDirection = function(angle) {
	let a = angle;
	if (a > 180) {
		a -= 360;
	} else if (a <= -180) {
		a += 360;
	}
	const half = 22.5;
	const isRight = a > -half && a <= half;
	const isDownRight = a > half && a <= half + 45;
	const isDown = a > half + 45 && a <= half + 90;
	const isDownLeft = a > half + 90 && a <= half + 135;
	const isLeft = a > half + 135 || a <= -(half + 135);
	const isUpLeft = a > -(half + 135) && a <= -(half + 90);
	const isUp = a > -(half + 90) && a <= -(half + 45);
	const isUpRight = a > -(half + 45) && a <= -half;
	if (isRight) {
		return J.ABS.Directions.RIGHT;
	} else if (isDownRight) {
		return J.ABS.Directions.LOWERRIGHT;
	} else if (isDown) {
		return J.ABS.Directions.DOWN;
	} else if (isDownLeft) {
		return J.ABS.Directions.LOWERLEFT;
	} else if (isLeft) {
		return J.ABS.Directions.LEFT;
	} else if (isUpLeft) {
		return J.ABS.Directions.UPPERLEFT;
	} else if (isUp) {
		return J.ABS.Directions.UP;
	} else if (isUpRight) {
		return J.ABS.Directions.UPPERRIGHT;
	}
	return 0;
};
/**
* Extends {@link JABS_Battler#getProjectileSpawnBaseDirection}.<br/>
* Uses analog / keyboard vector input for the party leader so projectile spokes
* match actual travel intent: {@link Game_CharacterBase#vectorMoveByAngle} keeps
* {@link Game_Character#direction} cardinal for 4-dir sprites, which would
* otherwise mis-aim line and formation projectiles.
* When {@link Game_CharacterBase#isDirectionFixed} is true (JABS strafe / hold facing),
* movement can disagree with sprite facing — fall back to map facing so shots do not
* emit opposite the way the character is drawn.
*/
J.PIXEL.EXT.ABS.Aliased.JABS_Battler.set("getProjectileSpawnBaseDirection", JABS_Battler.prototype.getProjectileSpawnBaseDirection);
JABS_Battler.prototype.getProjectileSpawnBaseDirection = function() {
	const chr = this.getCharacter();
	if (chr === $gamePlayer && typeof chr.getVectorInputAngle === "function") {
		if (typeof chr.isDirectionFixed === "function" && chr.isDirectionFixed()) {
			return J.PIXEL.EXT.ABS.Aliased.JABS_Battler.get("getProjectileSpawnBaseDirection").call(this);
		}
		const vectorAngle = chr.getVectorInputAngle();
		if (vectorAngle !== null) {
			return this.angleToDirection(vectorAngle);
		}
	}
	return J.PIXEL.EXT.ABS.Aliased.JABS_Battler.get("getProjectileSpawnBaseDirection").call(this);
};

//#endregion
//#region src/plugins/pixel/ext/abs/sprites/Spriteset_Map.js
/**
* Extends {@link #createLowerLayer}.<br>
* Also creates the PIXEL-ABS hitbox reveal outline layer.
*/
J.PIXEL.EXT.ABS.Aliased.Spriteset_Map.set("createLowerLayer", Spriteset_Map.prototype.createLowerLayer);
Spriteset_Map.prototype.createLowerLayer = function() {
	J.PIXEL.EXT.ABS.Aliased.Spriteset_Map.get("createLowerLayer").call(this);
	this.createPixelAbsHitboxRevealLayer();
};
/**
* Extends {@link #updateJabsSprites}.<br>
* Also updates the PIXEL-ABS reveal outline overlays.
*/
J.PIXEL.EXT.ABS.Aliased.Spriteset_Map.set("updateJabsSprites", Spriteset_Map.prototype.updateJabsSprites);
Spriteset_Map.prototype.updateJabsSprites = function() {
	J.PIXEL.EXT.ABS.Aliased.Spriteset_Map.get("updateJabsSprites").call(this);
	this.handlePixelAbsHitboxRevealOutlines();
};
/**
* Creates the layer and sprite dictionary for PIXEL-ABS reveal hitboxes.
*/
Spriteset_Map.prototype.createPixelAbsHitboxRevealLayer = function() {
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with PIXEL.
	*/
	this._j._pixel ||= {};
	/**
	* A grouping of all properties associated with PIXEL-ABS.
	*/
	this._j._pixel._abs ||= {};
	/**
	* The container for battler hitbox reveal outlines.
	* @type {Sprite}
	*/
	this._j._pixel._abs._hitboxRevealLayer = new Sprite();
	/**
	* Direct tracking for reveal sprites by their stable key.
	* @type {Record<string, Sprite>}
	*/
	this._j._pixel._abs._hitboxRevealSprites = {};
	this.addChild(this._j._pixel._abs._hitboxRevealLayer);
};
/**
* Gets the PIXEL-ABS reveal outline layer.
* @returns {Sprite}
*/
Spriteset_Map.prototype.getPixelAbsHitboxRevealLayer = function() {
	return this._j._pixel._abs._hitboxRevealLayer;
};
/**
* Gets the PIXEL-ABS reveal outline sprite dictionary.
* @returns {Record<string, Sprite>}
*/
Spriteset_Map.prototype.getPixelAbsHitboxRevealSprites = function() {
	return this._j._pixel._abs._hitboxRevealSprites;
};
/**
* Updates the proximity-based hitbox reveal outlines for eligible battlers.
*/
Spriteset_Map.prototype.handlePixelAbsHitboxRevealOutlines = function() {
	if ($jabsEngine.hitboxOverlaysVisible) {
		this.getPixelAbsHitboxRevealLayer().visible = false;
		this.purgePixelAbsHitboxRevealSprites([]);
		return;
	}
	const items = this.collectPixelAbsHitboxRevealItems();
	const layer = this.getPixelAbsHitboxRevealLayer();
	layer.visible = items.length > 0;
	if (layer.visible === false) {
		this.purgePixelAbsHitboxRevealSprites(items);
		return;
	}
	this.buildMissingPixelAbsHitboxRevealSprites(items);
	this.refreshExistingPixelAbsHitboxRevealSprites(items);
	this.purgePixelAbsHitboxRevealSprites(items);
};
/**
* Collects the battlers whose hitbox outlines should currently be revealed.
* @returns {{ key:string, type:'battler', source: Game_Event }[]}
*/
Spriteset_Map.prototype.collectPixelAbsHitboxRevealItems = function() {
	return this.collectActiveBattlerOverlayItems().filter((item) => item.type === "battler").filter((item) => item.source.canShowPixelAbsHitboxReveal()).map((item) => {
		return {
			key: `pixel-reveal:${item.key}`,
			type: "battler",
			source: item.source
		};
	});
};
/**
* Builds reveal sprites for any battlers that currently need one.
* @param {{ key:string, type:'battler', source: Game_Event }[]} items The reveal items.
*/
Spriteset_Map.prototype.buildMissingPixelAbsHitboxRevealSprites = function(items) {
	const layer = this.getPixelAbsHitboxRevealLayer();
	const dict = this.getPixelAbsHitboxRevealSprites();
	items.forEach((item) => {
		if (dict[item.key]) return;
		const sprite = this.createBattlerHitboxSprite(item);
		sprite._pixelAbsRevealOutline = true;
		dict[item.key] = sprite;
		layer.addChild(sprite);
	});
};
/**
* Refreshes the active reveal sprites for this frame.
* @param {{ key:string, type:'battler', source: Game_Event }[]} items The reveal items.
*/
Spriteset_Map.prototype.refreshExistingPixelAbsHitboxRevealSprites = function(items) {
	const tw = $gameMap.tileWidth();
	const th = $gameMap.tileHeight();
	items.forEach((item) => {
		const sprite = this.getOrCreatePixelAbsHitboxRevealSprite(item);
		sprite.x = item.source.screenX();
		sprite.y = item.source.screenY();
		const aabb = JABS_Engine.getBattlerAabbModel(item.source);
		this.drawBattlerHitboxInto(sprite, item.type, tw, th, false, aabb);
	});
};
/**
* Retrieves or creates the reveal sprite for a given battler.
* @param {{ key:string, type:'battler', source: Game_Event }} item The reveal item.
* @returns {Sprite}
*/
Spriteset_Map.prototype.getOrCreatePixelAbsHitboxRevealSprite = function(item) {
	const dict = this.getPixelAbsHitboxRevealSprites();
	if (dict[item.key]) return dict[item.key];
	const sprite = this.createBattlerHitboxSprite(item);
	sprite._pixelAbsRevealOutline = true;
	dict[item.key] = sprite;
	this.getPixelAbsHitboxRevealLayer().addChild(sprite);
	return sprite;
};
/**
* Removes reveal sprites that no longer correspond to an active battler.
* @param {{ key:string }[]} items The active reveal items.
*/
Spriteset_Map.prototype.purgePixelAbsHitboxRevealSprites = function(items) {
	const active = new Set(items.map((item) => item.key));
	const dict = this.getPixelAbsHitboxRevealSprites();
	const layer = this.getPixelAbsHitboxRevealLayer();
	Object.keys(dict).forEach((key) => {
		if (active.has(key)) return;
		const sprite = dict[key];
		if (sprite && sprite.parent === layer) {
			layer.removeChild(sprite);
		}
		this.destroyBattlerHitboxSprite(sprite);
		delete dict[key];
	});
};
/**
* Extends {@link #drawBattlerHitboxInto}.<br>
* Draws a softer outline-only style for PIXEL-ABS reveal sprites.
* @param {Sprite} sprite The target battler hitbox sprite.
* @param {'player'|'follower'|'battler'} type The kind of battler.
* @param {number} tw Tile width in pixels.
* @param {number} th Tile height in pixels.
* @param {boolean} colliding Whether the battler overlaps any active action.
* @param {JABS_Aabb} aabb The model rect for this battler in screen pixels.
*/
J.PIXEL.EXT.ABS.Aliased.Spriteset_Map.set("drawBattlerHitboxInto", Spriteset_Map.prototype.drawBattlerHitboxInto);
Spriteset_Map.prototype.drawBattlerHitboxInto = function(sprite, type, tw, th, colliding, aabb) {
	if (sprite._pixelAbsRevealOutline !== true) {
		J.PIXEL.EXT.ABS.Aliased.Spriteset_Map.get("drawBattlerHitboxInto").call(this, sprite, type, tw, th, colliding, aabb);
		return;
	}
	this.drawPixelAbsRevealHitboxInto(sprite, aabb);
};
/**
* Draws the softer PIXEL-ABS reveal outline into the battler hitbox sprite.
* @param {Sprite} sprite The target reveal sprite.
* @param {JABS_Aabb} aabb The model rect for this battler in screen pixels.
*/
Spriteset_Map.prototype.drawPixelAbsRevealHitboxInto = function(sprite, aabb) {
	/** @type {PIXI.Graphics} */
	const g = sprite._jabsHitboxG;
	g.clear();
	const style = this.getPixelAbsRevealHitboxStyle();
	this.applyHitboxStyle(g, style);
	const localX = aabb.x - sprite.x;
	const localY = aabb.y - sprite.y;
	g.drawRect(localX, localY, aabb.w, aabb.h);
	g.endFill();
};
/**
* Gets the style used for PIXEL-ABS hitbox reveal outlines.
* @returns {{ fillColor:number, fillAlpha:number, lineColor:number, lineAlpha:number, lineWidth:number }}
*/
Spriteset_Map.prototype.getPixelAbsRevealHitboxStyle = function() {
	const pulseStyle = J.ABS.Metadata.HitboxPulse;
	return {
		fillColor: pulseStyle.fillColor,
		fillAlpha: 0,
		lineColor: pulseStyle.lineColor,
		lineAlpha: .35,
		lineWidth: pulseStyle.lineWidth
	};
};

//#endregion
//# sourceMappingURL=J-Pixel-ABS.js.map