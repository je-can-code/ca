//region initialization
/*:
 * @target MZ
 * @plugindesc
 * [v1.2.1 LEVEL] Allows levels to have greater control and purpose.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin scales various data points based on the difference between the
 * actor and enemy's levels. This also bestows a new "level" property upon
 * enemies, meaning they too can leverage their level in damage formulas for
 * skills and whatever other scripting shenanigans you want to do.
 *
 * The various data points include:
 * - damage
 * - experience
 * - gold
 *
 * See below SAMPLE CALCULATIONS to understand how the scaling works.
 *
 * CAUTION:
 * This probably won't work with any other plugins that mess with the
 * level functionality of battlers.
 *
 * Integrates with others of mine plugins:
 * - J-ABS; enables per-event-enemy level overrides.
 * - J-NATURAL; handles level-based max hp/mp/tp growths.
 *
 * ============================================================================
 * PLUGIN PARAMETERS BREAKDOWN:
 *  - Start Enabled:
 *      The scaling functionality will be enabled when a newgame is started.
 *      Defaults to true.
 *  - Minimum Multiplier:
 *      The minimum amount a scaling multiplier can result in.
 *      Defaults to 0.1x.
 *  - Maximum Multiplier:
 *      The maximum amount a scaling multiplier can result in.
 *      Defaults to 2.0x.
 *  - Growth Multiplier:
 *      The amount the multiplier changes per level of difference.
 *      Defaults to 0.1x per level of difference.
 *  - Upper Invariance:
 *      The amount above 0 levels of difference before scaling is applied.
 *      See the SAMPLE CALCULATIONS below for examples.
 *      Defaults to 1 level.
 *  - Lower Invariance:
 *      The amount below 0 levels of difference before scaling is applied.
 *      See the SAMPLE CALCULATIONS below for examples.
 *      Defaults to 1 level.
 *  - Actor Balancer:
 *      A variableId whose value is added to all actor's levels.
 *      This DOES impact how their levels are perceived by RMMZ.
 *      Defaults to variableId 141.
 *  - Enemy Balancer:
 *      A variableId whose value is added to all enemy's levels.
 *      Only really applies to scaling since enemies usually lack levels.
 *      Defaults to variableId 142.
 * ============================================================================
 * LEVEL TAGS:
 * Have you ever wanted to scale damage/experience/gold by level, but realized
 * that enemies in RMMZ don't have a level parameter? Well now you can! By
 * adding the appropriate tags to various locations in the database, you too
 * can scale numbers to your hearts content!
 *
 * NOTE ABOUT LEVEL ZERO:
 * The level-scaling utility has no concept of actor or enemy when performing
 * its calculations. With that in mind, be cognizant of the magic level of
 * zero. If a level ever ends up being zero, that battler will be identified
 * as a "non-level", aka level scaling won't apply and all multipliers to and
 * from that battler will be 1.0x. Level can drop below zero, though, so just
 * stay aware when doing unusual things, like trying to add a state that grants
 * bonus levels for a scaling bonus to a non-level enemy.
 *
 * NOTE ABOUT REWARDS:
 * The way the math works out for the level-scaling calculations, the inputs
 * for levels are entered in reverse from the way they are in combat formulas!
 * If it helps you, you can think of it like enemies using a skill against
 * each member of your party that gives experience- and is affected by the
 * normal level-scaling mechanics. The same applies to gold rewards.
 *
 * NOTE ABOUT WORKING WITH JABS:
 * If a level is present on an event that is identified as a JABS enemy, this
 * level will override whatever is present on the database note section. You
 * can think of the event as the real level, while the database notes are the
 * "default" level for enemies. The overriden level still gets combined with
 * any other modifications from states and whatnot. If an enemy has a level, by
 * default it will show up in their battler name. If it is desired to be
 * hidden, it can be converted to ??? by using the hide level tag.
 *
 * DETAILS:
 * This was initially designed only for enemies, but has since been expanded to
 * also allow you to apply modifiers to your actors as well. For enemies, since
 * they do not innately have levels, the total amount of "level" is the sum of
 * all tags found for a given enemy across itself and any states that may be
 * applied to an enemy. For actors, it starts with whatever their current level
 * is, and if states/classes/equipment/skills also contain the tags, the level
 * modifiers will be stacked against the actor's base level.
 *
 * ENEMY TAG USAGE:
 * - Enemies
 * - States
 * - Events (w/ JABS)
 *
 * ACTOR TAG USAGE:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - States
 *
 * TAG FORMAT:
 *  <lv:NUM> or <lvl:NUM> or <level:NUM>
 * Where NUM is the level value to set/modify. (can be negative)
 *
 * TAG EXAMPLES:
 *  <level:4>
 * On enemies, if on the enemy, it would set their base level to 4.
 * On enemies, if on a state, it would grant a +4 modifier to their base level.
 * On events, this will override whatever the JABS enemy's level would be.
 * On actors, this would grant a +4 level modifier to their base level.
 *
 *  <level:-2>
 * On enemies, if on the enemy, it would do nothing.
 * On enemies, if on a state, and they have a base level set,
 *  this will grant a -2 modifier to their base level.
 * On actors, this will grant a -2 modifier to their base level.
 *
 *  <hideLevel>
 * On enemies, this will turn the level into "???" instead of the level value.
 * On events, this will override a singular enemy into hiding the value.
 * On states, this will do nothing.
 *
 * ============================================================================
 * SKILL LEARNING TAGS
 * Have you ever wanted enemies to learn new skills as they "level up"? Well,
 * now you can! By applying the appropriate tag w/ data points to the enemies,
 * you too can have enemies obtain new skills as they reach ever-higher levels!
 *
 * NOTE ABOUT LEVELS AND SKILLS:
 * The actual skill needs to be in the actions list of an enemy in order for it
 * to ever be available. The tag is basically a "guard" that level-checks before
 * allowing the skill to be included in the skill list when the list of skills
 * for an enemy is grabbed and mapped.
 *
 * NOTE ABOUT COMPATIBILITY:
 * Due to the nature of how this functionality works, this tag probably won't
 * work as-intended outside of JABS. An extension would need to be drafted
 * that leverages the Game_Enemy.prototype.skills function to determine their
 * available skills instead of the default- which directly parses the actions.
 *
 * TAG USAGE:
 * - Enemies only.
 *
 * TAG FORMAT:
 *  <learning:[SKILL_ID, LEVEL_LEARNED]>
 * Where SKILL_ID is the skill being learned, and LEVEL_LEARNED is the level
 * at which the enemy must be before the skill becomes available to them.
 *
 * TAG EXAMPLE:
 *  <learning:[210, 10]>
 * An enemy with this tag will have skill of ID 210 become "learned" when the
 * enemy is level 10 or higher.
 *
 * ============================================================================
 * BEYOND THE MAX LEVELS
 * Have you ever wanted levels to exceed 99? Well now you can! By properly
 * setting the plugin configuration, you too can reach beyond the max level!
 *
 * NOTE ABOUT PLUGIN CONFIGURATION:
 * There are two important values that should be considered when working with
 * beyond max level tags: the "default beyond max level" value- aka the "base",
 * and the "max boosted level" value- aka the "cap", as they influence the tags
 * in this section.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - States
 *
 * TAG FORMAT:
 *  <maxLevelBoost:AMOUNT>
 * Where AMOUNT is a negative or positive integer applied to the base beyond
 * max level.
 *
 * TAG EXAMPLES:
 *  <maxLevelBoost:+25> (on the actor)
 * The actor with this tag will have a +25 modifier to their base max level,
 * but no higher than the cap max level.
 *
 *  <maxLevelBoost:+100> (on the actor)
 *  <maxLevelBoost:-25> (on an equipped weapon)
 * The actor with these tags will have a +75 (100-25=75) modifier to their base
 * max level, but no higher than the cap max level.
 *
 *  <maxLevelBoost:-50> (on the actor)
 *  <maxLevelBoost:-25> (on a learned skill for the actor)
 *  <maxLevelBoost:+10> (on a state applied to the actor)
 * The actor with these tags will have a -65 (-50-25+10=-65) modifier to their
 * base max level.
 *
 * ============================================================================
 * SAMPLE CALCULATIONS:
 * Here is an example back and forth encounter between an allied party and
 * enemy party.
 *
 * Let us assume you are using the default plugin parameters.
 *
 * You have a party that looks like this:
 * - Gilbert  lv12
 * - Susan    lv14
 * - Frank    lv11
 * - Ophelia  lv35
 *
 * And you are fighting an enemy troop that looks like this:
 * - Slime      lv12  (10xp)
 * - Goblin     lv13  (14xp)
 * - Gigagoblin lv20  (55xp)
 * - Red Slime  lv16  (21xp)
 *
 * Gilbert attacks Slime!
 * They are the same level.
 * Damage is not modified; 1.0x.
 *
 * Susan attacks Slime!
 * Susan is 2 levels over the slime.
 * There is 1 level of upper invariance.
 * The actual variance is +1 level difference.
 * The growth per level of difference is 0.1x.
 * Damage is increased; 1.1x for this attack.
 *
 * Goblin attacks Gilbert!
 * The attacker(Goblin) is 1 level over the defender(Gilbert).
 * There is 1 level of upper invariance.
 * The actual variance is 0 level difference.
 * Damage is not modified; 1.0x.
 *
 * Gigagoblin attacks Susan!
 * The attacker(Gigagoblin) is 6 levels over the defender(Susan).
 * There is 1 level of upper invariance.
 * The actual variance is +5 level difference.
 * The growth per level of difference is 0.1x.
 * Damage is increased; 1.5x for this attack.
 *
 * Ophelia attacks Gigagoblin!
 * The attacker(Ophelia) is 15 levels over the defender(Gigagoblin).
 * There is 1 level of lower invariance.
 * The actual variance is +14 level difference.
 * The growth per level of difference is 0.1x.
 * The actual multiplier is 2.4x.
 * The cap multiplier is 2.0x.
 * Damage is increased; capped at 2.0x (from 2.4x).
 *
 * Frank attacks Red Slime!
 * The attacker(Frank) is 5 levels under the defender(Red Slime).
 * There is 1 level of lower invariance.
 * The actual variance is -4 level difference.
 * The reduction per level of difference is -0.1x.
 * Damage is reduced; 0.6x for this attack.
 *
 * Gigagoblin attacks Ophelia!
 * The attacker(Gigagoblin) is 15 levels under the defender(Ophelia).
 * There is 1 level of lower invariance.
 * The actual variance is -14 level difference.
 * The reduction per level of difference is -0.1x.
 * The actual multiplier is -0.4x.
 * (which would actually heal the defender!!!)
 * The minimum multiplier is 0.1x.
 * Damage is reduced; capped at 0.1x for this attack.
 *
 * Eventually, all enemies are defeated (thanks Ophelia!).
 * Average the actor's party level (18).
 * There is 1 level of upper/lower invariance.
 *
 * Party average of 18 is 6 levels over the slime, -1 for invariance.
 * Slime experience (10) is multiplied by 0.5x; 5xp.
 * Party average of 18 is 5 levels over the goblin, -1 for invariance.
 * Goblin experience (14) is multiplied by 0.6x; 8.4xp.
 * Party average of 18 is 2 levels under the gigagoblin, +1 for invariance.
 * Gigagoblin experience (55) is multiplied by 1.1x; 60.5xp.
 * Party average of 18 is 2 levels over the red slime, -1 for invariance.
 * Red Slime experience (21) is multiplied by 0.9x; 18.9xp.
 * Each member of the party gains 92.8 experience.
 *
 * This same logic is again applied to gold from each defeated enemy.
 * ============================================================================
 * CHANGELOG:
 * - 1.2.1
 *    Fixed issue with level overrides not apply J-NATURAL growths.
 * - 1.2.0
 *    Added ability to override JABS enemies on the map with a new level.
 * - 1.1.1
 *    Added ability to manipulate max level for actors.
 *    Adapted extended plugin metadata structure.
 * - 1.1.0
 *    Refactored various data retrieval methods from given battlers.
 *    Fixed issue with mismapped level calculations.
 *    Added more jsdocs and comments to explain better the logical flow.
 *    Removed useless methods.
 *    Updated example battle scenario to be more verbose.
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 * @param parentConfigScaling
 * @text SCALING
 *
 * @param useScaling
 * @parent parentConfigScaling
 * @type boolean
 * @text Start Enabled
 * @desc Whether or not this scaling functionality is enabled by default.
 * @on Enabled By Default
 * @off Disabled By Default
 * @default true
 *
 * @param minMultiplier
 * @parent parentConfigScaling
 * @type number
 * @decimals 2
 * @text Minimum Multiplier
 * @desc The minimum amount the scaling multiplier can calculate to be.
 * @default 0.10
 *
 * @param maxMultiplier
 * @parent parentConfigScaling
 * @type number
 * @decimals 2
 * @text Maximum Multiplier
 * @desc The maximum amount the scaling multiplier can be calculate to be.
 * @default 2.00
 *
 * @param growthMultiplier
 * @parent parentConfigScaling
 * @type number
 * @decimals 2
 * @text Growth Multiplier
 * @desc The amount of growth per level of difference.
 * @default 0.10
 *
 * @param invariantUpperRange
 * @parent parentConfigScaling
 * @type number
 * @text Upper Invariance
 * @desc The amount of level difference over 0 before scaling takes effect.
 * @default 1
 *
 * @param invariantLowerRange
 * @parent parentConfigScaling
 * @type number
 * @text Lower Invariance
 * @desc The amount of level difference under 0 before scaling takes effect.
 * @default 1
 *
 * @param variableActorBalancer
 * @parent parentConfigScaling
 * @type variable
 * @text Actor Balancer
 * @desc The variable id to act as a constant level modifier in favor of actors.
 * @default 141
 *
 * @param variableEnemyBalancer
 * @parent parentConfigScaling
 * @type variable
 * @text Enemy Balancer
 * @desc The variable id to act as a constant level modifier in favor of enemies.
 * @default 142
 *
 * @param parentConfigMaxLevel
 * @text MAX LEVEL
 *
 * @param defaultBeyondMaxLevel
 * @parent parentConfigMaxLevel
 * @type number
 * @min 100
 * @max 1000
 * @text Default Beyond Max Level
 * @desc The default for what the max level is if beyond the cap. Requires max level for actors to be set to 99.
 * @default 255
 *
 * @param trueMaxLevel
 * @parent parentConfigMaxLevel
 * @type number
 * @min 1
 * @max 1000
 * @text Max Boosted Level
 * @desc The max level your level can be. While this is intended to always be beyond the max, it can be lower.
 * @default 1000
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

//region plugin metadata
class J_LevelPluginMetadata
  extends PluginMetadata
{
  /**
   * The maximum level definable in the level. Any level below this can be determined without extra calculations.
   * @type {number}
   */
  static EditorMaxLevel = 99;

  /**
   * Constructor.
   */
  constructor(name, version)
  {
    super(name, version);
  }

  postInitialize()
  {
    super.postInitialize();

    this.initializeLevelMaster();
  }

  initializeLevelMaster()
  {
    /**
     * Whether or not the scaling functionality is enabled.
     * @type {boolean}
     */
    this.enabled = this.parsedPluginParameters['useScaling'] === "true";

    /**
     * The minimum multiplier that scaling can reduce to based on level difference. This should never actually be zero
     * or lower or unexpected things can happen.
     * @type {number}
     */
    this.minimumMultiplier = Number(this.parsedPluginParameters['minMultiplier']);

    /**
     * The maximum multiplier that scaling can reach based on level difference.
     * @type {number}
     */
    this.maximumMultiplier = Number(this.parsedPluginParameters['maxMultiplier']);

    /**
     * The amount per level up or down that applies. This amount stacks additively.
     * @type {number}
     */
    this.growthMultiplier = Number(this.parsedPluginParameters['growthMultiplier']);

    /**
     * The upper limit from a zero level difference before scaling kicks in.
     * @type {number}
     */
    this.invariantUpperRange = Number(this.parsedPluginParameters['invariantUpperRange']);

    /**
     * The lower limit from a zero level difference before scaling kicks in.
     * @type {number}
     */
    this.invariantLowerRange = Number(this.parsedPluginParameters['invariantLowerRange']);

    /**
     * The variableId to set to modify the actor level balancer value. This number is directly added to all actors'
     * levels when considering scaling.
     * @type {number}
     */
    this.actorBalanceVariable = Number(this.parsedPluginParameters['variableActorBalancer']);

    /**
     * The variableId to set to modify the enemy level balancer value. This number is directly added to all enemies'
     * levels when considering scaling.
     * @type {number}
     */
    this.enemyBalanceVariable = Number(this.parsedPluginParameters['variableEnemyBalancer']);

    /**
     * The default max level beyond the max set by the database.
     * @type {number}
     */
    this.defaultBeyondMaxLevel = Number(this.parsedPluginParameters['defaultBeyondMaxLevel']);

    /**
     * The true max level. No actor level can ascend beyond this. This will override actor max level if applicable.
     * @type {number}
     */
    this.trueMaxLevel = Number(this.parsedPluginParameters['trueMaxLevel']);
  }
}

//endregion plugin metadata

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.LEVEL = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.LEVEL.Metadata = new J_LevelPluginMetadata(`J-LevelMaster`, '1.2.1');

/**
 * All aliased methods for this plugin.
 */
J.LEVEL.Aliased = {
  Game_Action: new Map(),
  Game_Actor: new Map(),
  Game_Battler: new Map(),
  Game_Enemy: new Map(),
  Game_Event: new Map(),
  Game_System: new Map(),
  Game_Temp: new Map(),
  Game_Troop: new Map(),

  DataManager: new Map(),
  JABS_AiManager: new Map(),

  Sprite_Character: new Map(),
};

/**
 * All regular expressions used by this plugin.
 */
J.LEVEL.RegExp = {
  /**
   * The regex for hiding the level display of a battler.
   * @type {RegExp}
   */
  HideLevel: /<hideLevel>/i,

  /**
   * The regex for the level tag on various database objects.
   * @type {RegExp}
   */
  Level: /<(?:lv|lvl|level):[ ]?(-?\+?\d+)>/i,

  /**
   * The regex for when a skill id is learned at a designated level.
   * The array capture group is [SKILL_ID, LEVEL_LEARNED].
   * @type {RegExp}
   */
  Learning: /<learning: ?(\[\d+, ?\d+])>/i,

  /**
   * The regex for granting bonuses or penalties to max level (for actors only).
   * @type {RegExp}
   */
  MaxLevelBoost: /<maxLevelBoost: ?(-?\+?\d+)>/i,
};
//endregion initialization

//region Plugin Command Registration
/**
 * Plugin command for enabling the level scaling functionality.
 */
PluginManager.registerCommand(J.LEVEL.Metadata.name, "enableScaling", () =>
{
  J.LEVEL.Metadata.enabled = true;
  $gameSystem.enableLevelScaling();
});

/**
 * Plugin command for disabling the level scaling functionality.
 */
PluginManager.registerCommand(J.LEVEL.Metadata.name, "disableScaling", () =>
{
  J.LEVEL.Metadata.enabled = false;
  $gameSystem.disableLevelScaling();
});
//endregion Plugin Command Registration

//region DataManager
/**
 * Extends {@link #setupNewGame}.<br/>
 * Also builds the beyond max data for classes.
 */
J.LEVEL.Aliased.DataManager.set('setupNewGame', DataManager.setupNewGame);
DataManager.setupNewGame = function()
{
  // perform original logic.
  J.LEVEL.Aliased.DataManager.get('setupNewGame')
    .call(this);

  // also build the beyond max data.
  $gameTemp.buildBeyondMaxData();
};
//endregion DataManager

//region JABS_AiManager
/**
 * Extends {@link #postConvertMutate}.<br/>
 * Also applies the level override.
 * @param {Game_Enemy} battler The enemy battler that was converted from the event.
 * @param {JABS_Battler} jabsBattler The created JABS battler from the event.
 */
J.LEVEL.Aliased.JABS_AiManager.set('postConvertMutate', JABS_AiManager.postConvertMutate);
JABS_AiManager.postConvertMutate = function(battler, jabsBattler)
{
  // perform original logic.
  J.LEVEL.Aliased.JABS_AiManager.get('postConvertMutate')
    .call(this, battler, jabsBattler);

  const character = jabsBattler.getCharacter();

  const levelOverride = character.getLevelOverrides();
  if (levelOverride !== null)
  {
    battler.setCachedLevelOverride(levelOverride);

    if (J.NATURAL)
    {
      battler.refreshAllParameterBuffs();
    }
  }
};
//endregion JABS_AiManager

//region LevelScaling
/**
 * A helper class for calculating level-based scaling multipliers.
 */
class LevelScaling
{
  //region properties
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
  static #minimumMultiplier = J.LEVEL.Metadata.minimumMultiplier;

  /**
   * The maximum amount the multiplier can be.
   * If after calculation it is higher, it will be lowered to this amount.
   * @type {number}
   */
  static #maximumMultiplier = J.LEVEL.Metadata.maximumMultiplier;

  /**
   * The amount of growth per level of difference in the scaling multiplier.
   * @type {number}
   */
  static #growthMultiplier = J.LEVEL.Metadata.growthMultiplier;

  /**
   * The upper threshold of invariance, effective the dead zone for ignoring
   * level differences when they are not high enough.
   * @type {number}
   */
  static #upperInvariance = J.LEVEL.Metadata.invariantUpperRange;

  /**
   * The lower threshold of invariance, effective the dead zone for ignoring
   * level differences when they are not low enough.
   * @type {number}
   */
  static #lowerInvariance = J.LEVEL.Metadata.invariantLowerRange;

  //endregion properties

  /**
   * The constructor is not designed to be called.
   * This is a static class.
   */
  constructor()
  {
    throw new Error("This is a static class.");
  }

  /**
   * Determines the multiplier based on the target's and user's levels.
   *
   * This gives a multiplier in relation to the user.
   * @param {number} userLevel The level of the user, typically the actor.
   * @param {number} targetLevel The level of the target.
   * @returns {number} A decimal representing the multiplier for the scaling.
   */
  static multiplier(userLevel, targetLevel)
  {
    // if the scaling functionality is disabled, then just return 1x.
    if (!$gameSystem.isLevelScalingEnabled()) return this.#defaultScalingMultiplier;

    // if one of the inputs is invalid or just zero, then default to 1x.
    if (!this.#isValid(userLevel, targetLevel)) return this.#defaultScalingMultiplier;

    // determine the difference in level.
    const levelDifference = userLevel - targetLevel;

    // return the calculated multiplier based on the given level difference.
    return this.calculate(levelDifference);
  }

  /**
   * Determines whether or not the two battler's level inputs were valid.
   * Zero, while "valid", is handled the same as invalid: just use the default multiplier.
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
  }

  /**
   * Calculates the multiplier based on the given level difference.
   * @param {number} levelDifference The difference in levels between target and user.
   * @returns {number}
   */
  static calculate(levelDifference)
  {
    // grab the baseline for the multiplier.
    const base = this.#defaultScalingMultiplier;

    // grab the growth rate per level of difference.
    const growth = this.#growthMultiplier;

    // check if the difference is within our invariance range.
    if (levelDifference <= this.#upperInvariance && levelDifference >= this.#lowerInvariance) return base;

    // determine the level difference lesser the invariance range.
    const invariantDifference = levelDifference > 0
      ? levelDifference - this.#upperInvariance
      : levelDifference + this.#lowerInvariance;

    // calculate the multiplier.
    const result = base + (invariantDifference * growth);

    // clamp the multiplier within given thresholds, and return it.
    return result.clamp(this.#minimumMultiplier, this.#maximumMultiplier);
  }
}

//endregion LevelScaling

//region Game_Action
/**
 * Scales damaged dealt and received to be based on level differences.
 */
J.LEVEL.Aliased.Game_Action.set('makeDamageValue', Game_Action.prototype.makeDamageValue);
Game_Action.prototype.makeDamageValue = function(target, critical)
{
  // get the base damage that would've been done.
  const baseDamage = J.LEVEL.Aliased.Game_Action.get('makeDamageValue')
    .call(this, target, critical);

  // get the multiplier based on target and user levels.
  const multiplier = LevelScaling.multiplier(this.subject().level, target.level);

  // return the product of these two values.
  return (baseDamage * multiplier);
}
//endregion Game_Action

//region Game_Actor
/**
 * Extends {@link #initMembers}.<br>
 * Also initializes this plugin's members.
 */
J.LEVEL.Aliased.Game_Actor.set('initMembers', Game_Actor.prototype.initMembers);
Game_Actor.prototype.initMembers = function()
{
  // perform original logic.
  J.LEVEL.Aliased.Game_Actor.get('initMembers')
    .call(this);

  /**
   * The J object where all my additional properties live.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with this plugin.
   */
  this._j._level ||= {};

  /**
   * The calculated max level of this actor.
   * @type {number}
   */
  this._j._level._realMaxLevel = J_LevelPluginMetadata.EditorMaxLevel;
};

Game_Actor.prototype.getRealMaxLevel = function()
{
  return this._j._level._realMaxLevel;
};

Game_Actor.prototype.setRealMaxLevel = function(newRealLevel)
{
  this._j._level._realMaxLevel = newRealLevel;
};

J.LEVEL.Aliased.Game_Actor.set('onBattlerDataChange', Game_Actor.prototype.onBattlerDataChange);
Game_Actor.prototype.onBattlerDataChange = function()
{
  // perform original logic.
  J.LEVEL.Aliased.Game_Actor.get('onBattlerDataChange')
    .call(this);

  this.updateRealMaxLevel();
};

Game_Actor.prototype.updateRealMaxLevel = function()
{
  const newMaxLevel = this.calculateRealMaxLevel();
  this.setRealMaxLevel(newMaxLevel);
};

Game_Actor.prototype.calculateRealMaxLevel = function()
{
  // grab the defined max level for this actor.
  const baseMaxLevel = this.baseMaxLevel();

  // grab the boosts to max level found across the actor.
  const maxLevelBoosts = this.maxLevelBoost();

  // if there are no boosts, then don't do any unnecessary math.
  if (maxLevelBoosts === 0) return baseMaxLevel;

  // sum the two max levels together.
  const maxLevelSum = baseMaxLevel + maxLevelBoosts;

  // can't be higher level than the defined cap.
  const cappedMaxLevel = Math.min(maxLevelSum, J.LEVEL.Metadata.trueMaxLevel);

  // have to be at least level 1.
  const normalizedMaxLevel = Math.max(cappedMaxLevel, 1);

  // return the overall normalized max level.
  return normalizedMaxLevel;
};

/**
 * Overrides {@link #maxLevel}.<br/>
 * Recalculates the max level based on the possibility of a modified max level.
 * @returns {number}
 */
Game_Actor.prototype.maxLevel = function()
{
  return this.getRealMaxLevel();
};

/**
 * Gets the max level boost from all available notes for this battler.
 * @returns {number|null}
 */
Game_Actor.prototype.maxLevelBoost = function()
{
  return RPGManager.getSumFromAllNotesByRegex(this.getAllNotes(), J.LEVEL.RegExp.MaxLevelBoost);
};

/**
 * The base max level for a given actor. If it is set below 99 in the database, it'll just be that value. If it is set
 * to 99, then it'll return what is defined in the plugin parameters.
 * @returns {number}
 */
Game_Actor.prototype.baseMaxLevel = function()
{
  // if the actor has less than 99, then obey their max level settings.
  if (this.actor().maxLevel < 99) return this.actor().maxLevel;

  // return our defined beyond max level.
  return J.LEVEL.Metadata.defaultBeyondMaxLevel;
};

/**
 * Overrides {@link #paramBase}.<br/>
 * Potentially fetches "beyond max data" for when ones level is beyond the editor max of 99.
 * @param {number} paramId The paramId to fetch the data for.
 * @returns {number}
 */
Game_Actor.prototype.paramBase = function(paramId)
{
  // TODO: use the calculated "getLevel()" instead after some sort of optimizations?
  const level = this._level;

  // check if the level is still within database norms.
  if (level <= J_LevelPluginMetadata.EditorMaxLevel)
  {
    // just return the regular database parameter.
    return this.currentClass().params[paramId][level];
  }

  // check if the cache has already been built for beyond max data.
  if ($gameTemp.hasCachedBeyondMaxData() === false)
  {
    // build it!
    $gameTemp.buildBeyondMaxData();
  }

  // grab the beyond max data instead.
  const params = $gameTemp.getBeyondMaxData(this.currentClass().id);
  return params[paramId][level];
};

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
  return [
    // add the actor/enemy to the source list.
    this.databaseData(),

    // add all actor equipment to the source list.
    ...this.equips(),

    // add all currently applied states to the source list.
    ...this.allStates(), ];
};

/**
 * The variable level modifier for this actor.
 * @returns {number}
 */
Game_Actor.prototype.getLevelBalancer = function()
{
  // check if we have a variable set for the fixed balancing.
  if (J.LEVEL.Metadata.actorBalanceVariable)
  {
    // return the adjustment from the variable value instead.
    return $gameVariables.value(J.LEVEL.Metadata.actorBalanceVariable);
  }

  // we don't have any balancing required.
  return 0;
};
//endregion Game_Actor

//region Game_Battler
/**
 * Generates the "level" property for all battlers, along with
 * a new function to calculate level retrieval.
 *
 * This is the same as `battler.lvl`.
 * @returns {number}
 */
Object.defineProperty(Game_Battler.prototype, "level", {
  get()
  {
    // get the level from this battler.
    return this.getLevel();
  },

  // sure, lets make this level property configurable.
  configurable: true,
});

/**
 * Generates the "lvl" property for all battlers, along with
 * a new function to calculate level retrieval.
 *
 * This is the same as `battler.level`.
 * @returns {number}
 */
Object.defineProperty(Game_Battler.prototype, "lvl", {
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
  }, this);

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
  return RPGManager.getNumberFromNoteByRegex(rpgData, J.LEVEL.RegExp.Level);
};
//endregion Game_Battler

//region Game_Enemy

/**
 * Extends {@link Game_Enemy.setup}.<br>
 * Includes setting up the learned level map for skills.
 */
J.LEVEL.Aliased.Game_Enemy.set('initMembers', Game_Enemy.prototype.initMembers);
Game_Enemy.prototype.initMembers = function()
{
  // perform original logic.
  J.LEVEL.Aliased.Game_Enemy.get('initMembers')
    .call(this);

  /**
   * The J object where all my additional properties live.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with levels.
   */
  this._j._level ||= {};

  /**
   * All skill learnings this enemy has for it recorded as a dictionary.
   * @type {Record<number, number>}
   */
  this._j._level._skillLearnings = {};

  /**
   * The cached level override for this enemy if one exists.
   * @type {number|null}
   */
  this._j._level._cachedLevelOverride = null;
};

/**
 * Sets a skill's learning by its skill and level.
 * @param {number} skillId The skill id to be learned.
 * @param {number} level The level the corresponding skill is learned.
 */
Game_Enemy.prototype.setSkillLearning = function(skillId, level)
{
  this._j._level._skillLearnings[skillId] = level;
};

Game_Enemy.prototype.getCachedLevelOverride = function()
{
  return this._j._level._cachedLevelOverride;
};

Game_Enemy.prototype.setCachedLevelOverride = function(level)
{
  this._j._level._cachedLevelOverride = level;
};

/**
 * Extends {@link Game_Enemy.setup}.<br>
 * Includes setting up the learned level map for skills.
 */
J.LEVEL.Aliased.Game_Enemy.set('setup', Game_Enemy.prototype.setup);
Game_Enemy.prototype.setup = function(enemyId, x, y)
{
  // perform original logic.
  J.LEVEL.Aliased.Game_Enemy.get('setup')
    .call(this, enemyId, x, y);

  // initialize the skill learnings for this enemy.
  this.setupSkillLearnings();
};

/**
 * Sets up the learnings defined on the enemy.
 */
Game_Enemy.prototype.setupSkillLearnings = function()
{
  const learnings = RPGManager.getArraysFromNotesByRegex(this.enemy(), J.LEVEL.RegExp.Learning) ?? [];
  if (learnings.length === 0) return;

  learnings.forEach(learning => this.setSkillLearning(learning.at(0), learning.at(1)));
};

/**
 * Extends {@link #canMapActionToSkill}.<br/>
 * Also factors in whether or not the skill is technically learned or not.
 * @param {RPG_EnemyAction} action The action being mapped to a skill.
 * @returns {boolean}
 */
J.LEVEL.Aliased.Game_Enemy.set('canMapActionToSkill', Game_Enemy.prototype.canMapActionToSkill);
Game_Enemy.prototype.canMapActionToSkill = function(action)
{
  // perform original logic.
  const baseCanMap = J.LEVEL.Aliased.Game_Enemy.get('canMapActionToSkill')
    .call(this, action);

  // if the skill is otherwise unmappable, then don't bother with level-related logic.
  if (baseCanMap === false) return false;

  // determine if the skill is learned according to its level.
  const isLearned = this.isLearnedSkillByLevel(action);

  // return what we found.
  return isLearned;
};

/**
 * Determines if a skill has been learned from potential level restrictions.
 * @param {RPG_EnemyAction} action The action being mapped to a skill.
 * @returns {boolean}
 */
Game_Enemy.prototype.isLearnedSkillByLevel = function(action)
{
  const levelLearned = this._j._level._skillLearnings[action.skillId];

  // if the skill didn't map, then the value will be undefined.
  if (levelLearned === undefined) return true;

  // if the enemy is at or above the level learned, then the skill is learned.
  if (this.level >= levelLearned) return true;

  // otherwise, the skill is not learned and shouldn't be considered.
  return false;
};

/**
 * Overrides {@link #getBattlerBaseLevel}.<br/>
 * Instead of defaulting to zero, it will use the enemy's own note, accommodating any overrides if present.
 * @returns {number}
 */
J.LEVEL.Aliased.Game_Enemy.set('getBattlerBaseLevel', Game_Enemy.prototype.getBattlerBaseLevel);
Game_Enemy.prototype.getBattlerBaseLevel = function()
{
  // calculate the original level- probably zero unless another plugin modifies this.
  const defaultBaseLevel = J.LEVEL.Aliased.Game_Enemy.get('getBattlerBaseLevel')
    .call(this);

  // grab the level from the enemy's own note.
  const noteLevel = RPGManager.getNumberFromNoteByRegex(this.enemy(), J.LEVEL.RegExp.Level);

  // combine the default and enemy levels.
  const baseLevel = defaultBaseLevel + noteLevel;

  // if there are no overrides, then return the base level.
  if (this.hasLevelOverride() === false) return baseLevel;

  // return the level override.
  return this.getCachedLevelOverride();
};

/**
 * Checks if this enemy in particular has any JABS level overrides.
 * @returns {boolean}
 */
Game_Enemy.prototype.hasLevelOverride = function()
{
  // if JABS isn't available, then there won't be a level override.
  if (!J.ABS) return false;

  // if overrides is null, then there are none.
  if (this.getCachedLevelOverride() === null) return false;

  // there must be overrides!
  return true;
};

/**
 * Determines if the level should be hidden for this enemy based on its notes.
 * @returns {boolean} True if the level should be hidden, false otherwise.
 */
Game_Enemy.prototype.shouldHideLevel = function()
{
  // grab the reference data for this battler.
  const referenceData = this.enemy();

  // check if the hideLevel tag exists in the enemy's notes.
  const hideLevel = RPGManager.checkForBooleanFromNoteByRegex(referenceData, J.LEVEL.RegExp.HideLevel);

  // return whether the level should be hidden.
  return hideLevel;
};

/**
 * Gets all database sources we can get levels from.
 * @returns {RPG_BaseItem[]}
 */
Game_Enemy.prototype.getLevelSources = function()
{
  // our sources of data that a level can be retrieved from.
  return [
    ...this.states(), // all states applied to this enemy are sources.
  ];
};

/**
 * The variable level modifier for this enemy.
 * @returns {number}
 */
Game_Enemy.prototype.getLevelBalancer = function()
{
  // check if we have a variable set for the fixed balancing.
  if (J.LEVEL.Metadata.enemyBalanceVariable)
  {
    // return the adjustment from the variable value instead.
    return $gameVariables.value(J.LEVEL.Metadata.enemyBalanceVariable);
  }

  // we don't have any balancing required.
  return 0;
};
//endregion Game_Enemy

//region Game_Event
/**
 * Extends {@link Game_Event.initMembers}.<br>
 * Initializes level-related properties.
 */
J.LEVEL.Aliased.Game_Event.set('initMembers', Game_Event.prototype.initMembers);
Game_Event.prototype.initMembers = function()
{
  // perform original logic.
  J.LEVEL.Aliased.Game_Event.get('initMembers')
    .call(this);

  /**
   * The J object where all my additional properties live.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with levels.
   */
  this._j._level ||= {};

  /**
   * The cached level override value.
   * @type {number|null}
   */
  this._j._level._cachedLevelOverride = null;

  /**
   * The cached check of whether or not to hide the level in the battler's name.
   * @type {boolean|null}
   */
  this._j._level._cachedHideLevel = null;
};

/**
 * Gets the cached level override.<br>
 * If there is no override, this returns null instead.
 * @returns {number|null}
 */
Game_Event.prototype.getCachedLevelOverride = function()
{
  return this._j._level._cachedLevelOverride;
};

/**
 * Gets the cached flag for whether or not the level should be hidden.<br>
 * If there is this hasn't been parsed, this returns null instead.
 * @returns {boolean|null}
 */
Game_Event.prototype.getCachedHideLevel = function()
{
  return this._j._level._cachedHideLevel;
};

/**
 * Sets the level override as a cached value.
 * @param {number|null} level The new cached value.
 */
Game_Event.prototype.setCachedLevelOverride = function(level)
{
  this._j._level._cachedLevelOverride = level;
};

/**
 * Sets the flag for hiding the level as a cached value.
 * @param {boolean|null} hideLevel The new cached value.
 */
Game_Event.prototype.setCachedHideLevel = function(hideLevel)
{
  this._j._level._cachedHideLevel = hideLevel;
};

/**
 * Extends {@link Game_Event.refresh}.<br>
 * Clears the level override cache when the event page changes.
 */
J.LEVEL.Aliased.Game_Event.set('refresh', Game_Event.prototype.refresh);
Game_Event.prototype.refresh = function()
{
  // perform original logic.
  J.LEVEL.Aliased.Game_Event.get('refresh')
    .call(this);

  // clear the level override cache when the event page changes.
  this.clearLevelCache();
};

/**
 * Clears the cached values related to levels.
 */
Game_Event.prototype.clearLevelCache = function()
{
  // reset back to default.
  this.setCachedLevelOverride(null);
  this.setCachedHideLevel(null);
};

/**
 * Parses out the level from a list of event commands.
 * @returns {number|null} The found level, or null if not found.
 */
Game_Event.prototype.getLevelOverrides = function()
{
  // check if we have a cached value
  if (this._j._level._cachedLevelOverride !== null)
  {
    // return the cached value
    return this._j._level._cachedLevelOverride;
  }

  // default to no level override
  let level = null;

  // check all the valid event commands to see if we have a level override
  this.getValidCommentCommands()
    .forEach(command =>
    {
      // shorthand the comment into a variable
      const [ comment, ] = command.parameters;

      // check if the comment matches the regex
      const regexResult = J.LEVEL.RegExp.Level.exec(comment);

      // if the comment didn't match, then don't try to parse it
      if (!regexResult) return;

      // parse the value out of the regex capture group
      level = parseInt(regexResult[1]);
    });

  // cache the result for future use
  this._j._level._cachedLevelOverride = level;

  // return what we found
  return level;
};

/**
 * Determines if the level should be hidden for this event.
 * @returns {boolean} True if the level should be hidden, false otherwise.
 */
Game_Event.prototype.shouldHideLevel = function()
{
  // check if we have a cached value.
  if (this.getCachedHideLevel() !== null)
  {
    // return the cached value.
    return this.getCachedHideLevel();
  }

  // default to not hiding the level.
  let hideLevel = false;

  // check all the valid event commands to see if we have a hide level tag.
  this.getValidCommentCommands()
    .forEach(command =>
    {
      // shorthand the comment into a variable.
      const [ comment, ] = command.parameters;

      // check if the comment contains the hideLevel tag.
      if (J.LEVEL.RegExp.HideLevel.test(comment))
      {
        hideLevel = true;
      }
    });

  // cache the result for future use
  this.setCachedHideLevel(hideLevel);

  // return what we found
  return hideLevel;
};
//endregion Game_Event

//region Game_Party
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
//endregion Game_Party

//region Game_System
/**
 * Extends `initialize()` to include properties for this plugin.
 */
J.LEVEL.Aliased.Game_System.set('initialize', Game_System.prototype.initialize);
Game_System.prototype.initialize = function()
{
  // perform original logic.
  J.LEVEL.Aliased.Game_System.get('initialize')
    .call(this);

  /**
   * The overarching _j object, where all my stateful plugin data is stored.
   */
  this._j ||= {};

  /**
   * Whether or not the level scaling is enabled.
   * @type {boolean}
   */
  this._j._levelScalingEnabled ||= J.LEVEL.Metadata.enabled;
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

/**
 * Rebuilds the beyond max parameter data for all actors.
 */
J.LEVEL.Aliased.Game_System.set('onAfterLoad', Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function()
{
  // perform original logic.
  J.LEVEL.Aliased.Game_System.get('onAfterLoad')
    .call(this);

  // build the beyond max data.
  $gameTemp.buildBeyondMaxData();
};
//endregion Game_System

//region Game_Temp
/**
 * Intializes all additional members of this class.
 */
J.LEVEL.Aliased.Game_Temp.set('initMembers', Game_Temp.prototype.initMembers);
Game_Temp.prototype.initMembers = function()
{
  // perform original logic.
  J.LEVEL.Aliased.Game_Temp.get('initMembers')
    .call(this);

  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with this plugin.
   */
  this._j._level ||= {};

  /**
   * Whether or not the beyond max data has been cached.
   * @type {boolean}
   */
  this._j._level._hasCachedBeyondMaxData = false;

  /**
   * All the level data for beyond the max level.
   */
  this._j._level._beyondMaxData ||= {};
};

/**
 * Iterate over all actors and build the parameter data for all classes.
 */
Game_Temp.prototype.buildBeyondMaxData = function()
{
  // iterate over each class to build the extended parameter data.
  $dataClasses.forEach(dataClass =>
  {
    // the first class is always null.
    if (!dataClass) return;

    // build the data for this actor and this class.
    this.buildBeyondMaxDataForClass(dataClass.id);
  }, this);

  this.flagBeyondMaxDataAsCached();
};

/**
 * Builds the beyond max parameter data for a given class.
 * @param {number} classId The classId to build the beyond max data for.
 */
Game_Temp.prototype.buildBeyondMaxDataForClass = function(classId)
{
  // grab the parameter collections for the class.
  const classParams = $dataClasses.at(classId).params;

  // start a new array for the updated class parameters.
  const newClassParams = Array.empty;

  // iterate over each of the known base parameters to boost beyond max.
  Game_BattlerBase.knownBaseParameterIds()
    .forEach(paramId =>
    {
      // clone the class parameters.
      const parameterValues = classParams.at(paramId)
        .toSpliced(0, 0);

      // grab the final five levels to determine the average growth to continue with.
      const lastFive = parameterValues.slice(parameterValues.length - 6);
      const growth = Array.empty;
      lastFive.forEach((value, index) =>
      {
        if (index === 0) return;

        const previousValue = lastFive[index - 1];
        const difference = value - previousValue;
        growth.push(difference);
      });

      // determine the average growth rate to continue beyond level 99 with.
      const averageGrowth = growth.reduce((sum, value) => sum + value, 0) / growth.length;

      // arbitrarily evaluate ten thousand levels worth of parameters upfront.
      for (let i = 100; i < 1000; i++)
      {
        const nextParameterValue = parameterValues.at(i - 1) + averageGrowth;
        parameterValues[i] = Math.ceil(nextParameterValue);
      }

      // add the data to the running collection.
      newClassParams.push(parameterValues);
    });

  // set the data.
  this.setBeyondMaxData(classId, newClassParams);
};

/**
 * Gets the parameter collection for the class
 * @param {number} classId The classId to build the beyond max data for.
 * @returns {number[][]} The parameter collection for a given class and its parameters.
 */
Game_Temp.prototype.getBeyondMaxData = function(classId)
{
  return this._j._level._beyondMaxData[classId];
};

/**
 * Sets the parameter data for the given class.
 * @param {number} classId The classId to set the parameter data for.
 * @param {number[][]} parameterData The array of arrays of parameter values- one for each base paramId.
 */
Game_Temp.prototype.setBeyondMaxData = function(classId, parameterData)
{
  this._j._level._beyondMaxData[classId] = parameterData;
};

/**
 * Determines whether or not the beyond max data has been cached yet.
 * @returns {boolean} True if it has been cached already, false otherwise.
 */
Game_Temp.prototype.hasCachedBeyondMaxData = function()
{
  return this._j._level._hasCachedBeyondMaxData;
};

/**
 * Flags the beyond max data as having been cached.
 */
Game_Temp.prototype.flagBeyondMaxDataAsCached = function()
{
  this._j._level._hasCachedBeyondMaxData = true;
};

//region Game_Troop
/**
 * Upon defeating a troop of enemies, scales the earned experience based on
 * average actor level vs each of the enemies.
 */
J.LEVEL.Aliased.Game_Troop.set('expTotal', Game_Troop.prototype.expTotal);
Game_Troop.prototype.expTotal = function()
{
  // check if the level scaling functionality is enabled.
  if (J.LEVEL.Metadata.enabled)
  {
    // return the scaled result instead.
    return this.getScaledExpResult();
  }
  // the scaling is not enabled.
  else
  {
    // return the default logic instead.
    return J.LEVEL.Aliased.Game_Troop.get('expTotal')
      .call(this);
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
    // if the enemy is higher, then the rewards will be greater.
    // if the actor is higher, then the rewards will be lesser.
    const expFactor = LevelScaling.multiplier(averageActorLevel, currentEnemy.level);

    // multiply the factor against the experience amount to get the actual amount.
    const total = Math.round(expFactor * currentEnemy.exp());

    // add it to the running total.
    return (accumulativeExpTotal + total);
  };

  // return the rounded sum of scaled experience.
  return Math.round(deadEnemies.reduce(reducer, 0));
};
//endregion Game_Troop

//region Sprite_Character
/**
 * Gets this battler's name.
 * If there is no battler, this will return an empty string.
 * @returns {string}
 */
J.LEVEL.Aliased.Sprite_Character.set('getBattlerName', Sprite_Character.prototype.getBattlerName);
Sprite_Character.prototype.getBattlerName = function()
{
  // get the original name of the sprite.
  const originalName = J.LEVEL.Aliased.Sprite_Character.get('getBattlerName')
    .call(this);

  // if there was no battler name, then there probably isn't a battler.
  if (originalName === String.empty) return originalName;

  // grab the battler- we know it should exist by now.
  const battler = this.getBattler();

  // non-enemies don't get levels in their names.
  if (battler.isEnemy() === false) return originalName;

  // get the battler's level.
  const level = battler.level;

  // a zero level indicates there is no level logic associated with this battler.
  if (level === 0) return originalName;

  // capture the level as a string type for type-correct potential overriding.
  let levelString = `${level.padZero(3)}`;

  // check if this character is an event and if the level should be hidden
  if (this._character && this._character.isEvent() && this._character.shouldHideLevel())
  {
    levelString = "???";
  }

  // if the level is not already hidden by event comments, check the enemy notes
  if (levelString !== "???" && battler.shouldHideLevel())
  {
    levelString = "???";
  }

  // return the name with level.
  return `${levelString} ${originalName}`;
};
//endregion Sprite_Character