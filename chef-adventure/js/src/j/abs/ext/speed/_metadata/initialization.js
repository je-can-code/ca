/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this extension plugin.
 */
J.ABS.EXT.SPEED = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ABS.EXT.SPEED.Metadata = {
  /**
   * The name of this plugin.
   */
  Name: `J-ABS-SpeedBoosts`,

  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.ABS.EXT.SPEED.PluginParameters = PluginManager.parameters(J.ABS.EXT.SPEED.Metadata.Name);

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.EXT.SPEED.Aliased = {
  Game_Actor: new Map(),
  Game_Character: new Map(),
  Game_Battler: new Map(),
  Game_Enemy: new Map(),
};

/**
 * All regular expressions used by this plugin.
 */
J.ABS.EXT.SPEED.RegExp = {
  WalkSpeedBoost: /<speedBoost:[ ]?([-]?\d+)>/gi,
};
//endregion Introduction