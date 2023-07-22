//region Sprite_CooldownTimer
/**
 * A sprite that displays a timer representing the cooldown time for a JABS action.
 */
function Sprite_CooldownTimer()
{
  this.initialize(...arguments);
}

Sprite_CooldownTimer.prototype = Object.create(Sprite.prototype);
Sprite_CooldownTimer.prototype.constructor = Sprite_CooldownTimer;
Sprite_CooldownTimer.prototype.initialize = function(skillType, cooldownData, isItem = false)
{
  Sprite.prototype.initialize.call(this);
  this.initMembers(skillType, cooldownData, isItem);
  this.loadBitmap();
}

/**
 * Initializes the properties associated with this sprite.
 * @param {string} skillType The slot that this skill maps to.
 * @param {object} cooldownData The cooldown data associated with this cooldown sprite.
 * @param {boolean} isItem Whether or not this cooldown timer is for an item.
 */
Sprite_CooldownTimer.prototype.initMembers = function(skillType, cooldownData, isItem)
{
  this._j = {};
  this._j._skillType = skillType;
  this._j._cooldownData = cooldownData;
  this._j._isItem = isItem;
}

/**
 * Loads the bitmap into the sprite.
 */
Sprite_CooldownTimer.prototype.loadBitmap = function()
{
  this.bitmap = new Bitmap(this.bitmapWidth(), this.bitmapHeight());
  this.bitmap.fontFace = this.fontFace();
  this.bitmap.fontSize = this.fontSize();
  this.bitmap.drawText(
    this._j._text,
    0, 0,
    this.bitmapWidth(), this.bitmapHeight(),
    "center");
}

Sprite_CooldownTimer.prototype.update = function()
{
  Sprite.prototype.update.call(this);
  this.updateCooldownText();
}

Sprite_CooldownTimer.prototype.updateCooldownText = function()
{
  this.bitmap.clear();
  let baseCooldown = (this._j._cooldownData.frames / 60).toFixed(1);
  if (typeof baseCooldown === 'undefined')
  {
    baseCooldown = 0;
  }

  const cooldownBaseText = baseCooldown > 0
    ? baseCooldown
    : String.empty;
  const cooldownComboText = (cooldownBaseText > 0 && this._j._cooldownData.comboNextActionId !== 0)
    ? "COMBO!"
    : "❌";

  this.bitmap.drawText(
    cooldownBaseText,
    0, 0,
    this.bitmapWidth(), this.bitmapHeight(),
    "center");
  this.bitmap.fontSize = this.fontSize() - 8;
  this.bitmap.fontItalic = true;
  this.bitmap.drawText(
    cooldownComboText,
    0, this.fontSize(),
    this.bitmapWidth(), this.bitmapHeight(),
    "center");
  this.bitmap.fontSize = this.fontSize();
  this.bitmap.fontItalic = false;

}

/**
 * Determines the width of the bitmap accordingly to the length of the string.
 */
Sprite_CooldownTimer.prototype.bitmapWidth = function()
{
  return 40;
}

/**
 * Determines the width of the bitmap accordingly to the length of the string.
 */
Sprite_CooldownTimer.prototype.bitmapHeight = function()
{
  return this.fontSize() * 3;
}

/**
 * Determines the font size for text in this sprite.
 */
Sprite_CooldownTimer.prototype.fontSize = function()
{
  return $gameSystem.mainFontSize() - 10;
}

/**
 * determines the font face for text in this sprite.
 */
Sprite_CooldownTimer.prototype.fontFace = function()
{
  return $gameSystem.numberFontFace();
}
//endregion