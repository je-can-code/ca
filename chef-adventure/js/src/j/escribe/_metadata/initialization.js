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

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.ESCRIBE = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ESCRIBE.Metadata = {
  /**
   * The name of this plugin.
   */
  Name: `J-Escriptions`,

  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

/**
 * All regular expressions used by this plugin.
 */
J.ESCRIBE.RegExp = {
  Text: /<text:(.+)>/i,
  IconIndex: /<icon:[ ]?(\d+)>/i,
  ProximityText: /<proximityText:[ ]?((0|([1-9][0-9]*))(\.[0-9]+)?)>/i,
  ProximityIcon: /<proximityIcon:[ ]?((0|([1-9][0-9]*))(\.[0-9]+)?)>/i,
};

/**
 * The collection of all aliased classes for extending.
 */
J.ESCRIBE.Aliased = {
  Game_Event: new Map(),
  Sprite_Character: new Map(),
};
//endregion Introduction