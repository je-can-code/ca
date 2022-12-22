//region LevelScaling
/**
 * A helper class for calculating level-based scaling multipliers.
 */
class LevelScaling
{
  //region properties
  /**
   * The default scaling multiplier.
   * @type {number}
   * @private
   */
  static #defaultScalingMultiplier = 1.0;

  /**
   * The minimum amount the multiplier can be.
   * If after calculation it is lower, it will be raised to this amount.
   * @type {number}
   * @private
   */
  static #minimumMultiplier = J.LEVEL.Metadata.MinimumMultiplier;

  /**
   * The maximum amount the multiplier can be.
   * If after calculation it is higher, it will be lowered to this amount.
   * @type {number}
   */
  static #maximumMultiplier = J.LEVEL.Metadata.MaximumMultiplier;

  /**
   * The amount of growth per level of difference in the scaling multiplier.
   * @type {number}
   */
  static #growthMultiplier = J.LEVEL.Metadata.GrowthMultiplier;

  /**
   * The upper threshold of invariance, effective the dead zone for ignoring
   * level differences when they are not high enough.
   * @type {number}
   */
  static #upperInvariance = J.LEVEL.Metadata.InvariantUpperRange;

  /**
   * The lower threshold of invariance, effective the dead zone for ignoring
   * level differences when they are not low enough.
   * @type {number}
   */
  static #lowerInvariance = J.LEVEL.Metadata.InvariantLowerRange;
  //endregion properties

  /**
   * Constructor; however, this is a static class designed to have its methods used
   * directly instead of instantiating for later use.
   */
  constructor()
  {
    throw new Error(`"LevelScaling" is a static class; use its methods directly.`);
  }

  /**
   * Determines the multiplier based on the target's and user's levels.
   *
   * This gives a multiplier in relation to the user.
   * @param {number} targetLevel The level of the target.
   * @param {number} userLevel The level of the user, typically the actor.
   * @returns {number} A decimal representing the multiplier for the scaling.
   */
  static multiplier(targetLevel, userLevel)
  {
    // if the scaling functionality is disabled, then just return 1x.
    if (!$gameSystem.isLevelScalingEnabled()) return this.#defaultScalingMultiplier;

    // if one of the inputs is invalid or just zero, then default to 1x.
    if (!this.#isValid(targetLevel, userLevel)) return this.#defaultScalingMultiplier;

    // determine the difference in level.
    const levelDifference = this.determineLevelDifference(targetLevel, userLevel);

    // return the calculated multiplier based on the given level difference.
    return this.calculate(levelDifference);
  }

  /**
   * Determines whether or not the two battler's level inputs were valid.
   * Zero, while "valid", is handled the same as invalid: just use the default multiplier.
   * @param {number} a One of the battler's level.
   * @param {number} b The other battler's level.
   * @returns {boolean} True if both battler's levels are valid, false otherwise.
   */
  static #isValid(a, b)
  {
    // if either value is falsey, then it isn't valid.
    if (!a || !b) return false;

    // valid!
    return true;
  }

  /**
   * Determine the difference in level between two battlers.
   * @param {number} targetLevel The level of the target.
   * @param {number} userLevel The level of the user.
   * @returns {number} A decimal representing the multiplier for the scaling.
   */
  static determineLevelDifference(targetLevel, userLevel)
  {
    // determine the difference between the target and user in relation to the user.
    return targetLevel - userLevel;
  }

  /**
   * Calculates the multiplier based on the given level difference.
   * @param {number} levelDifference The difference in levels between target and user.
   * @returns {number}
   */
  static calculate(levelDifference)
  {
    // grab the baseline for the multiplier.
    const base = this.#defaultScalingMultiplier;

    // grab the growth rate per level of difference.
    const growth = this.#growthMultiplier;

    // check if the difference is within our invariance range.
    if (levelDifference <= this.#upperInvariance &&
      levelDifference >= this.#lowerInvariance) return base;

    // determine the level difference lesser the invariance range.
    const invariantDifference = levelDifference > 0
      ? levelDifference - this.#upperInvariance
      : levelDifference + this.#lowerInvariance;

    // calculate the multiplier.
    const result = base + (invariantDifference * growth);

    // clamp the multiplier within given thresholds, and return it.
    return result.clamp(this.#minimumMultiplier, this.#maximumMultiplier);
  }
}
//endregion LevelScaling