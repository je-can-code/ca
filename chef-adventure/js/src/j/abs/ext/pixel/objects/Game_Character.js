/**
 * Extends {@link processMoveCommand}.
 * Ensures when move routes are being processed, that we adjust the x,y coordinates.
 * @param {rm.types.EventCommand} command The commands associated with this movement.
 */
J.ABS.EXT.PIXEL.Aliased.Game_Character.set('processMoveCommand', Game_Character.prototype.processMoveCommand);
Game_Character.prototype.processMoveCommand = function(command)
{
  // when processing move routes, we are never pressing the move input.
  this.setMovePressed(false);

  // check if an event is manipulating movement.
  if ($gameMap.isEventRunning())
  {
    // round the x,y coordinates to move correctly.
    this._x = Math.round(this.x);
    this._y = Math.round(this.y);
  }

  // perform the original logic.
  J.ABS.EXT.PIXEL.Aliased.Game_Character.get('processMoveCommand').call(this, command);
};