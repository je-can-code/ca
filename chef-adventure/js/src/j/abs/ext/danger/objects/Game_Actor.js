//region Game_Actor
/**
 * Gets whether or not the actor's danger indicator will show.
 * Danger indicator is not applicable to actors (since it is relative to the player).
 * @returns {boolean}
 */
Game_Actor.prototype.showDangerIndicator = function()
{
  return false;
};
//endregion Game_Actor