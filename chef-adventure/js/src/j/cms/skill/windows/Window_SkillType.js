//region Window_SkillType
/**
 * OVERWRITE Fixes the maximum columns for this screen to be 1.
 * @returns {number}
 */
Window_SkillType.prototype.maxCols = function()
{
  return 1;
};

Window_SkillType.prototype.makeCommandList = function()
{
  if (this._actor)
  {
    const skillTypeIds = this._actor.skillTypes();
    skillTypeIds.forEach(skillTypeId =>
    {
      const name = $dataSystem.skillTypes[skillTypeId];
      const icon = IconManager.skillType(skillTypeId);
      this.addCommand(name, "skill", true, skillTypeId, icon);
    });
  }
};
//endregion Window_SkillType