//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v2.1.0 PASSIVE] Grants passive states from various database objects.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-DropsControl
 * @base J-CriticalFactors
 * @base J-SDP
 * @base J-Proficiency
 * @base J-NaturalGrowth
 * @base J-Elementalistics
 * @orderAfter J-Base
 * @orderAfter J-DropsControl
 * @orderAfter J-CriticalFactors
 * @orderAfter J-SDP
 * @orderAfter J-Proficiency
 * @orderAfter J-NaturalGrowth
 * @orderAfter J-Elementalistics
 *
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin enables the ability to have a various database objects provide
 * passive effects in the form of states.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * All database objects with notes can now provide the effects of a state
 * within a given scope (usually just a single battler, but in some cases the
 * whole party) to the target by having or equipping said objects. Passive
 * states are simply states that are perpetually in effect while the condition
 * is met, that condition varying depending on the tag.
 *
 * ============================================================================
 * PASSIVE STATES:
 * Have you ever wanted a battler to be able to be in possession of some object
 * like a skill or equipment, and have that object grant passive effects? Well
 * now you can! By adding the correct tags to the various database objects, you
 * too can have passive states!
 *
 * DETAILS:
 * The means of application are specific to what type of database object the
 * tag lives on, as well as the scope of the effect.
 *
 * DETAILS ON-SKILL:
 * If the tag lives on a skill, then the battler only needs to know the skill
 * for it to apply the passive state(s).
 * The effects of this are applied to the battler that knows the skill.
 *
 * DETAILS ON-ITEM/WEAPON/ARMOR:
 * If the tag lives on an item/weapon/armor, then the party only needs to have
 * the object in their possession for it to apply the passive state(s).
 * The effects for this are applied to the entire party.
 *
 * DETAILS ON-ACTOR/ENEMY:
 * If the tag lives on an actor/class/enemy, then the actor or enemy would only
 * need to exist for it to apply the passive state(s).
 * The effects for this are applied only to the battler the tag is on.
 *
 * DETAILS ON-CLASS:
 * If the tag lives on a class, then an actor would need the class to be
 * currently applied for it to apply the passive state(s).
 * The effects for this are applied only to the actor using the class.
 *
 * DETAILS ON-STATE:
 * If the tag lives on a state, then the battler would need to be afflicted
 * with the given state in order to apply the passive state(s).
 * The effects for this are applied only to the battler afflicted with the
 * original state bearing the tag.
 *
 * DETAILS "EQUIPPED" TAG FORMATS:
 * If the "equipped" version of the tags live on an equip, the effects of the
 * passive state(s) will only be applied while it is equipped.
 * The effects for this are applied only to the actor using the class.
 *
 * NOTE ABOUT ADDING/REMOVING PASSIVE STATES:
 * Any states that are added in this manner are tracked as "passive", and thus
 * always active regardless of duration specifications in the database. These
 * states also cannot be removed, cannot be applied/re-applied by normal means
 * while possessing a passive state id of the same state.
 *
 * NOTE ABOUT JABS INTERACTIONS:
 * If using JABS with this plugin, it is important to keep in mind that all
 * formula-based slip effects will use the afflicted battler as both the
 * source AND target battlers in the context of "a" and "b" in the formula.
 *
 * ============================================================================
 * EVENT PASSIVES (MAP EVENTS)
 * Have you ever wanted a map event to force a spawned enemy to have specific
 * passive state ids- without needing to create a duplicate enemy in the
 * database? Well now you can! By applying the passive tag to an event comment,
 * you too can inject passive states onto that spawned battler.
 *
 * TAG USAGE:
 * - Events (Comment commands)
 *
 * TAG FORMAT:
 *  <passive:[STATE_IDS]>
 *    Where STATE_IDS is a comma-delimited list of state ids to be applied.
 *
 * TAG EXAMPLES:
 *  <passive:[10,11]>
 *    Applies passive states 10 and 11 to the battler spawned from this page.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Enemies
 * - Skills
 * - Items
 * - Weapons
 * - Armors
 * - States
 *
 * TAG FORMAT:
 *  <passive:[STATE_IDS]>
 *  <uniquePassive:[STATE_IDS]>
 *  <equippedPassive:[STATE_IDS]>
 *  <uniqueEquippedPassive:[STATE_IDS]>
 * Where STATE_IDS is a comma-delimited list of state ids to be applied.
 *
 * TAG EXAMPLES:
 *  <passive:[10]>
 * If the battler has possession of a database object with this tag, then the
 * state of id 10 is applied.
 *
 *  <passive:[10,11,12]>
 * If the battler has possession of a database object with this tag, then the
 * state ids of 10, 11, and 12, will all be applied.
 *
 *  <passive:[10]>
 *  <passive:[10,11,12]>
 * If a battler had two separate database objects in their possession each
 * bearing one of the above two tags, then the state id of 10 would be applied
 * twice, while 11 and 12 would be applied only once.
 *
 *  <uniquePassive:[10]>
 *  <passive:[10,11,12]>
 * If a battler had two separate database objects in their possession each
 * bearing one of the above two tags, then the state id of 10 would be applied
 * once due to uniqueness, along with 11 and 12 being applied once, too.
 *
 *  <equippedPassive:[10,11]>
 * If the battler has a piece of equipment equipped with this tag, then the
 * state ids of 10 and 11 would be applied. If the battler did not have this
 * equipment equipped, it would do nothing.
 *
 *  <uniqueEquippedPassive:[10]>
 *  <equippedPassive:[10,11,12]>
 * If a battler had two separate equipped equips each bearing one of the above
 * two tags, then the state id of 10 would be applied once due to uniqueness,
 * along with 11 and 12 being applied once, too.
 *
 * ============================================================================
 * HIDE FROM PASSIVES LIST:
 * Stack amplifiers and other implementation-only passive duplicates can stay
 * out of the Passives menu while still contributing traits in combat.
 *
 * TAG USAGE:
 * - States only.
 *
 * TAG FORMAT:
 *  <hideFromPassiveList>
 *
 * ============================================================================
 * CHANGELOG:
 * - 2.1.0
 *    Added Scene_Passive viewer scene with actor ribbon, state list, and semantic detail window.
 *    Detail window uses a three-column layout with labeled sections: Combat, Parameters,
 *    Elements, Ailments, Skills, Equip, Properties, and Rewards.
 *    Parameters section color-codes values green/red; "lower is better" sparams (PDR, MDR,
 *    MCR, TCR, FDR) use inverted color so reductions display green.
 *    Elements section uses element icons as identifiers throughout; Dmg In color is inverted.
 *    J-Natural buff/growth rows display with stat icons, +sign prefix, and /lv suffix.
 *    Formulas evaluate to current numeric values against the viewing actor.
 *    Added Passives command to the main menu with configurable name, icon, and switch.
 *    Added J.PASSIVE.EXT.OTIB — item-to-state passive unlock system with optional DiaLog
 *    integration.
 *    Added J.PASSIVE.EXT.AFFIX — aliases detail window sections to inject JABS-specific
 *    content: slip effects, shield, stacking, resource gains (J-Resources-ABS), and JABS
 *    modifier/timing rows.
 *    Added <hideFromPassiveList> to keep stack amplifiers and other
 *    implementation-only passive duplicates out of the Passives menu while
 *    still contributing traits in combat.
 * - 2.0.2
 *    Added support for passives driven by map events.
 * - 2.0.1
 *    Consumed `RPGManager` updates.
 * - 2.0.0
 *    Refactored the entire passive state implementation.
 *    Added passive states for all database objects with notes.
 *    Added support for only-while-equipped passive states.
 * - 1.1.0
 *    Added passives for items/weapons/armors as well.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 *
 * @param menuSettings
 * @text Menu Settings
 *
 * @param menuSwitch
 * @parent menuSettings
 * @type switch
 * @text Menu Switch ID
 * @desc The switch that controls whether the Passives command appears in the menu.
 * @default 108
 *
 * @param menuCommandName
 * @parent menuSettings
 * @type string
 * @text Menu Name
 * @desc The text shown as the Passives command in the main menu.
 * @default Passives
 *
 * @param menuCommandIcon
 * @parent menuSettings
 * @type number
 * @text Menu Icon
 * @desc The icon index shown beside the Passives command in the menu.
 * @default 191
 */
//endregion Introduction

//#region src/plugins/passive/core/_metadata/_pluginMetadata.js
var JPassive_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br/>
	* Includes translation of plugin parameters.
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
		* The id of a switch that controls whether the Passives command is visible in the menu.
		* A value of 0 means always show, regardless of switch state.
		* Configured via plugin parameter "menuSwitch".
		* @type {number}
		*/
		this.menuSwitchId = parseInt(this.parsedPluginParameters["menuSwitch"]);
		/**
		* The label shown for the Passives command in the main menu.
		* Configured via plugin parameter "menuCommandName".
		* @type {string}
		*/
		this.commandName = this.parsedPluginParameters["menuCommandName"] ?? "Passives";
		/**
		* The icon index shown beside the Passives command in the main menu.
		* Configured via plugin parameter "menuCommandIcon".
		* @type {number}
		*/
		this.commandIconIndex = parseInt(this.parsedPluginParameters["menuCommandIcon"]);
	}
};

//#endregion
//#region src/plugins/passive/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.PASSIVE = {};
/**
* The plugin umbrella that governs all extensions related to this plugin.
*/
J.PASSIVE.EXT = {};
/**
* The `metadata` associated with this plugin, such as version and plugin parameter values.
* @type {JPassive_PluginMetadata}
*/
J.PASSIVE.Metadata = new JPassive_PluginMetadata("J-Passive", "2.1.0");
/**
* All regular expressions used by this plugin.
*/
J.PASSIVE.RegExp = {};
J.PASSIVE.RegExp.EquippedPassiveStateIds = /<equippedPassive:[ ]?(\[[\d, ]+])>/gi;
J.PASSIVE.RegExp.UniqueEquippedPassiveStateIds = /<uniqueEquippedPassive:[ ]?(\[[\d, ]+])>/gi;
J.PASSIVE.RegExp.PassiveStateIds = /<passive:[ ]?(\[[\d, ]+])>/gi;
J.PASSIVE.RegExp.UniquePassiveStateIds = /<uniquePassive:[ ]?(\[[\d, ]+])>/gi;
J.PASSIVE.RegExp.HideFromPassiveList = /<hideFromPassiveList>/gi;
/**
* The collection of all aliased classes for extending.
*/
J.PASSIVE.Aliased = {};
J.PASSIVE.Aliased.DataManager = new Map();
J.PASSIVE.Aliased.Game_Actor = new Map();
J.PASSIVE.Aliased.Game_Battler = new Map();
J.PASSIVE.Aliased.Game_BattlerBase = new Map();
J.PASSIVE.Aliased.Game_Enemy = new Map();
J.PASSIVE.Aliased.Game_Party = new Map();
J.PASSIVE.Aliased.JABS_AiManager = new Map();
J.PASSIVE.Aliased.Scene_Menu = new Map();
J.PASSIVE.Aliased.Window_MenuCommand = new Map();
J.PASSIVE.Aliased.Window_MoreEquipData = new Map();

//#endregion
//#region src/plugins/passive/core/database/RPG_BaseBattler.js
/**
* The passive state ids that this item possesses.
* @type {number[]}
*/
Object.defineProperty(RPG_BaseBattler.prototype, "passiveStateIds", { get: function() {
	return RPGManager.getNumbersFromNoteByRegex(this, J.PASSIVE.RegExp.PassiveStateIds);
} });
/**
* The passive state ids that this item possesses.
* @type {number[]}
*/
Object.defineProperty(RPG_BaseBattler.prototype, "uniquePassiveStateIds", { get: function() {
	return RPGManager.getNumbersFromNoteByRegex(this, J.PASSIVE.RegExp.UniquePassiveStateIds);
} });
/**
* The battler itself cannot be equipped, thus it cannot have equipped passive states.
* @type {Array.empty}
*/
Object.defineProperty(RPG_BaseBattler.prototype, "equippedPassiveStateIds", { get: function() {
	return Array.empty;
} });
/**
* The battler itself cannot be equipped, thus it cannot have equipped passive states.
* @type {Array.empty}
*/
Object.defineProperty(RPG_BaseBattler.prototype, "uniqueEquippedPassiveStateIds", { get: function() {
	return Array.empty;
} });

//#endregion
//#region src/plugins/passive/core/database/RPG_BaseItem.js
/**
* The passive state ids that this item possesses.
* @type {number[]}
*/
Object.defineProperty(RPG_BaseItem.prototype, "passiveStateIds", { get: function() {
	return RPGManager.getNumbersFromNoteByRegex(this, J.PASSIVE.RegExp.PassiveStateIds);
} });
/**
* The non-duplicative passive state ids that this item possesses.
* @type {number[]}
*/
Object.defineProperty(RPG_BaseItem.prototype, "uniquePassiveStateIds", { get: function() {
	return RPGManager.getNumbersFromNoteByRegex(this, J.PASSIVE.RegExp.UniquePassiveStateIds);
} });
/**
* The passive state ids that this equipment will apply while this equip is equipped.
* @type {number[]}
*/
Object.defineProperty(RPG_BaseItem.prototype, "equippedPassiveStateIds", { get: function() {
	return RPGManager.getNumbersFromNoteByRegex(this, J.PASSIVE.RegExp.EquippedPassiveStateIds);
} });
/**
* The non-duplicative passive state ids that this equipment will apply
* while this equip is equipped.
* @type {number[]}
*/
Object.defineProperty(RPG_BaseItem.prototype, "uniqueEquippedPassiveStateIds", { get: function() {
	return RPGManager.getNumbersFromNoteByRegex(this, J.PASSIVE.RegExp.UniqueEquippedPassiveStateIds);
} });

//#endregion
//#region src/plugins/passive/core/database/RPG_Class.js
/**
* The passive state ids that this item possesses.
* @type {number[]}
*/
Object.defineProperty(RPG_Class.prototype, "passiveStateIds", { get: function() {
	return RPGManager.getNumbersFromNoteByRegex(this, J.PASSIVE.RegExp.PassiveStateIds);
} });
/**
* The non-duplicative passive state ids that this item possesses.
* @type {number[]}
*/
Object.defineProperty(RPG_Class.prototype, "uniquePassiveStateIds", { get: function() {
	return RPGManager.getNumbersFromNoteByRegex(this, J.PASSIVE.RegExp.UniquePassiveStateIds);
} });
/**
* The passive state ids that this equipment will apply while this equip is equipped.
* @type {number[]}
*/
Object.defineProperty(RPG_Class.prototype, "equippedPassiveStateIds", { get: function() {
	return RPGManager.getNumbersFromNoteByRegex(this, J.PASSIVE.RegExp.EquippedPassiveStateIds);
} });
/**
* The non-duplicative passive state ids that this equipment will apply
* while this equip is equipped.
* @type {number[]}
*/
Object.defineProperty(RPG_Class.prototype, "uniqueEquippedPassiveStateIds", { get: function() {
	return RPGManager.getNumbersFromNoteByRegex(this, J.PASSIVE.RegExp.UniqueEquippedPassiveStateIds);
} });

//#endregion
//#region src/plugins/passive/core/database/RPG_State.js
/**
* Whether this state row should be omitted from the Passives menu list.<br/>
* Stack amplifiers and other implementation-only passive duplicates stay combat-active via {@link #allStates}.
* @type {boolean}
*/
Object.defineProperty(RPG_State.prototype, "hideFromPassiveList", { get() {
	return RPGManager.checkForBooleanFromNoteByRegex(this, J.PASSIVE.RegExp.HideFromPassiveList);
} });

//#endregion
//#region src/plugins/passive/core/objects/Game_Actor.js
/**
* Extends {@link #onSetup}.<br/>
* Also refreshes the passive states on this battler for the first time.
* @param {number} actorId The battler's id.
*/
J.PASSIVE.Aliased.Game_Actor.set("onSetup", Game_Actor.prototype.onSetup);
Game_Actor.prototype.onSetup = function(actorId) {
	this.refreshPassiveStates(true);
	J.PASSIVE.Aliased.Game_Actor.get("onSetup").call(this, actorId);
};
/**
* Gets all sources from which this battler can derive passive state from.
*
* This does include a reference call to potentially getting passive states, but due
* to control flows, this should always come back with no passive states in the list.
* @returns {(RPG_Actor|RPG_Enemy|RPG_Class|RPG_Skill|RPG_EquipItem|RPG_State)[]}
*/
Game_Actor.prototype.getPassiveStateSources = function() {
	const originalSources = Game_Battler.prototype.getPassiveStateSources.call(this);
	const actorPassiveSources = [...this.equippedEquips(), this.currentClass()];
	const combinedSources = originalSources.concat(actorPassiveSources);
	return combinedSources;
};
/**
* Extends {@link #buildTraitObjects}.<br/>
* When considering traits, also include the actor's and party's passive states.
*
* Returns a fresh array by spreading the base result and appending passives — never
* mutates the base result so the {@link #traitObjects} cache stays safe.
* @returns {(RPG_Actor|RPG_Class|RPG_EquipItem|RPG_State)[]}
*/
J.PASSIVE.Aliased.Game_Actor.set("buildTraitObjects", Game_Actor.prototype.buildTraitObjects);
Game_Actor.prototype.buildTraitObjects = function() {
	const baseObjects = J.PASSIVE.Aliased.Game_Actor.get("buildTraitObjects").call(this);
	return [
		...baseObjects,
		...this.getPassiveStates(),
		...$gameParty.passiveStates()
	];
};
/**
* Extends {@link #learnSkill}.<br/>
* Refreshes passive states after the skill is committed to the actor's skill list.<br/>
* J-Base dispatches {@link #onLearnNewSkill} before the skill is added — too early for skill passives.
*/
J.PASSIVE.Aliased.Game_Actor.set("learnSkill", Game_Actor.prototype.learnSkill);
Game_Actor.prototype.learnSkill = function(skillId) {
	const wasKnown = this.isLearnedSkill(skillId);
	J.PASSIVE.Aliased.Game_Actor.get("learnSkill").call(this, skillId);
	if (wasKnown === false) {
		this.refreshPassiveStates();
	}
};
/**
* Extends {@link #forgetSkill}.<br/>
* Refreshes passive states after the skill is removed from the actor's skill list.<br/>
* J-Base dispatches {@link #onForgetSkill} before the skill is dropped — too early for skill passives.
*/
J.PASSIVE.Aliased.Game_Actor.set("forgetSkill", Game_Actor.prototype.forgetSkill);
Game_Actor.prototype.forgetSkill = function(skillId) {
	const wasKnown = this.isLearnedSkill(skillId);
	J.PASSIVE.Aliased.Game_Actor.get("forgetSkill").call(this, skillId);
	if (wasKnown) {
		this.refreshPassiveStates();
	}
};
/**
* Extends {@link #onEquipChange}.<br/>
* Triggers a refresh of passive states when equipment changes.
*/
J.PASSIVE.Aliased.Game_Actor.set("onEquipChange", Game_Actor.prototype.onEquipChange);
Game_Actor.prototype.onEquipChange = function() {
	J.PASSIVE.Aliased.Game_Actor.get("onEquipChange").call(this);
	this.refreshPassiveStates();
};
/**
* Extends {@link #onClassChange}.<br/>
* Triggers a refresh of passive states when the class changes.
*/
J.PASSIVE.Aliased.Game_Actor.set("onClassChange", Game_Actor.prototype.onClassChange);
Game_Actor.prototype.onClassChange = function(classId, keepExp) {
	J.PASSIVE.Aliased.Game_Actor.get("onClassChange").call(this, classId, keepExp);
	this.refreshPassiveStates();
};
/**
* Extends {@link #getNotesSources}.<br/>
* Includes passive skill states from this actor and also the party.
* @returns {RPG_BaseItem[]}
*/
J.PASSIVE.Aliased.Game_Actor.set("getNotesSources", Game_Actor.prototype.getNotesSources);
Game_Actor.prototype.getNotesSources = function() {
	const originalSources = J.PASSIVE.Aliased.Game_Actor.get("getNotesSources").call(this);
	const passiveSources = [...$gameParty.passiveStates()];
	const combinedSources = originalSources.concat(passiveSources);
	return combinedSources;
};

//#endregion
//#region src/plugins/passive/core/objects/Game_Battler.js
/**
* Extends {@link #initMembers}.<br/>
* Also initializes the passive states properties for this battler.
*/
J.PASSIVE.Aliased.Game_BattlerBase.set("initMembers", Game_Battler.prototype.initMembers);
Game_Battler.prototype.initMembers = function() {
	J.PASSIVE.Aliased.Game_BattlerBase.get("initMembers").call(this);
	this.initPassiveStatesMembers();
};
/**
* Initializes the passives collection
*/
Game_Battler.prototype.initPassiveStatesMembers = function() {
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with passive states.
	*/
	this._j._passive ||= {};
	/**
	* A cached list of all currently applied passive state ids.
	* @type {number[]|null}
	*/
	this._j._passive._stateIds = [];
	/**
	* A group of all external sources that are associated with this battler's passive states.
	* @type {RPG_BaseItem[]}
	*/
	this._j._passive._externalStateSources = [];
	/**
	* Pre-filtered subset of passive sources rebuilt after each {@link #refreshPassiveStates}.
	* Contains only sources that declare at least one passive state id; sources like weapon
	* combat skills that carry no passive tags are excluded so drift checks skip them.
	* @type {RPG_BaseItem[]}
	*/
	this._j._passive._passiveSources = [];
};
/**
* Get all currently known passive state ids this battler has.
* @returns {number[]}
*/
Game_Battler.prototype.getPassiveStateIds = function() {
	return this.stateIds();
};
/**
* Gets all the external sources (as base items) for this battler.
* @returns {RPG_BaseItem[]}
*/
Game_Battler.prototype.passiveExternalStateSources = function() {
	return this.externalStateSources();
};
/**
* Returns the pre-filtered list of passive-capable sources from the last refresh.<br/>
* Contains only sources that declared at least one passive state id.
* @returns {RPG_BaseItem[]}
*/
Game_Battler.prototype.passiveCapableSources = function() {
	return this.passiveSources();
};
/**
* Rebuilds the filtered list of passive-capable sources from the full source list.<br/>
* Called at the end of {@link #refreshPassiveStates} so the conditional ext's drift
* fingerprint builder has a short list to iterate instead of the full source roster.
*/
Game_Battler.prototype.cachePassiveCapableSources = function() {
	const allSources = this.getPassiveStateSources();
	this.setPassiveSources(allSources.filter((source) => this.sourceHasAnyPassiveIds(source)));
};
/**
* Whether a source has any passive state ids on any passive tag variant.<br/>
* Accounts for unique vs stackable and for equip-specific passive id properties.
* All reads hit the {@link RPGManager} WeakMap cache so no regex work occurs here.
* @param {RPG_BaseItem} source The source to inspect.
* @returns {boolean} True when this source carries at least one passive state id.
*/
Game_Battler.prototype.sourceHasAnyPassiveIds = function(source) {
	if (!source) return false;
	if (source.passiveStateIds && source.passiveStateIds.length > 0) return true;
	if (source.uniquePassiveStateIds && source.uniquePassiveStateIds.length > 0) return true;
	if (source.isEquipItem()) {
		if (source.equippedPassiveStateIds && source.equippedPassiveStateIds.length > 0) return true;
		if (source.uniqueEquippedPassiveStateIds && source.uniqueEquippedPassiveStateIds.length > 0) return true;
	}
	return false;
};
/**
* Adds a collection of state ids to the external passive state ids list.
* @param {number[]} stateIds The ids of the external passive states.
* @param {boolean} deferRefresh Whether or not to defer refreshing the passive states.
*/
Game_Battler.prototype.addPassiveStateExternalSourceByStateIds = function(stateIds, deferRefresh = false) {
	const baseItem = this.buildSourceFromStateIds(stateIds);
	this.addPassiveStateExternalSource(baseItem, deferRefresh);
};
/**
* Adds a source to the external passive source list.
* @param {RPG_BaseItem} source The source to add.
* @param {boolean} deferRefresh Whether or not to defer refreshing the passive states.
*/
Game_Battler.prototype.addPassiveStateExternalSource = function(source, deferRefresh = false) {
	this.externalStateSources().push(source);
	if (deferRefresh === true) return;
	this.refreshPassiveStates();
};
/**
* Clears all external passive state sources.
* @param {boolean} deferRefresh Whether or not to defer refreshing the passive states.
*/
Game_Battler.prototype.clearPassiveStateExternalSources = function(deferRefresh = false) {
	this.setExternalStateSources([]);
	if (deferRefresh === true) return;
	this.refreshPassiveStates();
};
/**
* Builds a dummy base item that can be used to represent passive state ids.
*
* Note: these base items aren't real items from the database and shouldn't be used as such!
* @param {number[]} stateIds The passive state ids to add to the base item.
* @returns {RPG_BaseItem} The constructed base item.
*/
Game_Battler.prototype.buildSourceFromStateIds = function(stateIds) {
	const baseItem = {
		id: -1,
		meta: {},
		name: String.empty,
		note: `<passive:[${stateIds.join(",")}]>`,
		description: String.empty,
		iconIndex: 0
	};
	return new RPG_BaseItem(baseItem, baseItem.id);
};
/**
* Adds the given state id to the passive state ids collection for this battler.
* If `allowDuplicates` is `false`, then the adding of the state id will be ignored
* if the battler already has the id.
* @param {number} stateId The id of the state to add.
* @param {boolean=} allowDuplicates Whether or not duplicate state ids is permitted; defaults to true.
*/
Game_Battler.prototype.addPassiveStateId = function(stateId, allowDuplicates = true) {
	if (!this.canAddPassiveStateId(stateId, allowDuplicates)) return;
	const passiveStateIds = this.getPassiveStateIds();
	passiveStateIds.push(stateId);
};
/**
* Determines whether or not a given stateId can be added to the list
* @param {number} stateId The id of the state to add.
* @param {boolean=} allowDuplicates Whether or not duplicate state ids is permitted; defaults to true.
* @returns {boolean} True if the state id can be added to the passives collection, false otherwise.
*/
Game_Battler.prototype.canAddPassiveStateId = function(stateId, allowDuplicates) {
	if (!allowDuplicates && this.getPassiveStateIds().includes(stateId)) {
		return false;
	}
	return true;
};
/**
* Gets the converted {@link RPG_State} form of all currently applied passive states.
* @returns {RPG_State[]}
*/
Game_Battler.prototype.getPassiveStates = function() {
	return this.getPassiveStateIds().map(this.state, this);
};
/**
* Clears all passive state data currently tracked.
*/
Game_Battler.prototype.clearPassiveStates = function() {
	this.setStateIds([]);
};
/**
* Clears and updates the passive state tracker with the latest.
* @param {boolean=} deferRefresh Whether or not to defer the trailing battler-data-change
* notification; defaults to false. Callers that already know a follow-up notification is coming
* (e.g. {@link Game_Enemy.onSetup} pairing this with the base setup notification) should pass true
* so the expensive note-regex cascade behind {@link #onBattlerDataChange} only runs once.
*/
Game_Battler.prototype.refreshPassiveStates = function(deferRefresh = false) {
	this.clearPassiveStates();
	const uniqueIds = this.getAllUniquePassiveStateIds();
	uniqueIds.forEach((stateId) => this.addPassiveStateId(stateId, false), this);
	const stackableIds = this.getAllStackablePassiveStateIds();
	stackableIds.forEach((stackCount, stateId) => {
		if (uniqueIds.has(stateId)) return;
		let times = stackCount;
		while (times > 0) {
			this.addPassiveStateId(stateId);
			times--;
		}
	});
	this.cachePassiveCapableSources();
	if (deferRefresh === true) return;
	this.onBattlerDataChange();
};
/**
* Determines whether a passive state from a specific source may be included
* in this battler's passive collection right now.<br/>
* Returns true unconditionally in the base; extension plugins override to apply gate rules.
* @param {RPG_BaseItem} baseItem Database row that declares the passive state id.
* @param {number} stateId Passive state id being evaluated for inclusion.
* @returns {boolean} Whether this source/state pair passes all gate conditions.
*/
Game_Battler.prototype.canIncludePassiveStateFromSource = function(_baseItem, _stateId) {
	return true;
};
/**
* Returns how many stacks one source contributes for a given passive state id.<br/>
* Returns 1 unconditionally in the base; extension plugins override to scale by runtime context.
* @param {RPG_BaseItem} baseItem Database row that declares the passive state id.
* @param {number} stateId Passive state id being evaluated for stack contribution.
* @returns {number} Stack contribution from this source (0 excludes it from the stack map).
*/
Game_Battler.prototype.getPassiveStackContributionFromSource = function(_baseItem, _stateId) {
	return 1;
};
/**
* Gets all unique passive state ids that are present across all sources this
* battler owns.
* @returns {Set<number>}
*/
Game_Battler.prototype.getAllUniquePassiveStateIds = function() {
	const uniquePassiveStateIds = new Set();
	const everything = this.getPassiveStateSources();
	everything.forEach((baseItem) => {
		const uniqueIds = baseItem.uniquePassiveStateIds;
		if (baseItem.isEquipItem()) {
			uniqueIds.push(...baseItem.uniqueEquippedPassiveStateIds);
		}
		uniqueIds.forEach((id) => {
			if (this.canIncludePassiveStateFromSource(baseItem, id) === false) return;
			uniquePassiveStateIds.add(id);
		}, this);
	});
	return uniquePassiveStateIds;
};
/**
* Gets all stackable passive state ids that are present across all sources this
* battler owns.
* @returns {Map<number, number>}
*/
Game_Battler.prototype.getAllStackablePassiveStateIds = function() {
	/** @type {Map<number, number>} */
	const stackablePassiveStateIds = new Map();
	const everything = this.getPassiveStateSources();
	everything.forEach((baseItem) => {
		const stackableIds = baseItem.passiveStateIds;
		if (baseItem.isEquipItem()) {
			stackableIds.push(...baseItem.equippedPassiveStateIds);
		}
		stackableIds.forEach((id) => {
			if (this.canIncludePassiveStateFromSource(baseItem, id) === false) return;
			const contribution = this.getPassiveStackContributionFromSource(baseItem, id);
			if (contribution <= 0) return;
			if (stackablePassiveStateIds.has(id)) {
				const stack = stackablePassiveStateIds.get(id);
				stackablePassiveStateIds.set(id, stack + contribution);
			} else {
				stackablePassiveStateIds.set(id, contribution);
			}
		}, this);
	});
	return stackablePassiveStateIds;
};
/**
* Gets all sources from which this battler can derive passive state from.
*
* This does include a reference call to potentially getting passive states, but due
* to control flows, this should always come back with no passive states in the list.
* @returns {(RPG_Actor|RPG_Enemy|RPG_Class|RPG_Skill|RPG_EquipItem|RPG_State)[]}
*/
Game_Battler.prototype.getPassiveStateSources = function() {
	const battlerSources = [
		this.databaseData(),
		...this.allStates(),
		...this.getPassiveStateSourcedSkills(),
		...this.passiveExternalStateSources()
	];
	return battlerSources;
};
/**
* Gets the skills that currently qualify as passive state sources for this battler.
* By default, every learned skill qualifies- this exists as its own seam so extensions
* (such as one bridging to an equip-slot system) can narrow the list down to only skills
* that are actually in play, without needing to override the whole of {@link #getPassiveStateSources}.
* @returns {RPG_Skill[]}
*/
Game_Battler.prototype.getPassiveStateSourcedSkills = function() {
	return this.skills();
};
/**
* Determines whether or not the state id is a passive state or not.
* @param {number} stateId The state id to check.
* @returns {boolean} True if it is identified as passive, false otherwise.
*/
Game_Battler.prototype.isPassiveState = function(stateId) {
	return this.stateIds().includes(stateId);
};
/**
* Extends {@link #allStates}.<br/>
* Includes states from passive skills as well.
* @returns {RPG_State[]}
*/
J.PASSIVE.Aliased.Game_Battler.set("allStates", Game_Battler.prototype.allStates);
Game_Battler.prototype.allStates = function() {
	const states = J.PASSIVE.Aliased.Game_Battler.get("allStates").call(this);
	states.push(...this.getPassiveStates());
	return states;
};
/**
* Extends {@link #allStateIds}.<br/>
* Includes state ids from passive skills as well.
* @returns {number[]}
*/
J.PASSIVE.Aliased.Game_Battler.set("allStateIds", Game_Battler.prototype.allStateIds);
Game_Battler.prototype.allStateIds = function() {
	const ids = J.PASSIVE.Aliased.Game_Battler.get("allStateIds").call(this);
	ids.push(...this.getPassiveStateIds());
	return ids;
};
/**
* Overrides {@link #getPurgeableStates}.<br/>
* Excludes passive states from the pool so forced removal via {@code removeStatesByPriority}
* can never strip states that are granted by passive skills.
* @returns {RPG_State[]}
*/
Game_Battler.prototype.getPurgeableStates = function() {
	return this.allStates().filter((state) => this.isPassiveState(state.id) === false);
};
/**
* Extends {@link #isStateAddable}.<br/>
* Prevents adding states if they are identified as passive.
*/
J.PASSIVE.Aliased.Game_Battler.set("isStateAddable", Game_Battler.prototype.isStateAddable);
Game_Battler.prototype.isStateAddable = function(stateId) {
	if (this.isPassiveState(stateId)) return false;
	return J.PASSIVE.Aliased.Game_Battler.get("isStateAddable").call(this, stateId);
};
/**
* Extends {@link #onStateAdded}.<br/>
* Triggers a refresh of passive states when a state is added.
* @param {number} stateId The state id being added.
*/
J.PASSIVE.Aliased.Game_Battler.set("onStateAdded", Game_Battler.prototype.onStateAdded);
Game_Battler.prototype.onStateAdded = function(stateId) {
	J.PASSIVE.Aliased.Game_Battler.get("onStateAdded").call(this, stateId);
	this.refreshPassiveStates();
};
/**
* Extends {@link #removeState}.<br/>
* Prevent removal of states if they are identified as passive.
*/
J.PASSIVE.Aliased.Game_Battler.set("removeState", Game_Battler.prototype.removeState);
Game_Battler.prototype.removeState = function(stateId) {
	if (this.isPassiveState(stateId)) return;
	J.PASSIVE.Aliased.Game_Battler.get("removeState").call(this, stateId);
};
/**
* Extends {@link #onStateRemoval}.<br/>
* Triggers a refresh of passive states when a state is removed.
* @param {number} stateId The state id being removed.
*/
J.PASSIVE.Aliased.Game_Battler.set("onStateRemoval", Game_Battler.prototype.onStateRemoval);
Game_Battler.prototype.onStateRemoval = function(stateId) {
	J.PASSIVE.Aliased.Game_Battler.get("onStateRemoval").call(this, stateId);
	this.refreshPassiveStates();
};
/**
* Gets the state ids.
* @returns {*} The stateIds.
*/
Game_Battler.prototype.stateIds = function() {
	return this._j._passive._stateIds;
};
/**
* Sets the state ids.
* @param {*} newStateIds The new stateIds.
*/
Game_Battler.prototype.setStateIds = function(newStateIds) {
	this._j._passive._stateIds = newStateIds;
};
/**
* Gets the external state sources.
* @returns {*} The externalStateSources.
*/
Game_Battler.prototype.externalStateSources = function() {
	return this._j._passive._externalStateSources;
};
/**
* Sets the external state sources.
* @param {*} newExternalStateSources The new externalStateSources.
*/
Game_Battler.prototype.setExternalStateSources = function(newExternalStateSources) {
	this._j._passive._externalStateSources = newExternalStateSources;
};
/**
* Gets the passive sources.
* @returns {*} The passiveSources.
*/
Game_Battler.prototype.passiveSources = function() {
	return this._j._passive._passiveSources;
};
/**
* Sets the passive sources.
* @param {*} newPassiveSources The new passiveSources.
*/
Game_Battler.prototype.setPassiveSources = function(newPassiveSources) {
	this._j._passive._passiveSources = newPassiveSources;
};

//#endregion
//#region src/plugins/passive/core/objects/Game_Enemy.js
/**
* Extends {@link #onSetup}.<br/>
* Also refreshes the passive states on this battler for the first time.
* @param {number} enemyId The battler's id.
*/
J.PASSIVE.Aliased.Game_Enemy.set("onSetup", Game_Enemy.prototype.onSetup);
Game_Enemy.prototype.onSetup = function(enemyId) {
	this.refreshPassiveStates(true);
	J.PASSIVE.Aliased.Game_Enemy.get("onSetup").call(this, enemyId);
};
/**
* Extends {@link #buildTraitObjects}.<br/>
* When considering traits, also include the enemy's passive states.
*
* Returns a fresh array by spreading the base result and appending passives — never
* mutates the base result so the {@link #traitObjects} cache stays safe.
* @returns {(RPG_Enemy|RPG_State)[]}
*/
J.PASSIVE.Aliased.Game_Enemy.set("buildTraitObjects", Game_Enemy.prototype.buildTraitObjects);
Game_Enemy.prototype.buildTraitObjects = function() {
	const baseObjects = J.PASSIVE.Aliased.Game_Enemy.get("buildTraitObjects").call(this);
	return [...baseObjects, ...this.getPassiveStates()];
};
/**
* Extends {@link #getNotesSources}.<br/>
* Includes passive states from this enemy.
* @returns {RPG_BaseItem[]}
*/
J.PASSIVE.Aliased.Game_Enemy.set("getNotesSources", Game_Enemy.prototype.getNotesSources);
Game_Enemy.prototype.getNotesSources = function() {
	const originalSources = J.PASSIVE.Aliased.Game_Enemy.get("getNotesSources").call(this);
	const passiveSources = [...this.passiveExternalStateSources()];
	const combinedSources = originalSources.concat(passiveSources);
	return combinedSources;
};

//#endregion
//#region src/plugins/passive/core/objects/Game_Event.js
/**
* Gets all passive state ids in the comments of an event.
* @returns {number[]}
*/
Game_Event.prototype.getPassiveStateIds = function() {
	const passiveStateIds = [];
	this.getValidCommentCommands().forEach((command) => {
		J.PASSIVE.RegExp.PassiveStateIds.lastIndex = 0;
		const [comment] = command.parameters;
		const regexResult = J.PASSIVE.RegExp.PassiveStateIds.exec(comment);
		if (!regexResult) return;
		const ids = JSON.parse(regexResult[1]);
		passiveStateIds.push(...ids);
	});
	return passiveStateIds;
};

//#endregion
//#region src/plugins/passive/core/objects/Game_Party.js
/**
* Extends {@link #initialize}.<br/>
* Includes our custom members as well.
*/
J.PASSIVE.Aliased.Game_Party.set("initialize", Game_Party.prototype.initialize);
Game_Party.prototype.initialize = function() {
	J.PASSIVE.Aliased.Game_Party.get("initialize").call(this);
	this.initPassiveItemStates();
};
/**
* Initializes the passive state members for this class.
*/
Game_Party.prototype.initPassiveItemStates = function() {
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* The grouping of all properties related to passive states.
	*/
	this._j._passive ||= {};
	/**
	* The tracker for all passive states ids the party has.
	* @type {number[]}
	*/
	this._j._passive._states = [];
	/**
	* The cache for passive states that have been converted.
	* @type {RPG_State[]}
	*/
	this._j._passive._cachedStates = [];
};
/**
* Gets all passive states ids currently applied to the party.
* @returns {number[]}
*/
Game_Party.prototype.passiveStateIds = function() {
	return this.states();
};
/**
* Gets an array of all passive states currently applied to the party.
* @returns {RPG_State[]}
*/
Game_Party.prototype.passiveStates = function() {
	return this.cachedStates();
};
/**
* Gets the party's interpretation of the state based on its id.
* @param {number} stateId The state id.
* @returns {RPG_State}
*/
Game_Party.prototype.state = function(stateId) {
	return $dataStates.at(stateId);
};
/**
* Clears all passive state data currently tracked.
*/
Game_Party.prototype.clearPassiveStates = function() {
	this.setStates([]);
	this.setCachedStates([]);
};
/**
* Adds a passive state id to the list for tracking.
* @param {number} stateId The state id to add.
* @param {boolean=} allowDuplicates Whether or not to allow duplicate passive state ids; defaults to true.
*/
Game_Party.prototype.addPassiveStateId = function(stateId, allowDuplicates = true) {
	if (!allowDuplicates && this.states().has(stateId)) return;
	this.states().push(stateId);
	this.cachedStates().push(this.state(stateId));
};
/**
* Clears and updates the passive state tracker with the latest.
*/
Game_Party.prototype.refreshPassiveStates = function() {
	this.clearPassiveStates();
	const uniqueIds = this.getAllUniquePassiveStateIds();
	uniqueIds.forEach((stateId) => this.addPassiveStateId(stateId, false), this);
	const stackableIds = this.getAllStackablePassiveStateIds();
	stackableIds.forEach((stackCount, stateId) => {
		if (uniqueIds.has(stateId)) return;
		let times = stackCount;
		while (times > 0) {
			this.addPassiveStateId(stateId);
			times--;
		}
	});
};
/**
* Gets all unique passive state ids that are present across everything the
* party owns at the moment.
* @returns {Set<number>}
*/
Game_Party.prototype.getAllUniquePassiveStateIds = function() {
	const uniquePassiveStateIds = new Set();
	const everything = this.allItemsQuantified();
	everything.forEach((baseItem) => {
		const uniqueIds = baseItem.uniquePassiveStateIds;
		uniqueIds.forEach((id) => uniquePassiveStateIds.add(id));
	});
	return uniquePassiveStateIds;
};
/**
* Gets all stackable passive state ids that are present across everything the
* party owns at the moment.
* @returns {Map<number, number>}
*/
Game_Party.prototype.getAllStackablePassiveStateIds = function() {
	/** @type {Map<number, number>} */
	const stackablePassiveStateIds = new Map();
	const everything = this.allItemsQuantified();
	everything.forEach((baseItem) => {
		const stackableIds = baseItem.passiveStateIds;
		stackableIds.forEach((id) => {
			if (stackablePassiveStateIds.has(id)) {
				const stack = stackablePassiveStateIds.get(id);
				stackablePassiveStateIds.set(id, stack + 1);
			} else {
				stackablePassiveStateIds.set(id, 1);
			}
		});
	});
	return stackablePassiveStateIds;
};
/**
* Extends {@link #gainItem}.<br/>
* Also refreshes the passive states for the party.
* @param {RPG_Item|RPG_Weapon|RPG_Armor} item The item to modify the quantity of.
* @param {number} amount The amount to modify the quantity by.
* @param {boolean} includeEquip Whether or not to include equipped items for equipment.
*/
J.PASSIVE.Aliased.Game_Party.set("gainItem", Game_Party.prototype.gainItem);
Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
	J.PASSIVE.Aliased.Game_Party.get("gainItem").call(this, item, amount, includeEquip);
	this.refreshPassiveStates();
};
/**
* Gets the passive state ids currently applied across the whole party.
* @returns {number[]} The party-wide passive state ids.
*/
Game_Party.prototype.states = function() {
	return this._j._passive._states;
};
/**
* Sets the passive state ids applied across the whole party.
* @param {number[]} newStates The party-wide passive state ids.
*/
Game_Party.prototype.setStates = function(newStates) {
	this._j._passive._states = newStates;
};
/**
* Gets the cached states.
* @returns {*} The cachedStates.
*/
Game_Party.prototype.cachedStates = function() {
	return this._j._passive._cachedStates;
};
/**
* Sets the cached states.
* @param {*} newCachedStates The new cachedStates.
*/
Game_Party.prototype.setCachedStates = function(newCachedStates) {
	this._j._passive._cachedStates = newCachedStates;
};

//#endregion
//#region src/plugins/passive/core/windows/Window_PassiveTabHeader.js
/**
* A non-interactive header strip that displays the currently active passive viewer tab.
* The ◀ and ▶ glyphs hint at left/right navigation without consuming any input.
*/
var Window_PassiveTabHeader = class extends Window_Base {
	/**
	* Gets the label.
	* @returns {string} The label.
	*/
	label() {
		return this._label;
	}
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle for this window.
	*/
	constructor(rect) {
		super(rect);
		this.initialize(rect);
	}
	/**
	* Initializes this window.
	* @param {Rectangle} rect The rectangle for this window.
	*/
	initialize(rect) {
		super.initialize(rect);
		this._label = "All";
		this.refresh();
	}
	/**
	* Sets the tab label displayed in this header and redraws immediately.
	* @param {string} label The display label for the current tab.
	*/
	setLabel(label) {
		if (this._label === label) return;
		this._label = label;
		this.refresh();
	}
	/**
	* Redraws the tab header with the current label and navigation glyphs.
	*/
	refresh() {
		this.contents.clear();
		const text = `◀  ${this.label()}  ▶`;
		this.drawText(text, 0, 0, this.innerWidth, "center");
	}
};

//#endregion
//#region src/plugins/passive/core/windows/Window_PassiveActorRibbon.js
/**
* A ribbon window for the passive viewer that displays the currently viewed actor's
* face, name, and level. Sits above the state list in the left column so the player
* always knows whose passives they are looking at.
*/
var Window_PassiveActorRibbon = class extends Window_ActorRibbon {
	/**
	* Constructor.
	*
	* No explicit `initialize()` call: {@link Window_ActorRibbon}'s own constructor performs one, and a
	* second would initialize this window twice.
	* @param {Rectangle} rect The rectangle for this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Extends {@link Window_ActorRibbon#drawContent}.<br/>
	* Also draws the actor name and level beside the face.
	*/
	drawContent() {
		super.drawContent();
		this.drawActorName();
	}
	/**
	* Draws the actor name centered vertically beside the face graphic.
	*/
	drawActorName() {
		if (!this.actor()) return;
		const textX = this.faceWidth() + 8;
		const textWidth = this.innerWidth - textX;
		const textY = Math.floor((this.innerHeight - this.lineHeight()) / 2);
		this.drawText(this.actor().name(), textX, textY, textWidth, "left");
	}
};

//#endregion
//#region src/plugins/passive/core/windows/Window_PassiveList.js
/**
* A scrollable list of passive states currently applied to the viewed actor.
* The list is filtered by the active tab's filter function; null means show all.
*
* Tab cycling is handled via L2/R2 content handlers wired by {@link Scene_Passive}.
*/
var Window_PassiveList = class extends Window_Selectable {
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle for this window.
	*/
	constructor(rect) {
		super(rect);
		this.initialize(rect);
	}
	/**
	* Initializes this window.
	* @param {Rectangle} rect The rectangle for this window.
	*/
	initialize(rect) {
		super.initialize(rect);
		/**
		* The actor whose passive states are being displayed.
		* @type {Game_Actor|null}
		*/
		this._actor = null;
		/**
		* The filter function for the active tab.
		* When null, all passive states are shown.
		* @type {Function|null}
		*/
		this._tabFilter = null;
		/**
		* The working list of deduplicated passive state entries matching the current filter.
		* Each entry is { state: RPG_State, count: number }, or null for the empty sentinel.
		* @type {Array<{state: RPG_State, count: number}|null>}
		*/
		this._data = [];
	}
	/**
	* Gets the actor whose passives are being displayed.
	* @returns {Game_Actor|null}
	*/
	getActor() {
		return this._actor;
	}
	/**
	* Sets the actor and rebuilds the list.
	* @param {Game_Actor} actor The actor whose passives to display.
	*/
	setActor(actor) {
		this._actor = actor;
		this.refresh();
	}
	/**
	* Gets the active tab filter function.
	* @returns {Function|null}
	*/
	getTabFilter() {
		return this._tabFilter;
	}
	/**
	* Sets the active tab filter and rebuilds the list.
	* @param {Function|null} filter A function(stateId, actor) => boolean, or null for no filter.
	*/
	setTabFilter(filter) {
		this._tabFilter = filter;
		this.refresh();
	}
	/**
	* Gets the working data list.
	* @returns {Array<{state: RPG_State, count: number}|null>}
	*/
	getData() {
		return this._data;
	}
	/**
	* Replaces the working data list.
	* @param {Array<{state: RPG_State, count: number}|null>} data
	*/
	setData(data) {
		this._data = data;
	}
	/**
	* Gets the total number of items in the filtered list.
	* @returns {number}
	*/
	maxItems() {
		return this.getData().length;
	}
	/**
	* Rebuilds the filtered working list from the actor's current passive states.
	*/
	makeItemList() {
		if (this.getActor() === null) {
			this.setData([]);
			return;
		}
		const all = this.getActor().getPassiveStates();
		let visible = all.filter((state) => state.hideFromPassiveList === false);
		if (this.getTabFilter() !== null) {
			visible = visible.filter((state) => this.getTabFilter()(state.id, this.getActor()));
		}
		const countById = new Map();
		for (const state of visible) {
			const existing = countById.get(state.id);
			countById.set(state.id, (existing === undefined ? 0 : existing) + 1);
		}
		const seen = new Set();
		const data = [];
		for (const state of visible) {
			if (seen.has(state.id) === true) continue;
			seen.add(state.id);
			data.push({
				state,
				count: countById.get(state.id)
			});
		}
		if (data.length === 0) {
			data.push(null);
		}
		this.setData(data);
	}
	/**
	* Gets the passive state at the current index.
	* @returns {RPG_State|null}
	*/
	currentPassiveState() {
		const entry = this.getData()[this.index()];
		if (entry === undefined || entry === null) return null;
		return entry.state;
	}
	/**
	* Rebuilds the item list and repaints all rows.
	*/
	refresh() {
		this.makeItemList();
		super.refresh();
	}
	/**
	* Draws a single passive state row: icon followed by the state name.
	* A null entry renders as a dimmed "No passives." placeholder.
	* @param {number} index The row index to draw.
	*/
	drawItem(index) {
		const entry = this.getData()[index];
		const rect = this.itemLineRect(index);
		if (entry === null) {
			this.changeTextColor(ColorManager.textColor(8));
			this.drawText("No passives.", rect.x, rect.y, rect.width);
			this.resetTextColor();
			return;
		}
		const { state, count } = entry;
		this.drawIcon(state.iconIndex, rect.x, rect.y);
		const nameX = rect.x + ImageManager.iconWidth + 4;
		const nameWidth = rect.width - ImageManager.iconWidth - 4;
		this.drawText(state.name, nameX, rect.y, nameWidth);
		if (count > 1) {
			this.changeTextColor(ColorManager.textColor(6));
			this.drawText(`×${count}`, nameX, rect.y, nameWidth, "right");
			this.resetTextColor();
		}
	}
};

//#endregion
//#region src/plugins/passive/core/windows/Window_PassiveDetail.js
/**
* A non-interactive detail panel that displays information about the currently
* highlighted passive state in the list window.
*
* The panel is divided into two equal columns below the full-width state header.
* Each column renders sections that group effects by meaning. All draw helpers
* share state through {@link currentX} and {@link currentY}, both reset at the
* start of each repaint — no y threading through method signatures.
*
* Left column:   Combat (stub, filled by a passive extension) + Ailments
* Middle column: Parameters + Elements
* Right column:  Skills + Equip + Properties + Rewards
*
* Section draw order / extension target names:
*   drawStateHeader → drawCombatSection (stub) → drawAilmentsSection →
*   (middle) → drawParametersSection → drawElementsSection →
*   (right) → drawSkillsSection → drawEquipSection → drawPropertiesSection →
*   drawRewardsSection
*
* Clears and shows nothing when no state is selected.
*/
var Window_PassiveDetail = class extends Window_Base {
	/**
	* Gets the column start y.
	* @returns {number} The columnStartY.
	*/
	/**
	* Gets the actor.
	* @returns {Game_Actor|null} The actor.
	*/
	actor() {
		return this._actor;
	}
	/**
	* Gets the state.
	* @returns {RPG_State|null} The state.
	*/
	state() {
		return this._state;
	}
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle for this window.
	*/
	columnStartY() {
		return this._columnStartY;
	}
	/**
	* Sets the column start y.
	* @param {number} newColumnStartY The new columnStartY.
	*/
	setColumnStartY(newColumnStartY) {
		this._columnStartY = newColumnStartY;
	}
	constructor(rect) {
		super(rect);
		this.initialize(rect);
	}
	/**
	* Initializes this window.
	* @param {Rectangle} rect The rectangle for this window.
	*/
	initialize(rect) {
		super.initialize(rect);
		/**
		* The passive state currently being displayed.
		* @type {RPG_State|null}
		*/
		this._state = null;
		/**
		* The actor whose passive states are being browsed.
		* @type {Game_Actor|null}
		*/
		this._actor = null;
		/**
		* The running horizontal cursor. 0 for the left column, columnWidth+gutter for the right.
		* @type {number}
		*/
		this._currentX = 0;
		/**
		* The running vertical cursor shared by all draw helpers in the active column.
		* @type {number}
		*/
		this._currentY = 0;
		/**
		* The y coordinate where both columns begin, recorded after the full-width header.
		* Used by {@link switchToRightColumn} to reset the vertical cursor.
		* @type {number}
		*/
		this._columnStartY = 0;
	}
	/**
	* The running horizontal cursor for the active column.
	* @type {number}
	*/
	get currentX() {
		return this._currentX;
	}
	set currentX(value) {
		this._currentX = value;
	}
	/**
	* The running vertical cursor shared by all draw helpers.
	* @type {number}
	*/
	get currentY() {
		return this._currentY;
	}
	set currentY(value) {
		this._currentY = value;
	}
	/**
	* The usable pixel width of one column.
	* All three columns are equal; two 8px gutters separate them.
	* @type {number}
	*/
	get columnWidth() {
		return Math.floor((this.innerWidth - 16) / 3);
	}
	/**
	* Moves the active draw cursor to the given zero-based column index.
	* Column 0 = left, 1 = middle, 2 = right.
	* Resets {@link currentY} to the value recorded after the full-width header.
	* @param {number} columnIndex The target column (0, 1, or 2).
	*/
	switchToColumn(columnIndex) {
		this.currentX = columnIndex * (this.columnWidth + 8);
		this.currentY = this.columnStartY();
	}
	/**
	* Convenience: moves to the middle (second) column.
	*/
	switchToMiddleColumn() {
		this.switchToColumn(1);
	}
	/**
	* Convenience: moves to the right (third) column.
	*/
	switchToRightColumn() {
		this.switchToColumn(2);
	}
	/**
	* Sets the actor context and repaints.
	* @param {Game_Actor|null} actor The actor being browsed.
	*/
	setActor(actor) {
		this._actor = actor;
		this.refresh();
	}
	/**
	* Sets the state to display and repaints.
	* @param {RPG_State|null} state The state to display, or null to clear.
	*/
	setState(state) {
		this._state = state;
		this.refresh();
	}
	/**
	* Repaints the detail panel for the current state.
	*/
	refresh() {
		this.contents.clear();
		if (!this.state()) return;
		this.currentX = 0;
		this.currentY = 0;
		this.drawPassiveStateDetail(this.state());
	}
	/**
	* Top-level orchestrator — draws the full-width header, then populates the
	* left and right columns with their respective sections.
	*
	* Left column: Combat (stub, filled by a passive extension), Parameters, Elements.
	* Right column: Ailments, Skills, Equip, Properties, Rewards.
	*
	* Extensions may alias either this method or any individual section method.
	* @param {RPG_State} state The state whose details are being drawn.
	*/
	drawPassiveStateDetail(state) {
		this.drawStateHeader(state);
		this.setColumnStartY(this.currentY);
		this.drawCombatSection(state);
		this.drawAilmentsSection(state);
		this.switchToMiddleColumn();
		this.drawParametersSection(state);
		this.drawElementsSection(state);
		this.switchToRightColumn();
		this.drawSkillsSection(state);
		this.drawEquipSection(state);
		this.drawPropertiesSection(state);
		this.drawRewardsSection(state);
	}
	/**
	* Stub for the combat section — occupies no space when unoverridden.
	* A passive affix extension overrides this to draw JABS combat, shield, and stacking.
	* @param {RPG_State} state The state being detailed.
	*/
	drawCombatSection(state) {}
	/**
	* Draws a "——— Label ———" section divider centered in the active column.
	* Lines are drawn on each side of the title text; they do not pass through it.
	* Advances {@link currentY} by one line height.
	* @param {string} label The section title text.
	*/
	drawDetailSectionHeader(label) {
		const lh = this.lineHeight();
		const y = this.currentY;
		const cw = this.columnWidth;
		const cx = this.currentX;
		const textWidth = this.textWidth(label);
		const centerX = cx + Math.floor(cw / 2);
		const textX = centerX - Math.floor(textWidth / 2);
		const lineY = y + Math.floor(lh / 2);
		const lineColor = ColorManager.textColor(8);
		const leftEnd = textX - 4;
		if (leftEnd > cx + 4) {
			this.contents.fillRect(cx + 4, lineY, leftEnd - (cx + 4), 1, lineColor);
		}
		const rightStart = textX + textWidth + 4;
		const rightEnd = cx + cw - 4;
		if (rightStart < rightEnd) {
			this.contents.fillRect(rightStart, lineY, rightEnd - rightStart, 1, lineColor);
		}
		this.changeTextColor(ColorManager.textColor(14));
		this.drawText(label, textX, y, textWidth + 2);
		this.resetTextColor();
		this.currentY += lh;
	}
	/**
	* Draws a single detail row within the active column.
	* Layout: optional icon | label | right-aligned value (160px).
	* The value is color-coded green for beneficial and red for detrimental changes.
	* By default '+' prefix = green and '-' prefix = red.
	* Pass invertColor=true for parameters where lower values are better
	* (e.g. PDR, MDR, MCR, TCR, HCR), which reverses the color assignment.
	* Advances {@link currentY} by one line height.
	* @param {number} icon Icon index; pass 0 to skip.
	* @param {string} label The row label.
	* @param {string} value The value string; pass empty string when there is none.
	* @param {boolean} invertColor When true, '-' = green and '+' = red.
	*/
	drawDetailRow(icon, label, value, invertColor = false) {
		const y = this.currentY;
		const lh = this.lineHeight();
		const iconW = ImageManager.iconWidth + 4;
		const valueW = value ? 160 : 0;
		let labelX = this.currentX + 4;
		if (icon > 0) {
			this.drawIcon(icon, this.currentX, y);
			labelX = this.currentX + iconW;
		}
		const labelW = this.columnWidth - (labelX - this.currentX) - valueW;
		this.drawText(label, labelX, y, labelW);
		if (value) {
			if (value.startsWith("+")) {
				this.changeTextColor(invertColor ? ColorManager.powerDownColor() : ColorManager.powerUpColor());
			} else if (value.startsWith("-")) {
				this.changeTextColor(invertColor ? ColorManager.powerUpColor() : ColorManager.powerDownColor());
			}
			this.drawText(value, this.currentX + this.columnWidth - valueW, y, valueW, "right");
			this.resetTextColor();
		}
		this.currentY += lh;
	}
	/**
	* Determines whether a trait's value color should be inverted because
	* lower values are beneficial for the associated parameter.
	* Applies to sparams where reducing the rate is the desired effect:
	* MCR (Magi Cost), TCR (Tech Cost), PDR (Phys Dmg), MDR (Magi Dmg), FDR (Environ Dmg).
	* @param {RPG_Trait} trait The trait to evaluate.
	* @returns {boolean}
	*/
	isInvertedTrait(trait) {
		if (trait.code !== 23) return false;
		const invertedSparamIds = [
			4,
			5,
			6,
			7,
			8
		];
		return invertedSparamIds.includes(trait.dataId);
	}
	/**
	* Evaluates a formula string against the given actor and returns a display string.
	* Uses 'a' as the actor reference, matching the RMMZ formula convention.
	* Returns the formula wrapped in brackets as a fallback when no actor is available
	* or when evaluation throws.
	* @param {string} formula The formula string to evaluate (without surrounding brackets).
	* @param {Game_Actor|null} actor The actor providing the 'a' context variable.
	* @returns {string} The evaluated result, or '[formula]' on failure.
	*/
	evaluateFormula(formula, actor) {
		if (!actor) return `[${formula}]`;
		try {
			const a = actor;
			const b = actor;
			const result = new Function("a", "b", `return (${formula})`)(a, b);
			if (Number.isFinite(result)) return `${Math.round(result)}`;
			return `${result}`;
		} catch {
			return `[${formula}]`;
		}
	}
	/**
	* Returns the filtered subset of a state's traits matching a given set of codes.
	* Skips code 63 (J-JAFTING collateral-trait marker).
	* @param {RPG_State} state The state to filter traits from.
	* @param {number[]} codes The trait codes to include.
	* @returns {MV_Trait[]} The matching traits.
	*/
	filterTraits(state, codes) {
		if (!state.traits || state.traits.length === 0) return [];
		return state.traits.filter((t) => t.code !== 63 && codes.includes(t.code));
	}
	/**
	* Draws the full-width state icon, name, and description at the top of the panel.
	* Explicitly ignores {@link currentX} and uses the full {@link innerWidth} so the
	* header always spans both columns.
	* @param {RPG_State} state The state to draw the header for.
	*/
	drawStateHeader(state) {
		const { name, iconIndex, description } = state;
		const lh = this.lineHeight();
		this.drawIcon(iconIndex, 0, this.currentY);
		this.drawText(name, ImageManager.iconWidth + 4, this.currentY, this.innerWidth - ImageManager.iconWidth - 4);
		this.currentY += lh + 4;
		this.drawTextEx(description ?? String.empty, 4, this.currentY, this.innerWidth - 4);
		this.currentY += lh * 2 + 8;
	}
	/**
	* Draws the Parameters section in the left column.
	* Covers RMMZ param/xparam/sparam traits (codes 21–23) and J-Natural
	* formula-driven buffs and growths (evaluated against the current actor).
	* Skipped when neither source has any content on this state.
	* @param {RPG_State} state The state being detailed.
	*/
	drawParametersSection(state) {
		const paramTraits = this.filterTraits(state, [
			21,
			22,
			23
		]);
		const naturalLines = this.collectNaturalParamLines(state);
		if (paramTraits.length === 0 && naturalLines.length === 0) return;
		this.drawDetailSectionHeader("Parameters");
		paramTraits.forEach((rawTrait) => {
			const trait = new RPG_Trait(rawTrait);
			this.drawDetailRow(this.paramIconForTrait(trait), trait.textName(), trait.textValue(), this.isInvertedTrait(trait));
		});
		naturalLines.forEach(({ icon, label, value }) => {
			this.drawDetailRow(icon, label, value);
		});
		const hcrLine = this.collectHcrLine(state);
		if (hcrLine) {
			this.drawDetailRow(hcrLine.icon, hcrLine.label, hcrLine.value, true);
		}
		this.collectCritLines(state).forEach(({ icon, label, value }) => {
			this.drawDetailRow(icon, label, value);
		});
		const cdrLine = this.collectCdrLine(state);
		if (cdrLine) {
			this.drawDetailRow(cdrLine.icon, cdrLine.label, cdrLine.value);
		}
	}
	/**
	* Collects the Life Cost (HCR) display row from J-Resources.
	* HCR formula evaluates to a positive reduction amount (e.g. 15 = 15% cheaper),
	* so the value is negated for display to match the MCR/TCR visual convention,
	* and invertColor is applied so the resulting '-' prefix renders green.
	* Returns null when J-Resources is not loaded or the state has no HCR tag.
	* @param {RPG_State} state The state to check.
	* @returns {{icon: number, label: string, value: string}|null}
	*/
	collectHcrLine(state) {
		if (!J.RESOURCES) return null;
		const formula = RPGManager.getStringFromNoteByRegex(state, J.RESOURCES.RegExp.HpCostReduction);
		if (!formula) return null;
		const evaluated = Number(this.evaluateFormula(formula, this.actor()));
		return {
			icon: IconManager.param(0),
			label: "Life Cost",
			value: `-${Math.abs(evaluated)}%`
		};
	}
	/**
	* Collects J-CriticalFactors display rows for the given state.
	* Crit Reduction reduces incoming critical damage (higher = more protection = green).
	* Crit Multiplier increases outgoing critical damage (positive = better = green).
	* Returns an empty array when J-CriticalFactors is not loaded.
	* @param {RPG_State} state The state to check.
	* @returns {Array<{icon: number, label: string, value: string}>}
	*/
	collectCritLines(state) {
		if (!J.CRIT) return [];
		const rows = [];
		const critReduce = RPGManager.getNumberFromNoteByRegex(state, J.CRIT.RegExp.CritDamageReduction);
		if (critReduce) {
			rows.push({
				icon: IconManager.xparam(3),
				label: "Crit Reduction",
				value: `+${critReduce}`
			});
		}
		const critMult = RPGManager.getNumberFromNoteByRegex(state, J.CRIT.RegExp.CritDamageMultiplier);
		if (critMult) {
			rows.push({
				icon: IconManager.xparam(2),
				label: "Crit Multiplier",
				value: `${critMult > 0 ? "+" : ""}${critMult}`
			});
		}
		return rows;
	}
	/**
	* Collects the CDR (global cooldown rate reduction) display row from J-ABS.
	* Positive values shorten GCD (green); negative lengthen it.
	* Returns null when J-ABS is not loaded or the state has no CDR tag.
	* @param {RPG_State} state The state to check.
	* @returns {{icon: number, label: string, value: string}|null}
	*/
	collectCdrLine(state) {
		if (!J.ABS) return null;
		const formula = RPGManager.getStringFromNoteByRegex(state, J.ABS.RegExp.GlobalCooldownReduction);
		if (!formula) return null;
		const evaluated = Number(this.evaluateFormula(formula, this.actor()));
		return {
			icon: IconManager.cdr(),
			label: "Cooldown Rate",
			value: `${evaluated > 0 ? "+" : ""}${evaluated}%`
		};
	}
	/**
	* Returns the icon index for a param/xparam/sparam trait using IconManager.
	* @param {RPG_Trait} trait The trait to resolve an icon for.
	* @returns {number}
	*/
	paramIconForTrait(trait) {
		switch (trait.code) {
			case 21: return IconManager.param(trait.dataId);
			case 22: return IconManager.xparam(trait.dataId);
			case 23: return IconManager.sparam(trait.dataId);
			default: return 0;
		}
	}
	/**
	* Collects J-Natural parameter formula lines for the Parameters section.
	* Each entry carries an icon from IconManager, an evaluated numeric value,
	* and a "/lv" suffix on growth-type rows to communicate that the gain
	* applies per level rather than immediately.
	* Returns an empty array when J-Natural is not loaded.
	* @param {RPG_State} state The state to check.
	* @returns {Array<{icon: number, label: string, value: string}>}
	*/
	collectNaturalParamLines(state) {
		if (!J.NATURAL) return [];
		const lines = [];
		const checks = [
			[
				`${TextManager.param(0)} Buff+`,
				J.NATURAL.RegExp.MaxLifeBuffPlus,
				IconManager.param(0),
				false
			],
			[
				`${TextManager.param(0)} Buff%`,
				J.NATURAL.RegExp.MaxLifeBuffRate,
				IconManager.param(0),
				false
			],
			[
				`${TextManager.param(1)} Buff+`,
				J.NATURAL.RegExp.MaxMagiBuffPlus,
				IconManager.param(1),
				false
			],
			[
				`${TextManager.param(1)} Buff%`,
				J.NATURAL.RegExp.MaxMagiBuffRate,
				IconManager.param(1),
				false
			],
			[
				`${TextManager.param(2)} Buff+`,
				J.NATURAL.RegExp.PowerBuffPlus,
				IconManager.param(2),
				false
			],
			[
				`${TextManager.param(2)} Buff%`,
				J.NATURAL.RegExp.PowerBuffRate,
				IconManager.param(2),
				false
			],
			[
				`${TextManager.param(3)} Buff+`,
				J.NATURAL.RegExp.DefenseBuffPlus,
				IconManager.param(3),
				false
			],
			[
				`${TextManager.param(3)} Buff%`,
				J.NATURAL.RegExp.DefenseBuffRate,
				IconManager.param(3),
				false
			],
			[
				`${TextManager.param(4)} Buff+`,
				J.NATURAL.RegExp.ForceBuffPlus,
				IconManager.param(4),
				false
			],
			[
				`${TextManager.param(4)} Buff%`,
				J.NATURAL.RegExp.ForceBuffRate,
				IconManager.param(4),
				false
			],
			[
				`${TextManager.param(5)} Buff+`,
				J.NATURAL.RegExp.ResistBuffPlus,
				IconManager.param(5),
				false
			],
			[
				`${TextManager.param(5)} Buff%`,
				J.NATURAL.RegExp.ResistBuffRate,
				IconManager.param(5),
				false
			],
			[
				`${TextManager.param(6)} Buff+`,
				J.NATURAL.RegExp.SpeedBuffPlus,
				IconManager.param(6),
				false
			],
			[
				`${TextManager.param(6)} Buff%`,
				J.NATURAL.RegExp.SpeedBuffRate,
				IconManager.param(6),
				false
			],
			[
				`${TextManager.param(7)} Buff+`,
				J.NATURAL.RegExp.LuckBuffPlus,
				IconManager.param(7),
				false
			],
			[
				`${TextManager.param(7)} Buff%`,
				J.NATURAL.RegExp.LuckBuffRate,
				IconManager.param(7),
				false
			],
			[
				`${TextManager.param(0)} Growth+`,
				J.NATURAL.RegExp.MaxLifeGrowthPlus,
				IconManager.param(0),
				true
			],
			[
				`${TextManager.param(0)} Growth%`,
				J.NATURAL.RegExp.MaxLifeGrowthRate,
				IconManager.param(0),
				true
			],
			[
				`${TextManager.param(1)} Growth+`,
				J.NATURAL.RegExp.MaxMagiGrowthPlus,
				IconManager.param(1),
				true
			],
			[
				`${TextManager.param(1)} Growth%`,
				J.NATURAL.RegExp.MaxMagiGrowthRate,
				IconManager.param(1),
				true
			],
			[
				`${TextManager.param(2)} Growth+`,
				J.NATURAL.RegExp.PowerGrowthPlus,
				IconManager.param(2),
				true
			],
			[
				`${TextManager.param(2)} Growth%`,
				J.NATURAL.RegExp.PowerGrowthRate,
				IconManager.param(2),
				true
			],
			[
				`${TextManager.param(3)} Growth+`,
				J.NATURAL.RegExp.DefenseGrowthPlus,
				IconManager.param(3),
				true
			],
			[
				`${TextManager.param(3)} Growth%`,
				J.NATURAL.RegExp.DefenseGrowthRate,
				IconManager.param(3),
				true
			],
			[
				`${TextManager.param(4)} Growth+`,
				J.NATURAL.RegExp.ForceGrowthPlus,
				IconManager.param(4),
				true
			],
			[
				`${TextManager.param(4)} Growth%`,
				J.NATURAL.RegExp.ForceGrowthRate,
				IconManager.param(4),
				true
			],
			[
				`${TextManager.param(5)} Growth+`,
				J.NATURAL.RegExp.ResistGrowthPlus,
				IconManager.param(5),
				true
			],
			[
				`${TextManager.param(5)} Growth%`,
				J.NATURAL.RegExp.ResistGrowthRate,
				IconManager.param(5),
				true
			],
			[
				`${TextManager.param(6)} Growth+`,
				J.NATURAL.RegExp.SpeedGrowthPlus,
				IconManager.param(6),
				true
			],
			[
				`${TextManager.param(6)} Growth%`,
				J.NATURAL.RegExp.SpeedGrowthRate,
				IconManager.param(6),
				true
			],
			[
				`${TextManager.param(7)} Growth+`,
				J.NATURAL.RegExp.LuckGrowthPlus,
				IconManager.param(7),
				true
			],
			[
				`${TextManager.param(7)} Growth%`,
				J.NATURAL.RegExp.LuckGrowthRate,
				IconManager.param(7),
				true
			],
			[
				`${TextManager.xparam(0)} Buff+`,
				J.NATURAL.RegExp.HitBuffPlus,
				IconManager.xparam(0),
				false
			],
			[
				`${TextManager.xparam(0)} Buff%`,
				J.NATURAL.RegExp.HitBuffRate,
				IconManager.xparam(0),
				false
			],
			[
				`${TextManager.xparam(1)} Buff+`,
				J.NATURAL.RegExp.EvadeBuffPlus,
				IconManager.xparam(1),
				false
			],
			[
				`${TextManager.xparam(1)} Buff%`,
				J.NATURAL.RegExp.EvadeBuffRate,
				IconManager.xparam(1),
				false
			],
			[
				`${TextManager.xparam(2)} Buff+`,
				J.NATURAL.RegExp.CritChanceBuffPlus,
				IconManager.xparam(2),
				false
			],
			[
				`${TextManager.xparam(2)} Buff%`,
				J.NATURAL.RegExp.CritChanceBuffRate,
				IconManager.xparam(2),
				false
			],
			[
				`${TextManager.xparam(3)} Buff+`,
				J.NATURAL.RegExp.CritEvadeBuffPlus,
				IconManager.xparam(3),
				false
			],
			[
				`${TextManager.xparam(3)} Buff%`,
				J.NATURAL.RegExp.CritEvadeBuffRate,
				IconManager.xparam(3),
				false
			],
			[
				`${TextManager.xparam(7)} Buff+`,
				J.NATURAL.RegExp.LifeRegenBuffPlus,
				IconManager.xparam(7),
				false
			],
			[
				`${TextManager.xparam(7)} Buff%`,
				J.NATURAL.RegExp.LifeRegenBuffRate,
				IconManager.xparam(7),
				false
			],
			[
				`${TextManager.xparam(8)} Buff+`,
				J.NATURAL.RegExp.MagiRegenBuffPlus,
				IconManager.xparam(8),
				false
			],
			[
				`${TextManager.xparam(8)} Buff%`,
				J.NATURAL.RegExp.MagiRegenBuffRate,
				IconManager.xparam(8),
				false
			],
			[
				`${TextManager.xparam(9)} Buff+`,
				J.NATURAL.RegExp.TechRegenBuffPlus,
				IconManager.xparam(9),
				false
			],
			[
				`${TextManager.xparam(9)} Buff%`,
				J.NATURAL.RegExp.TechRegenBuffRate,
				IconManager.xparam(9),
				false
			],
			[
				`${TextManager.xparam(0)} Growth+`,
				J.NATURAL.RegExp.HitGrowthPlus,
				IconManager.xparam(0),
				true
			],
			[
				`${TextManager.xparam(0)} Growth%`,
				J.NATURAL.RegExp.HitGrowthRate,
				IconManager.xparam(0),
				true
			],
			[
				`${TextManager.xparam(1)} Growth+`,
				J.NATURAL.RegExp.EvadeGrowthPlus,
				IconManager.xparam(1),
				true
			],
			[
				`${TextManager.xparam(1)} Growth%`,
				J.NATURAL.RegExp.EvadeGrowthRate,
				IconManager.xparam(1),
				true
			],
			[
				`${TextManager.xparam(2)} Growth+`,
				J.NATURAL.RegExp.CritChanceGrowthPlus,
				IconManager.xparam(2),
				true
			],
			[
				`${TextManager.xparam(2)} Growth%`,
				J.NATURAL.RegExp.CritChanceGrowthRate,
				IconManager.xparam(2),
				true
			],
			[
				`${TextManager.xparam(7)} Growth+`,
				J.NATURAL.RegExp.LifeRegenGrowthPlus,
				IconManager.xparam(7),
				true
			],
			[
				`${TextManager.xparam(7)} Growth%`,
				J.NATURAL.RegExp.LifeRegenGrowthRate,
				IconManager.xparam(7),
				true
			],
			[
				`${TextManager.xparam(8)} Growth+`,
				J.NATURAL.RegExp.MagiRegenGrowthPlus,
				IconManager.xparam(8),
				true
			],
			[
				`${TextManager.xparam(8)} Growth%`,
				J.NATURAL.RegExp.MagiRegenGrowthRate,
				IconManager.xparam(8),
				true
			],
			[
				`${TextManager.xparam(9)} Growth+`,
				J.NATURAL.RegExp.TechRegenGrowthPlus,
				IconManager.xparam(9),
				true
			],
			[
				`${TextManager.xparam(9)} Growth%`,
				J.NATURAL.RegExp.TechRegenGrowthRate,
				IconManager.xparam(9),
				true
			],
			[
				`${TextManager.sparam(0)} Buff+`,
				J.NATURAL.RegExp.AggroBuffPlus,
				IconManager.sparam(0),
				false
			],
			[
				`${TextManager.sparam(0)} Buff%`,
				J.NATURAL.RegExp.AggroBuffRate,
				IconManager.sparam(0),
				false
			],
			[
				`${TextManager.sparam(1)} Buff+`,
				J.NATURAL.RegExp.ParryBuffPlus,
				IconManager.sparam(1),
				false
			],
			[
				`${TextManager.sparam(1)} Buff%`,
				J.NATURAL.RegExp.ParryBuffRate,
				IconManager.sparam(1),
				false
			],
			[
				`${TextManager.sparam(2)} Buff+`,
				J.NATURAL.RegExp.HealingBuffPlus,
				IconManager.sparam(2),
				false
			],
			[
				`${TextManager.sparam(2)} Buff%`,
				J.NATURAL.RegExp.HealingBuffRate,
				IconManager.sparam(2),
				false
			],
			[
				`${TextManager.sparam(4)} Buff+`,
				J.NATURAL.RegExp.MagiCostRateBuffPlus,
				IconManager.sparam(4),
				false
			],
			[
				`${TextManager.sparam(4)} Buff%`,
				J.NATURAL.RegExp.MagiCostRateBuffRate,
				IconManager.sparam(4),
				false
			],
			[
				`${TextManager.sparam(5)} Buff+`,
				J.NATURAL.RegExp.TechCostRateBuffPlus,
				IconManager.sparam(5),
				false
			],
			[
				`${TextManager.sparam(5)} Buff%`,
				J.NATURAL.RegExp.TechCostRateBuffRate,
				IconManager.sparam(5),
				false
			],
			[
				`${TextManager.sparam(6)} Buff+`,
				J.NATURAL.RegExp.PhysDmgRateBuffPlus,
				IconManager.sparam(6),
				false
			],
			[
				`${TextManager.sparam(6)} Buff%`,
				J.NATURAL.RegExp.PhysDmgRateBuffRate,
				IconManager.sparam(6),
				false
			],
			[
				`${TextManager.sparam(7)} Buff+`,
				J.NATURAL.RegExp.MagiDmgRateBuffPlus,
				IconManager.sparam(7),
				false
			],
			[
				`${TextManager.sparam(7)} Buff%`,
				J.NATURAL.RegExp.MagiDmgRateBuffRate,
				IconManager.sparam(7),
				false
			],
			[
				`${TextManager.sparam(0)} Growth+`,
				J.NATURAL.RegExp.AggroGrowthPlus,
				IconManager.sparam(0),
				true
			],
			[
				`${TextManager.sparam(0)} Growth%`,
				J.NATURAL.RegExp.AggroGrowthRate,
				IconManager.sparam(0),
				true
			],
			[
				`${TextManager.sparam(1)} Growth+`,
				J.NATURAL.RegExp.ParryGrowthPlus,
				IconManager.sparam(1),
				true
			],
			[
				`${TextManager.sparam(1)} Growth%`,
				J.NATURAL.RegExp.ParryGrowthRate,
				IconManager.sparam(1),
				true
			],
			[
				`${TextManager.sparam(2)} Growth+`,
				J.NATURAL.RegExp.HealingGrowthPlus,
				IconManager.sparam(2),
				true
			],
			[
				`${TextManager.sparam(2)} Growth%`,
				J.NATURAL.RegExp.HealingGrowthRate,
				IconManager.sparam(2),
				true
			],
			[
				`${TextManager.sparam(4)} Growth+`,
				J.NATURAL.RegExp.MagiCostRateGrowthPlus,
				IconManager.sparam(4),
				true
			],
			[
				`${TextManager.sparam(4)} Growth%`,
				J.NATURAL.RegExp.MagiCostRateGrowthRate,
				IconManager.sparam(4),
				true
			],
			[
				`${TextManager.sparam(5)} Growth+`,
				J.NATURAL.RegExp.TechCostRateGrowthPlus,
				IconManager.sparam(5),
				true
			],
			[
				`${TextManager.sparam(5)} Growth%`,
				J.NATURAL.RegExp.TechCostRateGrowthRate,
				IconManager.sparam(5),
				true
			],
			[
				`${TextManager.sparam(6)} Growth+`,
				J.NATURAL.RegExp.PhysDmgRateGrowthPlus,
				IconManager.sparam(6),
				true
			],
			[
				`${TextManager.sparam(6)} Growth%`,
				J.NATURAL.RegExp.PhysDmgRateGrowthRate,
				IconManager.sparam(6),
				true
			],
			[
				`${TextManager.sparam(7)} Growth+`,
				J.NATURAL.RegExp.MagiDmgRateGrowthPlus,
				IconManager.sparam(7),
				true
			],
			[
				`${TextManager.sparam(7)} Growth%`,
				J.NATURAL.RegExp.MagiDmgRateGrowthRate,
				IconManager.sparam(7),
				true
			],
			[
				`${TextManager.maxTp()} Base`,
				J.NATURAL.RegExp.BaseMaxTech,
				IconManager.maxTp(),
				false
			],
			[
				`${TextManager.maxTp()} Buff+`,
				J.NATURAL.RegExp.MaxTechBuffPlus,
				IconManager.maxTp(),
				false
			],
			[
				`${TextManager.maxTp()} Buff%`,
				J.NATURAL.RegExp.MaxTechBuffRate,
				IconManager.maxTp(),
				false
			],
			[
				`${TextManager.maxTp()} Growth+`,
				J.NATURAL.RegExp.MaxTechGrowthPlus,
				IconManager.maxTp(),
				true
			],
			[
				`${TextManager.maxTp()} Growth%`,
				J.NATURAL.RegExp.MaxTechGrowthRate,
				IconManager.maxTp(),
				true
			]
		];
		checks.forEach(([label, regexp, icon, isGrowth]) => {
			const formula = RPGManager.getStringFromNoteByRegex(state, regexp);
			if (formula) {
				const evaluated = this.evaluateFormula(formula, this.actor());
				const sign = Number(evaluated) >= 0 ? "+" : "";
				const value = isGrowth ? `${sign}${evaluated} /lv` : `${sign}${evaluated}`;
				lines.push({
					icon,
					label,
					value
				});
			}
		});
		return lines;
	}
	/**
	* Draws the Elements section in the middle column.
	* Element icons replace text names throughout — the icon is the identifier,
	* keeping the display language-agnostic.
	*
	* Element rate traits (code 11) use invertColor because a higher incoming
	* damage rate is a vulnerability, not a benefit.
	* Attack element traits (code 31) show the element icon with "Atk Element".
	* J-ELEM boost and absorb rows supply their own icon from collectElemLines.
	* Skipped when the state has no elemental content.
	* @param {RPG_State} state The state being detailed.
	*/
	drawElementsSection(state) {
		const dmgInTraits = this.filterTraits(state, [11]);
		const atkElemTraits = this.filterTraits(state, [31]);
		const elemLines = this.collectElemLines(state);
		if (dmgInTraits.length === 0 && atkElemTraits.length === 0 && elemLines.length === 0) return;
		this.drawDetailSectionHeader("Elements");
		dmgInTraits.forEach((rawTrait) => {
			const trait = new RPG_Trait(rawTrait);
			this.drawDetailRow(IconManager.element(trait.dataId), "Dmg In", trait.textValue(), true);
		});
		atkElemTraits.forEach((rawTrait) => {
			const trait = new RPG_Trait(rawTrait);
			this.drawDetailRow(IconManager.element(trait.dataId), "Extra Attack Element", "");
		});
		elemLines.forEach(({ icon, label, value }) => {
			this.drawDetailRow(icon, label, value);
		});
	}
	/**
	* Collects display rows from J-ELEM tags on the state.
	* Each row uses the element's icon as the primary identifier rather than its name.
	* Boost rows show outgoing damage amplification per element.
	* Absorbed elements produce one row each with no value — the icon is the payload.
	* Returns an empty array when J-ELEM is not loaded.
	* @param {RPG_State} state The state to check.
	* @returns {Array<{icon: number, label: string, value: string}>}
	*/
	collectElemLines(state) {
		if (!J.ELEM) return [];
		const lines = [];
		const boostCaptures = RPGManager.getArraysFromNotesByRegex(state, J.ELEM.RegExp.BoostElement);
		if (boostCaptures && boostCaptures.length > 0) {
			boostCaptures.forEach(([elementId, pct]) => {
				const sign = pct >= 0 ? "+" : "";
				lines.push({
					icon: IconManager.element(elementId),
					label: "Boost",
					value: `${sign}${pct}%`
				});
			});
		}
		const absorbIds = RPGManager.getNumbersFromNoteByRegex(state, J.ELEM.RegExp.AbsorbElementIds);
		if (absorbIds && absorbIds.length > 0) {
			absorbIds.forEach((id) => {
				lines.push({
					icon: IconManager.element(id),
					label: "Absorbed",
					value: ""
				});
			});
		}
		return lines;
	}
	/**
	* Draws the Ailments section in the right column.
	* Covers debuff rate (code 12), state rate (code 13), state nullify (code 14),
	* and attack state inflict (code 32).
	* @param {RPG_State} state The state being detailed.
	*/
	drawAilmentsSection(state) {
		const ailmentTraits = this.filterTraits(state, [
			12,
			13,
			14,
			32
		]);
		if (ailmentTraits.length === 0) return;
		this.drawDetailSectionHeader("Ailments");
		ailmentTraits.forEach((rawTrait) => {
			const trait = new RPG_Trait(rawTrait);
			this.drawDetailRow(this.ailmentIconForTrait(trait), trait.textName(), trait.textValue());
		});
	}
	/**
	* Returns the icon for an ailment-related trait.
	* @param {RPG_Trait} trait The trait to resolve an icon for.
	* @returns {number}
	*/
	ailmentIconForTrait(trait) {
		switch (trait.code) {
			case 12: return IconManager.param(trait.dataId);
			case 13:
			case 14: return $dataStates[trait.dataId] ? $dataStates[trait.dataId].iconIndex : 0;
			case 32: return $dataStates[trait.dataId] ? $dataStates[trait.dataId].iconIndex : 0;
			default: return 0;
		}
	}
	/**
	* Draws the Skills section in the right column.
	* Covers skill-type unlock/lock (codes 41–42) and individual skill learn/seal (codes 43–44).
	* @param {RPG_State} state The state being detailed.
	*/
	drawSkillsSection(state) {
		const skillTraits = this.filterTraits(state, [
			41,
			42,
			43,
			44
		]);
		if (skillTraits.length === 0) return;
		this.drawDetailSectionHeader("Skills");
		skillTraits.forEach((rawTrait) => {
			const trait = new RPG_Trait(rawTrait);
			let icon = 0;
			if (trait.code === 43 || trait.code === 44) {
				icon = $dataSkills[trait.dataId] ? $dataSkills[trait.dataId].iconIndex : 0;
			}
			this.drawDetailRow(icon, trait.textName(), trait.textValue());
		});
	}
	/**
	* Draws the Equip section in the right column.
	* Covers weapon/armor proficiency (codes 51–52), equip lock/seal (codes 53–54),
	* and dual-wield enable (code 55).
	* @param {RPG_State} state The state being detailed.
	*/
	drawEquipSection(state) {
		const equipTraits = this.filterTraits(state, [
			51,
			52,
			53,
			54,
			55
		]);
		if (equipTraits.length === 0) return;
		this.drawDetailSectionHeader("Equip");
		equipTraits.forEach((rawTrait) => {
			const trait = new RPG_Trait(rawTrait);
			this.drawDetailRow(0, trait.textName(), trait.textValue());
		});
	}
	/**
	* Draws the Properties section in the right column.
	* Covers skill speed (code 33), attack times+ (code 34), basic-attack override
	* (code 35), action times+ (code 61), special flags (code 62), and party ability (code 64).
	* @param {RPG_State} state The state being detailed.
	*/
	drawPropertiesSection(state) {
		const propTraits = this.filterTraits(state, [
			33,
			34,
			35,
			61,
			62,
			64
		]);
		if (propTraits.length === 0) return;
		this.drawDetailSectionHeader("Properties");
		propTraits.forEach((rawTrait) => {
			const trait = new RPG_Trait(rawTrait);
			const icon = trait.code === 35 && $dataSkills[trait.dataId] ? $dataSkills[trait.dataId].iconIndex : 0;
			this.drawDetailRow(icon, trait.textName(), trait.textValue());
		});
	}
	/**
	* Draws the Rewards section in the right column.
	* Sources: J-Drops, J-Crit, J-SDP, J-Prof, J-Natural reward formulas.
	* Skipped when none have relevant tags on this state.
	* @param {RPG_State} state The state being detailed.
	*/
	drawRewardsSection(state) {
		const rows = this.collectRewardRows(state);
		if (rows.length === 0) return;
		this.drawDetailSectionHeader("Rewards");
		rows.forEach(({ icon, label, value }) => {
			this.drawDetailRow(icon, label, value);
		});
	}
	/**
	* Collects all reward row data from the various reward-contributing plugins.
	* @param {RPG_State} state The state to check.
	* @returns {Array<{icon: number, label: string, value: string}>}
	*/
	collectRewardRows(state) {
		const rows = [];
		if (J.DROPS) {
			const dropMult = RPGManager.getNumberFromNoteByRegex(state, J.DROPS.RegExp.DropMultiplier);
			if (dropMult) {
				rows.push({
					icon: IconManager.parameterIcon("dor"),
					label: "Drop Rate",
					value: `${dropMult > 0 ? "+" : ""}${dropMult}%`
				});
			}
			const goldMult = RPGManager.getNumberFromNoteByRegex(state, J.DROPS.RegExp.GoldMultiplier);
			if (goldMult) {
				rows.push({
					icon: IconManager.parameterIcon("gdr"),
					label: "Gold",
					value: `${goldMult > 0 ? "+" : ""}${goldMult}%`
				});
			}
		}
		if (J.SDP) {
			const sdpMult = RPGManager.getNumberFromNoteByRegex(state, J.SDP.RegExp.SdpMultiplier);
			if (sdpMult) {
				rows.push({
					icon: IconManager.parameterIcon("sdr"),
					label: "SDP Points",
					value: `${sdpMult > 0 ? "+" : ""}${sdpMult}%`
				});
			}
		}
		if (J.APT) {
			const aptMult = RPGManager.getNumberFromNoteByRegex(state, J.APT.RegExp.AptMultiplier);
			if (aptMult) {
				rows.push({
					icon: IconManager.parameterIcon("apr"),
					label: "APT Rate",
					value: `${aptMult > 0 ? "+" : ""}${aptMult}%`
				});
			}
		}
		if (J.PROF) {
			const profBonus = RPGManager.getNumberFromNoteByRegex(state, J.PROF.RegExp.ProficiencyBonus);
			if (profBonus) rows.push({
				icon: IconManager.parameterIcon("prof"),
				label: "Proficiency Bonus",
				value: `+${profBonus}`
			});
		}
		if (J.NATURAL) {
			const expFormula = RPGManager.getStringFromNoteByRegex(state, J.NATURAL.RegExp.RewardExp);
			if (expFormula) {
				rows.push({
					icon: 0,
					label: "EXP Bonus",
					value: this.evaluateFormula(expFormula, this.actor())
				});
			}
			const goldFormula = RPGManager.getStringFromNoteByRegex(state, J.NATURAL.RegExp.RewardGold);
			if (goldFormula) {
				rows.push({
					icon: 0,
					label: "Gold Bonus",
					value: this.evaluateFormula(goldFormula, this.actor())
				});
			}
			const sdpFormula = RPGManager.getStringFromNoteByRegex(state, J.NATURAL.RegExp.RewardSdps);
			if (sdpFormula) {
				rows.push({
					icon: 0,
					label: "SDP Bonus",
					value: this.evaluateFormula(sdpFormula, this.actor())
				});
			}
		}
		return rows;
	}
};

//#endregion
//#region src/plugins/passive/core/scenes/Scene_Passive.js
/**
* The dedicated viewer scene for all passive states applied to an actor.
*
* Passive states are grouped into tabs registered via {@link Scene_Passive.registerTab}.
* The core always provides an "All" tab; extensions register additional tabs during
* their own initialization phases (e.g. the OTIB ext registers an "Item Boosts" tab).
*
* Layout is inherited rather than declared. {@link Scene_ActorFacetBase} supplies the help window
* across the top, the actor ribbon beneath it, and the control legend across the bottom, and hands
* down {@link Scene_ActorFacetBase.contentAreaRect} as the region left over. This scene therefore
* describes only what is particular to it, within that region:
*
* - a tab header strip across the top of the content area
* - left column: scrollable state list, filtered by the active tab
* - right column: detail panel for the currently highlighted state
*/
var Scene_Passive = class extends Scene_ActorFacetBase {
	/**
	* Tab configurations in registration order; the core seeds the "All" tab first.
	* @type {Array<{key: string, label: string, filter: Function|null}>}
	*/
	static _tabRegistry = [{
		key: "all",
		label: "All",
		filter: null
	}];
	static callScene() {
		SceneManager.push(this);
	}
	/**
	* Registers a tab configuration with the passive viewer.
	* Tabs are displayed in registration order; "All" is always first.
	*
	* Config shape:
	* {
	*   key:    {string}            unique identifier for this tab
	*   label:  {string}            display label shown in the tab header
	*   filter: {Function|null}     (stateId, actor) => boolean, or null to show everything
	* }
	*
	* @param {{key: string, label: string, filter: Function|null}} config Tab configuration.
	*/
	static registerTab(config) {
		this.tabRegistry().push(config);
	}
	/**
	* Gets all registered tab configurations in registration order.
	* @returns {Array<{key: string, label: string, filter: Function|null}>}
	*/
	static registeredTabs() {
		return this.tabRegistry();
	}
	/**
	* Constructor.
	*
	* No explicit `initialize()` call: the engine's own scene constructor performs one, and a second would
	* run the whole initialization twice.
	*/
	constructor() {
		super();
	}
	/**
	* Extends {@link Scene_ActorFacetBase.initMembers}.<br/>
	* Also initializes the properties particular to the passive viewer.
	*/
	initMembers() {
		super.initMembers();
		/**
		* A grouping of all properties associated with the passive viewer.
		*/
		this._j._passive = {};
		/**
		* A grouping of all windows associated with this scene.
		*/
		this._j._passive._windows = {};
		/**
		* The tab header strip window.
		* @type {Window_PassiveTabHeader}
		*/
		this._j._passive._windows._tabHeader = null;
		/**
		* The scrollable list of passive states for the active tab.
		* @type {Window_PassiveList}
		*/
		this._j._passive._windows._list = null;
		/**
		* The detail panel for the currently highlighted passive state.
		* @type {Window_PassiveDetail}
		*/
		this._j._passive._windows._detail = null;
		/**
		* The index of the currently active tab in the registry.
		* Index 0 is always the built-in "All" tab.
		* @type {number}
		*/
		this._j._passive._tabIndex = 0;
	}
	/**
	* Gets the tab registry.
	* @returns {*} The tabRegistry.
	*/
	static tabRegistry() {
		return this._tabRegistry;
	}
	/**
	* Gets the j.
	* @returns {*} The j.
	*/
	j() {
		return this._j;
	}
	/**
	* Extends {@link Scene_ActorFacetBase.create}.<br/>
	* Also creates the windows particular to this scene.
	*/
	create() {
		super.create();
		this.createHelpWindow();
		this.createDisplayObjects();
	}
	/**
	* Creates the display objects for this scene.
	*/
	createDisplayObjects() {
		this.createAllWindows();
	}
	/**
	* Overwrites {@link #createButtons}.<br/>
	* Removes the rendering of buttons from this scene.
	*/
	createButtons() {}
	/**
	* Creates all windows associated with the passive viewer scene.
	*/
	createAllWindows() {
		this.createPassiveTabHeaderWindow();
		this.createPassiveDetailWindow();
		this.createPassiveListWindow();
		this.onPassiveHoveredChange();
	}
	/**
	* Overrides {@link Scene_ActorFacetBase.buildActorRibbonWindow}.<br/>
	* Supplies a ribbon that names the actor as well as showing their face.
	*
	* This is the extension point rather than building a ribbon and placing it by hand: the base owns
	* where the ribbon sits and how tall it is, and only the contents differ.
	* @param {Rectangle} rectangle The rectangle to build the window within.
	* @returns {Window_PassiveActorRibbon}
	*/
	buildActorRibbonWindow(rectangle) {
		return new Window_PassiveActorRibbon(rectangle);
	}
	/**
	* The pixel height of the tab header strip.
	* Matches one text row including window padding.
	* @returns {number}
	*/
	passiveTabHeaderHeight() {
		return this.calcWindowHeight(1, false);
	}
	/**
	* The proportion of the content area given to the state list.
	*
	* A ratio rather than a pixel width, so the split holds at any resolution- and so that the detail
	* panel can be defined as the remainder instead of a second number that has to agree with the first.
	* @returns {number}
	*/
	passiveListRatio() {
		return .4;
	}
	/**
	* The pixel width of the passive state list column.
	* @returns {number}
	*/
	passiveListWidth() {
		return Math.round(this.contentAreaRect().width * this.passiveListRatio());
	}
	/**
	* Overrides {@link Scene_ActorFacetBase.actorRibbonWindowRect}.<br/>
	* Narrows the ribbon to sit above the state list rather than spanning the screen.
	*
	* The base spans the full width because most facet scenes want that, but a ribbon holding a cropped
	* face and one name has nothing to do with the remaining sixteen hundred pixels. Confining it to the
	* left column lets the detail panel beside it start from the very top instead.
	* @returns {Rectangle}
	*/
	actorRibbonWindowRect() {
		const facetArea = this.facetAreaRect();
		return new Rectangle(facetArea.x, facetArea.y, this.passiveListWidth(), this.actorRibbonHeight());
	}
	/**
	* Implements {@link Scene_MenuFacetBase.controlLegendEntries}.<br/>
	* Describes the controls this scene responds to.
	*
	* Note that there is no `ok` entry: nothing in here is chosen, only read. Teaching a button that does
	* nothing would be worse than teaching nothing.
	* @returns {{semantic: (string|string[]), label: string}[]}
	*/
	controlLegendEntries() {
		return [
			{
				semantic: ["content-prev", "content-next"],
				label: "switch tab"
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
	* Creates the tab header strip window.
	*/
	createPassiveTabHeaderWindow() {
		const window = this.buildPassiveTabHeaderWindow();
		this.setPassiveTabHeaderWindow(window);
		this.addWindow(window);
	}
	/**
	* Builds the tab header window.
	* @returns {Window_PassiveTabHeader}
	*/
	buildPassiveTabHeaderWindow() {
		const rectangle = this.passiveTabHeaderRectangle();
		return new Window_PassiveTabHeader(rectangle);
	}
	/**
	* Gets the rectangle for the tab header strip.
	*
	* Confined to the left column, directly beneath the ribbon and directly above the list. The tab names
	* which subset of *the list* is showing, so the list's width is the honest width for it- it has no
	* bearing on the detail panel beside it.
	* @returns {Rectangle}
	*/
	passiveTabHeaderRectangle() {
		const contentArea = this.contentAreaRect();
		return new Rectangle(contentArea.x, contentArea.y, this.passiveListWidth(), this.passiveTabHeaderHeight());
	}
	/**
	* Gets the tracked tab header window.
	* @returns {Window_PassiveTabHeader}
	*/
	getPassiveTabHeaderWindow() {
		return this.j()._passive._windows._tabHeader;
	}
	/**
	* Sets the tracked tab header window.
	* @param {Window_PassiveTabHeader} tabHeaderWindow The window to track.
	*/
	setPassiveTabHeaderWindow(tabHeaderWindow) {
		this.j()._passive._windows._tabHeader = tabHeaderWindow;
	}
	/**
	* Creates the passive state list window.
	*/
	createPassiveListWindow() {
		const window = this.buildPassiveListWindow();
		this.setPassiveListWindow(window);
		this.addWindow(window);
		window.select(0);
		window.activate();
	}
	/**
	* Builds and configures the passive state list window.
	* @returns {Window_PassiveList}
	*/
	buildPassiveListWindow() {
		const rectangle = this.passiveListRectangle();
		const window = new Window_PassiveList(rectangle);
		window.setHandler("cancel", this.popScene.bind(this));
		window.setHandler("content-prev", this.cycleTabLeft.bind(this));
		window.setHandler("content-next", this.cycleTabRight.bind(this));
		window.setHandler("actor-next", this.nextActor.bind(this));
		window.setHandler("actor-prev", this.previousActor.bind(this));
		window.onIndexChange = this.onPassiveHoveredChange.bind(this);
		window.setActor($gameParty.menuActor());
		return window;
	}
	/**
	* Gets the rectangle for the passive state list column.
	* Occupies the left of the content area, beneath the tab header.
	* @returns {Rectangle}
	*/
	passiveListRectangle() {
		const contentArea = this.contentAreaRect();
		const y = contentArea.y + this.passiveTabHeaderHeight();
		return new Rectangle(contentArea.x, y, this.passiveListWidth(), contentArea.height - this.passiveTabHeaderHeight());
	}
	/**
	* Gets the tracked passive list window.
	* @returns {Window_PassiveList}
	*/
	getPassiveListWindow() {
		return this.j()._passive._windows._list;
	}
	/**
	* Sets the tracked passive list window.
	* @param {Window_PassiveList} listWindow The window to track.
	*/
	setPassiveListWindow(listWindow) {
		this.j()._passive._windows._list = listWindow;
	}
	/**
	* Creates the passive state detail window.
	*/
	createPassiveDetailWindow() {
		const window = this.buildPassiveDetailWindow();
		this.setPassiveDetailWindow(window);
		this.addWindow(window);
	}
	/**
	* Builds the passive state detail window.
	* @returns {Window_PassiveDetail}
	*/
	buildPassiveDetailWindow() {
		const rectangle = this.passiveDetailRectangle();
		const window = new Window_PassiveDetail(rectangle);
		window.setActor($gameParty.menuActor());
		window.deactivate();
		return window;
	}
	/**
	* Gets the rectangle for the detail panel.
	*
	* Takes the whole right side, full height, starting from the very top of the region- above where the
	* ribbon and tab header sit, because neither of those extends this far across. Its width is the
	* *remainder* of the region rather than its own fraction, so the two columns cannot drift apart or
	* leave a seam however the list's ratio is tuned.
	* @returns {Rectangle}
	*/
	passiveDetailRectangle() {
		const facetArea = this.facetAreaRect();
		const listWidth = this.passiveListWidth();
		return new Rectangle(facetArea.x + listWidth, facetArea.y, facetArea.width - listWidth, facetArea.height);
	}
	/**
	* Gets the tracked passive detail window.
	* @returns {Window_PassiveDetail}
	*/
	getPassiveDetailWindow() {
		return this.j()._passive._windows._detail;
	}
	/**
	* Sets the tracked passive detail window.
	* @param {Window_PassiveDetail} detailWindow The window to track.
	*/
	setPassiveDetailWindow(detailWindow) {
		this.j()._passive._windows._detail = detailWindow;
	}
	/**
	* Gets the tab configuration at the current tab index.
	* @returns {{key: string, label: string, filter: Function|null}}
	*/
	currentTab() {
		return this.constructor._tabRegistry[this.j()._passive._tabIndex];
	}
	/**
	* Advances to the next tab in the registry, wrapping around from the last to the first.
	*/
	cycleTabRight() {
		const tabCount = this.constructor._tabRegistry.length;
		this.j()._passive._tabIndex = (this.j()._passive._tabIndex + 1) % tabCount;
		this.applyCurrentTab();
	}
	/**
	* Retreats to the previous tab in the registry, wrapping from the first to the last.
	*/
	cycleTabLeft() {
		const tabCount = this.constructor._tabRegistry.length;
		this.j()._passive._tabIndex = (this.j()._passive._tabIndex - 1 + tabCount) % tabCount;
		this.applyCurrentTab();
	}
	/**
	* Applies the current tab's filter to the list and refreshes all affected windows.
	*/
	applyCurrentTab() {
		const { filter, label } = this.currentTab();
		this.getPassiveListWindow().setTabFilter(filter);
		this.getPassiveListWindow().select(0);
		this.getPassiveTabHeaderWindow().setLabel(label);
		this.getPassiveListWindow().activate();
		this.onPassiveHoveredChange();
	}
	/**
	* Refreshes the detail window whenever the highlighted state in the list changes.
	*/
	onPassiveHoveredChange() {
		const state = this.getPassiveListWindow().currentPassiveState();
		this.getPassiveDetailWindow().setState(state);
		this.helpWindow().setText(this.describeHoveredPassive(state));
	}
	/**
	* Describes the highlighted passive state for the help window.
	* @param {?RPG_State} state The highlighted state, or null when the list is empty.
	* @returns {string}
	*/
	describeHoveredPassive(state) {
		if (state === null) return "No passive states are currently applied.";
		return state.description;
	}
	/**
	* Extends {@link Scene_ActorFacetBase.onActorChange}.<br/>
	* Refreshes this scene's actor-driven windows whenever the party's menu actor changes.
	*/
	onActorChange() {
		super.onActorChange();
		const actor = $gameParty.menuActor();
		this.getPassiveListWindow().setActor(actor);
		this.getPassiveDetailWindow().setActor(actor);
		this.getPassiveListWindow().select(0);
		this.getPassiveListWindow().activate();
		this.onPassiveHoveredChange();
	}
};

//#endregion
//#region src/plugins/passive/core/scenes/Scene_Menu.js
/**
* Extends {@link #createCommandWindow}.<br/>
* Wires the passive-menu symbol to the Passives viewer scene.
*/
J.PASSIVE.Aliased.Scene_Menu.set("createCommandWindow", Scene_Menu.prototype.createCommandWindow);
Scene_Menu.prototype.createCommandWindow = function() {
	J.PASSIVE.Aliased.Scene_Menu.get("createCommandWindow").call(this);
	this.commandWindow().setHandler("passive-menu", this.commandPassive.bind(this));
};
/**
* Opens the passive state viewer for the current menu actor.
*/
Scene_Menu.prototype.commandPassive = function() {
	Scene_Passive.callScene();
};

//#endregion
//#region src/plugins/passive/core/windows/Window_MenuCommand.js
/**
* Extends {@link #makeCommandList}.<br/>
* Adds the Passives viewer command to the main menu command list.
*/
J.PASSIVE.Aliased.Window_MenuCommand.set("makeCommandList", Window_MenuCommand.prototype.makeCommandList);
Window_MenuCommand.prototype.makeCommandList = function() {
	J.PASSIVE.Aliased.Window_MenuCommand.get("makeCommandList").call(this);
	if (!this.canAddPassivesCommand()) return;
	const command = new WindowCommandBuilder(J.PASSIVE.Metadata.commandName).setSymbol("passive-menu").setHelpText("Review the always-active effects this character benefits from.").setMenuSection(MenuSection.Actor).setEnabled(true).setIconIndex(J.PASSIVE.Metadata.commandIconIndex).build();
	const lastCommand = this.commandList().at(-1);
	if (lastCommand.symbol === "gameEnd") {
		this.commandList().splice(this.commandList().length - 2, 0, command);
	} else {
		this.addBuiltCommand(command);
	}
};
/**
* Determines whether the Passives command should be added to the menu.
* @returns {boolean}
*/
Window_MenuCommand.prototype.canAddPassivesCommand = function() {
	return $gameSwitches.value(J.PASSIVE.Metadata.menuSwitchId);
};

//#endregion
//#region src/plugins/passive/core/windows/Window_MoreEquipData.js
/**
* Extends {@link #addJabsEquipmentData}.<br/>
* Includes additional entries about passive states provided by the equipment.
*/
J.PASSIVE.Aliased.Window_MoreEquipData.set("addJabsEquipmentData", Window_MoreEquipData.prototype.addJabsEquipmentData);
Window_MoreEquipData.prototype.addJabsEquipmentData = function() {
	J.PASSIVE.Aliased.Window_MoreEquipData.get("addJabsEquipmentData").call(this);
	this.addPassiveStateData();
};
/**
* Adds all passive states found across the item.
*/
Window_MoreEquipData.prototype.addPassiveStateData = function() {
	if (!this.canAddPassiveStateData()) return;
	const stackablePassiveIds = this.item.equippedPassiveStateIds;
	const uniquePassiveIds = this.item.uniqueEquippedPassiveStateIds;
	const allIds = [...stackablePassiveIds, ...uniquePassiveIds].sort();
	const forEacher = (passiveStateId) => {
		const state = this.actor.state(passiveStateId);
		const { name, iconIndex } = state;
		const commandName = `Passive: ${name}`;
		const command = new WindowCommandBuilder(commandName).setIconIndex(iconIndex).setExtensionData(state).build();
		this.addBuiltCommand(command);
	};
	allIds.forEach(forEacher, this);
};
/**
* Determines whether or not the passive state data for this item can be added.
* @returns {boolean} True if allowed, false otherwise.
*/
Window_MoreEquipData.prototype.canAddPassiveStateData = function() {
	if (!this.item) return false;
	return true;
};

//#endregion
//# sourceMappingURL=J-Passive.js.map