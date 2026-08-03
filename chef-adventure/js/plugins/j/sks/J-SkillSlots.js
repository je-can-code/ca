//region annotations
/*:
 * @target MZ
 * @plugindesc [v1.5.0 SKS] A plugin enabling actors to equip skills into dedicated skill slots.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin enables actors to equip skills into dedicated skill slots using
 * a point-budget system. Each actor has a number of slots and a pool of slot
 * points; skills occupy a slot and cost points to equip, and only skills of
 * the configured equippable types appear in the equip scene.
 *
 * Integrates with others of mine plugins:
 * - J-Base; required by all my plugins.
 * - J-Passive; equipping a passive skill activates its perpetual state effect.
 *
 * ----------------------------------------------------------------------------
 * DETAILS
 * Each actor has both a maximum number of slots (maxSlots) and a maximum
 * number of slot points (maxSlotPoints). These are two independent capacities:
 * slots limit how many skills can be equipped at once regardless of cost, and
 * points limit how much those equipped skills can collectively cost. Skills
 * that belong to the configured equippable skill types can be placed into
 * slots, each consuming a number of slot points equal to their slot cost. The
 * player manages equipped skills through the SKS equip scene, accessible from
 * the menu when the configured menu switch is ON.
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
 * UNSLOTTED SKILLS
 * Want a specific actor/class (or any other note source) to treat a normally-
 * slottable skill as perpetually active for them specifically, without making
 * that skill unslotted for everyone else? By applying the appropriate tag,
 * you can grant a per-battler exemption from the slot requirement- the skill
 * still costs a slot for any other actor who has to learn-then-equip it
 * through the normal pipeline.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armor
 * - States
 *
 * TAG FORMAT:
 *  <unslottedSkills:[SKILL_ID, SKILL_ID, ...]>
 *    Where each SKILL_ID is exempted from the slot requirement for this
 *    battler, regardless of that skill's own <unslotted> tag or type.
 *
 * TAG EXAMPLES:
 *  <unslottedSkills:[901,902]>
 * This actor/class always has skills 901 and 902 active, without spending a
 * slot on either- e.g. a class with native weapon access to two weapon types.
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
 * BASE SLOTS / BASE SLOT POINTS
 * Want to control how many slots or slot points an actor has innately, and
 * have that scale as they grow? By applying the appropriate tag to an actor
 * or their class, you can define a formula-driven baseline for either
 * capacity. When neither the actor nor their class carries the tag, the
 * plugin's configured default is used instead.
 *
 * These formulas have access to "a" (the actor) and "v" (the game's
 * variables), so growth curves can reference things like the actor's level.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 *
 * TAG FORMAT:
 *  <baseSlots:[FORMULA]>
 *    Where FORMULA computes the actor's baseline slot count.
 *  <baseSlotPoints:[FORMULA]>
 *    Where FORMULA computes the actor's baseline slot point budget.
 *
 * TAG EXAMPLES:
 *  <baseSlots:[4]>
 * This actor/class has a flat baseline of 4 slots.
 *
 *  <baseSlotPoints:[6 + (a.level * 0.5)]>
 * This actor/class's baseline slot points grow by half a point per level,
 * starting from a base of 6.
 *
 * ============================================================================
 * MAX SLOTS / MAX SLOT POINTS
 * Want to grant bonus slots or slot points from equipment, states, or other
 * sources? By applying the appropriate tag across the various database
 * locations, you can add to an actor's baseline capacity. Unlike the base
 * tags, these stack additively across every source found.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armor
 * - States
 *
 * TAG FORMAT:
 *  <maxSlots:[FORMULA]>
 *    Where FORMULA computes a bonus to the actor's slot count.
 *  <maxSlotPoints:[FORMULA]>
 *    Where FORMULA computes a bonus to the actor's slot point budget.
 *
 * TAG EXAMPLES:
 *  <maxSlots:[1]>
 * This source grants +1 bonus slot while active/equipped.
 *
 *  <maxSlotPoints:[-2]>
 * This source reduces the actor's slot point budget by 2 while active.
 *
 * ============================================================================
 * EXCLUSIVE MODE
 * By default, equipping a skill is gated by both slot count AND slot points
 * together (tandem mode) - a skill must fit within both the remaining slot
 * count and the remaining point budget to be equipped. If you'd rather only
 * one of those two capacities matter, turn on Exclusive Mode and choose which
 * one governs equipping via the Slots Only config.
 *
 * When Exclusive Mode is ON and Slots Only is ON, only slot count matters -
 * slot points are never checked, so an actor can equip anything as long as a
 * slot is physically available (a la Digital Devil Saga's skill system).
 *
 * When Exclusive Mode is ON and Slots Only is OFF, only slot points matter -
 * slot count is never checked, so an actor can equip anything as long as the
 * point budget allows it, regardless of how many slots that occupies (a la
 * Final Fantasy IX's passive ability system).
 *
 * When Exclusive Mode is OFF, Slots Only has no effect; tandem mode applies.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.5.0
 *    Routed the _sks namespace into its own save section, so equipped skill
 *    slots land in systems/sks.json rather than inside the actor blobs.
 * - 1.4.0
 *    Retrofitted the skill equip scene onto the shared actor skeleton, so it
 *    matches the other actor-scoped scenes.
 *    Command windows now seed state in initMembers, early enough for
 *    makeCommandList to see it.
 * - 1.3.0
 *    Added per-battler unslotted-skill exemptions via <unslottedSkills:[...]>.
 *    Stale slot entries are now automatically cleared when the actor no
 *    longer knows the skill occupying them.
 * - 1.2.0
 *    Added Exclusive Mode, letting slot count or slot points alone gate
 *    equipping instead of requiring both. Enforced slot count as a real
 *    limit on equipping rather than a display-only limit in the equip scene.
 * - 1.1.0
 *    Promoted maxSlots and maxSlotPoints to independent, notetag-driven stats.
 *    Removed the mod-slot-points-party plugin command.
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
 * @param default-max-slots
 * @parent parentConfig
 * @type number
 * @text Default Max Slots
 * @desc The baseline number of skill slots an actor has when no <baseSlots:...> tag is found on the actor or class.
 * @default 4
 *
 * @param default-max-slot-points
 * @parent parentConfig
 * @type number
 * @text Default Max Slot Points
 * @desc The baseline slot point budget an actor has when no <baseSlotPoints:...> tag is found on the actor or class.
 * @default 4
 *
 * @param enable-exclusive-mode
 * @parent parentConfig
 * @type boolean
 * @text Enable Exclusive Mode
 * @desc When ON, only slot count OR slot points gate equipping (see Slots Only), never both together.
 * @on Exclusive
 * @off Tandem
 * @default false
 *
 * @param slots-only
 * @parent parentConfig
 * @type boolean
 * @text Slots Only (Exclusive Mode)
 * @desc Only used when Exclusive Mode is ON. ON means only slot count is checked (points ignored); OFF means only slot points are checked (count ignored).
 * @on Slots Only
 * @off Points Only
 * @default false
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
		* The baseline number of skill slots an actor has when neither the actor nor their class
		* carries a {@link J.SKS.RegExp.BaseSlots} tag.
		* @type {number}
		*/
		this.defaultMaxSkillSlots = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["default-max-slots"], 4);
		/**
		* The baseline slot point budget an actor has when neither the actor nor their class
		* carries a {@link J.SKS.RegExp.BaseSlotPoints} tag.
		* @type {number}
		*/
		this.defaultMaxSkillSlotPoints = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["default-max-slot-points"], 4);
		/**
		* The default cost of a skill for a skill slot.
		* @type {number}
		*/
		this.defaultSkillSlotCost = 1;
		/**
		* Whether or not exclusive mode is enabled. When enabled, only one of slot count or
		* slot points gates equipping (per {@link #slotsOnly}), rather than both together.
		* @type {boolean}
		*/
		this.enableExclusiveMode = this.parsedPluginParameters["enable-exclusive-mode"] === "true";
		/**
		* Which capacity governs equipping while {@link #enableExclusiveMode} is on.
		* True means only slot count matters; false means only slot points matter.
		* Has no effect when {@link #enableExclusiveMode} is false.
		* @type {boolean}
		*/
		this.slotsOnly = this.parsedPluginParameters["slots-only"] === "true";
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
J.SKS.Metadata = new JSkillSlots_PluginMetadata("J-SkillSlots", "1.5.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.SKS.Aliased = {};
J.SKS.Aliased.Game_Actor = new Map();
J.SKS.Aliased.Scene_Menu = new Map();
J.SKS.Aliased.Window_MenuCommand = new Map();
/**
* All regular expressions used by this plugin.
*/
J.SKS.RegExp = {};
J.SKS.RegExp.SlotCost = /<slotCost:[ ]?(-?\d+)>/i;
J.SKS.RegExp.Unslotted = /<unslotted>/i;
J.SKS.RegExp.SlotCostModifier = /<slotCostModifier:[ ]?(-?\d+)>/i;
J.SKS.RegExp.BaseSlots = /<baseSlots:\[([+\-*/ ().\w]+)]>/gi;
J.SKS.RegExp.BaseSlotPoints = /<baseSlotPoints:\[([+\-*/ ().\w]+)]>/gi;
J.SKS.RegExp.MaxSlots = /<maxSlots:\[([+\-*/ ().\w]+)]>/gi;
J.SKS.RegExp.MaxSlotPoints = /<maxSlotPoints:\[([+\-*/ ().\w]+)]>/gi;
J.SKS.RegExp.UnslottedSkills = /<unslottedSkills:[ ]?(\[[\d, ]+])>/i;

//#endregion
//#region src/plugins/sks/core/_models/SkillEquipSlot.js
/**
* One equipped skill occupying a slot on an actor's skill-equip bar.
* Serialized into save data via {@link JsonEx}; registered so bundled restores keep prototype methods.
*/
var SkillEquipSlot = class {
	/**
	* Constructor.
	* @param {number} index The index of the slot this entry occupies.
	* @param {number} skillId The id of the skill equipped in this slot.
	*/
	constructor(index, skillId) {
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
};
SerializableRegistry.register(SkillEquipSlot);

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
	* The cached set of skill ids exempted from the slot requirement for this battler
	* specifically, per {@link J.SKS.RegExp.UnslottedSkills}. Null until first computed,
	* and invalidated back to null whenever {@link #onBattlerDataChange} fires.
	* @type {Set<number>|null}
	*/
	this._j._sks._forcedUnslottedSkillIds = null;
};
/**
* Extends {@link #onBattlerDataChange}.<br/>
* Invalidates the forced-unslotted-skills cache and prunes any slot that no longer
* holds a skill this actor actually knows, since whatever changed (equip, class,
* state, level) may have altered either.
*/
J.SKS.Aliased.Game_Actor.set("onBattlerDataChange", Game_Actor.prototype.onBattlerDataChange);
Game_Actor.prototype.onBattlerDataChange = function() {
	J.SKS.Aliased.Game_Actor.get("onBattlerDataChange").call(this);
	this._j._sks._forcedUnslottedSkillIds = null;
	this.pruneStaleSlots();
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
* Gets the maximum number of skill slots available to this actor.
* Baseline comes from a {@link J.SKS.RegExp.BaseSlots} tag on the actor or class, falling back to
* the plugin's configured default when neither carries the tag. Bonus amounts from
* {@link J.SKS.RegExp.MaxSlots} tags anywhere in {@link #getAllNotes} stack on top of that baseline.
* @returns {number}
*/
Game_Actor.prototype.maxSlots = function() {
	const baseline = RPGManager.getResultsFromAllNotesByRegex(this.getActorNotes(), J.SKS.RegExp.BaseSlots, 0, this, true) ?? J.SKS.Metadata.defaultMaxSkillSlots;
	const bonus = RPGManager.getResultsFromAllNotesByRegex(this.getAllNotes(), J.SKS.RegExp.MaxSlots, 0, this, false);
	return Math.max(0, baseline + bonus);
};
/**
* Gets the maximum number of slot points available to this actor.
* Baseline comes from a {@link J.SKS.RegExp.BaseSlotPoints} tag on the actor or class, falling back
* to the plugin's configured default when neither carries the tag. Bonus amounts from
* {@link J.SKS.RegExp.MaxSlotPoints} tags anywhere in {@link #getAllNotes} stack on top of that
* baseline.
* @returns {number}
*/
Game_Actor.prototype.maxSlotPoints = function() {
	const baseline = RPGManager.getResultsFromAllNotesByRegex(this.getActorNotes(), J.SKS.RegExp.BaseSlotPoints, 0, this, true) ?? J.SKS.Metadata.defaultMaxSkillSlotPoints;
	const bonus = RPGManager.getResultsFromAllNotesByRegex(this.getAllNotes(), J.SKS.RegExp.MaxSlotPoints, 0, this, false);
	return Math.max(0, baseline + bonus);
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
* Gets the set of skill ids exempted from the slot requirement for this battler
* specifically, per {@link J.SKS.RegExp.UnslottedSkills} tags found anywhere across
* {@link #getAllNotes}. Unlike a skill's own {@link RPG_Skill#unslotted} tag, this
* exemption applies only to this battler- the same skill still costs a slot for
* anyone who has to learn-then-equip it through the normal pipeline. Cached until
* {@link #onBattlerDataChange} invalidates it.
* @returns {Set<number>}
*/
Game_Actor.prototype.forcedUnslottedSkillIds = function() {
	if (this._j._sks._forcedUnslottedSkillIds !== null) return this._j._sks._forcedUnslottedSkillIds;
	const arraysFound = RPGManager.getArraysFromAllNotesByRegex(this.getAllNotes(), J.SKS.RegExp.UnslottedSkills, true, false) ?? [];
	this._j._sks._forcedUnslottedSkillIds = new Set(arraysFound.flat());
	return this._j._sks._forcedUnslottedSkillIds;
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
* Gating depends on the plugin's configured mode: by default both slot count and
* slot points must permit the equip (tandem mode); when exclusive mode is enabled,
* only one of those two capacities is checked at all, per {@link J.SKS.Metadata.slotsOnly}.
* @param {number} slotIndex - The index of the slot to check.
* @param {number} skillId - The id of the skill to check.
* @returns {boolean}
*/
Game_Actor.prototype.canEquipSkillToSlot = function(slotIndex, skillId) {
	if (this.getEquippedSkillIndex(skillId) !== -1) return true;
	const currentSkillId = this.getSkillIdInSlot(slotIndex);
	if (currentSkillId === skillId) return true;
	const pointsOk = this.canAffordSkillSlotPoints(slotIndex, skillId, currentSkillId);
	const countOk = this.canAffordSkillSlotCount(currentSkillId);
	if (J.SKS.Metadata.enableExclusiveMode) {
		return J.SKS.Metadata.slotsOnly ? countOk : pointsOk;
	}
	return pointsOk && countOk;
};
/**
* Determines whether this actor has enough slot points to place the given skill
* into the given slot, accounting for whatever skill is being displaced.
* @param {number} slotIndex - The index of the slot being targeted.
* @param {number} skillId - The id of the incoming skill.
* @param {number} currentSkillId - The id of the skill currently occupying the slot, or 0 if empty.
* @returns {boolean}
*/
Game_Actor.prototype.canAffordSkillSlotPoints = function(slotIndex, skillId, currentSkillId) {
	const newCost = this.skillSlotCost(skillId, slotIndex);
	if (newCost <= 0) return true;
	const currentCost = this.skillSlotCost(currentSkillId, slotIndex);
	const hypotheticalSpent = this.spentSlotPoints() - currentCost + newCost;
	return hypotheticalSpent <= this.maxSlotPoints();
};
/**
* Determines whether this actor has room for one more occupied slot, unless the
* target slot is already occupied- in which case no new slot usage is introduced.
* @param {number} currentSkillId - The id of the skill currently occupying the target slot, or 0 if empty.
* @returns {boolean}
*/
Game_Actor.prototype.canAffordSkillSlotCount = function(currentSkillId) {
	const isNewSlotUsage = currentSkillId === 0;
	return isNewSlotUsage === false || this.hasSufficientSlotCount();
};
/**
* Determines if this actor has an available slot beyond what is currently occupied.
* @returns {boolean}
*/
Game_Actor.prototype.hasSufficientSlotCount = function() {
	return this.slotMap().size < this.maxSlots();
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
* Unequips every slot whose skill this actor no longer actually knows- e.g. after a
* class change or state removal takes away access to something that was equipped.
* Left in place, a stale slot would keep pointing at a skill the actor can't use.
*/
Game_Actor.prototype.pruneStaleSlots = function() {
	const occupiedIndices = [...this.slotMap().keys()];
	occupiedIndices.forEach((slotIndex) => {
		const skillId = this.getSkillIdInSlot(slotIndex);
		if (this.hasSkill(skillId)) return;
		this.unequipSkillFromSlot(slotIndex);
	});
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
	* Gets the actor.
	* @returns {*} The actor.
	*/
	actor() {
		return this._actor;
	}
	/**
	* Clears and redraws the contents of this window.
	*/
	drawContent() {
		super.drawContent();
		if (!this.actor()) return;
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
		this.drawText(name, nameX, y, this.contentsWidth() - nameX - 6, "left");
		this.drawText(this.capacitySummaryText(actor), 0, y, this.contentsWidth() - 6, "right");
	}
	/**
	* Builds the capacity summary text for the given actor, matching whichever
	* capacity the plugin's configured mode actually gates equipping by.
	* @param {Game_Actor} actor - The actor to summarize.
	* @returns {string}
	*/
	capacitySummaryText(actor) {
		if (J.SKS.Metadata.enableExclusiveMode && J.SKS.Metadata.slotsOnly) {
			return `${actor.slotMap().size}/${actor.maxSlots()} slots`;
		}
		return `${actor.spentSlotPoints()}/${actor.maxSlotPoints()} pts`;
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
	* Constructor.
	* @param {Rectangle} rect The rectangle for this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Implements {@link Window_Command.initMembers}.<br/>
	* Initializes the members of this window.
	*
	* These cannot be class field declarations: JavaScript applies those only after `super()` returns,
	* by which point the command list has already been built from them and found them undefined.
	*/
	initMembers() {
		/**
		* The actor whose equips are being managed.
		* @type {Game_Actor|null}
		*/
		this._actor = null;
		/**
		* The number of visible slots to present.
		* @type {number}
		*/
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
		if (this._visibleSlots === count) return;
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
		const isSlotsOnlyMode = J.SKS.Metadata.enableExclusiveMode && J.SKS.Metadata.slotsOnly;
		let rightText;
		if (isSlotsOnlyMode) {
			rightText = String.empty;
		} else if (isEmpty === false) {
			rightText = `${this.actor().skillSlotCost(skillId, slotIndex)}`;
		} else {
			rightText = "0";
		}
		const enabled = true;
		const built = new WindowCommandBuilder(name).setSymbol(`slot:${slotIndex}`).setExtensionData({
			index: slotIndex,
			skillId
		}).setIconIndex(iconIndex).setRightText(rightText).setEnabled(enabled).build();
		return built;
	}
	/**
	* Computes how many slot rows to render.
	* Uses the max of: highest equipped slot index + 1, and max slots.
	* Guarantees at least 1 row.
	* @returns {number}
	*/
	computeRenderableSlotCount() {
		const maxSlots = this.actor().maxSlots();
		const baseline = Number(maxSlots) || 0;
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
	* Constructor.
	* @param {Rectangle} rect The rectangle for this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Implements {@link Window_Command.initMembers}.<br/>
	* Initializes internal members.
	*
	* These cannot be class field declarations: JavaScript applies those only after `super()` returns,
	* by which point the command list has already been built from them and found them undefined.
	*/
	initMembers() {
		/**
		* The actor whose equips are being managed.
		* @type {Game_Actor|null}
		*/
		this._actor = null;
		/**
		* The current slot index context used for cost checks.
		* @type {number}
		*/
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
		if (this._slotContext === slotIndex) return;
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
			if (this.actor().forcedUnslottedSkillIds().has(skill.id)) return false;
			if (J.EXTEND && skill.isExtension) return false;
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
		const isSlotsOnlyMode = J.SKS.Metadata.enableExclusiveMode && J.SKS.Metadata.slotsOnly;
		const rightText = isSlotsOnlyMode ? String.empty : `${this.actor().skillSlotCost(skill.id, this.slotContext())}`;
		const enabled = this.actor().canEquipSkillToSlot(this.slotContext(), skill.id);
		const built = new WindowCommandBuilder(skill.name).setSymbol(`skill:${skill.id}`).setExtensionData({ id: skill.id }).setIconIndex(skill.iconIndex).setRightText(rightText).setEnabled(enabled).build();
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
	* Gets the actor.
	* @returns {Game_Actor|null} The actor.
	*/
	actor() {
		return this._actor;
	}
	/**
	* Gets the skill id.
	* @returns {number} The skillId.
	*/
	skillId() {
		return this._skillId;
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
		if (!this.skillId()) return null;
		return $dataSkills[this.skillId()];
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
		const slotCost = this.actor() ? this.actor().skillSlotCost(skill.id, 0) : J.SKS.Metadata.defaultSkillSlotCost || 1;
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
*
* Layout is inherited from {@link Scene_ActorFacetBase}, which supplies the actor ribbon and the control
* legend and hands down {@link Scene_ActorFacetBase.contentAreaRect} as the region left over. Within it,
* the slot column takes the same proportional share the sibling facet scenes give their primary list.
*/
var Scene_SkillEquip = class extends Scene_ActorFacetBase {
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
		this.createSlotsWindow();
		this.createSkillsListWindow();
		this.createDetailWindow();
		this.wireWindows();
		this.initializeView();
	}
	/**
	* Overrides {@link Scene_ActorFacetBase.buildActorRibbonWindow}.<br/>
	* Supplies the skill equip ribbon, which shows the actor plus their slot capacity summary.
	*
	* Only the contents differ from the default ribbon; the base decides where it sits and how tall it is.
	* @param {Rectangle} rectangle The rectangle to build the window within.
	* @returns {Window_SkillEquipRibbon}
	*/
	buildActorRibbonWindow(rectangle) {
		return new Window_SkillEquipRibbon(rectangle);
	}
	/**
	* Gets the actor ribbon window under the name this scene refers to it by.
	* @returns {Window_SkillEquipRibbon}
	*/
	ribbonWindow() {
		return this.getActorRibbonWindow();
	}
	/**
	* The proportion of the content area given to the slot column.
	*
	* The same share the sibling facet scenes give their primary list, leaving the remainder for the pool
	* of candidate skills- which needs the room more, since it lists every skill the actor knows.
	* @returns {number}
	*/
	slotColumnRatio() {
		return .4;
	}
	/**
	* Overrides {@link Scene_MenuFacetBase.hasHelpWindow}.<br/>
	* Declines the help strip across the top.
	*
	* This scene already carries a detail panel beneath the candidate list, and its command windows have
	* no help text of their own, so the strip would have sat empty.
	* @returns {boolean}
	*/
	hasHelpWindow() {
		return false;
	}
	/**
	* Implements {@link Scene_MenuFacetBase.controlLegendEntries}.<br/>
	* Describes the controls this scene responds to.
	* @returns {{semantic: (string|string[]), label: string}[]}
	*/
	controlLegendEntries() {
		return [
			{
				semantic: "ok",
				label: "equip"
			},
			{
				semantic: "context",
				label: "unequip"
			},
			{
				semantic: ["actor-prev", "actor-next"],
				label: "switch character"
			},
			{
				semantic: "cancel",
				label: "back"
			}
		];
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
		win.setHandler("context", this.onSlotUnequip.bind(this));
		win.setHandler("actor-prev", this.onCycleActorLeft.bind(this));
		win.setHandler("actor-next", this.onCycleActorRight.bind(this));
		this.setSlotsWindow(win);
		this.addWindow(win);
	}
	/**
	* Builds the rectangle for the slots window on the left.
	* @returns {Rectangle}
	*/
	slotsWindowRect() {
		const contentArea = this.contentAreaRect();
		const ww = Math.round(contentArea.width * this.slotColumnRatio());
		const wx = this.isRightInputMode() ? contentArea.x + contentArea.width - ww : contentArea.x;
		return new Rectangle(wx, contentArea.y, ww, contentArea.height);
	}
	/**
	* Gets the slots window.
	* @returns {Window_SkillEquipSlots|null}
	*/
	slotsWindow() {
		return this._j._sks._windows._slots;
	}
	/**
	* Sets the slots window.
	* @param {Window_SkillEquipSlots} window The window to track.
	*/
	setSlotsWindow(window) {
		this._j._sks._windows._slots = window;
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
		this.setSkillsWindow(win);
		this.addWindow(win);
	}
	/**
	* Builds the rectangle for the skills list window on the right.
	* @returns {Rectangle}
	*/
	skillsListWindowRect() {
		const contentArea = this.contentAreaRect();
		const slotsRect = this.slotsWindowRect();
		const wx = this.isRightInputMode() ? contentArea.x : slotsRect.x + slotsRect.width;
		const ww = contentArea.width - slotsRect.width;
		const wh = Math.floor(contentArea.height * this.skillsListHeightRatio());
		return new Rectangle(wx, contentArea.y, ww, wh);
	}
	/**
	* The proportion of the region's height given to the candidate list, above its detail panel.
	* @returns {number}
	*/
	skillsListHeightRatio() {
		return .6;
	}
	/**
	* Gets the skills list window.
	* @returns {Window_SkillEquipList|null}
	*/
	skillsWindow() {
		return this._j._sks._windows._skills;
	}
	/**
	* Sets the skills list window.
	* @param {Window_SkillEquipList} window The window to track.
	*/
	setSkillsWindow(window) {
		this._j._sks._windows._skills = window;
	}
	/**
	* Creates the detail window beneath the skills list.
	*/
	createDetailWindow() {
		const rect = this.detailWindowRect();
		const win = new Window_SkillEquipDetail(rect);
		win.setActor(this.actor());
		this.setDetailWindow(win);
		this.addWindow(win);
	}
	/**
	* Builds the rectangle for the detail window beneath the skills list.
	* @returns {Rectangle}
	*/
	detailWindowRect() {
		const listRect = this.skillsListWindowRect();
		const contentArea = this.contentAreaRect();
		const wh = contentArea.height - listRect.height;
		return new Rectangle(listRect.x, listRect.y + listRect.height, listRect.width, wh);
	}
	/**
	* Gets the detail window.
	* @returns {Window_SkillEquipDetail|null}
	*/
	detailWindow() {
		return this._j._sks._windows._detail;
	}
	/**
	* Sets the detail window.
	* @param {Window_SkillEquipDetail} window The window to track.
	*/
	setDetailWindow(window) {
		this._j._sks._windows._detail = window;
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
		const slotIndex = this.slotsWindow().index();
		this.setFocusedSlotIndex(slotIndex);
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
	* Handles the "context" action from the slot selection.
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
		const slotIndex = this.slotsWindow().index();
		const skillIdInSlot = this.actor().getSkillIdInSlot(slotIndex);
		this.detailWindow().setSkillId(skillIdInSlot);
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
		const initialSlotIndex = this.slotsWindow().index();
		this.skillsWindow().setSlotContext(initialSlotIndex);
		const firstSlotIndex = this.slotsWindow().index();
		const skillIdInSlot = this.actor().getSkillIdInSlot(firstSlotIndex);
		this.detailWindow().setSkillId(skillIdInSlot);
	}
	/**
	* Rebinds all scene windows to the provided actor.
	* @param {Game_Actor} actor - The actor to bind to all windows.
	*/
	rebindAllWindowsToActor(actor) {
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
		const selectedSlotIndex = this.slotsWindow().index();
		this.skillsWindow().setSlotContext(selectedSlotIndex);
		this.skillsWindow().refresh();
		const currentSkill = this.skillsWindow().item();
		const slotIndex = this.slotsWindow().index();
		const skillId = currentSkill ? currentSkill.id : this.actor().getSkillIdInSlot(slotIndex);
		this.detailWindow().setSkillId(skillId);
	}
};

//#endregion
//#region src/plugins/sks/core/scenes/Scene_Menu.js
/**
* Extends {@link #createCommandWindow}.</br>
* Adds a handler for the Skill Equip menu command.
*/
J.SKS.Aliased.Scene_Menu.set("createCommandWindow", Scene_Menu.prototype.createCommandWindow);
Scene_Menu.prototype.createCommandWindow = function() {
	J.SKS.Aliased.Scene_Menu.get("createCommandWindow").call(this);
	this.commandWindow().setHandler("skill-equip", this.commandSkillEquip.bind(this));
};
/**
* Opens the Skill Equip scene.
*/
Scene_Menu.prototype.commandSkillEquip = function() {
	Scene_SkillEquip.callScene();
};

//#endregion
//#region src/plugins/sks/core/windows/Window_MenuCommand.js
/**
* Extends {@link #addOriginalCommands}.</br>
* Adds the Skill Equip menu command if enabled via plugin parameter.
*/
J.SKS.Aliased.Window_MenuCommand.set("addOriginalCommands", Window_MenuCommand.prototype.addOriginalCommands);
Window_MenuCommand.prototype.addOriginalCommands = function() {
	J.SKS.Aliased.Window_MenuCommand.get("addOriginalCommands").call(this);
	const switchId = J.SKS.Metadata.menuSwitchId;
	if (switchId === 0 || $gameSwitches.value(switchId)) {
		const builtCommand = new WindowCommandBuilder("Skill Equip").setSymbol("skill-equip").setHelpText("Choose which of this character's known skills are active.").setMenuSection(MenuSection.Actor).setIconIndex(78).build();
		this.addBuiltCommand(builtCommand);
	}
};

//#endregion
//#region src/plugins/sks/core/registerSkillSlotsSaveRoutes.js
/**
* Lifts this plugin's slice out of whatever host carries it and into its own section file.
*
* Without this the namespace still saves correctly - it simply rides inline on the host it was
* assigned to, which is where every plugin's state lived before the router existed. Registering
* is what gives J-SkillSlots a file of its own to read.
*
* The namespace check is the one this codebase allows: J-Base-Save is genuinely optional, and
* without it the engine's own save path carries this state inline just as it always did.
*/
if (J.BASE.EXT.SAVE) {
	SaveSectionRouter.registerNamespace("_sks", "sks");
}

//#endregion
//# sourceMappingURL=J-SkillSlots.js.map