//#region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0 HUD-PARTY] A HUD frame that displays your party's data.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @orderAfter J-BASE
 * @help
 * ============================================================================
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
 * ============================================================================
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
J.HUD.EXT_PARTY = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.HUD.EXT_PARTY = {};
J.HUD.EXT_PARTY.Metadata = {};
J.HUD.EXT_PARTY.Metadata.Version = '1.0.0';
J.HUD.EXT_PARTY.Metadata.Name = `J-HUD-PartyFrame`;

/**
 * A collection of all aliased methods for this plugin.
 */
J.HUD.EXT_PARTY.Aliased = {
  Scene_Map: new Map(),
};
//#endregion introduction

//#region plugin commands
/**
 * Plugin command for hiding the hud.
 */
PluginManager.registerCommand(J.HUD.EXT_PARTY.Metadata.Name, "hideHud", () =>
{
  $hudManager.requestHideHud();
});

/**
 * Plugin command for showing the hud.
 */
PluginManager.registerCommand(J.HUD.EXT_PARTY.Metadata.Name, "showHud", () =>
{
  $hudManager.requestShowHud();
});

/**
 * Plugin command for hiding allies in the hud.
 */
PluginManager.registerCommand(J.HUD.EXT_PARTY.Metadata.Name, "hideAllies", () =>
{
  $hudManager.requestHideAllies();
});

/**
 * Plugin command for showing allies in the hud.
 */
PluginManager.registerCommand(J.HUD.EXT_PARTY.Metadata.Name, "showAllies", () =>
{
  $hudManager.requestShowAllies();
});

/**
 * Plugin command for refreshing the hud.
 */
PluginManager.registerCommand(J.HUD.EXT_PARTY.Metadata.Name, "refreshHud", () =>
{
  $hudManager.requestRefreshHud();
});

/**
 * Plugin command for refreshing the hud's image cache.
 */
PluginManager.registerCommand(J.HUD.EXT_PARTY.Metadata.Name, "refreshImageCache", () =>
{
  $hudManager.requestRefreshImageCache();
});
//#endregion plugin commands

//#region Scene objects
//#region Scene_Map
/**
 * Hooks into `initialize` to add our hud.
 */
J.HUD.EXT_PARTY.Aliased.Scene_Map.set('initialize', Scene_Map.prototype.initialize);
Scene_Map.prototype.initialize = function()
{
  // perform original logic.
  J.HUD.EXT_PARTY.Aliased.Scene_Map.get('initialize').call(this);

  /**
   * All encompassing _j object for storing this plugin's properties.
   * @type {{}}
   * @private
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
J.HUD.EXT_PARTY.Aliased.Scene_Map.set('createAllWindows', Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function()
{
  // perform original logic.
  J.HUD.EXT_PARTY.Aliased.Scene_Map.get('createAllWindows').call(this);

  // create the hud.
  this.createHudPartyFrame();
};

/**
 * Creates the party frame window and adds it to tracking.
 */
Scene_Map.prototype.createHudPartyFrame = function()
{
  // create the rectangle of the window.
  const rect = this.hudPartyFrameWindowRect();

  // assign the window to our reference.
  this._j._partyFrame = new Window_PartyFrame(rect);

  // add window to tracking.
  this.addWindow(this._j._partyFrame);
};

/**
 * Creates the rectangle representing the window for the map hud.
 * @returns {Rectangle}
 */
Scene_Map.prototype.hudPartyFrameWindowRect = function()
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
J.HUD.EXT_PARTY.Aliased.Scene_Map.set('refreshHud', Scene_Map.prototype.refreshHud);
Scene_Map.prototype.refreshHud = function()
{
  // perform original logic.
  J.HUD.EXT_PARTY.Aliased.Scene_Map.get('refreshHud').call(this);

  // refresh the party frame.
  this._j._partyFrame.refresh();
};

/**
 * Extend the update loop for the party frame.
 */
J.HUD.EXT_PARTY.Aliased.Scene_Map.set('updateHudFrames', Scene_Map.prototype.updateHudFrames);
Scene_Map.prototype.updateHudFrames = function()
{
  // perform original logic.
  J.HUD.EXT_PARTY.Aliased.Scene_Map.get('updateHudFrames').call(this);

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
//#endregion Scene_Map
//#endregion Scene objects

//#region Window objects
//#region Window_PartyFrame
/**
 * A window containing the HUD data for the map.
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
   * Creates all sprites for this hud and caches them.
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
   * @returns {string}
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
      Window_PartyFrame.gaugeTypes.HP,
      Window_PartyFrame.gaugeTypes.MP,
      Window_PartyFrame.gaugeTypes.TP,
      Window_PartyFrame.gaugeTypes.XP
    ];
  };

  /**
   * Creates the key for an actor's gauge sprite based on the parameters.
   * @param {Game_Actor} actor The actor to draw a full gauge sprite for.
   * @param {boolean} isFull Whether or not this is for a full-sized sprite.
   * @param {Window_PartyFrame.gaugeTypes} gaugeType The type of gauge this is.
   * @returns {string} The key for this gauge sprite.
   */
  makeGaugeSpriteKey(actor, isFull, gaugeType)
  {
    const gaugeSize = isFull ? `full` : `mini`;
    return `gauge-${gaugeType}-${gaugeSize}-${actor.name()}-${actor.actorId()}`;
  };

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
  };

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
    const gaugeWidth = gaugeType === Window_PartyFrame.gaugeTypes.XP ? 114 : 144;

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
  };

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
    const gaugeWidth = gaugeType === Window_PartyFrame.gaugeTypes.XP ? 42 : 96;

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
   * @param {Window_PartyFrame.gaugeTypes} gaugeType The type of actor value this is.
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
  };

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
        return -10;
      case Window_PartyFrame.gaugeTypes.MP:
        return -12;
      case Window_PartyFrame.gaugeTypes.TP:
        return -14;
      case Window_PartyFrame.gaugeTypes.XP:
        return -12;
      case Window_PartyFrame.gaugeTypes.Level:
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
    const hpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_PartyFrame.gaugeTypes.HP);
    hpGauge.activateGauge();
    hpGauge.move(x-24, oy);
    hpGauge.show();

    // locate the hp numbers.
    const hpNumbers = this.getOrCreateActorValueSprite(leader, Window_PartyFrame.gaugeTypes.HP);
    hpNumbers.move(x, oy);
    hpNumbers.show();

    // grab and locate the sprite.
    const mpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_PartyFrame.gaugeTypes.MP);
    mpGauge.activateGauge();
    mpGauge.move(x-24, oy + lh-2 - mpGauge.bitmapHeight());
    mpGauge.show();

    // locate the mp numbers.
    const mpNumbers = this.getOrCreateActorValueSprite(leader, Window_PartyFrame.gaugeTypes.MP);
    mpNumbers.move(x, oy+19);
    mpNumbers.show();

    // grab and locate the sprite.
    const tpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_PartyFrame.gaugeTypes.TP);
    tpGauge.activateGauge();
    tpGauge.move(x-24, oy+46-tpGauge.bitmapHeight());
    tpGauge.show();

    // locate the tp numbers.
    const tpNumbers = this.getOrCreateActorValueSprite(leader, Window_PartyFrame.gaugeTypes.TP);
    tpNumbers.move(x, oy+33);
    tpNumbers.show();

    // grab and locate the xp gauge.
    const xpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_PartyFrame.gaugeTypes.XP);
    xpGauge.activateGauge();
    xpGauge.move(x+5, 8);
    xpGauge.show();

    // locate the xp numbers.
    const xpNumbers = this.getOrCreateActorValueSprite(leader, Window_PartyFrame.gaugeTypes.XP);
    xpNumbers.move(x, 8);
    xpNumbers.show();

    // locate the level numbers.
    const levelNumbers = this.getOrCreateActorValueSprite(leader, Window_PartyFrame.gaugeTypes.Level);
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
      const trackedStates = $jabsEngine.getStateTrackerByBattler(leader);
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
      const trackedStates = $jabsEngine.getStateTrackerByBattler(leader);
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
    const hpGauge = this.getOrCreateMiniSizeGaugeSprite(ally, Window_PartyFrame.gaugeTypes.HP);
    hpGauge.activateGauge();
    hpGauge.move(x-24, oy + lh*0);
    hpGauge.show();

    // grab and locate the sprite.
    const mpGauge = this.getOrCreateMiniSizeGaugeSprite(ally, Window_PartyFrame.gaugeTypes.MP);
    mpGauge.activateGauge();
    mpGauge.move(x-24, oy + lh*1);
    mpGauge.show();

    // grab and locate the sprite.
    const tpGauge = this.getOrCreateMiniSizeGaugeSprite(ally, Window_PartyFrame.gaugeTypes.TP);
    tpGauge.activateGauge();
    tpGauge.move(x-24, oy + lh*2);
    tpGauge.show();
  };
}
//#endregion Window_PartyFrame
//#endregion Window objects

//#region Custom objects

//#endregion Custom objects
//ENDOFFILE