//region RPG_SkillDamage
/**
 * The damage data for the skill, such as the damage formula or associated element.
 */
class RPG_SkillDamage
{
  //region properties
  /**
   * Whether or not the damage can produce a critical hit.
   * @type {boolean}
   */
  critical = false;

  /**
   * The element id associated with this damage.
   * @type {number}
   */
  elementId = -1;

  /**
   * The formula to be evaluated in real time to determine damage.
   * @type {string}
   */
  formula = String.empty;

  /**
   * The damage type this is, such as HP damage or MP healing.
   * @type {1|2|3|4|5|6}
   */
  type = 0;

  /**
   * The % of variance this damage can have.
   * @type {number}
   */
  variance = 0;
  //endregion properties

  /**
   * Constructor.
   * Maps the skill's damage properties into this object.
   * @param {rm.types.Damage} damage The original damage object to map.
   */
  constructor(damage)
  {
    if (damage)
    {
      this.critical = damage.critical;
      this.elementId = damage.elementId;
      this.formula = damage.formula;
      this.type = damage.type;
      this.variance = damage.variance;
    }
    else
    {
      // if we don't have damage, use the defaults.
    }
  }
}
//endregion RPG_SkillDamage