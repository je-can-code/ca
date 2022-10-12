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
J.MESSAGE.Metadata =
  {
    /**
     * The name of this plugin.
     */
    Name: `J-MessageTextCodes`,

    /**
     * The version of this plugin.
     */
    Version: '1.1.0',
  };

/**
 * A collection of all base aliases.
 */
J.MESSAGE.Aliased =
  {
    Window_Base: new Map(),
  };
//#endregion introduction