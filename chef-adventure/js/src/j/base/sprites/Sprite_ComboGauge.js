//#region Sprite_ComboGauge
/**
 * The gauge sprite for handling combo timing.
 */
function Sprite_ComboGauge()
{
  this.initialize(...arguments);
}

Sprite_ComboGauge.prototype = Object.create(Sprite.prototype);
Sprite_ComboGauge.prototype.constructor = Sprite_ComboGauge;
Sprite_ComboGauge.prototype.initialize = function(cooldownData)
{
  this._j = {};
  this._gauge = {};
  Sprite.prototype.initialize.call(this);
  this.initMembers(cooldownData);
  this.createBitmap();
}

/**
 * Initializes all parameters for this sprite.
 * @param {object} cooldownData The cooldown data for this combo gauge.
 */
Sprite_ComboGauge.prototype.initMembers = function(cooldownData)
{
  this._j._maxUnassigned = true;
  this._j._cooldownData = cooldownData;
  this._j._cooldownMax = 0;
  this._gauge._valueCurrent = 0;
  this._gauge._valueMax = 0;
}

/**
 * Creates the bitmap for this sprite.
 */
Sprite_ComboGauge.prototype.createBitmap = function()
{
  this.bitmap = new Bitmap(this.bitmapWidth(), this.bitmapHeight());
}

/**
 * Updates this gauge.
 */
Sprite_ComboGauge.prototype.update = function()
{
  Sprite.prototype.update.call(this);
  // don't draw if there isn't a combo available.
  if (!this._j._cooldownData.comboNextActionId)
  {
    this.bitmap.clear();
    return;
  }

  // if this gauge is uninitiated or the user is comboing, reset the max.
  const shouldInitialize = this._j._cooldownData.comboReady && this._j._maxUnassigned;
  const chainComboing = this._gauge._valueMax < this._j._cooldownData.frames;
  if (shouldInitialize || chainComboing)
  {
    this._j._maxUnassigned = false;
    this._gauge._valueMax = JsonEx.makeDeepCopy(this._j._cooldownData.frames);
  }

  // cooldown is ready, combo is no longer available.
  if (this._j._cooldownData.ready)
  {
    this._j._maxUnassigned = true;
    this._gauge._valueMax = 0;
  }
  this.redraw();
}

/**
 * The width of the whole bitmap.
 */
Sprite_ComboGauge.prototype.bitmapWidth = function()
{
  return 32;
}

/**
 * The height of the whole bitmap.
 */
Sprite_ComboGauge.prototype.bitmapHeight = function()
{
  return 20;
}

/**
 * The height of this gauge.
 */
Sprite_ComboGauge.prototype.gaugeHeight = function()
{
  return 10;
}

/**
 * The current value for this gauge.
 */
Sprite_ComboGauge.prototype.currentValue = function()
{
  return this._j._cooldownData.frames;
}

/**
 * The max value for this gauge.
 * @returns {number}
 */
Sprite_ComboGauge.prototype.currentMaxValue = function()
{
  return this._gauge._valueMax;
}

/**
 * OVERWRITE
 * Rescopes `this` to point to the `Sprite_MapGauge` intead of the base
 * `Sprite_Gauge`. Otherwise, this is identical to the base `Sprite_Gauge.redraw()`.
 */
Sprite_ComboGauge.prototype.redraw = function()
{
  this.bitmap.clear();
  const currentValue = this.currentValue();
  if (!isNaN(currentValue))
  {
    this.drawGauge();
  }
}

Sprite_ComboGauge.prototype.gaugeColor1 = function()
{
  return "rgba(0, 0, 255, 1)";
};

Sprite_ComboGauge.prototype.gaugeColor2 = function()
{
  return "rgba(0, 255, 0, 1)";
};

Sprite_ComboGauge.prototype.gaugeBackColor = function()
{
  return "rgba(0, 0, 0, 0.5)";
};

Sprite_ComboGauge.prototype.isValid = function()
{
  if (this.currentMaxValue())
  {
    return true;
  }
  else
  {
    return false;
  }
}

Sprite_ComboGauge.prototype.drawGauge = function()
{
  const gaugeX = 0;
  const gaugeY = this.bitmapHeight() - this.gaugeHeight();
  const gaugewidth = this.bitmapWidth() - gaugeX;
  const gaugeHeight = this.gaugeHeight();
  this.drawGaugeRect(gaugeX, gaugeY, gaugewidth, gaugeHeight);
}

Sprite_ComboGauge.prototype.drawGaugeRect = function(x, y, width, height)
{
  const rate = this.gaugeRate();
  const fillW = Math.floor((width - 2) * rate);
  const fillH = height - 2;
  this.bitmap.fillRect(x, y, width, height, this.gaugeBackColor());
  this.bitmap.gradientFillRect(
    x + 1, y + 1,
    fillW, fillH,
    this.gaugeColor1(), this.gaugeColor2());
}

Sprite_ComboGauge.prototype.gaugeRate = function()
{
  if (this.isValid())
  {
    const value = this.currentValue();
    const maxValue = this.currentMaxValue();
    return maxValue > 0 ? value / maxValue : 0;
  }
  else
  {
    return 0;
  }
}
//#endregion