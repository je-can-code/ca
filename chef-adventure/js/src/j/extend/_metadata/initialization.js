//region Metadata
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
J.EXTEND.Metadata = {};

/**
 * The name of this plugin.
 */
J.EXTEND.Metadata.Name = `J-SkillExtend`;

/**
 * The version of this plugin.
 */
J.EXTEND.Metadata.Version = '1.0.0';

/**
 * A collection of all aliased methods for this plugin.
 */
J.EXTEND.Aliased = {};
J.EXTEND.Aliased.Game_Action = new Map();
J.EXTEND.Aliased.Game_Item = new Map();

/**
 * All regular expressions used by this plugin.
 */
J.EXTEND.RegExp = {};
J.EXTEND.RegExp.OnHitSelfState = /<onHitSelfState:[ ]?(\[\d+,[ ]?\d+])>/i;
J.EXTEND.RegExp.OnCastSelfState = /<onCastSelfState:[ ]?(\[\d+,[ ]?\d+])>/i;
//endregion Metadata