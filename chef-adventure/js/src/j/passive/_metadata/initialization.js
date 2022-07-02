/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.PASSIVE = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.PASSIVE.Metadata = {
  /**
   * The name of this plugin.
   */
  Name: `J-PassiveSkills`,

  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

/**
 * All regular expressions used by this plugin.
 */
J.PASSIVE.RegExp = {
  PassiveStateId: /<passive:[ ]?(\[[\d, ]+])>/gi
};

J.PASSIVE.Aliased = {
  DataManager: new Map(),
  Game_Actor: new Map(),
  Game_Battler: new Map(),
  Game_BattlerBase: new Map(),
  Game_Enemy: new Map(),
};
//#endregion Introduction