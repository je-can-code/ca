//=============================================================================
// VisuStella MZ - Gab Window
// VisuMZ_4_GabWindow.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_4_GabWindow = true;

var VisuMZ = VisuMZ || {};
VisuMZ.GabWindow = VisuMZ.GabWindow || {};
VisuMZ.GabWindow.version = 1.02;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 4] [Version 1.02] [GabWindow]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Gab_Window_VisuStella_MZ
 * @orderAfter VisuMZ_0_CoreEngine
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * Sometimes there's random jibber jabber that does not warrant a message box.
 * The Gab Window fulfills that jibber jabber by placing such text outside of
 * the message window box and at the corner of the screen. The gab text will
 * appear briefly and then disappear, not showing up again until the gab text
 * is updated with something else.
 *
 * Features include all (but not limited to) the following:
 * 
 * * Create gab text that does not interrupt gameplay.
 * * Gabs can be queued together to create a streamlined conversation.
 * * Gabs can play sound effects when played, allowing you to attach voices to
 *   them if desired.
 * * Multiple lines can be used per gab to display more text.
 * * Attach faces, map sprites, sideview sprites, and even pictures to gabs.
 * * Gabs can be automatically positioned above specific events, actors, and
 *   even enemies.
 * * Turn on switches after a gab is completed.
 * * Run custom JavaScript code upon displaying or finish a gab.
 *
 * ============================================================================
 * Requirements
 * ============================================================================
 *
 * This plugin is made for RPG Maker MZ. This will not work in other iterations
 * of RPG Maker.
 *
 * ------ Tier 4 ------
 *
 * This plugin is a Tier 4 plugin. Place it under other plugins of lower tier
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
 * === Gab Plugin Commands ===
 *
 * ---
 *
 * Gab: Text Only
 * - Show a Gab Window with the specified settings.
 *
 *   Text:
 *   - The text to be shown in the Gab Window.
 *
 *   Force Gab?:
 *   - Forced gabs will clear other gabs and display immediately.
 *
 *   Optional Settings:
 *   - Change the settings you want to override with this gab.
 *     Blank settings will use default Plugin Parameter settings.
 *
 * ---
 *
 * Gab: Gab: Text + Face (Any)
 * - Show a Gab Window with the specified settings.
 * - Any face graphic can be displayed next to text.
 *
 *   Text:
 *   - The text to be shown in the Gab Window.
 *
 *   Filename:
 *   - The filename of the face graphic to use.
 *
 *   Index:
 *   - This is the index of the face graphic.
 *   - Index values start at 0.
 *
 *   Force Gab?:
 *   - Forced gabs will clear other gabs and display immediately.
 *
 *   Optional Settings:
 *   - Change the settings you want to override with this gab.
 *     Blank settings will use default Plugin Parameter settings.
 *
 * ---
 *
 * Gab: Text + Face (Actor)
 * - Show a Gab Window with the specified settings.
 * - Pick an actor's face graphic to show with it.
 *
 *   Text:
 *   - The text to be shown in the Gab Window.
 *
 *   Actor ID:
 *   - This is the ID of the actor you want the face graphic of.
 *
 *   Force Gab?:
 *   - Forced gabs will clear other gabs and display immediately.
 *
 *   Optional Settings:
 *   - Change the settings you want to override with this gab.
 *     Blank settings will use default Plugin Parameter settings.
 *
 * ---
 *
 * Gab: Text + Face (Party)
 * - Show a Gab Window with the specified settings.
 * - Pick a party member's face graphic to show with it.
 *
 *   Text:
 *   - The text to be shown in the Gab Window.
 *
 *   Party Member Index:
 *   - This is the index of the party member you want the face graphic of.
 *   - Index values start at 0.
 *
 *   Force Gab?:
 *   - Forced gabs will clear other gabs and display immediately.
 *
 *   Optional Settings:
 *   - Change the settings you want to override with this gab.
 *     Blank settings will use default Plugin Parameter settings.
 *
 * ---
 *
 * Gab: Text + Map Sprite (Any)
 * - Show a Gab Window with the specified settings.
 * - Any map sprite can be displayed next to text.
 *
 *   Text:
 *   - The text to be shown in the Gab Window.
 *
 *   Filename:
 *   - The filename of the sprite graphic to use.
 *
 *   Index:
 *   - This is the index of the sprite graphic.
 *   - Index values start at 0.
 *
 *   Force Gab?:
 *   - Forced gabs will clear other gabs and display immediately.
 *
 *   Optional Settings:
 *   - Change the settings you want to override with this gab.
 *     Blank settings will use default Plugin Parameter settings.
 *
 * ---
 *
 * Gab: Text + Map Sprite (Actor)
 * - Show a Gab Window with the specified settings.
 * - Pick an actor's sprite graphic to show with it.
 *
 *   Text:
 *   - The text to be shown in the Gab Window.
 *
 *   Actor ID:
 *   - This is the ID of the actor you want the map sprite of.
 *
 *   Force Gab?:
 *   - Forced gabs will clear other gabs and display immediately.
 *
 *   Optional Settings:
 *   - Change the settings you want to override with this gab.
 *     Blank settings will use default Plugin Parameter settings.
 *
 * ---
 *
 * Gab: Text + Map Sprite (Party)
 * - Show a Gab Window with the specified settings.
 * - Pick a party member's sprite graphic to show with it.
 *
 *   Text:
 *   - The text to be shown in the Gab Window.
 *
 *   Party Member Index:
 *   - This is the index of the party member you want the map sprite of.
 *   - Index values start at 0.
 *
 *   Force Gab?:
 *   - Forced gabs will clear other gabs and display immediately.
 *
 *   Optional Settings:
 *   - Change the settings you want to override with this gab.
 *     Blank settings will use default Plugin Parameter settings.
 *
 * ---
 *
 * Gab: Text + Sideview Actor (Any)
 * - Show a Gab Window with the specified settings.
 * - Any Sideview Actor can be displayed next to text.
 *
 *   Text:
 *   - The text to be shown in the Gab Window.
 *
 *   Filename:
 *   - The filename of the Sideview Actor graphic to use.
 *
 *   Force Gab?:
 *   - Forced gabs will clear other gabs and display immediately.
 *
 *   Optional Settings:
 *   - Change the settings you want to override with this gab.
 *     Blank settings will use default Plugin Parameter settings.
 *
 * ---
 *
 * Gab: Text + Sideview Actor (Actor)
 * - Show a Gab Window with the specified settings.
 * - Pick an actor's sideview graphic to show with it.
 *
 *   Text:
 *   - The text to be shown in the Gab Window.
 *
 *   Actor ID:
 *   - This is the ID of the actor you want the sideview graphic of.
 *
 *   Force Gab?:
 *   - Forced gabs will clear other gabs and display immediately.
 *
 *   Optional Settings:
 *   - Change the settings you want to override with this gab.
 *     Blank settings will use default Plugin Parameter settings.
 *
 * ---
 *
 * Gab: Text + Sideview Actor (Party)
 * - Show a Gab Window with the specified settings.
 * - Pick a party member's sideview graphic to show with it.
 *
 *   Text:
 *   - The text to be shown in the Gab Window.
 *
 *   Party Member Index:
 *   - This is the index of the party member you want the sideview graphic of.
 *   - Index values start at 0.
 *
 *   Force Gab?:
 *   - Forced gabs will clear other gabs and display immediately.
 *
 *   Optional Settings:
 *   - Change the settings you want to override with this gab.
 *     Blank settings will use default Plugin Parameter settings.
 *
 * ---
 *
 * Gab: Text + Picture
 * - Show a Gab Window with the specified settings.
 * - Any picture graphic can be displayed next to text.
 *
 *   Text:
 *   - The text to be shown in the Gab Window.
 *
 *   Filename:
 *   - The filename of the face graphic to use.
 *
 *   Stretch Picture:
 *   - Stretch the picture to fit the window?
 *
 *   Force Gab?:
 *   - Forced gabs will clear other gabs and display immediately.
 *
 *   Optional Settings:
 *   - Change the settings you want to override with this gab.
 *     Blank settings will use default Plugin Parameter settings.
 *
 * ---
 * 
 * === Optional Settings ===
 * 
 * These settings appear in the above Gab Plugin Commands. Opening up the
 * Optional Settings will yield the following:
 * 
 * ---
 *
 * DimColor
 * 
 *   Dim Color 1:
 *   Dim Color 2:
 *   - The dim colors to use for this Gab Window.
 *   - Format: rgba(red, green, blue, alpha)
 *
 * ---
 *
 * Fade
 * 
 *   Fade Rate:
 *   - How fast this Gab Window fades away.
 * 
 *   Fade Direction:
 *   - The direction this Gab Window fades out in.
 *
 * ---
 *
 * Font
 * 
 *   Font Name:
 *   - The font name to use for this Gab Window.
 * 
 *   Font Size:
 *   - The font size to use for this Gab Window.
 *
 * ---
 *
 * Position
 * 
 *   Y Location:
 *   - The Y coordinate this Gab Window will appear in.
 *   - Ignore if you are using a locked sprite position.
 * 
 *   Actor ID:
 *   - The ID of the actor to display this Gab Window above.
 *   - For Map/Battle. 
 * 
 *   Party Index:
 *   - Index of the party member to display Gab Window above.
 *   - For Map/Battle. Index values start at 0. Ignore under 0.
 * 
 *   Enemy Index:
 *   - Index of an enemy battler to display Gab Window above.
 *   - Battle only. Index values start at 0. Ignore under 0.
 * 
 *   Event ID:
 *   - The ID of the event to display this Gab Window above.
 *   - Map only.
 *
 * ---
 *
 * On Display
 * 
 *   Bypass Anti-Repeat:
 *   - Allows this gab to bypass the Anti-Repeat settings.
 * 
 *   Sound Filename:
 *   - The filename of the SE to play when the Gab Window shows.
 * 
 *   JS: On Display:
 *   - Runs this code once this Gab Window shows up.
 *
 * ---
 *
 * On Finish
 * 
 *   Gab Switch:
 *   - The specified switch will be turned ON when the Gab Window finishes.
 * 
 *   JS: On Finish:
 *   - Runs this code once this Gab Window finishes.
 *
 * ---
 *
 * Waiting
 * 
 *   Wait Time:
 *   - The number of frames this Gab Window stays visible.
 * 
 *   Time Per Character:
 *   - Frames added per Text Character in this Gab Window.
 *
 * ---
 * 
 * === System Plugin Commands ===
 * 
 * ---
 *
 * System: Clear Gabs
 * - Clears out the current Gab and any which are queued.
 *
 * ---
 *
 * System: Wait For Gab Completion
 * - Causes the game to wait until all gabs are finished playing.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: General Settings
 * ============================================================================
 *
 * General settings regarding the Gab Window.
 *
 * ---
 *
 * General
 * 
 *   Anti-Repeat:
 *   - Stops gabs of the same settings from being queued.
 * 
 *   Center Graphics:
 *   - Centers graphics vertically if there are multiple lines.
 *
 * ---
 *
 * Fade
 * 
 *   Fade Rate:
 *   - How fast the gab window fades away.
 * 
 *   Fade Direction:
 *   - The direction to move the window in when fading out.
 *
 * ---
 *
 * Font
 * 
 *   Gab Font Name:
 *   - The font name used for the text of the Gab Window
 *   - Leave empty to use the default game's font.
 * 
 *   Gab Font Size:
 *   - The font size used for the text of the Gab Window.
 *   - Default: 28
 *
 * ---
 *
 * Sprites > Character Sprites
 * 
 *   X Position:
 *   - X position of the character.
 * 
 *   Y Position:
 *   - Y position of the character.
 *
 * ---
 *
 * Sprites > Sideview Sprites
 * 
 *   X Position:
 *   - X position of the Sideview Actor.
 * 
 *   Y Position:
 *   - Y position of the Sideview Actor.
 *
 * ---
 *
 * Waiting
 * 
 *   Base Wait Time:
 *   - Minimum frames the Gab Window stays visible.
 *   - Default: 90
 * 
 *   Time Per Character:
 *   - Frames added per Text Character.
 *   - Default: 4
 *
 * ---
 * 
 * JavaScript
 * 
 *   JS: On Display:
 *   - Runs this code once this Gab Window shows up.
 *   - This applies to every single gab.
 * 
 *   JS: On Finish:
 *   - Runs this code once this Gab Window finishes.
 *   - This applies to every single gab.
 * 
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Map Settings
 * ============================================================================
 *
 * Settings related to the gab window while in the map scene.
 *
 * ---
 *
 * Map
 * 
 *   Y Location:
 *   - This is the Y location of the Gab Window.
 * 
 *   Dim Color 1:
 *   Dim Color 2:
 *   - These are the dim colors used for maps.
 *   - Format: rgba(red, green, blue, alpha)
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Battle Settings
 * ============================================================================
 *
 * Settings related to the gab window while in the battle scene.
 *
 * ---
 *
 * Battle
 * 
 *   Y Location:
 *   - This is the Y location of the Gab Window.
 * 
 *   Dim Color 1:
 *   Dim Color 2:
 *   - These are the dim colors used for battles.
 *   - Format: rgba(red, green, blue, alpha)
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
 * * Trihan
 * * Arisu
 * * Irina
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * 
 * Version 1.02: January 1, 2021
 * * Feature Update!
 * ** Changed how graphics are loaded into the gabs to make them more reliable.
 *    Update made by Yanfly.
 * 
 * Version 1.01: September 27, 2020
 * * Bug Fixes!
 * ** Using actor specific gab window settings during battle should no longer
 *    cause crashes. Fix made by Yanfly.
 * ** Gab Window now scales the whole screen width. Fix made by Irina.
 *
 * Version 1.00: September 10, 2020
 * * Finished Plugin!
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 *
 * @ --------------------------------------------------------------------------
 *
 * @command GabTextOnly
 * @text Gab: Text Only
 * @desc Show a Gab Window with the specified settings.
 * Only text is displayed.
 * 
 * @arg Text:json
 * @text Text
 * @type note
 * @desc The text to be shown in the Gab Window.
 * @default "Hello!"
 * 
 * @arg ForceGab:eval
 * @text Force Gab?
 * @type boolean
 * @on Force this Gab
 * @off Queue this Gab
 * @desc Forced gabs will clear other gabs and display immediately.
 * @default false
 *
 * @arg Override:struct
 * @text Optional Settings
 * @type struct<Override>
 * @desc Change the settings you want to override with this gab.
 * Blank settings will use default Plugin Parameter settings.
 * @default 
 *
 * @ --------------------------------------------------------------------------
 *
 * @command GabTextFaceAny
 * @text Gab: Text + Face (Any)
 * @desc Show a Gab Window with the specified settings.
 * Any face graphic can be displayed next to text.
 * 
 * @arg Text:json
 * @text Text
 * @type note
 * @desc The text to be shown in the Gab Window.
 * @default "Hello!"
 * 
 * @arg Filename:str
 * @text Filename
 * @type file
 * @dir img/faces/
 * @desc The filename of the face graphic to use.
 * @default Actor1
 * 
 * @arg ID:num
 * @text Index
 * @parent Filename:str
 * @type number
 * @desc This is the index of the face graphic.
 * Index values start at 0.
 * @default 0
 * 
 * @arg ForceGab:eval
 * @text Force Gab?
 * @type boolean
 * @on Force this Gab
 * @off Queue this Gab
 * @desc Forced gabs will clear other gabs and display immediately.
 * @default false
 *
 * @arg Override:struct
 * @text Optional Settings
 * @type struct<Override>
 * @desc Change the settings you want to override with this gab.
 * Blank settings will use default Plugin Parameter settings.
 * @default 
 *
 * @ --------------------------------------------------------------------------
 *
 * @command GabTextFaceActor
 * @text Gab: Text + Face (Actor)
 * @desc Show a Gab Window with the specified settings.
 * Pick an actor's face graphic to show with it.
 * 
 * @arg Text:json
 * @text Text
 * @type note
 * @desc The text to be shown in the Gab Window.
 * @default "Hello!"
 * 
 * @arg ID:num
 * @text Actor ID
 * @type actor
 * @desc This is the ID of the actor you want the face graphic of.
 * @default 1
 * 
 * @arg ForceGab:eval
 * @text Force Gab?
 * @type boolean
 * @on Force this Gab
 * @off Queue this Gab
 * @desc Forced gabs will clear other gabs and display immediately.
 * @default false
 *
 * @arg Override:struct
 * @text Optional Settings
 * @type struct<Override>
 * @desc Change the settings you want to override with this gab.
 * Blank settings will use default Plugin Parameter settings.
 * @default 
 *
 * @ --------------------------------------------------------------------------
 *
 * @command GabTextFaceParty
 * @text Gab: Text + Face (Party)
 * @desc Show a Gab Window with the specified settings.
 * Pick a party member's face graphic to show with it.
 * 
 * @arg Text:json
 * @text Text
 * @type note
 * @desc The text to be shown in the Gab Window.
 * @default "Hello!"
 * 
 * @arg ID:num
 * @text Party Member Index
 * @type number
 * @desc This is the index of the party member you want the face
 * graphic of. Index values start at 0.
 * @default 0
 * 
 * @arg ForceGab:eval
 * @text Force Gab?
 * @type boolean
 * @on Force this Gab
 * @off Queue this Gab
 * @desc Forced gabs will clear other gabs and display immediately.
 * @default false
 *
 * @arg Override:struct
 * @text Optional Settings
 * @type struct<Override>
 * @desc Change the settings you want to override with this gab.
 * Blank settings will use default Plugin Parameter settings.
 * @default 
 *
 * @ --------------------------------------------------------------------------
 *
 * @command GabTextSpriteAny
 * @text Gab: Text + Map Sprite (Any)
 * @desc Show a Gab Window with the specified settings.
 * Any map sprite can be displayed next to text.
 * 
 * @arg Text:json
 * @text Text
 * @type note
 * @desc The text to be shown in the Gab Window.
 * @default "Hello!"
 * 
 * @arg Filename:str
 * @text Filename
 * @type file
 * @dir img/characters/
 * @desc The filename of the sprite graphic to use.
 * @default Actor1
 * 
 * @arg ID:num
 * @text Index
 * @parent Filename:str
 * @type number
 * @desc This is the index of the sprite graphic.
 * Index values start at 0.
 * @default 0
 * 
 * @arg ForceGab:eval
 * @text Force Gab?
 * @type boolean
 * @on Force this Gab
 * @off Queue this Gab
 * @desc Forced gabs will clear other gabs and display immediately.
 * @default false
 *
 * @arg Override:struct
 * @text Optional Settings
 * @type struct<Override>
 * @desc Change the settings you want to override with this gab.
 * Blank settings will use default Plugin Parameter settings.
 * @default 
 *
 * @ --------------------------------------------------------------------------
 *
 * @command GabTextSpriteActor
 * @text Gab: Text + Map Sprite (Actor)
 * @desc Show a Gab Window with the specified settings.
 * Pick an actor's sprite graphic to show with it.
 * 
 * @arg Text:json
 * @text Text
 * @type note
 * @desc The text to be shown in the Gab Window.
 * @default "Hello!"
 * 
 * @arg ID:num
 * @text Actor ID
 * @type actor
 * @desc This is the ID of the actor you want the map sprite of.
 * @default 1
 * 
 * @arg ForceGab:eval
 * @text Force Gab?
 * @type boolean
 * @on Force this Gab
 * @off Queue this Gab
 * @desc Forced gabs will clear other gabs and display immediately.
 * @default false
 *
 * @arg Override:struct
 * @text Optional Settings
 * @type struct<Override>
 * @desc Change the settings you want to override with this gab.
 * Blank settings will use default Plugin Parameter settings.
 * @default 
 *
 * @ --------------------------------------------------------------------------
 *
 * @command GabTextSpriteParty
 * @text Gab: Text + Map Sprite (Party)
 * @desc Show a Gab Window with the specified settings.
 * Pick a party member's sprite graphic to show with it.
 * 
 * @arg Text:json
 * @text Text
 * @type note
 * @desc The text to be shown in the Gab Window.
 * @default "Hello!"
 * 
 * @arg ID:num
 * @text Party Member Index
 * @type number
 * @desc This is the index of the party member you want the map
 * sprite of. Index values start at 0.
 * @default 0
 * 
 * @arg ForceGab:eval
 * @text Force Gab?
 * @type boolean
 * @on Force this Gab
 * @off Queue this Gab
 * @desc Forced gabs will clear other gabs and display immediately.
 * @default false
 *
 * @arg Override:struct
 * @text Optional Settings
 * @type struct<Override>
 * @desc Change the settings you want to override with this gab.
 * Blank settings will use default Plugin Parameter settings.
 * @default 
 *
 * @ --------------------------------------------------------------------------
 *
 * @command GabTextSvActorAny
 * @text Gab: Text + Sideview Actor (Any)
 * @desc Show a Gab Window with the specified settings.
 * Any Sideview Actor can be displayed next to text.
 * 
 * @arg Text:json
 * @text Text
 * @type note
 * @desc The text to be shown in the Gab Window.
 * @default "Hello!"
 * 
 * @arg Filename:str
 * @text Filename
 * @type file
 * @dir img/sv_actors/
 * @desc The filename of the Sideview Actor graphic to use.
 * @default Actor1_1
 * 
 * @arg ForceGab:eval
 * @text Force Gab?
 * @type boolean
 * @on Force this Gab
 * @off Queue this Gab
 * @desc Forced gabs will clear other gabs and display immediately.
 * @default false
 *
 * @arg Override:struct
 * @text Optional Settings
 * @type struct<Override>
 * @desc Change the settings you want to override with this gab.
 * Blank settings will use default Plugin Parameter settings.
 * @default 
 *
 * @ --------------------------------------------------------------------------
 *
 * @command GabTextSvActorActor
 * @text Gab: Text + Sideview Actor (Actor)
 * @desc Show a Gab Window with the specified settings.
 * Pick an actor's sideview graphic to show with it.
 * 
 * @arg Text:json
 * @text Text
 * @type note
 * @desc The text to be shown in the Gab Window.
 * @default "Hello!"
 * 
 * @arg ID:num
 * @text Actor ID
 * @type actor
 * @desc This is the ID of the actor you want the sideview graphic of.
 * @default 1
 * 
 * @arg ForceGab:eval
 * @text Force Gab?
 * @type boolean
 * @on Force this Gab
 * @off Queue this Gab
 * @desc Forced gabs will clear other gabs and display immediately.
 * @default false
 *
 * @arg Override:struct
 * @text Optional Settings
 * @type struct<Override>
 * @desc Change the settings you want to override with this gab.
 * Blank settings will use default Plugin Parameter settings.
 * @default 
 *
 * @ --------------------------------------------------------------------------
 *
 * @command GabTextSvActorParty
 * @text Gab: Text + Sideview Actor (Party)
 * @desc Show a Gab Window with the specified settings.
 * Pick a party member's sideview graphic to show with it.
 * 
 * @arg Text:json
 * @text Text
 * @type note
 * @desc The text to be shown in the Gab Window.
 * @default "Hello!"
 * 
 * @arg ID:num
 * @text Party Member Index
 * @type number
 * @desc This is the index of the party member you want the
 * sideview graphic of. Index values start at 0.
 * @default 0
 * 
 * @arg ForceGab:eval
 * @text Force Gab?
 * @type boolean
 * @on Force this Gab
 * @off Queue this Gab
 * @desc Forced gabs will clear other gabs and display immediately.
 * @default false
 *
 * @arg Override:struct
 * @text Optional Settings
 * @type struct<Override>
 * @desc Change the settings you want to override with this gab.
 * Blank settings will use default Plugin Parameter settings.
 * @default 
 *
 * @ --------------------------------------------------------------------------
 *
 * @command GabTextPicture
 * @text Gab: Text + Picture
 * @desc Show a Gab Window with the specified settings.
 * Any picture graphic can be displayed next to text.
 * 
 * @arg Text:json
 * @text Text
 * @type note
 * @desc The text to be shown in the Gab Window.
 * @default "Hello!"
 * 
 * @arg Filename:str
 * @text Filename
 * @type file
 * @dir img/pictures/
 * @desc The filename of the face graphic to use.
 * @default Untitled
 * 
 * @arg Stretched:eval
 * @text Stretch Picture
 * @type boolean
 * @on Stretch Picture
 * @off Don't Stretch
 * @desc Stretch the picture to fit the window?
 * @default true
 * 
 * @arg ForceGab:eval
 * @text Force Gab?
 * @type boolean
 * @on Force this Gab
 * @off Queue this Gab
 * @desc Forced gabs will clear other gabs and display immediately.
 * @default false
 *
 * @arg Override:struct
 * @text Optional Settings
 * @type struct<Override>
 * @desc Change the settings you want to override with this gab.
 * Blank settings will use default Plugin Parameter settings.
 * @default 
 *
 * @ --------------------------------------------------------------------------
 * 
 * @command ClearGab
 * @text System: Clear Gabs
 * @desc Clears out the current Gab and any which are queued.
 *
 * @ --------------------------------------------------------------------------
 * 
 * @command WaitForGab
 * @text System: Wait For Gab Completion
 * @desc Causes the game to wait until all gabs are finished playing.
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
 * @param GabWindow
 * @default Plugin Parameters
 *
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param General:struct
 * @text General Settings
 * @type struct<General>
 * @desc General settings regarding the Gab Window.
 * @default {"General":"","AntiRepeat:eval":"true","CenterGraphics:eval":"true","Fade":"","FadeRate:num":"16","FadeDirection:str":"None","Font":"","GabFontName:str":"","GabFontSize:num":"28","Sprites":"","Character":"","CharacterXPos:num":"36","CharacterYPos:num":"60","SVActor":"","SvActorXPos:num":"44","SvActorYPos:num":"68","Waiting":"","BaseWaitTime:num":"90","TimePerCharacter:num":"4","JavaScript":"","OnDisplayJS:func":"\"// Declare Constants\\nconst gabWindow = this;\\nconst lastGab = arguments[0];\\n\\n// Perform Actions\\n\"","OnFinishJS:func":"\"// Declare Constants\\nconst gabWindow = this;\\nconst lastGab = arguments[0];\\n\\n// Perform Actions\\n\""}
 *
 * @param Map:struct
 * @text Map Settings
 * @type struct<Map>
 * @desc Settings related to the gab window while in the map scene.
 * @default {"MapYLocation:num":"72","MapDimColor1:str":"rgba(0, 0, 0, 0.6)","MapDimColor2:str":"rgba(0, 0, 0, 0)"}
 *
 * @param Battle:struct
 * @text Battle Settings
 * @type struct<Battle>
 * @desc Settings related to the gab window while in the battle scene.
 * @default {"BattleYLocation:num":"108","BattleDimColor1:str":"rgba(0, 0, 0, 0.6)","BattleDimColor2:str":"rgba(0, 0, 0, 0)"}
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
 * General Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~General:
 * 
 * @param General
 * 
 * @param AntiRepeat:eval
 * @text Anti-Repeat
 * @parent General
 * @type boolean
 * @on Anti-Repeat
 * @off Allow Repeat
 * @desc Stops gabs of the same settings from being queued.
 * @default true
 * 
 * @param CenterGraphics:eval
 * @text Center Graphics
 * @parent General
 * @type boolean
 * @on Center Graphics
 * @off Align Top
 * @desc Centers graphics vertically if there are multiple lines.
 * @default true
 * 
 * @param Fade
 * 
 * @param FadeRate:num
 * @text Fade Rate
 * @parent Fade
 * @type number
 * @min 1
 * @desc How fast the gab window fades away.
 * Default: 16
 * @default 16
 * 
 * @param FadeDirection:str
 * @text Fade Direction
 * @parent Fade
 * @type select
 * @option None
 * @option Up
 * @option Down
 * @option Left
 * @option Right
 * @desc The direction to move the window in when fading out.
 * @default None
 *
 * @param Font
 * 
 * @param GabFontName:str
 * @text Gab Font Name
 * @parent Font
 * @desc The font name used for the text of the Gab Window
 * Leave empty to use the default game's font.
 * @default 
 * 
 * @param GabFontSize:num
 * @text Gab Font Size
 * @parent Font
 * @type number
 * @min 1
 * @desc The font size used for the text of the Gab Window.
 * Default: 28
 * @default 28
 * 
 * @param Sprites
 * 
 * @param Character
 * @text Character Sprites
 * @parent Sprites
 * 
 * @param CharacterXPos:num
 * @text X Position
 * @parent Character
 * @type number
 * @desc X position of the character.
 * Default: 36
 * @default 36
 * 
 * @param CharacterYPos:num
 * @text Y Position
 * @parent Character
 * @type number
 * @desc Y position of the character.
 * Default: 60
 * @default 60
 * 
 * @param SVActor
 * @text Sideview Sprites
 * @parent Sprites
 * 
 * @param SvActorXPos:num
 * @text X Position
 * @parent SVActor
 * @type number
 * @desc X position of the Sideview Actor.
 * Default: 44
 * @default 44
 * 
 * @param SvActorYPos:num
 * @text Y Position
 * @parent SVActor
 * @type number
 * @desc Y position of the Sideview Actor.
 * Default: 68
 * @default 68
 * 
 * @param Waiting
 * 
 * @param BaseWaitTime:num
 * @text Base Wait Time
 * @parent Waiting
 * @type number
 * @min 0
 * @desc Minimum frames the Gab Window stays visible.
 * Default: 90
 * @default 90
 * 
 * @param TimePerCharacter:num
 * @text Time Per Character
 * @parent Waiting
 * @type number
 * @min 0
 * @desc Frames added per Text Character.
 * Default: 4
 * @default 4
 * 
 * @param JavaScript
 *
 * @param OnDisplayJS:func
 * @text JS: On Display
 * @parent OnDisplay
 * @type note
 * @desc Runs this code once this Gab Window shows up.
 * This applies to every single gab.
 * @default "// Declare Constants\nconst gabWindow = this;\nconst lastGab = arguments[0];\n\n// Perform Actions\n"
 *
 * @param OnFinishJS:func
 * @text JS: On Finish
 * @parent OnFinish
 * @type note
 * @desc Runs this code once this Gab Window finishes.
 * This applies to every single gab.
 * @default "// Declare Constants\nconst gabWindow = this;\nconst lastGab = arguments[0];\n\n// Perform Actions\n"
 *
 */
/* ----------------------------------------------------------------------------
 * Map Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Map:
 * 
 * @param MapYLocation:num
 * @type number
 * @text Y Location
 * @desc This is the Y location of the Gab Window.
 * Default: 72
 * @default 72
 * 
 * @param MapDimColor1:str
 * @text Dim Color 1
 * @desc This is the dim color 1 used for maps.
 * Default: rgba(0, 0, 0, 0.6)
 * @default rgba(0, 0, 0, 0.6)
 * 
 * @param MapDimColor2:str
 * @text Dim Color 2
 * @desc This is the dim color 2 used for maps.
 * Default: rgba(0, 0, 0, 0)
 * @default rgba(0, 0, 0, 0)
 *
 */
/* ----------------------------------------------------------------------------
 * Battle Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Battle:
 * 
 * @param BattleYLocation:num
 * @type number
 * @text Y Location
 * @desc This is the Y location of the Gab Window.
 * Default: 108
 * @default 108
 * 
 * @param BattleDimColor1:str
 * @text Dim Color 1
 * @desc This is the dim color 1 used for battles.
 * Default: rgba(0, 0, 0, 0.6)
 * @default rgba(0, 0, 0, 0.6)
 * 
 * @param BattleDimColor2:str
 * @text Dim Color 2
 * @desc This is the dim color 2 used for battles.
 * Default: rgba(0, 0, 0, 0)
 * @default rgba(0, 0, 0, 0)
 *
 */
/* ----------------------------------------------------------------------------
 * Override Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Override:
 * 
 * @param DimColor
 * @text Dim Color
 * 
 * @param DimColor1:str
 * @text Dim Color 1
 * @parent DimColor
 * @desc The dim color 1 to use for this Gab Window.
 * Format: rgba(red, green, blue, alpha)
 * @default 
 * 
 * @param DimColor2:str
 * @text Dim Color 2
 * @parent DimColor
 * @desc The dim color 2 to use for this Gab Window.
 * Format: rgba(red, green, blue, alpha)
 * @default 
 * 
 * @param Fade
 * 
 * @param FadeRate:num
 * @text Fade Rate
 * @parent Fade
 * @type number
 * @desc How fast this Gab Window fades away.
 * @default 
 * 
 * @param FadeDirection:str
 * @text Fade Direction
 * @parent Fade
 * @type select
 * @option None
 * @option Up
 * @option Down
 * @option Left
 * @option Right
 * @desc The direction this Gab Window fades out in.
 * @default 
 *
 * @param Font
 * 
 * @param FontName:str
 * @text Font Name
 * @parent Font
 * @desc The font name to use for this Gab Window.
 * @default 
 * 
 * @param FontSize:num
 * @text Font Size
 * @parent Font
 * @type number
 * @desc The font size to use for this Gab Window.
 * @default 
 * 
 * @param Position
 * 
 * @param YLocation:num
 * @text Y Location
 * @parent Position
 * @type number
 * @desc The Y coordinate this Gab Window will appear in.
 * Ignore if you are using a locked sprite position.
 * @default 
 * 
 * @param ActorID:num
 * @text Actor ID
 * @parent Position
 * @type actor
 * @desc The ID of the actor to display this Gab Window above.
 * For Map/Battle. 
 * @default 0
 * 
 * @param PartyIndex:num
 * @text Party Index
 * @parent ActorID:num
 * @desc Index of the party member to display Gab Window above.
 * For Map/Battle. Index values start at 0. Ignore under 0.
 * @default -1
 * 
 * @param EnemyIndex:num
 * @text Enemy Index
 * @parent Position
 * @desc Index of an enemy battler to display Gab Window above.
 * Battle only. Index values start at 0. Ignore under 0.
 * @default -1
 * 
 * @param EventID:num
 * @text Event ID
 * @parent Position
 * @type number
 * @desc The ID of the event to display this Gab Window above.
 * Map only.
 * @default 0
 *
 * @param OnDisplay
 * @text On Display
 * 
 * @param BypassAntiRepeat:eval
 * @text Bypass Anti-Repeat
 * @parent OnDisplay
 * @type boolean
 * @on Bypass
 * @off Use Anti-Repeat
 * @desc Allows this gab to bypass the Anti-Repeat settings.
 * @default false
 * 
 * @param SoundFilename:str
 * @text Sound Filename
 * @parent OnDisplay
 * @type file
 * @dir audio/se
 * @desc The filename of the SE to play when the Gab Window shows.
 * @default 
 *
 * @param OnDisplayJS:func
 * @text JS: On Display
 * @parent OnDisplay
 * @type note
 * @desc Runs this code once this Gab Window shows up.
 * @default 
 *
 * @param OnFinish
 * @text On Finish
 * 
 * @param GabSwitch:num
 * @text Gab Switch
 * @parent OnFinish
 * @type switch
 * @desc The specified switch will be turned ON when the Gab Window finishes.
 * @default 
 *
 * @param OnFinishJS:func
 * @text JS: On Finish
 * @parent OnFinish
 * @type note
 * @desc Runs this code once this Gab Window finishes.
 * @default 
 * 
 * @param Waiting
 * 
 * @param WaitTime:num
 * @text Wait Time
 * @parent Waiting
 * @type number
 * @desc The number of frames this Gab Window stays visible.
 * @default 
 * 
 * @param TimePerCharacter:num
 * @text Time Per Character
 * @parent Waiting
 * @type number
 * @desc Frames added per Text Character in this Gab Window.
 * @default 
 *
 */
//=============================================================================

const _0x269a=['ceil','followers','fontSize','checheckLastGab','STR','createContents','registerCommand','event','prototype','battlerName','60061sEAKvN','checkDuplicateGab','screenX','OnDisplayJS','opacity','actor','GabTextFaceParty','60861sFZaql','_enemyIndex','command357','playSe','filter','format','forceGabData','isHideGabWindow','getLastPluginCommandInterpreter','_gabRunning','GabTextFaceActor','unshift','drawGabCharacter','General','drawGabGraphic','name','members','adjustDimensions','innerHeight','updateFadeOut','playSound','_fadeDirOverride','adjustWidth','isRepositionToActor','repositionToTarget','Game_Interpreter_PluginCommand','updateFadeIn','_waitMode','width','resetFontSettings','91523ywEvCH','height','drawGabFace','ARRAYJSON','FadeDirection','STRUCT','_battle','BattleYLocation','createAllWindows','_gabQueue','_gabSwitch','_graphicIndex','repositionToMapTarget','SceneManager_push','drawTextEx','_graphicType','version','drawCharacter','bind','svActorHorzCells','19qUZAoK','GabTextSpriteParty','trim','_showCount','_spriteset','Map','parse','14940HEygjp','FadeRate','sv_actor','Scene_Battle_createAllWindows','boxWidth','svActorVertCells','GabTextSvActorAny','drawBackground','_eventID','mode','reposition','_tpcOverride','isRepositionToBattleEnemy','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','lineHeight','loadPicture','follower','remove','initMembers','_currentBattleGab','ConvertParams','loadSvActor','determineLockToSprite','_soundName','waitForGab','Override','forceGabWindow','GabTextSpriteActor','contentsOpacity','GabTextSpriteAny','getPictureScale','NUM','drawFace','CharacterXPos','addLoadListener','ARRAYSTR','DOWN','_lockedToTarget','picture','drawSvActor','repositionToMapEvent','Scene_Map_createAllWindows','repositionToBattleTarget','Game_Interpreter_updateWaitMode','checkCurrentGab','_graphicBitmap','WaitForGab','findTargetSprite','AntiRepeat','_fontNameOverride','_currentGab','isSceneBattle','EventID','_victoryPhase','drawGabPicture','restoreGabs','_storedBattleGabs','dimColor1','TimePerCharacter','drawGabBackground','actorId','characterIndex','fontFace','return\x200','425702yGaejs','CenterGraphics','Filename','slice','_gabWindow','drawGabText','_ignoreMask','SoundFilename','updateWaitMode','OnFinishJS','clear','setLastPluginCommandInterpreter','onFinish','call','gradientFillRect','boxHeight','clearGabWindow','loadFace','startCountdown','_storedMapGabs','MapDimColor1','6SsFLPL','Battle','_stretchPicture','205183vgZdzo','push','Text','padding','toLowerCase','_fadeRateOverride','BypassAntiRepeat','loadCharacter','isSceneMap','refresh','_dimColor1Override','index','isAppeared','inBattle','match','itemHeight','create','GabWindow','map','_jsOnDisplay','CharacterYPos','addGabData','isStoreGabs','contents','status','_graphicName','BattleDimColor1','repositionNormal','screenY','29pTkCJC','isGabRunning','removeLoadingGraphic','SvActorXPos','dimColor2','faceHeight','_dimColor2Override','_yLocOverride','EVAL','FUNC','Settings','fittingHeight','onDisplay','ARRAYNUM','EnemyIndex','replace','FontSize','faceName','_text','characterName','initialize','217255GnbPUh','createGabWindow','_lines','onDisplayJS','_scene','_actorID','ARRAYFUNC','innerWidth','length','ARRAYEVAL','ARRAYSTRUCT','BattleDimColor2','character','turnOnGabSwitch','GabTextFaceAny','_lastPluginCommandInterpreter','stringify','storeGabs','createRect','min','_currentMapGab','exit','MapDimColor2','setWaitMode','ForceGab','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','GabFontName','update','%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.','max','Width','LEFT','MapYLocation','gab','_jsOnFinish','_waitTimeOverride','faceWidth','face','itemPadding','DimColor2','GabTextPicture','clearGabData','_fontSizeOverride','processNewGabData','PartyIndex','toUpperCase','none','blt','parameters','startGabWindow','_widthOverride','GabTextSvActorActor','onFinishJS','GabFontSize','resetTextColor','_graphicLoading','drawGabSvActor','constructor','_gabLoaded'];const _0x2a30=function(_0x455195,_0x23e699){_0x455195=_0x455195-0x18e;let _0x269a04=_0x269a[_0x455195];return _0x269a04;};const _0x1eb4ae=_0x2a30;(function(_0xede3f4,_0x632c0){const _0x527e0b=_0x2a30;while(!![]){try{const _0x4302fd=parseInt(_0x527e0b(0x263))*-parseInt(_0x527e0b(0x1e9))+-parseInt(_0x527e0b(0x209))*-parseInt(_0x527e0b(0x194))+-parseInt(_0x527e0b(0x21e))+-parseInt(_0x527e0b(0x1ec))+-parseInt(_0x527e0b(0x1d4))+-parseInt(_0x527e0b(0x288))+-parseInt(_0x527e0b(0x29c))*-parseInt(_0x527e0b(0x26a));if(_0x4302fd===_0x632c0)break;else _0xede3f4['push'](_0xede3f4['shift']());}catch(_0x241d40){_0xede3f4['push'](_0xede3f4['shift']());}}}(_0x269a,0x46b36));var label=_0x1eb4ae(0x1fd),tier=tier||0x0,dependencies=[],pluginData=$plugins[_0x1eb4ae(0x26e)](function(_0x2cf5a5){const _0x10deb5=_0x1eb4ae;return _0x2cf5a5[_0x10deb5(0x204)]&&_0x2cf5a5['description']['includes']('['+label+']');})[0x0];VisuMZ[label][_0x1eb4ae(0x213)]=VisuMZ[label]['Settings']||{},VisuMZ['ConvertParams']=function(_0x5f0bbe,_0x504f6e){const _0x561fcf=_0x1eb4ae;for(const _0x5688cb in _0x504f6e){if(_0x5688cb[_0x561fcf(0x1fa)](/(.*):(.*)/i)){const _0x1f6b63=String(RegExp['$1']),_0x5cce8d=String(RegExp['$2'])[_0x561fcf(0x24b)]()[_0x561fcf(0x18f)]();let _0x38639c,_0x4bcd5c,_0x59ec26;switch(_0x5cce8d){case _0x561fcf(0x1b3):_0x38639c=_0x504f6e[_0x5688cb]!==''?Number(_0x504f6e[_0x5688cb]):0x0;break;case _0x561fcf(0x216):_0x4bcd5c=_0x504f6e[_0x5688cb]!==''?JSON[_0x561fcf(0x193)](_0x504f6e[_0x5688cb]):[],_0x38639c=_0x4bcd5c[_0x561fcf(0x1fe)](_0x1c8ab9=>Number(_0x1c8ab9));break;case _0x561fcf(0x211):_0x38639c=_0x504f6e[_0x5688cb]!==''?eval(_0x504f6e[_0x5688cb]):null;break;case _0x561fcf(0x227):_0x4bcd5c=_0x504f6e[_0x5688cb]!==''?JSON['parse'](_0x504f6e[_0x5688cb]):[],_0x38639c=_0x4bcd5c['map'](_0x362b24=>eval(_0x362b24));break;case'JSON':_0x38639c=_0x504f6e[_0x5688cb]!==''?JSON['parse'](_0x504f6e[_0x5688cb]):'';break;case _0x561fcf(0x28b):_0x4bcd5c=_0x504f6e[_0x5688cb]!==''?JSON[_0x561fcf(0x193)](_0x504f6e[_0x5688cb]):[],_0x38639c=_0x4bcd5c['map'](_0x45e3a3=>JSON['parse'](_0x45e3a3));break;case _0x561fcf(0x212):_0x38639c=_0x504f6e[_0x5688cb]!==''?new Function(JSON[_0x561fcf(0x193)](_0x504f6e[_0x5688cb])):new Function(_0x561fcf(0x1d3));break;case _0x561fcf(0x224):_0x4bcd5c=_0x504f6e[_0x5688cb]!==''?JSON[_0x561fcf(0x193)](_0x504f6e[_0x5688cb]):[],_0x38639c=_0x4bcd5c[_0x561fcf(0x1fe)](_0x4219c9=>new Function(JSON[_0x561fcf(0x193)](_0x4219c9)));break;case _0x561fcf(0x25d):_0x38639c=_0x504f6e[_0x5688cb]!==''?String(_0x504f6e[_0x5688cb]):'';break;case _0x561fcf(0x1b7):_0x4bcd5c=_0x504f6e[_0x5688cb]!==''?JSON[_0x561fcf(0x193)](_0x504f6e[_0x5688cb]):[],_0x38639c=_0x4bcd5c[_0x561fcf(0x1fe)](_0x32a2eb=>String(_0x32a2eb));break;case _0x561fcf(0x28d):_0x59ec26=_0x504f6e[_0x5688cb]!==''?JSON['parse'](_0x504f6e[_0x5688cb]):{},_0x38639c=VisuMZ['ConvertParams']({},_0x59ec26);break;case _0x561fcf(0x228):_0x4bcd5c=_0x504f6e[_0x5688cb]!==''?JSON[_0x561fcf(0x193)](_0x504f6e[_0x5688cb]):[],_0x38639c=_0x4bcd5c[_0x561fcf(0x1fe)](_0x5202bd=>VisuMZ['ConvertParams']({},JSON[_0x561fcf(0x193)](_0x5202bd)));break;default:continue;}_0x5f0bbe[_0x1f6b63]=_0x38639c;}}return _0x5f0bbe;},(_0x5c94c6=>{const _0x38eb5d=_0x1eb4ae,_0x6b02a0=_0x5c94c6[_0x38eb5d(0x279)];for(const _0xeaf345 of dependencies){if(!Imported[_0xeaf345]){alert(_0x38eb5d(0x237)[_0x38eb5d(0x26f)](_0x6b02a0,_0xeaf345)),SceneManager[_0x38eb5d(0x233)]();break;}}const _0xf85cbb=_0x5c94c6['description'];if(_0xf85cbb[_0x38eb5d(0x1fa)](/\[Version[ ](.*?)\]/i)){const _0x381254=Number(RegExp['$1']);_0x381254!==VisuMZ[label][_0x38eb5d(0x298)]&&(alert(_0x38eb5d(0x1a1)[_0x38eb5d(0x26f)](_0x6b02a0,_0x381254)),SceneManager[_0x38eb5d(0x233)]());}if(_0xf85cbb[_0x38eb5d(0x1fa)](/\[Tier[ ](\d+)\]/i)){const _0x323f0e=Number(RegExp['$1']);_0x323f0e<tier?(alert(_0x38eb5d(0x23a)[_0x38eb5d(0x26f)](_0x6b02a0,_0x323f0e,tier)),SceneManager[_0x38eb5d(0x233)]()):tier=Math[_0x38eb5d(0x23b)](_0x323f0e,tier);}VisuMZ[_0x38eb5d(0x1a8)](VisuMZ[label]['Settings'],_0x5c94c6[_0x38eb5d(0x24e)]);})(pluginData),PluginManager[_0x1eb4ae(0x25f)](pluginData['name'],'GabTextOnly',_0x34f481=>{const _0x443a57=_0x1eb4ae;VisuMZ[_0x443a57(0x1a8)](_0x34f481,_0x34f481);const _0x279155=SceneManager[_0x443a57(0x222)];if(!_0x279155[_0x443a57(0x1d8)])return;_0x34f481[_0x443a57(0x236)]?_0x279155[_0x443a57(0x1ae)](_0x34f481):_0x279155[_0x443a57(0x24f)](_0x34f481);}),PluginManager['registerCommand'](pluginData[_0x1eb4ae(0x279)],_0x1eb4ae(0x22c),_0x47e746=>{const _0x4d84a6=_0x1eb4ae;VisuMZ[_0x4d84a6(0x1a8)](_0x47e746,_0x47e746);const _0x1ba177=SceneManager[_0x4d84a6(0x222)];if(!_0x1ba177[_0x4d84a6(0x1d8)])return;_0x47e746[_0x4d84a6(0x19d)]=_0x4d84a6(0x243),_0x47e746['ForceGab']?_0x1ba177[_0x4d84a6(0x1ae)](_0x47e746):_0x1ba177[_0x4d84a6(0x24f)](_0x47e746);}),PluginManager['registerCommand'](pluginData[_0x1eb4ae(0x279)],_0x1eb4ae(0x274),_0x3a49b6=>{const _0x431452=_0x1eb4ae;VisuMZ['ConvertParams'](_0x3a49b6,_0x3a49b6);const _0x1b13f2=SceneManager[_0x431452(0x222)];if(!_0x1b13f2[_0x431452(0x1d8)])return;_0x3a49b6[_0x431452(0x19d)]='face';const _0x5e596f=$gameActors[_0x431452(0x268)](_0x3a49b6['ID']);_0x5e596f?(_0x3a49b6[_0x431452(0x1d6)]=_0x5e596f[_0x431452(0x21a)](),_0x3a49b6['ID']=_0x5e596f['faceIndex']()):_0x3a49b6[_0x431452(0x19d)]=_0x431452(0x24c),_0x3a49b6['ForceGab']?_0x1b13f2[_0x431452(0x1ae)](_0x3a49b6):_0x1b13f2['startGabWindow'](_0x3a49b6);}),PluginManager[_0x1eb4ae(0x25f)](pluginData['name'],_0x1eb4ae(0x269),_0x5d660b=>{const _0x293c35=_0x1eb4ae;VisuMZ[_0x293c35(0x1a8)](_0x5d660b,_0x5d660b);const _0x2f0ffd=SceneManager[_0x293c35(0x222)];if(!_0x2f0ffd[_0x293c35(0x1d8)])return;_0x5d660b[_0x293c35(0x19d)]=_0x293c35(0x243);const _0x4d215a=$gameParty[_0x293c35(0x27a)]()[_0x5d660b['ID']];_0x4d215a?(_0x5d660b[_0x293c35(0x1d6)]=_0x4d215a[_0x293c35(0x21a)](),_0x5d660b['ID']=_0x4d215a['faceIndex']()):_0x5d660b[_0x293c35(0x19d)]=_0x293c35(0x24c),_0x5d660b['ForceGab']?_0x2f0ffd['forceGabWindow'](_0x5d660b):_0x2f0ffd[_0x293c35(0x24f)](_0x5d660b);}),PluginManager[_0x1eb4ae(0x25f)](pluginData['name'],_0x1eb4ae(0x1b1),_0x289498=>{const _0x145a09=_0x1eb4ae;VisuMZ['ConvertParams'](_0x289498,_0x289498);const _0x1576ef=SceneManager[_0x145a09(0x222)];if(!_0x1576ef[_0x145a09(0x1d8)])return;_0x289498[_0x145a09(0x19d)]=_0x145a09(0x22a),_0x289498[_0x145a09(0x236)]?_0x1576ef['forceGabWindow'](_0x289498):_0x1576ef[_0x145a09(0x24f)](_0x289498);}),PluginManager[_0x1eb4ae(0x25f)](pluginData['name'],_0x1eb4ae(0x1af),_0x475315=>{const _0xff68b1=_0x1eb4ae;VisuMZ[_0xff68b1(0x1a8)](_0x475315,_0x475315);const _0x1c9085=SceneManager[_0xff68b1(0x222)];if(!_0x1c9085['_gabWindow'])return;_0x475315[_0xff68b1(0x19d)]=_0xff68b1(0x22a);const _0x4229bc=$gameActors[_0xff68b1(0x268)](_0x475315['ID']);_0x4229bc?(_0x475315['Filename']=_0x4229bc[_0xff68b1(0x21c)](),_0x475315['ID']=_0x4229bc[_0xff68b1(0x1d1)]()):_0x475315[_0xff68b1(0x19d)]=_0xff68b1(0x24c),_0x475315[_0xff68b1(0x236)]?_0x1c9085[_0xff68b1(0x1ae)](_0x475315):_0x1c9085[_0xff68b1(0x24f)](_0x475315);}),PluginManager['registerCommand'](pluginData[_0x1eb4ae(0x279)],_0x1eb4ae(0x18e),_0x5a2cba=>{const _0x40c903=_0x1eb4ae;VisuMZ[_0x40c903(0x1a8)](_0x5a2cba,_0x5a2cba);const _0x3d24ed=SceneManager[_0x40c903(0x222)];if(!_0x3d24ed[_0x40c903(0x1d8)])return;_0x5a2cba[_0x40c903(0x19d)]='character';const _0x30d544=$gameParty['members']()[_0x5a2cba['ID']];_0x30d544?(_0x5a2cba['Filename']=_0x30d544[_0x40c903(0x21c)](),_0x5a2cba['ID']=_0x30d544[_0x40c903(0x1d1)]()):_0x5a2cba[_0x40c903(0x19d)]=_0x40c903(0x24c),_0x5a2cba[_0x40c903(0x236)]?_0x3d24ed[_0x40c903(0x1ae)](_0x5a2cba):_0x3d24ed[_0x40c903(0x24f)](_0x5a2cba);}),PluginManager[_0x1eb4ae(0x25f)](pluginData[_0x1eb4ae(0x279)],_0x1eb4ae(0x19a),_0x4824a1=>{const _0x5c4ac0=_0x1eb4ae;VisuMZ['ConvertParams'](_0x4824a1,_0x4824a1);const _0x5642d5=SceneManager[_0x5c4ac0(0x222)];if(!_0x5642d5['_gabWindow'])return;_0x4824a1['mode']=_0x5c4ac0(0x196),_0x4824a1[_0x5c4ac0(0x236)]?_0x5642d5['forceGabWindow'](_0x4824a1):_0x5642d5[_0x5c4ac0(0x24f)](_0x4824a1);}),PluginManager[_0x1eb4ae(0x25f)](pluginData[_0x1eb4ae(0x279)],_0x1eb4ae(0x251),_0x405140=>{const _0x11b5a9=_0x1eb4ae;VisuMZ[_0x11b5a9(0x1a8)](_0x405140,_0x405140);const _0x590bc0=SceneManager[_0x11b5a9(0x222)];if(!_0x590bc0[_0x11b5a9(0x1d8)])return;_0x405140[_0x11b5a9(0x19d)]=_0x11b5a9(0x196);const _0x490d24=$gameActors[_0x11b5a9(0x268)](_0x405140['ID']);_0x490d24?_0x405140['Filename']=_0x490d24[_0x11b5a9(0x262)]():_0x405140[_0x11b5a9(0x19d)]='none',_0x405140[_0x11b5a9(0x236)]?_0x590bc0['forceGabWindow'](_0x405140):_0x590bc0['startGabWindow'](_0x405140);}),PluginManager[_0x1eb4ae(0x25f)](pluginData[_0x1eb4ae(0x279)],'GabTextSvActorParty',_0x523793=>{const _0x590542=_0x1eb4ae;VisuMZ[_0x590542(0x1a8)](_0x523793,_0x523793);const _0x56edec=SceneManager[_0x590542(0x222)];if(!_0x56edec[_0x590542(0x1d8)])return;_0x523793['mode']=_0x590542(0x196);const _0x3e7c65=$gameParty[_0x590542(0x27a)]()[_0x523793['ID']];_0x3e7c65?_0x523793[_0x590542(0x1d6)]=_0x3e7c65[_0x590542(0x262)]():_0x523793['mode']=_0x590542(0x24c),_0x523793['ForceGab']?_0x56edec[_0x590542(0x1ae)](_0x523793):_0x56edec['startGabWindow'](_0x523793);}),PluginManager[_0x1eb4ae(0x25f)](pluginData[_0x1eb4ae(0x279)],_0x1eb4ae(0x246),_0x3a1360=>{const _0xa385d3=_0x1eb4ae;VisuMZ['ConvertParams'](_0x3a1360,_0x3a1360);const _0x26d61e=SceneManager[_0xa385d3(0x222)];if(!_0x26d61e[_0xa385d3(0x1d8)])return;_0x3a1360[_0xa385d3(0x19d)]=_0xa385d3(0x1ba),_0x3a1360[_0xa385d3(0x236)]?_0x26d61e[_0xa385d3(0x1ae)](_0x3a1360):_0x26d61e[_0xa385d3(0x24f)](_0x3a1360);}),PluginManager[_0x1eb4ae(0x25f)](pluginData['name'],_0x1eb4ae(0x1c2),_0x78c9b=>{const _0x33914e=_0x1eb4ae,_0x5c296c=$gameTemp[_0x33914e(0x272)]();_0x5c296c['waitForGab']();}),PluginManager[_0x1eb4ae(0x25f)](pluginData[_0x1eb4ae(0x279)],'ClearGab',_0x5afe04=>{const _0x4fdc94=_0x1eb4ae,_0x574152=SceneManager[_0x4fdc94(0x222)];if(_0x574152[_0x4fdc94(0x1d8)])_0x574152[_0x4fdc94(0x1e4)]();}),VisuMZ[_0x1eb4ae(0x1fd)]['SceneManager_push']=SceneManager[_0x1eb4ae(0x1ed)],SceneManager[_0x1eb4ae(0x1ed)]=function(_0x371849){const _0x58d70b=_0x1eb4ae;this[_0x58d70b(0x202)](_0x371849)&&this['_scene']['_gabWindow']['storeGabs'](),VisuMZ[_0x58d70b(0x1fd)][_0x58d70b(0x295)][_0x58d70b(0x1e1)](this,_0x371849);},SceneManager[_0x1eb4ae(0x202)]=function(_0x1d3df0){const _0x3255c3=_0x1eb4ae;return _0x1d3df0===Scene_Map&&!this[_0x3255c3(0x1f4)]()||_0x1d3df0===Scene_Battle&&this[_0x3255c3(0x1f4)]();},SceneManager[_0x1eb4ae(0x1c7)]=function(){const _0x336c78=_0x1eb4ae;return this[_0x336c78(0x222)]&&this[_0x336c78(0x222)][_0x336c78(0x257)]===Scene_Battle;},SceneManager[_0x1eb4ae(0x1f4)]=function(){const _0x17027d=_0x1eb4ae;return this[_0x17027d(0x222)]instanceof Scene_Map;},Game_Temp[_0x1eb4ae(0x261)][_0x1eb4ae(0x1df)]=function(_0x1a7737){const _0x29d5a2=_0x1eb4ae;this[_0x29d5a2(0x22d)]=_0x1a7737;},Game_Temp[_0x1eb4ae(0x261)][_0x1eb4ae(0x272)]=function(){return this['_lastPluginCommandInterpreter'];},VisuMZ[_0x1eb4ae(0x1fd)][_0x1eb4ae(0x283)]=Game_Interpreter[_0x1eb4ae(0x261)]['command357'],Game_Interpreter[_0x1eb4ae(0x261)][_0x1eb4ae(0x26c)]=function(_0x1f2093){const _0x351313=_0x1eb4ae;return $gameTemp['setLastPluginCommandInterpreter'](this),VisuMZ[_0x351313(0x1fd)][_0x351313(0x283)]['call'](this,_0x1f2093);},Game_Interpreter[_0x1eb4ae(0x261)][_0x1eb4ae(0x1ac)]=function(){const _0x301439=_0x1eb4ae;this[_0x301439(0x235)](_0x301439(0x23f));},VisuMZ[_0x1eb4ae(0x1fd)][_0x1eb4ae(0x1bf)]=Game_Interpreter[_0x1eb4ae(0x261)][_0x1eb4ae(0x1dc)],Game_Interpreter['prototype'][_0x1eb4ae(0x1dc)]=function(){const _0x192bc0=_0x1eb4ae;return this[_0x192bc0(0x285)]===_0x192bc0(0x23f)?this[_0x192bc0(0x20a)]():VisuMZ[_0x192bc0(0x1fd)][_0x192bc0(0x1bf)][_0x192bc0(0x1e1)](this);},Game_Interpreter[_0x1eb4ae(0x261)][_0x1eb4ae(0x20a)]=function(){const _0x145b2e=_0x1eb4ae,_0x52fb24=SceneManager[_0x145b2e(0x222)],_0x4b0f3f=_0x52fb24[_0x145b2e(0x1d8)];return _0x4b0f3f?_0x4b0f3f['_gabQueue']['length']>0x0||_0x4b0f3f[_0x145b2e(0x273)]:![];},Scene_Base[_0x1eb4ae(0x261)][_0x1eb4ae(0x21f)]=function(_0x3f708b){const _0x2a28e4=_0x1eb4ae;this['_gabWindow']=new Window_Gab(_0x3f708b),this['addChild'](this[_0x2a28e4(0x1d8)]);},Scene_Base[_0x1eb4ae(0x261)][_0x1eb4ae(0x24f)]=function(_0x4a77e4){const _0x2a7467=_0x1eb4ae;this[_0x2a7467(0x1d8)][_0x2a7467(0x201)](_0x4a77e4);},Scene_Base['prototype'][_0x1eb4ae(0x1ae)]=function(_0x62d50f){const _0x4b17ce=_0x1eb4ae;this[_0x4b17ce(0x1d8)][_0x4b17ce(0x270)](_0x62d50f);},Scene_Base[_0x1eb4ae(0x261)][_0x1eb4ae(0x1e4)]=function(){const _0x12a777=_0x1eb4ae;this[_0x12a777(0x1d8)][_0x12a777(0x247)]();},VisuMZ[_0x1eb4ae(0x1fd)][_0x1eb4ae(0x1bd)]=Scene_Map['prototype'][_0x1eb4ae(0x290)],Scene_Map[_0x1eb4ae(0x261)][_0x1eb4ae(0x290)]=function(){const _0x4e735f=_0x1eb4ae;VisuMZ[_0x4e735f(0x1fd)]['Scene_Map_createAllWindows'][_0x4e735f(0x1e1)](this),this['createGabWindow'](![]);},VisuMZ[_0x1eb4ae(0x1fd)][_0x1eb4ae(0x197)]=Scene_Battle[_0x1eb4ae(0x261)][_0x1eb4ae(0x290)],Scene_Battle[_0x1eb4ae(0x261)][_0x1eb4ae(0x290)]=function(){const _0x56adbd=_0x1eb4ae;VisuMZ[_0x56adbd(0x1fd)][_0x56adbd(0x197)]['call'](this),this[_0x56adbd(0x21f)](!![]);},ImageManager[_0x1eb4ae(0x29b)]=ImageManager[_0x1eb4ae(0x29b)]||0x9,ImageManager[_0x1eb4ae(0x199)]=ImageManager['svActorVertCells']||0x6,Window_Base[_0x1eb4ae(0x261)]['drawSvActor']=function(_0x14b037,_0x3391d2,_0x1aa3c9){const _0x1f414f=_0x1eb4ae,_0x4b4dff=ImageManager[_0x1f414f(0x1a9)](_0x14b037),_0x166386=_0x4b4dff['width']/ImageManager[_0x1f414f(0x29b)],_0x4b5224=_0x4b4dff[_0x1f414f(0x289)]/ImageManager[_0x1f414f(0x199)],_0x547a9a=0x0,_0x37b3e3=0x0;this[_0x1f414f(0x203)][_0x1f414f(0x24d)](_0x4b4dff,_0x547a9a,_0x37b3e3,_0x166386,_0x4b5224,_0x3391d2-_0x166386/0x2,_0x1aa3c9-_0x4b5224);};function Window_Gab(){this['initialize'](...arguments);}Window_Gab[_0x1eb4ae(0x261)]=Object[_0x1eb4ae(0x1fc)](Window_Base[_0x1eb4ae(0x261)]),Window_Gab[_0x1eb4ae(0x261)]['constructor']=Window_Gab,Window_Gab['prototype'][_0x1eb4ae(0x21d)]=function(_0x12b2f8){const _0x56e7ac=_0x1eb4ae;this[_0x56e7ac(0x1a6)](_0x12b2f8);const _0x5b52c5=this['createRect'](_0x12b2f8);this[_0x56e7ac(0x255)]=[],Window_Base['prototype'][_0x56e7ac(0x21d)][_0x56e7ac(0x1e1)](this,_0x5b52c5),this[_0x56e7ac(0x1cb)](),this[_0x56e7ac(0x1de)]();},Window_Gab[_0x1eb4ae(0x261)]['initMembers']=function(_0x4b5242){const _0x1dc19a=_0x1eb4ae;this[_0x1dc19a(0x28e)]=_0x4b5242,this[_0x1dc19a(0x292)]=0x0,this[_0x1dc19a(0x190)]=0x0,this[_0x1dc19a(0x1da)]=!![],this[_0x1dc19a(0x291)]=[],this[_0x1dc19a(0x1c6)]=[],this[_0x1dc19a(0x273)]=![];},Window_Gab[_0x1eb4ae(0x261)]['updatePadding']=function(){const _0x2c28d7=_0x1eb4ae;this[_0x2c28d7(0x1ef)]=0x0;},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x214)]=function(_0xb8b857){const _0x4b77ba=_0x1eb4ae;return _0xb8b857*this[_0x4b77ba(0x1fb)]()+this[_0x4b77ba(0x1ef)]*0x2;},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x230)]=function(_0x43a825){const _0xa449ad=_0x1eb4ae,_0x3747b8=this[_0xa449ad(0x1ef)];let _0x477eae=_0x3747b8*-0x1,_0x261d70=0x0;const _0x59c33a=VisuMZ['GabWindow'][_0xa449ad(0x213)];_0x43a825?_0x261d70=_0x59c33a[_0xa449ad(0x1ea)][_0xa449ad(0x28f)]:_0x261d70=_0x59c33a[_0xa449ad(0x192)][_0xa449ad(0x23e)];_0x261d70-=this[_0xa449ad(0x1ef)];let _0x65dd6c=Graphics[_0xa449ad(0x286)]+_0x3747b8*0x2,_0x1a1456=this[_0xa449ad(0x214)](0x2);return new Rectangle(_0x477eae,_0x261d70,_0x65dd6c,_0x1a1456);},Window_Gab[_0x1eb4ae(0x261)]['clear']=function(){const _0x39f2fa=_0x1eb4ae;this[_0x39f2fa(0x258)]=![],this[_0x39f2fa(0x267)]=0x0,this[_0x39f2fa(0x1b0)]=0x0,this[_0x39f2fa(0x21b)]='',this['_graphicType']=_0x39f2fa(0x24c),this[_0x39f2fa(0x205)]='',this[_0x39f2fa(0x293)]=0x0,this[_0x39f2fa(0x1ab)]='',delete this[_0x39f2fa(0x1c1)],delete this[_0x39f2fa(0x1c5)],delete this[_0x39f2fa(0x248)],delete this[_0x39f2fa(0x241)],delete this[_0x39f2fa(0x19f)],delete this['_yLocOverride'],delete this['_widthOVerride'],delete this[_0x39f2fa(0x1f6)],delete this[_0x39f2fa(0x20f)],delete this[_0x39f2fa(0x1ff)];},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x287)]=function(){const _0x517497=_0x1eb4ae,_0x53c13b=VisuMZ['GabWindow'][_0x517497(0x213)];this[_0x517497(0x203)][_0x517497(0x1d2)]=this[_0x517497(0x1c5)]||_0x53c13b[_0x517497(0x277)][_0x517497(0x238)]||$gameSystem['mainFontFace'](),this[_0x517497(0x203)][_0x517497(0x25b)]=this[_0x517497(0x248)]||_0x53c13b[_0x517497(0x277)][_0x517497(0x253)]||0x1c,this[_0x517497(0x254)]();},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x239)]=function(){const _0x310842=_0x1eb4ae;Window_Base[_0x310842(0x261)][_0x310842(0x239)][_0x310842(0x1e1)](this);if(this[_0x310842(0x1b0)]>0x0){if(this['_lockedToTarget'])this[_0x310842(0x19e)]();}if(this[_0x310842(0x271)]())this['hide']();else{if(this['_gabLoaded']){if(this['_graphicLoading'][_0x310842(0x226)]>0x0)return;this[_0x310842(0x1f5)]();}else{if(this['_showCount']>0x0)this[_0x310842(0x284)](),--this[_0x310842(0x190)];else{if(this['contentsOpacity']>0x0)this[_0x310842(0x27d)]();else this[_0x310842(0x291)][_0x310842(0x226)]>0x0?this[_0x310842(0x249)]():(this[_0x310842(0x273)]=![],delete this[_0x310842(0x19c)]);}}}},Window_Gab['prototype'][_0x1eb4ae(0x271)]=function(){const _0x40794b=_0x1eb4ae;if($gameParty[_0x40794b(0x1f9)]()&&BattleManager[_0x40794b(0x1c9)])return!![];return![];},Window_Gab[_0x1eb4ae(0x261)]['updateFadeIn']=function(){const _0xf75c92=_0x1eb4ae;this['contentsOpacity']+=this['_fadeRateOverride']||VisuMZ[_0xf75c92(0x1fd)][_0xf75c92(0x213)][_0xf75c92(0x277)]['FadeRate'];},Window_Gab[_0x1eb4ae(0x261)]['updateFadeOut']=function(){const _0x3ebe4a=_0x1eb4ae,_0x40b61b=this[_0x3ebe4a(0x1f1)]||VisuMZ[_0x3ebe4a(0x1fd)][_0x3ebe4a(0x213)][_0x3ebe4a(0x277)]['FadeRate'],_0x26c44c=this[_0x3ebe4a(0x27f)]||VisuMZ[_0x3ebe4a(0x1fd)][_0x3ebe4a(0x213)]['General']['FadeDirection'],_0x2d19a6=this[_0x3ebe4a(0x1b0)];this['contentsOpacity']-=_0x40b61b;switch(_0x26c44c[_0x3ebe4a(0x24b)]()['trim']()){case'UP':this['y']-=_0x40b61b;break;case _0x3ebe4a(0x1b8):this['y']+=_0x40b61b;break;case _0x3ebe4a(0x23d):this['x']-=_0x40b61b;break;case'RIGHT':this['x']+=_0x40b61b;break;}if(this[_0x3ebe4a(0x1b0)]>0x0)return;if(_0x2d19a6>0x0)this[_0x3ebe4a(0x1e0)]();},Window_Gab[_0x1eb4ae(0x261)]['onFinish']=function(){const _0x1cd913=_0x1eb4ae;this[_0x1cd913(0x1b9)]=null,this[_0x1cd913(0x22b)](),this[_0x1cd913(0x252)]();},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x22b)]=function(){const _0x3e693=_0x1eb4ae;$gameSwitches['setValue'](this[_0x3e693(0x292)],!![]),this[_0x3e693(0x292)]=0x0;},Window_Gab['prototype'][_0x1eb4ae(0x252)]=function(){const _0x1acc03=_0x1eb4ae;if(this[_0x1acc03(0x240)])this[_0x1acc03(0x240)][_0x1acc03(0x1e1)](this);delete this[_0x1acc03(0x240)];const _0x4a6d62=VisuMZ['GabWindow'][_0x1acc03(0x213)][_0x1acc03(0x277)];if(_0x4a6d62['OnFinishJS'])_0x4a6d62[_0x1acc03(0x1dd)]['call'](this,this[_0x1acc03(0x1c6)]);},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x201)]=function(_0x336346){if(!_0x336346)return;if(this['checkDuplicateGab'](_0x336346))return;this['_gabQueue']['push'](_0x336346);},Window_Gab[_0x1eb4ae(0x261)]['forceGabData']=function(_0x358186){const _0xd0439a=_0x1eb4ae;if(!_0x358186)return;this[_0xd0439a(0x247)](),this['_gabQueue'][_0xd0439a(0x1ed)](_0x358186);},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x247)]=function(){const _0x43a680=_0x1eb4ae;this[_0x43a680(0x291)]=[],this[_0x43a680(0x1c6)]=[],this['_showCount']=0x0;},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x264)]=function(_0x3bbbc8){const _0x3312ec=_0x1eb4ae;if(!VisuMZ[_0x3312ec(0x1fd)][_0x3312ec(0x213)]['General'][_0x3312ec(0x1c4)])return![];const _0x38c1c9=_0x3bbbc8[_0x3312ec(0x1ad)];if(_0x38c1c9&&_0x38c1c9[_0x3312ec(0x1f2)])return![];if(this['checkCurrentGab'](_0x3bbbc8))return!![];if(this[_0x3312ec(0x25c)](_0x3bbbc8))return!![];return![];},Window_Gab['prototype'][_0x1eb4ae(0x1c0)]=function(_0x24923e){const _0x292ec6=_0x1eb4ae;return JSON['stringify'](this[_0x292ec6(0x1c6)])===JSON[_0x292ec6(0x22e)](_0x24923e);},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x25c)]=function(_0x4428c8){const _0xf787e9=_0x1eb4ae;this['_gabQueue']=this['_gabQueue']||[];for(const _0x2b438d of this[_0xf787e9(0x291)]){const _0x2f45df=this['_gabQueue'][this[_0xf787e9(0x291)][_0xf787e9(0x226)]-0x1]||{};if(JSON[_0xf787e9(0x22e)](_0x2f45df)===JSON[_0xf787e9(0x22e)](_0x4428c8))return!![];}return![];},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x249)]=function(){const _0x555b97=_0x1eb4ae,_0x31b9f6=this[_0x555b97(0x291)]['shift']();this[_0x555b97(0x273)]=!![],this[_0x555b97(0x1c6)]=_0x31b9f6,this['loadNewGabData'](_0x31b9f6),this['setupLoadGraphic'](),this[_0x555b97(0x258)]=!![];},Window_Gab[_0x1eb4ae(0x261)]['loadNewGabData']=function(_0x4d71c8){const _0x11d832=_0x1eb4ae;this[_0x11d832(0x21b)]=_0x4d71c8[_0x11d832(0x1ee)]||'',this[_0x11d832(0x220)]=this[_0x11d832(0x21b)]['split'](/[\r\n]+/)[_0x11d832(0x226)],this[_0x11d832(0x297)]=_0x4d71c8[_0x11d832(0x19d)]||_0x11d832(0x24c),this[_0x11d832(0x205)]=_0x4d71c8[_0x11d832(0x1d6)]||'',this[_0x11d832(0x293)]=_0x4d71c8['ID']||0x0,this['_stretchPicture']=_0x4d71c8['Stretched']||![];const _0x431ea7=_0x4d71c8[_0x11d832(0x1ad)]||{};this['_soundName']=_0x431ea7[_0x11d832(0x1db)]||'',this[_0x11d832(0x1ff)]=_0x431ea7[_0x11d832(0x266)]||null,this[_0x11d832(0x292)]=_0x431ea7['GabSwitch']||0x0,this[_0x11d832(0x240)]=_0x431ea7[_0x11d832(0x1dd)]||null,this[_0x11d832(0x1c5)]=_0x431ea7['FontName'],this[_0x11d832(0x248)]=_0x431ea7[_0x11d832(0x219)],this[_0x11d832(0x241)]=_0x431ea7['WaitTime'],this['_tpcOverride']=_0x431ea7[_0x11d832(0x1ce)],this[_0x11d832(0x1f1)]=_0x431ea7[_0x11d832(0x195)],this[_0x11d832(0x27f)]=_0x431ea7[_0x11d832(0x28c)],this[_0x11d832(0x210)]=_0x431ea7['YLocation'],this[_0x11d832(0x250)]=_0x431ea7[_0x11d832(0x23c)],this['_dimColor1Override']=_0x431ea7['DimColor1'],this['_dimColor2Override']=_0x431ea7[_0x11d832(0x245)],this[_0x11d832(0x223)]=_0x431ea7['ActorID'];if(_0x431ea7[_0x11d832(0x24a)]!==undefined&&_0x431ea7['PartyIndex']>=0x0){const _0x2dbc25=_0x431ea7[_0x11d832(0x24a)],_0x4796ed=$gameParty[_0x11d832(0x27a)]()[_0x2dbc25];if(_0x4796ed)this[_0x11d832(0x223)]=_0x4796ed[_0x11d832(0x1d0)]();}this[_0x11d832(0x19c)]=_0x431ea7[_0x11d832(0x1c8)],this['_enemyIndex']=-0x1,_0x431ea7[_0x11d832(0x217)]!==undefined&&_0x431ea7[_0x11d832(0x217)]>=0x0&&(this[_0x11d832(0x26b)]=_0x431ea7[_0x11d832(0x217)]);},Window_Gab[_0x1eb4ae(0x261)]['setupLoadGraphic']=function(){const _0x3d4f39=_0x1eb4ae,_0x281475=this[_0x3d4f39(0x205)];switch(this[_0x3d4f39(0x297)][_0x3d4f39(0x1f0)]()[_0x3d4f39(0x18f)]()){case _0x3d4f39(0x22a):this['_graphicBitmap']=ImageManager[_0x3d4f39(0x1f3)](_0x281475),this[_0x3d4f39(0x255)]['push'](this[_0x3d4f39(0x1c1)]),this[_0x3d4f39(0x1c1)][_0x3d4f39(0x1b6)](this[_0x3d4f39(0x20b)]['bind'](this,this[_0x3d4f39(0x1c1)]));break;case _0x3d4f39(0x243):this[_0x3d4f39(0x1c1)]=ImageManager[_0x3d4f39(0x1e5)](_0x281475),this[_0x3d4f39(0x255)]['push'](this[_0x3d4f39(0x1c1)]),this[_0x3d4f39(0x1c1)][_0x3d4f39(0x1b6)](this['removeLoadingGraphic'][_0x3d4f39(0x29a)](this,this[_0x3d4f39(0x1c1)]));break;case _0x3d4f39(0x196):this[_0x3d4f39(0x1c1)]=ImageManager[_0x3d4f39(0x1a9)](_0x281475),this[_0x3d4f39(0x255)][_0x3d4f39(0x1ed)](this[_0x3d4f39(0x1c1)]),this[_0x3d4f39(0x1c1)][_0x3d4f39(0x1b6)](this[_0x3d4f39(0x20b)][_0x3d4f39(0x29a)](this,this[_0x3d4f39(0x1c1)]));break;case'picture':this[_0x3d4f39(0x1c1)]=ImageManager[_0x3d4f39(0x1a3)](_0x281475),this[_0x3d4f39(0x255)][_0x3d4f39(0x1ed)](this[_0x3d4f39(0x1c1)]),this['_graphicBitmap'][_0x3d4f39(0x1b6)](this['removeLoadingGraphic']['bind'](this,this[_0x3d4f39(0x1c1)]));break;default:break;}},Window_Gab['prototype'][_0x1eb4ae(0x20b)]=function(_0x1e5d4a){const _0x5e7288=_0x1eb4ae;this[_0x5e7288(0x255)][_0x5e7288(0x1a5)](_0x1e5d4a);},Window_Gab[_0x1eb4ae(0x261)]['refresh']=function(){const _0x2a187b=_0x1eb4ae;this[_0x2a187b(0x203)][_0x2a187b(0x1de)](),this[_0x2a187b(0x1aa)](),this['adjustDimensions'](),this[_0x2a187b(0x19e)](),this['drawGabBackground'](),this[_0x2a187b(0x278)](),this['drawGabText'](),this[_0x2a187b(0x1e6)](),this[_0x2a187b(0x215)](),this[_0x2a187b(0x1de)]();},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x1aa)]=function(){const _0x3d63d3=_0x1eb4ae;this[_0x3d63d3(0x1b9)]=null;if(this[_0x3d63d3(0x281)]())return!![];else{if(this['isRepositionToMapEvent']())return!![];else{if(this[_0x3d63d3(0x1a0)]())return!![];}}return![];},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x281)]=function(){const _0x34d6e6=_0x1eb4ae;if(this['_actorID']<=0x0)return![];const _0x4ace20=$gameActors[_0x34d6e6(0x268)](this['_actorID']);if(!_0x4ace20)return![];if(!_0x4ace20['isBattleMember']())return![];if(SceneManager[_0x34d6e6(0x1c7)]())return $gameSystem['isSideView']()&&_0x4ace20[_0x34d6e6(0x1f8)]()&&(this[_0x34d6e6(0x1b9)]=_0x4ace20),!![];else{if(SceneManager[_0x34d6e6(0x1f4)]()){if(_0x4ace20['index']()===0x0)return this[_0x34d6e6(0x1b9)]=$gamePlayer,!![];if($gamePlayer[_0x34d6e6(0x25a)]()['isVisible']())return this[_0x34d6e6(0x1b9)]=$gamePlayer[_0x34d6e6(0x25a)]()[_0x34d6e6(0x1a4)](_0x4ace20[_0x34d6e6(0x1f7)]()-0x1),!![];}}return![];},Window_Gab[_0x1eb4ae(0x261)]['isRepositionToMapEvent']=function(){const _0x2e17bc=_0x1eb4ae;if(!SceneManager['isSceneMap']())return![];if(this['_eventID']>0x0&&!!$gameMap['event'](this[_0x2e17bc(0x19c)]))return this['_lockedToTarget']=$gameMap[_0x2e17bc(0x260)](this[_0x2e17bc(0x19c)]),!![];return![];},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x1a0)]=function(){const _0x321fc9=_0x1eb4ae;if(!SceneManager['isSceneBattle']())return![];if(this[_0x321fc9(0x26b)]>=0x0){const _0x594031=$gameTroop['members']()[this[_0x321fc9(0x26b)]];if(_0x594031&&_0x594031[_0x321fc9(0x1f8)]())return this[_0x321fc9(0x1b9)]=_0x594031,!![];}return![];},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x27b)]=function(){const _0x27da7f=_0x1eb4ae,_0x49d23f=this['padding']||0x0;let _0x765a4c=Graphics[_0x27da7f(0x286)]+_0x49d23f*0x2;this[_0x27da7f(0x286)]=this['adjustWidth'](_0x765a4c);let _0x1e8272=this[_0x27da7f(0x214)](this[_0x27da7f(0x220)]+0x1);this[_0x27da7f(0x289)]=_0x1e8272,this[_0x27da7f(0x25e)]();},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x280)]=function(_0x445229){const _0x2fae20=_0x1eb4ae,_0x70bd31=VisuMZ[_0x2fae20(0x1fd)][_0x2fae20(0x213)];if(this[_0x2fae20(0x1b9)]){_0x445229=this['textSizeEx'](this['_text'])['width'],_0x445229+=this[_0x2fae20(0x1ef)]*0x2,_0x445229+=this['itemPadding']()*0x4;switch(this[_0x2fae20(0x297)]['toLowerCase']()[_0x2fae20(0x18f)]()){case _0x2fae20(0x22a):_0x445229+=_0x70bd31[_0x2fae20(0x277)][_0x2fae20(0x1b5)]*0x2,_0x445229-=this[_0x2fae20(0x244)]()*0x2;break;case _0x2fae20(0x243):_0x445229+=ImageManager['faceWidth'];break;case'sv_actor':_0x445229+=_0x70bd31[_0x2fae20(0x277)][_0x2fae20(0x20c)]*0x2,_0x445229-=this[_0x2fae20(0x244)]()*0x2;break;case _0x2fae20(0x1ba):let _0x40efc9=this['_graphicBitmap']?this[_0x2fae20(0x1c1)][_0x2fae20(0x286)]:0x0;this[_0x2fae20(0x1eb)]&&(_0x40efc9*=this[_0x2fae20(0x1b2)]());_0x445229+=Math[_0x2fae20(0x259)](_0x40efc9);break;}}return _0x445229;},Window_Gab['prototype'][_0x1eb4ae(0x19e)]=function(){const _0x59e137=_0x1eb4ae;if(this['_lockedToTarget']){if(SceneManager[_0x59e137(0x1c7)]())return this[_0x59e137(0x1be)]();else{if(SceneManager[_0x59e137(0x1f4)]())return this[_0x59e137(0x294)]();}}this[_0x59e137(0x207)]();},Window_Gab['prototype'][_0x1eb4ae(0x1be)]=function(){const _0x5b7606=_0x1eb4ae,_0x129153=SceneManager[_0x5b7606(0x222)];if(!_0x129153)return;const _0x291002=_0x129153[_0x5b7606(0x191)];if(!_0x291002)return;const _0x4332b1=_0x291002[_0x5b7606(0x1c3)](this[_0x5b7606(0x1b9)]);if(!_0x4332b1)return;let _0x587f6d=_0x4332b1['x'],_0x481740=_0x4332b1['y']-_0x4332b1[_0x5b7606(0x289)];_0x587f6d+=Math[_0x5b7606(0x259)]((Graphics['width']-Graphics[_0x5b7606(0x198)])/0x2),_0x481740+=Math[_0x5b7606(0x259)]((Graphics[_0x5b7606(0x289)]-Graphics[_0x5b7606(0x1e3)])/0x2)+this['lineHeight']()/0x2,this[_0x5b7606(0x282)](_0x587f6d,_0x481740);},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x294)]=function(){const _0xe0b690=_0x1eb4ae,_0xae353=this[_0xe0b690(0x1b9)];this[_0xe0b690(0x282)](_0xae353[_0xe0b690(0x265)](),_0xae353[_0xe0b690(0x208)]());},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x1bc)]=function(){const _0xea9fdd=_0x1eb4ae;let _0x555cca=$gameMap[_0xea9fdd(0x260)](this[_0xea9fdd(0x19c)]);this[_0xea9fdd(0x282)](_0x555cca['screenX'](),_0x555cca[_0xea9fdd(0x208)]());},Window_Gab['prototype'][_0x1eb4ae(0x282)]=function(_0x4aaf15,_0xe4cc2f){const _0x2adcae=_0x1eb4ae;let _0xd51107=_0x4aaf15-this[_0x2adcae(0x286)]/0x2,_0x1875a2=_0xe4cc2f-this[_0x2adcae(0x289)]-0x20;this['x']=_0xd51107,this['y']=_0x1875a2;},Window_Gab[_0x1eb4ae(0x261)]['repositionNormal']=function(){const _0x5151e3=_0x1eb4ae;let _0x128fb4=this[_0x5151e3(0x1ef)]*-0x1,_0x52a35e=0x0;this['_battle']?_0x52a35e=VisuMZ['GabWindow'][_0x5151e3(0x213)][_0x5151e3(0x1ea)][_0x5151e3(0x28f)]:_0x52a35e=VisuMZ[_0x5151e3(0x1fd)]['Settings'][_0x5151e3(0x192)][_0x5151e3(0x23e)],_0x52a35e-=this['padding'],_0x52a35e=this[_0x5151e3(0x210)]||_0x52a35e,this['x']=_0x128fb4,this['y']=_0x52a35e,this[_0x5151e3(0x1b9)]=null;},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x1e6)]=function(){const _0x36a3e3=_0x1eb4ae,_0x28c970=VisuMZ[_0x36a3e3(0x1fd)][_0x36a3e3(0x213)];this[_0x36a3e3(0x1b0)]=0xff,this[_0x36a3e3(0x190)]=this[_0x36a3e3(0x241)]||_0x28c970['General']['BaseWaitTime']||0x0;const _0x37d30b=this[_0x36a3e3(0x21b)][_0x36a3e3(0x218)](/\\(.*?)\[(.*?)\]/gi,'');this[_0x36a3e3(0x190)]+=_0x37d30b[_0x36a3e3(0x226)]*(this['_tpcOverride']||_0x28c970[_0x36a3e3(0x277)]['TimePerCharacter']||0x0);},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x1cf)]=function(){const _0x38624a=_0x1eb4ae;this[_0x38624a(0x19b)](0x0,0x0,this[_0x38624a(0x225)],this[_0x38624a(0x27c)]);},Window_Gab[_0x1eb4ae(0x261)]['dimColor1']=function(){const _0x56251d=_0x1eb4ae;return $gameParty[_0x56251d(0x1f9)]()?this[_0x56251d(0x1f6)]||VisuMZ[_0x56251d(0x1fd)][_0x56251d(0x213)]['Battle'][_0x56251d(0x206)]:this['_dimColor1Override']||VisuMZ[_0x56251d(0x1fd)][_0x56251d(0x213)][_0x56251d(0x192)][_0x56251d(0x1e8)];},Window_Gab['prototype'][_0x1eb4ae(0x20d)]=function(){const _0x509120=_0x1eb4ae;return $gameParty[_0x509120(0x1f9)]()?this[_0x509120(0x20f)]||VisuMZ[_0x509120(0x1fd)][_0x509120(0x213)][_0x509120(0x1ea)][_0x509120(0x229)]:this['_dimColor2Override']||VisuMZ['GabWindow'][_0x509120(0x213)][_0x509120(0x192)][_0x509120(0x234)];},Window_Gab['prototype'][_0x1eb4ae(0x19b)]=function(_0x2a5667,_0x3b7a2e,_0xb3466d,_0x300267){const _0xf55fee=_0x1eb4ae,_0x1e726e=this[_0xf55fee(0x1cd)](),_0x56d3b2=this[_0xf55fee(0x1b9)]?this[_0xf55fee(0x1cd)]():this[_0xf55fee(0x20d)](),_0x48498d=Math[_0xf55fee(0x259)](_0xb3466d*0.25),_0x1fe406=Math['ceil'](_0xb3466d*0.75);this[_0xf55fee(0x203)][_0xf55fee(0x1e2)](_0x2a5667,_0x3b7a2e,_0x48498d,_0x300267,_0x1e726e,_0x1e726e),this[_0xf55fee(0x203)][_0xf55fee(0x1e2)](_0x48498d,_0x3b7a2e,_0x1fe406,_0x300267,_0x1e726e,_0x56d3b2);},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x278)]=function(){const _0x1929f8=_0x1eb4ae;if(this[_0x1929f8(0x205)]==='')return;switch(this[_0x1929f8(0x297)][_0x1929f8(0x1f0)]()[_0x1929f8(0x18f)]()){case _0x1929f8(0x243):this[_0x1929f8(0x28a)]();break;case'character':this[_0x1929f8(0x276)]();break;case _0x1929f8(0x196):this[_0x1929f8(0x256)]();break;case _0x1929f8(0x1ba):this[_0x1929f8(0x1ca)]();break;}},Window_Gab[_0x1eb4ae(0x261)]['drawGabFace']=function(){const _0x668afd=_0x1eb4ae,_0x13c521=VisuMZ[_0x668afd(0x1fd)]['Settings'][_0x668afd(0x277)],_0xabd89c=0x0;let _0x29aefe=0x0;const _0x2cf50d=ImageManager[_0x668afd(0x242)];let _0x4cb0c3=this[_0x668afd(0x27c)];if(!_0x13c521[_0x668afd(0x1d5)]){_0x4cb0c3=Math[_0x668afd(0x231)](this[_0x668afd(0x27c)],ImageManager[_0x668afd(0x20e)]);if(this[_0x668afd(0x27c)]>_0x4cb0c3)_0x29aefe=this[_0x668afd(0x1a2)]()/0x2;}this[_0x668afd(0x1b4)](this[_0x668afd(0x205)],this[_0x668afd(0x293)],_0xabd89c,_0x29aefe,_0x2cf50d,_0x4cb0c3);},Window_Gab['prototype'][_0x1eb4ae(0x276)]=function(){const _0x3eb7d3=_0x1eb4ae,_0xf15a72=VisuMZ[_0x3eb7d3(0x1fd)][_0x3eb7d3(0x213)][_0x3eb7d3(0x277)],_0x11d759=_0xf15a72[_0x3eb7d3(0x1b5)];let _0xea6be9=_0xf15a72[_0x3eb7d3(0x200)];_0xf15a72[_0x3eb7d3(0x1d5)]&&(_0xea6be9+=(this[_0x3eb7d3(0x220)]-0x1)*this[_0x3eb7d3(0x1a2)]()/0x2),this[_0x3eb7d3(0x299)](this[_0x3eb7d3(0x205)],this['_graphicIndex'],_0x11d759,_0xea6be9);},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x256)]=function(){const _0x3c6f7c=_0x1eb4ae,_0x3e0519=VisuMZ[_0x3c6f7c(0x1fd)][_0x3c6f7c(0x213)][_0x3c6f7c(0x277)],_0x3130bb=_0x3e0519['SvActorXPos'];let _0x38d17b=_0x3e0519['SvActorYPos'];_0x3e0519[_0x3c6f7c(0x1d5)]&&(_0x38d17b+=(this[_0x3c6f7c(0x220)]-0x1)*this[_0x3c6f7c(0x1a2)]()/0x2),this[_0x3c6f7c(0x1bb)](this[_0x3c6f7c(0x205)],_0x3130bb,_0x38d17b);},Window_Gab['prototype']['drawGabPicture']=function(){const _0x23042f=_0x1eb4ae;if(!this[_0x23042f(0x1c1)])return;let _0x4e898b=this[_0x23042f(0x1b2)]();const _0x7bbc8f=Math[_0x23042f(0x259)](this[_0x23042f(0x1c1)][_0x23042f(0x286)]*_0x4e898b),_0xf093f5=Math[_0x23042f(0x259)](this[_0x23042f(0x1c1)][_0x23042f(0x289)]*_0x4e898b);let _0x4a8af3=0x0,_0x9021b2=0x0;const _0x2c964f=this[_0x23042f(0x1c1)];this[_0x23042f(0x203)][_0x23042f(0x24d)](_0x2c964f,0x0,0x0,_0x2c964f[_0x23042f(0x286)],_0x2c964f[_0x23042f(0x289)],_0x4a8af3,_0x9021b2,_0x7bbc8f,_0xf093f5);},Window_Gab[_0x1eb4ae(0x261)]['getPictureScale']=function(){const _0x69f756=_0x1eb4ae;if(!this['_graphicBitmap'])return 0x1;return this['_stretchPicture']?Math[_0x69f756(0x231)](this[_0x69f756(0x225)]/this['_graphicBitmap'][_0x69f756(0x286)],this[_0x69f756(0x27c)]/this[_0x69f756(0x1c1)][_0x69f756(0x289)]):0x1;},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x1d9)]=function(){const _0x4b1f70=_0x1eb4ae,_0x3af45f=VisuMZ['GabWindow']['Settings'];let _0x2dd867=this[_0x4b1f70(0x244)]()*0x2;switch(this[_0x4b1f70(0x297)][_0x4b1f70(0x1f0)]()[_0x4b1f70(0x18f)]()){case _0x4b1f70(0x243):_0x2dd867+=ImageManager[_0x4b1f70(0x242)];break;case _0x4b1f70(0x22a):_0x2dd867+=_0x3af45f['General'][_0x4b1f70(0x1b5)]*0x2,_0x2dd867-=this[_0x4b1f70(0x244)]()*0x2;break;case _0x4b1f70(0x196):_0x2dd867+=_0x3af45f[_0x4b1f70(0x277)][_0x4b1f70(0x20c)]*0x2,_0x2dd867-=this[_0x4b1f70(0x244)]()*0x2;break;case _0x4b1f70(0x1ba):let _0x2f446b=this[_0x4b1f70(0x1c1)]?this[_0x4b1f70(0x1c1)][_0x4b1f70(0x286)]:0x0;_0x2f446b*=this['getPictureScale'](),_0x2dd867+=Math[_0x4b1f70(0x259)](_0x2f446b);break;}const _0x2fca48=this[_0x4b1f70(0x1a2)]()/0x2;this[_0x4b1f70(0x296)](this[_0x4b1f70(0x21b)],_0x2dd867,_0x2fca48);},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x215)]=function(){const _0x23e191=_0x1eb4ae;this[_0x23e191(0x27e)](),this[_0x23e191(0x221)]();},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x27e)]=function(){const _0x380d71=_0x1eb4ae;if(this[_0x380d71(0x1ab)]==='')return;const _0x310dc7={'name':this['_soundName'],'volume':0x5a,'pitch':0x64,'pan':0x0};AudioManager[_0x380d71(0x26d)](_0x310dc7);},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x221)]=function(){const _0x527323=_0x1eb4ae;if(this[_0x527323(0x1ff)])this['_jsOnDisplay']['call'](this);const _0x7d7321=VisuMZ[_0x527323(0x1fd)][_0x527323(0x213)][_0x527323(0x277)];if(_0x7d7321['OnDisplayJS'])_0x7d7321[_0x527323(0x266)][_0x527323(0x1e1)](this,this[_0x527323(0x1c6)]);},Window_Gab['prototype'][_0x1eb4ae(0x22f)]=function(){const _0x2a52dd=_0x1eb4ae;this[_0x2a52dd(0x28e)]?($gameTemp[_0x2a52dd(0x1cc)]=this[_0x2a52dd(0x291)][_0x2a52dd(0x1d7)](),$gameTemp[_0x2a52dd(0x1a7)]=this[_0x2a52dd(0x1b0)]>0x0?this[_0x2a52dd(0x1c6)]:{}):($gameTemp['_storedMapGabs']=this[_0x2a52dd(0x291)][_0x2a52dd(0x1d7)](),$gameTemp[_0x2a52dd(0x232)]=this['contentsOpacity']>0x0?this[_0x2a52dd(0x1c6)]:{});},Window_Gab[_0x1eb4ae(0x261)][_0x1eb4ae(0x1cb)]=function(){const _0x496350=_0x1eb4ae;this[_0x496350(0x28e)]?($gameTemp[_0x496350(0x1cc)]&&(this[_0x496350(0x291)]=$gameTemp[_0x496350(0x1cc)],delete $gameTemp[_0x496350(0x1cc)]),$gameTemp[_0x496350(0x1a7)]&&$gameTemp[_0x496350(0x1a7)]['length']>0x0&&(this[_0x496350(0x291)][_0x496350(0x275)]($gameTemp[_0x496350(0x1a7)]),delete $gameTemp[_0x496350(0x1a7)])):($gameTemp['_storedMapGabs']&&(this[_0x496350(0x291)]=$gameTemp[_0x496350(0x1e7)],delete $gameTemp[_0x496350(0x1e7)]),$gameTemp['_currentMapGab']&&$gameTemp[_0x496350(0x232)]['legnth']>0x0&&(this[_0x496350(0x291)][_0x496350(0x275)]($gameTemp[_0x496350(0x232)]),delete $gameTemp[_0x496350(0x232)]));};