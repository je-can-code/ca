import { StarPhase, StarPhases } from "../models/_models";

/**
 * The `enemyMap` is a property containing the master map from which enemies
 * from the troop are derived from.
 * @type {{events: Game_Event[]}}
 */
BattleManager.enemyMap = BattleManager.enemyMap || { events: [] };

/**
 * Extends `initMembers` to include our members as well.
 */
J.STAR.Aliased.BattleManager.initMembers = BattleManager.initMembers;
BattleManager.initMembers = function() {
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
  this._starPhase = this._starPhase || StarPhases.PREPARING;
};

/**
 * Gets the current phase of star battle the player is in.
 * @returns {StarPhase}
 */
BattleManager.getStarPhase = function(){
  return this._starPhase ?? StarPhases.DISENGAGED;
};

/**
 * Sets the current phase of star battle to the new one by the phase's key.
 * @param {number} newPhaseKey 
 */
BattleManager.setStarPhase = function(newPhaseKey) {
  switch (newPhaseKey) {
    case StarPhases.DISENGAGED.key:
      this._starPhase = StarPhases.DISENGAGED;
      break;
    case StarPhases.PREPARING.key:
      this._starPhase = StarPhases.PREPARING;
      break;
    case StarPhases.INBATTLE.key:
      this._starPhase = StarPhases.INBATTLE;
      break;
    case StarPhases.FINISHED.key:
      this._starPhase = StarPhases.FINISHED;
      break;
    case StarPhases.CLEANUP.key:
      this._starPhase = StarPhases.CLEANUP;
      break;
    case StarPhases.BACKTOMAP.key:
      this._starPhase = StarPhases.BACKTOMAP;
      break;
  }
};

/**
 * Sets the wait timer to countdown from a given value.
 *
 * While the wait value is greater than 0, phases will not update.
 * @param {number} waitFrames The frames to wait for. 
 */
BattleManager.setWait = function(waitFrames) {
  this._wait = waitFrames;
};

/**
 * Gets whether or not we are waiting.
 * @returns {boolean} Whether or not we are waiting.
 */
BattleManager.waiting = function() {
  if (this._wait > 0) {
    this._wait--;
    return true;
  }

  if (this._wait === 0) {
    return false;
  }
};

/**
 * Clears the wait timer.
 */
BattleManager.clearWait = function() {
  this._wait = 0;
  console.info('the wait timer has been cleared.');
};

/**
 * Initiates star battle.
 * @param {{mapId: number, x: number, y: number}} originLocation The origin location that the player came from.
 */
BattleManager.setupStarBattle = function(originLocation, battleMapId) {
  BattleManager.setup($gameTroop.troop().id, true, true);
  $gameSystem.onBattleStart();
  this.engageInBattle();
  this._originLocation = originLocation;

  //* TODO: add more here for which map id to send based on player's map id?
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
 * @returns {{mapId: number, x: number, y: number}}
 */
BattleManager.origin = function() {
  return this._originLocation;
};