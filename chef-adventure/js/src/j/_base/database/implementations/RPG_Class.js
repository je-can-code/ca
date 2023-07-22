//region RPG_Class
/**
 * A class representing a RPG-relevant class from the database.
 */
class RPG_Class extends RPG_Base
{
  //region properties
  /**
   * The four data points that comprise the EXP curve for this class.
   * @type {[number, number, number, number]}
   */
  expParams = [0, 0, 0, 0];

  /**
   * A collection of skill learning data points for this class.
   * @type {RPG_ClassLearning[]}
   */
  learnings = [];

  /**
   * A multi-dimensional array of the core parameters that all battlers have:
   * MHP, MMP, ATK, DEF, MAT, MDF, SPD, LUK,
   * in that order, but for all 100 of the base levels.
   * @type {[number, number, number, number, number, number, number, number]}
   */
  params = [[1], [0], [0], [0], [0], [0], [0], [0]];

  /**
   * A collection of traits this class has.
   * @type {RPG_Trait[]}
   */
  traits = [];
  //endregion properties

  /**
   * Constructor.
   * @param {rm.types.RPGClass} classData The class data to parse.
   * @param {number} index The index of the entry in the database.
   */
  constructor(classData, index)
  {
    // perform original logic.
    super(classData, index);

    // map the class data to this object.
    this.expParams = classData.expParams;
    this.learnings = classData.learnings
    .map(learning => new RPG_ClassLearning(learning));
    this.params = classData.params;
    this.traits = classData.traits
    .map(trait => new RPG_Trait(trait));
  }
}
//endregion RPG_Class