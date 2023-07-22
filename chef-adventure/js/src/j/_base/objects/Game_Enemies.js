//region Game_Enemies
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
    const enemy = new Game_Enemy(enemyId, 0, 0);

    // add the new enemy to the cache.
    this.#cache.set(enemyId, enemy);

    // return the enemy.
    return enemy;
  }
}
//endregion Game_Enemies