//=============================================================================
// VisuStella MZ - Visual Text Windows
// VisuMZ_3_VisualTextWindows.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_3_VisualTextWindows = true;

var VisuMZ = VisuMZ || {};
VisuMZ.VisualTextWindows = VisuMZ.VisualTextWindows || {};
VisuMZ.VisualTextWindows.version = 1.00;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 3] [Version 1.00] [VisualTextWindows]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Visual_Text_Window_VisuStella_MZ
 * @base VisuMZ_1_MessageCore
 * @orderAfter VisuMZ_1_MessageCore
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * 
 * Ever wanted to create an instruction window on the screen while the player
 * is exploring or an informative window detailing what the player needs to do
 * while on certain parts of the map or during a particular phase of battle?
 *
 * This plugin grants you the ability to create a text-filled window and put it
 * on the screen without the need for a "Show Text" event. The Visual Text
 * Window will linger on the screen. It will update and/or remove itself when
 * commanded.
 *
 * Features include all (but not limited to) the following:
 * 
 * * Place an unlimited amount of custom text Visual Text Windows anywhere on
 *   the screen for the battle and map scenes.
 * * Supports text codes.
 * * Autosize the width and height of the Visual Text Windows to fit the text
 *   you've inserted into them to make them appear clean and polished.
 * * Alter and refresh them midway through gameplay when needed.
 * * Remove them instantly or wait until after they've closed on demand.
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
 * Plugin Commands
 * ============================================================================
 *
 * The following are Plugin Commands that come with this plugin. They can be
 * accessed through the Plugin Command event command.
 *
 * ---
 * 
 * === Text Window Plugin Commands ===
 * 
 * ---
 *
 * Text Window: Add/Change Settings
 * - Adds a newly created visual text window to the scene.
 * - Or changes an existing one with new settings.
 * 
 *   Required:
 *
 *     ID:
 *     - What is the ID of this Visual Text Window to be added/changed?
 *
 *     Text:
 *     - What text would you like to display here?
 *     - Text codes can be used.
 *
 *     Customized Settings:
 * 
 *       Coordinates:
 *
 *         X:
 *         Y:
 *         - What is the X/Y coordinates of this window?
 *         - You may use JavaScript code.
 *
 *         Width:
 *         Height:
 *         - What is the width/height of this window?
 *         - You may use JavaScript code. Type 'auto' to auto-size it.
 * 
 *       Alignment:
 *
 *         Horizontal:
 *         - Window alignment based on the X coordinate?
 *         - This is NOT text alignment.
 *           - left
 *           - center
 *           - right
 *
 *         Vertical:
 *         - Window alignment based on the Y coordinate?
 *         - This is NOT text alignment.
 *           - top
 *           - middle
 *           - bottom
 * 
 *       Appear:
 *
 *         Type:
 *         - How does this window appear on the screen if it was closed before?
 *           - Instant - Window appears instantly
 *           - Open - Window opens up
 * 
 *       Background:
 *
 *         Type:
 *         - Select background type for this window.
 *           - Window
 *           - Dim
 *           - Transparent
 *
 *         Opacity:
 *         - What is this window's background opacity level?
 *         - You may use JavaScript code.
 *
 * ---
 *
 * Text Window: Refresh
 * - Refreshes target Visual Text Window(s) on the screen.
 *
 *   ID(s):
 *   - Refresh which Visual Text Window(s)?
 *
 * ---
 *
 * Text Window: Remove
 * - Remove target Visual Text Window(s) and its settings.
 *
 *   ID(s):
 *   - Remove which Visual Text Window(s)?
 *
 *   Removal Type:
 *   - How does this window disappear from the screen upon removal?
 *     - Instant - Window disappears instantly
 *     - Close - Window closes, then removes itself
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: General Settings
 * ============================================================================
 *
 * There is only one Plugin Parameter setting for this plugin. The Layer
 * Position plugin parameter determines whether the Visual Text Windows appear
 * below the main scene's windows or above them.
 * 
 * The recommended setting is to have them appear below the main scene's
 * windows as to not obscure any important information.
 * 
 * If you decide to change them to the above position, be wary of how you
 * position your Visual Text Windows.
 *
 * ---
 *
 * Settings
 * 
 *   Layer Position:
 *   - Position the Visual Text Window layer above the scene's main windows or
 *     below them?
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
 * Version 1.00 Official Release Date: March 3, 2021
 * * Finished Plugin!
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 *
 * @ --------------------------------------------------------------------------
 *
 * @command AddChangeVisualTextWindow
 * @text Text Window: Add/Change Settings
 * @desc Adds a newly created visual text window to the scene.
 * Or changes an existing one with new settings.
 * 
 * @arm Required
 *
 * @arg id:num
 * @text ID
 * @parent Required
 * @type number
 * @min 1
 * @desc What is the ID of this Visual Text Window to be added/changed?
 * @default 1
 *
 * @arg text:json
 * @text Text
 * @parent Required
 * @type note
 * @desc What text would you like to display here?
 * Text codes can be used.
 * @default "Hello World"
 *
 * @arg Customize:struct
 * @text Customized Settings
 * @type struct<Customize>
 * @desc Customized settings regarding this Visual Text Window.
 * @default {"Coordinates":"","x:str":"0","y:str":"0","width:str":"auto","height:str":"auto","Alignment":"","alignX:str":"left","alignY:str":"top","Appear":"","appearType:str":"open","Background":"","bgType:num":"0","opacity:eval":"192"}
 *
 * @ --------------------------------------------------------------------------
 *
 * @command RefreshVisualTextWindow
 * @text Text Window: Refresh
 * @desc Refreshes target Visual Text Window(s) on the screen.
 *
 * @arg list:arraynum
 * @text ID(s)
 * @type number[]
 * @min 1
 * @desc Refresh which Visual Text Window(s)?
 * @default ["1"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command RemoveVisualTextWindow
 * @text Text Window: Remove
 * @desc Remove target Visual Text Window(s) and its settings.
 *
 * @arg list:arraynum
 * @text ID(s)
 * @type number[]
 * @min 1
 * @desc Remove which Visual Text Window(s)?
 * @default ["1"]
 *
 * @arg closeType:str
 * @text Removal Type
 * @type select
 * @option Instant - Window disappears instantly
 * @value instant
 * @option Close - Window closes, then removes itself
 * @value close
 * @desc How does this window disappear from the screen upon removal?
 * @default close
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
 * @param VisualTextWindows
 * @default Plugin Parameters
 *
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param VisualTextLayerPosition:str
 * @text Layer Position
 * @type select
 * @option above
 * @option below
 * @desc Position the Visual Text Window layer above the
 * scene's main windows or below them?
 * @default below
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
/* ----------------------------------------------------------------------------
 * Customized Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Customize:
 * 
 * @param Coordinates
 *
 * @param x:str
 * @text X
 * @parent Coordinates
 * @desc What is the X coordinate of this window?
 * You may use JavaScript code.
 * @default 0
 *
 * @param y:str
 * @text Y
 * @parent Coordinates
 * @desc What is the Y coordinate of this window?
 * You may use JavaScript code.
 * @default 0
 *
 * @param width:str
 * @text Width
 * @parent Coordinates
 * @desc What is the width of this window? You may use JavaScript code. Type 'auto' to auto-size its width.
 * @default auto
 *
 * @param height:str
 * @text Height
 * @parent Coordinates
 * @desc What is the height of this window? You may use JavaScript code. Type 'auto' to auto-size its height.
 * @default auto
 * 
 * @param Alignment
 *
 * @param alignX:str
 * @text Horizontal
 * @parent Alignment
 * @type combo
 * @option left
 * @option center
 * @option right
 * @desc Window alignment based on the X coordinate?
 * This is NOT text alignment.
 * @default left
 *
 * @param alignY:str
 * @text Vertical
 * @parent Alignment
 * @type combo
 * @option top
 * @option middle
 * @option bottom
 * @desc Window alignment based on the Y coordinate?
 * This is NOT text alignment.
 * @default top
 * 
 * @param Appear
 *
 * @param appearType:str
 * @text Type
 * @parent Appear
 * @type select
 * @option Instant - Window appears instantly
 * @value instant
 * @option Open - Window opens up
 * @value open
 * @desc How does this window appear on the screen if it was closed before?
 * @default open
 * 
 * @param Background
 *
 * @param bgType:num
 * @text Type
 * @parent Background
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for this window.
 * @default 0
 *
 * @param opacity:eval
 * @text Opacity
 * @parent Background
 * @desc What is this window's background opacity level?
 * You may use JavaScript code.
 * @default 192
 *
 */
//=============================================================================

const _0x1c4b=['left','fillRect','instant','_visualTextWindowCalc','getAllVisualTextWindowSettings','NUM','1007265JXFici','ARRAYSTRUCT','ARRAYEVAL','create','VisualTextWindows','Customize','EVAL','534955YbGCfT','addChild','getVisualTextWindowSettingForID','bottom','initVisualTextWindowsMainMenu','initialize','parameters','createContents','_visualTextWindowContainer','updateNewVisualTextWindow','setFrame','alertVisualTextWordWrapAuto','auto','564103FankaU','below','ARRAYNUM','textSizeEx','middle','sortVisualTextWindows','drawTextEx','settings','completeRemoval','status','isPlaytest','calcWindowRect','appearType','12QZWvEO','isClosing','selfRemoval','alignY','_dimmerSprite','removeVisualTextWindows','isSceneMap','removeVisualTextWindow','RemoveVisualTextWindow','Scene_Base_createWindowLayer','setBackgroundType','createWindowLayer','itemPadding','center','_closing','return\x200','removeChild','437iWbFaT','toLowerCase','refresh','exit','setVisualTextWindowSettingForID','_id','9013NlMIsI','description','AddChangeVisualTextWindow','trim','open','filter','windowPadding','children','dimColor1','format','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','alignX','999204SlpHdw','VisuMZ_1_MessageCore','STR','ARRAYJSON','isClosed','Settings','calcAutoTextSize','openness','canShowVisualTextWindows','2903MePdhX','height','name','parse','_visualTextWindows','match','sort','_scene','createVisualTextWindow','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','constructor','TemplateSettings','VisualTextLayerPosition','list','makeDeepCopy','2oyhytS','JSON','updateBackgroundDimmer','WARNING:\x20Wordwrap\x20does\x20not\x20work\x20with\x20Visual\x20Text\x20Window\x20autosize!','prototype','width','closeType','version','close','includes','map','registerCommand','parent','text','createVisualTextWindowLayer','ConvertParams','ARRAYFUNC','round','isSceneBattle','battle','fittingHeight','innerWidth','updateSettings','toUpperCase','FUNC','Game_System_initialize','updateClose','refreshDimmerBitmap','createVisualTextWindows','892642wCjqFk','opacity','_visualTextWindowLayer','bgType','resetWordWrap'];const _0xec8e=function(_0x17181e,_0x10a131){_0x17181e=_0x17181e-0xa1;let _0x1c4bae=_0x1c4b[_0x17181e];return _0x1c4bae;};const _0x4fd7e0=_0xec8e;(function(_0x7d33d0,_0x4a180a){const _0x5a4424=_0xec8e;while(!![]){try{const _0x1bcfc6=-parseInt(_0x5a4424(0xd8))+-parseInt(_0x5a4424(0xa1))*-parseInt(_0x5a4424(0x10a))+parseInt(_0x5a4424(0xcd))+-parseInt(_0x5a4424(0x11c))+-parseInt(_0x5a4424(0xf9))*parseInt(_0x5a4424(0x110))+-parseInt(_0x5a4424(0xdf))+parseInt(_0x5a4424(0xb0))*parseInt(_0x5a4424(0xec));if(_0x1bcfc6===_0x4a180a)break;else _0x7d33d0['push'](_0x7d33d0['shift']());}catch(_0x1a93ca){_0x7d33d0['push'](_0x7d33d0['shift']());}}}(_0x1c4b,0x9c387));var label=_0x4fd7e0(0xdc),tier=tier||0x0,dependencies=[_0x4fd7e0(0x11d)],pluginData=$plugins['filter'](function(_0x1ec714){const _0x3aa539=_0x4fd7e0;return _0x1ec714[_0x3aa539(0xf5)]&&_0x1ec714[_0x3aa539(0x111)][_0x3aa539(0xb9)]('['+label+']');})[0x0];VisuMZ[label]['Settings']=VisuMZ[label][_0x4fd7e0(0x121)]||{},VisuMZ['ConvertParams']=function(_0x19bc73,_0x470396){const _0x533dfd=_0x4fd7e0;for(const _0x47aa75 in _0x470396){if(_0x47aa75[_0x533dfd(0xa6)](/(.*):(.*)/i)){const _0x5df141=String(RegExp['$1']),_0x4a94fd=String(RegExp['$2'])[_0x533dfd(0xc7)]()['trim']();let _0x278cf7,_0x3083bb,_0x29e992;switch(_0x4a94fd){case _0x533dfd(0xd7):_0x278cf7=_0x470396[_0x47aa75]!==''?Number(_0x470396[_0x47aa75]):0x0;break;case _0x533dfd(0xee):_0x3083bb=_0x470396[_0x47aa75]!==''?JSON[_0x533dfd(0xa4)](_0x470396[_0x47aa75]):[],_0x278cf7=_0x3083bb[_0x533dfd(0xba)](_0x56d613=>Number(_0x56d613));break;case _0x533dfd(0xde):_0x278cf7=_0x470396[_0x47aa75]!==''?eval(_0x470396[_0x47aa75]):null;break;case _0x533dfd(0xda):_0x3083bb=_0x470396[_0x47aa75]!==''?JSON[_0x533dfd(0xa4)](_0x470396[_0x47aa75]):[],_0x278cf7=_0x3083bb[_0x533dfd(0xba)](_0x198948=>eval(_0x198948));break;case _0x533dfd(0xb1):_0x278cf7=_0x470396[_0x47aa75]!==''?JSON[_0x533dfd(0xa4)](_0x470396[_0x47aa75]):'';break;case _0x533dfd(0x11f):_0x3083bb=_0x470396[_0x47aa75]!==''?JSON['parse'](_0x470396[_0x47aa75]):[],_0x278cf7=_0x3083bb[_0x533dfd(0xba)](_0x1c6cee=>JSON[_0x533dfd(0xa4)](_0x1c6cee));break;case _0x533dfd(0xc8):_0x278cf7=_0x470396[_0x47aa75]!==''?new Function(JSON[_0x533dfd(0xa4)](_0x470396[_0x47aa75])):new Function(_0x533dfd(0x108));break;case _0x533dfd(0xc0):_0x3083bb=_0x470396[_0x47aa75]!==''?JSON[_0x533dfd(0xa4)](_0x470396[_0x47aa75]):[],_0x278cf7=_0x3083bb['map'](_0x1fd24c=>new Function(JSON[_0x533dfd(0xa4)](_0x1fd24c)));break;case _0x533dfd(0x11e):_0x278cf7=_0x470396[_0x47aa75]!==''?String(_0x470396[_0x47aa75]):'';break;case'ARRAYSTR':_0x3083bb=_0x470396[_0x47aa75]!==''?JSON[_0x533dfd(0xa4)](_0x470396[_0x47aa75]):[],_0x278cf7=_0x3083bb[_0x533dfd(0xba)](_0x958e4e=>String(_0x958e4e));break;case'STRUCT':_0x29e992=_0x470396[_0x47aa75]!==''?JSON[_0x533dfd(0xa4)](_0x470396[_0x47aa75]):{},_0x278cf7=VisuMZ[_0x533dfd(0xbf)]({},_0x29e992);break;case _0x533dfd(0xd9):_0x3083bb=_0x470396[_0x47aa75]!==''?JSON[_0x533dfd(0xa4)](_0x470396[_0x47aa75]):[],_0x278cf7=_0x3083bb[_0x533dfd(0xba)](_0x24c1a4=>VisuMZ[_0x533dfd(0xbf)]({},JSON[_0x533dfd(0xa4)](_0x24c1a4)));break;default:continue;}_0x19bc73[_0x5df141]=_0x278cf7;}}return _0x19bc73;},(_0x42db5f=>{const _0x348464=_0x4fd7e0,_0x4c6775=_0x42db5f[_0x348464(0xa3)];for(const _0x45e08b of dependencies){if(!Imported[_0x45e08b]){alert(_0x348464(0x11a)[_0x348464(0x119)](_0x4c6775,_0x45e08b)),SceneManager[_0x348464(0x10d)]();break;}}const _0x4e84c5=_0x42db5f[_0x348464(0x111)];if(_0x4e84c5[_0x348464(0xa6)](/\[Version[ ](.*?)\]/i)){const _0x5484e5=Number(RegExp['$1']);_0x5484e5!==VisuMZ[label][_0x348464(0xb7)]&&(alert(_0x348464(0xaa)[_0x348464(0x119)](_0x4c6775,_0x5484e5)),SceneManager[_0x348464(0x10d)]());}if(_0x4e84c5['match'](/\[Tier[ ](\d+)\]/i)){const _0x2cedc6=Number(RegExp['$1']);_0x2cedc6<tier?(alert('%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.'['format'](_0x4c6775,_0x2cedc6,tier)),SceneManager[_0x348464(0x10d)]()):tier=Math['max'](_0x2cedc6,tier);}VisuMZ['ConvertParams'](VisuMZ[label]['Settings'],_0x42db5f[_0x348464(0xe5)]);})(pluginData),VisuMZ['VisualTextWindows'][_0x4fd7e0(0xac)]=function(){const _0x219081=_0x4fd7e0;return{'id':0x0,'text':'','x':'0','y':'0','width':_0x219081(0xeb),'height':'auto','alignX':_0x219081(0xd2),'alignY':'top','appearType':_0x219081(0x114),'bgType':0x0,'opacity':0xc0};},PluginManager[_0x4fd7e0(0xbb)](pluginData[_0x4fd7e0(0xa3)],_0x4fd7e0(0x112),_0x3219a0=>{const _0x1036be=_0x4fd7e0;VisuMZ['ConvertParams'](_0x3219a0,_0x3219a0);if(_0x3219a0['id']<=0x0)return;let _0x521fc9=JsonEx[_0x1036be(0xaf)](_0x3219a0[_0x1036be(0xdd)]);if(!_0x521fc9['hasOwnProperty'](_0x1036be(0xb5)))_0x521fc9=VisuMZ[_0x1036be(0xdc)][_0x1036be(0xac)]();_0x521fc9['id']=_0x3219a0['id'],_0x521fc9['text']=_0x3219a0['text'],$gameSystem[_0x1036be(0x10e)](_0x521fc9);}),PluginManager[_0x4fd7e0(0xbb)](pluginData[_0x4fd7e0(0xa3)],'RefreshVisualTextWindow',_0x49666d=>{const _0x1eccda=_0x4fd7e0;VisuMZ[_0x1eccda(0xbf)](_0x49666d,_0x49666d);const _0x1ea7c2=_0x49666d[_0x1eccda(0xae)]||[];SceneManager[_0x1eccda(0xa8)]['refreshVisualTextWindows']&&SceneManager[_0x1eccda(0xa8)]['refreshVisualTextWindows'](_0x1ea7c2);}),PluginManager[_0x4fd7e0(0xbb)](pluginData[_0x4fd7e0(0xa3)],_0x4fd7e0(0x101),_0x5361de=>{const _0x5cc2a4=_0x4fd7e0;VisuMZ[_0x5cc2a4(0xbf)](_0x5361de,_0x5361de);const _0x47ab42=_0x5361de[_0x5cc2a4(0xae)]||[],_0x5346e7=_0x5361de[_0x5cc2a4(0xb6)];for(const _0x288f65 of _0x47ab42){$gameSystem[_0x5cc2a4(0x100)](_0x288f65);}SceneManager['_scene'][_0x5cc2a4(0xfe)]&&SceneManager['_scene'][_0x5cc2a4(0xfe)](_0x47ab42,_0x5346e7);}),SceneManager[_0x4fd7e0(0xc2)]=function(){const _0x32aaf4=_0x4fd7e0;return this[_0x32aaf4(0xa8)]&&this[_0x32aaf4(0xa8)][_0x32aaf4(0xab)]===Scene_Battle;},SceneManager[_0x4fd7e0(0xff)]=function(){const _0x2440b9=_0x4fd7e0;return this[_0x2440b9(0xa8)]&&this[_0x2440b9(0xa8)][_0x2440b9(0xab)]===Scene_Map;},VisuMZ[_0x4fd7e0(0xdc)][_0x4fd7e0(0xc9)]=Game_System['prototype'][_0x4fd7e0(0xe4)],Game_System[_0x4fd7e0(0xb4)][_0x4fd7e0(0xe4)]=function(){const _0x37e623=_0x4fd7e0;VisuMZ[_0x37e623(0xdc)][_0x37e623(0xc9)]['call'](this),this[_0x37e623(0xe3)]();},Game_System[_0x4fd7e0(0xb4)][_0x4fd7e0(0xe3)]=function(){const _0x24ad45=_0x4fd7e0;this[_0x24ad45(0xa5)]={'battle':[null],'map':[null]};},Game_System[_0x4fd7e0(0xb4)][_0x4fd7e0(0xd6)]=function(){const _0x2372be=_0x4fd7e0;this[_0x2372be(0xa5)]===undefined&&this[_0x2372be(0xe3)]();if(SceneManager['isSceneBattle']())return this['_visualTextWindows'][_0x2372be(0xc3)][_0x2372be(0x115)](_0x4e77c6=>!!_0x4e77c6);else return SceneManager['isSceneMap']()?this[_0x2372be(0xa5)]['map']['filter'](_0xeb51d4=>!!_0xeb51d4):[];},Game_System[_0x4fd7e0(0xb4)][_0x4fd7e0(0xe1)]=function(_0x406eff){const _0x26217c=_0x4fd7e0;this['_visualTextWindows']===undefined&&this[_0x26217c(0xe3)]();if(SceneManager[_0x26217c(0xc2)]())return this[_0x26217c(0xa5)][_0x26217c(0xc3)][_0x406eff];else return SceneManager[_0x26217c(0xff)]()?this[_0x26217c(0xa5)][_0x26217c(0xba)][_0x406eff]:null;},Game_System[_0x4fd7e0(0xb4)]['setVisualTextWindowSettingForID']=function(_0x3ecae4){const _0xd4250d=_0x4fd7e0;this[_0xd4250d(0xa5)]===undefined&&this[_0xd4250d(0xe3)]();if(!_0x3ecae4['id'])return;if(_0x3ecae4['id']<=0x0)return;const _0x1cd20f=_0x3ecae4['id'];if(SceneManager[_0xd4250d(0xc2)]())this[_0xd4250d(0xa5)][_0xd4250d(0xc3)][_0x1cd20f]=_0x3ecae4;else SceneManager[_0xd4250d(0xff)]()&&(this[_0xd4250d(0xa5)]['map'][_0x1cd20f]=_0x3ecae4);const _0x485eee=SceneManager[_0xd4250d(0xa8)];_0x485eee&&_0x485eee[_0xd4250d(0x124)]()&&_0x485eee[_0xd4250d(0xe8)](_0x1cd20f);},Game_System[_0x4fd7e0(0xb4)]['removeVisualTextWindow']=function(_0x12600a){const _0x29112b=_0x4fd7e0;this['_visualTextWindows']===undefined&&this[_0x29112b(0xe3)]();if(_0x12600a<=0x0)return;if(SceneManager[_0x29112b(0xc2)]())delete this[_0x29112b(0xa5)][_0x29112b(0xc3)][_0x12600a];else SceneManager[_0x29112b(0xff)]()&&delete this[_0x29112b(0xa5)]['map'][_0x12600a];},VisuMZ[_0x4fd7e0(0xdc)][_0x4fd7e0(0x102)]=Scene_Base['prototype'][_0x4fd7e0(0x104)],Scene_Base['prototype'][_0x4fd7e0(0x104)]=function(){const _0x162347=_0x4fd7e0,_0x158b6e=VisuMZ[_0x162347(0xdc)][_0x162347(0x121)][_0x162347(0xad)];if(_0x158b6e===_0x162347(0xed))this[_0x162347(0xbe)]();VisuMZ[_0x162347(0xdc)][_0x162347(0x102)]['call'](this);if(_0x158b6e==='above')this[_0x162347(0xbe)]();},Scene_Base['prototype']['createVisualTextWindowLayer']=function(){},Scene_Base[_0x4fd7e0(0xb4)]['canShowVisualTextWindows']=function(){return![];},Scene_Message['prototype'][_0x4fd7e0(0xbe)]=function(){const _0x36a69e=_0x4fd7e0;Scene_Base['prototype'][_0x36a69e(0xbe)]['call'](this);const _0x380fc9=new Rectangle(0x0,0x0,0x0,0x0);this[_0x36a69e(0xd5)]=new Window_Base(_0x380fc9),this[_0x36a69e(0xe7)]=[],this['_visualTextWindowLayer']=new Sprite(),this['addChild'](this[_0x36a69e(0xcf)]),this[_0x36a69e(0xcc)](),this[_0x36a69e(0xf1)]();},Scene_Message['prototype']['canShowVisualTextWindows']=function(){return!![];},Scene_Message[_0x4fd7e0(0xb4)]['createVisualTextWindows']=function(){const _0x48bdd7=$gameSystem['getAllVisualTextWindowSettings']();for(const _0x18b65b of _0x48bdd7){if(!_0x18b65b)continue;this['createVisualTextWindow'](_0x18b65b['id']);}},Scene_Message[_0x4fd7e0(0xb4)][_0x4fd7e0(0xa9)]=function(_0x305d54){const _0x3fed7b=_0x4fd7e0,_0x4c8285=new Window_VisualText(_0x305d54);this[_0x3fed7b(0xcf)][_0x3fed7b(0xe0)](_0x4c8285),this[_0x3fed7b(0xe7)][_0x305d54]=_0x4c8285;},Scene_Message['prototype']['sortVisualTextWindows']=function(){const _0x10a8ac=_0x4fd7e0;this['_visualTextWindowLayer'][_0x10a8ac(0x117)][_0x10a8ac(0xa7)]((_0x109856,_0x15af35)=>_0x109856[_0x10a8ac(0x10f)]-_0x15af35[_0x10a8ac(0x10f)]);},Scene_Message[_0x4fd7e0(0xb4)][_0x4fd7e0(0xe8)]=function(_0x27b621){const _0x17a0bc=_0x4fd7e0;this[_0x17a0bc(0xe7)][_0x27b621]?this[_0x17a0bc(0xe7)][_0x27b621][_0x17a0bc(0xc6)]():(this[_0x17a0bc(0xa9)](_0x27b621),this[_0x17a0bc(0xf1)]());},Scene_Message[_0x4fd7e0(0xb4)]['refreshVisualTextWindows']=function(_0x522613){const _0x4ade9f=_0x4fd7e0;for(const _0x2d31d6 of _0x522613){const _0x323f62=this[_0x4ade9f(0xe7)][_0x2d31d6];_0x323f62&&_0x323f62[_0x4ade9f(0xc6)]();}},Scene_Message[_0x4fd7e0(0xb4)][_0x4fd7e0(0xfe)]=function(_0x4723eb,_0x2a4c01){const _0x4be3d3=_0x4fd7e0;for(const _0x4ba396 of _0x4723eb){const _0x195f2f=this[_0x4be3d3(0xe7)][_0x4ba396];_0x195f2f&&(_0x195f2f[_0x4be3d3(0xfb)](_0x2a4c01),delete this[_0x4be3d3(0xe7)][_0x4ba396]);}};function Window_VisualText(){const _0x5047f3=_0x4fd7e0;this[_0x5047f3(0xe4)](...arguments);}Window_VisualText['prototype']=Object[_0x4fd7e0(0xdb)](Window_Base[_0x4fd7e0(0xb4)]),Window_VisualText[_0x4fd7e0(0xb4)][_0x4fd7e0(0xab)]=Window_VisualText,Window_VisualText[_0x4fd7e0(0xb4)][_0x4fd7e0(0xe4)]=function(_0x46fc60){const _0xb937f5=_0x4fd7e0;this['_id']=_0x46fc60,Window_Base[_0xb937f5(0xb4)][_0xb937f5(0xe4)]['call'](this,new Rectangle(0x0,0x0,0x0,0x0)),this[_0xb937f5(0x123)]=0x0,this[_0xb937f5(0xc6)]();},Window_VisualText[_0x4fd7e0(0xb4)][_0x4fd7e0(0xf3)]=function(){const _0x2967a9=_0x4fd7e0;return $gameSystem[_0x2967a9(0xe1)](this['_id']);},Window_VisualText['prototype']['calcWindowHeight']=function(_0xe17cd8,_0x2dff39){const _0x52730d=_0x4fd7e0;return _0x2dff39?Window_Selectable['prototype']['fittingHeight'](_0xe17cd8):Window_Base[_0x52730d(0xb4)][_0x52730d(0xc4)](_0xe17cd8);},Window_VisualText[_0x4fd7e0(0xb4)][_0x4fd7e0(0xf7)]=function(){const _0x580df6=_0x4fd7e0,_0xc921a1=JsonEx[_0x580df6(0xaf)](this[_0x580df6(0xf3)]()),_0x42e365=_0xc921a1['text'][_0x580df6(0xa6)](/<WORDWRAP>/i),_0x21e2ab=this[_0x580df6(0x122)]();let _0x47775c=0x0,_0x13d199=0x0,_0x630210=0x0,_0x2d88c3=0x0;_0xc921a1[_0x580df6(0xb5)]['toLowerCase']()[_0x580df6(0x113)]()===_0x580df6(0xeb)?(_0x630210=_0x42e365?Graphics[_0x580df6(0xb5)]:_0x21e2ab[_0x580df6(0xb5)],_0x42e365&&!$gameTemp[_0x580df6(0xea)]&&($gameTemp['alertVisualTextWordWrapAuto']=!![],$gameTemp[_0x580df6(0xf6)]()&&alert(_0x580df6(0xb3)))):_0x630210=eval(_0xc921a1[_0x580df6(0xb5)]);_0xc921a1['height'][_0x580df6(0x10b)]()[_0x580df6(0x113)]()===_0x580df6(0xeb)?(_0x2d88c3=_0x42e365?Graphics[_0x580df6(0xa2)]:_0x21e2ab['height'],_0x42e365&&!$gameTemp[_0x580df6(0xea)]&&($gameTemp[_0x580df6(0xea)]=!![],$gameTemp[_0x580df6(0xf6)]()&&alert(_0x580df6(0xb3)))):_0x2d88c3=eval(_0xc921a1['height']);_0x47775c=Math['round'](eval(_0xc921a1['x'])||0x0),_0x13d199=Math[_0x580df6(0xc1)](eval(_0xc921a1['y'])||0x0),_0x630210=Math[_0x580df6(0xc1)](_0x630210||0x0),_0x2d88c3=Math[_0x580df6(0xc1)](_0x2d88c3||0x0);if(_0xc921a1[_0x580df6(0x11b)]===_0x580df6(0x106))_0x47775c-=Math[_0x580df6(0xc1)](_0x630210/0x2);else _0xc921a1[_0x580df6(0x11b)]==='right'&&(_0x47775c-=_0x630210);if(_0xc921a1['alignY']===_0x580df6(0xf0))_0x13d199-=Math[_0x580df6(0xc1)](_0x2d88c3/0x2);else _0xc921a1[_0x580df6(0xfc)]===_0x580df6(0xe2)&&(_0x13d199-=_0x2d88c3);const _0x4b2b0d=new Rectangle(_0x47775c,_0x13d199,_0x630210,_0x2d88c3);return _0x4b2b0d;},Window_VisualText[_0x4fd7e0(0xb4)]['calcAutoTextSize']=function(){const _0x5d17d4=_0x4fd7e0,_0x4541a9=SceneManager[_0x5d17d4(0xa8)]['_visualTextWindowCalc'];_0x4541a9[_0x5d17d4(0xd1)]();const _0x3fabb5=JsonEx[_0x5d17d4(0xaf)](this[_0x5d17d4(0xf3)]()),_0x1ea4d4=_0x4541a9[_0x5d17d4(0xef)](_0x3fabb5[_0x5d17d4(0xbd)][_0x5d17d4(0x113)]());return _0x1ea4d4[_0x5d17d4(0xb5)]+=(this['itemPadding']()+$gameSystem[_0x5d17d4(0x116)]())*0x2,_0x1ea4d4['height']+=$gameSystem[_0x5d17d4(0x116)]()*0x2,_0x1ea4d4;},Window_VisualText[_0x4fd7e0(0xb4)]['updateSettings']=function(){const _0x5de4a2=_0x4fd7e0,_0x36cca2=this[_0x5de4a2(0xf7)]();this['move'](_0x36cca2['x'],_0x36cca2['y'],_0x36cca2['width'],_0x36cca2['height']);const _0x1d88b1=this[_0x5de4a2(0xf3)]();this[_0x5de4a2(0xce)]=_0x1d88b1['opacity'],this['backOpacity']=_0x1d88b1[_0x5de4a2(0xce)],this[_0x5de4a2(0x103)](_0x1d88b1[_0x5de4a2(0xd0)]);if(this['_dimmerSprite'])this[_0x5de4a2(0xfd)][_0x5de4a2(0xce)]=_0x1d88b1[_0x5de4a2(0xce)];this[_0x5de4a2(0x10c)](),this[_0x5de4a2(0x123)]<0xff&&!this[_0x5de4a2(0xfa)]()&&(_0x1d88b1[_0x5de4a2(0xf8)]===_0x5de4a2(0x114)?this[_0x5de4a2(0x114)]():this[_0x5de4a2(0x123)]=0xff);},Window_VisualText[_0x4fd7e0(0xb4)][_0x4fd7e0(0x10c)]=function(){const _0xae4790=_0x4fd7e0;this[_0xae4790(0xe6)]();const _0xc432bd=this['settings']();if(!_0xc432bd)return;const _0x4b2f4b=this[_0xae4790(0xc5)]-this[_0xae4790(0x105)]()*0x2;this[_0xae4790(0xf2)](_0xc432bd[_0xae4790(0xbd)],this[_0xae4790(0x105)](),0x0,_0x4b2f4b);},Window_VisualText['prototype'][_0x4fd7e0(0xcb)]=function(){const _0x157836=_0x4fd7e0;if(this[_0x157836(0xfd)]){const _0x29eb6d=this[_0x157836(0xfd)]['bitmap'],_0x1dbc00=this[_0x157836(0xb5)],_0x56941c=this[_0x157836(0xa2)],_0x2db9e7=ColorManager[_0x157836(0x118)]();_0x29eb6d['resize'](_0x1dbc00,_0x56941c),_0x29eb6d[_0x157836(0xd3)](0x0,0x0,_0x1dbc00,_0x56941c,_0x2db9e7),this['_dimmerSprite'][_0x157836(0xe9)](0x0,0x0,_0x1dbc00,_0x56941c);}},Window_VisualText['prototype'][_0x4fd7e0(0xb2)]=function(){},Window_VisualText[_0x4fd7e0(0xb4)]['selfRemoval']=function(_0x42a5c9){const _0x21a68c=_0x4fd7e0;_0x42a5c9===_0x21a68c(0xd4)&&(this[_0x21a68c(0x123)]=0x1),this[_0x21a68c(0xb8)]();},Window_VisualText[_0x4fd7e0(0xb4)][_0x4fd7e0(0xca)]=function(){const _0x36d5a4=_0x4fd7e0;this[_0x36d5a4(0x107)]&&(this[_0x36d5a4(0x123)]-=0x20,this[_0x36d5a4(0x120)]()&&(this[_0x36d5a4(0x107)]=![],this[_0x36d5a4(0xf4)]()));},Window_VisualText[_0x4fd7e0(0xb4)][_0x4fd7e0(0xf4)]=function(){const _0x4c271d=_0x4fd7e0;if(!this[_0x4c271d(0xbc)])return;this['parent'][_0x4c271d(0x109)](this);};