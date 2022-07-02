/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.DROPS = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.DROPS.Metadata = {
  /**
   * The version of this plugin.
   */
  Name: `J-DropsControl`,

  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

J.DROPS.Aliased = {
  Game_Enemy: new Map(),
};
//#endregion Introduction