/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.POPUPS = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.POPUPS.Metadata =
  {
    /**
     * The name of this plugin.
     */
    Name: `J-TextPops`,

    /**
     * The version of this plugin.
     */
    Version: '1.0.0',
  };

J.POPUPS.Aliased =
  {
    Game_Character: new Map(),
    Sprite_Character: new Map(),
    Sprite_Damage: new Map(),
  };
//endregion Introduction