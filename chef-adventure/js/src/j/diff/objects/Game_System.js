//#region Game_System
/**
 * Extends the `.initialize()` with our difficulty initialization.
 */
J.DIFF.Aliased.Game_System.set('initialize', Game_System.prototype.initialize);
Game_System.prototype.initialize = function()
{
  // perform original logic.
  J.DIFF.Aliased.Game_System.get('initialize').call(this);

  // initializes members for this plugin.
  this.initDifficultyMembers();
};

/**
 * Initializes the Difficulty System.
 */
Game_System.prototype.initDifficultyMembers = function()
{
  /**
   * The over-arching object that contains all properties for this plugin.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with the difficulty system.
   */
  this._j._difficulty ||= {};

  /**
   * All difficulties that were defined in the plugin metadata.
   * @type {Difficulty[]}
   */
  this._j._difficulty.allDifficulties = J.DIFF.Helpers.toDifficulties(J.DIFF.PluginParameters['difficulties'])|| [];

  /**
   * The currently applied difficulty.
   * @type {Difficulty}
   */
  this._j._difficulty.appliedDifficulty ||= this.findDifficultyByKey(J.DIFF.Metadata.DefaultDifficulty);
};

/**
 * Updates the list of all available difficulties from the latest plugin metadata.
 */
J.DIFF.Aliased.Game_System.set('onAfterLoad', Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function()
{
  // perform original logic.
  J.DIFF.Aliased.Game_System.get('onAfterLoad').call(this);

  // update from the latest plugin metadata.
  this.updateDifficultiesFromPluginMetadata();
};

/**
 * Updates the difficulties from the latest plugin metadata.
 */
Game_System.prototype.updateDifficultiesFromPluginMetadata = function()
{
  // refresh the difficulty list from the plugin metadata.
  this._j._difficulty.allDifficulties = J.DIFF.Helpers.toDifficulties(J.DIFF.PluginParameters['difficulties']) || [];

  // grab the currently applied difficulty.
  const currentDifficulty = this.getAppliedDifficulty();

  // check to see if this difficulty went missing.
  if (!this.findDifficultyByKey(currentDifficulty.key))
  {
    console.warn(`The previous difficulty of ${currentDifficulty.key} is no longer valid; resetting to default.`);

    // overwrite the invalid difficulty with the default.
    this.setAppliedDifficulty(this.findDifficultyByKey(J.DIFF.Metadata.DefaultDifficulty));
  }
};

/**
 * Gets all difficulties defined, including locked difficulties.
 * @returns {Difficulty[]}
 */
Game_System.prototype.allDifficulties = function()
{
  return this._j._difficulty.allDifficulties;
};

/**
 * Gets all unlocked and available difficulties.
 * @returns {Difficulty[]}
 */
Game_System.prototype.availableDifficulties = function()
{
  return this.allDifficulties().filter(difficulty => difficulty.unlocked);
};

/**
 * Gets the currently applied difficulty.
 * @returns {Difficulty}
 */
Game_System.prototype.getAppliedDifficulty = function()
{
  return this._j._difficulty.appliedDifficulty;
};

/**
 * Sets the applied difficulty to a new one.
 * @param {Difficulty} difficulty The new difficulty being applied.
 */
Game_System.prototype.setAppliedDifficulty = function(difficulty)
{
  this._j._difficulty.appliedDifficulty = difficulty;
};

/**
 * Finds the difficulty that matches the key provided.
 * Returns null if no difficulty matching the key is found.
 * @param {string} difficultyKey The key to find the difficulty of.
 * @returns {Difficulty|null} The difficulty if found, null otherwise.
 */
Game_System.prototype.findDifficultyByKey = function(difficultyKey)
{
  const foundDifficulty = this.allDifficulties().find(difficulty => difficulty.key === difficultyKey);
  if (foundDifficulty)
  {
    return foundDifficulty;
  }
  else
  {
    console.warn(`could not find difficulty with key: [${difficultyKey}].`);
    return null;
  }
};

/**
 * Locks the difficulty with the given key.
 * @param {string} difficultyKey The difficulty key to lock.
 */
Game_System.prototype.lockDifficulty = function(difficultyKey)
{
  const foundDifficulty = this.findDifficultyByKey(difficultyKey);
  if (foundDifficulty)
  {
    foundDifficulty.lock();
  }
  else
  {
    console.warn(`could not lock difficulty with key: [${difficultyKey}].`);
  }
};

/**
 * Unlocks the difficulty with the given key.
 * @param {string} difficultyKey The difficulty key to unlock.
 */
Game_System.prototype.unlockDifficulty = function(difficultyKey)
{
  const foundDifficulty = this.findDifficultyByKey(difficultyKey);
  if (foundDifficulty)
  {
    foundDifficulty.unlock();
  }
  else
  {
    console.warn(`could not unlock difficulty with key: [${difficultyKey}].`);
  }
};

/**
 * Hides the difficulty with the given key.
 * @param {string} difficultyKey The difficulty key to hide.
 */
Game_System.prototype.hideDifficulty = function(difficultyKey)
{
  const foundDifficulty = this.findDifficultyByKey(difficultyKey);
  if (foundDifficulty)
  {
    foundDifficulty.hide();
  }
  else
  {
    console.warn(`could not lock difficulty with key: [${difficultyKey}].`);
  }
};

/**
 * Reveals the difficulty with the given key.
 * @param {string} difficultyKey The difficulty key to reveal.
 */
Game_System.prototype.unhideDifficulty = function(difficultyKey)
{
  const foundDifficulty = this.findDifficultyByKey(difficultyKey);
  if (foundDifficulty)
  {
    foundDifficulty.unhide();
  }
  else
  {
    console.warn(`could not unlock difficulty with key: [${difficultyKey}].`);
  }
};
//#endregion Game_System