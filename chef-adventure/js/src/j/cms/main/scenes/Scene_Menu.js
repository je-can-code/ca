Scene_Menu.prototype.commandWindowRect = function()
{
  const ww = this.mainCommandWidth();
  const wh = this.mainAreaHeight() - this.goldWindowRect().height;
  const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
  const wy = this.mainAreaTop();
  return new Rectangle(wx, wy, ww, wh);
};

Scene_Menu.prototype.statusWindowRect = function() 
{
  const ww = Graphics.boxWidth - this.mainCommandWidth();
  const wh = this.mainAreaHeight();
  const wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;
  const wy = this.mainAreaTop();
  return new Rectangle(wx, wy, ww, wh);
};

Scene_Menu.prototype.isRightInputMode = function()
{
  return false;
};

Scene_Menu.prototype.isBottomHelpMode = function()
{
  return false;
};

Scene_Menu.prototype.isBottomButtonMode = function()
{
  return true;
};