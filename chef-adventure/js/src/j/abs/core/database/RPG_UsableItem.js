//region RPG_UsableItem
//region bonusHits
/**
 * The number of additional bonus hits this skill or item adds to their basic attacks.
 * @type {number}
 */
Object.defineProperty(RPG_UsableItem.prototype, "jabsBonusHits",
  {
    get: function()
    {
      return this.getJabsBonusHits();
    },
  });

/**
 * Gets the JABS bonus hits of this skill or item.
 * @returns {number|null}
 */
RPG_UsableItem.prototype.getJabsBonusHits = function()
{
  return this.extractJabsBonusHits();
};

/**
 * Extracts the value from the notes.
 * @returns {number|null}
 */
RPG_UsableItem.prototype.extractJabsBonusHits = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.BonusHits, true);
};
//endregion bonusHits

//region cooldown
/**
 * The JABS cooldown when using this skill or item.
 * @type {number}
 */
Object.defineProperty(RPG_UsableItem.prototype, "jabsCooldown",
  {
    get: function()
    {
      return this.getJabsCooldown();
    },
  });

/**
 * Gets the JABS cooldown for this skill or item.
 * @returns {number}
 */
RPG_UsableItem.prototype.getJabsCooldown = function()
{
  return this.extractJabsCooldown()
};

/**
 * Gets the value from the notes.
 */
RPG_UsableItem.prototype.extractJabsCooldown = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Cooldown, true);
};
//endregion cooldown
//endregion RPG_UsableItem