//region RPG_BaseBattler
//region bonusHits
/**
 * The number of additional bonus hits this battler adds to their basic attacks.
 * @type {number}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsBonusHits",
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
RPG_BaseBattler.prototype.getJabsBonusHits = function()
{
  return this.extractJabsBonusHits();
};

/**
 * Extracts the value from the notes.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.extractJabsBonusHits = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.BonusHits, true);
};
//endregion bonusHits
//endregion RPG_BaseBattler
