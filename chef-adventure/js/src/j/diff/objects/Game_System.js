//#region Game_System
/**
 * Extends the `.initialize()` with our difficulty initialization.
 */
J.DIFF.Aliased.Game_System.set('initialize', Game_System.prototype.initialize);
Game_System.prototype.initialize = function()
{
  J.DIFF.Aliased.Game_System.get('initialize').call(this);
  this.initDifficultyMembers();
};

/**
 * Initializes the Difficulty System.
 */
Game_System.prototype.initDifficultyMembers = function()
{
  this._j ||= {};
  this._j._difficulty ||= {};
  this._j._difficulty.allDifficulties = J.DIFF.Metadata.Difficulties;
  this._j._difficulty.appliedDifficulty ||= this.findDifficultyByKey(J.DIFF.Metadata.DefaultDifficulty);
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