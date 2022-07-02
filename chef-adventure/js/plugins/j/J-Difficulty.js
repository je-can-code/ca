/*  BUNDLED TIME: Sat Jul 02 2022 10:13:46 GMT-0700 (Pacific Daylight Time)  */

//#region introduction
/* eslint-disable */
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 DIFF] A difficulty engine.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @orderAfter J-BASE
 * @orderAfter _diffModels
 * @help
 * ============================================================================
 * This plugin grants you the ability to define a "difficulty system",
 * defined by globally manipulating enemy parameters to be higher or lower as
 * well as modifying basic things like experience gained or gold found.
 * ============================================================================
 *
 * @param systemConfigs
 * @text DIFFICULTY SETUP
 *
 * @param menuSwitch
 * @parent systemConfigs
 * @type switch
 * @desc When this switch is ON, then this command is visible in the menu.
 * @default 1
 *
 * @param difficultyConfigs
 * @text DIFFICULTY SETUP
 *
 * @param defaultDifficulty
 * @parent difficultyConfigs
 * @type string
 * @text Default Difficulty
 * @desc The starting or default difficulty before it is decided.
 * @default 020_Normal
 *
 * @param difficulties
 * @parent difficultyConfigs
 * @type struct<DifficultyStruct>[]
 * @text Difficulties
 * @desc All difficulties, locked or otherwise.
 * @default ["{\"key\":\"010_Easy\",\"name\":\"Easy\",\"iconIndex\":\"881\",\"unlocked\":\"true\",\"description\":\"A mild experience for players that want to try less and fun more.\",\"bparams\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"80\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"80\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"2\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"80\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"4\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"80\\\\\\\"}\\\"]\",\"xparams\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"50\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"3\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"0\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"4\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"0\\\\\\\"}\\\"]\",\"sparams\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"6\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"7\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\"]\",\"bonuses\":\"[\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"2\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"3\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\"]\"}","{\"key\":\"020_Normal\",\"name\":\"Normal\",\"iconIndex\":\"883\",\"unlocked\":\"true\",\"description\":\"Your expected gameplay difficulty. Nothing is modified.\",\"bparams\":\"[]\",\"xparams\":\"[]\",\"sparams\":\"[]\",\"bonuses\":\"[]\"}","{\"key\":\"030_Hard\",\"name\":\"Hard\",\"iconIndex\":\"885\",\"unlocked\":\"true\",\"description\":\"A more challenging experience where you might have to try more than button mashing to win.\",\"bparams\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"2\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"4\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"7\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"120\\\\\\\"}\\\"]\",\"xparams\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"3\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"4\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\"]\",\"sparams\":\"[\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"6\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"80\\\\\\\"}\\\",\\\"{\\\\\\\"parameterId\\\\\\\":\\\\\\\"7\\\\\\\",\\\\\\\"parameterRate\\\\\\\":\\\\\\\"80\\\\\\\"}\\\"]\",\"bonuses\":\"[\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\",\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"1\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\",\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"2\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\",\\\"{\\\\\\\"bonusId\\\\\\\":\\\\\\\"3\\\\\\\",\\\\\\\"bonusRate\\\\\\\":\\\\\\\"150\\\\\\\"}\\\"]\"}"]
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
 *
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
 * @param unlocked
 * @parent overview
 * @text Is Unlocked
 * @type boolean
 * @desc If this is ON/true, then this panel will be unlocked when a new game is started.
 * @default false
 *
 * @param description
 * @parent overview
 * @type string
 * @text Help Window Text
 * @desc Some text maybe describing the panel.
 * Shows up in the bottom help window.
 * @default Some really cool panel that has lots of hardcore powers.
 *
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
/* eslint-enable */

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

//#region Difficulty
/**
 * A class governing a single difficulty and the way it impacts the game parameters.
 */
class Difficulty
{
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

  /**
   * Whether or not this difficulty is unlocked and available for selection.
   * @type {boolean}
   */
  unlocked = true;

  /**
   * Whether or not this difficulty is hidden from selection.
   * @type {boolean}
   */
  hidden = false;

  /**
   * Gets the b-parameter multiplier for this difficulty.
   * The default is 100.
   * @param {number} paramId The id/index of the parameter.
   * @returns {number}
   */
  bparam(paramId)
  {
    return this.bparams[paramId];
  }

  /**
   * Gets the s-parameter multiplier for this difficulty.
   * The default is 100.
   * @param {number} paramId The id/index of the parameter.
   * @returns {number}
   */
  sparam(paramId)
  {
    return this.sparams[paramId];
  }

  /**
   * Gets the x-parameter multiplier for this difficulty.
   * The default is 100.
   * @param {number} paramId The id/index of the parameter.
   * @returns {number}
   */
  xparam(paramId)
  {
    return this.xparams[paramId];
  }

  /**
   * Determines whether or not this difficulty is unlocked.
   * @returns {boolean}
   */
  isUnlocked()
  {
    return this.unlocked;
  }

  /**
   * Locks this difficulty, making it unavailable for the player to select.
   */
  lock()
  {
    this.unlocked = false;
  }

  /**
   * Unlocks this difficulty, making it available for the player to select.
   */
  unlock()
  {
    this.unlocked = true;
  }

  /**
   * Determines whether or not this difficulty is hidden in the list.
   * @returns {boolean}
   */
  isHidden()
  {
    return this.hidden;
  }

  /**
   * Hides this difficulty, making it no longer listed in the difficulty list.
   */
  hide()
  {
    this.hidden = true;
  }

  /**
   * Unhides this difficulty, making it visible in the dififculty list.
   */
  unhide()
  {
    this.hidden = false;
  }
}
//#endregion Difficulty

//#region DifficultyBuilder
/**
 * The fluent-builder for easily creating new difficulties.
 */
class DifficultyBuilder
{
  #name = String.empty;
  #key = String.empty;
  #description = String.empty;
  #iconIndex = 0;
  #bparams = [100, 100, 100, 100, 100, 100, 100, 100];
  #sparams = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
  #xparams = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
  #exp = 100;
  #gold = 100;
  #sdp = 100;
  #drops = 100;
  #encounters = 100;
  #unlocked = true;

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
   * @returns {Difficulty}
   */
  build()
  {
    const difficulty = new Difficulty();
    difficulty.name = this.#name;
    difficulty.key = this.#key;
    difficulty.description = this.#description;
    difficulty.iconIndex = this.#iconIndex;
    difficulty.bparams = this.#bparams;
    difficulty.sparams = this.#sparams;
    difficulty.xparams = this.#xparams;
    difficulty.exp = this.#exp;
    difficulty.gold = this.#gold;
    difficulty.sdp = this.#sdp;
    difficulty.drops = this.#drops;
    difficulty.encounters = this.#encounters;
    difficulty.unlocked = this.#unlocked;

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

  setBparam(paramId, value)
  {
    this.#bparams[paramId] = value;
    return this;
  }

  setSparam(paramId, value)
  {
    this.#sparams[paramId] = value;
    return this;
  }

  setXparam(paramId, value)
  {
    this.#xparams[paramId] = value;
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
}
//#endregion DifficultyBuilder

//#region Game_Enemy
/**
 * Extends the `.param(paramId)` function to modify by difficulty.
 * @returns {number}
 */
J.DIFF.Aliased.Game_Enemy.set("param", Game_Enemy.prototype.param);
Game_Enemy.prototype.param = function(paramId)
{
  // grab the original value.
  const originalValue = J.DIFF.Aliased.Game_Enemy.get("param").call(this, paramId);

  // grab the currently applied difficulty.
  const appliedDifficulty = $gameSystem.getAppliedDifficulty();

  // determine the multiplier for the parameter according to the difficulty.
  const multiplier = appliedDifficulty.bparams[paramId] / 100;

  // return the rounded product of the multiplier and the original value.
  return Math.round(originalValue * multiplier);
};

/**
 * Extends the `.sparam(paramId)` function to modify by difficulty.
 * @param {number} sparamId The s-parameter id.
 * @returns {number}
 */
J.DIFF.Aliased.Game_Enemy.set("sparam", Game_Enemy.prototype.sparam);
Game_Enemy.prototype.sparam = function(sparamId)
{
  // grab the original value.
  const originalValue = J.DIFF.Aliased.Game_Enemy.get("sparam").call(this, sparamId);

  // grab the currently applied difficulty.
  const appliedDifficulty = $gameSystem.getAppliedDifficulty();

  // determine the multiplier for the parameter according to the difficulty.
  const multiplier = appliedDifficulty.sparams[sparamId] / 100;

  // return the rounded product of the multiplier and the original value.
  return (originalValue * multiplier);
};

/**
 * Extends the `.xparam(paramId)` function to modify by difficulty.
 * @param {number} xparamId The x-parameter id.
 * @returns {number}
 */
J.DIFF.Aliased.Game_Enemy.set("xparam", Game_Enemy.prototype.xparam);
Game_Enemy.prototype.xparam = function(xparamId)
{
  const originalValue = J.DIFF.Aliased.Game_Enemy.get("xparam").call(this, xparamId);

  // grab the currently applied difficulty.
  const appliedDifficulty = $gameSystem.getAppliedDifficulty();

  // determine the multiplier for the parameter according to the difficulty.
  const multiplier = appliedDifficulty.xparams[xparamId] / 100;

  // return the rounded product of the multiplier and the original value.
  return (originalValue * multiplier);
};

/**
 * Extends the `.exp()` function to modify by difficulty.
 * @returns {number}
 */
J.DIFF.Aliased.Game_Enemy.set("exp", Game_Enemy.prototype.exp);
Game_Enemy.prototype.exp = function()
{
  // grab the original value.
  const originalValue = J.DIFF.Aliased.Game_Enemy.get("exp").call(this);

  // grab the currently applied difficulty.
  const appliedDifficulty = $gameSystem.getAppliedDifficulty();

  // determine the multiplier for the bonus according to the difficulty.
  const multiplier = appliedDifficulty.exp / 100;

  // return the rounded product of the multiplier and the original value.
  return Math.round(originalValue * multiplier);
};

/**
 * Extends the `.gold()` function to modify by difficulty.
 * @returns {number}
 */
J.DIFF.Aliased.Game_Enemy.set("gold", Game_Enemy.prototype.gold);
Game_Enemy.prototype.gold = function()
{
  // grab the original value.
  const originalValue = J.DIFF.Aliased.Game_Enemy.get("gold").call(this);

  // grab the currently applied difficulty.
  const appliedDifficulty = $gameSystem.getAppliedDifficulty();

  // determine the multiplier for the bonus according to the difficulty.
  const multiplier = appliedDifficulty.gold / 100;

  // return the rounded product of the multiplier and the original value.
  return Math.round(originalValue * multiplier);
};

// in order to to properly multiply drop rates, we need to use my drops plugin;
// `J-ControlledDrops` gives easy access to modify the drop rates, so we'll extend that!
if (J.DROPS)
{
  /**
   * Extends the `.getBaseDropRate()` function to modify by difficulty.
   * @returns {number}
   */
  J.DIFF.Aliased.Game_Enemy.set("getBaseDropRate", Game_Enemy.prototype.getBaseDropRate);
  Game_Enemy.prototype.getBaseDropRate = function()
  {
    // grab the original value.
    const originalValue = J.DIFF.Aliased.Game_Enemy.get("getBaseDropRate").call(this);

    // grab the currently applied difficulty.
    const appliedDifficulty = $gameSystem.getAppliedDifficulty();

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
  J.DIFF.Aliased.Game_Enemy.set("sdpPoints", Game_Enemy.prototype.sdpPoints);
  Game_Enemy.prototype.sdpPoints = function()
  {
    // grab the original value.
    const originalValue = J.DIFF.Aliased.Game_Enemy.get("sdpPoints").call(this);

    // grab the currently applied difficulty.
    const appliedDifficulty = $gameSystem.getAppliedDifficulty();

    // determine the multiplier for the bonus according to the difficulty.
    const multiplier = appliedDifficulty.sdp / 100;

    // return the rounded product of the multiplier and the original value.
    return Math.round(originalValue * multiplier);
  };
}
//#endregion Game_Enemy

//#region Game_Map
/**
 * Extends the `.encounterStep()` function to modify by difficulty.
 * @returns {number}
 */
J.DIFF.Aliased.Game_Map.set("encounterStep", Game_Map.prototype.encounterStep);
Game_Map.prototype.encounterStep = function()
{
  // grab the original value.
  const originalValue = J.DIFF.Aliased.Game_Map.get("encounterStep").call(this);

  // grab the currently applied difficulty.
  const appliedDifficulty = $gameSystem.getAppliedDifficulty();

  // determine the multiplier for the bonus according to the difficulty.
  const multiplier = appliedDifficulty.encounters / 100;

  // return the rounded product of the multiplier and the original value.
  return Math.round(originalValue * multiplier);
};
//#endregion Game_Map

//#region Game_System
/**
 * Extends the `.initialize()` with our difficulty initialization.
 */
J.DIFF.Aliased.Game_System.set('initialize', Game_System.prototype.initialize);
Game_System.prototype.initialize = function()
{
  J.DIFF.Aliased.Game_System.get('initialize').call(this);
  this.initDifficultyMembers();
};

/**
 * Initializes the Difficulty System.
 */
Game_System.prototype.initDifficultyMembers = function()
{
  this._j ||= {};
  this._j._difficulty ||= {};
  this._j._difficulty.allDifficulties = J.DIFF.Metadata.Difficulties;
  this._j._difficulty.appliedDifficulty ||= this.findDifficultyByKey(J.DIFF.Metadata.DefaultDifficulty);
};

/**
 * Gets all difficulties defined, including locked difficulties.
 * @returns {Difficulty[]}
 */
Game_System.prototype.allDifficulties = function()
{
  return this._j._difficulty.allDifficulties;
};

/**
 * Gets all unlocked and available difficulties.
 * @returns {Difficulty[]}
 */
Game_System.prototype.availableDifficulties = function()
{
  return this.allDifficulties().filter(difficulty => difficulty.unlocked);
};

/**
 * Gets the currently applied difficulty.
 * @returns {Difficulty}
 */
Game_System.prototype.getAppliedDifficulty = function()
{
  return this._j._difficulty.appliedDifficulty;
};

/**
 * Sets the applied difficulty to a new one.
 * @param {Difficulty} difficulty The new difficulty being applied.
 */
Game_System.prototype.setAppliedDifficulty = function(difficulty)
{
  this._j._difficulty.appliedDifficulty = difficulty;
};

/**
 * Finds the difficulty that matches the key provided.
 * Returns null if no difficulty matching the key is found.
 * @param {string} difficultyKey The key to find the difficulty of.
 * @returns {Difficulty|null} The difficulty if found, null otherwise.
 */
Game_System.prototype.findDifficultyByKey = function(difficultyKey)
{
  const foundDifficulty = this.allDifficulties().find(difficulty => difficulty.key === difficultyKey);
  if (foundDifficulty)
  {
    return foundDifficulty;
  }
  else
  {
    console.warn(`could not find difficulty with key: [${difficultyKey}].`);
    return null;
  }
};

Game_System.prototype.lockDifficulty = function(difficultyKey)
{
  const foundDifficulty = this.findDifficultyByKey(difficultyKey);
  if (foundDifficulty)
  {
    foundDifficulty.lock();
  }
  else
  {
    console.warn(`could not lock difficulty with key: [${difficultyKey}].`);
  }
};

Game_System.prototype.unlockDifficulty = function(difficultyKey)
{
  const foundDifficulty = this.findDifficultyByKey(difficultyKey);
  if (foundDifficulty)
  {
    foundDifficulty.unlock();
  }
  else
  {
    console.warn(`could not unlock difficulty with key: [${difficultyKey}].`);
  }
};

Game_System.prototype.hideDifficulty = function(difficultyKey)
{
  const foundDifficulty = this.findDifficultyByKey(difficultyKey);
  if (foundDifficulty)
  {
    foundDifficulty.hide();
  }
  else
  {
    console.warn(`could not lock difficulty with key: [${difficultyKey}].`);
  }
};

Game_System.prototype.unhideDifficulty = function(difficultyKey)
{
  const foundDifficulty = this.findDifficultyByKey(difficultyKey);
  if (foundDifficulty)
  {
    foundDifficulty.unhide();
  }
  else
  {
    console.warn(`could not unlock difficulty with key: [${difficultyKey}].`);
  }
};
//#endregion Game_System

//#region Scene_Difficulty
/**
 * The difficulty scene for managing the current difficulty.
 */
class Scene_Difficulty extends Scene_MenuBase
{
  constructor()
  {
    super();
    this.initialize();
  }

  /**
   * The entry point of this scene.
   */
  initialize()
  {
    super.initialize(this);
    this.initMembers();
  }

  /**
   * Initializes all properties for this scene.
   */
  initMembers()
  {
    this._j = {
      /**
       * The help window of the current action.
       * @type {Window_Help}
       */
      _difficultyHelpWindow: null,

      /**
       * The list of SDPs available.
       * @type {Window_DifficultyList}
       */
      _difficultyListWindow: null,

      /**
       * The details of a given SDP.
       * @type {Window_DifficultyDetails}
       */
      _difficultyDetailsWindow: null,
    };
  }

  /**
   * Extends `.create()` to include our window creation.
   */
  create()
  {
    super.create();
    this.createAllWindows();
  }

  /**
   * Extends `.start()` to include our post-window setup.
   */
  start()
  {
    super.start();
    const appliedDifficulty = $gameSystem.getAppliedDifficulty();

    // select the current difficulty if it is in the list and not locked.
    this._j._difficultyListWindow.selectExt(appliedDifficulty);
  }

  /**
   * Creates all windows associated with the difficulty scene.
   */
  createAllWindows()
  {
    this.createHelpWindow();
    this.createListWindow();
    this.createDetailsWindow();
  }

  /**
   * Creates the help window that provides contextual details to the player
   * about the difficulty difference between the selected and current.
   */
  createHelpWindow()
  {
    const width = Graphics.boxWidth;
    const height = 100;
    const x = 0;
    const y = 0;
    const rect = new Rectangle(x, y, width, height);
    this._j._difficultyHelpWindow = new Window_Help(rect);
    this.addWindow(this._j._difficultyHelpWindow);
  }

  /**
   * Creates the list of difficulties available to the player.
   */
  createListWindow()
  {
    const width = 400;
    const height = Graphics.boxHeight - this._j._difficultyHelpWindow.height;
    const x = 0;
    const y = this._j._difficultyHelpWindow.height;
    const rect = new Rectangle(x, y, width, height);
    this._j._difficultyListWindow = new Window_DifficultyList(rect);
    this._j._difficultyListWindow.setHandler('cancel', this.popScene.bind(this));
    this._j._difficultyListWindow.setHandler('ok', this.onSelectDifficulty.bind(this));
    this._j._difficultyListWindow.onIndexChange = this.onHoverChange.bind(this);
    this.addWindow(this._j._difficultyListWindow);
  }

  /**
   * Creates the details window that describes the selected difficulty
   * compared to the current difficulty.
   */
  createDetailsWindow()
  {
    const width = Graphics.boxWidth - this._j._difficultyListWindow.width;
    const height = Graphics.boxHeight - this._j._difficultyHelpWindow.height;
    const x = this._j._difficultyListWindow.width;
    const y = this._j._difficultyHelpWindow.height;
    const rect = new Rectangle(x, y, width, height);
    this._j._difficultyDetailsWindow = new Window_DifficultyDetails(rect);
    this.addWindow(this._j._difficultyDetailsWindow);
  }

  onHoverChange()
  {
    const hoveredDifficulty = this._j._difficultyListWindow.currentExt();
    this._j._difficultyDetailsWindow.setHoveredDifficulty(hoveredDifficulty);
    this._j._difficultyHelpWindow.setText(hoveredDifficulty.description);
  }

  /**
   * Runs when the user chooses one of the items in the difficulty list.
   */
  onSelectDifficulty()
  {
    $gameSystem.setAppliedDifficulty(this.hoveredDifficulty());
    this.refreshDifficultyWindows();
    this._j._difficultyListWindow.activate();
  }

  /**
   * Gets the difficulty being hovered over in the difficulty list.
   * @returns {Difficulty}
   */
  hoveredDifficulty()
  {
    return this._j._difficultyListWindow.hoveredDifficulty();
  }

  refreshDifficultyWindows()
  {
    this._j._difficultyListWindow.refresh();
    this._j._difficultyDetailsWindow.refresh();
    this._j._difficultyHelpWindow.refresh();
  }

  /**
   * Runs once per frame to update all things in this scene.
   */
  update()
  {
    super.update();
    this.updateDetailWindow();
  }

  updateDetailWindow()
  {
    this._j._difficultyDetailsWindow.setHoveredDifficulty(this.hoveredDifficulty());
  }
}
//#endregion Scene_Difficulty

//#region Window_DifficultyDetails
class Window_DifficultyDetails extends Window_Base
{
  /**
   * @constructor
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
    this.initMembers();
    this.refresh();
  }

  static ComparisonTypes = {
    SAME: "same",
    EASIER: "easier",
    HARDER: "harder",
  };

  /**
   * Initializes all members of this window.
   */
  initMembers()
  {
    /**
     * The difficulty being hovered over from the list.
     * @type {Difficulty}
     */
    this.hoveredDifficulty = null;
  }

  /**
   * Refreshes this window and all its content.
   */
  refresh()
  {
    // don't refresh if there is no difficulty to refresh the contents of.
    if (!this.hoveredDifficulty) return;

    this.contents.clear();
    this.drawDifficultyInfo();
  }

  /**
   * Gets the difficulty currently applied to the player.
   * @returns {Difficulty}
   */
  getAppliedDifficulty()
  {
    return $gameSystem.getAppliedDifficulty();
  }

  /**
   * Gets the difficulty currently being hovered over in the list.
   * @returns {Difficulty}
   */
  getHoveredDifficulty()
  {
    return this.hoveredDifficulty;
  }

  /**
   * Sets the hovered difficulty.
   * @param {Difficulty} difficulty The new hovered difficulty.
   */
  setHoveredDifficulty(difficulty)
  {
    if (this.hoveredDifficulty !== difficulty)
    {
      this.hoveredDifficulty = difficulty;
      this.refresh();
    }
  }

  /**
   * Draws the information of the compared difficulties.
   */
  drawDifficultyInfo()
  {
    if (this.getAppliedDifficulty())
    {
      this.drawComparedDifficulties();
    }
  }

  /**
   * Draws the comparison between two difficulties, the one applied and the one being hovered
   * over by the cursor in the list.
   */
  drawComparedDifficulties()
  {
    // remove any residual formatting.
    this.resetFontSettings();

    // get the difficulties.
    const appliedDifficulty = this.getAppliedDifficulty();
    const hoveredDifficulty = this.getHoveredDifficulty();

    // draw the names.
    this.drawComparedDifficultyNames(0, 0, 600, appliedDifficulty, hoveredDifficulty);

    // establish some baselines for coordinates.
    const lh = this.lineHeight();
    const ox = 0;
    const oy = lh * 3;
    const bonusesOy = lh * 14;

    // draw all parameters.
    this.drawBParams(ox+40, oy, appliedDifficulty, hoveredDifficulty);
    this.drawSParams(ox+400, oy, appliedDifficulty, hoveredDifficulty);
    this.drawXParams(ox+800, oy, appliedDifficulty, hoveredDifficulty);

    // draw all bonus difficulty modifiers.
    this.drawDifficultyBonuses(ox+40, bonusesOy, appliedDifficulty, hoveredDifficulty);
  }

  /**
   * Draws the names of the two difficulties being compared.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {Difficulty} appliedDifficulty The currently applied difficulty.
   * @param {Difficulty} hoveredDifficulty The potential/hovered difficulty.
   */
  drawComparedDifficultyNames(x, y, w, appliedDifficulty, hoveredDifficulty)
  {
    const lh = this.lineHeight();
    const modifiedX = x + 100;

    const currentY = lh * 0;
    this.drawText("Current:", x, currentY, w, "left");
    this.drawComparedDifficultyName(modifiedX, currentY, w, appliedDifficulty.iconIndex, appliedDifficulty.name);

    //this.drawText("→", x+150, y, w, "left");

    const hoveredY = lh * 1;
    this.drawText("Hovered:", x, hoveredY, w, "left");
    this.drawComparedDifficultyName(modifiedX, hoveredY, w, hoveredDifficulty.iconIndex, hoveredDifficulty.name);
  }

  /**
   * Draws the difficulty name at the designated location with its icon.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {number} iconIndex The index of the icon for the difficulty.
   * @param {string} difficultyName The name for the difficulty.
   */
  drawComparedDifficultyName(x, y, w, iconIndex, difficultyName)
  {
    this.drawIcon(iconIndex, x, y);
    this.drawText(`${difficultyName}`, x+32, y, w, "left");
  }

  /**
   * Draws all the b-parameters.
   * @param {number} x The x coordinate.
   * @param {number} oy The origin y coordinate.
   * @param {Difficulty} appliedDifficulty The applied difficulty.
   * @param {Difficulty} hoveredDifficulty The hovered/potential difficulty.
   */
  drawBParams(x, oy, appliedDifficulty, hoveredDifficulty = null)
  {
    const lh = this.lineHeight();
    const {bparams} = appliedDifficulty;
    const hoveredBparams = hoveredDifficulty.bparams ?? [];
    bparams.forEach((bparam, index) =>
    {
      // determine the x:y for the applied rate.
      const paramY = (index * lh) + oy;
      const parameterWidth = 120;

      // get the icon index.
      const paramIconIndex = IconManager.param(index);

      // get the current param rate we're drawing.
      const appliedParamRate = bparam;

      // get the param name.
      const paramName = TextManager.param(index);

      // get the potential param rate to draw.
      const hoveredParamRate = hoveredBparams[index] ?? bparam;

      // determine if bigger is better for this parameter.
      const biggerIsBetter = this.biggerIsBetterBParameters(index);

      this.drawComparedParameters(
        x,
        paramY,
        parameterWidth,
        paramIconIndex,
        paramName,
        appliedParamRate,
        hoveredParamRate,
        biggerIsBetter);
    });
  }

  /**
   * Draws all the s-parameters.
   * @param {number} x The x coordinate.
   * @param {number} oy The origin y coordinate.
   * @param {Difficulty} appliedDifficulty The applied difficulty.
   * @param {Difficulty} hoveredDifficulty The hovered/potential difficulty.
   */
  drawSParams(x, oy, appliedDifficulty, hoveredDifficulty = null)
  {
    const lh = this.lineHeight();
    const {sparams} = appliedDifficulty;
    const hoveredSparams = hoveredDifficulty.sparams ?? [];
    sparams.forEach((sparam, index) =>
    {
      // determine the x:y for the rate.
      const paramY = (index * lh) + oy;
      const parameterWidth = 120;

      // get the icon index.
      const paramIconIndex = IconManager.sparam(index);

      // get the param name.
      const paramName = TextManager.sparam(index);

      // get the current xparam rate we're drawing.
      const appliedParamRate = sparam;

      // get the potential xparam rate to draw.
      const hoveredParamRate = hoveredSparams[index] ?? sparam;

      // determine if bigger is better for this parameter.
      const biggerIsBetter = this.biggerIsBetterSParameters(index);

      this.drawComparedParameters(
        x,
        paramY,
        parameterWidth,
        paramIconIndex,
        paramName,
        appliedParamRate,
        hoveredParamRate,
        biggerIsBetter);
    });
  }

  /**
   * Draws all the x-parameters.
   * @param {number} x The x coordinate.
   * @param {number} oy The origin y coordinate.
   * @param {Difficulty} appliedDifficulty The applied difficulty.
   * @param {Difficulty} hoveredDifficulty The hovered/potential difficulty.
   */
  drawXParams(x, oy, appliedDifficulty, hoveredDifficulty = null)
  {
    const lh = this.lineHeight();
    const {xparams} = appliedDifficulty;
    const hoveredXparams = hoveredDifficulty.xparams ?? [];
    xparams.forEach((xparam, index) =>
    {
      // determine the x:y for the rate.
      const paramY = (index * lh) + oy;
      const parameterWidth = 120;

      // get the icon index.
      const paramIconIndex = IconManager.xparam(index);

      // get the param name.
      const paramName = TextManager.xparam(index);

      // get the current param rate we're drawing.
      const appliedParamRate = xparam;

      // get the potential param rate to draw.
      const hoveredParamRate = hoveredXparams[index] ?? xparam;

      // determine if bigger is better for this parameter.
      const biggerIsBetter = this.biggerIsBetterXParameters(index);

      this.drawComparedParameters(
        x,
        paramY,
        parameterWidth,
        paramIconIndex,
        paramName,
        appliedParamRate,
        hoveredParamRate,
        biggerIsBetter);
    });
  }

  /**
   * Draws all difficulty bonuses.
   * @param {number} x The x coordinate.
   * @param {number} oy The origin y coordinate.
   * @param {Difficulty} appliedDifficulty The applied difficulty.
   * @param {Difficulty} hoveredDifficulty The hovered/potential difficulty.
   */
  drawDifficultyBonuses(x, oy, appliedDifficulty, hoveredDifficulty = null)
  {
    const lh = this.lineHeight();
    const w = 120;

    const expRateY = oy + (lh * 0);
    this.drawDifficultyBonusExperience(x, expRateY, w, appliedDifficulty, hoveredDifficulty);

    const goldRateY = oy + (lh * 1);
    this.drawDifficultyBonusGold(x, goldRateY, w, appliedDifficulty, hoveredDifficulty);

    const sdpRateY = oy + (lh * 2);
    this.drawDifficultyBonusSdp(x, sdpRateY, w, appliedDifficulty, hoveredDifficulty);

    const dropsRateY = oy + (lh * 3);
    this.drawDifficultyBonusDrops(x, dropsRateY, w, appliedDifficulty, hoveredDifficulty);

    const encountersRateY = oy + (lh * 4);
    this.drawDifficultyBonusEncounters(x, encountersRateY, w, appliedDifficulty, hoveredDifficulty);
  }

  /**
   * Draws the bonus data for experience earned by the player.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {Difficulty} appliedDifficulty The currently applied difficulty.
   * @param {Difficulty} hoveredDifficulty The potential/hovered difficulty.
   */
  drawDifficultyBonusExperience(x, y, w, appliedDifficulty, hoveredDifficulty)
  {
    const rateIconIndex = 87;
    const rateName = "EXP RATE";
    const appliedRate = appliedDifficulty.exp;
    const hoveredRate = hoveredDifficulty.exp ?? appliedRate;
    this.drawComparedParameters(x, y, w, rateIconIndex, rateName, appliedRate, hoveredRate, true);
  }

  /**
   * Draws the bonus data for gold found by the player.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {Difficulty} appliedDifficulty The currently applied difficulty.
   * @param {Difficulty} hoveredDifficulty The potential/hovered difficulty.
   */
  drawDifficultyBonusGold(x, y, w, appliedDifficulty, hoveredDifficulty)
  {
    const rateIconIndex = 2048;
    const rateName = "GOLD RATE";
    const appliedRate = appliedDifficulty.gold;
    const hoveredRate = hoveredDifficulty.gold ?? appliedRate;
    this.drawComparedParameters(x, y, w, rateIconIndex, rateName, appliedRate, hoveredRate, true);
  }

  /**
   * Draws the bonus data for sdp acquired by the player.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {Difficulty} appliedDifficulty The currently applied difficulty.
   * @param {Difficulty} hoveredDifficulty The potential/hovered difficulty.
   */
  drawDifficultyBonusSdp(x, y, w, appliedDifficulty, hoveredDifficulty)
  {
    const rateIconIndex = 445;
    const rateName = "SDP RATE";
    const appliedRate = appliedDifficulty.sdp;
    const hoveredRate = hoveredDifficulty.sdp ?? appliedRate;
    this.drawComparedParameters(x, y, w, rateIconIndex, rateName, appliedRate, hoveredRate, true);
  }

  /**
   * Draws the bonus data for drop rates gained by the player.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {Difficulty} appliedDifficulty The currently applied difficulty.
   * @param {Difficulty} hoveredDifficulty The potential/hovered difficulty.
   */
  drawDifficultyBonusDrops(x, y, w, appliedDifficulty, hoveredDifficulty)
  {
    const rateIconIndex = 208;
    const rateName = "DROP RATE";
    const appliedRate = appliedDifficulty.drops;
    const hoveredRate = hoveredDifficulty.drops ?? appliedRate;
    this.drawComparedParameters(x, y, w, rateIconIndex, rateName, appliedRate, hoveredRate, true);
  }

  /**
   * Draws the bonus data for encountering enemies by the player.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {Difficulty} appliedDifficulty The currently applied difficulty.
   * @param {Difficulty} hoveredDifficulty The potential/hovered difficulty.
   */
  drawDifficultyBonusEncounters(x, y, w, appliedDifficulty, hoveredDifficulty)
  {
    const rateIconIndex = 914;
    const rateName = "ENCOUNTER RATE";
    const appliedRate = appliedDifficulty.encounters;
    const hoveredRate = hoveredDifficulty.encounters ?? appliedRate;
    this.drawComparedParameters(x, y, w, rateIconIndex, rateName, appliedRate, hoveredRate, true);
  }

  /**
   * Draws a pair of two compared parameters at the designated coordinates.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {number} paramIconIndex The icon index for the parameter.
   * @param {string} paramName The name of this parameter.
   * @param {number} appliedParameter The applied parameter- on the left.
   * @param {number} hoveredParameter The hovered/potential parameter- on the right.
   * @param {boolean} biggerIsBetter Whether or not bigger is better.
   */
  drawComparedParameters(x, y, w, paramIconIndex, paramName, appliedParameter, hoveredParameter, biggerIsBetter)
  {
    // draw the icon.
    this.drawComparedIcon(x, y, paramIconIndex);

    // draw the param name.
    this.drawComparedParamName(x, y, w, paramName);

    // draw the applied parameter- on the left.
    this.drawComparedAppliedParameter(x+150, y, w, appliedParameter);

    // draw the symbol representing the change- in the center.
    this.drawComparisonSymbol(x+150, y, w, appliedParameter, hoveredParameter, biggerIsBetter);

    // draw the hovered parameter- on the right.
    this.drawComparedHoveredParameter(x+150, y, w, appliedParameter, hoveredParameter, biggerIsBetter);
  }

  /**
   * Draws the icon for the parameter.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} paramIconIndex The icon index for the parameter.
   */
  drawComparedIcon(x, y, paramIconIndex)
  {
    // draw the icon first.
    this.drawIcon(paramIconIndex, x-40, y);
  }

  /**
   * Draws the name for the parameter.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {string} paramName The name of this parameter.
   */
  drawComparedParamName(x, y, w, paramName)
  {
    this.drawText(paramName, x, y, w, "left");
  }

  /**
   * Draws the currently applied parameter value.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {number} appliedParameter The value of the currently applied parameter.
   */
  drawComparedAppliedParameter(x, y, w, appliedParameter)
  {
    // reset font for this text.
    this.resetFontSettings();

    // draw the currently applied rate.
    this.drawText(`${appliedParameter}`, x, y, w, "left");

    // cleanup font settings.
    this.resetFontSettings();
  }

  /**
   * Draws the comparison symbol for two compared parameters.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {number} appliedParameter The applied parameter- on the left.
   * @param {number} hoveredParameter The hovered/potential parameter- on the right.
   * @param {boolean} biggerIsBetter Whether or not bigger is better.
   */
  drawComparisonSymbol(x, y, w, appliedParameter, hoveredParameter, biggerIsBetter)
  {
    // reset font for this text.
    this.resetFontSettings();

    // draw the symbol representing the change.
    const comparisonSymbol = this.getComparisonSymbol(biggerIsBetter, appliedParameter, hoveredParameter);
    this.drawText(`${comparisonSymbol}`, x, y, w, "center");

    // cleanup font settings.
    this.resetFontSettings();
  }

  /**
   * Draws the hovered/potential parameter on the left.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} w The width of the text.
   * @param {number} appliedParameter The applied parameter- on the left.
   * @param {number} hoveredParameter The hovered/potential parameter- on the right.
   * @param {boolean} biggerIsBetter Whether or not bigger is better.
   */
  drawComparedHoveredParameter(x, y, w, appliedParameter, hoveredParameter, biggerIsBetter)
  {
    // swap the color to indicate at-a-glance the impact of this difficulty change.
    const hoveredColor = this.getComparedColor(biggerIsBetter, appliedParameter, hoveredParameter);
    this.changeTextColor(hoveredColor);

    // draw the currently hovered rate.
    this.drawText(`${hoveredParameter}`, x, y, w, "right");

    // cleanup font settings.
    this.resetFontSettings();
  }

  /**
   * Gets the symbol displayed between two compared parameters to indicate whether there is no
   * change, the change makes it easier, or the change makes it harder.
   * @param {boolean} biggerIsBetter Whether or not a bigger parameter is better.
   * @param {number} appliedParameter The currently applied parameter.
   * @param {number} targetParameter The potential parameter to change to.
   * @returns {string} A single character representing this change; could also just be a string.
   */
  getComparisonSymbol(biggerIsBetter, appliedParameter, targetParameter)
  {
    return "→";

    // TODO: maybe implement this someday.
    // const comparison = this.determineComparisonType(biggerIsBetter, appliedParameter, targetParameter);
    // switch (comparison)
    // {
    //   case Window_DifficultyDetails.ComparisonTypes.SAME:
    //     return '=';
    //   case Window_DifficultyDetails.ComparisonTypes.EASIER:
    //     return '😀';
    //   case Window_DifficultyDetails.ComparisonTypes.HARDER:
    //     return '😡';
    // }
  }

  /**
   * Gets the text color for the compared/hovered parameter value.
   * @param {boolean} biggerIsBetter Whether or not a bigger parameter is better.
   * @param {number} appliedParameter The currently applied parameter.
   * @param {number} targetParameter The potential parameter to change to.
   * @returns {string} The color string.
   */
  getComparedColor(biggerIsBetter, appliedParameter, targetParameter)
  {
    const comparison = this.determineComparisonType(biggerIsBetter, appliedParameter, targetParameter);
    switch (comparison)
    {
      case Window_DifficultyDetails.ComparisonTypes.SAME:
        return ColorManager.normalColor();
      case Window_DifficultyDetails.ComparisonTypes.EASIER:
        return "rgba(0, 192, 0, 0.8)";
      case Window_DifficultyDetails.ComparisonTypes.HARDER:
        return "rgba(192, 0, 0, 0.8)";
    }
  }

  /**
   * Determines whether or not one parameter is "better" than the other.
   * Contextually, this determines whether or not it would become easier for the player if said
   * parameter was changed to the next parameter. In most cases, reducing a parameter would make it
   * easier, so the boolean is typically set to false- but not always.
   * @param {boolean} biggerIsBetter Whether or not a bigger parameter is better.
   * @param {number} appliedParameter The currently applied parameter.
   * @param {number} targetParameter The potential parameter to change to.
   * @returns {Window_DifficultyDetails.ComparisonTypes} One of "SAME", "EASIER", or "HARDER".
   */
  determineComparisonType(biggerIsBetter, appliedParameter, targetParameter)
  {
    const isSame = (appliedParameter === targetParameter);
    const targetParameterBigger = (appliedParameter < targetParameter);
    const isImprovement = (biggerIsBetter === targetParameterBigger);
    if (isSame)
    {
      return Window_DifficultyDetails.ComparisonTypes.SAME;
    }
    else if (isImprovement)
    {
      // the hovered parameter is changed color to indicate it will become easier.
      return Window_DifficultyDetails.ComparisonTypes.EASIER;
    }
    else if (!isImprovement)
    {
      // the hovered parameter is changed color to indicate it will become harder.
      return Window_DifficultyDetails.ComparisonTypes.HARDER;
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

    return biggerIsBetterBParameters[bparamId] ?? false;
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
}
//#endregion Window_DifficultyDetails

//#region Window_DifficultyList
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
   * OVERWRITE Creates the command list for this window.
   */
  makeCommandList()
  {
    // grab all the difficulties available.
    const difficulties = $gameSystem.availableDifficulties();

    // if there are none, then do not try to render items.
    if (!difficulties.length) return;

    // add all difficulties to the list.
    difficulties.forEach(difficulty =>
    {
      // don't render the difficulty in the list if it is hidden.
      if (difficulty.isHidden()) return;

      this.addCommand(
        difficulty.name,
        difficulty.key,
        difficulty.unlocked,  // enabled when unlocked.
        difficulty,
        difficulty.iconIndex);
    }, this);
  }

  /**
   * Gets the difficulty being hovered over in this list.
   * @returns {Difficulty}
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
//#endregion Window_DifficultyList