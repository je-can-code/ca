//region RPG_Skill
/**
 * The charge tier data associated with a skill.
 * @type {[number, number, number, number][]|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsChargeData",
  {
    get: function()
    {
      return this.getJabsChargeData();
    },
  });

/**
 * Gets the charge tier data from this skill.
 * @returns {[number, number, number, number][]|null}
 */
RPG_Base.prototype.getJabsChargeData = function()
{
  return this.extractJabsChargeData()
};

/**
 * Gets the value from its notes.
 * @returns {[number, number, number, number][]|null}
 */
RPG_Base.prototype.extractJabsChargeData = function()
{
  return this.getArraysFromNotesByRegex(J.ABS.EXT.CHARGE.RegExp.ChargeData, true);
};
//endregion RPG_Skill