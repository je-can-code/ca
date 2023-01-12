//region metadata
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.3';
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
J.DIFFICULTY = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.DIFFICULTY.Metadata = {};
J.DIFFICULTY.Metadata.Version = '2.0.0';
J.DIFFICULTY.Metadata.Name = `J-Difficulty`;

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

    // extract the data points from the blob.
    const {
      key, name, description, iconIndex, cost,
      actorEffects, enemyEffects, bonuses,
      enabled, unlocked, hidden
    } = parsedDifficultyBlob;

    // parse the icon index.
    const parsedIconIndex = parseInt(iconIndex);

    // parse the cost.
    const parsedCost = parseInt(cost);

    // an iterator function for updating all param collections for these battler effects.
    const battlerEffectsMapper = battlerEffects =>
    {
      // initialize the params to defaults.
      const newBParams = [100, 100, 100, 100, 100, 100, 100, 100];
      const newXParams = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
      const newSParams = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

      // extract all the raw parameters.
      const {
        bparams, xparams, sparams,
      } = battlerEffects;

      // an iterator function for updating bparams.
      const bParamForEacher = rawParam =>
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
            .forEach(paramId => newBParams[paramId] = parsedParameterRate);
        }
        else
        {
          // set the new param.
          newBParams[parsedParameterId] = parsedParameterRate;
        }
      };

      // parse bparams from the layer.
      const parsedBParams = JSON.parse(bparams);

      // update the bparams for the effects.
      parsedBParams.forEach(bParamForEacher, this);

      // an iterator function for updating xparams.
      const xParamForEacher = rawParam =>
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
          Game_BattlerBase.knownExParameterIds()
            .forEach(paramId => newXParams[paramId] = parsedParameterRate);
        }
        else
        {
          // set the new param.
          newXParams[parsedParameterId] = parsedParameterRate;
        }
      };

      // parse xparams from this layer.
      const parsedXParams = JSON.parse(xparams);

      // update the xparams for the effects.
      parsedXParams.forEach(xParamForEacher, this);

      // an iterator function for updating sparams.
      const sParamForEacher = rawParam =>
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
          Game_BattlerBase.knownSpParameterIds()
            .forEach(paramId => newSParams[paramId] = parsedParameterRate);
        }
        else
        {
          // set the new param.
          newSParams[parsedParameterId] = parsedParameterRate;
        }
      };

      // parse sparams from this layer.
      const parsedSParams = JSON.parse(sparams);

      // update the sparams for the effects.
      parsedSParams.forEach(sParamForEacher, this);

      // create a new battler effects based on the modified params.
      const modifiedBattlerEffects = DifficultyBattlerEffects.fromRaw(newBParams, newXParams, newSParams);

      // return the built battler effects.
      return modifiedBattlerEffects;
    };

    // parse the actor battler effects.
    const parsedActorEffects = JSON.parse(actorEffects);
    const mappedActorEffects = battlerEffectsMapper(parsedActorEffects);

    // parse the enemy battler effects.
    const parsedEnemyEffects = JSON.parse(enemyEffects);
    const mappedEnemyEffects = battlerEffectsMapper(parsedEnemyEffects);

    // instantiate the builder with the base data.
    const builder = new DifficultyBuilder(name, key)
      // assign the core data.
      .setDescription(description)
      .setIconIndex(parsedIconIndex)
      .setCost(parsedCost)
      // assign the accessors.
      .setEnabled(enabled === "true")
      .setHidden(hidden === "true")
      .setUnlocked(unlocked === "true")
      // assign the battler data.
      .setActorEffects(mappedActorEffects)
      .setEnemyEffects(mappedEnemyEffects);

    // parse the bonuses from the layer.
    const parsedBonuses = JSON.parse(bonuses);

    // iterate over each of the bonuses and add it to the builder.
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
 * The key for the default difficulty.
 * @type {string}
 */
J.DIFFICULTY.Metadata.DefaultDifficulty = J.DIFFICULTY.PluginParameters['defaultDifficulty'] || String.empty;

/**
 * The default point max for allocating difficulty layers.
 */
J.DIFFICULTY.Metadata.DefaultLayerPointMax = parseInt(J.DIFFICULTY.PluginParameters['initialPoints']) || 0;

/**
 * A collection of all aliased methods for this plugin.
 */
J.DIFFICULTY.Aliased = {
  DataManager: new Map(),

  Game_Actor: new Map(),
  Game_Enemy: new Map(),
  Game_Map: new Map(),
  Game_System: new Map(),
  Game_Temp: new Map(),

  Scene_Map: new Map(),
};

//region plugin commands
/**
 * Plugin command for calling the Difficulty scene/menu.
 */
PluginManager.registerCommand(J.DIFFICULTY.Metadata.Name, "callDifficultyMenu", () =>
{
  Scene_Difficulty.callScene();
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
//endregion metadata