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
 * Extends `getCurrentWithNotes` to include passive skill states.
 * @returns {RPG_BaseItem[]}
 */
J.PASSIVE.Aliased.Game_Actor.set('getAllNotes', Game_Actor.prototype.getAllNotes);
Game_Actor.prototype.getAllNotes = function()
{
  // perform the origina logic to retrieve the objects with notes.
  const objectsWithNotes = J.PASSIVE.Aliased.Game_Actor.get('getAllNotes').call(this);

  // then add all those currently applied passive skill states, too.
  objectsWithNotes.push(...this.passiveSkillStates())

  // return that potentially slightly-less massive combination.
  return objectsWithNotes;
};

/**
 * Extends `getCurrentWithNotes` to include passive skill states.
 * @returns {RPG_BaseItem[]}
 */
J.PASSIVE.Aliased.Game_Actor.set('getCurrentWithNotes', Game_Actor.prototype.getCurrentWithNotes);
Game_Actor.prototype.getCurrentWithNotes = function()
{
  // perform the origina logic to retrieve the objects with notes.
  const objectsWithNotes = J.PASSIVE.Aliased.Game_Actor.get('getCurrentWithNotes').call(this);

  // then add all those currently applied passive skill states, too.
  objectsWithNotes.push(...this.passiveSkillStates())

  // return that potentially slightly-less massive combination.
  return objectsWithNotes;
};
//#endregion Game_Actor