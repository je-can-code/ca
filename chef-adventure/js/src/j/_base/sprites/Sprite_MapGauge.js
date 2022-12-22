//region Sprite_MapGauge
/**
 * The sprite for displaying a gauge over a character's sprite.
 */
function Sprite_MapGauge()
{
  this.initialize(...arguments);
}

Sprite_MapGauge.prototype = Object.create(Sprite_Gauge.prototype);
Sprite_MapGauge.prototype.constructor = Sprite_MapGauge;
Sprite_MapGauge.prototype.initialize = function(
  bitmapWidth = 96,
  bitmapHeight = 24,
  gaugeHeight = 6,
  label = String.empty,
  value = null,
  iconIndex = -1
)
{
  this._duration = 0;
  this._gauge = {};
  this._gauge._bitmapWidth = bitmapWidth;
  this._gauge._bitmapHeight = bitmapHeight;
  this._gauge._gaugeHeight = gaugeHeight;
  this._gauge._label = label;
  this._gauge._value = value;
  this._gauge._iconIndex = iconIndex;

  this._gauge._activated = true;

  Sprite_Gauge.prototype.initialize.call(this);
};

Sprite_MapGauge.prototype.activateGauge = function()
{
  this._gauge._activated = true;
};

Sprite_MapGauge.prototype.deactivateGauge = function()
{
  this._gauge._activated = false;
};

/**
 * Hook into the superclass update to do more things.
 */
Sprite_MapGauge.prototype.update = function()
{
  // don't update if its not activated.
  if (!this._gauge._activated) return;

  Sprite_Gauge.prototype.update.call(this);
  //this.manageGaugeVisibility();
};

/**
 * Handles the visibility of this hp bar based on interactivity.
 */
Sprite_MapGauge.prototype.manageGaugeVisibility = function()
{
  if (this._duration > 0)
  {
    this._duration--;
  }

  if (this._duration <= 60)
  {
    this.opacity -= 4.25;
  }
};

/**
 * Enforces the bitmap's width to be this value.
 */
Sprite_MapGauge.prototype.bitmapWidth = function()
{
  return this._gauge._bitmapWidth;
};

/**
 * Enforces the bitmap's height to be this value.
 */
Sprite_MapGauge.prototype.bitmapHeight = function()
{
  return this._gauge._bitmapHeight;
};

/**
 * Enforces the map gauge's height to be this value.
 */
Sprite_MapGauge.prototype.gaugeHeight = function()
{
  return this._gauge._gaugeHeight;
};

/**
 * Set this gauge's label.
 * @param {string} label The label to set this gauge to.
 */
Sprite_MapGauge.prototype.setLabel = function(label)
{
  this._gauge._label = label;
  this.redraw();
};

/**
 * Gets this gauge's label.
 */
Sprite_MapGauge.prototype.drawLabel = function()
{
  if (this._gauge._label)
  {
    const x = 32;
    const y = 0;
    this.bitmap.fontSize = 12;
    this.bitmap.drawText(
      this._gauge._label,
      x,
      y,
      this.bitmapWidth(),
      this.bitmapHeight(),
      "left");
  }
};

/**
 * Set this gauge's iconIndex.
 * @param {number} iconIndex The index/id of the icon to assign.
 */
Sprite_MapGauge.prototype.setIcon = function(iconIndex)
{
  this._gauge._iconIndex = iconIndex;
  this.redraw();
};

/**
 * Draws the icon associated with this gauge.
 */
Sprite_MapGauge.prototype.drawIcon = function()
{
  if (this._gauge._iconIndex > 0 && !this.children.length)
  {
    const sprite = this.createIconSprite();
    sprite.move(10, 20);
    this.addChild(sprite);
  }
};

Sprite_MapGauge.prototype.createIconSprite = function()
{
  const sprite = new Sprite_Icon(this._gauge._iconIndex);
  sprite.scale.x = 0.5;
  sprite.scale.y = 0.5;
  return sprite;
};

/**
 * Don't draw values for gauges on the map.
 * TODO: consider implementing values only when the enemy has been defeated.
 */
Sprite_MapGauge.prototype.drawValue = function()
{
  return this._gauge._value;
};

/**
 * OVERWRITE Rescopes `this` to point to the `Sprite_MapGauge` intead of the base
 * `Sprite_Gauge`. Otherwise, this is identical to the base `Sprite_Gauge.redraw()`.
 */
Sprite_MapGauge.prototype.redraw = function()
{
  this.bitmap.clear();
  const currentValue = this.currentValue();
  if (!isNaN(currentValue))
  {
    this.drawGauge();
    if (this._statusType !== "time")
    {
      this.drawLabel();
      this.drawIcon();
      if (this.isValid())
      {
        this.drawValue();
      }
    }
  }
};

/**
 * OVERWRITE Adjusts the value for drawing the EXP gauge instead.
 * This is only used by the J-HUD plugin.
 * @returns {number}
 */
Sprite_MapGauge.prototype.currentValue = function()
{
  if (this._battler)
  {
    switch (this._statusType)
    {
      case "hp":
        return this._battler.hp;
      case "mp":
        return this._battler.mp;
      case "tp":
        return this._battler.tp;
      case "time":
        return this._battler.currentExp() - this._battler.currentLevelExp();
    }
  }
  return NaN;
};

/**
 * OVERWRITE Adjusts the max value for drawing the EXP gauge instead.
 * This is only used by the J-HUD plugin.
 * @returns {number}
 */
Sprite_MapGauge.prototype.currentMaxValue = function()
{
  if (this._battler)
  {
    switch (this._statusType)
    {
      case "hp":
        return this._battler.mhp;
      case "mp":
        return this._battler.mmp;
      case "tp":
        return this._battler.maxTp();
      case "time":
        return this._battler.nextLevelExp() - this._battler.currentLevelExp();
    }
  }
  return NaN;
};
//endregion Sprite_MapGauge