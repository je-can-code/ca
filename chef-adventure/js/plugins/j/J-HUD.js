//#region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v2.0 HUD] A generic hud for the map; designed for JABS.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @orderAfter J-BASE
 * @command hideHud
 * @text Hide HUD
 * @desc Hides the HUD on the map.
 *
 * @command showHud
 * @text Show HUD
 * @desc Shows the HUD on the map.
 *
 * @command hideAllies
 * @text Hide Allies
 * @desc Hides the display of allies in the hud.
 *
 * @command showAllies
 * @text Show Allies
 * @desc Shows allies' data in the hud.
 *
 * @command refreshHud
 * @text Refresh HUD
 * @desc Forcefully refreshes the hud.
 *
 * @command refreshImageCache
 * @text Refresh HUD Image Cache
 * @desc Forcefully refreshes the image cache of the hud. Use when you change face assets for actors.
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

//#region metadata
/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.HUD = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.HUD.Metadata = {};
J.HUD.Metadata.Version = '2.0.0';
J.HUD.Metadata.Name = `J-HUD`;

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.HUD.PluginParameters = PluginManager.parameters(`J-HUD2`);

/**
 * A collection of all aliased methods for this plugin.
 */
J.HUD.Aliased = {
  Game_System: new Map(),
  Scene_Map: new Map(),
  DataManager: new Map(),
};
//#endregion metadata

//#endregion introduction

//#region plugin commands
/**
 * Plugin command for hiding the hud.
 */
PluginManager.registerCommand(J.HUD.Metadata.Name, "hideHud", () =>
{
  $hudManager.requestHideHud();
});

/**
 * Plugin command for showing the hud.
 */
PluginManager.registerCommand(J.HUD.Metadata.Name, "showHud", () =>
{
  $hudManager.requestShowHud();
});

/**
 * Plugin command for hiding allies in the hud.
 */
PluginManager.registerCommand(J.HUD.Metadata.Name, "hideAllies", () =>
{
  $hudManager.requestHideAllies();
});

/**
 * Plugin command for showing allies in the hud.
 */
PluginManager.registerCommand(J.HUD.Metadata.Name, "showAllies", () =>
{
  $hudManager.requestShowAllies();
});

/**
 * Plugin command for refreshing the hud.
 */
PluginManager.registerCommand(J.HUD.Metadata.Name, "refreshHud", () =>
{
  $hudManager.requestRefreshHud();
});

/**
 * Plugin command for refreshing the hud's image cache.
 */
PluginManager.registerCommand(J.HUD.Metadata.Name, "refreshImageCache", () =>
{
  $hudManager.requestRefreshImageCache();
});
//#endregion plugin commands

/**
 * A global object for managing the hud.
 * @global
 * @type {Hud_Manager}
 */
var $hudManager = null;

//#region Static objects
//#region DataManager
/**
 * Instantiates the hud manager after the rest of the objects are created.
 */
J.HUD.Aliased.DataManager.set('createGameObjects', DataManager.createGameObjects);
DataManager.createGameObjects = function()
{
  // perform original logic.
  J.HUD.Aliased.DataManager.get('createGameObjects').call(this);

  // create the global hud manager object.
  $hudManager = new Hud_Manager();
};

J.HUD.Aliased.DataManager.set('extractSaveContents', DataManager.extractSaveContents);
DataManager.extractSaveContents = function(contents)
{
  // perform original logic.
  J.HUD.Aliased.DataManager.get('extractSaveContents').call(this, contents);

  // setup the hud now that we know we have the save contents available.
  $hudManager.setup();
};

J.HUD.Aliased.DataManager.set('setupNewGame', DataManager.setupNewGame);
DataManager.setupNewGame = function()
{
  // perform original logic.
  J.HUD.Aliased.DataManager.get('setupNewGame').call(this);

  // setup the hud now that we know we have the save contents available.
  $hudManager.setup();
};
//#endregion DataManager
//#endregion Static objects

//#region Game objects
//#region Game_System
/**
 * Extends the `initialize()` to include our hud data for remembering.
 */
J.HUD.Aliased.Game_System.set('initialize', Game_System.prototype.initialize);
Game_System.prototype.initialize = function()
{
  // perform original logic.
  J.HUD.Aliased.Game_System.get('initialize').call(this);
  this._j ||= {};
  this._j._hud ||= {
    _hudVisible: true,
    _alliesVisible: true,
  };
};

/**
 * Remembers the setting of hud visibility.
 * @param {boolean} visible True if the hud is visible, false otherwise.
 */
Game_System.prototype.setHudVisible = function(visible)
{
  this._j._hud._hudVisible = visible;
};

/**
 * Gets whether or not the hud was last identified as visible.
 * @returns {boolean} True if it was visible, false otherwise.
 */
Game_System.prototype.getHudVisible = function()
{
  return this._j._hud._hudVisible;
};

/**
 * Remembers the setting of the hud's allies' visibility.
 * @param {boolean} visible True if the hud's allies' are visible, false otherwise.
 */
Game_System.prototype.setHudAlliesVisible = function(visible)
{
  this._j._hud._alliesVisible = visible;
};

/**
 * Gets whether or not the hud's allies were last identified as visible.
 * @returns {boolean} True if they were visible, false otherwise.
 */
Game_System.prototype.getHudAlliesVisible = function()
{
  return this._j._hud._alliesVisible;
};
//#endregion Game_System
//#endregion Game objects

//#region Scene objects
//#region Scene_Map
/**
 * Hooks into `initialize` to add our hud.
 */
J.HUD.Aliased.Scene_Map.set('initialize', Scene_Map.prototype.initialize);
Scene_Map.prototype.initialize = function()
{
  // perform original logic.
  J.HUD.Aliased.Scene_Map.get('initialize').call(this);

  /**
   * All encompassing _j object for storing this plugin's properties.
   * @type {{}}
   * @private
   */
  this._j ||= {};

  /**
   * The log window on the map.
   * @type {Window_Hud}
   */
  this._j._hud = null;
};

/**
 * Once the map is loaded, create the text log.
 */
J.HUD.Aliased.Scene_Map.set('createAllWindows', Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function()
{
  // perform original logic.
  J.HUD.Aliased.Scene_Map.get('createAllWindows').call(this);

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
  this._j._hud = new Window_Hud(rect);

  // add window to tracking.
  this.addWindow(this._j._hud);
};

/**
 * Creates the rectangle representing the window for the map hud.
 * @returns {Rectangle}
 */
Scene_Map.prototype.mapHudWindowRect = function()
{
  const width = 320;
  const height = 290;
  const x = 0;
  const y = 0;
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
};

/**
 * Extends the `update()` function to also monitor updates for the hud.
 */
J.HUD.Aliased.Scene_Map.set('update', Scene_Map.prototype.update);
Scene_Map.prototype.update = function()
{
  // perform original logic.
  J.HUD.Aliased.Scene_Map.get('update').call(this);

  // listen for changes to the hud display.
  this.updateHud();
};

/**
 * The update loop for the hud manager.
 */
Scene_Map.prototype.updateHud = function()
{
  // the update loop for the hud manager.
  $hudManager.update();

  // manages hud refreshes.
  this.handleRefreshHud();

  // manages hud image cache refreshes.
  this.handleRefreshHudImageCache();
};

/**
 * Handles incoming requests to refresh the hud.
 */
Scene_Map.prototype.handleRefreshHud = function()
{
  // handles incoming requests to refresh the hud.
  if ($hudManager.hasRequestRefreshHud())
  {
    // refresh the hud.
    this._j._hud.refresh();

    // let the hud manager know we've done the deed.
    $hudManager.acknowledgeRefreshHud();
  }
};

/**
 * Handles incoming requests to refresh the hud's image cache.
 */
Scene_Map.prototype.handleRefreshHudImageCache = function()
{
  // handles incoming requests to refresh the hud.
  if ($hudManager.hasRequestRefreshImageCache())
  {
    // refresh the hud's image cache.
    this._j._hud.refreshCache();

    // and then refresh the hud with the new refreshed assets.
    this._j._hud.refresh();

    // let the hud manager know we've done the deed.
    $hudManager.acknowledgeRefreshImageCache();
  }
};
//#endregion Scene_Map
//#endregion Scene objects

//#region Window objects
//#region Window_Hud
/**
 * A window containing the HUD data for the map.
 */
class Window_Hud extends Window_Base
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
   * Whether or not the player is in the way of the hud.
   * While the player is in the way, the opacity is reduced.
   * @type {boolean}
   * @private
   */
  #playerInterference = false;

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
     * @type {Map<string, Sprite_Face|Sprite_MapGauge|Sprite_ActorValue|Sprite_Icon>}
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

    // initialize the cache.
    this.refreshCache();
  };

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
  };

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
      Window_Hud.gaugeTypes.HP,
      Window_Hud.gaugeTypes.MP,
      Window_Hud.gaugeTypes.TP,
      Window_Hud.gaugeTypes.XP
    ];
  };

  /**
   * Creates the key for an actor's gauge sprite based on the parameters.
   * @param {Game_Actor} actor The actor to draw a full gauge sprite for.
   * @param {boolean} isFull Whether or not this is for a full-sized sprite.
   * @param {Window_Hud.gaugeTypes} gaugeType The type of gauge this is.
   * @returns {string} The key for this gauge sprite.
   */
  makeGaugeSpriteKey(actor, isFull, gaugeType)
  {
    const gaugeSize = isFull ? `full` : `mini`;
    return `gauge-${gaugeType}-${gaugeSize}-${actor.name()}-${actor.actorId()}`;
  };

  /**
   * Determines the gauge height based on the gauge type.
   * @param {Window_Hud.gaugeTypes} gaugeType The type of gauge we need height for.
   * @returns {number}
   */
  fullGaugeHeight(gaugeType)
  {
    switch (gaugeType)
    {
      case Window_Hud.gaugeTypes.HP:
        return 18;
      case Window_Hud.gaugeTypes.MP:
        return 14;
      case Window_Hud.gaugeTypes.TP:
        return 10;
      case Window_Hud.gaugeTypes.XP:
        return 8;
      default:
        throw new Error(`Please use a valid gauge type from the list.`);
    }
  };

  /**
   * Creates a full-sized gauge sprite for the given actor and caches it.
   * @param {Game_Actor} actor The actor to draw a gauge sprite for.
   * @param {Window_Hud.gaugeTypes} gaugeType The type of gauge this is.
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
    const gaugeWidth = gaugeType === Window_Hud.gaugeTypes.XP ? 114 : 144;

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
   * @param {Window_Hud.gaugeTypes} gaugeType The type of gauge we need height for.
   * @returns {number}
   */
  miniGaugeHeight(gaugeType)
  {
    switch (gaugeType)
    {
      case Window_Hud.gaugeTypes.HP:
        return 10;
      case Window_Hud.gaugeTypes.MP:
        return 10;
      case Window_Hud.gaugeTypes.TP:
        return 10;
      case Window_Hud.gaugeTypes.XP:
        return 4;
      default:
        throw new Error(`Please use a valid gauge type from the list.`);
    }
  };

  /**
   * Creates a mini-sized gauge sprite for the given actor and caches it.
   * @param {Game_Actor} actor The actor to draw a gauge sprite for.
   * @param {Window_Hud.gaugeTypes} gaugeType The type of gauge this is.
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
    const gaugeWidth = gaugeType === Window_Hud.gaugeTypes.XP ? 42 : 96;

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
   * @param {Window_Hud.gaugeTypes} gaugeType The type of actor value this is.
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
   * @param {Window_Hud.gaugeTypes} gaugeType The type of gauge this is.
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
   * @param {Window_Hud.gaugeTypes} gaugeType The type of actor value this is.
   * @returns {number}
   */
  actorValueFontSize(gaugeType)
  {
    switch (gaugeType)
    {
      case Window_Hud.gaugeTypes.HP:
        return -10;
      case Window_Hud.gaugeTypes.MP:
        return -12;
      case Window_Hud.gaugeTypes.TP:
        return -14;
      case Window_Hud.gaugeTypes.XP:
        return -12;
      case Window_Hud.gaugeTypes.Level:
        return -6;
      default:
        throw new Error(`Please use a valid gauge type from the list.`);
    }
  };

  /**
   * Creates the key for an actor's state affliction.
   * @param {Game_Actor} actor The actor to draw a actor value sprite for.
   * @param {number} stateId The id of the state to generate a key for.
   * @returns {string} The key for this actor value sprite.
   */
  makeStateIconSpriteKey(actor, stateId)
  {
    return `state-${stateId}-${actor.name()}-${actor.actorId()}`;
  };

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
  };

  /**
   * Creates the key for an actor's state affliction.
   * @param {Game_Actor} actor The actor to draw a actor value sprite for.
   * @param {number} stateId The id of the state to generate a key for.
   * @returns {string} The key for this actor value sprite.
   */
  makeStateTimerSpriteKey(actor, stateId)
  {
    return `timer-${stateId}-${actor.name()}-${actor.actorId()}`;
  };

  /**
   * Creates the timer sprite for a given state.
   * @param {Game_Actor} actor The actor to draw the state data for.
   * @param {JABS_TrackedState} trackedState The tracked state data for this state.
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
    // if we cannot draw the hud, then do not.
    if (!$hudManager.canShowHud()) return;

    // handle the visibility of the hud for dynamic interferences.
    this.manageVisibility();

    // draw the leader data.
    this.drawLeader(8, 8);

    // if we cannot draw your allies, then do not.
    if (!$hudManager.canShowAllies()) return;

    // draw all allies' data.
    this.drawAllies(136, 8);
  };

  //#region visibility
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
  };

  /**
   * Close and open the window based on whether or not the message window is up.
   */
  handleMessageWindowInterference()
  {
    // check if the message window is up.
    if ($gameMessage.isBusy())
    {
      // check to make sure we haven't closed this window yet.
      if (!this.isClosed())
      {
        // hide all the sprites.
        this.hideSprites();
      }

      // and close the window.
      this.close();
    }
    // otherwise, the message window isn't there.
    else
    {
      // just open the window.
      this.open();
    }
  };

  /**
   * Determines whether or not the player is in the way (or near it) of this window.
   * @returns {boolean} True if the player is in the way, false otherwise.
   */
  playerInterference()
  {
    const playerX = $gamePlayer.screenX();
    const playerY = $gamePlayer.screenY();
    return (playerX < this.width+100) && (playerY < this.height+100);
  };

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
  };

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
  };
  //#endregion visibility

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
    this.drawLeaderFace(x, y);

    // draw the gauges for the leader.
    this.drawLeaderGauges(x, y+120);

    // draw states for the leader.
    this.drawStates();
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

  /**
   * Draws all gauges for the leader into the hud.
   * @param {number} x The x coordinate.
   * @param {number} oy The origin y coordinate.
   */
  drawLeaderGauges(x, oy)
  {
    // grab the leader of the party.
    const leader = $gameParty.leader();

    // shorthand the line height variable.
    const lh = this.lineHeight();

    // locate the hp gauge.
    const hpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_Hud.gaugeTypes.HP);
    hpGauge.activateGauge();
    hpGauge.move(x-24, oy);
    hpGauge.show();

    // locate the hp numbers.
    const hpNumbers = this.getOrCreateActorValueSprite(leader, Window_Hud.gaugeTypes.HP);
    hpNumbers.move(x, oy);
    hpNumbers.show();

    // grab and locate the sprite.
    const mpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_Hud.gaugeTypes.MP);
    mpGauge.activateGauge();
    mpGauge.move(x-24, oy + lh-2 - mpGauge.bitmapHeight());
    mpGauge.show();

    // locate the mp numbers.
    const mpNumbers = this.getOrCreateActorValueSprite(leader, Window_Hud.gaugeTypes.MP);
    mpNumbers.move(x, oy+19);
    mpNumbers.show();

    // grab and locate the sprite.
    const tpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_Hud.gaugeTypes.TP);
    tpGauge.activateGauge();
    tpGauge.move(x-24, oy+46-tpGauge.bitmapHeight());
    tpGauge.show();

    // locate the tp numbers.
    const tpNumbers = this.getOrCreateActorValueSprite(leader, Window_Hud.gaugeTypes.TP);
    tpNumbers.move(x, oy+33);
    tpNumbers.show();

    // grab and locate the xp gauge.
    const xpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_Hud.gaugeTypes.XP);
    xpGauge.activateGauge();
    xpGauge.move(x+5, 8);
    xpGauge.show();

    // locate the xp numbers.
    const xpNumbers = this.getOrCreateActorValueSprite(leader, Window_Hud.gaugeTypes.XP);
    xpNumbers.move(x, 8);
    xpNumbers.show();

    // locate the level numbers.
    const levelNumbers = this.getOrCreateActorValueSprite(leader, Window_Hud.gaugeTypes.Level);
    levelNumbers.move(x+84, oy-24);
    levelNumbers.show();
  };

  /**
   * Draw all states for the leader of the party.
   */
  drawStates()
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
      // grab all the states and sort them into negative/positive buckets.
      const trackedStates = $gameBattleMap.getStateTrackerByBattler(leader);
      const positiveStates = trackedStates.filter(this.filterPositiveStates);
      const negativeStates = trackedStates.filter(this.filterNegativeStates);

      // iterate over all the negative states and draw them.
      negativeStates.forEach((negativeTrackedState, index) =>
      {
        // draw the negative state onto the hud.
        const x = 8 + (index * (ImageManager.iconWidth + 2));
        const y = 180;
        this.drawState(leader, negativeTrackedState, x, y);
      });

      // iterate over all the positive states and draw them.
      positiveStates.forEach((positiveTrackedState, index) =>
      {
        // draw the positive state onto the hud.
        const x = 8 + (index * (ImageManager.iconWidth + 2));
        const y = 230;
        this.drawState(leader, positiveTrackedState, x, y);
      });
    }
  };

  /**
   * Hides all expired states on the leader.
   * @param {Game_Actor} leader The actor to hide states for.
   */
  hideExpiredStates(leader)
  {
    // the states deal only applies to JABS, sorry!
    if (J.ABS)
    {
      const trackedStates = $gameBattleMap.getStateTrackerByBattler(leader);
      trackedStates.forEach(trackedState =>
      {
        // if the tracked state isn't expired, don't bother.
        if (!trackedState.isExpired()) return;

        // make the keys for the sprites in question.
        const iconKey = this.makeStateIconSpriteKey(leader, trackedState.stateId);
        const timerKey = this.makeStateTimerSpriteKey(leader, trackedState.stateId);

        // skip trying if they don't exist.
        if (!this._hudSprites.has(iconKey) || !this._hudSprites.has(timerKey)) return;

        // get the sprites in question.
        const iconSprite = this._hudSprites.get(iconKey);
        const timerSprite = this._hudSprites.get(timerKey);

        // hide the sprites.
        iconSprite.hide();
        timerSprite.hide();
      });
    }
  };

  /**
   * The filter function for determining positive states.
   * @param {JABS_TrackedState} trackedState The state to categorize.
   * @returns {boolean} True if it is positive, false otherwise.
   */
  filterPositiveStates(trackedState)
  {
    if (trackedState.isExpired() || trackedState.stateId === 1) return false;

    const state = $dataStates[trackedState.stateId];
    if (state._j && state._j.negative)
    {
      return false
    }

    return true;
  };

  /**
   * The filter function for determining negative states.
   * @param {JABS_TrackedState} trackedState The state to categorize.
   * @returns {boolean} True if it is negative, false otherwise.
   */
  filterNegativeStates(trackedState)
  {
    if (trackedState.isExpired() || trackedState.stateId === 1) return false;

    const state = $dataStates[trackedState.stateId];
    if (state._j && state._j.negative)
    {
      return true;
    }

    return false;
  };

  /**
   * Draws a single state onto the hud.
   * @param {Game_Actor} actor The actor to draw the state for.
   * @param {JABS_TrackedState} trackedState The state afflicted on the character to draw.
   * @param {number} ox The origin x coordinate.
   * @param {number} y The y coordinate.
   */
  drawState(actor, trackedState, ox, y)
  {
    const iconSprite = this.getOrCreateStateIcon(actor, trackedState.stateId);
    iconSprite.move(ox, y);
    iconSprite.show();

    const timerSprite = this.getOrCreateStateTimer(actor, trackedState);
    timerSprite.move(ox-4, y+20);
    timerSprite.show();
  };

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
    $gameParty.battleMembers().forEach((ally, index) =>
    {
      // the leader is always index 0, and they are being drawn separately.
      if (index === 0) return;

      // draw the ally at the designated coordinates.
      const y = oy + lh*(index-1);
      this.drawAlly(ally, x, y);
    });
  };

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
    this.drawAllyGauges(ally, x+40, oy+6);
  };

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
  };

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
    const hpGauge = this.getOrCreateMiniSizeGaugeSprite(ally, Window_Hud.gaugeTypes.HP);
    hpGauge.activateGauge();
    hpGauge.move(x-24, oy + lh*0);
    hpGauge.show();

    // grab and locate the sprite.
    const mpGauge = this.getOrCreateMiniSizeGaugeSprite(ally, Window_Hud.gaugeTypes.MP);
    mpGauge.activateGauge();
    mpGauge.move(x-24, oy + lh*1);
    mpGauge.show();

    // grab and locate the sprite.
    const tpGauge = this.getOrCreateMiniSizeGaugeSprite(ally, Window_Hud.gaugeTypes.TP);
    tpGauge.activateGauge();
    tpGauge.move(x-24, oy + lh*2);
    tpGauge.show();
  };
}
//#endregion Window_Hud
//#endregion Window objects

//#region Custom objects
//#region Hud_Manager
/**
 * A manager class for the hud.
 * Use this class to issue requests to show/hide the hud.
 */
class Hud_Manager
{
  //#region properties
  /**
   * Whether or not the allies are currently being displayed in the hud.
   * @type {boolean}
   * @private
   */
  #alliesVisible = true;

  /**
   * Whether or not we have a request to show allies in the hud.
   * @type {boolean}
   * @private
   */
  #requestShowAllies = false;

  /**
   * Whether or not we have a request to hide allies in the hud.
   * @type {boolean}
   * @private
   */
  #requestHideAllies = false;

  /**
   * Whether or not the hud is visible.
   * @type {boolean}
   * @private
   */
  #hudVisible = true;

  /**
   * Whether or not we have a request to show the hud.
   * @type {boolean}
   * @private
   */
  #requestShowHud = false;

  /**
   * Whether or not we have a request to hide the hud.
   * @type {boolean}
   * @private
   */
  #requestHideHud = false;

  /**
   * Whether or not we have a request to refresh the hud.
   * @type {boolean}
   * @private
   */
  #requestRefresh = false;

  /**
   * Whether or not we have a request to refresh the image cache of the hud.
   * @type {boolean}
   * @private
   */
  #requestRefreshImageCache = false;

  /**
   * Whether or not the hud manager is ready to do things.
   * @type {boolean}
   * @private
   */
  #ready = false;
  //#endregion properties

  /**
   * Sets up this hud based on info from the saved data if available.
   */
  setup()
  {
    // if we're already setup, then don't do it again.
    if (this.#isReady()) return;

    // configure the hud based on what we remember from settings.
    this.#setHudVisible($gameSystem.getHudVisible() ?? true);
    this.#setShowAllies($gameSystem.getHudAlliesVisible() ?? true);

    // flag this as ready for processing.
    this.#setReady(true);
  };

  /**
   * The update loop for the manager.
   * Handles incoming requests to manage visibility for the hud.
   */
  update()
  {
    // if we are not ready for processing, then don't process.
    if (!this.#canUpdate()) return;

    // handle incoming requests to manage visibility.
    if (this.#hasRequestShowHud())
    {
      this.#showHud();
      this.requestRefreshHud();
    }
    else if (this.#hasRequestHideHud())
    {
      this.#hideHud();
      this.requestRefreshHud();
    }
    else if (this.#hasRequestShowAllies())
    {
      this.#showAllies();
      this.requestRefreshHud();
    }
    else if (this.#hasRequestHideAllies())
    {
      this.#hideAllies();
      this.requestRefreshHud();
    }
  };

  /**
   * Whether or not this hud can update its incoming request processing.
   * @returns {boolean} True if the manager is ready, false otherwise.
   */
  #canUpdate()
  {
    // if we aren't ready for processing, then don't update.
    if (!this.#isReady()) return false;

    // we are ready for processing.
    return true;
  };

  /**
   * Whether or not we can show the hud.
   * @returns {boolean} True if we can show the hud, false otherwise.
   */
  canShowHud()
  {
    return this.#hudVisible;
  };

  /**
   * Whether or not we can show allies.
   * @returns {boolean} True if we can show allies, false otherwise.
   */
  canShowAllies()
  {
    return this.#alliesVisible;
  };

  /**
   * Issue a request to the hud to show allies in the hud.
   */
  requestShowAllies()
  {
    this.#setRequestShowAllies(true);
  };

  /**
   * Issue a request to the hud to hide the allies from view.
   */
  requestHideAllies()
  {
    this.#setRequestHideAllies(true);
  };

  /**
   * Issue a request to show the hud.
   */
  requestShowHud()
  {
    this.#setRequestShowHud(true);
  };

  /**
   * Issue a request to hide the hud.
   */
  requestHideHud()
  {
    this.#setRequestHideHud(true);
  };

  /**
   * Issue a request to refresh the hud.
   */
  requestRefreshHud()
  {
    this.#setRequestRefreshHud(true);
  };

  /**
   * Checks whether or not we have a request to refresh the hud.
   * @returns {boolean} True if we have a request, false otherwise.
   */
  hasRequestRefreshHud()
  {
    return this.#requestRefresh;
  };

  /**
   * Acknowledge the request to refresh the hud.
   */
  acknowledgeRefreshHud()
  {
    this.#setRequestRefreshHud(false);
  };

  /**
   * Issue a request to refresh the image cache of the hud.
   */
  requestRefreshImageCache()
  {
    this.#setRequestRefreshImageCache(true);
  };

  /**
   * Whether or not we have a request to refresh the hud's image cache.
   * @returns {boolean} True if we have a request, false otherwise.
   */
  hasRequestRefreshImageCache()
  {
    return this.#requestRefreshImageCache;
  };

  /**
   * Acknowledge the request to refresh the hud's image cache.
   */
  acknowledgeRefreshImageCache()
  {
    this.#setRequestRefreshImageCache(false);
  };

  //#region private functions
  /**
   * Whether or not the hud manager is ready to get started.
   * @returns {boolean} True if it is ready, false otherwise.
   * @private
   */
  #isReady()
  {
    return this.#ready;
  };

  /**
   * Sets whether or not the hud's image cache needs refreshing.
   * @param {boolean} request True if refresh is required, false otherwise.
   * @private
   */
  #setRequestRefreshImageCache(request)
  {
    this.#requestRefreshImageCache = request;
  };

  /**
   * Sets whether or not the hud requires a refresh.
   * @param {boolean} request True if refresh is required, false otherwise.
   * @private
   */
  #setRequestRefreshHud(request)
  {
    this.#requestRefresh = request;
  };

  /**
   * Sets whether or not this hud manager is ready to go.
   * @param {boolean} ready True if ready, false otherwise.
   * @private
   */
  #setReady(ready)
  {
    this.#ready = ready;
  };

  /**
   * Sets the request to show allies to the given value.
   * @param {boolean} request True to issue the request to show allies, false otherwise.
   * @private
   */
  #setRequestShowAllies(request)
  {
    this.#requestShowAllies = request;
  };

  /**
   * Sets the showing of allies.
   * @param {boolean} showAllies True to show allies, false otherwise.
   * @private
   */
  #setShowAllies(showAllies)
  {
    this.#alliesVisible = showAllies;
  };

  /**
   * Whether or not we have a request to show allies in the hud.
   * @returns {boolean} True if we need to show allies, false otherwise.
   */
  #hasRequestShowAllies()
  {
    return this.#requestShowAllies;
  };

  /**
   * Shows all allies.
   * This is not designed to be used directly.
   * Please use the `requestShowAllies(true)` for that.
   */
  #showAllies()
  {
    this.#setShowAllies(true);
    this.#setRequestShowAllies(false);

    // update the gameSystem for remembering.
    $gameSystem.setHudAlliesVisible(true);
  };

  /**
   * Sets the request to hide allies to the given value.
   * @param {boolean} request True to issue the request to hide allies, false otherwise.
   * @private
   */
  #setRequestHideAllies(request)
  {
    this.#requestHideAllies = request;
  };

  /**
   * Whether or not we have a request to hide allies in the hud.
   * @returns {boolean} True if we need to hide allies, false otherwise.
   */
  #hasRequestHideAllies()
  {
    return this.#requestHideAllies;
  };

  /**
   * Disables the showing of your allies in the hud.
   */
  #hideAllies()
  {
    this.#setShowAllies(false);
    this.#setRequestHideAllies(false);

    // update the gameSystem for remembering.
    $gameSystem.setHudAlliesVisible(false);
  };

  /**
   * Sets whether or not the hud is visible.
   * @param {boolean} hudVisible True if the hud is visible, false otherwise.
   * @private
   */
  #setHudVisible(hudVisible)
  {
    this.#hudVisible = hudVisible;
  };

  /**
   * Shows the hud.
   * This is not designed to be used directly.
   * Please use the `setRequestShowHud(true)` for that.
   */
  #showHud()
  {
    this.#setHudVisible(true);
    this.#setRequestShowHud(false);

    // update the gameSystem for remembering.
    $gameSystem.setHudVisible(true);
  };

  /**
   * Hides the hud.
   * This is not designed to be used directly.
   * Please use the `setRequestHideHud(true)` for that.
   */
  #hideHud()
  {
    this.#setHudVisible(false);
    this.#setRequestHideHud(false);

    // update the gameSystem for remembering.
    $gameSystem.setHudVisible(false);
  };

  /**
   * Whether or not we have a request to show the hud.
   * @returns {boolean} True if we need to show the hud, false otherwise.
   */
  #hasRequestShowHud()
  {
    return this.#requestShowHud;
  };

  /**
   * Whether or not we have a request to hide the hud.
   * @returns {boolean} True if we need to hide the hud, false otherwise.
   */
  #hasRequestHideHud()
  {
    return this.#requestHideHud;
  };

  /**
   * Sets the request to show the hud to the given value.
   * @param {boolean} request True to issue the request to show the hud, false otherwise.
   * @private
   */
  #setRequestShowHud(request)
  {
    this.#requestShowHud = request;
  };

  /**
   * Sets the request to hide the hud to the given value.
   * @param {boolean} request True to issue the request to hide the hud, false otherwise.
   * @private
   */
  #setRequestHideHud(request)
  {
    this.#requestHideHud = request;
  };
  //#endregion private functions
}
//#endregion Hud_Manager
//#endregion Custom objects
//ENDOFFILE