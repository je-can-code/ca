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
    this.prepareForStarBattle();
  }

  return base;
};

/**
 * Captures the origin map data for where to send the player back after battle.
 */
Game_Player.prototype.prepareForStarBattle = function() {
  const originMapId = $gameMap.mapId();
  const originX = this.x;
  const originY = this.y;
  const mapMetadata = $dataMap.meta;
  let battleMapId = 109;
  if (mapMetadata && mapMetadata["battleMap"]) {
    battleMapId = mapMetadata["battleMap"];
  }

  BattleManager.prepareForStarBattle(originMapId, originX, originY, battleMapId);
  BattleManager.beginBattlePreparation();
};