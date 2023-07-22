/**
 * Gets the underlying `Game_Character` or its appropriate subclass that this
 * sprite represents on the map.
 * @returns {Game_Character|Game_Player|Game_Event|Game_Vehicle|Game_Follower}
 */
Sprite_Character.prototype.character = function()
{
  return this._character;
};

/**
 * Gets whether or not the underlying {@link Game_Character} is erased.
 * If there is no underlying character, then it is still considered erased.
 * @returns {boolean}
 */
Sprite_Character.prototype.isErased = function()
{
  // grab the underlying character for this sprite.
  const character = this.character();

  // if we don't have a character, then it must certainly be erased.
  if (!character)
  {
    console.warn('attempted to check erasure status on a non-existing character:', this);
    return true;
  }

  // return the erasure status.
  return character.isErased();
};