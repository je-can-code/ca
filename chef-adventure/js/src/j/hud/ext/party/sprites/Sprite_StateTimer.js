//region Sprite_StateTimer
/**
 * A sprite that displays some the remaining duration for a state in seconds with one decimal point.
 */
function Sprite_StateTimer()
{
  this.initialize(...arguments);
}

Sprite_StateTimer.prototype = Object.create(Sprite.prototype);
Sprite_StateTimer.prototype.constructor = Sprite_StateTimer;
Sprite_StateTimer.prototype.initialize = function(stateData)
{
  Sprite.prototype.initialize.call(this);
  this.initMembers(stateData);
  this.loadBitmap();
}

/**
 * Initializes the properties associated with this sprite.
 * @param {object} stateData The state data associated with this sprite.
 */
Sprite_StateTimer.prototype.initMembers = function(stateData)
{
  this._j = {};
  this._j._stateData = stateData;
};

/**
 * Loads the bitmap into the sprite.
 */
Sprite_StateTimer.prototype.loadBitmap = function()
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

Sprite_StateTimer.prototype.update = function()
{
  Sprite.prototype.update.call(this);
  this.updateCooldownText();
};

Sprite_StateTimer.prototype.updateCooldownText = function()
{
  this.bitmap.clear();
  const durationRemaining = (this._j._stateData.duration / 60).toFixed(1);

  this.bitmap.drawText(
    durationRemaining.toString(),
    0, 0,
    this.bitmapWidth(), this.bitmapHeight(),
    "center");
};

/**
 * Determines the width of the bitmap accordingly to the length of the string.
 */
Sprite_StateTimer.prototype.bitmapWidth = function()
{
  return 40;
};

/**
 * Determines the width of the bitmap accordingly to the length of the string.
 */
Sprite_StateTimer.prototype.bitmapHeight = function()
{
  return this.fontSize() * 3;
};

/**
 * Determines the font size for text in this sprite.
 */
Sprite_StateTimer.prototype.fontSize = function()
{
  return $gameSystem.mainFontSize() - 10;
};

/**
 * determines the font face for text in this sprite.
 */
Sprite_StateTimer.prototype.fontFace = function()
{
  return $gameSystem.numberFontFace();
};
//endregion Sprite_StateTimer