/**
 * Extends {@link Game_CharacterBase.initMembers}.
 * Includes this plugin's extra properties as well.
 */
J.ABS.EXT.PIXEL.Aliased.Game_CharacterBase.set('initMembers', Game_CharacterBase.prototype.initMembers);
Game_CharacterBase.prototype.initMembers = function()
{
  // perform original logic.
  J.ABS.EXT.PIXEL.Aliased.Game_CharacterBase.get('initMembers').call(this);

  // initialize the additional members.
  this.initPixelMovementMembers();
};

/**
 * Initializes the new members related to this plugin.
 */
Game_CharacterBase.prototype.initPixelMovementMembers = function()
{
  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * The collection for tracking the {@link Point} coordinates for all members.
   * This is managed in a first-in-first-out (FIFO) style.
   * @type {Point[]}
   */
  this._j._positionalRecords = [];

  /**
   * Whether or not one of the directional inputs are being held down.
   * @type {boolean} True if at least one direction is being held, false otherwise.
   */
  this._j._movePressing = false;

  /**
   * The move distance for tracking steps.
   * @type {number}
   */
  this._j._moveDistance = 0;

  /**
   * The number of steps this character has taken.
   * @type {number}
   */
  this._j._pixelSteps = 0;

  this._j._isPixelStepping = false;

  this._j._pixelDirection = 0;

  this._j._pixelStepsEnd = 0;
};

/**
 * Gets the collection of positional records for this character.
 * @returns {Point[]}
 */
Game_CharacterBase.prototype.positionalRecords = function()
{
  return this._j._positionalRecords;
};

/**
 * Clears the positional cache for characters on the map.
 */
Game_CharacterBase.prototype.clearPositionalRecords = function()
{
  this._j._positionalRecords = [];
};

/**
 * Adds a positional record to the collection and maintains the max collection size.
 * @param {Point} positionalRecord A single positional record as a point.
 */
Game_CharacterBase.prototype.addPositionalRecord = function(positionalRecord)
{
  // grab the records.
  const records = this.positionalRecords();

  // add the new record to the collection.
  records.push(positionalRecord);

  // only keep the top ten tracking records for positioning.
  while (records.length > 10)
  {
    records.shift();
  }
};

/**
 * Gets the first-added record from the collection of coordinate tracking.
 * @returns {Point}
 */
Game_CharacterBase.prototype.oldestPositionalRecord = function ()
{
  // grab the records.
  const records = this.positionalRecords();

  // make sure we have records.
  if (records.length > 0)
  {
    // return the first record, aka the first one added in there.
    return records.at(0);
  }

  // there are no records to retrieve.
  return null;
};

/**
 * Gets the last-added record from the collection of coordinate tracking.
 * @returns {Point}
 */
Game_CharacterBase.prototype.mostRecentPositionalRecord = function()
{
  // grab the records.
  const records = this.positionalRecords();

  // make sure we have records.
  if (records.length > 0)
  {
    // return the last record, aka the most recent one added in there.
    return records.at(-1);
  }

  // there are no records to retrieve.
  return null;
};

/**
 * Gets the move distance this character has moved.
 * @returns {number}
 */
Game_CharacterBase.prototype.moveDistance = function()
{
  return this._j._moveDistance;
};

/**
 * Modifies the move distance by a given amount.
 * @param {number} distance The distance in pixels.
 */
Game_CharacterBase.prototype.modMoveDistance = function(distance)
{
  // modify the move distance by the given amount.
  this._j._moveDistance += distance;
};

/**
 * Gets how many pixel steps this character has taken.
 * @returns {number}
 */
Game_CharacterBase.prototype.pixelSteps = function()
{
  return this._j._pixelSteps;
};

/**
 * Modifies the pixel step counter.
 * @param {number=} steps The number of steps to take; defaults to 1.
 */
Game_CharacterBase.prototype.takePixelSteps = function(steps = 1)
{
  this._j._pixelSteps += steps;
};

/**
 * Clears the number of pixel steps taken by this character.
 */
Game_CharacterBase.prototype.clearPixelSteps = function()
{
  this._j._pixelSteps = 0;
};

/**
 * Checks if this character has moved far enough to be considered a "step".
 */
Game_CharacterBase.prototype.updatePixelStepping = function()
{
  // determine if we have crossed the threshold for moving one step.
  const tookStep = this.moveDistance() >= this.stepDistance();

  // check if we took a step.
  if (tookStep)
  {
    // take a step.
    this.onStep();

    // reset the move distance.
    this.clearMoveDistance();
  }
};

/**
 * Resets the move distance for this character.
 */
Game_CharacterBase.prototype.clearMoveDistance = function()
{
  this._j._moveDistance = 0;
};

/**
 * Gets whether or not the move input is being pressed.
 * @returns {boolean}
 */
Game_CharacterBase.prototype.isMovePressed = function()
{
  return this._j._movePressing;
};

/**
 * Sets whether or not the move input is being held down.
 * @param {boolean} pressed The new value of whether or not the button is being pressed.
 */
Game_CharacterBase.prototype.setMovePressed = function(pressed)
{
  this._j._movePressing = pressed;
};

/**
 * Adds a hook for performing actions when this character takes a step.
 */
Game_CharacterBase.prototype.onStep = function()
{
  this.takePixelSteps(1);
};

/**
 * Gets the distance that it takes to travel to achieve one step.
 * @returns {number}
 */
Game_CharacterBase.prototype.stepDistance = function()
{
  return 0.3;//Math.SQRT1_2;
};

/**
 * Gets whether or not this character has the move input being held down.
 * @returns {boolean} True if it is, false otherwise.
 */
J.ABS.EXT.PIXEL.Aliased.Game_CharacterBase.set('isMoving', Game_CharacterBase.prototype.isMoving);
Game_CharacterBase.prototype.isMoving = function()
{
  // if our special tracker is pressed, then return true.
  if (this.isMovePressed()) return true;

  // otherwise, return the original logic's result.
  return J.ABS.EXT.PIXEL.Aliased.Game_CharacterBase.get('isMoving').call(this);
};

/**
 * Manages the coordinates for characters on the map.
 */
Game_CharacterBase.prototype.recordPixelPosition = function()
{
  // grab the most recently added point from the collection.
  const last = this.mostRecentPositionalRecord();

  // a short-hand function for calculating distance between two points.
  const distance = (a, b) =>
  {
    if (!a || !b) return 0;

    return $gameMap.distance(last.x, last.y, this.x, this.y);
  };

  // calculate the distance between
  const deltaDistance = distance(last, this);

  // check if the distance has exceeded the threshold.
  if (deltaDistance > 2)
  {
    // clear the cache.
    this.clearPositionalRecords();
  }
  // check if we are missing any records, or have moved enough.
  else if (!last || deltaDistance > 0.1)
  {
    // TODO: use the Point class?
    const point = { x: this.x, y: this.y }; //new Point(this.x, this.y);

    // add the point to the tracking.
    this.addPositionalRecord(point);
  }
};

/**
 * Forcefully relocates this character to a different set of coordinates.
 * @param {number} x The x coordinate.
 * @param {number} y The y coordinate.
 */
Game_CharacterBase.prototype.relocate = function(x, y)
{
  // update the coordinates of this character.
  this._x = x;
  this._y = y;
};

/**
 * Enables the "pixel moving" state and updates pixel position.
 */
Game_CharacterBase.prototype.startPixelMoving = function()
{
  // this character is moving.
  this.setMovePressed(true);

  // update the position for this character.
  this.recordPixelPosition();
};

/**
 * Disables the "pixel moving" state and updates pixel position.
 */
Game_CharacterBase.prototype.stopPixelMoving = function()
{
  // this character isn't moving.
  this.setMovePressed(false);

  // update the position for this character.
  this.recordPixelPosition();
};

/**
 * Determine the distance per frame when moving diagonally.
 * It is reduced thanks to the power of math.
 * @returns {number} The distance in pixels to move.
 */
Game_CharacterBase.prototype.diagonalDistancePerFrame = function()
{
  return this.distancePerFrame() * Math.SQRT1_2;
};

/**
 * Moves this character in the given direction a given distance in pixels.
 *
 * This is used in tandem with movement control and not intended to move characters otherwise.
 * @param {1|2|3|4|6|7|8|9} direction The direction to move.
 * @param {number} distance The number of pixels to move.
 */
Game_CharacterBase.prototype.movePixelDistance = function(direction, distance)
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

  // also modify the move distance by how far we've moved.
  this.modMoveDistance(distance);

  // updates the pixel step counter if applicable.
  this.updatePixelStepping();
};

/**
 * Moves this character one of the four cardinal directions a given distance in pixels.
 * @param {2|4|6|8} direction The straight direction to move.
 * @param {number} pixelDistance The number of pixels to move in that direction.
 */
Game_CharacterBase.prototype.moveStraightDistance = function(direction, pixelDistance)
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
Game_CharacterBase.prototype.moveDiagonalDistance = function(direction, pixelDistance)
{
  switch (direction)
  {
    case 1:
      this.moveDiagonal1DownLeft(pixelDistance);
      break;
    case 3:
      this.moveDiagonal3DownRight(pixelDistance);
      break;
    case 7:
      this.moveDiagonal7UpLeft(pixelDistance);
      break;
    case 9:
      this.moveDiagonal9UpRight(pixelDistance);
      break;
    default:
      console.warn('attempted to move an invalid diagonal direction: ', direction);
      break;
  }
};

/**
 * Move straight down the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_CharacterBase.prototype.moveStraight2Down = function(pixelDistance)
{
  this._y += pixelDistance;
};

/**
 * Move straight left the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_CharacterBase.prototype.moveStraight4Left = function(pixelDistance)
{
  this._x -= pixelDistance;
};

/**
 * Move straight right the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_CharacterBase.prototype.moveStraight6Right = function(pixelDistance)
{
  this._x += pixelDistance;
};

/**
 * Move straight up the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_CharacterBase.prototype.moveStraight8Up = function(pixelDistance)
{
  this._y -= pixelDistance;
};

/**
 * Move diagonally down-left the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_CharacterBase.prototype.moveDiagonal1DownLeft = function(pixelDistance)
{
  this._x -= pixelDistance;
  this._y += pixelDistance
};

/**
 * Move diagonally down-right the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_CharacterBase.prototype.moveDiagonal3DownRight = function(pixelDistance)
{
  this._x += pixelDistance;
  this._y += pixelDistance
};

/**
 * Move diagonally up-left the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_CharacterBase.prototype.moveDiagonal7UpLeft = function(pixelDistance)
{
  this._x -= pixelDistance;
  this._y -= pixelDistance
};

/**
 * Move diagonally up-right the given distance.
 * @param {number} pixelDistance The distance in pixels.
 */
Game_CharacterBase.prototype.moveDiagonal9UpRight = function(pixelDistance)
{
  this._x += pixelDistance;
  this._y -= pixelDistance
};

/**
 * Determines whether or not this character can pass in the given straight direction.
 * @param {2|4|6|8} direction The cardinal direction being moved.
 * @param {number} distance The distance to move in pixels, usually fractional.
 * @param {number} offset The tile offset for looking ahead.
 * @returns {boolean} True if we can move, false otherwise.
 */
Game_CharacterBase.prototype.canPassStraight = function(direction, distance = this.distancePerFrame(), offset = 0)
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

/**
 * Moves straight in a given direction.
 * If there is an underlying diagonal direction, then move diagonally.
 * @param {number} direction The direction being moved.
 */
J.ABS.EXT.PIXEL.Aliased.Game_CharacterBase.set('moveStraight', Game_CharacterBase.prototype.moveStraight);
Game_CharacterBase.prototype.moveStraight = function(direction)
{
  this.setMovementSuccess(this.canPass(this._x, this._y, direction));

  if (this.isMovementSucceeded())
  {
    this.movePixelDistance(direction, this.distancePerFrame());
    this.setDirection(direction);
  }
};

/**
 * Moves diagonally in a given direction.
 * If there is an underlying diagonal direction, then move diagonally.
 * @param {number} direction The direction being moved.
 */
J.ABS.EXT.PIXEL.Aliased.Game_CharacterBase.set('moveDiagonally', Game_CharacterBase.prototype.moveDiagonally);
Game_CharacterBase.prototype.moveDiagonally = function(direction)
{
  const [horz, vert] = this.getDiagonalDirections(direction);
  this.setMovementSuccess(this.canPassDiagonally(this._x, this._y, horz, vert));

  if (this.isMovementSucceeded())
  {
    this.movePixelDistance(direction, this.diagonalDistancePerFrame());
    this.setDirection(direction);
  }
};

/**
 * Executes pixel movement in the given direction if possible.
 * This also returns the cardinal-normalized direction that should be faced.
 * @param {number} direction The desired direction to be moved.
 * @returns {number} The cardinal-normalized direction to face while moving.
 */
Game_CharacterBase.prototype.pixelMoveByInput = function(direction)
{
  // establish a local variable for the direction.
  let innerDirection = direction;

  // calculate distance to move.
  const straightDistance = this.distancePerFrame();
  const diagonalDistance = this.diagonalDistancePerFrame();

  // shorthand test methods for checking if we can move in a given direction any further.
  const downTest = (offset = 0) => this.canPassStraight(2, straightDistance, offset);
  const upTest = (offset = 0) => this.canPassStraight(8, straightDistance, offset);
  const leftTest = (offset = 0) => this.canPassStraight(4, straightDistance, offset);
  const rightTest = (offset = 0) => this.canPassStraight(6, straightDistance, offset);

  // precalculate various directional tests for use throughout the switch.
  const canLeft = leftTest();
  const canDown = downTest();
  const canRight = rightTest();
  const canUp = upTest();
  const offsetRightMinus = rightTest(-1);
  const offsetRightPlus = rightTest(1);
  const offsetLeftMinus = leftTest(-1);
  const offsetLeftPlus = leftTest(1);
  const offsetDownPlus = downTest(1);
  const offsetDownMinus = downTest(-1);
  const offsetUpPlus = upTest(1);
  const offsetUpMinus = upTest(-1);

  // round the x,y coordinates.
  const roundX = Math.round(this._x);
  const roundY = Math.round(this._y);

  // switch on the direction given.
  switch (direction)
  {
    case 1:
      if (canLeft && canDown)
      {
        if (offsetLeftPlus)
        {
          // flag this as a successful movement.
          this.setMovementSuccess(true);

          // actually execute the movement.
          this.movePixelDistance(innerDirection, diagonalDistance);

          // identify this direction as cardinal, not diagonal.
          return J.ABS.Directions.DOWN;
        }
        else if (this.x - roundX < roundY - this.y)
        {
          return this.pixelMoveByInput(J.ABS.Directions.LEFT);
        }
        else
        {
          return this.pixelMoveByInput(J.ABS.Directions.DOWN);
        }
      }
      else if (canLeft)
      {
        return this.pixelMoveByInput(J.ABS.Directions.LEFT);
      }
      else if (canDown)
      {
        return this.pixelMoveByInput(J.ABS.Directions.DOWN);
      }
      else
      {
        direction = J.ABS.Directions.DOWN;
      }
      break;
    case 3:
      if (canRight && canDown)
      {
        if (offsetRightPlus)
        {
          // flag this as a successful movement.
          this.setMovementSuccess(true);

          // actually execute the movement.
          this.movePixelDistance(innerDirection, diagonalDistance);

          // identify this direction as cardinal, not diagonal.
          return J.ABS.Directions.DOWN;
        }
        else if (roundX - this.x < roundY - this.y)
        {
          return this.pixelMoveByInput(J.ABS.Directions.RIGHT);
        }
        else
        {
          return this.pixelMoveByInput(J.ABS.Directions.DOWN);
        }
      }
      else if (canRight)
      {
        return this.pixelMoveByInput(J.ABS.Directions.RIGHT);
      }
      else if (canDown)
      {
        return this.pixelMoveByInput(J.ABS.Directions.DOWN);
      }
      else
      {
        direction = J.ABS.Directions.DOWN;
      }
      break;
    case 7:
      if (canLeft && canUp)
      {
        if (offsetLeftMinus)
        {
          // flag this as a successful movement.
          this.setMovementSuccess(true);

          // actually execute the movement.
          this.movePixelDistance(innerDirection, diagonalDistance);

          // identify this direction as cardinal, not diagonal.
          return J.ABS.Directions.UP;
        }
        else if (this.x - roundX < this.y - roundY)
        {
          return this.pixelMoveByInput(J.ABS.Directions.LEFT);
        }
        else
        {
          return this.pixelMoveByInput(J.ABS.Directions.UP);
        }
      }
      else if (canLeft)
      {
        return this.pixelMoveByInput(J.ABS.Directions.LEFT);
      }
      else if (canUp)
      {
        return this.pixelMoveByInput(J.ABS.Directions.UP);
      }
      else
      {
        innerDirection = J.ABS.Directions.UP;
      }
      break;
    case 9:
      if (canRight && canUp)
      {
        if (offsetRightMinus)
        {
          // flag this as a successful movement.
          this.setMovementSuccess(true);

          // actually execute the movement.
          this.movePixelDistance(innerDirection, diagonalDistance);

          // identify this direction as cardinal, not diagonal.
          return 8;
        }
        else if (roundX - this.x < this.y - roundY)
        {
          return this.pixelMoveByInput(J.ABS.Directions.RIGHT);
        }
        else
        {
          return this.pixelMoveByInput(J.ABS.Directions.UP);
        }
      }
      else if (canRight)
      {
        return this.pixelMoveByInput(J.ABS.Directions.RIGHT);
      }
      else if (canUp)
      {
        return this.pixelMoveByInput(J.ABS.Directions.UP);
      }
      else
      {
        innerDirection = J.ABS.Directions.UP;
      }
      break;
    case 2:
      if (canDown)
      {
        // flag this as a successful movement.
        this.setMovementSuccess(true);

        // actually execute the movement.
        this.movePixelDistance(innerDirection, straightDistance);

        if (this._x > roundX && !offsetDownPlus || this._x < roundX && !offsetDownMinus)
        {
          this._x = roundX;
        }

        return innerDirection;
      }
      break;
    case 8:
      if (canUp)
      {
        // flag this as a successful movement.
        this.setMovementSuccess(true);

        // actually execute the movement.
        this.movePixelDistance(innerDirection, straightDistance);

        // check if we need to adjust our coordinates.
        if (this._x > roundX && !offsetUpPlus || this._x < roundX && !offsetUpMinus)
        {
          this._x = roundX;
        }

        // return the direction.
        return innerDirection;
      }
      break;
    case 4:
      if (canLeft)
      {
        // flag this as a successful movement.
        this.setMovementSuccess(true);

        // actually execute the movement.
        this.movePixelDistance(innerDirection, straightDistance);

        if (this._y > roundY && !offsetLeftPlus || this._y < roundY && !offsetLeftMinus)
        {
          this._y = roundY;
        }

        return innerDirection;
      }
      break;
    case 6:
      if (canRight)
      {
        // flag this as a successful movement.
        this.setMovementSuccess(true);

        // actually execute the movement.
        this.movePixelDistance(innerDirection, straightDistance);

        if (this._y > roundY && !offsetRightPlus || this._y < roundY && !offsetRightMinus)
        {
          this._y = roundY;
        }

        return innerDirection;
      }
      break;
  }

  // return the calculated direction.
  return innerDirection;
};

/**
 * Tries to move this battler toward a set of coordinates.
 * @param {number} x The `x` coordinate to reach.
 * @param {number} y The `y` coordinate to reach.
 */
JABS_Battler.prototype.smartMoveTowardCoordinates = function(x, y)
{
  // grab the character.
  const character = this.getCharacter();

  // check if we're either not already mid-step, or if we haven't decided a direction yet.
  if (!this._isPixelStepping || this._pixelDirection === 0)
  {
    // grab the current pixel steps for this character.
    const pixelSteps = character.pixelSteps();

    // flag them for pixel stepping.
    this._isPixelStepping = true;

    // define the end step counter.
    this._pixelStepsEnd = pixelSteps + 1;

    const angle = this.calculateAngle(x, y);

    const directionByAngle = this.angleToDirection(angle);

    const isDiagonal = character.isDiagonalDirection(directionByAngle);

    if (isDiagonal)
    {
      const direction = character.findDiagonalDirectionTo(x, y);

      // decide the direction to go next.
      this._pixelDirection = direction;
    }
    else
    {
      const direction = character.findDirectionTo(x, y);

      if (!character.canPassStraight(direction))
      {
        this.setWaitCountdown(6);
        return;
      }

      // decide the direction to go next.
      this._pixelDirection = direction;
    }
  }

  // check if we have reached our end step counter.
  if (character.pixelSteps() >= this._pixelStepsEnd)
  {
    // the character is no longer pixel stepping.
    this._isPixelStepping = false;

    // empty the pixel steps for this character.
    character.clearPixelSteps();
  }

  if (this._pixelDirection === 0)
  {
    return;
  }

  // execute pixel movement based on the decided direction.
  character.pixelMoveByInput(this._pixelDirection);
};

JABS_Battler.prototype.calculateAngle = function(x, y)
{
  const normalizeNumber = num => parseFloat((num).toFixed(3));
  const x1 = this.getX();
  const x2 = Math.abs(x);
  const x3 = x1 - x2;
  const y1 = this.getY();
  const y2 = Math.abs(y);
  const y3 = y1 - y2;

  const yT = normalizeNumber(y3);
  const xT = normalizeNumber(x3);
  const angle = normalizeNumber(Math.atan2(yT, xT) * 180 / Math.PI);

  console.log(yT, xT, angle);

  return angle;
};

JABS_Battler.prototype.angleToDirection = function(angle)
{
  // between -60 and -120 go straight down.
  const down = (angle < -60) && (angle > -120);

  // between -120 and -150 go diagonal down-right.
  const downRight = (angle < -120) && (angle > -150);

  // between 150 and 180 or -180 and -150 go straight right.
  const right = (angle < 180 && angle > 150) || (angle > -180 && angle < -150);

  // between 120 and 150 go diagonal up-right.
  const upRight = (angle < 150) && (angle > 120);

  // between 60 and 120 go straight up.
  const up = (angle > 60) && (angle < 120);

  // between 30 and 60 go diagonal up-left.
  const upLeft = (angle > 30) && (angle < 60);

  // between 30 and -30 go straight left.
  const left = (angle > -30)  && (angle < 30);

  // between -30 and -60 go diagonal down-left.
  const downLeft = (angle > -60) && (angle < -30);

  switch (true)
  {
    case down:
      return J.ABS.Directions.DOWN;
    case downRight:
      return J.ABS.Directions.LOWERRIGHT;
    case right:
      return J.ABS.Directions.RIGHT;
    case upRight:
      return J.ABS.Directions.UPPERRIGHT;
    case up:
      return J.ABS.Directions.UP;
    case upLeft:
      return J.ABS.Directions.UPPERLEFT;
    case left:
      return J.ABS.Directions.LEFT;
    case downLeft:
      return J.ABS.Directions.LOWERLEFT;
    default:
      return 0;
  }
};

/**
 * Tries to move this battler away from its current target.
 *
 * There is no pathfinding away, but if its not able to move directly
 * away, it will try a different direction to wiggle out of corners.
 */
JABS_Battler.prototype.smartMoveAwayFromTarget = function()
{
  const target = this.getTarget();
  if (!target) return;

  const character = this.getCharacter();

  character.moveAwayFromCharacter(target.getCharacter());

  if (!character.isMovementSucceeded())
  {
    const threatDir = character.reverseDir(character.direction());
    let newDir = (Math.randomInt(4) + 1) * 2;
    while (newDir === threatDir)
    {
      newDir = (Math.randomInt(4) + 1) * 2;
    }

    character.pixelMoveByInput(newDir);
  }
};

Game_Event.prototype.isCollidedWithEvents = function(x, y)
{
  // TODO: probably should fix this.
  // TODO: need to fix melee action events?
  // TODO: need to make a command for taking defined steps for .processMoveCommand().
  const events = $gameMap.eventsXyNt(x, y);
  if (events.length === 1 && events.includes(this))
  {
    return false;
  }

  return events.length > 0;
};

Game_Character.prototype.searchLimit = function()
{
  return 40;
};