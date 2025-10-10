//region Initialization
/*:
 * @target MZ
 * @plugindesc
 * [v1.1.0 DIAG] Enables diagonal movement.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter Cyclone-Movement
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin enables 8-directional movement for the player.
 * This plugin enables the respect of diagonal directions for JABS actions.
 * This plugin enables diagonal facing script controls in moveroutes.
 *
 * This plugin requires JABS.
 * ============================================================================
 * DIAGONAL DIRECTIONS FOR ACTIONS
 * Have you ever wanted your actions to respect diagonals? Well now they will!
 * Additionally, by leveraging some straight-forward script commands in your
 * action event moveroutes, you too can diagonlize your actions moveroutes to
 * make spirals and all sorts of fun stuff!
 *
 * Use this to turn an event 45 degrees to the right:
 *   this.turnRight45();
 *
 * Use this to turn an event 45 degrees to the left:
 *   this.turnLeft45();
 *
 * Use this to turn an event randomly right or left 45 degrees:
 *   this.turnRightOrLeft45();
 *
 * ----------------------------------------------------------------------------
 * HOMING ACTIONS
 * Have you ever wanted your actions to home into targets? Well now you can! By
 * dropping one of these straight-forward script commands into your action
 * event moveroutes and slapping 'em on repeat, you too can home into current
 * targets and/or your last hit targets to your heart's content!
 *
 * What is "Homing"?
 * "Homing" is defined as taking the absolute shortest route to the target,
 * respecting terrain that the action cannot pass. In most cases, action events
 * probably have 'through' checked, so it will simply be the most direct route
 * to the target, but should the action not have 'through' checked, it will
 * pathfind to the target.
 *
 * Use this to force an action event to home into it's last-hit target:
 *   this.homeIntoLastHit();
 *
 * Use this to force an action event to home into it's current target:
 *   this.homeIntoTarget();
 *
 * ----------------------------------------------------------------------------
 * SEEKING ACTIONS
 * Have you ever wanted your actions to sorta home into targets, but be a bit
 * more subtle about it? Well now you can! By dropping one of these straight-
 * forward script commands into your action event moveroutes and slapping 'em
 * on repeat, you too can sorta gradually home into your current targets and/or
 * your last hit targets to your heart's content!
 *
 * What is "Seeking"?
 * "Seeking" is defined as turning 45 degrees once per step while moving toward
 * the target, NOT respecting terrain that the action cannot pass. In most
 * cases, the action events will probably have 'through' checked, so it will
 * simply be the somewhat most direct route to the target, but should the
 * action not have 'through' checked, it will loosely head towards the target
 * until a collision with something impassible.
 *
 * Use this to force an event to seek it's last-hit target:
 *   this.seekLastHit();
 *
 * Use this to force an event to seek it's current target:
 *   this.seekTarget();
 * ============================================================================
 * CHANGELOG:
 * - 1.1.0
 *    Retroactively added this CHANGELOG.
 *    Removed unnecessary references to Cyclone-Movement from this plugin.
 *    Cleaned up the code and added jsdocs.
 *    Updated the plugin help to have a more verbose explanation.
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '1.0.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }

  // Check to ensure we have the minimum required version of the J-ABS plugin.
  const requiredJabsVersion = '2.4.0';
  const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.Version, requiredJabsVersion);
  if (!hasJabsRequirement)
  {
    throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
  }
})();
//endregion version check

//region plugin metadata
/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.ABS.EXT.DIAG = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ABS.EXT.DIAG.Metadata = {};
J.ABS.EXT.DIAG.Metadata.Name = `J-ABS-Diagonals`;
J.ABS.EXT.DIAG.Metadata.Version = '1.1.0';

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.ABS.EXT.DIAG.PluginParameters = PluginManager.parameters(J.ABS.EXT.DIAG.Metadata.Name);

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.EXT.DIAG.Aliased = {};
J.ABS.EXT.DIAG.Aliased.Game_Event = new Map();
J.ABS.EXT.DIAG.Aliased.Game_Player = new Map();
J.ABS.EXT.DIAG.Aliased.JABS_Engine = new Map();
//endregion plugin metadata
//endregion Initialization

//region JABS_Engine
/**
 * Extends {@link #applyActionToActionEventSprite}<br/>
 * Also applies the custom direction initialization for the action event.
 */
J.ABS.EXT.DIAG.Aliased.JABS_Engine.set(
  'applyActionToActionEventSprite',
  JABS_Engine.prototype.applyActionToActionEventSprite);
JABS_Engine.prototype.applyActionToActionEventSprite = function(actionEventSprite, action)
{
  // perform original logic.
  J.ABS.EXT.DIAG.Aliased.JABS_Engine.get('applyActionToActionEventSprite').call(this, actionEventSprite, action);

  // also set the custom and potentially diagonal direction.
  actionEventSprite.setCustomDirection(action.direction());
};
//endregion JABS_Engine

//region Game_Event
/**
 * Extends {@link #initMembers}.<br/>
 * Also initializes the diagonal data members.
 */
J.ABS.EXT.DIAG.Aliased.Game_Event.set('initMembers', Game_Event.prototype.initMembers);
Game_Event.prototype.initMembers = function()
{
  // perform original logic.
  J.ABS.EXT.DIAG.Aliased.Game_Event.get('initMembers')
    .call(this);

  // initialize our diagonal members.
  this.initDiagMembers();
};

/**
 * Initialize the diagonal-related members.
 */
Game_Event.prototype.initDiagMembers = function()
{
  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with JABS.
   */
  this._j._abs ||= {};

  /**
   * A grouping of all properties associated with the diagonal extension.
   */
  this._j._abs._diag = {};

  /**
   * The initial direction this event is facing.
   */
  this._j._abs._diag._initialDirection = 0;
};

/**
 * Sets the custom direction being faced on this event's creation.
 * @param {number} direction The custom direction faced on creation.
 */
Game_Event.prototype.setCustomDirection = function(direction)
{
  // don't turn if direction is fixed.
  if (this.isDirectionFixed()) return;

  this._j._abs._diag._initialDirection = direction;
};

/**
 * Gets the custom direction being faced on this event's creation.
 * This direction gets mutated over time based on changed facing from a moveroute.
 * @returns {number}
 */
Game_Event.prototype.getCustomDirection = function()
{
  return this._j._abs._diag._initialDirection;
};

//region update existing functionality
/**
 * Extends {@link #moveStraight}.<br/>
 * If this is a JABS action and also it has an custom set direction that is diagonal, move diagonal instead.
 * @param {number} direction The direction being moved.
 */
J.ABS.EXT.DIAG.Aliased.Game_Event.set('moveStraight', Game_Event.prototype.moveStraight);
Game_Event.prototype.moveStraight = function(direction)
{
  // if this isn't an action, don't look for manually set potentially diagonal directions.
  if (this.isJabsAction() === false)
  {
    return J.ABS.EXT.DIAG.Aliased.Game_Event.get('moveStraight')
      .call(this, direction);
  }

  // identify the custom direction this action is facing.
  const initialDirection = this.getCustomDirection();
  if (this.isDiagonalDirection(initialDirection) === false)
  {
    // must be a straight direction, so just perform original logic.
    return J.ABS.EXT.DIAG.Aliased.Game_Event.get('moveStraight')
      .call(this, direction);
  }

  // determine what the diagonal direction to move is.
  const [ horz, vert ] = this.getDiagonalDirections(initialDirection);

  // execute the move.
  this.moveDiagonally(horz, vert);

  // return the diagonal direction.
  return initialDirection;
};

/**
 * Extends {@link #moveDiagonally}.<br/>
 * Noramlizes action directions when moving diagonally to face an appropriate cardinal direction instead.
 * @type {Game_Event.moveDiagonally}
 */
J.ABS.EXT.DIAG.Aliased.Game_Event.set('moveDiagonally', Game_Event.prototype.moveDiagonally);
Game_Event.prototype.moveDiagonally = function(horz, vert)
{
  // perform original logic.
  J.ABS.EXT.DIAG.Aliased.Game_Event.get('moveDiagonally')
    .call(this, horz, vert);

  // if this isn't an action event, we shouldn't try to normalize the direction.
  if (this.isJabsAction() === false) return;

  // if this is not a diagonal direction, don't try to modify facing.
  if (this.isDiagonalDirection(this.direction()) === false) return;

  // determine the correct direction to face and set it.
  const newDirection = this.normalizeActionDirection();
  this.setDirection(newDirection);
};

/**
 * Determines the appropriate cardinal direction to face if moving a diagonal direction.
 * @returns {2|4|6|8}
 */
// eslint-disable-next-line complexity
Game_Event.prototype.normalizeActionDirection = function()
{
  // if this isn't an action, then this shouldn't try to calculate.
  if (this.isJabsAction() === false) return this.direction();

  // identify the direction this action was casted in.
  const castedDirection = this.getCastedDirection();

  // identify this action's current facing.
  const actionDirection = this.direction();

  // normalize the direction that should be faced.
  switch (castedDirection)
  {
    case 2: // caster faced down
      switch (actionDirection)
      {
        case 1: // action moving lower left
        case 3: // action moving lower right
          return castedDirection;
        case 7: // action moving upper left
        case 9: // action moving upper right
          return this.reverseDir(castedDirection);
      }
      return castedDirection;

    case 4: // caster faced left
      switch (actionDirection)
      {
        case 1: // action moving lower left
        case 7: // action moving upper left
          return castedDirection;
        case 3: // action moving lower right
        case 9: // action moving upper right
          return this.reverseDir(castedDirection);
      }
      return castedDirection;

    case 6: // caster faced right
      switch (actionDirection)
      {
        case 3: // action moving lower right
        case 9: // action moving upper right
          return castedDirection;
        case 1: // action moving lower left
        case 7: // action moving upper left
          return this.reverseDir(castedDirection);
      }
      return castedDirection;

    case 8: // caster faced up
      switch (actionDirection)
      {
        case 7: // action moving upper left
        case 9: // action moving upper right
          return castedDirection;
        case 1: // action moving lower left
        case 3: // action moving lower right
          return this.reverseDir(castedDirection);
      }
      return castedDirection;

    default: // somehow we were not facing one of the four cardinal directions, return default.
      return castedDirection;
  }
};

/**
 * Extends {@link #turn180}.<br/>
 * Also rotates the custom direction after turn 180 executes.
 */
J.ABS.EXT.DIAG.Aliased.Game_Event.set('turn180', Game_Event.prototype.turn180);
Game_Event.prototype.turn180 = function()
{
  // perform original logic.
  J.ABS.EXT.DIAG.Aliased.Game_Event.get('turn180')
    .call(this);

  // also set the underlying direction.
  this.setCustomDirection(this.reverseDir(this.getCustomDirection()));
};

/**
 * Extends {@link #turnRight90}.<br/>
 * Also rotates the custom direction after turn right 90 executes.
 */
J.ABS.EXT.DIAG.Aliased.Game_Event.set('turnRight90', Game_Event.prototype.turnRight90);
Game_Event.prototype.turnRight90 = function()
{
  // perform original logic.
  J.ABS.EXT.DIAG.Aliased.Game_Event.get('turnRight90')
    .call(this);

  // if there is no custom direction, then don't bother rotating it.
  if (!this.getCustomDirection()) return;

  // rotate the custom direction.
  switch (this.getCustomDirection())
  {
    case 1:
      this.setCustomDirection(7);
      break;
    case 3:
      this.setCustomDirection(1);
      break;
    case 7:
      this.setCustomDirection(9);
      break;
    case 9:
      this.setCustomDirection(3);
      break;
  }
};

/**
 * Extends {@link #turnLeft90}.<br/>
 * Also rotates the custom direction after turn left 90 executes.
 */
J.ABS.EXT.DIAG.Aliased.Game_Event.set('turnLeft90', Game_Event.prototype.turnLeft90);
Game_Event.prototype.turnLeft90 = function()
{
  // perform original logic.
  J.ABS.EXT.DIAG.Aliased.Game_Event.get('turnLeft90')
    .call(this);

  // if there is no custom direction, then don't bother rotating it.
  if (!this.getCustomDirection()) return;

  // rotate the custom direction.
  switch (this.direction())
  {
    case 1:
      this.setDirection(3);
      break;
    case 3:
      this.setDirection(9);
      break;
    case 7:
      this.setDirection(1);
      break;
    case 9:
      this.setDirection(7);
      break;
  }

};

/**
 * Rotate 45 degrees to the right.
 * If the new direction becomes a "straight" direction, then also
 * set the main direction to the new direction as well.
 */
Game_Event.prototype.turnRight45 = function()
{
  switch (this.getCustomDirection())
  {
    case 1:
      this.setCustomDirection(4);
      this.setDirection(4);
      break;
    case 2:
      this.setCustomDirection(1);
      break;
    case 3:
      this.setCustomDirection(2);
      this.setDirection(2);
      break;
    case 4:
      this.setCustomDirection(7);
      break;
    case 6:
      this.setCustomDirection(3);
      break;
    case 7:
      this.setCustomDirection(8);
      this.setDirection(8);
      break;
    case 8:
      this.setCustomDirection(9);
      break;
    case 9:
      this.setCustomDirection(6);
      this.setDirection(6);
      break;
  }
};

/**
 * Rotate 45 degrees to the left.
 * If the new direction becomes a "straight" direction, then also
 * set the main direction to the new direction as well.
 */
Game_Event.prototype.turnLeft45 = function()
{
  switch (this.getCustomDirection())
  {
    case 1:
      this.setCustomDirection(2);
      this.setDirection(2);
      break;
    case 2:
      this.setCustomDirection(3);
      break;
    case 3:
      this.setCustomDirection(6);
      this.setDirection(6);
      break;
    case 4:
      this.setCustomDirection(1);
      break;
    case 6:
      this.setCustomDirection(9);
      break;
    case 7:
      this.setCustomDirection(4);
      this.setDirection(4);
      break;
    case 8:
      this.setCustomDirection(7);
      break;
    case 9:
      this.setCustomDirection(8);
      this.setDirection(8);
      break;
  }
};

/**
 * Rotate 45 degrees to randomly the right or left.
 */
Game_Event.prototype.turnRightOrLeft45 = function()
{
  Math.randomInt(2)
    ? this.turnLeft45()
    : this.turnRight45();
};

/**
 * Extends {@link #turnRandom}.<br/>
 * For actions, this will set a custom direction from any of the valid directions that aren't the way the action is
 * currently facing.
 */
J.ABS.EXT.DIAG.Aliased.Game_Event.set('turnRandom', Game_Event.prototype.turnRandom);
Game_Event.prototype.turnRandom = function()
{
  // perform original logic.
  J.ABS.EXT.DIAG.Aliased.Game_Event.get('turnRandom')
    .call(this);

  // identify all the available directions.
  const validDirections = this.getValidDirections()
    // exclude the currently faced direction to force a change of direction.
    .filter(dir => dir !== this.direction());

  // choose and set a random direction for the action.
  const randomDirection = validDirections[Math.randomInt(validDirections.length)];
  this.setCustomDirection(randomDirection);
};
//endregion update existing functionality

//region homing movement
/**
 * Pursues the target battler on the map.
 * If there is no target, then it'll just move straight ahead.
 * This is designed to be used from a move route on an event, not in-code.
 */
Game_Event.prototype.homeIntoTarget = function()
{
  // handle homing for actions.
  if (this.isJabsAction())
  {
    const target = this.getJabsAction()
      .getCaster()
      .getTarget();
    this.homeIntoTargetBattler(target);
  }
  // handle homing for battlers.
  else if (this.isJabsBattler())
  {
    const target = this.getJabsBattler()
      .getTarget();
    this.homeIntoTargetBattler(target);
  }
  // just move straight- no homing.
  else
  {
    this.moveStraight(this.direction());
  }
};

/**
 * Pursues the last hit battler on the map.
 * If there is no last hit battler, then it'll perform `this.homeIntoTarget()` instead.
 * This is designed to be used from a move route on an event, not in-code.
 */
Game_Event.prototype.homeIntoLastHit = function()
{
  // handle homing for actions.
  if (this.isJabsAction())
  {
    const lastHit = this.getJabsAction()
      .getCaster()
      .getBattlerLastHit();
    this.homeIntoLastHitBattler(lastHit);
  }
  // handle homing for battlers.
  else if (this.isJabsBattler())
  {
    const lastHit = this.getJabsBattler()
      .getBattlerLastHit();
    this.homeIntoLastHitBattler(lastHit);
  }
  // just move straight- no homing.
  else
  {
    this.moveStraight(this.direction());
  }
};

/**
 * Pursues the provided target.
 * If the target is invalid, move straight ahead instead.
 * @param {JABS_Battler} target The battler that is supposedly the current target.
 */
Game_Event.prototype.homeIntoTargetBattler = function(target)
{
  if (!target)
  {
    // if there isn't a target for this battler, then move straight instead.
    this.moveStraight(this.direction());
    return;
  }

  this.homeIntoBattler(target);
};

/**
 * The actual logic for homing into the last hit battler.
 * If there is no "last hit battler", then pursue the target instead.
 * @param {JABS_Battler} lastHit The battler that was supposedly last hit.
 */
Game_Event.prototype.homeIntoLastHitBattler = function(lastHit)
{
  if (!lastHit)
  {
    // if there hasn't been a last hit yet, then seek the target instead.
    this.homeIntoTarget();
    return;
  }

  this.homeIntoBattler(lastHit);
};

/**
 * Forces this event to seek a specific battler.
 * @param {JABS_Battler} battler The battler being pursued.
 */
Game_Event.prototype.homeIntoBattler = function(battler)
{
  const [ x, y ] = [ battler.getX(), battler.getY() ];
  // get the next direction to the last hit, diagonal directions included.
  const nextDir = this.findDiagonalDirectionTo(x, y);
  this.setCustomDirection(nextDir);
  if (this.isStraightDirection(nextDir))
  {
    // if the direction is a straight direction, then also set the main direction.
    this.setDirection(nextDir);
  }

  // move towards the target.
  this.moveStraight(this.direction());
};
//endregion homing movement

//region seeking movement
/**
 * Pursues the target battler on the map with a slow rotation.
 * If there is no target battler, then it'll just go straight ahead instead.
 * This is designed to be used from a move route on an event, not in-code.
 */
Game_Event.prototype.seekTarget = function()
{
  // handle seeking for actions.
  if (this.isJabsAction())
  {
    const target = this.getJabsAction()
      .getCaster()
      .getTarget();
    this.seekTargetBattler(target);
  }
  // handle seeking for battlers.
  else if (this.isJabsBattler())
  {
    const target = this.getJabsBattler()
      .getTarget();
    this.seekTargetBattler(target);
  }
  // just move straight- no seeking.
  else
  {
    this.moveStraight(this.direction());
  }
};

/**
 * Pursues the last hit battler on the map with a slow rotation.
 * If there is no last hit battler, then it'll perform `this.seekTarget()` instead.
 * This is designed to be used from a move route on an event, not in-code.
 */
Game_Event.prototype.seekLastHit = function()
{
  // handle seeking for actions.
  if (this.isJabsAction())
  {
    const lastHit = this.getJabsAction()
      .getCaster()
      .getBattlerLastHit();
    this.seekLastHitBattler(lastHit);
  }
  // handle seeking for battlers.
  else if (this.isJabsBattler())
  {
    const lastHit = this.getJabsBattler()
      .getBattlerLastHit();
    this.seekLastHitBattler(lastHit);
  }
  // just move straight- no seeking.
  else
  {
    this.moveStraight(this.direction());
  }
};

/**
 * Pursues the last hit battler on the map.
 * Compared to `homeIntoLastHit`, the rotation is once-per-step instead of instant.
 * @param {JABS_Battler} lastHit The battler that was supposedly last hit.
 */
Game_Event.prototype.seekLastHitBattler = function(lastHit)
{
  if (!lastHit)
  {
    // if there hasn't been a last hit yet, then seek the target instead.
    this.seekTarget();
    return;
  }

  this.seekBattler(lastHit);
};

/**
 * Pursues the last hit battler on the map.
 * Compared to `homeIntoLastHit`, the rotation is once-per-step instead of instant.
 * @param {JABS_Battler} target The battler that was supposedly last hit.
 */
Game_Event.prototype.seekTargetBattler = function(target)
{
  if (!target)
  {
    // if there isn't a target, then just move straight.
    this.moveStraight(this.direction());
    return;
  }

  this.seekBattler(target);
};

/**
 * Pursues the provided battler.
 * The rotation for this pursuit is gradual rather than instant like `.homeIntoBattler`.
 * @param {JABS_Battler} battler The battler being pursued.
 */
Game_Event.prototype.seekBattler = function(battler)
{
  const currDir = this.getCustomDirection();
  const [ x, y ] = [ battler.getX(), battler.getY() ];
  // get the next direction to the last hit, diagonal directions included.
  const finalDir = this.findDiagonalDirectionTo(x, y);

  this.gradualRotateToDirection(currDir, finalDir);
  this.moveStraight(this.direction());
};

/**
 * Rotates 45 degrees towards a given direction in the shortest way possible.
 * @param {number} currentDirection The current direction being faced.
 * @param {number} finalDirection The goal direction to be facing.
 */
Game_Event.prototype.gradualRotateToDirection = function(currentDirection, finalDirection)
{
  // if we are at the final direction, then continue on in that direction!
  if (currentDirection === finalDirection) return;

  // otherwise, determine whether we should be rotating left or right.
  let needLeft = [];
  switch (currentDirection)
  {
    case 1:
      needLeft = [ 2, 3, 6 ];
      break;
    case 2:
      needLeft = [ 3, 6, 9 ];
      break;
    case 3:
      needLeft = [ 6, 9, 8 ];
      break;
    case 4:
      needLeft = [ 1, 2, 3 ];
      break;
    case 6:
      needLeft = [ 9, 8, 7 ];
      break;
    case 7:
      needLeft = [ 4, 1, 2 ];
      break;
    case 8:
      needLeft = [ 7, 4, 1 ];
      break;
    case 9:
      needLeft = [ 8, 7, 4 ];
      break;
  }

  // actually perform the move based on the current and target direction.
  needLeft.includes(finalDirection)
    ? this.turnLeft45()
    : this.turnRight45();
};
//endregion seeking movement
//endregion Game_Event

//region Game_Player
/**
 * Overwrites {@link #getInputDirection}.<br/>
 * Leverages dir8 instead of dir4 by default.
 * @returns {number}
 */
Game_Player.prototype.getInputDirection = function()
{
  return Input.dir8;
};

/**
 * Moves straight in a given direction.
 * If there is an underlying diagonal direction, then move diagonally.
 * @param {number} direction The direction being moved.
 */
J.ABS.EXT.DIAG.Aliased.Game_Player.set('moveStraight', Game_Player.prototype.moveStraight);
Game_Player.prototype.moveStraight = function(direction)
{
  // if we're using cyclone movement, rely on that instead.
  if (globalThis.CycloneMovement)
  {
    // perform original logic.
    return J.ABS.EXT.DIAG.Aliased.Game_Player.get('moveStraight')
      .call(this, direction);
  }

  // check if the direction being moved is actually a diagonal direction.
  if (this.isDiagonalDirection(direction) === false)
  {
    // perform original logic.
    return J.ABS.EXT.DIAG.Aliased.Game_Player.moveStraight.call(this, direction);
  }

  // break down the diagonal directions from the single directional.
  const [ horz, vert ] = this.getDiagonalDirections(direction);

  // execute the diagonal movement.
  this.moveDiagonally(horz, vert);

  // return the direction moved.
  return direction;
};

/**
 * Extends built-in diagonal movement to also move either horizontally or vertically
 * if a move diagonally should fail.
 * @param {number} horz The horizontal piece of the direction to move.
 * @param {number} vert The vertical piece of the direction to move.
 */
J.ABS.EXT.DIAG.Aliased.Game_Player.set('moveDiagonally', Game_Player.prototype.moveDiagonally);
Game_Player.prototype.moveDiagonally = function(horz, vert)
{
  // perform original logic.
  J.ABS.EXT.DIAG.Aliased.Game_Player.get('moveDiagonally')
    .call(this, horz, vert);

  // if we're using cyclone movement, rely on that instead.
  if (globalThis.CycloneMovement) return;

  // check if the movement failed.
  if (this.isMovementSucceeded() === true) return;

  // try sliding vertically.
  this.setMovementSuccess(this.canPass(this._x, this._y, vert));
  if (this.isMovementSucceeded())
  {
    this.moveStraight(vert);
  }

  // try sliding horizontally.
  this.setMovementSuccess(this.canPass(this._x, this._y, horz));
  if (this.isMovementSucceeded())
  {
    this.moveStraight(horz);
  }

  // don't move at all.
};
//endregion Game_Player