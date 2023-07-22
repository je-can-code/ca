//region Sprite_SkillName
/**
 * A sprite that represents a skill slot's assigned skill's name.
 */
class Sprite_SkillName extends Sprite_BaseSkillSlot
{
  /**
   * Extends the `update()` to also synchronize the text to
   * match the skill slot it is
   */
  update()
  {
    // perform original logic.
    super.update();

    // check if this slot needs name synchronization.
    if (this.needsSynchronization())
    {
      // sync the text.
      this.synchronizeText();
    }
  }

  /**
   * Checks whether or not this slot is in need of name synchronization.
   * @returns {boolean}
   */
  needsSynchronization()
  {
    return (this.hasSkillSlot() && this.skillSlot().needsVisualNameRefresh());
  }

  /**
   * Synchronizes the text with the underlying skill inside the
   * tracked skill slot. This allows dynamic updating when the slot
   * changes skill due to combos and such.
   */
  synchronizeText()
  {
    // check if the icon index for this icon is up to date.
    if (this.text() !== this.skillName())
    {
      // if it isn't, update it.
      this.setText(this.skillName());
    }

    // acknowledge the refresh.
    this.skillSlot().acknowledgeNameRefresh();
  }
}
//endregion Sprite_SkillName