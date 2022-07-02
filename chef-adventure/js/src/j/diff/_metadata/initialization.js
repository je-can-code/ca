/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//#region version checks
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
//#endregion version check

//#region metadata
/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.DIFF = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.DIFF.Metadata = {
  /**
   * The version of this plugin.
   */
  Version: '1.0.0',

  /**
   * The name of this plugin.
   */
  Name: `J-Difficulty`,
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.DIFF.PluginParameters = PluginManager.parameters(J.DIFF.Metadata.Name);

/**
 * A collection of helper functions for various global duties around this plugin.
 */
J.DIFF.Helpers = {};

/**
 * Parses the plugin data into metadata for the plugin to operate.
 * @param {string} rawJson The raw json extracted from the plugin manager.
 */
J.DIFF.Helpers.toDifficulties = rawJson =>
{
  const parsedDifficultyBlobs = JSON.parse(rawJson);
  const parsedDifficulties = [];
  parsedDifficultyBlobs.forEach(rawDifficultyBlob =>
  {
    const parsedDifficultyBlob = JSON.parse(rawDifficultyBlob);

    const {key} = parsedDifficultyBlob;
    const {name} = parsedDifficultyBlob;
    const iconIndex = parseInt(parsedDifficultyBlob.iconIndex);
    const {description} = parsedDifficultyBlob;
    const builder = new DifficultyBuilder(name, key)
      .setIconIndex(iconIndex)
      .setDescription(description);

    const parsedBParams = JSON.parse(parsedDifficultyBlob.bparams);
    parsedBParams.forEach(rawParam =>
    {
      const parsedParam = JSON.parse(rawParam);
      builder.setBparam(parsedParam.parameterId, parseInt(parsedParam.parameterRate));
    });

    const parsedXParams = JSON.parse(parsedDifficultyBlob.xparams);
    parsedXParams.forEach(rawParam =>
    {
      const parsedParam = JSON.parse(rawParam);
      builder.setXparam(parsedParam.parameterId, parseInt(parsedParam.parameterRate));
    });

    const parsedSParams = JSON.parse(parsedDifficultyBlob.sparams);
    parsedSParams.forEach(rawParam =>
    {
      const parsedParam = JSON.parse(rawParam);
      builder.setSparam(parsedParam.parameterId, parseInt(parsedParam.parameterRate));
    });

    const parsedBonuses = JSON.parse(parsedDifficultyBlob.bonuses);
    parsedBonuses.forEach(rawBonus =>
    {
      const bonus = JSON.parse(rawBonus);
      switch (parseInt(bonus.bonusId))
      {
        case 0:
          const bonusExpRate = parseInt(bonus.bonusRate);
          builder.setExp(bonusExpRate);
          break;
        case 1:
          const bonusGoldRate = parseInt(bonus.bonusRate);
          builder.setGold(bonusGoldRate);
          break;
        case 2:
          const bonusSdpRate = parseInt(bonus.bonusRate);
          builder.setSdp(bonusSdpRate);
          break;
        case 3:
          const bonusDropsRate = parseInt(bonus.bonusRate);
          builder.setDrops(bonusDropsRate);
          break;
        case 4:
          const bonusEncountersRate = parseInt(bonus.bonusRate);
          builder.setEncounters(bonusEncountersRate);
          break;
      }
    });

    const completeDifficulty = builder.build();
    parsedDifficulties.push(completeDifficulty);
  });

  return parsedDifficulties;
};

/**
 * Extend this plugin's metadata with additional configurable data points.
 */
J.DIFF.Metadata = {
  // the previously defined metadata.
  ...J.DIFF.Metadata,

  Difficulties: J.DIFF.Helpers.toDifficulties(J.DIFF.PluginParameters['difficulties'])|| [],

  DefaultDifficulty: J.DIFF.PluginParameters['defaultDifficulty'] || String.empty,
};

/**
 * A collection of all aliased methods for this plugin.
 */
J.DIFF.Aliased = {
  Game_Enemy: new Map(),
  Game_Map: new Map(),
  Game_System: new Map(),
  Scene_Map: new Map(),
};
//#endregion metadata

//#region plugin commands
/**
 * Plugin command for calling the Difficulty scene/menu.
 */
PluginManager.registerCommand(J.DIFF.Metadata.Name, "callDifficultyMenu", () =>
{
  SceneManager.push(Scene_Difficulty);
});

/**
 * Plugin command for calling the locking one or many difficulties.
 */
PluginManager.registerCommand(J.DIFF.Metadata.Name, "lockDifficulty", args =>
{
  let {keys} = args;
  keys = JSON.parse(keys);
  keys.forEach(key =>
  {
    $gameSystem.lockDifficulty(key);
  });
});

/**
 * Plugin command for calling the unlocking one or many difficulties.
 */
PluginManager.registerCommand(J.DIFF.Metadata.Name, "unlockDifficulty", args =>
{
  let {keys} = args;
  keys = JSON.parse(keys);
  keys.forEach(key =>
  {
    $gameSystem.unlockDifficulty(key);
  });
});

/**
 * Plugin command for calling the hiding one or many difficulties.
 */
PluginManager.registerCommand(J.DIFF.Metadata.Name, "hideDifficulty", args =>
{
  let {keys} = args;
  keys = JSON.parse(keys);
  keys.forEach(key =>
  {
    $gameSystem.hideDifficulty(key);
  });
});

/**
 * Plugin command for calling the unhiding one or many difficulties.
 */
PluginManager.registerCommand(J.DIFF.Metadata.Name, "unhideDifficulty", args =>
{
  let {keys} = args;
  keys = JSON.parse(keys);
  keys.forEach(key =>
  {
    $gameSystem.unhideDifficulty(key);
  });
});
//#endregion plugin commands
//#endregion introduction