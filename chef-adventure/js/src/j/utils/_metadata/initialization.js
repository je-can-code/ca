/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.UTILS = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.UTILS.Metadata = {
  /**
   * The name of this plugin.
   */
  Name: `J-SystemUtilities`,

  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.UTILS.PluginParameters = PluginManager.parameters(J.UTILS.Metadata.Name);

/**
 * Whether or not to use the "auto-newgame" feature.
 * @type {boolean}
 */
J.UTILS.Metadata.AutoNewgame = J.UTILS.PluginParameters['autoNewgame'] === 'true';

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