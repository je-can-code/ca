/**
 * Determines if this character is actually a player.
 * @returns {boolean} True if this is a player, false otherwise.
 */
Game_Character.prototype.isPlayer = function()
{
  return false;
};

/**
 * Determines if this character is actually an event.
 * @returns {boolean} True if this is an event, false otherwise.
 */
Game_Character.prototype.isEvent = function()
{
  return false;
};

/**
 * Determines if this character is actually a follower.
 * @returns {boolean} True if this is a follower, false otherwise.
 */
Game_Character.prototype.isFollower = function()
{
  return false;
};

/**
 * Determines whether or not this character is currently erased.
 * Non-events cannot be erased.
 * @returns {boolean}
 */
Game_Character.prototype.isErased = function()
{
  return false;
};

/**
 * Gets the distance in tiles between this character and the player.
 * @returns {number} The distance.
 */
Game_Character.prototype.distanceFromPlayer = function()
{
  // return the calculated value.
  return this.distanceFromCharacter($gamePlayer);
};

/**
 * Gets the distance in tiles between this character and another character.
 * @param {Game_Character} character The character to determine distance from.
 * @returns {number} The distance.
 */
Game_Character.prototype.distanceFromCharacter = function(character)
{
  // if we are checking for distance to oneself, then obviously that is zero.
  if (this === character) return 0;

  // calculate the distance to the player.
  const distance = $gameMap.distance(character.x, character.y, this.x, this.y);

  // make sure the distance only goes out three decimals.
  const constrainedDistance = parseFloat((distance).toFixed(3));

  // return the calculated value.
  return constrainedDistance;
};