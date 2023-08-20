//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 CMS_M] A redesign of the main menu.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * This is a redesign of the main menu.
 * ============================================================================
 */
//endregion Introduction

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.1';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//endregion version check

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.CMS_M = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.CMS_M.Metadata = {};
J.CMS_M.Metadata.Name = `J-CMS-MAin`;
J.CMS_M.Metadata.Version = '1.0.0';

J.CMS_M.Aliased = {
  Scene_Menu: {},
  Window_EquipItem: {},
  Window_EquipSlot: {},
};

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

Window_MenuCommand.prototype.addMainCommands = function()
{
  const enabled = this.areMainCommandsEnabled();
  if (this.needsCommand("item")) 
  {
    this.addCommand(TextManager.item, "item", enabled, null, 2567);
  }

  if (this.needsCommand("skill")) 
  {
    this.addCommand(TextManager.skill, "skill", enabled, null, 2564);
  }

  if (this.needsCommand("equip")) 
  {
    this.addCommand(TextManager.equip, "equip", enabled, null, 2565);
  }

  if (this.needsCommand("status")) 
  {

    this.addCommand(TextManager.status, "status", enabled, null, 2560);
  }
};

Window_MenuCommand.prototype.addOptionsCommand = function() 
{
  if (this.needsCommand("options")) 
  {
    const enabled = this.isOptionsEnabled();
    this.addCommand(TextManager.options, "options", enabled, null, 2566);
  }
};

Window_MenuCommand.prototype.addGameEndCommand = function() 
{
  const enabled = this.isGameEndEnabled();
  this.addCommand(TextManager.gameEnd, "gameEnd", enabled, null, 2562);
};

Window_MenuStatus.prototype.numVisibleRows = function() 
{
  return 6;
};

Window_MenuStatus.prototype.drawActorSimpleStatus = function(actor, x, y)
{
  const lineHeight = this.lineHeight();
  const x2 = x + 180;
  this.drawActorName(actor, x, y);
  this.drawActorLevel(actor, x, y + lineHeight * 1);
  this.drawActorClass(actor, x2, y);
  this.placeBasicGauges(actor, x2, y + lineHeight);
};