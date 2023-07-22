//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 CRIT] Manages critical damage multiplier/reduction of battlers.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @orderAfter J-Base
 * @orderAfter J-SDP
 * @orderAfter J-NaturalGrowths
 * @help
 * ============================================================================
 * This plugin enables the ability to control the multiplier of critical damage
 * based on a pair of tags.
 *
 * Integrates with others of mine plugins:
 * - J-SDP            (can earn CDM and CDR from panels)
 * - J-NaturalGrowths (can grow CDM and CDR via levels)
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * This overwrites the "applyCritical()" function in its entirety and replaces
 * the functionality with two new parameters on battlers: cdm and cdr, which
 * are described below. One significant difference to note is that critical hit
 * damage is calculated and managed separately, allowing for a battler's CDR
 * parameter to mitigate the critical portion entirely while still taking the
 * base damage. Additionally, the base critical damage multiplier is reduced by
 * default, and is parameterized for your convenience- because lets face it:
 * triple damage for a crit is an awful lot for the default.
 *
 * ============================================================================
 * CRITICAL DAMAGE MULTIPLIER:
 * Have you ever wanted to have any amount of control over critical damage?
 * Well now you can! By applying the appropriate tag to various database
 * locations, you can now control how hard (or weak) a battler's crit will be!
 *
 * DETAILS:
 * Four new tags are available for use across the various applicable database
 * objects: two for base values, and two for adding onto the base. While you
 * can use any of the four on any of the database locations listed below, it
 * was designed so that the "base" tags would live on static objects, like the
 * actor itself, while the non-base tags would live everywhere else.
 *
 * The two base values have greater impact when used in the context of
 * "J-NaturalGrowths", as they are a new value that can be leveraged within
 * the formulas you write, allowing for complex buff/growth formulas revolving
 * around incoming/outgoing critical hit damage.
 *
 * NOTE:
 * If multiple tags are present on a single battler, then all tag amounts will
 * be added together for a single multiplier amount as seen in the examples.
 *
 * USING "J-NATURALGROWTHS":
 * If using my "J-NaturalGrowths" plugin as well, these tags will function in
 * a near identical fashion to the "(cdm|cdr)(Buff)(Plus):[flat amount]" type
 * of tags. To spare the extra unnecessary loops, it is recommended that if
 * using the "J-NaturalGrowths" plugin as well, then to use the suggested format
 * provided by that plugin instead of this.
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
 *  <critMultiplierBase:NUM>
 *  <critMultiplier:NUM>
 * Where NUM is the amount to add to the battler's critical damage multiplier.
 *
 * TAG EXAMPLE(S):
 *  <critMultiplier:50>
 * Increases the outgoing critical damage multiplier by 50% for this battler.
 *
 *  <critMultiplier:10>
 *  <critMultiplier:40>
 *  <critMultiplier:150>
 * Increases the outgoing critical damage multiplier by 200% for this battler.
 *
 * ============================================================================
 * CRITICAL DAMAGE REDUCTION:
 * Have you ever regreted adding a ton of critical damage multipliers across
 * the various database locations and now need to counterbalance that somehow?
 * Well now you can! By applying the appropriate tag in various database
 * locations, you can now reduce the amount of damage received when an enemy
 * battler lands a critical hit!
 *
 * NOTE:
 * This reduces the amount of CRITICAL damage, and does not actually impact the
 * base damage that the critical hit is based on. See the overview details for
 * more information.
 *
 * USING "J-NATURALGROWTHS":
 * If using my "J-NaturalGrowths" plugin as well, these tags will function in
 * a near identical fashion to the "(cdm|cdr)(Buff)(Plus):[flat amount]" type
 * of tags. To spare the extra unnecessary loops, it is recommended that if
 * using the "J-NaturalGrowths" plugin as well, then to use the suggested format
 * provided by that plugin instead of this.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - Enemies
 * - States
 *
 * TAG FORMAT:
 *  <critReductionBase:NUM>
 *  <critReduction:NUM>
 * Where NUM is the amount to add to the battler's critical damage reduction.
 *
 * TAG EXAMPLE(S):
 *  <critReduction:30>
 * Reduces critical damage against this battler by 30%.
 *
 *  <critReduction:10>
 *  <critReduction:30>
 *  <critReduction:80>
 * The three amounts above total to above 100. This means that this battler
 * will NOT take any bonus damage from critical hits. All critical hits will
 * be the same as non-critical hits. However, for the sake of other possible
 * effects, the attack will still be classified as a "critical hit".
 * ============================================================================
 * NATURAL GROWTH + CRITICAL DAMAGE MULTIPLIERS/REDUCTIONS:
 * Have you ever wanted to permanently grow your CDM/CDR stats along with your
 * other growths that you have setup because you're also using my
 *
 *        J-NaturalGrowths
 *
 * plugin? Well now you can! By taking advantage of the same builder-like
 * pattern already established by the natural growths plugin, you too can start
 * growing your CDR and CDM by flat or rate multipliers as you level up!
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - Enemies
 * - States
 *
 * TAG FORMAT:
 *  <(PARAM)(BUFF|GROWTH)(PLUS|RATE):[FORMULA]>
 * Where (PARAM) is the (base/sp/ex) parameter shorthand.
 * Where (BUFF|GROWTH) is literally one of either "Buff" or "Growth".
 * Where (PLUS|RATE) is literally one of either "Plus" or "Rate".
 * Where [FORMULA] is the formula to produce the amount.
 *
 * EXAMPLE:
 *  <cdmGrowthRate:[5]>
 * Gain +5% crit damage multiplier (cdm) per level.
 * This would result in gaining an ever-increasing amount of crit damage
 * multiplier per level.
 *
 *  <cdrBuffPlus:[25]>
 * Gain a flat 25 crit damage reduction (cdr) while this tag is applied to
 * this battler.
 * This would be lost if the object this tag lived on was removed.
 *
 *  <cdmGrowthPlus:[a.level * 3]>
 * Gain (the battler's level multiplied by 3) crit damage multiplier (cdm) per
 * level.
 * This would result in gaining an ever-increasing amount of crit damage
 * multiplier per level.
 *
 * Please refer to the other plugin's documentation for more details.
 * ============================================================================
 */