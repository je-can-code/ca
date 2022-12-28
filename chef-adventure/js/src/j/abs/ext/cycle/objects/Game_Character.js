/**
 * A collection of all command codes that are associated with movement of the character.
 * This is explicitly in regards to move route commands.
 * @type {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]}
 */
Game_Character.repeatableMoveCommandCodes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

//region properties
/**
 * Extends {@link Game_Character.initMembers}.
 * Includes our cyclone movement repeat trackers.
 */
J.ABS.EXT.CYCLE.Aliased.Game_Character.set('initMembers', Game_Character.prototype.initMembers);
Game_Character.prototype.initMembers = function()
{
  // perform original logic.
  J.ABS.EXT.CYCLE.Aliased.Game_Character.get('initMembers').call(this);

  // initialize our adapter members.
  this.initCycloneAdapterMembers();
};

/**
 * Initializes all members related to this cyclone adapter.
 */
Game_Character.prototype.initCycloneAdapterMembers = function()
{
  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with this cyclone movement adapter.
   */
  this._j._cycleAdapter = {};

  /**
   * Whether or not this character is repeating their steps.
   * @type {boolean}
   */
  this._j._cycleAdapter._isRepeating = false;

  /**
   * How many repeats are left.
   * @type {number}
   */
  this._j._cycleAdapter._repeatCount = 0;
};

/**
 * Gets whether or not this character is currently repeating a movement.
 * @returns {boolean}
 */
Game_Character.prototype.isRepeatingMovement = function()
{
  return this._j._cycleAdapter._isRepeating;
};

/**
 * Starts the repeat movement.
 */
Game_Character.prototype.beginRepeatMovement = function()
{
  this._j._cycleAdapter._isRepeating = true;
};

/**
 * Ends the repeat movement.
 */
Game_Character.prototype.stopRepeatMovement = function()
{
  this._j._cycleAdapter._isRepeating = false;
};

/**
 * Gets how many repeats are left for the current repeating movement.
 * @returns {number}
 */
Game_Character.prototype.repeatingMovementCount = function()
{
  return this._j._cycleAdapter._repeatCount;
};

/**
 * Sets the repeating movement count to a given number.
 * @param {number=} count The number of times to repeat the movement command; defaults to stepcount.
 */
Game_Character.prototype.initializeRepeatingMovementCount = function(count = CycloneMovement.stepCount)
{
  this._j._cycleAdapter._repeatCount = count;
};

/**
 * Modifies the repeating movement count by a given number.
 * @param {number} amount The amount to modify by; defaults to -1.
 */
Game_Character.prototype.modRepeatingMovementCount = function(amount = -1)
{
  this._j._cycleAdapter._repeatCount += amount;
};
//endregion properties

/**
 * Overwrites {@link Game_Character.updateRoutineMove}.
 * Accommodates move routes for events to repeat their movements for as many steps as defined
 * in the plugin configuration for Cyclone-Movement.
 *
 * This does not apply to actions.
 */
J.ABS.EXT.CYCLE.Aliased.Game_Character.set('updateRoutineMove', Game_Character.prototype.updateRoutineMove);
Game_Character.prototype.updateRoutineMove = function()
{
  // check if this is an action, as they obey default logic.
  if (this.isJabsAction())
  {
    // perform original logic.
    J.ABS.EXT.CYCLE.Aliased.Game_Character.get('updateRoutineMove').call(this);

    // stop processing.
    return;
  }

  // perform our adjusted move route updating.
  this.handleCycloneRoutineMove();
};

/**
 * Handles the adaptive movement of move routes combined with cyclone movement.
 */
Game_Character.prototype.handleCycloneRoutineMove = function()
{
  // check if we are waiting in the move route.
  if (this._waitCount > 0)
  {
    // decrement wait count.
    this._waitCount--;

    // stop processing if we are waiting.
    return;
  }

  // movement is always successful when you are being commanded.
  this.setMovementSuccess(true);

  // extract the move route command.
  const command = this._moveRoute.list[this._moveRouteIndex];

  // check if the command is present.
  if (command)
  {
    // begin repeating movement if applicable.
    this.startRepeatingMovement(command);

    // process the move command.
    this.processMoveCommand(command);

    // update repeated movement tracking.
    this.updateRepeatedMovements();

    // check if we have any more repeats left.
    if (!this.isRepeatingMovement())
    {
      // advance the index to process the next command in the list.
      this.advanceMoveRouteIndex();
    }
  }
};

/**
 * Starts the repeating movement functionality.
 */
Game_Character.prototype.startRepeatingMovement = function(command)
{
  // check if we should start repeating movement.
  if (this.canStartRepeatingMovement(command))
  {
    // start repeating.
    this.beginRepeatMovement();

    // initialize the repeating movement count!
    this.initializeRepeatingMovementCount();
  }
};

/**
 * Determines whether or not this character can repeat the given command.
 * @param {rm.types.EventCommand} command The event command to potentially repeat.
 * @returns {boolean} True if we should repeat the command, false otherwise.
 */
Game_Character.prototype.canStartRepeatingMovement = function(command)
{
  // do not start repeating if we are already repeating.
  if (this.isRepeatingMovement()) return false;

  // do not start repeating if the command code isn't a supported movement command.
  if (!Game_Character.repeatableMoveCommandCodes.includes(command.code)) return false;

  // start repeating!
  return true;
};

/**
 * Updates the repeated movement functionality.
 */
Game_Character.prototype.updateRepeatedMovements = function()
{
  // check if we are currently repeating movement.
  if (this.isRepeatingMovement())
  {
    // handle decrementing the repeated movement counter.
    this.modRepeatingMovementCount();

    // check if we have reached 0 remaining repeated movement counts.
    if (this.repeatingMovementCount() === 0)
    {
      // stop repeating if we have.
      this.stopRepeatMovement();
    }
  }
};