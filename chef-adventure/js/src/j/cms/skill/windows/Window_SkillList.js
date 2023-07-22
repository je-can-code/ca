//region Window_SkillList
/**
 * Extends `.initialize()` to include our skill detail window.
 */
J.CMS_K.Aliased.Window_SkillList.initialize = Window_SkillList.prototype.initialize;
Window_SkillList.prototype.initialize = function(rect)
{
  J.CMS_K.Aliased.Window_SkillList.initialize.call(this, rect);
  
  /**
   * The detail window for the skill.
   *  @type {Window_SkillDetail}
   */
  this._skillDetailWindow = null;
};

/**
 * Sets the skill detail window to the provided window.
 * @param {Window_SkillDetail} newWindow The new window.
 */
Window_SkillList.prototype.setSkillDetailWindow = function(newWindow)
{
  this._skillDetailWindow = newWindow;
  this.refreshSkillDetailWindow();
};

/**
 * Refreshes the skill details window.
 */
Window_SkillList.prototype.refreshSkillDetailWindow = function()
{
  if (!this._skillDetailWindow) return;

  let id = 0;
  const item = this.item();
  if (item)
  {
    id = item.id;
  }
  this._skillDetailWindow.setActor(this._actor);
  this._skillDetailWindow.setSkillId(id);
};

/**
 * Extends `.select()` to also update our skill detail window if need-be.
 */
J.CMS_K.Aliased.Window_SkillList.select = Window_SkillList.prototype.select;
Window_SkillList.prototype.select = function(index)
{
  J.CMS_K.Aliased.Window_SkillList.select.call(this, index);
  this.refreshSkillDetailWindow();
};

/**
 * OVERWRITE Forces a single column for skills in this window.
 * @returns {number}
 */
Window_SkillList.prototype.maxCols = function()
{
  return 1;
};

/**
 * OVERWRITE Does not draw costs of any kind.
 * @param {RPG_Skill} skill The skill to draw costs for.
 * @param {number} x The `x` coordinate.
 * @param {number} y The `y` coordinate.
 * @param {number} width The text width.
 */
Window_SkillList.prototype.drawSkillCost = function(skill, x, y, width)
{
};
//endregion Window_SkillList