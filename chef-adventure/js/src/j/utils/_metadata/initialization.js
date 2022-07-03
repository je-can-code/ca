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
  Scene_Base: new Map(),
  Scene_Boot: new Map(),
};

J.UTILS.Helpers = {};
J.UTILS.Helpers.depth = (o) =>
  Object (o) === o ? 1 + Math.max(-1, ...Object.values(o).map(J.UTILS.Helpers.depth)) : 0;