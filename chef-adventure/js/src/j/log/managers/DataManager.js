//#region DataManager
/**
 * The global text logger.
 * @type {Game_TextLog}
 */
var $gameTextLog = null;

/**
 * Hooks into `DataManager` to create the game objects.
 */
J.LOG.Aliased.DataManager.set('createGameObjects', DataManager.createGameObjects);
DataManager.createGameObjects = function()
{
  J.LOG.Aliased.DataManager.get('createGameObjects').call(this);
  $gameTextLog = new Game_TextLog();
};
//#endregion DataManager