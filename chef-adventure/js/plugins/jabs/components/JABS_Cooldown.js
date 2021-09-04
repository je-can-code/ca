/*:
 * @target MZ
 * @plugindesc 
 * [v3.0 JABS] Data structure of a cooldown for JABS.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-ABS
 * @help
 * ============================================================================
 * A component of JABS.
 * This class contains the data associated with a skill slot's cooldown.
 * 
 * Plugin Developer Notes:
 * The cooldown is separate from an equipped skill, though they are related.
 * ============================================================================
 */

/**
 * A class representing a skill or item's cooldown data.
 */
class JABS_Cooldown {
  //#region initialize
  /**
   * @constructor
   * @param {string} key The key identifying this cooldown.
   */
  constructor(key) {
    this.key = key;
    this.initMembers();
  }

  /**
   * Initializes all members of this class.
   */
  initMembers() {
    this.frames = 0;
    this.ready = false;
    this.comboFrames = 0;
    this.comboReady = false;
    this.comboNextActionId = 0;
    this.locked = false;
  };
  //#endregion initialize

  /**
   * Gets whether or not if either of the components of the cooldown are ready.
   * @returns {boolean}
   */
  isAnyReady() {
    return this.ready || this.comboReady;
  };

  /**
   * Manages the update cycle for this cooldown.
   */
  update() {
    // don't update the cooldown for this skill while locked.
    if (this.isLocked()) {
      return;
    }

    this.updateBaseCooldown();
    this.updateComboCooldown();
  };

  //#region base cooldown
  /**
   * Updates the base skill data for this cooldown.
   */
  updateBaseCooldown() {
    if (this.ready) {
      return;
    }

    if (this.frames > 0) {
      this.tickBase()
      return;
    }

    if (this.frames <= 0) {
      this.enableBase();
    }
  };

  /**
   * Decrements the base cooldown gauge 1 frame at a time.
   */
  tickBase() {
    this.frames--;
  };

  /**
   * Enables the flag to indicate the base skill is ready for this cooldown.
   */
  enableBase() {
    this.ready = true;
    this.frames = 0;
  };

  /**
   * Gets whether or not the base skill is off cooldown.
   * @returns {boolean}
   */
  isBaseReady() {
    return this.ready;
  };

  /**
   * Sets a new value for the base cooldown to countdown from.
   * @param {number} frames The value to countdown from.
   */
  setFrames(frames) {
    this.frames = frames;
    if (this.frames <= 0) {
      this.ready = true;
      this.frames = 0;
    }

    if (this.frames > 0) {
      this.ready = false;
    }
  };

  /**
   * Adds a value to the combo frames to extend the combo countdown.
   * @param {number} frames The value to add to the countdown. 
   */
  modBaseFrames(frames) {
    this.frames += frames;
    if (this.frames <= 0) {
      this.ready = true;
      this.frames = 0;
    }

    if (this.frames > 0) {
      this.ready = false;
    }
  };
  //#endregion base cooldown

  //#region combo cooldown
  /**
   * Updates the combo data for this cooldown.
   */
  updateComboCooldown() {
    if (this.comboReady) {
      return;
    }

    if (this.comboFrames > 0) {
      this.tickCombo();
      return;
    }

    if (this.comboFrames <= 0) {
      this.enableCombo();
    }
  };

  /**
   * Decrements the combo gauge 1 frame at a time.
   */
  tickCombo() {
    this.comboFrames--;
  };

  /**
   * Enables the flag to indicate a combo is ready for this cooldown.
   */
  enableCombo() {
    this.comboFrames = 0;
    if (this.comboNextActionId) {
      this.comboReady = true;
    }
  };

  /**
   * Sets the combo frames to countdown from this value.
   * @param {number} frames The value to countdown from.
   */
  setComboFrames(frames) {
    this.comboFrames = frames;
    if (this.comboFrames <= 0) {
      this.comboReady = true;
      this.comboFrames = 0;
    }

    if (this.comboFrames > 0) {
      this.comboReady = false;
    }
  };

  /**
   * Adds a value to the combo frames to extend the combo countdown.
   * @param {number} frames The value to add to the countdown. 
   */
  modComboFrames(frames) {
    this.comboFrames += frames;
    if (this.comboFrames <= 0) {
      this.comboReady = true;
      this.comboFrames = 0;
    }

    if (this.comboFrames > 0) {
      this.comboReady = false;
    }
  };

  /**
   * Resets the combo data associated with this cooldown.
   */
  resetCombo() {
    this.comboFrames = 0;
    this.comboNextActionId = 0;
    this.comboReady = false;
  };

  /**
   * Gets whether or not the combo cooldown is ready.
   * @returns {boolean}
   */
  isComboReady() {
    return this.comboReady;
  }
  //#endregion combo cooldown

  //#region locking
  /**
   * Gets whether or not this cooldown is locked.
   * @returns {boolean}
   */
  isLocked() {
    return this.locked;
  };

  /**
   * Locks this cooldown to prevent it from cooling down.
   */
  lock() {
    this.locked = true;
  }

  /**
   * Unlocks this cooldown to allow it to finish cooling down.
   */
  unlock() {
    this.locked = false;
  };
  //#endregion locking
}