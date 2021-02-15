//=============================================================================
// VisuStella MZ - Message Letter Sounds
// VisuMZ_3_MessageSounds.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_3_MessageSounds = true;

var VisuMZ = VisuMZ || {};
VisuMZ.MsgLetterSounds = VisuMZ.MsgLetterSounds || {};
VisuMZ.MsgLetterSounds.version = 1.01;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 3] [Version 1.01] [MsgLetterSounds]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Message_Letter_Sounds_VisuStella_MZ
 * @base VisuMZ_1_MessageCore
 * @orderAfter VisuMZ_1_MessageCore
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin enables your messages to play sound effects per letter (or at
 * certain intervals of letters) whenever they appear in a message window.
 * Letter sounds can be used to add emotion, character, and feeling to scenes 
 * and provide audio feedback to the activity going on in the screen.
 *
 * Features include all (but not limited to) the following:
 * 
 * * Declare which message letter sounds, their volume, pitch, and pan.
 * * Add variance to the volume, pitch, and pan to produce more speech-like
 *   behaviors.
 * * Blacklist certain letters from having any sounds played at all.
 * * Change the sounds through Plugin Commands and/or text codes to alter the
 *   feeling of a message.
 *
 * ============================================================================
 * Requirements
 * ============================================================================
 *
 * This plugin is made for RPG Maker MZ. This will not work in other iterations
 * of RPG Maker.
 *
 * ------ Required Plugin List ------
 *
 * * VisuMZ_1_MessageCore
 *
 * This plugin requires the above listed plugins to be installed inside your
 * game's Plugin Manager list in order to work. You cannot start your game with
 * this plugin enabled without the listed plugins.
 *
 * ------ Tier 3 ------
 *
 * This plugin is a Tier 3 plugin. Place it under other plugins of lower tier
 * value on your Plugin Manager list (ie: 0, 1, 2, 3, 4, 5). This is to ensure
 * that your plugins will have the best compatibility with the rest of the
 * VisuStella MZ library.
 *
 * ============================================================================
 * Extra Features
 * ============================================================================
 *
 * There are some extra features found if other VisuStella MZ plugins are found
 * present in the Plugin Manager list.
 *
 * ---
 *
 * VisuMZ_1_OptionsCore
 *
 * An added option to the Audio category of the default Options Core settings
 * allow players to turn on/off the Message Letter Sounds in case they may find
 * them to be unpleasing.
 * 
 * ---
 *
 * ============================================================================
 * Available Text Codes
 * ============================================================================
 *
 * The following are text codes that have been added through this plugin. These
 * text codes will not work with your game if the plugin is OFF or not present.
 *
 * ---
 *
 * --------------------------   -----------------------------------------------
 * Text Code                    Effect (Message Window Only)
 * --------------------------   -----------------------------------------------
 * <Letter Sound On>            Turns on the Message Letter Sounds.
 * <Letter Sound Off>           Turns off the Message letter Sounds.
 * 
 * \LetterSoundName<filename>   Changes SFX played to 'filename'. Do not use or
 *                              insert the file extension. Case sensitive.
 * \LetterSoundVolume[x]        Changes SFX volume to x value.
 * \LetterSoundPitch[x]         Changes SFX pitch to x value.
 * \LetterSoundPan[x]           Changes SFX pan to x value.
 * \LetterSoundVolumeVar[x]     Changes SFX volume variance to x value.
 * \LetterSoundPitchVar[x]      Changes SFX pitch variance to x value.
 * \LetterSoundPanVar[x]        Changes SFX pan variance to x value.
 * 
 * ---
 * 
 * For those who want to use shorter text codes:
 * 
 * ---
 * 
 * -------------   ------------------------------------------------------------
 * Text Code       Effect (Message Window Only)
 * -------------   ------------------------------------------------------------
 * 
 * \LSON           Turns on the Message Letter Sounds.
 * \LSOFF          Turns off the Message letter Sounds.
 * 
 * \LSN<filename>  Changes SFX played to 'filename'. Do not use or insert the
 *                 file extension. Case sensitive.
 * \LSV[x]         Changes SFX volume to x value.
 * \LSPI[x]        Changes SFX pitch to x value.
 * \LSPA[x]        Changes SFX pan to x value.
 * \LSVV[x]        Changes SFX volume variance to x value.
 * \LSPIV[x]       Changes SFX pitch variance to x value.
 * \LSPAV[x]       Changes SFX pan variance to x value.
 *
 * ---
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * The following are Plugin Commands that come with this plugin. They can be
 * accessed through the Plugin Command event command.
 *
 * ---
 * 
 * === Message Sound Plugin Commands ===
 * 
 * ---
 *
 * Message Sound: Change
 * - Change the settings to the Message Sound settings below.
 *
 *   Filename:
 *   - Filename of the sound effect played.
 *
 *   Interval:
 *   - Interval the sound effect from being played between how many characters?
 *
 *   Volume:
 *   - Volume of the sound effect played.
 *
 *     Variance:
 *     - When playing the sound effect, vary the volume by how much?
 *
 *   Pitch:
 *   - Pitch of the sound effect played.
 *
 *     Variance:
 *     - When playing the sound effect, vary the pitch by how much?
 *
 *   Pan:
 *   - Pan of the sound effect played.
 *
 *     Variance:
 *     - When playing the sound effect, vary the pan by how much?
 *
 * ---
 *
 * Message Sound: Reset
 * - Resets the settings to the Plugin Parameters settings.
 *
 * ---
 * 
 * === System Plugin Commands ===
 * 
 * ---
 *
 * System: Enable/Disable Letter Sounds
 * - Enables/disables Message Letter Sounds for the game.
 *
 *   Enable/Disable?:
 *   - Enables/disables Message Letter Sounds for the game.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: General Settings
 * ============================================================================
 *
 * These are the settings that determine the default settings for the letter
 * sound as well as default enabling of the sounds. There is also a blacklist
 * here to let you decide which letter characters will not play sounds.
 *
 * ---
 *
 * Enable
 * 
 *   Default Enable?:
 *   - Enable Letter Sounds by default?
 * 
 *   Blacklisted Letters:
 *   - This is a list of individual characters that are blacklisted from having
 *     sounds play.
 *
 * ---
 *
 * Default Sound Settings
 *
 *   Filename:
 *   - Filename of the sound effect played.
 *
 *   Interval:
 *   - Interval the sound effect from being played between how many characters?
 *
 *   Volume:
 *   - Volume of the sound effect played.
 *
 *     Variance:
 *     - When playing the sound effect, vary the volume by how much?
 *
 *   Pitch:
 *   - Pitch of the sound effect played.
 *
 *     Variance:
 *     - When playing the sound effect, vary the pitch by how much?
 *
 *   Pan:
 *   - Pan of the sound effect played.
 *
 *     Variance:
 *     - When playing the sound effect, vary the pan by how much?
 *
 * ---
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *
 * 1. These plugins may be used in free or commercial games provided that they
 * have been acquired through legitimate means at VisuStella.com and/or any
 * other official approved VisuStella sources. Exceptions and special
 * circumstances that may prohibit usage will be listed on VisuStella.com.
 * 
 * 2. All of the listed coders found in the Credits section of this plugin must
 * be given credit in your games or credited as a collective under the name:
 * "VisuStella".
 * 
 * 3. You may edit the source code to suit your needs, so long as you do not
 * claim the source code belongs to you. VisuStella also does not take
 * responsibility for the plugin if any changes have been made to the plugin's
 * code, nor does VisuStella take responsibility for user-provided custom code
 * used for custom control effects including advanced JavaScript notetags
 * and/or plugin parameters that allow custom JavaScript code.
 * 
 * 4. You may NOT redistribute these plugins nor take code from this plugin to
 * use as your own. These plugins and their code are only to be downloaded from
 * VisuStella.com and other official/approved VisuStella sources. A list of
 * official/approved sources can also be found on VisuStella.com.
 *
 * 5. VisuStella is not responsible for problems found in your game due to
 * unintended usage, incompatibility problems with plugins outside of the
 * VisuStella MZ library, plugin versions that aren't up to date, nor
 * responsible for the proper working of compatibility patches made by any
 * third parties. VisuStella is not responsible for errors caused by any
 * user-provided custom code used for custom control effects including advanced
 * JavaScript notetags and/or plugin parameters that allow JavaScript code.
 *
 * 6. If a compatibility patch needs to be made through a third party that is
 * unaffiliated with VisuStella that involves using code from the VisuStella MZ
 * library, contact must be made with a member from VisuStella and have it
 * approved. The patch would be placed on VisuStella.com as a free download
 * to the public. Such patches cannot be sold for monetary gain, including
 * commissions, crowdfunding, and/or donations.
 * 
 * 7. If this VisuStella MZ plugin is a paid product, all project team members
 * must purchase their own individual copies of the paid product if they are to
 * use it. Usage includes working on related game mechanics, managing related
 * code, and/or using related Plugin Commands and features. Redistribution of
 * the plugin and/or its code to other members of the team is NOT allowed
 * unless they own the plugin itself as that conflicts with Article 4.
 * 
 * 8. Any extensions and/or addendums made to this plugin's Terms of Use can be
 * found on VisuStella.com and must be followed.
 *
 * ============================================================================
 * Credits
 * ============================================================================
 * 
 * If you are using this plugin, credit the following people in your game:
 * 
 * Team VisuStella
 * * Yanfly
 * * Arisu
 * * Olivia
 * * Irina
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * 
 * Version 1.01: December 25, 2021
 * * Bug Fixes!
 * ** Empty text won't prompt a message sound effect to play. Fixed by Yanfly.
 *
 * Version 1.00: January 6, 2021
 * * Finished Plugin!
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 *
 * @ --------------------------------------------------------------------------
 *
 * @command MsgSoundChangeMessageSound
 * @text Message Sound: Change
 * @desc Change the settings to the Message Sound settings below.
 * 
 * @arg name:str
 * @text Filename
 * @parent Default
 * @type file
 * @dir audio/se/
 * @desc Filename of the sound effect played.
 * @default Cursor3
 *
 * @arg Interval:num
 * @text Interval
 * @parent name:str
 * @type number
 * @desc Interval the sound effect from being played between how many characters?
 * @default 2
 *
 * @arg volume:num
 * @text Volume
 * @parent Default
 * @type number
 * @max 100
 * @desc Volume of the sound effect played.
 * @default 90
 *
 * @arg VolVariance:num
 * @text Variance
 * @parent volume:num
 * @type number
 * @desc When playing the sound effect, vary the volume by how much?
 * @default 10
 *
 * @arg pitch:num
 * @text Pitch
 * @parent Default
 * @type number
 * @desc Pitch of the sound effect played.
 * @default 100
 *
 * @arg PitchVariance:num
 * @text Variance
 * @parent pitch:num
 * @type number
 * @desc When playing the sound effect, vary the pitch by how much?
 * @default 20
 *
 * @arg pan:num
 * @text Pan
 * @parent Default
 * @desc Pan of the sound effect played.
 * @default 0
 *
 * @arg PanVariance:num
 * @text Variance
 * @parent pan:num
 * @type number
 * @desc When playing the sound effect, vary the pan by how much?
 * @default 5
 *
 * @ --------------------------------------------------------------------------
 *
 * @command MsgSoundResetMessageSound
 * @text Message Sound: Reset
 * @desc Resets the settings to the Plugin Parameters settings.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SystemEnableMessageSounds
 * @text System: Enable/Disable Letter Sounds
 * @desc Enables/disables Message Letter Sounds for the game.
 *
 * @arg Enable:eval
 * @text Enable/Disable?
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables/disables Message Letter Sounds for the game.
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @ ==========================================================================
 * @ Plugin Parameters
 * @ ==========================================================================
 *
 * @param BreakHead
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param MessageSounds
 * @default Plugin Parameters
 *
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param Enable
 *
 * @param EnableSound:eval
 * @text Default Enable?
 * @parent Enable
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enable Letter Sounds by default?
 * @default true
 *
 * @param BlackList:arraystr
 * @text Blacklisted Letters
 * @parent Enable
 * @type string[]
 * @desc This is a list of individual characters that are blacklisted from having sounds play.
 * @default [" ","~","\"","'"]
 *
 * @param Default
 * @text Default Sound Settings
 * 
 * @param name:str
 * @text Filename
 * @parent Default
 * @type file
 * @dir audio/se/
 * @desc Filename of the sound effect played.
 * @default Cursor3
 *
 * @param Interval:num
 * @text Interval
 * @parent name:str
 * @type number
 * @desc Interval the sound effect from being played between how many characters?
 * @default 2
 *
 * @param volume:num
 * @text Volume
 * @parent Default
 * @type number
 * @max 100
 * @desc Volume of the sound effect played.
 * @default 90
 *
 * @param VolVariance:num
 * @text Variance
 * @parent volume:num
 * @type number
 * @desc When playing the sound effect, vary the volume by how much?
 * @default 10
 *
 * @param pitch:num
 * @text Pitch
 * @parent Default
 * @type number
 * @desc Pitch of the sound effect played.
 * @default 100
 *
 * @param PitchVariance:num
 * @text Variance
 * @parent pitch:num
 * @type number
 * @desc When playing the sound effect, vary the pitch by how much?
 * @default 20
 *
 * @param pan:num
 * @text Pan
 * @parent Default
 * @desc Pan of the sound effect played.
 * @default 0
 *
 * @param PanVariance:num
 * @text Variance
 * @parent pan:num
 * @type number
 * @desc When playing the sound effect, vary the pan by how much?
 * @default 5
 *
 * @param BreakEnd1
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param End Of
 * @default Plugin Parameters
 *
 * @param BreakEnd2
 * @text --------------------------
 * @default ----------------------------------
 *
 */
//=============================================================================

const _0x132a=['LETTERSOUNDVOLUME','obtainEscapeParam','ARRAYNUM','version','MsgSoundResetMessageSound','playMessageSound','setMessageSoundPitchVariance','newPage','LSPA','JSON','name','getMessageSoundPanVariance','includes','LETTERSOUNDVOLUMEVAR','setMessageSoundSfx','\x1bMsgLetterSoundOff[0]','setMessageSoundVolumeVariance','volume','preFlushTextState','initialize','match','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','VisuMZ_1_OptionsCore','parse','description','setMessageSoundInterval','pitch','initMessageSoundsSettings','LSV','playSe','return\x200','_messageSoundVolumeVariance','max','LETTERSOUNDINTERVAL','PitchVariance','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','registerCommand','LETTERSOUNDPITCH','LSPAV','processEscapeCharacter','Window_Message_preFlushTextState','Window_Message_preConvertEscapeCharacters','msgLetterSound','pan','MsgLetterSounds','obtainEscapeString','Interval','exit','call','_messageSoundSfx','LETTERSOUNDVOLUMEVARIANCE','LSI','isMessageSoundPlayed','_messageSoundPitchVariance','_messageSoundPanVariance','getMessageSoundInterval','BlackList','Game_System_initialize','getMessageSoundSfx','PanVariance','Enable','LETTERSOUNDPITCHVARIANCE','isMsgLetterSoundBlacklisted','ARRAYEVAL','LSPI','convertMessageSoundsTextCodes','format','setMessageSoundEnabled','LSPIV','Window_Message_newPage','LETTERSOUNDPAN','ARRAYSTRUCT','STR','_messageSoundInterval','STRUCT','setMessageSoundPanVariance','ARRAYSTR','LETTERSOUNDPANVAR','Window_Message_processEscapeCharacter','LETTERSOUNDPANVARIANCE','randomInt','MSGLETTERSOUNDOFF','MsgSoundChangeMessageSound','prototype','NUM','trim','_messageSoundEnable','Settings','isMessageSoundEnabled','filter','preConvertEscapeCharacters','%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.','map','LETTERSOUNDNAME','ConvertParams','parameters','EVAL','toUpperCase','replace','VolVariance','LSN'];(function(_0x85f088,_0x3a1ef3){const _0x132a29=function(_0xf98b9d){while(--_0xf98b9d){_0x85f088['push'](_0x85f088['shift']());}};_0x132a29(++_0x3a1ef3);}(_0x132a,0x10c));const _0xf98b=function(_0x85f088,_0x3a1ef3){_0x85f088=_0x85f088-0x15d;let _0x132a29=_0x132a[_0x85f088];return _0x132a29;};const _0x1ef6af=_0xf98b;var label=_0x1ef6af(0x1ac),tier=tier||0x0,dependencies=['VisuMZ_1_MessageCore'],pluginData=$plugins[_0x1ef6af(0x174)](function(_0x4c0053){const _0x27dc2d=_0x1ef6af;return _0x4c0053['status']&&_0x4c0053[_0x27dc2d(0x198)]['includes']('['+label+']');})[0x0];VisuMZ[label][_0x1ef6af(0x172)]=VisuMZ[label]['Settings']||{},VisuMZ[_0x1ef6af(0x179)]=function(_0x447523,_0x33c672){const _0x124b72=_0x1ef6af;for(const _0x1153ca in _0x33c672){if(_0x1153ca[_0x124b72(0x194)](/(.*):(.*)/i)){const _0x496731=String(RegExp['$1']),_0x79d8d4=String(RegExp['$2'])[_0x124b72(0x17c)]()[_0x124b72(0x170)]();let _0xf073dd,_0xf59fea,_0x4d22df;switch(_0x79d8d4){case _0x124b72(0x16f):_0xf073dd=_0x33c672[_0x1153ca]!==''?Number(_0x33c672[_0x1153ca]):0x0;break;case _0x124b72(0x182):_0xf59fea=_0x33c672[_0x1153ca]!==''?JSON['parse'](_0x33c672[_0x1153ca]):[],_0xf073dd=_0xf59fea[_0x124b72(0x177)](_0x10fdf9=>Number(_0x10fdf9));break;case _0x124b72(0x17b):_0xf073dd=_0x33c672[_0x1153ca]!==''?eval(_0x33c672[_0x1153ca]):null;break;case _0x124b72(0x1bf):_0xf59fea=_0x33c672[_0x1153ca]!==''?JSON['parse'](_0x33c672[_0x1153ca]):[],_0xf073dd=_0xf59fea['map'](_0x3b7bd3=>eval(_0x3b7bd3));break;case _0x124b72(0x189):_0xf073dd=_0x33c672[_0x1153ca]!==''?JSON[_0x124b72(0x197)](_0x33c672[_0x1153ca]):'';break;case'ARRAYJSON':_0xf59fea=_0x33c672[_0x1153ca]!==''?JSON['parse'](_0x33c672[_0x1153ca]):[],_0xf073dd=_0xf59fea['map'](_0xd8a106=>JSON[_0x124b72(0x197)](_0xd8a106));break;case'FUNC':_0xf073dd=_0x33c672[_0x1153ca]!==''?new Function(JSON[_0x124b72(0x197)](_0x33c672[_0x1153ca])):new Function(_0x124b72(0x19e));break;case'ARRAYFUNC':_0xf59fea=_0x33c672[_0x1153ca]!==''?JSON[_0x124b72(0x197)](_0x33c672[_0x1153ca]):[],_0xf073dd=_0xf59fea['map'](_0x3c578f=>new Function(JSON[_0x124b72(0x197)](_0x3c578f)));break;case _0x124b72(0x163):_0xf073dd=_0x33c672[_0x1153ca]!==''?String(_0x33c672[_0x1153ca]):'';break;case _0x124b72(0x167):_0xf59fea=_0x33c672[_0x1153ca]!==''?JSON[_0x124b72(0x197)](_0x33c672[_0x1153ca]):[],_0xf073dd=_0xf59fea['map'](_0x2ecf62=>String(_0x2ecf62));break;case _0x124b72(0x165):_0x4d22df=_0x33c672[_0x1153ca]!==''?JSON[_0x124b72(0x197)](_0x33c672[_0x1153ca]):{},_0xf073dd=VisuMZ[_0x124b72(0x179)]({},_0x4d22df);break;case _0x124b72(0x162):_0xf59fea=_0x33c672[_0x1153ca]!==''?JSON['parse'](_0x33c672[_0x1153ca]):[],_0xf073dd=_0xf59fea[_0x124b72(0x177)](_0x215db8=>VisuMZ['ConvertParams']({},JSON[_0x124b72(0x197)](_0x215db8)));break;default:continue;}_0x447523[_0x496731]=_0xf073dd;}}return _0x447523;},(_0xcefb8=>{const _0x290236=_0x1ef6af,_0x45a4d8=_0xcefb8[_0x290236(0x18a)];for(const _0x54f3f6 of dependencies){if(!Imported[_0x54f3f6]){alert(_0x290236(0x1a3)['format'](_0x45a4d8,_0x54f3f6)),SceneManager['exit']();break;}}const _0x312577=_0xcefb8[_0x290236(0x198)];if(_0x312577['match'](/\[Version[ ](.*?)\]/i)){const _0x11447f=Number(RegExp['$1']);_0x11447f!==VisuMZ[label][_0x290236(0x183)]&&(alert(_0x290236(0x195)[_0x290236(0x15d)](_0x45a4d8,_0x11447f)),SceneManager[_0x290236(0x1af)]());}if(_0x312577[_0x290236(0x194)](/\[Tier[ ](\d+)\]/i)){const _0x94761c=Number(RegExp['$1']);_0x94761c<tier?(alert(_0x290236(0x176)[_0x290236(0x15d)](_0x45a4d8,_0x94761c,tier)),SceneManager['exit']()):tier=Math[_0x290236(0x1a0)](_0x94761c,tier);}VisuMZ[_0x290236(0x179)](VisuMZ[label]['Settings'],_0xcefb8[_0x290236(0x17a)]);})(pluginData),PluginManager[_0x1ef6af(0x1a4)](pluginData[_0x1ef6af(0x18a)],_0x1ef6af(0x16d),_0x3ee77c=>{const _0x2c19f0=_0x1ef6af;VisuMZ[_0x2c19f0(0x179)](_0x3ee77c,_0x3ee77c);const _0x36f5cc={'name':_0x3ee77c['name'],'volume':_0x3ee77c[_0x2c19f0(0x191)],'pitch':_0x3ee77c['pitch'],'pan':_0x3ee77c[_0x2c19f0(0x1ab)]};$gameSystem[_0x2c19f0(0x18e)](_0x36f5cc),$gameSystem[_0x2c19f0(0x199)](_0x3ee77c[_0x2c19f0(0x1ae)]),$gameSystem[_0x2c19f0(0x190)](_0x3ee77c[_0x2c19f0(0x17e)]),$gameSystem[_0x2c19f0(0x186)](_0x3ee77c[_0x2c19f0(0x1a2)]),$gameSystem[_0x2c19f0(0x166)](_0x3ee77c[_0x2c19f0(0x1bb)]);}),PluginManager[_0x1ef6af(0x1a4)](pluginData['name'],_0x1ef6af(0x184),_0x4df690=>{const _0x4446b2=_0x1ef6af,_0x5cc407=$gameSystem[_0x4446b2(0x173)]();$gameSystem['initMessageSoundsSettings'](),$gameSystem[_0x4446b2(0x15e)](_0x5cc407);}),PluginManager[_0x1ef6af(0x1a4)](pluginData['name'],'SystemEnableMessageSounds',_0x954d12=>{const _0x4d35bd=_0x1ef6af;VisuMZ[_0x4d35bd(0x179)](_0x954d12,_0x954d12),$gameSystem['setMessageSoundEnabled'](_0x954d12[_0x4d35bd(0x1bc)]);}),SoundManager[_0x1ef6af(0x185)]=function(_0x501bf5){const _0x39ce90=_0x1ef6af,_0x26e60d=$gameSystem[_0x39ce90(0x1ba)]();let _0xc0193c=$gameSystem['getMessageSoundInterval'](),_0x5a64ea=$gameSystem['getMessageSoundVolumeVariance'](![]),_0x1ff6f2=$gameSystem['getMessageSoundPitchVariance'](![]),_0x192a18=$gameSystem['getMessageSoundPanVariance'](![]);return _0x26e60d[_0x39ce90(0x191)]+=_0x5a64ea,_0x26e60d['volume']=Math['max'](0x0,_0x26e60d[_0x39ce90(0x191)]),_0x26e60d[_0x39ce90(0x19a)]+=_0x1ff6f2,_0x26e60d[_0x39ce90(0x19a)]=Math[_0x39ce90(0x1a0)](0x0,_0x26e60d['pitch']),_0x26e60d['pan']+=_0x192a18,AudioManager[_0x39ce90(0x19d)](_0x26e60d),_0xc0193c;},VisuMZ[_0x1ef6af(0x1ac)][_0x1ef6af(0x1b9)]=Game_System[_0x1ef6af(0x16e)][_0x1ef6af(0x193)],Game_System['prototype'][_0x1ef6af(0x193)]=function(){const _0x41a440=_0x1ef6af;VisuMZ['MsgLetterSounds'][_0x41a440(0x1b9)][_0x41a440(0x1b0)](this),this['initMessageSoundsSettings']();},Game_System['prototype']['initMessageSoundsSettings']=function(){const _0x1344c1=_0x1ef6af,_0xa1963d=VisuMZ[_0x1344c1(0x1ac)][_0x1344c1(0x172)];this[_0x1344c1(0x1b1)]={'name':_0xa1963d[_0x1344c1(0x18a)],'volume':_0xa1963d['volume'],'pitch':_0xa1963d['pitch'],'pan':_0xa1963d['pan']},this[_0x1344c1(0x164)]=_0xa1963d['Interval'],this[_0x1344c1(0x19f)]=_0xa1963d[_0x1344c1(0x17e)],this[_0x1344c1(0x1b5)]=_0xa1963d[_0x1344c1(0x1a2)],this['_messageSoundPanVariance']=_0xa1963d['PanVariance'],this['_messageSoundEnable']=_0xa1963d['EnableSound'];},Game_System[_0x1ef6af(0x16e)][_0x1ef6af(0x173)]=function(){const _0x29fefc=_0x1ef6af;return this['_messageSoundEnable']===undefined&&this[_0x29fefc(0x19b)](),this[_0x29fefc(0x171)];},Game_System['prototype']['setMessageSoundEnabled']=function(_0x3e6bfe){const _0x15e95b=_0x1ef6af;this['_messageSoundEnable']===undefined&&this['initMessageSoundsSettings'](),this[_0x15e95b(0x171)]=_0x3e6bfe;},Game_System[_0x1ef6af(0x16e)][_0x1ef6af(0x1ba)]=function(){const _0x3101ef=_0x1ef6af;return this[_0x3101ef(0x1b1)]===undefined&&this[_0x3101ef(0x19b)](),JsonEx['makeDeepCopy'](this['_messageSoundSfx']);},Game_System[_0x1ef6af(0x16e)][_0x1ef6af(0x18e)]=function(_0x454376){const _0x36fdb1=_0x1ef6af;this[_0x36fdb1(0x1b1)]===undefined&&this[_0x36fdb1(0x19b)](),this[_0x36fdb1(0x1b1)]=_0x454376;},Game_System[_0x1ef6af(0x16e)][_0x1ef6af(0x1b7)]=function(){const _0xca319a=_0x1ef6af;return this[_0xca319a(0x164)]===undefined&&this[_0xca319a(0x19b)](),this[_0xca319a(0x164)];},Game_System[_0x1ef6af(0x16e)][_0x1ef6af(0x199)]=function(_0x2f903b){const _0x5aa7e7=_0x1ef6af;this[_0x5aa7e7(0x164)]===undefined&&this[_0x5aa7e7(0x19b)](),this['_messageSoundInterval']=_0x2f903b;},Game_System[_0x1ef6af(0x16e)]['getMessageSoundVolumeVariance']=function(_0x32c353){const _0x30f3df=_0x1ef6af;this[_0x30f3df(0x19f)]===undefined&&this[_0x30f3df(0x19b)]();if(_0x32c353)return this['_messageSoundVolumeVariance'];let _0x4157da=Math[_0x30f3df(0x16b)](this[_0x30f3df(0x19f)]*0x2);return _0x4157da-=this[_0x30f3df(0x19f)],Math[_0x30f3df(0x1a0)](0x0,_0x4157da);},Game_System[_0x1ef6af(0x16e)][_0x1ef6af(0x190)]=function(_0x478f67){const _0x2c8599=_0x1ef6af;this[_0x2c8599(0x19f)]===undefined&&this['initMessageSoundsSettings'](),this[_0x2c8599(0x19f)]=_0x478f67;},Game_System['prototype']['getMessageSoundPitchVariance']=function(_0x564ce0){const _0x1b7774=_0x1ef6af;this[_0x1b7774(0x1b5)]===undefined&&this[_0x1b7774(0x19b)]();if(_0x564ce0)return this[_0x1b7774(0x1b5)];let _0x196cdc=Math['randomInt'](this[_0x1b7774(0x1b5)]*0x2);return _0x196cdc-=this[_0x1b7774(0x1b5)],Math[_0x1b7774(0x1a0)](0x0,_0x196cdc);},Game_System[_0x1ef6af(0x16e)][_0x1ef6af(0x186)]=function(_0x5387de){const _0x5b89bf=_0x1ef6af;this[_0x5b89bf(0x1b5)]===undefined&&this[_0x5b89bf(0x19b)](),this['_messageSoundPitchVariance']=_0x5387de;},Game_System[_0x1ef6af(0x16e)][_0x1ef6af(0x18b)]=function(_0x23f015){const _0x52731f=_0x1ef6af;this['_messageSoundPanVariance']===undefined&&this[_0x52731f(0x19b)]();if(_0x23f015)return this[_0x52731f(0x1b6)];let _0x30512e=Math[_0x52731f(0x16b)](this[_0x52731f(0x1b6)]*0x2);return _0x30512e-=this[_0x52731f(0x1b6)],_0x30512e;},Game_System[_0x1ef6af(0x16e)][_0x1ef6af(0x166)]=function(_0x47d9cd){const _0x371753=_0x1ef6af;this[_0x371753(0x1b6)]===undefined&&this['initMessageSoundsSettings'](),this[_0x371753(0x1b6)]=_0x47d9cd;},VisuMZ[_0x1ef6af(0x1ac)][_0x1ef6af(0x160)]=Window_Message[_0x1ef6af(0x16e)][_0x1ef6af(0x187)],Window_Message['prototype'][_0x1ef6af(0x187)]=function(_0x613bd7){const _0x92476f=_0x1ef6af;this[_0x92476f(0x164)]=0x0,VisuMZ[_0x92476f(0x1ac)][_0x92476f(0x160)][_0x92476f(0x1b0)](this,_0x613bd7);},VisuMZ[_0x1ef6af(0x1ac)]['Window_Message_preFlushTextState']=Window_Message[_0x1ef6af(0x16e)][_0x1ef6af(0x192)],Window_Message[_0x1ef6af(0x16e)][_0x1ef6af(0x192)]=function(_0x650df9){const _0x475b19=_0x1ef6af;VisuMZ[_0x475b19(0x1ac)][_0x475b19(0x1a8)][_0x475b19(0x1b0)](this,_0x650df9),this[_0x475b19(0x185)](_0x650df9);},Window_Message['prototype'][_0x1ef6af(0x1b4)]=function(_0xc6aa81){const _0x5871b5=_0x1ef6af;if(Imported[_0x5871b5(0x196)]){if(ConfigManager&&ConfigManager[_0x5871b5(0x1aa)]!==undefined){if(!ConfigManager[_0x5871b5(0x1aa)])return![];}}if(this[_0x5871b5(0x164)]-->0x0)return![];if(!$gameSystem[_0x5871b5(0x173)]())return![];return!![];},Window_Message['prototype'][_0x1ef6af(0x185)]=function(_0x2a886d){const _0x243186=_0x1ef6af;if(!this['isMessageSoundPlayed'](_0x2a886d))return;if(this[_0x243186(0x1be)](_0x2a886d['buffer']))return;const _0x4df3cb=SoundManager['playMessageSound'](_0x2a886d);this[_0x243186(0x164)]=_0x4df3cb;},Window_Message[_0x1ef6af(0x16e)]['isMsgLetterSoundBlacklisted']=function(_0x29a236){const _0xf98867=_0x1ef6af;if(_0x29a236==='')return!![];return VisuMZ[_0xf98867(0x1ac)]['Settings'][_0xf98867(0x1b8)][_0xf98867(0x18c)](_0x29a236);},VisuMZ['MsgLetterSounds'][_0x1ef6af(0x1a9)]=Window_Message['prototype'][_0x1ef6af(0x175)],Window_Message['prototype']['preConvertEscapeCharacters']=function(_0x4060cb){const _0x464368=_0x1ef6af;return _0x4060cb=this[_0x464368(0x1c1)](_0x4060cb),VisuMZ[_0x464368(0x1ac)][_0x464368(0x1a9)]['call'](this,_0x4060cb);},Window_Message['prototype'][_0x1ef6af(0x1c1)]=function(_0x1664c9){const _0x4b789a=_0x1ef6af;return _0x1664c9=_0x1664c9[_0x4b789a(0x17d)](/\x1bLSON/gi,'\x1bMsgLetterSoundOn[0]'),_0x1664c9=_0x1664c9['replace'](/\x1bLSOFF/gi,_0x4b789a(0x18f)),_0x1664c9=_0x1664c9[_0x4b789a(0x17d)](/<(?:LETTER SOUND ON|LETTERSOUNDON)>/gi,'\x1bMsgLetterSoundOn[0]'),_0x1664c9=_0x1664c9[_0x4b789a(0x17d)](/<(?:LETTER SOUND OFF|LETTERSOUNDOFF)>/gi,_0x4b789a(0x18f)),_0x1664c9;},VisuMZ[_0x1ef6af(0x1ac)][_0x1ef6af(0x169)]=Window_Message[_0x1ef6af(0x16e)][_0x1ef6af(0x1a7)],Window_Message[_0x1ef6af(0x16e)][_0x1ef6af(0x1a7)]=function(_0x497230,_0x43dafd){const _0x394d48=_0x1ef6af;let _0x47eb26,_0x1fa7ed;switch(_0x497230){case'MSGLETTERSOUNDON':this['obtainEscapeParam'](_0x43dafd),$gameSystem[_0x394d48(0x15e)](!![]);break;case _0x394d48(0x16c):this[_0x394d48(0x181)](_0x43dafd),$gameSystem[_0x394d48(0x15e)](![]);break;case _0x394d48(0x178):case _0x394d48(0x17f):_0x1fa7ed=$gameSystem[_0x394d48(0x1ba)](),_0x1fa7ed[_0x394d48(0x18a)]=this[_0x394d48(0x1ad)](_0x43dafd),$gameSystem[_0x394d48(0x18e)](_0x1fa7ed);break;case _0x394d48(0x1a1):case _0x394d48(0x1b3):_0x47eb26=this[_0x394d48(0x181)](_0x43dafd),$gameSystem[_0x394d48(0x199)](_0x47eb26);break;case _0x394d48(0x180):case _0x394d48(0x19c):_0x47eb26=this[_0x394d48(0x181)](_0x43dafd),_0x1fa7ed=$gameSystem['getMessageSoundSfx'](),_0x1fa7ed['volume']=_0x47eb26,$gameSystem[_0x394d48(0x18e)](_0x1fa7ed);break;case _0x394d48(0x1a5):case _0x394d48(0x1c0):_0x47eb26=this[_0x394d48(0x181)](_0x43dafd),_0x1fa7ed=$gameSystem[_0x394d48(0x1ba)](),_0x1fa7ed[_0x394d48(0x19a)]=_0x47eb26,$gameSystem['setMessageSoundSfx'](_0x1fa7ed);break;case _0x394d48(0x161):case _0x394d48(0x188):_0x47eb26=this[_0x394d48(0x181)](_0x43dafd),_0x1fa7ed=$gameSystem[_0x394d48(0x1ba)](),_0x1fa7ed['pan']=_0x47eb26,$gameSystem[_0x394d48(0x18e)](_0x1fa7ed);break;case _0x394d48(0x1b2):case _0x394d48(0x18d):case'LSVV':_0x47eb26=this['obtainEscapeParam'](_0x43dafd),$gameSystem[_0x394d48(0x190)](_0x47eb26);break;case _0x394d48(0x1bd):case'LETTERSOUNDPITCHVAR':case _0x394d48(0x15f):_0x47eb26=this[_0x394d48(0x181)](_0x43dafd),$gameSystem[_0x394d48(0x186)](_0x47eb26);break;case _0x394d48(0x16a):case _0x394d48(0x168):case _0x394d48(0x1a6):_0x47eb26=this[_0x394d48(0x181)](_0x43dafd),$gameSystem['setMessageSoundPanVariance'](_0x47eb26);break;default:VisuMZ['MsgLetterSounds'][_0x394d48(0x169)][_0x394d48(0x1b0)](this,_0x497230,_0x43dafd);break;}};