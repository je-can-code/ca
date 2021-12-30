//#region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0 HUD] A default HUD, designed for JABS.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @orderAfter J-BASE
 * @help
 * ============================================================================
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//#region version checks
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
//#endregion version check

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.HUD2 = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.HUD2.Metadata = {};
J.HUD2.Metadata.Version = '1.0.0';
J.HUD2.Metadata.Name = `J-HUD2`;

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.HUD2.PluginParameters = PluginManager.parameters(`J-HUD2`);

/**
 * A collection of all aliased methods for this plugin.
 */
J.HUD2.Aliased = {
  Scene_Map: new Map(),
};
//#endregion introduction

/**
 * Hooks into `initialize` to add our hud.
 */
J.HUD2.Aliased.Scene_Map.set('initialize', Scene_Map.prototype.initialize);
Scene_Map.prototype.initialize = function()
{
  // perform original logic.
  J.HUD2.Aliased.Scene_Map.get('initialize').call(this);

  /**
   * All encompassing _j object for storing this plugin's properties.
   * @type {{}}
   * @private
   */
  this._j ||= {};

  /**
   * The log window on the map.
   * @type {Window_Hud2}
   */
  this._j._hud2 = null;
};

/**
 * Once the map is loaded, create the text log.
 */
J.HUD2.Aliased.Scene_Map.set('createAllWindows', Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function()
{
  // perform original logic.
  J.HUD2.Aliased.Scene_Map.get('createAllWindows').call(this);

  // create the log.
  this.createMapHud();
};

/**
 * Creates the log window and adds it to tracking.
 */
Scene_Map.prototype.createMapHud = function()
{
  // create the rectangle of the window.
  const rect = this.mapHudWindowRect();

  // assign the window to our reference.
  this._j._hud2 = new Window_Hud2(rect);

  // add window to tracking.
  this.addWindow(this._j._hud2);
};

/**
 * Creates the rectangle representing the window for the map hud.
 * @returns {Rectangle}
 */
Scene_Map.prototype.mapHudWindowRect = function()
{
  const width = 320;
  const height = 184;
  const x = 0;
  const y = 0;
  //const x = (Graphics.boxWidth / 2) - 160;
  //const y = Graphics.boxHeight - height;
  return new Rectangle(x, y, width, height);
};

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
Scene_Map.prototype.refreshHud = function()
{
  this._j._hud.refresh();
  this._j._hud2.refresh();
};

/**
 * A window containing the HUD data for the map.
 */
class Window_Hud2 extends Window_Base
{
  /**
   * The static collection of gauge types supported.
   * @type {{MP: string, HP: string, TP: string, XP: string}}
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
  };

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

    // initialize the cache.
    this.refreshCache();

    // refresh the window for the first time.
    this.refresh();
  };

  /**
   * Initialize all properties of this class.
   */
  initMembers()
  {
    /**
     * The cached collection of hud sprites.
     * @type {Map<string, Sprite_Face|Sprite_MapGauge|Sprite_ActorValue>}
     */
    this._hudSprites = new Map();
  };

  /**
   * Performs the one-time setup and configuration per instantiation.
   */
  configure()
  {
    // make the window's background opacity transparent.
    this.opacity = 0;
  };

  /**
   * Redraw all contents of the window.
   */
  refresh()
  {
    // clear the contents of the hud.
    this.contents.clear();

    // hide all the sprites.
    this._hudSprites.forEach((sprite, _) => sprite.hide());

    // draw the hud anew.
    this.drawHud();
  };

  //#region caching
  /**
   * Empties and recreates the entire cache of sprites.
   */
  refreshCache()
  {
    // destroy and empty all sprites within the cache.
    this.emptyCache();

    // recreate all sprites for the cache.
    this.createCache();
  };

  /**
   * Empties the cache of all sprites.
   */
  emptyCache()
  {
    // iterate over each sprite and destroy it properly.
    this._hudSprites.forEach((value, _) => value.destroy());

    // empty the collection of all references.
    this._hudSprites.clear();
  };

  /**
   * Recreates any missing sprites in the cache.
   */
  createCache()
  {
    // establish the gauge types we will create.
    const gaugeTypes = this.gaugeTypes();

    // iterate over each of the battle members in the party.
    $gameParty.battleMembers().forEach(actor =>
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
  };

  /**
   * Creates the key for an actor's face sprite based on the parameters.
   * @param {Game_Actor} actor The actor to create a key for.
   * @param {boolean} isFull Whether or not this is for a full-sized sprite.
   */
  makeFaceSpriteKey(actor, isFull)
  {
    return isFull
      ? `face-full-${actor.name()}-${actor.actorId()}`
      : `face-mini-${actor.name()}-${actor.actorId()}`;
  };

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
    sprite.scale.x = 0.8;
    sprite.scale.y = 0.8;

    // cache the sprite.
    this._hudSprites.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created full sprite.
    return sprite;
  };

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
  };

  /**
   * An array of all gauge types; for convenience.
   * @returns {string[]} The gauge types in a given order.
   */
  gaugeTypes()
  {
    return [
      Window_Hud2.gaugeTypes.HP,
      Window_Hud2.gaugeTypes.MP,
      Window_Hud2.gaugeTypes.TP,
      Window_Hud2.gaugeTypes.XP
    ];
  };

  /**
   * Creates the key for an actor's gauge sprite based on the parameters.
   * @param {Game_Actor} actor The actor to draw a full gauge sprite for.
   * @param {boolean} isFull Whether or not this is for a full-sized sprite.
   * @param {Window_Hud2.gaugeTypes} gaugeType The type of gauge this is.
   * @returns {string} The key for this gauge sprite.
   */
  makeGaugeSpriteKey(actor, isFull, gaugeType)
  {
    const gaugeSize = isFull ? `full` : `mini`;
    return `gauge-${gaugeType}-${gaugeSize}-${actor.name()}-${actor.actorId()}`;
  };

  /**
   * Determines the gauge height based on the gauge type.
   * @param {Window_Hud2.gaugeTypes} gaugeType The type of gauge we need height for.
   * @returns {number}
   */
  fullGaugeHeight(gaugeType)
  {
    switch (gaugeType)
    {
      case Window_Hud2.gaugeTypes.HP:
        return 18;
      case Window_Hud2.gaugeTypes.MP:
        return 14;
      case Window_Hud2.gaugeTypes.TP:
        return 10;
      case Window_Hud2.gaugeTypes.XP:
        return 8;
      default:
        throw new Error(`Please use a valid gauge type from the list.`);
    }
  };

  /**
   * Creates a full-sized gauge sprite for the given actor and caches it.
   * @param {Game_Actor} actor The actor to draw a gauge sprite for.
   * @param {Window_Hud2.gaugeTypes} gaugeType The type of gauge this is.
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
    const gaugeWidth = gaugeType === Window_Hud2.gaugeTypes.XP ? 114 : 144;

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
  };

  /**
   * Determines the gauge height based on the gauge type.
   * @param {Window_Hud2.gaugeTypes} gaugeType The type of gauge we need height for.
   * @returns {number}
   */
  miniGaugeHeight(gaugeType)
  {
    switch (gaugeType)
    {
      case Window_Hud2.gaugeTypes.HP:
        return 10;
      case Window_Hud2.gaugeTypes.MP:
        return 10;
      case Window_Hud2.gaugeTypes.TP:
        return 10;
      case Window_Hud2.gaugeTypes.XP:
        return 4;
      default:
        throw new Error(`Please use a valid gauge type from the list.`);
    }
  };

  /**
   * Creates a mini-sized gauge sprite for the given actor and caches it.
   * @param {Game_Actor} actor The actor to draw a gauge sprite for.
   * @param {Window_Hud2.gaugeTypes} gaugeType The type of gauge this is.
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
    const gaugeWidth = gaugeType === Window_Hud2.gaugeTypes.XP ? 42 : 96;

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
  };

  /**
   * Creates the key for an actor's gauge value sprite based on the parameters.
   * @param {Game_Actor} actor The actor to draw a actor value sprite for.
   * @param {Window_Hud2.gaugeTypes} gaugeType The type of actor value this is.
   * @returns {string} The key for this actor value sprite.
   */
  makeValueSpriteKey(actor, gaugeType)
  {
    return `value-${gaugeType}-${actor.name()}-${actor.actorId()}`;
  };

  /**
   * Creates a actor value sprite for the given actor's gauge and caches it.
   *
   * It is important to note that there is no "mini" size of actor values!
   * Allies simply will not display the values, only gauges.
   * @param {Game_Actor} actor The actor to draw a gauge sprite for.
   * @param {Window_Hud2.gaugeTypes} gaugeType The type of gauge this is.
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
  };

  /**
   * Determines the font size for the actor value based on the gauge type.
   * @param {Window_Hud2.gaugeTypes} gaugeType The type of actor value this is.
   * @returns {number}
   */
  actorValueFontSize(gaugeType)
  {
    switch (gaugeType)
    {
      case Window_Hud2.gaugeTypes.HP:
        return -10;
      case Window_Hud2.gaugeTypes.MP:
        return -12;
      case Window_Hud2.gaugeTypes.TP:
        return -14;
      case Window_Hud2.gaugeTypes.XP:
        return -12;
      case Window_Hud2.gaugeTypes.Level:
        return -6;
      default:
        throw new Error(`Please use a valid gauge type from the list.`);
    }
  };
  //#endregion caching

  /**
   * The per-frame update of this window.
   */
  update()
  {
    // perform original logic.
    super.update();

    // update our stuff.
    this.drawHud();
  };

  /**
   * Draws the contents of the HUD.
   */
  drawHud()
  {
    // draw the leader data.
    this.drawLeader(8, 8);

    // draw all allies' data.
    this.drawAllies(136, 8);
  };

  /**
   * Draw the leader's data for the HUD.
   */
  drawLeader(x, y)
  {
    // draw the face for the leader.
    this.drawLeaderFace(x, y);

    // draw the gauges for the leader.
    this.drawLeaderGauges(x, y+120);
  };

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
  };

  drawLeaderGauges(x, oy)
  {
    // grab the leader of the party.
    const leader = $gameParty.leader();

    // shorthand the line height variable.
    const lh = this.lineHeight();

    // locate the hp gauge.
    const hpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_Hud2.gaugeTypes.HP);
    hpGauge.activateGauge();
    hpGauge.move(x-24, oy);
    hpGauge.show();

    // locate the hp numbers.
    const hpNumbers = this.getOrCreateActorValueSprite(leader, Window_Hud2.gaugeTypes.HP);
    hpNumbers.move(x, oy);
    hpNumbers.show();

    // grab and locate the sprite.
    const mpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_Hud2.gaugeTypes.MP);
    mpGauge.activateGauge();
    mpGauge.move(x-24, oy + lh-2 - mpGauge.bitmapHeight());
    mpGauge.show();

    // locate the mp numbers.
    const mpNumbers = this.getOrCreateActorValueSprite(leader, Window_Hud2.gaugeTypes.MP);
    mpNumbers.move(x, oy+19);
    mpNumbers.show();

    // grab and locate the sprite.
    const tpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_Hud2.gaugeTypes.TP);
    tpGauge.activateGauge();
    tpGauge.move(x-24, oy+46-tpGauge.bitmapHeight());
    tpGauge.show();

    // locate the tp numbers.
    const tpNumbers = this.getOrCreateActorValueSprite(leader, Window_Hud2.gaugeTypes.TP);
    tpNumbers.move(x, oy+33);
    tpNumbers.show();

    // grab and locate the xp gauge.
    const xpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_Hud2.gaugeTypes.XP);
    xpGauge.activateGauge();
    xpGauge.move(x+5, 8);
    xpGauge.show();

    // locate the xp numbers.
    const xpNumbers = this.getOrCreateActorValueSprite(leader, Window_Hud2.gaugeTypes.XP);
    xpNumbers.move(x, 8);
    xpNumbers.show();

    // locate the level numbers.
    const levelNumbers = this.getOrCreateActorValueSprite(leader, Window_Hud2.gaugeTypes.Level);
    levelNumbers.move(x+84, oy-24);
    levelNumbers.show();
  };

  drawAllies(x, oy)
  {
    // grab the line height for re-use.
    const lh = this.lineHeight() + 26;

    // iterate over each ally.
    $gameParty.battleMembers().forEach((ally, index) =>
    {
      // the leader is always index 0, and they are being drawn separately.
      if (index === 0) return;

      // draw the ally at the designated coordinates.
      const y = oy + lh*(index-1);
      this.drawAlly(ally, x, y);
    });
  };

  drawAlly(ally, x, oy)
  {
    this.drawAllyFace(ally, x, oy);

    this.drawAllyGauges(ally, x+40, oy+6);
  };

  drawAllyFace(ally, x, y)
  {
    // grab and locate the sprite.
    const sprite = this.getOrCreateMiniSizeFaceSprite(ally);
    sprite.move(x, y);
    sprite.show();
  };

  drawAllyGauges(ally, x, oy)
  {
    // shorthand the line height variable.
    const lh = 12;

    // locate the hp gauge.
    const hpGauge = this.getOrCreateMiniSizeGaugeSprite(ally, Window_Hud2.gaugeTypes.HP);
    hpGauge.activateGauge();
    hpGauge.move(x-24, oy + lh*0);
    hpGauge.show();

    // grab and locate the sprite.
    const mpGauge = this.getOrCreateMiniSizeGaugeSprite(ally, Window_Hud2.gaugeTypes.MP);
    mpGauge.activateGauge();
    mpGauge.move(x-24, oy + lh*1);
    mpGauge.show();

    // grab and locate the sprite.
    const tpGauge = this.getOrCreateMiniSizeGaugeSprite(ally, Window_Hud2.gaugeTypes.TP);
    tpGauge.activateGauge();
    tpGauge.move(x-24, oy + lh*2);
    tpGauge.show();
  };
}
if (!J.HUD)
{
//#region Sprite objects
//#region Sprite_StateTimer
  /**
   * A sprite that displays some static text.
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
//#endregion Sprite_StateTimer

//#region Sprite_ActorValue
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
//#endregion Sprite_ActorValue
//#endregion Sprite objects
}
//ENDOFFILE