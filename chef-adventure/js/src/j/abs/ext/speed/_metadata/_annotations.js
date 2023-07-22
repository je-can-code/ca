//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 MOVE] Enable modifying move speeds.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW:
 * This plugin enables modifications of movespeed for characters on the map.
 *
 * This plugin requires JABS.
 * This plugin requires no plugin parameter configuration.
 * ----------------------------------------------------------------------------
 * DETAILS:
 * The new parameter of "movement speed boost" is a calculated parameter that
 * gets cached when things change on battlers.
 * ============================================================================
 * MOVEMENT SPEED BOOST:
 * Have you ever wanted to have your battlers on the map move a little bit
 * slower or faster when afflicted with haste or wearing heavy boots, etc?
 * Well now you can! By applying the appropriate tag to various database
 * locations, you can control how fast or slow the battler's movement speed
 * is while on the map.
 *
 * NOTE1:
 * Multiple tags across multiple objects on a single battler will stack
 * additively.
 *
 * NOTE2:
 * There is no upper limit of move speed, so be careful!
 * There is a(n arbitrary) lower limit, of -90% move speed multiplier.
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
 *  <speedBoost:NUM>
 * Where NUM is the positive/negative percent modifier against base movespeed.
 *
 * EXAMPLE:
 *  <speedBoost:40>
 * This battler's movement speed will be increased by ~40%.
 *
 *  <speedBoost:-26>
 * This battler's movement speed will be decreased by ~26%.
 *
 *  <speedBoost:11>
 * This battler's movement speed will be increased by ~11%.
 *
 *  <speedBoost:70>
 *  <speedBoost:-50>
 *  <speedBoost:-10>
 *  <speedBoost:30>
 * This battler's movement speed will be increased by ~40%.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */