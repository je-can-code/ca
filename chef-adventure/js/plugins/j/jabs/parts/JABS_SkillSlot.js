/*:
 * @target MZ
 * @plugindesc 
 * [v3.0 JABS] Data structure of a equipped skill for JABS.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-ABS
 * @help
 * ============================================================================
 * A component of JABS.
 * This class contains the data associated with a skill that is equipped.
 * 
 * Plugin Developer Notes:
 * The equipped skill is separate from a cooldown, though they are related.
 * ============================================================================
 */

/**
 * This class represents a single skill slot handled by the skill slot manager.
 */
function JABS_SkillSlot() { this.initialize(...arguments); }
JABS_SkillSlot.prototype = {};
JABS_SkillSlot.prototype.constructor = JABS_SkillSlot;

/**
 * Initializes this class. Executed when this class is instantiated.
 */
 JABS_SkillSlot.prototype.initialize = function(key, skillId) {
  /**
   * The key of this skill slot.
   * 
   * Maps 1:1 to one of the possible skill slot button combinations.
   * @type {string}
   */
  this.key = key;

  /**
   * The id of the skill.
   * 
   * Set to 0 when a skill is not equipped in this slot.
   * @type {number}
   */
  this.id = skillId;
  this.initMembers();
};

/**
 * Initializes all properties on this class.
 */
JABS_SkillSlot.prototype.initMembers = function() {
  /**
   * Whether or not this skill slot is locked.
   * 
   * Locked slots cannot be changed until unlocked.
   * @type {boolean}
   */
  this.locked = false;
};

/**
 * Gets whether or not this slot has anythign assigned to it.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isUsable = function() {
  return this.id > 0;
};

/**
 * Gets whether or not this slot is locked.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isLocked = function() {
  return this.locked;
};

/**
 * Checks whether or not this is a "primary" slot making up the base functions
 * that this actor can perform on the field.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isPrimarySlot = function() {
  const slots = [
    Game_Actor.JABS_MAINHAND,
    Game_Actor.JABS_OFFHAND,
    Game_Actor.JABS_TOOLSKILL,
    Game_Actor.JABS_DODGESKILL
  ];

  return slots.includes(this.key);
};

/**
 * Checks whether or not this is a "secondary" slot making up the optional and
 * flexible functions this actor can perform on the field.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isSecondarySlot = function() {
  const slots = [
    Game_Actor.JABS_L1_A_SKILL,
    Game_Actor.JABS_L1_B_SKILL,
    Game_Actor.JABS_L1_X_SKILL,
    Game_Actor.JABS_L1_Y_SKILL,
    Game_Actor.JABS_R1_A_SKILL,
    Game_Actor.JABS_R1_B_SKILL,
    Game_Actor.JABS_R1_X_SKILL,
    Game_Actor.JABS_R1_Y_SKILL
  ];

  return slots.includes(this.key);
};

/**
 * Sets a new skill id to this slot.
 * 
 * Slot cannot be assigned if it is locked.
 * @param {number} skillId The new skill id to assign to this slot.
 * @returns {this} Returns `this` for fluent chaining.
 */
JABS_SkillSlot.prototype.setSkillId = function(skillId) {
  if (this.isLocked()) {
    console.warn("This slot is currently locked.");
    SoundManager.playBuzzer();
    return;
  }

  this.id = skillId;
  return this;
};

/**
 * Sets whether or not this slot is locked.
 * @param {boolean} locked Whether or not this slot is locked.
 * @returns {this} Returns `this` for fluent chaining.
 */
JABS_SkillSlot.prototype.setLock = function(locked) {
  if (!this.canBeLocked()) {
    this.locked = locked;
  }

  return this;
};

/**
 * Gets whether or not this slot can be locked.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.canBeLocked = function() {
  const lockproofSlots = [
    Game_Actor.JABS_MAINHAND,
    Game_Actor.JABS_OFFHAND
  ];

  return !lockproofSlots.includes(this.key);
};

/**
 * Locks this slot, preventing changing of skill assignment.
 * @returns {this} Returns `this` for fluent chaining.
 */
JABS_SkillSlot.prototype.lock = function() {
  this.setLock(true);
  return this;
};

/**
 * Unlocks this slot.
 * @returns {this} Returns `this` for fluent chaining.
 */
JABS_SkillSlot.prototype.unlock = function() {
  this.setLock(false);
  return this;
};

/**
 * Returns this slot to skill id 0 and unlocks it.
 * @returns {this} Returns `this` for fluent chaining.
 */
JABS_SkillSlot.prototype.clear = function() {
  this.unlock();
  this.setSkillId(0);
  return this;
};

/**
 * Clears this slot in the context of "releasing unequippable skills".
 * Skills that are mainhand/offhand/tool will not be automatically removed.
 * Skills that are locked will not be automatically removed.
 * @returns {this} Returns `this` for fluent chaining.
 */
JABS_SkillSlot.prototype.autoclear = function() {
  if (!this.canBeAutocleared()) {
    // skip because you can't autoclear these slots.
    return this;
  } else {
    return this.setSkillId(0);
  }
};

/**
 * Gets whether or not this slot can be autocleared, such as from auto-upgrading
 * a skill or something.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.canBeAutocleared = function() {
  const noAutoclearSlots = [
    Game_Actor.JABS_MAINHAND,
    Game_Actor.JABS_OFFHAND,
    Game_Actor.JABS_TOOLSKILL
  ];

  return !noAutoclearSlots.includes(this.key);
};