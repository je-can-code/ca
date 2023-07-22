//region Game_Battler
/**
 * Generates the "level" property for all battlers, along with
 * a new function to calculate level retrieval.
 *
 * This is the same as `battler.lvl`.
 * @returns {number}
 */
Object.defineProperty(
  Game_Battler.prototype,
  "level",
  {
    get()
    {
      // get the level from this battler.
      return this.getLevel();
    },

    // sure, lets make this level property configurable.
    configurable: true,
  });

/**
 * Generates the "lvl" property for all battlers, along with
 * a new function to calculate level retrieval.
 *
 * This is the same as `battler.level`.
 * @returns {number}
 */
Object.defineProperty(
  Game_Battler.prototype,
  "lvl",
  {
    get()
    {
      // get the level from this battler.
      return this.getLevel();
    },

    // sure, lets make this level property configurable.
    configurable: true,
  });

/**
 * Gets the level for this battler.
 * @returns {number}
 */
Game_Battler.prototype.getLevel = function()
{
  // grab all sources that a level can come from.
  const sources = this.getLevelSources();

  // get the default level for this battler.
  let level = this.getBattlerBaseLevel();

  // get the level balancer for this battler if available.
  level += this.getLevelBalancer();

  // iterate over each of the source database datas.
  sources.forEach(rpgData =>
  {
    // add the level extracted from the data.
    level += this.extractLevel(rpgData);
  });

  // return the new amount.
  return level;
};

/**
 * Gets all database sources we can get levels from.
 * @returns {RPG_BaseItem[]}
 */
Game_Battler.prototype.getLevelSources = function()
{
  // our sources of data that a level can be retrieved from.
  return [];
};

/**
 * The base or default level for this battler.
 * @returns {number}
 */
Game_Battler.prototype.getBattlerBaseLevel = function()
{
  return 0;
};

/**
 * The variable level modifier for this battler.
 * @returns {number}
 */
Game_Battler.prototype.getLevelBalancer = function()
{
  return 0;
};

/**
 * Extracts the level from a given source's note data.
 * @param {RPG_BaseItem} rpgData The database object to extract level from.
 */
Game_Battler.prototype.extractLevel = function(rpgData)
{
  // extract the level from the notes.
  return rpgData.getNumberFromNotesByRegex(J.LEVEL.RegExp.BattlerLevel);
};
//endregion Game_Battler