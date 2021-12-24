//#region initialization
/*:
 * @target MZ
 * @plugindesc
 * [v1.0 LEVEL] Scales damage and exp/gold rewards from defeated enemies.
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
 * NOTE 2:
 * The scale grows and shrinks the multiplier based on the difference between
 * the actor and enemy. The maximum difference is +/- 10 levels. The scaling
 * can be adjusted, but only in-code. Feel free to poke around in the
 * "#translateLevelDifferenceToMultiplier()" method if you want to adjust that.
 *
 * TAG USAGE:
 * - Enemies only.
 *
 * TAG FORMAT:
 *  <level:NUM>
 * Where NUM is the level being assigned to the enemy.
 *
 * TAG EXAMPLES:
 *  <level:4>
 * The enemy is now level 4.
 * ============================================================================
 * @param Level Scaling
 * @type boolean
 * @desc Enable damage/rewards scaling?
 * @default true
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
J.LEVEL.Metadata.Enabled = J.LEVEL.PluginParameters['Level Scaling'] === "true";

/**
 * All aliased methods for this plugin.
 */
J.LEVEL.Aliased = {
  Game_Action: new Map(),
  Game_Troop: new Map(),
};

/**
 * All tags used by this plugin.
 */
J.LEVEL.Notetags = {
  /**
   * The key name for the meta property of enemies for levels.
   * @type {string}
   */
  EnemyLevel: "level",
};

//#region Plugin Command Registration
/**
 * Plugin command for enabling the scaling functionality.
 */
PluginManager.registerCommand(J.LEVEL.Metadata.Name, "enableScaling", () =>
{
  J.LEVEL.Metadata.Enabled = true;
});

/**
 * Plugin command for disabling the scaling functionality.
 */
PluginManager.registerCommand(J.LEVEL.Metadata.Name, "disableScaling", () =>
{
  J.LEVEL.Metadata.Enabled = false;
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

//#region Game_Enemy
/**
 * Enemies now have a "level" property just like actors do.
 * If no level is specified, return `0`.
 * @returns {number}
 */
Object.defineProperty(
  Game_Enemy.prototype,
  "level",
  {
    get()
    {
      // start level at 0; this is considered "invalid" returning 1x multipliers by default.
      let level = 0;

      // grab the database information for this enemy.
      const referenceData = this.enemy();

      // if the meta has a tag for level...
      if (referenceData.meta && referenceData.meta[J.LEVEL.Notetags.EnemyLevel])
      {
        // ...then just parse and use that.
        return parseInt(referenceData.meta[J.LEVEL.Notetags.EnemyLevel]);
      }
      // otherwise, look to the notes if the meta is messed up somehow.
      else
      {
        // the regex structure for the level tag.
        const structure = /<level:[ ]?([0-9]*)>/i;

        // split up the note data into an array of strings.
        const notedata = referenceData.note.split(/[\r\n]+/);

        // iterate over each line and check it.
        notedata.forEach(note =>
        {
          // if we have a match...
          if (note.match(structure))
          {
            // ...parse out the level and assign it.
            level = parseInt(RegExp.$1);
          }
        });
      }

      // return the level found, if any at all.
      return level;
    },

    // sure, lets make this level property configurable.
    configurable: true,
  });
//#endregion Game_Enemy

//#region Game_Troop
/**
 * Upon defeating a troop of enemies, scales the earned experience based on
 * average actor level vs each of the enemies.
 */
J.LEVEL.Aliased.Game_Troop.set('expTotal', Game_Troop.prototype.expTotal);
Game_Troop.prototype.expTotal = function()
{
  if (J.LEVEL.Metadata.Enabled)
  {
    return this.getScaledExpResult();
  }
  else
  {
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
  let expTotal = 0;
  const deadEnemies = this.deadMembers();
  const averageActorLevel = $gameParty.averageActorLevel()
  deadEnemies.forEach(enemy =>
  {
    const expFactor = LevelScaling.multiplier(averageActorLevel, enemy.level);
    const total = Math.round(expFactor * enemy.exp())
    expTotal += total;
  });

  return expTotal;
};
//#endregion Game_Troop

//#region Game_Party
/**
 * Checks the current battle party and averages all levels.
 * @returns {number} The average battle party level (rounded).
 */
Game_Party.prototype.averageActorLevel = function()
{
  let lvlTotal = 0;
  const allies = this.battleMembers();
  allies.forEach(actor =>
  {
    lvlTotal += actor.level;
  });

  return Math.round(lvlTotal / allies.length);
}
//#endregion Game_Party

//#region LevelScaling
/**
 * A helper class for calculating level-based scaling multipliers.
 */
class LevelScaling
{
  /**
   * The default scaling multiplier.
   * @type {number}
   * @private
   */
  static #defaultScalingMultiplier = 1.0;

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
    if (!J.LEVEL.Metadata.Enabled) return this.#defaultScalingMultiplier;

    // if one of the inputs is invalid, then default to 1x.
    if (!this.#isValid(targetLevel, userLevel)) return this.#defaultScalingMultiplier;

    // otherwise, calculate the multiplier based on the difference.
    return this.#calculateMultiplier(targetLevel, userLevel);
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
   * Calculate the multiplier based on the two battler's levels.
   * @param {number} targetLevel The level of the target.
   * @param {number} userLevel The level of the user.
   * @returns {number} A decimal representing the multiplier for the scaling.
   */
  static #calculateMultiplier(targetLevel, userLevel)
  {
    // determine the difference between the target and user in relation to the user.
    const levelDifference = targetLevel - userLevel;

    // if the user is 10 or more levels ABOVE the target, then short-circuit.
    if (levelDifference < -9) return 2.0;

    // if the user is 10 or more levels BELOW the target, then short-circuit.
    if (levelDifference > 9) return 0.1;

    // if there is no difference, then short-circuit.
    if (levelDifference === 0) return 1.0;

    return this.#translateLevelDifferenceToMultiplier(levelDifference);
  };

  /**
   * Translates the level difference provided into a decimal multiplier.
   * The switch inside of this method handles -9 through 9.
   * The above and below that are handled prior to reaching here.
   * @param {number} levelDifference The difference in battler level, in relation to the user.
   * @returns {number} A decimal representing the multiplier for the scaling.
   */
  static #translateLevelDifferenceToMultiplier(levelDifference)
  {
    switch (levelDifference)
    {
      case -9:
        return 1.8;  // nine levels above the target.
      case -8:
        return 1.7;
      case -7:
        return 1.6;
      case -6:
        return 1.5;
      case -5:
        return 1.4;  // five levels above the target.
      case -4:
        return 1.3;
      case -3:
        return 1.2;
      case -2:
        return 1.1;   // at two levels above the target, the multiplier starts growing.

      case -1:
        return 1.0;
      case 0:
        return 1.0;   // same level as the target.
      case 1:
        return 1.0;

      case 2:
        return 0.9;   // at two levels below the target, the multiplier starts shrinking.
      case 3:
        return 0.8;
      case 4:
        return 0.7;
      case 5:
        return 0.6;   // five levels below the target.
      case 6:
        return 0.5;
      case 7:
        return 0.4;
      case 8:
        return 0.3;
      case 9:
        return 0.2;   // nine levels below the target.
    }
  };
}
//#endregion LevelScaling
//ENDOFFILE