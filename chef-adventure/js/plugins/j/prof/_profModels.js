/*:
 * @target MZ
 * @plugindesc
 * [v1.0 PROF] The various custom models created for proficiencies.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-Proficiency
 * @orderBefore J-Proficiency
 * @help
 * ============================================================================
 * A component of the proficiency system.
 * This is a cluster of all models that honestly deserved their own file, but
 * that is mighty inconvenient for plugin consumers, so now its all in one.
 * ============================================================================
 */

//#region ProficiencyConditional
/**
 * A conditional revolving around skill proficiencies that when met, will
 * execute some kind of logic.
 */
function ProficiencyConditional()
{
  this.initialize(...arguments);
}

ProficiencyConditional.prototype = {};
ProficiencyConditional.prototype.constructor = ProficiencyConditional;

/**
 * Initializes this class with the given parameters.
 */
ProficiencyConditional.prototype.initialize = function(key, actorIds, requirements, skillRewards, jsRewards)
{
  /**
   * The key of this conditional.
   * @type {string}
   */
  this.key = key;

  /**
   * The actor's id of which this conditional belongs to.
   * @type {number[]}
   */
  this.actorIds = actorIds;

  /**
   * The requirements for this conditional.
   * @type {ProficiencyRequirement[]}
   */
  this.requirements = requirements;

  /**
   * The skills rewarded when all requirements are fulfilled.
   * @type {number[]}
   */
  this.skillRewards = skillRewards;

  /**
   * The javascript to execute when all requirements are fulfilled.
   * @type {string}
   */
  this.jsRewards = jsRewards;
};

/**
 * A single requirement of a skill prof conditional.
 * @constructor
 */
function ProficiencyRequirement()
{
  this.initialize(...arguments);
}

ProficiencyRequirement.prototype = {};
ProficiencyRequirement.prototype.constructor = ProficiencyRequirement;

/**
 * Initializes this class with the given parameters.
 */
ProficiencyRequirement.prototype.initialize = function(skillId, proficiency)
{
  /**
   * The skill id for this requirement.
   * @type {number}
   */
  this.skillId = skillId;

  /**
   * The level of prof required to consider this requirement fulfilled.
   * @type {number}
   */
  this.proficiency = proficiency;
};
//#endregion ProficiencyConditional

//#region SkillProficiency
/**
 * A class representing a single trait on a piece of equipment that can be potentially
 * transferred by means of JAFTING's refinement mode.
 */
function SkillProficiency()
{
  this.initialize(...arguments);
}

SkillProficiency.prototype = {};
SkillProficiency.prototype.constructor = SkillProficiency;

/**
 * Initializes this class with the given parameters.
 */
SkillProficiency.prototype.initialize = function(
  skillId,
  initialProficiency = 0
)
{
  /**
   * The skill id of the skill for this prof.
   * @type {number}
   */
  this.skillId = skillId;

  /**
   * The prof the owning battler bears with this skill.
   * @type {number}
   */
  this.proficiency = initialProficiency;
};

/**
 * Gets the underlying skill of this prof.
 * @returns {rm.types.Skill}
 */
SkillProficiency.prototype.skill = function()
{
  return $dataSkills[this.skillId];
};

/**
 * Adds a given amount of prof to the skill's current prof.
 * @param {number} value The amount of prof to add.
 */
SkillProficiency.prototype.improve = function(value)
{
  this.proficiency += value;
  if (this.proficiency < 0)
  {
    this.proficiency = 0;
  }
};
//#endregion SkillProficiency

//ENDOFFILE