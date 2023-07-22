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
J.CMS_K = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.CMS_K.Metadata = {};
J.CMS_K.Metadata.Name = `J-CMS-Skill`;
J.CMS_K.Metadata.Version = '1.0.0';

J.CMS_K.Aliased = {
  Scene_Skill: {},
  Window_SkillList: {},
  Window_EquipSlot: {},
};
//endregion Introduction