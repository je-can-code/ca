/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The over-arching extensions collection for JABS.
 */
J.ABS.EXT ||= {};

/**
 * The plugin umbrella that governs all things related to this extension plugin.
 */
J.ABS.EXT.CYCLE = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ABS.EXT.CYCLE.Metadata = {
  /**
   * The name of this plugin.
   */
  Name: `J-ABS-CycloneAdapter`,

  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.ABS.EXT.CYCLE.PluginParameters = PluginManager.parameters(J.ABS.EXT.CYCLE.Metadata.Name);

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.EXT.CYCLE.Aliased = {
  Game_Character: new Map(),
  Game_Event: new Map(),
  Game_Follower: new Map(),
  Game_Player: new Map(),
  JABS_Action: new Map(),
  JABS_Battler: new Map(),
};
//endregion Introduction