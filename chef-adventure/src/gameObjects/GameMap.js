import { StarPhases } from "../models/_models";

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
  if (BattleManager.waiting()) {
    console.log('waiting...');
    return;
  }

  const currentPhase = BattleManager.getStarPhase();
  switch (currentPhase) {
    case StarPhases.DISENGAGED:
      // do nothing while disengaged.
      break;
    case StarPhases.PREPARING:
      this.starPhasePrepare();
      break;
    case StarPhases.INBATTLE:
      this.starPhaseInBattle();
      break;
    case StarPhases.FINISHED:
      this.starPhaseFinished();
      break;
    case StarPhases.CLEANUP:
      break;
    case StarPhases.BACKTOMAP:
      break;
    default: break;
  }
};

//#region phase 1 - prepare
/**
 * The "prepare" star phase.
 * The transition to the battlemap and generation of the troop onto the field.
 */
Game_Map.prototype.starPhasePrepare = function() {
  let battleMapId = null;
  if ($dataMap.meta && $dataMap.meta["battleMap"]) {
    battleMapId = $dataMap.meta["battleMap"];
  }

  const origin = {
    mapId: $gameMap.mapId(),
    x: $gamePlayer.x,
    y: $gamePlayer.y
  };
  BattleManager.setupStarBattle(origin, battleMapId ?? J.STAR.DefaultValues.EnemyMap);
  BattleManager.playBattleBgm();
};

/**
 * Handles the post-transfer setup for star battle.
 */
 Game_Map.prototype.postTransferEnemyParsing = function() {
  if (BattleManager.getStarPhase() === StarPhases.PREPARING) {
    $gameTroop.members().forEach(this.generateStarEnemy);
    BattleManager.setStarPhase(StarPhases.INBATTLE.key);
  }
};

/**
 * Generates an enemy and transplants it in the place of the corresponding index
 * of the eventId on the battle map. 
 * @param {Game_Enemy} gameEnemy The enemy battler from the troop.
 * @param {number} index The index of the enemy battler in the troop.
 */
 Game_Map.prototype.generateStarEnemy = function(gameEnemy, index) {
  // stop generating enemies if we reached the max count.
  if (index >= J.STAR.DefaultValues.MaxEnemyCount) {
    console.warn(`Exceeded enemy count limit of ${J.STAR.DefaultValues.MaxEnemyCount}.`)
    return;
  }

  const enemyData = JsonEx.makeDeepCopy(BattleManager.enemyMap.events[gameEnemy.enemyId()]);
  const originalEvent = $dataMap.events[index+1];
  enemyData.x = originalEvent.x;
  enemyData.y = originalEvent.y;
  $dataMap.events[index+1] = enemyData;
  const newEnemy = new Game_Event(J.STAR.DefaultValues.EnemyMap, index+1);
  $gameMap._events[index] = newEnemy;
};
//#endregion phase 1 - prepare

//#region phase 2 - inbattle
/**
 * Handles the monitoring of battle-ending conditions, such as defeating all enemies.
 */
Game_Map.prototype.starPhaseInBattle = function() {
  const enemiesRemaining = $gameTroop.areEnemiesAlive();
  console.log(`enemies remaining: ${enemiesRemaining}.`);
  if (enemiesRemaining <= 0) {
    console.log("victory condition met: all enemies defeated!");
    this.starVictoryConditionMet();
  } 
};

/**
 * Upon reaching a victory over the enemy troop, transition to the next phase.
 */
Game_Map.prototype.starVictoryConditionMet = function() {
  AudioManager.fadeOutBgm(1);
  BattleManager.playVictoryMe();
  BattleManager.setStarPhase(StarPhases.FINISHED.key);
  BattleManager.setWait(240);
};
//#endregion phase 2 - inbattle

//#region phase 3 - finished
/**
 * The conclusion phase of the star battle.
 */
Game_Map.prototype.starPhaseFinished = function() {
  this.returnPlayerToOrigin();
  AudioManager.stopMe();
  BattleManager.setStarPhase(StarPhases.DISENGAGED.key);
  BattleManager.disengageInBattle();
};

/**
 * Returns the player from whence they came.
 */
Game_Map.prototype.returnPlayerToOrigin = function() {
  const { mapId, x, y } = BattleManager.origin();
  $gamePlayer.reserveTransfer(mapId, x, y);
};
//#endregion phase 3 - finished

//#region phase 4 - cleanup
//#endregion phase 4 - cleanup

//#region phase 5 - backtomap
//#endregion phase 5 - backtomap