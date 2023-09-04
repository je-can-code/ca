//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v2.0.0 PASSIVE] Grants passive states from various database objects.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * OVERVIEW:
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
 * - 2.0.0
 *    Refactored the entire passive state implementation.
 *    Added passive states for all database objects with notes.
 *    Added support for only-while-equipped passive states.
 * - 1.1.0
 *    Added passives for items/weapons/armors as well.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */
//endregion Introduction

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.PASSIVE = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.PASSIVE.Metadata = {};
J.PASSIVE.Metadata.Name = `J-Passive`;
J.PASSIVE.Metadata.Version = '2.0.0';

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
J.PASSIVE.Aliased.Window_MoreEquipData = new Map();
//endregion Introduction

//region RPG_BaseBattler
//region passive state ids
/**
 * The passive state ids that this item possesses.
 * @type {number[]}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "passiveStateIds",
  {
    get: function()
    {
      return this.extractPassiveStateIds();
    },
  });

/**
 * Extracts the value from the notes.
 * @returns {number[]}
 */
RPG_BaseBattler.prototype.extractPassiveStateIds = function()
{
  return this.getNumberArrayFromNotesByRegex(J.PASSIVE.RegExp.PassiveStateIds);
};
//endregion passive state ids

//region unique passive state ids
/**
 * The passive state ids that this item possesses.
 * @type {number[]}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "uniquePassiveStateIds",
  {
    get: function()
    {
      return this.extractUniquePassiveStateIds();
    },
  });

/**
 * Extracts the value from the notes.
 * @returns {number[]}
 */
RPG_BaseBattler.prototype.extractUniquePassiveStateIds = function()
{
  return this.getNumberArrayFromNotesByRegex(J.PASSIVE.RegExp.UniquePassiveStateIds);
};
//endregion unique passive state ids

//region equipped passive state ids
/**
 * The battler itself cannot be equipped, thus it cannot have equipped passive states.
 * @type {Array.empty}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "equippedPassiveStateIds",
  {
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
Object.defineProperty(RPG_BaseBattler.prototype, "uniqueEquippedPassiveStateIds",
  {
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
Object.defineProperty(RPG_BaseItem.prototype, "passiveStateIds",
  {
    get: function()
    {
      return this.extractPassiveStateIds();
    },
  });

/**
 * Extracts the value from the notes.
 * @returns {number[]}
 */
RPG_BaseItem.prototype.extractPassiveStateIds = function()
{
  return this.getNumberArrayFromNotesByRegex(J.PASSIVE.RegExp.PassiveStateIds);
};
//endregion passive state ids

//region unique passive state ids
/**
 * The non-duplicative passive state ids that this item possesses.
 * @type {number[]}
 */
Object.defineProperty(RPG_BaseItem.prototype, "uniquePassiveStateIds",
  {
    get: function()
    {
      return this.extractUniquePassiveStateIds();
    },
  });

/**
 * Extracts the value from the notes.
 * @returns {number[]}
 */
RPG_BaseItem.prototype.extractUniquePassiveStateIds = function()
{
  return this.getNumberArrayFromNotesByRegex(J.PASSIVE.RegExp.UniquePassiveStateIds);
};
//endregion unique passive state ids

//region equipped passive state ids
/**
 * The passive state ids that this equipment will apply while this equip is equipped.
 * @type {number[]}
 */
Object.defineProperty(RPG_BaseItem.prototype, "equippedPassiveStateIds",
  {
    get: function()
    {
      return this.extractEquippedPassiveStateIds();
    },
  });

/**
 * Extracts the value from the notes.
 * @returns {number[]}
 */
RPG_BaseItem.prototype.extractEquippedPassiveStateIds = function()
{
  return this.getNumberArrayFromNotesByRegex(J.PASSIVE.RegExp.EquippedPassiveStateIds);
};
//endregion equipped passive state ids

//region unique equipped passive state ids
/**
 * The non-duplicative passive state ids that this equipment will apply
 * while this equip is equipped.
 * @type {number[]}
 */
Object.defineProperty(RPG_BaseItem.prototype, "uniqueEquippedPassiveStateIds",
  {
    get: function()
    {
      return this.extractUniqueEquippedPassiveStateIds();
    },
  });

/**
 * Extracts the value from the notes.
 * @returns {number[]}
 */
RPG_BaseItem.prototype.extractUniqueEquippedPassiveStateIds = function()
{
  return this.getNumberArrayFromNotesByRegex(J.PASSIVE.RegExp.UniqueEquippedPassiveStateIds);
};
//endregion unique equipped passive state ids
//endregion RPG_BaseItem

//region RPG_Class
//region passive state ids
/**
 * The passive state ids that this item possesses.
 * @type {number[]}
 */
Object.defineProperty(RPG_Class.prototype, "passiveStateIds",
  {
    get: function()
    {
      return this.extractPassiveStateIds();
    },
  });

/**
 * Extracts the value from the notes.
 * @returns {number[]}
 */
RPG_Class.prototype.extractPassiveStateIds = function()
{
  return this.getNumberArrayFromNotesByRegex(J.PASSIVE.RegExp.PassiveStateIds);
};
//endregion passive state ids

//region unique passive state ids
/**
 * The non-duplicative passive state ids that this item possesses.
 * @type {number[]}
 */
Object.defineProperty(RPG_Class.prototype, "uniquePassiveStateIds",
  {
    get: function()
    {
      return this.extractUniquePassiveStateIds();
    },
  });

/**
 * Extracts the value from the notes.
 * @returns {number[]}
 */
RPG_Class.prototype.extractUniquePassiveStateIds = function()
{
  return this.getNumberArrayFromNotesByRegex(J.PASSIVE.RegExp.UniquePassiveStateIds);
};
//endregion unique passive state ids

//region equipped passive state ids
/**
 * The passive state ids that this equipment will apply while this equip is equipped.
 * @type {number[]}
 */
Object.defineProperty(RPG_Class.prototype, "equippedPassiveStateIds",
  {
    get: function()
    {
      return this.extractEquippedPassiveStateIds();
    },
  });

/**
 * Extracts the value from the notes.
 * @returns {number[]}
 */
RPG_Class.prototype.extractEquippedPassiveStateIds = function()
{
  return this.getNumberArrayFromNotesByRegex(J.PASSIVE.RegExp.EquippedPassiveStateIds);
};
//endregion equipped passive state ids

//region unique equipped passive state ids
/**
 * The non-duplicative passive state ids that this equipment will apply
 * while this equip is equipped.
 * @type {number[]}
 */
Object.defineProperty(RPG_Class.prototype, "uniqueEquippedPassiveStateIds",
  {
    get: function()
    {
      return this.extractUniqueEquippedPassiveStateIds();
    },
  });

/**
 * Extracts the value from the notes.
 * @returns {number[]}
 */
RPG_Class.prototype.extractUniqueEquippedPassiveStateIds = function()
{
  return this.getNumberArrayFromNotesByRegex(J.PASSIVE.RegExp.UniqueEquippedPassiveStateIds);
};
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
  J.PASSIVE.Aliased.Game_Actor.get('onSetup').call(this, actorId);

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
    this.currentClass(),
  ];

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
  const originalObjects = J.PASSIVE.Aliased.Game_Actor.get('traitObjects').call(this);

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
  J.PASSIVE.Aliased.Game_Actor.get('onLearnNewSkill').call(this, skillId);

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
  J.PASSIVE.Aliased.Game_Actor.get('onForgetSkill').call(this, skillId);

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
  J.PASSIVE.Aliased.Game_Actor.get('onEquipChange').call(this);

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
  J.PASSIVE.Aliased.Game_Actor.get('onClassChange').call(this, classId, keepExp);

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
  const originalSources = J.PASSIVE.Aliased.Game_Actor.get('getNotesSources').call(this);

  // newly defined sources for passives.
  const passiveSources = [
    // then add all those currently applied passive states, too.
    ...this.getPassiveStates(),

    // also apply the party's effects.
    ...$gameParty.passiveStates(),
  ];

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
  J.PASSIVE.Aliased.Game_BattlerBase.get('initMembers').call(this);

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
 * Checks whether or not this battler currently has a given passive state applied.
 * @param {number} stateId The id of the state to check for.
 * @returns {boolean} True if this battler has the passive state applied, false otherwise.
 */
Game_Battler.prototype.hasPassiveStateId = function(stateId)
{
  return this.getPassiveStateIds().includes(stateId);
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
  if (!allowDuplicates && this.getPassiveStateIds().includes(stateId)) return false;

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
  return this.getPassiveStateIds().map(this.state, this);
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
        stackablePassiveStateIds.set(id, stack+1);
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
  const states = J.PASSIVE.Aliased.Game_Battler.get('allStates').call(this);

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
  return J.PASSIVE.Aliased.Game_Battler.get('isStateAddable').call(this, stateId);
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
  J.PASSIVE.Aliased.Game_Battler.get('onStateAdded').call(this, stateId);

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
  J.PASSIVE.Aliased.Game_Battler.get('removeState').call(this, stateId);
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
  J.PASSIVE.Aliased.Game_Battler.get('onStateRemoval').call(this, stateId);

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
  J.PASSIVE.Aliased.Game_Enemy.get('onSetup').call(this, enemyId);

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
  const originalObjects = J.PASSIVE.Aliased.Game_Enemy.get('traitObjects').call(this);

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
  const originalSources = J.PASSIVE.Aliased.Game_Enemy.get('getNotesSources').call(this);

  // newly defined sources for passives.
  const passiveSources = [
    // then add all those currently applied passive skill states, too.
    ...this.getPassiveStates(),
  ];

  // combine the sources.
  const combinedSources = originalSources.concat(passiveSources);

  // return the combination.
  return combinedSources;
};
//endregion Game_Enemy

//region Game_Party
/**
 * Extends {@link #initialize}.<br>
 * Includes our custom members as well.
 */
J.PASSIVE.Aliased.Game_Party.set('initialize', Game_Party.prototype.initialize);
Game_Party.prototype.initialize = function()
{
  // perform original logic.
  J.PASSIVE.Aliased.Game_Party.get('initialize').call(this);

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
        stackablePassiveStateIds.set(id, stack+1);
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
  J.PASSIVE.Aliased.Game_Party.get('gainItem').call(this, item, amount, includeEquip);

  // also refresh our passive states tracker.
  this.refreshPassiveStates();
};
//endregion Game_Party

//region Window_MoreEquipData
/**
 * Extends {@link #addJabsEquipmentData}.<br>
 * Includes additional entries about passive states provided by the equipment.
 */
J.PASSIVE.Aliased.Window_MoreEquipData.set('addJabsEquipmentData', Window_MoreEquipData.prototype.addJabsEquipmentData);
Window_MoreEquipData.prototype.addJabsEquipmentData = function()
{
  // perform original logic.
  J.PASSIVE.Aliased.Window_MoreEquipData.get('addJabsEquipmentData').call(this);

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
  const allIds = [...stackablePassiveIds, ...uniquePassiveIds].sort();

  // an iterator function for rendering a command based on the passive state id.
  const forEacher = passiveStateId =>
  {
    // extract the data from the state.
    const state = this.actor.state(passiveStateId);
    const { name, iconIndex } = state;

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