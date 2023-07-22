/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//endregion version check

//region metadata
/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.ABS.EXT.INPUT = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ABS.EXT.INPUT = {};
J.ABS.EXT.INPUT.Metadata = {};
J.ABS.EXT.INPUT.Metadata.Version = '1.0.0';
J.ABS.EXT.INPUT.Metadata.Name = `J-ABS-InputManager`;

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.ABS.EXT.INPUT.PluginParameters = PluginManager.parameters(J.ABS.EXT.INPUT.Metadata.Name);

/**
 * Extend this plugin's metadata with additional configurable data points.
 */
J.ABS.EXT.INPUT.Metadata =
  {
    // the previously defined metadata.
    ...J.ABS.EXT.INPUT.Metadata,
  };

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.EXT.INPUT.Aliased =
  {
    DataManager: new Map(),
    JABS_Engine: new Map(),
    JABS_Battler: new Map(),
  };
//endregion metadata

/**
 * The global reference for the player's input manager.
 * This interprets and manages incoming inputs for JABS-related functionality.
 * @type {JABS_InputController}
 * @global
 */
var $jabsController1 = null;
//endregion introduction