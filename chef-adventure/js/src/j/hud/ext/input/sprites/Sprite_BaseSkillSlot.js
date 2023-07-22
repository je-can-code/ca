//region Sprite_BaseSkillSlot
/**
 * A sprite that represents a skill slot.
 * This is a base class for other things that need data from a skill slot.
 */
class Sprite_BaseSkillSlot extends Sprite_BaseText
{
  /**
   * Extend initialization of the sprite to assign a skill slot for tracking.
   * @param {JABS_SkillSlot} skillSlot The skill slot to track the name of.
   */
  initialize(skillSlot)
  {
    // perform original logic.
    super.initialize(String.empty);

    // sets the skill slot to trigger a refresh.
    this.setSkillSlot(skillSlot);
  }

  /**
   * Initialize all properties of this class.
   */
  initMembers()
  {
    // perform original logic.
    super.initMembers();

    /**
     * The skill slot associated with this sprite.
     * @type {JABS_SkillSlot|null}
     */
    this._j._skillSlot = null;
  }

  /**
   * Gets the skill slot associated with this sprite.
   * @returns {JABS_SkillSlot|null}
   */
  skillSlot()
  {
    return this._j._skillSlot;
  }

  /**
   * Gets whether or not there is a skill slot presently
   * assigned to this sprite.
   * @returns {boolean}
   */
  hasSkillSlot()
  {
    return !!this._j._skillSlot;
  }

  /**
   * Sets the skill slot for this sprite.
   * @param {JABS_SkillSlot} skillSlot The skill slot to assign.
   */
  setSkillSlot(skillSlot)
  {
    this._j._skillSlot = skillSlot;
    this.setText(this.skillName());
  }

  /**
   * Gets whether or not this slot is for an item instead of a skill.
   * @returns {boolean}
   */
  isItem()
  {
    return this.skillSlot().isItem();
  }

  /**
   * Get the cooldown data associated with the battler that owns
   * this skill slot.
   * @returns {JABS_Cooldown|null}
   */
  cooldownData()
  {
    // if we have no slot data, then we have no cooldown data.
    if (!this.hasSkillSlot()) return null;

    const jabsBattler = this.targetJabsBattler();

    if (!jabsBattler) return null;

    const inputType = this.skillSlot().key;

    // grab the cooldown data from the leader based on this slot.
    return jabsBattler.getCooldown(inputType);
  }

  /**
   * Gets the target `JABS_Battler` associated with this sprite.
   * @returns {JABS_Battler|null}
   */
  targetJabsBattler()
  {
    return $jabsEngine.getPlayer1();
  }

  /**
   * Gets the target `Game_Actor` or `Game_Enemy`
   * @returns {Game_Actor|Game_Enemy|null}
   */
  targetBattler()
  {
    const jabsBattler = this.targetJabsBattler();
    if (!jabsBattler) return null;

    return jabsBattler.getBattler();
  }

  /**
   * Gets the skill currently assigned to the skill slot.
   * @returns {RPG_Skill|null}
   */
  skill()
  {
    // if we do not have a skill slot, then the name is empty.
    if (!this.hasSkillSlot()) return null;

    // grab the cooldown data from the leader based on this slot.
    const cooldownData = this.cooldownData();

    // if we have no action key data for this slot, don't draw it.
    if (!cooldownData) return null;

    // grab the skill itself, either extended or not.
    return this.skillSlot().data(this.targetBattler(), this.skillId());
  }

  /**
   * Gets the skill (or item) id of the assigned ability of this skill slot.
   * Accommodates the possibility of
   * @returns {number}
   */
  skillId()
  {
    // the base id is of the skill slot's id.
    const skillId = this.skillSlot().id;

    // if it is an item, then the base skill id is the only id.
    if (this.skillSlot().isItem()) return skillId;

    // grab the cooldown data for this skill.
    const cooldownData = this.cooldownData();

    // if there is none, then return the default.
    if (!cooldownData) return skillId;

    // see if we should be grabbing the next combo skill, or this skill.
    const hasNextSkill = cooldownData.comboNextActionId > 0;
    const nextSkillId = hasNextSkill
      ? cooldownData.comboNextActionId  // return the next skill in the combo.
      : skillId;                        // return the current skill.

    return nextSkillId;
  }

  /**
   * Gets the skill name of the skill currently in the slot.
   * This accommodates the possibility of combos and skill extensions.
   * @returns {string} The name of the skill.
   */
  skillName()
  {
    // grab the skill itself, either extended or not.
    const skill = this.skill();

    // if no skill is in the slot, then the name is empty.
    if (!skill) return String.empty;

    // return the found name.
    return skill.name;
  }
}
//endregion Sprite_BaseSkillSlot