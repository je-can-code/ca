/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.MSG = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.MSG.Metadata =
  {
    /**
     * The name of this plugin.
     */
    Name: `J-MessageTextCodes`,

    /**
     * The version of this plugin.
     */
    Version: '1.0.0',
  };

/**
 * A collection of all base aliases.
 */
J.MSG.Aliased =
  {
    Window_Base: new Map(),
  };
//#endregion introduction