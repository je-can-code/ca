//region RPG_Class
//region bonusHits
/**
 * The number of additional bonus hits this battler adds to their basic attacks.
 * @type {number}
 */
Object.defineProperty(RPG_Class.prototype, "jabsBonusHits",
  {
    get: function()
    {
      return this.getJabsBonusHits();
    },
  });

/**
 * Gets the JABS bonus hits of this battler.
 * @returns {number|null}
 */
RPG_Class.prototype.getJabsBonusHits = function()
{
  return this.extractJabsBonusHits();
};

/**
 * Extracts the value from the notes.
 * @returns {number|null}
 */
RPG_Class.prototype.extractJabsBonusHits = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.BonusHits, true);
};
//endregion bonusHits
//endregion RPG_Class