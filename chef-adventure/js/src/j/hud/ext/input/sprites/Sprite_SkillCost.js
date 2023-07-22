//region Sprite_SkillCost
/**
 * A sprite that represents a skill slot's assigned skill's mp cost.
 */
class Sprite_SkillCost extends Sprite_BaseSkillSlot
{
  /**
   * The supported types of skill costs for this sprite.
   */
  static Types = {
    HP: "hp",
    MP: "mp",
    TP: "tp",
    Item: "item"
  };

  /**
   * Extend initialization of the sprite to assign a skill slot for tracking.
   * @param {JABS_SkillSlot} skillSlot The skill slot to track the name of.
   * @param {Sprite_SkillCost.Types} skillCostType The skillcost type for this sprite.
   */
  initialize(skillSlot, skillCostType)
  {
    // perform original logic.
    super.initialize(skillSlot);

    // assign the skill cost type to this sprite.
    this.setSkillCostType(skillCostType);

    // empty the cost.
    this.synchronizeCost();
  }

  /**
   * Initialize all properties of this class.
   */
  initMembers()
  {
    // perform original logic.
    super.initMembers();

    /**
     * The skill cost type.
     * @type {Sprite_SkillCost.Types}
     */
    this._j._skillCostType = Sprite_SkillCost.Types.MP;
  }

  /**
   * Gets the skill cost type of this sprite.
   * @returns {Sprite_SkillCost.Types}
   */
  skillCostType()
  {
    return this._j._skillCostType;
  }

  /**
   * Gets the skill cost of this sprite.
   * @returns {number}
   */
  skillCost()
  {
    return this.skillCostByType();
  }

  /**
   * Calculates the skill cost accordingly to the type of this sprite.
   * @returns {number}
   */
  skillCostByType()
  {
    const leader = $gameParty.leader();
    if (!leader) return 0;

    const ability = this.skillSlot().data(leader);
    if (!ability) return 0;

    switch (this.skillCostType())
    {
      case Sprite_SkillCost.Types.HP:
        // TODO: implement HP costs.
        return 0;
      case Sprite_SkillCost.Types.MP:
        return ability.mpCost * leader.mcr;
      case Sprite_SkillCost.Types.TP:
        return ability.tpCost * leader.tcr;
      case Sprite_SkillCost.Types.Item:
        return $gameParty.numItems(ability);
    }
  }

  /**
   * Sets the skill cost type for this sprite.
   * @param {Sprite_SkillCost.Types} skillCostType The skill type to assign to this sprite.
   */
  setSkillCostType(skillCostType)
  {
    if (this.skillCostType() !== skillCostType)
    {
      this._j._skillCostType = skillCostType;
      this.refresh();
    }
  }

  /**
   * OVERWRITE Gets the color of the text for this sprite based on the
   * type of skill cost for this sprite, instead of the assigned color.
   * @returns {string}
   */
  color()
  {
    return this.colorBySkillCostType();
  }

  /**
   * Gets the hex color based on the type of skill cost this is.
   * @returns {string}
   */
  colorBySkillCostType()
  {
    switch (this.skillCostType())
    {
      case Sprite_SkillCost.Types.HP:
        return "#ff0000";
      case Sprite_SkillCost.Types.MP:
        return "#0077ff";
      case Sprite_SkillCost.Types.TP:
        return "#33ff33";
      default:
        return "#ffffff";
    }
  }

  /**
   * OVERWRITE Gets the font size for this sprite's text.
   * Skill costs are hard-coded to be a fixed size, 12.
   * @returns {number}
   */
  fontSize()
  {
    return 12;
  }

  /**
   * Extends the `update()` to also synchronize the text to
   * match the skill slot it is
   */
  update()
  {
    // perform original logic.
    super.update();

    // check if we need to synchronize a new cost.
    if (this.needsSynchronization())
    {
      // sync the cost.
      this.synchronizeCost();
    }
  }

  /**
   * Checks whether or not this slot is in need of cost synchronization.
   * @returns {boolean}
   */
  needsSynchronization()
  {
    // if the slot is empty, then do not.
    const skillslot = this.skillSlot();
    if (!skillslot) return false;

    // if the slot doesn't require synchronization, then do not.
    if (!skillslot.needsVisualCostRefreshByType(this.skillCostType())) return false;

    // the slot needs synchronization!
    return true;
  }

  /**
   * Synchronizes the text with the underlying skill inside the
   * tracked skill slot. This allows dynamic updating when the slot
   * changes skill due to combos and such.
   */
  synchronizeCost()
  {
    // get the cost of the assigned skill as an integer.
    let skillCost = this.skillCost().toFixed(0);

    // check if the icon index for this icon is up to date.
    if (this.text() !== skillCost)
    {
      // check if the skill cost is actually 0.
      if (skillCost === "0")
      {
        // replace 0 with an empty string instead.
        skillCost = String.empty;
      }

      // if it isn't, update it.
      this.setText(skillCost);
    }

    // acknowledge the refresh.
    this.skillSlot().acknowledgeCostRefreshByType(this.skillCostType());
  }
}
//endregion Sprite_SkillCost