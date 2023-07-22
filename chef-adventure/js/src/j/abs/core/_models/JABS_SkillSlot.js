//region JABS_SkillSlot
/**
 * This class represents a single skill slot handled by the skill slot manager.
 */
function JABS_SkillSlot()
{
  this.initialize(...arguments);
}

JABS_SkillSlot.prototype = {};
JABS_SkillSlot.prototype.constructor = JABS_SkillSlot;

/**
 * Initializes this class. Executed when this class is instantiated.
 */
JABS_SkillSlot.prototype.initialize = function(key, skillId)
{
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

  // initialize the rest of the members.
  this.initMembers();
};

/**
 * Initializes all properties on this class.
 */
JABS_SkillSlot.prototype.initMembers = function()
{
  /**
   * The combo id that comes after the current id; default is 0.
   * @type {number}
   */
  this.comboId = 0;

  /**
   * The cooldown associated with this slot.
   * @type {JABS_Cooldown}
   */
  this.cooldown = new JABS_Cooldown(this.key);

  /**
   * Whether or not this skill slot is locked.
   *
   * Locked slots cannot be changed until unlocked.
   * @type {boolean}
   */
  this.locked = false;

  // initialize the refreshes.
  this.initVisualRefreshes();
};

//region refreshes
/**
 * Initializes the various visual refreshes.
 */
JABS_SkillSlot.prototype.initVisualRefreshes = function()
{
  /**
   * Whether or not this skill slot's name needs refreshing.
   * @type {boolean}
   */
  this.needsNameRefresh = true;

  /**
   * Whether or not this skill slot's item cost needs refreshing.
   * @type {boolean}
   */
  this.needsItemCostRefresh = true;

  /**
   * Whether or not this skill slot's hp cost needs refreshing.
   * @type {boolean}
   */
  this.needsHpCostRefresh = true;

  /**
   * Whether or not this skill slot's mp cost needs refreshing.
   * @type {boolean}
   */
  this.needsMpCostRefresh = true;


  /**
   * Whether or not this skill slot's tp cost needs refreshing.
   * @type {boolean}
   */
  this.needsTpCostRefresh = true;


  /**
   * Whether or not this skill slot's icon needs refreshing.
   * @type {boolean}
   */
  this.needsIconRefresh = true;
};

/**
 * Flags this skillslot to need a visual refresh for the HUD.
 */
JABS_SkillSlot.prototype.flagSkillSlotForRefresh = function()
{
  this.needsNameRefresh = true;
  this.needsHpCostRefresh = true;
  this.needsMpCostRefresh = true;
  this.needsTpCostRefresh = true;
  this.needsItemCostRefresh = true;
  this.needsIconRefresh = true;
};

/**
 * Checks whether or not this skillslot's name is in need of a visual refresh.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.needsVisualNameRefresh = function()
{
  return this.needsNameRefresh;
};

/**
 * Acknowledges that this skillslot's name was visually refreshed.
 */
JABS_SkillSlot.prototype.acknowledgeNameRefresh = function()
{
  this.needsNameRefresh = false;
};

/**
 * Checks whether or not this skillslot's item cost is in need of a visual refresh by type.
 * @param {Sprite_SkillCost.Types} costType
 * @returns {boolean} True if the given type
 */
JABS_SkillSlot.prototype.needsVisualCostRefreshByType = function(costType)
{
  switch (costType)
  {
    case (Sprite_SkillCost.Types.HP):
      return this.needsHpCostRefresh;
    case (Sprite_SkillCost.Types.MP):
      return this.needsMpCostRefresh;
    case (Sprite_SkillCost.Types.TP):
      return this.needsTpCostRefresh;
    case (Sprite_SkillCost.Types.Item):
      return this.needsItemCostRefresh;
  }

  console.warn(`attempted to request a refresh of type: ${costType}, but it isn't implemented.`);
  return false;
};

/**
 * Acknowledges that this skillslot's item cost was visually refreshed.
 */
JABS_SkillSlot.prototype.acknowledgeCostRefreshByType = function(costType)
{
  switch (costType)
  {
    case (Sprite_SkillCost.Types.HP):
      this.needsHpCostRefresh = false;
      break;
    case (Sprite_SkillCost.Types.MP):
      this.needsMpCostRefresh = false;
      break;
    case (Sprite_SkillCost.Types.TP):
      this.needsTpCostRefresh = false;
      break;
    case (Sprite_SkillCost.Types.Item):
      this.needsItemCostRefresh = false;
      break;
    default:
      console.warn(`attempted to acknowledge a refresh of type: ${costType}, but it isn't implemented.`);
      break;
  }
};

/**
 * Checks whether or not this skillslot's icon is in need of a visual refresh.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.needsVisualIconRefresh = function()
{
  return this.needsIconRefresh;
};

/**
 * Acknowledges that this skillslot's icon was visually refreshed.
 */
JABS_SkillSlot.prototype.acknowledgeIconRefresh = function()
{
  this.needsIconRefresh = false;
};
//endregion refreshes

/**
 * Gets the cooldown associated with this skill slot.
 * @returns {JABS_Cooldown}
 */
JABS_SkillSlot.prototype.getCooldown = function()
{
  return this.cooldown;
};

/**
 * Updates the cooldown for this skill slot.
 */
JABS_SkillSlot.prototype.updateCooldown = function()
{
  // update the cooldown.
  this.getCooldown().update();

  // handle the need to clear the combo id from this slot.
  this.handleComboReadiness();
};

/**
 * Determines readiness for combos based on cooldowns.
 */
JABS_SkillSlot.prototype.handleComboReadiness = function()
{
  // grab this slot's cooldown.
  const cooldown = this.getCooldown();

  // check if we need to clear the combo id.
  if (cooldown.needsComboClear())
  {
    // otherwise, reset the combo id for this slot.
    this.resetCombo();

    // let the cooldown know we did the deed.
    cooldown.acknowledgeComboClear();
  }
};

/**
 * An event hook fired when this skill slot changes in some way.
 */
JABS_SkillSlot.prototype.onChange = function()
{
  // flags the slot for visual refresh.
  this.flagSkillSlotForRefresh();
};

/**
 * Resets the combo id for this slot.
 */
JABS_SkillSlot.prototype.resetCombo = function()
{
  // reset the combo id to 0, forcing use of the main id.
  this.setComboId(0);

  // perform the on-change event hook.
  this.onChange();
};

/**
 * Gets the next combo skill id for this skill slot.
 * @returns {number}
 */
JABS_SkillSlot.prototype.getComboId = function()
{
  return this.comboId;
};

/**
 * Sets the next combo skill id for this skill slot.
 * @param {number} skillId The new skill id that is next in the combo.
 * @returns {this} Returns `this` for fluent chaining.
 */
JABS_SkillSlot.prototype.setComboId = function(skillId)
{
  // initialize change to false.
  let changed = false;

  // check if the combo id is being changed.
  if (skillId !== this.comboId)
  {
    // it was changed.
    changed = true;
  }

  // update the combo id.
  this.comboId = skillId;

  // check if the slot had a change.
  if (changed)
  {
    // perform the on-change event hook.
    this.onChange();
  }

  // return this for fluent-chaining.
  return this;
};

/**
 * Gets whether or not this slot has anything assigned to it.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isUsable = function()
{
  return this.id > 0;
};

/**
 * Gets whether or not this slot is empty.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isEmpty = function()
{
  return this.id === 0;
};

/**
 * Gets whether or not this slot belongs to the tool slot.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isItem = function()
{
  return this.key === JABS_Button.Tool;
};

/**
 * Gets whether or not this slot belongs to a skill slot.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isSkill = function()
{
  return this.key !== JABS_Button.Tool;
};

/**
 * Checks whether or not this is a "primary" slot making up the base functions
 * that this actor can perform on the field.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isPrimarySlot = function()
{
  const slots = [
    JABS_Button.Mainhand,
    JABS_Button.Offhand,
    JABS_Button.Tool,
    JABS_Button.Dodge
  ];

  return slots.includes(this.key);
};

/**
 * Checks whether or not this is a "secondary" slot making up the optional and
 * flexible functions this actor can perform on the field.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isSecondarySlot = function()
{
  const slots = [
    JABS_Button.CombatSkill1,
    JABS_Button.CombatSkill2,
    JABS_Button.CombatSkill3,
    JABS_Button.CombatSkill4,
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
JABS_SkillSlot.prototype.setSkillId = function(skillId)
{
  if (this.isLocked())
  {
    console.warn("This slot is currently locked.");
    SoundManager.playBuzzer();
    return this;
  }

  // assign the new skill id.
  this.id = skillId;

  // no change check, always perform the on-change event hook.
  this.onChange();

  // return this for fluent-chaining.
  return this;
};

/**
 * Sets whether or not this slot is locked.
 * @param {boolean} locked Whether or not this slot is locked.
 * @returns {this} Returns `this` for fluent chaining.
 */
JABS_SkillSlot.prototype.setLock = function(locked)
{
  if (!this.canBeLocked())
  {
    this.locked = locked;
  }

  return this;
};

/**
 * Gets whether or not this slot can be locked.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.canBeLocked = function()
{
  const lockproofSlots = [
    JABS_Button.Mainhand,
    JABS_Button.Offhand
  ];

  return !lockproofSlots.includes(this.key);
};

/**
 * Locks this slot, preventing changing of skill assignment.
 * @returns {this} Returns `this` for fluent chaining.
 */
JABS_SkillSlot.prototype.lock = function()
{
  this.setLock(true);
  return this;
};

/**
 * Unlocks this slot.
 * @returns {this} Returns `this` for fluent chaining.
 */
JABS_SkillSlot.prototype.unlock = function()
{
  this.setLock(false);
  return this;
};

/**
 * Gets whether or not this slot is locked.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.isLocked = function()
{
  return this.locked;
};

/**
 * Gets the underlying data for this slot.
 * Supports retrieving combo skills via targetId.
 * Supports skill extended data via J-SkillExtend.
 * @param {Game_Actor|null} user The user to get extended skill data for.
 * @param {number|null} targetId The target id to get skill data for.
 * @returns {RPG_UsableItem|RPG_Skill|null}
 */
JABS_SkillSlot.prototype.data = function(user = null, targetId = this.id)
{
  // if there is no target, then return null.
  if (targetId === null) return null;

  // if this slot is empty, then return null.
  if (this.isEmpty()) return null;

  // check if this slot is an item.
  if (this.isItem())
  {
    // return the corresponding item.
    return $dataItems[targetId];
  }

  // check if we're using the skill extension plugin and have a user.
  if (user)
  {
    // grab the combo id in this slot.
    const comboId = this.getComboId();

    // check first if we have a valid combo id.
    if (comboId)
    {
      // nice find! return the combo id version of the skill instead.
      return user.skill(comboId);
    }

    // otherwise, return the target id.
    return user.skill(targetId);
  }

  // all else fails... just return the database data for the skill.
  return $dataSkills[targetId];
};

/**
 * Returns this slot to skill id 0 and unlocks it.
 * @returns {this} Returns `this` for fluent chaining.
 */
JABS_SkillSlot.prototype.clear = function()
{
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
JABS_SkillSlot.prototype.autoclear = function()
{
  if (!this.canBeAutocleared())
  {
    // skip because you can't autoclear these slots.
    return this;
  }

  return this.setSkillId(0);
};

/**
 * Gets whether or not this slot can be autocleared, such as from auto-upgrading
 * a skill or something.
 * @returns {boolean}
 */
JABS_SkillSlot.prototype.canBeAutocleared = function()
{
  const noAutoclearSlots = [
    JABS_Button.Tool
  ];

  return !noAutoclearSlots.includes(this.key);
};
//endregion JABS_SkillSlot