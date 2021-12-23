//#region Initialization
/*:
 * @target MZ
 * @plugindesc 
 * [v1.0 DIAG] Fixes diagonal movement for projectiles and characters.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @base J-ABS
 * @orderAfter J-BASE
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * This should be placed after J-ABS.
 * If Cyclone-Movement is being used, then this should go after that as well,
 * as it does alter some of the functionality associated with it.
 *
 * This updates the various rotates and movement directions to also take note
 * of the four diagonal directions as well as the cardinal directions.
 *
 * This also allows you to extend the move route to include more precise turns
 * and setup events to either home into or seek the target or last hit of
 * the caster (or of the battler itself).
 * ============================================================================
 * To use this, enter one of the following entries into the "script" command
 * within an event's move route. The most common use for this is for events
 * that live on the action map.
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
 * HOMING:
 * "Homing" is defined as:
 *   taking the absolute shortest route to the target.
 *
 * Use this to force an event to home into it's last-hit target:
 *   this.homeIntoLastHit();
 *
 * Use this to force an event to home into it's current target:
 *   this.homeIntoTarget();
 *
 * SEEKING:
 * "Seeking" is defined as:
 *   turning once per step and moving toward the target.
 *
 * Use this to force an event to seek it's last-hit target:
 *   this.seekLastHit();
 *
 * Use this to force an event to seek it's current target:
 *   this.seekTarget();
 * ============================================================================
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//#region version checks
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
//#endregion version check

//#region plugin metadata
/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.DIAG = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.DIAG.Metadata = {
  /**
   * The version of this plugin.
   */
  Name: `J-ABS-Diagonals`,
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.DIAG.PluginParameters = PluginManager.parameters(J.DIAG.Metadata.Name);
J.DIAG.Metadata = {
  ...J.DIAG.Metadata,
  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

/**
 * A collection of all aliased methods for this plugin.
 */
J.DIAG.Aliased = {
  Game_BattleMap: {},
  Game_Character: {},
  Game_Event: {},
  Game_Map: {},
  Game_Player: {},
};
//#endregion plugin metadata
//#endregion Initialization

//#region Game objects
//#region Game_Event
//#region update existing functionality
/**
 * Moves straight in a given direction.
 * If there is an underlying diagonal direction, then move diagonally.
 * @param {number} direction The direction being moved.
 */
J.DIAG.Aliased.Game_Event.moveStraight = Game_Event.prototype.moveStraight;
Game_Event.prototype.moveStraight = function(direction)
{
  const initialDirection = this.getCustomDirection();
  if (this.isDiagonalDirection(initialDirection))
  {
    const diagonalDirections = this.getDiagonalDirections(initialDirection);
    this.moveDiagonally(...diagonalDirections);
  }
  else
  {
    J.DIAG.Aliased.Game_Event.moveStraight.call(this, direction);
  }
};

J.DIAG.Aliased.Game_Event.moveDiagonally = Game_Event.prototype.moveDiagonally;
Game_Event.prototype.moveDiagonally = function(horz, vert)
{
  J.DIAG.Aliased.Game_Event.moveDiagonally.call(this, horz, vert);
  if (this.isDiagonalDirection(this.direction()))
  {
    this.convertDiagonalToDir4();
  }
};

Game_Event.prototype.convertDiagonalToDir4 = function()
{
  const castedDirection = this.getCastedDirection();
  const actionDirection = this.direction();
  switch (castedDirection)
  {
    case 2: // caster faced down
      switch (actionDirection)
      {
        case 1: // action moving lower left
        case 3: // action moving lower right
          this.setDirection(castedDirection);
          break;
        case 7: // action moving upper left
        case 9: // action moving upper right
          this.setDirection(this.reverseDir(castedDirection));
          break;
      }
      return;
    case 4: // caster faced left
      switch (actionDirection)
      {
        case 1: // action moving lower left
        case 7: // action moving upper left
          this.setDirection(castedDirection);
          break;
        case 3: // action moving lower right
        case 9: // action moving upper right
          this.setDirection(this.reverseDir(castedDirection));
          break;
      }
      return;
    case 6: // caster faced right
      switch (actionDirection)
      {
        case 3: // action moving lower right
        case 9: // action moving upper right
          this.setDirection(castedDirection);
          break;
        case 1: // action moving lower left
        case 7: // action moving upper left
          this.setDirection(this.reverseDir(castedDirection));
          break;
      }
      return;
    case 8: // caster faced up
      switch (actionDirection)
      {
        case 7: // action moving upper left
        case 9: // action moving upper right
          this.setDirection(castedDirection);
          break;
        case 1: // action moving lower left
        case 3: // action moving lower right
          this.setDirection(this.reverseDir(castedDirection));
          break;
      }
      return;
  }
};

/**
 * Extends the turn 180 to also manage diagonal rotations.
 */
Game_Event.prototype.turn180 = function()
{
  Game_Character.prototype.turn180.call(this);
  this.setCustomDirection(this.reverseDir(this.getCustomDirection()));
};

/**
 * Extends the turn random to also turn potentially diagonal as well.
 */
Game_Character.prototype.turnRandom = function()
{
  Game_Character.prototype.turnRandom.call(this);
  do
  {
    this.setCustomDirection(1 + Math.randomInt(9));
  }
  while (this.getCustomDirection() === 5); // 5 isn't a direction.
};

/**
 * Extends the turn right to also manage diagonal turns.
 */
Game_Event.prototype.turnRight90 = function()
{
  Game_Character.prototype.turnRight90.call(this);
  if (this.getCustomDirection())
  {
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
  }
};

/**
 * Extends the turn left to also manage diagonal turns.
 */
Game_Event.prototype.turnLeft90 = function()
{
  Game_Character.prototype.turnLeft90.call(this);
  if (this.getCustomDirection())
  {
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
//#endregion update existing functionality

//#region homing movement
/**
 * Pursues the target battler on the map.
 * If there is no target, then it'll just move straight ahead.
 * This is designed to be used from a move route on an event, not in-code.
 */
Game_Event.prototype.homeIntoTarget = function()
{
  if (this.isAction())
  {
    const target = this.getMapActionData().getCaster().getTarget();
    this.homeIntoTargetBattler(target);
  }
  else if (this.isJabsBattler())
  {
    const target = this.getMapBattler().getTarget();
    this.homeIntoTargetBattler(target);
  }
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
  if (this.isAction())
  {
    const lastHit = this.getMapActionData().getCaster().getBattlerLastHit();
    this.homeIntoLastHitBattler(lastHit);
  }
  else if (this.isJabsBattler())
  {
    const lastHit = this.getMapBattler().getBattlerLastHit();
    this.homeIntoLastHitBattler(lastHit);
  }
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
  // get the next direction to the last hit, diagonal directions included.
  const nextDir = this.findDiagonalDirectionTo(battler.getX(), battler.getY());
  this.setCustomDirection(nextDir);
  if (this.isStraightDirection(nextDir))
  {
    // if the direction is a straight direction, then also set the main direction.
    this.setDirection(nextDir);
  }

  // move towards the target.
  this.moveStraight(this.direction());
};
//#endregion homing movement

//#region seeking movement
/**
 * Pursues the target battler on the map with a slow rotation.
 * If there is no target battler, then it'll just go straight ahead instead.
 * This is designed to be used from a move route on an event, not in-code.
 */
Game_Event.prototype.seekTarget = function()
{
  if (this.isAction())
  {
    const target = this.getMapActionData().getCaster().getTarget();
    this.seekTargetBattler(target);
  }
  else if (this.isJabsBattler())
  {
    const target = this.getMapBattler().getTarget();
    this.seekTargetBattler(target);
  }
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
  if (this.isAction())
  {
    const lastHit = this.getMapActionData().getCaster().getBattlerLastHit();
    this.seekLastHitBattler(lastHit);
  }
  else if (this.isJabsBattler())
  {
    const lastHit = this.getMapBattler().getBattlerLastHit();
    this.seekLastHitBattler(lastHit);
  }
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
  const finalDir = this.findDiagonalDirectionTo(battler.getX(), battler.getY());
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
      needLeft = [2, 3, 6];
      break;
    case 2:
      needLeft = [3, 6, 9];
      break;
    case 3:
      needLeft = [6, 9, 8];
      break;
    case 4:
      needLeft = [1, 2, 3];
      break;
    case 6:
      needLeft = [9, 8, 7];
      break;
    case 7:
      needLeft = [4, 1, 2];
      break;
    case 8:
      needLeft = [7, 4, 1];
      break;
    case 9:
      needLeft = [8, 7, 4];
      break;
  }

  // actually perform the move based on the current and target direction.
  needLeft.includes(finalDirection)
    ? this.turnLeft45()
    : this.turnRight45();
};
//#endregion seeking movement
//#endregion Game_Event

//#region Game_Player
/**
 * OVERWRITE Leverages dir8 instead of dir4 by default.
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
J.DIAG.Aliased.Game_Player.moveStraight = Game_Player.prototype.moveStraight;
Game_Player.prototype.moveStraight = function(direction)
{
  // if we're using cyclone movement, rely on that instead.
  if (globalThis.CycloneMovement)
  {
    J.DIAG.Aliased.Game_Player.moveStraight.call(this, direction);
    return;
  }
  ;

  if (this.isDiagonalDirection(direction))
  {
    const diagonalDirections = this.getDiagonalDirections(direction);
    this.moveDiagonally(...diagonalDirections);
  }
  else
  {
    J.DIAG.Aliased.Game_Player.moveStraight.call(this, direction);
  }
};

/**
 * Extends built-in diagonal movement to also move either horizontally or vertically
 * if a move diagonally should fail.
 * @param {number} horz The horizontal piece of the direction to move.
 * @param {number} vert The vertical piece of the direction to move.
 */
J.DIAG.Aliased.Game_Player.moveDiagonally = Game_Player.prototype.moveDiagonally;
Game_Player.prototype.moveDiagonally = function(horz, vert)
{
  J.DIAG.Aliased.Game_Player.moveDiagonally.call(this, horz, vert);
  // if we're using cyclone movement, rely on that instead.
  if (globalThis && globalThis.CycloneMovement) return;

  if (!this.isMovementSucceeded())
  {

    // try vertical move
    this.setMovementSuccess(this.canPass(this._x, this._y, vert));
    if (this.isMovementSucceeded())
    {
      this.moveStraight(vert);
    }

    // try horizontal move
    this.setMovementSuccess(this.canPass(this._x, this._y, horz));
    if (this.isMovementSucceeded())
    {
      this.moveStraight(horz);
    }
  }
};

/**
 * If we're using cyclone movement, adjust their triggering of events to not interact
 * with battlers and such if they are also events that have event commands.
 */
if (globalThis && globalThis.CycloneMovement)
{
  J.DIAG.Aliased.Game_Player.shouldTriggerEvent = Game_Player.prototype.shouldTriggerEvent;
  Game_Player.prototype.shouldTriggerEvent = function(event, triggers, normal)
  {
    if (event.isJabsBattler())
    {
      return false;
    }
    else
    {
      return J.DIAG.Aliased.Game_Player.shouldTriggerEvent.call(this, event, triggers, normal);
    }
  };
}
//#endregion Game_Player
//#endregion Game objects
//ENDOFFILE