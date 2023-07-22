//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 DANGER] Enable danger indicators on foes on the map.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-ABS
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * This plugin enables the ability to display danger indicators on enemies
 * while on the map.
 *
 * This plugin requires JABS.
 * This plugin is plug-n-play, with minimal configuration.
 * ============================================================================
 * USAGE:
 * If you are using JABS, then JABS already knows what to do to make use of
 * this functionality. Just add this plugin after/below JABS, and it'll work
 * with no additional adjustments.
 * ============================================================================
 * @param defaultEnemyShowDangerIndicator
 * @type boolean
 * @text Show Indicator by Default
 * @desc The default for whether or not enemies' danger indicators are visible.
 * @default true
 *
 * @param dangerIndicatorIconData
 * @type struct<DangerIconsStruct>
 * @text Danger Indicator Icons
 * @desc The collection of icons to represent enemy danger levels beside their hp gauge.
 * @default {"Worthless":"880","Simple":"881","Easy":"882","Average":"883","Hard":"884","Grueling":"885","Deadly":"886"}
 */
/*~struct~DangerIconsStruct:
 * @param Worthless
 * @type number
 * @text Extremely Easy <7
 * @desc When an enemy is more 7+ levels below the player, display this icon.
 * @default 591
 *
 * @param Simple
 * @type number
 * @text Very Easy <5-6
 * @desc When an enemy is more 5-6 levels below the player, display this icon.
 * @default 583
 *
 * @param Easy
 * @type number
 * @text Easy <3-4
 * @desc When an enemy is more 3-4 levels below the player, display this icon.
 * @default 581
 *
 * @param Average
 * @type number
 * @text Normal +/- 2
 * @desc When the player and enemy are within 0-2 levels of eachother, display this icon.
 * @default 579
 *
 * @param Hard
 * @type number
 * @text Hard >3-4
 * @desc When an player is more 3-4 levels below the enemy, display this icon.
 * @default 578
 *
 * @param Grueling
 * @type number
 * @text Very Hard >5-6
 * @desc When an player is more 5-6 levels below the enemy, display this icon.
 * @default 577
 *
 * @param Deadly
 * @type number
 * @text Extremely Hard >7+
 * @desc When an player is more 7+ levels below the enemy, display this icon.
 * @default 588
*/