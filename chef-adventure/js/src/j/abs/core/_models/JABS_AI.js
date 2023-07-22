//region JABS_AI
/**
 * A base class containing the commonalities between all AI governed by {@link JABS_AiManager}.
 */
class JABS_AI
{
  /**
   * Decides an action based on this battler's AI, the target, and the given available skills.
   * @param {JABS_Battler} user The battler of the AI deciding a skill.
   * @param {JABS_Battler} target The target battler to decide an action against.
   * @param {number[]} availableSkills A collection of all skill ids to potentially pick from.
   * @returns {number|null} The skill id chosen to use, or null if none were valid choices for this AI.
   */
  // eslint-disable-next-line no-unused-vars
  decideAction(user, target, availableSkills)
  {
    return 0;
  }

  /**
   * Determines whether or not the attacker should continue with their combo.
   * @param {JABS_Battler} user The user potentially pursuing a combo skill.
   * @returns {boolean} True if the user should follow with combo, false otherwise.
   */
  shouldFollowWithCombo(user)
  {
    // if the AI-controlled battler has no combos ready, they don't combo.
    if (!user.hasComboReady()) return false;

    // grab the combo skill id from the last used skill slot.
    const comboSkillId = user.getComboNextActionId(user.getLastUsedSlot());

    // if the battler doesn't meet the criteria to perform the skill, then don't combo.
    if (!user.canExecuteSkill(comboSkillId)) return false;

    // determine this AI's chance to perform a combo, conditions allowing.
    const comboChance = this.determineComboChance();

    // roll the dice and determine your fate!!
    const comboRng = RPGManager.chanceIn100(comboChance);

    // return combo rngesus's determination in life.
    return comboRng;
  }

  /**
   * Calculates the chance for combos based on this AI's traits.
   * @returns {number} The integer percent chance to perform the combo skill if available.
   */
  determineComboChance()
  {
    // determine the base combo chance.
    const baseChance = this.baseComboChance();

    // determine the modifier based on this ai for comboing.
    const modifierChance = this.aiComboChanceModifier();

    // sum the two chance rates together.
    const comboChance = (baseChance + modifierChance);

    // return whether or not we will combo.
    return comboChance;
  }

  /**
   * Gets the base percent chance for whether or not to perform a combo skill.
   * @returns {number}
   */
  baseComboChance()
  {
    return 50;
  }

  /**
   * Gets the combo skill id of the next
   * @param {JABS_Battler} user The user following with a combo.
   * @returns {number}
   */
  followWithCombo(user)
  {
    // grab the combo skill id from the last used skill slot.
    const comboSkillId = user.getComboNextActionId(user.getLastUsedSlot());

    // return what we found.
    return comboSkillId;
  }

  /**
   * Gets the modifier percent chance, based on the AI of this battler,
   * as to whether or not to perform a combo skill.
   * @returns {number}
   */
  aiComboChanceModifier()
  {
    return 0;
  }

  /**
   * Determines whether or not the parameter provided is a valid skill id.
   * @param {number|number[]|null} skillId The skill id or ids to validate.
   * @returns {boolean} True if it is a single skill id, false otherwise.
   */
  isSkillIdValid(skillId)
  {
    // if the skill id is something falsy like 0/null/undefined, not valid.
    if (!skillId) return false;

    // if the skill id somehow managed to become many skill ids, not valid.
    if (Array.isArray(skillId)) return false;

    // skill id is valid!
    return true;
  }

  /**
   * Filters out skills that cannot be executed at this time by the battler.
   * This prevents the user from continuously picking a skill they cannot execute.
   * @param {JABS_Battler} user The battler to decide the skill for.
   * @param {number[]} skillsToUse The available skills to use.
   * @returns {number[]}
   */
  filterUncastableSkills(user, skillsToUse)
  {
    // check to make sure we have skills to filter.
    if (!skillsToUse || !skillsToUse.length) return [];

    // filter the skills by whether or not they can be executed.
    return skillsToUse.filter(user.canExecuteSkill, user);
  }

  /**
   * Determines which skill would deal the greatest amount of damage to the target.
   * @param {number[]} usableSkills The skill ids available to choose from.
   * @param {JABS_Battler} user The battler choosing the skill.
   * @param {JABS_Battler} target The targeted battler to use the skill against.
   * @returns {number}
   */
  determineStrongestSkill(usableSkills, user, target)
  {
    // initialize tracking for data points that determine skill strength.
    let strongestSkillId = 0;
    let highestDamage = 0;
    let biggestCritDamage = 0;

    // an iterator function for calculating projected damage for each skill to find the strongest.
    const forEacher = skillId =>
    {
      const skill = user.getSkill(skillId);

      // setup a game action for testing damage.
      const testAction = new Game_Action(user.getBattler(), false);
      testAction.setItemObject(skill);

      // test the base and crit damage values for this skill against the target.
      const baseDamageValue = testAction.makeDamageValue(target.getBattler(), false);
      const critDamageValue = testAction.makeDamageValue(target.getBattler(), true);

      // we live risky- if the crit damage is bigger due to crit damage modifiers, then try that.
      if (critDamageValue > biggestCritDamage)
      {
        strongestSkillId = skillId;
        highestDamage = baseDamageValue;
        biggestCritDamage = critDamageValue;
        return;
      }

      // if the crit isn't modified, then just go based on best base damage.
      if (baseDamageValue > highestDamage)
      {
        strongestSkillId = skillId;
        highestDamage = baseDamageValue;
        biggestCritDamage = critDamageValue;
      }
    };

    // iterate over each skill id to see which is the strongest.
    usableSkills.forEach(forEacher, this);

    // return the strongest found skill id.
    return strongestSkillId;
  };
}
//endregion JABS_AI