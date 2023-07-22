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