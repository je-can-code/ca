//=============================================================================
// VisuStella MZ - Core Engine
// VisuMZ_0_CoreEngine.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_0_CoreEngine = true;

var VisuMZ = VisuMZ || {};
VisuMZ.CoreEngine = VisuMZ.CoreEngine || {};
VisuMZ.CoreEngine.version = 1.24;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 0] [Version 1.24] [CoreEngine]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Core_Engine_VisuStella_MZ
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * The Core Engine plugin is designed to fix any bugs that may have slipped
 * past RPG Maker MZ's source code and to give game devs more control over
 * RPG Maker MZ's various features, ranging from mechanics to aesthetics to
 * quality of life improvements.
 *
 * Features include all (but not limited to) the following:
 *
 * * Bug fixes for the problems existing in the RPG Maker MZ base code.
 * * Failsafes added for Script Call related event commands.
 * * Lots of Quality of Life Settings that can be activated through the
 *   Plugin Parameters.
 * * Control over the various Text Colors used throughout the game.
 * * Change up the maximum amount of gold carried, give it an icon attached to
 *   the label, and include text for overlap specifics.
 * * Preload images as the game boots up.
 * * Add specific background images for menus found throughout the game.
 * * A button assist window will appear at the top or bottom of the screen,
 *   detailing which buttons do what when inside a menu. This feature can be
 *   turned off.
 * * Choose which in-game battler parameters to display inside menus (ie ATK,
 *   DEF, AGI, etc.) and determine their maximum values, along with plenty of
 *   notetags to give more control over parameter, x-parameter, s-parameter
 *   bonuses through equipment, states, and other trait objects.
 * * Control over how the UI objects appear (such as the menu button, cancel
 *   button, left/right actor switch buttons).
 * * Reposition actors and enemies if the battle resolution is larger.
 * * Allow class names and nicknames to support text codes when displayed.
 * * Determine how windows behave in the game, if they will mask other windows,
 *   their line height properties, and more.
 *
 * ============================================================================
 * Requirements
 * ============================================================================
 *
 * This plugin is made for RPG Maker MZ. This will not work in other iterations
 * of RPG Maker.
 *
 * ------ Tier 0 ------
 *
 * This plugin is a Tier 0 plugin. Place it under other plugins of lower tier
 * value on your Plugin Manager list (ie: 0, 1, 2, 3, 4, 5). This is to ensure
 * that your plugins will have the best compatibility with the rest of the
 * VisuStella MZ Plugin library.
 *
 * ============================================================================
 * Important Changes: Bug Fixes
 * ============================================================================
 *
 * This plugin also serves to fix various bugs found in RPG Maker MZ that have
 * been unaddressed or not yet taken care of. The following is a list of bugs
 * that have been fixed by this plugin:
 *
 * ---
 *
 * Attack Skill Trait
 *
 * Enemies are unaffected by the Attack Skill Trait. This means if they have
 * an Attack action, they will always use Attack over and over even if their
 * Attack Skill Trait has been changed. This plugin will change it up so that
 * the Attack skill will comply with whatever their Attack Skill Trait's skill
 * is set to.
 *
 * ---
 *
 * Auto Battle Actor Skill Usage
 *
 * If an actor with Auto Battle has access to a skill but not have any access
 * to that skill's type, that actor will still be able to use the skill during
 * Auto Battle despite the fact that the actor cannot use that skill during
 * manual input.
 *
 * ---
 * 
 * Auto Battle Lock Up
 * 
 * If an auto battle Actor fights against an enemy whose DEF/MDF is too high,
 * they will not use any actions at all. This can cause potential game freezing
 * and softlocks. This plugin will change that and have them default to a
 * regular Attack.
 * 
 * ---
 * 
 * Gamepad Repeat Input
 * 
 * Cleared inputs on gamepads do not have a downtime and will trigger the
 * following input frame. The causes problems with certain RPG Maker MZ menus
 * where the inputs have to be cleared as the next immediate frame will have
 * them inputted again. This plugin changes it so that whenever inputs are
 * cleared, there is a downtime equal to the keyboard clear frames before the
 * gamepad input is registered once more.
 * 
 * ---
 *
 * Move Picture, Origin Differences
 *
 * If a Show Picture event command is made with an Origin setting of
 * "Upper Left" and a Move Picture event command is made afterwards with an
 * Origin setting of "Center", RPG Maker MZ would originally have it instantly
 * jump into the new origin setting without making a clean transition between
 * them. This plugin will create that clean transition between origins.
 *
 * ---
 * 
 * Timer Sprite
 * 
 * By default, RPG Maker MZ adds Sprite_Timer into its spriteset, either for
 * maps or for battles. There is one major problem with this: when spritesets
 * are affected by filters, zooms, and/or blurs, this hinders how readable the
 * timer sprite is, making the information perceived by the player to be much
 * harder than it needs to be. The Core Engine adds the sprite to the parent
 * scene instead of the spriteset to ensure it's unobscured by anything else.
 * 
 * ---
 * 
 * Unusable Battle Items
 * 
 * If any party member is able to use an item in battle, then all party members
 * are able to use said item, even if that party member is supposed to be
 * unable to use that item. This is now changed so that battle items are
 * checked on an individual basis and not on a party-wide basis.
 * 
 * ---
 *
 * ============================================================================
 * Major Changes: New Hard-Coded Features
 * ============================================================================
 *
 * This plugin adds some new hard-coded features to RPG Maker MZ's functions.
 * The following is a list of them.
 *
 * ---
 *
 * Scroll-Linked Pictures
 *
 * - If a Parallax has a ! at the start of its filename, it is bound to the map
 * scrolling. The same thing now happens with pictures. If a Picture has a ! at
 * the start of its filename, it is bound to the map's scrolling as well.
 *
 * ---
 *
 * Movement Route Scripts
 *
 * - If code in a Movement Route Script command fails, instead of crashing the
 * game, it will now act as if nothing happened except to display the cause of
 * the error inside the console.
 *
 * ---
 * 
 * Script Call Failsafes
 * 
 * - If code found in Conditional Branches, Control Variables, and/or Script
 * Calls fail to activate, instead of crashing the game, it will now act as if
 * nothing happened except to display the cause of the error inside the
 * console.
 * 
 * ---
 * 
 * Digit Grouping
 * 
 * - There exists an option to change how numbers are displayed and converted
 * in your game. This option can be enabled or disabled by going into the
 * Plugin Manager > VisuMZ_0_OptionsCore > Quality of Life Settings >
 * Digit Grouping and toggling on/off whichever ones you want.
 * 
 * - Digit Grouping will follow the rules of whatever country/locale the Plugin
 * Parameters are set to. If it's to default 'en-US', then 1234567.123456 will
 * become 1,234,567.123456. Set it to 'es-ES' and it becomes 1.234.567,123456
 * instead.
 * 
 * - This uses JavaScript's Number.toLocaleString() function and will therefore
 * follow whatever rules it has. This means if there are trailing zeroes at the
 * end of a decimal, it will cut them off. Numbers like 123.45000 will become
 * 123.45 instead. Excess numbers past 6 decimal places will be rounded. A
 * number like 0.123456789 will become 0.123457 instead.
 * 
 * - Numbers in between [ and ], < and > will be excluded from digit grouping
 * in order for text codes to be preserved accurately. \I[1234] will remain as
 * \I[1234].
 * 
 * - If you would like to enter in a number without digit grouping, surround it
 * with {{ and }}. Typing in {{1234567890}} will yield 1234567890.
 * 
 * ---
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * The following are notetags that have been added through this plugin. These
 * notetags will not work with your game if this plugin is OFF or not present.
 *
 * === Actors ===
 *
 * Parameter limits can be adjusted in the Plugin Parameters, but this won't
 * lift the ability to change the values of an actor's initial or max level
 * past the editor's limits. Instead, this must be done through the usage of
 * notetags to accomplish the feat.
 *
 * ---
 *
 * <Max Level: x>
 *
 * - Used for: Actor Notetags
 * - Replace 'x' with an integer to determine the actor's max level.
 * - This allows you to go over the database limit of 99.
 * - If this notetag isn't used, default to the actor's database value.
 *
 * ---
 *
 * <Initial Level: x>
 *
 * - Used for: Actor Notetags
 * - Replace 'x' with an integer to determine the actor's initial level.
 * - This allows you to go over the database limit of 99.
 * - If this notetag isn't used, default to the actor's database value.
 *
 * ---
 *
 * === Classes ===
 *
 * As actor levels can now surpass 99 due to the notetag system, there may be
 * some skills you wish certain classes can learn upon reaching higher levels
 * past 99, too.
 *
 * ---
 * 
 * <Learn At Level: x>
 *
 * - Used for: Class Skill Learn Notetags
 * - Replace 'x' with an integer to determine the level this class will learn
 *   the associated skill at.
 * - This allows you to go over the database limit of 99.
 * - If this notetag isn't used, default to the class's database value.
 *
 * ---
 *
 * === Enemies ===
 *
 * Enemies are now given levels. The levels don't do anything except to serve
 * as a container for a number value. This way, levels can be used in damage
 * formulas (ie. a.atk - b.level) without causing any errors. To give enemies
 * levels, use the notetags below. These notetags also allow you to adjust the
 * base parameters, EXP, and Gold past the database limitations.
 *
 * ---
 *
 * <Level: x>
 *
 * - Used for: Enemy Notetags
 * - Replace 'x' with an integer to determine the enemy's level.
 * - If no level is declared, the level will default to 1.
 *
 * ---
 *
 * <param: x>
 *
 * - Used for: Enemy Notetags
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to alter.
 * - Replace 'x' with an integer to set an enemy's 'param' base value.
 * - This will overwrite the enemy's database value and can exceed the original
 *   value limitation in the database.
 * - If these notetags aren't used, default to the enemy's database value.
 *
 * ---
 *
 * <EXP: x>
 * <Gold: x>
 *
 * - Used for: Enemy Notetags
 * - Replace 'x' with an integer to determine the enemy's EXP or Gold values.
 * - This will overwrite the enemy's database value and can exceed the original
 *   value limitation in the database.
 * - If these notetags aren't used, default to the enemy's database value.
 *
 * ---
 * 
 * === Animations ===
 * 
 * Animations in RPG Maker MZ are done by Effekseer and the animation system
 * has been revamped. However, the animations are only centered on the targets
 * now, and cannot be attached to the head or foot. Insert these tags into
 * the names of the animations in the database to adjust their positions.
 * 
 * ---
 * 
 * <Head>
 * <Foot>
 * 
 * - Used for: Animation Name Tags
 * - Will set the animation to anchor on top of the sprite (if <Head> is used)
 *   or at the bottom of the sprite (if <Foot> is used).
 * 
 * ---
 * 
 * <Anchor X: x>
 * <Anchor Y: y>
 * 
 * <Anchor: x, y>
 * 
 * - Used for: Animation Name Tags
 * - Will anchor the animation at a specific point within the sprite based on
 *   the 'x' and 'y' values.
 * - Replace 'x' and 'y' with numeric values representing their positions based
 *   on a rate where 0.0 is the furthest left/up (x, y respectively) to 1.0 for
 *   the furthest right/down (x, y respectively).
 * 
 * Examples:
 * 
 * <Anchor X: 0.4>
 * <Anchor Y: 0.8>
 * 
 * <Anchor: 0.2, 0.9>
 * 
 * ---
 * 
 * <Offset X: +x>
 * <Offset X: -x>
 * <Offset Y: +y>
 * <Offset Y: -y>
 * 
 * <Offset: +x, +y>
 * <Offset: -x, -y>
 * 
 * - Used for: Animation Name Tags
 * - Will anchor the animation to be offset by an exact number of pixels.
 * - This does the same the editor does, except it lets you input values
 *   greater than 999 and lower than -999.
 * - Replace 'x' and 'y' with numeric values the exact number of pixels to
 *   offset the animation's x and y coordinates by.
 * 
 * Examples:
 * 
 * <Offset X: +20>
 * <Offset Y: -50>
 * 
 * <Offset: +10, -30>
 * 
 * ---
 *
 * === Quality of Life ===
 *
 * By default, RPG Maker MZ does not offer an encounter step minimum after a
 * random encounter has finished. This means that one step immediately after
 * finishing a battle, the player can immediately enter another battle. The
 * Quality of Life improvement: Minimum Encounter Steps allows you to set a
 * buffer range between battles for the player to have some breathing room.
 *
 * ---
 *
 * <Minimum Encounter Steps: x>
 *
 * - Used for: Map Notetags
 * - Replace 'x' with the minimum number of steps before the player enters a
 *   random encounter on that map.
 * - If this notetag is not used, then the minimum encounter steps for the map
 *   will default to Quality of Life Settings => Encounter Rate Min.
 *
 * ---
 *
 * Tile shadows are automatically added to certain tiles in the map editor.
 * These tile shadows may or may not fit some types of maps. You can turn them
 * on/off with the Quality of Life Plugin Parameters or you can override the
 * settings with the following notetags:
 *
 * ---
 *
 * <Show Tile Shadows>
 * <Hide Tile Shadows>
 *
 * - Used for: Map Notetags
 * - Use the respective notetag for the function you wish to achieve.
 * - If this notetag is not used, then the minimum encounter steps for the map
 *   will default to Quality of Life Settings => No Tile Shadows.
 *
 * ---
 *
 * === Basic, X, and S Parameters ===
 *
 * A battler's parameters, or stats as some devs know them as, are the values
 * that determine how a battler performs. These settings allow you to alter
 * behaviors and give boosts to trait objects in a more controlled manner.
 *
 * ---
 *
 * <param Plus: +x>
 * <param Plus: -x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Adds or subtracts 'x' to 'param' plus value when calculating totals.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to modify.
 * - Replace 'x' with an integer on how much to adjust the parameter by.
 * - This is used to calculate the 'plus' portion in the Parameter Settings =>
 *   Basic Parameter => Formula.
 *
 * ---
 *
 * <param Rate: x%>
 * <param Rate: x.x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Changes 'param' rate to 'x' to alter the total 'param' value.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to modify.
 * - Replace 'x' with a percentage (ie. 150%) or a rate (ie. 1.5).
 * - This is used to calculate the 'paramRate' portion in Parameter Settings =>
 *   Basic Parameter => Formula.
 *
 * ---
 *
 * <param Flat: +x>
 * <param Flat: -x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Adds or subtracts 'x' to 'param' plus value when calculating totals.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to modify.
 * - Replace 'x' with an integer on how much to adjust the parameter by.
 * - This is used to calculate the 'flatBonus' portion in Parameter Settings =>
 *   Basic Parameter => Formula.
 *
 * ---
 *
 * <param Max: x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Sets max caps for the 'param' to be 'x'. If there are multiple max caps
 *   available to the unit, then the highest will be selected.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to modify.
 * - Replace 'x' with an integer to determine what the max cap should be.
 *
 * ---
 *
 * <xparam Plus: +x%>
 * <xparam Plus: -x%>
 *
 * <xparam Plus: +x.x>
 * <xparam Plus: -x.x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Adds or subtracts 'x' to 'xparam' plus value when calculating totals.
 * - Replace 'xparam' with 'HIT', 'EVA', 'CRI', 'CEV', 'MEV', 'MRF', 'CNT',
 *   'HRG', 'MRG', 'TRG' to determine which X parameter to modify.
 * - Replace 'x' with a percentage (ie. 150%) or a rate (ie. 1.5).
 * - This is used to calculate the 'plus' portion in the Parameter Settings =>
 *   X Parameter => Formula.
 *
 * ---
 *
 * <xparam Rate: x%>
 * <xparam Rate: x.x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Changes 'param' rate to 'x' to alter the total 'xparam' value.
 * - Replace 'xparam' with 'HIT', 'EVA', 'CRI', 'CEV', 'MEV', 'MRF', 'CNT',
 *   'HRG', 'MRG', 'TRG' to determine which X parameter to modify.
 * - Replace 'x' with a percentage (ie. 150%) or a rate (ie. 1.5).
 * - This is used to calculate the 'paramRate' portion in Parameter Settings =>
 *   X Parameter => Formula.
 *
 * ---
 *
 * <xparam Flat: +x%>
 * <xparam Flat: -x%>
 *
 * <xparam Flat: +x.x>
 * <xparam Flat: -x.x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Adds or subtracts 'x' to 'xparam' plus value when calculating totals.
 * - Replace 'xparam' with 'HIT', 'EVA', 'CRI', 'CEV', 'MEV', 'MRF', 'CNT',
 *   'HRG', 'MRG', 'TRG' to determine which X parameter to modify.
 * - Replace 'x' with a percentage (ie. 150%) or a rate (ie. 1.5).
 * - This is used to calculate the 'flatBonus' portion in Parameter Settings =>
 *   X Parameter => Formula.
 *
 * ---
 *
 * <sparam Plus: +x%>
 * <sparam Plus: -x%>
 *
 * <sparam Plus: +x.x>
 * <sparam Plus: -x.x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Adds or subtracts 'x' to 'sparam' plus value when calculating totals.
 * - Replace 'sparam' with 'TGR', 'GRD', 'REC', 'PHA', 'MCR', 'TCR', 'PDR',
 *   'MDR', 'FDR', 'EXR' to determine which S parameter to modify.
 * - Replace 'x' with a percentage (ie. 150%) or a rate (ie. 1.5).
 * - This is used to calculate the 'plus' portion in the Parameter Settings =>
 *   S Parameter => Formula.
 *
 * ---
 *
 * <sparam Rate: x%>
 * <sparam Rate: x.x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Changes 'param' rate to 'x' to alter the total 'sparam' value.
 * - Replace 'sparam' with 'TGR', 'GRD', 'REC', 'PHA', 'MCR', 'TCR', 'PDR',
 *   'MDR', 'FDR', 'EXR' to determine which S parameter to modify.
 * - Replace 'x' with a percentage (ie. 150%) or a rate (ie. 1.5).
 * - This is used to calculate the 'paramRate' portion in Parameter Settings =>
 *   S Parameter => Formula.
 *
 * ---
 *
 * <sparam Flat: +x%>
 * <sparam Flat: -x%>
 *
 * <sparam Flat: +x.x>
 * <sparam Flat: -x.x>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Adds or subtracts 'x' to 'sparam' plus value when calculating totals.
 * - Replace 'sparam' with 'TGR', 'GRD', 'REC', 'PHA', 'MCR', 'TCR', 'PDR',
 *   'MDR', 'FDR', 'EXR' to determine which S parameter to modify.
 * - Replace 'x' with a percentage (ie. 150%) or a rate (ie. 1.5).
 * - This is used to calculate the 'flatBonus' portion in Parameter Settings =>
 *   S Parameter => Formula.
 *
 * === JavaScript Notetags: Basic, X, and S Parameters ===
 *
 * The following are notetags made for users with JavaScript knowledge. These
 * notetags are primarily aimed at Basic, X, and S Parameters.
 *
 * ---
 *
 * <JS param Plus: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'param' plus value.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   plus amount for the parameter's total calculation.
 * - This is used to calculate the 'plus' portion in the Parameter Settings =>
 *   Basic Parameter => Formula.
 *
 * ---
 *
 * <JS param Rate: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'param' rate value.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   param rate amount for the parameter's total calculation.
 * - This is used to calculate the 'paramRate' portion in Parameter Settings =>
 *   Basic Parameter => Formula.
 *
 * ---
 *
 * <JS param Flat: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'param' flat value.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   flat bonus amount for the parameter's total calculation.
 * - This is used to calculate the 'flatBonus' portion in Parameter Settings =>
 *   Basic Parameter => Formula.
 *
 * ---
 *
 * <JS param Max: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to determine what the max cap for 'param' should be. If there
 *   are multiple max caps available to the unit, then the highest is selected.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter to modify.
 * - Replace 'code' with JavaScript code to determine the max cap for the
 *   desired parameter.
 *
 * ---
 *
 * <JS xparam Plus: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'xparam' plus value.
 * - Replace 'xparam' with 'HIT', 'EVA', 'CRI', 'CEV', 'MEV', 'MRF', 'CNT',
 *   'HRG', 'MRG', 'TRG' to determine which X parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   plus amount for the X parameter's total calculation.
 * - This is used to calculate the 'plus' portion in the Parameter Settings =>
 *   X Parameter => Formula.
 *
 * ---
 *
 * <JS xparam Rate: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'xparam' rate value.
 * - Replace 'xparam' with 'HIT', 'EVA', 'CRI', 'CEV', 'MEV', 'MRF', 'CNT',
 *   'HRG', 'MRG', 'TRG' to determine which X parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   param rate amount for the X parameter's total calculation.
 * - This is used to calculate the 'paramRate' portion in Parameter Settings =>
 *   X Parameter => Formula.
 *
 * ---
 *
 * <JS xparam Flat: code>
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'xparam' flat value.
 * - Replace 'xparam' with 'HIT', 'EVA', 'CRI', 'CEV', 'MEV', 'MRF', 'CNT',
 *   'HRG', 'MRG', 'TRG' to determine which X parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   flat bonus amount for the X parameter's total calculation.
 * - This is used to calculate the 'flatBonus' portion in Parameter Settings =>
 *   X Parameter => Formula.
 *
 * ---
 *
 * <JS sparam Plus: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'sparam' plus value.
 * - Replace 'sparam' with 'TGR', 'GRD', 'REC', 'PHA', 'MCR', 'TCR', 'PDR',
 *   'MDR', 'FDR', 'EXR' to determine which S parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   plus amount for the S parameter's total calculation.
 * - This is used to calculate the 'plus' portion in the Parameter Settings =>
 *   S Parameter => Formula.
 *
 * ---
 *
 * <JS sparam Rate: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'sparam' rate value.
 * - Replace 'sparam' with 'TGR', 'GRD', 'REC', 'PHA', 'MCR', 'TCR', 'PDR',
 *   'MDR', 'FDR', 'EXR' to determine which S parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   param rate amount for the S parameter's total calculation.
 * - This is used to calculate the 'paramRate' portion in Parameter Settings =>
 *   S Parameter => Formula.
 *
 * ---
 *
 * <JS sparam Flat: code>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs 'code' to change the 'sparam' flat value.
 * - Replace 'sparam' with 'TGR', 'GRD', 'REC', 'PHA', 'MCR', 'TCR', 'PDR',
 *   'MDR', 'FDR', 'EXR' to determine which S parameter to modify.
 * - Replace 'code' with JavaScript code to determine how much to change the
 *   flat bonus amount for the S parameter's total calculation.
 * - This is used to calculate the 'flatBonus' portion in Parameter Settings =>
 *   S Parameter => Formula.
 *
 * ---
 * 
 * === Battle Setting-Related Notetags ===
 * 
 * These tags will change the settings for battle regardless of how the battle
 * system is set up normally. Insert these tags in either the noteboxes of maps
 * or the names of troops for them to take effect. If both are present for a
 * specific battle, then priority goes to the setting found in the troop name.
 * 
 * ---
 * 
 * <FV>
 * <Front View>
 * <Battle View: FV>
 * <Battle View: Front View>
 * 
 * - Used for: Map Notetags and Troop Name Tags
 * - Changes the perspective of battle to front view for this specific map or
 *   battle.
 * - Make sure you have the enemy image files available in the img/enemies/
 *   folder as they will used instead of the "sv_enemies" graphics.
 * 
 * ---
 * 
 * <SV>
 * <Side View>
 * <Battle View: SV>
 * <Battle View: Side View>
 * 
 * - Used for: Map Notetags and Troop Name Tags
 * - Changes the perspective of battle to side view for this specific map or
 *   battle.
 * - Make sure you have the enemy image files available in the img/sv_enemies/
 *   folder as they will used instead of the "enemies" graphics.
 * - Make sure your actors have "sv_actor" graphics attached to them.
 * 
 * ---
 * 
 * <DTB>
 * <Battle System: DTB>
 * 
 * - Used for: Map Notetags and Troop Name Tags
 * - Changes the battle system to the default battle system (DTB).
 * 
 * ---
 * 
 * <TPB Active>
 * <ATB Active>
 * <Battle System: TPB Active>
 * <Battle System: ATB Active>
 * 
 * - Used for: Map Notetags and Troop Name Tags
 * - Changes the battle system to the time progress battle system (TPB) or
 *   active turn battle system (ATB) if you have VisuMZ_2_BattleSystemATB
 *   installed for the game project.
 * 
 * ---
 * 
 * <CTB>
 * <Battle System: CTB>
 * 
 * <STB>
 * <Battle System: STB>
 * 
 * <BTB>
 * <Battle System: BTB>
 * 
 * <FTB>
 * <Battle System: FTB>
 * 
 * - Used for: Map Notetags and Troop Name Tags
 * - Changes the battle system to the respective battle system as long as you
 *   have those plugins installed in the current project.
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
 * === Game Plugin Commands ===
 * 
 * ---
 *
 * Game: Open URL
 * - Opens a website URL from the game.
 *
 *   URL:
 *   - Where do you want to take the player?
 *
 * ---
 * 
 * === Gold Plugin Commands ===
 * 
 * ---
 *
 * Gold: Gain/Lose
 * - Allows you to give/take more gold than the event editor limit.
 *
 *   Value:
 *   - How much gold should the player gain/lose?
 *   - Use negative values to remove gold.
 *
 * ---
 * 
 * === Picture Plugin Commands ===
 * 
 * ---
 *
 * Picture: Easing Type
 * - Changes the easing type to a number of options.
 *
 *   Picture ID:
 *   - Which picture do you wish to apply this easing to?
 *
 *   Easing Type:
 *   - Select which easing type you wish to apply.
 *
 *   Instructions:
 *   - Insert this Plugin Command after a "Move Picture" event command.
 *   - Turn off "Wait for Completion" in the "Move Picture" event.
 *   - You may have to add in your own "Wait" event command after.
 *
 * ---
 * 
 * Picture: Erase All
 * - Erases all pictures on the screen because it's extremely tedious to do it
 *   one by one.
 * 
 * ---
 * 
 * Picture: Erase Range
 * - Erases all pictures within a range of numbers because it's extremely
 *   tedious to do it one by one.
 * 
 *   Starting ID:
 *   - The starting ID of the pictures to erase.
 * 
 *   Ending ID:
 *   - The ending ID of the pictures to erase.
 * 
 * ---
 * 
 * === Screen Shake Plugin Commands ===
 * 
 * ---
 * 
 * Screen Shake: Custom:
 * - Creates a custom screen shake effect and also sets the following uses of
 *   screen shake to this style.
 * 
 *   Shake Style:
 *   - Select shake style type.
 *   - Original
 *   - Random
 *   - Horizontal
 *   - Vertical
 * 
 *   Power:
 *   - Power level for screen shake.
 * 
 *   Speed:
 *   - Speed level for screen shake.
 * 
 *   Duration:
 *   - Duration of screenshake.
 *   - You can use code as well.
 * 
 *   Wait for Completion:
 *   - Wait until completion before moving onto the next event?
 * 
 * ---
 * 
 * === System Plugin Commands ===
 * 
 * ---
 *
 * System: Battle System Change
 * - Switch to a different battle system in-game.
 *
 *   Change To:
 *   - Choose which battle system to switch to.
 *     - Database Default (Use game database setting)
 *     - -
 *     - DTB: Default Turn Battle
 *     - TPB Active: Time Progress Battle (Active)
 *     - TPB Wait: Time Progress Battle (Wait)
 *     - -
 *     - BTB: Brave Turn Battle (Req VisuMZ_2_BattleSystemBTB)
 *     - CTB: Charge Turn Battle (Req VisuMZ_2_BattleSystemCTB)
 *     - OTB: Order Turn Battle (Req VisuMZ_2_BattleSystemOTB)
 *     - STB: Standard Turn Battle (Req VisuMZ_2_BattleSystemSTB)
 *
 * ---
 * 
 * System: Load Images
 * - Allows you to (pre) load up images ahead of time.
 *
 *   img/animations/:
 *   img/battlebacks1/:
 *   img/battlebacks2/:
 *   img/enemies/:
 *   img/faces/:
 *   img/parallaxes/:
 *   img/pictures/:
 *   img/sv_actors/:
 *   img/sv_enemies/:
 *   img/system/:
 *   img/tilesets/:
 *   img/titles1/:
 *   img/titles2/:
 *   - Which files do you wish to load from this directory?
 * 
 * ---
 *
 * System: Main Font Size
 * - Set the game's main font size.
 *
 *   Change To:
 *   - Change the font size to this number.
 *
 * ---
 *
 * System: Side View Battle
 * - Switch between Front View or Side View for battle.
 *
 *   Change To:
 *   - Choose which view type to switch to.
 *
 * ---
 *
 * System: Window Padding
 * - Change the game's window padding amount.
 *
 *   Change To:
 *   - Change the game's standard window padding to this value.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Quality of Life Settings
 * ============================================================================
 *
 * A variety of (optional) settings and changes are added with the Core Engine
 * to improve the quality of life for both the game devs and players alike.
 *
 * ---
 *
 * Play Test
 * 
 *   New Game on Boot:
 *   - Automatically start a new game on Play Test?
 *   - Only enabled during Play Test.
 *
 *   No Play Test Mode:
 *   - Force the game to be out of Play Test mode when play testing.
 * 
 *   Open Console on Boot:
 *   - Open the Debug Console upon booting up your game?
 *   - Only enabled during Play Test.
 *
 *   F6: Toggle Sound:
 *   - F6 Key Function: Turn on all sound to 100% or to 0%, toggling between
 *     the two.
 *   - Only enabled during Play Test.
 *
 *   F7: Toggle Fast Mode:
 *   - F7 Key Function: Toggle fast mode.
 *   - Only enabled during Play Test.
 *
 *   New Game > Common Event:
 *   - Runs a common event each time a new game is started.
 *   - Only enabled during Play Test.
 *
 * ---
 *
 * Digit Grouping
 *
 *   Standard Text:
 *   - Make numbers like 1234567 appear like 1,234,567 for standard text
 *     inside windows?
 *
 *   Ex Text:
 *   - Make numbers like 1234567 appear like 1,234,567 for ex text,
 *     written through drawTextEx (like messages)?
 *
 *   Damage Sprites:
 *   - Make numbers like 1234567 appear like 1,234,567 for in-battle
 *     damage sprites?
 *
 *   Gauge Sprites:
 *   - Make numbers like 1234567 appear like 1,234,567 for visible gauge
 *     sprites such as HP, MP, and TP gauges?
 * 
 *   Country/Locale
 *   - Base the digit grouping on which country/locale?
 *   - This will follow all of the digit grouping rules found here:
 *     https://www.w3schools.com/JSREF/jsref_tolocalestring_number.asp
 *
 * ---
 *
 * Player Benefit
 *
 *   Encounter Rate Min:
 *   - Minimum number of steps the player can take without any
 *     random encounters.
 *
 *   Escape Always:
 *   - If the player wants to escape a battle, let them escape the battle
 *     with 100% chance.
 *
 *   Accuracy Formula:
 *   - Accuracy formula calculation change to
 *     Skill Hit% * (User HIT - Target EVA) for better results.
 *
 *   Accuracy Boost:
 *   - Boost HIT and EVA rates in favor of the player.
 *
 *   Level Up -> Full HP:
 *   Level Up -> Full MP:
 *   - Recovers full HP or MP when an actor levels up.
 *
 * ---
 *
 * Misc
 * 
 *   Anti-Zoom Pictures:
 *   - If on, prevents pictures from being affected by zoom.
 *
 *   Font Shadows:
 *   - If on, text uses shadows instead of outlines.
 *
 *   Font Smoothing:
 *   - If on, smoothes fonts shown in-game.
 *
 *   Key Item Protection:
 *   - If on, prevents Key Items from being able to be sold and from being
 *     able to be consumed.
 *
 *   Modern Controls:
 *   - If on, allows usage of the Home/End buttons.
 *   - Home would scroll to the first item on a list.
 *   - End would scroll to the last item on a list.
 *   - Shift + Up would page up.
 *   - Shift + Down would page down.
 * 
 *   NewGame > CommonEvent:
 *   - Runs a common event each time a new game during any session is started.
 *   - Applies to all types of sessions, play test or not.
 *
 *   No Tile Shadows:
 *   - Removes tile shadows from being displayed in-game.
 *
 *   Pixel Image Rendering:
 *   - If on, pixelates the image rendering (for pixel games).
 *
 *   Require Focus?
 *   - Requires the game to be focused? If the game isn't focused, it will
 *     pause if it's not the active window.
 *
 *   Smart Event Collision:
 *   - Makes events only able to collide with one another if they're
 *    'Same as characters' priority.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Battle System
 * ============================================================================
 * 
 * Choose which battle system to use for your game.
 * 
 * ---
 * 
 *   Database Default (Use game database setting)
 * 
 *   -
 * 
 *   DTB: Default Turn Battle
 *   TPB Active: Time Progress Battle (Active)
 *   TPB Wait: Time Progress Battle (Wait)
 * 
 *   -
 * 
 *   BTB: Brave Turn Battle (Req VisuMZ_2_BattleSystemBTB)
 *   CTB: Charge Turn Battle (Req VisuMZ_2_BattleSystemCTB)
 *   OTB: Order Turn Battle (Req VisuMZ_2_BattleSystemOTB)
 *   STB: Standard Turn Battle (Req VisuMZ_2_BattleSystemSTB)
 * 
 *   -
 * 
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Color Settings
 * ============================================================================
 *
 * These settings allow you, the game dev, to have more control over which
 * colors appear for what conditions found in the game. You can use regular
 * numbers to use the colors predetermined by the game's Window Skin or you
 * can use the #rrggbb format for a hex color code.
 *
 * You can find out what hex codes belong to which color from this website:
 * https://htmlcolorcodes.com/
 *
 * ---
 *
 * Basic Colors
 * - These are colors that almost never change and are used globally throughout
 *   the in-game engine.
 *
 *   Normal:
 *   System:
 *   Crisis:
 *   Death:
 *   Gauge Back:
 *   HP Gauge:
 *   MP Gauge:
 *   MP Cost:
 *   Power Up:
 *   Power Down:
 *   CT Gauge:
 *   TP Gauge:
 *   Pending Color:
 *   EXP Gauge:
 *   MaxLv Gauge:
 *   - Use #rrggbb for custom colors or regular numbers
 *   for text colors from the Window Skin.
 *
 * ---
 *
 * Alpha Colors:
 * - These are colors that have a bit of transparency to them and are specified
 *   by the 'rgba(red, green, blue, alpha)' format.
 * - Replace 'red' with a number between 0-255 (integer).
 * - Replace 'green' with a number between 0-255 (integer).
 * - Replace 'blue' with a number between 0-255 (integer).
 * - Replace 'alpha' with a number between 0 and 1 (decimal).
 * 
 *   Window Font Outline:
 *   Gauge Number Outline:
 *   Dim Color:
 *   Item Back Color:
 *   - Colors with a bit of alpha settings.
 *   - Format rgba(0-255, 0-255, 0-255, 0-1)
 *
 * ---
 *
 * Conditional Colors:
 * - These require a bit of JavaScript knowledge. These determine what colors
 *   to use under which situations and uses such as different values of HP, MP,
 *   TP, for comparing equipment, and determine damage popup colors.
 * 
 *   JS: Actor HP Color:
 *   JS: Actor MP Color:
 *   JS: Actor TP Color:
 *   - Code used for determining what HP, MP, or TP color to use for actors.
 *
 *   JS: Parameter Change:
 *   - Code used for determining whatcolor to use for parameter changes.
 *
 *   JS: Damage Colors:
 *   - Code used for determining what color to use for damage types.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Gold Settings
 * ============================================================================
 *
 * Gold is the main currency in RPG Maker MZ. The settings provided here will
 * determine how Gold appears in the game and certain behaviors Gold has.
 *
 * ---
 *
 * Gold Settings
 *
 *   Gold Max:
 *   - Maximum amount of Gold the party can hold.
 *   - Default 99999999
 *
 *   Gold Font Size:
 *   - Font size used for displaying Gold inside Gold Windows.
 *   - Default: 26
 *
 *   Gold Icon:
 *   - Icon used to represent Gold.
 *   - Use 0 for no icon.
 *
 *   Gold Overlap:
 *   - Text used too much Gold to fit in the window.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Image Loading
 * ============================================================================
 *
 * Not all images are loaded at once in-game. RPG Maker MZ uses asynchronous
 * loading which means images are loaded when needed. This may cause delays in
 * when you want certain images to appear. However, if an image is loaded
 * beforehand, they can be used immediately provided they aren't removed from
 * the image cache.
 *
 * ---
 *
 * Image Loading
 *
 *   img/animations/:
 *   img/battlebacks1/:
 *   img/battlebacks2/:
 *   img/enemies/:
 *   img/faces/:
 *   img/parallaxes/:
 *   img/pictures/:
 *   img/sv_actors/:
 *   img/sv_enemies/:
 *   img/system/:
 *   img/tilesets/:
 *   img/titles1/:
 *   img/titles2/:
 *   - Which files do you wish to load from this directory upon starting
 *     up the game?
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Keyboard Input Settings
 * ============================================================================
 *
 * Settings for the game that utilize keyboard input. These are primarily for
 * the name input scene (Scene_Name) and the number input event command. These
 * settings have only been tested on English keyboards and may or may not be
 * compatible with other languages, so please disable these features if they do
 * not fit in with your game.
 *
 * ---
 * 
 * Controls
 * 
 *   WASD Movement:
 *   - Enables or disables WASD movement for your game project.
 *   - Moves the W page down button to E.
 * 
 *   R Button: Dash Toggle:
 *   - Enables or disables R button as an Always Dash option toggle.
 * 
 * ---
 *
 * Name Input
 * 
 *   Enable?:
 *   - Enables keyboard input for name entry.
 *   - Only tested with English keyboards.
 * 
 *   Default Mode:
 *   - Select default mode when entering the scene.
 *     - Default - Uses Arrow Keys to select letters.
 *     - Keyboard - Uses Keyboard to type in letters.
 * 
 *   QWERTY Layout:
 *   - Uses the QWERTY layout for manual entry.
 * 
 *   Keyboard Message:
 *   - The message displayed when allowing keyboard entry.
 *   - You may use text codes here.
 *
 * ---
 *
 * Number Input
 * 
 *   Enable?:
 *   - Enables keyboard input for number entry.
 *   - Only tested with English keyboards.
 *
 * ---
 * 
 * Button Assist
 * 
 *   Switch to Keyboard:
 *   - Text used to describe the keyboard switch.
 * 
 *   Switch To Manual:
 *   - Text used to describe the manual entry switch.
 * 
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Menu Background Settings
 * ============================================================================
 *
 * These settings in the Plugin Parameters allow you to adjust the background
 * images used for each of the scenes. The images will be taken from the game
 * project folders img/titles1/ and img/titles2/ to load into the game.
 *
 * These settings are only available to scenes found within the Main Menu, the
 * Shop scene, and the Actor Naming scene.
 *
 * ---
 *
 * Menu Background Settings:
 *
 *   Scene_Menu:
 *   Scene_Item:
 *   Scene_Skill:
 *   Scene_Equip:
 *   Scene_Status:
 *   Scene_Options:
 *   Scene_Save:
 *   Scene_Load:
 *   Scene_GameEnd:
 *   Scene_Shop:
 *   Scene_Name:
 *   - Individual background settings for the scene.
 *
 *   Scene_Unlisted
 *   - Individual background settings for any scenes that aren't listed above.
 *
 * ---
 *
 * Background Settings
 *
 *   Snapshop Opacity:
 *   - Snapshot opacity for the scene.
 *
 *   Background 1:
 *   - Filename used for the bottom background image.
 *   - Leave empty if you don't wish to use one.
 *
 *   Background 2:
 *   - Filename used for the upper background image.
 *   - Leave empty if you don't wish to use one.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Menu Button Assist Window
 * ============================================================================
 *
 * In most modern RPG's, there exist small windows on the screen which tell the
 * player what the control schemes are for that scene. This plugin gives you
 * the option to add that window to the menu scenes in the form of a Button
 * Assist Window.
 *
 * ---
 *
 * General
 * 
 *   Enable:
 *   - Enable the Menu Button Assist Window.
 * 
 *   Location:
 *   - Determine the location of the Button Assist Window.
 *   - Requires Plugin Parameters => UI => Side Buttons ON.
 *
 *   Background Type:
 *   - Select background type for this window.
 *
 * ---
 *
 * Text
 * 
 *   Text Format:
 *   - Format on how the buttons are displayed.
 *   - Text codes allowed. %1 - Key, %2 - Text
 * 
 *   Multi-Key Format:
 *   - Format for actions with multiple keys.
 *   - Text codes allowed. %1 - Key 1, %2 - Key 2
 * 
 *   OK Text:
 *   Cancel Text:
 *   Switch Actor Text:
 *   - Default text used to display these various actions.
 *
 * ---
 *
 * Keys
 * 
 *   Key: Unlisted Format:
 *   - If a key is not listed below, use this format.
 *   - Text codes allowed. %1 - Key
 * 
 *   Key: Up:
 *   Key: Down:
 *   Key: Left:
 *   Key: Right:
 *   Key: Shift:
 *   Key: Tab:
 *   Key: A through Z:
 *   - How this key is shown in-game.
 *   - Text codes allowed.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Menu Layout Settings
 * ============================================================================
 *
 * These settings allow you to rearrange the positions of the scenes accessible
 * from the Main Menu, the Shop scene, and the Actor Naming scene. This will
 * require you to have some JavaScript knowledge to make the windows work the
 * way you would like.
 *
 * ---
 *
 * Menu Layout Settings
 *
 *   Scene_Title:
 *   Scene_Menu:
 *   Scene_Item:
 *   Scene_Skill:
 *   Scene_Equip:
 *   Scene_Status:
 *   Scene_Options:
 *   Scene_Save:
 *   Scene_Load:
 *   Scene_GameEnd:
 *   Scene_Shop:
 *   Scene_Name:
 *   - Various options on adjusting the selected scene.
 *
 * ---
 *
 * Scene Window Settings
 *
 *   Background Type:
 *   - Selects the background type for the selected window.
 *   - Window
 *   - Dim
 *   - Transparent
 *
 *   JS: X, Y, W, H
 *   - Code used to determine the dimensions for the selected window.
 *
 * ---
 *
 * Scene_Title Settings
 * - The following are settings unique to Scene_Title.
 *
 * Title Screen
 *
 *   Document Title Format:
 *   - Format to display text in document title.
 *   - %1 - Main Title, %2 - Subtitle, %3 - Version
 *
 *   Subtitle:
 *   - Subtitle to be displayed under the title name.
 *   
 *   Version:
 *   - Version to be display in the title screen corner.
 *   
 *   JS: Draw Title:
 *   - Code used to draw the game title.
 *   
 *   JS: Draw Subtitle:
 *   - Code used to draw the game subtitle.
 *   
 *   JS: Draw Version:
 *   - Code used to draw the game version.
 *   
 *   Button Fade Speed:
 *   - Speed at which the buttons fade in at (1-255).
 *
 * ---
 *
 * Scene_GameEnd Settings
 * - The following are settings unique to Scene_GameEnd.
 *   
 *   Command Window List:
 *   - Window commands used by the title screen.
 *   - Add new commands here.
 *
 * ---
 *
 * Command Window List
 * - This is found under Scene_Title and Scene_GameEnd settings.
 *
 *   Symbol:
 *   - The symbol used for this command.
 * 
 *   STR: Text:
 *   - Displayed text used for this title command.
 *   - If this has a value, ignore the JS: Text version.
 * 
 *   JS: Text:
 *   - JavaScript code used to determine string used for the displayed name.
 * 
 *   JS: Show:
 *   - JavaScript code used to determine if the item is shown or not.
 * 
 *   JS: Enable:
 *   - JavaScript code used to determine if the item is enabled or not.
 * 
 *   JS: Ext:
 *   - JavaScript code used to determine any ext data that should be added.
 * 
 *   JS: Run Code:
 *   - JavaScript code that runs once this command is selected.
 * 
 * ---
 *
 * Title Picture Buttons:
 * - This is found under Scene_Title settings.
 * 
 *   Picture's Filename:
 *   - Filename used for the picture.
 *
 *   Button URL:
 *   - URL for the button to go to upon being clicked.
 *
 *   JS: Position:
 *   - JavaScript code that helps determine the button's Position.
 *
 *   JS: On Load:
 *   - JavaScript code that runs once this button bitmap is loaded.
 *
 *   JS: Run Code:
 *   - JavaScript code that runs once this button is pressed.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Parameter Settings
 * ============================================================================
 *
 * A battler's parameters, or stats as some devs know them as, are the values
 * that determine how a battler performs. These settings allow you to alter
 * their behaviors and give boosts to trait objects in a controlled manner.
 *
 * ---
 *
 * Parameter Settings
 *
 *   Displayed Parameters
 *   - A list of the parameters that will be displayed in-game.
 *   - Shown in the Equip Menu.
 *   - Shown in the Status Menu.
 *
 *   Extended Parameters
 *   - The list shown in extended scenes (for other VisuStella plugins).
 *
 * ---
 *
 * === Basic Parameters ===
 *
 * MHP - MaxHP
 * - This is the maximum health points value. The amount of health points (HP)
 * a battler has determines whether or not the battler is in a living state or
 * a dead state. If the HP value is above 0, then the battler is living. If it
 * is 0 or below, the battler is in a dead state unless the battler has a way
 * to counteract death (usually through immortality). When the battler takes
 * damage, it is usually dealt to the HP value and reduces it. If the battler
 * is healed, then the HP value is increased. The MaxHP value determines what's
 * the maximum amount the HP value can be held at, meaning the battler cannot
 * be healed past that point.
 *
 * MMP - MaxMP
 * - This is the maximum magic points value. Magic points (MP) are typically
 * used for the cost of skills and spells in battle. If the battler has enough
 * MP to fit the cost of the said skill, the battler is able to use the said
 * skill provided that all of the skill's other conditions are met. If not, the
 * battler is then unable to use the skill. Upon using a skill that costs MP,
 * the battler's MP is reduced. However, the battler's MP can be recovered and
 * results in a gain of MP. The MaxMP value determines what is the maximum
 * amount the MP value can be held at, meaning the battler cannot recover MP
 * past the MaxMP value.
 *
 * ATK - Attack
 * - This is the attack value of the battler. By default, this stat is used for
 * the purpose of damage calculations only, and is typically used to represent
 * the battler's physical attack power. Given normal damage formulas, higher
 * values mean higher damage output for physical attacks.
 *
 * DEF - Defense
 * - This is the defense value of the battler. By default, this stat is used
 * for the purpose of damage calculations only, and is typically used to
 * represent the battler's physical defense. Given normal damage formulas,
 * higher values mean less damage received from physical attacks.
 *
 * MAT - Magic Attack
 * - This is the magic attack value of the battler. By default, this stat is
 * used for the purpose of damage calculations only, and is typically used to
 * represent the battler's magical attack power. Given normal damage formulas,
 * higher values mean higher damage output for magical attacks.
 *
 * MDF - Magic Defense
 * - This is the magic defense value of the battler. By default, this stat is
 * used for the purpose of damage calculations only, and is typically used to
 * represent the battler's magical defense. Given normal damage formulas,
 * higher values mean less damage received from magical attacks.
 *
 * AGI - Agility
 * - This is the agility value of the battler. By default, this stat is used to
 * determine battler's position in the battle turn's order. Given a normal turn
 * calculation formula, the higher the value, the faster the battler is, and
 * the more likely the battler will have its turn earlier in a turn.
 *
 * LUK - Luck
 * - This is the luck value of the battler. By default, this stat is used to
 * affect the success rate of states, buffs, and debuffs applied by the battler
 * and received by the battler. If the user has a higher LUK value, the state,
 * buff, or debuff is more likely to succeed. If the target has a higher LUK
 * value, then the state, buff, or debuff is less likely to succeed.
 *
 * ---
 *
 * Basic Parameters
 *
 *   HP Crisis Rate:
 *   - HP Ratio at which a battler can be considered in crisis mode.
 *
 *   JS: Formula:
 *   - Formula used to determine the total value all 8 basic parameters:
 *   - MaxHP, MaxMP, ATK, DEF, MAT, MDF, AGI, LUK.
 *
 * Parameter Caps:
 *
 *   MaxHP Cap:
 *   MaxMP Cap:
 *   ATK Cap:
 *   DEF Cap:
 *   MAT Cap:
 *   MDF Cap:
 *   AGI Cap:
 *   LUK Cap:
 *   - Formula used to determine the selected parameter's cap.
 *
 * ---
 *
 * === X Parameters ===
 *
 * HIT - Hit Rate%
 * - This determines the physical hit success rate of the any physical action.
 * All physical attacks make a check through the HIT rate to see if the attack
 * will connect. If the HIT value passes the randomizer check, the attack will
 * connect. If the HIT value fails to pass the randomizer check, the attack
 * will be considered a MISS.
 *
 * EVA - Evasion Rate%
 * - This determines the physical evasion rate against any incoming physical
 * actions. If the HIT value passes, the action is then passed to the EVA check
 * through a randomizer check. If the randomizer check passes, the physical
 * attack is evaded and will fail to connect. If the randomizer check passes,
 * the attempt to evade the action will fail and the action connects.
 *
 * CRI - Critical Hit Rate%
 * - Any actions that enable Critical Hits will make a randomizer check with
 * this number. If the randomizer check passes, extra damage will be carried
 * out by the initiated action. If the randomizer check fails, no extra damage
 * will be added upon the action.
 *
 * CEV - Critical Evasion Rate%
 * - This value is put against the Critical Hit Rate% in a multiplicative rate.
 * If the Critical Hit Rate is 90% and the Critical Evasion Rate is
 * 20%, then the randomizer check will make a check against 72% as the values
 * are calculated by the source code as CRI * (1 - CEV), therefore, with values
 * as 0.90 * (1 - 0.20) === 0.72.
 *
 * MEV - Magic Evasion Rate%
 * - Where EVA is the evasion rate against physical actions, MEV is the evasion
 * rate against magical actions. As there is not magical version of HIT, the
 * MEV value will always be bit against when a magical action is initiated. If
 * the randomizer check passes for MEV, the magical action will not connect. If
 * the randomizer check fails for MEV, the magical action will connect.
 *
 * MRF - Magic Reflect Rate%
 * - If a magical action connects and passes, there is a chance the magical
 * action can be bounced back to the caster. That chance is the Magic Reflect
 * Rate. If the randomizer check for the Magic Reflect Rate passes, then the
 * magical action is bounced back to the caster, ignoring the caster's Magic
 * Evasion Rate. If the randomizer check for the Magic Reflect Rate fails, then
 * the magical action will connect with its target.
 *
 * CNT - Counter Attack Rate%
 * - If a physical action connects and passes, there is a chance the physical
 * action can be avoided and a counter attack made by the user will land on the
 * attacking unit. This is the Counter Attack Rate. If the randomizer check for
 * the Counter Attack Rate passes, the physical action is evaded and the target
 * will counter attack the user. If the randomizer check fails, the physical
 * action will connect to the target.
 *
 * HRG - HP% Regeneration
 * - During a battler's regeneration phase, the battler will regenerate this
 * percentage of its MaxHP as gained HP with a 100% success rate.
 *
 * MRG - MP% Regeneration
 * - During a battler's regeneration phase, the battler will regenerate this
 * percentage of its MaxMP as gained MP with a 100% success rate.
 *
 * TRG - TP% Regeneration
 * - During a battler's regeneration phase, the battler will regenerate this
 * percentage of its MaxTP as gained TP with a 100% success rate.
 *
 * ---
 *
 * X Parameters
 *
 *   JS: Formula:
 *   - Formula used to determine the total value all 10 X parameters:
 *   - HIT, EVA, CRI, CEV, MEV, MRF, CNT, HRG, MRG, TRG.
 *
 * Vocabulary
 *
 *   HIT:
 *   EVA:
 *   CRI:
 *   CEV:
 *   MEV:
 *   MRF:
 *   CNT:
 *   HRG:
 *   MRG:
 *   TRG:
 *   - In-game vocabulary used for the selected X Parameter.
 *
 * ---
 *
 * === S Parameters ===
 *
 * TGR - Target Rate
 * - Against the standard enemy, the Target Rate value determines the odds of
 * an enemy specifically targeting the user for a single target attack. At 0%,
 * the enemy will almost never target the user. At 100%, it will have normal
 * targeting opportunity. At 100%+, the user will have an increased chance of
 * being targeted.
 * *NOTE: For those using the Battle A.I. Core, any actions that have specific
 * target conditions will bypass the TGR rate.
 *
 * GRD - Guard Effect
 * - This is the effectiveness of guarding. This affects the guard divisor
 * value of 2. At 100% GRD, damage will become 'damage / (2 * 1.00)'. At 50%
 * GRD, damage will become 'damage / (2 * 0.50)'. At 200% GRD, damage will
 * become 'damage / (2 * 2.00)' and so forth.
 *
 * REC - Recovery Effect
 * - This is how effective heals are towards the user. The higher the REC rate,
 * the more the user is healed. If a spell were to heal for 100 and the user
 * has 300% REC, then the user is healed for 300 instead.
 *
 * PHA - Pharmacology
 * - This is how effective items are when used by the user. The higher the PHA
 * rate, the more effective the item effect. If the user is using a Potion that
 * recovers 100% on a target ally and the user has 300% PHA, then the target
 * ally will receive healing for 300 instead.
 *
 * MCR - MP Cost Rate
 * - This rate affects how much MP skills with an MP Cost will require to use.
 * If the user has 100% MCR, then the MP Cost will be standard. If the user has
 * 50% MCR, then all skills that cost MP will cost only half the required MP.
 * If the user has 200% MCR, then all skills will cost 200% their MP cost.
 *
 * TCR - TP Charge Rate
 * - This rate affects how much TP skills with an TP will charge when gaining
 * TP through various actions. At 100%, TP will charge normally. At 50%, TP
 * will charge at half speed. At 200%, TP will charge twice as fast.
 *
 * PDR - Physical Damage Rate
 * - This rate affects how much damage the user will take from physical damage.
 * If the user has 100% PDR, then the user takes the normal amount. If the user
 * has 50% PDR, then all physical damage dealt to the user is halved. If the
 * user has 200% PDR, then all physical damage dealt to the user is doubled.
 *
 * MDR - Magical Damage Rate
 * - This rate affects how much damage the user will take from magical damage.
 * If the user has 100% MDR, then the user takes the normal amount. If the user
 * has 50% MDR, then all magical damage dealt to the user is halved. If the
 * user has 200% MDR, then all magical damage dealt to the user is doubled.
 *
 * FDR - Floor Damage Rate
 * - On the field map, this alters how much damage the user will take when the
 * player walks over a tile that damages the party. The FDR value only affects
 * the damage dealt to the particular actor and not the whole party. If FDR is
 * at 100%, then the user takes the full damage. If FDR is at 50%, then only
 * half of the damage goes through. If FDR is at 200%, then floor damage is
 * doubled for that actor.
 *
 * EXR - Experience Rate
 * - This determines the amount of experience gain the user whenever the user
 * gains any kind of EXP. At 100% EXR, the rate of experience gain is normal.
 * At 50%, the experience gain is halved. At 200%, the experience gain for the
 * user is doubled.
 *
 * ---
 *
 * S Parameters
 *
 *   JS: Formula
 *   - Formula used to determine the total value all 10 S parameters:
 *   - TGR, GRD, REC, PHA, MCR, TCR, PDR, MDR, FDR, EXR.
 *
 * Vocabulary
 *
 *   TGR:
 *   GRD:
 *   REC:
 *   PHA:
 *   MCR:
 *   TCR:
 *   PDR:
 *   MDR:
 *   FDR:
 *   EXR:
 *   - In-game vocabulary used for the selected S Parameter.
 *
 * ---
 *
 * Icons
 * 
 *   Draw Icons?
 *   - Draw icons next to parameter names?
 *
 *   MaxHP, MaxMP, ATK, DEF, MAT, MDF, AGI, LUK:
 *   HIT, EVA, CRI, CEV, MEV, MRF, CNT, HRG, MRG, TRG:
 *   TGR, GRD, REC, PHA, MCR, TCR, PDR, MDR, FDR, EXR:
 *   - Icon used for the selected parameter.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Custom Parameters Settings
 * ============================================================================
 *
 * As of version 1.07, you can add Custom Parameters to your game if RPG Maker
 * MZ's default set of parameters isn't enough for you. These parameters can
 * have variable functionality depending on how you code it. More importantly,
 * these are compatible with the VisuStella MZ menus and the VisuStella Core
 * Engine's Parameters settings.
 * 
 * For clarification, these settings do NOT create brand-new parameters for you
 * to use and add to your game nor are the bonuses supported by other plugins
 * in the VisuStella MZ library. These settings exist to function as a bridge
 * for non-VisuStella MZ plugins that have created their own parameter values
 * and to show them inside VisuStella menus.
 *
 * ---
 *
 * Custom Parameter
 * 
 *   Parameter Name:
 *   - What's the parameter's name?
 *   - Used for VisuStella MZ menus.
 * 
 *   Abbreviation:
 *   - What abbreviation do you want to use for the parameter?
 *   - Do not use special characters. Avoid numbers if possible.
 * 
 *   Icon:
 *   - What icon do you want to use to represent this parameter?
 *   - Used for VisuStella MZ menus.
 * 
 *   Type:
 *   - What kind of number value will be returned with this parameter?
 *     - Integer (Whole Numbers Only)
 *     - Float (Decimals are Allowed)
 * 
 *   JS: Value:
 *   - Run this code when this parameter is to be returned.
 *
 * ---
 * 
 * Instructions on Adding Custom Parameters to VisuStella Menus
 * 
 * In the Core Engine and Elements and Status Menu Core plugins, there are
 * plugin parameter fields for you to insert the parameters you want displayed
 * and visible to the player.
 * 
 * Insert in those the abbreviation of the custom parameter. For example, if
 * you want to add the "Strength" custom parameter and the abbreviation is
 * "str", then add "str" to the Core Engine/Elements and Status Menu Core's
 * plugin parameter field for "Strength" to appear in-game. Case does not
 * matter here so you can insert "str" or "STR" and it will register all the
 * same to make them appear in-game.
 * 
 * ---
 * 
 * Instructions on Using Custom Parameters as Mechanics
 * 
 * If you want to use a custom parameter in, say, a damage formula, refer to
 * the abbreviation you have set for the custom parameter. For example, if you
 * want to call upon the "Strength" custom parameter's value and its set
 * abbreviation is "str", then refer to it as such. This is case sensitive.
 * 
 * An example damage formula would be something like the following if using
 * "str" for "Strength" and "con" for "Constitution":
 * 
 *   a.str - b.con
 * 
 * These values are attached to the Game_Battlerbase prototype class.
 * 
 * ---
 * 
 * Instructions on Setting Custom Parameter Values
 * 
 * This requires JavaScript knowledge. There is no way around it. Whatever code
 * you insert into the "JS: Value" field will return the value desired. The
 * 'user' variable will refer to the Game_Battlerbase prototype object in which
 * the information is to be drawn from.
 * 
 * Depending on the "type" you've set for the Custom Parameter, the returned
 * value will be rounded using Math.round for integers and left alone if set as
 * a float number.
 * 
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Screen Shake Settings
 * ============================================================================
 *
 * Get more screen shake effects into your game!
 * 
 * These effects have been added by Aries of Sheratan!
 *
 * ---
 *
 * Settings
 * 
 *   Default Style:
 *   - The default style used for screen shakes.
 *   - Original
 *   - Random
 *   - Horizontal
 *   - Vertical
 * 
 *   JS: Original Style:
 *   JS: Random Style
 *   JS: Horizontal Style
 *   JS: Vertical Style
 *   - This code gives you control over screen shake for this screen
 *     shake style.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Title Command List Settings
 * ============================================================================
 *
 * This plugin parameter allows you to adjust the commands that appear on the
 * title screen. Some JavaScript knowledge is needed.
 *
 * ---
 *
 * Title Command
 * 
 *   Symbol:
 *   - The symbol used for this command.
 * 
 *   STR: Text:
 *   - Displayed text used for this title command.
 *   - If this has a value, ignore the JS: Text version.
 * 
 *   JS: Text:
 *   - JavaScript code used to determine string used for the displayed name.
 * 
 *   JS: Show:
 *   - JavaScript code used to determine if the item is shown or not.
 * 
 *   JS: Enable:
 *   - JavaScript code used to determine if the item is enabled or not.
 * 
 *   JS: Ext:
 *   - JavaScript code used to determine any ext data that should be added.
 * 
 *   JS: Run Code:
 *   - JavaScript code that runs once this command is selected.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Title Picture Buttons Settings
 * ============================================================================
 *
 * These allow you to insert picture buttons on your title screen that can
 * send users to various links on the internet when clicked.
 *
 * ---
 *
 * Settings
 * 
 *   Picture's Filename:
 *   - Filename used for the picture.
 * 
 *   Button URL:
 *   - URL for the button to go to upon being clicked.
 * 
 *   JS: Position:
 *   - JavaScript code that helps determine the button's Position.
 * 
 *   JS: On Load:
 *   - JavaScript code that runs once this button bitmap is loaded.
 * 
 *   JS: Run Code:
 *   - JavaScript code that runs once this button is pressed.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: UI Settings
 * ============================================================================
 *
 * In previous iterations of RPG Maker, the Core Engine would allow you to
 * change the screen resolution. In MZ, that functionality is provided by
 * default but a number of UI settings still remain. These settings allow you
 * adjust how certain in-game objects and menus are displayed.
 *
 * ---
 *
 * UI Area
 *
 *   Fade Speed:
 *   - Default fade speed for transitions.
 *
 *   Box Margin:
 *   - Set the margin in pixels for the screen borders.
 *
 *   Command Window Width:
 *   - Sets the width for standard Command Windows.
 *
 *   Bottom Help Window:
 *   - Put the Help Window at the bottom of the screen?
 *
 *   Right Aligned Menus:
 *   - Put most command windows to the right side of the screen.
 *
 *   Show Buttons:
 *   - Show clickable buttons in your game?
 * 
 *     Show Cancel Button:
 *     Show Menu Button:
 *     Show Page Up/Down:
 *     Show Number Buttons:
 *     - Show/hide these respective buttons if the above is enabled.
 *     - If 'Show Buttons' is false, these will be hidden no matter what.
 *
 *   Button Area Height:
 *   - Sets the height for the button area.
 *
 *   Bottom Buttons:
 *   - Put the buttons at the bottom of the screen?
 *
 *   Side Buttons:
 *   - Push buttons to the side of the UI if there is room.
 *
 * ---
 *
 * Larger Resolutions
 * 
 *   Reposition Actors:
 *   - Update the position of actors in battle if the screen resolution
 *     has changed to become larger than 816x624.
 *   - Ignore if using the VisuStella MZ Battle Core.
 *   - When using the VisuStella MZ Battle Core, adjust the position through
 *     Battle Core > Parameters > Actor Battler Settings > JS: Home Position
 *
 *   Reposition Enemies:
 *   - Update the position of enemies in battle if the screen resolution
 *     has changed to become larger than 816x624.
 *
 * ---
 *
 * Menu Objects
 *
 *   Level -> EXP Gauge:
 *   - Draw an EXP Gauge under the drawn level.
 *
 *   Parameter Arrow:
 *   - The arrow used to show changes in the parameter values.
 *
 * ---
 *
 * Text Code Support
 *
 *   Class Names:
 *   - Make class names support text codes?
 *
 *   Nicknames:
 *   - Make nicknames support text codes?
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Window Settings
 * ============================================================================
 *
 * Adjust the default settings of the windows in-game. This ranges from things
 * such as the line height (to better fit your font size) to the opacity level
 * (to fit your window skins).
 *
 * ---
 *
 * Window Defaults
 * 
 *   Line Height:
 *   - Default line height used for standard windows.
 * 
 *   Item Height Padding:
 *   - Default padding for selectable items.
 * 
 *   Item Padding:
 *   - Default line padding used for standard windows.
 * 
 *   Back Opacity:
 *   - Default back opacity used for standard windows.
 * 
 *   Translucent Opacity:
 *   - Default translucent opacity used for standard windows.
 * 
 *   Window Opening Speed:
 *   - Default open speed used for standard windows.
 *   - Default: 32 (Use a number between 0-255)
 * 
 *   Column Spacing:
 *   - Default column spacing for selectable windows.
 *   - Default: 8
 * 
 *   Row Spacing:
 *   - Default row spacing for selectable windows.
 *   - Default: 4
 *
 * ---
 * 
 * Selectable Items:
 * 
 *   Show Background?:
 *   - Selectable menu items have dark boxes behind them. Show them?
 * 
 *   Item Height Padding:
 *   - Default padding for selectable items.
 * 
 *   JS: Draw Background:
 *   - Code used to draw the background rectangle behind clickable menu objects
 * 
 * ---
 *
 * ============================================================================
 * Plugin Parameters: JS: Quick Functions
 * ============================================================================
 * 
 * WARNING: This feature is highly experimental! Use it at your own risk!
 * 
 * JavaScript Quick Functions allow you to quickly declare functions in the
 * global namespace for ease of access. It's so that these functions can be
 * used in Script Calls, Control Variable Script Inputs, Conditional Branch
 * Script Inputs, Damage Formulas, and more.
 * 
 * ---
 * 
 * JS: Quick Function
 * 
 *   Function Name:
 *   - The function's name in the global namespace.
 *   - Will not overwrite functions/variables of the same name.
 * 
 *   JS: Code:
 *   - Run this code when using the function.
 * 
 * ---
 * 
 * If you have a Function Name of "Example", then typing "Example()" in a
 * Script Call, Conditional Branch Script Input, or similar field will yield
 * whatever the code is instructed to return.
 * 
 * If a function or variable of a similar name already exists in the global
 * namespace, then the quick function will be ignored and not created.
 * 
 * If a quick function contains bad code that would otherwise crash the game,
 * a fail safe has been implemented to prevent it from doing so, display an
 * error log, and then return a 0 value.
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
 * Version 1.24: January 29, 2021
 * * Documentation Update!
 * ** Plugin Parameters: Custom Parameters Settings added the following note:
 * *** For clarification, these settings do NOT create brand-new parameters for
 *     you to use and add to your game nor are the bonuses supported by other
 *     plugins in the VisuStella MZ library. These settings exist to function
 *     as a bridge for non-VisuStella MZ plugins that have created their own
 *     parameter values and to show them inside VisuStella menus.
 * * Feature Update!
 * ** Default JS Plugin Parameter for the Title Command: "Shutdown" now has a
 *    note in it that reads: "Do NOT use this command with mobile devices or
 *    browser games. All it does is cause the game to display a blank, black
 *    canvas which the player is unable to do anything with. It does NOT force
 *    close the browser tab nor the app."
 * *** This is also why this command is disabled by default for any non-NodeJS
 *     client deployed game versions.
 * ** Disabled some bug fixes made by the Core Engine for the default RMMZ code
 *    base since the 1.1.1 version now contains those very same fixes.
 * 
 * Version 1.23: January 22, 2021
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.22: January 15, 2021
 * * Documentation Update!
 * ** Added documentation for new RPG Maker MZ bug fixes!
 * * Bug Fixes!
 * ** RPG Maker MZ Bug: Sprite_Timer is added to the spriteset for the parent
 *    scene, making it affected by any filers, zooms, and/or blurs, hindering
 *    its readability.
 * 
 * Version 1.21: January 8, 2021
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * New Features!
 * ** New Plugin Parameters added by Arisu:
 * *** Plugin Parameters > Keyboard Input > Controls > WASD Movement
 * *** Plugin Parameters > Keyboard Input > Controls > R Button: Dash Toggle
 * 
 * Version 1.20: January 1, 2021
 * * Compatibility Update!
 * ** Added compatibility functionality for future plugins.
 * 
 * Version 1.19: December 25, 2020
 * * Documentation Update!
 * ** Added documentation for new feature(s) and feature updates!
 * * Bug Fixes!
 * ** Fixed typo inside of the comments inside the JS: Quick Functions.
 * * Feature Update!
 * ** Plugin Parameters > Color Settings > Outline Color is now renamed to
 *    Font Outline.
 * * New Features!
 * ** New Plugin Parameters added by Shaz!
 * *** Plugin Parameters > Color Settings > Gauge Number Outline
 * 
 * Version 1.18: December 18, 2020
 * * Bug Fixes!
 * ** Compatible string text from the Items and Equips Core will no longer
 *    register MaxHP and MaxMP as percentile values for the info window.
 * ** RPG Maker MZ Bug: Gamepads no longer go rapidfire after a cleared input.
 *    There is now a period of delay for gamepads after an input clear.
 * ** RPG Maker MZ Bug: Unusable items on an individual-actor basis will no
 *    longer be overwritten by party-based usability for battle. Fix by Yanfly.
 * ** RPG Maker MV animations will no longer crash for unplayable sound
 *    effects. Fix made by Yanfly.
 * * Compatibility Update!
 * ** Plugins should be more compatible with one another.
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * ** Added documentation for new RPG Maker MZ bug fixes!
 * * New Features!
 * ** New Plugin Parameters added by Yanfly!
 * *** Plugin Parameters > Button Assist > Key: Shift
 * *** Plugin Parameters > Button Assist > Key: Tab
 * **** These let you assign text codes to the Shift and Tab buttons for the
 *      Button Assist windows.
 * *** Plugin Parameters > QoL Settings > Misc > NewGame > CommonEvent
 * **** For an all version (including non-play test) common event to start new
 *      games with.
 * 
 * Version 1.17: December 11, 2020
 * * Compatibility Update!
 * ** Added compatibility functionality for future plugins.
 * 
 * Version 1.16: December 4, 2020
 * * Compatibility Update!
 * ** Plugins should be more compatible with one another.
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * Feature Update!
 * ** Button Assist Window for the change name scene will now default to "Tab"
 *    for switching between both modes. Update made by Yanfly.
 * * New Features!
 * ** New Plugin Parameter added by Yanfly:
 * *** Plugin Parameters > Keyboard Input > Default Mode
 * **** Select default mode when entering the scene.
 * 
 * Version 1.15: November 29, 2020
 * * Bug Fixes!
 * ** Pressing "Enter" in the change name scene while the actor's name is
 *    completely empty will no longer result in endless buzzer sounds. Fix made
 *    by Arisu.
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * Feature Update!
 * ** For the name change scene, the "Tab" key now also lets the user switch
 *    between the two modes. Update made by Yanfly.
 * * New Features!
 * ** Two new plugin parameters added to Keyboard Input:
 * *** "Switch To Keyboard" and "Switch To Manual"
 * **** These determine the text used for the button assist window when
 *      switching between the two modes. Update made by Yanfly.
 * **** Button Assist window now takes into consideration for these texts.
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.14: November 22, 2020
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * New Features!
 * ** New Plugin Command added by Yanfly!
 * *** System: Load Images
 * **** Allows you to (pre) load up images ahead of time.
 * 
 * Version 1.13: November 15, 2020
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.12: November 8, 2020
 * * Compatibility Update!
 * ** Plugins should be more compatible with one another.
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * Feature Update!
 * ** Screen Shake Plugin Parameters and JS: Quick Function Plugin Parameters
 *    have been taken off experimental status.
 * * New Features!
 * ** New plugin parameters added by Arisu.
 * *** Plugin Parameters > Keyboard Input
 * **** Settings for the game that utilize keyboard input. These are primarily
 *      for the name input scene (Scene_Name) and the number input event
 *      command. These settings have only been tested on English keyboards and
 *      may or may not be compatible with other languages, so please disable
 *      these features if they do not fit in with your game.
 * 
 * Version 1.11: November 1, 2020
 * * Compatibility Update!
 * ** Plugins should be more compatible with one another.
 * * Feature Update!
 * ** Bitmap smoothing now takes into consideration for rounding coordinates.
 *    Update made by Irina.
 * 
 * Version 1.10: October 25, 2020
 * * Feature Update!
 * ** Sprite animation location now adjusts position relative to the sprite's
 *    scale, too. Update made by Arisu.
 *
 * Version 1.09: October 18, 2020
 * * Bug Fixes!
 * ** RPG Maker MZ Bug: Auto Battle Lock Up. Fixed by Yanfly.
 * *** If an auto battle Actor fights against an enemy whose DEF/MDF is too
 *     high, they will not use any actions at all. This can cause potential
 *     game freezing and softlocks. This plugin will change that and have them
 *     default to a regular Attack.
 * * Compatibility Update!
 * ** Plugins should be more compatible with one another.
 * 
 * Version 1.08: October 11, 2020
 * * Feature Update!
 * ** Altered sprite bitmaps via the various draw functions will now be marked
 *    as modified and will automatically purge themselves from graphical memory
 *    upon a sprite's removal to free up more resources. Change made by Yanfly.
 * ** Picture Sprite Origin anchors are now tied to the Game_Picture show and
 *    move commands instead of the Game_Interpretter commands. Change by Arisu.
 * 
 * Version 1.07: October 4, 2020
 * * Documentation Update!
 * ** New documentation added for the new Plugin Parameter category:
 *    "Custom Parameters".
 * * New Features!
 * ** New Plugin Parameter "Custom Parameters" added by Yanfly.
 * *** Create custom parameters for your game! These will appear in
 *     VisuStella MZ menus.
 * 
 * Version 1.06: September 27, 2020
 * * Bug Fixes!
 * ** Battler evasion pose can now occur if there is a miss. These were made
 *    separate in RPG Maker MZ and misses didn't enable the evasion pose. Fix
 *    made by Olivia.
 * * New Features!
 * ** New notetags for Maps and name tags for Troops added by Yanfly!
 * *** <Frontview>, <Sideview> to change the battle view for that specific map,
 *     or troop regardless of what other settings are.
 * *** <DTB>, <TPB Active>, <TPB Wait> to change the battle system for that
 *     specific map or troop regardless of what other settings are.
 * 
 * Version 1.05: September 20, 2020
 * * Bug Fixes!
 * ** <Level: x> notetag for enemies is now fixed! Fix made by Arisu.
 * * Documentation Update!
 * ** Documentation added for the new "System: Battle System Change" Plugin
 *    Command and removed the old "System: Set Time Progress Battle".
 * * Feature Update!
 * ** The Plugin Command "System: Set Time Progress Battle" has been replaced
 *    with "System: Battle System Change" instead. This is to accommodate
 *    future plugins that allow for different battle systems. Added by Yanfly.
 * *** If you have previously used "System: Set Time Progress Battle", please
 *     replace them. We apologize for the inconvenience.
 * * New Features!
 * ** In the Core Engine's plugin parameters, you can now set the Battle System
 *    used. This will default to whatever is the game database's setting. This
 *    feature is used for the future when new battle systems are made. Feature
 *    added by Yanfly.
 * 
 * Version 1.04: September 13, 2020
 * * Documentation Update!
 * ** Added new documentation for the "Title Command List" and Title Picture
 *    Buttons" plugin parameters. They now have a dedicated section each.
 * * Feature Updates!
 * ** Moved the "Title Command List" and "Title Picture Buttons" parameters
 *    from the Menu Layout > Title settings. They were far too hidden away and
 *    users had a hard time finding them. Update made by Yanfly.
 * *** Users who have customized these settings before will need to readjust
 *     them again. We apologize for the inconvenience.
 * 
 * Version 1.03: September 6, 2020
 * * Bug Fixes!
 * ** Having QoL > Modern Controls disabled (why would you) used to prevent the
 *    down button from working. It works again. Fix made by Yanfly.
 * * New Feature!
 * ** Plugin default settings now come with a "Game End" option on the title
 *    screen. For those updating from version 1.02 or order, you can add this
 *    in by opening the Core Engine > Plugin Parameters > Menu Layout Settings
 *    > press "delete" on Scene_Title > open it up, then the new settings will
 *    fill in automatically.
 * * New Experimental Feature Added:
 * ** Screen Shake Settings added to the Plugin Parameters.
 * *** Screen Shake: Custom Plugin Command added!
 * *** Credit to Aries of Sheratan, who gave us permission to use her formula.
 * *** We'll be expanding on more screen shaking options in the future.
 * * Optimization Update
 * ** Digit Grouping now works more efficiently.
 * 
 * Version 1.02: August 30, 2020
 * * New Feature!
 * ** New Plugin Command: "Picture: Erase All". Added by Olivia.
 * *** Erases all pictures on the screen because it's extremely tedious to do
 *     it one by one.
 * ** New Plugin Command: "Picture: Erase Range"
 * *** Erases all pictures within a range of numbers because it's extremely
 *     tedious to do it one by one.
 * * Optimization Update
 * ** Added a more accurate means of parsing numbers for Digit Grouping.
 * ** Window_Base.prototype.textSizeEx now stores data to a cache.
 * * Documentation Update
 * ** Added a section to Major Changes: New Hard-Coded Features on
 *    Digit Grouping and explaining its intricacies.
 * ** Added a note to Plugin Parameters > UI > Reposition Actors to ignore the
 *    setting if using the Battle Core.
 * 
 * Version 1.01: August 23, 2020
 * * Bug Fixes!
 * ** Digit grouping fixed to allow text codes to detect values larger than
 *    1000. Fix made by Olivia and Yanfly.
 * ** Param Plus, Rate, Flat notetags fixed. Fix made by Yanfly.
 * * New Experimental Feature Added:
 * ** JS: Quick Functions found in the Plugin Parameters
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
 * @command OpenURL
 * @text Game: Open URL
 * @desc Opens a website URL from the game.
 *
 * @arg URL:str
 * @text URL
 * @desc Where do you want to take the player?
 * @default https://www.google.com/
 * 
 * @ --------------------------------------------------------------------------
 *
 * @command GoldChange
 * @text Gold: Gain/Lose
 * @desc Allows you to give/take more gold than the event editor limit.
 *
 * @arg value:eval
 * @text Value
 * @desc How much gold should the player gain/lose?
 * Use negative values to remove gold.
 * @default 0
 *
 * @ --------------------------------------------------------------------------
 *
 * @command PictureEasingType
 * @text Picture: Easing Type
 * @desc Changes the easing type to a number of options.
 *
 * @arg pictureId:num
 * @text Picture ID
 * @type number
 * @min 1
 * @max 100
 * @desc Which picture do you wish to apply this easing to?
 * @default 1
 *
 * @arg easingType:str
 * @text Easing Type
 * @type combo
 * @option Linear
 * @option InSine
 * @option OutSine
 * @option InOutSine
 * @option InQuad
 * @option OutQuad
 * @option InOutQuad
 * @option InCubic
 * @option OutCubic
 * @option InOutCubic
 * @option InQuart
 * @option OutQuart
 * @option InOutQuart
 * @option InQuint
 * @option OutQuint
 * @option InOutQuint
 * @option InExpo
 * @option OutExpo
 * @option InOutExpo
 * @option InCirc
 * @option OutCirc
 * @option InOutCirc
 * @option InBack
 * @option OutBack
 * @option InOutBack
 * @option InElastic
 * @option OutElastic
 * @option InOutElastic
 * @option InBounce
 * @option OutBounce
 * @option InOutBounce
 * @desc Select which easing type you wish to apply.
 * @default Linear
 *
 * @arg LineBreak
 * @text ------------------------
 * @default --------------------------------
 *
 * @arg Instructions1
 * @text Instructions
 * @default Insert this Plugin Command after
 *
 * @arg Instructions2
 * @text -
 * @default a "Move Picture" event command.
 * 
 * @arg Instructions3
 * @text -
 * @default Turn off "Wait for Completion"
 *
 * @arg Instructions4
 * @text -
 * @default in the "Move Picture" event.
 *
 * @arg Instructions5
 * @text -
 * @default You may have to add in your own
 *
 * @arg Instructions6
 * @text -
 * @default "Wait" event command after.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command PictureEraseAll
 * @text Picture: Erase All
 * @desc Erases all pictures on the screen because it's extremely
 * tedious to do it one by one.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command PictureEraseRange
 * @text Picture: Erase Range
 * @desc Erases all pictures within a range of numbers because it's
 * extremely tedious to do it one by one.
 *
 * @arg StartID:num
 * @text Starting ID
 * @type number
 * @max 1
 * @max 100
 * @desc The starting ID of the pictures to erase.
 * @default 1
 *
 * @arg EndingID:num
 * @text Ending ID
 * @type number
 * @max 1
 * @max 100
 * @desc The ending ID of the pictures to erase.
 * @default 100
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ScreenShake
 * @text Screen Shake: Custom
 * @desc Creates a custom screen shake effect and also sets
 * the following uses of screen shake to this style.
 *
 * @arg Type:str
 * @text Shake Style
 * @type select
 * @option Original
 * @value original
 * @option Random
 * @value random
 * @option Horizontal
 * @value horizontal
 * @option Vertical
 * @value vertical
 * @desc Select shake style type.
 * @default random
 *
 * @arg Power:num
 * @text Power
 * @type number
 * @max 1
 * @max 9
 * @desc Power level for screen shake.
 * @default 5
 *
 * @arg Speed:num
 * @text Speed
 * @type number
 * @max 1
 * @max 9
 * @desc Speed level for screen shake.
 * @default 5
 *
 * @arg Duration:eval
 * @text Duration
 * @desc Duration of screenshake.
 * You can use code as well.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion
 * @parent Duration:eval
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until completion before moving onto the next event?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SystemSetBattleSystem
 * @text System: Battle System Change
 * @desc Switch to a different battle system in-game.
 *
 * @arg option:str
 * @text Change To
 * @type select
 * @option Database Default (Use game database setting)
 * @value database
 * @option -
 * @value database
 * @option DTB: Default Turn Battle
 * @value dtb
 * @option TPB Active: Time Progress Battle (Active)
 * @value tpb active
 * @option TPB Wait: Time Progress Battle (Wait)
 * @value tpb wait
 * @option -
 * @value database
 * @option BTB: Brave Turn Battle (Req VisuMZ_2_BattleSystemBTB)
 * @value btb
 * @option CTB: Charge Turn Battle (Req VisuMZ_2_BattleSystemCTB)
 * @value ctb
 * @option FTB: Free Turn Battle (Req VisuMZ_2_BattleSystemFTB)
 * @value ftb
 * @option OTB: Order Turn Battle (Req VisuMZ_2_BattleSystemOTB)
 * @value otb
 * @option STB: Standard Turn Battle (Req VisuMZ_2_BattleSystemSTB)
 * @value stb
 * @desc Choose which battle system to switch to.
 * @default database
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SystemLoadImages
 * @text System: Load Images
 * @desc Allows you to (pre) load up images ahead of time.
 *
 * @arg animations:arraystr
 * @text img/animations/
 * @type file[]
 * @dir img/animations/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg battlebacks1:arraystr
 * @text img/battlebacks1/
 * @type file[]
 * @dir img/battlebacks1/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg battlebacks2:arraystr
 * @text img/battlebacks2/
 * @type file[]
 * @dir img/battlebacks2/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg characters:arraystr
 * @text img/characters/
 * @type file[]
 * @dir img/characters/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg enemies:arraystr
 * @text img/enemies/
 * @type file[]
 * @dir img/enemies/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg faces:arraystr
 * @text img/faces/
 * @type file[]
 * @dir img/faces/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg parallaxes:arraystr
 * @text img/parallaxes/
 * @type file[]
 * @dir img/parallaxes/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg pictures:arraystr
 * @text img/pictures/
 * @type file[]
 * @dir img/pictures/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg sv_actors:arraystr
 * @text img/sv_actors/
 * @type file[]
 * @dir img/sv_actors/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg sv_enemies:arraystr
 * @text img/sv_enemies/
 * @type file[]
 * @dir img/sv_enemies/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg system:arraystr
 * @text img/system/
 * @type file[]
 * @dir img/system/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg tilesets:arraystr
 * @text img/tilesets/
 * @type file[]
 * @dir img/tilesets/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg titles1:arraystr
 * @text img/titles1/
 * @type file[]
 * @dir img/titles1/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @arg titles2:arraystr
 * @text img/titles2/
 * @type file[]
 * @dir img/titles2/
 * @desc Which files do you wish to load from this directory?
 * @default []
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SystemSetFontSize
 * @text System: Main Font Size
 * @desc Set the game's main font size.
 *
 * @arg option:num
 * @text Change To
 * @type number
 * @max 1
 * @desc Change the font size to this number.
 * @default 26
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SystemSetSideView
 * @text System: Side View Battle
 * @desc Switch between Front View or Side View for battle.
 *
 * @arg option:str
 * @text Change To
 * @type select
 * @option Front View
 * @value Front View
 * @option Side View
 * @value Side View
 * @option Toggle
 * @value Toggle
 * @desc Choose which view type to switch to.
 * @default Toggle
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SystemSetWindowPadding
 * @text System: Window Padding
 * @desc Change the game's window padding amount.
 *
 * @arg option:num
 * @text Change To
 * @type number
 * @max 1
 * @desc Change the game's standard window padding to this value.
 * Default: 12
 * @default 12
 *
 * @ ==========================================================================
 * @ Plugin Parameters
 * @ ==========================================================================
 *
 * @param BreakHead
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param CoreEngine
 * @default Plugin Parameters
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param QoL:struct
 * @text Quality of Life Settings
 * @type struct<QoLSettings>
 * @desc Quality of Life settings for both developers and players.
 * @default {"PlayTest":"","NewGameBoot:eval":"false","ForceNoPlayTest:eval":"false","OpenConsole:eval":"true","F6key:eval":"true","F7key:eval":"true","NewGameCommonEvent:num":"2","DigitGrouping":"","DigitGroupingStandardText:eval":"true","DigitGroupingExText:eval":"true","DigitGroupingDamageSprites:eval":"true","DigitGroupingGaugeSprites:eval":"true","DigitGroupingLocale:str":"en-US","PlayerBenefit":"","EncounterRateMinimum:num":"10","EscapeAlways:eval":"true","ImprovedAccuracySystem:eval":"true","AccuracyBoost:eval":"true","LevelUpFullHp:eval":"true","LevelUpFullMp:eval":"true","Misc":"","AntiZoomPictures:eval":"true","AutoStretch:str":"stretch","FontShadows:eval":"false","FontSmoothing:eval":"true","KeyItemProtect:eval":"true","ModernControls:eval":"true","NoTileShadows:eval":"true","PixelateImageRendering:eval":"false","RequireFocus:eval":"true","SmartEventCollisionPriority:eval":"true"}
 * 
 * @param BattleSystem:str
 * @text Battle System
 * @type select
 * @option Database Default (Use game database setting)
 * @value database
 * @option -
 * @value database
 * @option DTB: Default Turn Battle
 * @value dtb
 * @option TPB Active: Time Progress Battle (Active)
 * @value tpb active
 * @option TPB wait: Time Progress Battle (Wait)
 * @value tpb wait
 * @option -
 * @value database
 * @option BTB: Brave Turn Battle (Req VisuMZ_2_BattleSystemBTB)
 * @value btb
 * @option CTB: Charge Turn Battle (Req VisuMZ_2_BattleSystemCTB)
 * @value ctb
 * @option FTB: Free Turn Battle (Req VisuMZ_2_BattleSystemFTB)
 * @value ftb
 * @option OTB: Order Turn Battle (Req VisuMZ_2_BattleSystemOTB)
 * @value otb
 * @option STB: Standard Turn Battle (Req VisuMZ_2_BattleSystemSTB)
 * @value stb
 * @desc Choose which battle system to use for your game.
 * @default database
 *
 * @param Color:struct
 * @text Color Settings
 * @type struct<Color>
 * @desc Change the colors used for in-game text.
 * @default {"BasicColors":"","ColorNormal:str":"0","ColorSystem:str":"16","ColorCrisis:str":"17","ColorDeath:str":"18","ColorGaugeBack:str":"19","ColorHPGauge1:str":"20","ColorHPGauge2:str":"21","ColorMPGauge1:str":"22","ColorMPGauge2:str":"23","ColorMPCost:str":"23","ColorPowerUp:str":"24","ColorPowerDown:str":"25","ColorCTGauge1:str":"26","ColorCTGauge2:str":"27","ColorTPGauge1:str":"28","ColorTPGauge2:str":"29","ColorTPCost:str":"29","ColorPending:str":"#2a847d","ColorExpGauge1:str":"30","ColorExpGauge2:str":"31","ColorMaxLvGauge1:str":"14","ColorMaxLvGauge2:str":"6","AlphaColors":"","OutlineColor:str":"rgba(0, 0, 0, 0.6)","DimColor1:str":"rgba(0, 0, 0, 0.6)","DimColor2:str":"rgba(0, 0, 0, 0)","ItemBackColor1:str":"rgba(32, 32, 32, 0.5)","ItemBackColor2:str":"rgba(0, 0, 0, 0.5)","ConditionalColors":"","ActorHPColor:func":"\"// Set the variables used in this function.\\nlet actor = arguments[0];\\n\\n// Check if the actor exists. If not, return normal.\\nif (!actor) {\\n    return this.normalColor();\\n\\n// If the actor is dead, return death color.\\n} else if (actor.isDead()) {\\n    return this.deathColor();\\n\\n// If the actor is dying, return crisis color.\\n} else if (actor.isDying()) {\\n    return this.crisisColor();\\n\\n// Otherwise, return the normal color.\\n} else {\\n    return this.normalColor();\\n}\"","ActorMPColor:func":"\"// Set the variables used in this function.\\nlet actor = arguments[0];\\n\\n// Check if the actor exists. If not, return normal.\\nif (!actor) {\\n    return this.normalColor();\\n\\n// If MP rate is below 25%, return crisis color.\\n} else if (actor.mpRate() < 0.25) {\\n    return this.crisisColor();\\n\\n// Otherwise, return the normal color.\\n} else {\\n    return this.normalColor();\\n}\"","ActorTPColor:func":"\"// Set the variables used in this function.\\nlet actor = arguments[0];\\n\\n// Check if the actor exists. If not, return normal.\\nif (!actor) {\\n    return this.normalColor();\\n\\n// If TP rate is below 25%, return crisis color.\\n} else if (actor.tpRate() < 0.25) {\\n    return this.crisisColor();\\n\\n// Otherwise, return the normal color.\\n} else {\\n    return this.normalColor();\\n}\"","ParamChange:func":"\"// Set the variables used in this function.\\nlet change = arguments[0];\\n\\n// If a positive change, use power up color.\\nif (change > 0) {\\n    return this.powerUpColor();\\n\\n// If a negative change, use power down color.\\n} else if (change < 0) {\\n    return this.powerDownColor();\\n\\n// Otherwise, return the normal color.\\n} else {\\n    return this.normalColor();\\n}\"","DamageColor:func":"\"// Set the variables used in this function.\\nlet colorType = arguments[0];\\n\\n// Check the value of the color type\\n// and return an appropriate color.\\nswitch (colorType) {\\n\\n    case 0: // HP damage\\n        return \\\"#ffffff\\\";\\n\\n    case 1: // HP recover\\n        return \\\"#b9ffb5\\\";\\n\\n    case 2: // MP damage\\n        return \\\"#bb88bb\\\";\\n\\n    case 3: // MP recover\\n        return \\\"#80b0ff\\\";\\n\\n    default:\\n        return \\\"#808080\\\";\\n}\""}
 *
 * @param Gold:struct
 * @text Gold Settings
 * @type struct<Gold>
 * @desc Change up how gold operates and is displayed in-game.
 * @default {"GoldMax:num":"999999999","GoldFontSize:num":"24","GoldIcon:num":"314","GoldOverlap:str":"A Lot","ItemStyle:eval":"true"}
 *
 * @param ImgLoad:struct
 * @text Image Loading
 * @type struct<ImgLoad>
 * @desc Game images that will be loaded upon booting up the game.
 * Use this responsibly!!!
 * @default {"animations:arraystr":"[]","battlebacks1:arraystr":"[]","battlebacks2:arraystr":"[]","characters:arraystr":"[]","enemies:arraystr":"[]","faces:arraystr":"[]","parallaxes:arraystr":"[]","pictures:arraystr":"[]","sv_actors:arraystr":"[]","sv_enemies:arraystr":"[]","system:arraystr":"[\"Balloon\",\"IconSet\"]","tilesets:arraystr":"[]","titles1:arraystr":"[]","titles2:arraystr":"[]"}
 *
 * @param KeyboardInput:struct
 * @text Keyboard Input
 * @type struct<KeyboardInput>
 * @desc Settings for the game that utilize keyboard input.
 * @default {"Controls":"","WASD:eval":"false","DashToggleR:eval":"false","NameInput":"","EnableNameInput:eval":"true","DefaultMode:str":"keyboard","QwertyLayout:eval":"true","NameInputMessage:eval":"\"Type in this character's name.\\nPress \\\\c[5]ENTER\\\\c[0] when you're done.\\n\\n-or-\\n\\nPress \\\\c[5]arrow keys\\\\c[0]/\\\\c[5]TAB\\\\c[0] to switch\\nto manual character entry.\\n\\nPress \\\\c[5]ESC\\\\c[0]/\\\\c[5]TAB\\\\c[0] to use to keyboard.\"","NumberInput":"","EnableNumberInput:eval":"true","ButtonAssist":"","Keyboard:str":"Keyboard","Manual:str":"Manual"}
 *
 * @param MenuBg:struct
 * @text Menu Background Settings
 * @type struct<MenuBg>
 * @desc Change how menu backgrounds look for each scene.
 * @default {"Scene_Menu:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Item:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Skill:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Equip:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Status:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Options:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Save:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Load:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_GameEnd:struct":"{\"SnapshotOpacity:num\":\"128\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Shop:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Name:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}","Scene_Unlisted:struct":"{\"SnapshotOpacity:num\":\"192\",\"BgFilename1:str\":\"\",\"BgFilename2:str\":\"\"}"}
 *
 * @param ButtonAssist:struct
 * @text Menu Button Assist Window
 * @type struct<ButtonAssist>
 * @desc Settings pertaining to the Button Assist window found in in-game menus.
 * @default {"General":"","Enable:eval":"true","Location:str":"bottom","BgType:num":"0","Text":"","TextFmt:str":"%1:%2","MultiKeyFmt:str":"%1/%2","OkText:str":"Select","CancelText:str":"Back","SwitchActorText:str":"Switch Ally","Keys":"","KeyUnlisted:str":"\\}❪%1❫\\{","KeyUP:str":"^","KeyDOWN:str":"v","KeyLEFT:str":"<<","KeyRIGHT:str":">>","KeySHIFT:str":"\\}❪SHIFT❫\\{","KeyTAB:str":"\\}❪TAB❫\\{","KeyA:str":"A","KeyB:str":"B","KeyC:str":"C","KeyD:str":"D","KeyE:str":"E","KeyF:str":"F","KeyG:str":"G","KeyH:str":"H","KeyI:str":"I","KeyJ:str":"J","KeyK:str":"K","KeyL:str":"L","KeyM:str":"M","KeyN:str":"N","KeyO:str":"O","KeyP:str":"P","KeyQ:str":"Q","KeyR:str":"R","KeyS:str":"S","KeyT:str":"T","KeyU:str":"U","KeyV:str":"V","KeyW:str":"W","KeyX:str":"X","KeyY:str":"Y","KeyZ:str":"Z"}
 *
 * @param MenuLayout:struct
 * @text Menu Layout Settings
 * @type struct<MenuLayout>
 * @desc Change how menu layouts look for each scene.
 * @default {"Title:struct":"{\"TitleScreen\":\"\",\"DocumentTitleFmt:str\":\"%1: %2 - Version %3\",\"Subtitle:str\":\"Subtitle\",\"Version:str\":\"0.00\",\"drawGameTitle:func\":\"\\\"const x = 20;\\\\nconst y = Graphics.height / 4;\\\\nconst maxWidth = Graphics.width - x * 2;\\\\nconst text = $dataSystem.gameTitle;\\\\nconst bitmap = this._gameTitleSprite.bitmap;\\\\nbitmap.fontFace = $gameSystem.mainFontFace();\\\\nbitmap.outlineColor = \\\\\\\"black\\\\\\\";\\\\nbitmap.outlineWidth = 8;\\\\nbitmap.fontSize = 72;\\\\nbitmap.drawText(text, x, y, maxWidth, 48, \\\\\\\"center\\\\\\\");\\\"\",\"drawGameSubtitle:func\":\"\\\"const x = 20;\\\\nconst y = Graphics.height / 4 + 72;\\\\nconst maxWidth = Graphics.width - x * 2;\\\\nconst text = Scene_Title.subtitle;\\\\nconst bitmap = this._gameTitleSprite.bitmap;\\\\nbitmap.fontFace = $gameSystem.mainFontFace();\\\\nbitmap.outlineColor = \\\\\\\"black\\\\\\\";\\\\nbitmap.outlineWidth = 6;\\\\nbitmap.fontSize = 48;\\\\nbitmap.drawText(text, x, y, maxWidth, 48, \\\\\\\"center\\\\\\\");\\\"\",\"drawGameVersion:func\":\"\\\"const bitmap = this._gameTitleSprite.bitmap;\\\\nconst x = 0;\\\\nconst y = Graphics.height - 20;\\\\nconst width = Math.round(Graphics.width / 4);\\\\nconst height = 20;\\\\nconst c1 = ColorManager.dimColor1();\\\\nconst c2 = ColorManager.dimColor2();\\\\nconst text = 'Version ' + Scene_Title.version;\\\\nbitmap.gradientFillRect(x, y, width, height, c1, c2);\\\\nbitmap.fontFace = $gameSystem.mainFontFace();\\\\nbitmap.outlineColor = \\\\\\\"black\\\\\\\";\\\\nbitmap.outlineWidth = 3;\\\\nbitmap.fontSize = 16;\\\\nbitmap.drawText(text, x + 4, y, Graphics.width, height, \\\\\\\"left\\\\\\\");\\\"\",\"CommandRect:func\":\"\\\"const offsetX = $dataSystem.titleCommandWindow.offsetX;\\\\nconst offsetY = $dataSystem.titleCommandWindow.offsetY;\\\\nconst rows = this.commandWindowRows();\\\\nconst width = this.mainCommandWidth();\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nconst x = (Graphics.boxWidth - width) / 2 + offsetX;\\\\nconst y = Graphics.boxHeight - height - 96 + offsetY;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ButtonFadeSpeed:num\":\"4\"}","MainMenu:struct":"{\"CommandWindow\":\"\",\"CommandBgType:num\":\"0\",\"CommandRect:func\":\"\\\"const width = this.mainCommandWidth();\\\\nconst height = this.mainAreaHeight() - this.goldWindowRect().height;\\\\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\\\\nconst y = this.mainAreaTop();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"GoldWindow\":\"\",\"GoldBgType:num\":\"0\",\"GoldRect:func\":\"\\\"const rows = 1;\\\\nconst width = this.mainCommandWidth();\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\\\\nconst y = this.mainAreaBottom() - height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusWindow\":\"\",\"StatusBgType:num\":\"0\",\"StatusRect:func\":\"\\\"const width = Graphics.boxWidth - this.mainCommandWidth();\\\\nconst height = this.mainAreaHeight();\\\\nconst x = this.isRightInputMode() ? 0 : Graphics.boxWidth - width;\\\\nconst y = this.mainAreaTop();\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","ItemMenu:struct":"{\"HelpWindow\":\"\",\"HelpBgType:num\":\"0\",\"HelpRect:func\":\"\\\"const x = 0;\\\\nconst y = this.helpAreaTop();\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.helpAreaHeight();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"CategoryWindow\":\"\",\"CategoryBgType:num\":\"0\",\"CategoryRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst rows = 1;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ItemWindow\":\"\",\"ItemBgType:num\":\"0\",\"ItemRect:func\":\"\\\"const x = 0;\\\\nconst y = this._categoryWindow.y + this._categoryWindow.height;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaBottom() - y;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ActorWindow\":\"\",\"ActorBgType:num\":\"0\",\"ActorRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaHeight();\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","SkillMenu:struct":"{\"HelpWindow\":\"\",\"HelpBgType:num\":\"0\",\"HelpRect:func\":\"\\\"const x = 0;\\\\nconst y = this.helpAreaTop();\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.helpAreaHeight();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"SkillTypeWindow\":\"\",\"SkillTypeBgType:num\":\"0\",\"SkillTypeRect:func\":\"\\\"const rows = 3;\\\\nconst width = this.mainCommandWidth();\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\\\\nconst y = this.mainAreaTop();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusWindow\":\"\",\"StatusBgType:num\":\"0\",\"StatusRect:func\":\"\\\"const width = Graphics.boxWidth - this.mainCommandWidth();\\\\nconst height = this._skillTypeWindow.height;\\\\nconst x = this.isRightInputMode() ? 0 : Graphics.boxWidth - width;\\\\nconst y = this.mainAreaTop();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ItemWindow\":\"\",\"ItemBgType:num\":\"0\",\"ItemRect:func\":\"\\\"const x = 0;\\\\nconst y = this._statusWindow.y + this._statusWindow.height;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaHeight() - this._statusWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ActorWindow\":\"\",\"ActorBgType:num\":\"0\",\"ActorRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaHeight();\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","EquipMenu:struct":"{\"HelpWindow\":\"\",\"HelpBgType:num\":\"0\",\"HelpRect:func\":\"\\\"const x = 0;\\\\nconst y = this.helpAreaTop();\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.helpAreaHeight();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusWindow\":\"\",\"StatusBgType:num\":\"0\",\"StatusRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst width = this.statusWidth();\\\\nconst height = this.mainAreaHeight();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"CommandWindow\":\"\",\"CommandBgType:num\":\"0\",\"CommandRect:func\":\"\\\"const x = this.statusWidth();\\\\nconst y = this.mainAreaTop();\\\\nconst rows = 1;\\\\nconst width = Graphics.boxWidth - this.statusWidth();\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"SlotWindow\":\"\",\"SlotBgType:num\":\"0\",\"SlotRect:func\":\"\\\"const commandWindowRect = this.commandWindowRect();\\\\nconst x = this.statusWidth();\\\\nconst y = commandWindowRect.y + commandWindowRect.height;\\\\nconst width = Graphics.boxWidth - this.statusWidth();\\\\nconst height = this.mainAreaHeight() - commandWindowRect.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ItemWindow\":\"\",\"ItemBgType:num\":\"0\",\"ItemRect:func\":\"\\\"return this.slotWindowRect();\\\"\"}","StatusMenu:struct":"{\"ProfileWindow\":\"\",\"ProfileBgType:num\":\"0\",\"ProfileRect:func\":\"\\\"const width = Graphics.boxWidth;\\\\nconst height = this.profileHeight();\\\\nconst x = 0;\\\\nconst y = this.mainAreaBottom() - height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusWindow\":\"\",\"StatusBgType:num\":\"0\",\"StatusRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.statusParamsWindowRect().y - y;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusParamsWindow\":\"\",\"StatusParamsBgType:num\":\"0\",\"StatusParamsRect:func\":\"\\\"const width = this.statusParamsWidth();\\\\nconst height = this.statusParamsHeight();\\\\nconst x = 0;\\\\nconst y = this.mainAreaBottom() - this.profileHeight() - height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusEquipWindow\":\"\",\"StatusEquipBgType:num\":\"0\",\"StatusEquipRect:func\":\"\\\"const width = Graphics.boxWidth - this.statusParamsWidth();\\\\nconst height = this.statusParamsHeight();\\\\nconst x = this.statusParamsWidth();\\\\nconst y = this.mainAreaBottom() - this.profileHeight() - height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","OptionsMenu:struct":"{\"OptionsWindow\":\"\",\"OptionsBgType:num\":\"0\",\"OptionsRect:func\":\"\\\"const n = Math.min(this.maxCommands(), this.maxVisibleCommands());\\\\nconst width = 400;\\\\nconst height = this.calcWindowHeight(n, true);\\\\nconst x = (Graphics.boxWidth - width) / 2;\\\\nconst y = (Graphics.boxHeight - height) / 2;\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","SaveMenu:struct":"{\"HelpWindow\":\"\",\"HelpBgType:num\":\"0\",\"HelpRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst rows = 1;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.calcWindowHeight(rows, false);\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ListWindow\":\"\",\"ListBgType:num\":\"0\",\"ListRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop() + this._helpWindow.height;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaHeight() - this._helpWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","LoadMenu:struct":"{\"HelpWindow\":\"\",\"HelpBgType:num\":\"0\",\"HelpRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst rows = 1;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.calcWindowHeight(rows, false);\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ListWindow\":\"\",\"ListBgType:num\":\"0\",\"ListRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop() + this._helpWindow.height;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaHeight() - this._helpWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","GameEnd:struct":"{\"CommandList:arraystruct\":\"[\\\"{\\\\\\\"Symbol:str\\\\\\\":\\\\\\\"toTitle\\\\\\\",\\\\\\\"TextStr:str\\\\\\\":\\\\\\\"Untitled\\\\\\\",\\\\\\\"TextJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return TextManager.toTitle;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"ShowJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return true;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"EnableJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return true;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"ExtJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return null;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"CallHandlerJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"SceneManager._scene.commandToTitle();\\\\\\\\\\\\\\\"\\\\\\\"}\\\",\\\"{\\\\\\\"Symbol:str\\\\\\\":\\\\\\\"cancel\\\\\\\",\\\\\\\"TextStr:str\\\\\\\":\\\\\\\"Untitled\\\\\\\",\\\\\\\"TextJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return TextManager.cancel;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"ShowJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return true;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"EnableJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return true;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"ExtJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return null;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"CallHandlerJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"SceneManager._scene.popScene();\\\\\\\\\\\\\\\"\\\\\\\"}\\\"]\",\"CommandBgType:num\":\"0\",\"CommandRect:func\":\"\\\"const rows = 2;\\\\nconst width = this.mainCommandWidth();\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nconst x = (Graphics.boxWidth - width) / 2;\\\\nconst y = (Graphics.boxHeight - height) / 2;\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","ShopMenu:struct":"{\"HelpWindow\":\"\",\"HelpBgType:num\":\"0\",\"HelpRect:func\":\"\\\"const wx = 0;\\\\nconst wy = this.helpAreaTop();\\\\nconst ww = Graphics.boxWidth;\\\\nconst wh = this.helpAreaHeight();\\\\nreturn new Rectangle(wx, wy, ww, wh);\\\"\",\"GoldWindow\":\"\",\"GoldBgType:num\":\"0\",\"GoldRect:func\":\"\\\"const rows = 1;\\\\nconst width = this.mainCommandWidth();\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nconst x = Graphics.boxWidth - width;\\\\nconst y = this.mainAreaTop();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"CommandWindow\":\"\",\"CommandBgType:num\":\"0\",\"CommandRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst rows = 1;\\\\nconst width = this._goldWindow.x;\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"DummyWindow\":\"\",\"DummyBgType:num\":\"0\",\"DummyRect:func\":\"\\\"const x = 0;\\\\nconst y = this._commandWindow.y + this._commandWindow.height;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaHeight() - this._commandWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"NumberWindow\":\"\",\"NumberBgType:num\":\"0\",\"NumberRect:func\":\"\\\"const x = 0;\\\\nconst y = this._dummyWindow.y;\\\\nconst width = Graphics.boxWidth - this.statusWidth();\\\\nconst height = this._dummyWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusWindow\":\"\",\"StatusBgType:num\":\"0\",\"StatusRect:func\":\"\\\"const width = this.statusWidth();\\\\nconst height = this._dummyWindow.height;\\\\nconst x = Graphics.boxWidth - width;\\\\nconst y = this._dummyWindow.y;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"BuyWindow\":\"\",\"BuyBgType:num\":\"0\",\"BuyRect:func\":\"\\\"const x = 0;\\\\nconst y = this._dummyWindow.y;\\\\nconst width = Graphics.boxWidth - this.statusWidth();\\\\nconst height = this._dummyWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"CategoryWindow\":\"\",\"CategoryBgType:num\":\"0\",\"CategoryRect:func\":\"\\\"const x = 0;\\\\nconst y = this._dummyWindow.y;\\\\nconst rows = 1;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"SellWindow\":\"\",\"SellBgType:num\":\"0\",\"SellRect:func\":\"\\\"const x = 0;\\\\nconst y = this._categoryWindow.y + this._categoryWindow.height;\\\\nconst width = Graphics.boxWidth;\\\\nconst height =\\\\n    this.mainAreaHeight() -\\\\n    this._commandWindow.height -\\\\n    this._categoryWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","NameMenu:struct":"{\"EditWindow\":\"\",\"EditBgType:num\":\"0\",\"EditRect:func\":\"\\\"const rows = 9;\\\\nconst inputWindowHeight = this.calcWindowHeight(rows, true);\\\\nconst padding = $gameSystem.windowPadding();\\\\nconst width = 600;\\\\nconst height = Math.min(ImageManager.faceHeight + padding * 2, this.mainAreaHeight() - inputWindowHeight);\\\\nconst x = (Graphics.boxWidth - width) / 2;\\\\nconst y = (this.mainAreaHeight() - (height + inputWindowHeight)) / 2 + this.mainAreaTop();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"InputWindow\":\"\",\"InputBgType:num\":\"0\",\"InputRect:func\":\"\\\"const x = this._editWindow.x;\\\\nconst y = this._editWindow.y + this._editWindow.height;\\\\nconst rows = 9;\\\\nconst width = this._editWindow.width;\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}"}
 *
 * @param Param:struct
 * @text Parameter Settings
 * @type struct<Param>
 * @desc Change up the limits of parameters and how they're calculated.
 * @default {"DisplayedParams:arraystr":"[\"ATK\",\"DEF\",\"MAT\",\"MDF\",\"AGI\",\"LUK\"]","ExtDisplayedParams:arraystr":"[\"MaxHP\",\"MaxMP\",\"ATK\",\"DEF\",\"MAT\",\"MDF\",\"AGI\",\"LUK\"]","BasicParameters":"","CrisisRate:num":"0.25","BasicParameterFormula:func":"\"// Determine the variables used in this calculation.\\nlet paramId = arguments[0];\\nlet base = this.paramBase(paramId);\\nlet plus = this.paramPlus(paramId);\\nlet paramRate = this.paramRate(paramId);\\nlet buffRate = this.paramBuffRate(paramId);\\nlet flatBonus = this.paramFlatBonus(paramId);\\n\\n// Formula to determine total parameter value.\\nlet value = (base + plus) * paramRate * buffRate + flatBonus;\\n\\n// Determine the limits\\nconst maxValue = this.paramMax(paramId);\\nconst minValue = this.paramMin(paramId);\\n\\n// Final value\\nreturn Math.round(value.clamp(minValue, maxValue));\"","BasicParamCaps":"","BasicActorParamCaps":"","BasicActorParamMax0:str":"9999","BasicActorParamMax1:str":"9999","BasicActorParamMax2:str":"999","BasicActorParamMax3:str":"999","BasicActorParamMax4:str":"999","BasicActorParamMax5:str":"999","BasicActorParamMax6:str":"999","BasicActorParamMax7:str":"999","BasicEnemyParamCaps":"","BasicEnemyParamMax0:str":"999999","BasicEnemyParamMax1:str":"9999","BasicEnemyParamMax2:str":"999","BasicEnemyParamMax3:str":"999","BasicEnemyParamMax4:str":"999","BasicEnemyParamMax5:str":"999","BasicEnemyParamMax6:str":"999","BasicEnemyParamMax7:str":"999","XParameters":"","XParameterFormula:func":"\"// Determine the variables used in this calculation.\\nlet xparamId = arguments[0];\\nlet base = this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId);\\nlet plus = this.xparamPlus(xparamId);\\nlet paramRate = this.xparamRate(xparamId);\\nlet flatBonus = this.xparamFlatBonus(xparamId);\\n\\n// Formula to determine total parameter value.\\nlet value = (base + plus) * paramRate + flatBonus;\\n\\n// Final value\\nreturn value;\"","XParamVocab":"","XParamVocab0:str":"Hit","XParamVocab1:str":"Evasion","XParamVocab2:str":"Critical Rate","XParamVocab3:str":"Critical Evade","XParamVocab4:str":"Magic Evade","XParamVocab5:str":"Magic Reflect","XParamVocab6:str":"Counter","XParamVocab7:str":"HP Regen","XParamVocab8:str":"MP Regen","XParamVocab9:str":"TP Regen","SParameters":"","SParameterFormula:func":"\"// Determine the variables used in this calculation.\\nlet sparamId = arguments[0];\\nlet base = this.traitsPi(Game_BattlerBase.TRAIT_SPARAM, sparamId);\\nlet plus = this.sparamPlus(sparamId);\\nlet paramRate = this.sparamRate(sparamId);\\nlet flatBonus = this.sparamFlatBonus(sparamId);\\n\\n// Formula to determine total parameter value.\\nlet value = (base + plus) * paramRate + flatBonus;\\n\\n// Final value\\nreturn value;\"","SParamVocab":"","SParamVocab0:str":"Aggro","SParamVocab1:str":"Guard","SParamVocab2:str":"Recovery","SParamVocab3:str":"Item Effect","SParamVocab4:str":"MP Cost","SParamVocab5:str":"TP Charge","SParamVocab6:str":"Physical DMG","SParamVocab7:str":"Magical DMG","SParamVocab8:str":"Floor DMG","SParamVocab9:str":"EXP Gain","Icons":"","DrawIcons:eval":"true","IconParam0:str":"84","IconParam1:str":"165","IconParam2:str":"76","IconParam3:str":"81","IconParam4:str":"101","IconParam5:str":"133","IconParam6:str":"140","IconParam7:str":"87","IconXParam0:str":"102","IconXParam1:str":"82","IconXParam2:str":"78","IconXParam3:str":"82","IconXParam4:str":"171","IconXParam5:str":"222","IconXParam6:str":"77","IconXParam7:str":"72","IconXParam8:str":"72","IconXParam9:str":"72","IconSParam0:str":"5","IconSParam1:str":"128","IconSParam2:str":"72","IconSParam3:str":"176","IconSParam4:str":"165","IconSParam5:str":"164","IconSParam6:str":"76","IconSParam7:str":"79","IconSParam8:str":"141","IconSParam9:str":"73"}
 *
 * @param CustomParam:arraystruct
 * @text Custom Parameters
 * @parent Param:struct
 * @type struct<CustomParam>[]
 * @desc Create custom parameters for your game!
 * These will appear in VisuStella MZ menus.
 * @default ["{\"ParamName:str\":\"Strength\",\"Abbreviation:str\":\"str\",\"Icon:num\":\"77\",\"Type:str\":\"integer\",\"ValueJS:json\":\"\\\"// Declare Constants\\\\nconst user = this;\\\\n\\\\n// Calculations\\\\nreturn (user.atk * 0.75) + (user.def * 0.25);\\\"\"}","{\"ParamName:str\":\"Dexterity\",\"Abbreviation:str\":\"dex\",\"Icon:num\":\"82\",\"Type:str\":\"integer\",\"ValueJS:json\":\"\\\"// Declare Constants\\\\nconst user = this;\\\\n\\\\n// Calculations\\\\nreturn (user.agi * 0.75) + (user.atk * 0.25);\\\"\"}","{\"ParamName:str\":\"Constitution\",\"Abbreviation:str\":\"con\",\"Icon:num\":\"81\",\"Type:str\":\"integer\",\"ValueJS:json\":\"\\\"// Declare Constants\\\\nconst user = this;\\\\n\\\\n// Calculations\\\\nreturn (user.def * 0.75) + (user.mdf * 0.25);\\\"\"}","{\"ParamName:str\":\"Intelligence\",\"Abbreviation:str\":\"int\",\"Icon:num\":\"79\",\"Type:str\":\"integer\",\"ValueJS:json\":\"\\\"// Declare Constants\\\\nconst user = this;\\\\n\\\\n// Calculations\\\\nreturn (user.mat * 0.75) + (user.mdf * 0.25);\\\"\"}","{\"ParamName:str\":\"Wisdom\",\"Abbreviation:str\":\"wis\",\"Icon:num\":\"72\",\"Type:str\":\"integer\",\"ValueJS:json\":\"\\\"// Declare Constants\\\\nconst user = this;\\\\n\\\\n// Calculations\\\\nreturn (user.mdf * 0.75) + (user.luk * 0.25);\\\"\"}","{\"ParamName:str\":\"Charisma\",\"Abbreviation:str\":\"cha\",\"Icon:num\":\"84\",\"Type:str\":\"integer\",\"ValueJS:json\":\"\\\"// Declare Constants\\\\nconst user = this;\\\\n\\\\n// Calculations\\\\nreturn (user.luk * 0.75) + (user.agi * 0.25);\\\"\"}"]
 *
 * @param ScreenShake:struct
 * @text Screen Shake Settings
 * @type struct<ScreenShake>
 * @desc Get more screen shake effects into your game!
 * @default {"DefaultStyle:str":"random","originalJS:func":"\"// Calculation\\nthis.x += Math.round($gameScreen.shake());\"","randomJS:func":"\"// Calculation\\n// Original Formula by Aries of Sheratan\\nconst power = $gameScreen._shakePower * 0.75;\\nconst speed = $gameScreen._shakeSpeed * 0.60;\\nconst duration = $gameScreen._shakeDuration;\\nthis.x += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);\\nthis.y += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);\"","horzJS:func":"\"// Calculation\\n// Original Formula by Aries of Sheratan\\nconst power = $gameScreen._shakePower * 0.75;\\nconst speed = $gameScreen._shakeSpeed * 0.60;\\nconst duration = $gameScreen._shakeDuration;\\nthis.x += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);\"","vertJS:func":"\"// Calculation\\n// Original Formula by Aries of Sheratan\\nconst power = $gameScreen._shakePower * 0.75;\\nconst speed = $gameScreen._shakeSpeed * 0.60;\\nconst duration = $gameScreen._shakeDuration;\\nthis.y += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);\""}
 *
 * @param TitleCommandList:arraystruct
 * @text Title Command List
 * @type struct<Command>[]
 * @desc Window commands used by the title screen.
 * Add new commands here.
 * @default ["{\"Symbol:str\":\"newGame\",\"TextStr:str\":\"Untitled\",\"TextJS:func\":\"\\\"return TextManager.newGame;\\\"\",\"ShowJS:func\":\"\\\"return true;\\\"\",\"EnableJS:func\":\"\\\"return true;\\\"\",\"ExtJS:func\":\"\\\"return null;\\\"\",\"CallHandlerJS:func\":\"\\\"SceneManager._scene.commandNewGame();\\\"\"}","{\"Symbol:str\":\"continue\",\"TextStr:str\":\"Untitled\",\"TextJS:func\":\"\\\"return TextManager.continue_;\\\"\",\"ShowJS:func\":\"\\\"return true;\\\"\",\"EnableJS:func\":\"\\\"return DataManager.isAnySavefileExists();\\\"\",\"ExtJS:func\":\"\\\"return null;\\\"\",\"CallHandlerJS:func\":\"\\\"SceneManager._scene.commandContinue();\\\"\"}","{\"Symbol:str\":\"options\",\"TextStr:str\":\"Untitled\",\"TextJS:func\":\"\\\"return TextManager.options;\\\"\",\"ShowJS:func\":\"\\\"return true;\\\"\",\"EnableJS:func\":\"\\\"return true;\\\"\",\"ExtJS:func\":\"\\\"return null;\\\"\",\"CallHandlerJS:func\":\"\\\"SceneManager._scene.commandOptions();\\\"\"}","{\"Symbol:str\":\"shutdown\",\"TextStr:str\":\"Untitled\",\"TextJS:func\":\"\\\"return TextManager.gameEnd;\\\"\",\"ShowJS:func\":\"\\\"return Utils.isNwjs();\\\"\",\"EnableJS:func\":\"\\\"return true;\\\"\",\"ExtJS:func\":\"\\\"return null;\\\"\",\"CallHandlerJS:func\":\"\\\"SceneManager.exit();\\\\n\\\\n// Note!\\\\n// Do NOT use this command with mobile devices or\\\\n// browser games. All it does is cause the game to\\\\n// display a blank, black canvas which the player\\\\n// is unable to do anything with. It does NOT force\\\\n// close the browser tab nor the app.\\\"\"}"]
 *
 * @param TitlePicButtons:arraystruct
 * @text Title Picture Buttons
 * @type struct<TitlePictureButton>[]
 * @desc Buttons that can be inserted into the title screen.
 * Add new title buttons here.
 * @default []
 *
 * @param UI:struct
 * @text UI Settings
 * @type struct<UI>
 * @desc Change up various in-game UI aspects.
 * @default {"UIArea":"","FadeSpeed:num":"24","BoxMargin:num":"4","CommandWidth:num":"240","BottomHelp:eval":"false","RightMenus:eval":"true","ShowButtons:eval":"true","cancelShowButton:eval":"true","menuShowButton:eval":"true","pagedownShowButton:eval":"true","numberShowButton:eval":"true","ButtonHeight:num":"52","BottomButtons:eval":"false","SideButtons:eval":"true","LargerResolution":"","RepositionActors:eval":"true","RepositionEnemies:eval":"true","MenuObjects":"","LvExpGauge:eval":"true","ParamArrow:str":"→","TextCodeSupport":"","TextCodeClassNames:eval":"true","TextCodeNicknames:eval":"true"}
 *
 * @param Window:struct
 * @text Window Settings
 * @type struct<Window>
 * @desc Adjust various in-game window settings.
 * @default {"WindowDefaults":"","EnableMasking:eval":"false","LineHeight:num":"36","SelectableItems":"","ShowItemBackground:eval":"true","ItemHeight:num":"8","DrawItemBackgroundJS:func":"\"const rect = arguments[0];\\nconst c1 = ColorManager.itemBackColor1();\\nconst c2 = ColorManager.itemBackColor2();\\nconst x = rect.x;\\nconst y = rect.y;\\nconst w = rect.width;\\nconst h = rect.height;\\nthis.contentsBack.gradientFillRect(x, y, w, h, c1, c2, true);\\nthis.contentsBack.strokeRect(x, y, w, h, c1);\"","ItemPadding:num":"8","BackOpacity:num":"192","TranslucentOpacity:num":"160","OpenSpeed:num":"32","ColSpacing:num":"8","RowSpacing:num":"4"}
 *
 * @param jsQuickFunc:arraystruct
 * @text JS: Quick Functions
 * @type struct<jsQuickFunc>[]
 * @desc Create quick JavaScript functions available from the
 * global namespace. Use with caution and moderation!!!
 * @default ["{\"FunctionName:str\":\"Example\",\"CodeJS:json\":\"\\\"// Insert this as a function anywhere you can input code\\\\n// such as Script Calls or Conditional Branch Scripts.\\\\n\\\\n// Process Code\\\\nreturn 'Example';\\\"\"}","{\"FunctionName:str\":\"Bad  Code  Name\",\"CodeJS:json\":\"\\\"// If a function name has spaces in them, the spaces will\\\\n// be removed. \\\\\\\"Bad  Code  Name\\\\\\\" becomes \\\\\\\"BadeCodeName\\\\\\\".\\\\n\\\\n// Process Code\\\\nOhNoItsBadCode()\\\\n\\\\n// If a function has bad code, a fail safe will catch the\\\\n// error and display it in the console.\\\"\"}","{\"FunctionName:str\":\"RandomNumber\",\"CodeJS:json\":\"\\\"// This generates a random number from 0 to itself.\\\\n// Example: RandomNumber(10)\\\\n\\\\n// Process Code\\\\nconst number = (arguments[0] || 0) + 1;\\\\nreturn Math.floor(number * Math.random());\\\"\"}","{\"FunctionName:str\":\"RandomBetween\",\"CodeJS:json\":\"\\\"// This generates a random number between two arguments.\\\\n// Example: RandomNumber(5, 10)\\\\n\\\\n// Process Code\\\\nlet min = Math.min(arguments[0] || 0, arguments[1] || 0);\\\\nlet max = Math.max(arguments[0] || 0, arguments[1] || 0);\\\\nreturn Math.floor(Math.random() * (max - min + 1) + min);\\\"\"}","{\"FunctionName:str\":\"RandomFrom\",\"CodeJS:json\":\"\\\"// Selects a number from the list of inserted numbers.\\\\n// Example: RandomFrom(5, 10, 15, 20)\\\\n\\\\n// Process Code\\\\nreturn arguments[Math.randomInt(arguments.length)];\\\"\"}"]
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
 * Quality of Life Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~QoLSettings:
 *
 * @param PlayTest
 * @text Play Test
 *
 * @param NewGameBoot:eval
 * @text New Game on Boot
 * @parent PlayTest
 * @type boolean
 * @on Start New Game
 * @off Keep Title Screen
 * @desc Automatically start a new game on Play Test?
 * Only enabled during Play Test.
 * @default false
 *
 * @param ForceNoPlayTest:eval
 * @text No Play Test Mode
 * @parent PlayTest
 * @type boolean
 * @on Cancel Play Test
 * @off Keep Play Test
 * @desc Force the game to be out of Play Test mode when play testing.
 * @default false
 *
 * @param OpenConsole:eval
 * @text Open Console on Boot
 * @parent PlayTest
 * @type boolean
 * @on Open
 * @off Don't Open
 * @desc Open the Debug Console upon booting up your game?
 * Only enabled during Play Test.
 * @default true
 *
 * @param F6key:eval
 * @text F6: Toggle Sound
 * @parent PlayTest
 * @type boolean
 * @on Enable
 * @off Don't
 * @desc F6 Key Function: Turn on all sound to 100% or to 0%,
 * toggling between the two.
 * @default true
 *
 * @param F7key:eval
 * @text F7: Toggle Fast Mode
 * @parent PlayTest
 * @type boolean
 * @on Enable
 * @off Don't
 * @desc F7 Key Function: Toggle fast mode.
 * @default true
 *
 * @param NewGameCommonEvent:num
 * @text NewGame > CommonEvent
 * @parent PlayTest
 * @type common_event
 * @desc Runs a common event each time a new game during play test
 * session is started.
 * @default 0
 *
 * @param DigitGrouping
 * @text Digit Grouping
 *
 * @param DigitGroupingStandardText:eval
 * @text Standard Text
 * @parent DigitGrouping
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Make numbers like 1234567 appear like 1,234,567 for
 * standard text inside windows?
 * @default true
 *
 * @param DigitGroupingExText:eval
 * @text Ex Text
 * @parent DigitGrouping
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Make numbers like 1234567 appear like 1,234,567 for
 * ex text, written through drawTextEx (like messages)?
 * @default true
 *
 * @param DigitGroupingDamageSprites:eval
 * @text Damage Sprites
 * @parent DigitGrouping
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Make numbers like 1234567 appear like 1,234,567 for
 * in-battle damage sprites?
 * @default true
 *
 * @param DigitGroupingGaugeSprites:eval
 * @text Gauge Sprites
 * @parent DigitGrouping
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Make numbers like 1234567 appear like 1,234,567 for
 * visible gauge sprites such as HP, MP, and TP gauges?
 * @default true
 *
 * @param DigitGroupingLocale:str
 * @text Country/Locale
 * @parent DigitGrouping
 * @type combo
 * @option ar-SA
 * @option bn-BD
 * @option bn-IN
 * @option cs-CZ
 * @option da-DK
 * @option de-AT
 * @option de-CH
 * @option de-DE
 * @option el-GR
 * @option en-AU
 * @option en-CA
 * @option en-GB
 * @option en-IE
 * @option en-IN
 * @option en-NZ
 * @option en-US
 * @option en-ZA
 * @option es-AR
 * @option es-CL
 * @option es-CO
 * @option es-ES
 * @option es-MX
 * @option es-US
 * @option fi-FI
 * @option fr-BE
 * @option fr-CA
 * @option fr-CH
 * @option fr-FR
 * @option he-IL
 * @option hi-IN
 * @option hu-HU
 * @option id-ID
 * @option it-CH
 * @option it-IT
 * @option jp-JP
 * @option ko-KR
 * @option nl-BE
 * @option nl-NL
 * @option no-NO
 * @option pl-PL
 * @option pt-BR
 * @option pt-PT
 * @option ro-RO
 * @option ru-RU
 * @option sk-SK
 * @option sv-SE
 * @option ta-IN
 * @option ta-LK
 * @option th-TH
 * @option tr-TR
 * @option zh-CN
 * @option zh-HK
 * @option zh-TW
 * @desc Base the digit grouping on which country/locale?
 * @default en-US
 *
 * @param PlayerBenefit
 * @text Player Benefit
 *
 * @param EncounterRateMinimum:num
 * @text Encounter Rate Min
 * @parent PlayerBenefit
 * @min 0
 * @desc Minimum number of steps the player can take without any random encounters.
 * @default 10
 *
 * @param EscapeAlways:eval
 * @text Escape Always
 * @parent PlayerBenefit
 * @type boolean
 * @on Always
 * @off Default
 * @desc If the player wants to escape a battle, let them escape the battle with 100% chance.
 * @default true
 *
 * @param ImprovedAccuracySystem:eval
 * @text Accuracy Formula
 * @parent PlayerBenefit
 * @type boolean
 * @on Improve
 * @off Default
 * @desc Accuracy formula calculation change to
 * Skill Hit% * (User HIT - Target EVA) for better results.
 * @default true
 *
 * @param AccuracyBoost:eval
 * @text Accuracy Boost
 * @parent PlayerBenefit
 * @type boolean
 * @on Boost
 * @off Default
 * @desc Boost HIT and EVA rates in favor of the player.
 * @default true
 *
 * @param LevelUpFullHp:eval
 * @text Level Up -> Full HP
 * @parent PlayerBenefit
 * @type boolean
 * @on Heal
 * @off Default
 * @desc Recovers full HP when an actor levels up.
 * @default true
 *
 * @param LevelUpFullMp:eval
 * @text Level Up -> Full MP
 * @parent PlayerBenefit
 * @type boolean
 * @on Heal
 * @off Default
 * @desc Recovers full MP when an actor levels up.
 * @default true
 *
 * @param Misc
 * @text Misc
 *
 * @param AntiZoomPictures:eval
 * @text Anti-Zoom Pictures
 * @parent Misc
 * @type boolean
 * @on Anti-Zoom
 * @off Normal
 * @desc If on, prevents pictures from being affected by zoom.
 * @default true
 *
 * @param AutoStretch:str
 * @text Auto-Stretch
 * @parent Misc
 * @type select
 * @option Default
 * @value default
 * @option Stretch
 * @value stretch
 * @option Normal
 * @value normal
 * @desc Automatically stretch the game to fit the size of the client?
 * @default default
 *
 * @param FontShadows:eval
 * @text Font Shadows
 * @parent Misc
 * @type boolean
 * @on Shadows
 * @off Outlines
 * @desc If on, text uses shadows instead of outlines.
 * @default false
 *
 * @param FontSmoothing:eval
 * @text Font Smoothing
 * @parent Misc
 * @type boolean
 * @on Smooth
 * @off None
 * @desc If on, smoothes fonts shown in-game.
 * @default true
 *
 * @param KeyItemProtect:eval
 * @text Key Item Protection
 * @parent Misc
 * @type boolean
 * @on Unsellable
 * @off Sellable
 * @desc If on, prevents Key Items from being able to be sold and from being able to be consumed.
 * @default true
 *
 * @param ModernControls:eval
 * @text Modern Controls
 * @parent Misc
 * @type boolean
 * @on Enable
 * @off Default
 * @desc If on, allows usage of the Home/End buttons as well as other modern configs. Affects other VisuStella plugins.
 * @default true
 *
 * @param NewGameCommonEventAll:num
 * @text NewGame > CommonEvent
 * @parent Misc
 * @type common_event
 * @desc Runs a common event each time a new game during any session is started.
 * @default 0
 *
 * @param NoTileShadows:eval
 * @text No Tile Shadows
 * @parent Misc
 * @type boolean
 * @on Disable Tile Shadows
 * @off Default
 * @desc Removes tile shadows from being displayed in-game.
 * @default false
 *
 * @param PixelateImageRendering:eval
 * @text Pixel Image Rendering
 * @parent Misc
 * @type boolean
 * @on Pixelate
 * @off Smooth
 * @desc If on, pixelates the image rendering (for pixel games).
 * @default false
 *
 * @param RequireFocus:eval
 * @text Require Focus?
 * @parent Misc
 * @type boolean
 * @on Require
 * @off No Requirement
 * @desc Requires the game to be focused? If the game isn't
 * focused, it will pause if it's not the active window.
 * @default true
 *
 * @param SmartEventCollisionPriority:eval
 * @text Smart Event Collision
 * @parent Misc
 * @type boolean
 * @on Only Same Level
 * @off Default
 * @desc Makes events only able to collide with one another if they're 'Same as characters' priority.
 * @default true
 *
 */
/* ----------------------------------------------------------------------------
 * Color Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Color:
 *
 * @param BasicColors
 * @text Basic Colors
 *
 * @param ColorNormal:str
 * @text Normal
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 0
 *
 * @param ColorSystem:str
 * @text System
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 16
 *
 * @param ColorCrisis:str
 * @text Crisis
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 17
 *
 * @param ColorDeath:str
 * @text Death
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 18
 *
 * @param ColorGaugeBack:str
 * @text Gauge Back
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 19
 *
 * @param ColorHPGauge1:str
 * @text HP Gauge 1
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 20
 *
 * @param ColorHPGauge2:str
 * @text HP Gauge 2
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 21
 *
 * @param ColorMPGauge1:str
 * @text MP Gauge 1
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 22
 *
 * @param ColorMPGauge2:str
 * @text MP Gauge 2
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 23
 *
 * @param ColorMPCost:str
 * @text MP Cost
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 23
 *
 * @param ColorPowerUp:str
 * @text Power Up
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 24
 *
 * @param ColorPowerDown:str
 * @text Power Down
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 25
 *
 * @param ColorCTGauge1:str
 * @text CT Gauge 1
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 26
 *
 * @param ColorCTGauge2:str
 * @text CT Gauge 2
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 27
 *
 * @param ColorTPGauge1:str
 * @text TP Gauge 1
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 28
 *
 * @param ColorTPGauge2:str
 * @text TP Gauge 2
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 29
 *
 * @param ColorTPCost:str
 * @text TP Cost
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 29
 *
 * @param ColorPending:str
 * @text Pending Color
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default #2a847d
 *
 * @param ColorExpGauge1:str
 * @text EXP Gauge 1
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 30
 *
 * @param ColorExpGauge2:str
 * @text EXP Gauge 2
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 31
 *
 * @param ColorMaxLvGauge1:str
 * @text MaxLv Gauge 1
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 14
 *
 * @param ColorMaxLvGauge2:str
 * @text MaxLv Gauge 2
 * @parent BasicColors
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 6
 *
 * @param AlphaColors
 * @text Alpha Colors
 *
 * @param OutlineColor:str
 * @text Window Font Outline
 * @parent AlphaColors
 * @desc Colors with a bit of alpha settings.
 * Format rgba(0-255, 0-255, 0-255, 0-1)
 * @default rgba(0, 0, 0, 0.6)
 *
 * @param OutlineColorGauge:str
 * @text Gauge Number Outline
 * @parent AlphaColors
 * @desc Colors with a bit of alpha settings.
 * Format rgba(0-255, 0-255, 0-255, 0-1)
 * @default rgba(0, 0, 0, 1.0)
 *
 * @param DimColor1:str
 * @text Dim Color 1
 * @parent AlphaColors
 * @desc Colors with a bit of alpha settings.
 * Format rgba(0-255, 0-255, 0-255, 0-1)
 * @default rgba(0, 0, 0, 0.6)
 *
 * @param DimColor2:str
 * @text Dim Color 2
 * @parent AlphaColors
 * @desc Colors with a bit of alpha settings.
 * Format rgba(0-255, 0-255, 0-255, 0-1)
 * @default rgba(0, 0, 0, 0)
 *
 * @param ItemBackColor1:str
 * @text Item Back Color 1
 * @parent AlphaColors
 * @desc Colors with a bit of alpha settings.
 * Format rgba(0-255, 0-255, 0-255, 0-1)
 * @default rgba(32, 32, 32, 0.5)
 *
 * @param ItemBackColor2:str
 * @text Item Back Color 2
 * @parent AlphaColors
 * @desc Colors with a bit of alpha settings.
 * Format rgba(0-255, 0-255, 0-255, 0-1)
 * @default rgba(0, 0, 0, 0.5)
 *
 * @param ConditionalColors
 * @text Conditional Colors
 *
 * @param ActorHPColor:func
 * @text JS: Actor HP Color
 * @type note
 * @parent ConditionalColors
 * @desc Code used for determining what HP color to use for actors.
 * @default "// Set the variables used in this function.\nlet actor = arguments[0];\n\n// Check if the actor exists. If not, return normal.\nif (!actor) {\n    return this.normalColor();\n\n// If the actor is dead, return death color.\n} else if (actor.isDead()) {\n    return this.deathColor();\n\n// If the actor is dying, return crisis color.\n} else if (actor.isDying()) {\n    return this.crisisColor();\n\n// Otherwise, return the normal color.\n} else {\n    return this.normalColor();\n}"
 *
 * @param ActorMPColor:func
 * @text JS: Actor MP Color
 * @type note
 * @parent ConditionalColors
 * @desc Code used for determining what MP color to use for actors.
 * @default "// Set the variables used in this function.\nlet actor = arguments[0];\n\n// Check if the actor exists. If not, return normal.\nif (!actor) {\n    return this.normalColor();\n\n// If MP rate is below 25%, return crisis color.\n} else if (actor.mpRate() < 0.25) {\n    return this.crisisColor();\n\n// Otherwise, return the normal color.\n} else {\n    return this.normalColor();\n}"
 *
 * @param ActorTPColor:func
 * @text JS: Actor TP Color
 * @type note
 * @parent ConditionalColors
 * @desc Code used for determining what TP color to use for actors.
 * @default "// Set the variables used in this function.\nlet actor = arguments[0];\n\n// Check if the actor exists. If not, return normal.\nif (!actor) {\n    return this.normalColor();\n\n// If TP rate is below 25%, return crisis color.\n} else if (actor.tpRate() < 0.25) {\n    return this.crisisColor();\n\n// Otherwise, return the normal color.\n} else {\n    return this.normalColor();\n}"
 *
 * @param ParamChange:func
 * @text JS: Parameter Change
 * @type note
 * @parent ConditionalColors
 * @desc Code used for determining whatcolor to use for parameter changes.
 * @default "// Set the variables used in this function.\nlet change = arguments[0];\n\n// If a positive change, use power up color.\nif (change > 0) {\n    return this.powerUpColor();\n\n// If a negative change, use power down color.\n} else if (change < 0) {\n    return this.powerDownColor();\n\n// Otherwise, return the normal color.\n} else {\n    return this.normalColor();\n}"
 *
 * @param DamageColor:func
 * @text JS: Damage Colors
 * @type note
 * @parent ConditionalColors
 * @desc Code used for determining what color to use for damage types.
 * @default "// Set the variables used in this function.\nlet colorType = arguments[0];\n\n// Check the value of the color type\n// and return an appropriate color.\nswitch (colorType) {\n\n    case 0: // HP damage\n        return \"#ffffff\";\n\n    case 1: // HP recover\n        return \"#b9ffb5\";\n\n    case 2: // MP damage\n        return \"#bb88bb\";\n\n    case 3: // MP recover\n        return \"#80b0ff\";\n\n    default:\n        return \"#808080\";\n}"
 */
/* ----------------------------------------------------------------------------
 * Gold Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Gold:
 *
 * @param GoldMax:num
 * @text Gold Max
 * @type num
 * @min 1
 * @desc Maximum amount of Gold the party can hold.
 * Default 99999999
 * @default 99999999
 *
 * @param GoldFontSize:num
 * @text Gold Font Size
 * @type number
 * @min 1
 * @desc Font size used for displaying Gold inside Gold Windows.
 * Default: 26
 * @default 24
 *
 * @param GoldIcon:num
 * @text Gold Icon
 * @desc Icon used to represent Gold.
 * Use 0 for no icon.
 * @default 314
 *
 * @param GoldOverlap:str
 * @text Gold Overlap
 * @desc Text used too much Gold to fit in the window.
 * @default A Lot
 *
 * @param ItemStyle:eval
 * @text Item Style
 * @type boolean
 * @on Enable
 * @off Normal
 * @desc Draw gold in the item style?
 * ie: Icon, Label, Value
 * @default true
 *
 */
/* ----------------------------------------------------------------------------
 * Image Loading Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ImgLoad:
 *
 * @param animations:arraystr
 * @text img/animations/
 * @type file[]
 * @dir img/animations/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param battlebacks1:arraystr
 * @text img/battlebacks1/
 * @type file[]
 * @dir img/battlebacks1/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param battlebacks2:arraystr
 * @text img/battlebacks2/
 * @type file[]
 * @dir img/battlebacks2/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param characters:arraystr
 * @text img/characters/
 * @type file[]
 * @dir img/characters/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param enemies:arraystr
 * @text img/enemies/
 * @type file[]
 * @dir img/enemies/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param faces:arraystr
 * @text img/faces/
 * @type file[]
 * @dir img/faces/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param parallaxes:arraystr
 * @text img/parallaxes/
 * @type file[]
 * @dir img/parallaxes/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param pictures:arraystr
 * @text img/pictures/
 * @type file[]
 * @dir img/pictures/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param sv_actors:arraystr
 * @text img/sv_actors/
 * @type file[]
 * @dir img/sv_actors/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param sv_enemies:arraystr
 * @text img/sv_enemies/
 * @type file[]
 * @dir img/sv_enemies/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param system:arraystr
 * @text img/system/
 * @type file[]
 * @dir img/system/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default ["Balloon","IconSet"]
 *
 * @param tilesets:arraystr
 * @text img/tilesets/
 * @type file[]
 * @dir img/tilesets/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param titles1:arraystr
 * @text img/titles1/
 * @type file[]
 * @dir img/titles1/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 * @param titles2:arraystr
 * @text img/titles2/
 * @type file[]
 * @dir img/titles2/
 * @desc Which files do you wish to load from this directory upon
 * starting up the game?
 * @default []
 *
 */
/* ----------------------------------------------------------------------------
 * Keyboard Input Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~KeyboardInput:
 *
 * @param Controls
 *
 * @param WASD:eval
 * @text WASD Movement
 * @parent Controls
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables or disables WASD movement for your game project.
 * Moves the W page down button to E.
 * @default false
 *
 * @param DashToggleR:eval
 * @text R Button: Dash Toggle
 * @parent Controls
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables or disables R button as an Always Dash option toggle.
 * @default false
 *
 * @param NameInput
 * @text Name Input
 *
 * @param EnableNameInput:eval
 * @text Enable?
 * @parent NameInput
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables keyboard input for name entry.
 * Only tested with English keyboards.
 * @default true
 * 
 * @param DefaultMode:str
 * @text Default Mode
 * @parent NameInput
 * @type select
 * @option Default - Uses Arrow Keys to select letters.
 * @value default
 * @option Keyboard - Uses Keyboard to type in letters.
 * @value keyboard
 * @desc Select default mode when entering the scene.
 * @default keyboard
 *
 * @param QwertyLayout:eval
 * @text QWERTY Layout
 * @parent NameInput
 * @type boolean
 * @on QWERTY Layout
 * @off ABCDEF Layout
 * @desc Uses the QWERTY layout for manual entry.
 * @default true
 *
 * @param NameInputMessage:eval
 * @text Keyboard Message
 * @parent NameInput
 * @type note
 * @desc The message displayed when allowing keyboard entry.
 * You may use text codes here.
 * @default "Type in this character's name.\nPress \\c[5]ENTER\\c[0] when you're done.\n\n-or-\n\nPress \\c[5]arrow keys\\c[0]/\\c[5]TAB\\c[0] to switch\nto manual character entry.\n\nPress \\c[5]ESC\\c[0]/\\c[5]TAB\\c[0] to use to keyboard."
 *
 * @param NumberInput
 * @text Number Input
 *
 * @param EnableNumberInput:eval
 * @text Enable?
 * @parent NumberInput
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables keyboard input for number entry.
 * Only tested with English keyboards.
 * @default true
 *
 * @param ButtonAssist
 * @text Button Assist
 * 
 * @param Keyboard:str
 * @text Switch To Keyboard
 * @parent ButtonAssist
 * @desc Text used to describe the keyboard switch.
 * @default Keyboard
 * 
 * @param Manual:str
 * @text Switch To Manual
 * @parent ButtonAssist
 * @desc Text used to describe the manual entry switch.
 * @default Manual
 *
 */
/* ----------------------------------------------------------------------------
 * Menu Background Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~MenuBg:
 *
 * @param Scene_Menu:struct
 * @text Scene_Menu
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Item:struct
 * @text Scene_Item
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Skill:struct
 * @text Scene_Skill
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Equip:struct
 * @text Scene_Equip
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Status:struct
 * @text Scene_Status
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Options:struct
 * @text Scene_Options
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Save:struct
 * @text Scene_Save
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Load:struct
 * @text Scene_Load
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_GameEnd:struct
 * @text Scene_GameEnd
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"128","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Shop:struct
 * @text Scene_Shop
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Name:struct
 * @text Scene_Name
 * @type struct<BgSettings>
 * @desc The individual background settings for this scene.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Scene_Unlisted:struct
 * @text Scene_Unlisted
 * @type struct<BgSettings>
 * @desc The individual background settings for any scenes that aren't listed here.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 */
/* ----------------------------------------------------------------------------
 * Background Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~BgSettings:
 *
 * @param SnapshotOpacity:num
 * @text Snapshop Opacity
 * @type number
 * @min 0
 * @max 255
 * @desc Snapshot opacity for the scene.
 * @default 192
 *
 * @param BgFilename1:str
 * @text Background 1
 * @type file
 * @dir img/titles1/
 * @desc Filename used for the bottom background image.
 * Leave empty if you don't wish to use one.
 * @default 
 *
 * @param BgFilename2:str
 * @text Background 2
 * @type file
 * @dir img/titles2/
 * @desc Filename used for the upper background image.
 * Leave empty if you don't wish to use one.
 * @default 
 *
 */
/* ----------------------------------------------------------------------------
 * Menu Button Assist Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ButtonAssist:
 *
 * @param General
 *
 * @param Enable:eval
 * @text Enable
 * @parent General
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Enable the Menu Button Assist Window.
 * @default true
 *
 * @param Location:str
 * @text Location
 * @parent General
 * @type select
 * @option Top of Screen
 * @value top
 * @option Bottom of Screen
 * @value bottom
 * @desc Determine the location of the Button Assist Window.
 * Requires Plugin Parameters => UI => Side Buttons ON.
 * @default bottom
 *
 * @param BgType:num
 * @text Background Type
 * @parent General
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
 * @param Text
 *
 * @param TextFmt:str
 * @text Text Format
 * @parent Text
 * @desc Format on how the buttons are displayed.
 * Text codes allowed. %1 - Key, %2 - Text
 * @default %1:%2
 *
 * @param MultiKeyFmt:str
 * @text Multi-Key Format
 * @parent Text
 * @desc Format for actions with multiple keys.
 * Text codes allowed. %1 - Key 1, %2 - Key 2
 * @default %1/%2
 *
 * @param OkText:str
 * @text OK Text
 * @parent Text
 * @desc Default text used to display OK Key Action.
 * Text codes allowed.
 * @default Select
 *
 * @param CancelText:str
 * @text Cancel Text
 * @parent Text
 * @desc Default text used to display Cancel Key Action.
 * Text codes allowed.
 * @default Back
 *
 * @param SwitchActorText:str
 * @text Switch Actor Text
 * @parent Text
 * @desc Default text used to display Switch Actor Action.
 * Text codes allowed.
 * @default Switch Ally
 *
 * @param Keys
 *
 * @param KeyUnlisted:str
 * @text Key: Unlisted Format
 * @parent Keys
 * @desc If a key is not listed below, use this format.
 * Text codes allowed. %1 - Key
 * @default \}❪%1❫\{
 *
 * @param KeyUP:str
 * @text Key: Up
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default ^
 *
 * @param KeyDOWN:str
 * @text Key: Down
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default v
 *
 * @param KeyLEFT:str
 * @text Key: Left
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default <<
 *
 * @param KeyRIGHT:str
 * @text Key: Right
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default >>
 *
 * @param KeySHIFT:str
 * @text Key: Shift
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default \}❪SHIFT❫\{
 *
 * @param KeyTAB:str
 * @text Key: Tab
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default \}❪TAB❫\{
 *
 * @param KeyA:str
 * @text Key: A
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default A
 *
 * @param KeyB:str
 * @text Key: B
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default B
 *
 * @param KeyC:str
 * @text Key: C
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default C
 *
 * @param KeyD:str
 * @text Key: D
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default D
 *
 * @param KeyE:str
 * @text Key: E
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default E
 *
 * @param KeyF:str
 * @text Key: F
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default F
 *
 * @param KeyG:str
 * @text Key: G
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default G
 *
 * @param KeyH:str
 * @text Key: H
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default H
 *
 * @param KeyI:str
 * @text Key: I
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default I
 *
 * @param KeyJ:str
 * @text Key: J
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default J
 *
 * @param KeyK:str
 * @text Key: K
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default K
 *
 * @param KeyL:str
 * @text Key: L
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default L
 *
 * @param KeyM:str
 * @text Key: M
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default M
 *
 * @param KeyN:str
 * @text Key: N
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default N
 *
 * @param KeyO:str
 * @text Key: O
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default O
 *
 * @param KeyP:str
 * @text Key: P
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default P
 *
 * @param KeyQ:str
 * @text Key: Q
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default Q
 *
 * @param KeyR:str
 * @text Key: R
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default R
 *
 * @param KeyS:str
 * @text Key: S
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default S
 *
 * @param KeyT:str
 * @text Key: T
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default T
 *
 * @param KeyU:str
 * @text Key: U
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default U
 *
 * @param KeyV:str
 * @text Key: V
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default V
 *
 * @param KeyW:str
 * @text Key: W
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default W
 *
 * @param KeyX:str
 * @text Key: X
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default X
 *
 * @param KeyY:str
 * @text Key: Y
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default Y
 *
 * @param KeyZ:str
 * @text Key: Z
 * @parent Keys
 * @desc How this key is shown in-game.
 * Text codes allowed.
 * @default Z
 *
 */
/* ----------------------------------------------------------------------------
 * Menu Layout Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~MenuLayout:
 *
 * @param Title:struct
 * @text Scene_Title
 * @parent SceneSettings
 * @type struct<Title>
 * @desc Various options on adjusting the Title Scene.
 * @default {"TitleScreen":"","DocumentTitleFmt:str":"%1: %2 - Version %3","Subtitle:str":"Subtitle","Version:str":"0.00","drawGameTitle:func":"\"const x = 20;\\nconst y = Graphics.height / 4;\\nconst maxWidth = Graphics.width - x * 2;\\nconst text = $dataSystem.gameTitle;\\nconst bitmap = this._gameTitleSprite.bitmap;\\nbitmap.fontFace = $gameSystem.mainFontFace();\\nbitmap.outlineColor = \\\"black\\\";\\nbitmap.outlineWidth = 8;\\nbitmap.fontSize = 72;\\nbitmap.drawText(text, x, y, maxWidth, 48, \\\"center\\\");\"","drawGameSubtitle:func":"\"const x = 20;\\nconst y = Graphics.height / 4 + 72;\\nconst maxWidth = Graphics.width - x * 2;\\nconst text = Scene_Title.subtitle;\\nconst bitmap = this._gameTitleSprite.bitmap;\\nbitmap.fontFace = $gameSystem.mainFontFace();\\nbitmap.outlineColor = \\\"black\\\";\\nbitmap.outlineWidth = 6;\\nbitmap.fontSize = 48;\\nbitmap.drawText(text, x, y, maxWidth, 48, \\\"center\\\");\"","drawGameVersion:func":"\"const bitmap = this._gameTitleSprite.bitmap;\\nconst x = 0;\\nconst y = Graphics.height - 20;\\nconst width = Math.round(Graphics.width / 4);\\nconst height = 20;\\nconst c1 = ColorManager.dimColor1();\\nconst c2 = ColorManager.dimColor2();\\nconst text = 'Version ' + Scene_Title.version;\\nbitmap.gradientFillRect(x, y, width, height, c1, c2);\\nbitmap.fontFace = $gameSystem.mainFontFace();\\nbitmap.outlineColor = \\\"black\\\";\\nbitmap.outlineWidth = 3;\\nbitmap.fontSize = 16;\\nbitmap.drawText(text, x + 4, y, Graphics.width, height, \\\"left\\\");\"","CommandRect:func":"\"const offsetX = $dataSystem.titleCommandWindow.offsetX;\\nconst offsetY = $dataSystem.titleCommandWindow.offsetY;\\nconst rows = this.commandWindowRows();\\nconst width = this.mainCommandWidth();\\nconst height = this.calcWindowHeight(rows, true);\\nconst x = (Graphics.boxWidth - width) / 2 + offsetX;\\nconst y = Graphics.boxHeight - height - 96 + offsetY;\\nreturn new Rectangle(x, y, width, height);\"","ButtonFadeSpeed:num":"4"}
 *
 * @param MainMenu:struct
 * @text Scene_Menu
 * @parent SceneSettings
 * @type struct<MainMenu>
 * @desc Various options on adjusting the Main Menu Scene.
 * @default {"CommandWindow":"","CommandBgType:num":"0","CommandRect:func":"\"const width = this.mainCommandWidth();\\nconst height = this.mainAreaHeight() - this.goldWindowRect().height;\\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\\nconst y = this.mainAreaTop();\\nreturn new Rectangle(x, y, width, height);\"","GoldWindow":"","GoldBgType:num":"0","GoldRect:func":"\"const rows = 1;\\nconst width = this.mainCommandWidth();\\nconst height = this.calcWindowHeight(rows, true);\\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\\nconst y = this.mainAreaBottom() - height;\\nreturn new Rectangle(x, y, width, height);\"","StatusWindow":"","StatusBgType:num":"0","StatusRect:func":"\"const width = Graphics.boxWidth - this.mainCommandWidth();\\nconst height = this.mainAreaHeight();\\nconst x = this.isRightInputMode() ? 0 : Graphics.boxWidth - width;\\nconst y = this.mainAreaTop();\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param ItemMenu:struct
 * @text Scene_Item
 * @parent SceneSettings
 * @type struct<ItemMenu>
 * @desc Various options on adjusting the Item Menu Scene.
 * @default {"HelpWindow":"","HelpBgType:num":"0","HelpRect:func":"\"const x = 0;\\nconst y = this.helpAreaTop();\\nconst width = Graphics.boxWidth;\\nconst height = this.helpAreaHeight();\\nreturn new Rectangle(x, y, width, height);\"","CategoryWindow":"","CategoryBgType:num":"0","CategoryRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop();\\nconst rows = 1;\\nconst width = Graphics.boxWidth;\\nconst height = this.calcWindowHeight(rows, true);\\nreturn new Rectangle(x, y, width, height);\"","ItemWindow":"","ItemBgType:num":"0","ItemRect:func":"\"const x = 0;\\nconst y = this._categoryWindow.y + this._categoryWindow.height;\\nconst width = Graphics.boxWidth;\\nconst height = this.mainAreaBottom() - y;\\nreturn new Rectangle(x, y, width, height);\"","ActorWindow":"","ActorBgType:num":"0","ActorRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop();\\nconst width = Graphics.boxWidth;\\nconst height = this.mainAreaHeight();\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param SkillMenu:struct
 * @text Scene_Skill
 * @parent SceneSettings
 * @type struct<SkillMenu>
 * @desc Various options on adjusting the Skill Menu Scene.
 * @default {"HelpWindow":"","HelpBgType:num":"0","HelpRect:func":"\"const x = 0;\\nconst y = this.helpAreaTop();\\nconst width = Graphics.boxWidth;\\nconst height = this.helpAreaHeight();\\nreturn new Rectangle(x, y, width, height);\"","SkillTypeWindow":"","SkillTypeBgType:num":"0","SkillTypeRect:func":"\"const rows = 3;\\nconst width = this.mainCommandWidth();\\nconst height = this.calcWindowHeight(rows, true);\\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\\nconst y = this.mainAreaTop();\\nreturn new Rectangle(x, y, width, height);\"","StatusWindow":"","StatusBgType:num":"0","StatusRect:func":"\"const width = Graphics.boxWidth - this.mainCommandWidth();\\nconst height = this._skillTypeWindow.height;\\nconst x = this.isRightInputMode() ? 0 : Graphics.boxWidth - width;\\nconst y = this.mainAreaTop();\\nreturn new Rectangle(x, y, width, height);\"","ItemWindow":"","ItemBgType:num":"0","ItemRect:func":"\"const x = 0;\\nconst y = this._statusWindow.y + this._statusWindow.height;\\nconst width = Graphics.boxWidth;\\nconst height = this.mainAreaHeight() - this._statusWindow.height;\\nreturn new Rectangle(x, y, width, height);\"","ActorWindow":"","ActorBgType:num":"0","ActorRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop();\\nconst width = Graphics.boxWidth;\\nconst height = this.mainAreaHeight();\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param EquipMenu:struct
 * @text Scene_Equip
 * @parent SceneSettings
 * @type struct<EquipMenu>
 * @desc Various options on adjusting the Equip Menu Scene.
 * @default {"HelpWindow":"","HelpBgType:num":"0","HelpRect:func":"\"const x = 0;\\nconst y = this.helpAreaTop();\\nconst width = Graphics.boxWidth;\\nconst height = this.helpAreaHeight();\\nreturn new Rectangle(x, y, width, height);\"","StatusWindow":"","StatusBgType:num":"0","StatusRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop();\\nconst width = this.statusWidth();\\nconst height = this.mainAreaHeight();\\nreturn new Rectangle(x, y, width, height);\"","CommandWindow":"","CommandBgType:num":"0","CommandRect:func":"\"const x = this.statusWidth();\\nconst y = this.mainAreaTop();\\nconst rows = 1;\\nconst width = Graphics.boxWidth - this.statusWidth();\\nconst height = this.calcWindowHeight(rows, true);\\nreturn new Rectangle(x, y, width, height);\"","SlotWindow":"","SlotBgType:num":"0","SlotRect:func":"\"const commandWindowRect = this.commandWindowRect();\\nconst x = this.statusWidth();\\nconst y = commandWindowRect.y + commandWindowRect.height;\\nconst width = Graphics.boxWidth - this.statusWidth();\\nconst height = this.mainAreaHeight() - commandWindowRect.height;\\nreturn new Rectangle(x, y, width, height);\"","ItemWindow":"","ItemBgType:num":"0","ItemRect:func":"\"return this.slotWindowRect();\""}
 *
 * @param StatusMenu:struct
 * @text Scene_Status
 * @parent SceneSettings
 * @type struct<StatusMenu>
 * @desc Various options on adjusting the Status Menu Scene.
 * @default {"ProfileWindow":"","ProfileBgType:num":"0","ProfileRect:func":"\"const width = Graphics.boxWidth;\\nconst height = this.profileHeight();\\nconst x = 0;\\nconst y = this.mainAreaBottom() - height;\\nreturn new Rectangle(x, y, width, height);\"","StatusWindow":"","StatusBgType:num":"0","StatusRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop();\\nconst width = Graphics.boxWidth;\\nconst height = this.statusParamsWindowRect().y - y;\\nreturn new Rectangle(x, y, width, height);\"","StatusParamsWindow":"","StatusParamsBgType:num":"0","StatusParamsRect:func":"\"const width = this.statusParamsWidth();\\nconst height = this.statusParamsHeight();\\nconst x = 0;\\nconst y = this.mainAreaBottom() - this.profileHeight() - height;\\nreturn new Rectangle(x, y, width, height);\"","StatusEquipWindow":"","StatusEquipBgType:num":"0","StatusEquipRect:func":"\"const width = Graphics.boxWidth - this.statusParamsWidth();\\nconst height = this.statusParamsHeight();\\nconst x = this.statusParamsWidth();\\nconst y = this.mainAreaBottom() - this.profileHeight() - height;\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param OptionsMenu:struct
 * @text Scene_Options
 * @parent SceneSettings
 * @type struct<OptionsMenu>
 * @desc Various options on adjusting the Options Menu Scene.
 * @default {"OptionsWindow":"","OptionsBgType:num":"0","OptionsRect:func":"\"const n = Math.min(this.maxCommands(), this.maxVisibleCommands());\\nconst width = 400;\\nconst height = this.calcWindowHeight(n, true);\\nconst x = (Graphics.boxWidth - width) / 2;\\nconst y = (Graphics.boxHeight - height) / 2;\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param SaveMenu:struct
 * @text Scene_Save
 * @parent SceneSettings
 * @type struct<SaveMenu>
 * @desc Various options on adjusting the Save Menu Scene.
 * @default {"HelpWindow":"","HelpBgType:num":"0","HelpRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop();\\nconst rows = 1;\\nconst width = Graphics.boxWidth;\\nconst height = this.calcWindowHeight(rows, false);\\nreturn new Rectangle(x, y, width, height);\"","ListWindow":"","ListBgType:num":"0","ListRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop() + this._helpWindow.height;\\nconst width = Graphics.boxWidth;\\nconst height = this.mainAreaHeight() - this._helpWindow.height;\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param LoadMenu:struct
 * @text Scene_Load
 * @parent SceneSettings
 * @type struct<LoadMenu>
 * @desc Various options on adjusting the Load Menu Scene.
 * @default {"HelpWindow":"","HelpBgType:num":"0","HelpRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop();\\nconst rows = 1;\\nconst width = Graphics.boxWidth;\\nconst height = this.calcWindowHeight(rows, false);\\nreturn new Rectangle(x, y, width, height);\"","ListWindow":"","ListBgType:num":"0","ListRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop() + this._helpWindow.height;\\nconst width = Graphics.boxWidth;\\nconst height = this.mainAreaHeight() - this._helpWindow.height;\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param GameEnd:struct
 * @text Scene_GameEnd
 * @parent SceneSettings
 * @type struct<GameEnd>
 * @desc Various options on adjusting the Game End Scene.
 * @default {"CommandList:arraystruct":"[\"{\\\"Symbol:str\\\":\\\"toTitle\\\",\\\"TextStr:str\\\":\\\"Untitled\\\",\\\"TextJS:func\\\":\\\"\\\\\\\"return TextManager.toTitle;\\\\\\\"\\\",\\\"ShowJS:func\\\":\\\"\\\\\\\"return true;\\\\\\\"\\\",\\\"EnableJS:func\\\":\\\"\\\\\\\"return true;\\\\\\\"\\\",\\\"ExtJS:func\\\":\\\"\\\\\\\"return null;\\\\\\\"\\\",\\\"CallHandlerJS:func\\\":\\\"\\\\\\\"SceneManager._scene.commandToTitle();\\\\\\\"\\\"}\",\"{\\\"Symbol:str\\\":\\\"cancel\\\",\\\"TextStr:str\\\":\\\"Untitled\\\",\\\"TextJS:func\\\":\\\"\\\\\\\"return TextManager.cancel;\\\\\\\"\\\",\\\"ShowJS:func\\\":\\\"\\\\\\\"return true;\\\\\\\"\\\",\\\"EnableJS:func\\\":\\\"\\\\\\\"return true;\\\\\\\"\\\",\\\"ExtJS:func\\\":\\\"\\\\\\\"return null;\\\\\\\"\\\",\\\"CallHandlerJS:func\\\":\\\"\\\\\\\"SceneManager._scene.popScene();\\\\\\\"\\\"}\"]","CommandBgType:num":"0","CommandRect:func":"\"const rows = 2;\\nconst width = this.mainCommandWidth();\\nconst height = this.calcWindowHeight(rows, true);\\nconst x = (Graphics.boxWidth - width) / 2;\\nconst y = (Graphics.boxHeight - height) / 2;\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param ShopMenu:struct
 * @text Scene_Shop
 * @parent SceneSettings
 * @type struct<ShopMenu>
 * @desc Various options on adjusting the Shop Menu Scene.
 * @default {"HelpWindow":"","HelpBgType:num":"0","HelpRect:func":"\"const wx = 0;\\nconst wy = this.helpAreaTop();\\nconst ww = Graphics.boxWidth;\\nconst wh = this.helpAreaHeight();\\nreturn new Rectangle(wx, wy, ww, wh);\"","GoldWindow":"","GoldBgType:num":"0","GoldRect:func":"\"const rows = 1;\\nconst width = this.mainCommandWidth();\\nconst height = this.calcWindowHeight(rows, true);\\nconst x = Graphics.boxWidth - width;\\nconst y = this.mainAreaTop();\\nreturn new Rectangle(x, y, width, height);\"","CommandWindow":"","CommandBgType:num":"0","CommandRect:func":"\"const x = 0;\\nconst y = this.mainAreaTop();\\nconst rows = 1;\\nconst width = this._goldWindow.x;\\nconst height = this.calcWindowHeight(rows, true);\\nreturn new Rectangle(x, y, width, height);\"","DummyWindow":"","DummyBgType:num":"0","DummyRect:func":"\"const x = 0;\\nconst y = this._commandWindow.y + this._commandWindow.height;\\nconst width = Graphics.boxWidth;\\nconst height = this.mainAreaHeight() - this._commandWindow.height;\\nreturn new Rectangle(x, y, width, height);\"","NumberWindow":"","NumberBgType:num":"0","NumberRect:func":"\"const x = 0;\\nconst y = this._dummyWindow.y;\\nconst width = Graphics.boxWidth - this.statusWidth();\\nconst height = this._dummyWindow.height;\\nreturn new Rectangle(x, y, width, height);\"","StatusWindow":"","StatusBgType:num":"0","StatusRect:func":"\"const width = this.statusWidth();\\nconst height = this._dummyWindow.height;\\nconst x = Graphics.boxWidth - width;\\nconst y = this._dummyWindow.y;\\nreturn new Rectangle(x, y, width, height);\"","BuyWindow":"","BuyBgType:num":"0","BuyRect:func":"\"const x = 0;\\nconst y = this._dummyWindow.y;\\nconst width = Graphics.boxWidth - this.statusWidth();\\nconst height = this._dummyWindow.height;\\nreturn new Rectangle(x, y, width, height);\"","CategoryWindow":"","CategoryBgType:num":"0","CategoryRect:func":"\"const x = 0;\\nconst y = this._dummyWindow.y;\\nconst rows = 1;\\nconst width = Graphics.boxWidth;\\nconst height = this.calcWindowHeight(rows, true);\\nreturn new Rectangle(x, y, width, height);\"","SellWindow":"","SellBgType:num":"0","SellRect:func":"\"const x = 0;\\nconst y = this._categoryWindow.y + this._categoryWindow.height;\\nconst width = Graphics.boxWidth;\\nconst height =\\n    this.mainAreaHeight() -\\n    this._commandWindow.height -\\n    this._categoryWindow.height;\\nreturn new Rectangle(x, y, width, height);\""}
 *
 * @param NameMenu:struct
 * @text Scene_Name
 * @parent SceneSettings
 * @type struct<NameMenu>
 * @desc Various options on adjusting the Actor Rename Scene.
 * @default {"EditWindow":"","EditBgType:num":"0","EditRect:func":"\"const rows = 9;\\nconst inputWindowHeight = this.calcWindowHeight(rows, true);\\nconst padding = $gameSystem.windowPadding();\\nconst width = 600;\\nconst height = Math.min(ImageManager.faceHeight + padding * 2, this.mainAreaHeight() - inputWindowHeight);\\nconst x = (Graphics.boxWidth - width) / 2;\\nconst y = (this.mainAreaHeight() - (height + inputWindowHeight)) / 2 + this.mainAreaTop();\\nreturn new Rectangle(x, y, width, height);\"","InputWindow":"","InputBgType:num":"0","InputRect:func":"\"const x = this._editWindow.x;\\nconst y = this._editWindow.y + this._editWindow.height;\\nconst rows = 9;\\nconst width = this._editWindow.width;\\nconst height = this.calcWindowHeight(rows, true);\\nreturn new Rectangle(x, y, width, height);\""}
 *
 */
/* ----------------------------------------------------------------------------
 * Main Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~MainMenu:
 *
 * @param CommandWindow
 * @text Command Window
 *
 * @param CommandBgType:num
 * @text Background Type
 * @parent CommandWindow
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
 * @param CommandRect:func
 * @text JS: X, Y, W, H
 * @parent CommandWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const width = this.mainCommandWidth();\nconst height = this.mainAreaHeight() - this.goldWindowRect().height;\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\nconst y = this.mainAreaTop();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param GoldWindow
 * @text Gold Window
 *
 * @param GoldBgType:num
 * @text Background Type
 * @parent GoldWindow
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
 * @param GoldRect:func
 * @text JS: X, Y, W, H
 * @parent GoldWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const rows = 1;\nconst width = this.mainCommandWidth();\nconst height = this.calcWindowHeight(rows, true);\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\nconst y = this.mainAreaBottom() - height;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param StatusWindow
 * @text Status Window
 *
 * @param StatusBgType:num
 * @text Background Type
 * @parent StatusWindow
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
 * @param StatusRect:func
 * @text JS: X, Y, W, H
 * @parent StatusWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const width = Graphics.boxWidth - this.mainCommandWidth();\nconst height = this.mainAreaHeight();\nconst x = this.isRightInputMode() ? 0 : Graphics.boxWidth - width;\nconst y = this.mainAreaTop();\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Item Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ItemMenu:
 *
 * @param HelpWindow
 * @text Help Window
 *
 * @param HelpBgType:num
 * @text Background Type
 * @parent HelpWindow
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
 * @param HelpRect:func
 * @text JS: X, Y, W, H
 * @parent HelpWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.helpAreaTop();\nconst width = Graphics.boxWidth;\nconst height = this.helpAreaHeight();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param CategoryWindow
 * @text Category Window
 *
 * @param CategoryBgType:num
 * @text Background Type
 * @parent CategoryWindow
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
 * @param CategoryRect:func
 * @text JS: X, Y, W, H
 * @parent CategoryWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop();\nconst rows = 1;\nconst width = Graphics.boxWidth;\nconst height = this.calcWindowHeight(rows, true);\nreturn new Rectangle(x, y, width, height);"
 *
 * @param ItemWindow
 * @text Item Window
 *
 * @param ItemBgType:num
 * @text Background Type
 * @parent ItemWindow
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
 * @param ItemRect:func
 * @text JS: X, Y, W, H
 * @parent ItemWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this._categoryWindow.y + this._categoryWindow.height;\nconst width = Graphics.boxWidth;\nconst height = this.mainAreaBottom() - y;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param ActorWindow
 * @text Actor Window
 *
 * @param ActorBgType:num
 * @text Background Type
 * @parent ActorWindow
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
 * @param ActorRect:func
 * @text JS: X, Y, W, H
 * @parent ActorWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop();\nconst width = Graphics.boxWidth;\nconst height = this.mainAreaHeight();\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Skill Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~SkillMenu:
 *
 * @param HelpWindow
 * @text Help Window
 *
 * @param HelpBgType:num
 * @text Background Type
 * @parent HelpWindow
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
 * @param HelpRect:func
 * @text JS: X, Y, W, H
 * @parent HelpWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.helpAreaTop();\nconst width = Graphics.boxWidth;\nconst height = this.helpAreaHeight();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param SkillTypeWindow
 * @text Skill Type Window
 *
 * @param SkillTypeBgType:num
 * @text Background Type
 * @parent SkillTypeWindow
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
 * @param SkillTypeRect:func
 * @text JS: X, Y, W, H
 * @parent SkillTypeWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const rows = 3;\nconst width = this.mainCommandWidth();\nconst height = this.calcWindowHeight(rows, true);\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\nconst y = this.mainAreaTop();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param StatusWindow
 * @text Status Window
 *
 * @param StatusBgType:num
 * @text Background Type
 * @parent StatusWindow
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
 * @param StatusRect:func
 * @text JS: X, Y, W, H
 * @parent StatusWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const width = Graphics.boxWidth - this.mainCommandWidth();\nconst height = this._skillTypeWindow.height;\nconst x = this.isRightInputMode() ? 0 : Graphics.boxWidth - width;\nconst y = this.mainAreaTop();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param ItemWindow
 * @text Item Window
 *
 * @param ItemBgType:num
 * @text Background Type
 * @parent ItemWindow
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
 * @param ItemRect:func
 * @text JS: X, Y, W, H
 * @parent ItemWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this._statusWindow.y + this._statusWindow.height;\nconst width = Graphics.boxWidth;\nconst height = this.mainAreaHeight() - this._statusWindow.height;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param ActorWindow
 * @text Actor Window
 *
 * @param ActorBgType:num
 * @text Background Type
 * @parent ActorWindow
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
 * @param ActorRect:func
 * @text JS: X, Y, W, H
 * @parent ActorWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop();\nconst width = Graphics.boxWidth;\nconst height = this.mainAreaHeight();\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Equip Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~EquipMenu:
 *
 * @param HelpWindow
 * @text Help Window
 *
 * @param HelpBgType:num
 * @text Background Type
 * @parent HelpWindow
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
 * @param HelpRect:func
 * @text JS: X, Y, W, H
 * @parent HelpWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.helpAreaTop();\nconst width = Graphics.boxWidth;\nconst height = this.helpAreaHeight();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param StatusWindow
 * @text Status Window
 *
 * @param StatusBgType:num
 * @text Background Type
 * @parent StatusWindow
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
 * @param StatusRect:func
 * @text JS: X, Y, W, H
 * @parent StatusWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop();\nconst width = this.statusWidth();\nconst height = this.mainAreaHeight();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param CommandWindow
 * @text Command Window
 *
 * @param CommandBgType:num
 * @text Background Type
 * @parent CommandWindow
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
 * @param CommandRect:func
 * @text JS: X, Y, W, H
 * @parent CommandWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = this.statusWidth();\nconst y = this.mainAreaTop();\nconst rows = 1;\nconst width = Graphics.boxWidth - this.statusWidth();\nconst height = this.calcWindowHeight(rows, true);\nreturn new Rectangle(x, y, width, height);"
 *
 * @param SlotWindow
 * @text Slot Window
 *
 * @param SlotBgType:num
 * @text Background Type
 * @parent SlotWindow
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
 * @param SlotRect:func
 * @text JS: X, Y, W, H
 * @parent SlotWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const commandWindowRect = this.commandWindowRect();\nconst x = this.statusWidth();\nconst y = commandWindowRect.y + commandWindowRect.height;\nconst width = Graphics.boxWidth - this.statusWidth();\nconst height = this.mainAreaHeight() - commandWindowRect.height;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param ItemWindow
 * @text Item Window
 *
 * @param ItemBgType:num
 * @text Background Type
 * @parent ItemWindow
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
 * @param ItemRect:func
 * @text JS: X, Y, W, H
 * @parent ItemWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "return this.slotWindowRect();"
 *
 */
/* ----------------------------------------------------------------------------
 * Status Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~StatusMenu:
 *
 * @param ProfileWindow
 * @text Profile Window
 *
 * @param ProfileBgType:num
 * @text Background Type
 * @parent ProfileWindow
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
 * @param ProfileRect:func
 * @text JS: X, Y, W, H
 * @parent ProfileWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const width = Graphics.boxWidth;\nconst height = this.profileHeight();\nconst x = 0;\nconst y = this.mainAreaBottom() - height;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param StatusWindow
 * @text Status Window
 *
 * @param StatusBgType:num
 * @text Background Type
 * @parent StatusWindow
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
 * @param StatusRect:func
 * @text JS: X, Y, W, H
 * @parent StatusWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop();\nconst width = Graphics.boxWidth;\nconst height = this.statusParamsWindowRect().y - y;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param StatusParamsWindow
 * @text Parameters Window
 *
 * @param StatusParamsBgType:num
 * @text Background Type
 * @parent StatusParamsWindow
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
 * @param StatusParamsRect:func
 * @text JS: X, Y, W, H
 * @parent StatusParamsWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const width = this.statusParamsWidth();\nconst height = this.statusParamsHeight();\nconst x = 0;\nconst y = this.mainAreaBottom() - this.profileHeight() - height;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param StatusEquipWindow
 * @text Equipment Window
 *
 * @param StatusEquipBgType:num
 * @text Background Type
 * @parent StatusEquipWindow
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
 * @param StatusEquipRect:func
 * @text JS: X, Y, W, H
 * @parent StatusEquipWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const width = Graphics.boxWidth - this.statusParamsWidth();\nconst height = this.statusParamsHeight();\nconst x = this.statusParamsWidth();\nconst y = this.mainAreaBottom() - this.profileHeight() - height;\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Options Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~OptionsMenu:
 *
 * @param OptionsWindow
 * @text Options Window
 *
 * @param OptionsBgType:num
 * @text Background Type
 * @parent OptionsWindow
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
 * @param OptionsRect:func
 * @text JS: X, Y, W, H
 * @parent OptionsWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const n = Math.min(this.maxCommands(), this.maxVisibleCommands());\nconst width = 400;\nconst height = this.calcWindowHeight(n, true);\nconst x = (Graphics.boxWidth - width) / 2;\nconst y = (Graphics.boxHeight - height) / 2;\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Save Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~SaveMenu:
 *
 * @param HelpWindow
 * @text Help Window
 *
 * @param HelpBgType:num
 * @text Background Type
 * @parent HelpWindow
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
 * @param HelpRect:func
 * @text JS: X, Y, W, H
 * @parent HelpWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop();\nconst rows = 1;\nconst width = Graphics.boxWidth;\nconst height = this.calcWindowHeight(rows, false);\nreturn new Rectangle(x, y, width, height);"
 *
 * @param ListWindow
 * @text List Window
 *
 * @param ListBgType:num
 * @text Background Type
 * @parent ListWindow
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
 * @param ListRect:func
 * @text JS: X, Y, W, H
 * @parent ListWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop() + this._helpWindow.height;\nconst width = Graphics.boxWidth;\nconst height = this.mainAreaHeight() - this._helpWindow.height;\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Load Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~LoadMenu:
 *
 * @param HelpWindow
 * @text Help Window
 *
 * @param HelpBgType:num
 * @text Background Type
 * @parent HelpWindow
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
 * @param HelpRect:func
 * @text JS: X, Y, W, H
 * @parent HelpWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop();\nconst rows = 1;\nconst width = Graphics.boxWidth;\nconst height = this.calcWindowHeight(rows, false);\nreturn new Rectangle(x, y, width, height);"
 *
 * @param ListWindow
 * @text List Window
 *
 * @param ListBgType:num
 * @text Background Type
 * @parent ListWindow
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
 * @param ListRect:func
 * @text JS: X, Y, W, H
 * @parent ListWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop() + this._helpWindow.height;\nconst width = Graphics.boxWidth;\nconst height = this.mainAreaHeight() - this._helpWindow.height;\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Game End Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~GameEnd:
 *
 * @param CommandList:arraystruct
 * @text Command Window List
 * @type struct<Command>[]
 * @desc Window commands used by the Game End screen.
 * Add new commands here.
 * @default ["{\"Symbol:str\":\"toTitle\",\"TextStr:str\":\"Untitled\",\"TextJS:func\":\"\\\"return TextManager.toTitle;\\\"\",\"ShowJS:func\":\"\\\"return true;\\\"\",\"EnableJS:func\":\"\\\"return true;\\\"\",\"ExtJS:func\":\"\\\"return null;\\\"\",\"CallHandlerJS:func\":\"\\\"SceneManager._scene.commandToTitle();\\\"\"}","{\"Symbol:str\":\"cancel\",\"TextStr:str\":\"Untitled\",\"TextJS:func\":\"\\\"return TextManager.cancel;\\\"\",\"ShowJS:func\":\"\\\"return true;\\\"\",\"EnableJS:func\":\"\\\"return true;\\\"\",\"ExtJS:func\":\"\\\"return null;\\\"\",\"CallHandlerJS:func\":\"\\\"SceneManager._scene.popScene();\\\"\"}"]
 *
 * @param CommandBgType:num
 * @text Background Type
 * @parent CommandList:arraystruct
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
 * @param CommandRect:func
 * @text JS: X, Y, W, H
 * @parent CommandList:arraystruct
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const rows = 2;\nconst width = this.mainCommandWidth();\nconst height = this.calcWindowHeight(rows, true);\nconst x = (Graphics.boxWidth - width) / 2;\nconst y = (Graphics.boxHeight - height) / 2;\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Shop Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ShopMenu:
 *
 * @param HelpWindow
 * @text Help Window
 *
 * @param HelpBgType:num
 * @text Background Type
 * @parent HelpWindow
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
 * @param HelpRect:func
 * @text JS: X, Y, W, H
 * @parent HelpWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const wx = 0;\nconst wy = this.helpAreaTop();\nconst ww = Graphics.boxWidth;\nconst wh = this.helpAreaHeight();\nreturn new Rectangle(wx, wy, ww, wh);"
 *
 * @param GoldWindow
 * @text Gold Window
 *
 * @param GoldBgType:num
 * @text Background Type
 * @parent GoldWindow
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
 * @param GoldRect:func
 * @text JS: X, Y, W, H
 * @parent GoldWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const rows = 1;\nconst width = this.mainCommandWidth();\nconst height = this.calcWindowHeight(rows, true);\nconst x = Graphics.boxWidth - width;\nconst y = this.mainAreaTop();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param CommandWindow
 * @text Command Window
 *
 * @param CommandBgType:num
 * @text Background Type
 * @parent CommandWindow
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
 * @param CommandRect:func
 * @text JS: X, Y, W, H
 * @parent CommandWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this.mainAreaTop();\nconst rows = 1;\nconst width = this._goldWindow.x;\nconst height = this.calcWindowHeight(rows, true);\nreturn new Rectangle(x, y, width, height);"
 *
 * @param DummyWindow
 * @text Dummy Window
 *
 * @param DummyBgType:num
 * @text Background Type
 * @parent DummyWindow
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
 * @param DummyRect:func
 * @text JS: X, Y, W, H
 * @parent DummyWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this._commandWindow.y + this._commandWindow.height;\nconst width = Graphics.boxWidth;\nconst height = this.mainAreaHeight() - this._commandWindow.height;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param NumberWindow
 * @text Number Window
 *
 * @param NumberBgType:num
 * @text Background Type
 * @parent NumberWindow
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
 * @param NumberRect:func
 * @text JS: X, Y, W, H
 * @parent NumberWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this._dummyWindow.y;\nconst width = Graphics.boxWidth - this.statusWidth();\nconst height = this._dummyWindow.height;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param StatusWindow
 * @text Status Window
 *
 * @param StatusBgType:num
 * @text Background Type
 * @parent StatusWindow
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
 * @param StatusRect:func
 * @text JS: X, Y, W, H
 * @parent StatusWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const width = this.statusWidth();\nconst height = this._dummyWindow.height;\nconst x = Graphics.boxWidth - width;\nconst y = this._dummyWindow.y;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param BuyWindow
 * @text Buy Window
 *
 * @param BuyBgType:num
 * @text Background Type
 * @parent BuyWindow
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
 * @param BuyRect:func
 * @text JS: X, Y, W, H
 * @parent BuyWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this._dummyWindow.y;\nconst width = Graphics.boxWidth - this.statusWidth();\nconst height = this._dummyWindow.height;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param CategoryWindow
 * @text Category Window
 *
 * @param CategoryBgType:num
 * @text Background Type
 * @parent CategoryWindow
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
 * @param CategoryRect:func
 * @text JS: X, Y, W, H
 * @parent CategoryWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this._dummyWindow.y;\nconst rows = 1;\nconst width = Graphics.boxWidth;\nconst height = this.calcWindowHeight(rows, true);\nreturn new Rectangle(x, y, width, height);"
 *
 * @param SellWindow
 * @text Sell Window
 *
 * @param SellBgType:num
 * @text Background Type
 * @parent SellWindow
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
 * @param SellRect:func
 * @text JS: X, Y, W, H
 * @parent SellWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = 0;\nconst y = this._categoryWindow.y + this._categoryWindow.height;\nconst width = Graphics.boxWidth;\nconst height =\n    this.mainAreaHeight() -\n    this._commandWindow.height -\n    this._categoryWindow.height;\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Name Menu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~NameMenu:
 *
 * @param EditWindow
 * @text Edit Window
 *
 * @param EditBgType:num
 * @text Background Type
 * @parent EditWindow
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
 * @param EditRect:func
 * @text JS: X, Y, W, H
 * @parent EditWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const rows = 9;\nconst inputWindowHeight = this.calcWindowHeight(rows, true);\nconst padding = $gameSystem.windowPadding();\nconst width = 600;\nconst height = Math.min(ImageManager.faceHeight + padding * 2, this.mainAreaHeight() - inputWindowHeight);\nconst x = (Graphics.boxWidth - width) / 2;\nconst y = (this.mainAreaHeight() - (height + inputWindowHeight)) / 2 + this.mainAreaTop();\nreturn new Rectangle(x, y, width, height);"
 *
 * @param InputWindow
 * @text Input Window
 *
 * @param InputBgType:num
 * @text Background Type
 * @parent InputWindow
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
 * @param InputRect:func
 * @text JS: X, Y, W, H
 * @parent InputWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const x = this._editWindow.x;\nconst y = this._editWindow.y + this._editWindow.height;\nconst rows = 9;\nconst width = this._editWindow.width;\nconst height = this.calcWindowHeight(rows, true);\nreturn new Rectangle(x, y, width, height);"
 *
 */
/* ----------------------------------------------------------------------------
 * Title Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Title:
 *
 * @param TitleScreen
 * @text Title Screen
 *
 * @param DocumentTitleFmt:str
 * @text Document Title Format
 * @parent TitleScreen
 * @desc Format to display text in document title.
 * %1 - Main Title, %2 - Subtitle, %3 - Version
 * @default %1: %2 - Version %3
 *
 * @param Subtitle:str
 * @text Subtitle
 * @parent TitleScreen
 * @desc Subtitle to be displayed under the title name.
 * @default Subtitle
 *
 * @param Version:str
 * @text Version
 * @parent TitleScreen
 * @desc Version to be display in the title screen corner.
 * @default 0.00
 *
 * @param drawGameTitle:func
 * @text JS: Draw Title
 * @type note
 * @parent TitleScreen
 * @desc Code used to draw the game title.
 * @default "const x = 20;\nconst y = Graphics.height / 4;\nconst maxWidth = Graphics.width - x * 2;\nconst text = $dataSystem.gameTitle;\nconst bitmap = this._gameTitleSprite.bitmap;\nbitmap.fontFace = $gameSystem.mainFontFace();\nbitmap.outlineColor = \"black\";\nbitmap.outlineWidth = 8;\nbitmap.fontSize = 72;\nbitmap.drawText(text, x, y, maxWidth, 48, \"center\");"
 *
 * @param drawGameSubtitle:func
 * @text JS: Draw Subtitle
 * @type note
 * @parent TitleScreen
 * @desc Code used to draw the game subtitle.
 * @default "const x = 20;\nconst y = Graphics.height / 4 + 72;\nconst maxWidth = Graphics.width - x * 2;\nconst text = Scene_Title.subtitle;\nconst bitmap = this._gameTitleSprite.bitmap;\nbitmap.fontFace = $gameSystem.mainFontFace();\nbitmap.outlineColor = \"black\";\nbitmap.outlineWidth = 6;\nbitmap.fontSize = 48;\nbitmap.drawText(text, x, y, maxWidth, 48, \"center\");"
 *
 * @param drawGameVersion:func
 * @text JS: Draw Version
 * @type note
 * @parent TitleScreen
 * @desc Code used to draw the game version.
 * @default "const bitmap = this._gameTitleSprite.bitmap;\nconst x = 0;\nconst y = Graphics.height - 20;\nconst width = Math.round(Graphics.width / 4);\nconst height = 20;\nconst c1 = ColorManager.dimColor1();\nconst c2 = ColorManager.dimColor2();\nconst text = 'Version ' + Scene_Title.version;\nbitmap.gradientFillRect(x, y, width, height, c1, c2);\nbitmap.fontFace = $gameSystem.mainFontFace();\nbitmap.outlineColor = \"black\";\nbitmap.outlineWidth = 3;\nbitmap.fontSize = 16;\nbitmap.drawText(text, x + 4, y, Graphics.width, height, \"left\");"
 *
 * @param CommandRect:func
 * @text JS: X, Y, W, H
 * @parent TitleScreen
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const offsetX = $dataSystem.titleCommandWindow.offsetX;\nconst offsetY = $dataSystem.titleCommandWindow.offsetY;\nconst rows = this.commandWindowRows();\nconst width = this.mainCommandWidth();\nconst height = this.calcWindowHeight(rows, true);\nconst x = (Graphics.boxWidth - width) / 2 + offsetX;\nconst y = Graphics.boxHeight - height - 96 + offsetY;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param ButtonFadeSpeed:num
 * @text Button Fade Speed
 * @parent TitleScreen
 * @type number
 * @min 1
 * @max 255
 * @desc Speed at which the buttons fade in at (1-255).
 * @default 4
 *
 */
/* ----------------------------------------------------------------------------
 * Parameter Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Param:
 *
 * @param DisplayedParams:arraystr
 * @text Displayed Parameters
 * @type combo[]
 * @option MaxHP
 * @option MaxMP
 * @option ATK
 * @option DEF
 * @option MAT
 * @option MDF
 * @option AGI
 * @option LUK
 * @option HIT
 * @option EVA
 * @option CRI
 * @option CEV
 * @option MEV
 * @option MRF
 * @option CNT
 * @option HRG
 * @option MRG
 * @option TRG
 * @option TGR
 * @option GRD
 * @option REC
 * @option PHA
 * @option MCR
 * @option TCR
 * @option PDR
 * @option MDR
 * @option FDR
 * @option EXR
 * @desc A list of the parameters that will be displayed in-game.
 * @default ["ATK","DEF","MAT","MDF","AGI","LUK"]
 *
 * @param ExtDisplayedParams:arraystr
 * @text Extended Parameters
 * @parent DisplayedParams:arraystr
 * @type combo[]
 * @option MaxHP
 * @option MaxMP
 * @option ATK
 * @option DEF
 * @option MAT
 * @option MDF
 * @option AGI
 * @option LUK
 * @option HIT
 * @option EVA
 * @option CRI
 * @option CEV
 * @option MEV
 * @option MRF
 * @option CNT
 * @option HRG
 * @option MRG
 * @option TRG
 * @option TGR
 * @option GRD
 * @option REC
 * @option PHA
 * @option MCR
 * @option TCR
 * @option PDR
 * @option MDR
 * @option FDR
 * @option EXR
 * @desc The list shown in extended scenes (for other VisuStella plugins).
 * @default ["MaxHP","MaxMP","ATK","DEF","MAT","MDF","AGI","LUK"]
 *
 * @param BasicParameters
 * @text Basic Parameters
 *
 * @param CrisisRate:num
 * @text HP Crisis Rate
 * @parent BasicParameters
 * @desc HP Ratio at which a battler can be considered in crisis mode.
 * @default 0.25
 *
 * @param BasicParameterFormula:func
 * @text JS: Formula
 * @parent BasicParameters
 * @type note
 * @desc Formula used to determine the total value all 8 basic parameters: MaxHP, MaxMP, ATK, DEF, MAT, MDF, AGI, LUK.
 * @default "// Determine the variables used in this calculation.\nlet paramId = arguments[0];\nlet base = this.paramBase(paramId);\nlet plus = this.paramPlus(paramId);\nlet paramRate = this.paramRate(paramId);\nlet buffRate = this.paramBuffRate(paramId);\nlet flatBonus = this.paramFlatBonus(paramId);\n\n// Formula to determine total parameter value.\nlet value = (base + plus) * paramRate * buffRate + flatBonus;\n\n// Determine the limits\nconst maxValue = this.paramMax(paramId);\nconst minValue = this.paramMin(paramId);\n\n// Final value\nreturn Math.round(value.clamp(minValue, maxValue));"
 *
 * @param BasicParamCaps
 * @text Parameter Caps
 * @parent BasicParameters
 *
 * @param BasicActorParamCaps
 * @text Actors
 * @parent BasicParamCaps
 *
 * @param BasicActorParamMax0:str
 * @text MaxHP Cap
 * @parent BasicActorParamCaps
 * @desc Formula used to determine MaxHP cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 9999
 *
 * @param BasicActorParamMax1:str
 * @text MaxMP Cap
 * @parent BasicActorParamCaps
 * @desc Formula used to determine MaxMP cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 9999
 *
 * @param BasicActorParamMax2:str
 * @text ATK Cap
 * @parent BasicActorParamCaps
 * @desc Formula used to determine ATK cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicActorParamMax3:str
 * @text DEF Cap
 * @parent BasicActorParamCaps
 * @desc Formula used to determine DEF cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicActorParamMax4:str
 * @text MAT Cap
 * @parent BasicActorParamCaps
 * @desc Formula used to determine MAT cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicActorParamMax5:str
 * @text MDF Cap
 * @parent BasicActorParamCaps
 * @desc Formula used to determine MDF cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicActorParamMax6:str
 * @text AGI Cap
 * @parent BasicActorParamCaps
 * @desc Formula used to determine AGI cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicActorParamMax7:str
 * @text LUK Cap
 * @parent BasicActorParamCaps
 * @desc Formula used to determine LUK cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicEnemyParamCaps
 * @text Enemies
 * @parent BasicParamCaps
 *
 * @param BasicEnemyParamMax0:str
 * @text MaxHP Cap
 * @parent BasicEnemyParamCaps
 * @desc Formula used to determine MaxHP cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999999
 *
 * @param BasicEnemyParamMax1:str
 * @text MaxMP Cap
 * @parent BasicEnemyParamCaps
 * @desc Formula used to determine MaxMP cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 9999
 *
 * @param BasicEnemyParamMax2:str
 * @text ATK Cap
 * @parent BasicEnemyParamCaps
 * @desc Formula used to determine ATK cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicEnemyParamMax3:str
 * @text DEF Cap
 * @parent BasicEnemyParamCaps
 * @desc Formula used to determine DEF cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicEnemyParamMax4:str
 * @text MAT Cap
 * @parent BasicEnemyParamCaps
 * @desc Formula used to determine MAT cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicEnemyParamMax5:str
 * @text MDF Cap
 * @parent BasicEnemyParamCaps
 * @desc Formula used to determine MDF cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicEnemyParamMax6:str
 * @text AGI Cap
 * @parent BasicEnemyParamCaps
 * @desc Formula used to determine AGI cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param BasicEnemyParamMax7:str
 * @text LUK Cap
 * @parent BasicEnemyParamCaps
 * @desc Formula used to determine LUK cap.
 * Use 0 if you don't want a cap for this parameter.
 * @default 999
 *
 * @param XParameters
 * @text X Parameters
 *
 * @param XParameterFormula:func
 * @text JS: Formula
 * @parent XParameters
 * @type note
 * @desc Formula used to determine the total value all 10 X parameters: HIT, EVA, CRI, CEV, MEV, MRF, CNT, HRG, MRG, TRG.
 * @default "// Determine the variables used in this calculation.\nlet xparamId = arguments[0];\nlet base = this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId);\nlet plus = this.xparamPlus(xparamId);\nlet paramRate = this.xparamRate(xparamId);\nlet flatBonus = this.xparamFlatBonus(xparamId);\n\n// Formula to determine total parameter value.\nlet value = (base + plus) * paramRate + flatBonus;\n\n// Final value\nreturn value;"
 *
 * @param XParamVocab
 * @text Vocabulary
 * @parent XParameters
 *
 * @param XParamVocab0:str
 * @text HIT
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default Hit
 *
 * @param XParamVocab1:str
 * @text EVA
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default Evasion
 *
 * @param XParamVocab2:str
 * @text CRI
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default Crit.Rate
 *
 * @param XParamVocab3:str
 * @text CEV
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default Crit.Evade
 *
 * @param XParamVocab4:str
 * @text MEV
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default Magic Evade
 *
 * @param XParamVocab5:str
 * @text MRF
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default Magic Reflect
 *
 * @param XParamVocab6:str
 * @text CNT
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default Counter
 *
 * @param XParamVocab7:str
 * @text HRG
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default HP Regen
 *
 * @param XParamVocab8:str
 * @text MRG
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default MP Regen
 *
 * @param XParamVocab9:str
 * @text TRG
 * @parent XParamVocab
 * @desc The in-game vocabulary used for this X Parameter.
 * @default TP Regen
 *
 * @param SParameters
 * @text S Parameters
 *
 * @param SParameterFormula:func
 * @text JS: Formula
 * @parent SParameters
 * @type note
 * @desc Formula used to determine the total value all 10 S parameters: TGR, GRD, REC, PHA, MCR, TCR, PDR, MDR, FDR, EXR.
 * @default "// Determine the variables used in this calculation.\nlet sparamId = arguments[0];\nlet base = this.traitsPi(Game_BattlerBase.TRAIT_SPARAM, sparamId);\nlet plus = this.sparamPlus(sparamId);\nlet paramRate = this.sparamRate(sparamId);\nlet flatBonus = this.sparamFlatBonus(sparamId);\n\n// Formula to determine total parameter value.\nlet value = (base + plus) * paramRate + flatBonus;\n\n// Final value\nreturn value;"
 *
 * @param SParamVocab
 * @text Vocabulary
 * @parent SParameters
 *
 * @param SParamVocab0:str
 * @text TGR
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default Aggro
 *
 * @param SParamVocab1:str
 * @text GRD
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default Guard
 *
 * @param SParamVocab2:str
 * @text REC
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default Recovery
 *
 * @param SParamVocab3:str
 * @text PHA
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default Item Effect
 *
 * @param SParamVocab4:str
 * @text MCR
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default MP Cost
 *
 * @param SParamVocab5:str
 * @text TCR
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default TP Charge
 *
 * @param SParamVocab6:str
 * @text PDR
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default Physical DMG
 *
 * @param SParamVocab7:str
 * @text MDR
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default Magical DMG
 *
 * @param SParamVocab8:str
 * @text FDR
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default Floor DMG
 *
 * @param SParamVocab9:str
 * @text EXR
 * @parent SParamVocab
 * @desc The in-game vocabulary used for this S Parameter.
 * @default EXP Gain
 *
 * @param Icons
 * @text Icons
 *
 * @param DrawIcons:eval
 * @text Draw Icons?
 * @parent Icons
 * @type boolean
 * @on Draw
 * @off Don't Draw
 * @desc Draw icons next to parameter names?
 * @default true
 *
 * @param IconParam0:str
 * @text MaxHP
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 84
 *
 * @param IconParam1:str
 * @text MaxMP
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 165
 *
 * @param IconParam2:str
 * @text ATK
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 76
 *
 * @param IconParam3:str
 * @text DEF
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 81
 *
 * @param IconParam4:str
 * @text MAT
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 101
 *
 * @param IconParam5:str
 * @text MDF
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 133
 *
 * @param IconParam6:str
 * @text AGI
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 140
 *
 * @param IconParam7:str
 * @text LUK
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 87
 *
 * @param IconXParam0:str
 * @text HIT
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 102
 *
 * @param IconXParam1:str
 * @text EVA
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 82
 *
 * @param IconXParam2:str
 * @text CRI
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 78
 *
 * @param IconXParam3:str
 * @text CEV
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 82
 *
 * @param IconXParam4:str
 * @text MEV
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 171
 *
 * @param IconXParam5:str
 * @text MRF
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 222
 *
 * @param IconXParam6:str
 * @text CNT
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 77
 *
 * @param IconXParam7:str
 * @text HRG
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 72
 *
 * @param IconXParam8:str
 * @text MRG
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 72
 *
 * @param IconXParam9:str
 * @text TRG
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 72
 *
 * @param IconSParam0:str
 * @text TGR
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 5
 *
 * @param IconSParam1:str
 * @text GRD
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 128
 *
 * @param IconSParam2:str
 * @text REC
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 72
 *
 * @param IconSParam3:str
 * @text PHA
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 176
 *
 * @param IconSParam4:str
 * @text MCR
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 165
 *
 * @param IconSParam5:str
 * @text TCR
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 164
 *
 * @param IconSParam6:str
 * @text PDR
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 76
 *
 * @param IconSParam7:str
 * @text MDR
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 79
 *
 * @param IconSParam8:str
 * @text FDR
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 141
 *
 * @param IconSParam9:str
 * @text EXR
 * @parent Icons
 * @desc Icon used for this parameter.
 * @default 73
 *
 */
/* ----------------------------------------------------------------------------
 * Commands Struct
 * ----------------------------------------------------------------------------
 */
/*~struct~Command:
 *
 * @param Symbol:str
 * @text Symbol
 * @desc The symbol used for this command.
 * @default Symbol
 *
 * @param TextStr:str
 * @text STR: Text
 * @desc Displayed text used for this title command.
 * If this has a value, ignore the JS: Text version.
 * @default Untitled
 *
 * @param TextJS:func
 * @text JS: Text
 * @type note
 * @desc JavaScript code used to determine string used for the displayed name.
 * @default "return 'Text';"
 *
 * @param ShowJS:func
 * @text JS: Show
 * @type note
 * @desc JavaScript code used to determine if the item is shown or not.
 * @default "return true;"
 *
 * @param EnableJS:func
 * @text JS: Enable
 * @type note
 * @desc JavaScript code used to determine if the item is enabled or not.
 * @default "return true;"
 *
 * @param ExtJS:func
 * @text JS: Ext
 * @type note
 * @desc JavaScript code used to determine any ext data that should be added.
 * @default "return null;"
 *
 * @param CallHandlerJS:func
 * @text JS: Run Code
 * @type note
 * @desc JavaScript code that runs once this command is selected.
 * @default ""
 *
 */
/* ----------------------------------------------------------------------------
 * Title Picture Buttons
 * ----------------------------------------------------------------------------
 */
/*~struct~TitlePictureButton:
 *
 * @param PictureFilename:str
 * @text Picture's Filename
 * @type file
 * @dir img/pictures/
 * @desc Filename used for the picture.
 * @default 
 *
 * @param ButtonURL:str
 * @text Button URL
 * @desc URL for the button to go to upon being clicked.
 * @default https://www.google.com/
 *
 * @param PositionJS:func
 * @text JS: Position
 * @type note
 * @desc JavaScript code that helps determine the button's Position.
 * @default "this.x = Graphics.width - this.bitmap.width - 20;\nthis.y = Graphics.height - this.bitmap.height - 20;"
 *
 * @param OnLoadJS:func
 * @text JS: On Load
 * @type note
 * @desc JavaScript code that runs once this button bitmap is loaded.
 * @default "this.opacity = 0;\nthis.visible = true;"
 *
 * @param CallHandlerJS:func
 * @text JS: Run Code
 * @type note
 * @desc JavaScript code that runs once this button is pressed.
 * @default "const url = this._data.ButtonURL;\nVisuMZ.openURL(url);"
 *
 */
/* ----------------------------------------------------------------------------
 * UI Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~UI:
 *
 * @param UIArea
 * @text UI Area
 *
 * @param FadeSpeed:num
 * @text Fade Speed
 * @parent UIArea
 * @desc Default fade speed for transitions.
 * @default 24
 *
 * @param BoxMargin:num
 * @text Box Margin
 * @parent UIArea
 * @type number
 * @min 0
 * @desc Set the margin in pixels for the screen borders.
 * Default: 4
 * @default 4
 *
 * @param CommandWidth:num
 * @text Command Window Width
 * @parent UIArea
 * @type number
 * @min 1
 * @desc Sets the width for standard Command Windows.
 * Default: 240
 * @default 240
 *
 * @param BottomHelp:eval
 * @text Bottom Help Window
 * @parent UIArea
 * @type boolean
 * @on Bottom
 * @off Top
 * @desc Put the Help Window at the bottom of the screen?
 * @default false
 *
 * @param RightMenus:eval
 * @text Right Aligned Menus
 * @parent UIArea
 * @type boolean
 * @on Right
 * @off Left
 * @desc Put most command windows to the right side of the screen.
 * @default true
 *
 * @param ShowButtons:eval
 * @text Show Buttons
 * @parent UIArea
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show clickable buttons in your game?
 * This will affect all buttons.
 * @default true
 *
 * @param cancelShowButton:eval
 * @text Show Cancel Button
 * @parent ShowButtons:eval
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show cancel button?
 * If 'Show Buttons' is false, this will be hidden.
 * @default true
 *
 * @param menuShowButton:eval
 * @text Show Menu Button
 * @parent ShowButtons:eval
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show main menu button from the map scene?
 * If 'Show Buttons' is false, this will be hidden.
 * @default true
 *
 * @param pagedownShowButton:eval
 * @text Show Page Up/Down
 * @parent ShowButtons:eval
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show page up/down buttons?
 * If 'Show Buttons' is false, this will be hidden.
 * @default true
 *
 * @param numberShowButton:eval
 * @text Show Number Buttons
 * @parent ShowButtons:eval
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show number adjustment buttons?
 * If 'Show Buttons' is false, this will be hidden.
 * @default true
 *
 * @param ButtonHeight:num
 * @text Button Area Height
 * @parent UIArea
 * @type number
 * @min 1
 * @desc Sets the height for the button area.
 * Default: 52
 * @default 52
 *
 * @param BottomButtons:eval
 * @text Bottom Buttons
 * @parent UIArea
 * @type boolean
 * @on Bottom
 * @off Top
 * @desc Put the buttons at the bottom of the screen?
 * @default false
 *
 * @param SideButtons:eval
 * @text Side Buttons
 * @parent UIArea
 * @type boolean
 * @on Side
 * @off Normal
 * @desc Push buttons to the side of the UI if there is room.
 * @default true
 *
 * @param LargerResolution
 * @text Larger Resolution
 *
 * @param RepositionActors:eval
 * @text Reposition Actors
 * @parent LargerResolution
 * @type boolean
 * @on Reposition
 * @off Keep As Is
 * @desc Update the position of actors in battle if the screen resolution has changed. Ignore if using Battle Core.
 * @default true
 *
 * @param RepositionEnemies:eval
 * @text Reposition Enemies
 * @parent LargerResolution
 * @type boolean
 * @on Reposition
 * @off Keep As Is
 * @desc Update the position of enemies in battle if the screen resolution has changed.
 * @default true
 *
 * @param MenuObjects
 * @text Menu Objects
 *
 * @param LvExpGauge:eval
 * @text Level -> EXP Gauge
 * @parent MenuObjects
 * @type boolean
 * @on Draw Gauge
 * @off Keep As Is
 * @desc Draw an EXP Gauge under the drawn level.
 * @default true
 *
 * @param ParamArrow:str
 * @text Parameter Arrow
 * @parent MenuObjects
 * @desc The arrow used to show changes in the parameter values.
 * @default →
 *
 * @param TextCodeSupport
 * @text Text Code Support
 *
 * @param TextCodeClassNames:eval
 * @text Class Names
 * @parent TextCodeSupport
 * @type boolean
 * @on Suport Text Codes
 * @off Normal Text
 * @desc Make class names support text codes?
 * @default true
 *
 * @param TextCodeNicknames:eval
 * @text Nicknames
 * @parent TextCodeSupport
 * @type boolean
 * @on Suport Text Codes
 * @off Normal Text
 * @desc Make nicknames support text codes?
 * @default true
 *
 */
/* ----------------------------------------------------------------------------
 * Window Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Window:
 *
 * @param WindowDefaults
 * @text Defaults
 *
 * @param EnableMasking:eval
 * @text Enable Masking
 * @parent WindowDefaults
 * @type boolean
 * @on Masking On
 * @off Masking Off
 * @desc Enable window masking (windows hide other windows behind 
 * them)? WARNING: Turning it on can obscure data.
 * @default false
 *
 * @param LineHeight:num
 * @text Line Height
 * @parent WindowDefaults
 * @desc Default line height used for standard windows.
 * Default: 36
 * @default 36
 *
 * @param ItemPadding:num
 * @text Item Padding
 * @parent WindowDefaults
 * @desc Default line padding used for standard windows.
 * Default: 8
 * @default 8
 *
 * @param BackOpacity:num
 * @text Back Opacity
 * @parent WindowDefaults
 * @desc Default back opacity used for standard windows.
 * Default: 192
 * @default 192
 *
 * @param TranslucentOpacity:num
 * @text Translucent Opacity
 * @parent WindowDefaults
 * @desc Default translucent opacity used for standard windows.
 * Default: 160
 * @default 160
 *
 * @param OpenSpeed:num
 * @text Window Opening Speed
 * @parent WindowDefaults
 * @desc Default open speed used for standard windows.
 * Default: 32 (Use a number between 0-255)
 * @default 32
 * @default 24
 *
 * @param ColSpacing:num
 * @text Column Spacing
 * @parent WindowDefaults
 * @desc Default column spacing for selectable windows.
 * Default: 8
 * @default 8
 *
 * @param RowSpacing:num
 * @text Row Spacing
 * @parent WindowDefaults
 * @desc Default row spacing for selectable windows.
 * Default: 4
 * @default 4
 * 
 * @param SelectableItems
 * @text Selectable Items
 *
 * @param ShowItemBackground:eval
 * @text Show Background?
 * @parent SelectableItems
 * @type boolean
 * @on Show Backgrounds
 * @off No backgrounds.
 * @desc Selectable menu items have dark boxes behind them. Show them?
 * @default true
 *
 * @param ItemHeight:num
 * @text Item Height Padding
 * @parent SelectableItems
 * @desc Default padding for selectable items.
 * Default: 8
 * @default 8
 *
 * @param DrawItemBackgroundJS:func
 * @text JS: Draw Background
 * @parent SelectableItems
 * @type note
 * @desc Code used to draw the background rectangle behind clickable menu objects
 * @default "const rect = arguments[0];\nconst c1 = ColorManager.itemBackColor1();\nconst c2 = ColorManager.itemBackColor2();\nconst x = rect.x;\nconst y = rect.y;\nconst w = rect.width;\nconst h = rect.height;\nthis.contentsBack.gradientFillRect(x, y, w, h, c1, c2, true);\nthis.contentsBack.strokeRect(x, y, w, h, c1);"
 */
/* ----------------------------------------------------------------------------
 * JS Quick Function Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~jsQuickFunc:
 *
 * @param FunctionName:str
 * @text Function Name
 * @desc The function's name in the global namespace.
 * Will not overwrite functions/variables of the same name.
 * @default Untitled
 *
 * @param CodeJS:json
 * @text JS: Code
 * @type note
 * @desc Run this code when using the function.
 * @default "// Insert this as a function anywhere you can input code\n// such as Script Calls or Conditional Branch Scripts.\n\n// Process Code\n"
 *
 */
/* ----------------------------------------------------------------------------
 * Screen Shake Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ScreenShake:
 *
 * @param DefaultStyle:str
 * @text Default Style
 * @type select
 * @option Original
 * @value original
 * @option Random
 * @value random
 * @option Horizontal
 * @value horizontal
 * @option Vertical
 * @value vertical
 * @desc The default style used for screen shakes.
 * @default random
 *
 * @param originalJS:func
 * @text JS: Original Style
 * @type note
 * @desc This code gives you control over screen shake for this
 * screen shake style.
 * @default "// Calculation\nthis.x += Math.round($gameScreen.shake());"
 *
 * @param randomJS:func
 * @text JS: Random Style
 * @type note
 * @desc This code gives you control over screen shake for this
 * screen shake style.
 * @default "// Calculation\n// Original Formula by Aries of Sheratan\nconst power = $gameScreen._shakePower * 0.75;\nconst speed = $gameScreen._shakeSpeed * 0.60;\nconst duration = $gameScreen._shakeDuration;\nthis.x += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);\nthis.y += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);"
 *
 * @param horzJS:func
 * @text JS: Horizontal Style
 * @type note
 * @desc This code gives you control over screen shake for this
 * screen shake style.
 * @default "// Calculation\n// Original Formula by Aries of Sheratan\nconst power = $gameScreen._shakePower * 0.75;\nconst speed = $gameScreen._shakeSpeed * 0.60;\nconst duration = $gameScreen._shakeDuration;\nthis.x += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);"
 *
 * @param vertJS:func
 * @text JS: Vertical Style
 * @type note
 * @desc This code gives you control over screen shake for this
 * screen shake style.
 * @default "// Calculation\n// Original Formula by Aries of Sheratan\nconst power = $gameScreen._shakePower * 0.75;\nconst speed = $gameScreen._shakeSpeed * 0.60;\nconst duration = $gameScreen._shakeDuration;\nthis.y += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);"
 *
 */
/* ----------------------------------------------------------------------------
 * Custom Parameter Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~CustomParam:
 *
 * @param ParamName:str
 * @text Parameter Name
 * @desc What's the parameter's name?
 * Used for VisuStella MZ menus.
 * @default Untitled
 *
 * @param Abbreviation:str
 * @text Abbreviation
 * @parent ParamName:str
 * @desc What abbreviation do you want to use for the parameter?
 * Do not use special characters. Avoid numbers if possible.
 * @default unt
 *
 * @param Icon:num
 * @text Icon
 * @parent ParamName:str
 * @desc What icon do you want to use to represent this parameter?
 * Used for VisuStella MZ menus.
 * @default 160
 *
 * @param Type:str
 * @text Type
 * @parent ParamName:str
 * @type select
 * @option Integer (Whole Numbers Only)
 * @value integer
 * @option Float (Decimals are Allowed)
 * @value float
 * @desc What kind of number value will be returned with this parameter?
 * @default integer
 *
 * @param ValueJS:json
 * @text JS: Value
 * @type note
 * @desc Run this code when this parameter is to be returned.
 * @default "// Declare Constants\nconst user = this;\n\n// Calculations\nreturn 1;"
 *
 */
//=============================================================================

const _0x4d2c=['NameInputMessage','Bitmap_drawCircle','_listWindow','toString','setAttack','maxLvGaugeColor1','PictureEraseRange','resetTextColor','toUpperCase','FTB','XParamVocab8','_skillTypeWindow','([\x5c+\x5c-]\x5cd+)([%％])>','show','layoutSettings','iconHeight','drawCharacter','helpAreaTop','showFauxAnimations','itemHeight','updatePositionCoreEngineShakeVert','playTestF6','stencilFunc','_shakeDuration','DrawItemBackgroundJS','QUOTE','NameMenu','Window','get','([\x5c+\x5c-]\x5cd+\x5c.?\x5cd+)>','sparamPlusJS','VisuMZ_2_BattleSystemCTB','drawTextEx','Rate2','forceOutOfPlaytest','WIN_OEM_PA2','hpColor','switchModes','_slotWindow','randomJS','CategoryBgType','shift','isKeyItem','DummyRect','Scene_Name_create','F16','scaleMode','helpAreaHeight','retrieveFauxAnimation','levelUpRecovery','buttonAssistKey2','terminate','Sprite_Battler_startMove','faceHeight','context','tpGaugeColor2','darwin','processFauxAnimationRequests','ParseClassNotetags','isSpecialCode','update','Game_Party_consumeItem','NUMPAD8','backgroundBitmap','anchorCoreEasing','ARRAYSTR','updateBackOpacity','_backSprite2','loadTitle2','worldTransform','Window_Base_initialize','moveMenuButtonSideButtonLayout','call','_helpWindow','6133zjnIev','ATTN','movePageButtonSideButtonLayout','original','ListRect','AMPERSAND','updateScene','xparamPlus','Window_NameInput_initialize','NewGameCommonEventAll','Untitled','return\x200','itemHitImprovedAccuracy','enableDigitGroupingEx','_actor','CLEAR','Bitmap_drawText','text%1','disable','currentValue','nw.gui','helpWindowRect','isFullDocumentTitle','makeInputButtonString','KeyTAB','INQUART','NewGameCommonEvent','cancel','floor','buttonAssistKey3','isItemStyle','_coreEngineShakeStyle','LevelUpFullHp','isTriggered','FontSmoothing','GoldIcon','Game_Interpreter_command122','AccuracyBoost','F7key','_backgroundSprite','XParamVocab4','_stored_mpGaugeColor2','ShopMenu','Game_Picture_move','dimColor1','buttonAssistOffset3','parallaxes','consumeItem','itemHit','drawNewParam','setHome','INOUTCUBIC','openURL','targetOpacity','ColorExpGauge2','EnableNameInput','_backSprite1','ParseTilesetNotetags','removeAllFauxAnimations','WIN_OEM_FINISH','PRINT','_cacheScaleX','NUMPAD9','_stored_normalColor','checkCacheKey','textColor','setAction','IconXParam0','yScrollLinkedOffset','initialize','MINUS','setBackgroundOpacity','_customModified','ButtonAssist','itemPadding','ENTER_SPECIAL','getButtonAssistLocation','onMoveEnd','vertical','isNextScene','ColorTPCost','Game_BattlerBase_initMembers','command357','tab','areTileShadowsHidden','_stored_maxLvGaugeColor1','skillTypeWindowRect','processKeyboardDigitChange','_stored_tpCostColor','pagedownShowButton','NUMPAD5','_goldWindow','PERIOD','endAnimation','IconXParam2','DELETE','eva','IconSParam8','clone','cursorPageup','ctGaugeColor1','isOpenAndActive','updateDashToggle','OptionsMenu','_digitGrouping','MAX_SAFE_INTEGER','gaugeBackColor','crisisColor','titles1','match','HASH','INSINE','GetParamIcon','_pollGamepads','isMaskingEnabled','buttonAssistOk','EQUALS','_screenY','Bitmap_measureTextWidth','Spriteset_Base_initialize','drawText','TAB','valueOutlineColor','isActor','originalJS','HANJA','systemColor','ColorHPGauge1','repositionEnemiesByResolution','499172NdNhar','TextJS','STENCIL_TEST','drawGameTitle','mainAreaTopSideButtonLayout','Sprite_Picture_updateOrigin','TCR','isItem','SPACE','INOUTQUART','TextFmt','BgFilename2','_tempActor','Scene_MenuBase_helpAreaTop','bitmapHeight','Game_Interpreter_PluginCommand','padding','popScene','Location','DashToggleR','blockWidth','CustomParamAbb','Scene_Boot_startNormalGame','Bitmap_resize','round','easingType','targetObjects','_lastPluginCommandInterpreter','visible','forceStencil','currencyUnit','updateLastTarget','ColorGaugeBack','_offsetY','drawActorNickname','moveRelativeToResolutionChange','F13','isEnabled','onButtonImageLoad','WIN_OEM_PA1','requestMotion','isUseModernControls','faces','Graphics_defaultStretchMode','_commandWindow','allowShiftScrolling','OS_KEY','DocumentTitleFmt','ColorMPCost','successRate','tpColor','Param','VisuMZ_2_BattleSystemFTB','AGI','IconSParam0','horzJS','Linear','currentLevelExp','adjustPictureAntiZoom','buttonAssistCancel','_itemWindow','F19','addChild','mirror','itemWindowRect','ColorMaxLvGauge2','contentsOpacity','ctrlKey','DamageColor','setMoveEasingType','smallParamFontSize','_menuButton','DefaultMode','onEscapeSuccess','destroy','Bitmap_fillRect','isGameActive','expGaugeColor2','XParamVocab2','updateMove','HIT','Gold','Graphics','ShowDevTools','INOUTCIRC','processMoveCommand','MEV','applyEasing','mhp','getLastPluginCommandInterpreter','index','outlineColor','reduce','<%1\x20%2:[\x20]','setActorHome','IconSParam7','loadPicture','Sprite_Actor_setActorHome','drawFace','Input_setupEventHandlers','xparamRate2','LoadError','canUse','traitObjects','_playTestFastMode','ItemBackColor1','PDR','Bitmap_strokeRect','makeDeepCopy','img/%1/','mainAreaHeight','IconParam2','tileWidth','OUTELASTIC','getBattleSystem','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','updatePositionCoreEngine','isPlaytest','WIN_OEM_COPY','length','processDigitChange','LineHeight','getColorDataFromPluginParameters','Window_Selectable_cursorUp','isRepeated','strokeRect','ProfileBgType','select','drawItem','lineHeight','processCursorMove','SceneManager_isGameActive','slotWindowRect','INOUTQUAD','menu','MULTIPLY','Bitmap_drawTextOutline','DummyBgType','gainGold','Sprite_AnimationMV_processTimingData','F11','ColorSystem','INCIRC','ItemBackColor2','CrisisRate','rowSpacing','OUTQUAD','Window_StatusBase_drawActorLevel','GroupDigits','ExtJS','OutlineColorDmg','_digitGroupingEx','ALWAYS','processTouch','contents','setAnchor','CommandBgType','createPageButtons','title','INOUTEXPO','_statusParamsWindow','sparamRate1','_storedStack','ACCEPT','ParamArrow','Game_Interpreter_command111','(\x5cd+)([%％])>','buttonAssistWindowSideRect','_CoreEngineSettings','sparamRate','Spriteset_Base_update','XParamVocab6','_inputWindow','Scene_Map_initialize','setupValueFont','meVolume','wholeDuration','KeyItemProtect','cursorLeft','CreateBattleSystemID','WIN_OEM_BACKTAB','CustomParamIcons','MRG','buttonAssistWindowRect','expGaugeColor1','StatusBgType','exec','buttonAssistText%1','encounterStep','_isWindow','updatePlayTestF7','Scene_Map_createMenuButton','enable','Tilemap_addShadow','eventsXyNt','getColor','commandWindowRect','SParamVocab2','useDigitGroupingEx','DefaultStyle','INOUTSINE','getInputMultiButtonStrings','outlineColorGauge','updatePositionCoreEngineShakeHorz','DimColor2','sparamFlatBonus','left','faceWidth','Scene_Map_updateScene','dashToggle','animationId','TitlePicButtons','ParseEnemyNotetags','processEscape','skillId','test','VisuMZ_2_BattleSystemSTB','startNormalGame','SParamVocab9','cursorPagedown','IconXParam9','setLastPluginCommandInterpreter','note','PERCENT','resetBattleSystem','startAutoNewGame','IconXParam3','_centerElementCoreEngine','SystemLoadAudio','PictureEasingType','levelUp','RepositionEnemies','createFauxAnimationSprite','setActorHomeRepositioned','targetX','apply','catchUnknownError','JUNJA','cursorRight','Scene_GameEnd_createBackground','playOk','Scene_Shop_create','Input_clear','Input_shouldPreventDefault','SParamVocab7','createBackground','cos','DATABASE','Scene_Map_updateMainMultiply','catchNormalError','innerHeight','BACK_QUOTE','Sprite_Button_initialize','width','dummyWindowRect','_buttonType','adjustSprite','destroyCoreEngineMarkedBitmaps','bgs','_hideTileShadows','result','WIN_OEM_FJ_TOUROKU','SParameterFormula','process_VisuMZ_CoreEngine_jsQuickFunctions','Page','boxWidth','_onKeyDown','CLOSE_BRACKET','Game_Troop_setup','INSERT','NumberRect','startShake','_buttonAssistWindow','ParamChange','sparamRateJS','ScreenShake','xdg-open','993981ymYgCs','BattleManager_processEscape','OUTBACK','areButtonsHidden','ParseSkillNotetags','_stored_pendingColor','clamp','pagedown','missed','REC','textWidth','CLOSE_PAREN','startMove','Window_Selectable_cursorDown','MRF','drawGameVersion','DTB','usableSkills','QoL','opacity','1172hGLBUB','statusEquipWindowRect','process_VisuMZ_CoreEngine_Settings','onKeyDownKeysF6F7','PLAY','updateOpen','xparamPlus1','_animation','ColorMPGauge1','CancelText','KeySHIFT','catchLoadError','openingSpeed','ColorMaxLvGauge1','ActorBgType','sparamFlatJS','createCustomBackgroundImages','BoxMargin','IconXParam1','_coreEasing','setMute','goldWindowRect','Sprite_Gauge_currentValue','ColorCTGauge2','drawSegment','_stored_tpGaugeColor2','_statusWindow','LevelUpFullMp','setupCoreEngine','ParamMax','_spriteset','Game_Actor_paramBase','DOUBLE_QUOTE','playCursor','remove','_cache','LUK','buttonAssistKey1','_fauxAnimationQueue','MODECHANGE','OPEN_CURLY_BRACKET','NUMPAD0','ActorRect','EXR','PRINTSCREEN','ListBgType','_closing','paramFlatJS','setSideButtonLayout','UNDERSCORE','paramX','JSON','maxItems','iconWidth','EXECUTE','_isButtonHidden','process_VisuMZ_CoreEngine_Notetags','ColorCrisis','TRAIT_PARAM','Subtitle','profileWindowRect','optionsWindowRect','Settings','buttonAreaHeight','measureTextWidth','Plus1','SParamVocab4','isInputting','isNumpadPressed','updateOrigin','BattleSystem','HELP','itemSuccessRate','Window_NameInput_cursorDown','itypeId','_stored_systemColor','isCursorMovable','_stored_powerUpColor','retreat','WIN_OEM_RESET','_onKeyPress','IconSParam5','Scene_Skill_create','paramRate','Sprite_destroy','isSideView','_changingClass','touchUI','_pictureContainer','min','SLEEP','sparamPlus1','_profileWindow','xparamRateJS','_mapNameWindow','drawParamText','makeCoreEngineCommandList','_shouldPreventDefault','CNT','_commandList','toLowerCase','mute','OutlineColorGauge','up2','paramName','_baseTexture','addWindow','setBackgroundType','onDatabaseLoaded','fillRect','NUMPAD4','_shakeSpeed','processCursorHomeEndTrigger','ModernControls','_pageupButton','split','updateEffekseer','NUM','Title','StartID','constructor','_colorCache','ItemBgType','Window_NumberInput_processDigitChange','isBusy','sv_enemies','NoTileShadows','_data','xparamRate1','loadSystemImages','F22','log','MAXMP','Scene_Menu_create','LATIN1','optSideView','Game_Picture_initBasic','INOUTBACK','cursorDown','buttonAssistKey%1','SEPARATOR','processHandling','ColorCTGauge1','SParamVocab6','animationShouldMirror','XParamVocab1','_playtestF7Looping','Padding','fontSize','Scene_Status_create','COLON','menuShowButton','drawGauge','pictureButtons','Window_EquipItem_isEnabled','isBottomHelpMode','ATK','keyMapper','TRG','mainAreaBottom','WIN_OEM_FJ_ROYA','createJsQuickFunction','fromCharCode','filter','F18','setEnemyAction','IconParam6','targetScaleX','_inputSpecialKeyCode','Scene_Boot_updateDocumentTitle','xparamFlatBonus','targetScaleY','drawActorExpGauge','_cancelButton','helpAreaBottom','ColorPowerUp','setupNewGame','OutlineColor','Window_Gold_refresh','registerCommand','_blank','SideView','CAPSLOCK','mpGaugeColor2','updateAnchor','ActorTPColor','DEF','stypeId','isDying','SParamVocab0','_sellWindow','ParseWeaponNotetags','updatePadding','refresh','IconSParam1','CallHandlerJS','SkillTypeBgType','_context','processTimingData','Type','SlotBgType','processSoundTimings','\x5c}❪SHIFT❫\x5c{','mpColor','seVolume','Window_Base_drawFace','vertJS','Game_Temp_initialize','makeAutoBattleActions','move','slice','Total','initCoreEngineScreenShake','Enable','ALT','reserveNewGameCommonEvent','titles2','Graphics_centerElement','targetSpritePosition','open','setMainFontSize','\x5c}❪TAB❫\x5c{','windowPadding','417fzYfYy','ColorNormal','uiAreaHeight','isArrowPressed','InputRect','MainMenu','rightArrowWidth','number','createCommandWindow','SParamVocab8','_drawTextShadow','flush','charAt','characters','sparamPlus','playMiss','StatusRect','ctrl','gradientFillRect','Window_Selectable_processTouch','EscapeAlways','push','mainFontSize','isPhysical','sparamFlat1','%2%1%3','createTextState','xparamFlatJS','keyCode','_numberWindow','process_VisuMZ_CoreEngine_Functions','ItemPadding','_backgroundFilter','_fauxAnimationSprites','MenuLayout','type','stencilOp','powerUpColor','WIN_OEM_JUMP','Window_StatusBase_drawActorSimpleStatus','Scene_Map_createSpriteset','string','itemLineRect','exit','_categoryWindow','Window_NameInput_cursorRight','EISU','_stored_hpGaugeColor1','BottomHelp','_defaultStretchMode','F20','applyCoreEasing','image-rendering','paramBase','processTouchModernControls','CIRCUMFLEX','ctGaugeColor2','Spriteset_Base_destroy','Sprite_Animation_processSoundTimings','gaugeLineHeight','setHandler','backspace','platform','waiting','categoryWindowRect','playBuzzer','reserveCommonEvent','uiAreaWidth','down','bitmapWidth','_buyWindow','gold','LINEAR','PRESERVCONVERSION(%1)','NONCONVERT','ARRAYFUNC','processKeyboardBackspace','ForceNoPlayTest','ColorTPGauge1','isAlive','removeFauxAnimation','resetFontSettings','_baseSprite','makeDocumentTitle','xparamRate','transform','BACK_SLASH','TILDE','_inputString','SwitchActorText','maxGold','GoldOverlap','Window_Selectable_processCursorMove','Color','createBuffer','tpCostColor','centerSprite','Game_Picture_calcEasing','getCustomBackgroundSettings','_mode','adjustBoxSize','child_process','Game_System_initialize','BACKSPACE','updateFauxAnimations','processAlwaysEscape','_stored_expGaugeColor2','LvExpGauge','getLevel','hit','maxLvGaugeColor2','picture','animations','Renderer','isOptionValid','ONE','MDR','RevertPreserveNumbers','gameTitle','sparamFlat2','WIN_OEM_ENLW','Actor','ImprovedAccuracySystem','Plus2','createChildSprite','Game_Action_itemEva','F17','openness','ParseAllNotetags','KeyboardInput','paramPlusJS','areButtonsOutsideMainUI','StatusParamsBgType','subject','_targetOffsetX','ParseActorNotetags','erasePicture','actorWindowRect','WIN_OEM_WSCTRL','ApplyEasing','QUESTION_MARK','button','_effectsContainer','KEEP','makeCommandList','sellWindowRect','prototype','value','OUTCUBIC','Scene_Title_drawGameTitle','STRUCT','CommandRect','createEnemies','includes','inBattle','escape','CustomParamType','isPressed','EREOF','trim','_gamepadWait','pictures','TextCodeClassNames','TGR','IconSParam4','learnings','xScrollLinkedOffset','enter','add','isMenuButtonAssistEnabled','mpGaugeColor1','targetContentsOpacity','subtitle','Scene_Battle_update','DataManager_setupNewGame','WIN_OEM_CLEAR','background','Scene_MenuBase_mainAreaTop','encounterStepsMinimum','onNameOk','gaugeRate','isWindowMaskingEnabled','status','displayY','createFauxAnimation','exp','Game_Action_updateLastTarget','center','INOUTQUINT','CustomParamNames','_realScale','toLocaleString','paramMaxJS','maxCols','buttonAssistOffset2','CommandWidth','_clickHandler','sv_actors','updateKeyText','OpenSpeed','processCursorMoveModernControls','moveCancelButtonSideButtonLayout','DigitGroupingExText','STR','RegExp','parse','SystemLoadImages','MDF','_addShadow','TitleCommandList','colSpacing','createMenuButton','Scene_Boot_onDatabaseLoaded','onKeyDown','paramWidth','_mainSprite','IconParam3','MAT','BlurFilter','applyForcedGameTroopSettingsCoreEngine','IconParam0','description','OUTEXPO','wait','drawActorLevel','itemEva','initCoreEasing','paramchangeTextColor','paramBaseAboveLevel99','skipBranch','ItemHeight','_optionsWindow','numberWindowRect','pageup','inbounce','SellBgType','_cacheScaleY','attackSkillId','requestFauxAnimation','ZOOM','createDigits','_dimmerSprite','command111','IconParam4','HelpRect','Window_Base_update','stretch','EXSEL','isMapScrollLinked','top','hpGaugeColor2','isRightInputMode','itemBackColor2','stringKeyMap','bgmVolume','home','Scene_Battle_createCancelButton','WindowLayer_render','clear','_stored_expGaugeColor1','setGuard','NUM_LOCK','FontSize','ProfileRect','Control\x20Variables\x20Script\x20Error','initButtonHidden','isNormalPriority','mev','clearRect','targetY','Window_NameInput_refresh','Power','Scene_MenuBase_createCancelButton','Graphics_printError','setBattleSystem','_forcedTroopView','paramMax','Activated','Flat','fadeSpeed','ADD','PA1','paramY','Bitmap_clearRect','GoldFontSize','max','Key%1','randomInt','SParamVocab1','contentsBack','CTB','buttonAssistSwitch','WIN_OEM_FJ_LOYA','FUNC','F23','markCoreEngineModified','Window_Base_drawIcon','37251PuLEJE','titleCommandWindow','ESC','children','removeChild','_drawTextOutline','bind','powerDownColor','SLASH','CANCEL','name','performEscape','setSize','Input_onKeyDown','_actorWindow','snapForBackground','TextManager_param','pictureId','clearZoom','paramValueByName','WIN_ICO_HELP','HOME','keypress','GameEnd','INCUBIC','CTRL','reservePlayTestNewGameCommonEvent','text','CEV','map','OPEN_BRACKET','paramRateJS','_movementDuration','updateCoreEasing','isHandled','Spriteset_Battle_createEnemies','processKeyboardEnd','_repositioned','ShowButtons','_stored_hpGaugeColor2','ItemRect','createCancelButton','startAnimation','WIN_OEM_ATTN','paramPlus','PreserveNumbers','xparamFlat2','SellRect','ColSpacing','listWindowRect','updateMainMultiply','clearForcedGameTroopSettingsCoreEngine','actor','EncounterRateMinimum','SceneManager_onKeyDown','_windowLayer','Scene_Battle_createSpriteset','dimColor2','Window_Base_drawCharacter','params','_stored_mpCostColor','drawValue','OUTQUINT','_duration','SELECT','buttonAssistKey5','initialBattleSystem','create','Game_Map_setup','_moveEasingType','innerWidth','SCROLL_LOCK','level','sin','PixelateImageRendering','isExpGaugeDrawn','_forcedBattleSys','_statusEquipWindow','HelpBgType','XParameterFormula','ColorMPGauge2','drawParamName','IconSet','StatusEquipBgType','updateClose','isCollidedWithEvents','DigitGroupingGaugeSprites','WIN_ICO_CLEAR','replace','createDimmerSprite','ARRAYNUM','_sideButtonLayout','TextStr','enemies','EquipMenu','Scene_Item_create','paramFlat','textSizeEx','playCursorSound','none','INBOUNCE','_shakePower','Plus','isEnemy','STB','statusParamsWindowRect','PGUP','ConvertParams','_scene','EXCLAMATION','smoothSelect','setupCoreEasing','_stored_maxLvGaugeColor2','Scene_Boot_loadSystemImages','Wait','Game_Interpreter_command355','command355','Window_NameInput_cursorLeft','playTestF7','integer','setClickHandler','WIN_OEM_CUSEL','format','alwaysDash','pixelated','Rate1','addEventListener','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','system','getBackgroundOpacity','EVA','CategoryRect','initCoreEngine','PictureEraseAll','asin','_stored_crisisColor','isSmartEventCollisionOn','XParamVocab7','Scene_MenuBase_createBackground','fillStyle','batch','ActorHPColor','OpenURL','createSpriteset','_registerKeyInput','param','Input_pollGamepads','xparamPlus2','SParamVocab3','Window_Base_createTextState','nextLevelExp','isNwjs','right','win32','ParamName','DisplayedParams','determineSideButtonLayoutValid','updateTransform','Game_Actor_changeClass','buttonAssistText3','_setupEventHandlers','Conditional\x20Branch\x20Script\x20Error','goto','renderNoMask','loadBitmap','makeFontSmaller','drawCurrencyValue','\x0a\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%2\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20console.log(\x27JS\x20Quick\x20Function\x20\x22%1\x22\x20Error!\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20','Scene_Base_createWindowLayer','printError','_pagedownButton','mpCostColor','setCoreEngineUpdateWindowBg','Window_NameInput_cursorPagedown','HRG','Game_BattlerBase_refresh','ParseStateNotetags','boxHeight','maxLevel','addCommand','setSideView','random','anchor','defaultInputMode','LoadMenu','OpenConsole','buttonAssistWindowButtonRect','OptionsBgType','isTpb','Game_Picture_show','BTB','WIN_OEM_PA3','BgType','DrawIcons','GoldRect','font-smooth','_isPlaytest','_editWindow','Bitmap_gradientFillRect','Window_NameInput_processTouch','Scene_Equip_create','StatusParamsRect','SnapshotOpacity','advanced','Game_Screen_initialize','PHA','FDR','EQUAL','itemBackColor1','Input_update','ShowItemBackground','item','F14','SHIFT','(\x5cd+\x5c.?\x5cd+)>','_screenX','createButtonAssistWindow','isTouchedInsideFrame','_maxDigits','outbounce','CRI','SystemSetWindowPadding','([\x5c+\x5c-]\x5cd+)>','terms','changeTextColor','_number','resize','mainAreaTop','mainCommandWidth','isMagical','createTitleButtons','filters','expRate','getInputButtonString','EnableNumberInput','setupButtonImage','version','key%1','_targetAnchor','ARRAYEVAL','SceneManager_initialize','option','substring','nickname','CONTEXT_MENU','drawIconBySize','SkillMenu','addChildToBack','processKeyboardHome','buttonAssistOffset%1','equips','sparam','VOLUME_DOWN','ItemMenu','VisuMZ_2_BattleSystemBTB','RIGHT','end','INELASTIC','EndingID','bitmap','focus','drawBackgroundRect','makeActionList','clearStencil','%1%2','command122','Game_Actor_levelUp','createCustomParameter','_movementWholeDuration','Window_NumberInput_start','bgm','initDigitGrouping','Game_Picture_updateMove','setSkill','MAXHP','save','Version','ParseItemNotetags','Scene_Unlisted','_destroyInternalTextures','Scene_MenuBase_createPageButtons','IconParam7','INQUINT','parameters','targetEvaRate','%1/','SUBTRACT','NUMPAD1','refreshDimmerBitmap','WIN_OEM_AUTO','DigitGroupingLocale','LEFT','start','Sprite_Gauge_gaugeRate','F24','outlineColorDmg','BgFilename1','ItemStyle','buttonAssistText4','IconXParam5','cursorUp','Window_Base_drawText','default','subjectHitRate','TextCodeNicknames','Rate','1966irHfnB','NUMPAD7','statusWindowRect','duration','Speed','PIPE','QwertyLayout','catchException','Window_NameInput_cursorUp','29vCDjCW','getCoreEngineScreenShakeStyle','traitsPi','GREATER_THAN','isSideButtonLayout','setCoreEngineScreenShakeStyle','Duration','Abbreviation','enemy','height','134226kXsBWw','pow','initBasic','updatePictureAntiZoom','abs','GoldMax','initVisuMZCoreEngine','drawCircle','DigitGroupingDamageSprites','setWindowPadding','calcEasing','_targetOffsetY','down2','StatusMenu','Game_Action_itemHit','style','IconSParam9','hideButtonFromView','mmp','setup','parseForcedGameTroopSettingsCoreEngine','cancelShowButton','xparam','backOpacity','GoldBgType','DIVIDE','Window_Selectable_itemRect','bgsVolume','AutoStretch','atbActive','targetBackOpacity','IconXParam4','drawCurrentParam','keyboard','SEMICOLON','_internalTextures','_stored_powerDownColor','ShowJS','ALTGR','buttonAssistText5','Flat2','makeFontBigger','mainAreaHeightSideButtonLayout','commandWindowRows','processKeyboardDelete','CoreEngine','charCode','CommandList','useDigitGrouping','_timerSprite','Window_ShopSell_isEnabled','TranslucentOpacity','_offsetX','CodeJS','EditBgType','updateMain','loadTitle1','scale','Flat1','valueOutlineWidth','Window_NameInput_processHandling','_centerElement','evaded','COMMA','paramRate2','updatePositionCoreEngineShakeRand','processBack','currentClass','horizontal','isBottomButtonMode','WIN_ICO_00','OkText','updateDocumentTitle','checkSmartEventCollision','isFauxAnimationPlaying','Keyboard','drawGoldItemStyle','ConvertNumberToString','Game_Picture_y','loadGameImagesCoreEngine','IconSParam3','_coreEasingType','loadWindowskin','setEasingType','ActorMPColor','Sprite_Button_updateOpacity','PAUSE','_dummyWindow','isMaxLevel','numberShowButton','isPlaying','Basic','updateOpacity','PictureFilename','FontShadows','ParseArmorNotetags','ColorManager_loadWindowskin','Spriteset_Base_updatePosition','drawAllParams','MultiKeyFmt','drawIcon','#%1','contains','defineProperty','showDevTools','drawActorClass','setFrame','sparamRate2','volume','Game_Picture_x','GRD','xparamFlat1','drawActorSimpleStatus','DOWN','SkillTypeRect','NumberBgType','F21','653IiEwVL','ColorTPGauge2','calcCoreEasing','MCR','Symbol','Manual','setTargetAnchor','_anchor','Game_Character_processMoveCommand','drawGameSubtitle','render','tpGaugeColor1','WIN_OEM_FJ_JISHO','_hideButtons','SlotRect','numActions','normalColor','NUMPAD2','OnLoadJS','buttonAssistText1','imageSmoothingEnabled','INQUAD','InputBgType','isOpen','battleSystem','createFauxAnimationQueue','XParamVocab9','sqrt','updatePositionCoreEngineShakeOriginal'];const _0xeaec=function(_0x127168,_0x1f0c05){_0x127168=_0x127168-0x139;let _0x4d2c95=_0x4d2c[_0x127168];return _0x4d2c95;};const _0x3a25e2=_0xeaec;(function(_0x47f74a,_0x106f4b){const _0x4178e9=_0xeaec;while(!![]){try{const _0x24eaa6=parseInt(_0x4178e9(0x391))*parseInt(_0x4178e9(0x5ec))+parseInt(_0x4178e9(0x6db))+parseInt(_0x4178e9(0x5ff))+parseInt(_0x4178e9(0x4ba))*-parseInt(_0x4178e9(0x5f5))+parseInt(_0x4178e9(0x29e))+parseInt(_0x4178e9(0x674))*-parseInt(_0x4178e9(0x2b2))+parseInt(_0x4178e9(0x189));if(_0x24eaa6===_0x106f4b)break;else _0x47f74a['push'](_0x47f74a['shift']());}catch(_0xb793ff){_0x47f74a['push'](_0x47f74a['shift']());}}}(_0x4d2c,0x945fb));var label=_0x3a25e2(0x62c),tier=tier||0x0,dependencies=[],pluginData=$plugins[_0x3a25e2(0x355)](function(_0x55d9a8){const _0x1b2c6b=_0x3a25e2;return _0x55d9a8[_0x1b2c6b(0x447)]&&_0x55d9a8[_0x1b2c6b(0x46e)][_0x1b2c6b(0x42a)]('['+label+']');})[0x0];VisuMZ[label][_0x3a25e2(0x2f0)]=VisuMZ[label]['Settings']||{},VisuMZ[_0x3a25e2(0x525)]=function(_0x4b5a66,_0x378e07){const _0x358003=_0x3a25e2;for(const _0x309868 in _0x378e07){if(_0x309868['match'](/(.*):(.*)/i)){const _0x173711=String(RegExp['$1']),_0x1a0b1f=String(RegExp['$2'])[_0x358003(0x699)]()[_0x358003(0x430)]();let _0x2c7fd9,_0x5563cf,_0x15eb3f;switch(_0x1a0b1f){case _0x358003(0x327):_0x2c7fd9=_0x378e07[_0x309868]!==''?Number(_0x378e07[_0x309868]):0x0;break;case _0x358003(0x514):_0x5563cf=_0x378e07[_0x309868]!==''?JSON[_0x358003(0x45e)](_0x378e07[_0x309868]):[],_0x2c7fd9=_0x5563cf[_0x358003(0x4d7)](_0x1b3612=>Number(_0x1b3612));break;case'EVAL':_0x2c7fd9=_0x378e07[_0x309868]!==''?eval(_0x378e07[_0x309868]):null;break;case _0x358003(0x5a9):_0x5563cf=_0x378e07[_0x309868]!==''?JSON[_0x358003(0x45e)](_0x378e07[_0x309868]):[],_0x2c7fd9=_0x5563cf[_0x358003(0x4d7)](_0x253723=>eval(_0x253723));break;case _0x358003(0x2e5):_0x2c7fd9=_0x378e07[_0x309868]!==''?JSON[_0x358003(0x45e)](_0x378e07[_0x309868]):'';break;case'ARRAYJSON':_0x5563cf=_0x378e07[_0x309868]!==''?JSON[_0x358003(0x45e)](_0x378e07[_0x309868]):[],_0x2c7fd9=_0x5563cf[_0x358003(0x4d7)](_0x22dcca=>JSON[_0x358003(0x45e)](_0x22dcca));break;case _0x358003(0x4b6):_0x2c7fd9=_0x378e07[_0x309868]!==''?new Function(JSON[_0x358003(0x45e)](_0x378e07[_0x309868])):new Function(_0x358003(0x6e6));break;case _0x358003(0x3dc):_0x5563cf=_0x378e07[_0x309868]!==''?JSON[_0x358003(0x45e)](_0x378e07[_0x309868]):[],_0x2c7fd9=_0x5563cf[_0x358003(0x4d7)](_0x19420b=>new Function(JSON[_0x358003(0x45e)](_0x19420b)));break;case _0x358003(0x45c):_0x2c7fd9=_0x378e07[_0x309868]!==''?String(_0x378e07[_0x309868]):'';break;case _0x358003(0x6d2):_0x5563cf=_0x378e07[_0x309868]!==''?JSON[_0x358003(0x45e)](_0x378e07[_0x309868]):[],_0x2c7fd9=_0x5563cf[_0x358003(0x4d7)](_0x372866=>String(_0x372866));break;case _0x358003(0x427):_0x15eb3f=_0x378e07[_0x309868]!==''?JSON[_0x358003(0x45e)](_0x378e07[_0x309868]):{},_0x4b5a66[_0x173711]={},VisuMZ[_0x358003(0x525)](_0x4b5a66[_0x173711],_0x15eb3f);continue;case'ARRAYSTRUCT':_0x5563cf=_0x378e07[_0x309868]!==''?JSON[_0x358003(0x45e)](_0x378e07[_0x309868]):[],_0x2c7fd9=_0x5563cf[_0x358003(0x4d7)](_0x41c842=>VisuMZ[_0x358003(0x525)]({},JSON[_0x358003(0x45e)](_0x41c842)));break;default:continue;}_0x4b5a66[_0x173711]=_0x2c7fd9;}}return _0x4b5a66;},(_0x325243=>{const _0x433b2c=_0x3a25e2,_0x4d41f1=_0x325243[_0x433b2c(0x4c4)];for(const _0x4f63e4 of dependencies){if(!Imported[_0x4f63e4]){alert(_0x433b2c(0x539)[_0x433b2c(0x534)](_0x4d41f1,_0x4f63e4)),SceneManager[_0x433b2c(0x3bc)]();break;}}const _0x2e3639=_0x325243[_0x433b2c(0x46e)];if(_0x2e3639[_0x433b2c(0x175)](/\[Version[ ](.*?)\]/i)){const _0x139f6c=Number(RegExp['$1']);_0x139f6c!==VisuMZ[label]['version']&&(alert(_0x433b2c(0x1fc)[_0x433b2c(0x534)](_0x4d41f1,_0x139f6c)),SceneManager[_0x433b2c(0x3bc)]());}if(_0x2e3639[_0x433b2c(0x175)](/\[Tier[ ](\d+)\]/i)){const _0x24ea8b=Number(RegExp['$1']);_0x24ea8b<tier?(alert('%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.'[_0x433b2c(0x534)](_0x4d41f1,_0x24ea8b,tier)),SceneManager[_0x433b2c(0x3bc)]()):tier=Math[_0x433b2c(0x4ae)](_0x24ea8b,tier);}VisuMZ['ConvertParams'](VisuMZ[label][_0x433b2c(0x2f0)],_0x325243[_0x433b2c(0x5d5)]);})(pluginData),VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x4a6)]={'PluginCommands':!![]},PluginManager['registerCommand'](pluginData['name'],_0x3a25e2(0x548),_0x18c9f9=>{const _0xa589a0=_0x3a25e2;VisuMZ[_0xa589a0(0x525)](_0x18c9f9,_0x18c9f9);const _0x17b23c=_0x18c9f9['URL'];VisuMZ[_0xa589a0(0x13c)](_0x17b23c);}),PluginManager[_0x3a25e2(0x365)](pluginData[_0x3a25e2(0x4c4)],'GoldChange',_0x5cbb16=>{const _0x43c8d1=_0x3a25e2;VisuMZ[_0x43c8d1(0x525)](_0x5cbb16,_0x5cbb16);const _0x33d650=_0x5cbb16[_0x43c8d1(0x424)]||0x0;$gameParty[_0x43c8d1(0x213)](_0x33d650);}),PluginManager[_0x3a25e2(0x365)](pluginData['name'],_0x3a25e2(0x26e),_0x44faf9=>{const _0x36df4f=_0x3a25e2;VisuMZ[_0x36df4f(0x525)](_0x44faf9,_0x44faf9);const _0x2a3cfd=_0x44faf9[_0x36df4f(0x4cb)]||0x1,_0x2a8801=_0x44faf9[_0x36df4f(0x1a2)]||_0x36df4f(0x1c1),_0x19fd29=$gameScreen[_0x36df4f(0x400)](_0x2a3cfd);_0x19fd29&&_0x19fd29['setEasingType'](_0x2a8801);}),PluginManager['registerCommand'](pluginData[_0x3a25e2(0x4c4)],_0x3a25e2(0x53f),_0x541d2d=>{const _0x16c768=_0x3a25e2;for(let _0x351c91=0x1;_0x351c91<=0x64;_0x351c91++){$gameScreen[_0x16c768(0x419)](_0x351c91);}}),PluginManager[_0x3a25e2(0x365)](pluginData[_0x3a25e2(0x4c4)],_0x3a25e2(0x697),_0x4728a2=>{const _0xc57f21=_0x3a25e2;VisuMZ[_0xc57f21(0x525)](_0x4728a2,_0x4728a2);const _0x1828e5=Math[_0xc57f21(0x30b)](_0x4728a2[_0xc57f21(0x329)],_0x4728a2[_0xc57f21(0x5bc)]),_0x3f0318=Math[_0xc57f21(0x4ae)](_0x4728a2[_0xc57f21(0x329)],_0x4728a2[_0xc57f21(0x5bc)]);for(let _0x3b6d14=_0x1828e5;_0x3b6d14<=_0x3f0318;_0x3b6d14++){$gameScreen[_0xc57f21(0x419)](_0x3b6d14);}}),PluginManager['registerCommand'](pluginData[_0x3a25e2(0x4c4)],_0x3a25e2(0x29c),_0x116ba9=>{const _0x430e01=_0x3a25e2;VisuMZ[_0x430e01(0x525)](_0x116ba9,_0x116ba9);const _0x68b8e7=_0x116ba9[_0x430e01(0x379)]||_0x430e01(0x56f),_0x499bb6=_0x116ba9[_0x430e01(0x4a0)][_0x430e01(0x2a4)](0x1,0x9),_0xfc5f1a=_0x116ba9[_0x430e01(0x5f0)][_0x430e01(0x2a4)](0x1,0x9),_0x4ea93a=_0x116ba9[_0x430e01(0x5fb)]||0x1,_0xada7a2=_0x116ba9[_0x430e01(0x52c)];$gameScreen['setCoreEngineScreenShakeStyle'](_0x68b8e7),$gameScreen[_0x430e01(0x298)](_0x499bb6,_0xfc5f1a,_0x4ea93a);if(_0xada7a2){const _0x353f6b=$gameTemp[_0x430e01(0x1e2)]();if(_0x353f6b)_0x353f6b[_0x430e01(0x470)](_0x4ea93a);}}),PluginManager[_0x3a25e2(0x365)](pluginData[_0x3a25e2(0x4c4)],'SystemSetFontSize',_0x2db1ac=>{const _0x4fd203=_0x3a25e2;VisuMZ[_0x4fd203(0x525)](_0x2db1ac,_0x2db1ac);const _0x1eda76=_0x2db1ac[_0x4fd203(0x5ab)]||0x1;$gameSystem['setMainFontSize'](_0x1eda76);}),PluginManager[_0x3a25e2(0x365)](pluginData[_0x3a25e2(0x4c4)],'SystemSetSideView',_0x332391=>{const _0x4f5215=_0x3a25e2;if($gameParty[_0x4f5215(0x42b)]())return;VisuMZ['ConvertParams'](_0x332391,_0x332391);const _0x4471e4=_0x332391[_0x4f5215(0x5ab)];if(_0x4471e4[_0x4f5215(0x175)](/Front/i))$gameSystem[_0x4f5215(0x56e)](![]);else _0x4471e4[_0x4f5215(0x175)](/Side/i)?$gameSystem[_0x4f5215(0x56e)](!![]):$gameSystem[_0x4f5215(0x56e)](!$gameSystem['isSideView']());}),PluginManager[_0x3a25e2(0x365)](pluginData[_0x3a25e2(0x4c4)],_0x3a25e2(0x26d),_0x41f3b3=>{const _0x5188a1=_0x3a25e2;if($gameParty['inBattle']())return;VisuMZ[_0x5188a1(0x525)](_0x41f3b3,_0x41f3b3);const _0x555aa8=[_0x5188a1(0x5c8),_0x5188a1(0x28b),'me','se'];for(const _0x44befd of _0x555aa8){const _0x307b89=_0x41f3b3[_0x44befd],_0x435169=_0x5188a1(0x5d7)['format'](_0x44befd);for(const _0x302ae7 of _0x307b89){console[_0x5188a1(0x335)](_0x435169,_0x302ae7),AudioManager[_0x5188a1(0x3ef)](_0x435169,_0x302ae7);}}}),PluginManager[_0x3a25e2(0x365)](pluginData[_0x3a25e2(0x4c4)],_0x3a25e2(0x45f),_0x87b974=>{const _0x21044e=_0x3a25e2;if($gameParty['inBattle']())return;VisuMZ[_0x21044e(0x525)](_0x87b974,_0x87b974);const _0x33abdb=[_0x21044e(0x401),'battlebacks1','battlebacks2',_0x21044e(0x39e),_0x21044e(0x517),'faces','parallaxes',_0x21044e(0x432),_0x21044e(0x456),'sv_enemies','system','tilesets',_0x21044e(0x174),_0x21044e(0x38a)];for(const _0x6df4ea of _0x33abdb){const _0x3f0cb2=_0x87b974[_0x6df4ea],_0x1d82a5=_0x21044e(0x1f6)[_0x21044e(0x534)](_0x6df4ea);for(const _0x2c2589 of _0x3f0cb2){ImageManager[_0x21044e(0x55e)](_0x1d82a5,_0x2c2589);}}}),PluginManager['registerCommand'](pluginData[_0x3a25e2(0x4c4)],'SystemSetBattleSystem',_0x144702=>{const _0x31eb37=_0x3a25e2;if($gameParty[_0x31eb37(0x42b)]())return;VisuMZ[_0x31eb37(0x525)](_0x144702,_0x144702);const _0x11d9dd=_0x144702[_0x31eb37(0x5ab)][_0x31eb37(0x699)]()[_0x31eb37(0x430)](),_0x4ec9f7=VisuMZ[_0x31eb37(0x62c)][_0x31eb37(0x23c)](_0x11d9dd);$gameSystem[_0x31eb37(0x4a3)](_0x4ec9f7);}),VisuMZ[_0x3a25e2(0x62c)]['CreateBattleSystemID']=function(_0x66e3f6){const _0x4c8958=_0x3a25e2;_0x66e3f6=_0x66e3f6||_0x4c8958(0x280),_0x66e3f6=String(_0x66e3f6)[_0x4c8958(0x699)]()[_0x4c8958(0x430)]();switch(_0x66e3f6){case _0x4c8958(0x2ae):return 0x0;case'TPB\x20ACTIVE':Imported['VisuMZ_1_OptionsCore']&&(ConfigManager[_0x4c8958(0x61c)]=!![]);return 0x1;case'TPB\x20WAIT':Imported['VisuMZ_1_OptionsCore']&&(ConfigManager['atbActive']=![]);return 0x2;case _0x4c8958(0x4b3):if(Imported[_0x4c8958(0x6b0)])return _0x4c8958(0x4b3);break;case _0x4c8958(0x522):if(Imported['VisuMZ_2_BattleSystemSTB'])return _0x4c8958(0x522);break;case'BTB':if(Imported['VisuMZ_2_BattleSystemBTB'])return _0x4c8958(0x578);break;case _0x4c8958(0x69a):if(Imported['VisuMZ_2_BattleSystemFTB'])return'FTB';break;}return $dataSystem[_0x4c8958(0x68c)];},PluginManager[_0x3a25e2(0x365)](pluginData[_0x3a25e2(0x4c4)],_0x3a25e2(0x597),_0x140c99=>{const _0xfa5b7d=_0x3a25e2;VisuMZ[_0xfa5b7d(0x525)](_0x140c99,_0x140c99);const _0x5b5465=_0x140c99['option']||0x1;$gameSystem[_0xfa5b7d(0x608)](_0x5b5465);}),VisuMZ['CoreEngine'][_0x3a25e2(0x465)]=Scene_Boot[_0x3a25e2(0x423)][_0x3a25e2(0x31e)],Scene_Boot[_0x3a25e2(0x423)][_0x3a25e2(0x31e)]=function(){const _0xed6f79=_0x3a25e2;VisuMZ[_0xed6f79(0x62c)][_0xed6f79(0x465)][_0xed6f79(0x6d9)](this),this['process_VisuMZ_CoreEngine_RegExp'](),this['process_VisuMZ_CoreEngine_Notetags'](),this[_0xed6f79(0x2b4)](),this[_0xed6f79(0x3af)](),this['process_VisuMZ_CoreEngine_CustomParameters'](),VisuMZ['ParseAllNotetags']();},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x45d)]={},Scene_Boot[_0x3a25e2(0x423)]['process_VisuMZ_CoreEngine_RegExp']=function(){const _0x341ae1=_0x3a25e2,_0x19fe43=[_0x341ae1(0x5cc),_0x341ae1(0x336),'ATK','DEF','MAT','MDF','AGI',_0x341ae1(0x2d6)],_0x54f639=['HIT','EVA',_0x341ae1(0x596),_0x341ae1(0x4d6),_0x341ae1(0x1df),_0x341ae1(0x2ac),_0x341ae1(0x314),_0x341ae1(0x568),_0x341ae1(0x23f),'TRG'],_0x1afb75=['TGR',_0x341ae1(0x66d),_0x341ae1(0x2a7),_0x341ae1(0x587),_0x341ae1(0x677),_0x341ae1(0x18f),_0x341ae1(0x1f3),'MDR',_0x341ae1(0x588),'EXR'],_0x38545e=[_0x19fe43,_0x54f639,_0x1afb75],_0x2b5251=[_0x341ae1(0x520),'Plus1',_0x341ae1(0x40c),'Max',_0x341ae1(0x5eb),_0x341ae1(0x537),_0x341ae1(0x6b2),_0x341ae1(0x4a7),_0x341ae1(0x639),_0x341ae1(0x627)];for(const _0x40c679 of _0x38545e){let _0x3e83bd='';if(_0x40c679===_0x19fe43)_0x3e83bd=_0x341ae1(0x54b);if(_0x40c679===_0x54f639)_0x3e83bd=_0x341ae1(0x615);if(_0x40c679===_0x1afb75)_0x3e83bd=_0x341ae1(0x5b5);for(const _0x4533d0 of _0x2b5251){let _0x1856fb=_0x341ae1(0x5c2)['format'](_0x3e83bd,_0x4533d0);VisuMZ['CoreEngine'][_0x341ae1(0x45d)][_0x1856fb]=[],VisuMZ['CoreEngine'][_0x341ae1(0x45d)][_0x1856fb+'JS']=[];let _0x228a5a=_0x341ae1(0x1e6);if(['Plus',_0x341ae1(0x4a7)][_0x341ae1(0x42a)](_0x4533d0))_0x228a5a+=_0x341ae1(0x598);else{if([_0x341ae1(0x2f3),_0x341ae1(0x639)][_0x341ae1(0x42a)](_0x4533d0))_0x228a5a+=_0x341ae1(0x69d);else{if([_0x341ae1(0x40c),_0x341ae1(0x627)][_0x341ae1(0x42a)](_0x4533d0))_0x228a5a+=_0x341ae1(0x6ae);else{if(_0x4533d0==='Max')_0x228a5a+='(\x5cd+)>';else{if(_0x4533d0==='Rate1')_0x228a5a+=_0x341ae1(0x22f);else _0x4533d0===_0x341ae1(0x6b2)&&(_0x228a5a+=_0x341ae1(0x590));}}}}for(const _0x25b433 of _0x40c679){let _0x1b8a48=_0x4533d0[_0x341ae1(0x512)](/[\d+]/g,'')['toUpperCase']();const _0x20c7cb=_0x228a5a[_0x341ae1(0x534)](_0x25b433,_0x1b8a48);VisuMZ['CoreEngine'][_0x341ae1(0x45d)][_0x1856fb][_0x341ae1(0x3a6)](new RegExp(_0x20c7cb,'i'));const _0x257bb5='<JS\x20%1\x20%2:[\x20](.*)>'[_0x341ae1(0x534)](_0x25b433,_0x1b8a48);VisuMZ[_0x341ae1(0x62c)]['RegExp'][_0x1856fb+'JS'][_0x341ae1(0x3a6)](new RegExp(_0x257bb5,'i'));}}}},Scene_Boot['prototype'][_0x3a25e2(0x2ea)]=function(){const _0x2583d1=_0x3a25e2;if(VisuMZ[_0x2583d1(0x411)])return;},Scene_Boot['prototype']['process_VisuMZ_CoreEngine_Settings']=function(){const _0x3d2f5d=_0x3a25e2;VisuMZ[_0x3d2f5d(0x62c)]['Settings'][_0x3d2f5d(0x2b0)][_0x3d2f5d(0x573)]&&VisuMZ[_0x3d2f5d(0x1dc)](!![]);VisuMZ['CoreEngine'][_0x3d2f5d(0x2f0)][_0x3d2f5d(0x2b0)][_0x3d2f5d(0x323)]&&(Input[_0x3d2f5d(0x34f)][0x23]=_0x3d2f5d(0x5ba),Input['keyMapper'][0x24]=_0x3d2f5d(0x490));if(VisuMZ[_0x3d2f5d(0x62c)]['Settings'][_0x3d2f5d(0x151)]){const _0x19d99d=VisuMZ[_0x3d2f5d(0x62c)][_0x3d2f5d(0x2f0)][_0x3d2f5d(0x151)];_0x19d99d[_0x3d2f5d(0x2bc)]=_0x19d99d[_0x3d2f5d(0x2bc)]||_0x3d2f5d(0x37c),_0x19d99d[_0x3d2f5d(0x6f3)]=_0x19d99d[_0x3d2f5d(0x6f3)]||_0x3d2f5d(0x38f);}VisuMZ[_0x3d2f5d(0x62c)][_0x3d2f5d(0x2f0)][_0x3d2f5d(0x412)]['WASD']&&(Input[_0x3d2f5d(0x34f)][0x57]='up',Input[_0x3d2f5d(0x34f)][0x41]=_0x3d2f5d(0x257),Input['keyMapper'][0x53]=_0x3d2f5d(0x3d5),Input[_0x3d2f5d(0x34f)][0x44]=_0x3d2f5d(0x552),Input[_0x3d2f5d(0x34f)][0x45]='pagedown'),VisuMZ[_0x3d2f5d(0x62c)]['Settings'][_0x3d2f5d(0x412)][_0x3d2f5d(0x19c)]&&(Input[_0x3d2f5d(0x34f)][0x52]='dashToggle');},Scene_Boot[_0x3a25e2(0x423)][_0x3a25e2(0x3af)]=function(){const _0x39de5f=_0x3a25e2;this[_0x39de5f(0x290)]();},Scene_Boot[_0x3a25e2(0x423)][_0x3a25e2(0x290)]=function(){const _0x18cc19=_0x3a25e2,_0x41ba3c=VisuMZ['CoreEngine'][_0x18cc19(0x2f0)]['jsQuickFunc'];for(const _0x5191a of _0x41ba3c){const _0x4aae66=_0x5191a['FunctionName'][_0x18cc19(0x512)](/[ ]/g,''),_0x396a6b=_0x5191a[_0x18cc19(0x634)];VisuMZ[_0x18cc19(0x62c)][_0x18cc19(0x353)](_0x4aae66,_0x396a6b);}},VisuMZ['CoreEngine'][_0x3a25e2(0x353)]=function(_0x114e04,_0x433614){const _0x116a0a=_0x3a25e2;if(!!window[_0x114e04]){if($gameTemp[_0x116a0a(0x1fe)]())console[_0x116a0a(0x335)]('WARNING:\x20%1\x20has\x20already\x20been\x20declared\x0aand\x20cannot\x20be\x20used\x20as\x20a\x20Quick\x20JS\x20Function'[_0x116a0a(0x534)](_0x114e04));}const _0x41932b=_0x116a0a(0x561)[_0x116a0a(0x534)](_0x114e04,_0x433614);window[_0x114e04]=new Function(_0x41932b);},Scene_Boot[_0x3a25e2(0x423)]['process_VisuMZ_CoreEngine_CustomParameters']=function(){const _0x59e242=_0x3a25e2,_0x253c49=VisuMZ['CoreEngine'][_0x59e242(0x2f0)]['CustomParam'];if(!_0x253c49)return;for(const _0x5625a6 of _0x253c49){if(!_0x5625a6)continue;VisuMZ[_0x59e242(0x62c)][_0x59e242(0x5c5)](_0x5625a6);}},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x44e)]={},VisuMZ[_0x3a25e2(0x62c)]['CustomParamIcons']={},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x42d)]={},VisuMZ['CoreEngine']['CustomParamAbb']={},VisuMZ[_0x3a25e2(0x62c)]['createCustomParameter']=function(_0x203e4e){const _0x21841b=_0x3a25e2,_0x12aba4=_0x203e4e[_0x21841b(0x5fc)],_0x21e486=_0x203e4e[_0x21841b(0x554)],_0x1aaf34=_0x203e4e['Icon'],_0x598682=_0x203e4e[_0x21841b(0x379)],_0x37fd30=new Function(_0x203e4e['ValueJS']);VisuMZ[_0x21841b(0x62c)]['CustomParamNames'][_0x12aba4['toUpperCase']()[_0x21841b(0x430)]()]=_0x21e486,VisuMZ['CoreEngine']['CustomParamIcons'][_0x12aba4[_0x21841b(0x699)]()['trim']()]=_0x1aaf34,VisuMZ[_0x21841b(0x62c)][_0x21841b(0x42d)][_0x12aba4[_0x21841b(0x699)]()['trim']()]=_0x598682,VisuMZ[_0x21841b(0x62c)][_0x21841b(0x19e)][_0x12aba4['toUpperCase']()[_0x21841b(0x430)]()]=_0x12aba4,Object[_0x21841b(0x666)](Game_BattlerBase[_0x21841b(0x423)],_0x12aba4,{'get'(){const _0x26d895=_0x21841b,_0x365b36=_0x37fd30[_0x26d895(0x6d9)](this);return _0x598682===_0x26d895(0x531)?Math[_0x26d895(0x1a1)](_0x365b36):_0x365b36;}});},VisuMZ[_0x3a25e2(0x411)]=function(){const _0x3bc619=_0x3a25e2;for(const _0x2d8237 of $dataActors){if(_0x2d8237)VisuMZ[_0x3bc619(0x418)](_0x2d8237);}for(const _0x289e71 of $dataClasses){if(_0x289e71)VisuMZ['ParseClassNotetags'](_0x289e71);}for(const _0xcce321 of $dataSkills){if(_0xcce321)VisuMZ[_0x3bc619(0x2a2)](_0xcce321);}for(const _0x45fd1f of $dataItems){if(_0x45fd1f)VisuMZ[_0x3bc619(0x5cf)](_0x45fd1f);}for(const _0x14ea8a of $dataWeapons){if(_0x14ea8a)VisuMZ['ParseWeaponNotetags'](_0x14ea8a);}for(const _0x511314 of $dataArmors){if(_0x511314)VisuMZ[_0x3bc619(0x65e)](_0x511314);}for(const _0x52dce9 of $dataEnemies){if(_0x52dce9)VisuMZ[_0x3bc619(0x25d)](_0x52dce9);}for(const _0x251f5e of $dataStates){if(_0x251f5e)VisuMZ['ParseStateNotetags'](_0x251f5e);}for(const _0x5d87a4 of $dataTilesets){if(_0x5d87a4)VisuMZ[_0x3bc619(0x141)](_0x5d87a4);}},VisuMZ[_0x3a25e2(0x418)]=function(_0x3b9352){},VisuMZ[_0x3a25e2(0x6cb)]=function(_0xd09d46){},VisuMZ[_0x3a25e2(0x2a2)]=function(_0x49c517){},VisuMZ[_0x3a25e2(0x5cf)]=function(_0x3984ff){},VisuMZ[_0x3a25e2(0x371)]=function(_0x22b68c){},VisuMZ[_0x3a25e2(0x65e)]=function(_0x4e709d){},VisuMZ['ParseEnemyNotetags']=function(_0x496b45){},VisuMZ[_0x3a25e2(0x56a)]=function(_0x2fe584){},VisuMZ[_0x3a25e2(0x141)]=function(_0x4f538d){},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x418)]=VisuMZ['ParseActorNotetags'],VisuMZ[_0x3a25e2(0x418)]=function(_0x12a7ab){const _0x1ea2a6=_0x3a25e2;VisuMZ[_0x1ea2a6(0x62c)]['ParseActorNotetags'][_0x1ea2a6(0x6d9)](this,_0x12a7ab);const _0x4aad3a=_0x12a7ab['note'];if(_0x4aad3a[_0x1ea2a6(0x175)](/<MAX LEVEL:[ ](\d+)>/i)){_0x12a7ab[_0x1ea2a6(0x56c)]=Number(RegExp['$1']);if(_0x12a7ab['maxLevel']===0x0)_0x12a7ab['maxLevel']=Number[_0x1ea2a6(0x171)];}_0x4aad3a['match'](/<INITIAL LEVEL:[ ](\d+)>/i)&&(_0x12a7ab['initialLevel']=Math[_0x1ea2a6(0x30b)](Number(RegExp['$1']),_0x12a7ab[_0x1ea2a6(0x56c)]));},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x6cb)]=VisuMZ[_0x3a25e2(0x6cb)],VisuMZ[_0x3a25e2(0x6cb)]=function(_0x2ea505){const _0xb16167=_0x3a25e2;VisuMZ[_0xb16167(0x62c)][_0xb16167(0x6cb)][_0xb16167(0x6d9)](this,_0x2ea505);if(_0x2ea505[_0xb16167(0x436)])for(const _0x1f9894 of _0x2ea505[_0xb16167(0x436)]){_0x1f9894['note'][_0xb16167(0x175)](/<LEARN AT LEVEL:[ ](\d+)>/i)&&(_0x1f9894[_0xb16167(0x502)]=Math[_0xb16167(0x4ae)](Number(RegExp['$1']),0x1));}},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x25d)]=VisuMZ[_0x3a25e2(0x25d)],VisuMZ[_0x3a25e2(0x25d)]=function(_0xc83060){const _0x4938dd=_0x3a25e2;VisuMZ['CoreEngine'][_0x4938dd(0x25d)][_0x4938dd(0x6d9)](this,_0xc83060),_0xc83060[_0x4938dd(0x502)]=0x1;const _0x47569c=_0xc83060[_0x4938dd(0x267)];if(_0x47569c[_0x4938dd(0x175)](/<LEVEL:[ ](\d+)>/i))_0xc83060[_0x4938dd(0x502)]=Number(RegExp['$1']);if(_0x47569c[_0x4938dd(0x175)](/<MAXHP:[ ](\d+)>/i))_0xc83060[_0x4938dd(0x4f5)][0x0]=Number(RegExp['$1']);if(_0x47569c[_0x4938dd(0x175)](/<MAXMP:[ ](\d+)>/i))_0xc83060[_0x4938dd(0x4f5)][0x1]=Number(RegExp['$1']);if(_0x47569c[_0x4938dd(0x175)](/<ATK:[ ](\d+)>/i))_0xc83060[_0x4938dd(0x4f5)][0x2]=Number(RegExp['$1']);if(_0x47569c[_0x4938dd(0x175)](/<DEF:[ ](\d+)>/i))_0xc83060[_0x4938dd(0x4f5)][0x3]=Number(RegExp['$1']);if(_0x47569c[_0x4938dd(0x175)](/<MAT:[ ](\d+)>/i))_0xc83060[_0x4938dd(0x4f5)][0x4]=Number(RegExp['$1']);if(_0x47569c[_0x4938dd(0x175)](/<MDF:[ ](\d+)>/i))_0xc83060[_0x4938dd(0x4f5)][0x5]=Number(RegExp['$1']);if(_0x47569c[_0x4938dd(0x175)](/<AGI:[ ](\d+)>/i))_0xc83060[_0x4938dd(0x4f5)][0x6]=Number(RegExp['$1']);if(_0x47569c[_0x4938dd(0x175)](/<LUK:[ ](\d+)>/i))_0xc83060[_0x4938dd(0x4f5)][0x7]=Number(RegExp['$1']);if(_0x47569c[_0x4938dd(0x175)](/<EXP:[ ](\d+)>/i))_0xc83060[_0x4938dd(0x44a)]=Number(RegExp['$1']);if(_0x47569c[_0x4938dd(0x175)](/<GOLD:[ ](\d+)>/i))_0xc83060[_0x4938dd(0x3d8)]=Number(RegExp['$1']);},VisuMZ[_0x3a25e2(0x62c)]['Graphics_defaultStretchMode']=Graphics[_0x3a25e2(0x3c2)],Graphics[_0x3a25e2(0x3c2)]=function(){const _0x57590c=_0x3a25e2;switch(VisuMZ[_0x57590c(0x62c)][_0x57590c(0x2f0)]['QoL'][_0x57590c(0x61b)]){case _0x57590c(0x487):return!![];case'normal':return![];default:return VisuMZ[_0x57590c(0x62c)][_0x57590c(0x1b4)][_0x57590c(0x6d9)](this);}},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x4a2)]=Graphics[_0x3a25e2(0x563)],Graphics['printError']=function(_0x1ee662,_0x1289b6,_0x5516a6=null){const _0x3157c5=_0x3a25e2;VisuMZ['CoreEngine'][_0x3157c5(0x4a2)][_0x3157c5(0x6d9)](this,_0x1ee662,_0x1289b6,_0x5516a6),VisuMZ[_0x3157c5(0x1dc)](![]);},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x38b)]=Graphics[_0x3a25e2(0x63c)],Graphics[_0x3a25e2(0x63c)]=function(_0x324364){const _0x16d3b5=_0x3a25e2;VisuMZ[_0x16d3b5(0x62c)][_0x16d3b5(0x38b)]['call'](this,_0x324364),this[_0x16d3b5(0x26c)](_0x324364);},Graphics['_centerElementCoreEngine']=function(_0xa83db3){const _0x100229=_0x3a25e2;VisuMZ[_0x100229(0x62c)]['Settings'][_0x100229(0x2b0)][_0x100229(0x6fd)]&&(_0xa83db3[_0x100229(0x60e)][_0x100229(0x57d)]=_0x100229(0x51d));VisuMZ[_0x100229(0x62c)][_0x100229(0x2f0)][_0x100229(0x2b0)]['PixelateImageRendering']&&(_0xa83db3[_0x100229(0x60e)][_0x100229(0x3c5)]=_0x100229(0x536));const _0x3fe608=Math[_0x100229(0x4ae)](0x0,Math[_0x100229(0x6f7)](_0xa83db3['width']*this[_0x100229(0x44f)])),_0x5c53a6=Math[_0x100229(0x4ae)](0x0,Math[_0x100229(0x6f7)](_0xa83db3[_0x100229(0x5fe)]*this[_0x100229(0x44f)]));_0xa83db3[_0x100229(0x60e)][_0x100229(0x286)]=_0x3fe608+'px',_0xa83db3[_0x100229(0x60e)][_0x100229(0x5fe)]=_0x5c53a6+'px';},Bitmap['prototype'][_0x3a25e2(0x4b8)]=function(){this['_customModified']=!![];},VisuMZ['CoreEngine'][_0x3a25e2(0x306)]=Sprite['prototype'][_0x3a25e2(0x1d3)],Sprite[_0x3a25e2(0x423)]['destroy']=function(){const _0x73c9d0=_0x3a25e2;VisuMZ[_0x73c9d0(0x62c)][_0x73c9d0(0x306)]['call'](this),this['destroyCoreEngineMarkedBitmaps']();},Sprite['prototype'][_0x3a25e2(0x28a)]=function(){const _0x46c48e=_0x3a25e2;if(!this[_0x46c48e(0x5bd)])return;if(!this[_0x46c48e(0x5bd)][_0x46c48e(0x150)])return;this[_0x46c48e(0x5bd)][_0x46c48e(0x31b)]&&!this['_bitmap'][_0x46c48e(0x31b)]['destroyed']&&this[_0x46c48e(0x5bd)]['destroy']();},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x1a0)]=Bitmap[_0x3a25e2(0x423)][_0x3a25e2(0x59c)],Bitmap['prototype'][_0x3a25e2(0x59c)]=function(_0xf159ee,_0x54206b){const _0xf2b381=_0x3a25e2;VisuMZ[_0xf2b381(0x62c)][_0xf2b381(0x1a0)][_0xf2b381(0x6d9)](this,_0xf159ee,_0x54206b),this[_0xf2b381(0x4b8)]();},VisuMZ[_0x3a25e2(0x62c)]['Bitmap_blt']=Bitmap[_0x3a25e2(0x423)]['blt'],Bitmap['prototype']['blt']=function(_0x44ccc8,_0x176f60,_0x55a829,_0x29c2c6,_0x5b05eb,_0x496856,_0x6df149,_0x3c43c0,_0x5568da){const _0x1d4c8e=_0x3a25e2;VisuMZ['CoreEngine']['Bitmap_blt'][_0x1d4c8e(0x6d9)](this,_0x44ccc8,_0x176f60,_0x55a829,_0x29c2c6,_0x5b05eb,_0x496856,_0x6df149,_0x3c43c0,_0x5568da),this['markCoreEngineModified']();},VisuMZ['CoreEngine'][_0x3a25e2(0x4ac)]=Bitmap[_0x3a25e2(0x423)][_0x3a25e2(0x49d)],Bitmap[_0x3a25e2(0x423)][_0x3a25e2(0x49d)]=function(_0xf5d07b,_0x14de95,_0x2b411b,_0x2dcfbb){const _0x17985b=_0x3a25e2;VisuMZ['CoreEngine'][_0x17985b(0x4ac)]['call'](this,_0xf5d07b,_0x14de95,_0x2b411b,_0x2dcfbb),this['markCoreEngineModified']();},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x1d4)]=Bitmap[_0x3a25e2(0x423)][_0x3a25e2(0x31f)],Bitmap[_0x3a25e2(0x423)][_0x3a25e2(0x31f)]=function(_0x3459e1,_0x144e72,_0x35506,_0x5bd620,_0x575323){const _0x150114=_0x3a25e2;VisuMZ[_0x150114(0x62c)][_0x150114(0x1d4)][_0x150114(0x6d9)](this,_0x3459e1,_0x144e72,_0x35506,_0x5bd620,_0x575323),this[_0x150114(0x4b8)]();},VisuMZ['CoreEngine'][_0x3a25e2(0x1f4)]=Bitmap[_0x3a25e2(0x423)]['strokeRect'],Bitmap[_0x3a25e2(0x423)][_0x3a25e2(0x206)]=function(_0x1de865,_0x5c6883,_0x14dd13,_0x17547e,_0x2f46b5){const _0xa7661a=_0x3a25e2;VisuMZ[_0xa7661a(0x62c)]['Bitmap_strokeRect']['call'](this,_0x1de865,_0x5c6883,_0x14dd13,_0x17547e,_0x2f46b5),this['markCoreEngineModified']();},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x580)]=Bitmap[_0x3a25e2(0x423)][_0x3a25e2(0x3a3)],Bitmap[_0x3a25e2(0x423)][_0x3a25e2(0x3a3)]=function(_0x2bcaab,_0x1b6a3b,_0x38d03b,_0x1b7c08,_0xe64c3e,_0x1d31c5,_0x13dc59){const _0x447967=_0x3a25e2;VisuMZ[_0x447967(0x62c)][_0x447967(0x580)]['call'](this,_0x2bcaab,_0x1b6a3b,_0x38d03b,_0x1b7c08,_0xe64c3e,_0x1d31c5,_0x13dc59),this[_0x447967(0x4b8)]();},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x692)]=Bitmap[_0x3a25e2(0x423)][_0x3a25e2(0x606)],Bitmap[_0x3a25e2(0x423)]['drawCircle']=function(_0x50637d,_0x2825ae,_0x14932c,_0x426e7d){const _0x3ef1de=_0x3a25e2;_0x50637d=Math['round'](_0x50637d),_0x2825ae=Math[_0x3ef1de(0x1a1)](_0x2825ae),_0x14932c=Math['round'](_0x14932c),VisuMZ[_0x3ef1de(0x62c)][_0x3ef1de(0x692)][_0x3ef1de(0x6d9)](this,_0x50637d,_0x2825ae,_0x14932c,_0x426e7d),this[_0x3ef1de(0x4b8)]();},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x17e)]=Bitmap[_0x3a25e2(0x423)]['measureTextWidth'],Bitmap['prototype'][_0x3a25e2(0x2f2)]=function(_0x247106){const _0xb3eae1=_0x3a25e2;return Math[_0xb3eae1(0x1a1)](VisuMZ['CoreEngine']['Bitmap_measureTextWidth'][_0xb3eae1(0x6d9)](this,_0x247106));},VisuMZ[_0x3a25e2(0x62c)]['Bitmap_drawText']=Bitmap[_0x3a25e2(0x423)][_0x3a25e2(0x180)],Bitmap[_0x3a25e2(0x423)][_0x3a25e2(0x180)]=function(_0x2baae8,_0x4bccb5,_0x59cdf9,_0x8f7862,_0x549887,_0x32010e){const _0x46092e=_0x3a25e2;_0x4bccb5=Math[_0x46092e(0x1a1)](_0x4bccb5),_0x59cdf9=Math[_0x46092e(0x1a1)](_0x59cdf9),_0x8f7862=Math[_0x46092e(0x1a1)](_0x8f7862),_0x549887=Math[_0x46092e(0x1a1)](_0x549887),VisuMZ['CoreEngine'][_0x46092e(0x6eb)][_0x46092e(0x6d9)](this,_0x2baae8,_0x4bccb5,_0x59cdf9,_0x8f7862,_0x549887,_0x32010e),this[_0x46092e(0x4b8)]();},VisuMZ[_0x3a25e2(0x62c)]['Bitmap_drawTextOutline']=Bitmap[_0x3a25e2(0x423)][_0x3a25e2(0x4bf)],Bitmap[_0x3a25e2(0x423)][_0x3a25e2(0x4bf)]=function(_0x5d9c24,_0x42f5c9,_0x5b31d5,_0x381634){const _0x37dfc0=_0x3a25e2;VisuMZ[_0x37dfc0(0x62c)][_0x37dfc0(0x2f0)]['QoL'][_0x37dfc0(0x65d)]?this['_drawTextShadow'](_0x5d9c24,_0x42f5c9,_0x5b31d5,_0x381634):VisuMZ[_0x37dfc0(0x62c)][_0x37dfc0(0x211)][_0x37dfc0(0x6d9)](this,_0x5d9c24,_0x42f5c9,_0x5b31d5,_0x381634);},Bitmap[_0x3a25e2(0x423)][_0x3a25e2(0x39b)]=function(_0x2a5d22,_0x2661fe,_0x570631,_0x59ea47){const _0x223387=_0x3a25e2,_0x47969c=this[_0x223387(0x6c7)];_0x47969c[_0x223387(0x545)]=this['outlineColor'],_0x47969c['fillText'](_0x2a5d22,_0x2661fe+0x2,_0x570631+0x2,_0x59ea47);},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x27b)]=Input['clear'],Input['clear']=function(){const _0x5d0703=_0x3a25e2;VisuMZ[_0x5d0703(0x62c)]['Input_clear'][_0x5d0703(0x6d9)](this),this[_0x5d0703(0x3e9)]=undefined,this['_inputSpecialKeyCode']=undefined,this[_0x5d0703(0x431)]=Input['keyRepeatWait'];},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x58b)]=Input[_0x3a25e2(0x6cd)],Input[_0x3a25e2(0x6cd)]=function(){const _0x4b8e9d=_0x3a25e2;VisuMZ[_0x4b8e9d(0x62c)][_0x4b8e9d(0x58b)]['call'](this);if(this['_gamepadWait'])this['_gamepadWait']--;},VisuMZ['CoreEngine']['Input_pollGamepads']=Input['_pollGamepads'],Input[_0x3a25e2(0x179)]=function(){const _0x43f1c6=_0x3a25e2;if(this[_0x43f1c6(0x431)])return;VisuMZ[_0x43f1c6(0x62c)][_0x43f1c6(0x54c)]['call'](this);},VisuMZ['CoreEngine'][_0x3a25e2(0x1ec)]=Input[_0x3a25e2(0x55a)],Input[_0x3a25e2(0x55a)]=function(){const _0x49819f=_0x3a25e2;VisuMZ[_0x49819f(0x62c)][_0x49819f(0x1ec)]['call'](this),document[_0x49819f(0x538)](_0x49819f(0x4d0),this[_0x49819f(0x302)]['bind'](this));},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x4c7)]=Input[_0x3a25e2(0x293)],Input[_0x3a25e2(0x293)]=function(_0x44ce78){const _0x3810b9=_0x3a25e2;this[_0x3810b9(0x35a)]=_0x44ce78[_0x3810b9(0x3ad)],VisuMZ[_0x3810b9(0x62c)][_0x3810b9(0x4c7)][_0x3810b9(0x6d9)](this,_0x44ce78);},Input[_0x3a25e2(0x302)]=function(_0x298add){const _0x5632ab=_0x3a25e2;this[_0x5632ab(0x54a)](_0x298add);},Input['_registerKeyInput']=function(_0x1fdd75){const _0x443122=_0x3a25e2;this[_0x443122(0x35a)]=_0x1fdd75[_0x443122(0x3ad)];let _0x3afa60=String[_0x443122(0x354)](_0x1fdd75[_0x443122(0x62d)]);this['_inputString']===undefined?this['_inputString']=_0x3afa60:this[_0x443122(0x3e9)]+=_0x3afa60;},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x27c)]=Input[_0x3a25e2(0x313)],Input['_shouldPreventDefault']=function(_0x148f76){const _0x53287d=_0x3a25e2;if(_0x148f76===0x8)return![];return VisuMZ[_0x53287d(0x62c)]['Input_shouldPreventDefault'][_0x53287d(0x6d9)](this,_0x148f76);},Input[_0x3a25e2(0x6cc)]=function(_0x51928d){const _0x177a0d=_0x3a25e2;if(_0x51928d[_0x177a0d(0x175)](/backspace/i))return this[_0x177a0d(0x35a)]===0x8;if(_0x51928d['match'](/enter/i))return this[_0x177a0d(0x35a)]===0xd;if(_0x51928d['match'](/escape/i))return this[_0x177a0d(0x35a)]===0x1b;},Input['isNumpadPressed']=function(){const _0x331671=_0x3a25e2;return[0x30,0x31,0x32,0x33,0x34,0x35,0x36,0x37,0x38,0x39][_0x331671(0x665)](this['_inputSpecialKeyCode']);},Input[_0x3a25e2(0x394)]=function(){const _0x362164=_0x3a25e2;return[0x25,0x26,0x27,0x28]['contains'](this[_0x362164(0x35a)]);},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x24a)]=Tilemap[_0x3a25e2(0x423)][_0x3a25e2(0x461)],Tilemap['prototype'][_0x3a25e2(0x461)]=function(_0x58b66d,_0x470459,_0x1d1947,_0x326072){const _0x2f82a7=_0x3a25e2;if($gameMap&&$gameMap['areTileShadowsHidden']())return;VisuMZ[_0x2f82a7(0x62c)]['Tilemap_addShadow'][_0x2f82a7(0x6d9)](this,_0x58b66d,_0x470459,_0x1d1947,_0x326072);},Tilemap[_0x3a25e2(0x402)][_0x3a25e2(0x423)]['_createInternalTextures']=function(){const _0x3905f8=_0x3a25e2;this[_0x3905f8(0x5d1)]();for(let _0x538861=0x0;_0x538861<Tilemap['Layer']['MAX_GL_TEXTURES'];_0x538861++){const _0x43e6ef=new PIXI['BaseTexture']();_0x43e6ef[_0x3905f8(0x4c6)](0x800,0x800),VisuMZ['CoreEngine'][_0x3905f8(0x2f0)][_0x3905f8(0x2b0)][_0x3905f8(0x504)]&&(_0x43e6ef[_0x3905f8(0x6bf)]=PIXI['SCALE_MODES']['NEAREST']),this[_0x3905f8(0x622)]['push'](_0x43e6ef);}},WindowLayer[_0x3a25e2(0x423)][_0x3a25e2(0x17a)]=function(){const _0x364525=_0x3a25e2;return SceneManager&&SceneManager[_0x364525(0x526)]?SceneManager['_scene'][_0x364525(0x446)]():!![];},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x492)]=WindowLayer['prototype'][_0x3a25e2(0x67e)],WindowLayer[_0x3a25e2(0x423)][_0x3a25e2(0x67e)]=function render(_0x864cca){const _0x164c27=_0x3a25e2;this['isMaskingEnabled']()?VisuMZ['CoreEngine']['WindowLayer_render'][_0x164c27(0x6d9)](this,_0x864cca):this['renderNoMask'](_0x864cca);},WindowLayer['prototype'][_0x3a25e2(0x55d)]=function render(_0x465ccb){const _0x30f9a8=_0x3a25e2;if(!this[_0x30f9a8(0x1a5)])return;const _0x5e2b2e=new PIXI[(_0x30f9a8(0x1db))](),_0x295e33=_0x465ccb['gl'],_0x473153=this[_0x30f9a8(0x4bd)][_0x30f9a8(0x16a)]();_0x465ccb['framebuffer'][_0x30f9a8(0x1a6)](),_0x5e2b2e[_0x30f9a8(0x3e6)]=this[_0x30f9a8(0x3e6)],_0x465ccb['batch'][_0x30f9a8(0x39c)](),_0x295e33[_0x30f9a8(0x249)](_0x295e33[_0x30f9a8(0x18b)]);while(_0x473153[_0x30f9a8(0x200)]>0x0){const _0x1a29f5=_0x473153[_0x30f9a8(0x6ba)]();_0x1a29f5[_0x30f9a8(0x246)]&&_0x1a29f5[_0x30f9a8(0x1a5)]&&_0x1a29f5[_0x30f9a8(0x410)]>0x0&&(_0x295e33['stencilFunc'](_0x295e33[_0x30f9a8(0x589)],0x0,~0x0),_0x295e33['stencilOp'](_0x295e33[_0x30f9a8(0x420)],_0x295e33[_0x30f9a8(0x420)],_0x295e33[_0x30f9a8(0x420)]),_0x1a29f5[_0x30f9a8(0x67e)](_0x465ccb),_0x465ccb[_0x30f9a8(0x546)][_0x30f9a8(0x39c)](),_0x5e2b2e[_0x30f9a8(0x493)](),_0x295e33[_0x30f9a8(0x6a7)](_0x295e33[_0x30f9a8(0x221)],0x1,~0x0),_0x295e33[_0x30f9a8(0x3b5)](_0x295e33['REPLACE'],_0x295e33['REPLACE'],_0x295e33['REPLACE']),_0x295e33['blendFunc'](_0x295e33['ZERO'],_0x295e33[_0x30f9a8(0x404)]),_0x5e2b2e[_0x30f9a8(0x67e)](_0x465ccb),_0x465ccb[_0x30f9a8(0x546)]['flush'](),_0x295e33['blendFunc'](_0x295e33[_0x30f9a8(0x404)],_0x295e33['ONE_MINUS_SRC_ALPHA']));}_0x295e33[_0x30f9a8(0x6ed)](_0x295e33[_0x30f9a8(0x18b)]),_0x295e33[_0x30f9a8(0x493)](_0x295e33['STENCIL_BUFFER_BIT']),_0x295e33[_0x30f9a8(0x5c1)](0x0),_0x465ccb[_0x30f9a8(0x546)][_0x30f9a8(0x39c)]();for(const _0x55a99d of this['children']){!_0x55a99d[_0x30f9a8(0x246)]&&_0x55a99d[_0x30f9a8(0x1a5)]&&_0x55a99d[_0x30f9a8(0x67e)](_0x465ccb);}_0x465ccb[_0x30f9a8(0x546)][_0x30f9a8(0x39c)]();},DataManager[_0x3a25e2(0x6bb)]=function(_0x530055){const _0x54ad90=_0x3a25e2;return this['isItem'](_0x530055)&&_0x530055[_0x54ad90(0x2fc)]===0x2;},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x43f)]=DataManager[_0x3a25e2(0x362)],DataManager['setupNewGame']=function(){const _0x1a3d28=_0x3a25e2;VisuMZ[_0x1a3d28(0x62c)][_0x1a3d28(0x43f)][_0x1a3d28(0x6d9)](this),this[_0x1a3d28(0x4d4)](),this[_0x1a3d28(0x389)]();},DataManager[_0x3a25e2(0x4d4)]=function(){const _0x32ca1a=_0x3a25e2;if($gameTemp['isPlaytest']()){const _0x2c8e29=VisuMZ[_0x32ca1a(0x62c)][_0x32ca1a(0x2f0)]['QoL'][_0x32ca1a(0x6f5)];if(_0x2c8e29>0x0)$gameTemp[_0x32ca1a(0x3d3)](_0x2c8e29);}},DataManager[_0x3a25e2(0x389)]=function(){const _0x34dace=_0x3a25e2,_0xbfc8bf=VisuMZ[_0x34dace(0x62c)]['Settings'][_0x34dace(0x2b0)][_0x34dace(0x6e4)]||0x0;if(_0xbfc8bf>0x0)$gameTemp[_0x34dace(0x3d3)](_0xbfc8bf);},TextManager[_0x3a25e2(0x48e)]=['','','',_0x3a25e2(0x4c3),'','',_0x3a25e2(0x2f9),'',_0x3a25e2(0x3f8),_0x3a25e2(0x181),'','',_0x3a25e2(0x6ea),'ENTER',_0x3a25e2(0x153),'',_0x3a25e2(0x58f),_0x3a25e2(0x4d3),_0x3a25e2(0x388),_0x3a25e2(0x655),_0x3a25e2(0x368),'KANA',_0x3a25e2(0x3bf),_0x3a25e2(0x276),'FINAL',_0x3a25e2(0x185),'',_0x3a25e2(0x4bc),'CONVERT',_0x3a25e2(0x3db),_0x3a25e2(0x22c),_0x3a25e2(0x2d9),_0x3a25e2(0x191),_0x3a25e2(0x524),'PGDN','END',_0x3a25e2(0x4cf),_0x3a25e2(0x5dd),'UP',_0x3a25e2(0x5b9),_0x3a25e2(0x670),_0x3a25e2(0x4fa),_0x3a25e2(0x144),_0x3a25e2(0x2e8),_0x3a25e2(0x2de),_0x3a25e2(0x296),_0x3a25e2(0x167),'','0','1','2','3','4','5','6','7','8','9',_0x3a25e2(0x348),_0x3a25e2(0x621),'LESS_THAN',_0x3a25e2(0x17c),_0x3a25e2(0x5f8),_0x3a25e2(0x41d),'AT','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',_0x3a25e2(0x1b7),'',_0x3a25e2(0x5ae),'',_0x3a25e2(0x30c),_0x3a25e2(0x2db),_0x3a25e2(0x5d9),_0x3a25e2(0x685),'NUMPAD3',_0x3a25e2(0x320),_0x3a25e2(0x162),'NUMPAD6',_0x3a25e2(0x5ed),_0x3a25e2(0x6cf),_0x3a25e2(0x146),_0x3a25e2(0x210),_0x3a25e2(0x4a9),_0x3a25e2(0x33e),_0x3a25e2(0x5d8),'DECIMAL',_0x3a25e2(0x618),'F1','F2','F3','F4','F5','F6','F7','F8','F9','F10',_0x3a25e2(0x215),'F12',_0x3a25e2(0x1ad),_0x3a25e2(0x58e),'F15',_0x3a25e2(0x6be),_0x3a25e2(0x40f),_0x3a25e2(0x356),_0x3a25e2(0x1c6),_0x3a25e2(0x3c3),_0x3a25e2(0x673),_0x3a25e2(0x334),_0x3a25e2(0x4b7),_0x3a25e2(0x5e0),'','','','','','','','',_0x3a25e2(0x496),_0x3a25e2(0x501),_0x3a25e2(0x680),'WIN_OEM_FJ_MASSHOU',_0x3a25e2(0x28e),_0x3a25e2(0x4b5),_0x3a25e2(0x352),'','','','','','','','','',_0x3a25e2(0x3c8),_0x3a25e2(0x527),_0x3a25e2(0x2d2),_0x3a25e2(0x176),'DOLLAR',_0x3a25e2(0x268),_0x3a25e2(0x6e0),_0x3a25e2(0x2e3),'OPEN_PAREN',_0x3a25e2(0x2a9),'ASTERISK','PLUS',_0x3a25e2(0x5f1),'HYPHEN_MINUS',_0x3a25e2(0x2da),'CLOSE_CURLY_BRACKET',_0x3a25e2(0x3e8),'','','','','VOLUME_MUTE',_0x3a25e2(0x5b6),'VOLUME_UP','','','SEMICOLON','EQUALS',_0x3a25e2(0x63e),_0x3a25e2(0x14e),_0x3a25e2(0x164),_0x3a25e2(0x4c2),_0x3a25e2(0x284),'','','','','','','','','','','','','','','','','','','','','','','','','','',_0x3a25e2(0x4d8),_0x3a25e2(0x3e7),_0x3a25e2(0x294),_0x3a25e2(0x6aa),'','META',_0x3a25e2(0x625),'',_0x3a25e2(0x4ce),_0x3a25e2(0x645),'',_0x3a25e2(0x511),'','',_0x3a25e2(0x301),_0x3a25e2(0x3b7),_0x3a25e2(0x1b0),_0x3a25e2(0x6b4),_0x3a25e2(0x579),_0x3a25e2(0x41b),_0x3a25e2(0x533),_0x3a25e2(0x4e5),_0x3a25e2(0x143),_0x3a25e2(0x1ff),_0x3a25e2(0x5db),_0x3a25e2(0x409),_0x3a25e2(0x23d),_0x3a25e2(0x6dc),'CRSEL',_0x3a25e2(0x488),_0x3a25e2(0x42f),_0x3a25e2(0x2b6),_0x3a25e2(0x480),'',_0x3a25e2(0x4aa),_0x3a25e2(0x440),''],TextManager[_0x3a25e2(0x17b)]=VisuMZ[_0x3a25e2(0x62c)]['Settings'][_0x3a25e2(0x151)][_0x3a25e2(0x646)],TextManager[_0x3a25e2(0x1c4)]=VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x2f0)][_0x3a25e2(0x151)][_0x3a25e2(0x2bb)],TextManager['buttonAssistSwitch']=VisuMZ['CoreEngine']['Settings'][_0x3a25e2(0x151)][_0x3a25e2(0x3ea)],VisuMZ['CoreEngine'][_0x3a25e2(0x4ca)]=TextManager[_0x3a25e2(0x54b)],TextManager['param']=function(_0x18d28e){const _0xdf063=_0x3a25e2;return typeof _0x18d28e==='number'?VisuMZ['CoreEngine'][_0xdf063(0x4ca)][_0xdf063(0x6d9)](this,_0x18d28e):this[_0xdf063(0x31a)](_0x18d28e);},TextManager['paramName']=function(_0x24bf8e){const _0x3139b1=_0x3a25e2;_0x24bf8e=String(_0x24bf8e||'')[_0x3139b1(0x699)]();const _0x3fed07=VisuMZ[_0x3139b1(0x62c)][_0x3139b1(0x2f0)][_0x3139b1(0x1bc)];if(_0x24bf8e===_0x3139b1(0x5cc))return $dataSystem[_0x3139b1(0x599)][_0x3139b1(0x4f5)][0x0];if(_0x24bf8e==='MAXMP')return $dataSystem[_0x3139b1(0x599)][_0x3139b1(0x4f5)][0x1];if(_0x24bf8e===_0x3139b1(0x34e))return $dataSystem['terms']['params'][0x2];if(_0x24bf8e===_0x3139b1(0x36c))return $dataSystem[_0x3139b1(0x599)][_0x3139b1(0x4f5)][0x3];if(_0x24bf8e==='MAT')return $dataSystem[_0x3139b1(0x599)][_0x3139b1(0x4f5)][0x4];if(_0x24bf8e===_0x3139b1(0x460))return $dataSystem[_0x3139b1(0x599)][_0x3139b1(0x4f5)][0x5];if(_0x24bf8e===_0x3139b1(0x1be))return $dataSystem['terms']['params'][0x6];if(_0x24bf8e==='LUK')return $dataSystem['terms'][_0x3139b1(0x4f5)][0x7];if(_0x24bf8e==='HIT')return _0x3fed07['XParamVocab0'];if(_0x24bf8e==='EVA')return _0x3fed07[_0x3139b1(0x343)];if(_0x24bf8e===_0x3139b1(0x596))return _0x3fed07[_0x3139b1(0x1d7)];if(_0x24bf8e===_0x3139b1(0x4d6))return _0x3fed07['XParamVocab3'];if(_0x24bf8e==='MEV')return _0x3fed07[_0x3139b1(0x703)];if(_0x24bf8e===_0x3139b1(0x2ac))return _0x3fed07['XParamVocab5'];if(_0x24bf8e===_0x3139b1(0x314))return _0x3fed07[_0x3139b1(0x234)];if(_0x24bf8e===_0x3139b1(0x568))return _0x3fed07[_0x3139b1(0x543)];if(_0x24bf8e===_0x3139b1(0x23f))return _0x3fed07[_0x3139b1(0x69b)];if(_0x24bf8e==='TRG')return _0x3fed07[_0x3139b1(0x68e)];if(_0x24bf8e===_0x3139b1(0x434))return _0x3fed07[_0x3139b1(0x36f)];if(_0x24bf8e===_0x3139b1(0x66d))return _0x3fed07[_0x3139b1(0x4b1)];if(_0x24bf8e===_0x3139b1(0x2a7))return _0x3fed07[_0x3139b1(0x24e)];if(_0x24bf8e===_0x3139b1(0x587))return _0x3fed07[_0x3139b1(0x54e)];if(_0x24bf8e===_0x3139b1(0x677))return _0x3fed07[_0x3139b1(0x2f4)];if(_0x24bf8e===_0x3139b1(0x18f))return _0x3fed07['SParamVocab5'];if(_0x24bf8e==='PDR')return _0x3fed07[_0x3139b1(0x341)];if(_0x24bf8e==='MDR')return _0x3fed07[_0x3139b1(0x27d)];if(_0x24bf8e==='FDR')return _0x3fed07[_0x3139b1(0x39a)];if(_0x24bf8e===_0x3139b1(0x2dd))return _0x3fed07[_0x3139b1(0x263)];if(VisuMZ[_0x3139b1(0x62c)]['CustomParamNames'][_0x24bf8e])return VisuMZ[_0x3139b1(0x62c)][_0x3139b1(0x44e)][_0x24bf8e];return'';},TextManager[_0x3a25e2(0x5a3)]=function(_0x3d1835){const _0x3a38a1=_0x3a25e2;if(_0x3d1835===_0x3a38a1(0x6f6))_0x3d1835=_0x3a38a1(0x42c);let _0x487497=[];for(let _0x111748 in Input[_0x3a38a1(0x34f)]){_0x111748=Number(_0x111748);if(_0x111748>=0x60&&_0x111748<=0x69)continue;if([0x12,0x20]['includes'](_0x111748))continue;_0x3d1835===Input[_0x3a38a1(0x34f)][_0x111748]&&_0x487497['push'](_0x111748);}for(let _0x2d7a68=0x0;_0x2d7a68<_0x487497[_0x3a38a1(0x200)];_0x2d7a68++){_0x487497[_0x2d7a68]=TextManager[_0x3a38a1(0x48e)][_0x487497[_0x2d7a68]];}return this[_0x3a38a1(0x6f2)](_0x487497);},TextManager['makeInputButtonString']=function(_0x415b35){const _0x2fb0d1=_0x3a25e2,_0x58e950=VisuMZ['CoreEngine'][_0x2fb0d1(0x2f0)]['ButtonAssist'],_0xe6831b=_0x58e950['KeyUnlisted'],_0x1686aa=_0x415b35['pop'](),_0x48fd11=_0x2fb0d1(0x4af)[_0x2fb0d1(0x534)](_0x1686aa);return _0x58e950[_0x48fd11]?_0x58e950[_0x48fd11]:_0xe6831b[_0x2fb0d1(0x534)](_0x1686aa);},TextManager[_0x3a25e2(0x252)]=function(_0x32f3f3,_0x340bf2){const _0x108871=_0x3a25e2,_0x1ad2b3=VisuMZ[_0x108871(0x62c)]['Settings'][_0x108871(0x151)],_0x50911d=_0x1ad2b3[_0x108871(0x662)],_0x1a8faf=this[_0x108871(0x5a3)](_0x32f3f3),_0x1f03bf=this[_0x108871(0x5a3)](_0x340bf2);return _0x50911d[_0x108871(0x534)](_0x1a8faf,_0x1f03bf);},VisuMZ['CoreEngine'][_0x3a25e2(0x65f)]=ColorManager[_0x3a25e2(0x651)],ColorManager[_0x3a25e2(0x651)]=function(){const _0x5f160e=_0x3a25e2;VisuMZ[_0x5f160e(0x62c)]['ColorManager_loadWindowskin']['call'](this),this['_colorCache']=this[_0x5f160e(0x32b)]||{};},ColorManager[_0x3a25e2(0x203)]=function(_0x25f2af,_0x3e6b4b){const _0x32d2b7=_0x3a25e2;return _0x3e6b4b=String(_0x3e6b4b),this['_colorCache']=this[_0x32d2b7(0x32b)]||{},_0x3e6b4b[_0x32d2b7(0x175)](/#(.*)/i)?this[_0x32d2b7(0x32b)][_0x25f2af]=_0x32d2b7(0x664)[_0x32d2b7(0x534)](String(RegExp['$1'])):this[_0x32d2b7(0x32b)][_0x25f2af]=this[_0x32d2b7(0x149)](Number(_0x3e6b4b)),this[_0x32d2b7(0x32b)][_0x25f2af];},ColorManager[_0x3a25e2(0x24c)]=function(_0x5bdf23){const _0x55f53a=_0x3a25e2;return _0x5bdf23=String(_0x5bdf23),_0x5bdf23['match'](/#(.*)/i)?_0x55f53a(0x664)[_0x55f53a(0x534)](String(RegExp['$1'])):this[_0x55f53a(0x149)](Number(_0x5bdf23));},ColorManager['clearCachedKeys']=function(){const _0x1859d3=_0x3a25e2;this[_0x1859d3(0x32b)]={};},ColorManager[_0x3a25e2(0x684)]=function(){const _0x266638=_0x3a25e2,_0x3d45bb=_0x266638(0x147);this[_0x266638(0x32b)]=this[_0x266638(0x32b)]||{};if(this[_0x266638(0x32b)][_0x3d45bb])return this['_colorCache'][_0x3d45bb];const _0x1d4147=VisuMZ['CoreEngine'][_0x266638(0x2f0)][_0x266638(0x3ee)][_0x266638(0x392)];return this['getColorDataFromPluginParameters'](_0x3d45bb,_0x1d4147);},ColorManager[_0x3a25e2(0x186)]=function(){const _0x2d6762=_0x3a25e2,_0x570aa6=_0x2d6762(0x2fd);this[_0x2d6762(0x32b)]=this[_0x2d6762(0x32b)]||{};if(this[_0x2d6762(0x32b)][_0x570aa6])return this['_colorCache'][_0x570aa6];const _0x26d8e6=VisuMZ[_0x2d6762(0x62c)][_0x2d6762(0x2f0)][_0x2d6762(0x3ee)][_0x2d6762(0x216)];return this[_0x2d6762(0x203)](_0x570aa6,_0x26d8e6);},ColorManager[_0x3a25e2(0x173)]=function(){const _0x5a8f7e=_0x3a25e2,_0xc14179=_0x5a8f7e(0x541);this['_colorCache']=this[_0x5a8f7e(0x32b)]||{};if(this[_0x5a8f7e(0x32b)][_0xc14179])return this[_0x5a8f7e(0x32b)][_0xc14179];const _0x5774a4=VisuMZ['CoreEngine'][_0x5a8f7e(0x2f0)][_0x5a8f7e(0x3ee)][_0x5a8f7e(0x2eb)];return this['getColorDataFromPluginParameters'](_0xc14179,_0x5774a4);},ColorManager['deathColor']=function(){const _0x342612=_0x3a25e2,_0x4ce346='_stored_deathColor';this[_0x342612(0x32b)]=this['_colorCache']||{};if(this[_0x342612(0x32b)][_0x4ce346])return this[_0x342612(0x32b)][_0x4ce346];const _0x456939=VisuMZ['CoreEngine'][_0x342612(0x2f0)][_0x342612(0x3ee)]['ColorDeath'];return this[_0x342612(0x203)](_0x4ce346,_0x456939);},ColorManager[_0x3a25e2(0x172)]=function(){const _0x1bcf27=_0x3a25e2,_0x16abc7='_stored_gaugeBackColor';this[_0x1bcf27(0x32b)]=this['_colorCache']||{};if(this['_colorCache'][_0x16abc7])return this[_0x1bcf27(0x32b)][_0x16abc7];const _0x2290eb=VisuMZ[_0x1bcf27(0x62c)]['Settings'][_0x1bcf27(0x3ee)][_0x1bcf27(0x1a9)];return this[_0x1bcf27(0x203)](_0x16abc7,_0x2290eb);},ColorManager['hpGaugeColor1']=function(){const _0x538dd8=_0x3a25e2,_0x2d0832=_0x538dd8(0x3c0);this[_0x538dd8(0x32b)]=this[_0x538dd8(0x32b)]||{};if(this[_0x538dd8(0x32b)][_0x2d0832])return this[_0x538dd8(0x32b)][_0x2d0832];const _0x62183=VisuMZ[_0x538dd8(0x62c)][_0x538dd8(0x2f0)][_0x538dd8(0x3ee)][_0x538dd8(0x187)];return this[_0x538dd8(0x203)](_0x2d0832,_0x62183);},ColorManager[_0x3a25e2(0x48b)]=function(){const _0x217a16=_0x3a25e2,_0x1a5c43=_0x217a16(0x4e1);this[_0x217a16(0x32b)]=this['_colorCache']||{};if(this[_0x217a16(0x32b)][_0x1a5c43])return this[_0x217a16(0x32b)][_0x1a5c43];const _0x1353e8=VisuMZ[_0x217a16(0x62c)][_0x217a16(0x2f0)][_0x217a16(0x3ee)]['ColorHPGauge2'];return this['getColorDataFromPluginParameters'](_0x1a5c43,_0x1353e8);},ColorManager[_0x3a25e2(0x43b)]=function(){const _0x3028de=_0x3a25e2,_0x2b9cd8='_stored_mpGaugeColor1';this[_0x3028de(0x32b)]=this[_0x3028de(0x32b)]||{};if(this[_0x3028de(0x32b)][_0x2b9cd8])return this[_0x3028de(0x32b)][_0x2b9cd8];const _0x59f4d3=VisuMZ['CoreEngine'][_0x3028de(0x2f0)][_0x3028de(0x3ee)][_0x3028de(0x2ba)];return this[_0x3028de(0x203)](_0x2b9cd8,_0x59f4d3);},ColorManager[_0x3a25e2(0x369)]=function(){const _0x3ec715=_0x3a25e2,_0x2ba675=_0x3ec715(0x704);this[_0x3ec715(0x32b)]=this[_0x3ec715(0x32b)]||{};if(this[_0x3ec715(0x32b)][_0x2ba675])return this[_0x3ec715(0x32b)][_0x2ba675];const _0x13dfd8=VisuMZ[_0x3ec715(0x62c)][_0x3ec715(0x2f0)][_0x3ec715(0x3ee)][_0x3ec715(0x50a)];return this[_0x3ec715(0x203)](_0x2ba675,_0x13dfd8);},ColorManager[_0x3a25e2(0x565)]=function(){const _0xa6fa26=_0x3a25e2,_0x2ef00a=_0xa6fa26(0x4f6);this['_colorCache']=this['_colorCache']||{};if(this[_0xa6fa26(0x32b)][_0x2ef00a])return this[_0xa6fa26(0x32b)][_0x2ef00a];const _0x373d92=VisuMZ[_0xa6fa26(0x62c)][_0xa6fa26(0x2f0)][_0xa6fa26(0x3ee)][_0xa6fa26(0x1b9)];return this['getColorDataFromPluginParameters'](_0x2ef00a,_0x373d92);},ColorManager[_0x3a25e2(0x3b6)]=function(){const _0x12e289=_0x3a25e2,_0x594162=_0x12e289(0x2ff);this[_0x12e289(0x32b)]=this[_0x12e289(0x32b)]||{};if(this[_0x12e289(0x32b)][_0x594162])return this[_0x12e289(0x32b)][_0x594162];const _0x9dd445=VisuMZ['CoreEngine'][_0x12e289(0x2f0)]['Color'][_0x12e289(0x361)];return this[_0x12e289(0x203)](_0x594162,_0x9dd445);},ColorManager[_0x3a25e2(0x4c1)]=function(){const _0x2eef76=_0x3a25e2,_0x220a44=_0x2eef76(0x623);this['_colorCache']=this['_colorCache']||{};if(this['_colorCache'][_0x220a44])return this[_0x2eef76(0x32b)][_0x220a44];const _0x2cb87c=VisuMZ[_0x2eef76(0x62c)][_0x2eef76(0x2f0)][_0x2eef76(0x3ee)]['ColorPowerDown'];return this[_0x2eef76(0x203)](_0x220a44,_0x2cb87c);},ColorManager[_0x3a25e2(0x16c)]=function(){const _0x368e4c=_0x3a25e2,_0x262ff1='_stored_ctGaugeColor1';this[_0x368e4c(0x32b)]=this['_colorCache']||{};if(this['_colorCache'][_0x262ff1])return this[_0x368e4c(0x32b)][_0x262ff1];const _0x32c1f1=VisuMZ[_0x368e4c(0x62c)][_0x368e4c(0x2f0)][_0x368e4c(0x3ee)][_0x368e4c(0x340)];return this['getColorDataFromPluginParameters'](_0x262ff1,_0x32c1f1);},ColorManager[_0x3a25e2(0x3c9)]=function(){const _0x1b8cc8=_0x3a25e2,_0x2fa6bb='_stored_ctGaugeColor2';this[_0x1b8cc8(0x32b)]=this[_0x1b8cc8(0x32b)]||{};if(this[_0x1b8cc8(0x32b)][_0x2fa6bb])return this[_0x1b8cc8(0x32b)][_0x2fa6bb];const _0x5a4e61=VisuMZ[_0x1b8cc8(0x62c)][_0x1b8cc8(0x2f0)]['Color'][_0x1b8cc8(0x2c9)];return this[_0x1b8cc8(0x203)](_0x2fa6bb,_0x5a4e61);},ColorManager[_0x3a25e2(0x67f)]=function(){const _0x216160=_0x3a25e2,_0x231fe8='_stored_tpGaugeColor1';this[_0x216160(0x32b)]=this[_0x216160(0x32b)]||{};if(this[_0x216160(0x32b)][_0x231fe8])return this[_0x216160(0x32b)][_0x231fe8];const _0x405434=VisuMZ[_0x216160(0x62c)][_0x216160(0x2f0)][_0x216160(0x3ee)][_0x216160(0x3df)];return this['getColorDataFromPluginParameters'](_0x231fe8,_0x405434);},ColorManager[_0x3a25e2(0x6c8)]=function(){const _0x2fb2f0=_0x3a25e2,_0x3d0d7b=_0x2fb2f0(0x2cb);this[_0x2fb2f0(0x32b)]=this[_0x2fb2f0(0x32b)]||{};if(this[_0x2fb2f0(0x32b)][_0x3d0d7b])return this['_colorCache'][_0x3d0d7b];const _0x1464a2=VisuMZ['CoreEngine']['Settings'][_0x2fb2f0(0x3ee)][_0x2fb2f0(0x675)];return this[_0x2fb2f0(0x203)](_0x3d0d7b,_0x1464a2);},ColorManager[_0x3a25e2(0x3f0)]=function(){const _0x5ced1a=_0x3a25e2,_0x40c7cc=_0x5ced1a(0x160);this[_0x5ced1a(0x32b)]=this[_0x5ced1a(0x32b)]||{};if(this['_colorCache'][_0x40c7cc])return this[_0x5ced1a(0x32b)][_0x40c7cc];const _0x45d7bb=VisuMZ['CoreEngine'][_0x5ced1a(0x2f0)][_0x5ced1a(0x3ee)][_0x5ced1a(0x158)];return this[_0x5ced1a(0x203)](_0x40c7cc,_0x45d7bb);},ColorManager['pendingColor']=function(){const _0x21ab0a=_0x3a25e2,_0x20b337=_0x21ab0a(0x2a3);this[_0x21ab0a(0x32b)]=this[_0x21ab0a(0x32b)]||{};if(this[_0x21ab0a(0x32b)][_0x20b337])return this[_0x21ab0a(0x32b)][_0x20b337];const _0x5889fe=VisuMZ[_0x21ab0a(0x62c)][_0x21ab0a(0x2f0)]['Color'][_0x21ab0a(0x158)];return this[_0x21ab0a(0x203)](_0x20b337,_0x5889fe);},ColorManager[_0x3a25e2(0x241)]=function(){const _0x5d5ab4=_0x3a25e2,_0x403223=_0x5d5ab4(0x494);this[_0x5d5ab4(0x32b)]=this[_0x5d5ab4(0x32b)]||{};if(this[_0x5d5ab4(0x32b)][_0x403223])return this['_colorCache'][_0x403223];const _0x358df3=VisuMZ['CoreEngine'][_0x5d5ab4(0x2f0)][_0x5d5ab4(0x3ee)]['ColorExpGauge1'];return this[_0x5d5ab4(0x203)](_0x403223,_0x358df3);},ColorManager['expGaugeColor2']=function(){const _0x2b669f=_0x3a25e2,_0x333315=_0x2b669f(0x3fb);this[_0x2b669f(0x32b)]=this[_0x2b669f(0x32b)]||{};if(this['_colorCache'][_0x333315])return this[_0x2b669f(0x32b)][_0x333315];const _0x319728=VisuMZ[_0x2b669f(0x62c)][_0x2b669f(0x2f0)][_0x2b669f(0x3ee)][_0x2b669f(0x13e)];return this[_0x2b669f(0x203)](_0x333315,_0x319728);},ColorManager[_0x3a25e2(0x696)]=function(){const _0x35bbdd=_0x3a25e2,_0x1bea8c=_0x35bbdd(0x15d);this[_0x35bbdd(0x32b)]=this[_0x35bbdd(0x32b)]||{};if(this[_0x35bbdd(0x32b)][_0x1bea8c])return this['_colorCache'][_0x1bea8c];const _0x5df646=VisuMZ[_0x35bbdd(0x62c)]['Settings'][_0x35bbdd(0x3ee)][_0x35bbdd(0x2bf)];return this[_0x35bbdd(0x203)](_0x1bea8c,_0x5df646);},ColorManager['maxLvGaugeColor2']=function(){const _0x471706=_0x3a25e2,_0x1a8fef=_0x471706(0x52a);this[_0x471706(0x32b)]=this[_0x471706(0x32b)]||{};if(this[_0x471706(0x32b)][_0x1a8fef])return this['_colorCache'][_0x1a8fef];const _0x2a7908=VisuMZ[_0x471706(0x62c)][_0x471706(0x2f0)][_0x471706(0x3ee)][_0x471706(0x1ca)];return this[_0x471706(0x203)](_0x1a8fef,_0x2a7908);},ColorManager[_0x3a25e2(0x6b5)]=function(_0x1e69d7){const _0x2029f2=_0x3a25e2;return VisuMZ[_0x2029f2(0x62c)]['Settings'][_0x2029f2(0x3ee)][_0x2029f2(0x547)][_0x2029f2(0x6d9)](this,_0x1e69d7);},ColorManager[_0x3a25e2(0x37d)]=function(_0x1651d3){const _0x57997b=_0x3a25e2;return VisuMZ[_0x57997b(0x62c)][_0x57997b(0x2f0)][_0x57997b(0x3ee)][_0x57997b(0x653)][_0x57997b(0x6d9)](this,_0x1651d3);},ColorManager[_0x3a25e2(0x1bb)]=function(_0x520de8){const _0x58c151=_0x3a25e2;return VisuMZ[_0x58c151(0x62c)][_0x58c151(0x2f0)][_0x58c151(0x3ee)][_0x58c151(0x36b)][_0x58c151(0x6d9)](this,_0x520de8);},ColorManager['paramchangeTextColor']=function(_0x5eda33){const _0x1fa56d=_0x3a25e2;return VisuMZ[_0x1fa56d(0x62c)][_0x1fa56d(0x2f0)]['Color'][_0x1fa56d(0x29a)][_0x1fa56d(0x6d9)](this,_0x5eda33);},ColorManager['damageColor']=function(_0x444439){const _0x330369=_0x3a25e2;return VisuMZ[_0x330369(0x62c)][_0x330369(0x2f0)][_0x330369(0x3ee)][_0x330369(0x1cd)]['call'](this,_0x444439);},ColorManager[_0x3a25e2(0x1e4)]=function(){const _0x3760c0=_0x3a25e2;return VisuMZ['CoreEngine'][_0x3760c0(0x2f0)][_0x3760c0(0x3ee)][_0x3760c0(0x363)];},ColorManager[_0x3a25e2(0x5e1)]=function(){const _0xa69758=_0x3a25e2;return VisuMZ[_0xa69758(0x62c)]['Settings']['Color'][_0xa69758(0x21f)]||'rgba(0,\x200,\x200,\x200.7)';},ColorManager[_0x3a25e2(0x253)]=function(){const _0x5807d8=_0x3a25e2;return VisuMZ['CoreEngine'][_0x5807d8(0x2f0)][_0x5807d8(0x3ee)][_0x5807d8(0x318)]||'rgba(0,\x200,\x200,\x201.0)';},ColorManager[_0x3a25e2(0x707)]=function(){return VisuMZ['CoreEngine']['Settings']['Color']['DimColor1'];},ColorManager['dimColor2']=function(){const _0x26de33=_0x3a25e2;return VisuMZ[_0x26de33(0x62c)][_0x26de33(0x2f0)][_0x26de33(0x3ee)][_0x26de33(0x255)];},ColorManager[_0x3a25e2(0x58a)]=function(){const _0xf5339a=_0x3a25e2;return VisuMZ[_0xf5339a(0x62c)][_0xf5339a(0x2f0)]['Color'][_0xf5339a(0x1f2)];},ColorManager[_0x3a25e2(0x48d)]=function(){const _0x53f497=_0x3a25e2;return VisuMZ[_0x53f497(0x62c)][_0x53f497(0x2f0)][_0x53f497(0x3ee)][_0x53f497(0x218)];},SceneManager[_0x3a25e2(0x22b)]=[],VisuMZ['CoreEngine'][_0x3a25e2(0x5aa)]=SceneManager[_0x3a25e2(0x14d)],SceneManager[_0x3a25e2(0x14d)]=function(){const _0x28c2e0=_0x3a25e2;VisuMZ['CoreEngine'][_0x28c2e0(0x5aa)][_0x28c2e0(0x6d9)](this),this[_0x28c2e0(0x605)]();},VisuMZ[_0x3a25e2(0x62c)]['SceneManager_onKeyDown']=SceneManager['onKeyDown'],SceneManager[_0x3a25e2(0x466)]=function(_0x2fb148){const _0x111e6f=_0x3a25e2;if($gameTemp)this['onKeyDownKeysF6F7'](_0x2fb148);VisuMZ[_0x111e6f(0x62c)][_0x111e6f(0x4f0)]['call'](this,_0x2fb148);},SceneManager[_0x3a25e2(0x2b5)]=function(_0x4c88d7){const _0x161a05=_0x3a25e2;if(!_0x4c88d7[_0x161a05(0x1cc)]&&!_0x4c88d7['altKey'])switch(_0x4c88d7[_0x161a05(0x3ad)]){case 0x75:this['playTestF6']();break;case 0x76:if(Input[_0x161a05(0x42e)](_0x161a05(0x6ba))||Input[_0x161a05(0x42e)](_0x161a05(0x3a2)))return;this[_0x161a05(0x530)]();break;}},SceneManager[_0x3a25e2(0x6a6)]=function(){const _0x293ae1=_0x3a25e2;if($gameTemp['isPlaytest']()&&VisuMZ[_0x293ae1(0x62c)][_0x293ae1(0x2f0)][_0x293ae1(0x2b0)]['F6key']){ConfigManager[_0x293ae1(0x37e)]!==0x0?(ConfigManager[_0x293ae1(0x48f)]=0x0,ConfigManager['bgsVolume']=0x0,ConfigManager['meVolume']=0x0,ConfigManager[_0x293ae1(0x37e)]=0x0):(ConfigManager[_0x293ae1(0x48f)]=0x64,ConfigManager[_0x293ae1(0x61a)]=0x64,ConfigManager[_0x293ae1(0x238)]=0x64,ConfigManager[_0x293ae1(0x37e)]=0x64);ConfigManager[_0x293ae1(0x5cd)]();if(this[_0x293ae1(0x526)]['constructor']===Scene_Options){if(this['_scene'][_0x293ae1(0x478)])this['_scene']['_optionsWindow'][_0x293ae1(0x373)]();if(this[_0x293ae1(0x526)][_0x293ae1(0x693)])this[_0x293ae1(0x526)][_0x293ae1(0x693)]['refresh']();}}},SceneManager['playTestF7']=function(){const _0x3bcadf=_0x3a25e2;$gameTemp[_0x3bcadf(0x1fe)]()&&VisuMZ[_0x3bcadf(0x62c)]['Settings'][_0x3bcadf(0x2b0)][_0x3bcadf(0x701)]&&($gameTemp[_0x3bcadf(0x1f1)]=!$gameTemp[_0x3bcadf(0x1f1)]);},SceneManager['initVisuMZCoreEngine']=function(){const _0x2d41c1=_0x3a25e2;this[_0x2d41c1(0x515)]=![],this[_0x2d41c1(0x681)]=!VisuMZ['CoreEngine'][_0x2d41c1(0x2f0)]['UI'][_0x2d41c1(0x4e0)];},SceneManager[_0x3a25e2(0x2e2)]=function(_0x4ec98e){const _0x54761e=_0x3a25e2;VisuMZ[_0x54761e(0x62c)][_0x54761e(0x2f0)]['UI']['SideButtons']&&(this[_0x54761e(0x515)]=_0x4ec98e);},SceneManager['isSideButtonLayout']=function(){const _0x65d3a4=_0x3a25e2;return this[_0x65d3a4(0x515)];},SceneManager[_0x3a25e2(0x2a1)]=function(){return this['_hideButtons'];},SceneManager[_0x3a25e2(0x414)]=function(){return this['areButtonsHidden']()||this['isSideButtonLayout']();},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x20c)]=SceneManager[_0x3a25e2(0x1d5)],SceneManager[_0x3a25e2(0x1d5)]=function(){const _0x2baac5=_0x3a25e2;return VisuMZ[_0x2baac5(0x62c)]['Settings'][_0x2baac5(0x2b0)]['RequireFocus']?VisuMZ[_0x2baac5(0x62c)][_0x2baac5(0x20c)][_0x2baac5(0x6d9)](this):!![];},SceneManager[_0x3a25e2(0x5f3)]=function(_0x2146d5){const _0xa9db2a=_0x3a25e2;if(_0x2146d5 instanceof Error)this[_0xa9db2a(0x282)](_0x2146d5);else _0x2146d5 instanceof Array&&_0x2146d5[0x0]===_0xa9db2a(0x1ee)?this[_0xa9db2a(0x2bd)](_0x2146d5):this[_0xa9db2a(0x275)](_0x2146d5);this['stop']();},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x29f)]=BattleManager[_0x3a25e2(0x25e)],BattleManager[_0x3a25e2(0x25e)]=function(){const _0x228ebb=_0x3a25e2;if(VisuMZ[_0x228ebb(0x62c)][_0x228ebb(0x2f0)][_0x228ebb(0x2b0)][_0x228ebb(0x3a5)])this[_0x228ebb(0x3fa)]();else return VisuMZ['CoreEngine']['BattleManager_processEscape'][_0x228ebb(0x6d9)](this);},BattleManager[_0x3a25e2(0x3fa)]=function(){const _0x464cde=_0x3a25e2;return $gameParty[_0x464cde(0x4c5)](),SoundManager['playEscape'](),this[_0x464cde(0x1d2)](),!![];},BattleManager[_0x3a25e2(0x576)]=function(){const _0x47da86=_0x3a25e2;return $gameSystem[_0x47da86(0x1fb)]()>=0x1;},BattleManager['isActiveTpb']=function(){const _0x304474=_0x3a25e2;return $gameSystem[_0x304474(0x1fb)]()===0x1;},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x381)]=Game_Temp[_0x3a25e2(0x423)][_0x3a25e2(0x14d)],Game_Temp[_0x3a25e2(0x423)][_0x3a25e2(0x14d)]=function(){const _0x52f99f=_0x3a25e2;VisuMZ[_0x52f99f(0x62c)][_0x52f99f(0x381)][_0x52f99f(0x6d9)](this),this['forceOutOfPlaytest'](),this[_0x52f99f(0x68d)]();},Game_Temp[_0x3a25e2(0x423)][_0x3a25e2(0x6b3)]=function(){const _0x56bb74=_0x3a25e2;VisuMZ[_0x56bb74(0x62c)][_0x56bb74(0x2f0)][_0x56bb74(0x2b0)][_0x56bb74(0x3de)]&&(this[_0x56bb74(0x57e)]=![]);},Game_Temp[_0x3a25e2(0x423)][_0x3a25e2(0x68d)]=function(){const _0x490ebc=_0x3a25e2;this[_0x490ebc(0x2d8)]=[];},Game_Temp['prototype'][_0x3a25e2(0x47f)]=function(_0x40a4f2,_0x543e84,_0xb8587f,_0x4a0ed6){const _0x45028c=_0x3a25e2;if(!this[_0x45028c(0x6a3)]())return;_0xb8587f=_0xb8587f||![],_0x4a0ed6=_0x4a0ed6||![];if($dataAnimations[_0x543e84]){const _0x5188e8={'targets':_0x40a4f2,'animationId':_0x543e84,'mirror':_0xb8587f,'mute':_0x4a0ed6};this[_0x45028c(0x2d8)][_0x45028c(0x3a6)](_0x5188e8);for(const _0x47929d of _0x40a4f2){_0x47929d[_0x45028c(0x4e4)]&&_0x47929d[_0x45028c(0x4e4)]();}}},Game_Temp[_0x3a25e2(0x423)]['showFauxAnimations']=function(){return!![];},Game_Temp[_0x3a25e2(0x423)][_0x3a25e2(0x6c1)]=function(){const _0x3dfcb2=_0x3a25e2;return this[_0x3dfcb2(0x2d8)][_0x3dfcb2(0x6ba)]();},Game_Temp[_0x3a25e2(0x423)][_0x3a25e2(0x266)]=function(_0x1001ad){const _0x13b4c8=_0x3a25e2;this[_0x13b4c8(0x1a4)]=_0x1001ad;},Game_Temp[_0x3a25e2(0x423)][_0x3a25e2(0x1e2)]=function(){return this['_lastPluginCommandInterpreter'];},Game_Temp[_0x3a25e2(0x423)][_0x3a25e2(0x4ed)]=function(){const _0x4aee1b=_0x3a25e2;this[_0x4aee1b(0x4a4)]=undefined,this[_0x4aee1b(0x506)]=undefined;},Game_Temp['prototype'][_0x3a25e2(0x46c)]=function(_0x191835){const _0x545e27=_0x3a25e2;$gameMap&&$dataMap&&$dataMap['note']&&this['parseForcedGameTroopSettingsCoreEngine']($dataMap[_0x545e27(0x267)]);const _0x22f4e2=$dataTroops[_0x191835];_0x22f4e2&&this[_0x545e27(0x613)](_0x22f4e2[_0x545e27(0x4c4)]);},Game_Temp[_0x3a25e2(0x423)][_0x3a25e2(0x613)]=function(_0xdd4117){const _0x60a06f=_0x3a25e2;if(!_0xdd4117)return;if(_0xdd4117['match'](/<(?:FRONTVIEW|FRONT VIEW|FV)>/i))this[_0x60a06f(0x4a4)]='FV';else{if(_0xdd4117['match'](/<(?:SIDEVIEW|SIDE VIEW|SV)>/i))this[_0x60a06f(0x4a4)]='SV';else{if(_0xdd4117['match'](/<(?:BATTLEVIEW|BATTLE VIEW):[ ](.*)>/i)){const _0x48f9f7=String(RegExp['$1']);if(_0x48f9f7['match'](/(?:FRONTVIEW|FRONT VIEW|FV)/i))this['_forcedTroopView']='FV';else _0x48f9f7['match'](/(?:SIDEVIEW|SIDE VIEW|SV)/i)&&(this[_0x60a06f(0x4a4)]='SV');}}}if(_0xdd4117[_0x60a06f(0x175)](/<(?:DTB)>/i))this[_0x60a06f(0x506)]=0x0;else{if(_0xdd4117['match'](/<(?:TPB|ATB)[ ]ACTIVE>/i))this[_0x60a06f(0x506)]=0x1;else{if(_0xdd4117[_0x60a06f(0x175)](/<(?:TPB|ATB)[ ]WAIT>/i))this['_forcedBattleSys']=0x2;else{if(_0xdd4117[_0x60a06f(0x175)](/<(?:CTB)>/i))Imported[_0x60a06f(0x6b0)]&&(this[_0x60a06f(0x506)]=_0x60a06f(0x4b3));else{if(_0xdd4117['match'](/<(?:STB)>/i))Imported[_0x60a06f(0x261)]&&(this[_0x60a06f(0x506)]='STB');else{if(_0xdd4117['match'](/<(?:BTB)>/i))Imported['VisuMZ_2_BattleSystemBTB']&&(this['_forcedBattleSys']=_0x60a06f(0x578));else{if(_0xdd4117[_0x60a06f(0x175)](/<(?:FTB)>/i))Imported[_0x60a06f(0x1bd)]&&(this[_0x60a06f(0x506)]=_0x60a06f(0x69a));else{if(_0xdd4117[_0x60a06f(0x175)](/<(?:BATTLEVIEW|BATTLE VIEW):[ ](.*)>/i)){const _0x438bec=String(RegExp['$1']);if(_0x438bec[_0x60a06f(0x175)](/DTB/i))this[_0x60a06f(0x506)]=0x0;else{if(_0x438bec['match'](/(?:TPB|ATB)[ ]ACTIVE/i))this['_forcedBattleSys']=0x1;else{if(_0x438bec[_0x60a06f(0x175)](/(?:TPB|ATB)[ ]WAIT/i))this[_0x60a06f(0x506)]=0x2;else{if(_0x438bec[_0x60a06f(0x175)](/CTB/i))Imported[_0x60a06f(0x6b0)]&&(this[_0x60a06f(0x506)]=_0x60a06f(0x4b3));else{if(_0x438bec['match'](/STB/i))Imported[_0x60a06f(0x261)]&&(this[_0x60a06f(0x506)]=_0x60a06f(0x522));else{if(_0x438bec[_0x60a06f(0x175)](/BTB/i))Imported[_0x60a06f(0x5b8)]&&(this['_forcedBattleSys']=_0x60a06f(0x578));else _0x438bec[_0x60a06f(0x175)](/FTB/i)&&(Imported[_0x60a06f(0x1bd)]&&(this['_forcedBattleSys']='FTB'));}}}}}}}}}}}}}},VisuMZ[_0x3a25e2(0x62c)]['Game_System_initialize']=Game_System[_0x3a25e2(0x423)][_0x3a25e2(0x14d)],Game_System[_0x3a25e2(0x423)][_0x3a25e2(0x14d)]=function(){const _0x3b97ae=_0x3a25e2;VisuMZ['CoreEngine'][_0x3b97ae(0x3f7)][_0x3b97ae(0x6d9)](this),this[_0x3b97ae(0x53e)]();},Game_System['prototype'][_0x3a25e2(0x53e)]=function(){const _0x2c5e89=_0x3a25e2;this['_CoreEngineSettings']={'SideView':$dataSystem[_0x2c5e89(0x339)],'BattleSystem':this[_0x2c5e89(0x4fc)](),'FontSize':$dataSystem['advanced'][_0x2c5e89(0x346)],'Padding':0xc};},Game_System[_0x3a25e2(0x423)][_0x3a25e2(0x307)]=function(){const _0x35f4a0=_0x3a25e2;if($gameTemp[_0x35f4a0(0x4a4)]==='SV')return!![];else{if($gameTemp['_forcedTroopView']==='FV')return![];}if(this[_0x35f4a0(0x231)]===undefined)this[_0x35f4a0(0x53e)]();if(this[_0x35f4a0(0x231)][_0x35f4a0(0x367)]===undefined)this[_0x35f4a0(0x53e)]();return this[_0x35f4a0(0x231)]['SideView'];},Game_System['prototype'][_0x3a25e2(0x56e)]=function(_0x4c557e){const _0x4771a8=_0x3a25e2;if(this['_CoreEngineSettings']===undefined)this[_0x4771a8(0x53e)]();if(this[_0x4771a8(0x231)][_0x4771a8(0x367)]===undefined)this['initCoreEngine']();this[_0x4771a8(0x231)][_0x4771a8(0x367)]=_0x4c557e;},Game_System[_0x3a25e2(0x423)][_0x3a25e2(0x269)]=function(){const _0x519663=_0x3a25e2;if(this[_0x519663(0x231)]===undefined)this[_0x519663(0x53e)]();this[_0x519663(0x231)][_0x519663(0x2f8)]=this[_0x519663(0x4fc)]();},Game_System[_0x3a25e2(0x423)]['initialBattleSystem']=function(){const _0x46b78b=_0x3a25e2,_0x4b83d0=(VisuMZ['CoreEngine'][_0x46b78b(0x2f0)][_0x46b78b(0x2f8)]||_0x46b78b(0x280))[_0x46b78b(0x699)]()[_0x46b78b(0x430)]();return VisuMZ[_0x46b78b(0x62c)][_0x46b78b(0x23c)](_0x4b83d0);},Game_System[_0x3a25e2(0x423)][_0x3a25e2(0x1fb)]=function(){const _0x3da38e=_0x3a25e2;if($gameTemp[_0x3da38e(0x506)]!==undefined)return $gameTemp[_0x3da38e(0x506)];if(this[_0x3da38e(0x231)]===undefined)this[_0x3da38e(0x53e)]();if(this['_CoreEngineSettings'][_0x3da38e(0x2f8)]===undefined)this['resetBattleSystem']();return this[_0x3da38e(0x231)][_0x3da38e(0x2f8)];},Game_System['prototype'][_0x3a25e2(0x4a3)]=function(_0x1a23d4){const _0x48c458=_0x3a25e2;if(this[_0x48c458(0x231)]===undefined)this[_0x48c458(0x53e)]();if(this[_0x48c458(0x231)][_0x48c458(0x2f8)]===undefined)this[_0x48c458(0x269)]();this[_0x48c458(0x231)][_0x48c458(0x2f8)]=_0x1a23d4;},Game_System[_0x3a25e2(0x423)][_0x3a25e2(0x3a7)]=function(){const _0x35ea6b=_0x3a25e2;if(this[_0x35ea6b(0x231)]===undefined)this[_0x35ea6b(0x53e)]();if(this[_0x35ea6b(0x231)][_0x35ea6b(0x497)]===undefined)this['initCoreEngine']();return this[_0x35ea6b(0x231)]['FontSize'];},Game_System[_0x3a25e2(0x423)][_0x3a25e2(0x38e)]=function(_0x3084a4){const _0x5a8854=_0x3a25e2;if(this[_0x5a8854(0x231)]===undefined)this[_0x5a8854(0x53e)]();if(this[_0x5a8854(0x231)]['TimeProgress']===undefined)this['initCoreEngine']();this[_0x5a8854(0x231)]['FontSize']=_0x3084a4;},Game_System['prototype'][_0x3a25e2(0x390)]=function(){const _0xbaf400=_0x3a25e2;if(this[_0xbaf400(0x231)]===undefined)this[_0xbaf400(0x53e)]();if(this[_0xbaf400(0x231)][_0xbaf400(0x345)]===undefined)this[_0xbaf400(0x53e)]();return this[_0xbaf400(0x231)][_0xbaf400(0x345)];},Game_System[_0x3a25e2(0x423)][_0x3a25e2(0x608)]=function(_0x1836a8){const _0x49aa9b=_0x3a25e2;if(this[_0x49aa9b(0x231)]===undefined)this[_0x49aa9b(0x53e)]();if(this[_0x49aa9b(0x231)]['TimeProgress']===undefined)this[_0x49aa9b(0x53e)]();this['_CoreEngineSettings'][_0x49aa9b(0x345)]=_0x1836a8;},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x586)]=Game_Screen[_0x3a25e2(0x423)]['initialize'],Game_Screen[_0x3a25e2(0x423)][_0x3a25e2(0x14d)]=function(){const _0x1664a8=_0x3a25e2;VisuMZ[_0x1664a8(0x62c)][_0x1664a8(0x586)][_0x1664a8(0x6d9)](this),this[_0x1664a8(0x386)]();},Game_Screen[_0x3a25e2(0x423)][_0x3a25e2(0x386)]=function(){const _0x545ec4=_0x3a25e2,_0x359d1c=VisuMZ[_0x545ec4(0x62c)][_0x545ec4(0x2f0)][_0x545ec4(0x29c)];this[_0x545ec4(0x6fa)]=_0x359d1c?.[_0x545ec4(0x250)]||_0x545ec4(0x56f);},Game_Screen[_0x3a25e2(0x423)][_0x3a25e2(0x5f6)]=function(){const _0x5035ac=_0x3a25e2;if(this[_0x5035ac(0x6fa)]===undefined)this[_0x5035ac(0x386)]();return this['_coreEngineShakeStyle'];},Game_Screen[_0x3a25e2(0x423)][_0x3a25e2(0x5fa)]=function(_0x1ba081){const _0x584745=_0x3a25e2;if(this[_0x584745(0x6fa)]===undefined)this['initCoreEngineScreenShake']();this[_0x584745(0x6fa)]=_0x1ba081[_0x584745(0x316)]()[_0x584745(0x430)]();},Game_Picture['prototype'][_0x3a25e2(0x489)]=function(){const _0x114c0e=_0x3a25e2;if($gameParty[_0x114c0e(0x42b)]())return![];return this[_0x114c0e(0x4c4)]()&&this[_0x114c0e(0x4c4)]()[_0x114c0e(0x39d)](0x0)==='!';},VisuMZ[_0x3a25e2(0x62c)]['Game_Picture_x']=Game_Picture[_0x3a25e2(0x423)]['x'],Game_Picture['prototype']['x']=function(){const _0x2d1e95=_0x3a25e2;return this[_0x2d1e95(0x489)]()?this[_0x2d1e95(0x437)]():VisuMZ[_0x2d1e95(0x62c)][_0x2d1e95(0x66c)][_0x2d1e95(0x6d9)](this);},Game_Picture[_0x3a25e2(0x423)][_0x3a25e2(0x437)]=function(){const _0x3567a9=_0x3a25e2,_0x5d0be3=$gameMap['displayX']()*$gameMap[_0x3567a9(0x1f9)]();return this['_x']-_0x5d0be3;},VisuMZ[_0x3a25e2(0x62c)]['Game_Picture_y']=Game_Picture[_0x3a25e2(0x423)]['y'],Game_Picture['prototype']['y']=function(){const _0xd92d5f=_0x3a25e2;return this[_0xd92d5f(0x489)]()?this['yScrollLinkedOffset']():VisuMZ[_0xd92d5f(0x62c)][_0xd92d5f(0x64d)][_0xd92d5f(0x6d9)](this);},Game_Picture[_0x3a25e2(0x423)][_0x3a25e2(0x14c)]=function(){const _0x4abffd=_0x3a25e2,_0x24a51e=$gameMap[_0x4abffd(0x448)]()*$gameMap['tileHeight']();return this['_y']-_0x24a51e;},Game_Picture[_0x3a25e2(0x423)][_0x3a25e2(0x652)]=function(_0x3bce12){const _0x2ded4f=_0x3a25e2;this[_0x2ded4f(0x650)]=_0x3bce12;},VisuMZ[_0x3a25e2(0x62c)]['Game_Picture_calcEasing']=Game_Picture[_0x3a25e2(0x423)]['calcEasing'],Game_Picture[_0x3a25e2(0x423)][_0x3a25e2(0x609)]=function(_0x1c93b2){const _0x15b23d=_0x3a25e2;return this['_coreEasingType']=this[_0x15b23d(0x650)]||0x0,[0x0,0x1,0x2,0x3]['includes'](this['_coreEasingType'])?VisuMZ[_0x15b23d(0x62c)][_0x15b23d(0x3f2)]['call'](this,_0x1c93b2):VisuMZ[_0x15b23d(0x41c)](_0x1c93b2,this[_0x15b23d(0x650)]);},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x60d)]=Game_Action[_0x3a25e2(0x423)][_0x3a25e2(0x70b)],Game_Action[_0x3a25e2(0x423)][_0x3a25e2(0x70b)]=function(_0x41d301){const _0x301417=_0x3a25e2;return VisuMZ[_0x301417(0x62c)][_0x301417(0x2f0)][_0x301417(0x2b0)][_0x301417(0x40b)]?this[_0x301417(0x6e7)](_0x41d301):VisuMZ[_0x301417(0x62c)][_0x301417(0x60d)][_0x301417(0x6d9)](this,_0x41d301);},Game_Action['prototype'][_0x3a25e2(0x6e7)]=function(_0x33cf63){const _0x1da97b=_0x3a25e2,_0x474f7e=this[_0x1da97b(0x2fa)](_0x33cf63),_0x55c2a3=this[_0x1da97b(0x5e9)](_0x33cf63),_0x28c202=this[_0x1da97b(0x5d6)](_0x33cf63);return _0x474f7e*(_0x55c2a3-_0x28c202);},VisuMZ[_0x3a25e2(0x62c)]['Game_Action_itemEva']=Game_Action[_0x3a25e2(0x423)][_0x3a25e2(0x472)],Game_Action[_0x3a25e2(0x423)][_0x3a25e2(0x472)]=function(_0x2e3530){const _0x433f4c=_0x3a25e2;return VisuMZ[_0x433f4c(0x62c)][_0x433f4c(0x2f0)][_0x433f4c(0x2b0)][_0x433f4c(0x40b)]?0x0:VisuMZ[_0x433f4c(0x62c)][_0x433f4c(0x40e)][_0x433f4c(0x6d9)](this,_0x2e3530);},Game_Action[_0x3a25e2(0x423)][_0x3a25e2(0x2fa)]=function(_0x3061d5){const _0xe3b55c=_0x3a25e2;return this[_0xe3b55c(0x58d)]()[_0xe3b55c(0x1ba)]*0.01;},Game_Action[_0x3a25e2(0x423)]['subjectHitRate']=function(_0x131b9b){const _0x574453=_0x3a25e2;if(VisuMZ[_0x574453(0x62c)][_0x574453(0x2f0)][_0x574453(0x2b0)]['AccuracyBoost']&&this[_0x574453(0x190)]())return 0x1;return this['isPhysical']()?VisuMZ[_0x574453(0x62c)][_0x574453(0x2f0)]['QoL'][_0x574453(0x700)]&&this[_0x574453(0x416)]()[_0x574453(0x183)]()?this[_0x574453(0x416)]()['hit']+0.05:this[_0x574453(0x416)]()[_0x574453(0x3fe)]:0x1;},Game_Action[_0x3a25e2(0x423)][_0x3a25e2(0x5d6)]=function(_0x3e35bc){const _0x4f3bdb=_0x3a25e2;if(this[_0x4f3bdb(0x416)]()['isActor']()===_0x3e35bc['isActor']())return 0x0;if(this[_0x4f3bdb(0x3a8)]())return VisuMZ[_0x4f3bdb(0x62c)]['Settings'][_0x4f3bdb(0x2b0)]['AccuracyBoost']&&_0x3e35bc[_0x4f3bdb(0x521)]()?_0x3e35bc[_0x4f3bdb(0x168)]-0.05:_0x3e35bc[_0x4f3bdb(0x168)];else return this[_0x4f3bdb(0x59f)]()?_0x3e35bc[_0x4f3bdb(0x49c)]:0x0;},VisuMZ[_0x3a25e2(0x62c)]['Game_Action_updateLastTarget']=Game_Action[_0x3a25e2(0x423)][_0x3a25e2(0x1a8)],Game_Action[_0x3a25e2(0x423)][_0x3a25e2(0x1a8)]=function(_0x1c8347){const _0x3a95bd=_0x3a25e2;VisuMZ[_0x3a95bd(0x62c)][_0x3a95bd(0x44b)]['call'](this,_0x1c8347);if(VisuMZ[_0x3a95bd(0x62c)][_0x3a95bd(0x2f0)][_0x3a95bd(0x2b0)][_0x3a95bd(0x40b)])return;const _0x12af72=_0x1c8347[_0x3a95bd(0x28d)]();_0x12af72[_0x3a95bd(0x2a6)]&&(0x1-this[_0x3a95bd(0x472)](_0x1c8347)>this['itemHit'](_0x1c8347)&&(_0x12af72[_0x3a95bd(0x2a6)]=![],_0x12af72[_0x3a95bd(0x63d)]=!![]));},VisuMZ[_0x3a25e2(0x62c)]['Game_BattlerBase_initMembers']=Game_BattlerBase[_0x3a25e2(0x423)]['initMembers'],Game_BattlerBase[_0x3a25e2(0x423)]['initMembers']=function(){const _0x477718=_0x3a25e2;this[_0x477718(0x2d5)]={},VisuMZ[_0x477718(0x62c)][_0x477718(0x159)][_0x477718(0x6d9)](this);},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x569)]=Game_BattlerBase['prototype'][_0x3a25e2(0x373)],Game_BattlerBase[_0x3a25e2(0x423)][_0x3a25e2(0x373)]=function(){const _0x47d0ce=_0x3a25e2;this[_0x47d0ce(0x2d5)]={},VisuMZ[_0x47d0ce(0x62c)][_0x47d0ce(0x569)][_0x47d0ce(0x6d9)](this);},Game_BattlerBase[_0x3a25e2(0x423)][_0x3a25e2(0x148)]=function(_0x1773b1){const _0x35dd75=_0x3a25e2;return this[_0x35dd75(0x2d5)]=this['_cache']||{},this[_0x35dd75(0x2d5)][_0x1773b1]!==undefined;},Game_BattlerBase[_0x3a25e2(0x423)][_0x3a25e2(0x4e6)]=function(_0x1f76f0){const _0x57ef90=_0x3a25e2,_0x178ba0=(_0x3f8faa,_0x3f3b3c)=>{const _0x3ac50f=_0xeaec;if(!_0x3f3b3c)return _0x3f8faa;if(_0x3f3b3c[_0x3ac50f(0x267)][_0x3ac50f(0x175)](VisuMZ['CoreEngine'][_0x3ac50f(0x45d)]['paramPlus'][_0x1f76f0])){var _0x51fdd2=Number(RegExp['$1']);_0x3f8faa+=_0x51fdd2;}if(_0x3f3b3c['note'][_0x3ac50f(0x175)](VisuMZ[_0x3ac50f(0x62c)][_0x3ac50f(0x45d)][_0x3ac50f(0x413)][_0x1f76f0])){var _0x3f218d=String(RegExp['$1']);try{_0x3f8faa+=eval(_0x3f218d);}catch(_0x313498){if($gameTemp['isPlaytest']())console[_0x3ac50f(0x335)](_0x313498);}}return _0x3f8faa;};return this[_0x57ef90(0x1f0)]()['reduce'](_0x178ba0,this['_paramPlus'][_0x1f76f0]);},Game_BattlerBase[_0x3a25e2(0x423)]['paramMax']=function(_0x242832){const _0x342d1d=_0x3a25e2;var _0x245421=_0x342d1d(0x65a)+(this[_0x342d1d(0x183)]()?_0x342d1d(0x40a):'Enemy')+_0x342d1d(0x2cf)+_0x242832;if(this[_0x342d1d(0x148)](_0x245421))return this[_0x342d1d(0x2d5)][_0x245421];this[_0x342d1d(0x2d5)][_0x245421]=eval(VisuMZ[_0x342d1d(0x62c)][_0x342d1d(0x2f0)][_0x342d1d(0x1bc)][_0x245421]);const _0x59a0c4=(_0x18b9b0,_0xec27af)=>{const _0x4bfe0c=_0x342d1d;if(!_0xec27af)return _0x18b9b0;if(_0xec27af[_0x4bfe0c(0x267)][_0x4bfe0c(0x175)](VisuMZ['CoreEngine'][_0x4bfe0c(0x45d)][_0x4bfe0c(0x4a5)][_0x242832])){var _0x3c6443=Number(RegExp['$1']);if(_0x3c6443===0x0)_0x3c6443=Number['MAX_SAFE_INTEGER'];_0x18b9b0=Math[_0x4bfe0c(0x4ae)](_0x18b9b0,_0x3c6443);}if(_0xec27af[_0x4bfe0c(0x267)][_0x4bfe0c(0x175)](VisuMZ[_0x4bfe0c(0x62c)][_0x4bfe0c(0x45d)][_0x4bfe0c(0x451)][_0x242832])){var _0x3e8174=String(RegExp['$1']);try{_0x18b9b0=Math[_0x4bfe0c(0x4ae)](_0x18b9b0,Number(eval(_0x3e8174)));}catch(_0x105906){if($gameTemp[_0x4bfe0c(0x1fe)]())console[_0x4bfe0c(0x335)](_0x105906);}}return _0x18b9b0;};if(this[_0x342d1d(0x2d5)][_0x245421]===0x0)this[_0x342d1d(0x2d5)][_0x245421]=Number[_0x342d1d(0x171)];return this[_0x342d1d(0x2d5)][_0x245421]=this['traitObjects']()[_0x342d1d(0x1e5)](_0x59a0c4,this[_0x342d1d(0x2d5)][_0x245421]),this[_0x342d1d(0x2d5)][_0x245421];},Game_BattlerBase[_0x3a25e2(0x423)][_0x3a25e2(0x305)]=function(_0x11a1c9){const _0x3fc5fb=_0x3a25e2,_0x7c9cc1=this[_0x3fc5fb(0x5f7)](Game_BattlerBase[_0x3fc5fb(0x2ec)],_0x11a1c9),_0x1bcdf6=(_0x1256e6,_0x16ac02)=>{const _0x2de540=_0x3fc5fb;if(!_0x16ac02)return _0x1256e6;if(_0x16ac02[_0x2de540(0x267)][_0x2de540(0x175)](VisuMZ['CoreEngine']['RegExp']['paramRate1'][_0x11a1c9])){var _0x571000=Number(RegExp['$1'])/0x64;_0x1256e6*=_0x571000;}if(_0x16ac02[_0x2de540(0x267)][_0x2de540(0x175)](VisuMZ[_0x2de540(0x62c)][_0x2de540(0x45d)][_0x2de540(0x63f)][_0x11a1c9])){var _0x571000=Number(RegExp['$1']);_0x1256e6*=_0x571000;}if(_0x16ac02['note'][_0x2de540(0x175)](VisuMZ[_0x2de540(0x62c)][_0x2de540(0x45d)][_0x2de540(0x4d9)][_0x11a1c9])){var _0x1ce0d7=String(RegExp['$1']);try{_0x1256e6*=eval(_0x1ce0d7);}catch(_0x1be84b){if($gameTemp[_0x2de540(0x1fe)]())console[_0x2de540(0x335)](_0x1be84b);}}return _0x1256e6;};return this[_0x3fc5fb(0x1f0)]()[_0x3fc5fb(0x1e5)](_0x1bcdf6,_0x7c9cc1);},Game_BattlerBase[_0x3a25e2(0x423)]['paramFlatBonus']=function(_0x2ff4de){const _0x140fad=_0x3a25e2,_0x48b601=(_0x4eab37,_0x519f92)=>{const _0x1e6dfc=_0xeaec;if(!_0x519f92)return _0x4eab37;if(_0x519f92['note'][_0x1e6dfc(0x175)](VisuMZ['CoreEngine'][_0x1e6dfc(0x45d)][_0x1e6dfc(0x51a)][_0x2ff4de])){var _0x4ba382=Number(RegExp['$1']);_0x4eab37+=_0x4ba382;}if(_0x519f92[_0x1e6dfc(0x267)][_0x1e6dfc(0x175)](VisuMZ[_0x1e6dfc(0x62c)][_0x1e6dfc(0x45d)][_0x1e6dfc(0x2e1)][_0x2ff4de])){var _0x3a1148=String(RegExp['$1']);try{_0x4eab37+=eval(_0x3a1148);}catch(_0xceba2b){if($gameTemp['isPlaytest']())console[_0x1e6dfc(0x335)](_0xceba2b);}}return _0x4eab37;};return this[_0x140fad(0x1f0)]()[_0x140fad(0x1e5)](_0x48b601,0x0);},Game_BattlerBase['prototype'][_0x3a25e2(0x54b)]=function(_0x18e6ab){const _0x40c8e0=_0x3a25e2;let _0x28c98e=_0x40c8e0(0x54b)+_0x18e6ab+_0x40c8e0(0x385);if(this['checkCacheKey'](_0x28c98e))return this[_0x40c8e0(0x2d5)][_0x28c98e];return this['_cache'][_0x28c98e]=Math['round'](VisuMZ['CoreEngine'][_0x40c8e0(0x2f0)][_0x40c8e0(0x1bc)]['BasicParameterFormula'][_0x40c8e0(0x6d9)](this,_0x18e6ab)),this[_0x40c8e0(0x2d5)][_0x28c98e];},Game_BattlerBase[_0x3a25e2(0x423)][_0x3a25e2(0x6e2)]=function(_0x3007ab){const _0x184524=_0x3a25e2,_0x23b537=(_0x771f64,_0x1de560)=>{const _0x3af32e=_0xeaec;if(!_0x1de560)return _0x771f64;if(_0x1de560['note'][_0x3af32e(0x175)](VisuMZ[_0x3af32e(0x62c)][_0x3af32e(0x45d)][_0x3af32e(0x2b8)][_0x3007ab])){var _0x2d5e1c=Number(RegExp['$1'])/0x64;_0x771f64+=_0x2d5e1c;}if(_0x1de560[_0x3af32e(0x267)][_0x3af32e(0x175)](VisuMZ[_0x3af32e(0x62c)][_0x3af32e(0x45d)][_0x3af32e(0x54d)][_0x3007ab])){var _0x2d5e1c=Number(RegExp['$1']);_0x771f64+=_0x2d5e1c;}if(_0x1de560[_0x3af32e(0x267)]['match'](VisuMZ[_0x3af32e(0x62c)][_0x3af32e(0x45d)]['xparamPlusJS'][_0x3007ab])){var _0x380a31=String(RegExp['$1']);try{_0x771f64+=eval(_0x380a31);}catch(_0x376e4b){if($gameTemp['isPlaytest']())console['log'](_0x376e4b);}}return _0x771f64;};return this['traitObjects']()[_0x184524(0x1e5)](_0x23b537,0x0);},Game_BattlerBase['prototype'][_0x3a25e2(0x3e5)]=function(_0x404086){const _0x4e0cc1=_0x3a25e2,_0x4fa743=(_0x76d786,_0x11e2bb)=>{const _0x17c4e7=_0xeaec;if(!_0x11e2bb)return _0x76d786;if(_0x11e2bb[_0x17c4e7(0x267)][_0x17c4e7(0x175)](VisuMZ[_0x17c4e7(0x62c)][_0x17c4e7(0x45d)][_0x17c4e7(0x332)][_0x404086])){var _0x16950=Number(RegExp['$1'])/0x64;_0x76d786*=_0x16950;}if(_0x11e2bb[_0x17c4e7(0x267)][_0x17c4e7(0x175)](VisuMZ[_0x17c4e7(0x62c)][_0x17c4e7(0x45d)][_0x17c4e7(0x1ed)][_0x404086])){var _0x16950=Number(RegExp['$1']);_0x76d786*=_0x16950;}if(_0x11e2bb[_0x17c4e7(0x267)][_0x17c4e7(0x175)](VisuMZ['CoreEngine']['RegExp'][_0x17c4e7(0x30f)][_0x404086])){var _0x5941d4=String(RegExp['$1']);try{_0x76d786*=eval(_0x5941d4);}catch(_0x48c0aa){if($gameTemp[_0x17c4e7(0x1fe)]())console[_0x17c4e7(0x335)](_0x48c0aa);}}return _0x76d786;};return this[_0x4e0cc1(0x1f0)]()['reduce'](_0x4fa743,0x1);},Game_BattlerBase[_0x3a25e2(0x423)][_0x3a25e2(0x35c)]=function(_0x55af61){const _0x1edeb9=_0x3a25e2,_0x4d2489=(_0x4386f0,_0x6c8bcb)=>{const _0x317889=_0xeaec;if(!_0x6c8bcb)return _0x4386f0;if(_0x6c8bcb['note'][_0x317889(0x175)](VisuMZ['CoreEngine']['RegExp'][_0x317889(0x66e)][_0x55af61])){var _0x42371d=Number(RegExp['$1'])/0x64;_0x4386f0+=_0x42371d;}if(_0x6c8bcb[_0x317889(0x267)][_0x317889(0x175)](VisuMZ[_0x317889(0x62c)][_0x317889(0x45d)][_0x317889(0x4e8)][_0x55af61])){var _0x42371d=Number(RegExp['$1']);_0x4386f0+=_0x42371d;}if(_0x6c8bcb[_0x317889(0x267)][_0x317889(0x175)](VisuMZ[_0x317889(0x62c)][_0x317889(0x45d)][_0x317889(0x3ac)][_0x55af61])){var _0x4a00be=String(RegExp['$1']);try{_0x4386f0+=eval(_0x4a00be);}catch(_0x1e6988){if($gameTemp[_0x317889(0x1fe)]())console['log'](_0x1e6988);}}return _0x4386f0;};return this[_0x1edeb9(0x1f0)]()['reduce'](_0x4d2489,0x0);},Game_BattlerBase[_0x3a25e2(0x423)]['xparam']=function(_0x46e0e4){const _0x118cae=_0x3a25e2;let _0x3d3b0e=_0x118cae(0x615)+_0x46e0e4+_0x118cae(0x385);if(this[_0x118cae(0x148)](_0x3d3b0e))return this[_0x118cae(0x2d5)][_0x3d3b0e];return this[_0x118cae(0x2d5)][_0x3d3b0e]=VisuMZ['CoreEngine']['Settings'][_0x118cae(0x1bc)][_0x118cae(0x509)][_0x118cae(0x6d9)](this,_0x46e0e4),this[_0x118cae(0x2d5)][_0x3d3b0e];},Game_BattlerBase[_0x3a25e2(0x423)][_0x3a25e2(0x39f)]=function(_0x14c0cd){const _0x207539=_0x3a25e2,_0x268e7e=(_0x1b8f1a,_0x221c3b)=>{const _0x1747d5=_0xeaec;if(!_0x221c3b)return _0x1b8f1a;if(_0x221c3b[_0x1747d5(0x267)]['match'](VisuMZ[_0x1747d5(0x62c)][_0x1747d5(0x45d)][_0x1747d5(0x30d)][_0x14c0cd])){var _0x37e80f=Number(RegExp['$1'])/0x64;_0x1b8f1a+=_0x37e80f;}if(_0x221c3b[_0x1747d5(0x267)][_0x1747d5(0x175)](VisuMZ[_0x1747d5(0x62c)]['RegExp']['sparamPlus2'][_0x14c0cd])){var _0x37e80f=Number(RegExp['$1']);_0x1b8f1a+=_0x37e80f;}if(_0x221c3b[_0x1747d5(0x267)][_0x1747d5(0x175)](VisuMZ['CoreEngine'][_0x1747d5(0x45d)][_0x1747d5(0x6af)][_0x14c0cd])){var _0x541777=String(RegExp['$1']);try{_0x1b8f1a+=eval(_0x541777);}catch(_0x342aa){if($gameTemp[_0x1747d5(0x1fe)]())console['log'](_0x342aa);}}return _0x1b8f1a;};return this[_0x207539(0x1f0)]()['reduce'](_0x268e7e,0x0);},Game_BattlerBase[_0x3a25e2(0x423)][_0x3a25e2(0x232)]=function(_0x3444eb){const _0x443d36=_0x3a25e2,_0x38b937=(_0x2ccfb7,_0x526b77)=>{const _0x2fc8ff=_0xeaec;if(!_0x526b77)return _0x2ccfb7;if(_0x526b77[_0x2fc8ff(0x267)][_0x2fc8ff(0x175)](VisuMZ[_0x2fc8ff(0x62c)][_0x2fc8ff(0x45d)][_0x2fc8ff(0x22a)][_0x3444eb])){var _0xefab0b=Number(RegExp['$1'])/0x64;_0x2ccfb7*=_0xefab0b;}if(_0x526b77[_0x2fc8ff(0x267)]['match'](VisuMZ[_0x2fc8ff(0x62c)][_0x2fc8ff(0x45d)][_0x2fc8ff(0x66a)][_0x3444eb])){var _0xefab0b=Number(RegExp['$1']);_0x2ccfb7*=_0xefab0b;}if(_0x526b77[_0x2fc8ff(0x267)][_0x2fc8ff(0x175)](VisuMZ[_0x2fc8ff(0x62c)][_0x2fc8ff(0x45d)][_0x2fc8ff(0x29b)][_0x3444eb])){var _0x59d279=String(RegExp['$1']);try{_0x2ccfb7*=eval(_0x59d279);}catch(_0x2598aa){if($gameTemp[_0x2fc8ff(0x1fe)]())console[_0x2fc8ff(0x335)](_0x2598aa);}}return _0x2ccfb7;};return this[_0x443d36(0x1f0)]()['reduce'](_0x38b937,0x1);},Game_BattlerBase[_0x3a25e2(0x423)][_0x3a25e2(0x256)]=function(_0x58a9b5){const _0x5ce069=_0x3a25e2,_0x178a85=(_0x4ee6b6,_0x324227)=>{const _0x5b1d48=_0xeaec;if(!_0x324227)return _0x4ee6b6;if(_0x324227[_0x5b1d48(0x267)][_0x5b1d48(0x175)](VisuMZ[_0x5b1d48(0x62c)][_0x5b1d48(0x45d)][_0x5b1d48(0x3a9)][_0x58a9b5])){var _0x1bfe2d=Number(RegExp['$1'])/0x64;_0x4ee6b6+=_0x1bfe2d;}if(_0x324227[_0x5b1d48(0x267)][_0x5b1d48(0x175)](VisuMZ[_0x5b1d48(0x62c)]['RegExp'][_0x5b1d48(0x408)][_0x58a9b5])){var _0x1bfe2d=Number(RegExp['$1']);_0x4ee6b6+=_0x1bfe2d;}if(_0x324227[_0x5b1d48(0x267)]['match'](VisuMZ[_0x5b1d48(0x62c)][_0x5b1d48(0x45d)][_0x5b1d48(0x2c1)][_0x58a9b5])){var _0x635929=String(RegExp['$1']);try{_0x4ee6b6+=eval(_0x635929);}catch(_0x1f0908){if($gameTemp['isPlaytest']())console[_0x5b1d48(0x335)](_0x1f0908);}}return _0x4ee6b6;};return this[_0x5ce069(0x1f0)]()[_0x5ce069(0x1e5)](_0x178a85,0x0);},Game_BattlerBase[_0x3a25e2(0x423)][_0x3a25e2(0x5b5)]=function(_0x4bac74){const _0x4ffa31=_0x3a25e2;let _0x19e24b=_0x4ffa31(0x5b5)+_0x4bac74+_0x4ffa31(0x385);if(this[_0x4ffa31(0x148)](_0x19e24b))return this[_0x4ffa31(0x2d5)][_0x19e24b];return this[_0x4ffa31(0x2d5)][_0x19e24b]=VisuMZ['CoreEngine'][_0x4ffa31(0x2f0)][_0x4ffa31(0x1bc)][_0x4ffa31(0x28f)][_0x4ffa31(0x6d9)](this,_0x4bac74),this['_cache'][_0x19e24b];},Game_BattlerBase[_0x3a25e2(0x423)][_0x3a25e2(0x4cd)]=function(_0x5e79ec,_0xd888f4){const _0xe44884=_0x3a25e2;if(typeof paramId===_0xe44884(0x398))return this[_0xe44884(0x54b)](_0x5e79ec);_0x5e79ec=String(_0x5e79ec||'')[_0xe44884(0x699)]();if(_0x5e79ec===_0xe44884(0x5cc))return this['param'](0x0);if(_0x5e79ec===_0xe44884(0x336))return this[_0xe44884(0x54b)](0x1);if(_0x5e79ec==='ATK')return this['param'](0x2);if(_0x5e79ec===_0xe44884(0x36c))return this[_0xe44884(0x54b)](0x3);if(_0x5e79ec===_0xe44884(0x46a))return this[_0xe44884(0x54b)](0x4);if(_0x5e79ec===_0xe44884(0x460))return this[_0xe44884(0x54b)](0x5);if(_0x5e79ec===_0xe44884(0x1be))return this['param'](0x6);if(_0x5e79ec===_0xe44884(0x2d6))return this[_0xe44884(0x54b)](0x7);if(_0x5e79ec===_0xe44884(0x1d9))return _0xd888f4?String(Math[_0xe44884(0x1a1)](this[_0xe44884(0x615)](0x0)*0x64))+'%':this[_0xe44884(0x615)](0x0);if(_0x5e79ec===_0xe44884(0x53c))return _0xd888f4?String(Math[_0xe44884(0x1a1)](this[_0xe44884(0x615)](0x1)*0x64))+'%':this[_0xe44884(0x615)](0x1);if(_0x5e79ec==='CRI')return _0xd888f4?String(Math[_0xe44884(0x1a1)](this['xparam'](0x2)*0x64))+'%':this[_0xe44884(0x615)](0x2);if(_0x5e79ec===_0xe44884(0x4d6))return _0xd888f4?String(Math[_0xe44884(0x1a1)](this[_0xe44884(0x615)](0x3)*0x64))+'%':this[_0xe44884(0x615)](0x3);if(_0x5e79ec===_0xe44884(0x1df))return _0xd888f4?String(Math['round'](this[_0xe44884(0x615)](0x4)*0x64))+'%':this[_0xe44884(0x615)](0x4);if(_0x5e79ec==='MRF')return _0xd888f4?String(Math[_0xe44884(0x1a1)](this[_0xe44884(0x615)](0x5)*0x64))+'%':this[_0xe44884(0x615)](0x5);if(_0x5e79ec===_0xe44884(0x314))return _0xd888f4?String(Math['round'](this[_0xe44884(0x615)](0x6)*0x64))+'%':this[_0xe44884(0x615)](0x6);if(_0x5e79ec===_0xe44884(0x568))return _0xd888f4?String(Math['round'](this[_0xe44884(0x615)](0x7)*0x64))+'%':this[_0xe44884(0x615)](0x7);if(_0x5e79ec==='MRG')return _0xd888f4?String(Math[_0xe44884(0x1a1)](this['xparam'](0x8)*0x64))+'%':this[_0xe44884(0x615)](0x8);if(_0x5e79ec==='TRG')return _0xd888f4?String(Math[_0xe44884(0x1a1)](this[_0xe44884(0x615)](0x9)*0x64))+'%':this[_0xe44884(0x615)](0x9);if(_0x5e79ec===_0xe44884(0x434))return _0xd888f4?String(Math['round'](this[_0xe44884(0x5b5)](0x0)*0x64))+'%':this[_0xe44884(0x5b5)](0x0);if(_0x5e79ec===_0xe44884(0x66d))return _0xd888f4?String(Math['round'](this[_0xe44884(0x5b5)](0x1)*0x64))+'%':this[_0xe44884(0x5b5)](0x1);if(_0x5e79ec===_0xe44884(0x2a7))return _0xd888f4?String(Math[_0xe44884(0x1a1)](this[_0xe44884(0x5b5)](0x2)*0x64))+'%':this['sparam'](0x2);if(_0x5e79ec==='PHA')return _0xd888f4?String(Math[_0xe44884(0x1a1)](this[_0xe44884(0x5b5)](0x3)*0x64))+'%':this['sparam'](0x3);if(_0x5e79ec==='MCR')return _0xd888f4?String(Math['round'](this[_0xe44884(0x5b5)](0x4)*0x64))+'%':this[_0xe44884(0x5b5)](0x4);if(_0x5e79ec==='TCR')return _0xd888f4?String(Math[_0xe44884(0x1a1)](this[_0xe44884(0x5b5)](0x5)*0x64))+'%':this[_0xe44884(0x5b5)](0x5);if(_0x5e79ec===_0xe44884(0x1f3))return _0xd888f4?String(Math[_0xe44884(0x1a1)](this[_0xe44884(0x5b5)](0x6)*0x64))+'%':this[_0xe44884(0x5b5)](0x6);if(_0x5e79ec==='MDR')return _0xd888f4?String(Math[_0xe44884(0x1a1)](this['sparam'](0x7)*0x64))+'%':this[_0xe44884(0x5b5)](0x7);if(_0x5e79ec==='FDR')return _0xd888f4?String(Math[_0xe44884(0x1a1)](this[_0xe44884(0x5b5)](0x8)*0x64))+'%':this['sparam'](0x8);if(_0x5e79ec===_0xe44884(0x2dd))return _0xd888f4?String(Math[_0xe44884(0x1a1)](this[_0xe44884(0x5b5)](0x9)*0x64))+'%':this['sparam'](0x9);if(VisuMZ[_0xe44884(0x62c)]['CustomParamAbb'][_0x5e79ec]){const _0x58c6d8=VisuMZ[_0xe44884(0x62c)][_0xe44884(0x19e)][_0x5e79ec],_0x394b85=this[_0x58c6d8];return VisuMZ[_0xe44884(0x62c)][_0xe44884(0x42d)][_0x5e79ec]===_0xe44884(0x531)?_0x394b85:_0xd888f4?String(Math[_0xe44884(0x1a1)](_0x394b85*0x64))+'%':_0x394b85;}return'';},Game_BattlerBase[_0x3a25e2(0x423)][_0x3a25e2(0x36e)]=function(){const _0x92ebf6=_0x3a25e2;return this[_0x92ebf6(0x3e0)]()&&this['_hp']<this[_0x92ebf6(0x1e1)]*VisuMZ[_0x92ebf6(0x62c)][_0x92ebf6(0x2f0)][_0x92ebf6(0x1bc)][_0x92ebf6(0x219)];},Game_Battler[_0x3a25e2(0x423)]['performMiss']=function(){const _0x12fd96=_0x3a25e2;SoundManager[_0x12fd96(0x3a0)](),this[_0x12fd96(0x1b1)]('evade');},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x2d1)]=Game_Actor[_0x3a25e2(0x423)][_0x3a25e2(0x3c6)],Game_Actor['prototype']['paramBase']=function(_0x2bec03){const _0x4bd11a=_0x3a25e2;if(this[_0x4bd11a(0x502)]>0x63)return this[_0x4bd11a(0x475)](_0x2bec03);return VisuMZ[_0x4bd11a(0x62c)][_0x4bd11a(0x2d1)][_0x4bd11a(0x6d9)](this,_0x2bec03);},Game_Actor['prototype']['paramBaseAboveLevel99']=function(_0x5eb972){const _0xfa1926=_0x3a25e2,_0x273607=this[_0xfa1926(0x642)]()['params'][_0x5eb972][0x63],_0x38ed84=this['currentClass']()[_0xfa1926(0x4f5)][_0x5eb972][0x62];return _0x273607+(_0x273607-_0x38ed84)*(this[_0xfa1926(0x502)]-0x63);},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x558)]=Game_Actor[_0x3a25e2(0x423)]['changeClass'],Game_Actor[_0x3a25e2(0x423)]['changeClass']=function(_0xc09c3b,_0x35f3b1){const _0x13a48c=_0x3a25e2;$gameTemp['_changingClass']=!![],VisuMZ['CoreEngine'][_0x13a48c(0x558)]['call'](this,_0xc09c3b,_0x35f3b1),$gameTemp[_0x13a48c(0x308)]=undefined;},VisuMZ['CoreEngine'][_0x3a25e2(0x5c4)]=Game_Actor[_0x3a25e2(0x423)][_0x3a25e2(0x26f)],Game_Actor[_0x3a25e2(0x423)][_0x3a25e2(0x26f)]=function(){const _0x191b37=_0x3a25e2;VisuMZ[_0x191b37(0x62c)][_0x191b37(0x5c4)][_0x191b37(0x6d9)](this);if(!$gameTemp[_0x191b37(0x308)])this[_0x191b37(0x6c2)]();},Game_Actor[_0x3a25e2(0x423)][_0x3a25e2(0x6c2)]=function(){const _0x27de77=_0x3a25e2;this[_0x27de77(0x2d5)]={};if(VisuMZ[_0x27de77(0x62c)][_0x27de77(0x2f0)][_0x27de77(0x2b0)][_0x27de77(0x6fb)])this['_hp']=this[_0x27de77(0x1e1)];if(VisuMZ[_0x27de77(0x62c)][_0x27de77(0x2f0)][_0x27de77(0x2b0)][_0x27de77(0x2cd)])this['_mp']=this[_0x27de77(0x611)];},Game_Actor[_0x3a25e2(0x423)]['expRate']=function(){const _0x4c3c9e=_0x3a25e2;if(this[_0x4c3c9e(0x657)]())return 0x1;const _0x23772b=this[_0x4c3c9e(0x550)]()-this[_0x4c3c9e(0x1c2)](),_0x2d22e6=this['currentExp']()-this[_0x4c3c9e(0x1c2)]();return(_0x2d22e6/_0x23772b)[_0x4c3c9e(0x2a4)](0x0,0x1);},Game_Actor[_0x3a25e2(0x423)][_0x3a25e2(0x1f0)]=function(){const _0x21eb58=_0x3a25e2,_0x1e069a=Game_Battler['prototype']['traitObjects'][_0x21eb58(0x6d9)](this);for(const _0x7d540c of this[_0x21eb58(0x5b4)]()){_0x7d540c&&_0x1e069a[_0x21eb58(0x3a6)](_0x7d540c);}return _0x1e069a[_0x21eb58(0x3a6)](this['currentClass'](),this[_0x21eb58(0x4ee)]()),_0x1e069a;},Object[_0x3a25e2(0x666)](Game_Enemy[_0x3a25e2(0x423)],_0x3a25e2(0x502),{'get':function(){const _0xa5bed=_0x3a25e2;return this[_0xa5bed(0x3fd)]();},'configurable':!![]}),Game_Enemy['prototype']['getLevel']=function(){const _0x18bdbf=_0x3a25e2;return this[_0x18bdbf(0x5fd)]()[_0x18bdbf(0x502)];},Game_Enemy[_0x3a25e2(0x423)][_0x3a25e2(0x1ac)]=function(){const _0x379b56=_0x3a25e2;!this['_repositioned']&&(this['_screenY']+=Math['round']((Graphics['height']-0x270)/0x2),this[_0x379b56(0x17d)]-=Math[_0x379b56(0x6f7)]((Graphics[_0x379b56(0x5fe)]-Graphics[_0x379b56(0x56b)])/0x2),$gameSystem['isSideView']()?this[_0x379b56(0x591)]-=Math['floor']((Graphics[_0x379b56(0x286)]-Graphics[_0x379b56(0x292)])/0x2):this[_0x379b56(0x591)]+=Math[_0x379b56(0x1a1)]((Graphics['boxWidth']-0x330)/0x2)),this[_0x379b56(0x4df)]=!![];},Game_Party[_0x3a25e2(0x423)][_0x3a25e2(0x3eb)]=function(){const _0x3fb883=_0x3a25e2;return VisuMZ[_0x3fb883(0x62c)]['Settings']['Gold'][_0x3fb883(0x604)];},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x6ce)]=Game_Party[_0x3a25e2(0x423)][_0x3a25e2(0x70a)],Game_Party[_0x3a25e2(0x423)]['consumeItem']=function(_0x45c5f3){const _0x4d0fce=_0x3a25e2;if(VisuMZ['CoreEngine'][_0x4d0fce(0x2f0)][_0x4d0fce(0x2b0)][_0x4d0fce(0x23a)]&&DataManager['isKeyItem'](_0x45c5f3))return;VisuMZ[_0x4d0fce(0x62c)][_0x4d0fce(0x6ce)][_0x4d0fce(0x6d9)](this,_0x45c5f3);},VisuMZ['CoreEngine'][_0x3a25e2(0x295)]=Game_Troop[_0x3a25e2(0x423)][_0x3a25e2(0x612)],Game_Troop['prototype'][_0x3a25e2(0x612)]=function(_0x2898f4){const _0x2ea277=_0x3a25e2;$gameTemp[_0x2ea277(0x4ed)](),$gameTemp[_0x2ea277(0x46c)](_0x2898f4),VisuMZ[_0x2ea277(0x62c)]['Game_Troop_setup'][_0x2ea277(0x6d9)](this,_0x2898f4);},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x4fe)]=Game_Map['prototype'][_0x3a25e2(0x612)],Game_Map[_0x3a25e2(0x423)][_0x3a25e2(0x612)]=function(_0x57b7e6){const _0x2ee2aa=_0x3a25e2;VisuMZ[_0x2ee2aa(0x62c)]['Game_Map_setup'][_0x2ee2aa(0x6d9)](this,_0x57b7e6),this[_0x2ee2aa(0x2ce)](_0x57b7e6);},Game_Map[_0x3a25e2(0x423)]['setupCoreEngine']=function(){const _0x3e10cd=_0x3a25e2;this['_hideTileShadows']=VisuMZ[_0x3e10cd(0x62c)][_0x3e10cd(0x2f0)][_0x3e10cd(0x2b0)][_0x3e10cd(0x330)]||![];if($dataMap&&$dataMap[_0x3e10cd(0x267)]){if($dataMap[_0x3e10cd(0x267)][_0x3e10cd(0x175)](/<SHOW TILE SHADOWS>/i))this[_0x3e10cd(0x28c)]=![];if($dataMap[_0x3e10cd(0x267)][_0x3e10cd(0x175)](/<HIDE TILE SHADOWS>/i))this[_0x3e10cd(0x28c)]=!![];}},Game_Map[_0x3a25e2(0x423)][_0x3a25e2(0x15c)]=function(){const _0x176101=_0x3a25e2;if(this[_0x176101(0x28c)]===undefined)this[_0x176101(0x2ce)]();return this[_0x176101(0x28c)];},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x67c)]=Game_Character[_0x3a25e2(0x423)][_0x3a25e2(0x1de)],Game_Character['prototype']['processMoveCommand']=function(_0x35e033){const _0x429e66=_0x3a25e2;try{VisuMZ['CoreEngine'][_0x429e66(0x67c)][_0x429e66(0x6d9)](this,_0x35e033);}catch(_0x4727ad){if($gameTemp[_0x429e66(0x1fe)]())console[_0x429e66(0x335)](_0x4727ad);}},Game_Player['prototype']['makeEncounterCount']=function(){const _0x20ddda=_0x3a25e2,_0x4869dc=$gameMap[_0x20ddda(0x245)]();this['_encounterCount']=Math[_0x20ddda(0x4b0)](_0x4869dc)+Math['randomInt'](_0x4869dc)+this[_0x20ddda(0x443)]();},Game_Player[_0x3a25e2(0x423)][_0x3a25e2(0x443)]=function(){const _0x4f4993=_0x3a25e2;return $dataMap&&$dataMap[_0x4f4993(0x267)]&&$dataMap[_0x4f4993(0x267)]['match'](/<MINIMUM ENCOUNTER STEPS:[ ](\d+)>/i)?Number(RegExp['$1']):VisuMZ[_0x4f4993(0x62c)][_0x4f4993(0x2f0)][_0x4f4993(0x2b0)][_0x4f4993(0x4ef)];},VisuMZ[_0x3a25e2(0x62c)]['Game_Event_isCollidedWithEvents']=Game_Event['prototype'][_0x3a25e2(0x50f)],Game_Event[_0x3a25e2(0x423)][_0x3a25e2(0x50f)]=function(_0x24731d,_0x2da56a){const _0x2f8512=_0x3a25e2;return this[_0x2f8512(0x542)]()?this[_0x2f8512(0x648)](_0x24731d,_0x2da56a):VisuMZ['CoreEngine']['Game_Event_isCollidedWithEvents'][_0x2f8512(0x6d9)](this,_0x24731d,_0x2da56a);},Game_Event[_0x3a25e2(0x423)]['isSmartEventCollisionOn']=function(){const _0x39a474=_0x3a25e2;return VisuMZ[_0x39a474(0x62c)]['Settings']['QoL']['SmartEventCollisionPriority'];},Game_Event[_0x3a25e2(0x423)][_0x3a25e2(0x648)]=function(_0x3e11cd,_0x2ef2d4){const _0x297e9a=_0x3a25e2;if(!this['isNormalPriority']())return![];else{const _0x50d02f=$gameMap[_0x297e9a(0x24b)](_0x3e11cd,_0x2ef2d4)[_0x297e9a(0x355)](_0x2dd3ac=>_0x2dd3ac[_0x297e9a(0x49b)]());return _0x50d02f[_0x297e9a(0x200)]>0x0;}},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x22e)]=Game_Interpreter[_0x3a25e2(0x423)][_0x3a25e2(0x483)],Game_Interpreter[_0x3a25e2(0x423)]['command111']=function(_0x541c9a){const _0x30f356=_0x3a25e2;try{VisuMZ[_0x30f356(0x62c)][_0x30f356(0x22e)][_0x30f356(0x6d9)](this,_0x541c9a);}catch(_0x4cc78d){$gameTemp[_0x30f356(0x1fe)]()&&(console['log'](_0x30f356(0x55b)),console[_0x30f356(0x335)](_0x4cc78d)),this[_0x30f356(0x476)]();}return!![];},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x6ff)]=Game_Interpreter[_0x3a25e2(0x423)][_0x3a25e2(0x5c3)],Game_Interpreter[_0x3a25e2(0x423)]['command122']=function(_0x39e58c){const _0x259b2d=_0x3a25e2;try{VisuMZ[_0x259b2d(0x62c)]['Game_Interpreter_command122']['call'](this,_0x39e58c);}catch(_0x28f7aa){$gameTemp[_0x259b2d(0x1fe)]()&&(console[_0x259b2d(0x335)](_0x259b2d(0x499)),console[_0x259b2d(0x335)](_0x28f7aa));}return!![];},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x52d)]=Game_Interpreter[_0x3a25e2(0x423)]['command355'],Game_Interpreter[_0x3a25e2(0x423)][_0x3a25e2(0x52e)]=function(){const _0x376455=_0x3a25e2;try{VisuMZ['CoreEngine'][_0x376455(0x52d)]['call'](this);}catch(_0x22791c){$gameTemp[_0x376455(0x1fe)]()&&(console[_0x376455(0x335)]('Script\x20Call\x20Error'),console[_0x376455(0x335)](_0x22791c));}return!![];},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x198)]=Game_Interpreter[_0x3a25e2(0x423)]['command357'],Game_Interpreter[_0x3a25e2(0x423)][_0x3a25e2(0x15a)]=function(_0x40d7cb){const _0x1fa37d=_0x3a25e2;return $gameTemp[_0x1fa37d(0x266)](this),VisuMZ[_0x1fa37d(0x62c)][_0x1fa37d(0x198)][_0x1fa37d(0x6d9)](this,_0x40d7cb);},Scene_Base[_0x3a25e2(0x423)][_0x3a25e2(0x4a8)]=function(){const _0x101dcf=_0x3a25e2;return VisuMZ[_0x101dcf(0x62c)][_0x101dcf(0x2f0)]['UI']['FadeSpeed'];},Scene_Base[_0x3a25e2(0x423)][_0x3a25e2(0x34d)]=function(){const _0x1154bb=_0x3a25e2;return VisuMZ[_0x1154bb(0x62c)]['Settings']['UI'][_0x1154bb(0x3c1)];},Scene_Base[_0x3a25e2(0x423)][_0x3a25e2(0x644)]=function(){return VisuMZ['CoreEngine']['Settings']['UI']['BottomButtons'];},Scene_Base[_0x3a25e2(0x423)][_0x3a25e2(0x48c)]=function(){const _0x4aaf4d=_0x3a25e2;return VisuMZ[_0x4aaf4d(0x62c)][_0x4aaf4d(0x2f0)]['UI']['RightMenus'];},Scene_Base[_0x3a25e2(0x423)][_0x3a25e2(0x59e)]=function(){const _0x4b0edc=_0x3a25e2;return VisuMZ['CoreEngine'][_0x4b0edc(0x2f0)]['UI'][_0x4b0edc(0x454)];},Scene_Base['prototype']['buttonAreaHeight']=function(){const _0x59164f=_0x3a25e2;return VisuMZ['CoreEngine'][_0x59164f(0x2f0)]['UI']['ButtonHeight'];},Scene_Base[_0x3a25e2(0x423)][_0x3a25e2(0x446)]=function(){const _0x50d606=_0x3a25e2;return VisuMZ['CoreEngine'][_0x50d606(0x2f0)][_0x50d606(0x6ac)]['EnableMasking'];},VisuMZ[_0x3a25e2(0x62c)]['Scene_Base_createWindowLayer']=Scene_Base[_0x3a25e2(0x423)]['createWindowLayer'],Scene_Base['prototype']['createWindowLayer']=function(){const _0x2b4501=_0x3a25e2;VisuMZ[_0x2b4501(0x62c)][_0x2b4501(0x562)][_0x2b4501(0x6d9)](this),this[_0x2b4501(0x592)](),this[_0x2b4501(0x4f1)]['x']=Math['round'](this[_0x2b4501(0x4f1)]['x']),this[_0x2b4501(0x4f1)]['y']=Math[_0x2b4501(0x1a1)](this['_windowLayer']['y']);},Scene_Base[_0x3a25e2(0x423)]['createButtonAssistWindow']=function(){},Scene_Base[_0x3a25e2(0x423)]['buttonAssistKey1']=function(){const _0x1e8ad0=_0x3a25e2;return TextManager[_0x1e8ad0(0x252)](_0x1e8ad0(0x47a),_0x1e8ad0(0x2a5));},Scene_Base[_0x3a25e2(0x423)][_0x3a25e2(0x6c3)]=function(){const _0x343ede=_0x3a25e2;return TextManager[_0x343ede(0x5a3)](_0x343ede(0x15b));},Scene_Base[_0x3a25e2(0x423)][_0x3a25e2(0x6f8)]=function(){const _0x50e775=_0x3a25e2;return TextManager[_0x50e775(0x5a3)](_0x50e775(0x6ba));},Scene_Base[_0x3a25e2(0x423)]['buttonAssistKey4']=function(){const _0x38d94c=_0x3a25e2;return TextManager[_0x38d94c(0x5a3)]('ok');},Scene_Base[_0x3a25e2(0x423)][_0x3a25e2(0x4fb)]=function(){const _0x599135=_0x3a25e2;return TextManager[_0x599135(0x5a3)]('cancel');},Scene_Base[_0x3a25e2(0x423)]['buttonAssistText1']=function(){const _0x115c77=_0x3a25e2;return this[_0x115c77(0x324)]&&this['_pageupButton'][_0x115c77(0x1a5)]?TextManager[_0x115c77(0x4b4)]:'';},Scene_Base[_0x3a25e2(0x423)]['buttonAssistText2']=function(){return'';},Scene_Base['prototype'][_0x3a25e2(0x559)]=function(){return'';},Scene_Base[_0x3a25e2(0x423)][_0x3a25e2(0x5e4)]=function(){const _0x3e09e9=_0x3a25e2;return TextManager[_0x3e09e9(0x17b)];},Scene_Base[_0x3a25e2(0x423)][_0x3a25e2(0x626)]=function(){const _0x3cf784=_0x3a25e2;return TextManager[_0x3cf784(0x1c4)];},Scene_Base[_0x3a25e2(0x423)]['buttonAssistOffset1']=function(){return 0x0;},Scene_Base[_0x3a25e2(0x423)][_0x3a25e2(0x453)]=function(){return 0x0;},Scene_Base['prototype'][_0x3a25e2(0x708)]=function(){return 0x0;},Scene_Base[_0x3a25e2(0x423)]['buttonAssistOffset4']=function(){return 0x0;},Scene_Base[_0x3a25e2(0x423)]['buttonAssistOffset5']=function(){return 0x0;},VisuMZ['CoreEngine'][_0x3a25e2(0x52b)]=Scene_Boot['prototype'][_0x3a25e2(0x333)],Scene_Boot[_0x3a25e2(0x423)]['loadSystemImages']=function(){const _0x2fd843=_0x3a25e2;VisuMZ[_0x2fd843(0x62c)][_0x2fd843(0x52b)][_0x2fd843(0x6d9)](this),this[_0x2fd843(0x64e)]();},Scene_Boot['prototype'][_0x3a25e2(0x64e)]=function(){const _0xd43730=_0x3a25e2,_0x5d7f83=[_0xd43730(0x401),'battlebacks1','battlebacks2',_0xd43730(0x39e),_0xd43730(0x517),_0xd43730(0x1b3),_0xd43730(0x709),_0xd43730(0x432),_0xd43730(0x456),_0xd43730(0x32f),_0xd43730(0x53a),'tilesets',_0xd43730(0x174),_0xd43730(0x38a)];for(const _0x4312e2 of _0x5d7f83){const _0x1df779=VisuMZ[_0xd43730(0x62c)]['Settings']['ImgLoad'][_0x4312e2],_0x5d6f6d=_0xd43730(0x1f6)[_0xd43730(0x534)](_0x4312e2);for(const _0x4de365 of _0x1df779){ImageManager[_0xd43730(0x55e)](_0x5d6f6d,_0x4de365);}}},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x19f)]=Scene_Boot['prototype']['startNormalGame'],Scene_Boot[_0x3a25e2(0x423)][_0x3a25e2(0x262)]=function(){const _0x51275a=_0x3a25e2;Utils[_0x51275a(0x403)](_0x51275a(0x260))&&VisuMZ['CoreEngine']['Settings']['QoL']['NewGameBoot']?this['startAutoNewGame']():VisuMZ[_0x51275a(0x62c)][_0x51275a(0x19f)][_0x51275a(0x6d9)](this);},Scene_Boot[_0x3a25e2(0x423)][_0x3a25e2(0x26a)]=function(){const _0x52175=_0x3a25e2;DataManager[_0x52175(0x362)](),SceneManager[_0x52175(0x55c)](Scene_Map);},Scene_Boot[_0x3a25e2(0x423)][_0x3a25e2(0x3f5)]=function(){const _0x150900=_0x3a25e2,_0x3fac35=$dataSystem['advanced'][_0x150900(0x3d4)],_0x2d97d2=$dataSystem[_0x150900(0x585)][_0x150900(0x393)],_0x150d8e=VisuMZ[_0x150900(0x62c)][_0x150900(0x2f0)]['UI'][_0x150900(0x2c3)];Graphics[_0x150900(0x292)]=_0x3fac35-_0x150d8e*0x2,Graphics['boxHeight']=_0x2d97d2-_0x150d8e*0x2,this[_0x150900(0x556)]();},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x35b)]=Scene_Boot[_0x3a25e2(0x423)][_0x3a25e2(0x647)],Scene_Boot['prototype']['updateDocumentTitle']=function(){const _0x4bed0a=_0x3a25e2;this[_0x4bed0a(0x6f1)]()?this[_0x4bed0a(0x3e4)]():VisuMZ[_0x4bed0a(0x62c)][_0x4bed0a(0x35b)][_0x4bed0a(0x6d9)](this);},Scene_Boot[_0x3a25e2(0x423)][_0x3a25e2(0x6f1)]=function(){const _0x324ddf=_0x3a25e2;if(Scene_Title[_0x324ddf(0x43d)]==='')return![];if(Scene_Title[_0x324ddf(0x43d)]===_0x324ddf(0x2ed))return![];if(Scene_Title[_0x324ddf(0x5a6)]==='')return![];if(Scene_Title[_0x324ddf(0x5a6)]==='0.00')return![];return!![];},Scene_Boot[_0x3a25e2(0x423)][_0x3a25e2(0x3e4)]=function(){const _0x29f3ce=_0x3a25e2,_0x1aec94=$dataSystem[_0x29f3ce(0x407)],_0x38b90f=Scene_Title[_0x29f3ce(0x43d)]||'',_0x33771a=Scene_Title[_0x29f3ce(0x5a6)]||'',_0x454e40=VisuMZ[_0x29f3ce(0x62c)][_0x29f3ce(0x2f0)]['MenuLayout'][_0x29f3ce(0x328)][_0x29f3ce(0x1b8)],_0x3f49e5=_0x454e40[_0x29f3ce(0x534)](_0x1aec94,_0x38b90f,_0x33771a);document[_0x29f3ce(0x227)]=_0x3f49e5;},Scene_Boot[_0x3a25e2(0x423)][_0x3a25e2(0x556)]=function(){const _0x20adee=_0x3a25e2;if(VisuMZ[_0x20adee(0x62c)][_0x20adee(0x2f0)]['UI']['SideButtons']){const _0x1c4f82=Graphics[_0x20adee(0x286)]-Graphics['boxWidth']-VisuMZ['CoreEngine'][_0x20adee(0x2f0)]['UI'][_0x20adee(0x2c3)]*0x2,_0x252222=Sprite_Button[_0x20adee(0x423)][_0x20adee(0x19d)][_0x20adee(0x6d9)](this)*0x4;if(_0x1c4f82>=_0x252222)SceneManager[_0x20adee(0x2e2)](!![]);}},Scene_Title['subtitle']=VisuMZ[_0x3a25e2(0x62c)]['Settings']['MenuLayout'][_0x3a25e2(0x328)][_0x3a25e2(0x2ed)],Scene_Title[_0x3a25e2(0x5a6)]=VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x2f0)][_0x3a25e2(0x3b3)][_0x3a25e2(0x328)][_0x3a25e2(0x5ce)],Scene_Title[_0x3a25e2(0x34b)]=VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x2f0)][_0x3a25e2(0x25c)],VisuMZ['CoreEngine'][_0x3a25e2(0x426)]=Scene_Title['prototype'][_0x3a25e2(0x18c)],Scene_Title[_0x3a25e2(0x423)][_0x3a25e2(0x18c)]=function(){const _0x318b73=_0x3a25e2;VisuMZ['CoreEngine'][_0x318b73(0x2f0)][_0x318b73(0x3b3)][_0x318b73(0x328)][_0x318b73(0x18c)]['call'](this);if(Scene_Title[_0x318b73(0x43d)]!==''&&Scene_Title[_0x318b73(0x43d)]!==_0x318b73(0x2ed))this[_0x318b73(0x67d)]();if(Scene_Title['version']!==''&&Scene_Title['version']!=='0.00')this[_0x318b73(0x2ad)]();},Scene_Title[_0x3a25e2(0x423)]['drawGameSubtitle']=function(){const _0x12fc5c=_0x3a25e2;VisuMZ[_0x12fc5c(0x62c)][_0x12fc5c(0x2f0)][_0x12fc5c(0x3b3)][_0x12fc5c(0x328)]['drawGameSubtitle']['call'](this);},Scene_Title[_0x3a25e2(0x423)]['drawGameVersion']=function(){const _0x59856a=_0x3a25e2;VisuMZ[_0x59856a(0x62c)][_0x59856a(0x2f0)]['MenuLayout'][_0x59856a(0x328)]['drawGameVersion'][_0x59856a(0x6d9)](this);},Scene_Title['prototype'][_0x3a25e2(0x399)]=function(){const _0x358f7b=_0x3a25e2;this[_0x358f7b(0x5a0)]();const _0xc1124f=$dataSystem[_0x358f7b(0x4bb)][_0x358f7b(0x441)],_0x54957f=this[_0x358f7b(0x24d)]();this[_0x358f7b(0x1b5)]=new Window_TitleCommand(_0x54957f),this[_0x358f7b(0x1b5)][_0x358f7b(0x31d)](_0xc1124f);const _0x461dad=this['commandWindowRect']();this[_0x358f7b(0x1b5)]['move'](_0x461dad['x'],_0x461dad['y'],_0x461dad[_0x358f7b(0x286)],_0x461dad[_0x358f7b(0x5fe)]),this[_0x358f7b(0x31c)](this[_0x358f7b(0x1b5)]);},Scene_Title[_0x3a25e2(0x423)][_0x3a25e2(0x62a)]=function(){const _0x4a25aa=_0x3a25e2;return this[_0x4a25aa(0x1b5)]?this['_commandWindow']['maxItems']():VisuMZ[_0x4a25aa(0x62c)]['Settings'][_0x4a25aa(0x462)]['length'];},Scene_Title[_0x3a25e2(0x423)][_0x3a25e2(0x24d)]=function(){const _0x46c329=_0x3a25e2;return VisuMZ[_0x46c329(0x62c)][_0x46c329(0x2f0)][_0x46c329(0x3b3)][_0x46c329(0x328)][_0x46c329(0x428)]['call'](this);},Scene_Title[_0x3a25e2(0x423)]['createTitleButtons']=function(){const _0x48d938=_0x3a25e2;for(const _0x5310e1 of Scene_Title[_0x48d938(0x34b)]){const _0x3a0998=new Sprite_TitlePictureButton(_0x5310e1);this[_0x48d938(0x1c7)](_0x3a0998);}},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x236)]=Scene_Map[_0x3a25e2(0x423)][_0x3a25e2(0x14d)],Scene_Map[_0x3a25e2(0x423)][_0x3a25e2(0x14d)]=function(){const _0x2660b3=_0x3a25e2;VisuMZ[_0x2660b3(0x62c)][_0x2660b3(0x236)][_0x2660b3(0x6d9)](this),$gameTemp[_0x2660b3(0x4ed)]();},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x281)]=Scene_Map[_0x3a25e2(0x423)][_0x3a25e2(0x4ec)],Scene_Map[_0x3a25e2(0x423)]['updateMainMultiply']=function(){const _0x2cff7c=_0x3a25e2;VisuMZ[_0x2cff7c(0x62c)][_0x2cff7c(0x281)][_0x2cff7c(0x6d9)](this),$gameTemp[_0x2cff7c(0x1f1)]&&!$gameMessage[_0x2cff7c(0x32e)]()&&(this[_0x2cff7c(0x636)](),SceneManager[_0x2cff7c(0x326)]());},Scene_Map[_0x3a25e2(0x423)][_0x3a25e2(0x6c4)]=function(){const _0x5a1ff5=_0x3a25e2;Scene_Message['prototype']['terminate']['call'](this),!SceneManager[_0x5a1ff5(0x157)](Scene_Battle)&&(this[_0x5a1ff5(0x2d0)][_0x5a1ff5(0x6cd)](),this[_0x5a1ff5(0x310)]['hide'](),this['_windowLayer'][_0x5a1ff5(0x1a5)]=![],SceneManager[_0x5a1ff5(0x4c9)]()),$gameScreen[_0x5a1ff5(0x4cc)]();},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x248)]=Scene_Map[_0x3a25e2(0x423)][_0x3a25e2(0x464)],Scene_Map[_0x3a25e2(0x423)][_0x3a25e2(0x464)]=function(){const _0x1da72e=_0x3a25e2;VisuMZ[_0x1da72e(0x62c)]['Scene_Map_createMenuButton'][_0x1da72e(0x6d9)](this),SceneManager[_0x1da72e(0x5f9)]()&&this[_0x1da72e(0x6d8)]();},Scene_Map[_0x3a25e2(0x423)][_0x3a25e2(0x6d8)]=function(){const _0x483144=_0x3a25e2;this[_0x483144(0x1d0)]['x']=Graphics[_0x483144(0x292)]+0x4;},VisuMZ['CoreEngine'][_0x3a25e2(0x259)]=Scene_Map[_0x3a25e2(0x423)][_0x3a25e2(0x6e1)],Scene_Map['prototype'][_0x3a25e2(0x6e1)]=function(){const _0x58cabf=_0x3a25e2;VisuMZ[_0x58cabf(0x62c)][_0x58cabf(0x259)][_0x58cabf(0x6d9)](this),this[_0x58cabf(0x16e)]();},Scene_Map['prototype'][_0x3a25e2(0x16e)]=function(){const _0x25ab42=_0x3a25e2;Input[_0x25ab42(0x6fc)](_0x25ab42(0x25a))&&(ConfigManager['alwaysDash']=!ConfigManager[_0x25ab42(0x535)],ConfigManager['save']());},VisuMZ[_0x3a25e2(0x62c)]['Scene_MenuBase_helpAreaTop']=Scene_MenuBase[_0x3a25e2(0x423)][_0x3a25e2(0x6a2)],Scene_MenuBase['prototype'][_0x3a25e2(0x6a2)]=function(){const _0x4631bb=_0x3a25e2;let _0x8b9aa8=0x0;return SceneManager[_0x4631bb(0x414)]()?_0x8b9aa8=this['helpAreaTopSideButtonLayout']():_0x8b9aa8=VisuMZ['CoreEngine'][_0x4631bb(0x196)]['call'](this),this[_0x4631bb(0x43a)]()&&this['getButtonAssistLocation']()===_0x4631bb(0x48a)&&(_0x8b9aa8+=Window_ButtonAssist[_0x4631bb(0x423)][_0x4631bb(0x20a)]()),_0x8b9aa8;},Scene_MenuBase['prototype']['helpAreaTopSideButtonLayout']=function(){const _0x394256=_0x3a25e2;return this[_0x394256(0x34d)]()?this[_0x394256(0x351)]():0x0;},VisuMZ['CoreEngine'][_0x3a25e2(0x442)]=Scene_MenuBase[_0x3a25e2(0x423)][_0x3a25e2(0x59d)],Scene_MenuBase['prototype'][_0x3a25e2(0x59d)]=function(){const _0x582b78=_0x3a25e2;return SceneManager['areButtonsOutsideMainUI']()?this[_0x582b78(0x18d)]():VisuMZ[_0x582b78(0x62c)][_0x582b78(0x442)][_0x582b78(0x6d9)](this);},Scene_MenuBase['prototype']['mainAreaTopSideButtonLayout']=function(){const _0x42607b=_0x3a25e2;return!this[_0x42607b(0x34d)]()?this[_0x42607b(0x360)]():0x0;},VisuMZ[_0x3a25e2(0x62c)]['Scene_MenuBase_mainAreaHeight']=Scene_MenuBase[_0x3a25e2(0x423)][_0x3a25e2(0x1f7)],Scene_MenuBase[_0x3a25e2(0x423)][_0x3a25e2(0x1f7)]=function(){const _0x421a5b=_0x3a25e2;let _0x21b993=0x0;return SceneManager[_0x421a5b(0x414)]()?_0x21b993=this[_0x421a5b(0x629)]():_0x21b993=VisuMZ[_0x421a5b(0x62c)]['Scene_MenuBase_mainAreaHeight'][_0x421a5b(0x6d9)](this),this[_0x421a5b(0x43a)]()&&this[_0x421a5b(0x154)]()!==_0x421a5b(0x41e)&&(_0x21b993-=Window_ButtonAssist[_0x421a5b(0x423)][_0x421a5b(0x20a)]()),_0x21b993;},Scene_MenuBase[_0x3a25e2(0x423)][_0x3a25e2(0x629)]=function(){const _0x10d702=_0x3a25e2;return Graphics[_0x10d702(0x56b)]-this[_0x10d702(0x6c0)]();},VisuMZ['CoreEngine'][_0x3a25e2(0x544)]=Scene_MenuBase[_0x3a25e2(0x423)][_0x3a25e2(0x27e)],Scene_MenuBase[_0x3a25e2(0x423)][_0x3a25e2(0x27e)]=function(){const _0x3b672b=_0x3a25e2;this['_backgroundFilter']=new PIXI[(_0x3b672b(0x5a1))][(_0x3b672b(0x46b))](clamp=!![]),this['_backgroundSprite']=new Sprite(),this[_0x3b672b(0x702)]['bitmap']=SceneManager[_0x3b672b(0x6d0)](),this[_0x3b672b(0x702)][_0x3b672b(0x5a1)]=[this[_0x3b672b(0x3b1)]],this[_0x3b672b(0x1c7)](this['_backgroundSprite']),this[_0x3b672b(0x14f)](0xc0),this[_0x3b672b(0x14f)](this[_0x3b672b(0x53b)]()),this[_0x3b672b(0x2c2)]();},Scene_MenuBase[_0x3a25e2(0x423)][_0x3a25e2(0x53b)]=function(){const _0x3b27e1=_0x3a25e2,_0x3648ab=String(this[_0x3b27e1(0x32a)][_0x3b27e1(0x4c4)]),_0x4e0cd9=this[_0x3b27e1(0x3f3)](_0x3648ab);return _0x4e0cd9?_0x4e0cd9[_0x3b27e1(0x584)]:0xc0;},Scene_MenuBase['prototype'][_0x3a25e2(0x2c2)]=function(){const _0x316e58=_0x3a25e2,_0x2a2591=String(this['constructor'][_0x316e58(0x4c4)]),_0x1ed8ed=this[_0x316e58(0x3f3)](_0x2a2591);_0x1ed8ed&&(_0x1ed8ed[_0x316e58(0x5e2)]!==''||_0x1ed8ed['BgFilename2']!=='')&&(this[_0x316e58(0x140)]=new Sprite(ImageManager[_0x316e58(0x637)](_0x1ed8ed[_0x316e58(0x5e2)])),this[_0x316e58(0x6d4)]=new Sprite(ImageManager[_0x316e58(0x6d5)](_0x1ed8ed[_0x316e58(0x194)])),this[_0x316e58(0x1c7)](this[_0x316e58(0x140)]),this[_0x316e58(0x1c7)](this[_0x316e58(0x6d4)]),this['_backSprite1']['bitmap']['addLoadListener'](this['adjustSprite'][_0x316e58(0x4c0)](this,this[_0x316e58(0x140)])),this[_0x316e58(0x6d4)]['bitmap']['addLoadListener'](this[_0x316e58(0x289)][_0x316e58(0x4c0)](this,this[_0x316e58(0x6d4)])));},Scene_MenuBase[_0x3a25e2(0x423)][_0x3a25e2(0x3f3)]=function(_0x2f13a5){const _0x23c353=_0x3a25e2;return VisuMZ['CoreEngine'][_0x23c353(0x2f0)]['MenuBg'][_0x2f13a5]||VisuMZ[_0x23c353(0x62c)][_0x23c353(0x2f0)]['MenuBg'][_0x23c353(0x5d0)];},Scene_MenuBase['prototype'][_0x3a25e2(0x289)]=function(_0x1ac6cf){const _0x120c68=_0x3a25e2;this['scaleSprite'](_0x1ac6cf),this[_0x120c68(0x3f1)](_0x1ac6cf);},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x4a1)]=Scene_MenuBase[_0x3a25e2(0x423)][_0x3a25e2(0x4e3)],Scene_MenuBase[_0x3a25e2(0x423)]['createCancelButton']=function(){const _0x30301f=_0x3a25e2;VisuMZ['CoreEngine'][_0x30301f(0x4a1)][_0x30301f(0x6d9)](this),SceneManager['isSideButtonLayout']()&&this[_0x30301f(0x45a)]();},Scene_MenuBase[_0x3a25e2(0x423)][_0x3a25e2(0x45a)]=function(){const _0x34e0ee=_0x3a25e2;this[_0x34e0ee(0x35f)]['x']=Graphics['boxWidth']+0x4;},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x5d2)]=Scene_MenuBase['prototype'][_0x3a25e2(0x226)],Scene_MenuBase[_0x3a25e2(0x423)][_0x3a25e2(0x226)]=function(){const _0x86a318=_0x3a25e2;VisuMZ[_0x86a318(0x62c)][_0x86a318(0x5d2)]['call'](this),SceneManager[_0x86a318(0x5f9)]()&&this[_0x86a318(0x6dd)]();},Scene_MenuBase['prototype']['movePageButtonSideButtonLayout']=function(){const _0x3e55bc=_0x3a25e2;this[_0x3e55bc(0x324)]['x']=-0x1*(this[_0x3e55bc(0x324)][_0x3e55bc(0x286)]+this[_0x3e55bc(0x564)][_0x3e55bc(0x286)]+0x8),this['_pagedownButton']['x']=-0x1*(this[_0x3e55bc(0x564)][_0x3e55bc(0x286)]+0x4);},Scene_MenuBase[_0x3a25e2(0x423)][_0x3a25e2(0x43a)]=function(){const _0x184600=_0x3a25e2;return VisuMZ[_0x184600(0x62c)][_0x184600(0x2f0)][_0x184600(0x151)][_0x184600(0x387)];},Scene_MenuBase[_0x3a25e2(0x423)]['getButtonAssistLocation']=function(){const _0x145cea=_0x3a25e2;return SceneManager[_0x145cea(0x5f9)]()||SceneManager[_0x145cea(0x2a1)]()?VisuMZ['CoreEngine'][_0x145cea(0x2f0)][_0x145cea(0x151)][_0x145cea(0x19b)]:'button';},Scene_MenuBase[_0x3a25e2(0x423)]['createButtonAssistWindow']=function(){const _0x498354=_0x3a25e2;if(!this[_0x498354(0x43a)]())return;const _0x52870b=this[_0x498354(0x240)]();this['_buttonAssistWindow']=new Window_ButtonAssist(_0x52870b),this[_0x498354(0x31c)](this[_0x498354(0x299)]);},Scene_MenuBase[_0x3a25e2(0x423)]['buttonAssistWindowRect']=function(){const _0x1aa857=_0x3a25e2;return this['getButtonAssistLocation']()===_0x1aa857(0x41e)?this[_0x1aa857(0x574)]():this[_0x1aa857(0x230)]();},Scene_MenuBase[_0x3a25e2(0x423)]['buttonAssistWindowButtonRect']=function(){const _0x59780b=_0x3a25e2,_0x12272d=ConfigManager[_0x59780b(0x309)]?(Sprite_Button[_0x59780b(0x423)][_0x59780b(0x19d)]()+0x6)*0x2:0x0,_0x3c10e1=this['buttonY'](),_0x1ced4d=Graphics[_0x59780b(0x292)]-_0x12272d*0x2,_0x45ec98=this[_0x59780b(0x2f1)]();return new Rectangle(_0x12272d,_0x3c10e1,_0x1ced4d,_0x45ec98);},Scene_MenuBase[_0x3a25e2(0x423)]['buttonAssistWindowSideRect']=function(){const _0x12279f=_0x3a25e2,_0x25235a=Graphics[_0x12279f(0x292)],_0x5325f6=Window_ButtonAssist[_0x12279f(0x423)][_0x12279f(0x20a)](),_0x23cd5b=0x0;let _0x53b2df=0x0;return this['getButtonAssistLocation']()===_0x12279f(0x48a)?_0x53b2df=0x0:_0x53b2df=Graphics[_0x12279f(0x56b)]-_0x5325f6,new Rectangle(_0x23cd5b,_0x53b2df,_0x25235a,_0x5325f6);},Scene_Menu[_0x3a25e2(0x69f)]=VisuMZ[_0x3a25e2(0x62c)]['Settings'][_0x3a25e2(0x3b3)][_0x3a25e2(0x396)],VisuMZ['CoreEngine'][_0x3a25e2(0x337)]=Scene_Menu[_0x3a25e2(0x423)][_0x3a25e2(0x4fd)],Scene_Menu[_0x3a25e2(0x423)][_0x3a25e2(0x4fd)]=function(){const _0x225eea=_0x3a25e2;VisuMZ[_0x225eea(0x62c)][_0x225eea(0x337)][_0x225eea(0x6d9)](this),this['setCoreEngineUpdateWindowBg']();},Scene_Menu[_0x3a25e2(0x423)][_0x3a25e2(0x566)]=function(){const _0x405275=_0x3a25e2;this[_0x405275(0x1b5)]&&this[_0x405275(0x1b5)][_0x405275(0x31d)](Scene_Menu[_0x405275(0x69f)]['CommandBgType']),this['_goldWindow']&&this[_0x405275(0x163)][_0x405275(0x31d)](Scene_Menu['layoutSettings']['GoldBgType']),this[_0x405275(0x2cc)]&&this[_0x405275(0x2cc)]['setBackgroundType'](Scene_Menu[_0x405275(0x69f)][_0x405275(0x242)]);},Scene_Menu[_0x3a25e2(0x423)][_0x3a25e2(0x24d)]=function(){const _0x421ad3=_0x3a25e2;return Scene_Menu[_0x421ad3(0x69f)][_0x421ad3(0x428)][_0x421ad3(0x6d9)](this);},Scene_Menu[_0x3a25e2(0x423)][_0x3a25e2(0x2c7)]=function(){const _0x46f43d=_0x3a25e2;return Scene_Menu[_0x46f43d(0x69f)][_0x46f43d(0x57c)][_0x46f43d(0x6d9)](this);},Scene_Menu['prototype'][_0x3a25e2(0x5ee)]=function(){const _0xd04ecc=_0x3a25e2;return Scene_Menu[_0xd04ecc(0x69f)]['StatusRect']['call'](this);},Scene_Item[_0x3a25e2(0x69f)]=VisuMZ[_0x3a25e2(0x62c)]['Settings'][_0x3a25e2(0x3b3)][_0x3a25e2(0x5b7)],VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x519)]=Scene_Item[_0x3a25e2(0x423)][_0x3a25e2(0x4fd)],Scene_Item['prototype'][_0x3a25e2(0x4fd)]=function(){const _0x42bfb8=_0x3a25e2;VisuMZ[_0x42bfb8(0x62c)][_0x42bfb8(0x519)]['call'](this),this[_0x42bfb8(0x566)]();},Scene_Item[_0x3a25e2(0x423)][_0x3a25e2(0x566)]=function(){const _0x23e0b2=_0x3a25e2;this[_0x23e0b2(0x6da)]&&this[_0x23e0b2(0x6da)]['setBackgroundType'](Scene_Item['layoutSettings']['HelpBgType']),this[_0x23e0b2(0x3bd)]&&this[_0x23e0b2(0x3bd)][_0x23e0b2(0x31d)](Scene_Item[_0x23e0b2(0x69f)][_0x23e0b2(0x6b9)]),this['_itemWindow']&&this[_0x23e0b2(0x1c5)][_0x23e0b2(0x31d)](Scene_Item[_0x23e0b2(0x69f)][_0x23e0b2(0x32c)]),this[_0x23e0b2(0x4c8)]&&this['_actorWindow'][_0x23e0b2(0x31d)](Scene_Item['layoutSettings'][_0x23e0b2(0x2c0)]);},Scene_Item['prototype']['helpWindowRect']=function(){const _0x5f4a21=_0x3a25e2;return Scene_Item['layoutSettings'][_0x5f4a21(0x485)][_0x5f4a21(0x6d9)](this);},Scene_Item['prototype'][_0x3a25e2(0x3d1)]=function(){const _0x526bdb=_0x3a25e2;return Scene_Item[_0x526bdb(0x69f)][_0x526bdb(0x53d)]['call'](this);},Scene_Item[_0x3a25e2(0x423)][_0x3a25e2(0x1c9)]=function(){const _0xfed670=_0x3a25e2;return Scene_Item[_0xfed670(0x69f)][_0xfed670(0x4e2)][_0xfed670(0x6d9)](this);},Scene_Item[_0x3a25e2(0x423)][_0x3a25e2(0x41a)]=function(){const _0x3d3caa=_0x3a25e2;return Scene_Item[_0x3d3caa(0x69f)]['ActorRect']['call'](this);},Scene_Skill['layoutSettings']=VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x2f0)]['MenuLayout'][_0x3a25e2(0x5b0)],VisuMZ['CoreEngine']['Scene_Skill_create']=Scene_Skill[_0x3a25e2(0x423)][_0x3a25e2(0x4fd)],Scene_Skill[_0x3a25e2(0x423)][_0x3a25e2(0x4fd)]=function(){const _0x155987=_0x3a25e2;VisuMZ[_0x155987(0x62c)][_0x155987(0x304)][_0x155987(0x6d9)](this),this[_0x155987(0x566)]();},Scene_Skill[_0x3a25e2(0x423)][_0x3a25e2(0x566)]=function(){const _0x193daf=_0x3a25e2;this[_0x193daf(0x6da)]&&this[_0x193daf(0x6da)]['setBackgroundType'](Scene_Skill[_0x193daf(0x69f)]['HelpBgType']),this['_skillTypeWindow']&&this[_0x193daf(0x69c)][_0x193daf(0x31d)](Scene_Skill[_0x193daf(0x69f)][_0x193daf(0x376)]),this[_0x193daf(0x2cc)]&&this[_0x193daf(0x2cc)]['setBackgroundType'](Scene_Skill[_0x193daf(0x69f)][_0x193daf(0x242)]),this[_0x193daf(0x1c5)]&&this[_0x193daf(0x1c5)][_0x193daf(0x31d)](Scene_Skill[_0x193daf(0x69f)][_0x193daf(0x32c)]),this['_actorWindow']&&this[_0x193daf(0x4c8)][_0x193daf(0x31d)](Scene_Skill['layoutSettings'][_0x193daf(0x2c0)]);},Scene_Skill['prototype'][_0x3a25e2(0x6f0)]=function(){const _0x15508a=_0x3a25e2;return Scene_Skill[_0x15508a(0x69f)]['HelpRect']['call'](this);},Scene_Skill[_0x3a25e2(0x423)][_0x3a25e2(0x15e)]=function(){const _0x38efcf=_0x3a25e2;return Scene_Skill[_0x38efcf(0x69f)][_0x38efcf(0x671)][_0x38efcf(0x6d9)](this);},Scene_Skill[_0x3a25e2(0x423)][_0x3a25e2(0x5ee)]=function(){const _0x3ed2ad=_0x3a25e2;return Scene_Skill['layoutSettings'][_0x3ed2ad(0x3a1)][_0x3ed2ad(0x6d9)](this);},Scene_Skill[_0x3a25e2(0x423)][_0x3a25e2(0x1c9)]=function(){const _0x56f3af=_0x3a25e2;return Scene_Skill[_0x56f3af(0x69f)][_0x56f3af(0x4e2)][_0x56f3af(0x6d9)](this);},Scene_Skill[_0x3a25e2(0x423)]['actorWindowRect']=function(){const _0x1a9f31=_0x3a25e2;return Scene_Skill[_0x1a9f31(0x69f)][_0x1a9f31(0x2dc)][_0x1a9f31(0x6d9)](this);},Scene_Equip[_0x3a25e2(0x69f)]=VisuMZ[_0x3a25e2(0x62c)]['Settings'][_0x3a25e2(0x3b3)][_0x3a25e2(0x518)],VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x582)]=Scene_Equip[_0x3a25e2(0x423)][_0x3a25e2(0x4fd)],Scene_Equip[_0x3a25e2(0x423)][_0x3a25e2(0x4fd)]=function(){const _0x1ace92=_0x3a25e2;VisuMZ['CoreEngine'][_0x1ace92(0x582)][_0x1ace92(0x6d9)](this),this[_0x1ace92(0x566)]();},Scene_Equip[_0x3a25e2(0x423)][_0x3a25e2(0x566)]=function(){const _0x1a555c=_0x3a25e2;this[_0x1a555c(0x6da)]&&this[_0x1a555c(0x6da)][_0x1a555c(0x31d)](Scene_Equip['layoutSettings'][_0x1a555c(0x508)]),this[_0x1a555c(0x2cc)]&&this[_0x1a555c(0x2cc)][_0x1a555c(0x31d)](Scene_Equip[_0x1a555c(0x69f)][_0x1a555c(0x242)]),this[_0x1a555c(0x1b5)]&&this[_0x1a555c(0x1b5)]['setBackgroundType'](Scene_Equip[_0x1a555c(0x69f)][_0x1a555c(0x225)]),this[_0x1a555c(0x6b7)]&&this[_0x1a555c(0x6b7)][_0x1a555c(0x31d)](Scene_Equip[_0x1a555c(0x69f)][_0x1a555c(0x37a)]),this[_0x1a555c(0x1c5)]&&this[_0x1a555c(0x1c5)][_0x1a555c(0x31d)](Scene_Equip[_0x1a555c(0x69f)]['ItemBgType']);},Scene_Equip[_0x3a25e2(0x423)][_0x3a25e2(0x6f0)]=function(){const _0xae08c9=_0x3a25e2;return Scene_Equip[_0xae08c9(0x69f)]['HelpRect'][_0xae08c9(0x6d9)](this);},Scene_Equip[_0x3a25e2(0x423)][_0x3a25e2(0x5ee)]=function(){const _0x278b8e=_0x3a25e2;return Scene_Equip[_0x278b8e(0x69f)][_0x278b8e(0x3a1)]['call'](this);},Scene_Equip[_0x3a25e2(0x423)]['commandWindowRect']=function(){const _0x34a882=_0x3a25e2;return Scene_Equip[_0x34a882(0x69f)][_0x34a882(0x428)][_0x34a882(0x6d9)](this);},Scene_Equip[_0x3a25e2(0x423)][_0x3a25e2(0x20d)]=function(){const _0x11e012=_0x3a25e2;return Scene_Equip[_0x11e012(0x69f)][_0x11e012(0x682)][_0x11e012(0x6d9)](this);},Scene_Equip['prototype']['itemWindowRect']=function(){const _0xff88e4=_0x3a25e2;return Scene_Equip[_0xff88e4(0x69f)]['ItemRect'][_0xff88e4(0x6d9)](this);},Scene_Status[_0x3a25e2(0x69f)]=VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x2f0)][_0x3a25e2(0x3b3)][_0x3a25e2(0x60c)],VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x347)]=Scene_Status[_0x3a25e2(0x423)][_0x3a25e2(0x4fd)],Scene_Status[_0x3a25e2(0x423)][_0x3a25e2(0x4fd)]=function(){const _0x59da73=_0x3a25e2;VisuMZ[_0x59da73(0x62c)][_0x59da73(0x347)][_0x59da73(0x6d9)](this),this[_0x59da73(0x566)]();},Scene_Status[_0x3a25e2(0x423)]['setCoreEngineUpdateWindowBg']=function(){const _0x4c4b7d=_0x3a25e2;this[_0x4c4b7d(0x30e)]&&this[_0x4c4b7d(0x30e)]['setBackgroundType'](Scene_Status[_0x4c4b7d(0x69f)][_0x4c4b7d(0x207)]),this['_statusWindow']&&this[_0x4c4b7d(0x2cc)][_0x4c4b7d(0x31d)](Scene_Status['layoutSettings'][_0x4c4b7d(0x242)]),this[_0x4c4b7d(0x229)]&&this['_statusParamsWindow'][_0x4c4b7d(0x31d)](Scene_Status['layoutSettings'][_0x4c4b7d(0x415)]),this['_statusEquipWindow']&&this[_0x4c4b7d(0x507)][_0x4c4b7d(0x31d)](Scene_Status['layoutSettings'][_0x4c4b7d(0x50d)]);},Scene_Status['prototype'][_0x3a25e2(0x2ee)]=function(){const _0xd489a9=_0x3a25e2;return Scene_Status[_0xd489a9(0x69f)][_0xd489a9(0x498)][_0xd489a9(0x6d9)](this);},Scene_Status[_0x3a25e2(0x423)][_0x3a25e2(0x5ee)]=function(){const _0x18ca8d=_0x3a25e2;return Scene_Status[_0x18ca8d(0x69f)]['StatusRect'][_0x18ca8d(0x6d9)](this);},Scene_Status[_0x3a25e2(0x423)][_0x3a25e2(0x523)]=function(){const _0x3ab847=_0x3a25e2;return Scene_Status[_0x3ab847(0x69f)][_0x3ab847(0x583)][_0x3ab847(0x6d9)](this);},Scene_Status[_0x3a25e2(0x423)][_0x3a25e2(0x2b3)]=function(){const _0x8abc79=_0x3a25e2;return Scene_Status['layoutSettings']['StatusEquipRect'][_0x8abc79(0x6d9)](this);},Scene_Options[_0x3a25e2(0x69f)]=VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x2f0)][_0x3a25e2(0x3b3)][_0x3a25e2(0x16f)],VisuMZ[_0x3a25e2(0x62c)]['Scene_Options_create']=Scene_Options[_0x3a25e2(0x423)][_0x3a25e2(0x4fd)],Scene_Options[_0x3a25e2(0x423)]['create']=function(){const _0x1fa108=_0x3a25e2;VisuMZ['CoreEngine']['Scene_Options_create'][_0x1fa108(0x6d9)](this),this[_0x1fa108(0x566)]();},Scene_Options[_0x3a25e2(0x423)][_0x3a25e2(0x566)]=function(){const _0x4928b1=_0x3a25e2;this[_0x4928b1(0x478)]&&this[_0x4928b1(0x478)][_0x4928b1(0x31d)](Scene_Options[_0x4928b1(0x69f)][_0x4928b1(0x575)]);},Scene_Options[_0x3a25e2(0x423)][_0x3a25e2(0x2ef)]=function(){const _0x3468df=_0x3a25e2;return Scene_Options[_0x3468df(0x69f)]['OptionsRect']['call'](this);},Scene_Save[_0x3a25e2(0x69f)]=VisuMZ[_0x3a25e2(0x62c)]['Settings'][_0x3a25e2(0x3b3)]['SaveMenu'],Scene_Save[_0x3a25e2(0x423)][_0x3a25e2(0x4fd)]=function(){const _0xb5f719=_0x3a25e2;Scene_File[_0xb5f719(0x423)][_0xb5f719(0x4fd)]['call'](this),this['setCoreEngineUpdateWindowBg']();},Scene_Save[_0x3a25e2(0x423)][_0x3a25e2(0x566)]=function(){const _0x350fee=_0x3a25e2;this[_0x350fee(0x6da)]&&this[_0x350fee(0x6da)][_0x350fee(0x31d)](Scene_Save[_0x350fee(0x69f)][_0x350fee(0x508)]),this[_0x350fee(0x693)]&&this[_0x350fee(0x693)][_0x350fee(0x31d)](Scene_Save[_0x350fee(0x69f)][_0x350fee(0x2df)]);},Scene_Save[_0x3a25e2(0x423)]['helpWindowRect']=function(){const _0x3c0989=_0x3a25e2;return Scene_Save[_0x3c0989(0x69f)][_0x3c0989(0x485)][_0x3c0989(0x6d9)](this);},Scene_Save['prototype'][_0x3a25e2(0x4eb)]=function(){const _0x5b9715=_0x3a25e2;return Scene_Save[_0x5b9715(0x69f)][_0x5b9715(0x6df)][_0x5b9715(0x6d9)](this);},Scene_Load[_0x3a25e2(0x69f)]=VisuMZ['CoreEngine'][_0x3a25e2(0x2f0)][_0x3a25e2(0x3b3)][_0x3a25e2(0x572)],Scene_Load['prototype'][_0x3a25e2(0x4fd)]=function(){const _0x236780=_0x3a25e2;Scene_File[_0x236780(0x423)]['create'][_0x236780(0x6d9)](this),this[_0x236780(0x566)]();},Scene_Load[_0x3a25e2(0x423)][_0x3a25e2(0x566)]=function(){const _0x31f85b=_0x3a25e2;this[_0x31f85b(0x6da)]&&this[_0x31f85b(0x6da)][_0x31f85b(0x31d)](Scene_Load['layoutSettings'][_0x31f85b(0x508)]),this['_listWindow']&&this[_0x31f85b(0x693)][_0x31f85b(0x31d)](Scene_Load[_0x31f85b(0x69f)][_0x31f85b(0x2df)]);},Scene_Load[_0x3a25e2(0x423)]['helpWindowRect']=function(){const _0x54c27d=_0x3a25e2;return Scene_Load[_0x54c27d(0x69f)][_0x54c27d(0x485)][_0x54c27d(0x6d9)](this);},Scene_Load['prototype'][_0x3a25e2(0x4eb)]=function(){const _0x491556=_0x3a25e2;return Scene_Load[_0x491556(0x69f)][_0x491556(0x6df)][_0x491556(0x6d9)](this);},Scene_GameEnd['layoutSettings']=VisuMZ['CoreEngine']['Settings'][_0x3a25e2(0x3b3)]['GameEnd'],VisuMZ['CoreEngine'][_0x3a25e2(0x278)]=Scene_GameEnd['prototype'][_0x3a25e2(0x27e)],Scene_GameEnd['prototype'][_0x3a25e2(0x27e)]=function(){const _0x2cc53a=_0x3a25e2;Scene_MenuBase[_0x2cc53a(0x423)][_0x2cc53a(0x27e)][_0x2cc53a(0x6d9)](this);},Scene_GameEnd['prototype'][_0x3a25e2(0x399)]=function(){const _0x13c8cc=_0x3a25e2,_0x5217aa=this[_0x13c8cc(0x24d)]();this[_0x13c8cc(0x1b5)]=new Window_GameEnd(_0x5217aa),this[_0x13c8cc(0x1b5)]['setHandler'](_0x13c8cc(0x6f6),this[_0x13c8cc(0x19a)][_0x13c8cc(0x4c0)](this)),this[_0x13c8cc(0x31c)](this['_commandWindow']),this[_0x13c8cc(0x1b5)][_0x13c8cc(0x31d)](Scene_GameEnd[_0x13c8cc(0x69f)][_0x13c8cc(0x225)]);},Scene_GameEnd[_0x3a25e2(0x423)][_0x3a25e2(0x24d)]=function(){const _0x1f4699=_0x3a25e2;return Scene_GameEnd[_0x1f4699(0x69f)][_0x1f4699(0x428)][_0x1f4699(0x6d9)](this);},Scene_Shop[_0x3a25e2(0x69f)]=VisuMZ['CoreEngine']['Settings'][_0x3a25e2(0x3b3)][_0x3a25e2(0x705)],VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x27a)]=Scene_Shop[_0x3a25e2(0x423)][_0x3a25e2(0x4fd)],Scene_Shop[_0x3a25e2(0x423)][_0x3a25e2(0x4fd)]=function(){const _0x336f75=_0x3a25e2;VisuMZ[_0x336f75(0x62c)][_0x336f75(0x27a)][_0x336f75(0x6d9)](this),this['setCoreEngineUpdateWindowBg']();},Scene_Shop[_0x3a25e2(0x423)][_0x3a25e2(0x566)]=function(){const _0x4b710a=_0x3a25e2;this[_0x4b710a(0x6da)]&&this[_0x4b710a(0x6da)][_0x4b710a(0x31d)](Scene_Shop['layoutSettings']['HelpBgType']),this[_0x4b710a(0x163)]&&this['_goldWindow'][_0x4b710a(0x31d)](Scene_Shop[_0x4b710a(0x69f)][_0x4b710a(0x617)]),this['_commandWindow']&&this[_0x4b710a(0x1b5)]['setBackgroundType'](Scene_Shop[_0x4b710a(0x69f)][_0x4b710a(0x225)]),this[_0x4b710a(0x656)]&&this[_0x4b710a(0x656)]['setBackgroundType'](Scene_Shop['layoutSettings'][_0x4b710a(0x212)]),this['_numberWindow']&&this[_0x4b710a(0x3ae)][_0x4b710a(0x31d)](Scene_Shop[_0x4b710a(0x69f)][_0x4b710a(0x672)]),this[_0x4b710a(0x2cc)]&&this['_statusWindow'][_0x4b710a(0x31d)](Scene_Shop[_0x4b710a(0x69f)][_0x4b710a(0x242)]),this[_0x4b710a(0x3d7)]&&this[_0x4b710a(0x3d7)][_0x4b710a(0x31d)](Scene_Shop[_0x4b710a(0x69f)]['BuyBgType']),this[_0x4b710a(0x3bd)]&&this[_0x4b710a(0x3bd)][_0x4b710a(0x31d)](Scene_Shop[_0x4b710a(0x69f)]['CategoryBgType']),this[_0x4b710a(0x370)]&&this[_0x4b710a(0x370)][_0x4b710a(0x31d)](Scene_Shop['layoutSettings'][_0x4b710a(0x47c)]);},Scene_Shop[_0x3a25e2(0x423)][_0x3a25e2(0x6f0)]=function(){const _0x51ed39=_0x3a25e2;return Scene_Shop[_0x51ed39(0x69f)][_0x51ed39(0x485)]['call'](this);},Scene_Shop[_0x3a25e2(0x423)]['goldWindowRect']=function(){const _0x3b6a54=_0x3a25e2;return Scene_Shop['layoutSettings']['GoldRect'][_0x3b6a54(0x6d9)](this);},Scene_Shop[_0x3a25e2(0x423)]['commandWindowRect']=function(){return Scene_Shop['layoutSettings']['CommandRect']['call'](this);},Scene_Shop[_0x3a25e2(0x423)][_0x3a25e2(0x287)]=function(){const _0x160bc4=_0x3a25e2;return Scene_Shop[_0x160bc4(0x69f)][_0x160bc4(0x6bc)][_0x160bc4(0x6d9)](this);},Scene_Shop[_0x3a25e2(0x423)][_0x3a25e2(0x479)]=function(){const _0x1d0fc2=_0x3a25e2;return Scene_Shop['layoutSettings'][_0x1d0fc2(0x297)][_0x1d0fc2(0x6d9)](this);},Scene_Shop[_0x3a25e2(0x423)][_0x3a25e2(0x5ee)]=function(){return Scene_Shop['layoutSettings']['StatusRect']['call'](this);},Scene_Shop['prototype']['buyWindowRect']=function(){const _0x46ed0b=_0x3a25e2;return Scene_Shop[_0x46ed0b(0x69f)]['BuyRect'][_0x46ed0b(0x6d9)](this);},Scene_Shop['prototype'][_0x3a25e2(0x3d1)]=function(){const _0x160120=_0x3a25e2;return Scene_Shop['layoutSettings'][_0x160120(0x53d)][_0x160120(0x6d9)](this);},Scene_Shop[_0x3a25e2(0x423)][_0x3a25e2(0x422)]=function(){const _0x5e7893=_0x3a25e2;return Scene_Shop['layoutSettings'][_0x5e7893(0x4e9)]['call'](this);},Scene_Name['layoutSettings']=VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x2f0)][_0x3a25e2(0x3b3)][_0x3a25e2(0x6ab)],VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x6bd)]=Scene_Name['prototype'][_0x3a25e2(0x4fd)],Scene_Name[_0x3a25e2(0x423)][_0x3a25e2(0x4fd)]=function(){const _0x1b6436=_0x3a25e2;VisuMZ[_0x1b6436(0x62c)]['Scene_Name_create'][_0x1b6436(0x6d9)](this),this['setCoreEngineUpdateWindowBg']();},Scene_Name[_0x3a25e2(0x423)]['setCoreEngineUpdateWindowBg']=function(){const _0x2d924e=_0x3a25e2;this[_0x2d924e(0x57f)]&&this['_editWindow'][_0x2d924e(0x31d)](Scene_Name[_0x2d924e(0x69f)][_0x2d924e(0x635)]),this['_inputWindow']&&this['_inputWindow'][_0x2d924e(0x31d)](Scene_Name[_0x2d924e(0x69f)][_0x2d924e(0x68a)]);},Scene_Name[_0x3a25e2(0x423)][_0x3a25e2(0x6c0)]=function(){return 0x0;},Scene_Name[_0x3a25e2(0x423)]['editWindowRect']=function(){const _0x9e7a95=_0x3a25e2;return Scene_Name[_0x9e7a95(0x69f)]['EditRect'][_0x9e7a95(0x6d9)](this);},Scene_Name[_0x3a25e2(0x423)]['inputWindowRect']=function(){const _0x2970aa=_0x3a25e2;return Scene_Name[_0x2970aa(0x69f)][_0x2970aa(0x395)]['call'](this);},Scene_Name[_0x3a25e2(0x423)][_0x3a25e2(0x13f)]=function(){const _0x50bd3d=_0x3a25e2;if(!this[_0x50bd3d(0x235)])return![];return VisuMZ[_0x50bd3d(0x62c)][_0x50bd3d(0x2f0)][_0x50bd3d(0x412)][_0x50bd3d(0x13f)];},Scene_Name[_0x3a25e2(0x423)][_0x3a25e2(0x2d7)]=function(){const _0x4b67e6=_0x3a25e2;return this[_0x4b67e6(0x13f)]()?TextManager[_0x4b67e6(0x5a3)](_0x4b67e6(0x15b)):Scene_MenuBase['prototype']['buttonAssistKey1'][_0x4b67e6(0x6d9)](this);},Scene_Name[_0x3a25e2(0x423)][_0x3a25e2(0x687)]=function(){const _0x119c6e=_0x3a25e2;if(this[_0x119c6e(0x13f)]()){const _0x305690=VisuMZ[_0x119c6e(0x62c)][_0x119c6e(0x2f0)][_0x119c6e(0x412)];return this['_inputWindow'][_0x119c6e(0x3f4)]===_0x119c6e(0x620)?_0x305690[_0x119c6e(0x64a)]||'Keyboard':_0x305690[_0x119c6e(0x679)]||'Manual';}else return Scene_MenuBase['prototype'][_0x119c6e(0x687)]['call'](this);},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x43e)]=Scene_Battle[_0x3a25e2(0x423)]['update'],Scene_Battle['prototype'][_0x3a25e2(0x6cd)]=function(){const _0x561381=_0x3a25e2;VisuMZ[_0x561381(0x62c)][_0x561381(0x43e)][_0x561381(0x6d9)](this);if($gameTemp[_0x561381(0x1f1)])this[_0x561381(0x247)]();},Scene_Battle[_0x3a25e2(0x423)][_0x3a25e2(0x247)]=function(){const _0x28226b=_0x3a25e2;!BattleManager[_0x28226b(0x2f5)]()&&!this[_0x28226b(0x344)]&&!$gameMessage['isBusy']()&&(this[_0x28226b(0x344)]=!![],this[_0x28226b(0x6cd)](),SceneManager[_0x28226b(0x326)](),this['_playtestF7Looping']=![]);},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x491)]=Scene_Battle[_0x3a25e2(0x423)][_0x3a25e2(0x4e3)],Scene_Battle[_0x3a25e2(0x423)][_0x3a25e2(0x4e3)]=function(){const _0x4119b7=_0x3a25e2;VisuMZ[_0x4119b7(0x62c)][_0x4119b7(0x491)]['call'](this),SceneManager[_0x4119b7(0x5f9)]()&&this['repositionCancelButtonSideButtonLayout']();},Scene_Battle['prototype']['repositionCancelButtonSideButtonLayout']=function(){const _0x186194=_0x3a25e2;this[_0x186194(0x35f)]['x']=Graphics['boxWidth']+0x4,this[_0x186194(0x644)]()?this['_cancelButton']['y']=Graphics[_0x186194(0x56b)]-this[_0x186194(0x2f1)]():this['_cancelButton']['y']=0x0;},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x285)]=Sprite_Button[_0x3a25e2(0x423)][_0x3a25e2(0x14d)],Sprite_Button['prototype']['initialize']=function(_0x2c296b){const _0x781677=_0x3a25e2;VisuMZ[_0x781677(0x62c)][_0x781677(0x285)][_0x781677(0x6d9)](this,_0x2c296b),this[_0x781677(0x49a)]();},Sprite_Button[_0x3a25e2(0x423)]['initButtonHidden']=function(){const _0xb36f32=_0x3a25e2,_0x481004=VisuMZ[_0xb36f32(0x62c)][_0xb36f32(0x2f0)]['UI'];this[_0xb36f32(0x2e9)]=![];switch(this[_0xb36f32(0x288)]){case _0xb36f32(0x6f6):this[_0xb36f32(0x2e9)]=!_0x481004[_0xb36f32(0x614)];break;case _0xb36f32(0x47a):case _0xb36f32(0x2a5):this[_0xb36f32(0x2e9)]=!_0x481004[_0xb36f32(0x161)];break;case'down':case'up':case _0xb36f32(0x60b):case _0xb36f32(0x319):case'ok':this[_0xb36f32(0x2e9)]=!_0x481004[_0xb36f32(0x658)];break;case _0xb36f32(0x20f):this[_0xb36f32(0x2e9)]=!_0x481004[_0xb36f32(0x349)];break;}},VisuMZ['CoreEngine']['Sprite_Button_updateOpacity']=Sprite_Button[_0x3a25e2(0x423)][_0x3a25e2(0x65b)],Sprite_Button[_0x3a25e2(0x423)][_0x3a25e2(0x65b)]=function(){const _0x580237=_0x3a25e2;SceneManager[_0x580237(0x2a1)]()||this[_0x580237(0x2e9)]?this['hideButtonFromView']():VisuMZ['CoreEngine'][_0x580237(0x654)]['call'](this);},Sprite_Button[_0x3a25e2(0x423)][_0x3a25e2(0x610)]=function(){const _0x5cc066=_0x3a25e2;this[_0x5cc066(0x1a5)]=![],this[_0x5cc066(0x2b1)]=0x0,this['x']=Graphics[_0x5cc066(0x286)]*0xa,this['y']=Graphics['height']*0xa;},VisuMZ[_0x3a25e2(0x62c)]['Sprite_Battler_startMove']=Sprite_Battler['prototype'][_0x3a25e2(0x2aa)],Sprite_Battler[_0x3a25e2(0x423)][_0x3a25e2(0x2aa)]=function(_0x910fc3,_0x13a40c,_0x5e6860){const _0x23f302=_0x3a25e2;(this[_0x23f302(0x417)]!==_0x910fc3||this[_0x23f302(0x60a)]!==_0x13a40c)&&(this[_0x23f302(0x1ce)](_0x23f302(0x1c1)),this[_0x23f302(0x5c6)]=_0x5e6860),VisuMZ[_0x23f302(0x62c)][_0x23f302(0x6c5)][_0x23f302(0x6d9)](this,_0x910fc3,_0x13a40c,_0x5e6860);},Sprite_Battler[_0x3a25e2(0x423)][_0x3a25e2(0x1ce)]=function(_0x31ef72){const _0x4cb328=_0x3a25e2;this[_0x4cb328(0x4ff)]=_0x31ef72;},Sprite_Battler[_0x3a25e2(0x423)][_0x3a25e2(0x1d8)]=function(){const _0x2bed13=_0x3a25e2;if(this[_0x2bed13(0x4da)]<=0x0)return;const _0x16170d=this[_0x2bed13(0x4da)],_0x51b020=this[_0x2bed13(0x5c6)],_0x36e9ca=this[_0x2bed13(0x4ff)];this[_0x2bed13(0x633)]=this[_0x2bed13(0x1e0)](this[_0x2bed13(0x633)],this[_0x2bed13(0x417)],_0x16170d,_0x51b020,_0x36e9ca),this['_offsetY']=this[_0x2bed13(0x1e0)](this[_0x2bed13(0x1aa)],this[_0x2bed13(0x60a)],_0x16170d,_0x51b020,_0x36e9ca),this['_movementDuration']--;if(this['_movementDuration']<=0x0)this[_0x2bed13(0x155)]();},Sprite_Battler['prototype']['applyEasing']=function(_0x31ce34,_0x2b136e,_0x1272c7,_0x2ec1f1,_0xf9c685){const _0x18efec=_0x3a25e2,_0xbc7ec7=VisuMZ[_0x18efec(0x41c)]((_0x2ec1f1-_0x1272c7)/_0x2ec1f1,_0xf9c685||_0x18efec(0x1c1)),_0x506d59=VisuMZ[_0x18efec(0x41c)]((_0x2ec1f1-_0x1272c7+0x1)/_0x2ec1f1,_0xf9c685||_0x18efec(0x1c1)),_0x2b8ace=(_0x31ce34-_0x2b136e*_0xbc7ec7)/(0x1-_0xbc7ec7);return _0x2b8ace+(_0x2b136e-_0x2b8ace)*_0x506d59;},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x1ea)]=Sprite_Actor[_0x3a25e2(0x423)][_0x3a25e2(0x1e7)],Sprite_Actor[_0x3a25e2(0x423)][_0x3a25e2(0x1e7)]=function(_0x56abc7){const _0x18522b=_0x3a25e2;VisuMZ[_0x18522b(0x62c)][_0x18522b(0x2f0)]['UI']['RepositionActors']?this[_0x18522b(0x272)](_0x56abc7):VisuMZ['CoreEngine']['Sprite_Actor_setActorHome']['call'](this,_0x56abc7);},Sprite_Actor[_0x3a25e2(0x423)][_0x3a25e2(0x272)]=function(_0x32607b){const _0x386e64=_0x3a25e2;let _0xf4f07=Math[_0x386e64(0x1a1)](Graphics[_0x386e64(0x286)]/0x2+0xc0);_0xf4f07-=Math[_0x386e64(0x6f7)]((Graphics[_0x386e64(0x286)]-Graphics[_0x386e64(0x292)])/0x2),_0xf4f07+=_0x32607b*0x20;let _0x2281ad=Graphics[_0x386e64(0x5fe)]-0xc8-$gameParty['maxBattleMembers']()*0x30;_0x2281ad-=Math['floor']((Graphics[_0x386e64(0x5fe)]-Graphics[_0x386e64(0x56b)])/0x2),_0x2281ad+=_0x32607b*0x30,this[_0x386e64(0x13a)](_0xf4f07,_0x2281ad);},Sprite_Actor[_0x3a25e2(0x423)][_0x3a25e2(0x300)]=function(){const _0x14a80d=_0x3a25e2;this[_0x14a80d(0x2aa)](0x4b0,0x0,0x78);},Sprite_Animation[_0x3a25e2(0x423)][_0x3a25e2(0x2c6)]=function(_0xf2005a){this['_muteSound']=_0xf2005a;},VisuMZ['CoreEngine']['Sprite_Animation_processSoundTimings']=Sprite_Animation[_0x3a25e2(0x423)]['processSoundTimings'],Sprite_Animation[_0x3a25e2(0x423)][_0x3a25e2(0x37b)]=function(){const _0x4365c6=_0x3a25e2;if(this['_muteSound'])return;VisuMZ['CoreEngine'][_0x4365c6(0x3cb)][_0x4365c6(0x6d9)](this);},Sprite_Animation[_0x3a25e2(0x423)][_0x3a25e2(0x38c)]=function(_0xf02b2d){const _0x3a6b37=_0x3a25e2;if(_0xf02b2d[_0x3a6b37(0x468)]){}const _0x294171=this[_0x3a6b37(0x2b9)][_0x3a6b37(0x4c4)];let _0x2e7713=_0xf02b2d['height']*_0xf02b2d[_0x3a6b37(0x638)]['y'],_0x57213c=0x0,_0x51c6d5=-_0x2e7713/0x2;if(_0x294171[_0x3a6b37(0x175)](/<(?:HEAD|HEADER|TOP)>/i))_0x51c6d5=-_0x2e7713;if(_0x294171['match'](/<(?:FOOT|FOOTER|BOTTOM)>/i))_0x51c6d5=0x0;if(_0x294171[_0x3a6b37(0x175)](/<(?:LEFT)>/i))_0x57213c=-_0xf02b2d[_0x3a6b37(0x286)]/0x2;if(_0x294171['match'](/<(?:RIGHT)>/i))_0x51c6d5=_0xf02b2d[_0x3a6b37(0x286)]/0x2;if(_0x294171[_0x3a6b37(0x175)](/<ANCHOR X:[ ](\d+\.?\d*)>/i))_0x57213c=Number(RegExp['$1'])*_0xf02b2d[_0x3a6b37(0x286)];_0x294171['match'](/<ANCHOR Y:[ ](\d+\.?\d*)>/i)&&(_0x51c6d5=(0x1-Number(RegExp['$1']))*-_0x2e7713);_0x294171[_0x3a6b37(0x175)](/<ANCHOR:[ ](\d+\.?\d*),[ ](\d+\.?\d*)>/i)&&(_0x57213c=Number(RegExp['$1'])*_0xf02b2d['width'],_0x51c6d5=(0x1-Number(RegExp['$2']))*-_0x2e7713);if(_0x294171[_0x3a6b37(0x175)](/<OFFSET X:[ ]([\+\-]\d+)>/i))_0x57213c+=Number(RegExp['$1']);if(_0x294171[_0x3a6b37(0x175)](/<OFFSET Y:[ ]([\+\-]\d+)>/i))_0x51c6d5+=Number(RegExp['$1']);_0x294171[_0x3a6b37(0x175)](/<OFFSET:[ ]([\+\-]\d+),[ ]([\+\-]\d+)>/i)&&(_0x57213c+=Number(RegExp['$1']),_0x51c6d5+=Number(RegExp['$2']));const _0x56f2ad=new Point(_0x57213c,_0x51c6d5);return _0xf02b2d[_0x3a6b37(0x557)](),_0xf02b2d[_0x3a6b37(0x6d6)][_0x3a6b37(0x274)](_0x56f2ad);},Sprite_AnimationMV['prototype'][_0x3a25e2(0x2c6)]=function(_0x4a530b){this['_muteSound']=_0x4a530b;},VisuMZ[_0x3a25e2(0x62c)]['Sprite_AnimationMV_processTimingData']=Sprite_AnimationMV[_0x3a25e2(0x423)][_0x3a25e2(0x378)],Sprite_AnimationMV[_0x3a25e2(0x423)][_0x3a25e2(0x378)]=function(_0x2bd137){const _0x570321=_0x3a25e2;this['_muteSound']&&(_0x2bd137=JsonEx[_0x570321(0x1f5)](_0x2bd137),_0x2bd137['se']&&(_0x2bd137['se'][_0x570321(0x66b)]=0x0)),VisuMZ[_0x570321(0x62c)][_0x570321(0x214)][_0x570321(0x6d9)](this,_0x2bd137);},Sprite_Damage['prototype'][_0x3a25e2(0x481)]=function(_0x290b56){const _0xb03483=_0x3a25e2;let _0x35c29c=Math[_0xb03483(0x603)](_0x290b56)[_0xb03483(0x694)]();this[_0xb03483(0x62f)]()&&(_0x35c29c=VisuMZ[_0xb03483(0x21d)](_0x35c29c));const _0x5d285d=this['fontSize'](),_0x5102f9=Math[_0xb03483(0x6f7)](_0x5d285d*0.75);for(let _0x1b43f3=0x0;_0x1b43f3<_0x35c29c['length'];_0x1b43f3++){const _0x158271=this[_0xb03483(0x40d)](_0x5102f9,_0x5d285d);_0x158271[_0xb03483(0x5bd)][_0xb03483(0x180)](_0x35c29c[_0x1b43f3],0x0,0x0,_0x5102f9,_0x5d285d,_0xb03483(0x44c)),_0x158271['x']=(_0x1b43f3-(_0x35c29c['length']-0x1)/0x2)*_0x5102f9,_0x158271['dy']=-_0x1b43f3;}},Sprite_Damage[_0x3a25e2(0x423)][_0x3a25e2(0x62f)]=function(){const _0x53f214=_0x3a25e2;return VisuMZ[_0x53f214(0x62c)]['Settings'][_0x53f214(0x2b0)][_0x53f214(0x607)];},Sprite_Damage[_0x3a25e2(0x423)][_0x3a25e2(0x182)]=function(){const _0x4c9e6a=_0x3a25e2;return ColorManager[_0x4c9e6a(0x5e1)]();},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x5df)]=Sprite_Gauge[_0x3a25e2(0x423)][_0x3a25e2(0x445)],Sprite_Gauge['prototype'][_0x3a25e2(0x445)]=function(){const _0x474d64=_0x3a25e2;return VisuMZ[_0x474d64(0x62c)][_0x474d64(0x5df)][_0x474d64(0x6d9)](this)[_0x474d64(0x2a4)](0x0,0x1);},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x2c8)]=Sprite_Gauge[_0x3a25e2(0x423)][_0x3a25e2(0x6ee)],Sprite_Gauge[_0x3a25e2(0x423)][_0x3a25e2(0x6ee)]=function(){const _0x325772=_0x3a25e2;let _0x387856=VisuMZ[_0x325772(0x62c)][_0x325772(0x2c8)][_0x325772(0x6d9)](this);return _0x387856;},Sprite_Gauge[_0x3a25e2(0x423)][_0x3a25e2(0x4f7)]=function(){const _0x121f69=_0x3a25e2;let _0x243c42=this[_0x121f69(0x6ee)]();this[_0x121f69(0x62f)]()&&(_0x243c42=VisuMZ['GroupDigits'](_0x243c42));const _0x354d71=this[_0x121f69(0x3d6)]()-0x1,_0x2461af=this[_0x121f69(0x197)]();this[_0x121f69(0x237)](),this[_0x121f69(0x5bd)][_0x121f69(0x180)](_0x243c42,0x0,0x0,_0x354d71,_0x2461af,_0x121f69(0x552));},Sprite_Gauge[_0x3a25e2(0x423)][_0x3a25e2(0x63a)]=function(){return 0x3;},Sprite_Gauge[_0x3a25e2(0x423)][_0x3a25e2(0x62f)]=function(){const _0x5a6d6c=_0x3a25e2;return VisuMZ[_0x5a6d6c(0x62c)][_0x5a6d6c(0x2f0)][_0x5a6d6c(0x2b0)][_0x5a6d6c(0x510)];},Sprite_Gauge[_0x3a25e2(0x423)][_0x3a25e2(0x182)]=function(){const _0x112a46=_0x3a25e2;return ColorManager[_0x112a46(0x253)]();};function Sprite_TitlePictureButton(){const _0x54cade=_0x3a25e2;this[_0x54cade(0x14d)](...arguments);}Sprite_TitlePictureButton[_0x3a25e2(0x423)]=Object[_0x3a25e2(0x4fd)](Sprite_Clickable['prototype']),Sprite_TitlePictureButton[_0x3a25e2(0x423)]['constructor']=Sprite_TitlePictureButton,Sprite_TitlePictureButton[_0x3a25e2(0x423)]['initialize']=function(_0x4325e5){const _0x2a1cdf=_0x3a25e2;Sprite_Clickable['prototype'][_0x2a1cdf(0x14d)][_0x2a1cdf(0x6d9)](this),this['_data']=_0x4325e5,this[_0x2a1cdf(0x455)]=null,this[_0x2a1cdf(0x612)]();},Sprite_TitlePictureButton[_0x3a25e2(0x423)][_0x3a25e2(0x612)]=function(){const _0x46a414=_0x3a25e2;this['x']=Graphics[_0x46a414(0x286)],this['y']=Graphics[_0x46a414(0x5fe)],this[_0x46a414(0x1a5)]=![],this['setupButtonImage']();},Sprite_TitlePictureButton[_0x3a25e2(0x423)][_0x3a25e2(0x5a5)]=function(){const _0x18efcc=_0x3a25e2;this['bitmap']=ImageManager[_0x18efcc(0x1e9)](this[_0x18efcc(0x331)][_0x18efcc(0x65c)]),this[_0x18efcc(0x5bd)]['addLoadListener'](this[_0x18efcc(0x1af)][_0x18efcc(0x4c0)](this));},Sprite_TitlePictureButton[_0x3a25e2(0x423)][_0x3a25e2(0x1af)]=function(){const _0xd24bee=_0x3a25e2;this[_0xd24bee(0x331)][_0xd24bee(0x686)][_0xd24bee(0x6d9)](this),this[_0xd24bee(0x331)]['PositionJS'][_0xd24bee(0x6d9)](this),this[_0xd24bee(0x532)](this[_0xd24bee(0x331)][_0xd24bee(0x375)][_0xd24bee(0x4c0)](this));},Sprite_TitlePictureButton[_0x3a25e2(0x423)][_0x3a25e2(0x6cd)]=function(){const _0x5a3660=_0x3a25e2;Sprite_Clickable['prototype'][_0x5a3660(0x6cd)][_0x5a3660(0x6d9)](this),this[_0x5a3660(0x65b)](),this[_0x5a3660(0x222)]();},Sprite_TitlePictureButton[_0x3a25e2(0x423)][_0x3a25e2(0x4a8)]=function(){const _0x2fe8a8=_0x3a25e2;return VisuMZ[_0x2fe8a8(0x62c)][_0x2fe8a8(0x2f0)][_0x2fe8a8(0x3b3)][_0x2fe8a8(0x328)]['ButtonFadeSpeed'];},Sprite_TitlePictureButton['prototype'][_0x3a25e2(0x65b)]=function(){const _0x40ef4d=_0x3a25e2;this['_pressed']?this[_0x40ef4d(0x2b1)]=0xff:(this[_0x40ef4d(0x2b1)]+=this['visible']?this[_0x40ef4d(0x4a8)]():-0x1*this[_0x40ef4d(0x4a8)](),this[_0x40ef4d(0x2b1)]=Math[_0x40ef4d(0x30b)](0xc0,this[_0x40ef4d(0x2b1)]));},Sprite_TitlePictureButton[_0x3a25e2(0x423)][_0x3a25e2(0x532)]=function(_0x24916d){const _0x4a99b3=_0x3a25e2;this[_0x4a99b3(0x455)]=_0x24916d;},Sprite_TitlePictureButton['prototype']['onClick']=function(){const _0x50aedd=_0x3a25e2;this['_clickHandler']&&this[_0x50aedd(0x455)]();},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x17f)]=Spriteset_Base[_0x3a25e2(0x423)][_0x3a25e2(0x14d)],Spriteset_Base['prototype']['initialize']=function(){const _0x2b4656=_0x3a25e2;VisuMZ['CoreEngine'][_0x2b4656(0x17f)][_0x2b4656(0x6d9)](this),this['initMembersCoreEngine']();},Spriteset_Base[_0x3a25e2(0x423)]['initMembersCoreEngine']=function(){const _0x45eec6=_0x3a25e2;this['_fauxAnimationSprites']=[],this[_0x45eec6(0x145)]=this['scale']['x'],this['_cacheScaleY']=this[_0x45eec6(0x638)]['y'];},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x3ca)]=Spriteset_Base[_0x3a25e2(0x423)]['destroy'],Spriteset_Base[_0x3a25e2(0x423)][_0x3a25e2(0x1d3)]=function(_0x4ed182){const _0x2b0cb2=_0x3a25e2;this[_0x2b0cb2(0x142)](),VisuMZ[_0x2b0cb2(0x62c)][_0x2b0cb2(0x3ca)][_0x2b0cb2(0x6d9)](this,_0x4ed182);},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x233)]=Spriteset_Base['prototype'][_0x3a25e2(0x6cd)],Spriteset_Base[_0x3a25e2(0x423)][_0x3a25e2(0x6cd)]=function(){const _0x1b3fcb=_0x3a25e2;VisuMZ[_0x1b3fcb(0x62c)][_0x1b3fcb(0x233)]['call'](this),this[_0x1b3fcb(0x602)](),this[_0x1b3fcb(0x3f9)]();},Spriteset_Base[_0x3a25e2(0x423)][_0x3a25e2(0x602)]=function(){const _0x462197=_0x3a25e2;if(!VisuMZ[_0x462197(0x62c)][_0x462197(0x2f0)]['QoL']['AntiZoomPictures'])return;if(this[_0x462197(0x145)]===this[_0x462197(0x638)]['x']&&this[_0x462197(0x47d)]===this[_0x462197(0x638)]['y'])return;this[_0x462197(0x1c3)](),this[_0x462197(0x145)]=this[_0x462197(0x638)]['x'],this['_cacheScaleY']=this[_0x462197(0x638)]['y'];},Spriteset_Base[_0x3a25e2(0x423)][_0x3a25e2(0x1c3)]=function(){const _0x3d350b=_0x3a25e2;this[_0x3d350b(0x638)]['x']!==0x0&&(this['_pictureContainer'][_0x3d350b(0x638)]['x']=0x1/this[_0x3d350b(0x638)]['x'],this[_0x3d350b(0x30a)]['x']=-(this['x']/this[_0x3d350b(0x638)]['x'])),this[_0x3d350b(0x638)]['y']!==0x0&&(this[_0x3d350b(0x30a)][_0x3d350b(0x638)]['y']=0x1/this[_0x3d350b(0x638)]['y'],this[_0x3d350b(0x30a)]['y']=-(this['y']/this[_0x3d350b(0x638)]['y']));},Spriteset_Base[_0x3a25e2(0x423)]['updateFauxAnimations']=function(){const _0x12bff4=_0x3a25e2;for(const _0x53d822 of this[_0x12bff4(0x3b2)]){!_0x53d822[_0x12bff4(0x659)]()&&this['removeFauxAnimation'](_0x53d822);}this['processFauxAnimationRequests']();},Spriteset_Base[_0x3a25e2(0x423)][_0x3a25e2(0x6ca)]=function(){const _0x401d5a=_0x3a25e2;for(;;){const _0x4ed037=$gameTemp[_0x401d5a(0x6c1)]();if(_0x4ed037)this[_0x401d5a(0x449)](_0x4ed037);else break;}},Spriteset_Base[_0x3a25e2(0x423)]['createFauxAnimation']=function(_0x5cf70d){const _0x5d0749=_0x3a25e2,_0x2bcf5a=$dataAnimations[_0x5cf70d[_0x5d0749(0x25b)]],_0x502df2=_0x5cf70d['targets'],_0x14dac3=_0x5cf70d[_0x5d0749(0x1c8)],_0x16d40e=_0x5cf70d[_0x5d0749(0x317)];let _0x3d54cb=this['animationBaseDelay']();const _0x313e7b=this['animationNextDelay']();if(this['isAnimationForEach'](_0x2bcf5a))for(const _0xf7bfc of _0x502df2){this[_0x5d0749(0x271)]([_0xf7bfc],_0x2bcf5a,_0x14dac3,_0x3d54cb,_0x16d40e),_0x3d54cb+=_0x313e7b;}else this['createFauxAnimationSprite'](_0x502df2,_0x2bcf5a,_0x14dac3,_0x3d54cb,_0x16d40e);},Spriteset_Base['prototype']['createFauxAnimationSprite']=function(_0x3cdf00,_0x448b3d,_0x22dcc9,_0x4d27d4,_0x3d526f){const _0x1faf7e=_0x3a25e2,_0x21135d=this['isMVAnimation'](_0x448b3d),_0x8655cd=new(_0x21135d?Sprite_AnimationMV:Sprite_Animation)(),_0x4a8e86=this['makeTargetSprites'](_0x3cdf00);this[_0x1faf7e(0x342)](_0x3cdf00[0x0])&&(_0x22dcc9=!_0x22dcc9),_0x8655cd[_0x1faf7e(0x1a3)]=_0x3cdf00,_0x8655cd[_0x1faf7e(0x612)](_0x4a8e86,_0x448b3d,_0x22dcc9,_0x4d27d4),_0x8655cd[_0x1faf7e(0x2c6)](_0x3d526f),this[_0x1faf7e(0x41f)][_0x1faf7e(0x1c7)](_0x8655cd),this['_fauxAnimationSprites']['push'](_0x8655cd);},Spriteset_Base[_0x3a25e2(0x423)][_0x3a25e2(0x3e1)]=function(_0x4545d8){const _0x45864d=_0x3a25e2;this[_0x45864d(0x3b2)][_0x45864d(0x2d4)](_0x4545d8),this[_0x45864d(0x41f)][_0x45864d(0x4be)](_0x4545d8);for(const _0x577545 of _0x4545d8[_0x45864d(0x1a3)]){_0x577545['endAnimation']&&_0x577545[_0x45864d(0x165)]();}_0x4545d8[_0x45864d(0x1d3)]();},Spriteset_Base[_0x3a25e2(0x423)][_0x3a25e2(0x142)]=function(){const _0x15f385=_0x3a25e2;for(const _0x1c5fdc of this[_0x15f385(0x3b2)]){this['removeFauxAnimation'](_0x1c5fdc);}},Spriteset_Base[_0x3a25e2(0x423)][_0x3a25e2(0x649)]=function(){const _0x3fe993=_0x3a25e2;return this[_0x3fe993(0x3b2)][_0x3fe993(0x200)]>0x0;},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x660)]=Spriteset_Base[_0x3a25e2(0x423)]['updatePosition'],Spriteset_Base[_0x3a25e2(0x423)]['updatePosition']=function(){const _0x295921=_0x3a25e2;VisuMZ[_0x295921(0x62c)][_0x295921(0x660)][_0x295921(0x6d9)](this),this[_0x295921(0x1fd)]();},Spriteset_Base[_0x3a25e2(0x423)][_0x3a25e2(0x1fd)]=function(){const _0x2afff2=_0x3a25e2;if(!$gameScreen)return;if($gameScreen['_shakeDuration']<=0x0)return;this['x']-=Math[_0x2afff2(0x1a1)]($gameScreen['shake']());const _0x443a16=$gameScreen['getCoreEngineScreenShakeStyle']();switch($gameScreen[_0x2afff2(0x5f6)]()){case _0x2afff2(0x6de):this['updatePositionCoreEngineShakeOriginal']();break;case _0x2afff2(0x643):this[_0x2afff2(0x254)]();break;case _0x2afff2(0x156):this[_0x2afff2(0x6a5)]();break;default:this[_0x2afff2(0x640)]();break;}},Spriteset_Base[_0x3a25e2(0x423)][_0x3a25e2(0x690)]=function(){const _0x4c41a4=_0x3a25e2,_0x1a9781=VisuMZ[_0x4c41a4(0x62c)][_0x4c41a4(0x2f0)][_0x4c41a4(0x29c)];if(_0x1a9781&&_0x1a9781[_0x4c41a4(0x184)])return _0x1a9781[_0x4c41a4(0x184)]['call'](this);this['x']+=Math[_0x4c41a4(0x1a1)]($gameScreen['shake']());},Spriteset_Base[_0x3a25e2(0x423)][_0x3a25e2(0x640)]=function(){const _0x41e42d=_0x3a25e2,_0x450d0f=VisuMZ['CoreEngine']['Settings'][_0x41e42d(0x29c)];if(_0x450d0f&&_0x450d0f['randomJS'])return _0x450d0f[_0x41e42d(0x6b8)]['call'](this);const _0x2b24b7=$gameScreen['_shakePower']*0.75,_0xdb29dc=$gameScreen['_shakeSpeed']*0.6,_0x44a10a=$gameScreen[_0x41e42d(0x6a8)];this['x']+=Math[_0x41e42d(0x1a1)](Math[_0x41e42d(0x4b0)](_0x2b24b7)-Math[_0x41e42d(0x4b0)](_0xdb29dc))*(Math['min'](_0x44a10a,0x1e)*0.5),this['y']+=Math[_0x41e42d(0x1a1)](Math[_0x41e42d(0x4b0)](_0x2b24b7)-Math['randomInt'](_0xdb29dc))*(Math['min'](_0x44a10a,0x1e)*0.5);},Spriteset_Base[_0x3a25e2(0x423)][_0x3a25e2(0x254)]=function(){const _0x56cddf=_0x3a25e2,_0x414f8e=VisuMZ['CoreEngine'][_0x56cddf(0x2f0)]['ScreenShake'];if(_0x414f8e&&_0x414f8e['horzJS'])return _0x414f8e[_0x56cddf(0x1c0)]['call'](this);const _0x4605b6=$gameScreen[_0x56cddf(0x51f)]*0.75,_0x545306=$gameScreen[_0x56cddf(0x321)]*0.6,_0x3b0a80=$gameScreen[_0x56cddf(0x6a8)];this['x']+=Math[_0x56cddf(0x1a1)](Math[_0x56cddf(0x4b0)](_0x4605b6)-Math['randomInt'](_0x545306))*(Math[_0x56cddf(0x30b)](_0x3b0a80,0x1e)*0.5);},Spriteset_Base['prototype'][_0x3a25e2(0x6a5)]=function(){const _0x1c932e=_0x3a25e2,_0x3fba49=VisuMZ[_0x1c932e(0x62c)][_0x1c932e(0x2f0)][_0x1c932e(0x29c)];if(_0x3fba49&&_0x3fba49[_0x1c932e(0x380)])return _0x3fba49[_0x1c932e(0x380)][_0x1c932e(0x6d9)](this);const _0x520315=$gameScreen[_0x1c932e(0x51f)]*0.75,_0x2d0766=$gameScreen[_0x1c932e(0x321)]*0.6,_0x3231e8=$gameScreen[_0x1c932e(0x6a8)];this['y']+=Math['round'](Math[_0x1c932e(0x4b0)](_0x520315)-Math['randomInt'](_0x2d0766))*(Math[_0x1c932e(0x30b)](_0x3231e8,0x1e)*0.5);},Spriteset_Battle['prototype']['createBackground']=function(){const _0x24a2b8=_0x3a25e2;this[_0x24a2b8(0x3b1)]=new PIXI[(_0x24a2b8(0x5a1))][(_0x24a2b8(0x46b))](clamp=!![]),this[_0x24a2b8(0x702)]=new Sprite(),this['_backgroundSprite'][_0x24a2b8(0x5bd)]=SceneManager['backgroundBitmap'](),this[_0x24a2b8(0x702)][_0x24a2b8(0x5a1)]=[this[_0x24a2b8(0x3b1)]],this[_0x24a2b8(0x3e3)][_0x24a2b8(0x1c7)](this[_0x24a2b8(0x702)]);},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x4dd)]=Spriteset_Battle[_0x3a25e2(0x423)][_0x3a25e2(0x429)],Spriteset_Battle[_0x3a25e2(0x423)][_0x3a25e2(0x429)]=function(){const _0x42737b=_0x3a25e2;VisuMZ['CoreEngine'][_0x42737b(0x2f0)]['UI'][_0x42737b(0x270)]&&this[_0x42737b(0x188)](),VisuMZ[_0x42737b(0x62c)][_0x42737b(0x4dd)]['call'](this);},Spriteset_Battle[_0x3a25e2(0x423)][_0x3a25e2(0x188)]=function(){const _0x2b452d=_0x3a25e2;for(member of $gameTroop['members']()){member[_0x2b452d(0x1ac)]();}},VisuMZ['CoreEngine']['Window_Base_initialize']=Window_Base[_0x3a25e2(0x423)][_0x3a25e2(0x14d)],Window_Base[_0x3a25e2(0x423)][_0x3a25e2(0x14d)]=function(_0x38bb04){const _0x271df1=_0x3a25e2;_0x38bb04['x']=Math[_0x271df1(0x1a1)](_0x38bb04['x']),_0x38bb04['y']=Math[_0x271df1(0x1a1)](_0x38bb04['y']),_0x38bb04[_0x271df1(0x286)]=Math[_0x271df1(0x1a1)](_0x38bb04[_0x271df1(0x286)]),_0x38bb04[_0x271df1(0x5fe)]=Math[_0x271df1(0x1a1)](_0x38bb04[_0x271df1(0x5fe)]),this[_0x271df1(0x5c9)](),VisuMZ[_0x271df1(0x62c)][_0x271df1(0x6d7)][_0x271df1(0x6d9)](this,_0x38bb04),this['initCoreEasing']();},Window_Base[_0x3a25e2(0x423)]['initDigitGrouping']=function(){const _0x15630d=_0x3a25e2;this[_0x15630d(0x170)]=VisuMZ[_0x15630d(0x62c)][_0x15630d(0x2f0)][_0x15630d(0x2b0)]['DigitGroupingStandardText'],this[_0x15630d(0x220)]=VisuMZ['CoreEngine'][_0x15630d(0x2f0)][_0x15630d(0x2b0)][_0x15630d(0x45b)];},Window_Base[_0x3a25e2(0x423)][_0x3a25e2(0x20a)]=function(){const _0x2e2306=_0x3a25e2;return VisuMZ[_0x2e2306(0x62c)]['Settings'][_0x2e2306(0x6ac)][_0x2e2306(0x202)];},Window_Base['prototype']['itemPadding']=function(){const _0x3f9bd3=_0x3a25e2;return VisuMZ[_0x3f9bd3(0x62c)][_0x3f9bd3(0x2f0)]['Window'][_0x3f9bd3(0x3b0)];},Window_Base[_0x3a25e2(0x423)][_0x3a25e2(0x6d3)]=function(){const _0x3fa4b2=_0x3a25e2;this['backOpacity']=VisuMZ[_0x3fa4b2(0x62c)]['Settings'][_0x3fa4b2(0x6ac)]['BackOpacity'];},Window_Base[_0x3a25e2(0x423)]['translucentOpacity']=function(){const _0x2b9213=_0x3a25e2;return VisuMZ[_0x2b9213(0x62c)][_0x2b9213(0x2f0)][_0x2b9213(0x6ac)][_0x2b9213(0x632)];},Window_Base['prototype'][_0x3a25e2(0x2be)]=function(){const _0x92a046=_0x3a25e2;return VisuMZ[_0x92a046(0x62c)]['Settings'][_0x92a046(0x6ac)][_0x92a046(0x458)];},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x486)]=Window_Base[_0x3a25e2(0x423)]['update'],Window_Base[_0x3a25e2(0x423)][_0x3a25e2(0x6cd)]=function(){const _0x23dd26=_0x3a25e2;VisuMZ['CoreEngine'][_0x23dd26(0x486)][_0x23dd26(0x6d9)](this),this[_0x23dd26(0x4db)]();},Window_Base['prototype'][_0x3a25e2(0x2b7)]=function(){const _0x16d64c=_0x3a25e2;this['_opening']&&(this[_0x16d64c(0x410)]+=this[_0x16d64c(0x2be)](),this[_0x16d64c(0x68b)]()&&(this['_opening']=![]));},Window_Base[_0x3a25e2(0x423)][_0x3a25e2(0x50e)]=function(){const _0x5a0043=_0x3a25e2;this['_closing']&&(this[_0x5a0043(0x410)]-=this[_0x5a0043(0x2be)](),this['isClosed']()&&(this[_0x5a0043(0x2e0)]=![]));},VisuMZ['CoreEngine'][_0x3a25e2(0x5e7)]=Window_Base['prototype'][_0x3a25e2(0x180)],Window_Base[_0x3a25e2(0x423)][_0x3a25e2(0x180)]=function(_0x53977e,_0x315fc0,_0x2703df,_0x1d2307,_0x453020){const _0x2ef03b=_0x3a25e2;if(this[_0x2ef03b(0x62f)]())_0x53977e=VisuMZ[_0x2ef03b(0x21d)](_0x53977e);VisuMZ[_0x2ef03b(0x62c)][_0x2ef03b(0x5e7)][_0x2ef03b(0x6d9)](this,_0x53977e,_0x315fc0,_0x2703df,_0x1d2307,_0x453020);},Window_Base['prototype']['useDigitGrouping']=function(){const _0xf3becf=_0x3a25e2;return this[_0xf3becf(0x170)];},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x54f)]=Window_Base[_0x3a25e2(0x423)][_0x3a25e2(0x3ab)],Window_Base['prototype'][_0x3a25e2(0x3ab)]=function(_0x1f3ea6,_0x1ce16f,_0x3df819,_0x341d4b){const _0x3f7451=_0x3a25e2;var _0x20d36a=VisuMZ[_0x3f7451(0x62c)]['Window_Base_createTextState'][_0x3f7451(0x6d9)](this,_0x1f3ea6,_0x1ce16f,_0x3df819,_0x341d4b);if(this[_0x3f7451(0x24f)]())_0x20d36a[_0x3f7451(0x4d5)]=VisuMZ[_0x3f7451(0x21d)](_0x20d36a['text']);return _0x20d36a;},Window_Base['prototype'][_0x3a25e2(0x24f)]=function(){const _0x1dfde5=_0x3a25e2;return this[_0x1dfde5(0x220)];},Window_Base[_0x3a25e2(0x423)]['enableDigitGrouping']=function(_0x4c1afc){const _0x29fdf4=_0x3a25e2;this[_0x29fdf4(0x170)]=_0x4c1afc;},Window_Base['prototype'][_0x3a25e2(0x6e8)]=function(_0x146f15){const _0x3e411a=_0x3a25e2;this[_0x3e411a(0x220)]=_0x146f15;},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x4b9)]=Window_Base[_0x3a25e2(0x423)][_0x3a25e2(0x663)],Window_Base[_0x3a25e2(0x423)]['drawIcon']=function(_0x2498d7,_0x20bba2,_0x3b8114){const _0x344bcd=_0x3a25e2;_0x20bba2=Math[_0x344bcd(0x1a1)](_0x20bba2),_0x3b8114=Math['round'](_0x3b8114),VisuMZ[_0x344bcd(0x62c)]['Window_Base_drawIcon'][_0x344bcd(0x6d9)](this,_0x2498d7,_0x20bba2,_0x3b8114);},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x37f)]=Window_Base[_0x3a25e2(0x423)][_0x3a25e2(0x1eb)],Window_Base[_0x3a25e2(0x423)][_0x3a25e2(0x1eb)]=function(_0x3d62f2,_0x2f0430,_0x53bc7f,_0x584957,_0x10d647,_0x47c156){const _0x5826d8=_0x3a25e2;_0x10d647=_0x10d647||ImageManager[_0x5826d8(0x258)],_0x47c156=_0x47c156||ImageManager[_0x5826d8(0x6c6)],_0x53bc7f=Math['round'](_0x53bc7f),_0x584957=Math[_0x5826d8(0x1a1)](_0x584957),_0x10d647=Math[_0x5826d8(0x1a1)](_0x10d647),_0x47c156=Math[_0x5826d8(0x1a1)](_0x47c156),VisuMZ[_0x5826d8(0x62c)][_0x5826d8(0x37f)][_0x5826d8(0x6d9)](this,_0x3d62f2,_0x2f0430,_0x53bc7f,_0x584957,_0x10d647,_0x47c156);},VisuMZ['CoreEngine'][_0x3a25e2(0x4f4)]=Window_Base[_0x3a25e2(0x423)][_0x3a25e2(0x6a1)],Window_Base[_0x3a25e2(0x423)][_0x3a25e2(0x6a1)]=function(_0x59db1f,_0x226e81,_0x293bc2,_0x2f82bf){const _0x297328=_0x3a25e2;_0x293bc2=Math['round'](_0x293bc2),_0x2f82bf=Math['round'](_0x2f82bf),VisuMZ[_0x297328(0x62c)]['Window_Base_drawCharacter'][_0x297328(0x6d9)](this,_0x59db1f,_0x226e81,_0x293bc2,_0x2f82bf);},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x619)]=Window_Selectable[_0x3a25e2(0x423)]['itemRect'],Window_Selectable['prototype']['itemRect']=function(_0x507b1d){const _0xb48c73=_0x3a25e2;let _0x1017ec=VisuMZ[_0xb48c73(0x62c)]['Window_Selectable_itemRect'][_0xb48c73(0x6d9)](this,_0x507b1d);return _0x1017ec['x']=Math[_0xb48c73(0x1a1)](_0x1017ec['x']),_0x1017ec['y']=Math[_0xb48c73(0x1a1)](_0x1017ec['y']),_0x1017ec[_0xb48c73(0x286)]=Math[_0xb48c73(0x1a1)](_0x1017ec[_0xb48c73(0x286)]),_0x1017ec[_0xb48c73(0x5fe)]=Math[_0xb48c73(0x1a1)](_0x1017ec[_0xb48c73(0x5fe)]),_0x1017ec;},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x3b8)]=Window_StatusBase[_0x3a25e2(0x423)][_0x3a25e2(0x66f)],Window_StatusBase[_0x3a25e2(0x423)][_0x3a25e2(0x66f)]=function(_0x3a63bc,_0x4f8661,_0x13b551){const _0xe96f06=_0x3a25e2;_0x4f8661=Math['round'](_0x4f8661),_0x13b551=Math[_0xe96f06(0x1a1)](_0x13b551),VisuMZ[_0xe96f06(0x62c)][_0xe96f06(0x3b8)][_0xe96f06(0x6d9)](this,_0x3a63bc,_0x4f8661,_0x13b551);},Window_Base[_0x3a25e2(0x423)][_0x3a25e2(0x473)]=function(){const _0x3e03b0=_0x3a25e2;this[_0x3e03b0(0x2c5)]={'duration':0x0,'wholeDuration':0x0,'type':_0x3e03b0(0x3d9),'targetX':this['x'],'targetY':this['y'],'targetScaleX':this[_0x3e03b0(0x638)]['x'],'targetScaleY':this[_0x3e03b0(0x638)]['y'],'targetOpacity':this[_0x3e03b0(0x2b1)],'targetBackOpacity':this[_0x3e03b0(0x616)],'targetContentsOpacity':this[_0x3e03b0(0x1cb)]};},Window_Base['prototype'][_0x3a25e2(0x4db)]=function(){const _0x5b6a24=_0x3a25e2;if(!this['_coreEasing'])return;if(this[_0x5b6a24(0x2c5)][_0x5b6a24(0x5ef)]<=0x0)return;this['x']=this['applyCoreEasing'](this['x'],this['_coreEasing'][_0x5b6a24(0x273)]),this['y']=this[_0x5b6a24(0x3c4)](this['y'],this[_0x5b6a24(0x2c5)][_0x5b6a24(0x49e)]),this[_0x5b6a24(0x638)]['x']=this[_0x5b6a24(0x3c4)](this['scale']['x'],this[_0x5b6a24(0x2c5)][_0x5b6a24(0x359)]),this[_0x5b6a24(0x638)]['y']=this['applyCoreEasing'](this['scale']['y'],this[_0x5b6a24(0x2c5)][_0x5b6a24(0x35d)]),this[_0x5b6a24(0x2b1)]=this['applyCoreEasing'](this['opacity'],this[_0x5b6a24(0x2c5)][_0x5b6a24(0x13d)]),this['backOpacity']=this[_0x5b6a24(0x3c4)](this[_0x5b6a24(0x616)],this[_0x5b6a24(0x2c5)]['targetBackOpacity']),this[_0x5b6a24(0x1cb)]=this[_0x5b6a24(0x3c4)](this[_0x5b6a24(0x1cb)],this[_0x5b6a24(0x2c5)][_0x5b6a24(0x43c)]),this['_coreEasing'][_0x5b6a24(0x5ef)]--;},Window_Base['prototype'][_0x3a25e2(0x3c4)]=function(_0xefebcd,_0x4ab6e4){const _0x15deaf=_0x3a25e2;if(!this['_coreEasing'])return _0x4ab6e4;const _0x3cf12a=this['_coreEasing']['duration'],_0x235931=this[_0x15deaf(0x2c5)][_0x15deaf(0x239)],_0x24d4ec=this['calcCoreEasing']((_0x235931-_0x3cf12a)/_0x235931),_0x3949c9=this[_0x15deaf(0x676)]((_0x235931-_0x3cf12a+0x1)/_0x235931),_0x51b6ef=(_0xefebcd-_0x4ab6e4*_0x24d4ec)/(0x1-_0x24d4ec);return _0x51b6ef+(_0x4ab6e4-_0x51b6ef)*_0x3949c9;},Window_Base[_0x3a25e2(0x423)][_0x3a25e2(0x676)]=function(_0x4753ef){const _0x27085f=_0x3a25e2;if(!this[_0x27085f(0x2c5)])return _0x4753ef;return VisuMZ['ApplyEasing'](_0x4753ef,this[_0x27085f(0x2c5)][_0x27085f(0x3b4)]||_0x27085f(0x3d9));},Window_Base[_0x3a25e2(0x423)][_0x3a25e2(0x6d1)]=function(_0x4ace9c,_0x354d46){const _0x1b3f3d=_0x3a25e2;if(!this[_0x1b3f3d(0x2c5)])return;this['x']=this[_0x1b3f3d(0x2c5)][_0x1b3f3d(0x273)],this['y']=this[_0x1b3f3d(0x2c5)][_0x1b3f3d(0x49e)],this[_0x1b3f3d(0x638)]['x']=this[_0x1b3f3d(0x2c5)]['targetScaleX'],this[_0x1b3f3d(0x638)]['y']=this['_coreEasing'][_0x1b3f3d(0x35d)],this[_0x1b3f3d(0x2b1)]=this[_0x1b3f3d(0x2c5)][_0x1b3f3d(0x13d)],this[_0x1b3f3d(0x616)]=this[_0x1b3f3d(0x2c5)][_0x1b3f3d(0x61d)],this[_0x1b3f3d(0x1cb)]=this[_0x1b3f3d(0x2c5)][_0x1b3f3d(0x43c)],this[_0x1b3f3d(0x529)](_0x4ace9c,_0x354d46,this['x'],this['y'],this['scale']['x'],this['scale']['y'],this['opacity'],this['backOpacity'],this[_0x1b3f3d(0x1cb)]);},Window_Base['prototype'][_0x3a25e2(0x529)]=function(_0x26572a,_0x593e1c,_0x2490f4,_0x46d987,_0x35d257,_0x69f12a,_0x5d0844,_0x4ae252,_0x698b37){const _0x4a2f4b=_0x3a25e2;this[_0x4a2f4b(0x2c5)]={'duration':_0x26572a,'wholeDuration':_0x26572a,'type':_0x593e1c,'targetX':_0x2490f4,'targetY':_0x46d987,'targetScaleX':_0x35d257,'targetScaleY':_0x69f12a,'targetOpacity':_0x5d0844,'targetBackOpacity':_0x4ae252,'targetContentsOpacity':_0x698b37};},Window_Base['prototype'][_0x3a25e2(0x560)]=function(_0x114162,_0x185441,_0x21f44a,_0x2b18aa,_0x61a247){const _0x2c7d69=_0x3a25e2;this[_0x2c7d69(0x3e2)](),this['contents'][_0x2c7d69(0x346)]=VisuMZ['CoreEngine'][_0x2c7d69(0x2f0)]['Gold']['GoldFontSize'];const _0x36967e=VisuMZ[_0x2c7d69(0x62c)][_0x2c7d69(0x2f0)][_0x2c7d69(0x1da)][_0x2c7d69(0x6fe)];if(_0x36967e>0x0&&_0x185441===TextManager['currencyUnit']){const _0x41fc74=_0x2b18aa+(this['lineHeight']()-ImageManager[_0x2c7d69(0x6a0)])/0x2;this['drawIcon'](_0x36967e,_0x21f44a+(_0x61a247-ImageManager[_0x2c7d69(0x2e7)]),_0x41fc74),_0x61a247-=ImageManager['iconWidth']+0x4;}else this[_0x2c7d69(0x59a)](ColorManager[_0x2c7d69(0x186)]()),this[_0x2c7d69(0x180)](_0x185441,_0x21f44a,_0x2b18aa,_0x61a247,'right'),_0x61a247-=this[_0x2c7d69(0x2a8)](_0x185441)+0x6;this['resetTextColor']();const _0x1b3173=this[_0x2c7d69(0x2a8)](this['_digitGrouping']?VisuMZ['GroupDigits'](_0x114162):_0x114162);_0x1b3173>_0x61a247?this[_0x2c7d69(0x180)](VisuMZ['CoreEngine'][_0x2c7d69(0x2f0)][_0x2c7d69(0x1da)][_0x2c7d69(0x3ec)],_0x21f44a,_0x2b18aa,_0x61a247,_0x2c7d69(0x552)):this[_0x2c7d69(0x180)](_0x114162,_0x21f44a,_0x2b18aa,_0x61a247,'right'),this[_0x2c7d69(0x3e2)]();},Window_Base[_0x3a25e2(0x423)][_0x3a25e2(0x5af)]=function(_0x582885,_0x385c17,_0x16557a,_0x4a3140,_0x35d6ac){const _0x36f05e=_0x3a25e2,_0x136196=ImageManager['loadSystem'](_0x36f05e(0x50c)),_0x3709c1=ImageManager['iconWidth'],_0x6f2607=ImageManager[_0x36f05e(0x6a0)],_0x5c466e=_0x582885%0x10*_0x3709c1,_0x15530f=Math[_0x36f05e(0x6f7)](_0x582885/0x10)*_0x6f2607,_0x4a1d85=_0x4a3140,_0x2deb8d=_0x4a3140;this[_0x36f05e(0x223)][_0x36f05e(0x377)]['imageSmoothingEnabled']=_0x35d6ac,this['contents']['blt'](_0x136196,_0x5c466e,_0x15530f,_0x3709c1,_0x6f2607,_0x385c17,_0x16557a,_0x4a1d85,_0x2deb8d),this['contents'][_0x36f05e(0x377)][_0x36f05e(0x688)]=!![];},Window_Base['prototype'][_0x3a25e2(0x34a)]=function(_0x4dc35d,_0x535bef,_0x543a16,_0x45302a,_0x50c59c,_0x47db9e){const _0x246747=_0x3a25e2,_0x3f5139=Math[_0x246747(0x6f7)]((_0x543a16-0x2)*_0x45302a),_0x49116c=Sprite_Gauge[_0x246747(0x423)]['gaugeHeight'][_0x246747(0x6d9)](this),_0x5b7e76=_0x535bef+this[_0x246747(0x20a)]()-_0x49116c-0x2;this[_0x246747(0x223)][_0x246747(0x31f)](_0x4dc35d,_0x5b7e76,_0x543a16,_0x49116c,ColorManager[_0x246747(0x172)]()),this[_0x246747(0x223)][_0x246747(0x3a3)](_0x4dc35d+0x1,_0x5b7e76+0x1,_0x3f5139,_0x49116c-0x2,_0x50c59c,_0x47db9e);},Window_Selectable[_0x3a25e2(0x423)]['cursorDown']=function(_0x3b853d){const _0x4c69e4=_0x3a25e2;let _0x54f951=this['index']();const _0x112b3d=this[_0x4c69e4(0x2e6)](),_0x49a268=this[_0x4c69e4(0x452)]();if(this['isUseModernControls']()&&(_0x54f951<_0x112b3d||_0x3b853d&&_0x49a268===0x1)){_0x54f951+=_0x49a268;if(_0x54f951>=_0x112b3d)_0x54f951=_0x112b3d-0x1;this[_0x4c69e4(0x528)](_0x54f951);}else!this[_0x4c69e4(0x1b2)]()&&((_0x54f951<_0x112b3d-_0x49a268||_0x3b853d&&_0x49a268===0x1)&&this[_0x4c69e4(0x528)]((_0x54f951+_0x49a268)%_0x112b3d));},VisuMZ['CoreEngine'][_0x3a25e2(0x2ab)]=Window_Selectable[_0x3a25e2(0x423)]['cursorDown'],Window_Selectable[_0x3a25e2(0x423)][_0x3a25e2(0x33c)]=function(_0xc585ac){const _0x3cfdfa=_0x3a25e2;this[_0x3cfdfa(0x1b2)]()&&_0xc585ac&&this[_0x3cfdfa(0x452)]()===0x1&&this[_0x3cfdfa(0x1e3)]()===this[_0x3cfdfa(0x2e6)]()-0x1?this[_0x3cfdfa(0x528)](0x0):VisuMZ[_0x3cfdfa(0x62c)]['Window_Selectable_cursorDown'][_0x3cfdfa(0x6d9)](this,_0xc585ac);},Window_Selectable[_0x3a25e2(0x423)][_0x3a25e2(0x5e6)]=function(_0x59a79c){const _0x352dba=_0x3a25e2;let _0x1adca5=Math[_0x352dba(0x4ae)](0x0,this[_0x352dba(0x1e3)]());const _0x2df40b=this[_0x352dba(0x2e6)](),_0x3bf488=this[_0x352dba(0x452)]();if(this[_0x352dba(0x1b2)]()&&_0x1adca5>0x0||_0x59a79c&&_0x3bf488===0x1){_0x1adca5-=_0x3bf488;if(_0x1adca5<=0x0)_0x1adca5=0x0;this['smoothSelect'](_0x1adca5);}else!this[_0x352dba(0x1b2)]()&&((_0x1adca5>=_0x3bf488||_0x59a79c&&_0x3bf488===0x1)&&this[_0x352dba(0x528)]((_0x1adca5-_0x3bf488+_0x2df40b)%_0x2df40b));},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x204)]=Window_Selectable[_0x3a25e2(0x423)][_0x3a25e2(0x5e6)],Window_Selectable[_0x3a25e2(0x423)]['cursorUp']=function(_0x34439d){const _0x2e4ca1=_0x3a25e2;this[_0x2e4ca1(0x1b2)]()&&_0x34439d&&this[_0x2e4ca1(0x452)]()===0x1&&this[_0x2e4ca1(0x1e3)]()===0x0?this[_0x2e4ca1(0x528)](this[_0x2e4ca1(0x2e6)]()-0x1):VisuMZ[_0x2e4ca1(0x62c)][_0x2e4ca1(0x204)][_0x2e4ca1(0x6d9)](this,_0x34439d);},Window_Selectable['prototype']['isUseModernControls']=function(){const _0x40f094=_0x3a25e2;return VisuMZ[_0x40f094(0x62c)][_0x40f094(0x2f0)][_0x40f094(0x2b0)][_0x40f094(0x323)];},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x3ed)]=Window_Selectable['prototype'][_0x3a25e2(0x20b)],Window_Selectable[_0x3a25e2(0x423)]['processCursorMove']=function(){const _0x59e051=_0x3a25e2;this[_0x59e051(0x1b2)]()?(this[_0x59e051(0x459)](),this[_0x59e051(0x322)]()):VisuMZ[_0x59e051(0x62c)][_0x59e051(0x3ed)][_0x59e051(0x6d9)](this);},Window_Selectable[_0x3a25e2(0x423)][_0x3a25e2(0x1b6)]=function(){return!![];},Window_Selectable['prototype'][_0x3a25e2(0x459)]=function(){const _0x239167=_0x3a25e2;if(this[_0x239167(0x2fe)]()){const _0x588cae=this[_0x239167(0x1e3)]();Input[_0x239167(0x205)](_0x239167(0x3d5))&&(Input[_0x239167(0x42e)](_0x239167(0x6ba))&&this['allowShiftScrolling']()?this[_0x239167(0x264)]():this[_0x239167(0x33c)](Input[_0x239167(0x6fc)](_0x239167(0x3d5)))),Input['isRepeated']('up')&&(Input[_0x239167(0x42e)](_0x239167(0x6ba))&&this[_0x239167(0x1b6)]()?this['cursorPageup']():this[_0x239167(0x5e6)](Input[_0x239167(0x6fc)]('up'))),Input[_0x239167(0x205)](_0x239167(0x552))&&this[_0x239167(0x277)](Input['isTriggered'](_0x239167(0x552))),Input[_0x239167(0x205)]('left')&&this[_0x239167(0x23b)](Input[_0x239167(0x6fc)](_0x239167(0x257))),!this[_0x239167(0x4dc)]('pagedown')&&Input[_0x239167(0x205)](_0x239167(0x2a5))&&this[_0x239167(0x264)](),!this[_0x239167(0x4dc)](_0x239167(0x47a))&&Input[_0x239167(0x205)](_0x239167(0x47a))&&this['cursorPageup'](),this['index']()!==_0x588cae&&this['playCursorSound']();}},Window_Selectable[_0x3a25e2(0x423)][_0x3a25e2(0x322)]=function(){const _0x4943a5=_0x3a25e2;if(this[_0x4943a5(0x2fe)]()){const _0x16beef=this[_0x4943a5(0x1e3)]();Input[_0x4943a5(0x6fc)]('home')&&this[_0x4943a5(0x528)](Math[_0x4943a5(0x30b)](this[_0x4943a5(0x1e3)](),0x0)),Input[_0x4943a5(0x6fc)](_0x4943a5(0x5ba))&&this[_0x4943a5(0x528)](Math[_0x4943a5(0x4ae)](this[_0x4943a5(0x1e3)](),this[_0x4943a5(0x2e6)]()-0x1)),this[_0x4943a5(0x1e3)]()!==_0x16beef&&this[_0x4943a5(0x51c)]();}},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x3a4)]=Window_Selectable[_0x3a25e2(0x423)]['processTouch'],Window_Selectable[_0x3a25e2(0x423)]['processTouch']=function(){const _0x10f4ac=_0x3a25e2;this[_0x10f4ac(0x1b2)]()?this['processTouchModernControls']():VisuMZ[_0x10f4ac(0x62c)]['Window_Selectable_processTouch'][_0x10f4ac(0x6d9)](this);},Window_Selectable['prototype'][_0x3a25e2(0x3c7)]=function(){const _0x133278=_0x3a25e2;VisuMZ['CoreEngine']['Window_Selectable_processTouch'][_0x133278(0x6d9)](this);},Window_Selectable[_0x3a25e2(0x423)][_0x3a25e2(0x463)]=function(){const _0x35c1d4=_0x3a25e2;return VisuMZ[_0x35c1d4(0x62c)]['Settings']['Window'][_0x35c1d4(0x4ea)];},Window_Selectable['prototype'][_0x3a25e2(0x21a)]=function(){const _0x45e953=_0x3a25e2;return VisuMZ['CoreEngine'][_0x45e953(0x2f0)][_0x45e953(0x6ac)]['RowSpacing'];},Window_Selectable[_0x3a25e2(0x423)][_0x3a25e2(0x6a4)]=function(){const _0x5915a8=_0x3a25e2;return Window_Scrollable[_0x5915a8(0x423)][_0x5915a8(0x6a4)][_0x5915a8(0x6d9)](this)+VisuMZ[_0x5915a8(0x62c)][_0x5915a8(0x2f0)][_0x5915a8(0x6ac)][_0x5915a8(0x477)];;},VisuMZ[_0x3a25e2(0x62c)]['Window_Selectable_drawBackgroundRect']=Window_Selectable['prototype'][_0x3a25e2(0x5bf)],Window_Selectable[_0x3a25e2(0x423)][_0x3a25e2(0x5bf)]=function(_0x51fe6c){const _0x3fcb80=_0x3a25e2,_0x2f7fc6=VisuMZ['CoreEngine']['Settings'][_0x3fcb80(0x6ac)];if(_0x2f7fc6[_0x3fcb80(0x58c)]===![])return;_0x2f7fc6[_0x3fcb80(0x6a9)]?_0x2f7fc6[_0x3fcb80(0x6a9)][_0x3fcb80(0x6d9)](this,_0x51fe6c):VisuMZ[_0x3fcb80(0x62c)]['Window_Selectable_drawBackgroundRect'][_0x3fcb80(0x6d9)](this,_0x51fe6c);},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x364)]=Window_Gold[_0x3a25e2(0x423)][_0x3a25e2(0x373)],Window_Gold[_0x3a25e2(0x423)][_0x3a25e2(0x373)]=function(){const _0x4a2f66=_0x3a25e2;this[_0x4a2f66(0x6f9)]()?this['drawGoldItemStyle']():VisuMZ[_0x4a2f66(0x62c)][_0x4a2f66(0x364)][_0x4a2f66(0x6d9)](this);},Window_Gold[_0x3a25e2(0x423)]['isItemStyle']=function(){const _0x518b0=_0x3a25e2;if(TextManager[_0x518b0(0x1a7)]!==this[_0x518b0(0x1a7)]())return![];return VisuMZ['CoreEngine'][_0x518b0(0x2f0)][_0x518b0(0x1da)][_0x518b0(0x5e3)];},Window_Gold['prototype'][_0x3a25e2(0x64b)]=function(){const _0x54565c=_0x3a25e2;this[_0x54565c(0x3e2)](),this[_0x54565c(0x223)]['clear'](),this[_0x54565c(0x223)][_0x54565c(0x346)]=VisuMZ[_0x54565c(0x62c)][_0x54565c(0x2f0)][_0x54565c(0x1da)][_0x54565c(0x4ad)];const _0x9b8596=VisuMZ[_0x54565c(0x62c)][_0x54565c(0x2f0)]['Gold'][_0x54565c(0x6fe)],_0x47921c=this['itemLineRect'](0x0);if(_0x9b8596>0x0){const _0x307844=_0x47921c['y']+(this[_0x54565c(0x20a)]()-ImageManager[_0x54565c(0x6a0)])/0x2;this[_0x54565c(0x663)](_0x9b8596,_0x47921c['x'],_0x307844);const _0x43de59=ImageManager[_0x54565c(0x2e7)]+0x4;_0x47921c['x']+=_0x43de59,_0x47921c['width']-=_0x43de59;}this[_0x54565c(0x59a)](ColorManager[_0x54565c(0x186)]()),this[_0x54565c(0x180)](this['currencyUnit'](),_0x47921c['x'],_0x47921c['y'],_0x47921c[_0x54565c(0x286)],_0x54565c(0x257));const _0x50a369=this[_0x54565c(0x2a8)](this['currencyUnit']())+0x6;;_0x47921c['x']+=_0x50a369,_0x47921c[_0x54565c(0x286)]-=_0x50a369,this[_0x54565c(0x698)]();const _0x4735a6=this[_0x54565c(0x424)](),_0x2a09e5=this[_0x54565c(0x2a8)](this[_0x54565c(0x170)]?VisuMZ[_0x54565c(0x21d)](this[_0x54565c(0x424)]()):this[_0x54565c(0x424)]());_0x2a09e5>_0x47921c[_0x54565c(0x286)]?this[_0x54565c(0x180)](VisuMZ[_0x54565c(0x62c)][_0x54565c(0x2f0)]['Gold'][_0x54565c(0x3ec)],_0x47921c['x'],_0x47921c['y'],_0x47921c[_0x54565c(0x286)],'right'):this[_0x54565c(0x180)](this[_0x54565c(0x424)](),_0x47921c['x'],_0x47921c['y'],_0x47921c[_0x54565c(0x286)],_0x54565c(0x552)),this['resetFontSettings']();},Window_StatusBase[_0x3a25e2(0x423)][_0x3a25e2(0x311)]=function(_0x378986,_0x9c1a0,_0x53aded,_0x4adef4,_0xa267a4){const _0x4cde04=_0x3a25e2;_0x4adef4=String(_0x4adef4||'')[_0x4cde04(0x699)]();if(VisuMZ[_0x4cde04(0x62c)][_0x4cde04(0x2f0)][_0x4cde04(0x1bc)][_0x4cde04(0x57b)]){const _0x4fbf30=VisuMZ[_0x4cde04(0x178)](_0x4adef4);_0xa267a4?(this['drawIconBySize'](_0x4fbf30,_0x378986,_0x9c1a0,this[_0x4cde04(0x3cc)]()),_0x53aded-=this[_0x4cde04(0x3cc)]()+0x2,_0x378986+=this[_0x4cde04(0x3cc)]()+0x2):(this[_0x4cde04(0x663)](_0x4fbf30,_0x378986+0x2,_0x9c1a0+0x2),_0x53aded-=ImageManager[_0x4cde04(0x2e7)]+0x4,_0x378986+=ImageManager['iconWidth']+0x4);}const _0x5a6d7d=TextManager['param'](_0x4adef4);this[_0x4cde04(0x3e2)](),this[_0x4cde04(0x59a)](ColorManager[_0x4cde04(0x186)]()),_0xa267a4?(this[_0x4cde04(0x223)][_0x4cde04(0x346)]=this[_0x4cde04(0x1cf)](),this[_0x4cde04(0x223)][_0x4cde04(0x180)](_0x5a6d7d,_0x378986,_0x9c1a0,_0x53aded,this[_0x4cde04(0x3cc)](),_0x4cde04(0x257))):this[_0x4cde04(0x180)](_0x5a6d7d,_0x378986,_0x9c1a0,_0x53aded),this[_0x4cde04(0x3e2)]();},Window_StatusBase['prototype'][_0x3a25e2(0x1cf)]=function(){const _0x4e5ee1=_0x3a25e2;return $gameSystem[_0x4e5ee1(0x3a7)]()-0x8;},Window_StatusBase['prototype'][_0x3a25e2(0x668)]=function(_0x934fca,_0x2c4030,_0x1097ef,_0x583c3c){const _0x2dbcb3=_0x3a25e2;_0x583c3c=_0x583c3c||0xa8,this[_0x2dbcb3(0x698)]();if(VisuMZ['CoreEngine'][_0x2dbcb3(0x2f0)]['UI'][_0x2dbcb3(0x433)])this[_0x2dbcb3(0x6b1)](_0x934fca['currentClass']()[_0x2dbcb3(0x4c4)],_0x2c4030,_0x1097ef,_0x583c3c);else{const _0x3c8b80=_0x934fca[_0x2dbcb3(0x642)]()[_0x2dbcb3(0x4c4)][_0x2dbcb3(0x512)](/\\I\[(\d+)\]/gi,'');this[_0x2dbcb3(0x180)](_0x3c8b80,_0x2c4030,_0x1097ef,_0x583c3c);}},Window_StatusBase['prototype'][_0x3a25e2(0x1ab)]=function(_0x31a214,_0xb1bd82,_0x3197ed,_0x2dcafe){const _0x5f02d3=_0x3a25e2;_0x2dcafe=_0x2dcafe||0x10e,this['resetTextColor']();if(VisuMZ[_0x5f02d3(0x62c)]['Settings']['UI'][_0x5f02d3(0x5ea)])this[_0x5f02d3(0x6b1)](_0x31a214[_0x5f02d3(0x5ad)](),_0xb1bd82,_0x3197ed,_0x2dcafe);else{const _0x5d5f84=_0x31a214[_0x5f02d3(0x5ad)]()['replace'](/\\I\[(\d+)\]/gi,'');this[_0x5f02d3(0x180)](_0x31a214[_0x5f02d3(0x5ad)](),_0xb1bd82,_0x3197ed,_0x2dcafe);}},VisuMZ['CoreEngine'][_0x3a25e2(0x21c)]=Window_StatusBase[_0x3a25e2(0x423)]['drawActorLevel'],Window_StatusBase[_0x3a25e2(0x423)][_0x3a25e2(0x471)]=function(_0x4b72d7,_0x4078f1,_0x4d39ed){const _0x25a3ef=_0x3a25e2;if(this['isExpGaugeDrawn']())this[_0x25a3ef(0x35e)](_0x4b72d7,_0x4078f1,_0x4d39ed);VisuMZ['CoreEngine'][_0x25a3ef(0x21c)][_0x25a3ef(0x6d9)](this,_0x4b72d7,_0x4078f1,_0x4d39ed);},Window_StatusBase[_0x3a25e2(0x423)][_0x3a25e2(0x505)]=function(){const _0x2dd990=_0x3a25e2;return VisuMZ['CoreEngine'][_0x2dd990(0x2f0)]['UI'][_0x2dd990(0x3fc)];},Window_StatusBase[_0x3a25e2(0x423)][_0x3a25e2(0x35e)]=function(_0x245719,_0x4e5cf2,_0x5779f1){const _0x595411=_0x3a25e2;if(!_0x245719)return;if(!_0x245719[_0x595411(0x183)]())return;const _0x26258f=0x80,_0x51e263=_0x245719[_0x595411(0x5a2)]();let _0x737d36=ColorManager[_0x595411(0x241)](),_0x3721a7=ColorManager[_0x595411(0x1d6)]();_0x51e263>=0x1&&(_0x737d36=ColorManager[_0x595411(0x696)](),_0x3721a7=ColorManager[_0x595411(0x3ff)]()),this[_0x595411(0x34a)](_0x4e5cf2,_0x5779f1,_0x26258f,_0x51e263,_0x737d36,_0x3721a7);},Window_EquipStatus['prototype'][_0x3a25e2(0x661)]=function(){const _0x594f7a=_0x3a25e2;let _0x3ddc0c=0x0;for(const _0x1163b3 of VisuMZ[_0x594f7a(0x62c)][_0x594f7a(0x2f0)]['Param'][_0x594f7a(0x555)]){const _0xbdbe0e=this[_0x594f7a(0x152)](),_0x3c64e6=this[_0x594f7a(0x4ab)](_0x3ddc0c);this[_0x594f7a(0x209)](_0xbdbe0e,_0x3c64e6,_0x1163b3),_0x3ddc0c++;}},Window_EquipStatus['prototype'][_0x3a25e2(0x50b)]=function(_0x1ae876,_0x5ade2e,_0x220469){const _0x3f0551=_0x3a25e2,_0x4e50a4=this[_0x3f0551(0x2e4)]()-this['itemPadding']()*0x2;this[_0x3f0551(0x311)](_0x1ae876,_0x5ade2e,_0x4e50a4,_0x220469,![]);},Window_EquipStatus[_0x3a25e2(0x423)][_0x3a25e2(0x61f)]=function(_0x525739,_0x2fa2ba,_0x19d656){const _0x47dca2=_0x3a25e2,_0x3f6df8=this[_0x47dca2(0x467)]();this['resetTextColor'](),this[_0x47dca2(0x180)](this['_actor'][_0x47dca2(0x4cd)](_0x19d656,!![]),_0x525739,_0x2fa2ba,_0x3f6df8,_0x47dca2(0x552));},Window_EquipStatus['prototype']['drawRightArrow']=function(_0x1da20d,_0x2f7b66){const _0x20268e=_0x3a25e2,_0x44e42c=this[_0x20268e(0x397)]();this[_0x20268e(0x59a)](ColorManager[_0x20268e(0x186)]());const _0x5ec0ad=VisuMZ[_0x20268e(0x62c)][_0x20268e(0x2f0)]['UI'][_0x20268e(0x22d)];this[_0x20268e(0x180)](_0x5ec0ad,_0x1da20d,_0x2f7b66,_0x44e42c,'center');},Window_EquipStatus[_0x3a25e2(0x423)][_0x3a25e2(0x139)]=function(_0x5782a0,_0x76d752,_0x48634f){const _0x1385ed=_0x3a25e2,_0x53de15=this[_0x1385ed(0x467)](),_0x4b932c=this[_0x1385ed(0x195)][_0x1385ed(0x4cd)](_0x48634f),_0x4a4a25=_0x4b932c-this['_actor'][_0x1385ed(0x4cd)](_0x48634f);this[_0x1385ed(0x59a)](ColorManager[_0x1385ed(0x474)](_0x4a4a25)),this[_0x1385ed(0x180)](VisuMZ[_0x1385ed(0x64c)](_0x4b932c,0x0,_0x48634f),_0x5782a0,_0x76d752,_0x53de15,_0x1385ed(0x552));},VisuMZ['CoreEngine'][_0x3a25e2(0x34c)]=Window_EquipItem[_0x3a25e2(0x423)][_0x3a25e2(0x1ae)],Window_EquipItem['prototype']['isEnabled']=function(_0x32d5a2){const _0x454b7c=_0x3a25e2;return _0x32d5a2&&this[_0x454b7c(0x6e9)]?this[_0x454b7c(0x6e9)]['canEquip'](_0x32d5a2):VisuMZ[_0x454b7c(0x62c)][_0x454b7c(0x34c)][_0x454b7c(0x6d9)](this,_0x32d5a2);},Window_StatusParams[_0x3a25e2(0x423)][_0x3a25e2(0x2e6)]=function(){const _0xb0864a=_0x3a25e2;return VisuMZ[_0xb0864a(0x62c)][_0xb0864a(0x2f0)][_0xb0864a(0x1bc)][_0xb0864a(0x555)]['length'];},Window_StatusParams['prototype'][_0x3a25e2(0x209)]=function(_0x313d4c){const _0x357442=_0x3a25e2,_0x385a92=this[_0x357442(0x3bb)](_0x313d4c),_0xd37b0=VisuMZ[_0x357442(0x62c)][_0x357442(0x2f0)][_0x357442(0x1bc)][_0x357442(0x555)][_0x313d4c],_0x1e4bd7=TextManager[_0x357442(0x54b)](_0xd37b0),_0x39be77=this[_0x357442(0x6e9)][_0x357442(0x4cd)](_0xd37b0,!![]);this[_0x357442(0x311)](_0x385a92['x'],_0x385a92['y'],0xa0,_0xd37b0,![]),this['resetTextColor'](),this[_0x357442(0x180)](_0x39be77,_0x385a92['x']+0xa0,_0x385a92['y'],0x3c,_0x357442(0x552));};if(VisuMZ['CoreEngine']['Settings']['KeyboardInput'][_0x3a25e2(0x13f)]){VisuMZ[_0x3a25e2(0x62c)]['Settings'][_0x3a25e2(0x412)][_0x3a25e2(0x5f2)]&&(Window_NameInput[_0x3a25e2(0x338)]=['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','\x27','`','Z','X','C','V','B','N','M',',','.','q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l',':','~','z','x','c','v','b','n','m','\x22',';','1','2','3','4','5','6','7','8','9','0','!','@','#','$','%','^','&','*','(',')','<','>','[',']','-','_','/','\x20',_0x3a25e2(0x291),'OK']);;VisuMZ['CoreEngine']['Window_NameInput_initialize']=Window_NameInput[_0x3a25e2(0x423)][_0x3a25e2(0x14d)],Window_NameInput[_0x3a25e2(0x423)][_0x3a25e2(0x14d)]=function(_0xc40f68){const _0x1be6c3=_0x3a25e2;this[_0x1be6c3(0x3f4)]=this[_0x1be6c3(0x571)](),VisuMZ[_0x1be6c3(0x62c)][_0x1be6c3(0x6e3)][_0x1be6c3(0x6d9)](this,_0xc40f68),Input['clear'](),this['deselect']();},Window_NameInput[_0x3a25e2(0x423)][_0x3a25e2(0x571)]=function(){const _0x54215b=_0x3a25e2;return VisuMZ['CoreEngine'][_0x54215b(0x2f0)][_0x54215b(0x412)][_0x54215b(0x1d1)]||_0x54215b(0x620);},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x63b)]=Window_NameInput[_0x3a25e2(0x423)][_0x3a25e2(0x33f)],Window_NameInput[_0x3a25e2(0x423)][_0x3a25e2(0x33f)]=function(){const _0x5124eb=_0x3a25e2;if(!this['isOpen']())return;if(!this['active'])return;if(Input['isSpecialCode']('backspace'))Input['clear'](),this[_0x5124eb(0x641)]();else{if(Input[_0x5124eb(0x6fc)](_0x5124eb(0x15b)))Input['clear'](),this[_0x5124eb(0x3f4)]===_0x5124eb(0x620)?this[_0x5124eb(0x6b6)](_0x5124eb(0x5e8)):this[_0x5124eb(0x6b6)](_0x5124eb(0x620));else{if(this['_mode']===_0x5124eb(0x620))this['processKeyboardHandling']();else Input[_0x5124eb(0x6cc)](_0x5124eb(0x42c))?(Input[_0x5124eb(0x493)](),this['switchModes']('keyboard')):VisuMZ[_0x5124eb(0x62c)][_0x5124eb(0x63b)][_0x5124eb(0x6d9)](this);}}},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x581)]=Window_NameInput['prototype'][_0x3a25e2(0x222)],Window_NameInput[_0x3a25e2(0x423)][_0x3a25e2(0x222)]=function(){const _0x15efe1=_0x3a25e2;if(!this['isOpenAndActive']())return;if(this[_0x15efe1(0x3f4)]===_0x15efe1(0x620)){if(TouchInput['isTriggered']()&&this[_0x15efe1(0x593)]())this[_0x15efe1(0x6b6)](_0x15efe1(0x5e8));else TouchInput['isCancelled']()&&this['switchModes'](_0x15efe1(0x5e8));}else VisuMZ[_0x15efe1(0x62c)][_0x15efe1(0x581)][_0x15efe1(0x6d9)](this);},Window_NameInput['prototype']['processKeyboardHandling']=function(){const _0xe05d49=_0x3a25e2;if(Input[_0xe05d49(0x6cc)](_0xe05d49(0x438)))Input[_0xe05d49(0x493)](),this[_0xe05d49(0x444)]();else{if(Input[_0xe05d49(0x3e9)]!==undefined){let _0x5d9113=Input['_inputString'],_0x53ffca=_0x5d9113['length'];for(let _0x3ba85e=0x0;_0x3ba85e<_0x53ffca;++_0x3ba85e){this['_editWindow'][_0xe05d49(0x439)](_0x5d9113[_0x3ba85e])?SoundManager[_0xe05d49(0x279)]():SoundManager[_0xe05d49(0x3d2)]();}Input[_0xe05d49(0x493)]();}}},Window_NameInput['prototype'][_0x3a25e2(0x6b6)]=function(_0x5d0a4d){const _0x3f2ca3=_0x3a25e2;let _0xcdea20=this[_0x3f2ca3(0x3f4)];this[_0x3f2ca3(0x3f4)]=_0x5d0a4d,_0xcdea20!==this[_0x3f2ca3(0x3f4)]&&(this[_0x3f2ca3(0x373)](),SoundManager[_0x3f2ca3(0x279)](),this[_0x3f2ca3(0x3f4)]===_0x3f2ca3(0x5e8)?this[_0x3f2ca3(0x208)](0x0):this[_0x3f2ca3(0x208)](-0x1));},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x2fb)]=Window_NameInput[_0x3a25e2(0x423)][_0x3a25e2(0x33c)],Window_NameInput[_0x3a25e2(0x423)]['cursorDown']=function(_0x13aeef){const _0xcf975c=_0x3a25e2;if(this['_mode']==='keyboard'&&!Input[_0xcf975c(0x394)]())return;if(Input[_0xcf975c(0x2f6)]())return;VisuMZ[_0xcf975c(0x62c)][_0xcf975c(0x2fb)]['call'](this,_0x13aeef),this[_0xcf975c(0x6b6)](_0xcf975c(0x5e8));},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x5f4)]=Window_NameInput[_0x3a25e2(0x423)][_0x3a25e2(0x5e6)],Window_NameInput['prototype'][_0x3a25e2(0x5e6)]=function(_0x561e9e){const _0x2be27d=_0x3a25e2;if(this[_0x2be27d(0x3f4)]===_0x2be27d(0x620)&&!Input[_0x2be27d(0x394)]())return;if(Input[_0x2be27d(0x2f6)]())return;VisuMZ[_0x2be27d(0x62c)][_0x2be27d(0x5f4)][_0x2be27d(0x6d9)](this,_0x561e9e),this[_0x2be27d(0x6b6)](_0x2be27d(0x5e8));},VisuMZ['CoreEngine'][_0x3a25e2(0x3be)]=Window_NameInput[_0x3a25e2(0x423)][_0x3a25e2(0x277)],Window_NameInput[_0x3a25e2(0x423)][_0x3a25e2(0x277)]=function(_0x1fd58e){const _0x482b19=_0x3a25e2;if(this[_0x482b19(0x3f4)]===_0x482b19(0x620)&&!Input[_0x482b19(0x394)]())return;if(Input[_0x482b19(0x2f6)]())return;VisuMZ[_0x482b19(0x62c)][_0x482b19(0x3be)][_0x482b19(0x6d9)](this,_0x1fd58e),this['switchModes'](_0x482b19(0x5e8));},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x52f)]=Window_NameInput['prototype'][_0x3a25e2(0x23b)],Window_NameInput['prototype'][_0x3a25e2(0x23b)]=function(_0x6a791b){const _0x2e13c9=_0x3a25e2;if(this[_0x2e13c9(0x3f4)]===_0x2e13c9(0x620)&&!Input[_0x2e13c9(0x394)]())return;if(Input['isNumpadPressed']())return;VisuMZ[_0x2e13c9(0x62c)][_0x2e13c9(0x52f)]['call'](this,_0x6a791b),this[_0x2e13c9(0x6b6)](_0x2e13c9(0x5e8));},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x567)]=Window_NameInput[_0x3a25e2(0x423)]['cursorPagedown'],Window_NameInput[_0x3a25e2(0x423)][_0x3a25e2(0x264)]=function(){const _0x471b94=_0x3a25e2;if(this[_0x471b94(0x3f4)]==='keyboard')return;if(Input[_0x471b94(0x2f6)]())return;VisuMZ[_0x471b94(0x62c)][_0x471b94(0x567)][_0x471b94(0x6d9)](this),this[_0x471b94(0x6b6)](_0x471b94(0x5e8));},VisuMZ[_0x3a25e2(0x62c)]['Window_NameInput_cursorPageup']=Window_NameInput[_0x3a25e2(0x423)][_0x3a25e2(0x16b)],Window_NameInput[_0x3a25e2(0x423)][_0x3a25e2(0x16b)]=function(){const _0x230cdc=_0x3a25e2;if(this[_0x230cdc(0x3f4)]===_0x230cdc(0x620))return;if(Input['isNumpadPressed']())return;VisuMZ['CoreEngine']['Window_NameInput_cursorPageup']['call'](this),this[_0x230cdc(0x6b6)](_0x230cdc(0x5e8));},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x49f)]=Window_NameInput['prototype'][_0x3a25e2(0x373)],Window_NameInput[_0x3a25e2(0x423)]['refresh']=function(){const _0xc53310=_0x3a25e2;if(this[_0xc53310(0x3f4)]===_0xc53310(0x620)){this['contents'][_0xc53310(0x493)](),this[_0xc53310(0x4b2)][_0xc53310(0x493)](),this[_0xc53310(0x698)]();let _0x2fb7e2=VisuMZ[_0xc53310(0x62c)][_0xc53310(0x2f0)][_0xc53310(0x412)][_0xc53310(0x691)][_0xc53310(0x325)]('\x0a'),_0x2c06bf=_0x2fb7e2[_0xc53310(0x200)],_0x10cd15=(this[_0xc53310(0x283)]-_0x2c06bf*this[_0xc53310(0x20a)]())/0x2;for(let _0x31ee30=0x0;_0x31ee30<_0x2c06bf;++_0x31ee30){let _0x43df73=_0x2fb7e2[_0x31ee30],_0x1fe049=this[_0xc53310(0x51b)](_0x43df73)[_0xc53310(0x286)],_0x142f01=Math[_0xc53310(0x6f7)]((this[_0xc53310(0x223)][_0xc53310(0x286)]-_0x1fe049)/0x2);this[_0xc53310(0x6b1)](_0x43df73,_0x142f01,_0x10cd15),_0x10cd15+=this['lineHeight']();}}else VisuMZ[_0xc53310(0x62c)]['Window_NameInput_refresh']['call'](this);};};VisuMZ[_0x3a25e2(0x62c)]['Window_ShopSell_isEnabled']=Window_ShopSell['prototype'][_0x3a25e2(0x1ae)],Window_ShopSell[_0x3a25e2(0x423)][_0x3a25e2(0x1ae)]=function(_0x8e4d90){const _0xda6075=_0x3a25e2;return VisuMZ[_0xda6075(0x62c)][_0xda6075(0x2f0)][_0xda6075(0x2b0)][_0xda6075(0x23a)]&&DataManager[_0xda6075(0x6bb)](_0x8e4d90)?![]:VisuMZ[_0xda6075(0x62c)][_0xda6075(0x631)][_0xda6075(0x6d9)](this,_0x8e4d90);},Window_NumberInput[_0x3a25e2(0x423)][_0x3a25e2(0x1b2)]=function(){return![];};VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x2f0)][_0x3a25e2(0x412)][_0x3a25e2(0x5a4)]&&(VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x5c7)]=Window_NumberInput[_0x3a25e2(0x423)][_0x3a25e2(0x5de)],Window_NumberInput[_0x3a25e2(0x423)][_0x3a25e2(0x5de)]=function(){const _0x5c9b94=_0x3a25e2;VisuMZ[_0x5c9b94(0x62c)][_0x5c9b94(0x5c7)][_0x5c9b94(0x6d9)](this),this[_0x5c9b94(0x208)](this[_0x5c9b94(0x594)]-0x1);},VisuMZ['CoreEngine'][_0x3a25e2(0x32d)]=Window_NumberInput[_0x3a25e2(0x423)][_0x3a25e2(0x201)],Window_NumberInput[_0x3a25e2(0x423)][_0x3a25e2(0x201)]=function(){const _0x7aca56=_0x3a25e2;if(!this[_0x7aca56(0x16d)]())return;if(Input['isNumpadPressed']())this[_0x7aca56(0x15f)]();else{if(Input['isSpecialCode'](_0x7aca56(0x3ce)))this[_0x7aca56(0x3dd)]();else{if(Input[_0x7aca56(0x35a)]===0x2e)this[_0x7aca56(0x62b)]();else{if(Input[_0x7aca56(0x35a)]===0x24)this[_0x7aca56(0x5b2)]();else Input['_inputSpecialKeyCode']===0x23?this[_0x7aca56(0x4de)]():(VisuMZ[_0x7aca56(0x62c)][_0x7aca56(0x32d)][_0x7aca56(0x6d9)](this),Input[_0x7aca56(0x493)]());}}}},Window_NumberInput[_0x3a25e2(0x423)][_0x3a25e2(0x20b)]=function(){const _0x113e90=_0x3a25e2;if(!this['isCursorMovable']())return;Input[_0x113e90(0x2f6)]()?this['processKeyboardDigitChange']():Window_Selectable[_0x113e90(0x423)][_0x113e90(0x20b)][_0x113e90(0x6d9)](this);},Window_NumberInput[_0x3a25e2(0x423)][_0x3a25e2(0x322)]=function(){},Window_NumberInput['prototype']['processKeyboardDigitChange']=function(){const _0x141c92=_0x3a25e2;if(String(this[_0x141c92(0x59b)])[_0x141c92(0x200)]>=this['_maxDigits'])return;this[_0x141c92(0x59b)]=Number(String(this['_number'])+Input[_0x141c92(0x3e9)]);const _0x3f40e9='9'['repeat'](this[_0x141c92(0x594)]);this[_0x141c92(0x59b)]=this[_0x141c92(0x59b)][_0x141c92(0x2a4)](0x0,_0x3f40e9),Input['clear'](),this[_0x141c92(0x373)](),SoundManager['playCursor'](),this[_0x141c92(0x208)](this[_0x141c92(0x594)]-0x1);},Window_NumberInput[_0x3a25e2(0x423)]['processKeyboardBackspace']=function(){const _0x2a9d73=_0x3a25e2;this[_0x2a9d73(0x59b)]=Number(String(this['_number'])[_0x2a9d73(0x384)](0x0,-0x1)),this[_0x2a9d73(0x59b)]=Math[_0x2a9d73(0x4ae)](0x0,this[_0x2a9d73(0x59b)]),Input[_0x2a9d73(0x493)](),this['refresh'](),SoundManager['playCursor'](),this[_0x2a9d73(0x208)](this[_0x2a9d73(0x594)]-0x1);},Window_NumberInput[_0x3a25e2(0x423)][_0x3a25e2(0x62b)]=function(){const _0x1ebac9=_0x3a25e2;this[_0x1ebac9(0x59b)]=Number(String(this[_0x1ebac9(0x59b)])[_0x1ebac9(0x5ac)](0x1)),this[_0x1ebac9(0x59b)]=Math[_0x1ebac9(0x4ae)](0x0,this['_number']),Input['clear'](),this[_0x1ebac9(0x373)](),SoundManager[_0x1ebac9(0x2d3)](),this['select'](this[_0x1ebac9(0x594)]-0x1);});;Window_TitleCommand[_0x3a25e2(0x315)]=VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x2f0)][_0x3a25e2(0x462)],Window_TitleCommand[_0x3a25e2(0x423)][_0x3a25e2(0x421)]=function(){this['makeCoreEngineCommandList']();},Window_TitleCommand[_0x3a25e2(0x423)][_0x3a25e2(0x312)]=function(){const _0x2041e0=_0x3a25e2;for(const _0x1e7365 of Window_TitleCommand['_commandList']){if(_0x1e7365[_0x2041e0(0x624)][_0x2041e0(0x6d9)](this)){const _0x221a71=_0x1e7365[_0x2041e0(0x678)];let _0x461664=_0x1e7365[_0x2041e0(0x516)];if(['',_0x2041e0(0x6e5)][_0x2041e0(0x42a)](_0x461664))_0x461664=_0x1e7365[_0x2041e0(0x18a)][_0x2041e0(0x6d9)](this);const _0x109257=_0x1e7365['EnableJS']['call'](this),_0xb17995=_0x1e7365[_0x2041e0(0x21e)][_0x2041e0(0x6d9)](this);this[_0x2041e0(0x56d)](_0x461664,_0x221a71,_0x109257,_0xb17995),this[_0x2041e0(0x3cd)](_0x221a71,_0x1e7365[_0x2041e0(0x375)][_0x2041e0(0x4c0)](this,_0xb17995));}}},Window_GameEnd[_0x3a25e2(0x315)]=VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x2f0)][_0x3a25e2(0x3b3)][_0x3a25e2(0x4d1)][_0x3a25e2(0x62e)],Window_GameEnd[_0x3a25e2(0x423)][_0x3a25e2(0x421)]=function(){const _0x5b657c=_0x3a25e2;this[_0x5b657c(0x312)]();},Window_GameEnd[_0x3a25e2(0x423)]['makeCoreEngineCommandList']=function(){const _0x3d2fac=_0x3a25e2;for(const _0x1ff4a0 of Window_GameEnd[_0x3d2fac(0x315)]){if(_0x1ff4a0['ShowJS'][_0x3d2fac(0x6d9)](this)){const _0xf478d6=_0x1ff4a0[_0x3d2fac(0x678)];let _0x547260=_0x1ff4a0[_0x3d2fac(0x516)];if(['',_0x3d2fac(0x6e5)][_0x3d2fac(0x42a)](_0x547260))_0x547260=_0x1ff4a0[_0x3d2fac(0x18a)][_0x3d2fac(0x6d9)](this);const _0xab18f7=_0x1ff4a0['EnableJS']['call'](this),_0x39755c=_0x1ff4a0[_0x3d2fac(0x21e)][_0x3d2fac(0x6d9)](this);this[_0x3d2fac(0x56d)](_0x547260,_0xf478d6,_0xab18f7,_0x39755c),this[_0x3d2fac(0x3cd)](_0xf478d6,_0x1ff4a0[_0x3d2fac(0x375)][_0x3d2fac(0x4c0)](this,_0x39755c));}}};function Window_ButtonAssist(){const _0x5885b9=_0x3a25e2;this[_0x5885b9(0x14d)](...arguments);}Window_ButtonAssist['prototype']=Object[_0x3a25e2(0x4fd)](Window_Base[_0x3a25e2(0x423)]),Window_ButtonAssist[_0x3a25e2(0x423)][_0x3a25e2(0x32a)]=Window_ButtonAssist,Window_ButtonAssist[_0x3a25e2(0x423)]['initialize']=function(_0x115702){const _0x2ec588=_0x3a25e2;this[_0x2ec588(0x331)]={},Window_Base[_0x2ec588(0x423)][_0x2ec588(0x14d)][_0x2ec588(0x6d9)](this,_0x115702),this[_0x2ec588(0x31d)](VisuMZ[_0x2ec588(0x62c)][_0x2ec588(0x2f0)][_0x2ec588(0x151)][_0x2ec588(0x57a)]||0x0),this['refresh']();},Window_ButtonAssist[_0x3a25e2(0x423)][_0x3a25e2(0x628)]=function(){const _0x360f7e=_0x3a25e2;this[_0x360f7e(0x223)]['fontSize']<=0x60&&(this[_0x360f7e(0x223)][_0x360f7e(0x346)]+=0x6);},Window_ButtonAssist[_0x3a25e2(0x423)][_0x3a25e2(0x55f)]=function(){const _0x171af7=_0x3a25e2;this[_0x171af7(0x223)]['fontSize']>=0x18&&(this['contents']['fontSize']-=0x6);},Window_ButtonAssist[_0x3a25e2(0x423)][_0x3a25e2(0x6cd)]=function(){const _0x389b8f=_0x3a25e2;Window_Base['prototype'][_0x389b8f(0x6cd)]['call'](this),this[_0x389b8f(0x457)]();},Window_ButtonAssist[_0x3a25e2(0x423)][_0x3a25e2(0x372)]=function(){const _0x544100=_0x3a25e2;this[_0x544100(0x199)]=SceneManager[_0x544100(0x526)][_0x544100(0x154)]()!=='button'?0x0:0x8;},Window_ButtonAssist['prototype']['updateKeyText']=function(){const _0x1a2f75=_0x3a25e2,_0x2c44e3=SceneManager[_0x1a2f75(0x526)];for(let _0x45db2e=0x1;_0x45db2e<=0x5;_0x45db2e++){if(this[_0x1a2f75(0x331)]['key%1'[_0x1a2f75(0x534)](_0x45db2e)]!==_0x2c44e3[_0x1a2f75(0x33d)['format'](_0x45db2e)]())return this[_0x1a2f75(0x373)]();if(this['_data'][_0x1a2f75(0x6ec)[_0x1a2f75(0x534)](_0x45db2e)]!==_0x2c44e3[_0x1a2f75(0x244)['format'](_0x45db2e)]())return this[_0x1a2f75(0x373)]();}},Window_ButtonAssist[_0x3a25e2(0x423)][_0x3a25e2(0x373)]=function(){const _0x1a061f=_0x3a25e2;this[_0x1a061f(0x223)]['clear']();for(let _0xd66965=0x1;_0xd66965<=0x5;_0xd66965++){this[_0x1a061f(0x2ca)](_0xd66965);}},Window_ButtonAssist[_0x3a25e2(0x423)]['drawSegment']=function(_0x5e5fbe){const _0x32d174=_0x3a25e2,_0x3a5642=this[_0x32d174(0x500)]/0x5,_0xd1c107=SceneManager['_scene'],_0x4d60a5=_0xd1c107[_0x32d174(0x33d)[_0x32d174(0x534)](_0x5e5fbe)](),_0x1c05d2=_0xd1c107[_0x32d174(0x244)[_0x32d174(0x534)](_0x5e5fbe)]();this[_0x32d174(0x331)][_0x32d174(0x5a7)['format'](_0x5e5fbe)]=_0x4d60a5,this[_0x32d174(0x331)][_0x32d174(0x6ec)[_0x32d174(0x534)](_0x5e5fbe)]=_0x1c05d2;if(_0x4d60a5==='')return;if(_0x1c05d2==='')return;const _0x5842b1=_0xd1c107[_0x32d174(0x5b3)['format'](_0x5e5fbe)](),_0x157ee7=this[_0x32d174(0x152)](),_0x298bf1=_0x3a5642*(_0x5e5fbe-0x1)+_0x157ee7+_0x5842b1,_0x4bb7fc=VisuMZ[_0x32d174(0x62c)][_0x32d174(0x2f0)][_0x32d174(0x151)][_0x32d174(0x193)];this[_0x32d174(0x6b1)](_0x4bb7fc[_0x32d174(0x534)](_0x4d60a5,_0x1c05d2),_0x298bf1,0x0,_0x3a5642-_0x157ee7*0x2);},VisuMZ[_0x3a25e2(0x1dc)]=function(_0x1c0f6e){const _0x13f7b6=_0x3a25e2;if(Utils[_0x13f7b6(0x403)]('test')){var _0x516a21=require(_0x13f7b6(0x6ef))[_0x13f7b6(0x6ac)][_0x13f7b6(0x6ad)]();SceneManager[_0x13f7b6(0x667)]();if(_0x1c0f6e)setTimeout(_0x516a21[_0x13f7b6(0x5be)][_0x13f7b6(0x4c0)](_0x516a21),0x190);}},VisuMZ[_0x3a25e2(0x41c)]=function(_0x4c18bb,_0x5000f5){const _0x300c45=_0x3a25e2;_0x5000f5=_0x5000f5['toUpperCase']();var _0x38781e=1.70158,_0x4706cc=0.7;switch(_0x5000f5){case _0x300c45(0x3d9):return _0x4c18bb;case _0x300c45(0x177):return-0x1*Math[_0x300c45(0x27f)](_0x4c18bb*(Math['PI']/0x2))+0x1;case'OUTSINE':return Math[_0x300c45(0x503)](_0x4c18bb*(Math['PI']/0x2));case _0x300c45(0x251):return-0.5*(Math[_0x300c45(0x27f)](Math['PI']*_0x4c18bb)-0x1);case _0x300c45(0x689):return _0x4c18bb*_0x4c18bb;case _0x300c45(0x21b):return _0x4c18bb*(0x2-_0x4c18bb);case _0x300c45(0x20e):return _0x4c18bb<0.5?0x2*_0x4c18bb*_0x4c18bb:-0x1+(0x4-0x2*_0x4c18bb)*_0x4c18bb;case _0x300c45(0x4d2):return _0x4c18bb*_0x4c18bb*_0x4c18bb;case _0x300c45(0x425):var _0x5c0dd2=_0x4c18bb-0x1;return _0x5c0dd2*_0x5c0dd2*_0x5c0dd2+0x1;case _0x300c45(0x13b):return _0x4c18bb<0.5?0x4*_0x4c18bb*_0x4c18bb*_0x4c18bb:(_0x4c18bb-0x1)*(0x2*_0x4c18bb-0x2)*(0x2*_0x4c18bb-0x2)+0x1;case _0x300c45(0x6f4):return _0x4c18bb*_0x4c18bb*_0x4c18bb*_0x4c18bb;case'OUTQUART':var _0x5c0dd2=_0x4c18bb-0x1;return 0x1-_0x5c0dd2*_0x5c0dd2*_0x5c0dd2*_0x5c0dd2;case _0x300c45(0x192):var _0x5c0dd2=_0x4c18bb-0x1;return _0x4c18bb<0.5?0x8*_0x4c18bb*_0x4c18bb*_0x4c18bb*_0x4c18bb:0x1-0x8*_0x5c0dd2*_0x5c0dd2*_0x5c0dd2*_0x5c0dd2;case _0x300c45(0x5d4):return _0x4c18bb*_0x4c18bb*_0x4c18bb*_0x4c18bb*_0x4c18bb;case _0x300c45(0x4f8):var _0x5c0dd2=_0x4c18bb-0x1;return 0x1+_0x5c0dd2*_0x5c0dd2*_0x5c0dd2*_0x5c0dd2*_0x5c0dd2;case _0x300c45(0x44d):var _0x5c0dd2=_0x4c18bb-0x1;return _0x4c18bb<0.5?0x10*_0x4c18bb*_0x4c18bb*_0x4c18bb*_0x4c18bb*_0x4c18bb:0x1+0x10*_0x5c0dd2*_0x5c0dd2*_0x5c0dd2*_0x5c0dd2*_0x5c0dd2;case'INEXPO':if(_0x4c18bb===0x0)return 0x0;return Math[_0x300c45(0x600)](0x2,0xa*(_0x4c18bb-0x1));case _0x300c45(0x46f):if(_0x4c18bb===0x1)return 0x1;return-Math[_0x300c45(0x600)](0x2,-0xa*_0x4c18bb)+0x1;case _0x300c45(0x228):if(_0x4c18bb===0x0||_0x4c18bb===0x1)return _0x4c18bb;var _0x1244f0=_0x4c18bb*0x2,_0x519d40=_0x1244f0-0x1;if(_0x1244f0<0x1)return 0.5*Math[_0x300c45(0x600)](0x2,0xa*_0x519d40);return 0.5*(-Math['pow'](0x2,-0xa*_0x519d40)+0x2);case _0x300c45(0x217):var _0x1244f0=_0x4c18bb/0x1;return-0x1*(Math[_0x300c45(0x68f)](0x1-_0x1244f0*_0x4c18bb)-0x1);case'OUTCIRC':var _0x5c0dd2=_0x4c18bb-0x1;return Math[_0x300c45(0x68f)](0x1-_0x5c0dd2*_0x5c0dd2);case _0x300c45(0x1dd):var _0x1244f0=_0x4c18bb*0x2,_0x519d40=_0x1244f0-0x2;if(_0x1244f0<0x1)return-0.5*(Math[_0x300c45(0x68f)](0x1-_0x1244f0*_0x1244f0)-0x1);return 0.5*(Math[_0x300c45(0x68f)](0x1-_0x519d40*_0x519d40)+0x1);case'INBACK':return _0x4c18bb*_0x4c18bb*((_0x38781e+0x1)*_0x4c18bb-_0x38781e);case _0x300c45(0x2a0):var _0x1244f0=_0x4c18bb/0x1-0x1;return _0x1244f0*_0x1244f0*((_0x38781e+0x1)*_0x1244f0+_0x38781e)+0x1;break;case _0x300c45(0x33b):var _0x1244f0=_0x4c18bb*0x2,_0x386392=_0x1244f0-0x2,_0x255695=_0x38781e*1.525;if(_0x1244f0<0x1)return 0.5*_0x1244f0*_0x1244f0*((_0x255695+0x1)*_0x1244f0-_0x255695);return 0.5*(_0x386392*_0x386392*((_0x255695+0x1)*_0x386392+_0x255695)+0x2);case _0x300c45(0x5bb):if(_0x4c18bb===0x0||_0x4c18bb===0x1)return _0x4c18bb;var _0x1244f0=_0x4c18bb/0x1,_0x519d40=_0x1244f0-0x1,_0x47240e=0x1-_0x4706cc,_0x255695=_0x47240e/(0x2*Math['PI'])*Math[_0x300c45(0x540)](0x1);return-(Math[_0x300c45(0x600)](0x2,0xa*_0x519d40)*Math['sin']((_0x519d40-_0x255695)*(0x2*Math['PI'])/_0x47240e));case _0x300c45(0x1fa):var _0x47240e=0x1-_0x4706cc,_0x1244f0=_0x4c18bb*0x2;if(_0x4c18bb===0x0||_0x4c18bb===0x1)return _0x4c18bb;var _0x255695=_0x47240e/(0x2*Math['PI'])*Math[_0x300c45(0x540)](0x1);return Math['pow'](0x2,-0xa*_0x1244f0)*Math['sin']((_0x1244f0-_0x255695)*(0x2*Math['PI'])/_0x47240e)+0x1;case'INOUTELASTIC':var _0x47240e=0x1-_0x4706cc;if(_0x4c18bb===0x0||_0x4c18bb===0x1)return _0x4c18bb;var _0x1244f0=_0x4c18bb*0x2,_0x519d40=_0x1244f0-0x1,_0x255695=_0x47240e/(0x2*Math['PI'])*Math[_0x300c45(0x540)](0x1);if(_0x1244f0<0x1)return-0.5*(Math['pow'](0x2,0xa*_0x519d40)*Math['sin']((_0x519d40-_0x255695)*(0x2*Math['PI'])/_0x47240e));return Math[_0x300c45(0x600)](0x2,-0xa*_0x519d40)*Math[_0x300c45(0x503)]((_0x519d40-_0x255695)*(0x2*Math['PI'])/_0x47240e)*0.5+0x1;case'OUTBOUNCE':var _0x1244f0=_0x4c18bb/0x1;if(_0x1244f0<0x1/2.75)return 7.5625*_0x1244f0*_0x1244f0;else{if(_0x1244f0<0x2/2.75){var _0x386392=_0x1244f0-1.5/2.75;return 7.5625*_0x386392*_0x386392+0.75;}else{if(_0x1244f0<2.5/2.75){var _0x386392=_0x1244f0-2.25/2.75;return 7.5625*_0x386392*_0x386392+0.9375;}else{var _0x386392=_0x1244f0-2.625/2.75;return 7.5625*_0x386392*_0x386392+0.984375;}}}case _0x300c45(0x51e):var _0x528aeb=0x1-VisuMZ[_0x300c45(0x41c)](0x1-_0x4c18bb,_0x300c45(0x595));return _0x528aeb;case'INOUTBOUNCE':if(_0x4c18bb<0.5)var _0x528aeb=VisuMZ[_0x300c45(0x41c)](_0x4c18bb*0x2,_0x300c45(0x47b))*0.5;else var _0x528aeb=VisuMZ[_0x300c45(0x41c)](_0x4c18bb*0x2-0x1,_0x300c45(0x595))*0.5+0.5;return _0x528aeb;default:return _0x4c18bb;}},VisuMZ['GetParamIcon']=function(_0x15582d){const _0x5af180=_0x3a25e2;_0x15582d=String(_0x15582d)['toUpperCase']();const _0x5f26bd=VisuMZ[_0x5af180(0x62c)][_0x5af180(0x2f0)][_0x5af180(0x1bc)];if(_0x15582d==='MAXHP')return _0x5f26bd[_0x5af180(0x46d)];if(_0x15582d===_0x5af180(0x336))return _0x5f26bd['IconParam1'];if(_0x15582d==='ATK')return _0x5f26bd[_0x5af180(0x1f8)];if(_0x15582d===_0x5af180(0x36c))return _0x5f26bd[_0x5af180(0x469)];if(_0x15582d===_0x5af180(0x46a))return _0x5f26bd[_0x5af180(0x484)];if(_0x15582d==='MDF')return _0x5f26bd['IconParam5'];if(_0x15582d===_0x5af180(0x1be))return _0x5f26bd[_0x5af180(0x358)];if(_0x15582d===_0x5af180(0x2d6))return _0x5f26bd[_0x5af180(0x5d3)];if(_0x15582d===_0x5af180(0x1d9))return _0x5f26bd[_0x5af180(0x14b)];if(_0x15582d===_0x5af180(0x53c))return _0x5f26bd[_0x5af180(0x2c4)];if(_0x15582d===_0x5af180(0x596))return _0x5f26bd[_0x5af180(0x166)];if(_0x15582d===_0x5af180(0x4d6))return _0x5f26bd[_0x5af180(0x26b)];if(_0x15582d===_0x5af180(0x1df))return _0x5f26bd[_0x5af180(0x61e)];if(_0x15582d==='MRF')return _0x5f26bd[_0x5af180(0x5e5)];if(_0x15582d===_0x5af180(0x314))return _0x5f26bd['IconXParam6'];if(_0x15582d===_0x5af180(0x568))return _0x5f26bd['IconXParam7'];if(_0x15582d===_0x5af180(0x23f))return _0x5f26bd['IconXParam8'];if(_0x15582d===_0x5af180(0x350))return _0x5f26bd[_0x5af180(0x265)];if(_0x15582d===_0x5af180(0x434))return _0x5f26bd[_0x5af180(0x1bf)];if(_0x15582d==='GRD')return _0x5f26bd[_0x5af180(0x374)];if(_0x15582d===_0x5af180(0x2a7))return _0x5f26bd['IconSParam2'];if(_0x15582d===_0x5af180(0x587))return _0x5f26bd[_0x5af180(0x64f)];if(_0x15582d===_0x5af180(0x677))return _0x5f26bd[_0x5af180(0x435)];if(_0x15582d===_0x5af180(0x18f))return _0x5f26bd[_0x5af180(0x303)];if(_0x15582d===_0x5af180(0x1f3))return _0x5f26bd['IconSParam6'];if(_0x15582d===_0x5af180(0x405))return _0x5f26bd[_0x5af180(0x1e8)];if(_0x15582d===_0x5af180(0x588))return _0x5f26bd[_0x5af180(0x169)];if(_0x15582d==='EXR')return _0x5f26bd[_0x5af180(0x60f)];if(VisuMZ[_0x5af180(0x62c)][_0x5af180(0x23e)][_0x15582d])return VisuMZ[_0x5af180(0x62c)][_0x5af180(0x23e)][_0x15582d]||0x0;return 0x0;},VisuMZ['ConvertNumberToString']=function(_0x26180b,_0x1d2caf,_0x469a35){const _0x55fbc2=_0x3a25e2;if(_0x469a35===undefined&&_0x26180b%0x1===0x0)return _0x26180b;if(_0x469a35!==undefined&&[_0x55fbc2(0x5cc),_0x55fbc2(0x336),_0x55fbc2(0x34e),_0x55fbc2(0x36c),'MAT',_0x55fbc2(0x460),'AGI',_0x55fbc2(0x2d6)][_0x55fbc2(0x42a)](String(_0x469a35)['toUpperCase']()[_0x55fbc2(0x430)]()))return _0x26180b;return _0x1d2caf=_0x1d2caf||0x0,String((_0x26180b*0x64)['toFixed'](_0x1d2caf))+'%';},VisuMZ[_0x3a25e2(0x21d)]=function(_0x78afb4){const _0x4d77b2=_0x3a25e2;_0x78afb4=String(_0x78afb4);if(!_0x78afb4)return _0x78afb4;if(typeof _0x78afb4!==_0x4d77b2(0x3ba))return _0x78afb4;const _0x3a7b20=VisuMZ['CoreEngine'][_0x4d77b2(0x2f0)][_0x4d77b2(0x2b0)][_0x4d77b2(0x5dc)]||'en-US',_0x4e8639={'maximumFractionDigits':0x6};_0x78afb4=_0x78afb4[_0x4d77b2(0x512)](/\[(.*?)\]/g,(_0x1f4a8a,_0x2b58d0)=>{const _0x16923a=_0x4d77b2;return VisuMZ[_0x16923a(0x4e7)](_0x2b58d0,'[',']');}),_0x78afb4=_0x78afb4[_0x4d77b2(0x512)](/<(.*?)>/g,(_0x1426e3,_0x216c0a)=>{const _0x100fdb=_0x4d77b2;return VisuMZ[_0x100fdb(0x4e7)](_0x216c0a,'<','>');}),_0x78afb4=_0x78afb4[_0x4d77b2(0x512)](/\{\{(.*?)\}\}/g,(_0x4066ce,_0x2ae81e)=>{return VisuMZ['PreserveNumbers'](_0x2ae81e,'','');}),_0x78afb4=_0x78afb4[_0x4d77b2(0x512)](/(\d+\.?\d*)/g,(_0x2612e8,_0x45df3e)=>{const _0x59ccda=_0x4d77b2;let _0x3853a4=_0x45df3e;if(_0x3853a4[0x0]==='0')return _0x3853a4;if(_0x3853a4[_0x3853a4['length']-0x1]==='.')return Number(_0x3853a4)['toLocaleString'](_0x3a7b20,_0x4e8639)+'.';else return _0x3853a4[_0x3853a4[_0x59ccda(0x200)]-0x1]===','?Number(_0x3853a4)[_0x59ccda(0x450)](_0x3a7b20,_0x4e8639)+',':Number(_0x3853a4)[_0x59ccda(0x450)](_0x3a7b20,_0x4e8639);});let _0x164820=0x3;while(_0x164820--){_0x78afb4=VisuMZ[_0x4d77b2(0x406)](_0x78afb4);}return _0x78afb4;},VisuMZ[_0x3a25e2(0x4e7)]=function(_0x5f3a28,_0x165dcc,_0x12e6a0){const _0xaff90d=_0x3a25e2;return _0x5f3a28=_0x5f3a28[_0xaff90d(0x512)](/(\d)/gi,(_0x3401f6,_0x547da1)=>_0xaff90d(0x3da)[_0xaff90d(0x534)](Number(_0x547da1))),_0xaff90d(0x3aa)[_0xaff90d(0x534)](_0x5f3a28,_0x165dcc,_0x12e6a0);},VisuMZ[_0x3a25e2(0x406)]=function(_0x51b23b){const _0x17a1fe=_0x3a25e2;return _0x51b23b=_0x51b23b[_0x17a1fe(0x512)](/PRESERVCONVERSION\((\d+)\)/gi,(_0x375840,_0x2f686c)=>Number(parseInt(_0x2f686c))),_0x51b23b;},VisuMZ[_0x3a25e2(0x13c)]=function(_0x1bc4c4){const _0x111ada=_0x3a25e2;SoundManager[_0x111ada(0x279)]();if(!Utils[_0x111ada(0x551)]()){const _0x13bc91=window[_0x111ada(0x38d)](_0x1bc4c4,_0x111ada(0x366));}else{const _0x5cda4a=process[_0x111ada(0x3cf)]==_0x111ada(0x6c9)?_0x111ada(0x38d):process[_0x111ada(0x3cf)]==_0x111ada(0x553)?_0x111ada(0x5de):_0x111ada(0x29d);require(_0x111ada(0x3f6))[_0x111ada(0x243)](_0x5cda4a+'\x20'+_0x1bc4c4);}},Game_Picture[_0x3a25e2(0x423)][_0x3a25e2(0x570)]=function(){return this['_anchor'];},VisuMZ['CoreEngine'][_0x3a25e2(0x33a)]=Game_Picture[_0x3a25e2(0x423)]['initBasic'],Game_Picture[_0x3a25e2(0x423)][_0x3a25e2(0x601)]=function(){const _0x1cdc37=_0x3a25e2;VisuMZ[_0x1cdc37(0x62c)][_0x1cdc37(0x33a)][_0x1cdc37(0x6d9)](this),this[_0x1cdc37(0x67b)]={'x':0x0,'y':0x0},this[_0x1cdc37(0x5a8)]={'x':0x0,'y':0x0};},VisuMZ[_0x3a25e2(0x62c)]['Game_Picture_updateMove']=Game_Picture[_0x3a25e2(0x423)][_0x3a25e2(0x1d8)],Game_Picture[_0x3a25e2(0x423)]['updateMove']=function(){const _0x1c2677=_0x3a25e2;this[_0x1c2677(0x36a)](),VisuMZ[_0x1c2677(0x62c)][_0x1c2677(0x5ca)][_0x1c2677(0x6d9)](this);},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x577)]=Game_Picture[_0x3a25e2(0x423)][_0x3a25e2(0x69e)],Game_Picture[_0x3a25e2(0x423)][_0x3a25e2(0x69e)]=function(_0x13f35c,_0x3e2ef9,_0x5215f7,_0x1dd204,_0xb55941,_0x37eb65,_0x88cfdf,_0x1048b3){const _0x295570=_0x3a25e2;VisuMZ[_0x295570(0x62c)][_0x295570(0x577)][_0x295570(0x6d9)](this,_0x13f35c,_0x3e2ef9,_0x5215f7,_0x1dd204,_0xb55941,_0x37eb65,_0x88cfdf,_0x1048b3),this[_0x295570(0x224)]([{'x':0x0,'y':0x0},{'x':0.5,'y':0.5}][_0x3e2ef9]||{'x':0x0,'y':0x0});},VisuMZ['CoreEngine'][_0x3a25e2(0x706)]=Game_Picture[_0x3a25e2(0x423)][_0x3a25e2(0x383)],Game_Picture[_0x3a25e2(0x423)][_0x3a25e2(0x383)]=function(_0x12418a,_0x19c689,_0x3d3cb1,_0x187395,_0x5cb3a9,_0x5e68a0,_0x507614,_0x123840,_0x4916c7){const _0x2c3fa8=_0x3a25e2;VisuMZ[_0x2c3fa8(0x62c)][_0x2c3fa8(0x706)][_0x2c3fa8(0x6d9)](this,_0x12418a,_0x19c689,_0x3d3cb1,_0x187395,_0x5cb3a9,_0x5e68a0,_0x507614,_0x123840,_0x4916c7),this['setTargetAnchor']([{'x':0x0,'y':0x0},{'x':0.5,'y':0.5}][_0x12418a]||{'x':0x0,'y':0x0});},Game_Picture[_0x3a25e2(0x423)][_0x3a25e2(0x36a)]=function(){const _0x4692e2=_0x3a25e2;this[_0x4692e2(0x4f9)]>0x0&&(this[_0x4692e2(0x67b)]['x']=this[_0x4692e2(0x1e0)](this[_0x4692e2(0x67b)]['x'],this[_0x4692e2(0x5a8)]['x']),this['_anchor']['y']=this[_0x4692e2(0x1e0)](this['_anchor']['y'],this['_targetAnchor']['y']));},Game_Picture[_0x3a25e2(0x423)][_0x3a25e2(0x224)]=function(_0x457978){const _0x189351=_0x3a25e2;this[_0x189351(0x67b)]=_0x457978,this[_0x189351(0x5a8)]=JsonEx['makeDeepCopy'](this['_anchor']);},Game_Picture[_0x3a25e2(0x423)][_0x3a25e2(0x67a)]=function(_0x2897e6){const _0x28c40b=_0x3a25e2;this[_0x28c40b(0x5a8)]=_0x2897e6;},VisuMZ[_0x3a25e2(0x62c)]['Sprite_Picture_updateOrigin']=Sprite_Picture[_0x3a25e2(0x423)][_0x3a25e2(0x2f7)],Sprite_Picture[_0x3a25e2(0x423)]['updateOrigin']=function(){const _0x1a2e4f=_0x3a25e2,_0x4c1f8d=this[_0x1a2e4f(0x400)]();!_0x4c1f8d[_0x1a2e4f(0x570)]()?VisuMZ['CoreEngine'][_0x1a2e4f(0x18e)]['call'](this):(this['anchor']['x']=_0x4c1f8d[_0x1a2e4f(0x570)]()['x'],this[_0x1a2e4f(0x570)]['y']=_0x4c1f8d[_0x1a2e4f(0x570)]()['y']);},Game_Action[_0x3a25e2(0x423)][_0x3a25e2(0x357)]=function(_0x19b2a4){const _0x1f9957=_0x3a25e2;if(_0x19b2a4){const _0x4b2071=_0x19b2a4[_0x1f9957(0x25f)];if(_0x4b2071===0x1&&this[_0x1f9957(0x416)]()[_0x1f9957(0x47e)]()!==0x1)this[_0x1f9957(0x695)]();else _0x4b2071===0x2&&this['subject']()['guardSkillId']()!==0x2?this[_0x1f9957(0x495)]():this[_0x1f9957(0x5cb)](_0x4b2071);}else this[_0x1f9957(0x493)]();},Game_Actor[_0x3a25e2(0x423)][_0x3a25e2(0x2af)]=function(){const _0x1b15d4=_0x3a25e2;return this['skills']()[_0x1b15d4(0x355)](_0x3e6fc5=>this[_0x1b15d4(0x1ef)](_0x3e6fc5)&&this['skillTypes']()[_0x1b15d4(0x42a)](_0x3e6fc5[_0x1b15d4(0x36d)]));},Window_Base[_0x3a25e2(0x423)][_0x3a25e2(0x513)]=function(){const _0x445a1a=_0x3a25e2;this[_0x445a1a(0x482)]=new Sprite(),this[_0x445a1a(0x482)][_0x445a1a(0x5bd)]=new Bitmap(0x0,0x0),this[_0x445a1a(0x482)]['x']=0x0,this[_0x445a1a(0x5b1)](this[_0x445a1a(0x482)]);},Window_Base['prototype'][_0x3a25e2(0x5da)]=function(){const _0x471f62=_0x3a25e2;if(this[_0x471f62(0x482)]){const _0x5b48dc=this[_0x471f62(0x482)][_0x471f62(0x5bd)],_0x4fa440=this[_0x471f62(0x286)],_0x2a3e84=this['height'],_0x21dfb1=this['padding'],_0x2d16e1=ColorManager[_0x471f62(0x707)](),_0x389f00=ColorManager[_0x471f62(0x4f3)]();_0x5b48dc[_0x471f62(0x59c)](_0x4fa440,_0x2a3e84),_0x5b48dc['gradientFillRect'](0x0,0x0,_0x4fa440,_0x21dfb1,_0x389f00,_0x2d16e1,!![]),_0x5b48dc[_0x471f62(0x31f)](0x0,_0x21dfb1,_0x4fa440,_0x2a3e84-_0x21dfb1*0x2,_0x2d16e1),_0x5b48dc[_0x471f62(0x3a3)](0x0,_0x2a3e84-_0x21dfb1,_0x4fa440,_0x21dfb1,_0x2d16e1,_0x389f00,!![]),this['_dimmerSprite'][_0x471f62(0x669)](0x0,0x0,_0x4fa440,_0x2a3e84);}},Game_Actor['prototype'][_0x3a25e2(0x382)]=function(){const _0x2e67d5=_0x3a25e2;for(let _0x4bd2ba=0x0;_0x4bd2ba<this[_0x2e67d5(0x683)]();_0x4bd2ba++){const _0x46ee68=this[_0x2e67d5(0x5c0)]();let _0x400bfc=Number['MIN_SAFE_INTEGER'];this['setAction'](_0x4bd2ba,_0x46ee68[0x0]);for(const _0x10b50b of _0x46ee68){const _0x146125=_0x10b50b['evaluate']();_0x146125>_0x400bfc&&(_0x400bfc=_0x146125,this[_0x2e67d5(0x14a)](_0x4bd2ba,_0x10b50b));}}this['setActionState'](_0x2e67d5(0x3d0));},Window_BattleItem[_0x3a25e2(0x423)][_0x3a25e2(0x1ae)]=function(_0x56be19){const _0x240b4f=_0x3a25e2;return BattleManager[_0x240b4f(0x4ee)]()?BattleManager['actor']()[_0x240b4f(0x1ef)](_0x56be19):Window_ItemList[_0x240b4f(0x423)][_0x240b4f(0x1ae)][_0x240b4f(0x6d9)](this,_0x56be19);},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x3b9)]=Scene_Map[_0x3a25e2(0x423)]['createSpriteset'],Scene_Map[_0x3a25e2(0x423)]['createSpriteset']=function(){const _0x283224=_0x3a25e2;VisuMZ['CoreEngine'][_0x283224(0x3b9)]['call'](this);const _0x597dbf=this['_spriteset'][_0x283224(0x630)];if(_0x597dbf)this[_0x283224(0x1c7)](_0x597dbf);},VisuMZ[_0x3a25e2(0x62c)][_0x3a25e2(0x4f2)]=Scene_Battle['prototype'][_0x3a25e2(0x549)],Scene_Battle[_0x3a25e2(0x423)][_0x3a25e2(0x549)]=function(){const _0x334e12=_0x3a25e2;VisuMZ['CoreEngine']['Scene_Battle_createSpriteset'][_0x334e12(0x6d9)](this);const _0x31ff2e=this[_0x334e12(0x2d0)]['_timerSprite'];if(_0x31ff2e)this['addChild'](_0x31ff2e);};