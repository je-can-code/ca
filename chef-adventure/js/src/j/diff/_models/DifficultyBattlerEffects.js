//region DifficultyBattlerEffects
/**
 * A collection of all applicable multipliers against core parameters
 * that are a part of a {@link DifficultyMetadata}.
 */
class DifficultyBattlerEffects
{
  /**
   * Creates a new {@link DifficultyBattlerEffects} with the given parameters.
   * @param {number[]} bparams The bparams.
   * @param {number[]} xparams The xparams.
   * @param {number[]} sparams The sparams.
   * @returns {DifficultyBattlerEffects}
   */
  static fromRaw(bparams, xparams, sparams)
  {
    // start with a fresh effects.
    const battlerEffects = new DifficultyBattlerEffects();

    // assign the parameters.
    battlerEffects.bparams = bparams;
    battlerEffects.xparams = xparams;
    battlerEffects.sparams = sparams;

    // return the predefined effects.
    return battlerEffects;
  }

  //region params
  /**
   * The base/b-parameter multipliers.
   * The array aligns percent multipliers against the matching index's parameters.
   * @type {[number, number, number, number, number, number, number, number]}
   */
  bparams = [100, 100, 100, 100, 100, 100, 100, 100];

  /**
   * The secondary/s-parameter multipliers.
   * The array aligns percent multipliers against the matching index's parameters.
   * @type {[number, number, number, number, number, number, number, number, number, number]}
   */
  sparams = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

  /**
   * The extraneous/x-parameter multipliers.
   * The array aligns percent multipliers against the matching index's parameters.
   * @type {[number, number, number, number, number, number, number, number, number, number]}
   */
  xparams = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
  //endregion params

  setBParam()
  {

  }
}
//endregion DifficultyBattlerEffects