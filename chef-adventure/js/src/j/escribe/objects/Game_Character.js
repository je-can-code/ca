//#region Game_Character
/**
 * Creates the method for overwriting by subclasses.
 * At this level, it will return false for non-events.
 * @returns {boolean}
 */
Game_Character.prototype.hasDescribeData = function()
{
  return false;
};

/**
 * Creates the method for overwriting by subclasses.
 * At this level, it will return null for non-events.
 * @returns {boolean}
 */
Game_Character.prototype.getDescribeData = function()
{
  return null;
};

/**
 * Creates the method for overwriting by subclasses.
 * At this level, it will do nothing.
 */
Game_Character.prototype.parseEventComments = function()
{
  // do nothing.
};
//#endregion Game_Character