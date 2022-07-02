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
J.HUD.EXT_PARTY = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.HUD.EXT_PARTY = {};
J.HUD.EXT_PARTY.Metadata = {};
J.HUD.EXT_PARTY.Metadata.Version = '1.0.0';
J.HUD.EXT_PARTY.Metadata.Name = `J-HUD-PartyFrame`;

/**
 * A collection of all aliased methods for this plugin.
 */
J.HUD.EXT_PARTY.Aliased = {
  Scene_Map: new Map(),
};
//#endregion introduction

//#region plugin commands
/**
 * Plugin command for hiding the hud.
 */
PluginManager.registerCommand(J.HUD.EXT_PARTY.Metadata.Name, "hideHud", () =>
{
  $hudManager.requestHideHud();
});

/**
 * Plugin command for showing the hud.
 */
PluginManager.registerCommand(J.HUD.EXT_PARTY.Metadata.Name, "showHud", () =>
{
  $hudManager.requestShowHud();
});

/**
 * Plugin command for hiding allies in the hud.
 */
PluginManager.registerCommand(J.HUD.EXT_PARTY.Metadata.Name, "hideAllies", () =>
{
  $hudManager.requestHideAllies();
});

/**
 * Plugin command for showing allies in the hud.
 */
PluginManager.registerCommand(J.HUD.EXT_PARTY.Metadata.Name, "showAllies", () =>
{
  $hudManager.requestShowAllies();
});

/**
 * Plugin command for refreshing the hud.
 */
PluginManager.registerCommand(J.HUD.EXT_PARTY.Metadata.Name, "refreshHud", () =>
{
  $hudManager.requestRefreshHud();
});

/**
 * Plugin command for refreshing the hud's image cache.
 */
PluginManager.registerCommand(J.HUD.EXT_PARTY.Metadata.Name, "refreshImageCache", () =>
{
  $hudManager.requestRefreshImageCache();
});
//#endregion plugin commands
//#endregion introduction