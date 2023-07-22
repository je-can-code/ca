//region Sprite_SkillSlotIcon
/**
 * A sprite that displays the icon represented by the assigned skill slot.
 */
class Sprite_SkillSlotIcon extends Sprite_Icon
{
  /**
   * Initializes this sprite with the designated icon.
   * @param {number} iconIndex The icon index of the icon for this sprite.
   * @param {JABS_SkillSlot} skillSlot The skill slot to monitor.
   */
  initialize(iconIndex = 0, skillSlot = null)
  {
    // perform original logic.
    super.initialize(iconIndex);

    // assign the skill slot to this sprite.
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
     * The skill slot that this sprite is watching.
     * @type {JABS_SkillSlot|null}
     */
    this._j._skillSlot = null;
  }

  /**
   * Sets the skill slot for this sprite's icon.
   * @param {JABS_SkillSlot} skillSlot The skill slot being assigned.
   */
  setSkillSlot(skillSlot)
  {
    this._j._skillSlot = skillSlot;
  }

  /**
   * Gets whether or not there is a skill slot currently being tracked.
   * @returns {boolean}
   */
  hasSkillSlot()
  {
    return !!this._j._skillSlot;
  }

  /**
   * Gets the skill slot currently assigned to this sprite.
   * @returns {JABS_SkillSlot|null}
   */
  skillSlot()
  {
    return this._j._skillSlot;
  }

  /**
   * Gets the icon associated with the tracked skill slot.
   * @returns {number}
   */
  skillSlotIcon()
  {
    // if there is no skill slot, return whatever is currently there.
    if (!this.hasSkillSlot()) return this._j._iconIndex;

    // if there is no leader, do not try to translate the slot into an icon.
    if (!$gameParty.leader()) return this._j._iconIndex;

    // if we are leveraging skill extensions, then grab the appropriate skill.
    const skill = this.skillSlot().data($gameParty.leader());

    // if nothing was in the slot, then don't draw it.
    if (!skill) return 0;

    // return the skill's icon index.
    return skill.iconIndex;
  }

  /**
   * The `JABS_Button` key that this skill slot belongs to.
   * @returns {string}
   */
  skillSlotKey()
  {
    return this._j._skillSlot.key;
  }

  /**
   * Extends the `update()` to monitor the icon index in case it changes.
   */
  update()
  {
    // perform original logic.
    super.update();

    // check if this slot needs icon synchronization.
    if (this.needsSynchronization())
    {
      // keep the icon index in-sync with the skill slot.
      this.synchronizeIconIndex();
    }
  }

  /**
   * Checks whether or not this slot is in need of name synchronization.
   * @returns {boolean}
   */
  needsSynchronization()
  {
    return (this.hasSkillSlot() && this.skillSlot().needsVisualIconRefresh());
  }

  /**
   * Synchronize the icon index for this skill slot.
   * Updates it if necessary.
   */
  synchronizeIconIndex()
  {
    // check if the icon index for this icon is up to date.
    if (this.iconIndex() !== this.skillSlotIcon())
    {
      // if it isn't, update it.
      this.setIconIndex(this.skillSlotIcon());
    }

    // acknowledge the refresh.
    this.skillSlot().acknowledgeIconRefresh();
  }

  /**
   * Upon becoming ready, execute this logic.
   * In this sprite's case, we render ourselves.
   * @param {number} iconIndex The icon index of this sprite.
   */
  onReady(iconIndex = 0)
  {
    // perform original logic.
    super.onReady(iconIndex);

    // only perform this logic if we have a skill slot.
    if (this.hasSkillSlot())
    {
      // set the icon index to be whatever the skill slot's icon is.
      this.setIconIndex(this.skillSlotIcon());
    }
  }
}
//endregion Sprite_SkillIcon