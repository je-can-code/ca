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