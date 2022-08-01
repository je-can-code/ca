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

/**
 * Determine the distance per frame when moving diagonally.
 * It is reduced thanks to the power of math.
 * @returns {number} The distance in pixels to move.
 */
Game_Character.prototype.diagonalDistancePerFrame = function()
{
  return this.distancePerFrame() / Math.SQRT2;
};

/**
 * Moves this character in the given direction a given distance in pixels.
 *
 * This is used in tandem with movement control and not intended to move characters otherwise.
 * @param {1|2|3|4|6|7|8|9} direction The direction to move.
 * @param {number} distance The number of pixels to move.
 */
Game_Character.prototype.movePixelDistance = function(direction, distance)
{
  // define the direction types.
  const straightDirections = [2, 4, 6, 8];
  const diagonalDirections = [1, 3, 7, 9];

  // check what kind of direction it was.
  const isStraight = straightDirections.includes(direction);
  const isDiagonal = diagonalDirections.includes(direction);

  // let us check if the direction was straight.
  if (isStraight)
  {
    // move straight.
    this.moveStraightDistance(direction, distance);
  }

  // if not straight, then let us check if the direction was diagonal.
  else if (isDiagonal)
  {
    // move diagonally.
    this.moveDiagonalDistance(direction, distance);
  }
};

/**
 * Moves this character one of the four cardinal directions a given distance in pixels.
 * @param {2|4|6|8} direction The straight direction to move.
 * @param {number} pixelDistance The number of pixels to move in that direction.
 */
Game_Character.prototype.moveStraightDistance = function(direction, pixelDistance)
{
  switch (direction)
  {
    case 2:
      this.moveStraight2Down(pixelDistance);
      break;
    case 4:
      this.moveStraight4Left(pixelDistance);
      break;
    case 6:
      this.moveStraight6Right(pixelDistance);
      break;
    case 8:
      this.moveStraight8Up(pixelDistance);
      break;
    default:
      console.warn('attempted to move an invalid straight direction: ', direction);
      break;
  }
};

/**
 * Moves this character one one of the four cardinal directions.
 * @param {1|3|7|9} direction The straight direction to move.
 * @param {number} pixelDistance The number of pixels to move in that direction.
 */
Game_Character.prototype.moveDiagonalDistance = function(direction, pixelDistance)
{
  switch (direction)
  {
    case 1:
      this.moveDiag1DownLeft(pixelDistance);
      break;
    case 3:
      this.moveDiag3DownRight(pixelDistance);
      break;
    case 7:
      this.moveDiag7UpLeft(pixelDistance);
      break;
    case 9:
      this.moveDiag9UpRight(pixelDistance);
      break;
    default:
      console.warn('attempted to move an invalid straight direction: ', direction);
      break;
  }
};

/**
 * Move straight down the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_Character.prototype.moveStraight2Down = function(pixelDistance)
{
  this._y += pixelDistance;
};

/**
 * Move straight left the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_Character.prototype.moveStraight4Left = function(pixelDistance)
{
  this._x -= pixelDistance;
};

/**
 * Move straight right the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_Character.prototype.moveStraight6Right = function(pixelDistance)
{
  this._x += pixelDistance;
};

/**
 * Move straight up the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_Character.prototype.moveStraight8Up = function(pixelDistance)
{
  this._y -= pixelDistance;
};

/**
 * Move diagonally down-left the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_Character.prototype.moveDiag1DownLeft = function(pixelDistance)
{
  this._x -= pixelDistance;
  this._y += pixelDistance
};

/**
 * Move diagonally down-right the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_Character.prototype.moveDiag3DownRight = function(pixelDistance)
{
  this._x += pixelDistance;
  this._y += pixelDistance
};

/**
 * Move diagonally up-left the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_Character.prototype.moveDiag7UpLeft = function(pixelDistance)
{
  this._x -= pixelDistance;
  this._y -= pixelDistance
};

/**
 * Move diagonally up-right the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_Character.prototype.moveDiag9UpRight = function(pixelDistance)
{
  this._x += pixelDistance;
  this._y -= pixelDistance
};

Game_Character.prototype.canPassStraight = function(direction, distance, offset = 0)
{
  // round the x,y coordinates.
  const roundX = Math.round(this._x);
  const roundY = Math.round(this._y);

  // switch on direction.
  switch (direction)
  {
    case 2: // down.
      return this.canPass(roundX + offset, Math.floor(this._y + distance), 2);
    case 4: // left.
      return this.canPass(Math.ceil(this._x - distance), roundY + offset, 4);
    case 6: // right.
      return this.canPass(Math.floor(this._x + distance), roundY + offset, 6);
    case 8: // up.
      return this.canPass(roundX + offset, Math.ceil(this._y - distance), 8);
    default:
      return false;
  }
};