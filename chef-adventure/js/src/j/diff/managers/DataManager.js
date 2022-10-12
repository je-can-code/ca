/**
 * Extends {@link DataManager.setupNewGame}.
 * Includes difficulty setup for new games.
 */
J.DIFFICULTY.Aliased.DataManager.set('setupNewGame', DataManager.setupNewGame);
DataManager.setupNewGame = function()
{
  // perform original logic.
  J.DIFFICULTY.Aliased.DataManager.get('setupNewGame').call(this);

  // setup the difficulty layers in the temp data.
  $gameTemp.setupDifficultySystem();
};