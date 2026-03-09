//region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.2.0 HUD-PARTY] A HUD frame that displays your party's data.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-HUD
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-HUD
 * @orderBefore J-ABS-Shield
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is an extension of the J-HUD system.
 *
 * This is the Party Frame, which displays the leader and allied members that
 * the player currently has in their party.
 *
 * This plugin requires JABS.
 * This plugin requires the base HUD.
 * This plugin has no additional configuration required.
 * ----------------------------------------------------------------------------
 * DETAILS:
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
 * - in combat indicator
 * - shield gauge (if using J-ABS-Shield)
 * ============================================================================
 * CHANGELOG
 * ----------------------------------------------------------------------------
 * - 1.2.0
 *    Integrated J-ABS-Shields; supports display for shield gauge.
 *    Updated many classes to use modern class syntax.
 *    Updated visuals for clarity across many aspects of the HUD.
 * - 1.1.0
 *    Added visual tracking indicator for "in combat" for the leader.
 *    Retroactively added this changelog.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.3.2';
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
J.HUD.EXT.PARTY.Metadata.Version = '1.2.0';
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
  J.HUD.EXT.PARTY.Aliased.Scene_Map.get('initialize')
    .call(this);

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
  J.HUD.EXT.PARTY.Aliased.Scene_Map.get('createAllWindows')
    .call(this);

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
  J.HUD.EXT.PARTY.Aliased.Scene_Map.get('refreshHud')
    .call(this);

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
  J.HUD.EXT.PARTY.Aliased.Scene_Map.get('updateHudFrames')
    .call(this);

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
 * A sprite that represents a value of an actor's parameter.
 */
class Sprite_ActorValue
  extends Sprite
{
  /**
   * Constructor.
   * @param {Game_Actor} actor The actor to track the value of.
   * @param {string} parameter The parameter to track.
   * @param {number=} fontSizeMod The modification of the font size for this value.
   */
  constructor(actor, parameter, fontSizeMod = 0)
  {
    // execute original constructor.
    super();

    // initialize the additional members.
    this.initMembers(actor, parameter, fontSizeMod);

    // generate the bitmap.
    this.bitmap = this.createBitmap();
  }

  /**
   * Initializes the properties associated with this sprite.
   * @param {object} actor The actor to track the value of.
   * @param {string} parameter The parameter to track.
   * @param {number} fontSizeMod The modification of the font size for this value.
   */
  initMembers(actor, parameter, fontSizeMod)
  {
    // initialize our namespaced property block.
    this._j ||= {};

    /**
     * The parameter being tracked by this sprite.
     * @type {string}
     */
    this._j._parameter = parameter;

    /**
     * The actor being tracked by this sprite.
     * @type {Game_Actor}
     */
    this._j._actor = actor;

    /**
     * The font modification from the default font size.
     * @type {number}
     */
    this._j._fontSizeMod = fontSizeMod;

    /**
     * A grouping of all the last-known values for this actor.
     */
    this._j._last ||= {};

    /**
     * The last known hp value.
     * @type {number}
     */
    this._j._last._hp = actor.hp;

    /**
     * The last known mp value.
     * @type {number}
     */
    this._j._last._mp = actor.mp;

    /**
     * The last known tp value.
     * @type {number}
     */
    this._j._last._tp = actor.tp;

    /**
     * The last known exp value- aka the current exp value.
     * @type {number}
     */
    this._j._last._xp = actor.currentExp();

    /**
     * The last known level value- aka the current level.
     * @type {number}
     */
    this._j._last._lvl = actor.level;

    /**
     * A counter for auto refreshing the value.
     * @type {number}
     */
    this._j._autoCounter = 60;
  }

  /**
   * Gets the parameter being tracked by this sprite.
   * @returns {string}
   */
  getParameter()
  {
    return this._j._parameter;
  }

  /**
   * Gets the actor being tracked by this sprite.
   * @returns {Game_Actor}
   */
  getActor()
  {
    return this._j._actor;
  }

  /**
   * Gets the autorefresh counter.
   * @returns {number}
   */
  getAutoCounter()
  {
    return this._j._autoCounter;
  }

  /**
   * Decrements the autorefresh counter.
   */
  decrementAutoCounter()
  {
    this._j._autoCounter--;
  }

  /**
   * Resets the autorefresh counter to its default value.
   */
  resetAutoCounter()
  {
    this._j._autoCounter = 60;
  }

  /**
   * Updates the bitmap if it needs updating.
   */
  update()
  {
    // perform original update.
    super.update();

    // updates the actor value accordingly.
    this.handleActorValueUpdates();
  }

  /**
   * Handles the update loop for the actor value tracking.
   */
  handleActorValueUpdates()
  {
    // check if any parameters have changed at this frame.
    if (this.hasParameterChanged())
    {
      // trigger a refresh.
      this.refresh();

      // reset the autocounter.
      this.resetAutoCounter();
    }

    // handle the autorefresh.
    this.handleAutoRefresh();
  }

  /**
   * Automatically refreshes the value being represented by this sprite
   * after a fixed amount of time.
   */
  handleAutoRefresh()
  {
    // check if we need to autorefresh.
    if (this.needsAutoRefresh())
    {
      // refresh the value.
      this.refresh();

      // reset the autocounter.
      this.resetAutoCounter();

      // stop processing.
      return;
    }

    // decrement the autocounter.
    this.decrementAutoCounter();
  }

  /**
   * Determines whether or not we need to trigger an autorefresh.
   * @returns {boolean} True if we need to autorefresh, false otherwise.
   */
  needsAutoRefresh()
  {
    // if the autocounter has reached 0, we need to refresh.
    if (this.getAutoCounter() <= 0) return true;

    // no need to refresh.
    return false;
  }

  /**
   * Refreshes the value being represented by this sprite.
   */
  refresh()
  {
    this.bitmap = this.createBitmap();
  }

  /**
   * Checks whether or not a given parameter has changed.
   */
  hasParameterChanged()
  {
    // default to "changed" in case we do not match a parameter.
    let changed = true;

    const actor = this.getActor();

    // decide which parameter we are tracking and compare against the cache.
    switch (this.getParameter())
    {
      case Window_PartyFrame.gaugeTypes.HP:
      {
        // check for hp change.
        changed = actor.hp !== this._j._last._hp;

        // update the last-known hp if changed.
        if (changed) this._j._last._hp = actor.hp;

        // end case.
        return changed;
      }
      case Window_PartyFrame.gaugeTypes.MP:
      {
        // check for mp change.
        changed = actor.mp !== this._j._last._mp;

        // update the last-known mp if changed.
        if (changed) this._j._last._mp = actor.mp;

        // end case.
        return changed;
      }
      case Window_PartyFrame.gaugeTypes.TP:
      {
        // check for tp change.
        changed = actor.tp !== this._j._last._tp;

        // update the last-known tp if changed.
        if (changed) this._j._last._tp = actor.tp;

        // end case.
        return changed;
      }
      case Window_PartyFrame.gaugeTypes.XP:
      {
        // compute the current exp for comparison.
        const current = actor.currentExp();

        // check for exp change.
        changed = current !== this._j._last._xp;

        // update the last-known exp if changed.
        if (changed) this._j._last._xp = current;

        // end case.
        return changed;
      }
      case Window_PartyFrame.gaugeTypes.Level:
      {
        // check for level change.
        changed = actor.level !== this._j._last._lvl;

        // update the last-known level if changed.
        if (changed) this._j._last._lvl = actor.level;

        // end case.
        return changed;
      }
    }

    return false;
  }

  /**
   * Creates a bitmap to attach to this sprite that shows the value.
   */
  createBitmap()
  {
    // determine the bitmap dimensions.
    const width = this.bitmapWidth();

    // determine the bitmap height relative to font size.
    const height = this.fontSize() + 4;

    // create the bitmap for this value sprite.
    const bitmap = new Bitmap(width, height);

    // update the bitmap based on the parameter.
    const updatedBitmap = this.updateBitmapByParameter(bitmap);

    // get the current value to display.
    const value = this.getActorValue();

    // draw the value left-aligned across the bitmap.
    updatedBitmap.drawText(value, 0, 0, bitmap.width, bitmap.height, 'left');

    // return the created bitmap.
    return bitmap;
  }

  /**
   * Gets the current value of the actor being tracked by this sprite.
   * @returns {number}
   */
  getActorValue()
  {
    const actor = this.getActor();

    // decide how to render based on the parameter being displayed.
    switch (this.getParameter())
    {
      case Window_PartyFrame.gaugeTypes.HP:
      {
        // display rounded HP to avoid off-by-one visuals against fractional HP.
        return Math.round(actor.hp);
      }
      case Window_PartyFrame.gaugeTypes.MP:
      {
        // display rounded MP to align with fractional accumulation.
        return Math.round(actor.mp);
      }
      case Window_PartyFrame.gaugeTypes.TP:
      {
        // TP can change in non-integers under JABS; display rounded for consistency.
        return Math.round(actor.tp);
      }
      case Window_PartyFrame.gaugeTypes.XP:
      {
        // compute exp remaining to next level.
        const curExp = (actor.nextLevelExp() - actor.currentLevelExp());

        // compute progress into the current level.
        const nextLv = (actor.currentExp() - actor.currentLevelExp());

        // calculate the remaining exp as a whole number.
        return curExp - nextLv;
      }
      case Window_PartyFrame.gaugeTypes.Level:
      {
        // display the level as a 3-digit number.
        return actor.level.padZero(3);
      }
    }

    // if we didn't hit a case, return 0.
    return null;
  }

  /**
   * Mutates the bitmap based on the parameter being tracked.
   * @param {Bitmap} bitmap The bitmap to mutate.
   * @returns {Bitmap} The mutated bitmap.
   */
  updateBitmapByParameter(bitmap)
  {
    // assign for local mutation.
    const updatedBitmap = bitmap;

    // decide how to render based on the parameter being displayed.
    switch (this.getParameter())
    {
      case Window_PartyFrame.gaugeTypes.HP:
      {
        // set the outline thickness for readability.
        updatedBitmap.outlineWidth = 4;

        // set the red-tinted outline color for HP.
        updatedBitmap.outlineColor = 'rgba(128, 24, 24, 1.0)';

        // end case.
        break;
      }
      case Window_PartyFrame.gaugeTypes.MP:
      {
        // set the outline thickness for readability.
        updatedBitmap.outlineWidth = 4;

        // set the blue-tinted outline color for MP.
        updatedBitmap.outlineColor = 'rgba(24, 24, 192, 1.0)';

        // end case.
        break;
      }
      case Window_PartyFrame.gaugeTypes.TP:
      {
        // set the outline thickness for readability.
        updatedBitmap.outlineWidth = 4;

        // set the green-tinted outline color for TP.
        updatedBitmap.outlineColor = 'rgba(24, 64, 24, 1.0)';

        // end case.
        break;
      }
      case Window_PartyFrame.gaugeTypes.XP:
      {
        // set the outline thickness for readability.
        updatedBitmap.outlineWidth = 4;

        // set the neutral outline for XP remaining.
        updatedBitmap.outlineColor = 'rgba(72, 72, 72, 1.0)';

        // end case.
        break;
      }
      case Window_PartyFrame.gaugeTypes.Level:
      {
        // set the outline thickness for readability.
        updatedBitmap.outlineWidth = 4;

        // set the neutral outline for level text.
        updatedBitmap.outlineColor = 'rgba(72, 72, 72, 1.0)';

        // end case.
        break;
      }
    }

    // assign the font face for this value.
    updatedBitmap.fontFace = this.fontFace();

    // assign the font size for this value.
    updatedBitmap.fontSize = this.fontSize();

    // return the mutated bitmap.
    return updatedBitmap;
  }

  /**
   * Defaults the bitmap width to be a fixed 200 pixels.
   */
  bitmapWidth()
  {
    return 200;
  }

  /**
   * Defaults the font size to be an adjusted amount from the base font size.
   */
  fontSize()
  {
    return $gameSystem.mainFontSize() + this._j._fontSizeMod;
  }

  /**
   * Defaults the font face to be the number font.
   */
  fontFace()
  {
    return $gameSystem.numberFontFace();
  }
}

//endregion Sprite_ActorValue

//region Window_PartyFrame
/**
 * A window containing the HUD data for the {@link Game_Party}.
 */
class Window_PartyFrame
  extends Window_Base
{
  /**
   * The static collection of gauge types supported.
   */
  static gaugeTypes = {
    /**
     * The type of gauge for hp.
     */
    HP: 'hp',

    /**
     * The type of gauge for mp.
     */
    MP: 'mp',

    /**
     * The type of gauge for tp.
     */
    TP: 'tp',

    /**
     * The type of gauge for xp.
     * We borrow the "time" gauge for this, though.
     */
    XP: 'time',

    /**
     * Not actually a gauge, but does have an actorvalue representing
     * the actor's level.
     */
    Level: 'lvl'
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
     * @type {Map<string, Sprite_Face|Sprite_MapGauge|Sprite_ActorValue|Sprite_Icon|Sprite_BaseText>}
     */
    this._hudSprites = new Map();
  }

  /**
   * Performs the one-time setup and configuration per instantiation.
   */
  configure()
  {
    // make the window's background opacity transparent.
    this.opacity = 32;

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
    const gaugeHeight = gaugeType === Window_PartyFrame.gaugeTypes.XP
      ? 12
      : 24;

    // determine gauge width based on gauge type.
    const gaugeWidth = gaugeType === Window_PartyFrame.gaugeTypes.XP
      ? 114
      : 144;

    // create a new full-sized gauge sprite of the actor.
    const sprite = new Sprite_MapGauge(gaugeWidth, gaugeHeight, gaugeHeight);

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
    const bitmapHeight = 12;

    // determine gauge width based on gauge type.
    const bitmapWidth = gaugeType === Window_PartyFrame.gaugeTypes.XP
      ? 42
      : 96;

    // create a new mini-sized gauge sprite of the actor.
    const sprite = new Sprite_MapGauge(bitmapWidth, bitmapHeight, bitmapHeight);

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

    // determine the font size.
    const valueFontSize = gaugeType === Window_PartyFrame.gaugeTypes.XP
      ? -6
      : -2;

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
   * @returns {Sprite_BaseText} The state timer sprite.
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
    const spriteText = new Sprite_BaseText();

    // configure the font for a small numeric readout (seconds, one decimal).
    spriteText.setFontFace($gameSystem.numberFontFace());
    spriteText.setFontSize($gameSystem.mainFontSize() - 6);
    spriteText.setAlignment(Sprite_BaseText.Alignments.Center);
    spriteText.setMinWidth(ImageManager.iconWidth);

    // cache the sprite.
    this._hudSprites.set(key, spriteText);

    // hide the sprite for now.
    spriteText.hide();

    // add the sprite to tracking.
    this.addChild(spriteText);

    // return the created sprite.
    return spriteText;
  }

  /**
   * Creates the key for an actor's state affliction.
   * @param {Game_Actor} actor The actor to draw a actor value sprite for.
   * @param {number} stateId The id of the state to generate a key for.
   * @returns {string} The key for this actor value sprite.
   */
  makeStateStackCountSpriteKey(actor, stateId)
  {
    return `stacks-${stateId}-${actor.name()}-${actor.actorId()}`;
  }

  /**
   * Creates the timer sprite for a given state.
   * @param {Game_Actor} actor The actor to draw the state data for.
   * @param {JABS_State} trackedState The tracked state data for this state.
   * @returns {Sprite_BaseText} The state timer sprite.
   */
  getOrCreateStateStackCount(actor, trackedState)
  {
    // the key for the sprite.
    const key = this.makeStateStackCountSpriteKey(actor, trackedState.stateId);

    // check if the key already maps to a cached sprite.
    if (this._hudSprites.has(key))
    {
      // if it does, just return that.
      return this._hudSprites.get(key);
    }

    // create a new full-sized face sprite of the actor.
    const spriteText = new Sprite_BaseText();

    // configure the font for a small numeric readout (seconds, one decimal).
    spriteText.setFontFace($gameSystem.numberFontFace());
    spriteText.setFontSize($gameSystem.mainFontSize() - 4);
    spriteText.setAlignment(Sprite_BaseText.Alignments.Center);
    spriteText.setMinWidth(ImageManager.iconWidth);

    // cache the sprite.
    this._hudSprites.set(key, spriteText);

    // hide the sprite for now.
    spriteText.hide();

    // add the sprite to tracking.
    this.addChild(spriteText);

    // return the created sprite.
    return spriteText;
  }

  /**
   * Creates or retrieves the combat icon sprite for the given actor.
   * @param {Game_Actor} actor The actor this icon represents.
   * @returns {Sprite_Icon} The combat icon sprite.
   */
  getOrCreateCombatIcon(actor)
  {
    // create a unique cache key for the icon.
    const key = `combat-icon-${actor.name()}-${actor.actorId()}`;

    // if cached already, return it.
    if (this._hudSprites.has(key))
    {
      return this._hudSprites.get(key);
    }

    // in-combat icon index is two fists punching.
    const iconIndex = 31;

    // create the icon sprite.
    const sprite = new Sprite_Icon(iconIndex);

    // indicate we'll manage the opacity ourselves.
    sprite.selfManageOpacity();

    // cache and stage it.
    this._hudSprites.set(key, sprite);
    sprite.hide();
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Creates or retrieves the combat timer sprite for the given actor.
   * @param {Game_Actor} actor The actor this timer represents.
   * @returns {Sprite_BaseText} The combat seconds text sprite.
   */
  getOrCreateCombatTimer(actor)
  {
    // create a unique cache key for the timer.
    const key = `combat-timer-${actor.name()}-${actor.actorId()}`;

    // if cached already, return it.
    if (this._hudSprites.has(key))
    {
      return this._hudSprites.get(key);
    }

    // create a text sprite.
    const sprite = new Sprite_BaseText(String.empty);

    // configure the font for a small numeric readout (seconds, one decimal).
    sprite.setFontFace($gameSystem.numberFontFace());
    sprite.setFontSize($gameSystem.mainFontSize() - 8);
    sprite.setAlignment(Sprite_BaseText.Alignments.Center);
    sprite.setMinWidth(ImageManager.iconWidth);

    // this sprite manages its own opacity (for fade out), so opt out of auto-managed opacity.
    sprite.selfManageOpacity();

    // start hidden until we actually show it in-combat.
    sprite.hide();

    // cache and stage it.
    this._hudSprites.set(key, sprite);

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Creates or retrieves the combat label sprite for the given actor.
   * Shows a text blurb like "IN COMBAT" or "FREE" near the combat icon.
   * @param {Game_Actor} actor The actor this label represents.
   * @returns {Sprite_BaseText} The combat status label sprite.
   */
  getOrCreateCombatLabel(actor)
  {
    // create a unique cache key for the label.
    const key = `combat-label-${actor.name()}-${actor.actorId()}`;

    // if cached already, return it.
    if (this._hudSprites.has(key))
    {
      return this._hudSprites.get(key);
    }

    // create a text sprite.
    const sprite = new Sprite_BaseText(String.empty);

    // configure the font for emphasis and readability.
    sprite
      .setFontFace($gameSystem.mainFontFace())
      .setFontSize($gameSystem.mainFontSize() - 8)
      .setAlignment(Sprite_BaseText.Alignments.Center)
      .setBold(true)
      .setItalics(true)
      .setMinWidth(Math.round(ImageManager.iconWidth * 2.5))
      .selfManageOpacity();

    // cache and stage it.
    this._hudSprites.set(key, sprite);
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
      // if the interference shouldn't be handled for this sprite, then don't.
      if (this.canHandleSpriteInterference(sprite) === false) return;

      // if we are above 64, rapidly decrement by -15 until we get below 64.
      if (sprite.opacity > 64)
      {
        sprite.opacity -= 15;
      }
      // if we are below 64, increment by +1 until we get to 64.
      else if (sprite.opacity < 64)
      {
        sprite.opacity += 1;
      }
    }, this);
  }

  /**
   * Reverts the opacity changes associated with the player getting in the way.
   */
  revertInterferenceOpacity()
  {
    this._hudSprites.forEach((sprite, _) =>
    {
      // if the interference shouldn't be handled for this sprite, then don't.
      if (this.canHandleSpriteInterference(sprite) === false) return;

      // if we are below 255, rapidly increment by +15 until we get to 255.
      if (sprite.opacity < 255)
      {
        sprite.opacity += 15;
      }
      // if we are above 255, set to 255.
      else if (sprite.opacity > 255)
      {
        sprite.opacity = 255;
      }
    }, this);
  }

  /**
   * Checks if the given sprite should be handled for interference.
   * @param {Sprite_Face|Sprite_MapGauge|Sprite_ActorValue|Sprite_Icon|Sprite_BaseText} sprite
   * @returns {boolean}
   */
  canHandleSpriteInterference(sprite)
  {
    // certain sprites can have self-managed opacity.
    if (sprite instanceof Sprite_BaseText || sprite instanceof Sprite_Icon)
    {
      // if they have self-managed opacity, they shouldn't be handled.
      if (sprite.hasSelfManagedOpacity() === true) return false;
    }

    // let the system handle the opacity management.
    return true;
  }

  //endregion visibility

  //region draw
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
    const gaugeHeight = 24;
    const gaugesY = this.height - (gaugeHeight * 3);
    this.drawLeaderResourceGauges(gaugesX, gaugesY);

    // render the extraneous gauges: just experience.
    const extraneousX = x + 12;
    const extraneousY = faceY;
    this.drawLeaderExtraneousGauges(extraneousX, extraneousY);

    // draw states for the leader.
    const statesX = gaugesX;
    const statesY = gaugesY - (ImageManager.iconHeight * 2) - 48;
    this.drawStates(statesX, statesY);

    // draw the in‑combat indicator (icon + timer) just to the right of the gauges.
    this.drawLeaderCombatIndicator(gaugesX, gaugesY);
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

  /**
   * Draws all the various resource gauges for the leader.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawLeaderResourceGauges(x, y)
  {
    // grab the leader of the party.
    const leader = $gameParty.leader();

    const numbersX = x + 12;

    // locate the hp gauge.
    const hpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_PartyFrame.gaugeTypes.HP);
    hpGauge.activateGauge();
    hpGauge.move(x, y);
    hpGauge.show();

    // locate the hp numbers.
    const hpNumbers = this.getOrCreateActorValueSprite(leader, Window_PartyFrame.gaugeTypes.HP);
    hpNumbers.move(numbersX, y - 2);
    hpNumbers.show();

    // grab and locate the sprite.
    const mpGaugeY = y + 24;
    const mpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_PartyFrame.gaugeTypes.MP);
    mpGauge.activateGauge();
    mpGauge.move(x, mpGaugeY);
    mpGauge.show();

    // locate the mp numbers.
    const mpNumbers = this.getOrCreateActorValueSprite(leader, Window_PartyFrame.gaugeTypes.MP);
    mpNumbers.move(numbersX, mpGaugeY - 2);
    mpNumbers.show();

    // grab and locate the sprite.
    const tpGaugeY = y + 48;
    const tpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_PartyFrame.gaugeTypes.TP);
    tpGauge.activateGauge();
    tpGauge.move(x, tpGaugeY);
    tpGauge.show();

    // locate the tp numbers.
    const tpNumbers = this.getOrCreateActorValueSprite(leader, Window_PartyFrame.gaugeTypes.TP);
    tpNumbers.move(numbersX, tpGaugeY - 2);
    tpNumbers.show();
  }

  /**
   * Draws all the extraneous resource gauges for the leader.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawLeaderExtraneousGauges(x, y)
  {
    // grab the leader of the party.
    const leader = $gameParty.leader();

    // grab and locate the xp gauge.
    const xpY = y;
    const xpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_PartyFrame.gaugeTypes.XP);
    xpGauge.activateGauge();
    xpGauge.move(x, xpY);
    xpGauge.show();

    // locate the xp numbers.
    const xpNumbers = this.getOrCreateActorValueSprite(leader, Window_PartyFrame.gaugeTypes.XP);
    xpNumbers.move(x + 4, xpY);
    xpNumbers.show();

    // locate the level numbers.
    const levelNumbers = this.getOrCreateActorValueSprite(leader, Window_PartyFrame.gaugeTypes.Level);
    levelNumbers.move(x + 80, xpY);
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
   * Draws the leader's "in‑combat" indicator to the right of the gauges.
   * @param {number} gaugesX The x coordinate where gauges start.
   * @param {number} gaugesY The y coordinate where gauges start.
   */
  drawLeaderCombatIndicator(gaugesX, gaugesY)
  {
    // grab the leader and their tracked battler.
    const leader = $gameParty.leader();
    const leaderBattler = $gameParty.leaderJabsBattler();

    // if we cannot resolve the tracked battler, don't draw.
    if (!leader || !leaderBattler) return;

    // decide visibility based on the combat rules.
    const inCombat = leaderBattler.isInCombat();

    // grab the hp gauge sprite for width math (hp/mp/tp share the same width).

    // fetch or create the three sprites we need.
    const icon = this.getOrCreateCombatIcon(leader);
    const timer = this.getOrCreateCombatTimer(leader);
    const label = this.getOrCreateCombatLabel(leader);

    // determine anchor coordinates to the immediate right of the gauges.
    const hpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_PartyFrame.gaugeTypes.HP);
    const iconX = gaugesX + hpGauge.bitmapWidth() + ImageManager.iconWidth;
    const iconY = gaugesY + 10; // align with the HP row.
    icon.move(iconX, iconY);

    // move the timer to be centered below the icon.
    const timerWidth = timer.bitmap
      ? timer.bitmap.width
      : ImageManager.iconWidth;
    const timerX = iconX + Math.floor((ImageManager.iconWidth - timerWidth) / 2);
    const timerY = iconY + ImageManager.iconHeight - 16;
    timer.move(timerX, timerY);

    // move the label to be centered above the icon.
    const labelX = iconX - Math.floor((label.bitmap.width - ImageManager.iconWidth) / 2);
    const labelY = iconY - label.bitmap.height + 20;
    label.move(labelX, labelY);

    // configure a per‑frame fade step for ~0.5 seconds at 60fps.
    const fadeStep = 9; // 255 / 30 ≈ 8.5 → 9

    // we only branch once on inCombat for all three sprites.
    if (inCombat)
    {
      // icon: snap visible and fully opaque while in combat.
      icon.visible = true;
      icon.opacity = 255;

      // timer: update text, show, fully opaque.
      const seconds = leaderBattler.getCombatSecondsRemaining();
      const secondsText = Number(seconds)
        .toFixed(1);
      timer.setText(secondsText);
      timer.show();
      timer.opacity = 255;

      // label: red "IN COMBAT" above the icon.
      label.setColor('#ff3b3b');
      label.setText('IN COMBAT');
      label.show();
      label.opacity = 255;
    }
    else
    {
      // not in combat: fade the icon and timer out over ~0.5s, then hide.

      // icon fade.
      if (icon.opacity > 0)
      {
        icon.opacity = Math.max(0, icon.opacity - fadeStep);
        icon.visible = true;
        if (icon.opacity === 0) icon.visible = false;
      }
      else
      {
        icon.visible = false;
      }

      // timer fade.
      if (timer.opacity > 0)
      {
        timer.opacity = Math.max(0, timer.opacity - fadeStep);
        if (timer.opacity === 0) timer.hide();
      }
      else
      {
        timer.hide();
      }

      // label: instant green "FREE" for strong visual contrast when idle.
      label.setColor('#44ff66');
      label.setText('FREE');
      label.show();
      label.opacity = 255;
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
        const stackKey = this.makeStateStackCountSpriteKey(leader, state.stateId);

        // check if we have an icon sprite to hide.
        if (this._hudSprites.has(iconKey))
        {
          // fetch and hide it.
          const iconSprite = this._hudSprites.get(iconKey);
          iconSprite.hide();
        }

        // check if we have a timer sprite to hide.
        if (this._hudSprites.has(timerKey))
        {
          // fetch and clear and hide it.
          const timerSprite = this._hudSprites.get(timerKey);
          timerSprite.setText(String.empty);
          timerSprite.hide();
        }

        // check if we have a stack count sprite to hide.
        if (this._hudSprites.has(stackKey))
        {
          // fetch and clear and hide it.
          const stackSprite = this._hudSprites.get(stackKey);
          stackSprite.setText(String.empty);
          stackSprite.hide();
        }
      });
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
    // don't render an eternal duration- they are just -1.
    if (trackedState.hasEternalDuration() === false)
    {
      const seconds = (trackedState.duration / 60).toFixed(1);
      const timerSprite = this.getOrCreateStateTimer(actor, trackedState);
      timerSprite.setText(seconds);
      timerSprite.move(ox, y + 20);
      timerSprite.show();
    }

    const iconSprite = this.getOrCreateStateIcon(actor, trackedState.stateId);
    iconSprite.move(ox, y);
    iconSprite.show();

    this.modFontSize(-4);
    this.toggleBold();
    this.toggleItalics();

    const stackSprite = this.getOrCreateStateStackCount(actor, trackedState);
    if (trackedState.stackCount > 1)
    {
      stackSprite.setText(`x${trackedState.stackCount}`);
      stackSprite.move(ox, y - ImageManager.iconHeight);
      stackSprite.show();
    }
    else
    {
      stackSprite.setText(String.empty);
      stackSprite.hide();
    }

    this.resetFontSettings();
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
    hpGauge.move(x, oy + lh * 0);
    hpGauge.show();

    // grab and locate the sprite.
    const mpGauge = this.getOrCreateMiniSizeGaugeSprite(ally, Window_PartyFrame.gaugeTypes.MP);
    mpGauge.activateGauge();
    mpGauge.move(x, oy + lh * 1);
    mpGauge.show();

    // grab and locate the sprite.
    const tpGauge = this.getOrCreateMiniSizeGaugeSprite(ally, Window_PartyFrame.gaugeTypes.TP);
    tpGauge.activateGauge();
    tpGauge.move(x, oy + lh * 2);
    tpGauge.show();
  }

  //endregion draw
}

//endregion Window_PartyFrame