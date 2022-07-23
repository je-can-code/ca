//#region Game_Enemies
/**
 * A class for retrieving a particular enemy.
 */
// function Game_Enemies()
// {
//   this.initialize(...arguments);
// }
//
// /**
//  * Initializes this `Game_Enemies` class.
//  */
// Game_Enemies.prototype.initialize = function()
// {
//   this._data = [];
// };
//
// /**
//  * Looks up and caches an enemy of the given id.
//  * @param {number} enemyId The id to look up an enemy for.
//  * @returns {Game_Enemy}
//  */
// Game_Enemies.prototype.enemy = function(enemyId)
// {
//   // check to make sure there is a matching enemy in the database.
//   if ($dataEnemies[enemyId])
//   {
//     // check if our cache has this enemy entry.
//     if (!this._data[enemyId])
//     {
//       this._data[enemyId] = new Game_Enemy(enemyId, null, null);
//     }
//
//     return this._data[enemyId];
//   }
//   return null;
// };

/**
 * A class that acts as a lazy dictionary for {@link Game_Enemy} data.
 * Do not use the enemies from this class as actual battlers!
 */
class Game_Enemies
{
  /**
   * A simple cache to store enemies by their ids.
   * @type {Map<number, Game_Enemy>}
   */
  #cache = new Map();

  /**
   * Gets the enemy battler data for the enemy id provided.
   * @param {number} enemyId The enemy id to generate an enemy for.
   * @returns {Game_Enemy} The enemy battler data.
   */
  enemy(enemyId)
  {
    // check if we have the enemy already in the cache.
    if (this.#cache.has(enemyId))
    {
      // return the cached enemy.
      return this.#cache.get(enemyId);
    }

    // create the new enemy.
    const enemy = new Game_Enemy(enemyId, null, null);

    // add the new enemy to the cache.
    this.#cache.set(enemyId, enemy);

    // return the enemy.
    return enemy;
  }
}
//#endregion Game_Enemies