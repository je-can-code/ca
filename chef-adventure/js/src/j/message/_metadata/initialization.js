/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.MESSAGE = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.MESSAGE.Metadata = {};
J.MESSAGE.Metadata.Name = `J-MessageTextCodes`;
J.MESSAGE.Metadata.Version = '1.1.0';

/**
 * A collection of all base aliases.
 */
J.MESSAGE.Aliased = {};
J.MESSAGE.Aliased.Window_Base = new Map();
//endregion introduction