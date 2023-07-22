/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.1';
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
J.CMS_M = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.CMS_M.Metadata = {};
J.CMS_M.Metadata.Name = `J-CMS-MAin`;
J.CMS_M.Metadata.Version = '1.0.0';

J.CMS_M.Aliased = {
  Scene_Menu: {},
  Window_EquipItem: {},
  Window_EquipSlot: {},
};