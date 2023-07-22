/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.OTIB = {};

/**
 * A collection of helpful functions used throughout this plugin.
 */
J.OTIB.Helpers = {};

/**
 * Translates the raw JSON into the OneTimeItemBoosts.
 * @param {JSON} rawJson The raw JSON to translate boosts from.
 * @returns {OneTimeItemBoost[]}
 */
J.OTIB.Helpers.translateOTIBs = rawJson =>
{
  const parsedJsonBlob = JSON.parse(rawJson);
  const oneTimeItemBoosts = [];
  parsedJsonBlob.forEach(rawOneTimeItemBoostBlob =>
  {
    const parsedOneTimeItemBoostBlob = JSON.parse(rawOneTimeItemBoostBlob);
    const parsedItemId = parseInt(parsedOneTimeItemBoostBlob.itemId);

    // if we already have a boost in the list with this itemId, skip it.
    if (oneTimeItemBoosts.findIndex(otib => otib.itemId === parsedItemId) !== -1) return;

    // parse out all boost parameters.
    const parsedBoostsBlob = JSON.parse(parsedOneTimeItemBoostBlob.boosts);
    const parsedBoosts = [];
    parsedBoostsBlob.forEach(rawBoostBlob =>
    {
      const parsedBoostBlob = JSON.parse(rawBoostBlob);
      const boostParam = new OneTimeItemBoostParam(
        parseInt(parsedBoostBlob.parameterId),
        parseFloat(parsedBoostBlob.boost),
        parsedBoostBlob.isPercent === "true"
      );
      parsedBoosts.push(boostParam);
    });

    // create a new OneTimeItemBoost and add it to the collection.
    const parsedOneTimeItemBoost = new OneTimeItemBoost(parsedItemId, parsedBoosts);
    oneTimeItemBoosts.push(parsedOneTimeItemBoost);
  });

  return oneTimeItemBoosts;
};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.OTIB.Metadata = {
  /**
   * The name of this plugin.
   */
  Name: `J-OneTimeItemBoost`,
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.OTIB.PluginParameters = PluginManager.parameters(J.OTIB.Metadata.Name);
J.OTIB.Metadata = {
  ...J.OTIB.Metadata,
  /**
   * The version of this plugin.
   */
  Version: 1.0,

  /**
   * A collection of all OneTimeItemBonuses from the plugin parameters.
   * @type {OneTimeItemBoost[]}
   */
  OneTimeItemBoosts: J.OTIB.Helpers.translateOTIBs(J.OTIB.PluginParameters["OTIBs"]),
};

/**
 * The collection of all aliased classes for extending.
 */
J.OTIB.Aliased = {
  DataManager: {},
  Game_Actor: new Map(),
  Game_Battler: new Map(),
};
//endregion Introduction