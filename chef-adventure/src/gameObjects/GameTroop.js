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