//region Window_EquipStatus
/**
 * Gets the parameter bitmap width.
 * @returns {number} The parameter bitmap width.
 */
Window_EquipStatus.prototype.paramWidth = () => 64;

/**
 * Draws all parameters.
 */
Window_EquipStatus.prototype.drawAllParams = function()
{
  this.drawAllBParams(0, 192);
  this.drawAllXParams(360, 0);
  this.drawAllSParams(360, 380);
};

//region b-parameters
/**
 * Draws all b-parameters and their changed values.
 * @param {number} ox The origin x.
 * @param {number} oy The origin y.
 */
Window_EquipStatus.prototype.drawAllBParams = function(ox, oy)
{
  const params = [0, 1, 2, 3, 4, 5, 6, 7];
  params.forEach((_, paramId) =>
  {
    this.drawBParamName(paramId, ox, oy);
    this.drawCurrentBParam(paramId, ox, oy);
    this.drawNextBParam(paramId, ox, oy);
  });
};

/**
 * Draws the name of the parameter.
 * @param {number} paramId The parameter id.
 * @param {number} ox The origin x.
 * @param {number} oy The origin y.
 */
Window_EquipStatus.prototype.drawBParamName = function(paramId, ox, oy)
{
  const paramWidth = this.paramWidth();
  const row = paramId;
  const rowY = (this.lineHeight() * row) + oy;
  const paramIcon = IconManager.param(paramId);
  const paramName = TextManager.param(paramId);
  this.drawIcon(paramIcon, ox, rowY);
  this.resetTextColor();
  this.drawText(paramName, ox + 32, rowY, paramWidth * 2, "left");
};

/**
 * Draws the current value that the parameter is now.
 * @param {number} paramId The parameter id.
 * @param {number} ox The origin x.
 * @param {number} oy The origin y.
 */
Window_EquipStatus.prototype.drawCurrentBParam = function(paramId, ox, oy)
{
  const paramWidth = this.paramWidth();
  const row = paramId;
  const rowX = ox + 100 + paramWidth;
  const rowY = (this.lineHeight() * row) + oy;
  this.resetTextColor();
  const current = this._actor.param(paramId);
  this.drawText(current, rowX, rowY, paramWidth, "right");
};

/**
 * Draws the projected value that the parameter will be if equipped.
 * @param {number} paramId The parameter id.
 * @param {number} ox The origin x.
 * @param {number} oy The origin y.
 */
Window_EquipStatus.prototype.drawNextBParam = function(paramId, ox, oy)
{
  if (!this._tempActor) return;

  const paramWidth = this.paramWidth();
  const row = paramId;
  const rowX = ox + 160 + paramWidth;
  const rowY = (this.lineHeight() * row) + oy;

  // determine difference to draw arrow correctly.
  const newValue = this._tempActor.param(paramId);
  const diffValue = newValue - this._actor.param(paramId);
  this.drawModifierArrow(rowX + 16, rowY, diffValue);

  // draw the new value.
  this.changeTextColor(ColorManager.paramchangeTextColor(diffValue));
  this.drawText(newValue, rowX + 56, rowY, paramWidth, "left");
};
//endregion b-parameters

//region x-parameters
/**
 * Draws all x-params.
 * @param {number} ox The origin x.
 * @param {number} oy The origin y.
 */
Window_EquipStatus.prototype.drawAllXParams = function(ox, oy)
{
  const xparams = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  xparams.forEach((_, xparamId) =>
  {
    this.drawXParamName(xparamId, ox, oy);
    this.drawCurrentXParam(xparamId, ox, oy);
    this.drawNextXParam(xparamId, ox, oy);
  });
};

/**
 * Draws the name of the parameter.
 * @param {number} xparamId The parameter id.
 * @param {number} ox The origin x.
 * @param {number} oy The origin y.
 */
Window_EquipStatus.prototype.drawXParamName = function(xparamId, ox, oy)
{
  const paramWidth = this.paramWidth();
  const row = xparamId;
  const rowY = (this.lineHeight() * row) + oy;
  const paramIcon = IconManager.xparam(xparamId);
  const paramName = TextManager.xparam(xparamId);
  this.drawIcon(paramIcon, ox, rowY);
  this.resetTextColor();
  this.drawText(paramName, ox + 32, rowY, paramWidth * 2, "left");
};

/**
 * Draws the current value that the parameter is now.
 * @param {number} xparamId The parameter id.
 * @param {number} ox The origin x.
 * @param {number} oy The origin y.
 */
Window_EquipStatus.prototype.drawCurrentXParam = function(xparamId, ox, oy)
{
  const paramWidth = this.paramWidth();
  const row = xparamId;
  const rowX = ox + 100 + paramWidth;
  const rowY = (this.lineHeight() * row) + oy;
  this.resetTextColor();
  const current = (this._actor.xparam(xparamId) * 100).toFixed(0);
  this.drawText(current, rowX, rowY, paramWidth, "right");
};

/**
 * Draws the projected value that the parameter will be if equipped.
 * @param {number} xparamId The parameter id.
 * @param {number} ox The origin x.
 * @param {number} oy The origin y.
 */
Window_EquipStatus.prototype.drawNextXParam = function(xparamId, ox, oy)
{
  if (!this._tempActor) return;

  const paramWidth = this.paramWidth();
  const row = xparamId;
  const rowX = ox + 160 + paramWidth;
  const rowY = (this.lineHeight() * row) + oy;

  // determine difference to draw arrow correctly.
  const newValue = this._tempActor.xparam(xparamId);
  const displayedNewValue = (newValue * 100).toFixed(0);
  const diffValue = newValue - this._actor.xparam(xparamId);
  this.drawModifierArrow(rowX + 16, rowY, diffValue);

  // draw the new value.
  this.changeTextColor(ColorManager.paramchangeTextColor(diffValue));
  this.drawText(displayedNewValue, rowX + 56, rowY, paramWidth, "left");
};
//endregion x-parameters

//region s-parameters
/**
 * Draws all s-params.
 * @param {number} ox The origin x.
 * @param {number} oy The origin y.
 */
Window_EquipStatus.prototype.drawAllSParams = function(ox, oy)
{
  const sparams = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  sparams.forEach((_, xparamId) =>
  {
    this.drawSParamName(xparamId, ox, oy);
    this.drawCurrentSParam(xparamId, ox, oy);
    this.drawNextSParam(xparamId, ox, oy);
  });
};

/**
 * Draws the name of the parameter.
 * @param {number} sparamId The parameter id.
 * @param {number} ox The origin x.
 * @param {number} oy The origin y.
 */
Window_EquipStatus.prototype.drawSParamName = function(sparamId, ox, oy)
{
  const paramWidth = this.paramWidth();
  const row = sparamId;
  const rowY = (this.lineHeight() * row) + oy;
  const paramIcon = IconManager.sparam(sparamId);
  const paramName = TextManager.sparam(sparamId);
  this.drawIcon(paramIcon, ox, rowY);
  this.resetTextColor();
  this.drawText(paramName, ox + 32, rowY, paramWidth * 2, "left");
};

/**
 * Draws the current value that the parameter is now.
 * @param {number} sparamId The parameter id.
 * @param {number} ox The origin x.
 * @param {number} oy The origin y.
 */
Window_EquipStatus.prototype.drawCurrentSParam = function(sparamId, ox, oy)
{
  const paramWidth = this.paramWidth();
  const row = sparamId;
  const rowX = ox + 100 + paramWidth;
  const rowY = (this.lineHeight() * row) + oy;
  this.resetTextColor();
  const current = (this._actor.sparam(sparamId) * 100 - 100).toFixed(0);
  this.drawText(current, rowX, rowY, paramWidth, "right");
};

/**
 * Draws the projected value that the parameter will be if equipped.
 * @param {number} sparamId The parameter id.
 * @param {number} ox The origin x.
 * @param {number} oy The origin y.
 */
Window_EquipStatus.prototype.drawNextSParam = function(sparamId, ox, oy)
{
  if (!this._tempActor) return;

  const paramWidth = this.paramWidth();
  const row = sparamId;
  const rowX = ox + 160 + paramWidth;
  const rowY = (this.lineHeight() * row) + oy;

  // determine difference to draw arrow correctly.
  const newValue = this._tempActor.sparam(sparamId);
  const displayedNewValue = (newValue * 100 - 100).toFixed(0);
  const diffValue = newValue - this._actor.sparam(sparamId);
  this.drawModifierArrow(rowX + 16, rowY, diffValue);

  // draw the new value.
  this.changeTextColor(ColorManager.paramchangeTextColor(diffValue));
  this.drawText(displayedNewValue, rowX + 56, rowY, paramWidth, "left");
};
//endregion s-parameters

Window_EquipStatus.prototype.drawModifierArrow = function(x, y, diffValue)
{
  const rightArrowWidth = this.rightArrowWidth();
  this.changeTextColor(ColorManager.systemColor());
  const character = this.arrowCharacter(diffValue);
  this.drawText(character, x, y, rightArrowWidth, "center");
};

Window_EquipStatus.prototype.arrowCharacter = function(diffValue)
{
  if (diffValue > 0)
  {
    return "↗️";
  }
  else if (diffValue < 0)
  {
    return "↘️";
  }
  else
  {
    return "\u2192";
  }
};
//endregion Window_EquipStatus