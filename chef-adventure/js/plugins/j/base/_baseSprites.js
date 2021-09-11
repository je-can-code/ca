/*:
 * @target MZ
 * @plugindesc 
 * [v2.0.0 BASE] Mods/Adds for the various sprite object classes.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @help
 * ============================================================================
 * A component of BASE.
 * This is a cluster of all changes/overwrites to the objects that would
 * otherwise be found in the rmmz_sprites.js, such as Sprite_Damage. Also, any
 * new things that follow the pattern that defines a sprite object can be found
 * in here.
 * ============================================================================
 */

//#region Sprite_Icon
/**
 * A sprite that displays a single icon.
 */
function Sprite_Icon() { this.initialize(...arguments); }
Sprite_Icon.prototype = Object.create(Sprite.prototype);
Sprite_Icon.prototype.constructor = Sprite_Icon;
Sprite_Icon.prototype.initialize = function(iconIndex) {
  Sprite.prototype.initialize.call(this);
  this.initMembers(iconIndex);
  this.loadBitmap();
};

/**
 * Initializes the properties associated with this sprite.
 * @param {Bitmap} iconIndex The index of the icon this sprite represents.
 */
Sprite_Icon.prototype.initMembers = function(iconIndex) {
  this._j = {
    _iconIndex: iconIndex,
  };
};

/**
 * Loads the bitmap into the sprite.
 */
Sprite_Icon.prototype.loadBitmap = function() {
  this.bitmap = ImageManager.loadSystem("IconSet");
  const pw = ImageManager.iconWidth;
  const ph = ImageManager.iconHeight;
  const sx = (this._j._iconIndex % 16) * pw;
  const sy = Math.floor(this._j._iconIndex / 16) * ph;
  this.setFrame(sx, sy, pw, ph);
};
//#endregion Sprite_Icon

//#region Sprite_Face
/**
 * A sprite that displays a single face.
 */
function Sprite_Face() { this.initialize(...arguments); }
Sprite_Face.prototype = Object.create(Sprite.prototype);
Sprite_Face.prototype.constructor = Sprite_Face;
Sprite_Face.prototype.initialize = function(faceName, faceIndex) {
  Sprite.prototype.initialize.call(this);
  this.initMembers(faceName, faceIndex);
  this.loadBitmap();
};

/**
 * Initializes the properties associated with this sprite.
 * @param {string} faceName The name of the face file.
 * @param {number} faceIndex The index of the face.
 */
Sprite_Face.prototype.initMembers = function(faceName, faceIndex) {
  this._j = {
    _faceName: faceName,
    _faceIndex: faceIndex,
  };
};

/**
 * Loads the bitmap into the sprite.
 */
Sprite_Face.prototype.loadBitmap = function() {
  this.bitmap = ImageManager.loadFace(this._j._faceName);
  const pw = ImageManager.faceWidth;
  const ph = ImageManager.faceHeight;
  const width = pw;
  const height = ph;
  const sw = Math.min(width, pw);
  const sh = Math.min(height, ph);
  const sx = Math.floor((this._j._faceIndex % 4) * pw + (pw - sw) / 2);
  const sy = Math.floor(Math.floor(this._j._faceIndex / 4) * ph + (ph - sh) / 2);
  this.setFrame(sx, sy, pw, ph);
};
//#endregion Sprice_Face

//#region Sprite_MapGauge
/**
 * The sprite for displaying an hp gauge over a character's sprite.
 */
function Sprite_MapGauge() { this.initialize(...arguments); }
Sprite_MapGauge.prototype = Object.create(Sprite_Gauge.prototype);
Sprite_MapGauge.prototype.constructor = Sprite_MapGauge;
Sprite_MapGauge.prototype.initialize = function(
  bitmapWidth = 96, bitmapHeight = 24, gaugeHeight = 6,
  label = "", value = null, iconIndex = -1) {
    this._duration = 0;
    this._gauge = {};
    this._gauge._bitmapWidth = bitmapWidth;
    this._gauge._bitmapHeight = bitmapHeight;
    this._gauge._gaugeHeight = gaugeHeight;
    this._gauge._label = label;
    this._gauge._value = value;
    this._gauge._iconIndex = iconIndex;

    Sprite_Gauge.prototype.initialize.call(this);
    this.initMembers();
    this.createBitmap();
};

/**
 * Hook into the superclass update to do more things.
 */
Sprite_MapGauge.prototype.update = function() {
  Sprite_Gauge.prototype.update.call(this);
  //this.manageGaugeVisibility();
};

/**
 * Handles the visibility of this hp bar based on interactivity.
 */
Sprite_MapGauge.prototype.manageGaugeVisibility = function() {
  if (this._duration > 0) {
    this._duration--;
  }

  if (this._duration <= 60) {
    this.opacity -= 4.25;
  }
};

/**
 * Enforces the bitmap's width to be this value.
 */
Sprite_MapGauge.prototype.bitmapWidth = function() {
  return this._gauge._bitmapWidth;
};

/**
 * Enforces the bitmap's height to be this value.
 */
Sprite_MapGauge.prototype.bitmapHeight = function() {
  return this._gauge._bitmapHeight;
};

/**
 * Enforces the map gauge's height to be this value.
 */
Sprite_MapGauge.prototype.gaugeHeight = function() {
  return this._gauge._gaugeHeight;
};

/**
 * Set this gauge's label.
 * @param {string} label The label to set this gauge to.
 */
Sprite_MapGauge.prototype.setLabel = function(label) {
  this._gauge._label = label;
  this.redraw();
};

/**
 * Gets this gauge's label.
 */
Sprite_MapGauge.prototype.drawLabel = function() {
  if (this._gauge._label) {
    const x = 32;
    const y = 0;
    this.bitmap.fontSize = 12;
    this.bitmap.drawText(this._gauge._label, x, y, this.bitmapWidth(), this.bitmapHeight(), "left");
  }
};

/**
 * Set this gauge's iconIndex.
 * @param {number} iconIndex The index/id of the icon to assign.
 */
Sprite_MapGauge.prototype.setIcon = function(iconIndex) {
  this._gauge._iconIndex = iconIndex;
  this.redraw();
};

/**
 * Draws the icon associated with this gauge.
 */
Sprite_MapGauge.prototype.drawIcon = function() {
  if (this._gauge._iconIndex > 0 && !this.children.length) {
    const sprite = this.createIconSprite();
    sprite.move(10, 20);
    this.addChild(sprite);
  }
};

Sprite_MapGauge.prototype.createIconSprite = function() {
  const sprite = new Sprite_Icon(this._gauge._iconIndex);
  sprite.scale.x = 0.5;
  sprite.scale.y = 0.5;
  return sprite;
};

/**
 * Don't draw values for gauges on the map.
 * TODO: consider implementing values only when the enemy has been defeated.
 */
Sprite_MapGauge.prototype.drawValue = function() {
  return this._gauge._value;
};

/**
 * OVERWRITE Rescopes `this` to point to the `Sprite_MapGauge` intead of the base
 * `Sprite_Gauge`. Otherwise, this is identical to the base `Sprite_Gauge.redraw()`.
 */
Sprite_MapGauge.prototype.redraw = function() {
  this.bitmap.clear();
  const currentValue = this.currentValue();
  if (!isNaN(currentValue)) {
    this.drawGauge();
    if (this._statusType !== "time") {
      this.drawLabel();
      this.drawIcon();
      if (this.isValid()) {
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
Sprite_MapGauge.prototype.currentValue = function() {
  if (this._battler) {
      switch (this._statusType) {
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
Sprite_MapGauge.prototype.currentMaxValue = function() {
  if (this._battler) {
      switch (this._statusType) {
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
//#endregion

//#region Sprite_Text
/**
 * A sprite that displays some static text.
 */
function Sprite_Text() { this.initialize(...arguments); }
Sprite_Text.prototype = Object.create(Sprite.prototype);
Sprite_Text.prototype.constructor = Sprite_Text;
Sprite_Text.prototype.initialize = function(
  text, color = null, fontSizeMod = 0, alignment = "center", widthMod = 0, heightMod = 0
) {
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
) {
  this._j = {
    _text: text,
    _color: color,
    _fontSizeMod: fontSizeMod,
    _alignment: alignment,
    _widthMod: widthMod,
    _heightMod: heightMod,
  };
};

/**
 * Loads the bitmap into the sprite.
 */
Sprite_Text.prototype.loadBitmap = function() {
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
Sprite_Text.prototype.update = function() {
  Sprite.prototype.update.call(this);
};

/**
 * Determines the width of the bitmap accordingly to the length of the string.
 */
Sprite_Text.prototype.bitmapWidth = function() {
  return 128 + this._j._widthMod;
};

/**
 * Determines the width of the bitmap accordingly to the length of the string.
 */
Sprite_Text.prototype.bitmapHeight = function() {
  return 24 + this._j._heightMod;
};

/**
 * Determines the font size for text in this sprite.
 */
Sprite_Text.prototype.fontSize = function() {
  return $gameSystem.mainFontSize() + this._j._fontSizeMod;
};

/**
 * Determines the font face for text in this sprite.
 */
Sprite_Text.prototype.fontFace = function() {
  return $gameSystem.mainFontFace();
};

/**
 * Determines the font color for text in this sprite.
 * If no color is designated, then the default (white) is used.
 * @returns {number}
 */
Sprite_Text.prototype.textColor = function() {
  return this._j._color
    ? ColorManager.textColor(this._j._color)
    : ColorManager.normalColor();
};

/**
 * Determines the alignment for text in this sprite.
 * @returns {string}
 */
Sprite_Text.prototype.textAlignment = function() {
  return this._j._alignment;
};
//#endregion
//ENDFILE