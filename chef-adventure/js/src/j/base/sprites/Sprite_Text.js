//#region Sprite_Text
/**
 * A sprite that displays some static text.
 */
function Sprite_Text()
{
  this.initialize(...arguments);
}

Sprite_Text.prototype = Object.create(Sprite.prototype);
Sprite_Text.prototype.constructor = Sprite_Text;
Sprite_Text.prototype.initialize = function(
  text, color = null, fontSizeMod = 0, alignment = "center", widthMod = 0, heightMod = 0
)
{
  Sprite.prototype.initialize.call(this);
  this.initMembers(text, color, fontSizeMod, alignment, widthMod, heightMod);
  this.loadBitmap();
};

/**
 * Initializes the properties associated with this sprite.
 * @param {string} text The static text to display for this sprite.
 * @param {any} color The color of the text.
 * @param {number} fontSizeMod The font size modifier for this instance of text.
 * @param {string} alignment The alignment of this sprite's text.
 * @param {number} widthMod The bitmap width modifier for this sprite.
 * @param {number} heightMod The bitmap height modifier for this sprite.
 */
Sprite_Text.prototype.initMembers = function(
  text, color, fontSizeMod, alignment, widthMod, heightMod
)
{
  this._j = {
    _text: text,
    _color: color,
    _fontSizeMod: fontSizeMod,
    _alignment: alignment,
    _widthMod: widthMod,
    _heightMod: heightMod,
  };
};

Sprite_Text.prototype.setText = function(newText)
{
  this.bitmap.clear();

  this._j._text = newText;

  this.loadBitmap();
};

/**
 * Loads the bitmap into the sprite.
 */
Sprite_Text.prototype.loadBitmap = function()
{
  this.bitmap = new Bitmap(this.bitmapWidth(), this.bitmapHeight());
  this.bitmap.fontFace = this.fontFace();
  this.bitmap.fontSize = this.fontSize();
  this.bitmap.textColor = this.textColor();
  this.bitmap.drawText(
    this._j._text,
    0, 0,
    this.bitmapWidth(), this.bitmapHeight(),
    this.textAlignment());
};

/**
 * Hooks into the update to call the superclass update.
 */
Sprite_Text.prototype.update = function()
{
  Sprite.prototype.update.call(this);
};

/**
 * Determines the width of the bitmap accordingly to the length of the string.
 */
Sprite_Text.prototype.bitmapWidth = function()
{
  return 128 + this._j._widthMod;
};

/**
 * Determines the width of the bitmap accordingly to the length of the string.
 */
Sprite_Text.prototype.bitmapHeight = function()
{
  return 24 + this._j._heightMod;
};

/**
 * Determines the font size for text in this sprite.
 */
Sprite_Text.prototype.fontSize = function()
{
  return $gameSystem.mainFontSize() + this._j._fontSizeMod;
};

/**
 * Determines the font face for text in this sprite.
 */
Sprite_Text.prototype.fontFace = function()
{
  return $gameSystem.mainFontFace();
};

/**
 * Determines the font color for text in this sprite.
 * If no color is designated, then the default (white) is used.
 * @returns {number}
 */
Sprite_Text.prototype.textColor = function()
{
  return this._j._color
    ? ColorManager.textColor(this._j._color)
    : ColorManager.normalColor();
};

/**
 * Determines the alignment for text in this sprite.
 * @returns {string}
 */
Sprite_Text.prototype.textAlignment = function()
{
  return this._j._alignment;
};
//#endregion Sprite_Text