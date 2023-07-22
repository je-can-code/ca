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
J.LEVEL = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.LEVEL.Metadata = {};
J.LEVEL.Metadata.Version = '1.0.0';
J.LEVEL.Metadata.Name = `J-LevelMaster`;

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.LEVEL.PluginParameters = PluginManager.parameters(J.LEVEL.Metadata.Name);

/**
 * Whether or not the scaling functionality is enabled.
 * @type {boolean}
 */
J.LEVEL.Metadata.Enabled = J.LEVEL.PluginParameters['useScaling'] === "true";
J.LEVEL.Metadata.MinimumMultiplier = Number(J.LEVEL.PluginParameters['minMultiplier']);
J.LEVEL.Metadata.MaximumMultiplier = Number(J.LEVEL.PluginParameters['maxMultiplier']);
J.LEVEL.Metadata.GrowthMultiplier = Number(J.LEVEL.PluginParameters['growthMultiplier']);
J.LEVEL.Metadata.InvariantUpperRange = Number(J.LEVEL.PluginParameters['invariantUpperRange']);
J.LEVEL.Metadata.InvariantLowerRange = Number(J.LEVEL.PluginParameters['invariantLowerRange']);
J.LEVEL.Metadata.ActorBalanceVariable = Number(J.LEVEL.PluginParameters['variableActorBalancer']);
J.LEVEL.Metadata.EnemyBalanceVariable = Number(J.LEVEL.PluginParameters['variableEnemyBalancer']);

/**
 * All aliased methods for this plugin.
 */
J.LEVEL.Aliased = {
  Game_Actor: new Map(),
  Game_Battler: new Map(),
  Game_Action: new Map(),
  Game_System: new Map(),
  Game_Troop: new Map(),
};

/**
 * All regular expressions used by this plugin.
 */
J.LEVEL.RegExp = {
  /**
   * The regex for the level tag on various database objects.
   * @type {RegExp}
   */
  BattlerLevel: /<(?:lv|lvl|level):[ ]?(-?\+?\d+)>/i,
};

//region Plugin Command Registration
/**
 * Plugin command for enabling the level scaling functionality.
 */
PluginManager.registerCommand(J.LEVEL.Metadata.Name, "enableScaling", () =>
{
  J.LEVEL.Metadata.Enabled = true;
  $gameSystem.enableLevelScaling();
});

/**
 * Plugin command for disabling the level scaling functionality.
 */
PluginManager.registerCommand(J.LEVEL.Metadata.Name, "disableScaling", () =>
{
  J.LEVEL.Metadata.Enabled = false;
  $gameSystem.disableLevelScaling();
});
//endregion Plugin Command Registration
//endregion initialization