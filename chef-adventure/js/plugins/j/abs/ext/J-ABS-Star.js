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
 * ============================================================================
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.ABS.EXT.STAR = {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }

  // Check to ensure we have the minimum required version of the J-ABS plugin.
  const requiredJabsVersion = '3.1.0';
  const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.Version, requiredJabsVersion);
  if (!hasJabsRequirement)
  {
    throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
  }
})();
//endregion version check

/**
 * The metadata for this plugin.
 */
J.ABS.EXT.STAR.Metadata = {};
J.ABS.EXT.STAR.Metadata.Name = 'J-ABS-STAR';
J.ABS.EXT.STAR.Metadata.Version = '1.0.0';

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.ABS.EXT.STAR.PluginParameters = PluginManager.parameters(J.ABS.EXT.STAR.Metadata.Name);

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
  MaxEnemyCount: 12,
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
  Scene_Map: new Map(),
};

J.ABS.EXT.STAR.Regexp = {
  BattleMapId: /<battleMapId:(\d+)>/gi,
};

/**
 * A simple container of the coordinates of a destination.
 */
class StarOrigin
{
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
  constructor(mapId, x, y)
  {
    this.mapId = mapId;
    this.x = x;
    this.y = y;
  }
}

/**
 * A single phase in the stars battle.
 */
class StarPhase
{
  /**
   * Constructor.
   * @param {string} name The name of the phase.
   * @param {number} key The number of this phase.
   */
  constructor(name, key)
  {
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
}

/**
 * A collection of {@link StarPhase}s that represent the flow of a star battle.
 * @type {StarPhases}
 */
BattleManager.starPhases = new StarPhases();

/**
 * A constellation of phases in the stars of battle.
 */
class StarPhases
{
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
}

/**
 * The `enemyMap` is a property containing the master map from which enemies
 * from the troop are derived from.
 * @type {{events: Game_Event[]}}
 */
BattleManager.enemyMap = BattleManager.enemyMap || { events: [] };

/**
 * Extends `initMembers` to include our members as well.
 */
J.ABS.EXT.STAR.Aliased.BattleManager.set('initMembers', BattleManager.initMembers);
BattleManager.initMembers = function()
{
  // perform original logic.
  J.ABS.EXT.STAR.Aliased.BattleManager.get('initMembers')
    .call(this);

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
BattleManager.getStarPhase = function()
{
  return this._starPhase ?? StarPhases.DISENGAGED;
};

/**
 * Sets the current phase of star battle to the new one by the phase's key.
 * @param {StarPhase} starPhase The new star phase to be.
 */
BattleManager.setStarPhase = function(starPhase)
{
  this._starPhase = starPhase;
};

/**
 * Gets the wait timer.
 * @returns {JABS_Timer}
 */
BattleManager.getWaitTimer = function()
{
  return this._wait;
};

/**
 * Sets the wait timer to countdown from a given value.
 * @param {number} waitFrames The frames to wait for.
 */
BattleManager.setWait = function(waitFrames)
{
  // grab the battle timer.
  const timer = this.getWaitTimer();

  // reset the time back to defaults.
  timer.reset();

  // set the new maximum.
  timer.setMaxTime(waitFrames);
};

/**
 * Gets whether or not we are waiting.
 * @returns {boolean} Whether or not we are waiting.
 */
BattleManager.isWaiting = function()
{
  // grab the battle timer.
  const timer = this.getWaitTimer();

  // if its done, then resume battle.
  if (timer.isTimerComplete()) return false;
};

BattleManager.updateTimer = function()
{
  // grab the battle timer.
  const timer = this.getWaitTimer();

  // then we are waiting too.
  console.log('waiting...');

  // update the timer if its not done.
  timer.update();
};

/**
 * Clears the wait timer.
 */
BattleManager.clearWait = function()
{
  // grab the battle timer.
  const timer = this.getWaitTimer();

  // reset the timer.
  timer.forceComplete();
};

/**
 * Initiates star battle.
 * @param {StarOrigin} originLocation The origin location that the player came from.
 * @param {number} battleMapId The id of the battle map to teleport to.
 */
BattleManager.setupStarBattle = function(originLocation, battleMapId)
{
  // loads the troop data into the battle manager.
  BattleManager.setup($gameTroop.troop().id, true, true);

  // performs the default on-battle-start event hook.
  $gameSystem.onBattleStart();

  // begins the encounter for the player.
  this.engageInBattle();

  // sets the origin location.
  this._originLocation = originLocation;

  //* TODO: add more here for which map id to send based on player's map id?
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
 * @returns {StarOrigin}
 */
BattleManager.origin = function()
{
  return this._originLocation;
};

/**
 * Extends {@link DataManager.createGameObjects}.<br>
 * Includes fetching the enemy map and storing it memory.
 */
J.ABS.EXT.STAR.Aliased.DataManager.set('createGameObjects', DataManager.createGameObjects);
DataManager.createGameObjects = function()
{
  // perform original logic.
  J.ABS.EXT.STAR.Aliased.DataManager.get('createGameObjects')
    .call(this);

  // load the enemy master map into memory.
  DataManager.getEnemyMasterMap();
};

/**
 * Executes the retrieval of the enemy master map.
 * All JABS battlers are cloned from here.
 */
DataManager.getEnemyMasterMap = function()
{
  // determine the map id of the enemy map.
  const mapId = J.ABS.EXT.STAR.DefaultValues.EnemyMap;

  // check to make sure the map id is valid.
  if (mapId > 0)
  {
    // generate the map file name.
    const filename = "Map%1.json".format(mapId.padZero(3));

    // load the enemy map into memory.
    this.loadEnemyMasterMap("$dataMap", filename);
  }
  // the map id wasn't correct!
  else
  {
    throw new Error("Missing enemy master map.");
  }
};

/**
 * Retrieves the enemy master map.
 * @param {string} name The name of the file to retrieve.
 * @param {string} src The source.
 */
DataManager.loadEnemyMasterMap = function(name, src)
{
  // TODO: replace with native "fetch"?
  // the copy pasta logic for fetching a resource, specifically our enemy map.
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
DataManager.onEnemyMapGet = function(xhr, name, src, url)
{
  if (xhr.status < 400)
  {
    // the enemy map data lives on the battle manager.
    BattleManager.enemyMap = JSON.parse(xhr.responseText);
  }
  else
  {
    // TODO: throw an error- the enemy map is REQUIRED.
    this.gracefulFail(name, src, url);
  }
};

/**
 * Overrides {@link Game_Interpreter.command301}.<br>
 * Alters the event command handler of "Battle Processing".
 * Replaces the default battle setup with our star battle setup instead.
 * @param {any} params The parameters from the event command.
 * @returns {boolean}
 */
Game_Interpreter.prototype.command301 = function(params)
{
  // we cannot engage in battle if already in battle.
  if ($gameParty.inBattle()) return true;

  const [ designationType, troopIdentifier, canEscape, canLose ] = params;

  // makes sure we don't do this if we're already in-battle.
  // convert the params into a troop id.
  const troopId = this.command301convertToTroopId(designationType, troopIdentifier);

  // check what the troop is for that troop id.
  const hasTroop = !!$dataTroops[troopId];

  // check to ensure there is a valid troop.
  if (hasTroop)
  {
    // setup the battle manager with the troop data.
    BattleManager.setup(troopId, canEscape, canLose);

    // do event things.
    BattleManager.setEventCallback(n => this._branch[this._indent] = n);

    // update the encounter count (???).
    $gamePlayer.makeEncounterCount();

    // TODO: do we need to do something about this?
    // SceneManager.push(Scene_Battle);
    //$gamePlayer.prepareForStarBattle(); // non-existing method in source or present.
  }
  return true;
};

/**
 * Retrieves the troop id based on the given designation type.
 * @param {number} designationType The type of designation from the event command.
 * @param {number} troopIdentifier The potential identifier provided in the params.
 * @returns {number} The troop id.
 */
Game_Interpreter.prototype.command301convertToTroopId = function(designationType, troopIdentifier)
{
  switch (designationType)
  {
    // zero = "direct designation" of the troop id.
    case 0:
      return troopIdentifier;

    // one = "variable designation" of the troop id.
    case 1:
      return $gameVariables.value(troopIdentifier);

    // two = "random encounter designation" of the troop id.
    case 2:
      return $gamePlayer.makeEncounterTroopId();
  }

  console.error(`invalid event command params, `, designationType, troopIdentifier);
  throw new Error('borked');
};

/**
 * Extends {@link Game_Map.update}.<br>
 * Also update the flow of star battle.
 */
J.ABS.EXT.STAR.Aliased.Game_Map.set('update', Game_Map.prototype.update);
Game_Map.prototype.update = function()
{
  // perform original logic.
  J.ABS.EXT.STAR.Aliased.Game_Map.get('update')
    .call(this);

  // update the flow of star battle.
  this.updateStarBattle();
};

/**
 * Manage the flow of star battle.
 */
Game_Map.prototype.updateStarBattle = function()
{
  // if we're in battle, keep the timer running!
  if (BattleManager.isInBattle())
  {
    // update the timer.
    BattleManager.updateTimer();
  }

  // check if we can update.
  if (!this.canUpdateStarBattle()) return;

  // update the star phases of battle!
  this.updateStarBattlePhases();
};

/**
 * Determines whether or not the star battle flow can be updated.
 * @returns {boolean} True if it can be updated, false otherwise.
 */
Game_Map.prototype.canUpdateStarBattle = function()
{
  // we cannot update if the battle manager is waiting.
  if (BattleManager.isWaiting()) return false;

  // update star battle!
  return true;
};

/**
 * Ensures that the correct logic loop is being executed based on the current
 * star phase of battle.
 */
Game_Map.prototype.updateStarBattlePhases = function()
{
  // grab the current phase of battle.
  const currentPhase = BattleManager.getStarPhase();

  // pivot logic based on the current phase.
  switch (currentPhase)
  {
    case StarPhases.DISENGAGED:
      // do nothing while disengaged.
      break;
    case StarPhases.PREPARING:
      // preparation includes setting up enemies.
      this.starPhasePrepare();
      break;
    case StarPhases.INBATTLE:
      // in-battle is run most often.
      this.starPhaseInBattle();
      break;
    case StarPhases.FINISHED:
      this.starPhaseFinished();
      break;
    case StarPhases.CLEANUP:
      break;
    case StarPhases.BACKTOMAP:
      break;
    default:
      break;
  }
};

//region phase 1 - prepare
/**
 * The "prepare" star phase.
 * The transition to the battlemap and generation of the troop onto the field.
 */
Game_Map.prototype.starPhasePrepare = function()
{
  // initialize the battle map id.
  let battleMapId = null;
  if ($dataMap.meta && $dataMap.meta["battleMap"])
  {
    // grab the map id from this map's metadata.
    battleMapId = $dataMap.meta["battleMap"];
  }

  // build the origin point of the star battle for the player.
  const origin = new StarOrigin($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);

  // transfer them to the star battlefield.
  BattleManager.setupStarBattle(origin, battleMapId ?? J.ABS.EXT.STAR.DefaultValues.EnemyMap);

  // engage battle music.
  BattleManager.playBattleBgm();
};

/**
 * Handles the post-transfer setup for star battle.
 */
Game_Map.prototype.postTransferEnemyParsing = function()
{
  // post-transfer only happens once during the PREPARING phase.
  if (BattleManager.getStarPhase() !== StarPhases.PREPARING) return;

  // iterate over each of the members of the troop and convert them to a JABS battler.
  $gameTroop.members()
    .forEach(this.generateStarEnemy);

  // engage in the stars of battle!
  BattleManager.setStarPhase(StarPhases.INBATTLE);
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
  if (index >= J.ABS.EXT.STAR.DefaultValues.MaxEnemyCount)
  {
    console.warn(`Exceeded enemy count limit of ${J.ABS.EXT.STAR.DefaultValues.MaxEnemyCount}.`);
    return;
  }

  // TODO: abstract and modernize this logic based on JABS.
  // clone the enemy data from the enemy map.
  const enemyData = JsonEx.makeDeepCopy(BattleManager.enemyMap.events[gameEnemy.enemyId()]);

  // for usage in the arrays around the database, the 1st item of the arrays are null.
  const normalizedIndex = index + 1;

  // grab reference to the corresponding enemy index on the map.
  const originalEvent = $dataMap.events[normalizedIndex];

  // assign our cloned event the original event's x and y coordinates.
  enemyData.x = originalEvent.x;
  enemyData.y = originalEvent.y;

  // update the metadata of the map with our data instead.
  $dataMap.events[normalizedIndex] = enemyData;

  // generate a new event based on this JABS enemy.
  const newEnemy = new Game_Event(J.ABS.EXT.STAR.DefaultValues.EnemyMap, normalizedIndex);

  // TODO: update this, this is almost certainly broken logic after the delete update!
  // directly assign the event index to the enemies.
  $gameMap._events[index] = newEnemy;
};
//endregion phase 1 - prepare

//region phase 2 - inbattle
/**
 * The second phase of star battle, {@link StarPhases.INBATTLE}.<br>
 * Handles the monitoring of victory conditions for battle, to switch to the
 * next star phase.
 */
Game_Map.prototype.starPhaseInBattle = function()
{
  // check if there are enemies still alive on this map.
  const enemiesRemaining = $gameTroop.areEnemiesAlive();
  console.log(`enemies remaining: ${enemiesRemaining}.`);

  // the only victory condition is to eliminate all enemies on the map.
  if (enemiesRemaining <= 0)
  {
    // we have achieved victory!
    this.onStarVictory();
    console.log("victory condition met: all enemies defeated!");
  }
};

/**
 * Upon reaching a victory over the enemy troop, transition to the next phase.
 */
Game_Map.prototype.onStarVictory = function()
{
  // fade out the music.
  AudioManager.fadeOutBgm(1);

  // play some victory music.
  BattleManager.playVictoryMe();

  // set the new phase to FINISHED for cleanup.
  BattleManager.setStarPhase(StarPhases.FINISHED);

  // stall for 4 seconds before transition to the next star phase.
  BattleManager.setWait(240);
};
//endregion phase 2 - inbattle

//region phase 3 - finished
/**
 * The third phase of star battle, {@link StarPhases.CLEANUP}.<br>
 * This is typically the conclusion of battle, including replacing the character
 * and moving onto the next phase.
 */
Game_Map.prototype.starPhaseFinished = function()
{
  // return the player to their origin.
  this.returnPlayerToOrigin();

  // halt the victory music.
  AudioManager.stopMe();

  // set the new phase to DISENGAGED, battle is over.
  BattleManager.setStarPhase(StarPhases.DISENGAGED);

  // let the battle manager know we're finished- for now.
  BattleManager.disengageInBattle();
};

/**
 * Returns the player from whence they came.
 */
Game_Map.prototype.returnPlayerToOrigin = function()
{
  $gamePlayer.reserveOriginTransfer();
};
//endregion phase 3 - finished

//region phase 4 - cleanup
//endregion phase 4 - cleanup

//region phase 5 - backtomap
//endregion phase 5 - backtomap

/**
 * Extends {@link Game_Player.clearTransferInfo}.<br>
 * Parse out enemy data from the troop and convert them into JABS battlers.
 */
J.ABS.EXT.STAR.Aliased.Game_Player.set('clearTransferInfo', Game_Player.prototype.clearTransferInfo);
Game_Player.prototype.clearTransferInfo = function()
{
  // perform original logic.
  J.ABS.EXT.STAR.Aliased.Game_Player.get('clearTransferInfo')
    .call(this);

  // also parse the event data to produce JABS Battlers.
  $gameMap.postTransferEnemyParsing();
};

/**
 * Extends {@link Game_Player.executeEncounter}.<br>
 * Includes preparation for the stars of battle.
 */
J.ABS.EXT.STAR.Aliased.Game_Player.set('executeEncounter', Game_Player.prototype.executeEncounter);
Game_Player.prototype.executeEncounter = function()
{
  // intercept original logic.
  const base = J.ABS.EXT.STAR.Aliased.Game_Player.get('executeEncounter')
    .call(this);

  // check if we have an encounter.
  if (base)
  {
    // prepare the stars of battle!
    BattleManager.setStarPhase(StarPhases.PREPARING);
  }

  // return to continue with flow.
  return base;
};

Game_Player.prototype.reserveOriginTransfer = function()
{
  const {
    mapId,
    x,
    y
  } = BattleManager.origin();
  this.reserveTransfer(mapId, x, y);
};

/**
 * Extends {@link Game_Troop.initialize}.<br>
 * Initializes our additional members for STABS.
 */
J.ABS.EXT.STAR.Aliased.Game_Troop.set('initialize', Game_Troop.prototype.initialize);
Game_Troop.prototype.initialize = function()
{
  // perform original logic.
  J.ABS.EXT.STAR.Aliased.Game_Troop.get('initialize')
    .call(this);

  // initialize the STABS members.
  this.initMembers();
};

/**
 * Initializes additional properties for this class.
 */
Game_Troop.prototype.initMembers = function()
{
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
Game_Troop.prototype.getRemainingEnemyCount = function()
{
  return this._j._abs._remainingEnemyCount;
};

/**
 * Updates the current number of living enemies on this map.
 */
Game_Troop.prototype.updateRemainingEnemyCount = function()
{
  // update the remaining enemy count.
  this._remainingEnemyCount = JABS_AiManager.getOpposingBattlers($jabsEngine.getPlayer1()).length;
};

/**
 * Gets whether or there are still enemies alive on this map.
 */
Game_Troop.prototype.areEnemiesAlive = function()
{
  return this.getRemainingEnemyCount() > 0;
};

/**
 * Overrides {@link Scene_Map.updateEncounter}.<br>
 * Disables base encounter scene management.
 */
Scene_Map.prototype.updateEncounter = function()
{
  // checks to see if we can execute an encounter from this perspective.
  if ($gamePlayer.executeEncounter())
  {
    // performs a visual fade out effect.
    this.startFadeOut();
  }
};

/**
 * `updateEncounterEffect` handles the zoom/flashing battle transition.
 */
J.ABS.EXT.STAR.Aliased.Scene_Map.set('update', Scene_Map.prototype.update);
Scene_Map.prototype.update = function()
{
  // perform original logic.
  J.ABS.EXT.STAR.Aliased.Scene_Map.get('update')
    .call(this);

  //? TODO: Modify encountereffect here.
};