//#region JABS_GuardData
/**
 * A class responsible for managing the data revolving around guarding and parrying.
 */
class JABS_GuardData
{
  /**
   * @constructor
   * @param {number} skillId The skill this guard data is associated with.
   * @param {number} flatGuardReduction The flat amount of damage reduced when guarding, if any.
   * @param {number} percGuardReduction The percent amount of damage mitigated when guarding, if any.
   * @param {number} counterGuardId The skill id to counter with when guarding, if any.
   * @param {number} counterParryId The skill id to counter with when precise-parrying, if any.
   * @param {number} parryDuration The duration of which a precise-parry is available, if any.
   */
  constructor(
    skillId,
    flatGuardReduction,
    percGuardReduction,
    counterGuardId,
    counterParryId,
    parryDuration)
  {
    /**
     * The skill this guard data is associated with.
     * @type {number}
     */
    this.skillId = skillId;

    /**
     * The flat amount of damage reduced when guarding, if any.
     * @type {number}
     */
    this.flatGuardReduction = flatGuardReduction;

    /**
     * The percent amount of damage mitigated when guarding, if any.
     * @type {number}
     */
    this.percGuardReduction = percGuardReduction;

    /**
     * The skill id to counter with when guarding, if any.
     * @type {number}
     */
    this.counterGuardId = counterGuardId;

    /**
     * The skill id to counter with when precise-parrying, if any.
     * @type {number}
     */
    this.counterParryId = counterParryId;

    /**
     * The duration of which a precise-parry is available, if any.
     * @type {number}
     */
    this.parryDuration = parryDuration;
  }

  /**
   * Gets whether or not this guard data includes the ability to guard at all.
   * @returns {boolean}
   */
  canGuard()
  {
    return !!(this.flatGuardReduction || this.percGuardReduction);
  }

  /**
   * Gets whether or not this guard data includes the ability to precise-parry.
   * @returns {boolean}
   */
  canParry()
  {
    return this.parryDuration > 0;
  }

  /**
   * Gets whether or not this guard data enables countering of any kind.
   * @returns {boolean}
   */
  canCounter()
  {
    return !!(this.counterGuardId || this.counterParryId);
  }
}
//#endregion JABS_GuardData