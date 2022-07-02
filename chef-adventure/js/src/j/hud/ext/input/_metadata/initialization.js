/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//#region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '1.0.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//#endregion version check

//#region metadata
/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.HUD.EXT_INPUT = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.HUD.EXT_INPUT = {};
J.HUD.EXT_INPUT.Metadata = {};
J.HUD.EXT_INPUT.Metadata.Version = '1.0.0';
J.HUD.EXT_INPUT.Metadata.Name = `J-HUD-InputFrame`;

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.HUD.EXT_INPUT.PluginParameters = PluginManager.parameters(J.HUD.EXT_INPUT.Metadata.Name);

/**
 * Extend this plugin's metadata with additional configurable data points.
 */
J.HUD.EXT_INPUT.Metadata =
  {
    // the previously defined metadata.
    ...J.HUD.EXT_INPUT.Metadata,

    // our configurable data points.
    InputFrameX: Number(J.HUD.EXT_INPUT.PluginParameters['inputFrameX']),
    InputFrameY: Number(J.HUD.EXT_INPUT.PluginParameters['inputFrameY']),
  };

/**
 * A collection of all aliased methods for this plugin.
 */
J.HUD.EXT_INPUT.Aliased = {
  Scene_Map: new Map(),
};
//#endregion metadata
//#endregion introduction