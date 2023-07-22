//region JABS_SkillSlotManager
/**
 * A class responsible for managing the skill slots on an actor.
 */
function JABS_SkillSlotManager()
{
  this.initialize(...arguments);
}

JABS_SkillSlotManager.prototype = {};
JABS_SkillSlotManager.prototype.constructor = JABS_SkillSlotManager;

/**
 * Initializes this class. Executed when this class is instantiated.
 */
JABS_SkillSlotManager.prototype.initialize = function()
{
  // setup the properties of this class.
  this.initMembers();
};

/**
 * Initializes all properties on this class.
 */
JABS_SkillSlotManager.prototype.initMembers = function()
{
  /**
   * All skill slots that a battler possesses.
   *
   * These are in a fixed order.
   * @type {JABS_SkillSlot[]}
   */
  this._slots = [];

  /**
   * A single flip that gets toggled when this class no longer requires a setup.
   * @type {boolean}
   * @private
   */
  this._setupComplete = false;
};

/**
 * Gets whether or not this skill slot manager has been setup yet.
 * @returns {boolean}
 */
JABS_SkillSlotManager.prototype.isSetupComplete = function()
{
  return this._setupComplete;
};

/**
 * Finalizes the initialization of this skill slot manager.
 */
JABS_SkillSlotManager.prototype.completeSetup = function()
{
  // flag it as setup.
  this._setupComplete = true;
};

/**
 * Sets up the slots for the given battler.
 * @param {Game_Actor|Game_Enemy} battler The battler to setup slots for.
 */
JABS_SkillSlotManager.prototype.setupSlots = function(battler)
{
  // actors only get one setup!
  if (this.isSetupComplete() && battler.isActor()) return;

  // initialize the slots.
  this.initializeBattlerSlots();

  // either actor or enemy, no in between!
  switch (true)
  {
    case (battler.isActor()):
      this.setupActorSlots();
      break;
    case (battler.isEnemy()):
      this.setupEnemySlots(battler);
      break;
  }

  // flag the setup as complete.
  this.completeSetup();
};

/**
 * Gets all skill slots, regardless of whether or not their are assigned.
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getAllSlots = function()
{
  return this._slots;
};


JABS_SkillSlotManager.prototype.initializeBattlerSlots = function()
{
  // initialize the slots.
  this._slots = [];
};

/**
 * Setup the slots for an actor.
 * All actors have the same set of slots.
 */
JABS_SkillSlotManager.prototype.setupActorSlots = function()
{
  this._slots.push(new JABS_SkillSlot(JABS_Button.Mainhand, 0));
  this._slots.push(new JABS_SkillSlot(JABS_Button.Offhand, 0));
  this._slots.push(new JABS_SkillSlot(JABS_Button.Tool, 0));
  this._slots.push(new JABS_SkillSlot(JABS_Button.Dodge, 0));

  this._slots.push(new JABS_SkillSlot(JABS_Button.CombatSkill1, 0));
  this._slots.push(new JABS_SkillSlot(JABS_Button.CombatSkill2, 0));
  this._slots.push(new JABS_SkillSlot(JABS_Button.CombatSkill3, 0));
  this._slots.push(new JABS_SkillSlot(JABS_Button.CombatSkill4, 0));
};

/**
 * Setup slots for an enemy.
 * Each enemy can have varying slots.
 * @param {Game_Enemy} enemy The enemy to setup slots for.
 */
JABS_SkillSlotManager.prototype.setupEnemySlots = function(enemy)
{
  const battlerData = enemy.databaseData();
  if (!battlerData)
  {
    console.warn('missing battler data.', enemy);
    return;
  }

  // filter out any "extend" skills as far as this collection is concerned.
  const filtering = action =>
  {
    // grab the skill from the database.
    const skill = enemy.skill(action.skillId);

    // determine if the skill is an extend skill or not.
    const isExtendSkill = skill.metadata('skillExtend');

    // filter out the extend skills.
    return !isExtendSkill;
  };

  // filter the skills.
  const skillIds = battlerData.actions
    .filter(filtering)
    .map(action => action.skillId);

  // grab the basic attack skill id as well.
  const basicAttackSkillId = enemy.basicAttackSkillId();

  // check to make sure we found one.
  if (basicAttackSkillId)
  {
    // add it to the list if we did.
    skillIds.push(basicAttackSkillId);
  }

  // iterate over each skill.
  skillIds.forEach(skillId =>
  {
    // grab the skill itself.
    const skill = enemy.skill(skillId);

    // calculate the cooldown key.
    const slotKey = JABS_AiManager.buildEnemyCooldownType(skill);

    // add the slot to the manager for this enemy.
    this.addSlot(slotKey, skillId);
  }, this);
};

/**
 * Flags all skillslots for needing visual refresh for the input frame.
 */
JABS_SkillSlotManager.prototype.flagAllSkillSlotsForRefresh = function()
{
  this._slots.forEach(slot => slot.flagSkillSlotForRefresh());
};

/**
 * Adds a slot with the given slot key and skill id.
 * If a slot with the same key already exists, no action will be taken.
 * @param {string} key The slot key.
 * @param {number} initialSkillId The skill id to set to this slot.
 */
JABS_SkillSlotManager.prototype.addSlot = function(key, initialSkillId)
{
  // check if the slot key already exists on the manager.
  const exists = this._slots.find(slot => slot.key === key);

  // if it exists, then don't re-add this slot.
  if (exists) return;

  // add the slot with the designated key and skill id.
  this._slots.push(new JABS_SkillSlot(key, initialSkillId));
};

/**
 * Gets all skill slots identified as "primary".
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getAllPrimarySlots = function()
{
  return this.getAllSlots()
    .filter(slot => slot.isPrimarySlot());
};

/**
 * Gets all skill slots identified as "secondary".
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getAllSecondarySlots = function()
{
  return this.getAllSlots()
    .filter(slot => slot.isSecondarySlot());
};

/**
 * Gets the skill dedicated to the tool slot.
 * @returns {JABS_SkillSlot}
 */
JABS_SkillSlotManager.prototype.getToolSlot = function()
{
  return this.getSkillSlotByKey(JABS_Button.Tool);
};

/**
 * Gets the skill dedicated to the dodge slot.
 * @returns {JABS_SkillSlot}
 */
JABS_SkillSlotManager.prototype.getDodgeSlot = function()
{
  return this.getSkillSlotByKey(JABS_Button.Dodge);
};

/**
 * Gets all skill slots that have a skill assigned.
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getEquippedSlots = function()
{
  return this.getAllSlots().filter(skillSlot => skillSlot.isUsable());
};

/**
 * Gets all secondary skill slots that are unassigned.
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getEmptySecondarySlots = function()
{
  return this.getAllSecondarySlots().filter(skillSlot => skillSlot.isEmpty());
};

/**
 * Gets a skill slot by its key.
 * @param {string} key The key to find the matching slot for.
 * @returns {JABS_SkillSlot}
 */
JABS_SkillSlotManager.prototype.getSkillSlotByKey = function(key)
{
  return this.getAllSlots()
    .find(skillSlot => skillSlot.key === key);
};

/**
 * Gets the entire skill slot of the slot containing the skill id.
 * @param {number} skillIdToFind The skill id to find.
 * @returns {JABS_SkillSlot}
 */
JABS_SkillSlotManager.prototype.getSlotBySkillId = function(skillIdToFind)
{
  // check if the skill to find is the base skill of a slot.
  let foundSlot = this.getEquippedSlots()
    .find(skillSlot => skillSlot.id === skillIdToFind);

  // validate we found a slot for the skill.
  if (!foundSlot)
  {
    // check if the skill id is actually the combo skill of one of the slots.
    foundSlot = this.getEquippedSlots()
      .find(skillSlot => skillSlot.comboId === skillIdToFind);
  }

  // return the found slot.
  return foundSlot;
};

/**
 * Sets a new skill to a designated slot.
 * @param {string} key The key of the slot to set.
 * @param {number} skillId The id of the skill to assign to the slot.
 * @param {boolean} locked Whether or not the slot should be locked.
 */
JABS_SkillSlotManager.prototype.setSlot = function(key, skillId, locked)
{
  this.getSkillSlotByKey(key)
    .setSkillId(skillId)
    .setLock(locked);
};

/**
 * Gets the combo id of the given skill slot.
 * @param {string} key The skill slot key.
 * @returns {number}
 */
JABS_SkillSlotManager.prototype.getSlotComboId = function(key)
{
  return this.getSkillSlotByKey(key)
    .getComboId();
};

/**
 * Sets the combo id of the given skill slot.
 * @param {string} key The new skill slot key.
 * @param {number} comboId The new combo skill id.
 */
JABS_SkillSlotManager.prototype.setSlotComboId = function(key, comboId)
{
  // shorthand the skill slot.
  const skillSlot = this.getSkillSlotByKey(key);

  // set the new combo id.
  skillSlot.setComboId(comboId);

  // flag for refresh.
  skillSlot.flagSkillSlotForRefresh();
};

/**
 * Updates the cooldowns of all slots with a skill in them.
 */
JABS_SkillSlotManager.prototype.updateCooldowns = function()
{
  // this.getAllSlots() // use this if slots should update when there is no skill in them.
  this.getEquippedSlots()
    .forEach(slot => slot.updateCooldown());
};

/**
 * Determines if either cooldown is available for the given slot.
 * @param {string} key The slot.
 * @returns {boolean} True if one of the cooldowns is ready, false if both are not.
 */
JABS_SkillSlotManager.prototype.isAnyCooldownReadyForSlot = function(key)
{
  // shorthand the slot.
  const slot = this.getSkillSlotByKey(key);

  // shorthand the cooldown.
  const cooldown = slot.getCooldown();

  // whether or not the slot has a combo id available to it.
  const hasComboId = (slot.getComboId() !== 0);

  // check if the combo cooldown is flagged as ready.
  const comboCooldownReady = cooldown.isComboReady();

  // if we have both a combo id and a ready, we can use a combo.
  const isComboReady = hasComboId && comboCooldownReady;

  // if the base cooldown is ready, thats it- its ready.
  const isBaseReady = cooldown.isBaseReady();

  // whether or not either type of cooldown is available.
  const isAnyReady = (isComboReady || isBaseReady);

  // return our result.
  return isAnyReady;
};

/**
 * Clears and unlocks a skill slot by its key.
 * @param {string} key The key of the slot to clear.
 */
JABS_SkillSlotManager.prototype.clearSlot = function(key)
{
  this.getSkillSlotByKey(key).clear();
};

/**
 * Unlocks all slots owned by this actor.
 */
JABS_SkillSlotManager.prototype.unlockAllSlots = function()
{
  this.getAllSlots().forEach(slot => slot.unlock());
};
//endregion JABS_SkillSlotManager