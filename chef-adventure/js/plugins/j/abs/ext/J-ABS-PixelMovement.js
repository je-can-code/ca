/*  BUNDLED TIME: Sun Jul 31 2022 11:23:06 GMT-0700 (Pacific Daylight Time)  */

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

Game_Character.prototype.diagonalDistancePerFrame = function()
{
  return this.distancePerFrame() / Math.SQRT2;
};

Game_Character.prototype.setRealX = function(realX)
{
  this._realX = realX;
};

Game_Character.prototype.setRealY = function(realY)
{
  this._realY = realY;
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
  // round the x,y coordinates.
  const roundX = Math.round(this._x);
  const roundY = Math.round(this._y);

  // determine the pixel distance per frame.
  const distencePerFrame = this.distancePerFrame();

  // shorthand test methods for checking if we can move in a given direction any further.
  const downTest = (offset = 0) => 
  {
    return this.canPass(roundX + offset, Math.floor(this._y + distencePerFrame), 2);
  }
  const upTest = (offset = 0) => 
  {
    return this.canPass(roundX + offset, Math.ceil(this._y - distencePerFrame), 8);
  }
  const leftTest = (offset = 0) => 
  {
    return this.canPass(Math.ceil(this._x - distencePerFrame), roundY + offset, 4);
  }
  const rightTest = (offset = 0) => 
  {
    return this.canPass(Math.floor(this._x + distencePerFrame), roundY + offset, 6);
  }

  // shorthand methods for performing a step.
  const walkStep = () => 
  {
    this.increaseSteps();
    this.checkEventTriggerHere([1, 2]);
  }

  // TODO: refactor this?
  // switch on the direction given.
  switch (direction) 
  {
    case 1: {
      const canLeft = leftTest(), canDown = downTest();
      if (canLeft && canDown) 
      {
        if (leftTest(1)) 
        {
          this.setMovementSuccess(true);
          const dis = this.diagonalDistancePerFrame();
          this._y += dis;
          this._x -= dis;
          if (Math.round(this._y) > roundY || Math.round(this._x) < roundX) 
          {
            walkStep();
          }
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
    }
    case 3: {
      const canRight = rightTest(), canDown = downTest();
      if (canRight && canDown) 
      {
        if (rightTest(1)) 
        {
          this.setMovementSuccess(true);
          const dis = this.distancePerFrame() / Math.SQRT2;
          this._y += dis;
          this._x += dis;
          if (Math.round(this._y) > roundY || Math.round(this._x) > roundX) 
          {
            walkStep();
          }
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
    }
    case 7: {
      const canLeft = leftTest(), canUp = upTest();
      if (canLeft && canUp) 
      {
        if (leftTest(-1)) 
        {
          this.setMovementSuccess(true);
          const dis = this.distancePerFrame() / Math.SQRT2;
          this._y -= dis;
          this._x -= dis;
          if (Math.round(this._y) < roundY || Math.round(this._x) < roundX) 
          {
            walkStep();
          }
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
        direction = 8;
      }
      break;
    }
    case 9: {
      const canRight = rightTest(), canUp = upTest();
      if (canRight && canUp) 
      {
        if (rightTest(-1)) 
        {
          this.setMovementSuccess(true);
          const dis = this.distancePerFrame() / Math.SQRT2;
          this._y -= dis;
          this._x += dis;
          if (Math.round(this._y) < roundY || Math.round(this._x) > roundX) 
          {
            walkStep();
          }
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
        direction = 8;
      }
      break;
    }
    case 2: {
      if (downTest()) 
      {
        this.setMovementSuccess(true);
        this._y += this.distancePerFrame();
        if (Math.round(this._y) > roundY) 
        {
          walkStep();
        }
        if (this._x > roundX && !downTest(1) ||
          this._x < roundX && !downTest(-1)) 
        {
          this._x = roundX;
        }
        return direction;
      }
      break;
    }
    case 8: {
      if (upTest()) 
      {
        this.setMovementSuccess(true);
        this._y -= this.distancePerFrame();
        if (Math.round(this._y) < roundY) 
        {
          walkStep();
        }
        if (this._x > roundX && !upTest(1) ||
          this._x < roundX && !upTest(-1)) 
        {
          this._x = roundX;
        }
        return direction;
      }
      break;
    }
    case 4: {
      if (leftTest()) 
      {
        this.setMovementSuccess(true);
        this._x -= this.distancePerFrame();
        if (Math.round(this._x) < roundX) 
        {
          walkStep();
        }
        if (this._y > roundY && !leftTest(1) ||
          this._y < roundY && !leftTest(-1)) 
        {
          this._y = roundY;
        }
        return direction;
      }
      break;
    }
    case 6: {
      if (rightTest()) 
      {
        this.setMovementSuccess(true);
        this._x += this.distancePerFrame();
        if (Math.round(this._x) > roundX) 
        {
          walkStep();
        }
        if (this._y > roundY && !rightTest(1) ||
          this._y < roundY && !rightTest(-1)) 
        {
          this._y = roundY;
        }
        return direction;
      }
      break;
    }
  }

  // return the calculated direction.
  return direction;
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