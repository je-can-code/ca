//region JABS_Cooldown
/**
 * A class representing a skill or item's cooldown data.
 * @param {string} key The key of the cooldown.
 */
function JABS_Cooldown(key)
{
  this.initialize(key);
}

JABS_Cooldown.prototype = {};
JABS_Cooldown.prototype.constructor = JABS_Cooldown;

//region initialize
/**
 * Initializes this cooldown.
 * @param {string} key The key for this cooldown.
 */
JABS_Cooldown.prototype.initialize = function(key)
{
  /**
   * The key of the cooldown.
   * @type {string}
   */
  this.key = key;

  // initialize the class members.
  this.initMembers();

  // initialize the rest of the properties.
  this.clearData();
};

/**
 * Initializes all members of this class.
 */
JABS_Cooldown.prototype.initMembers = function()
{
  /**
   * The frames of the cooldown.
   * @type {number}
   */
  this.frames = 0;

  /**
   * Whether or not the base cooldown is ready.
   * @type {boolean}
   */
  this.ready = false;

  /**
   * The number of frames in which the combo action can be executed instead.
   * @type {number}
   */
  this.comboFrames = 0;

  /**
   * Whether or not the combo cooldown is ready.
   * @type {boolean}
   */
  this.comboReady = false;

  /**
   * Whether or not this cooldown is locked from changing.
   * @type {boolean}
   */
  this.locked = false;

  /**
   * Whether or not the skill manager needs to clear the combo data for the
   * slot that this cooldown is attached to.
   * @type {boolean}
   */
  this.mustComboClear = false;
};

/**
 * Re-initializes all the data of this cooldown.
 */
JABS_Cooldown.prototype.clearData = function()
{
  // default all the values.
  this.frames = 0;
  this.ready = false;
  this.comboFrames = 0;
  this.comboReady = false;
  this.locked = false;
  this.mustComboClear = false;
};
//endregion initialize

/**
 * Whether or not the combo data needs clearing.
 * @returns {boolean}
 */
JABS_Cooldown.prototype.needsComboClear = function()
{
  return this.mustComboClear;
};

/**
 * Acknowledges the combo was cleared and sets the flag to false.
 */
JABS_Cooldown.prototype.acknowledgeComboClear = function()
{
  this.mustComboClear = false;
};

/**
 * Requests the combo to be cleared and sets the flag to true.
 */
JABS_Cooldown.prototype.requestComboClear = function()
{
  this.mustComboClear = true;
};

/**
 * Manages the update cycle for this cooldown.
 */
JABS_Cooldown.prototype.update = function()
{
  // check if we can update the cooldowns at all.
  if (!this.canUpdate()) return;

  // update the cooldowns.
  this.updateCooldownData();
};

/**
 * Determines whether or not this cooldown can be updated.
 * @returns {boolean} True if it can be updated, false otherwise.
 */
JABS_Cooldown.prototype.canUpdate = function()
{
  // cannot update a cooldown when it is locked.
  if (this.isLocked()) return false;

  // update the cooldown!
  return true;
};

/**
 * Updates the base and combo cooldowns.
 */
JABS_Cooldown.prototype.updateCooldownData = function()
{
  // update the base cooldown.
  this.updateBaseCooldown();

  // update the combo cooldown.
  this.updateComboCooldown();
};

//region base cooldown
/**
 * Updates the base skill data for this cooldown.
 */
JABS_Cooldown.prototype.updateBaseCooldown = function()
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
};

/**
 * Enables the flag to indicate the base skill is ready for this cooldown.
 * This also clears the combo data, as they both cannot be available at the same time.
 */
JABS_Cooldown.prototype.enableBase = function()
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
JABS_Cooldown.prototype.isBaseReady = function()
{
  return this.ready;
};

/**
 * Sets a new value for the base cooldown to countdown from.
 * @param {number} frames The value to countdown from.
 */
JABS_Cooldown.prototype.setFrames = function(frames)
{
  // set the value.
  this.frames = frames;

  // check if the base cooldown is now ready.
  this.handleIfBaseReady();

  // check if the base cooldown is now not ready.
  this.handleIfBaseUnready();
};

/**
 * Adds a value to the combo frames to extend the combo countdown.
 * @param {number} frames The value to add to the countdown.
 */
JABS_Cooldown.prototype.modBaseFrames = function(frames)
{
  // modify the value.
  this.frames += frames;

  // check if the base cooldown is now ready.
  this.handleIfBaseReady();

  // check if the base cooldown is now not ready.
  this.handleIfBaseUnready();
};

/**
 * Checks if the base cooldown is in a state of ready.
 * If it is, the ready flag will be enabled.
 */
JABS_Cooldown.prototype.handleIfBaseReady = function()
{
  // check if the base cooldown is now ready.
  if (this.frames <= 0)
  {
    // clear the combo data.
    this.resetCombo();

    // enable the base skill.
    this.enableBase();
  }
};

/**
 * Checks if the base cooldown is in a state of unready.
 * If it is, the ready flag will be disabled.
 */
JABS_Cooldown.prototype.handleIfBaseUnready = function()
{
  // check if the base cooldown is now not ready.
  if (this.frames > 0)
  {
    // not ready.
    this.ready = false;
  }
};
//endregion base cooldown

//region combo cooldown
/**
 * Updates the combo data for this cooldown.
 */
JABS_Cooldown.prototype.updateComboCooldown = function()
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
};

/**
 * Enables the flag to indicate a combo is ready for this cooldown.
 */
JABS_Cooldown.prototype.enableCombo = function()
{
  // action ready!
  // zero the wait time for combo frames.
  this.comboFrames = 0;

  // enable the combo!
  this.comboReady = true;
};

/**
 * Sets the combo frames to countdown from this value.
 * @param {number} frames The value to countdown from.
 */
JABS_Cooldown.prototype.setComboFrames = function(frames)
{
  // set the value.
  this.comboFrames = frames;

  // handle if the base cooldown is now ready.
  this.handleIfComboReady();

  // handle if the base cooldown is now not ready.
  this.handleIfComboUnready();
};

/**
 * Adds a value to the combo frames to extend the combo countdown.
 * @param {number} frames The value to add to the countdown.
 */
JABS_Cooldown.prototype.modComboFrames = function(frames)
{
  // modify the value.
  this.comboFrames += frames;

  // handle if the base cooldown is now ready.
  this.handleIfComboReady();

  // handle if the base cooldown is now not ready.
  this.handleIfComboUnready();
};

/**
 * Checks if the combo cooldown is in a state of ready.
 * If it is, the ready flag will be enabled.
 */
JABS_Cooldown.prototype.handleIfComboReady = function()
{
  // check if the base cooldown is now ready.
  if (this.comboFrames <= 0)
  {
    // enable the combo!
    this.enableCombo();
  }
};

/**
 * Checks if the combo cooldown is in a state of unready.
 * If it is, the ready flag will be disabled.
 */
JABS_Cooldown.prototype.handleIfComboUnready = function()
{
  // check if the combo cooldown is now not ready.
  if (this.comboFrames > 0)
  {
    // not ready.
    this.comboReady = false;
  }
};

/**
 * Resets the combo data associated with this cooldown.
 */
JABS_Cooldown.prototype.resetCombo = function()
{
  // zero the combo frames.
  this.comboFrames = 0;

  // disable the ready flag.
  this.comboReady = false;

  // requests the slot containing this cooldown to clear the combo id.
  this.requestComboClear();
};

/**
 * Gets whether or not the combo cooldown is ready.
 * @returns {boolean}
 */
JABS_Cooldown.prototype.isComboReady = function()
{
  return this.comboReady;
};
//endregion combo cooldown

//region locking
/**
 * Gets whether or not this cooldown is locked.
 * @returns {boolean}
 */
JABS_Cooldown.prototype.isLocked = function()
{
  return this.locked;
};

/**
 * Locks this cooldown to prevent it from cooling down.
 */
JABS_Cooldown.prototype.lock = function()
{
  this.locked = true;
};

/**
 * Unlocks this cooldown to allow it to finish cooling down.
 */
JABS_Cooldown.prototype.unlock = function()
{
  this.locked = false;
};
//endregion locking
//endregion JABS_Cooldown