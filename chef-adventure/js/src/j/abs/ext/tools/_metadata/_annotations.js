//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 TOOLS] Enable new tool-like tags for use with skills.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW:
 * This plugin enables new tags that give tool-like functionality to skills.
 *
 * Enables:
 * - NEW! added "gap close" aka "hookshot" functionality.
 *
 * TODO:
 * - gloves for carrying events.
 *
 * This plugin requires JABS.
 * ============================================================================
 * GAP CLOSING:
 * Have you ever wanted to be able to use a skill and gap close to a target
 * without having to take the painstaking effort of manually moving to the
 * given target? Well now you can! By applying the appropriate tags to various
 * database locations, you can enable/disable gap closing for your battlers!
 *
 * HEADS UP:
 * There are a number of tags required to make this work, so this will deviate
 * from normal tag explanations a bit.
 *
 * TAG USAGE:
 * (primarily)
 * - Events
 * - Skills
 * - Enemies
 *
 * (secondarily)
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - States
 *
 * TAG FORMAT:
 *  <gapClose>
 * This tag is required on skills that you want to be "gap closing skills".
 *
 *  <gapCloseTarget>
 * This tag is required on the things you want to be "gap closable", such as
 * enemies or on events representing enemies. This tag can also be applied to
 * things that a battler can be affected by, such as equipment or states.
 *
 * GAP CLOSE TARGET vs PLUGIN PARAMETER "Gap Close Default":
 * The <gapCloseTarget> tag is not required if you enable flip the plugin
 * parameter of "Gap Close Default" to true. Anything you hit while that is
 * true will result in gap closing if the skill permits.
 *
 * EXAMPLE:
 *  <gapClose> on skill ID 25.
 *  <gapCloseTarget> on enemy ID 33.
 * Using skill 25 against enemy 33 will pull the player to the enemy.
 *
 *  <gapClose> on skill ID 25.
 *  <gapCloseTarget> on state ID 4.
 * An enemy afflicts the player/battler with state 4.
 * If the enemy then used skill 25 against the player with the state, they
 * would be pulled to the player.
 *
 *  <gapClose> on skill ID 25.
 *  <gapCloseTarget> on some event that is an inanimate battler.
 * Using skill 25 against the event will pull the player to the event.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 * @param canGapCloseByDefault
 * @type boolean
 * @text Gap Close Default
 * @desc True if you can gap close to anything hittable, false if only specific targets.
 * @default false
 */