/**
 * 
 */
Game_Map.prototype.postTransferEnemyParsing = function() {
  if (BattleManager.preparingForBattle()) {
    $gameTroop.members().forEach((gameEnemy, index) => {
      const enemyId = gameEnemy.enemyId();
      const enemyData = JsonEx.makeDeepCopy(BattleManager.enemyMap.events[enemyId]);
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
 * Extends `update` to also update the flow of star battle.
 */
J.STAR.Aliased.Game_Map.update = Game_Map.prototype.update;
Game_Map.prototype.update = function() {
  J.STAR.Aliased.Game_Map.update.call(this);
  this.updateStarBattle();
};

/**
 * Manage the flow of star battle.
 */
Game_Map.prototype.updateStarBattle = function() {
  if (BattleManager.preparingForBattle()) {
    // do nothing.
  } else if (BattleManager.isInBattle()) {
    if (!$gameTroop.areEnemiesAlive()) {
      this.endStarBattle();
    }
  }

  
};

/**
 * The conclusion phase of the 
 */
Game_Map.prototype.endStarBattle = function() {
  const { mapId, originX, originY } = BattleManager.origin();
  $gamePlayer.reserveTransfer(mapId, originX, originY);
  BattleManager.disengageInBattle();
};