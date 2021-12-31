//#region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0 PASSIVE] Grants skills the ability to provide passive state effects.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @help
 * ============================================================================
 * This plugin enables the ability to have a skill provide passive effects just
 * by knowing the skill in the form of states.
 *
 * By extending the .traitObjects() function, we have added new functionality:
 * - Just knowing a skill can grant a passive state effect.
 *
 * ============================================================================
 * PASSIVE SKILL STATES:
 * Have you ever wanted a battler to be able to have passive skills? Well now
 * you can! By applying the appropriate tag to the skill(s) in question, you
 * can add one or more "passive states" just by having the battler know the
 * skill!
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
 *  <passive:[NUM]>          (for one passive state on this skill)
 *  <passive:[NUM,NUM,...]>  (for many passive states on this skill)
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
  Name: `J-PassiveSkills`,

  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

J.PASSIVE.Aliased = {
  DataManager: new Map(),
  Game_Actor: new Map(),
  Game_Battler: new Map(),
  Game_BattlerBase: new Map(),
  Game_Enemy: new Map(),
};
//#endregion Introduction

//#region Game objects

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
  const originalObjects = J.PASSIVE.Aliased.Game_Actor.get('traitObjects').call(this);

  // injects all state objects provided into the list of considered trait objects.
  // this enforces them to be considered permanently, so long as the skill has
  // not been .forgetSkill()-ed.
  const passiveSkillStates = this.sourcesToPassiveSkillStates(originalObjects);
  originalObjects.push(...passiveSkillStates);
  return originalObjects;
};

/**
 * Extends `learnSkill()` to also empty the passive skill collection forcing a refresh.
 */
J.PASSIVE.Aliased.Game_Actor.set('learnSkill', Game_Actor.prototype.learnSkill);
Game_Actor.prototype.learnSkill = function(skillId)
{
  J.PASSIVE.Aliased.Game_Actor.get('learnSkill').call(this, skillId);
  this.forcePassiveSkillRefresh();
};

/**
 * Extends `forgetSkill()` to also empty the passive skill collection forcing a refresh.
 */
J.PASSIVE.Aliased.Game_Actor.set('forgetSkill', Game_Actor.prototype.forgetSkill);
Game_Actor.prototype.forgetSkill = function(skillId)
{
  J.PASSIVE.Aliased.Game_Actor.get('forgetSkill').call(this, skillId);
  this.forcePassiveSkillRefresh();
};

/**
 * OVERWRITE Gets the skill associated with the given skill id.
 * By abstracting this, we can modify the underlying skill before it reaches its destination.
 * @param {number} skillId The skill id to get the skill for.
 * @returns {rm.types.Skill}
 */
Game_Actor.prototype.skill = function(skillId)
{
  return J.EXTEND
    ? OverlayManager.getExtendedSkill(this, skillId)
    : $dataSkills[skillId];
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
 * @param {rm.types.EquipItem[]} traitObjects
 * @returns {rm.types.State[]}
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
 * @returns {rm.types.State[]}
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
 * Gets all states on the battler, including passive skill states.
 * @returns {rm.types.State[]}
 */
Game_Battler.prototype.allStates = function()
{
  const states = [];

  // add in all base states.
  states.push(...this.states());

  // add in all passive skill states.
  states.push(...this.passiveSkillStates());

  // return that combined collection.
  return states;
};

/**
 * Gets a combined list of both base skill ids this battler knows.
 * The list includes skills learned via class/assignation, and also
 * @param {rm.types.EquipItem[]} traitObjects The presumed objects bearing traits.
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
 * @param {rm.types.EquipItem[]} traitObjects The trait objects to parse for added skills.
 * @returns {number[]} All found added skill ids from the given trait objects.
 */
Game_Battler.prototype.skillsIdsFromTraits = function(traitObjects)
{
  return traitObjects
    .reduce((r, obj) => r.concat(obj.traits), [])
    .reduce((r, trait) => r.concat(trait.dataId), [])
    .filter(trait => trait.code === Game_BattlerBase.TRAIT_SKILL_ADD)
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
 * Gets the skill associated with the given skill id.
 * By default, we simply get the skill from the database with no modifications.
 * @param {number} skillId The skill id to get the skill for.
 * @returns {rm.types.Skill}
 */
Game_Battler.prototype.skill = function(skillId)
{
  return $dataSkills[skillId];
};

/**
 * Determines whether or not a skill is identified as "passive".
 * This is intended to be used as a filter function against a collection of skills,
 * though it can be used to identify a singular skill otherwise.
 * @param {rm.types.Skill} skill The skill to identify.
 * @returns {boolean} True if the skill is identified as passive, false otherwise.
 */
Game_Battler.prototype.isPassiveSkill = function(skill)
{
  return !!(skill.meta && skill.meta['passive']);
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
 * @param {rm.types.Skill} referenceData The skill to extract passive state ids from.
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

// we don't need to force the user to use our BASE plugin if they aren't already using it.
// define this function if the user is not using the BASE plugin.
if (!J.BASE)
{
  /**
   * Converts all "actions" from an enemy into their collection of known skills.
   * This includes both skills listed in their skill list, and any added skills via traits.
   * @returns {rm.types.Skill[]}
   */
  Game_Enemy.prototype.skills = function()
  {
    // get actions from their action list.
    const actionSkillIds = this.enemy().actions
      .map(action => this.skill(action.skillId));

    // get their "attack skill" trait skill ids.
    const attackSkillId = this.enemy().traits
      .filter(trait => trait.code === Game_BattlerBase.TRAIT_ATTACK_SKILL)
      .map(skillTrait => this.skill(skillTrait.dataId));

    return [...actionSkillIds, ...attackSkillId].sort();
  };
}
//#endregion Game_Enemy

//#endregion Game objects