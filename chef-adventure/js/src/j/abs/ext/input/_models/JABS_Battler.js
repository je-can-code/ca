//region JABS_Battler
/**
 * Generates a `JABS_Battler` based on the current leader of the party.
 * Also assigns the controller inputs for the player.
 */
J.ABS.EXT.INPUT.Aliased.JABS_Battler.set('createPlayer', JABS_Battler.createPlayer);
JABS_Battler.createPlayer = function()
{
  // intercept return data from original logic.
  const playerJabsBattler = J.ABS.EXT.INPUT.Aliased.JABS_Battler.get('createPlayer').call(this);

  // assign newly players are created to controller 1.
  $jabsController1.battler = playerJabsBattler;

  // return original logic data.
  return playerJabsBattler;
};
//endregion JABS_Battler