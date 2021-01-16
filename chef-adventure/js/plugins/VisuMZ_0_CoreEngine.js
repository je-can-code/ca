//=============================================================================
// VisuStella MZ - Core Engine
// VisuMZ_0_CoreEngine.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_0_CoreEngine = true;

var VisuMZ = VisuMZ || {};
VisuMZ.CoreEngine = VisuMZ.CoreEngine || {};
VisuMZ.CoreEngine.version = 1.04;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 0] [Version 1.04] [CoreEngine]
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
 * - Enemies are unaffected by the Attack Skill Trait. This means if they have
 * an Attack action, they will always use Attack over and over even if their
 * Attack Skill Trait has been changed. This plugin will change it up so that
 * the Attack skill will comply with whatever their Attack Skill Trait's skill
 * is set to.
 *
 * ---
 *
 * Auto Battle Actor Skill Usage
 *
 * - If an actor with Auto Battle has access to a skill but not have any access
 * to that skill's type, that actor will still be able to use the skill during
 * Auto Battle despite the fact that the actor cannot use that skill during
 * manual input.
 *
 * ---
 *
 * Move Picture, Origin Differences
 *
 * - If a Show Picture event command is made with an Origin setting of
 * "Upper Left" and a Move Picture event command is made afterwards with an
 * Origin setting of "Center", RPG Maker MZ would originally have it instantly
 * jump into the new origin setting without making a clean transition between
 * them. This plugin will create that clean transition between origins.
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
 * System: Time Progress Battle
 * - Switch between Default or Time Progress battle system.
 *
 *   Change To:
 *   - Choose which battle system to switch to.
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
 *   NewGame > CommonEvent:
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
 *   Outline Color:
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
 * @command SystemSetTimeProgress
 * @text System: Time Progress Battle
 * @desc Switch between Default or Time Progress battle system.
 *
 * @arg option:str
 * @text Change To
 * @type select
 * @option Default Turn Battle
 * @value Default Turn Battle
 * @option Time Progress Battle
 * @value Time Progress Battle
 * @option Toggle
 * @value Toggle
 * @desc Choose which battle system to switch to.
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
 * @default {"General":"","Enable:eval":"true","Location:str":"bottom","BgType:num":"0","Text":"","TextFmt:str":"%1:%2","MultiKeyFmt:str":"%1/%2","OkText:str":"Select","CancelText:str":"Back","SwitchActorText:str":"Switch Ally","Keys":"","KeyUnlisted:str":"\\}❪%1❫\\{","KeyUP:str":"^","KeyDOWN:str":"v","KeyLEFT:str":"<<","KeyRIGHT:str":">>","KeyA:str":"A","KeyB:str":"B","KeyC:str":"C","KeyD:str":"D","KeyE:str":"E","KeyF:str":"F","KeyG:str":"G","KeyH:str":"H","KeyI:str":"I","KeyJ:str":"J","KeyK:str":"K","KeyL:str":"L","KeyM:str":"M","KeyN:str":"N","KeyO:str":"O","KeyP:str":"P","KeyQ:str":"Q","KeyR:str":"R","KeyS:str":"S","KeyT:str":"T","KeyU:str":"U","KeyV:str":"V","KeyW:str":"W","KeyX:str":"X","KeyY:str":"Y","KeyZ:str":"Z"}
 *
 * @param MenuLayout:struct
 * @text Menu Layout Settings
 * @type struct<MenuLayout>
 * @desc Change how menu layouts look for each scene.
 * @default {"Title:struct":"{\"TitleScreen\":\"\",\"DocumentTitleFmt:str\":\"%1: %2 - Version %3\",\"Subtitle:str\":\"Subtitle\",\"Version:str\":\"0.00\",\"drawGameTitle:func\":\"\\\"const x = 20;\\\\nconst y = Graphics.height / 4;\\\\nconst maxWidth = Graphics.width - x * 2;\\\\nconst text = $dataSystem.gameTitle;\\\\nconst bitmap = this._gameTitleSprite.bitmap;\\\\nbitmap.fontFace = $gameSystem.mainFontFace();\\\\nbitmap.outlineColor = \\\\\\\"black\\\\\\\";\\\\nbitmap.outlineWidth = 8;\\\\nbitmap.fontSize = 72;\\\\nbitmap.drawText(text, x, y, maxWidth, 48, \\\\\\\"center\\\\\\\");\\\"\",\"drawGameSubtitle:func\":\"\\\"const x = 20;\\\\nconst y = Graphics.height / 4 + 72;\\\\nconst maxWidth = Graphics.width - x * 2;\\\\nconst text = Scene_Title.subtitle;\\\\nconst bitmap = this._gameTitleSprite.bitmap;\\\\nbitmap.fontFace = $gameSystem.mainFontFace();\\\\nbitmap.outlineColor = \\\\\\\"black\\\\\\\";\\\\nbitmap.outlineWidth = 6;\\\\nbitmap.fontSize = 48;\\\\nbitmap.drawText(text, x, y, maxWidth, 48, \\\\\\\"center\\\\\\\");\\\"\",\"drawGameVersion:func\":\"\\\"const bitmap = this._gameTitleSprite.bitmap;\\\\nconst x = 0;\\\\nconst y = Graphics.height - 20;\\\\nconst width = Math.round(Graphics.width / 4);\\\\nconst height = 20;\\\\nconst c1 = ColorManager.dimColor1();\\\\nconst c2 = ColorManager.dimColor2();\\\\nconst text = 'Version ' + Scene_Title.version;\\\\nbitmap.gradientFillRect(x, y, width, height, c1, c2);\\\\nbitmap.fontFace = $gameSystem.mainFontFace();\\\\nbitmap.outlineColor = \\\\\\\"black\\\\\\\";\\\\nbitmap.outlineWidth = 3;\\\\nbitmap.fontSize = 16;\\\\nbitmap.drawText(text, x + 4, y, Graphics.width, height, \\\\\\\"left\\\\\\\");\\\"\",\"CommandRect:func\":\"\\\"const offsetX = $dataSystem.titleCommandWindow.offsetX;\\\\nconst offsetY = $dataSystem.titleCommandWindow.offsetY;\\\\nconst rows = this.commandWindowRows();\\\\nconst width = this.mainCommandWidth();\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nconst x = (Graphics.boxWidth - width) / 2 + offsetX;\\\\nconst y = Graphics.boxHeight - height - 96 + offsetY;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ButtonFadeSpeed:num\":\"4\"}","MainMenu:struct":"{\"CommandWindow\":\"\",\"CommandBgType:num\":\"0\",\"CommandRect:func\":\"\\\"const width = this.mainCommandWidth();\\\\nconst height = this.mainAreaHeight() - this.goldWindowRect().height;\\\\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\\\\nconst y = this.mainAreaTop();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"GoldWindow\":\"\",\"GoldBgType:num\":\"0\",\"GoldRect:func\":\"\\\"const rows = 1;\\\\nconst width = this.mainCommandWidth();\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\\\\nconst y = this.mainAreaBottom() - height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusWindow\":\"\",\"StatusBgType:num\":\"0\",\"StatusRect:func\":\"\\\"const width = Graphics.boxWidth - this.mainCommandWidth();\\\\nconst height = this.mainAreaHeight();\\\\nconst x = this.isRightInputMode() ? 0 : Graphics.boxWidth - width;\\\\nconst y = this.mainAreaTop();\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","ItemMenu:struct":"{\"HelpWindow\":\"\",\"HelpBgType:num\":\"0\",\"HelpRect:func\":\"\\\"const x = 0;\\\\nconst y = this.helpAreaTop();\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.helpAreaHeight();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"CategoryWindow\":\"\",\"CategoryBgType:num\":\"0\",\"CategoryRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst rows = 1;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ItemWindow\":\"\",\"ItemBgType:num\":\"0\",\"ItemRect:func\":\"\\\"const x = 0;\\\\nconst y = this._categoryWindow.y + this._categoryWindow.height;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaBottom() - y;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ActorWindow\":\"\",\"ActorBgType:num\":\"0\",\"ActorRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaHeight();\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","SkillMenu:struct":"{\"HelpWindow\":\"\",\"HelpBgType:num\":\"0\",\"HelpRect:func\":\"\\\"const x = 0;\\\\nconst y = this.helpAreaTop();\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.helpAreaHeight();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"SkillTypeWindow\":\"\",\"SkillTypeBgType:num\":\"0\",\"SkillTypeRect:func\":\"\\\"const rows = 3;\\\\nconst width = this.mainCommandWidth();\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nconst x = this.isRightInputMode() ? Graphics.boxWidth - width : 0;\\\\nconst y = this.mainAreaTop();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusWindow\":\"\",\"StatusBgType:num\":\"0\",\"StatusRect:func\":\"\\\"const width = Graphics.boxWidth - this.mainCommandWidth();\\\\nconst height = this._skillTypeWindow.height;\\\\nconst x = this.isRightInputMode() ? 0 : Graphics.boxWidth - width;\\\\nconst y = this.mainAreaTop();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ItemWindow\":\"\",\"ItemBgType:num\":\"0\",\"ItemRect:func\":\"\\\"const x = 0;\\\\nconst y = this._statusWindow.y + this._statusWindow.height;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaHeight() - this._statusWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ActorWindow\":\"\",\"ActorBgType:num\":\"0\",\"ActorRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaHeight();\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","EquipMenu:struct":"{\"HelpWindow\":\"\",\"HelpBgType:num\":\"0\",\"HelpRect:func\":\"\\\"const x = 0;\\\\nconst y = this.helpAreaTop();\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.helpAreaHeight();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusWindow\":\"\",\"StatusBgType:num\":\"0\",\"StatusRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst width = this.statusWidth();\\\\nconst height = this.mainAreaHeight();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"CommandWindow\":\"\",\"CommandBgType:num\":\"0\",\"CommandRect:func\":\"\\\"const x = this.statusWidth();\\\\nconst y = this.mainAreaTop();\\\\nconst rows = 1;\\\\nconst width = Graphics.boxWidth - this.statusWidth();\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"SlotWindow\":\"\",\"SlotBgType:num\":\"0\",\"SlotRect:func\":\"\\\"const commandWindowRect = this.commandWindowRect();\\\\nconst x = this.statusWidth();\\\\nconst y = commandWindowRect.y + commandWindowRect.height;\\\\nconst width = Graphics.boxWidth - this.statusWidth();\\\\nconst height = this.mainAreaHeight() - commandWindowRect.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ItemWindow\":\"\",\"ItemBgType:num\":\"0\",\"ItemRect:func\":\"\\\"return this.slotWindowRect();\\\"\"}","StatusMenu:struct":"{\"ProfileWindow\":\"\",\"ProfileBgType:num\":\"0\",\"ProfileRect:func\":\"\\\"const width = Graphics.boxWidth;\\\\nconst height = this.profileHeight();\\\\nconst x = 0;\\\\nconst y = this.mainAreaBottom() - height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusWindow\":\"\",\"StatusBgType:num\":\"0\",\"StatusRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.statusParamsWindowRect().y - y;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusParamsWindow\":\"\",\"StatusParamsBgType:num\":\"0\",\"StatusParamsRect:func\":\"\\\"const width = this.statusParamsWidth();\\\\nconst height = this.statusParamsHeight();\\\\nconst x = 0;\\\\nconst y = this.mainAreaBottom() - this.profileHeight() - height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusEquipWindow\":\"\",\"StatusEquipBgType:num\":\"0\",\"StatusEquipRect:func\":\"\\\"const width = Graphics.boxWidth - this.statusParamsWidth();\\\\nconst height = this.statusParamsHeight();\\\\nconst x = this.statusParamsWidth();\\\\nconst y = this.mainAreaBottom() - this.profileHeight() - height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","OptionsMenu:struct":"{\"OptionsWindow\":\"\",\"OptionsBgType:num\":\"0\",\"OptionsRect:func\":\"\\\"const n = Math.min(this.maxCommands(), this.maxVisibleCommands());\\\\nconst width = 400;\\\\nconst height = this.calcWindowHeight(n, true);\\\\nconst x = (Graphics.boxWidth - width) / 2;\\\\nconst y = (Graphics.boxHeight - height) / 2;\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","SaveMenu:struct":"{\"HelpWindow\":\"\",\"HelpBgType:num\":\"0\",\"HelpRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst rows = 1;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.calcWindowHeight(rows, false);\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ListWindow\":\"\",\"ListBgType:num\":\"0\",\"ListRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop() + this._helpWindow.height;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaHeight() - this._helpWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","LoadMenu:struct":"{\"HelpWindow\":\"\",\"HelpBgType:num\":\"0\",\"HelpRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst rows = 1;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.calcWindowHeight(rows, false);\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"ListWindow\":\"\",\"ListBgType:num\":\"0\",\"ListRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop() + this._helpWindow.height;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaHeight() - this._helpWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","GameEnd:struct":"{\"CommandList:arraystruct\":\"[\\\"{\\\\\\\"Symbol:str\\\\\\\":\\\\\\\"toTitle\\\\\\\",\\\\\\\"TextStr:str\\\\\\\":\\\\\\\"Untitled\\\\\\\",\\\\\\\"TextJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return TextManager.toTitle;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"ShowJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return true;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"EnableJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return true;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"ExtJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return null;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"CallHandlerJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"SceneManager._scene.commandToTitle();\\\\\\\\\\\\\\\"\\\\\\\"}\\\",\\\"{\\\\\\\"Symbol:str\\\\\\\":\\\\\\\"cancel\\\\\\\",\\\\\\\"TextStr:str\\\\\\\":\\\\\\\"Untitled\\\\\\\",\\\\\\\"TextJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return TextManager.cancel;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"ShowJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return true;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"EnableJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return true;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"ExtJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"return null;\\\\\\\\\\\\\\\"\\\\\\\",\\\\\\\"CallHandlerJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"SceneManager._scene.popScene();\\\\\\\\\\\\\\\"\\\\\\\"}\\\"]\",\"CommandBgType:num\":\"0\",\"CommandRect:func\":\"\\\"const rows = 2;\\\\nconst width = this.mainCommandWidth();\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nconst x = (Graphics.boxWidth - width) / 2;\\\\nconst y = (Graphics.boxHeight - height) / 2;\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","ShopMenu:struct":"{\"HelpWindow\":\"\",\"HelpBgType:num\":\"0\",\"HelpRect:func\":\"\\\"const wx = 0;\\\\nconst wy = this.helpAreaTop();\\\\nconst ww = Graphics.boxWidth;\\\\nconst wh = this.helpAreaHeight();\\\\nreturn new Rectangle(wx, wy, ww, wh);\\\"\",\"GoldWindow\":\"\",\"GoldBgType:num\":\"0\",\"GoldRect:func\":\"\\\"const rows = 1;\\\\nconst width = this.mainCommandWidth();\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nconst x = Graphics.boxWidth - width;\\\\nconst y = this.mainAreaTop();\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"CommandWindow\":\"\",\"CommandBgType:num\":\"0\",\"CommandRect:func\":\"\\\"const x = 0;\\\\nconst y = this.mainAreaTop();\\\\nconst rows = 1;\\\\nconst width = this._goldWindow.x;\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"DummyWindow\":\"\",\"DummyBgType:num\":\"0\",\"DummyRect:func\":\"\\\"const x = 0;\\\\nconst y = this._commandWindow.y + this._commandWindow.height;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.mainAreaHeight() - this._commandWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"NumberWindow\":\"\",\"NumberBgType:num\":\"0\",\"NumberRect:func\":\"\\\"const x = 0;\\\\nconst y = this._dummyWindow.y;\\\\nconst width = Graphics.boxWidth - this.statusWidth();\\\\nconst height = this._dummyWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"StatusWindow\":\"\",\"StatusBgType:num\":\"0\",\"StatusRect:func\":\"\\\"const width = this.statusWidth();\\\\nconst height = this._dummyWindow.height;\\\\nconst x = Graphics.boxWidth - width;\\\\nconst y = this._dummyWindow.y;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"BuyWindow\":\"\",\"BuyBgType:num\":\"0\",\"BuyRect:func\":\"\\\"const x = 0;\\\\nconst y = this._dummyWindow.y;\\\\nconst width = Graphics.boxWidth - this.statusWidth();\\\\nconst height = this._dummyWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"CategoryWindow\":\"\",\"CategoryBgType:num\":\"0\",\"CategoryRect:func\":\"\\\"const x = 0;\\\\nconst y = this._dummyWindow.y;\\\\nconst rows = 1;\\\\nconst width = Graphics.boxWidth;\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"SellWindow\":\"\",\"SellBgType:num\":\"0\",\"SellRect:func\":\"\\\"const x = 0;\\\\nconst y = this._categoryWindow.y + this._categoryWindow.height;\\\\nconst width = Graphics.boxWidth;\\\\nconst height =\\\\n    this.mainAreaHeight() -\\\\n    this._commandWindow.height -\\\\n    this._categoryWindow.height;\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}","NameMenu:struct":"{\"EditWindow\":\"\",\"EditBgType:num\":\"0\",\"EditRect:func\":\"\\\"const rows = 9;\\\\nconst inputWindoheighteight = this.calcWindowHeight(rows, true);\\\\nconst padding = $gameSystem.windowPadding();\\\\nconst width = 600;\\\\nconst height = ImageManager.faceHeight + padding * 2;\\\\nconst x = (Graphics.boxWidth - width) / 2;\\\\nconst y = (Graphics.boxHeight - (height + inputWindoheighteight + 8)) / 2;\\\\nreturn new Rectangle(x, y, width, height);\\\"\",\"InputWindow\":\"\",\"InputBgType:num\":\"0\",\"InputRect:func\":\"\\\"const x = this._editWindow.x;\\\\nconst y = this._editWindow.y + this._editWindow.height + 8;\\\\nconst rows = 9;\\\\nconst width = this._editWindow.width;\\\\nconst height = this.calcWindowHeight(rows, true);\\\\nreturn new Rectangle(x, y, width, height);\\\"\"}"}
 *
 * @param Param:struct
 * @text Parameter Settings
 * @type struct<Param>
 * @desc Change up the limits of parameters and how they're calculated.
 * @default {"DisplayedParams:arraystr":"[\"ATK\",\"DEF\",\"MAT\",\"MDF\",\"AGI\",\"LUK\"]","ExtDisplayedParams:arraystr":"[\"MaxHP\",\"MaxMP\",\"ATK\",\"DEF\",\"MAT\",\"MDF\",\"AGI\",\"LUK\"]","BasicParameters":"","CrisisRate:num":"0.25","BasicParameterFormula:func":"\"// Determine the variables used in this calculation.\\nlet paramId = arguments[0];\\nlet base = this.paramBase(paramId);\\nlet plus = this.paramPlus(paramId);\\nlet paramRate = this.paramRate(paramId);\\nlet buffRate = this.paramBuffRate(paramId);\\nlet flatBonus = this.paramFlatBonus(paramId);\\n\\n// Formula to determine total parameter value.\\nlet value = (base + plus) * paramRate * buffRate + flatBonus;\\n\\n// Determine the limits\\nconst maxValue = this.paramMax(paramId);\\nconst minValue = this.paramMin(paramId);\\n\\n// Final value\\nreturn Math.round(value.clamp(minValue, maxValue));\"","BasicParamCaps":"","BasicActorParamCaps":"","BasicActorParamMax0:str":"9999","BasicActorParamMax1:str":"9999","BasicActorParamMax2:str":"999","BasicActorParamMax3:str":"999","BasicActorParamMax4:str":"999","BasicActorParamMax5:str":"999","BasicActorParamMax6:str":"999","BasicActorParamMax7:str":"999","BasicEnemyParamCaps":"","BasicEnemyParamMax0:str":"999999","BasicEnemyParamMax1:str":"9999","BasicEnemyParamMax2:str":"999","BasicEnemyParamMax3:str":"999","BasicEnemyParamMax4:str":"999","BasicEnemyParamMax5:str":"999","BasicEnemyParamMax6:str":"999","BasicEnemyParamMax7:str":"999","XParameters":"","XParameterFormula:func":"\"// Determine the variables used in this calculation.\\nlet xparamId = arguments[0];\\nlet base = this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId);\\nlet plus = this.xparamPlus(xparamId);\\nlet paramRate = this.xparamRate(xparamId);\\nlet flatBonus = this.xparamFlatBonus(xparamId);\\n\\n// Formula to determine total parameter value.\\nlet value = (base + plus) * paramRate + flatBonus;\\n\\n// Final value\\nreturn value;\"","XParamVocab":"","XParamVocab0:str":"Hit","XParamVocab1:str":"Evasion","XParamVocab2:str":"Critical Rate","XParamVocab3:str":"Critical Evade","XParamVocab4:str":"Magic Evade","XParamVocab5:str":"Magic Reflect","XParamVocab6:str":"Counter","XParamVocab7:str":"HP Regen","XParamVocab8:str":"MP Regen","XParamVocab9:str":"TP Regen","SParameters":"","SParameterFormula:func":"\"// Determine the variables used in this calculation.\\nlet sparamId = arguments[0];\\nlet base = this.traitsPi(Game_BattlerBase.TRAIT_SPARAM, sparamId);\\nlet plus = this.sparamPlus(sparamId);\\nlet paramRate = this.sparamRate(sparamId);\\nlet flatBonus = this.sparamFlatBonus(sparamId);\\n\\n// Formula to determine total parameter value.\\nlet value = (base + plus) * paramRate + flatBonus;\\n\\n// Final value\\nreturn value;\"","SParamVocab":"","SParamVocab0:str":"Aggro","SParamVocab1:str":"Guard","SParamVocab2:str":"Recovery","SParamVocab3:str":"Item Effect","SParamVocab4:str":"MP Cost","SParamVocab5:str":"TP Charge","SParamVocab6:str":"Physical DMG","SParamVocab7:str":"Magical DMG","SParamVocab8:str":"Floor DMG","SParamVocab9:str":"EXP Gain","Icons":"","DrawIcons:eval":"true","IconParam0:str":"84","IconParam1:str":"165","IconParam2:str":"76","IconParam3:str":"81","IconParam4:str":"101","IconParam5:str":"133","IconParam6:str":"140","IconParam7:str":"87","IconXParam0:str":"102","IconXParam1:str":"82","IconXParam2:str":"78","IconXParam3:str":"82","IconXParam4:str":"171","IconXParam5:str":"222","IconXParam6:str":"77","IconXParam7:str":"72","IconXParam8:str":"72","IconXParam9:str":"72","IconSParam0:str":"5","IconSParam1:str":"128","IconSParam2:str":"72","IconSParam3:str":"176","IconSParam4:str":"165","IconSParam5:str":"164","IconSParam6:str":"76","IconSParam7:str":"79","IconSParam8:str":"141","IconSParam9:str":"73"}
 *
 * @param TitleCommandList:arraystruct
 * @text Title Command List
 * @type struct<Command>[]
 * @desc Window commands used by the title screen.
 * Add new commands here.
 * @default ["{\"Symbol:str\":\"newGame\",\"TextStr:str\":\"Untitled\",\"TextJS:func\":\"\\\"return TextManager.newGame;\\\"\",\"ShowJS:func\":\"\\\"return true;\\\"\",\"EnableJS:func\":\"\\\"return true;\\\"\",\"ExtJS:func\":\"\\\"return null;\\\"\",\"CallHandlerJS:func\":\"\\\"SceneManager._scene.commandNewGame();\\\"\"}","{\"Symbol:str\":\"continue\",\"TextStr:str\":\"Untitled\",\"TextJS:func\":\"\\\"return TextManager.continue_;\\\"\",\"ShowJS:func\":\"\\\"return true;\\\"\",\"EnableJS:func\":\"\\\"return DataManager.isAnySavefileExists();\\\"\",\"ExtJS:func\":\"\\\"return null;\\\"\",\"CallHandlerJS:func\":\"\\\"SceneManager._scene.commandContinue();\\\"\"}","{\"Symbol:str\":\"options\",\"TextStr:str\":\"Untitled\",\"TextJS:func\":\"\\\"return TextManager.options;\\\"\",\"ShowJS:func\":\"\\\"return true;\\\"\",\"EnableJS:func\":\"\\\"return true;\\\"\",\"ExtJS:func\":\"\\\"return null;\\\"\",\"CallHandlerJS:func\":\"\\\"SceneManager._scene.commandOptions();\\\"\"}","{\"Symbol:str\":\"shutdown\",\"TextStr:str\":\"Untitled\",\"TextJS:func\":\"\\\"return TextManager.gameEnd;\\\"\",\"ShowJS:func\":\"\\\"return Utils.isNwjs();\\\"\",\"EnableJS:func\":\"\\\"return true;\\\"\",\"ExtJS:func\":\"\\\"return null;\\\"\",\"CallHandlerJS:func\":\"\\\"SceneManager.exit();\\\"\"}"]
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
 * @param BreakExperimental1
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param Experimental Parameters
 * @default Use at your own risk!!!
 *
 * @param BreakExperimental2
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param ScreenShake:struct
 * @text Screen Shake Settings
 * @type struct<ScreenShake>
 * @desc Get more screen shake effects into your game!
 * @default {"DefaultStyle:str":"random","originalJS:func":"\"// Calculation\\nthis.x += Math.round($gameScreen.shake());\"","randomJS:func":"\"// Calculation\\n// Original Formula by Aries of Sheratan\\nconst power = $gameScreen._shakePower * 0.75;\\nconst speed = $gameScreen._shakeSpeed * 0.60;\\nconst duration = $gameScreen._shakeDuration;\\nthis.x += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);\\nthis.y += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);\"","horzJS:func":"\"// Calculation\\n// Original Formula by Aries of Sheratan\\nconst power = $gameScreen._shakePower * 0.75;\\nconst speed = $gameScreen._shakeSpeed * 0.60;\\nconst duration = $gameScreen._shakeDuration;\\nthis.x += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);\"","vertJS:func":"\"// Calculation\\n// Original Formula by Aries of Sheratan\\nconst power = $gameScreen._shakePower * 0.75;\\nconst speed = $gameScreen._shakeSpeed * 0.60;\\nconst duration = $gameScreen._shakeDuration;\\nthis.y += Math.round(Math.randomInt(power) - Math.randomInt(speed)) * (Math.min(duration, 30) * 0.5);\""}
 *
 * @param jsQuickFunc:arraystruct
 * @text JS: Quick Functions
 * @type struct<jsQuickFunc>[]
 * @desc Create quick JavaScript functions available from the
 * global namespace. Use with caution and moderation!!!
 * @default ["{\"FunctionName:str\":\"Example\",\"CodeJS:json\":\"\\\"// Insert this as a function anywhere you can input code\\\\n// such as Script Calls or Conditional Branch Scripts.\\\\n\\\\n// Process Code\\\\nreturn 'Example';\\\"\"}","{\"FunctionName:str\":\"Bad  Code  Name\",\"CodeJS:json\":\"\\\"// If a function name has spaces in them, the spaces will\\\\n// be removed. \\\\\\\"Bad  Code  Name\\\\\\\" becomes \\\\\\\"BadeCodeName\\\\\\\".\\\\n\\\\n// Process Code\\\\nOhNoItsBadCode()\\\\n\\\\n// If a function has bad code, a fail safe will catch the\\\\n// error and display it in the console.\\\"\"}","{\"FunctionName:str\":\"RandomNumber\",\"CodeJS:json\":\"\\\"// This generates a random number from 0 to itself.\\\\n// Example: RandomNumber(10)\\\\n\\\\n// Process Code\\\\nconst number = (arguments[0] || 0) + 1;\\\\nreturn Math.floor(number * Math.random());\\\"\"}","{\"FunctionName:str\":\"RandomBetween\",\"CodeJS:json\":\"\\\"// This generates a random number between two arguments.\\\\n// Example: RandomNumber(5, 10)\\\\n\\\\n// Process Code\\\\nlet min = Math.min(arguments[0] || 0, arguments[1] || 0);\\\\nlet max = Math.max(arguments[0] || 0, arguments[1] || 0);\\\\nreturn Math.floor(Math.random() * (max - min + 1) + min);\\\"\"}","{\"FunctionName:str\":\"RandomFrom\",\"CodeJS:json\":\"\\\"// Selects a number from the list of inserted numbers.\\\\n// Example: RandomFromt(5, 10, 15, 20)\\\\n\\\\n// Process Code\\\\nreturn arguments[Math.randomInt(arguments.length)];\\\"\"}"]
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
 * @desc Runs a common event each time a new game is started.
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
 * @text Outline Color
 * @parent AlphaColors
 * @desc Colors with a bit of alpha settings.
 * Format rgba(0-255, 0-255, 0-255, 0-1)
 * @default rgba(0, 0, 0, 0.6)
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
 * @default {"EditWindow":"","EditBgType:num":"0","EditRect:func":"\"const rows = 9;\\nconst inputWindowHeight = this.calcWindowHeight(rows, true);\\nconst padding = $gameSystem.windowPadding();\\nconst width = 600;\\nconst height = Math.min(ImageManager.faceHeight + padding * 2, this.mainAreaHeight() - inputWindowHeight);\\nconst x = (Graphics.boxWidth - width) / 2;\\nconst y = (this.mainAreaHeight() - (height + inputWindowHeight)) / 2;\\nreturn new Rectangle(x, y, width, height);\"","InputWindow":"","InputBgType:num":"0","InputRect:func":"\"const x = this._editWindow.x;\\nconst y = this._editWindow.y + this._editWindow.height;\\nconst rows = 9;\\nconst width = this._editWindow.width;\\nconst height = this.calcWindowHeight(rows, true);\\nreturn new Rectangle(x, y, width, height);\""}
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
 * @default "const rows = 9;\nconst inputWindowHeight = this.calcWindowHeight(rows, true);\nconst padding = $gameSystem.windowPadding();\nconst width = 600;\nconst height = Math.min(ImageManager.faceHeight + padding * 2, this.mainAreaHeight() - inputWindowHeight);\nconst x = (Graphics.boxWidth - width) / 2;\nconst y = (this.mainAreaHeight() - (height + inputWindowHeight)) / 2;\nreturn new Rectangle(x, y, width, height);"
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
 * them)? WARNING: Turning it off may have unwanted effects.
 * @default true
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
//=============================================================================

const _0x28a2=['TextFmt','adjustSprite','isUseModernControls','Window_ShopSell_isEnabled','Game_Picture_y','buttonAssistWindowRect','IXalv','IconXParam3','SParamVocab9','consumeItem','IconSParam1','ColSpacing','CqbrH','updatePositionCoreEngineShakeOriginal','targetScaleY','Settings','getCustomBackgroundSettings','ModernControls','_animation','altKey','_backSprite2','ExtJS','imageSmoothingEnabled','DOUBLE_QUOTE','bgmVolume','KZuqN','_stored_tpGaugeColor2','vertical','changeTextColor','ActorBgType','test','buttonAssistOffset2','Linear','NUMPAD8','xparam','abs','gGsmc','Sprite_Picture_updateOrigin','cursorUp','Sprite_Gauge_gaugeRate','INSERT','xparamPlus2','font-smooth','advanced','textSizeEx','isOpen','process_VisuMZ_CoreEngine_Notetags','_encounterCount','drawCurrencyValue','center','SceneManager_isGameActive','shift','_scene','touchUI','buttonAssistOk','TextCodeClassNames','paramWidth','SystemSetWindowPadding','xdg-open','pendingColor','tiOAq','drawParamName','Flat2','map','processAlwaysEscape','IconSParam8','mpGaugeColor2','xjBPc','goldWindowRect','getButtonAssistLocation','BulII','_listWindow','WIN_OEM_WSCTRL','_changingClass','YYESl','anchor','setTargetAnchor','maxLvGaugeColor1','OUTQUINT','wholeDuration','areTileShadowsHidden','getLastPluginCommandInterpreter','StatusEquipRect','inBattle','BgFilename2','processFauxAnimationRequests','xparamFlat1','ColorMaxLvGauge2','ProfileBgType','apply','targetSpritePosition','isMVAnimation','layoutSettings','attackSkillId','applyEasing','ETcKn','UNDERSCORE','makeCommandList','Game_Interpreter_command231','retrieveFauxAnimation','initDigitGrouping','EditRect','ESC','eDHXV','SkYAA','AMPERSAND','updateMove','charAt','addCommand','outbounce','kpSue','setMainFontSize','TAB','FQxDt','CVpFx','TitleCommandList','bgsVolume','SystemSetTimeProgress','itemLineRect','gfBFe','EndingID','WIN_OEM_RESET','Sprite_Animation_processSoundTimings','Flat1','PRESERVCONVERSION(%1)','includes','gaugeHeight','QvtmL','enableDigitGroupingEx','IconXParam7','isMenuButtonAssistEnabled','WIN_OEM_COPY','paramName','WIN_ICO_CLEAR','CommandBgType','xiqJa','Game_Picture_updateMove','STR','INELASTIC','Graphics_centerElement','BaseTexture','_statusWindow','QHUFW','HRG','resetFontSettings','param','right','VxfWN','_drawTextShadow','_hp','onClick','clear','sCRkV','TfXlr','Scene_Battle_update','RkmpH','qNamY','WBIVN','YZTAq','maxBattleMembers','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','CNT','ImgLoad','mainAreaHeight','_anchor','CoreEngine','ItemRect','isGameActive','_commandWindow','makeDocumentTitle','listWindowRect','buttonAssistText4','initCoreEngine','INBOUNCE','command111','Scene_Boot_loadSystemImages','_effectsContainer','actorWindowRect','Game_BattlerBase_refresh','performEscape','tab','snapForBackground','LxHlz','CrisisRate','maxItems','Game_Actor_levelUp','processMoveCommand','SaveMenu','max','round','FontSize','retreat','bitmapWidth','_actorWindow','hpGaugeColor1','_stored_mpCostColor','CancelText','Plus1','EVA','udwgk','ipnEe','Scene_GameEnd_createBackground','Spriteset_Battle_createEnemies','hHFno','start','dummyWindowRect','floor','Scene_Base_createWindowLayer','padding','VKbdO','createBackground','darwin','AccuracyBoost','_isPlaytest','erasePicture','Window_Gold_refresh','xparamRateJS','DEF','bRRHw','endAnimation','_statusEquipWindow','EnableMasking','Scene_Status_create','iRlMC','iconHeight','Symbol','child_process','addWindow','_backSprite1','paramFlat','AHbTi','HelpBgType','blendFunc','DOLLAR','SellRect','BasicParameterFormula','ARRAYSTRUCT','categoryWindowRect','Game_Interpreter_command122','VoRdm','GoldIcon','key%1','Spriteset_Base_initialize','ANpRy','return\x200','qKmBV','OutlineColor','BGZBh','statusParamsWindowRect','Game_Actor_paramBase','bSHHD','initCoreEasing','openURL','SWbZS','isMaskingEnabled','ColorMPGauge1','ENTER','setSize','ScreenShake','paramRate','pnwXW','updatePositionCoreEngineShakeHorz','OnLoadJS','QrrHj','F18','mGMIe','wwuaq','gaugeLineHeight','DocumentTitleFmt','titles1','mhp','PTWYd','ItemBackColor2','Sprite_Actor_setActorHome','_CoreEngine_Cache_textSizeEx','createCustomBackgroundImages','string','_createInternalTextures','mainAreaHeightSideButtonLayout','updateMain','clamp','optTimeProgress','Window_Base_update','PictureEasingType','ATTN','getColor','DummyBgType','mute','updateMainMultiply','_repositioned','F13','battlebacks1','getColorDataFromPluginParameters','pISrp','eRWqK','Graphics_printError','TUOPV','MAX_SAFE_INTEGER','animations','Untitled','FunctionName','TitlePicButtons','equips','paramBaseAboveLevel99','FJsRi','SUBTRACT','_stored_mpGaugeColor2','updateAnchor','status','gAaFt','OUTBOUNCE','blt','prototype','HnEzh','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','buttonAssistWindowButtonRect','RepositionActors','buttonAssistOffset4','fadeSpeed','getCoreEngineScreenShakeStyle','_opening','setupButtonImage','buttonAssistCancel','sparamPlus','JtoaX','TjuKG','HIT','Subtitle','ZYXpt','deathColor','ColorCTGauge2','mpColor','setupCoreEasing','catchException','setMoveEasingType','setup','Scene_Name_create','ENTER_SPECIAL','_data','OptionsBgType','_centerElement','JhmIW','IconParam2','MAT','CLEAR','Scene_Skill_create','ABsOd','targetX','setSideView','_closing','STRUCT','itemHitImprovedAccuracy','Gold','ALTGR','_stored_hpGaugeColor1','DigitGroupingStandardText','sparamRate','targetEvaRate','FINAL','DamageColor','Max','stop','ColorMPGauge2','Game_Picture_x','level','ALWAYS','STENCIL_TEST','RowSpacing','_playTestFastMode','cos','currentExp','isCursorMovable','gameTitle','GDdPr','drawCurrentParam','gold','initVisuMZCoreEngine','_pagedownButton','lineHeight','xScrollLinkedOffset','ParamMax','SystemSetSideView','processCursorMove','GoldBgType','stypeId','RIGHT','HIOrU','drawBackgroundRect','helpWindowRect','OUTCIRC','AntiZoomPictures','Xygbo','(\x5cd+\x5c.?\x5cd+)>','tileWidth','ATK','ejtnu','NUMPAD7','itemSuccessRate','currencyUnit','applyCoreEasing','MainMenu','itypeId','setLastPluginCommandInterpreter','AutoStretch','OyWZZ','onMouseEnter','ColorPowerDown','ColorMPCost','itemHeight','text%1','MEV','isRightInputMode','mpCostColor','KYhGr','onDatabaseLoaded','contents','buttonAssistWindowSideRect','_playtestF7Looping','eventsXyNt','sellWindowRect','_movementWholeDuration','CommandWidth','HelpRect','buttonAssistText1','contentsOpacity','setHandler','loadTitle1','isMagical','BACK_QUOTE','Window_Base_initialize','NONCONVERT','INQUINT','pmOFS','note','stretch','_pageupButton','opacity','PDR','_coreEngineShakeStyle','cmWAz','onPress','ListRect','<JS\x20%1\x20%2:[\x20](.*)>','drawActorLevel','areButtonsOutsideMainUI','vUOMr','SCALE_MODES','nYXxJ','img/%1/','guardSkillId','ItemBgType','MAXHP','mhnEc','save','wBUSp','ZERO','createChildSprite','optSideView','Window_Selectable_processCursorMove','BgType','sqrt','XParamVocab5','GRD','buyWindowRect','MCR','PA1','pagedown','playTestF7','_stored_powerUpColor','TextCodeNicknames','Scene_MenuBase_helpAreaTop','render','setActorHome','yScrollLinkedOffset','ADD','KANA','vertJS','movePageButtonSideButtonLayout','_buttonType','tLlrz','PAtLE','CommandRect','terms','DrawIcons','description','haDVc','LtGSG','cancel','command355','LevelUpFullMp','duration','NUMPAD6','ItemHeight','_spriteset','log','([\x5c+\x5c-]\x5cd+\x5c.?\x5cd+)>','F7key','focus','XParamVocab9','vpMlk','UflPw','addLoadListener','IconXParam9','_statusParamsWindow','BackOpacity','uwKbt','NUM','WIN_OEM_JUMP','_goldWindow','isSideButtonLayout','LUK','Game_Temp_initialize','background','length','Padding','call','OPEN_PAREN','process_VisuMZ_CoreEngine_RegExp','commandWindowRect','INOUTBACK','move','min','LvExpGauge','IgRuF','popScene','catchNormalError','NUMPAD5','currentClass','INOUTSINE','top','NumberBgType','INQUART','_offsetY','clearZoom','TRAIT_PARAM','IconSParam6','F15','LoadMenu','QoL','DIVIDE','ConvertNumberToString','INBACK','horizontal','OUTQUART','Game_BattlerBase_initMembers','AbOYs','CEV','_stored_expGaugeColor1','enemies','LEFT','WIN_OEM_CLEAR','shake','Scene_Map_createMenuButton','updateOpacity','buttonY','levelUp','flush','onKeyDownKeysF6F7','win32','home','_muteSound','reservePlayTestNewGameCommonEvent','_shakeDuration','raRJR','style','SParamVocab1','drawIconBySize','Scene_Equip_create','CONTEXT_MENU','numberShowButton','WIN_OEM_ENLW','TranslucentOpacity','processTimingData','KeyItemProtect','_stored_powerDownColor','itemEva','ZQVnM','PositionJS','INCIRC','tBErP','learnings','VOLUME_MUTE','buttonAssistText%1','OpenConsole','QUOTE','createJsQuickFunction','ARRAYSTR','resetTextColor','statusWindowRect','WnWrX','bqIDI','onEscapeSuccess','anrvr','ayeTm','EREOF','Conditional\x20Branch\x20Script\x20Error','<%1\x20%2:[\x20]','drawGameVersion','command232','isClosed','OUTBACK','CategoryRect','ESlEt','LoadError','removeAllFauxAnimations','NEAREST','paramValueByName','IconSParam9','LineHeight','updateOpen','Window_Base_textSizeEx','pkYFb','_helpWindow','ALT','OkText','isFauxAnimationPlaying','SParamVocab5','RYUTe','viSaC','buttonAreaHeight','Game_Interpreter_command111','slotWindowRect','seVolume','0.00','OUTEXPO','Spriteset_Base_updatePosition','ButtonHeight','CNZjH','UevRC','Plus2','levelUpRecovery','_mapNameWindow','QIIod','\x0a\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%2\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20console.log(\x27JS\x20Quick\x20Function\x20\x22%1\x22\x20Error!\x27);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20','value','parallaxes','drawIcon','battlebacks2','showDevTools','CrVJQ','drawTextEx','Game_Event_isCollidedWithEvents','drawGameTitle','Scene_Title_drawGameTitle','Wait','VDfJv','paramRate1','_defaultStretchMode','INSINE','ActorMPColor','optionsWindowRect','registerCommand','drawGameSubtitle','INOUTQUAD','oKddx','isAnimationForEach','ItemBackColor1','stringKeyMap','addChild','canUse','ButtonFadeSpeed','match','aBHKc','buttonAssistOffset3','Basic','HASH','NumberRect','mainAreaBottom','forceStencil','hANaz','usableSkills','end','MODECHANGE','drawRightArrow','xparamPlus1','isHovered','SceneManager_onKeyDown','textColor','paramPlusJS','loadSystemImages','XQrmj','Scene_Shop_create','ColorTPCost','Title','drawAllParams','refreshDimmerBitmap','_clickHandler','CANCEL','moveCancelButtonSideButtonLayout','aTbgH','wCWKT','RegExp','WIN_OEM_PA3','onKeyDown','constructor','image-rendering','fLFjv','RepositionEnemies','randomJS','kqMzD','DigitGroupingGaugeSprites','_stored_hpGaugeColor2','qvGEs','scaleSprite','YvSYw','Key%1','_stored_normalColor','isCollidedWithEvents','Script\x20Call\x20Error','ShopMenu','SParamVocab6','setBackgroundType','IupkH','_categoryWindow','bIwoN','sv_actors','Total','GroupDigits','LESS_THAN','centerSprite','loadTitle2','volume','isBottomButtonMode','hit','_stored_deathColor','XParamVocab3','GetParamIcon','MwTvN','setupNewGame','boyDF','_stored_mpGaugeColor1','QUESTION_MARK','ULDKi','titleCommandWindow','exit','hide','dimColor2','params','WIN_OEM_FJ_ROYA','button','_targetAnchor','EnableJS','fillText','getInputMultiButtonStrings','determineSideButtonLayoutValid','mirror','smoothSelect','_cache','isPhysical','toLowerCase','checkSmartEventCollision','PmMQc','LefnF','GoldOverlap','ShowDevTools','anchorCoreEasing','_pictureContainer','drawNewParam','_offsetX','repositionCancelButtonSideButtonLayout','GoldMax','bitmap','asin','_isWindow','itemBackColor1','TCR','XnJNl','isRepeated','height','isBeingTouched','pixelated','paramMax','updatePosition','SELECT','WIN_OEM_FJ_LOYA','goto','SnapshotOpacity','KCSbR','uCMtk','setMute','subject','system','MbZpX','pAdgn','KQqhr','Scene_Options_create','_actor','skillId','cursorPagedown','helpAreaBottom','parse','IconParam1','xparamFlatBonus','DELETE','COLON','XParamVocab1','_dimmerSprite','akLst','_lastPluginCommandInterpreter','Scene_MenuBase_createCancelButton','FontShadows','REPLACE','Window','ORLCZ','getBackgroundOpacity','createTextState','maxCols','ByWFw','command231','MkYCp','drawItem','Scene_MenuBase_createBackground','VfsCt','Game_Actor_changeClass','calcEasing','TextStr','ColorExpGauge2','IconParam3','drawActorExpGauge','_mp','NUMPAD4','Game_Interpreter_command232','enemy','ButtonAssist','format','sparamPlusJS','WIN_OEM_PA1','picture','DECIMAL','open','startAnimation','Game_Picture_calcEasing','createWindowLayer','exp','subjectHitRate','Window_StatusBase_drawActorLevel','MRF','ARRAYNUM','isItemStyle','cSriM','PHA','Sprite_Battler_startMove','rbJyC','_stored_tpCostColor','CONVERT','setEasingType','xLwKx','statusEquipWindowRect','BuyRect','UTLxd','DimColor1','clearStencil','ColorManager_loadWindowskin','OUTCUBIC','sbgoC','_inputWindow','buttonAssistSwitch','boxWidth','helpAreaTop','Flat','CRSEL','%1%2','NoTileShadows','createMenuButton','SceneManager_initialize','Control\x20Variables\x20Script\x20Error','Scene_Item_create','remove','wCZbY','QzHfN','skillTypeWindowRect','UXXDz','WARNING:\x20%1\x20has\x20already\x20been\x20declared\x0aand\x20cannot\x20be\x20used\x20as\x20a\x20Quick\x20JS\x20Function','(\x5cd+)>','text','xlSys','refresh','cancelShowButton','filter','reserveCommonEvent','CTRL','textWidth','_internalTextures','Game_Screen_initialize','menuShowButton','SideButtons','isWindowMaskingEnabled','titles2','paramY','updateClose','isTimeProgress','targetOpacity','JgEhP','hVrXf','isEnabled','ARRAYEVAL','_moveEasingType','xparamFlatJS','number','children','EQUALS','createEnemies','ShowButtons','EXECUTE','fbaaH','LZuyi','OS_KEY','buttonAssistKey4','RightMenus','INOUTEXPO','SCROLL_LOCK','F10','Scene_Battle_createCancelButton','expGaugeColor1','#%1','IconSParam0','encounterStepsMinimum','isOptionValid','EscapeAlways','NUMPAD1','PictureEraseRange','StatusEquipBgType','LINEAR','Spriteset_Base_update','name','%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.','buttonAssistKey%1','F24','CommandList','PAUSE','moveMenuButtonSideButtonLayout','hdMIu','stencilFunc','exec','_shakePower','xparamPlus','Scene_MenuBase_mainAreaHeight','initMembers','drawGauge','transform','jjbXo','kMDTE','ListBgType','xparamPlusJS','pow','gainGold','INOUTQUART','framebuffer','_screenY','kyISk','loadGameImagesCoreEngine','isItem','qGAsY','StatusRect','targetY','slYZP','menu','_itemWindow','makeDeepCopy','removeFauxAnimation','isBusy','(\x5cd+)([%％])>','CallHandlerJS','traitObjects','_profileWindow','xIyPj','buttonAssistOffset5','glEbY','IZNTx','_sideButtonLayout','_commandList','animationShouldMirror','IgShN','EXR','EQUAL','_dummyWindow','sSTwd','ColorCTGauge1','skipBranch','nHzkT','targetBackOpacity','_coreEasingType','Window_Selectable_drawBackgroundRect','PERCENT','_tempActor','meVolume','toUpperCase','DummyRect','processTouch','RCInV','ZjUWY','JUNJA','startMove','_windowLayer','TrzQD','buttonAssistText5','pbWby','uFtzG','_buttonAssistWindow','SAAuW','aBDDC','VOsHz','yzIsT','ActorHPColor','Bitmap_drawTextOutline','displayX','VRETG','targetContentsOpacity','COMMA','left','_context','SlotRect','BattleManager_processEscape','BoxMargin','_stored_ctGaugeColor2','makeInputButtonString','INQUAD','tilesets','ProfileRect','playEscape','Tilemap_addShadow','buttonAssistKey3','REC','targetObjects','cursorPageup','OPEN_CURLY_BRACKET','backOpacity','push','EXSEL','Scene_Menu_create','END','ZOOM','gVUOR','WindowLayer_render','udxpV','DisplayedParams','updatePositionCoreEngineShakeVert','_CoreEngineSettings','ItemMenu','MDF','Game_Interpreter_command355','IconXParam0','INOUTQUINT','makeFontSmaller','updateFauxAnimations','forceOutOfPlaytest','STENCIL_BUFFER_BIT','F19','TimeProgress','gradientFillRect','IconParam5','toLocaleString','isMapScrollLinked','WXdvU','uiAreaHeight','drawParamText','jsQuickFunc','maxLvGaugeColor2','ColorMaxLvGauge1','eva','hVavG','showFauxAnimations','SParamVocab7','Sprite_Gauge_currentValue','xparamRate1','ColorCrisis','F17','WIN_OEM_FJ_JISHO','ktqSn','helpAreaHeight','Game_Picture_initBasic','rowSpacing','initialize','bGgej','FadeSpeed','isPlaytest','_duration','wNDYP','MultiKeyFmt','SParamVocab0','_hovered','createFauxAnimationQueue','calcCoreEasing','fkXet','_stored_systemColor','SellBgType','OwLdj','ActorTPColor','TvoDm','isBottomHelpMode','RequireFocus','Window_Base_drawText','getLevel','OQzCj','SystemSetFontSize','ImprovedAccuracySystem','Window_Base_createTextState','Game_System_initialize','sin','updatePictureAntiZoom','command122','fontSize','destroy','Scene_Unlisted','Game_Map_setup','paramRateJS','resize','repositionEnemiesByResolution','qKmoI','Graphics_defaultStretchMode','MDR','_fauxAnimationQueue','_shakeSpeed','KEEP','isTriggered','sFcDY','sparam','sparamFlat2','([\x5c+\x5c-]\x5cd+)([%％])>','NUMPAD2','xparamRate2','PRINTSCREEN','Window_Selectable_cursorDown','xDUKg','setClickHandler','CodeJS','processTouchModernControls','_numberWindow','PreserveNumbers','tvpfo','ACCEPT','Location','_isButtonHidden','InputBgType','Sprite_Button_updateOpacity','keyCode','RevertPreserveNumbers','updatePadding','Bitmap_drawText','INOUTELASTIC','cursorRight','Spriteset_Base_destroy','initCoreEngineScreenShake','FuzQo','KeyUnlisted','catchLoadError','normal','smjhT','isSideView','BACKSPACE','yyGhZ','buttonAssistKey2','NUM_LOCK','title','DimColor2','GNTyj','iconWidth','fXEAq','pnlLf','_digitGroupingEx','SkillMenu','isActor','uwaKb','currentLevelExp','_sellWindow','createCancelButton','_optionsWindow','setAnchor','horzJS','SHIFT','xpcUS','Eviph','Speed','down','updatePlayTestF7','pageup','loadBitmap','helpAreaTopSideButtonLayout','StatusBgType','eRNOO','animationNextDelay','random','IconSParam3','IconSParam4','isDying','gYXul','SParamVocab8','NUMPAD0','itemPadding','openingSpeed','process_VisuMZ_CoreEngine_Enemy_Notetags','dimColor1','GoldFontSize','wAREC','wait','process_VisuMZ_CoreEngine_Settings','jmFlf','drawActorClass','FDR','process_VisuMZ_CoreEngine_jsQuickFunctions','makeCoreEngineCommandList','terminate','paramFlatBonus','getInputButtonString','rNhQE','pictures','makeTargetSprites','mInkn','originalJS','WIN_OEM_CUSEL','ASTERISK','CQIDx','ConvertParams','setSideButtonLayout','ColorHPGauge2','ShowJS','WVBIW','hideButtonFromView','_hideButtons','DrawItemBackgroundJS','setGuard','HELP','GREATER_THAN','createFauxAnimation','sparamFlatJS','BuyBgType','escape','buttonAssistOffset1','SLASH','isPressed','windowPadding','_stored_maxLvGaugeColor2','mainCommandWidth','initButtonHidden','_cancelButton','aTmGQ','IQEES','lhVLQ','ColorHPGauge1','updateCoreEasing','changeClass','SkillTypeRect','WIN_OEM_ATTN','translucentOpacity','_screenX','editWindowRect','PictureFilename','stencilOp','onButtonImageLoad','version','META','updateKeyText','batch','DataManager_setupNewGame','ONE_MINUS_SRC_ALPHA','drawGoldItemStyle','subtitle','gplor','animationBaseDelay','zeBEO','index','actor','_stored_ctGaugeColor1','animationId','ApplyEasing','_slotWindow','scaleMode','UEStG','stxTe','EPsKr','fkkiQ','SideView','loadSystem','PictureEraseAll','loadWindowskin','Enemy','NewGameBoot','process_VisuMZ_CoreEngine_Functions','lcdlD','createPageButtons','SIjzs','OptionsMenu','_editWindow','%2%1%3','WIN_OEM_FJ_TOUROKU','onMouseExit','mainFontSize','Actor','VQVRU','sparamFlat1','keyMapper','GIJzs','ColorExpGauge1','MenuBg','_colorCache','jSlSO','smallParamFontSize','useDigitGrouping','nextLevelExp','Game_Party_consumeItem','pictureButtons','TextJS','FVwlv','MAXMP','isFullDocumentTitle','MRG','sparamRateJS','Version','_blank','IIVwT','PGDN','IconSet','paramchangeTextColor','StatusParamsRect','process_VisuMZ_CoreEngine_Class_Notetags','MULTIPLY','_coreEasing','_pressed','_fauxAnimationSprites','Plus','ONE','FontSmoothing','setActorHomeRepositioned','TGR','fRuel','CAPSLOCK','targetScaleX','easingType','GoldChange','inbounce','randomInt','displayY','isKeyItem','type','paramPlus','paramX','zWWfF','update','isNwjs','eSelg','URL','skillTypes','dxxhf','Rate1','create','tpCostColor','Game_Interpreter_PluginCommand','INOUTCUBIC','faces','AGI','OpenURL','_stored_expGaugeColor2','Rate','Game_Action_itemEva','width','CiERC','reduce','Kmtfs','GameEnd','bind','EXCLAMATION','bitmapHeight','XParameterFormula','WIN_ICO_00','Param','cjBIE','ctGaugeColor1','Scene_MenuBase_mainAreaTop','systemColor','WdUPH','blockWidth','option','_addShadow','createButtonAssistWindow','process_VisuMZ_CoreEngine_Actor_Notetags','itemWindowRect','createCommandWindow','playCursorSound','replace','_movementDuration','OptionsRect','setSkill','CRI','_centerElementCoreEngine','isNormalPriority','inputWindowRect','drawText','ctGaugeColor2','zzUtA','NewGameCommonEvent','JwSxx','Renderer','enableDigitGrouping','F16','IconXParam2','catchUnknownError','ColorNormal','JnOmJ','maxGold','visible','F21','processSoundTimings','_targetOffsetX','Rate2','isInputting','Game_Character_processMoveCommand','isAlive','get','playTestF6','IconParam4','OJnUo','createTitleButtons','trim','fillRect','ShowItemBackground','Sprite_Button_initialize','F23','UXcuO','ItemPadding','Scene_MenuBase_createPageButtons','CategoryBgType','eAFab','TRG','scale','_hideTileShadows','Scene_Boot_startNormalGame','Color','lPrKc','Sprite_AnimationMV_processTimingData','useDigitGroupingEx','TZKyE','sv_enemies','BgFilename1','F22','ParamChange','IconXParam6','EquipMenu','Scene_Map_updateMainMultiply','drawSegment','ColorTPGauge1','osepF','XParamVocab8','Window_Selectable_processTouch','XParamVocab0','EncounterRateMinimum','nickname','Scene_Boot_onDatabaseLoaded','setupValueFont','itemBackColor2','context','expGaugeColor2','VOLUME_UP','setAttack','boxHeight','isEnemy','WIN_OEM_AUTO','updatePositionCoreEngine','paramBase','MenuLayout','PERIOD','pop','sparamRate1','openness','tpGaugeColor2','disable','TextManager_param','LIwdN','cursorDown','xparamFlat2','_targetOffsetY','setWindowPadding','setFrame','CLOSE_BRACKET','paramFlatJS','FUNC','checkCacheKey','OPEN_BRACKET','maxLevel','_skillTypeWindow','isNextScene','SEPARATOR','HomZd','command357','_menuButton','colSpacing','encounterStep','ColorSystem','NUMPAD3','currentValue','_buyWindow','drawValue','parameters','setTimeProgress','VSgIp','isReleased','areButtonsHidden','startAutoNewGame','expRate','innerWidth','processCursorHomeEndTrigger','setCoreEngineScreenShakeStyle','updatePositionCoreEngineShakeRand','DigitGroupingExText','renderNoMask','StartID','tpGaugeColor1','initBasic','Game_Action_itemHit','updateOrigin','jOzQx','sbCmV','isSmartEventCollisionOn','PRINT','none','item','HANJA','NUMPAD9','updateDocumentTitle','mainAreaTopSideButtonLayout','skills','original','startNormalGame','setCoreEngineUpdateWindowBg','itemHit','_digitGrouping','dyjTv','HOME','ActorRect','printError','setupCoreEngine','paramRate2','FbIpp','PixelateImageRendering','WIN_OEM_FJ_MASSHOU','IconSParam7','gaugeBackColor','processEscape','CIRCUMFLEX','requestFauxAnimation','up2'];(function(_0x32eaee,_0x28a294){const _0x2f1873=function(_0x1f2f78){while(--_0x1f2f78){_0x32eaee['push'](_0x32eaee['shift']());}};_0x2f1873(++_0x28a294);}(_0x28a2,0x13a));const _0x2f18=function(_0x32eaee,_0x28a294){_0x32eaee=_0x32eaee-0x0;let _0x2f1873=_0x28a2[_0x32eaee];return _0x2f1873;};var label='CoreEngine',tier=tier||0x0,dependencies=[],pluginData=$plugins[_0x2f18('0x234')](function(_0x5043d6){return _0x5043d6[_0x2f18('0x5fe')]&&_0x5043d6[_0x2f18('0xaa')][_0x2f18('0x547')]('['+label+']');})[0x0];VisuMZ[label][_0x2f18('0x4d9')]=VisuMZ[label][_0x2f18('0x4d9')]||{},VisuMZ[_0x2f18('0x382')]=function(_0x196d1f,_0xa530e){for(const _0x43127f in _0xa530e){if(_0x43127f['match'](/(.*):(.*)/i)){const _0x3a7f2f=String(RegExp['$1']),_0x30178d=String(RegExp['$2'])[_0x2f18('0x2a0')]()[_0x2f18('0x44a')]();let _0xa1c091,_0x3568d4,_0x2e2033;switch(_0x30178d){case _0x2f18('0xc0'):_0xa1c091=_0xa530e[_0x43127f]!==''?Number(_0xa530e[_0x43127f]):0x0;break;case _0x2f18('0x20b'):_0x3568d4=_0xa530e[_0x43127f]!==''?JSON[_0x2f18('0x1dc')](_0xa530e[_0x43127f]):[],_0xa1c091=_0x3568d4[_0x2f18('0x509')](_0x15f325=>Number(_0x15f325));break;case'EVAL':_0xa1c091=_0xa530e[_0x43127f]!==''?eval(_0xa530e[_0x43127f]):null;break;case _0x2f18('0x245'):_0x3568d4=_0xa530e[_0x43127f]!==''?JSON[_0x2f18('0x1dc')](_0xa530e[_0x43127f]):[],_0xa1c091=_0x3568d4['map'](_0x1d68ef=>eval(_0x1d68ef));break;case'JSON':_0xa1c091=_0xa530e[_0x43127f]!==''?JSON[_0x2f18('0x1dc')](_0xa530e[_0x43127f]):'';break;case'ARRAYJSON':_0x3568d4=_0xa530e[_0x43127f]!==''?JSON[_0x2f18('0x1dc')](_0xa530e[_0x43127f]):[],_0xa1c091=_0x3568d4[_0x2f18('0x509')](_0x3fee05=>JSON['parse'](_0x3fee05));break;case _0x2f18('0x488'):_0xa1c091=_0xa530e[_0x43127f]!==''?new Function(JSON[_0x2f18('0x1dc')](_0xa530e[_0x43127f])):new Function(_0x2f18('0x5be'));break;case'ARRAYFUNC':_0x3568d4=_0xa530e[_0x43127f]!==''?JSON[_0x2f18('0x1dc')](_0xa530e[_0x43127f]):[],_0xa1c091=_0x3568d4['map'](_0xfc1f58=>new Function(JSON[_0x2f18('0x1dc')](_0xfc1f58)));break;case _0x2f18('0x553'):_0xa1c091=_0xa530e[_0x43127f]!==''?String(_0xa530e[_0x43127f]):'';break;case _0x2f18('0x110'):_0x3568d4=_0xa530e[_0x43127f]!==''?JSON['parse'](_0xa530e[_0x43127f]):[],_0xa1c091=_0x3568d4[_0x2f18('0x509')](_0x5a7b25=>String(_0x5a7b25));break;case _0x2f18('0x24'):_0x2e2033=_0xa530e[_0x43127f]!==''?JSON[_0x2f18('0x1dc')](_0xa530e[_0x43127f]):{},_0x196d1f[_0x3a7f2f]={},VisuMZ['ConvertParams'](_0x196d1f[_0x3a7f2f],_0x2e2033);continue;case _0x2f18('0x5b6'):_0x3568d4=_0xa530e[_0x43127f]!==''?JSON[_0x2f18('0x1dc')](_0xa530e[_0x43127f]):[],_0xa1c091=_0x3568d4[_0x2f18('0x509')](_0x29be1c=>VisuMZ['ConvertParams']({},JSON[_0x2f18('0x1dc')](_0x29be1c)));break;default:continue;}_0x196d1f[_0x3a7f2f]=_0xa1c091;}}return _0x196d1f;},(_0x268eb1=>{const _0xecc153=_0x268eb1[_0x2f18('0x262')];for(const _0x32a701 of dependencies){if(!Imported[_0x32a701]){if('vXqDl'==='hewZH'){function _0x2e70e9(){this[_0x2f18('0x12a')]['setBackgroundType'](_0x43c7dd[_0x2f18('0x526')][_0x2f18('0x5b1')]);}}else{alert(_0x2f18('0x56a')[_0x2f18('0x1fe')](_0xecc153,_0x32a701)),SceneManager[_0x2f18('0x1a4')]();break;}}}const _0x210046=_0x268eb1[_0x2f18('0xaa')];if(_0x210046[_0x2f18('0x15b')](/\[Version[ ](.*?)\]/i)){const _0x75c056=Number(RegExp['$1']);if(_0x75c056!==VisuMZ[label][_0x2f18('0x3a7')]){if(_0x2f18('0x466')===_0x2f18('0x344')){function _0x49a7e3(){_0x137a40['CoreEngine'][_0x2f18('0x2cb')][_0x2f18('0xc9')](this),this[_0x2f18('0x4b8')]();}}else alert(_0x2f18('0x0')[_0x2f18('0x1fe')](_0xecc153,_0x75c056)),SceneManager[_0x2f18('0x1a4')]();}}if(_0x210046[_0x2f18('0x15b')](/\[Tier[ ](\d+)\]/i)){const _0xdd1833=Number(RegExp['$1']);if(_0xdd1833<tier){if(_0x2f18('0xe')!==_0x2f18('0xe')){function _0x48a957(){_0x549357[_0x2f18('0x56f')][_0x2f18('0x4d9')]['QoL'][_0x2f18('0x3ef')]&&(_0x19ed08['style'][_0x2f18('0x4f4')]='none'),_0x2b1f72[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0xe0')][_0x2f18('0x4c2')]&&(_0x21e2eb[_0x2f18('0xfa')]['image-rendering']=_0x2f18('0x1c8'));}}else alert(_0x2f18('0x263')[_0x2f18('0x1fe')](_0xecc153,_0xdd1833,tier)),SceneManager[_0x2f18('0x1a4')]();}else{if(_0x2f18('0x27b')===_0x2f18('0x27b'))tier=Math[_0x2f18('0x586')](_0xdd1833,tier);else{function _0x172f94(){this[_0x2f18('0x4a5')](_0x255dfe);}}}}VisuMZ['ConvertParams'](VisuMZ[label][_0x2f18('0x4d9')],_0x268eb1[_0x2f18('0x499')]);})(pluginData),PluginManager['registerCommand'](pluginData[_0x2f18('0x262')],_0x2f18('0x40c'),_0x3ddd11=>{VisuMZ[_0x2f18('0x382')](_0x3ddd11,_0x3ddd11);const _0xd9dee=_0x3ddd11[_0x2f18('0x402')];VisuMZ[_0x2f18('0x5c6')](_0xd9dee);}),PluginManager[_0x2f18('0x151')](pluginData[_0x2f18('0x262')],_0x2f18('0x3f6'),_0x44203b=>{VisuMZ['ConvertParams'](_0x44203b,_0x44203b);const _0x2a8418=_0x44203b[_0x2f18('0x140')]||0x0;$gameParty[_0x2f18('0x277')](_0x2a8418);}),PluginManager[_0x2f18('0x151')](pluginData[_0x2f18('0x262')],_0x2f18('0x5e5'),_0x31f0dd=>{VisuMZ['ConvertParams'](_0x31f0dd,_0x31f0dd);const _0x21b2a3=_0x31f0dd['pictureId']||0x1,_0x20f777=_0x31f0dd[_0x2f18('0x3f5')]||_0x2f18('0x4ea'),_0x336dcf=$gameScreen[_0x2f18('0x201')](_0x21b2a3);_0x336dcf&&_0x336dcf[_0x2f18('0x213')](_0x20f777);}),PluginManager[_0x2f18('0x151')](pluginData[_0x2f18('0x262')],_0x2f18('0x3bf'),_0x2e2744=>{for(let _0x517f17=0x1;_0x517f17<=0x64;_0x517f17++){if(_0x2f18('0x31a')==='EHRtN'){function _0x1d5bd7(){this[_0x2f18('0x515')]['x']=_0x1c65d9['anchor']()['x'],this[_0x2f18('0x515')]['y']=_0x3ff04d[_0x2f18('0x515')]()['y'];}}else $gameScreen['erasePicture'](_0x517f17);}}),PluginManager[_0x2f18('0x151')](pluginData[_0x2f18('0x262')],_0x2f18('0x25e'),_0x1cf180=>{VisuMZ[_0x2f18('0x382')](_0x1cf180,_0x1cf180);const _0x17a909=Math['min'](_0x1cf180[_0x2f18('0x4a6')],_0x1cf180[_0x2f18('0x542')]),_0x325e33=Math[_0x2f18('0x586')](_0x1cf180['StartID'],_0x1cf180['EndingID']);for(let _0x3270ae=_0x17a909;_0x3270ae<=_0x325e33;_0x3270ae++){$gameScreen[_0x2f18('0x5a0')](_0x3270ae);}}),PluginManager[_0x2f18('0x151')](pluginData[_0x2f18('0x262')],_0x2f18('0x5cc'),_0x14662b=>{VisuMZ[_0x2f18('0x382')](_0x14662b,_0x14662b);const _0x2002a3=_0x14662b['Type']||_0x2f18('0x363'),_0xc630d0=_0x14662b['Power'][_0x2f18('0x5e2')](0x1,0x9),_0xbe112b=_0x14662b[_0x2f18('0x35a')]['clamp'](0x1,0x9),_0x120516=_0x14662b['Duration']||0x1,_0x396f69=_0x14662b[_0x2f18('0x14a')];$gameScreen[_0x2f18('0x4a2')](_0x2002a3),$gameScreen['startShake'](_0xc630d0,_0xbe112b,_0x120516);if(_0x396f69){const _0x415fef=$gameTemp[_0x2f18('0x51b')]();if(_0x415fef)_0x415fef[_0x2f18('0x370')](_0x120516);}}),PluginManager[_0x2f18('0x151')](pluginData[_0x2f18('0x262')],_0x2f18('0x30c'),_0x2372d1=>{VisuMZ[_0x2f18('0x382')](_0x2372d1,_0x2372d1);const _0x10fc94=_0x2372d1[_0x2f18('0x421')]||0x1;$gameSystem['setMainFontSize'](_0x10fc94);}),PluginManager[_0x2f18('0x151')](pluginData[_0x2f18('0x262')],_0x2f18('0x43'),_0x3b0fe7=>{if($gameParty['inBattle']())return;VisuMZ[_0x2f18('0x382')](_0x3b0fe7,_0x3b0fe7);const _0x6aa780=_0x3b0fe7['option'];if(_0x6aa780[_0x2f18('0x15b')](/Front/i))$gameSystem[_0x2f18('0x22')](![]);else _0x6aa780[_0x2f18('0x15b')](/Side/i)?$gameSystem[_0x2f18('0x22')](!![]):$gameSystem[_0x2f18('0x22')](!$gameSystem[_0x2f18('0x342')]());}),PluginManager[_0x2f18('0x151')](pluginData[_0x2f18('0x262')],_0x2f18('0x53f'),_0x38202c=>{if($gameParty[_0x2f18('0x51d')]())return;VisuMZ[_0x2f18('0x382')](_0x38202c,_0x38202c);const _0x4ddb7e=_0x38202c[_0x2f18('0x421')];if(_0x4ddb7e['match'](/Default/i))$gameSystem[_0x2f18('0x49a')](![]);else{if(_0x4ddb7e[_0x2f18('0x15b')](/Time/i)){if('KYhGr'===_0x2f18('0x63'))$gameSystem[_0x2f18('0x49a')](!![]);else{function _0x4cdb42(){for(const _0x13d624 of this[_0x2f18('0x3ec')]){!_0x13d624['isPlaying']()&&this[_0x2f18('0x285')](_0x13d624);}this[_0x2f18('0x51f')]();}}}else{if(_0x2f18('0x566')===_0x2f18('0x8a')){function _0x48ceb9(){const _0x377755=new _0x1cfc46[(_0x2f18('0x556'))]();_0x377755[_0x2f18('0x5cb')](0x800,0x800),_0x34ca85[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0xe0')][_0x2f18('0x4c2')]&&(_0x377755['scaleMode']=_0x3470b8[_0x2f18('0x84')][_0x2f18('0x123')]),this['_internalTextures'][_0x2f18('0x2c9')](_0x377755);}}else $gameSystem['setTimeProgress'](!$gameSystem[_0x2f18('0x240')]());}}}),PluginManager[_0x2f18('0x151')](pluginData['name'],_0x2f18('0x503'),_0x42d8b8=>{VisuMZ[_0x2f18('0x382')](_0x42d8b8,_0x42d8b8);const _0x41fb3f=_0x42d8b8[_0x2f18('0x421')]||0x1;$gameSystem[_0x2f18('0x484')](_0x41fb3f);}),VisuMZ[_0x2f18('0x56f')][_0x2f18('0x46c')]=Scene_Boot[_0x2f18('0x602')][_0x2f18('0x64')],Scene_Boot[_0x2f18('0x602')][_0x2f18('0x64')]=function(){VisuMZ['CoreEngine'][_0x2f18('0x46c')][_0x2f18('0xc9')](this),this[_0x2f18('0xcb')](),this[_0x2f18('0x4f8')](),this[_0x2f18('0x371')](),this['process_VisuMZ_CoreEngine_Functions']();},VisuMZ['CoreEngine'][_0x2f18('0x179')]={},Scene_Boot[_0x2f18('0x602')][_0x2f18('0xcb')]=function(){const _0x5bf52f=[_0x2f18('0x89'),'MAXMP',_0x2f18('0x50'),'DEF',_0x2f18('0x1d'),_0x2f18('0x2d5'),_0x2f18('0x40b'),_0x2f18('0xc4')],_0x33bfdc=[_0x2f18('0xc'),_0x2f18('0x590'),_0x2f18('0x42c'),_0x2f18('0xe8'),_0x2f18('0x60'),_0x2f18('0x20a'),_0x2f18('0x56b'),'HRG',_0x2f18('0x3df'),_0x2f18('0x454')],_0x14707f=[_0x2f18('0x3f1'),'GRD',_0x2f18('0x2c4'),_0x2f18('0x20e'),_0x2f18('0x96'),'TCR',_0x2f18('0x7b'),_0x2f18('0x31c'),_0x2f18('0x374'),_0x2f18('0x293')],_0x37f5e3=[_0x5bf52f,_0x33bfdc,_0x14707f],_0x52395c=[_0x2f18('0x3ed'),_0x2f18('0x58f'),_0x2f18('0x13b'),'Max',_0x2f18('0x40e'),_0x2f18('0x405'),_0x2f18('0x441'),_0x2f18('0x221'),_0x2f18('0x545'),_0x2f18('0x508')];for(const _0x17c211 of _0x37f5e3){if(_0x2f18('0x184')===_0x2f18('0x5d3')){function _0x3b6cca(){if(_0x37f7dd[_0x2f18('0x385')]['call'](this)){const _0x2cc4ae=_0x33ad41[_0x2f18('0x5ab')];let _0x15314c=_0x30c734[_0x2f18('0x1f5')];if(['',_0x2f18('0x5f5')][_0x2f18('0x547')](_0x15314c))_0x15314c=_0x4c9aeb[_0x2f18('0x3db')][_0x2f18('0xc9')](this);const _0x18391a=_0x21b481['EnableJS'][_0x2f18('0xc9')](this),_0x5d7caa=_0x44cbef[_0x2f18('0x4df')][_0x2f18('0xc9')](this);this['addCommand'](_0x15314c,_0x2cc4ae,_0x18391a,_0x5d7caa),this[_0x2f18('0x6f')](_0x2cc4ae,_0x113dea[_0x2f18('0x288')]['bind'](this,_0x5d7caa));}}}else{let _0x5a7643='';if(_0x17c211===_0x5bf52f)_0x5a7643=_0x2f18('0x55b');if(_0x17c211===_0x33bfdc)_0x5a7643=_0x2f18('0x4ec');if(_0x17c211===_0x14707f)_0x5a7643=_0x2f18('0x322');for(type of _0x52395c){let _0x182eed=_0x2f18('0x223')[_0x2f18('0x1fe')](_0x5a7643,type);VisuMZ[_0x2f18('0x56f')][_0x2f18('0x179')][_0x182eed]=[],VisuMZ['CoreEngine'][_0x2f18('0x179')][_0x182eed+'JS']=[];let _0x171516=_0x2f18('0x11a');if([_0x2f18('0x3ed'),'Flat'][_0x2f18('0x547')](type)){if('yVEwt'===_0x2f18('0x514')){function _0x3ed7c1(){_0x30c36a[_0x2f18('0x602')][_0x2f18('0x406')][_0x2f18('0xc9')](this),this[_0x2f18('0x4b8')]();}}else _0x171516+='([\x5c+\x5c-]\x5cd+)>';}else{if([_0x2f18('0x58f'),_0x2f18('0x545')][_0x2f18('0x547')](type))_0x171516+=_0x2f18('0x324');else{if([_0x2f18('0x13b'),_0x2f18('0x508')][_0x2f18('0x547')](type))_0x171516+=_0x2f18('0xb5');else{if(type===_0x2f18('0x2e'))_0x171516+=_0x2f18('0x22f');else{if(type===_0x2f18('0x405'))_0x171516+=_0x2f18('0x287');else type===_0x2f18('0x441')&&(_0x171516+='(\x5cd+\x5c.?\x5cd+)>');}}}}for(const _0x5e547d of _0x17c211){if(_0x2f18('0x2af')!==_0x2f18('0x2af')){function _0x32e496(){const _0x102a7f=_0x2656f9[_0x2f18('0x19c')](_0x48455e);_0x44f53e?(this['drawIconBySize'](_0x102a7f,_0x3bda11,_0x271b28,this[_0x2f18('0x5d5')]()),_0x3111a6-=this[_0x2f18('0x5d5')]()+0x2,_0x54bd4e+=this[_0x2f18('0x5d5')]()+0x2):(this[_0x2f18('0x142')](_0x102a7f,_0x43477a+0x2,_0x5105bd+0x2),_0x2aa0e0-=_0x5a6fda['iconWidth']+0x4,_0x4196e7+=_0x123f65[_0x2f18('0x34a')]+0x4);}}else{let _0x469f0a=type['replace'](/[\d+]/g,'')[_0x2f18('0x2a0')]();const _0x14a28b=_0x171516[_0x2f18('0x1fe')](_0x5e547d,_0x469f0a);VisuMZ[_0x2f18('0x56f')][_0x2f18('0x179')][_0x182eed]['push'](new RegExp(_0x14a28b,'i'));const _0xeb45ad=_0x2f18('0x80')[_0x2f18('0x1fe')](_0x5e547d,_0x469f0a);VisuMZ['CoreEngine']['RegExp'][_0x182eed+'JS']['push'](new RegExp(_0xeb45ad,'i'));}}}}}},Scene_Boot[_0x2f18('0x602')][_0x2f18('0x4f8')]=function(){this[_0x2f18('0x424')](),this[_0x2f18('0x3e8')](),this[_0x2f18('0x36c')]();},Scene_Boot[_0x2f18('0x602')][_0x2f18('0x424')]=function(){for(const _0x2674cb of $dataActors){if('iNmNW'!=='wzTYz'){if(!_0x2674cb)continue;const _0x458cbe=_0x2674cb[_0x2f18('0x77')];if(_0x458cbe[_0x2f18('0x15b')](/<MAX LEVEL:[ ](\d+)>/i)){if(_0x2f18('0x3d5')!==_0x2f18('0x16e')){_0x2674cb[_0x2f18('0x48b')]=Number(RegExp['$1']);if(_0x2674cb[_0x2f18('0x48b')]===0x0)_0x2674cb[_0x2f18('0x48b')]=Number[_0x2f18('0x5f3')];}else{function _0x2bc266(){const _0x4b774d=_0x4febc9[_0x2f18('0x2b3')]()*_0x139455[_0x2f18('0x4f')]();return this['_x']-_0x4b774d;}}}_0x458cbe['match'](/<INITIAL LEVEL:[ ](\d+)>/i)&&(_0x2674cb['initialLevel']=Math['min'](Number(RegExp['$1']),_0x2674cb[_0x2f18('0x48b')]));}else{function _0x2f89b8(){_0x42b552+=_0x2f18('0x4e');}}}},Scene_Boot['prototype'][_0x2f18('0x3e8')]=function(){for(const _0x42990f of $dataActors){if(!_0x42990f)continue;const _0x3070e1=_0x42990f[_0x2f18('0x77')];if(_0x42990f[_0x2f18('0x10a')]){if(_0x2f18('0x603')==='HnEzh')for(const _0x1287cc of _0x42990f[_0x2f18('0x10a')]){if(_0x1287cc[_0x2f18('0x77')][_0x2f18('0x15b')](/<LEARN AT LEVEL:[ ](\d+)>/i)){if(_0x2f18('0x21c')===_0x2f18('0x21c'))_0x1287cc[_0x2f18('0x32')]=Math[_0x2f18('0x586')](Number(RegExp['$1']),0x1);else{function _0x1aac03(){this[_0x2f18('0x3a2')]-=_0x2dd83d[_0x2f18('0x598')]((_0x2e823d[_0x2f18('0x410')]-_0x5ed22c[_0x2f18('0x21f')])/0x2);}}}}else{function _0x1dc902(){const _0x5a4dfa=_0x2f18('0x58d');this[_0x2f18('0x3d4')]=this[_0x2f18('0x3d4')]||{};if(this[_0x2f18('0x3d4')][_0x5a4dfa])return this[_0x2f18('0x3d4')][_0x5a4dfa];const _0x4b72e6=_0x361583[_0x2f18('0x56f')]['Settings']['Color'][_0x2f18('0x5d')];return this['getColorDataFromPluginParameters'](_0x5a4dfa,_0x4b72e6);}}}}},Scene_Boot[_0x2f18('0x602')]['process_VisuMZ_CoreEngine_Enemy_Notetags']=function(){for(const _0x2d9be0 of $dataActors){if(!_0x2d9be0)continue;_0x2d9be0[_0x2f18('0x32')]=0x1;const _0x19745f=_0x2d9be0[_0x2f18('0x77')];if(_0x19745f[_0x2f18('0x15b')](/<LEVEL:[ ](\d+)>/i))_0x2d9be0[_0x2f18('0x32')]=Number(RegExp['$1']);if(_0x19745f['match'](/<MAXHP:[ ](\d+)>/i))_0x2d9be0[_0x2f18('0x1a7')][0x0]=Number(RegExp['$1']);if(_0x19745f[_0x2f18('0x15b')](/<MAXMP:[ ](\d+)>/i))_0x2d9be0[_0x2f18('0x1a7')][0x1]=Number(RegExp['$1']);if(_0x19745f[_0x2f18('0x15b')](/<ATK:[ ](\d+)>/i))_0x2d9be0[_0x2f18('0x1a7')][0x2]=Number(RegExp['$1']);if(_0x19745f[_0x2f18('0x15b')](/<DEF:[ ](\d+)>/i))_0x2d9be0[_0x2f18('0x1a7')][0x3]=Number(RegExp['$1']);if(_0x19745f[_0x2f18('0x15b')](/<MAT:[ ](\d+)>/i))_0x2d9be0[_0x2f18('0x1a7')][0x4]=Number(RegExp['$1']);if(_0x19745f[_0x2f18('0x15b')](/<MDF:[ ](\d+)>/i))_0x2d9be0[_0x2f18('0x1a7')][0x5]=Number(RegExp['$1']);if(_0x19745f['match'](/<AGI:[ ](\d+)>/i))_0x2d9be0['params'][0x6]=Number(RegExp['$1']);if(_0x19745f[_0x2f18('0x15b')](/<LUK:[ ](\d+)>/i))_0x2d9be0['params'][0x7]=Number(RegExp['$1']);if(_0x19745f[_0x2f18('0x15b')](/<EXP:[ ](\d+)>/i))_0x2d9be0[_0x2f18('0x207')]=Number(RegExp['$1']);if(_0x19745f[_0x2f18('0x15b')](/<GOLD:[ ](\d+)>/i))_0x2d9be0[_0x2f18('0x3d')]=Number(RegExp['$1']);}},Scene_Boot['prototype'][_0x2f18('0x371')]=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0xe0')][_0x2f18('0x10d')]&&VisuMZ[_0x2f18('0x1b8')](!![]);if(VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0xe0')]['ModernControls']){if(_0x2f18('0x1e9')!==_0x2f18('0x45c'))Input[_0x2f18('0x3d0')][0x23]=_0x2f18('0x165'),Input['keyMapper'][0x24]=_0x2f18('0xf5');else{function _0x16319e(){return _0x118952[_0x2f18('0x1ce')];}}}},Scene_Boot[_0x2f18('0x602')][_0x2f18('0x3c3')]=function(){this[_0x2f18('0x375')]();},Scene_Boot[_0x2f18('0x602')]['process_VisuMZ_CoreEngine_jsQuickFunctions']=function(){const _0x37be71=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['jsQuickFunc'];for(const _0x242814 of _0x37be71){const _0x259ba2=_0x242814[_0x2f18('0x5f6')][_0x2f18('0x428')](/[ ]/g,''),_0x57c710=_0x242814[_0x2f18('0x32b')];VisuMZ['CoreEngine'][_0x2f18('0x10f')](_0x259ba2,_0x57c710);}},VisuMZ[_0x2f18('0x56f')]['createJsQuickFunction']=function(_0x26a645,_0x2eaf66){if(!!window[_0x26a645]){if(_0x2f18('0x18e')!==_0x2f18('0x18e')){function _0x4d8d89(){let _0x4e2b1f=_0x293892;if(_0x4e2b1f[0x0]==='0')return _0x4e2b1f;if(_0x4e2b1f[_0x4e2b1f[_0x2f18('0xc7')]-0x1]==='.')return _0x459659(_0x4e2b1f)[_0x2f18('0x2e1')](_0x224ded,_0x2535fd)+'.';else return _0x4e2b1f[_0x4e2b1f[_0x2f18('0xc7')]-0x1]===','?_0x256e6c(_0x4e2b1f)['toLocaleString'](_0x2de6fb,_0x26759a)+',':_0x2e0f6c(_0x4e2b1f)[_0x2f18('0x2e1')](_0x3a3a23,_0x2143a6);}}else{if($gameTemp[_0x2f18('0x2f9')]())console['log'](_0x2f18('0x22e')[_0x2f18('0x1fe')](_0x26a645));}}const _0x2c8927=_0x2f18('0x13f')[_0x2f18('0x1fe')](_0x26a645,_0x2eaf66);window[_0x26a645]=new Function(_0x2c8927);},VisuMZ[_0x2f18('0x56f')]['Graphics_defaultStretchMode']=Graphics[_0x2f18('0x14d')],Graphics[_0x2f18('0x14d')]=function(){switch(VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0xe0')][_0x2f18('0x59')]){case _0x2f18('0x78'):return!![];case _0x2f18('0x340'):return![];default:return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x31b')][_0x2f18('0xc9')](this);}},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x5f1')]=Graphics['printError'],Graphics[_0x2f18('0x4be')]=function(_0x1cf7b2,_0x210f03,_0x790f21=null){VisuMZ[_0x2f18('0x56f')]['Graphics_printError']['call'](this,_0x1cf7b2,_0x210f03,_0x790f21),VisuMZ[_0x2f18('0x1b8')](![]);},VisuMZ['CoreEngine'][_0x2f18('0x555')]=Graphics['_centerElement'],Graphics[_0x2f18('0x1a')]=function(_0x26e8ee){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x555')][_0x2f18('0xc9')](this,_0x26e8ee),this['_centerElementCoreEngine'](_0x26e8ee);},Graphics[_0x2f18('0x42d')]=function(_0x490e78){if(VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0xe0')][_0x2f18('0x3ef')]){if(_0x2f18('0x568')!==_0x2f18('0x1d6'))_0x490e78[_0x2f18('0xfa')][_0x2f18('0x4f4')]=_0x2f18('0x4af');else{function _0x5038a0(){this[_0x2f18('0x3eb')]?this[_0x2f18('0x7a')]=0xff:(this[_0x2f18('0x7a')]+=this[_0x2f18('0x43d')]?this[_0x2f18('0x4')]():-0x1*this['fadeSpeed'](),this[_0x2f18('0x7a')]=_0x58ebc8[_0x2f18('0xcf')](0xc0,this[_0x2f18('0x7a')]));}}}if(VisuMZ['CoreEngine'][_0x2f18('0x4d9')][_0x2f18('0xe0')]['PixelateImageRendering']){if('FqSxm'===_0x2f18('0x43b')){function _0x2aa0e8(){this[_0x2f18('0x38a')]();}}else _0x490e78[_0x2f18('0xfa')][_0x2f18('0x17d')]=_0x2f18('0x1c8');}},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x338')]=Bitmap[_0x2f18('0x602')][_0x2f18('0x430')],Bitmap['prototype'][_0x2f18('0x430')]=function(_0x12a0a6,_0x5aa45b,_0x53b4c5,_0x17ebb4,_0x57c798,_0x464c8c){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x338')][_0x2f18('0xc9')](this,_0x12a0a6,_0x5aa45b,_0x53b4c5,_0x17ebb4,_0x57c798,_0x464c8c);},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x2b2')]=Bitmap[_0x2f18('0x602')]['_drawTextOutline'],Bitmap[_0x2f18('0x602')]['_drawTextOutline']=function(_0x3deb03,_0x3836c4,_0x577655,_0x45ab39){VisuMZ[_0x2f18('0x56f')]['Settings'][_0x2f18('0xe0')][_0x2f18('0x1e6')]?this[_0x2f18('0x55e')](_0x3deb03,_0x3836c4,_0x577655,_0x45ab39):VisuMZ[_0x2f18('0x56f')][_0x2f18('0x2b2')][_0x2f18('0xc9')](this,_0x3deb03,_0x3836c4,_0x577655,_0x45ab39);},Bitmap[_0x2f18('0x602')][_0x2f18('0x55e')]=function(_0x353b91,_0x155871,_0x1d61ae,_0x4966e7){const _0x12f6ae=this[_0x2f18('0x46f')];_0x12f6ae['fillStyle']=this['outlineColor'],_0x12f6ae[_0x2f18('0x1ac')](_0x353b91,_0x155871+0x2,_0x1d61ae+0x2,_0x4966e7);},VisuMZ['CoreEngine'][_0x2f18('0x2c2')]=Tilemap[_0x2f18('0x602')][_0x2f18('0x422')],Tilemap[_0x2f18('0x602')][_0x2f18('0x422')]=function(_0x385df8,_0x3ff5ca,_0x5d1b81,_0x1e894b){if($gameMap&&$gameMap['areTileShadowsHidden']())return;VisuMZ[_0x2f18('0x56f')]['Tilemap_addShadow'][_0x2f18('0xc9')](this,_0x385df8,_0x3ff5ca,_0x5d1b81,_0x1e894b);},Tilemap[_0x2f18('0x435')][_0x2f18('0x602')][_0x2f18('0x5df')]=function(){this['_destroyInternalTextures']();for(let _0x4d4ea0=0x0;_0x4d4ea0<Tilemap['Layer']['MAX_GL_TEXTURES'];_0x4d4ea0++){if(_0x2f18('0x1b6')==='QSZEn'){function _0x34d1cd(){this[_0x2f18('0x2f6')](...arguments);}}else{const _0x462982=new PIXI['BaseTexture']();_0x462982['setSize'](0x800,0x800);if(VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0xe0')][_0x2f18('0x4c2')]){if('GUfKr'!=='RSWzk')_0x462982[_0x2f18('0x3b8')]=PIXI[_0x2f18('0x84')]['NEAREST'];else{function _0x1d32bf(){this[_0x2f18('0x55e')](_0x1b5905,_0x106c62,_0x490f45,_0x319b90);}}}this[_0x2f18('0x238')][_0x2f18('0x2c9')](_0x462982);}}},WindowLayer[_0x2f18('0x602')][_0x2f18('0x5c8')]=function(){return SceneManager&&SceneManager[_0x2f18('0x4fe')]?SceneManager[_0x2f18('0x4fe')][_0x2f18('0x23c')]():!![];},VisuMZ[_0x2f18('0x56f')]['WindowLayer_render']=WindowLayer[_0x2f18('0x602')][_0x2f18('0x9d')],WindowLayer['prototype'][_0x2f18('0x9d')]=function render(_0x4f7475){if(this[_0x2f18('0x5c8')]()){if('TPULL'!=='rAcRB')VisuMZ[_0x2f18('0x56f')][_0x2f18('0x2cf')]['call'](this,_0x4f7475);else{function _0x246579(){return this[_0x2f18('0x29b')]=this['_coreEasingType']||0x0,[0x0,0x1,0x2,0x3][_0x2f18('0x547')](this[_0x2f18('0x29b')])?_0x268716[_0x2f18('0x56f')][_0x2f18('0x205')]['call'](this,_0x335bb7):_0x4387b0[_0x2f18('0x3b6')](_0x3a0613,this[_0x2f18('0x29b')]);}}}else this[_0x2f18('0x4a5')](_0x4f7475);},WindowLayer[_0x2f18('0x602')]['renderNoMask']=function render(_0x1ce1ea){if(!this[_0x2f18('0x43d')])return;const _0xeaa7be=new PIXI['Graphics'](),_0x5023a7=_0x1ce1ea['gl'],_0x1c4afd=this[_0x2f18('0x249')]['clone']();_0x1ce1ea[_0x2f18('0x279')][_0x2f18('0x162')](),_0xeaa7be[_0x2f18('0x271')]=this[_0x2f18('0x271')],_0x1ce1ea[_0x2f18('0x3aa')][_0x2f18('0xf2')](),_0x5023a7['enable'](_0x5023a7[_0x2f18('0x34')]);while(_0x1c4afd[_0x2f18('0xc7')]>0x0){if(_0x2f18('0x2d0')===_0x2f18('0x3bb')){function _0x46dc63(){this[_0x2f18('0x18f')][_0x2f18('0x18d')](_0x700a71[_0x2f18('0x526')][_0x2f18('0x452')]);}}else{const _0x190046=_0x1c4afd[_0x2f18('0x4fd')]();_0x190046[_0x2f18('0x1c1')]&&_0x190046[_0x2f18('0x43d')]&&_0x190046[_0x2f18('0x47c')]>0x0&&(_0x5023a7[_0x2f18('0x26a')](_0x5023a7[_0x2f18('0x294')],0x0,~0x0),_0x5023a7['stencilOp'](_0x5023a7[_0x2f18('0x31f')],_0x5023a7['KEEP'],_0x5023a7[_0x2f18('0x31f')]),_0x190046[_0x2f18('0x9d')](_0x1ce1ea),_0x1ce1ea['batch'][_0x2f18('0xf2')](),_0xeaa7be[_0x2f18('0x561')](),_0x5023a7[_0x2f18('0x26a')](_0x5023a7[_0x2f18('0x33')],0x1,~0x0),_0x5023a7[_0x2f18('0x3a5')](_0x5023a7[_0x2f18('0x1e7')],_0x5023a7[_0x2f18('0x1e7')],_0x5023a7[_0x2f18('0x1e7')]),_0x5023a7[_0x2f18('0x5b2')](_0x5023a7[_0x2f18('0x8d')],_0x5023a7[_0x2f18('0x3ee')]),_0xeaa7be[_0x2f18('0x9d')](_0x1ce1ea),_0x1ce1ea[_0x2f18('0x3aa')][_0x2f18('0xf2')](),_0x5023a7['blendFunc'](_0x5023a7[_0x2f18('0x3ee')],_0x5023a7[_0x2f18('0x3ac')]));}}_0x5023a7[_0x2f18('0x47e')](_0x5023a7['STENCIL_TEST']),_0x5023a7[_0x2f18('0x561')](_0x5023a7[_0x2f18('0x2dc')]),_0x5023a7[_0x2f18('0x219')](0x0),_0x1ce1ea['batch']['flush']();for(const _0x400418 of this[_0x2f18('0x249')]){if('hVavG'===_0x2f18('0x2ea')){if(!_0x400418[_0x2f18('0x1c1')]&&_0x400418[_0x2f18('0x43d')]){if('wBUSp'===_0x2f18('0x8c'))_0x400418[_0x2f18('0x9d')](_0x1ce1ea);else{function _0x1ff907(){_0x2c61af['startAnimation']();}}}}else{function _0x8ac8e1(){const _0x34c4c6=_0x19d7b4[0x2],_0x2bbdf5=_0x147026[_0x2f18('0x56f')][_0x2f18('0x52c')][_0x2f18('0xc9')](this,_0x2dd282),_0x2dfa64=_0x16ddaf[_0x2f18('0x201')](_0x416288[0x0]);if(_0x2dfa64)_0x2dfa64[_0x2f18('0x355')]([{'x':0x0,'y':0x0},{'x':0.5,'y':0.5}][_0x34c4c6]);return _0x2bbdf5;}}}_0x1ce1ea[_0x2f18('0x3aa')][_0x2f18('0xf2')]();},DataManager[_0x2f18('0x3fa')]=function(_0x5e5094){return this[_0x2f18('0x27d')](_0x5e5094)&&_0x5e5094[_0x2f18('0x57')]===0x2;},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x3ab')]=DataManager[_0x2f18('0x19e')],DataManager['setupNewGame']=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x3ab')][_0x2f18('0xc9')](this),this[_0x2f18('0xf7')]();},DataManager['reservePlayTestNewGameCommonEvent']=function(){if($gameTemp[_0x2f18('0x2f9')]()){const _0x235b19=VisuMZ['CoreEngine'][_0x2f18('0x4d9')][_0x2f18('0xe0')][_0x2f18('0x433')];if(_0x235b19>0x0)$gameTemp['reserveCommonEvent'](_0x235b19);}},TextManager[_0x2f18('0x157')]=['','','',_0x2f18('0x175'),'','',_0x2f18('0x38b'),'',_0x2f18('0x343'),_0x2f18('0x53a'),'','',_0x2f18('0x1e'),_0x2f18('0x5ca'),_0x2f18('0x17'),'',_0x2f18('0x357'),_0x2f18('0x236'),_0x2f18('0x12b'),_0x2f18('0x267'),_0x2f18('0x3f3'),_0x2f18('0xa1'),'EISU',_0x2f18('0x2a5'),_0x2f18('0x2c'),_0x2f18('0x4b1'),'',_0x2f18('0x530'),_0x2f18('0x212'),_0x2f18('0x74'),_0x2f18('0x330'),_0x2f18('0x166'),'SPACE','PGUP',_0x2f18('0x3e4'),_0x2f18('0x2cc'),_0x2f18('0x4bc'),_0x2f18('0xeb'),'UP',_0x2f18('0x47'),'DOWN',_0x2f18('0x1cb'),_0x2f18('0x4ae'),_0x2f18('0x24d'),_0x2f18('0x327'),_0x2f18('0x4f2'),_0x2f18('0x1df'),'','0','1','2','3','4','5','6','7','8','9',_0x2f18('0x1e0'),'SEMICOLON',_0x2f18('0x194'),_0x2f18('0x24a'),_0x2f18('0x38c'),_0x2f18('0x1a1'),'AT','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',_0x2f18('0x250'),'',_0x2f18('0xfe'),'','SLEEP',_0x2f18('0x369'),_0x2f18('0x25d'),_0x2f18('0x325'),_0x2f18('0x495'),_0x2f18('0x1fa'),_0x2f18('0xd4'),_0x2f18('0xb1'),_0x2f18('0x52'),_0x2f18('0x4eb'),_0x2f18('0x4b2'),_0x2f18('0x3e9'),_0x2f18('0xa0'),_0x2f18('0x48e'),_0x2f18('0x5fb'),_0x2f18('0x202'),_0x2f18('0xe1'),'F1','F2','F3','F4','F5','F6','F7','F8','F9',_0x2f18('0x255'),'F11','F12',_0x2f18('0x5ec'),'F14',_0x2f18('0xde'),_0x2f18('0x437'),_0x2f18('0x2f0'),_0x2f18('0x5d2'),_0x2f18('0x2dd'),'F20',_0x2f18('0x43e'),_0x2f18('0x45f'),_0x2f18('0x44e'),_0x2f18('0x265'),'','','','','','','','',_0x2f18('0x346'),_0x2f18('0x254'),_0x2f18('0x2f1'),_0x2f18('0x4c3'),_0x2f18('0x3ca'),_0x2f18('0x1cc'),_0x2f18('0x1a8'),'','','','','','','','','',_0x2f18('0x4c7'),_0x2f18('0x416'),_0x2f18('0x4e1'),_0x2f18('0x15f'),_0x2f18('0x5b3'),_0x2f18('0x29d'),_0x2f18('0x533'),_0x2f18('0x52a'),_0x2f18('0xca'),'CLOSE_PAREN',_0x2f18('0x380'),'PLUS','PIPE','HYPHEN_MINUS',_0x2f18('0x2c7'),'CLOSE_CURLY_BRACKET','TILDE','','','','',_0x2f18('0x10b'),'VOLUME_DOWN',_0x2f18('0x471'),'','','SEMICOLON',_0x2f18('0x24a'),_0x2f18('0x2b6'),'MINUS',_0x2f18('0x479'),_0x2f18('0x392'),_0x2f18('0x72'),'','','','','','','','','','','','','','','','','','','','','','','','','','',_0x2f18('0x48a'),'BACK_SLASH',_0x2f18('0x486'),_0x2f18('0x10e'),'',_0x2f18('0x3a8'),_0x2f18('0x27'),'','WIN_ICO_HELP',_0x2f18('0x419'),'',_0x2f18('0x54f'),'','',_0x2f18('0x543'),_0x2f18('0xc1'),_0x2f18('0x200'),'WIN_OEM_PA2',_0x2f18('0x17a'),_0x2f18('0x512'),_0x2f18('0x37f'),_0x2f18('0x3a0'),'WIN_OEM_FINISH',_0x2f18('0x54d'),_0x2f18('0x475'),_0x2f18('0x100'),'WIN_OEM_BACKTAB',_0x2f18('0x5e6'),_0x2f18('0x222'),_0x2f18('0x2ca'),_0x2f18('0x118'),'PLAY',_0x2f18('0x2cd'),'',_0x2f18('0x97'),_0x2f18('0xec'),''],TextManager[_0x2f18('0x500')]=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x1fd')][_0x2f18('0x12c')],TextManager['buttonAssistCancel']=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['ButtonAssist'][_0x2f18('0x58e')],TextManager[_0x2f18('0x21e')]=VisuMZ['CoreEngine'][_0x2f18('0x4d9')]['ButtonAssist']['SwitchActorText'],VisuMZ[_0x2f18('0x56f')][_0x2f18('0x47f')]=TextManager[_0x2f18('0x55b')],TextManager[_0x2f18('0x55b')]=function(_0x4fc53f){if(typeof _0x4fc53f===_0x2f18('0x248')){if(_0x2f18('0x358')!==_0x2f18('0x190'))return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x47f')][_0x2f18('0xc9')](this,_0x4fc53f);else{function _0xc2ac0a(){if(_0x36a055['note'][_0x2f18('0x15b')](/<SHOW TILE SHADOWS>/i))this['_hideTileShadows']=![];if(_0x4485c5[_0x2f18('0x77')][_0x2f18('0x15b')](/<HIDE TILE SHADOWS>/i))this[_0x2f18('0x456')]=!![];}}}else{if('ohYJm'===_0x2f18('0x50d')){function _0x28c25d(){this[_0x2f18('0xb3')][_0x2f18('0x3ff')](),this[_0x2f18('0x13d')][_0x2f18('0x1a5')](),this[_0x2f18('0x2a7')][_0x2f18('0x43d')]=![],_0x500379[_0x2f18('0x57f')]();}}else return this['paramName'](_0x4fc53f);}},TextManager[_0x2f18('0x54e')]=function(_0x51d68d){_0x51d68d=String(_0x51d68d||'')['toUpperCase']();const _0x437a59=VisuMZ['CoreEngine'][_0x2f18('0x4d9')][_0x2f18('0x41a')];if(_0x51d68d===_0x2f18('0x89'))return $dataSystem['terms'][_0x2f18('0x1a7')][0x0];if(_0x51d68d===_0x2f18('0x3dd'))return $dataSystem[_0x2f18('0xa8')][_0x2f18('0x1a7')][0x1];if(_0x51d68d===_0x2f18('0x50'))return $dataSystem[_0x2f18('0xa8')][_0x2f18('0x1a7')][0x2];if(_0x51d68d===_0x2f18('0x5a3'))return $dataSystem[_0x2f18('0xa8')][_0x2f18('0x1a7')][0x3];if(_0x51d68d===_0x2f18('0x1d'))return $dataSystem[_0x2f18('0xa8')][_0x2f18('0x1a7')][0x4];if(_0x51d68d===_0x2f18('0x2d5'))return $dataSystem[_0x2f18('0xa8')][_0x2f18('0x1a7')][0x5];if(_0x51d68d===_0x2f18('0x40b'))return $dataSystem[_0x2f18('0xa8')][_0x2f18('0x1a7')][0x6];if(_0x51d68d===_0x2f18('0xc4'))return $dataSystem[_0x2f18('0xa8')][_0x2f18('0x1a7')][0x7];if(_0x51d68d==='HIT')return _0x437a59[_0x2f18('0x469')];if(_0x51d68d===_0x2f18('0x590'))return _0x437a59[_0x2f18('0x1e1')];if(_0x51d68d==='CRI')return _0x437a59['XParamVocab2'];if(_0x51d68d===_0x2f18('0xe8'))return _0x437a59[_0x2f18('0x19b')];if(_0x51d68d===_0x2f18('0x60'))return _0x437a59['XParamVocab4'];if(_0x51d68d===_0x2f18('0x20a'))return _0x437a59[_0x2f18('0x93')];if(_0x51d68d===_0x2f18('0x56b'))return _0x437a59['XParamVocab6'];if(_0x51d68d===_0x2f18('0x559'))return _0x437a59['XParamVocab7'];if(_0x51d68d===_0x2f18('0x3df'))return _0x437a59[_0x2f18('0x467')];if(_0x51d68d==='TRG')return _0x437a59[_0x2f18('0xb8')];if(_0x51d68d===_0x2f18('0x3f1'))return _0x437a59[_0x2f18('0x2fd')];if(_0x51d68d===_0x2f18('0x94'))return _0x437a59[_0x2f18('0xfb')];if(_0x51d68d===_0x2f18('0x2c4'))return _0x437a59['SParamVocab2'];if(_0x51d68d==='PHA')return _0x437a59['SParamVocab3'];if(_0x51d68d===_0x2f18('0x96'))return _0x437a59['SParamVocab4'];if(_0x51d68d==='TCR')return _0x437a59[_0x2f18('0x12e')];if(_0x51d68d===_0x2f18('0x7b'))return _0x437a59[_0x2f18('0x18c')];if(_0x51d68d===_0x2f18('0x31c'))return _0x437a59[_0x2f18('0x2ec')];if(_0x51d68d===_0x2f18('0x374'))return _0x437a59[_0x2f18('0x368')];if(_0x51d68d===_0x2f18('0x293'))return _0x437a59[_0x2f18('0x4d2')];return'';},TextManager[_0x2f18('0x379')]=function(_0x58c782){if(_0x58c782===_0x2f18('0xad'))_0x58c782=_0x2f18('0x390');let _0x2ecf14=[];for(let _0x2092e3 in Input['keyMapper']){_0x2092e3=Number(_0x2092e3);if(_0x2092e3>=0x60&&_0x2092e3<=0x69)continue;if([0x12,0x20][_0x2f18('0x547')](_0x2092e3))continue;_0x58c782===Input[_0x2f18('0x3d0')][_0x2092e3]&&_0x2ecf14[_0x2f18('0x2c9')](_0x2092e3);}for(let _0x441a1e=0x0;_0x441a1e<_0x2ecf14['length'];_0x441a1e++){_0x2ecf14[_0x441a1e]=TextManager[_0x2f18('0x157')][_0x2ecf14[_0x441a1e]];}return this[_0x2f18('0x2bd')](_0x2ecf14);},TextManager[_0x2f18('0x2bd')]=function(_0x35171c){const _0x5a5b05=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x1fd')],_0x384888=_0x5a5b05[_0x2f18('0x33e')],_0x28bef1=_0x35171c[_0x2f18('0x47a')](),_0x374b23=_0x2f18('0x187')['format'](_0x28bef1);return _0x5a5b05[_0x374b23]?_0x5a5b05[_0x374b23]:_0x384888['format'](_0x28bef1);},TextManager[_0x2f18('0x1ad')]=function(_0x2bab9e,_0x5eb350){const _0x3c92ca=VisuMZ['CoreEngine'][_0x2f18('0x4d9')][_0x2f18('0x1fd')],_0x5c7feb=_0x3c92ca[_0x2f18('0x2fc')],_0x49e97c=this[_0x2f18('0x379')](_0x2bab9e),_0x1721fd=this[_0x2f18('0x379')](_0x5eb350);return _0x5c7feb[_0x2f18('0x1fe')](_0x49e97c,_0x1721fd);},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x21a')]=ColorManager['loadWindowskin'],ColorManager[_0x2f18('0x3c0')]=function(){VisuMZ[_0x2f18('0x56f')]['ColorManager_loadWindowskin'][_0x2f18('0xc9')](this),this['_colorCache']=this[_0x2f18('0x3d4')]||{};},ColorManager[_0x2f18('0x5ee')]=function(_0x9a019c,_0x25b522){_0x25b522=String(_0x25b522),this[_0x2f18('0x3d4')]=this[_0x2f18('0x3d4')]||{};if(_0x25b522[_0x2f18('0x15b')](/#(.*)/i)){if(_0x2f18('0x106')===_0x2f18('0x531')){function _0x3e87e3(){return _0x3ff3e4[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x458')][_0x2f18('0x2d')][_0x2f18('0xc9')](this,_0x488d02);}}else this['_colorCache'][_0x9a019c]=_0x2f18('0x258')[_0x2f18('0x1fe')](String(RegExp['$1']));}else{if(_0x2f18('0x453')===_0x2f18('0x453'))this[_0x2f18('0x3d4')][_0x9a019c]=this['textColor'](Number(_0x25b522));else{function _0x1b31c4(){this[_0x2f18('0x2c6')]();}}}return this[_0x2f18('0x3d4')][_0x9a019c];},ColorManager[_0x2f18('0x5e7')]=function(_0x7ca6c5){return _0x7ca6c5[_0x2f18('0x15b')](/#(.*)/i)?_0x2f18('0x258')['format'](String(RegExp['$1'])):this[_0x2f18('0x16b')](Number(_0x7ca6c5));},ColorManager['clearCachedKeys']=function(){this[_0x2f18('0x3d4')]={};},ColorManager['normalColor']=function(){const _0xc412ed=_0x2f18('0x188');this[_0x2f18('0x3d4')]=this[_0x2f18('0x3d4')]||{};if(this['_colorCache'][_0xc412ed])return this['_colorCache'][_0xc412ed];const _0x57cb11=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x458')][_0x2f18('0x43a')];return this[_0x2f18('0x5ee')](_0xc412ed,_0x57cb11);},ColorManager[_0x2f18('0x41e')]=function(){const _0x5cd2e5=_0x2f18('0x302');this[_0x2f18('0x3d4')]=this[_0x2f18('0x3d4')]||{};if(this['_colorCache'][_0x5cd2e5])return this[_0x2f18('0x3d4')][_0x5cd2e5];const _0x511a44=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x458')][_0x2f18('0x494')];return this[_0x2f18('0x5ee')](_0x5cd2e5,_0x511a44);},ColorManager['crisisColor']=function(){const _0x59483f='_stored_crisisColor';this[_0x2f18('0x3d4')]=this[_0x2f18('0x3d4')]||{};if(this[_0x2f18('0x3d4')][_0x59483f])return this['_colorCache'][_0x59483f];const _0x826a2d=VisuMZ['CoreEngine'][_0x2f18('0x4d9')][_0x2f18('0x458')][_0x2f18('0x2ef')];return this[_0x2f18('0x5ee')](_0x59483f,_0x826a2d);},ColorManager[_0x2f18('0xf')]=function(){const _0x2a2de9=_0x2f18('0x19a');this['_colorCache']=this[_0x2f18('0x3d4')]||{};if(this[_0x2f18('0x3d4')][_0x2a2de9])return this[_0x2f18('0x3d4')][_0x2a2de9];const _0x1adbba=VisuMZ['CoreEngine']['Settings']['Color']['ColorDeath'];return this[_0x2f18('0x5ee')](_0x2a2de9,_0x1adbba);},ColorManager[_0x2f18('0x4c5')]=function(){const _0x49e12d='_stored_gaugeBackColor';this[_0x2f18('0x3d4')]=this[_0x2f18('0x3d4')]||{};if(this[_0x2f18('0x3d4')][_0x49e12d])return this[_0x2f18('0x3d4')][_0x49e12d];const _0x24ae00=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x458')]['ColorGaugeBack'];return this[_0x2f18('0x5ee')](_0x49e12d,_0x24ae00);},ColorManager[_0x2f18('0x58c')]=function(){const _0x2b23c2=_0x2f18('0x28');this[_0x2f18('0x3d4')]=this[_0x2f18('0x3d4')]||{};if(this[_0x2f18('0x3d4')][_0x2b23c2])return this['_colorCache'][_0x2b23c2];const _0x400247=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['Color'][_0x2f18('0x39c')];return this[_0x2f18('0x5ee')](_0x2b23c2,_0x400247);},ColorManager['hpGaugeColor2']=function(){const _0x3182d8=_0x2f18('0x183');this[_0x2f18('0x3d4')]=this[_0x2f18('0x3d4')]||{};if(this[_0x2f18('0x3d4')][_0x3182d8])return this[_0x2f18('0x3d4')][_0x3182d8];const _0x4a5593=VisuMZ['CoreEngine'][_0x2f18('0x4d9')][_0x2f18('0x458')]['ColorHPGauge2'];return this[_0x2f18('0x5ee')](_0x3182d8,_0x4a5593);},ColorManager['mpGaugeColor1']=function(){const _0x3c4ad5=_0x2f18('0x1a0');this[_0x2f18('0x3d4')]=this[_0x2f18('0x3d4')]||{};if(this[_0x2f18('0x3d4')][_0x3c4ad5])return this[_0x2f18('0x3d4')][_0x3c4ad5];const _0x2cef59=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x458')][_0x2f18('0x5c9')];return this[_0x2f18('0x5ee')](_0x3c4ad5,_0x2cef59);},ColorManager[_0x2f18('0x50c')]=function(){const _0x49d8ae=_0x2f18('0x5fc');this[_0x2f18('0x3d4')]=this[_0x2f18('0x3d4')]||{};if(this[_0x2f18('0x3d4')][_0x49d8ae])return this['_colorCache'][_0x49d8ae];const _0x3e198b=VisuMZ['CoreEngine'][_0x2f18('0x4d9')][_0x2f18('0x458')][_0x2f18('0x30')];return this[_0x2f18('0x5ee')](_0x49d8ae,_0x3e198b);},ColorManager[_0x2f18('0x62')]=function(){const _0x3daae2='_stored_mpCostColor';this['_colorCache']=this['_colorCache']||{};if(this[_0x2f18('0x3d4')][_0x3daae2])return this[_0x2f18('0x3d4')][_0x3daae2];const _0x19c420=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x458')][_0x2f18('0x5d')];return this[_0x2f18('0x5ee')](_0x3daae2,_0x19c420);},ColorManager['powerUpColor']=function(){const _0x5082d9=_0x2f18('0x9a');this[_0x2f18('0x3d4')]=this[_0x2f18('0x3d4')]||{};if(this[_0x2f18('0x3d4')][_0x5082d9])return this[_0x2f18('0x3d4')][_0x5082d9];const _0x375303=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x458')]['ColorPowerUp'];return this[_0x2f18('0x5ee')](_0x5082d9,_0x375303);},ColorManager['powerDownColor']=function(){const _0x954ed7=_0x2f18('0x104');this[_0x2f18('0x3d4')]=this[_0x2f18('0x3d4')]||{};if(this[_0x2f18('0x3d4')][_0x954ed7])return this[_0x2f18('0x3d4')][_0x954ed7];const _0x25d3db=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['Color'][_0x2f18('0x5c')];return this[_0x2f18('0x5ee')](_0x954ed7,_0x25d3db);},ColorManager[_0x2f18('0x41c')]=function(){const _0x53805b=_0x2f18('0x3b4');this['_colorCache']=this[_0x2f18('0x3d4')]||{};if(this[_0x2f18('0x3d4')][_0x53805b])return this[_0x2f18('0x3d4')][_0x53805b];const _0x440249=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x458')][_0x2f18('0x297')];return this[_0x2f18('0x5ee')](_0x53805b,_0x440249);},ColorManager[_0x2f18('0x431')]=function(){const _0x15164e=_0x2f18('0x2bc');this[_0x2f18('0x3d4')]=this[_0x2f18('0x3d4')]||{};if(this['_colorCache'][_0x15164e])return this['_colorCache'][_0x15164e];const _0xd18e2d=VisuMZ['CoreEngine'][_0x2f18('0x4d9')]['Color'][_0x2f18('0x10')];return this[_0x2f18('0x5ee')](_0x15164e,_0xd18e2d);},ColorManager[_0x2f18('0x4a7')]=function(){const _0x3f00ce='_stored_tpGaugeColor1';this[_0x2f18('0x3d4')]=this[_0x2f18('0x3d4')]||{};if(this[_0x2f18('0x3d4')][_0x3f00ce])return this[_0x2f18('0x3d4')][_0x3f00ce];const _0x3f76df=VisuMZ['CoreEngine'][_0x2f18('0x4d9')][_0x2f18('0x458')][_0x2f18('0x465')];return this[_0x2f18('0x5ee')](_0x3f00ce,_0x3f76df);},ColorManager[_0x2f18('0x47d')]=function(){const _0x34f06f=_0x2f18('0x4e4');this[_0x2f18('0x3d4')]=this[_0x2f18('0x3d4')]||{};if(this['_colorCache'][_0x34f06f])return this[_0x2f18('0x3d4')][_0x34f06f];const _0x412982=VisuMZ[_0x2f18('0x56f')]['Settings'][_0x2f18('0x458')]['ColorTPGauge2'];return this['getColorDataFromPluginParameters'](_0x34f06f,_0x412982);},ColorManager[_0x2f18('0x407')]=function(){const _0x2eef81=_0x2f18('0x211');this[_0x2f18('0x3d4')]=this[_0x2f18('0x3d4')]||{};if(this[_0x2f18('0x3d4')][_0x2eef81])return this[_0x2f18('0x3d4')][_0x2eef81];const _0x4a7a9a=VisuMZ['CoreEngine']['Settings'][_0x2f18('0x458')][_0x2f18('0x170')];return this['getColorDataFromPluginParameters'](_0x2eef81,_0x4a7a9a);},ColorManager[_0x2f18('0x505')]=function(){const _0x584167='_stored_pendingColor';this[_0x2f18('0x3d4')]=this[_0x2f18('0x3d4')]||{};if(this[_0x2f18('0x3d4')][_0x584167])return this[_0x2f18('0x3d4')][_0x584167];const _0x4dc47a=VisuMZ['CoreEngine']['Settings'][_0x2f18('0x458')][_0x2f18('0x170')];return this[_0x2f18('0x5ee')](_0x584167,_0x4dc47a);},ColorManager[_0x2f18('0x257')]=function(){const _0x1d3014=_0x2f18('0xe9');this[_0x2f18('0x3d4')]=this[_0x2f18('0x3d4')]||{};if(this[_0x2f18('0x3d4')][_0x1d3014])return this[_0x2f18('0x3d4')][_0x1d3014];const _0x5660eb=VisuMZ['CoreEngine'][_0x2f18('0x4d9')]['Color'][_0x2f18('0x3d2')];return this[_0x2f18('0x5ee')](_0x1d3014,_0x5660eb);},ColorManager[_0x2f18('0x470')]=function(){const _0x5c5cd3=_0x2f18('0x40d');this[_0x2f18('0x3d4')]=this[_0x2f18('0x3d4')]||{};if(this['_colorCache'][_0x5c5cd3])return this[_0x2f18('0x3d4')][_0x5c5cd3];const _0x2cf8bf=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x458')][_0x2f18('0x1f6')];return this[_0x2f18('0x5ee')](_0x5c5cd3,_0x2cf8bf);},ColorManager[_0x2f18('0x517')]=function(){const _0x374788='_stored_maxLvGaugeColor1';this[_0x2f18('0x3d4')]=this[_0x2f18('0x3d4')]||{};if(this['_colorCache'][_0x374788])return this[_0x2f18('0x3d4')][_0x374788];const _0x32fc6b=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x458')][_0x2f18('0x2e8')];return this[_0x2f18('0x5ee')](_0x374788,_0x32fc6b);},ColorManager[_0x2f18('0x2e7')]=function(){const _0x28112f=_0x2f18('0x395');this[_0x2f18('0x3d4')]=this[_0x2f18('0x3d4')]||{};if(this[_0x2f18('0x3d4')][_0x28112f])return this[_0x2f18('0x3d4')][_0x28112f];const _0x589056=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x458')][_0x2f18('0x521')];return this['getColorDataFromPluginParameters'](_0x28112f,_0x589056);},ColorManager['hpColor']=function(_0x1cea23){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x458')][_0x2f18('0x2b1')]['call'](this,_0x1cea23);},ColorManager[_0x2f18('0x11')]=function(_0x5774b6){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x458')][_0x2f18('0x14f')]['call'](this,_0x5774b6);},ColorManager['tpColor']=function(_0x34f191){return VisuMZ[_0x2f18('0x56f')]['Settings'][_0x2f18('0x458')][_0x2f18('0x305')][_0x2f18('0xc9')](this,_0x34f191);},ColorManager[_0x2f18('0x3e6')]=function(_0x4d8069){return VisuMZ[_0x2f18('0x56f')]['Settings']['Color'][_0x2f18('0x460')]['call'](this,_0x4d8069);},ColorManager['damageColor']=function(_0xd45c19){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x458')][_0x2f18('0x2d')][_0x2f18('0xc9')](this,_0xd45c19);},ColorManager['outlineColor']=function(){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['Color'][_0x2f18('0x5c0')];},ColorManager[_0x2f18('0x36d')]=function(){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x458')][_0x2f18('0x218')];},ColorManager[_0x2f18('0x1a6')]=function(){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['Color'][_0x2f18('0x348')];},ColorManager[_0x2f18('0x1c2')]=function(){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x458')][_0x2f18('0x156')];},ColorManager[_0x2f18('0x46e')]=function(){return VisuMZ[_0x2f18('0x56f')]['Settings']['Color'][_0x2f18('0x5da')];},SceneManager['_storedStack']=[],VisuMZ['CoreEngine']['SceneManager_initialize']=SceneManager[_0x2f18('0x2f6')],SceneManager[_0x2f18('0x2f6')]=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x226')][_0x2f18('0xc9')](this),this[_0x2f18('0x3e')]();},VisuMZ[_0x2f18('0x56f')]['SceneManager_onKeyDown']=SceneManager[_0x2f18('0x17b')],SceneManager[_0x2f18('0x17b')]=function(_0x38fdb5){if($gameTemp)this[_0x2f18('0xf3')](_0x38fdb5);VisuMZ[_0x2f18('0x56f')][_0x2f18('0x16a')][_0x2f18('0xc9')](this,_0x38fdb5);},SceneManager[_0x2f18('0xf3')]=function(_0x2dca2e){if(!_0x2dca2e['ctrlKey']&&!_0x2dca2e[_0x2f18('0x4dd')]){if(_0x2f18('0x321')!==_0x2f18('0x145'))switch(_0x2dca2e[_0x2f18('0x335')]){case 0x75:this[_0x2f18('0x446')]();break;case 0x76:this[_0x2f18('0x99')]();break;}else{function _0x1f58fa(){this['_fauxAnimationQueue']=[];}}}},SceneManager[_0x2f18('0x446')]=function(){if($gameTemp[_0x2f18('0x2f9')]()&&VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0xe0')]['F6key']){if(_0x2f18('0x2f2')===_0x2f18('0x2f2')){if(ConfigManager[_0x2f18('0x134')]!==0x0){if(_0x2f18('0x272')===_0x2f18('0x272'))ConfigManager[_0x2f18('0x4e2')]=0x0,ConfigManager[_0x2f18('0x53e')]=0x0,ConfigManager[_0x2f18('0x29f')]=0x0,ConfigManager[_0x2f18('0x134')]=0x0;else{function _0x313cdd(){return _0x3e8066[_0x2f18('0x5fe')]&&_0x31f7be[_0x2f18('0xaa')][_0x2f18('0x547')]('['+_0x371a91+']');}}}else{if(_0x2f18('0xb')===_0x2f18('0xb'))ConfigManager[_0x2f18('0x4e2')]=0x64,ConfigManager[_0x2f18('0x53e')]=0x64,ConfigManager[_0x2f18('0x29f')]=0x64,ConfigManager[_0x2f18('0x134')]=0x64;else{function _0x4fbea6(){if(_0x36146d[_0x2f18('0x2f9')]())_0x1f5f7f[_0x2f18('0xb4')](_0x55a0ad);}}}ConfigManager[_0x2f18('0x8b')]();if(this[_0x2f18('0x4fe')][_0x2f18('0x17c')]===Scene_Options){if(this[_0x2f18('0x4fe')][_0x2f18('0x354')])this[_0x2f18('0x4fe')][_0x2f18('0x354')][_0x2f18('0x232')]();if(this[_0x2f18('0x4fe')]['_listWindow'])this['_scene'][_0x2f18('0x511')][_0x2f18('0x232')]();}}else{function _0xa239e3(){return _0x5e7deb[_0x2f18('0x32e')](_0x578c12,'','');}}}},SceneManager[_0x2f18('0x99')]=function(){$gameTemp[_0x2f18('0x2f9')]()&&VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0xe0')][_0x2f18('0xb6')]&&($gameTemp[_0x2f18('0x36')]=!$gameTemp['_playTestFastMode']);},SceneManager[_0x2f18('0x3e')]=function(){this['_sideButtonLayout']=![],this['_hideButtons']=!VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['UI'][_0x2f18('0x24c')];},SceneManager[_0x2f18('0x383')]=function(_0x3ca0a6){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['UI'][_0x2f18('0x23b')]&&(this[_0x2f18('0x28f')]=_0x3ca0a6);},SceneManager[_0x2f18('0xc3')]=function(){return this[_0x2f18('0x28f')];},SceneManager['areButtonsHidden']=function(){return this[_0x2f18('0x388')];},SceneManager[_0x2f18('0x82')]=function(){return this[_0x2f18('0x49d')]()||this[_0x2f18('0xc3')]();},VisuMZ[_0x2f18('0x56f')]['SceneManager_isGameActive']=SceneManager[_0x2f18('0x571')],SceneManager[_0x2f18('0x571')]=function(){if(VisuMZ[_0x2f18('0x56f')]['Settings']['QoL'][_0x2f18('0x308')])return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4fc')][_0x2f18('0xc9')](this);else{if(_0x2f18('0x3af')==='gplor')return!![];else{function _0x373294(){this[_0x2f18('0x376')]();}}}},SceneManager[_0x2f18('0x13')]=function(_0x17ad59){if(_0x17ad59 instanceof Error)this[_0x2f18('0xd3')](_0x17ad59);else{if(_0x17ad59 instanceof Array&&_0x17ad59[0x0]===_0x2f18('0x121')){if(_0x2f18('0x2ab')===_0x2f18('0x2ab'))this[_0x2f18('0x33f')](_0x17ad59);else{function _0x3c6a86(){this[_0x2f18('0x43d')]=![],this[_0x2f18('0x7a')]=0x0,this['x']=_0x131764[_0x2f18('0x410')]*0xa,this['y']=_0x12657b[_0x2f18('0x1c6')]*0xa;}}}else{if('OEyMC'!==_0x2f18('0x399'))this[_0x2f18('0x439')](_0x17ad59);else{function _0x28af42(){this[_0x2f18('0x12a')][_0x2f18('0x18d')](_0x5b8d59[_0x2f18('0x526')]['HelpBgType']);}}}}this[_0x2f18('0x2f')]();},VisuMZ['CoreEngine'][_0x2f18('0x2ba')]=BattleManager[_0x2f18('0x4c6')],BattleManager[_0x2f18('0x4c6')]=function(){if(VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0xe0')]['EscapeAlways'])this[_0x2f18('0x50a')]();else return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x2ba')][_0x2f18('0xc9')](this);},BattleManager[_0x2f18('0x50a')]=function(){return $gameParty[_0x2f18('0x57d')](),SoundManager[_0x2f18('0x2c1')](),this[_0x2f18('0x115')](),!![];},VisuMZ[_0x2f18('0x56f')][_0x2f18('0xc5')]=Game_Temp[_0x2f18('0x602')][_0x2f18('0x2f6')],Game_Temp[_0x2f18('0x602')]['initialize']=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0xc5')]['call'](this),this[_0x2f18('0x2db')](),this[_0x2f18('0x2ff')]();},Game_Temp[_0x2f18('0x602')][_0x2f18('0x2db')]=function(){if(VisuMZ[_0x2f18('0x56f')]['Settings'][_0x2f18('0xe0')]['ForceNoPlayTest']){if(_0x2f18('0xa5')===_0x2f18('0xa5'))this[_0x2f18('0x59f')]=![];else{function _0x1f5e35(){var _0x4d04cd=_0x45b448(_0x11e414['$1']);_0xe5e0e2+=_0x4d04cd;}}}},Game_Temp['prototype'][_0x2f18('0x2ff')]=function(){this[_0x2f18('0x31d')]=[];},Game_Temp[_0x2f18('0x602')][_0x2f18('0x4c8')]=function(_0x5dd6cb,_0x2999e8,_0x26fab5,_0x37ad5e){if(!this[_0x2f18('0x2eb')]())return;_0x26fab5=_0x26fab5||![],_0x37ad5e=_0x37ad5e||![];if($dataAnimations[_0x2999e8]){if(_0x2f18('0x22a')!==_0x2f18('0x41b')){const _0x42c913={'targets':_0x5dd6cb,'animationId':_0x2999e8,'mirror':_0x26fab5,'mute':_0x37ad5e};this['_fauxAnimationQueue'][_0x2f18('0x2c9')](_0x42c913);for(const _0x1d4606 of _0x5dd6cb){_0x1d4606[_0x2f18('0x204')]&&_0x1d4606[_0x2f18('0x204')]();}}else{function _0x4e7a06(){return this['isMapScrollLinked']()?this[_0x2f18('0x9f')]():_0x56add8[_0x2f18('0x56f')][_0x2f18('0x4ce')]['call'](this);}}}},Game_Temp['prototype']['showFauxAnimations']=function(){return!![];},Game_Temp[_0x2f18('0x602')]['retrieveFauxAnimation']=function(){return this[_0x2f18('0x31d')][_0x2f18('0x4fd')]();},Game_Temp[_0x2f18('0x602')][_0x2f18('0x58')]=function(_0x5a891e){this[_0x2f18('0x1e4')]=_0x5a891e;},Game_Temp[_0x2f18('0x602')][_0x2f18('0x51b')]=function(){return this[_0x2f18('0x1e4')];},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x30f')]=Game_System[_0x2f18('0x602')][_0x2f18('0x2f6')],Game_System[_0x2f18('0x602')][_0x2f18('0x2f6')]=function(){VisuMZ[_0x2f18('0x56f')]['Game_System_initialize']['call'](this),this['initCoreEngine']();},Game_System[_0x2f18('0x602')][_0x2f18('0x576')]=function(){this[_0x2f18('0x2d3')]={'SideView':$dataSystem[_0x2f18('0x8f')],'TimeProgress':$dataSystem[_0x2f18('0x5e3')],'FontSize':$dataSystem[_0x2f18('0x4f5')][_0x2f18('0x313')],'Padding':0xc};},Game_System[_0x2f18('0x602')][_0x2f18('0x342')]=function(){if(this[_0x2f18('0x2d3')]===undefined)this[_0x2f18('0x576')]();if(this[_0x2f18('0x2d3')][_0x2f18('0x3bd')]===undefined)this['initCoreEngine']();return this[_0x2f18('0x2d3')][_0x2f18('0x3bd')];},Game_System[_0x2f18('0x602')]['setSideView']=function(_0x4d4547){if(this[_0x2f18('0x2d3')]===undefined)this[_0x2f18('0x576')]();if(this[_0x2f18('0x2d3')][_0x2f18('0x3bd')]===undefined)this['initCoreEngine']();this[_0x2f18('0x2d3')]['SideView']=_0x4d4547;},Game_System[_0x2f18('0x602')][_0x2f18('0x240')]=function(){if(this[_0x2f18('0x2d3')]===undefined)this[_0x2f18('0x576')]();if(this[_0x2f18('0x2d3')][_0x2f18('0x2de')]===undefined)this[_0x2f18('0x576')]();return this[_0x2f18('0x2d3')][_0x2f18('0x2de')];},Game_System[_0x2f18('0x602')][_0x2f18('0x49a')]=function(_0x569f9f){if(this['_CoreEngineSettings']===undefined)this['initCoreEngine']();if(this[_0x2f18('0x2d3')][_0x2f18('0x2de')]===undefined)this[_0x2f18('0x576')]();this[_0x2f18('0x2d3')]['TimeProgress']=_0x569f9f;},Game_System[_0x2f18('0x602')][_0x2f18('0x3cc')]=function(){if(this[_0x2f18('0x2d3')]===undefined)this[_0x2f18('0x576')]();if(this[_0x2f18('0x2d3')][_0x2f18('0x588')]===undefined)this[_0x2f18('0x576')]();return this[_0x2f18('0x2d3')][_0x2f18('0x588')];},Game_System[_0x2f18('0x602')][_0x2f18('0x539')]=function(_0x54c06e){if(this[_0x2f18('0x2d3')]===undefined)this[_0x2f18('0x576')]();if(this[_0x2f18('0x2d3')][_0x2f18('0x2de')]===undefined)this['initCoreEngine']();this['_CoreEngineSettings'][_0x2f18('0x588')]=_0x54c06e;},Game_System[_0x2f18('0x602')][_0x2f18('0x394')]=function(){if(this[_0x2f18('0x2d3')]===undefined)this['initCoreEngine']();if(this[_0x2f18('0x2d3')]['Padding']===undefined)this[_0x2f18('0x576')]();return this[_0x2f18('0x2d3')]['Padding'];},Game_System[_0x2f18('0x602')][_0x2f18('0x484')]=function(_0x2a65c1){if(this[_0x2f18('0x2d3')]===undefined)this[_0x2f18('0x576')]();if(this['_CoreEngineSettings'][_0x2f18('0x2de')]===undefined)this[_0x2f18('0x576')]();this[_0x2f18('0x2d3')][_0x2f18('0xc8')]=_0x2a65c1;},VisuMZ['CoreEngine']['Game_Screen_initialize']=Game_Screen[_0x2f18('0x602')][_0x2f18('0x2f6')],Game_Screen[_0x2f18('0x602')][_0x2f18('0x2f6')]=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x239')][_0x2f18('0xc9')](this),this[_0x2f18('0x33c')]();},Game_Screen[_0x2f18('0x602')]['initCoreEngineScreenShake']=function(){const _0x25e4fc=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['ScreenShake'];this[_0x2f18('0x7c')]=_0x25e4fc?.['DefaultStyle']||_0x2f18('0x363');},Game_Screen['prototype'][_0x2f18('0x5')]=function(){if(this['_coreEngineShakeStyle']===undefined)this[_0x2f18('0x33c')]();return this[_0x2f18('0x7c')];},Game_Screen[_0x2f18('0x602')][_0x2f18('0x4a2')]=function(_0x59301e){if(this[_0x2f18('0x7c')]===undefined)this[_0x2f18('0x33c')]();this[_0x2f18('0x7c')]=_0x59301e[_0x2f18('0x1b3')]()[_0x2f18('0x44a')]();},Game_Picture['prototype'][_0x2f18('0x2e2')]=function(){if($gameParty[_0x2f18('0x51d')]())return![];return this['name']()&&this[_0x2f18('0x262')]()[_0x2f18('0x535')](0x0)==='!';},VisuMZ[_0x2f18('0x56f')]['Game_Picture_x']=Game_Picture['prototype']['x'],Game_Picture[_0x2f18('0x602')]['x']=function(){if(this[_0x2f18('0x2e2')]())return this[_0x2f18('0x41')]();else{if(_0x2f18('0x361')===_0x2f18('0x361'))return VisuMZ['CoreEngine'][_0x2f18('0x31')]['call'](this);else{function _0x5ea30a(){_0xaf560f[_0x2f18('0x602')][_0x2f18('0x377')][_0x2f18('0xc9')](this),!_0x260797[_0x2f18('0x48d')](_0x36e98b)&&(this[_0x2f18('0xb3')][_0x2f18('0x3ff')](),this[_0x2f18('0x13d')][_0x2f18('0x1a5')](),this[_0x2f18('0x2a7')]['visible']=![],_0x3ff14a[_0x2f18('0x57f')]()),_0x52c633[_0x2f18('0xdb')]();}}}},Game_Picture[_0x2f18('0x602')][_0x2f18('0x41')]=function(){const _0x1bee37=$gameMap['displayX']()*$gameMap[_0x2f18('0x4f')]();return this['_x']-_0x1bee37;},VisuMZ['CoreEngine'][_0x2f18('0x4ce')]=Game_Picture[_0x2f18('0x602')]['y'],Game_Picture[_0x2f18('0x602')]['y']=function(){if(this[_0x2f18('0x2e2')]()){if(_0x2f18('0x1a2')!==_0x2f18('0x1a2')){function _0x3c270a(){this[_0x2f18('0x1b1')]={},_0x122571[_0x2f18('0x56f')][_0x2f18('0xe6')]['call'](this);}}else return this[_0x2f18('0x9f')]();}else return VisuMZ[_0x2f18('0x56f')]['Game_Picture_y'][_0x2f18('0xc9')](this);},Game_Picture[_0x2f18('0x602')][_0x2f18('0x9f')]=function(){const _0x3390d6=$gameMap[_0x2f18('0x3f9')]()*$gameMap['tileHeight']();return this['_y']-_0x3390d6;},Game_Picture[_0x2f18('0x602')][_0x2f18('0x213')]=function(_0x3b38d0){this[_0x2f18('0x29b')]=_0x3b38d0;},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x205')]=Game_Picture[_0x2f18('0x602')][_0x2f18('0x1f4')],Game_Picture[_0x2f18('0x602')][_0x2f18('0x1f4')]=function(_0x50d0b7){this[_0x2f18('0x29b')]=this[_0x2f18('0x29b')]||0x0;if([0x0,0x1,0x2,0x3][_0x2f18('0x547')](this[_0x2f18('0x29b')])){if(_0x2f18('0x5ef')===_0x2f18('0x5ef'))return VisuMZ['CoreEngine']['Game_Picture_calcEasing'][_0x2f18('0xc9')](this,_0x50d0b7);else{function _0x3f6c7e(){_0x45c0da=_0x37cb41['GroupDigits'](_0x1a3444);}}}else return VisuMZ[_0x2f18('0x3b6')](_0x50d0b7,this[_0x2f18('0x29b')]);},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4a9')]=Game_Action['prototype'][_0x2f18('0x4b9')],Game_Action[_0x2f18('0x602')][_0x2f18('0x4b9')]=function(_0x3708ec){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0xe0')][_0x2f18('0x30d')]?this[_0x2f18('0x25')](_0x3708ec):VisuMZ['CoreEngine']['Game_Action_itemHit'][_0x2f18('0xc9')](this,_0x3708ec);},Game_Action[_0x2f18('0x602')][_0x2f18('0x25')]=function(_0x5ded1a){const _0x4d11b0=this[_0x2f18('0x53')](_0x5ded1a),_0x12429f=this[_0x2f18('0x208')](_0x5ded1a),_0x5f36de=this[_0x2f18('0x2b')](_0x5ded1a);return _0x4d11b0*(_0x12429f-_0x5f36de);},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x40f')]=Game_Action[_0x2f18('0x602')][_0x2f18('0x105')],Game_Action[_0x2f18('0x602')][_0x2f18('0x105')]=function(_0x3680f3){if(VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0xe0')][_0x2f18('0x30d')]){if(_0x2f18('0x48f')===_0x2f18('0x48f'))return 0x0;else{function _0x3664bc(){return typeof _0x219366===_0x2f18('0x248')?_0x37e551['CoreEngine'][_0x2f18('0x47f')][_0x2f18('0xc9')](this,_0x37cfef):this[_0x2f18('0x54e')](_0x4b051f);}}}else return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x40f')][_0x2f18('0xc9')](this,_0x3680f3);},Game_Action[_0x2f18('0x602')][_0x2f18('0x53')]=function(_0x362fc3){return this[_0x2f18('0x4b0')]()['successRate']*0.01;},Game_Action[_0x2f18('0x602')][_0x2f18('0x208')]=function(_0x55584b){if(VisuMZ[_0x2f18('0x56f')]['Settings'][_0x2f18('0xe0')][_0x2f18('0x59e')]&&this[_0x2f18('0x27d')]())return 0x1;if(this[_0x2f18('0x1b2')]()){if(VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0xe0')][_0x2f18('0x59e')]&&this['subject']()[_0x2f18('0x34f')]()){if(_0x2f18('0x3b1')===_0x2f18('0x129')){function _0x39dd0a(){const _0x4409a6=_0x46fd17[_0x2f18('0x56f')]['Settings'][_0x2f18('0x1e8')];if(_0x4409a6[_0x2f18('0x44c')]===![])return;_0x4409a6[_0x2f18('0x389')]?_0x4409a6[_0x2f18('0x389')][_0x2f18('0xc9')](this,_0x2f5d58):_0x4503d5[_0x2f18('0x56f')][_0x2f18('0x29c')][_0x2f18('0xc9')](this,_0x2487f5);}}else return this[_0x2f18('0x1d2')]()[_0x2f18('0x199')]+0.05;}else{if(_0x2f18('0x83')===_0x2f18('0x83'))return this['subject']()[_0x2f18('0x199')];else{function _0x2f5702(){return _0x5c9078['buttonAssistOk'];}}}}else{if(_0x2f18('0x4bb')!==_0x2f18('0x4bb')){function _0x545cfe(){var _0x3180ea=_0x1760c2(_0x5e6382['$1']);try{_0xdbbcee*=_0x3669ec(_0x3180ea);}catch(_0x51029d){if(_0x433eb7[_0x2f18('0x2f9')]())_0x3586ac[_0x2f18('0xb4')](_0x51029d);}}}else return 0x1;}},Game_Action[_0x2f18('0x602')][_0x2f18('0x2b')]=function(_0x202909){if(this[_0x2f18('0x1d2')]()[_0x2f18('0x34f')]()===_0x202909['isActor']())return 0x0;if(this[_0x2f18('0x1b2')]()){if(_0x2f18('0x5c4')!=='PJYAx')return VisuMZ['CoreEngine']['Settings']['QoL'][_0x2f18('0x59e')]&&_0x202909[_0x2f18('0x474')]()?_0x202909[_0x2f18('0x2e9')]-0.05:_0x202909[_0x2f18('0x2e9')];else{function _0x2555f5(){const _0x53cab9=_0x2f18('0x40d');this['_colorCache']=this[_0x2f18('0x3d4')]||{};if(this[_0x2f18('0x3d4')][_0x53cab9])return this['_colorCache'][_0x53cab9];const _0x306ea6=_0xd422eb['CoreEngine'][_0x2f18('0x4d9')][_0x2f18('0x458')][_0x2f18('0x1f6')];return this[_0x2f18('0x5ee')](_0x53cab9,_0x306ea6);}}}else return this[_0x2f18('0x71')]()?_0x202909['mev']:0x0;},VisuMZ[_0x2f18('0x56f')][_0x2f18('0xe6')]=Game_BattlerBase[_0x2f18('0x602')][_0x2f18('0x26f')],Game_BattlerBase[_0x2f18('0x602')][_0x2f18('0x26f')]=function(){this[_0x2f18('0x1b1')]={},VisuMZ[_0x2f18('0x56f')]['Game_BattlerBase_initMembers'][_0x2f18('0xc9')](this);},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x57c')]=Game_BattlerBase['prototype'][_0x2f18('0x232')],Game_BattlerBase[_0x2f18('0x602')][_0x2f18('0x232')]=function(){this[_0x2f18('0x1b1')]={},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x57c')][_0x2f18('0xc9')](this);},Game_BattlerBase[_0x2f18('0x602')][_0x2f18('0x489')]=function(_0x5217b7){return this[_0x2f18('0x1b1')]=this[_0x2f18('0x1b1')]||{},this[_0x2f18('0x1b1')][_0x5217b7]!==undefined;},Game_BattlerBase[_0x2f18('0x602')][_0x2f18('0x3fc')]=function(_0x4e02b3){const _0x38ddd1=(_0x3a5ac8,_0x1ca103)=>{if(_0x2f18('0xbf')!==_0x2f18('0x273')){if(!_0x1ca103)return _0x3a5ac8;if(_0x1ca103['note'][_0x2f18('0x15b')](VisuMZ[_0x2f18('0x56f')][_0x2f18('0x179')]['paramPlus'][_0x4e02b3])){var _0x1584b4=Number(RegExp['$1']);_0x3a5ac8+=_0x1584b4;}if(_0x1ca103[_0x2f18('0x77')][_0x2f18('0x15b')](VisuMZ[_0x2f18('0x56f')][_0x2f18('0x179')][_0x2f18('0x16c')][_0x4e02b3])){var _0x1374ff=String(RegExp['$1']);try{if(_0x2f18('0x269')!==_0x2f18('0x592'))_0x3a5ac8+=eval(_0x1374ff);else{function _0x218248(){return _0x578de6[_0x2f18('0x4fe')][_0x2f18('0x23c')]();}}}catch(_0x2bc2d9){if($gameTemp['isPlaytest']())console[_0x2f18('0xb4')](_0x2bc2d9);}}return _0x3a5ac8;}else{function _0x30d30f(){this[_0x2f18('0x1ba')][_0x2f18('0x455')]['y']=0x1/this['scale']['y'],this['_pictureContainer']['y']=-(this['y']/this[_0x2f18('0x455')]['y']);}}};return this[_0x2f18('0x289')]()[_0x2f18('0x412')](_0x38ddd1,this['_paramPlus'][_0x4e02b3]);},Game_BattlerBase['prototype'][_0x2f18('0x1c9')]=function(_0x597ae3){var _0x5e2f8e=_0x2f18('0x15e')+(this[_0x2f18('0x34f')]()?_0x2f18('0x3cd'):_0x2f18('0x3c1'))+_0x2f18('0x42')+_0x597ae3;if(this[_0x2f18('0x489')](_0x5e2f8e))return this[_0x2f18('0x1b1')][_0x5e2f8e];this['_cache'][_0x5e2f8e]=eval(VisuMZ[_0x2f18('0x56f')]['Settings']['Param'][_0x5e2f8e]);const _0xd49dac=(_0x21c291,_0x157058)=>{if(_0x2f18('0x117')!==_0x2f18('0x386')){if(!_0x157058)return _0x21c291;if(_0x157058[_0x2f18('0x77')]['match'](VisuMZ[_0x2f18('0x56f')][_0x2f18('0x179')][_0x2f18('0x1c9')][_0x597ae3])){if(_0x2f18('0x1c4')===_0x2f18('0x1c4')){var _0x18b2bf=Number(RegExp['$1']);if(_0x18b2bf===0x0)_0x18b2bf=Number[_0x2f18('0x5f3')];_0x21c291=Math[_0x2f18('0x586')](_0x21c291,_0x18b2bf);}else{function _0x212340(){const _0x23e0b5=_0x2f18('0x9a');this[_0x2f18('0x3d4')]=this[_0x2f18('0x3d4')]||{};if(this[_0x2f18('0x3d4')][_0x23e0b5])return this[_0x2f18('0x3d4')][_0x23e0b5];const _0xfe28df=_0x3ef299[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x458')]['ColorPowerUp'];return this[_0x2f18('0x5ee')](_0x23e0b5,_0xfe28df);}}}if(_0x157058['note'][_0x2f18('0x15b')](VisuMZ[_0x2f18('0x56f')][_0x2f18('0x179')]['paramMaxJS'][_0x597ae3])){if(_0x2f18('0x4c1')==='FbIpp'){var _0x33c797=String(RegExp['$1']);try{_0x21c291=Math[_0x2f18('0x586')](_0x21c291,Number(eval(_0x33c797)));}catch(_0x34bbb6){if($gameTemp[_0x2f18('0x2f9')]())console['log'](_0x34bbb6);}}else{function _0x220eb1(){return _0xf357b6['layoutSettings']['StatusRect'][_0x2f18('0xc9')](this);}}}return _0x21c291;}else{function _0x27a9c7(){if(!this['_coreEasing'])return _0x2756d0;const _0x5c48ac=this[_0x2f18('0x3ea')][_0x2f18('0xb0')],_0x1a7237=this[_0x2f18('0x3ea')][_0x2f18('0x519')],_0x19ddb6=this['calcCoreEasing']((_0x1a7237-_0x5c48ac)/_0x1a7237),_0x581726=this[_0x2f18('0x300')]((_0x1a7237-_0x5c48ac+0x1)/_0x1a7237),_0x24c7f1=(_0x44650f-_0x27f19c*_0x19ddb6)/(0x1-_0x19ddb6);return _0x24c7f1+(_0x5b5a86-_0x24c7f1)*_0x581726;}}};if(this['_cache'][_0x5e2f8e]===0x0)this[_0x2f18('0x1b1')][_0x5e2f8e]=Number['MAX_SAFE_INTEGER'];return this[_0x2f18('0x1b1')][_0x5e2f8e]=this[_0x2f18('0x289')]()['reduce'](_0xd49dac,this[_0x2f18('0x1b1')][_0x5e2f8e]),this['_cache'][_0x5e2f8e];},Game_BattlerBase[_0x2f18('0x602')][_0x2f18('0x5cd')]=function(_0x1d3b8a){const _0x390186=this['traitsPi'](Game_BattlerBase[_0x2f18('0xdc')],_0x1d3b8a),_0x19ed67=(_0x1d1eba,_0x29a20e)=>{if(_0x2f18('0x37d')!==_0x2f18('0x37d')){function _0x5324f4(){if(_0x1b4deb[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0xe0')][_0x2f18('0x103')]&&_0x61a748['isKeyItem'](_0x1247b0))return;_0x1d602b[_0x2f18('0x56f')][_0x2f18('0x3d9')]['call'](this,_0x5b31d8);}}else{if(!_0x29a20e)return _0x1d1eba;if(_0x29a20e['note'][_0x2f18('0x15b')](VisuMZ[_0x2f18('0x56f')][_0x2f18('0x179')][_0x2f18('0x14c')][_0x1d3b8a])){if(_0x2f18('0x5f0')===_0x2f18('0xb9')){function _0x11486c(){if(this['_CoreEngineSettings']===_0x13cfa4)this[_0x2f18('0x576')]();if(this[_0x2f18('0x2d3')][_0x2f18('0x2de')]===_0x43b2c8)this['initCoreEngine']();this['_CoreEngineSettings']['FontSize']=_0x3d6276;}}else{var _0x4b7083=Number(RegExp['$1'])/0x64;_0x1d1eba*=_0x4b7083;}}if(_0x29a20e[_0x2f18('0x77')][_0x2f18('0x15b')](VisuMZ[_0x2f18('0x56f')][_0x2f18('0x179')][_0x2f18('0x4c0')][_0x1d3b8a])){var _0x4b7083=Number(RegExp['$1']);_0x1d1eba*=_0x4b7083;}if(_0x29a20e['note'][_0x2f18('0x15b')](VisuMZ[_0x2f18('0x56f')][_0x2f18('0x179')][_0x2f18('0x317')][_0x1d3b8a])){if('nYXxJ'!==_0x2f18('0x85')){function _0x442ef7(){var _0x177030=_0x520599(_0x262a8e['$1']);try{_0x163117+=_0x9feab5(_0x177030);}catch(_0x120d4b){if(_0x32f436[_0x2f18('0x2f9')]())_0x4b9c74[_0x2f18('0xb4')](_0x120d4b);}}}else{var _0x48dd19=String(RegExp['$1']);try{_0x1d1eba*=eval(_0x48dd19);}catch(_0x2f0a39){if($gameTemp[_0x2f18('0x2f9')]())console[_0x2f18('0xb4')](_0x2f0a39);}}}return _0x1d1eba;}};return this[_0x2f18('0x289')]()[_0x2f18('0x412')](_0x19ed67,_0x390186);},Game_BattlerBase[_0x2f18('0x602')][_0x2f18('0x378')]=function(_0x27012b){const _0x28b357=(_0x59356b,_0x8c52fa)=>{if(!_0x8c52fa)return _0x59356b;if(_0x8c52fa[_0x2f18('0x77')][_0x2f18('0x15b')](VisuMZ[_0x2f18('0x56f')]['RegExp'][_0x2f18('0x5af')][_0x27012b])){var _0x2ba95a=Number(RegExp['$1']);_0x59356b+=_0x2ba95a;}if(_0x8c52fa[_0x2f18('0x77')][_0x2f18('0x15b')](VisuMZ[_0x2f18('0x56f')][_0x2f18('0x179')][_0x2f18('0x487')][_0x27012b])){if('SBqHK'!==_0x2f18('0x480')){var _0x5aea2e=String(RegExp['$1']);try{if(_0x2f18('0x231')!==_0x2f18('0x1b'))_0x59356b+=eval(_0x5aea2e);else{function _0x42e563(){var _0x269eca=_0x22ab76-2.25/2.75;return 7.5625*_0x269eca*_0x269eca+0.9375;}}}catch(_0x5691da){if($gameTemp[_0x2f18('0x2f9')]())console[_0x2f18('0xb4')](_0x5691da);}}else{function _0x3202ff(){_0x12313a[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0xe0')]['FontShadows']?this[_0x2f18('0x55e')](_0xfb8712,_0x223c70,_0x4496a0,_0x83e8f1):_0x166048[_0x2f18('0x56f')][_0x2f18('0x2b2')][_0x2f18('0xc9')](this,_0x18d9a8,_0x26984a,_0x1d409f,_0x4ef7ec);}}}return _0x59356b;};return this[_0x2f18('0x289')]()[_0x2f18('0x412')](_0x28b357,0x0);},Game_BattlerBase[_0x2f18('0x602')]['param']=function(_0x2f14b8){let _0xe2ffff=_0x2f18('0x55b')+_0x2f14b8+_0x2f18('0x192');if(this[_0x2f18('0x489')](_0xe2ffff))return this[_0x2f18('0x1b1')][_0xe2ffff];return this[_0x2f18('0x1b1')][_0xe2ffff]=Math[_0x2f18('0x587')](VisuMZ[_0x2f18('0x56f')]['Settings'][_0x2f18('0x41a')][_0x2f18('0x5b5')][_0x2f18('0xc9')](this,_0x2f14b8)),this[_0x2f18('0x1b1')][_0xe2ffff];},Game_BattlerBase[_0x2f18('0x602')][_0x2f18('0x26d')]=function(_0x238cd7){const _0x494755=(_0x104b91,_0x2ffaa8)=>{if('jDOnc'==='jDOnc'){if(!_0x2ffaa8)return _0x104b91;if(_0x2ffaa8[_0x2f18('0x77')][_0x2f18('0x15b')](VisuMZ[_0x2f18('0x56f')][_0x2f18('0x179')][_0x2f18('0x168')][_0x238cd7])){if(_0x2f18('0x39b')!==_0x2f18('0x20d')){var _0x20824d=Number(RegExp['$1'])/0x64;_0x104b91+=_0x20824d;}else{function _0x436351(){const _0x25c32a=_0x2f18('0x3b4');this[_0x2f18('0x3d4')]=this[_0x2f18('0x3d4')]||{};if(this[_0x2f18('0x3d4')][_0x25c32a])return this[_0x2f18('0x3d4')][_0x25c32a];const _0x5f05b0=_0x5da5ae[_0x2f18('0x56f')][_0x2f18('0x4d9')]['Color'][_0x2f18('0x297')];return this[_0x2f18('0x5ee')](_0x25c32a,_0x5f05b0);}}}if(_0x2ffaa8[_0x2f18('0x77')][_0x2f18('0x15b')](VisuMZ[_0x2f18('0x56f')][_0x2f18('0x179')][_0x2f18('0x4f3')][_0x238cd7])){if(_0x2f18('0x5ce')!==_0x2f18('0x28e')){var _0x20824d=Number(RegExp['$1']);_0x104b91+=_0x20824d;}else{function _0x450225(){this['smoothSelect']((_0xc3b8b8+_0x565d10)%_0x1c91f1);}}}if(_0x2ffaa8[_0x2f18('0x77')]['match'](VisuMZ[_0x2f18('0x56f')][_0x2f18('0x179')][_0x2f18('0x275')][_0x238cd7])){var _0x4e19f3=String(RegExp['$1']);try{_0x104b91+=eval(_0x4e19f3);}catch(_0x66675f){if($gameTemp[_0x2f18('0x2f9')]())console[_0x2f18('0xb4')](_0x66675f);}}return _0x104b91;}else{function _0x50eeda(){if(_0x1f8fa7[_0x2f18('0x2f9')]())_0x57fa37[_0x2f18('0xb4')](_0x20fcc2);}}};return this[_0x2f18('0x289')]()[_0x2f18('0x412')](_0x494755,0x0);},Game_BattlerBase[_0x2f18('0x602')]['xparamRate']=function(_0x168aa3){const _0x1cefde=(_0x5705f0,_0x2e0635)=>{if(_0x2f18('0x538')===_0x2f18('0x538')){if(!_0x2e0635)return _0x5705f0;if(_0x2e0635[_0x2f18('0x77')][_0x2f18('0x15b')](VisuMZ['CoreEngine'][_0x2f18('0x179')][_0x2f18('0x2ee')][_0x168aa3])){if(_0x2f18('0x3b9')===_0x2f18('0x28d')){function _0xc577a2(){const _0x727dce=_0x53e18e[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x1fd')],_0x2660f9=_0x727dce[_0x2f18('0x2fc')],_0xa356c=this[_0x2f18('0x379')](_0xa37a7c),_0x24c653=this[_0x2f18('0x379')](_0x338f07);return _0x2660f9[_0x2f18('0x1fe')](_0xa356c,_0x24c653);}}else{var _0xb97610=Number(RegExp['$1'])/0x64;_0x5705f0*=_0xb97610;}}if(_0x2e0635[_0x2f18('0x77')][_0x2f18('0x15b')](VisuMZ[_0x2f18('0x56f')]['RegExp'][_0x2f18('0x326')][_0x168aa3])){if(_0x2f18('0x558')===_0x2f18('0x177')){function _0x55d8b1(){const _0x382405=_0x4bf7ba[_0x2f18('0x4f5')]['uiAreaWidth'],_0x5e35e7=_0x218ec8['advanced'][_0x2f18('0x2e4')],_0x29a906=_0x5384cd[_0x2f18('0x56f')]['Settings']['UI'][_0x2f18('0x2bb')];_0x13682b['boxWidth']=_0x382405-_0x29a906*0x2,_0x26f304[_0x2f18('0x473')]=_0x5e35e7-_0x29a906*0x2,this[_0x2f18('0x1ae')]();}}else{var _0xb97610=Number(RegExp['$1']);_0x5705f0*=_0xb97610;}}if(_0x2e0635[_0x2f18('0x77')][_0x2f18('0x15b')](VisuMZ[_0x2f18('0x56f')][_0x2f18('0x179')][_0x2f18('0x5a2')][_0x168aa3])){var _0x1e3256=String(RegExp['$1']);try{if(_0x2f18('0x2f7')!==_0x2f18('0x2f7')){function _0xe02aa0(){var _0x32fe1b=_0x362da1(_0x3b3ed1['$1']);try{_0x2f2239*=_0x3c872a(_0x32fe1b);}catch(_0x32ca14){if(_0x3d37a0[_0x2f18('0x2f9')]())_0x18ba9a['log'](_0x32ca14);}}}else _0x5705f0*=eval(_0x1e3256);}catch(_0x5ae36d){if($gameTemp[_0x2f18('0x2f9')]())console['log'](_0x5ae36d);}}return _0x5705f0;}else{function _0x24bcc5(){const _0x1e52aa=_0x2f18('0x183');this[_0x2f18('0x3d4')]=this[_0x2f18('0x3d4')]||{};if(this[_0x2f18('0x3d4')][_0x1e52aa])return this[_0x2f18('0x3d4')][_0x1e52aa];const _0x4bd44a=_0x5c35ac['CoreEngine'][_0x2f18('0x4d9')][_0x2f18('0x458')][_0x2f18('0x384')];return this[_0x2f18('0x5ee')](_0x1e52aa,_0x4bd44a);}}};return this[_0x2f18('0x289')]()[_0x2f18('0x412')](_0x1cefde,0x1);},Game_BattlerBase['prototype'][_0x2f18('0x1de')]=function(_0x260542){const _0x146493=(_0x3e3c6f,_0x50732c)=>{if(!_0x50732c)return _0x3e3c6f;if(_0x50732c[_0x2f18('0x77')][_0x2f18('0x15b')](VisuMZ[_0x2f18('0x56f')][_0x2f18('0x179')][_0x2f18('0x520')][_0x260542])){if(_0x2f18('0x33d')===_0x2f18('0x33d')){var _0x11fafe=Number(RegExp['$1'])/0x64;_0x3e3c6f+=_0x11fafe;}else{function _0x2ec948(){this[_0x2f18('0x1b0')](_0x5d3537['min'](this[_0x2f18('0x3b2')](),0x0));}}}if(_0x50732c[_0x2f18('0x77')][_0x2f18('0x15b')](VisuMZ[_0x2f18('0x56f')]['RegExp'][_0x2f18('0x482')][_0x260542])){if(_0x2f18('0x4ac')!==_0x2f18('0x4ac')){function _0x555b07(){this[_0x2f18('0x65')][_0x2f18('0x313')]+=0x6;}}else{var _0x11fafe=Number(RegExp['$1']);_0x3e3c6f+=_0x11fafe;}}if(_0x50732c[_0x2f18('0x77')][_0x2f18('0x15b')](VisuMZ[_0x2f18('0x56f')]['RegExp'][_0x2f18('0x247')][_0x260542])){var _0x134521=String(RegExp['$1']);try{if(_0x2f18('0x3fe')!==_0x2f18('0x163'))_0x3e3c6f+=eval(_0x134521);else{function _0x335194(){return _0x1c486a[_0x2f18('0x526')][_0x2f18('0x42a')][_0x2f18('0xc9')](this);}}}catch(_0x500dce){if($gameTemp['isPlaytest']())console[_0x2f18('0xb4')](_0x500dce);}}return _0x3e3c6f;};return this[_0x2f18('0x289')]()[_0x2f18('0x412')](_0x146493,0x0);},Game_BattlerBase[_0x2f18('0x602')][_0x2f18('0x4ec')]=function(_0x33a180){let _0x7d5bc1=_0x2f18('0x4ec')+_0x33a180+'Total';if(this[_0x2f18('0x489')](_0x7d5bc1))return this[_0x2f18('0x1b1')][_0x7d5bc1];return this['_cache'][_0x7d5bc1]=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x41a')][_0x2f18('0x418')]['call'](this,_0x33a180),this[_0x2f18('0x1b1')][_0x7d5bc1];},Game_BattlerBase['prototype'][_0x2f18('0x9')]=function(_0x1175e6){const _0x49a356=(_0x2920b8,_0x41e69e)=>{if(_0x2f18('0x3d1')!==_0x2f18('0x1ed')){if(!_0x41e69e)return _0x2920b8;if(_0x41e69e[_0x2f18('0x77')][_0x2f18('0x15b')](VisuMZ[_0x2f18('0x56f')][_0x2f18('0x179')]['sparamPlus1'][_0x1175e6])){if(_0x2f18('0x2a3')!=='bAnEb'){var _0x4b1857=Number(RegExp['$1'])/0x64;_0x2920b8+=_0x4b1857;}else{function _0xaa7bdf(){try{_0x467a95[_0x2f18('0x56f')][_0x2f18('0x132')]['call'](this,_0x76a6c1);}catch(_0x3b9f5a){_0x1ac0ec[_0x2f18('0x2f9')]()&&(_0x15c691[_0x2f18('0xb4')]('Conditional\x20Branch\x20Script\x20Error'),_0x3d4347['log'](_0x3b9f5a)),this['skipBranch']();}return!![];}}}if(_0x41e69e[_0x2f18('0x77')][_0x2f18('0x15b')](VisuMZ[_0x2f18('0x56f')][_0x2f18('0x179')]['sparamPlus2'][_0x1175e6])){var _0x4b1857=Number(RegExp['$1']);_0x2920b8+=_0x4b1857;}if(_0x41e69e[_0x2f18('0x77')][_0x2f18('0x15b')](VisuMZ[_0x2f18('0x56f')][_0x2f18('0x179')][_0x2f18('0x1ff')][_0x1175e6])){if('rNkqI'!==_0x2f18('0x413')){var _0x3ed29c=String(RegExp['$1']);try{if(_0x2f18('0x5c1')!==_0x2f18('0xf9'))_0x2920b8+=eval(_0x3ed29c);else{function _0x296fb1(){this['createFauxAnimationSprite'](_0x4a1619,_0x39bdf9,_0x108166,_0x11cb0c,_0x977f29);}}}catch(_0x21ceb6){if($gameTemp[_0x2f18('0x2f9')]())console['log'](_0x21ceb6);}}else{function _0x22c7e6(){var _0x12f03f=_0x37178a(_0x48039b['$1']);try{_0x4fd359+=_0x37e941(_0x12f03f);}catch(_0x286836){if(_0x250d1d[_0x2f18('0x2f9')]())_0x124f23[_0x2f18('0xb4')](_0x286836);}}}}return _0x2920b8;}else{function _0x2b25d2(){switch(_0x15b39c[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0xe0')][_0x2f18('0x59')]){case _0x2f18('0x78'):return!![];case _0x2f18('0x340'):return![];default:return _0x9a4125[_0x2f18('0x56f')][_0x2f18('0x31b')][_0x2f18('0xc9')](this);}}}};return this[_0x2f18('0x289')]()['reduce'](_0x49a356,0x0);},Game_BattlerBase['prototype'][_0x2f18('0x2a')]=function(_0x210761){const _0x1a31c3=(_0x157bed,_0x438c7e)=>{if(!_0x438c7e)return _0x157bed;if(_0x438c7e[_0x2f18('0x77')][_0x2f18('0x15b')](VisuMZ[_0x2f18('0x56f')][_0x2f18('0x179')][_0x2f18('0x47b')][_0x210761])){var _0x4c5d2a=Number(RegExp['$1'])/0x64;_0x157bed*=_0x4c5d2a;}if(_0x438c7e[_0x2f18('0x77')][_0x2f18('0x15b')](VisuMZ[_0x2f18('0x56f')][_0x2f18('0x179')]['sparamRate2'][_0x210761])){var _0x4c5d2a=Number(RegExp['$1']);_0x157bed*=_0x4c5d2a;}if(_0x438c7e[_0x2f18('0x77')][_0x2f18('0x15b')](VisuMZ[_0x2f18('0x56f')][_0x2f18('0x179')][_0x2f18('0x3e0')][_0x210761])){var _0x4f8681=String(RegExp['$1']);try{_0x157bed*=eval(_0x4f8681);}catch(_0x37a0b2){if($gameTemp[_0x2f18('0x2f9')]())console[_0x2f18('0xb4')](_0x37a0b2);}}return _0x157bed;};return this[_0x2f18('0x289')]()[_0x2f18('0x412')](_0x1a31c3,0x1);},Game_BattlerBase[_0x2f18('0x602')]['sparamFlatBonus']=function(_0x489298){const _0x4676ea=(_0xfd435a,_0x6309f5)=>{if(!_0x6309f5)return _0xfd435a;if(_0x6309f5[_0x2f18('0x77')]['match'](VisuMZ[_0x2f18('0x56f')]['RegExp'][_0x2f18('0x3cf')][_0x489298])){var _0x43212e=Number(RegExp['$1'])/0x64;_0xfd435a+=_0x43212e;}if(_0x6309f5[_0x2f18('0x77')][_0x2f18('0x15b')](VisuMZ['CoreEngine']['RegExp'][_0x2f18('0x323')][_0x489298])){if(_0x2f18('0x2a4')!=='ZjUWY'){function _0x6a8670(){return this['subject']()[_0x2f18('0x199')];}}else{var _0x43212e=Number(RegExp['$1']);_0xfd435a+=_0x43212e;}}if(_0x6309f5[_0x2f18('0x77')]['match'](VisuMZ[_0x2f18('0x56f')][_0x2f18('0x179')][_0x2f18('0x38e')][_0x489298])){var _0x1727c6=String(RegExp['$1']);try{if(_0x2f18('0x22b')==='WKnBz'){function _0x9d91b0(){var _0x389c31=_0x4d3916[_0x2f18('0x3b6')](_0xb60487*0x2-0x1,_0x2f18('0x537'))*0.5+0.5;}}else _0xfd435a+=eval(_0x1727c6);}catch(_0x2b1933){if($gameTemp[_0x2f18('0x2f9')]())console[_0x2f18('0xb4')](_0x2b1933);}}return _0xfd435a;};return this['traitObjects']()[_0x2f18('0x412')](_0x4676ea,0x0);},Game_BattlerBase['prototype']['sparam']=function(_0x10cef1){let _0x429b20=_0x2f18('0x322')+_0x10cef1+_0x2f18('0x192');if(this[_0x2f18('0x489')](_0x429b20))return this[_0x2f18('0x1b1')][_0x429b20];return this[_0x2f18('0x1b1')][_0x429b20]=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x41a')]['SParameterFormula'][_0x2f18('0xc9')](this,_0x10cef1),this[_0x2f18('0x1b1')][_0x429b20];},Game_BattlerBase[_0x2f18('0x602')][_0x2f18('0x124')]=function(_0x5ca773,_0x3e865a){if(typeof paramId===_0x2f18('0x248'))return this[_0x2f18('0x55b')](_0x5ca773);_0x5ca773=String(_0x5ca773||'')[_0x2f18('0x2a0')]();if(_0x5ca773===_0x2f18('0x89'))return this[_0x2f18('0x55b')](0x0);if(_0x5ca773===_0x2f18('0x3dd'))return this[_0x2f18('0x55b')](0x1);if(_0x5ca773===_0x2f18('0x50'))return this[_0x2f18('0x55b')](0x2);if(_0x5ca773==='DEF')return this[_0x2f18('0x55b')](0x3);if(_0x5ca773===_0x2f18('0x1d'))return this[_0x2f18('0x55b')](0x4);if(_0x5ca773===_0x2f18('0x2d5'))return this[_0x2f18('0x55b')](0x5);if(_0x5ca773===_0x2f18('0x40b'))return this[_0x2f18('0x55b')](0x6);if(_0x5ca773===_0x2f18('0xc4'))return this['param'](0x7);if(_0x5ca773===_0x2f18('0xc'))return _0x3e865a?String(Math['round'](this[_0x2f18('0x4ec')](0x0)*0x64))+'%':this['xparam'](0x0);if(_0x5ca773==='EVA')return _0x3e865a?String(Math[_0x2f18('0x587')](this['xparam'](0x1)*0x64))+'%':this[_0x2f18('0x4ec')](0x1);if(_0x5ca773===_0x2f18('0x42c'))return _0x3e865a?String(Math[_0x2f18('0x587')](this[_0x2f18('0x4ec')](0x2)*0x64))+'%':this[_0x2f18('0x4ec')](0x2);if(_0x5ca773===_0x2f18('0xe8'))return _0x3e865a?String(Math[_0x2f18('0x587')](this[_0x2f18('0x4ec')](0x3)*0x64))+'%':this[_0x2f18('0x4ec')](0x3);if(_0x5ca773==='MEV')return _0x3e865a?String(Math[_0x2f18('0x587')](this[_0x2f18('0x4ec')](0x4)*0x64))+'%':this[_0x2f18('0x4ec')](0x4);if(_0x5ca773===_0x2f18('0x20a'))return _0x3e865a?String(Math[_0x2f18('0x587')](this[_0x2f18('0x4ec')](0x5)*0x64))+'%':this[_0x2f18('0x4ec')](0x5);if(_0x5ca773==='CNT')return _0x3e865a?String(Math['round'](this[_0x2f18('0x4ec')](0x6)*0x64))+'%':this[_0x2f18('0x4ec')](0x6);if(_0x5ca773===_0x2f18('0x559'))return _0x3e865a?String(Math[_0x2f18('0x587')](this['xparam'](0x7)*0x64))+'%':this['xparam'](0x7);if(_0x5ca773===_0x2f18('0x3df'))return _0x3e865a?String(Math[_0x2f18('0x587')](this[_0x2f18('0x4ec')](0x8)*0x64))+'%':this[_0x2f18('0x4ec')](0x8);if(_0x5ca773==='TRG')return _0x3e865a?String(Math[_0x2f18('0x587')](this[_0x2f18('0x4ec')](0x9)*0x64))+'%':this[_0x2f18('0x4ec')](0x9);if(_0x5ca773===_0x2f18('0x3f1'))return _0x3e865a?String(Math['round'](this[_0x2f18('0x322')](0x0)*0x64))+'%':this[_0x2f18('0x322')](0x0);if(_0x5ca773==='GRD')return _0x3e865a?String(Math[_0x2f18('0x587')](this[_0x2f18('0x322')](0x1)*0x64))+'%':this[_0x2f18('0x322')](0x1);if(_0x5ca773===_0x2f18('0x2c4'))return _0x3e865a?String(Math[_0x2f18('0x587')](this['sparam'](0x2)*0x64))+'%':this['sparam'](0x2);if(_0x5ca773===_0x2f18('0x20e'))return _0x3e865a?String(Math[_0x2f18('0x587')](this[_0x2f18('0x322')](0x3)*0x64))+'%':this[_0x2f18('0x322')](0x3);if(_0x5ca773===_0x2f18('0x96'))return _0x3e865a?String(Math[_0x2f18('0x587')](this[_0x2f18('0x322')](0x4)*0x64))+'%':this[_0x2f18('0x322')](0x4);if(_0x5ca773===_0x2f18('0x1c3'))return _0x3e865a?String(Math[_0x2f18('0x587')](this['sparam'](0x5)*0x64))+'%':this[_0x2f18('0x322')](0x5);if(_0x5ca773==='PDR')return _0x3e865a?String(Math[_0x2f18('0x587')](this[_0x2f18('0x322')](0x6)*0x64))+'%':this[_0x2f18('0x322')](0x6);if(_0x5ca773===_0x2f18('0x31c'))return _0x3e865a?String(Math['round'](this[_0x2f18('0x322')](0x7)*0x64))+'%':this['sparam'](0x7);if(_0x5ca773===_0x2f18('0x374'))return _0x3e865a?String(Math[_0x2f18('0x587')](this[_0x2f18('0x322')](0x8)*0x64))+'%':this['sparam'](0x8);if(_0x5ca773===_0x2f18('0x293'))return _0x3e865a?String(Math['round'](this[_0x2f18('0x322')](0x9)*0x64))+'%':this[_0x2f18('0x322')](0x9);return'';},Game_BattlerBase[_0x2f18('0x602')][_0x2f18('0x366')]=function(){return this[_0x2f18('0x444')]()&&this[_0x2f18('0x55f')]<this[_0x2f18('0x5d8')]*VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x41a')]['CrisisRate'];},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x5c3')]=Game_Actor[_0x2f18('0x602')][_0x2f18('0x477')],Game_Actor[_0x2f18('0x602')][_0x2f18('0x477')]=function(_0x309387){if(this[_0x2f18('0x32')]>0x63)return this[_0x2f18('0x5f9')](_0x309387);return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x5c3')][_0x2f18('0xc9')](this,_0x309387);},Game_Actor['prototype'][_0x2f18('0x5f9')]=function(_0x10df35){const _0x50c12f=this[_0x2f18('0xd5')]()[_0x2f18('0x1a7')][_0x10df35][0x63],_0x127bba=this['currentClass']()['params'][_0x10df35][0x62];return _0x50c12f+(_0x50c12f-_0x127bba)*(this[_0x2f18('0x32')]-0x63);},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x1f3')]=Game_Actor[_0x2f18('0x602')][_0x2f18('0x39e')],Game_Actor[_0x2f18('0x602')][_0x2f18('0x39e')]=function(_0x285db4,_0x3f6782){$gameTemp[_0x2f18('0x513')]=!![],VisuMZ[_0x2f18('0x56f')][_0x2f18('0x1f3')]['call'](this,_0x285db4,_0x3f6782),$gameTemp['_changingClass']=undefined;},VisuMZ['CoreEngine'][_0x2f18('0x583')]=Game_Actor[_0x2f18('0x602')][_0x2f18('0xf1')],Game_Actor[_0x2f18('0x602')][_0x2f18('0xf1')]=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x583')]['call'](this);if(!$gameTemp[_0x2f18('0x513')])this[_0x2f18('0x13c')]();},Game_Actor[_0x2f18('0x602')]['levelUpRecovery']=function(){this['_cache']={};if(VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0xe0')]['LevelUpFullHp'])this[_0x2f18('0x55f')]=this[_0x2f18('0x5d8')];if(VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0xe0')][_0x2f18('0xaf')])this[_0x2f18('0x1f9')]=this['mmp'];},Game_Actor[_0x2f18('0x602')][_0x2f18('0x49f')]=function(){if(this['isMaxLevel']())return 0x1;const _0x50e90f=this[_0x2f18('0x3d8')]()-this[_0x2f18('0x351')](),_0x40aa5b=this[_0x2f18('0x38')]()-this[_0x2f18('0x351')]();return(_0x40aa5b/_0x50e90f)[_0x2f18('0x5e2')](0x0,0x1);},Game_Actor[_0x2f18('0x602')][_0x2f18('0x289')]=function(){const _0x20d550=Game_Battler[_0x2f18('0x602')][_0x2f18('0x289')][_0x2f18('0xc9')](this);for(const _0x4153c0 of this[_0x2f18('0x5f8')]()){if(_0x4153c0){if(_0x2f18('0x411')!==_0x2f18('0x411')){function _0x8beb37(){_0x187ff2[_0x2f18('0x56f')][_0x2f18('0x29c')]['call'](this,_0x11a87c);}}else _0x20d550[_0x2f18('0x2c9')](_0x4153c0);}}return _0x20d550['push'](this[_0x2f18('0xd5')](),this[_0x2f18('0x3b3')]()),_0x20d550;},Object['defineProperty'](Game_Enemy['prototype'],_0x2f18('0x32'),{'get':function(){return this[_0x2f18('0x30a')]();},'configurable':!![]}),Game_Enemy['prototype'][_0x2f18('0x30a')]=function(){return this[_0x2f18('0x1fc')]()['level'];},Game_Enemy[_0x2f18('0x602')]['moveRelativeToResolutionChange']=function(){if(!this[_0x2f18('0x5eb')]){this[_0x2f18('0x27a')]+=Math[_0x2f18('0x587')]((Graphics[_0x2f18('0x1c6')]-0x270)/0x2),this[_0x2f18('0x27a')]-=Math[_0x2f18('0x598')]((Graphics[_0x2f18('0x1c6')]-Graphics['boxHeight'])/0x2);if($gameSystem[_0x2f18('0x342')]()){if(_0x2f18('0x243')!==_0x2f18('0x243')){function _0x3fa693(){_0x55edb2+=_0x260bad;if(_0x4cae32>=_0x20621d)_0x32b1ac=_0x315eb9-0x1;this[_0x2f18('0x1b0')](_0x2fde57);}}else this['_screenX']-=Math['floor']((Graphics[_0x2f18('0x410')]-Graphics[_0x2f18('0x21f')])/0x2);}else{if(_0x2f18('0x5d1')!=='QrrHj'){function _0x36ec87(){return _0x258c08[_0x2f18('0x602')][_0x2f18('0x5e')][_0x2f18('0xc9')](this)+_0x57c00d[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x1e8')][_0x2f18('0xb2')];;}}else this[_0x2f18('0x3a2')]+=Math['round']((Graphics['boxWidth']-0x330)/0x2);}}this[_0x2f18('0x5eb')]=!![];},Game_Party['prototype'][_0x2f18('0x43c')]=function(){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x26')][_0x2f18('0x1be')];},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x3d9')]=Game_Party[_0x2f18('0x602')][_0x2f18('0x4d3')],Game_Party[_0x2f18('0x602')][_0x2f18('0x4d3')]=function(_0x17cb8f){if(VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0xe0')][_0x2f18('0x103')]&&DataManager[_0x2f18('0x3fa')](_0x17cb8f))return;VisuMZ[_0x2f18('0x56f')][_0x2f18('0x3d9')][_0x2f18('0xc9')](this,_0x17cb8f);},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x316')]=Game_Map['prototype'][_0x2f18('0x15')],Game_Map[_0x2f18('0x602')][_0x2f18('0x15')]=function(_0x5739d1){VisuMZ[_0x2f18('0x56f')]['Game_Map_setup'][_0x2f18('0xc9')](this,_0x5739d1),this[_0x2f18('0x4bf')](_0x5739d1);},Game_Map[_0x2f18('0x602')][_0x2f18('0x4bf')]=function(){this[_0x2f18('0x456')]=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['QoL'][_0x2f18('0x224')]||![];if($dataMap&&$dataMap[_0x2f18('0x77')]){if($dataMap[_0x2f18('0x77')][_0x2f18('0x15b')](/<SHOW TILE SHADOWS>/i))this[_0x2f18('0x456')]=![];if($dataMap[_0x2f18('0x77')][_0x2f18('0x15b')](/<HIDE TILE SHADOWS>/i))this['_hideTileShadows']=!![];}},Game_Map[_0x2f18('0x602')][_0x2f18('0x51a')]=function(){if(this[_0x2f18('0x456')]===undefined)this[_0x2f18('0x4bf')]();return this[_0x2f18('0x456')];},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x443')]=Game_Character['prototype'][_0x2f18('0x584')],Game_Character['prototype'][_0x2f18('0x584')]=function(_0x3042b1){try{if(_0x2f18('0x4d6')!==_0x2f18('0x4d6')){function _0x190a75(){_0x12a3a0[_0x2f18('0x4e2')]=0x0,_0x12fd69[_0x2f18('0x53e')]=0x0,_0x37685[_0x2f18('0x29f')]=0x0,_0x1a0107[_0x2f18('0x134')]=0x0;}}else VisuMZ[_0x2f18('0x56f')][_0x2f18('0x443')][_0x2f18('0xc9')](this,_0x3042b1);}catch(_0x66a53e){if($gameTemp['isPlaytest']())console[_0x2f18('0xb4')](_0x66a53e);}},Game_Player[_0x2f18('0x602')]['makeEncounterCount']=function(){const _0x363726=$gameMap[_0x2f18('0x493')]();this[_0x2f18('0x4f9')]=Math[_0x2f18('0x3f8')](_0x363726)+Math['randomInt'](_0x363726)+this[_0x2f18('0x25a')]();},Game_Player[_0x2f18('0x602')][_0x2f18('0x25a')]=function(){if($dataMap&&$dataMap[_0x2f18('0x77')]&&$dataMap[_0x2f18('0x77')][_0x2f18('0x15b')](/<MINIMUM ENCOUNTER STEPS:[ ](\d+)>/i))return Number(RegExp['$1']);else{if(_0x2f18('0x532')===_0x2f18('0x2e3')){function _0x50e8ae(){return this[_0x2f18('0x307')]()?this[_0x2f18('0x161')]():0x0;}}else return VisuMZ['CoreEngine'][_0x2f18('0x4d9')][_0x2f18('0xe0')][_0x2f18('0x46a')];}},VisuMZ['CoreEngine'][_0x2f18('0x147')]=Game_Event['prototype'][_0x2f18('0x189')],Game_Event[_0x2f18('0x602')][_0x2f18('0x189')]=function(_0x480e61,_0x37d27f){return this[_0x2f18('0x4ad')]()?this[_0x2f18('0x1b4')](_0x480e61,_0x37d27f):VisuMZ[_0x2f18('0x56f')][_0x2f18('0x147')][_0x2f18('0xc9')](this,_0x480e61,_0x37d27f);},Game_Event['prototype'][_0x2f18('0x4ad')]=function(){return VisuMZ['CoreEngine'][_0x2f18('0x4d9')][_0x2f18('0xe0')]['SmartEventCollisionPriority'];},Game_Event[_0x2f18('0x602')][_0x2f18('0x1b4')]=function(_0x4debb9,_0x44fe0a){if(!this[_0x2f18('0x42e')]())return![];else{const _0x190504=$gameMap[_0x2f18('0x68')](_0x4debb9,_0x44fe0a)[_0x2f18('0x234')](_0x4740ca=>_0x4740ca[_0x2f18('0x42e')]());return _0x190504[_0x2f18('0xc7')]>0x0;}},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x132')]=Game_Interpreter['prototype'][_0x2f18('0x578')],Game_Interpreter['prototype']['command111']=function(_0x2aed16){try{VisuMZ['CoreEngine'][_0x2f18('0x132')][_0x2f18('0xc9')](this,_0x2aed16);}catch(_0x31ef7c){$gameTemp[_0x2f18('0x2f9')]()&&(console[_0x2f18('0xb4')](_0x2f18('0x119')),console[_0x2f18('0xb4')](_0x31ef7c)),this[_0x2f18('0x298')]();}return!![];},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x5b8')]=Game_Interpreter[_0x2f18('0x602')][_0x2f18('0x312')],Game_Interpreter[_0x2f18('0x602')][_0x2f18('0x312')]=function(_0x4c4ee2){try{VisuMZ['CoreEngine']['Game_Interpreter_command122'][_0x2f18('0xc9')](this,_0x4c4ee2);}catch(_0x45cab2){$gameTemp[_0x2f18('0x2f9')]()&&(console[_0x2f18('0xb4')](_0x2f18('0x227')),console[_0x2f18('0xb4')](_0x45cab2));}return!![];},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x2d6')]=Game_Interpreter[_0x2f18('0x602')]['command355'],Game_Interpreter[_0x2f18('0x602')][_0x2f18('0xae')]=function(){try{if(_0x2f18('0x350')!==_0x2f18('0x329'))VisuMZ[_0x2f18('0x56f')][_0x2f18('0x2d6')][_0x2f18('0xc9')](this);else{function _0x38aa0e(){const _0x432bda=_0x36518f[_0x2f18('0x3be')](_0x2f18('0x3e5')),_0x24bde8=_0x511bf6[_0x2f18('0x34a')],_0x52fa51=_0x480540['iconHeight'],_0x2cdcc3=_0x56ebbd%0x10*_0x24bde8,_0x5d8aa6=_0x31d779[_0x2f18('0x598')](_0x2ed17e/0x10)*_0x52fa51,_0x167582=_0x97c399,_0x573546=_0x3790c1;this[_0x2f18('0x65')][_0x2f18('0x2b8')]['imageSmoothingEnabled']=_0x2c5a12,this[_0x2f18('0x65')][_0x2f18('0x601')](_0x432bda,_0x2cdcc3,_0x5d8aa6,_0x24bde8,_0x52fa51,_0xc57215,_0x31c3d0,_0x167582,_0x573546),this[_0x2f18('0x65')][_0x2f18('0x2b8')][_0x2f18('0x4e0')]=!![];}}}catch(_0x1436d4){if(_0x2f18('0xe7')!==_0x2f18('0xe7')){function _0x544943(){return _0x2d318f['layoutSettings'][_0x2f18('0x52f')][_0x2f18('0xc9')](this);}}else $gameTemp[_0x2f18('0x2f9')]()&&(console[_0x2f18('0xb4')](_0x2f18('0x18a')),console[_0x2f18('0xb4')](_0x1436d4));}return!![];},VisuMZ[_0x2f18('0x56f')]['Game_Interpreter_PluginCommand']=Game_Interpreter[_0x2f18('0x602')][_0x2f18('0x490')],Game_Interpreter[_0x2f18('0x602')][_0x2f18('0x490')]=function(_0x33bf90){return $gameTemp[_0x2f18('0x58')](this),VisuMZ[_0x2f18('0x56f')][_0x2f18('0x408')][_0x2f18('0xc9')](this,_0x33bf90);},Scene_Base[_0x2f18('0x602')][_0x2f18('0x4')]=function(){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['UI'][_0x2f18('0x2f8')];},Scene_Base[_0x2f18('0x602')][_0x2f18('0x307')]=function(){return VisuMZ[_0x2f18('0x56f')]['Settings']['UI']['BottomHelp'];},Scene_Base['prototype'][_0x2f18('0x198')]=function(){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['UI']['BottomButtons'];},Scene_Base[_0x2f18('0x602')][_0x2f18('0x61')]=function(){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['UI'][_0x2f18('0x252')];},Scene_Base[_0x2f18('0x602')][_0x2f18('0x396')]=function(){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['UI'][_0x2f18('0x6b')];},Scene_Base[_0x2f18('0x602')]['buttonAreaHeight']=function(){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['UI'][_0x2f18('0x138')];},Scene_Base['prototype'][_0x2f18('0x23c')]=function(){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x1e8')][_0x2f18('0x5a7')];},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x599')]=Scene_Base[_0x2f18('0x602')][_0x2f18('0x206')],Scene_Base[_0x2f18('0x602')][_0x2f18('0x206')]=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x599')][_0x2f18('0xc9')](this),this[_0x2f18('0x423')]();},Scene_Base[_0x2f18('0x602')]['createButtonAssistWindow']=function(){},Scene_Base[_0x2f18('0x602')]['buttonAssistKey1']=function(){return TextManager['getInputMultiButtonStrings'](_0x2f18('0x35d'),_0x2f18('0x98'));},Scene_Base['prototype'][_0x2f18('0x345')]=function(){return TextManager['getInputButtonString'](_0x2f18('0x57e'));},Scene_Base[_0x2f18('0x602')][_0x2f18('0x2c3')]=function(){return TextManager[_0x2f18('0x379')](_0x2f18('0x4fd'));},Scene_Base[_0x2f18('0x602')][_0x2f18('0x251')]=function(){return TextManager[_0x2f18('0x379')]('ok');},Scene_Base[_0x2f18('0x602')]['buttonAssistKey5']=function(){return TextManager['getInputButtonString']('cancel');},Scene_Base[_0x2f18('0x602')][_0x2f18('0x6d')]=function(){if(this['_pageupButton']&&this[_0x2f18('0x79')][_0x2f18('0x43d')]){if('haDVc'!==_0x2f18('0xab')){function _0x4c986b(){if(_0x2390df['CoreEngine']['Settings'][_0x2f18('0xe0')][_0x2f18('0x25c')])this[_0x2f18('0x50a')]();else return _0x4ca687[_0x2f18('0x56f')][_0x2f18('0x2ba')][_0x2f18('0xc9')](this);}}else return TextManager[_0x2f18('0x21e')];}else{if(_0x2f18('0xa6')!=='SVwhc')return'';else{function _0x4b86f0(){if(typeof _0x5189f8===_0x2f18('0x248'))return this[_0x2f18('0x55b')](_0x351085);_0x2d5568=_0x2c6906(_0x1f3460||'')[_0x2f18('0x2a0')]();if(_0x21eb81===_0x2f18('0x89'))return this[_0x2f18('0x55b')](0x0);if(_0x2e2935==='MAXMP')return this['param'](0x1);if(_0x46fa78===_0x2f18('0x50'))return this[_0x2f18('0x55b')](0x2);if(_0x5e862d===_0x2f18('0x5a3'))return this[_0x2f18('0x55b')](0x3);if(_0x306afd===_0x2f18('0x1d'))return this[_0x2f18('0x55b')](0x4);if(_0x525ed7===_0x2f18('0x2d5'))return this['param'](0x5);if(_0x1bf24a===_0x2f18('0x40b'))return this[_0x2f18('0x55b')](0x6);if(_0x20aa15===_0x2f18('0xc4'))return this[_0x2f18('0x55b')](0x7);if(_0x96c067===_0x2f18('0xc'))return _0x547be2?_0x2d7aef(_0x49b070[_0x2f18('0x587')](this[_0x2f18('0x4ec')](0x0)*0x64))+'%':this[_0x2f18('0x4ec')](0x0);if(_0x540e34===_0x2f18('0x590'))return _0x233ab0?_0x1dd2b5(_0x5c56f9[_0x2f18('0x587')](this[_0x2f18('0x4ec')](0x1)*0x64))+'%':this['xparam'](0x1);if(_0x12f9d4===_0x2f18('0x42c'))return _0x125894?_0x21112a(_0x49271f[_0x2f18('0x587')](this['xparam'](0x2)*0x64))+'%':this[_0x2f18('0x4ec')](0x2);if(_0x367b73===_0x2f18('0xe8'))return _0x480ab0?_0x2ebb75(_0x319f36[_0x2f18('0x587')](this['xparam'](0x3)*0x64))+'%':this[_0x2f18('0x4ec')](0x3);if(_0x45a7ef==='MEV')return _0x548b6c?_0x1d1118(_0x940d14['round'](this[_0x2f18('0x4ec')](0x4)*0x64))+'%':this[_0x2f18('0x4ec')](0x4);if(_0x53ff02==='MRF')return _0x1990ce?_0x2139e7(_0x621c57[_0x2f18('0x587')](this['xparam'](0x5)*0x64))+'%':this[_0x2f18('0x4ec')](0x5);if(_0x4f3245===_0x2f18('0x56b'))return _0x1f9ffc?_0x26ffa9(_0x558c08[_0x2f18('0x587')](this[_0x2f18('0x4ec')](0x6)*0x64))+'%':this[_0x2f18('0x4ec')](0x6);if(_0x213db2===_0x2f18('0x559'))return _0x5b4d16?_0x1fb8de(_0x384562[_0x2f18('0x587')](this[_0x2f18('0x4ec')](0x7)*0x64))+'%':this[_0x2f18('0x4ec')](0x7);if(_0x537110===_0x2f18('0x3df'))return _0x59a9a7?_0x5a4a59(_0x2e2849[_0x2f18('0x587')](this['xparam'](0x8)*0x64))+'%':this[_0x2f18('0x4ec')](0x8);if(_0x3fdd35===_0x2f18('0x454'))return _0x2cc465?_0x3613d3(_0x1b94e9[_0x2f18('0x587')](this[_0x2f18('0x4ec')](0x9)*0x64))+'%':this[_0x2f18('0x4ec')](0x9);if(_0xe16a6a===_0x2f18('0x3f1'))return _0x5ef3f8?_0x19c379(_0x476b7b[_0x2f18('0x587')](this[_0x2f18('0x322')](0x0)*0x64))+'%':this[_0x2f18('0x322')](0x0);if(_0x1a87d1===_0x2f18('0x94'))return _0x349bb9?_0x3c91e4(_0x535806[_0x2f18('0x587')](this[_0x2f18('0x322')](0x1)*0x64))+'%':this[_0x2f18('0x322')](0x1);if(_0x327ded===_0x2f18('0x2c4'))return _0x540c60?_0x5a1712(_0x1602ce['round'](this[_0x2f18('0x322')](0x2)*0x64))+'%':this[_0x2f18('0x322')](0x2);if(_0x164af5===_0x2f18('0x20e'))return _0x4d0b6f?_0x172fcb(_0x2ba7c3[_0x2f18('0x587')](this[_0x2f18('0x322')](0x3)*0x64))+'%':this[_0x2f18('0x322')](0x3);if(_0x3407e1===_0x2f18('0x96'))return _0x4848f9?_0x2b63d3(_0xef8b3['round'](this[_0x2f18('0x322')](0x4)*0x64))+'%':this[_0x2f18('0x322')](0x4);if(_0x5a7736===_0x2f18('0x1c3'))return _0x57b1b7?_0x286c40(_0x439e4d[_0x2f18('0x587')](this['sparam'](0x5)*0x64))+'%':this[_0x2f18('0x322')](0x5);if(_0x3388c6===_0x2f18('0x7b'))return _0x4ac21d?_0x8eecc4(_0x25bd0a[_0x2f18('0x587')](this[_0x2f18('0x322')](0x6)*0x64))+'%':this[_0x2f18('0x322')](0x6);if(_0x185985===_0x2f18('0x31c'))return _0x392ede?_0x13ee7c(_0x55bcd4[_0x2f18('0x587')](this['sparam'](0x7)*0x64))+'%':this[_0x2f18('0x322')](0x7);if(_0x5e30b===_0x2f18('0x374'))return _0x5abe36?_0x4c7df5(_0x214e6f['round'](this[_0x2f18('0x322')](0x8)*0x64))+'%':this[_0x2f18('0x322')](0x8);if(_0x48874c===_0x2f18('0x293'))return _0x17eb1e?_0x4f4f04(_0x74e081[_0x2f18('0x587')](this[_0x2f18('0x322')](0x9)*0x64))+'%':this[_0x2f18('0x322')](0x9);return'';}}}},Scene_Base[_0x2f18('0x602')]['buttonAssistText2']=function(){return'';},Scene_Base['prototype']['buttonAssistText3']=function(){return'';},Scene_Base[_0x2f18('0x602')][_0x2f18('0x575')]=function(){return TextManager['buttonAssistOk'];},Scene_Base[_0x2f18('0x602')][_0x2f18('0x2a9')]=function(){return TextManager[_0x2f18('0x8')];},Scene_Base['prototype'][_0x2f18('0x391')]=function(){return 0x0;},Scene_Base[_0x2f18('0x602')][_0x2f18('0x4e9')]=function(){return 0x0;},Scene_Base[_0x2f18('0x602')][_0x2f18('0x15d')]=function(){return 0x0;},Scene_Base[_0x2f18('0x602')][_0x2f18('0x3')]=function(){return 0x0;},Scene_Base[_0x2f18('0x602')][_0x2f18('0x28c')]=function(){return 0x0;},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x579')]=Scene_Boot[_0x2f18('0x602')][_0x2f18('0x16d')],Scene_Boot[_0x2f18('0x602')][_0x2f18('0x16d')]=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x579')][_0x2f18('0xc9')](this),this[_0x2f18('0x27c')]();},Scene_Boot[_0x2f18('0x602')][_0x2f18('0x27c')]=function(){const _0x4f9af7=[_0x2f18('0x5f4'),_0x2f18('0x5ed'),_0x2f18('0x143'),'characters',_0x2f18('0xea'),_0x2f18('0x40a'),_0x2f18('0x141'),_0x2f18('0x37b'),_0x2f18('0x191'),_0x2f18('0x45d'),_0x2f18('0x1d3'),_0x2f18('0x2bf'),_0x2f18('0x5d7'),_0x2f18('0x23d')];for(const _0x174056 of _0x4f9af7){const _0x2de3a2=VisuMZ[_0x2f18('0x56f')]['Settings'][_0x2f18('0x56c')][_0x174056],_0x332675=_0x2f18('0x86')[_0x2f18('0x1fe')](_0x174056);for(const _0x5cd4ab of _0x2de3a2){if(_0x2f18('0x3ba')===_0x2f18('0x3ba'))ImageManager[_0x2f18('0x35e')](_0x332675,_0x5cd4ab);else{function _0x3cb424(){this[_0x2f18('0xf6')]&&(_0x5b0481=_0x218964[_0x2f18('0x284')](_0x1b492b),_0xe80e83['se'][_0x2f18('0x197')]=0x0),_0x11a601['CoreEngine']['Sprite_AnimationMV_processTimingData'][_0x2f18('0xc9')](this,_0x14dc5c);}}}}},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x457')]=Scene_Boot[_0x2f18('0x602')][_0x2f18('0x4b7')],Scene_Boot['prototype']['startNormalGame']=function(){if(Utils[_0x2f18('0x25b')](_0x2f18('0x4e8'))&&VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0xe0')][_0x2f18('0x3c2')]){if(_0x2f18('0x563')!==_0x2f18('0x372'))this[_0x2f18('0x49e')]();else{function _0x49e939(){_0x215efc=_0x381727[_0x2f18('0x473')]-_0xf195d0;}}}else{if(_0x2f18('0x448')!==_0x2f18('0x32f'))VisuMZ[_0x2f18('0x56f')]['Scene_Boot_startNormalGame'][_0x2f18('0xc9')](this);else{function _0xe343f7(){return _0x2eef66['CoreEngine']['Settings'][_0x2f18('0x3d3')][_0x415af2]||_0x438b22[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x3d3')][_0x2f18('0x315')];}}}},Scene_Boot[_0x2f18('0x602')][_0x2f18('0x49e')]=function(){DataManager[_0x2f18('0x19e')](),SceneManager[_0x2f18('0x1cd')](Scene_Map);},Scene_Boot[_0x2f18('0x602')]['adjustBoxSize']=function(){const _0x29d871=$dataSystem[_0x2f18('0x4f5')]['uiAreaWidth'],_0x4d3f77=$dataSystem[_0x2f18('0x4f5')][_0x2f18('0x2e4')],_0x5e8f95=VisuMZ[_0x2f18('0x56f')]['Settings']['UI'][_0x2f18('0x2bb')];Graphics[_0x2f18('0x21f')]=_0x29d871-_0x5e8f95*0x2,Graphics[_0x2f18('0x473')]=_0x4d3f77-_0x5e8f95*0x2,this[_0x2f18('0x1ae')]();},VisuMZ[_0x2f18('0x56f')]['Scene_Boot_updateDocumentTitle']=Scene_Boot[_0x2f18('0x602')][_0x2f18('0x4b3')],Scene_Boot[_0x2f18('0x602')][_0x2f18('0x4b3')]=function(){if(this[_0x2f18('0x3de')]()){if(_0x2f18('0x301')===_0x2f18('0x301'))this[_0x2f18('0x573')]();else{function _0x3a7eb3(){return this[_0x2f18('0x49d')]()||this[_0x2f18('0xc3')]();}}}else{if(_0x2f18('0x359')===_0x2f18('0x359'))VisuMZ['CoreEngine']['Scene_Boot_updateDocumentTitle'][_0x2f18('0xc9')](this);else{function _0x3927f5(){return _0x314f27[_0x2f18('0x56f')][_0x2f18('0x2ba')][_0x2f18('0xc9')](this);}}}},Scene_Boot[_0x2f18('0x602')][_0x2f18('0x3de')]=function(){if(Scene_Title[_0x2f18('0x3ae')]==='')return![];if(Scene_Title[_0x2f18('0x3ae')]==='Subtitle')return![];if(Scene_Title[_0x2f18('0x3a7')]==='')return![];if(Scene_Title[_0x2f18('0x3a7')]==='0.00')return![];return!![];},Scene_Boot[_0x2f18('0x602')][_0x2f18('0x573')]=function(){const _0x4b2cdc=$dataSystem[_0x2f18('0x3a')],_0x4993b4=Scene_Title[_0x2f18('0x3ae')]||'',_0x1927d5=Scene_Title['version']||'',_0x548adc=VisuMZ[_0x2f18('0x56f')]['Settings'][_0x2f18('0x478')]['Title'][_0x2f18('0x5d6')],_0x366168=_0x548adc[_0x2f18('0x1fe')](_0x4b2cdc,_0x4993b4,_0x1927d5);document[_0x2f18('0x347')]=_0x366168;},Scene_Boot[_0x2f18('0x602')]['determineSideButtonLayoutValid']=function(){if(VisuMZ[_0x2f18('0x56f')]['Settings']['UI'][_0x2f18('0x23b')]){const _0x20f00c=Graphics['width']-Graphics['boxWidth']-VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['UI'][_0x2f18('0x2bb')]*0x2,_0x4bfd5a=Sprite_Button[_0x2f18('0x602')][_0x2f18('0x420')][_0x2f18('0xc9')](this)*0x4;if(_0x20f00c>=_0x4bfd5a)SceneManager[_0x2f18('0x383')](!![]);}},Scene_Title[_0x2f18('0x3ae')]=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x478')][_0x2f18('0x171')][_0x2f18('0xd')],Scene_Title[_0x2f18('0x3a7')]=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x478')][_0x2f18('0x171')][_0x2f18('0x3e1')],Scene_Title['pictureButtons']=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x5f7')],VisuMZ['CoreEngine'][_0x2f18('0x149')]=Scene_Title[_0x2f18('0x602')][_0x2f18('0x148')],Scene_Title[_0x2f18('0x602')][_0x2f18('0x148')]=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['MenuLayout'][_0x2f18('0x171')][_0x2f18('0x148')][_0x2f18('0xc9')](this);if(Scene_Title[_0x2f18('0x3ae')]!==''&&Scene_Title[_0x2f18('0x3ae')]!==_0x2f18('0xd'))this[_0x2f18('0x152')]();if(Scene_Title[_0x2f18('0x3a7')]!==''&&Scene_Title[_0x2f18('0x3a7')]!==_0x2f18('0x135'))this[_0x2f18('0x11b')]();},Scene_Title['prototype']['drawGameSubtitle']=function(){VisuMZ['CoreEngine']['Settings'][_0x2f18('0x478')][_0x2f18('0x171')][_0x2f18('0x152')][_0x2f18('0xc9')](this);},Scene_Title[_0x2f18('0x602')][_0x2f18('0x11b')]=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x478')][_0x2f18('0x171')][_0x2f18('0x11b')][_0x2f18('0xc9')](this);},Scene_Title[_0x2f18('0x602')][_0x2f18('0x426')]=function(){this[_0x2f18('0x449')]();const _0x2744ed=$dataSystem[_0x2f18('0x1a3')][_0x2f18('0xc6')],_0x3d03a2=this[_0x2f18('0xcc')]();this[_0x2f18('0x572')]=new Window_TitleCommand(_0x3d03a2),this[_0x2f18('0x572')][_0x2f18('0x18d')](_0x2744ed);const _0x160f5e=this['commandWindowRect']();this[_0x2f18('0x572')][_0x2f18('0xce')](_0x160f5e['x'],_0x160f5e['y'],_0x160f5e[_0x2f18('0x410')],_0x160f5e[_0x2f18('0x1c6')]),this[_0x2f18('0x5ad')](this['_commandWindow']);},Scene_Title[_0x2f18('0x602')]['commandWindowRows']=function(){return this['_commandWindow']?this[_0x2f18('0x572')][_0x2f18('0x582')]():VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['TitleCommandList'][_0x2f18('0xc7')];},Scene_Title['prototype'][_0x2f18('0xcc')]=function(){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x478')]['Title'][_0x2f18('0xa7')]['call'](this);},Scene_Title[_0x2f18('0x602')][_0x2f18('0x449')]=function(){for(const _0x3e1220 of Scene_Title[_0x2f18('0x3da')]){const _0x52a63c=new Sprite_TitlePictureButton(_0x3e1220);this['addChild'](_0x52a63c);}},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x463')]=Scene_Map[_0x2f18('0x602')][_0x2f18('0x5ea')],Scene_Map[_0x2f18('0x602')][_0x2f18('0x5ea')]=function(){VisuMZ['CoreEngine']['Scene_Map_updateMainMultiply'][_0x2f18('0xc9')](this);if($gameTemp[_0x2f18('0x36')]&&!$gameMessage[_0x2f18('0x286')]())this[_0x2f18('0x5e1')]();},Scene_Map['prototype']['terminate']=function(){Scene_Message[_0x2f18('0x602')]['terminate'][_0x2f18('0xc9')](this);if(!SceneManager[_0x2f18('0x48d')](Scene_Battle)){if(_0x2f18('0x381')!==_0x2f18('0x381')){function _0x23124e(){_0x364bdd[_0x2f18('0x382')](_0x5c7c70,_0x5be516);const _0x5e7181=_0x58fa9b['min'](_0x38ce3c['StartID'],_0x4f8727[_0x2f18('0x542')]),_0x3d14b3=_0x21ab89['max'](_0x1cc76e[_0x2f18('0x4a6')],_0x124781[_0x2f18('0x542')]);for(let _0x3a7ee8=_0x5e7181;_0x3a7ee8<=_0x3d14b3;_0x3a7ee8++){_0x5251c2[_0x2f18('0x5a0')](_0x3a7ee8);}}}else this[_0x2f18('0xb3')][_0x2f18('0x3ff')](),this[_0x2f18('0x13d')][_0x2f18('0x1a5')](),this[_0x2f18('0x2a7')][_0x2f18('0x43d')]=![],SceneManager['snapForBackground']();}$gameScreen[_0x2f18('0xdb')]();},VisuMZ['CoreEngine'][_0x2f18('0xee')]=Scene_Map['prototype']['createMenuButton'],Scene_Map[_0x2f18('0x602')][_0x2f18('0x225')]=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0xee')][_0x2f18('0xc9')](this),SceneManager[_0x2f18('0xc3')]()&&this[_0x2f18('0x268')]();},Scene_Map['prototype']['moveMenuButtonSideButtonLayout']=function(){this[_0x2f18('0x491')]['x']=Graphics[_0x2f18('0x21f')]+0x4;},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x9c')]=Scene_MenuBase[_0x2f18('0x602')][_0x2f18('0x220')],Scene_MenuBase['prototype'][_0x2f18('0x220')]=function(){let _0x5b23b9=0x0;if(SceneManager[_0x2f18('0x82')]())_0x5b23b9=this[_0x2f18('0x35f')]();else{if(_0x2f18('0x217')===_0x2f18('0x217'))_0x5b23b9=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x9c')][_0x2f18('0xc9')](this);else{function _0x33562(){try{_0x36145f[_0x2f18('0x56f')][_0x2f18('0x443')][_0x2f18('0xc9')](this,_0x34dcc0);}catch(_0x5bdb31){if(_0x8186a4[_0x2f18('0x2f9')]())_0xb7429e[_0x2f18('0xb4')](_0x5bdb31);}}}}return this[_0x2f18('0x54c')]()&&this[_0x2f18('0x50f')]()==='top'&&(_0x5b23b9+=Window_ButtonAssist[_0x2f18('0x602')][_0x2f18('0x40')]()),_0x5b23b9;},Scene_MenuBase[_0x2f18('0x602')][_0x2f18('0x35f')]=function(){if(this[_0x2f18('0x307')]())return this[_0x2f18('0x161')]();else{if(_0x2f18('0x36f')===_0x2f18('0x36f'))return 0x0;else{function _0xb5c628(){if(_0x541ab6[_0x2f18('0x2f9')]()){const _0x77d78f=_0x5ef297[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0xe0')][_0x2f18('0x433')];if(_0x77d78f>0x0)_0x59f8f1[_0x2f18('0x235')](_0x77d78f);}}}}},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x41d')]=Scene_MenuBase[_0x2f18('0x602')]['mainAreaTop'],Scene_MenuBase[_0x2f18('0x602')]['mainAreaTop']=function(){if(SceneManager[_0x2f18('0x82')]()){if(_0x2f18('0x5a9')!==_0x2f18('0x2a8'))return this[_0x2f18('0x4b4')]();else{function _0x3d0cae(){return 0.5*_0x2b9bcb*_0xaee102*((_0x16210a+0x1)*_0xfe1187-_0x160781);}}}else return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x41d')][_0x2f18('0xc9')](this);},Scene_MenuBase[_0x2f18('0x602')][_0x2f18('0x4b4')]=function(){if(!this[_0x2f18('0x307')]()){if(_0x2f18('0x116')===_0x2f18('0x349')){function _0x2c202b(){this[_0x2f18('0x47c')]+=this[_0x2f18('0x36b')](),this[_0x2f18('0x4f7')]()&&(this[_0x2f18('0x6')]=![]);}}else return this[_0x2f18('0x1db')]();}else{if(_0x2f18('0x595')!==_0x2f18('0x595')){function _0x55eb60(){return this[_0x2f18('0x27d')](_0x1816ea)&&_0x593654[_0x2f18('0x57')]===0x2;}}else return 0x0;}},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x26e')]=Scene_MenuBase[_0x2f18('0x602')][_0x2f18('0x56d')],Scene_MenuBase[_0x2f18('0x602')][_0x2f18('0x56d')]=function(){let _0x57ef6b=0x0;if(SceneManager[_0x2f18('0x82')]()){if(_0x2f18('0x4ab')!==_0x2f18('0x4ab')){function _0x21f9ef(){this[_0x2f18('0x18')][_0x2f18('0x5d0')]['call'](this),this[_0x2f18('0x18')][_0x2f18('0x107')][_0x2f18('0xc9')](this),this[_0x2f18('0x32a')](this['_data']['CallHandlerJS'][_0x2f18('0x415')](this));}}else _0x57ef6b=this[_0x2f18('0x5e0')]();}else _0x57ef6b=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x26e')][_0x2f18('0xc9')](this);return this[_0x2f18('0x54c')]()&&this[_0x2f18('0x50f')]()!==_0x2f18('0x1a9')&&(_0x57ef6b-=Window_ButtonAssist[_0x2f18('0x602')][_0x2f18('0x40')]()),_0x57ef6b;},Scene_MenuBase[_0x2f18('0x602')][_0x2f18('0x5e0')]=function(){return Graphics[_0x2f18('0x473')]-this[_0x2f18('0x2f3')]();},VisuMZ[_0x2f18('0x56f')]['Scene_MenuBase_createBackground']=Scene_MenuBase[_0x2f18('0x602')]['createBackground'],Scene_MenuBase[_0x2f18('0x602')]['createBackground']=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x1f1')][_0x2f18('0xc9')](this),this['setBackgroundOpacity'](this[_0x2f18('0x1ea')]()),this[_0x2f18('0x5dd')]();},Scene_MenuBase['prototype'][_0x2f18('0x1ea')]=function(){const _0x315538=String(this[_0x2f18('0x17c')]['name']),_0x22f2d5=this[_0x2f18('0x4da')](_0x315538);if(_0x22f2d5)return _0x22f2d5[_0x2f18('0x1ce')];else{if(_0x2f18('0x51')!==_0x2f18('0x51')){function _0x3c9dec(){this[_0x2f18('0x2fa')]>0x0&&(this[_0x2f18('0x56e')]['x']=this[_0x2f18('0x528')](this[_0x2f18('0x56e')]['x'],this['_targetAnchor']['x']),this[_0x2f18('0x56e')]['y']=this['applyEasing'](this[_0x2f18('0x56e')]['y'],this[_0x2f18('0x1aa')]['y']));}}else return 0xc0;}},Scene_MenuBase[_0x2f18('0x602')][_0x2f18('0x5dd')]=function(){const _0x2c8ffb=String(this[_0x2f18('0x17c')][_0x2f18('0x262')]),_0xf2fab7=this[_0x2f18('0x4da')](_0x2c8ffb);_0xf2fab7&&(_0xf2fab7[_0x2f18('0x45e')]!==''||_0xf2fab7[_0x2f18('0x51e')]!=='')&&(this[_0x2f18('0x5ae')]=new Sprite(ImageManager[_0x2f18('0x70')](_0xf2fab7[_0x2f18('0x45e')])),this[_0x2f18('0x4de')]=new Sprite(ImageManager[_0x2f18('0x196')](_0xf2fab7['BgFilename2'])),this[_0x2f18('0x158')](this[_0x2f18('0x5ae')]),this[_0x2f18('0x158')](this['_backSprite2']),this[_0x2f18('0x5ae')]['bitmap'][_0x2f18('0xbb')](this['adjustSprite'][_0x2f18('0x415')](this,this[_0x2f18('0x5ae')])),this[_0x2f18('0x4de')]['bitmap']['addLoadListener'](this[_0x2f18('0x4cb')][_0x2f18('0x415')](this,this[_0x2f18('0x4de')])));},Scene_MenuBase['prototype']['getCustomBackgroundSettings']=function(_0x9132af){return VisuMZ['CoreEngine'][_0x2f18('0x4d9')][_0x2f18('0x3d3')][_0x9132af]||VisuMZ['CoreEngine'][_0x2f18('0x4d9')][_0x2f18('0x3d3')]['Scene_Unlisted'];},Scene_MenuBase[_0x2f18('0x602')]['adjustSprite']=function(_0x3c6855){this[_0x2f18('0x185')](_0x3c6855),this[_0x2f18('0x195')](_0x3c6855);},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x1e5')]=Scene_MenuBase[_0x2f18('0x602')][_0x2f18('0x353')],Scene_MenuBase[_0x2f18('0x602')]['createCancelButton']=function(){VisuMZ['CoreEngine'][_0x2f18('0x1e5')][_0x2f18('0xc9')](this);if(SceneManager[_0x2f18('0xc3')]()){if(_0x2f18('0x13e')===_0x2f18('0x178')){function _0x165504(){let _0x272f0f=_0x33aa59[_0x2f18('0x56f')][_0x2f18('0x2ed')][_0x2f18('0xc9')](this);return _0x272f0f;}}else this[_0x2f18('0x176')]();}},Scene_MenuBase[_0x2f18('0x602')][_0x2f18('0x176')]=function(){this[_0x2f18('0x398')]['x']=Graphics[_0x2f18('0x21f')]+0x4;},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x451')]=Scene_MenuBase[_0x2f18('0x602')][_0x2f18('0x3c5')],Scene_MenuBase['prototype'][_0x2f18('0x3c5')]=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x451')][_0x2f18('0xc9')](this),SceneManager['isSideButtonLayout']()&&this[_0x2f18('0xa3')]();},Scene_MenuBase['prototype'][_0x2f18('0xa3')]=function(){this['_pageupButton']['x']=-0x1*(this[_0x2f18('0x79')][_0x2f18('0x410')]+this[_0x2f18('0x3f')][_0x2f18('0x410')]+0x8),this[_0x2f18('0x3f')]['x']=-0x1*(this[_0x2f18('0x3f')][_0x2f18('0x410')]+0x4);},Scene_MenuBase['prototype'][_0x2f18('0x54c')]=function(){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x1fd')]['Enable'];},Scene_MenuBase[_0x2f18('0x602')][_0x2f18('0x50f')]=function(){return SceneManager[_0x2f18('0xc3')]()||SceneManager[_0x2f18('0x49d')]()?VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x1fd')][_0x2f18('0x331')]:_0x2f18('0x1a9');},Scene_MenuBase[_0x2f18('0x602')]['createButtonAssistWindow']=function(){if(!this[_0x2f18('0x54c')]())return;const _0x176789=this[_0x2f18('0x4cf')]();this[_0x2f18('0x2ac')]=new Window_ButtonAssist(_0x176789),this[_0x2f18('0x5ad')](this['_buttonAssistWindow']);},Scene_MenuBase[_0x2f18('0x602')][_0x2f18('0x4cf')]=function(){if(this[_0x2f18('0x50f')]()==='button')return this[_0x2f18('0x1')]();else{if(_0x2f18('0x3f2')!==_0x2f18('0x3f2')){function _0x391655(){this[_0x2f18('0x4cc')]()&&_0x15049b&&this[_0x2f18('0x1ec')]()===0x1&&this['index']()===this[_0x2f18('0x582')]()-0x1?this['smoothSelect'](0x0):_0x590951[_0x2f18('0x56f')]['Window_Selectable_cursorDown'][_0x2f18('0xc9')](this,_0x533383);}}else return this[_0x2f18('0x66')]();}},Scene_MenuBase[_0x2f18('0x602')][_0x2f18('0x1')]=function(){const _0x568725=ConfigManager[_0x2f18('0x4ff')]?(Sprite_Button[_0x2f18('0x602')][_0x2f18('0x420')]()+0x6)*0x2:0x0,_0x4feb71=this[_0x2f18('0xf0')](),_0x1c8e3f=Graphics[_0x2f18('0x21f')]-_0x568725*0x2,_0x4ef7ae=this[_0x2f18('0x131')]();return new Rectangle(_0x568725,_0x4feb71,_0x1c8e3f,_0x4ef7ae);},Scene_MenuBase[_0x2f18('0x602')]['buttonAssistWindowSideRect']=function(){const _0x21cd10=Graphics[_0x2f18('0x21f')],_0x22d3d3=Window_ButtonAssist[_0x2f18('0x602')][_0x2f18('0x40')](),_0x3ba7d0=0x0;let _0x501112=0x0;return this[_0x2f18('0x50f')]()===_0x2f18('0xd7')?_0x501112=0x0:_0x501112=Graphics[_0x2f18('0x473')]-_0x22d3d3,new Rectangle(_0x3ba7d0,_0x501112,_0x21cd10,_0x22d3d3);},Scene_Menu[_0x2f18('0x526')]=VisuMZ['CoreEngine']['Settings'][_0x2f18('0x478')][_0x2f18('0x56')],VisuMZ[_0x2f18('0x56f')]['Scene_Menu_create']=Scene_Menu[_0x2f18('0x602')][_0x2f18('0x406')],Scene_Menu[_0x2f18('0x602')][_0x2f18('0x406')]=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x2cb')][_0x2f18('0xc9')](this),this['setCoreEngineUpdateWindowBg']();},Scene_Menu[_0x2f18('0x602')][_0x2f18('0x4b8')]=function(){if(this[_0x2f18('0x572')]){if(_0x2f18('0x591')==='InPNH'){function _0xe011c5(){this[_0x2f18('0x142')](_0x12e3fb,_0x4343e1+0x2,_0x46289a+0x2),_0x4faf64-=_0x44457c[_0x2f18('0x34a')]+0x4,_0x1b51c6+=_0x3c3e04[_0x2f18('0x34a')]+0x4;}}else this[_0x2f18('0x572')][_0x2f18('0x18d')](Scene_Menu[_0x2f18('0x526')][_0x2f18('0x550')]);}this[_0x2f18('0xc2')]&&this[_0x2f18('0xc2')][_0x2f18('0x18d')](Scene_Menu[_0x2f18('0x526')][_0x2f18('0x45')]);if(this[_0x2f18('0x557')]){if(_0x2f18('0x210')!==_0x2f18('0x210')){function _0x34fb32(){return _0xfc504a[_0x2f18('0x56f')]['Window_ShopSell_isEnabled']['call'](this,_0x2bc0a6);}}else this[_0x2f18('0x557')][_0x2f18('0x18d')](Scene_Menu[_0x2f18('0x526')][_0x2f18('0x360')]);}},Scene_Menu[_0x2f18('0x602')][_0x2f18('0xcc')]=function(){return Scene_Menu[_0x2f18('0x526')]['CommandRect']['call'](this);},Scene_Menu['prototype'][_0x2f18('0x50e')]=function(){return Scene_Menu[_0x2f18('0x526')]['GoldRect'][_0x2f18('0xc9')](this);},Scene_Menu['prototype']['statusWindowRect']=function(){return Scene_Menu[_0x2f18('0x526')][_0x2f18('0x27f')][_0x2f18('0xc9')](this);},Scene_Item[_0x2f18('0x526')]=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x478')][_0x2f18('0x2d4')],VisuMZ[_0x2f18('0x56f')][_0x2f18('0x228')]=Scene_Item[_0x2f18('0x602')][_0x2f18('0x406')],Scene_Item[_0x2f18('0x602')][_0x2f18('0x406')]=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x228')][_0x2f18('0xc9')](this),this['setCoreEngineUpdateWindowBg']();},Scene_Item['prototype'][_0x2f18('0x4b8')]=function(){this[_0x2f18('0x12a')]&&this[_0x2f18('0x12a')][_0x2f18('0x18d')](Scene_Item[_0x2f18('0x526')][_0x2f18('0x5b1')]);this[_0x2f18('0x18f')]&&this['_categoryWindow']['setBackgroundType'](Scene_Item['layoutSettings'][_0x2f18('0x452')]);this[_0x2f18('0x283')]&&this['_itemWindow']['setBackgroundType'](Scene_Item[_0x2f18('0x526')][_0x2f18('0x88')]);if(this[_0x2f18('0x58b')]){if(_0x2f18('0x14b')===_0x2f18('0x4ee')){function _0x4fad97(){var _0x45a77e=_0x292583(_0x5bb87f['$1']);_0x45ef0b*=_0x45a77e;}}else this[_0x2f18('0x58b')]['setBackgroundType'](Scene_Item[_0x2f18('0x526')][_0x2f18('0x4e7')]);}},Scene_Item[_0x2f18('0x602')][_0x2f18('0x4a')]=function(){return Scene_Item['layoutSettings'][_0x2f18('0x6c')][_0x2f18('0xc9')](this);},Scene_Item[_0x2f18('0x602')]['categoryWindowRect']=function(){return Scene_Item[_0x2f18('0x526')][_0x2f18('0x11f')]['call'](this);},Scene_Item[_0x2f18('0x602')][_0x2f18('0x425')]=function(){return Scene_Item[_0x2f18('0x526')]['ItemRect']['call'](this);},Scene_Item[_0x2f18('0x602')][_0x2f18('0x57b')]=function(){return Scene_Item['layoutSettings'][_0x2f18('0x4bd')][_0x2f18('0xc9')](this);},Scene_Skill[_0x2f18('0x526')]=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x478')][_0x2f18('0x34e')],VisuMZ[_0x2f18('0x56f')][_0x2f18('0x1f')]=Scene_Skill[_0x2f18('0x602')][_0x2f18('0x406')],Scene_Skill[_0x2f18('0x602')][_0x2f18('0x406')]=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x1f')]['call'](this),this['setCoreEngineUpdateWindowBg']();},Scene_Skill[_0x2f18('0x602')][_0x2f18('0x4b8')]=function(){if(this[_0x2f18('0x12a')]){if(_0x2f18('0x34b')===_0x2f18('0x5fa')){function _0x3ab5d8(){const _0x4542bb=_0x3f4d23['CoreEngine'][_0x2f18('0x4d9')][_0x2f18('0x2e6')];for(const _0x8cd603 of _0x4542bb){const _0x58598e=_0x8cd603['FunctionName'][_0x2f18('0x428')](/[ ]/g,''),_0x4b05fa=_0x8cd603['CodeJS'];_0x27f987[_0x2f18('0x56f')][_0x2f18('0x10f')](_0x58598e,_0x4b05fa);}}}else this[_0x2f18('0x12a')][_0x2f18('0x18d')](Scene_Skill[_0x2f18('0x526')][_0x2f18('0x5b1')]);}if(this['_skillTypeWindow']){if(_0x2f18('0x120')==='SWUWc'){function _0x33bd95(){!this[_0x2f18('0x5eb')]&&(this[_0x2f18('0x27a')]+=_0x2ddb1d[_0x2f18('0x587')]((_0xd144c4[_0x2f18('0x1c6')]-0x270)/0x2),this[_0x2f18('0x27a')]-=_0x2c47b7['floor']((_0x4768c4[_0x2f18('0x1c6')]-_0x287a64[_0x2f18('0x473')])/0x2),_0x4a6e58[_0x2f18('0x342')]()?this[_0x2f18('0x3a2')]-=_0xc2761e[_0x2f18('0x598')]((_0x339a7a[_0x2f18('0x410')]-_0x4e8b0b['boxWidth'])/0x2):this[_0x2f18('0x3a2')]+=_0x55c52e['round']((_0x26f70c[_0x2f18('0x21f')]-0x330)/0x2)),this[_0x2f18('0x5eb')]=!![];}}else this[_0x2f18('0x48c')]['setBackgroundType'](Scene_Skill['layoutSettings']['SkillTypeBgType']);}this['_statusWindow']&&this[_0x2f18('0x557')][_0x2f18('0x18d')](Scene_Skill[_0x2f18('0x526')][_0x2f18('0x360')]);if(this[_0x2f18('0x283')]){if(_0x2f18('0xac')==='OWXfi'){function _0x4ab897(){const _0x598997=_0xf89ac5(_0x3d76a9['$1']);_0x598997<_0x454e2b?(_0x44d841('%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.'[_0x2f18('0x1fe')](_0x16b01f,_0x598997,_0x467fae)),_0x116db7[_0x2f18('0x1a4')]()):_0x2d40be=_0x30b6bd[_0x2f18('0x586')](_0x598997,_0x8be19f);}}else this['_itemWindow']['setBackgroundType'](Scene_Skill[_0x2f18('0x526')][_0x2f18('0x88')]);}this[_0x2f18('0x58b')]&&this[_0x2f18('0x58b')][_0x2f18('0x18d')](Scene_Skill[_0x2f18('0x526')][_0x2f18('0x4e7')]);},Scene_Skill[_0x2f18('0x602')]['helpWindowRect']=function(){return Scene_Skill[_0x2f18('0x526')][_0x2f18('0x6c')][_0x2f18('0xc9')](this);},Scene_Skill[_0x2f18('0x602')][_0x2f18('0x22c')]=function(){return Scene_Skill[_0x2f18('0x526')][_0x2f18('0x39f')][_0x2f18('0xc9')](this);},Scene_Skill[_0x2f18('0x602')][_0x2f18('0x112')]=function(){return Scene_Skill[_0x2f18('0x526')][_0x2f18('0x27f')][_0x2f18('0xc9')](this);},Scene_Skill[_0x2f18('0x602')][_0x2f18('0x425')]=function(){return Scene_Skill['layoutSettings'][_0x2f18('0x570')][_0x2f18('0xc9')](this);},Scene_Skill[_0x2f18('0x602')][_0x2f18('0x57b')]=function(){return Scene_Skill[_0x2f18('0x526')]['ActorRect'][_0x2f18('0xc9')](this);},Scene_Equip[_0x2f18('0x526')]=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x478')][_0x2f18('0x462')],VisuMZ[_0x2f18('0x56f')][_0x2f18('0xfd')]=Scene_Equip[_0x2f18('0x602')][_0x2f18('0x406')],Scene_Equip['prototype']['create']=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0xfd')][_0x2f18('0xc9')](this),this[_0x2f18('0x4b8')]();},Scene_Equip[_0x2f18('0x602')][_0x2f18('0x4b8')]=function(){if(this[_0x2f18('0x12a')]){if(_0x2f18('0x2ad')!==_0x2f18('0x551'))this[_0x2f18('0x12a')][_0x2f18('0x18d')](Scene_Equip[_0x2f18('0x526')][_0x2f18('0x5b1')]);else{function _0x29bc54(){_0x49b0a7+=_0x419b4e(_0x57d810);}}}if(this[_0x2f18('0x557')]){if(_0x2f18('0x76')===_0x2f18('0x76'))this[_0x2f18('0x557')]['setBackgroundType'](Scene_Equip[_0x2f18('0x526')][_0x2f18('0x360')]);else{function _0x32fc6d(){return!this[_0x2f18('0x307')]()?this[_0x2f18('0x1db')]():0x0;}}}this[_0x2f18('0x572')]&&this['_commandWindow'][_0x2f18('0x18d')](Scene_Equip['layoutSettings']['CommandBgType']),this[_0x2f18('0x3b7')]&&this[_0x2f18('0x3b7')]['setBackgroundType'](Scene_Equip[_0x2f18('0x526')]['SlotBgType']),this[_0x2f18('0x283')]&&this[_0x2f18('0x283')][_0x2f18('0x18d')](Scene_Equip[_0x2f18('0x526')]['ItemBgType']);},Scene_Equip['prototype'][_0x2f18('0x4a')]=function(){return Scene_Equip[_0x2f18('0x526')][_0x2f18('0x6c')][_0x2f18('0xc9')](this);},Scene_Equip[_0x2f18('0x602')][_0x2f18('0x112')]=function(){return Scene_Equip[_0x2f18('0x526')][_0x2f18('0x27f')][_0x2f18('0xc9')](this);},Scene_Equip[_0x2f18('0x602')][_0x2f18('0xcc')]=function(){return Scene_Equip[_0x2f18('0x526')][_0x2f18('0xa7')][_0x2f18('0xc9')](this);},Scene_Equip[_0x2f18('0x602')][_0x2f18('0x133')]=function(){return Scene_Equip[_0x2f18('0x526')][_0x2f18('0x2b9')][_0x2f18('0xc9')](this);},Scene_Equip[_0x2f18('0x602')][_0x2f18('0x425')]=function(){return Scene_Equip['layoutSettings'][_0x2f18('0x570')][_0x2f18('0xc9')](this);},Scene_Status[_0x2f18('0x526')]=VisuMZ['CoreEngine']['Settings'][_0x2f18('0x478')]['StatusMenu'],VisuMZ[_0x2f18('0x56f')][_0x2f18('0x5a8')]=Scene_Status[_0x2f18('0x602')][_0x2f18('0x406')],Scene_Status[_0x2f18('0x602')][_0x2f18('0x406')]=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x5a8')][_0x2f18('0xc9')](this),this['setCoreEngineUpdateWindowBg']();},Scene_Status[_0x2f18('0x602')][_0x2f18('0x4b8')]=function(){if(this['_profileWindow']){if(_0x2f18('0x15c')===_0x2f18('0x15c'))this[_0x2f18('0x28a')][_0x2f18('0x18d')](Scene_Status['layoutSettings'][_0x2f18('0x522')]);else{function _0x5b45af(){!this[_0x2f18('0x2fe')]&&_0x3ee479[_0x2f18('0x169')]()&&(this[_0x2f18('0x2fe')]=!![],this[_0x2f18('0x5b')]()),_0x1d36d9[_0x2f18('0x320')]()&&(this[_0x2f18('0x3eb')]=!![],this[_0x2f18('0x7e')]());}}}this[_0x2f18('0x557')]&&this[_0x2f18('0x557')][_0x2f18('0x18d')](Scene_Status[_0x2f18('0x526')][_0x2f18('0x360')]),this['_statusParamsWindow']&&this[_0x2f18('0xbd')][_0x2f18('0x18d')](Scene_Status['layoutSettings']['StatusParamsBgType']),this[_0x2f18('0x5a6')]&&this[_0x2f18('0x5a6')][_0x2f18('0x18d')](Scene_Status[_0x2f18('0x526')][_0x2f18('0x25f')]);},Scene_Status[_0x2f18('0x602')]['profileWindowRect']=function(){return Scene_Status[_0x2f18('0x526')][_0x2f18('0x2c0')]['call'](this);},Scene_Status[_0x2f18('0x602')][_0x2f18('0x112')]=function(){return Scene_Status[_0x2f18('0x526')][_0x2f18('0x27f')][_0x2f18('0xc9')](this);},Scene_Status[_0x2f18('0x602')][_0x2f18('0x5c2')]=function(){return Scene_Status[_0x2f18('0x526')][_0x2f18('0x3e7')][_0x2f18('0xc9')](this);},Scene_Status[_0x2f18('0x602')][_0x2f18('0x215')]=function(){return Scene_Status[_0x2f18('0x526')][_0x2f18('0x51c')][_0x2f18('0xc9')](this);},Scene_Options[_0x2f18('0x526')]=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x478')][_0x2f18('0x3c7')],VisuMZ[_0x2f18('0x56f')]['Scene_Options_create']=Scene_Options[_0x2f18('0x602')][_0x2f18('0x406')],Scene_Options[_0x2f18('0x602')][_0x2f18('0x406')]=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x1d7')][_0x2f18('0xc9')](this),this[_0x2f18('0x4b8')]();},Scene_Options['prototype'][_0x2f18('0x4b8')]=function(){this['_optionsWindow']&&this['_optionsWindow'][_0x2f18('0x18d')](Scene_Options[_0x2f18('0x526')][_0x2f18('0x19')]);},Scene_Options[_0x2f18('0x602')][_0x2f18('0x150')]=function(){return Scene_Options[_0x2f18('0x526')][_0x2f18('0x42a')]['call'](this);},Scene_Save[_0x2f18('0x526')]=VisuMZ['CoreEngine'][_0x2f18('0x4d9')][_0x2f18('0x478')][_0x2f18('0x585')],Scene_Save[_0x2f18('0x602')][_0x2f18('0x406')]=function(){Scene_File['prototype']['create'][_0x2f18('0xc9')](this),this[_0x2f18('0x4b8')]();},Scene_Save[_0x2f18('0x602')][_0x2f18('0x4b8')]=function(){if(this[_0x2f18('0x12a')]){if('rqtvZ'!==_0x2f18('0x5ff'))this[_0x2f18('0x12a')][_0x2f18('0x18d')](Scene_Save[_0x2f18('0x526')][_0x2f18('0x5b1')]);else{function _0x9bc54c(){_0x18700f=_0x2ef2fa[_0x2f18('0x586')](_0x1c6080,_0x178bb7);}}}if(this['_listWindow']){if(_0x2f18('0x24e')!==_0x2f18('0x24e')){function _0x2a4b45(){if(_0xd6368[_0x2f18('0x3ae')]==='')return![];if(_0x383e79['subtitle']===_0x2f18('0xd'))return![];if(_0x2463b6[_0x2f18('0x3a7')]==='')return![];if(_0x2cfea4['version']===_0x2f18('0x135'))return![];return!![];}}else this[_0x2f18('0x511')][_0x2f18('0x18d')](Scene_Save['layoutSettings'][_0x2f18('0x274')]);}},Scene_Save[_0x2f18('0x602')][_0x2f18('0x4a')]=function(){return Scene_Save['layoutSettings'][_0x2f18('0x6c')][_0x2f18('0xc9')](this);},Scene_Save[_0x2f18('0x602')][_0x2f18('0x574')]=function(){return Scene_Save['layoutSettings'][_0x2f18('0x7f')][_0x2f18('0xc9')](this);},Scene_Load[_0x2f18('0x526')]=VisuMZ[_0x2f18('0x56f')]['Settings'][_0x2f18('0x478')][_0x2f18('0xdf')],Scene_Load[_0x2f18('0x602')]['create']=function(){Scene_File[_0x2f18('0x602')][_0x2f18('0x406')][_0x2f18('0xc9')](this),this[_0x2f18('0x4b8')]();},Scene_Load['prototype'][_0x2f18('0x4b8')]=function(){this[_0x2f18('0x12a')]&&this[_0x2f18('0x12a')][_0x2f18('0x18d')](Scene_Load[_0x2f18('0x526')][_0x2f18('0x5b1')]),this[_0x2f18('0x511')]&&this[_0x2f18('0x511')][_0x2f18('0x18d')](Scene_Load[_0x2f18('0x526')][_0x2f18('0x274')]);},Scene_Load[_0x2f18('0x602')]['helpWindowRect']=function(){return Scene_Load[_0x2f18('0x526')][_0x2f18('0x6c')][_0x2f18('0xc9')](this);},Scene_Load['prototype'][_0x2f18('0x574')]=function(){return Scene_Load[_0x2f18('0x526')][_0x2f18('0x7f')][_0x2f18('0xc9')](this);},Scene_GameEnd[_0x2f18('0x526')]=VisuMZ[_0x2f18('0x56f')]['Settings'][_0x2f18('0x478')][_0x2f18('0x414')],VisuMZ[_0x2f18('0x56f')][_0x2f18('0x593')]=Scene_GameEnd['prototype'][_0x2f18('0x59c')],Scene_GameEnd[_0x2f18('0x602')][_0x2f18('0x59c')]=function(){Scene_MenuBase[_0x2f18('0x602')][_0x2f18('0x59c')][_0x2f18('0xc9')](this);},Scene_GameEnd[_0x2f18('0x602')][_0x2f18('0x426')]=function(){const _0x4dfb69=this[_0x2f18('0xcc')]();this['_commandWindow']=new Window_GameEnd(_0x4dfb69),this[_0x2f18('0x572')]['setHandler'](_0x2f18('0xad'),this[_0x2f18('0xd2')][_0x2f18('0x415')](this)),this[_0x2f18('0x5ad')](this[_0x2f18('0x572')]),this[_0x2f18('0x572')][_0x2f18('0x18d')](Scene_GameEnd[_0x2f18('0x526')][_0x2f18('0x550')]);},Scene_GameEnd[_0x2f18('0x602')]['commandWindowRect']=function(){return Scene_GameEnd[_0x2f18('0x526')][_0x2f18('0xa7')][_0x2f18('0xc9')](this);},Scene_Shop[_0x2f18('0x526')]=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['MenuLayout'][_0x2f18('0x18b')],VisuMZ[_0x2f18('0x56f')][_0x2f18('0x16f')]=Scene_Shop[_0x2f18('0x602')]['create'],Scene_Shop[_0x2f18('0x602')]['create']=function(){VisuMZ[_0x2f18('0x56f')]['Scene_Shop_create']['call'](this),this[_0x2f18('0x4b8')]();},Scene_Shop[_0x2f18('0x602')][_0x2f18('0x4b8')]=function(){if(this['_helpWindow']){if(_0x2f18('0x34c')!=='ANIrU')this['_helpWindow'][_0x2f18('0x18d')](Scene_Shop[_0x2f18('0x526')][_0x2f18('0x5b1')]);else{function _0x2a6e99(){this[_0x2f18('0x122')](),_0x1a35e9[_0x2f18('0x56f')][_0x2f18('0x33b')]['call'](this,_0x3d02f2);}}}this[_0x2f18('0xc2')]&&this[_0x2f18('0xc2')][_0x2f18('0x18d')](Scene_Shop['layoutSettings']['GoldBgType']);this[_0x2f18('0x572')]&&this[_0x2f18('0x572')][_0x2f18('0x18d')](Scene_Shop['layoutSettings'][_0x2f18('0x550')]);if(this[_0x2f18('0x295')]){if('EJBzC'==='EPeja'){function _0x3d7a14(){this[_0x2f18('0x6')]=![];}}else this[_0x2f18('0x295')]['setBackgroundType'](Scene_Shop[_0x2f18('0x526')][_0x2f18('0x5e8')]);}if(this[_0x2f18('0x32d')]){if(_0x2f18('0x44f')===_0x2f18('0x44f'))this[_0x2f18('0x32d')][_0x2f18('0x18d')](Scene_Shop[_0x2f18('0x526')][_0x2f18('0xd8')]);else{function _0x59c570(){_0x369e30=_0x871bc3[_0x2f18('0x586')](_0x1e3af4,_0x3bff5a(_0x4d339f(_0x310f6b)));}}}this[_0x2f18('0x557')]&&this[_0x2f18('0x557')][_0x2f18('0x18d')](Scene_Shop[_0x2f18('0x526')][_0x2f18('0x360')]);this[_0x2f18('0x497')]&&this[_0x2f18('0x497')]['setBackgroundType'](Scene_Shop[_0x2f18('0x526')][_0x2f18('0x38f')]);this[_0x2f18('0x18f')]&&this[_0x2f18('0x18f')][_0x2f18('0x18d')](Scene_Shop[_0x2f18('0x526')][_0x2f18('0x452')]);if(this[_0x2f18('0x352')]){if('FbXsj'===_0x2f18('0x5a4')){function _0x3c9049(){if(_0x641ecb['isPlaytest']())_0x17dbba['log'](_0x448ae8);}}else this['_sellWindow'][_0x2f18('0x18d')](Scene_Shop[_0x2f18('0x526')][_0x2f18('0x303')]);}},Scene_Shop[_0x2f18('0x602')][_0x2f18('0x4a')]=function(){return Scene_Shop[_0x2f18('0x526')][_0x2f18('0x6c')][_0x2f18('0xc9')](this);},Scene_Shop[_0x2f18('0x602')][_0x2f18('0x50e')]=function(){return Scene_Shop[_0x2f18('0x526')]['GoldRect']['call'](this);},Scene_Shop[_0x2f18('0x602')][_0x2f18('0xcc')]=function(){return Scene_Shop[_0x2f18('0x526')][_0x2f18('0xa7')][_0x2f18('0xc9')](this);},Scene_Shop[_0x2f18('0x602')][_0x2f18('0x597')]=function(){return Scene_Shop['layoutSettings'][_0x2f18('0x2a1')][_0x2f18('0xc9')](this);},Scene_Shop[_0x2f18('0x602')]['numberWindowRect']=function(){return Scene_Shop[_0x2f18('0x526')][_0x2f18('0x160')][_0x2f18('0xc9')](this);},Scene_Shop['prototype'][_0x2f18('0x112')]=function(){return Scene_Shop['layoutSettings']['StatusRect'][_0x2f18('0xc9')](this);},Scene_Shop[_0x2f18('0x602')][_0x2f18('0x95')]=function(){return Scene_Shop[_0x2f18('0x526')][_0x2f18('0x216')][_0x2f18('0xc9')](this);},Scene_Shop[_0x2f18('0x602')][_0x2f18('0x5b7')]=function(){return Scene_Shop[_0x2f18('0x526')]['CategoryRect'][_0x2f18('0xc9')](this);},Scene_Shop['prototype'][_0x2f18('0x69')]=function(){return Scene_Shop[_0x2f18('0x526')][_0x2f18('0x5b4')][_0x2f18('0xc9')](this);},Scene_Name[_0x2f18('0x526')]=VisuMZ[_0x2f18('0x56f')]['Settings']['MenuLayout']['NameMenu'],VisuMZ[_0x2f18('0x56f')][_0x2f18('0x16')]=Scene_Name[_0x2f18('0x602')]['create'],Scene_Name[_0x2f18('0x602')][_0x2f18('0x406')]=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x16')]['call'](this),this['setCoreEngineUpdateWindowBg']();},Scene_Name['prototype'][_0x2f18('0x4b8')]=function(){this[_0x2f18('0x3c8')]&&this[_0x2f18('0x3c8')][_0x2f18('0x18d')](Scene_Name[_0x2f18('0x526')]['EditBgType']),this[_0x2f18('0x21d')]&&this[_0x2f18('0x21d')][_0x2f18('0x18d')](Scene_Name[_0x2f18('0x526')][_0x2f18('0x333')]);},Scene_Name[_0x2f18('0x602')][_0x2f18('0x2f3')]=function(){return 0x0;},Scene_Name[_0x2f18('0x602')][_0x2f18('0x3a3')]=function(){return Scene_Name[_0x2f18('0x526')]['EditRect']['call'](this);},Scene_Name['prototype'][_0x2f18('0x42f')]=function(){return Scene_Name[_0x2f18('0x526')]['InputRect'][_0x2f18('0xc9')](this);},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x564')]=Scene_Battle[_0x2f18('0x602')][_0x2f18('0x3ff')],Scene_Battle[_0x2f18('0x602')][_0x2f18('0x3ff')]=function(){VisuMZ[_0x2f18('0x56f')]['Scene_Battle_update']['call'](this);if($gameTemp['_playTestFastMode'])this[_0x2f18('0x35c')]();},Scene_Battle[_0x2f18('0x602')]['updatePlayTestF7']=function(){if(!BattleManager[_0x2f18('0x442')]()&&!this[_0x2f18('0x67')]&&!$gameMessage[_0x2f18('0x286')]()){if('NNUTq'==='TvvIu'){function _0x69f0ea(){_0xc6f973[_0x2f18('0x393')]('shift')?this[_0x2f18('0x2c6')]():this['cursorUp'](_0x5d3ca3[_0x2f18('0x320')]('up'));}}else this[_0x2f18('0x67')]=!![],this['update'](),this[_0x2f18('0x67')]=![];}},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x256')]=Scene_Battle[_0x2f18('0x602')][_0x2f18('0x353')],Scene_Battle[_0x2f18('0x602')][_0x2f18('0x353')]=function(){VisuMZ['CoreEngine'][_0x2f18('0x256')]['call'](this);if(SceneManager[_0x2f18('0xc3')]()){if(_0x2f18('0x299')==='TqMBe'){function _0xc1d053(){if(_0x2027c5[_0x2f18('0x51d')]())return;_0x2c7c7b['ConvertParams'](_0x2818d7,_0x9f5be3);const _0x356711=_0x563293[_0x2f18('0x421')];if(_0x356711['match'](/Front/i))_0x27b224[_0x2f18('0x22')](![]);else _0x356711[_0x2f18('0x15b')](/Side/i)?_0x4d88f5[_0x2f18('0x22')](!![]):_0x40c369['setSideView'](!_0x2befc4[_0x2f18('0x342')]());}}else this[_0x2f18('0x1bd')]();}},Scene_Battle[_0x2f18('0x602')][_0x2f18('0x1bd')]=function(){this['_cancelButton']['x']=Graphics[_0x2f18('0x21f')]+0x4,this[_0x2f18('0x198')]()?this[_0x2f18('0x398')]['y']=Graphics[_0x2f18('0x473')]-this[_0x2f18('0x131')]():this[_0x2f18('0x398')]['y']=0x0;},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x44d')]=Sprite_Button[_0x2f18('0x602')][_0x2f18('0x2f6')],Sprite_Button[_0x2f18('0x602')][_0x2f18('0x2f6')]=function(_0x56426b){VisuMZ[_0x2f18('0x56f')]['Sprite_Button_initialize'][_0x2f18('0xc9')](this,_0x56426b),this['initButtonHidden']();},Sprite_Button['prototype'][_0x2f18('0x397')]=function(){const _0x4427d0=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['UI'];this['_isButtonHidden']=![];switch(this[_0x2f18('0xa4')]){case _0x2f18('0xad'):this[_0x2f18('0x332')]=!_0x4427d0[_0x2f18('0x233')];break;case _0x2f18('0x35d'):case _0x2f18('0x98'):this[_0x2f18('0x332')]=!_0x4427d0['pagedownShowButton'];break;case _0x2f18('0x35b'):case'up':case'down2':case _0x2f18('0x4c9'):case'ok':this[_0x2f18('0x332')]=!_0x4427d0[_0x2f18('0xff')];break;case _0x2f18('0x282'):this[_0x2f18('0x332')]=!_0x4427d0[_0x2f18('0x23a')];break;}},VisuMZ['CoreEngine'][_0x2f18('0x334')]=Sprite_Button[_0x2f18('0x602')][_0x2f18('0xef')],Sprite_Button[_0x2f18('0x602')]['updateOpacity']=function(){SceneManager[_0x2f18('0x49d')]()||this[_0x2f18('0x332')]?this[_0x2f18('0x387')]():VisuMZ[_0x2f18('0x56f')][_0x2f18('0x334')][_0x2f18('0xc9')](this);},Sprite_Button[_0x2f18('0x602')][_0x2f18('0x387')]=function(){this['visible']=![],this['opacity']=0x0,this['x']=Graphics[_0x2f18('0x410')]*0xa,this['y']=Graphics[_0x2f18('0x1c6')]*0xa;},VisuMZ[_0x2f18('0x56f')]['Sprite_Battler_startMove']=Sprite_Battler[_0x2f18('0x602')][_0x2f18('0x2a6')],Sprite_Battler[_0x2f18('0x602')][_0x2f18('0x2a6')]=function(_0x1ff276,_0xc3197,_0x44e73b){(this[_0x2f18('0x440')]!==_0x1ff276||this['_targetOffsetY']!==_0xc3197)&&(this['setMoveEasingType'](_0x2f18('0x4ea')),this['_movementWholeDuration']=_0x44e73b),VisuMZ['CoreEngine'][_0x2f18('0x20f')][_0x2f18('0xc9')](this,_0x1ff276,_0xc3197,_0x44e73b);},Sprite_Battler['prototype'][_0x2f18('0x14')]=function(_0x5437fd){this[_0x2f18('0x246')]=_0x5437fd;},Sprite_Battler[_0x2f18('0x602')][_0x2f18('0x534')]=function(){if(this[_0x2f18('0x429')]<=0x0)return;const _0x492336=this[_0x2f18('0x429')],_0x181d47=this[_0x2f18('0x6a')],_0x24a2f6=this[_0x2f18('0x246')];this[_0x2f18('0x1bc')]=this[_0x2f18('0x528')](this[_0x2f18('0x1bc')],this[_0x2f18('0x440')],_0x492336,_0x181d47,_0x24a2f6),this[_0x2f18('0xda')]=this[_0x2f18('0x528')](this[_0x2f18('0xda')],this[_0x2f18('0x483')],_0x492336,_0x181d47,_0x24a2f6),this[_0x2f18('0x429')]--;if(this[_0x2f18('0x429')]<=0x0)this['onMoveEnd']();},Sprite_Battler[_0x2f18('0x602')][_0x2f18('0x528')]=function(_0x2060a8,_0x226741,_0x2c6a35,_0x109ffa,_0xe21f0c){const _0x1802c9=VisuMZ[_0x2f18('0x3b6')]((_0x109ffa-_0x2c6a35)/_0x109ffa,_0xe21f0c||'Linear'),_0x13b0b8=VisuMZ['ApplyEasing']((_0x109ffa-_0x2c6a35+0x1)/_0x109ffa,_0xe21f0c||_0x2f18('0x4ea')),_0x2a9b0c=(_0x2060a8-_0x226741*_0x1802c9)/(0x1-_0x1802c9);return _0x2a9b0c+(_0x226741-_0x2a9b0c)*_0x13b0b8;},VisuMZ[_0x2f18('0x56f')]['Sprite_Actor_setActorHome']=Sprite_Actor[_0x2f18('0x602')][_0x2f18('0x9e')],Sprite_Actor[_0x2f18('0x602')][_0x2f18('0x9e')]=function(_0x5f576e){if(VisuMZ['CoreEngine']['Settings']['UI'][_0x2f18('0x2')]){if(_0x2f18('0x1d0')!==_0x2f18('0x1d0')){function _0x418406(){_0x4d5f47=_0x1fc858[_0x2f18('0x336')](_0x5dbd43);}}else this[_0x2f18('0x3f0')](_0x5f576e);}else{if(_0x2f18('0x1ef')==='MkYCp')VisuMZ[_0x2f18('0x56f')][_0x2f18('0x5db')][_0x2f18('0xc9')](this,_0x5f576e);else{function _0x4c8d51(){const _0x76d92b=this[_0x2f18('0x53')](_0x23599f),_0x2258f8=this[_0x2f18('0x208')](_0x1421fc),_0x20cb7a=this[_0x2f18('0x2b')](_0x5f0d4a);return _0x76d92b*(_0x2258f8-_0x20cb7a);}}}},Sprite_Actor[_0x2f18('0x602')][_0x2f18('0x3f0')]=function(_0x44f4c5){let _0xfa1110=Math[_0x2f18('0x587')](Graphics[_0x2f18('0x410')]/0x2+0xc0);_0xfa1110-=Math['floor']((Graphics[_0x2f18('0x410')]-Graphics['boxWidth'])/0x2),_0xfa1110+=_0x44f4c5*0x20;let _0x2acf1b=Graphics['height']-0xc8-$gameParty[_0x2f18('0x569')]()*0x30;_0x2acf1b-=Math[_0x2f18('0x598')]((Graphics[_0x2f18('0x1c6')]-Graphics[_0x2f18('0x473')])/0x2),_0x2acf1b+=_0x44f4c5*0x30,this['setHome'](_0xfa1110,_0x2acf1b);},Sprite_Actor[_0x2f18('0x602')][_0x2f18('0x589')]=function(){this[_0x2f18('0x2a6')](0x4b0,0x0,0x78);},Sprite_Animation[_0x2f18('0x602')][_0x2f18('0x1d1')]=function(_0xb25ee0){this[_0x2f18('0xf6')]=_0xb25ee0;},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x544')]=Sprite_Animation[_0x2f18('0x602')][_0x2f18('0x43f')],Sprite_Animation[_0x2f18('0x602')][_0x2f18('0x43f')]=function(){if(this[_0x2f18('0xf6')])return;VisuMZ[_0x2f18('0x56f')][_0x2f18('0x544')][_0x2f18('0xc9')](this);},Sprite_Animation[_0x2f18('0x602')][_0x2f18('0x524')]=function(_0x36652a){const _0xd7b6fb=this[_0x2f18('0x4dc')][_0x2f18('0x262')];let _0x3fdcd2=0x0,_0x45d4b1=-_0x36652a[_0x2f18('0x1c6')]/0x2;;if(_0xd7b6fb[_0x2f18('0x15b')](/<(?:HEAD|HEADER|TOP)>/i))_0x45d4b1=-_0x36652a[_0x2f18('0x1c6')];if(_0xd7b6fb['match'](/<(?:FOOT|FOOTER|BOTTOM)>/i))_0x45d4b1=0x0;if(_0xd7b6fb[_0x2f18('0x15b')](/<(?:LEFT)>/i))_0x3fdcd2=-_0x36652a['width']/0x2;if(_0xd7b6fb[_0x2f18('0x15b')](/<(?:RIGHT)>/i))_0x45d4b1=_0x36652a[_0x2f18('0x410')]/0x2;if(_0xd7b6fb[_0x2f18('0x15b')](/<ANCHOR X:[ ](\d+\.?\d*)>/i))_0x3fdcd2=Number(RegExp['$1'])*_0x36652a[_0x2f18('0x410')];if(_0xd7b6fb[_0x2f18('0x15b')](/<ANCHOR Y:[ ](\d+\.?\d*)>/i)){if('TJIXR'!=='Xyprn')_0x45d4b1=(0x1-Number(RegExp['$1']))*-_0x36652a[_0x2f18('0x1c6')];else{function _0xec8677(){return'';}}}_0xd7b6fb[_0x2f18('0x15b')](/<ANCHOR:[ ](\d+\.?\d*),[ ](\d+\.?\d*)>/i)&&(_0x3fdcd2=Number(RegExp['$1'])*_0x36652a[_0x2f18('0x410')],_0x45d4b1=(0x1-Number(RegExp['$2']))*-_0x36652a[_0x2f18('0x1c6')]);if(_0xd7b6fb['match'](/<OFFSET X:[ ]([\+\-]\d+)>/i))_0x3fdcd2+=Number(RegExp['$1']);if(_0xd7b6fb['match'](/<OFFSET Y:[ ]([\+\-]\d+)>/i))_0x45d4b1+=Number(RegExp['$1']);_0xd7b6fb[_0x2f18('0x15b')](/<OFFSET:[ ]([\+\-]\d+),[ ]([\+\-]\d+)>/i)&&(_0x3fdcd2+=Number(RegExp['$1']),_0x45d4b1+=Number(RegExp['$2']));const _0x10bb36=new Point(_0x3fdcd2,_0x45d4b1);return _0x36652a['updateTransform'](),_0x36652a['worldTransform'][_0x2f18('0x523')](_0x10bb36);},Sprite_AnimationMV[_0x2f18('0x602')][_0x2f18('0x1d1')]=function(_0x3b9d61){this[_0x2f18('0xf6')]=_0x3b9d61;},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x45a')]=Sprite_AnimationMV[_0x2f18('0x602')][_0x2f18('0x102')],Sprite_AnimationMV[_0x2f18('0x602')]['processTimingData']=function(_0x209158){this['_muteSound']&&(_0x209158=JsonEx[_0x2f18('0x284')](_0x209158),_0x209158['se'][_0x2f18('0x197')]=0x0),VisuMZ['CoreEngine'][_0x2f18('0x45a')][_0x2f18('0xc9')](this,_0x209158);},Sprite_Damage[_0x2f18('0x602')]['createDigits']=function(_0x3d8477){let _0x9b1e56=Math[_0x2f18('0x4ed')](_0x3d8477)['toString']();this[_0x2f18('0x3d7')]()&&(_0x9b1e56=VisuMZ[_0x2f18('0x193')](_0x9b1e56));const _0x4c390e=this[_0x2f18('0x313')](),_0x228426=Math[_0x2f18('0x598')](_0x4c390e*0.75);for(let _0x15d5b3=0x0;_0x15d5b3<_0x9b1e56[_0x2f18('0xc7')];_0x15d5b3++){if(_0x2f18('0x28b')!==_0x2f18('0x5bd')){const _0x2fd07d=this[_0x2f18('0x8e')](_0x228426,_0x4c390e);_0x2fd07d[_0x2f18('0x1bf')][_0x2f18('0x430')](_0x9b1e56[_0x15d5b3],0x0,0x0,_0x228426,_0x4c390e,_0x2f18('0x4fb')),_0x2fd07d['x']=(_0x15d5b3-(_0x9b1e56['length']-0x1)/0x2)*_0x228426,_0x2fd07d['dy']=-_0x15d5b3;}else{function _0x30972d(){return _0x3c50ef['ApplyEasing'](_0x248a67,this[_0x2f18('0x29b')]);}}}},Sprite_Damage[_0x2f18('0x602')][_0x2f18('0x3d7')]=function(){return VisuMZ['CoreEngine'][_0x2f18('0x4d9')][_0x2f18('0xe0')]['DigitGroupingDamageSprites'];},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4f1')]=Sprite_Gauge[_0x2f18('0x602')]['gaugeRate'],Sprite_Gauge[_0x2f18('0x602')]['gaugeRate']=function(){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4f1')][_0x2f18('0xc9')](this)[_0x2f18('0x5e2')](0x0,0x1);},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x2ed')]=Sprite_Gauge[_0x2f18('0x602')][_0x2f18('0x496')],Sprite_Gauge[_0x2f18('0x602')][_0x2f18('0x496')]=function(){let _0x3f28f8=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x2ed')]['call'](this);return _0x3f28f8;},Sprite_Gauge[_0x2f18('0x602')][_0x2f18('0x498')]=function(){let _0x1ed7b3=this[_0x2f18('0x496')]();this[_0x2f18('0x3d7')]()&&(_0x1ed7b3=VisuMZ[_0x2f18('0x193')](_0x1ed7b3));const _0x16d4df=this[_0x2f18('0x58a')]()-0x1,_0x270d89=this[_0x2f18('0x417')]();this[_0x2f18('0x46d')](),this['bitmap'][_0x2f18('0x430')](_0x1ed7b3,0x0,0x0,_0x16d4df,_0x270d89,_0x2f18('0x55c'));},Sprite_Gauge['prototype']['valueOutlineWidth']=function(){return 0x3;},Sprite_Gauge[_0x2f18('0x602')][_0x2f18('0x3d7')]=function(){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['QoL'][_0x2f18('0x182')];};function Sprite_TitlePictureButton(){this[_0x2f18('0x2f6')](...arguments);}Sprite_TitlePictureButton['prototype']=Object[_0x2f18('0x406')](Sprite_Clickable['prototype']),Sprite_TitlePictureButton[_0x2f18('0x602')][_0x2f18('0x17c')]=Sprite_TitlePictureButton,Sprite_TitlePictureButton[_0x2f18('0x602')]['initialize']=function(_0x1901ca){Sprite_Clickable[_0x2f18('0x602')][_0x2f18('0x2f6')][_0x2f18('0xc9')](this),this[_0x2f18('0x18')]=_0x1901ca,this['_clickHandler']=null,this[_0x2f18('0x15')]();},Sprite_TitlePictureButton['prototype'][_0x2f18('0x15')]=function(){this['x']=Graphics['width'],this['y']=Graphics[_0x2f18('0x1c6')],this[_0x2f18('0x43d')]=![],this[_0x2f18('0x7')]();},Sprite_TitlePictureButton['prototype'][_0x2f18('0x7')]=function(){this[_0x2f18('0x1bf')]=ImageManager['loadPicture'](this[_0x2f18('0x18')][_0x2f18('0x3a4')]),this['bitmap']['addLoadListener'](this[_0x2f18('0x3a6')][_0x2f18('0x415')](this));},Sprite_TitlePictureButton[_0x2f18('0x602')][_0x2f18('0x3a6')]=function(){this['_data'][_0x2f18('0x5d0')][_0x2f18('0xc9')](this),this[_0x2f18('0x18')]['PositionJS'][_0x2f18('0xc9')](this),this['setClickHandler'](this[_0x2f18('0x18')][_0x2f18('0x288')]['bind'](this));},Sprite_TitlePictureButton[_0x2f18('0x602')][_0x2f18('0x3ff')]=function(){Sprite_Clickable[_0x2f18('0x602')][_0x2f18('0x3ff')][_0x2f18('0xc9')](this),this['updateOpacity'](),this[_0x2f18('0x2a2')]();},Sprite_TitlePictureButton[_0x2f18('0x602')][_0x2f18('0x4')]=function(){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x478')][_0x2f18('0x171')][_0x2f18('0x15a')];},Sprite_TitlePictureButton[_0x2f18('0x602')][_0x2f18('0xef')]=function(){if(this[_0x2f18('0x3eb')]){if(_0x2f18('0xba')===_0x2f18('0xba'))this[_0x2f18('0x7a')]=0xff;else{function _0x2bf376(){_0xd4a633['CoreEngine'][_0x2f18('0x5a1')][_0x2f18('0xc9')](this);}}}else{if(_0x2f18('0x281')==='lWRiM'){function _0x2fc0c7(){_0x40a7b6[_0x2f18('0x393')](_0x2f18('0x4fd'))?this[_0x2f18('0x1da')]():this[_0x2f18('0x481')](_0x4646e8[_0x2f18('0x320')](_0x2f18('0x35b')));}}else this[_0x2f18('0x7a')]+=this[_0x2f18('0x43d')]?this[_0x2f18('0x4')]():-0x1*this['fadeSpeed'](),this[_0x2f18('0x7a')]=Math[_0x2f18('0xcf')](0xc0,this[_0x2f18('0x7a')]);}},Sprite_TitlePictureButton[_0x2f18('0x602')]['setClickHandler']=function(_0x2f2cce){this[_0x2f18('0x174')]=_0x2f2cce;},Sprite_TitlePictureButton[_0x2f18('0x602')]['onClick']=function(){if(this['_clickHandler']){if(_0x2f18('0x19d')!=='RrMcC')this[_0x2f18('0x174')]();else{function _0x1ce27c(){this[_0x2f18('0x557')][_0x2f18('0x18d')](_0x365341['layoutSettings'][_0x2f18('0x360')]);}}}},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x5bc')]=Spriteset_Base[_0x2f18('0x602')][_0x2f18('0x2f6')],Spriteset_Base[_0x2f18('0x602')][_0x2f18('0x2f6')]=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x5bc')][_0x2f18('0xc9')](this),this[_0x2f18('0x3ec')]=[];},VisuMZ[_0x2f18('0x56f')]['Spriteset_Base_destroy']=Spriteset_Base[_0x2f18('0x602')][_0x2f18('0x314')],Spriteset_Base[_0x2f18('0x602')][_0x2f18('0x314')]=function(_0x4b4b94){this[_0x2f18('0x122')](),VisuMZ[_0x2f18('0x56f')]['Spriteset_Base_destroy'][_0x2f18('0xc9')](this,_0x4b4b94);},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x261')]=Spriteset_Base[_0x2f18('0x602')]['update'],Spriteset_Base[_0x2f18('0x602')][_0x2f18('0x3ff')]=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x261')]['call'](this),this[_0x2f18('0x311')](),this[_0x2f18('0x2da')]();},Spriteset_Base[_0x2f18('0x602')][_0x2f18('0x311')]=function(){if(!VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0xe0')][_0x2f18('0x4c')])return;this[_0x2f18('0x455')]['x']!==0x0&&(this[_0x2f18('0x1ba')][_0x2f18('0x455')]['x']=0x1/this['scale']['x'],this[_0x2f18('0x1ba')]['x']=-(this['x']/this[_0x2f18('0x455')]['x']));if(this[_0x2f18('0x455')]['y']!==0x0){if(_0x2f18('0x341')===_0x2f18('0x341'))this[_0x2f18('0x1ba')]['scale']['y']=0x1/this[_0x2f18('0x455')]['y'],this[_0x2f18('0x1ba')]['y']=-(this['y']/this[_0x2f18('0x455')]['y']);else{function _0x8b5cb8(){const _0x1d28ca=this['createChildSprite'](_0x148576,_0x237bbb);_0x1d28ca[_0x2f18('0x1bf')][_0x2f18('0x430')](_0x19c14b[_0x80de29],0x0,0x0,_0x4c79d9,_0x57abf9,_0x2f18('0x4fb')),_0x1d28ca['x']=(_0xd18ff9-(_0x39d346[_0x2f18('0xc7')]-0x1)/0x2)*_0x35315b,_0x1d28ca['dy']=-_0x651711;}}}},Spriteset_Base[_0x2f18('0x602')][_0x2f18('0x2da')]=function(){for(const _0x31d4cc of this[_0x2f18('0x3ec')]){!_0x31d4cc['isPlaying']()&&this[_0x2f18('0x285')](_0x31d4cc);}this[_0x2f18('0x51f')]();},Spriteset_Base[_0x2f18('0x602')][_0x2f18('0x51f')]=function(){for(;;){if('rNhQE'===_0x2f18('0x37a')){const _0x1d7aa3=$gameTemp[_0x2f18('0x52d')]();if(_0x1d7aa3)this[_0x2f18('0x38d')](_0x1d7aa3);else break;}else{function _0x1ada5e(){return _0x51af9c[_0x2f18('0x82')]()?this[_0x2f18('0x4b4')]():_0x55944c[_0x2f18('0x56f')][_0x2f18('0x41d')][_0x2f18('0xc9')](this);}}}},Spriteset_Base[_0x2f18('0x602')][_0x2f18('0x38d')]=function(_0x311265){const _0x15f62f=$dataAnimations[_0x311265[_0x2f18('0x3b5')]],_0x364ea0=_0x311265['targets'],_0x22d7b9=_0x311265[_0x2f18('0x1af')],_0xe82191=_0x311265[_0x2f18('0x5e9')];let _0x2c978e=this[_0x2f18('0x3b0')]();const _0xed9bc3=this[_0x2f18('0x362')]();if(this[_0x2f18('0x155')](_0x15f62f)){if(_0x2f18('0x506')===_0x2f18('0x510')){function _0x443db2(){return _0x3bcc09[_0x2f18('0x526')][_0x2f18('0x4bd')][_0x2f18('0xc9')](this);}}else for(const _0x53c9bf of _0x364ea0){if('lAPHP'!==_0x2f18('0x306'))this['createFauxAnimationSprite']([_0x53c9bf],_0x15f62f,_0x22d7b9,_0x2c978e,_0xe82191),_0x2c978e+=_0xed9bc3;else{function _0x3ad569(){return _0xa2c69b['CoreEngine'][_0x2f18('0x4d9')][_0x2f18('0x26')][_0x2f18('0x1be')];}}}}else{if(_0x2f18('0x41f')===_0x2f18('0x4d')){function _0x57a844(){if(this[_0x2f18('0xf6')])return;_0x3281e3[_0x2f18('0x56f')][_0x2f18('0x544')]['call'](this);}}else this['createFauxAnimationSprite'](_0x364ea0,_0x15f62f,_0x22d7b9,_0x2c978e,_0xe82191);}},Spriteset_Base[_0x2f18('0x602')]['createFauxAnimationSprite']=function(_0x3dfc70,_0x3ef6b1,_0x150348,_0x169203,_0x1aa235){const _0x4c098f=this[_0x2f18('0x525')](_0x3ef6b1),_0x254220=new(_0x4c098f?Sprite_AnimationMV:Sprite_Animation)(),_0x4e5e74=this[_0x2f18('0x37c')](_0x3dfc70);if(this[_0x2f18('0x291')](_0x3dfc70[0x0])){if(_0x2f18('0x214')!==_0x2f18('0x53b'))_0x150348=!_0x150348;else{function _0x55ad60(){this[_0x2f18('0x430')](_0x1ef496,_0x5b8fc1,_0x3a1957,_0x3952a9);}}}_0x254220[_0x2f18('0x2c5')]=_0x3dfc70,_0x254220[_0x2f18('0x15')](_0x4e5e74,_0x3ef6b1,_0x150348,_0x169203),_0x254220['setMute'](_0x1aa235),this[_0x2f18('0x57a')][_0x2f18('0x158')](_0x254220),this[_0x2f18('0x3ec')][_0x2f18('0x2c9')](_0x254220);},Spriteset_Base[_0x2f18('0x602')][_0x2f18('0x285')]=function(_0x26385d){this['_fauxAnimationSprites'][_0x2f18('0x229')](_0x26385d),this[_0x2f18('0x57a')]['removeChild'](_0x26385d);for(const _0x8cad95 of _0x26385d[_0x2f18('0x2c5')]){_0x8cad95[_0x2f18('0x5a5')]&&_0x8cad95[_0x2f18('0x5a5')]();}_0x26385d['destroy']();},Spriteset_Base[_0x2f18('0x602')][_0x2f18('0x122')]=function(){for(const _0x119c58 of this[_0x2f18('0x3ec')]){this[_0x2f18('0x285')](_0x119c58);}},Spriteset_Base['prototype'][_0x2f18('0x12d')]=function(){return this['_fauxAnimationSprites']['length']>0x0;},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x137')]=Spriteset_Base[_0x2f18('0x602')][_0x2f18('0x1ca')],Spriteset_Base[_0x2f18('0x602')][_0x2f18('0x1ca')]=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x137')]['call'](this),this[_0x2f18('0x476')]();},Spriteset_Base[_0x2f18('0x602')][_0x2f18('0x476')]=function(){if(!$gameScreen)return;if($gameScreen[_0x2f18('0xf8')]<=0x0)return;this['x']-=Math[_0x2f18('0x587')]($gameScreen[_0x2f18('0xed')]());const _0x31e0d3=$gameScreen[_0x2f18('0x5')]();switch($gameScreen[_0x2f18('0x5')]()){case _0x2f18('0x4b6'):this[_0x2f18('0x4d7')]();break;case _0x2f18('0xe4'):this[_0x2f18('0x5cf')]();break;case _0x2f18('0x4e5'):this['updatePositionCoreEngineShakeVert']();break;default:this[_0x2f18('0x4a3')]();break;}},Spriteset_Base[_0x2f18('0x602')][_0x2f18('0x4d7')]=function(){const _0x3e8efd=VisuMZ[_0x2f18('0x56f')]['Settings'][_0x2f18('0x5cc')];if(_0x3e8efd&&_0x3e8efd['originalJS']){if(_0x2f18('0x1d4')!==_0x2f18('0x3e3'))return _0x3e8efd[_0x2f18('0x37e')][_0x2f18('0xc9')](this);else{function _0x118401(){const _0x19657f=_0x3d9281['encounterStep']();this[_0x2f18('0x4f9')]=_0x468791[_0x2f18('0x3f8')](_0x19657f)+_0x23677d[_0x2f18('0x3f8')](_0x19657f)+this[_0x2f18('0x25a')]();}}}this['x']+=Math[_0x2f18('0x587')]($gameScreen[_0x2f18('0xed')]());},Spriteset_Base[_0x2f18('0x602')][_0x2f18('0x4a3')]=function(){const _0x4883d1=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x5cc')];if(_0x4883d1&&_0x4883d1[_0x2f18('0x180')])return _0x4883d1[_0x2f18('0x180')][_0x2f18('0xc9')](this);const _0x5a907a=$gameScreen['_shakePower']*0.75,_0x1dd744=$gameScreen[_0x2f18('0x31e')]*0.6,_0x4fcbd5=$gameScreen['_shakeDuration'];this['x']+=Math[_0x2f18('0x587')](Math[_0x2f18('0x3f8')](_0x5a907a)-Math[_0x2f18('0x3f8')](_0x1dd744))*(Math['min'](_0x4fcbd5,0x1e)*0.5),this['y']+=Math[_0x2f18('0x587')](Math['randomInt'](_0x5a907a)-Math[_0x2f18('0x3f8')](_0x1dd744))*(Math[_0x2f18('0xcf')](_0x4fcbd5,0x1e)*0.5);},Spriteset_Base[_0x2f18('0x602')][_0x2f18('0x5cf')]=function(){const _0x37de1e=VisuMZ[_0x2f18('0x56f')]['Settings'][_0x2f18('0x5cc')];if(_0x37de1e&&_0x37de1e['horzJS'])return _0x37de1e[_0x2f18('0x356')][_0x2f18('0xc9')](this);const _0x25abf0=$gameScreen[_0x2f18('0x26c')]*0.75,_0x23206e=$gameScreen['_shakeSpeed']*0.6,_0x2782de=$gameScreen[_0x2f18('0xf8')];this['x']+=Math[_0x2f18('0x587')](Math[_0x2f18('0x3f8')](_0x25abf0)-Math[_0x2f18('0x3f8')](_0x23206e))*(Math[_0x2f18('0xcf')](_0x2782de,0x1e)*0.5);},Spriteset_Base[_0x2f18('0x602')][_0x2f18('0x2d2')]=function(){const _0x436a61=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x5cc')];if(_0x436a61&&_0x436a61[_0x2f18('0xa2')])return _0x436a61[_0x2f18('0xa2')]['call'](this);const _0x3de191=$gameScreen[_0x2f18('0x26c')]*0.75,_0xa13533=$gameScreen[_0x2f18('0x31e')]*0.6,_0x1634da=$gameScreen[_0x2f18('0xf8')];this['y']+=Math[_0x2f18('0x587')](Math[_0x2f18('0x3f8')](_0x3de191)-Math[_0x2f18('0x3f8')](_0xa13533))*(Math[_0x2f18('0xcf')](_0x1634da,0x1e)*0.5);},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x594')]=Spriteset_Battle[_0x2f18('0x602')][_0x2f18('0x24b')],Spriteset_Battle[_0x2f18('0x602')][_0x2f18('0x24b')]=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['UI'][_0x2f18('0x17f')]&&this[_0x2f18('0x319')](),VisuMZ[_0x2f18('0x56f')][_0x2f18('0x594')][_0x2f18('0xc9')](this);},Spriteset_Battle[_0x2f18('0x602')][_0x2f18('0x319')]=function(){for(member of $gameTroop['members']()){member['moveRelativeToResolutionChange']();}},VisuMZ['CoreEngine'][_0x2f18('0x73')]=Window_Base[_0x2f18('0x602')][_0x2f18('0x2f6')],Window_Base[_0x2f18('0x602')][_0x2f18('0x2f6')]=function(_0x25aec6){this[_0x2f18('0x52e')](),VisuMZ[_0x2f18('0x56f')]['Window_Base_initialize']['call'](this,_0x25aec6),this[_0x2f18('0x5c5')]();},Window_Base['prototype']['initDigitGrouping']=function(){this[_0x2f18('0x4ba')]=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0xe0')][_0x2f18('0x29')],this['_digitGroupingEx']=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0xe0')][_0x2f18('0x4a4')];},Window_Base[_0x2f18('0x602')]['lineHeight']=function(){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['Window'][_0x2f18('0x126')];},Window_Base[_0x2f18('0x602')][_0x2f18('0x36a')]=function(){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x1e8')][_0x2f18('0x450')];},Window_Base[_0x2f18('0x602')]['updateBackOpacity']=function(){this[_0x2f18('0x2c8')]=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x1e8')][_0x2f18('0xbe')];},Window_Base[_0x2f18('0x602')][_0x2f18('0x3a1')]=function(){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x1e8')][_0x2f18('0x101')];},Window_Base[_0x2f18('0x602')]['openingSpeed']=function(){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x1e8')]['OpenSpeed'];},VisuMZ[_0x2f18('0x56f')]['Window_Base_update']=Window_Base[_0x2f18('0x602')]['update'],Window_Base['prototype'][_0x2f18('0x3ff')]=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x5e4')][_0x2f18('0xc9')](this),this[_0x2f18('0x39d')]();},Window_Base[_0x2f18('0x602')][_0x2f18('0x127')]=function(){if(this[_0x2f18('0x6')]){if(_0x2f18('0x5d9')!==_0x2f18('0x3dc')){this['openness']+=this[_0x2f18('0x36b')]();if(this[_0x2f18('0x4f7')]()){if(_0x2f18('0x3c6')!==_0x2f18('0x3c6')){function _0x2c2a28(){if(this[_0x2f18('0x2d3')]===_0x3c855c)this['initCoreEngine']();if(this[_0x2f18('0x2d3')][_0x2f18('0xc8')]===_0x1708f8)this[_0x2f18('0x576')]();return this[_0x2f18('0x2d3')]['Padding'];}}else this[_0x2f18('0x6')]=![];}}else{function _0x494aa6(){this[_0x2f18('0x2fe')]&&this[_0x2f18('0x3cb')](),this[_0x2f18('0x3eb')]=![],this[_0x2f18('0x2fe')]=![];}}}},Window_Base[_0x2f18('0x602')][_0x2f18('0x23f')]=function(){if(this[_0x2f18('0x23')]){this[_0x2f18('0x47c')]-=this[_0x2f18('0x36b')]();if(this[_0x2f18('0x11d')]()){if('yzIsT'!==_0x2f18('0x2b0')){function _0x2042b7(){_0x1fe92c[_0x2f18('0x56f')][_0x2f18('0x328')][_0x2f18('0xc9')](this,_0x1c17fc);}}else this['_closing']=![];}}},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x309')]=Window_Base[_0x2f18('0x602')][_0x2f18('0x430')],Window_Base[_0x2f18('0x602')][_0x2f18('0x430')]=function(_0x4ef434,_0xdc0671,_0x217ffb,_0x265c89,_0x1b45f0){if(this[_0x2f18('0x3d7')]())_0x4ef434=VisuMZ['GroupDigits'](_0x4ef434);VisuMZ[_0x2f18('0x56f')]['Window_Base_drawText']['call'](this,_0x4ef434,_0xdc0671,_0x217ffb,_0x265c89,_0x1b45f0);},Window_Base[_0x2f18('0x602')][_0x2f18('0x3d7')]=function(){return this['_digitGrouping'];},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x30e')]=Window_Base[_0x2f18('0x602')][_0x2f18('0x1eb')],Window_Base['prototype'][_0x2f18('0x1eb')]=function(_0x3731f1,_0x4348ef,_0x5e4719,_0x294e5c){var _0xa5299c=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x30e')][_0x2f18('0xc9')](this,_0x3731f1,_0x4348ef,_0x5e4719,_0x294e5c);if(this[_0x2f18('0x45b')]())_0xa5299c['text']=VisuMZ[_0x2f18('0x193')](_0xa5299c[_0x2f18('0x230')]);return _0xa5299c;},Window_Base['prototype'][_0x2f18('0x45b')]=function(){return this['_digitGroupingEx'];},Window_Base[_0x2f18('0x602')][_0x2f18('0x436')]=function(_0x4b70fd){this[_0x2f18('0x4ba')]=_0x4b70fd;},Window_Base[_0x2f18('0x602')][_0x2f18('0x54a')]=function(_0x31ac12){this[_0x2f18('0x34d')]=_0x31ac12;},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x128')]=Window_Base[_0x2f18('0x602')][_0x2f18('0x4f6')],Window_Base[_0x2f18('0x602')][_0x2f18('0x4f6')]=function(_0x1d7746){return this[_0x2f18('0x5dc')]=this['_CoreEngine_Cache_textSizeEx']||{},!this[_0x2f18('0x5dc')][_0x1d7746]&&(this[_0x2f18('0x5dc')][_0x1d7746]=VisuMZ[_0x2f18('0x56f')]['Window_Base_textSizeEx'][_0x2f18('0xc9')](this,_0x1d7746)),this['_CoreEngine_Cache_textSizeEx'][_0x1d7746];},Window_Base[_0x2f18('0x602')][_0x2f18('0x5c5')]=function(){this[_0x2f18('0x3ea')]={'duration':0x0,'wholeDuration':0x0,'type':_0x2f18('0x260'),'targetX':this['x'],'targetY':this['y'],'targetScaleX':this[_0x2f18('0x455')]['x'],'targetScaleY':this['scale']['y'],'targetOpacity':this[_0x2f18('0x7a')],'targetBackOpacity':this[_0x2f18('0x2c8')],'targetContentsOpacity':this[_0x2f18('0x6e')]};},Window_Base[_0x2f18('0x602')]['updateCoreEasing']=function(){if(!this['_coreEasing'])return;if(this[_0x2f18('0x3ea')][_0x2f18('0xb0')]<=0x0)return;this['x']=this[_0x2f18('0x55')](this['x'],this[_0x2f18('0x3ea')][_0x2f18('0x21')]),this['y']=this['applyCoreEasing'](this['y'],this[_0x2f18('0x3ea')][_0x2f18('0x280')]),this[_0x2f18('0x455')]['x']=this[_0x2f18('0x55')](this[_0x2f18('0x455')]['x'],this[_0x2f18('0x3ea')][_0x2f18('0x3f4')]),this['scale']['y']=this[_0x2f18('0x55')](this[_0x2f18('0x455')]['y'],this[_0x2f18('0x3ea')][_0x2f18('0x4d8')]),this[_0x2f18('0x7a')]=this[_0x2f18('0x55')](this[_0x2f18('0x7a')],this[_0x2f18('0x3ea')]['targetOpacity']),this['backOpacity']=this['applyCoreEasing'](this[_0x2f18('0x2c8')],this[_0x2f18('0x3ea')]['targetBackOpacity']),this[_0x2f18('0x6e')]=this[_0x2f18('0x55')](this[_0x2f18('0x6e')],this[_0x2f18('0x3ea')][_0x2f18('0x2b5')]),this[_0x2f18('0x3ea')][_0x2f18('0xb0')]--;},Window_Base[_0x2f18('0x602')]['applyCoreEasing']=function(_0x13240c,_0x571589){if(!this[_0x2f18('0x3ea')])return _0x571589;const _0x1268e8=this[_0x2f18('0x3ea')][_0x2f18('0xb0')],_0x3af0ed=this[_0x2f18('0x3ea')][_0x2f18('0x519')],_0x45748f=this['calcCoreEasing']((_0x3af0ed-_0x1268e8)/_0x3af0ed),_0x556c12=this[_0x2f18('0x300')]((_0x3af0ed-_0x1268e8+0x1)/_0x3af0ed),_0x3913d6=(_0x13240c-_0x571589*_0x45748f)/(0x1-_0x45748f);return _0x3913d6+(_0x571589-_0x3913d6)*_0x556c12;},Window_Base[_0x2f18('0x602')][_0x2f18('0x300')]=function(_0x1f6ea0){if(!this[_0x2f18('0x3ea')])return _0x1f6ea0;return VisuMZ['ApplyEasing'](_0x1f6ea0,this[_0x2f18('0x3ea')][_0x2f18('0x3fb')]||'LINEAR');},Window_Base[_0x2f18('0x602')][_0x2f18('0x1b9')]=function(_0x4cd51e,_0x4fdc69){if(!this[_0x2f18('0x3ea')])return;this['x']=this[_0x2f18('0x3ea')]['targetX'],this['y']=this[_0x2f18('0x3ea')][_0x2f18('0x280')],this[_0x2f18('0x455')]['x']=this['_coreEasing']['targetScaleX'],this['scale']['y']=this[_0x2f18('0x3ea')][_0x2f18('0x4d8')],this[_0x2f18('0x7a')]=this[_0x2f18('0x3ea')][_0x2f18('0x241')],this['backOpacity']=this['_coreEasing'][_0x2f18('0x29a')],this[_0x2f18('0x6e')]=this[_0x2f18('0x3ea')][_0x2f18('0x2b5')],this[_0x2f18('0x12')](_0x4cd51e,_0x4fdc69,this['x'],this['y'],this[_0x2f18('0x455')]['x'],this[_0x2f18('0x455')]['y'],this[_0x2f18('0x7a')],this[_0x2f18('0x2c8')],this[_0x2f18('0x6e')]);},Window_Base[_0x2f18('0x602')][_0x2f18('0x12')]=function(_0x3f011a,_0x2b4626,_0x2744d2,_0x2f5be9,_0x239726,_0x102283,_0x5cc37e,_0x1d1738,_0x2e28fb){this['_coreEasing']={'duration':_0x3f011a,'wholeDuration':_0x3f011a,'type':_0x2b4626,'targetX':_0x2744d2,'targetY':_0x2f5be9,'targetScaleX':_0x239726,'targetScaleY':_0x102283,'targetOpacity':_0x5cc37e,'targetBackOpacity':_0x1d1738,'targetContentsOpacity':_0x2e28fb};},Window_Base[_0x2f18('0x602')][_0x2f18('0x4fa')]=function(_0x4d73cc,_0x3cef33,_0x276e98,_0x220373,_0x5149eb){this['resetFontSettings'](),this[_0x2f18('0x65')][_0x2f18('0x313')]=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['Gold'][_0x2f18('0x36e')];const _0xc7b929=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x26')][_0x2f18('0x5ba')];if(_0xc7b929>0x0&&_0x3cef33===TextManager[_0x2f18('0x54')]){if(_0x2f18('0x5f2')===_0x2f18('0x5f2')){const _0x30e471=_0x220373+(this[_0x2f18('0x40')]()-ImageManager[_0x2f18('0x5aa')])/0x2;this[_0x2f18('0x142')](_0xc7b929,_0x276e98+(_0x5149eb-ImageManager[_0x2f18('0x34a')]),_0x30e471),_0x5149eb-=ImageManager[_0x2f18('0x34a')]+0x4;}else{function _0x2329d9(){var _0x5400ec=_0x4ea7c7(_0x132e65['$1']);try{_0x4e9754+=_0xfa69aa(_0x5400ec);}catch(_0x52676b){if(_0x700e4[_0x2f18('0x2f9')]())_0x18e2e8['log'](_0x52676b);}}}}else{if('NaVVI'!=='gxknk')this['changeTextColor'](ColorManager[_0x2f18('0x41e')]()),this['drawText'](_0x3cef33,_0x276e98,_0x220373,_0x5149eb,'right'),_0x5149eb-=this[_0x2f18('0x237')](_0x3cef33)+0x6;else{function _0x2f0728(){_0x3d4248[_0x2f18('0x5a5')]();}}}this['resetTextColor']();const _0x4ba647=this['textWidth'](this['_digitGrouping']?VisuMZ['GroupDigits'](_0x4d73cc):_0x4d73cc);if(_0x4ba647>_0x5149eb){if(_0x2f18('0x1cf')!==_0x2f18('0x1cf')){function _0x8a0d36(){const _0x471391='_stored_gaugeBackColor';this[_0x2f18('0x3d4')]=this[_0x2f18('0x3d4')]||{};if(this[_0x2f18('0x3d4')][_0x471391])return this['_colorCache'][_0x471391];const _0x4cebf2=_0x19de34['CoreEngine'][_0x2f18('0x4d9')][_0x2f18('0x458')]['ColorGaugeBack'];return this[_0x2f18('0x5ee')](_0x471391,_0x4cebf2);}}else this[_0x2f18('0x430')](VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x26')][_0x2f18('0x1b7')],_0x276e98,_0x220373,_0x5149eb,_0x2f18('0x55c'));}else{if(_0x2f18('0x139')!==_0x2f18('0x19f'))this[_0x2f18('0x430')](_0x4d73cc,_0x276e98,_0x220373,_0x5149eb,_0x2f18('0x55c'));else{function _0x18bb41(){return 0x0;}}}this[_0x2f18('0x55a')]();},Window_Base[_0x2f18('0x602')]['drawIconBySize']=function(_0x5850a1,_0x5b44f7,_0x3e8d5d,_0x46ecbb,_0x27156c){const _0x5c9820=ImageManager[_0x2f18('0x3be')]('IconSet'),_0x14e490=ImageManager[_0x2f18('0x34a')],_0x59626b=ImageManager['iconHeight'],_0x584bbd=_0x5850a1%0x10*_0x14e490,_0x124d60=Math[_0x2f18('0x598')](_0x5850a1/0x10)*_0x59626b,_0x46a88c=_0x46ecbb,_0x458a8d=_0x46ecbb;this['contents'][_0x2f18('0x2b8')]['imageSmoothingEnabled']=_0x27156c,this[_0x2f18('0x65')][_0x2f18('0x601')](_0x5c9820,_0x584bbd,_0x124d60,_0x14e490,_0x59626b,_0x5b44f7,_0x3e8d5d,_0x46a88c,_0x458a8d),this['contents'][_0x2f18('0x2b8')][_0x2f18('0x4e0')]=!![];},Window_Base['prototype'][_0x2f18('0x270')]=function(_0x3620b1,_0x12c336,_0x23ae35,_0x25df0a,_0x1ebe72,_0x14d45b){const _0x42a98b=Math[_0x2f18('0x598')]((_0x23ae35-0x2)*_0x25df0a),_0x5c605a=Sprite_Gauge[_0x2f18('0x602')][_0x2f18('0x548')][_0x2f18('0xc9')](this),_0x1d31a6=_0x12c336+this['lineHeight']()-_0x5c605a-0x2;this[_0x2f18('0x65')][_0x2f18('0x44b')](_0x3620b1,_0x1d31a6,_0x23ae35,_0x5c605a,ColorManager[_0x2f18('0x4c5')]()),this[_0x2f18('0x65')]['gradientFillRect'](_0x3620b1+0x1,_0x1d31a6+0x1,_0x42a98b,_0x5c605a-0x2,_0x1ebe72,_0x14d45b);},Window_Selectable[_0x2f18('0x602')][_0x2f18('0x481')]=function(_0x24d979){let _0x1667cb=this[_0x2f18('0x3b2')]();const _0x431409=this[_0x2f18('0x582')](),_0x17e8e9=this[_0x2f18('0x1ec')]();if(this[_0x2f18('0x4cc')]()&&(_0x1667cb<_0x431409||_0x24d979&&_0x17e8e9===0x1)){_0x1667cb+=_0x17e8e9;if(_0x1667cb>=_0x431409)_0x1667cb=_0x431409-0x1;this[_0x2f18('0x1b0')](_0x1667cb);}else{if(!this['isUseModernControls']()){if(_0x2f18('0x3ce')!==_0x2f18('0x5d4')){if(_0x1667cb<_0x431409-_0x17e8e9||_0x24d979&&_0x17e8e9===0x1){if('eKFTl'!==_0x2f18('0x5bf'))this[_0x2f18('0x1b0')]((_0x1667cb+_0x17e8e9)%_0x431409);else{function _0x10946f(){if(_0x5ad0ca[_0x2f18('0x2f9')]())_0xca58e0[_0x2f18('0xb4')](_0x305500);}}}}else{function _0x4771db(){return _0xb20f5['layoutSettings'][_0x2f18('0x6c')][_0x2f18('0xc9')](this);}}}}},Window_Selectable[_0x2f18('0x602')]['isUseModernControls']=function(){return VisuMZ[_0x2f18('0x56f')]['Settings'][_0x2f18('0xe0')][_0x2f18('0x4db')];},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x90')]=Window_Selectable[_0x2f18('0x602')][_0x2f18('0x44')],Window_Selectable[_0x2f18('0x602')][_0x2f18('0x44')]=function(){if(this[_0x2f18('0x4cc')]())this['processCursorMoveModernControls'](),this[_0x2f18('0x4a1')]();else{if(_0x2f18('0x2fb')!==_0x2f18('0x2fb')){function _0x3232d8(){if(this['_coreEngineShakeStyle']===_0x4dddd9)this['initCoreEngineScreenShake']();this['_coreEngineShakeStyle']=_0x5e5e2c[_0x2f18('0x1b3')]()[_0x2f18('0x44a')]();}}else VisuMZ[_0x2f18('0x56f')][_0x2f18('0x90')]['call'](this);}},Window_Selectable[_0x2f18('0x602')]['processCursorMoveModernControls']=function(){if(this[_0x2f18('0x39')]()){if(_0x2f18('0x1b5')!==_0x2f18('0x1b5')){function _0x5782d1(){if(!!_0x272b3f[_0x119817]){if(_0xa2a88f[_0x2f18('0x2f9')]())_0xbe8750[_0x2f18('0xb4')](_0x2f18('0x22e')['format'](_0x41754d));}const _0x1674d9=_0x2f18('0x13f')[_0x2f18('0x1fe')](_0x4f93d1,_0x83bc13);_0x5bbcc3[_0x571303]=new _0x1bb08b(_0x1674d9);}}else{const _0x38844b=this['index']();if(Input[_0x2f18('0x1c5')](_0x2f18('0x35b'))){if(Input['isPressed'](_0x2f18('0x4fd')))this['cursorPagedown']();else{if(_0x2f18('0x5c7')!==_0x2f18('0x186'))this[_0x2f18('0x481')](Input['isTriggered'](_0x2f18('0x35b')));else{function _0x3362ad(){return'';}}}}if(Input['isRepeated']('up')){if(Input[_0x2f18('0x393')](_0x2f18('0x4fd'))){if(_0x2f18('0x401')!=='NUhxY')this[_0x2f18('0x2c6')]();else{function _0x7a6b61(){this[_0x2f18('0x174')]=_0x11f82e;}}}else this[_0x2f18('0x4f0')](Input['isTriggered']('up'));}Input[_0x2f18('0x1c5')]('right')&&this[_0x2f18('0x33a')](Input[_0x2f18('0x320')](_0x2f18('0x55c')));if(Input[_0x2f18('0x1c5')](_0x2f18('0x2b7'))){if(_0x2f18('0x59b')!==_0x2f18('0x296'))this['cursorLeft'](Input[_0x2f18('0x320')]('left'));else{function _0x2ed422(){return _0x5b0d56[_0x2f18('0x526')][_0x2f18('0x7f')][_0x2f18('0xc9')](this);}}}if(!this['isHandled'](_0x2f18('0x98'))&&Input['isRepeated'](_0x2f18('0x98'))){if(_0x2f18('0x549')==='gBivo'){function _0x2f3cb7(){const _0x2221b4=_0x4f93cc[_0x2f18('0x4ff')]?(_0x4e105d[_0x2f18('0x602')][_0x2f18('0x420')]()+0x6)*0x2:0x0,_0x245e21=this[_0x2f18('0xf0')](),_0x31bfae=_0x3e8fcf[_0x2f18('0x21f')]-_0x2221b4*0x2,_0x5470f3=this[_0x2f18('0x131')]();return new _0x3de925(_0x2221b4,_0x245e21,_0x31bfae,_0x5470f3);}}else this[_0x2f18('0x1da')]();}!this['isHandled'](_0x2f18('0x35d'))&&Input[_0x2f18('0x1c5')](_0x2f18('0x35d'))&&this['cursorPageup'](),this['index']()!==_0x38844b&&this[_0x2f18('0x427')]();}}},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x328')]=Window_Selectable['prototype'][_0x2f18('0x481')],Window_Selectable[_0x2f18('0x602')]['cursorDown']=function(_0x494ab9){if(this[_0x2f18('0x4cc')]()&&_0x494ab9&&this[_0x2f18('0x1ec')]()===0x1&&this[_0x2f18('0x3b2')]()===this[_0x2f18('0x582')]()-0x1)this[_0x2f18('0x1b0')](0x0);else{if(_0x2f18('0x580')!==_0x2f18('0x181'))VisuMZ[_0x2f18('0x56f')][_0x2f18('0x328')][_0x2f18('0xc9')](this,_0x494ab9);else{function _0x4f33ec(){if(_0x27d419[_0x2f18('0x2f9')]())_0x4b5127[_0x2f18('0xb4')](_0x13ccac);}}}},Window_Selectable['prototype'][_0x2f18('0x4a1')]=function(){if(this['isCursorMovable']()){if(_0x2f18('0x1e3')!==_0x2f18('0x3b')){const _0x3d3d31=this['index']();Input[_0x2f18('0x320')](_0x2f18('0xf5'))&&this[_0x2f18('0x1b0')](Math['min'](this['index'](),0x0)),Input[_0x2f18('0x320')](_0x2f18('0x165'))&&this[_0x2f18('0x1b0')](Math[_0x2f18('0x586')](this[_0x2f18('0x3b2')](),this[_0x2f18('0x582')]()-0x1)),this[_0x2f18('0x3b2')]()!==_0x3d3d31&&this[_0x2f18('0x427')]();}else{function _0x4204d3(){const _0x5c2d7f=_0x5deafa['y']+(this['lineHeight']()-_0x4b6743[_0x2f18('0x5aa')])/0x2;this[_0x2f18('0x142')](_0x4a46d8,_0x2b1a20['x'],_0x5c2d7f);const _0x3b2341=_0x229020[_0x2f18('0x34a')]+0x4;_0x48f63f['x']+=_0x3b2341,_0x5a8776['width']-=_0x3b2341;}}}},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x468')]=Window_Selectable[_0x2f18('0x602')][_0x2f18('0x2a2')],Window_Selectable[_0x2f18('0x602')][_0x2f18('0x2a2')]=function(){if(this[_0x2f18('0x4cc')]()){if(_0x2f18('0x39a')!=='CeieN')this[_0x2f18('0x32c')]();else{function _0x36f445(){try{_0x3c2385['CoreEngine'][_0x2f18('0x5b8')][_0x2f18('0xc9')](this,_0x57d4ba);}catch(_0x11dafd){_0x43021e[_0x2f18('0x2f9')]()&&(_0x10f644[_0x2f18('0xb4')]('Control\x20Variables\x20Script\x20Error'),_0x516323[_0x2f18('0xb4')](_0x11dafd));}return!![];}}}else VisuMZ[_0x2f18('0x56f')]['Window_Selectable_processTouch'][_0x2f18('0xc9')](this);},Window_Selectable[_0x2f18('0x602')][_0x2f18('0x32c')]=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x468')][_0x2f18('0xc9')](this);},Window_Selectable[_0x2f18('0x602')][_0x2f18('0x492')]=function(){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['Window'][_0x2f18('0x4d5')];},Window_Selectable[_0x2f18('0x602')][_0x2f18('0x2f5')]=function(){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x1e8')][_0x2f18('0x35')];},Window_Selectable[_0x2f18('0x602')]['itemHeight']=function(){return Window_Scrollable[_0x2f18('0x602')]['itemHeight'][_0x2f18('0xc9')](this)+VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['Window'][_0x2f18('0xb2')];;},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x29c')]=Window_Selectable[_0x2f18('0x602')][_0x2f18('0x49')],Window_Selectable[_0x2f18('0x602')]['drawBackgroundRect']=function(_0x217f82){const _0x466336=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x1e8')];if(_0x466336[_0x2f18('0x44c')]===![])return;if(_0x466336[_0x2f18('0x389')]){if('CtCCr'!==_0x2f18('0x55d'))_0x466336[_0x2f18('0x389')][_0x2f18('0xc9')](this,_0x217f82);else{function _0x2fbfd2(){this['initDigitGrouping'](),_0x46a4f9['CoreEngine'][_0x2f18('0x73')][_0x2f18('0xc9')](this,_0x60d409),this[_0x2f18('0x5c5')]();}}}else VisuMZ[_0x2f18('0x56f')][_0x2f18('0x29c')]['call'](this,_0x217f82);},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x5a1')]=Window_Gold[_0x2f18('0x602')][_0x2f18('0x232')],Window_Gold[_0x2f18('0x602')][_0x2f18('0x232')]=function(){if(this['isItemStyle']()){if(_0x2f18('0xd1')!==_0x2f18('0x4d0'))this[_0x2f18('0x3ad')]();else{function _0x22ef2a(){_0x5b1851=this[_0x2f18('0x5e0')]();}}}else{if(_0x2f18('0x109')!==_0x2f18('0x109')){function _0x595f27(){this[_0x2f18('0x573')]();}}else VisuMZ[_0x2f18('0x56f')][_0x2f18('0x5a1')]['call'](this);}},Window_Gold[_0x2f18('0x602')][_0x2f18('0x20c')]=function(){if(TextManager[_0x2f18('0x54')]!==this[_0x2f18('0x54')]())return![];return VisuMZ['CoreEngine']['Settings'][_0x2f18('0x26')]['ItemStyle'];},Window_Gold['prototype']['drawGoldItemStyle']=function(){this['resetFontSettings'](),this[_0x2f18('0x65')][_0x2f18('0x561')](),this[_0x2f18('0x65')][_0x2f18('0x313')]=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['Gold'][_0x2f18('0x36e')];const _0x47e24e=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x26')][_0x2f18('0x5ba')],_0xba9344=this['itemLineRect'](0x0);if(_0x47e24e>0x0){if(_0x2f18('0x2b4')!==_0x2f18('0x2b4')){function _0x262780(){return _0x5305bc[_0x2f18('0x526')]['HelpRect'][_0x2f18('0xc9')](this);}}else{const _0x24a7be=_0xba9344['y']+(this[_0x2f18('0x40')]()-ImageManager[_0x2f18('0x5aa')])/0x2;this[_0x2f18('0x142')](_0x47e24e,_0xba9344['x'],_0x24a7be);const _0x57a238=ImageManager[_0x2f18('0x34a')]+0x4;_0xba9344['x']+=_0x57a238,_0xba9344['width']-=_0x57a238;}}this[_0x2f18('0x4e6')](ColorManager[_0x2f18('0x41e')]()),this[_0x2f18('0x430')](this[_0x2f18('0x54')](),_0xba9344['x'],_0xba9344['y'],_0xba9344[_0x2f18('0x410')],_0x2f18('0x2b7'));const _0x2d46b8=this[_0x2f18('0x237')](this[_0x2f18('0x54')]())+0x6;;_0xba9344['x']+=_0x2d46b8,_0xba9344['width']-=_0x2d46b8,this[_0x2f18('0x111')]();const _0x627daa=this[_0x2f18('0x140')](),_0xbf6551=this['textWidth'](this[_0x2f18('0x4ba')]?VisuMZ[_0x2f18('0x193')](this[_0x2f18('0x140')]()):this[_0x2f18('0x140')]());if(_0xbf6551>_0xba9344[_0x2f18('0x410')])this[_0x2f18('0x430')](VisuMZ['CoreEngine'][_0x2f18('0x4d9')]['Gold'][_0x2f18('0x1b7')],_0xba9344['x'],_0xba9344['y'],_0xba9344[_0x2f18('0x410')],_0x2f18('0x55c'));else{if(_0x2f18('0x5b0')!==_0x2f18('0x130'))this[_0x2f18('0x430')](this['value'](),_0xba9344['x'],_0xba9344['y'],_0xba9344[_0x2f18('0x410')],_0x2f18('0x55c'));else{function _0x24201c(){return _0x48c037(_0x4cd561)[_0x2f18('0x2e1')](_0x2a7566,_0x12ee38)+',';}}}this['resetFontSettings']();},Window_StatusBase[_0x2f18('0x602')][_0x2f18('0x2e5')]=function(_0x35a759,_0x360e9f,_0x4c6bd6,_0x4be378,_0x37922c){_0x4be378=String(_0x4be378||'')[_0x2f18('0x2a0')]();if(VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['Param'][_0x2f18('0xa9')]){if(_0x2f18('0x1d5')===_0x2f18('0x1d5')){const _0x5ac9b8=VisuMZ[_0x2f18('0x19c')](_0x4be378);_0x37922c?(this[_0x2f18('0xfc')](_0x5ac9b8,_0x35a759,_0x360e9f,this[_0x2f18('0x5d5')]()),_0x4c6bd6-=this[_0x2f18('0x5d5')]()+0x2,_0x35a759+=this[_0x2f18('0x5d5')]()+0x2):(this[_0x2f18('0x142')](_0x5ac9b8,_0x35a759+0x2,_0x360e9f+0x2),_0x4c6bd6-=ImageManager[_0x2f18('0x34a')]+0x4,_0x35a759+=ImageManager[_0x2f18('0x34a')]+0x4);}else{function _0x49316f(){_0x3cb35c['CoreEngine'][_0x2f18('0x1e5')][_0x2f18('0xc9')](this),_0x3a9ecd[_0x2f18('0xc3')]()&&this[_0x2f18('0x176')]();}}}const _0x46db67=TextManager[_0x2f18('0x55b')](_0x4be378);this[_0x2f18('0x55a')](),this['changeTextColor'](ColorManager[_0x2f18('0x41e')]());if(_0x37922c)this[_0x2f18('0x65')][_0x2f18('0x313')]=this[_0x2f18('0x3d6')](),this[_0x2f18('0x65')][_0x2f18('0x430')](_0x46db67,_0x35a759,_0x360e9f,_0x4c6bd6,this[_0x2f18('0x5d5')](),'left');else{if(_0x2f18('0x114')===_0x2f18('0x114'))this[_0x2f18('0x430')](_0x46db67,_0x35a759,_0x360e9f,_0x4c6bd6);else{function _0x2f7cef(){const _0x14d185=this[_0x2f18('0x3fd')]()-this[_0x2f18('0x36a')]()*0x2;this[_0x2f18('0x2e5')](_0x3d8fa6,_0x4c3fc7,_0x14d185,_0x227b36,![]);}}}this[_0x2f18('0x55a')]();},Window_StatusBase['prototype'][_0x2f18('0x3d6')]=function(){return $gameSystem['mainFontSize']()-0x8;},Window_StatusBase[_0x2f18('0x602')][_0x2f18('0x373')]=function(_0x9660ed,_0x1fb65f,_0x2f827f,_0x120853){_0x120853=_0x120853||0xa8,this['resetTextColor']();if(VisuMZ[_0x2f18('0x56f')]['Settings']['UI'][_0x2f18('0x501')])this[_0x2f18('0x146')](_0x9660ed[_0x2f18('0xd5')]()[_0x2f18('0x262')],_0x1fb65f,_0x2f827f,_0x120853);else{if(_0x2f18('0x562')!==_0x2f18('0x432')){const _0x137b6f=_0x9660ed[_0x2f18('0xd5')]()[_0x2f18('0x262')][_0x2f18('0x428')](/\\I\[(\d+)\]/gi,'');this[_0x2f18('0x430')](_0x137b6f,_0x1fb65f,_0x2f827f,_0x120853);}else{function _0x259d8a(){this[_0x2f18('0x557')]['setBackgroundType'](_0x35b386['layoutSettings'][_0x2f18('0x360')]);}}}},Window_StatusBase[_0x2f18('0x602')]['drawActorNickname']=function(_0xbae16d,_0x117917,_0x306286,_0x107132){_0x107132=_0x107132||0x10e,this[_0x2f18('0x111')]();if(VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['UI'][_0x2f18('0x9b')])this[_0x2f18('0x146')](_0xbae16d[_0x2f18('0x46b')](),_0x117917,_0x306286,_0x107132);else{if('KZuqN'===_0x2f18('0x4e3')){const _0x395e9a=_0xbae16d[_0x2f18('0x46b')]()[_0x2f18('0x428')](/\\I\[(\d+)\]/gi,'');this[_0x2f18('0x430')](_0xbae16d['nickname'](),_0x117917,_0x306286,_0x107132);}else{function _0x31d240(){this[_0x2f18('0x12a')][_0x2f18('0x18d')](_0x17ca31[_0x2f18('0x526')][_0x2f18('0x5b1')]);}}}},VisuMZ[_0x2f18('0x56f')]['Window_StatusBase_drawActorLevel']=Window_StatusBase[_0x2f18('0x602')][_0x2f18('0x81')],Window_StatusBase[_0x2f18('0x602')]['drawActorLevel']=function(_0x2ce961,_0xc8f18b,_0x156ad9){if(this['isExpGaugeDrawn']())this['drawActorExpGauge'](_0x2ce961,_0xc8f18b,_0x156ad9);VisuMZ[_0x2f18('0x56f')][_0x2f18('0x209')][_0x2f18('0xc9')](this,_0x2ce961,_0xc8f18b,_0x156ad9);},Window_StatusBase[_0x2f18('0x602')]['isExpGaugeDrawn']=function(){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['UI'][_0x2f18('0xd0')];},Window_StatusBase[_0x2f18('0x602')][_0x2f18('0x1f8')]=function(_0x271790,_0x233ba6,_0xa0d7a4){if(!_0x271790)return;if(!_0x271790[_0x2f18('0x34f')]())return;const _0x4de859=0x80,_0x5a5a4a=_0x271790[_0x2f18('0x49f')]();let _0x261ba6=ColorManager[_0x2f18('0x257')](),_0x4609bc=ColorManager['expGaugeColor2']();_0x5a5a4a>=0x1&&(_0x261ba6=ColorManager[_0x2f18('0x517')](),_0x4609bc=ColorManager[_0x2f18('0x2e7')]()),this[_0x2f18('0x270')](_0x233ba6,_0xa0d7a4,_0x4de859,_0x5a5a4a,_0x261ba6,_0x4609bc);},Window_EquipStatus['prototype'][_0x2f18('0x172')]=function(){let _0x5a39c3=0x0;for(const _0x23570a of VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x41a')][_0x2f18('0x2d1')]){if(_0x2f18('0x529')===_0x2f18('0x541')){function _0x7a08cc(){this[_0x2f18('0x3eb')]=![],this[_0x2f18('0x2fe')]=![];}}else{const _0x4480fb=this['itemPadding'](),_0x2a6465=this[_0x2f18('0x23e')](_0x5a39c3);this[_0x2f18('0x1f0')](_0x4480fb,_0x2a6465,_0x23570a),_0x5a39c3++;}}},Window_EquipStatus[_0x2f18('0x602')][_0x2f18('0x507')]=function(_0x560672,_0x57d623,_0x192f17){const _0x143b96=this[_0x2f18('0x3fd')]()-this[_0x2f18('0x36a')]()*0x2;this['drawParamText'](_0x560672,_0x57d623,_0x143b96,_0x192f17,![]);},Window_EquipStatus[_0x2f18('0x602')][_0x2f18('0x3c')]=function(_0x280a9c,_0x3aad29,_0xadc991){const _0x401b1e=this[_0x2f18('0x502')]();this[_0x2f18('0x111')](),this[_0x2f18('0x430')](this[_0x2f18('0x1d8')][_0x2f18('0x124')](_0xadc991,!![]),_0x280a9c,_0x3aad29,_0x401b1e,_0x2f18('0x55c'));},Window_EquipStatus[_0x2f18('0x602')][_0x2f18('0x167')]=function(_0x207e1f,_0x4973b1){const _0x3daf25=this['rightArrowWidth']();this[_0x2f18('0x4e6')](ColorManager[_0x2f18('0x41e')]());const _0x59400e=VisuMZ['CoreEngine'][_0x2f18('0x4d9')]['UI']['ParamArrow'];this[_0x2f18('0x430')](_0x59400e,_0x207e1f,_0x4973b1,_0x3daf25,_0x2f18('0x4fb'));},Window_EquipStatus[_0x2f18('0x602')][_0x2f18('0x1bb')]=function(_0x27a466,_0x264e8d,_0x534e83){const _0x49da35=this['paramWidth'](),_0x5c7bc8=this[_0x2f18('0x29e')]['paramValueByName'](_0x534e83),_0x322db1=_0x5c7bc8-this[_0x2f18('0x1d8')][_0x2f18('0x124')](_0x534e83);this[_0x2f18('0x4e6')](ColorManager['paramchangeTextColor'](_0x322db1)),this[_0x2f18('0x430')](VisuMZ[_0x2f18('0xe2')](_0x5c7bc8,0x0),_0x27a466,_0x264e8d,_0x49da35,_0x2f18('0x55c'));},Window_StatusParams['prototype']['maxItems']=function(){return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['Param'][_0x2f18('0x2d1')][_0x2f18('0xc7')];},Window_StatusParams[_0x2f18('0x602')][_0x2f18('0x1f0')]=function(_0x134238){const _0x5235a4=this[_0x2f18('0x540')](_0x134238),_0x48f68c=VisuMZ['CoreEngine'][_0x2f18('0x4d9')][_0x2f18('0x41a')][_0x2f18('0x2d1')][_0x134238],_0x1c2f15=TextManager[_0x2f18('0x55b')](_0x48f68c),_0x3f8b15=this['_actor'][_0x2f18('0x124')](_0x48f68c,!![]);this['drawParamText'](_0x5235a4['x'],_0x5235a4['y'],0xa0,_0x48f68c,![]),this[_0x2f18('0x111')](),this[_0x2f18('0x430')](_0x3f8b15,_0x5235a4['x']+0xa0,_0x5235a4['y'],0x3c,_0x2f18('0x55c'));},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4cd')]=Window_ShopSell[_0x2f18('0x602')]['isEnabled'],Window_ShopSell[_0x2f18('0x602')][_0x2f18('0x244')]=function(_0xa530ad){if(VisuMZ[_0x2f18('0x56f')]['Settings'][_0x2f18('0xe0')][_0x2f18('0x103')]&&DataManager[_0x2f18('0x3fa')](_0xa530ad)){if(_0x2f18('0x292')==='IgShN')return![];else{function _0x58b2b1(){this[_0x2f18('0x4ba')]=_0x932a78;}}}else return VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4cd')][_0x2f18('0xc9')](this,_0xa530ad);},Window_NumberInput[_0x2f18('0x602')][_0x2f18('0x4cc')]=function(){return![];},Window_TitleCommand[_0x2f18('0x290')]=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x53d')],Window_TitleCommand['prototype'][_0x2f18('0x52b')]=function(){this[_0x2f18('0x376')]();},Window_TitleCommand[_0x2f18('0x602')][_0x2f18('0x376')]=function(){for(const _0x21260f of Window_TitleCommand[_0x2f18('0x290')]){if(_0x21260f[_0x2f18('0x385')]['call'](this)){if(_0x2f18('0x27e')==='kOUlC'){function _0x3e31fc(){_0x4d9dfc[_0x2f18('0x56f')]['Sprite_Button_initialize'][_0x2f18('0xc9')](this,_0x57d34e),this[_0x2f18('0x397')]();}}else{const _0x310a75=_0x21260f[_0x2f18('0x5ab')];let _0x5e41a7=_0x21260f[_0x2f18('0x1f5')];if(['',_0x2f18('0x5f5')][_0x2f18('0x547')](_0x5e41a7))_0x5e41a7=_0x21260f[_0x2f18('0x3db')]['call'](this);const _0x1e7c9d=_0x21260f[_0x2f18('0x1ab')][_0x2f18('0xc9')](this),_0x9d2163=_0x21260f['ExtJS'][_0x2f18('0xc9')](this);this[_0x2f18('0x536')](_0x5e41a7,_0x310a75,_0x1e7c9d,_0x9d2163),this[_0x2f18('0x6f')](_0x310a75,_0x21260f[_0x2f18('0x288')][_0x2f18('0x415')](this,_0x9d2163));}}}},Window_GameEnd[_0x2f18('0x290')]=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')]['MenuLayout']['GameEnd'][_0x2f18('0x266')],Window_GameEnd['prototype'][_0x2f18('0x52b')]=function(){this['makeCoreEngineCommandList']();},Window_GameEnd['prototype']['makeCoreEngineCommandList']=function(){for(const _0x3241bf of Window_GameEnd['_commandList']){if(_0x2f18('0x5b9')!==_0x2f18('0x5b9')){function _0x210510(){this[_0x2f18('0x58b')]['setBackgroundType'](_0x402cf0[_0x2f18('0x526')][_0x2f18('0x4e7')]);}}else{if(_0x3241bf['ShowJS'][_0x2f18('0xc9')](this)){if(_0x2f18('0x304')===_0x2f18('0x48')){function _0x77c58d(){return 0x0;}}else{const _0xf07469=_0x3241bf[_0x2f18('0x5ab')];let _0x695070=_0x3241bf[_0x2f18('0x1f5')];if(['',_0x2f18('0x5f5')][_0x2f18('0x547')](_0x695070))_0x695070=_0x3241bf['TextJS'][_0x2f18('0xc9')](this);const _0x31a136=_0x3241bf['EnableJS'][_0x2f18('0xc9')](this),_0x195b37=_0x3241bf[_0x2f18('0x4df')][_0x2f18('0xc9')](this);this['addCommand'](_0x695070,_0xf07469,_0x31a136,_0x195b37),this[_0x2f18('0x6f')](_0xf07469,_0x3241bf[_0x2f18('0x288')][_0x2f18('0x415')](this,_0x195b37));}}}}};function Window_ButtonAssist(){this[_0x2f18('0x2f6')](...arguments);}Window_ButtonAssist[_0x2f18('0x602')]=Object[_0x2f18('0x406')](Window_Base[_0x2f18('0x602')]),Window_ButtonAssist[_0x2f18('0x602')][_0x2f18('0x17c')]=Window_ButtonAssist,Window_ButtonAssist[_0x2f18('0x602')][_0x2f18('0x2f6')]=function(_0x5c4706){this[_0x2f18('0x18')]={},Window_Base[_0x2f18('0x602')][_0x2f18('0x2f6')][_0x2f18('0xc9')](this,_0x5c4706),this[_0x2f18('0x18d')](VisuMZ['CoreEngine'][_0x2f18('0x4d9')]['ButtonAssist'][_0x2f18('0x91')]||0x0),this[_0x2f18('0x232')]();},Window_ButtonAssist[_0x2f18('0x602')]['makeFontBigger']=function(){this[_0x2f18('0x65')][_0x2f18('0x313')]<=0x60&&(this[_0x2f18('0x65')][_0x2f18('0x313')]+=0x6);},Window_ButtonAssist['prototype'][_0x2f18('0x2d9')]=function(){if(this[_0x2f18('0x65')][_0x2f18('0x313')]>=0x18){if(_0x2f18('0x17e')!==_0x2f18('0x17e')){function _0x13b17f(){this[_0x2f18('0x3cb')]();}}else this[_0x2f18('0x65')][_0x2f18('0x313')]-=0x6;}},Window_ButtonAssist[_0x2f18('0x602')][_0x2f18('0x3ff')]=function(){Window_Base[_0x2f18('0x602')][_0x2f18('0x3ff')]['call'](this),this[_0x2f18('0x3a9')]();},Window_ButtonAssist[_0x2f18('0x602')][_0x2f18('0x337')]=function(){this['padding']=SceneManager[_0x2f18('0x4fe')][_0x2f18('0x50f')]()!==_0x2f18('0x1a9')?0x0:0x8;},Window_ButtonAssist[_0x2f18('0x602')][_0x2f18('0x3a9')]=function(){const _0x1123e3=SceneManager['_scene'];for(let _0x501702=0x1;_0x501702<=0x5;_0x501702++){if(_0x2f18('0x7d')===_0x2f18('0x7d')){if(this[_0x2f18('0x18')][_0x2f18('0x5bb')['format'](_0x501702)]!==_0x1123e3[_0x2f18('0x264')[_0x2f18('0x1fe')](_0x501702)]()){if(_0x2f18('0x567')===_0x2f18('0x567'))return this[_0x2f18('0x232')]();else{function _0x27639c(){_0x79edef+=_0x2f18('0x22f');}}}if(this[_0x2f18('0x18')][_0x2f18('0x5f')[_0x2f18('0x1fe')](_0x501702)]!==_0x1123e3[_0x2f18('0x10c')[_0x2f18('0x1fe')](_0x501702)]())return this[_0x2f18('0x232')]();}else{function _0x5a829b(){const _0x125d9c=_0x111fcc['gameTitle'],_0x55d49f=_0x2d851d[_0x2f18('0x3ae')]||'',_0x50ba7a=_0x54c742[_0x2f18('0x3a7')]||'',_0x552656=_0x20dabe[_0x2f18('0x56f')][_0x2f18('0x4d9')]['MenuLayout']['Title'][_0x2f18('0x5d6')],_0x55176f=_0x552656[_0x2f18('0x1fe')](_0x125d9c,_0x55d49f,_0x50ba7a);_0xf06181[_0x2f18('0x347')]=_0x55176f;}}}},Window_ButtonAssist[_0x2f18('0x602')]['refresh']=function(){this[_0x2f18('0x65')][_0x2f18('0x561')]();for(let _0x26bc49=0x1;_0x26bc49<=0x5;_0x26bc49++){if(_0x2f18('0x113')!==_0x2f18('0x459'))this['drawSegment'](_0x26bc49);else{function _0x53030e(){_0x1c3f8e[_0x2f18('0x56f')]['Scene_Item_create'][_0x2f18('0xc9')](this),this['setCoreEngineUpdateWindowBg']();}}}},Window_ButtonAssist[_0x2f18('0x602')][_0x2f18('0x464')]=function(_0x4020b3){const _0x3638cf=this[_0x2f18('0x4a0')]/0x5,_0x549729=SceneManager[_0x2f18('0x4fe')],_0x4e66e4=_0x549729[_0x2f18('0x264')[_0x2f18('0x1fe')](_0x4020b3)](),_0x1f7882=_0x549729[_0x2f18('0x10c')[_0x2f18('0x1fe')](_0x4020b3)]();this['_data'][_0x2f18('0x5bb')[_0x2f18('0x1fe')](_0x4020b3)]=_0x4e66e4,this[_0x2f18('0x18')][_0x2f18('0x5f')[_0x2f18('0x1fe')](_0x4020b3)]=_0x1f7882;if(_0x4e66e4==='')return;if(_0x1f7882==='')return;const _0x6d5d05=_0x549729['buttonAssistOffset%1'[_0x2f18('0x1fe')](_0x4020b3)](),_0x2a9154=this[_0x2f18('0x36a')](),_0x3ae5e9=_0x3638cf*(_0x4020b3-0x1)+_0x2a9154+_0x6d5d05,_0x35d5af=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x1fd')][_0x2f18('0x4ca')];this['drawTextEx'](_0x35d5af['format'](_0x4e66e4,_0x1f7882),_0x3ae5e9,0x0,_0x3638cf-_0x2a9154*0x2);},VisuMZ[_0x2f18('0x1b8')]=function(_0x65807f){if(Utils[_0x2f18('0x25b')](_0x2f18('0x4e8'))){if(_0x2f18('0x434')===_0x2f18('0x434')){var _0x43fcff=require('nw.gui')[_0x2f18('0x1e8')][_0x2f18('0x445')]();SceneManager[_0x2f18('0x144')]();if(_0x65807f)setTimeout(_0x43fcff[_0x2f18('0xb7')][_0x2f18('0x415')](_0x43fcff),0x190);}else{function _0x417cb9(){return this[_0x2f18('0x444')]()&&this[_0x2f18('0x55f')]<this[_0x2f18('0x5d8')]*_0x54869f[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x41a')][_0x2f18('0x581')];}}}},VisuMZ[_0x2f18('0x3b6')]=function(_0x44d378,_0x5162da){_0x5162da=_0x5162da[_0x2f18('0x2a0')]();var _0x59f5d0=1.70158,_0x3d927b=0.7;switch(_0x5162da){case _0x2f18('0x260'):return _0x44d378;case _0x2f18('0x14e'):return-0x1*Math[_0x2f18('0x37')](_0x44d378*(Math['PI']/0x2))+0x1;case'OUTSINE':return Math[_0x2f18('0x310')](_0x44d378*(Math['PI']/0x2));case _0x2f18('0xd6'):return-0.5*(Math[_0x2f18('0x37')](Math['PI']*_0x44d378)-0x1);case _0x2f18('0x2be'):return _0x44d378*_0x44d378;case'OUTQUAD':return _0x44d378*(0x2-_0x44d378);case _0x2f18('0x153'):return _0x44d378<0.5?0x2*_0x44d378*_0x44d378:-0x1+(0x4-0x2*_0x44d378)*_0x44d378;case'INCUBIC':return _0x44d378*_0x44d378*_0x44d378;case _0x2f18('0x21b'):var _0x7724f1=_0x44d378-0x1;return _0x7724f1*_0x7724f1*_0x7724f1+0x1;case _0x2f18('0x409'):return _0x44d378<0.5?0x4*_0x44d378*_0x44d378*_0x44d378:(_0x44d378-0x1)*(0x2*_0x44d378-0x2)*(0x2*_0x44d378-0x2)+0x1;case _0x2f18('0xd9'):return _0x44d378*_0x44d378*_0x44d378*_0x44d378;case _0x2f18('0xe5'):var _0x7724f1=_0x44d378-0x1;return 0x1-_0x7724f1*_0x7724f1*_0x7724f1*_0x7724f1;case _0x2f18('0x278'):var _0x7724f1=_0x44d378-0x1;return _0x44d378<0.5?0x8*_0x44d378*_0x44d378*_0x44d378*_0x44d378:0x1-0x8*_0x7724f1*_0x7724f1*_0x7724f1*_0x7724f1;case _0x2f18('0x75'):return _0x44d378*_0x44d378*_0x44d378*_0x44d378*_0x44d378;case _0x2f18('0x518'):var _0x7724f1=_0x44d378-0x1;return 0x1+_0x7724f1*_0x7724f1*_0x7724f1*_0x7724f1*_0x7724f1;case _0x2f18('0x2d8'):var _0x7724f1=_0x44d378-0x1;return _0x44d378<0.5?0x10*_0x44d378*_0x44d378*_0x44d378*_0x44d378*_0x44d378:0x1+0x10*_0x7724f1*_0x7724f1*_0x7724f1*_0x7724f1*_0x7724f1;case'INEXPO':if(_0x44d378===0x0)return 0x0;return Math[_0x2f18('0x276')](0x2,0xa*(_0x44d378-0x1));case _0x2f18('0x136'):if(_0x44d378===0x1)return 0x1;return-Math[_0x2f18('0x276')](0x2,-0xa*_0x44d378)+0x1;case _0x2f18('0x253'):if(_0x44d378===0x0||_0x44d378===0x1){if('WTRaf'!==_0x2f18('0x1f2'))return _0x44d378;else{function _0x1fbe80(){const _0x2eee45=_0x51cba2['CoreEngine'][_0x2f18('0x4d9')][_0x2f18('0x56c')][_0x49eab6],_0x5017f8=_0x2f18('0x86')['format'](_0x1187b2);for(const _0x3c7496 of _0x2eee45){_0x4ef053[_0x2f18('0x35e')](_0x5017f8,_0x3c7496);}}}}var _0x29ad6d=_0x44d378*0x2,_0x14deb4=_0x29ad6d-0x1;if(_0x29ad6d<0x1)return 0.5*Math[_0x2f18('0x276')](0x2,0xa*_0x14deb4);return 0.5*(-Math['pow'](0x2,-0xa*_0x14deb4)+0x2);case _0x2f18('0x108'):var _0x29ad6d=_0x44d378/0x1;return-0x1*(Math[_0x2f18('0x92')](0x1-_0x29ad6d*_0x44d378)-0x1);case _0x2f18('0x4b'):var _0x7724f1=_0x44d378-0x1;return Math['sqrt'](0x1-_0x7724f1*_0x7724f1);case'INOUTCIRC':var _0x29ad6d=_0x44d378*0x2,_0x14deb4=_0x29ad6d-0x2;if(_0x29ad6d<0x1)return-0.5*(Math[_0x2f18('0x92')](0x1-_0x29ad6d*_0x29ad6d)-0x1);return 0.5*(Math[_0x2f18('0x92')](0x1-_0x14deb4*_0x14deb4)+0x1);case _0x2f18('0xe3'):return _0x44d378*_0x44d378*((_0x59f5d0+0x1)*_0x44d378-_0x59f5d0);case _0x2f18('0x11e'):var _0x29ad6d=_0x44d378/0x1-0x1;return _0x29ad6d*_0x29ad6d*((_0x59f5d0+0x1)*_0x29ad6d+_0x59f5d0)+0x1;break;case _0x2f18('0xcd'):var _0x29ad6d=_0x44d378*0x2,_0x3a2de0=_0x29ad6d-0x2,_0x338208=_0x59f5d0*1.525;if(_0x29ad6d<0x1)return 0.5*_0x29ad6d*_0x29ad6d*((_0x338208+0x1)*_0x29ad6d-_0x338208);return 0.5*(_0x3a2de0*_0x3a2de0*((_0x338208+0x1)*_0x3a2de0+_0x338208)+0x2);case _0x2f18('0x554'):if(_0x44d378===0x0||_0x44d378===0x1){if(_0x2f18('0x5a')===_0x2f18('0x5a'))return _0x44d378;else{function _0x5ba742(){if(!this[_0x2f18('0x3ea')])return;if(this['_coreEasing'][_0x2f18('0xb0')]<=0x0)return;this['x']=this[_0x2f18('0x55')](this['x'],this[_0x2f18('0x3ea')][_0x2f18('0x21')]),this['y']=this[_0x2f18('0x55')](this['y'],this[_0x2f18('0x3ea')][_0x2f18('0x280')]),this[_0x2f18('0x455')]['x']=this[_0x2f18('0x55')](this['scale']['x'],this[_0x2f18('0x3ea')][_0x2f18('0x3f4')]),this[_0x2f18('0x455')]['y']=this[_0x2f18('0x55')](this[_0x2f18('0x455')]['y'],this['_coreEasing'][_0x2f18('0x4d8')]),this['opacity']=this[_0x2f18('0x55')](this[_0x2f18('0x7a')],this[_0x2f18('0x3ea')][_0x2f18('0x241')]),this[_0x2f18('0x2c8')]=this[_0x2f18('0x55')](this['backOpacity'],this[_0x2f18('0x3ea')]['targetBackOpacity']),this[_0x2f18('0x6e')]=this[_0x2f18('0x55')](this['contentsOpacity'],this[_0x2f18('0x3ea')][_0x2f18('0x2b5')]),this[_0x2f18('0x3ea')][_0x2f18('0xb0')]--;}}}var _0x29ad6d=_0x44d378/0x1,_0x14deb4=_0x29ad6d-0x1,_0x35fb46=0x1-_0x3d927b,_0x338208=_0x35fb46/(0x2*Math['PI'])*Math[_0x2f18('0x1c0')](0x1);return-(Math[_0x2f18('0x276')](0x2,0xa*_0x14deb4)*Math['sin']((_0x14deb4-_0x338208)*(0x2*Math['PI'])/_0x35fb46));case'OUTELASTIC':var _0x35fb46=0x1-_0x3d927b,_0x29ad6d=_0x44d378*0x2;if(_0x44d378===0x0||_0x44d378===0x1)return _0x44d378;var _0x338208=_0x35fb46/(0x2*Math['PI'])*Math[_0x2f18('0x1c0')](0x1);return Math[_0x2f18('0x276')](0x2,-0xa*_0x29ad6d)*Math[_0x2f18('0x310')]((_0x29ad6d-_0x338208)*(0x2*Math['PI'])/_0x35fb46)+0x1;case _0x2f18('0x339'):var _0x35fb46=0x1-_0x3d927b;if(_0x44d378===0x0||_0x44d378===0x1){if(_0x2f18('0x2aa')!==_0x2f18('0x12f'))return _0x44d378;else{function _0x579979(){for(const _0x1092f3 of this[_0x2f18('0x3ec')]){this[_0x2f18('0x285')](_0x1092f3);}}}}var _0x29ad6d=_0x44d378*0x2,_0x14deb4=_0x29ad6d-0x1,_0x338208=_0x35fb46/(0x2*Math['PI'])*Math[_0x2f18('0x1c0')](0x1);if(_0x29ad6d<0x1){if(_0x2f18('0x49b')==='VSgIp')return-0.5*(Math[_0x2f18('0x276')](0x2,0xa*_0x14deb4)*Math[_0x2f18('0x310')]((_0x14deb4-_0x338208)*(0x2*Math['PI'])/_0x35fb46));else{function _0x1ff6d6(){return _0x320f69[_0x2f18('0x3cc')]()-0x8;}}}return Math[_0x2f18('0x276')](0x2,-0xa*_0x14deb4)*Math[_0x2f18('0x310')]((_0x14deb4-_0x338208)*(0x2*Math['PI'])/_0x35fb46)*0.5+0x1;case _0x2f18('0x600'):var _0x29ad6d=_0x44d378/0x1;if(_0x29ad6d<0x1/2.75){if('udERo'==='udERo')return 7.5625*_0x29ad6d*_0x29ad6d;else{function _0x3e5481(){var _0x4182e6=_0x2f13ba(_0x3cd0a6['$1']);_0x381825+=_0x4182e6;}}}else{if(_0x29ad6d<0x2/2.75){if(_0x2f18('0x24f')==='LZuyi'){var _0x3a2de0=_0x29ad6d-1.5/2.75;return 7.5625*_0x3a2de0*_0x3a2de0+0.75;}else{function _0x36b71f(){this[_0x2f18('0x3d4')][_0x64f2da]=_0x2f18('0x258')[_0x2f18('0x1fe')](_0xd0a6bd(_0x4927cb['$1']));}}}else{if(_0x29ad6d<2.5/2.75){if(_0x2f18('0x2ae')==='YXyyL'){function _0x147199(){_0x4460ea+=_0x3de9e4(_0x5c0484);}}else{var _0x3a2de0=_0x29ad6d-2.25/2.75;return 7.5625*_0x3a2de0*_0x3a2de0+0.9375;}}else{var _0x3a2de0=_0x29ad6d-2.625/2.75;return 7.5625*_0x3a2de0*_0x3a2de0+0.984375;}}}case _0x2f18('0x577'):var _0x566951=0x1-VisuMZ[_0x2f18('0x3b6')](0x1-_0x44d378,_0x2f18('0x537'));return _0x566951;case'INOUTBOUNCE':if(_0x44d378<0.5){if('gYXul'!==_0x2f18('0x367')){function _0x4a3d71(){this['initialize'](...arguments);}}else var _0x566951=VisuMZ[_0x2f18('0x3b6')](_0x44d378*0x2,_0x2f18('0x3f7'))*0.5;}else var _0x566951=VisuMZ[_0x2f18('0x3b6')](_0x44d378*0x2-0x1,_0x2f18('0x537'))*0.5+0.5;return _0x566951;default:return _0x44d378;}},VisuMZ[_0x2f18('0x19c')]=function(_0x3c38f5){_0x3c38f5=String(_0x3c38f5)[_0x2f18('0x2a0')]();const _0x30f9d5=VisuMZ[_0x2f18('0x56f')]['Settings'][_0x2f18('0x41a')];if(_0x3c38f5===_0x2f18('0x89'))return _0x30f9d5['IconParam0'];if(_0x3c38f5===_0x2f18('0x3dd'))return _0x30f9d5[_0x2f18('0x1dd')];if(_0x3c38f5===_0x2f18('0x50'))return _0x30f9d5[_0x2f18('0x1c')];if(_0x3c38f5===_0x2f18('0x5a3'))return _0x30f9d5[_0x2f18('0x1f7')];if(_0x3c38f5===_0x2f18('0x1d'))return _0x30f9d5[_0x2f18('0x447')];if(_0x3c38f5==='MDF')return _0x30f9d5[_0x2f18('0x2e0')];if(_0x3c38f5===_0x2f18('0x40b'))return _0x30f9d5['IconParam6'];if(_0x3c38f5===_0x2f18('0xc4'))return _0x30f9d5['IconParam7'];if(_0x3c38f5===_0x2f18('0xc'))return _0x30f9d5[_0x2f18('0x2d7')];if(_0x3c38f5===_0x2f18('0x590'))return _0x30f9d5['IconXParam1'];if(_0x3c38f5===_0x2f18('0x42c'))return _0x30f9d5[_0x2f18('0x438')];if(_0x3c38f5===_0x2f18('0xe8'))return _0x30f9d5[_0x2f18('0x4d1')];if(_0x3c38f5===_0x2f18('0x60'))return _0x30f9d5['IconXParam4'];if(_0x3c38f5===_0x2f18('0x20a'))return _0x30f9d5['IconXParam5'];if(_0x3c38f5===_0x2f18('0x56b'))return _0x30f9d5[_0x2f18('0x461')];if(_0x3c38f5===_0x2f18('0x559'))return _0x30f9d5[_0x2f18('0x54b')];if(_0x3c38f5===_0x2f18('0x3df'))return _0x30f9d5['IconXParam8'];if(_0x3c38f5===_0x2f18('0x454'))return _0x30f9d5[_0x2f18('0xbc')];if(_0x3c38f5===_0x2f18('0x3f1'))return _0x30f9d5[_0x2f18('0x259')];if(_0x3c38f5===_0x2f18('0x94'))return _0x30f9d5[_0x2f18('0x4d4')];if(_0x3c38f5==='REC')return _0x30f9d5['IconSParam2'];if(_0x3c38f5===_0x2f18('0x20e'))return _0x30f9d5[_0x2f18('0x364')];if(_0x3c38f5===_0x2f18('0x96'))return _0x30f9d5[_0x2f18('0x365')];if(_0x3c38f5===_0x2f18('0x1c3'))return _0x30f9d5['IconSParam5'];if(_0x3c38f5===_0x2f18('0x7b'))return _0x30f9d5[_0x2f18('0xdd')];if(_0x3c38f5==='MDR')return _0x30f9d5[_0x2f18('0x4c4')];if(_0x3c38f5==='FDR')return _0x30f9d5[_0x2f18('0x50b')];if(_0x3c38f5===_0x2f18('0x293'))return _0x30f9d5[_0x2f18('0x125')];return 0x0;},VisuMZ[_0x2f18('0xe2')]=function(_0x2f4c74,_0x5b0716){if(_0x2f4c74%0x1===0x0)return _0x2f4c74;return _0x5b0716=_0x5b0716||0x0,String((_0x2f4c74*0x64)['toFixed'](_0x5b0716))+'%';},VisuMZ[_0x2f18('0x193')]=function(_0x102a2e){_0x102a2e=String(_0x102a2e);if(!_0x102a2e)return _0x102a2e;if(typeof _0x102a2e!==_0x2f18('0x5de'))return _0x102a2e;const _0x543c7a=VisuMZ['CoreEngine'][_0x2f18('0x4d9')]['QoL']['DigitGroupingLocale']||'en-US',_0x471eb3={'maximumFractionDigits':0x6};_0x102a2e=_0x102a2e[_0x2f18('0x428')](/\[(.*?)\]/g,(_0x454ca1,_0x4e9c44)=>{return VisuMZ[_0x2f18('0x32e')](_0x4e9c44,'[',']');}),_0x102a2e=_0x102a2e[_0x2f18('0x428')](/<(.*?)>/g,(_0x3fcb79,_0x49ea15)=>{if(_0x2f18('0x2ce')!==_0x2f18('0x404'))return VisuMZ[_0x2f18('0x32e')](_0x49ea15,'<','>');else{function _0x5a73a4(){const _0xf1e79a=this[_0x2f18('0x3b2')]();_0x5f5373[_0x2f18('0x320')](_0x2f18('0xf5'))&&this[_0x2f18('0x1b0')](_0x5c06bc[_0x2f18('0xcf')](this[_0x2f18('0x3b2')](),0x0)),_0x4e23cf[_0x2f18('0x320')](_0x2f18('0x165'))&&this[_0x2f18('0x1b0')](_0x587fd3[_0x2f18('0x586')](this[_0x2f18('0x3b2')](),this[_0x2f18('0x582')]()-0x1)),this[_0x2f18('0x3b2')]()!==_0xf1e79a&&this[_0x2f18('0x427')]();}}}),_0x102a2e=_0x102a2e[_0x2f18('0x428')](/\{\{(.*?)\}\}/g,(_0x5ba379,_0x3362cc)=>{return VisuMZ[_0x2f18('0x32e')](_0x3362cc,'','');}),_0x102a2e=_0x102a2e[_0x2f18('0x428')](/(\d+\.?\d*)/g,(_0x168d98,_0x2951bc)=>{let _0x2bb6c2=_0x2951bc;if(_0x2bb6c2[0x0]==='0')return _0x2bb6c2;if(_0x2bb6c2[_0x2bb6c2[_0x2f18('0xc7')]-0x1]==='.')return Number(_0x2bb6c2)[_0x2f18('0x2e1')](_0x543c7a,_0x471eb3)+'.';else{if(_0x2bb6c2[_0x2bb6c2[_0x2f18('0xc7')]-0x1]===',')return Number(_0x2bb6c2)[_0x2f18('0x2e1')](_0x543c7a,_0x471eb3)+',';else{if(_0x2f18('0x3bc')===_0x2f18('0x20')){function _0x4bbf1f(){return _0x1ff25e[_0x2f18('0x56f')]['Settings'][_0x2f18('0x1e8')][_0x2f18('0x126')];}}else return Number(_0x2bb6c2)[_0x2f18('0x2e1')](_0x543c7a,_0x471eb3);}}});let _0xea407e=0x3;while(_0xea407e--){_0x102a2e=VisuMZ[_0x2f18('0x336')](_0x102a2e);}return _0x102a2e;},VisuMZ[_0x2f18('0x32e')]=function(_0x3da9b9,_0x2e85c4,_0x314346){return _0x3da9b9=_0x3da9b9[_0x2f18('0x428')](/(\d)/gi,(_0x2c650f,_0x42ce90)=>_0x2f18('0x546')['format'](Number(_0x42ce90))),_0x2f18('0x3c9')[_0x2f18('0x1fe')](_0x3da9b9,_0x2e85c4,_0x314346);},VisuMZ[_0x2f18('0x336')]=function(_0x3b690a){return _0x3b690a=_0x3b690a[_0x2f18('0x428')](/PRESERVCONVERSION\((\d+)\)/gi,(_0x1973f6,_0x42d985)=>Number(parseInt(_0x42d985))),_0x3b690a;},VisuMZ[_0x2f18('0x5c6')]=function(_0x523830){SoundManager['playOk']();if(!Utils[_0x2f18('0x400')]()){const _0x266d0c=window[_0x2f18('0x203')](_0x523830,_0x2f18('0x3e2'));}else{if('BTZwQ'!=='BTZwQ'){function _0x2b1512(){if(!this['showFauxAnimations']())return;_0x2daa31=_0x13dc27||![],_0x19926e=_0x2646f1||![];if(_0x447c2c[_0x4cc1e9]){const _0x406778={'targets':_0x4d08fd,'animationId':_0x25ad46,'mirror':_0x59623d,'mute':_0x486bf9};this[_0x2f18('0x31d')][_0x2f18('0x2c9')](_0x406778);for(const _0x2dfb24 of _0x36069f){_0x2dfb24['startAnimation']&&_0x2dfb24[_0x2f18('0x204')]();}}}}else{const _0xf17831=process['platform']==_0x2f18('0x59d')?_0x2f18('0x203'):process['platform']==_0x2f18('0xf4')?_0x2f18('0x596'):_0x2f18('0x504');require(_0x2f18('0x5ac'))[_0x2f18('0x26b')](_0xf17831+'\x20'+_0x523830);}}},Sprite_Clickable[_0x2f18('0x602')][_0x2f18('0x2a2')]=function(){if(this['isClickEnabled']()){if('UevRC'!==_0x2f18('0x13a')){function _0x2f07bf(){let _0x11eff6=this[_0x2f18('0x3b2')]();const _0x2a036b=this['maxItems'](),_0x391764=this[_0x2f18('0x1ec')]();if(this[_0x2f18('0x4cc')]()&&(_0x11eff6<_0x2a036b||_0x157dc4&&_0x391764===0x1)){_0x11eff6+=_0x391764;if(_0x11eff6>=_0x2a036b)_0x11eff6=_0x2a036b-0x1;this[_0x2f18('0x1b0')](_0x11eff6);}else!this[_0x2f18('0x4cc')]()&&((_0x11eff6<_0x2a036b-_0x391764||_0x2af4cf&&_0x391764===0x1)&&this[_0x2f18('0x1b0')]((_0x11eff6+_0x391764)%_0x2a036b));}}else{if(this[_0x2f18('0x1c7')]()){if(_0x2f18('0x154')!==_0x2f18('0x154')){function _0x36b06d(){return'';}}else{if(!this[_0x2f18('0x2fe')]&&TouchInput[_0x2f18('0x169')]()){if(_0x2f18('0x242')!==_0x2f18('0x3c4'))this[_0x2f18('0x2fe')]=!![],this[_0x2f18('0x5b')]();else{function _0x134963(){return _0x2f654a[_0x2f18('0x56f')][_0x2f18('0x4d9')][_0x2f18('0x1fd')][_0x2f18('0x331')];}}}TouchInput[_0x2f18('0x320')]()&&(this[_0x2f18('0x3eb')]=!![],this[_0x2f18('0x7e')]());}}else{if(_0x2f18('0x565')!==_0x2f18('0x22d'))this[_0x2f18('0x2fe')]&&this['onMouseExit'](),this['_pressed']=![],this['_hovered']=![];else{function _0x11a7b3(){return _0x2a1ac9['CoreEngine'][_0x2f18('0x4d9')]['Color'][_0x2f18('0x348')];}}}if(this[_0x2f18('0x3eb')]&&TouchInput[_0x2f18('0x49c')]()){if(_0x2f18('0xa')!=='cxOmx')this['_pressed']=![],this[_0x2f18('0x560')]();else{function _0x145304(){_0x4c1976[_0x2f18('0x56f')][_0x2f18('0x4d9')]['UI'][_0x2f18('0x2')]?this[_0x2f18('0x3f0')](_0x20bad3):_0x402584['CoreEngine'][_0x2f18('0x5db')][_0x2f18('0xc9')](this,_0x3c12d5);}}}}}else this['_pressed']=![],this[_0x2f18('0x2fe')]=![];},VisuMZ[_0x2f18('0x56f')]['Game_Interpreter_command231']=Game_Interpreter[_0x2f18('0x602')][_0x2f18('0x1ee')],Game_Interpreter['prototype'][_0x2f18('0x1ee')]=function(_0x45cb91){const _0x21efe7=_0x45cb91[0x2],_0x7fc40=VisuMZ[_0x2f18('0x56f')]['Game_Interpreter_command231'][_0x2f18('0xc9')](this,_0x45cb91),_0x1df95a=$gameScreen[_0x2f18('0x201')](_0x45cb91[0x0]);if(_0x1df95a)_0x1df95a[_0x2f18('0x355')]([{'x':0x0,'y':0x0},{'x':0.5,'y':0.5}][_0x21efe7]);return _0x7fc40;},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x1fb')]=Game_Interpreter[_0x2f18('0x602')]['command232'],Game_Interpreter[_0x2f18('0x602')][_0x2f18('0x11c')]=function(_0x42f786){const _0x2cf288=_0x42f786[0x2],_0x2eb8ee=VisuMZ[_0x2f18('0x56f')][_0x2f18('0x1fb')][_0x2f18('0xc9')](this,_0x42f786),_0x493bf5=$gameScreen[_0x2f18('0x201')](_0x42f786[0x0]);if(_0x493bf5)_0x493bf5[_0x2f18('0x516')]([{'x':0x0,'y':0x0},{'x':0.5,'y':0.5}][_0x2cf288]);return _0x2eb8ee;},Game_Picture['prototype'][_0x2f18('0x515')]=function(){return this['_anchor'];},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x2f4')]=Game_Picture[_0x2f18('0x602')]['initBasic'],Game_Picture[_0x2f18('0x602')][_0x2f18('0x4a8')]=function(){VisuMZ[_0x2f18('0x56f')][_0x2f18('0x2f4')][_0x2f18('0xc9')](this),this['_anchor']={'x':0x0,'y':0x0};},VisuMZ[_0x2f18('0x56f')][_0x2f18('0x552')]=Game_Picture[_0x2f18('0x602')]['updateMove'],Game_Picture[_0x2f18('0x602')][_0x2f18('0x534')]=function(){this[_0x2f18('0x5fd')](),VisuMZ[_0x2f18('0x56f')]['Game_Picture_updateMove'][_0x2f18('0xc9')](this);},Game_Picture[_0x2f18('0x602')][_0x2f18('0x5fd')]=function(){this[_0x2f18('0x2fa')]>0x0&&(this[_0x2f18('0x56e')]['x']=this[_0x2f18('0x528')](this[_0x2f18('0x56e')]['x'],this['_targetAnchor']['x']),this[_0x2f18('0x56e')]['y']=this[_0x2f18('0x528')](this[_0x2f18('0x56e')]['y'],this[_0x2f18('0x1aa')]['y']));},Game_Picture[_0x2f18('0x602')][_0x2f18('0x355')]=function(_0xa36002){this[_0x2f18('0x56e')]=_0xa36002,this[_0x2f18('0x1aa')]=JsonEx[_0x2f18('0x284')](this[_0x2f18('0x56e')]);},Game_Picture[_0x2f18('0x602')][_0x2f18('0x516')]=function(_0x26f786){this[_0x2f18('0x1aa')]=_0x26f786;},VisuMZ['CoreEngine'][_0x2f18('0x4ef')]=Sprite_Picture[_0x2f18('0x602')][_0x2f18('0x4aa')],Sprite_Picture[_0x2f18('0x602')][_0x2f18('0x4aa')]=function(){const _0xf38952=this[_0x2f18('0x201')]();if(!_0xf38952[_0x2f18('0x515')]())VisuMZ[_0x2f18('0x56f')][_0x2f18('0x4ef')][_0x2f18('0xc9')](this);else{if('mvJcc'===_0x2f18('0x30b')){function _0x37ff8d(){_0x16b689['setSideView'](![]);}}else this[_0x2f18('0x515')]['x']=_0xf38952[_0x2f18('0x515')]()['x'],this[_0x2f18('0x515')]['y']=_0xf38952['anchor']()['y'];}},Game_Action[_0x2f18('0x602')]['setEnemyAction']=function(_0x5e1e5d){if(_0x5e1e5d){if('CVpFx'!==_0x2f18('0x53c')){function _0x3ffc64(){return _0x1629ff[_0x2f18('0x8')];}}else{const _0x3b1755=_0x5e1e5d[_0x2f18('0x1d9')];if(_0x3b1755===0x1&&this[_0x2f18('0x1d2')]()[_0x2f18('0x527')]()!==0x1)this[_0x2f18('0x472')]();else _0x3b1755===0x2&&this[_0x2f18('0x1d2')]()[_0x2f18('0x87')]()!==0x2?this[_0x2f18('0x38a')]():this[_0x2f18('0x42b')](_0x3b1755);}}else this[_0x2f18('0x561')]();},Game_Actor[_0x2f18('0x602')][_0x2f18('0x164')]=function(){return this[_0x2f18('0x4b5')]()['filter'](_0x4892d5=>this[_0x2f18('0x159')](_0x4892d5)&&this[_0x2f18('0x403')]()[_0x2f18('0x547')](_0x4892d5[_0x2f18('0x46')]));},Window_Base[_0x2f18('0x602')][_0x2f18('0x173')]=function(){if(this['_dimmerSprite']){const _0x357a98=this[_0x2f18('0x1e2')][_0x2f18('0x1bf')],_0x2d052c=this[_0x2f18('0x410')],_0x2089f3=this[_0x2f18('0x1c6')],_0x232215=this[_0x2f18('0x59a')],_0x44c6b7=ColorManager[_0x2f18('0x36d')](),_0x593327=ColorManager[_0x2f18('0x1a6')]();_0x357a98[_0x2f18('0x318')](_0x2d052c,_0x2089f3),_0x357a98[_0x2f18('0x2df')](0x0,0x0,_0x2d052c,_0x232215,_0x593327,_0x44c6b7,!![]),_0x357a98[_0x2f18('0x44b')](0x0,_0x232215,_0x2d052c,_0x2089f3-_0x232215*0x2,_0x44c6b7),_0x357a98[_0x2f18('0x2df')](0x0,_0x2089f3-_0x232215,_0x2d052c,_0x232215,_0x44c6b7,_0x593327,!![]),this[_0x2f18('0x1e2')][_0x2f18('0x485')](0x0,0x0,_0x2d052c,_0x2089f3);}};