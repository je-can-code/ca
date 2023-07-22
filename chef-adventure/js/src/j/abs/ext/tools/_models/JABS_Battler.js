/**
 * Initializes the properties of this battler that are not related to anything in particular.
 */
J.ABS.EXT.TOOLS.Aliased.JABS_Battler.set('initGeneralInfo', JABS_Battler.prototype.initGeneralInfo);
JABS_Battler.prototype.initGeneralInfo = function()
{
  // perform original logic.
  J.ABS.EXT.TOOLS.Aliased.JABS_Battler.get('initGeneralInfo').call(this);

  /**
   * The counter for how long this battler is waiting.
   * @type {boolean}
   */
  this._gapClosing = false;

  /**
   * The destination coordinates of where this battler is gap closing to.
   * @type {[number, number]}
   */
  this._gapCloseDestination = [0, 0];
};

/**
 * Begins the process of gap closing.
 */
JABS_Battler.prototype.beginGapClosing = function()
{
  this._gapClosing = true;
};

/**
 * Ends the process of gap closing.
 */
JABS_Battler.prototype.endGapClosing = function()
{
  this._gapClosing = false;
};

/**
 * Gets whether or not this battler is currently gap closing.
 * @returns {boolean}
 */
JABS_Battler.prototype.isGapClosing = function()
{
  return this._gapClosing;
};

/**
 * Gets the destination coordinates of where this battler is gap closing to.
 * @returns {[number,number]}
 */
JABS_Battler.prototype.gapCloseDestination = function()
{
  return this._gapCloseDestination;
};

/**
 * Sets the destination coordinates for this battler's gap close.
 * @param {[number, number]} destination The destination x:y coordinates.
 */
JABS_Battler.prototype.setGapCloseDestination = function(destination)
{
  this._gapCloseDestination = destination;
};

/**
 * Determines whether or not we have a valid gap close destination.
 * @returns {boolean} True if we have a valid destination, false otherwise.
 */
JABS_Battler.prototype.hasGapCloseDestination = function()
{
  // destructure the gap close destination.
  const [goalX, goalY] = this.gapCloseDestination();

  // if the destination is 0:0, then we don't have a destination.
  if (goalX === 0 && goalY === 0) return false;

  // otherwise we have a destination to gap close to!
  return true;
};

/**
 * Clears the destination coordinates for gap closing.
 */
JABS_Battler.prototype.clearGapCloseDestination = function()
{
  this._gapCloseDestination = [0, 0];
};

/**
 * Extends {@link JABS_Battler.update}.
 * Also updates the gap closing process.
 */
J.ABS.EXT.TOOLS.Aliased.JABS_Battler.set('update', JABS_Battler.prototype.update);
JABS_Battler.prototype.update = function()
{
  // perform original logic.
  J.ABS.EXT.TOOLS.Aliased.JABS_Battler.get('update').call(this);

  // also update gap closing.
  this.updateGapClosing();
};

/**
 * The update flow for managing gap closing.
 */
JABS_Battler.prototype.updateGapClosing = function()
{
  // check if we are currently gap closing.
  if (this.isGapClosing())
  {
    // make sure we have a valid destination.
    if (this.hasGapCloseDestination())
    {
      // check if we reached the destination yet.
      if (this.hasReachedGapCloseDestination())
      {
        this.clearGapCloseDestination();
        this.endGapClosing();
      }

      // we haven't reached the destination, keep going.
    }
    // we don't have a valid destination.
    else
    {
      // stop that.
      this.clearGapCloseDestination();
      this.endGapClosing();
    }
  }

  // not gap closing.
};

/**
 * Determines whether or not this battler can be gap closed to.
 * @returns {boolean} True if the battler can be gap closed to, false otherwise.
 */
JABS_Battler.prototype.isGapClosable = function()
{
  // grab the battler.
  const battler = this.getBattler();

  // check the battler to see if they are gap closable.
  const battlerGapClosable = battler.isGapClosable();

  // by default characters are not gap closable.
  let characterGapClosable = false;

  // check if this battler is an event-based battler.
  if (this.isEvent())
  {
    // grab the character.
    const character = this.getCharacter();

    // check the character to see if they are gap closable.
    characterGapClosable = character.isGapClosable();
  }

  // if either the battler or character is gap closable, then we can gap close.
  if (battlerGapClosable || characterGapClosable) return true;

  // no gap closing :(
  return false;
};

/**
 * Executes a gap close to the target based on the provided action.
 * @param {JABS_Action} action The `JABS_Action` containing the action data.
 * @param {JABS_Battler} target The target having the action applied against.
 */
JABS_Battler.prototype.gapCloseToTarget = function(action, target)
{
  // do not try to gap close if we are already gap closing.
  if (this.isGapClosing()) return;

  // begin the gap closing procedure.
  this.beginGapClosing();

  // set the gap close destination to wherever the target is at this moment.
  this.setGapCloseDestination([target.getX(), target.getY()]);

  // extract the gap close details from the skill.
  let { jabsGapCloseMode, jabsGapClosePosition } = action.getBaseSkill();

  // if the position is not identified, then default to "same".
  jabsGapClosePosition ??= J.ABS.EXT.TOOLS.GapClosePositions.Same;

  // determine the destination delta coordiantes.
  const [x, y] = this.determineGapCloseCoordinates(target, jabsGapClosePosition);

  // if the mode is not identified, then default to "jump".
  jabsGapCloseMode ??= J.ABS.EXT.TOOLS.GapCloseModes.Jump;

  // grab the underlying character for access to movement.
  const casterCharacter = this.getCharacter();

  // pivot on the mode.
  switch (jabsGapCloseMode)
  {
    case J.ABS.EXT.TOOLS.GapCloseModes.Jump:
      casterCharacter.jump(x, y)
      break;
    case J.ABS.EXT.TOOLS.GapCloseModes.Blink:
      // TODO: update player locate to be less visually jarring? (see: parallax background)
      casterCharacter.locate(target.getX(), target.getY());
      break;
    case J.ABS.EXT.TOOLS.GapCloseModes.Travel:
      // TODO: pathfind instead.
      casterCharacter.jump(x, y)
      break;
  }
};

/**
 * Determines where the precise coordinates are that we're attempting to gap close to.
 * Note that this doesn't return the x:y of the target, it returns the delta so that
 * @param {JABS_Battler} target The target having the action applied against.
 * @param {J.ABS.EXT.TOOLS.GapCloseModes} position The position post-gap-closing.
 * @returns {[x: number, y: number]}
 */
JABS_Battler.prototype.determineGapCloseCoordinates = function(target, position)
{
  const targetCharacter = target.getCharacter();

  const [x, y] = [this.getX(), this.getY()];
  const goalX = targetCharacter.deltaXFrom(x);
  const goalY = targetCharacter.deltaYFrom(y);

  if (position === J.ABS.EXT.TOOLS.GapClosePositions.Behind)
  {
    // TODO: adjust goal x,y based on position w/ target.
    return [goalX, goalY];
  }

  if (position === J.ABS.EXT.TOOLS.GapClosePositions.Infront)
  {
    // TODO: adjust goal x,y based on position w/ target.
    return [goalX, goalY];
  }

  // position must be "same", so just return the target's coordinates.
  return [goalX, goalY];
};

/**
 * Determines if this battler has reached its gap close destination coordinates yet.
 * @returns {boolean} True if it has reached the destination, false otherwise.
 */
JABS_Battler.prototype.hasReachedGapCloseDestination = function()
{
  // check if somehow we are processing this without a destination.
  if (!this.hasGapCloseDestination())
  {
    // stop gap closing.
    this.endGapClosing();

    // we are where we need to be.
    return true;
  }

  // destructure the destination out.
  const [goalX, goalY] = this.gapCloseDestination();

  // check where we're currently at.
  const [actualX, actualY] = [this.getX(), this.getY()];

  // the amount of wiggle room for gap closing- perfect gap closing is not viable.
  const fuzzy = JABS_Battler.gapCloseWiggleRoom();

  // check if we are generally at the target destination.
  const xOk = (actualX >= goalX-fuzzy) && (actualX <= goalX+fuzzy);
  const yOk = (actualY >= goalY-fuzzy) && (actualY <= goalY+fuzzy);
  const doneMoving = !(this.getCharacter().isMoving());

  // if we have reached the destination, then we're done.
  if (xOk && yOk && doneMoving) return true;

  // keep going!
  return false;
};

/**
 * A static value representing some degree of variance allowed for gap closing
 * to a target destination.
 * @returns {number} The amount of x:y coordinate wiggle room to identify as "close enough".
 */
JABS_Battler.gapCloseWiggleRoom = function()
{
  return 0.5;
};