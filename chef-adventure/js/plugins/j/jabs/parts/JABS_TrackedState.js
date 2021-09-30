/*:
 * @target MZ
 * @plugindesc 
 * [v3.0 JABS] Tracked State data structure.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-ABS
 * @help
 * ============================================================================
 * A component of JABS.
 * This class represents the data structure of a currently-tracked state.
 * These are used for maintaining awareness of states between map transfers.
 * ============================================================================
 */

/**
 * A class containing the tracked data for a particular state and battler.
 */
function JABS_TrackedState() { this.initialize(...arguments); };
JABS_TrackedState.prototype = {};
JABS_TrackedState.prototype.constructor = JABS_TrackedState;

/**
 * @constructor
 * @param {Game_Battler} battler The battler afflicted with this state.
 * @param {number} stateId The id of the state being tracked.
 * @param {number} iconIndex The icon index of the state being tracked.
 * @param {number} duration The duration of the state being tracked.
 * @param {Game_Battler} source The origin that applied this state to the battler.
 */
JABS_TrackedState.prototype.initialize = function({ battler, stateId, iconIndex, duration, source }) {
  /**
   * The battler being afflicted with this state.
   * @type {Game_Battler}
   */
  this.battler = battler;

  /**
   * The id of the state being tracked.
   * @type {number}
   */
  this.stateId = stateId;

  /**
   * The icon index of the state being tracked (for visual purposes).
   * @type {number}
   */
  this.iconIndex = iconIndex;

  /**
   * The current duration of the state being tracked. Decrements over time.
   * @type {number}
   */
  this.duration = duration;

  /**
   * Whether or not this tracked state is identified as `expired`.
   * Expired states do not apply to the battler, but are kept in the tracking collection
   * to grant the ability to refresh the state duration or whatever we choose to do.
   * @type {boolean}
   */
  this.expired = false;

  /**
   * The source that caused this state. Usually this is an opposing battler. If no source is specified,
   * then the afflicted battler is the source.
   * @type {Game_Battler}
   */
  this.source = source ?? battler;
};

/**
 * Updates this tracked state over time. If the duration reaches 0, then the state
 * is removed and this tracked state becomes `expired`.
 */
JABS_TrackedState.prototype.update = function() {
  if (this.duration > 0) {
    this.duration--;
  } else if (this.duration === 0 && this.stateId !== this.battler.deathStateId()) {
    this.removeStateFromBattler();
  }
};

/**
 * Performs the removal of the state from the battler and sets the `expired` to true.
 */
JABS_TrackedState.prototype.removeStateFromBattler = function() {
  const index = this.battler
    .states()
    .findIndex(state => state.id === this.stateId);
  if (index > -1) {
    this.battler.removeState(this.stateId);
    this.expired = true;
  }
};

/**
 * Gets whether or not this tracked state is `expired`.
 * @returns {boolean}
 */
JABS_TrackedState.prototype.isExpired = function() {
  return this.expired;
};

/**
 * Gets whether or not this tracked state is about to 'expire'.
 * @returns {boolean}
 */
JABS_TrackedState.prototype.isAboutToExpire = function() {
  return this.duration <= 90;
};
//ENDFILE