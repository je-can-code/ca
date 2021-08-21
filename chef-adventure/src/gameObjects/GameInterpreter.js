/**
 * OVERWRITE Modifies the event command handler of "Battle Processing" to prepare for
 * star battle instead of a default battle.
 * @param {any} params The parameters from the event command.
 * @returns {boolean}
 */
Game_Interpreter.prototype.command301 = function(params) {
  if (!$gameParty.inBattle()) {
      let troopId;
      if (params[0] === 0) {
          // Direct designation
          troopId = params[1];
      } else if (params[0] === 1) {
          // Designation with a variable
          troopId = $gameVariables.value(params[1]);
      } else {
          // Same as Random Encounters
          troopId = $gamePlayer.makeEncounterTroopId();
      }
      if ($dataTroops[troopId]) {
          BattleManager.setup(troopId, params[2], params[3]);
          BattleManager.setEventCallback(n => {
              this._branch[this._indent] = n;
          });
          $gamePlayer.makeEncounterCount();
          // SceneManager.push(Scene_Battle);
          $gamePlayer.prepareForStarBattle();
      }
  }
  return true;
};