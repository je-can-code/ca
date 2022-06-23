//#region RPG_TraitItem
//#region bonusHits
/**
 * A new property for retrieving the JABS bonusHits from this traited item.
 * @type {number}
 */
Object.defineProperty(RPG_TraitItem.prototype, "jabsBonusHits",
  {
    get: function()
    {
      return this.getJabsBonusHits();
    },
  });

/**
 * Gets the JABS bonus hits of this traited item.
 * @returns {number|null}
 */
RPG_TraitItem.prototype.getJabsBonusHits = function()
{
  return this.extractJabsBonusHits();
};

/**
 * Extracts the value from the notes.
 * @returns {number|null}
 */
RPG_TraitItem.prototype.extractJabsBonusHits = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.BonusHits, true);
};
//#endregion bonusHits
//#endregion RPG_TraitItem
