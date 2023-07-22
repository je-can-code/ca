//region gapClose
/**
 * Whether or not this skill is designed to gap close.
 * Gap-closing will pull the player to wherever the skill connected.
 * @type {boolean}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsGapClose",
  {
    get: function()
    {
      return this.getJabsGapClose();
    },
  });

/**
 * Gets whether or not this skill is a gap close skill.
 * @returns {boolean}
 */
RPG_Skill.prototype.getJabsGapClose = function()
{
  return this.extractJabsGapClose();
};

/**
 * Extracts the value from its notes.
 * @returns {boolean}
 */
RPG_Skill.prototype.extractJabsGapClose = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.EXT.TOOLS.RegExp.GapClose);
};
//endregion gapClose

//region gapCloseMode
/**
 * The type of gap close mode this skill uses.
 * If there is no gap close mode available, then it'll be null instead.
 * @type {J.ABS.EXT.TOOLS.GapCloseModes|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsGapCloseMode",
  {
    get: function()
    {
      return this.getJabsGapCloseMode();
    },
  });

/**
 * Gets the gap close mode of this skill.
 * @returns {J.ABS.EXT.TOOLS.GapCloseModes|null}
 */
RPG_Skill.prototype.getJabsGapCloseMode = function()
{
  return this.extractJabsGapCloseMode();
};

/**
 * Extracts the value from its notes.
 * @returns {J.ABS.EXT.TOOLS.GapCloseModes|null}
 */
RPG_Skill.prototype.extractJabsGapCloseMode = function()
{
  return this.getStringFromNotesByRegex(J.ABS.EXT.TOOLS.RegExp.GapCloseMode, true);
};
//endregion gapCloseMode

//region gapClosePosition
/**
 * The type of gap close position this skill uses.
 * If there is no gap close position available, then it'll be null instead.
 * @type {J.ABS.EXT.TOOLS.GapClosePositions|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsGapClosePosition",
  {
    get: function()
    {
      return this.getJabsGapCloseMode();
    },
  });

/**
 * Gets the gap close position of this skill.
 * @returns {J.ABS.EXT.TOOLS.GapClosePositions|null}
 */
RPG_Skill.prototype.getJabsGapCloseMode = function()
{
  return this.extractJabsGapCloseMode();
};

/**
 * Extracts the value from its notes.
 * @returns {J.ABS.EXT.TOOLS.GapClosePositions|null}
 */
RPG_Skill.prototype.extractJabsGapCloseMode = function()
{
  return this.getStringFromNotesByRegex(J.ABS.EXT.TOOLS.RegExp.GapClosePosition, true);
};
//endregion gapClosePosition