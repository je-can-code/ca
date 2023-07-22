//region Window_Status
/**
 * OVERWRITE Changes the `x:y` coordinates for where to draw the components of this block.
 * Also does NOT write nicknames, because why is that a thing?
 */
Window_Status.prototype.drawBlock1 = function()
{
  // grab the y coordinate.
  const y = this.block1Y();

  // draw the components.
  this.drawActorName(this._actor, 0, y, 168);
  this.drawActorClass(this._actor, 204, y, 168);

  // don't draw the nickname.
};

/**
 * OVERWRITE Changes the `x:y` coordinates for where to draw the components of this block.
 */
Window_Status.prototype.drawBlock2 = function()
{
  // grab the y coordinate.
  const y = this.block2Y();

  // draw the components.
  this.drawActorFace(this._actor, 12, y);
  this.drawBasicInfo(204, y);
  this.drawExpInfo(0, y + 250);
};
//endregion Window_Status