//region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 HUD-PARTY] A HUD frame that displays your party's data.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-ABS
 * @base J-Base
 * @base J-HUD
 * @orderAfter J-ABS
 * @orderAfter J-Base
 * @orderAfter J-HUD
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is an extension of the J-HUD system.
 *
 * This is the Party Frame, which displays the leader and allied members that
 * the player currently has in their party.
 *
 * This includes the following data points for all actors:
 * - face portrait
 * - hp gauge
 * - mp gauge
 * - tp gauge
 *
 * And the additional following data points for the currently selected leader:
 * - current level
 * - experience gauge
 * - positive/negative state tracking
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '1.0.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//endregion version check

//region metadata
/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.HUD.EXT.PARTY = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.HUD.EXT.PARTY = {};
J.HUD.EXT.PARTY.Metadata = {};
J.HUD.EXT.PARTY.Metadata.Version = '1.0.0';
J.HUD.EXT.PARTY.Metadata.Name = `J-HUD-PartyFrame`;

/**
 * A collection of all aliased methods for this plugin.
 */
J.HUD.EXT.PARTY.Aliased = {
  Scene_Map: new Map(),
};
//endregion introduction
//endregion introduction

//region Scene_Map
/**
 * Hooks into `initialize` to add our hud.
 */
J.HUD.EXT.PARTY.Aliased.Scene_Map.set('initialize', Scene_Map.prototype.initialize);
Scene_Map.prototype.initialize = function()
{
  // perform original logic.
  J.HUD.EXT.PARTY.Aliased.Scene_Map.get('initialize').call(this);

  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * The hud window on the map.
   * @type {Window_PartyFrame}
   */
  this._j._partyFrame = null;
};

/**
 * Once the map is loaded, create the text log.
 */
J.HUD.EXT.PARTY.Aliased.Scene_Map.set('createAllWindows', Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function()
{
  // perform original logic.
  J.HUD.EXT.PARTY.Aliased.Scene_Map.get('createAllWindows').call(this);

  // create the hud.
  this.createPartyFrameWindow();
};

//region party frame
/**
 * Creates the party frame window and adds it to tracking.
 */
Scene_Map.prototype.createPartyFrameWindow = function()
{
  // create the rectangle of the window.
  const rect = this.partyFrameWindowRectangle();

  // assign the window to our reference.
  this._j._partyFrame = new Window_PartyFrame(rect);

  // add window to tracking.
  this.addWindow(this._j._partyFrame);
};

/**
 * Creates the rectangle representing the window for the map hud.
 * @returns {Rectangle}
 */
Scene_Map.prototype.partyFrameWindowRectangle = function()
{
  // define the width of the window.
  const width = 360;

  // define the height of the window.
  const height = 400;

  // define the origin x of the window.
  const x = 0;

  // define the origin y of the window.
  const y = Graphics.boxHeight - height;

  // return the built rectangle.
  return new Rectangle(x, y, width, height);
};
//endregion party frame

/**
 * OVERWRITE Relocates the map display name window to not overlap the hud.
 */
Scene_Map.prototype.mapNameWindowRect = function()
{
  const wx = 400;
  const wy = 0;
  const ww = 360;
  const wh = this.calcWindowHeight(1, false);
  return new Rectangle(wx, wy, ww, wh);
};

/**
 * Refreshes the hud on-command.
 */
J.HUD.EXT.PARTY.Aliased.Scene_Map.set('refreshHud', Scene_Map.prototype.refreshHud);
Scene_Map.prototype.refreshHud = function()
{
  // perform original logic.
  J.HUD.EXT.PARTY.Aliased.Scene_Map.get('refreshHud').call(this);

  // refresh the party frame.
  this._j._partyFrame.refresh();
};

/**
 * Extend the update loop for the party frame.
 */
J.HUD.EXT.PARTY.Aliased.Scene_Map.set('updateHudFrames', Scene_Map.prototype.updateHudFrames);
Scene_Map.prototype.updateHudFrames = function()
{
  // perform original logic.
  J.HUD.EXT.PARTY.Aliased.Scene_Map.get('updateHudFrames').call(this);

  // manages hud refreshes.
  this.handleRefreshPartyFrame();

  // manages hud image cache refreshes.
  this.handleRefreshPartyFrameImageCache();
};

/**
 * Handles incoming requests to refresh the hud.
 */
Scene_Map.prototype.handleRefreshPartyFrame = function()
{
  // handles incoming requests to refresh the hud.
  if ($hudManager.hasRequestRefreshHud())
  {
    // refresh the hud.
    this._j._partyFrame.refresh();

    // let the hud manager know we've done the deed.
    $hudManager.acknowledgeRefreshHud();
  }
};

/**
 * Handles incoming requests to refresh the hud's image cache.
 */
Scene_Map.prototype.handleRefreshPartyFrameImageCache = function()
{
  // handles incoming requests to refresh the hud.
  if ($hudManager.hasRequestRefreshImageCache())
  {
    // refresh the hud's image cache.
    this._j._partyFrame.refreshCache();

    // and then refresh the hud with the new refreshed assets.
    this._j._partyFrame.refresh();

    // let the hud manager know we've done the deed.
    $hudManager.acknowledgeRefreshImageCache();
  }
};
//endregion Scene_Map

//region Sprite_ActorValue
/**
 * A sprite that monitors one of the primary fluctuating values (hp/mp/tp).
 */
function Sprite_ActorValue()
{
  this.initialize(...arguments);
}

Sprite_ActorValue.prototype = Object.create(Sprite.prototype);
Sprite_ActorValue.prototype.constructor = Sprite_ActorValue;
Sprite_ActorValue.prototype.initialize = function(actor, parameter, fontSizeMod = 0)
{
  this._j = {};
  Sprite.prototype.initialize.call(this);
  this.initMembers(actor, parameter, fontSizeMod);
  this.bitmap = this.createBitmap();
};

/**
 * Initializes the properties associated with this sprite.
 * @param {object} actor The actor to track the value of.
 * @param {string} parameter The parameter to track of "hp"/"mp"/"tp"/"time".
 * @param {number} fontSizeMod The modification of the font size for this value.
 */
Sprite_ActorValue.prototype.initMembers = function(actor, parameter, fontSizeMod)
{
  this._j._parameter = parameter;
  this._j._actor = actor;
  this._j._fontSizeMod = fontSizeMod;
  this._j._last = {};
  this._j._last._hp = actor.hp;
  this._j._last._mp = actor.mp;
  this._j._last._tp = actor.tp;
  this._j._last._xp = actor.currentExp();
  this._j._last._lvl = actor.level;
  this._j._autoCounter = 60;
};

/**
 * Updates the bitmap if it needs updating.
 */
Sprite_ActorValue.prototype.update = function()
{
  Sprite.prototype.update.call(this);
  if (this.hasParameterChanged())
  {
    this.refresh();
  }

  this.autoRefresh();
};

/**
 * Automatically refreshes the value being represented by this sprite
 * after a fixed amount of time.
 */
Sprite_ActorValue.prototype.autoRefresh = function()
{
  if (this._j._autoCounter <= 0)
  {
    this.refresh();
    this._j._autoCounter = 60;
  }

  this._j._autoCounter--;
};

/**
 * Refreshes the value being represented by this sprite.
 */
Sprite_ActorValue.prototype.refresh = function()
{
  this.bitmap = this.createBitmap();
};

/**
 * Checks whether or not a given parameter has changed.
 */
Sprite_ActorValue.prototype.hasParameterChanged = function()
{
  let changed = true;
  switch (this._j._parameter)
  {
    case "hp":
      changed = this._j._actor.hp !== this._j._last._hp;
      if (changed) this._j._last._hp = this._j._actor.hp;
      return changed;
    case "mp":
      changed = this._j._actor.mp !== this._j._last._mp;
      if (changed) this._j._last._mp = this._j._actor.mp;
      return changed;
    case "tp":
      changed = this._j._actor.tp !== this._j._last._tp;
      if (changed) this._j._last.tp = this._j._actor.tp;
      return changed;
    case "time":
      changed = this._j._actor.currentExp() !== this._j._last._xp;
      if (changed) this._j._last._xp = this._j._actor.currentExp();
      return changed;
    case "lvl":
      changed = this._j._actor.level !== this._j._last._lvl;
      if (changed) this._j._last._lvl = this._j._actor.level;
      return changed;
  }
};

/**
 * Creates a bitmap to attach to this sprite that shows the value.
 */
Sprite_ActorValue.prototype.createBitmap = function()
{
  let value = 0;
  const width = this.bitmapWidth();
  const height = this.fontSize() + 4;
  const bitmap = new Bitmap(width, height);
  bitmap.fontFace = this.fontFace();
  bitmap.fontSize = this.fontSize();
  switch (this._j._parameter)
  {
    case "hp":
      bitmap.outlineWidth = 4;
      bitmap.outlineColor = "rgba(128, 24, 24, 1.0)";
      value = Math.floor(this._j._actor.hp);
      break;
    case "mp":
      bitmap.outlineWidth = 4;
      bitmap.outlineColor = "rgba(24, 24, 192, 1.0)";
      value = Math.floor(this._j._actor.mp);
      break;
    case "tp":
      bitmap.outlineWidth = 2;
      bitmap.outlineColor = "rgba(64, 128, 64, 1.0)";
      value = Math.floor(this._j._actor.tp);
      break;
    case "time":
      bitmap.outlineWidth = 4;
      bitmap.outlineColor = "rgba(72, 72, 72, 1.0)";
      const curExp = (this._j._actor.nextLevelExp() - this._j._actor.currentLevelExp());
      const nextLv = (this._j._actor.currentExp() - this._j._actor.currentLevelExp());
      value = curExp - nextLv;
      break;
    case "lvl":
      bitmap.outlineWidth = 4;
      bitmap.outlineColor = "rgba(72, 72, 72, 1.0)";
      value = this._j._actor.level.padZero(3);
      break;
  }

  bitmap.drawText(value, 0, 0, bitmap.width, bitmap.height, "left");
  return bitmap;
};

/**
 * Defaults the bitmap width to be a fixed 200 pixels.
 */
Sprite_ActorValue.prototype.bitmapWidth = function()
{
  return 200;
};

/**
 * Defaults the font size to be an adjusted amount from the base font size.
 */
Sprite_ActorValue.prototype.fontSize = function()
{
  return $gameSystem.mainFontSize() + this._j._fontSizeMod;
};

/**
 * Defaults the font face to be the number font.
 */
Sprite_ActorValue.prototype.fontFace = function()
{
  return $gameSystem.numberFontFace();
};
//endregion Sprite_ActorValue

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

//region Window_PartyFrame
/**
 * A window containing the HUD data for the {@link Game_Party}.
 */
class Window_PartyFrame extends Window_Base
{
  /**
   * The static collection of gauge types supported.
   */
  static gaugeTypes = {
    /**
     * The type of gauge for hp.
     */
    HP: "hp",

    /**
     * The type of gauge for mp.
     */
    MP: "mp",

    /**
     * The type of gauge for tp.
     */
    TP: "tp",

    /**
     * The type of gauge for xp.
     * We borrow the "time" gauge for this, though.
     */
    XP: "time",

    /**
     * Not actually a gauge, but does have an actorvalue representing
     * the actor's level.
     */
    Level: "lvl"
  };

  /**
   * Constructor.
   * @param {Rectangle} rect The shape representing this window.
   */
  constructor(rect)
  {
    // required when extending a base class.
    super(rect);
  }

  /**
   * Initializes this class.
   * @param {Rectangle} rect The shape representing this window.
   */
  initialize(rect)
  {
    // perform original logic.
    super.initialize(rect);

    // initialize our properties.
    this.initMembers();

    // run our one-time setup and configuration.
    this.configure();

    // refresh the window for the first time.
    this.refresh();
  }

  /**
   * Initialize all properties of this class.
   */
  initMembers()
  {
    /**
     * The cached collection of hud sprites.
     * @type {Map<string, Sprite_Face|Sprite_MapGauge|Sprite_ActorValue|Sprite_Icon>}
     */
    this._hudSprites = new Map();
  }

  /**
   * Performs the one-time setup and configuration per instantiation.
   */
  configure()
  {
    // make the window's background opacity transparent.
    this.opacity = 0;

    // initialize the cache.
    this.refreshCache();
  }

  /**
   * Redraw all contents of the window.
   */
  refresh()
  {
    // clear the contents of the hud.
    this.contents.clear();

    // hide all the sprites.
    this.hideSprites();

    // draw the hud anew.
    this.drawHud();
  }

  /**
   * Hide all sprites for the hud.
   */
  hideSprites()
  {
    // hide all the sprites.
    this._hudSprites.forEach((sprite, _) =>
    {
      // when refreshing, always hide all the sprites.
      sprite.hide();

      // check if the sprite is a gauge.
      if (sprite instanceof Sprite_MapGauge)
      {
        // deactivate the gauge.
        sprite.deactivateGauge();
      }
    });
  }

  //region caching
  /**
   * Empties and recreates the entire cache of sprites.
   */
  refreshCache()
  {
    // destroy and empty all sprites within the cache.
    this.emptyCache();

    // recreate all sprites for the cache.
    this.createCache();
  }

  /**
   * Empties the cache of all sprites.
   */
  emptyCache()
  {
    // iterate over each sprite and destroy it properly.
    this._hudSprites.forEach((value, _) => value.destroy());

    // empty the collection of all references.
    this._hudSprites.clear();
  }

  /**
   * Creates all sprites for this hud and caches them.
   */
  createCache()
  {
    // establish the gauge types we will create.
    const gaugeTypes = this.gaugeTypes();

    // iterate over each of the battle members in the party.
    $gameParty.battleMembers()
      .forEach(actor =>
      {
        // cache the full-sized face images for each actor.
        this.getOrCreateFullSizeFaceSprite(actor);

        // cache the mini-sized face images for each actor.
        this.getOrCreateMiniSizeFaceSprite(actor);

        // for this actor, create all the gauges, too.
        gaugeTypes.forEach(gaugeType =>
        {
          // create the full-sized gauge sprite for this type.
          this.getOrCreateFullSizeGaugeSprite(actor, gaugeType);

          // create the mini-sized gauge sprite for this type.
          this.getOrCreateMiniSizeGaugeSprite(actor, gaugeType);

          // create the corresponding actor value sprite for this gauge.
          this.getOrCreateActorValueSprite(actor, gaugeType);
        });
      });
  }

  /**
   * Creates the key for an actor's face sprite based on the parameters.
   * @param {Game_Actor} actor The actor to create a key for.
   * @param {boolean} isFull Whether or not this is for a full-sized sprite.
   * @returns {string}
   */
  makeFaceSpriteKey(actor, isFull)
  {
    return isFull
      ? `face-full-${actor.name()}-${actor.actorId()}`
      : `face-mini-${actor.name()}-${actor.actorId()}`;
  }

  /**
   * Creates a full-sized face sprite for the given actor and caches it.
   * @param {Game_Actor} actor The actor to draw a full face sprite for.
   * @returns {Sprite_Face} The full face sprite of the actor.
   */
  getOrCreateFullSizeFaceSprite(actor)
  {
    // the key for this actor's full face sprite.
    const key = this.makeFaceSpriteKey(actor, true);

    // check if the key already maps to a cached sprite.
    if (this._hudSprites.has(key))
    {
      // if it does, just return that.
      return this._hudSprites.get(key);
    }

    // create a new full-sized face sprite of the actor.
    const sprite = new Sprite_Face(actor.faceName(), actor.faceIndex());

    // set the scale to a fixed 80%.
    sprite.scale.x = 1;
    sprite.scale.y = 1;

    // cache the sprite.
    this._hudSprites.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created full sprite.
    return sprite;
  }

  /**
   * Creates a mini-sized face sprite for the given actor and caches it.
   * @param {Game_Actor} actor The actor to draw a mini face sprite for.
   * @returns {Sprite_Face} The mini face sprite of the actor.
   */
  getOrCreateMiniSizeFaceSprite(actor)
  {
    // the key for this actor's full face sprite.
    const key = this.makeFaceSpriteKey(actor, false);

    // check if the key already maps to a cached sprite.
    if (this._hudSprites.has(key))
    {
      // if it does, just return that.
      return this._hudSprites.get(key);
    }

    // create a new full-sized face sprite of the actor.
    const sprite = new Sprite_Face(actor.faceName(), actor.faceIndex());

    // set the scale to a fixed 80%.
    sprite.scale.x = 0.3;
    sprite.scale.y = 0.3;

    // cache the sprite.
    this._hudSprites.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created mini sprite.
    return sprite;
  }

  /**
   * An array of all gauge types; for convenience.
   * @returns {string[]} The gauge types in a given order.
   */
  gaugeTypes()
  {
    return [
      Window_PartyFrame.gaugeTypes.HP,
      Window_PartyFrame.gaugeTypes.MP,
      Window_PartyFrame.gaugeTypes.TP,
      Window_PartyFrame.gaugeTypes.XP
    ];
  }

  /**
   * Creates the key for an actor's gauge sprite based on the parameters.
   * @param {Game_Actor} actor The actor to draw a full gauge sprite for.
   * @param {boolean} isFull Whether or not this is for a full-sized sprite.
   * @param {Window_PartyFrame.gaugeTypes} gaugeType The type of gauge this is.
   * @returns {string} The key for this gauge sprite.
   */
  makeGaugeSpriteKey(actor, isFull, gaugeType)
  {
    const gaugeSize = isFull
      ? `full`
      : `mini`;
    return `gauge-${gaugeType}-${gaugeSize}-${actor.name()}-${actor.actorId()}`;
  }

  /**
   * Determines the gauge height based on the gauge type.
   * @param {Window_PartyFrame.gaugeTypes} gaugeType The type of gauge we need height for.
   * @returns {number}
   */
  fullGaugeHeight(gaugeType)
  {
    switch (gaugeType)
    {
      case Window_PartyFrame.gaugeTypes.HP:
        return 18;
      case Window_PartyFrame.gaugeTypes.MP:
        return 14;
      case Window_PartyFrame.gaugeTypes.TP:
        return 10;
      case Window_PartyFrame.gaugeTypes.XP:
        return 8;
      default:
        throw new Error(`Please use a valid gauge type from the list.`);
    }
  }

  /**
   * Creates a full-sized gauge sprite for the given actor and caches it.
   * @param {Game_Actor} actor The actor to draw a gauge sprite for.
   * @param {Window_PartyFrame.gaugeTypes} gaugeType The type of gauge this is.
   * @returns {Sprite_MapGauge} The gauge sprite.
   */
  getOrCreateFullSizeGaugeSprite(actor, gaugeType)
  {
    // the key for this actor's full gauge sprite.
    const key = this.makeGaugeSpriteKey(actor, true, gaugeType);

    // check if the key already maps to a cached sprite.
    if (this._hudSprites.has(key))
    {
      // if it does, just return that.
      return this._hudSprites.get(key);
    }

    // gets the full-sized gauge height for this gauge type.
    const gaugeHeight = this.fullGaugeHeight(gaugeType);

    // determine gauge width based on gauge type.
    const gaugeWidth = gaugeType === Window_PartyFrame.gaugeTypes.XP
      ? 114
      : 144;

    // create a new full-sized gauge sprite of the actor.
    const sprite = new Sprite_MapGauge(gaugeWidth, gaugeHeight, 32);

    // setup the gauge sprite to point to the actor.
    sprite.setup(actor, gaugeType);

    // deactivate the gauge to prevent updating until its necessary.
    sprite.deactivateGauge();

    // cache the sprite.
    this._hudSprites.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Determines the gauge height based on the gauge type.
   * @param {Window_PartyFrame.gaugeTypes} gaugeType The type of gauge we need height for.
   * @returns {number}
   */
  miniGaugeHeight(gaugeType)
  {
    switch (gaugeType)
    {
      case Window_PartyFrame.gaugeTypes.HP:
        return 10;
      case Window_PartyFrame.gaugeTypes.MP:
        return 10;
      case Window_PartyFrame.gaugeTypes.TP:
        return 10;
      case Window_PartyFrame.gaugeTypes.XP:
        return 4;
      default:
        throw new Error(`Please use a valid gauge type from the list.`);
    }
  }

  /**
   * Creates a mini-sized gauge sprite for the given actor and caches it.
   * @param {Game_Actor} actor The actor to draw a gauge sprite for.
   * @param {Window_PartyFrame.gaugeTypes} gaugeType The type of gauge this is.
   * @returns {Sprite_MapGauge} The gauge sprite.
   */
  getOrCreateMiniSizeGaugeSprite(actor, gaugeType)
  {
    // the key for this actor's full gauge sprite.
    const key = this.makeGaugeSpriteKey(actor, false, gaugeType);

    // check if the key already maps to a cached sprite.
    if (this._hudSprites.has(key))
    {
      // if it does, just return that.
      return this._hudSprites.get(key);
    }

    // gets the mini-sized gauge height for this gauge type.
    const gaugeHeight = this.miniGaugeHeight(gaugeType);

    // determine gauge width based on gauge type.
    const gaugeWidth = gaugeType === Window_PartyFrame.gaugeTypes.XP
      ? 42
      : 96;

    // create a new mini-sized gauge sprite of the actor.
    const sprite = new Sprite_MapGauge(gaugeWidth, gaugeHeight, 24);

    // setup the gauge sprite to point to the actor.
    sprite.setup(actor, gaugeType);

    // deactivate the gauge to prevent updating until its necessary.
    sprite.deactivateGauge();

    // cache the sprite.
    this._hudSprites.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Creates the key for an actor's gauge value sprite based on the parameters.
   * @param {Game_Actor} actor The actor to draw a actor value sprite for.
   * @param {Window_PartyFrame.gaugeTypes} gaugeType The type of actor value this is.
   * @returns {string} The key for this actor value sprite.
   */
  makeValueSpriteKey(actor, gaugeType)
  {
    return `value-${gaugeType}-${actor.name()}-${actor.actorId()}`;
  }

  /**
   * Creates a actor value sprite for the given actor's gauge and caches it.
   *
   * It is important to note that there is no "mini" size of actor values!
   * Allies simply will not display the values, only gauges.
   * @param {Game_Actor} actor The actor to draw a gauge sprite for.
   * @param {Window_PartyFrame.gaugeTypes} gaugeType The type of gauge this is.
   * @returns {Sprite_MapGauge} The gauge sprite.
   */
  getOrCreateActorValueSprite(actor, gaugeType)
  {
    // the key for this actor's full face sprite.
    const key = this.makeValueSpriteKey(actor, gaugeType);

    // check if the key already maps to a cached sprite.
    if (this._hudSprites.has(key))
    {
      // if it does, just return that.
      return this._hudSprites.get(key);
    }

    // determine the font size based on the gauget ype.
    const valueFontSize = this.actorValueFontSize(gaugeType);

    // create a new full-sized face sprite of the actor.
    const sprite = new Sprite_ActorValue(actor, gaugeType, valueFontSize);

    // cache the sprite.
    this._hudSprites.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Determines the font size for the actor value based on the gauge type.
   * @param {Window_PartyFrame.gaugeTypes} gaugeType The type of actor value this is.
   * @returns {number}
   */
  actorValueFontSize(gaugeType)
  {
    switch (gaugeType)
    {
      case Window_PartyFrame.gaugeTypes.HP:
        return -4;
      case Window_PartyFrame.gaugeTypes.MP:
        return -6;
      case Window_PartyFrame.gaugeTypes.TP:
        return -10;
      case Window_PartyFrame.gaugeTypes.XP:
        return -6;
      case Window_PartyFrame.gaugeTypes.Level:
        return 2;
      default:
        throw new Error(`Please use a valid gauge type from the list.`);
    }
  }

  /**
   * Creates the key for an actor's state affliction.
   * @param {Game_Actor} actor The actor to draw a actor value sprite for.
   * @param {number} stateId The id of the state to generate a key for.
   * @returns {string} The key for this actor value sprite.
   */
  makeStateIconSpriteKey(actor, stateId)
  {
    return `state-${stateId}-${actor.name()}-${actor.actorId()}`;
  }

  /**
   * Creates an icon sprite for a given state.
   * @param {Game_Actor} actor The actor to draw a actor value sprite for.
   * @param {number} stateId The id of the state to generate a key for.
   * @returns {Sprite_Icon} The state icon sprite.
   */
  getOrCreateStateIcon(actor, stateId)
  {
    // the key for this actor's full face sprite.
    const key = this.makeStateIconSpriteKey(actor, stateId);

    // check if the key already maps to a cached sprite.
    if (this._hudSprites.has(key))
    {
      // if it does, just return that.
      return this._hudSprites.get(key);
    }

    // determine the font size based on the gauget ype.
    const stateIconIndex = actor.state(stateId).iconIndex;

    // create a new full-sized face sprite of the actor.
    const sprite = new Sprite_Icon(stateIconIndex);

    // cache the sprite.
    this._hudSprites.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Creates the key for an actor's state affliction.
   * @param {Game_Actor} actor The actor to draw a actor value sprite for.
   * @param {number} stateId The id of the state to generate a key for.
   * @returns {string} The key for this actor value sprite.
   */
  makeStateTimerSpriteKey(actor, stateId)
  {
    return `timer-${stateId}-${actor.name()}-${actor.actorId()}`;
  }

  /**
   * Creates the timer sprite for a given state.
   * @param {Game_Actor} actor The actor to draw the state data for.
   * @param {JABS_State} trackedState The tracked state data for this state.
   * @returns {Sprite_StateTimer} The state timer sprite.
   */
  getOrCreateStateTimer(actor, trackedState)
  {
    // the key for the sprite.
    const key = this.makeStateTimerSpriteKey(actor, trackedState.stateId);

    // check if the key already maps to a cached sprite.
    if (this._hudSprites.has(key))
    {
      // if it does, just return that.
      return this._hudSprites.get(key);
    }

    // create a new full-sized face sprite of the actor.
    const sprite = new Sprite_StateTimer(trackedState);

    // cache the sprite.
    this._hudSprites.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  //endregion caching

  /**
   * The per-frame update of this window.
   */
  update()
  {
    // perform original logic.
    super.update();

    // update our stuff.
    this.drawHud();
  }

  /**
   * Draws the contents of the HUD.
   */
  drawHud()
  {
    // if we cannot draw the hud, then do not.
    if (!$hudManager.canShowHud()) return;

    // handle the visibility of the hud for dynamic interferences.
    this.manageVisibility();

    // draw the leader data.
    const leaderX = 0;
    const leaderY = 0;
    this.drawLeader(leaderX, leaderY);

    // if we cannot draw your allies, then do not.
    if (!$hudManager.canShowAllies()) return;

    // draw all allies' data.
    const alliesY = this.height - ImageManager.faceHeight - (this.lineHeight() + 12);
    this.drawAllies(leaderX, alliesY);
  }

  //region visibility
  /**
   * Manages visibility for the hud.
   */
  manageVisibility()
  {
    // handle interference from the message window popping up.
    this.handleMessageWindowInterference();

    // check if the player is interfering with visibility.
    if (this.playerInterference())
    {
      // if so, adjust opacity accordingly.
      this.handlePlayerInterference();
    }
    // the player isn't interfering.
    else
    {
      // undo the opacity changes.
      this.revertInterferenceOpacity();
    }
  }

  /**
   * Close and open the window based on whether or not the message window is up.
   */
  handleMessageWindowInterference()
  {
    // check if the message window is up.
    if ($gameMessage.isBusy() || $gameMap.isEventRunning())
    {
      // check to make sure we haven't closed this window yet.
      if (!this.isClosed())
      {
        // hide all the sprites.
        this.hideSprites();

        // and close the window.
        this.close();
      }
    }
    // otherwise, the message window isn't there.
    else
    {
      // just open the window.
      this.open();
    }
  }

  /**
   * Determines whether or not the player is in the way (or near it) of this window.
   * @returns {boolean} True if the player is in the way, false otherwise.
   */
  playerInterference()
  {
    const playerX = $gamePlayer.screenX();
    const playerY = $gamePlayer.screenY();
    return (playerX < (this.width - 100)) && (playerY > (this.y + 200));
  }

  /**
   * Manages opacity for all sprites while the player is interfering with the visibility.
   */
  handlePlayerInterference()
  {
    this._hudSprites.forEach((sprite, _) =>
    {
      // if we are above 64, rapidly decrement by -15 until we get below 64.
      if (sprite.opacity > 64) sprite.opacity -= 15;
      // if we are below 64, increment by +1 until we get to 64.
      else if (sprite.opacity < 64) sprite.opacity += 1;
    });
  }

  /**
   * Reverts the opacity changes associated with the player getting in the way.
   */
  revertInterferenceOpacity()
  {
    this._hudSprites.forEach((sprite, _) =>
    {
      // if we are below 255, rapidly increment by +15 until we get to 255.
      if (sprite.opacity < 255) sprite.opacity += 15;
      // if we are above 255, set to 255.
      else if (sprite.opacity > 255) sprite.opacity = 255;
    });
  }

  //endregion visibility

  /**
   * Draw the leader's data for the HUD.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawLeader(x, y)
  {
    // if we don't have a leader, don't try to draw it!
    if (!$gameParty.leader()) return;

    // draw the face for the leader.
    const faceY = y + (this.height - ImageManager.faceHeight);
    this.drawLeaderFace(x, faceY);

    // render the resource gauges: hp/mp/tp.
    const gaugesX = x + ImageManager.faceWidth;
    const gaugeHeight = 16;
    const gaugesY = this.height - (gaugeHeight * 3);
    this.drawLeaderResourceGauges(gaugesX, gaugesY);

    // render the extraneous gauges: just experience.
    const extraneousX = x + 12;
    const extraneousY = faceY;
    this.drawLeaderExtraneousGauges(extraneousX, extraneousY);

    // draw states for the leader.
    const statesX = gaugesX;
    const statesY = gaugesY - (ImageManager.iconHeight * 2) - 24;
    this.drawStates(statesX, statesY);
  }

  /**
   * Draw the leader's face.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawLeaderFace(x, y)
  {
    // grab the leader of the party.
    const leader = $gameParty.leader();

    // grab and locate the sprite.
    const sprite = this.getOrCreateFullSizeFaceSprite(leader);
    sprite.move(x, y);
    sprite.show();
  }

  drawLeaderResourceGauges(x, y)
  {
    // grab the leader of the party.
    const leader = $gameParty.leader();

    // shorthand the line height variable.
    const lh = this.lineHeight();

    // locate the hp gauge.
    const hpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_PartyFrame.gaugeTypes.HP);
    hpGauge.activateGauge();
    hpGauge.move(x - 24, y);
    hpGauge.show();

    // locate the hp numbers.
    const hpNumbers = this.getOrCreateActorValueSprite(leader, Window_PartyFrame.gaugeTypes.HP);
    hpNumbers.move(x, y);
    hpNumbers.show();

    // grab and locate the sprite.
    const mpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_PartyFrame.gaugeTypes.MP);
    mpGauge.activateGauge();
    mpGauge.move(x - 24, y + lh - 2 - mpGauge.bitmapHeight());
    mpGauge.show();

    // locate the mp numbers.
    const mpNumbers = this.getOrCreateActorValueSprite(leader, Window_PartyFrame.gaugeTypes.MP);
    mpNumbers.move(x, y + 19);
    mpNumbers.show();

    // grab and locate the sprite.
    const tpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_PartyFrame.gaugeTypes.TP);
    tpGauge.activateGauge();
    tpGauge.move(x - 24, y + 46 - tpGauge.bitmapHeight());
    tpGauge.show();

    // locate the tp numbers.
    const tpNumbers = this.getOrCreateActorValueSprite(leader, Window_PartyFrame.gaugeTypes.TP);
    tpNumbers.move(x, y + 33);
    tpNumbers.show();
  }

  drawLeaderExtraneousGauges(x, y)
  {
    // grab the leader of the party.
    const leader = $gameParty.leader();

    // grab and locate the xp gauge.
    const xpY = y;
    const xpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_PartyFrame.gaugeTypes.XP);
    xpGauge.activateGauge();
    xpGauge.move(x + 5, xpY);
    xpGauge.show();

    // locate the xp numbers.
    const xpNumbers = this.getOrCreateActorValueSprite(leader, Window_PartyFrame.gaugeTypes.XP);
    xpNumbers.move(x, xpY);
    xpNumbers.show();

    // locate the level numbers.
    const levelNumbers = this.getOrCreateActorValueSprite(leader, Window_PartyFrame.gaugeTypes.Level);
    levelNumbers.move(x + 84, xpY);
    levelNumbers.show();
  }

  /**
   * Draw all states for the leader of the party.
   */
  drawStates(x, y)
  {
    // grab the leader.
    const leader = $gameParty.leader();

    // hide the expired states.
    this.hideExpiredStates(leader);

    // if we have no states, don't try to render them.
    if (!leader.states().length) return;

    // the states deal only applies to JABS, sorry!
    if (J.ABS)
    {
      // shorthand the leader's uuid for retrieving data.
      const uuid = leader.getUuid();

      // grab the positive and negative states for rendering.
      const positiveStates = $jabsEngine.getPositiveJabsStatesByUuid(uuid);
      const negativeStates = $jabsEngine.getNegativeJabsStatesByUuid(uuid);

      // iterate over all the negative states and draw them.
      negativeStates.forEach((negativeTrackedState, index) =>
      {
        // draw the negative state onto the hud.
        const negativeX = x + (index * (ImageManager.iconWidth + 2));
        const negativeY = y;
        this.drawState(leader, negativeTrackedState, negativeX, negativeY);
      });

      // iterate over all the positive states and draw them.
      positiveStates.forEach((positiveTrackedState, index) =>
      {
        // draw the positive state onto the hud.
        const positiveX = x + (index * (ImageManager.iconWidth + 2));
        const positiveY = y + (ImageManager.iconHeight + 8);
        this.drawState(leader, positiveTrackedState, positiveX, positiveY);
      });
    }
  }

  /**
   * Hides all expired states on the leader.
   * @param {Game_Actor} leader The actor to hide states for.
   */
  hideExpiredStates(leader)
  {
    // the states deal only applies to JABS, sorry!
    if (J.ABS)
    {
      // grab all of this battler's states.
      const jabsStates = $jabsEngine.getJabsStatesByUuid(leader.getUuid());

      // convert them to a proper array.
      const states = Array.from(jabsStates.values());

      // iterate over each state to hide them as-needed.
      states.forEach(state =>
      {
        // if the tracked state isn't expired, don't bother.
        if (!state.expired) return;

        // make the keys for the sprites in question.
        const iconKey = this.makeStateIconSpriteKey(leader, state.stateId);
        const timerKey = this.makeStateTimerSpriteKey(leader, state.stateId);

        // skip trying if they don't exist.
        if (!this._hudSprites.has(iconKey) || !this._hudSprites.has(timerKey)) return;

        // get the sprites in question.
        const iconSprite = this._hudSprites.get(iconKey);
        const timerSprite = this._hudSprites.get(timerKey);

        // hide the sprites.
        iconSprite.hide();
        timerSprite.hide();
      });

      this.clearContent();
    }
  }

  /**
   * Draws a single state onto the hud.
   * @param {Game_Actor} actor The actor to draw the state for.
   * @param {JABS_State} trackedState The state afflicted on the character to draw.
   * @param {number} ox The origin x coordinate.
   * @param {number} y The y coordinate.
   */
  drawState(actor, trackedState, ox, y)
  {
    const iconSprite = this.getOrCreateStateIcon(actor, trackedState.stateId);
    iconSprite.move(ox, y);
    iconSprite.show();

    const timerSprite = this.getOrCreateStateTimer(actor, trackedState);
    timerSprite.move(ox - 4, y + 20);
    timerSprite.show();

    this.modFontSize(-0);
    this.toggleBold();
    this.toggleItalics();

    this.drawText(
      `x${trackedState.stackCount}`,
      ox ,
      y - 30,
      64,
      Window_Base.TextAlignments.Left);

    this.resetFontSettings()
  }

  /**
   * Draw all allies data for the hud.
   * @param {number} x The x coordinate.
   * @param {number} oy The origin y coordinate.
   */
  drawAllies(x, oy)
  {
    // grab the line height for re-use.
    const lh = this.lineHeight() + 26;

    // iterate over each ally.
    $gameParty.battleMembers()
      .forEach((ally, index) =>
      {
        // the leader is always index 0, and they are being drawn separately.
        if (index === 0) return;

        const adjustedIndex = index - 1;

        // draw the ally at the designated coordinates.
        const y = oy - (lh * adjustedIndex);
        this.drawAlly(ally, x, y);
      });
  }

  /**
   * Draws a single ally's data for the hud.
   * @param {Game_Actor} ally The ally to draw.
   * @param {number} x The x coordinate.
   * @param {number} oy The origin y coordinate.
   */
  drawAlly(ally, x, oy)
  {
    // draw the ally's mini face.
    this.drawAllyFace(ally, x, oy);

    // draw the ally's mini gauges.
    this.drawAllyGauges(ally, x + 40, oy + 6);
  }

  /**
   * Draws a single ally's mini face for the hud.
   * @param {Game_Actor} ally The ally to draw the face of.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawAllyFace(ally, x, y)
  {
    // grab and locate the sprite.
    const sprite = this.getOrCreateMiniSizeFaceSprite(ally);
    sprite.move(x, y);
    sprite.show();
  }

  /**
   * Draws a single ally's mini gauges.
   * @param {Game_Actor} ally The ally to draw the gauges for.
   * @param {number} x The x coordinate.
   * @param {number} oy The original y coordinate.
   */
  drawAllyGauges(ally, x, oy)
  {
    // shorthand the line height variable.
    const lh = 12;

    // locate the hp gauge.
    const hpGauge = this.getOrCreateMiniSizeGaugeSprite(ally, Window_PartyFrame.gaugeTypes.HP);
    hpGauge.activateGauge();
    hpGauge.move(x - 24, oy + lh * 0);
    hpGauge.show();

    // grab and locate the sprite.
    const mpGauge = this.getOrCreateMiniSizeGaugeSprite(ally, Window_PartyFrame.gaugeTypes.MP);
    mpGauge.activateGauge();
    mpGauge.move(x - 24, oy + lh * 1);
    mpGauge.show();

    // grab and locate the sprite.
    const tpGauge = this.getOrCreateMiniSizeGaugeSprite(ally, Window_PartyFrame.gaugeTypes.TP);
    tpGauge.activateGauge();
    tpGauge.move(x - 24, oy + lh * 2);
    tpGauge.show();
  }
}

//endregion Window_PartyFrame