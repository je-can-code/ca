/*:
 * @target MZ
 * @plugindesc 
 * [v2.0.0 BASE] JABS skill chance part.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @help
 * ============================================================================
 * A component of JABS that lives with the base plugin.
 * This is a generic class that represents the chance that a skill will
 * execute. This is used for on-death skills for both ally and enemy alike,
 * among other things.
 * ============================================================================
 */

/**
 * A class defining the structure of an on-death skill, either for ally or enemy.
 */
class JABS_SkillChance
{
  constructor(skillId, chance, key)
  {
    this.skillId = skillId;
    this.chance = chance;
    this.key = key;
  }

  /**
   * Gets the underlying skill.
   * @returns {rm.types.Skill}
   */
  baseSkill()
  {
    return $dataSkills[this.skillId];
  };

  /**
   * Gets whether or not the skill this chance is associated with should cast from the
   * target instead of the user.
   * @returns {boolean}
   */
  appearOnTarget()
  {
    const skill = this.baseSkill();
    return !!skill.meta["onDefeatedTarget"];
  };

  /**
   * Rolls for whether or not this skill should proc.
   * @returns {boolean}
   */
  shouldTrigger()
  {
    const chance = Math.randomInt(100) + 1;
    return chance <= this.chance;
  };
};
//ENDFILE