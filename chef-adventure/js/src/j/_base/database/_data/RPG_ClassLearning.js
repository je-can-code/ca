//region RPG_ClassLearning
/**
 * A class representing a single learning of a skill for a class from the database.
 */
class RPG_ClassLearning
{
  //region properties
  /**
   * The level that the owning class will learn the given skill.
   * @type {number}
   */
  level = 0;

  /**
   * The skill to be learned when the owning class reaches the given level.
   * @type {number}
   */
  skillId = 0;

  /**
   * The note data for this given learning.
   * @type {string}
   */
  note = String.empty;
  //endregion properties

  /**
   * Constructor.
   * @param {rm.types.ClassLearning} learning The class learning to parse.
   */
  constructor(learning)
  {
    // map the database data to this object.
    this.level = learning.level;
    this.skillId = learning.skillId;
    this.note = learning.note;
  }
}
//endregion RPG_ClassLearning