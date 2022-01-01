/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 UTIL] Various system utilities.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @help
 * ============================================================================
 * A small set of system utility functions.
 * - F6 toggles all sound on/off.
 * - autostart newgame on testplay.
 * ============================================================================
 * @param autoNewgame
 * @type boolean
 * @text Auto-Newgame
 * @desc Automatically start a new game when playtesting the game.
 * @default true
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.UTIL = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.UTIL.Metadata = {
  /**
   * The name of this plugin.
   */
  Name: `J-SystemUtilities`,

  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

J.UTIL.PluginParameters = PluginManager.parameters(J.UTIL.Metadata.Name);

/**
 * Whether or not to use the "auto-newgame" feature.
 * @type {boolean}
 */
J.UTIL.Metadata.AutoNewgame = J.UTIL.PluginParameters['autoNewgame'] === 'true';

/**
 * A collection of all aliased methods for this plugin.
 */
J.UTIL.Aliased = {
  Scene_Base: new Map(),
  Scene_Boot: new Map(),
};

J.UTIL.Helpers = {};
J.UTIL.Helpers.depth = (o) =>
  Object (o) === o ? 1 + Math.max(-1, ...Object.values(o).map(J.UTIL.Helpers.depth)) : 0;

//#region Input
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
//#endregion Input

//#region Scene objects
//#region Scene_Base
/**
 * Extends the `.update()` to include a watcher for whether or not
 * the volume toggle button is pressed.
 */
J.UTIL.Aliased.Scene_Base.set('update', Scene_Base.prototype.update);
Scene_Base.prototype.update = function()
{
  J.UTIL.Aliased.Scene_Base.get('update').call(this);
  if (this.isVolumeToggling())
  {
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
  const {bgmVolume, bgsVolume, meVolume, seVolume} = ConfigManager;
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
//#endregion Scene_Base
/**
 * Extends `startNormalGame()` to accommodate plugin parameters.
 * If the "auto-newgame" parameter is true, then we skip straight into a new game,
 * bypassing the title screen altogether.
 */
J.UTIL.Aliased.Scene_Boot.set('startNormalGame', Scene_Boot.prototype.startNormalGame);
Scene_Boot.prototype.startNormalGame = function()
{
  // if using the "auto-newgame" feature, then skip straight to a new game.
  if (J.UTIL.Metadata.AutoNewgame)
  {
    this.checkPlayerLocation();
    DataManager.setupNewGame();
    SceneManager.goto(Scene_Map);
  }
  // otherwise, perform original logic.
  else
  {
    J.UTIL.Aliased.Scene_Boot.get('startNormalGame').call(this);
  }
};
//#endregion Scene objects