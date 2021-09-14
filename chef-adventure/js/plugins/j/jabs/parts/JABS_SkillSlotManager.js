/*:
 * @target MZ
 * @plugindesc 
 * [v3.0 JABS] Data structure of all equipped skills for a battler.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-ABS
 * @help
 * ============================================================================
 * A component of JABS.
 * This class contains the data associated with all skills currently equipped.
 * 
 * Plugin Developer Notes:
 * This was initially an ES5+ class, but had to be downgraded to accommodate
 * the oddity that is RMMZ's inability to consistently interpret these
 * types of objects and their properties/methods.
 * ============================================================================
 */

/**
 * A class responsible for managing the skill slots on an actor.
 */
function JABS_SkillSlotManager() { this.initialize(...arguments); }
JABS_SkillSlotManager.prototype = {};
JABS_SkillSlotManager.prototype.constructor = JABS_SkillSlotManager;

/**
 * Initializes this class. Executed when this class is instantiated.
 */
JABS_SkillSlotManager.prototype.initialize = function() {
  this.initMembers();
};

/**
 * Initializes all properties on this class.
 */
JABS_SkillSlotManager.prototype.initMembers = function() {
  /**
   * All skill slots that a player possesses.
   * 
   * These are in a fixed order.
   * @type {JABS_SkillSlot[]}
   */
  this._slots = [
    new JABS_SkillSlot("Global", 0),

    new JABS_SkillSlot(Game_Actor.JABS_MAINHAND, 0),
    new JABS_SkillSlot(Game_Actor.JABS_OFFHAND, 0),
    new JABS_SkillSlot(Game_Actor.JABS_TOOLSKILL, 0),
    new JABS_SkillSlot(Game_Actor.JABS_DODGESKILL, 0),

    new JABS_SkillSlot(Game_Actor.JABS_L1_A_SKILL, 0),
    new JABS_SkillSlot(Game_Actor.JABS_L1_B_SKILL, 0),
    new JABS_SkillSlot(Game_Actor.JABS_L1_X_SKILL, 0),
    new JABS_SkillSlot(Game_Actor.JABS_L1_Y_SKILL, 0),
    new JABS_SkillSlot(Game_Actor.JABS_R1_A_SKILL, 0),
    new JABS_SkillSlot(Game_Actor.JABS_R1_B_SKILL, 0),
    new JABS_SkillSlot(Game_Actor.JABS_R1_X_SKILL, 0),
    new JABS_SkillSlot(Game_Actor.JABS_R1_Y_SKILL, 0)
  ];
};

/**
 * Gets all skill slots, regardless of whether or not their are assigned.
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getAllSlots = function() {
  return this._slots;
};

/**
 * Gets all skill slots identified as "primary".
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getAllPrimarySlots = function() {
  return this.getAllSlots()
    .filter(slot => slot.isPrimarySlot());
};

/**
 * Gets all skill slots identified as "secondary".
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getAllSecondarySlots = function() {
  return this.getAllSlots()
    .filter(slot => slot.isSecondarySlot());
};

/**
 * Gets the skill dedicated to the tool slot.
 * @returns {JABS_SkillSlot}
 */
JABS_SkillSlotManager.prototype.getToolSlot = function() {
  return this.getSkillBySlot(Game_Actor.JABS_TOOLSKILL);
};

/**
 * Gets the skill dedicated to the dodge slot.
 * @returns {JABS_SkillSlot}
 */
JABS_SkillSlotManager.prototype.getDodgeSlot = function() {
  return this.getSkillBySlot(Game_Actor.JABS_DODGESKILL);
};

/**
 * Gets all skill slots that have a skill assigned.
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getEquippedSlots = function() {
  return this.getAllSlots().filter(skillSlot => skillSlot.isUsable());
};

/**
 * Gets all secondary skill slots that are unassigned.
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getEmptySecondarySlots = function() {
  return this.getAllSecondarySlots().filter(skillSlot => skillSlot.isEmpty());
};

/**
 * Gets all skill slots that have a skill assigned.
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getEquippedAllySlots = function() {
  return this.getEquippedSlots()
    .filter(skillSlot => skillSlot.key !== Game_Actor.JABS_TOOLSKILL);
};

/**
 * Gets a skill slot by its key.
 * @param {string} key The key to find the matching slot for.
 * @returns {JABS_SkillSlot}
 */
JABS_SkillSlotManager.prototype.getSkillBySlot = function(key) {
  return this.getAllSlots()
    .find(skillSlot => skillSlot.key === key);
};

/**
 * Gets the entire skill slot of the slot containing the skill id.
 * @param {number} skillIdToFind The skill id to find.
 * @returns {JABS_SkillSlot}
 */
JABS_SkillSlotManager.prototype.getSlotBySkillId = function(skillIdToFind) {
  return this.getEquippedSlots()
    .find(skillSlot => skillSlot.id === skillIdToFind);
};

/**
 * Sets a new skill to a designated slot.
 * @param {string} key The key of the slot to set.
 * @param {number} skillId The id of the skill to assign to the slot.
 * @param {boolean} locked Whether or not the slot should be locked.
 */
JABS_SkillSlotManager.prototype.setSlot = function(key, skillId, locked) {
  this.getSkillBySlot(key)
    .setSkillId(skillId)
    .setLock(locked);
};

/**
 * Clears and unlocks a skill slot by its key.
 * @param {string} key The key of the slot to clear.
 */
JABS_SkillSlotManager.prototype.clearSlot = function(key) {
  this.getSkillBySlot(key).clear();
};

/**
 * Unlocks all slots owned by this actor.
 */
JABS_SkillSlotManager.prototype.unlockAllSlots = function(key) {
  this.getAllSlots().forEach(slot => slot.unlock());
};