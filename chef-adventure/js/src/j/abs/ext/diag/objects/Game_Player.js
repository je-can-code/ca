//region Game_Player
/**
 * OVERWRITE Leverages dir8 instead of dir4 by default.
 * @returns {number}
 */
Game_Player.prototype.getInputDirection = function()
{
  return Input.dir8;
};

/**
 * Moves straight in a given direction.
 * If there is an underlying diagonal direction, then move diagonally.
 * @param {number} direction The direction being moved.
 */
J.ABS.EXT.DIAG.Aliased.Game_Player.moveStraight = Game_Player.prototype.moveStraight;
Game_Player.prototype.moveStraight = function(direction)
{
  // if we're using cyclone movement, rely on that instead.
  if (globalThis.CycloneMovement)
  {
    J.ABS.EXT.DIAG.Aliased.Game_Player.moveStraight.call(this, direction);
    return;
  }

  if (this.isDiagonalDirection(direction))
  {
    const diagonalDirections = this.getDiagonalDirections(direction);
    this.moveDiagonally(...diagonalDirections);
  }
  else
  {
    J.ABS.EXT.DIAG.Aliased.Game_Player.moveStraight.call(this, direction);
  }
};

/**
 * Extends built-in diagonal movement to also move either horizontally or vertically
 * if a move diagonally should fail.
 * @param {number} horz The horizontal piece of the direction to move.
 * @param {number} vert The vertical piece of the direction to move.
 */
J.ABS.EXT.DIAG.Aliased.Game_Player.moveDiagonally = Game_Player.prototype.moveDiagonally;
Game_Player.prototype.moveDiagonally = function(horz, vert)
{
  J.ABS.EXT.DIAG.Aliased.Game_Player.moveDiagonally.call(this, horz, vert);
  // if we're using cyclone movement, rely on that instead.
  if (globalThis && globalThis.CycloneMovement) return;

  if (!this.isMovementSucceeded())
  {

    // try vertical move
    this.setMovementSuccess(this.canPass(this._x, this._y, vert));
    if (this.isMovementSucceeded())
    {
      this.moveStraight(vert);
    }

    // try horizontal move
    this.setMovementSuccess(this.canPass(this._x, this._y, horz));
    if (this.isMovementSucceeded())
    {
      this.moveStraight(horz);
    }
  }
};

/**
 * If we're using cyclone movement, adjust their triggering of events to not interact
 * with battlers and such if they are also events that have event commands.
 */
if (globalThis && globalThis.CycloneMovement)
{
  J.ABS.EXT.DIAG.Aliased.Game_Player.shouldTriggerEvent = Game_Player.prototype.shouldTriggerEvent;
  Game_Player.prototype.shouldTriggerEvent = function(event, triggers, normal)
  {
    if (event.isJabsBattler())
    {
      return false;
    }
    else
    {
      return J.ABS.EXT.DIAG.Aliased.Game_Player.shouldTriggerEvent.call(this, event, triggers, normal);
    }
  };
}
//endregion Game_Player