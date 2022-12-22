//region RPG_BaseBattler
//region passive state ids
/**
 * The passive state ids that this item possesses.
 * @type {number[]}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "passiveStateIds",
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
RPG_BaseBattler.prototype.extractPassiveStateIds = function()
{
  return this.getNumberArrayFromNotesByRegex(J.PASSIVE.RegExp.PassiveStateIds);
};
//endregion passive state ids

//region unique passive state ids
/**
 * The passive state ids that this item possesses.
 * @type {number[]}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "uniquePassiveStateIds",
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
RPG_BaseBattler.prototype.extractUniquePassiveStateIds = function()
{
  return this.getNumberArrayFromNotesByRegex(J.PASSIVE.RegExp.UniquePassiveStateIds);
};
//endregion unique passive state ids

//region equipped passive state ids
/**
 * The battler itself cannot be equipped, thus it cannot have equipped passive states.
 * @type {Array.empty}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "equippedPassiveStateIds",
  {
    get: function()
    {
      return Array.empty;
    },
  });
//endregion equipped passive state ids

//region unique equipped passive state ids
/**
 * The battler itself cannot be equipped, thus it cannot have equipped passive states.
 * @type {Array.empty}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "uniqueEquippedPassiveStateIds",
  {
    get: function()
    {
      return Array.empty;
    },
  });
//endregion unique equipped passive state ids
//endregion RPG_BaseBattler