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
J.HUD = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.HUD.Metadata = {};
J.HUD.Metadata.Version = '2.0.0';
J.HUD.Metadata.Name = `J-HUD`;

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.HUD.PluginParameters = PluginManager.parameters(J.HUD.Metadata.Name);

/**
 * A collection of all aliased methods for this plugin.
 */
J.HUD.Aliased = {
  Game_System: new Map(),
  Scene_Map: new Map(),
  DataManager: new Map(),
};
//#endregion metadata

/**
 * A global object for managing the hud.
 * @global
 * @type {Hud_Manager}
 */
var $hudManager = null;
//#endregion introduction