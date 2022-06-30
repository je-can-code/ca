//#region RPG_Trait
/**
 * A class representing a single trait living on one of the many types
 * of database classes that leverage traits.
 */
class RPG_Trait
{
  /**
   * The code that designates what kind of trait this is.
   * @type {number}
   */
  code = 0;

  /**
   * The identifier that further defines the trait.
   * Data type and usage depends on the code.
   * @type {number}
   */
  dataId = 0;

  /**
   * The value of the trait, for traits that have numeric values.
   * Often is a floating point number to represent a percent multiplier.
   * @type {number}
   */
  value = 1.00;

  /**
   * Constructor.
   * @param {RPG_Trait} trait The trait to parse.
   */
  constructor(trait)
  {
    this.code = trait.code;
    this.dataId = trait.dataId;
    this.value = trait.value;
  }
}
//#endregion RPG_Trait