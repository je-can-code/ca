//region annotations
/*:
 * @target MZ
 * @plugindesc [v1.0.0 SKS] A plugin enabling actors to equip skills into dedicated skill slots.
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

//#region src/plugins/sks/core/_metadata/_pluginMetadata.js
var JSkillSlots_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	*  Extends {@link #postInitialize}.<br>
	*  Includes translation of plugin parameters.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeMetadata();
	}
	/**
	* Initializes the metadata associated with this plugin.
	*/
	initializeMetadata() {
		/**
		* The id of a switch that represents whether or not this system is accessible in the menu.
		* @type {number}
		*/
		this.menuSwitchId = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["menu-switch"], 0);
		/**
		* The skill type IDs whose skills are eligible for equipping into slots.
		* Skills of types not in this list are implicitly unslotted.
		* When empty, all skills are eligible regardless of type.
		* @type {number[]}
		*/
		this.equippableSkillTypeIds = JSON.parse(this.parsedPluginParameters["equippable-skill-type-ids"] || "[]").map((id) => J.BASE.Helpers.parsePluginInt(id, 0));
		/**
		* The default maximum number of skill slot points for an actor.
		* @type {number}
		*/
		this.defaultMaxSkillSlotPoints = 4;
		/**
		* The default cost of a skill for a skill slot.
		* @type {number}
		*/
		this.defaultSkillSlotCost = 1;
	}
};

//#endregion
//#region src/plugins/sks/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
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
J.SKS.Metadata = new JSkillSlots_PluginMetadata("J-SkillSlots", "1.0.0");
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

//#endregion
//#region src/plugins/sks/core/_models/SkillEquipSlot.js
/**
* Represents a single skill equipped in a slot for an actor.
* Serialized into save data; uses a prototype constructor to remain JSON-safe.
* @param {number} index - The index of the slot this entry occupies.
* @param {number} skillId - The id of the skill equipped in this slot.
*/
function SkillEquipSlot(index, skillId) {
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

//#endregion
//#region src/plugins/sks/core/database/RPG_Skill.js
/**
* The slot cost for this equip skill.
*/
Object.defineProperty(RPG_Skill.prototype, "slotCost", { get: function() {
	return RPGManager.getNumberFromNoteByRegex(this, J.SKS.RegExp.SlotCost);
} });
/**
* Whether this skill is perpetually active without needing to be assigned to a slot.
* Unslotted skills do not appear in the SKS equip list.
*
* A skill is considered unslotted if any of the following are true:
*  - It carries the explicit {@link J.SKS.RegExp.Unslotted} notetag.
*  - Passive skill type IDs are configured and this skill's type is not among them.
*/
Object.defineProperty(RPG_Skill.prototype, "unslotted", { get: function() {
	const isExplicitlyUnslotted = RPGManager.checkForBooleanFromNoteByRegex(this, J.SKS.RegExp.Unslotted);
	if (isExplicitlyUnslotted) return true;
	const equippableTypeIds = J.SKS.Metadata.equippableSkillTypeIds;
	if (equippableTypeIds.length === 0) return false;
	return equippableTypeIds.includes(this.stypeId) === false;
} });

//#endregion
//#region src/plugins/sks/core/database/RPG_State.js
/**
* The modifier to global slot costs for skill equips.
*/
Object.defineProperty(RPG_State.prototype, "slotCostModifier", { get: function() {
	return RPGManager.getNumberFromNoteByRegex(this, J.SKS.RegExp.SlotCostModifier);
} });

//#endregion
//#region src/plugins/sks/core/database/RPG_EquipItem.js
/**
* The modifier to the slot cost of all equipped skills for the owner of this item.
*/
Object.defineProperty(RPG_EquipItem.prototype, "slotCostModifier", { get: function() {
	return RPGManager.getNumberFromNoteByRegex(this, J.SKS.RegExp.SlotCostModifier);
} });

//#endregion
//#region src/plugins/sks/core/objects/Game_Actor.js
/**
* Extends {@link #initMembers}.<br/>
* Also initializes the skill slots members.
*/
J.SKS.Aliased.Game_Actor.set("initMembers", Game_Actor.prototype.initMembers);
Game_Actor.prototype.initMembers = function() {
	J.SKS.Aliased.Game_Actor.get("initMembers").call(this);
	this.initSkillSlotsMembers();
};
/**
* Initializes all members associated with the skill slots system.
*/
Game_Actor.prototype.initSkillSlotsMembers = function() {
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
/**
* Gets the ordered array of equipped skill slots for this actor.
* @returns {SkillEquipSlot[]}
*/
Game_Actor.prototype.slots = function() {
	return this._j._sks._slots;
};
/**
* Gets the slot map for this actor.
* @returns {Map<number, number>}
*/
Game_Actor.prototype.slotMap = function() {
	return this._j._sks._slotMap;
};
/**
* Clears all entries from the slot map.
*/
Game_Actor.prototype.clearSlotMap = function() {
	this.slotMap().clear();
};
/**
* Gets the skill id currently assigned to a given slot index.
* @param {number} slotIndex - The index of the slot to inspect.
* @returns {number} - The skill id in the slot, or 0 if the slot is empty.
*/
Game_Actor.prototype.getSkillIdInSlot = function(slotIndex) {
	const id = this.slotMap().get(slotIndex);
	return id ?? 0;
};
/**
* Gets the slot index where the given skill is currently equipped.
* @param {number} skillId - The id of the skill to locate.
* @returns {number} - The slot index where the skill is equipped, or -1 if not found.
*/
Game_Actor.prototype.getEquippedSkillIndex = function(skillId) {
	for (const [slotIndex, slotSkillId] of this.slotMap()) {
		if (slotSkillId === skillId) return slotIndex;
	}
	return -1;
};
/**
* Gets the maximum number of slot points available to this actor.
* @returns {number}
*/
Game_Actor.prototype.maxSlotPoints = function() {
	return this._j._sks._maxSlotPoints;
};
/**
* Sets the maximum number of slot points available to this actor.
* @param {number} points - The new maximum slot points value.
*/
Game_Actor.prototype.setMaxSlotPoints = function(points) {
	this._j._sks._maxSlotPoints = points;
};
/**
* Modifies the maximum number of slot points for this actor by the given amount.
* The result is clamped to a minimum of 0.
* @param {number} amount - The amount to modify by. Negative values reduce the maximum.
*/
Game_Actor.prototype.modifyMaxSlotPoints = function(amount) {
	const newMax = this.maxSlotPoints() + amount;
	this.setMaxSlotPoints(Math.max(0, newMax));
};
/**
* Gets the total number of slot points currently spent by this actor.
* @returns {number}
*/
Game_Actor.prototype.spentSlotPoints = function() {
	let points = 0;
	for (const [, skillId] of this.slotMap()) {
		points += this.skill(skillId).slotCost;
	}
	return points;
};
/**
* Gets the number of slot points remaining after all equipped skills are accounted for.
* @returns {number}
*/
Game_Actor.prototype.remainingSlotPoints = function() {
	return this.maxSlotPoints() - this.spentSlotPoints();
};
/**
* Whether or not this actor has enough slot points to cover the given cost.
* @param {number} points - The number of points to check against.
* @returns {boolean}
*/
Game_Actor.prototype.hasSufficientSlotPoints = function(points) {
	if (points <= 0) return true;
	if (this.remainingSlotPoints() <= 0) return false;
	return this.spentSlotPoints() + points <= this.maxSlotPoints();
};
/**
* Gets only the skills this actor currently has equipped in slots.
* This is the filtered view intended for the JABS quick menu and CMS.
* @returns {RPG_Skill[]}
*/
Game_Actor.prototype.equippedSkills = function() {
	const learned = this.skills();
	const equippedIds = new Set();
	for (const [, skillId] of this.slotMap()) {
		equippedIds.add(skillId);
	}
	const equippedSkills = learned.filter((skill) => {
		return skill && equippedIds.has(skill.id);
	});
	return equippedSkills;
};
/**
* Assigns a skill to a slot entry, updating both the slots array and the slot map.
* @param {number} index - The slot index to assign to.
* @param {number} skillId - The id of the skill to assign.
*/
Game_Actor.prototype.assignSlot = function(index, skillId) {
	const skillEquipSlot = new SkillEquipSlot(index, skillId);
	this.slots()[index] = skillEquipSlot;
	this.slotMap().set(index, skillId);
};
/**
* Removes the slot entry at the given index from both the slots array and the slot map.
* @param {number} index - The slot index to remove.
*/
Game_Actor.prototype.deleteSlot = function(index) {
	delete this.slots()[index];
	this.slotMap().delete(index);
};
/**
* Equips a skill to a slot after validating that the actor can afford the cost.
* @param {number} slotIndex - The index of the slot to equip into.
* @param {number} skillId - The id of the skill to equip.
*/
Game_Actor.prototype.equipSkillToSlot = function(slotIndex, skillId) {
	if (this.canEquipSkillToSlot(slotIndex, skillId) === false) return;
	this.updateEquipSkillSlot(slotIndex, skillId);
	this.onSkillEquipChange(slotIndex, skillId);
};
/**
* Determines whether a skill can be equipped into the given slot by this actor.
* @param {number} slotIndex - The index of the slot to check.
* @param {number} skillId - The id of the skill to check.
* @returns {boolean}
*/
Game_Actor.prototype.canEquipSkillToSlot = function(slotIndex, skillId) {
	const newCost = this.skillSlotCost(skillId, slotIndex);
	if (newCost <= 0) return true;
	if (this.getEquippedSkillIndex(skillId) !== -1) return true;
	const currentSkillId = this.getSkillIdInSlot(slotIndex);
	if (currentSkillId === skillId) return true;
	const currentCost = this.skillSlotCost(currentSkillId, slotIndex);
	const hypotheticalSpent = this.spentSlotPoints() - currentCost + newCost;
	return hypotheticalSpent <= this.maxSlotPoints();
};
/**
* Resolves the effective slot cost for a skill in a given slot context.
* @param {number} skillId - The id of the skill to resolve the cost for.
* @param {number} slotIndex - The slot index context (reserved for future cost modifiers).
* @returns {number}
*/
Game_Actor.prototype.skillSlotCost = function(skillId, slotIndex) {
	if (skillId <= 0) return 0;
	return this.skill(skillId).slotCost;
};
/**
* Determines if this actor has enough slot points to equip the specified skill.
* @param {number} skillId - The id of the skill to check.
* @returns {boolean}
*/
Game_Actor.prototype.hasEquipSkillPoints = function(skillId) {
	const { slotCost } = this.skill(skillId);
	if (slotCost <= 0) return true;
	if (this.getEquippedSkillIndex(skillId) !== -1) return true;
	return this.hasSufficientSlotPoints(slotCost);
};
/**
* Performs the actual slot assignment for an equip operation, handling displacement
* of existing occupants and de-duplication of the incoming skill.
* @param {number} slotIndex - The target slot index.
* @param {number} skillId - The skill id to place into the slot.
*/
Game_Actor.prototype.updateEquipSkillSlot = function(slotIndex, skillId) {
	const existingSlotIndex = this.getEquippedSkillIndex(skillId);
	if (existingSlotIndex !== -1) {
		this.deleteSlot(existingSlotIndex);
		this.onSkillUnequipChange(existingSlotIndex, skillId);
	}
	const displacedSkillId = this.getSkillIdInSlot(slotIndex);
	if (displacedSkillId > 0) {
		this.onSkillUnequipChange(slotIndex, displacedSkillId);
	}
	this.assignSlot(slotIndex, skillId);
};
/**
* Unequips whatever skill is currently occupying the specified slot.
* @param {number} slotIndex - The index of the slot to clear.
*/
Game_Actor.prototype.unequipSkillFromSlot = function(slotIndex) {
	const currentSkillId = this.getSkillIdInSlot(slotIndex);
	if (currentSkillId === 0) return;
	this.deleteSlot(slotIndex);
	this.onSkillUnequipChange(slotIndex, currentSkillId);
};
/**
* Unequips the specified skill from whichever slot it currently occupies.
* @param {number} skillId - The id of the skill to unequip.
*/
Game_Actor.prototype.unequipSkill = function(skillId) {
	const index = this.getEquippedSkillIndex(skillId);
	if (index === -1) return;
	this.unequipSkillFromSlot(index);
};
/**
* Moves the skill in one slot into another slot, respecting all point and cost rules.
* @param {number} fromIndex - The source slot index to move from.
* @param {number} toIndex - The destination slot index to move to.
*/
Game_Actor.prototype.moveEquippedSkill = function(fromIndex, toIndex) {
	const skillId = this.getSkillIdInSlot(fromIndex);
	if (skillId === 0) return;
	this.equipSkillToSlot(toIndex, skillId);
	if (this.getSkillIdInSlot(toIndex) === skillId) {
		this.unequipSkillFromSlot(fromIndex);
	}
};
/**
* A hook fired when a skill is successfully equipped to a slot.
* @param {number} slotIndex - The index of the slot that was equipped.
* @param {number} skillId - The id of the skill that was equipped.
*/
Game_Actor.prototype.onSkillEquipChange = function(slotIndex, skillId) {};
/**
* A hook fired when a skill is unequipped from a slot.
* @param {number} slotIndex - The index of the slot that was vacated.
* @param {number} skillId - The id of the skill that was unequipped.
*/
Game_Actor.prototype.onSkillUnequipChange = function(slotIndex, skillId) {};

//#endregion
//#region src/plugins/sks/core/windows/Window_SkillEquipRibbon.js
/**
* A window responsible for showing actor and SKS point summary.
*/
var Window_SkillEquipRibbon = class extends Window_ActorRibbon {
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle for this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Initializes member fields.
	*/
	initMembers() {
		super.initMembers();
	}
	/**
	* Clears and redraws the contents of this window.
	*/
	drawContent() {
		super.drawContent();
		if (!this._actor) return;
		this.drawNameAndPoints();
	}
	/**
	* Draws the actor name and slot info.
	*/
	drawNameAndPoints() {
		const actor = this.actor();
		const [fx, fy] = this.faceCoordinates();
		const [fw] = this.faceSize();
		const nameX = fx + fw + 16;
		const y = fy;
		const name = actor.name();
		const spent = actor.spentSlotPoints();
		const total = actor.maxSlotPoints();
		this.drawText(name, nameX, y, this.contentsWidth() - nameX - 6, "left");
		this.drawText(`${spent}/${total} pts`, 0, y, this.contentsWidth() - 6, "right");
	}
};

//#endregion
//#region src/plugins/sks/core/windows/Window_SkillEquipSlots.js
/**
* The window listing SKS slots for the current actor.
* Uses Window_Command to match Aptitude windows style.
*/
var Window_SkillEquipSlots = class extends Window_Command {
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
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle for this window.
	*/
	constructor(rect) {
		super(rect);
		this.initMembers();
	}
	/**
	* Initializes the members of this window.
	*/
	initMembers() {
		this._actor = null;
		this._visibleSlots = 8;
	}
	/**
	* Gets the actor bound to this window.
	* @returns {Game_Actor|null}
	*/
	actor() {
		return this._actor;
	}
	/**
	* Binds a new actor to this window.
	* @param {Game_Actor} actor The actor to bind.
	*/
	setActor(actor) {
		this._actor = actor;
		this.refresh();
	}
	/**
	* Gets the item (slot entry) at the current index.
	* @returns {{ index:number, skillId:number }|null}
	*/
	item() {
		const cmd = this.commandList().at(this.index());
		if (!cmd) return null;
		return cmd.ext || null;
	}
	/**
	* Gets the preferred visible slot count (unused for building; list scrolls as needed).
	* @returns {number}
	*/
	visibleSlots() {
		return this._visibleSlots;
	}
	/**
	* Sets the preferred visible slot count (note: actual rows derive from actor slots).
	* @param {number} count The number of slots to prefer showing at once.
	*/
	setVisibleSlots(count) {
		this._visibleSlots = count;
		this.refresh();
	}
	/**
	* Rebuilds the command list for the current actor.
	*/
	makeCommandList() {
		if (!this.actor()) return;
		const commands = this.buildCommands();
		commands.forEach(this.addBuiltCommand, this);
	}
	/**
	* Builds all commands for this command window.
	* @returns {BuiltWindowCommand[]}
	*/
	buildCommands() {
		if (!this.actor()) return [];
		const count = this.computeRenderableSlotCount();
		const commands = [];
		for (let slotIndex = 0; slotIndex < count; slotIndex++) {
			commands.push(this.buildCommand(slotIndex));
		}
		return commands;
	}
	/**
	* Builds a single command for the given slot index.
	* @param {number} slotIndex The slot index to build a command for.
	* @returns {BuiltWindowCommand}
	*/
	buildCommand(slotIndex) {
		const skillId = this.actor().getSkillIdInSlot(slotIndex);
		const isEmpty = skillId === 0;
		const name = isEmpty === false ? $dataSkills[skillId].name : "- empty -";
		const iconIndex = isEmpty === false ? $dataSkills[skillId].iconIndex : 0;
		const rightText = isEmpty === false ? `${this.actor().skillSlotCost(skillId, slotIndex)}` : "0";
		const enabled = true;
		const built = new WindowCommandBuilder(name).setSymbol(`slot:${slotIndex}`).setExtensionData({
			index: slotIndex,
			skillId
		}).setIconIndex(iconIndex).setRightText(rightText).setEnabled(enabled).build();
		return built;
	}
	/**
	* Computes how many slot rows to render.
	* Uses the max of: highest equipped slot index + 1, and max slot points.
	* Guarantees at least 1 row.
	* @returns {number}
	*/
	computeRenderableSlotCount() {
		const baseline = Number(this.actor().maxSlotPoints()) || 0;
		let highest = -1;
		const map = this.actor().slotMap();
		for (const [slotIndex] of map) {
			if (slotIndex > highest) {
				highest = slotIndex;
			}
		}
		const occupiedCount = highest + 1;
		const count = Math.max(1, baseline, occupiedCount);
		return count;
	}
};

//#endregion
//#region src/plugins/sks/core/windows/Window_SkillEquipList.js
/**
* A window responsible for listing equippable skills (filtered).
* Uses Window_Command to match Aptitude windows style.
*/
var Window_SkillEquipList = class extends Window_Command {
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
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle for this window.
	*/
	constructor(rect) {
		super(rect);
		this.initMembers();
	}
	/**
	* Initializes internal members.
	*/
	initMembers() {
		this._actor = null;
		this._slotContext = 0;
	}
	/**
	* Gets the actor bound to this window.
	* @returns {Game_Actor|null}
	*/
	actor() {
		return this._actor;
	}
	/**
	* Assigns the actor for this window and refreshes.
	* @param {Game_Actor} actor The actor to assign.
	*/
	setActor(actor) {
		this._actor = actor;
		this.refresh();
	}
	/**
	* Gets the current slot index context for equip checks.
	* @returns {number}
	*/
	slotContext() {
		return this._slotContext;
	}
	/**
	* Sets the slot context for cost checks and refreshes enabling.
	* @param {number} slotIndex The slot index being targeted.
	*/
	setSlotContext(slotIndex) {
		this._slotContext = slotIndex;
		this.refresh();
	}
	/**
	* Gets the current item (skill) at the selection.
	* @returns {RPG_Skill|null}
	*/
	item() {
		const cmd = this.commandList().at(this.index());
		if (!cmd) return null;
		const ext = cmd.ext || { id: 0 };
		const id = ext.id || 0;
		return id > 0 ? $dataSkills[id] : null;
	}
	/**
	* Rebuilds the command list for the current actor.
	*/
	makeCommandList() {
		if (!this.actor()) return;
		const commands = this.buildCommands();
		commands.forEach(this.addBuiltCommand, this);
	}
	/**
	* Builds all commands for this window.
	* Filters the actor's learned skills to those eligible for slot equipping,
	* then sorts by ascending slot cost for the current slot context.
	* @returns {BuiltWindowCommand[]}
	*/
	buildCommands() {
		if (!this.actor()) return [];
		const learned = this.actor().skills();
		const filtered = learned.filter((skill) => {
			if (!skill) return false;
			if (skill.unslotted) return false;
			if (J.EXTEND && skill.isSkillExtension) return false;
			return true;
		}).sort((a, b) => {
			const costA = this.actor().skillSlotCost(a.id, this.slotContext());
			const costB = this.actor().skillSlotCost(b.id, this.slotContext());
			if (costA !== costB) return costA - costB;
			return a.id - b.id;
		});
		const commands = filtered.map(this.buildCommand, this);
		return commands;
	}
	/**
	* Builds a single command for the given skill.
	* @param {RPG_Skill} skill The skill to build the command for.
	* @returns {BuiltWindowCommand}
	*/
	buildCommand(skill) {
		const cost = this.actor().skillSlotCost(skill.id, this.slotContext());
		const enabled = this.actor().canEquipSkillToSlot(this.slotContext(), skill.id);
		const built = new WindowCommandBuilder(skill.name).setSymbol(`skill:${skill.id}`).setExtensionData({ id: skill.id }).setIconIndex(skill.iconIndex).setRightText(`${cost}`).setEnabled(enabled).build();
		return built;
	}
};

//#endregion
//#region src/plugins/sks/core/windows/Window_SkillEquipDetail.js
/**
* A window responsible for showing skill details in SKS context.
*/
var Window_SkillEquipDetail = class extends Window_Base {
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle for this window.
	*/
	constructor(rect) {
		super(rect);
		this.initMembers();
	}
	/**
	* Initializes internal members.
	*/
	initMembers() {
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
		this.refresh();
	}
	/**
	* Assigns the actor for this window.
	* @param {Game_Actor} actor The actor to assign.
	*/
	setActor(actor) {
		this._actor = actor;
		this.refresh();
	}
	/**
	* Sets the skill id being displayed and refreshes.
	* @param {number} skillId The new skill id.
	*/
	setSkillId(skillId) {
		this._skillId = skillId > 0 ? skillId : 0;
		this.refresh();
	}
	/**
	* Gets the current skill being presented.
	* @returns {RPG_Skill|null}
	*/
	skill() {
		if (!this._skillId) return null;
		if (typeof J !== "undefined" && J.EXTEND && this._actor) {
			return OverlayManager.getExtendedSkill(this._actor, this._skillId);
		}
		return $dataSkills[this._skillId];
	}
	/**
	* Clears and redraws contents.
	*/
	refresh() {
		this.contents.clear();
		const skill = this.skill();
		if (!skill) return;
		const iconX = 0;
		const nameX = iconX + ImageManager.iconWidth + 6;
		this.drawIcon(skill.iconIndex, iconX, 0);
		this.drawText(skill.name, nameX, 0, this.contentsWidth() - nameX, "left");
		const lineH = this.lineHeight();
		let y = lineH + 4;
		this.drawHorzLine(y - 2);
		const mpCost = skill.mpCost || 0;
		const tpCost = skill.tpCost || 0;
		const slotCost = this._actor ? this._actor.skillSlotCost(skill.id, 0) : J.SKS.Metadata.defaultSkillSlotCost || 1;
		this.drawText(`MP: ${mpCost}`, 0, y, 120, "left");
		this.drawText(`TP: ${tpCost}`, 120, y, 120, "left");
		this.drawText(`Slot: ${slotCost}`, 240, y, 160, "left");
		y += lineH + 2;
		const desc = skill.description || String.empty;
		const descWidth = this.contentsWidth() - 6;
		const textLines = this.convertEscapeCharacters(desc).split(/\n/g);
		let drawY = y;
		textLines.forEach((line) => {
			this.drawTextEx(line, 0, drawY, descWidth);
			drawY += lineH;
		});
	}
	/**
	* Draws a thin horizontal line across the window.
	* @param {number} y The y coordinate to draw at.
	*/
	drawHorzLine(y) {
		const lineWidth = this.contentsWidth();
		const color = this.systemColor();
		this.drawRect(0, y, lineWidth, 2, color);
	}
};

//#endregion
//#region src/plugins/sks/core/scenes/Scene_SkillEquip.js
/**
* The scene for viewing and managing skill equip slots.
*/
var Scene_SkillEquip = class extends Scene_MenuBase {
	/**
	* Pushes this current scene onto the stack, forcing it into action.
	*/
	static callScene() {
		SceneManager.push(this);
	}
	/**
	* Extends {@link #initMembers}.<br/>
	* Also initializes the SKS members.
	*/
	initMembers() {
		super.initMembers();
		this.initCoreMembers();
		this.initPrimaryMembers();
	}
	/**
	* Initializes the core SKS members.
	*/
	initCoreMembers() {
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
	initPrimaryMembers() {
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
	/**
	* Gets the currently focused slot index.
	* @returns {number}
	*/
	focusedSlotIndex() {
		return this._j._sks._focusedSlotIndex;
	}
	/**
	* Sets the currently focused slot index.
	* @param {number} index - The slot index to focus.
	*/
	setFocusedSlotIndex(index) {
		this._j._sks._focusedSlotIndex = index;
	}
	/**
	* Gets the last-known slot index for change detection.
	* @returns {number}
	*/
	lastSlotIndex() {
		return this._j._sks._lastSlotIndex;
	}
	/**
	* Sets the last-known slot index.
	* @param {number} index - The slot index to record.
	*/
	setLastSlotIndex(index) {
		this._j._sks._lastSlotIndex = index;
	}
	/**
	* Gets the last-known skill index for change detection.
	* @returns {number}
	*/
	lastSkillIndex() {
		return this._j._sks._lastSkillIndex;
	}
	/**
	* Sets the last-known skill index.
	* @param {number} index - The skill index to record.
	*/
	setLastSkillIndex(index) {
		this._j._sks._lastSkillIndex = index;
	}
	/**
	* Initialize all resources required for this scene.
	*/
	create() {
		super.create();
		this.createDisplayObjects();
	}
	/**
	* Creates the display objects for this scene.
	*/
	createDisplayObjects() {
		this.createAllWindows();
	}
	/**
	* Creates all windows for this scene.
	*/
	createAllWindows() {
		this.createRibbonWindow();
		this.createSlotsWindow();
		this.createSkillsListWindow();
		this.createDetailWindow();
		this.wireWindows();
		this.initializeView();
	}
	/**
	* Creates the ribbon window across the top.
	*/
	createRibbonWindow() {
		const rect = this.ribbonWindowRect();
		const win = new Window_SkillEquipRibbon(rect);
		win.setActor(this.actor());
		this._j._sks._windows._ribbon = win;
		this.addWindow(win);
	}
	/**
	* Builds the rectangle for the ribbon window across the top.
	* @returns {Rectangle}
	*/
	ribbonWindowRect() {
		const ww = Graphics.boxWidth;
		const wh = this.calcWindowHeight(1, false);
		const wx = 0;
		const wy = this.mainAreaTop();
		return new Rectangle(wx, wy, ww, wh);
	}
	/**
	* Gets the ribbon window.
	* @returns {Window_SkillEquipRibbon|null}
	*/
	ribbonWindow() {
		return this._j._sks._windows._ribbon;
	}
	/**
	* Creates the slots window on the left side.
	*/
	createSlotsWindow() {
		const rect = this.slotsWindowRect();
		const win = new Window_SkillEquipSlots(rect);
		win.setActor(this.actor());
		win.setHandler("ok", this.onSlotOk.bind(this));
		win.setHandler("cancel", this.onSlotCancel.bind(this));
		win.setHandler("more", this.onSlotUnequip.bind(this));
		win.setHandler("pageup", this.onCycleActorLeft.bind(this));
		win.setHandler("pagedown", this.onCycleActorRight.bind(this));
		this._j._sks._windows._slots = win;
		this.addWindow(win);
	}
	/**
	* Builds the rectangle for the slots window on the left.
	* @returns {Rectangle}
	*/
	slotsWindowRect() {
		const totalHeight = this.mainAreaHeight() - this.ribbonWindowRect().height;
		const ww = 420;
		const wh = totalHeight;
		const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
		const wy = this.ribbonWindowRect().y + this.ribbonWindowRect().height;
		return new Rectangle(wx, wy, ww, wh);
	}
	/**
	* Gets the slots window.
	* @returns {Window_SkillEquipSlots|null}
	*/
	slotsWindow() {
		return this._j._sks._windows._slots;
	}
	/**
	* Creates the skills list window on the right side.
	*/
	createSkillsListWindow() {
		const rect = this.skillsListWindowRect();
		const win = new Window_SkillEquipList(rect);
		win.setActor(this.actor());
		win.setHandler("ok", this.onSkillOk.bind(this));
		win.setHandler("cancel", this.onSkillCancel.bind(this));
		this._j._sks._windows._skills = win;
		this.addWindow(win);
	}
	/**
	* Builds the rectangle for the skills list window on the right.
	* @returns {Rectangle}
	*/
	skillsListWindowRect() {
		const wx = this.isRightInputMode() ? 0 : this.slotsWindowRect().x + this.slotsWindowRect().width;
		const ww = Graphics.boxWidth - this.slotsWindowRect().width;
		const remainingHeight = this.mainAreaHeight() - this.ribbonWindowRect().height;
		const wh = Math.floor(remainingHeight * .6);
		const wy = this.ribbonWindowRect().y + this.ribbonWindowRect().height;
		return new Rectangle(wx, wy, ww, wh);
	}
	/**
	* Gets the skills list window.
	* @returns {Window_SkillEquipList|null}
	*/
	skillsWindow() {
		return this._j._sks._windows._skills;
	}
	/**
	* Creates the detail window beneath the skills list.
	*/
	createDetailWindow() {
		const rect = this.detailWindowRect();
		const win = new Window_SkillEquipDetail(rect);
		win.setActor(this.actor());
		this._j._sks._windows._detail = win;
		this.addWindow(win);
	}
	/**
	* Builds the rectangle for the detail window beneath the skills list.
	* @returns {Rectangle}
	*/
	detailWindowRect() {
		const wx = this.skillsListWindowRect().x;
		const ww = this.skillsListWindowRect().width;
		const wh = this.mainAreaHeight() - this.ribbonWindowRect().height - this.skillsListWindowRect().height;
		const wy = this.skillsListWindowRect().y + this.skillsListWindowRect().height;
		return new Rectangle(wx, wy, ww, wh);
	}
	/**
	* Gets the detail window.
	* @returns {Window_SkillEquipDetail|null}
	*/
	detailWindow() {
		return this._j._sks._windows._detail;
	}
	/**
	* Extends {@link #update}.<br/>
	* Also watches window indices and keeps dependent windows in sync.
	*/
	update() {
		super.update();
		this.updateSlotDetails();
		this.updateSkillDetails();
	}
	/**
	* Updates the skills list context and detail window based on the current slot selection.
	*/
	updateSlotDetails() {
		const slotIndex = this.slotsWindow().index();
		if (slotIndex === this.lastSlotIndex()) return;
		this.setLastSlotIndex(slotIndex);
		this.skillsWindow().setSlotContext(slotIndex);
		const idInSlot = this.actor().getSkillIdInSlot(slotIndex);
		this.detailWindow().setSkillId(idInSlot);
	}
	/**
	* Updates the detail window based on the current skill selection.
	*/
	updateSkillDetails() {
		const skillIndex = this.skillsWindow().index();
		if (skillIndex === this.lastSkillIndex()) return;
		this.setLastSkillIndex(skillIndex);
		const skill = this.skillsWindow().item();
		const id = skill ? skill.id : 0;
		if (id > 0) {
			this.detailWindow().setSkillId(id);
		}
	}
	/**
	* Extends {@link #onActorChange}.<br/>
	* Also refreshes all SKS windows when the actor changes.
	*/
	onActorChange() {
		super.onActorChange();
		const updatedActor = this.actor();
		this.rebindAllWindowsToActor(updatedActor);
		this.refreshAll();
		this.slotsWindow().select(0);
		this.slotsWindow().activate();
		this.skillsWindow().deactivate();
	}
	/**
	* Handles confirming a slot selection.
	*/
	onSlotOk() {
		this.setFocusedSlotIndex(this.slotsWindow().index());
		this.slotsWindow().deactivate();
		this.skillsWindow().activate();
		this.skillsWindow().select(0);
		const firstItem = this.skillsWindow().item();
		const firstId = firstItem ? firstItem.id : 0;
		this.detailWindow().setSkillId(firstId);
	}
	/**
	* Handles canceling from the slot selection.
	*/
	onSlotCancel() {
		this.popScene();
	}
	/**
	* Handles the "more" action from the slot selection.
	* Unequips the skill in the currently focused slot, if one is equipped.
	*/
	onSlotUnequip() {
		const entry = this.slotsWindow().item();
		const isFilled = entry.skillId > 0;
		if (isFilled === false) {
			this.slotsWindow().activate();
			return;
		}
		this.actor().unequipSkillFromSlot(entry.index);
		this.refreshAll();
		this.slotsWindow().activate();
	}
	/**
	* Handles confirming a skill selection for the focused slot.
	*/
	onSkillOk() {
		const slotIndex = this.focusedSlotIndex();
		const skill = this.skillsWindow().item();
		this.actor().equipSkillToSlot(slotIndex, skill.id);
		this.refreshAll();
		this.skillsWindow().deactivate();
		this.slotsWindow().activate();
	}
	/**
	* Handles canceling from the skills list.
	*/
	onSkillCancel() {
		this.skillsWindow().deactivate();
		this.slotsWindow().activate();
		const skillIdInSlot = this.actor().getSkillIdInSlot(this.slotsWindow().index());
		this.detailWindow().setSkillId(skillIdInSlot);
	}
	/**
	* Cycles to the previous actor.
	*/
	onCycleActorLeft() {
		this.previousActor();
	}
	/**
	* Cycles to the next actor.
	*/
	onCycleActorRight() {
		this.nextActor();
	}
	/**
	* Applies the initial selection and focus state for the scene.
	*/
	initializeView() {
		this.slotsWindow().select(0);
		this.slotsWindow().activate();
		this.skillsWindow().deactivate();
	}
	/**
	* Wires the initial context between windows after all are created.
	*/
	wireWindows() {
		this.skillsWindow().setSlotContext(this.slotsWindow().index());
		const skillIdInSlot = this.actor().getSkillIdInSlot(this.slotsWindow().index());
		this.detailWindow().setSkillId(skillIdInSlot);
	}
	/**
	* Rebinds all scene windows to the provided actor.
	* @param {Game_Actor} actor - The actor to bind to all windows.
	*/
	rebindAllWindowsToActor(actor) {
		this.ribbonWindow().setActor(actor);
		this.slotsWindow().setActor(actor);
		this.skillsWindow().setActor(actor);
		this.detailWindow().setActor(actor);
	}
	/**
	* Refreshes all windows in the scene.
	*/
	refreshAll() {
		this.ribbonWindow().refresh();
		this.slotsWindow().refresh();
		this.skillsWindow().setSlotContext(this.slotsWindow().index());
		this.skillsWindow().refresh();
		const currentSkill = this.skillsWindow().item();
		const skillId = currentSkill ? currentSkill.id : this.actor().getSkillIdInSlot(this.slotsWindow().index());
		this.detailWindow().setSkillId(skillId);
	}
};

//#endregion
//#region src/plugins/sks/core/_metadata/pluginCommands.js
/**
* Plugin command for modifying slot points for all current party members.
*/
PluginManager.registerCommand(J.SKS.Metadata.name, "mod-slot-points-party", (args) => {
	const parsedPoints = parseInt(args.points);
	$gameParty.members().forEach((member) => {
		member.modifyMaxSlotPoints(parsedPoints);
	});
});

//#endregion
//# sourceMappingURL=J-SkillSlots.js.map