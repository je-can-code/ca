//#region Initialization
/*:
 * @target MZ
 * @plugindesc 
 * [v.1.0 STAR] Converts encounters into ABS battles like Star Ocean.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @base J-ABS
 * @orderAfter J-BASE
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * This should be placed after J-ABS.
 * If Cyclone-Movement is being used, then this should go after that as well,
 * as it does alter some of the functionality associated with it.
 *
 * ============================================================================
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//#region version checks
(() => {
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '1.0.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement) {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }

// Check to ensure we have the minimum required version of the J-ABS plugin.
  const requiredJabsVersion = '3.0.0';
  const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.Version, requiredJabsVersion);
  if (!hasJabsRequirement) {
    throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
  }
})();
//#endregion version check

//#region plugin metadata
/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.STAR = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.STAR.Metadata = {
  /**
   * The version of this plugin.
   */
  Name: `J-ABS-STAR`,
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.STAR.PluginParameters = PluginManager.parameters(J.STAR.Metadata.Name);
J.STAR.Metadata = {
  ...J.STAR.Metadata,
  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

/**
 * A collection of all aliased methods for this plugin.
 */
J.STAR.Aliased = {
  BattleManager: {},
  DataManager: {},
  Game_BattleMap: {},
  Game_Character: {},
  Game_Event: {},
  Game_Interpreter: {},
  Game_Map: {},
  Game_Player: {},
  Game_Troop: {},
  Scene_Map: {},
};

J.STAR.DefaultValues = {
  EnemyMap: 110,
};
//#endregion plugin metadata
//#endregion Initialization

//#region Static objects
//#region BattleManager
J.STAR.Aliased.BattleManager.initMembers = BattleManager.initMembers;
BattleManager.initMembers = function() {
  J.STAR.Aliased.BattleManager.initMembers.call(this);

  /**
   * The player's origin map id- where they will be sent back to.
   * @type {number}
   */
  this._originMapId = 0;

  /**
   * The player's origin x coordinate- where they will be sent back to.
   * @type {number}
   */
  this._originX = 0;

  /**
   * The player's origin y coordinate- where they will be sent back to.
   * @type {number}
   */
  this._originY = 0;

  /**
   * Whether or not the engine is setting up the battle for the player.
   * @type {boolean}
   */
  this._preparingForBattle = false;

  /**
   * Whether or not the player is engaged in battle.
   * @type {boolean}
   */
  this._inBattle = false;
};

BattleManager.prepareForStarBattle = function(originMapId, originX, originY) {
  BattleManager.setup($gameTroop.troop().id, true, true);
  this.engageInBattle();
  this._originMapId = originMapId;
  this._originX = originX;
  this._originY = originY;
  //* TODO: add more here for which map id to send based on player's map id?
  $gamePlayer.reserveTransfer(109, 14, 9);
};

BattleManager.beginBattlePreparation = function() {
  this._preparingForBattle = true;
};

BattleManager.endBattlePreparation = function() {
  this._preparingForBattle = false;
};

BattleManager.preparingForBattle = function() {
  return this._preparingForBattle;
};

BattleManager.engageInBattle = function() {
  this._inBattle = true;
};

BattleManager.disengageInBattle = function() {
  this._inBattle = false;
};

BattleManager.isInBattle = function() {
  return this._inBattle;
};

BattleManager.origin = function() {
  return {
    mapId: this._originMapId,
    originX: this._originX,
    originY: this._originY,
  };
};
//#endregion BattleManager

//#region DataManager
/**
 * The global reference for the `$dataMap` data object that contains all the replicable `JABS_Battler`s.
 * @type {Object}
 * @global
 */
var $enemyMap = null;

J.STAR.Aliased.DataManager.createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
  J.STAR.Aliased.DataManager.createGameObjects.call(this);

  DataManager.getEnemyMasterMap();
};

/**
 * Executes the retrieval of the enemy master map from which we clone all JABS battlers.
 */
DataManager.getEnemyMasterMap = function() {
  const mapId = J.STAR.DefaultValues.EnemyMap;
  if (mapId > 0) {
    const filename = "Map%1.json".format(mapId.padZero(3));
    this.loadEnemyMasterMap("$dataMap", filename);
  } else {
    throw new Error("Missing enemy master map.");
  }
};

/**
 * Retrieves the skill master map.
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
    $enemyMap = JSON.parse(xhr.responseText);
  } else {
    this.gracefulFail(name, src, url);
  }
};
//#endregion DataManager
//#endregion Static objects

//#region Scene objects
//#region Scene_Map
/**
 * OVERWRITE Disables Scene_Map's base encounter scene management.
 */
Scene_Map.prototype.updateEncounter = function() {
  if ($gamePlayer.executeEncounter()) {
    this.startFadeOut();
  }
};

/**
 * `updateEncounterEffect` handles the zoom/flashing battle transition.
 */
J.STAR.Aliased.Scene_Map.update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
  J.STAR.Aliased.Scene_Map.update.call(this);
  //? TODO: Modify encountereffect here.
};
//#endregion Scene_Map
//#endregion Scene objects

//#region Game objects
//#region Game_Interpreter
/**
 * OVERWRITE Modifies the event command handler of "Battle Processing" to prepare for
 * star battle instead of a default battle.
 * @param {any} params The parameters from the event command.
 * @returns {boolean}
 */
Game_Interpreter.prototype.command301 = function(params) {
  if (!$gameParty.inBattle()) {
      let troopId;
      if (params[0] === 0) {
          // Direct designation
          troopId = params[1];
      } else if (params[0] === 1) {
          // Designation with a variable
          troopId = $gameVariables.value(params[1]);
      } else {
          // Same as Random Encounters
          troopId = $gamePlayer.makeEncounterTroopId();
      }
      if ($dataTroops[troopId]) {
          BattleManager.setup(troopId, params[2], params[3]);
          BattleManager.setEventCallback(n => {
              this._branch[this._indent] = n;
          });
          $gamePlayer.makeEncounterCount();
          // SceneManager.push(Scene_Battle);
          $gamePlayer.prepareForStarBattle();
      }
  }
  return true;
};
//#endregion Game_Interpreter

//#region Game_Map
Game_Map.prototype.postTransferEnemyParsing = function() {
  if (BattleManager.preparingForBattle()) {
    $gameTroop.members().forEach((gameEnemy, index) => {
      const enemyId = gameEnemy.enemyId();
      const enemyData = JsonEx.makeDeepCopy($enemyMap.events[enemyId]);
      const originalEvent = $dataMap.events[index+1];
      enemyData.x = originalEvent.x;
      enemyData.y = originalEvent.y;
      $dataMap.events[index + 1] = enemyData;
      const newEnemy = new Game_Event(J.STAR.DefaultValues.EnemyMap, index+1);
      $gameMap._events[index] = newEnemy;
    });

    BattleManager.endBattlePreparation();
    BattleManager.engageInBattle();
  }
};

/**
 * Extends `update` to also update the field for star battle.
 */
J.STAR.Aliased.Game_Map.update = Game_Map.prototype.update;
Game_Map.prototype.update = function() {
  J.STAR.Aliased.Game_Map.update.call(this);
  this.updateStarBattle();
};

Game_Map.prototype.updateStarBattle = function() {
  if (BattleManager.preparingForBattle()) {
    // do nothing.
  } else if (BattleManager.isInBattle()) {
    if (!$gameTroop.areEnemiesAlive()) {
      this.endStarBattle();
    }
  }
};

Game_Map.prototype.endStarBattle = function() {
  const { mapId, originX, originY } = BattleManager.origin();
  $gamePlayer.reserveTransfer(mapId, originX, originY);
  BattleManager.disengageInBattle();
};
//#endregion Game_Map

//#region Game_Player
J.STAR.Aliased.Game_Player.clearTransferInfo = Game_Player.prototype.clearTransferInfo;
Game_Player.prototype.clearTransferInfo = function() {
  J.STAR.Aliased.Game_Player.clearTransferInfo.call(this);
  $gameMap.postTransferEnemyParsing();
};

/**
 * Extends `executeEncounter` to include preparing for star battle.
 */
J.STAR.Aliased.Game_Player.executeEncounter = Game_Player.prototype.executeEncounter;
Game_Player.prototype.executeEncounter = function() {
  const base = J.STAR.Aliased.Game_Player.executeEncounter.call(this);
  if (base) {
    this.prepareForStarBattle();
  }

  return base;
};

/**
 * Captures the origin map data for where to send the player back after battle.
 */
Game_Player.prototype.prepareForStarBattle = function() {
  const originMapId = $gameMap.mapId();
  const originX = this.x;
  const originY = this.y;
  const mapMetadata = $dataMap.meta;
  let battleMapId = 109;
  if (mapMetadata && mapMetadata["battleMap"]) {
    battleMapId = mapMetadata["battleMap"];
  }

  BattleManager.prepareForStarBattle(originMapId, originX, originY, battleMapId);
  BattleManager.beginBattlePreparation();
};
//#endregion Game_Player

//#region Game_Troop
J.STAR.Aliased.Game_Troop.initialize = Game_Troop.prototype.initialize;
Game_Troop.prototype.initialize = function() {
  this.initMembers();
  J.STAR.Aliased.Game_Troop.initialize.call(this);
};

/**
 * Initializes other properties for this class.
 */
Game_Troop.prototype.initMembers = function() {
  /**
   * The number of remaining enemies on the current map.
   * @type {number}
   */
  this._remainingEnemyCount = 0;
};

Game_Troop.prototype.updateRemainingEnemyCount = function() {
  this._remainingEnemyCount = $gameMap.getOpposingBattlers(
    $gameBattleMap.getPlayerMapBattler()
  ).length;
  return this._remainingEnemyCount;
};

Game_Troop.prototype.areEnemiesAlive = function() {
  return this.updateRemainingEnemyCount();
};
//#endregion Game objects