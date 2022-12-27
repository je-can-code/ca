//region RPG_Base
/**
 * The movement speed modifier from this from database object.
 * @type {number|null}
 */
Object.defineProperty(RPG_Base.prototype, "jabsSpeedBoost",
  {
    get: function()
    {
      return this.getJabsSpeedBoost();
    },
  });

/**
 * Gets the movement speed modifier from this database object.
 * @returns {number|null}
 */
RPG_Base.prototype.getJabsSpeedBoost = function()
{
  return this.extractJabsSpeedBoost()
};

/**
 * Gets the value from its notes.
 * @returns {number|null}
 */
RPG_Base.prototype.extractJabsSpeedBoost = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.EXT.SPEED.RegExp.WalkSpeedBoost, true);
};
//endregion RPG_Base