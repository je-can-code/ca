//region Game_Enemy
J.PROF.Aliased.Game_Enemy.set("initMembers", Game_Enemy.prototype.initMembers);
Game_Enemy.prototype.initMembers = function()
{
  J.PROF.Aliased.Game_Enemy.get("initMembers").call(this);

  /**
   * The J object where all my additional properties live.
   */
  this._j ||= {};

  /**
   * A grouping of all boosts this actor has can potentially consume.
   * @type {SkillProficiency[]}
   */
  this._j._profs ||= [];
};

/**
 * Gets all skill proficiencies for this enemy.
 * @returns {SkillProficiency[]}
 */
Game_Enemy.prototype.skillProficiencies = function()
{
  return this._j._profs;
};

/**
 * Gets a skill prof by its skill id.
 * @param {number} skillId The skill id.
 * @returns {SkillProficiency|null}
 */
Game_Enemy.prototype.skillProficiencyBySkillId = function(skillId)
{
  return this
    .skillProficiencies()
    .find(prof => prof.skillId === skillId);
};

/**
 * Adds a new skill prof to the collection.
 * @param {number} skillId The skill id.
 * @param {number} initialProficiency Optional. The starting prof.
 * @returns {SkillProficiency}
 */
Game_Enemy.prototype.addSkillProficiency = function(skillId, initialProficiency = 0)
{
  const exists = this.skillProficiencyBySkillId(skillId);
  if (exists)
  {
    console.warn(`Attempted to recreate skill proficiency for skillId: ${skillId}.`);
    return exists;
  }

  const proficiency = new SkillProficiency(skillId, initialProficiency);
  this._j._profs.push(proficiency);
  this._j._profs.sort();
  return proficiency;
};

/**
 * Improves the skill prof by a given amount (defaults to 1).
 * @param {number} skillId The skill id.
 * @param {number} amount The amount to improve the prof by.
 */
Game_Enemy.prototype.increaseSkillProficiency = function(skillId, amount = 1)
{
  let proficiency = this.skillProficiencyBySkillId(skillId);

  // if the prof doesn't exist, create it first then improve it.
  if (!proficiency)
  {
    proficiency = this.addSkillProficiency(skillId);
  }

  proficiency.improve(amount);
};
//endregion Game_Enemy