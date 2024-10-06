//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 CYCLE] An adapter to accommodate Cyclone-Movement in JABS.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-ABS
 * @base Cyclone-Movement
 * @orderAfter J-ABS
 * @orderAfter Cyclone-Movement
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is an adapter to fix a few quirks with the way JABS interacts
 * with the pixel movement plugin "Cyclone-Movement".
 *
 * This plugin requires JABS.
 * This plugin requires Cyclone-Movement.
 * This plugin has no plugin parameter configuration.
 * ----------------------------------------------------------------------------
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The over-arching extensions collection for JABS.
 */
J.ABS.EXT ||= {};

/**
 * The plugin umbrella that governs all things related to this extension plugin.
 */
J.ABS.EXT.CYCLE = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ABS.EXT.CYCLE.Metadata = {
  /**
   * The name of this plugin.
   */
  Name: `J-ABS-CycloneAdapter`,

  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.ABS.EXT.CYCLE.PluginParameters = PluginManager.parameters(J.ABS.EXT.CYCLE.Metadata.Name);

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.EXT.CYCLE.Aliased = {
  Game_Character: new Map(),
  Game_Event: new Map(),
  Game_Follower: new Map(),
  Game_Player: new Map(),
  JABS_Action: new Map(),
  JABS_Battler: new Map(),
};
//endregion Introduction

/**
 * Sets the number of steps that will be force-moved when dodging.
 * @param {number} stepCount The number of steps to dodge.
 */
J.ABS.EXT.CYCLE.Aliased.JABS_Battler.set('setDodgeSteps', JABS_Battler.prototype.setDodgeSteps);
JABS_Battler.prototype.setDodgeSteps = function(stepCount)
{
  // modify the step count because pixel movement makes it move multiplicatively per-step.
  const modifiedStepCount = (stepCount * CycloneMovement.stepCount);

  // perform original logic- but with the modified step count.
  J.ABS.EXT.CYCLE.Aliased.JABS_Battler.get('setDodgeSteps')
    .call(this, modifiedStepCount);
};

/**
 * Extends {@link #destroy}.<br>
 * Reloads the collision table in case the enemy was a part of the tileset.
 */
J.ABS.EXT.CYCLE.Aliased.JABS_Battler.set('destroy', JABS_Battler.prototype.destroy);
JABS_Battler.prototype.destroy = function()
{
  // before destruction, check if the battler was not an actor.
  const isNotActor = !this.getBattler()
    .isActor();

  // perform original logic.
  J.ABS.EXT.CYCLE.Aliased.JABS_Battler.get('destroy')
    .call(this);

  // check if the defeated battler was not an actor.
  if (isNotActor)
  {
    // reload the collision table.
    CycloneMovement.loadDefaultCollisionTable();
  }
};

/**
 * A collection of all command codes that are associated with movement of the character.
 * This is explicitly in regards to move route commands.
 * @type {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]}
 */
Game_Character.repeatableMoveCommandCodes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ];

//region properties
/**
 * Extends {@link Game_Character.initMembers}.<br>
 * Includes our cyclone movement repeat trackers.
 */
J.ABS.EXT.CYCLE.Aliased.Game_Character.set('initMembers', Game_Character.prototype.initMembers);
Game_Character.prototype.initMembers = function()
{
  // perform original logic.
  J.ABS.EXT.CYCLE.Aliased.Game_Character.get('initMembers')
    .call(this);

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
 * Overrides {@link Game_Character.updateRoutineMove}.<br>
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
    J.ABS.EXT.CYCLE.Aliased.Game_Character.get('updateRoutineMove')
      .call(this);

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

/**
 * Overrides {@link Game_Follower.chaseCharacter}.<br>
 * Prevents the follower from chasing after the player while they are in combat.
 * @param {Game_Character} character The character this follower is following.
 */
J.ABS.EXT.CYCLE.Aliased.Game_Follower.set('chaseCharacter', Game_Follower.prototype.chaseCharacter);
Game_Follower.prototype.chaseCharacter = function(character)
{
  // if we are
  if (this.isDoingJabsAllyAiThings())
  {
    // let the AI handle the chasing.
    this.obeyJabsAi(character);

    // stop processing.
    return;
  }

  // perform original logic.
  J.ABS.EXT.CYCLE.Aliased.Game_Follower.get('chaseCharacter')
    .call(this, character);
};

/**
 * Determine if this follower is being controlled by JABS AI in some way.
 * @returns {boolean}
 */
Game_Follower.prototype.isDoingJabsAllyAiThings = function()
{
  // check if we can obey JABS AI.
  const canObey = this.canObeyJabsAi();

  // if we cannot obey, we are not doing JABS AI things.
  if (!canObey) return false;

  // check if we are in combat.
  const isInCombat = this.isInCombat();

  // if we are not in combat, then we are not doing JABS AI things.
  if (!isInCombat) return false;

  // we must be doing JABS AI things!
  return true;
};

//region Game_Player
/**
 * If we're using cyclone movement, adjust their triggering of events to not interact
 * with battlers and such if they are also events that have event commands.
 */
J.ABS.EXT.CYCLE.Aliased.Game_Player.set('shouldTriggerEvent', Game_Player.prototype.shouldTriggerEvent);
Game_Player.prototype.shouldTriggerEvent = function(event, triggers, normal)
{
  // if the event is a battler, then we should never trigger events when mashing buttons.
  if (event.isJabsBattler()) return false;

  // perform original logic.
  return J.ABS.EXT.CYCLE.Aliased.Game_Player.get('shouldTriggerEvent')
    .call(this, event, triggers, normal);
};

/**
 * Overrides {@link #checkEventTriggerThere}.<br>
 * Rounds the x2,y2 coordinates down so that counter-checks work properly.
 * @param {[number, number, number]} triggers The type of event triggers that are being used.
 */
Game_Player.prototype.checkEventTriggerThere = function(triggers)
{
  // if we cannot start events, then do not.
  if (!this.canStartLocalEvents()) return;

  // discern direction of the player.
  const direction = this.direction();

  // grab the player's current coordinates.
  const x1 = this.left;
  const y1 = this.top;

  // calculate the coordinates of the potential event to trigger.
  const x2 = CycloneMovement.roundXWithDirection(x1, direction);
  const y2 = CycloneMovement.roundYWithDirection(y1, direction);

  // trigger the event!
  this.startMapEvent(x2, y2, triggers, true);

  // extract counter differentiation of the following rounded-down coordinates.
  const isCounter = $gameMap.isCounter(Math.floor(x2), Math.floor(y2));

  // check if we need to look over a counter to trigger an event.
  if (!$gameMap.isAnyEventStarting() && isCounter)
  {
    // grab the coordinates of the event across the counter.
    const x3 = $gameMap.roundXWithDirection(x2, direction);
    const y3 = $gameMap.roundYWithDirection(y2, direction);

    // trigger the event across the counter.
    this.startMapEvent(x3, y3, triggers, true);
  }
}
//endregion Game_Player