//region initialization
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 LEVEL] Allows levels to have greater control and purpose.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * This plugin scales various data points based on the difference between the
 * actor and enemy's levels. This also bestows a new "level" property upon
 * enemies, meaning they too can leverage their level in damage formulas for
 * skills and whatever other scripting shenanigans you want to do.
 *
 * The various data points included are damage, experience, and gold.
 * See below SAMPLE CALCULATIONS to understand how the scaling works.
 *
 * CAUTION:
 * This probably won't work with any other plugins that mess with the
 * level functionality of battlers.
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
 * NOTE:
 * The level-scaling utility has no concept of actor or enemy when performing
 * its calculations. With that in mind, be cognizant of the magic level of
 * zero. If a level ever ends up being zero, that battler will be identified
 * as a "non-level", aka level scaling won't apply and all multipliers to and
 * from that battler will be 1.0x. Level can drop below zero, though, so just
 * stay aware when doing unusual things, like trying to add a state that grants
 * bonus levels for a scaling bonus to a non-level enemy.
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
 * On actors, this would grant a +4 level modifier to their base level.
 *
 *  <level:-2>
 * On enemies, if on the enemy, it would do nothing.
 * On enemies, if on a state, and they have a base level set,
 *  this will grant a -2 modifier to their base level.
 * On actors, this will grant a -2 modifier to their base level.
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
 * Goblin is 1 levels over Gilbert.
 * There is 1 level of lower invariance.
 * The actual variance is 0 level difference.
 * Damage is not modified; 1.0x.
 *
 * Gigagoblin attacks Susan!
 * Gigagoblin is 6 levels over Susan.
 * There is 1 level of lower invariance.
 * The actual variance is +5 level difference.
 * The growth per level of difference is 0.1x.
 * Damage is increased; 1.5x for this attack.
 *
 * Ophelia attacks Gigagoblin!
 * Ophelia is 15 levels over the Gigagoblin.
 * There is 1 level of lower invariance.
 * The actual variance is +14 level difference.
 * The growth per level of difference is 0.1x.
 * The maximum multiplier is 2.0x.
 * Damage is increased; capped at 2.0x (from 2.4x).
 *
 * Frank attacks Red Slime!
 * Frank is 5 levels under the Red Slime.
 * There is 1 level of lower invariance.
 * The actual variance is -4 level difference.
 * The reduction per level of difference is -0.1x.
 * Damage is reduced; 0.6x for this attack.
 *
 * Gigagoblin attacks Ophelia!
 * Gigagoblin is 15 levels under Ophelia.
 * There is 1 level of lower invariance.
 * The actual variance is -14 level difference.
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