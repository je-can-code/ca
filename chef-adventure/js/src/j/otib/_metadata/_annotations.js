//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 OTIB] Enables items to grant a one time item boost, permanently.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-TpGrowth
 * @help
 * ============================================================================
 * This plugin allows items to grant a permanent one time bonus when used.
 *
 * - One time item boosts affect actors independently.
 * - The effects are triggered instantly upon consuming an item.
 *
 * Use the configuration on the right to pick the items and their boost.
 *
 * NOTE: If multiple entries for a single item id exist, only the first one
 * parsed will be used.
 * ============================================================================
 *
 * @param OTIBs
 * @text Item Boost List
 * @type struct<OneTimeItemBoostStruct>[]
 * @desc A collection of all items that have these one time item boosts on them.
 * @default []
 *
*/
/*~struct~OneTimeItemBoostStruct:
 * @param itemId
 * @type item
 * @text Item
 * @desc The item being consumed that will grant these permanent one time boosts.
 * @default 1
 *
 * @param boosts
 * @type struct<OneTimeItemBoostParamStruct>[]
 * @text Parameter Boosts
 * @desc The collection of all boosts that this item grants once.
 * @default []
 */
/*~struct~OneTimeItemBoostParamStruct:
 * @param parameterId
 * @text Parameter Id
 * @desc 0-7 are core parameters, 8-17 are ex-parameters, 18-27 are sp-parameters.
 * @type number
 * @type select
 * @option Max HP
 * @value 0
 * @option Max MP
 * @value 1
 * @option Max TP
 * @value 28
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
 * @option Hit Rate
 * @value 8
 * @option Evasion Rate
 * @value 9
 * @option Crit Chance
 * @value 10
 * @option Crit Evasion
 * @value 11
 * @option Magic Evasion
 * @value 12
 * @option Magic Reflect Rate
 * @value 13
 * @option Counter Rate
 * @value 14
 * @option HP Regen
 * @value 15
 * @option MP Regen
 * @value 16
 * @option TP Regen
 * @value 17
 * @option Targeting Rate
 * @value 18
 * @option Guard Rate
 * @value 19
 * @option Recovery Rate
 * @value 20
 * @option Pharmacy Rate
 * @value 21
 * @option MP Cost Reduction
 * @value 22
 * @option TP Cost Reduction
 * @value 23
 * @option Phys DMG Reduction
 * @value 24
 * @option Magi DMG Reduction
 * @value 25
 * @option Floor DMG Reduction
 * @value 26
 * @option Experience Rate
 * @value 27
 * @default 0
 *
 * @param boost
 * @type number
 * @min -9999999
 * @text Boost Value
 * @desc The value that will be added to this parameter id.
 * If this parameter is ex/sp, then this value will be /= 100.
 * @default 0
 *
 * @param isPercent
 * @type boolean
 * @text Is Percent Boost
 * @desc If this is true, then the boost will be percent.
 * If this is false, then the boost will be flat.
 * @default false
 *
 */