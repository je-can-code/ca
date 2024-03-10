/*:
 * @target MZ
 * @plugindesc
 * [v1.1.0 UTIL] Various system utilities.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @help
 * ============================================================================
 * OVERVIEW:
 * This plugin provides a small set of system utility functions that may or
 * may not be helpful to all users.
 *
 * NEW FUNCTIONS:
 * - F6 toggles all sound on/off.
 * - autostart newgame on testplay (when plugin parameter enabled).
 * - pull up devtools window in background upon testplay (always).
 * ============================================================================
 * CHANGELOG:
 * - 1.1.0
 *    Implements strongly-typed plugin metadata.
 *    Added "pull up devtools upon testplay" functionality.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 * @param autostart-newgame
 * @type boolean
 * @text Autostart Newgame
 * @desc Automatically start a new game when playtesting the game.
 * @default true
 *
 * @param autoload-devtools
 * @type boolean
 * @text Autoload Devtools
 * @desc Automatically load the devtools console when playtesting the game.
 * @default true
 */

//region plugin metadata
class J_UtilsPluginMetadata extends PluginMetadata
{
  /**
   * Constructor.
   */
  constructor(name, version)
  {
    super(name, version);
  }

  /**
   *  Extends {@link #postInitialize}.<br>
   *  Includes translation of plugin parameters.
   */
  postInitialize()
  {
    // execute original logic.
    super.postInitialize();

    /**
     * Whether or not to use the "auto-newgame" feature.
     * @type {boolean}
     */
    this.autostartNewgame = this.parsedPluginParameters['autostart-newgame'] === 'true';

    /**
     * Whether or not to use the "auto-newgame" feature.
     * @type {boolean}
     */
    this.autoloadDevtools = this.parsedPluginParameters['autoload-devtools'] === 'true';
  }
}
//endregion plugin metadata

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.UTILS = {};

/**
 * The metadata associated with this plugin, such as name and version.
 */
J.UTILS.Metadata = new J_UtilsPluginMetadata('J-SystemUtilities', '1.0.1');

/**
 * A collection of all aliased methods for this plugin.
 */
J.UTILS.Aliased = {
  Game_Actor: new Map(),
  Game_Temp: new Map(),
  Scene_Base: new Map(),
  Scene_Boot: new Map(),
  Scene_Map: new Map(),
};

/**
 * A collection of all helper functions that don't need to live anywhere specific.
 */
J.UTILS.Helpers = {};

/**
 * Checks recursively how deep an object goes.
 *
 * This was used once to help troubleshoot where I accidentally created an infinitely nested
 * save object. I used this function to check each of the chunks of data in the save file to
 * see which was the one that was infinitely deep.
 * @param {any} o The object to check.
 * @returns {number} Chances are if this returns a number you're fine, otherwise it'll hang.
 */
J.UTILS.Helpers.depth = (o) =>
  Object (o) === o ? 1 + Math.max(-1, ...Object.values(o).map(J.UTILS.Helpers.depth)) : 0;

/**
 * Overrides {@link Bitmap#_createCanvas}.<br>
 * Adds an additional "willReadFrequently" attribute set to true on the canvas.
 * This forces software-based rendering, which is supposedly optimal based
 * on the way this code is written, according to Chromium's warning.
 * @param {number} width The width in pixels of the canvas.
 * @param {number} height The height in pixels of the canvas.
 * @private
 * @override
 */
Bitmap.prototype._createCanvas = function(width, height)
{
  this._canvas = document.createElement("canvas");

  // applies the new attribute to change it to software rendering.
  this._context = this._canvas.getContext("2d", { willReadFrequently: true });

  this._canvas.width = width;
  this._canvas.height = height;
  this._createBaseTexture(this._canvas);
};

//region Input
/**
 * Extends the existing mapper to track additional inputs.
 */
Input.keyMapper =
  {
    // ... the rest of the input keys.
    ...Input.keyMapper,

    // F6, the volume toggle key.
    117: 'volumeToggle',
  };
//endregion Input

/**
 * Extends {@link Game_Actor.onLearnNewSkill}.<br>
 * Wraps the function so that if a new skill is learned, it'll echo to the console.
 */
J.UTILS.Aliased.Game_Actor.set('onLearnNewSkill', Game_Actor.prototype.onLearnNewSkill);
Game_Actor.prototype.onLearnNewSkill = function(skillId)
{
  // perform original logic.
  J.UTILS.Aliased.Game_Actor.get('onLearnNewSkill').call(this, skillId);

  // instead of responding with undefined to the console, return the name of the skill.
  return `[${skillId}] {${this.skill(skillId).name}} was learned.`;
};

/**
 * Extends {@link Game_Actor.onForgetSkill}.<br>
 * Wraps the function so that if a skill is forgotten, it'll echo back to the console.
 */
J.UTILS.Aliased.Game_Actor.set('onForgetSkill', Game_Actor.prototype.onForgetSkill);
Game_Actor.prototype.onForgetSkill = function(skillId)
{
  // perform original logic.
  J.UTILS.Aliased.Game_Actor.get('onForgetSkill').call(this, skillId);

  // instead of responding with undefined to the console, return the name of the skill.
  return `[${skillId}] {${this.skill(skillId).name}} was not learned.`;
};

/**
 * Now you can retrieve the player's battler from the player.
 * This is synonymous with {@link Game_Party.leader}.<br>
 * @returns {Game_Actor|null}
 */
Game_Player.prototype.battler = function()
{
  // the leader is synonymous for the player.
  const battler = $gameParty.leader();

  // check if we have a leader battler.
  if (!battler)
  {
    console.warn("There is currently no leader.");
    return null;
  }

  // return the found battler.
  return battler;
};

/**
 * Extends {@link Game_Temp.prototype.initMembers}.<br>
 * Intializes all additional members of this class.
 */
J.UTILS.Aliased.Game_Temp.set('initMembers', Game_Temp.prototype.initMembers);
Game_Temp.prototype.initMembers = function()
{
  // perform original logic.
  J.UTILS.Aliased.Game_Temp.get('initMembers').call(this);

  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with JABS.
   */
  this._j._utils ||= {};

  /**
   * Whether or not to use the click-to-log-event functionality.
   * @type {boolean}
   */
  this._j._utils._useClickToLogEvent = true;
};

/**
 * Gets whether or not to use the click-to-log-event functionality.
 * @returns {boolean}
 */
Game_Temp.prototype.canClickToLogEvent = function()
{
  return this._j._utils._useClickToLogEvent;
};

/**
 * Enables the click-to-log-event functionality.
 */
Game_Temp.prototype.enableClickToLogEvent = function()
{
  this._j._utils._useClickToLogEvent = true;
};

/**
 * Disables the click-to-log-event functionality.
 */
Game_Temp.prototype.disableClickToLogEvent = function()
{
  this._j._utils._useClickToLogEvent = false;
};

Game_Temp.prototype.getAllArmorNames = function()
{
  const mapping = armor =>
  {
    if (!armor) return;

    if (armor.name.startsWith('===')) return;

    return {
      key: armor._key(),
      name: armor.name,
      description: armor.description
    };
  }

  return $dataArmors.map(mapping);
};

//region Scene_Base
/**
 * Extends the `.update()` to include a watcher for whether or not
 * the volume toggle button is pressed.
 */
J.UTILS.Aliased.Scene_Base.set('update', Scene_Base.prototype.update);
Scene_Base.prototype.update = function()
{
  // perform original logic.
  J.UTILS.Aliased.Scene_Base.get('update').call(this);

  // check if the volume toggling is happening.
  if (this.isVolumeToggling())
  {
    // then toggle the volume on/off.
    this.toggleVolume();
  }
};

/**
 * Gets whether or not the player is pressing the "volume toggle" button.
 *
 * This button is F6 by default.
 * @returns {boolean}
 */
Scene_Base.prototype.isVolumeToggling = function()
{
  return Input.isTriggered('volumeToggle');
};

/**
 * Flips the volume on or off.
 */
Scene_Base.prototype.toggleVolume = function()
{
  const { bgmVolume, bgsVolume, meVolume, seVolume } = ConfigManager;
  const isMuted = !bgmVolume || !bgsVolume || !meVolume || !seVolume;
  if (isMuted)
  {
    // if one of the channels is muted, unmute everything.
    ConfigManager.bgmVolume = 100;
    ConfigManager.bgsVolume = 100;
    ConfigManager.meVolume = 100;
    ConfigManager.seVolume = 100;
  }
  else
  {
    // otherwise, mute everything.
    ConfigManager.bgmVolume = 0;
    ConfigManager.bgsVolume = 0;
    ConfigManager.meVolume = 0;
    ConfigManager.seVolume = 0;
  }
};
//endregion Scene_Base

//region Scene_Boot
/**
 * Extends `startNormalGame()` to accommodate plugin parameters.
 * If the "auto-newgame" parameter is true, then we skip straight into a new game,
 * bypassing the title screen altogether.
 */
J.UTILS.Aliased.Scene_Boot.set('startNormalGame', Scene_Boot.prototype.startNormalGame);
Scene_Boot.prototype.startNormalGame = function()
{
  // if using the "autostart-newgame" feature, then skip straight to a new game.
  if (J.UTILS.Metadata.autostartNewgame)
  {
    this.checkPlayerLocation();
    DataManager.setupNewGame();
    SceneManager.goto(Scene_Map);
  }
  // otherwise, perform original logic.
  else
  {
    J.UTILS.Aliased.Scene_Boot.get('startNormalGame').call(this);
  }
};

/**
 * Extends {@link #start}.<br>
 * Also shows the devtools window because I need that to do dev things.
 */
J.UTILS.Aliased.Scene_Boot.set('start', Scene_Boot.prototype.start);
Scene_Boot.prototype.start = function()
{
  // perform original logic.
  J.UTILS.Aliased.Scene_Boot.get('start').call(this);

  // if using the "autoload-devtools" feature, then also load this up.
  if (J.UTILS.Metadata.autoloadDevtools)
  {
    // show the dev tools automatically.
    SceneManager.showDevTools();

    // set a timer for after the devtools has loaded to focus the game window.
    setTimeout(() => nw.Window.get().focus(), 1000);
  }
};
//endregion Scene_Boot

/**
 * Overrides {@link Scene_Map.onMapTouch}.<br>
 * Disables auto-movement when clicking a tile on the map.
 * Logs event data of clicked events.
 */
Scene_Map.prototype.onMapTouch = function()
{
  const x = $gameMap.canvasToMapX(TouchInput.x);
  const y = $gameMap.canvasToMapY(TouchInput.y);

  // disable the auto-move functionality by removing it.
  //$gameTemp.setDestination(x, y);

  // log the event data at the given coordinates.
  this.logClickedTarget(x, y);
};

Scene_Map.prototype.logClickedTarget = function(x, y)
{
  // don't log if we aren't allowed to.
  if (!$gameTemp.canClickToLogEvent()) return;

  // log all events/player/allies clicked.
  this.logClickedEvents(x, y);
  this.logClickedPlayer(x, y);
  this.logClickedAnyAllies(x, y);
};

Scene_Map.prototype.logClickedEvents = function(x, y)
{
  // grab the clicked event list at the target x:y.
  const clickedEvents = $gameMap.eventsXy(x, y);

  // iterate over each of the events at the location to log their data.
  clickedEvents.forEach(event =>
  {
    // log out the data as-applicable.
    this.extractAndLogBattlerData(event, x, y);
  });
};

Scene_Map.prototype.logClickedPlayer = function(x, y)
{
  // make sure the player was clicked.
  if ($gamePlayer.pos(x, y))
  {
    // log the output.
    this.extractAndLogBattlerData($gamePlayer, x, y);
  }
};

Scene_Map.prototype.logClickedAnyAllies = function(x, y)
{
  // if we aren't showing followers, don't try to log their data.
  if (!$gamePlayer.followers().isVisible()) return;

  // iterate over the followers.
  $gamePlayer.followers().data().forEach(follower =>
  {
    // make sure the follower was clicked.
    if (follower.pos(x, y))
    {
      // log the output.
      this.extractAndLogBattlerData(follower, x, y);
    }
  });
};

Scene_Map.prototype.extractAndLogBattlerData = function(target, x, y)
{
  // if there is no target, then don't try.
  if (!target) return;

  // grab the battler of the target.
  const battler = target.getJabsBattler();

  // if the target doesn't have a battler, then don't try.
  if (!battler)
  {
    // if it isn't a battler, we can still log the event data.
    console.log(`[x:${x}, y:${y}]`, 'NOT A JABS BATTLER', target);

    // and stop processing.
    return;
  }

  // otherwise, log the jabs battler data.
  console.log(`[x:${x}, y:${y}]\n[uuid:${battler.getUuid()}]\n[name:${battler.getBattler().name()}]\n`, battler);
};

//region TileMap
/**
 * OVERWRITE Fuck those autoshadows.
 */
Tilemap.prototype._addShadow = function(layer, shadowBits, dx, dy) 
{
};
//endregion TileMap