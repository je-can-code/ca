//=============================================================================
// VisuStella MZ - Save Core
// VisuMZ_1_SaveCore.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_1_SaveCore = true;

var VisuMZ = VisuMZ || {};
VisuMZ.SaveCore = VisuMZ.SaveCore || {};
VisuMZ.SaveCore.version = 1.07;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 1] [Version 1.07] [SaveCore]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Save_Core_VisuStella_MZ
 * @orderAfter VisuMZ_0_CoreEngine
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * The Save Core plugin adds upon the existing functionality of how saves
 * operate in RPG Maker MZ and how the Save Menu appears in-game. Control over
 * autosaves is also provided by this plugin as well as the ability to make
 * Global Switches and Variables accessible across all game saves (including
 * new games).
 *
 * Features include all (but not limited to) the following:
 * 
 * * Save file technicalities including how filenames are made and or how
 *   forage keys are labeled to distinguish games from one another.
 * * Save types (standard, slot-locked, or single) to change saving to be
 *   suited for each game type.
 * * Save confirmation window added to relay information to player on whether
 *   or not a save has been made successfully.
 * * Global Switches and Variables that span across all saves and new games.
 * * Control over how autosaves handle (their own file, save over existing
 *   files, and/or both).
 * * Plugin Commands that enable/disable autosaves and forcefully activate them
 *   or request them.
 * * Change up how the Save Menu appears with various save styles.
 * * Add descriptions and pictures to the save files.
 *
 * ============================================================================
 * Requirements
 * ============================================================================
 *
 * This plugin is made for RPG Maker MZ. This will not work in other iterations
 * of RPG Maker.
 *
 * ------ Tier 1 ------
 *
 * This plugin is a Tier 1 plugin. Place it under other plugins of lower tier
 * value on your Plugin Manager list (ie: 0, 1, 2, 3, 4, 5). This is to ensure
 * that your plugins will have the best compatibility with the rest of the
 * VisuStella MZ library.
 *
 * ============================================================================
 * Global Switches and Global Variables
 * ============================================================================
 *
 * Global Switches and Global Variables are now added into the game engine via
 * this plugin. Global Switches and Global Variables exist in the same state
 * across all save files. This means if Switch 40 is declared to be a Global
 * Switch and is turned ON, then whether you start up a new game or open a
 * different save file, Switch 40 will be in the ON state. Similar will occur
 * with Global Variables.
 *
 * ---
 *
 * <Global> Switch/Variable Name
 *
 * To declare Global Switches and/or Global Variables, insert <Global> into
 * the Switch/Variable's name. That's all there is to it. Whatever value you
 * change the Global Switch/Variable to after declaring it will be changed
 * across all saves.
 *
 * ---
 *
 * NOTE: Tagged Switches/Variables are mutually exclusive from one another.
 * You cannot tag them with <Global>, <JS>, or <Self> simultaneously.
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
 * === Autosave Plugin Commands ===
 * 
 * ---
 *
 * Autosave: Enable/Disable
 * - Enable or Disable Autosave
 * - Requires Database => System 1 => [x] Enable Autosave
 *
 *   Enable or Disable?:
 *   - Enable or disable autosave?
 *
 * ---
 *
 * Autosave: (Stage 1) Request
 * - Autosaves the game at current point if enabled.
 * - Requires Database => System 1 => [x] Enable Autosave
 * - Autosave does not go through if it is neither enabled in the database or
 *   in-game through the "Autosave: Enable/Disable" plugin command.
 * - This Plugin Command will not autosave if the player turned off "Autosave"
 *   in the Options Menu.
 *
 * ---
 *
 * Autosave: (Stage 2) Execute
 * - Executes autosaves the game at the current point.
 * - Requires Database => System 1 => [x] Enable Autosave
 * - This will require autosave to be enabled through the database, but it will
 *   ignore the "Autosave: Enable/Disable" plugin command state.
 * - This Plugin Command will not autosave if the player turned off "Autosave"
 *   in the Options Menu.
 *
 * ---
 *
 * Autosave: (Stage 3) Force
 * - Forces autosaves the game at the current point.
 * - Requires Database => System 1 => [x] Enable Autosave
 * - This will require autosave to be enabled through the database, but it will
 *   ignore the "Autosave: Enable/Disable" plugin command state.
 *
 * ---
 *
 * Save: Current Slot
 * - Process the game's current save at the current point.
 * - Must be outside of battle and on the map.
 *
 * ---
 * 
 * === Save Plugin Commands ===
 * 
 * ---
 *
 * Save: Set Description
 * - Set the description text that will appear in the save files.
 *
 *   Text:
 *   - Insert desired save description text here.
 *   - Text codes supported.
 *   - \V[x], \N[x], \P[x] are save local.
 *   - Other text codes will draw data from the currently active game.
 *
 * ---
 *
 * Save: Set Picture
 * - Set the picture that would appear in the save file.
 *
 *   Filename:
 *   - Input the filename here of the desired picture.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: General Save Settings
 * ============================================================================
 *
 * These are general settings pertaining to saves and the technicalities behind
 * how saves work in your game.
 *
 * ---
 *
 * General
 * 
 *   Save Style:
 *   - Select a save style for the game. Some of these options may alter other
 *     Plugin Parameter settings.
 *   - Standard: Save freely in any slot.
 *   - Slot-Locked: Select one dedicated slot at New Game.
 *   - Single: Only one slot is available for the game.
 * 
 *   Max Save Files:
 *   - Maximum number of save files for the game.
 * 
 *   Autosave Counts?:
 *   - Count the autosave file towards the max count?
 *
 * ---
 *
 * Local Mode
 * 
 *   Local Mode?:
 *   - When running the game on client, use the Local Mode of saving via files
 *     or store saves to forage keys?
 * 
 *   Filename Format:
 *   - Filename format for save files.
 *   - %1 - Save File ID
 * 
 *   Extension Format:
 *   - Filename extension format for save files.
 *   - %1 - Save Name
 *
 * ---
 *
 * Forage Key
 * 
 *   Forage Key Format:
 *   - Forage Key format when saving to memory.
 *   - %1 - Game ID, %2 - Save Name
 * 
 *   Forage Key Test:
 *   - Key used to test if saving a forage key is possible.
 *
 * ---
 *
 * Vocabulary
 * 
 *   Help: Slot-Locked:
 *   - Help description used for initial slot-locked selection.
 *
 * ---
 *
 * JavaScript
 * 
 *   JS: On Save Success:
 *   - Code to perform when a save is successful.
 * 
 *   JS: On Save Failure:
 *   - Code to perform when a save has failed.
 * 
 *   JS: On Load Success:
 *   - Code to perform when a load is successful.
 * 
 *   JS: On Load Failure:
 *   - Code to perform when a load has failed.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Save Confirm Window Settings
 * ============================================================================
 *
 * The Save Confirmation Window is a new feature added through this plugin.
 * It gives the player visual feedback letting the player know that a save is
 * successful or not.
 *
 * ---
 *
 * General
 * 
 *   Enable Window?:
 *   - Enable the Save Confirmation Window?
 * 
 *   Pop Up Duration:
 *   - How long should the window be open for before closing?
 *   - Insert the time in milliseconds.
 * 
 *   JS: X, Y, W, H:
 *   - Code used to determine the dimensions of the Save Confirmation Window.
 *
 * ---
 *
 * Vocabulary
 * 
 *   Pop Up: Save Success:
 *   - Text used for a "Save Success" message popup.
 *   - Text codes are allowed.
 * 
 *   Pop Up: Save Failure:
 *   - Text used for a "Save Failure" message popup.
 *   - Text codes are allowed.
 * 
 *   Pop Up: Load Failure:
 *   - Text used for a "Load Failure" message popup.
 *   - Text codes are allowed.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Autosave Settings
 * ============================================================================
 *
 * These settings adjust how autosaves work in your game project. The settings
 * will encompass the original autosave settings made by RPG Maker MZ as well
 * as new settings added through this plugin.
 *
 * ---
 *
 * General
 * 
 *   Autosave Type:
 *   - Select autosave type.
 *   - Requires Database => System 1 => [x] Enable Autosave
 *   - Autosave File: Dedicated save file for autosaves.
 *   - Current File: Overwrites the current save file.
 *   - Autosave File + Current File: Both of the above.
 * 
 *   Start Enabled?:
 *   - Start with autosave enabled?
 *   - Requires Database => System 1 => [x] Enable Autosave
 *
 * ---
 *
 * Requests
 * 
 *   Requires Save Enable?:
 *   - Autosave requests require Saving to be enabled?
 * 
 *   Request after Battle?:
 *   - Requests an autosave after battle?
 * 
 *   Request on Transfer?:
 *   - Requests an autosave after a map transfer?
 * 
 *   Request on Menu Open?:
 *   - Requests an autosave after opening the main menu?
 * 
 *   Request on Menu Exit?:
 *   - Requests an autosave after exiting the main menu?
 *
 * ---
 *
 * JavaScript
 * 
 *   JS: On Success:
 *   - Code to perform when an autosave is successful.
 * 
 *   JS: On Failure:
 *   - Code to perform when an autosave has failed.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Autosave Confirm Window Settings
 * ============================================================================
 *
 * The Autosave Confirmation Window is a new feature added by this plugin to
 * notify the player whenever autosaving occurs.
 *
 * ---
 *
 * General
 * 
 *   Enable Window?:
 *   - Enable the Autoave Confirmation Window?
 * 
 *   Pop Up Duration:
 *   - How long should the window be open for before closing?
 *   - Insert the time in milliseconds.
 * 
 *   Screen Position:
 *   - Where does this window appear on the screen?
 *   - Lower Left
 *   - Lower Center
 *   - Lower Right
 *   - Middle Left
 *   - Middle Center
 *   - Middle Right
 *   - Upper Left
 *   - Upper Center
 *   - Upper Right
 *
 * ---
 *
 * Vocabulary
 * 
 *   Pop Up: Save Success:
 *   - Text used for an "Autosave Success" message popup.
 *   - Text codes are allowed
 * 
 *   Pop Up: Save Failure:
 *   - Text used for an "Autosave Failure" message popup.
 *   - Text codes are allowed.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Autosave Options Settings
 * ============================================================================
 *
 * This plugin adds the "Autosave" option to the Options menu, allowing players
 * to decide if they want autosave enabled or not. This feature can be disabled
 * as well, to better suit games. If the "Autosave" option is turned off by the
 * player, then any Autosave requests and executions.
 *
 * ---
 *
 * Autosave Options
 * 
 *   Add Option?:
 *   - Add the 'Autosave' option to the Options menu?
 * 
 *   Adjust Window Height:
 *   - Automatically adjust the options window height?
 * 
 *   Option Name:
 *   - Command name of the option.
 *
 *   Default Value:
 *   - Determine the default value of this option.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Actor Graphic Settings
 * ============================================================================
 *
 * This Plugin Parameter lets you select which graphic to use for displaying
 * the actor party found inside the save menu.
 *
 * ---
 *
 * Actor Graphic
 * 
 *   None:
 *   - Don't display any actors.
 * 
 *   Face:
 *   - Display the face graphics for the actors.
 * 
 *   Map Sprite:
 *   - Display the sprite graphics for the actors.
 * 
 *   Sideview Battler:
 *   - Display the SV Battler graphics for the actors.
 *   - Note: If you have an existing save made before this plugin was
 *     installed, you may need to save over the existing ones to see the
 *     Sideview Battler graphics.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Save Menu Styles
 * ============================================================================
 *
 * Save Menu Styles affect how the save files themselves appear to the player,
 * as long horizontal lists, vertical columns, small boxes, or a large file.
 *
 * ---
 *
 * Save Menu Styles
 * 
 *   List:
 *   - Save files stretch horizontally across the screen.
 *   - Save files are listed as rows.
 * 
 *   Vertical:
 *   - Save files are stretched vertically across the screen.
 *   - Save files are depicted as columns.
 * 
 *   Box:
 *   - Save files are small boxes shown on the screen.
 *   - Save files are sign in both rows and columns.
 * 
 *   Large:
 *   - Save files take up the whole screen.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Style Settings
 * ============================================================================
 *
 * These settings allow you, the game dev, to manipulate how the save styles
 * appear in-game if they're not to your liking. JavaScript familiarity is a
 * must to adjust them.
 *
 * ---
 *
 * General
 * 
 *   Latest Text:
 *   - Text used to depict latest save file.
 * 
 *   Latest Color:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 * 
 *   Sprite Width:
 *   - Pixel width of map sprites when drawn in the Save Menu.
 * 
 *   SV Battler Width:
 *   - Pixel width of sv battlers when drawn in the Save Menu.
 *
 *   JS: Save Display Info:
 *   - Code that, upon saving, determines which info is quickly stored
 *     for displaying.
 *
 * ---
 *
 * List Style
 * Vertical Style
 * Box Style
 * Large Style
 * 
 *   Rows:
 *   - Number of rows for this style.
 * 
 *   Columns:
 *   - Number of column for this style.
 * 
 *   JS: Draw Contents:
 *   - Code on how to draw the contents for this style.
 * 
 *   JS: Draw File Data:
 *   - Code on how to draw the file data for this style.
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
 * Version 1.07: October 14, 2021
 * * Bug Fixes!
 * ** Fixed bugs caused by Core Engine's digit grouping that would make dates
 *    appear incorrectly. Fix made by Olivia.
 * 
 * Version 1.06: July 16, 2021
 * * Compatibility Update!
 * ** Compatibility update with Party System's max member change to fit a non-
 *    default amount of party members inside of the window. Update by Irina.
 * 
 * Version 1.05: May 14, 2021
 * * Feature Update!
 * ** Confirmation windows now have rounded coordinates to prevent distortions.
 *    Update made by Arisu.
 * 
 * Version 1.04: March 12, 2021
 * * Bug Fixes!
 * ** Fixed a bug where using the Plugin Command to save the current slot would
 *    not reload properly if the audio file BGM was not synched. Fix made by
 *    Arisu.
 * 
 * Version 1.03: November 29, 2020
 * * Bug Fixes!
 * ** Displayed month should now show the correct numeric value.
 *    Fix made by Arisu.
 * 
 * Version 1.02: September 13, 2020
 * * Compatibility Update!
 * ** Better compatibility for SV Actor graphics.
 * * Documentation Update!
 * ** The Plugin Command 'Save: Set Description' now has updated documentation
 *    for the text codes that are parsed on the local level.
 * * Feature Update!
 * ** The Plugin Command 'Save: Set Description' will now parse text code
 *    data for \V[x], \N[x], \P[x] on a local save file level. Feature updated
 *    by Yanfly.
 * 
 * Version 1.01: September 6, 2020
 * * Bug Fixes!
 * ** Disabling confirmation windows no longer cause crashes.
 *    Fix made by Yanfly.
 * ** Plugin Commands for for setting descriptions and save images work despite
 *    save settings found in the database. Fix made by Yanfly.
 * ** Save Core no longer crashes when going to the Save/Load scenes without
 *    the Core Engine enabled.
 * ** Single and Locked save styles no longer crash the game when loading.
 *    Fix made by Olivia.
 *
 * Version 1.00: August 20, 2020
 * * Finished Plugin!
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 *
 * @ --------------------------------------------------------------------------
 *
 * @command AutosaveEnable
 * @text Autosave: Enable/Disable
 * @desc Enable or Disable Autosave
 * Requires Database => System 1 => [x] Enable Autosave
 *
 * @arg Enable:eval
 * @text Enable or Disable?
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enable or disable autosave?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command AutosaveRequest
 * @text Autosave: (Stage 1) Request
 * @desc Autosaves the game at current point if enabled.
 * Requires Database => System 1 => [x] Enable Autosave
 *
 * @ --------------------------------------------------------------------------
 *
 * @command AutosaveExecute
 * @text Autosave: (Stage 2) Execute
 * @desc Executes autosaves the game at the current point.
 * Requires Database => System 1 => [x] Enable Autosave
 *
 * @ --------------------------------------------------------------------------
 *
 * @command AutosaveForce
 * @text Autosave: (Stage 3) Force
 * @desc Force autosaves the game at the current point.
 * Requires Database => System 1 => [x] Enable Autosave
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SaveCurrentSlot
 * @text Save: Current Slot
 * @desc Process the game's current save at the current point.
 * Must be outside of battle and on the map.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SaveDescription
 * @text Save: Set Description
 * @desc Set the description text that will appear in the save files.
 *
 * @arg Text:str
 * @text Text
 * @desc Insert desired save description text here. 
 * Text codes supported. \V[x], \N[x], \P[x] are save local.
 * @default Text
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SavePicture
 * @text Save: Set Picture
 * @desc Set the picture that would appear in the save file.
 *
 * @arg Filename:str
 * @text Filename
 * @type file
 * @dir img/pictures/
 * @desc Input the filename here of the desired picture.
 * @default 
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
 * @param SaveCore
 * @default Plugin Parameters
 *
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param Save:struct
 * @text Save Settings
 * @type struct<Save>
 * @desc General save settings pertaining to the game.
 * @default {"General":"","SaveStyle:str":"standard","MaxSaveFiles:num":"20","AutosaveMaxCount:eval":"false","LocalMode":"","LocalMode:eval":"true","FilenameFmt:str":"file%1","ExtensionFmt:str":"%1.rmmzsave","ForageKey":"","KeyFmt:str":"rmmzsave.%1.%2","TestKey:str":"rmmzsave.test","Vocabulary":"","VocabLockedSaveSlot:str":"Pick a file to start a new game.","JavaScript":"","OnSaveSuccessJS:func":"\"// Declare Constants\\nconst scene = this;\\n\\n// Actions\\n\"","OnSaveFailureJS:func":"\"// Declare Constants\\nconst scene = this;\\n\\n// Actions\\n\"","OnLoadSuccessJS:func":"\"// Declare Constants\\nconst scene = this;\\n\\n// Actions\\n\"","OnLoadFailureJS:func":"\"// Declare Constants\\nconst scene = this;\\n\\n// Actions\\n\""}
 *
 * @param SaveConfirm:struct
 * @text Confirm Window
 * @parent Save:struct
 * @type struct<SaveConfirm>
 * @desc Settings regarding the Save Confirmation Window.
 * @default {"General":"","Enable:eval":"true","Duration:num":"1000","ConfirmRect:func":"\"const width = Graphics.boxWidth / 2;\\nconst height = this.calcWindowHeight(1, false);\\nconst x = (Graphics.width - width) / 2;\\nconst y = (Graphics.height - height) / 2;\\nreturn new Rectangle(x, y, width, height);\"","Vocabulary":"","VocabSaveSuccess:str":"Save Successful!","VocabSaveFailure:str":"Could not save!","VocabLoadFailure:str":"Could not load save file!"}
 *
 * @param Autosave:struct
 * @text Autoave Settings
 * @type struct<Autosave>
 * @desc Game settings related to autosave.
 * @default {"General":"","AutosaveType:str":"file0","StartEnabled:eval":"true","Requests":"","RequestsRequireSaveEnable:eval":"true","AfterBattle:eval":"true","AfterTransfer:eval":"true","AfterMenuCall:eval":"true","AfterExitMenu:eval":"true","JavaScript":"","OnAutosaveSuccessJS:func":"\"// Declare Constants\\nconst scene = this;\\n\\n// Actions\\n\"","OnAutosaveFailureJS:func":"\"// Declare Constants\\nconst scene = this;\\n\\n// Actions\\n\""}
 *
 * @param AutosaveConfirm:struct
 * @text Confirm Window
 * @parent Autosave:struct
 * @type struct<AutosaveConfirm>
 * @desc Settings regarding the Autosave Confirmation Window.
 * @default {"General":"","Enable:eval":"true","Duration:num":"1000","ScreenPosition:str":"lower right","Vocabulary":"","VocabAutosaveSuccess:str":"\\I[193]Autosaved!","VocabAutosaveFailure:str":"\\I[194]Autosave failed!"}
 *
 * @param AutosaveOption:struct
 * @text Options Settings
 * @parent Autosave:struct
 * @type struct<AutosaveOption>
 * @desc Options Menu settings regarding Autosave.
 * @default {"AddOption:eval":"true","AdjustRect:eval":"true","Name:str":"Autosave","Default:num":"true"}
 *
 * @param StyleBreak
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param ActorGraphic:str
 * @text Actor Graphic
 * @type select
 * @option None
 * @value none
 * @option Face
 * @value face
 * @option Map Sprite
 * @value sprite
 * @option Sideview Battler
 * @value svbattler
 * @desc Choose how the actor graphics appear in save menus.
 * @default face
 *
 * @param SaveMenuStyle:str
 * @text Save Menu Style
 * @type select
 * @option List
 * @value list
 * @option Vertical
 * @value vertical
 * @option Box
 * @value box
 * @option Large
 * @value large
 * @desc Choose what kind of style to use for the Save Menu.
 * @default box
 *
 * @param SaveMenu:struct
 * @text Style Settings
 * @parent SaveMenuStyle:str
 * @type struct<SaveMenu>
 * @desc Settings regarding the individual Save Menu styles.
 * @default {"General":"","LatestText:str":"NEW!","LatestColor:str":"#f49ac1","SpriteWidth:num":"48","SvBattlerWidth:num":"64","MakeSavefileInfoJS:func":"\"// Declare Constants\\nconst info = arguments[0];\\n\\n// Store Displayed Save Data\\ninfo.gold = $gameParty.gold();\\ninfo.svbattlers = $gameParty.svbattlersForSaveFile();\\ninfo.description = $gameSystem.getSaveDescription() || '';\\ninfo.picture = $gameSystem.getSavePicture() || '';\\n\\n// Return Save Info\\nreturn info;\"","List":"","ListRows:num":"4","ListCols:num":"1","ListContentsJS:func":"\"// Declare Variables\\nconst info = arguments[0];\\nconst rect = arguments[1];\\nconst lineHeight = this.lineHeight();\\nconst padding = this.itemPadding();\\nconst c1 = ColorManager.dimColor1();\\nconst c2 = ColorManager.dimColor2();\\n\\n// Draw Actors\\nconst minimumScale = true;\\nthis.drawCenteredPicture(info.picture, rect.x, rect.y, rect.width, rect.height, minimumScale);\\nlet ch = rect.height;\\nif (this.actorStyle() === 'sprite') {\\n    ch -= lineHeight - 8;\\n} else if (this.actorStyle() === 'svbattler') {\\n    ch -= lineHeight - 12;\\n}\\nthis.drawActors(info, rect.x + padding, rect.y, rect.width - padding * 2, ch);\\n\\n// Draw Gradients\\nthis.contents.gradientFillRect(rect.x, rect.y, rect.width, lineHeight, c2, c1, true);\\nif (info.gold || info.description) {\\n    const gy = rect.y + rect.height - lineHeight;\\n    this.contents.gradientFillRect(rect.x, gy, rect.width, lineHeight, c1, c2, true);\\n}\\n\\n// Draw Data\\nthis.contents.fontSize = 18;\\ny = rect.y;\\nthis.drawPlaytime(info, rect.x + padding, y, rect.width - padding * 2, 'right');\\nthis.drawTimestamp(info, rect.x + padding, y, rect.width - padding * 2, 'center');\\ny = rect.y + rect.height - lineHeight;\\nif (info.gold) {\\n    this.drawCurrency(info, rect.x + padding, y, rect.width - padding * 2);\\n}\\n\\n// Draw Description\\ny = rect.y + rect.height - lineHeight;\\nthis.drawDescription(info, rect.x + padding, y, rect.width - padding * 2, 'left');\"","ListFileDataJS:func":"\"// Declare Constants\\nconst savefileId = arguments[0];\\nconst rect = arguments[1];\\nconst lineHeight = this.lineHeight();\\nconst padding = this.itemPadding();\\nconst y2 = rect.y + ((rect.height - lineHeight) / 2);\\n\\n// Draw File Data\\nthis.drawTitle(savefileId, rect.x + padding, rect.y);\\nthis.drawLatestMarker(savefileId, rect.x + padding, y2);\"","Vertical":"","VertRows:num":"1","VertCols:num":"3","VertContentsJS:func":"\"// Declare Variables\\nconst info = arguments[0];\\nconst rect = arguments[1];\\nconst lineHeight = this.lineHeight();\\nconst padding = this.itemPadding();\\nconst c1 = ColorManager.dimColor1();\\nconst c2 = ColorManager.dimColor2();\\n\\n// Draw Actors\\nconst minimumScale = true;\\nthis.drawCenteredPicture(info.picture, rect.x, rect.y, rect.width, rect.height, minimumScale);\\nconst ch = this.actorStyle() === 'face' ? ImageManager.faceHeight : ImageManager.saveMenuSvBattlerWidth;\\nconst cy = rect.y + ((rect.height - ch) / 2);\\nthis.drawActors(info, rect.x + padding, cy, rect.width - padding * 2, ch);\\n\\n// Draw Gradients\\nthis.contents.gradientFillRect(rect.x, rect.y, rect.width, lineHeight, c2, c1, true);\\nconst gy = rect.y + rect.height - lineHeight * 2;\\nthis.contents.gradientFillRect(rect.x, gy, rect.width, lineHeight * 2, c1, c2, true);\\n\\n// Draw Description\\ny = rect.y + lineHeight * 2;\\nthis.setWordWrap(true);\\nthis.drawDescription(info, rect.x + padding, y, rect.width - padding * 2, 'left');\\nthis.resetWordWrap(false);\\n\\n// Draw Data\\nthis.contents.fontSize = 18;\\ny = rect.y + rect.height - lineHeight;\\nthis.drawTimestamp(info, rect.x + padding, y, rect.width - padding * 2, 'center');\\ny -= lineHeight;\\nthis.drawPlaytime(info, rect.x + padding, y, rect.width - padding * 2, 'center');\\nif (info.gold) {\\n    y -= lineHeight;\\n    this.drawCurrency(info, rect.x + padding, y, rect.width - padding * 2);\\n}\"","VertFileDataJS:func":"\"// Declare Constants\\nconst savefileId = arguments[0];\\nconst rect = arguments[1];\\nconst lineHeight = this.lineHeight();\\nconst padding = this.itemPadding();\\n\\n// Draw File Data\\nthis.drawTitle(savefileId, rect.x + padding, rect.y);\\nconst x2 = rect.x + rect.width - padding - this.textWidth(TextManager.latestSave);\\nthis.drawLatestMarker(savefileId, x2, rect.y);\"","Box":"","BoxRows:num":"2","BoxCols:num":"3","BoxContentsJS:func":"\"// Declare Variables\\nconst info = arguments[0];\\nconst rect = arguments[1];\\nconst lineHeight = this.lineHeight();\\nconst padding = this.itemPadding();\\nconst c1 = ColorManager.dimColor1();\\nconst c2 = ColorManager.dimColor2();\\n\\n// Draw Actors\\nconst minimumScale = false;\\nthis.drawCenteredPicture(info.picture, rect.x, rect.y, rect.width, rect.height, minimumScale);\\nconst rh = rect.height - lineHeight * 3;\\nconst ch = ImageManager.faceHeight;\\nconst cy = rect.y + ((rh - ch) / 2) + lineHeight;\\nthis.drawActors(info, rect.x + 1, cy, rect.width - 2, ch);\\n\\n// Draw Gradients\\nthis.contents.gradientFillRect(rect.x, rect.y, rect.width, lineHeight, c2, c1, true);\\nconst gy = rect.y + rect.height - lineHeight * 2;\\nthis.contents.gradientFillRect(rect.x, gy, rect.width, lineHeight * 2, c1, c2, true);\\n\\n// Draw Data\\nthis.contents.fontSize = 18;\\ny = rect.y + lineHeight;\\nthis.contents.gradientFillRect(rect.x, y, rect.width, lineHeight, c2, c1, false);\\nthis.drawTimestamp(info, rect.x + padding, y, rect.width - padding * 2, 'right');\\ny += lineHeight;\\nconst hw = rect.width / 2;\\nthis.contents.gradientFillRect(rect.x + hw, y, hw, lineHeight, c2, c1, false);\\nthis.drawPlaytime(info, rect.x + padding, y, rect.width - padding * 2, 'right');\\nif (info.gold) {\\n    // Ignore drawing gold in this style\\n    // y = rect.y + rect.height - lineHeight * 3;\\n    // this.drawCurrency(info, rect.x + padding, y, rect.width - padding * 2);\\n}\\n\\n// Draw Description\\ny = rect.y + rect.height - lineHeight * 2;\\nthis.setWordWrap(true);\\nthis.drawDescription(info, rect.x + padding, y, rect.width - padding * 2, 'left');\\nthis.resetWordWrap(false);\"","BoxFileDataJS:func":"\"// Declare Constants\\nconst savefileId = arguments[0];\\nconst rect = arguments[1];\\nconst lineHeight = this.lineHeight();\\nconst padding = this.itemPadding();\\n\\n// Draw File Data\\nthis.drawTitle(savefileId, rect.x + padding, rect.y);\\nconst x2 = rect.x + rect.width - padding - this.textWidth(TextManager.latestSave);\\nthis.drawLatestMarker(savefileId, x2, rect.y);\"","Large":"","LargeRows:num":"1","LargeCols:num":"1","LargeContentsJS:func":"\"// Declare Variables\\nconst info = arguments[0];\\nconst rect = arguments[1];\\nconst lineHeight = this.lineHeight();\\nconst padding = this.itemPadding();\\nconst c1 = ColorManager.dimColor1();\\nconst c2 = ColorManager.dimColor2();\\n\\n// Draw Actors\\nconst minimumScale = false;\\nthis.drawCenteredPicture(info.picture, rect.x, rect.y, rect.width, rect.height, minimumScale);\\nconst ch = this.actorStyle() === 'face' ? ImageManager.faceHeight : ImageManager.saveMenuSvBattlerWidth;\\nconst cy = rect.y + ((rect.height - ch) / 2);\\nthis.drawActors(info, rect.x + padding, cy, rect.width - padding * 2, ch);\\n\\n// Draw Gradients\\nthis.contents.gradientFillRect(rect.x, rect.y, rect.width, lineHeight, c2, c1, true);\\nconst gy = rect.y + rect.height - lineHeight;\\nthis.contents.gradientFillRect(rect.x, gy, rect.width, lineHeight, c1, c2, true);\\n\\n// Draw Description\\ny = rect.y + lineHeight * 1.5;\\nthis.setWordWrap(true);\\nthis.drawDescription(info, rect.x + padding * 4, y, rect.width - padding * 8, 'left');\\nthis.resetWordWrap(false);\\n\\n// Draw Data\\nthis.contents.fontSize = 18;\\nthis.drawTimestamp(info, rect.x + padding, rect.y, rect.width - padding * 2, 'center');\\ny = rect.y + rect.height - lineHeight;\\nthis.drawPlaytime(info, rect.x + padding, y, rect.width - padding * 2, 'center');\\nif (info.gold) {\\n    this.drawCurrency(info, rect.x + padding, y, rect.width - padding * 2);\\n}\"","LargeFileDataJS:func":"\"// Declare Constants\\nconst savefileId = arguments[0];\\nconst rect = arguments[1];\\nconst lineHeight = this.lineHeight();\\nconst padding = this.itemPadding();\\n\\n// Draw File Data\\nthis.drawTitle(savefileId, rect.x + padding, rect.y);\\nconst x2 = rect.x + rect.width - padding - this.textWidth(TextManager.latestSave);\\nthis.drawLatestMarker(savefileId, x2, rect.y);\""}
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
 * General Save Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Save:
 *
 * @param General
 *
 * @param SaveStyle:str
 * @text Save Style
 * @parent General
 * @type select
 * @option Standard: Save freely in any slot.
 * @value standard
 * @option Slot-Locked: Select one dedicated slot at New Game.
 * @value locked
 * @option Single: Only one slot is available for the game.
 * @value single
 * @desc Select a save style for the game. Some of these options
 * may alter other Plugin Parameter settings.
 * @default standard
 *
 * @param MaxSaveFiles:num
 * @text Max Save Files
 * @parent General
 * @desc Maximum number of save files for the game.
 * @default 20
 *
 * @param AutosaveMaxCount:eval
 * @text Autosave Counts?
 * @parent General
 * @type boolean
 * @on Counts Towards Max
 * @off Doesn't Count
 * @desc Count the autosave file towards the max count?
 * @default false
 *
 * @param LocalMode
 * @text Local Mode
 *
 * @param LocalMode:eval
 * @text Local Mode?
 * @parent LocalMode
 * @type boolean
 * @on Local File
 * @off Forage Key
 * @desc When running the game on client, use the Local Mode of
 * saving via files or store saves to forage keys?
 * @default true
 *
 * @param FilenameFmt:str
 * @text Filename Format
 * @parent LocalMode
 * @desc Filename format for save files.
 * %1 - Save File ID
 * @default file%1
 *
 * @param ExtensionFmt:str
 * @text Extension Format
 * @parent LocalMode
 * @desc Filename extension format for save files.
 * %1 - Save Name
 * @default %1.rmmzsave
 *
 * @param ForageKey
 * @text Forage Key
 *
 * @param KeyFmt:str
 * @text Forage Key Format
 * @parent ForageKey
 * @desc Forage Key format when saving to memory.
 * %1 - Game ID, %2 - Save Name
 * @default rmmzsave.%1.%2
 *
 * @param TestKey:str
 * @text Forage Key Test
 * @parent ForageKey
 * @desc Key used to test if saving a forage key is possible.
 * @default rmmzsave.test
 *
 * @param Vocabulary
 *
 * @param VocabLockedSaveSlot:str
 * @text Help: Slot-Locked
 * @parent Vocabulary
 * @desc Help description used for initial slot-locked selection.
 * @default Pick a file to start a new game.
 *
 * @param JavaScript
 *
 * @param OnSaveSuccessJS:func
 * @text JS: On Save Success
 * @parent JavaScript
 * @type note
 * @desc Code to perform when a save is successful.
 * @default "// Declare Constants\nconst scene = this;\n\n// Actions\n"
 *
 * @param OnSaveFailureJS:func
 * @text JS: On Save Failure
 * @parent JavaScript
 * @type note
 * @desc Code to perform when a save has failed.
 * @default "// Declare Constants\nconst scene = this;\n\n// Actions\n"
 *
 * @param OnLoadSuccessJS:func
 * @text JS: On Load Success
 * @parent JavaScript
 * @type note
 * @desc Code to perform when a load is successful.
 * @default "// Declare Constants\nconst scene = this;\n\n// Actions\n"
 *
 * @param OnLoadFailureJS:func
 * @text JS: On Load Failure
 * @parent JavaScript
 * @type note
 * @desc Code to perform when a load has failed.
 * @default "// Declare Constants\nconst scene = this;\n\n// Actions\n"
 *
 */
/* ----------------------------------------------------------------------------
 * Save Confirm Window Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~SaveConfirm:
 *
 * @param General
 *
 * @param Enable:eval
 * @text Enable Window?
 * @parent General
 * @type boolean
 * @on Enable
 * @off Don't
 * @desc Enable the Save Confirmation Window?
 * @default true
 *
 * @param Duration:num
 * @text Pop Up Duration
 * @parent General
 * @type number
 * @min 1
 * @desc How long should the window be open for before closing?
 * Insert the time in milliseconds.
 * @default 1000
 *
 * @param ConfirmRect:func
 * @text JS: X, Y, W, H
 * @parent General
 * @type note
 * @desc Code used to determine the dimensions of the 
 * Save Confirmation Window.
 * @default "const width = Graphics.boxWidth / 2;\nconst height = this.calcWindowHeight(1, false);\nconst x = (Graphics.width - width) / 2;\nconst y = (Graphics.height - height) / 2;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param Vocabulary
 *
 * @param VocabSaveSuccess:str
 * @text Pop Up: Save Success
 * @parent Vocabulary
 * @desc Text used for a "Save Success" message popup.
 * Text codes are allowed.
 * @default Save Successful!
 *
 * @param VocabSaveFailure:str
 * @text Pop Up: Save Failure
 * @parent Vocabulary
 * @desc Text used for a "Save Failure" message popup.
 * Text codes are allowed.
 * @default Could not save!
 *
 * @param VocabLoadFailure:str
 * @text Pop Up: Load Failure
 * @parent Vocabulary
 * @desc Text used for a "Load Failure" message popup.
 * Text codes are allowed.
 * @default Could not load save file!
 *
 */
/* ----------------------------------------------------------------------------
 * Autosave Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Autosave:
 *
 * @param General
 *
 * @param AutosaveType:str
 * @text Autosave Type
 * @parent General
 * @type select
 * @option Autosave File: Dedicated file for autosaves.
 * @value file0
 * @option Current File: Overwrites the current save file.
 * @value current
 * @option Autosave File + Current File: Both of the above.
 * @value both
 * @desc Select autosave type.
 * Requires Database => System 1 => [x] Enable Autosave
 * @default file0
 *
 * @param StartEnabled:eval
 * @text Start Enabled?
 * @parent General
 * @type boolean
 * @on Start Enabled
 * @off Start Disabled
 * @desc Start with autosave enabled?
 * Requires Database => System 1 => [x] Enable Autosave
 * @default true
 *
 * @param Requests
 *
 * @param RequestsRequireSaveEnable:eval
 * @text Requires Save Enable?
 * @parent Requests
 * @type boolean
 * @on Requires Save Enable
 * @off Doesn't Require
 * @desc Autosave requests require Saving to be enabled?
 * @default true
 *
 * @param AfterBattle:eval
 * @text Request after Battle?
 * @parent Requests
 * @type boolean
 * @on Autosave
 * @off Don't
 * @desc Requests an autosave after battle?
 * @default true
 *
 * @param AfterTransfer:eval
 * @text Request on Transfer?
 * @parent Requests
 * @type boolean
 * @on Autosave
 * @off Don't
 * @desc Requests an autosave after a map transfer?
 * @default true
 *
 * @param AfterMenuCall:eval
 * @text Request on Menu Open?
 * @parent Requests
 * @type boolean
 * @on Autosave
 * @off Don't
 * @desc Requests an autosave after opening the main menu?
 * @default true
 *
 * @param AfterExitMenu:eval
 * @text Request on Menu Exit?
 * @parent Requests
 * @type boolean
 * @on Autosave
 * @off Don't
 * @desc Requests an autosave after exiting the main menu?
 * @default true
 *
 * @param JavaScript
 *
 * @param OnAutosaveSuccessJS:func
 * @text JS: On Success
 * @parent JavaScript
 * @type note
 * @desc Code to perform when an autosave is successful.
 * @default "// Declare Constants\nconst scene = this;\n\n// Actions\n"
 *
 * @param OnAutosaveFailureJS:func
 * @text JS: On Failure
 * @parent JavaScript
 * @type note
 * @desc Code to perform when an autosave has failed.
 * @default "// Declare Constants\nconst scene = this;\n\n// Actions\n"
 *
 */
/* ----------------------------------------------------------------------------
 * Autosave Confirm Window Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~AutosaveConfirm:
 *
 * @param General
 *
 * @param Enable:eval
 * @text Enable Window?
 * @parent General
 * @type boolean
 * @on Enable
 * @off Don't
 * @desc Enable the Autoave Confirmation Window?
 * @default true
 *
 * @param Duration:num
 * @text Pop Up Duration
 * @parent General
 * @type number
 * @min 1
 * @desc How long should the window be open for before closing?
 * Insert the time in milliseconds.
 * @default 1000
 *
 * @param ScreenPosition:str
 * @text Screen Position
 * @parent General
 * @type select
 * @option Lower Left
 * @value lower left
 * @option Lower Center
 * @value lower center
 * @option Lower Right
 * @value lower right
 * @option Middle Left
 * @value middle left
 * @option Middle Center
 * @value middle center
 * @option Middle Right
 * @value middle right
 * @option Upper Left
 * @value upper left
 * @option Upper Center
 * @value upper center
 * @option Upper Right
 * @value upper right
 * @desc Where does this window appear on the screen?
 * @default lower right
 *
 * @param Vocabulary
 *
 * @param VocabAutosaveSuccess:str
 * @text Pop Up: Save Success
 * @parent Vocabulary
 * @desc Text used for an "Autosave Success" message popup.
 * Text codes are allowed.
 * @default \I[193]Autosaved!
 *
 * @param VocabAutosaveFailure:str
 * @text Pop Up: Save Failure
 * @parent Vocabulary
 * @desc Text used for an "Autosave Failure" message popup.
 * Text codes are allowed.
 * @default \I[194]Autosave failed!
 *
 */
/* ----------------------------------------------------------------------------
 * Autosave Options Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~AutosaveOption:
 *
 * @param AddOption:eval
 * @text Add Option?
 * @type boolean
 * @on Add
 * @off Don't Add
 * @desc Add the 'Autosave' option to the Options menu?
 * @default true
 *
 * @param AdjustRect:eval
 * @text Adjust Window Height
 * @type boolean
 * @on Adjust
 * @off Don't
 * @desc Automatically adjust the options window height?
 * @default true
 *
 * @param Name:str
 * @text Option Name
 * @desc Command name of the option.
 * @default Autosave
 *
 * @param Default:eval
 * @text Default Value
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Determine the default value of this option.
 * @default true
 *
 */
/* ----------------------------------------------------------------------------
 * Save Menu Style Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~SaveMenu:
 *
 * @param General
 *
 * @param LatestText:str
 * @text Latest Text
 * @parent General
 * @desc Text used to depict latest save file.
 * @default NEW!
 *
 * @param LatestColor:str
 * @text Latest Color
 * @parent General
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default #f49ac1
 *
 * @param SpriteWidth:num
 * @text Sprite Width
 * @parent General
 * @type number
 * @desc Pixel width of map sprites when drawn in the Save Menu.
 * @default 48
 *
 * @param SvBattlerWidth:num
 * @text SV Battler Width
 * @parent General
 * @type number
 * @desc Pixel width of sv battlers when drawn in the Save Menu.
 * @default 64
 *
 * @param MakeSavefileInfoJS:func
 * @text JS: Save Display Info
 * @parent General
 * @type note
 * @desc Code that, upon saving, determines which info is quickly stored for displaying.
 * @default "// Declare Constants\nconst info = arguments[0];\n\n// Store Displayed Save Data\ninfo.gold = $gameParty.gold();\ninfo.svbattlers = $gameParty.svbattlersForSaveFile();\ninfo.description = $gameSystem.getSaveDescription() || '';\ninfo.picture = $gameSystem.getSavePicture() || '';\n\n// Return Save Info\nreturn info;"
 *
 * @param List
 * @text List Style
 *
 * @param ListRows:num
 * @text Rows
 * @parent List
 * @type number
 * @min 1
 * @desc Number of rows for this style.
 * @default 4
 *
 * @param ListCols:num
 * @text Columns
 * @parent List
 * @type number
 * @min 1
 * @desc Number of column for this style.
 * @default 1
 *
 * @param ListContentsJS:func
 * @text JS: Draw Contents
 * @parent List
 * @type note
 * @desc Code on how to draw the contents for this style.
 * @default "// Declare Variables\nconst info = arguments[0];\nconst rect = arguments[1];\nconst lineHeight = this.lineHeight();\nconst padding = this.itemPadding();\nconst c1 = ColorManager.dimColor1();\nconst c2 = ColorManager.dimColor2();\n\n// Draw Actors\nconst minimumScale = true;\nthis.drawCenteredPicture(info.picture, rect.x, rect.y, rect.width, rect.height, minimumScale);\nlet ch = rect.height;\nif (this.actorStyle() === 'sprite') {\n    ch -= lineHeight - 8;\n} else if (this.actorStyle() === 'svbattler') {\n    ch -= lineHeight - 12;\n}\nthis.drawActors(info, rect.x + padding, rect.y, rect.width - padding * 2, ch);\n\n// Draw Gradients\nthis.contents.gradientFillRect(rect.x, rect.y, rect.width, lineHeight, c2, c1, true);\nif (info.gold || info.description) {\n    const gy = rect.y + rect.height - lineHeight;\n    this.contents.gradientFillRect(rect.x, gy, rect.width, lineHeight, c1, c2, true);\n}\n\n// Draw Data\nthis.contents.fontSize = 18;\ny = rect.y;\nthis.drawPlaytime(info, rect.x + padding, y, rect.width - padding * 2, 'right');\nthis.drawTimestamp(info, rect.x + padding, y, rect.width - padding * 2, 'center');\ny = rect.y + rect.height - lineHeight;\nif (info.gold) {\n    this.drawCurrency(info, rect.x + padding, y, rect.width - padding * 2);\n}\n\n// Draw Description\ny = rect.y + rect.height - lineHeight;\nthis.drawDescription(info, rect.x + padding, y, rect.width - padding * 2, 'left');"
 *
 * @param ListFileDataJS:func
 * @text JS: Draw File Data
 * @parent List
 * @type note
 * @desc Code on how to draw the file data for this style.
 * @default "// Declare Constants\nconst savefileId = arguments[0];\nconst rect = arguments[1];\nconst lineHeight = this.lineHeight();\nconst padding = this.itemPadding();\nconst y2 = rect.y + ((rect.height - lineHeight) / 2);\n\n// Draw File Data\nthis.drawTitle(savefileId, rect.x + padding, rect.y);\nthis.drawLatestMarker(savefileId, rect.x + padding, y2);"
 *
 * @param Vertical
 * @text Vertical Style
 *
 * @param VertRows:num
 * @text Rows
 * @parent Vertical
 * @type number
 * @min 1
 * @desc Number of rows for this style.
 * @default 1
 *
 * @param VertCols:num
 * @text Columns
 * @parent Vertical
 * @type number
 * @min 1
 * @desc Number of column for this style.
 * @default 3
 *
 * @param VertContentsJS:func
 * @text JS: Draw Contents
 * @parent Vertical
 * @type note
 * @desc Code on how to draw the contents for this style.
 * @default "// Declare Variables\nconst info = arguments[0];\nconst rect = arguments[1];\nconst lineHeight = this.lineHeight();\nconst padding = this.itemPadding();\nconst c1 = ColorManager.dimColor1();\nconst c2 = ColorManager.dimColor2();\n\n// Draw Actors\nconst minimumScale = true;\nthis.drawCenteredPicture(info.picture, rect.x, rect.y, rect.width, rect.height, minimumScale);\nconst ch = this.actorStyle() === 'face' ? ImageManager.faceHeight : ImageManager.saveMenuSvBattlerWidth;\nconst cy = rect.y + ((rect.height - ch) / 2);\nthis.drawActors(info, rect.x + padding, cy, rect.width - padding * 2, ch);\n\n// Draw Gradients\nthis.contents.gradientFillRect(rect.x, rect.y, rect.width, lineHeight, c2, c1, true);\nconst gy = rect.y + rect.height - lineHeight * 2;\nthis.contents.gradientFillRect(rect.x, gy, rect.width, lineHeight * 2, c1, c2, true);\n\n// Draw Description\ny = rect.y + lineHeight * 2;\nthis.setWordWrap(true);\nthis.drawDescription(info, rect.x + padding, y, rect.width - padding * 2, 'left');\nthis.resetWordWrap(false);\n\n// Draw Data\nthis.contents.fontSize = 18;\ny = rect.y + rect.height - lineHeight;\nthis.drawTimestamp(info, rect.x + padding, y, rect.width - padding * 2, 'center');\ny -= lineHeight;\nthis.drawPlaytime(info, rect.x + padding, y, rect.width - padding * 2, 'center');\nif (info.gold) {\n    y -= lineHeight;\n    this.drawCurrency(info, rect.x + padding, y, rect.width - padding * 2);\n}"
 *
 * @param VertFileDataJS:func
 * @text JS: Draw File Data
 * @parent Vertical
 * @type note
 * @desc Code on how to draw the file data for this style.
 * @default "// Declare Constants\nconst savefileId = arguments[0];\nconst rect = arguments[1];\nconst lineHeight = this.lineHeight();\nconst padding = this.itemPadding();\n\n// Draw File Data\nthis.drawTitle(savefileId, rect.x + padding, rect.y);\nconst x2 = rect.x + rect.width - padding - this.textWidth(TextManager.latestSave);\nthis.drawLatestMarker(savefileId, x2, rect.y);"
 *
 * @param Box
 * @text Box Style
 *
 * @param BoxRows:num
 * @text Rows
 * @parent Box
 * @type number
 * @min 1
 * @desc Number of rows for this style.
 * @default 2
 *
 * @param BoxCols:num
 * @text Columns
 * @parent Box
 * @type number
 * @min 1
 * @desc Number of column for this style.
 * @default 3
 *
 * @param BoxContentsJS:func
 * @text JS: Draw Contents
 * @parent Box
 * @type note
 * @desc Code on how to draw the contents for this style.
 * @default "// Declare Variables\nconst info = arguments[0];\nconst rect = arguments[1];\nconst lineHeight = this.lineHeight();\nconst padding = this.itemPadding();\nconst c1 = ColorManager.dimColor1();\nconst c2 = ColorManager.dimColor2();\n\n// Draw Actors\nconst minimumScale = false;\nthis.drawCenteredPicture(info.picture, rect.x, rect.y, rect.width, rect.height, minimumScale);\nconst rh = rect.height - lineHeight * 3;\nconst ch = ImageManager.faceHeight;\nconst cy = rect.y + ((rh - ch) / 2) + lineHeight;\nthis.drawActors(info, rect.x + 1, cy, rect.width - 2, ch);\n\n// Draw Gradients\nthis.contents.gradientFillRect(rect.x, rect.y, rect.width, lineHeight, c2, c1, true);\nconst gy = rect.y + rect.height - lineHeight * 2;\nthis.contents.gradientFillRect(rect.x, gy, rect.width, lineHeight * 2, c1, c2, true);\n\n// Draw Data\nthis.contents.fontSize = 18;\ny = rect.y + lineHeight;\nthis.contents.gradientFillRect(rect.x, y, rect.width, lineHeight, c2, c1, false);\nthis.drawTimestamp(info, rect.x + padding, y, rect.width - padding * 2, 'right');\ny += lineHeight;\nconst hw = rect.width / 2;\nthis.contents.gradientFillRect(rect.x + hw, y, hw, lineHeight, c2, c1, false);\nthis.drawPlaytime(info, rect.x + padding, y, rect.width - padding * 2, 'right');\nif (info.gold) {\n    // Ignore drawing gold in this style\n    // y = rect.y + rect.height - lineHeight * 3;\n    // this.drawCurrency(info, rect.x + padding, y, rect.width - padding * 2);\n}\n\n// Draw Description\ny = rect.y + rect.height - lineHeight * 2;\nthis.setWordWrap(true);\nthis.drawDescription(info, rect.x + padding, y, rect.width - padding * 2, 'left');\nthis.resetWordWrap(false);"
 *
 * @param BoxFileDataJS:func
 * @text JS: Draw File Data
 * @parent Box
 * @type note
 * @desc Code on how to draw the file data for this style.
 * @default "// Declare Constants\nconst savefileId = arguments[0];\nconst rect = arguments[1];\nconst lineHeight = this.lineHeight();\nconst padding = this.itemPadding();\n\n// Draw File Data\nthis.drawTitle(savefileId, rect.x + padding, rect.y);\nconst x2 = rect.x + rect.width - padding - this.textWidth(TextManager.latestSave);\nthis.drawLatestMarker(savefileId, x2, rect.y);"
 *
 * @param Large
 * @text Large Style
 *
 * @param LargeRows:num
 * @text Rows
 * @parent Large
 * @type number
 * @min 1
 * @desc Number of rows for this style.
 * @default 1
 *
 * @param LargeCols:num
 * @text Columns
 * @parent Large
 * @type number
 * @min 1
 * @desc Number of column for this style.
 * @default 1
 *
 * @param LargeContentsJS:func
 * @text JS: Draw Contents
 * @parent Large
 * @type note
 * @desc Code on how to draw the contents for this style.
 * @default "// Declare Variables\nconst info = arguments[0];\nconst rect = arguments[1];\nconst lineHeight = this.lineHeight();\nconst padding = this.itemPadding();\nconst c1 = ColorManager.dimColor1();\nconst c2 = ColorManager.dimColor2();\n\n// Draw Actors\nconst minimumScale = false;\nthis.drawCenteredPicture(info.picture, rect.x, rect.y, rect.width, rect.height, minimumScale);\nconst ch = this.actorStyle() === 'face' ? ImageManager.faceHeight : ImageManager.saveMenuSvBattlerWidth;\nconst cy = rect.y + ((rect.height - ch) / 2);\nthis.drawActors(info, rect.x + padding, cy, rect.width - padding * 2, ch);\n\n// Draw Gradients\nthis.contents.gradientFillRect(rect.x, rect.y, rect.width, lineHeight, c2, c1, true);\nconst gy = rect.y + rect.height - lineHeight;\nthis.contents.gradientFillRect(rect.x, gy, rect.width, lineHeight, c1, c2, true);\n\n// Draw Description\ny = rect.y + lineHeight * 1.5;\nthis.setWordWrap(true);\nthis.drawDescription(info, rect.x + padding * 4, y, rect.width - padding * 8, 'left');\nthis.resetWordWrap(false);\n\n// Draw Data\nthis.contents.fontSize = 18;\nthis.drawTimestamp(info, rect.x + padding, rect.y, rect.width - padding * 2, 'center');\ny = rect.y + rect.height - lineHeight;\nthis.drawPlaytime(info, rect.x + padding, y, rect.width - padding * 2, 'center');\nif (info.gold) {\n    this.drawCurrency(info, rect.x + padding, y, rect.width - padding * 2);\n}"
 *
 * @param LargeFileDataJS:func
 * @text JS: Draw File Data
 * @parent Large
 * @type note
 * @desc Code on how to draw the file data for this style.
 * @default "// Declare Constants\nconst savefileId = arguments[0];\nconst rect = arguments[1];\nconst lineHeight = this.lineHeight();\nconst padding = this.itemPadding();\n\n// Draw File Data\nthis.drawTitle(savefileId, rect.x + padding, rect.y);\nconst x2 = rect.x + rect.width - padding - this.textWidth(TextManager.latestSave);\nthis.drawLatestMarker(savefileId, x2, rect.y);"
 *
 */
//=============================================================================

const _0x13d6cd=_0x2f89;function _0x2f89(_0x2c5ec1,_0x5baeb0){const _0x524d93=_0x524d();return _0x2f89=function(_0x2f89df,_0x404671){_0x2f89df=_0x2f89df-0x132;let _0x5d7ce=_0x524d93[_0x2f89df];return _0x5d7ce;},_0x2f89(_0x2c5ec1,_0x5baeb0);}(function(_0x26a192,_0x5c7f11){const _0x5bf85d=_0x2f89,_0x1288f0=_0x26a192();while(!![]){try{const _0x2f46ac=-parseInt(_0x5bf85d(0x1df))/0x1+-parseInt(_0x5bf85d(0x222))/0x2+parseInt(_0x5bf85d(0x17c))/0x3+-parseInt(_0x5bf85d(0x159))/0x4+-parseInt(_0x5bf85d(0x27a))/0x5+parseInt(_0x5bf85d(0x154))/0x6*(-parseInt(_0x5bf85d(0x299))/0x7)+-parseInt(_0x5bf85d(0x13a))/0x8*(-parseInt(_0x5bf85d(0x18b))/0x9);if(_0x2f46ac===_0x5c7f11)break;else _0x1288f0['push'](_0x1288f0['shift']());}catch(_0x39051b){_0x1288f0['push'](_0x1288f0['shift']());}}}(_0x524d,0xa0122));var label=_0x13d6cd(0x2da),tier=tier||0x0,dependencies=[],pluginData=$plugins[_0x13d6cd(0x244)](function(_0x34c6cb){const _0x4e02c6=_0x13d6cd;return _0x34c6cb[_0x4e02c6(0x24c)]&&_0x34c6cb['description']['includes']('['+label+']');})[0x0];VisuMZ[label][_0x13d6cd(0x144)]=VisuMZ[label][_0x13d6cd(0x144)]||{},VisuMZ[_0x13d6cd(0x180)]=function(_0xea8901,_0x286280){const _0x36b4eb=_0x13d6cd;for(const _0x482149 in _0x286280){if(_0x482149[_0x36b4eb(0x2d3)](/(.*):(.*)/i)){if(_0x36b4eb(0x14c)!==_0x36b4eb(0x14c))_0x875afe['SaveCore'][_0x36b4eb(0x269)][_0x36b4eb(0x2ce)](this);else{const _0x4974ba=String(RegExp['$1']),_0x576f89=String(RegExp['$2'])[_0x36b4eb(0x1c5)]()[_0x36b4eb(0x192)]();let _0x5b9cd7,_0x30a01a,_0x21aeca;switch(_0x576f89){case _0x36b4eb(0x162):_0x5b9cd7=_0x286280[_0x482149]!==''?Number(_0x286280[_0x482149]):0x0;break;case _0x36b4eb(0x186):_0x30a01a=_0x286280[_0x482149]!==''?JSON[_0x36b4eb(0x1a5)](_0x286280[_0x482149]):[],_0x5b9cd7=_0x30a01a[_0x36b4eb(0x153)](_0x36ddf0=>Number(_0x36ddf0));break;case _0x36b4eb(0x1ee):_0x5b9cd7=_0x286280[_0x482149]!==''?eval(_0x286280[_0x482149]):null;break;case _0x36b4eb(0x24d):_0x30a01a=_0x286280[_0x482149]!==''?JSON['parse'](_0x286280[_0x482149]):[],_0x5b9cd7=_0x30a01a[_0x36b4eb(0x153)](_0x2c2d97=>eval(_0x2c2d97));break;case _0x36b4eb(0x2d8):_0x5b9cd7=_0x286280[_0x482149]!==''?JSON[_0x36b4eb(0x1a5)](_0x286280[_0x482149]):'';break;case'ARRAYJSON':_0x30a01a=_0x286280[_0x482149]!==''?JSON[_0x36b4eb(0x1a5)](_0x286280[_0x482149]):[],_0x5b9cd7=_0x30a01a[_0x36b4eb(0x153)](_0x5cb5f8=>JSON[_0x36b4eb(0x1a5)](_0x5cb5f8));break;case _0x36b4eb(0x156):_0x5b9cd7=_0x286280[_0x482149]!==''?new Function(JSON[_0x36b4eb(0x1a5)](_0x286280[_0x482149])):new Function('return\x200');break;case _0x36b4eb(0x2a7):_0x30a01a=_0x286280[_0x482149]!==''?JSON[_0x36b4eb(0x1a5)](_0x286280[_0x482149]):[],_0x5b9cd7=_0x30a01a[_0x36b4eb(0x153)](_0x10ae10=>new Function(JSON[_0x36b4eb(0x1a5)](_0x10ae10)));break;case'STR':_0x5b9cd7=_0x286280[_0x482149]!==''?String(_0x286280[_0x482149]):'';break;case _0x36b4eb(0x2df):_0x30a01a=_0x286280[_0x482149]!==''?JSON[_0x36b4eb(0x1a5)](_0x286280[_0x482149]):[],_0x5b9cd7=_0x30a01a['map'](_0x33c44f=>String(_0x33c44f));break;case _0x36b4eb(0x2a1):_0x21aeca=_0x286280[_0x482149]!==''?JSON['parse'](_0x286280[_0x482149]):{},_0xea8901[_0x4974ba]={},VisuMZ[_0x36b4eb(0x180)](_0xea8901[_0x4974ba],_0x21aeca);continue;case _0x36b4eb(0x1d8):_0x30a01a=_0x286280[_0x482149]!==''?JSON['parse'](_0x286280[_0x482149]):[],_0x5b9cd7=_0x30a01a[_0x36b4eb(0x153)](_0x2ed5ce=>VisuMZ[_0x36b4eb(0x180)]({},JSON[_0x36b4eb(0x1a5)](_0x2ed5ce)));break;default:continue;}_0xea8901[_0x4974ba]=_0x5b9cd7;}}}return _0xea8901;},(_0x5cf31a=>{const _0x24eb48=_0x13d6cd,_0x3a878f=_0x5cf31a['name'];for(const _0x42b81d of dependencies){if(!Imported[_0x42b81d]){if(_0x24eb48(0x18f)===_0x24eb48(0x18f)){alert(_0x24eb48(0x1ca)[_0x24eb48(0x2c7)](_0x3a878f,_0x42b81d)),SceneManager['exit']();break;}else _0x4836f2[_0x24eb48(0x2da)][_0x24eb48(0x144)][_0x24eb48(0x23e)]['BoxFileDataJS'][_0x24eb48(0x2ce)](this,_0x3d9da7,_0x9a2a08);}}const _0x37faf7=_0x5cf31a['description'];if(_0x37faf7[_0x24eb48(0x2d3)](/\[Version[ ](.*?)\]/i)){const _0x21b981=Number(RegExp['$1']);_0x21b981!==VisuMZ[label][_0x24eb48(0x223)]&&('kVdcI'!==_0x24eb48(0x1cc)?(alert(_0x24eb48(0x184)['format'](_0x3a878f,_0x21b981)),SceneManager[_0x24eb48(0x228)]()):this[_0x24eb48(0x1c3)](_0x24eb48(0x29b)));}if(_0x37faf7['match'](/\[Tier[ ](\d+)\]/i)){const _0x475a8b=Number(RegExp['$1']);_0x475a8b<tier?_0x24eb48(0x16c)!==_0x24eb48(0x16c)?_0x279511[_0x24eb48(0x26c)]()===_0x24eb48(0x211)?this[_0x24eb48(0x14a)]():_0x5d4731['SaveCore'][_0x24eb48(0x23d)][_0x24eb48(0x2ce)](this):(alert(_0x24eb48(0x167)[_0x24eb48(0x2c7)](_0x3a878f,_0x475a8b,tier)),SceneManager[_0x24eb48(0x228)]()):_0x24eb48(0x210)!==_0x24eb48(0x29c)?tier=Math[_0x24eb48(0x236)](_0x475a8b,tier):this[_0x24eb48(0x1a9)]();}VisuMZ[_0x24eb48(0x180)](VisuMZ[label][_0x24eb48(0x144)],_0x5cf31a['parameters']);})(pluginData),PluginManager['registerCommand'](pluginData[_0x13d6cd(0x170)],_0x13d6cd(0x137),_0x3d191b=>{const _0x2edebc=_0x13d6cd;if(!DataManager[_0x2edebc(0x1aa)]())return;VisuMZ[_0x2edebc(0x180)](_0x3d191b,_0x3d191b);if($gameSystem)$gameSystem['enableAutosave'](_0x3d191b[_0x2edebc(0x2c2)]);}),PluginManager['registerCommand'](pluginData[_0x13d6cd(0x170)],_0x13d6cd(0x20e),_0x20c17d=>{const _0x115b13=_0x13d6cd;if(!DataManager[_0x115b13(0x1aa)]()||$gameParty['inBattle']())return;SceneManager[_0x115b13(0x1a6)][_0x115b13(0x13b)]();}),PluginManager[_0x13d6cd(0x251)](pluginData[_0x13d6cd(0x170)],_0x13d6cd(0x291),_0x1d540a=>{const _0x3f0651=_0x13d6cd;if(!DataManager[_0x3f0651(0x1aa)]()||$gameParty[_0x3f0651(0x18a)]())return;SceneManager[_0x3f0651(0x1a6)]['executeAutosave']();}),PluginManager[_0x13d6cd(0x251)](pluginData[_0x13d6cd(0x170)],_0x13d6cd(0x1ba),_0x57549b=>{const _0x4ba5b0=_0x13d6cd;if(!DataManager[_0x4ba5b0(0x1aa)]()||$gameParty[_0x4ba5b0(0x18a)]())return;SceneManager['_scene']['forceAutosave']();}),PluginManager['registerCommand'](pluginData['name'],_0x13d6cd(0x235),_0x36c331=>{const _0x112940=_0x13d6cd;SceneManager[_0x112940(0x1a6)][_0x112940(0x21d)]();}),PluginManager['registerCommand'](pluginData[_0x13d6cd(0x170)],_0x13d6cd(0x1e9),_0x3d255e=>{const _0x5d9c20=_0x13d6cd;VisuMZ[_0x5d9c20(0x180)](_0x3d255e,_0x3d255e);if($gameSystem)$gameSystem[_0x5d9c20(0x23c)](_0x3d255e[_0x5d9c20(0x24f)]);}),PluginManager['registerCommand'](pluginData['name'],_0x13d6cd(0x1b8),_0x4fb847=>{const _0x4dac57=_0x13d6cd;VisuMZ[_0x4dac57(0x180)](_0x4fb847,_0x4fb847);if($gameSystem)$gameSystem[_0x4dac57(0x171)](_0x4fb847[_0x4dac57(0x1b3)]);}),VisuMZ[_0x13d6cd(0x2da)][_0x13d6cd(0x1b1)]=Scene_Boot[_0x13d6cd(0x298)][_0x13d6cd(0x145)],Scene_Boot[_0x13d6cd(0x298)][_0x13d6cd(0x145)]=function(){const _0x2c56b0=_0x13d6cd;VisuMZ[_0x2c56b0(0x2da)][_0x2c56b0(0x1b1)][_0x2c56b0(0x2ce)](this),this[_0x2c56b0(0x1d4)](),this[_0x2c56b0(0x220)]();},Scene_Boot[_0x13d6cd(0x298)][_0x13d6cd(0x1d4)]=function(){const _0x42ddf2=_0x13d6cd;StorageManager[_0x42ddf2(0x26c)]()===_0x42ddf2(0x2b6)&&('imcWJ'!==_0x42ddf2(0x2cc)?_0xe3076a[_0x42ddf2(0x2da)][_0x42ddf2(0x144)][_0x42ddf2(0x23e)][_0x42ddf2(0x1a7)][_0x42ddf2(0x2ce)](this,_0x40f7b4,_0x492dcb):$dataSystem[_0x42ddf2(0x17e)]=!![]);},VisuMZ[_0x13d6cd(0x28e)]=[],VisuMZ[_0x13d6cd(0x1f9)]=[],Scene_Boot['prototype'][_0x13d6cd(0x220)]=function(){const _0x41a8c9=_0x13d6cd;for(let _0x253f3a=0x1;_0x253f3a<$dataSystem[_0x41a8c9(0x1f2)][_0x41a8c9(0x132)];_0x253f3a++){if($dataSystem[_0x41a8c9(0x1f2)][_0x253f3a][_0x41a8c9(0x2d3)](/<GLOBAL>/i))VisuMZ[_0x41a8c9(0x28e)][_0x41a8c9(0x267)](_0x253f3a);}for(let _0x2bc880=0x1;_0x2bc880<$dataSystem['variables'][_0x41a8c9(0x132)];_0x2bc880++){if($dataSystem[_0x41a8c9(0x209)][_0x2bc880][_0x41a8c9(0x2d3)](/<GLOBAL>/i))VisuMZ[_0x41a8c9(0x1f9)][_0x41a8c9(0x267)](_0x2bc880);}},VisuMZ[_0x13d6cd(0x2da)][_0x13d6cd(0x1cd)]=DataManager[_0x13d6cd(0x219)],DataManager[_0x13d6cd(0x219)]=function(){const _0x1a6a38=_0x13d6cd;VisuMZ['SaveCore'][_0x1a6a38(0x1cd)][_0x1a6a38(0x2ce)](this),Scene_File[_0x1a6a38(0x13f)]=$gameParty[_0x1a6a38(0x2cf)]();},DataManager[_0x13d6cd(0x1aa)]=function(){const _0x113259=_0x13d6cd;return!DataManager[_0x113259(0x1ec)]()&&!DataManager[_0x113259(0x2ac)]()&&$dataSystem[_0x113259(0x17e)];},DataManager[_0x13d6cd(0x1de)]=function(){const _0x32f9ed=_0x13d6cd;if(StorageManager['saveStyle']()==='single')return 0x1;let _0x51052b=VisuMZ[_0x32f9ed(0x2da)][_0x32f9ed(0x144)][_0x32f9ed(0x1e8)][_0x32f9ed(0x27f)]?0x0:0x1;return VisuMZ[_0x32f9ed(0x2da)][_0x32f9ed(0x144)]['Save'][_0x32f9ed(0x295)]+_0x51052b;},DataManager[_0x13d6cd(0x2d1)]=function(_0x222085){const _0x14b1d8=_0x13d6cd,_0x4dc99e=VisuMZ[_0x14b1d8(0x2da)][_0x14b1d8(0x144)]['Save'][_0x14b1d8(0x1c0)];return _0x4dc99e[_0x14b1d8(0x2c7)](_0x222085);},VisuMZ[_0x13d6cd(0x2da)]['DataManager_makeSavefileInfo']=DataManager['makeSavefileInfo'],DataManager[_0x13d6cd(0x1f4)]=function(){const _0x31ae95=_0x13d6cd,_0x5c9e67=VisuMZ[_0x31ae95(0x2da)][_0x31ae95(0x2d9)][_0x31ae95(0x2ce)](this);return VisuMZ[_0x31ae95(0x2da)][_0x31ae95(0x144)][_0x31ae95(0x23e)][_0x31ae95(0x1ef)]['call'](this,_0x5c9e67);},ConfigManager[_0x13d6cd(0x1bf)]=VisuMZ['SaveCore'][_0x13d6cd(0x144)][_0x13d6cd(0x2a0)][_0x13d6cd(0x195)],ConfigManager['globalSwitches']=[],ConfigManager['globalVariables']=[],VisuMZ['SaveCore']['ConfigManager_makeData']=ConfigManager[_0x13d6cd(0x20d)],ConfigManager[_0x13d6cd(0x20d)]=function(){const _0xd323d8=_0x13d6cd,_0x3508aa=VisuMZ[_0xd323d8(0x2da)][_0xd323d8(0x161)][_0xd323d8(0x2ce)](this);return _0x3508aa[_0xd323d8(0x1bf)]=this['autosave']||VisuMZ['SaveCore'][_0xd323d8(0x144)][_0xd323d8(0x2a0)]['Default'],_0x3508aa['globalSwitches']=this[_0xd323d8(0x2bd)]||[],_0x3508aa[_0xd323d8(0x227)]=this[_0xd323d8(0x227)]||[],_0x3508aa;},VisuMZ['SaveCore'][_0x13d6cd(0x2e4)]=ConfigManager['applyData'],ConfigManager['applyData']=function(_0x2fd291){const _0x299952=_0x13d6cd;VisuMZ['SaveCore']['ConfigManager_applyData'][_0x299952(0x2ce)](this,_0x2fd291),this['autosave']=_0x2fd291[_0x299952(0x1bf)]!==undefined?_0x2fd291[_0x299952(0x1bf)]:VisuMZ['SaveCore'][_0x299952(0x144)]['AutosaveOption'][_0x299952(0x195)],this[_0x299952(0x2bd)]=_0x2fd291['globalSwitches']||[],this[_0x299952(0x227)]=_0x2fd291[_0x299952(0x227)]||[];},StorageManager[_0x13d6cd(0x1ac)]=function(){const _0x450b90=_0x13d6cd;if(Utils[_0x450b90(0x29e)]())return VisuMZ[_0x450b90(0x2da)][_0x450b90(0x144)][_0x450b90(0x1e8)]['LocalMode'];else{if(_0x450b90(0x24a)!==_0x450b90(0x24a)){const _0x4d7ca1=0x0,_0x2c2b5a=0x0,_0x120fd8=this[_0x450b90(0x155)],_0x423c79=this[_0x450b90(0x25c)],_0x2b9196=_0x1acdc5[_0x450b90(0x2c6)](),_0x28be89=_0x2ef74f[_0x450b90(0x2d7)](),_0x399b4b=_0x120fd8/0x2;this['contents'][_0x450b90(0x168)](_0x4d7ca1,_0x2c2b5a,_0x399b4b,_0x423c79,_0x28be89,_0x2b9196),this[_0x450b90(0x272)][_0x450b90(0x168)](_0x4d7ca1+_0x399b4b,_0x2c2b5a,_0x399b4b,_0x423c79,_0x2b9196,_0x28be89);}else return![];}},StorageManager[_0x13d6cd(0x237)]=function(_0x45314e){const _0x15aaf2=_0x13d6cd,_0x5ba2e5=this['fileDirectoryPath'](),_0xa2c041=VisuMZ[_0x15aaf2(0x2da)][_0x15aaf2(0x144)][_0x15aaf2(0x1e8)]['ExtensionFmt'];return _0x5ba2e5+_0xa2c041[_0x15aaf2(0x2c7)](_0x45314e);},StorageManager[_0x13d6cd(0x24e)]=function(_0x1a4db3){const _0x1ce1f1=_0x13d6cd,_0x5012cb=$dataSystem[_0x1ce1f1(0x288)]['gameId'],_0xd1eadf=VisuMZ[_0x1ce1f1(0x2da)][_0x1ce1f1(0x144)][_0x1ce1f1(0x1e8)]['KeyFmt'];return _0xd1eadf[_0x1ce1f1(0x2c7)](_0x5012cb,_0x1a4db3);},StorageManager[_0x13d6cd(0x2d2)]=function(){const _0x2af3f8=_0x13d6cd;return VisuMZ[_0x2af3f8(0x2da)][_0x2af3f8(0x144)][_0x2af3f8(0x1e8)][_0x2af3f8(0x24b)];},StorageManager[_0x13d6cd(0x26c)]=function(){const _0x5e9897=_0x13d6cd;return VisuMZ[_0x5e9897(0x2da)][_0x5e9897(0x144)][_0x5e9897(0x1e8)][_0x5e9897(0x165)];},StorageManager['autosaveType']=function(){const _0x438ed2=_0x13d6cd;return this[_0x438ed2(0x26c)]()===_0x438ed2(0x2b6)?_0x438ed2(0x1cb):'sXFrT'!==_0x438ed2(0x1d1)?VisuMZ['SaveCore'][_0x438ed2(0x144)][_0x438ed2(0x17f)]['AutosaveType']:_0x2e3b27['SaveCore'][_0x438ed2(0x144)][_0x438ed2(0x17f)][_0x438ed2(0x281)];},TextManager[_0x13d6cd(0x1d2)]=VisuMZ[_0x13d6cd(0x2da)][_0x13d6cd(0x144)][_0x13d6cd(0x1e8)]['VocabLockedSaveSlot'],TextManager[_0x13d6cd(0x1d3)]=VisuMZ[_0x13d6cd(0x2da)]['Settings'][_0x13d6cd(0x17b)][_0x13d6cd(0x1eb)],TextManager[_0x13d6cd(0x1c9)]=VisuMZ[_0x13d6cd(0x2da)][_0x13d6cd(0x144)]['SaveConfirm'][_0x13d6cd(0x201)],TextManager['loadFailure']=VisuMZ[_0x13d6cd(0x2da)][_0x13d6cd(0x144)][_0x13d6cd(0x17b)]['VocabLoadFailure'],TextManager[_0x13d6cd(0x2c8)]=VisuMZ[_0x13d6cd(0x2da)][_0x13d6cd(0x144)][_0x13d6cd(0x2a0)][_0x13d6cd(0x19d)],TextManager[_0x13d6cd(0x243)]=VisuMZ[_0x13d6cd(0x2da)]['Settings'][_0x13d6cd(0x252)][_0x13d6cd(0x185)],TextManager[_0x13d6cd(0x1e7)]=VisuMZ['SaveCore'][_0x13d6cd(0x144)][_0x13d6cd(0x252)]['VocabAutosaveFailure'],TextManager[_0x13d6cd(0x28b)]=VisuMZ[_0x13d6cd(0x2da)]['Settings'][_0x13d6cd(0x23e)][_0x13d6cd(0x208)],ColorManager[_0x13d6cd(0x2bc)]=function(){const _0x3dd516=_0x13d6cd,_0x2300ef=_0x3dd516(0x2e2);this['_colorCache']=this['_colorCache']||{};if(this[_0x3dd516(0x239)][_0x2300ef])return this[_0x3dd516(0x239)][_0x2300ef];const _0x44e36b=VisuMZ[_0x3dd516(0x2da)]['Settings']['SaveMenu']['LatestColor'];return this[_0x3dd516(0x19e)](_0x2300ef,_0x44e36b);},ColorManager['getColorDataFromPluginParameters']=function(_0x5ead70,_0x48f7b5){const _0x97ecac=_0x13d6cd;_0x48f7b5=String(_0x48f7b5),this[_0x97ecac(0x239)]=this['_colorCache']||{};if(_0x48f7b5[_0x97ecac(0x2d3)](/#(.*)/i))this[_0x97ecac(0x239)][_0x5ead70]=_0x97ecac(0x248)[_0x97ecac(0x2c7)](String(RegExp['$1']));else{if('YViFy'!==_0x97ecac(0x142))return _0x15f125[_0x97ecac(0x2da)][_0x97ecac(0x144)]['AutosaveConfirm'][_0x97ecac(0x2c2)];else this[_0x97ecac(0x239)][_0x5ead70]=this[_0x97ecac(0x14d)](Number(_0x48f7b5));}return this[_0x97ecac(0x239)][_0x5ead70];},VisuMZ[_0x13d6cd(0x2da)][_0x13d6cd(0x1f6)]=Game_System[_0x13d6cd(0x298)][_0x13d6cd(0x1c4)],Game_System[_0x13d6cd(0x298)][_0x13d6cd(0x1c4)]=function(){const _0x4bb06c=_0x13d6cd;VisuMZ[_0x4bb06c(0x2da)][_0x4bb06c(0x1f6)]['call'](this),this['initSaveCore']();},Game_System[_0x13d6cd(0x298)][_0x13d6cd(0x15d)]=function(){const _0x4094a7=_0x13d6cd;this['_SaveCoreSettings']={'autosaveEnabled':VisuMZ[_0x4094a7(0x2da)][_0x4094a7(0x144)][_0x4094a7(0x17f)][_0x4094a7(0x1f1)],'saveDescription':'','savePicture':''};},Game_System['prototype']['isAutosaveEnabled']=function(){const _0x303fe9=_0x13d6cd;if(!$dataSystem[_0x303fe9(0x17e)])return![];if(this[_0x303fe9(0x21c)]===undefined)this[_0x303fe9(0x15d)]();if(this[_0x303fe9(0x21c)][_0x303fe9(0x225)]===undefined)this[_0x303fe9(0x15d)]();return this['_SaveCoreSettings'][_0x303fe9(0x225)];},Game_System['prototype'][_0x13d6cd(0x234)]=function(_0x34d4bd){const _0x5aae20=_0x13d6cd;if(!$dataSystem[_0x5aae20(0x17e)])return;if(this[_0x5aae20(0x21c)]===undefined)this[_0x5aae20(0x15d)]();if(this['_SaveCoreSettings'][_0x5aae20(0x225)]===undefined)this[_0x5aae20(0x15d)]();this['_SaveCoreSettings'][_0x5aae20(0x225)]=_0x34d4bd;},Game_System[_0x13d6cd(0x298)][_0x13d6cd(0x1ae)]=function(){const _0x47f002=_0x13d6cd;if(this[_0x47f002(0x21c)]===undefined)this[_0x47f002(0x15d)]();if(this[_0x47f002(0x21c)][_0x47f002(0x1e3)]===undefined)this['initSaveCore']();return this[_0x47f002(0x21c)]['saveDescription'];},Game_System[_0x13d6cd(0x298)][_0x13d6cd(0x23c)]=function(_0x5a4487){const _0x337763=_0x13d6cd;if(this[_0x337763(0x21c)]===undefined)this[_0x337763(0x15d)]();if(this[_0x337763(0x21c)][_0x337763(0x1e3)]===undefined)this[_0x337763(0x15d)]();this[_0x337763(0x21c)][_0x337763(0x1e3)]=VisuMZ[_0x337763(0x2da)][_0x337763(0x2cb)](_0x5a4487);},VisuMZ[_0x13d6cd(0x2da)]['ParseTextCodes']=function(_0xede80f){const _0x29dde6=_0x13d6cd;while(_0xede80f['match'](/\\V\[(\d+)\]/gi)){if(_0x29dde6(0x25d)===_0x29dde6(0x15f))return _0x4654d5[_0x29dde6(0x1d2)];else _0xede80f=_0xede80f[_0x29dde6(0x1b4)](/\\V\[(\d+)\]/gi,(_0x4e9302,_0x402350)=>$gameVariables[_0x29dde6(0x260)](parseInt(_0x402350)));}while(_0xede80f[_0x29dde6(0x2d3)](/\\N\[(\d+)\]/gi)){_0xede80f=_0xede80f[_0x29dde6(0x1b4)](/\\N\[(\d+)\]/gi,(_0x4c5b8c,_0x49f9e1)=>Window_Base[_0x29dde6(0x298)][_0x29dde6(0x2b2)](parseInt(_0x49f9e1)));}while(_0xede80f['match'](/\\P\[(\d+)\]/gi)){_0x29dde6(0x146)!==_0x29dde6(0x146)?_0x2b6fa0[_0x29dde6(0x2da)][_0x29dde6(0x144)][_0x29dde6(0x23e)][_0x29dde6(0x1f3)][_0x29dde6(0x2ce)](this,_0x27e563,_0x51701c):_0xede80f=_0xede80f[_0x29dde6(0x1b4)](/\\P\[(\d+)\]/gi,(_0x3d3b54,_0x190a03)=>Window_Base[_0x29dde6(0x298)]['partyMemberName'](parseInt(_0x190a03)));}return _0xede80f;},Game_System[_0x13d6cd(0x298)][_0x13d6cd(0x249)]=function(){const _0x2921b1=_0x13d6cd;if(this['_SaveCoreSettings']===undefined)this[_0x2921b1(0x15d)]();if(this[_0x2921b1(0x21c)]['savePicture']===undefined)this['initSaveCore']();return this['_SaveCoreSettings']['savePicture'];},Game_System[_0x13d6cd(0x298)]['setSavePicture']=function(_0x2691b2){const _0x966b81=_0x13d6cd;if(this['_SaveCoreSettings']===undefined)this['initSaveCore']();if(this[_0x966b81(0x21c)][_0x966b81(0x19b)]===undefined)this[_0x966b81(0x15d)]();this['_SaveCoreSettings'][_0x966b81(0x19b)]=_0x2691b2;},VisuMZ['SaveCore'][_0x13d6cd(0x266)]=Game_System[_0x13d6cd(0x298)][_0x13d6cd(0x22d)],Game_System[_0x13d6cd(0x298)][_0x13d6cd(0x22d)]=function(){const _0x402182=_0x13d6cd,_0x12d83e=StorageManager[_0x402182(0x26c)]();switch(_0x12d83e){case'locked':return VisuMZ[_0x402182(0x2da)][_0x402182(0x266)]['call'](this)||0x1;break;case _0x402182(0x2b6):return 0x0;break;default:return VisuMZ[_0x402182(0x2da)][_0x402182(0x266)][_0x402182(0x2ce)](this);break;}},Game_Switches['prototype']['isGlobal']=function(_0x2bee9f){const _0x720cd0=_0x13d6cd;return $dataSystem[_0x720cd0(0x1f2)][_0x2bee9f]&&VisuMZ[_0x720cd0(0x28e)]['includes'](_0x2bee9f);},VisuMZ[_0x13d6cd(0x2da)]['Game_Switches_value']=Game_Switches['prototype'][_0x13d6cd(0x260)],Game_Switches[_0x13d6cd(0x298)]['value']=function(_0x1877ac){const _0x4d50da=_0x13d6cd;return this[_0x4d50da(0x2c5)](_0x1877ac)?this[_0x4d50da(0x27c)](_0x1877ac):VisuMZ['SaveCore'][_0x4d50da(0x1a1)][_0x4d50da(0x2ce)](this,_0x1877ac);},Game_Switches[_0x13d6cd(0x298)][_0x13d6cd(0x27c)]=function(_0x206652){const _0xafe834=_0x13d6cd;return ConfigManager[_0xafe834(0x2bd)]=ConfigManager[_0xafe834(0x2bd)]||[],!!ConfigManager[_0xafe834(0x2bd)][_0x206652];},VisuMZ[_0x13d6cd(0x2da)][_0x13d6cd(0x262)]=Game_Switches[_0x13d6cd(0x298)][_0x13d6cd(0x1f7)],Game_Switches[_0x13d6cd(0x298)][_0x13d6cd(0x1f7)]=function(_0x3288db,_0x5d612c){const _0x1ef02e=_0x13d6cd;if(this[_0x1ef02e(0x2c5)](_0x3288db))this[_0x1ef02e(0x1d0)](_0x3288db,_0x5d612c);VisuMZ[_0x1ef02e(0x2da)][_0x1ef02e(0x262)]['call'](this,_0x3288db,_0x5d612c);},Game_Switches[_0x13d6cd(0x298)][_0x13d6cd(0x1d0)]=function(_0x4c3533,_0x7a1513){const _0x467287=_0x13d6cd;_0x4c3533>0x0&&_0x4c3533<$dataSystem[_0x467287(0x1f2)][_0x467287(0x132)]&&(ConfigManager[_0x467287(0x2bd)]=ConfigManager[_0x467287(0x2bd)]||[],ConfigManager[_0x467287(0x2bd)][_0x4c3533]=_0x7a1513,ConfigManager[_0x467287(0x206)]());},Game_Variables[_0x13d6cd(0x298)][_0x13d6cd(0x2c5)]=function(_0x418ef3){const _0x56040f=_0x13d6cd;return $dataSystem['variables'][_0x418ef3]&&VisuMZ[_0x56040f(0x1f9)]['includes'](_0x418ef3);},VisuMZ['SaveCore']['Game_Variables_value']=Game_Variables[_0x13d6cd(0x298)][_0x13d6cd(0x260)],Game_Variables['prototype'][_0x13d6cd(0x260)]=function(_0x4f8660){const _0x21e105=_0x13d6cd;if(this[_0x21e105(0x2c5)](_0x4f8660))return _0x21e105(0x27d)===_0x21e105(0x27d)?this[_0x21e105(0x27c)](_0x4f8660):_0x3e9665[_0x21e105(0x1f2)][_0x20bf91]&&_0x2f6d10[_0x21e105(0x28e)]['includes'](_0x426769);else{if(_0x21e105(0x218)!==_0x21e105(0x218)){if(this[_0x21e105(0x21c)]===_0x33e87a)this[_0x21e105(0x15d)]();if(this[_0x21e105(0x21c)][_0x21e105(0x1e3)]===_0x58d8d6)this[_0x21e105(0x15d)]();return this[_0x21e105(0x21c)][_0x21e105(0x1e3)];}else return VisuMZ[_0x21e105(0x2da)][_0x21e105(0x1c6)][_0x21e105(0x2ce)](this,_0x4f8660);}},Game_Variables['prototype'][_0x13d6cd(0x27c)]=function(_0x111aa7){const _0x159f6e=_0x13d6cd;return ConfigManager[_0x159f6e(0x227)]=ConfigManager[_0x159f6e(0x227)]||[],ConfigManager[_0x159f6e(0x227)][_0x111aa7]===undefined&&('rUEIn'!=='epuhc'?ConfigManager[_0x159f6e(0x227)][_0x111aa7]=0x0:_0x1f6857[_0x159f6e(0x2da)][_0x159f6e(0x21b)][_0x159f6e(0x2ce)](this,_0x583eaa)),ConfigManager['globalVariables'][_0x111aa7];},VisuMZ['SaveCore'][_0x13d6cd(0x1f5)]=Game_Variables['prototype'][_0x13d6cd(0x1f7)],Game_Variables[_0x13d6cd(0x298)][_0x13d6cd(0x1f7)]=function(_0x49b2df,_0x3ce3f0){const _0xa5f27f=_0x13d6cd;if(this[_0xa5f27f(0x2c5)](_0x49b2df))this[_0xa5f27f(0x1d0)](_0x49b2df,_0x3ce3f0);VisuMZ['SaveCore'][_0xa5f27f(0x1f5)][_0xa5f27f(0x2ce)](this,_0x49b2df,_0x3ce3f0);},Game_Variables['prototype'][_0x13d6cd(0x1d0)]=function(_0x12e99f,_0xa83489){const _0x392b63=_0x13d6cd;if(_0x12e99f>0x0&&_0x12e99f<$dataSystem[_0x392b63(0x209)][_0x392b63(0x132)]){if(_0x392b63(0x13e)!=='WhRIB'){ConfigManager[_0x392b63(0x227)]=ConfigManager[_0x392b63(0x227)]||[];if(typeof _0xa83489===_0x392b63(0x274))_0xa83489=Math[_0x392b63(0x163)](_0xa83489);ConfigManager['globalVariables'][_0x12e99f]=_0xa83489,ConfigManager['save']();}else _0xb97680[_0x392b63(0x2da)][_0x392b63(0x1f6)]['call'](this),this[_0x392b63(0x15d)]();}},Game_Party[_0x13d6cd(0x298)][_0x13d6cd(0x2a2)]=function(){const _0x2deacc=_0x13d6cd;return this[_0x2deacc(0x1af)]()[_0x2deacc(0x153)](_0x152b4d=>_0x152b4d[_0x2deacc(0x175)]());},Scene_Base[_0x13d6cd(0x298)]['determineAutosaveBypass']=function(_0x5695e0){const _0x3608ed=_0x13d6cd,_0x2834e5=VisuMZ[_0x3608ed(0x2da)][_0x3608ed(0x144)][_0x3608ed(0x17f)];switch(_0x5695e0){case _0x3608ed(0x1b0):this['_bypassAutosave']=!_0x2834e5[_0x3608ed(0x20a)];break;case _0x3608ed(0x29b):if(!this[_0x3608ed(0x166)]())return;this['_bypassAutosave']=!_0x2834e5[_0x3608ed(0x280)];break;case _0x3608ed(0x152):this[_0x3608ed(0x282)]=!_0x2834e5[_0x3608ed(0x226)];break;case _0x3608ed(0x2c1):this[_0x3608ed(0x282)]=!_0x2834e5[_0x3608ed(0x279)];break;}},VisuMZ[_0x13d6cd(0x2da)][_0x13d6cd(0x26e)]=Scene_Base[_0x13d6cd(0x298)][_0x13d6cd(0x13b)],Scene_Base[_0x13d6cd(0x298)][_0x13d6cd(0x13b)]=function(){const _0xb45684=_0x13d6cd;!this[_0xb45684(0x282)]&&(_0xb45684(0x231)==='mDSJk'?VisuMZ[_0xb45684(0x2da)][_0xb45684(0x26e)][_0xb45684(0x2ce)](this):(this[_0xb45684(0x178)][_0xb45684(0x17d)](),_0x4012bb['playLoad'](),this[_0xb45684(0x16d)](),_0x447698[_0xb45684(0x298)][_0xb45684(0x22b)](),_0x11bf16['goto'](_0x210c4b),this[_0xb45684(0x2d0)]=!![],_0x2e4dcd[_0xb45684(0x2da)]['Settings'][_0xb45684(0x1e8)][_0xb45684(0x287)]['call'](this))),this[_0xb45684(0x282)]=![];},Scene_Base[_0x13d6cd(0x298)][_0x13d6cd(0x1e6)]=function(){const _0x415fd4=_0x13d6cd;return!DataManager[_0x415fd4(0x1ec)]()&&!DataManager[_0x415fd4(0x2ac)]()&&$gameSystem[_0x415fd4(0x1e6)]()&&(VisuMZ[_0x415fd4(0x2da)][_0x415fd4(0x144)][_0x415fd4(0x17f)][_0x415fd4(0x15a)]?$gameSystem[_0x415fd4(0x26b)]():!![]);},Scene_Base[_0x13d6cd(0x298)][_0x13d6cd(0x2ca)]=function(){const _0x15e767=_0x13d6cd;if(!ConfigManager['autosave'])return;this[_0x15e767(0x197)]();},Scene_Base['prototype']['forceAutosave']=function(){const _0x1562a8=_0x13d6cd;$gameSystem[_0x1562a8(0x1bb)](),this[_0x1562a8(0x14b)]=![];const _0x52247c=StorageManager[_0x1562a8(0x2b4)]();[_0x1562a8(0x1cb),_0x1562a8(0x257)]['includes'](_0x52247c)&&DataManager[_0x1562a8(0x190)](0x0)['then'](()=>this['onAutosaveSuccess']())[_0x1562a8(0x2a5)](()=>this['onAutosaveFailure']());if([_0x1562a8(0x134),_0x1562a8(0x257)][_0x1562a8(0x212)](_0x52247c)){const _0x5d7639=$gameSystem['savefileId']();if(_0x5d7639>0x0){if(_0x1562a8(0x233)==='YjXUB'){if(!_0x3ae7ac['autosave'])return;this['forceAutosave']();}else DataManager['saveGame'](_0x5d7639)['then'](()=>this[_0x1562a8(0x2cd)]())['catch'](()=>this['onAutosaveFailure']());}}this[_0x1562a8(0x14b)]=![];},VisuMZ[_0x13d6cd(0x2da)]['Scene_Base_onAutosaveSuccess']=Scene_Base[_0x13d6cd(0x298)][_0x13d6cd(0x2cd)],Scene_Base[_0x13d6cd(0x298)][_0x13d6cd(0x2cd)]=function(){const _0x249c83=_0x13d6cd;if(this[_0x249c83(0x14b)])return;VisuMZ[_0x249c83(0x2da)]['Scene_Base_onAutosaveSuccess'][_0x249c83(0x2ce)](this),VisuMZ[_0x249c83(0x2da)]['Settings'][_0x249c83(0x17f)]['OnAutosaveSuccessJS']['call'](this),this[_0x249c83(0x198)](!![]),this[_0x249c83(0x14b)]=!![];},VisuMZ['SaveCore']['Scene_Base_onAutosaveFailure']=Scene_Base[_0x13d6cd(0x298)][_0x13d6cd(0x2ad)],Scene_Base[_0x13d6cd(0x298)]['onAutosaveFailure']=function(){const _0x40f2ee=_0x13d6cd;if(this[_0x40f2ee(0x14b)])return;VisuMZ[_0x40f2ee(0x2da)]['Scene_Base_onAutosaveFailure'][_0x40f2ee(0x2ce)](this),VisuMZ[_0x40f2ee(0x2da)]['Settings']['Autosave'][_0x40f2ee(0x191)][_0x40f2ee(0x2ce)](this),this['openAutosaveConfirmationWindow'](![]);},Scene_Base['prototype'][_0x13d6cd(0x277)]=function(){const _0x44285c=_0x13d6cd;if(this[_0x44285c(0x141)])return;const _0x1062d4=this[_0x44285c(0x151)]();this[_0x44285c(0x141)]=new Window_Base(_0x1062d4),this['_saveConfirmWindow']['openness']=0x0;},Scene_Base['prototype']['saveConfirmationWindowRect']=function(){const _0x54ef51=_0x13d6cd;return VisuMZ[_0x54ef51(0x2da)][_0x54ef51(0x144)][_0x54ef51(0x17b)][_0x54ef51(0x1a2)][_0x54ef51(0x2ce)](this);},Scene_Base[_0x13d6cd(0x298)]['isSaveConfirmWindowEnabled']=function(){const _0x28e5ea=_0x13d6cd;return VisuMZ[_0x28e5ea(0x2da)][_0x28e5ea(0x144)]['SaveConfirm'][_0x28e5ea(0x2c2)];},Scene_Base[_0x13d6cd(0x298)][_0x13d6cd(0x1bc)]=function(_0x4ab437,_0x440eb7){const _0x3b4658=_0x13d6cd;if(!this[_0x3b4658(0x1fd)]())return this[_0x3b4658(0x2e1)](_0x4ab437);if(!this[_0x3b4658(0x141)])this[_0x3b4658(0x277)]();const _0x1a7c63=this[_0x3b4658(0x141)];this[_0x3b4658(0x247)](_0x1a7c63),this[_0x3b4658(0x2b5)](_0x1a7c63),_0x1a7c63[_0x3b4658(0x268)](),_0x1a7c63[_0x3b4658(0x241)](),_0x1a7c63[_0x3b4658(0x272)][_0x3b4658(0x22e)]();let _0x3119e3='';_0x440eb7?'QXGzZ'===_0x3b4658(0x16a)?_0x3119e3=TextManager[_0x3b4658(0x181)]:(_0x564222[_0x3b4658(0x177)](),_0x125b09['SaveCore'][_0x3b4658(0x144)][_0x3b4658(0x1e8)][_0x3b4658(0x2bb)][_0x3b4658(0x2ce)](this),this['openSaveConfirmationWindow'](![])):_0x3119e3=_0x4ab437?TextManager[_0x3b4658(0x1d3)]:TextManager['saveFailure'];const _0x3d809c=_0x1a7c63['textSizeEx'](_0x3119e3)[_0x3b4658(0x265)],_0x2c4e5b=(_0x1a7c63[_0x3b4658(0x155)]-_0x3d809c)/0x2;_0x1a7c63[_0x3b4658(0x28f)](_0x3119e3,_0x2c4e5b,0x0,_0x3d809c);const _0x2cd83c=VisuMZ[_0x3b4658(0x2da)]['Settings']['SaveConfirm'][_0x3b4658(0x164)];setTimeout(this[_0x3b4658(0x2e1)]['bind'](this,_0x4ab437),_0x2cd83c);},Scene_Base[_0x13d6cd(0x298)][_0x13d6cd(0x139)]=function(){const _0x185566=_0x13d6cd;this[_0x185566(0x1bc)](![],!![]);},Scene_Base[_0x13d6cd(0x298)][_0x13d6cd(0x2e1)]=function(_0x2f6d52){const _0x55bdc0=_0x13d6cd;if(this[_0x55bdc0(0x141)])this[_0x55bdc0(0x141)][_0x55bdc0(0x17d)]();},Scene_Base[_0x13d6cd(0x298)][_0x13d6cd(0x289)]=function(){const _0x2cb724=_0x13d6cd;if(this[_0x2cb724(0x1ad)])return;const _0x3123fd=this[_0x2cb724(0x14e)]();this[_0x2cb724(0x1ad)]=new Window_AutosaveConfirm(_0x3123fd);},Scene_Base[_0x13d6cd(0x298)][_0x13d6cd(0x14e)]=function(){const _0x40b983=_0x13d6cd,_0x47b6d6=this[_0x40b983(0x276)](),_0x1e4e0d=this[_0x40b983(0x157)](0x1,![]),_0x410192=Graphics[_0x40b983(0x265)]-_0x47b6d6,_0x28f95b=Graphics[_0x40b983(0x1f0)]-_0x1e4e0d;return new Rectangle(_0x410192,_0x28f95b,_0x47b6d6,_0x1e4e0d);},Scene_Base['prototype'][_0x13d6cd(0x18e)]=function(){const _0x342640=_0x13d6cd;return VisuMZ['SaveCore'][_0x342640(0x144)][_0x342640(0x252)][_0x342640(0x2c2)];},Scene_Base[_0x13d6cd(0x298)][_0x13d6cd(0x198)]=function(_0x7d7f91){const _0x1fd71f=_0x13d6cd;if(!this['isAutosaveConfirmWindowEnabled']())return this[_0x1fd71f(0x2e3)](_0x7d7f91);if(!this[_0x1fd71f(0x1ad)])this[_0x1fd71f(0x289)]();const _0x608cc2=this[_0x1fd71f(0x1ad)];this['removeChild'](_0x608cc2),this[_0x1fd71f(0x2b5)](_0x608cc2),_0x608cc2['setSetSuccess'](_0x7d7f91),_0x608cc2['fadeIn']();const _0x11a954=VisuMZ[_0x1fd71f(0x2da)][_0x1fd71f(0x144)][_0x1fd71f(0x17b)][_0x1fd71f(0x164)];setTimeout(this[_0x1fd71f(0x2e3)][_0x1fd71f(0x259)](this,_0x7d7f91),_0x11a954);},Scene_Base[_0x13d6cd(0x298)]['closeAutosaveConfirmationWindow']=function(_0x328d16){const _0x15a6f7=_0x13d6cd;if(this['_autosaveConfirmWindow'])this['_autosaveConfirmWindow'][_0x15a6f7(0x258)]();},Scene_Base[_0x13d6cd(0x298)][_0x13d6cd(0x21d)]=function(){},VisuMZ[_0x13d6cd(0x2da)][_0x13d6cd(0x290)]=Scene_Title[_0x13d6cd(0x298)]['initialize'],Scene_Title['prototype']['initialize']=function(){const _0x59ee2d=_0x13d6cd;VisuMZ[_0x59ee2d(0x2da)]['Scene_Title_initialize']['call'](this),this[_0x59ee2d(0x2d0)]=![];},VisuMZ[_0x13d6cd(0x2da)][_0x13d6cd(0x140)]=Scene_Title[_0x13d6cd(0x298)][_0x13d6cd(0x2b0)],Scene_Title['prototype']['terminate']=function(){const _0x3caf6c=_0x13d6cd;VisuMZ[_0x3caf6c(0x2da)][_0x3caf6c(0x140)][_0x3caf6c(0x2ce)](this);if(this[_0x3caf6c(0x2d0)])$gameSystem[_0x3caf6c(0x1a3)]();},VisuMZ[_0x13d6cd(0x2da)][_0x13d6cd(0x23d)]=Scene_Title[_0x13d6cd(0x298)]['commandNewGame'],Scene_Title[_0x13d6cd(0x298)][_0x13d6cd(0x2a6)]=function(){const _0x5e3fd9=_0x13d6cd;if(StorageManager[_0x5e3fd9(0x26c)]()===_0x5e3fd9(0x211))this['commandNewGameSaveCoreLocked']();else{if(_0x5e3fd9(0x169)===_0x5e3fd9(0x169))VisuMZ[_0x5e3fd9(0x2da)]['Scene_Title_commandNewGame'][_0x5e3fd9(0x2ce)](this);else{if(!_0x4b80cd[_0x5e3fd9(0x1aa)]()||_0x50de7c[_0x5e3fd9(0x18a)]())return;_0x4df9ac[_0x5e3fd9(0x1a6)]['forceAutosave']();}}},Scene_Title[_0x13d6cd(0x298)][_0x13d6cd(0x14a)]=function(){const _0x5d5492=_0x13d6cd;DataManager['setupNewGame'](),$gameTemp[_0x5d5492(0x194)]=!![],this[_0x5d5492(0x178)]['close'](),SceneManager[_0x5d5492(0x267)](Scene_Save);},VisuMZ['SaveCore']['Scene_Title_commandContinue']=Scene_Title[_0x13d6cd(0x298)][_0x13d6cd(0x21e)],Scene_Title[_0x13d6cd(0x298)][_0x13d6cd(0x21e)]=function(){const _0xb10f8f=_0x13d6cd;StorageManager[_0xb10f8f(0x26c)]()===_0xb10f8f(0x2b6)?this[_0xb10f8f(0x216)]():VisuMZ['SaveCore'][_0xb10f8f(0x269)]['call'](this);},Scene_Title[_0x13d6cd(0x298)][_0x13d6cd(0x216)]=function(){const _0x208a0d=_0x13d6cd;DataManager['loadGame'](0x0)[_0x208a0d(0x253)](()=>this[_0x208a0d(0x246)]())[_0x208a0d(0x2a5)](()=>this[_0x208a0d(0x21a)]());},Scene_Title[_0x13d6cd(0x298)]['onSaveCoreLoadSuccess']=function(){const _0x55956c=_0x13d6cd;this[_0x55956c(0x178)][_0x55956c(0x17d)](),SoundManager['playLoad'](),this['fadeOutAll'](),Scene_Load['prototype']['reloadMapIfUpdated'](),SceneManager[_0x55956c(0x22f)](Scene_Map),this['_loadSuccess']=!![],VisuMZ[_0x55956c(0x2da)][_0x55956c(0x144)][_0x55956c(0x1e8)][_0x55956c(0x287)]['call'](this);},Scene_Title[_0x13d6cd(0x298)][_0x13d6cd(0x21a)]=function(){const _0x31b3ba=_0x13d6cd;SoundManager[_0x31b3ba(0x177)](),VisuMZ[_0x31b3ba(0x2da)][_0x31b3ba(0x144)][_0x31b3ba(0x1e8)][_0x31b3ba(0x29a)][_0x31b3ba(0x2ce)](this),this[_0x31b3ba(0x139)]();},Scene_Title[_0x13d6cd(0x298)][_0x13d6cd(0x2e1)]=function(_0x35f703){const _0x57b608=_0x13d6cd;Scene_Base[_0x57b608(0x298)][_0x57b608(0x2e1)][_0x57b608(0x2ce)](this,_0x35f703),this[_0x57b608(0x178)][_0x57b608(0x268)](),this[_0x57b608(0x178)]['activate']();},VisuMZ[_0x13d6cd(0x2da)][_0x13d6cd(0x207)]=Scene_Map[_0x13d6cd(0x298)][_0x13d6cd(0x1f8)],Scene_Map[_0x13d6cd(0x298)]['onMapLoaded']=function(){const _0x41dda7=_0x13d6cd;VisuMZ[_0x41dda7(0x2da)][_0x41dda7(0x207)][_0x41dda7(0x2ce)](this);if(SceneManager[_0x41dda7(0x1a4)](Scene_Menu)){if('AxJbH'!=='AxJbH')return _0xa7448a[_0x41dda7(0x1d7)]?_0x462006[_0x41dda7(0x298)][_0x41dda7(0x20f)][_0x41dda7(0x2ce)](this,_0x406780):'';else this[_0x41dda7(0x1c3)]('exitMenu'),this[_0x41dda7(0x13b)]();}else SceneManager[_0x41dda7(0x1a4)](Scene_Battle)&&(this['determineAutosaveBypass'](_0x41dda7(0x1b0)),this[_0x41dda7(0x13b)]());},VisuMZ[_0x13d6cd(0x2da)][_0x13d6cd(0x25a)]=Scene_Map[_0x13d6cd(0x298)][_0x13d6cd(0x147)],Scene_Map[_0x13d6cd(0x298)][_0x13d6cd(0x147)]=function(){const _0x268f33=_0x13d6cd;if(this['shouldAutosave']()){if(_0x268f33(0x28c)!==_0x268f33(0x28c)){while(_0x14ecd6[_0x268f33(0x2d3)](/\\V\[(\d+)\]/gi)){_0x4d5fdb=_0x2e9804[_0x268f33(0x1b4)](/\\V\[(\d+)\]/gi,(_0x4eb90e,_0xa718ea)=>_0x1c78ce[_0x268f33(0x260)](_0x5d2d3d(_0xa718ea)));}while(_0x3c2876[_0x268f33(0x2d3)](/\\N\[(\d+)\]/gi)){_0x51dc8c=_0x260b8d[_0x268f33(0x1b4)](/\\N\[(\d+)\]/gi,(_0x21979a,_0xa375f9)=>_0x3d43cd[_0x268f33(0x298)][_0x268f33(0x2b2)](_0x4070c6(_0xa375f9)));}while(_0x43ecbb[_0x268f33(0x2d3)](/\\P\[(\d+)\]/gi)){_0x9809d7=_0x3c1221['replace'](/\\P\[(\d+)\]/gi,(_0x567d28,_0x34223c)=>_0x44dc10['prototype'][_0x268f33(0x138)](_0x405a63(_0x34223c)));}return _0x14d1b8;}else this[_0x268f33(0x1c3)](_0x268f33(0x29b));}VisuMZ[_0x268f33(0x2da)]['Scene_Map_onTransferEnd']['call'](this);},Scene_Map['prototype']['saveCurrentSlot']=function(){const _0x103f33=_0x13d6cd;if($gameSystem[_0x103f33(0x278)])return;const _0x15cf37=$gameSystem[_0x103f33(0x22d)]();if(StorageManager[_0x103f33(0x26c)]()!==_0x103f33(0x2b6)&&_0x15cf37<=0x0)return;this[_0x103f33(0x174)]=![],$gameSystem[_0x103f33(0x1bd)](_0x15cf37),$gameSystem[_0x103f33(0x1bb)](),$gameSystem[_0x103f33(0x278)]=!![],DataManager['saveGame'](_0x15cf37)[_0x103f33(0x253)](()=>this[_0x103f33(0x2b8)]())[_0x103f33(0x2a5)](()=>this[_0x103f33(0x294)]()),$gameSystem[_0x103f33(0x278)]=undefined;},Scene_Map[_0x13d6cd(0x298)][_0x13d6cd(0x2b8)]=function(){const _0x39397e=_0x13d6cd;SoundManager[_0x39397e(0x2b3)](),VisuMZ[_0x39397e(0x2da)][_0x39397e(0x144)][_0x39397e(0x1e8)]['OnSaveSuccessJS'][_0x39397e(0x2ce)](this),this['openSaveConfirmationWindow'](!![]);},Scene_Map[_0x13d6cd(0x298)][_0x13d6cd(0x294)]=function(){const _0x5ea3d5=_0x13d6cd;SoundManager[_0x5ea3d5(0x177)](),VisuMZ['SaveCore'][_0x5ea3d5(0x144)][_0x5ea3d5(0x1e8)][_0x5ea3d5(0x2bb)][_0x5ea3d5(0x2ce)](this),this[_0x5ea3d5(0x1bc)](![]);},Scene_Map[_0x13d6cd(0x298)][_0x13d6cd(0x2e1)]=function(_0x173eb2){const _0x26b73c=_0x13d6cd;Scene_Message['prototype'][_0x26b73c(0x2e1)][_0x26b73c(0x2ce)](this,_0x173eb2),this[_0x26b73c(0x174)]=!![];},VisuMZ[_0x13d6cd(0x2da)][_0x13d6cd(0x1a0)]=Scene_Menu['prototype'][_0x13d6cd(0x1dd)],Scene_Menu[_0x13d6cd(0x298)]['create']=function(){const _0x1d0d10=_0x13d6cd;VisuMZ[_0x1d0d10(0x2da)][_0x1d0d10(0x1a0)]['call'](this);if(SceneManager[_0x1d0d10(0x1a4)](Scene_Map)){if('RPabU'===_0x1d0d10(0x263))return _0xb0247e[_0x1d0d10(0x2da)][_0x1d0d10(0x144)]['SaveMenuStyle'];else this[_0x1d0d10(0x1c3)]('callMenu'),this[_0x1d0d10(0x13b)]();}},VisuMZ['SaveCore'][_0x13d6cd(0x2c3)]=Scene_Menu[_0x13d6cd(0x298)][_0x13d6cd(0x1b9)],Scene_Menu[_0x13d6cd(0x298)][_0x13d6cd(0x1b9)]=function(){const _0x145cc9=_0x13d6cd,_0x4580a3=StorageManager[_0x145cc9(0x26c)]();switch(_0x4580a3){case _0x145cc9(0x211):case'single':this['commandSaveLocked']();break;default:VisuMZ[_0x145cc9(0x2da)]['Scene_Menu_commandSave']['call'](this);break;}},Scene_Menu['prototype']['commandSaveLocked']=function(){const _0x7bcc55=_0x13d6cd,_0x5b9d7a=$gameSystem['savefileId']();$gameSystem[_0x7bcc55(0x1bd)](_0x5b9d7a),$gameSystem[_0x7bcc55(0x1bb)](),DataManager[_0x7bcc55(0x190)](_0x5b9d7a)[_0x7bcc55(0x253)](()=>this[_0x7bcc55(0x1fe)]())[_0x7bcc55(0x2a5)](()=>this[_0x7bcc55(0x270)]());},Scene_Menu[_0x13d6cd(0x298)][_0x13d6cd(0x1fe)]=function(){const _0x4f1dfe=_0x13d6cd;SoundManager[_0x4f1dfe(0x2b3)](),VisuMZ[_0x4f1dfe(0x2da)][_0x4f1dfe(0x144)][_0x4f1dfe(0x1e8)][_0x4f1dfe(0x23f)]['call'](this),this[_0x4f1dfe(0x1bc)](!![]);},Scene_Menu['prototype'][_0x13d6cd(0x270)]=function(){const _0x4b743b=_0x13d6cd;SoundManager[_0x4b743b(0x177)](),VisuMZ[_0x4b743b(0x2da)]['Settings'][_0x4b743b(0x1e8)][_0x4b743b(0x2bb)][_0x4b743b(0x2ce)](this),this[_0x4b743b(0x1bc)](![]);},Scene_Menu[_0x13d6cd(0x298)][_0x13d6cd(0x2e1)]=function(_0x5548c3){const _0xf3ff67=_0x13d6cd;Scene_MenuBase['prototype']['closeSaveConfirmationWindow'][_0xf3ff67(0x2ce)](this,_0x5548c3),this['_commandWindow']['activate']();},Scene_Battle[_0x13d6cd(0x298)]['requestAutosave']=function(){},VisuMZ[_0x13d6cd(0x2da)]['Scene_Options_maxCommands']=Scene_Options['prototype']['maxCommands'],Scene_Options[_0x13d6cd(0x298)][_0x13d6cd(0x1e5)]=function(){const _0x5a6b4d=_0x13d6cd;let _0x271a35=VisuMZ[_0x5a6b4d(0x2da)][_0x5a6b4d(0x1ed)][_0x5a6b4d(0x2ce)](this);const _0x35bd3f=VisuMZ[_0x5a6b4d(0x2da)][_0x5a6b4d(0x144)];if(_0x35bd3f['AutosaveOption'][_0x5a6b4d(0x135)]&&_0x35bd3f[_0x5a6b4d(0x2a0)][_0x5a6b4d(0x1b2)])_0x271a35++;return _0x271a35;},Scene_Save['prototype']['onSaveSuccess']=function(){const _0xe92415=_0x13d6cd;SoundManager[_0xe92415(0x2b3)](),VisuMZ[_0xe92415(0x2da)][_0xe92415(0x144)]['Save']['OnSaveSuccessJS']['call'](this),this[_0xe92415(0x2d6)][_0xe92415(0x176)](),this[_0xe92415(0x1bc)](!![]);},VisuMZ[_0x13d6cd(0x2da)]['Scene_Save_onSaveFailure']=Scene_Save[_0x13d6cd(0x298)][_0x13d6cd(0x294)],Scene_Save['prototype']['onSaveFailure']=function(){const _0x44a608=_0x13d6cd;SoundManager[_0x44a608(0x177)](),VisuMZ[_0x44a608(0x2da)]['Settings'][_0x44a608(0x1e8)][_0x44a608(0x2bb)][_0x44a608(0x2ce)](this),this[_0x44a608(0x1bc)](![]);},Scene_Save[_0x13d6cd(0x298)][_0x13d6cd(0x2e1)]=function(_0x1a9a58){const _0x552d8c=_0x13d6cd;Scene_File[_0x552d8c(0x298)][_0x552d8c(0x2e1)][_0x552d8c(0x2ce)](this,_0x1a9a58);if(_0x1a9a58)this['activateListWindow']();else{if('zjwnj'!==_0x552d8c(0x221))return this[_0x552d8c(0x2c5)](_0x339f7d)?this['globalValue'](_0x3f7082):_0x226f0d[_0x552d8c(0x2da)][_0x552d8c(0x1c6)][_0x552d8c(0x2ce)](this,_0x59a3c2);else this[_0x552d8c(0x173)]();}},Scene_Save[_0x13d6cd(0x298)][_0x13d6cd(0x1d9)]=function(){const _0xa6778d=_0x13d6cd;$gameTemp[_0xa6778d(0x194)]=![],Scene_File['prototype']['popScene'][_0xa6778d(0x2ce)](this);},VisuMZ[_0x13d6cd(0x2da)][_0x13d6cd(0x2bf)]=Scene_Save[_0x13d6cd(0x298)]['helpWindowText'],Scene_Save[_0x13d6cd(0x298)][_0x13d6cd(0x143)]=function(){const _0x2e355d=_0x13d6cd;return $gameTemp['_pickLockedSaveSlot']?TextManager['pickLockedSaveSlot']:VisuMZ[_0x2e355d(0x2da)][_0x2e355d(0x2bf)][_0x2e355d(0x2ce)](this);},VisuMZ['SaveCore'][_0x13d6cd(0x21b)]=Scene_Save['prototype'][_0x13d6cd(0x179)],Scene_Save['prototype'][_0x13d6cd(0x179)]=function(_0x4cb2a2){const _0x463a6f=_0x13d6cd;$gameTemp[_0x463a6f(0x194)]?_0x463a6f(0x22c)!==_0x463a6f(0x230)?this[_0x463a6f(0x284)](_0x4cb2a2):this[_0x463a6f(0x13c)](-0x10):VisuMZ[_0x463a6f(0x2da)][_0x463a6f(0x21b)][_0x463a6f(0x2ce)](this,_0x4cb2a2);},Scene_Save[_0x13d6cd(0x298)][_0x13d6cd(0x284)]=function(_0x5b4d82){const _0x2bb974=_0x13d6cd;$gameTemp[_0x2bb974(0x194)]=![],SoundManager[_0x2bb974(0x256)](),$gameSystem['setSavefileId'](_0x5b4d82),this[_0x2bb974(0x16d)](),SceneManager[_0x2bb974(0x22f)](Scene_Map);},VisuMZ['SaveCore'][_0x13d6cd(0x1ff)]=Scene_Load['prototype'][_0x13d6cd(0x2c0)],Scene_Load['prototype'][_0x13d6cd(0x2c0)]=function(){const _0x265e31=_0x13d6cd;VisuMZ[_0x265e31(0x2da)][_0x265e31(0x1ff)][_0x265e31(0x2ce)](this),VisuMZ[_0x265e31(0x2da)][_0x265e31(0x144)][_0x265e31(0x1e8)][_0x265e31(0x287)][_0x265e31(0x2ce)](this),setTimeout(VisuMZ['SaveCore']['RemoveSaveCoreCache'][_0x265e31(0x259)](this),0x3e8);},Scene_Load['prototype']['onLoadFailure']=function(){const _0x553b7b=_0x13d6cd;SoundManager[_0x553b7b(0x177)](),VisuMZ[_0x553b7b(0x2da)][_0x553b7b(0x144)][_0x553b7b(0x1e8)]['OnLoadFailureJS'][_0x553b7b(0x2ce)](this),this[_0x553b7b(0x139)]();},Scene_Load[_0x13d6cd(0x298)][_0x13d6cd(0x2e1)]=function(_0x7e4f88){const _0x3279ea=_0x13d6cd;Scene_File[_0x3279ea(0x298)][_0x3279ea(0x2e1)][_0x3279ea(0x2ce)](this,_0x7e4f88),this[_0x3279ea(0x173)]();},VisuMZ[_0x13d6cd(0x2da)][_0x13d6cd(0x193)]=function(){const _0x587d13=_0x13d6cd;$gameSystem[_0x587d13(0x278)]=undefined;},ImageManager[_0x13d6cd(0x2c4)]=ImageManager[_0x13d6cd(0x2c4)]||0x9,ImageManager[_0x13d6cd(0x150)]=ImageManager[_0x13d6cd(0x150)]||0x6,Window_Base['prototype'][_0x13d6cd(0x2b7)]=function(_0x358809,_0x2cd67c,_0x581680){const _0x5db9a0=_0x13d6cd,_0x2b8dea=ImageManager[_0x5db9a0(0x1c7)](_0x358809),_0x2de34f=_0x2b8dea[_0x5db9a0(0x265)]/ImageManager[_0x5db9a0(0x2c4)],_0x115609=_0x2b8dea[_0x5db9a0(0x1f0)]/ImageManager[_0x5db9a0(0x150)],_0x2678aa=0x0,_0x4ea784=0x0;this[_0x5db9a0(0x272)][_0x5db9a0(0x2a4)](_0x2b8dea,_0x2678aa,_0x4ea784,_0x2de34f,_0x115609,_0x2cd67c-_0x2de34f/0x2,_0x581680-_0x115609);},VisuMZ[_0x13d6cd(0x2da)][_0x13d6cd(0x18c)]=Window_Options[_0x13d6cd(0x298)][_0x13d6cd(0x215)],Window_Options[_0x13d6cd(0x298)][_0x13d6cd(0x215)]=function(){const _0x1b314b=_0x13d6cd;VisuMZ[_0x1b314b(0x2da)][_0x1b314b(0x18c)][_0x1b314b(0x2ce)](this),this['addSaveCoreCommands']();},Window_Options['prototype'][_0x13d6cd(0x242)]=function(){const _0xcbd42b=_0x13d6cd;VisuMZ['SaveCore'][_0xcbd42b(0x144)][_0xcbd42b(0x2a0)]['AddOption']&&(_0xcbd42b(0x19c)===_0xcbd42b(0x19c)?this[_0xcbd42b(0x1a9)]():(this[_0xcbd42b(0x27e)](_0x3ba697[0x0],_0x59876b[0x1],_0x51415d,_0x61e002+0x1,_0x53da60,_0x1ec014-0x2),_0x338dd4+=_0x2146cd));},Window_Options['prototype'][_0x13d6cd(0x1a9)]=function(){const _0x506a0a=_0x13d6cd,_0x590ec0=TextManager['autosaveOption'],_0x5ca808=_0x506a0a(0x1bf);this[_0x506a0a(0x271)](_0x590ec0,_0x5ca808);};function _0x524d(){const _0x22d0ce=['svbattler','autosave','FilenameFmt','drawContents','BoxRows','determineAutosaveBypass','initialize','toUpperCase','Game_Variables_value','loadSvActor','XDZrd','saveFailure','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','file0','PUlMX','DataManager_createGameObjects','LargeContentsJS','drawCurrency','setGlobalValue','GHllN','pickLockedSaveSlot','saveSuccess','process_VisuMZ_SaveCore_Settings','isEnabled','drawVerticalStyleFileData','VisuMZ_1_MessageCore','ARRAYSTRUCT','popScene','fQERD','getDate','faceWidth','create','maxSavefiles','970170NASpjO','updatePosition','contentsBack','playtime','saveDescription','ListFileDataJS','maxCommands','isAutosaveEnabled','autosaveFailure','Save','SaveDescription','drawActorSprites','VocabSaveSuccess','isBattleTest','Scene_Options_maxCommands','EVAL','MakeSavefileInfoJS','height','StartEnabled','switches','LargeFileDataJS','makeSavefileInfo','Game_Variables_setValue','Game_System_initialize','setValue','onMapLoaded','GlobalVariables','_savefileId','face','drawCharacter','isSaveConfirmWindowEnabled','onSaveCoreSaveSuccess','Scene_Load_onLoadSuccess','right','VocabSaveFailure','windowPadding','drawCurrencyValue','_fadeSpeed','eiIFO','save','Scene_Map_onMapLoaded','LatestText','variables','AfterBattle','createContents','changeTextColor','makeData','AutosaveRequest','setWordWrap','ehAhi','locked','includes','LargeCols','itemPadding','addGeneralOptions','commandContinueSaveCoreSingle','min','SkkBQ','createGameObjects','onSaveCoreLoadFailure','Scene_Save_executeSave','_SaveCoreSettings','saveCurrentSlot','commandContinue','drawListStyleContents','process_VisuMZ_SaveCore_Switches_Variables','zjwnj','2267804BalpXk','version','drawContentsLoaded','autosaveEnabled','AfterMenuCall','globalVariables','exit','currencyUnit','changePaintOpacity','reloadMapIfUpdated','siCzd','savefileId','clear','goto','JOzcI','mDSJk','center','HXoXd','enableAutosave','SaveCurrentSlot','max','filePath','drawSvBattlerSprites','_colorCache','setMode','saveMenuSpriteWidth','setSaveDescription','Scene_Title_commandNewGame','SaveMenu','OnSaveSuccessJS','SpriteWidth','resetFontSettings','addSaveCoreCommands','autosaveSuccess','filter','drawBoxStyleFileData','onSaveCoreLoadSuccess','removeChild','#%1','getSavePicture','oVHre','TestKey','status','ARRAYEVAL','forageKey','Text','smoothSelect','registerCommand','AutosaveConfirm','then','maxCols','[Year].[Month].[Date]\x20[Hour]:[Minute]:[Second]','playLoad','both','fadeOut','bind','Scene_Map_onTransferEnd','opacity','innerHeight','dtwGX','fadeIn','drawText','value','drawListStyleFileData','Game_Switches_setValue','BSwjg','file','width','Game_System_savefileId','push','open','Scene_Title_commandContinue','DhIrx','isSaveEnabled','saveStyle','description','Scene_Base_requestAutosave','split','onSaveCoreSaveFailure','addCommand','contents','menuStyle','number','drawFileData','mainCommandWidth','createSaveConfirmationWindow','_saveCorePluginCommandSave','AfterExitMenu','5194155uXQOQn','eGRrN','globalValue','XuVIF','drawFace','AutosaveMaxCount','AfterTransfer','AutosaveType','_bypassAutosave','getScreenPosition','startNewGameLockedSave','indexToSavefileId','VisuMZ_0_CoreEngine','OnLoadSuccessJS','advanced','createAutosaveConfirmationWindow','drawDescription','latestSave','bcBwH','box','GlobalSwitches','drawTextEx','Scene_Title_initialize','AutosaveExecute','constructor','timestamp','onSaveFailure','MaxSaveFiles','LargeRows','aNRFp','prototype','12418oQHtkF','OnLoadFailureJS','transfer','KOnEP','useDigitGrouping','isNwjs','Window_SavefileList_setMode','AutosaveOption','STRUCT','svbattlersForSaveFile','faces','blt','catch','commandNewGame','ARRAYFUNC','drawTimestamp','ceil','gold','characters','isEventTest','onAutosaveFailure','round','loadPicture','terminate','drawBoxStyleContents','actorName','playSave','autosaveType','addChild','single','drawSvActor','onSaveSuccess','drawActorFaces','VertRows','OnSaveFailureJS','latestSavefile','globalSwitches','drawBackground','Scene_Save_helpWindowText','onLoadSuccess','exitMenu','Enable','Scene_Menu_commandSave','svActorHorzCells','isGlobal','dimColor1','format','autosaveOption','join','executeAutosave','ParseTextCodes','imcWJ','onAutosaveSuccess','call','maxBattleMembers','_loadSuccess','makeSavename','forageTestKey','match','drawTitle','BoxContentsJS','_listWindow','dimColor2','JSON','DataManager_makeSavefileInfo','SaveCore','large','drawLargeStyleFileData','selectSavefile','setSetSuccess','ARRAYSTR','padStart','closeSaveConfirmationWindow','_stored_latestSavefile','closeAutosaveConfirmationWindow','ConfigManager_applyData','length','addLoadListener','current','AddOption','drawPlaytime','AutosaveEnable','partyMemberName','loadFailureConfirmationWindow','1304znXbnd','requestAutosave','setFadeSpeed','update','FWUVT','MAX_BATTLE_MEMBERS','Scene_Title_terminate','_saveConfirmWindow','YViFy','helpWindowText','Settings','onDatabaseLoaded','MLDIZ','onTransferEnd','{{%1}}','savefileIdToIndex','commandNewGameSaveCoreLocked','_processingAutosave','GVAMG','textColor','autosaveConfirmationWindowRect','svbattlers','svActorVertCells','saveConfirmationWindowRect','callMenu','map','1680RFdfhK','innerWidth','FUNC','calcWindowHeight','getMonth','1732984brSpoD','RequestsRequireSaveEnable','textSizeEx','drawVerticalStyleContents','initSaveCore','left','FqgPu','vertical','ConfigManager_makeData','NUM','floor','Duration','SaveStyle','shouldAutosave','%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.','gradientFillRect','FdCPO','QXGzZ','drawLatestMarker','GzxAL','fadeOutAll','updateFade','contentsOpacity','name','setSavePicture','SaveMenuStyle','activateListWindow','_active','battlerName','refresh','playBuzzer','_commandWindow','executeSave','ActorGraphic','SaveConfirm','762996llGMfx','close','optAutosave','Autosave','ConvertParams','loadFailure','numVisibleRows','drawLargeStyleContents','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','VocabAutosaveSuccess','ARRAYNUM','itemRect','VertCols','getHours','inBattle','247041caMyef','Window_Options_addGeneralOptions','drawActors','isAutosaveConfirmWindowEnabled','mUpky','saveGame','OnAutosaveFailureJS','trim','RemoveSaveCoreCache','_pickLockedSaveSlot','Default','_success','forceAutosave','openAutosaveConfirmationWindow','BoxCols','getSeconds','savePicture','zGUvz','Name','getColorDataFromPluginParameters','getTimestamp','Scene_Menu_create','Game_Switches_value','ConfirmRect','onAfterLoad','isPreviousScene','parse','_scene','ListContentsJS','getMinutes','addSaveCoreAutosaveCommand','isAutosaveCompatible','saveMenuSvBattlerWidth','isLocalMode','_autosaveConfirmWindow','getSaveDescription','battleMembers','battle','Scene_Boot_onDatabaseLoaded','AdjustRect','Filename','replace','latestSavefileId','BoxFileDataJS','zrKXt','SavePicture','commandSave','AutosaveForce','onBeforeSave','openSaveConfirmationWindow','setSavefileId'];_0x524d=function(){return _0x22d0ce;};return _0x524d();}function Window_AutosaveConfirm(){const _0x5399dd=_0x13d6cd;this[_0x5399dd(0x1c4)](...arguments);}Window_AutosaveConfirm[_0x13d6cd(0x298)]=Object[_0x13d6cd(0x1dd)](Window_Base[_0x13d6cd(0x298)]),Window_AutosaveConfirm[_0x13d6cd(0x298)][_0x13d6cd(0x292)]=Window_AutosaveConfirm,Window_AutosaveConfirm['prototype'][_0x13d6cd(0x1c4)]=function(_0x372a43){const _0x5f2901=_0x13d6cd;this[_0x5f2901(0x204)]=0x0,Window_Base[_0x5f2901(0x298)]['initialize'][_0x5f2901(0x2ce)](this,_0x372a43),this[_0x5f2901(0x25b)]=0x0,this['contentsOpacity']=0x0;},Window_AutosaveConfirm[_0x13d6cd(0x298)][_0x13d6cd(0x2be)]=function(){const _0x221903=_0x13d6cd,_0x18eb50=0x0,_0x378d48=0x0,_0x55bf71=this[_0x221903(0x155)],_0x9818e=this[_0x221903(0x25c)],_0x501720=ColorManager['dimColor1'](),_0x585853=ColorManager[_0x221903(0x2d7)](),_0x57ab26=_0x55bf71/0x2;this['contents']['gradientFillRect'](_0x18eb50,_0x378d48,_0x57ab26,_0x9818e,_0x585853,_0x501720),this[_0x221903(0x272)]['gradientFillRect'](_0x18eb50+_0x57ab26,_0x378d48,_0x57ab26,_0x9818e,_0x501720,_0x585853);},Window_AutosaveConfirm[_0x13d6cd(0x298)][_0x13d6cd(0x2de)]=function(_0x1510ee){const _0x5cf02f=_0x13d6cd;this[_0x5cf02f(0x196)]=_0x1510ee,this[_0x5cf02f(0x176)]();},Window_AutosaveConfirm[_0x13d6cd(0x298)][_0x13d6cd(0x176)]=function(){const _0x470069=_0x13d6cd;this[_0x470069(0x272)]['clear']();const _0x3df561=this[_0x470069(0x196)]?TextManager['autosaveSuccess']:TextManager[_0x470069(0x1e7)],_0x2369b7=Math['ceil'](this[_0x470069(0x15b)](_0x3df561)[_0x470069(0x265)]);this[_0x470069(0x265)]=_0x2369b7+($gameSystem[_0x470069(0x202)]()+this[_0x470069(0x214)]())*0x2,this[_0x470069(0x1e0)](),this[_0x470069(0x20b)]();const _0x4115db=Math[_0x470069(0x163)]((this[_0x470069(0x155)]-_0x2369b7)/0x2);this[_0x470069(0x2be)](),this[_0x470069(0x28f)](_0x3df561,_0x4115db,0x0,_0x2369b7);},Window_AutosaveConfirm['prototype'][_0x13d6cd(0x283)]=function(){const _0x4bf6a2=_0x13d6cd;return VisuMZ[_0x4bf6a2(0x2da)][_0x4bf6a2(0x144)][_0x4bf6a2(0x252)]['ScreenPosition'];},Window_AutosaveConfirm[_0x13d6cd(0x298)][_0x13d6cd(0x1e0)]=function(){const _0x3158cc=_0x13d6cd,_0x4e438c=this[_0x3158cc(0x283)]();if(_0x4e438c[_0x3158cc(0x2d3)](/upper/i))this['y']=-0x1*$gameSystem[_0x3158cc(0x202)]();else _0x4e438c[_0x3158cc(0x2d3)](/lower/i)?this['y']=Graphics[_0x3158cc(0x1f0)]-this['height']+$gameSystem['windowPadding']():this['y']=(Graphics[_0x3158cc(0x1f0)]-this[_0x3158cc(0x1f0)])/0x2;if(_0x4e438c['match'](/left/i))_0x3158cc(0x205)===_0x3158cc(0x297)?_0x56a5f3[_0x3158cc(0x26c)]()===_0x3158cc(0x2b6)?this[_0x3158cc(0x216)]():_0x44fe31[_0x3158cc(0x2da)][_0x3158cc(0x269)][_0x3158cc(0x2ce)](this):this['x']=-0x1*$gameSystem[_0x3158cc(0x202)]();else _0x4e438c[_0x3158cc(0x2d3)](/right/i)?this['x']=Graphics[_0x3158cc(0x265)]-this[_0x3158cc(0x265)]+$gameSystem['windowPadding']():this['x']=(Graphics[_0x3158cc(0x265)]-this[_0x3158cc(0x265)])/0x2;this['x']=Math[_0x3158cc(0x2ae)](this['x']),this['y']=Math['round'](this['y']);},Window_AutosaveConfirm[_0x13d6cd(0x298)][_0x13d6cd(0x13d)]=function(){const _0x5f5725=_0x13d6cd;Window_Base['prototype'][_0x5f5725(0x13d)][_0x5f5725(0x2ce)](this);if(this[_0x5f5725(0x204)]!==0x0)this['updateFade']();},Window_AutosaveConfirm[_0x13d6cd(0x298)][_0x13d6cd(0x16e)]=function(){const _0x5b61c8=_0x13d6cd;this[_0x5b61c8(0x16f)]+=this[_0x5b61c8(0x204)];if(this[_0x5b61c8(0x16f)]>=0xff||this[_0x5b61c8(0x16f)]<=0x0)this[_0x5b61c8(0x13c)](0x0);},Window_AutosaveConfirm['prototype'][_0x13d6cd(0x13c)]=function(_0x55353c){const _0x383cf7=_0x13d6cd;this[_0x383cf7(0x204)]=_0x55353c;},Window_AutosaveConfirm[_0x13d6cd(0x298)][_0x13d6cd(0x25e)]=function(){const _0x311300=_0x13d6cd;this[_0x311300(0x13c)](0x10);},Window_AutosaveConfirm[_0x13d6cd(0x298)]['fadeOut']=function(){const _0x2f88da=_0x13d6cd;this[_0x2f88da(0x13c)](-0x10);},VisuMZ[_0x13d6cd(0x2da)][_0x13d6cd(0x29f)]=Window_SavefileList[_0x13d6cd(0x298)][_0x13d6cd(0x23a)],Window_SavefileList[_0x13d6cd(0x298)]['setMode']=function(_0x5f15a6,_0x5ce85d){const _0x434f2=_0x13d6cd;if(StorageManager[_0x434f2(0x2b4)]()==='current')_0x5ce85d=![];if($gameTemp['_pickLockedSaveSlot'])_0x5ce85d=![];VisuMZ[_0x434f2(0x2da)][_0x434f2(0x29f)][_0x434f2(0x2ce)](this,_0x5f15a6,_0x5ce85d);},Window_SavefileList['prototype'][_0x13d6cd(0x182)]=function(){const _0x128b18=_0x13d6cd,_0x381ce1=VisuMZ['SaveCore'][_0x128b18(0x144)][_0x128b18(0x23e)],_0x50779d=this[_0x128b18(0x273)]();switch(_0x50779d){case _0x128b18(0x160):return _0x381ce1[_0x128b18(0x2ba)];break;case _0x128b18(0x28d):return _0x381ce1[_0x128b18(0x1c2)];break;case _0x128b18(0x2db):return _0x381ce1[_0x128b18(0x296)];break;default:return _0x381ce1['ListRows'];break;}},Window_SavefileList[_0x13d6cd(0x298)][_0x13d6cd(0x254)]=function(){const _0x19f8c3=_0x13d6cd,_0x1053e8=VisuMZ[_0x19f8c3(0x2da)]['Settings'][_0x19f8c3(0x23e)],_0x59e40e=this[_0x19f8c3(0x273)]();switch(_0x59e40e){case _0x19f8c3(0x160):return _0x1053e8[_0x19f8c3(0x188)];break;case'box':return _0x1053e8[_0x19f8c3(0x199)];break;case'large':return _0x1053e8[_0x19f8c3(0x213)];break;default:return _0x1053e8['ListCols'];break;}},Window_SavefileList[_0x13d6cd(0x298)]['resetWordWrap']=function(){const _0x89f21=_0x13d6cd;Imported['VisuMZ_1_MessageCore']&&Window_Selectable[_0x89f21(0x298)]['resetWordWrap']['call'](this);},Window_SavefileList[_0x13d6cd(0x298)]['setWordWrap']=function(_0x4c2f5b){const _0x525634=_0x13d6cd;return Imported[_0x525634(0x1d7)]?Window_Selectable[_0x525634(0x298)][_0x525634(0x20f)]['call'](this,_0x4c2f5b):'';},Window_SavefileList[_0x13d6cd(0x298)]['actorStyle']=function(){const _0x44db21=_0x13d6cd;return VisuMZ[_0x44db21(0x2da)][_0x44db21(0x144)][_0x44db21(0x17a)];},Window_SavefileList[_0x13d6cd(0x298)]['menuStyle']=function(){const _0x317efe=_0x13d6cd;return VisuMZ[_0x317efe(0x2da)]['Settings'][_0x317efe(0x172)];},Window_SavefileList[_0x13d6cd(0x298)][_0x13d6cd(0x2dd)]=function(_0xc9f16c){const _0x3feab2=_0x13d6cd,_0x395362=Math['max'](0x0,this[_0x3feab2(0x149)](_0xc9f16c));this[_0x3feab2(0x250)](_0x395362);},Window_SavefileList[_0x13d6cd(0x298)]['drawItem']=function(_0x4f12e0){const _0x4bfd7d=_0x13d6cd,_0x2fe0ba=this[_0x4bfd7d(0x285)](_0x4f12e0),_0x4fc477=DataManager['savefileInfo'](_0x2fe0ba);if(_0x4fc477)_0x4fc477[_0x4bfd7d(0x22d)]=_0x2fe0ba;this[_0x4bfd7d(0x1fa)]=_0x2fe0ba;const _0x593102=this[_0x4bfd7d(0x187)](_0x4f12e0);this[_0x4bfd7d(0x241)](),this[_0x4bfd7d(0x22a)](this[_0x4bfd7d(0x1d5)](_0x2fe0ba)),this[_0x4bfd7d(0x1c1)](_0x4fc477,_0x593102);},Window_SavefileList[_0x13d6cd(0x298)][_0x13d6cd(0x2d4)]=function(_0x373530,_0x25c273,_0x433759){const _0x1ccdfa=_0x13d6cd;if(_0x373530===0x0){if(_0x1ccdfa(0x1b7)!==_0x1ccdfa(0x1b7)){_0x449372['ConvertParams'](_0x4a57e0,_0x58a688);if(_0x1a7b9a)_0xd90f0c[_0x1ccdfa(0x23c)](_0x3f5d33['Text']);}else this[_0x1ccdfa(0x25f)](TextManager['autosave'],_0x25c273,_0x433759,0xb4);}else this[_0x1ccdfa(0x25f)](TextManager[_0x1ccdfa(0x264)]+'\x20'+_0x373530,_0x25c273,_0x433759,0xb4);},Window_SavefileList[_0x13d6cd(0x298)][_0x13d6cd(0x16b)]=function(_0x11d43b,_0x5a7b49,_0x37a197){const _0x36c213=_0x13d6cd;if(_0x11d43b===0x0||DataManager[_0x36c213(0x1b5)]()!==_0x11d43b)return;const _0x44ae07=TextManager['latestSave'];this[_0x36c213(0x20c)](ColorManager['latestSavefile']()),this[_0x36c213(0x25f)](_0x44ae07,_0x5a7b49,_0x37a197,0xb4);},Window_SavefileList[_0x13d6cd(0x298)][_0x13d6cd(0x18d)]=function(_0x426eee,_0x225491,_0x216967,_0x35562c,_0x56f25b){const _0x149803=_0x13d6cd;if(!_0x426eee[_0x149803(0x2ab)])return;const _0x49cb0e=this['actorStyle']();switch(_0x49cb0e){case _0x149803(0x1fb):this[_0x149803(0x2b9)](_0x426eee,_0x225491,_0x216967,_0x35562c,_0x56f25b);break;case'sprite':this[_0x149803(0x1ea)](_0x426eee,_0x225491,_0x216967,_0x35562c,_0x56f25b);break;case _0x149803(0x1be):this[_0x149803(0x238)](_0x426eee,_0x225491,_0x216967,_0x35562c,_0x56f25b);break;default:break;}},Window_SavefileList[_0x13d6cd(0x298)][_0x13d6cd(0x2b9)]=function(_0x1d5dc9,_0x26e6ce,_0x47f2cd,_0x2f4a11,_0x3d5bda){const _0x29e676=_0x13d6cd;let _0x2d3f9e=Math[_0x29e676(0x236)](_0x1d5dc9[_0x29e676(0x2a3)]['length'],Scene_File['MAX_BATTLE_MEMBERS']);const _0x4fad9b=Math[_0x29e676(0x217)](ImageManager[_0x29e676(0x1dc)],Math[_0x29e676(0x163)](_0x2f4a11/_0x2d3f9e));_0x26e6ce=_0x26e6ce+Math['round']((_0x2f4a11-_0x2d3f9e*_0x4fad9b)/0x2);for(const _0x32e33f of _0x1d5dc9[_0x29e676(0x2a3)]){this[_0x29e676(0x27e)](_0x32e33f[0x0],_0x32e33f[0x1],_0x26e6ce,_0x47f2cd+0x1,_0x4fad9b,_0x3d5bda-0x2),_0x26e6ce+=_0x4fad9b;}},ImageManager[_0x13d6cd(0x23b)]=VisuMZ[_0x13d6cd(0x2da)]['Settings']['SaveMenu'][_0x13d6cd(0x240)],ImageManager[_0x13d6cd(0x1ab)]=VisuMZ['SaveCore']['Settings']['SaveMenu']['SvBattlerWidth'],Window_SavefileList[_0x13d6cd(0x298)]['drawActorSprites']=function(_0xdb3a72,_0x15c216,_0x3b05f5,_0x30a5e0,_0x10b613){const _0x185163=_0x13d6cd;let _0x54c844=Math[_0x185163(0x236)](_0xdb3a72[_0x185163(0x2ab)][_0x185163(0x132)],Scene_File[_0x185163(0x13f)]);const _0x17622=ImageManager[_0x185163(0x23b)];_0x15c216=_0x15c216+Math[_0x185163(0x2ae)]((_0x30a5e0-_0x54c844*_0x17622)/0x2)+_0x17622/0x2,_0x3b05f5=_0x3b05f5+_0x10b613-0x8;for(const _0x23e9e6 of _0xdb3a72['characters']){this[_0x185163(0x1fc)](_0x23e9e6[0x0],_0x23e9e6[0x1],_0x15c216,_0x3b05f5),_0x15c216+=_0x17622;}},Window_SavefileList[_0x13d6cd(0x298)][_0x13d6cd(0x238)]=function(_0x188d66,_0x24eecf,_0x1ecb55,_0x4704c5,_0x32bd59){const _0x449f8f=_0x13d6cd;if(!_0x188d66[_0x449f8f(0x14f)])return this[_0x449f8f(0x1ea)](_0x188d66,_0x24eecf,_0x1ecb55,_0x4704c5,_0x32bd59);let _0x4706ce=Math['max'](_0x188d66[_0x449f8f(0x14f)][_0x449f8f(0x132)],Scene_File[_0x449f8f(0x13f)]);const _0x335617=ImageManager[_0x449f8f(0x1ab)];_0x24eecf=_0x24eecf+Math[_0x449f8f(0x2ae)]((_0x4704c5-_0x4706ce*_0x335617)/0x2)+_0x335617/0x2,_0x1ecb55=_0x1ecb55+_0x32bd59-0x8;for(const _0x154bfe of _0x188d66[_0x449f8f(0x14f)]){this[_0x449f8f(0x2b7)](_0x154bfe,_0x24eecf,_0x1ecb55),_0x24eecf+=_0x335617;}},Window_SavefileList[_0x13d6cd(0x298)]['drawPicture']=function(_0x416f5b,_0x2f6591,_0x5149af,_0x1b9f7b,_0xba46ff,_0xe131c9){const _0x332ef5=_0x13d6cd;if(_0x416f5b==='')return;_0x2f6591+=0x2,_0x5149af+=0x2,_0x1b9f7b-=0x4,_0xba46ff-=0x4;const _0x4119d8=ImageManager[_0x332ef5(0x2af)](_0x416f5b),_0x5088b1=_0x4119d8[_0x332ef5(0x265)],_0x11c65d=_0x4119d8[_0x332ef5(0x1f0)],_0x2eb4ee=Math[_0x332ef5(0x217)](_0x1b9f7b/_0x5088b1,_0xba46ff/_0x11c65d,_0xe131c9?0x1:0x3e8),_0x434e23=Math[_0x332ef5(0x2a9)](_0x4119d8['width']*_0x2eb4ee),_0x1436ea=Math['ceil'](_0x4119d8[_0x332ef5(0x1f0)]*_0x2eb4ee);this[_0x332ef5(0x1e1)][_0x332ef5(0x2a4)](_0x4119d8,0x0,0x0,_0x5088b1,_0x11c65d,_0x2f6591,_0x5149af,_0x434e23,_0x1436ea);},Window_SavefileList[_0x13d6cd(0x298)]['drawCenteredPicture']=function(_0xf12b73,_0x36c84d,_0x3e60f6,_0x319d9d,_0x1fbb94,_0x134753){const _0x18ac81=_0x13d6cd;if(_0xf12b73==='')return;_0x36c84d+=0x2,_0x3e60f6+=0x2,_0x319d9d-=0x4,_0x1fbb94-=0x4;const _0x840ece=ImageManager[_0x18ac81(0x2af)](_0xf12b73),_0x3fb4b4=_0x840ece[_0x18ac81(0x265)],_0x25a19e=_0x840ece['height'],_0x35e81c=Math[_0x18ac81(0x217)](_0x319d9d/_0x3fb4b4,_0x1fbb94/_0x25a19e,_0x134753?0x1:0x3e8),_0x321718=Math[_0x18ac81(0x2a9)](_0x840ece[_0x18ac81(0x265)]*_0x35e81c),_0x5ab16d=Math[_0x18ac81(0x2a9)](_0x840ece[_0x18ac81(0x1f0)]*_0x35e81c);_0x36c84d+=(_0x319d9d-_0x321718)/0x2,_0x3e60f6+=(_0x1fbb94-_0x5ab16d)/0x2,this['contentsBack'][_0x18ac81(0x2a4)](_0x840ece,0x0,0x0,_0x3fb4b4,_0x25a19e,_0x36c84d,_0x3e60f6,_0x321718,_0x5ab16d);},Window_SavefileList[_0x13d6cd(0x298)][_0x13d6cd(0x136)]=function(_0x1b4809,_0x3b947c,_0x37cfa3,_0x29d9fa,_0x33e3f6){const _0x15a1a8=_0x13d6cd;_0x1b4809[_0x15a1a8(0x1e2)]&&(_0x33e3f6=_0x33e3f6||_0x15a1a8(0x15e),this[_0x15a1a8(0x25f)](_0x1b4809[_0x15a1a8(0x1e2)],_0x3b947c,_0x37cfa3,_0x29d9fa,_0x33e3f6));},Window_SavefileList[_0x13d6cd(0x298)][_0x13d6cd(0x2a8)]=function(_0x50ffcd,_0xf795de,_0x35e31d,_0x7757e6,_0x47f32b){const _0x597f64=_0x13d6cd;if(_0x50ffcd[_0x597f64(0x293)]){if(_0x597f64(0x26a)!==_0x597f64(0x1da)){_0x47f32b=_0x47f32b||_0x597f64(0x15e);let _0x608ec4=this[_0x597f64(0x19f)](_0x50ffcd);if(Imported[_0x597f64(0x286)]&&this[_0x597f64(0x29d)]()){if(_0x597f64(0x1c8)===_0x597f64(0x1c8))_0x608ec4=_0x597f64(0x148)[_0x597f64(0x2c7)](_0x608ec4);else{_0x197f59['prototype'][_0x597f64(0x13d)][_0x597f64(0x2ce)](this);if(this[_0x597f64(0x204)]!==0x0)this[_0x597f64(0x16e)]();}}this[_0x597f64(0x25f)](_0x608ec4,_0xf795de,_0x35e31d,_0x7757e6,_0x47f32b);}else this['drawFileData'](this[_0x597f64(0x1fa)],_0x2db5d0);}},Window_SavefileList[_0x13d6cd(0x298)]['getTimestamp']=function(_0x2c7581){const _0x66f6fe=_0x13d6cd,_0x556604=_0x2c7581['timestamp'],_0xf31812=new Date(_0x556604);let _0x5e8e07=_0x66f6fe(0x255);_0x5e8e07=_0x5e8e07[_0x66f6fe(0x1b4)](/\[YEAR\]/gi,'%1'),_0x5e8e07=_0x5e8e07[_0x66f6fe(0x1b4)](/\[MONTH\]/gi,'%2'),_0x5e8e07=_0x5e8e07[_0x66f6fe(0x1b4)](/\[DATE\]/gi,'%3'),_0x5e8e07=_0x5e8e07[_0x66f6fe(0x1b4)](/\[HOUR\]/gi,'%4'),_0x5e8e07=_0x5e8e07[_0x66f6fe(0x1b4)](/\[MINUTE\]/gi,'%5'),_0x5e8e07=_0x5e8e07[_0x66f6fe(0x1b4)](/\[SECOND\]/gi,'%6');let _0x3b8445=String(_0xf31812['getFullYear']())[_0x66f6fe(0x26f)]('')[_0x66f6fe(0x2c9)]('​'),_0x1ae0e0=String(_0xf31812[_0x66f6fe(0x158)]()+0x1),_0x2e4057=String(_0xf31812[_0x66f6fe(0x1db)]())[_0x66f6fe(0x2e0)](0x2,'0'),_0x1512bb=String(_0xf31812[_0x66f6fe(0x189)]())[_0x66f6fe(0x2e0)](0x2,'0'),_0x248aec=String(_0xf31812[_0x66f6fe(0x1a8)]())[_0x66f6fe(0x2e0)](0x2,'0'),_0xba8fc5=String(_0xf31812[_0x66f6fe(0x19a)]())[_0x66f6fe(0x2e0)](0x2,'0'),_0x1d9aea=_0x5e8e07[_0x66f6fe(0x2c7)](_0x3b8445,_0x1ae0e0,_0x2e4057,_0x1512bb,_0x248aec,_0xba8fc5);return _0x1d9aea;},Window_SavefileList[_0x13d6cd(0x298)][_0x13d6cd(0x1cf)]=function(_0x8d101f,_0x547187,_0x39a325,_0x59260c){const _0x3494c6=_0x13d6cd;if(_0x8d101f['gold']===undefined)return;const _0x165bfb=_0x8d101f[_0x3494c6(0x2aa)],_0xd6be19=TextManager[_0x3494c6(0x229)];Window_SavefileList['prototype'][_0x3494c6(0x203)][_0x3494c6(0x2ce)](this,_0x165bfb,_0xd6be19,_0x547187,_0x39a325,_0x59260c);},Window_SavefileList['prototype'][_0x13d6cd(0x28a)]=function(_0x5aeca1,_0x17dfd2,_0xcc7cf9,_0x535221,_0x3cb1a0){const _0xf769b5=_0x13d6cd;if(_0x5aeca1[_0xf769b5(0x26d)]){const _0x776194=this[_0xf769b5(0x15b)](_0x5aeca1['description'])['width'];_0x3cb1a0=_0x3cb1a0||_0xf769b5(0x15e);if(_0x3cb1a0===_0xf769b5(0x200))_0xf769b5(0x27b)==='jXbkg'?_0x230807===0x0?this[_0xf769b5(0x25f)](_0x50fe05[_0xf769b5(0x1bf)],_0xe178da,_0x5e7caa,0xb4):this[_0xf769b5(0x25f)](_0x4a4256[_0xf769b5(0x264)]+'\x20'+_0x3b8700,_0x4649db,_0x521296,0xb4):_0x17dfd2=_0x17dfd2+_0x535221-_0x776194;else _0x3cb1a0===_0xf769b5(0x232)&&(_0x17dfd2=_0x17dfd2+(_0x535221-_0x776194)/0x2);this[_0xf769b5(0x28f)](_0x5aeca1[_0xf769b5(0x26d)],_0x17dfd2,_0xcc7cf9,_0x535221);}},Window_SavefileList[_0x13d6cd(0x298)]['drawContents']=function(_0x28b6d1,_0x439702){const _0x5d9d14=_0x13d6cd;if(_0x28b6d1){const _0x395c41=ImageManager[_0x5d9d14(0x2af)](_0x28b6d1['picture']||'');_0x395c41[_0x5d9d14(0x133)](this[_0x5d9d14(0x224)][_0x5d9d14(0x259)](this,_0x28b6d1,_0x439702));}else this['drawFileData'](this[_0x5d9d14(0x1fa)],_0x439702);},Window_SavefileList[_0x13d6cd(0x298)]['drawContentsLoaded']=function(_0x5338ce,_0x37e645){const _0x1ac33c=_0x13d6cd,_0x3f9ae4=this[_0x1ac33c(0x273)]();switch(_0x3f9ae4){case _0x1ac33c(0x160):this['drawVerticalStyleContents'](_0x5338ce,_0x37e645);break;case _0x1ac33c(0x28d):this[_0x1ac33c(0x2b1)](_0x5338ce,_0x37e645);break;case'large':this[_0x1ac33c(0x183)](_0x5338ce,_0x37e645);break;default:this[_0x1ac33c(0x21f)](_0x5338ce,_0x37e645);break;}this[_0x1ac33c(0x241)]();const _0x4ba160=_0x5338ce[_0x1ac33c(0x22d)];this[_0x1ac33c(0x275)](_0x4ba160,_0x37e645);},Window_SavefileList[_0x13d6cd(0x298)][_0x13d6cd(0x275)]=function(_0x52ad72,_0x128eee){const _0x2142da=_0x13d6cd,_0x532c46=this[_0x2142da(0x273)]();switch(_0x532c46){case'vertical':this[_0x2142da(0x1d6)](_0x52ad72,_0x128eee);break;case'box':this[_0x2142da(0x245)](_0x52ad72,_0x128eee);break;case _0x2142da(0x2db):this['drawLargeStyleFileData'](_0x52ad72,_0x128eee);break;default:this[_0x2142da(0x261)](_0x52ad72,_0x128eee);break;}},Window_SavefileList[_0x13d6cd(0x298)][_0x13d6cd(0x21f)]=function(_0x32a6cb,_0xb94edd){const _0x2128b0=_0x13d6cd;VisuMZ[_0x2128b0(0x2da)][_0x2128b0(0x144)][_0x2128b0(0x23e)]['ListContentsJS'][_0x2128b0(0x2ce)](this,_0x32a6cb,_0xb94edd);},Window_SavefileList[_0x13d6cd(0x298)][_0x13d6cd(0x15c)]=function(_0x5c7fa6,_0xbdfa38){const _0x165b4c=_0x13d6cd;VisuMZ[_0x165b4c(0x2da)][_0x165b4c(0x144)][_0x165b4c(0x23e)]['VertContentsJS'][_0x165b4c(0x2ce)](this,_0x5c7fa6,_0xbdfa38);},Window_SavefileList[_0x13d6cd(0x298)][_0x13d6cd(0x2b1)]=function(_0x42602b,_0x47f472){const _0x56fe8a=_0x13d6cd;VisuMZ[_0x56fe8a(0x2da)][_0x56fe8a(0x144)][_0x56fe8a(0x23e)][_0x56fe8a(0x2d5)][_0x56fe8a(0x2ce)](this,_0x42602b,_0x47f472);},Window_SavefileList[_0x13d6cd(0x298)][_0x13d6cd(0x183)]=function(_0x5e88c3,_0x2bf9ef){const _0x1435d7=_0x13d6cd;VisuMZ[_0x1435d7(0x2da)][_0x1435d7(0x144)][_0x1435d7(0x23e)][_0x1435d7(0x1ce)][_0x1435d7(0x2ce)](this,_0x5e88c3,_0x2bf9ef);},Window_SavefileList[_0x13d6cd(0x298)][_0x13d6cd(0x261)]=function(_0x23bd5c,_0x1887aa){const _0x4cff79=_0x13d6cd;VisuMZ['SaveCore'][_0x4cff79(0x144)]['SaveMenu'][_0x4cff79(0x1e4)][_0x4cff79(0x2ce)](this,_0x23bd5c,_0x1887aa);},Window_SavefileList[_0x13d6cd(0x298)][_0x13d6cd(0x1d6)]=function(_0xaafb06,_0x5ce7bc){const _0x1c5ada=_0x13d6cd;VisuMZ[_0x1c5ada(0x2da)][_0x1c5ada(0x144)][_0x1c5ada(0x23e)]['VertFileDataJS'][_0x1c5ada(0x2ce)](this,_0xaafb06,_0x5ce7bc);},Window_SavefileList['prototype'][_0x13d6cd(0x245)]=function(_0x55b89a,_0xd051be){const _0x5ea830=_0x13d6cd;VisuMZ[_0x5ea830(0x2da)][_0x5ea830(0x144)][_0x5ea830(0x23e)][_0x5ea830(0x1b6)][_0x5ea830(0x2ce)](this,_0x55b89a,_0xd051be);},Window_SavefileList[_0x13d6cd(0x298)][_0x13d6cd(0x2dc)]=function(_0x49a1e9,_0x41df66){const _0x4bf22d=_0x13d6cd;VisuMZ[_0x4bf22d(0x2da)]['Settings']['SaveMenu'][_0x4bf22d(0x1f3)][_0x4bf22d(0x2ce)](this,_0x49a1e9,_0x41df66);};