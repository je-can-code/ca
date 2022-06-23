//#region JABS_OnChanceEffect
/**
 * A class defining the structure of an on-death skill, either for ally or enemy.
 */
class JABS_OnChanceEffect
{
  constructor(skillId, chance, key)
  {
    this.skillId = skillId;
    this.chance = chance;
    this.key = key;
  }

  /**
   * Gets the underlying skill.
   * @returns {RPG_Skill}
   */
  baseSkill()
  {
    return $dataSkills[this.skillId];
  }

  /**
   * Gets whether or not the skill this chance is associated with should cast from the
   * target instead of the user.
   * @returns {boolean}
   */
  appearOnTarget()
  {
    const skill = this.baseSkill();
    return !!skill.meta["onDefeatedTarget"];
  }

  /**
   * Dances with RNG to determine if this onChanceEffect was successful or not.
   * @param {number=} rollForPositive The number of times to try for success; defaults to 1.
   * @param {number=} rollForNegative The number of times to try and undo success; defaults to 0.
   * @returns {boolean} True if this effect should proc, false otherwise.
   */
  shouldTrigger(rollForPositive = 1, rollForNegative = 0)
  {
    // default fail.
    let success = false;

    // keep rolling for positive while we have positive rolls and aren't already successful.
    while (rollForPositive && !success)
    {
      // roll for effect!
      const chance = Math.randomInt(100) + 1;

      // check if the roll meets the chance criteria.
      if (chance <= this.chance)
      {
        // flag for success!
        success = true;
      }

      // decrement the positive roll counter.
      rollForPositive--;
    }

    // if successful and we have negative rerolls, lets get fight RNG for success!
    if (success && rollForNegative)
    {
      // keep rolling for negative while we have negative rerolls and are still successful.
      while (rollForNegative && success)
      {
        // check if the roll meets the chance criteria.
        if (chance <= this.chance)
        {
          // we keep our flag! (this time...)
          success = true;
        }
        // we didn't meet the chance criteria this time.
        else
        {
          // undo our success :(
          success = false;
        }

        // decrement the negative reroll counter.
        rollForNegative--;
      }
    }

    // return our successes (or failure).
    return success;
  }
}
//#endregion JABS_OnChanceEffect