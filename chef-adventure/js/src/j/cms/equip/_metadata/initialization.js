/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.0.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//endregion version check

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.CMS_E = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.CMS_E.Metadata = {};
J.CMS_E.Metadata.Name = `J-CMS-Equip`;
J.CMS_E.Metadata.Version = '1.0.0';

J.CMS_E.Aliased = {
  Scene_Equip: {},
  Window_EquipItem: {},
  Window_EquipSlot: {},
};
//endregion Introduction