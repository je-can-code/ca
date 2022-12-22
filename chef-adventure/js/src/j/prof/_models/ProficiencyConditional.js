//region ProficiencyConditional
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
//endregion ProficiencyConditional