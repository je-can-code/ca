//region initialization
/**
 * The core where all of my extensions live = in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.REGIONS = {};

/**
 * The `metadata` associated with this plugin; such as version.
 */
J.REGIONS.Metadata = {};
J.REGIONS.Metadata.Name = `J-RegionEffects`;
J.REGIONS.Metadata.Version = '1.0.0';

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.REGIONS.PluginParameters = PluginManager.parameters(J.REGIONS.Metadata.Name);

//region helpers
/**
 * A collection of helpful functions for use within this plugin.
 */
J.REGIONS.Helpers = {};

/**
 * Translates the JSON blob from the plugin parameters into the expected region ids.
 * @param {string} regionsBlob The json blob from the plugin parameters to translate.
 * @returns {number[]} The translated region ids.
 */
J.REGIONS.Helpers.translateRegionIds = regionsBlob =>
{
  // convert the string to an array of strings.
  const parsedRegions = JSON.parse(regionsBlob);

  // parse each of the region ids.
  const regionIds = parsedRegions.map(parseInt);

  // return the parsed region ids.
  return regionIds;
};
//endregion helpers

//region metadata
/**
 * The global region ids that allow passage on all maps.
 * @type {number[]}
 */
J.REGIONS.Metadata.GlobalAllowRegions =
  J.REGIONS.Helpers.translateRegionIds(J.REGIONS.PluginParameters["globalAllowRegions"]);

/**
 * The global region ids that deny passage on all maps.
 * @type {number[]}
 */
J.REGIONS.Metadata.GlobalDenyRegions =
  J.REGIONS.Helpers.translateRegionIds(J.REGIONS.PluginParameters["globalDenyRegions"]);
//endregion metadata

/**
 * A collection of all aliased methods for this plugin.
 */
J.REGIONS.Aliased = {};
J.REGIONS.Aliased.Game_Map = new Map();

/**
 * All regular expressions used by this plugin.
 */
J.REGIONS.RegExp = {};
J.REGIONS.RegExp.AllowRegions = /<allowRegions:[ ]?(\[[\d, ]+])>/gi;
J.REGIONS.RegExp.DenyRegions = /<denyRegions:[ ]?(\[[\d, ]+])>/gi;
//endregion initialization