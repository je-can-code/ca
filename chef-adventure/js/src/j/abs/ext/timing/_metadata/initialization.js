/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this extension plugin.
 */
J.ABS.EXT.TIMING = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ABS.EXT.TIMING.Metadata = {
  /**
   * The name of this plugin.
   */
  Name: `J-ABS-Timing`,

  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

J.ABS.EXT.TIMING.PluginParameters = PluginManager.parameters(J.ABS.EXT.TIMING.Metadata.Name);

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.EXT.TIMING.Aliased = {
  Game_Actor: new Map(),
  Game_Battler: new Map(),
  Game_BattlerBase: new Map(),
  Game_Enemy: new Map(),
  JABS_Action: new Map(),
};

/**
 * All regular expressions used by this plugin.
 */
J.ABS.EXT.TIMING.RegExp = {
  BaseCastSpeed: /<baseCastTime:\[([+\-*/ ().\w]+)]>/gi,
  CastSpeedFlat: /<castTimeFlat:\[([+\-*/ ().\w]+)]>/gi,
  CastSpeedRate: /<castTimePercent:\[([+\-*/ ().\w]+)]>/gi,
  BaseFastCooldown: /<baseFastCooldown:\[([+\-*/ ().\w]+)]>/gi,
  FastCooldownFlat: /<fastCooldownFlat:\[([+\-*/ ().\w]+)]>/gi,
  FastCooldownRate: /<fastCooldownRate:\[([+\-*/ ().\w]+)]>/gi,
};
//endregion Introduction