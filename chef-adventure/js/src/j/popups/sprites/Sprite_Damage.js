//region Sprite_Damage
/**
 * Extends this `.initialize()` function to include our parameters for all damage sprites.
 */
J.POPUPS.Aliased.Sprite_Damage.set('initialize', Sprite_Damage.prototype.initialize);
Sprite_Damage.prototype.initialize = function()
{
  J.POPUPS.Aliased.Sprite_Damage.get('initialize').call(this);
  this.initMembers();
};

/**
 * Initializes all members of this class.
 */
Sprite_Damage.prototype.initMembers = function()
{
  /**
   * The master reference to the `_j` object containing all plugin properties.
   * @type {{}}
   */
  this._j ||= {};

  /**
   * This plugins' relevant data points.
   * @type {{}}
   */
  this._j._popups ||= {};

  /**
   * Whether or not this damage is flagged as critical.
   * @type {boolean}
   */
  this._j._popups._isCritical = false;

  /**
   * Whether or not this damage is flagged as healing.
   * @type {boolean}
   */
  this._j._popups._isHealing = false;

  /**
   * Whether or not this sprite is actually a damage popup, or a non-damage popup.
   * @type {boolean}
   */
  this._j._popups._isDamage = false;

  /**
   * The text color index for this sprite's text.
   * @type {number}
   */
  this._j._popups._damageColor = 0;

  /**
   * The x coordinate variance on this sprite.
   * @type {number}
   */
  this._j._popups._xVariance = 0;

  /**
   * The y coordinate variance on this sprite.
   * @type {number}
   */
  this._j._popups._yVariance = 0;
};

/**
 * Gets whether or not this sprite is a damage popup.
 * @returns {boolean} True if it is a damage popup, false if it is a non-damage popup.
 */
Sprite_Damage.prototype.isDamage = function()
{
  return this._j._popups._isDamage;
};

/**
 * Sets the damage flag to the specified value.
 * @param {boolean} isDamage True if it is a damage popup, false if it is a non-damage popup.
 */
Sprite_Damage.prototype.setDamageFlag = function(isDamage)
{
  this._j._popups._isDamage = isDamage;
};

/**
 * Gets whether or not this sprite is a healing damage popup.
 * @returns {boolean} True if it is a healing damage pop, false otherwise.
 */
Sprite_Damage.prototype.isHealing = function()
{
  return this._j._popups._isHealing;
};

/**
 * Sets the healing flag to the specified value.
 * @param {boolean} isHealing True if it is a healing popup, false otherwise.
 */
Sprite_Damage.prototype.setHealingFlag = function(isHealing)
{
  this._j._popups._isHealing = isHealing;
};

/**
 * Get the x coordinate variance.
 * @returns {number}
 */
Sprite_Damage.prototype.getXVariance = function()
{
  // check if this is a healing popup.
  return this.isHealing()
    // if it is, return the Y variance instead.
    ? (this._j._popups._yVariance - 48)
    // otherwise, return the x variance as expected.
    : this._j._popups._xVariance;
};

/**
 * Set the x variance for this damage sprite.
 * @param {number} xVariance The x coordinate variance.
 */
Sprite_Damage.prototype.setXVariance = function(xVariance)
{
  this._j._popups._xVariance = xVariance;
};

/**
 * Get the y coordinate variance.
 * @returns {number}
 */
Sprite_Damage.prototype.getYVariance = function()
{
  // check if this is a healing popup.
  return this.isHealing()
    // if it is, return the X variance instead.
    ? this._j._popups._xVariance
    // otherwise, return the y variance as expected.
    : this._j._popups._yVariance;
};

/**
 * Set the y variance for this damage sprite.
 * @param {number} yVariance The y coordinate variance.
 */
Sprite_Damage.prototype.setYVariance = function(yVariance)
{
  this._j._popups._yVariance = yVariance;
};

/**
 * Extends `createChildSprite()` to add the additional properties to the child sprite.
 */
J.POPUPS.Aliased.Sprite_Damage.set('createChildSprite', Sprite_Damage.prototype.createChildSprite);
Sprite_Damage.prototype.createChildSprite = function(width, height)
{
  const sprite = J.POPUPS.Aliased.Sprite_Damage.get('createChildSprite').call(this, width, height);
  this.setupMotionData(sprite);
  return sprite;
};

/**
 * Sets up some additional variables
 * @param sprite
 */
Sprite_Damage.prototype.setupMotionData = function(sprite)
{
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 1;
  sprite.y = -40;
  sprite.dy = 0;
  sprite.zt = 0;
  sprite.ry = sprite.y;
  sprite.yf = 0;
  sprite.yf2 = 0;
  sprite.yf3 = 0;
  sprite.ex = false;
  sprite.bounceMaxX = sprite.x + 60;
};

/**
 * Assigns the provided value to be the text of this popup.
 * @param {string} value The value to display in the popup.
 */
Sprite_Damage.prototype.createValue = function(value)
{
  // create a sprite of the designated size.
  const w = 400;
  const h = this.fontSize();
  const sprite = this.createChildSprite(w, h);

  // setup the fontsize for the font.
  let fontSize = 20;

  // check if this is a critical value.
  if (this._j._popups._isCritical)
  {
    // critical values look bigger and bolder.
    fontSize += 12;
    sprite.bitmap.fontBold = true;
  }

  // check if it was miss/evade/parry.
  else if (value.includes("Missed") || value.includes("Evaded") || value.includes("Parry"))
  {
    // miss/evade/parry are a bit smaller and italic for effect.
    fontSize -= 6;
    sprite.bitmap.fontItalic = true;
  }

  // assign the new size.
  sprite.bitmap.fontSize = fontSize;

  // draw the text.
  sprite.bitmap.drawText(value, 32, 0, w, h, "left");
  sprite.dy = 0;
};

/**
 * Adds an icon to the damage sprite.
 * @param {number} iconIndex The id/index of the icon on the iconset.
 */
Sprite_Damage.prototype.addIcon = function(iconIndex)
{
  // create the sprite for the icon.
  const sprite = this.createChildSprite(ImageManager.iconWidth, ImageManager.iconHeight);

  // generate the bitmap for it based on the iconset.
  const bitmap = ImageManager.loadSystem("IconSet");

  // crop the chosen icon to be the only one.
  const pw = ImageManager.iconWidth;
  const ph = ImageManager.iconHeight;
  const sx = (iconIndex % 16) * pw;
  const sy = Math.floor(iconIndex / 16) * ph;

  // blit the icon onto the sprite's bitmap directly.
  sprite.bitmap.blt(bitmap, sx, sy, pw, ph, 0, 0);

  // scale down the icon to be only 75% of the size.
  sprite.scale.x = 0.75;
  sprite.scale.y = 0.75;

  // adjust the location a bit.
  sprite.x -= 180;
  sprite.bounceMaxX -= 180;
  sprite.y += 15;
  sprite.dy = 0;
};

/**
 * Extends the duration of this sprite by the given amount in frames.
 * @param {number} extraDuration The amount to extend in frames.
 */
Sprite_Damage.prototype.addDuration = function(extraDuration)
{
  this._duration += extraDuration;
};

/**
 * OVERWRITE Replaces the damage updating with our own motion management.
 * @param {Sprite} sprite The sprite to udpate.
 */
Sprite_Damage.prototype.updateChild = function(sprite)
{
  // flashing always happens, sorry!
  sprite.setBlendColor(this._flashColor);

  // check if we're working with damage or non-damage sprites.
  if (this.isDamage())
  {
    // update damage sprites to be kinda bouncy.
    this.updateDamageSpriteMotion(sprite);
  }
  else
  {
    // update non-damage sprites to be mostly motionless aside from a small bounce.
    this.updateNonDamageSpriteMotion(sprite);
  }
};

/**
 * Updates the motion for the child of the non-damage sprite.
 * NOTE: This is actually just copy-paste of the default bounce/motion that RMMZ uses.
 * @param {Sprite} sprite The sprite to update.
 */
Sprite_Damage.prototype.updateNonDamageSpriteMotion = function(sprite)
{
  sprite.dy += 0.5;
  sprite.ry += sprite.dy;
  if (sprite.ry >= 0)
  {
    sprite.ry = 0;
    sprite.dy *= -0.6;
  }

  sprite.y = Math.round(sprite.ry);
};

/**
 * Updates the motion for the child of the damage sprite.
 * @param {Sprite} sprite The sprite to update.
 */
Sprite_Damage.prototype.updateDamageSpriteMotion = function(sprite)
{
  // check if the damage sprite is a healing sprite.
  if (this.isHealing())
  {
    this.flyawayDamageSpriteMotion(sprite);
  }
  else
  {
    this.defaultDamageSpriteMotion(sprite);
  }
};

/**
 * The default motion for RMMZ's damage sprite children.
 * The sprite bounces a little, and thats it.
 * @param {Sprite} sprite The sprite to move.
 */
Sprite_Damage.prototype.defaultDamageSpriteMotion = function(sprite)
{
  sprite.dy += 0.1;
  sprite.ry += sprite.dy;
  if (sprite.ry >= 0)
  {
    sprite.ry = 0;
    sprite.dy *= -0.8;
  }

  if (sprite.x < sprite.bounceMaxX)
  {
    sprite.x -= -0.7;
  }

  sprite.y = Math.round(sprite.ry);
};

/**
 * A custom motion for damage sprites.
 * Causes the damage sprite to fly vertically up and fade away.
 * @param {Sprite} sprite The sprite to move.
 */
Sprite_Damage.prototype.flyawayDamageSpriteMotion = function(sprite)
{
  sprite.yf3 -= 1;
  sprite.y = -sprite.yf2 + sprite.yf3;
  if (this._duration > 30)
  {
    sprite.opacity += 10;
  }
  else
  {
    sprite.opacity -= 10;
  }
};

/**
 * OVERWRITE Updates the duration to start fading later, and for longer.
 */
Sprite_Damage.prototype.updateOpacity = function()
{
  if (this._duration < 60)
  {
    this.opacity = (255 * this._duration) / 60;
  }
};

/**
 * Sets the color of the damage pop to be any of the text color indexes available.
 * @param {number} damageColor The new color index.
 */
Sprite_Damage.prototype.setDamageColor = function(damageColor)
{
  this._j._popups._damageColor = damageColor;
};

/**
 * OVERWRITE Replaces the color with a designated color on-creation.
 */
Sprite_Damage.prototype.damageColor = function()
{
  return ColorManager.textColor(this._j._popups._damageColor);
};

/**
 * Applies the flash effects and extends duration of this sprite if the damage is critical.
 */
J.POPUPS.Aliased.Sprite_Damage.set('setupCriticalEffect', Sprite_Damage.prototype.setupCriticalEffect);
Sprite_Damage.prototype.setupCriticalEffect = function()
{
  J.POPUPS.Aliased.Sprite_Damage.get('setupCriticalEffect').call(this);

  // confirm this is indeed a critical popup.
  this._j._popups._isCritical = true;

  // make the critical red flash stronger.
  this._flashColor[3] = 240;

  // extend the duration for all to see your critical glory!
  this.addDuration(60);
};
//endregion Sprite_Damage