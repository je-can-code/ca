import { StarPhases } from "../models/_models";

/**
 * The optimal hook for when to parse out the enemies from the troop
 * and create JABS enemies out of each of them.
 */
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
    BattleManager.setStarPhase(StarPhases.PREPARING.key);
  }

  return base;
};