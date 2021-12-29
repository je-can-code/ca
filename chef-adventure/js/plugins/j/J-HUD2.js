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
J.HUD2.Aliased.Scene_Map.set('onMapLoaded', Scene_Map.prototype.onMapLoaded);
Scene_Map.prototype.onMapLoaded = function()
{
  // perform original logic.
  J.HUD2.Aliased.Scene_Map.get('onMapLoaded').call(this);

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
  const width = 400;
  const height = 200;
  const x = 400;
  const y = 800;
  return new Rectangle(x, y, width, height);
};

/**
 * A window containing the HUD data for the map.
 */
class Window_Hud2 extends Window_Base
{
  constructor(rect)
  {
    super(rect);
  };

  initialize(rect)
  {
    // perform original logic.
    super.initialize(this, rect);

    // initialize our properties.
    this.initMembers();

    // run our one-time setup and configuration.
    this.configure();

    // initialize the cache.
    this.refreshCache();
  };

  /**
   * Initialize all properties of this class.
   */
  initMembers()
  {
    /**
     * The cached collection of hud sprites.
     * @type {Map<string, Sprite>}
     */
    this._hudSprites = new Map();
  };

  /**
   * Performs the one-time setup and configuration per instantiation.
   */
  configure()
  {
    // make the window's background opacity transparent.
    // this.opacity = 0;
  };

  /**
   * Redraw all contents of the window.
   */
  refresh()
  {
    this.contents.clear();
    this.drawHud();
  };

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
    this._hudSprites.forEach((value, key) => value.destroy());

    // empty the collection of all references.
    this._hudSprites.clear();
  };

  /**
   * Recreates any missing sprites in the cache.
   */
  createCache()
  {
    // iterate over each of the battle members in the party.
    $gameParty.battleMembers().forEach(actor =>
    {
      // cache the full-sized face images for each actor.
      this.getOrCreateFullSizeFaceSprite(actor);

      // cache the mini-sized face images for each actor.
      this.getOrCreateMiniSizeFaceSprite(actor);
    });
  };

  /**
   * Creates the key for an actor's face sprite based on the parameters.
   * @param {Game_Actor} actor The actor to create a key for.
   * @param {boolean} isFull Whether or not this is for a full-sized sprite.
   */
  makeSpriteKey(actor, isFull)
  {
    return isFull
      ? `actor-full-${actor.name()}-${actor.actorId()}`
      : `actor-mini-${actor.name()}-${actor.actorId()}`;
  };

  /**
   * Creates a full-sized face sprite for the given actor and caches it.
   * @param {Game_Actor} actor The actor to draw a full face sprite for.
   */
  getOrCreateFullSizeFaceSprite(actor)
  {
    // the key for this actor's full face sprite.
    const key = this.makeSpriteKey(actor, true);

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
    this.addInnerChild(sprite);

    // return the created full sprite.
    return sprite;
  };

  /**
   * Creates a mini-sized face sprite for the given actor and caches it.
   * @param {Game_Actor} actor The actor to draw a mini face sprite for.
   */
  getOrCreateMiniSizeFaceSprite(actor)
  {
    // the key for this actor's full face sprite.
    const key = this.makeSpriteKey(actor, false);

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
    this.addInnerChild(sprite);

    // return the created mini sprite.
    return sprite;
  };

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
    this.drawLeader(0, 0);

    // draw all allies' data.
    this.drawAllies();
  };

  /**
   * Draw the leader's data for the HUD.
   */
  drawLeader(x, y)
  {
    this.drawLeaderFace(x, y);
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

    // make the key for this actor's leader face sprite.
    const key = this.makeSpriteKey(leader, true);

    // grab and locate the sprite.
    const sprite = this.getOrCreateFullSizeFaceSprite(leader);
    sprite.move(x, y);
    sprite.show();
    this.drawTextEx(`hello world \\Skill[1], wow.`, 0, 0, 400);
  };

  drawAllies()
  {
  };
}