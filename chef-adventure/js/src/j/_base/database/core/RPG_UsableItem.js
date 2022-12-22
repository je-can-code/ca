//region RPG_UsableItem
/**
 * A class representing the base properties for any usable item or skill
 * from the database.
 */
class RPG_UsableItem extends RPG_BaseItem
{
  //region properties
  /**
   * The animation id to execute for this skill.
   * @type {number}
   */
  animationId = -1;

  /**
   * The damage data for this skill.
   * @type {RPG_SkillDamage}
   */
  damage = null;

  /**
   * The various effects of this skill.
   * @type {RPG_UsableEffect[]}
   */
  effects = [];

  /**
   * The hit type of this skill.
   * @type {number}
   */
  hitType = 0;

  /**
   * The occasion type when this skill can be used.
   * @type {number}
   */
  occasion = 0;

  /**
   * The number of times this skill repeats.
   * @type {number}
   */
  repeats = 1;

  /**
   * The scope of this skill.
   * @type {number}
   */
  scope = 0;

  /**
   * The speed bonus of this skill.
   * @type {number}
   */
  speed = 0;

  /**
   * The % chance of success for this skill.
   * @type {number}
   */
  successRate = 100;

  /**
   * The amount of TP gained from executing this skill.
   * @type {number}
   */
  tpGain = 0;
  //endregion properties

  /**
   * Constructor.
   * @param {rm.types.UsableItem} usableItem The usable item to parse.
   * @param {number} index The index of the skill in the database.
   */
  constructor(usableItem, index)
  {
    // supply the base class params.
    super(usableItem, index);

    // map the data.
    this.animationId = usableItem.animationId;
    this.damage = new RPG_SkillDamage(usableItem.damage);
    this.effects = usableItem.effects.map(effect => new RPG_UsableEffect(effect));
    this.hitType = usableItem.hitType;
    this.occasion = usableItem.occasion;
    this.repeats = usableItem.repeats;
    this.scope = usableItem.scope;
    this.speed = usableItem.speed;
    this.successRate = usableItem.successRate;
    this.tpGain = usableItem.tpGain;
  }
}
//endregion RPG_UsableItem