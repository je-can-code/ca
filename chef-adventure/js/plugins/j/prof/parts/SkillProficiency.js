/*:
 * @target MZ
 * @plugindesc 
 * [v1.0.0 PROF] Data structure of a skill prof.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-Proficiency
 * @help
 * ============================================================================
 * A component of Proficiency.
 * ============================================================================
 */

/**
 * A class representing a single trait on a piece of equipment that can be potentially
 * transferred by means of JAFTING's refinement mode. 
 */
function SkillProficiency() { this.initialize(...arguments); }
SkillProficiency.prototype = {};
SkillProficiency.prototype.constructor = SkillProficiency;

/**
 * Initializes this class with the given parameters.
 */
SkillProficiency.prototype.initialize = function(
  skillId,
  initialProficiency = 0
) {
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
SkillProficiency.prototype.skill = function() {
  return $dataSkills[this.skillId];
};

/**
 * Adds a given amount of prof to the skill's current prof.
 * @param {number} value The amount of prof to add.
 */
SkillProficiency.prototype.improve = function(value) {
  this.proficiency += value;
  if (this.proficiency < 0) {
    this.proficiency = 0;
  }
};