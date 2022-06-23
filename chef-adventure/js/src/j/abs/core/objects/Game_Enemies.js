//#region Game_Enemies
/**
 * A class for retrieving a particular enemy.
 */
function Game_Enemies()
{
  this.initialize(...arguments);
}

/**
 * Initializes this `Game_Enemies` class.
 */
Game_Enemies.prototype.initialize = function()
{
  this._data = [];
};

/**
 * Looks up and caches an enemy of the given id.
 * @param {number} enemyId The id to look up an enemy for.
 * @returns {Game_Enemy}
 */
Game_Enemies.prototype.enemy = function(enemyId)
{
  // check to make sure there is a matching enemy in the database.
  if ($dataEnemies[enemyId])
  {
    // check if our cache has this enemy entry.
    if (!this._data[enemyId])
    {
      this._data[enemyId] = new Game_Enemy(enemyId, null, null);
    }

    return this._data[enemyId];
  }
  return null;
};
//#endregion Game_Enemies