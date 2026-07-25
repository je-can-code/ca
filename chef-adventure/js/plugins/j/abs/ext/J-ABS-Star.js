/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 STAR] Converts random encounters into star battles.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is an extension to JABS, that enables standard "encounters" as
 * interpreted by RMMZ to be converted into on-the-map field-based encounters
 * leveraging JABS combat.
 *
 * When a random encounter triggers, instead of transitioning to a turn-based
 * battle scene, the player is teleported to a dedicated "battle map" where
 * enemies are generated and fought in real-time via JABS. Once the star
 * battle concludes, the player is returned to their original map/position.
 * ============================================================================
 * BATTLE MAP:
 * By default, every star battle transfers the player to the plugin-wide
 * default battle map (id 110). To use a different battle map for a specific
 * map's encounters, tag that map's own note field:
 *
 * TAG USAGE:
 * - Maps (the map note field, not an event comment)
 *
 * TAG FORMAT:
 *  <battleMap:MAP_ID>
 *    Where MAP_ID is the id of the map to use as the star battlefield when
 *    an encounter triggers while the player is on this map.
 *
 * TAG EXAMPLES:
 *  <battleMap:112>
 * Random encounters triggered while the player is on this map transfer them
 * to map 112 instead of the default battle map.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */

//#region src/plugins/abs/ext/star/_metadata/_pluginMetadata.js
var J_StarPluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
};

//#endregion
//#region src/plugins/abs/ext/star/_metadata/initialization.js
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.ABS.EXT.STAR = {};
(() => {
	const requiredBaseVersion = "3.2.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (!hasBaseRequirement) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
	const requiredJabsVersion = "4.13.0";
	const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.version.version(), requiredJabsVersion);
	if (!hasJabsRequirement) {
		throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
	}
})();
/**
* The metadata for this plugin.
*/
J.ABS.EXT.STAR.Metadata = new J_StarPluginMetadata("J-ABS-STAR", "1.0.0");
/**
* The default values for this plugin.
*/
J.ABS.EXT.STAR.DefaultValues = {
	/**
	* The mapId used when there is no mapId specified.
	* @type {number}
	*/
	EnemyMap: 110,
	/**
	* The maximum number of enemies that can be generated in a troop.
	* Though the max in the database is higher, this keeps things smooth.
	* @type {number}
	*/
	MaxEnemyCount: 12
};
/**
* The aliased classes within this plugin.
*/
J.ABS.EXT.STAR.Aliased = {
	BattleManager: new Map(),
	DataManager: new Map(),
	Game_Interpreter: {},
	Game_Map: new Map(),
	Game_Player: new Map(),
	Game_Troop: new Map(),
	Scene_Map: new Map()
};

//#endregion
//#region src/plugins/abs/ext/star/_models/StarOrigin.js
/**
* A simple container of the coordinates of a destination.
*/
var StarOrigin = class {
	/**
	* The map id of the destination.
	* @type {number}
	*/
	mapId = 0;
	/**
	* The `x` coordinate of this point.
	* @type {number}
	*/
	x = 0;
	/**
	* The `y` coordinate of this point.
	* @type {number}
	*/
	y = 0;
	/**
	* Constructor.
	* @param {number} mapId The target map id.
	* @param {number} x The target `x` coordinate.
	* @param {number} y The target `y` coordinate.
	*/
	constructor(mapId, x, y) {
		this.mapId = mapId;
		this.x = x;
		this.y = y;
	}
};

//#endregion
//#region src/plugins/abs/ext/star/_models/StarPhase.js
/**
* A single phase in the stars battle.
*/
var StarPhase = class {
	/**
	* Constructor.
	* @param {string} name The name of the phase.
	* @param {number} key The number of this phase.
	*/
	constructor(name, key) {
		this.name = name;
		this.key = key;
	}
	/**
	* The name of this star phase.
	* @type {string}
	*/
	name = String.empty;
	/**
	* The numeric order of phase this is.
	* @type {number}
	*/
	key = 0;
};

//#endregion
//#region src/plugins/abs/ext/star/_models/StarPhases.js
/**
* A collection of {@link StarPhase}s that represent the flow of a star battle.
* @type {StarPhases}
*/
BattleManager.starPhases = new StarPhases();
/**
* A constellation of phases in the stars of battle.
*/
var StarPhases = class {
	/**
	* "Disengaged" represents the state of which the player is
	* not in-battle at all. This is the default phase while the player wanders.
	* @type {StarPhase}
	*/
	static DISENGAGED = new StarPhase("Disengaged", 0);
	/**
	* "Preparing" represents the state of which the player is
	* in-transition to battle from either a random or programmatic encounter.
	* @type {StarPhase}
	*/
	static PREPARING = new StarPhase("Preparing", 1);
	/**
	* "In-battle" represents the state of which the player is
	* presently fighting the battle that they encountered.
	* @type {StarPhase}
	*/
	static INBATTLE = new StarPhase("In-battle", 2);
	/**
	* "Finished" represents the state of which the player is
	* has reached an end-condition of battle.
	* @type {StarPhase}
	*/
	static FINISHED = new StarPhase("Finished", 3);
	/**
	* "Clean-up" represents the state of which the player is
	* either reigning victorious, seeing the "you died" screen, or skipping
	* this phase altogether for programmatic (story/dev/etc.) reasons.
	* @type {StarPhase}
	*/
	static CLEANUP = new StarPhase("Clean-up", 4);
	/**
	* "Back-to-map" represents the state of which the player is
	* the player didn't gameover, and is now in transition
	* @type {StarPhase}
	*/
	static BACKTOMAP = new StarPhase("Back-to-map", 5);
};

//#endregion
//#region src/plugins/abs/ext/star/managers/BattleManager.js
/**
* The `enemyMap` is a property containing the master map from which enemies
* from the troop are derived from.
* @type {{events: Game_Event[]}}
*/
BattleManager.enemyMap = BattleManager.enemyMap || { events: [] };
/**
* Extends `initMembers` to include our members as well.
*/
J.ABS.EXT.STAR.Aliased.BattleManager.set("initMembers", BattleManager.initMembers);
BattleManager.initMembers = function() {
	J.ABS.EXT.STAR.Aliased.BattleManager.get("initMembers").call(this);
	/**
	* The origin location that the player came from.
	* This doubles as a return location, too.
	* @type {StarOrigin}
	*/
	this._originLocation = null;
	/**
	* Whether or not the player is engaged in battle.
	* @type {boolean}
	*/
	this._inBattle = false;
	/**
	* An arbitrary counter for various purposes.
	* @type {JABS_Timer}
	*/
	this._wait = new JABS_Timer(60, false);
	/**
	* The phase of star battle we are in.
	* @type {StarPhase}
	*/
	this._starPhase ||= StarPhases.PREPARING;
};
/**
* Gets the current phase of star battle the player is in.
* @returns {StarPhase}
*/
BattleManager.getStarPhase = function() {
	return this._starPhase ?? StarPhases.DISENGAGED;
};
/**
* Sets the current phase of star battle to the new one by the phase's key.
* @param {StarPhase} starPhase The new star phase to be.
*/
BattleManager.setStarPhase = function(starPhase) {
	this._starPhase = starPhase;
};
/**
* Gets the wait timer.
* @returns {JABS_Timer}
*/
BattleManager.getWaitTimer = function() {
	return this._wait;
};
/**
* Sets the wait timer to countdown from a given value.
* @param {number} waitFrames The frames to wait for.
*/
BattleManager.setWait = function(waitFrames) {
	const timer = this.getWaitTimer();
	timer.reset();
	timer.setMaxTime(waitFrames);
};
/**
* Gets whether or not we are waiting.
* @returns {boolean} Whether or not we are waiting.
*/
BattleManager.isWaiting = function() {
	const timer = this.getWaitTimer();
	if (timer.isTimerComplete()) return false;
};
BattleManager.updateTimer = function() {
	const timer = this.getWaitTimer();
	console.log("waiting...");
	timer.update();
};
/**
* Clears the wait timer.
*/
BattleManager.clearWait = function() {
	const timer = this.getWaitTimer();
	timer.forceComplete();
};
/**
* Initiates star battle.
* @param {StarOrigin} originLocation The origin location that the player came from.
* @param {number} battleMapId The id of the battle map to teleport to.
*/
BattleManager.setupStarBattle = function(originLocation, battleMapId) {
	BattleManager.setup($gameTroop.troop().id, true, true);
	$gameSystem.onBattleStart();
	this.engageInBattle();
	this._originLocation = originLocation;
	$gamePlayer.reserveTransfer(battleMapId, 14, 9);
};
/**
* Marks the player as "in battle".
*/
BattleManager.engageInBattle = function() {
	this._inBattle = true;
};
/**
* Marks the player as "not in battle".
*/
BattleManager.disengageInBattle = function() {
	this._inBattle = false;
};
/**
* Gets whether or not the player is "in battle".
* @returns {boolean}
*/
BattleManager.isInBattle = function() {
	return this._inBattle;
};
/**
* Gets the origin location of the player- the map info for where the player
* came from prior to entering battle.
* @returns {StarOrigin}
*/
BattleManager.origin = function() {
	return this._originLocation;
};

//#endregion
//#region src/plugins/abs/ext/star/managers/DataManager.js
/**
* Extends {@link DataManager.createGameObjects}.<br/>
* Includes fetching the enemy map and storing it memory.
*/
J.ABS.EXT.STAR.Aliased.DataManager.set("createGameObjects", DataManager.createGameObjects);
DataManager.createGameObjects = function() {
	J.ABS.EXT.STAR.Aliased.DataManager.get("createGameObjects").call(this);
	DataManager.getEnemyMasterMap();
};
/**
* Executes the retrieval of the enemy master map.
* All JABS battlers are cloned from here.
*/
DataManager.getEnemyMasterMap = function() {
	const mapId = J.ABS.EXT.STAR.DefaultValues.EnemyMap;
	if (mapId > 0) {
		const filename = "Map%1.json".format(mapId.padZero(3));
		this.loadEnemyMasterMap("$dataMap", filename);
	} else {
		throw new Error("Missing enemy master map.");
	}
};
/**
* Retrieves the enemy master map.
* @param {string} name The name of the file to retrieve.
* @param {string} src The source.
*/
DataManager.loadEnemyMasterMap = function(name, src) {
	const xhr = new XMLHttpRequest();
	const url = "data/" + src;
	xhr.open("GET", url);
	xhr.overrideMimeType("application/json");
	xhr.onload = () => this.onEnemyMapGet(xhr, name, src, url);
	xhr.onerror = () => this.gracefulFail(name, src, url);
	xhr.send();
};
/**
* Retrieves the enemy map data file from a given location.
* @param {XMLHttpRequest} xhr The `xhr` service for fetching files from the local.
* @param {string} name The name of the file to retrieve.
* @param {string} src The source.
* @param {string} url The path of the file to retrieve.
*/
DataManager.onEnemyMapGet = function(xhr, name, src, url) {
	if (xhr.status < 400) {
		BattleManager.enemyMap = JSON.parse(xhr.responseText);
	} else {
		this.gracefulFail(name, src, url);
	}
};

//#endregion
//#region src/plugins/abs/ext/star/objects/Game_Interpreter.js
/**
* Overwrites {@link Game_Interpreter.command301}.<br/>
* Alters the event command handler of "Battle Processing".
* Replaces the default battle setup with our star battle setup instead.
* @param {any} params The parameters from the event command.
* @returns {boolean}
*/
Game_Interpreter.prototype.command301 = function(params) {
	if ($gameParty.inBattle()) return true;
	const [designationType, troopIdentifier, canEscape, canLose] = params;
	const troopId = this.command301convertToTroopId(designationType, troopIdentifier);
	const hasTroop = !!$dataTroops[troopId];
	if (hasTroop) {
		BattleManager.setup(troopId, canEscape, canLose);
		BattleManager.setEventCallback((n) => this._branch[this._indent] = n);
		$gamePlayer.makeEncounterCount();
	}
	return true;
};
/**
* Retrieves the troop id based on the given designation type.
* @param {number} designationType The type of designation from the event command.
* @param {number} troopIdentifier The potential identifier provided in the params.
* @returns {number} The troop id.
*/
Game_Interpreter.prototype.command301convertToTroopId = function(designationType, troopIdentifier) {
	switch (designationType) {
		case 0: return troopIdentifier;
		case 1: return $gameVariables.value(troopIdentifier);
		case 2: return $gamePlayer.makeEncounterTroopId();
	}
	console.error(`invalid event command params, `, designationType, troopIdentifier);
	throw new Error("borked");
};

//#endregion
//#region src/plugins/abs/ext/star/objects/Game_Map.js
/**
* Extends {@link Game_Map.update}.<br/>
* Also update the flow of star battle.
*/
J.ABS.EXT.STAR.Aliased.Game_Map.set("update", Game_Map.prototype.update);
Game_Map.prototype.update = function() {
	J.ABS.EXT.STAR.Aliased.Game_Map.get("update").call(this);
	this.updateStarBattle();
};
/**
* Manage the flow of star battle.
*/
Game_Map.prototype.updateStarBattle = function() {
	if (BattleManager.isInBattle()) {
		BattleManager.updateTimer();
	}
	if (!this.canUpdateStarBattle()) return;
	this.updateStarBattlePhases();
};
/**
* Determines whether or not the star battle flow can be updated.
* @returns {boolean} True if it can be updated, false otherwise.
*/
Game_Map.prototype.canUpdateStarBattle = function() {
	if (BattleManager.isWaiting()) return false;
	return true;
};
/**
* Ensures that the correct logic loop is being executed based on the current
* star phase of battle.
*/
Game_Map.prototype.updateStarBattlePhases = function() {
	const currentPhase = BattleManager.getStarPhase();
	switch (currentPhase) {
		case StarPhases.DISENGAGED: break;
		case StarPhases.PREPARING:
			this.starPhasePrepare();
			break;
		case StarPhases.INBATTLE:
			this.starPhaseInBattle();
			break;
		case StarPhases.FINISHED:
			this.starPhaseFinished();
			break;
		case StarPhases.CLEANUP: break;
		case StarPhases.BACKTOMAP: break;
		default: break;
	}
};
/**
* The "prepare" star phase.
* The transition to the battlemap and generation of the troop onto the field.
*/
Game_Map.prototype.starPhasePrepare = function() {
	let battleMapId = null;
	if ($dataMap.meta && $dataMap.meta["battleMap"]) {
		battleMapId = $dataMap.meta["battleMap"];
	}
	const origin = new StarOrigin($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
	BattleManager.setupStarBattle(origin, battleMapId ?? J.ABS.EXT.STAR.DefaultValues.EnemyMap);
	BattleManager.playBattleBgm();
};
/**
* Handles the post-transfer setup for star battle.
*/
Game_Map.prototype.postTransferEnemyParsing = function() {
	if (BattleManager.getStarPhase() !== StarPhases.PREPARING) return;
	$gameTroop.members().forEach(this.generateStarEnemy);
	BattleManager.setStarPhase(StarPhases.INBATTLE);
};
/**
* Generates an enemy and transplants it in the place of the corresponding index
* of the eventId on the battle map.
* @param {Game_Enemy} gameEnemy The enemy battler from the troop.
* @param {number} index The index of the enemy battler in the troop.
*/
Game_Map.prototype.generateStarEnemy = function(gameEnemy, index) {
	if (index >= J.ABS.EXT.STAR.DefaultValues.MaxEnemyCount) {
		console.warn(`Exceeded enemy count limit of ${J.ABS.EXT.STAR.DefaultValues.MaxEnemyCount}.`);
		return;
	}
	const enemyData = JsonEx.makeDeepCopy(BattleManager.enemyMap.events[gameEnemy.enemyId()]);
	const normalizedIndex = index + 1;
	const originalEvent = $dataMap.events[normalizedIndex];
	enemyData.x = originalEvent.x;
	enemyData.y = originalEvent.y;
	$dataMap.events[normalizedIndex] = enemyData;
	const newEnemy = new Game_Event(J.ABS.EXT.STAR.DefaultValues.EnemyMap, normalizedIndex);
	$gameMap._events[index] = newEnemy;
};
/**
* The second phase of star battle, {@link StarPhases.INBATTLE}.<br>
* Handles the monitoring of victory conditions for battle, to switch to the
* next star phase.
*/
Game_Map.prototype.starPhaseInBattle = function() {
	const enemiesRemaining = $gameTroop.areEnemiesAlive();
	console.log(`enemies remaining: ${enemiesRemaining}.`);
	if (enemiesRemaining <= 0) {
		this.onStarVictory();
		console.log("victory condition met: all enemies defeated!");
	}
};
/**
* Upon reaching a victory over the enemy troop, transition to the next phase.
*/
Game_Map.prototype.onStarVictory = function() {
	AudioManager.fadeOutBgm(1);
	BattleManager.playVictoryMe();
	BattleManager.setStarPhase(StarPhases.FINISHED);
	BattleManager.setWait(240);
};
/**
* The third phase of star battle, {@link StarPhases.CLEANUP}.<br>
* This is typically the conclusion of battle, including replacing the character
* and moving onto the next phase.
*/
Game_Map.prototype.starPhaseFinished = function() {
	this.returnPlayerToOrigin();
	AudioManager.stopMe();
	BattleManager.setStarPhase(StarPhases.DISENGAGED);
	BattleManager.disengageInBattle();
};
/**
* Returns the player from whence they came.
*/
Game_Map.prototype.returnPlayerToOrigin = function() {
	$gamePlayer.reserveOriginTransfer();
};

//#endregion
//#region src/plugins/abs/ext/star/objects/Game_Player.js
/**
* Extends {@link Game_Player.clearTransferInfo}.<br/>
* Parse out enemy data from the troop and convert them into JABS battlers.
*/
J.ABS.EXT.STAR.Aliased.Game_Player.set("clearTransferInfo", Game_Player.prototype.clearTransferInfo);
Game_Player.prototype.clearTransferInfo = function() {
	J.ABS.EXT.STAR.Aliased.Game_Player.get("clearTransferInfo").call(this);
	$gameMap.postTransferEnemyParsing();
};
/**
* Extends {@link Game_Player.executeEncounter}.<br/>
* Includes preparation for the stars of battle.
*/
J.ABS.EXT.STAR.Aliased.Game_Player.set("executeEncounter", Game_Player.prototype.executeEncounter);
Game_Player.prototype.executeEncounter = function() {
	const base = J.ABS.EXT.STAR.Aliased.Game_Player.get("executeEncounter").call(this);
	if (base) {
		BattleManager.setStarPhase(StarPhases.PREPARING);
	}
	return base;
};
Game_Player.prototype.reserveOriginTransfer = function() {
	const { mapId, x, y } = BattleManager.origin();
	this.reserveTransfer(mapId, x, y);
};

//#endregion
//#region src/plugins/abs/ext/star/objects/Game_Troop.js
/**
* Extends {@link Game_Troop.initialize}.<br/>
* Initializes our additional members for STABS.
*/
J.ABS.EXT.STAR.Aliased.Game_Troop.set("initialize", Game_Troop.prototype.initialize);
Game_Troop.prototype.initialize = function() {
	J.ABS.EXT.STAR.Aliased.Game_Troop.get("initialize").call(this);
	this.initMembers();
};
/**
* Initializes additional properties for this class.
*/
Game_Troop.prototype.initMembers = function() {
	/**
	* The J object where all my additional properties live.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with JABS.
	*/
	this._j._abs ||= {};
	/**
	* The number of living enemies remaining on this battle map.
	* @type {number}
	*/
	this._j._abs._remainingEnemyCount = 0;
};
/**
* Gets the number of living enemies on this map.
* @returns {number}
*/
Game_Troop.prototype.getRemainingEnemyCount = function() {
	return this._j._abs._remainingEnemyCount;
};
/**
* Updates the current number of living enemies on this map.
*/
Game_Troop.prototype.updateRemainingEnemyCount = function() {
	this._remainingEnemyCount = JABS_AiManager.getOpposingBattlers($jabsEngine.getPlayer1()).length;
};
/**
* Gets whether or there are still enemies alive on this map.
*/
Game_Troop.prototype.areEnemiesAlive = function() {
	return this.getRemainingEnemyCount() > 0;
};

//#endregion
//#region src/plugins/abs/ext/star/scenes/Scene_Map.js
/**
* Overwrites {@link Scene_Map.updateEncounter}.<br/>
* Disables base encounter scene management.
*/
Scene_Map.prototype.updateEncounter = function() {
	if ($gamePlayer.executeEncounter()) {
		this.startFadeOut();
	}
};
/**
* `updateEncounterEffect` handles the zoom/flashing battle transition.
*/
J.ABS.EXT.STAR.Aliased.Scene_Map.set("update", Scene_Map.prototype.update);
Scene_Map.prototype.update = function() {
	J.ABS.EXT.STAR.Aliased.Scene_Map.get("update").call(this);
};

//#endregion
//# sourceMappingURL=J-ABS-Star.js.map