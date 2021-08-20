import { StarPhase } from "./models/StarPhase";

BattleManager.enemyMap = BattleManager.enemyMap || { events: [] };

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

  /**
   * The phase of star battle we are in.
   * @type {string}
   */
  this._starPhase = this._starPhase || BattleManager.starPhases.DISENGAGED;
};

/**
 * The various phases of which are available within star battle.
 * The player is ALWAYS in one of these phases while this plugin is active.
 */
BattleManager.starPhases = {
  /**
   * "Disengaged" represents the state of which the player is
   * not in-battle at all. This is the default phase while the player wanders.
   * @type {StarPhase}
   */
  DISENGAGED: {
    name: "Disengaged",
    key: 0
  },

  /**
   * "Preparing" represents the state of which the player is
   * in-transition to battle from either a random or programmatic encounter.
   * @type {StarPhase}
   */
  PREPARING: {
    name: "Preparing",
    key: 1
  },

  /**
   * "In-battle" represents the state of which the player is
   * presently fighting the battle that they encountered.
   * @type {StarPhase}
   */
  INBATTLE: {
    name: "In-battle",
    key: 2
  },

  /**
   * "Finished" represents the state of which the player is
   * has reached an end-condition of battle.
   * @type {StarPhase}
   */
  FINISHED: {
    name: "Finished",
    key: 3
  },

  /**
   * "Clean-up" represents the state of which the player is
   * either reigning victorious, seeing the "you died" screen, or skipping
   * this phase altogether for programmatic (story/dev/etc.) reasons.
   * @type {StarPhase}
   */
  CLEANUP: {
    name: "Clean-up",
    key: 4
  },

  /**
   * "Back-to-map" represents the state of which the player is
   * the player didn't gameover, and is now in transition
   * @type {StarPhase}
   */
  BACKTOMAP: {
    name: "Back-to-map",
    key: 5
  },
};

/**
 * Initiates star battle.
 * @param {number} originMapId The mapId that the player came from.
 * @param {number} originX The `x` coordinate the player came from.
 * @param {number} originY The `y` coordinate the player came from.
 */
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