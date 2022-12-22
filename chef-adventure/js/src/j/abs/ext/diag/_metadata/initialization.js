

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '1.0.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }

  // Check to ensure we have the minimum required version of the J-ABS plugin.
  const requiredJabsVersion = '2.4.0';
  const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.Version, requiredJabsVersion);
  if (!hasJabsRequirement)
  {
    throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
  }
})();
//endregion version check

//region plugin metadata
/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.DIAG = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.DIAG.Metadata = {
  /**
   * The version of this plugin.
   */
  Name: `J-ABS-Diagonals`,
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.DIAG.PluginParameters = PluginManager.parameters(J.DIAG.Metadata.Name);
J.DIAG.Metadata = {
  ...J.DIAG.Metadata,
  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

/**
 * A collection of all aliased methods for this plugin.
 */
J.DIAG.Aliased = {
  Game_BattleMap: {},
  Game_Character: {},
  Game_Event: {},
  Game_Map: {},
  Game_Player: {},
};
//endregion plugin metadata
//endregion Initialization