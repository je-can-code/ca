/*:
 * @target MZ
 * @plugindesc v1.47 Basic-but-optimized lighting plugin.
 * @author Terrax, iVillain, Aesica, JE
 *
 * @param defaultPlayerLightRadius
 * @type number
 * @text Default Player Light Radius
 * @desc The default size in pixels of the light globe around the player.
 * @default 250
 *
 * @help
 * ============================================================================
 * This plugin grants the ability to create "light globes" around the player
 * and events.
 * ============================================================================
 * NOTES
 * ----------------------------------------------------------------------------
 * There is only one note tag that is applicable to this plugin.
 * It goes on events in their tiny notebox.
 * The format looks like this (without the quotes):
 *
 * "TAG LIGHT_RADIUS LIGHT_COLOR FLICKER"
 *    where TAG is "light" (without quotes).
 *    where LIGHT_RADIUS is this event's light globe radius in pixels.
 *    where LIGHT_COLOR is a color as a string hexcode (OPTIONAL).
 *    where FLICKER is "flicker" (without quotes)(OPTIONAL).
 * ----------------------------------------------------------------------------
 * Unlike many plugins, this is a four-part tag that expects to be the only
 * tag on an event in the notebox that is separated by a single space. If you
 * add additional spaces, or switch the order, your game will likely crash when
 * attempting to parse these incorrectly-ordered or poorly-formed event notes.
 * ----------------------------------------------------------------------------
 * EXAMPLE USAGES:
 * ----------------------------------------------------------------------------
 *  light 250 #ffbb73
 * The above tag would generate a light globe around the target event:
 * - with a radius of 250 pixels (roughly 5 tiles)
 * - of the color #ffbb73 (overrides default of #ffffff).
 * - with no flicker (default when unprovided).
 *
 *  light 500
 * The above tag would generate a light globe around the target event:
 * - with a radius of 500 pixels (roughly 10 tiles).
 * - of color #ffffff (default when unprovided).
 * - with no flicker (default when unprovided).
 *
 *  light 400 #ff0000 flicker
 * The above tag would generate a light globe around the target event:
 * - with a radius of 400 pixels (roughly 8 tiles).
 * - of color #ff0000 (overrides default of #ffffff).
 * - with a flicker (overrides default of no flicker).
 * ----------------------------------------------------------------------------
 * sample hex code color references:
 * #ffffff = pure white
 * #ffbb73 = a warm orange-ish white, like an incandescent light bulb.
 * #ff0000 = pure red.
 * ----------------------------------------------------------------------------
 * ============================================================================
 * SCRIPT COMMANDS
 * ----------------------------------------------------------------------------
 * CHANGE PLAYER LIGHT GLOBE SIZE
 *  $gameSystem.setPlayerLightRadius(PLAYER_LIGHT_RADIUS)
 *    where PLAYER_LIGHT_RADIUS is the light globe radius in pixels.
 *
 * Updates the player's light radius to be the provided amount.
 * This amount represents the radius of the light globe around the player-
 * in pixels. Considering tile sizes in RMMZ are 48pixels across, then the
 * default of 250px is a circle with a radius of roughly 5 tiles.
 * ----------------------------------------------------------------------------
 * CHANGE PLAYER LIGHT GLOBE EDGE BLEND
 *  $gameSystem.setPlayerBrightness(PLAYER_GLOBE_BRIGHTNESS)
 *    where PLAYER_GLOBE_BRIGHTNESS is a number between 0.0 and 1.0
 *
 * Updates the way the light globe surrounding the player blends along the edge
 * of the circle. The default is 0.0, which makes it blend slower from the
 * player out to the edge of the light globe. The higher it gets, the crisper
 * the edge becomes and smaller the blending is. This is something I'd
 * encourage testing to see visually what this does.
 * ----------------------------------------------------------------------------
 * CHANGE PLAYER LIGHT GLOBE COLOR
 *  $gameSystem.setPlayerLightColor(PLAYER_GLOBE_COLOR)
 *    where PLAYER_GLOBE_COLOR is a color as string, in the form of hexcode.
 *
 * Updates the color of the actual light globe surrounding the player. The
 * default is plain white (#FFFFFF), but you can change that if you need to
 * match a different color scheme. Most people cannot translate hexcode to an
 * actual color, so it is encouraged to google "hex code color picker" to find
 * a utility that can help you find the color you're trying to use.
 * ----------------------------------------------------------------------------
 * CHANGE OVERALL MASK TINT COLOR
 *  $gameSystem.setMaskTint(NEW_MASK_COLOR)
 *    where NEW_MASK_COLOR is a color as a string, in the form of hexcode.
 *
 * Updates the color of the entire screen's mask. The "mask" refers to the
 * black that shrouds the screen when the player has no light events around
 * generating light in the area. The default is black, but with this command,
 * you can change that to whatever color you prefer. It is important to note
 * that the only color that isn't completely opaque is indeed black (#000000).
 * If you set it to even a little lighter than black (like #111111), then the
 * mask will be partially transparent, allowing the player to see to some
 * extent. This can allow you to change the screen mood to match the areas
 * you're in, such as a dark volcano, or underwater cavern, etc.
 * ============================================================================
 */

var umc = umc || {};
umc.Lighting = umc.Lighting || {};
umc.Lighting.version = 1.47;

umc.Lighting.parameters = PluginManager.parameters('UMC_Lighting_MZ');
umc.Lighting.Aliased =
{
  Game_System: new Map(),
  Spriteset_Map: new Map(),
};
umc.Lighting.Meta = new Map();
umc.Lighting.Meta.set('PlayerRadius', Number(umc.Lighting.parameters['defaultPlayerLightRadius']));

//#region Bitmap
/**
 * Gradiently fills a rectangle, radially.
 * @param {number} x1 The `x1` coordinate (Caution! +20 is added before usage).
 * @param {number} y1 The `y1` coordinate.
 * @param {number} r1 The `r1`.
 * @param {number} r2 The `r2`.
 * @param {string} color1 The first color of the gradient.
 * @param {string} color2 The second color of the gradient.
 * @param {number} brightness The level of brightness.
 * @param {boolean} flicker Whether or not this is a flickering light globe.
 */
Bitmap.prototype.radialGradientFillRect = function(x1, y1, r1, r2, color1, color2, brightness = 0.0, flicker = false)
{
  let isValidColor = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color1);
  if (!isValidColor)
  {
    color1 = '#000000'
  }

  let isValidColor2 = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color2);
  if (!isValidColor2)
  {
    color2 = '#000000'
  }

  const wait = Math.floor((Math.random() * 8) + 1);
  if (flicker && wait === 1)
  {
    let flickerradiusshift = 15;
    let flickercolorshift = 30;
    let gradrnd = Math.floor((Math.random() * flickerradiusshift) + 1);
    let colorrnd = Math.floor((Math.random() * flickercolorshift) - (flickercolorshift / 2));
    let { r, g, b } = this.hexToRgb(color1);
    g = (g + colorrnd).clamp(0, 255);
    color1 = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    r2 = r2 - gradrnd;
    if (r2 < 0) r2 = 0;
  }

  x1 += 20;
  const grad = this._context.createRadialGradient(x1, y1, r1, x1, y1, r2);
  if (brightness)
  {
    grad.addColorStop(brightness, '#FFFFFF');
  }

  grad.addColorStop(brightness, color1);
  grad.addColorStop(1, color2);

  this._context.save();
  this._context.fillStyle = grad;
  this._context.fillRect(x1 - r2, y1 - r2, r2 * 2, r2 * 2);
  this._context.restore();
};

/**
 * Converts a hexCode to a base16 RGB object.
 * @param {string} rawHex The hexCode to convert.
 * @returns {{r: number, b: number, g: number}}
 */
Bitmap.prototype.hexToRgb = function(rawHex)
{
  const result = { r: 0, g: 0, b: 0};
  const hexCode = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(rawHex);
  if (hexCode)
  {
    result.r = parseInt(hexCode[1], 16);
    result.g = parseInt(hexCode[2], 16);
    result.b = parseInt(hexCode[3], 16);
  }
  else
  {
    console.warn('invalid hexcode provided:', rawHex);
  }

  return result;
};

/**
 * Fills a rectangle with a color, and a +20 x modifier?
 *
 * TODO: Why is this captalized?
 * @param {number} x1 The `x1` coordinate (Caution! +20 is added before usage).
 * @param {number} y1 The `y1` coordinate.
 * @param {number} x2 The `x2` coordinate.
 * @param {number} y2 The `y2` coordinate.
 * @param {string} color1 The color to draw.
 */
Bitmap.prototype.FillRect = function(x1, y1, x2, y2, color1)
{
  x1 = x1 + 20;
  let context = this._context;
  context.save();
  context.fillStyle = color1;
  context.fillRect(x1, y1, x2, y2);
  context.restore();
};
//#endregion Bitmap

//#region Game_System
/**
 * Extends `.initialize()` to include this lighting configuration.
 */
umc.Lighting.Aliased.Game_System.set("initialize", Game_System.prototype.initialize);
Game_System.prototype.initialize = function()
{
  umc.Lighting.Aliased.Game_System.get("initialize").call(this);
  /**
   * The master lighting object.
   */
  this._umc = this._umc || {};

  /**
   * The radius size of the player's light globe (in pixels).
   * @type {number}
   */
  this._umc._playerLightRadius = this._umc._playerLightRadius || 250;

  /**
   * The intensity of the edge of the light globe's gradiance.
   * This must be between 0.0 and 1.0.
   * @type {number}
   */
  this._umc._playerBrightness = this._umc._playerBrightness || 0.0;

  /**
   * The color of the player's light globe.
   * This should be a hexcode color.
   * @type {string}
   */
  this._umc._playerLightColor = this._umc._playerLightColor || '#FFFFFF';

  /**
   * The color of the overall light mask on the screen.
   * This should be a hexcode color.
   * @type {string}
   */
  this._umc._maskTint = this._umc._maskTint || '#000000';
};

/**
 * Sets the light radius of the player to a given value.
 * @param {number} value The light radius in pixels.
 */
Game_System.prototype.setPlayerLightRadius = function(value)
{
  this._umc._playerLightRadius = value;
};

/**
 * Gets the light radius of the player (in pixels).
 * @returns {number}
 */
Game_System.prototype.getPlayerLightRadius = function()
{
  return this._umc._playerLightRadius;
};

/**
 * Sets the player's light globe brightness.
 * Value must be between `0.0` and `1.0`.
 * @param {number} value The new brightness level.
 */
Game_System.prototype.setPlayerBrightness = function(value)
{
  this._umc._playerBrightness = value;
};

/**
 * Gets the player's light globe brightness.
 * @returns {number}
 */
Game_System.prototype.getPlayerBrightness = function()
{
  return this._umc._playerBrightness;
};

/**
 * Sets the player's light globe color.
 * Value should be a hexcode color.
 * @param {string} value The hexcode color.
 */
Game_System.prototype.setPlayerLightColor = function(value)
{
  this._umc._playerLightColor = value;
};

/**
 * Gets the player's light globe color.
 * @returns {string}
 */
Game_System.prototype.getPlayerLightColor = function()
{
  return this._umc._playerLightColor;
};

/**
 * Sets the overall lightmask tint.
 * Value should be a hexcode color.
 * @param {string} value The hexcode color.
 */
Game_System.prototype.setMaskTint = function(value)
{
  this._umc._maskTint = value;
};

/**
 * Gets the overall lightmask tint.
 * @returns {string}
 */
Game_System.prototype.getMaskTint = function()
{
  return this._umc._maskTint;
};
//#endregion Game_System

//#region Spriteset_Map
/**
 * Extends `initialize()` to include preparing for the light mask.
 */
umc.Lighting.Aliased.Spriteset_Map.set('initialize', Spriteset_Map.prototype.initialize);
Spriteset_Map.prototype.initialize = function() {
  umc.Lighting.Aliased.Spriteset_Map.get('initialize').call(this);

  /**
   * Our lightmask, for managing the player's view.
   * @type {Lightmask}
   */
  this._lightmask = null;
};
/**
 * Extends `createLowerLayer()` to also create our lightmask.
 */
umc.Lighting.Aliased.Spriteset_Map.set('createLowerLayer', Spriteset_Map.prototype.createLowerLayer);
Spriteset_Map.prototype.createLowerLayer = function()
{
  umc.Lighting.Aliased.Spriteset_Map.get('createLowerLayer').call(this);
  this.createLightmask();
};

/**
 * Creates the lightmask object and adds it to tracking.
 */
Spriteset_Map.prototype.createLightmask = function ()
{
  this._lightmask = new Lightmask();
  this.addChild(this._lightmask);
};

/**
 * Extends `update()` to also update our lightmask if applicable.
 */
umc.Lighting.Aliased.Spriteset_Map.set('update', Spriteset_Map.prototype.update);
Spriteset_Map.prototype.update = function()
{
  umc.Lighting.Aliased.Spriteset_Map.get("update").call(this);
  if (this.canUpdateLightmask())
  {
    this._lightmask.update();
  }
};

/**
 * Checks whether or not we can update the light mask.
 * @returns {boolean}
 */
Spriteset_Map.prototype.canUpdateLightmask = function()
{
  // open for extension.
  return !!this._lightmask;
};
//#endregion Spriteset_Map

//#region Lightmask
/**
 * A visual mask to control the player's view of the map.
 * Creates a "light globe" around the player, and "light globes" around tagged events.
 * @constructor
 */
function Lightmask() { this.initialize(); }
Lightmask.prototype = Object.create(PIXI.Container.prototype);
Lightmask.prototype.constructor = Lightmask;

/**
 * Initializes the lightmask.
 */
Lightmask.prototype.initialize = function()
{
  PIXI.Container.call(this); // initialize pixi things.
  this.initMembers();
};

/**
 * Initializes all properties on this class.
 */
Lightmask.prototype.initMembers = function()
{
  /**
   * The width of the lightmask.
   * @type {number}
   */
  this._width = Graphics.width;

  /**
   * The height of the lightmask.
   * @type {number}
   */
  this._height = Graphics.height;

  /**
   * All sprites currently being managed.
   * @type {Sprite[]}
   */
  this._sprites = [];

  /**
   * The lightmask bitmap.
   * @type {Bitmap}
   */
  this._maskBitmap = this.createBitmap();

  /**
   * A class-level reference to the canvas rendering context.
   * @type {CanvasRenderingContext2D}
   */
  this._context = this._maskBitmap.canvas.getContext("2d");

  /**
   * A local array of the notes from relevant events.
   * @type {string[]}
   */
  this.event_note = [];

  /**
   * A local array of the eventIds from relevant events.
   * @type {number[]}
   */
  this.event_id = [];

  /**
   * A local array representing the "stack number".
   * This is effectively a means of mapping event to actual event.
   * @type {number[]}
   */
  this.event_stacknumber = [];

  /**
   * The number of events we have to work with.
   * This is typically equal to `$gameMap.events().length`.
   * @type {number}
   */
  this.event_count = 0;
};

/**
 * Creates the dark mask bitmap.
 */
Lightmask.prototype.createBitmap = function()
{
  return new Bitmap(Number(Graphics.width) + 20, Number(Graphics.height));
};

/**
 * Executes the main update logic for the lightmask.
 */
Lightmask.prototype.update = function ()
{
  this.reloadIfMapChanged();
  this.reloadIfEventsChanged();
  this.removeAllChildren();
  this.drawPlayerLightGlobe();
  this.drawEventLightGlobes();
  this.applyTint();
  this.addMaskSprite();
};

/**
 * Draws the light globe that follows the player.
 */
Lightmask.prototype.drawPlayerLightGlobe = function()
{
  let maxX = Graphics.width + 44;
  let maxY = Graphics.height + 44;
  this._maskBitmap.fillRect(0, 0, maxX, maxY, '#000000');
  this._context.globalCompositeOperation = 'lighter';

  // get the light radius of the player.
  const playerLightRadius = $gameSystem.getPlayerLightRadius();

  // if the player has a radius, then draw it.
  if (playerLightRadius)
  {

    // grab the color and brightness of the player.
    const playerLightColor = $gameSystem.getPlayerLightColor();
    const playerBrightness = $gameSystem.getPlayerBrightness();

    try
    {
      // render the light globe for the player.
      this._maskBitmap.radialGradientFillRect(
        $gamePlayer.screenX(),
        $gamePlayer.screenY(),
        0,
        playerLightRadius,
        playerLightColor,
        '#000000', // if this isn't the same as the mask tint, then it'll look funny.
        playerBrightness);
    }
    catch (e)
    {
      console.error('an error occurred while drawing the player globe.');
      console.warn(e);
    }
  }
};

/**
 * Reloads all events if the map id has changed.
 */
Lightmask.prototype.reloadIfMapChanged = function()
{
  let map_id = $gameMap.mapId();
  if (map_id !== this.oldmap) {
    this.oldmap = map_id;
    this.reloadMapEvents();
  }
};

/**
 * Reloads all events if the event count changed.
 */
Lightmask.prototype.reloadIfEventsChanged = function()
{
  if (this.event_count !== $gameMap.events().length)
  {
    this.reloadMapEvents();
  }
};

/**
 * Removes all sprites (children) from the PIXI container.
 */
Lightmask.prototype.removeAllChildren = function()
{
  const action = () => this.removeChild(this._sprites.pop());
  [...Array(this._sprites.length)].forEach(action.bind(this))
};

/**
 * Draws the light globe for all applicable "light events".
 */
Lightmask.prototype.drawEventLightGlobes = function()
{
  this.event_note.forEach((_, index) => this.drawEventLightGlobe(index));
};

/**
 * Draws a single light globe around an event.
 * @param {number} eventIndex The index of the event in our local tracking.
 */
Lightmask.prototype.drawEventLightGlobe = function(eventIndex)
{
  // don't draw light globes for erased events.
  if ($gameMap.events()[this.event_stacknumber[eventIndex]]._erased) return;

  // grab the note!
  const note = this.event_note[eventIndex];

  // the "note args" are the trio of data points required in the notebox of the light event.
  const lightParams = note.split(" ");

  // destructure the light parameters to get the values into convenient variables.
  let [commandName, _lightRadius, hexColor, _flicker] = lightParams;
  const lightRadius = parseInt(_lightRadius);
  const flicker = !!_flicker;
  if (commandName === "light")
  {
    // the second "note arg" is the light radius of this light event (in pixels).
    if (lightRadius >= 0)
    {
      // if the color is not valid or not present, it'll just be plain ol' white.
      hexColor = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hexColor)
        ? hexColor
        : '#FFFFFF';
      try
      {
        // get the x:y coordinates of the event (origin is 24 pixels up to be on the "head" of the event).
        const lx1 = $gameMap.events()[this.event_stacknumber[eventIndex]].screenX();
        const ly1 = $gameMap.events()[this.event_stacknumber[eventIndex]].screenY() - 24;

        // render the light globe around the event.
        this._maskBitmap.radialGradientFillRect(lx1, ly1, 0, lightRadius, hexColor, '#000000', 0.0, flicker);
      }
      // if we run into issues for some reason, just skip it.
      catch (e)
      {
        console.error(`ran into issues while trying to render event index: [${eventIndex}].`);
        console.warn(e);
      }
    }
  }
};

/**
 * Applies the tint to the mask.
 * The default tint is black, aka "#000000".
 */
Lightmask.prototype.applyTint = function()
{
  // do pixi things to change the way it renders the tint.
  this._context.globalCompositeOperation = 'lighter';


  // grab the current tint.
  let tint_value = $gameSystem.getMaskTint();

  // when the tint is #FFFFFF, the mask is disabled because thats literally just transparent/white.
  if (tint_value !== "#FFFFFF")
  {
    // discern the width and height.
    const maxX = Graphics.width + 44;
    const maxY = Graphics.height + 24;

    // render that tint.
    this._maskBitmap.FillRect(-20, 0, maxX, maxY, tint_value);
  }

  // reset the pixi things back to normal.
  this._context.globalCompositeOperation = 'source-over';
};

/**
 * Adds "all" mask sprites associated with
 */
Lightmask.prototype.addMaskSprite = function()
{
  if ($gameMap.mapId() >= 0) {
    // if the new map doesn't have any event notes, then don't bother.
    if (!this.event_note.length) return;

    // if we have notes, then add the mask sprite.
    this.addSprite(-20, 0, this._maskBitmap);
  }
};

/**
 * Refreshes the light-organized copy of all relevant events that manage light.
 */
Lightmask.prototype.reloadMapEvents = function()
{
  // empty and re-assign the various values accordingly.
  this.reinitialize();

  // iterate over every event and load them if applicable.
  $gameMap.events().forEach(this.loadMapEvent, this);
};

/**
 * Re-initializes the local trackers for various data points.
 */
Lightmask.prototype.reinitialize = function()
{
  this.event_note = [];
  this.event_id = [];
  this.event_stacknumber = [];
  this.event_count = $gameMap.events().length;
};

/**
 * Loads the event into local tracking where applicable.
 * @param {Game_Event} event The event in question.
 * @param {number} index The index of the event in the events collection.
 */
Lightmask.prototype.loadMapEvent = function(event, index)
{
  // skip the weird no-event, no-datamap-event, and no-event-note situations.
  if (!event || !event.event() || !event.event().note) return;

  // break down the note data into
  const noteArgs = event.event().note.split(' ');
  const [lightCommand,,] = noteArgs;

  if (lightCommand === "light")
  {
    this.event_note.push(event.event().note);
    this.event_id.push(event._eventId);
    this.event_stacknumber.push(index);
  }
};

/**
 * Adds a designated bitmap as a sprite on the map.
 * @param {number} x The `x` coordinate.
 * @param {number} y The `y` coordinate.
 * @param {Bitmap} bitmap The bitmap to add.
 */
Lightmask.prototype.addSprite = function(x, y, bitmap)
{
  // create the sprite.
  const sprite = this.createSprite(x, y, bitmap);

  // add this to our personal tracking.
  this._sprites.push(sprite);

  // add this to the PIXI container, too.
  this.addChild(sprite);
};

/**
 * Creates a full-screen sprite with the given bitmap.
 * @param {number} x The `x` coordinate.
 * @param {number} y The `y` coordinate.
 * @param {Bitmap} bitmap The bitmap to add.
 * @returns {Sprite}
 */
Lightmask.prototype.createSprite = function(x, y, bitmap)
{
  const sprite = new Sprite(this.viewport);
  sprite.bitmap = bitmap;
  sprite.opacity = 255;
  sprite.blendMode = 2;
  sprite.x = x;
  sprite.y = y;

  return sprite;
};
//#endregion Lightmask