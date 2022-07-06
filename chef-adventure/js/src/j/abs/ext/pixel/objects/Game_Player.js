/**
 * Overwrites {@link Game_Player.checkEventTriggerHere}.
 * Rounds the coordinates for the player to determine which events to start.
 * @param {number[]} triggers The numeric triggers for this event.
 */
Game_Player.prototype.checkEventTriggerHere = function(triggers)
{
  // check if we can start an event at the current location.
  if (this.canStartLocalEvents()) 
  {
    // start the event with the rounded coordinates.
    this.startMapEvent(Math.round(this.x), Math.round(this.y), triggers, false);
  }
};

/**
 * Extends {@link checkEventTriggerThere}.
 * Includes the rounding of the x,y coordinates when checking event triggers.
 * @param {number[]} triggers The triggers associated with checking the event at the location.
 * TODO: does this actually need to round?
 */
J.ABS.EXT.PIXEL.Aliased.Game_Player.set('checkEventTriggerThere', Game_Player.prototype.checkEventTriggerThere);
Game_Player.prototype.checkEventTriggerThere = function(triggers)
{
  // round the x,y coordinates.
  this._x = Math.round(this.x);
  this._y = Math.round(this.y);

  // perform original logic.
  J.ABS.EXT.PIXEL.Aliased.Game_Player.get('checkEventTriggerThere').call(this, triggers);
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

        // iterate over each one of the followers.
        for (const follower of followers) 
        {
          // also reset their positions.
          follower._resetCachePosition();
        }
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
        this._followersMove(0);

        // flag that we're holding the button.
        this.setMovePressed(true);
      }
      // we haven't succeeded in moving.
      else 
      {
        // don't actually move the followers.
        this._followersMove(2);

        // toggle the input to false since we're not pushing the button.
        this.setMovePressed(false);

        // check if we triggered an event infront of the player.
        this.checkEventTriggerTouchFront(direction);
      }

      // stop processing.
      return;
    }
    // check if we're running by means of point-click movement.
    else if ($gameTemp.isDestinationValid()) 
    {
      // round the x,y coordinates.
      this._x = Math.round(this._x);
      this._y = Math.round(this._y);

      // grab the coordinates for the point-click movement.
      const x = $gameTemp.destinationX();
      const y = $gameTemp.destinationY();

      // determine the direction to face for this movement.
      direction = this.findDirectionTo(x, y);

      // check to make sure the point-click movement resulted in a valid direction.
      if (direction > 0) 
      {
        // actually perform the move for the player.
        this.executeMove(direction);
      }

      // move the followers to the nearest rounded x,y coordinates.
      this._followersMove(1);

      // stop processing.
      return;
    }
  }

  // TODO: update this stupid 0/1/2 pattern inside _followersMove().
  // don't actually move the followers.
  this._followersMove(2);

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
          const dis = this.distancePerFrame() / Math.SQRT2;
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
 * The meat and potatoes for pixel movement for followers.
 * @param {0|1|2} move 0 = should move, 1 = round x,y coordinates, else = do nothing.
 */
Game_Player.prototype._followersMove = function(move)
{
  // update the position for the player.
  this._recordPosition();

  // grab all the followers the player has.
  const followers = this._followers._data;

  // if the parameter passed is 0, then we move.
  if (move === 0)
  {
    // iterate over each of the followers leveraging their index.
    for (let i = followers.length - 1; i >= 0; i--) 
    {
      // determine who the previous character was in the sequence.
      const precedingCharacter = i > 0
        ? followers.at(i-1)
        : $gamePlayer;

      // grab the most recently added tracking for the previous character in the train.
      const last = precedingCharacter._lastPosition();

      // check if we even have a last coordinate.
      if (last) 
      {
        // grab the given follower at the provided index.
        const follower = followers.at(i);

        // check if the follower is facing up/down.
        const isFacingVertically = Math.abs(last.y - follower._y) > Math.abs(last.x - follower._x);

        // if they are facing up or down, then we'll need to set their direction to such.
        if (isFacingVertically)
        {
          // check if the follower should be facing down.
          if (last.y > follower._y) 
          {
            // face the follower down.
            follower.setDirection(2);
          }
          // check if the follower should be facing up.
          else if (last.y < follower._y) 
          {
            // face the follower up.
            follower.setDirection(8);
          }
        }
        // we aren't facing vertically, so it must be horizontal facing instead.
        else
        {
          // check if the follower should be facing right.
          if (last.x > follower._x) 
          {
            // face the follower right.
            follower.setDirection(6);
          }
          // check if the follower should be facing left.
          else if (last.x < follower._x) 
          {
            // face thef ollower left.
            follower.setDirection(4);
          }
        }

        // update the follower's coordintes to be pixel-perfect.
        follower._x = last.x;
        follower._y = last.y;

        // flag the follower as holding the button.
        follower.setMovePressed(true);

        // update the followers new position.
        follower._recordPosition();
      }
    }
  }
  // the parameter wasn't 0, we must not be moving.
  else
  {
    // iterate over the followers.
    for (const follower of followers)
    {
      // if the parameter passed is 1, then just round the x,y coordinates.
      if (move === 1)
      {
        // round the x,y coordinates.
        follower._x = Math.round(follower.x);
        follower._y = Math.round(follower.y);
      }

      // this follower isn't moving.
      follower.setMovePressed(false);

      // update the position for this follower.
      follower._recordPosition();
    }
  }
};