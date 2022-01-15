/*:
 * @target MZ
 * @author J / JE / Jragyn
 * @plugindesc Test Bundling
 * @help We should write something helpful here.
 * 
 * @param hello
 * @type number
 * @text some text for first param
 * @desc my first param desc
 * 
 * @command goodbye
 * @text goodbye??
 * @desc says goodbye desc
 */

//=============================================================================
// ** NOTICE **
//-----------------------------------------------------------------------------
// The code below is generated by a compiler, and is not well suited for human
// reading. If you are interested on the source code, please take a look at
// the Github repository for this plugin!
//=============================================================================

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.STAR = {};
/* This was bundled at [8/21/2021, 11:36:38 AM]. */

(function()
{
  'use strict';

  /**
   * The aliased classes within this plugin.
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
    Scene_Map: {}
  };

  /**
   * The metadata for this plugin.
   */
  J.STAR.Metadata = {
    Name: 'J-ABS-STAR',
    Version: '1.0.0'
  };

  /**
   * The actual `plugin parameters` extracted from RMMZ.
   */
  J.STAR.PluginParameters = PluginManager.parameters(J.STAR.Metadata.Name);

  /**
   * The default values for this plugin.
   */
  J.STAR.DefaultValues = {
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
   * The implementation of the version check for this plugin.
   * Ensures we have the minimum required versions for the dependency plugins.
   */
  (function versionCheck()
  {
    // Check to ensure we have the minimum required version of the J-Base plugin.
    var requiredBaseVersion = '1.0.0';
    var hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);

    if (!hasBaseRequirement)
    {
      throw new Error("Either missing J-Base or has a lower version than the required: ".concat(requiredBaseVersion));
    } // Check to ensure we have the minimum required version of the J-ABS plugin.

    var requiredJabsVersion = '3.0.0';
    var hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.Version, requiredJabsVersion);

    if (!hasJabsRequirement)
    {
      throw new Error("Either missing J-ABS or has a lower version than the required: ".concat(requiredJabsVersion));
    }
  })();

  /**
   * "Disengaged" represents the state of which the player is
   * not in-battle at all. This is the default phase while the player wanders.
   * @type {StarPhase}
   */

  var DISENGAGED = {
    name: "Disengaged",
    key: 0
  };
  /**
   * "Preparing" represents the state of which the player is
   * in-transition to battle from either a random or programmatic encounter.
   * @type {StarPhase}
   */

  var PREPARING = {
    name: "Preparing",
    key: 1
  };
  /**
   * "In-battle" represents the state of which the player is
   * presently fighting the battle that they encountered.
   * @type {StarPhase}
   */

  var INBATTLE = {
    name: "In-battle",
    key: 2
  };
  /**
   * "Finished" represents the state of which the player is
   * has reached an end-condition of battle.
   * @type {StarPhase}
   */

  var FINISHED = {
    name: "Finished",
    key: 3
  };
  /**
   * "Clean-up" represents the state of which the player is
   * either reigning victorious, seeing the "you died" screen, or skipping
   * this phase altogether for programmatic (story/dev/etc.) reasons.
   * @type {StarPhase}
   */

  var CLEANUP = {
    name: "Clean-up",
    key: 4
  };
  /**
   * "Back-to-map" represents the state of which the player is
   * the player didn't gameover, and is now in transition
   * @type {StarPhase}
   */

  var BACKTOMAP = {
    name: "Back-to-map",
    key: 5
  };

  /*
   BattleManager.starPhases = {
    DISENGAGED: {
      name: "Disengaged",
      key: 0
    },

    PREPARING: {
      name: "Preparing",
      key: 1
    },

    INBATTLE: {
      name: "In-battle",
      key: 2
    },

    FINISHED: {
      name: "Finished",
      key: 3
    },

    CLEANUP: {
      name: "Clean-up",
      key: 4
    },

    BACKTOMAP: {
      name: "Back-to-map",
      key: 5
    },
  };
  */

  BattleManager.enemyMap = BattleManager.enemyMap || {
    events: []
  };
  /**
   * Extends `initMembers` to include our members as well.
   */

  J.STAR.Aliased.BattleManager.initMembers = BattleManager.initMembers;

  BattleManager.initMembers = function()
  {
    J.STAR.Aliased.BattleManager.initMembers.call(this);
    /**
     * The origin location that the player came from.
     * This doubles as a return location, too.
     * @type {{mapId: number, x: number, y: number}}
     */

    this._originLocation = null;
    /**
     * Whether or not the player is engaged in battle.
     * @type {boolean}
     */

    this._inBattle = false;
    /**
     * An arbitrary counter for various purposes.
     * @type {number}
     */

    this._wait = 0;
    /**
     * The phase of star battle we are in.
     * @type {StarPhase}
     */

    this._starPhase = this._starPhase || PREPARING;
  };
  /**
   * Gets the current phase of star battle the player is in.
   * @returns {StarPhase}
   */

  BattleManager.getStarPhase = function()
  {
    var _this$_starPhase;

    return (_this$_starPhase = this._starPhase) !== null && _this$_starPhase !== void 0 ? _this$_starPhase : DISENGAGED;
  };
  /**
   * Sets the current phase of star battle to the new one by the phase's key.
   * @param {number} newPhaseKey
   */

  BattleManager.setStarPhase = function(newPhaseKey)
  {
    switch (newPhaseKey)
    {
      case DISENGAGED.key:
        this._starPhase = DISENGAGED;
        break;

      case PREPARING.key:
        this._starPhase = PREPARING;
        break;

      case INBATTLE.key:
        this._starPhase = INBATTLE;
        break;

      case FINISHED.key:
        this._starPhase = FINISHED;
        break;

      case CLEANUP.key:
        this._starPhase = CLEANUP;
        break;

      case BACKTOMAP.key:
        this._starPhase = BACKTOMAP;
        break;
    }
  };
  /**
   * Sets the wait timer to countdown from a given value.
   *
   * While the wait value is greater than 0, phases will not update.
   * @param {number} waitFrames The frames to wait for.
   */

  BattleManager.setWait = function(waitFrames)
  {
    this._wait = waitFrames;
  };
  /**
   * Gets whether or not we are waiting.
   * @returns {boolean} Whether or not we are waiting.
   */

  BattleManager.waiting = function()
  {
    if (this._wait > 0)
    {
      this._wait--;
      return true;
    }

    if (this._wait === 0)
    {
      return false;
    }
  };
  /**
   * Clears the wait timer.
   */

  BattleManager.clearWait = function()
  {
    this._wait = 0;
    console.info('the wait timer has been cleared.');
  };
  /**
   * Initiates star battle.
   * @param {{mapId: number, x: number, y: number}} originLocation The origin location that the player came from.
   */

  BattleManager.setupStarBattle = function(originLocation, battleMapId)
  {
    BattleManager.setup($gameTroop.troop().id, true, true);
    $gameSystem.onBattleStart();
    this.engageInBattle();
    this._originLocation = originLocation; //* TODO: add more here for which map id to send based on player's map id?

    $gamePlayer.reserveTransfer(battleMapId, 14, 9);
  };
  /**
   * Marks the player as "in battle".
   */

  BattleManager.engageInBattle = function()
  {
    this._inBattle = true;
  };
  /**
   * Marks the player as "not in battle".
   */

  BattleManager.disengageInBattle = function()
  {
    this._inBattle = false;
  };
  /**
   * Gets whether or not the player is "in battle".
   * @returns {boolean}
   */

  BattleManager.isInBattle = function()
  {
    return this._inBattle;
  };
  /**
   * Gets the origin location of the player- the map info for where the player
   * came from prior to entering battle.
   * @returns {{mapId: number, x: number, y: number}}
   */

  BattleManager.origin = function()
  {
    return this._originLocation;
  };

  J.STAR.Aliased.DataManager.createGameObjects = DataManager.createGameObjects;

  DataManager.createGameObjects = function()
  {
    J.STAR.Aliased.DataManager.createGameObjects.call(this);
    DataManager.getEnemyMasterMap();
  };
  /**
   * Executes the retrieval of the enemy master map from which we clone all JABS battlers.
   */

  DataManager.getEnemyMasterMap = function()
  {
    var mapId = J.STAR.DefaultValues.EnemyMap;

    if (mapId > 0)
    {
      var filename = "Map%1.json".format(mapId.padZero(3));
      this.loadEnemyMasterMap("$dataMap", filename);
    }
    else
    {
      throw new Error("Missing enemy master map.");
    }
  };
  /**
   * Retrieves the skill master map.
   * @param {string} name The name of the file to retrieve.
   * @param {string} src The source.
   */

  DataManager.loadEnemyMasterMap = function(name, src)
  {
    var _this = this;

    var xhr = new XMLHttpRequest();
    var url = "data/" + src;
    xhr.open("GET", url);
    xhr.overrideMimeType("application/json");

    xhr.onload = function()
    {
      return _this.onEnemyMapGet(xhr, name, src, url);
    };

    xhr.onerror = function()
    {
      return _this.gracefulFail(name, src, url);
    };

    xhr.send();
  };
  /**
   * Retrieves the enemy map data file from a given location.
   * @param {XMLHttpRequest} xhr The `xhr` service for fetching files from the local.
   * @param {string} name The name of the file to retrieve.
   * @param {string} src The source.
   * @param {string} url The path of the file to retrieve.
   */

  DataManager.onEnemyMapGet = function(xhr, name, src, url)
  {
    if (xhr.status < 400)
    {
      BattleManager.enemyMap = JSON.parse(xhr.responseText);
    }
    else
    {
      this.gracefulFail(name, src, url);
    }
  };

  /**
   * OVERWRITE Disables Scene_Map's base encounter scene management.
   */
  Scene_Map.prototype.updateEncounter = function()
  {
    if ($gamePlayer.executeEncounter())
    {
      this.startFadeOut();
    }
  };
  /**
   * `updateEncounterEffect` handles the zoom/flashing battle transition.
   */

  J.STAR.Aliased.Scene_Map.update = Scene_Map.prototype.update;

  Scene_Map.prototype.update = function()
  {
    J.STAR.Aliased.Scene_Map.update.call(this); //? TODO: Modify encountereffect here.
  };

  /**
   * OVERWRITE Modifies the event command handler of "Battle Processing" to prepare for
   * star battle instead of a default battle.
   * @param {any} params The parameters from the event command.
   * @returns {boolean}
   */
  Game_Interpreter.prototype.command301 = function(params)
  {
    var _this = this;

    if (!$gameParty.inBattle())
    {
      var troopId;

      if (params[0] === 0)
      {
        // Direct designation
        troopId = params[1];
      }
      else if (params[0] === 1)
      {
        // Designation with a variable
        troopId = $gameVariables.value(params[1]);
      }
      else
      {
        // Same as Random Encounters
        troopId = $gamePlayer.makeEncounterTroopId();
      }

      if ($dataTroops[troopId])
      {
        BattleManager.setup(troopId, params[2], params[3]);
        BattleManager.setEventCallback(function(n)
        {
          _this._branch[_this._indent] = n;
        });
        $gamePlayer.makeEncounterCount(); // SceneManager.push(Scene_Battle);

        $gamePlayer.prepareForStarBattle();
      }
    }

    return true;
  };

  /**
   * Extends `update` to also update the flow of star battle.
   */

  J.STAR.Aliased.Game_Map.update = Game_Map.prototype.update;

  Game_Map.prototype.update = function()
  {
    J.STAR.Aliased.Game_Map.update.call(this);
    this.updateStarBattle();
  };
  /**
   * Manage the flow of star battle.
   */

  Game_Map.prototype.updateStarBattle = function()
  {
    if (BattleManager.waiting())
    {
      console.log('waiting...');
      return;
    }

    var currentPhase = BattleManager.getStarPhase();

    switch (currentPhase)
    {
      case DISENGAGED:
        // do nothing while disengaged.
        break;

      case PREPARING:
        this.starPhasePrepare();
        break;

      case INBATTLE:
        this.starPhaseInBattle();
        break;

      case FINISHED:
        this.starPhaseFinished();
        break;
    }
  }; //#region phase 1 - prepare

  /**
   * The "prepare" star phase.
   * The transition to the battlemap and generation of the troop onto the field.
   */

  Game_Map.prototype.starPhasePrepare = function()
  {
    var _battleMapId;

    var battleMapId = null;

    if ($dataMap.meta && $dataMap.meta["battleMap"])
    {
      battleMapId = $dataMap.meta["battleMap"];
    }

    var origin = {
      mapId: $gameMap.mapId(),
      x: $gamePlayer.x,
      y: $gamePlayer.y
    };
    BattleManager.setupStarBattle(origin,
      (_battleMapId = battleMapId) !== null && _battleMapId !== void 0 ? _battleMapId : J.STAR.DefaultValues.EnemyMap);
    BattleManager.playBattleBgm();
  };
  /**
   * Handles the post-transfer setup for star battle.
   */

  Game_Map.prototype.postTransferEnemyParsing = function()
  {
    if (BattleManager.getStarPhase() === PREPARING)
    {
      $gameTroop.members().forEach(this.generateStarEnemy);
      BattleManager.setStarPhase(INBATTLE.key);
    }
  };
  /**
   * Generates an enemy and transplants it in the place of the corresponding index
   * of the eventId on the battle map.
   * @param {Game_Enemy} gameEnemy The enemy battler from the troop.
   * @param {number} index The index of the enemy battler in the troop.
   */

  Game_Map.prototype.generateStarEnemy = function(gameEnemy, index)
  {
    // stop generating enemies if we reached the max count.
    if (index >= J.STAR.DefaultValues.MaxEnemyCount)
    {
      console.warn("Exceeded enemy count limit of ".concat(J.STAR.DefaultValues.MaxEnemyCount, "."));
      return;
    }

    var enemyData = JsonEx.makeDeepCopy(BattleManager.enemyMap.events[gameEnemy.enemyId()]);
    var originalEvent = $dataMap.events[index + 1];
    enemyData.x = originalEvent.x;
    enemyData.y = originalEvent.y;
    $dataMap.events[index + 1] = enemyData;
    var newEnemy = new Game_Event(J.STAR.DefaultValues.EnemyMap, index + 1);
    $gameMap._events[index] = newEnemy;
  }; //#endregion phase 1 - prepare
  //#region phase 2 - inbattle

  /**
   * Handles the monitoring of battle-ending conditions, such as defeating all enemies.
   */

  Game_Map.prototype.starPhaseInBattle = function()
  {
    var enemiesRemaining = $gameTroop.areEnemiesAlive();
    console.log("enemies remaining: ".concat(enemiesRemaining, "."));

    if (enemiesRemaining <= 0)
    {
      console.log("victory condition met: all enemies defeated!");
      this.starVictoryConditionMet();
    }
  };
  /**
   * Upon reaching a victory over the enemy troop, transition to the next phase.
   */

  Game_Map.prototype.starVictoryConditionMet = function()
  {
    AudioManager.fadeOutBgm(1);
    BattleManager.playVictoryMe();
    BattleManager.setStarPhase(FINISHED.key);
    BattleManager.setWait(240);
  }; //#endregion phase 2 - inbattle
  //#region phase 3 - finished

  /**
   * The conclusion phase of the star battle.
   */

  Game_Map.prototype.starPhaseFinished = function()
  {
    this.returnPlayerToOrigin();
    AudioManager.stopMe();
    BattleManager.setStarPhase(DISENGAGED.key);
    BattleManager.disengageInBattle();
  };
  /**
   * Returns the player from whence they came.
   */

  Game_Map.prototype.returnPlayerToOrigin = function()
  {
    var _BattleManager$origin = BattleManager.origin(),
      mapId = _BattleManager$origin.mapId,
      x = _BattleManager$origin.x,
      y = _BattleManager$origin.y;

    $gamePlayer.reserveTransfer(mapId, x, y);
  }; //#endregion phase 3 - finished
  //#region phase 4 - cleanup
  //#endregion phase 4 - cleanup
  //#region phase 5 - backtomap
  //#endregion phase 5 - backtomap

  /**
   * The optimal hook for when to parse out the enemies from the troop
   * and create JABS enemies out of each of them.
   */

  J.STAR.Aliased.Game_Player.clearTransferInfo = Game_Player.prototype.clearTransferInfo;

  Game_Player.prototype.clearTransferInfo = function()
  {
    J.STAR.Aliased.Game_Player.clearTransferInfo.call(this);
    $gameMap.postTransferEnemyParsing();
  };
  /**
   * Extends `executeEncounter` to include preparing for star battle.
   */

  J.STAR.Aliased.Game_Player.executeEncounter = Game_Player.prototype.executeEncounter;

  Game_Player.prototype.executeEncounter = function()
  {
    var base = J.STAR.Aliased.Game_Player.executeEncounter.call(this);

    if (base)
    {
      BattleManager.setStarPhase(PREPARING.key);
    }

    return base;
  };

  J.STAR.Aliased.Game_Troop.initialize = Game_Troop.prototype.initialize;

  Game_Troop.prototype.initialize = function()
  {
    this.initMembers();
    J.STAR.Aliased.Game_Troop.initialize.call(this);
  };
  /**
   * Initializes other properties for this class.
   */

  Game_Troop.prototype.initMembers = function()
  {
    /**
     * The number of remaining enemies on the current map.
     * @type {number}
     */
    this._remainingEnemyCount = 0;
  };

  Game_Troop.prototype.updateRemainingEnemyCount = function()
  {
    this._remainingEnemyCount = $gameMap.getOpposingBattlers($jabsEngine.getPlayerJabsBattler()).length;
    return this._remainingEnemyCount;
  };

  Game_Troop.prototype.areEnemiesAlive = function()
  {
    return this.updateRemainingEnemyCount();
  };

}());
//# sourceMappingURL=J-ABS-STAR.js.map
