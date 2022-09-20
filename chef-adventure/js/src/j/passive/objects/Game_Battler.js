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