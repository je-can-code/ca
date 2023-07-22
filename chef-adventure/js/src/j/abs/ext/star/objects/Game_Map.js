/**
 * Extends {@link Game_Map.update}.
 * Also update the flow of star battle.
 */
J.ABS.EXT.STAR.Aliased.Game_Map.set('update', Game_Map.prototype.update);
Game_Map.prototype.update = function()
{
  // perform original logic.
  J.ABS.EXT.STAR.Aliased.Game_Map.get('update').call(this);

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
  $gameTroop.members().forEach(this.generateStarEnemy);

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
 * The second phase of star battle, {@link StarPhases.INBATTLE}.
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
 * The third phase of star battle, {@link StarPhases.CLEANUP}.
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