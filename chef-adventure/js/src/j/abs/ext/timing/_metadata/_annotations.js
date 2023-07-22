//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 TIMING] Enable modifying cooldowns/casting for actions.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-ABS
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW:
 * This plugin enables modifications for cast times and cooldowns for actions.
 *
 * Enables:
 * - NEW! added param "Fast Cooldown", for modifying cooldown times.
 * - NEW! added param "Cast Speed", for modifying cast speeds.
 *
 * This plugin requires JABS.
 * This plugin requires no plugin parameter configuration.
 * ----------------------------------------------------------------------------
 * DETAILS:
 * The new parameters of fast cooldown and cast speed are both cached to
 * minimize processing time. The cache is refreshed on the following events:
 *
 * For all battlers:
 * - a new state is added.
 * - a current state is removed.
 * For only actors:
 * - new equipment is equipped.
 * - existing equipment is unequipped.
 * - leveling up.
 * - leveling down.
 * ============================================================================
 * FAST COOLDOWN:
 * Have you ever wanted skills to have a base cooldown time, but maybe when
 * a battler has a particular state applied or equipment equipped, they now
 * have even faster cooldown times (or slower???)? Well now you can! By
 * applying the appropriate tag to various database locations, you can control
 * how fast (or slow) a battler's cooldown times are!
 *
 * DETAILS:
 * By constructing tags using the format described below, you are given access
 * to a "Formula" box that behaves similar to a "Formula" box that defines the
 * damage of a skill. None of the tags are case sensitive, but the order is
 * specific. If you find yourself having trouble building the tags, you can
 * peek at the source code of this file and search for
 * "J.ABS.EXT.TIMING.RegExp =" to find the grand master list of all
 * combinations of tags. Do note that the hard brackets of [] are required to
 * wrap the formula in the note tag.
 *
 * NOTE1:
 * If you want faster cooldowns, the formula should result in a NEGATIVE value.
 * If you want slower cooldowns, the formula should result in a POSITIVE value.
 *
 * NOTE2:
 * The minimum amount of time for cooldowns is 0 frames.
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
 *  <baseFastCooldown:[FORMULA]>
 *  <fastCooldownFlat:[FORMULA]>
 *  <fastCooldownRate:[FORMULA]>
 * Where [FORMULA] is the formula to produce the fast cooldown value.
 *
 * EXAMPLE:
 *  <baseFastCooldown:[3]>
 * Base fast cooldown will be set to +3 frames.
 *
 *  <fastCooldownFlat:[(a.level * -2)]>
 * All cooldowns are reduced by 2 frames per level.
 *
 *  <fastCooldownRate:[b * -5]>
 * All cooldowns will be reduced by 5% per point of base fast cooldown.
 * (not a practical formula, but demonstrating use)
 * ============================================================================
 * CAST SPEED:
 * Have you ever wanted skills to have a base cast speed, but maybe when
 * a battler has a particular state applied or equipment equipped, they now
 * have even faster cast times (or slower???)? Well now you can! By
 * applying the appropriate tag to various database locations, you can control
 * how fast (or slow) a battler's cast times are!
 *
 * DETAILS:
 * By constructing tags using the format described below, you are given access
 * to a "Formula" box that behaves similar to a "Formula" box that defines the
 * damage of a skill. None of the tags are case sensitive, but the order is
 * specific. If you find yourself having trouble building the tags, you can
 * peek at the source code of this file and search for
 * "J.ABS.EXT.TIMING.RegExp =" to find the grand master list of all
 * combinations of tags. Do note that the hard brackets of [] are required to
 * wrap the formula in the note tag.
 *
 * NOTE1:
 * If you want faster casting, the formula should result in a NEGATIVE value.
 * If you want slower casting, the formula should result in a POSITIVE value.
 *
 * NOTE2:
 * The minimum amount of time for casting is 0 frames.
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
 *  <baseCastSpeed:[FORMULA]>
 *  <castSpeedFlat:[FORMULA]>
 *  <castSpeedRate:[FORMULA]>
 * Where [FORMULA] is the formula to produce the fast cooldown value.
 *
 * EXAMPLE:
 *  <baseCastSpeed:[3]>
 * Base cast speed will be set to +3 frames.
 *
 *  <castSpeedFlat:[(a.level * -2)]>
 * All cast times are reduced by 2 frames per level.
 *
 *  <castSpeedRate:[b * -5]>
 * All cast times will be reduced by 5% per point of base fast cooldown.
 * (not a practical formula, but demonstrating use)
 * ==============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release.
 * ==============================================================================
 */