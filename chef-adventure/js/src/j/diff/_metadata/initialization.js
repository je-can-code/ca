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

//region metadata
/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.DIFFICULTY = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.DIFFICULTY.Metadata = {
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
J.DIFFICULTY.PluginParameters = PluginManager.parameters(J.DIFFICULTY.Metadata.Name);

/**
 * A collection of helper functions for various global duties around this plugin.
 */
J.DIFFICULTY.Helpers = {};

/**
 * Parses the plugin data into metadata for the plugin to operate.
 * @param {string} rawJson The raw json extracted from the plugin manager.
 * @returns {Map<string, DifficultyMetadata>} The map of parsed difficulties.
 */
J.DIFFICULTY.Helpers.toDifficultiesMap = rawJson =>
{
  // start by parsing the overarching plugin parameters for this difficulty plugin.
  const parsedDifficultyBlobs = JSON.parse(rawJson);

  /** @type {Map<string, DifficultyMetadata>} */
  const difficultiesMap = new Map();

  // a map function for iterating and parsing blobs.
  const forEacher = rawDifficultyBlob =>
  {
    // parse the overarching blob of difficulties.
    const parsedDifficultyBlob = JSON.parse(rawDifficultyBlob);

    // extract all the properties that we care about.
    const {
      key, name, description, iconIndex, cost,
      bparams, xparams, sparams, bonuses,
      enabled, unlocked, hidden
    } = parsedDifficultyBlob;

    // parse the icon to start.
    const parsedIconIndex = parseInt(iconIndex);

    // parse the cost as well.
    const parsedCost = parseInt(cost);

    // instantiate the builder with the base data.
    const builder = new DifficultyBuilder(name, key)
      .setDescription(description)
      .setIconIndex(parsedIconIndex)
      .setCost(parsedCost);

    // parse bparams.
    const parsedBParams = JSON.parse(bparams);
    parsedBParams.forEach(rawParam =>
    {
      // parse the parameter pair.
      const parsedParam = JSON.parse(rawParam);

      // destructure this parameter.
      const { parameterId, parameterRate } = parsedParam;

      // parse out the parameter id.
      const parsedParameterId = parseInt(parameterId);

      // parse out the rate.
      const parsedParameterRate = parseInt(parameterRate)

      // if the id is -1, then it is for all parameters.
      if (parsedParameterId === -1)
      {
        // set all the params to this rate.
        Game_BattlerBase.knownBaseParameterIds()
          .forEach(paramId => builder.setBparam(paramId, parsedParameterRate));
      }
      else
      {
        // set the new param.
        builder.setBparam(parsedParameterId, parsedParameterRate);
      }
    });

    // parse xparams.
    const parsedXParams = JSON.parse(xparams);
    parsedXParams.forEach(rawParam =>
    {
      // parse the parameter pair.
      const parsedParam = JSON.parse(rawParam);

      // destructure this parameter.
      const { parameterId, parameterRate } = parsedParam;

      // parse out the parameter id.
      const parsedParameterId = parseInt(parameterId);

      // parse out the rate.
      const parsedParameterRate = parseInt(parameterRate)

      // if the id is -1, then it is for all parameters.
      if (parsedParameterId === -1)
      {
        // set all the params to this rate.
        Game_BattlerBase.knownBaseParameterIds()
          .forEach(paramId => builder.setXparam(paramId, parsedParameterRate));
      }
      else
      {
        // set the new param.
        builder.setXparam(parsedParameterId, parsedParameterRate);
      }
    });

    // parse sparams.
    const parsedSParams = JSON.parse(sparams);
    parsedSParams.forEach(rawParam =>
    {
      // parse the parameter pair.
      const parsedParam = JSON.parse(rawParam);

      // destructure this parameter.
      const { parameterId, parameterRate } = parsedParam;

      // parse out the parameter id.
      const parsedParameterId = parseInt(parameterId);

      // parse out the rate.
      const parsedParameterRate = parseInt(parameterRate)

      // if the id is -1, then it is for all parameters.
      if (parsedParameterId === -1)
      {
        // set all the params to this rate.
        Game_BattlerBase.knownBaseParameterIds()
          .forEach(paramId => builder.setSparam(paramId, parsedParameterRate));
      }
      else
      {
        // set the new param.
        builder.setSparam(parsedParameterId, parsedParameterRate);
      }
    });

    // handle bonuses.
    const parsedBonuses = JSON.parse(bonuses);
    parsedBonuses.forEach(rawBonus =>
    {
      // parse out the bonus JSON.
      const bonus = JSON.parse(rawBonus);

      // extract and parse the bonus properties.
      const { bonusId, bonusRate } = bonus;
      const parsedBonusId = parseInt(bonusId);
      const parsedBonusRate = parseInt(bonusRate);

      // switch on the bonus id.
      switch (parsedBonusId)
      {
        case 0: // exp modifier.
          builder.setExp(parsedBonusRate);
          break;
        case 1: // gold modifier.
          builder.setGold(parsedBonusRate);
          break;
        case 2: // sdp rate modifier.
          builder.setSdp(parsedBonusRate);
          break;
        case 3: // drop rate modifier.
          builder.setDrops(parsedBonusRate);
          break;
        case 4: // encounters modifier.
          builder.setEncounters(parsedBonusRate);
          break;
      }
    });

    // assign the accessors.
    builder.setEnabled(enabled === "true");
    builder.setHidden(hidden === "true");
    builder.setUnlocked(unlocked === "true");

    // build the difficulty and add it to the running collection.
    const completeDifficulty = builder.build();

    // set the difficulty!
    difficultiesMap.set(completeDifficulty.key, completeDifficulty);
  };

  // iterate over each blob and do it.
  parsedDifficultyBlobs.forEach(forEacher);

  // return what we parsed.
  return difficultiesMap;
};

/**
 * Extend this plugin's metadata with additional configurable data points.
 */
J.DIFFICULTY.Metadata = {
  // the previously defined metadata.
  ...J.DIFFICULTY.Metadata,

  /**
   * The key for the default difficulty.
   * @type {string}
   */
  DefaultDifficulty: J.DIFFICULTY.PluginParameters['defaultDifficulty'] || String.empty,

  /**
   * The default point max for allocating difficulty layers.
   */
  DefaultLayerPointMax: parseInt(J.DIFFICULTY.PluginParameters['initialPoints']) || 0,
};

/**
 * A collection of all aliased methods for this plugin.
 */
J.DIFFICULTY.Aliased = {
  DataManager: new Map(),
  Game_Enemy: new Map(),
  Game_Map: new Map(),
  Game_System: new Map(),
  Game_Temp: new Map(),
  Scene_Map: new Map(),
};
//endregion metadata

//region plugin commands
/**
 * Plugin command for calling the Difficulty scene/menu.
 */
PluginManager.registerCommand(J.DIFFICULTY.Metadata.Name, "callDifficultyMenu", () =>
{
  SceneManager.push(Scene_Difficulty);
});

/**
 * Plugin command for calling the locking one or many difficulties.
 */
PluginManager.registerCommand(J.DIFFICULTY.Metadata.Name, "lockDifficulty", args =>
{
  let {keys} = args;
  keys = JSON.parse(keys);
  keys.forEach(key =>
  {
    DifficultyManager.lockDifficulty(key);
  });
});

/**
 * Plugin command for calling the unlocking one or many difficulties.
 */
PluginManager.registerCommand(J.DIFFICULTY.Metadata.Name, "unlockDifficulty", args =>
{
  let {keys} = args;
  keys = JSON.parse(keys);
  keys.forEach(key =>
  {
    DifficultyManager.unlockDifficulty(key);
  });
});

/**
 * Plugin command for hiding one or many difficulties.
 */
PluginManager.registerCommand(J.DIFFICULTY.Metadata.Name, "hideDifficulty", args =>
{
  let {keys} = args;
  keys = JSON.parse(keys);
  keys.forEach(key =>
  {
    DifficultyManager.hideDifficulty(key);
  });
});

/**
 * Plugin command for unhiding one or many difficulties.
 */
PluginManager.registerCommand(J.DIFFICULTY.Metadata.Name, "unhideDifficulty", args =>
{
  let {keys} = args;
  keys = JSON.parse(keys);
  keys.forEach(key =>
  {
    DifficultyManager.unhideDifficulty(key);
  });
});

/**
 * Plugin command for enabling one or many difficulties.
 */
PluginManager.registerCommand(J.DIFFICULTY.Metadata.Name, "enableDifficulty", args =>
{
  let {keys} = args;
  keys = JSON.parse(keys);
  keys.forEach(key =>
  {
    DifficultyManager.enableDifficulty(key);
  });
});

/**
 * Plugin command for disabling one or many difficulties.
 */
PluginManager.registerCommand(J.DIFFICULTY.Metadata.Name, "disableDifficulty", args =>
{
  let {keys} = args;
  keys = JSON.parse(keys);
  keys.forEach(key =>
  {
    DifficultyManager.disableDifficulty(key);
  });
});

/**
 * Plugin command for modifying the max layer points.
 */
PluginManager.registerCommand(J.DIFFICULTY.Metadata.Name, "modifyLayerMax", args =>
{
  const { amount } = args;
  const parsedAmount = parseInt(amount);
  $gameSystem.modLayerPointMax(parsedAmount);
});
//endregion plugin commands
//endregion introduction