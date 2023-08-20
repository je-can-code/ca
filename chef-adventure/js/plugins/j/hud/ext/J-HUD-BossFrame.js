//region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 HUD-BOSS] A HUD frame that displays a single target, like a boss.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @base J-ABS
 * @base J-HUD
 * @base J-HUD-TargetFrame
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-HUD
 * @orderAfter J-HUD-TargetFrame
 * @help
 * ============================================================================
 * OVERVIEW:
 * This plugin is an extension of the J-HUD-TargetFrame plugin, designed for
 * JABS. It generates a window on the map displaying a single target at a much
 * bigger scale than the J-HUD-TargetFrame does.
 * ============================================================================
 * CHANGELOG:
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
  const requiredBaseVersion = '2.1.3';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }

  // Check to ensure we have the minimum required version of the J-HUD plugin.
  const requiredHudVersion = '2.0.0';
  const hasHudRequirement = J.BASE.Helpers.satisfies(J.HUD.Metadata.Version, requiredHudVersion);
  if (!hasHudRequirement)
  {
    throw new Error(`Either missing J-HUD or has a lower version than the required: ${requiredHudVersion}`);
  }
})();
//endregion version check

/**
 * The plugin umbrella that governs all things related to this extension plugin.
 */
J.HUD.EXT.BOSS = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.HUD.EXT.BOSS.Metadata = {};
J.HUD.EXT.BOSS.Metadata.Version = '1.0.0';
J.HUD.EXT.BOSS.Metadata.Name = `J-HUD-BossFrame`;

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.HUD.EXT.BOSS.PluginParameters = PluginManager.parameters(J.HUD.EXT.BOSS.Metadata.Name);

/**
 * A collection of all aliased methods for this plugin.
 */
J.HUD.EXT.BOSS.Aliased = {};
J.HUD.EXT.BOSS.Aliased.Hud_Manager = new Map();
J.HUD.EXT.BOSS.Aliased.Scene_Map = new Map();

/**
 * All regular expressions used by this plugin.
 */
J.HUD.EXT.BOSS.RegExp = {};
//endregion introduction

//region BossFrameManager
class BossFrameManager
{
  //region properties
  /**
   * The boss in the frame.
   * @type {FramedTarget|null}
   */
  static boss = null;

  /**
   * Whether or not we have a new boss to refresh for.
   * @type {boolean}
   */
  static #newBossRequest = false;

  /**
   * Whether or not we have a request to hide the boss frame.
   * @type {boolean}
   */
  static #hideBossRequest = false;

  /**
   * Whether or not we have a request to show the boss frame.
   * @type {boolean}
   */
  static #showBossRequest = false;
  //endregion properties

  /**
   * Gets the current boss.
   * @returns {FramedTarget|null}
   */
  static getBossFrame()
  {
    return this.boss;
  }

  /**
   * Sets the current boss to the given target.
   * @param {FramedTarget} boss The given target.
   */
  static setBossFrame(boss)
  {
    // update the boss.
    this.boss = boss;

    // request a refresh.
    this.requestBossFrameRefresh();
  }

  /**
   * Sets the current boss to the data that resides within a given event
   * by its eventId.
   * @param {number} eventId The id of the event to set the boss to.
   */
  static setBossByEventId(eventId)
  {
    // build the boss framedTarget by the eventId.
    const bossTarget = this.#createBossFrameFromEventId(eventId);

    // set the boss.
    this.setBossFrame(bossTarget);
  }

  //region boss checking
  /**
   * Get the {@link Game_Battler} associated with this boss.
   * @returns {Game_Battler|null}
   */
  static getBossGameBattler()
  {
    if (!this.boss) return null;

    return this.boss.battler;
  }

  /**
   * Get the {@link JABS_Battler} associated with this boss.
   * @returns {JABS_Battler|null}
   */
  static getBossJabsBattler()
  {
    // if there is no boss, then there is no jabs battler.
    if (!this.boss) return null;

    // grab the underlying battler.
    const gameBattler = this.getBossGameBattler();

    // return the matching JABS battler.
    return JABS_AiManager.getBattlerByUuid(gameBattler.getUuid());
  }

  /**
   * Gets the boss's current percent of health.
   * @returns {number}
   */
  static getBossHpPercent()
  {
    if (!this.boss) return 0;

    return this.getBossGameBattler().currentHpPercent100();
  }

  /**
   * Determines whether or not the boss is above a given hp percent threshold.
   * @param {number} hpPercentThreshold The amount to check if the boss is inclusively above.
   * @returns {boolean} True if the boss is above the given amount, false otherwise.
   */
  static isBossAboveHpThreshold(hpPercentThreshold)
  {
    // if there is no boss, then default to false.
    if (!this.boss) return false;

    // determine if the boss is above the threshold.
    const aboveThreshold = this.getBossGameBattler().currentHpPercent100() >= hpPercentThreshold;

    // return the result.
    return aboveThreshold;
  }

  /**
   * Determines whether or not the boss is below a given hp percent threshold.
   * @param {number} hpPercentThreshold The amount to check if the boss is inclusively below.
   * @returns {boolean} True if the boss is below the given amount, false otherwise.
   */
  static isBossBelowHpThreshold(hpPercentThreshold)
  {
    // if there is no boss, then default to false.
    if (!this.boss) return false;

    // determine if the boss is below the threshold.
    const aboveThreshold = this.getBossGameBattler().currentHpPercent100() <= hpPercentThreshold;

    // return the result.
    return aboveThreshold;
  }

  /**
   * Determines whether or not the boss is between two given hp percents.
   * @param {number} lowerRange The lowest inclusive hp percent allowed.
   * @param {number} upperRange The highest inclusive hp percent allowed.
   * @returns {boolean} True if the boss is within the range, false otherwise.
   */
  static isBossWithinHpRange(lowerRange, upperRange)
  {
    // if there is no boss, then default to false.
    if (!this.boss) return false;

    // check where the battler's currently is at.
    const hpPercent = this.getBossGameBattler().currentHpPercent100();

    // determine if the boss is within the threshold.
    const withinThreshold = lowerRange <= hpPercent <= upperRange;

    // return the result.
    return withinThreshold;
  }
  //endregion boss checking

  //region refresh
  /**
   * Whether or not the boss frame requires a refresh.
   * @returns {boolean}
   */
  static needsBossFrameRefresh()
  {
    return this.#newBossRequest;
  }

  /**
   * Requests the boss frame to be refreshed.
   */
  static requestBossFrameRefresh()
  {
    this.#newBossRequest = true;
  }

  /**
   * Acknowledges the refresh request for the boss frame.
   */
  static acknowledgeBossFrameRefresh()
  {
    this.#newBossRequest = false;
  }
  //endregion refresh

  //region hide
  /**
   * Whether or not the boss frame requires hiding.
   * @returns {boolean}
   */
  static needsBossFrameHiding()
  {
    return this.#hideBossRequest;
  }

  /**
   * Requests the boss frame to be concealed.
   */
  static requestHideBossFrame()
  {
    this.#hideBossRequest = true;
  }

  /**
   * Acknowledges the request for the boss frame to be concealed.
   */
  static acknowledgeBossFrameHidden()
  {
    this.#hideBossRequest = false;
  }
  //endregion hide

  //region show
  /**
   * Whether or not the boss frame requires showing.
   * @returns {boolean}
   */
  static needsBossFrameShowing()
  {
    return this.#showBossRequest;
  }

  /**
   * Requests the boss frame to be revealed.
   */
  static requestShowBossFrame()
  {
    this.#showBossRequest = true;
  }

  /**
   * Acknowledges the request for the boss frame to be revealed.
   */
  static acknowledgeBossFrameShown()
  {
    this.#showBossRequest = false;
  }
  //endregion show

  //region privates
  /**
   * Creates a {@link FramedTarget} based on the data that resides in the event
   * of the given eventId.
   * @param {number} eventId The event id to generate a boss from.
   * @returns {FramedTarget}
   */
  static #createBossFrameFromEventId(eventId)
  {
    // validate we can create a boss from this event.
    if (!this.#canCreateBossFrameFromEventId(eventId))
    {
      console.error(`could not create a boss from event of id: [ ${eventId} ].`);
      throw new Error('Failed to create boss for boss frame.');
    }

    // grab the battler for the event.
    const bossJabsBattler = $gameMap.event(eventId).getJabsBattler();

    // grab the battler from the jabs battler.
    const bossBattler = bossJabsBattler.getBattler();

    // generate the target configuration- default is fine for now.
    const framedTargetConfiguration = new FramedTargetConfiguration();

    // build the boss's framed target.
    const framedTarget = new FramedTarget(
      bossBattler.name(),
      String.empty,
      14,
      bossBattler,
      framedTargetConfiguration);

    // return the built target.
    return framedTarget;
  }

  /**
   * Determines whether or not we can build a boss from the given eventId.
   * @param {number} eventId The id of the event to build a boss from.
   * @returns {boolean} True if a boss can be built from the eventId, false otherwise.
   */
  static #canCreateBossFrameFromEventId(eventId)
  {
    // if the eventId is invalid, we can't create from that.
    if (!eventId) return false;

    // if the eventId is not a valid eventId, we cannot create from that.
    if (!$gameMap.event(eventId).getJabsBattler()) return false;

    // create the boss!
    return true;
  }
  //endregion privates
}
//endregion BossFrameManager

//region Scene_Map
/**
 * Extends {@link #initHudMembers}.
 * Includes initialization of the boss frame members.
 */
J.HUD.EXT.BOSS.Aliased.Scene_Map.set('initHudMembers', Scene_Map.prototype.initHudMembers);
Scene_Map.prototype.initHudMembers = function()
{
  // perform original logic.
  J.HUD.EXT.BOSS.Aliased.Scene_Map.get('initHudMembers').call(this);

  /**
   * A grouping of all properties that belong to the boss frame
   * extension of the HUD.
   */
  this._j._hud._boss = {};

  /**
   * The target frame showing boss data.
   * This is much bigger than the regular target frame.
   * @type {Window_BossFrame}
   */
  this._j._hud._boss._frame = null;
};

/**
 * Extends {@link #createAllWindows}.
 * Includes creation of the boss frame window.
 */
J.HUD.EXT.BOSS.Aliased.Scene_Map.set('createAllWindows', Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function()
{
  // perform original logic.
  J.HUD.EXT.BOSS.Aliased.Scene_Map.get('createAllWindows').call(this);

  // create the boss frame.
  this.createBossFrameWindow();
};

//region boss frame
/**
 * Creates the boss frame window and adds it to tracking.
 */
Scene_Map.prototype.createBossFrameWindow = function()
{
  // create the window.
  const window = this.buildBossFrameWindow();

  // update the tracker with the new window.
  this.setBossFrameWindow(window);

  // add the window to the scene manager's tracking.
  this.addWindow(window);
};

/**
 * Sets up and defines the boss frame window.
 * @returns {Window_BossFrame}
 */
Scene_Map.prototype.buildBossFrameWindow = function()
{
  // define the rectangle of the window.
  const rectangle = this.bossFrameWindowRect();

  // create the window with the rectangle.
  const window = new Window_BossFrame(rectangle);

  // return the built and configured window.
  return window;
}

/**
 * Creates the rectangle representing the window for the boss frame.
 * @returns {Rectangle}
 */
Scene_Map.prototype.bossFrameWindowRect = function()
{
  // define the width of the window.
  const width = Graphics.boxWidth - 400;

  // define the height of the window.
  const height = 120;

  // define the origin x of the window.
  const x = (Graphics.boxWidth - width) / 2;

  // define the origin y of the window.
  const y = 0;

  // return the built rectangle.
  return new Rectangle(x, y, width, height);
};

/**
 * Gets the currently tracked boss frame window.
 * @returns {Window_BossFrame}
 */
Scene_Map.prototype.getBossFrameWindow = function()
{
  return this._j._hud._boss._frame;
}

/**
 * Set the currently tracked boss frame window to the given window.
 * @param {Window_BossFrame} window The window to track.
 */
Scene_Map.prototype.setBossFrameWindow = function(window)
{
  this._j._hud._boss._frame = window;
}
//endregion boss frame

/**
 * Extends {@link #updateHudFrames}.
 * Includes updating the target frame.
 */
J.HUD.EXT.BOSS.Aliased.Scene_Map.set('updateHudFrames', Scene_Map.prototype.updateHudFrames);
Scene_Map.prototype.updateHudFrames = function()
{
  // perform original logic.
  J.HUD.EXT.BOSS.Aliased.Scene_Map.get('updateHudFrames').call(this);

  // manages boss frame assignments.
  this.handleAssignBoss();

  // manage boss frame visibility.
  this.handleBossFrameVisibility();
};

/**
 * Handles incoming requests to assign a boss to the boss frame.
 */
Scene_Map.prototype.handleAssignBoss = function()
{
  // if there is no request, then don't process.
  if (!BossFrameManager.needsBossFrameRefresh()) return;

  // grab the new boss.
  const newBoss = BossFrameManager.getBossFrame();

  // set the target frame's target to this new target.
  this.getBossFrameWindow().setTarget(newBoss);

  // let the boss manager know we've done the deed.
  BossFrameManager.acknowledgeBossFrameRefresh();
};

Scene_Map.prototype.handleBossFrameVisibility = function()
{
  // manage visibility if necessary.
  this.handleHideBossFrame();
  this.handleShowBossFrame();
};

Scene_Map.prototype.handleHideBossFrame = function()
{
  // do nothing if we have no request.
  if (!BossFrameManager.needsBossFrameHiding()) return;

  // request the boss frame to be hidden.
  this.getBossFrameWindow().requestHideBossFrame();

  // let the manager know we've done the deed.
  BossFrameManager.acknowledgeBossFrameHidden();
};

Scene_Map.prototype.handleShowBossFrame = function()
{
  // do nothing if we have no request.
  if (!BossFrameManager.needsBossFrameShowing()) return;

  // request the boss frame to be shown.
  this.getBossFrameWindow().requestShowBossFrame();

  // let the manager know we've done the deed.
  BossFrameManager.acknowledgeBossFrameHidden();
};

//region Window_BossFrame
class Window_BossFrame extends Window_TargetFrame
{
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Initializes all members of this class.
   */
  initMembers()
  {
    // perform original logic.
    super.initMembers();

    this._j._hud ||= {};

    this._j._hud._boss = {};

    this._j._hud._boss._requestHide = false;

    this._j._hud._boss._concealing = false;

    this._j._hud._boss._requestShow = false;

    this._j._hud._boss._revealing = false;
  }

  requestHideBossFrame()
  {
    this._j._hud._boss._requestHide = true;

    this.beginConcealing();
  }

  beginConcealing()
  {
    this._j._hud._boss._concealing = true;
  }

  endConcealing()
  {
    this._j._hud._boss._concealing = false;

    this.acknowledgeBossFrameHidden();
  }

  acknowledgeBossFrameHidden()
  {
    this._j._hud._boss._requestHide = false;
  }

  isStillConcealing()
  {
    return this._j._hud._boss._concealing;
  }

  requestShowBossFrame()
  {
    this._j._hud._boss._requestShow = true;

    this.beginRevealing();
  }

  beginRevealing()
  {
    this._j._hud._boss._revealing = true;
  }

  endRevealing()
  {
    this._j._hud._boss._revealing = false;
  }

  isStillRevealing()
  {
    return this._j._hud._boss._revealing;
  }

  //region caching
  /**
   * Ensures all sprites are created and available for use.
   */
  createCache()
  {
    // cache the target hp gauge.
    this.getOrCreateTargetHpGaugeSprite();

    // remove the mp/tp gauges for bosses.
  }

  /**
   * Creates an target gauge sprite for this window and caches it.
   * @returns {Sprite_FlowingGauge} The gauge sprite of the target.
   */
  getOrCreateTargetHpGaugeSprite()
  {
    // the key for this actor's full face sprite.
    const key = `bossframe-enemy-hp-gauge`;

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new enemy gauge sprite.
    const sprite = new Sprite_FlowingGauge();

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();
    sprite.scale.x = 10;
    sprite.scale.y = 1;

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }
  //endregion caching

  handleInactivity()
  {
    // boss frames don't go inactive.
  }

  update()
  {
    super.update();

    this.manageBossFrameVisibility();
  }

  manageBossFrameVisibility()
  {
    if (this.isStillConcealing())
    {
      this.fadeOutWindow();
    }

    if (this.isStillRevealing())
    {
      this.fadeInWindow();
    }
  }

  /**
   * Fades out the boss frame window along with all sprites and content.
   */
  fadeOutWindow()
  {
    // perform original logic.
    this.contentsOpacity -= 10;
    this._j._spriteCache.forEach((sprite, _) => sprite.opacity -= 10);

    // verify the opacities.
    const contentsOpacityZero = this.contentsOpacity <= 0;

    // determine if this frame is done concealing.
    const doneFading = (contentsOpacityZero);

    // check if we're done concealing.
    if (doneFading)
    {
      // end the concealment process.
      this.endConcealing();
    }
  }

  /**
   * Fades in the boss frame window along with all sprites and content.
   */
  fadeInWindow()
  {
    // perform original logic.
    this.contentsOpacity += 40;
    this._j._spriteCache.forEach((sprite, _) => sprite.opacity += 40);

    // verify the opacities.
    const contentsOpacityMax = this.contentsOpacity >= 255;

    // determine if this frame is done revealing.
    const doneShowing = (contentsOpacityMax);

    // check if we're done revealing.
    if (doneShowing)
    {
      // end the revealment process.
      this.endRevealing();
    }
  }

  /**
   * Draws the target's name in the window.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawTargetName(x, y)
  {
    let name = `\\FS[24]${this.targetName()}`;
    if (J.MESSAGE)
    {
      name = `\\*`+ name;
    }

    const textWidth = this.textWidth(name);

    const centerX = (this.contentsWidth() / 2) - (textWidth / 2);

    this.drawTextEx(name, centerX, y, textWidth);
  }

  /**
   * Draws the target's various gauges.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawTargetBattlerGauges(x, y)
  {
    // draw all three of the primary gauges.
    this.drawTargetHpGauge(x, y);
  }
}
//endregion Window_BossFrame