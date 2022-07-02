//#region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 HUD-PARTY] A HUD frame that displays your party's data.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @orderAfter J-BASE
 * @help
 * ============================================================================
 * This plugin is an extension of the J-HUD system.
 *
 * This is the Party Frame, which displays the leader and allied members that
 * the player currently has in their party.
 *
 * This includes the following data points for all actors:
 * - face portrait
 * - hp gauge
 * - mp gauge
 * - tp gauge
 *
 * And the additional following data points for the currently selected leader:
 * - current level
 * - experience gauge
 * - positive/negative state tracking
 * ============================================================================
 * @command hideHud
 * @text Hide HUD
 * @desc Hides the HUD on the map.
 *
 * @command showHud
 * @text Show HUD
 * @desc Shows the HUD on the map.
 *
 * @command hideAllies
 * @text Hide Allies
 * @desc Hides the display of allies in the hud.
 *
 * @command showAllies
 * @text Show Allies
 * @desc Shows allies' data in the hud.
 *
 * @command refreshHud
 * @text Refresh HUD
 * @desc Forcefully refreshes the hud.
 *
 * @command refreshImageCache
 * @text Refresh HUD Image Cache
 * @desc Forcefully refreshes the image cache of the hud. Use when you change face assets for actors.
 */