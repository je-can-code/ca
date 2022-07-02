/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.EXTEND = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.EXTEND.Metadata = {
  /**
   * The name of this plugin.
   */
  Name: `J-SkillExtend`,

  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

J.EXTEND.Aliased = {
  Game_Action: new Map(),
  Game_Item: new Map(),
};
//#endregion Introduction