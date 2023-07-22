/**
 * Updates the direction and position based on the preceding character.
 * This forces followers to always face the character infront of them in the follower train.
 * @param {Game_Follower|Game_Player} otherCharacter The character in front of this character in order.
 */
Game_Follower.prototype.pixelFaceCharacter = function(otherCharacter = $gamePlayer)
{
  // grab the most recently added tracking for the previous character in the train.
  const otherPosition = otherCharacter.oldestPositionalRecord();

  // do not update direction if we don't know the preceding character's previous position.
  if (!otherPosition) return;

  // check if the follower is facing up/down.
  const isFacingVertically = Math.abs(otherPosition.y - this._y) > Math.abs(otherPosition.x - this._x);

  // determine which direction to face; only one of these can be true at any given time.
  const shouldFaceDown = isFacingVertically && otherPosition.y > this._y;
  const shouldFaceUp = isFacingVertically && otherPosition.y < this._y;
  const shouldFaceRight = !isFacingVertically && otherPosition.x > this._x;
  const shouldFaceLeft = !isFacingVertically && otherPosition.x < this._x;

  // face the follower the appropriate direction.
  switch (true)
  {
    case shouldFaceDown:
      this.setDirection(2);
      break;
    case shouldFaceUp:
      this.setDirection(8);
      break;
    case shouldFaceLeft:
      this.setDirection(4);
      break;
    case shouldFaceRight:
      this.setDirection(6);
      break;
  }
};