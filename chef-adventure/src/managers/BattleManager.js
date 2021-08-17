
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