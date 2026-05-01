//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v2.0.2 PASSIVE] Grants passive states from various database objects.
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
 * twice, while 11, 12, and 13 would be applied only once.
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
 * CHANGELOG:
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

//region plugin metadata
class JPassive_PluginMetadata
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
   * Extends {@link #postInitialize}.<br>
   * Includes translation of plugin parameters.
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
     * The id of a switch that controls whether the Passives command is visible in the menu.
     * A value of 0 means always show, regardless of switch state.
     * Configured via plugin parameter "menuSwitch".
     * @type {number}
     */
    this.menuSwitchId = parseInt(this.parsedPluginParameters['menuSwitch']);

    /**
     * The label shown for the Passives command in the main menu.
     * Configured via plugin parameter "menuCommandName".
     * @type {string}
     */
    this.commandName = this.parsedPluginParameters['menuCommandName'] ?? 'Passives';

    /**
     * The icon index shown beside the Passives command in the main menu.
     * Configured via plugin parameter "menuCommandIcon".
     * @type {number}
     */
    this.commandIconIndex = parseInt(this.parsedPluginParameters['menuCommandIcon']);
  }
}
//endregion plugin metadata

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

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
J.PASSIVE.Metadata = new JPassive_PluginMetadata('J-Passive', '2.0.2');

/**
 * All regular expressions used by this plugin.
 */
J.PASSIVE.RegExp = {};
J.PASSIVE.RegExp.EquippedPassiveStateIds = /<equippedPassive:[ ]?(\[[\d, ]+])>/gi;
J.PASSIVE.RegExp.UniqueEquippedPassiveStateIds = /<uniqueEquippedPassive:[ ]?(\[[\d, ]+])>/gi;
J.PASSIVE.RegExp.PassiveStateIds = /<passive:[ ]?(\[[\d, ]+])>/gi;
J.PASSIVE.RegExp.UniquePassiveStateIds = /<uniquePassive:[ ]?(\[[\d, ]+])>/gi;

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
//endregion Introduction

//region RPG_BaseBattler
//region passive state ids
/**
 * The passive state ids that this item possesses.
 * @type {number[]}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "passiveStateIds", {
  get: function()
  {
    return RPGManager.getNumbersFromNoteByRegex(this, J.PASSIVE.RegExp.PassiveStateIds);
  },
});
//endregion passive state ids

//region unique passive state ids
/**
 * The passive state ids that this item possesses.
 * @type {number[]}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "uniquePassiveStateIds", {
  get: function()
  {
    return RPGManager.getNumbersFromNoteByRegex(this, J.PASSIVE.RegExp.UniquePassiveStateIds);
  },
});
//endregion unique passive state ids

//region equipped passive state ids
/**
 * The battler itself cannot be equipped, thus it cannot have equipped passive states.
 * @type {Array.empty}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "equippedPassiveStateIds", {
  get: function()
  {
    return Array.empty;
  },
});
//endregion equipped passive state ids

//region unique equipped passive state ids
/**
 * The battler itself cannot be equipped, thus it cannot have equipped passive states.
 * @type {Array.empty}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "uniqueEquippedPassiveStateIds", {
  get: function()
  {
    return Array.empty;
  },
});
//endregion unique equipped passive state ids
//endregion RPG_BaseBattler

//region RPG_BaseItem
//region passive state ids
/**
 * The passive state ids that this item possesses.
 * @type {number[]}
 */
Object.defineProperty(RPG_BaseItem.prototype, "passiveStateIds", {
  get: function()
  {
    return RPGManager.getNumbersFromNoteByRegex(this, J.PASSIVE.RegExp.PassiveStateIds);
  },
});
//endregion passive state ids

//region unique passive state ids
/**
 * The non-duplicative passive state ids that this item possesses.
 * @type {number[]}
 */
Object.defineProperty(RPG_BaseItem.prototype, "uniquePassiveStateIds", {
  get: function()
  {
    return RPGManager.getNumbersFromNoteByRegex(this, J.PASSIVE.RegExp.UniquePassiveStateIds);
  },
});
//endregion unique passive state ids

//region equipped passive state ids
/**
 * The passive state ids that this equipment will apply while this equip is equipped.
 * @type {number[]}
 */
Object.defineProperty(RPG_BaseItem.prototype, "equippedPassiveStateIds", {
  get: function()
  {
    return RPGManager.getNumbersFromNoteByRegex(this, J.PASSIVE.RegExp.EquippedPassiveStateIds);
  },
});
//endregion equipped passive state ids

//region unique equipped passive state ids
/**
 * The non-duplicative passive state ids that this equipment will apply
 * while this equip is equipped.
 * @type {number[]}
 */
Object.defineProperty(RPG_BaseItem.prototype, "uniqueEquippedPassiveStateIds", {
  get: function()
  {
    return RPGManager.getNumbersFromNoteByRegex(this, J.PASSIVE.RegExp.UniqueEquippedPassiveStateIds);
  },
});
//endregion unique equipped passive state ids
//endregion RPG_BaseItem

//region RPG_Class
//region passive state ids
/**
 * The passive state ids that this item possesses.
 * @type {number[]}
 */
Object.defineProperty(RPG_Class.prototype, "passiveStateIds", {
  get: function()
  {
    return RPGManager.getNumbersFromNoteByRegex(this, J.PASSIVE.RegExp.PassiveStateIds);
  },
});
//endregion passive state ids

//region unique passive state ids
/**
 * The non-duplicative passive state ids that this item possesses.
 * @type {number[]}
 */
Object.defineProperty(RPG_Class.prototype, "uniquePassiveStateIds", {
  get: function()
  {
    return RPGManager.getNumbersFromNoteByRegex(this, J.PASSIVE.RegExp.UniquePassiveStateIds);
  },
});
//endregion unique passive state ids

//region equipped passive state ids
/**
 * The passive state ids that this equipment will apply while this equip is equipped.
 * @type {number[]}
 */
Object.defineProperty(RPG_Class.prototype, "equippedPassiveStateIds", {
  get: function()
  {
    return RPGManager.getNumbersFromNoteByRegex(this, J.PASSIVE.RegExp.EquippedPassiveStateIds);
  },
});
//endregion equipped passive state ids

//region unique equipped passive state ids
/**
 * The non-duplicative passive state ids that this equipment will apply
 * while this equip is equipped.
 * @type {number[]}
 */
Object.defineProperty(RPG_Class.prototype, "uniqueEquippedPassiveStateIds", {
  get: function()
  {
    return RPGManager.getNumbersFromNoteByRegex(this, J.PASSIVE.RegExp.UniqueEquippedPassiveStateIds);
  },
});
//endregion unique equipped passive state ids
//endregion RPG_Class

//region Game_Actor
/**
 * Extends {@link #onSetup}.<br>
 * Also refreshes the passive states on this battler for the first time.
 * @param {number} actorId The battler's id.
 */
J.PASSIVE.Aliased.Game_Actor.set('onSetup', Game_Actor.prototype.onSetup);
Game_Actor.prototype.onSetup = function(actorId)
{
  // perform original logic.
  J.PASSIVE.Aliased.Game_Actor.get('onSetup')
    .call(this, actorId);

  // refresh all passive states on this battler.
  this.refreshPassiveStates();
};

/**
 * Gets all sources from which this battler can derive passive state from.
 *
 * This does include a reference call to potentially getting passive states, but due
 * to control flows, this should always come back with no passive states in the list.
 * @returns {(RPG_Actor|RPG_Enemy|RPG_Class|RPG_Skill|RPG_EquipItem|RPG_State)[]}
 */
Game_Actor.prototype.getPassiveStateSources = function()
{
  // perform original logic to get base sources.
  const originalSources = Game_Battler.prototype.getPassiveStateSources.call(this);

  // define additional sources that actors can derive passive states from.
  const actorPassiveSources = [
    // all equipment currently equipped on the actor.
    ...this.equippedEquips(),

    // also add the class for this
    this.currentClass(), ];

  // combine the sources.
  const combinedSources = originalSources.concat(actorPassiveSources);

  // return this collection of stuff.
  return combinedSources;
};

/**
 * Extends {@link #traitObjects}.<br>
 * When considering traits, also include the actor's and party's passive states.
 */
J.PASSIVE.Aliased.Game_Actor.set('traitObjects', Game_Actor.prototype.traitObjects);
Game_Actor.prototype.traitObjects = function()
{
  // perform original logic.
  const originalObjects = J.PASSIVE.Aliased.Game_Actor.get('traitObjects')
    .call(this);

  // add our own passive states.
  originalObjects.push(...this.getPassiveStates());

  // add our passive items/weapons/armors states.
  originalObjects.push(...$gameParty.passiveStates());

  // return the new combined collection.
  return originalObjects;
};

/**
 * Extends {@link #onLearnNewSkill}.<br>
 * Triggers a refresh of passive states when learning a new skill.
 */
J.PASSIVE.Aliased.Game_Actor.set('onLearnNewSkill', Game_Actor.prototype.onLearnNewSkill);
Game_Actor.prototype.onLearnNewSkill = function(skillId)
{
  // perform original logic.
  J.PASSIVE.Aliased.Game_Actor.get('onLearnNewSkill')
    .call(this, skillId);

  // refresh our passive state list.
  this.refreshPassiveStates();
};

/**
 * Extends {@link #onForgetSkill}.<br>
 * Triggers a refresh of passive states when forgetting a skill.
 */
J.PASSIVE.Aliased.Game_Actor.set('onForgetSkill', Game_Actor.prototype.onForgetSkill);
Game_Actor.prototype.onForgetSkill = function(skillId)
{
  // perform original logic.
  J.PASSIVE.Aliased.Game_Actor.get('onForgetSkill')
    .call(this, skillId);

  // refresh our passive state list.
  this.refreshPassiveStates();
};

/**
 * Extends {@link #onEquipChange}.<br>
 * Triggers a refresh of passive states when equipment changes.
 */
J.PASSIVE.Aliased.Game_Actor.set('onEquipChange', Game_Actor.prototype.onEquipChange);
Game_Actor.prototype.onEquipChange = function()
{
  // perform original logic.
  J.PASSIVE.Aliased.Game_Actor.get('onEquipChange')
    .call(this);

  // refresh our passive state list.
  this.refreshPassiveStates();
};

/**
 * Extends {@link #onClassChange}.<br>
 * Triggers a refresh of passive states when the class changes.
 */
J.PASSIVE.Aliased.Game_Actor.set('onClassChange', Game_Actor.prototype.onClassChange);
Game_Actor.prototype.onClassChange = function(classId, keepExp)
{
  // perform original logic.
  J.PASSIVE.Aliased.Game_Actor.get('onClassChange')
    .call(this, classId, keepExp);

  // refresh our passive state list.
  this.refreshPassiveStates();
};

/**
 * Extends {@link #getNotesSources}.<br>
 * Includes passive skill states from this actor and also the party.
 * @returns {RPG_BaseItem[]}
 */
J.PASSIVE.Aliased.Game_Actor.set('getNotesSources', Game_Actor.prototype.getNotesSources);
Game_Actor.prototype.getNotesSources = function()
{
  // perform original logic to get notes.
  const originalSources = J.PASSIVE.Aliased.Game_Actor.get('getNotesSources')
    .call(this);

  // newly defined sources for passives.
  const passiveSources = [
    // then add all those currently applied passive states, too.
    ...this.getPassiveStates(),

    // also apply the party's effects.
    ...$gameParty.passiveStates(), ];

  // combine the sources.
  const combinedSources = originalSources.concat(passiveSources);

  // return the combination.
  return combinedSources
};
//endregion Game_Actor

//region Game_Battler
/**
 * Extends {@link #initMembers}.<br>
 * Also initializes the passive states properties for this battler.
 */
J.PASSIVE.Aliased.Game_BattlerBase.set('initMembers', Game_Battler.prototype.initMembers);
Game_Battler.prototype.initMembers = function()
{
  // perform original logic.
  J.PASSIVE.Aliased.Game_BattlerBase.get('initMembers')
    .call(this);

  // initialize the passive states properties.
  this.initPassiveStatesMembers();
};

/**
 * Initializes the passives collection
 */
Game_Battler.prototype.initPassiveStatesMembers = function()
{
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
};

/**
 * Get all currently known passive state ids this battler has.
 * @returns {number[]}
 */
Game_Battler.prototype.getPassiveStateIds = function()
{
  return this._j._passive._stateIds;
};

/**
 * Gets all the external sources (as base items) for this battler.
 * @returns {RPG_BaseItem[]}
 */
Game_Battler.prototype.passiveExternalStateSources = function()
{
  return this._j._passive._externalStateSources;
};

/**
 * Adds a collection of state ids to the external passive state ids list.
 * @param {number[]} stateIds The ids of the external passive states.
 * @param {boolean} deferRefresh Whether or not to defer refreshing the passive states.
 */
Game_Battler.prototype.addPassiveStateExternalSourceByStateIds = function(stateIds, deferRefresh = false)
{
  // convert the state ids to a base item.
  const baseItem = this.buildSourceFromStateIds(stateIds);

  // add the converted item to the list.
  this.addPassiveStateExternalSource(baseItem, deferRefresh);
};

/**
 * Adds a source to the external passive source list.
 * @param {RPG_BaseItem} source The source to add.
 * @param {boolean} deferRefresh Whether or not to defer refreshing the passive states.
 */
Game_Battler.prototype.addPassiveStateExternalSource = function(source, deferRefresh = false)
{
  // add the converted item to the list.
  this._j._passive._externalStateSources.push(source);

  // if we are not deferring refreshing, then do it now.
  if (deferRefresh === true) return;

  // also refresh the passive states.
  this.refreshPassiveStates();
};

/**
 * Clears all external passive state sources.
 * @param {boolean} deferRefresh Whether or not to defer refreshing the passive states.
 */
Game_Battler.prototype.clearPassiveStateExternalSources = function(deferRefresh = false)
{
  // empty the external sources list.
  this._j._passive._externalStateSources = [];

  // if we're deferring the refresh, then don't do it.
  if (deferRefresh === true) return;

  // refresh the passive states.
  this.refreshPassiveStates();
};

/**
 * Builds a dummy base item that can be used to represent passive state ids.
 *
 * Note: these base items aren't real items from the database and shouldn't be used as such!
 * @param {number[]} stateIds The passive state ids to add to the base item.
 * @returns {RPG_BaseItem} The constructed base item.
 */
Game_Battler.prototype.buildSourceFromStateIds = function(stateIds)
{
  // build a fake base item.
  const baseItem = {
    id: -1,
    meta: {},
    name: String.empty,
    note: `<passive:[${stateIds.join(',')}]>`,
    description: String.empty,
    iconIndex: 0,
  };

  // return the constructed base item.
  return new RPG_BaseItem(baseItem, baseItem.id);
};

/**
 * Adds the given state id to the passive state ids collection for this battler.
 * If `allowDuplicates` is `false`, then the adding of the state id will be ignored
 * if the battler already has the id.
 * @param {number} stateId The id of the state to add.
 * @param {boolean=} allowDuplicates Whether or not duplicate state ids is permitted; defaults to true.
 */
Game_Battler.prototype.addPassiveStateId = function(stateId, allowDuplicates = true)
{
  // check if we disallow duplicates and already have the state tracked.
  if (!this.canAddPassiveStateId(stateId, allowDuplicates)) return;

  // grab the passive state id collection.
  const passiveStateIds = this.getPassiveStateIds();

  // add the stateId to the collection.
  passiveStateIds.push(stateId);
};

/**
 * Determines whether or not a given stateId can be added to the list
 * @param {number} stateId The id of the state to add.
 * @param {boolean=} allowDuplicates Whether or not duplicate state ids is permitted; defaults to true.
 * @returns {boolean} True if the state id can be added to the passives collection, false otherwise.
 */
Game_Battler.prototype.canAddPassiveStateId = function(stateId, allowDuplicates)
{
  // if we don't allow duplicates and already are have this stateId, then don't add it.
  if (!allowDuplicates && this.getPassiveStateIds()
    .includes(stateId))
  {
    return false;
  }

  // TODO: check for blacklisted ids as well.

  // we can add this stateId!
  return true;
};

/**
 * Gets the converted {@link RPG_State} form of all currently applied passive states.
 * @returns {RPG_State[]}
 */
Game_Battler.prototype.getPassiveStates = function()
{
  return this.getPassiveStateIds()
    .map(this.state, this);
};

/**
 * Clears all passive state data currently tracked.
 */
Game_Battler.prototype.clearPassiveStates = function()
{
  // empty the state tracker.
  this._j._passive._stateIds = [];
};

/**
 * Clears and updates the passive state tracker with the latest.
 */
Game_Battler.prototype.refreshPassiveStates = function()
{
  // remove all currently tracked passive states.
  this.clearPassiveStates();

  // grab all the unique ids.
  const uniqueIds = this.getAllUniquePassiveStateIds();

  // grab all the stackable ids.
  const stackableIds = this.getAllStackablePassiveStateIds();

  // add all the unique ids to the tracker.
  uniqueIds.forEach(stateId => this.addPassiveStateId(stateId, false), this);

  // add all the stackable ids to the tracker.
  stackableIds.forEach((stackCount, stateId) =>
  {
    // don't re-add unique passive states.
    if (uniqueIds.has(stateId)) return;

    // capture the number of times to duplicate the state object.
    let times = stackCount;

    // while we have times left, keep going.
    while (times > 0)
    {
      // add the stackable passive state id.
      this.addPassiveStateId(stateId);

      // decrement the counter.
      times--;
    }
  });
};

/**
 * Gets all unique passive state ids that are present across all sources this
 * battler owns.
 * @returns {Set<number>}
 */
Game_Battler.prototype.getAllUniquePassiveStateIds = function()
{
  // initialize the set of unique ids; there can only be one!
  const uniquePassiveStateIds = new Set();

  // grab all objects to get unique passive state ids from.
  const everything = this.getPassiveStateSources();

  // iterate over all the things.
  everything.forEach(baseItem =>
  {
    // grab the unique ids from the item.
    const uniqueIds = baseItem.uniquePassiveStateIds;

    // check if we need to include passive state ids, too.
    if (baseItem instanceof RPG_EquipItem)
    {
      // add the equip-only passive state ids.
      uniqueIds.push(...baseItem.uniqueEquippedPassiveStateIds);
    }

    // add them uniquely to the set.
    uniqueIds.forEach(id => uniquePassiveStateIds.add(id));
  });

  // return the completed unique set.
  return uniquePassiveStateIds;
};

/**
 * Gets all stackable passive state ids that are present across all sources this
 * battler owns.
 * @returns {Map<number, number>}
 */
Game_Battler.prototype.getAllStackablePassiveStateIds = function()
{
  // initialize the map of stackable ids; each one can have many.
  /** @type {Map<number, number>} */
  const stackablePassiveStateIds = new Map();

  // grab all objects to get stackable passive state ids from.
  const everything = this.getPassiveStateSources();

  // iterate over all the things.
  everything.forEach(baseItem =>
  {
    // grab the stackable ids from the item.
    const stackableIds = baseItem.passiveStateIds;

    // check if we need to include passive state ids, too.
    if (baseItem instanceof RPG_EquipItem)
    {
      // add the equip-only passive state ids.
      stackableIds.push(...baseItem.equippedPassiveStateIds);
    }

    // iterate over each of the stackable passive state ids on this item.
    stackableIds.forEach(id =>
    {
      // check if we are already tracking this passive state id.
      if (stackablePassiveStateIds.has(id))
      {
        // grab the running stack total for this passive state id.
        const stack = stackablePassiveStateIds.get(id);

        // increment the stack.
        stackablePassiveStateIds.set(id, stack + 1);
      }
      // we aren't tracking this passive state id yet.
      else
      {
        // start the stack for this passive state id at 1.
        stackablePassiveStateIds.set(id, 1);
      }
    });
  });

  // return the completed stackable map.
  return stackablePassiveStateIds;
};

/**
 * Gets all sources from which this battler can derive passive state from.
 *
 * This does include a reference call to potentially getting passive states, but due
 * to control flows, this should always come back with no passive states in the list.
 * @returns {(RPG_Actor|RPG_Enemy|RPG_Class|RPG_Skill|RPG_EquipItem|RPG_State)[]}
 */
Game_Battler.prototype.getPassiveStateSources = function()
{
  // define all sources from which passive states can come from.
  const battlerSources = [
    // ones own data from the database, such as the actor or enemy data.
    this.databaseData(),

    // all states currently applied to the battler- this won't include own any passive states.
    ...this.allStates(),

    // all skills available to this battler.
    ...this.skills(),

    // add all sources from events.
    ...this.passiveExternalStateSources(),
  ];

  // return this collection of stuff.
  return battlerSources;
};

/**
 * Determines whether or not the state id is a passive state or not.
 * @param {number} stateId The state id to check.
 * @returns {boolean} True if it is identified as passive, false otherwise.
 */
Game_Battler.prototype.isPassiveState = function(stateId)
{
  // then the answer lies in whether or not the given state id is in that list.
  return this._j._passive._stateIds.includes(stateId);
};

/**
 * Extends {@link #allStates}.<br>
 * Includes states from passive skills as well.
 * @returns {RPG_State[]}
 */
J.PASSIVE.Aliased.Game_Battler.set('allStates', Game_Battler.prototype.allStates);
Game_Battler.prototype.allStates = function()
{
  // get all original states.
  const states = J.PASSIVE.Aliased.Game_Battler.get('allStates')
    .call(this);

  // add in all passive skill states.
  states.push(...this.getPassiveStates());

  // return that combined collection.
  return states;
};

/**
 * Extends {@link #isStateAddable}.<br>
 * Prevents adding states if they are identified as passive.
 */
J.PASSIVE.Aliased.Game_Battler.set('isStateAddable', Game_Battler.prototype.isStateAddable);
Game_Battler.prototype.isStateAddable = function(stateId)
{
  // skip adding if it is a passive state.
  if (this.isPassiveState(stateId)) return false;

  // otherwise, check as normal.
  return J.PASSIVE.Aliased.Game_Battler.get('isStateAddable')
    .call(this, stateId);
};

/**
 * Extends {@link #onStateAdded}.<br>
 * Triggers a refresh of passive states when a state is added.
 * @param {number} stateId The state id being added.
 */
J.PASSIVE.Aliased.Game_Battler.set('onStateAdded', Game_Battler.prototype.onStateAdded);
Game_Battler.prototype.onStateAdded = function(stateId)
{
  // perform original logic.
  J.PASSIVE.Aliased.Game_Battler.get('onStateAdded')
    .call(this, stateId);

  // refresh our passive state list.
  this.refreshPassiveStates();
};

/**
 * Extends {@link #removeState}.<br>
 * Prevent removal of states if they are identified as passive.
 */
J.PASSIVE.Aliased.Game_Battler.set('removeState', Game_Battler.prototype.removeState);
Game_Battler.prototype.removeState = function(stateId)
{
  // skip removal if it is a passive state.
  if (this.isPassiveState(stateId)) return;

  // otherwise, remove as normal.
  J.PASSIVE.Aliased.Game_Battler.get('removeState')
    .call(this, stateId);
};

/**
 * Extends {@link #onStateRemoval}.<br>
 * Triggers a refresh of passive states when a state is removed.
 * @param {number} stateId The state id being removed.
 */
J.PASSIVE.Aliased.Game_Battler.set('onStateRemoval', Game_Battler.prototype.onStateRemoval);
Game_Battler.prototype.onStateRemoval = function(stateId)
{
  // perform original logic.
  J.PASSIVE.Aliased.Game_Battler.get('onStateRemoval')
    .call(this, stateId);

  // refresh our passive state list.
  this.refreshPassiveStates();
};
//endregion Game_Battler

//region Game_Enemy
/**
 * Extends {@link #onSetup}.<br>
 * Also refreshes the passive states on this battler for the first time.
 * @param {number} enemyId The battler's id.
 */
J.PASSIVE.Aliased.Game_Enemy.set('onSetup', Game_Enemy.prototype.onSetup);
Game_Enemy.prototype.onSetup = function(enemyId)
{
  // perform original logic.
  J.PASSIVE.Aliased.Game_Enemy.get('onSetup')
    .call(this, enemyId);

  // refresh all passive states on this battler.
  this.refreshPassiveStates();
};

/**
 * Extends {@link #traitObjects}.<br>
 * When considering traits, also include the enemy's passive states.
 */
J.PASSIVE.Aliased.Game_Enemy.set('traitObjects', Game_Enemy.prototype.traitObjects);
Game_Enemy.prototype.traitObjects = function()
{
  // perform original logic.
  const originalObjects = J.PASSIVE.Aliased.Game_Enemy.get('traitObjects')
    .call(this);

  // add our own passive states.
  originalObjects.push(...this.getPassiveStates());

  // return the new combined collection.
  return originalObjects;
};

/**
 * Extends {@link #getNotesSources}.<br>
 * Includes passive states from this enemy.
 * @returns {RPG_BaseItem[]}
 */
J.PASSIVE.Aliased.Game_Enemy.set('getNotesSources', Game_Enemy.prototype.getNotesSources);
Game_Enemy.prototype.getNotesSources = function()
{
  // perform original logic to get notes.
  const originalSources = J.PASSIVE.Aliased.Game_Enemy.get('getNotesSources')
    .call(this);

  // newly defined sources for passives.
  const passiveSources = [
    // then add all those currently applied passive skill states, too.
    ...this.getPassiveStates(),

    // add all sources from events.
    ...this.passiveExternalStateSources(),
  ];

  // combine the sources.
  const combinedSources = originalSources.concat(passiveSources);

  // return the combination.
  return combinedSources;
};
//endregion Game_Enemy

//region Game_Event
/**
 * Gets all passive state ids in the comments of an event.
 * @returns {number[]}
 */
Game_Event.prototype.getPassiveStateIds = function()
{
  // default team id for an event is an enemy.
  const passiveStateIds = [];

  // check all the valid event commands to see if we have an override for team.
  this.getValidCommentCommands()
    .forEach(command =>
    {
      // reset the regex's lastIndex to 0.
      J.PASSIVE.RegExp.PassiveStateIds.lastIndex = 0;

      // shorthand the comment into a variable.
      const [ comment, ] = command.parameters;

      // check if the comment matches the regex.
      const regexResult = J.PASSIVE.RegExp.PassiveStateIds.exec(comment);

      // if the comment didn't match, then don't try to parse it.
      if (!regexResult) return;

      // map the capture group to numbers.
      const ids = JSON.parse(regexResult[1]);

      // parse the value out of the regex capture group.
      passiveStateIds.push(...ids);
    });

  // return what we found.
  return passiveStateIds;
};
//endregion Game_Event

//region Game_Party
/**
 * Extends {@link #initialize}.<br>
 * Includes our custom members as well.
 */
J.PASSIVE.Aliased.Game_Party.set('initialize', Game_Party.prototype.initialize);
Game_Party.prototype.initialize = function()
{
  // perform original logic.
  J.PASSIVE.Aliased.Game_Party.get('initialize')
    .call(this);

  // initialize our members as well.
  this.initPassiveItemStates();
};

/**
 * Initializes the passive state members for this class.
 */
Game_Party.prototype.initPassiveItemStates = function()
{
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
Game_Party.prototype.passiveStateIds = function()
{
  return this._j._passive._states;
};

/**
 * Gets an array of all passive states currently applied to the party.
 * @returns {RPG_State[]}
 */
Game_Party.prototype.passiveStates = function()
{
  return this._j._passive._cachedStates;
};

/**
 * Gets the party's interpretation of the state based on its id.
 * @param {number} stateId The state id.
 * @returns {RPG_State}
 */
Game_Party.prototype.state = function(stateId)
{
  return $dataStates.at(stateId);
};

/**
 * Clears all passive state data currently tracked.
 */
Game_Party.prototype.clearPassiveStates = function()
{
  // empty the state tracker.
  this._j._passive._states = [];

  // empty the cached states, too.
  this._j._passive._cachedStates = [];
};

/**
 * Adds a passive state id to the list for tracking.
 * @param {number} stateId The state id to add.
 * @param {boolean=} allowDuplicates Whether or not to allow duplicate passive state ids; defaults to true.
 */
Game_Party.prototype.addPassiveStateId = function(stateId, allowDuplicates = true)
{
  // check if we disallow duplicates and already have the state tracked.
  if (!allowDuplicates && this._j._passive._states.has(stateId)) return;

  // add the state id to the tracker for passive states.
  this._j._passive._states.push(stateId);

  // add the converted state object to the cache.
  this._j._passive._cachedStates.push(this.state(stateId));
};

/**
 * Clears and updates the passive state tracker with the latest.
 */
Game_Party.prototype.refreshPassiveStates = function()
{
  // clear all current passive states tracked.
  this.clearPassiveStates();

  // grab all the unique ids.
  const uniqueIds = this.getAllUniquePassiveStateIds();

  // grab all the stackable ids.
  const stackableIds = this.getAllStackablePassiveStateIds();

  // add all the unique ids to the tracker.
  uniqueIds.forEach(stateId => this.addPassiveStateId(stateId, false), this);

  // add all the stackable ids to the tracker.
  stackableIds.forEach((stackCount, stateId) =>
  {
    // don't re-add unique passive states.
    if (uniqueIds.has(stateId)) return;

    // capture the number of times to duplicate the state object.
    let times = stackCount;

    // while we have times left, keep going.
    while (times > 0)
    {
      // add the stackable passive state id.
      this.addPassiveStateId(stateId);

      // decrement the counter.
      times--;
    }
  });
};

/**
 * Gets all unique passive state ids that are present across everything the
 * party owns at the moment.
 * @returns {Set<number>}
 */
Game_Party.prototype.getAllUniquePassiveStateIds = function()
{
  // initialize the set of unique ids; there can only be one!
  const uniquePassiveStateIds = new Set();

  // grab all currently owned items/weapons/armors.
  const everything = this.allItemsQuantified();

  // iterate over all the things.
  everything.forEach(baseItem =>
  {
    // grab the unique ids from the item.
    const uniqueIds = baseItem.uniquePassiveStateIds;

    // add them uniquely to the set.
    uniqueIds.forEach(id => uniquePassiveStateIds.add(id));
  });

  // return the completed unique set.
  return uniquePassiveStateIds;
};

/**
 * Gets all stackable passive state ids that are present across everything the
 * party owns at the moment.
 * @returns {Map<number, number>}
 */
Game_Party.prototype.getAllStackablePassiveStateIds = function()
{
  // initialize the map of stackable ids; each one can have many.
  /** @type {Map<number, number>} */
  const stackablePassiveStateIds = new Map();

  // grab all currently owned items/weapons/armors.
  const everything = this.allItemsQuantified();

  // iterate over all the things.
  everything.forEach(baseItem =>
  {
    // grab the stackable ids from the item.
    const stackableIds = baseItem.passiveStateIds;

    // iterate over each of the stackable passive state ids on this item.
    stackableIds.forEach(id =>
    {
      // check if we are already tracking this passive state id.
      if (stackablePassiveStateIds.has(id))
      {
        // grab the running stack total for this passive state id.
        const stack = stackablePassiveStateIds.get(id);

        // increment the stack.
        stackablePassiveStateIds.set(id, stack + 1);
      }
      // we aren't tracking this passive state id yet.
      else
      {
        // start the stack for this passive state id at 1.
        stackablePassiveStateIds.set(id, 1);
      }
    });
  });

  // return the completed stackable map.
  return stackablePassiveStateIds;
};

/**
 * Extends {@link #gainItem}.<br>
 * Also refreshes the passive states for the party.
 * @param {RPG_Item|RPG_Weapon|RPG_Armor} item The item to modify the quantity of.
 * @param {number} amount The amount to modify the quantity by.
 * @param {boolean} includeEquip Whether or not to include equipped items for equipment.
 */
J.PASSIVE.Aliased.Game_Party.set('gainItem', Game_Party.prototype.gainItem);
Game_Party.prototype.gainItem = function(item, amount, includeEquip)
{
  // perform original logic.
  J.PASSIVE.Aliased.Game_Party.get('gainItem')
    .call(this, item, amount, includeEquip);

  // also refresh our passive states tracker.
  this.refreshPassiveStates();
};
//endregion Game_Party

//region Scene_Menu
/**
 * Extends {@link #createCommandWindow}.<br>
 * Wires the passive-menu symbol to the Passives viewer scene.
 */
J.PASSIVE.Aliased.Scene_Menu.set('createCommandWindow', Scene_Menu.prototype.createCommandWindow);
Scene_Menu.prototype.createCommandWindow = function()
{
  // perform original logic.
  J.PASSIVE.Aliased.Scene_Menu.get('createCommandWindow')
    .call(this);

  // register the handler that opens the passive viewer.
  this._commandWindow.setHandler('passive-menu', this.commandPassive.bind(this));
};

/**
 * Opens the passive state viewer for the current menu actor.
 */
Scene_Menu.prototype.commandPassive = function()
{
  Scene_Passive.callScene();
};
//endregion Scene_Menu

//region Scene_Passive
/**
 * The dedicated viewer scene for all passive states applied to an actor.
 *
 * Passive states are grouped into tabs registered via {@link Scene_Passive.registerTab}.
 * The core always provides an "All" tab; extensions register additional tabs during
 * their own initialization phases (e.g. the OTIB ext registers an "Item Boosts" tab).
 *
 * Layout (top to bottom, left to right):
 * - Full-width tab header strip at the top
 * - Left column: scrollable state list (filtered by active tab)
 * - Right column: detail panel for the currently highlighted state
 */
class Scene_Passive
  extends Scene_MenuBase
{
  static callScene()
  {
    SceneManager.push(this);
  }

  //region static tab registry
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
  static registerTab(config)
  {
    Scene_Passive._tabRegistry.push(config);
  }

  /**
   * Gets all registered tab configurations in registration order.
   * @returns {Array<{key: string, label: string, filter: Function|null}>}
   */
  static registeredTabs()
  {
    return Scene_Passive._tabRegistry;
  }

  //endregion static tab registry

  //region init
  /**
   * Constructor.
   */
  constructor()
  {
    // call super when having extended constructors.
    super();

    // jumpstart initialization on creation.
    this.initialize();
  }

  /**
   * Initializes all properties for this scene.
   */
  initMembers()
  {
    // perform original logic.
    super.initMembers();

    this._j ||= {};

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
     * The actor identity ribbon above the state list.
     * @type {Window_PassiveActorRibbon}
     */
    this._j._passive._windows._actorRibbon = null;

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

  //endregion init

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
    // create all our windows.
    this.createAllWindows();
  }

  /**
   * Overrides {@link #createButtons}.<br>
   * Removes the rendering of buttons from this scene.
   */
  createButtons()
  {
  }

  /**
   * Creates all windows associated with the passive viewer scene.
   */
  createAllWindows()
  {
    // create non-interactive display windows first.
    this.createPassiveTabHeaderWindow();
    this.createPassiveActorRibbonWindow();
    this.createPassiveDetailWindow();

    // create the interactive list window last so it draws on top.
    this.createPassiveListWindow();

    // perform the initial render of all windows.
    this.onPassiveHoveredChange();
  }

  //endregion create

  //region layout
  /**
   * The pixel height of the tab header strip.
   * Matches one text row including window padding.
   * @returns {number}
   */
  passiveTabHeaderHeight()
  {
    return Window_Base.prototype.lineHeight() + $gameSystem.windowPadding() * 2;
  }

  /**
   * The pixel height of the actor ribbon strip above the state list.
   * Sized to fit a cropped face (40px) plus two text rows and window padding.
   * @returns {number}
   */
  passiveActorRibbonHeight()
  {
    return 72;
  }

  /**
   * The pixel width of the passive state list column.
   * @returns {number}
   */
  passiveListWidth()
  {
    return 480;
  }

  //endregion layout

  //region windows
  //region tab header window
  /**
   * Creates the tab header strip window.
   */
  createPassiveTabHeaderWindow()
  {
    // build the window.
    const window = this.buildPassiveTabHeaderWindow();

    // track the reference.
    this.setPassiveTabHeaderWindow(window);

    // register with the scene manager.
    this.addWindow(window);
  }

  /**
   * Builds the tab header window.
   * @returns {Window_PassiveTabHeader}
   */
  buildPassiveTabHeaderWindow()
  {
    // define the rectangle for this window.
    const rectangle = this.passiveTabHeaderRectangle();

    // create the window with the rectangle.
    return new Window_PassiveTabHeader(rectangle);
  }

  /**
   * Gets the rectangle for the tab header strip.
   * Sits above the detail panel in the right column — same x and width as the detail window,
   * so it does not overlap the actor ribbon and list on the left.
   * @returns {Rectangle}
   */
  passiveTabHeaderRectangle()
  {
    const x = this.passiveListWidth();
    const y = 0;
    const width = Graphics.boxWidth - this.passiveListWidth();
    const height = this.passiveTabHeaderHeight();

    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the tracked tab header window.
   * @returns {Window_PassiveTabHeader}
   */
  getPassiveTabHeaderWindow()
  {
    return this._j._passive._windows._tabHeader;
  }

  /**
   * Sets the tracked tab header window.
   * @param {Window_PassiveTabHeader} tabHeaderWindow The window to track.
   */
  setPassiveTabHeaderWindow(tabHeaderWindow)
  {
    this._j._passive._windows._tabHeader = tabHeaderWindow;
  }

  //endregion tab header window

  //region actor ribbon window
  /**
   * Creates the actor ribbon window.
   */
  createPassiveActorRibbonWindow()
  {
    // build the window.
    const window = this.buildPassiveActorRibbonWindow();

    // track the reference.
    this.setPassiveActorRibbonWindow(window);

    // register with the scene manager.
    this.addWindow(window);
  }

  /**
   * Builds the actor ribbon window.
   * @returns {Window_PassiveActorRibbon}
   */
  buildPassiveActorRibbonWindow()
  {
    // define the rectangle for this window.
    const rectangle = this.passiveActorRibbonRectangle();

    // create the window with the rectangle.
    const window = new Window_PassiveActorRibbon(rectangle);

    // load the initial actor.
    window.setActor($gameParty.menuActor());

    // return the built window.
    return window;
  }

  /**
   * Gets the rectangle for the actor ribbon.
   * Sits at the top of the left column — flush to y=0 because the tab header
   * now lives above the detail panel (right column) only.
   * @returns {Rectangle}
   */
  passiveActorRibbonRectangle()
  {
    const x = 0;
    const y = 0;
    const width = this.passiveListWidth();
    const height = this.passiveActorRibbonHeight();

    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the tracked actor ribbon window.
   * @returns {Window_PassiveActorRibbon}
   */
  getPassiveActorRibbonWindow()
  {
    return this._j._passive._windows._actorRibbon;
  }

  /**
   * Sets the tracked actor ribbon window.
   * @param {Window_PassiveActorRibbon} ribbonWindow The window to track.
   */
  setPassiveActorRibbonWindow(ribbonWindow)
  {
    this._j._passive._windows._actorRibbon = ribbonWindow;
  }
  //endregion actor ribbon window

  //region list window
  /**
   * Creates the passive state list window.
   */
  createPassiveListWindow()
  {
    // build the window.
    const window = this.buildPassiveListWindow();

    // track the reference BEFORE activating so onPassiveHoveredChange can safely resolve it.
    this.setPassiveListWindow(window);

    // register with the scene manager.
    this.addWindow(window);

    // select and activate after tracking so the first onIndexChange fires with everything wired up.
    window.select(0);
    window.activate();
  }

  /**
   * Builds and configures the passive state list window.
   * @returns {Window_PassiveList}
   */
  buildPassiveListWindow()
  {
    // define the rectangle for this window.
    const rectangle = this.passiveListRectangle();

    // create the window with the rectangle.
    const window = new Window_PassiveList(rectangle);

    // wire up input handlers.
    window.setHandler('cancel', this.popScene.bind(this));
    window.setHandler('tabLeft', this.cycleTabLeft.bind(this));
    window.setHandler('tabRight', this.cycleTabRight.bind(this));
    window.setHandler('pagedown', this.nextActor.bind(this));
    window.setHandler('pageup', this.previousActor.bind(this));

    // wire up the hover-change callback to keep the detail window in sync.
    window.onIndexChange = this.onPassiveHoveredChange.bind(this);

    // load the initial actor.
    window.setActor($gameParty.menuActor());

    // return the built and configured window.
    return window;
  }

  /**
   * Gets the rectangle for the passive state list column.
   * Sits below the actor ribbon in the left column.
   * @returns {Rectangle}
   */
  passiveListRectangle()
  {
    const x = 0;
    const y = this.passiveActorRibbonHeight();
    const width = this.passiveListWidth();
    const height = Graphics.boxHeight - y;

    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the tracked passive list window.
   * @returns {Window_PassiveList}
   */
  getPassiveListWindow()
  {
    return this._j._passive._windows._list;
  }

  /**
   * Sets the tracked passive list window.
   * @param {Window_PassiveList} listWindow The window to track.
   */
  setPassiveListWindow(listWindow)
  {
    this._j._passive._windows._list = listWindow;
  }

  //endregion list window

  //region detail window
  /**
   * Creates the passive state detail window.
   */
  createPassiveDetailWindow()
  {
    // build the window.
    const window = this.buildPassiveDetailWindow();

    // track the reference.
    this.setPassiveDetailWindow(window);

    // register with the scene manager.
    this.addWindow(window);
  }

  /**
   * Builds the passive state detail window.
   * @returns {Window_PassiveDetail}
   */
  buildPassiveDetailWindow()
  {
    // define the rectangle for this window.
    const rectangle = this.passiveDetailRectangle();

    // create the window with the rectangle.
    const window = new Window_PassiveDetail(rectangle);

    // seed the initial actor so contributors have context on first render.
    window.setActor($gameParty.menuActor());

    // detail panel is display-only; deactivate immediately.
    window.deactivate();

    // return the built window.
    return window;
  }

  /**
   * Gets the rectangle for the detail panel.
   * Occupies the right column beside the list, below the tab header.
   * @returns {Rectangle}
   */
  passiveDetailRectangle()
  {
    const listWidth = this.passiveListWidth();
    const x = listWidth;
    const y = this.passiveTabHeaderHeight();
    const width = Graphics.boxWidth - listWidth;
    const height = Graphics.boxHeight - y;

    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the tracked passive detail window.
   * @returns {Window_PassiveDetail}
   */
  getPassiveDetailWindow()
  {
    return this._j._passive._windows._detail;
  }

  /**
   * Sets the tracked passive detail window.
   * @param {Window_PassiveDetail} detailWindow The window to track.
   */
  setPassiveDetailWindow(detailWindow)
  {
    this._j._passive._windows._detail = detailWindow;
  }

  //endregion detail window
  //endregion windows

  //region tab management
  /**
   * Gets the tab configuration at the current tab index.
   * @returns {{key: string, label: string, filter: Function|null}}
   */
  currentTab()
  {
    return Scene_Passive._tabRegistry[this._j._passive._tabIndex];
  }

  /**
   * Advances to the next tab in the registry, wrapping around from the last to the first.
   */
  cycleTabRight()
  {
    // increment the index modularly.
    const tabCount = Scene_Passive._tabRegistry.length;
    this._j._passive._tabIndex = (this._j._passive._tabIndex + 1) % tabCount;

    // apply the new tab.
    this.applyCurrentTab();
  }

  /**
   * Retreats to the previous tab in the registry, wrapping from the first to the last.
   */
  cycleTabLeft()
  {
    // decrement the index modularly.
    const tabCount = Scene_Passive._tabRegistry.length;
    this._j._passive._tabIndex = (this._j._passive._tabIndex - 1 + tabCount) % tabCount;

    // apply the new tab.
    this.applyCurrentTab();
  }

  /**
   * Applies the current tab's filter to the list and refreshes all affected windows.
   */
  applyCurrentTab()
  {
    const {
      filter,
      label
    } = this.currentTab();

    // push the new filter into the list window.
    this.getPassiveListWindow()
      .setTabFilter(filter);

    // reset the selection to the top of the newly filtered list.
    this.getPassiveListWindow()
      .select(0);

    // update the header to reflect the new tab name.
    this.getPassiveTabHeaderWindow()
      .setLabel(label);

    // re-activate the list window to accept input again.
    this.getPassiveListWindow()
      .activate();

    // trigger a detail refresh for the new top item.
    this.onPassiveHoveredChange();
  }

  //endregion tab management

  //region actions
  /**
   * Refreshes the detail window whenever the highlighted state in the list changes.
   */
  onPassiveHoveredChange()
  {
    // grab the currently highlighted state (may be null if the list is empty).
    const state = this.getPassiveListWindow()
      .currentPassiveState();

    // push the state (or null) into the detail window.
    this.getPassiveDetailWindow()
      .setState(state);
  }

  /**
   * Extends {@link #onActorChange}.<br>
   * Refreshes all actor-driven windows whenever the party's menu actor changes.
   */
  onActorChange()
  {
    // perform original logic.
    super.onActorChange();

    // the current menu actor after the change.
    const actor = $gameParty.menuActor();

    // push the updated actor into the ribbon.
    this.getPassiveActorRibbonWindow()
      .setActor(actor);

    // push the updated actor into the list.
    this.getPassiveListWindow()
      .setActor(actor);

    // push the updated actor into the detail window for contributor context.
    this.getPassiveDetailWindow()
      .setActor(actor);

    // reset the selection to the top.
    this.getPassiveListWindow()
      .select(0);

    // re-activate the list for input.
    this.getPassiveListWindow()
      .activate();

    // refresh the detail for the new actor's top item.
    this.onPassiveHoveredChange();
  }

  //endregion actions
}

// the "All" tab is always registered first by the core; extensions push their own tabs after.
Scene_Passive._tabRegistry = [
  {
    key: 'all',
    label: 'All',
    filter: null,
  },
];
//endregion Scene_Passive

//region Window_MenuCommand
/**
 * Extends {@link #makeCommandList}.<br>
 * Adds the Passives viewer command to the main menu command list.
 */
J.PASSIVE.Aliased.Window_MenuCommand.set('makeCommandList', Window_MenuCommand.prototype.makeCommandList);
Window_MenuCommand.prototype.makeCommandList = function()
{
  // perform original logic.
  J.PASSIVE.Aliased.Window_MenuCommand.get('makeCommandList')
    .call(this);

  // if the guard switch prevents the command, skip it.
  if (!this.canAddPassivesCommand()) return;

  // build and insert the Passives command.
  const command = new WindowCommandBuilder(J.PASSIVE.Metadata.commandName)
    .setSymbol('passive-menu')
    .setEnabled(true)
    .setIconIndex(J.PASSIVE.Metadata.commandIconIndex)
    .build();

  // insert before "End Game" if it is the last entry; otherwise append.
  const lastCommand = this._list.at(-1);
  if (lastCommand.symbol === 'gameEnd')
  {
    this._list.splice(this._list.length - 2, 0, command);
  }
  else
  {
    this.addBuiltCommand(command);
  }
};

/**
 * Determines whether the Passives command should be added to the menu.
 * @returns {boolean}
 */
Window_MenuCommand.prototype.canAddPassivesCommand = function()
{
  return $gameSwitches.value(J.PASSIVE.Metadata.menuSwitchId);
};
//endregion Window_MenuCommand

//region Window_MoreEquipData
/**
 * Extends {@link #addJabsEquipmentData}.<br>
 * Includes additional entries about passive states provided by the equipment.
 */
J.PASSIVE.Aliased.Window_MoreEquipData.set('addJabsEquipmentData', Window_MoreEquipData.prototype.addJabsEquipmentData);
Window_MoreEquipData.prototype.addJabsEquipmentData = function()
{
  // perform original logic.
  J.PASSIVE.Aliased.Window_MoreEquipData.get('addJabsEquipmentData')
    .call(this);

  // also add the passive state data.
  this.addPassiveStateData();
}

/**
 * Adds all passive states found across the item.
 */
Window_MoreEquipData.prototype.addPassiveStateData = function()
{
  // do not process if we are not allowed to.
  if (!this.canAddPassiveStateData()) return;

  // grab all the equipped passive state ids.
  const stackablePassiveIds = this.item.equippedPassiveStateIds;
  const uniquePassiveIds = this.item.uniqueEquippedPassiveStateIds;

  // combine the two groups of ids.
  const allIds = [ ...stackablePassiveIds, ...uniquePassiveIds ].sort();

  // an iterator function for rendering a command based on the passive state id.
  const forEacher = passiveStateId =>
  {
    // extract the data from the state.
    const state = this.actor.state(passiveStateId);
    const {
      name,
      iconIndex
    } = state;

    // define the name of the command.
    const commandName = `Passive: ${name}`;

    // build the command with the data.
    const command = new WindowCommandBuilder(commandName)
      .setIconIndex(iconIndex)
      .setExtensionData(state)
      .build();

    // add the built command to the list.
    this.addBuiltCommand(command);
  };

  // render all the commands based on the ids.
  allIds.forEach(forEacher, this);
};

/**
 * Determines whether or not the passive state data for this item can be added.
 * @returns {boolean} True if allowed, false otherwise.
 */
Window_MoreEquipData.prototype.canAddPassiveStateData = function()
{
  // if there is no item to render, then do not render the passive states.
  if (!this.item) return false;

  // render the passive data!
  return true;
};
//endregion Window_MoreEquipData

//region Window_PassiveActorRibbon
/**
 * A ribbon window for the passive viewer that displays the currently viewed actor's
 * face, name, and level. Sits above the state list in the left column so the player
 * always knows whose passives they are looking at.
 */
class Window_PassiveActorRibbon
  extends Window_ActorRibbon
{
  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle for this window.
   */
  constructor(rect)
  {
    // call super when having extended constructors.
    super(rect);

    // jumpstart initialization on creation.
    this.initialize(rect);
  }

  //region draw
  /**
   * Extends {@link Window_ActorRibbon#drawContent}.<br>
   * Also draws the actor name and level beside the face.
   */
  drawContent()
  {
    // perform original logic to draw the face.
    super.drawContent();

    // also draw the actor name.
    this.drawActorName();
  }

  /**
   * Draws the actor name centered vertically beside the face graphic.
   */
  drawActorName()
  {
    // no actor means nothing to draw.
    if (!this._actor) return;

    // the text column starts just past the face graphic.
    const textX = this.faceWidth() + 8;
    const textWidth = this.innerWidth - textX;
    const textY = Math.floor((this.innerHeight - this.lineHeight()) / 2);

    // draw the actor name.
    this.drawText(this._actor.name(), textX, textY, textWidth, 'left');
  }
  //endregion draw
}
//endregion Window_PassiveActorRibbon

//region Window_PassiveDetail
/**
 * A non-interactive detail panel that displays information about the currently
 * highlighted passive state in the list window.
 *
 * The panel is divided into two equal columns below the full-width state header.
 * Each column renders sections that group effects by meaning. All draw helpers
 * share state through {@link currentX} and {@link currentY}, both reset at the
 * start of each repaint — no y threading through method signatures.
 *
 * Left column:   Combat (stub, filled by passive/ext/abs) + Ailments
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
class Window_PassiveDetail
  extends Window_Base
{
  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle for this window.
   */
  constructor(rect)
  {
    // call super when having extended constructors.
    super(rect);

    // jumpstart initialization on creation.
    this.initialize(rect);
  }

  //region init
  /**
   * Initializes this window.
   * @param {Rectangle} rect The rectangle for this window.
   */
  initialize(rect)
  {
    // perform original logic.
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
  //endregion init

  //region cursor properties
  /**
   * The running horizontal cursor for the active column.
   * @type {number}
   */
  get currentX()
  {
    return this._currentX;
  }

  set currentX(value)
  {
    this._currentX = value;
  }

  /**
   * The running vertical cursor shared by all draw helpers.
   * @type {number}
   */
  get currentY()
  {
    return this._currentY;
  }

  set currentY(value)
  {
    this._currentY = value;
  }

  /**
   * The usable pixel width of one column.
   * All three columns are equal; two 8px gutters separate them.
   * @type {number}
   */
  get columnWidth()
  {
    return Math.floor((this.innerWidth - 16) / 3);
  }
  //endregion cursor properties

  //region column navigation
  /**
   * Moves the active draw cursor to the given zero-based column index.
   * Column 0 = left, 1 = middle, 2 = right.
   * Resets {@link currentY} to the value recorded after the full-width header.
   * @param {number} columnIndex The target column (0, 1, or 2).
   */
  switchToColumn(columnIndex)
  {
    this.currentX = columnIndex * (this.columnWidth + 8);
    this.currentY = this._columnStartY;
  }

  /**
   * Convenience: moves to the middle (second) column.
   */
  switchToMiddleColumn()
  {
    this.switchToColumn(1);
  }

  /**
   * Convenience: moves to the right (third) column.
   */
  switchToRightColumn()
  {
    this.switchToColumn(2);
  }
  //endregion column navigation

  //region update
  /**
   * Sets the actor context and repaints.
   * @param {Game_Actor|null} actor The actor being browsed.
   */
  setActor(actor)
  {
    this._actor = actor;
    this.refresh();
  }

  /**
   * Sets the state to display and repaints.
   * @param {RPG_State|null} state The state to display, or null to clear.
   */
  setState(state)
  {
    this._state = state;
    this.refresh();
  }
  //endregion update

  //region draw
  /**
   * Repaints the detail panel for the current state.
   */
  refresh()
  {
    // clear prior contents before repainting.
    this.contents.clear();

    // nothing to show when there is no state.
    if (!this._state) return;

    // reset the cursors and paint the full detail view.
    this.currentX = 0;
    this.currentY = 0;
    this.drawPassiveStateDetail(this._state);
  }

  /**
   * Top-level orchestrator — draws the full-width header, then populates the
   * left and right columns with their respective sections.
   *
   * Left column: Combat (stub, filled by passive/ext/abs), Parameters, Elements.
   * Right column: Ailments, Skills, Equip, Properties, Rewards.
   *
   * Extensions may alias either this method or any individual section method.
   * @param {RPG_State} state The state whose details are being drawn.
   */
  drawPassiveStateDetail(state)
  {
    // full-width header: state icon, name, description.
    this.drawStateHeader(state);

    // record the y where all three columns start, then fill the left column.
    this._columnStartY = this.currentY;
    this.drawCombatSection(state);
    this.drawAilmentsSection(state);

    // middle column: stat modifications and elemental affinities.
    this.switchToMiddleColumn();
    this.drawParametersSection(state);
    this.drawElementsSection(state);

    // right column: skill/equip access, misc flags, and battle rewards.
    this.switchToRightColumn();
    this.drawSkillsSection(state);
    this.drawEquipSection(state);
    this.drawPropertiesSection(state);
    this.drawRewardsSection(state);
  }

  /**
   * Stub for the combat section — occupies no space when unoverridden.
   * J.PASSIVE.EXT.ABS overrides this to draw JABS combat, shield, and stacking.
   * @param {RPG_State} state The state being detailed.
   */
  // eslint-disable-next-line no-unused-vars
  drawCombatSection(state)
  {
  }

  //region helpers
  /**
   * Draws a "——— Label ———" section divider centered in the active column.
   * Lines are drawn on each side of the title text; they do not pass through it.
   * Advances {@link currentY} by one line height.
   * @param {string} label The section title text.
   */
  drawDetailSectionHeader(label)
  {
    const lh = this.lineHeight();
    const y = this.currentY;
    const cw = this.columnWidth;
    const cx = this.currentX;

    // measure the title to find where the lines should start and end.
    const textWidth = this.textWidth(label);
    const centerX = cx + Math.floor(cw / 2);
    const textX = centerX - Math.floor(textWidth / 2);
    const lineY = y + Math.floor(lh / 2);
    const lineColor = ColorManager.textColor(8);

    // left rule — from the column edge to just before the title.
    const leftEnd = textX - 4;
    if (leftEnd > cx + 4)
    {
      this.contents.fillRect(cx + 4, lineY, leftEnd - (cx + 4), 1, lineColor);
    }

    // right rule — from just after the title to the column edge.
    const rightStart = textX + textWidth + 4;
    const rightEnd = cx + cw - 4;
    if (rightStart < rightEnd)
    {
      this.contents.fillRect(rightStart, lineY, rightEnd - rightStart, 1, lineColor);
    }

    // title text in warm gold.
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
  drawDetailRow(icon, label, value, invertColor = false)
  {
    const y = this.currentY;
    const lh = this.lineHeight();
    const iconW = ImageManager.iconWidth + 4;
    const valueW = value ? 160 : 0;
    let labelX = this.currentX + 4;

    // draw icon when one is provided.
    if (icon > 0)
    {
      this.drawIcon(icon, this.currentX, y);
      labelX = this.currentX + iconW;
    }

    const labelW = this.columnWidth - (labelX - this.currentX) - valueW;
    this.drawText(label, labelX, y, labelW);

    // draw value right-aligned with color coding.
    // for "lower is better" params the color assignment is inverted.
    if (value)
    {
      if (value.startsWith('+'))
      {
        this.changeTextColor(invertColor ? ColorManager.powerDownColor() : ColorManager.powerUpColor());
      }
      else if (value.startsWith('-'))
      {
        this.changeTextColor(invertColor ? ColorManager.powerUpColor() : ColorManager.powerDownColor());
      }
      this.drawText(value, this.currentX + this.columnWidth - valueW, y, valueW, 'right');
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
  isInvertedTrait(trait)
  {
    // only sparam traits (code 23) can be "lower is better" in this ecosystem.
    if (trait._code !== 23) return false;

    // these sparams represent rates where lower = less cost or less damage taken = good.
    const invertedSparamIds = [4, 5, 6, 7, 8];
    return invertedSparamIds.includes(trait._dataId);
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
  evaluateFormula(formula, actor)
  {
    // fall back to the raw formula when there is no actor context to evaluate against.
    if (!actor) return `[${formula}]`;

    try
    {
      // 'a' and 'b' are the RMMZ formula conventions for acting and target battlers.
      // for passive states, the bearer is both — there is no external attacker or target.
      const a = actor;
      const b = actor; // eslint-disable-line no-unused-vars
      // eval is intentional here — this mirrors what RMMZ does internally for damage formulas.
      const result = eval(formula);
      if (typeof result === 'number') return `${Math.round(result)}`;
      return `${result}`;
    }
    catch
    {
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
  filterTraits(state, codes)
  {
    if (!state.traits || state.traits.length === 0) return [];
    return state.traits.filter(t => t.code !== 63 && codes.includes(t.code));
  }
  //endregion helpers

  //region state header
  /**
   * Draws the full-width state icon, name, and description at the top of the panel.
   * Explicitly ignores {@link currentX} and uses the full {@link innerWidth} so the
   * header always spans both columns.
   * @param {RPG_State} state The state to draw the header for.
   */
  drawStateHeader(state)
  {
    const { name, iconIndex, description } = state;
    const lh = this.lineHeight();

    // icon and name — full window width, always at x=0.
    this.drawIcon(iconIndex, 0, this.currentY);
    this.drawText(name, ImageManager.iconWidth + 4, this.currentY, this.innerWidth - ImageManager.iconWidth - 4);
    this.currentY += lh + 4;

    // description — full window width, always at x=0.
    this.drawTextEx(description ?? String.empty, 4, this.currentY, this.innerWidth - 4);
    this.currentY += lh * 2 + 8;
  }
  //endregion state header

  //region parameters section
  /**
   * Draws the Parameters section in the left column.
   * Covers RMMZ param/xparam/sparam traits (codes 21–23) and J-Natural
   * formula-driven buffs and growths (evaluated against the current actor).
   * Skipped when neither source has any content on this state.
   * @param {RPG_State} state The state being detailed.
   */
  drawParametersSection(state)
  {
    const paramTraits = this.filterTraits(state, [21, 22, 23]);
    const naturalLines = this.collectNaturalParamLines(state);

    if (paramTraits.length === 0 && naturalLines.length === 0) return;

    this.drawDetailSectionHeader('Parameters');

    // standard RMMZ param/xparam/sparam rows with per-stat icons.
    // sparams where lower values are beneficial get inverted color coding.
    paramTraits.forEach(rawTrait =>
    {
      const trait = new RPG_Trait(rawTrait);
      this.drawDetailRow(
        this.paramIconForTrait(trait), trait.textName(), trait.textValue(), this.isInvertedTrait(trait));
    });

    // J-Natural formula rows — icon and growth suffix supplied by collectNaturalParamLines.
    naturalLines.forEach(({ icon, label, value }) =>
    {
      this.drawDetailRow(icon, label, value);
    });

    // HCR row from J-Resources: HP cost rate reduction, displayed like MCR/TCR.
    const hcrLine = this.collectHcrLine(state);
    if (hcrLine)
    {
      this.drawDetailRow(hcrLine.icon, hcrLine.label, hcrLine.value, true);
    }

    // J-Crit rows: crit reduction and crit multiplier are combat math, not rewards.
    this.collectCritLines(state).forEach(({ icon, label, value }) =>
    {
      this.drawDetailRow(icon, label, value);
    });
  }

  /**
   * Collects the HP Cost Reduction (HCR) display row from J-Resources.
   * HCR formula evaluates to a positive reduction amount (e.g. 15 = 15% cheaper),
   * so the value is negated for display to match the MCR/TCR visual convention,
   * and invertColor is applied so the resulting '-' prefix renders green.
   * Returns null when J-Resources is not loaded or the state has no HCR tag.
   * @param {RPG_State} state The state to check.
   * @returns {{icon: number, label: string, value: string}|null}
   */
  collectHcrLine(state)
  {
    if (!J.RESOURCES) return null;

    const formula = RPGManager.getStringFromNoteByRegex(state, J.RESOURCES.RegExp.HpCostReduction);
    if (!formula) return null;

    const evaluated = Number(this.evaluateFormula(formula, this._actor));
    return {
      icon:  IconManager.param(0),
      label: 'HP Cost Rate',
      value: `-${Math.abs(evaluated)}%`,
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
  collectCritLines(state)
  {
    if (!J.CRIT) return [];

    const rows = [];

    // crit reduction — protects the bearer from incoming critical hits; more is better.
    const critReduce = RPGManager.getNumberFromNoteByRegex(state, J.CRIT.RegExp.CritDamageReduction);
    if (critReduce)
    {
      rows.push({
        icon:  IconManager.xparam(3),
        label: 'Crit Reduction',
        value: `+${critReduce}`,
      });
    }

    // crit multiplier — amplifies the bearer's outgoing critical damage.
    const critMult = RPGManager.getNumberFromNoteByRegex(state, J.CRIT.RegExp.CritDamageMultiplier);
    if (critMult)
    {
      rows.push({
        icon:  IconManager.xparam(2),
        label: 'Crit Multiplier',
        value: `${critMult > 0 ? '+' : ''}${critMult}`,
      });
    }

    return rows;
  }

  /**
   * Returns the icon index for a param/xparam/sparam trait using IconManager.
   * @param {RPG_Trait} trait The trait to resolve an icon for.
   * @returns {number}
   */
  paramIconForTrait(trait)
  {
    switch (trait.code)
    {
      case 21:
        return IconManager.param(trait.dataId);
      case 22:
        return IconManager.xparam(trait.dataId);
      case 23:
        return IconManager.sparam(trait.dataId);
      default:
        return 0;
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
  collectNaturalParamLines(state)
  {
    if (!J.NATURAL) return [];

    const lines = [];

    // each tuple: [label, regexp, iconIndex, isGrowth]
    // labels pull from TextManager so names stay consistent with parameter displays
    // elsewhere (status screen, Parameters section, etc.) and only need to be
    // updated in one place when Jeremy renames a stat.
    // isGrowth=true means the formula adds extra gain per level-up rather than
    // applying an immediate flat boost; those rows get a "/lv" suffix.
    const checks = [
      // bparams — buffs (immediate flat/rate boost to the base stat).
      [`${TextManager.param(0)} Buff+`,  J.NATURAL.RegExp.MaxLifeBuffPlus,        IconManager.param(0), false],
      [`${TextManager.param(0)} Buff%`,  J.NATURAL.RegExp.MaxLifeBuffRate,        IconManager.param(0), false],
      [`${TextManager.param(1)} Buff+`,  J.NATURAL.RegExp.MaxMagiBuffPlus,        IconManager.param(1), false],
      [`${TextManager.param(1)} Buff%`,  J.NATURAL.RegExp.MaxMagiBuffRate,        IconManager.param(1), false],
      [`${TextManager.param(2)} Buff+`,  J.NATURAL.RegExp.PowerBuffPlus,          IconManager.param(2), false],
      [`${TextManager.param(2)} Buff%`,  J.NATURAL.RegExp.PowerBuffRate,          IconManager.param(2), false],
      [`${TextManager.param(3)} Buff+`,  J.NATURAL.RegExp.DefenseBuffPlus,        IconManager.param(3), false],
      [`${TextManager.param(3)} Buff%`,  J.NATURAL.RegExp.DefenseBuffRate,        IconManager.param(3), false],
      [`${TextManager.param(4)} Buff+`,  J.NATURAL.RegExp.ForceBuffPlus,          IconManager.param(4), false],
      [`${TextManager.param(4)} Buff%`,  J.NATURAL.RegExp.ForceBuffRate,          IconManager.param(4), false],
      [`${TextManager.param(5)} Buff+`,  J.NATURAL.RegExp.ResistBuffPlus,         IconManager.param(5), false],
      [`${TextManager.param(5)} Buff%`,  J.NATURAL.RegExp.ResistBuffRate,         IconManager.param(5), false],
      [`${TextManager.param(6)} Buff+`,  J.NATURAL.RegExp.SpeedBuffPlus,          IconManager.param(6), false],
      [`${TextManager.param(6)} Buff%`,  J.NATURAL.RegExp.SpeedBuffRate,          IconManager.param(6), false],
      [`${TextManager.param(7)} Buff+`,  J.NATURAL.RegExp.LuckBuffPlus,           IconManager.param(7), false],
      [`${TextManager.param(7)} Buff%`,  J.NATURAL.RegExp.LuckBuffRate,           IconManager.param(7), false],
      // bparams — growths (additional gain applied each level-up).
      [`${TextManager.param(0)} Growth+`, J.NATURAL.RegExp.MaxLifeGrowthPlus,     IconManager.param(0), true],
      [`${TextManager.param(0)} Growth%`, J.NATURAL.RegExp.MaxLifeGrowthRate,     IconManager.param(0), true],
      [`${TextManager.param(1)} Growth+`, J.NATURAL.RegExp.MaxMagiGrowthPlus,     IconManager.param(1), true],
      [`${TextManager.param(1)} Growth%`, J.NATURAL.RegExp.MaxMagiGrowthRate,     IconManager.param(1), true],
      [`${TextManager.param(2)} Growth+`, J.NATURAL.RegExp.PowerGrowthPlus,       IconManager.param(2), true],
      [`${TextManager.param(2)} Growth%`, J.NATURAL.RegExp.PowerGrowthRate,       IconManager.param(2), true],
      [`${TextManager.param(3)} Growth+`, J.NATURAL.RegExp.DefenseGrowthPlus,     IconManager.param(3), true],
      [`${TextManager.param(3)} Growth%`, J.NATURAL.RegExp.DefenseGrowthRate,     IconManager.param(3), true],
      [`${TextManager.param(4)} Growth+`, J.NATURAL.RegExp.ForceGrowthPlus,       IconManager.param(4), true],
      [`${TextManager.param(4)} Growth%`, J.NATURAL.RegExp.ForceGrowthRate,       IconManager.param(4), true],
      [`${TextManager.param(5)} Growth+`, J.NATURAL.RegExp.ResistGrowthPlus,      IconManager.param(5), true],
      [`${TextManager.param(5)} Growth%`, J.NATURAL.RegExp.ResistGrowthRate,      IconManager.param(5), true],
      [`${TextManager.param(6)} Growth+`, J.NATURAL.RegExp.SpeedGrowthPlus,       IconManager.param(6), true],
      [`${TextManager.param(6)} Growth%`, J.NATURAL.RegExp.SpeedGrowthRate,       IconManager.param(6), true],
      [`${TextManager.param(7)} Growth+`, J.NATURAL.RegExp.LuckGrowthPlus,        IconManager.param(7), true],
      [`${TextManager.param(7)} Growth%`, J.NATURAL.RegExp.LuckGrowthRate,        IconManager.param(7), true],
      // xparams — buffs.
      [`${TextManager.xparam(0)} Buff+`,  J.NATURAL.RegExp.HitBuffPlus,           IconManager.xparam(0), false],
      [`${TextManager.xparam(0)} Buff%`,  J.NATURAL.RegExp.HitBuffRate,           IconManager.xparam(0), false],
      [`${TextManager.xparam(1)} Buff+`,  J.NATURAL.RegExp.EvadeBuffPlus,         IconManager.xparam(1), false],
      [`${TextManager.xparam(1)} Buff%`,  J.NATURAL.RegExp.EvadeBuffRate,         IconManager.xparam(1), false],
      [`${TextManager.xparam(2)} Buff+`,  J.NATURAL.RegExp.CritChanceBuffPlus,    IconManager.xparam(2), false],
      [`${TextManager.xparam(2)} Buff%`,  J.NATURAL.RegExp.CritChanceBuffRate,    IconManager.xparam(2), false],
      [`${TextManager.xparam(3)} Buff+`,  J.NATURAL.RegExp.CritEvadeBuffPlus,     IconManager.xparam(3), false],
      [`${TextManager.xparam(3)} Buff%`,  J.NATURAL.RegExp.CritEvadeBuffRate,     IconManager.xparam(3), false],
      [`${TextManager.xparam(7)} Buff+`,  J.NATURAL.RegExp.LifeRegenBuffPlus,     IconManager.xparam(7), false],
      [`${TextManager.xparam(7)} Buff%`,  J.NATURAL.RegExp.LifeRegenBuffRate,     IconManager.xparam(7), false],
      [`${TextManager.xparam(8)} Buff+`,  J.NATURAL.RegExp.MagiRegenBuffPlus,     IconManager.xparam(8), false],
      [`${TextManager.xparam(8)} Buff%`,  J.NATURAL.RegExp.MagiRegenBuffRate,     IconManager.xparam(8), false],
      [`${TextManager.xparam(9)} Buff+`,  J.NATURAL.RegExp.TechRegenBuffPlus,     IconManager.xparam(9), false],
      [`${TextManager.xparam(9)} Buff%`,  J.NATURAL.RegExp.TechRegenBuffRate,     IconManager.xparam(9), false],
      // xparams — growths.
      [`${TextManager.xparam(0)} Growth+`, J.NATURAL.RegExp.HitGrowthPlus,        IconManager.xparam(0), true],
      [`${TextManager.xparam(0)} Growth%`, J.NATURAL.RegExp.HitGrowthRate,        IconManager.xparam(0), true],
      [`${TextManager.xparam(1)} Growth+`, J.NATURAL.RegExp.EvadeGrowthPlus,      IconManager.xparam(1), true],
      [`${TextManager.xparam(1)} Growth%`, J.NATURAL.RegExp.EvadeGrowthRate,      IconManager.xparam(1), true],
      [`${TextManager.xparam(2)} Growth+`, J.NATURAL.RegExp.CritChanceGrowthPlus, IconManager.xparam(2), true],
      [`${TextManager.xparam(2)} Growth%`, J.NATURAL.RegExp.CritChanceGrowthRate, IconManager.xparam(2), true],
      [`${TextManager.xparam(7)} Growth+`, J.NATURAL.RegExp.LifeRegenGrowthPlus,  IconManager.xparam(7), true],
      [`${TextManager.xparam(7)} Growth%`, J.NATURAL.RegExp.LifeRegenGrowthRate,  IconManager.xparam(7), true],
      [`${TextManager.xparam(8)} Growth+`, J.NATURAL.RegExp.MagiRegenGrowthPlus,  IconManager.xparam(8), true],
      [`${TextManager.xparam(8)} Growth%`, J.NATURAL.RegExp.MagiRegenGrowthRate,  IconManager.xparam(8), true],
      [`${TextManager.xparam(9)} Growth+`, J.NATURAL.RegExp.TechRegenGrowthPlus,  IconManager.xparam(9), true],
      [`${TextManager.xparam(9)} Growth%`, J.NATURAL.RegExp.TechRegenGrowthRate,  IconManager.xparam(9), true],
      // sparams — buffs.
      [`${TextManager.sparam(0)} Buff+`,  J.NATURAL.RegExp.AggroBuffPlus,         IconManager.sparam(0), false],
      [`${TextManager.sparam(0)} Buff%`,  J.NATURAL.RegExp.AggroBuffRate,         IconManager.sparam(0), false],
      [`${TextManager.sparam(1)} Buff+`,  J.NATURAL.RegExp.ParryBuffPlus,         IconManager.sparam(1), false],
      [`${TextManager.sparam(1)} Buff%`,  J.NATURAL.RegExp.ParryBuffRate,         IconManager.sparam(1), false],
      [`${TextManager.sparam(2)} Buff+`,  J.NATURAL.RegExp.HealingBuffPlus,       IconManager.sparam(2), false],
      [`${TextManager.sparam(2)} Buff%`,  J.NATURAL.RegExp.HealingBuffRate,       IconManager.sparam(2), false],
      [`${TextManager.sparam(4)} Buff+`,  J.NATURAL.RegExp.MagiCostRateBuffPlus,  IconManager.sparam(4), false],
      [`${TextManager.sparam(4)} Buff%`,  J.NATURAL.RegExp.MagiCostRateBuffRate,  IconManager.sparam(4), false],
      [`${TextManager.sparam(5)} Buff+`,  J.NATURAL.RegExp.TechCostRateBuffPlus,  IconManager.sparam(5), false],
      [`${TextManager.sparam(5)} Buff%`,  J.NATURAL.RegExp.TechCostRateBuffRate,  IconManager.sparam(5), false],
      [`${TextManager.sparam(6)} Buff+`,  J.NATURAL.RegExp.PhysDmgRateBuffPlus,  IconManager.sparam(6), false],
      [`${TextManager.sparam(6)} Buff%`,  J.NATURAL.RegExp.PhysDmgRateBuffRate,  IconManager.sparam(6), false],
      [`${TextManager.sparam(7)} Buff+`,  J.NATURAL.RegExp.MagiDmgRateBuffPlus,  IconManager.sparam(7), false],
      [`${TextManager.sparam(7)} Buff%`,  J.NATURAL.RegExp.MagiDmgRateBuffRate,  IconManager.sparam(7), false],
      // sparams — growths.
      [`${TextManager.sparam(0)} Growth+`, J.NATURAL.RegExp.AggroGrowthPlus,      IconManager.sparam(0), true],
      [`${TextManager.sparam(0)} Growth%`, J.NATURAL.RegExp.AggroGrowthRate,      IconManager.sparam(0), true],
      [`${TextManager.sparam(1)} Growth+`, J.NATURAL.RegExp.ParryGrowthPlus,      IconManager.sparam(1), true],
      [`${TextManager.sparam(1)} Growth%`, J.NATURAL.RegExp.ParryGrowthRate,      IconManager.sparam(1), true],
      [`${TextManager.sparam(2)} Growth+`, J.NATURAL.RegExp.HealingGrowthPlus,    IconManager.sparam(2), true],
      [`${TextManager.sparam(2)} Growth%`, J.NATURAL.RegExp.HealingGrowthRate,    IconManager.sparam(2), true],
      [`${TextManager.sparam(4)} Growth+`, J.NATURAL.RegExp.MagiCostRateGrowthPlus, IconManager.sparam(4), true],
      [`${TextManager.sparam(4)} Growth%`, J.NATURAL.RegExp.MagiCostRateGrowthRate, IconManager.sparam(4), true],
      [`${TextManager.sparam(5)} Growth+`, J.NATURAL.RegExp.TechCostRateGrowthPlus, IconManager.sparam(5), true],
      [`${TextManager.sparam(5)} Growth%`, J.NATURAL.RegExp.TechCostRateGrowthRate, IconManager.sparam(5), true],
      [`${TextManager.sparam(6)} Growth+`, J.NATURAL.RegExp.PhysDmgRateGrowthPlus, IconManager.sparam(6), true],
      [`${TextManager.sparam(6)} Growth%`, J.NATURAL.RegExp.PhysDmgRateGrowthRate, IconManager.sparam(6), true],
      [`${TextManager.sparam(7)} Growth+`, J.NATURAL.RegExp.MagiDmgRateGrowthPlus, IconManager.sparam(7), true],
      [`${TextManager.sparam(7)} Growth%`, J.NATURAL.RegExp.MagiDmgRateGrowthRate, IconManager.sparam(7), true],
      // max tech — TP cap.
      [`${TextManager.maxTp()} Base`,    J.NATURAL.RegExp.BaseMaxTech,            IconManager.maxTp(), false],
      [`${TextManager.maxTp()} Buff+`,   J.NATURAL.RegExp.MaxTechBuffPlus,        IconManager.maxTp(), false],
      [`${TextManager.maxTp()} Buff%`,   J.NATURAL.RegExp.MaxTechBuffRate,        IconManager.maxTp(), false],
      [`${TextManager.maxTp()} Growth+`, J.NATURAL.RegExp.MaxTechGrowthPlus,      IconManager.maxTp(), true],
      [`${TextManager.maxTp()} Growth%`, J.NATURAL.RegExp.MaxTechGrowthRate,      IconManager.maxTp(), true],
    ];

    checks.forEach(([label, regexp, icon, isGrowth]) =>
    {
      const formula = RPGManager.getStringFromNoteByRegex(state, regexp);
      if (formula)
      {
        const evaluated = this.evaluateFormula(formula, this._actor);
        // growth values communicate "per level" intent rather than an immediate flat bonus.
        const value = isGrowth ? `${evaluated} /lv` : `${evaluated}`;
        lines.push({ icon, label, value });
      }
    });

    return lines;
  }
  //endregion parameters section

  //region elements section
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
  drawElementsSection(state)
  {
    const dmgInTraits     = this.filterTraits(state, [11]);
    const atkElemTraits   = this.filterTraits(state, [31]);
    const elemLines       = this.collectElemLines(state);

    if (dmgInTraits.length === 0 && atkElemTraits.length === 0 && elemLines.length === 0) return;

    this.drawDetailSectionHeader('Elements');

    // incoming element damage rate — element icon identifies which, "Dmg In" the direction.
    // color is inverted: + means more damage taken (bad = red), - means resistance (good = green).
    dmgInTraits.forEach(rawTrait =>
    {
      const trait = new RPG_Trait(rawTrait);
      this.drawDetailRow(IconManager.element(trait._dataId), 'Dmg In', trait.textValue(), true);
    });

    // attack element — element icon identifies which element is added to basic attacks.
    atkElemTraits.forEach(rawTrait =>
    {
      const trait = new RPG_Trait(rawTrait);
      this.drawDetailRow(
        IconManager.element(trait._dataId), 'Atk Element', TextManager.element(trait._dataId));
    });

    // J-ELEM boost and absorbed element rows — icon and label already resolved.
    elemLines.forEach(({ icon, label, value }) =>
    {
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
  collectElemLines(state)
  {
    if (!J.ELEM) return [];

    const lines = [];

    // boost element: one row per boosted element — icon identifies it, "Boost" the effect.
    const boostCaptures = RPGManager.getAllCapturesFromNoteByRegex(state, J.ELEM.RegExp.BoostElement);
    if (boostCaptures && boostCaptures.length > 0)
    {
      boostCaptures.forEach(([rawId, rawPct]) =>
      {
        const elementId = Number(rawId);
        const pct = Number(rawPct);
        const sign = pct >= 0 ? '+' : '';
        lines.push({ icon: IconManager.element(elementId), label: 'Boost', value: `${sign}${pct}%` });
      });
    }

    // absorbed elements: one row each — icon carries the identity, no value needed.
    const absorbIds = RPGManager.getNumbersFromNoteByRegex(state, J.ELEM.RegExp.AbsorbElementIds);
    if (absorbIds && absorbIds.length > 0)
    {
      absorbIds.forEach(id =>
      {
        lines.push({ icon: IconManager.element(id), label: 'Absorbed', value: '' });
      });
    }

    return lines;
  }
  //endregion elements section

  //region ailments section
  /**
   * Draws the Ailments section in the right column.
   * Covers debuff rate (code 12), state rate (code 13), state nullify (code 14),
   * and attack state inflict (code 32).
   * @param {RPG_State} state The state being detailed.
   */
  drawAilmentsSection(state)
  {
    const ailmentTraits = this.filterTraits(state, [12, 13, 14, 32]);
    if (ailmentTraits.length === 0) return;

    this.drawDetailSectionHeader('Ailments');

    ailmentTraits.forEach(rawTrait =>
    {
      const trait = new RPG_Trait(rawTrait);
      this.drawDetailRow(this.ailmentIconForTrait(trait), trait.textName(), trait.textValue());
    });
  }

  /**
   * Returns the icon for an ailment-related trait.
   * @param {RPG_Trait} trait The trait to resolve an icon for.
   * @returns {number}
   */
  ailmentIconForTrait(trait)
  {
    switch (trait.code)
    {
      case 12:
        return IconManager.param(trait.dataId);
      case 13:
      case 14:
        return $dataStates[trait.dataId] ? $dataStates[trait.dataId].iconIndex : 0;
      case 32:
        return $dataStates[trait.dataId] ? $dataStates[trait.dataId].iconIndex : 0;
      default:
        return 0;
    }
  }
  //endregion ailments section

  //region skills section
  /**
   * Draws the Skills section in the right column.
   * Covers skill-type unlock/lock (codes 41–42) and individual skill learn/seal (codes 43–44).
   * @param {RPG_State} state The state being detailed.
   */
  drawSkillsSection(state)
  {
    const skillTraits = this.filterTraits(state, [41, 42, 43, 44]);
    if (skillTraits.length === 0) return;

    this.drawDetailSectionHeader('Skills');

    skillTraits.forEach(rawTrait =>
    {
      const trait = new RPG_Trait(rawTrait);

      // cross-reference the skill icon for learn/seal rows.
      let icon = 0;
      if (trait.code === 43 || trait.code === 44)
      {
        icon = $dataSkills[trait.dataId] ? $dataSkills[trait.dataId].iconIndex : 0;
      }

      this.drawDetailRow(icon, trait.textName(), trait.textValue());
    });
  }
  //endregion skills section

  //region equip section
  /**
   * Draws the Equip section in the right column.
   * Covers weapon/armor proficiency (codes 51–52), equip lock/seal (codes 53–54),
   * and dual-wield enable (code 55).
   * @param {RPG_State} state The state being detailed.
   */
  drawEquipSection(state)
  {
    const equipTraits = this.filterTraits(state, [51, 52, 53, 54, 55]);
    if (equipTraits.length === 0) return;

    this.drawDetailSectionHeader('Equip');

    equipTraits.forEach(rawTrait =>
    {
      const trait = new RPG_Trait(rawTrait);
      this.drawDetailRow(0, trait.textName(), trait.textValue());
    });
  }
  //endregion equip section

  //region properties section
  /**
   * Draws the Properties section in the right column.
   * Covers skill speed (code 33), attack times+ (code 34), basic-attack override
   * (code 35), action times+ (code 61), special flags (code 62), and party ability (code 64).
   * @param {RPG_State} state The state being detailed.
   */
  drawPropertiesSection(state)
  {
    const propTraits = this.filterTraits(state, [33, 34, 35, 61, 62, 64]);
    if (propTraits.length === 0) return;

    this.drawDetailSectionHeader('Properties');

    propTraits.forEach(rawTrait =>
    {
      const trait = new RPG_Trait(rawTrait);
      const icon = (trait.code === 35 && $dataSkills[trait.value])
        ? $dataSkills[trait.value].iconIndex
        : 0;
      this.drawDetailRow(icon, trait.textName(), trait.textValue());
    });
  }
  //endregion properties section

  //region rewards section
  /**
   * Draws the Rewards section in the right column.
   * Sources: J-Drops, J-Crit, J-SDP, J-Prof, J-Natural reward formulas.
   * Skipped when none have relevant tags on this state.
   * @param {RPG_State} state The state being detailed.
   */
  drawRewardsSection(state)
  {
    const rows = this.collectRewardRows(state);
    if (rows.length === 0) return;

    this.drawDetailSectionHeader('Rewards');

    rows.forEach(({ icon, label, value }) =>
    {
      this.drawDetailRow(icon, label, value);
    });
  }

  /**
   * Collects all reward row data from the various reward-contributing plugins.
   * @param {RPG_State} state The state to check.
   * @returns {Array<{icon: number, label: string, value: string}>}
   */
  collectRewardRows(state)
  {
    const rows = [];

    if (J.DROPS)
    {
      const dropMult = RPGManager.getNumberFromNoteByRegex(state, J.DROPS.RegExp.DropMultiplier);
      if (dropMult)
      {
        rows.push({ icon: 0, label: 'Drop Rate', value: `${dropMult > 0 ? '+' : ''}${dropMult}%` });
      }

      const goldMult = RPGManager.getNumberFromNoteByRegex(state, J.DROPS.RegExp.GoldMultiplier);
      if (goldMult)
      {
        rows.push({ icon: 0, label: 'Gold', value: `${goldMult > 0 ? '+' : ''}${goldMult}%` });
      }
    }

    if (J.SDP)
    {
      const sdpMult = RPGManager.getNumberFromNoteByRegex(state, J.SDP.RegExp.SdpMultiplier);
      if (sdpMult)
      {
        rows.push({ icon: 0, label: 'SDP Points', value: `${sdpMult > 0 ? '+' : ''}${sdpMult}%` });
      }
    }

    if (J.PROF)
    {
      const profBonus = RPGManager.getNumberFromNoteByRegex(state, J.PROF.RegExp.ProficiencyBonus);
      if (profBonus) rows.push({ icon: 0, label: 'Proficiency Bonus', value: `+${profBonus}` });
    }

    if (J.NATURAL)
    {
      const expFormula = RPGManager.getStringFromNoteByRegex(state, J.NATURAL.RegExp.RewardExp);
      if (expFormula)
      {
        rows.push({ icon: 0, label: 'EXP Bonus', value: this.evaluateFormula(expFormula, this._actor) });
      }

      const goldFormula = RPGManager.getStringFromNoteByRegex(state, J.NATURAL.RegExp.RewardGold);
      if (goldFormula)
      {
        rows.push({ icon: 0, label: 'Gold Bonus', value: this.evaluateFormula(goldFormula, this._actor) });
      }

      const sdpFormula = RPGManager.getStringFromNoteByRegex(state, J.NATURAL.RegExp.RewardSdps);
      if (sdpFormula)
      {
        rows.push({ icon: 0, label: 'SDP Bonus', value: this.evaluateFormula(sdpFormula, this._actor) });
      }
    }

    return rows;
  }
  //endregion rewards section
  //endregion draw
}
//endregion Window_PassiveDetail

//region Window_PassiveList
/**
 * A scrollable list of passive states currently applied to the viewed actor.
 * The list is filtered by the active tab's filter function; null means show all.
 *
 * Left/right cursor inputs are forwarded as 'tabLeft'/'tabRight' handler calls
 * so the parent scene can cycle tabs in response.
 */
class Window_PassiveList
  extends Window_Selectable
{
  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle for this window.
   */
  constructor(rect)
  {
    // call super when having extended constructors.
    super(rect);

    // jumpstart initialization on creation.
    this.initialize(rect);
  }

  //region init
  /**
   * Initializes this window.
   * @param {Rectangle} rect The rectangle for this window.
   */
  initialize(rect)
  {
    // perform original logic.
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
     * The working list of passive states matching the current filter.
     * @type {RPG_State[]}
     */
    this._data = [];
  }
  //endregion init

  //region update
  /**
   * Updates the actor and rebuilds the list.
   * @param {Game_Actor} actor The actor whose passives to display.
   */
  setActor(actor)
  {
    this._actor = actor;
    this.refresh();
  }

  /**
   * Updates the active tab filter and rebuilds the list.
   * @param {Function|null} filter A function(stateId, actor) => boolean, or null for no filter.
   */
  setTabFilter(filter)
  {
    this._tabFilter = filter;
    this.refresh();
  }
  //endregion update

  //region list data
  /**
   * Gets the total number of items in the filtered list.
   * @returns {number}
   */
  maxItems()
  {
    return this._data.length;
  }

  /**
   * Rebuilds the filtered working list from the actor's current passive states.
   */
  makeItemList()
  {
    // cannot build a list without an actor.
    if (!this._actor)
    {
      this._data = [];
      return;
    }

    // grab all passive states currently applied to this actor.
    const all = this._actor.getPassiveStates();

    // if there is no filter, show every passive state.
    if (this._tabFilter === null)
    {
      this._data = all;
      return;
    }

    // apply the tab filter; only keep states the filter claims for this tab.
    this._data = all.filter(state => this._tabFilter(state.id, this._actor));

    // always guarantee at least one row so the cursor has somewhere to land.
    if (this._data.length === 0)
    {
      // push a null sentinel; drawItem renders this as a dimmed placeholder.
      this._data.push(null);
    }
  }

  /**
   * Gets the passive state at the current index.
   * @returns {RPG_State|null}
   */
  currentPassiveState()
  {
    return this._data[this.index()] ?? null;
  }
  //endregion list data

  //region draw
  /**
   * Rebuilds the item list and repaints all rows.
   */
  refresh()
  {
    // rebuild the data before painting.
    this.makeItemList();

    // perform original logic to repaint.
    super.refresh();
  }

  /**
   * Draws a single passive state row: icon followed by the state name.
   * A null entry renders as a dimmed "No passives." placeholder.
   * @param {number} index The row index to draw.
   */
  drawItem(index)
  {
    // grab the state at this index.
    const state = this._data[index];

    // get the usable rectangle for this row.
    const rect = this.itemLineRect(index);

    // render the null sentinel as a dimmed informational placeholder.
    if (!state)
    {
      this.changeTextColor(ColorManager.textColor(8));
      this.drawText('No passives.', rect.x, rect.y, rect.width);
      this.resetTextColor();
      return;
    }

    // draw the state icon at the left edge.
    this.drawIcon(state.iconIndex, rect.x, rect.y);

    // draw the state name beside the icon.
    this.drawText(state.name, rect.x + ImageManager.iconWidth + 4, rect.y, rect.width - ImageManager.iconWidth - 4);
  }
  //endregion draw

  //region input
  /**
   * Overrides left cursor to forward the input as a tab-cycle event instead.
   */
  cursorLeft()
  {
    this.callHandler('tabLeft');
  }

  /**
   * Overrides right cursor to forward the input as a tab-cycle event instead.
   */
  cursorRight()
  {
    this.callHandler('tabRight');
  }
  //endregion input
}
//endregion Window_PassiveList

//region Window_PassiveTabHeader
/**
 * A non-interactive header strip that displays the currently active passive viewer tab.
 * The ◀ and ▶ glyphs hint at left/right navigation without consuming any input.
 */
class Window_PassiveTabHeader
  extends Window_Base
{
  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle for this window.
   */
  constructor(rect)
  {
    // call super when having extended constructors.
    super(rect);

    // jumpstart initialization on creation.
    this.initialize(rect);
  }

  //region init
  /**
   * Initializes this window.
   * @param {Rectangle} rect The rectangle for this window.
   */
  initialize(rect)
  {
    // perform original logic.
    super.initialize(rect);

    // initialize the label to the default.
    this._label = 'All';

    // paint the initial state.
    this.refresh();
  }
  //endregion init

  //region update
  /**
   * Sets the tab label displayed in this header and redraws immediately.
   * @param {string} label The display label for the current tab.
   */
  setLabel(label)
  {
    // update the tracked label.
    this._label = label;

    // repaint with the new label.
    this.refresh();
  }
  //endregion update

  //region draw
  /**
   * Redraws the tab header with the current label and navigation glyphs.
   */
  refresh()
  {
    // clear prior contents.
    this.contents.clear();

    // draw the label centered with arrow hints on each side.
    const text = `◀  ${this._label}  ▶`;
    this.drawText(text, 0, 0, this.innerWidth, 'center');
  }
  //endregion draw
}
//endregion Window_PassiveTabHeader

//# sourceMappingURL=J-Passive.js.map
