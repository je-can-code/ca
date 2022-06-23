//#region JABS_Cooldown
/**
 * A class representing a skill or item's cooldown data.
 */
class JABS_Cooldown
{
  /**
   * The key of the cooldown.
   * @type {string}
   */
  key = String.empty;

  /**
   * The frames of the cooldown.
   * @type {number}
   */
  frames = 0;

  /**
   * Whether or not the base cooldown is ready.
   * @type {boolean}
   */
  ready = false;

  /**
   * The number of frames in which the combo action can be executed instead.
   * @type {number}
   */
  comboFrames = 0;

  /**
   * Whether or not the combo cooldown is ready.
   * @type {boolean}
   */
  comboReady = false;

  /**
   * Whether or not this cooldown is locked from changing.
   * @type {boolean}
   */
  locked = false;

  /**
   * Whether or not the skill manager needs to clear the combo data for the
   * slot that this cooldown is attached to.
   * @type {boolean}
   */
  mustComboClear = false;

  //#region initialize
  /**
   * @constructor
   * @param {string} key The key identifying this cooldown.
   */
  constructor(key)
  {
    // assign the properties.
    this.key = key;

    // initialize the rest of the properties.
    this.clearData();
  }

  /**
   * Initializes all members of this class.
   */
  clearData()
  {
    // default all the values.
    this.frames = 0;
    this.ready = false;
    this.comboFrames = 0;
    this.comboReady = false;
    this.locked = false;
    this.mustComboClear = false;
  }
  //#endregion initialize

  /**
   * Whether or not the combo data needs clearing.
   * @returns {boolean}
   */
  needsComboClear()
  {
    return this.mustComboClear;
  }

  /**
   * Acknowledges the combo was cleared and sets the flag to false.
   */
  acknowledgeComboClear()
  {
    this.mustComboClear = false;
  }

  /**
   * Requests the combo to be cleared and sets the flag to true.
   */
  requestComboClear()
  {
    this.mustComboClear = true;
  }

  /**
   * Manages the update cycle for this cooldown.
   */
  update()
  {
    // check if we can update the cooldowns at all.
    if (!this.canUpdate()) return;

    // update the cooldowns.
    this.updateCooldownData();
  }

  /**
   * Determines whether or not this cooldown can be updated.
   * @returns {boolean} True if it can be updated, false otherwise.
   */
  canUpdate()
  {
    // cannot update a cooldown when it is locked.
    if (this.isLocked()) return false;

    // update the cooldown!
    return true;
  }

  /**
   * Updates the base and combo cooldowns.
   */
  updateCooldownData()
  {
    // update the base cooldown.
    this.updateBaseCooldown();

    // update the combo cooldown.
    this.updateComboCooldown();
  }

  //#region base cooldown
  /**
   * Updates the base skill data for this cooldown.
   */
  updateBaseCooldown()
  {
    // if the base cooldown is ready, do not update.
    if (this.ready) return;

    // check if we have a base cooldown to decrement.
    if (this.frames > 0)
    {
      // decrement the base cooldown.
      this.frames--;
    }

    // check if the base cooldown is complete.
    this.handleIfBaseReady();
  }

  /**
   * Enables the flag to indicate the base skill is ready for this cooldown.
   * This also clears the combo data, as they both cannot be available at the same time.
   */
  enableBase()
  {
    // set the base cooldown frames to 0.
    this.frames = 0;

    // toggles the base ready flag.
    this.ready = true;
  }

  /**
   * Gets whether or not the base skill is off cooldown.
   * @returns {boolean}
   */
  isBaseReady()
  {
    return this.ready;
  }

  /**
   * Sets a new value for the base cooldown to countdown from.
   * @param {number} frames The value to countdown from.
   */
  setFrames(frames)
  {
    // set the value.
    this.frames = frames;

    // check if the base cooldown is now ready.
    this.handleIfBaseReady();

    // check if the base cooldown is now not ready.
    this.handleIfBaseUnready();
  }

  /**
   * Adds a value to the combo frames to extend the combo countdown.
   * @param {number} frames The value to add to the countdown.
   */
  modBaseFrames(frames)
  {
    // modify the value.
    this.frames += frames;

    // check if the base cooldown is now ready.
    this.handleIfBaseReady();

    // check if the base cooldown is now not ready.
    this.handleIfBaseUnready();
  }

  /**
   * Checks if the base cooldown is in a state of ready.
   * If it is, the ready flag will be enabled.
   */
  handleIfBaseReady()
  {
    // check if the base cooldown is now ready.
    if (this.frames <= 0)
    {
      // clear the combo data.
      this.resetCombo();

      // enable the base skill.
      this.enableBase();
    }
  }

  /**
   * Checks if the base cooldown is in a state of unready.
   * If it is, the ready flag will be disabled.
   */
  handleIfBaseUnready()
  {
    // check if the base cooldown is now not ready.
    if (this.frames > 0)
    {
      // not ready.
      this.ready = false;
    }
  }
  //#endregion base cooldown

  //#region combo cooldown
  /**
   * Updates the combo data for this cooldown.
   */
  updateComboCooldown()
  {
    // if the combo cooldown is ready, do not update.
    if (this.comboReady) return;

    // decrement the combo cooldown.
    if (this.comboFrames > 0)
    {
      // decrement the combo cooldown.
      this.comboFrames--;
    }

    // handle if the base cooldown is now ready.
    this.handleIfComboReady();
  }

  /**
   * Enables the flag to indicate a combo is ready for this cooldown.
   */
  enableCombo()
  {
    // action ready!
    // zero the wait time for combo frames.
    this.comboFrames = 0;

    // enable the combo!
    this.comboReady = true;
  }

  /**
   * Sets the combo frames to countdown from this value.
   * @param {number} frames The value to countdown from.
   */
  setComboFrames(frames)
  {
    // set the value.
    this.comboFrames = frames;

    // handle if the base cooldown is now ready.
    this.handleIfComboReady();

    // handle if the base cooldown is now not ready.
    this.handleIfComboUnready();
  }

  /**
   * Adds a value to the combo frames to extend the combo countdown.
   * @param {number} frames The value to add to the countdown.
   */
  modComboFrames(frames)
  {
    // modify the value.
    this.comboFrames += frames;

    // handle if the base cooldown is now ready.
    this.handleIfComboReady();

    // handle if the base cooldown is now not ready.
    this.handleIfComboUnready();
  }

  /**
   * Checks if the combo cooldown is in a state of ready.
   * If it is, the ready flag will be enabled.
   */
  handleIfComboReady()
  {
    // check if the base cooldown is now ready.
    if (this.comboFrames <= 0)
    {
      // enable the combo!
      this.enableCombo();
    }
  }

  /**
   * Checks if the combo cooldown is in a state of unready.
   * If it is, the ready flag will be disabled.
   */
  handleIfComboUnready()
  {
    // check if the combo cooldown is now not ready.
    if (this.comboFrames > 0)
    {
      // not ready.
      this.comboReady = false;
    }
  }

  /**
   * Resets the combo data associated with this cooldown.
   */
  resetCombo()
  {
    // zero the combo frames.
    this.comboFrames = 0;

    // disable the ready flag.
    this.comboReady = false;

    // requests the slot containing this cooldown to clear the combo id.
    this.requestComboClear();
  }

  /**
   * Gets whether or not the combo cooldown is ready.
   * @returns {boolean}
   */
  isComboReady()
  {
    return this.comboReady;
  }
  //#endregion combo cooldown

  //#region locking
  /**
   * Gets whether or not this cooldown is locked.
   * @returns {boolean}
   */
  isLocked()
  {
    return this.locked;
  }

  /**
   * Locks this cooldown to prevent it from cooling down.
   */
  lock()
  {
    this.locked = true;
  }

  /**
   * Unlocks this cooldown to allow it to finish cooling down.
   */
  unlock()
  {
    this.locked = false;
  }
  //#endregion locking
}
//#endregion JABS_Cooldown