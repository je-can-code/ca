//region introduction
/* eslint-disable */
/*:
 * @target MZ
 * @plugindesc
 * [v2.0.0 DIFFICULTY] A layered difficulty system.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-DropsControl
 * @orderAfter J-SDP
 * @help
 * ============================================================================
 * OVERVIEW:
 * This plugin enables the ability to apply one to many "difficulty layers",
 * defined as a collection of parameter modifications and bonuses against both
 * actors and enemies alike.
 * ----------------------------------------------------------------------------
 * NOTE:
 * There are no tags for this plugin, but all difficulty layers are defined in
 * the plugin parameters.
 * ============================================================================
 * CHANGELOG:
 * - 2.0.0
 *    Updated window layout of scene.
 *    Added multiple layer application support.
 *    Updated difficulty layers to also be applicable to actors if desired.
 *    Refactored a lot of underlying code.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 *
 * @param difficultyConfigs
 * @text DIFFICULTY SETUP
 *
 * @param initialPoints
 * @parent difficultyConfigs
 * @type number
 * @text Starting Points
 * @desc The number of points the player has available from the start of a new game.
 * @default 10
 *
 * @param defaultDifficulty
 * @parent difficultyConfigs
 * @type string
 * @text Default Difficulty
 * @desc The key of the starting or default difficulty before it is decided.
 * @default 000_default
 *
 * @param difficulties
 * @parent difficultyConfigs
 * @type struct<DifficultyStruct>[]
 * @text Difficulties
 * @desc All difficulties, locked or otherwise.
 * @default ["{\"key\":\"020_Normal\",\"name\":\"Normal\",\"iconIndex\":\"883\",\"enabled\":\"false\",\"unlocked\":\"true\",\"hidden\":\"false\",\"description\":\"Your expected gameplay difficulty. Nothing is modified.\",\"bparams\":\"[]\",\"xparams\":\"[]\",\"sparams\":\"[]\",\"bonuses\":\"[]\"}","{\"key\":\"010_Easy\",\"name\":\"Easy\",\"iconIndex\":\"881\",\"enabled\":\"false\",\"unlocked\":\"true\",\"hidden\":\"false\",\"description\":\"A mild experience for players that want to try less and fun more.\",\"bparams\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"80\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"80\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"2\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"80\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"4\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"80\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"7\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"110\\\\\\\"}\\\"]\",\"xparams\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"50\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"3\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"0\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"4\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"0\\\\\\\"}\\\"]\",\"sparams\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"6\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"7\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\"]\",\"bonuses\":\"[\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"2\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"3\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\"]\"}","{\"key\":\"030_Hard\",\"name\":\"Hard\",\"iconIndex\":\"885\",\"enabled\":\"false\",\"unlocked\":\"true\",\"hidden\":\"false\",\"description\":\"A more challenging experience where you might have to try more than button mashing to win.\",\"bparams\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"2\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"4\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"7\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\"]\",\"xparams\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"3\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"4\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\"]\",\"sparams\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"6\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"80\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"7\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"80\\\\\\\"}\\\"]\",\"bonuses\":\"[\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\",\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\",\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"2\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\",\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"3\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\"]\"}"]
 *
 *
 * @command callDifficultyMenu
 * @text Call Difficulty Menu
 * @desc Calls the difficulty menu regardless of the current scene.
 *
 * @command lockDifficulty
 * @text Lock Difficulty
 * @desc Locks a difficulty, making it unchoosable in the difficulty menu.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the difficulties that will be locked.
 *
 * @command unlockDifficulty
 * @text Unlock Difficulty
 * @desc Unlocks a difficulty, making it choosable in the difficulty menu.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the difficulties that will be unlocked.
 *
 * @command hideDifficulty
 * @text Hide Difficulty
 * @desc Hides a difficulty, preventing it from being added to the list in the difficulty menu.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the difficulties that will be hidden.
 *
 * @command unhideDifficulty
 * @text Unhide Difficulty
 * @desc Shows a difficulty, forcing it to be added to the list in the difficulty menu.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the difficulties that will be unhidden.
 *
 * @command enableDifficulty
 * @text Enable Difficulty
 * @desc Enables a difficulty, applying its effects.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the difficulties that will be enabled.
 *
 * @command disableDifficulty
 * @text Disable Difficulty
 * @desc Disables a difficulty, rendering its effects inactive.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the difficulties that will be disabled.
 *
 * @command modifyLayerMax
 * @text Modify Layer Max
 * @desc Modifies the maximum difficulty layer points by the given amount.
 * @arg amount
 * @type number
 * @desc The amount to modify the max layer points by. This can be negative.
 * @min -999999
 * @max 999999
 */
/*~struct~DifficultyStruct:
 * @param key
 * @parent overview
 * @type string
 * @text Unique Key
 * @desc A unique identifier for this difficulty.
 * Only letters, numbers, and underscores are recognized.
 * @default 010_Easy
 *
 * @param name
 * @parent overview
 * @type string
 * @text Name
 * @desc The name of the difficulty.
 * Displayed in the list of difficulties on the left.
 * @default Normal
 *
 * @param iconIndex
 * @parent overview
 * @type number
 * @text Icon Index
 * @desc The index of the icon to represent this difficulty.
 * @default 1
 *
 * @param description
 * @parent overview
 * @type string
 * @text Help Window Text
 * @desc Some text maybe describing the panel.
 * Shows up in the bottom help window.
 * @default Some really cool panel that has lots of hardcore powers.
 *
 * @param cost
 * @parent overview
 * @type number
 * @text Cost
 * @desc The cost required to enable this difficulty.
 * @default 0
 *
 * @param enabled
 * @parent overview
 * @text Is Enabled
 * @type boolean
 * @desc If this is ON/true, then this difficulty will be enabled when a new game starts.
 * @default false
 *
 * @param unlocked
 * @parent overview
 * @text Is Unlocked
 * @type boolean
 * @desc If this is ON/true, then this difficulty will be unlocked when a new game is started.
 * @default false
 *
 * @param hidden
 * @parent overview
 * @text Is Hidden
 * @type boolean
 * @desc If this is ON/true, then this difficulty will be hidden when a new game is started.
 * @default false
 *
 * @param enemyEffects
 * @parent data
 * @type struct<BattlerEffectsStruct>
 * @text Enemy Effects
 * @desc The effects that are applied to enemy battlers.
 * @default {"bparams":"[]","xparams":"[]","sparams":"[]"}
 *
 * @param actorEffects
 * @parent data
 * @type struct<BattlerEffectsStruct>
 * @text Actor Effects
 * @desc The effects that are applied to actor battlers.
 * @default {"bparams":"[]","xparams":"[]","sparams":"[]"}
 *
 * @param bonuses
 * @parent data
 * @type struct<BonusStruct>[]
 * @text Bonus Modifiers
 * @desc Bonuses listed here will be modified by the their respective provided rates.
 * @default []
 */
/*~struct~BParamStruct:
 * @param parameterId
 * @text Parameter Id
 * @desc 0-7 are core parameters.
 * @type number
 * @type select
 * @option All params
 * @value -1
 * @option Max HP
 * @value 0
 * @option Max MP
 * @value 1
 * @option Power
 * @value 2
 * @option Endurance
 * @value 3
 * @option Force
 * @value 4
 * @option Resist
 * @value 5
 * @option Speed
 * @value 6
 * @option Luck
 * @value 7
 * @default 0
 *
 * @param parameterRate
 * @text Parameter Rate
 * @type number
 * @desc The percent multiplier that the given parameter will be modified by.
 * @default 100
 */
/*~struct~XParamStruct:
 * @param parameterId
 * @text X-Parameter Id
 * @desc This x-parameter to be modified.
 * @type select
 * @option All params
 * @value -1
 * @option Hit Rate
 * @value 0
 * @option Evasion Rate
 * @value 1
 * @option Crit Chance
 * @value 2
 * @option Crit Evasion
 * @value 3
 * @option Magic Evasion
 * @value 4
 * @option Magic Reflect Rate
 * @value 5
 * @option Counter Rate
 * @value 6
 * @option HP Regen
 * @value 7
 * @option MP Regen
 * @value 8
 * @option TP Regen
 * @value 9
 * @default 0
 *
 * @param parameterRate
 * @text Parameter Rate
 * @type number
 * @desc The percent multiplier that the given parameter will be modified by.
 * @default 100
 */
/*~struct~SParamStruct:
 * @param parameterId
 * @text S-Parameter Id
 * @desc This s-parameter to be modified.
 * @type select
 * @option All params
 * @value -1
 * @option Targeting Rate
 * @value 0
 * @option Guard Rate
 * @value 1
 * @option Recovery Rate
 * @value 2
 * @option Pharmacy Rate
 * @value 3
 * @option MP Cost Reduction
 * @value 4
 * @option TP Cost Reduction
 * @value 5
 * @option Phys DMG Reduction
 * @value 6
 * @option Magi DMG Reduction
 * @value 7
 * @option Floor DMG Reduction
 * @value 8
 * @option Experience Rate
 * @value 9
 * @default 0
 *
 * @param parameterRate
 * @text Parameter Rate
 * @type number
 * @desc The percent multiplier that the given parameter will be modified by.
 * @default 100
 */
/*~struct~BonusStruct:
 * @param bonusId
 * @text Bonus Modifier
 * @desc This bonus rate to be modified.
 * @type select
 * @option Experience Earned
 * @value 0
 * @option Gold Found
 * @value 1
 * @option Loot Dropped
 * @value 2
 * @option SDP Acquired
 * @value 3
 * @default 0
 *
 * @param bonusRate
 * @text Bonus Rate
 * @type number
 * @desc The percent multiplier that the given bonus will be modified by.
 * @default 100
 */
/*~struct~BattlerEffectsStruct:
 * @param bparams
 * @parent data
 * @type struct<BParamStruct>[]
 * @text B-Parameter Modifiers
 * @desc Parameters listed here will be modified by the their respective provided rates.
 * @default []
 *
 * @param xparams
 * @parent data
 * @type struct<XParamStruct>[]
 * @text X-Parameter Modifiers
 * @desc Parameters listed here will be modified by the their respective provided rates.
 * @default []
 *
 * @param sparams
 * @parent data
 * @type struct<SParamStruct>[]
 * @text S-Parameter Modifiers
 * @desc Parameters listed here will be modified by the their respective provided rates.
 * @default []
 *
 */
/*
 * ==============================================================================
 * CHANGELOG:
 * - 2.0.0
 *    Updated to enable toggling one to many difficulties on at once.
 * - 1.0.0
 *    Initial release.
 * ==============================================================================
 */
/* eslint-enable */

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

//region DifficultyBattlerEffects
/**
 * A collection of all applicable multipliers against core parameters
 * that are a part of a {@link DifficultyMetadata}.
 */
class DifficultyBattlerEffects
{
  /**
   * Creates a new {@link DifficultyBattlerEffects} with the given parameters.
   * @param {number[]} bparams The bparams.
   * @param {number[]} xparams The xparams.
   * @param {number[]} sparams The sparams.
   * @returns {DifficultyBattlerEffects}
   */
  static fromRaw(bparams, xparams, sparams)
  {
    // start with a fresh effects.
    const battlerEffects = new DifficultyBattlerEffects();

    // assign the parameters.
    battlerEffects.bparams = bparams;
    battlerEffects.xparams = xparams;
    battlerEffects.sparams = sparams;

    // return the predefined effects.
    return battlerEffects;
  }

  //region params
  /**
   * The base/b-parameter multipliers.
   * The array aligns percent multipliers against the matching index's parameters.
   * @type {[number, number, number, number, number, number, number, number]}
   */
  bparams = [100, 100, 100, 100, 100, 100, 100, 100];

  /**
   * The secondary/s-parameter multipliers.
   * The array aligns percent multipliers against the matching index's parameters.
   * @type {[number, number, number, number, number, number, number, number, number, number]}
   */
  sparams = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

  /**
   * The extraneous/x-parameter multipliers.
   * The array aligns percent multipliers against the matching index's parameters.
   * @type {[number, number, number, number, number, number, number, number, number, number]}
   */
  xparams = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
  //endregion params

  setBParam()
  {

  }
}
//endregion DifficultyBattlerEffects

class DifficultyBonusEffects
{
  /**
   * The bonus multiplier for experience earned by the player.
   * @type {number}
   */
  exp = 100;

  /**
   * The bonus multiplier for gold found by the player.
   * @type {number}
   */
  gold = 100;

  /**
   * The bonus multiplier for sdp acquired by the player.
   * @type {number}
   */
  sdp = 100;

  /**
   * The bonus multiplier for drops (potentially) gained by the player.
   * @type {number}
   */
  drops = 100;

  /**
   * The bonus multiplier for the encounter rate for the player.
   * @type {number}
   */
  encounters = 100;
}

//region DifficultyBuilder
/**
 * The fluent-builder for easily creating new difficulties.
 */
class DifficultyBuilder 
{
  #name = String.empty;
  #key = String.empty;
  #description = String.empty;
  #iconIndex = 0;
  #cost = 0;

  #actorEffects = new DifficultyBattlerEffects();
  #enemyEffects = new DifficultyBattlerEffects();

  #exp = 100;
  #gold = 100;
  #sdp = 100;
  #drops = 100;
  #encounters = 100;

  #enabled = false;
  #unlocked = true;
  #hidden = false;

  /**
   * Constructor.
   * @param {string} name The name of this difficulty.
   * @param {string} key The unique key of this difficulty.
   */
  constructor(name, key) 
  {
    this.setName(name);
    this.setKey(key);
  }

  /**
   * Builds the difficulty with its current configuration.
   * @returns {DifficultyMetadata}
   */
  build() 
  {
    // start the difficulty here.
    const difficulty = new DifficultyMetadata();

    // assign the core data.
    difficulty.name = this.#name;
    difficulty.key = this.#key;
    difficulty.description = this.#description;
    difficulty.iconIndex = this.#iconIndex;
    difficulty.cost = this.#cost;

    // assign the battler effects.
    difficulty.actorEffects = this.#actorEffects;
    difficulty.enemyEffects = this.#enemyEffects;

    // assign the bonuses.
    difficulty.exp = this.#exp;
    difficulty.gold = this.#gold;
    difficulty.sdp = this.#sdp;
    difficulty.drops = this.#drops;
    difficulty.encounters = this.#encounters;

    // assign the access booleans.
    difficulty.enabled = this.#enabled;
    difficulty.unlocked = this.#unlocked;
    difficulty.hidden = this.#hidden;

    // return the built product.
    return difficulty;
  }

  setName(name) 
  {
    this.#name = name;
    return this;
  }

  setKey(key) 
  {
    this.#key = key;
    return this;
  }

  setDescription(description) 
  {
    this.#description = description;
    return this;
  }

  setIconIndex(iconIndex) 
  {
    this.#iconIndex = iconIndex;
    return this;
  }

  setCost(cost) 
  {
    this.#cost = cost;
    return this;
  }

  setActorEffects(effects) 
  {
    this.#actorEffects = effects;
    return this;
  }

  setEnemyEffects(effects)
  {
    this.#enemyEffects = effects;
    return this;
  }

  setExp(exp)
  {
    this.#exp = exp;
    return this;
  }

  setGold(gold)
  {
    this.#gold = gold;
    return this;
  }

  setSdp(sdp)
  {
    this.#sdp = sdp;
    return this;
  }

  setDrops(drops)
  {
    this.#drops = drops;
    return this;
  }

  setEncounters(encounters)
  {
    this.#encounters = encounters;
    return this;
  }

  setUnlocked(unlocked)
  {
    this.#unlocked = unlocked;
    return this;
  }

  setEnabled(enabled)
  {
    this.#enabled = enabled;
    return this;
  }

  setHidden(hidden)
  {
    this.#hidden = hidden;
    return this;
  }
}
//endregion DifficultyBuilder

//region DifficultyConfig
class DifficultyConfig
{
  /**
   * Creates a new instance of {@link DifficultyLayer} from a {@link DifficultyMetadata}.
   * @param {DifficultyMetadata} difficultyMetadata The metadata to build from.
   * @returns {DifficultyLayer} The new difficulty based on the metadata.
   */
  static fromMetadata(difficultyMetadata)
  {
    // initialize the config.
    const difficultyConfig = new DifficultyConfig();

    // core information.
    difficultyConfig.key = difficultyMetadata.key;

    // access modifiers.
    difficultyConfig.enabled = difficultyMetadata.enabled;
    difficultyConfig.unlocked = difficultyMetadata.unlocked;
    difficultyConfig.hidden = difficultyMetadata.hidden;

    // return our translated config.
    return difficultyConfig;
  }

  //region properties
  /**
   * The unique identifier of the difficulty, used for lookup and reference.
   * @type {string}
   */
  key = String.empty;
  //endregion properties

  //region access
  /**
   * Whether or not this difficulty is enabled.
   * When a difficulty is enabled, its global effects are applied.
   * @type {boolean}
   */
  enabled = false;

  /**
   * Whether or not this difficulty is unlocked and can be enabled/disabled.
   * @type {boolean}
   */
  unlocked = true;

  /**
   * Whether or not this difficulty is hidden from selection.
   * @type {boolean}
   */
  hidden = false;
  //endregion access

  /**
   * Constructor.
   * @param {string} key The key of the difficulty.
   * @param {boolean} enabled Whether or not this difficulty's effects are applied from the start.
   * @param {boolean} unlocked Whether or not this difficulty is unlocked for application.
   * @param {boolean} hidden Whether or not this difficulty is visible in the list.
   */
  constructor(key = String.empty, enabled = false, unlocked = true, hidden = false)
  {
    this.key = key;
    this.enabled = enabled;
    this.unlocked = unlocked;
    this.hidden = hidden;
  }
}
//endregion DifficultyConfig

//region DifficultyLayer
/**
 * A class governing a single difficulty and the way it impacts the game parameters.
 */
class DifficultyLayer
{
  /**
   * Creates a new instance of {@link DifficultyLayer} from a {@link DifficultyMetadata}.
   * @param {DifficultyMetadata} difficultyMetadata The metadata to build from.
   * @returns {DifficultyLayer} The new difficulty based on the metadata.
   */
  static fromMetadata(difficultyMetadata)
  {
    // initialize the difficulty.
    const difficultyLayer = new DifficultyLayer(difficultyMetadata.key);

    // core information.
    difficultyLayer.name = difficultyMetadata.name;
    difficultyLayer.description = difficultyMetadata.description;
    difficultyLayer.iconIndex = difficultyMetadata.iconIndex;
    difficultyLayer.cost = difficultyMetadata.cost;

    // combat modifiers.
    difficultyLayer.actorEffects = difficultyMetadata.actorEffects;
    difficultyLayer.enemyEffects = difficultyMetadata.enemyEffects;

    // reward modifiers.
    difficultyLayer.exp = difficultyMetadata.exp;
    difficultyLayer.gold = difficultyMetadata.gold;
    difficultyLayer.drops = difficultyMetadata.drops;
    difficultyLayer.encounters = difficultyMetadata.encounters;

    // custom modifiers.
    difficultyLayer.sdp = difficultyMetadata.sdp;

    // return our translated metadata.
    return difficultyLayer;
  }

  /**
   * A default {@link DifficultyLayer} with all unmodified parameters and bonuses.
   * When all layers are disabled, this is the default layer used.
   * @type {DifficultyLayer}
   */
  static defaultLayer = new DifficultyLayer(J.DIFFICULTY.Metadata.DefaultDifficulty);

  /**
   * The key associated with the applied difficulty.
   * @type {string}
   */
  static appliedKey = `000_applied-difficulty`;

  /**
   * Constructor to instantiate a layer of difficulty with a key.
   * @param {string} key The key of this layer.
   */
  constructor(key)
  {
    this.key = key;
  }

  /**
   * Checks whether or not this difficulty layer is actually the default layer.
   * @returns {boolean}
   */
  isDefaultLayer()
  {
    return this.key === J.DIFFICULTY.Metadata.DefaultDifficulty;
  }

  /**
   * Checks whether or not this difficulty layer is actually the applied difficulty layer.
   * @returns {boolean}
   */
  isAppliedLayer()
  {
    return this.key === DifficultyLayer.appliedKey;
  }

  //region properties
  /**
   * The name of the difficulty, visually to the player.
   * @type {string}
   */
  name = String.empty;

  /**
   * The unique identifier of the difficulty, used for lookup and reference.
   * @type {string}
   */
  key = String.empty;

  /**
   * The description of the difficulty, displayed in the help window at the top.
   * @type {string}
   */
  description = String.empty;

  /**
   * The icon used when the name of the difficulty is displayed in the scene.
   * @type {number}
   */
  iconIndex = 0;

  /**
   * The cost required to enable this difficulty.
   * @type {number}
   */
  cost = 0;

  /**
   * The various parameter effects that apply to actors.
   * @type {DifficultyBattlerEffects}
   */
  actorEffects = new DifficultyBattlerEffects();

  /**
   * The various parameter effects that apply to enemies.
   * @type {DifficultyBattlerEffects}
   */
  enemyEffects = new DifficultyBattlerEffects();

  /**
   * The bonus multiplier for experience earned by the player.
   * @type {number}
   */
  exp = 100;

  /**
   * The bonus multiplier for gold found by the player.
   * @type {number}
   */
  gold = 100;

  /**
   * The bonus multiplier for sdp acquired by the player.
   * @type {number}
   */
  sdp = 100;

  /**
   * The bonus multiplier for drops (potentially) gained by the player.
   * @type {number}
   */
  drops = 100;

  /**
   * The bonus multiplier for the encounter rate for the player.
   * @type {number}
   */
  encounters = 100;
  //endregion properties

  //region access
  /**
   * Whether or not this difficulty's cost can be covered by the remaining layer points.
   * @returns {boolean} True if the cost can be paid, false otherwise.
   */
  canPayCost()
  {
    // payment is defined by having at least this layer's cost remaining
    const canPay = this.cost <= $gameSystem.getRemainingLayerPoints();

    // return our determination.
    return canPay;
  }

  /**
   * Determines whether or not this difficulty is unlocked.
   * @returns {boolean}
   */
  isUnlocked()
  {
    // grab whether or not the the difficulty was unlocked.
    const { unlocked } = $gameSystem.getDifficultyConfigByKey(this.key);

    // return what we found.
    return unlocked;
  }

  /**
   * Locks this difficulty, making it unavailable for the player to enable/disable.
   */
  lock()
  {
    // grab the configuration to lock.
    const config = $gameSystem.getDifficultyConfigByKey(this.key);

    // lock it.
    config.unlocked = false;
  }

  /**
   * Unlocks this difficulty, making it available for the player to enable/disable.
   */
  unlock()
  {
    // grab the configuration to unlock.
    const config = $gameSystem.getDifficultyConfigByKey(this.key);

    // unlock it.
    config.unlocked = true;
  }

  /**
   * Determines whether or not this difficulty is hidden in the list.
   * @returns {boolean}
   */
  isHidden()
  {
    // grab whether or not the difficulty was hidden.
    const { hidden } = $gameSystem.getDifficultyConfigByKey(this.key);

    // return what we found.
    return hidden;
  }

  /**
   * Hides this difficulty, making it no longer listed in the difficulty list.
   */
  hide()
  {
    // grab the configuration to hide.
    const config = $gameSystem.getDifficultyConfigByKey(this.key);

    // hide it.
    config.hidden = true;
  }

  /**
   * Unhides this difficulty, making it visible in the difficulty list.
   */
  unhide()
  {
    // grab the configuration to unhide.
    const config = $gameSystem.getDifficultyConfigByKey(this.key);

    // unhide it.
    config.hidden = false;
  }

  /**
   * Determines whether or not this difficulty is currently enabled.
   * @returns {boolean} True if this difficulty is enabled, false otherwise.
   */
  isEnabled()
  {
    // grab whether or not the difficulty was enabled.
    const { enabled } = $gameSystem.getDifficultyConfigByKey(this.key);

    // return what we found.
    return enabled;
  }

  /**
   * Enables this difficulty layer.
   */
  enable()
  {
    // grab the configuration to enable.
    const config = $gameSystem.getDifficultyConfigByKey(this.key);

    // enable it.
    config.enabled = true;
  }

  /**
   * Disables this difficulty layer.
   */
  disable()
  {
    // grab the configuration to disable.
    const config = $gameSystem.getDifficultyConfigByKey(this.key);

    // disable it.
    config.enabled = false;
  }
  //endregion access
}
//endregion DifficultyLayer

//region Difficulty
/**
 * A class governing a single difficulty and the way it impacts the game parameters.
 */
class DifficultyMetadata
{
  //region properties
  /**
   * The name of the difficulty, visually to the player.
   * @type {string}
   */
  name = String.empty;

  /**
   * The unique identifier of the difficulty, used for lookup and reference.
   * @type {string}
   */
  key = String.empty;

  /**
   * The description of the difficulty, displayed in the help window at the top.
   * @type {string}
   */
  description = String.empty;

  /**
   * The icon used when the name of the difficulty is displayed in the scene.
   * @type {number}
   */
  iconIndex = 0;

  /**
   * The cost required to enable this difficulty.
   * @type {number}
   */
  cost = 0;
  //endregion properties

  //region params
  /**
   * The various battler effects that apply against actors.
   * @type {DifficultyBattlerEffects}
   */
  actorEffects = new DifficultyBattlerEffects();

  /**
   * The various battler effects that apply against enemies.
   * @type {DifficultyBattlerEffects}
   */
  enemyEffects = new DifficultyBattlerEffects();
  //endregion params

  //region bonuses
  /**
   * The bonus multiplier for experience earned by the player.
   * @type {number}
   */
  exp = 100;

  /**
   * The bonus multiplier for gold found by the player.
   * @type {number}
   */
  gold = 100;

  /**
   * The bonus multiplier for sdp acquired by the player.
   * @type {number}
   */
  sdp = 100;

  /**
   * The bonus multiplier for drops (potentially) gained by the player.
   * @type {number}
   */
  drops = 100;

  /**
   * The bonus multiplier for the encounter rate for the player.
   * @type {number}
   */
  encounters = 100;
  //endregion bonuses

  //region access
  /**
   * Whether or not this difficulty is enabled.
   * When a difficulty is enabled, its global effects are applied.
   * @type {boolean}
   */
  enabled = false;

  /**
   * Whether or not this difficulty is unlocked and can be enabled/disabled.
   * @type {boolean}
   */
  unlocked = true;

  /**
   * Whether or not this difficulty is hidden from selection.
   * @type {boolean}
   */
  hidden = false;
  //endregion access
}
//endregion Difficulty

/**
 * Extends {@link DataManager.setupNewGame}.
 * Includes difficulty setup for new games.
 */
J.DIFFICULTY.Aliased.DataManager.set('setupNewGame', DataManager.setupNewGame);
DataManager.setupNewGame = function()
{
  // perform original logic.
  J.DIFFICULTY.Aliased.DataManager.get('setupNewGame').call(this);

  // setup the difficulty layers in the temp data.
  $gameTemp.setupDifficultySystem();
};

//region DifficultyManager
/**
 * A static class to manage the difficulties with.
 */
class DifficultyManager
{
  /**
   * Gets all difficulties defined, including locked difficulties.
   * @returns {DifficultyLayer[]}
   */
  static allDifficulties()
  {
    // grab the difficulties available.
    const difficultyLayersSource = $gameTemp.getAllDifficultyLayers();

    // initialize the running collection.
    const difficultyLayers = [];

    // map each of the items to the array.
    difficultyLayersSource.forEach(layer => difficultyLayers.push(layer));

    // return the compiled array of all difficulty layers.
    return difficultyLayers;
  }

  /**
   * Gets all available difficulties.
   * @returns {DifficultyLayer[]}
   */
  static availableDifficulties()
  {
    // a filtering function for the list of difficulties to populate the list.
    const filtering = difficultyLayer =>
    {
      // if the difficulty isn't visible, it isn't "available".
      if (difficultyLayer.isHidden()) return false;

      // this layer is available.
      return true;
    };

    // return the filtered collection of difficulties.
    return this.allDifficulties().filter(filtering);
  }

  /**
   * Gets the difficulty by its key.
   * Centralized if needing refactoring down the road.
   * @param {string} key The key of the difficulty to find.
   * @returns {DifficultyLayer|undefined} The difficulty if the key exists, undefined otherwise.
   */
  static #getDifficultyByKey = key => $gameTemp.findDifficultyLayerByKey(key);

  /**
   * Re-evaluates all currently enabled difficulties and refreshes the applied difficulty.
   */
  static refreshAppliedDifficulty = () => $gameTemp.refreshAppliedDifficulty();

  /**
   * Locks the difficulty with the given key.
   * @param {string} key The difficulty key to lock.
   */
  static lockDifficulty(key)
  {
    // grab the difficulty.
    const foundDifficulty = this.#getDifficultyByKey(key);

    // validate we found it.
    if (foundDifficulty)
    {
      // lock it.
      foundDifficulty.lock();
    }
    // we didn't find a difficulty by that key.
    else
    {
      console.warn(`could not lock difficulty with key: [${key}].`);
    }
  }

  /**
   * Unlocks the difficulty with the given key.
   * @param {string} key The difficulty key to unlock.
   */
  static unlockDifficulty(key)
  {
    // grab the difficulty.
    const foundDifficulty = this.#getDifficultyByKey(key);

    // validate we found it.
    if (foundDifficulty)
    {
      // unlock it.
      foundDifficulty.unlock();
    }
    // we didn't find a difficulty by that key.
    else
    {
      console.warn(`could not lock difficulty with key: [${key}].`);
    }
  }

  /**
   * Hides the difficulty with the given key.
   * @param {string} key The difficulty key to hide.
   */
  static hideDifficulty(key)
  {
    // grab the difficulty.
    const foundDifficulty = this.#getDifficultyByKey(key);

    // validate we found it.
    if (foundDifficulty)
    {
      // hide it.
      foundDifficulty.hide();
    }
    // we didn't find a difficulty by that key.
    else
    {
      console.warn(`could not lock difficulty with key: [${key}].`);
    }
  }

  /**
   * Reveals the difficulty with the given key.
   * @param {string} key The difficulty key to reveal.
   */
  static unhideDifficulty(key)
  {
    // grab the difficulty.
    const foundDifficulty = this.#getDifficultyByKey(key);

    // validate we found it.
    if (foundDifficulty)
    {
      // unhide it.
      foundDifficulty.unhide();
    }
    // we didn't find a difficulty by that key.
    else
    {
      console.warn(`could not unlock difficulty with key: [${key}].`);
    }
  }

  /**
   * Enables the difficulty with the given key.
   * @param {string} key The difficulty key to enable.
   */
  static enableDifficulty(key)
  {
    // grab the difficulty.
    const foundDifficulty = this.#getDifficultyByKey(key);

    // validate we found it.
    if (foundDifficulty)
    {
      // enable it.
      foundDifficulty.enable();

      // refresh the applied difficulty since this is now enabled.
      this.refreshAppliedDifficulty();
    }
    // we didn't find a difficulty by that key.
    else
    {
      console.warn(`could not enable difficulty with key: [${key}].`);
    }
  }

  /**
   * Disables the difficulty with the given key.
   * @param {string} key The difficulty key to disable.
   */
  static disableDifficulty(key)
  {
    // grab the difficulty.
    const foundDifficulty = this.#getDifficultyByKey(key);

    // validate we found it.
    if (foundDifficulty)
    {
      // disable it.
      foundDifficulty.disable();

      // refresh the applied difficulty since this is now disabled.
      this.refreshAppliedDifficulty();
    }
    // we didn't find a difficulty by that key.
    else
    {
      console.warn(`could not disable difficulty with key: [${key}].`);
    }
  }
}
//endregion DifficultyManager

//region Game_Actor
/**
 * Extends {@link #param}.
 * Also modifies the value based on the applied difficulty.
 * @returns {number}
 */
J.DIFFICULTY.Aliased.Game_Actor.set("param", Game_Actor.prototype.param);
Game_Actor.prototype.param = function(paramId)
{
  // grab the original value.
  const originalValue = J.DIFFICULTY.Aliased.Game_Actor.get("param").call(this, paramId);

  // grab the currently applied difficulty.
  const appliedDifficulty = $gameTemp.getAppliedDifficulty();

  // determine the multiplier for the parameter according to the difficulty.
  const multiplier = appliedDifficulty.actorEffects.bparams[paramId] / 100;

  // return the rounded product of the multiplier and the original value.
  return Math.round(originalValue * multiplier);
};

/**
 * Extends {@link #sparam}.
 * Also modifies the value based on the applied difficulty.
 * @returns {number}
 */
J.DIFFICULTY.Aliased.Game_Actor.set("sparam", Game_Actor.prototype.sparam);
Game_Actor.prototype.sparam = function(sparamId)
{
  // grab the original value.
  const originalValue = J.DIFFICULTY.Aliased.Game_Actor.get("sparam").call(this, sparamId);

  // grab the currently applied difficulty.
  const appliedDifficulty = $gameTemp.getAppliedDifficulty();

  // determine the multiplier for the parameter according to the difficulty.
  const multiplier = appliedDifficulty.actorEffects.sparams[sparamId] / 100;

  // return the rounded product of the multiplier and the original value.
  return (originalValue * multiplier);
};

/**
 * Extends {@link #xparam}.
 * Also modifies the value based on the applied difficulty.
 * @returns {number}
 */
J.DIFFICULTY.Aliased.Game_Actor.set("xparam", Game_Actor.prototype.xparam);
Game_Actor.prototype.xparam = function(xparamId)
{
  // grab the original value.
  const originalValue = J.DIFFICULTY.Aliased.Game_Actor.get("xparam").call(this, xparamId);

  // grab the currently applied difficulty.
  const appliedDifficulty = $gameTemp.getAppliedDifficulty();

  // determine the multiplier for the parameter according to the difficulty.
  const multiplier = appliedDifficulty.actorEffects.xparams[xparamId] / 100;

  // return the rounded product of the multiplier and the original value.
  return (originalValue * multiplier);
};
//endregion Game_Actor

//region Game_Enemy
/**
 * Extends {@link #param}.
 * Also modifies the value based on the applied difficulty.
 * @returns {number}
 */
J.DIFFICULTY.Aliased.Game_Enemy.set("param", Game_Enemy.prototype.param);
Game_Enemy.prototype.param = function(paramId)
{
  // grab the original value.
  const originalValue = J.DIFFICULTY.Aliased.Game_Enemy.get("param").call(this, paramId);

  // grab the currently applied difficulty.
  const appliedDifficulty = $gameTemp.getAppliedDifficulty();

  // determine the multiplier for the parameter according to the difficulty.
  const multiplier = appliedDifficulty.enemyEffects.bparams[paramId] / 100;

  // return the rounded product of the multiplier and the original value.
  return Math.round(originalValue * multiplier);
};

/**
 * Extends {@link #sparam}.
 * Also modifies the value based on the applied difficulty.
 * @returns {number}
 */
J.DIFFICULTY.Aliased.Game_Enemy.set("sparam", Game_Enemy.prototype.sparam);
Game_Enemy.prototype.sparam = function(sparamId)
{
  // grab the original value.
  const originalValue = J.DIFFICULTY.Aliased.Game_Enemy.get("sparam").call(this, sparamId);

  // grab the currently applied difficulty.
  const appliedDifficulty = $gameTemp.getAppliedDifficulty();

  // determine the multiplier for the parameter according to the difficulty.
  const multiplier = appliedDifficulty.enemyEffects.sparams[sparamId] / 100;

  // return the rounded product of the multiplier and the original value.
  return (originalValue * multiplier);
};

/**
 * Extends {@link #xparam}.
 * Also modifies the value based on the applied difficulty.
 * @returns {number}
 */
J.DIFFICULTY.Aliased.Game_Enemy.set("xparam", Game_Enemy.prototype.xparam);
Game_Enemy.prototype.xparam = function(xparamId)
{
  // grab the original value.
  const originalValue = J.DIFFICULTY.Aliased.Game_Enemy.get("xparam").call(this, xparamId);

  // grab the currently applied difficulty.
  const appliedDifficulty = $gameTemp.getAppliedDifficulty();

  // determine the multiplier for the parameter according to the difficulty.
  const multiplier = appliedDifficulty.enemyEffects.xparams[xparamId] / 100;

  // return the rounded product of the multiplier and the original value.
  return (originalValue * multiplier);
};

/**
 * Extends the `.exp()` function to modify by difficulty.
 * @returns {number}
 */
J.DIFFICULTY.Aliased.Game_Enemy.set("exp", Game_Enemy.prototype.exp);
Game_Enemy.prototype.exp = function()
{
  // grab the original value.
  const originalValue = J.DIFFICULTY.Aliased.Game_Enemy.get("exp").call(this);

  // grab the currently applied difficulty.
  const appliedDifficulty = $gameTemp.getAppliedDifficulty();

  // determine the multiplier for the bonus according to the difficulty.
  const multiplier = appliedDifficulty.exp / 100;

  // return the rounded product of the multiplier and the original value.
  return Math.round(originalValue * multiplier);
};

/**
 * Extends the `.gold()` function to modify by difficulty.
 * @returns {number}
 */
J.DIFFICULTY.Aliased.Game_Enemy.set("gold", Game_Enemy.prototype.gold);
Game_Enemy.prototype.gold = function()
{
  // grab the original value.
  const originalValue = J.DIFFICULTY.Aliased.Game_Enemy.get("gold").call(this);

  // grab the currently applied difficulty.
  const appliedDifficulty = $gameTemp.getAppliedDifficulty();

  // determine the multiplier for the bonus according to the difficulty.
  const multiplier = appliedDifficulty.gold / 100;

  // return the rounded product of the multiplier and the original value.
  return Math.round(originalValue * multiplier);
};

// in order to to properly multiply drop rates, we need to use my drops plugin;
// `J-DropsControl` gives easy access to modify the drop rates, so we'll extend that!
if (J.DROPS)
{
  /**
   * Extends the `.getBaseDropRate()` function to modify by difficulty.
   * @returns {number}
   */
  J.DIFFICULTY.Aliased.Game_Enemy.set("getBaseDropRate", Game_Enemy.prototype.getBaseDropRate);
  Game_Enemy.prototype.getBaseDropRate = function()
  {
    // grab the original value.
    const originalValue = J.DIFFICULTY.Aliased.Game_Enemy.get("getBaseDropRate").call(this);

    // grab the currently applied difficulty.
    const appliedDifficulty = $gameTemp.getAppliedDifficulty();

    // determine the multiplier for the bonus according to the difficulty.
    const multiplier = appliedDifficulty.drops / 100;

    // return the rounded product of the multiplier and the original value.
    return Math.round(originalValue * multiplier);
  };
}

// to modify the SDP system, we actually need to have the SDP system implemented.
if (J.SDP)
{
  /**
   * Extends the `.sdpPoints()` function to modify by difficulty.
   * @returns {number}
   */
  J.DIFFICULTY.Aliased.Game_Enemy.set("sdpPoints", Game_Enemy.prototype.sdpPoints);
  Game_Enemy.prototype.sdpPoints = function()
  {
    // grab the original value.
    const originalValue = J.DIFFICULTY.Aliased.Game_Enemy.get("sdpPoints").call(this);

    // grab the currently applied difficulty.
    const appliedDifficulty = $gameTemp.getAppliedDifficulty();

    // determine the multiplier for the bonus according to the difficulty.
    const multiplier = appliedDifficulty.sdp / 100;

    // return the rounded product of the multiplier and the original value.
    return Math.round(originalValue * multiplier);
  };
}
//endregion Game_Enemy

//region Game_Map
/**
 * Extends the `.encounterStep()` function to modify by difficulty.
 * @returns {number}
 */
J.DIFFICULTY.Aliased.Game_Map.set("encounterStep", Game_Map.prototype.encounterStep);
Game_Map.prototype.encounterStep = function()
{
  // grab the original value.
  const originalValue = J.DIFFICULTY.Aliased.Game_Map.get("encounterStep").call(this);

  // grab the currently applied difficulty.
  const appliedDifficulty = $gameTemp.getAppliedDifficulty();

  // determine the multiplier for the bonus according to the difficulty.
  const multiplier = appliedDifficulty.encounters / 100;

  // return the rounded product of the multiplier and the original value.
  return Math.round(originalValue * multiplier);
};
//endregion Game_Map

//region Game_System
/**
 * Extends the `.initialize()` with our difficulty initialization.
 */
J.DIFFICULTY.Aliased.Game_System.set('initialize', Game_System.prototype.initialize);
Game_System.prototype.initialize = function()
{
  // perform original logic.
  J.DIFFICULTY.Aliased.Game_System.get('initialize').call(this);

  // initializes members for this plugin.
  this.initDifficultyMembers();
};

/**
 * Initializes the Difficulty System.
 */
Game_System.prototype.initDifficultyMembers = function()
{
  /**
   * The over-arching object that contains all properties for this plugin.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with the difficulty system.
   */
  this._j._difficulty ||= {};

  /**
   * The collection of difficulty configurations tracked by this player.
   * @type {DifficultyConfig[]}
   */
  this._j._difficulty._configurations = [];

  /**
   * The max points available to allocate to difficulty layers.
   * @type {number}
   */
  this._j._difficulty._layerPointMax = J.DIFFICULTY.Metadata.DefaultLayerPointMax;

  /**
   * The current number of points allocated to difficulty layers.
   * @type {number}
   */
  this._j._difficulty._layerPoints = 0;
};

/**
 * Extends {@link #onAfterLoad}.
 * Updates the list of all available difficulties from the latest plugin metadata.
 */
J.DIFFICULTY.Aliased.Game_System.set('onAfterLoad', Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function()
{
  // perform original logic.
  J.DIFFICULTY.Aliased.Game_System.get('onAfterLoad').call(this);

  // setup the difficulty layers in the temp data.
  $gameTemp.setupDifficultySystem();
};

/**
 * Get all current configurations for difficulties.
 * @returns {DifficultyConfig[]}
 */
Game_System.prototype.getAllDifficultyConfigs = function()
{
  return this._j._difficulty._configurations;
};

/**
 * Add a {@link DifficultyConfig} to the list of configurations.
 * @param {DifficultyConfig} config The config to add.
 */
Game_System.prototype.addDifficultyConfig = function(config)
{
  // grab all the configs.
  const difficultyConfigs = this.getAllDifficultyConfigs();

  // add the new config.
  difficultyConfigs.push(config);
};

/**
 * Gets the {@link DifficultyConfig} associated with the given key.
 * @param {string} key The key of the difficulty.
 * @returns {DifficultyConfig|undefined} The config if found, undefined otherwise.
 */
Game_System.prototype.getDifficultyConfigByKey = function(key)
{
  return this.getAllDifficultyConfigs().find(config => config.key === key);
};

/**
 * Registers a {@link DifficultyConfig} with the system if it is not already registered.
 * @param {DifficultyConfig} difficultyConfig The config to register.
 */
Game_System.prototype.registerDifficultyConfig = function(difficultyConfig)
{
  // grab the key from the config.
  const { key } = difficultyConfig;

  // determine the index of the config.
  const foundConfig = this.getDifficultyConfigByKey(key);

  // we haven't registered this config yet.
  if (!foundConfig)
  {
    // only register the config if it didn't exist previously.
    this.addDifficultyConfig(difficultyConfig);
  }
};

/**
 * Gets the number of max layer points the player has.
 * @returns {number}
 */
Game_System.prototype.getLayerPointMax = function()
{
  return this._j._difficulty._layerPointMax;
};

/**
 * Sets the max layer points to a designated amount.
 * @param {number} layerPointMax The new max layer point value.
 */
Game_System.prototype.setLayerPointMax = function(layerPointMax)
{
  this._j._difficulty._layerPointMax = layerPointMax;
};

/**
 * Modifies the max layer points by a given amount.
 * @param {number} modifier The modifier against the max layer points.
 */
Game_System.prototype.modLayerPointMax = function(modifier)
{
  this._j._difficulty._layerPointMax += modifier;
};

/**
 * Gets the number of current layer points the player has available.
 * @returns {number}
 */
Game_System.prototype.getLayerPoints = function()
{
  return this._j._difficulty._layerPoints;
};

/**
 * Sets the current number of layer points the player has available.
 * @param {number} layerPoints The new amount of layer points for the player.
 */
Game_System.prototype.setLayerPoints = function(layerPoints)
{
  this._j._difficulty._layerPoints = layerPoints;
};

/**
 * Modifies the current layer points by a given amount.
 * @param {number} modifier The modifier against the current layer points.
 */
Game_System.prototype.modLayerPoints = function(modifier)
{
  this._j._difficulty._layerPoints += modifier;
};

/**
 * Gets the remaining number of layer points available.
 * @returns {number}
 */
Game_System.prototype.getRemainingLayerPoints = function()
{
  return (this.getLayerPointMax() - this.getLayerPoints());
};
//endregion Game_System

//region Game_Temp
/**
 * Intializes all additional members of this class.
 */
J.DIFFICULTY.Aliased.Game_Temp.set('initMembers', Game_Temp.prototype.initMembers);
Game_Temp.prototype.initMembers = function()
{
  // perform original logic.
  J.DIFFICULTY.Aliased.Game_Temp.get('initMembers').call(this);

  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with JABS.
   */
  this._j._difficulty ||= {};

  /**
   * All difficulties that were defined in the plugin metadata.
   * @type {Map<string, DifficultyMetadata>}
   */
  this._j._difficulty._metadata = J.DIFFICULTY.Helpers.toDifficultiesMap(
    J.DIFFICULTY.PluginParameters['difficulties']);

  /**
   * All difficulties available for use.
   * @type {Map<string, DifficultyLayer>}
   */
  this._j._difficulty._allLayers = new Map();

  /**
   * All difficulties' default configurations.
   * @type {Map<string, DifficultyConfig>}
   */
  this._j._difficulty._allConfigs = new Map();

  /**
   * The "applied" difficulty.
   * This is effectively a combination of all currently enabled difficulties as
   * a single {@link DifficultyLayer}.
   * @type {DifficultyLayer}
   */
  this._j._difficulty._appliedDifficulty = DifficultyLayer.defaultLayer;
};

/**
 * Gets all difficulties that have been defined by plugin metadata.
 * @returns {Map<string, DifficultyLayer>}
 */
Game_Temp.prototype.getAllDifficultyLayers = function()
{
  return this._j._difficulty._allLayers;
};

/**
 * Finds the {@link DifficultyLayer} that matches the given key.
 * @param {string} key The key of the difficulty to find.
 * @returns {DifficultyLayer|undefined} The difficulty if it existed, `undefined` otherwise;
 */
Game_Temp.prototype.findDifficultyLayerByKey = function(key)
{
  // grab all the difficulties.
  const difficulties = this.getAllDifficultyLayers();

  // return what was found.
  return difficulties.get(key);
};

/**
 * Sets up the difficulty layers based on the plugin parameters.
 */
Game_Temp.prototype.setupDifficultySystem = function()
{
  // iterate over each of the metadatas.
  this._j._difficulty._metadata.forEach((difficultyMetadata, key) =>
  {
    // create the difficulty from metadata.
    const difficultyLayer = DifficultyLayer.fromMetadata(difficultyMetadata);

    // add the difficulty layer to the list of available layers.
    this._j._difficulty._allLayers.set(key, difficultyLayer);

    // create the config from metadata.
    const difficultyConfig = DifficultyConfig.fromMetadata(difficultyMetadata);

    // add the difficulty config to the list of available configs.
    this._j._difficulty._allConfigs.set(key, difficultyConfig);

    // also register the configuration with the system for tracking.
    $gameSystem.registerDifficultyConfig(difficultyConfig);
  });

  // refresh the applied difficulty.
  this.refreshAppliedDifficulty();
};

/**
 * Gets the applied difficulty.
 * If somehow there is no applied difficulty in-place, then the default will be used.
 * @returns {DifficultyLayer}
 */
Game_Temp.prototype.getAppliedDifficulty = function()
{
  return this._j._difficulty._appliedDifficulty ?? DifficultyLayer.defaultLayer;
};

/**
 * Sets the applied difficulty to the given difficulty.
 * @param {DifficultyLayer} difficulty The new applied difficulty.
 */
Game_Temp.prototype.setAppliedDifficulty = function(difficulty)
{
  this._j._difficulty._appliedDifficulty = difficulty;
};

/**
 * Refreshes the applied difficulty based on the currently enabled layers.
 */
Game_Temp.prototype.refreshAppliedDifficulty = function()
{
  // build the applied difficulty.
  const appliedDifficulty = this.buildAppliedDifficulty();

  // set the new layer.
  this.setAppliedDifficulty(appliedDifficulty);
};

/**
 * Builds the applied difficulty based on the currently enabled layers.
 * @returns {DifficultyLayer}
 */
Game_Temp.prototype.buildAppliedDifficulty = function()
{
  /** @type {DifficultyLayer[]} */
  const enabledDifficulties = $gameSystem
    .getAllDifficultyConfigs()
    .filter(config => config.enabled)
    .map(config => this.findDifficultyLayerByKey(config.key));

  // check if we have no enabled difficulties.
  if (enabledDifficulties.length === 0)
  {
    // we'll just apply the default layer.
    return DifficultyLayer.defaultLayer;
  }

  // initialize the battler effects.
  const enabledActorEffects = new DifficultyBattlerEffects();
  const enabledEnemyEffects = new DifficultyBattlerEffects();

  // destructure the direct values out.
  let { exp, gold, drops, encounters, sdp, cost } = DifficultyLayer.defaultLayer;

  // iterate over each difficulty layer and apply it multiplicatively to the running amounts.
  enabledDifficulties.forEach(layer =>
  {
    // extract the effects data.
    const { actorEffects, enemyEffects } = layer;

    // iterate over each of the b-params.
    actorEffects.bparams.forEach((bparam, bIndex) =>
    {
      // calculate the factor.
      const bParamFactor = parseFloat((bparam / 100).toFixed(3));

      // apply the multiplier.
      enabledActorEffects.bparams[bIndex] *= bParamFactor;
    });

    // iterate over each of the s-params.
    actorEffects.sparams.forEach((sparam, sIndex) =>
    {
      // calculate the factor.
      const sParamFactor = parseFloat((sparam / 100).toFixed(3));

      // apply the multiplier.
      enabledActorEffects.sparams[sIndex] *= sParamFactor;
    });

    // iterate over each of the x-params.
    actorEffects.xparams.forEach((xparam, xIndex) =>
    {
      // calculate the factor.
      const xParamFactor = parseFloat((xparam / 100).toFixed(3));

      // apply the multiplier.
      enabledActorEffects.xparams[xIndex] *= xParamFactor;
    });

    // iterate over each of the b-params.
    enemyEffects.bparams.forEach((bparam, bIndex) =>
    {
      // calculate the factor.
      const bParamFactor = parseFloat((bparam / 100).toFixed(3));

      // apply the multiplier.
      enabledEnemyEffects.bparams[bIndex] *= bParamFactor;
    });

    // iterate over each of the s-params.
    enemyEffects.sparams.forEach((sparam, sIndex) =>
    {
      // calculate the factor.
      const sParamFactor = parseFloat((sparam / 100).toFixed(3));

      // apply the multiplier.
      enabledEnemyEffects.sparams[sIndex] *= sParamFactor;
    });

    // iterate over each of the x-params.
    enemyEffects.xparams.forEach((xparam, xIndex) =>
    {
      // calculate the factor.
      const xParamFactor = parseFloat((xparam / 100).toFixed(3));

      // apply the multiplier.
      enabledEnemyEffects.xparams[xIndex] *= xParamFactor;
    });

    // calculate the factor.
    const expFactor = parseFloat((layer.exp / 100).toFixed(3));

    // apply the multiplier.
    exp *= expFactor;

    // calculate the factor.
    const goldFactor = parseFloat((layer.gold / 100).toFixed(3));

    // apply the multiplier.
    gold *= goldFactor;

    // calculate the factor.
    const dropsFactor = parseFloat((layer.drops / 100).toFixed(3));

    // apply the multiplier.
    drops *= dropsFactor;

    // calculate the factor.
    const encountersFactor = parseFloat((layer.encounters / 100).toFixed(3));

    // apply the multiplier.
    encounters *= encountersFactor;

    // calculate the factor.
    const sdpFactor = parseFloat((layer.sdp / 100).toFixed(3));

    // apply the multiplier.
    sdp *= sdpFactor;

    // accumulate the cost.
    cost += layer.cost;
  }, this);

  // find the default layer.
  const defaultLayer = enabledDifficulties.find(layer => layer.isDefaultLayer());

  // validate the layer's definition.
  if (defaultLayer)
  {
    // update the default layer with this one.
    DifficultyLayer.defaultLayer = defaultLayer;
  }
  // we do not have a defined default layer.
  else
  {
    throw new Error(`Must have a default difficulty defined in plugin parameters.`);
  }

  // build the new applied difficulty layer.
  const newDifficulty = new DifficultyLayer(DifficultyLayer.appliedKey);
  newDifficulty.name = "Applied Difficulty";
  newDifficulty.description = "The combined effects of all enabled difficulties.";
  newDifficulty.cost = cost;

  // params.
  newDifficulty.actorEffects = enabledActorEffects;
  newDifficulty.enemyEffects = enabledEnemyEffects;

  // bonuses.
  newDifficulty.exp = exp;
  newDifficulty.gold = gold;
  newDifficulty.drops = drops;
  newDifficulty.encounters = encounters;
  newDifficulty.sdp = sdp;

  // return the compiled difficulty.
  return newDifficulty;
};
//endregion Game_Temp

//region Scene_Difficulty
/**
 * The difficulty scene for managing the current difficulty.
 */
class Scene_Difficulty extends Scene_MenuBase
{
  /**
   * Pushes this current scene onto the stack, forcing it into action.
   */
  static callScene()
  {
    SceneManager.push(this);
  }

  constructor()
  {
    // perform original logic.
    super();

    // execute initialization.
    this.initialize();
  }

  /**
   * Initializes all properties for this scene.
   */
  initMembers()
  {
    /**
     * The shared root namespace for all of J's plugin data.
     */
    this._j ||= {};

    /**
     * A grouping of all properties associated with the difficulty layer system.
     */
    this._j._difficulty = {};

    /**
     * The window that shows the description of the difficulty layer.
     * @type {Window_Help}
     */
    this._j._difficulty._helpWindow = null;

    /**
     * The window for showing the difficulty layer point max, current, and projection.
     * @type {Window_DifficultyPoints}
     */
    this._j._difficulty._pointsWindow = null;

    /**
     * The window for displaying the list of difficulty layers the player has not-hidden.
     * @type {Window_DifficultyList}
     */
    this._j._difficulty._listWindow = null;

    /**
     * The window for displaying the various enemy effects this difficulty applies.
     * @type {Window_DifficultyEffects}
     */
    this._j._difficulty._enemyEffects = null;

    /**
     * The window for displaying the various actor effects this difficulty applies.
     * @type {Window_DifficultyEffects}
     */
    this._j._difficulty._actorEffects = null;
  }

  /**
   * Extends {@link #start}.
   * Handles the post-scene setup.
   */
  start()
  {
    // perform original logic.
    super.start();

    // grab the list window.
    const listWindow = this.getDifficultyListWindow();

    // select the applied layer from the list.
    listWindow.select(0);

    // also update what is being hovered.
    this.onHoverChange();
  }

  /**
   * Extends {@link #create}.
   * Creates our scene's windows.
   */
  create()
  {
    // perform original logic.
    super.create();

    // create the various display objects on the screen.
    this.createDisplayObjects();
  }

  /**
   * Creates the display objects for this scene.
   */
  createDisplayObjects()
  {
    // create all our windows.
    this.createAllWindows();
  }

  //region create windows
  /**
   * Creates all windows associated with the difficulty scene.
   */
  createAllWindows()
  {
    // build the points window first.
    this.createPointsWindow();

    // then build the help window based on the location of the points window.
    this.createHelpWindow();

    // then build the list window based on the location of the help window.
    this.createListWindow();

    // create the list of enemy effects.
    this.createEnemyEffectsWindow();

    // create the list of actor effects.
    this.createActorEffectsWindow();
  }

  //region points window
  /**
   * Creates the points window that displays information about your current point allocation.
   */
  createPointsWindow()
  {
    // create the window.
    const window = this.buildPointsWindow();

    // update the tracker with the new window.
    this.setPointsWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the points window.
   * @returns {Window_DifficultyPoints}
   */
  buildPointsWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.pointsRectangle();

    // create the window with the rectangle.
    return new Window_DifficultyPoints(rectangle);
  }

  /**
   * Gets the rectangle associated with the points window.
   * @returns {Rectangle}
   */
  pointsRectangle()
  {
    return new Rectangle(0, 0, 400, 100);
  }

  /**
   * Get the currently tracked points window.
   * @returns {Window_DifficultyPoints}
   */
  getPointsWindow()
  {
    return this._j._difficulty._pointsWindow;
  }

  /**
   * Set the currently tracked points window to the given window.
   * @param {Window_DifficultyPoints} pointsWindow The points window to track.
   */
  setPointsWindow(pointsWindow)
  {
    this._j._difficulty._pointsWindow = pointsWindow;
  }
  //endregion points window

  //region help window
  /**
   * Creates the help window that provides contextual details to the player
   * about the difficulty difference between the selected and current.
   */
  createHelpWindow()
  {
    // create the window.
    const window = this.buildHelpWindow();

    // update the tracker with the new window.
    this.setHelpWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the help window.
   * @returns {Window_Help}
   */
  buildHelpWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.helpRectangle();

    // create the window with the rectangle.
    return new Window_Help(rectangle);
  }

  /**
   * Gets the rectangle associated with the help window.
   * @returns {Rectangle}
   */
  helpRectangle()
  {
    // grab the width from the points window.
    const { width: pointsWidth } = this.getPointsWindow();

    // the help window should be as wide as the screen lesser the points window width.
    const width = Graphics.boxWidth - pointsWidth;

    // build the rectangle to return.
    return new Rectangle(pointsWidth, 0, width, 100);
  }

  /**
   * Get the currently tracked help window.
   * @returns {Window_Help}
   */
  getHelpWindow()
  {
    return this._j._difficultyHelpWindow;
  }

  /**
   * Set the currently tracked help window to the given window.
   * @param {Window_Help} helpWindow The help window to track.
   */
  setHelpWindow(helpWindow)
  {
    this._j._difficultyHelpWindow = helpWindow;
  }
  //endregion help window

  //region list window
  /**
   * Creates the list of difficulties available to the player.
   * This uses the help window's coordinates, and must be created after it.
   */
  createListWindow()
  {
    // create the window.
    const window = this.buildDifficultyListWindow();

    // update the tracker with the new window.
    this.setDifficultyListWindow(window)

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the difficulty list window.
   * @returns {Window_DifficultyList}
   */
  buildDifficultyListWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.difficultyListRectangle();

    // create the window with the rectangle.
    const window = new Window_DifficultyList(rectangle);

    // assign cancel functionality.
    window.setHandler('cancel', this.popScene.bind(this));

    // assign on-select functionality.
    window.setHandler('ok', this.onSelectDifficulty.bind(this));

    // overwrite the onIndexChange hook with our local onHoverChange hook.
    window.onIndexChange = this.onHoverChange.bind(this);

    // return the built and configured difficulty list window.
    return window;
  }

  /**
   * Gets the rectangle associated with the difficulty list command window.
   */
  difficultyListRectangle()
  {
    // grab the points window height.
    const { height: pointsHeight } = this.getPointsWindow();

    // define the width arbitrarily.
    const width = 400;

    // the height should meet the points window bottom.
    const height = Graphics.boxHeight - pointsHeight;

    // define the x coordinate arbitrarily.
    const x = 0;

    // the y coordinate starts at the bottom of the points window.
    const y = pointsHeight;

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Get the currently tracked difficulty list window.
   * @returns {Window_DifficultyList}
   */
  getDifficultyListWindow()
  {
    return this._j._difficulty._listWindow;
  }

  /**
   * Set the currently tracked difficulty list window to the given window.
   * @param {Window_DifficultyList} difficultyListWindow The difficulty list window to track.
   */
  setDifficultyListWindow(difficultyListWindow)
  {
    this._j._difficulty._listWindow = difficultyListWindow;
  }
  //endregion list window

  //region enemy effects window
  /**
   * Creates the window displaying various battler effects applied to enemies.
   */
  createEnemyEffectsWindow()
  {
    // create the window.
    const window = this.buildDifficultyEnemyEffectsWindow();

    // deselect the command of the window.
    window.deselect();
    window.deactivate();

    // update the tracker with the new window.
    this.setDifficultyEnemyEffectsWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the difficulty enemy effects window.
   * @returns {Window_DifficultyEffects}
   */
  buildDifficultyEnemyEffectsWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.difficultyEnemyEffectsRectangle();

    // return the built details window.
    return new Window_DifficultyEffects(rectangle);
  }

  /**
   * Gets the rectangle associated with the difficulty enemy effects window.
   * @returns {Rectangle}
   */
  difficultyEnemyEffectsRectangle()
  {
    // grab the width from the list window.
    const { width: listWidth } = this.getDifficultyListWindow();

    // grab the height from the help window.
    const { height: helpHeight } = this.getHelpWindow();

    // the width should be from the list window to the edge of the screen.
    const width = (Graphics.boxWidth - listWidth) / 2;

    // the height should be from the bottom of the help window to the edge of the screen.
    const height = Graphics.boxHeight - helpHeight;

    // the x coordinate should be the right side of the list window.
    const x = listWidth;

    // the y coordinate should be the bottom side of the help window.
    const y = helpHeight;

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked window.
   * @returns {Window_DifficultyEffects}
   */
  getDifficultyEnemyEffectsWindow()
  {
    return this._j._difficulty._enemyEffects;
  }

  /**
   * Sets the currently tracked window to the given window.
   * @param {Window_DifficultyEffects} window The window to track.
   */
  setDifficultyEnemyEffectsWindow(window)
  {
    this._j._difficulty._enemyEffects = window;
  }
  //endregion enemy effects window

  //region actor effects window
  /**
   * Creates the window displaying various battler effects applied to actors.
   */
  createActorEffectsWindow()
  {
    // create the window.
    const window = this.buildDifficultyActorEffectsWindow();

    // deselect the command of the window.
    window.deselect();
    window.deactivate();

    // update the tracker with the new window.
    this.setDifficultyActorEffectsWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the difficulty actor effects window.
   * @returns {Window_DifficultyEffects}
   */
  buildDifficultyActorEffectsWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.difficultyActorEffectsRectangle();

    // return the built details window.
    return new Window_DifficultyEffects(rectangle);
  }

  /**
   * Gets the rectangle associated with the difficulty actor effects window.
   * @returns {Rectangle}
   */
  difficultyActorEffectsRectangle()
  {
    // grab the width and x of the effects for calculating x of the actor effects.
    const { x: enemyEffectsX, width: effectsEffectsWidth } = this.getDifficultyEnemyEffectsWindow();

    // grab the height from the help window.
    const { height: helpHeight } = this.getHelpWindow();

    const leftSideOfEnemyEffects = enemyEffectsX + effectsEffectsWidth;

    // the width should be from the list window to the edge of the screen.
    const width = (Graphics.boxWidth - leftSideOfEnemyEffects);

    // the height should be from the bottom of the help window to the edge of the screen.
    const height = Graphics.boxHeight - helpHeight;

    // the x coordinate should be the right side of the list window.
    const x = leftSideOfEnemyEffects;

    // the y coordinate should be the bottom side of the help window.
    const y = helpHeight;

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked window.
   * @returns {Window_DifficultyEffects}
   */
  getDifficultyActorEffectsWindow()
  {
    return this._j._difficulty._actorEffects;
  }

  /**
   * Sets the currently tracked window to the given window.
   * @param {Window_DifficultyEffects} window The window to track.
   */
  setDifficultyActorEffectsWindow(window)
  {
    this._j._difficulty._actorEffects = window;
  }
  //endregion actor effects window
  //endregion create windows

  /**
   * Gets the difficulty being hovered over in the difficulty list.
   * @returns {DifficultyLayer}
   */
  hoveredDifficulty()
  {
    // grab the list window.
    const listWindow = this.getDifficultyListWindow();

    // pull the item the cursor is hovering over from the list window.
    return listWindow.hoveredDifficulty();
  }

  //region on-hover
  /**
   * A hook to perform logic when the selected
   */
  onHoverChange()
  {
    // update the points window.
    this.onHoverUpdatePoints();

    // update the help window.
    this.onHoverUpdateHelp();

    // update the details window.
    this.onHoverUpdateEffects();
  }

  /**
   * Updates the points window when the hovered difficulty changes.
   */
  onHoverUpdatePoints()
  {
    // grab the hovered difficulty.
    const hoveredDifficulty = this.hoveredDifficulty();

    // grab the points window.
    const pointsWindow = this.getPointsWindow();

    // update the hovered difficulty for the points window.
    pointsWindow.setHoveredDifficulty(hoveredDifficulty);

    // also refresh the points window.
    pointsWindow.refresh();
  }

  /**
   * Updates the help window when the hovered difficulty changes.
   */
  onHoverUpdateHelp()
  {
    // grab the hovered difficulty.
    const hoveredDifficulty = this.hoveredDifficulty();

    // grab the help window.
    const helpWindow = this.getHelpWindow();

    // set the text of the hovered difficulty for the help window.
    helpWindow.setText(hoveredDifficulty.description);
  }

  /**
   * Updates the details window when the hovered difficulty changes.
   */
  onHoverUpdateEffects()
  {
    // grab the currently hovered difficulty.
    const hoveredDifficulty = this.hoveredDifficulty();

    // if there is no difficulty, then do not update.
    if (!hoveredDifficulty) return;

    // extract the data points from the window.
    const { actorEffects, enemyEffects } = hoveredDifficulty;

    // update the actor effects.
    this.updateActorEffectsWindow(actorEffects);

    // update the enemy effects.
    this.updateEnemyEffectsWindow(enemyEffects);
  }

  updateActorEffectsWindow(newActorEffects)
  {
    // grab the actor window.
    const actorEffectsWindow = this.getDifficultyActorEffectsWindow();

    // check if the hovered difficulty is the same as the assigned one.
    if (actorEffectsWindow.getEffectsList() !== newActorEffects)
    {
      // extract the data points from the window.
      const {
        exp, gold, sdp, drops, encounters
      } = this.hoveredDifficulty();

      // build the bonus effects.
      const bonusEffects = new DifficultyBonusEffects();
      bonusEffects.exp = exp;
      bonusEffects.gold = gold;
      bonusEffects.drops = drops;
      bonusEffects.sdp = sdp;
      bonusEffects.encounters = encounters;

      // update the effects list in the window.
      actorEffectsWindow.updateEffects(
        newActorEffects,
        bonusEffects,
        Window_DifficultyEffects.EffectsTypes.ACTOR);
    }
  }

  updateEnemyEffectsWindow(newEnemyEffects)
  {
    // grab the enemy effects window.
    const enemyEffectsWindow = this.getDifficultyEnemyEffectsWindow();

    // check if the hovered difficulty is the same as the assigned one.
    if (enemyEffectsWindow.getEffectsList() !== newEnemyEffects)
    {
      // extract the data points from the window.
      const {
        exp, gold, sdp, drops, encounters
      } = this.hoveredDifficulty();

      // build the bonus effects.
      const bonusEffects = new DifficultyBonusEffects();
      bonusEffects.exp = exp;
      bonusEffects.gold = gold;
      bonusEffects.drops = drops;
      bonusEffects.sdp = sdp;
      bonusEffects.encounters = encounters;

      // update the effects list in the window.
      enemyEffectsWindow.updateEffects(
        newEnemyEffects,
        bonusEffects,
        Window_DifficultyEffects.EffectsTypes.ENEMY);
    }
  }
  //endregion on-hover

  //region on-select
  /**
   * Runs when the user chooses one of the items in the difficulty list.
   */
  onSelectDifficulty()
  {
    // grab the hovered difficulty.
    const hovered = this.hoveredDifficulty();

    // check if the hovered difficulty is currently enabled.
    if (hovered.isEnabled())
    {
      // disable this difficulty.
      DifficultyManager.disableDifficulty(hovered.key);

      // run the disable difficulty hook.
      this.onDisableDifficulty(hovered);
    }
    else
    {
      // enable this difficulty.
      DifficultyManager.enableDifficulty(hovered.key);

      // run the enable difficulty hook.
      this.onEnableDifficulty(hovered);
    }

    // refresh the difficulty windows.
    this.refreshCoreDifficultyWindows();

    // grab the list window to activate.
    const listWindow = this.getDifficultyListWindow();

    // redirect the player back to enable/disable another item.
    listWindow.activate();
  }

  /**
   * A hook for performing logic when a difficulty layer is disabled.
   * @param {DifficultyLayer} difficulty The difficulty layer being disabled.
   */
  onDisableDifficulty(difficulty)
  {
    // refund the difficulty cost.
    this.refundDifficultyCost(difficulty);

    // play a sound to indicate cancellation of the layer.
    SoundManager.playActorDamage();
  }

  /**
   * A hook for performing logic when a difficulty layer is disabled.
   * @param {DifficultyLayer} difficulty The difficulty layer being disabled.
   */
  refundDifficultyCost(difficulty)
  {
    // the refund is the inverse of the cost.
    const refund = (difficulty.cost * -1);

    // refund the layer points back.
    $gameSystem.modLayerPoints(refund);
  }

  /**
   * A hook for performing logic when a difficulty layer is enabled.
   * @param {DifficultyLayer} difficulty The difficulty layer being enabled.
   */
  onEnableDifficulty(difficulty)
  {
    // apply the difficulty cost.
    this.applyDifficultyCost(difficulty);

    // play a sound to indicate acceptance of the layer.
    SoundManager.playUseSkill();
  }

  /**
   * A hook for performing logic when a difficulty layer is disabled.
   * @param {DifficultyLayer} difficulty The difficulty layer being disabled.
   */
  applyDifficultyCost(difficulty)
  {
    // modify the layer points by the difficulty layer's cost.
    $gameSystem.modLayerPoints(difficulty.cost);
  }
  //endregion on-select

  /**
   * Refreshes all windows in the scene at once.
   */
  refreshCoreDifficultyWindows()
  {
    // grab the windows to refresh.
    const listWindow = this.getDifficultyListWindow();
    const helpWindow = this.getHelpWindow();
    const pointsWindow = this.getPointsWindow();

    // refresh all the windows.
    listWindow.refresh();
    helpWindow.refresh();
    pointsWindow.refresh();
  }
}
//endregion Scene_Difficulty

//region Window_DifficultyEffects
class Window_DifficultyEffects extends Window_Command
{
  /**
   * The difficulty being hovered over from the list.
   * @type {DifficultyBattlerEffects}
   */
  hoveredEffects = null;

  hoveredBonuses = null;

  /**
   * The type of effects being displayed in this list.
   * @type {Window_DifficultyEffects.EffectsTypes}
   */
  hoveredEffectsType = String.empty;

  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect) 
  {
    // construct parent class.
    super(rect);

    // refresh this window.
    this.refresh();
  }

  /**
   * The types of comparison that are valid when comparing parameter values.
   */
  static ComparisonTypes = {
    SAME: "same",
    EASIER: "easier",
    HARDER: "harder",
  };

  /**
   * The types of effects that can be listed in this window.
   */
  static EffectsTypes = {
    ACTOR: "actor",
    ENEMY: "enemy",
  };

  /**
   * Gets the list of battler effects that this window is displaying.
   * @returns {DifficultyBattlerEffects}
   */
  getEffectsList()
  {
    return this.hoveredEffects;
  }

  /**
   * Sets the list of effects that this window is displaying.
   * @param {DifficultyBattlerEffects} effectsList The new effects list.
   */
  setEffectsList(effectsList)
  {
    // don't update if it doesn't need updating.
    if (this.hoveredEffects === effectsList) return;

    // update the effects list.
    this.hoveredEffects = effectsList;
  }

  /**
   * Gets the type of battler effects that this window is displaying.
   * @returns {DifficultyBattlerEffects}
   */
  getEffectsType()
  {
    return this.hoveredEffectsType;
  }

  /**
   * Sets the type of effects that will display in this list.
   * @param {Window_DifficultyEffects.EffectsTypes} effectsType The new effects type.
   */
  setEffectsType(effectsType)
  {
    // don't update if it doesn't need updating.
    if (this.hoveredEffectsType === effectsType) return;

    // update the effects type.
    this.hoveredEffectsType = effectsType;
  }

  /**
   * Gets the effect bonuses that will display in this list.
   * @returns {DifficultyBonusEffects|null}
   */
  getEffectsBonuses()
  {
    return this.hoveredBonuses;
  }

  /**
   * Sets the effect bonuses that will display in this list.
   * @param {DifficultyBonusEffects} bonuses The new bonuses.
   */
  setEffectsBonuses(bonuses)
  {
    if (this.hoveredBonuses === bonuses) return;

    // update the effects bonuses.
    this.hoveredBonuses = bonuses;
  }

  /**
   * Updates the contents of this window with new data.
   * @param {DifficultyBattlerEffects} effectsList The new effects list.
   * @param {DifficultyBonusEffects} effectBonuses The new bonuses list.
   * @param {Window_DifficultyEffects.EffectsTypes} effectsType The new effects type.
   */
  updateEffects(effectsList, effectBonuses, effectsType)
  {
    // update the effects type.
    this.setEffectsType(effectsType);

    // update the effects list.
    this.setEffectsList(effectsList);

    // update the effects bonuses.
    this.setEffectsBonuses(effectBonuses);

    // refresh the window.
    this.refresh();
  }

  /**
   * Implements {@link #makeCommandList}.
   * Renders all the effect of the hovered difficulty layer.
   */
  makeCommandList()
  {
    // grab the applied difficulty
    const effectsList = this.getEffectsList();

    // if there is no hovered difficulty, then don't render this.
    if (!effectsList) return;

    // extract the data out of the hovered difficulty.
    const { bparams, xparams, sparams } = effectsList;

    // initialize our command collection for enemies.
    const battlerEffectsCommands = Array.empty;

    // build the command.
    const effectsTitleCommand = this.buildTitleCommand();

    // add the title command.
    battlerEffectsCommands.push(effectsTitleCommand);

    // build the various commands from the difficulty for enemies.
    const bparamCommands = bparams
      .map(this.buildBParamCommand, this)
      .filter(command => !!command);
    const xparamCommands = xparams
      .map(this.buildXParamCommand, this)
      .filter(command => !!command);
    const sparamCommands = sparams
      .map(this.buildSParamCommand, this)
      .filter(command => !!command);

    // add the commands to the running list.
    battlerEffectsCommands.push(...bparamCommands);
    battlerEffectsCommands.push(...xparamCommands);
    battlerEffectsCommands.push(...sparamCommands);

    const bonusCommands = this.bonusEffectsCommands();

    battlerEffectsCommands.push(...bonusCommands);

    // add all the commands to the enemy effects.
    battlerEffectsCommands.forEach(this.addBuiltCommand, this);
  }

  /**
   * Builds all bonus effects commands.
   * @returns {BuiltWindowCommand[]}
   */
  bonusEffectsCommands()
  {
    // pivot on effects type.
    switch (this.getEffectsType())
    {
      case Window_DifficultyEffects.EffectsTypes.ACTOR:
        return this.bonusActorEffects();
      case Window_DifficultyEffects.EffectsTypes.ENEMY:
        return this.bonusEnemyEffects();
    }
  }

  /**
   * Builds all bonus effects applicable to enemies.
   * @returns {BuiltWindowCommand[]}
   */
  bonusEnemyEffects()
  {
    // grab the current effects bonuses.
    const bonuses = this.getEffectsBonuses();

    // if there are no bonuses, then do not process.
    if (!bonuses) return Array.empty;

    // initialize the bonuses collection.
    const bonusCommands = Array.empty;

    // check if the experience bonus is modified.
    if (bonuses.exp !== 100)
    {
      // determine the value.
      const paramValue = bonuses.exp;

      // get the icon index.
      const paramIconIndex = IconManager.rewardParam(0);

      // get the param name.
      const paramName = TextManager.rewardParam(0);

      // get the description of the parameter.
      const paramDescription = TextManager.rewardDescription(0);

      // initialize the parameter value's sign to indicate increase/decrease from default.
      let paramSign = String.empty;

      // check if greater than default.
      if (paramValue > 100)
      {
        // add a plus.
        paramSign = `+`;
      }

      // determine the compared color against the default.
      const paramColorIndex = this.getComparedBonusColor(
        true,
        paramValue,
        100);

      // build the command.
      const paramCommand = new WindowCommandBuilder(paramName)
        .setIconIndex(paramIconIndex)
        .setRightText(`${paramSign}${paramValue-100}`)
        .setColorIndex(paramColorIndex)
        .addSubTextLines(paramDescription)
        .build();

      // add the built command.
      bonusCommands.push(paramCommand);
    }

    // check if the gold bonus is modified.
    if (bonuses.gold !== 100)
    {
      // determine the value.
      const paramValue = bonuses.gold;

      // get the icon index.
      const paramIconIndex = IconManager.rewardParam(1);

      // get the param name.
      const paramName = TextManager.rewardParam(1);

      // get the description of the parameter.
      const paramDescription = TextManager.rewardDescription(1);

      // initialize the parameter value's sign to indicate increase/decrease from default.
      let paramSign = String.empty;

      // check if greater than default.
      if (paramValue > 100)
      {
        // add a plus.
        paramSign = `+`;
      }

      // determine the compared color against the default.
      const paramColorIndex = this.getComparedBonusColor(
        true,
        paramValue,
        100);

      // build the command.
      const paramCommand = new WindowCommandBuilder(paramName)
        .setIconIndex(paramIconIndex)
        .setRightText(`${paramSign}${paramValue-100}`)
        .setColorIndex(paramColorIndex)
        .addSubTextLines(paramDescription)
        .build();

      // add the built command.
      bonusCommands.push(paramCommand);
    }

    // check if the drops bonus is modified.
    if (bonuses.drops !== 100)
    {
      // determine the value.
      const paramValue = bonuses.drops;

      // get the icon index.
      const paramIconIndex = IconManager.rewardParam(2);

      // get the param name.
      const paramName = TextManager.rewardParam(2);

      // get the description of the parameter.
      const paramDescription = TextManager.rewardDescription(2);

      // initialize the parameter value's sign to indicate increase/decrease from default.
      let paramSign = String.empty;

      // check if greater than default.
      if (paramValue > 100)
      {
        // add a plus.
        paramSign = `+`;
      }

      // determine the compared color against the default.
      const paramColorIndex = this.getComparedBonusColor(
        true,
        paramValue,
        100);

      // build the command.
      const paramCommand = new WindowCommandBuilder(paramName)
        .setIconIndex(paramIconIndex)
        .setRightText(`${paramSign}${paramValue-100}`)
        .setColorIndex(paramColorIndex)
        .addSubTextLines(paramDescription)
        .build();

      // add the built command.
      bonusCommands.push(paramCommand);
    }

    // check if the sdp bonus is modified.
    if (bonuses.sdp !== 100)
    {
      // determine the value.
      const paramValue = bonuses.sdp;

      // get the icon index.
      const paramIconIndex = IconManager.rewardParam(4);

      // get the param name.
      const paramName = TextManager.sdpPoints();

      // get the description of the parameter.
      const paramDescription = TextManager.rewardDescription(4);

      // initialize the parameter value's sign to indicate increase/decrease from default.
      let paramSign = String.empty;

      // check if greater than default.
      if (paramValue > 100)
      {
        // add a plus.
        paramSign = `+`;
      }

      // determine the compared color against the default.
      const paramColorIndex = this.getComparedBonusColor(
        true,
        paramValue,
        100);

      // build the command.
      const paramCommand = new WindowCommandBuilder(paramName)
        .setIconIndex(paramIconIndex)
        .setRightText(`${paramSign}${paramValue-100}`)
        .setColorIndex(paramColorIndex)
        .addSubTextLines(paramDescription)
        .build();

      // add the built command.
      bonusCommands.push(paramCommand);
    }

    // return the built bonus commands.
    return bonusCommands;
  }

  /**
   * Builds all bonus effects applicable to actors.
   * @returns {BuiltWindowCommand[]}
   */
  bonusActorEffects()
  {
    // grab the current effects bonuses.
    const bonuses = this.getEffectsBonuses();

    // if there are no bonuses, then do not process.
    if (!bonuses) return Array.empty;

    // initialize the bonuses collection.
    const bonusCommands = Array.empty;

    if (bonuses.encounters !== 100)
    {
      // determine the value.
      const paramValue = bonuses.encounters;

      // get the icon index.
      const paramIconIndex = IconManager.rewardParam(3);

      // get the param name.
      const paramName = TextManager.rewardParam(3);

      // get the description of the parameter.
      const paramDescription = TextManager.rewardDescription(3);

      // initialize the parameter value's sign to indicate increase/decrease from default.
      let paramSign = String.empty;

      // check if greater than default.
      if (paramValue > 100)
      {
        // add a plus.
        paramSign = `+`;
      }

      // determine the compared color against the default.
      const paramColorIndex = this.getComparedBonusColor(
        true,
        paramValue,
        100);

      // build the command.
      const paramCommand = new WindowCommandBuilder(paramName)
        .setIconIndex(paramIconIndex)
        .setRightText(`${paramSign}${paramValue-100}`)
        .setColorIndex(paramColorIndex)
        .addSubTextLines(paramDescription)
        .build();

      // add the built command.
      bonusCommands.push(paramCommand);
    }

    // return the built bonus commands.
    return bonusCommands;
  }

  buildTitleCommand()
  {
    switch (this.getEffectsType())
    {
      case Window_DifficultyEffects.EffectsTypes.ACTOR:
        return this.buildActorTitleCommand();
      case Window_DifficultyEffects.EffectsTypes.ENEMY:
        return this.buildEnemyTitleCommand();
    }

    // build the command.
    return new WindowCommandBuilder("Effects")
      .setIconIndex(93)
      .setColorIndex(6)
      .build();
  }

  buildEnemyTitleCommand()
  {
    // build the command.
    return new WindowCommandBuilder("Enemy Effects")
      .setIconIndex(14)
      .setColorIndex(2)
      .build();
  }

  buildActorTitleCommand()
  {
    // build the command.
    return new WindowCommandBuilder("Actor Effects")
      .setIconIndex(82)
      .setColorIndex(1)
      .build();
  }

  buildBParamCommand(paramValue, index)
  {
    // don't render commands for unchanged parameters.
    if (paramValue === 100) return;

    // get the icon index.
    const paramIconIndex = IconManager.param(index);

    // get the param name.
    const paramName = TextManager.param(index);

    // get the description of the parameter.
    const paramDescription = TextManager.bparamDescription(index);

    // initialize the parameter value's sign to indicate increase/decrease from default.
    let paramSign = String.empty;

    // check if greater than default.
    if (paramValue > 100)
    {
      // add a plus.
      paramSign = `+`;
    }

    // determine the compared color against the default.
    const paramColorIndex = this.getComparedColor(
      this.biggerIsBetterBParameters(index),
      paramValue,
      100);

    // build the command.
    const paramCommand = new WindowCommandBuilder(paramName)
      .setIconIndex(paramIconIndex)
      .setRightText(`${paramSign}${paramValue-100}`)
      .setColorIndex(paramColorIndex)
      .addSubTextLines(paramDescription)
      .build();

    // return the built command.
    return paramCommand;
  }

  buildXParamCommand(paramValue, index)
  {
    // don't render commands for unchanged parameters.
    if (paramValue === 100) return;

    // get the icon index.
    const paramIconIndex = IconManager.xparam(index);

    // get the param name.
    const paramName = TextManager.xparam(index);

    // get the description of the parameter.
    const paramDescription = TextManager.xparamDescription(index);

    // initialize the parameter value's sign to indicate increase/decrease from default.
    let paramSign = String.empty;

    // check if greater than default.
    if (paramValue > 100)
    {
      // add a plus.
      paramSign = `+`;
    }

    // determine the compared color against the default.
    const paramColorIndex = this.getComparedColor(
      this.biggerIsBetterXParameters(index),
      paramValue,
      100);

    // build the command.
    const paramCommand = new WindowCommandBuilder(paramName)
      .setIconIndex(paramIconIndex)
      .setRightText(`${paramSign}${paramValue-100}`)
      .setColorIndex(paramColorIndex)
      .addSubTextLines(paramDescription)
      .build();

    // return the built command.
    return paramCommand;
  }

  buildSParamCommand(paramValue, index)
  {
    // don't render commands for unchanged parameters.
    if (paramValue === 100) return;

    // get the icon index.
    const paramIconIndex = IconManager.sparam(index);

    // get the param name.
    const paramName = TextManager.sparam(index);

    // get the description of the parameter.
    const paramDescription = TextManager.sparamDescription(index);

    // initialize the parameter value's sign to indicate increase/decrease from default.
    let paramSign = String.empty;

    // check if greater than default.
    if (paramValue > 100)
    {
      // add a plus.
      paramSign = `+`;
    }

    // determine the compared color against the default.
    const paramColorIndex = this.getComparedColor(
      this.biggerIsBetterSParameters(index),
      paramValue,
      100);

    // build the command.
    const paramCommand = new WindowCommandBuilder(paramName)
      .setIconIndex(paramIconIndex)
      .setRightText(`${paramSign}${paramValue-100}`)
      .setColorIndex(paramColorIndex)
      .addSubTextLines(paramDescription)
      .build();

    // return the built command.
    return paramCommand;
  }

  /**
   * Gets the text color for the compared/hovered parameter value.
   * @param {boolean} biggerIsBetter Whether or not a bigger parameter is better.
   * @param {number} paramValue The currently applied parameter.
   * @param {number} comparisonValue The potential parameter to change to.
   * @returns {string} The color string.
   */
  getComparedColor(biggerIsBetter, paramValue, comparisonValue)
  {
    const comparison = this.determineComparisonType(biggerIsBetter, paramValue, comparisonValue);

    if (this.getEffectsType() === Window_DifficultyEffects.EffectsTypes.ENEMY)
    {
      switch (comparison)
      {
        case Window_DifficultyEffects.ComparisonTypes.SAME:
          return 0;
        case Window_DifficultyEffects.ComparisonTypes.EASIER:
          return 29;
        case Window_DifficultyEffects.ComparisonTypes.HARDER:
          return 10;
      }
    }

    if (this.getEffectsType() === Window_DifficultyEffects.EffectsTypes.ACTOR)
    {
      switch (comparison)
      {
        case Window_DifficultyEffects.ComparisonTypes.SAME:
          return 0;
        case Window_DifficultyEffects.ComparisonTypes.HARDER:
          return 29;
        case Window_DifficultyEffects.ComparisonTypes.EASIER:
          return 10;
      }
    }
  }

  getComparedBonusColor(biggerIsBetter, paramValue, comparisonValue)
  {
    const comparison = this.determineComparisonType(biggerIsBetter, paramValue, comparisonValue);
    switch (comparison)
    {
      case Window_DifficultyEffects.ComparisonTypes.SAME:
        return 0;
      case Window_DifficultyEffects.ComparisonTypes.EASIER:
        return 29;
      case Window_DifficultyEffects.ComparisonTypes.HARDER:
        return 10;
    }
  }

  /**
   * Determines whether or not one parameter is "better" than the other.
   * Contextually, this determines whether or not it would become easier for the player if said
   * parameter was changed to the next parameter. In most cases, reducing a parameter would make it
   * easier, so the boolean is typically set to false- but not always.
   * @param {boolean} biggerIsBetter Whether or not a bigger parameter is better.
   * @param {number} baseValue The currently applied parameter.
   * @param {number} comparisonValue The potential parameter to change to.
   * @returns {Window_DifficultyEffects.ComparisonTypes} One of "SAME", "EASIER", or "HARDER".
   */
  determineComparisonType(biggerIsBetter, baseValue, comparisonValue)
  {
    const isSame = (baseValue === comparisonValue);
    const baseIsBigger = (baseValue > comparisonValue);
    const isImprovement = (biggerIsBetter === baseIsBigger);
    if (isSame)
    {
      return Window_DifficultyEffects.ComparisonTypes.SAME;
    }
    else if (isImprovement)
    {
      // the hovered parameter is changed color to indicate it will become easier.
      return Window_DifficultyEffects.ComparisonTypes.EASIER;
    }
    else if (!isImprovement)
    {
      // the hovered parameter is changed color to indicate it will become harder.
      return Window_DifficultyEffects.ComparisonTypes.HARDER;
    }
  }

  /**
   * Get whether or not bigger is better for a b-parameter contextually for the player.
   * @param {number} bparamId The b-parameter id.
   * @returns {boolean} True if it is better for the player when bigger, false otherwise.
   */
  biggerIsBetterBParameters(bparamId)
  {
    const biggerIsBetterBParameters = [
      false, // mhp
      false, // mmp
      false, // atk
      false, // def
      false, // mat
      false, // mdf
      false, // agi
      false, // luk
    ];

    return biggerIsBetterBParameters.at(bparamId) ?? false;
  }

  /**
   * Get whether or not bigger is better for an s-parameter contextually for the player.
   * @param {number} sparamId The s-parameter id.
   * @returns {boolean} True if it is better for the player when bigger, false otherwise.
   */
  biggerIsBetterSParameters(sparamId)
  {
    const biggerIsBetterSParameters = [
      false,  // tgr - aggro rate - used by JABS.
      false,  // grd - guard rate - parry rate in JABS.
      false,  // rec - recovery effectiveness rate.
      false,  // pha - item effectiveness rate - not usually used by enemies.
      true,   // mcr - mp cost reduction.
      true,   // tcr - tp cost reduction - not usually used by enemies.
      true,   // pdr - physical damage reduction.
      true,   // mdr - magic damage reduction.
      true,   // fdr - floor damage rate - not usually used by enemies.
      false,  // exr - experience rate - not usually used by enemies.
    ];

    return biggerIsBetterSParameters[sparamId] ?? true;
  }

  /**
   * Get whether or not bigger is better for an s-parameter contextually for the player.
   * @param {number} xparamId The x-parameter id.
   * @returns {boolean} True if it is better for the player when bigger, false otherwise.
   */
  biggerIsBetterXParameters(xparamId)
  {
    const biggerIsBetterXParameters = [
      false, // hit - hit rate
      false, // eva - parry rate boost %
      false, // cri - crit rate
      false, // cev - crit evade
      false, // mev - magic evade ; not used in JABS
      false, // mrf - magic reflect ; not used in JABS
      false, // cnt - counter rate
      false, // hrg - hp regen per 5
      false, // mrg - mp regen per 5
      false, // trg - tp regen per 5
    ];

    return biggerIsBetterXParameters[xparamId] ?? true;
  }

  /**
   * Overwrites {@link #itemHeight}.
   * Makes the command rows bigger so there can be additional lines.
   * @returns {number}
   */
  itemHeight()
  {
    return this.lineHeight() * 2;
  }
}
//endregion Window_DifficultyEffects

//region Window_DifficultyList
class Window_DifficultyList extends Window_Command
{
  /**
   * @constructor
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Implements {@link #makeCommandList}.
   * Creates the command list of difficulties for this window.
   */
  makeCommandList()
  {
    // grab all the difficulties available.
    const difficulties = DifficultyManager.availableDifficulties();

    // if there are none, then do not try to render items.
    if (!difficulties.length) return;

    // sort the difficulties by their keys as best as possible.
    difficulties.sort((a, b) =>
    {
      if (a.key < b.key) return -1;
      if (a.key > b.key) return 1;
      return 0;
    });

    // add all difficulties to the list.
    difficulties.forEach(this.makeDifficultyCommand, this);

    // grab the applied difficulty.
    const appliedDifficulty = $gameTemp.getAppliedDifficulty();

    // slide the applied difficulty command above all others.
    this.prependCommand(
      `\\I[${appliedDifficulty.iconIndex}]${appliedDifficulty.name}`,
      appliedDifficulty.key,
      false,// enabled
      appliedDifficulty,
      83,   // icon index
      6     // color index
    );
  }

  /**
   * Make and add a single difficulty command.
   * @param {DifficultyLayer} difficulty The dfificulty command to create.
   */
  makeDifficultyCommand(difficulty)
  {
    // don't render the difficulty in the list if it is hidden.
    if (difficulty.isHidden()) return;

    // don't render the difficulty labeled as "default".
    if (difficulty.isDefaultLayer()) return;

    // TODO: parameterize this.
    const enabledIcon = difficulty.isEnabled()
      ? 25
      : 16;

    // initialize the difficulty name to be the difficulty's name with its corresponding icon.
    let difficultyName = `\\I[${difficulty.iconIndex}]${difficulty.name}`;

    // check if the difficulty layer is locked from user selection.
    if (!difficulty.isUnlocked())
    {
      // TODO: parameterize this.
      // grab the lock icon.
      const lockIcon = 2530;

      // slap a lock icon infront of the difficulty.
      difficultyName = `\\I[${lockIcon}]${difficultyName}`;
    }

    // ensures the cost is no more than what points we have remaining.
    // you can disable already enabled layers without needing the point cost again.
    const enoughLayerPoints = difficulty.isEnabled() || (difficulty.canPayCost());

    // check if the command should be enabled.
    // locked commands are always disabled- the player cannot modify locked difficulty layers.
    const enabled = (difficulty.isUnlocked() && enoughLayerPoints);

    // render the command with the given details.
    this.addCommand(
      difficultyName,           // drawEx(name)
      difficulty.key,           // symbol
      enabled,                  // enabled/disabled command
      difficulty,               // extra data
      enabledIcon);             // command icon index
  }

  /**
   * Gets the difficulty being hovered over in this list.
   * @returns {DifficultyLayer}
   */
  hoveredDifficulty()
  {
    return this.currentExt();
  }

  /**
   * Designed for overriding to weave in functionality on-change of the index.
   */
  onIndexChange()
  {
  }
}
//endregion Window_DifficultyList

/**
 * A window containing the difficulty points information.
 */
class Window_DifficultyPoints extends Window_Base
{
  /**
   * The difficulty layer that the cursor is currently hovering over.
   * @type {DifficultyLayer|null}
   */
  #hoveredDifficulty = null;

  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    // execute parent constructor.
    super(rect);
  }

  /**
   * Get the currently hovered difficulty from the list window.
   * @returns {DifficultyLayer}
   */
  getHoveredDifficulty()
  {
    return this.#hoveredDifficulty;
  }

  /**
   * Set the currently hovered difficulty used by this window.
   * @param {DifficultyLayer} difficulty The difficulty currently hovered.
   */
  setHoveredDifficulty(difficulty)
  {
    this.#hoveredDifficulty = difficulty;
  }

  /**
   * Implements {@link Window_Base.drawContent}.
   * Draws the various data points surrounding the difficulty layer points
   * and how they are affected by the difficulty layer currently being
   * hovered over by the player.
   */
  drawContent()
  {
    // define the origin x,y coordinates.
    const [x, y] = [0, 0];

    // shorthand the lineHeight.
    const lh = this.lineHeight();

    this.drawHeader(x, y);

    // draw the max.
    const maxLayerY = y + (lh * 1);
    this.drawMaxLayerPoints(x, maxLayerY);

    // draw the current.
    const currentLayerX = x + 200;
    const currentLayerY = y + (lh * 1);
    this.drawCurrentLayerPoints(currentLayerX, currentLayerY);

    // draw the difficulty's modifier.
    const layerModifierX = x + 250;
    const layerModifierY = y + (lh * 1);
    this.drawLayerModifier(layerModifierX, layerModifierY);
  }

  /**
   * Renders the header for the difficulty layer points available to the player.
   * @param {number} x The origin x coordinate.
   * @param {number} y The origin y coordinate.
   */
  drawHeader(x, y)
  {
    // reset any lingering font settings.
    this.resetFontSettings();

    // make the font size nice and big.
    this.modFontSize(10);

    // enable italics.
    this.toggleItalics(true);

    // TODO: parameterize this.
    // render the icon representing difficulty layers.
    this.drawIcon(2564, x, y);

    // modify the x by the width of an icon with some padding.
    const modX = x + ImageManager.iconWidth + 4;

    // modify the y by an arbitrary small amount to align better with the icon.
    const modY = y - 2;

    // render the headline title text.
    this.drawText(`Difficulty Layer Points`, modX, modY, 300, "left");

    // reset any lingering font settings.
    this.resetFontSettings();
  }

  /**
   * Renders the maximum amount of layer points the player has available.
   * @param {number} x The origin x coordinate.
   * @param {number} y The origin y coordinate.
   */
  drawMaxLayerPoints(x, y)
  {
    // reset any lingering font settings.
    this.resetFontSettings();

    // make the font size nice and big.
    this.modFontSize(-4);

    // grab the max.
    const layerPointMax = $gameSystem.getLayerPointMax();

    // enable bold.
    this.toggleBold(true);

    // draw the layer point maximum.
    this.drawText(`Max:`, x, y, 100, "left");

    // disable bold.
    this.toggleBold(false);

    // draw the layer point maximum.
    this.drawText(`${layerPointMax}`, x, y, 100, "right");

    // reset any lingering font settings.
    this.resetFontSettings();
  }

  /**
   * Renders the currently applied layer points.
   * @param {number} x The origin x coordinate.
   * @param {number} y The origin y coordinate.
   */
  drawCurrentLayerPoints(x, y)
  {
    // reset any lingering font settings.
    this.resetFontSettings();

    // make the font size nice and big.
    this.modFontSize(-4);

    // grab the current points.
    const layerPointsCurrent = $gameSystem.getLayerPoints();

    // enable bold.
    this.toggleBold(true);

    // draw the layer point maximum.
    this.drawText(`Applied:`, x, y, 100, "left");

    // disable bold.
    this.toggleBold(false);

    // draw the layer point maximum.
    this.drawText(`${layerPointsCurrent}`, x, y, 100, "right");

    // reset any lingering font settings.
    this.resetFontSettings();
  }

  /**
   * Renders the modifer against the current amount of applied layer points.
   * @param {number} x The origin x coordinate.
   * @param {number} y The origin y coordinate.
   */
  drawLayerModifier(x, y)
  {
    // get the layer the player is hovering over.
    const difficulty = this.getHoveredDifficulty();

    // if we have no difficulty being hovered, then do not render.
    if (!difficulty) return;

    // don't render for the applied or efault layers.
    if (difficulty.isAppliedLayer() || difficulty.isDefaultLayer()) return;

    // reset any lingering font settings.
    this.resetFontSettings();

    // grab the difficulty layer cost.
    const layerCost = difficulty.cost;

    // default the sign to nothing.
    let sign = String.empty;

    // default the color to white like normal.
    let costColorIndex = 0;

    // check if the cost is a positive amount.
    if (layerCost > 0)
    {
      // change the sign to a plus.
      sign = "+";

      if (layerCost + $gameSystem.getLayerPoints() > $gameSystem.getLayerPointMax())
      {
        // to big, red!
        costColorIndex = 10;
      }
      else
      {
        // an increase.
        costColorIndex = 20;
      }
    }

    // make the font size nice and big.
    this.modFontSize(-4);

    // change the color for the current amounts accordingly.
    this.changeTextColor(ColorManager.textColor(costColorIndex));

    // draw the layer point modifier of this layer.
    this.drawText(`(${sign}${layerCost})`, x, y, 100, "right");

    // reset any lingering font settings.
    this.resetFontSettings();
  }
}