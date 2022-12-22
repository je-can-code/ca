/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.DANGER = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.DANGER.Metadata =
  {
    /**
     * The name of this plugin.
     */
    Name: `J-ABS-DangerIndicator`,

    /**
     * The version of this plugin.
     */
    Version: '1.0.0',
  };

/**
 * A collection of helper functions for use within this plugin.
 */
J.DANGER.Helpers = {};

/**
 * A collection of helper functions for the use with the plugin manager.
 */
J.DANGER.Helpers.PluginManager = {};

/**
 * Translates the plugin parameters' JSON into the danger icon metadata.
 * @param {string} obj The JSON to be parsed into danger icons.
 * @returns {{}} A custom object containing KVPs of [name]: [iconIndex].
 */
J.DANGER.Helpers.PluginManager.TranslateDangerIndicatorIcons = obj =>
{
  // no danger indicator icons identified.
  if (!obj) return {};

  // parse the JSON and update the values to be actual numbers.
  const raw = JSON.parse(obj);
  Object.keys(raw).forEach(key =>
  {
    raw[key] = parseInt(raw[key]);
  });

  return raw;
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.DANGER.PluginParameters = PluginManager.parameters(J.DANGER.Metadata.Name);
J.DANGER.Metadata.DefaultEnemyShowDangerIndicator =
  J.DANGER.PluginParameters['defaultEnemyShowDangerIndicator'] === "true";
J.DANGER.Metadata.DangerIndicatorIcons =
  J.DANGER.Helpers.PluginManager.TranslateDangerIndicatorIcons(J.DANGER.PluginParameters['dangerIndicatorIconData']);

/**
 * A collection of icons that represent the danger level of a given enemy relative to the player.
 */
J.DANGER.DangerIndicatorIcons =
  {
    /**
     * Worthless enemies are 7+ levels below the player.
     * @type {number}
     */
    Worthless: J.DANGER.Metadata.DangerIndicatorIcons.Worthless,

    /**
     * Simple enemies are 5-6 levels below the player.
     * @type {number}
     */
    Simple: J.DANGER.Metadata.DangerIndicatorIcons.Simple,

    /**
     * Easy enemies are 3-4 levels below the player.
     * @type {number}
     */
    Easy: J.DANGER.Metadata.DangerIndicatorIcons.Easy,

    /**
     * Average enemies are +/- 2 levels of the player.
     * @type {number}
     */
    Average: J.DANGER.Metadata.DangerIndicatorIcons.Average,

    /**
     * Hard enemies are 3-4 levels above the player.
     * @type {number}
     */
    Hard: J.DANGER.Metadata.DangerIndicatorIcons.Hard,

    /**
     * Grueling enemies are 5-6 levels above the player.
     * @type {number}
     */
    Grueling: J.DANGER.Metadata.DangerIndicatorIcons.Grueling,

    /**
     * Deadly enemies are 7+ levels above the player.
     * @type {number}
     */
    Deadly: J.DANGER.Metadata.DangerIndicatorIcons.Deadly,
  };

/**
 * A collection of all extended classes in this plugin.
 */
J.DANGER.Aliased =
  {
    Game_Character: new Map(),
    Game_Event: new Map(),
    JABS_Battler: new Map(),
    JABS_BattlerCoreData: new Map(),
    Sprite_Character: new Map(),
    Spriteset_Map: new Map(),
  };
//endregion Introduction