/*  BUNDLED TIME: Sun Jul 31 2022 13:15:28 GMT-0700 (Pacific Daylight Time)  */

// TODO: need to sort out enemies and action events for JABS.
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 PIXEL] WIP Enables pixel movement.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @help
 * ==============================================================================
 * Enables 8-directional pixel movement.
 * ==============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ==============================================================================
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//#region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//#endregion version check

//#region metadata
/**
 * The over-arching extensions collection for JABS.
 */
J.ABS.EXT ||= {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.ABS.EXT.PIXEL = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ABS.EXT.PIXEL.Metadata = {};
J.ABS.EXT.PIXEL.Metadata.Version = '1.0.0';
J.ABS.EXT.PIXEL.Metadata.Name = `J-ABS-PixelMovement`;

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.ABS.EXT.PIXEL.PluginParameters = PluginManager.parameters(J.ABS.EXT.PIXEL.Metadata.Name);

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.EXT.PIXEL.Aliased =
  {
    Game_Character: new Map(),
    Game_CharacterBase: new Map(),
    Game_Player: new Map(),
  };
//#endregion metadata

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

/**
 * Extends {@link initMembers}.
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
   * Whether or not one of the directional inputs are being held down.
   * @type {boolean} True if at least one direction is being held, false otherwise.
   */
  this._movePressing = false;

  /**
   * The collection for tracking the {@link Point} coordinates for all members.
   * @type {Point[]}
   */
  this._posRecords = [];
};

/**
 * Gets whether or not the move input is being pressed.
 * @returns {boolean}
 */
Game_CharacterBase.prototype.isMovePressed = function()
{
  return this._movePressing;
};

/**
 * Sets whether or not the move input is being held down.
 * @param {boolean} pressed The new value of whether or not the button is being pressed.
 */
Game_CharacterBase.prototype.setMovePressed = function(pressed)
{
  this._movePressing = pressed;
};

/**
 * Gets whether or not this character has the move input being held down.
 * @returns {boolean} True if it is, false otherwise.
 */
J.ABS.EXT.PIXEL.Aliased.Game_CharacterBase.set('isMoving', Game_CharacterBase.prototype.isMoving);
Game_CharacterBase.prototype.isMoving = function ()
{
  // if our special tracker is pressed, then return true.
  if (this.isMovePressed()) return true;

  // otherwise, return the original logic's result.
  return J.ABS.EXT.PIXEL.Aliased.Game_CharacterBase.get('isMoving').call(this);
};

/**
 * Round the x,y coordinates of this character.
 */
Game_CharacterBase.prototype.roundCoordinates = function()
{
  // round the x,y coordinates.
  this._x = Math.round(this.x);
  this._y = Math.round(this.y);
};

/**
 * Clears/initializes the positional cache for characters on the map.
 */
Game_CharacterBase.prototype._resetCachePosition = function () 
{
  this._posRecords = [];
};

/**
 * Manages the coordinates for characters on the map.
 */
Game_CharacterBase.prototype._recordPosition = function () 
{
  // TODO: remove this unnecessary initialization in-method.
  // initialize if necessary.
  if (!this._posRecords) 
  {
    this._posRecords = [];
  }

  // TODO: extract this distance function or re-use another?
  // a short-hand function for calculating distance between two points.
  const distance = (a, b) =>
  {
    if (!a || !b) return 0;

    return $gameMap.distance(last.x, last.y, this.x, this.y);
  };

  // grab the most recently added point from the collection.
  const last = this._recentPosition();

  // calculate the distance between
  const dis = distance(last, this);

  // check if the distance has exceeded the threshold.
  if (dis > 2) 
  {
    // clear the cache.
    this._resetCachePosition();
  }
  // TODO: what is this checking?
  else if (!last || dis > 0.1) 
  {
    // TODO: use the Point class?
    const point = { x: this.x, y: this.y }; //new Point(this.x, this.y);

    // add the point to the tracking.
    this._posRecords.push(point);

    // TODO: what actually is the purpose of this tracker?
    // only keep the top ten tracking records for positioning.
    while (this._posRecords.length > 10) 
    {
      this._posRecords.shift();
    }
  }
};

/**
 * Gets the first-added record from the collection of coordinate tracking.
 * @returns {Point}
 */
Game_CharacterBase.prototype._lastPosition = function () 
{
  if (this._posRecords && this._posRecords.length > 0) 
  {
    return this._posRecords.at(0);
  }

  // there are no records to retrieve.
  return null;
};

/**
 * Gets the last-added record from the collection of coordinate tracking.
 * @returns {Point}
 */
Game_CharacterBase.prototype._recentPosition = function() 
{
  if (this._posRecords && this._posRecords.length > 0) 
  {
    return this._posRecords.at(-1);
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
  this._recordPosition();
};

/**
 * Disables the "pixel moving" state and updates pixel position.
 */
Game_CharacterBase.prototype.stopPixelMoving = function()
{
  // this character isn't moving.
  this.setMovePressed(false);

  // update the position for this character.
  this._recordPosition();
};

/**
 * Updates the direction and position based on the preceding character.
 * This forces followers to always face the character infront of them in the follower train.
 * @param {Game_Follower|Game_Player} otherCharacter The character in front of this character in order.
 */
Game_Follower.prototype.pixelFaceCharacter = function(otherCharacter = $gamePlayer)
{
  // grab the most recently added tracking for the previous character in the train.
  const otherPosition = otherCharacter._lastPosition();

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

/**
 * Overwrites {@link Game_Player.checkEventTriggerHere}.
 * Includes the rounding of the x,y coordinates when checking event triggers for things beneath you.
 * @param {number[]} triggers The numeric triggers for this event.
 */
Game_Player.prototype.checkEventTriggerHere = function(triggers)
{
  // check if we can start an event at the current location.
  if (this.canStartLocalEvents()) 
  {
    // round the x,y coordinates.
    const roundX = Math.round(this.x);
    const roundY = Math.round(this.y);

    // start the event with the rounded coordinates.
    this.startMapEvent(roundX, roundY, triggers, false);
  }
};

/**
 * Extends {@link checkEventTriggerThere}.
 * Includes the rounding of the x,y coordinates when checking event triggers for things infront of you.
 * @param {number[]} triggers The triggers associated with checking the event at the location.
 * TODO: does this actually need to round?
 */
J.ABS.EXT.PIXEL.Aliased.Game_Player.set('checkEventTriggerThere', Game_Player.prototype.checkEventTriggerThere);
Game_Player.prototype.checkEventTriggerThere = function(triggers)
{
  const oldX = this._x;
  const oldY = this._y;

  // round the x,y coordinates.
  this._x = Math.round(this.x);
  this._y = Math.round(this.y);

  // perform original logic.
  J.ABS.EXT.PIXEL.Aliased.Game_Player.get('checkEventTriggerThere').call(this, triggers);

  this._x = oldX;
  this._y = oldY;
};

/**
 * Extends {@link checkEventTriggerTouch}.
 * Handles the triggering of events by using a threshold-type formula to determine if actually touched.
 */
J.ABS.EXT.PIXEL.Aliased.Game_Player.set('checkEventTriggerTouch', Game_Player.prototype.checkEventTriggerTouch);
Game_Player.prototype.checkEventTriggerTouch = function(x, y)
{
  // round the x,y coordinates.
  const roundX = Math.round(x);
  const roundY = Math.round(y);

  // TODO: does this actually need to round?
  // determine the threshold for pixel movement regarding event triggering.
  const didTrigger = Math.abs(roundX - x) < 0.3 && Math.abs(roundY - y) < 0.3; // within 1/3 of a tile triggers?

  // check if the event was triggered with the threshold coordinates.
  if (didTrigger)
  {
    // return the original logic's result.
    return J.ABS.EXT.PIXEL.Aliased.Game_Player.get('checkEventTriggerTouch').call(this, roundX, roundY);
  }

  // no triggering the event.
  return false;
};

/**
 * Updates whether or not the player is dashing.
 */
Game_Player.prototype.updateDashing = function() 
{
  // if we are moving by means other than pressing the button, don't process.
  if (this.isMoving() && !this._movePressing) return;

  // check if we can move, are out of a vehicle, and dashing is enabled.
  if (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled())
  {
    // we're dashing then if the we clicked to go somewhere, or we're holding dash.
    this._dashing = this.isDashButtonPressed() || $gameTemp.isDestinationValid();

    // stop processing.
    return;
  }

  // we are not dashing.
  this._dashing = false;
};

/**
 * Overwrites {@link Game_Player.moveByInput}.
 * The meat and potatoes for pixel movement of the player.
 */
Game_Player.prototype.moveByInput = function() 
{
  // determine if we should be moving when we are not.
  const notMovingButShouldBe = (!this.isMoving() || this._movePressing);

  // check if we should be moving when we're not, and actually can.
  if (notMovingButShouldBe && this.canMove())
  {
    // check the direction the player is pressing.
    let direction = Input.dir8;

    // make sure we have a valid direction.
    if (direction > 0) 
    {
      // clear the point-click destination.
      $gameTemp.clearDestination();

      // check if the input is NOT being pressed.
      if (!this.isMovePressed())
      {
        // clear the collection of points.
        this._resetCachePosition();

        // grab the collectino of followers.
        const followers = this._followers._data;

        // also reset their positions.
        followers.forEach(follower => follower._resetCachePosition());
      }

      // flag that movement was not successful.
      this.setMovementSuccess(false);

      // determine the actual direction.
      direction = this._moveByInput(direction);

      // if we have a direction, assign it to ourselves.
      if (direction > 0)
      {
        // set the new direction.
        this.setDirection(direction);
      }

      // check if we've succeeded in moving somehow.
      if (this.isMovementSucceeded()) 
      {
        // move the followers with the player.
        this.processFollowersPixelMoving();

        // flag that we're holding the button.
        this.setMovePressed(true);
      }
      // we haven't succeeded in moving.
      else 
      {
        // halt the followers pixel movement.
        this.stopFollowersPixelMoving();

        // toggle the input to false since we're not pushing the button.
        this.setMovePressed(false);

        // check if we triggered an event infront of the player.
        this.checkEventTriggerTouchFront(direction);
      }

      // stop processing.
      return;
    }
  }

  // don't actually move the followers.
  this.stopFollowersPixelMoving();

  // toggle the input to false since we're not pushing the button.
  this.setMovePressed(false);
};

/**
 * Determines which direction to move based on direction and availability.
 * @param {number} direction The desired direction to be moved.
 * @returns {number} The actual direction moved.
 */
// eslint-disable-next-line complexity
Game_Player.prototype._moveByInput = function(direction)
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

  // determine available directions for movement.
  const canLeft = leftTest();
  const canDown = downTest();
  const canRight = rightTest();
  const canUp = upTest();
  const offsetCanUpRight = rightTest(-1);
  const offsetCanDownRight = rightTest(1);
  const offsetCanUpLeft = leftTest(-1);
  const offsetCanDownLeft = leftTest(1);

  // round the x,y coordinates.
  const roundX = Math.round(this._x);
  const roundY = Math.round(this._y);

  // switch on the direction given.
  switch (direction) 
  {
    case 1:
      if (canLeft && canDown)
      {
        if (offsetCanDownLeft)
        {
          // flag this as a successful movement.
          this.setMovementSuccess(true);

          // actually execute the movement.
          this.movePixelDistance(innerDirection, diagonalDistance);

          // handle stepping if we crossed the line.
          this.handleStepByDirection(innerDirection);

          return 2;
        }
        else if (this.x - roundX < roundY - this.y) 
        {
          return this._moveByInput(4);
        }
        else 
        {
          return this._moveByInput(2);
        }
      }
      else if (canLeft) 
      {
        return this._moveByInput(4);
      }
      else if (canDown) 
      {
        return this._moveByInput(2);
      }
      else 
      {
        direction = 2;
      }
      break;
    case 3:
      if (canRight && canDown)
      {
        if (offsetCanDownRight)
        {
          // flag this as a successful movement.
          this.setMovementSuccess(true);

          // actually execute the movement.
          this.movePixelDistance(innerDirection, diagonalDistance);

          // handle stepping if we crossed the line.
          this.handleStepByDirection(innerDirection);

          return 2;
        }
        else if (roundX - this.x < roundY - this.y) 
        {
          return this._moveByInput(6);
        }
        else 
        {
          return this._moveByInput(2);
        }
      }
      else if (canRight) 
      {
        return this._moveByInput(6);
      }
      else if (canDown) 
      {
        return this._moveByInput(2);
      }
      else 
      {
        direction = 2;
      }
      break;
    case 7:
      if (canLeft && canUp)
      {
        if (offsetCanUpLeft)
        {
          // flag this as a successful movement.
          this.setMovementSuccess(true);

          // actually execute the movement.
          this.movePixelDistance(innerDirection, diagonalDistance);

          // handle stepping if we crossed the line.
          this.handleStepByDirection(innerDirection);

          return 8;
        }
        else if (this.x - roundX < this.y - roundY) 
        {
          return this._moveByInput(4);
        }
        else 
        {
          return this._moveByInput(8);
        }
      }
      else if (canLeft) 
      {
        return this._moveByInput(4);
      }
      else if (canUp) 
      {
        return this._moveByInput(8);
      }
      else 
      {
        innerDirection = 8;
      }
      break;
    case 9:
      if (canRight && canUp)
      {
        if (offsetCanUpRight)
        {
          // flag this as a successful movement.
          this.setMovementSuccess(true);

          // actually execute the movement.
          this.movePixelDistance(innerDirection, diagonalDistance);

          // handle stepping if we crossed the line.
          this.handleStepByDirection(innerDirection);

          return 8;
        }
        else if (roundX - this.x < this.y - roundY)
        {
          return this._moveByInput(6);
        }
        else
        {
          return this._moveByInput(8);
        }
      }
      else if (canRight) 
      {
        return this._moveByInput(6);
      }
      else if (canUp) 
      {
        return this._moveByInput(8);
      }
      else 
      {
        innerDirection = 8;
      }
      break;
    case 2:
      if (canDown)
      {
        // flag this as a successful movement.
        this.setMovementSuccess(true);

        // actually execute the movement.
        this.movePixelDistance(innerDirection, straightDistance);

        // handle stepping if we crossed the line.
        this.handleStepByDirection(innerDirection);

        if (this._x > roundX && !downTest(1) || this._x < roundX && !downTest(-1))
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

        // handle stepping if we crossed the line.
        this.handleStepByDirection(innerDirection);

        // check if we need to adjust our coordinates.
        if (this._x > roundX && !upTest(1) || this._x < roundX && !upTest(-1))
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

        // handle stepping if we crossed the line.
        this.handleStepByDirection(innerDirection);

        if (this._y > roundY && !leftTest(1) || this._y < roundY && !leftTest(-1))
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

        // handle stepping if we crossed the line.
        this.handleStepByDirection(innerDirection);

        if (this._y > roundY && !rightTest(1) || this._y < roundY && !rightTest(-1))
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

Game_Player.prototype.handleOnStepEffects = function()
{
  this.increaseSteps();
  this.checkEventTriggerHere([1, 2]);
};

/**
 * Handles the stepping based on the direction.
 * @param direction
 */
Game_Player.prototype.handleStepByDirection = function(direction)
{
  // round the x,y coordinates.
  const roundX = Math.round(this._x);
  const roundY = Math.round(this._y);

  // switch on direction.
  switch (direction)
  {
    case 1: // down-left.
      if (Math.round(this._y) > roundY || Math.round(this._x) < roundX) this.handleOnStepEffects();
      break;
    case 3: // down-right.
      if (Math.round(this._y) > roundY || Math.round(this._x) > roundX) this.handleOnStepEffects();
      break;
    case 7: // up-left.
      if (Math.round(this._y) < roundY || Math.round(this._x) < roundX) this.handleOnStepEffects();
      break;
    case 9: // up-right.
      if (Math.round(this._y) < roundY || Math.round(this._x) > roundX) this.handleOnStepEffects();
      break;
    case 2: // down.
      if (Math.round(this._y) > roundY) this.handleOnStepEffects();
      break;
    case 4: // left.
      if (Math.round(this._x) < roundX) this.handleOnStepEffects();
      break;
    case 6: // right.
      if (Math.round(this._x) > roundX) this.handleOnStepEffects();
      break;
    case 8: // up.
      if (Math.round(this._y) < roundY) this.handleOnStepEffects();
      break;
    default:
      break;
  }
};

/**
 * Processes the pixel movement for followers.
 */
Game_Player.prototype.processFollowersPixelMoving = function()
{
  // update the position for the player.
  this._recordPosition();

  // grab all the followers the player has.
  const followers = this._followers._data//.reverse();

  // iterate over all the followers to do movement things.
  followers.forEach((follower, index) =>
  {
    // grab the battler from the follower.
    const battler = follower.getJabsBattler();

    // check if we have a battler.
    if (battler)
    {
      // stop processing if the battler is engaged or alerted.
      if (battler.isEngaged() || battler.isAlerted()) return;
    }

    // determine who the previous character was in the sequence.
    const precedingCharacter = index > 0
      ? followers.at(index - 1)
      : $gamePlayer;

    // update the follower's direction.
    follower.pixelFaceCharacter(precedingCharacter);

    const last = precedingCharacter._lastPosition();
    if (last)
    {
      // move the follower to the new location.
      follower.relocate(last.x, last.y);
    }

    // flag the follower as holding the button.
    follower.startPixelMoving();
  });
};

/**
 * Stops the pixel movement for followers.
 */
Game_Player.prototype.stopFollowersPixelMoving = function()
{
  // iterate over the followers and halt their pixel movement.
  this._followers._data.forEach(follower => follower.stopPixelMoving());
};