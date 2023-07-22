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
  Version: '2.0.0',
};

/**
 * All regular expressions used by this plugin.
 */
J.DROPS.RegExp = {
  ExtraDrop: /<drops:[ ]?(\[(i|item|w|weapon|a|armor),[ ]?(\d+),[ ]?(\d+)])>/i,
}

/**
 * The collection of all aliased classes for extending.
 */
J.DROPS.Aliased = {
  Game_Enemy: new Map(),
};
//endregion Introduction