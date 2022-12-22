//region RPG_UsableEffect
/**
 * A class representing a single effect on an item or skill from the database.
 */
class RPG_UsableEffect
{
  //region properties
  /**
   * The type of effect this is.
   * @type {number}
   */
  code = 0;

  /**
   * The dataId further defines what type of effect this is.
   * @type {number}
   */
  dataId = 0;

  /**
   * The first value parameter of the effect.
   * @type {number}
   */
  value1 = 0;

  /**
   * The second value parameter of the effect.
   * @type {number}
   */
  value2 = 0;
  //endregion properties

  /**
   * Constructor.
   * @param {rm.types.Effect} effect The effect to parse.
   */
  constructor(effect)
  {
    // map the data.
    this.code = effect.code;
    this.dataId = effect.dataId;
    this.value1 = effect.value1;
    this.value2 = effect.value2;
  }
}
//endregion RPG_UsableEffect