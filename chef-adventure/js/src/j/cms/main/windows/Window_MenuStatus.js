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