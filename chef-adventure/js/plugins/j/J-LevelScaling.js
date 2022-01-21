//#region initialization
/*:
 * @target MZ
 * @plugindesc
 * [v1.0 LEVEL] Scales damage and exp/gold from defeated enemies.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-BASE
 * @orderAfter J-BASE
 * @help
 * ============================================================================
 * This plugin scales various data points based on the difference between the
 * actor and enemy's levels.
 * ============================================================================
 * ENEMY LEVELS:
 * Have you ever wanted an enemy battler to have levels? Not the kind that make
 * their stats go up as they level up, but just an arbitrary number for other
 * uses, such as damage or exp or gold scaling? Well now you can! By applying
 * the appropriate tag to the enemies in question, you can give enemies a
 * chance to have levels just like you!
 *
 * NOTE 1:
 * You only need to apply the tag to enemies that you want to be affected by
 * the scaling. If you omit the tag on an enemy, all scaling multipliers will
 * be 1x, aka the default values.

 *
 * TAG USAGE:
 * - Enemies only.
 *
 * TAG FORMAT:
 *  <level:NUM> or <lv:NUM> or <lvl:NUM>
 * Where NUM is the level being assigned to the enemy.
 *
 * TAG EXAMPLES:
 *  <level:4> or <lv:4> or <lvl:4>
 * The enemy is now level 4.
 * ============================================================================
 * @param useScaling
 * @type boolean
 * @text Start Enabled
 * @desc Whether or not this scaling functionality is enabled by default.
 * @on Enabled By Default
 * @off Disabled By Default
 * @default true
 *
 * @param minMultiplier
 * @type number
 * @decimals 2
 * @text Minimum Multiplier
 * @desc The minimum amount the scaling multiplier can calculate to be.
 * @default 0.10
 *
 * @param maxMultiplier
 * @type number
 * @decimals 2
 * @text Maximum Multiplier
 * @desc The maximum amount the scaling multiplier can be calculate to be.
 * @default 2.00
 *
 * @param growthMultiplier
 * @type number
 * @decimals 2
 * @text Growth Multiplier
 * @desc The amount of growth per level of difference.
 * @default 0.10
 *
 * @param invariantUpperRange
 * @type number
 * @text Upper Invariance
 * @desc The amount of level difference over 0 before scaling takes effect.
 * @default 1
 *
 * @param invariantLowerRange
 * @type number
 * @text Lower Invariance
 * @desc The amount of level difference under 0 before scaling takes effect.
 * @default 1
 *
 * @param variableActorBalancer
 * @type variable
 * @text Actor Balancer
 * @desc The variable id to act as a constant level modifier in favor of actors.
 * @default 141
 *
 * @param variableEnemyBalancer
 * @type variable
 * @text Enemy Balancer
 * @desc The variable id to act as a constant level modifier in favor of enemies.
 * @default 142
 *
 *
 * @command enableScaling
 * @text Enable Scaling
 * @desc Enables the scaling functionality for damage/rewards.
 * 
 * @command disableScaling
 * @text Disable Scaling
 * @desc Disables the scaling functionality for damage/rewards.
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//#region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '1.0.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//#endregion version check

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.LEVEL = {};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.LEVEL.PluginParameters = PluginManager.parameters(`J-LevelScaling`);

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.LEVEL.Metadata = {};
J.LEVEL.Metadata.Version = '1.0.0';

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

//#region Plugin Command Registration
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
//#endregion Plugin Command Registration
//#endregion initialization

//#region Game_Action
/**
 * Scales damaged dealt and received to be based on level differences.
 */
J.LEVEL.Aliased.Game_Action.set('makeDamageValue', Game_Action.prototype.makeDamageValue);
Game_Action.prototype.makeDamageValue = function(target, critical)
{
  // get the base damage that would've been done.
  const baseDamage = J.LEVEL.Aliased.Game_Action.get('makeDamageValue').call(this, target, critical);

  // get the multiplier based on target and user levels.
  const multiplier = LevelScaling.multiplier(target.level, this.subject().level);

  // return the product of these two values.
  return (baseDamage * multiplier);
}
//#endregion Game_Action

//#region Game_Actor
/**
 * The base or default level for this battler.
 * Actors have a level tracker, so we'll use that for the base.
 * @returns {number}
 */
Game_Actor.prototype.getBattlerBaseLevel = function()
{
  return this._level;
};

/**
 * Gets all database sources we can get levels from.
 * @returns {RPG_BaseItem[]}
 */
Game_Actor.prototype.getLevelSources = function()
{
  // our sources of data that a level can be retrieved from.
  return this.getEverythingWithNotes();
};

/**
 * The variable level modifier for this actor.
 * @returns {number}
 */
Game_Actor.prototype.getLevelBalancer = function()
{
  // check if we have a variable set for the fixed balancing.
  if (J.LEVEL.Metadata.ActorBalanceVariable)
  {
    // return the adjustment from the variable value instead.
    return $gameVariables.value(J.LEVEL.Metadata.ActorBalanceVariable);
  }

  // we don't have any balancing required.
  return 0;
};
//#endregion Game_Actor

//#region Game_Battler
/**
 * Generates the "level" property for all battlers, along with
 * a new function to calculate level retrieval.
 * @returns {number}
 */
Object.defineProperty(
  Game_Battler.prototype,
  "level",
  {
    get()
    {
      // get the level from this battler.
      return this.getLevel();
    },

    // sure, lets make this level property configurable.
    configurable: true,
  });

/**
 * Gets the level for this battler.
 * @returns {number}
 */
Game_Battler.prototype.getLevel = function()
{
  // grab all sources that a level can come from.
  const sources = this.getLevelSources();

  // get the default level for this battler.
  let level = this.getBattlerBaseLevel();

  // get the level balancer for this battler if available.
  level += this.getLevelBalancer();

  // iterate over each of the source database datas.
  sources.forEach(rpgData =>
  {
    // add the level extracted from the data.
    level += this.extractLevel(rpgData);
  });

  // return the new amount.
  return level;
};

/**
 * Gets all database sources we can get levels from.
 * @returns {RPG_BaseItem[]}
 */
Game_Battler.prototype.getLevelSources = function()
{
  // our sources of data that a level can be retrieved from.
  return [];
};

/**
 * The base or default level for this battler.
 * @returns {number}
 */
Game_Battler.prototype.getBattlerBaseLevel = function()
{
  return 0;
};

/**
 * The variable level modifier for this battler.
 * @returns {number}
 */
Game_Battler.prototype.getLevelBalancer = function()
{
  return 0;
};

/**
 * Extracts the level from a given source's note data.
 * @param {RPG_BaseItem} rpgData The database object to extract level from.
 */
Game_Battler.prototype.extractLevel = function(rpgData)
{
  // extract the level from the notes.
  return rpgData.getNumberFromNotesByRegex(J.LEVEL.RegExp.BattlerLevel);
};
//#endregion Game_Battler

//#region Game_Enemy
/**
 * Gets all database sources we can get levels from.
 * @returns {RPG_BaseItem[]}
 */
Game_Enemy.prototype.getLevelSources = function()
{
  // our sources of data that a level can be retrieved from.
  return [
    this.enemy(),     // this enemy is a source.
    ...this.states(), // all states applied to this enemy are sources.
  ];
};

/**
 * The base or default level for this battler.
 * Enemies do not have a base level.
 * @returns {number}
 */
Game_Enemy.prototype.getBattlerBaseLevel = function()
{
  return 0;
};

/**
 * The variable level modifier for this enemy.
 * @returns {number}
 */
Game_Enemy.prototype.getLevelBalancer = function()
{
  // check if we have a variable set for the fixed balancing.
  if (J.LEVEL.Metadata.EnemyBalanceVariable)
  {
    // return the adjustment from the variable value instead.
    return $gameVariables.value(J.LEVEL.Metadata.EnemyBalanceVariable);
  }

  // we don't have any balancing required.
  return 0;
};
//#endregion Game_Enemy

//#region Game_Troop
/**
 * Upon defeating a troop of enemies, scales the earned experience based on
 * average actor level vs each of the enemies.
 */
J.LEVEL.Aliased.Game_Troop.set('expTotal', Game_Troop.prototype.expTotal);
Game_Troop.prototype.expTotal = function()
{
  // check if the level scaling functionality is enabled.
  if (J.LEVEL.Metadata.Enabled)
  {
    // return the scaled result instead.
    return this.getScaledExpResult();
  }
  // the scaling is not enabled.
  else
  {
    // return the default logic instead.
    return J.LEVEL.Aliased.Game_Troop.get('expTotal').call(this);
  }
};

/**
 * Determines the amount of experience gained based on the average battle party compared to
 * each defeated enemy.
 *
 * This method is used in place of the current `.reduce()` to find total experience.
 * @returns {number} The scaled amount of EXP this enemy troop yielded.
 */
Game_Troop.prototype.getScaledExpResult = function()
{
  // grab all the dead enemies of this troop.
  const deadEnemies = this.deadMembers();

  // calculate the average actor level of the party.
  const averageActorLevel = $gameParty.averageActorLevel();

  // the reducer function for adding up experience.
  const reducer = (accumulativeExpTotal, currentEnemy) =>
  {
    // determine the experience factor for this defeated enemy level vs the average party level.
    const expFactor = LevelScaling.multiplier(averageActorLevel, currentEnemy.level);

    // multiply the factor against the experience amount to get the actual amount.
    const total = Math.round(expFactor * currentEnemy.exp());

    // add it to the running total.
    return (accumulativeExpTotal + total);
  };

  // return the rounded sum of scaled experience.
  return Math.round(deadEnemies.reduce(reducer, 0));
};
//#endregion Game_Troop

//#region Game_Party
/**
 * Checks the current battle party and averages all levels.
 * @returns {number} The average battle party level (rounded).
 */
Game_Party.prototype.averageActorLevel = function()
{
  // grab all allies.
  const allies = this.battleMembers();

  // if we have no party, then the average is 0.
  if (!allies.length) return 0;

  // the reducer function for summing the party's levels.
  const reducer = (runningTotal, currentActor) => runningTotal + currentActor.level;

  // the sum of the levels of the party.
  const levelTotal = allies.reduce(reducer, 0);

  // the average level of the party.
  return Math.round(levelTotal / allies.length);
}
//#endregion Game_Party

//#region Game_System
J.LEVEL.Aliased.Game_System.set('initialize', Game_System.prototype.initialize);
/**
 * Extends `initialize()` to include properties for this plugin.
 */
Game_System.prototype.initialize = function()
{
  // perform original logic.
  J.LEVEL.Aliased.Game_System.get('initialize').call(this);

  /**
   * The overarching _j object, where all my stateful plugin data is stored.
   */
  this._j ||= {};

  /**
   * Whether or not the level scaling is enabled.
   * @type {boolean}
   */
  this._j._levelScalingEnabled ||= J.LEVEL.Metadata.Enabled;
};

/**
 * Gets whether or not the level scaling is enabled.
 * @returns {boolean}
 */
Game_System.prototype.isLevelScalingEnabled = function()
{
  return this._j._levelScalingEnabled;
};

/**
 * Enables level scaling functionality.
 */
Game_System.prototype.enableLevelScaling = function()
{
  this._j._levelScalingEnabled = true;
};

/**
 * Disables level scaling functionality.
 */
Game_System.prototype.disableLevelScaling = function()
{
  this._j._levelScalingEnabled = false;
};
//#endregion Game_System

//#region LevelScaling
/**
 * A helper class for calculating level-based scaling multipliers.
 */
class LevelScaling
{
  //#region properties
  /**
   * The default scaling multiplier.
   * @type {number}
   * @private
   */
  static #defaultScalingMultiplier = 1.0;

  /**
   * The minimum amount the multiplier can be.
   * If after calculation it is lower, it will be raised to this amount.
   * @type {number}
   * @private
   */
  static #minimumMultiplier = J.LEVEL.Metadata.MinimumMultiplier;

  /**
   * The maximum amount the multiplier can be.
   * If after calculation it is higher, it will be lowered to this amount.
   * @type {number}
   */
  static #maximumMultiplier = J.LEVEL.Metadata.MaximumMultiplier;

  /**
   * The amount of growth per level of difference in the scaling multiplier.
   * @type {number}
   */
  static #growthMultiplier = J.LEVEL.Metadata.GrowthMultiplier;

  /**
   * The upper threshold of invariance, effective the dead zone for ignoring
   * level differences when they are not high enough.
   * @type {number}
   */
  static #upperInvariance = J.LEVEL.Metadata.InvariantUpperRange;

  /**
   * The lower threshold of invariance, effective the dead zone for ignoring
   * level differences when they are not low enough.
   * @type {number}
   */
  static #lowerInvariance = J.LEVEL.Metadata.InvariantLowerRange;
  //#endregion properties

  /**
   * Constructor; however, this is a static class designed to have its methods used
   * directly instead of instantiating for later use.
   */
  constructor()
  {
    throw new Error(`"LevelScaling" is a static class; use its methods directly.`);
  };

  /**
   * Determines the multiplier based on the target's and user's levels.
   *
   * This gives a multiplier in relation to the user.
   * @param {number} targetLevel The level of the target.
   * @param {number} userLevel The level of the user.
   * @returns {number} A decimal representing the multiplier for the scaling.
   */
  static multiplier(targetLevel, userLevel)
  {
    // if the scaling functionality is disabled, then just return 1x.
    if (!$gameSystem.isLevelScalingEnabled()) return this.#defaultScalingMultiplier;

    // if one of the inputs is invalid, then default to 1x.
    if (!this.#isValid(targetLevel, userLevel)) return this.#defaultScalingMultiplier;

    // determine the difference in level.
    const levelDifference = this.determineLevelDifference(targetLevel, userLevel);

    // return the calculated multiplier based on the given level difference.
    return this.calculate(levelDifference);
  };

  /**
   * Determines whether or not the two battler's level inputs were valid.
   * @param {number} a One of the battler's level.
   * @param {number} b The other battler's level.
   * @returns {boolean} True if both battler's levels are valid, false otherwise.
   */
  static #isValid(a, b)
  {
    // if either value is falsey, then it isn't valid.
    if (!a || !b) return false;

    // valid!
    return true;
  };

  /**
   * Determine the difference in level between two battlers.
   * @param {number} targetLevel The level of the target.
   * @param {number} userLevel The level of the user.
   * @returns {number} A decimal representing the multiplier for the scaling.
   */
  static determineLevelDifference(targetLevel, userLevel)
  {
    // determine the difference between the target and user in relation to the user.
    return targetLevel - userLevel;
  };

  /**
   * Calculates the multiplier based on the given level difference.
   * @param {number} levelDifference The difference in levels between target and user.
   * @returns {number}
   */
  static calculate(levelDifference)
  {
    // grab the baseline for the multiplier.
    let base = this.#defaultScalingMultiplier;

    // grab the growth rate per level of difference.
    const growth = this.#growthMultiplier;

    // check if the difference is within our invariance range.
    if (levelDifference <= this.#upperInvariance &&
      levelDifference >= this.#lowerInvariance) return base;

    // determine the level difference lesser the invariance range.
    const invariantDifference = levelDifference > 0
      ? levelDifference - this.#upperInvariance
      : levelDifference + this.#lowerInvariance;

    // calculate the multiplier.
    const result = base + (invariantDifference * growth);

    // clamp the multiplier within given thresholds, and return it.
    return result.clamp(this.#minimumMultiplier, this.#maximumMultiplier);
  };
}
//#endregion LevelScaling
//ENDOFFILE