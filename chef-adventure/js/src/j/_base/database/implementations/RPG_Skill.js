//region RPG_Skill
/**
 * An class representing a single skill from the database.
 */
class RPG_Skill extends RPG_UsableItem
{
  //region properties
  /**
   * The first line of the message for this skill.
   * @type {string}
   */
  message1 = String.empty;

  /**
   * The second line of the message for this skill.
   * @type {string}
   */
  message2 = String.empty;

  /**
   * The type of message for this skill.
   * @type {number}
   */
  messageType = 0;

  /**
   * The amount of MP required to execute this skill.
   * @type {number}
   */
  mpCost = 0;

  /**
   * The first of two required weapon types to be equipped to execute this skill.
   * @type {number}
   */
  requiredWtypeId1 = 0;

  /**
   * The second of two required weapon types to be equipped to execute this skill.
   * @type {number}
   */
  requiredWtypeId2 = 0;

  /**
   * The skill type that this skill belongs to.
   * @type {number}
   */
  stypeId = 0;

  /**
   * The amount of TP required to execute this skill.
   * @type {number}
   */
  tpCost = 0;
  //endregion properties

  /**
   * Constructor.
   * Maps the skill's properties into this object.
   * @param {RPG_Skill} skill The underlying skill object.
   * @param {number} index The index of the skill in the database.
   */
  constructor(skill, index)
  {
    // supply the base class params.
    super(skill, index);

    // map the data.
    this.initMembers(skill);
  }

  /**
   * Maps all the data from the JSON to this object.
   * @param {RPG_Skill} skill The underlying skill object.
   */
  initMembers(skill)
  {
    // map the data.
    this.message1 = skill.message1;
    this.message2 = skill.message2;
    this.messageType = skill.messageType;
    this.mpCost = skill.mpCost;
    this.requiredWtypeId1 = skill.requiredWtypeId1;
    this.requiredWtypeId2 = skill.requiredWtypeId2;
    this.stypeId = skill.stypeId;
    this.tpCost = skill.tpCost;
  }
}
//endregion RPG_Skill