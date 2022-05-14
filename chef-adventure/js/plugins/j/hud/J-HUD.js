//#region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v2.0 HUD] Provides CORE functionality for this hud system.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-ABS
 * @base J-BASE
 * @base J-HUD
 * @orderAfter J-ABS
 * @orderAfter J-BASE
 * @orderAfter J-HUD
 * @help
 * ============================================================================
 * This plugin is the core of the J-HUD system.
 * By itself, it doesn't actually do anything, it is simply the manager that
 * all extensions of the HUD leverage to communicate their displayed data to
 * the user.
 *
 * In other words, the $hudManager object is created and saved here.
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
J.HUD.PluginParameters = PluginManager.parameters(J.HUD.Metadata.Name);

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

/**
 * A global object for managing the hud.
 * @global
 * @type {Hud_Manager}
 */
var $hudManager = null;

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
   * The current target being tracked.
   * @type {FramedTarget|null}
   */
  #newTarget = null;

  /**
   * Whether or not we have a request to refresh the inactivity timer of the target frame.
   * @type {boolean}
   */
  #requestTargetFrameRefreshInactivity = false;

  /**
   * Whether or not we have a request to refresh the input frame.
   * @type {boolean}
   */
  #requestRefreshInputFrame = false;

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

    if (this.#hasRequestHideHud())
    {
      this.#hideHud();
      this.requestRefreshHud();
    }

    if (this.#hasRequestShowAllies())
    {
      this.#showAllies();
      this.requestRefreshHud();
    }

    if (this.#hasRequestHideAllies())
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

  /**
   * Whether or not we have a request to assign a new target to the target frame.
   * @returns {boolean} True if we have a request, false otherwise.
   */
  hasRequestAssignTarget()
  {
    return this.#newTarget !== null;
  };

  /**
   * Gets the currently tracked target.
   * @returns {FramedTarget|null}
   */
  getNewTarget()
  {
    return this.#newTarget;
  };

  /**
   * Sets the provided target to the tracker.
   * @param {FramedTarget|null} newTarget The target to track.
   */
  setNewTarget(newTarget)
  {
    this.#newTarget = newTarget;
  };

  /**
   * Requests the target frame to refresh its inactivity timer.
   */
  requestTargetFrameRefresh()
  {
    this.#setRequestTargetFrameRefreshInactivity(true);
  };

  /**
   * Gets whether or not we have a request to refresh the target frame's
   * inactivity timer.
   * @returns {boolean}
   */
  hasRequestTargetFrameRefreshInactivityTimer()
  {
    return this.#requestTargetFrameRefreshInactivity;
  };

  /**
   * Acknowledges the request to refresh the target frame's inactivity timer.
   */
  acknowledgeTargetFrameInactivityTimerRefresh()
  {
    this.#setRequestTargetFrameRefreshInactivity(false);
  };

  /**
   * Acknowledges the request to assign a new target to the target frame.
   */
  acknowledgeAssignedTarget()
  {
    this.setNewTarget(null);
  };

  /**
   * Issue a request to refresh the input frame.
   */
  requestRefreshInputFrame()
  {
    this.#setRequestRefreshInputFrame(true);
  };

  /**
   * Checks whether or not we have a request to refresh the input frame.
   * @returns {boolean} True if we have a request, false otherwise.
   */
  hasRequestRefreshInputFrame()
  {
    return this.#requestRefreshInputFrame;
  };

  /**
   * Acknowledge the request to refresh the input frame.
   */
  acknowledgeRefreshInputFrame()
  {
    this.#setRequestRefreshInputFrame(false);
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
   * Sets whether or not the target frame window to refresh the timer.
   * @param request
   */
  #setRequestTargetFrameRefreshInactivity(request)
  {
    this.#requestTargetFrameRefreshInactivity = request;
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
   * Sets whether or not the input frame requires a refresh.
   * @param {boolean} request True if refresh is required, false otherwise.
   * @private
   */
  #setRequestRefreshInputFrame(request)
  {
    this.#requestRefreshInputFrame = request;
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
  if (!$hudManager)
  {
    // if somehow we're missing this global object, then re-add it.
    $hudManager = new Hud_Manager();
  }
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
 * Extends the `update()` function to also monitor updates for the hud.
 */
J.HUD.Aliased.Scene_Map.set('update', Scene_Map.prototype.update);
Scene_Map.prototype.update = function()
{
  // perform original logic.
  J.HUD.Aliased.Scene_Map.get('update').call(this);

  // keep our HUD up to date.
  this.updateHudFrames();
};

/**
 * The update loop for the hud manager.
 */
Scene_Map.prototype.updateHudFrames = function()
{
  // the update loop for the hud manager.
  $hudManager.update();
};

/**
 * A hook for refreshing all frames of the HUD.
 */
Scene_Map.prototype.refreshHud = function() { };
//#endregion Scene_Map
//#endregion Scene objects

//#region Window objects
//#region Window_InputFrame
/**
 * A base class with some common sprite-cache-management features.
 */
class Window_Frame extends Window_Base
{
  /**
   * Constructor.
   * @param {Rectangle} rect The shape of this window.
   */
  constructor(rect) { super(rect); };

  /**
   * Initializes the properties of this class.
   * @param {Rectangle} rect The rectangle representing this window.
   */
  initialize(rect)
  {
    // perform original logic.
    super.initialize(rect);

    // add our extra data points to track.
    this.initMembers();

    // run any one-time configuration changes.
    this.configure();
  };

  /**
   * Initializes all members of this class.
   */
  initMembers()
  {
    /**
     * The over-arching object that contains all properties for this plugin.
     */
    this._j ||= {};

    /**
     * The cached collection of sprites.
     * @type {Map<string, Sprite_Icon|Sprite_Text|Sprite_SkillCost|Sprite_ComboGauge|Sprite_ActorValue|Sprite_MapGauge|Sprite_Gauge|Sprite_FlowingGauge|Sprite_Face|Sprite>}
     */
    this._j._spriteCache = new Map();
  };

  /**
   * Executes any one-time configuration required for this window.
   */
  configure()
  {
    // build the image cache for the first time.
    this.refreshCache();
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
    this._j._spriteCache.forEach((value, _) => value.destroy());

    // empty the collection of all references.
    this._j._spriteCache.clear();
  };

  /**
   * Empties and recreates the entire cache of sprites.
   */
  createCache()
  {
    // fill with sprite creation methods.
  };
  //#endregion caching

  /**
   * Hooks into the update loop to include updating for this frame.
   */
  update()
  {
    // perform original logic.
    super.update();

    // update this frame.
    this.updateFrame();
  };

  /**
   * Updates the logic for this window frame.
   */
  updateFrame()
  {
    // fill with window frame logic.
  };
}
//#endregion Window_InputFrame
//#endregion Window objects


//ENDOFFILE