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