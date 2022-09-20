//#region passive state ids
/**
 * The passive state ids that this item possesses.
 * @returns {number[]}
 */
Object.defineProperty(RPG_BaseItem.prototype, "passiveStateIds",
  {
    get: function()
    {
      return this.extractPassiveStateIds();
    },
  });

/**
 * Extracts the value from the notes.
 * @returns {number[]}
 */
RPG_BaseItem.prototype.extractPassiveStateIds = function()
{
  return this.getNumberArrayFromNotesByRegex(J.PASSIVE.RegExp.PassiveStateIds);
};
//#endregion passive state ids

//#region unique passive state ids
/**
 * The passive state ids that this item possesses.
 * @returns {number[]}
 */
Object.defineProperty(RPG_BaseItem.prototype, "uniquePassiveStateIds",
  {
    get: function()
    {
      return this.extractUniquePassiveStateIds();
    },
  });

/**
 * Extracts the value from the notes.
 * @returns {number[]}
 */
RPG_BaseItem.prototype.extractUniquePassiveStateIds = function()
{
  return this.getNumberArrayFromNotesByRegex(J.PASSIVE.RegExp.UniquePassiveStateIds);
};
//#endregion unique passive state ids