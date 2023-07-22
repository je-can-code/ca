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
J.ABS.EXT.TOOLS = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ABS.EXT.TOOLS.Metadata = {
  /**
   * The name of this plugin.
   */
  Name: `J-ABS-Tools`,

  /**
   * The version of this plugin.
   */
  Version: '1.0.0',
};

/**
 * The plugin parameters for this plugin.
 */
J.ABS.EXT.TOOLS.PluginParameters = PluginManager.parameters(J.ABS.EXT.TOOLS.Metadata.Name);

/**
 * A continuation of the `metadata` for this plugin, typically containing additional content
 * that was derived from the plugin parameters.
 */
J.ABS.EXT.TOOLS.Metadata = {
  // include the original metadata.
  ...J.ABS.EXT.TOOLS.Metadata,

  /**
   * The behavior for whether or not the player can gap close to anything they hit, or if they
   * can only gap close to targets bearing the "gap close target" tag.
   */
  CanGapCloseByDefault: J.ABS.EXT.TOOLS.PluginParameters["canGapCloseByDefault"] === "true",
};

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.EXT.TOOLS.Aliased = {
  Game_Character: new Map(),
  Game_CharacterBase: new Map(),
  Game_Event: new Map(),
  Game_Follower: new Map(),
  Game_Player: new Map(),
  Game_System: new Map(),
  JABS_Engine: new Map(),
  JABS_Battler: new Map(),
};

/**
 * All regular expressions used by this plugin.
 */
J.ABS.EXT.TOOLS.RegExp = {
  GapClose: /<gapClose>/i,
  GapCloseTarget: /<gapCloseTarget>/i,
  GapCloseMode: /<gapCloseMode:(blink|jump|travel)>/i,
  GapClosePosition: /<gapClosePosition:(infront|behind|same)>/i,
  BlockGapClose: /<blockGapClose>/i,
};

/**
 * All types of gap close modes that are available to pick from.
 * The mode is the means of which the battler will travel the to the destination.
 * All modes bypass terrain.
 * If they should not bypass terrain, consider eventing instead.
 */
J.ABS.EXT.TOOLS.GapCloseModes = {
  /**
   * Blinks instantly to the target.
   */
  Blink: "blink",

  /**
   * Jumps to the target.
   */
  Jump: "jump",

  /**
   * Using pathing, will attempt to walk to the destination.
   * While traveling, "through" will be enabled.
   */
  Travel: "travel",
};

/**
 * All types of gap close positions that are available to pick from.
 * The position is ultimately the destination, defined as where the battler
 * should end up when they are done gap closing.
 */
J.ABS.EXT.TOOLS.GapClosePositions = {
  /**
   * Infront translates to being on the same side of the target as the gap-closing
   * battler was when they started the gap closing process, and does not consider the
   * facing of the target battler considering that can change wildly.
   */
  Infront: "infront",

  /**
   * Behind translates to being on the opposite side of the target as the gap-closing
   * battler was when they started the gap closing process, and does not consider the
   * facing of the target battler considering that can change wildly.
   */
  Behind: "behind",

  /**
   * Same translates to arriving at the same coordinates as the target is, meaning the
   * gap-closing battler will be ontop of the target.
   */
  Same: "same",
};
//endregion Introduction