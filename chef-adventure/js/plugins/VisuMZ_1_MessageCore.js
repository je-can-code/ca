//=============================================================================
// VisuStella MZ - Message Core
// VisuMZ_1_MessageCore.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_1_MessageCore = true;

var VisuMZ = VisuMZ || {};
VisuMZ.MessageCore = VisuMZ.MessageCore || {};
VisuMZ.MessageCore.version = 1.14;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 1] [Version 1.14] [MessageCore]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Message_Core_VisuStella_MZ
 * @orderAfter VisuMZ_0_CoreEngine
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * The Message Core plugin extends and builds upon the message functionality of
 * RPG Maker MZ and allows you, the game dev, to customize the workflow for
 * your game's message system.
 *
 * Features include all (but not limited to) the following:
 *
 * * Control over general message settings.
 * * Auto-Color key words and/or database entries.
 * * Increases the text codes available to perform newer functions/effects.
 * * Ability for you to implement custom Text Code actions.
 * * Ability for you to implement custom Text code string replacements.
 * * Invoke a macro system to speed up the dev process.
 * * Add a Text Speed option to the Options menu.
 * * Add the ever so useful Word Wrap to your message system.
 * * Extend the choice selection process to your liking.
 * * The ability to enable/disable as well as show/hide certain choices.
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
 * Major Changes
 * ============================================================================
 *
 * This plugin adds some new hard-coded features to RPG Maker MZ's functions.
 * The following is a list of them.
 *
 * ---
 * 
 * Dim Background Extension
 * 
 * Before, when using the Dim Background as a part of a Show Text event, its
 * size is only the same as the message window's width itself. This looked
 * really ugly because it had hard edges cutting off while gradients are seen
 * elsewhere. To make it look better, we extended the dimmed background to span
 * the width of the screen instead.
 * 
 * ---
 * 
 * Extended Messages
 * 
 * If you decide to expand the size of the message window to allow for more
 * rows to be displayed, you can type in the data for them by chaining together
 * Show Message events. They will take data from each other and display them in
 * the same message window as long as there are enough rows.
 * 
 * ---
 *
 * Extended Choice Lists
 * 
 * Choice lists can be extended by just chaining one Choice List event after
 * the other in succession along the same indentation. They do not extend if
 * there is any event other than a Choice List option between them on the same
 * indentation level.
 *
 * ---
 *
 * ============================================================================
 * Available Text Codes
 * ============================================================================
 *
 * The following are text codes that you may use with this plugin. Some of
 * these are original text codes provided by RPG Maker MZ, while others are
 * new text codes added through this plugin. You may even add your own text
 * codes through the plugin parameters.
 *
 * === RPG Maker MZ Text Codes ===
 *
 * The following are text codes that come with RPG Maker MZ. These text codes
 * cannot be edited through the Plugin Parameters.
 *
 * ---
 *
 * ------------------   -------------------------------------------------------
 * Text Code            Effect (Global)
 * ------------------   -------------------------------------------------------
 * \V[x]                Replaced by the value of variable 'x'.
 * \N[x]                Replaced by the name of actor 'x'.
 * \P[x]                Replaced by the name of party member 'x'.
 * \C[x]                Draw the subsequent text with window skin color 'x'.
 * \I[x]                Draw icon 'x'.
 *
 * \PX[x]               Moves text x position to 'x'.
 * \PY[x]               Moves text y position to 'y'.
 *
 * \G                   Replaced by the currency unit.
 *
 * \{                   Increase the text font size by one step.
 * \}                   Decrease the text font size by one step.
 * \FS[x]               Changes the text font size to 'x'.
 *
 * \\                   Replaced by the backslash character.
 *
 * ---
 *
 * ------------------   -------------------------------------------------------
 * Text Code            Effect (Message Window Only)
 * ------------------   -------------------------------------------------------
 * \$                   Opens the gold window.
 * \.                   Waits a 1/4 second.
 * \|                   Waits a full second.
 * \!                   Waits for button input.
 * \>                   Display remaining text on same line all at once.
 * \<                   Cancel the effect that displays text all at once.
 * \^                   Do not wait for input after displaying text to move on.
 *
 * ---
 *
 * === Message Core Hard-Coded Text Codes ===
 *
 * The following text codes are hard-coded into VisuStella MZ Message Core's
 * code. These text codes cannot be edited through the Plugin Parameters.
 * 
 * ---
 *
 * ------------------   -------------------------------------------------------
 * Text Code            Effect (Global)
 * ------------------   -------------------------------------------------------
 * <b>                  Makes subsequent text bold.
 * </b>                 Removes bold from subsequent text.
 * <i>                  Makes subsequent text italic.
 * </i>                 Removes italic from subsequent text.
 * 
 * <left>               Makes subsequent text left-aligned.
 * </left>              Removes left-alignment for subsequent text.
 * <center>             Makes subsequent text center-aligned.
 * </center>            Removes center-alignment for subsequent text.
 * <right>              Makes subsequent text right-aligned.
 * </right>             Removes right-alignment for subsequent text.
 *
 * Note1: Use at line-start.
 *
 * <ColorLock>          Text codes can't change text color for subsequent text.
 * </ColorLock>         Removes Color Lock property.
 *
 * <WordWrap>           Enables Word Wrap for this window. *Note2*
 * </WordWrap>          Disables Word Wrap for this window. *Note2*
 * <br>                 Adds a line break. Requires Word Wrap enabled.
 * <line break>         Adds a line break. Requires Word Wrap enabled.
 *
 * Note2: Some windows cannot use Word Wrap such as the Choice Window.
 *
 * \picture<x>          Draws picture x (filename) at current text position.
 * \CenterPicture<x>    Draws picture x (filename) centered at the window.
 *
 * ---
 *
 * ------------------   -------------------------------------------------------
 * Text Code            Effect (Message Window Only)
 * ------------------   -------------------------------------------------------
 * \CommonEvent[x]      Runs common event x when text code is reached.
 * \Wait[x]             Makes the message wait x frames before continuing.
 * 
 * <Auto>               Resizes message window dimensions to fit text. *Note3*
 * <Auto Width>         Resizes message window width to fit text. *Note3*
 * <Auto Height>        Resizes message window height to fit text. *Note3*
 * 
 * <Auto Actor: x>      Resizes message window and positions it over actor x
 *                      sprite's head. *Note3*
 * <Auto Party: x>      Resizes message window and positions it over party
 *                      member x sprite's head. *Note3*
 * <Auto Player>        Map-Only. Resizes message window and positions it over
 *                      the player sprite's head. *Note3*
 * <Auto Event: x>      Map-Only. Resizes message window and positions it over
 *                      event x sprite's head. *Note3*
 * <Auto Enemy: x>      Battle-Only. Resizes message window and positions it
 *                      over enemy x sprite's head. *Note3*
 *
 * Note3: Upon using these text codes, the message window's settings will be
 * reset for the upcoming message. These effects do not work with Word Wrap.
 *
 * ---
 *
 * -----------------------------  ---------------------------------------------
 * Text Code                      Effect (Choice Window Only)
 * -----------------------------  ---------------------------------------------
 * <Show>                         Choice is always shown.
 * <Show Switch: x>               Choice shown if switch x is ON.
 * <Show Switches: x,x,x>         Choice shown if the x switches are all ON.
 * <Show All Switches: x,x,x>     Choice shown if the x switches are all ON.
 * <Show Any Switches: x,x,x>     Choice shown if any of x switches are ON.
 *
 * <Hide>                         Choice is always hidden.
 * <Hide Switch: x>               Choice hidden if switch x is ON.
 * <Hide Switches: x,x,x>         Choice hidden if the x switches are all ON.
 * <Hide All Switches: x,x,x>     Choice hidden if the x switches are all ON.
 * <Hide Any Switches: x,x,x>     Choice hidden if any of x switches are ON.
 *
 * <Enable>                       Choice is always enabled.
 * <Enable Switch: x>             Choice enabled if switch x is ON.
 * <Enable Switches: x,x,x>       Choice enabled if the x switches are all ON.
 * <Enable All Switches: x,x,x>   Choice enabled if the x switches are all ON.
 * <Enable Any Switches: x,x,x>   Choice enabled if any of x switches are ON.
 *
 * <Disable>                      Choice is always disabled.
 * <Disable Switch: x>            Choice disabled if switch x is ON.
 * <Disable Switches: x,x,x>      Choice disabled if the x switches are all ON.
 * <Disable All Switches: x,x,x>  Choice disabled if the x switches are all ON.
 * <Disable Any Switches: x,x,x>  Choice disabled if any of x switches are ON.
 *
 * ---
 *
 * -----------------  ---------------------------------------------------------
 * Text Code          Effect (Name Window Only)
 * -----------------  ---------------------------------------------------------
 * <Left>             Positions the name box window to the left.
 * <Center>           Positions the name box window to the center.
 * <Right>            Positions the name box window to the right.
 * <Position: x>      Replace 'x' with a number from 0 to 10. This positions
 *                    the name box window on the screen relative to the
 *                    position of the value 'x' represents.
 * \NormalBG          Changes background type of window to normal type.
 * \DimBG             Changes background type of window to dim type.
 * \TransparentBG     Changes background type of window to transparent type.
 *
 * ---
 *
 * === Message Core Customizable Text Codes ===
 *
 * The following text codes can be altered through the Message Core's various
 * Plugin Parameters to adjust replacements and actions.
 *
 * ---
 *
 * ------------------   -------------------------------------------------------
 * Text Code            Effect (Global)
 * ------------------   -------------------------------------------------------
 * \Class[x]            Draws class x's icon (if have) and name.
 * \ClassName[x]        Draws class x's name only.
 *
 * \Skill[x]            Draws skill x's icon (if have) and name.
 * \SkillName[x]        Draws skill x's name only.
 *
 * \Item[x]             Draws item x's icon (if have) and name.
 * \ItemName[x]         Draws item x's name only.
 * \ItemQuantity[x]     Inserts the number of item x's owned by the party.
 *
 * \Weapon[x]           Draws weapon x's icon (if have) and name.
 * \WeaponName[x]       Draws weapon x's name only.
 * \WeaponQuantity[x]   Inserts the number of weapon x's owned by the party.
 *
 * \Armor[x]            Draws armor x's icon (if have) and name.
 * \ArmorName[x]        Draws armor x's name only.
 * \ArmorQuantity[x]    Inserts the number of armor x's owned by the party.
 *
 * \LastGainObj         Draws the icon + name of the last party-gained object.
 * \LastGainObjName     Draws the name of the last party-gained object.
 * \LastGainObjQuantity Inserts the quantity of the last party-gained object.
 *
 * \State[x]            Draws state x's icon (if have) and name.
 * \StateName[x]        Draws state x's name only.
 *
 * \Enemy[x]            Draws enemy x's icon (if have) and name.
 * \EnemyName[x]        Draws enemy x's name only.
 *
 * \Troop[x]            Draws troop x's icon (if have) and name.
 * \TroopName[x]        Draws troop x's name only.
 *
 * \TroopMember[x]      Draws troop member x's icon (if have) and name. *Note1*
 * \TroopNameMember[x]  Draws troop member x's name only. *Note1*
 * 
 * Note1: Only works in battle.
 *
 * \NormalBG            Changes background type of window to normal type.
 * \DimBG               Changes background type of window to dim type.
 * \TransparentBG       Changes background type of window to transparent type.
 *
 * \FontChange<x>       Changes font face to x font name.
 * \ResetFont           Resets font settings.
 *
 * \ResetColor          Resets color settings.
 * \HexColor<x>         Changes text color to x hex color (ie. #123abc).
 * \OutlineColor[x]     Changes outline color to text color x.
 * \OutlineHexColor<x>  Changes outline color to x hex color (ie. #123abc).
 * \OutlineWidth[x]     Changes outline width to x thickness.
 * 
 * \WindowMoveTo<x>     Moves window to exact coordinates. *Note2*
 * \WindowMoveBy<x>     Moves window by relative values. *Note2*
 * \WindowReset         Resets window position to original position.
 *
 * Note2: Replace 'x' with the following format:
 *   targetX, targetY, targetWidth, targetHeight, duration, easingType
 *   Only targetX and targetY are required arguments.
 *
 * ---
 *
 * ------------------   -------------------------------------------------------
 * Text Code            Effect (Message Window Only)
 * ------------------   -------------------------------------------------------
 * \ActorFace[x]        Inserts actor x's face into the Message Window.
 * \PartyFace[x]        Inserts party member x's face into the Message Window.
 * \ChangeFace<x,y>     Changes message face to x filename, y index.
 * \FaceIndex[x]        Changes message face index to x.
 *
 * \TextDelay[x]        Sets delay in frames between characters to x frames.
 * 
 * ---
 * 
 * As these text codes can be added, removed, and/or altered, their functions
 * may or may not be the same depending on how you've altered them. VisuStella
 * is not responsible for any errors caused by changes made to pre-made text
 * codes nor any new text codes they did not make.
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
 * === Message Plugin Commands ===
 * 
 * ---
 *
 * Message: Properties
 *   Change the various properties of the Message Window.
 *
 *   Rows:
 *   - Change the number of Message Window rows.
 *   - Leave at 0 to keep it unchanged.
 *
 *   Width: 
 *   - Change the Message Window width in pixels.
 *   - Leave at 0 to keep it unchanged.
 *
 *   Center:
 *   - Center the window X after changing its width?
 *
 *   Word Wrap:
 *   - Enable or disable Word Wrap for the Message Window?
 *
 * ---
 * 
 * === Choice Plugin Commands ===
 * 
 * ---
 *
 * Choice: Properties
 *   Change the properties found in the Show Choices event command.
 *
 *   Line Height:
 *   - Change the line height for the show choices.
 *   - Leave at 0 to keep this unchanged.
 *
 *   Max Rows:
 *   - Maximum number of choice rows to be displayed.
 *   - Leave at 0 to keep this unchanged.
 *
 *   Max Columns:
 *   - Maximum number of choice columns to be displayed.
 *   - Leave at 0 to keep this unchanged.
 *
 *   Text Alignment:
 *   - Text alignment for Show Choice window.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: General Settings
 * ============================================================================
 *
 * General settings involving the message system. These settings range from
 * adjust how the Message Window looks to more intricate settings like how
 * some of the default text codes work.
 *
 * ---
 *
 * Message Window
 *
 *   Default Rows:
 *   - Default number of rows to display for the Message Window.
 *
 *   Default Width:
 *   - Default Message Window width in pixels.
 *
 *   Fast Forward Key:
 *   - This is the key used for fast forwarding messages.
 *   - WARNING: If this key is the same as the dash button, this will clear out
 *     any held down inputs upon triggering an event  to prevent players from
 *     skipping potentially useful information stored in messages. If you do
 *     not want the input to be cleared, use a different key.
 *
 *   Text Delay:
 *   - How many frames to wait between characters drawn?
 *   - Use 0 for instant.
 * 
 *   Default Outline Width:
 *   - Changes the default outline width to this many pixels thick.
 *
 * ---
 *
 * Name Box Window
 *
 *   Default Color:
 *   - Default color for the Name Box Window's text.
 *
 *   Offset X:
 *   - How much to offset the name box window X by
 *     (as long as it doesn't go offscreen).
 *
 *   Offset Y:
 *   - How much to offset the name box window Y by
 *     (as long as it doesn't go offscreen).
 *
 * ---
 *
 * Choice List Window
 *
 *   Line Height:
 *   - What is the default line height for Show Choices?
 *
 *   Max Rows:
 *   - Maximum number of rows to visibly display?
 *
 *   Max Columns:
 *   - Maximum number of columns to visibly display?
 *
 *   Text Alignment:
 *   - Default alignment for Show Choice window.
 *
 * ---
 *
 * Default Text Codes
 *
 *   Relative \PX \PY:
 *   - Make \PX[x] and \PY[x] adjust relative starting position than
 *     exact coordinates.
 *
 *   \{ Maximum:
 *   - Determine the maximum size that \{ can reach.
 *
 *   \} Minimum:
 *   - Determine the minimum size that \} can reach.
 *
 *   \{ Change \}
 *   - How much does \{ and \} change font size by?
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Auto-Color Settings
 * ============================================================================
 *
 * For certain windows such as the Message Window, Help Window, and Choice
 * Window, Auto-Color is enabled to automatically highlight and color certain
 * database entries, keywords, and just about anything you, the game dev, wants
 * to be automatically colored. This is done to avoid typing out \C[6]Jack\C[0]
 * every time Jack's name is written out as it will be automatically colored in
 * those specific windows.
 *
 * The Plugin Parameters will give you full reign over which database entries
 * and keywords you want to be automatically colored as long as they follow a
 * few rules:
 * 
 * -----------------
 * Auto-Color Rules:
 * -----------------
 *
 * 1. Database names and keywords are case sensitive.
 *    This means if "Potion" is a marked keyword, typing out "potion" will not
 *    prompt the auto-color to highlight "potion". You must add the lowercase
 *    version of the word into the keyword list if you want it to count.
 *
 * 2. Database names and keywords are exact size (for Roman languages)
 *    This means if "Potion" is a marked keyword, typing out "potions" will not
 *    prompt the auto-color to highlight "potions". You must type out all of
 *    the variations of the words you want affected into the keyword list to
 *    prompt the auto-color highlight.
 * 
 *    This does not apply to Japanese, Korean, or Chinese languages.
 *
 * 3. Possessive cases and other language symbols aren't counted.
 *    Symbols such as periods, commas, quotes, parentheses, and similar symbols
 *    do no count towards Rule 2. This means if "Potion" is a marked keyword,
 *    the typing out "(Potion)" will still highlight the "Potion" part of the
 *    word according to the auto-color.
 * 
 * 4. Names with special characters like !, ?, [, ], etc. will be ignored.
 *    These cause conflicts with how auto-colors are detected.
 *
 * ---
 *
 * Database Highlighting
 *
 *   Actors:
 *   Classes:
 *   Skills:
 *   Items:
 *   Weapons:
 *   Armors:
 *   Enemies:
 *   States:
 *   - Any usage of a the selected database entry's name is auto-colored with
 *     the text code number.
 *   - Use 0 to not auto-color.
 *
 * ---
 *
 * Word Highlighting
 *
 *   \C[x]: Color
 *   - These are lists of all the words that will be automatically colored with
 *     the x text color.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Text Code Actions
 * ============================================================================
 *
 * Text codes are used for one of two things: performing actions or replacing
 * themselves with text data. This Plugin Parameter will focus on the aspect of
 * performing actions. These actions can be done through each JavaScript or by
 * a common event (if it is used in the Message Window). Adequate knowledge of
 * both is recommended before attempting to modify and/or add new Text Code
 * Actions to the Plugin Parameters.
 *
 * Each of the Text Code Actions are formatted in such a way:
 *
 * ---
 *
 * Text Code Action
 *
 *   Match:
 *   - This is what needs to be matched in order for this text code to work.
 *   - This is the primary text marker after the \ in a text code.
 *   - In \N[x], this would be the 'N'.
 *
 *   Type:
 *   - The type of parameter to obtain (none, number, or string).
 *   - This is the way the text code determines the condition type.
 *   - In \N[x], this would be the '[x]'.
 *
 *   Common Event:
 *   - Select a common event to run when this text code is used in a message.
 *
 *   JS: Action:
 *   - JavaScript code used to perform an action when this text code appears.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Text Code Replacements
 * ============================================================================
 *
 * Text codes are used for one of two things: performing actions or replacing
 * themselves with text data. This Plugin Parameter will focus on the aspect of
 * replacing the text codes with text data. Text data can be replaced with
 * an exact exchange of text or dynamically through JavaScript. Adding a new
 * Text Code Replacement is done through the Plugin Parameters.
 *
 * Each of the Text Code Replacements are formatted in such a way:
 *
 * ---
 *
 * Text Code Replacement
 *
 *   Match:
 *   - This is what needs to be matched in order for this text code to work.
 *   - This is the primary text marker after the \ in a text code.
 *   - In \N[x], this would be the 'N'.
 *
 *   Type:
 *   - The type of parameter to obtain (none, number, or string).
 *   - This is the way the text code determines the condition type.
 *   - In \N[x], this would be the '[x]'.
 *
 *   STR: Text:
 *   - The text that will appear if this match appears.
 *     If this has a value, ignore the JS: Text version.
 *
 *   JS: Text:
 *   - JavaScript code used to determine the text that will appear if this
 *     match appears.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Text Macros
 * ============================================================================
 *
 * Text macros are used in similar fashion to text codes replacements to
 * replace themselves with text data. The primary difference is that macros are
 * made in a different format with no conditional argument modifiers (ie the
 * [x] that follows a text code).
 *
 * To use a text macro, type in the matching keyword between two [brackets] and
 * it will be replaced by the string data or run the JavaScript code found in
 * the Plugin Parameter settings.
 *
 * For example, if you have the text macro "Leader", made to return the party
 * leader's name, you can type in [Leader] in the Message Window and it will be
 * replaced with the party leader's name. The output can also output text codes
 * into the resulting text.
 *
 * Each of the Text Macros are formatted in such a way:
 *
 * ---
 *
 * Text Macro
 *
 *   Match:
 *   - This is what needs to be matched in order for this macro to work.
 *   - In [Leader], this would be the 'Leader' text.
 *
 *   STR: Text:
 *   - The replacement text that will appear from the macro.
 *   - If this has a value, ignore the JS: Text version.
 *
 *   JS: Text:
 *   - JavaScript code used to determine the text that will appear if this
 *     macro appears.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Text Speed Option Settings
 * ============================================================================
 *
 * Modern RPG's on the market have the option to adjust the message speed rate
 * for players. These Plugin Parameters allow you to add that option to the
 * Options Menu as well.
 *
 * ---
 *
 * Text Speed Option Settings
 *
 *   Add Option?:
 *   - Add the 'Text Speed' option to the Options menu?
 *
 *   Adjust Window Height:
 *   - Automatically adjust the options window height?
 *
 *   Option Name:
 *   - Command name of the option.
 *
 *   Default Value:
 *   - 1 - 10, slowest to fastest.
 *   - 11 is instant value.
 *
 *   Instant Speed:
 *   - Text to show "instant" text.
 *
 * ---
 * 
 * ============================================================================
 * Plugin Parameters: Word Wrap Settings
 * ============================================================================
 *
 * Word wrap is a property that will cause any overflowing text to wrap around
 * and move into the next line. This property can only be enabled inside text
 * that accept text codes, such as the Message Window and Help Window. However,
 * word wrap is disabled for the Choice Window due to the nature of the Choice
 * Window's base properties.
 *
 * Word wrap can be enabled or disabled in three ways. One is by using the text
 * code <WordWrap> to enable it or </WordWrap> to disable it. The second method
 * is by enabling it with the Plugin Command: 'Message: Properties'. The third
 * method is by enabling it by default with the Plugin Parameters.
 *
 * ---
 *
 * Enable Word Wrap
 *
 *   Message Window:
 *   - Automatically enable Word Wrap for this window?
 *
 *   Help Window:
 *   - Automatically enable Word Wrap for this window?
 *
 * ---
 *
 * Rules
 *
 *   Link Break -> Space:
 *   - Convert manually placed (non tagged) line breaks with spaces?
 *   - Line breaks must be inserted using the <br> text code.
 *
 *   Tight Wrap:
 *   - If a face graphic is present in a message, word wrap will be tighter.
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
 * Version 1.14: February 12, 2021
 * * Bug Fixes!
 * ** Auto positioned messages in battle will no longer cover the battler in
 *    question. Fix made by Irina.
 * 
 * Version 1.13: February 5, 2021
 * * Bug Fixes!
 * ** Choice List Window with a dimmed background should now have a more
 *    consistent sized dim sprite. Fix made by Irina.
 * 
 * Version 1.12: January 22, 2021
 * * Feature Update!
 * ** Name Box Window Default Color is now disabled by default to 0 because
 *    users do not understand why their names are showing up yellow and did not
 *    bother reading the documentation. If users want this feature turned on,
 *    they will have to do it manually from now on. Update made by Irina.
 * 
 * Version 1.11: January 15, 2021
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.10: January 8, 2021
 * * Bug Fixes!
 * ** <Auto Actor: x> and <Auto Party: x> text codes should now work properly.
 *    Fix made by Irina.
 * * Feature Update!
 * ** Auto Color Plugin Parameters now have their default settings set to 0.
 *    This is due to an influx of "bug reports" from users who do not
 *    understand how this feature works, and the VisuStella team has decided it
 *    is better for the feature to default to an inactive state until users
 *    decide to search and utilize it themselves. Update made by Irina.
 * 
 * Version 1.09: January 1, 2021
 * * Feature Update!
 * ** Auto-color no longer applies to database names that are only numbers.
 *    Auto-color entries that are only numbers will also be ignored. This is to
 *    prevent breaking the text code parsing. Update made by Yanfly.
 * 
 * Version 1.08: November 15, 2020
 * * Documentation Update!
 * ** Some text codes left for the Name Box Window have been accidentally left
 *    out. These text codes allow for the positioning of the Name Box Window.
 *    Also, added to this section are the \NormalBG, \DimBG, and \TransparentBG
 *    text codes since people have been asking for how to change the name box
 *    window's background, but have skimmed over those text codes in different
 *    sections of the help file.
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.07: November 8, 2020
 * * Bug Fixes!
 * ** When using auto size functions, the message pause symbol will no longer
 *    appear semi-transparent the whole time. Fix made by Irina.
 * 
 * Version 1.06: October 25, 2020
 * * Documentation Update!
 * ** Added a warning message to the Fast Forward Key plugin parameter:
 * *** WARNING: If this key is the same as the dash button, this will clear out
 *     any held down inputs upon triggering an event  to prevent players from
 *     skipping potentially useful information stored in messages. If you do
 *     not want the input to be cleared, use a different key.
 * ** Updated help file for new features.
 * * Feature Update!
 * ** The default Fast Forward Key setting has now been changed from "Shift" to
 *    "Page Down". Change made by Yanfly
 * * New Feature!
 * ** New Plugin Parameter added by Irina.
 * *** Plugin Parameters > General > Default Outline Width
 * **** Changes the default outline width to this many pixels thick.
 * 
 * Version 1.06: September 27, 2020
 * * Bug Fixes!
 * ** Setting an actor's autocolor will now disable it from \N[x] and \P[x]
 *    text codes. Fix made by Irina.
 * 
 * Version 1.05: September 20, 2020
 * * Bug Fixes!
 * ** Auto Position text codes not place positions properly if the screen width
 *    and height differ from the box width and box height. Fix made by Irina.
 * 
 * Version 1.04: September 13, 2020
 * * Bug Fixes!
 * ** Word wrap no longer affects specific battle messages. Fix made by Irina.
 * ** Word wrap now updates properly after using the 'Message: Properties'
 *    Plugin Command. Fix made by Arisu.
 * 
 * Version 1.03: September 6, 2020
 * * Bug Fixes!
 * ** Autoplacement of the name box window now takes its offset Y setting into
 *    account before sending it to the bottom of the message window. Fix made
 *    by Yanfly.
 * ** Added automatic feature setting to turn off word wrap when using the
 *    auto-size and auto-position text codes. This is because the auto-size and
 *    auto-position effects don't work properly with Word Wrap based on how
 *    they both clash when adjusting the window settings. Fix made by Irina.
 * ** New message pages after auto-sizing no longer put out empty messages.
 *    Fix made by Irina and Shiro.
 * * Documentation Update!
 * ** Extended the note for auto-size and auto-position text codes to include
 *    that they do not work with Word Wrap. Added by Irina.
 * 
 * Version 1.02: August 30, 2020
 * * New Features!
 * ** Added new hard-coded text codes for auto-sizing and auto-positioning:
 * *** <Auto>, <Auto Width>, <Auto Height>
 * *** <Auto Actor: x>, <Auto Party: x>, <Auto Enemy: x>
 * *** <Auto Player>, <Auto Actor: x>, <Auto Party: x>, <Auto Event: x>
 * **** New features added by Irina.
 * 
 * Version 1.01: August 23, 2020
 * * Bug Fixes!
 * ** </Wordwrap> now works.
 * ** \ActorFace[x] text code now fixed.
 * *** Users updating from version 1.00 will need to fix this problem by either
 *     removing the plugin from the Plugin Manager list and reinstalling it, or
 *     going to Plugin Parameters > Text Code Replacements > ActorFace >
 *     JS: Text > and changing "$gameActors.actor(1)" to
 *     "$gameActors.actor(actorId)"
 * ** Actors with empty names would cause auto hightlight problems. Fixed!
 * ** Auto-colors now ignore names with special characters like !, ?, [, ], and
 *    so on.
 * ** Line break spacing fixed.
 * * New Features!
 * ** Wordwrap now works with <left>, <center> and <right> alignment tags.
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
 * @command MessageWindowProperties
 * @text Message: Properties
 * @desc Change the various properties of the Message Window.
 *
 * @arg Rows:num
 * @text Rows
 * @type number
 * @min 0
 * @desc Change the number of Message Window rows.
 * Leave at 0 to keep it unchanged.
 * @default 4
 *
 * @arg Width:num
 * @text Width
 * @type number
 * @min 0
 * @desc Change the Message Window width in pixels.
 * Leave at 0 to keep it unchanged.
 * @default 816
 *
 * @arg Center:eval
 * @text Center Window X?
 * @parent Width
 * @type boolean
 * @on Center
 * @off Don't
 * @desc Center the window X after changing its width?
 * @default true
 *
 * @arg WordWrap:str
 * @text Word Wrap
 * @type select
 * @option No Change
 * @value No Change
 * @option Enable
 * @value true
 * @option Disable
 * @value false
 * @desc Enable or disable Word Wrap for the Message Window?
 * @default No Change
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ChoiceWindowProperties
 * @text Choices: Properties
 * @desc Change the properties found in the Show Choices event command.
 *
 * @arg LineHeight:num
 * @text Line Height
 * @type number
 * @min 0
 * @desc Change the line height for the show choices.
 * Leave at 0 to keep this unchanged.
 * @default 36
 *
 * @arg MaxRows:num
 * @text Max Rows
 * @type number
 * @min 0
 * @desc Maximum number of choice rows to be displayed.
 * Leave at 0 to keep this unchanged.
 * @default 8
 *
 * @arg MaxCols:num
 * @text Max Columns
 * @type number
 * @min 0
 * @desc Maximum number of choice columns to be displayed.
 * Leave at 0 to keep this unchanged.
 * @default 1
 *
 * @arg TextAlign:str
 * @text Text Alignment
 * @type select
 * @option Default
 * @value default
 * @option Left
 * @value left
 * @option Center
 * @value center
 * @option Right
 * @value right
 * @desc Text alignment for Show Choice window.
 * @default default
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
 * @param MessageCore
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
 * @desc General settings involving the message system.
 * @default {"MessageWindow":"","MessageRows:num":"4","MessageWidth:num":"816","FastForwardKey:str":"pagedown","MessageTextDelay:num":"1","StretchDimmedBg:eval":"true","DefaultOutlineWidth:num":"3","NameBoxWindow":"","NameBoxWindowDefaultColor:num":"0","NameBoxWindowOffsetX:num":"0","NameBoxWindowOffsetY:num":"0","ChoiceListWindow":"","ChoiceWindowLineHeight:num":"36","ChoiceWindowMaxRows:num":"8","ChoiceWindowMaxCols:num":"1","ChoiceWindowTextAlign:str":"default","DefaultTextCodes":"","RelativePXPY:eval":"true","FontBiggerCap:eval":"108","FontSmallerCap:eval":"12","FontChangeValue:eval":"12"}
 *
 * @param AutoColor:struct
 * @text Auto-Color Settings
 * @type struct<AutoColor>
 * @desc Automatically color certain keywords a specific way.
 * @default {"DatabaseHighlighting":"","Actors:str":"0","Classes:str":"0","Skills:str":"0","Items:str":"0","Weapons:str":"0","Armors:str":"0","Enemies:str":"0","States:str":"0","WordHighlighting":"","TextColor1:arraystr":"[]","TextColor2:arraystr":"[]","TextColor3:arraystr":"[]","TextColor4:arraystr":"[]","TextColor5:arraystr":"[]","TextColor6:arraystr":"[]","TextColor7:arraystr":"[]","TextColor8:arraystr":"[]","TextColor9:arraystr":"[]","TextColor10:arraystr":"[]","TextColor11:arraystr":"[]","TextColor12:arraystr":"[]","TextColor13:arraystr":"[]","TextColor14:arraystr":"[]","TextColor15:arraystr":"[]","TextColor16:arraystr":"[]","TextColor17:arraystr":"[]","TextColor18:arraystr":"[]","TextColor19:arraystr":"[]","TextColor20:arraystr":"[]","TextColor21:arraystr":"[]","TextColor22:arraystr":"[]","TextColor23:arraystr":"[]","TextColor24:arraystr":"[]","TextColor25:arraystr":"[]","TextColor26:arraystr":"[]","TextColor27:arraystr":"[]","TextColor28:arraystr":"[]","TextColor29:arraystr":"[]","TextColor30:arraystr":"[]","TextColor31:arraystr":"[]"}
 *
 * @param TextCodeActions:arraystruct
 * @text Text Code Actions
 * @type struct<TextCodeAction>[]
 * @desc Text codes that perform actions.
 * @default ["{\"Match:str\":\"ChangeFace\",\"Type:str\":\"\\\\<(.*?)\\\\>\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nconst data = this.obtainEscapeString(textState).split(',');\\\\nif (textState.drawing) {\\\\n    const filename = data[0].trim();\\\\n    const index = parseInt(data[1] || '0');\\\\n    $gameMessage.setFaceImage(filename, index);\\\\n    this.loadMessageFace();\\\\n    const rtl = $gameMessage.isRTL();\\\\n    const width = ImageManager.faceWidth;\\\\n    const height = this.innerHeight;\\\\n    const x = rtl ? this.innerWidth - width - 4 : 4;\\\\n    this.contents.clearRect(x, 0, width, height);\\\\n    this._faceBitmap.addLoadListener(this.drawMessageFace.bind(this));\\\\n}\\\"\"}","{\"Match:str\":\"FaceIndex\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nconst index = this.obtainEscapeParam(textState);\\\\nif (textState.drawing) {\\\\n    const filename = $gameMessage.faceName();\\\\n    $gameMessage.setFaceImage(filename, index);\\\\n    this.loadMessageFace();\\\\n    const rtl = $gameMessage.isRTL();\\\\n    const width = ImageManager.faceWidth;\\\\n    const height = this.innerHeight;\\\\n    const x = rtl ? this.innerWidth - width - 4 : 4;\\\\n    this.contents.clearRect(x, 0, width, height);\\\\n    this._faceBitmap.addLoadListener(this.drawMessageFace.bind(this));\\\\n}\\\"\"}","{\"Match:str\":\"TextDelay\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nconst delay = this.obtainEscapeParam(textState);\\\\nif (textState.drawing && this.constructor === Window_Message) {\\\\n    this.setTextDelay(delay);\\\\n}\\\"\"}","{\"Match:str\":\"NormalBG\",\"Type:str\":\"\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nif (textState.drawing) {\\\\n    this.setBackgroundType(0);\\\\n}\\\"\"}","{\"Match:str\":\"DimBG\",\"Type:str\":\"\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nif (textState.drawing) {\\\\n    this.setBackgroundType(1);\\\\n}\\\"\"}","{\"Match:str\":\"TransparentBG\",\"Type:str\":\"\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nif (textState.drawing) {\\\\n    this.setBackgroundType(2);\\\\n}\\\"\"}","{\"Match:str\":\"FontChange\",\"Type:str\":\"\\\\<(.*?)\\\\>\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nconst fontName = this.obtainEscapeString(textState);\\\\nthis.contents.fontFace = fontName;\\\"\"}","{\"Match:str\":\"ResetFont\",\"Type:str\":\"\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"this.resetFontSettings();\\\"\"}","{\"Match:str\":\"ResetColor\",\"Type:str\":\"\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"this.resetTextColor();\\\"\"}","{\"Match:str\":\"HexColor\",\"Type:str\":\"\\\\<(.*?)\\\\>\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nconst hexColor = this.obtainEscapeString(textState);\\\\nif (!this.isColorLocked() && textState.drawing) {\\\\n    this.changeTextColor(hexColor);\\\\n}\\\"\"}","{\"Match:str\":\"OutlineColor\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nconst colorIndex = this.obtainEscapeParam(textState);\\\\nif (!this.isColorLocked() && textState.drawing) {\\\\n    this.changeOutlineColor(ColorManager.textColor(colorIndex));\\\\n}\\\"\"}","{\"Match:str\":\"OutlineHexColor\",\"Type:str\":\"\\\\<(.*?)\\\\>\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nconst hexColor = this.obtainEscapeString(textState);\\\\nif (!this.isColorLocked() && textState.drawing) {\\\\n    this.changeOutlineColor(hexColor);\\\\n}\\\"\"}","{\"Match:str\":\"OutlineWidth\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nconst width = this.obtainEscapeParam(textState);\\\\nif (textState.drawing) {\\\\n    this.contents.outlineWidth = width;\\\\n}\\\"\"}","{\"Match:str\":\"WindowMoveTo\",\"Type:str\":\"\\\\<(.*?)\\\\>\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nconst data = this.obtainEscapeString(textState).split(',');\\\\nif (textState.drawing) {\\\\n    const x = !!data[0] ? Number(data[0].trim()) : this.x;\\\\n    const y = !!data[1] ? Number(data[1].trim()) : this.y;\\\\n    const width = !!data[2] ? Number(data[2].trim()) : this.width;\\\\n    const height = !!data[3] ? Number(data[3].trim()) : this.height;\\\\n    const duration = !!data[4] ? Number(data[4].trim()) : 20;\\\\n    const easingType = !!data[5] ? data[5].trim() : 0;\\\\n    this.moveTo(x, y, width, height, duration, easingType);\\\\n}\\\"\"}","{\"Match:str\":\"WindowMoveBy\",\"Type:str\":\"\\\\<(.*?)\\\\>\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nconst data = this.obtainEscapeString(textState).split(',');\\\\nif (textState.drawing) {\\\\n    const x = !!data[0] ? Number(data[0].trim()) : 0;\\\\n    const y = !!data[1] ? Number(data[1].trim()) : 0;\\\\n    const width = !!data[2] ? Number(data[2].trim()) : 0;\\\\n    const height = !!data[3] ? Number(data[3].trim()) : 0;\\\\n    const duration = !!data[4] ? Number(data[4].trim()) : 20;\\\\n    const easingType = !!data[5] ? data[5].trim() : 0;\\\\n    this.moveBy(x, y, width, height, duration, easingType);\\\\n}\\\"\"}","{\"Match:str\":\"WindowReset\",\"Type:str\":\"\",\"CommonEvent:num\":\"0\",\"ActionJS:func\":\"\\\"const textState = arguments[0];\\\\nif (textState.drawing) {\\\\n    const frames = 20;\\\\n    const easingType = 0;\\\\n    this.resetRect(frames, easingType);\\\\n}\\\"\"}"]
 *
 * @param TextCodeReplace:arraystruct
 * @text Text Code Replacements
 * @type struct<TextCodeReplace>[]
 * @desc Text codes that replace themselves with text.
 * @default ["{\"Match:str\":\"ActorFace\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const actorId = parseInt(arguments[1]);\\\\nconst actor = $gameActors.actor(actorId);\\\\nif (this.constructor === Window_Message && actor) {\\\\n    $gameMessage.setFaceImage(\\\\n        actor.faceName(),\\\\n        actor.faceIndex()\\\\n    );\\\\n}\\\\nreturn '';\\\"\"}","{\"Match:str\":\"PartyFace\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const index = parseInt(arguments[1]) - 1;\\\\nconst actor = $gameParty.members()[index];\\\\nif (this.constructor === Window_Message && actor) {\\\\n    $gameMessage.setFaceImage(\\\\n        actor.faceName(),\\\\n        actor.faceIndex()\\\\n    );\\\\n}\\\\nreturn '';\\\"\"}","{\"Match:str\":\"Class\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataClasses;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = true;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"ClassName\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataClasses;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = false;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"Skill\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataSkills;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = true;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"SkillName\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataSkills;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = false;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"Item\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataItems;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = true;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"ItemName\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataItems;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = false;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"ItemQuantity\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataItems;\\\\nconst id = parseInt(arguments[1]);\\\\nreturn $gameParty.numItems(database[id]);\\\"\"}","{\"Match:str\":\"Weapon\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataWeapons;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = true;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"WeaponName\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataWeapons;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = false;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"WeaponQuantity\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataWeapons;\\\\nconst id = parseInt(arguments[1]);\\\\nreturn $gameParty.numItems(database[id]);\\\"\"}","{\"Match:str\":\"LastGainObj\",\"Type:str\":\"\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const icon = true;\\\\nreturn this.lastGainedObjectName(icon);\\\"\"}","{\"Match:str\":\"LastGainObjName\",\"Type:str\":\"\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const icon = false;\\\\nreturn this.lastGainedObjectName(icon);\\\"\"}","{\"Match:str\":\"LastGainObjQuantity\",\"Type:str\":\"\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"return this.lastGainedObjectQuantity();\\\"\"}","{\"Match:str\":\"Armor\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataArmors;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = true;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"ArmorName\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataArmors;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = false;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"ArmorQuantity\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataArmors;\\\\nconst id = parseInt(arguments[1]);\\\\nreturn $gameParty.numItems(database[id]);\\\"\"}","{\"Match:str\":\"State\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataStates;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = true;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"StateName\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataStates;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = false;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"Enemy\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataEnemies;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = true;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"EnemyName\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataEnemies;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = false;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"Troop\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataTroops;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = true;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"TroopName\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"const database = $dataTroops;\\\\nconst id = parseInt(arguments[1]);\\\\nconst icon = false;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"TroopMember\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"if (!$gameParty.inBattle()) return \\\\\\\"\\\\\\\";\\\\nconst index = (parseInt(arguments[1]) - 1) || 0;\\\\nconst member = $gameTroop.members()[index];\\\\nconst database = $dataEnemies;\\\\nconst id = member ? member.enemyId() : 0;\\\\nconst icon = true;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}","{\"Match:str\":\"TroopMemberName\",\"Type:str\":\"\\\\[(\\\\d+)\\\\]\",\"TextStr:str\":\"Undefined\",\"TextJS:func\":\"\\\"if (!$gameParty.inBattle()) return \\\\\\\"\\\\\\\";\\\\nconst index = (parseInt(arguments[1]) - 1) || 0;\\\\nconst member = $gameTroop.members()[index];\\\\nconst database = $dataEnemies;\\\\nconst id = member ? member.enemyId() : 0;\\\\nconst icon = false;\\\\nreturn this.databaseObjectName(database, id, icon);\\\"\"}"]
 *
 * @param TextMacros:arraystruct
 * @text Text Macros
 * @type struct<TextMacro>[]
 * @desc Macros that are used to quickly write batches of text.
 * @default ["{\"Match:str\":\"Example Macro\",\"TextStr:str\":\"This is the text that will be displayed when you type [Example Macro].\",\"TextJS:func\":\"\\\"return 'Text';\\\"\"}","{\"Match:str\":\"Leader\",\"TextStr:str\":\"\\\\P[1]\",\"TextJS:func\":\"\\\"return 'Text';\\\"\"}"]
 *
 * @param TextSpeed:struct
 * @text Text Speed Option Settings
 * @type struct<TextSpeed>
 * @desc Text Speed Options Menu settings.
 * @default {"AddOption:eval":"true","AdjustRect:eval":"true","Name:str":"Text Speed","Default:num":"10","Instant:str":"Instant"}
 *
 * @param WordWrap:struct
 * @text Word Wrap Settings
 * @type struct<WordWrap>
 * @desc Settings involving Word Wrap.
 * @default {"EnableWordWrap":"","MessageWindow:eval":"false","HelpWindow:eval":"false","Rules":"","LineBreakSpace:eval":"true","TightWrap:eval":"false"}
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
 * @param MessageWindow
 * @text Message Window
 *
 * @param MessageRows:num
 * @text Default Rows
 * @parent MessageWindow
 * @type num
 * @min 1
 * @desc Default number of rows to display for the Message Window.
 * @default 4
 *
 * @param MessageWidth:num
 * @text Default Width
 * @parent MessageWindow
 * @type num
 * @min 1
 * @desc Default Message Window width in pixels.
 * @default 816
 *
 * @param FastForwardKey:str
 * @text Fast Forward Key
 * @parent MessageWindow
 * @type combo
 * @option tab
 * @option shift
 * @option control
 * @option pageup
 * @option pagedown
 * @desc This is the key used for fast forwarding messages.
 * @default pagedown
 *
 * @param MessageTextDelay:num
 * @text Text Delay
 * @parent MessageWindow
 * @type number
 * @min 0
 * @desc How many frames to wait between characters drawn?
 * Use 0 for instant.
 * @default 1
 *
 * @param StretchDimmedBg:eval
 * @text Stretch Dimmed BG
 * @parent MessageWindow
 * @type boolean
 * @on Stretch
 * @off Don't
 * @desc Stretch dimmed window background to fit the whole screen.
 * @default true
 *
 * @param DefaultOutlineWidth:num
 * @text Default Outline Width
 * @parent MessageWindow
 * @type number
 * @min 0
 * @desc Changes the default outline width to this many pixels thick.
 * @default 3
 *
 * @param NameBoxWindow
 * @text Name Box Window
 *
 * @param NameBoxWindowDefaultColor:num
 * @text Default Color
 * @parent NameBoxWindow
 * @min 0
 * @max 31
 * @desc Default color for the Name Box Window's text.
 * @default 0
 *
 * @param NameBoxWindowOffsetX:num
 * @text Offset X
 * @parent NameBoxWindow
 * @desc How much to offset the name box window X by (as long as it doesn't go offscreen).
 * @default 0
 *
 * @param NameBoxWindowOffsetY:num
 * @text Offset Y
 * @parent NameBoxWindow
 * @desc How much to offset the name box window Y by (as long as it doesn't go offscreen).
 * @default 0
 *
 * @param ChoiceListWindow
 * @text Choice List Window
 *
 * @param ChoiceWindowLineHeight:num
 * @text Line Height
 * @parent ChoiceListWindow
 * @type number
 * @min 1
 * @desc What is the default line height for Show Choices?
 * @default 36
 *
 * @param ChoiceWindowMaxRows:num
 * @text Max Rows
 * @parent ChoiceListWindow
 * @type number
 * @min 1
 * @desc Maximum number of rows to visibly display?
 * @default 8
 *
 * @param ChoiceWindowMaxCols:num
 * @text Max Columns
 * @parent ChoiceListWindow
 * @type number
 * @min 1
 * @desc Maximum number of columns to visibly display?
 * @default 1
 *
 * @param ChoiceWindowTextAlign:str
 * @text Text Alignment
 * @parent ChoiceListWindow
 * @type select
 * @option Default
 * @value default
 * @option Left
 * @value left
 * @option Center
 * @value center
 * @option Right
 * @value right
 * @desc Default alignment for Show Choice window.
 * @default default
 *
 * @param DefaultTextCodes
 * @text Default Text Codes
 *
 * @param RelativePXPY:eval
 * @text Relative \PX \PY
 * @parent DefaultTextCodes
 * @type boolean
 * @on Better
 * @off Normal
 * @desc Make \PX[x] and \PY[x] adjust relative starting position than exact coordinates.
 * @default true
 *
 * @param FontBiggerCap:eval
 * @text \{ Maximum
 * @parent DefaultTextCodes
 * @type number
 * @min 1
 * @desc Determine the maximum size that \{ can reach.
 * @default 108
 *
 * @param FontSmallerCap:eval
 * @text \} Minimum
 * @parent DefaultTextCodes
 * @type number
 * @min 1
 * @desc Determine the minimum size that \} can reach.
 * @default 12
 *
 * @param FontChangeValue:eval
 * @text \{ Change \}
 * @parent DefaultTextCodes
 * @type number
 * @min 1
 * @desc How much does \{ and \} change font size by?
 * @default 12
 *
 */
/* ----------------------------------------------------------------------------
 * Auto Color Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~AutoColor:
 *
 * @param DatabaseHighlighting
 * @text Database Highlighting
 *
 * @param Actors:str
 * @text Actors
 * @parent DatabaseHighlighting
 * @type number
 * @min 0
 * @max 31
 * @desc Any usage of an Actor's name is given this text color.
 * Use 0 to not auto-color.
 * @default 0
 *
 * @param Classes:str
 * @text Classes
 * @parent DatabaseHighlighting
 * @type number
 * @min 0
 * @max 31
 * @desc Any usage of a Class's name is given this text color.
 * Use 0 to not auto-color.
 * @default 0
 *
 * @param Skills:str
 * @text Skills
 * @parent DatabaseHighlighting
 * @type number
 * @min 0
 * @max 31
 * @desc Any usage of a Skill's name is given this text color.
 * Use 0 to not auto-color.
 * @default 0
 *
 * @param Items:str
 * @text Items
 * @parent DatabaseHighlighting
 * @type number
 * @min 0
 * @max 31
 * @desc Any usage of an Item's name is given this text color.
 * Use 0 to not auto-color.
 * @default 0
 *
 * @param Weapons:str
 * @text Weapons
 * @parent DatabaseHighlighting
 * @type number
 * @min 0
 * @max 31
 * @desc Any usage of a Weapon's name is given this text color.
 * Use 0 to not auto-color.
 * @default 0
 *
 * @param Armors:str
 * @text Armors
 * @parent DatabaseHighlighting
 * @type number
 * @min 0
 * @max 31
 * @desc Any usage of an Armor's name is given this text color.
 * Use 0 to not auto-color.
 * @default 0
 *
 * @param Enemies:str
 * @text Enemies
 * @parent DatabaseHighlighting
 * @type number
 * @min 0
 * @max 31
 * @desc Any usage of an Enemy's name is given this text color.
 * Use 0 to not auto-color.
 * @default 0
 *
 * @param States:str
 * @text States
 * @parent DatabaseHighlighting
 * @type number
 * @min 0
 * @max 31
 * @desc Any usage of a State's name is given this text color.
 * Use 0 to not auto-color.
 * @default 0
 *
 * @param WordHighlighting
 * @text Word Highlighting
 *
 * @param TextColor1:arraystr
 * @text \C[1]: Blue
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor2:arraystr
 * @text \C[2]: Red
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor3:arraystr
 * @text \C[3]: Green
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor4:arraystr
 * @text \C[4]: Sky Blue
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor5:arraystr
 * @text \C[5]: Purple
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor6:arraystr
 * @text \C[6]: Yellow
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor7:arraystr
 * @text \C[7]: Gray
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor8:arraystr
 * @text \C[8]: Light Gray
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor9:arraystr
 * @text \C[9]: Dark Blue
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor10:arraystr
 * @text \C[10]: Dark Red
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor11:arraystr
 * @text \C[11]: Dark Green
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor12:arraystr
 * @text \C[12]: Dark Sky Blue
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor13:arraystr
 * @text \C[13]: Dark Purple
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor14:arraystr
 * @text \C[14]: Solid Yellow
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor15:arraystr
 * @text \C[15]: Black
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor16:arraystr
 * @text \C[16]: System Blue
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor17:arraystr
 * @text \C[17]: Crisis Yellow
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor18:arraystr
 * @text \C[18]: Dead Red
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor19:arraystr
 * @text \C[19]: Outline Black
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor20:arraystr
 * @text \C[20]: HP Orange 1
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor21:arraystr
 * @text \C[21]: HP Orange 2
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor22:arraystr
 * @text \C[22]: MP Blue 1
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor23:arraystr
 * @text \C[23]: MP Blue 2
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor24:arraystr
 * @text \C[24]: Param Up Green
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor25:arraystr
 * @text \C[25]: Param Down Red
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor26:arraystr
 * @text \C[26]: System Purple
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor27:arraystr
 * @text \C[27]: System Pink
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor28:arraystr
 * @text \C[28]: TP Green 1
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor29:arraystr
 * @text \C[29]: TP Green 2
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor30:arraystr
 * @text \C[30]: EXP Purple 1
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 * @param TextColor31:arraystr
 * @text \C[31]: EXP Purple 2
 * @parent WordHighlighting
 * @type string[]
 * @desc A list of all the words that will be automatically colored with this text color.
 * @default []
 *
 */
/* ----------------------------------------------------------------------------
 * Text Code Actions
 * ----------------------------------------------------------------------------
 */
/*~struct~TextCodeAction:
 *
 * @param Match:str
 * @text Match
 * @desc This is what needs to be matched in order for this text code to work.
 * @default Key
 *
 * @param Type:str
 * @text Type
 * @type select
 * @option none
 * @value 
 * @option [x] (number)
 * @value \[(\d+)\]
 * @option <x> (string)
 * @value \<(.*?)\>
 * @desc The type of parameter to obtain (none, number, or string).
 * @default 
 *
 * @param CommonEvent:num
 * @text Common Event
 * @type common_event
 * @desc Select a common event to run when this text code is used in a message.
 * @default 0
 *
 * @param ActionJS:func
 * @text JS: Action
 * @type note
 * @desc JavaScript code used to perform an action when this text code appears.
 * @default "const textState = arguments[0];"
 *
 */
/* ----------------------------------------------------------------------------
 * Text Code Replacements
 * ----------------------------------------------------------------------------
 */
/*~struct~TextCodeReplace:
 *
 * @param Match:str
 * @text Match
 * @desc This is what needs to be matched in order for this text code to work.
 * @default Key
 *
 * @param Type:str
 * @text Type
 * @type select
 * @option none
 * @value 
 * @option [x] (number)
 * @value \[(\d+)\]
 * @option <x> (string)
 * @value \<(.*?)\>
 * @desc The type of parameter to obtain (none, number, or string).
 * @default 
 *
 * @param TextStr:str
 * @text STR: Text
 * @desc The text that will appear if this match appears.
 * If this has a value, ignore the JS: Text version.
 * @default Undefined
 *
 * @param TextJS:func
 * @text JS: Text
 * @type note
 * @desc JavaScript code used to determine the text that will appear if this match appears.
 * @default "return 'Text';"
 *
 */
/* ----------------------------------------------------------------------------
 * Text Macro
 * ----------------------------------------------------------------------------
 */
/*~struct~TextMacro:
 *
 * @param Match:str
 * @text Match
 * @desc This is what needs to be matched in order for this macro to work.
 * @default Key
 *
 * @param TextStr:str
 * @text STR: Text
 * @desc The replacement text that will appear from the macro.
 * If this has a value, ignore the JS: Text version.
 * @default Undefined
 *
 * @param TextJS:func
 * @text JS: Text
 * @type note
 * @desc JavaScript code used to determine the text that will appear if this macro appears.
 * @default "return 'Text';"
 *
 */
/* ----------------------------------------------------------------------------
 * Text Speed Options Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~TextSpeed:
 *
 * @param AddOption:eval
 * @text Add Option?
 * @type boolean
 * @on Add
 * @off Don't Add
 * @desc Add the 'Text Speed' option to the Options menu?
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
 * @default Text Speed
 *
 * @param Default:num
 * @text Default Value
 * @type number
 * @min 1
 * @max 11
 * @desc 1 - 10, slowest to fastest.
 * 11 is instant value.
 * @default 10
 *
 * @param Instant:str
 * @text Instant Speed
 * @desc Text to show "instant" text.
 * @default Instant
 *
 */
/* ----------------------------------------------------------------------------
 * Word Wrap Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~WordWrap:
 *
 * @param EnableWordWrap
 * @text Enable Word Wrap
 *
 * @param MessageWindow:eval
 * @text Message Window
 * @parent EnableWordWrap
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Automatically enable Word Wrap for this window?
 * @default false
 *
 * @param HelpWindow:eval
 * @text Help Window
 * @parent EnableWordWrap
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Automatically enable Word Wrap for this window?
 * @default false
 *
 * @param Rules
 * @text Rules
 *
 * @param LineBreakSpace:eval
 * @text Link Break -> Space
 * @parent Rules
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Convert manually placed (non tagged) line breaks with spaces?
 * @default true
 *
 * @param TightWrap:eval
 * @text Tight Wrap
 * @parent Rules
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc If a face graphic is present in a message, word wrap will be tighter.
 * @default false
 *
 */
//=============================================================================

const _0x52f1=['_autoSizeCheck','_list','ActionJS','makeDeepCopy','selectDefault','windowPadding','BOLD','46UvIYCT','emerge','Items','prepareShowTextFollowups','isBusy','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','AutoColor','Window_ChoiceList_updatePlacement','ConvertTextAutoColorRegExpFriendly','AutoColorRegExp','isItem','initialize','\x1bTEXTALIGNMENT[1]','processCommonEvent','choicePositionType','follower','5219Vlgvxu','obtainItem','itemHeight','call','drawing','applyDatabaseAutoColor','%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.','drawTextEx','setupItemChoice','adjustShowChoiceExtension','indexOf','isBreakShowTextCommands','outLineColor','_autoPosRegExp','<LEFT>','SWITCHES','fontBold','format','FontBiggerCap','_wordWrap','textSizeEx','updateAutoPosition','join','levelUp','refresh','min','lineHeight','_moveTargetX','setLastGainedItemData','convertTextAlignmentEscapeCharacters','\x1bCOLORLOCK[1]','postFlushTextState','_positionType','startY','getConfigValue','1245953bhUTJw','Window_Options_addGeneralOptions','StretchDimmedBg','createTextState','resetTextColor','1010406Ruayiz','process_VisuMZ_MessageCore_TextMacros','setupEvents','isSceneBattle','resetPositionX','updateBackground','obtainGold','_cancelButton','choiceCols','11nzzAnV','Window_Message_clearFlags','moveTo','processNewLine','<LINE\x20BREAK>','registerCommand','applyData','58297TjEdpP','setup','Rows','easeOut','Window_Message_isTriggered','processDrawPicture','LineBreakSpace','name','split','preemptive','setMessageWindowWidth','right','<BR>','registerActorNameAutoColorChanges','setTextDelay','refreshDimmerBitmap','TextSpeed','numVisibleRows','textSizeExTextAlignment','messageCoreWindowX','setupNumInput','<COLORLOCK>','processAllText','AddAutoColor','push','Skills','type','_autoPositionTarget','ParseSkillNotetags','fontFace','setTextAlignment','obtainEscapeString','FastForwardKey','onNewPageMessageCore','Name','maxChoiceWidth','\x1bTEXTALIGNMENT','<CENTER>','messageWindowRect','ANY','windowX','TextJS','_texts','_eventId','MessageCore','isContinuePrepareShowTextCommands','Game_Party_gainItem','CreateAutoColorRegExpLists','COMMONEVENT','makeFontBigger','WordWrap','isPressed','flushTextState','rtl','ARRAYJSON','resetFontSettings','battle\x20party','constructor','paintOpacity','Window_Help_refresh','clamp','shift','processPyTextCode','addContinuousShowChoices','1iKQWJb','Armors','Window_NameBox_refresh','_textAlignment','updateMessageCommonEvents','itemRectWithPadding','faceWidth','TightWrap','map\x20event','[0]','processDrawCenteredPicture','ceil','synchronizeNameBox','Window_Base_processNewLine','_textDelay','isCommandEnabled','ConfigManager_applyData','updateAutoSizePosition','obtainEscapeParam','unshift','processCharacter','startWait','ARRAYNUM','ITALIC','resetWordWrap','Window_Base_textSizeEx','_textDelayCount','ChoiceWindowLineHeight','windowWidth','convertMessageCoreEscapeActions','convertBaseEscapeCharacters','convertTextMacros','Match','Type','Scene_Options_maxCommands','findTargetSprite','choiceTextAlign','nextEventCode','addMessageCoreTextSpeedCommand','match','processEscapeCharacter','isArmor','members','Settings','mainFontFace','ChoiceWindowMaxRows','ChoiceWindowMaxCols','Window_Message_processEscapeCharacter','includes','messageCoreTextSpeed','calcWindowHeight','drawItem','onProcessCharacter','clear','<%1>','event','addExtraShowChoices','ARRAYSTRUCT','toLowerCase','Game_Map_initialize','clampPlacementPosition','process_VisuMZ_MessageCore_TextCodes_Action','_moveTargetWidth','TextCodeReplace','AutoColorBypassList','_interpreter','actorName','test','applyMoveEasing','followers','textColor','blt','prepareShowTextCommand','boxHeight','index','Window_Options_statusText','_indent','processActorNameAutoColorChanges','messageRows','isChoiceEnabled','Window_ChoiceList_windowX','updatePlacement','isSceneMap','Window_Base_update','setChoiceListLineHeight','updateDimensions','ParseAllNotetags','MessageWidth','isMessageWindowWordWrap','messageWidth','ParseStateNotetags','FUNC','contentsBack','preFlushTextState','</B>','ARRAYSTR','ChoiceWindowProperties','defaultColor','parameters','outputWidth','<RIGHT>','CreateAutoColorRegExpListEntries','makeData','HIDE','addCommand','_nameBoxWindow','_wholeMoveDuration','code','setChoiceListMaxRows','stretchDimmerSprite','width','innerWidth','isAutoColorAffected','clearFlags','EVAL','contents','colSpacing','isChoiceVisible','DefaultOutlineWidth','Game_Map_updateEvents','States','Window_NameBox_updatePlacement','</COLORLOCK>','getPreservedFontSettings','victory','_centerMessageWindow','HelpWindow','_autoColorActorNames','statusText','addGeneralOptions','postConvertEscapeCharacters','<B>','round','message','159707cNcWrI','\x1bITALIC[0]','textSizeExWordWrap','getChoiceListMaxColumns','substr','convertEscapeCharacters','itemLineRect','setMessageWindowRows','_messagePositionReset','partyMemberName','normalColor','actor','Game_System_initialize','\x1bCOLORLOCK[0]','processTextAlignmentChange','ChoiceWindowTextAlign','canMove','messageWordWrap','terminateMessage','isHelpWindowWordWrap','convertBackslashCharacters','setFaceImage','process_VisuMZ_MessageCore_AutoColor','_moveTargetHeight','setChoiceListMaxColumns','General','addMessageCoreCommands','processAutoColorWords','_MessageCoreSettings','Window_Base_processEscapeCharacter','updateRelativePosition','scale','Undefined','max','37937lvXWNd','</WORDWRAP>','Center','left','messagePositionReset','boxWidth','processFsTextCode','_data','commandSymbol','processPreviousColor','prepareWordWrapEscapeCharacters','clearActorNameAutoColor','ParseItemNotetags','drawBackPicture','placeCancelButton','value','isVolumeSymbol','currentExt','makeFontSmaller','trim','update','height','\x5c%1','TextCodeActions','MaxRows','map\x20party','prepareAutoSizeEscapeCharacters','Game_Map_setupEvents','setupChoices','none','updateNameBoxMove','convertLockColorsEscapeCharacters','</CENTER>','textSpeed','\x1bTEXTALIGNMENT[2]','exec','isRTL','changeTextColor','\x1bTEXTALIGNMENT[0]','anchor','_lastGainedItemData','fontItalic','processWrapBreak','substring','choiceRows','inBattle','false','setChoiceListTextAlign','maxFontSizeInLine','setColorLock','FontSmallerCap','drawBackCenteredPicture','choices','Actors','STR','outputHeight','databaseObjectName','\x1bWrapBreak[0]','ConvertParams','_messageWindow','_autoSizeRegexp','remove','processPxTextCode','\x1bC[%1]%2\x1bPREVCOLOR[0]','JSON','setRelativePosition','setWordWrap','iconIndex','getChoiceListMaxRows','updateTransform','processMessageCoreEscapeActions','activate','TextStr','initMessageCore','SortObjectByKeyLength','defeat','processStoredAutoColorChanges','processTextAlignmentX','STRUCT','Window_Base_processAllText','_resetRect','ConfigManager_makeData','map','_spriteset','slice','padding','fontSize','changeTextSpeed','preConvertEscapeCharacters','addWrapBreakAfterPunctuation','Window_Message_updatePlacement','WAIT','loadPicture','Window_Message_terminateMessage','Window_Message_newPage','processControlCharacter','returnPreservedFontSettings','ParseEnemyNotetags','instantTextSpeed','list','TextMacros','convertFontSettingsEscapeCharacters','maxCommands','Window_Options_changeVolume','getChoiceListTextAlign','length','Classes','_index','TextColor%1','innerHeight','convertMessageCoreEscapeReplacements','processAutoPosition','Enemies','startX','SWITCH','isTriggered','calcMoveEasing','exit','updateOverlappingY','</LEFT>','_moveTargetY','changeVolume','addContinuousShowTextCommands','currencyUnit','<WORDWRAP>','VisuMZ_0_CoreEngine','convertVariableEscapeCharacters','getTextAlignment','LineHeight','isColorLocked','close','onDatabaseLoaded','outlineWidth','</RIGHT>','maxCols','battle\x20actor','choiceLineHeight','changePaintOpacity','PICTURE','textSpeedStatusText','resetRect','getChoiceListLineHeight','NameBoxWindowOffsetX','true','changeOutlineColor','makeCommandList','isWeapon','\x1bTEXTALIGNMENT[3]','NameBoxWindowDefaultColor','\x1bBOLD[0]','addLoadListener','setSpeakerName','process_VisuMZ_MessageCore_TextCodes_Replace','bind','newPage','registerResetRect','setHelpWindowWordWrap','easeIn','CENTERPICTURE','map\x20player','createContents','TextAlign','_moveDuration','DISABLE','getMessageWindowRows','processFontChangeItalic','maxLines','parse','Window_Message_synchronizeNameBox','processCustomWait','WRAPBREAK','description','Window_Base_processControlCharacter','return\x20\x27','AddOption','toUpperCase','MessageWindowProperties','status','ParseClassNotetags','_colorLock','processAutoSize','sort','open','Width','updateEvents','RelativePXPY','FontChangeValue','escapeStart','_showFast','currentCommand','1KwYpTl','launchMessageCommonEvent','faceName','ParseWeaponNotetags','Window_Base_changeTextColor','Instant','moveBy','helpWordWrap','floor','TextManager_message','choice','Default','_textColorStack','setBackground','AdjustRect','addMessageCommonEvent','changeValue','_relativePosition','getLastGainedItemData','setPositionType','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','Scene_Boot_onDatabaseLoaded','CreateAutoColorFor','Game_Interpreter_setupChoices','ParseArmorNotetags','MaxCols','Window_Options_isVolumeSymbol','Game_Party_initialize','29HgHSwE','updateMove','replace','updateOffsetPosition','607358VXcjzk','textCodeCheck','ARRAYFUNC','\x1bITALIC[1]','default','_dimmerSprite','_moveEasingType','getMessageWindowWidth','command101','Weapons','\x1bBOLD[1]','textCodeResult','prototype','gainItem','setMessageWindowWordWrap','text','processFontChangeBold','lastGainedObjectQuantity','_messageCommonEvents','outlineColor','battle\x20enemy','Window_Base_initialize','_scene','isWordWrapEnabled','SHOW','onChoice','NUM','adjustShowChoiceDefault'];const _0x3551=function(_0x1ab979,_0x2401e7){_0x1ab979=_0x1ab979-0x189;let _0x52f138=_0x52f1[_0x1ab979];return _0x52f138;};const _0x2a5a53=_0x3551;(function(_0x1c74fa,_0x11ed4b){const _0x5b79a6=_0x3551;while(!![]){try{const _0x179465=parseInt(_0x5b79a6(0x297))*-parseInt(_0x5b79a6(0x31d))+parseInt(_0x5b79a6(0x257))*-parseInt(_0x5b79a6(0x250))+-parseInt(_0x5b79a6(0x1e8))*parseInt(_0x5b79a6(0x33f))+parseInt(_0x5b79a6(0x1ec))+-parseInt(_0x5b79a6(0x20f))*parseInt(_0x5b79a6(0x21f))+parseInt(_0x5b79a6(0x1cc))*parseInt(_0x5b79a6(0x242))+parseInt(_0x5b79a6(0x247));if(_0x179465===_0x11ed4b)break;else _0x1c74fa['push'](_0x1c74fa['shift']());}catch(_0x44f4ae){_0x1c74fa['push'](_0x1c74fa['shift']());}}}(_0x52f1,0xb0640));var label=_0x2a5a53(0x283),tier=tier||0x0,dependencies=[],pluginData=$plugins['filter'](function(_0x399a2e){const _0x3efa6e=_0x2a5a53;return _0x399a2e[_0x3efa6e(0x1bf)]&&_0x399a2e[_0x3efa6e(0x1b9)][_0x3efa6e(0x2c7)]('['+label+']');})[0x0];VisuMZ[label][_0x2a5a53(0x2c2)]=VisuMZ[label][_0x2a5a53(0x2c2)]||{},VisuMZ['ConvertParams']=function(_0x219bd4,_0x4961a4){const _0x3440dc=_0x2a5a53;for(const _0x4dc27d in _0x4961a4){if(_0x4dc27d['match'](/(.*):(.*)/i)){const _0x1b1ac1=String(RegExp['$1']),_0x1b3faa=String(RegExp['$2'])[_0x3440dc(0x1bd)]()[_0x3440dc(0x352)]();let _0x24f806,_0x67edc,_0x7cbd3c;switch(_0x1b3faa){case _0x3440dc(0x206):_0x24f806=_0x4961a4[_0x4dc27d]!==''?Number(_0x4961a4[_0x4dc27d]):0x0;break;case _0x3440dc(0x2ad):_0x67edc=_0x4961a4[_0x4dc27d]!==''?JSON[_0x3440dc(0x1b5)](_0x4961a4[_0x4dc27d]):[],_0x24f806=_0x67edc[_0x3440dc(0x391)](_0x156b17=>Number(_0x156b17));break;case _0x3440dc(0x309):_0x24f806=_0x4961a4[_0x4dc27d]!==''?eval(_0x4961a4[_0x4dc27d]):null;break;case'ARRAYEVAL':_0x67edc=_0x4961a4[_0x4dc27d]!==''?JSON[_0x3440dc(0x1b5)](_0x4961a4[_0x4dc27d]):[],_0x24f806=_0x67edc[_0x3440dc(0x391)](_0x3b24ba=>eval(_0x3b24ba));break;case _0x3440dc(0x37f):_0x24f806=_0x4961a4[_0x4dc27d]!==''?JSON[_0x3440dc(0x1b5)](_0x4961a4[_0x4dc27d]):'';break;case _0x3440dc(0x28d):_0x67edc=_0x4961a4[_0x4dc27d]!==''?JSON[_0x3440dc(0x1b5)](_0x4961a4[_0x4dc27d]):[],_0x24f806=_0x67edc[_0x3440dc(0x391)](_0x27611d=>JSON[_0x3440dc(0x1b5)](_0x27611d));break;case _0x3440dc(0x2f2):_0x24f806=_0x4961a4[_0x4dc27d]!==''?new Function(JSON[_0x3440dc(0x1b5)](_0x4961a4[_0x4dc27d])):new Function('return\x200');break;case _0x3440dc(0x1ee):_0x67edc=_0x4961a4[_0x4dc27d]!==''?JSON['parse'](_0x4961a4[_0x4dc27d]):[],_0x24f806=_0x67edc[_0x3440dc(0x391)](_0x47c249=>new Function(JSON[_0x3440dc(0x1b5)](_0x47c249)));break;case _0x3440dc(0x375):_0x24f806=_0x4961a4[_0x4dc27d]!==''?String(_0x4961a4[_0x4dc27d]):'';break;case _0x3440dc(0x2f6):_0x67edc=_0x4961a4[_0x4dc27d]!==''?JSON[_0x3440dc(0x1b5)](_0x4961a4[_0x4dc27d]):[],_0x24f806=_0x67edc['map'](_0x2032d3=>String(_0x2032d3));break;case _0x3440dc(0x38d):_0x7cbd3c=_0x4961a4[_0x4dc27d]!==''?JSON[_0x3440dc(0x1b5)](_0x4961a4[_0x4dc27d]):{},_0x219bd4[_0x1b1ac1]={},VisuMZ['ConvertParams'](_0x219bd4[_0x1b1ac1],_0x7cbd3c);continue;case _0x3440dc(0x2d0):_0x67edc=_0x4961a4[_0x4dc27d]!==''?JSON[_0x3440dc(0x1b5)](_0x4961a4[_0x4dc27d]):[],_0x24f806=_0x67edc[_0x3440dc(0x391)](_0x4e686d=>VisuMZ[_0x3440dc(0x379)]({},JSON['parse'](_0x4e686d)));break;default:continue;}_0x219bd4[_0x1b1ac1]=_0x24f806;}}return _0x219bd4;},(_0x3782e4=>{const _0x42c0f5=_0x2a5a53,_0x4f00d9=_0x3782e4['name'];for(const _0x997047 of dependencies){if(!Imported[_0x997047]){alert(_0x42c0f5(0x1e0)[_0x42c0f5(0x230)](_0x4f00d9,_0x997047)),SceneManager[_0x42c0f5(0x3b4)]();break;}}const _0x38efac=_0x3782e4[_0x42c0f5(0x1b9)];if(_0x38efac['match'](/\[Version[ ](.*?)\]/i)){const _0xf61eb7=Number(RegExp['$1']);_0xf61eb7!==VisuMZ[label]['version']&&(alert(_0x42c0f5(0x214)['format'](_0x4f00d9,_0xf61eb7)),SceneManager[_0x42c0f5(0x3b4)]());}if(_0x38efac['match'](/\[Tier[ ](\d+)\]/i)){const _0x2fb7ce=Number(RegExp['$1']);_0x2fb7ce<tier?(alert(_0x42c0f5(0x225)[_0x42c0f5(0x230)](_0x4f00d9,_0x2fb7ce,tier)),SceneManager['exit']()):tier=Math[_0x42c0f5(0x33e)](_0x2fb7ce,tier);}VisuMZ[_0x42c0f5(0x379)](VisuMZ[label][_0x42c0f5(0x2c2)],_0x3782e4['parameters']);})(pluginData),PluginManager[_0x2a5a53(0x255)](pluginData['name'],_0x2a5a53(0x2f7),_0x5b5206=>{const _0x21ec0d=_0x2a5a53;VisuMZ[_0x21ec0d(0x379)](_0x5b5206,_0x5b5206);const _0x514af8=_0x5b5206[_0x21ec0d(0x18e)]||$gameSystem[_0x21ec0d(0x19b)]()||0x1,_0x24d132=_0x5b5206[_0x21ec0d(0x357)]||$gameSystem[_0x21ec0d(0x383)]()||0x1,_0x3f68e9=_0x5b5206[_0x21ec0d(0x1e5)]||$gameSystem[_0x21ec0d(0x320)]()||0x1,_0x5d61b0=_0x5b5206[_0x21ec0d(0x1af)][_0x21ec0d(0x2d1)]()||_0x21ec0d(0x1f0);$gameSystem[_0x21ec0d(0x2eb)](_0x514af8),$gameSystem['setChoiceListMaxRows'](_0x24d132),$gameSystem[_0x21ec0d(0x335)](_0x3f68e9),$gameSystem[_0x21ec0d(0x36e)](_0x5d61b0);}),PluginManager[_0x2a5a53(0x255)](pluginData[_0x2a5a53(0x25e)],_0x2a5a53(0x1be),_0x3817f8=>{const _0x2136fb=_0x2a5a53;VisuMZ[_0x2136fb(0x379)](_0x3817f8,_0x3817f8);const _0x24a69d=_0x3817f8[_0x2136fb(0x259)]||$gameSystem[_0x2136fb(0x1b2)]()||0x1,_0x5d574b=_0x3817f8[_0x2136fb(0x1c5)]||$gameSystem['getMessageWindowWidth']()||0x1;$gameTemp[_0x2136fb(0x314)]=_0x3817f8[_0x2136fb(0x341)]||![];const _0x53c715=_0x3817f8[_0x2136fb(0x289)][_0x2136fb(0x2d1)]();$gameSystem[_0x2136fb(0x324)](_0x24a69d),$gameSystem[_0x2136fb(0x261)](_0x5d574b);[_0x2136fb(0x19d),_0x2136fb(0x36d)][_0x2136fb(0x2c7)](_0x53c715)&&$gameSystem[_0x2136fb(0x1fa)](eval(_0x53c715));const _0x541dff=SceneManager[_0x2136fb(0x202)][_0x2136fb(0x37a)];_0x541dff&&(_0x541dff[_0x2136fb(0x2af)](),_0x541dff[_0x2136fb(0x2ec)](),_0x541dff[_0x2136fb(0x1ae)]());}),VisuMZ[_0x2a5a53(0x283)]['Scene_Boot_onDatabaseLoaded']=Scene_Boot[_0x2a5a53(0x1f8)][_0x2a5a53(0x191)],Scene_Boot[_0x2a5a53(0x1f8)][_0x2a5a53(0x191)]=function(){const _0x577bc7=_0x2a5a53;VisuMZ[_0x577bc7(0x283)][_0x577bc7(0x1e1)][_0x577bc7(0x222)](this),this[_0x577bc7(0x2d4)](),this[_0x577bc7(0x1a6)](),this[_0x577bc7(0x248)](),this[_0x577bc7(0x333)]();},VisuMZ[_0x2a5a53(0x283)]['SortObjectByKeyLength']=function(_0x44742a){const _0x5aacd0=_0x2a5a53,_0x103e2c=VisuMZ[_0x5aacd0(0x283)]['Settings'][_0x44742a];_0x103e2c['sort']((_0x5274aa,_0x5a6224)=>{const _0xf6cb80=_0x5aacd0;if(!_0x5274aa||!_0x5a6224)return-0x1;return _0x5a6224[_0xf6cb80(0x2b7)]['length']-_0x5274aa['Match'][_0xf6cb80(0x3a8)];});},Scene_Boot[_0x2a5a53(0x1f8)][_0x2a5a53(0x2d4)]=function(){const _0x42ef4a=_0x2a5a53;VisuMZ[_0x42ef4a(0x283)][_0x42ef4a(0x389)](_0x42ef4a(0x356));for(const _0x1f3e85 of VisuMZ[_0x42ef4a(0x283)][_0x42ef4a(0x2c2)]['TextCodeActions']){_0x1f3e85[_0x42ef4a(0x2b7)]=_0x1f3e85['Match'][_0x42ef4a(0x1bd)](),_0x1f3e85['textCodeCheck']=new RegExp('\x1b'+_0x1f3e85[_0x42ef4a(0x2b7)],'gi'),_0x1f3e85['textCodeResult']='\x1b'+_0x1f3e85[_0x42ef4a(0x2b7)];if(_0x1f3e85[_0x42ef4a(0x2b8)]==='')_0x1f3e85['textCodeResult']+=_0x42ef4a(0x2a0);}},Scene_Boot[_0x2a5a53(0x1f8)][_0x2a5a53(0x1a6)]=function(){const _0xcde2d7=_0x2a5a53;VisuMZ[_0xcde2d7(0x283)][_0xcde2d7(0x389)](_0xcde2d7(0x2d6));for(const _0xd2c7a8 of VisuMZ[_0xcde2d7(0x283)][_0xcde2d7(0x2c2)][_0xcde2d7(0x2d6)]){_0xd2c7a8[_0xcde2d7(0x1ed)]=new RegExp('\x1b'+_0xd2c7a8[_0xcde2d7(0x2b7)]+_0xd2c7a8[_0xcde2d7(0x2b8)],'gi'),_0xd2c7a8[_0xcde2d7(0x387)]!==''&&_0xd2c7a8[_0xcde2d7(0x387)]!==_0xcde2d7(0x33d)?_0xd2c7a8['textCodeResult']=new Function(_0xcde2d7(0x1bb)+_0xd2c7a8['TextStr']['replace'](/\\/g,'\x1b')+'\x27'):_0xd2c7a8[_0xcde2d7(0x1f7)]=_0xd2c7a8[_0xcde2d7(0x280)];}},Scene_Boot[_0x2a5a53(0x1f8)][_0x2a5a53(0x248)]=function(){const _0x4fb547=_0x2a5a53;for(const _0x48919b of VisuMZ['MessageCore'][_0x4fb547(0x2c2)][_0x4fb547(0x3a3)]){_0x48919b[_0x4fb547(0x1ed)]=new RegExp('\x5c['+_0x48919b[_0x4fb547(0x2b7)]+'\x5c]','gi'),_0x48919b[_0x4fb547(0x387)]!==''&&_0x48919b['TextStr']!==_0x4fb547(0x33d)?_0x48919b[_0x4fb547(0x1f7)]=new Function('return\x20\x27'+_0x48919b[_0x4fb547(0x387)][_0x4fb547(0x1ea)](/\\/g,'\x1b')+'\x27'):_0x48919b[_0x4fb547(0x1f7)]=_0x48919b[_0x4fb547(0x280)];}},Scene_Boot['prototype']['process_VisuMZ_MessageCore_AutoColor']=function(){const _0x4d3948=_0x2a5a53,_0x33a1bf=VisuMZ['MessageCore'][_0x4d3948(0x2c2)][_0x4d3948(0x215)];!VisuMZ[_0x4d3948(0x2ed)]&&(VisuMZ['MessageCore'][_0x4d3948(0x26e)]($dataClasses,_0x33a1bf['Classes']),VisuMZ[_0x4d3948(0x283)][_0x4d3948(0x26e)]($dataSkills,_0x33a1bf['Skills']),VisuMZ[_0x4d3948(0x283)]['AddAutoColor']($dataItems,_0x33a1bf[_0x4d3948(0x211)]),VisuMZ[_0x4d3948(0x283)][_0x4d3948(0x26e)]($dataWeapons,_0x33a1bf[_0x4d3948(0x1f5)]),VisuMZ[_0x4d3948(0x283)]['AddAutoColor']($dataArmors,_0x33a1bf['Armors']),VisuMZ[_0x4d3948(0x283)][_0x4d3948(0x26e)]($dataEnemies,_0x33a1bf[_0x4d3948(0x3af)]),VisuMZ[_0x4d3948(0x283)]['AddAutoColor']($dataStates,_0x33a1bf[_0x4d3948(0x30f)])),VisuMZ['MessageCore'][_0x4d3948(0x286)]();},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x2d7)]=['V','N','P','C','I','PX','PY','G','{','}','<','>','FS','\x5c','$','.','|','!','<','>','^',_0x2a5a53(0x31a),_0x2a5a53(0x2f5),'<I>','</I>',_0x2a5a53(0x22d),_0x2a5a53(0x3b6),_0x2a5a53(0x27c),_0x2a5a53(0x35f),_0x2a5a53(0x2fb),_0x2a5a53(0x193),_0x2a5a53(0x26c),_0x2a5a53(0x311),'(((',')))',_0x2a5a53(0x18a),_0x2a5a53(0x340),_0x2a5a53(0x263),_0x2a5a53(0x254),'PICTURE',_0x2a5a53(0x1ac),_0x2a5a53(0x287),_0x2a5a53(0x39a),_0x2a5a53(0x204),_0x2a5a53(0x2fe),'ENABLE',_0x2a5a53(0x1b1),_0x2a5a53(0x3b1),_0x2a5a53(0x22e),'ALL',_0x2a5a53(0x27e)],VisuMZ['MessageCore'][_0x2a5a53(0x26e)]=function(_0x35e21c,_0x237d8b){const _0x4720bf=_0x2a5a53;if(_0x237d8b<=0x0)return;const _0x27827e=_0x35e21c;for(const _0x2fdeec of _0x27827e){if(!_0x2fdeec)continue;VisuMZ[_0x4720bf(0x283)][_0x4720bf(0x1e2)](_0x2fdeec,_0x237d8b);}},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x286)]=function(){const _0xf613d6=_0x2a5a53;VisuMZ[_0xf613d6(0x283)]['AutoColorRegExp']=[];for(let _0x54cb0c=0x1;_0x54cb0c<=0x1f;_0x54cb0c++){const _0x4b741c=_0xf613d6(0x3ab)['format'](_0x54cb0c),_0x15b398=VisuMZ[_0xf613d6(0x283)]['Settings'][_0xf613d6(0x215)][_0x4b741c];_0x15b398[_0xf613d6(0x1c3)]((_0x5f120f,_0x3cc3da)=>{if(!_0x5f120f||!_0x3cc3da)return-0x1;return _0x3cc3da['length']-_0x5f120f['length'];}),this['CreateAutoColorRegExpListEntries'](_0x15b398,_0x54cb0c);}},VisuMZ['MessageCore'][_0x2a5a53(0x2fc)]=function(_0x3a55a4,_0x40e1cb){const _0x38d620=_0x2a5a53;for(const _0x2a6302 of _0x3a55a4){if(_0x2a6302['length']<=0x0)continue;if(/^\d+$/['test'](_0x2a6302))continue;let _0x1b1fbb=VisuMZ[_0x38d620(0x283)][_0x38d620(0x217)](_0x2a6302);if(_0x2a6302['match'](/[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g))var _0x294ed5=new RegExp(_0x1b1fbb,'i');else var _0x294ed5=new RegExp('\x5cb'+_0x1b1fbb+'\x5cb','g');VisuMZ[_0x38d620(0x283)]['AutoColorRegExp'][_0x38d620(0x26f)]([_0x294ed5,_0x38d620(0x37e)[_0x38d620(0x230)](_0x40e1cb,_0x2a6302)]);}},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x217)]=function(_0x1750dc){const _0x119f3d=_0x2a5a53;return _0x1750dc=_0x1750dc['replace'](/(\W)/gi,(_0x4690bd,_0x232334)=>_0x119f3d(0x355)[_0x119f3d(0x230)](_0x232334)),_0x1750dc;},VisuMZ[_0x2a5a53(0x283)]['ParseClassNotetags']=VisuMZ[_0x2a5a53(0x1c0)],VisuMZ[_0x2a5a53(0x1c0)]=function(_0x561d8f){const _0x1a12a7=_0x2a5a53;VisuMZ[_0x1a12a7(0x283)]['ParseClassNotetags'][_0x1a12a7(0x222)](this,_0x561d8f);const _0x24c743=VisuMZ[_0x1a12a7(0x283)]['Settings'][_0x1a12a7(0x215)];VisuMZ[_0x1a12a7(0x283)][_0x1a12a7(0x1e2)](_0x561d8f,_0x24c743['Classes']);},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x273)]=VisuMZ[_0x2a5a53(0x273)],VisuMZ['ParseSkillNotetags']=function(_0x26223c){const _0x23842f=_0x2a5a53;VisuMZ[_0x23842f(0x283)][_0x23842f(0x273)][_0x23842f(0x222)](this,_0x26223c);const _0x27c769=VisuMZ[_0x23842f(0x283)][_0x23842f(0x2c2)][_0x23842f(0x215)];VisuMZ[_0x23842f(0x283)][_0x23842f(0x1e2)](_0x26223c,_0x27c769[_0x23842f(0x270)]);},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x34b)]=VisuMZ['ParseItemNotetags'],VisuMZ[_0x2a5a53(0x34b)]=function(_0x22bdee){const _0x47ad66=_0x2a5a53;VisuMZ['MessageCore']['ParseItemNotetags'][_0x47ad66(0x222)](this,_0x22bdee);const _0x5f3ca5=VisuMZ[_0x47ad66(0x283)][_0x47ad66(0x2c2)][_0x47ad66(0x215)];VisuMZ[_0x47ad66(0x283)]['CreateAutoColorFor'](_0x22bdee,_0x5f3ca5['Items']);},VisuMZ['MessageCore'][_0x2a5a53(0x1cf)]=VisuMZ[_0x2a5a53(0x1cf)],VisuMZ['ParseWeaponNotetags']=function(_0x51e474){const _0x6da13e=_0x2a5a53;VisuMZ[_0x6da13e(0x283)][_0x6da13e(0x1cf)]['call'](this,_0x51e474);const _0x75b08a=VisuMZ['MessageCore'][_0x6da13e(0x2c2)][_0x6da13e(0x215)];VisuMZ['MessageCore']['CreateAutoColorFor'](_0x51e474,_0x75b08a[_0x6da13e(0x1f5)]);},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x1e4)]=VisuMZ['ParseArmorNotetags'],VisuMZ[_0x2a5a53(0x1e4)]=function(_0x1e7678){const _0x3a9029=_0x2a5a53;VisuMZ[_0x3a9029(0x283)][_0x3a9029(0x1e4)][_0x3a9029(0x222)](this,_0x1e7678);const _0x2d7137=VisuMZ[_0x3a9029(0x283)][_0x3a9029(0x2c2)][_0x3a9029(0x215)];VisuMZ[_0x3a9029(0x283)][_0x3a9029(0x1e2)](_0x1e7678,_0x2d7137[_0x3a9029(0x298)]);},VisuMZ['MessageCore'][_0x2a5a53(0x3a0)]=VisuMZ[_0x2a5a53(0x3a0)],VisuMZ[_0x2a5a53(0x3a0)]=function(_0x33255f){const _0x548b3d=_0x2a5a53;VisuMZ[_0x548b3d(0x283)][_0x548b3d(0x3a0)][_0x548b3d(0x222)](this,_0x33255f);const _0x59add6=VisuMZ[_0x548b3d(0x283)][_0x548b3d(0x2c2)][_0x548b3d(0x215)];VisuMZ['MessageCore']['CreateAutoColorFor'](_0x33255f,_0x59add6[_0x548b3d(0x3af)]);},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x2f1)]=VisuMZ[_0x2a5a53(0x2f1)],VisuMZ[_0x2a5a53(0x2f1)]=function(_0x1ac0c0){const _0x5c6a3a=_0x2a5a53;VisuMZ[_0x5c6a3a(0x283)][_0x5c6a3a(0x2f1)][_0x5c6a3a(0x222)](this,_0x1ac0c0);const _0x562d6c=VisuMZ['MessageCore'][_0x5c6a3a(0x2c2)][_0x5c6a3a(0x215)];VisuMZ['MessageCore'][_0x5c6a3a(0x1e2)](_0x1ac0c0,_0x562d6c[_0x5c6a3a(0x30f)]);},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x1e2)]=function(_0x2ff77c,_0x3a3e5f){const _0x2d08d7=_0x2a5a53;if(_0x3a3e5f<=0x0)return;const _0x3c8ebe=VisuMZ[_0x2d08d7(0x283)][_0x2d08d7(0x2c2)][_0x2d08d7(0x215)]['TextColor'+_0x3a3e5f];let _0x51db6b=_0x2ff77c[_0x2d08d7(0x25e)][_0x2d08d7(0x352)]();if(/^\d+$/[_0x2d08d7(0x2da)](_0x51db6b))return;if(VisuMZ[_0x2d08d7(0x283)][_0x2d08d7(0x2d7)][_0x2d08d7(0x2c7)](_0x51db6b[_0x2d08d7(0x1bd)]()))return;_0x51db6b=_0x51db6b[_0x2d08d7(0x1ea)](/\\I\[(\d+)\]/gi,''),_0x51db6b=_0x51db6b[_0x2d08d7(0x1ea)](/\x1bI\[(\d+)\]/gi,'');if(_0x51db6b[_0x2d08d7(0x3a8)]<=0x0)return;if(_0x51db6b['match'](/-----/i))return;_0x3c8ebe[_0x2d08d7(0x26f)](_0x51db6b);},SceneManager[_0x2a5a53(0x24a)]=function(){const _0x10c9dc=_0x2a5a53;return this[_0x10c9dc(0x202)]&&this['_scene'][_0x10c9dc(0x290)]===Scene_Battle;},SceneManager[_0x2a5a53(0x2e9)]=function(){const _0x50d50e=_0x2a5a53;return this[_0x50d50e(0x202)]&&this['_scene']['constructor']===Scene_Map;},VisuMZ['MessageCore'][_0x2a5a53(0x1d5)]=TextManager['message'],TextManager[_0x2a5a53(0x31c)]=function(_0x1dc128){const _0x219e65=_0x2a5a53,_0x34d104=[_0x219e65(0x236),_0x219e65(0x210),_0x219e65(0x260),'surprise',_0x219e65(0x313),_0x219e65(0x38a),_0x219e65(0x1c9),'obtainExp',_0x219e65(0x24d),_0x219e65(0x220)];let _0x226458=VisuMZ[_0x219e65(0x283)][_0x219e65(0x1d5)][_0x219e65(0x222)](this,_0x1dc128);return _0x34d104['includes'](_0x1dc128)&&(_0x226458=_0x219e65(0x340)+_0x226458),_0x226458;},ConfigManager['textSpeed']=VisuMZ[_0x2a5a53(0x283)]['Settings']['TextSpeed'][_0x2a5a53(0x1d7)],VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x390)]=ConfigManager[_0x2a5a53(0x2fd)],ConfigManager['makeData']=function(){const _0x189b16=_0x2a5a53,_0x7f5cf3=VisuMZ[_0x189b16(0x283)]['ConfigManager_makeData'][_0x189b16(0x222)](this);return _0x7f5cf3[_0x189b16(0x360)]=this['textSpeed'],_0x7f5cf3;},VisuMZ[_0x2a5a53(0x283)]['ConfigManager_applyData']=ConfigManager[_0x2a5a53(0x256)],ConfigManager[_0x2a5a53(0x256)]=function(_0x1e7119){const _0x151d35=_0x2a5a53;VisuMZ[_0x151d35(0x283)][_0x151d35(0x2a7)][_0x151d35(0x222)](this,_0x1e7119),'textSpeed'in _0x1e7119?this[_0x151d35(0x360)]=Number(_0x1e7119['textSpeed'])[_0x151d35(0x293)](0x1,0xb):this['textSpeed']=VisuMZ['MessageCore']['Settings'][_0x151d35(0x267)][_0x151d35(0x1d7)];},TextManager[_0x2a5a53(0x2c8)]=VisuMZ['MessageCore'][_0x2a5a53(0x2c2)]['TextSpeed'][_0x2a5a53(0x279)],TextManager[_0x2a5a53(0x3a1)]=VisuMZ[_0x2a5a53(0x283)]['Settings'][_0x2a5a53(0x267)][_0x2a5a53(0x1d1)],VisuMZ['MessageCore'][_0x2a5a53(0x329)]=Game_System[_0x2a5a53(0x1f8)][_0x2a5a53(0x21a)],Game_System['prototype'][_0x2a5a53(0x21a)]=function(){const _0x39c894=_0x2a5a53;VisuMZ[_0x39c894(0x283)]['Game_System_initialize'][_0x39c894(0x222)](this),this['initMessageCore']();},Game_System['prototype'][_0x2a5a53(0x388)]=function(){const _0x1720c8=_0x2a5a53,_0x363e1f=VisuMZ[_0x1720c8(0x283)][_0x1720c8(0x2c2)][_0x1720c8(0x336)],_0x4eaf6a=VisuMZ[_0x1720c8(0x283)][_0x1720c8(0x2c2)][_0x1720c8(0x289)];this['_MessageCoreSettings']={'messageRows':_0x363e1f['MessageRows'],'messageWidth':_0x363e1f[_0x1720c8(0x2ee)],'messageWordWrap':_0x4eaf6a['MessageWindow'],'helpWordWrap':_0x4eaf6a[_0x1720c8(0x315)],'choiceLineHeight':_0x363e1f[_0x1720c8(0x2b2)],'choiceRows':_0x363e1f[_0x1720c8(0x2c4)],'choiceCols':_0x363e1f[_0x1720c8(0x2c5)],'choiceTextAlign':_0x363e1f[_0x1720c8(0x32c)]};},Game_System[_0x2a5a53(0x1f8)][_0x2a5a53(0x1b2)]=function(){const _0x4b2bad=_0x2a5a53;if(this[_0x4b2bad(0x339)]===undefined)this['initMessageCore']();if(this[_0x4b2bad(0x339)][_0x4b2bad(0x2e5)]===undefined)this['initMessageCore']();return this[_0x4b2bad(0x339)][_0x4b2bad(0x2e5)];},Game_System[_0x2a5a53(0x1f8)][_0x2a5a53(0x324)]=function(_0x1c38af){const _0x1b521c=_0x2a5a53;if(this[_0x1b521c(0x339)]===undefined)this[_0x1b521c(0x388)]();if(this[_0x1b521c(0x339)][_0x1b521c(0x2e5)]===undefined)this[_0x1b521c(0x388)]();this[_0x1b521c(0x339)][_0x1b521c(0x2e5)]=_0x1c38af||0x1;},Game_System[_0x2a5a53(0x1f8)][_0x2a5a53(0x1f3)]=function(){const _0x785e16=_0x2a5a53;if(this['_MessageCoreSettings']===undefined)this[_0x785e16(0x388)]();if(this[_0x785e16(0x339)][_0x785e16(0x2f0)]===undefined)this[_0x785e16(0x388)]();return this[_0x785e16(0x339)][_0x785e16(0x2f0)];},Game_System[_0x2a5a53(0x1f8)]['setMessageWindowWidth']=function(_0x535f13){const _0x5f4677=_0x2a5a53;if(this[_0x5f4677(0x339)]===undefined)this[_0x5f4677(0x388)]();if(this[_0x5f4677(0x339)][_0x5f4677(0x2f0)]===undefined)this['initMessageCore']();this['_MessageCoreSettings']['messageWidth']=_0x535f13||0x1;},Game_System[_0x2a5a53(0x1f8)][_0x2a5a53(0x2ef)]=function(){const _0x106eb5=_0x2a5a53;if(this['_MessageCoreSettings']===undefined)this[_0x106eb5(0x388)]();if(this['_MessageCoreSettings'][_0x106eb5(0x32e)]===undefined)this[_0x106eb5(0x388)]();return this[_0x106eb5(0x339)][_0x106eb5(0x32e)];},Game_System[_0x2a5a53(0x1f8)][_0x2a5a53(0x1fa)]=function(_0x419332){const _0x1fe863=_0x2a5a53;if(this[_0x1fe863(0x339)]===undefined)this[_0x1fe863(0x388)]();if(this[_0x1fe863(0x339)][_0x1fe863(0x32e)]===undefined)this['initMessageCore']();this['_MessageCoreSettings'][_0x1fe863(0x32e)]=_0x419332;},Game_System[_0x2a5a53(0x1f8)][_0x2a5a53(0x330)]=function(){const _0x3f8a6e=_0x2a5a53;if(this['_MessageCoreSettings']===undefined)this[_0x3f8a6e(0x388)]();if(this['_MessageCoreSettings'][_0x3f8a6e(0x1d3)]===undefined)this[_0x3f8a6e(0x388)]();return this['_MessageCoreSettings'][_0x3f8a6e(0x1d3)];},Game_System[_0x2a5a53(0x1f8)][_0x2a5a53(0x1aa)]=function(_0x455c53){const _0x2414b6=_0x2a5a53;if(this['_MessageCoreSettings']===undefined)this[_0x2414b6(0x388)]();if(this['_MessageCoreSettings'][_0x2414b6(0x1d3)]===undefined)this['initMessageCore']();this[_0x2414b6(0x339)][_0x2414b6(0x1d3)]=_0x455c53;},Game_System[_0x2a5a53(0x1f8)][_0x2a5a53(0x19b)]=function(){const _0xd3e12e=_0x2a5a53;if(this[_0xd3e12e(0x339)]===undefined)this['initMessageCore']();if(this[_0xd3e12e(0x339)]['choiceLineHeight']===undefined)this[_0xd3e12e(0x388)]();return this[_0xd3e12e(0x339)][_0xd3e12e(0x196)];},Game_System[_0x2a5a53(0x1f8)]['setChoiceListLineHeight']=function(_0x459a52){const _0x292983=_0x2a5a53;if(this['_MessageCoreSettings']===undefined)this[_0x292983(0x388)]();if(this[_0x292983(0x339)]['choiceLineHeight']===undefined)this['initMessageCore']();this[_0x292983(0x339)]['choiceLineHeight']=_0x459a52||0x1;},Game_System[_0x2a5a53(0x1f8)][_0x2a5a53(0x383)]=function(){const _0x181e94=_0x2a5a53;if(this[_0x181e94(0x339)]===undefined)this[_0x181e94(0x388)]();if(this[_0x181e94(0x339)][_0x181e94(0x36b)]===undefined)this['initMessageCore']();return this[_0x181e94(0x339)][_0x181e94(0x36b)];},Game_System[_0x2a5a53(0x1f8)][_0x2a5a53(0x303)]=function(_0x18ef13){const _0x3d99f2=_0x2a5a53;if(this[_0x3d99f2(0x339)]===undefined)this[_0x3d99f2(0x388)]();if(this['_MessageCoreSettings'][_0x3d99f2(0x36b)]===undefined)this['initMessageCore']();this[_0x3d99f2(0x339)][_0x3d99f2(0x36b)]=_0x18ef13||0x1;},Game_System[_0x2a5a53(0x1f8)]['getChoiceListMaxColumns']=function(){const _0x1e49c3=_0x2a5a53;if(this[_0x1e49c3(0x339)]===undefined)this[_0x1e49c3(0x388)]();if(this[_0x1e49c3(0x339)]['choiceCols']===undefined)this[_0x1e49c3(0x388)]();return this[_0x1e49c3(0x339)][_0x1e49c3(0x24f)];},Game_System[_0x2a5a53(0x1f8)][_0x2a5a53(0x335)]=function(_0x1607e1){const _0x304fc9=_0x2a5a53;if(this[_0x304fc9(0x339)]===undefined)this[_0x304fc9(0x388)]();if(this['_MessageCoreSettings']['choiceCols']===undefined)this[_0x304fc9(0x388)]();this['_MessageCoreSettings'][_0x304fc9(0x24f)]=_0x1607e1||0x1;},Game_System[_0x2a5a53(0x1f8)][_0x2a5a53(0x3a7)]=function(){const _0x56ccb6=_0x2a5a53;if(this[_0x56ccb6(0x339)]===undefined)this['initMessageCore']();if(this['_MessageCoreSettings'][_0x56ccb6(0x2bb)]===undefined)this[_0x56ccb6(0x388)]();return this[_0x56ccb6(0x339)]['choiceTextAlign'];},Game_System['prototype'][_0x2a5a53(0x36e)]=function(_0x30b22a){const _0x5c2c00=_0x2a5a53;if(this[_0x5c2c00(0x339)]===undefined)this[_0x5c2c00(0x388)]();if(this[_0x5c2c00(0x339)][_0x5c2c00(0x2bb)]===undefined)this['initMessageCore']();this['_MessageCoreSettings'][_0x5c2c00(0x2bb)]=_0x30b22a[_0x5c2c00(0x2d1)]();},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x1e7)]=Game_Party[_0x2a5a53(0x1f8)][_0x2a5a53(0x21a)],Game_Party[_0x2a5a53(0x1f8)][_0x2a5a53(0x21a)]=function(){const _0x3212f9=_0x2a5a53;VisuMZ[_0x3212f9(0x283)][_0x3212f9(0x1e7)][_0x3212f9(0x222)](this),this[_0x3212f9(0x388)]();},Game_Party[_0x2a5a53(0x1f8)][_0x2a5a53(0x388)]=function(){this['_lastGainedItemData']={'type':0x0,'id':0x0,'quantity':0x0};},Game_Party['prototype'][_0x2a5a53(0x1de)]=function(){const _0x37f929=_0x2a5a53;if(this[_0x37f929(0x367)]===undefined)this['initMessageCore']();return this[_0x37f929(0x367)];},Game_Party[_0x2a5a53(0x1f8)][_0x2a5a53(0x23b)]=function(_0x1cffae,_0x49f21d){const _0x4b4cd0=_0x2a5a53;if(this[_0x4b4cd0(0x367)]===undefined)this[_0x4b4cd0(0x388)]();if(!_0x1cffae)return;if(DataManager[_0x4b4cd0(0x219)](_0x1cffae))this['_lastGainedItemData'][_0x4b4cd0(0x271)]=0x0;else{if(DataManager[_0x4b4cd0(0x1a0)](_0x1cffae))this[_0x4b4cd0(0x367)]['type']=0x1;else DataManager[_0x4b4cd0(0x2c0)](_0x1cffae)&&(this[_0x4b4cd0(0x367)][_0x4b4cd0(0x271)]=0x2);}this[_0x4b4cd0(0x367)]['id']=_0x1cffae['id'],this[_0x4b4cd0(0x367)]['quantity']=_0x49f21d;},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x285)]=Game_Party[_0x2a5a53(0x1f8)][_0x2a5a53(0x1f9)],Game_Party[_0x2a5a53(0x1f8)][_0x2a5a53(0x1f9)]=function(_0x541d68,_0xc6f902,_0x254f31){const _0x519aca=_0x2a5a53;VisuMZ[_0x519aca(0x283)]['Game_Party_gainItem'][_0x519aca(0x222)](this,_0x541d68,_0xc6f902,_0x254f31),_0xc6f902>0x0&&this[_0x519aca(0x23b)](_0x541d68,_0xc6f902);},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x2d2)]=Game_Map['prototype']['initialize'],Game_Map[_0x2a5a53(0x1f8)][_0x2a5a53(0x21a)]=function(){const _0x40d58a=_0x2a5a53;VisuMZ[_0x40d58a(0x283)]['Game_Map_initialize'][_0x40d58a(0x222)](this),this['_messageCommonEvents']=[];},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x35a)]=Game_Map['prototype'][_0x2a5a53(0x249)],Game_Map[_0x2a5a53(0x1f8)][_0x2a5a53(0x249)]=function(){const _0x1299fe=_0x2a5a53;VisuMZ[_0x1299fe(0x283)][_0x1299fe(0x35a)][_0x1299fe(0x222)](this),this['_messageCommonEvents']=[];},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x30e)]=Game_Map['prototype'][_0x2a5a53(0x1c6)],Game_Map[_0x2a5a53(0x1f8)][_0x2a5a53(0x1c6)]=function(){const _0x4f5e63=_0x2a5a53;VisuMZ[_0x4f5e63(0x283)][_0x4f5e63(0x30e)][_0x4f5e63(0x222)](this),this[_0x4f5e63(0x29b)]();},Game_Map['prototype'][_0x2a5a53(0x1db)]=function(_0x2b8eb8){const _0xc25edd=_0x2a5a53;this[_0xc25edd(0x1fe)]=this[_0xc25edd(0x1fe)]||[];const _0x439d0c=this[_0xc25edd(0x2d8)]['_eventId'],_0x23ce0a=new Game_MessageCommonEvent(_0x2b8eb8,_0x439d0c);this[_0xc25edd(0x1fe)]['push'](_0x23ce0a);},Game_Map[_0x2a5a53(0x1f8)][_0x2a5a53(0x29b)]=function(){const _0x5cc95f=_0x2a5a53;this[_0x5cc95f(0x1fe)]=this['_messageCommonEvents']||[];for(const _0x32f9eb of this[_0x5cc95f(0x1fe)]){!_0x32f9eb[_0x5cc95f(0x2d8)]?this['_messageCommonEvents'][_0x5cc95f(0x37c)](_0x32f9eb):_0x32f9eb['update']();}},Game_Interpreter[_0x2a5a53(0x1f8)][_0x2a5a53(0x1f4)]=function(_0x1964ab){const _0x52453a=_0x2a5a53;if($gameMessage[_0x52453a(0x213)]())return![];return this['prepareShowTextCommand'](_0x1964ab),this[_0x52453a(0x3b9)](_0x1964ab),this['prepareShowTextFollowups'](_0x1964ab),this['setWaitMode']('message'),!![];},Game_Interpreter['prototype'][_0x2a5a53(0x2df)]=function(_0x2f12e3){const _0x2d4c67=_0x2a5a53;$gameMessage[_0x2d4c67(0x332)](_0x2f12e3[0x0],_0x2f12e3[0x1]),$gameMessage[_0x2d4c67(0x1d9)](_0x2f12e3[0x2]),$gameMessage[_0x2d4c67(0x1df)](_0x2f12e3[0x3]),$gameMessage[_0x2d4c67(0x1a5)](_0x2f12e3[0x4]);},Game_Interpreter[_0x2a5a53(0x1f8)]['addContinuousShowTextCommands']=function(_0x3535dd){const _0x370164=_0x2a5a53;while(this['isContinuePrepareShowTextCommands']()){this[_0x370164(0x3aa)]++;this[_0x370164(0x1cb)]()[_0x370164(0x302)]===0x191&&$gameMessage['add'](this[_0x370164(0x1cb)]()[_0x370164(0x2f9)][0x0]);if(this[_0x370164(0x22a)]())break;}},Game_Interpreter[_0x2a5a53(0x1f8)][_0x2a5a53(0x284)]=function(){const _0x3368ba=_0x2a5a53;return this['nextEventCode']()===0x65&&$gameSystem[_0x3368ba(0x1b2)]()>0x4?!![]:this['nextEventCode']()===0x191;},Game_Interpreter[_0x2a5a53(0x1f8)]['isBreakShowTextCommands']=function(){const _0x377b11=_0x2a5a53;return $gameMessage[_0x377b11(0x281)][_0x377b11(0x3a8)]>=$gameSystem[_0x377b11(0x1b2)]()&&this[_0x377b11(0x2bc)]()!==0x191;},Game_Interpreter[_0x2a5a53(0x1f8)][_0x2a5a53(0x212)]=function(_0x54ac54){const _0xebc8a9=_0x2a5a53;switch(this['nextEventCode']()){case 0x66:this[_0xebc8a9(0x3aa)]++,this[_0xebc8a9(0x35b)](this['currentCommand']()['parameters']);break;case 0x67:this[_0xebc8a9(0x3aa)]++,this[_0xebc8a9(0x26b)](this[_0xebc8a9(0x1cb)]()[_0xebc8a9(0x2f9)]);break;case 0x68:this[_0xebc8a9(0x3aa)]++,this[_0xebc8a9(0x227)](this['currentCommand']()[_0xebc8a9(0x2f9)]);break;}},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x1e3)]=Game_Interpreter[_0x2a5a53(0x1f8)][_0x2a5a53(0x35b)],Game_Interpreter[_0x2a5a53(0x1f8)]['setupChoices']=function(_0x374698){const _0x237b8c=_0x2a5a53;_0x374698=this['addContinuousShowChoices'](),VisuMZ[_0x237b8c(0x283)]['Game_Interpreter_setupChoices'][_0x237b8c(0x222)](this,_0x374698);},Game_Interpreter[_0x2a5a53(0x1f8)][_0x2a5a53(0x296)]=function(){const _0x32b339=_0x2a5a53,_0x1af062=this[_0x32b339(0x3aa)],_0x15a187=[];let _0x135bd3=0x0;this[_0x32b339(0x3aa)]++;while(this[_0x32b339(0x3aa)]<this[_0x32b339(0x209)][_0x32b339(0x3a8)]){if(this['currentCommand']()['indent']===this[_0x32b339(0x2e3)]){if(this[_0x32b339(0x1cb)]()[_0x32b339(0x302)]===0x194&&this[_0x32b339(0x2bc)]()!==0x66)break;else{if(this[_0x32b339(0x1cb)]()[_0x32b339(0x302)]===0x66)this[_0x32b339(0x228)](_0x135bd3,this[_0x32b339(0x1cb)](),_0x1af062),this[_0x32b339(0x3aa)]-=0x2;else this[_0x32b339(0x1cb)]()[_0x32b339(0x302)]===0x192&&(this[_0x32b339(0x1cb)]()[_0x32b339(0x2f9)][0x0]=_0x135bd3,_0x135bd3++);}}this['_index']++;}return this[_0x32b339(0x3aa)]=_0x1af062,this['currentCommand']()['parameters'];},Game_Interpreter[_0x2a5a53(0x1f8)][_0x2a5a53(0x228)]=function(_0xb93971,_0x17234a,_0x34b4ea){const _0x1b1ea6=_0x2a5a53;this[_0x1b1ea6(0x207)](_0xb93971,_0x17234a,_0x34b4ea),this['adjustShowChoiceCancel'](_0xb93971,_0x17234a,_0x34b4ea),this['addExtraShowChoices'](_0x17234a,_0x34b4ea);},Game_Interpreter[_0x2a5a53(0x1f8)][_0x2a5a53(0x207)]=function(_0x40e652,_0x4f331b,_0x2c398b){const _0x566db5=_0x2a5a53;if(_0x4f331b[_0x566db5(0x2f9)][0x2]<0x0)return;const _0x48e602=_0x4f331b[_0x566db5(0x2f9)][0x2]+_0x40e652;this[_0x566db5(0x209)][_0x2c398b]['parameters'][0x2]=_0x48e602;},Game_Interpreter['prototype']['adjustShowChoiceCancel']=function(_0x497106,_0x3c1176,_0x4b37bd){const _0x20bd59=_0x2a5a53;if(_0x3c1176['parameters'][0x1]>=0x0){var _0x9b038f=_0x3c1176[_0x20bd59(0x2f9)][0x1]+_0x497106;this[_0x20bd59(0x209)][_0x4b37bd]['parameters'][0x1]=_0x9b038f;}else _0x3c1176[_0x20bd59(0x2f9)][0x1]===-0x2&&(this[_0x20bd59(0x209)][_0x4b37bd][_0x20bd59(0x2f9)][0x1]=_0x3c1176['parameters'][0x1]);},Game_Interpreter['prototype'][_0x2a5a53(0x2cf)]=function(_0x5577c9,_0xe020f3){const _0x24ccea=_0x2a5a53;for(const _0x2798ce of _0x5577c9[_0x24ccea(0x2f9)][0x0]){this[_0x24ccea(0x209)][_0xe020f3][_0x24ccea(0x2f9)][0x0][_0x24ccea(0x26f)](_0x2798ce);}this[_0x24ccea(0x209)]['splice'](this['_index']-0x1,0x2);};function Game_MessageCommonEvent(){this['initialize'](...arguments);}Game_MessageCommonEvent[_0x2a5a53(0x1f8)][_0x2a5a53(0x21a)]=function(_0x1b9704,_0x2de91b){const _0x4be121=_0x2a5a53;this['_commonEventId']=_0x1b9704,this[_0x4be121(0x282)]=_0x2de91b||0x0,this['refresh']();},Game_MessageCommonEvent[_0x2a5a53(0x1f8)][_0x2a5a53(0x2ce)]=function(){return $dataCommonEvents[this['_commonEventId']];},Game_MessageCommonEvent['prototype'][_0x2a5a53(0x3a2)]=function(){const _0x233b71=_0x2a5a53;return this[_0x233b71(0x2ce)]()[_0x233b71(0x3a2)];},Game_MessageCommonEvent['prototype']['refresh']=function(){const _0x66bbd1=_0x2a5a53;this[_0x66bbd1(0x2d8)]=new Game_Interpreter(),this['_interpreter'][_0x66bbd1(0x258)](this[_0x66bbd1(0x3a2)](),this[_0x66bbd1(0x282)]);},Game_MessageCommonEvent['prototype'][_0x2a5a53(0x353)]=function(){const _0x58a0bc=_0x2a5a53;this[_0x58a0bc(0x2d8)]&&(this[_0x58a0bc(0x2d8)]['isRunning']()?this[_0x58a0bc(0x2d8)][_0x58a0bc(0x353)]():this[_0x58a0bc(0x2cc)]());},Game_MessageCommonEvent[_0x2a5a53(0x1f8)]['clear']=function(){const _0x3cf967=_0x2a5a53;this[_0x3cf967(0x2d8)]=null;},Scene_Message['prototype'][_0x2a5a53(0x27d)]=function(){const _0x44742f=_0x2a5a53,_0x17bc57=Math[_0x44742f(0x238)](Graphics[_0x44742f(0x305)],$gameSystem[_0x44742f(0x1f3)]()),_0x26ed7a=$gameSystem[_0x44742f(0x1b2)](),_0x15b32b=this[_0x44742f(0x2c9)](_0x26ed7a,![]),_0xe6db33=(Graphics['boxWidth']-_0x17bc57)/0x2,_0x147e91=0x0;return new Rectangle(_0xe6db33,_0x147e91,_0x17bc57,_0x15b32b);},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x2b9)]=Scene_Options[_0x2a5a53(0x1f8)][_0x2a5a53(0x3a5)],Scene_Options['prototype'][_0x2a5a53(0x3a5)]=function(){const _0x1de133=_0x2a5a53;let _0x583742=VisuMZ[_0x1de133(0x283)][_0x1de133(0x2b9)][_0x1de133(0x222)](this);const _0x5af972=VisuMZ[_0x1de133(0x283)]['Settings'];if(_0x5af972[_0x1de133(0x267)][_0x1de133(0x1bc)]&&_0x5af972[_0x1de133(0x267)][_0x1de133(0x1da)])_0x583742++;return _0x583742;},VisuMZ['MessageCore'][_0x2a5a53(0x201)]=Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x21a)],Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x21a)]=function(_0x3c8600){const _0x93cbea=_0x2a5a53;this[_0x93cbea(0x388)](_0x3c8600),VisuMZ[_0x93cbea(0x283)][_0x93cbea(0x201)][_0x93cbea(0x222)](this,_0x3c8600);},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x388)]=function(_0x3b67aa){const _0x38bbbe=_0x2a5a53;this['initTextAlignement'](),this[_0x38bbbe(0x2af)](),this[_0x38bbbe(0x1a9)](_0x3b67aa);},Window_Base['prototype']['initTextAlignement']=function(){this['setTextAlignment']('default');},Window_Base['prototype'][_0x2a5a53(0x275)]=function(_0x2ecfff){const _0x105f86=_0x2a5a53;this[_0x105f86(0x29a)]=_0x2ecfff;},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x18d)]=function(){const _0x51e14a=_0x2a5a53;return this[_0x51e14a(0x29a)];},VisuMZ['MessageCore'][_0x2a5a53(0x2b0)]=Window_Base['prototype'][_0x2a5a53(0x233)],Window_Base['prototype'][_0x2a5a53(0x233)]=function(_0x16c648){const _0x1a4e24=_0x2a5a53;return this['resetWordWrap'](),VisuMZ['MessageCore'][_0x1a4e24(0x2b0)][_0x1a4e24(0x222)](this,_0x16c648);},VisuMZ['MessageCore'][_0x2a5a53(0x38e)]=Window_Base['prototype']['processAllText'],Window_Base['prototype'][_0x2a5a53(0x26d)]=function(_0x58b651){const _0x1df42c=_0x2a5a53;VisuMZ[_0x1df42c(0x283)][_0x1df42c(0x38e)][_0x1df42c(0x222)](this,_0x58b651);if(_0x58b651[_0x1df42c(0x223)])this['setTextAlignment'](_0x1df42c(0x1f0));},Window_Base['prototype'][_0x2a5a53(0x2af)]=function(){this['setWordWrap'](![]);},Window_Base['prototype'][_0x2a5a53(0x203)]=function(){const _0x15b2a6=_0x2a5a53;return this[_0x15b2a6(0x232)];},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x381)]=function(_0x5a0953){const _0x19a107=_0x2a5a53;return this[_0x19a107(0x232)]=_0x5a0953,'';},Window_Base[_0x2a5a53(0x1f8)]['registerResetRect']=function(_0x42f58e){const _0x1f1d5c=_0x2a5a53;this[_0x1f1d5c(0x38f)]=JsonEx['makeDeepCopy'](_0x42f58e);},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x28e)]=function(){const _0x3f01b9=_0x2a5a53;this[_0x3f01b9(0x30a)][_0x3f01b9(0x274)]=$gameSystem[_0x3f01b9(0x2c3)](),this['contents'][_0x3f01b9(0x395)]=$gameSystem['mainFontSize'](),this[_0x3f01b9(0x30a)][_0x3f01b9(0x22f)]=![],this[_0x3f01b9(0x30a)][_0x3f01b9(0x368)]=![],this['resetTextColor']();},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x246)]=function(){const _0x158187=_0x2a5a53;this[_0x158187(0x364)](ColorManager[_0x158187(0x327)]()),this[_0x158187(0x19e)](ColorManager[_0x158187(0x1ff)]());const _0x36846a=VisuMZ['MessageCore'][_0x158187(0x2c2)][_0x158187(0x336)];_0x36846a[_0x158187(0x30d)]===undefined&&(_0x36846a[_0x158187(0x30d)]=0x3),this['contents']['outlineWidth']=_0x36846a[_0x158187(0x30d)],this['setColorLock'](![]);},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x370)]=function(_0x14fe24){const _0x23abde=_0x2a5a53;this[_0x23abde(0x1c1)]=_0x14fe24;},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x18f)]=function(){const _0x4972d4=_0x2a5a53;return this[_0x4972d4(0x1c1)];},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x307)]=function(){return![];},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x312)]=function(){const _0x4fc0b5=_0x2a5a53,_0x162a0c=[_0x4fc0b5(0x274),_0x4fc0b5(0x395),'fontBold','fontItalic',_0x4fc0b5(0x2dd),_0x4fc0b5(0x22b),_0x4fc0b5(0x192),_0x4fc0b5(0x291)];let _0x482b6f={};for(const _0xa8dc43 of _0x162a0c){_0x482b6f[_0xa8dc43]=this['contents'][_0xa8dc43];}return _0x482b6f;},Window_Base[_0x2a5a53(0x1f8)]['returnPreservedFontSettings']=function(_0xe47802){const _0x13c78f=_0x2a5a53;for(const _0x2cc0d9 in _0xe47802){this[_0x13c78f(0x30a)][_0x2cc0d9]=_0xe47802[_0x2cc0d9];}},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x2ea)]=Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x353)],Window_Base['prototype'][_0x2a5a53(0x353)]=function(){const _0x38e7be=_0x2a5a53;VisuMZ[_0x38e7be(0x283)][_0x38e7be(0x2ea)]['call'](this),this[_0x38e7be(0x1e9)]();},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x32d)]=function(){return![];},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x1e9)]=function(){const _0x5a998f=_0x2a5a53;this[_0x5a998f(0x1b0)]>0x0&&(this[_0x5a998f(0x32d)]()&&(this['x']=this['applyMoveEasing'](this['x'],this[_0x5a998f(0x23a)]),this['y']=this['applyMoveEasing'](this['y'],this[_0x5a998f(0x3b7)]),this[_0x5a998f(0x305)]=this[_0x5a998f(0x2db)](this[_0x5a998f(0x305)],this[_0x5a998f(0x2d5)]),this[_0x5a998f(0x354)]=this[_0x5a998f(0x2db)](this['height'],this[_0x5a998f(0x334)]),this[_0x5a998f(0x2d3)]()),this['_moveDuration']--);},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x2d3)]=function(_0x5062e9,_0x28c0a9){const _0x1348d4=_0x2a5a53;!_0x5062e9&&(this[_0x1348d4(0x305)]=Math['min'](this[_0x1348d4(0x305)],Graphics['width']),this[_0x1348d4(0x354)]=Math[_0x1348d4(0x238)](this[_0x1348d4(0x354)],Graphics['height']));if(!_0x28c0a9){const _0x2048d3=-(Math[_0x1348d4(0x1d4)](Graphics[_0x1348d4(0x305)]-Graphics[_0x1348d4(0x344)])/0x2),_0x27b4ea=_0x2048d3+Graphics[_0x1348d4(0x305)]-this['width'],_0x1eea7d=-(Math[_0x1348d4(0x1d4)](Graphics[_0x1348d4(0x354)]-Graphics[_0x1348d4(0x2e0)])/0x2),_0x4efb52=_0x1eea7d+Graphics[_0x1348d4(0x354)]-this[_0x1348d4(0x354)];this['x']=this['x']['clamp'](_0x2048d3,_0x27b4ea),this['y']=this['y'][_0x1348d4(0x293)](_0x1eea7d,_0x4efb52);}},Window_Base[_0x2a5a53(0x1f8)]['applyMoveEasing']=function(_0x305950,_0x6b6fb8){const _0x2abb30=_0x2a5a53,_0x23f8d1=this[_0x2abb30(0x1b0)],_0x5e5f85=this[_0x2abb30(0x301)],_0x4c7a6d=this[_0x2abb30(0x3b3)]((_0x5e5f85-_0x23f8d1)/_0x5e5f85),_0x4cf904=this[_0x2abb30(0x3b3)]((_0x5e5f85-_0x23f8d1+0x1)/_0x5e5f85),_0x2597de=(_0x305950-_0x6b6fb8*_0x4c7a6d)/(0x1-_0x4c7a6d);return _0x2597de+(_0x6b6fb8-_0x2597de)*_0x4cf904;},Window_Base[_0x2a5a53(0x1f8)]['calcMoveEasing']=function(_0x2756f3){const _0x197cd6=_0x2a5a53,_0x26fdfe=0x2;switch(this[_0x197cd6(0x1f2)]){case 0x0:return _0x2756f3;case 0x1:return this[_0x197cd6(0x1ab)](_0x2756f3,_0x26fdfe);case 0x2:return this[_0x197cd6(0x25a)](_0x2756f3,_0x26fdfe);case 0x3:return this['easeInOut'](_0x2756f3,_0x26fdfe);default:return Imported[_0x197cd6(0x18b)]?VisuMZ[_0x197cd6(0x2db)](_0x2756f3,this[_0x197cd6(0x1f2)]):_0x2756f3;}},Window_Base['prototype'][_0x2a5a53(0x252)]=function(_0x3134aa,_0x2221df,_0x2ffadd,_0x24ab1f,_0x43d394,_0x3659fd){const _0x3f6d7b=_0x2a5a53;this[_0x3f6d7b(0x23a)]=_0x3134aa,this[_0x3f6d7b(0x3b7)]=_0x2221df,this['_moveTargetWidth']=_0x2ffadd||this['width'],this[_0x3f6d7b(0x334)]=_0x24ab1f||this[_0x3f6d7b(0x354)],this[_0x3f6d7b(0x1b0)]=_0x43d394||0x1;if(this[_0x3f6d7b(0x1b0)]<=0x0)this['_moveDuration']=0x1;this[_0x3f6d7b(0x301)]=this[_0x3f6d7b(0x1b0)],this[_0x3f6d7b(0x1f2)]=_0x3659fd||0x0;},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x1d2)]=function(_0x49fe72,_0x302d6b,_0x20105b,_0xcaf04a,_0x59b2d7,_0x374984){const _0xd5efa3=_0x2a5a53;this['_moveTargetX']=this['x']+_0x49fe72,this[_0xd5efa3(0x3b7)]=this['y']+_0x302d6b,this[_0xd5efa3(0x2d5)]=this[_0xd5efa3(0x305)]+(_0x20105b||0x0),this['_moveTargetHeight']=this['height']+(_0xcaf04a||0x0),this[_0xd5efa3(0x1b0)]=_0x59b2d7||0x1;if(this[_0xd5efa3(0x1b0)]<=0x0)this[_0xd5efa3(0x1b0)]=0x1;this[_0xd5efa3(0x301)]=this['_moveDuration'],this[_0xd5efa3(0x1f2)]=_0x374984||0x0;},Window_Base[_0x2a5a53(0x1f8)]['resetRect']=function(_0x3d32c4,_0x1a1bae){const _0x3350e2=_0x2a5a53;this[_0x3350e2(0x252)](this[_0x3350e2(0x38f)]['x'],this['_resetRect']['y'],this[_0x3350e2(0x38f)][_0x3350e2(0x305)],this['_resetRect'][_0x3350e2(0x354)],_0x3d32c4,_0x1a1bae);},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x1d0)]=Window_Base[_0x2a5a53(0x1f8)]['changeTextColor'],Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x364)]=function(_0x3d5c68){const _0x51d3c3=_0x2a5a53;if(this[_0x51d3c3(0x18f)]())return;_0x3d5c68=_0x3d5c68['replace'](/\,/g,''),this[_0x51d3c3(0x1d8)]=this[_0x51d3c3(0x1d8)]||[],this[_0x51d3c3(0x1d8)][_0x51d3c3(0x2aa)](this['contents'][_0x51d3c3(0x2dd)]),VisuMZ[_0x51d3c3(0x283)]['Window_Base_changeTextColor'][_0x51d3c3(0x222)](this,_0x3d5c68);},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x348)]=function(_0xe22ffc){const _0x28fb40=_0x2a5a53;this[_0x28fb40(0x2a9)](_0xe22ffc);if(this['isColorLocked']())return;_0xe22ffc[_0x28fb40(0x223)]&&(this['_textColorStack']=this[_0x28fb40(0x1d8)]||[],this[_0x28fb40(0x30a)][_0x28fb40(0x2dd)]=this['_textColorStack'][_0x28fb40(0x294)]()||ColorManager[_0x28fb40(0x327)]());},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x322)]=function(_0xb32beb){const _0x45eee0=_0x2a5a53;return _0xb32beb=this[_0x45eee0(0x2b6)](_0xb32beb),_0xb32beb=this[_0x45eee0(0x331)](_0xb32beb),_0xb32beb=this[_0x45eee0(0x18c)](_0xb32beb),_0xb32beb=this[_0x45eee0(0x397)](_0xb32beb),_0xb32beb=this['convertShowChoiceEscapeCodes'](_0xb32beb),_0xb32beb=this[_0x45eee0(0x3a4)](_0xb32beb),_0xb32beb=this[_0x45eee0(0x23c)](_0xb32beb),_0xb32beb=this[_0x45eee0(0x35e)](_0xb32beb),_0xb32beb=this[_0x45eee0(0x2b5)](_0xb32beb),_0xb32beb=this[_0x45eee0(0x2b4)](_0xb32beb),_0xb32beb=this[_0x45eee0(0x3ad)](_0xb32beb),_0xb32beb=this[_0x45eee0(0x319)](_0xb32beb),_0xb32beb=this[_0x45eee0(0x18c)](_0xb32beb),_0xb32beb=this[_0x45eee0(0x338)](_0xb32beb),_0xb32beb=this[_0x45eee0(0x349)](_0xb32beb),_0xb32beb;},Window_Base['prototype']['convertTextMacros']=function(_0x12e963){const _0x5f081f=_0x2a5a53;for(const _0x8f8514 of VisuMZ[_0x5f081f(0x283)][_0x5f081f(0x2c2)][_0x5f081f(0x3a3)]){_0x12e963[_0x5f081f(0x2be)](_0x8f8514[_0x5f081f(0x1ed)])&&(_0x12e963=_0x12e963[_0x5f081f(0x1ea)](_0x8f8514['textCodeCheck'],_0x8f8514[_0x5f081f(0x1f7)]['bind'](this)));}return _0x12e963;},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x331)]=function(_0xe9518){const _0x52e89e=_0x2a5a53;return _0xe9518=_0xe9518[_0x52e89e(0x1ea)](/\\/g,'\x1b'),_0xe9518=_0xe9518[_0x52e89e(0x1ea)](/\x1b\x1b/g,'\x5c'),_0xe9518;},Window_Base[_0x2a5a53(0x1f8)]['convertVariableEscapeCharacters']=function(_0x5e46aa){const _0x6cc2d4=_0x2a5a53;for(;;){if(_0x5e46aa['match'](/\\V\[(\d+)\]/gi))_0x5e46aa=_0x5e46aa[_0x6cc2d4(0x1ea)](/\\V\[(\d+)\]/gi,(_0x3405e2,_0x458bf3)=>this[_0x6cc2d4(0x331)](String($gameVariables[_0x6cc2d4(0x34e)](parseInt(_0x458bf3)))));else{if(_0x5e46aa[_0x6cc2d4(0x2be)](/\x1bV\[(\d+)\]/gi))_0x5e46aa=_0x5e46aa[_0x6cc2d4(0x1ea)](/\x1bV\[(\d+)\]/gi,(_0x1da0a3,_0xf66593)=>this[_0x6cc2d4(0x331)](String($gameVariables['value'](parseInt(_0xf66593)))));else break;}}return _0x5e46aa;},Window_Base[_0x2a5a53(0x1f8)]['preConvertEscapeCharacters']=function(_0x34bf4f){return this['registerActorNameAutoColorChanges'](),_0x34bf4f;},Window_Base[_0x2a5a53(0x1f8)]['postConvertEscapeCharacters']=function(_0x16183d){return _0x16183d;},Window_Base['prototype']['convertShowChoiceEscapeCodes']=function(_0x4030b5){const _0x716b14=_0x2a5a53;return _0x4030b5=_0x4030b5[_0x716b14(0x1ea)](/<(?:SHOW|HIDE|DISABLE|ENABLE)>/i,''),_0x4030b5=_0x4030b5[_0x716b14(0x1ea)](/<(?:SHOW|HIDE|DISABLE|ENABLE)[ ](?:SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i,''),_0x4030b5=_0x4030b5[_0x716b14(0x1ea)](/<(?:SHOW|HIDE|DISABLE|ENABLE)[ ](?:ALL|ANY)[ ](?:SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i,''),_0x4030b5;},Window_Base['prototype'][_0x2a5a53(0x3a4)]=function(_0xe1a271){const _0x3c6ae1=_0x2a5a53;return _0xe1a271=_0xe1a271['replace'](/<B>/gi,_0x3c6ae1(0x1f6)),_0xe1a271=_0xe1a271['replace'](/<\/B>/gi,_0x3c6ae1(0x1a3)),_0xe1a271=_0xe1a271[_0x3c6ae1(0x1ea)](/<I>/gi,_0x3c6ae1(0x1ef)),_0xe1a271=_0xe1a271['replace'](/<\/I>/gi,_0x3c6ae1(0x31e)),_0xe1a271;},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x23c)]=function(_0xd0c1fd){const _0x54a244=_0x2a5a53;return _0xd0c1fd=_0xd0c1fd['replace'](/<LEFT>/gi,_0x54a244(0x21b)),_0xd0c1fd=_0xd0c1fd['replace'](/<\/LEFT>/gi,'\x1bTEXTALIGNMENT[0]'),_0xd0c1fd=_0xd0c1fd[_0x54a244(0x1ea)](/<CENTER>/gi,_0x54a244(0x361)),_0xd0c1fd=_0xd0c1fd[_0x54a244(0x1ea)](/<\/CENTER>/gi,_0x54a244(0x365)),_0xd0c1fd=_0xd0c1fd[_0x54a244(0x1ea)](/<RIGHT>/gi,_0x54a244(0x1a1)),_0xd0c1fd=_0xd0c1fd[_0x54a244(0x1ea)](/<\/RIGHT>/gi,_0x54a244(0x365)),_0xd0c1fd;},Window_Base['prototype'][_0x2a5a53(0x35e)]=function(_0x430c92){const _0x159cf0=_0x2a5a53;return _0x430c92=_0x430c92[_0x159cf0(0x1ea)](/<COLORLOCK>/gi,_0x159cf0(0x23d)),_0x430c92=_0x430c92[_0x159cf0(0x1ea)](/<\/COLORLOCK>/gi,_0x159cf0(0x32a)),_0x430c92=_0x430c92[_0x159cf0(0x1ea)](/\(\(\(/gi,_0x159cf0(0x23d)),_0x430c92=_0x430c92[_0x159cf0(0x1ea)](/\)\)\)/gi,'\x1bCOLORLOCK[0]'),_0x430c92;},Window_Base['prototype'][_0x2a5a53(0x2b5)]=function(_0x43791c){const _0x595d08=_0x2a5a53;return _0x43791c=_0x43791c['replace'](/\x1bN\[(\d+)\]/gi,(_0x563f24,_0x1f46a3)=>this['actorName'](parseInt(_0x1f46a3))),_0x43791c=_0x43791c[_0x595d08(0x1ea)](/\x1bP\[(\d+)\]/gi,(_0x474a7c,_0x23022e)=>this[_0x595d08(0x326)](parseInt(_0x23022e))),_0x43791c=_0x43791c[_0x595d08(0x1ea)](/\x1bG/gi,TextManager[_0x595d08(0x189)]),_0x43791c;},Window_Base['prototype'][_0x2a5a53(0x2b4)]=function(_0x3ff5d1){const _0x245e11=_0x2a5a53;for(const _0x3ef4cc of VisuMZ[_0x245e11(0x283)][_0x245e11(0x2c2)][_0x245e11(0x356)]){_0x3ff5d1[_0x245e11(0x2be)](_0x3ef4cc[_0x245e11(0x1ed)])&&(_0x3ff5d1=_0x3ff5d1[_0x245e11(0x1ea)](_0x3ef4cc[_0x245e11(0x1ed)],_0x3ef4cc[_0x245e11(0x1f7)]),_0x3ff5d1=this[_0x245e11(0x18c)](_0x3ff5d1));}return _0x3ff5d1;},Window_Base['prototype'][_0x2a5a53(0x3ad)]=function(_0x4b0a57){const _0x1272c6=_0x2a5a53;for(const _0x3424b3 of VisuMZ[_0x1272c6(0x283)][_0x1272c6(0x2c2)][_0x1272c6(0x2d6)]){_0x4b0a57[_0x1272c6(0x2be)](_0x3424b3['textCodeCheck'])&&(_0x4b0a57=_0x4b0a57['replace'](_0x3424b3[_0x1272c6(0x1ed)],_0x3424b3[_0x1272c6(0x1f7)][_0x1272c6(0x1a7)](this)),_0x4b0a57=this['convertVariableEscapeCharacters'](_0x4b0a57));}return _0x4b0a57;},Window_Base['prototype'][_0x2a5a53(0x2d9)]=function(_0x331f73){const _0x5206f1=_0x2a5a53,_0x233b09=_0x331f73>=0x1?$gameActors[_0x5206f1(0x328)](_0x331f73):null,_0x10bfd1=_0x233b09?_0x233b09[_0x5206f1(0x25e)]():'',_0x1f4250=Number(VisuMZ[_0x5206f1(0x283)][_0x5206f1(0x2c2)][_0x5206f1(0x215)][_0x5206f1(0x374)]);return this['isAutoColorAffected']()&&_0x1f4250!==0x0?_0x5206f1(0x37e)[_0x5206f1(0x230)](_0x1f4250,_0x10bfd1):_0x10bfd1;},Window_Base['prototype'][_0x2a5a53(0x326)]=function(_0x1acb59){const _0x1110ba=_0x2a5a53,_0x38879f=_0x1acb59>=0x1?$gameParty[_0x1110ba(0x2c1)]()[_0x1acb59-0x1]:null,_0x14dc34=_0x38879f?_0x38879f[_0x1110ba(0x25e)]():'',_0x3a6574=Number(VisuMZ['MessageCore'][_0x1110ba(0x2c2)][_0x1110ba(0x215)][_0x1110ba(0x374)]);return this[_0x1110ba(0x307)]()&&_0x3a6574!==0x0?_0x1110ba(0x37e)[_0x1110ba(0x230)](_0x3a6574,_0x14dc34):_0x14dc34;},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x338)]=function(_0x46fe07){const _0x3da857=_0x2a5a53;return this[_0x3da857(0x307)]()&&(_0x46fe07=this[_0x3da857(0x38b)](_0x46fe07),_0x46fe07=this[_0x3da857(0x2e4)](_0x46fe07)),_0x46fe07;},Window_Base[_0x2a5a53(0x1f8)]['processStoredAutoColorChanges']=function(_0x303d47){const _0x5e0b17=_0x2a5a53;for(autoColor of VisuMZ[_0x5e0b17(0x283)][_0x5e0b17(0x218)]){_0x303d47=_0x303d47[_0x5e0b17(0x1ea)](autoColor[0x0],autoColor[0x1]);}return _0x303d47;},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x34a)]=function(){this['_autoColorActorNames']=[];},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x264)]=function(){const _0x5b9b5f=_0x2a5a53;this[_0x5b9b5f(0x34a)]();const _0x5c37c2=VisuMZ[_0x5b9b5f(0x283)][_0x5b9b5f(0x2c2)][_0x5b9b5f(0x215)],_0x4c1d86=_0x5c37c2[_0x5b9b5f(0x374)];if(_0x4c1d86<=0x0)return;for(const _0x4a14d4 of $gameActors[_0x5b9b5f(0x346)]){if(!_0x4a14d4)continue;const _0x26a305=_0x4a14d4[_0x5b9b5f(0x25e)]();if(_0x26a305['trim']()['length']<=0x0)continue;if(/^\d+$/['test'](_0x26a305))continue;if(_0x26a305[_0x5b9b5f(0x2be)](/-----/i))continue;let _0x592287=VisuMZ[_0x5b9b5f(0x283)]['ConvertTextAutoColorRegExpFriendly'](_0x26a305);const _0x48b09a=new RegExp('\x5cb'+_0x592287+'\x5cb','g'),_0x4058d1=_0x5b9b5f(0x37e)[_0x5b9b5f(0x230)](_0x4c1d86,_0x26a305);this[_0x5b9b5f(0x316)]['push']([_0x48b09a,_0x4058d1]);}},Window_Base['prototype'][_0x2a5a53(0x2e4)]=function(_0xeb3e32){const _0x1f2e71=_0x2a5a53;this[_0x1f2e71(0x316)]===undefined&&this[_0x1f2e71(0x264)]();for(autoColor of this[_0x1f2e71(0x316)]){_0xeb3e32=_0xeb3e32[_0x1f2e71(0x1ea)](autoColor[0x0],autoColor[0x1]);}return _0xeb3e32;},Window_Base['prototype'][_0x2a5a53(0x377)]=function(_0x551eb4,_0x5b46a5,_0x35c153){const _0x735a45=_0x2a5a53;if(!_0x551eb4)return'';const _0x5bdd61=_0x551eb4[_0x5b46a5];let _0x56ca31='';if(_0x5bdd61&&_0x35c153&&_0x5bdd61[_0x735a45(0x382)]){const _0x53daab='\x1bi[%1]%2';_0x56ca31=_0x53daab['format'](_0x5bdd61[_0x735a45(0x382)],_0x5bdd61[_0x735a45(0x25e)]);}else _0x5bdd61?_0x56ca31=_0x5bdd61[_0x735a45(0x25e)]:_0x56ca31='';return this[_0x735a45(0x307)]()&&(_0x56ca31=this[_0x735a45(0x224)](_0x56ca31,_0x551eb4)),_0x56ca31;},Window_Base[_0x2a5a53(0x1f8)]['lastGainedObjectName']=function(_0x343614){const _0x3ed5e9=_0x2a5a53,_0x596ff5=$gameParty['getLastGainedItemData']();if(_0x596ff5['id']<0x0)return'';let _0x2cff27=null;if(_0x596ff5[_0x3ed5e9(0x271)]===0x0)_0x2cff27=$dataItems[_0x596ff5['id']];if(_0x596ff5[_0x3ed5e9(0x271)]===0x1)_0x2cff27=$dataWeapons[_0x596ff5['id']];if(_0x596ff5[_0x3ed5e9(0x271)]===0x2)_0x2cff27=$dataArmors[_0x596ff5['id']];if(!_0x2cff27)return'';return _0x343614?'\x1bi[%1]%2'[_0x3ed5e9(0x230)](_0x2cff27['iconIndex'],_0x2cff27['name']):_0x2cff27[_0x3ed5e9(0x25e)];},Window_Base['prototype'][_0x2a5a53(0x1fd)]=function(){const _0x400b93=_0x2a5a53,_0x3d95f4=$gameParty[_0x400b93(0x1de)]();if(_0x3d95f4['id']<=0x0)return'';return _0x3d95f4['quantity'];},Window_Base['prototype'][_0x2a5a53(0x224)]=function(_0x2a5b07,_0x50680c){const _0x4b92d5=_0x2a5a53,_0x37db22=VisuMZ[_0x4b92d5(0x283)][_0x4b92d5(0x2c2)][_0x4b92d5(0x215)];let _0x4e1c79=0x0;if(_0x50680c===$dataActors)_0x4e1c79=_0x37db22[_0x4b92d5(0x374)];if(_0x50680c===$dataClasses)_0x4e1c79=_0x37db22[_0x4b92d5(0x3a9)];if(_0x50680c===$dataSkills)_0x4e1c79=_0x37db22[_0x4b92d5(0x270)];if(_0x50680c===$dataItems)_0x4e1c79=_0x37db22[_0x4b92d5(0x211)];if(_0x50680c===$dataWeapons)_0x4e1c79=_0x37db22[_0x4b92d5(0x1f5)];if(_0x50680c===$dataArmors)_0x4e1c79=_0x37db22[_0x4b92d5(0x298)];if(_0x50680c===$dataEnemies)_0x4e1c79=_0x37db22[_0x4b92d5(0x3af)];if(_0x50680c===$dataStates)_0x4e1c79=_0x37db22[_0x4b92d5(0x30f)];return _0x4e1c79>0x0&&(_0x2a5b07=_0x4b92d5(0x37e)['format'](_0x4e1c79,_0x2a5b07)),_0x2a5b07;},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x349)]=function(_0x304e13){const _0x1f781f=_0x2a5a53;_0x304e13=_0x304e13[_0x1f781f(0x1ea)](/<(?:WORDWRAP|WORD WRAP)>/gi,(_0x3e8c86,_0x5cbd81)=>this[_0x1f781f(0x381)](!![])),_0x304e13=_0x304e13[_0x1f781f(0x1ea)](/<(?:NOWORDWRAP|NO WORD WRAP)>/gi,(_0x11dd8f,_0x8a2af2)=>this['setWordWrap'](![])),_0x304e13=_0x304e13[_0x1f781f(0x1ea)](/<\/(?:WORDWRAP|WORD WRAP)>/gi,(_0x43a96c,_0x533cf0)=>this['setWordWrap'](![]));if(_0x304e13[_0x1f781f(0x2be)](Window_Message[_0x1f781f(0x37b)]))this[_0x1f781f(0x381)](![]);else _0x304e13[_0x1f781f(0x2be)](Window_Message[_0x1f781f(0x22c)])&&this[_0x1f781f(0x381)](![]);if(!this[_0x1f781f(0x203)]())return _0x304e13;if(_0x304e13[_0x1f781f(0x3a8)]<=0x0)return _0x304e13;return VisuMZ[_0x1f781f(0x283)][_0x1f781f(0x2c2)]['WordWrap'][_0x1f781f(0x25d)]?(_0x304e13=_0x304e13[_0x1f781f(0x1ea)](/[\n\r]+/g,'\x20'),_0x304e13=_0x304e13[_0x1f781f(0x1ea)](/<(?:BR|LINEBREAK)>/gi,'\x20\x0a')):(_0x304e13=_0x304e13[_0x1f781f(0x1ea)](/[\n\r]+/g,''),_0x304e13=_0x304e13[_0x1f781f(0x1ea)](/<(?:BR|LINEBREAK)>/gi,'\x0a')),_0x304e13=this[_0x1f781f(0x398)](_0x304e13),_0x304e13=_0x304e13['split']('\x20')[_0x1f781f(0x235)]('\x1bWrapBreak[0]'),_0x304e13=_0x304e13[_0x1f781f(0x1ea)](/<(?:BR|LINEBREAK)>/gi,'\x0a'),_0x304e13=_0x304e13['replace'](/<LINE\x1bWrapBreak[0]BREAK>/gi,'\x0a'),_0x304e13;},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x398)]=function(_0x3a9018){return _0x3a9018;},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x2a4)]=Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x253)],Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x253)]=function(_0x7beba5){const _0x3ea929=_0x2a5a53;VisuMZ['MessageCore'][_0x3ea929(0x2a4)][_0x3ea929(0x222)](this,_0x7beba5),this[_0x3ea929(0x38c)](_0x7beba5);},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x1ba)]=Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x39e)],Window_Base[_0x2a5a53(0x1f8)]['processControlCharacter']=function(_0x31154e,_0x2f72a8){const _0x1fd35e=_0x2a5a53;VisuMZ[_0x1fd35e(0x283)][_0x1fd35e(0x1ba)][_0x1fd35e(0x222)](this,_0x31154e,_0x2f72a8),_0x2f72a8==='\x1bWrapBreak[0]'&&this['processWrapBreak'](_0x31154e);},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x276)]=function(_0x2e949d){const _0x315e64=_0x2a5a53;var _0x33f4ef=/^\<(.*?)\>/[_0x315e64(0x362)](_0x2e949d['text'][_0x315e64(0x393)](_0x2e949d[_0x315e64(0x2e1)]));return _0x33f4ef?(_0x2e949d[_0x315e64(0x2e1)]+=_0x33f4ef[0x0][_0x315e64(0x3a8)],String(_0x33f4ef[0x0]['slice'](0x1,_0x33f4ef[0x0][_0x315e64(0x3a8)]-0x1))):'';},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x33a)]=Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x2bf)],Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x2bf)]=function(_0x196e38,_0x21ffae){const _0x242d69=_0x2a5a53;switch(_0x196e38){case'C':_0x21ffae[_0x242d69(0x223)]?VisuMZ[_0x242d69(0x283)][_0x242d69(0x33a)]['call'](this,_0x196e38,_0x21ffae):this[_0x242d69(0x2a9)](_0x21ffae);break;case'I':case'{':case'}':VisuMZ[_0x242d69(0x283)][_0x242d69(0x33a)]['call'](this,_0x196e38,_0x21ffae);break;case'FS':this[_0x242d69(0x345)](_0x21ffae);break;case'PX':this[_0x242d69(0x37d)](_0x21ffae);break;case'PY':this[_0x242d69(0x295)](_0x21ffae);break;case _0x242d69(0x20e):this[_0x242d69(0x1fc)](this[_0x242d69(0x2a9)](_0x21ffae));break;case _0x242d69(0x1ac):this[_0x242d69(0x2a1)](_0x21ffae);break;case'COLORLOCK':this['processColorLock'](_0x21ffae);break;case _0x242d69(0x287):this[_0x242d69(0x21c)](_0x21ffae);break;case _0x242d69(0x2ae):this[_0x242d69(0x1b3)](this['obtainEscapeParam'](_0x21ffae));break;case _0x242d69(0x198):this[_0x242d69(0x25c)](_0x21ffae);break;case'PREVCOLOR':this[_0x242d69(0x348)](_0x21ffae);break;case'TEXTALIGNMENT':this['processTextAlignmentChange'](_0x21ffae);break;case _0x242d69(0x39a):this['processCustomWait'](_0x21ffae);break;case _0x242d69(0x1b8):this['processWrapBreak'](_0x21ffae);break;default:this[_0x242d69(0x385)](_0x196e38,_0x21ffae);}},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x385)]=function(_0x2f9fc5,_0x2f32d9){const _0x1b8118=_0x2a5a53;for(const _0x1eb527 of VisuMZ[_0x1b8118(0x283)][_0x1b8118(0x2c2)]['TextCodeActions']){if(_0x1eb527[_0x1b8118(0x2b7)]===_0x2f9fc5){if(_0x1eb527[_0x1b8118(0x2b8)]==='')this['obtainEscapeParam'](_0x2f32d9);_0x1eb527[_0x1b8118(0x20a)]['call'](this,_0x2f32d9);if(this[_0x1b8118(0x290)]===Window_Message){const _0x1a66ae=_0x1eb527['CommonEvent']||0x0;if(_0x1a66ae>0x0)this[_0x1b8118(0x1cd)](_0x1a66ae);}}}},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x288)]=function(){const _0x3813af=_0x2a5a53;this['contents'][_0x3813af(0x395)]+=VisuMZ[_0x3813af(0x283)][_0x3813af(0x2c2)][_0x3813af(0x336)]['FontChangeValue'],this[_0x3813af(0x30a)][_0x3813af(0x395)]=Math[_0x3813af(0x238)](this[_0x3813af(0x30a)]['fontSize'],VisuMZ[_0x3813af(0x283)][_0x3813af(0x2c2)]['General'][_0x3813af(0x231)]);},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x351)]=function(){const _0x1d9074=_0x2a5a53;this[_0x1d9074(0x30a)][_0x1d9074(0x395)]-=VisuMZ[_0x1d9074(0x283)][_0x1d9074(0x2c2)]['General'][_0x1d9074(0x1c8)],this[_0x1d9074(0x30a)][_0x1d9074(0x395)]=Math[_0x1d9074(0x33e)](this[_0x1d9074(0x30a)][_0x1d9074(0x395)],VisuMZ[_0x1d9074(0x283)]['Settings']['General'][_0x1d9074(0x371)]);},Window_Base['prototype']['processFsTextCode']=function(_0xecdc9d){const _0x9124a2=_0x2a5a53,_0x136d62=this[_0x9124a2(0x2a9)](_0xecdc9d);this['contents'][_0x9124a2(0x395)]=_0x136d62[_0x9124a2(0x293)](VisuMZ[_0x9124a2(0x283)]['Settings']['General'][_0x9124a2(0x371)],VisuMZ[_0x9124a2(0x283)][_0x9124a2(0x2c2)]['General'][_0x9124a2(0x231)]);},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x36f)]=function(_0x1c654e){const _0x2f1ff9=_0x2a5a53;let _0x565dbd=this[_0x2f1ff9(0x30a)][_0x2f1ff9(0x395)];const _0x171cdd=/\x1b({|}|FS)(\[(\d+)])?/gi;for(;;){const _0x191872=_0x171cdd[_0x2f1ff9(0x362)](_0x1c654e);if(!_0x191872)break;const _0x3c6c51=String(_0x191872[0x1])[_0x2f1ff9(0x1bd)]();if(_0x3c6c51==='{')this[_0x2f1ff9(0x288)]();else{if(_0x3c6c51==='}')this['makeFontSmaller']();else _0x3c6c51==='FS'&&(this[_0x2f1ff9(0x30a)][_0x2f1ff9(0x395)]=parseInt(_0x191872[0x3])[_0x2f1ff9(0x293)](VisuMZ[_0x2f1ff9(0x283)]['Settings'][_0x2f1ff9(0x336)][_0x2f1ff9(0x371)],VisuMZ[_0x2f1ff9(0x283)][_0x2f1ff9(0x2c2)]['General'][_0x2f1ff9(0x231)]));}this[_0x2f1ff9(0x30a)][_0x2f1ff9(0x395)]>_0x565dbd&&(_0x565dbd=this[_0x2f1ff9(0x30a)]['fontSize']);}return _0x565dbd;},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x37d)]=function(_0xafca8){const _0x377faf=_0x2a5a53;_0xafca8['x']=this[_0x377faf(0x2a9)](_0xafca8),VisuMZ['MessageCore']['Settings'][_0x377faf(0x336)]['RelativePXPY']&&(_0xafca8['x']+=_0xafca8[_0x377faf(0x3b0)]);},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x295)]=function(_0x3a9396){const _0x420505=_0x2a5a53;_0x3a9396['y']=this[_0x420505(0x2a9)](_0x3a9396),VisuMZ[_0x420505(0x283)][_0x420505(0x2c2)]['General'][_0x420505(0x1c7)]&&(_0x3a9396['y']+=_0x3a9396[_0x420505(0x240)]);},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x1fc)]=function(_0x4f470d){const _0x132128=_0x2a5a53;this['contents'][_0x132128(0x22f)]=!!_0x4f470d;},Window_Base['prototype']['processFontChangeItalic']=function(_0x4fb41a){const _0x54a4c7=_0x2a5a53;this[_0x54a4c7(0x30a)][_0x54a4c7(0x368)]=!!_0x4fb41a;},Window_Base['prototype'][_0x2a5a53(0x32b)]=function(_0x2dc3a0){const _0x54a2f9=_0x2a5a53,_0x468ca9=this[_0x54a2f9(0x2a9)](_0x2dc3a0);if(!_0x2dc3a0[_0x54a2f9(0x223)])return;switch(_0x468ca9){case 0x0:this[_0x54a2f9(0x275)](_0x54a2f9(0x1f0));return;case 0x1:this[_0x54a2f9(0x275)](_0x54a2f9(0x342));break;case 0x2:this[_0x54a2f9(0x275)]('center');break;case 0x3:this['setTextAlignment']('right');break;}this[_0x54a2f9(0x38c)](_0x2dc3a0);},Window_Base['prototype'][_0x2a5a53(0x38c)]=function(_0x196d04){const _0x5dea0f=_0x2a5a53;if(!_0x196d04['drawing'])return;if(_0x196d04[_0x5dea0f(0x28c)])return;if(this[_0x5dea0f(0x18d)]()===_0x5dea0f(0x1f0))return;let _0x1a0e70=_0x196d04[_0x5dea0f(0x1fb)][_0x5dea0f(0x229)](_0x5dea0f(0x27b),_0x196d04['index']+0x1),_0x9c744b=_0x196d04['text'][_0x5dea0f(0x229)]('\x0a',_0x196d04[_0x5dea0f(0x2e1)]+0x1);if(_0x1a0e70<0x0)_0x1a0e70=_0x196d04[_0x5dea0f(0x1fb)][_0x5dea0f(0x3a8)]+0x1;if(_0x9c744b>0x0)_0x1a0e70=Math[_0x5dea0f(0x238)](_0x1a0e70,_0x9c744b);const _0x5ec7cf=_0x196d04[_0x5dea0f(0x1fb)][_0x5dea0f(0x36a)](_0x196d04[_0x5dea0f(0x2e1)],_0x1a0e70),_0x3c94cc=this[_0x5dea0f(0x269)](_0x5ec7cf)[_0x5dea0f(0x305)],_0x2305c9=_0x196d04[_0x5dea0f(0x305)]||this[_0x5dea0f(0x306)],_0x27dea1=this[_0x5dea0f(0x290)]===Window_Message&&$gameMessage[_0x5dea0f(0x1ce)]()!=='';switch(this[_0x5dea0f(0x18d)]()){case _0x5dea0f(0x342):_0x196d04['x']=_0x196d04[_0x5dea0f(0x3b0)];break;case'center':_0x196d04['x']=_0x196d04['startX'],_0x196d04['x']+=Math['floor']((_0x2305c9-_0x3c94cc)/0x2);_0x27dea1&&(_0x196d04['x']-=_0x196d04['startX']/0x2);break;case _0x5dea0f(0x262):_0x196d04['x']=_0x2305c9-_0x3c94cc+_0x196d04[_0x5dea0f(0x3b0)];_0x27dea1&&(_0x196d04['x']-=_0x196d04['startX']);break;}},Window_Base['prototype'][_0x2a5a53(0x269)]=function(_0x1b13cf){const _0x28b2b8=_0x2a5a53;_0x1b13cf=_0x1b13cf[_0x28b2b8(0x1ea)](/\x1b!/g,''),_0x1b13cf=_0x1b13cf[_0x28b2b8(0x1ea)](/\x1b\|/g,''),_0x1b13cf=_0x1b13cf[_0x28b2b8(0x1ea)](/\x1b\./g,'');const _0x5e3e72=this[_0x28b2b8(0x245)](_0x1b13cf,0x0,0x0,0x0),_0x3ebcbd=this[_0x28b2b8(0x312)]();return _0x5e3e72[_0x28b2b8(0x223)]=![],this[_0x28b2b8(0x26d)](_0x5e3e72),this['returnPreservedFontSettings'](_0x3ebcbd),{'width':_0x5e3e72[_0x28b2b8(0x2fa)],'height':_0x5e3e72[_0x28b2b8(0x376)]};},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x369)]=function(_0x2f92e1){const _0x5652cc=_0x2a5a53,_0x50d7e4=(_0x2f92e1[_0x5652cc(0x28c)]?-0x1:0x1)*this['textWidth']('\x20');_0x2f92e1['x']+=_0x50d7e4;if(this['obtainEscapeParam'](_0x2f92e1)>0x0)_0x2f92e1['x']+=_0x50d7e4;if(_0x2f92e1['rtl'])return;let _0x202d71=_0x2f92e1[_0x5652cc(0x1fb)]['indexOf'](_0x5652cc(0x378),_0x2f92e1[_0x5652cc(0x2e1)]+0x1),_0x12e4ae=_0x2f92e1[_0x5652cc(0x1fb)][_0x5652cc(0x229)]('\x0a',_0x2f92e1[_0x5652cc(0x2e1)]+0x1);if(_0x202d71<0x0)_0x202d71=_0x2f92e1['text']['length']+0x1;if(_0x12e4ae>0x0)_0x202d71=Math[_0x5652cc(0x238)](_0x202d71,_0x12e4ae);const _0x50b6ab=_0x2f92e1[_0x5652cc(0x1fb)][_0x5652cc(0x36a)](_0x2f92e1[_0x5652cc(0x2e1)],_0x202d71),_0x55a260=this['textSizeExWordWrap'](_0x50b6ab)[_0x5652cc(0x305)];let _0x38b9d8=_0x2f92e1[_0x5652cc(0x305)]||this[_0x5652cc(0x306)];if(this[_0x5652cc(0x290)]===Window_Message){const _0x13ad7a=$gameMessage['faceName']()===''?0x0:ImageManager[_0x5652cc(0x29d)]+0x14;_0x38b9d8-=_0x13ad7a,VisuMZ[_0x5652cc(0x283)][_0x5652cc(0x2c2)][_0x5652cc(0x289)][_0x5652cc(0x29e)]&&(_0x38b9d8-=_0x13ad7a);}let _0x2528a1=![];if(_0x2f92e1['x']+_0x55a260>_0x2f92e1[_0x5652cc(0x3b0)]+_0x38b9d8)_0x2528a1=!![];if(_0x55a260===0x0)_0x2528a1=!![];_0x2528a1&&(_0x2f92e1[_0x5652cc(0x1fb)]=_0x2f92e1[_0x5652cc(0x1fb)][_0x5652cc(0x393)](0x0,_0x2f92e1[_0x5652cc(0x2e1)])+'\x0a'+_0x2f92e1[_0x5652cc(0x1fb)][_0x5652cc(0x321)](_0x2f92e1[_0x5652cc(0x2e1)]));},Window_Base['prototype'][_0x2a5a53(0x31f)]=function(_0x43d639){const _0x2a1c55=_0x2a5a53,_0x416819=this[_0x2a1c55(0x245)](_0x43d639,0x0,0x0,0x0),_0x306d54=this[_0x2a1c55(0x312)]();return _0x416819[_0x2a1c55(0x223)]=![],this[_0x2a1c55(0x381)](![]),this['processAllText'](_0x416819),this[_0x2a1c55(0x381)](!![]),this[_0x2a1c55(0x39f)](_0x306d54),{'width':_0x416819['outputWidth'],'height':_0x416819['outputHeight']};},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x21c)]=function(_0x340ed1){const _0x335033=_0x2a5a53;return this[_0x335033(0x2a9)](_0x340ed1);},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x25c)]=function(_0x323580){const _0x59e176=_0x2a5a53,_0x289c98=this[_0x59e176(0x276)](_0x323580)['split'](',');if(!_0x323580['drawing'])return;const _0x99fc25=_0x289c98[0x0]['trim'](),_0x12756a=_0x289c98[0x1]||0x0,_0x48b102=_0x289c98[0x2]||0x0,_0x2b157e=ImageManager['loadPicture'](_0x99fc25),_0x34aaa5=this[_0x59e176(0x30a)][_0x59e176(0x291)];_0x2b157e[_0x59e176(0x1a4)](this[_0x59e176(0x34c)][_0x59e176(0x1a7)](this,_0x2b157e,_0x323580['x'],_0x323580['y'],_0x12756a,_0x48b102,_0x34aaa5));},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x34c)]=function(_0x135dd0,_0x4ffb09,_0x50573a,_0x1d077e,_0x473be7,_0x1ec981){const _0x33339c=_0x2a5a53;_0x1d077e=_0x1d077e||_0x135dd0[_0x33339c(0x305)],_0x473be7=_0x473be7||_0x135dd0['height'],this['contentsBack'][_0x33339c(0x291)]=_0x1ec981,this[_0x33339c(0x2f3)][_0x33339c(0x2de)](_0x135dd0,0x0,0x0,_0x135dd0[_0x33339c(0x305)],_0x135dd0[_0x33339c(0x354)],_0x4ffb09,_0x50573a,_0x1d077e,_0x473be7),this['contentsBack'][_0x33339c(0x291)]=0xff;},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x2a1)]=function(_0xd7f573){const _0x4d04e5=_0x2a5a53,_0x5b0996=this[_0x4d04e5(0x276)](_0xd7f573)[_0x4d04e5(0x25f)](',');if(!_0xd7f573[_0x4d04e5(0x223)])return;const _0x4d4183=_0x5b0996[0x0][_0x4d04e5(0x352)](),_0x156d0e=ImageManager[_0x4d04e5(0x39b)](_0x4d4183),_0x10eb22=JsonEx[_0x4d04e5(0x20b)](_0xd7f573),_0x35d003=this[_0x4d04e5(0x30a)][_0x4d04e5(0x291)];_0x156d0e[_0x4d04e5(0x1a4)](this[_0x4d04e5(0x372)]['bind'](this,_0x156d0e,_0x10eb22,_0x35d003));},Window_Base['prototype'][_0x2a5a53(0x372)]=function(_0x35d0bf,_0x41eff2,_0xb0e585){const _0x26faeb=_0x2a5a53,_0x9e4e41=_0x41eff2[_0x26faeb(0x305)]||this[_0x26faeb(0x306)],_0x28b1d7=this[_0x26faeb(0x3aa)]!==undefined?this[_0x26faeb(0x221)]():this[_0x26faeb(0x3ac)],_0x1e9da6=_0x9e4e41/_0x35d0bf[_0x26faeb(0x305)],_0x1354a7=_0x28b1d7/_0x35d0bf['height'],_0x5a3c4d=Math[_0x26faeb(0x238)](_0x1e9da6,_0x1354a7,0x1),_0x3540da=this[_0x26faeb(0x3aa)]!==undefined?(this[_0x26faeb(0x29c)](0x0)[_0x26faeb(0x354)]-this[_0x26faeb(0x239)]())/0x2:0x0,_0x206e9c=_0x35d0bf[_0x26faeb(0x305)]*_0x5a3c4d,_0x349316=_0x35d0bf[_0x26faeb(0x354)]*_0x5a3c4d,_0xaeffcc=Math[_0x26faeb(0x1d4)]((_0x9e4e41-_0x206e9c)/0x2)+_0x41eff2[_0x26faeb(0x3b0)],_0x1478c7=Math[_0x26faeb(0x1d4)]((_0x28b1d7-_0x349316)/0x2)+_0x41eff2[_0x26faeb(0x240)]-_0x3540da*0x2;this['contentsBack']['paintOpacity']=_0xb0e585,this[_0x26faeb(0x2f3)][_0x26faeb(0x2de)](_0x35d0bf,0x0,0x0,_0x35d0bf['width'],_0x35d0bf[_0x26faeb(0x354)],_0xaeffcc,_0x1478c7,_0x206e9c,_0x349316),this[_0x26faeb(0x2f3)][_0x26faeb(0x291)]=0xff;},Window_Base[_0x2a5a53(0x1f8)]['processColorLock']=function(_0x4bc008){const _0x9e31f0=_0x2a5a53,_0x327c62=this[_0x9e31f0(0x2a9)](_0x4bc008);if(_0x4bc008[_0x9e31f0(0x223)])this[_0x9e31f0(0x370)](_0x327c62>0x0);},Window_Base[_0x2a5a53(0x1f8)][_0x2a5a53(0x1b7)]=function(_0x11bf57){const _0x1278b3=_0x2a5a53,_0x1484bc=this[_0x1278b3(0x2a9)](_0x11bf57);this[_0x1278b3(0x290)]===Window_Message&&_0x11bf57[_0x1278b3(0x223)]&&this[_0x1278b3(0x2ac)](_0x1484bc);},Window_Help[_0x2a5a53(0x1f8)][_0x2a5a53(0x2af)]=function(){const _0x449707=_0x2a5a53;this['setWordWrap']($gameSystem[_0x449707(0x330)]());},Window_Help['prototype'][_0x2a5a53(0x307)]=function(){return!![];},VisuMZ[_0x2a5a53(0x283)]['Window_Help_refresh']=Window_Help[_0x2a5a53(0x1f8)][_0x2a5a53(0x237)],Window_Help['prototype'][_0x2a5a53(0x237)]=function(){const _0x5f11bf=_0x2a5a53;this[_0x5f11bf(0x34a)](),VisuMZ[_0x5f11bf(0x283)][_0x5f11bf(0x292)]['call'](this),this[_0x5f11bf(0x2af)]();},VisuMZ[_0x2a5a53(0x283)]['Window_Options_addGeneralOptions']=Window_Options[_0x2a5a53(0x1f8)][_0x2a5a53(0x318)],Window_Options[_0x2a5a53(0x1f8)][_0x2a5a53(0x318)]=function(){const _0x1817da=_0x2a5a53;VisuMZ[_0x1817da(0x283)][_0x1817da(0x243)]['call'](this),this[_0x1817da(0x337)]();},Window_Options[_0x2a5a53(0x1f8)][_0x2a5a53(0x337)]=function(){const _0x236aa2=_0x2a5a53;VisuMZ[_0x236aa2(0x283)][_0x236aa2(0x2c2)][_0x236aa2(0x267)]['AddOption']&&this[_0x236aa2(0x2bd)]();},Window_Options[_0x2a5a53(0x1f8)]['addMessageCoreTextSpeedCommand']=function(){const _0x53535f=_0x2a5a53,_0x36e7e9=TextManager['messageCoreTextSpeed'],_0x51e7b3=_0x53535f(0x360);this['addCommand'](_0x36e7e9,_0x51e7b3);},VisuMZ['MessageCore']['Window_Options_statusText']=Window_Options['prototype'][_0x2a5a53(0x317)],Window_Options[_0x2a5a53(0x1f8)][_0x2a5a53(0x317)]=function(_0x39500c){const _0x37bfb5=_0x2a5a53,_0x426b00=this[_0x37bfb5(0x347)](_0x39500c);if(_0x426b00===_0x37bfb5(0x360))return this[_0x37bfb5(0x199)]();return VisuMZ[_0x37bfb5(0x283)][_0x37bfb5(0x2e2)][_0x37bfb5(0x222)](this,_0x39500c);},VisuMZ['MessageCore']['Window_Options_isVolumeSymbol']=Window_Options[_0x2a5a53(0x1f8)][_0x2a5a53(0x34f)],Window_Options[_0x2a5a53(0x1f8)][_0x2a5a53(0x34f)]=function(_0xa8132b){const _0x309314=_0x2a5a53;if(_0xa8132b===_0x309314(0x360))return!![];return VisuMZ[_0x309314(0x283)][_0x309314(0x1e6)]['call'](this,_0xa8132b);},Window_Options[_0x2a5a53(0x1f8)][_0x2a5a53(0x199)]=function(){const _0x17cd9e=_0x2a5a53,_0x29184c=this['getConfigValue'](_0x17cd9e(0x360));return _0x29184c>0xa?TextManager[_0x17cd9e(0x3a1)]:_0x29184c;},VisuMZ[_0x2a5a53(0x283)]['Window_Options_changeVolume']=Window_Options['prototype'][_0x2a5a53(0x3b8)],Window_Options['prototype']['changeVolume']=function(_0x281edf,_0x1d2bb0,_0x3817d7){const _0x4ec70c=_0x2a5a53;if(_0x281edf==='textSpeed')return this[_0x4ec70c(0x396)](_0x281edf,_0x1d2bb0,_0x3817d7);VisuMZ[_0x4ec70c(0x283)][_0x4ec70c(0x3a6)][_0x4ec70c(0x222)](this,_0x281edf,_0x1d2bb0,_0x3817d7);},Window_Options[_0x2a5a53(0x1f8)]['changeTextSpeed']=function(_0x571089,_0x23feee,_0x403165){const _0x3adf0b=_0x2a5a53,_0xb49332=this[_0x3adf0b(0x241)](_0x571089),_0x4fc8ec=0x1,_0x16e233=_0xb49332+(_0x23feee?_0x4fc8ec:-_0x4fc8ec);_0x16e233>0xb&&_0x403165?this[_0x3adf0b(0x1dc)](_0x571089,0x1):this['changeValue'](_0x571089,_0x16e233[_0x3adf0b(0x293)](0x1,0xb));},Window_Message['prototype'][_0x2a5a53(0x266)]=function(){const _0x59505d=_0x2a5a53;Window_Base['prototype']['refreshDimmerBitmap'][_0x59505d(0x222)](this),VisuMZ[_0x59505d(0x283)][_0x59505d(0x2c2)][_0x59505d(0x336)][_0x59505d(0x244)]&&this[_0x59505d(0x304)]();},Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x304)]=function(){const _0x40b40d=_0x2a5a53;this['_dimmerSprite']['x']=Math[_0x40b40d(0x31b)](this[_0x40b40d(0x305)]/0x2),this['_dimmerSprite'][_0x40b40d(0x366)]['x']=0.5,this[_0x40b40d(0x1f1)][_0x40b40d(0x33c)]['x']=Graphics[_0x40b40d(0x305)];},VisuMZ['MessageCore']['Window_Message_clearFlags']=Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x308)],Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x308)]=function(){const _0x11e4bc=_0x2a5a53;VisuMZ['MessageCore'][_0x11e4bc(0x251)][_0x11e4bc(0x222)](this),this[_0x11e4bc(0x34a)](),this['resetWordWrap'](),this[_0x11e4bc(0x370)](![]),this['setTextAlignment'](_0x11e4bc(0x1f0)),this[_0x11e4bc(0x265)](VisuMZ[_0x11e4bc(0x283)][_0x11e4bc(0x2c2)][_0x11e4bc(0x336)]['MessageTextDelay']);},Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x2af)]=function(){const _0xb51bf9=_0x2a5a53;this[_0xb51bf9(0x381)]($gameSystem['isMessageWindowWordWrap']());},Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x307)]=function(){return!![];},Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x265)]=function(_0x6c0ccf){const _0x2bbcb8=_0x2a5a53,_0x475779=0xb-ConfigManager[_0x2bbcb8(0x360)];_0x6c0ccf=Math[_0x2bbcb8(0x31b)](_0x6c0ccf*_0x475779),this[_0x2bbcb8(0x2b1)]=_0x6c0ccf,this[_0x2bbcb8(0x2a5)]=_0x6c0ccf;},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x25b)]=Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x3b2)],Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x3b2)]=function(){const _0x3efa5a=_0x2a5a53;return VisuMZ[_0x3efa5a(0x283)][_0x3efa5a(0x25b)][_0x3efa5a(0x222)](this)||Input[_0x3efa5a(0x28a)](VisuMZ[_0x3efa5a(0x283)][_0x3efa5a(0x2c2)]['General'][_0x3efa5a(0x277)]);},VisuMZ[_0x2a5a53(0x283)]['Window_Message_updatePlacement']=Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x2e8)],Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x2e8)]=function(){const _0x3b8c45=_0x2a5a53;let _0x43f5f9=this['y'];VisuMZ[_0x3b8c45(0x283)][_0x3b8c45(0x399)]['call'](this);if(this[_0x3b8c45(0x272)])this['y']=_0x43f5f9;this['clampPlacementPosition']();},VisuMZ[_0x2a5a53(0x283)]['Window_Message_newPage']=Window_Message[_0x2a5a53(0x1f8)]['newPage'],Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x1a8)]=function(_0x380004){const _0x428ba9=_0x2a5a53;this[_0x428ba9(0x278)](_0x380004),VisuMZ[_0x428ba9(0x283)][_0x428ba9(0x39d)][_0x428ba9(0x222)](this,_0x380004),this[_0x428ba9(0x1ae)]();},Window_Message['prototype'][_0x2a5a53(0x278)]=function(_0xaf9a6f){const _0x345906=_0x2a5a53;this[_0x345906(0x359)](_0xaf9a6f),this[_0x345906(0x2ec)]();},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x39c)]=Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x32f)],Window_Message['prototype'][_0x2a5a53(0x32f)]=function(){const _0x540a33=_0x2a5a53;VisuMZ[_0x540a33(0x283)]['Window_Message_terminateMessage'][_0x540a33(0x222)](this),this[_0x540a33(0x308)]();if(this[_0x540a33(0x325)])this['messagePositionReset']();},Window_Message['prototype'][_0x2a5a53(0x2ec)]=function(){const _0x17eb26=_0x2a5a53;this[_0x17eb26(0x305)]=$gameSystem[_0x17eb26(0x1f3)](),this[_0x17eb26(0x305)]=Math[_0x17eb26(0x238)](Graphics[_0x17eb26(0x305)],this[_0x17eb26(0x305)]);const _0x18c1ec=$gameSystem[_0x17eb26(0x1b2)]();this[_0x17eb26(0x354)]=SceneManager['_scene'][_0x17eb26(0x2c9)](_0x18c1ec,![]),this[_0x17eb26(0x354)]=Math[_0x17eb26(0x238)](Graphics['height'],this['height']);if($gameTemp[_0x17eb26(0x314)])this['resetPositionX']();},Window_Message['prototype'][_0x2a5a53(0x24b)]=function(){const _0x2cb539=_0x2a5a53;this['x']=(Graphics[_0x2cb539(0x344)]-this[_0x2cb539(0x305)])/0x2,$gameTemp[_0x2cb539(0x314)]=undefined,this[_0x2cb539(0x2d3)]();},Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x1e9)]=function(){const _0x4f0263=_0x2a5a53,_0x323c8b={'x':this['x'],'y':this['y']};Window_Base[_0x4f0263(0x1f8)]['updateMove'][_0x4f0263(0x222)](this),this[_0x4f0263(0x35d)](_0x323c8b);},Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x32d)]=function(){return!![];},Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x35d)]=function(_0x24a997){const _0x5498d4=_0x2a5a53;this[_0x5498d4(0x300)]&&(this[_0x5498d4(0x300)]['x']+=this['x']-_0x24a997['x'],this[_0x5498d4(0x300)]['y']+=this['y']-_0x24a997['y']);},Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x19a)]=function(_0x3f6c39,_0x1c921a){const _0x2b9dc7=_0x2a5a53;this[_0x2b9dc7(0x252)](this[_0x2b9dc7(0x38f)]['x'],this[_0x2b9dc7(0x23f)]*(Graphics[_0x2b9dc7(0x2e0)]-this['height'])/0x2,this[_0x2b9dc7(0x38f)][_0x2b9dc7(0x305)],this[_0x2b9dc7(0x38f)][_0x2b9dc7(0x354)],_0x3f6c39,_0x1c921a);},Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x21c)]=function(_0x465959){const _0x36cf2b=_0x2a5a53,_0x15fbb7=Window_Base[_0x36cf2b(0x1f8)][_0x36cf2b(0x21c)][_0x36cf2b(0x222)](this,_0x465959);this['launchMessageCommonEvent'](_0x15fbb7);},Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x1cd)]=function(_0x193697){const _0x238a8d=_0x2a5a53;if($gameParty[_0x238a8d(0x36c)]()){}else $gameMap[_0x238a8d(0x1db)](_0x193697);},Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x2ab)]=function(_0x566dce){const _0x42890e=_0x2a5a53;this[_0x42890e(0x2b1)]--,this[_0x42890e(0x2b1)]<=0x0&&(this[_0x42890e(0x2cb)](_0x566dce),Window_Base[_0x42890e(0x1f8)][_0x42890e(0x2ab)][_0x42890e(0x222)](this,_0x566dce));},Window_Message[_0x2a5a53(0x1f8)]['onProcessCharacter']=function(_0x48cae2){const _0x1b1d70=_0x2a5a53;this[_0x1b1d70(0x2b1)]=this['_textDelay'];if(this[_0x1b1d70(0x2a5)]<=0x0)this[_0x1b1d70(0x1ca)]=!![];},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x2c6)]=Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x2bf)],Window_Message['prototype']['processEscapeCharacter']=function(_0x278002,_0x77e9e5){const _0x50253d=_0x2a5a53;!_0x77e9e5['drawing']?Window_Base[_0x50253d(0x1f8)]['processEscapeCharacter'][_0x50253d(0x222)](this,_0x278002,_0x77e9e5):VisuMZ[_0x50253d(0x283)][_0x50253d(0x2c6)][_0x50253d(0x222)](this,_0x278002,_0x77e9e5);},Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x359)]=function(_0x2fc078){const _0x29e992=_0x2a5a53;let _0x396b82=_0x2fc078[_0x29e992(0x1fb)];_0x396b82=_0x396b82[_0x29e992(0x1ea)](/<(?:AUTO|AUTOSIZE|AUTO SIZE)>/gi,()=>{const _0x2a5b87=_0x29e992;return this[_0x2a5b87(0x1c2)](_0x396b82,!![],!![]),this[_0x2a5b87(0x3ae)]('none'),'';}),_0x396b82=_0x396b82[_0x29e992(0x1ea)](/<(?:AUTOWIDTH|AUTO WIDTH)>/gi,()=>{const _0x399f09=_0x29e992;return this[_0x399f09(0x1c2)](_0x396b82,!![],![]),this[_0x399f09(0x3ae)]('none'),'';}),_0x396b82=_0x396b82[_0x29e992(0x1ea)](/<(?:AUTOHEIGHT|AUTO HEIGHT)>/gi,()=>{const _0x57baf3=_0x29e992;return this[_0x57baf3(0x1c2)](_0x396b82,![],!![]),this['processAutoPosition'](_0x57baf3(0x35c)),'';});if(SceneManager[_0x29e992(0x24a)]())_0x396b82=_0x396b82[_0x29e992(0x1ea)](/<(?:AUTOACTOR|AUTO ACTOR):[ ](.*?)>/gi,(_0x26b13b,_0x17ad82)=>{const _0x300ec2=_0x29e992;return this[_0x300ec2(0x1c2)](_0x396b82,!![],!![]),this[_0x300ec2(0x3ae)](_0x300ec2(0x195),Number(_0x17ad82)||0x1),'';}),_0x396b82=_0x396b82[_0x29e992(0x1ea)](/<(?:AUTOPARTY|AUTO PARTY):[ ](.*?)>/gi,(_0x372f71,_0xc8f5d0)=>{const _0x51ce68=_0x29e992;return this['processAutoSize'](_0x396b82,!![],!![]),this[_0x51ce68(0x3ae)](_0x51ce68(0x28f),Number(_0xc8f5d0)||0x0),'';}),_0x396b82=_0x396b82[_0x29e992(0x1ea)](/<(?:AUTOENEMY|AUTO ENEMY):[ ](.*?)>/gi,(_0x410058,_0x4c8518)=>{const _0xe10117=_0x29e992;return this[_0xe10117(0x1c2)](_0x396b82,!![],!![]),this[_0xe10117(0x3ae)](_0xe10117(0x200),Number(_0x4c8518)||0x0),'';});else SceneManager[_0x29e992(0x2e9)]()&&(_0x396b82=_0x396b82[_0x29e992(0x1ea)](/<(?:AUTOPLAYER|AUTO PLAYER)>/gi,(_0x53bd02,_0x1bf3f5)=>{const _0x4b517f=_0x29e992;return this[_0x4b517f(0x1c2)](_0x396b82,!![],!![]),this[_0x4b517f(0x3ae)](_0x4b517f(0x1ad),0x0),'';}),_0x396b82=_0x396b82[_0x29e992(0x1ea)](/<(?:AUTOACTOR|AUTO ACTOR):[ ](.*?)>/gi,(_0x59d33a,_0x338c01)=>{const _0x20bb56=_0x29e992;return this[_0x20bb56(0x1c2)](_0x396b82,!![],!![]),this[_0x20bb56(0x3ae)]('map\x20actor',Number(_0x338c01)||0x1),'';}),_0x396b82=_0x396b82[_0x29e992(0x1ea)](/<(?:AUTOPARTY|AUTO PARTY):[ ](.*?)>/gi,(_0x2cae75,_0x4b20f6)=>{const _0x547b3a=_0x29e992;return this[_0x547b3a(0x1c2)](_0x396b82,!![],!![]),this['processAutoPosition'](_0x547b3a(0x358),Number(_0x4b20f6)||0x0),'';}),_0x396b82=_0x396b82[_0x29e992(0x1ea)](/<(?:AUTOEVENT|AUTO EVENT):[ ](.*?)>/gi,(_0x8b4ce9,_0x2204a5)=>{const _0x34aa5c=_0x29e992;return this[_0x34aa5c(0x1c2)](_0x396b82,!![],!![]),this['processAutoPosition'](_0x34aa5c(0x29f),Number(_0x2204a5)||0x0),'';}));_0x2fc078[_0x29e992(0x1fb)]=_0x396b82;},Window_Message['_autoSizeRegexp']=/<(?:AUTO|AUTOSIZE|AUTO SIZE|AUTOWIDTH|AUTO WIDTH|AUTOHEIGHT|AUTO HEIGHT|AUTOPLAYER|AUTO PLAYER)>/gi,Window_Message[_0x2a5a53(0x22c)]=/<(?:AUTOPARTY|AUTO PARTY|AUTOPLAYER|AUTO PLAYER|AUTOEVENT|AUTO EVENT|AUTOENEMY|AUTO ENEMY|AUTOACTOR|AUTO ACTOR):[ ](.*?)>/gi,Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x1c2)]=function(_0xa54150,_0x2e48e0,_0x5cdb0c){const _0x5a284c=_0x2a5a53;_0xa54150=_0xa54150['replace'](Window_Message[_0x5a284c(0x37b)],''),_0xa54150=_0xa54150['replace'](Window_Message[_0x5a284c(0x22c)],''),this[_0x5a284c(0x208)]=!![];const _0x48c7b7=this[_0x5a284c(0x233)](_0xa54150);if(_0x2e48e0){let _0x3892fa=_0x48c7b7[_0x5a284c(0x305)]+$gameSystem[_0x5a284c(0x20d)]()*0x2+0x6;const _0xe6dd0=$gameMessage[_0x5a284c(0x1ce)]()!=='',_0xc07567=ImageManager['faceWidth'],_0x5cc5cc=0x14;_0x3892fa+=_0xe6dd0?_0xc07567+_0x5cc5cc:0x4,$gameSystem['setMessageWindowWidth'](_0x3892fa);}if(_0x5cdb0c){let _0x540272=Math[_0x5a284c(0x2a2)](_0x48c7b7['height']/this[_0x5a284c(0x239)]());$gameSystem[_0x5a284c(0x324)](_0x540272);}this[_0x5a284c(0x2a8)](),this[_0x5a284c(0x208)]=![],this[_0x5a284c(0x325)]=!![];},Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x2a8)]=function(){const _0x1348cd=_0x2a5a53;this[_0x1348cd(0x2ec)](),this[_0x1348cd(0x2e8)](),this['resetPositionX'](),this[_0x1348cd(0x384)](),this[_0x1348cd(0x30a)][_0x1348cd(0x2cc)](),this[_0x1348cd(0x1ae)]();},Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x3ae)]=function(_0x1f74d9,_0x5acacc){const _0x2bf6f5=_0x2a5a53;switch(_0x1f74d9[_0x2bf6f5(0x2d1)]()['trim']()){case'battle\x20actor':this['_autoPositionTarget']=$gameActors[_0x2bf6f5(0x328)](_0x5acacc);break;case _0x2bf6f5(0x28f):this[_0x2bf6f5(0x272)]=$gameParty[_0x2bf6f5(0x2c1)]()[_0x5acacc-0x1];break;case _0x2bf6f5(0x200):this[_0x2bf6f5(0x272)]=$gameTroop['members']()[_0x5acacc-0x1];break;case'map\x20player':this[_0x2bf6f5(0x272)]=$gamePlayer;break;case'map\x20actor':const _0x3b710e=$gameActors[_0x2bf6f5(0x328)](_0x5acacc)[_0x2bf6f5(0x2e1)]();_0x3b710e===0x0?this['_autoPositionTarget']=$gamePlayer:this['_autoPositionTarget']=$gamePlayer[_0x2bf6f5(0x2dc)]()['follower'](_0x3b710e-0x1);break;case _0x2bf6f5(0x358):_0x5acacc===0x1?this[_0x2bf6f5(0x272)]=$gamePlayer:this[_0x2bf6f5(0x272)]=$gamePlayer[_0x2bf6f5(0x2dc)]()[_0x2bf6f5(0x21e)](_0x5acacc-0x2);break;case _0x2bf6f5(0x29f):this[_0x2bf6f5(0x272)]=$gameMap[_0x2bf6f5(0x2ce)](_0x5acacc);break;}this[_0x2bf6f5(0x272)]&&this[_0x2bf6f5(0x234)]();},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x1b6)]=Window_Message[_0x2a5a53(0x1f8)]['synchronizeNameBox'],Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x2a3)]=function(){const _0x1b48dd=_0x2a5a53;this['updateAutoPosition'](),VisuMZ[_0x1b48dd(0x283)][_0x1b48dd(0x1b6)][_0x1b48dd(0x222)](this);},Window_Message[_0x2a5a53(0x1f8)]['updateAutoPosition']=function(){const _0x53c6cb=_0x2a5a53;if(!this[_0x53c6cb(0x272)])return;const _0x386e8d=SceneManager[_0x53c6cb(0x202)];if(!_0x386e8d)return;if(!_0x386e8d[_0x53c6cb(0x392)])return;const _0x44c08d=_0x386e8d[_0x53c6cb(0x392)][_0x53c6cb(0x2ba)](this[_0x53c6cb(0x272)]);if(!_0x44c08d)return;let _0x1a7c5f=_0x44c08d['x'];_0x1a7c5f-=this['width']/0x2,_0x1a7c5f-=(Graphics['width']-Graphics[_0x53c6cb(0x344)])/0x2;let _0x1d556e=_0x44c08d['y'];_0x1d556e-=this[_0x53c6cb(0x354)],_0x1d556e-=(Graphics[_0x53c6cb(0x354)]-Graphics[_0x53c6cb(0x2e0)])/0x2,_0x1d556e-=_0x44c08d[_0x53c6cb(0x354)]+0x8,this['x']=Math[_0x53c6cb(0x31b)](_0x1a7c5f),this['y']=Math[_0x53c6cb(0x31b)](_0x1d556e),this[_0x53c6cb(0x2d3)](!![],![]),this[_0x53c6cb(0x300)]['updatePlacement']();},Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x343)]=function(){const _0x50de52=_0x2a5a53;this['_messagePositionReset']=![],this[_0x50de52(0x272)]=undefined,$gameSystem[_0x50de52(0x388)](),this['updateAutoSizePosition'](),this['openness']=0x0;},Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x397)]=function(_0x13232f){const _0x1e0e63=_0x2a5a53;return Window_Base['prototype'][_0x1e0e63(0x397)][_0x1e0e63(0x222)](this,_0x13232f);},Window_Message[_0x2a5a53(0x1f8)][_0x2a5a53(0x319)]=function(_0x88b428){const _0x1a2b7b=_0x2a5a53;return Window_Base[_0x1a2b7b(0x1f8)][_0x1a2b7b(0x319)]['call'](this,_0x88b428);},Window_Message['prototype']['flushTextState']=function(_0x2e4a7b){const _0x48c206=_0x2a5a53;this[_0x48c206(0x2f4)](_0x2e4a7b),Window_Base[_0x48c206(0x1f8)][_0x48c206(0x28b)]['call'](this,_0x2e4a7b),this[_0x48c206(0x23e)](_0x2e4a7b);},Window_Message[_0x2a5a53(0x1f8)]['preFlushTextState']=function(_0x1fa414){},Window_Message[_0x2a5a53(0x1f8)]['postFlushTextState']=function(_0x2dc812){},Window_NameBox[_0x2a5a53(0x1f8)][_0x2a5a53(0x307)]=function(){return![];},Window_NameBox[_0x2a5a53(0x1f8)]['resetTextColor']=function(){const _0x43dac6=_0x2a5a53;Window_Base['prototype'][_0x43dac6(0x246)][_0x43dac6(0x222)](this),this[_0x43dac6(0x364)](this[_0x43dac6(0x2f8)]());},Window_NameBox['prototype']['defaultColor']=function(){const _0x346e1b=_0x2a5a53,_0xa00aa0=VisuMZ[_0x346e1b(0x283)][_0x346e1b(0x2c2)][_0x346e1b(0x336)][_0x346e1b(0x1a2)];return ColorManager[_0x346e1b(0x2dd)](_0xa00aa0);},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x310)]=Window_NameBox[_0x2a5a53(0x1f8)][_0x2a5a53(0x2e8)],Window_NameBox[_0x2a5a53(0x1f8)][_0x2a5a53(0x2e8)]=function(){const _0x79be9d=_0x2a5a53;VisuMZ[_0x79be9d(0x283)][_0x79be9d(0x310)][_0x79be9d(0x222)](this),this[_0x79be9d(0x33b)](),this[_0x79be9d(0x1eb)](),this[_0x79be9d(0x2d3)](),this['updateOverlappingY']();},Window_NameBox[_0x2a5a53(0x1f8)]['preConvertEscapeCharacters']=function(_0x5a2980){const _0xc86a87=_0x2a5a53;return _0x5a2980=_0x5a2980[_0xc86a87(0x1ea)](/<LEFT>/gi,this[_0xc86a87(0x380)]['bind'](this,0x0)),_0x5a2980=_0x5a2980[_0xc86a87(0x1ea)](/<CENTER>/gi,this[_0xc86a87(0x380)][_0xc86a87(0x1a7)](this,0x5)),_0x5a2980=_0x5a2980['replace'](/<RIGHT>/gi,this[_0xc86a87(0x380)]['bind'](this,0xa)),_0x5a2980=_0x5a2980[_0xc86a87(0x1ea)](/<POSITION:[ ](\d+)>/gi,(_0x1974a3,_0x30f30f)=>this[_0xc86a87(0x380)](parseInt(_0x30f30f))),_0x5a2980=_0x5a2980[_0xc86a87(0x1ea)](/<\/LEFT>/gi,''),_0x5a2980=_0x5a2980[_0xc86a87(0x1ea)](/<\/CENTER>/gi,''),_0x5a2980=_0x5a2980[_0xc86a87(0x1ea)](/<\/RIGHT>/gi,''),Window_Base['prototype'][_0xc86a87(0x397)][_0xc86a87(0x222)](this,_0x5a2980);},Window_NameBox['prototype'][_0x2a5a53(0x380)]=function(_0x11de0c){const _0x2e475e=_0x2a5a53;return this[_0x2e475e(0x1dd)]=_0x11de0c,'';},Window_NameBox[_0x2a5a53(0x1f8)][_0x2a5a53(0x33b)]=function(){const _0x5d4b34=_0x2a5a53;if($gameMessage[_0x5d4b34(0x363)]())return;this[_0x5d4b34(0x1dd)]=this[_0x5d4b34(0x1dd)]||0x0;const _0x7b3053=this[_0x5d4b34(0x37a)],_0x587596=Math[_0x5d4b34(0x1d4)](_0x7b3053['width']*this['_relativePosition']/0xa);this['x']=_0x7b3053['x']+_0x587596-Math[_0x5d4b34(0x1d4)](this[_0x5d4b34(0x305)]/0x2),this['x']=this['x'][_0x5d4b34(0x293)](_0x7b3053['x'],_0x7b3053['x']+_0x7b3053[_0x5d4b34(0x305)]-this['width']);},Window_NameBox['prototype'][_0x2a5a53(0x1eb)]=function(){const _0x5d7731=_0x2a5a53;if($gameMessage[_0x5d7731(0x363)]())return;this[_0x5d7731(0x1dd)]=this['_relativePosition']||0x0;const _0x4457c3=VisuMZ[_0x5d7731(0x283)][_0x5d7731(0x2c2)][_0x5d7731(0x336)][_0x5d7731(0x19c)],_0xe9ad3f=VisuMZ[_0x5d7731(0x283)][_0x5d7731(0x2c2)][_0x5d7731(0x336)]['NameBoxWindowOffsetY'],_0x1dde5b=(0x5-this['_relativePosition'])/0x5;this['x']+=Math[_0x5d7731(0x1d4)](_0x4457c3*_0x1dde5b),this['y']+=_0xe9ad3f;},Window_NameBox[_0x2a5a53(0x1f8)][_0x2a5a53(0x3b5)]=function(){const _0x4d1e06=_0x2a5a53,_0x3130f0=this[_0x4d1e06(0x37a)],_0x2689b1=_0x3130f0['y'],_0x5e1276=VisuMZ[_0x4d1e06(0x283)][_0x4d1e06(0x2c2)]['General']['NameBoxWindowOffsetY'];_0x2689b1>this['y']&&_0x2689b1<this['y']+this[_0x4d1e06(0x354)]-_0x5e1276&&(this['y']=_0x3130f0['y']+_0x3130f0[_0x4d1e06(0x354)]);},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x299)]=Window_NameBox[_0x2a5a53(0x1f8)][_0x2a5a53(0x237)],Window_NameBox[_0x2a5a53(0x1f8)][_0x2a5a53(0x237)]=function(){const _0x1443ef=_0x2a5a53;this['_relativePosition']=0x0,VisuMZ['MessageCore'][_0x1443ef(0x299)][_0x1443ef(0x222)](this);},Window_ChoiceList[_0x2a5a53(0x1f8)]['isWordWrapEnabled']=function(){return![];},Window_ChoiceList[_0x2a5a53(0x1f8)]['isAutoColorAffected']=function(){return!![];},Window_ChoiceList[_0x2a5a53(0x1f8)][_0x2a5a53(0x239)]=function(){return $gameSystem['getChoiceListLineHeight']();},Window_ChoiceList[_0x2a5a53(0x1f8)][_0x2a5a53(0x194)]=function(){const _0xf9c2ca=_0x2a5a53;return $gameSystem[_0xf9c2ca(0x320)]();},Window_ChoiceList[_0x2a5a53(0x1f8)]['start']=function(){const _0x34a748=_0x2a5a53;this['refresh'](),this[_0x34a748(0x20c)](),this[_0x34a748(0x1c4)](),this[_0x34a748(0x386)]();},Window_ChoiceList[_0x2a5a53(0x1f8)][_0x2a5a53(0x237)]=function(){const _0x210a9c=_0x2a5a53;this['clearCommandList'](),this[_0x210a9c(0x19f)](),this[_0x210a9c(0x37a)]&&(this[_0x210a9c(0x2e8)](),this[_0x210a9c(0x34d)]()),this[_0x210a9c(0x1ae)](),this[_0x210a9c(0x24c)](),this[_0x210a9c(0x266)](),Window_Selectable['prototype'][_0x210a9c(0x237)][_0x210a9c(0x222)](this);},Window_ChoiceList[_0x2a5a53(0x1f8)][_0x2a5a53(0x19f)]=function(){const _0x326af5=_0x2a5a53,_0x2bd4ab=$gameMessage[_0x326af5(0x373)]();let _0x588d8c=0x0;for(const _0x3c741b of _0x2bd4ab){if(this[_0x326af5(0x30c)](_0x3c741b)){const _0x4708b8=_0x3c741b,_0x366311=this[_0x326af5(0x2e6)](_0x3c741b);this[_0x326af5(0x2ff)](_0x4708b8,_0x326af5(0x1d6),_0x366311,_0x588d8c);}_0x588d8c++;}},Window_ChoiceList[_0x2a5a53(0x1f8)][_0x2a5a53(0x30c)]=function(_0x28a145){const _0x202ca0=_0x2a5a53;if(_0x28a145['match'](/<HIDE>/i))return![];if(_0x28a145[_0x202ca0(0x2be)](/<SHOW>/i))return!![];if(_0x28a145[_0x202ca0(0x2be)](/<SHOW[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x59af57=JSON[_0x202ca0(0x1b5)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0xe4d1e2 of _0x59af57){if(!$gameSwitches[_0x202ca0(0x34e)](_0xe4d1e2))return![];}return!![];}if(_0x28a145[_0x202ca0(0x2be)](/<SHOW ALL[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x3a18f2=JSON[_0x202ca0(0x1b5)]('['+RegExp['$1'][_0x202ca0(0x2be)](/\d+/g)+']');for(const _0x2706e6 of _0x3a18f2){if(!$gameSwitches[_0x202ca0(0x34e)](_0x2706e6))return![];}return!![];}if(_0x28a145[_0x202ca0(0x2be)](/<SHOW ANY[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x38d937=JSON['parse']('['+RegExp['$1'][_0x202ca0(0x2be)](/\d+/g)+']');for(const _0x4b4c56 of _0x38d937){if($gameSwitches[_0x202ca0(0x34e)](_0x4b4c56))return!![];}return![];}if(_0x28a145['match'](/<HIDE[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x21a90e=JSON[_0x202ca0(0x1b5)]('['+RegExp['$1'][_0x202ca0(0x2be)](/\d+/g)+']');for(const _0x32891f of _0x21a90e){if(!$gameSwitches['value'](_0x32891f))return!![];}return![];}if(_0x28a145['match'](/<HIDE ALL[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x2ea3d1=JSON['parse']('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x2c9f20 of _0x2ea3d1){if(!$gameSwitches[_0x202ca0(0x34e)](_0x2c9f20))return!![];}return![];}if(_0x28a145['match'](/<HIDE ANY[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x3fa638=JSON['parse']('['+RegExp['$1'][_0x202ca0(0x2be)](/\d+/g)+']');for(const _0x22fe78 of _0x3fa638){if($gameSwitches['value'](_0x22fe78))return![];}return!![];}return!![];},Window_ChoiceList[_0x2a5a53(0x1f8)][_0x2a5a53(0x2e6)]=function(_0x587e9f){const _0x3b728f=_0x2a5a53;if(_0x587e9f['match'](/<DISABLE>/i))return![];if(_0x587e9f['match'](/<ENABLE>/i))return!![];if(_0x587e9f[_0x3b728f(0x2be)](/<ENABLE[ ](?:SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0xaf37aa=JSON[_0x3b728f(0x1b5)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x430f6e of _0xaf37aa){if(!$gameSwitches[_0x3b728f(0x34e)](_0x430f6e))return![];}return!![];}if(_0x587e9f[_0x3b728f(0x2be)](/<ENABLE ALL[ ](?:SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x2893ec=JSON[_0x3b728f(0x1b5)]('['+RegExp['$1'][_0x3b728f(0x2be)](/\d+/g)+']');for(const _0x298a47 of _0x2893ec){if(!$gameSwitches[_0x3b728f(0x34e)](_0x298a47))return![];}return!![];}if(_0x587e9f[_0x3b728f(0x2be)](/<ENABLE ANY[ ](?:SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x33d84c=JSON[_0x3b728f(0x1b5)]('['+RegExp['$1'][_0x3b728f(0x2be)](/\d+/g)+']');for(const _0x185262 of _0x33d84c){if($gameSwitches['value'](_0x185262))return!![];}return![];}if(_0x587e9f[_0x3b728f(0x2be)](/<DISABLE[ ](?:SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x32b83f=JSON[_0x3b728f(0x1b5)]('['+RegExp['$1'][_0x3b728f(0x2be)](/\d+/g)+']');for(const _0x255589 of _0x32b83f){if(!$gameSwitches[_0x3b728f(0x34e)](_0x255589))return!![];}return![];}if(_0x587e9f[_0x3b728f(0x2be)](/<DISABLE ALL[ ](?:SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0xdff809=JSON[_0x3b728f(0x1b5)]('['+RegExp['$1'][_0x3b728f(0x2be)](/\d+/g)+']');for(const _0x5dc68e of _0xdff809){if(!$gameSwitches[_0x3b728f(0x34e)](_0x5dc68e))return!![];}return![];}if(_0x587e9f[_0x3b728f(0x2be)](/<DISABLE ANY[ ](?:SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x177a43=JSON[_0x3b728f(0x1b5)]('['+RegExp['$1'][_0x3b728f(0x2be)](/\d+/g)+']');for(const _0x2b6217 of _0x177a43){if($gameSwitches[_0x3b728f(0x34e)](_0x2b6217))return![];}return!![];}return!![];},VisuMZ[_0x2a5a53(0x283)][_0x2a5a53(0x216)]=Window_ChoiceList[_0x2a5a53(0x1f8)][_0x2a5a53(0x2e8)],Window_ChoiceList['prototype'][_0x2a5a53(0x2e8)]=function(){const _0x5c9cc8=_0x2a5a53;VisuMZ[_0x5c9cc8(0x283)][_0x5c9cc8(0x216)][_0x5c9cc8(0x222)](this),this[_0x5c9cc8(0x2d3)]();},Window_ChoiceList[_0x2a5a53(0x1f8)][_0x2a5a53(0x34d)]=function(){const _0x5967f4=_0x2a5a53;if(!this['_cancelButton'])return;const _0x30273d=0x8,_0x967784=this[_0x5967f4(0x24e)],_0x17f85d=this['x']+this[_0x5967f4(0x305)],_0x23da72=Math[_0x5967f4(0x1d4)]((Graphics[_0x5967f4(0x305)]-Graphics[_0x5967f4(0x344)])/0x2);_0x17f85d>=Graphics['boxWidth']+_0x23da72-_0x967784[_0x5967f4(0x305)]+_0x30273d?_0x967784['x']=-_0x967784[_0x5967f4(0x305)]-_0x30273d:_0x967784['x']=this[_0x5967f4(0x305)]+_0x30273d,_0x967784['y']=this[_0x5967f4(0x354)]/0x2-_0x967784[_0x5967f4(0x354)]/0x2;},VisuMZ[_0x2a5a53(0x283)]['Window_ChoiceList_windowX']=Window_ChoiceList[_0x2a5a53(0x1f8)][_0x2a5a53(0x27f)],Window_ChoiceList[_0x2a5a53(0x1f8)]['windowX']=function(){const _0x5cab2f=_0x2a5a53;return this[_0x5cab2f(0x37a)]?this[_0x5cab2f(0x26a)]():VisuMZ[_0x5cab2f(0x283)][_0x5cab2f(0x2e7)]['call'](this);},Window_ChoiceList[_0x2a5a53(0x1f8)][_0x2a5a53(0x26a)]=function(){const _0x235ac3=_0x2a5a53,_0x1ecbb9=$gameMessage[_0x235ac3(0x21d)]();if(_0x1ecbb9===0x1)return(Graphics[_0x235ac3(0x344)]-this[_0x235ac3(0x2b3)]())/0x2;else return _0x1ecbb9===0x2?this[_0x235ac3(0x37a)]['x']+this[_0x235ac3(0x37a)][_0x235ac3(0x305)]-this[_0x235ac3(0x2b3)]():this[_0x235ac3(0x37a)]['x'];},Window_ChoiceList['prototype'][_0x2a5a53(0x2b3)]=function(){const _0x525e22=_0x2a5a53,_0x364df8=(this['maxChoiceWidth']()+this[_0x525e22(0x30b)]())*this['maxCols']()+this[_0x525e22(0x394)]*0x2;return Math[_0x525e22(0x238)](_0x364df8,Graphics[_0x525e22(0x305)]);},Window_ChoiceList['prototype'][_0x2a5a53(0x268)]=function(){const _0xc17313=_0x2a5a53,_0x46c921=Math[_0xc17313(0x2a2)]($gameMessage[_0xc17313(0x373)]()[_0xc17313(0x3a8)]/this[_0xc17313(0x194)]());return Math[_0xc17313(0x238)](_0x46c921,this['maxLines']());},Window_ChoiceList['prototype'][_0x2a5a53(0x1b4)]=function(){const _0x2b3799=_0x2a5a53,_0x3897cf=this[_0x2b3799(0x37a)],_0x5d4dad=_0x3897cf?_0x3897cf['y']:0x0,_0x2573ab=_0x3897cf?_0x3897cf['height']:0x0,_0xa55cf6=Graphics[_0x2b3799(0x2e0)]/0x2;return _0x5d4dad<_0xa55cf6&&_0x5d4dad+_0x2573ab>_0xa55cf6?0x4:$gameSystem[_0x2b3799(0x383)]();},Window_ChoiceList[_0x2a5a53(0x1f8)][_0x2a5a53(0x27a)]=function(){const _0x262edb=_0x2a5a53;let _0x2e618f=0x60;for(const _0x293f20 of this[_0x262edb(0x209)]){const _0x150670=_0x293f20[_0x262edb(0x25e)],_0x41a7e2=this[_0x262edb(0x233)](_0x150670)[_0x262edb(0x305)],_0x1ffb07=Math['ceil'](_0x41a7e2)+this['itemPadding']()*0x2;_0x2e618f<_0x1ffb07&&(_0x2e618f=_0x1ffb07);}return _0x2e618f;},Window_ChoiceList[_0x2a5a53(0x1f8)][_0x2a5a53(0x2ca)]=function(_0x44d0a6){const _0x1d999c=_0x2a5a53,_0x323df4=this[_0x1d999c(0x323)](_0x44d0a6),_0x2d970d=$gameSystem[_0x1d999c(0x3a7)]()!=='default'?_0x1d999c(0x2cd)['format']($gameSystem['getChoiceListTextAlign']()):'',_0x2adba9=_0x2d970d+this['commandName'](_0x44d0a6);this[_0x1d999c(0x197)](this[_0x1d999c(0x2a6)](_0x44d0a6)),this[_0x1d999c(0x226)](_0x2adba9,_0x323df4['x'],_0x323df4['y'],_0x323df4[_0x1d999c(0x305)]);},Window_ChoiceList['prototype']['callOkHandler']=function(){const _0x8fa3ee=_0x2a5a53;$gameMessage[_0x8fa3ee(0x205)](this[_0x8fa3ee(0x350)]()),this[_0x8fa3ee(0x37a)][_0x8fa3ee(0x32f)](),this[_0x8fa3ee(0x190)]();};