//region DifficultyManager
/**
 * A static class to manage the difficulties with.
 */
class DifficultyManager
{
  /**
   * Gets all difficulties defined, including locked difficulties.
   * @returns {DifficultyLayer[]}
   */
  static allDifficulties()
  {
    // grab the difficulties available.
    const difficultyLayersSource = $gameTemp.getAllDifficultyLayers();

    // initialize the running collection.
    const difficultyLayers = [];

    // map each of the items to the array.
    difficultyLayersSource.forEach(layer => difficultyLayers.push(layer));

    // return the compiled array of all difficulty layers.
    return difficultyLayers;
  }

  /**
   * Gets all available difficulties.
   * @returns {DifficultyLayer[]}
   */
  static availableDifficulties()
  {
    // a filtering function for the list of difficulties to populate the list.
    const filtering = difficultyLayer =>
    {
      // if the difficulty isn't visible, it isn't "available".
      if (difficultyLayer.isHidden()) return false;

      // this layer is available.
      return true;
    };

    // return the filtered collection of difficulties.
    return this.allDifficulties().filter(filtering);
  }

  /**
   * Gets the difficulty by its key.
   * Centralized if needing refactoring down the road.
   * @param {string} key The key of the difficulty to find.
   * @returns {DifficultyLayer|undefined} The difficulty if the key exists, undefined otherwise.
   */
  static #getDifficultyByKey = key => $gameTemp.findDifficultyLayerByKey(key);

  /**
   * Re-evaluates all currently enabled difficulties and refreshes the applied difficulty.
   */
  static refreshAppliedDifficulty = () => $gameTemp.refreshAppliedDifficulty();

  /**
   * Locks the difficulty with the given key.
   * @param {string} key The difficulty key to lock.
   */
  static lockDifficulty(key)
  {
    // grab the difficulty.
    const foundDifficulty = this.#getDifficultyByKey(key);

    // validate we found it.
    if (foundDifficulty)
    {
      // lock it.
      foundDifficulty.lock();
    }
    // we didn't find a difficulty by that key.
    else
    {
      console.warn(`could not lock difficulty with key: [${key}].`);
    }
  }

  /**
   * Unlocks the difficulty with the given key.
   * @param {string} key The difficulty key to unlock.
   */
  static unlockDifficulty(key)
  {
    // grab the difficulty.
    const foundDifficulty = this.#getDifficultyByKey(key);

    // validate we found it.
    if (foundDifficulty)
    {
      // unlock it.
      foundDifficulty.unlock();
    }
    // we didn't find a difficulty by that key.
    else
    {
      console.warn(`could not lock difficulty with key: [${key}].`);
    }
  }

  /**
   * Hides the difficulty with the given key.
   * @param {string} key The difficulty key to hide.
   */
  static hideDifficulty(key)
  {
    // grab the difficulty.
    const foundDifficulty = this.#getDifficultyByKey(key);

    // validate we found it.
    if (foundDifficulty)
    {
      // hide it.
      foundDifficulty.hide();
    }
    // we didn't find a difficulty by that key.
    else
    {
      console.warn(`could not lock difficulty with key: [${key}].`);
    }
  }

  /**
   * Reveals the difficulty with the given key.
   * @param {string} key The difficulty key to reveal.
   */
  static unhideDifficulty(key)
  {
    // grab the difficulty.
    const foundDifficulty = this.#getDifficultyByKey(key);

    // validate we found it.
    if (foundDifficulty)
    {
      // unhide it.
      foundDifficulty.unhide();
    }
    // we didn't find a difficulty by that key.
    else
    {
      console.warn(`could not unlock difficulty with key: [${key}].`);
    }
  }

  /**
   * Enables the difficulty with the given key.
   * @param {string} key The difficulty key to enable.
   */
  static enableDifficulty(key)
  {
    // grab the difficulty.
    const foundDifficulty = this.#getDifficultyByKey(key);

    // validate we found it.
    if (foundDifficulty)
    {
      // enable it.
      foundDifficulty.enable();

      // refresh the applied difficulty since this is now enabled.
      this.refreshAppliedDifficulty();
    }
    // we didn't find a difficulty by that key.
    else
    {
      console.warn(`could not enable difficulty with key: [${key}].`);
    }
  }

  /**
   * Disables the difficulty with the given key.
   * @param {string} key The difficulty key to disable.
   */
  static disableDifficulty(key)
  {
    // grab the difficulty.
    const foundDifficulty = this.#getDifficultyByKey(key);

    // validate we found it.
    if (foundDifficulty)
    {
      // disable it.
      foundDifficulty.disable();

      // refresh the applied difficulty since this is now disabled.
      this.refreshAppliedDifficulty();
    }
    // we didn't find a difficulty by that key.
    else
    {
      console.warn(`could not disable difficulty with key: [${key}].`);
    }
  }
}
//endregion DifficultyManager