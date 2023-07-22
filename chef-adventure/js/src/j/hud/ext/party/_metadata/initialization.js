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
})();
//endregion version check

//region metadata
/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.HUD.EXT.PARTY = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.HUD.EXT.PARTY = {};
J.HUD.EXT.PARTY.Metadata = {};
J.HUD.EXT.PARTY.Metadata.Version = '1.0.0';
J.HUD.EXT.PARTY.Metadata.Name = `J-HUD-PartyFrame`;

/**
 * A collection of all aliased methods for this plugin.
 */
J.HUD.EXT.PARTY.Aliased = {
  Scene_Map: new Map(),
};
//endregion introduction
//endregion introduction