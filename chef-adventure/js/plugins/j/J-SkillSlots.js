//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 SKS] A plugin enabling actors to equip skills into dedicated skill slots.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin enables actors to equip skills into dedicated skill slots using
 * a point-budget system. Each actor has a pool of slot points; skills cost
 * points to equip, and only skills of the configured equippable types appear
 * in the equip scene.
 *
 * Integrates with others of mine plugins:
 * - J-Base; required by all my plugins.
 * - J-Passive; equipping a passive skill activates its perpetual state effect.
 *
 * ----------------------------------------------------------------------------
 * DETAILS
 * Each actor has a maximum number of slot points (maxSlotPoints). Skills that
 * belong to the configured equippable skill types can be placed into slots,
 * each consuming a number of slot points equal to their slot cost. The player
 * manages equipped skills through the SKS equip scene, accessible from the
 * menu when the configured menu switch is ON.
 *
 * Skills tagged as "unslotted" are perpetually active and never appear in the
 * equip scene. Skills whose type is not in the equippable list are also treated
 * as implicitly unslotted, meaning they remain freely available to whatever
 * other system manages them (such as JABS combat slot equipping).
 *
 * ============================================================================
 * SLOT COST
 * Want to control how many slot points a skill consumes? By applying the
 * appropriate tag to skills in the database, you can fine-tune the cost of
 * equipping each skill.
 *
 * TAG USAGE:
 * - Skills
 *
 * TAG FORMAT:
 *  <slotCost:AMOUNT>
 *    Where AMOUNT is the number of slot points this skill costs to equip.
 *
 * TAG EXAMPLES:
 *  <slotCost:2>
 * This skill costs 2 slot points to equip into a slot.
 *
 * ============================================================================
 * UNSLOTTED
 * Want a skill to always be active without occupying a slot? By applying the
 * appropriate tag to skills in the database, you can mark them as perpetually
 * active. These skills will not appear in the equip scene.
 *
 * TAG USAGE:
 * - Skills
 *
 * TAG FORMAT:
 *  <unslotted>
 *
 * TAG EXAMPLES:
 *  <unslotted>
 * This skill is always active and will never appear in the SKS equip scene.
 *
 * ============================================================================
 * SLOT COST MODIFIER
 * Want to adjust the slot cost of skills based on what an actor has equipped
 * or what states they are under? By applying the appropriate tag across the
 * various database locations, you can modify the effective slot cost of skills
 * for that actor.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Weapons
 * - Armor
 * - States
 *
 * TAG FORMAT:
 *  <slotCostModifier:AMOUNT>
 *    Where AMOUNT is the flat modifier applied to all skill slot costs.
 *    Negative values reduce the cost; positive values increase it.
 *
 * TAG EXAMPLES:
 *  <slotCostModifier:-1>
 * All skills cost 1 fewer slot point while this is active on the actor.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 *
 * @param parentConfig
 * @text SETUP
 *
 * @param menu-switch
 * @parent parentConfig
 * @type switch
 * @text Menu Switch ID
 * @desc When this switch is ON, the SKS command is visible in the menu.
 * @default 101
 *
 * @param equippable-skill-type-ids
 * @parent parentConfig
 * @type number[]
 * @text Equippable Skill Type IDs
 * @desc The skill type IDs whose skills are eligible for equipping into slots. Skills of all other types are implicitly unslotted.
 * @default []
 *
 *
 * @command mod-slot-points-party
 * @text Add/Remove Slot Points (Party)
 * @desc Adds or removes a designated number of slot points from all members of the current party.
 * @arg points
 * @type number
 * @min -99999999
 * @max 99999999
 * @desc The number of slot points to modify by. Negative values remove points. Cannot go below 0.
 * @default 1
 */
//endregion annotations


//region plugin metadata
class JSkillSlots_PluginMetadata
  extends PluginMetadata
{
  /**
   * Constructor.
   */
  constructor(name, version)
  {
    super(name, version);
  }

  /**
   *  Extends {@link #postInitialize}.<br>
   *  Includes translation of plugin parameters.
   */
  postInitialize()
  {
    // execute original logic.
    super.postInitialize();

    // initialize this plugin from configuration.
    this.initializeMetadata();
  }

  /**
   * Initializes the metadata associated with this plugin.
   */
  initializeMetadata()
  {
    /**
     * The id of a switch that represents whether or not this system is accessible in the menu.
     * @type {number}
     */
    this.menuSwitchId = parseInt(this.parsedPluginParameters['menu-switch']);

    /**
     * The skill type IDs whose skills are eligible for equipping into slots.
     * Skills of types not in this list are implicitly unslotted.
     * When empty, all skills are eligible regardless of type.
     * @type {number[]}
     */
    this.equippableSkillTypeIds = JSON.parse(this.parsedPluginParameters['equippable-skill-type-ids'] || '[]')
      .map(id => parseInt(id));

    /**
     * The default maximum number of skill slot points for an actor.
     * @type {number}
     */
    this.defaultMaxSkillSlotPoints = 4; // TODO: get from plugin parameters.

    /**
     * The default cost of a skill for a skill slot.
     * @type {number}
     */
    this.defaultSkillSlotCost = 1; // TODO: get from plugin parameters.
  }
}

//endregion plugin metadata

//region initialization
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.SKS = {};

/**
 * The plugin umbrella that governs all extensions related to the parent.
 */
J.SKS.EXT ||= {};

/**
 * The metadata associated with this plugin.
 */
J.SKS.Metadata = new JSkillSlots_PluginMetadata('J-SkillSlots', '1.0.0');

/**
 * A collection of all aliased methods for this plugin.
 */
J.SKS.Aliased = {};
J.SKS.Aliased.Game_Actor = new Map();

/**
 * All regular expressions used by this plugin.
 */
J.SKS.RegExp = {};
J.SKS.RegExp.SlotCost = /<slotCost:[ ]?(-?\d+)>/i;
J.SKS.RegExp.Unslotted = /<unslotted>/i;
J.SKS.RegExp.SlotCostModifier = /<slotCostModifier:[ ]?(-?\d+)>/i;
//endregion initialization

//region plugin commands
/**
 * Plugin command for modifying slot points for all current party members.
 */
PluginManager.registerCommand(
  J.SKS.Metadata.name,
  'mod-slot-points-party',
  args =>
  {
    // parse the number of slot points to modify from the command args.
    const parsedPoints = parseInt(args.points);

    // apply the modification to every current party member.
    $gameParty.members().forEach(member =>
    {
      // modify this member's maximum slot points by the parsed amount.
      member.modifyMaxSlotPoints(parsedPoints);
    });
  });
//endregion plugin commands


//region SkillEquipSlot
/**
 * Represents a single skill equipped in a slot for an actor.
 * Serialized into save data; uses a prototype constructor to remain JSON-safe.
 * @param {number} index - The index of the slot this entry occupies.
 * @param {number} skillId - The id of the skill equipped in this slot.
 */
function SkillEquipSlot(index, skillId)
{
  /**
   * The index of the slot this entry occupies.
   * @type {number}
   */
  this.index = index;

  /**
   * The id of the skill equipped in this slot.
   * @type {number}
   */
  this.skillId = skillId;
}
//endregion SkillEquipSlot


//region RPG_EquipItem
/**
 * The modifier to the slot cost of all equipped skills for the owner of this item.
 */
Object.defineProperty(RPG_EquipItem.prototype, 'slotCostModifier', {
  get: function()
  {
    return RPGManager.getNumberFromNoteByRegex(this, J.SKS.RegExp.SlotCostModifier);
  }
});
//endregion RPG_EquipItem


/**
 * The slot cost for this equip skill.
 */
Object.defineProperty(RPG_Skill.prototype, 'slotCost', {
  get: function()
  {
    return RPGManager.getNumberFromNoteByRegex(this, J.SKS.RegExp.SlotCost);
  }
});

/**
 * Whether this skill is perpetually active without needing to be assigned to a slot.
 * Unslotted skills do not appear in the SKS equip list.
 *
 * A skill is considered unslotted if any of the following are true:
 *  - It carries the explicit {@link J.SKS.RegExp.Unslotted} notetag.
 *  - Passive skill type IDs are configured and this skill's type is not among them.
 */
Object.defineProperty(RPG_Skill.prototype, 'unslotted', {
  get: function()
  {
    // check if this skill is explicitly tagged as unslotted.
    const isExplicitlyUnslotted = RPGManager.checkForBooleanFromNoteByRegex(this, J.SKS.RegExp.Unslotted);

    // if explicitly tagged, it is unslotted regardless of skill type.
    if (isExplicitlyUnslotted) return true;

    // retrieve the configured equippable skill type ids.
    const equippableTypeIds = J.SKS.Metadata.equippableSkillTypeIds;

    // if no types are configured, all skills are eligible for slots.
    if (equippableTypeIds.length === 0) return false;

    // skills whose type is not in the equippable list are implicitly unslotted.
    return equippableTypeIds.includes(this.stypeId) === false;
  }
});

//region RPG_State
/**
 * The modifier to global slot costs for skill equips.
 */
Object.defineProperty(RPG_State.prototype, 'slotCostModifier', {
  get: function()
  {
    return RPGManager.getNumberFromNoteByRegex(this, J.SKS.RegExp.SlotCostModifier);
  }
});
//endregion RPG_State

//region Game_Actor
//region init
/**
 * Extends {@link #initMembers}.<br/>
 * Also initializes the skill slots members.
 */
J.SKS.Aliased.Game_Actor.set('initMembers', Game_Actor.prototype.initMembers);
Game_Actor.prototype.initMembers = function()
{
  // perform original logic.
  J.SKS.Aliased.Game_Actor.get('initMembers')
    .call(this);

  // initialize skill slots members.
  this.initSkillSlotsMembers();
};

/**
 * Initializes all members associated with the skill slots system.
 */
Game_Actor.prototype.initSkillSlotsMembers = function()
{
  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with SKS.
   */
  this._j._sks = {};

  /**
   * The ordered array of equipped skill slots for this actor.
   * @type {SkillEquipSlot[]}
   */
  this._j._sks._slots = [];

  /**
   * A map of slot index to equipped skill id for fast lookups.
   * @type {Map<number, number>}
   */
  this._j._sks._slotMap = new Map();

  /**
   * The maximum number of slot points this actor can spend across all slots.
   * @type {number}
   */
  this._j._sks._maxSlotPoints = J.SKS.Metadata.defaultMaxSkillSlotPoints;
};
//endregion init

//region accessors
/**
 * Gets the ordered array of equipped skill slots for this actor.
 * @returns {SkillEquipSlot[]}
 */
Game_Actor.prototype.slots = function()
{
  return this._j._sks._slots;
};

/**
 * Gets the slot map for this actor.
 * @returns {Map<number, number>}
 */
Game_Actor.prototype.slotMap = function()
{
  return this._j._sks._slotMap;
};

/**
 * Clears all entries from the slot map.
 */
Game_Actor.prototype.clearSlotMap = function()
{
  // clear all entries from the map.
  this.slotMap()
    .clear();
};

/**
 * Gets the skill id currently assigned to a given slot index.
 * @param {number} slotIndex - The index of the slot to inspect.
 * @returns {number} - The skill id in the slot, or 0 if the slot is empty.
 */
Game_Actor.prototype.getSkillIdInSlot = function(slotIndex)
{
  // grab the id from the slot map.
  const id = this.slotMap()
    .get(slotIndex);

  // return the id, or 0 if the slot is empty.
  return id ?? 0;
};

/**
 * Gets the slot index where the given skill is currently equipped.
 * @param {number} skillId - The id of the skill to locate.
 * @returns {number} - The slot index where the skill is equipped, or -1 if not found.
 */
Game_Actor.prototype.getEquippedSkillIndex = function(skillId)
{
  // iterate over the slot map to find the matching skill.
  for (const [ slotIndex, slotSkillId ] of this.slotMap())
  {
    // if this slot contains the skill, return its index.
    if (slotSkillId === skillId) return slotIndex;
  }

  // the skill was not found in any slot.
  return -1;
};

/**
 * Gets the maximum number of slot points available to this actor.
 * @returns {number}
 */
Game_Actor.prototype.maxSlotPoints = function()
{
  return this._j._sks._maxSlotPoints;
};

/**
 * Sets the maximum number of slot points available to this actor.
 * @param {number} points - The new maximum slot points value.
 */
Game_Actor.prototype.setMaxSlotPoints = function(points)
{
  this._j._sks._maxSlotPoints = points;
};

/**
 * Modifies the maximum number of slot points for this actor by the given amount.
 * The result is clamped to a minimum of 0.
 * @param {number} amount - The amount to modify by. Negative values reduce the maximum.
 */
Game_Actor.prototype.modifyMaxSlotPoints = function(amount)
{
  // compute the new maximum after applying the modifier.
  const newMax = this.maxSlotPoints() + amount;

  // clamp to a minimum of 0 and assign.
  this.setMaxSlotPoints(Math.max(0, newMax));
};

/**
 * Gets the total number of slot points currently spent by this actor.
 * @returns {number}
 */
Game_Actor.prototype.spentSlotPoints = function()
{
  // start from zero.
  let points = 0;

  // iterate over all equipped slots and accumulate their costs.
  for (const [ , skillId ] of this.slotMap())
  {
    // add the slot cost of this skill to the running total.
    points += this.skill(skillId).slotCost;
  }

  // return the accumulated total.
  return points;
};

/**
 * Gets the number of slot points remaining after all equipped skills are accounted for.
 * @returns {number}
 */
Game_Actor.prototype.remainingSlotPoints = function()
{
  return this.maxSlotPoints() - this.spentSlotPoints();
};

/**
 * Whether or not this actor has enough slot points to cover the given cost.
 * @param {number} points - The number of points to check against.
 * @returns {boolean}
 */
Game_Actor.prototype.hasSufficientSlotPoints = function(points)
{
  // skills that cost nothing can always be equipped.
  if (points <= 0) return true;

  // if no points remain and a cost is required, the actor cannot equip.
  if (this.remainingSlotPoints() <= 0) return false;

  // confirm the total after adding this cost does not exceed the maximum.
  return (this.spentSlotPoints() + points) <= this.maxSlotPoints();
};

/**
 * Gets only the skills this actor currently has equipped in slots.
 * This is the filtered view intended for the JABS quick menu and CMS.
 * @returns {RPG_Skill[]}
 */
Game_Actor.prototype.equippedSkills = function()
{
  // gather all skills this actor has learned.
  const learned = this.skills();

  // build a set of equipped skill ids from the slot map for fast lookups.
  const equippedIds = new Set();

  // populate the set with every skill id currently in a slot.
  for (const [ , skillId ] of this.slotMap())
  {
    // add the skill id to the lookup set.
    equippedIds.add(skillId);
  }

  // filter the learned skills down to only those present in the equipped set.
  const equippedSkills = learned.filter(skill =>
  {
    // include only valid skills that are currently equipped in a slot.
    return skill && equippedIds.has(skill.id);
  });

  // return the filtered list.
  return equippedSkills;
};

//endregion accessors

//region slot management
/**
 * Assigns a skill to a slot entry, updating both the slots array and the slot map.
 * @param {number} index - The slot index to assign to.
 * @param {number} skillId - The id of the skill to assign.
 */
Game_Actor.prototype.assignSlot = function(index, skillId)
{
  // build the new slot entry.
  const skillEquipSlot = new SkillEquipSlot(index, skillId);

  // store the slot entry in the slots array.
  this.slots()[index] = skillEquipSlot;

  // mirror the assignment in the slot map for fast lookups.
  this.slotMap()
    .set(index, skillId);
};

/**
 * Removes the slot entry at the given index from both the slots array and the slot map.
 * @param {number} index - The slot index to remove.
 */
Game_Actor.prototype.deleteSlot = function(index)
{
  // remove the entry from the slots array.
  delete this.slots()[index];

  // remove the entry from the slot map.
  this.slotMap()
    .delete(index);
};

//endregion slot management

//region actions
/**
 * Equips a skill to a slot after validating that the actor can afford the cost.
 * @param {number} slotIndex - The index of the slot to equip into.
 * @param {number} skillId - The id of the skill to equip.
 */
Game_Actor.prototype.equipSkillToSlot = function(slotIndex, skillId)
{
  // validate the skill can be equipped to this slot before proceeding.
  if (this.canEquipSkillToSlot(slotIndex, skillId) === false) return;

  // perform the equip operation.
  this.updateEquipSkillSlot(slotIndex, skillId);

  // notify observers that the equip state has changed.
  this.onSkillEquipChange(slotIndex, skillId);
};

/**
 * Determines whether a skill can be equipped into the given slot by this actor.
 * @param {number} slotIndex - The index of the slot to check.
 * @param {number} skillId - The id of the skill to check.
 * @returns {boolean}
 */
Game_Actor.prototype.canEquipSkillToSlot = function(slotIndex, skillId)
{
  // resolve the cost of the incoming skill for this slot.
  const newCost = this.skillSlotCost(skillId, slotIndex);

  // free skills can always be equipped.
  if (newCost <= 0) return true;

  // if this skill is already equipped somewhere, moving it incurs no additional cost.
  if (this.getEquippedSkillIndex(skillId) !== -1) return true;

  // check what is currently occupying the target slot.
  const currentSkillId = this.getSkillIdInSlot(slotIndex);

  // replacing a slot with the same skill is always allowed.
  if (currentSkillId === skillId) return true;

  // compute the cost of the skill currently in the target slot.
  const currentCost = this.skillSlotCost(currentSkillId, slotIndex);

  // determine the hypothetical spend after swapping the occupant for the new skill.
  const hypotheticalSpent = this.spentSlotPoints() - currentCost + newCost;

  // allow only if the hypothetical spend stays within the actor's maximum.
  return hypotheticalSpent <= this.maxSlotPoints();
};

/**
 * Resolves the effective slot cost for a skill in a given slot context.
 * @param {number} skillId - The id of the skill to resolve the cost for.
 * @param {number} slotIndex - The slot index context (reserved for future cost modifiers).
 * @returns {number}
 */
// eslint-disable-next-line no-unused-vars
Game_Actor.prototype.skillSlotCost = function(skillId, slotIndex)
{
  // free-id skills have no cost.
  if (skillId <= 0) return 0;

  // resolve and return the base cost from the skill's notetag.
  return this.skill(skillId).slotCost;
};

/**
 * Determines if this actor has enough slot points to equip the specified skill.
 * @param {number} skillId - The id of the skill to check.
 * @returns {boolean}
 */
Game_Actor.prototype.hasEquipSkillPoints = function(skillId)
{
  // resolve the cost of this skill.
  const { slotCost } = this.skill(skillId);

  // free skills can always be equipped.
  if (slotCost <= 0) return true;

  // if the skill is already equipped, it can be moved without additional cost.
  if (this.getEquippedSkillIndex(skillId) !== -1) return true;

  // confirm there are enough remaining points to cover the cost.
  return this.hasSufficientSlotPoints(slotCost);
};

/**
 * Performs the actual slot assignment for an equip operation, handling displacement
 * of existing occupants and de-duplication of the incoming skill.
 * @param {number} slotIndex - The target slot index.
 * @param {number} skillId - The skill id to place into the slot.
 */
Game_Actor.prototype.updateEquipSkillSlot = function(slotIndex, skillId)
{
  // find if this skill is already equipped in another slot.
  const existingSlotIndex = this.getEquippedSkillIndex(skillId);

  // if the skill is already equipped elsewhere, remove it from that slot first.
  if (existingSlotIndex !== -1)
  {
    // remove the skill from its previous slot.
    this.deleteSlot(existingSlotIndex);

    // notify observers that the old slot was vacated.
    this.onSkillUnequipChange(existingSlotIndex, skillId);
  }

  // check whether the target slot already has a skill in it.
  const displacedSkillId = this.getSkillIdInSlot(slotIndex);

  // if a skill is being displaced, notify observers before it is removed.
  if (displacedSkillId > 0)
  {
    // notify observers that the displaced skill is leaving this slot.
    this.onSkillUnequipChange(slotIndex, displacedSkillId);
  }

  // place the new skill into the target slot.
  this.assignSlot(slotIndex, skillId);
};

/**
 * Unequips whatever skill is currently occupying the specified slot.
 * @param {number} slotIndex - The index of the slot to clear.
 */
Game_Actor.prototype.unequipSkillFromSlot = function(slotIndex)
{
  // determine what skill is currently in this slot.
  const currentSkillId = this.getSkillIdInSlot(slotIndex);

  // if the slot is already empty, there is nothing to do.
  if (currentSkillId === 0) return;

  // remove the slot entry.
  this.deleteSlot(slotIndex);

  // notify observers that this skill has been unequipped.
  this.onSkillUnequipChange(slotIndex, currentSkillId);
};

/**
 * Unequips the specified skill from whichever slot it currently occupies.
 * @param {number} skillId - The id of the skill to unequip.
 */
Game_Actor.prototype.unequipSkill = function(skillId)
{
  // find which slot this skill is currently in.
  const index = this.getEquippedSkillIndex(skillId);

  // if the skill is not equipped anywhere, there is nothing to do.
  if (index === -1) return;

  // delegate to the slot-based unequip method.
  this.unequipSkillFromSlot(index);
};

/**
 * Moves the skill in one slot into another slot, respecting all point and cost rules.
 * @param {number} fromIndex - The source slot index to move from.
 * @param {number} toIndex - The destination slot index to move to.
 */
Game_Actor.prototype.moveEquippedSkill = function(fromIndex, toIndex)
{
  // determine what skill is in the source slot.
  const skillId = this.getSkillIdInSlot(fromIndex);

  // if the source slot is empty, there is nothing to move.
  if (skillId === 0) return;

  // attempt to equip the skill into the destination slot.
  this.equipSkillToSlot(toIndex, skillId);

  // if the move succeeded, explicitly clear the source slot.
  if (this.getSkillIdInSlot(toIndex) === skillId)
  {
    // remove the skill from the source slot now that the destination is set.
    this.unequipSkillFromSlot(fromIndex);
  }
};

//endregion actions

//region event hooks
/**
 * A hook fired when a skill is successfully equipped to a slot.
 * @param {number} slotIndex - The index of the slot that was equipped.
 * @param {number} skillId - The id of the skill that was equipped.
 */
// eslint-disable-next-line no-unused-vars
Game_Actor.prototype.onSkillEquipChange = function(slotIndex, skillId)
{
  // no-op by default; extensions may observe this.
};

/**
 * A hook fired when a skill is unequipped from a slot.
 * @param {number} slotIndex - The index of the slot that was vacated.
 * @param {number} skillId - The id of the skill that was unequipped.
 */
// eslint-disable-next-line no-unused-vars
Game_Actor.prototype.onSkillUnequipChange = function(slotIndex, skillId)
{
  // no-op by default; extensions may observe this.
};

//endregion event hooks

//endregion Game_Actor


//region Scene_SkillEquip
/**
 * The scene for viewing and managing skill equip slots.
 */
class Scene_SkillEquip
  extends Scene_MenuBase
{
  /**
   * Pushes this current scene onto the stack, forcing it into action.
   */
  static callScene()
  {
    SceneManager.push(this);
  }

  //region init
  /**
   * Extends {@link #initMembers}.<br/>
   * Also initializes the SKS members.
   */
  initMembers()
  {
    // perform original logic.
    super.initMembers();

    // initialize the core SKS namespace.
    this.initCoreMembers();

    // initialize the primary members for the scene.
    this.initPrimaryMembers();
  }

  /**
   * Initializes the core SKS members.
   */
  initCoreMembers()
  {
    /**
     * The shared root namespace for all of J's plugin data.
     */
    this._j ||= {};

    /**
     * A grouping of all properties associated with the SKS system.
     */
    this._j._sks = {};
  }

  /**
   * Initializes the primary members for the scene.
   */
  initPrimaryMembers()
  {
    /**
     * The currently highlighted slot index in the slots list.
     * @type {number}
     */
    this._j._sks._focusedSlotIndex = 0;

    /**
     * The last-known slot index, used for change detection.
     * @type {number}
     */
    this._j._sks._lastSlotIndex = -1;

    /**
     * The last-known skill index, used for change detection.
     * @type {number}
     */
    this._j._sks._lastSkillIndex = -1;

    /**
     * A grouping of all windows for this scene.
     */
    this._j._sks._windows = {};

    /**
     * The ribbon window displayed along the top.
     * @type {Window_SkillEquipRibbon|null}
     */
    this._j._sks._windows._ribbon = null;

    /**
     * The slots list window displayed on the left.
     * @type {Window_SkillEquipSlots|null}
     */
    this._j._sks._windows._slots = null;

    /**
     * The skills list window displayed on the right.
     * @type {Window_SkillEquipList|null}
     */
    this._j._sks._windows._skills = null;

    /**
     * The detail window displayed beneath the skills list.
     * @type {Window_SkillEquipDetail|null}
     */
    this._j._sks._windows._detail = null;
  }

  //endregion init

  //region accessors
  /**
   * Gets the currently focused slot index.
   * @returns {number}
   */
  focusedSlotIndex()
  {
    return this._j._sks._focusedSlotIndex;
  }

  /**
   * Sets the currently focused slot index.
   * @param {number} index - The slot index to focus.
   */
  setFocusedSlotIndex(index)
  {
    this._j._sks._focusedSlotIndex = index;
  }

  /**
   * Gets the last-known slot index for change detection.
   * @returns {number}
   */
  lastSlotIndex()
  {
    return this._j._sks._lastSlotIndex;
  }

  /**
   * Sets the last-known slot index.
   * @param {number} index - The slot index to record.
   */
  setLastSlotIndex(index)
  {
    this._j._sks._lastSlotIndex = index;
  }

  /**
   * Gets the last-known skill index for change detection.
   * @returns {number}
   */
  lastSkillIndex()
  {
    return this._j._sks._lastSkillIndex;
  }

  /**
   * Sets the last-known skill index.
   * @param {number} index - The skill index to record.
   */
  setLastSkillIndex(index)
  {
    this._j._sks._lastSkillIndex = index;
  }

  //endregion accessors

  //region create
  /**
   * Initialize all resources required for this scene.
   */
  create()
  {
    // perform original logic.
    super.create();

    // create the various display objects on the screen.
    this.createDisplayObjects();
  }

  /**
   * Creates the display objects for this scene.
   */
  createDisplayObjects()
  {
    // create all windows for this scene.
    this.createAllWindows();
  }

  /**
   * Creates all windows for this scene.
   */
  createAllWindows()
  {
    // create the ribbon window along the top.
    this.createRibbonWindow();

    // create the slots window on the left side.
    this.createSlotsWindow();

    // create the skills list window on the right side.
    this.createSkillsListWindow();

    // create the detail window beneath the skills list.
    this.createDetailWindow();

    // wire the windows together after all are created.
    this.wireWindows();

    // apply initial selection and focus.
    this.initializeView();
  }

  //region ribbon
  /**
   * Creates the ribbon window across the top.
   */
  createRibbonWindow()
  {
    // build the rectangle for the window.
    const rect = this.ribbonWindowRect();

    // create the window instance.
    const win = new Window_SkillEquipRibbon(rect);

    // assign the actor into the window.
    win.setActor(this.actor());

    // assign the window reference.
    this._j._sks._windows._ribbon = win;

    // add the window to the scene.
    this.addWindow(win);
  }

  /**
   * Builds the rectangle for the ribbon window across the top.
   * @returns {Rectangle}
   */
  ribbonWindowRect()
  {
    // the ribbon spans the full width of the screen.
    const ww = Graphics.boxWidth;

    // determine the ribbon height as one line tall.
    const wh = this.calcWindowHeight(1, false);

    // the ribbon always starts at the left edge.
    const wx = 0;

    // determine the y position at the top of the main area.
    const wy = this.mainAreaTop();

    // return the rectangle for the ribbon window.
    return new Rectangle(wx, wy, ww, wh);
  }

  /**
   * Gets the ribbon window.
   * @returns {Window_SkillEquipRibbon|null}
   */
  ribbonWindow()
  {
    return this._j._sks._windows._ribbon;
  }

  //endregion ribbon

  //region slots
  /**
   * Creates the slots window on the left side.
   */
  createSlotsWindow()
  {
    // build the rectangle for the window.
    const rect = this.slotsWindowRect();

    // create the window instance.
    const win = new Window_SkillEquipSlots(rect);

    // assign the actor into the window.
    win.setActor(this.actor());

    // set the handler for confirming a slot selection.
    win.setHandler('ok', this.onSlotOk.bind(this));

    // set the handler for canceling from the slot selection.
    win.setHandler('cancel', this.onSlotCancel.bind(this));

    // set the handler for unequipping the skill in the focused slot.
    win.setHandler('more', this.onSlotUnequip.bind(this));

    // wire page navigation keys for actor cycling.
    win.setHandler('pageup', this.onCycleActorLeft.bind(this));
    win.setHandler('pagedown', this.onCycleActorRight.bind(this));

    // assign the window reference.
    this._j._sks._windows._slots = win;

    // add the window to the scene.
    this.addWindow(win);
  }

  /**
   * Builds the rectangle for the slots window on the left.
   * @returns {Rectangle}
   */
  slotsWindowRect()
  {
    // determine the total available height below the ribbon.
    const totalHeight = this.mainAreaHeight() - this.ribbonWindowRect().height;

    // keep the width aligned with the ribbon above it.
    const ww = 420;

    // use the full remaining height below the ribbon.
    const wh = totalHeight;

    // determine the x position based on the current input mode.
    const wx = this.isRightInputMode()
      ? Graphics.boxWidth - ww
      : 0;

    // place the window directly below the ribbon.
    const wy = this.ribbonWindowRect().y + this.ribbonWindowRect().height;

    // return the rectangle for the slots window.
    return new Rectangle(wx, wy, ww, wh);
  }

  /**
   * Gets the slots window.
   * @returns {Window_SkillEquipSlots|null}
   */
  slotsWindow()
  {
    return this._j._sks._windows._slots;
  }

  //endregion slots

  //region skills list
  /**
   * Creates the skills list window on the right side.
   */
  createSkillsListWindow()
  {
    // build the rectangle for the window.
    const rect = this.skillsListWindowRect();

    // create the window instance.
    const win = new Window_SkillEquipList(rect);

    // assign the actor into the window.
    win.setActor(this.actor());

    // set the handler for confirming a skill selection.
    win.setHandler('ok', this.onSkillOk.bind(this));

    // set the handler for canceling from the skill selection.
    win.setHandler('cancel', this.onSkillCancel.bind(this));

    // assign the window reference.
    this._j._sks._windows._skills = win;

    // add the window to the scene.
    this.addWindow(win);
  }

  /**
   * Builds the rectangle for the skills list window on the right.
   * @returns {Rectangle}
   */
  skillsListWindowRect()
  {
    // determine the x position based on the current input mode.
    const wx = this.isRightInputMode()
      ? 0
      : this.slotsWindowRect().x + this.slotsWindowRect().width;

    // fill the remaining width of the screen after the slots column.
    const ww = Graphics.boxWidth - this.slotsWindowRect().width;

    // compute the remaining height below the ribbon shared by both right-side windows.
    const remainingHeight = this.mainAreaHeight() - this.ribbonWindowRect().height;

    // use 60% of the remaining height for the list portion.
    const wh = Math.floor(remainingHeight * 0.6);

    // start directly below the ribbon.
    const wy = this.ribbonWindowRect().y + this.ribbonWindowRect().height;

    // return the rectangle for the skills list window.
    return new Rectangle(wx, wy, ww, wh);
  }

  /**
   * Gets the skills list window.
   * @returns {Window_SkillEquipList|null}
   */
  skillsWindow()
  {
    return this._j._sks._windows._skills;
  }

  //endregion skills list

  //region detail
  /**
   * Creates the detail window beneath the skills list.
   */
  createDetailWindow()
  {
    // build the rectangle for the window.
    const rect = this.detailWindowRect();

    // create the window instance.
    const win = new Window_SkillEquipDetail(rect);

    // assign the actor into the window.
    win.setActor(this.actor());

    // assign the window reference.
    this._j._sks._windows._detail = win;

    // add the window to the scene.
    this.addWindow(win);
  }

  /**
   * Builds the rectangle for the detail window beneath the skills list.
   * @returns {Rectangle}
   */
  detailWindowRect()
  {
    // share the same x position as the skills list.
    const wx = this.skillsListWindowRect().x;

    // match the width of the skills list.
    const ww = this.skillsListWindowRect().width;

    // fill the remaining height below both the ribbon and the skills list.
    const wh = this.mainAreaHeight() - this.ribbonWindowRect().height - this.skillsListWindowRect().height;

    // place the window directly beneath the skills list.
    const wy = this.skillsListWindowRect().y + this.skillsListWindowRect().height;

    // return the rectangle for the detail window.
    return new Rectangle(wx, wy, ww, wh);
  }

  /**
   * Gets the detail window.
   * @returns {Window_SkillEquipDetail|null}
   */
  detailWindow()
  {
    return this._j._sks._windows._detail;
  }

  //endregion detail

  //endregion create

  //region update
  /**
   * Extends {@link #update}.<br/>
   * Also watches window indices and keeps dependent windows in sync.
   */
  update()
  {
    // perform original logic.
    super.update();

    // update the detail window based on the current slot selection.
    this.updateSlotDetails();

    // update the detail window based on the current skill selection.
    this.updateSkillDetails();
  }

  /**
   * Updates the skills list context and detail window based on the current slot selection.
   */
  updateSlotDetails()
  {
    // grab the current slot index from the slots window.
    const slotIndex = this.slotsWindow()
      .index();

    // if the slot index has not changed, do nothing.
    if (slotIndex === this.lastSlotIndex()) return;

    // record the updated slot index.
    this.setLastSlotIndex(slotIndex);

    // update the skills list to reflect the new slot context.
    this.skillsWindow()
      .setSlotContext(slotIndex);

    // determine the skill equipped in this slot.
    const idInSlot = this.actor()
      .getSkillIdInSlot(slotIndex);

    // update the detail window to show the skill in this slot.
    this.detailWindow()
      .setSkillId(idInSlot);
  }

  /**
   * Updates the detail window based on the current skill selection.
   */
  updateSkillDetails()
  {
    // grab the current skill index from the skills window.
    const skillIndex = this.skillsWindow()
      .index();

    // if the skill index has not changed, do nothing.
    if (skillIndex === this.lastSkillIndex()) return;

    // record the updated skill index.
    this.setLastSkillIndex(skillIndex);

    // determine the currently selected skill.
    const skill = this.skillsWindow()
      .item();

    // determine the skill id to pass to the detail window.
    const id = skill ? skill.id : 0;

    // if there is a valid skill selected, update the detail window.
    if (id > 0)
    {
      // update the detail window to show the selected skill.
      this.detailWindow()
        .setSkillId(id);
    }
  }

  //endregion update

  //region actions
  /**
   * Extends {@link #onActorChange}.<br/>
   * Also refreshes all SKS windows when the actor changes.
   */
  onActorChange()
  {
    // perform original logic.
    super.onActorChange();

    // get the updated actor reference.
    const updatedActor = this.actor();

    // rebind all windows to the new actor.
    this.rebindAllWindowsToActor(updatedActor);

    // refresh all windows for the new actor.
    this.refreshAll();

    // restore initial focus to the slots window.
    this.slotsWindow()
      .select(0);
    this.slotsWindow()
      .activate();
    this.skillsWindow()
      .deactivate();
  }

  /**
   * Handles confirming a slot selection.
   */
  onSlotOk()
  {
    // record the newly focused slot index.
    this.setFocusedSlotIndex(this.slotsWindow()
      .index());

    // deactivate the slots window while the skill list is active.
    this.slotsWindow()
      .deactivate();

    // move focus to the skills list.
    this.skillsWindow()
      .activate();

    // start the skills list selection from the top.
    this.skillsWindow()
      .select(0);

    // determine the first skill in the list, if any.
    const firstItem = this.skillsWindow()
      .item();

    // determine the skill id to show in the detail window.
    const firstId = firstItem ? firstItem.id : 0;

    // update the detail window for the first item.
    this.detailWindow()
      .setSkillId(firstId);
  }

  /**
   * Handles canceling from the slot selection.
   */
  onSlotCancel()
  {
    // exit the scene.
    this.popScene();
  }

  /**
   * Handles the "more" action from the slot selection.
   * Unequips the skill in the currently focused slot, if one is equipped.
   */
  onSlotUnequip()
  {
    // acquire the currently focused slot entry.
    const entry = this.slotsWindow()
      .item();

    // determine if the slot currently has a skill equipped.
    const isFilled = entry.skillId > 0;

    // if the slot is empty there is nothing to unequip; remain active.
    if (isFilled === false)
    {
      // reactivate the slots window and do nothing further.
      this.slotsWindow()
        .activate();

      return;
    }

    // unequip the skill from this slot.
    this.actor()
      .unequipSkillFromSlot(entry.index);

    // refresh the UI to reflect the change.
    this.refreshAll();

    // remain in the scene with the slots window active.
    this.slotsWindow()
      .activate();
  }

  /**
   * Handles confirming a skill selection for the focused slot.
   */
  onSkillOk()
  {
    // determine the focused slot index.
    const slotIndex = this.focusedSlotIndex();

    // determine the selected skill.
    const skill = this.skillsWindow()
      .item();

    // equip the selected skill to the focused slot.
    this.actor()
      .equipSkillToSlot(slotIndex, skill.id);

    // refresh all windows to reflect the change.
    this.refreshAll();

    // deactivate the skills window.
    this.skillsWindow()
      .deactivate();

    // return focus to the slots window.
    this.slotsWindow()
      .activate();
  }

  /**
   * Handles canceling from the skills list.
   */
  onSkillCancel()
  {
    // deactivate the skills window.
    this.skillsWindow()
      .deactivate();

    // return focus to the slots window.
    this.slotsWindow()
      .activate();

    // determine the skill equipped in the currently selected slot.
    const skillIdInSlot = this.actor()
      .getSkillIdInSlot(this.slotsWindow()
        .index());

    // update the detail window to reflect the equipped skill for the current slot.
    this.detailWindow()
      .setSkillId(skillIdInSlot);
  }

  /**
   * Cycles to the previous actor.
   */
  onCycleActorLeft()
  {
    // move to the previous actor.
    this.previousActor();
  }

  /**
   * Cycles to the next actor.
   */
  onCycleActorRight()
  {
    // move to the next actor.
    this.nextActor();
  }

  //endregion actions

  //region helpers
  /**
   * Applies the initial selection and focus state for the scene.
   */
  initializeView()
  {
    // start with the first slot selected and active.
    this.slotsWindow()
      .select(0);
    this.slotsWindow()
      .activate();

    // start with the skills window inactive.
    this.skillsWindow()
      .deactivate();
  }

  /**
   * Wires the initial context between windows after all are created.
   */
  wireWindows()
  {
    // provide the initial slot context to the skills list.
    this.skillsWindow()
      .setSlotContext(this.slotsWindow()
        .index());

    // determine the skill equipped in the first slot.
    const skillIdInSlot = this.actor()
      .getSkillIdInSlot(this.slotsWindow()
        .index());

    // set the detail to show the skill in the first slot.
    this.detailWindow()
      .setSkillId(skillIdInSlot);
  }

  /**
   * Rebinds all scene windows to the provided actor.
   * @param {Game_Actor} actor - The actor to bind to all windows.
   */
  rebindAllWindowsToActor(actor)
  {
    // update the ribbon window with the new actor.
    this.ribbonWindow()
      .setActor(actor);

    // update the slots window with the new actor.
    this.slotsWindow()
      .setActor(actor);

    // update the skills window with the new actor.
    this.skillsWindow()
      .setActor(actor);

    // update the detail window with the new actor.
    this.detailWindow()
      .setActor(actor);
  }

  /**
   * Refreshes all windows in the scene.
   */
  refreshAll()
  {
    // refresh the ribbon window.
    this.ribbonWindow()
      .refresh();

    // refresh the slots list.
    this.slotsWindow()
      .refresh();

    // update the skills list context for the currently selected slot.
    this.skillsWindow()
      .setSlotContext(this.slotsWindow()
        .index());

    // refresh the skills list.
    this.skillsWindow()
      .refresh();

    // determine the currently highlighted skill in the list, if any.
    const currentSkill = this.skillsWindow()
      .item();

    // prefer the highlighted skill; fall back to the skill equipped in the current slot.
    const skillId = currentSkill
      ? currentSkill.id
      : this.actor().getSkillIdInSlot(this.slotsWindow().index());

    // update the detail window with the resolved skill.
    this.detailWindow()
      .setSkillId(skillId);
  }

  //endregion helpers
}

//endregion Scene_SkillEquip


//region Window_SkillEquipDetail
/**
 * A window responsible for showing skill details in SKS context.
 */
class Window_SkillEquipDetail
  extends Window_Base
{
  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle for this window.
   */
  constructor(rect)
  {
    // perform original logic.
    super(rect);

    // initialize members.
    this.initMembers();
  }

  /**
   * Initializes internal members.
   */
  initMembers()
  {
    /**
     * The actor used for extended/overlay data.
     * @type {Game_Actor|null}
     */
    this._actor = null;

    /**
     * The skill id this window is showing.
     * @type {number}
     */
    this._skillId = 0;

    // refresh to draw default.
    this.refresh();
  }

  /**
   * Assigns the actor for this window.
   * @param {Game_Actor} actor The actor to assign.
   */
  setActor(actor)
  {
    // assign the actor.
    this._actor = actor;

    // refresh for the new actor context.
    this.refresh();
  }

  /**
   * Sets the skill id being displayed and refreshes.
   * @param {number} skillId The new skill id.
   */
  setSkillId(skillId)
  {
    // assign the id.
    this._skillId = skillId > 0
      ? skillId
      : 0;

    // refresh for the new selection.
    this.refresh();
  }

  /**
   * Gets the current skill being presented.
   * @returns {RPG_Skill|null}
   */
  skill()
  {
    // if we do not have a skill id, then there is no skill.
    if (!this._skillId) return null;

    // if we have extend capability available and actor context, then resolve overlayed skill.
    if (typeof J !== 'undefined' && J.EXTEND && this._actor)
    {
      // return the overlayed skill.
      return OverlayManager.getExtendedSkill(this._actor, this._skillId);
    }

    // otherwise, return the base skill.
    return $dataSkills[this._skillId];
  }

  /**
   * Clears and redraws contents.
   */
  refresh()
  {
    // clear existing.
    this.contents.clear();

    // grab the current skill.
    const skill = this.skill();

    // if there is no skill to draw, stop here.
    if (!skill) return;

    // draw icon + name.
    const iconX = 0;
    const nameX = iconX + ImageManager.iconWidth + 6;
    this.drawIcon(skill.iconIndex, iconX, 0);
    this.drawText(skill.name, nameX, 0, this.contentsWidth() - nameX, 'left');

    // compute y for the details section.
    const lineH = this.lineHeight();
    let y = lineH + 4;

    // draw a horizontal line.
    this.drawHorzLine(y - 2);

    // draw costs: MP/TP + Slot cost.
    const mpCost = skill.mpCost || 0;
    const tpCost = skill.tpCost || 0;
    const slotCost = this._actor
      ? this._actor.skillSlotCost(skill.id, 0)
      : (J.SKS.Metadata.defaultSkillSlotCost || 1);
    this.drawText(`MP: ${mpCost}`, 0, y, 120, 'left');
    this.drawText(`TP: ${tpCost}`, 120, y, 120, 'left');
    this.drawText(`Slot: ${slotCost}`, 240, y, 160, 'left');

    // advance y to description block.
    y += lineH + 2;

    // draw description wrapped.
    const desc = skill.description || String.empty;
    const descWidth = this.contentsWidth() - 6;
    const textLines = this.convertEscapeCharacters(desc)
      .split(/\n/g);
    let drawY = y;
    textLines.forEach(line =>
    {
      // draw each line of description.
      this.drawTextEx(line, 0, drawY, descWidth);

      // step down.
      drawY += lineH;
    });
  }

  /**
   * Draws a thin horizontal line across the window.
   * @param {number} y The y coordinate to draw at.
   */
  drawHorzLine(y)
  {
    // determine line width.
    const lineWidth = this.contentsWidth();

    // determine line color.
    const color = this.systemColor();

    // draw the line.
    this.drawRect(0, y, lineWidth, 2, color);
  }
}

//endregion Window_SkillEquipDetail

//region Window_SkillEquipList
/**
 * A window responsible for listing equippable skills (filtered).
 * Uses Window_Command to match Aptitude windows style.
 */
class Window_SkillEquipList
  extends Window_Command
{
  //region properties
  /**
   * The actor whose equips are being managed.
   * @type {Game_Actor|null}
   */
  _actor = null;

  /**
   * The current slot index context used for cost checks.
   * @type {number}
   */
  _slotContext = 0;
  //endregion properties

  //region init
  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle for this window.
   */
  constructor(rect)
  {
    // perform original logic.
    super(rect);

    // initialize members.
    this.initMembers();
  }

  /**
   * Initializes internal members.
   */
  initMembers()
  {
    // initialize the actor reference.
    this._actor = null;

    // initialize the slot context.
    this._slotContext = 0;
  }

  //endregion init

  //region accessors
  /**
   * Gets the actor bound to this window.
   * @returns {Game_Actor|null}
   */
  actor()
  {
    return this._actor;
  }

  /**
   * Assigns the actor for this window and refreshes.
   * @param {Game_Actor} actor The actor to assign.
   */
  setActor(actor)
  {
    // assign the actor reference.
    this._actor = actor;

    // refresh with the new actor.
    this.refresh();
  }

  /**
   * Gets the current slot index context for equip checks.
   * @returns {number}
   */
  slotContext()
  {
    return this._slotContext;
  }

  /**
   * Sets the slot context for cost checks and refreshes enabling.
   * @param {number} slotIndex The slot index being targeted.
   */
  setSlotContext(slotIndex)
  {
    // assign the slot index.
    this._slotContext = slotIndex;

    // rebuild to reflect enable/disable + sorting in this context.
    this.refresh();
  }

  /**
   * Gets the current item (skill) at the selection.
   * @returns {RPG_Skill|null}
   */
  item()
  {
    // acquire the current built command from the internal list.
    const cmd = this.commandList()
      .at(this.index());

    // if we have no command at the current index, then there is no skill.
    if (!cmd) return null;

    // extract the id from the payload.
    const ext = cmd.ext || { id: 0 };
    const id = ext.id || 0;

    // return the skill if valid.
    return id > 0
      ? $dataSkills[id]
      : null;
  }

  //endregion accessors

  //region commands
  /**
   * Rebuilds the command list for the current actor.
   */
  makeCommandList()
  {
    // if we don’t have an actor, there is nothing to build.
    if (!this.actor()) return;

    // build all commands for this window.
    const commands = this.buildCommands();

    // add all built commands to this window.
    commands.forEach(this.addBuiltCommand, this);
  }

  /**
   * Builds all commands for this window.
   * Filters the actor's learned skills to those eligible for slot equipping,
   * then sorts by ascending slot cost for the current slot context.
   * @returns {BuiltWindowCommand[]}
   */
  buildCommands()
  {
    // guard: cannot build without an actor.
    if (!this.actor()) return [];

    // gather learned skills from the actor.
    const learned = this.actor()
      .skills();

    // filter to SKS‑equippable per rules.
    const filtered = learned.filter(skill =>
    {
      // skip invalid entries.
      if (!skill) return false;

      // exclude unslotted.
      if (skill.unslotted) return false;

      // exclude extension skills when J.EXTEND exists.
      if (J.EXTEND && skill.isSkillExtension) return false;

      // include others.
      return true;
    })
      .sort((a, b) =>
      {
        const costA = this.actor()
          .skillSlotCost(a.id, this.slotContext());
        const costB = this.actor()
          .skillSlotCost(b.id, this.slotContext());
        if (costA !== costB) return costA - costB;
        return a.id - b.id;
      });

    // convert to built commands.
    const commands = filtered.map(this.buildCommand, this);

    // return commands.
    return commands;
  }

  /**
   * Builds a single command for the given skill.
   * @param {RPG_Skill} skill The skill to build the command for.
   * @returns {BuiltWindowCommand}
   */
  buildCommand(skill)
  {
    // compute cost for right text.
    const cost = this.actor()
      .skillSlotCost(skill.id, this.slotContext());

    // determine if this skill is currently enabled to equip.
    const enabled = this.actor()
      .canEquipSkillToSlot(this.slotContext(), skill.id);

    // build and return the command.
    const built = new WindowCommandBuilder(skill.name)
      .setSymbol(`skill:${skill.id}`)
      .setExtensionData({ id: skill.id })
      .setIconIndex(skill.iconIndex)
      .setRightText(`${cost}`)
      .setEnabled(enabled)
      .build();

    // return the built command.
    return built;
  }

  //endregion commands
}

//endregion Window_SkillEquipList

//region Window_SkillEquipRibbon
/**
 * A window responsible for showing actor and SKS point summary.
 */
class Window_SkillEquipRibbon
  extends Window_ActorRibbon
{
  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle for this window.
   */
  constructor(rect)
  {
    // perform original logic.
    super(rect);
  }

  /**
   * Initializes member fields.
   */
  initMembers()
  {
    // initialize base ribbon members (actor, face size/coords, etc.).
    super.initMembers();
  }

  /**
   * Clears and redraws the contents of this window.
   */
  drawContent()
  {
    // perform original logic.
    super.drawContent();

    // don't draw if the actor is unavailable.
    if (!this._actor) return;

    // draw the actor name and slot info.
    this.drawNameAndPoints();
  }

  /**
   * Draws the actor name and slot info.
   */
  drawNameAndPoints()
  {
    // grab the actor.
    const actor = this.actor();

    // pull the face anchor and dimensions from the base ribbon.
    const [ fx, fy ] = this.faceCoordinates();
    const [ fw ] = this.faceSize();

    // compute text placement to the right of the face.
    const nameX = fx + fw + 16;
    const y = fy;

    // gather display values.
    const name = actor.name();
    const spent = actor.spentSlotPoints();
    const total = actor.maxSlotPoints();

    // draw name (left) and points (right) on the same line.
    this.drawText(name, nameX, y, this.contentsWidth() - nameX - 6, 'left');
    this.drawText(`${spent}/${total} pts`, 0, y, this.contentsWidth() - 6, 'right');
  }
}

//endregion Window_SkillEquipRibbon

//region Window_SkillEquipSlots
/**
 * The window listing SKS slots for the current actor.
 * Uses Window_Command to match Aptitude windows style.
 */
class Window_SkillEquipSlots
  extends Window_Command
{
  //region properties
  /**
   * The actor whose equips are being managed.
   * @type {Game_Actor|null}
   */
  _actor = null;

  /**
   * The number of visible slots to present.
   * @type {number}
   */
  _visibleSlots = 8;
  //endregion properties

  //region init
  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle for this window.
   */
  constructor(rect)
  {
    // perform original logic.
    super(rect);

    // initialize members.
    this.initMembers();
  }

  /**
   * Initializes the members of this window.
   */
  initMembers()
  {
    // initialize the actor.
    this._actor = null;

    // initialize visible slot count.
    this._visibleSlots = 8;
  }

  //endregion init

  //region accessors
  /**
   * Gets the actor bound to this window.
   * @returns {Game_Actor|null}
   */
  actor()
  {
    // return the bound actor.
    return this._actor;
  }

  /**
   * Binds a new actor to this window.
   * @param {Game_Actor} actor The actor to bind.
   */
  setActor(actor)
  {
    // assign the actor reference.
    this._actor = actor;

    // refresh the command list for the new actor.
    this.refresh();
  }

  /**
   * Gets the item (slot entry) at the current index.
   * @returns {{ index:number, skillId:number }|null}
   */
  item()
  {
    // acquire the current built command from the internal list.
    const cmd = this.commandList()
      .at(this.index());

    // if no command, there is no item.
    if (!cmd) return null;

    // return the payload we stored when building commands.
    return cmd.ext || null;
  }

  /**
   * Gets the preferred visible slot count (unused for building; list scrolls as needed).
   * @returns {number}
   */
  visibleSlots()
  {
    // return the configured value.
    return this._visibleSlots;
  }

  /**
   * Sets the preferred visible slot count (note: actual rows derive from actor slots).
   * @param {number} count The number of slots to prefer showing at once.
   */
  setVisibleSlots(count)
  {
    // assign the value.
    this._visibleSlots = count;

    // refresh if the window is already initialized.
    this.refresh();
  }

  //endregion accessors

  //region commands
  /**
   * Rebuilds the command list for the current actor.
   */
  makeCommandList()
  {
    // if we don’t have an actor, there is nothing to build.
    if (!this.actor()) return;

    // build all commands for this window.
    const commands = this.buildCommands();

    // add all built commands to this window.
    commands.forEach(this.addBuiltCommand, this);
  }

  /**
   * Builds all commands for this command window.
   * @returns {BuiltWindowCommand[]}
   */
  buildCommands()
  {
    // guard: cannot build without an actor.
    if (!this.actor()) return [];

    // compute slot capacity for rendering.
    const count = this.computeRenderableSlotCount();

    // build a row for each renderable slot (scrolling handled by Window_Command).
    const commands = [];
    for (let slotIndex = 0; slotIndex < count; slotIndex++)
    {
      commands.push(this.buildCommand(slotIndex));
    }

    // return the completed list of commands.
    return commands;
  }

  /**
   * Builds a single command for the given slot index.
   * @param {number} slotIndex The slot index to build a command for.
   * @returns {BuiltWindowCommand}
   */
  buildCommand(slotIndex)
  {
    // determine the equipped id for that slot.
    const skillId = this.actor()
      .getSkillIdInSlot(slotIndex);

    // resolve label/icon/cost depending on occupancy.
    const isEmpty = skillId === 0;

    // determine the display name and icon for the row.
    const name = isEmpty === false
      ? $dataSkills[skillId].name
      : '- empty -';
    const iconIndex = isEmpty === false
      ? $dataSkills[skillId].iconIndex
      : 0;

    // compute cost text for the right side; explicitly 0 if empty.
    const rightText = isEmpty === false
      ? `${this.actor()
        .skillSlotCost(skillId, slotIndex)}`
      : '0';

    // slots are always selectable; follow-up behavior handled by scene.
    const enabled = true;

    // build the command for this row.
    const built = new WindowCommandBuilder(name)
      .setSymbol(`slot:${slotIndex}`)
      .setExtensionData({
        index: slotIndex,
        skillId
      })
      .setIconIndex(iconIndex)
      .setRightText(rightText)
      .setEnabled(enabled)
      .build();

    // return the built command.
    return built;
  }

  /**
   * Computes how many slot rows to render.
   * Uses the max of: highest equipped slot index + 1, and max slot points.
   * Guarantees at least 1 row.
   * @returns {number}
   */
  computeRenderableSlotCount()
  {
    // start with a baseline derived from points (temporary capacity until a dedicated stat exists).
    const baseline = Number(this.actor().maxSlotPoints()) || 0;

    // find the highest equipped slot index, if any.
    let highest = -1;
    const map = this.actor().slotMap();
    for (const [ slotIndex ] of map)
    {
      if (slotIndex > highest)
      {
        highest = slotIndex;
      }
    }

    // the highest occupied index implies at least that many rows to show.
    const occupiedCount = highest + 1; // if none, becomes 0.

    // compute the final render count.
    const count = Math.max(1, baseline, occupiedCount);

    // return the computed row count.
    return count;
  }

  //endregion commands
}

//endregion Window_SkillEquipSlots

//# sourceMappingURL=J-SkillSlots.js.map
