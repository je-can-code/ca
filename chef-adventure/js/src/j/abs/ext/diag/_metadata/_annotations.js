//region Initialization
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 DIAG] Fixes diagonal movement for projectiles and characters.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @base J-ABS
 * @orderAfter J-Base
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