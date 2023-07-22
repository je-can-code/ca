//region JABS_SkillSlotManager
/**
 * Gets all skill slots that have a skill assigned.
 * @returns {JABS_SkillSlot[]}
 */
JABS_SkillSlotManager.prototype.getEquippedAllySlots = function()
{
  // define the invalid skill slots that allies shouldn't use skills from.
  const invalidAllySlots = [JABS_Button.Tool, JABS_Button.Dodge];

  // return the filtered list of slots with skills that aren't invalid.
  return this.getEquippedSlots()
    // exclude the invalid skill slots.
    .filter(skillSlot => !invalidAllySlots.includes(skillSlot.key));
};
//endregion JABS_SkillSlotManager