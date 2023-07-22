/*:
@plugindesc Pixel perfect bitmap fonts using a texture
@author Coelocanth
@target MZ

@help This plugin replaces font rendering via outline vectors with bitmaps.
Vector fonts have the advantage of anti aliasing and smooth scaling to any
size, whereas bitmap fonts are fixed size and render exactly as drawn.

The canvas implementation in RM/PIXI tends to blur fonts at small sizes as
well, which can look particularly bad when using a pixel style font.

A tool for creating a font texture from a font can be found at
https://github.com/evanw/font-texture-generator.git

Fonts are scaled using nearest neighbor, so font sizes used in the game
should be exact multiples of the master font image.

To facilitate this, you can override font sizes in the standard game
engine using this plugin. By setting any of these parameters to 0, this
plugin will stay out of the way and not touch the font size (e.g. you are
using another plugin for controlling fonts)

The size of the main font is set in the system 2 tab of the database.

The font name can also be overridden - it should match the name used in
the fonts list (which does not need to match the filename or font's
internal name).
If these are empty, no changes are made.

@param fonts
@desc list of bitmap fonts
@type struct<Font>[]

@param override
@text Override Fonts

@param sizeSpriteDamage
@parent override
@text Size: Sprite_Damage
@desc Font size for Sprite_Damage (used for damage popups)
@type number
@default 0

@param fontSpriteDamage
@parent override
@text Font: Sprite_Damage
@desc Font name for Sprite_Damage (used for damage popups)

@param sizeSpriteGaugeLabel
@parent override
@text Size: Sprite_Gauge - label
@desc Font size for Sprite_Gauge label (used for HP, MP, TP labels)
@type number
@default 0

@param fontSpriteGaugeLabel
@parent override
@text Font: Sprite_Gauge - label
@desc Font name for Sprite_Gauge (used for HP, MP, TP labels)

@param sizeSpriteGaugeValue
@parent override
@text Size: Sprite_Gauge - Value
@desc Font size for Sprite_Gauge Value (used for HP, MP, TP numbers)
@type number
@default 0

@param fontSpriteGaugeValue
@parent override
@text Font: Sprite_Gauge - Value
@desc Font name for Sprite_Gauge (used for HP, MP, TP numbers)

@param sizeSpriteName
@parent override
@text Size: Sprite_Name
@desc Font size for Sprite_Name (used for actor names in status windows)
@type number
@default 0

@param fontSpriteName
@parent override
@text Font: Sprite_Name
@desc Font name for Sprite_Name (used for actor names in status windows)

@param sizeSpriteTimer
@parent override
@text Size: Sprite_Timer
@desc Font size for Sprite_Timer (used for the timer countdown)
@type number
@default 0

@param fontSpriteTimer
@parent override
@text Font: Sprite_Timer (used for the timer countdown)
@desc Font name for S

@param clip
@desc Clip (prevent out of bounds drawing of text)
@type boolean
@default true

@param clipOverflowLeft
@parent clip
@desc Number of font pixels to expand clipping box by
@type number
@default 2

@param clipOverflowRight
@parent clip
@desc Number of font pixels to expand clipping box by
@type number
@default 2

@param clipOverflowTop
@parent clip
@desc Number of font pixels to expand clipping box by
@type number
@default 2

@param clipOverflowBottom
@parent clip
@desc Number of font pixels to expand clipping box by
@type number
@default 2

@param debug
@desc Draw coloured rectangles around everything
@type boolean
@default false
*/

/*~struct~Font:
@param name
@desc CSS name of the font, e.g. 'rmmz-mainfont', 'rmmz-numberfont'
@default rmmz-mainfont

@param texture
@desc image file containing the font texture
@type file
@dir img/system
@require 1

@param data
@desc JSON file containing the font data, in the fonts folder
@type string
@require 1
*/
var Imported = Imported || {};
Imported["CC_FontTexture"] = true;
var CC = CC || {};
CC.FontTexture = {};
(() => {
    'use strict';
    let _fontTextures = {};
    let _coloredFontTextures = {};
    let _fontData = {};
    const _m = document.currentScript.src.match(/\/([^\/]+)[.]js$/);
    const _pluginName = (_m ? _m[1] : "CC_FontTexture");
    const _params = PluginManager.parameters(_pluginName);
    let _debug = _params["debug"] === "true";
    let _clip = _params["clip"] !== "false";
    let _getFloatParam = function (p, k) {
        if (k in p) {
            return parseFloat(p[k]);
        }
        return 0;
    }
    let _clipOverflowLeft = _getFloatParam(_params, "clipOverflowLeft");
    let _clipOverflowRight = _getFloatParam(_params, "clipOverflowRight");
    let _clipOverflowTop = _getFloatParam(_params, "clipOverflowTop");
    let _clipOverflowBottom = _getFloatParam(_params, "clipOverflowBottom");

    CC.FontTexture.colored = function (font, color) {
        const cachekey = font + ":" + color;
        let b = _coloredFontTextures[cachekey];
        if (b === undefined) {
            if (!_fontTextures[font]) {
                _coloredFontTextures[cachekey] = null;
                return null;
            }
            const w = _fontTextures[font].width;
            const h = _fontTextures[font].height;
            b = new Bitmap(w, h);
            const context = b.context;
            context.save();
            context.drawImage(_fontTextures[font]._image, 0, 0);
            context.globalCompositeOperation = "multiply";
            context.fillStyle = color;
            context.fillRect(0, 0, w, h);
            context.globalCompositeOperation = "destination-in";
            context.drawImage(_fontTextures[font]._image, 0, 0);
            context.restore();
            b._baseTexture.update();
            _coloredFontTextures[cachekey] = b;
        }
        return b;
    }

    CC.FontTexture.find = function (fontFace) {
        for (const font of fontFace.split(/\s*,\s*/)) {
            if (_fontData[font]) {
                return { "face": font, "data": _fontData[font] };
            }
        }
        return { "face": null, "data": null };
    }

    let _Scene_Boot_loadGameFonts = Scene_Boot.prototype.loadGameFonts;
    if (_Scene_Boot_loadGameFonts === undefined) {
        // This is MV?
        _Scene_Boot_loadGameFonts = function () { };
        let _Scene_Boot_create = Scene_Boot.prototype.create;
        Scene_Boot.prototype.create = function () {
            _Scene_Boot_create.call(this);
            this.loadGameFonts();
        }
    }
    Scene_Boot.prototype.loadGameFonts = function () {
        const fonts = JSON.parse(_params["fonts"] || "[]");
        if (!fonts.length) {
            console.error("No fonts defined in plugin parameters");
        }
        for (const font of fonts) {
            const info = JSON.parse(font);
            _fontData[info.name] = null;
            fetch("fonts/" + info.data.trim())
                .then(response => response.json())
                .then(data => _fontData[info.name] = data)
                .catch(reason => this.onFontDataError(info, reason));
            _fontTextures[info.name] = ImageManager.loadSystem(info.texture);
            _fontTextures[info.name].smooth = false;
        }
        _Scene_Boot_loadGameFonts.call(this);
    }

    Scene_Boot.prototype.onFontDataError = function (info, reason) {
        console.error("Failed to load font data", info, reason);
        delete _fontData[info.name];
    }

    let _Scene_Boot_isReady = Scene_Boot.prototype.isReady;
    Scene_Boot.prototype.isReady = function () {
        return _Scene_Boot_isReady.call(this) && !Object.values(_fontData).some(v => v === null);
    }

    let _Bitmap_drawText = Bitmap.prototype.drawText;
    Bitmap.prototype.drawText = function (text, x, y, maxWidth, lineHeight, align) {
        const context = this.context;
        const fontInfo = CC.FontTexture.find(this.fontFace);
        const dataFont = fontInfo.data;
        const fontFace = fontInfo.face;
        if (!dataFont) {
            // fallback
            return _Bitmap_drawText.apply(this, arguments);
        }
        const size = dataFont.size;
        const scale = this.fontSize / size;
        const texture = CC.FontTexture.colored(fontFace, this.textColor);
        let ty = Math.round(y + lineHeight / 2 + this.fontSize * 0.35);
        context.save();
        if (_clip && maxWidth) {
            let clip_x = x - (_clipOverflowLeft * scale);
            let clip_y = y - (_clipOverflowTop * scale);
            let clip_w = maxWidth + ((_clipOverflowLeft + _clipOverflowRight) * scale);
            let clip_h = (lineHeight ? lineHeight : this.height);
            clip_h += ((_clipOverflowTop + _clipOverflowBottom) * scale);
            context.rect(clip_x, clip_y, clip_w, clip_h);
            context.clip();
        }
        context.globalCompositeOperation = "source-over";
        context.imageSmoothingEnabled = false;
        if (_debug) {
            context.lineWidth = 1;
            context.strokeStyle = "#FFFF00";
            context.strokeRect(x, y, maxWidth, lineHeight);
        }
        if (align === 'right' || align === 'center') {
            const w = this.measureTextWidth(text);
            const dx = Math.round((maxWidth - w) / (align === 'right' ? 1 : 2));
            x += Math.max(0, dx);
        }
        for (const c of String(text)) {
            const metrics = dataFont.characters[c];
            if (metrics) {
                const dx = x - (scale * metrics.originX);
                const dy = ty - (scale * metrics.originY);
                const dw = metrics.width * scale;
                const dh = metrics.height * scale;
                if (_debug) {
                    context.lineWidth = 1;
                    context.strokeStyle = "#FF00FF";
                    context.strokeRect(dx, dy, dw, dh);
                }
                context.drawImage(texture._canvas || texture._image, metrics.x, metrics.y, metrics.width, metrics.height,
                    dx, dy, dw, dh);
                x += (scale * metrics.advance);
            } else {
                // fallback
                const w = this.measureTextWidth(c);
                _Bitmap_drawText.call(this, c, x, y, maxWidth, lineHeight);
                x += w;
            }
        }
        context.restore();
        this._baseTexture.update();
    }

    let _Bitmap_measureTextWidth = Bitmap.prototype.measureTextWidth;
    Bitmap.prototype.measureTextWidth = function (text) {
        const dataFont = CC.FontTexture.find(this.fontFace).data;
        if (!dataFont) {
            return _Bitmap_measureTextWidth.apply(this, arguments);
        }
        const size = dataFont.size;
        const scale = this.fontSize / size;
        let w = 0;
        for (const c of String(text)) {
            const metrics = dataFont.characters[c];
            if (metrics) {
                w += (scale * metrics.advance);
            } else {
                w += Math.round(_Bitmap_measureTextWidth.call(this, c));
            }
        }
        return w;
    }

    Bitmap.prototype.drawGlyph = function (c, x, y) {
        const dataFont = CC.FontTexture.find(this.fontFace).data;
        const metrics = dataFont ? dataFont.characters[c] : null;
        if (metrics) {
            const dx = x - (scale * metrics.originX);
            const dy = ty - (scale * metrics.originY);
            const dw = metrics.width * scale;
            const dh = metrics.height * scale;
            if (true) {
                context.lineWidth = 1;
                context.strokeStyle = "#FF00FF";
                context.strokeRect(dx, dy, dw, dh);
            }
            context.drawImage(_fontTextures[this.context.font]._image, metrics.x, metrics.y, metrics.width, metrics.height,
                dx, dy, dw, dh);
            x += (scale * metrics.advance);
        } else {
            // fallback
            const w = this.measureTextWidth(c);
            _Bitmap_drawText.call(this, c, x, y, maxWidth, lineHeight);
            x += w;
        }
    }

    // Sprite overrides
    if ((_params["sizeSpriteDamage"] || 0) !== "0") {
        const _size = parseInt(_params["sizeSpriteDamage"]);
        Sprite_Damage.prototype.fontSize = function () {
            return _size;
        };
    }

    if (_params["fontSpriteDamage"]) {
        Sprite_Damage.prototype.fontFace = function () {
            return _params["fontSpriteDamage"] + ", " + $gameSystem.numberFontFace();
        };
    }

    if ((_params["sizeSpriteGaugeLabel"] || 0) !== "0") {
        const _size = parseInt(_params["sizeSpriteGaugeLabel"]);
        Sprite_Gauge.prototype.labelFontSize = function () {
            return _size;
        };
    }

    if (_params["fontSpriteGaugeLabel"]) {
        Sprite_Name.prototype.labelFontFace = function () {
            return _params["fontSpriteGaugeLabel"] + ", " + $gameSystem.mainFontFace();
        };
    }

    if ((_params["sizeSpriteGaugeValue"] || 0) !== "0") {
        const _size = parseInt(_params["sizeSpriteGaugeValue"]);
        Sprite_Gauge.prototype.valueFontSize = function () {
            return _size;
        };
    }

    if (_params["fontSpriteGaugeValue"]) {
        Sprite_Name.prototype.valueFontFace = function () {
            return _params["fontSpriteGaugeValue"] + ", " + $gameSystem.numberFontFace();
        };
    }

    if ((_params["sizeSpriteName"] || 0) !== "0") {
        const _sizeSpriteName = parseInt(_params["sizeSpriteName"]);
        Sprite_Name.prototype.fontSize = function () {
            return _sizeSpriteName;
        };
    }

    if (_params["fontSpriteName"]) {
        Sprite_Name.prototype.fontFace = function () {
            return _params["fontSpriteName"] + ", " + $gameSystem.mainFontFace();
        };
    }

    if ((_params["sizeSpriteTimer"] || 0) !== "0") {
        const _sizeSpriteTimer = parseInt(_params["sizeSpriteTimer"]);
        Sprite_Timer.prototype.fontSize = function () {
            return _sizeSpriteTimer;
        };
    }

    if (_params["fontSpriteTimer"]) {
        Sprite_Timer.prototype.fontFace = function () {
            return _params["fontSpriteTimer"] + ", " + $gameSystem.numberFontFace();
        };
    }

})();