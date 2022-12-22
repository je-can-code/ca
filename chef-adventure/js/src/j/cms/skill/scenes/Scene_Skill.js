//region Scene_Skill
J.CMS_K.Aliased.Scene_Skill.initialize = Scene_Skill.prototype.initialize;
Scene_Skill.prototype.initialize = function()
{
  J.CMS_K.Aliased.Scene_Skill.initialize.call(this);
  this._j = this._j || {};
  this._j.moreVisible = false;
};

J.CMS_K.Aliased.Scene_Skill.create = Scene_Skill.prototype.create;
Scene_Skill.prototype.create = function()
{
  J.CMS_K.Aliased.Scene_Skill.create.call(this);
  this.createSkillDetailWindow();
};

Scene_Skill.prototype.skillTypeWindowRect = function()
{
  const ww = this.mainCommandWidth();
  const wh = this.calcWindowHeight(4, true);
  const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
  const wy = this.mainAreaTop();
  return new Rectangle(wx, wy, ww, wh);
};

Scene_Skill.prototype.createSkillDetailWindow = function()
{
  const rect = this.skillDetailRect();
  this._skillDetailWindow = new Window_SkillDetail(rect);
  this._itemWindow.setSkillDetailWindow(this._skillDetailWindow);
  this.addWindow(this._skillDetailWindow);
};

Scene_Skill.prototype.skillDetailRect = function()
{
  const ww = Graphics.boxWidth - this.mainCommandWidth();
  const wh = this.mainAreaHeight() - this._statusWindow.height
  const wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;
  const wy = this.mainAreaTop() + this._statusWindow.height;
  return new Rectangle(wx, wy, ww, wh);
};

Scene_Skill.prototype.mainCommandWidth = () => 400;

/**
 * OVERWRITE Removes the buttons because fuck the buttons.
 */
Scene_Skill.prototype.createButtons = function()
{
};

/**
 * OVERWRITE Replaces the button area height with 0 because fuck buttons.
 * @returns {number}
 */
Scene_Skill.prototype.buttonAreaHeight = () => 0;

Scene_Skill.prototype.itemWindowRect = function()
{
  const ww = this.mainCommandWidth();
  const wh = this.mainAreaHeight() - this._statusWindow.height;
  const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
  const wy = this._statusWindow.y + this._statusWindow.height;
  return new Rectangle(wx, wy, ww, wh);
};
//endregion Scene_Skill