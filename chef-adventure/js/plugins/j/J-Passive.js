/*  BUNDLED TIME: Sun Nov 13 2022 11:16:42 GMT-0800 (Pacific Standard Time)  */

//#region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.1.0 PASSIVE] Grants skills the ability to provide passive state effects.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @help
 * ============================================================================
 * This plugin enables the ability to have a skill provide passive effects just
 * by knowing the skill in the form of states.
 *
 * By extending the .traitObjects() function, we have added new functionality:
 * - Just knowing a skill can grant passive state effects.
 * - Just having an item/weapon/armor can grant passive state effects.
 *
 * ============================================================================
 * PASSIVE SKILL STATES:
 * Have you ever wanted a battler to be able to learn skills that grant passive
 * effects from states? Well now you can! By adding the correct tags to your
 * skills' notes in the database, you too can make your battlers learn passive
 * skills!
 *
 * NOTE:
 * Under the covers, this plugin scans all skills learned by the battler and
 * parses any of the listed state ids matching the tag format. Any states that
 * are added in this manner are tracked as "passive", and thus always active
 * regardless of duration specifications in the database. These states also
 * cannot be removed, cannot be applied/re-applied while possessing a
 * passive state id of the same state, and cannot be stacked.
 *
 * TAG USAGE:
 * - Skills only.
 *
 * TAG FORMAT:
 *  <passive:[NUM]>          (for one passive state)
 *  <passive:[NUM,NUM,...]>  (for many passive states)
 *
 * TAG EXAMPLES:
 *  <passive:[10]>
 * If this battler has learned this skill, then state of id 10 is applied
 * as a passive state.
 *
 *  <passive:[10,11,12]>
 * If a battler has learned this skill, then they will have states of id
 * 10, 11, and 12 applied as passive states.
 *
 *  <passive:[10]>
 *  <passive:[10,11,12]>
 * If a battler had two separate skills learned matching the above two tags,
 * then the states of id 10, 11, and 12 would be applied as passive states.
 * The duplicate 10 passive state would be ignored.
 *
 * ============================================================================
 * PASSIVE ITEMS/WEAPONS/ARMORS STATES:
 * Have you ever wanted the player's party to be able to gain passive effects
 * just by having an item in their possession? Well now you can! By adding the
 * correct tags to the various entries in the database, you too can make your
 * party gain passive effects from holding stuff! Additionally, unlike the
 * skill passives above, item passive effects will stack! If you have multiple
 * of the item with a non-unique passive on it, it'll stack that many times!
 *
 * NOTE ABOUT STACKING PASSIVES WITH UNIQUE:
 * Under the covers, this plugin will scan all currently owned items and equips
 * in search of the various passives tags. All unique tags are scanned and
 * added to the list first, then any stackable tags will be added if there are
 * no unique call outs first.
 *
 * NOTE ABOUT UNIQUE ITEMS WITH SKILL PASSIVES:
 * Unique passive states granted by items do not consider uniqueness in regards
 * to passive states granted by skills.
 *
 * TAG USAGE:
 * - Items
 * - Weapons
 * - Armors
 *
 * TAG FORMAT:
 *  <passive:[NUM]>                 (for one passive state)
 *  <passive:[NUM,NUM,...]>         (for many passive states)
 *  <uniquePassive:[NUM]>           (for one unique passive state)
 *  <uniquePassive:[NUM,NUM,...]>   (for many unique passive states)
 *
 * TAG EXAMPLES:
 *  <passive:[10]>
 * If this object is in the party's possession, then the state of id 10 will be
 * applied to the entire party at all times.
 *
 *  <passive:[10,11,12]>
 * If this object is in the party's possession, then all states ids of 10,11,12
 * will be applied to the entire party at all times.
 *
 *  <uniquePassive:[10]>
 * If this object is in the party's possession, then the party will have the
 * effects of exactly 1 instance of the state with id 10 at any given time. No
 * other items that grant passive state id 10 will apply.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.1.0
 *    Added passives for items/weapons/armors as well.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */

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
J.PASSIVE.Metadata = {
  /**
   * The name of this plugin.
   */
  Name: `J-Passive`,

  /**
   * The version of this plugin.
   */
  Version: '1.1.0',
};

/**
 * All regular expressions used by this plugin.
 */
J.PASSIVE.RegExp = {
  PassiveStateIds: /<passive:[ ]?(\[[\d, ]+])>/gi,
  UniquePassiveStateIds: /<uniquePassive:[ ]?(\[[\d, ]+])>/gi,
};

/**
 * The collection of all aliased classes for extending.
 */
J.PASSIVE.Aliased = {
  DataManager: new Map(),
  Game_Actor: new Map(),
  Game_Battler: new Map(),
  Game_BattlerBase: new Map(),
  Game_Enemy: new Map(),
  Game_Party: new Map(),
};
//#endregion Introduction

//#region passive state ids
/**
 * The passive state ids that this item possesses.
 * @returns {number[]}
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
//#endregion passive state ids

//#region unique passive state ids
/**
 * The passive state ids that this item possesses.
 * @returns {number[]}
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
//#endregion unique passive state ids

//#region Game_Actor
/**
 * Extends `initmembers()` to include passive skill states.
 */
J.PASSIVE.Aliased.Game_Actor.set('initMembers', Game_Actor.prototype.initMembers);
Game_Actor.prototype.initMembers = function()
{
  J.PASSIVE.Aliased.Game_Actor.get('initMembers').call(this)
  this._j = this._j || {};
  /**
   * A cached list of all passive skills.
   * @type {number[]|null}
   */
  this._j._passiveSkillStateIds = null;
};

/**
 * Extends `traitObjects()` to include our custom passive skills trait objects.
 */
J.PASSIVE.Aliased.Game_Actor.set('traitObjects', Game_Actor.prototype.traitObjects);
Game_Actor.prototype.traitObjects = function()
{
  // perform original logic.
  const originalObjects = J.PASSIVE.Aliased.Game_Actor.get('traitObjects').call(this);

  // add our passive skill states.
  originalObjects.push(...this.sourcesToPassiveSkillStates(originalObjects));

  // add our passive items/weapons/armors states.
  originalObjects.push(...$gameParty.passiveStates());

  // add our passive items/weapons/armors states.
  return originalObjects;
};

/**
 * Extends `learnSkill()` to also empty the passive skill collection forcing a refresh.
 */
J.PASSIVE.Aliased.Game_Actor.set('learnSkill', Game_Actor.prototype.learnSkill);
Game_Actor.prototype.learnSkill = function(skillId)
{
  // perform original logic.
  J.PASSIVE.Aliased.Game_Actor.get('learnSkill').call(this, skillId);

  // refresh our passive skill list.
  this.forcePassiveSkillRefresh();
};

/**
 * Extends `forgetSkill()` to also empty the passive skill collection forcing a refresh.
 */
J.PASSIVE.Aliased.Game_Actor.set('forgetSkill', Game_Actor.prototype.forgetSkill);
Game_Actor.prototype.forgetSkill = function(skillId)
{
  // perform original logic.
  J.PASSIVE.Aliased.Game_Actor.get('forgetSkill').call(this, skillId);

  // refresh our passive skill list.
  this.forcePassiveSkillRefresh();
};

/**
 * Extends `getAllNotes` to include passive skill states.
 * @returns {RPG_BaseItem[]}
 */
J.PASSIVE.Aliased.Game_Actor.set('getAllNotes', Game_Actor.prototype.getAllNotes);
Game_Actor.prototype.getAllNotes = function()
{
  // perform the origina logic to retrieve the objects with notes.
  const objectsWithNotes = J.PASSIVE.Aliased.Game_Actor.get('getAllNotes').call(this);

  // then add all those currently applied passive skill states, too.
  objectsWithNotes.push(...this.passiveSkillStates());

  // also apply the party's effects.
  objectsWithNotes.push(...$gameParty.passiveStates());

  // return that potentially slightly-less massive combination.
  return objectsWithNotes;
};
//#endregion Game_Actor

//#region Game_Battler
/**
 * Extends `initMembers()` to include initialization of our passives collection.
 */
J.PASSIVE.Aliased.Game_BattlerBase.set('initMembers', Game_Battler.prototype.initMembers);
Game_Battler.prototype.initMembers = function()
{
  J.PASSIVE.Aliased.Game_BattlerBase.get('initMembers').call(this);
  this.initPassives();
};

/**
 * Initializes the passives collection
 */
Game_Battler.prototype.initPassives = function()
{
  /**
   * The overarching _j object, where all my stateful plugin data is stored.
   * @type {{}}
   */
  this._j = this._j || {};

  /**
   * A cached list of all our passives.
   * @type {number[]|null}
   */
  this._j._passiveSkillStateIds = null;
};

/**
 * Determines whether or not the state id is a passive state or not.
 * @param {number} stateId The state id to check.
 * @returns {boolean} True if it is identified as passive, false otherwise.
 */
Game_Battler.prototype.isPassiveState = function(stateId)
{
  // if we have access to the cached passives collection...
  if (this._j._passiveSkillStateIds !== null)
  {
    // then the answer lies in whether or not the given state id is in that list.
    return this._j._passiveSkillStateIds.includes(stateId);
  }

  return false;
};

/**
 * Forces a passive skill refresh on this battler.
 */
Game_Battler.prototype.forcePassiveSkillRefresh = function()
{
  // only do this if its not already null.
  if (this._j._passiveSkillStateIds !== null)
  {
    // empty the list.
    this._j._passiveSkillStateIds.length = 0;

    // switch it to null for requesting a refresh.
    this._j._passiveSkillStateIds = null;
  }
};

/**
 * Extends `isStateAddable()` to prevent adding states if they are identified as passive.
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
 * Extends `removeState()` to prevent removal of states if they are identified as passive.
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
 * Parses all skills to get at the state ids provided, and thusly the passive states associated
 * with any skills learned by the actor.
 *
 * This is an expensive process, and shouldn't be performed on a per-frame basis.
 * @param {RPG_EquipItem[]} traitObjects
 * @returns {RPG_State[]}
 */
Game_Battler.prototype.sourcesToPassiveSkillStates = function(traitObjects)
{
  // this array is only null when it hasn't yet been initialized yet or if we're forcing a refresh.
  if (this._j._passiveSkillStateIds !== null)
  {
    // map all the passive state ids into passive states.
    return this._j._passiveSkillStateIds.map(this.state, this);
  }

  // reset the array of skill-state ids to empty.
  this._j._passiveSkillStateIds = [];

  // combine the base skill ids and added skill ids together into a single collection.
  const skillIds = this.skillIdList(traitObjects);

  // CAUTION! this is an expensive chain of array manipulation, don't do it a lot if avoidable!
  const passiveStates = this.skillsToPassiveStates(skillIds);

  return passiveStates;
};

/**
 * Gets all the current passive skill states, if any exist.
 * @returns {RPG_State[]}
 */
Game_Battler.prototype.passiveSkillStates = function()
{
  // this array is only null when it hasn't yet been initialized yet or if we're forcing a refresh.
  if (this._j._passiveSkillStateIds !== null)
  {
    // map all the passive state ids into passive states.
    return this._j._passiveSkillStateIds.map(this.state, this);
  }

  return [];
};

/**
 * Extends {@link #allStates}.
 * Includes states from passive skills as well.
 * @returns {RPG_State[]}
 */
J.PASSIVE.Aliased.Game_Battler.set('allStates', Game_Battler.prototype.allStates);
Game_Battler.prototype.allStates = function()
{
  // get all original states.
  const states = J.PASSIVE.Aliased.Game_Battler.get('allStates').call(this);

  // add in all passive skill states.
  states.push(...this.passiveSkillStates());

  // return that combined collection.
  return states;
};

/**
 * Gets a combined list of both base skill ids this battler knows.
 * The list includes skills learned via class/assignation, and also
 * @param {RPG_EquipItem[]} traitObjects The presumed objects bearing traits.
 * @returns {number[]} The combined list of base skill ids and added-via-traits skill ids.
 */
Game_Battler.prototype.skillIdList = function(traitObjects)
{
  // get the base skills that the actor knows.
  const baseSkillIds = this.skillsIdsFromSelf();

  // get any added skills from other traits, like equipment teaching a skill.
  const addedSkillIds = this.skillsIdsFromTraits(traitObjects);

  // combine the base skill ids and added skill ids together into a single collection.
  return [...baseSkillIds, ...addedSkillIds];
};

/**
 * Gets all skill ids learned from oneself, via normal means.
 * For actors, this is just whatever their class-learned skill list is.
 * @returns {number[]}
 */
Game_Battler.prototype.skillsIdsFromSelf = function()
{
  return this._skills;
};

/**
 * A manual concatenation of retrieval of all skill ids from any traits the actor has-
 * without actually calling any of the trait methods. This is done to avoid the
 * circular dependency of `.traitObjects()` and this passive skill flow.
 * @param {RPG_EquipItem[]} traitObjects The trait objects to parse for added skills.
 * @returns {number[]} All found added skill ids from the given trait objects.
 */
Game_Battler.prototype.skillsIdsFromTraits = function(traitObjects)
{
  return traitObjects
  // concat all the traits from the various database objects.
    .reduce((r, obj) => r.concat(obj.traits), [])
  // concat the list of what types of traits these are.
    .reduce((r, trait) => r.concat(trait.dataId), [])
  // filter all the traits by the "add skill" trait.
    .filter(trait => trait.code === Game_BattlerBase.TRAIT_SKILL_ADD)
  // add all the objects together for a full list of skill ids.
    .reduce((r, obj) => r.concat(obj.traits), []);
};

/**
 * Takes in a list of skill passives, extracts any passive state ids that may
 * be residing in the notes of them, and returns the relevant state objects.
 *
 * This may result in an empty array.
 * @param {number[]} skillIds The skill ids to convert to passives.
 * @returns {rm.types.State[]}
 */
Game_Battler.prototype.skillsToPassiveStates = function(skillIds)
{
  // translate all skill ids to skills.
  const skills = skillIds.map(this.skill, this);

  // filter out skills that aren't "passive".
  const passiveSkills = skills.filter(this.isPassiveSkill, this);

  // convert the skills into an array of state ids associated with the passives.
  const passiveStateIds = passiveSkills
    .map(this.extractPassives, this)
    .flat(); // because we prefer to work with 1-dimensional arrays.

  // filter out passive states that we already have.
  const passiveRelevantStateIds = passiveStateIds.filter(this.isRelevantPassiveState, this);

  // add the missing passive states to the ones we have.
  this._j._passiveSkillStateIds.push(...passiveRelevantStateIds);

  // translate the state ids into actual states.
  const passiveStates = passiveRelevantStateIds.map(this.state, this);

  // return these newly determined trait objects.
  return passiveStates;
};

/**
 * Determines whether or not a skill is identified as "passive".
 * This is intended to be used as a filter function against a collection of skills,
 * though it can be used to identify a singular skill otherwise.
 * @param {RPG_Skill} skill The skill to identify.
 * @returns {boolean} True if the skill is identified as passive, false otherwise.
 */
Game_Battler.prototype.isPassiveSkill = function(skill)
{
  return !!skill.metadata("passive");
};

/**
 * Determines whether or not a state is considered "relevant".
 * This is intended to be used as a filter function against a collection of passive state ids,
 * though it can be used to identify if a passive state id is not yet applied to this battler.
 * @param {number} stateId The state id to check for relevancy.
 * @returns {boolean} True if the state is a non-applied state, false otherwise.
 */
Game_Battler.prototype.isRelevantPassiveState = function(stateId)
{
  return !this.hasPassiveState(stateId);
};

/**
 * Extracts the passive state ids out of the skill.
 * This is intended to be used as a map function against a collection of skills
 * that contain state ids, though it can be used to extract a single skill's passive states.
 * @param {RPG_Skill} referenceData The skill to extract passive state ids from.
 * @returns {number[]}
 */
Game_Battler.prototype.extractPassives = function(referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return [];

  const notedata = referenceData.note.split(/[\r\n]+/);
  const structure = /<passive:[ ]?(\[[\d, ]+])>/i;
  const passives = [];
  notedata.forEach(line =>
  {
    if (line.match(structure))
    {
      const data = JSON.parse(RegExp.$1);
      passives.push(...data);
    }
  });

  return passives;
};

/**
 * Checks whether or not this battler already has the passive state applied.
 * @param {number} stateId The passive state id to check.
 * @returns {boolean} True if it is already applied, false otherwise.
 */
Game_Battler.prototype.hasPassiveState = function(stateId)
{
  return this._j._passiveSkillStateIds.includes(stateId);
};
//#endregion Game_Battler

//#region Game_Enemy
/**
 * Gets all skills learned from oneself.
 * In the case of enemies, this extracts the list of skill ids from the various actions
 * they can execute from their action list, as well as their "attack skill".
 * @returns {number[]}
 */
Game_Enemy.prototype.skillIdsFromSelf = function()
{
  return this.skills().map(skill => skill.id);
};
//#endregion Game_Enemy

//#region Game_Party
/**
 * Extends {@link #initialize}.
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
   * The over-arching J object to contain all additional plugin parameters.
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
 * Extends {@link #gainItem}.
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
//#endregion Game_Party