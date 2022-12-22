//region Game_Character
/**
 * Creates the method for overwriting by subclasses.
 * At this level, it will return false for non-events.
 * @abstract
 * @returns {boolean}
 */
Game_Character.prototype.hasEscribeData = function()
{
  return false;
};

/**
 * Creates the method for overwriting by subclasses.
 * At this level, it will do nothing.
 */
Game_Character.prototype.parseEscriptionComments = function()
{
};
//endregion Game_Character