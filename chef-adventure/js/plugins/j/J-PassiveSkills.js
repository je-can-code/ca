//#region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0 PASSIVE] Grants skills the ability to provide passive effects.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @help
 * ============================================================================
 * This plugin enables the ability to have a skill provide passive effects just
 * by knowing the skill in the form of states.
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
  originalObjects.push(...this.passiveSkillStates(originalObjects));
  return originalObjects;
};

/**
 * Extends `learnSkill()` to also empty the passive skill collection forcing a refresh.
 */
J.PASSIVE.Aliased.Game_Actor.set('learnSkill', Game_Actor.prototype.learnSkill);
Game_Actor.prototype.learnSkill = function(skillId) {
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
 * Gets the skill associated with the given skill id.
 *
 * TODO: add overlays?
 * @param {number} skillId The skill id to get the skill for.
 * @returns {rm.types.Skill}
 */
Game_Actor.prototype.skill = function(skillId)
{
  return $dataSkills[skillId];
};
//#endregion Game_Actor

//#region Game_BattlerBase
/**
 * Extends `initMembers()` to include initialization of our passives collection.
 */
J.PASSIVE.Aliased.Game_BattlerBase.set('initMembers', Game_BattlerBase.prototype.initMembers);
Game_BattlerBase.prototype.initMembers = function()
{
  J.PASSIVE.Aliased.Game_BattlerBase.get('initMembers').call(this);
  this.initPassives();
};

/**
 * Initializes the passives collection
 */
Game_BattlerBase.prototype.initPassives = function()
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
Game_BattlerBase.prototype.isPassiveState = function(stateId)
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
Game_BattlerBase.prototype.forcePassiveSkillRefresh = function()
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
//#endregion Game_BattlerBase

//#region Game_Battler
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
Game_Battler.prototype.passiveSkillStates = function(traitObjects)
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
 * Gets a combined list of both base skill ids this battler knows.
 * The list includes skills learned via class/assignation, and also
 * @param {rm.types.EquipItem[]} traitObjects The presumed objects bearing traits.
 * @returns {number[]} The combined list of base skill ids and added-via-traits skill ids.
 */
Game_Battler.prototype.skillIdList = function(traitObjects)
{
  // get the base skills that the actor knows.
  const baseSkillIds = this._skills;

  // get any added skills from other traits, like equipment teaching a skill.
  // this is a literal copy-paste of the four steps it takes to get skills added via traits.
  const addedSkillIds = traitObjects
    .reduce((r, obj) => r.concat(obj.traits), [])
    .reduce((r, trait) => r.concat(trait.dataId), [])
    .filter(trait => trait.code === Game_BattlerBase.TRAIT_SKILL_ADD)
    .reduce((r, obj) => r.concat(obj.traits), [])

  // combine the base skill ids and added skill ids together into a single collection.
  return [...baseSkillIds, ...addedSkillIds];
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

  // convert the skills into an array of arrays of state ids associated with the passives.
  const passiveStateIds = passiveSkills
    .map(this.extractPassives, this)
    .flat(); // flatten because we prefer 1-dimensional arrays.

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
 * By abstracting this, we can modify the underlying skill before it reaches its destination.
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
 * @param {rm.types.Skill} skill The skill to extract passives from.
 * @returns {number[][]}
 */
Game_Battler.prototype.extractPassives = function(skill)
{
  return JSON.parse(skill.meta['passive']);
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

/**
 * Gets the state associated with the given state id.
 * By abstracting this, we can modify the underlying state before it reaches its destination.
 * @param {number} stateId
 * @returns {rm.types.State}
 */
Game_Battler.prototype.state = function(stateId)
{
  return $dataStates[stateId];
};
//#endregion Game_Battler

//#endregion Game objects