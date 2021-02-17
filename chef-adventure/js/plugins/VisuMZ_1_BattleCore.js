//=============================================================================
// VisuStella MZ - Battle Core
// VisuMZ_1_BattleCore.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_1_BattleCore = true;

var VisuMZ = VisuMZ || {};
VisuMZ.BattleCore = VisuMZ.BattleCore || {};
VisuMZ.BattleCore.version = 1.25;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 1] [Version 1.25] [BattleCore]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Battle_Core_VisuStella_MZ
 * @orderAfter VisuMZ_0_CoreEngine
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * The Battle Core plugin revamps the battle engine provided by RPG Maker MZ to
 * become more flexible, streamlined, and support a variety of features. The
 * updated battle engine allows for custom Action Sequences, battle layout
 * styles, and a lot of control over the battle mechanics, too.
 *
 * Features include all (but not limited to) the following:
 * 
 * * Action Sequence Plugin Commands to give you full control over what happens
 *   during the course of a skill or item.
 * * Animated Sideview Battler support for enemies!
 * * Auto Battle options for party-wide and actor-only instances.
 * * Base Troop Events to quickly streamline events for all Troop events.
 * * Battle Command control to let you change which commands appear for actors.
 * * Battle Layout styles to change the way the battle scene looks.
 * * Casting animation support for skills.
 * * Critical Hit control over the success rate formula and damage multipliers.
 * * Custom target scopes added for skills and items.
 * * Damage formula control, including Damage Styles.
 * * Damage caps, both hard caps and soft caps.
 * * Damage traits such Armor Penetration/Reduction to bypass defenses.
 * * Elements & Status Menu Core support for traits.
 * * Multitude of JavaScript notetags and global Plugin Parameters to let you
 *   make a variety of effects across various instances during battle.
 * * Party Command window can be skipped/disabled entirely.
 * * Weather effects now show in battle.
 * * Streamlined Battle Log to remove redundant information and improve the
 *   flow of battle.
 * * Visual HP Gauges can be displayed above the heads of actors and/or enemies
 *   with a possible requirement for enemies to be defeated at least once first
 *   in order for them to show.
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
 * This plugin will overwrite some core parts of the RPG Maker MZ base code in
 * order to ensure the Battle Core plugin will work at full capacity. The
 * following are explanations of what has been changed.
 *
 * ---
 *
 * Action Sequences
 *
 * - Action sequences are now done either entirely by the Battle Log Window or
 * through common events if the <Custom Action Sequence> notetag is used.
 * In RPG Maker MZ by default, Action Sequences would be a mixture of using the
 * Battle Log Window, the Battle Manager, and the Battle Scene, making it hard
 * to fully grab control of the situation.
 *
 * ---
 *
 * Action Speed
 *
 * - Action speeds determine the turn order in the default battle system. The
 * AGI of a battle unit is also taken into consideration. However, the random
 * variance applied to the action speed system makes the turn order extremely
 * chaotic and hard for the player to determine. Thus, the random variance
 * aspect of it has been turned off. This can be reenabled by default through
 * Plugin Parameters => Mechanics Settings => Allow Random Speed?
 *
 * ---
 *
 * Animated Sideview Battler Support For Enemies
 *
 * - Enemies can now use Sideview Actor sprites for themselves! They will
 * behave like actors and can even carry their own set of weapons for physical
 * attacks. These must be set up using notetags. More information can be found
 * in the notetag section.
 *
 * - As the sprites are normally used for actors, some changes have been made
 * to Sprite_Actor to be able to support both actors and enemies. These changes
 * should have minimal impact on other plugins.
 *
 * ---
 *
 * Battle Sprite Updates
 *
 * - A lot of functions in Sprite_Battler, Sprite_Actor, and Sprite_Enemy have
 * been overwritten to make the new Action Sequence system added by this plugin
 * possible. These changes make it possible for the sprites to move anywhere on
 * the screen, jump, float, change visibility, and more.
 *
 * ---
 *
 * Change Battle Back in Battle
 * 
 * - By default, the Change Battle Back event command does not work in battle.
 * Any settings made to it will only reflect in the following battle. Now, if
 * the battle back event command is used during battle, it will reflect upon
 * any new changes immediately.
 *
 * ---
 *
 * Critical Hit - LUK Influence
 *
 * - The LUK Buffs now affect the critical hit rate based off how the formula
 * is now calculated. Each stack of a LUK Buff will double the critical hit
 * rate and compound upon that. That means a x1 LUK Buff stack will raise it by
 * x2, a x2 LUK Buff stack will raise the critical hit rate by x4, a x3 LUK
 * Buff Stack will raise the critical hit rate stack by x8, and so on.
 *
 * - LUK also plays a role in how much damage is dealt with critical hits. The
 * default critical hit multiplier has been reduced from x3 to x2. However, a
 * percentage of LUK will added on (based off the user's CRI rate) onto the
 * finalized critical damage. If the user's CRI rate is 4%, then 4% of the user
 * LUK value will also be added onto the damage.
 *
 * - This change can be altered through Plugin Parameters => Damage Settings =>
 * Critical Hits => JS: Rate Formula and JS: Damage Formula.
 *
 * ---
 * 
 * Damage Popups
 * 
 * - Damage popups are now formatted with + and - to determine healing and
 * damage. MP Damage will also include "MP" at the back. This is to make it
 * clearer what each colored variant of the damage popup means as well as help
 * color blind players read the on-screen data properly.
 * 
 * - Damage popups have also been rewritten to show all changed aspects instead
 * of just one. Previously with RPG Maker MZ, if an action would deal both HP
 * and MP damage, only one of them would show. Now, everything is separated and
 * both HP and MP changes will at a time.
 * 
 * ---
 * 
 * Dual Wielding
 * 
 * - Previously, RPG Maker MZ had "Dual Wielding" attack using both weapon
 * animations at once, with the combined ATK of each weapon. It's confusing to
 * look at and does not portray the nature of "Dual Wielding".
 * 
 * - Dual Wielding, or in the case of users adding in third and fourth weapons,
 * Multi Wielding is now changed. Each weapon is displayed individually, each
 * producing its own attack animation, showing each weapon type, and applying
 * only that weapon's ATK, Traits, and related effects. It is no longer a
 * combined effect to display everything at once like RPG Maker MZ default.
 * 
 * - If an actor has multiple weapon slots but some of them are unequipped,
 * then the action will treat the attack as a single attack. There will be no
 * barehanded attack to add on top of it. This is to match RPG Maker MZ's
 * decision to omit a second animation if the same scenario is applied.
 * 
 * ---
 *
 * Force Action
 *
 * - Previously, Forced Actions would interrupt the middle of an event to
 * perform an action. However, with the addition of more flexible Action
 * Sequences, the pre-existing Force Action system would not be able to exist
 * and would require being remade.
 *
 * - Forced Actions now are instead, added to a separate queue from the action
 * battler list. Whenever an action and/or common event is completed, then if
 * there's a Forced Action battler queued, then the Forced Action battler will
 * have its turn. This is the cleanest method available and avoids the most
 * conflicts possible.
 *
 * - This means if you planned to make cinematic sequences with Forced Actions,
 * you will need to account for the queued Force Actions. However, in the case
 * of battle cinematics, we would highly recommend that you use the newly added
 * Action Sequence Plugin Commands instead as those give you more control than
 * any Force Action ever could.
 *
 * ---
 *
 * Random Scope
 *
 * - The skill and item targeting scopes for Random Enemy, 2 Random Enemies,
 * 3 Random Enemies, 4 Random Enemies will now ignore TGR and utilize true
 * randomness.
 *
 * ---
 *
 * Spriteset_Battle Update
 *
 * - The spriteset now has extra containers to separate battlers (actors and
 * enemies), animations, and damage. This is to make actors and enemy battler
 * sprites more efficient to sort (if enabled), so that animations won't
 * interfere with and cover damage sprites, and to make sure damage sprites are
 * unaffected by screen tints in order to ensure the player will always have a
 * clear read on the information relaying sprites.
 *
 * ---
 *
 * Weather Displayed in Battle
 *
 * - Previously, weather has not been displayed in battle. This means that any
 * weather effects placed on the map do not transfer over to battle and causes
 * a huge disconnect for players. The Battle Core plugin will add weather
 * effects to match the map's weather conditions. Any changes made to weather
 * through event commands midway through battle will also be reflected.
 *
 * ---
 *
 * ============================================================================
 * Base Troops
 * ============================================================================
 *
 * Base Troops can be found, declared, and modified in the Plugin Parameters =>
 * Mechanics Settings => Base Troop ID's. All of the listed Troop ID's here
 * will have their page events replicated and placed under all other troops
 * found in the database.
 *
 * ---
 *
 * This means that if you have an event that runs on Turn 1 of a Base Troop,
 * then for every troop out there, that same event will also run on Turn 1,
 * as well. This is useful for those who wish to customize their battle system
 * further and to reduce the amount of work needed to copy/paste said event
 * pages into every database troop object manually.
 *
 * ---
 *
 * ============================================================================
 * Damage Styles
 * ============================================================================
 *
 * Damage Styles are a new feature added through the Battle Core plugin. When
 * using certain Battle Styles, you can completely ignore typing in the whole
 * damage formula inside the damage formula input box, and instead, insert
 * either a power amount or a multiplier depending on the Damage Style. The
 * plugin will then automatically calculate damage using that value factoring
 * in ATK, DEF, MAT, MDF values.
 *
 * ---
 *
 * Here is a list of the Damage Styles that come with this plugin by default.
 * You can add in your own and even edit them to your liking.
 * Or just remove them if you want.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 * Style          Use Formula As   PH/MA Disparity   Stat Scale   Damage Scale
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 * Standard       Formula          No                Varies       Varies
 * ArmorScaling   Formula          No                Varies       Varies
 * CT             Multiplier       Yes               Low          Normal
 * D4             Multiplier       No                High         Normal
 * DQ             Multiplier       No                Low          Low
 * FF7            Power            Yes               Low          High
 * FF8            Power            Yes               Medium       Normal
 * FF9            Power            Yes               Low          Normal
 * FF10           Power            Yes               Medium       High
 * MK             Multiplier       No                Medium       Low
 * MOBA           Multiplier       No                Medium       Normal
 * PKMN           Power            No                Low          Normal
 *
 * Use the above chart to figure out which Damage Style best fits your game,
 * if you plan on using them.
 *
 * The 'Standard' style is the same as the 'Manual' formula input, except that
 * it allows for the support of <Armor Penetration> and <Armor Reduction>
 * notetags.
 *
 * The 'Armor Scaling' style allows you to type in the base damage calculation
 * without the need to type in any defending modifiers.
 *
 * NOTE: While these are based off the damage formulas found in other games,
 * not all of them are exact replicas. Many of them are adapted for use in
 * RPG Maker MZ since not all RPG's use the same set of parameters and not all
 * external multipliers function the same way as RPG Maker MZ.
 * 
 * ---
 *
 * Style:
 * - This is what the Damage Style is.
 *
 * Use Formula As:
 * - This is what you insert into the formula box.
 * - Formula: Type in the formula for the action just as you would normally.
 * - Multiplier: Type in the multiplier for the action.
 *     Use float values. This means 250% is typed out as 2.50
 * - Power: Type in the power constant for the action.
 *     Use whole numbers. Type in something like 16 for a power constant.
 * 
 * PH/MA Disparity:
 * - Is there a disparity between how Physical Attacks and Magical Attacks
 *   are calculated?
 * - If yes, then physical attacks and magical attacks will have different
 *   formulas used.
 * - If no, then physical attacks and magical attacks will share similar
 *   formulas for how they're calculated.
 *
 * Stat Scale:
 * - How much should stats scale throughout the game?
 * - Low: Keep them under 100 for the best results.
 * - Medium: Numbers work from low to mid 400's for best results.
 * - High: The numbers really shine once they're higher.
 *
 * Damage Scale:
 * - How much does damage vary depending on small parameter changes?
 * - Low: Very little increase from parameter changes.
 * - Normal: Damage scales close to proportionally with parameter changes.
 * - High: Damage can boost itself drastically with parameter changes.
 *
 * ---
 *
 * To determine what kind of parameters are used for the Damage Styles, they
 * will depend on two things: the action's 'Hit Type' (ie Physical Attack,
 * Magical Attack, and Certain Hit) and the action's 'Damage Type' (ie. Damage,
 * Recovery, or Drain).
 *
 * Certain Hit tends to use whichever value is higher: ATK or MAT, and then
 * ignores the target's defense values. Use Certain Hits for 'True Damage'.
 *
 * Use the chart below to figure out everything else:
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 * Hit Type      Damage Type   Attacker Parameter   Defender Parameter
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 * Physical      Damage        ATK                  DEF
 * Magical       Damage        MAT                  MDF
 * Certain Hit   Damage        Larger (ATK, MAT)    -Ignores-
 * Physical      Recover       DEF                  -Ignores-
 * Magical       Recover       MDF                  -Ignores-
 * Certain Hit   Recover       Larger (ATK, MAT)    -Ignores-
 * Physical      Drain         ATK                  DEF
 * Magical       Drain         MAT                  MDF
 * Certain Hit   Drain         Larger (ATK, MAT)    -Ignores-
 *
 * These can be modified within the Plugin Parameters in the individual
 * Damage Styles themselves.
 *
 * ---
 *
 * Skills and Items can use different Damage Styles from the setting you've
 * selected in the Plugin Parameters. They can be altered to have different
 * Damage Styles through the usage of a notetag:
 *
 * <Damage Style: name>
 *
 * This will use whichever style is found in the Plugin Parameters.
 *
 * If "Manual" is used, then no style will be used and all calculations will be
 * made strictly based off the formula found inside the formula box.
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
 * === HP Gauge-Related Notetags ===
 * 
 * The following notetags allow you to set whether or not HP Gauges can be
 * displayed by enemies regardless of Plugin Parameter settings.
 * 
 * ---
 *
 * <Show HP Gauge>
 *
 * - Used for: Enemy Notetags
 * - Will always show the HP Gauge for the enemy regardless of the defeat
 *   requirement setting.
 * - This does not bypass the player's Options preferences.
 * - This does not bypass disabling enemy HP Gauges as a whole.
 * 
 * ---
 *
 * <Hide HP Gauge>
 *
 * - Used for: Enemy Notetags
 * - Will always hide the HP Gauge for the enemy regardless of the defeat
 *   requirement setting.
 * - This does not bypass the player's Options preferences.
 * 
 * ---
 * 
 * <Battle UI Offset: +x, +y>
 * <Battle UI Offset: -x, -y>
 * 
 * <Battle UI Offset X: +x>
 * <Battle UI Offset X: -x>
 * 
 * <Battle UI Offset Y: +y>
 * <Battle UI Offset Y: -y>
 * 
 * - Used for: Actor and Enemy Notetags
 * - Adjusts the offset of HP Gauges and State Icons above the heads of actors
 *   and enemies.
 * - Replace 'x' with a number value that offsets the x coordinate.
 * - Negative x values offset left. Positive x values offset right.
 * - Replace 'y' with a number value that offsets the y coordinate.
 * - Negative y values offset up. Positive x values offset down.
 * 
 * ---
 *
 * === Animation-Related Notetags ===
 *
 * The following notetags allow you to set animations to play at certain
 * instances and/or conditions.
 *
 * ---
 *
 * <Slip Animation: x>
 *
 * - Requires VisuMZ_0_CoreEngine!
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - During the phase at which the user regenerates HP, MP, or TP, this
 *   animation will play as long as the user is alive and visible.
 * - Replace 'x' with a number value representing the Animation ID to play.
 *
 * ---
 *
 * <Cast Animation: x>
 *
 * - Used for: Skill Notetags
 * - Plays a battle animation at the start of the skill.
 * - Replace 'x' with a number value representing the Animation ID to play.
 *
 * ---
 *
 * <Attack Animation: x>
 *
 * - Used for: Enemy Notetags
 * - Gives an enemy an attack animation to play for its basic attack.
 * - Replace 'x' with a number value representing the Animation ID to play.
 *
 * ---
 *
 * === Battleback-Related Notetags ===
 *
 * You can apply these notetags to have some control over the battlebacks that
 * appear in different regions of the map for random or touch encounters.
 *
 * ---
 *
 * <Region x Battleback1: filename>
 * <Region x Battleback2: filename>
 * 
 * - Used for: Map Notetags
 * - If the player starts a battle while standing on 'x' region, then the
 *   'filename' battleback will be used.
 * - Replace 'x' with a number representing the region ID you wish to use.
 * - Replace 'filename' with the filename of the graphic to use. Do not insert
 *   any extensions. This means the file 'Castle1.png' will be only inserted
 *   as 'Castle1' without the '.png' at the end.
 * - *NOTE: This will override any specified battleback settings.
 *
 * ---
 *
 * === Battle Command-Related Notetags ===
 *
 * You can use notetags to change how the battle commands of playable
 * characters appear in battle as well as whether or not they can be used.
 *
 * ---
 *
 * <Seal Attack>
 * <Seal Guard>
 * <Seal Item>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Prevents specific battle commands from being able to be used.
 *
 * ---
 *
 * <Battle Commands>
 *  Attack
 *  Skills
 *  SType: x
 *  SType: name
 *  All Skills
 *  Skill: x
 *  Skill: name
 *  Guard
 *  Item
 *  Party
 *  Escape
 *  Auto Battle
 *  Combat Log
 * </Battle Commands>
 *
 * - Used for: Class Notetags
 * - Changes which commands appear in the Actor Command Window in battle.
 *   If this notetag is not used, then the default commands determined in
 *   Plugin Parameters => Actor Command Window => Command List will be used.
 * - Add/remove/modify entries as needed.
 *
 * - Attack 
 *   - Adds the basic attack command.
 * 
 * - Skills
 *   - Displays all the skill types available to the actor.
 * 
 * - SType: x
 * - Stype: name
 *   - Adds in a specific skill type.
 *   - Replace 'x' with the ID of the skill type.
 *   - Replace 'name' with the name of the skill type (without text codes).
 *
 * - All Skills
 *   - Adds all usable battle skills as individual actions.
 * 
 * - Skill: x
 * - Skill: name
 *   - Adds in a specific skill as a usable action.
 *   - Replace 'x' with the ID of the skill.
 *   - Replace 'name' with the name of the skill.
 * 
 * - Guard
 *   - Adds the basic guard command.
 * 
 * - Item
 *   - Adds the basic item command.
 *
 * - Party
 *   - Requires VisuMZ_2_PartySystem.
 *   - Allows this actor to switch out with a different party member.
 * 
 * - Escape
 *   - Adds the escape command.
 * 
 * - Auto Battle
 *   - Adds the auto battle command.
 *
 * Example:
 *
 * <Battle Commands>
 *  Attack
 *  Skill: Heal
 *  Skills
 *  Guard
 *  Item
 *  Escape
 * </Battle Commands>
 *
 * ---
 *
 * <Command Text: x>
 *
 * - Used for: Skill Notetags
 * - When a skill is used in a <Battle Commands> notetag set, you can change
 *   the skill name text that appears to something else.
 * - Replace 'x' with the skill's name you want to shown in the Actor Battle
 *   Command window.
 * - Recommended Usage: Shorten skill names that are otherwise too big to fit
 *   inside of the Actor Battle Command window.
 *
 * ---
 *
 * <Command Icon: x>
 *
 * - Used for: Skill Notetags
 * - When a skill is used in a <Battle Commands> notetag set, you can change
 *   the skill icon that appears to something else.
 * - Replace 'x' with the ID of icon you want shown in the Actor Battle Command
 *   window to represent the skill.
 *
 * ---
 * 
 * <Command Show Switch: x>
 * 
 * <Command Show All Switches: x,x,x>
 * <Command Show Any Switches: x,x,x>
 * 
 * - Used for: Skill Notetags
 * - Determines if a battle command is visible or not through switches.
 * - Replace 'x' with the switch ID to determine the skill's visibility.
 * - If 'All' notetag variant is used, item will be hidden until all
 *   switches are ON. Then, it would be shown.
 * - If 'Any' notetag variant is used, item will be shown if any of the
 *   switches are ON. Otherwise, it would be hidden.
 * - This can be applied to Attack and Guard commands, too.
 * 
 * ---
 * 
 * <Command Hide Switch: x>
 * 
 * <Command Hide All Switches: x,x,x>
 * <Command Hide Any Switches: x,x,x>
 * 
 * - Used for: Skill Notetags
 * - Determines if a battle command is visible or not through switches.
 * - Replace 'x' with the switch ID to determine the skill's visibility.
 * - If 'All' notetag variant is used, item will be shown until all
 *   switches are ON. Then, it would be hidden.
 * - If 'Any' notetag variant is used, item will be hidden if any of the
 *   switches are ON. Otherwise, it would be shown.
 * - This can be applied to Attack and Guard commands, too.
 * 
 * ---
 * 
 * <Battle Portrait: filename>
 *
 * - Used for: Actor
 * - This is used with the "Portrait" Battle Layout.
 * - Sets the battle portrait image for the actor to 'filename'.
 * - Replace 'filename' with a picture found within your game project's
 *   img/pictures/ folder. Filenames are case sensitive. Leave out the filename
 *   extension from the notetag.
 * - This will override any menu images used for battle only.
 * 
 * ---
 * 
 * <Battle Portrait Offset: +x, +y>
 * <Battle Portrait Offset: -x, -y>
 * 
 * <Battle Portrait Offset X: +x>
 * <Battle Portrait Offset X: -x>
 * 
 * <Battle Portrait Offset Y: +y>
 * <Battle Portrait Offset Y: -y>
 *
 * - Used for: Actor
 * - This is used with the "Portrait" and "Border" Battle Layouts.
 * - Offsets the X and Y coordinates for the battle portrait.
 * - Replace 'x' with a number value that offsets the x coordinate.
 * - Negative x values offset left. Positive x values offset right.
 * - Replace 'y' with a number value that offsets the y coordinate.
 * - Negative y values offset up. Positive x values offset down.
 * 
 * ---
 * 
 * === JavaScript Notetag: Battle Command-Related ===
 *
 * The following are notetags made for users with JavaScript knowledge to
 * determine if skill-based battle commands are visible or hidden.
 * 
 * ---
 * 
 * <JS Command Visible>
 *  code
 *  code
 *  visible = code;
 * </JS Command Visible>
 * 
 * - Used for: Skill Notetags
 * - The 'visible' variable is the final returned variable to determine the
 *   skill's visibility in the Battle Command Window.
 * - Replace 'code' with JavaScript code to determine the skill's visibility in
 *   the Battle Command Window.
 * - The 'user' variable represents the user who will perform the skill.
 * - The 'skill' variable represents the skill to be used.
 * 
 * ---
 *
 * === Targeting-Related Notetags ===
 *
 * The following notetags are related to the targeting aspect of skills and
 * items and may adjust the scope of how certain skills/items work.
 *
 * ---
 *
 * <Always Hit>
 *
 * <Always Hit Rate: x%>
 *
 * - Used for: Skill, Item Notetags
 * - Causes the action to always hit or to always have a hit rate of exactly
 *   the marked x%.
 * - Replace 'x' with a number value representing the hit success percentage.
 *
 * ---
 *
 * <Repeat Hits: x>
 *
 * - Used for: Skill, Item Notetags
 * - Changes the number of hits the action will produce.
 * - Replace 'x' with a number value representing the number of hits to incur.
 *
 * ---
 *
 * <Target: x Random Any>
 *
 * - Used for: Skill, Item Notetags
 * - Makes the skill pick 'x' random targets when used.
 * - Targets can be both actors and enemies.
 * - Replace 'x' with a number value representing the number of random targets.
 *
 * ---
 *
 * <Target: x Random Enemies>
 *
 * - Used for: Skill, Item Notetags
 * - Makes the skill pick 'x' random targets when used.
 * - Targets are only enemies.
 * - Replace 'x' with a number value representing the number of random targets.
 *
 * ---
 *
 * <Target: x Random Allies>
 *
 * - Used for: Skill, Item Notetags
 * - Makes the skill pick 'x' random targets when used.
 * - Targets are only actors.
 * - Replace 'x' with a number value representing the number of random targets.
 *
 * ---
 *
 * <Target: All Allies But User>
 *
 * - Used for: Skill, Item Notetags
 * - Targets all allies with the exception of the user.
 *
 * ---
 *
 * === JavaScript Notetag: Targeting-Related ===
 *
 * ---
 * 
 * <JS Targets>
 *  code
 *  code
 *  targets = [code];
 * </JS Targets>
 *
 * - Used for: Skill, Item Notetags
 * - The 'targets' variable is an array that is returned to be used as a
 *   container for all the valid action targets.
 * - Replace 'code' with JavaScript code to determine valid targets.
 *
 * ---
 *
 * === Damage-Related Notetags ===
 *
 * ---
 *
 * <Damage Style: name>
 *
 * - Used for: Skill, Item Notetags
 * - Replace 'name' with a Damage Style name to change the way calculations are
 *   made using the damage formula input box.
 * - Names can be found in Plugin Parameters => Damage Settings => Style List
 *
 * ---
 *
 * <Armor Reduction: x>
 * <Armor Reduction: x%>
 * - Used for: Actor, Class, Skill, Item, Weapon, Armor, Enemy, State Notetags
 * - If used on skills and/or items, sets the current skill/item's armor
 *   reduction properties to 'x' and/or 'x%'.
 * - If used on trait objects, adds 'x' and/or 'x%' armor reduction properties
 *   when calculating one's own armor.
 * - This applies to physical attacks.
 * - Use the 'x' notetag variant to determine a flat reduction value.
 * - Use the 'x%' notetag variant to determine a percentile reduction value.
 *
 * ---
 *
 * <Armor Penetration: x>
 * <Armor Penetration: x%>
 * - Used for: Actor, Class, Skill, Item, Weapon, Armor, Enemy, State Notetags
 * - If used on skills and/or items, sets the current skill/item's armor
 *   penetration properties to 'x' and/or 'x%'.
 * - If used on trait objects, adds 'x' and/or 'x%' armor penetration
 *   properties when calculating a target's armor.
 * - This applies to physical attacks.
 * - Use the 'x' notetag variant to determine a flat penetration value.
 * - Use the 'x%' notetag variant to determine a percentile penetration value.
 *
 * ---
 *
 * <Magic Reduction: x>
 * <Magic Reduction: x%>
 * - Used for: Actor, Class, Skill, Item, Weapon, Armor, Enemy, State Notetags
 * - If used on skills and/or items, sets the current skill/item's armor
 *   reduction properties to 'x' and/or 'x%'.
 * - If used on trait objects, adds 'x' and/or 'x%' armor reduction properties
 *   when calculating one's own armor.
 * - This applies to magical attacks.
 * - Use the 'x' notetag variant to determine a flat reduction value.
 * - Use the 'x%' notetag variant to determine a percentile reduction value.
 *
 * ---
 *
 * <Magic Penetration: x>
 * <Magic Penetration: x%>
 * - Used for: Actor, Class, Skill, Item, Weapon, Armor, Enemy, State Notetags
 * - If used on skills and/or items, sets the current skill/item's armor
 *   penetration properties to 'x' and/or 'x%'.
 * - If used on trait objects, adds 'x' and/or 'x%' armor penetration
 *   properties when calculating a target's armor.
 * - This applies to magical attacks.
 * - Use the 'x' notetag variant to determine a flat penetration value.
 * - Use the 'x%' notetag variant to determine a percentile penetration value.
 *
 * ---
 *
 * <Bypass Damage Cap>
 * 
 * - Used for: Actor, Class, Skill, Item, Weapon, Armor, Enemy, State Notetags
 * - If used on skills and/or items, this will cause the action to never have
 *   its damage capped.
 * - If used on trait objects, this will cause the affected unit to never have
 *   its damage capped.
 *
 * ---
 *
 * <Damage Cap: x>
 *
 * - Used for: Actor, Class, Skill, Item, Weapon, Armor, Enemy, State Notetags
 * - If used on skills and/or items, this will declare the hard damage cap to
 *   be the 'x' value.
 * - If used on trait objects, this will raise the affect unit's hard damage
 *   cap to 'x' value. If another trait object has a higher value, use that
 *   value instead.
 *
 * ---
 *
 * <Bypass Soft Damage Cap>
 *
 * - Used for: Actor, Class, Skill, Item, Weapon, Armor, Enemy, State Notetags
 * - If used on skills and/or items, this will cause the action to never have
 *   its damage scaled downward to the soft cap.
 * - If used on trait objects, this will cause the affected unit to never have
 *   its damage scaled downward to the soft cap.
 *
 * ---
 *
 * <Soft Damage Cap: +x%>
 * <Soft Damage Cap: -x%>
 *
 * - Used for: Actor, Class, Skill, Item, Weapon, Armor, Enemy, State Notetags
 * - If used on skills and/or items, this will increase/decrease the action's
 *   soft cap by x% where 'x' is a percentage value representing the increment
 *   changed by the hard cap value.
 * - If used on trait objects, this will raise the affect unit's soft damage
 *   limit by x% where 'x' is a percentage value representing the increment
 *   changed by the hard cap value.
 *
 * ---
 *
 * <Unblockable>
 *
 * - Used for: Skill, Item Notetags
 * - Using "Guard" against this skill will not reduce any damage.
 *
 * ---
 *
 * === Critical-Related Notetags ===
 *
 * The following notetags affect skill and item critical hit rates and the
 * critical damage multiplier.
 *
 * ---
 *
 * <Always Critical>
 *
 * - Used for: Skill, Item Notetags
 * - This skill/item will always land a critical hit regardless of the
 *   user's CRI parameter value.
 *
 * ---
 *
 * <Set Critical Rate: x%>
 *
 * - Used for: Skill, Item Notetags
 * - This skill/item will always have a x% change to land a critical hit
 *   regardless of user's CRI parameter value.
 * - Replace 'x' with a percerntage value representing the success rate.
 *
 * ---
 *
 * <Modify Critical Rate: x%>
 * <Modify Critical Rate: +x%>
 * <Modify Critical Rate: -x%>
 *
 * - Used for: Skill, Item Notetags
 * - Modifies the user's CRI parameter calculation for this skill/item.
 * - The 'x%' notetag variant will multiply the user's CRI parameter value
 *   for this skill/item.
 * - The '+x%' and '-x%' notetag variants will incremenetally increase/decrease
 *   the user's CRI parameter value for this skill/item.
 *
 * ---
 *
 * <Modify Critical Multiplier: x%>
 * <Modify Critical Multiplier: +x%>
 * <Modify Critical Multiplier: -x%>
 *
 * - Used for: Skill, Item Notetags
 * - These notetags determine the damage multiplier when a critical hit lands.
 * - The 'x%' notetag variant multiply the multiplier to that exact percentage.
 * - The '+x%' and '-x%' notetag variants will change the multiplier with an
 *   incremenetal rate for this skill/item.
 *
 * ---
 *
 * <Modify Critical Bonus Damage: x%>
 * <Modify Critical Bonus Damage: +x%>
 * <Modify Critical Bonus Damage: -x%>
 *
 * - Used for: Skill, Item Notetags
 * - These notetags determine the bonus damage added when a critical hit lands.
 * - The 'x%' notetag variant multiply the damage to that exact percentage.
 * - The '+x%' and '-x%' notetag variants will change the bonus damage with an
 *   incremenetal rate for this skill/item.
 *
 * ---
 *
 * === JavaScript Notetags: Critical-Related ===
 *
 * The following are notetags made for users with JavaScript knowledge to
 * determine how critical hit-related aspects are calculated.
 *
 * ---
 *
 * <JS Critical Rate>
 *  code
 *  code
 *  rate = code;
 * </JS Critical Rate>
 *
 * - Used for: Skill, Item Notetags
 * - The 'rate' variable is the final returned amount to determine the
 *   critical hit success rate.
 * - Replace 'code' with JavaScript code to determine the final 'rate' to be
 *   returned as the critical hit success rate.
 * - The 'user' variable represents the one using the skill/item.
 * - The 'target' variable represents the one receiving the skill/item hit.
 *
 * ---
 *
 * <JS Critical Damage>
 *  code
 *  code
 *  multiplier = code;
 *  bonusDamage = code;
 * </JS Critical Damage>
 *
 * - Used for: Skill, Item Notetags
 * - The 'multiplier' variable is returned later and used as the damage
 *   multiplier used to amplify the critical damage amount.
 * - The 'bonusDamage' variable is returned later and used as extra added
 *   damage for the critical damage amount.
 * - Replace 'code' with JavaScript code to determine how the 'multiplier' and
 *   'bonusDamage' variables are calculated.
 * - The 'user' variable represents the one using the skill/item.
 * - The 'target' variable represents the one receiving the skill/item hit.
 *
 * ---
 *
 * === Action Sequence-Related Notetags ===
 *
 * Action Sequences allow you full control over how a skill and/or item plays
 * through its course. These notetags give you control over various aspects of
 * those Action Sequences. More information is found in the Action Sequences
 * help section.
 *
 * ---
 *
 * <Custom Action Sequence>
 *
 * - Used for: Skill, Item Notetags
 * - Removes all automated Action Sequence parts from the skill.
 * - Everything Action Sequence-related will be done by Common Events.
 * - Insert Common Event(s) into the skill/item's effects list to make use of
 *   the Custom Action Sequences.
 * - This will prevent common events from loading in the Item Scene and Skill
 *   Scene when used outside of battle.
 *
 * ---
 * 
 * <Auto Action Sequence>
 * 
 * - Used for: Skill, Item Notetags
 * - If the Action Sequence Plugin Parameter "Auto Notetag" is enabled, this
 *   plugin will prevent custom action sequences from happening for the skill
 *   or item, and instead, use an Automatic Action Sequence instead.
 * - Ignore this if you have "Auto Notetag" disabled or set to false.
 * 
 * ---
 * 
 * <Common Event: name>
 *
 * - Used for: Skill, Item Notetags
 * - Battle only: calls forth a Common Event of a matching name.
 * - Replace 'name' with the name of a Common Event to call from when this
 *   skill/item is used in battle.
 *   - Remove any \I[x] in the name.
 * - Insert multiple notetags to call multiple Common Events in succession.
 * - This will occur after any Common Event Trait Effects for the skill/item's
 *   database entry.
 * - This is primarily used for users who are reorganizing around their Common
 *   Events and would still like to have their skills/items perform the correct
 *   Action Sequences in case the ID's are different.
 * 
 * ---
 *
 * <Display Icon: x>
 * <Display Text: string>
 *
 * - Used for: Skill, Item Notetags
 * - When displaying the skill/item name in the Action Sequence, determine the
 *   icon and/or text displayed.
 * - Replace 'x' with a number value representing the icon ID to be displayed.
 * - Replace 'string' with a text value representing the displayed name.
 *
 * ---
 *
 * === Animated Sideview Battler-Related Notetags ===
 *
 * Enemies can use Animated Sideview Actor graphics thanks to this plugin.
 * These notetags give you control over that aspect. Some of these also affect
 * actors in addition to enemies.
 *
 * ---
 *
 * <Sideview Battler: filename>
 *
 * <Sideview Battlers>
 *  filename: weight
 *  filename: weight
 *  filename: weight
 * </Sideview Battlers>
 *
 * - Used for: Enemy Notetags
 * - Replaces the enemy's battler graphic with an animated Sideview Actor
 *   graphic found in the img/sv_actors/ folder.
 * - Replace 'filename' with the filename of the graphic to use. Do not insert
 *   any extensions. This means the file 'Actor1_1.png' will be only inserted
 *   as 'Actor1_1' without the '.png' at the end.
 * - If the multiple notetag vaiant is used, then a random filename is selected
 *   from the list upon the enemy's creation.
 * - Replace 'weight' with a number value representing how often the 'filename'
 *   would come up. The higher the weight, the more often. You may omit this
 *   and the colon(:) and just type in the 'filename' instead.
 * - Add/remove lines as you see fit.
 *
 * Example:
 *
 * <Sideview Battlers>
 *  Actor1_1: 25
 *  Actor1_3: 10
 *  Actor1_5
 *  Actor1_7
 * </Sideview Battlers>
 *
 * ---
 *
 * <Sideview Anchor: x, y>
 *
 * - Used for: Actor, Enemy Notetags
 * - Sets the sprite anchor positions for the sideview sprite.
 * - Replace 'x' and 'y' with numbers depicting where the anchors should be for
 *   the sideview sprite.
 * - By default, the x and y anchors are 0.5 and 1.0.
 *
 * ---
 * 
 * <Sideview Home Offset: +x, +y>
 * <Sideview Home Offset: -x, -y>
 * 
 * - Used for: Actor, Class, Weapon, Armor, State Notetags
 * - Offsets the sideview actor sprite's home position by +/-x, +/-y.
 * - Replace 'x' and 'y' with numbers depicting how much to offset each of the
 *   coordinates by. For '0' values, use +0 or -0.
 * - This notetag will not work if you remove it from the JavaScript code in
 *   Plugin Parameters > Actor > JS:  Home Position
 * 
 * ---
 * 
 * <Sideview Weapon Offset: +x, +y>
 * <Sideview Weapon Offset: -x, -y>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy State Notetags
 * - Offsets the sideview weapon sprite's position by +/-x, +/-y.
 * - Replace 'x' and 'y' with numbers depicting how much to offset each of the
 *   coordinates by. For '0' values, use +0 or -0.
 * 
 * ---
 *
 * <Sideview Show Shadow>
 * <Sideview Hide Shadow>
 *
 * - Used for: Actor, Enemy Notetags
 * - Sets it so the sideview battler's shadow will be visible or hidden.
 *
 * ---
 *
 * <Sideview Collapse>
 * <Sideview No Collapse>
 *
 * - Used for: Enemy Notetags
 * - Either shows the collapse graphic or does not show the collapse graphic.
 * - Collapse graphic means the enemy will 'fade away' once it's defeated.
 * - No collapse graphic means the enemy's corpse will remain on the screen.
 *
 * ---
 *
 * <Sideview Idle Motion: name>
 *
 * <Sideview Idle Motions>
 *  name: weight
 *  name: weight
 *  name: weight
 * </Sideview Idle Motions>
 *
 * - Used for: Enemy Notetags
 * - Changes the default idle motion for the enemy.
 * - Replace 'name' with any of the following motion names:
 *   - 'walk', 'wait', 'chant', 'guard', 'damage', 'evade', 'thrust', 'swing',
 *     'missile', 'skill', 'spell', 'item', 'escape', 'victory', 'dying',
 *     'abnormal', 'sleep', 'dead'
 * - If the multiple notetag vaiant is used, then a random motion name is
 *   selected from the list upon the enemy's creation.
 * - Replace 'weight' with a number value representing how often the 'name'
 *   would come up. The higher the weight, the more often. You may omit this
 *   and the colon(:) and just type in the 'name' instead.
 * - Add/remove lines as you see fit.
 *
 * Example:
 *
 * <Sideview Idle Motions>
 *  walk: 25
 *  wait: 50
 *  guard
 *  victory
 *  abnormal
 * </Sideview Idle Motions>
 *
 * ---
 *
 * <Sideview Size: width, height>
 *
 * - Used for: Enemy Notetags
 * - When using a sideview battler, its width and height will default to the
 *   setting made in Plugin Parameters => Enemy Settings => Size: Width/Height.
 * - This notetag lets you change that value to something else.
 * - Replace 'width' and 'height' with numbers representing how many pixels
 *   wide/tall the sprite will be treated as.
 *
 * ---
 *
 * <Sideview Weapon: weapontype>
 *
 * <Sideview Weapons>
 *  weapontype: weight
 *  weapontype: weight
 *  weapontype: weight
 * </Sideview Weapons>
 *
 * - Used for: Enemy Notetags
 * - Give your sideview enemies weapons to use.
 * - Replace 'weapontype' with the name of the weapon type found under the
 *   Database => Types => Weapon Types list (without text codes).
 * - If the multiple notetag vaiant is used, then a random weapon type is
 *   selected from the list upon the enemy's creation.
 * - Replace 'weight' with a number value representing how often the weapontype
 *   would come up. The higher the weight, the more often. You may omit this
 *   and the colon(:) and just type in the 'weapontype' instead.
 * - Add/remove lines as you see fit.
 *
 * Example:
 *
 * <Sideview Weapons>
 *  Dagger: 25
 *  Sword: 25
 *  Axe
 * </Sideview Weapons>
 *
 * ---
 *
 * <traitname Sideview Battler: filename>
 *
 * <traitname Sideview Battlers>
 *  filename: weight
 *  filename: weight
 *  filename: weight
 * </traitname Sideview Battlers>
 *
 * - Used for: Enemy Notetags
 * - Requires VisuMZ_1_ElementStatusCore
 * - Allows certain Trait Sets to cause battlers to have a unique appearance.
 * - Replace 'filename' with the filename of the graphic to use. Do not insert
 *   any extensions. This means the file 'Actor1_1.png' will be only inserted
 *   as 'Actor1_1' without the '.png' at the end.
 * - If the multiple notetag vaiant is used, then a random filename is selected
 *   from the list upon the enemy's creation.
 * - Replace 'weight' with a number value representing how often the 'filename'
 *   would come up. The higher the weight, the more often. You may omit this
 *   and the colon(:) and just type in the 'filename' instead.
 * - Add/remove lines as you see fit.
 *
 * Examples:
 *
 * <Male Sideview Battlers>
 *  Actor1_1: 25
 *  Actor1_3: 10
 *  Actor1_5
 *  Actor1_7
 * </Male Sideview Battlers>
 *
 * <Female Sideview Battlers>
 *  Actor1_2: 25
 *  Actor1_4: 10
 *  Actor1_6
 *  Actor1_8
 * </Female Sideview Battlers>
 *
 * ---
 *
 * <traitname Sideview Idle Motion: name>
 *
 * <traitname Sideview Idle Motions>
 *  name: weight
 *  name: weight
 *  name: weight
 * </traitname Sideview Idle Motions>
 *
 * - Used for: Enemy Notetags
 * - Requires VisuMZ_1_ElementStatusCore
 * - Allows certain Trait Sets to cause battlers to have unique idle motions.
 * - Replace 'name' with any of the following motion names:
 *   - 'walk', 'wait', 'chant', 'guard', 'damage', 'evade', 'thrust', 'swing',
 *     'missile', 'skill', 'spell', 'item', 'escape', 'victory', 'dying',
 *     'abnormal', 'sleep', 'dead'
 * - If the multiple notetag vaiant is used, then a random motion name is
 *   selected from the list upon the enemy's creation.
 * - Replace 'weight' with a number value representing how often the 'name'
 *   would come up. The higher the weight, the more often. You may omit this
 *   and the colon(:) and just type in the 'name' instead.
 * - Add/remove lines as you see fit.
 *
 * Examples:
 *
 * <Jolly Sideview Idle Motions>
 *  wait: 25
 *  victory: 10
 *  walk
 * </Jolly Sideview Idle Motions>
 *
 * <Serious Sideview Idle Motions>
 *  walk: 25
 *  guard: 10
 *  wait
 * </Jolly Sideview Idle Motions>
 *
 * ---
 *
 * <traitname Sideview Weapon: weapontype>
 *
 * <traitname Sideview Weapons>
 *  weapontype: weight
 *  weapontype: weight
 *  weapontype: weight
 * </traitname Sideview Weapons>
 *
 * - Used for: Enemy Notetags
 * - Requires VisuMZ_1_ElementStatusCore
 * - Allows certain Trait Sets to cause battlers to have unique weapons.
 * - Replace 'weapontype' with the name of the weapon type found under the
 *   Database => Types => Weapon Types list (without text codes).
 * - If the multiple notetag vaiant is used, then a random weapon type is
 *   selected from the list upon the enemy's creation.
 * - Replace 'weight' with a number value representing how often the weapontype
 *   would come up. The higher the weight, the more often. You may omit this
 *   and the colon(:) and just type in the 'weapontype' instead.
 * - Add/remove lines as you see fit.
 *
 * Examples:
 *
 * <Male Sideview Weapons>
 *  Dagger: 25
 *  Sword: 25
 *  Axe
 * </Male Sideview Weapons>
 *
 * <Female Sideview Weapons>
 *  Dagger: 25
 *  Spear: 25
 *  Cane
 * </Female Sideview Weapons>
 *
 * ---
 *
 * === Enemy-Related Notetags ===
 *
 * ---
 *
 * <Battler Sprite Cannot Move>
 *
 * - Used for: Enemy Notetags
 * - Prevents the enemy from being able to move, jump, and/or float due to
 *   Action Sequences. Useful for rooted enemies.
 *
 * ---
 * 
 * <Battler Sprite Grounded>
 *
 * - Used for: Enemy Notetags
 * - Prevents the enemy from being able to jumping and/or floating due to
 *   Action Sequences but still able to move. Useful for rooted enemies.
 * 
 * ---
 *
 * <Swap Enemies>
 *  name: weight
 *  name: weight
 *  name: weight
 * </Swap Enemies>
 *
 * - Used for: Enemy Notetags
 * - Causes this enemy database object to function as a randomizer for any of
 *   the listed enemies inside the notetag. When the enemy is loaded into the
 *   battle scene, the enemy is immediately replaced with one of the enemies
 *   listed. The randomization is based off the 'weight' given to each of the
 *   enemy 'names'.
 * - Replace 'name' with the database enemy of the enemy you wish to replace
 *   the enemy with.
 * - Replace 'weight' with a number value representing how often the 'name'
 *   would come up. The higher the weight, the more often. You may omit this
 *   and the colon(:) and just type in the 'name' instead.
 * - Add/remove lines as you see fit.
 *
 * Example:
 *
 * <Swap Enemies>
 *  Bat: 50
 *  Slime: 25
 *  Orc
 *  Minotaur
 * </Swap Enemies>
 *
 * ---
 *
 * === JavaScript Notetags: Mechanics-Related ===
 *
 * These JavaScript notetags allow you to run code at specific instances during
 * battle provided that the unit has that code associated with them in a trait
 * object (actor, class, weapon, armor, enemy, or state). How you use these is
 * entirely up to you and will depend on your ability to understand the code
 * used and driven for each case.
 *
 * ---
 *
 * <JS Pre-Start Battle>
 *  code
 *  code
 *  code
 * </JS Pre-Start Battle>
 *
 * <JS Post-Start Battle>
 *  code
 *  code
 *  code
 * </JS Post-Start Battle>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs JavaScript code at the start of battle aimed at the function:
 *   BattleManager.startBattle()
 *   - 'Pre' runs before the function runs.
 *   - 'Post' runs after the function runs.
 * - Replace 'code' with JavaScript code to run desired effects.
 * - The 'user' variable represents the one affected by the trait object.
 *
 * ---
 *
 * <JS Pre-Start Turn>
 *  code
 *  code
 *  code
 * </JS Pre-Start Turn>
 *
 * <JS Post-Start Turn>
 *  code
 *  code
 *  code
 * </JS Post-Start Turn>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs JavaScript code at the start of a turn aimed at the function:
 *   BattleManager.startTurn()
 *   - 'Pre' runs before the function runs.
 *   - 'Post' runs after the function runs.
 * - Replace 'code' with JavaScript code to run desired effects.
 * - The 'user' variable represents the one affected by the trait object.
 *
 * ---
 *
 * <JS Pre-Start Action>
 *  code
 *  code
 *  code
 * </JS Pre-Start Action>
 *
 * <JS Post-Start Action>
 *  code
 *  code
 *  code
 * </JS Post-Start Action>
 * 
 * - Used for: Actor, Class, Skill, Item, Weapon, Armor, Enemy, State Notetags
 * - Runs JavaScript code at the start of an action aimed at the function:
 *   BattleManager.startAction()
 *   - 'Pre' runs before the function runs.
 *   - 'Post' runs after the function runs.
 * - If used on skills and/or items, this will only apply to the skill/item
 *   being used and does not affect other skills and items.
 * - If used on trait objects, this will apply to any skills/items used as long
 *   as the unit affected by the trait object has access to the trait object.
 * - Replace 'code' with JavaScript code to run desired effects.
 * - The 'user' variable represents the one affected by the trait object.
 *
 * ---
 *
 * <JS Pre-Apply>
 *  code
 *  code
 *  code
 * </JS Pre-Apply>
 * 
 * - Used for: Skill, Item Notetags
 * - Runs JavaScript code at the start of an action hit aimed at the function:
 *   Game_Action.prototype.apply()
 *   - 'Pre' runs before the function runs.
 * - If used on skills and/or items, this will only apply to the skill/item
 *   being used and does not affect other skills and items.
 * - Replace 'code' with JavaScript code to run desired effects.
 * - The 'user' variable represents the one using the skill/item.
 * - The 'target' variable represents the one receiving the skill/item hit.
 *
 * ---
 *
 * <JS Pre-Apply as User>
 *  code
 *  code
 *  code
 * </JS Pre-Apply as User>
 *
 * <JS Pre-Apply as Target>
 *  code
 *  code
 *  code
 * </JS Pre-Apply as Target>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs JavaScript code at the start of an action hit aimed at the function:
 *   Game_Action.prototype.apply()
 *   - 'Pre' runs before the function runs.
 * - If used on trait objects, this will apply to any skills/items used as long
 *   as the unit affected by the trait object has access to the trait object.
 * - If the 'as User' notetag variant is used, this code will be run as a
 *   response to the action from the action user end.
 * - If the 'as Target' notetag variant is used, this code will be run as a
 *   response to the action from the action target end.
 * - Replace 'code' with JavaScript code to run desired effects.
 * - The 'user' variable represents the one using the skill/item.
 * - The 'target' variable represents the one receiving the skill/item hit.
 *
 * ---
 *
 * <JS Pre-Damage>
 *  code
 *  code
 *  code
 * </JS Pre-Damage>
 * 
 * - Used for: Skill, Item Notetags
 * - Runs JavaScript code before damage is dealt aimed at the function:
 *   Game_Action.prototype.executeDamage()
 *   - 'Pre' runs before the function runs.
 * - If used on skills and/or items, this will only apply to the skill/item
 *   being used and does not affect other skills and items.
 * - Replace 'code' with JavaScript code to run desired effects.
 * - The 'user' variable represents the one using the skill/item.
 * - The 'target' variable represents the one receiving the skill/item hit.
 *
 * ---
 *
 * <JS Pre-Damage as User>
 *  code
 *  code
 *  code
 * </JS Pre-Damage as User>
 *
 * <JS Pre-Damage as Target>
 *  code
 *  code
 *  code
 * </JS Pre-Damage as Target>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs JavaScript code before damage is dealt aimed at the function:
 *   Game_Action.prototype.executeDamage()
 *   - 'Pre' runs before the function runs.
 * - If used on trait objects, this will apply to any skills/items used as long
 *   as the unit affected by the trait object has access to the trait object.
 * - If the 'as User' notetag variant is used, this code will be run as a
 *   response to the action from the action user end.
 * - If the 'as Target' notetag variant is used, this code will be run as a
 *   response to the action from the action target end.
 * - Replace 'code' with JavaScript code to run desired effects.
 * - The 'user' variable represents the one using the skill/item.
 * - The 'target' variable represents the one receiving the skill/item hit.
 *
 * ---
 *
 * <JS Post-Damage>
 *  code
 *  code
 *  code
 * </JS Post-Damage>
 * 
 * - Used for: Skill, Item Notetags
 * - Runs JavaScript code after damage is dealt aimed at the function:
 *   Game_Action.prototype.executeDamage()
 *   - 'Post' runs after the function runs.
 * - If used on skills and/or items, this will only apply to the skill/item
 *   being used and does not affect other skills and items.
 * - Replace 'code' with JavaScript code to run desired effects.
 * - The 'user' variable represents the one using the skill/item.
 * - The 'target' variable represents the one receiving the skill/item hit.
 *
 * ---
 *
 * <JS Post-Damage as User>
 *  code
 *  code
 *  code
 * </JS Post-Damage as User>
 *
 * <JS Post-Damage as Target>
 *  code
 *  code
 *  code
 * </JS Post-Damage as Target>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs JavaScript code after damage is dealt aimed at the function:
 *   Game_Action.prototype.executeDamage()
 *   - 'Post' runs after the function runs.
 * - If used on trait objects, this will apply to any skills/items used as long
 *   as the unit affected by the trait object has access to the trait object.
 * - If the 'as User' notetag variant is used, this code will be run as a
 *   response to the action from the action user end.
 * - If the 'as Target' notetag variant is used, this code will be run as a
 *   response to the action from the action target end.
 * - Replace 'code' with JavaScript code to run desired effects.
 * - The 'user' variable represents the one using the skill/item.
 * - The 'target' variable represents the one receiving the skill/item hit.
 *
 * ---
 *
 * <JS Post-Apply>
 *  code
 *  code
 *  code
 * </JS Post-Apply>
 * 
 * - Used for: Skill, Item Notetags
 * - Runs JavaScript code at the end of an action hit aimed at the function:
 *   Game_Action.prototype.apply()
 *   - 'Post' runs after the function runs.
 * - If used on skills and/or items, this will only apply to the skill/item
 *   being used and does not affect other skills and items.
 * - Replace 'code' with JavaScript code to run desired effects.
 * - The 'user' variable represents the one using the skill/item.
 * - The 'target' variable represents the one receiving the skill/item hit.
 *
 * ---
 *
 * <JS Post-Apply as User>
 *  code
 *  code
 *  code
 * </JS Post-Apply as User>
 *
 * <JS Post-Apply as Target>
 *  code
 *  code
 *  code
 * </JS Post-Apply as Target>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs JavaScript code at the end of an action hit aimed at the function:
 *   Game_Action.prototype.apply()
 *   - 'Post' runs after the function runs.
 * - If used on trait objects, this will apply to any skills/items used as long
 *   as the unit affected by the trait object has access to the trait object.
 * - If the 'as User' notetag variant is used, this code will be run as a
 *   response to the action from the action user end.
 * - If the 'as Target' notetag variant is used, this code will be run as a
 *   response to the action from the action target end.
 * - Replace 'code' with JavaScript code to run desired effects.
 *
 * ---
 *
 * <JS Pre-End Action>
 *  code
 *  code
 *  code
 * </JS Pre-End Action>
 *
 * <JS Post-End Action>
 *  code
 *  code
 *  code
 * </JS Post-End Action>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs JavaScript code at the end of an action aimed at the function:
 *   BattleManager.endAction()
 *   - 'Pre' runs before the function runs.
 *   - 'Post' runs after the function runs.
 * - If used on trait objects, this will apply to any skills/items used as long
 *   as the unit affected by the trait object has access to the trait object.
 * - Replace 'code' with JavaScript code to run desired effects.
 * - The 'user' variable represents the one affected by the trait object.
 *
 * ---
 *
 * <JS Pre-End Turn>
 *  code
 *  code
 *  code
 * </JS Pre-End Turn>
 *
 * <JS Post-End Turn>
 *  code
 *  code
 *  code
 * </JS Post-End Turn>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs JavaScript code at the end of a turn aimed at the function:
 *   Game_Battler.prototype.onTurnEnd()
 *   - 'Pre' runs before the function runs.
 *   - 'Post' runs after the function runs.
 * - Replace 'code' with JavaScript code to run desired effects.
 * - The 'user' variable represents the one affected by the trait object.
 *
 * ---
 *
 * <JS Pre-Regenerate>
 *  code
 *  code
 *  code
 * </JS Pre-Regenerate>
 *
 * <JS Post-Regenerate>
 *  code
 *  code
 *  code
 * </JS Post-Regenerate>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs JavaScript code when a unit regenerates HP/MP aimed at the function:
 *   Game_Battler.prototype.regenerateAll()
 *   - 'Pre' runs before the function runs.
 *   - 'Post' runs after the function runs.
 * - Replace 'code' with JavaScript code to run desired effects.
 * - The 'user' variable represents the one affected by the trait object.
 *
 * ---
 *
 * <JS Battle Victory>
 *  code
 *  code
 *  code
 * </JS Battle Victory>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs JavaScript code when a battle is won aimed at the function:
 *   BattleManager.processVictory()
 * - Replace 'code' with JavaScript code to run desired effects.
 * - The 'user' variable represents the one affected by the trait object.
 *
 * ---
 *
 * <JS Escape Success>
 *  code
 *  code
 *  code
 * </JS Escape Success>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs JavaScript code when escaping succeeds aimed at the function:
 *   BattleManager.onEscapeSuccess()
 * - Replace 'code' with JavaScript code to run desired effects.
 * - The 'user' variable represents the one affected by the trait object.
 *
 * ---
 *
 * <JS Escape Failure>
 *  code
 *  code
 *  code
 * </JS Escape Failure>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs JavaScript code when escaping fails aimed at the function:
 *   BattleManager.onEscapeFailure()
 * - Replace 'code' with JavaScript code to run desired effects.
 * - The 'user' variable represents the one affected by the trait object.
 *
 * ---
 *
 * <JS Battle Defeat>
 *  code
 *  code
 *  code
 * </JS Battle Defeat>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs JavaScript code when a battle is lost aimed at the function:
 *   BattleManager.processDefeat()
 * - Replace 'code' with JavaScript code to run desired effects.
 * - The 'user' variable represents the one affected by the trait object.
 *
 * ---
 *
 * <JS Pre-End Battle>
 *  code
 *  code
 *  code
 * </JS Pre-End Battle>
 *
 * <JS Post-End Battle>
 *  code
 *  code
 *  code
 * </JS Post-End Battle>
 * 
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Runs JavaScript code when the battle is over aimed at the function:
 *   BattleManager.endBattle()
 *   - 'Pre' runs before the function runs.
 *   - 'Post' runs after the function runs.
 * - Replace 'code' with JavaScript code to run desired effects.
 * - The 'user' variable represents the one affected by the trait object.
 *
 * ---
 * 
 * === Battle Layout-Related Notetags ===
 * 
 * These tags will change the battle layout for a troop regardless of how the
 * plugin parameters are set up normally. Insert these tags in either the
 * noteboxes of maps or the names of troops for them to take effect. If both
 * are present for a specific battle, then priority goes to the setting found
 * in the troop name.
 * 
 * ---
 * 
 * <Layout: type>
 * <Battle Layout: type>
 * 
 * - Used for: Map Notetags and Troop Name Tags
 * - Changes the battle layout style used for this specific map or battle.
 * - Replace 'type' with 'default', 'list', 'xp', 'portrait', or 'border'.
 * 
 * ---
 *
 * ============================================================================
 * Action Sequence - Plugin Commands
 * ============================================================================
 *
 * Skills and items, when used in battle, have a pre-determined series of
 * actions to display to the player as a means of representing what's going on
 * with the action. For some game devs, this may not be enough and they would
 * like to get more involved with the actions themselves.
 *
 * Action Sequences, added through this plugin, enable this. To give a skill or
 * item a Custom Action Sequence, a couple of steps must be followed:
 *
 * ---
 *
 * 1. Insert the <Custom Action Sequence> notetag into the skill or item's
 *    notebox (or else this would not work as intended).
 * 2. Give that skill/item a Common Event through the Effects box. The selected
 *    Common Event will contain all the Action Sequence data.
 * 3. Create the Common Event with Action Sequence Plugin Commands and/or event
 *    commands to make the skill/item do what you want it to do.
 *
 * ---
 *
 * The Plugin Commands added through the Battle Core plugin focus entirely on
 * Action Sequences. However, despite the fact that they're made for skills and
 * items, some of these Action Sequence Plugin Commands can still be used for
 * regular Troop events and Common Events.
 *
 * ---
 *
 * === Action Sequence - Action Sets ===
 *
 * Action Sequence Action Sets are groups of commonly used
 * Action Sequence Commands put together for more efficient usage.
 *
 * ---
 *
 * ACSET: Setup Action Set
 * - The generic start to most actions.
 *
 *   Display Action:
 *   Immortal: On:
 *   Battle Step:
 *   Wait For Movement:
 *   Cast Animation:
 *   Wait For Animation:
 *   - Use this part of the action sequence?
 *
 * ---
 *
 * ACSET: All Targets Action Set
 * - Affects all targets simultaneously performing the following.
 *
 *   Dual/Multi Wield?
 *   - Add times struck based on weapon quantity equipped?
 * 
 *   Perform Action:
 *   Wait Count:
 *   Action Animation:
 *   Wait For Animation:
 *   Action Effect:
 *   Immortal: Off:
 *   - Use this part of the action sequence?
 *   - Insert values for the Wait Count(s).
 *
 * ---
 *
 * ACSET: Each Target Action Set
 * - Goes through each target one by one to perform the following.
 *
 *   Dual/Multi Wield?
 *   - Add times struck based on weapon quantity equipped?
 *
 *   Perform Action:
 *   Wait Count:
 *   Action Animation:
 *   Wait Count:
 *   Action Effect:
 *   Immortal: Off:
 *   - Use this part of the action sequence?
 *   - Insert values for the Wait Count(s).
 *
 * ---
 *
 * ACSET: Finish Action
 * - The generic ending to most actions.
 *
 *   Wait For New Line:
 *   Wait For Effects:
 *   Clear Battle Log:
 *   Home Reset:
 *   Wait For Movement:
 *   - Use this part of the action sequence?
 *
 * ---
 * 
 * === Action Sequences - Angle ===
 * 
 * These action sequences allow you to have control over the camera angle.
 * Requires VisuMZ_3_ActSeqCamera!
 * 
 * ---
 *
 * ANGLE: Change Angle
 * - Changes the camera angle.
 * - Requires VisuMZ_3_ActSeqCamera!
 *
 *   Angle:
 *   - Change the camera angle to this many degrees.
 *
 *   Duration:
 *   - Duration in frames to change camera angle.
 *
 *   Angle Easing:
 *   - Select which easing type you wish to apply.
 *   - Requires VisuMZ_0_CoreEngine.
 *
 *   Wait For Angle?:
 *   - Wait for angle changes to complete before performing next command?
 *
 * ---
 *
 * ANGLE: Reset Angle
 * - Reset any angle settings.
 * - Requires VisuMZ_3_ActSeqCamera!
 *
 *   Duration:
 *   - Duration in frames to reset camera angle.
 *
 *   Angle Easing:
 *   - Select which easing type you wish to apply.
 *   - Requires VisuMZ_0_CoreEngine.
 *
 *   Wait For Angle?:
 *   - Wait for angle changes to complete before performing next command?
 *
 * ---
 *
 * ANGLE: Wait For Angle
 * - Waits for angle changes to complete before performing next command.
 * - Requires VisuMZ_3_ActSeqCamera!
 *
 * ---
 *
 * === Action Sequences - Animations ===
 *
 * These Action Sequences are related to the 'Animations' that can be found in
 * the Animations tab of the Database.
 *
 * ---
 *
 * ANIM: Action Animation
 * - Plays the animation associated with the action.
 *
 *   Targets:
 *   - Select unit(s) to play the animation on.
 *
 *   Mirror Animation:
 *   - Mirror the animation?
 *
 *   Wait For Animation?:
 *   - Wait for animation to complete before performing next command?
 *
 * ---
 *
 * ANIM: Attack Animation
 * - Plays the animation associated with the user's weapon.
 *
 *   Targets:
 *   - Select unit(s) to play the animation on.
 *
 *   Mirror Animation:
 *   - Mirror the animation?
 *
 *   Wait For Animation?:
 *   - Wait for animation to complete before performing next command?
 *
 * ---
 *
 * ANIM: Attack Animation 2+
 * - Plays the animation associated with the user's other weapons.
 * - Plays nothing if there is no other weapon equipped.
 *
 *   Targets:
 *   - Select unit(s) to play the animation on.
 * 
 *   Slot:
 *   - Which weapon slot to get this data from?
 *   - Main-hand weapon is weapon slot 1.
 *
 *   Mirror Animation:
 *   - Mirror the animation?
 *
 *   Wait For Animation?:
 *   - Wait for animation to complete before performing next command?
 *
 * ---
 *
 * ANIM: Cast Animation
 * - Plays the cast animation associated with the action.
 *
 *   Targets:
 *   - Select unit(s) to play the animation on.
 *
 *   Mirror Animation:
 *   - Mirror the animation?
 *
 *   Wait For Animation?:
 *   - Wait for animation to complete before performing next command?
 *
 * ---
 *
 * ANIM: Change Battle Portrait
 * - Changes the battle portrait of the actor (if it's an actor).
 * - Can be used outside of battle/action sequences.
 *
 *   Targets:
 *   - Select unit(s) to play the animation on.
 *   - Valid units can only be actors.
 *
 *   Filename:
 *   - Select the file to change the actor's portrait to.
 *
 * ---
 *
 * ANIM: Show Animation
 * - Plays the a specific animation on unit(s).
 *
 *   Targets:
 *   - Select unit(s) to play the animation on.
 *
 *   Animation ID:
 *   - Select which animation to play on unit(s).
 *
 *   Mirror Animation:
 *   - Mirror the animation?
 *
 *   Wait For Animation?:
 *   - Wait for animation to complete before performing next command?
 *
 * ---
 *
 * ANIM: Wait For Animation
 * - Causes the interpreter to wait for any animation(s) to finish.
 *
 * ---
 *
 * === Action Sequences - Battle Log ===
 *
 * These Action Sequences are related to the Battle Log Window, the window
 * found at the top of the battle screen.
 *
 * ---
 *
 * BTLOG: Add Text
 * - Adds a new line of text into the Battle Log.
 *
 *   Text:
 *   - Add this text into the Battle Log.
 *   - Text codes allowed.
 * 
 *   Copy to Combat Log?:
 *   - Copies text to the Combat Log.
 *   - Requires VisuMZ_4_CombatLog
 * 
 *     Combat Log Icon:
 *     - What icon would you like to bind to this entry?
 *     - Requires VisuMZ_4_CombatLog
 *
 * ---
 *
 * BTLOG: Clear Battle Log
 * - Clears all the text in the Battle Log.
 *
 * ---
 *
 * BTLOG: Display Action
 * - plays the current action in the Battle Log.
 *
 * ---
 *
 * BTLOG: Pop Base Line
 * - Removes the Battle Log's last added base line and  all text up to its
 *   former location.
 *
 * ---
 *
 * BTLOG: Push Base Line
 * - Adds a new base line to where the Battle Log currently is at.
 *
 * ---
 *
 * BTLOG: Refresh Battle Log
 * - Refreshes the Battle Log.
 *
 * ---
 *
 * BTLOG: UI Show/Hide
 * - Shows or hides the Battle UI (including the Battle Log).
 *
 *   Show/Hide?:
 *   - Shows/hides the Battle UI.
 *
 * ---
 *
 * BTLOG: Wait For Battle Log
 * - Causes the interpreter to wait for the Battle Log to finish.
 *
 * ---
 *
 * BTLOG: Wait For New Line
 * - Causes the interpreter to wait for a new line in the Battle Log.
 *
 * ---
 *
 * === Action Sequences - Camera ===
 *
 * These Action Sequences are battle camera-related.
 * Requires VisuMZ_3_ActSeqCamera!
 *
 * ---
 *
 * CAMERA: Clamp ON/OFF
 * - Turns battle camera clamping on/off.
 * - Requires VisuMZ_3_ActSeqCamera!
 *
 *   Setting:
 *   - Turns camera clamping on/off.
 *
 * ---
 *
 * CAMERA: Focus Point
 * - Focus the battle camera on a certain point in the screen.
 * - Requires VisuMZ_3_ActSeqCamera!
 *
 *   X Coordinate:
 *   - Insert the point to focus the camera on.
 *   - You may use JavaScript code.
 *
 *   Y Coordinate:
 *   - Insert the point to focus the camera on.
 *   - You may use JavaScript code.
 *
 *   Duration:
 *   - Duration in frames for camera focus change.
 *
 *   Camera Easing:
 *   - Select which easing type you wish to apply.
 *   - Requires VisuMZ_0_CoreEngine.
 *
 *   Wait For Camera?
 *   - Wait for camera changes to complete before performing next command?
 *
 * ---
 *
 * CAMERA: Focus Target(s)
 * - Focus the battle camera on certain battler target(s).
 * - Requires VisuMZ_3_ActSeqCamera!
 *
 *   Targets:
 *   - Select unit(s) to focus the battle camera on.
 *
 *   Duration:
 *   - Duration in frames for camera focus change.
 *
 *   Camera Easing:
 *   - Select which easing type you wish to apply.
 *   - Requires VisuMZ_0_CoreEngine.
 *
 *   Wait For Camera?
 *   - Wait for camera changes to complete before performing next command?
 *
 * ---
 *
 * CAMERA: Offset
 * - Offset the battle camera from the focus target.
 * - Requires VisuMZ_3_ActSeqCamera!
 *
 *   Offset X:
 *   - How much to offset the camera X by.
 *   - Negative: left. Positive: right.
 *
 *   Offset Y:
 *   - How much to offset the camera Y by.
 *   - Negative: up. Positive: down.
 *
 *   Duration:
 *   - Duration in frames for offset change.
 *
 *   Camera Easing:
 *   - Select which easing type you wish to apply.
 *   - Requires VisuMZ_0_CoreEngine.
 *
 *   Wait For Camera?
 *   - Wait for camera changes to complete before performing next command?
 *
 * ---
 *
 * CAMERA: Reset
 * - Reset the battle camera settings.
 * - Requires VisuMZ_3_ActSeqCamera!
 *
 *   Reset Focus?:
 *   - Reset the focus point?
 *
 *   Reset Offset?:
 *   - Reset the camera offset?
 *
 *   Duration:
 *   - Duration in frames for reset change.
 *
 *   Camera Easing:
 *   - Select which easing type you wish to apply.
 *   - Requires VisuMZ_0_CoreEngine.
 *
 *   Wait For Camera?
 *   - Wait for camera changes to complete before performing next command?
 *
 * ---
 *
 * CAMERA: Wait For Camera
 * - Waits for camera changes to complete before performing next command.
 * - Requires VisuMZ_3_ActSeqCamera!
 *
 * ---
 *
 * === Action Sequences - Dragonbones ===
 *
 * These Action Sequences are Dragonbones-related.
 * Requires VisuMZ_2_DragonbonesUnion!
 *
 * ---
 *
 * DB: Dragonbones Animation
 * - Causes the unit(s) to play a Dragonbones motion animation.
 * - Requires VisuMZ_2_DragonbonesUnion!
 *
 *   Targets:
 *   - Select which unit(s) to perform a motion animation.
 *
 *   Motion Animation:
 *   - What is the name of the Dragonbones motion animation you wish to play?
 *
 * ---
 *
 * DB: Dragonbones Time Scale
 * - Causes the unit(s) to change their Dragonbones time scale.
 * - Requires VisuMZ_2_DragonbonesUnion!
 *
 *   Targets:
 *   - Select which unit(s) to perform a motion animation.
 *
 *   Time Scale:
 *   - Change the value of the Dragonbones time scale to this.
 *
 * ---
 *
 * === Action Sequences - Elements ===
 *
 * These Action Sequences can change up the element(s) used for the action's
 * damage calculation midway through an action.
 *
 * They also require the VisuMZ_1_ElementStatusCore plugin to be present in
 * order for them to work.
 *
 * ---
 *
 * ELE: Add Elements
 * - Adds element(s) to be used when calculating damage.
 * - Requires VisuMZ_1_ElementStatusCore!
 *
 *   Elements:
 *   - Select which element ID to add onto the action.
 *   - Insert multiple element ID's to add multiple at once.
 *
 * ---
 *
 * ELE: Clear Element Changes
 * - Clears all element changes made through Action Sequences.
 * - Requires VisuMZ_1_ElementStatusCore!
 *
 * ---
 *
 * ELE: Force Elements
 * - Forces only specific element(s) when calculating damage.
 * - Requires VisuMZ_1_ElementStatusCore!
 *
 *   Elements:
 *   - Select which element ID to force in the action.
 *   - Insert multiple element ID's to force multiple at once.
 *
 * ---
 *
 * ELE: Null Element
 * - Forces no element to be used when calculating damage.
 * - Requires VisuMZ_1_ElementStatusCore!
 *
 * ---
 * 
 * === Action Sequences - Horror Effects ===
 * 
 * These Action Sequences are Horror Effects-related.
 * Requires VisuMZ_2_HorrorEffects!
 * 
 * ---
 *
 * HORROR: Clear All Filters
 * - Clear all Horror Effects filters on the target battler(s).
 *
 *   Targets:
 *   - Select unit(s) to remove Horror Effects for.
 *
 * ---
 *
 * HORROR: Glitch Create
 * - Creates the glitch effect on the target battler(s).
 *
 *   Targets:
 *   - Select unit(s) to create the Horror Effect for.
 *
 *   Glitch Slices:
 *   - Glitch slices to be used with the target.
 *
 *   Glitch Offset:
 *   - Default offset value.
 *
 *   Glitch Animated?:
 *   - Animate the glitch effect?
 *
 *   Glitch Frequency:
 *   - If animated, how frequent to make the glitch effect?
 *   - Lower = often     Higher = rarer
 *
 *   Glitch Strength:
 *   - If animated, how strong is the glitch effect?
 *   - Lower = weaker     Higher = stronger
 *
 * ---
 *
 * HORROR: Glitch Remove
 * - Removes the glitch effect on the target battler(s).
 *
 *   Targets:
 *   - Select unit(s) to remove the Horror Effect for.
 *
 * ---
 *
 * HORROR: Noise Create
 * - Creates the noise effect on the target battler(s).
 *
 *   Targets:
 *   - Select unit(s) to create the Horror Effect for.
 *
 *   Noise Rate:
 *   - Noise rate to be used with the target.
 *
 *   Noise Animated:
 *   - Animate the noise for the target?
 *
 * ---
 *
 * HORROR: Noise Remove
 * - Removes the noise effect on the target battler(s).
 *
 *   Targets:
 *   - Select unit(s) to remove the Horror Effect for.
 *
 * ---
 *
 * HORROR: TV Create
 * - Creates the TV effect on the target battler(s).
 *
 *   Targets:
 *   - Select unit(s) to create the Horror Effect for.
 *
 *   TV Line Thickness:
 *   - Default TV line thickness
 *   - Lower = thinner     Higher = thicker
 *
 *   TV Corner Size:
 *   - Default TV line corner size
 *   - Lower = smaller     Higher = bigger
 *
 *   TV Animated:
 *   - Animate the TV?
 *
 *   TV Speed:
 *   - Speed used to animate the TV if animated
 *   - Lower = slower     Higher = faster
 *
 * ---
 *
 * HORROR: TV Remove
 * - Removes the TV effect on the target battler(s).
 *
 *   Targets:
 *   - Select unit(s) to remove the Horror Effect for.
 *
 * ---
 * 
 * === Action Sequences - Impact ===
 * 
 * These Action Sequences are related to creating impact.
 * Requires VisuMZ_3_ActSeqImpact!
 * 
 * ---
 *
 * IMPACT: Color Break
 * - Breaks the colors on the screen before reassembling.
 * - Requires VisuMZ_3_ActSeqImpact!
 *
 *   Intensity:
 *   - What is the intensity of the color break effect?
 *
 *   Duration:
 *   - What is the duration of the color break effect?
 *
 *   Easing Type:
 *   - Select which easing type you wish to apply.
 *
 * ---
 *
 * IMPACT: Motion Blur Screen
 * - Creates a motion blur on the whole screen.
 * - Requires VisuMZ_3_ActSeqImpact!
 *
 *   Angle:
 *   - Determine what angle to make the motion blur at.
 *
 *   Intensity Rate:
 *   - This determines intensity rate of the motion blur.
 *   - Use a number between 0 and 1.
 *
 *   Duration:
 *   - How many frames should the motion blur last?
 *   - What do you want to be its duration?
 *
 *   Easing Type:
 *   - Select which easing type you wish to apply.
 *
 * ---
 *
 * IMPACT: Motion Blur Target(s)
 * - Creates a motion blur on selected target(s).
 * - Requires VisuMZ_3_ActSeqImpact!
 *
 *   Targets:
 *   - Select unit(s) to create motion blur effects for.
 *
 *   Angle:
 *   - Determine what angle to make the motion blur at.
 *
 *   Intensity Rate:
 *   - This determines intensity rate of the motion blur.
 *   - Use a number between 0 and 1.
 *
 *   Duration:
 *   - How many frames should the motion blur last?
 *   - What do you want to be its duration?
 *
 *   Easing Type:
 *   - Select which easing type you wish to apply.
 *
 * ---
 *
 * IMPACT: Motion Trail Create
 * - Creates a motion trail effect for the target(s).
 * - Requires VisuMZ_3_ActSeqImpact!
 *
 *   Targets:
 *   - Select unit(s) to create motion trail effects for.
 *
 *   Delay:
 *   - How many frames to delay by when creating a motion trail?
 *   - The higher the delay, the less motion trails there are.
 *
 *   Duration:
 *   - How many frames should the motion trail last?
 *   - What do you want to be its duration?
 *
 *   Hue:
 *   - What do you want to be the hue for the motion trail?
 *
 *   Starting Opacity:
 *   - What starting opacity value do you want for the motion trail?
 *   - Opacity values decrease over time.
 *
 *   Tone:
 *   - What tone do you want for the motion trail?
 *   - Format: [Red, Green, Blue, Gray]
 *
 * ---
 *
 * IMPACT: Motion Trail Remove
 * - Removes the motion trail effect from the target(s).
 * - Requires VisuMZ_3_ActSeqImpact!
 *
 *   Targets:
 *   - Select unit(s) to clear motion trail effects for.
 *
 * ---
 *
 * IMPACT: Shockwave at Point
 * - Creates a shockwave at the designated coordinates.
 * - Requires VisuMZ_3_ActSeqImpact!
 *
 *   Point: X:
 *   Point: Y:
 *   - What x/y coordinate do you want to create a shockwave at?
 *   - You can use JavaScript code.
 *
 *   Amplitude:
 *   - What is the aplitude of the shockwave effect?
 *
 *   Wavelength:
 *   - What is the wavelength of the shockwave effect?
 *
 *   Duration:
 *   - What is the duration of the shockwave?
 *
 * ---
 *
 * IMPACT: Shockwave from Each Target(s)
 * - Creates a shockwave at each of the target(s) location(s).
 * - Requires VisuMZ_3_ActSeqImpact!
 *
 *   Targets:
 *   - Select unit(s) to start a shockwave from.
 *
 *   Target Location:
 *   - Select which part target group to start a shockwave from.
 * 
 *     Offset X:
 *     Offset Y:
 *     - How much to offset the shockwave X/Y point by.
 *
 *   Amplitude:
 *   - What is the aplitude of the shockwave effect?
 *
 *   Wavelength:
 *   - What is the wavelength of the shockwave effect?
 *
 *   Duration:
 *   - What is the duration of the shockwave?
 *
 * ---
 *
 * IMPACT: Shockwave from Target(s) Center
 * - Creates a shockwave from the center of the target(s).
 * - Requires VisuMZ_3_ActSeqImpact!
 *
 *   Targets:
 *   - Select unit(s) to start a shockwave from.
 *
 *   Target Location:
 *   - Select which part target group to start a shockwave from.
 * 
 *     Offset X:
 *     Offset Y:
 *     - How much to offset the shockwave X/Y point by.
 *
 *   Amplitude:
 *   - What is the aplitude of the shockwave effect?
 *
 *   Wavelength:
 *   - What is the wavelength of the shockwave effect?
 *
 *   Duration:
 *   - What is the duration of the shockwave?
 *
 * ---
 *
 * IMPACT: Zoom Blur at Point
 * - Creates a zoom blur at the designated coordinates.
 * - Requires VisuMZ_3_ActSeqImpact!
 *
 *   Point: X:
 *   Point: Y:
 *   - What x/y coordinate do you want to focus the zoom at?
 *   - You can use JavaScript code.
 *
 *   Zoom Strength:
 *   - What is the strength of the zoom effect?
 *   - Use a number between 0 and 1.
 *
 *   Visible Radius:
 *   - How much of a radius should be visible from the center?
 *
 *   Duration:
 *   - What is the duration of the zoom blur?
 *
 *   Easing Type:
 *   - Select which easing type you wish to apply.
 *
 * ---
 *
 * IMPACT: Zoom Blur at Target(s) Center
 * - Creates a zoom blur at the center of targets.
 * - Requires VisuMZ_3_ActSeqImpact!
 *
 *   Targets:
 *   - Select unit(s) to start a zoom blur from.
 *
 *   Target Location:
 *   - Select which part target group to start a zoom blur from.
 * 
 *     Offset X:
 *     Offset Y:
 *     - How much to offset the zoom blur X/Y point by.
 *
 *   Zoom Strength:
 *   - What is the strength of the zoom effect?
 *   - Use a number between 0 and 1.
 *
 *   Visible Radius:
 *   - How much of a radius should be visible from the center?
 *
 *   Duration:
 *   - What is the duration of the zoom blur?
 *
 *   Easing Type:
 *   - Select which easing type you wish to apply.
 *
 * ---
 *
 * === Action Sequences - Mechanics ===
 *
 * These Action Sequences are related to various mechanics related to the
 * battle system.
 *
 * ---
 *
 * MECH: Action Effect
 * - Causes the unit(s) to take damage/healing from action and incurs any
 *   changes made such as buffs and states.
 *
 *   Targets:
 *   - Select unit(s) to receive the current action's effects.
 *
 * ---
 *
 * MECH: Add Buff/Debuff
 * - Adds buff(s)/debuff(s) to unit(s). 
 * - Determine which parameters are affected and their durations.
 *
 *   Targets:
 *   - Select unit(s) to receive the buff(s) and/or debuff(s).
 *
 *   Buff Parameters:
 *   - Select which parameter(s) to buff.
 *   - Insert a parameter multiple times to raise its stacks.
 *
 *   Debuff Parameters:
 *   - Select which parameter(s) to debuff.
 *   - Insert a parameter multiple times to raise its stacks.
 *
 *   Turns:
 *   - Number of turns to set the parameter(s) buffs to.
 *   - You may use JavaScript code.
 *
 * ---
 *
 * MECH: Add State
 * - Adds state(s) to unit(s).
 *
 *   Targets:
 *   - Select unit(s) to receive the buff(s).
 *
 *   States:
 *   - Select which state ID(s) to add to unit(s).
 *   - Insert multiple state ID's to add multiple at once.
 *
 * ---
 *
 * MECH: Armor Penetration
 * - Adds an extra layer of defensive penetration/reduction.
 * - You may use JavaScript code for any of these.
 *
 *   Armor/Magic Penetration:
 *
 *     Rate:
 *     - Penetrates an extra multiplier of armor by this value.
 *
 *     Flat:
 *     - Penetrates a flat amount of armor by this value.
 *
 *   Armor/Magic Reduction:
 *
 *     Rate:
 *     - Reduces an extra multiplier of armor by this value.
 *
 *     Flat:
 *     - Reduces a flat amount of armor by this value.
 *
 * ---
 * 
 * MECH: ATB Gauge
 * - Alters the ATB/TPB Gauges.
 * - Requires VisuMZ_2_BattleSystemATB!
 * 
 *   Targets:
 *   - Select unit(s) to alter the ATB/TPB Gauges for.
 * 
 *   Charging:
 *   
 *     Charge Rate:
 *     - Changes made to the ATB Gauge if it is currently charging.
 * 
 *   Casting:
 *   
 *     Cast Rate:
 *     - Changes made to the ATB Gauge if it is currently casting.
 *   
 *     Interrupt?:
 *     - Interrupt the ATB Gauge if it is currently casting?
 * 
 * ---
 * 
 * MECH: BTB Brave Points
 * - Alters the target(s) Brave Points to an exact value.
 * - Requires VisuMZ_2_BattleSystemBTB!
 * 
 *   Targets:
 *   - Select unit(s) to alter the ATB/TPB Gauges for.
 * 
 *   Alter Brave Points By:
 *   - Alters the target(s) Brave Points.
 *   - Positive for gaining BP.
 *   - Negative for losing BP.
 * 
 * ---
 *
 * MECH: Collapse
 * - Causes the unit(s) to perform its collapse animation if the unit(s)
 *   has died.
 *
 *   Targets:
 *   - Select unit(s) to process a death collapse.
 *
 *   Force Death:
 *   - Force death even if the unit has not reached 0 HP?
 *   - This will remove immortality.
 *
 *   Wait For Effect?:
 *   - Wait for the collapse effect to complete before performing next command?
 *
 * ---
 * 
 * MECH: CTB Order
 * - Alters the CTB Turn Order.
 * - Requires VisuMZ_2_BattleSystemCTB!
 * 
 *   Targets:
 *   - Select unit(s) to alter the CTB Turn Order for.
 * 
 *   Change Order By:
 *   - Changes turn order for target(s) by this amount.
 *   - Positive increases wait. Negative decreases wait.
 * 
 * ---
 * 
 * MECH: CTB Speed
 * - Alters the CTB Speed.
 * - Requires VisuMZ_2_BattleSystemCTB!
 * 
 *   Targets:
 *   - Select unit(s) to alter the CTB Speed for.
 * 
 *   Charge Rate:
 *   - Changes made to the CTB Speed if it is currently charging.
 * 
 *   Cast Rate:
 *   - Changes made to the CTB Speed if it is currently casting.
 * 
 * ---
 * 
 * MECH: Custom Damage Formula
 * - Changes the current action's damage formula to custom.
 * - This will assume the MANUAL damage style.
 * 
 *   Formula:
 *   - Changes the current action's damage formula to custom.
 *   - Use 'default' to revert the damage formula.
 * 
 * ---
 *
 * MECH: Damage Popup
 * - Causes the unit(s) to display the current state of damage received
 *   or healed.
 *
 *   Targets:
 *   - Select unit(s) to prompt a damage popup.
 *
 * ---
 *
 * MECH: Dead Label Jump
 * - If the active battler is dead, jump to a specific label in the
 *   common event.
 *
 *   Jump To Label:
 *   - If the active battler is dead, jump to this specific label in the
 *     common event.
 *
 * ---
 *
 * MECH: HP, MP, TP
 * - Alters the HP, MP, and TP values for unit(s).
 * - Positive values for healing. Negative values for damage.
 *
 *   Targets:
 *   - Select unit(s) to receive the current action's effects.
 *
 *   HP, MP, TP:
 *
 *     Rate:
 *     - Changes made to the parameter based on rate.
 *     - Positive values for healing. Negative values for damage.
 *
 *     Flat:
 *     - Flat changes made to the parameter.
 *     - Positive values for healing. Negative values for damage.
 *
 *   Damage Popup?:
 *   - Display a damage popup after?
 *
 * ---
 *
 * MECH: Immortal
 * - Changes the immortal flag of targets. If immortal flag is removed and a
 *   unit would die, collapse that unit.
 *
 *   Targets:
 *   - Alter the immortal flag of these groups. If immortal flag is removed and
 *     a unit would die, collapse that unit.
 *
 *   Immortal:
 *   - Turn immortal flag for unit(s) on/off?
 *
 * ---
 *
 * MECH: Multipliers
 * - Changes the multipliers for the current action.
 * - You may use JavaScript code for any of these.
 *
 *   Critical Hit%:
 *
 *     Rate:
 *     - Affects chance to land a critical hit by this multiplier.
 *
 *     Flat:
 *     - Affects chance to land a critical hit by this flat bonus.
 *
 *   Critical Damage
 *
 *     Rate:
 *     - Affects critical damage by this multiplier.
 *
 *     Flat:
 *     - Affects critical damage by this flat bonus.
 *
 *   Damage/Healing
 *
 *     Rate:
 *     - Sets the damage/healing multiplier for current action.
 *
 *     Flat:
 *     - Sets the damage/healing bonus for current action.
 *
 *   Hit Rate
 *
 *     Rate:
 *     - Affects chance to connect attack by this multiplier.
 *
 *     Flat:
 *     - Affects chance to connect attack by this flat bonus.
 *
 * ---
 *
 * MECH: Remove Buff/Debuff
 * - Removes buff(s)/debuff(s) from unit(s). 
 * - Determine which parameters are removed.
 *
 *   Targets:
 *   - Select unit(s) to have the buff(s) and/or debuff(s) removed.
 *
 *   Buff Parameters:
 *   - Select which buffed parameter(s) to remove.
 *
 *   Debuff Parameters:
 *   - Select which debuffed parameter(s) to remove.
 *
 * ---
 *
 * MECH: Remove State
 * - Remove state(s) from unit(s).
 *
 *   Targets:
 *   - Select unit(s) to have states removed from.
 *
 *   States:
 *   - Select which state ID(s) to remove from unit(s).
 *   - Insert multiple state ID's to remove multiple at once.
 *
 * ---
 * 
 * MECH: STB Exploit Effect
 * - Utilize the STB Exploitation mechanics!
 * - Requires VisuMZ_2_BattleSystemSTB!
 * 
 *   Target(s) Exploited?:
 *   - Exploit the below targets?
 * 
 *     Targets:
 *     - Select unit(s) to become exploited.
 * 
 *     Force Exploitation:
 *     - Force the exploited status?
 * 
 *   User Exploiter?:
 *   - Allow the user to become the exploiter?
 * 
 *     Force Exploitation:
 *     - Force the exploiter status?
 * 
 * ---
 * 
 * MECH: STB Extra Action
 * - Adds an extra action for the currently active battler.
 * - Requires VisuMZ_2_BattleSystemSTB!
 * 
 *   Extra Actions:
 *   - How many extra actions should the active battler gain?
 *   - You may use JavaScript code.
 * 
 * ---
 * 
 * MECH: STB Remove Excess Actions
 * - Removes excess actions from the active battler.
 * - Requires VisuMZ_2_BattleSystemSTB!
 * 
 *   Remove Actions:
 *   - How many actions to remove from the active battler?
 *   - You may use JavaScript code.
 * 
 * ---
 * 
 * MECH: Text Popup
 * - Causes the unit(s) to display a text popup.
 * 
 *   Targets:
 *   - Select unit(s) to prompt a text popup.
 * 
 *   Text:
 *   - What text do you wish to display?
 * 
 *   Text Color:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 * 
 *   Flash Color:
 *   - Adjust the popup's flash color.
 *   - Format: [red, green, blue, alpha]
 * 
 *   Flash Duration:
 *   - What is the frame duration of the flash effect?
 * 
 * ---
 * 
 * MECH: Variable Popup
 * - Causes the unit(s) to display a popup using the data stored inside
 *   a variable.
 * 
 *   Targets:
 *   - Select unit(s) to prompt a text popup.
 * 
 *   Variable:
 *   - Get data from which variable to display as a popup?
 * 
 *   Digit Grouping:
 *   - Use digit grouping to separate numbers?
 *   - Requires VisuMZ_0_CoreEngine!
 * 
 *   Text Color:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 * 
 *   Flash Color:
 *   - Adjust the popup's flash color.
 *   - Format: [red, green, blue, alpha]
 * 
 *   Flash Duration:
 *   - What is the frame duration of the flash effect?
 * 
 * ---
 *
 * MECH: Wait For Effect
 * - Waits for the effects to complete before performing next command.
 *
 * ---
 *
 * === Action Sequences - Motion ===
 *
 * These Action Sequences allow you the ability to control the motions of
 * sideview sprites.
 *
 * ---
 * 
 * MOTION: Clear Freeze Frame
 * - Clears any freeze frames from the unit(s).
 * 
 *   Targets:
 *   - Select which unit(s) to clear freeze frames for.
 * 
 * ---
 * 
 * MOTION: Freeze Motion Frame
 * - Forces a freeze frame instantly at the selected motion.
 * - Automatically clears with a new motion.
 * 
 *   Targets:
 *   - Select which unit(s) to freeze motions for.
 * 
 *   Motion Type:
 *   - Freeze this motion for the unit(s).
 * 
 *   Frame Index:
 *   - Which frame do you want to freeze the motion on?
 *   - Frame index values start at 0.
 * 
 *   Show Weapon?:
 *   - If using 'attack', 'thrust', 'swing', or 'missile', display the
 *     weapon sprite?
 * 
 * ---
 *
 * MOTION: Motion Type
 * - Causes the unit(s) to play the selected motion.
 *
 *   Targets:
 *   - Select which unit(s) to perform a motion.
 *
 *   Motion Type:
 *   - Play this motion for the unit(s).
 *
 *   Show Weapon?:
 *   - If using 'attack', 'thrust', 'swing', or 'missile', display the
 *     weapon sprite?
 *
 * ---
 *
 * MOTION: Perform Action
 * - Causes the unit(s) to play the proper motion based on the current action.
 *
 *   Targets:
 *   - Select which unit(s) to perform a motion.
 *
 * ---
 *
 * MOTION: Refresh Motion
 * - Cancels any set motions unit(s) has to do and use their most natural
 *   motion at the moment.
 *
 *   Targets:
 *   - Select which unit(s) to refresh their motion state.
 *
 * ---
 *
 * MOTION: Wait By Motion Frame
 * - Creates a wait equal to the number of motion frames passing.
 * - Time is based on Plugin Parameters => Actors => Motion Speed.
 *
 *   Motion Frames to Wait?:
 *   - Each "frame" is equal to the value found in 
 *     Plugin Parameters => Actors => Motion Speed
 *
 * ---
 *
 * === Action Sequences - Movement ===
 *
 * These Action Sequences allow you the ability to control the sprites of
 * actors and enemies in battle.
 *
 * ---
 *
 * MOVE: Battle Step
 * - Causes the unit(s) to move forward past their home position to prepare
 *   for action.
 *
 *   Targets:
 *   - Select which unit(s) to move.
 *
 *   Wait For Movement?:
 *   - Wait for movement to complete before performing next command?
 *
 * ---
 *
 * MOVE: Face Direction
 * - Causes the unit(s) to face forward or backward.
 * - Sideview-only!
 *
 *   Targets:
 *   - Select which unit(s) to change direction.
 *
 *   Direction:
 *   - Select which direction to face.
 *
 * ---
 *
 * MOVE: Face Point
 * - Causes the unit(s) to face a point on the screen.
 * - Sideview-only!
 *
 *   Targets:
 *   - Select which unit(s) to change direction.
 *
 *   Point:
 *   - Select which point to face.
 *     - Home
 *     - Center
 *     - Point X, Y
 *       - Replace 'x' and 'y' with coordinates
 *
 *   Face Away From?:
 *   - Face away from the point instead?
 *
 * ---
 *
 * MOVE: Face Target(s)
 * - Causes the unit(s) to face other targets on the screen.
 * - Sideview-only!
 *
 *   Targets (facing):
 *   - Select which unit(s) to change direction.
 *
 *   Targets (destination):
 *   - Select which unit(s) for the turning unit(s) to face.
 *
 *   Face Away From?:
 *   - Face away from the unit(s) instead?
 *
 * ---
 *
 * MOVE: Float
 * - Causes the unit(s) to float above the ground.
 * - Sideview-only!
 *
 *   Targets:
 *   - Select which unit(s) to make float.
 *
 *   Desired Height:
 *   - Vertical distance to float upward.
 *   - You may use JavaScript code.
 *
 *   Duration:
 *   - Duration in frames for total float amount.
 *
 *   Float Easing:
 *   - Select which easing type you wish to apply.
 *   - Requires VisuMZ_0_CoreEngine.
 *
 *   Wait For Float?:
 *   - Wait for floating to complete before performing next command?
 *
 * ---
 *
 * MOVE: Home Reset
 * - Causes the unit(s) to move back to their home position(s) and face back to
 *   their original direction(s).
 *
 *   Targets:
 *   - Select which unit(s) to move.
 *
 *   Wait For Movement?:
 *   - Wait for movement to complete before performing next command?
 *
 * ---
 *
 * MOVE: Jump
 * - Causes the unit(s) to jump into the air.
 * - Sideview-only!
 *
 *   Targets:
 *   - Select which unit(s) to make jump.
 *
 *   Desired Height:
 *   - Max jump height to go above the ground
 *   - You may use JavaScript code.
 *
 *   Duration:
 *   - Duration in frames for total jump amount.
 *
 *   Wait For Jump?:
 *   - Wait for jumping to complete before performing next command?
 *
 * ---
 *
 * MOVE: Move Distance
 * - Moves unit(s) by a distance from their current position(s).
 * - Sideview-only!
 *
 *   Targets:
 *   - Select which unit(s) to move.
 *
 *   Distance Adjustment:
 *   - Makes adjustments to distance values to determine which direction to
 *     move unit(s).
 *     - Normal - No adjustments made
 *     - Horizontal - Actors adjust left, Enemies adjust right
 *     - Vertical - Actors adjust Up, Enemies adjust down
 *     - Both - Applies both Horizontal and Vertical
 *
 *     Distance: X:
 *     - Horizontal distance to move.
 *     - You may use JavaScript code.
 *
 *     Distance: Y:
 *     - Vertical distance to move.
 *     - You may use JavaScript code.
 *
 *   Duration:
 *   - Duration in frames for total movement amount.
 *
 *   Face Destination?:
 *   - Turn and face the destination?
 *
 *   Movement Easing:
 *   - Select which easing type you wish to apply.
 *   - Requires VisuMZ_0_CoreEngine.
 *
 *   Movement Motion:
 *   - Play this motion for the unit(s).
 *
 *   Wait For Movement?:
 *   - Wait for movement to complete before performing next command?
 *
 * ---
 *
 * MOVE: Move To Point
 * - Moves unit(s) to a designated point on the screen.
 * - Sideview-only! Points based off Graphics.boxWidth/Height.
 *
 *   Targets:
 *   - Select which unit(s) to move.
 *
 *   Destination Point:
 *   - Select which point to face.
 *     - Home
 *     - Center
 *     - Point X, Y
 *       - Replace 'x' and 'y' with coordinates
 *
 *   Offset Adjustment:
 *   - Makes adjustments to offset values to determine which direction to
 *     adjust the destination by.
 *
 *     Offset: X:
 *     - Horizontal offset to move.
 *     - You may use JavaScript code.
 *
 *     Offset: Y:
 *     - Vertical offset to move.
 *     - You may use JavaScript code.
 *
 *   Duration:
 *   - Duration in frames for total movement amount.
 *
 *   Face Destination?:
 *   - Turn and face the destination?
 *
 *   Movement Easing:
 *   - Select which easing type you wish to apply.
 *   - Requires VisuMZ_0_CoreEngine.
 *
 *   Movement Motion:
 *   - Play this motion for the unit(s).
 *
 *   Wait For Movement?:
 *   - Wait for movement to complete before performing next command?
 *
 * ---
 *
 * MOVE: Move To Target(s)
 * - Moves unit(s) to another unit(s) on the battle field.
 * - Sideview-only!
 *
 *   Targets (Moving):
 *   - Select which unit(s) to move.
 *
 *   Targets (Destination):
 *   - Select which unit(s) to move to.
 *
 *     Target Location:
 *     - Select which part target group to move to.
 *       - front head
 *       - front center
 *       - front base
 *       - middle head
 *       - middle center
 *       - middle base
 *       - back head
 *       - back center
 *       - back base
 *
 *     Melee Distance:
 *     - The melee distance away from the target location in addition to the
 *       battler's width.
 *
 *   Offset Adjustment:
 *   - Makes adjustments to offset values to determine which direction to
 *     adjust the destination by.
 *
 *     Offset: X:
 *     - Horizontal offset to move.
 *     - You may use JavaScript code.
 *
 *     Offset: Y:
 *     - Vertical offset to move.
 *     - You may use JavaScript code.
 *
 *   Duration:
 *   - Duration in frames for total movement amount.
 *
 *   Face Destination?:
 *   - Turn and face the destination?
 *
 *   Movement Easing:
 *   - Select which easing type you wish to apply.
 *   - Requires VisuMZ_0_CoreEngine.
 *
 *   Movement Motion:
 *   - Play this motion for the unit(s).
 *
 *   Wait For Movement?:
 *   - Wait for movement to complete before performing next command?
 *
 * ---
 *
 * MOVE: Opacity
 * - Causes the unit(s) to change opacity.
 * - Sideview-only!
 *
 *   Targets:
 *   - Select which unit(s) to change opacity.
 *
 *   Desired Opacity:
 *   - Change to this opacity value.
 *   - You may use JavaScript code.
 *
 *   Duration:
 *   - Duration in frames for opacity change.
 *
 *   Opacity Easing:
 *   - Select which easing type you wish to apply.
 *   - Requires VisuMZ_0_CoreEngine.
 *
 *   Wait For Opacity?:
 *   - Wait for opacity changes to complete before performing next command?
 *
 * ---
 *
 * MOVE: Scale/Grow/Shrink
 * - Causes the unit(s) to scale, grow, or shrink?.
 * - Sideview-only!
 *
 *   Targets:
 *   - Select which unit(s) to change the scale of.
 *
 *   Scale X:
 *   Scale Y:
 *   - What target scale value do you want?
 *   - 1.0 is normal size.
 *
 *   Duration:
 *   - Duration in frames to scale for.
 *
 *   Scale Easing:
 *   - Select which easing type you wish to apply.
 *   - Requires VisuMZ_0_CoreEngine.
 *
 *   Wait For Scale?:
 *   - Wait for scaling to complete before performing next command?
 *
 * ---
 *
 * MOVE: Skew/Distort
 * - Causes the unit(s) to skew.
 * - Sideview-only!
 *
 *   Targets:
 *   - Select which unit(s) to skew.
 *
 *   Skew X:
 *   Skew Y:
 *   - What variance to skew?
 *   - Use small values for the best results.
 *
 *   Duration:
 *   - Duration in frames to skew for.
 *
 *   Skew Easing:
 *   - Select which easing type you wish to apply.
 *   - Requires VisuMZ_0_CoreEngine.
 *
 *   Wait For Skew?:
 *   - Wait for skew to complete before performing next command?
 *
 * ---
 *
 * MOVE: Spin/Rotate
 * - Causes the unit(s) to spin.
 * - Sideview-only!
 *
 *   Targets:
 *   - Select which unit(s) to spin.
 *
 *   Angle:
 *   - How many degrees to spin?
 *
 *   Duration:
 *   - Duration in frames to spin for.
 *
 *   Spin Easing:
 *   - Select which easing type you wish to apply.
 *   - Requires VisuMZ_0_CoreEngine.
 * 
 *   Revert Angle on Finish:
 *   - Upon finishing the spin, revert the angle back to 0.
 *
 *   Wait For Spin?:
 *   - Wait for spin to complete before performing next command?
 *
 * ---
 *
 * MOVE: Wait For Float
 * - Waits for floating to complete before performing next command.
 *
 * ---
 *
 * MOVE: Wait For Jump
 * - Waits for jumping to complete before performing next command.
 *
 * ---
 *
 * MOVE: Wait For Movement
 * - Waits for movement to complete before performing next command.
 *
 * ---
 *
 * MOVE: Wait For Opacity
 * - Waits for opacity changes to complete before performing next command.
 *
 * ---
 *
 * MOVE: Wait For Scale
 * - Waits for scaling to complete before performing next command.
 *
 * ---
 *
 * MOVE: Wait For Skew
 * - Waits for skewing to complete before performing next command.
 *
 * ---
 *
 * MOVE: Wait For Spin
 * - Waits for spinning to complete before performing next command.
 *
 * ---
 * 
 * === Action Sequences - Projectiles ===
 * 
 * Create projectiles on the screen and fire them off at a target.
 * Requires VisuMZ_3_ActSeqProjectiles!
 * 
 * ---
 *
 * PROJECTILE: Animation
 * - Create an animation projectile and fire it at a target.
 * - Requires VisuMZ_3_ActSeqProjectiles!
 *
 *   Coordinates:
 *
 *     Start Location:
 *     - Settings to determine where the projectile(s) start from.
 *
 *       Type:
 *       - Select where the projectile should start from.
 *         - Target - Start from battler target(s)
 *         - Point - Start from a point on the screen
 *
 *         Target(s):
 *         - Select which unit(s) to start the projectile from.
 *
 *           Centralize:
 *           - Create one projectile at the center of the targets?
 *           - Or create a projectile for each target?
 *
 *         Point X:
 *         Point Y:
 *         - Insert the X/Y coordinate to start the projectile at.
 *         - You may use JavaScript code.
 *
 *       Offset X:
 *       Offset Y:
 *       - Insert how many pixels to offset the X/Y coordinate by.
 *       - You may use JavaScript code.
 *
 *     Goal Location:
 *     - Settings to determine where the projectile(s) start from.
 *
 *       Type:
 *       - Select where the projectile should go to.
 *         - Target - Goal is battler target(s)
 *         - Point - Goal is a point on the screen
 *
 *         Target(s):
 *         - Select which unit(s) for projectile to go to.
 *
 *           Centralize:
 *           - Create one projectile at the center of the targets?
 *           - Or create a projectile for each target?
 *
 *         Point X:
 *         Point Y:
 *         - Insert the X/Y coordinate to send the projectile to.
 *         - You may use JavaScript code.
 *
 *       Offset X:
 *       Offset Y:
 *       - Insert how many pixels to offset the X/Y coordinate by.
 *       - You may use JavaScript code.
 *
 *   Settings:
 *
 *     Animation ID:
 *     - Determine which animation to use as a projectile.
 *
 *     Duration:
 *     - Duration for the projectile(s) to travel.
 *
 *     Wait For Projectile?:
 *     - Wait for projectile(s) to reach their destination before going onto
 *       the next command?
 *
 *     Extra Settings:
 *     - Add extra settings to the projectile?
 *
 *       Auto Angle?:
 *       - Automatically angle the projectile to tilt the direction
 *         it's moving?
 *
 *       Angle Offset:
 *       - Alter the projectile's tilt by this many degrees.
 *
 *       Arc Peak:
 *       - This is the height of the project's trajectory arc in pixels.
 *
 *       Easing:
 *       - Select which easing type to apply to the projectile's trajectory.
 *
 *       Spin Speed:
 *       - Determine how much angle the projectile spins per frame.
 *       - Does not work well with "Auto Angle".
 *
 * ---
 *
 * PROJECTILE: Icon
 * - Create an icon projectile and fire it at a target.
 * - Requires VisuMZ_3_ActSeqProjectiles!
 *
 *   Coordinates:
 *
 *     Start Location:
 *     - Settings to determine where the projectile(s) start from.
 *
 *       Type:
 *       - Select where the projectile should start from.
 *         - Target - Start from battler target(s)
 *         - Point - Start from a point on the screen
 *
 *         Target(s):
 *         - Select which unit(s) to start the projectile from.
 *
 *           Centralize:
 *           - Create one projectile at the center of the targets?
 *           - Or create a projectile for each target?
 *
 *         Point X:
 *         Point Y:
 *         - Insert the X/Y coordinate to start the projectile at.
 *         - You may use JavaScript code.
 *
 *       Offset X:
 *       Offset Y:
 *       - Insert how many pixels to offset the X/Y coordinate by.
 *       - You may use JavaScript code.
 *
 *     Goal Location:
 *     - Settings to determine where the projectile(s) start from.
 *
 *       Type:
 *       - Select where the projectile should go to.
 *         - Target - Goal is battler target(s)
 *         - Point - Goal is a point on the screen
 *
 *         Target(s):
 *         - Select which unit(s) for projectile to go to.
 *
 *           Centralize:
 *           - Create one projectile at the center of the targets?
 *           - Or create a projectile for each target?
 *
 *         Point X:
 *         Point Y:
 *         - Insert the X/Y coordinate to send the projectile to.
 *         - You may use JavaScript code.
 *
 *       Offset X:
 *       Offset Y:
 *       - Insert how many pixels to offset the X/Y coordinate by.
 *       - You may use JavaScript code.
 *
 *   Settings:
 *
 *     Icon:
 *     - Determine which icon to use as a projectile.
 *       - You may use JavaScript code.
 *
 *     Duration:
 *     - Duration for the projectile(s) to travel.
 *
 *     Wait For Projectile?:
 *     - Wait for projectile(s) to reach their destination before going onto
 *       the next command?
 *
 *     Extra Settings:
 *     - Add extra settings to the projectile?
 *
 *       Auto Angle?:
 *       - Automatically angle the projectile to tilt the direction
 *         it's moving?
 *
 *       Angle Offset:
 *       - Alter the projectile's tilt by this many degrees.
 *
 *       Arc Peak:
 *       - This is the height of the project's trajectory arc in pixels.
 *
 *       Blend Mode:
 *       - What kind of blend mode do you wish to apply to the projectile?
 *         - Normal
 *         - Additive
 *         - Multiply
 *         - Screen
 *
 *       Easing:
 *       - Select which easing type to apply to the projectile's trajectory.
 *
 *       Hue:
 *       - Adjust the hue of the projectile.
 *       - Insert a number between 0 and 360.
 *
 *       Scale:
 *       - Adjust the size scaling of the projectile.
 *       - Use decimals for exact control.
 *
 *       Spin Speed:
 *       - Determine how much angle the projectile spins per frame.
 *       - Does not work well with "Auto Angle".
 *
 * ---
 *
 * PROJECTILE: Picture
 * - Create a picture projectile and fire it at a target.
 * - Requires VisuMZ_3_ActSeqProjectiles!
 *
 *   Coordinates:
 *
 *     Start Location:
 *     - Settings to determine where the projectile(s) start from.
 *
 *       Type:
 *       - Select where the projectile should start from.
 *         - Target - Start from battler target(s)
 *         - Point - Start from a point on the screen
 *
 *         Target(s):
 *         - Select which unit(s) to start the projectile from.
 *
 *           Centralize:
 *           - Create one projectile at the center of the targets?
 *           - Or create a projectile for each target?
 *
 *         Point X:
 *         Point Y:
 *         - Insert the X/Y coordinate to start the projectile at.
 *         - You may use JavaScript code.
 *
 *       Offset X:
 *       Offset Y:
 *       - Insert how many pixels to offset the X/Y coordinate by.
 *       - You may use JavaScript code.
 *
 *     Goal Location:
 *     - Settings to determine where the projectile(s) start from.
 *
 *       Type:
 *       - Select where the projectile should go to.
 *         - Target - Goal is battler target(s)
 *         - Point - Goal is a point on the screen
 *
 *         Target(s):
 *         - Select which unit(s) for projectile to go to.
 *
 *           Centralize:
 *           - Create one projectile at the center of the targets?
 *           - Or create a projectile for each target?
 *
 *         Point X:
 *         Point Y:
 *         - Insert the X/Y coordinate to send the projectile to.
 *         - You may use JavaScript code.
 *
 *       Offset X:
 *       Offset Y:
 *       - Insert how many pixels to offset the X/Y coordinate by.
 *       - You may use JavaScript code.
 *
 *   Settings:
 *
 *     Picture Filename:
 *     - Determine which picture to use as a projectile.
 *
 *     Duration:
 *     - Duration for the projectile(s) to travel.
 *
 *     Wait For Projectile?:
 *     - Wait for projectile(s) to reach their destination before going onto
 *       the next command?
 *
 *     Extra Settings:
 *     - Add extra settings to the projectile?
 *
 *       Auto Angle?:
 *       - Automatically angle the projectile to tilt the direction
 *         it's moving?
 *
 *       Angle Offset:
 *       - Alter the projectile's tilt by this many degrees.
 *
 *       Arc Peak:
 *       - This is the height of the project's trajectory arc in pixels.
 *
 *       Blend Mode:
 *       - What kind of blend mode do you wish to apply to the projectile?
 *         - Normal
 *         - Additive
 *         - Multiply
 *         - Screen
 *
 *       Easing:
 *       - Select which easing type to apply to the projectile's trajectory.
 *
 *       Hue:
 *       - Adjust the hue of the projectile.
 *       - Insert a number between 0 and 360.
 *
 *       Scale:
 *       - Adjust the size scaling of the projectile.
 *       - Use decimals for exact control.
 *
 *       Spin Speed:
 *       - Determine how much angle the projectile spins per frame.
 *       - Does not work well with "Auto Angle".
 *
 * ---
 * 
 * === Action Sequences - Skew ===
 * 
 * These action sequences allow you to have control over the camera skew.
 * Requires VisuMZ_3_ActSeqCamera!
 * 
 * ---
 *
 * SKEW: Change Skew
 * - Changes the camera skew.
 * - Requires VisuMZ_3_ActSeqCamera!
 *
 *   Skew X:
 *   - Change the camera skew X to this value.
 *
 *   Skew Y:
 *   - Change the camera skew Y to this value.
 *
 *   Duration:
 *   - Duration in frames to change camera skew.
 *
 *   Skew Easing:
 *   - Select which easing type you wish to apply.
 *   - Requires VisuMZ_0_CoreEngine.
 *
 *   Wait For Skew?:
 *   - Wait for skew changes to complete before performing next command?
 *
 * ---
 *
 * SKEW: Reset Skew
 * - Reset any skew settings.
 * - Requires VisuMZ_3_ActSeqCamera!
 *
 *   Duration:
 *   - Duration in frames to reset camera skew.
 *
 *   Skew Easing:
 *   - Select which easing type you wish to apply.
 *   - Requires VisuMZ_0_CoreEngine.
 *
 *   Wait For Skew?:
 *   - Wait for skew changes to complete before performing next command?
 *
 * ---
 *
 * SKEW: Wait For Skew
 * - Waits for skew changes to complete before performing next command.
 * - Requires VisuMZ_3_ActSeqCamera!
 *
 * ---
 *
 * === Action Sequences - Target ===
 *
 * If using a manual target by target Action Sequence, these commands will give
 * you full control over its usage.
 *
 * ---
 *
 * TARGET: Current Index
 * - Sets the current index to this value.
 * - Then decide to jump to a label (optional).
 *
 *   Set Index To:
 *   - Sets current targeting index to this value.
 *   - 0 is the starting index of a target group.
 *
 *   Jump To Label:
 *   - If a target is found after the index change, jump to this label in the
 *     Common Event.
 *
 * ---
 *
 * TARGET: Next Target
 * - Moves index forward by 1 to select a new current target.
 * - Then decide to jump to a label (optional).
 *
 *   Jump To Label:
 *   - If a target is found after the index change, jump to this label in the
 *     Common Event.
 *
 * ---
 *
 * TARGET: Previous Target
 * - Moves index backward by 1 to select a new current target.
 * - Then decide to jump to a label (optional).
 *
 *   Jump To Label:
 *   - If a target is found after the index change, jump to this label in the
 *     Common Event.
 *
 * ---
 *
 * TARGET: Random Target
 * - Sets index randomly to determine new currernt target.
 * - Then decide to jump to a label (optional).
 *
 *   Force Random?:
 *   - Index cannot be its previous index amount after random.
 *
 *   Jump To Label:
 *   - If a target is found after the index change, jump to this label in the
 *     Common Event.
 *
 * ---
 *
 * === Action Sequences - Weapon ===
 *
 * Allows for finer control over Dual/Multi Wielding actors.
 * Only works for Actors.
 *
 * ---
 *
 * WEAPON: Clear Weapon Slot
 * - Clears the active weapon slot (making others valid again).
 * - Only works for Actors.
 *
 *   Targets:
 *   - Select unit(s) to clear the active weapon slot for.
 *
 * ---
 *
 * WEAPON: Next Weapon Slot
 * - Goes to next active weapon slot (making others invalid).
 * - If next slot is weaponless, don't label jump.
 *
 *   Targets:
 *   - Select unit(s) to change the next active weapon slot for.
 *
 * ---
 *
 * WEAPON: Set Weapon Slot
 * - Sets the active weapon slot (making others invalid).
 * - Only works for Actors.
 *
 *   Targets:
 *   - Select unit(s) to change the active weapon slot for.
 *
 *   Weapon Slot ID:
 *   - Select weapon slot to make active (making others invalid).
 *   - Use 0 to clear and normalize. You may use JavaScript code.
 *
 * ---
 *
 * === Action Sequences - Zoom ===
 *
 * These Action Sequences are zoom-related.
 * Requires VisuMZ_3_ActSeqCamera!
 *
 * ---
 *
 * ZOOM: Change Scale
 * - Changes the zoom scale.
 * - Requires VisuMZ_3_ActSeqCamera!
 *
 *   Scale:
 *   - The zoom scale to change to.
 *
 *   Duration:
 *   - Duration in frames to reset battle zoom.
 *
 *   Zoom Easing:
 *   - Select which easing type you wish to apply.
 *   - Requires VisuMZ_0_CoreEngine.
 *
 *   Wait For Zoom?
 *   - Wait for zoom changes to complete before performing next command?
 *
 * ---
 *
 * ZOOM: Reset Zoom
 * - Reset any zoom settings.
 * - Requires VisuMZ_3_ActSeqCamera!
 *
 *   Duration:
 *   - Duration in frames to reset battle zoom.
 *
 *   Zoom Easing:
 *   - Select which easing type you wish to apply.
 *   - Requires VisuMZ_0_CoreEngine.
 *
 *   Wait For Zoom?
 *   - Wait for zoom changes to complete before performing next command?
 *
 * ---
 *
 * ZOOM: Wait For Zoom
 * - Waits for zoom changes to complete before performing next command.
 * Requires VisuMZ_3_ActSeqCamera!
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Auto Battle Settings
 * ============================================================================
 *
 * These Plugin Parameter settings allow you to change the aspects added by
 * this plugin that support Auto Battle and the Auto Battle commands.
 *
 * Auto Battle commands can be added to the Party Command Window and/or Actor
 * Command Window. The one used by the Party Command Window will cause the
 * whole party to enter an Auto Battle state until stopped by a button input.
 * The command used by the Actor Command Window, however, will cause the actor
 * to select an action based off the Auto Battle A.I. once for the current turn
 * instead.
 *
 * ---
 *
 * Battle Display
 * 
 *   Message:
 *   - Message that's displayed when Auto Battle is on.
 *     Text codes allowed. %1 - OK button, %2 - Cancel button
 * 
 *   OK Button:
 *   - Text used to represent the OK button.
 *   - If VisuMZ_0_CoreEngine is present, ignore this.
 * 
 *   Cancel Button:
 *   - Text used to represent the Cancel button.
 *   - If VisuMZ_0_CoreEngine is present, ignore this.
 * 
 *   Background Type:
 *   - Select background type for Auto Battle window.
 *     - 0 - Window
 *     - 1 - Dim
 *     - 2 - Transparent
 * 
 *   JS: X, Y, W, H:
 *   - Code used to determine the dimensions for this window.
 *
 * ---
 *
 * Options
 * 
 *   Add Option?:
 *   - Add the Auto Battle options to the Options menu?
 * 
 *   Adjust Window Height:
 *   - Automatically adjust the options window height?
 * 
 *   Startup Name:
 *   - Command name of the option.
 * 
 *   Style Name:
 *   - Command name of the option.
 * 
 *   OFF:
 *   - Text displayed when Auto Battle Style is OFF.
 * 
 *   ON:
 *   - Text displayed when Auto Battle Style is ON.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Damage Settings
 * ============================================================================
 *
 * These Plugin Parameters add a variety of things to how damage is handled in
 * battle. These range from hard damage caps to soft damage caps to how damage
 * popups appear, how the formulas for various aspects are handled and more.
 *
 * Damage Styles are also a feature added through this plugin. More information
 * can be found in the help section above labeled 'Damage Styles'.
 *
 * ---
 *
 * Damage Cap
 * 
 *   Enable Damage Cap?:
 *   - Put a maximum hard damage cap on how far damage can go?
 *   - This can be broken through the usage of notetags.
 * 
 *   Default Hard Cap:
 *   - The default hard damage cap used before applying damage.
 * 
 *   Enable Soft Cap?:
 *   - Soft caps ease in the damage values leading up to the  hard damage cap.
 *   - Requires hard Damage Cap enabled.
 * 
 *     Base Soft Cap Rate:
 *     - The default soft damage cap used before applying damage.
 * 
 *     Soft Scale Constant:
 *     - The default soft damage cap used before applying damage.
 *
 * ---
 *
 * Popups
 * 
 *   Popup Duration:
 *   - Adjusts how many frames a popup stays visible.
 * 
 *   Newest Popups Bottom:
 *   - Puts the newest popups at the bottom.
 * 
 *   Offset X:
 *   Offset Y:
 *   - Sets how much to offset the sprites by horizontally/vertically.
 * 
 *   Shift X:
 *   Shift Y:
 *   - Sets how much to shift the sprites by horizontally/vertically.
 * 
 *   Shift Y:
 * 
 *   Critical Flash Color:
 *   - Adjust the popup's flash color.
 *   - Format: [red, green, blue, alpha]
 * 
 *   Critical Duration:
 *   - Adjusts how many frames a the flash lasts.
 *
 * ---
 *
 * Formulas
 * 
 *   JS: Overall Formula:
 *   - The overall formula used when calculating damage.
 * 
 *   JS: Variance Formula:
 *   - The formula used when damage variance.
 * 
 *   JS: Guard Formula:
 *   - The formula used when damage is guarded.
 *
 * ---
 *
 * Critical Hits
 * 
 *   JS: Rate Formula:
 *   - The formula used to calculate Critical Hit Rates.
 * 
 *   JS: Damage Formula:
 *   - The formula used to calculate Critical Hit Damage modification.
 *
 * ---
 *
 * Damage Styles
 * 
 *   Default Style:
 *   - Which Damage Style do you want to set as default?
 *   - Use 'Manual' to not use any styles at all.
 *     - The 'Manual' style will not support <Armor Penetration> notetags.
 *     - The 'Manual' style will not support <Armor Reduction> notetags.
 * 
 *   Style List:
 *   - A list of the damage styles available.
 *   - These are used to calculate base damage.
 * 
 *     Name:
 *     - Name of this Damage Style.
 *     -Used for notetags and such.
 * 
 *     JS: Formula:
 *     - The base formula for this Damage Style.
 * 
 *     Items & Equips Core:
 * 
 *       HP Damage:
 *       MP Damage:
 *       HP Recovery:
 *       MP Recovery:
 *       HP Drain:
 *       MP Drain:
 *       - Vocabulary used for this data entry.
 * 
 *       JS: Damage Display:
 *       - Code used the data displayed for this category.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Mechanics Settings
 * ============================================================================
 *
 * Some of the base settings for the various mechanics found in the battle
 * system can be altered here in these Plugin Parameters. Most of these will
 * involve JavaScript code and require you to have to good understanding of
 * how the RPG Maker MZ code works before tampering with it.
 *
 * ---
 *
 * Action Speed
 * 
 *   Allow Random Speed?:
 *   - Allow speed to be randomized base off the user's AGI?
 * 
 *   JS: Calculate:
 *   - Code used to calculate action speed.
 *
 * ---
 *
 * Base Troop
 * 
 *   Base Troop ID's:
 *   - Select the Troop ID(s) to duplicate page events from for all
 *     other troops.
 *   - More information can be found in the dedicated Help section above.
 *
 * ---
 *
 * Escape
 * 
 *   JS: Calc Escape Ratio:
 *   - Code used to calculate the escape success ratio.
 * 
 *   JS: Calc Escape Raise:
 *   - Code used to calculate how much the escape success ratio raises upon
 *     each failure.
 * 
 * ---
 * 
 * Common Events (on Map)
 * 
 *   Pre-Battle Event:
 *   Post-Battle Event:
 *   Victory Event:
 *   Defeat Event:
 *   Escape Success Event:
 *   Escape Fail Event:
 *   - Queued Common Event to run upon meeting the condition.
 *   - Use to 0 to not run any Common Event at all.
 *   - "Post-Battle Event" will always run regardless.
 *   - If any events are running before the battle, they will continue running
 *     to the end first before the queued Common Events will run.
 *   - These common events only run on the map scene. They're not meant to run
 *     in the battle scene.
 *   - If the "Defeat Event" has a common event attached to it, then random
 *     encounters will be changed to allow defeat without being sent to the
 *     Game Over scene. Instead, the game will send the player to the map scene
 *     where the Defeat Event will run.
 *
 * ---
 *
 * JS: Battle-Related
 * 
 *   JS: Pre-Start Battle:
 *   - Target function: BattleManager.startBattle()
 *   - JavaScript code occurs before function is run.
 * 
 *   JS: Post-Start Battle:
 *   - Target function: BattleManager.startBattle()
 *   - JavaScript code occurs after function is run.
 * 
 *   JS: Battle Victory:
 *   - Target function: BattleManager.processVictory()
 *   - JavaScript code occurs before function is run.
 * 
 *   JS: Escape Success:
 *   - Target function: BattleManager.onEscapeSuccess()
 *   - JavaScript code occurs before function is run.
 * 
 *   JS: Escape Failure:
 *   - Target function: BattleManager.onEscapeFailure()
 *   - JavaScript code occurs before function is run.
 * 
 *   JS: Battle Defeat:
 *   - Target function: BattleManager.processDefeat()
 *   - JavaScript code occurs before function is run.
 * 
 *   JS: Pre-End Battle:
 *   - Target function: BattleManager.endBattle()
 *   - JavaScript code occurs before function is run.
 * 
 *   JS: Post-End Battle:
 *   - Target function: BattleManager.endBattle()
 *   - JavaScript code occurs after function is run.
 *
 * ---
 *
 * JS: Turn-Related
 * 
 *   JS: Pre-Start Turn:
 *   - Target function: BattleManager.startTurn()
 *   - JavaScript code occurs before function is run.
 * 
 *   JS: Post-Start Turn:
 *   - Target function: BattleManager.startTurn()
 *   - JavaScript code occurs after function is run.
 * 
 *   JS: Pre-End Turn:
 *   - Target function: Game_Battler.prototype.onTurnEnd()
 *   - JavaScript code occurs before function is run.
 * 
 *   JS: Post-End Turn:
 *   - Target function: Game_Battler.prototype.onTurnEnd()
 *   - JavaScript code occurs after function is run.
 * 
 *   JS: Pre-Regenerate:
 *   - Target function: Game_Battler.prototype.regenerateAll()
 *   - JavaScript code occurs before function is run.
 * 
 *   JS: Post-Regenerate:
 *   - Target function: Game_Battler.prototype.regenerateAll()
 *   - JavaScript code occurs after function is run.
 *
 * ---
 *
 * JS: Action-Related
 * 
 *   JS: Pre-Start Action:
 *   - Target function: BattleManager.startAction()
 *   - JavaScript code occurs before function is run.
 * 
 *   JS: Post-Start Action:
 *   - Target function: BattleManager.startAction()
 *   - JavaScript code occurs after function is run.
 * 
 *   JS: Pre-Apply:
 *   - Target function: Game_Action.prototype.apply()
 *   - JavaScript code occurs before function is run.
 * 
 *   JS: Pre-Damage:
 *   - Target function: Game_Action.prototype.executeDamage()
 *   - JavaScript code occurs before function is run.
 * 
 *   JS: Post-Damage:
 *   - Target function: Game_Action.prototype.executeDamage()
 *   - JavaScript code occurs after function is run.
 * 
 *   JS: Post-Apply:
 *   - Target function: Game_Action.prototype.apply()
 *   - JavaScript code occurs after function is run.
 * 
 *   JS: Pre-End Action:
 *   - Target function: BattleManager.endAction()
 *   - JavaScript code occurs before function is run.
 * 
 *   JS: Post-End Action:
 *   - DescriTarget function: BattleManager.endAction()
 *   - JavaScript code occurs after function is run.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Battle Layout Settings
 * ============================================================================
 *
 * The Battle Layout Settings Plugin Parameter gives you control over the look,
 * style, and appearance of certain UI elements. These range from the way the
 * Battle Status Window presents its information to the way certain windows
 * like the Party Command Window and Actor Command Window appear.
 *
 * ---
 *
 * Battle Layout Style
 * - The style used for the battle layout.
 * 
 *   Default:
 *   - Shows actor faces in Battle Status.
 * 
 *   List:
 *   - Lists actors in Battle Status.
 * 
 *   XP:
 *   - Shows actor battlers in a stretched Battle Status.
 * 
 *   Portrait:
 *   - Shows portraits in a stretched Battle Status.
 * 
 *   Border:
 *   - Displays windows around the screen border.
 *
 * ---
 *
 * List Style
 * 
 *   Show Faces:
 *   - Shows faces in List Style?
 * 
 *   Command Window Width:
 *   - Determine the window width for the Party and Actor Command Windows.
 *   - Affects Default and List Battle Layout styles.
 *
 * ---
 *
 * XP Style
 * 
 *   Command Lines:
 *   - Number of action lines in the Actor Command Window for the XP Style.
 * 
 *   Sprite Height:
 *   - Default sprite height used when if the sprite's height has not been
 *     determined yet.
 * 
 *   Sprite Base Location:
 *   - Determine where the sprite is located on the Battle Status Window.
 *     - Above Name - Sprite is located above the name.
 *     - Bottom - Sprite is located at the bottom of the window.
 *     - Centered - Sprite is centered in the window.
 *     - Top - Sprite is located at the top of the window.
 *
 * ---
 *
 * Portrait Style
 * 
 *   Show Portraits?:
 *   - Requires VisuMZ_1_MainMenuCore.
 *   - Shows the actor's portrait instead of a face.
 * 
 *   Portrait Scaling:
 *   - If portraits are used, scale them by this much.
 *
 * ---
 *
 * Border Style
 * 
 *   Columns:
 *   - The total number of columns for Skill & Item Windows in the battle scene
 * 
 *   Show Portraits?:
 *   - Requires VisuMZ_1_MainMenuCore.
 *   - Shows the actor's portrait at the edge of the screen.
 * 
 *   Portrait Scaling:
 *   - If portraits are used, scale them by this much.
 *
 * ---
 *
 * Skill & Item Windows
 * 
 *   Middle Layout:
 *   - Shows the Skill & Item Windows in mid-screen?
 * 
 *   Columns:
 *   - The total number of columns for Skill & Item Windows in the battle scene
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Battle Log Settings
 * ============================================================================
 *
 * These Plugin Parameters give you control over how the Battle Log Window, the
 * window shown at the top of the screen in the battle layout, appears, its
 * various properties, and which text will be displayed.
 *
 * The majority of the text has been disabled by default with this plugin to
 * make the flow of battle progress faster.
 *
 * ---
 *
 * General
 * 
 *   Back Color:
 *   - Use #rrggbb for a hex color.
 * 
 *   Max Lines:
 *   - Maximum number of lines to be displayed.
 * 
 *   Message Wait:
 *   - Number of frames for a usual message wait.
 * 
 *   Text Align:
 *   - Text alignment for the Window_BattleLog.
 * 
 *   JS: X, Y, W, H:
 *   - Code used to determine the dimensions for the battle log.
 *
 * ---
 *
 * Start Turn
 * 
 *   Show Start Turn?:
 *   - Display turn changes at the start of the turn?
 * 
 *   Start Turn Message:
 *   - Message displayed at turn start.
 *   - %1 - Turn Count
 * 
 *   Start Turn Wait:
 *   - Number of frames to wait after a turn started.
 *
 * ---
 *
 * Display Action
 * 
 *   Show Centered Action?:
 *   - Display a centered text of the action name?
 * 
 *   Show Skill Message 1?:
 *   - Display the 1st skill message?
 * 
 *   Show Skill Message 2?:
 *   - Display the 2nd skill message?
 * 
 *   Show Item Message?:
 *   - Display the item use message?
 *
 * ---
 *
 * Action Changes
 * 
 *   Show Counter?:
 *   - Display counter text?
 * 
 *   Show Reflect?:
 *   - Display magic reflection text?
 * 
 *   Show Substitute?:
 *   - Display substitute text?
 *
 * ---
 *
 * Action Results
 * 
 *   Show No Effect?:
 *   - Display no effect text?
 * 
 *   Show Critical?:
 *   - Display critical text?
 * 
 *   Show Miss/Evasion?:
 *   - Display miss/evasion text?
 * 
 *   Show HP Damage?:
 *   - Display HP Damage text?
 * 
 *   Show MP Damage?:
 *   - Display MP Damage text?
 * 
 *   Show TP Damage?:
 *   - Display TP Damage text?
 *
 * ---
 *
 * Display States
 * 
 *   Show Added States?:
 *   - Display added states text?
 * 
 *   Show Removed States?:
 *   - Display removed states text?
 * 
 *   Show Current States?:
 *   - Display the currently affected state text?
 * 
 *   Show Added Buffs?:
 *   - Display added buffs text?
 * 
 *   Show Added Debuffs?:
 *   - Display added debuffs text?
 * 
 *   Show Removed Buffs?:
 *   - Display removed de/buffs text?
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Battleback Scaling Settings
 * ============================================================================
 *
 * By default, the battlebacks in RPG Maker MZ scale as if the screen size is
 * a static 816x624 resolution, which isn't always the case. These settings
 * here allow you to dictate how you want the battlebacks to scale for the
 * whole game. These settings CANNOT be changed midgame or per battle.
 *
 * ---
 *
 * Settings
 * 
 *   Default Style:
 *   - The default scaling style used for battlebacks.
 *   - MZ (MZ's default style)
 *   - 1:1 (No Scaling)
 *   - Scale To Fit (Scale to screen size)
 *   - Scale Down (Scale Downward if Larger than Screen)
 *   - Scale Up (Scale Upward if Smaller than Screen)
 * 
 *   JS: 1:1:
 *   JS: Scale To Fit:
 *   JS: Scale Down:
 *   JS: Scale Up:
 *   JS: 1:1:
 *   JS: 1:1:
 *   - This code gives you control over the scaling for this style.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Party Command Window
 * ============================================================================
 *
 * These Plugin Parameters allow you control over how the Party Command Window
 * operates in the battle scene. You can turn disable it from appearing or make
 * it so that it doesn't 
 *
 * ---
 *
 * Command Window
 * 
 *   Style:
 *   - How do you wish to draw commands in the Party Command Window?
 *   - Text Only: Display only the text.
 *   - Icon Only: Display only the icon.
 *   - Icon + Text: Display the icon first, then the text.
 *   - Auto: Determine which is better to use based on the size of the cell.
 * 
 *   Text Align:
 *   - Text alignment for the Party Command Window.
 * 
 *   Fight Icon:
 *   - The icon used for the Fight command.
 * 
 *   Add Auto Battle?:
 *   - Add the "Auto Battle" command to the Command Window?
 * 
 *     Auto Battle Icon:
 *     - The icon used for the Auto Battle command.
 * 
 *     Auto Battle Text:
 *     - The text used for the Auto Battle command.
 * 
 *   Add Options?:
 *   - Add the "Options" command to the Command Window?
 * 
 *     Options Icon:
 *     - The icon used for the Options command.
 * 
 *     Active TPB Message:
 *     - Message that will be displayed when selecting options during the
 *       middle of an action.
 * 
 *   Escape Icon:
 *   - The icon used for the Escape command.
 *
 * ---
 *
 * Access
 * 
 *   Skip Party Command:
 *   - DTB: Skip Party Command selection on turn start.
 *   - TPB: Skip Party Command selection at battle start.
 * 
 *   Disable Party Command:
 *   - Disable the Party Command Window entirely?
 *
 * ---
 *
 * Help Window
 * 
 *   Fight:
 *   - Text displayed when selecting a skill type.
 *   - %1 - Skill Type Name
 * 
 *   Auto Battle:
 *   - Text displayed when selecting the Auto Battle command.
 * 
 *   Options:
 *   - Text displayed when selecting the Options command.
 * 
 *   Escape:
 *   - Text displayed when selecting the escape command.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Actor Command Window
 * ============================================================================
 *
 * These Plugin Parameters allow you to change various aspects regarding the
 * Actor Command Window and how it operates in the battle scene. This ranges
 * from how it appears to the default battle commands given to all players
 * without a custom <Battle Commands> notetag.
 *
 * ---
 *
 * Command Window
 * 
 *   Style:
 *   - How do you wish to draw commands in the Actor Command Window?
 *   - Text Only: Display only the text.
 *   - Icon Only: Display only the icon.
 *   - Icon + Text: Display the icon first, then the text.
 *   - Auto: Determine which is better to use based on the size of the cell.
 * 
 *   Text Align:
 *   - Text alignment for the Actor Command Window.
 * 
 *   Item Icon:
 *   - The icon used for the Item command.
 * 
 *   Normal SType Icon:
 *   - Icon used for normal skill types that aren't assigned any icons.
 *   - Ignore if VisuMZ_1_SkillsStatesCore is installed.
 * 
 *   Magic SType Icon:
 *   - Icon used for magic skill types that aren't assigned any icons.
 *   - Ignore if VisuMZ_1_SkillsStatesCore is installed.
 *
 * ---
 *
 * Battle Commands
 * 
 *   Command List:
 *   - List of battle commands that appear by default if the <Battle Commands>
 *     notetag isn't present.
 *
 *     - Attack 
 *       - Adds the basic attack command.
 * 
 *     - Skills
 *       - Displays all the skill types available to the actor.
 * 
 *     - SType: x
 *     - Stype: name
 *       - Adds in a specific skill type.
 *       - Replace 'x' with the ID of the skill type.
 *       - Replace 'name' with the name of the skill type (without text codes).
 *
 *     - All Skills
 *       - Adds all usable battle skills as individual actions.
 * 
 *     - Skill: x
 *     - Skill: name
 *       - Adds in a specific skill as a usable action.
 *       - Replace 'x' with the ID of the skill.
 *       - Replace 'name' with the name of the skill.
 * 
 *     - Guard
 *       - Adds the basic guard command.
 * 
 *     - Item
 *       - Adds the basic item command.
 * 
 *     - Escape
 *       - Adds the escape command.
 * 
 *     - Auto Battle
 *       - Adds the auto battle command.
 *
 * ---
 *
 * Help Window
 * 
 *   Skill Types:
 *   - Text displayed when selecting a skill type.
 *   - %1 - Skill Type Name
 * 
 *   Items:
 *   - Text displayed when selecting the item command.
 * 
 *   Escape:
 *   - Text displayed when selecting the escape command.
 * 
 *   Auto Battle:
 *   - Text displayed when selecting the Auto Battle command.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Actor Battler Settings
 * ============================================================================
 *
 * These Plugin Parameter settings adjust how the sideview battlers behave for
 * the actor sprites. Some of these settings are shared with enemies if they
 * use sideview battler graphics.
 *
 * ---
 *
 * Flinch
 * 
 *   Flinch Distance X:
 *   - The normal X distance when flinching.
 * 
 *   Flinch Distance Y:
 *   - The normal Y distance when flinching.
 * 
 *   Flinch Duration:
 *   - The number of frames for a flinch to complete.
 *
 * ---
 *
 * Sideview Battlers
 * 
 *   Anchor: X:
 *   - Default X anchor for Sideview Battlers.
 * 
 *   Anchor: Y:
 *   - Default Y anchor for Sideview Battlers.
 * 
 *   Chant Style:
 *   - What determines the chant motion?
 *   - Hit type or skill type?
 * 
 *   Offset X:
 *   - Offsets X position where actor is positioned.
 *   - Negative values go left. Positive values go right.
 * 
 *   Offset Y:
 *   - Offsets Y position where actor is positioned.
 *   - Negative values go up. Positive values go down.
 * 
 *   Motion Speed:
 *   - The number of frames in between each motion.
 * 
 *   Priority: Active:
 *   - Place the active actor on top of actor and enemy sprites.
 * 
 *   Priority: Actors:
 *   - Prioritize actors over enemies when placing sprites on top of each other
 * 
 *   Shadow Visible:
 *   - Show or hide the shadow for Sideview Battlers.
 * 
 *   Smooth Image:
 *   - Smooth out the battler images or pixelate them?
 * 
 *   JS: Home Position:
 *   - Code used to calculate the home position of actors.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Enemy Battler Settings
 * ============================================================================
 *
 * These Plugin Parameter settings adjust how enemies appear visually in the
 * battle scene. Some of these settings will override the settings used for
 * actors if used as sideview battlers. Other settings include changing up the
 * default attack animation for enemies, how the enemy select window functions,
 * and more.
 *
 * ---
 *
 * Visual
 * 
 *   Attack Animation:
 *   - Default attack animation used for enemies.
 *   - Use <Attack Animation: x> for custom animations.
 * 
 *   Emerge Text:
 *   - Show or hide the 'Enemy emerges!' text at the start of battle.
 * 
 *   Offset X:
 *   - Offsets X position where enemy is positioned.
 *   - Negative values go left. Positive values go right.
 * 
 *   Offset Y:
 *   - Offsets Y position where enemy is positioned.
 *   - Negative values go up. Positive values go down.
 * 
 *   Smooth Image:
 *   - Smooth out the battler images or pixelate them?
 *
 * ---
 *
 * Select Window
 * 
 *   FV: Right Priority:
 *   - If using frontview, auto select the enemy furthest right.
 * 
 *   SV: Right Priority:
 *   - If using sideview, auto select the enemy furthest right.
 * 
 *   Name: Font Size:
 *   - Font size used for enemy names.
 * 
 *   Name: Offset X:
 *   Name: Offset Y:
 *   - Offset the enemy name's position by this much.
 *
 * ---
 *
 * Sideview Battlers
 * 
 *   Allow Collapse:
 *   - Causes defeated enemies with SV Battler graphics to "fade away"
 *     when defeated?
 * 
 *   Anchor: X:
 *   - Default X anchor for Sideview Battlers.
 *   - Use values between 0 and 1 to be safe.
 * 
 *   Anchor: Y:
 *   - Default Y anchor for Sideview Battlers.
 *   - Use values between 0 and 1 to be safe.
 * 
 *   Motion: Idle:
 *   - Sets default idle animation used by Sideview Battlers.
 * 
 *   Shadow Visible:
 *   - Show or hide the shadow for Sideview Battlers.
 * 
 *   Size: Width:
 *   - Default width for enemies that use Sideview Battlers.
 * 
 *   Size: Height:
 *   - Default height for enemies that use Sideview Battlers.
 * 
 *   Weapon Type:
 *   - Sets default weapon type used by Sideview Battlers.
 *   - Use 0 for Bare Hands.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: HP Gauge Settings
 * ============================================================================
 *
 * Settings that adjust the visual HP Gauge displayed in battle.
 *
 * ---
 *
 * Show Gauges For
 * 
 *   Actors:
 *   - Show HP Gauges over the actor sprites' heads?
 *   - Requires SV Actors to be visible.
 * 
 *   Enemies:
 *   - Show HP Gauges over the enemy sprites' heads?
 *   - Can be bypassed with <Hide HP Gauge> notetag.
 * 
 *     Requires Defeat?:
 *     - Requires defeating the enemy once to show HP Gauge?
 *     - Can be bypassed with <Show HP Gauge> notetag.
 * 
 *       Battle Test Bypass?:
 *       - Bypass the defeat requirement in battle test?
 *
 * ---
 *
 * Settings
 * 
 *   Anchor X:
 *   Anchor Y:
 *   - Where do you want the HP Gauge sprite's anchor X/Y to be?
 *     Use values between 0 and 1 to be safe.
 * 
 *   Scale:
 *   - How large/small do you want the HP Gauge to be scaled?
 * 
 *   Offset X:
 *   Offset Y:
 *   - How many pixels to offset the HP Gauge's X/Y by?
 *
 * ---
 *
 * Options
 * 
 *   Add Option?:
 *   - Add the 'Show HP Gauge' option to the Options menu?
 * 
 *   Adjust Window Height:
 *   - Automatically adjust the options window height?
 * 
 *   Option Name:
 *   - Command name of the option.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Action Sequence Settings
 * ============================================================================
 *
 * Action Sequence Plugin Parameters allow you to decide if you want automatic
 * Action Sequences to be used for physical attacks, the default casting
 * animations used, how counters and reflects appear visually, and what the
 * default stepping distances are.
 *
 * ---
 *
 * Automatic Sequences
 * 
 *   Melee Single Target:
 *   - Allow this auto sequence for physical, single target actions?
 * 
 *   Melee Multi Target:
 *   - Allow this auto sequence for physical, multi-target actions?
 *
 * ---
 * 
 * Quality of Life
 * 
 *   Auto Notetag:
 *   - Automatically apply the <Custom Action Sequence> notetag effect to any
 *     item or skill that has a Common Event?
 *   - Any item or skill without a Common Event attached to it will use the
 *     Automatic Action Sequences instead.
 *   - The <Auto Action Sequence> notetag will disable this effect for that
 *     particular skill or item.
 * 
 * ---
 *
 * Cast Animations
 * 
 *   Certain Hit:
 *   - Cast animation for Certain Hit skills.
 * 
 *   Physical:
 *   - Cast animation for Physical skills.
 * 
 *   Magical:
 *   - Cast animation for Magical skills.
 *
 * ---
 *
 * Counter/Reflect
 * 
 *   Counter Back:
 *   - Play back the attack animation used?
 * 
 *   Reflect Animation:
 *   - Animation played when an action is reflected.
 * 
 *   Reflect Back:
 *   - Play back the attack animation used?
 *
 * ---
 *
 * Stepping
 * 
 *   Melee Distance:
 *   - Minimum distance in pixels for Movement Action Sequences.
 * 
 *   Step Distance X:
 *   - The normal X distance when stepping forward.
 * 
 *   Step Distance Y:
 *   - The normal Y distance when stepping forward.
 * 
 *   Step Duration:
 *   - The number of frames for a stepping action to complete.
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
 * Version 1.25: February, 2021
 * * Compatibility Update
 * ** Added compatibility update with VisuStella MZ Skills and States Core's
 *    Plugin Parameter > State Settings > Action End Update
 * * Feature Update!
 * ** <Common Event: name> notetag no longer requires <Custom Action Sequence>
 *    notetag if the Plugin Parameter: Auto Notetag is enabled.
 * 
 * Version 1.24: January 29, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * Feature Update!
 * ** MOVE: Move To Point and MOVE: Move To Target(s) Action Sequences'
 *    "Offset Adjustment" normal setting will now factor in Offset X and
 *    Offset Y positions unlike before where it cancels them. Update by Irina.
 * * New Features!
 * ** New notetag added by Arisu:
 * *** <Common Event: name>
 * **** Battle only: calls forth a Common Event of a matching name.
 * **** This is primarily used for users who are reorganizing around their
 *      Common Events and would still like to have their skills/items perform
 *      the correct Action Sequences in case the ID's are different.
 * 
 * Version 1.23: January 22, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * Feature Update!
 * ** ACSET: All Targets Action Set and ACSET: Each Target Action Set updated
 * *** New parameter added: Dual/Multi Wield?
 * **** Add times struck based on weapon quantity equipped?
 * * New Features!
 * ** Dual Wielding now functions differently. Made by Olivia.
 * *** Previously, RPG Maker MZ had "Dual Wielding" attack using both weapon
 *     animations at once, with the combined ATK of each weapon. It's confusing
 *     to look at and does not portray the nature of "Dual Wielding".
 * *** Dual Wielding, or in the case of users adding in third and fourth
 *     weapons, Multi Wielding is now changed. Each weapon is displayed
 *     individually, each producing its own attack animation, showing each
 *     weapon type, and applying only that weapon's ATK, Traits, and related
 *     effects. It is no longer a combined effect to display everything at once
 *     like RPG Maker MZ default.
 * *** If an actor has multiple weapon slots but some of them are unequipped,
 *     then the action will treat the attack as a single attack. There will be
 *     no barehanded attack to add on top of it. This is to match RPG Maker
 *     MZ's decision to omit a second animation if the same scenario is
 *     applied.
 * ** New Action Sequence Plugin Commands added by Yanfly
 * *** ANIM: Attack Animation 2+
 * **** Plays the animation associated with the user's 2nd weapon.
 *      Plays nothing if there is no 2nd weapon equipped.
 * ** New Action Sequence Plugin Commands added by Olivia
 * *** WEAPON: Clear Weapon Slot
 * *** WEAPON: Next Weapon Slot
 * *** WEAPON: Set Weapon Slot
 * **** These are Action Sequence Plugin Commands for devs who want finer
 *      control over Dual/Multi Wielding weapons.
 * 
 * Version 1.22: January 15, 2021
 * * Compatibility Update
 * ** Compatibility with "All Skills" Actor Command should now work with the
 *    Skills & States Core hide skill notetags.
 * 
 * Version 1.21: January 8, 2021
 * * Bug Fixes!
 * ** "MOVE: Home Reset" Plugin Command Action Sequence should work properly.
 *    Fix made by Yanfly.
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * New Features!
 * ** New Notetag snuck in by Arisu
 * *** <Auto Action Sequence>
 * **** Used for those who have the "Auto Notetag" Plugin Parameter enabled and
 *      just want to use an automatic Action Sequence instead.
 * ** New Plugin Parameter snuck in by Arisu!
 * *** Plugin Parameters > Action Sequences > Quality of Life > Auto Notetag
 * **** Automatically apply the <Custom Action Sequence> notetag effect to any
 *      item or skill that has a Common Event?
 * **** Any item or skill without a Common Event attached to it will use the
 *      Automatic Action Sequences instead.
 * **** The <Auto Action Sequence> notetag will disable this effect for that
 *      particular skill or item.
 * ** Arisu, you're going to be responsible for any bugs these may cause.
 * *** Bring it!!!!
 * **** And handling any bug report emails that are sent because this was
 *      turned on by accident.
 * ***** Please read the documentation, guys!
 * 
 * Version 1.20: January 1, 2021
 * * Bug Fixes!
 * ** For TPB Active or ATB Active, inputting actors that have received damage
 *    will return back to place after flinching. Fix made by Yanfly.
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * New Features!
 * ** New notetags added by Yanfly:
 * *** <Battle Portrait Offset: +x, +y>
 * *** <Battle Portrait Offset X: +x>
 * *** <Battle Portrait Offset Y: +y>
 * **** This is used with the "Portrait" and "Border" Battle Layouts.
 * **** Offsets the X and Y coordinates for the battle portrait.
 * 
 * Version 1.19: December 25, 2020
 * * Bug Fixes!
 * ** Removing a state from a Sideview Enemy during the middle of their a non-
 *    looping motion will no longer reset their motion to neutral.
 *    Fix made by Yanfly.
 * * Compatibility Update!
 * ** Plugins should be more compatible with one another.
 * * Documentation Update!
 * ** Added documentation for updated feature(s)!
 * * Feature Update!
 * ** Action Sequence "PROJECTILE: Icon" now supports code for the "Icon"
 *    parameter. Update made by Yanfly.
 * 
 * Version 1.18: December 18, 2020
 * * Bug Fixes!
 * ** For TPB Active or ATB Active, inputting actors will no longer step back
 *    after an enemy's action is finished. Fix made by Yanfly and Shiro.
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * New Features!
 * ** Action Sequence "BTLOG: Add Text" is updated for the convenience of a new
 *    option to quickly copy the displayed text to the VisuStella MZ Combat Log
 *    if that plugin is installed. Added by Yanfly.
 * 
 * Version 1.17: December 11, 2020
 * * Bug Fixes!
 * ** Common Events in TPB Active that cause forced actions will no longer
 *    cause currently inputting actors that match the forced action battler to
 *    crash the game. Fix made by Yanfly and Shiro.
 * * Compatibility Update!
 * ** Added compatibility functionality for future plugins.
 * ** Plugins should be more compatible with one another.
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * Feature Update!
 * ** Action Sequence Impact Action Sequences "Shockwave from Each Target(s)",
 *    "Shockwave from Target(s) Center", and "Zoom Blur at Target(s) Center"
 *    now have "Offset X" and "Offset Y" plugin parameters. Added by Yanfly.
 * ** Action Sequence "MOVE: Move To Target(s)" is now changed so that if the
 *    "Melee Distance" value is set to 0, battlers will no longer stand a half
 *    body distance away. Added by Yanfly.
 * 
 * Version 1.16: December 4, 2020
 * * Bug Fixes!
 * ** Bug fixes made for the RPG Maker MZ base code. If a battler has no
 *    actions, then their action speed will not be Infinity. Fix by Olivia.
 * * Compatibility Update!
 * ** Plugins should be more compatible with one another.
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.15: November 29, 2020
 * * Bug Fixes!
 * ** Completely replacing the whole party at once will no longer cause the
 *    battle system to crash. Fix made by Olivia.
 * ** Pre-Battle Common Events will no longer cancel out any win/lose branches.
 *    Fix made by Arisu.
 * * Feature Update!
 * ** Custom Action Sequences will no longer close the Actor Command Input
 *    window unless absolutely necessary (like for Show Message events) during
 *    Active TPB/ATB. Change made by Arisu.
 * 
 * Version 1.14: November 22, 2020
 * * Feature Update!
 * ** Natural Miss and Evasion motions now have flinch distance.
 *    Added by Yanfly.
 * 
 * Version 1.13: November 15, 2020
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.12: November 8, 2020
 * * Bug Fixes!
 * ** Failsafes added to prevent common events from running if they're empty.
 *    Fix made by Irina.
 * ** Skip Party Command will now work properly with TPB-based battle systems.
 *    Fix made by Yanfly.
 * * Compatibility Update!
 * ** Plugins should be more compatible with one another.
 * * Documentation Update!
 * ** In preparation for upcoming VisuStella MZ plugins.
 * 
 * Version 1.11: November 1, 2020
 * * Compatibility Update!
 * ** Plugins should be more compatible with one another.
 * * Documentation Update!
 * ** Added clarity for the Plugin Parameters for the Common Events settings
 *    found in the mechanics section. The common events are only meant to run
 *    in the map scene and not for the battle scene. Update made by Irina.
 * * Feature Update!
 * ** The Plugin Parameter for Mechanics, Common Events (on Map), Defeat Event
 *    now has updated functionality. If this has a common event attached to it,
 *    then losing to random encounters will no longer send the player to the
 *    Game Over scene, but instead, send the player back to the map scene,
 *    where the Defeat Common Event will run. Update made by Irina.
 * 
 * Version 1.10: October 25, 2020
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * New Features!
 * ** New Action Sequence Plugin Command added by Olivia:
 * *** MECH: Custom Damage Formula
 * **** Changes the current action's damage formula to custom.
 *      This will assume the MANUAL damage style.
 * ** New Notetag added by Irina:
 * ** New Plugin Parameters added by Irina:
 * *** Plugin Parameters > Battleback Scaling Settings
 * **** These settings allow you to adjust how battlebacks scale to the screen
 *      in the game.
 * *** <Battler Sprite Grounded>
 * **** Prevents the enemy from being able to jumping and/or floating due to
 *      Action Sequences but still able to move. Useful for rooted enemies.
 * 
 * Version 1.09: October 18, 2020
 * * Bug Fixes!
 * ** Exiting out of the Options menu scene or Party menu scene will no longer
 *    cause party members to reset their starting position. Fix made by Arisu
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * ** There was a documentation error with <JS Pre-Regenerate> and
 *    <JS Post-Regenerate>. Fix made by Yanfly.
 * *** Before, these were written as <JS Pre-Regenerate Turn> and
 *     <JS Post-Regenerate Turn>. The "Turn" part of the notetag has been
 *     removed in the documentation.
 * * Feature Update!
 * ** Damage sprites on actors are now centered relative to the actor's anchor.
 *    Change made by Yanfly.
 * * New Features!
 * ** New Action Sequence Plugin Command added by Yanfly:
 * *** MECH: Variable Popup
 * **** Causes the unit(s) to display a popup using the data stored inside
 *      a variable.
 * 
 * Version 1.08: October 11, 2020
 * * Bug Fixes!
 * ** Dead party members at the start of battle no longer start offscreen.
 *    Fix made by Arisu.
 * ** Removed party members from battle no longer count as moving battlers.
 *    Fix made by Yanfly.
 * ** Using specific motions should now have the weapons showing and not
 *    showing properly. Fix made by Yanfly.
 * 
 * Version 1.07: October 4, 2020
 * * Bug Fixes!
 * ** Adding and removing actors will now refresh the battle status display.
 *    Fix made by Irina.
 * ** Adding new states that would change the affected battler's state motion
 *    will automatically refresh the battler's motion. Fix made by Irina.
 * ** Boss Collapse animation fixed and will sink into the ground.
 *    Fix made by Irina.
 * ** Failsafes added for certain animation types. Fix made by Yanfly.
 * ** Freeze Motion for thrust, swing, and missile animations will now show the
 *    weapons properly. Fix made by Yanfly.
 * ** The Guard command will no longer display the costs of the Attack command.
 *    Fix made by Irina.
 * * Documentation Update!
 * ** Updated help file for newly added plugin parameters.
 * * Feature Updates!
 * ** When using the Change Battleback event command in battle, the game client
 *    will wait until both battlebacks are loaded before changing the both of
 *    them so that the appearance is synched together. Change made by Yanfly.
 * * New Features!
 * ** New plugin parameters added by Irina!
 * *** Plugin Parameters > Actor Battler Settings > Chant Style
 * **** What determines the chant motion? Hit type or skill type?
 * 
 * Version 1.06: September 27, 2020
 * * Bug Fixes!
 * ** Enemy Battler Plugin Parameter "Shadow Visible" should now work again.
 *    Fix made by Irina.
 * * Compatibility Update!
 * ** Added compatibility functionality for future plugins. Added by Yanfly.
 * * Documentation Update!
 * ** Updated the help file for all the new plugin parameters.
 * * Feature Update!
 * ** Action Sequence "MECH: HP, MP, TP" will now automatically collapse an
 *    enemy if it has been killed by the effect.
 * ** All battle systems for front view will now have damage popups appear
 *    in front of the status window instead of just the Portrait battle layout.
 *    Update made by Yanfly.
 * * New Features!
 * ** New Action Sequence Plugin Commands from Irina!
 * *** MOTION: Clear Freeze Frame
 * *** MOTION: Freeze Motion Frame
 * **** You can freeze a battler's sprite's motion with a specific frame.
 * ** New notetags for Maps and name tags for Troops added by Yanfly!
 * *** <Battle Layout: type> to change the battle layout style used for
 *     specific maps and/or troops.
 * ** New plugin parameters added by Yanfly!
 * *** Plugin Parameters > Battle Layout Settings > Command Window Width
 * **** This plugin parameter lets you adjust the window width for Party and
 *      Actor Command windows in the Default and List Battle Layout styles.
 * *** Plugin Parameters > Enemy Battler Settings > Name: Offset X
 * *** Plugin Parameters > Enemy Battler Settings > Name: Offset Y
 * **** These plugin parameters allow you to offset the position of the enemy
 *      name positions on the screen by a specific amount.
 * 
 * Version 1.05: September 20, 2020
 * * Bug Fixes!
 * ** Actors now use their casting or charging animations again during TPB/ATB.
 *    Fix made by Yanfly.
 * ** Defeat requirement for enemies will no longer crash the game if turned on
 *    after creating
 * ** Escaping animation no longer has actors stay in place. Fixed by Yanfly.
 * ** Failsafes added for newly added weapon types that have not been adjusted
 *    in the Database > System 2 tab. Fixed by Irina.
 * ** Shadows now appear under the actor sprites. Fix made by Yanfly.
 * ** Victory during TPB will no longer cancel the victory animations of
 *    actors that will have their turn after. Fixed by Yanfly.
 * * Documentation Update!
 * ** All Anchor Plugin Parameter descriptions now state to use values between
 *    0 and 1 to be safe. Update made by Yanfly.
 * * Feature Update!
 * ** During Active TPB / ATB, canceling out of the actor command window will
 *    go directly into the party window without having to sort through all of
 *    the available active actors.
 * ** Going from the Party Command Window's Fight command will immediately
 *    return back to the actor command window that was canceled from.
 * * New Features!
 * ** Action Sequence Plugin Command "MOVE: Spin/Rotate" has been updated.
 * *** A new parameter has been added: "Revert Angle on Finish"
 * *** Added by Yanfly.
 * ** New plugin parameters have been added to Damage Settings.
 * *** Appear Position: Selects where you want popups to appear relative to the
 *     battler. Head, Center, Base. Added by Yanfly.
 * *** Offset X: Sets how much to offset the sprites by vertically.
 *     Added by Yanfly.
 * *** Offset Y: Sets how much to offset the sprites by horizontally.
 *     Added by Yanfly.
 * ** New plugin parameters have been added to Actor Battler Settings.
 * *** Priority: Active - Place the active actor on top of actor and
 *     enemy sprites. Added by Yanfly.
 * *** Priority: Actors - Prioritize actors over enemies when placing 
 *     sprites on top of each other. Added by Yanfly.
 * 
 * Version 1.04: September 13, 2020
 * * Bug Fixes!
 * ** Active Battler Sprites now remain on top and won't be hidden behind
 *    other sprites for better visual clarity. Fix made by Arisu.
 * ** Collapsing battlers will now show the dead motion properly. Fix made by
 *    Olivia.
 * ** Dead battlers can no longer be given immortality. Fix made by Olivia.
 * ** Going into the Options menu with no battleback set will no longer set a
 *    battle snapshot.
 * ** HP Gauges for Sideview Enemies are no longer flipped! Fix made by Yanfly.
 * ** Moving a dead battler would no longer reset their animation. Fix made by
 *    Olivia.
 * ** Pre-Battle Common Events now work with events instead of just random
 *    encounters. Fix made by Yanfly.
 * ** Sideview Enemy shadows no longer twitch. Fix made by Irina.
 * * Documentation Updates!
 * ** Added further explanations for Anchor X and Anchor Y plugin parameters.
 *    This is because there's a lot of confusion for users who aren't familiar
 *    with how sprites work. Added by Irina.
 * ** <Magic Reduction: x> notetag updated to say magical damage instead of
 *    physical damage. Fix made by Yanfly.
 * * New Features!
 * ** Additional Action Sequence Plugin Commands have been added in preparation
 *    of upcoming plugins! Additions made by Irina.
 * *** Action Sequences - Angle (for VisuMZ_3_ActSeqCamera)
 * *** Action Sequences - Camera (for VisuMZ_3_ActSeqCamera)
 * *** Action Sequences - Skew (for VisuMZ_3_ActSeqCamera)
 * *** Action Sequences - Zoom (for VisuMZ_3_ActSeqCamera)
 * ** Additional Action Sequence Plugin Commands have been made available now
 *    and added to Battle Core! Additions made by Irina.
 * *** MOVE: Scale/Grow/Shrink
 * *** MOVE: Skew/Distort
 * *** MOVE: Spin/Rotate
 * *** MOVE: Wait For Scale
 * *** MOVE: Wait For Skew
 * *** MOVE: Wait For Spin
 * ** Plugin Parameters Additions. Additions made by Irina.
 * *** Plugin Params > Actor Battler Settings > Offset X
 * *** Plugin Params > Actor Battler Settings > Offset Y
 * *** Plugin Params > Actor Battler Settings > Smooth Image
 * *** Plugin Params > Enemy Battler Settings > Offset X
 * *** Plugin Params > Enemy Battler Settings > Offset Y
 * *** Plugin Params > Enemy Battler Settings > Smooth Image
 * 
 * Version 1.03: September 6, 2020
 * * Bug Fixes!
 * ** Animated Battlers will refresh their motions from the death motion once
 *    they're revived instead of waiting for their next input phase. Fix made
 *    by Yanfly.
 * ** Battle Log speed sometimes went by too fast for certain enabled messages.
 *    Wait timers are now added to them, like state results, buff results, and
 *    debuff results. Fix made by Yanfly.
 * ** Boss Collapse animation now works properly. Fix made by Yanfly.
 * ** Freeze fix for TPB (Wait) if multiple actors get a turn at the same time.
 *    Fix made by Olivia.
 * ** Pressing cancel on a target window after selecting a single skill no
 *    longer causes the status window to twitch.
 * ** Sideview Enemies had a split frame of being visible if they were to start
 *    off hidden in battle. Fix made by Shaz.
 * * Compatibility Update:
 * ** Battle Core's Sprite_Damage.setup() function is now separated fro the
 *    default to allow for better compatibility. Made by Yanfly.
 * * Documentation Update:
 * ** Inserted more information for "Damage Popups" under "Major Changes"
 * * New Features!
 * ** <Magic Penetration: x>, <Magic Penetration: x%> notetags added.
 * ** <Magic Reduction: x>, <Magic Reduction: x%> notetags added.
 * ** <Battle UI Offset: +x, +y>, <Battle UI Offset X: +x>, and
 *    <Battle UI Offset Y: +y> notetags added for adjusting the positions of
 *    HP Gauges and State Icons.
 * *** Notetags added by Yanfly.
 * 
 * Version 1.02: August 30, 2020
 * * Bug Fixes!
 * ** Failsafes added for parsing battle targets. Fix made by Yanfly.
 * ** Immortality is no longer ignored by skills/items with the Normal Attack
 *    state effect. Fix made by Yanfly.
 * ** Miss and Evasion sound effects work again! Fix made by Yanfly.
 * ** Selecting "Escape" from the Actor Command Window will now have the
 *    Inputting Battler show its escape motion. Fix made by Yanfly.
 * ** Wait for Movement now applies to SV Enemies. Fix made by Yanfly.
 * * New Features!
 * ** Plugin Command "ACSET: Finish Action" now has an option to turn off the
 *    Immortality of targets. Feature added by Yanfly.
 * * Optimization Update
 * ** Uses less resources when making checks for Pre-Battle Battle Start events
 * 
 * Version 1.01: August 23, 2020
 * * Bug Fixes!
 * ** Plugin Parameters > Damage Settings > Damage Formats are now fixed.
 *    Fix made by Olivia.
 * ** TPB Battle System with Disable Party Command fixed. Fix made by Olivia.
 * ** States now show in list format if faces are disabled. Fix made by Yanfly.
 * ** The default damage styles were missing the 'v' variable to allow for
 *    variable data input. These are back now. Fix made by Yanfly.
 * *** Users updating from version 1.00 will need to fix this problem by either
 *     removing the plugin from the Plugin Manager list and reinstalling it, or
 *     going to Plugin Parameters > Damage Settings > Style List > the style
 *     you want, and adding "const v = $gameVariables._data;" to JS: Formula
 * * New Notetags Added:
 * ** <Command Show Switch: x> added by Olivia
 * ** <Command Show All Switches: x,x,x> added by Olivia
 * ** <Command Show Any Switches: x,x,x> added by Olivia
 * ** <Command Hide Switch: x> added by Olivia
 * ** <Command Hide All Switches: x,x,x> added by Olivia
 * ** <Command Hide Any Switches: x,x,x> added by Olivia
 * ** <JS Command Visible> added by Olivia
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
 * @command ActionSequenceSpaceStart
 * @text -
 * @desc The following are Action Sequences commands/sets.
 * These Plugin Commands only work in battle.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceBreakSet
 * @text Action Sequence - Action Sets
 * @desc Action Sequence Action Sets are groups of commonly used
 * Action Sequence Commands put together for more efficient usage.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Set_SetupAction
 * @text ACSET: Setup Action Set
 * @desc The generic start to most actions.
 * 
 * @arg DisplayAction:eval
 * @text Display Action
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use this part of the action sequence?
 * @default true
 * 
 * @arg ApplyImmortal:eval
 * @text Immortal: On
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use this part of the action sequence?
 * @default true
 * 
 * @arg ActionStart:eval
 * @text Battle Step
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use this part of the action sequence?
 * @default true
 * 
 * @arg WaitForMovement:eval
 * @text Wait For Movement
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use this part of the action sequence?
 * @default true
 * 
 * @arg CastAnimation:eval
 * @text Cast Animation
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use this part of the action sequence?
 * @default true
 * 
 * @arg WaitForAnimation:eval
 * @text Wait For Animation
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use this part of the action sequence?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Set_WholeActionSet
 * @text ACSET: All Targets Action Set
 * @desc Affects all targets simultaneously performing the following.
 * 
 * @arg DualWield:eval
 * @text Dual/Multi Wield?
 * @type boolean
 * @on Apply
 * @off Don't
 * @desc Add times struck based on weapon quantity equipped?
 * @default false
 * 
 * @arg PerformAction:eval
 * @text Perform Action
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use this part of the action sequence?
 * @default true
 * 
 * @arg WaitCount:eval
 * @text Wait Count
 * @desc How many frames should the action sequence wait?
 * You may use JavaScript code.
 * @default Sprite_Battler._motionSpeed
 * 
 * @arg ActionAnimation:eval
 * @text Action Animation
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use this part of the action sequence?
 * @default true
 * 
 * @arg WaitForAnimation:eval
 * @text Wait For Animation
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use this part of the action sequence?
 * @default true
 * 
 * @arg ActionEffect:eval
 * @text Action Effect
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use this part of the action sequence?
 * @default true
 * 
 * @arg ApplyImmortal:eval
 * @text Immortal: Off
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use this part of the action sequence?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Set_TargetActionSet
 * @text ACSET: Each Target Action Set
 * @desc Goes through each target one by one to perform the following.
 * 
 * @arg DualWield:eval
 * @text Dual/Multi Wield?
 * @type boolean
 * @on Apply
 * @off Don't
 * @desc Add times struck based on weapon quantity equipped?
 * @default false
 * 
 * @arg PerformAction:eval
 * @text Perform Action
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use this part of the action sequence?
 * @default true
 * 
 * @arg WaitCount1:eval
 * @text Wait Count
 * @desc How many frames should the action sequence wait?
 * You may use JavaScript code.
 * @default Sprite_Battler._motionSpeed
 * 
 * @arg ActionAnimation:eval
 * @text Action Animation
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use this part of the action sequence?
 * @default true
 * 
 * @arg WaitCount2:eval
 * @text Wait Count
 * @desc How many frames should the action sequence wait?
 * You may use JavaScript code.
 * @default Sprite_Battler._motionSpeed * 2
 * 
 * @arg ActionEffect:eval
 * @text Action Effect
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use this part of the action sequence?
 * @default true
 * 
 * @arg ApplyImmortal:eval
 * @text Immortal: Off
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use this part of the action sequence?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Set_FinishAction
 * @text ACSET: Finish Action
 * @desc The generic ending to most actions.
 * 
 * @arg ApplyImmortal:eval
 * @text Immortal: Off
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use this part of the action sequence?
 * @default true
 * 
 * @arg WaitForNewLine:eval
 * @text Wait For New Line
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use this part of the action sequence?
 * @default true
 * 
 * @arg WaitForEffect:eval
 * @text Wait For Effects
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use this part of the action sequence?
 * @default true
 * 
 * @arg ClearBattleLog:eval
 * @text Clear Battle Log
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use this part of the action sequence?
 * @default true
 * 
 * @arg ActionEnd:eval
 * @text Home Reset
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use this part of the action sequence?
 * @default true
 * 
 * @arg WaitForMovement:eval
 * @text Wait For Movement
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use this part of the action sequence?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceSpaceAngle
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceBreakAngle
 * @text Action Sequences - Angle
 * @desc Allows you to have control over the camera angle.
 * Requires VisuMZ_3_ActSeqCamera!
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_ChangeAngle
 * @text ANGLE: Change Angle
 * @desc Changes the camera angle.
 * Requires VisuMZ_3_ActSeqCamera!
 * 
 * @arg Angle:eval
 * @text Angle
 * @desc Change the camera angle to this many degrees.
 * @default 0
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames to change camera angle.
 * @default 60
 *
 * @arg EasingType:str
 * @text Angle Easing
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
 * Requires VisuMZ_0_CoreEngine.
 * @default InOutSine
 * 
 * @arg WaitForAngle:eval
 * @text Wait For Angle?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for angle changes to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Angle_Reset
 * @text ANGLE: Reset Angle
 * @desc Reset any angle settings.
 * Requires VisuMZ_3_ActSeqCamera!
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames to reset camera angle.
 * @default 60
 *
 * @arg EasingType:str
 * @text Angle Easing
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
 * Requires VisuMZ_0_CoreEngine.
 * @default InOutSine
 * 
 * @arg WaitForAngle:eval
 * @text Wait For Angle?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for angle changes to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Angle_WaitForAngle
 * @text ANGLE: Wait For Angle
 * @desc Waits for angle changes to complete before performing next command.
 * Requires VisuMZ_3_ActSeqCamera!
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceSpaceAnimation
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceBreakAnimation
 * @text Action Sequences - Animations
 * @desc These Action Sequences are related to the 'Animations' that
 * can be found in the Animations tab of the Database.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Animation_ActionAnimation
 * @text ANIM: Action Animation
 * @desc Plays the animation associated with the action.
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to play the animation on.
 * @default ["all targets"]
 * 
 * @arg Mirror:eval
 * @text Mirror Animation
 * @type boolean
 * @on Mirror
 * @off Normal
 * @desc Mirror the animation?
 * @default false
 * 
 * @arg WaitForAnimation:eval
 * @text Wait For Animation?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for animation to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Animation_AttackAnimation
 * @text ANIM: Attack Animation
 * @desc Plays the animation associated with the user's 1st weapon.
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to play the animation on.
 * @default ["all targets"]
 * 
 * @arg Mirror:eval
 * @text Mirror Animation
 * @type boolean
 * @on Mirror
 * @off Normal
 * @desc Mirror the animation?
 * @default false
 * 
 * @arg WaitForAnimation:eval
 * @text Wait For Animation?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for animation to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Animation_AttackAnimation2
 * @text ANIM: Attack Animation 2+
 * @desc Plays the animation associated with the user's other weapons.
 * Plays nothing if there is no other weapon equipped.
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to play the animation on.
 * @default ["all targets"]
 * 
 * @arg Slot:eval
 * @text Slot
 * @desc Which weapon slot to get this data from?
 * Main-hand weapon is weapon slot 1.
 * @default 2
 * 
 * @arg Mirror:eval
 * @text Mirror Animation
 * @type boolean
 * @on Mirror
 * @off Normal
 * @desc Mirror the animation?
 * @default true
 * 
 * @arg WaitForAnimation:eval
 * @text Wait For Animation?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for animation to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Animation_CastAnimation
 * @text ANIM: Cast Animation
 * @desc Plays the cast animation associated with the action.
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to play the animation on.
 * @default ["user"]
 * 
 * @arg Mirror:eval
 * @text Mirror Animation
 * @type boolean
 * @on Mirror
 * @off Normal
 * @desc Mirror the animation?
 * @default false
 * 
 * @arg WaitForAnimation:eval
 * @text Wait For Animation?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for animation to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Animation_ChangeBattlePortrait
 * @text ANIM: Change Battle Portrait
 * @desc Changes the battle portrait of the actor (if it's an actor).
 * Can be used outside of battle/action sequences.
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to change the portraits for.
 * Valid units can only be actors.
 * @default ["user"]
 * 
 * @arg Filename:str
 * @text Filename
 * @type file
 * @dir img/pictures/
 * @desc Select the file to change the actor's portrait to.
 * @default Untitled
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Animation_ShowAnimation
 * @text ANIM: Show Animation
 * @desc Plays the a specific animation on unit(s).
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to play the animation on.
 * @default ["all targets"]
 * 
 * @arg AnimationID:num
 * @text Animation ID
 * @type animation
 * @desc Select which animation to play on unit(s).
 * @default 1
 * 
 * @arg Mirror:eval
 * @text Mirror Animation
 * @type boolean
 * @on Mirror
 * @off Normal
 * @desc Mirror the animation?
 * @default false
 * 
 * @arg WaitForAnimation:eval
 * @text Wait For Animation?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for animation to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Animation_WaitForAnimation
 * @text ANIM: Wait For Animation
 * @desc Causes the interpreter to wait for any animation(s) to finish.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceSpaceBattleLog
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceBreakBattleLog
 * @text Action Sequences - Battle Log
 * @desc These Action Sequences are related to the Battle Log Window,
 * the window found at the top of the battle screen.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_BattleLog_AddText
 * @text BTLOG: Add Text
 * @desc Adds a new line of text into the Battle Log.
 * 
 * @arg Text:str
 * @text Text
 * @desc Add this text into the Battle Log.
 * Text codes allowed.
 * @default Insert text here.
 * 
 * @arg CopyCombatLog:eval
 * @text Copy to Combat Log?
 * @type boolean
 * @on Copy Text
 * @off Don't Copy
 * @desc Copies text to the Combat Log.
 * Requires VisuMZ_4_CombatLog
 * @default true
 *
 * @arg CombatLogIcon:num
 * @text Combat Log Icon
 * @parent CopyCombatLog:eval
 * @desc What icon would you like to bind to this entry?
 * Requires VisuMZ_4_CombatLog
 * @default 87
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_BattleLog_Clear
 * @text BTLOG: Clear Battle Log
 * @desc Clears all the text in the Battle Log.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_BattleLog_DisplayAction
 * @text BTLOG: Display Action
 * @desc Displays the current action in the Battle Log.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_BattleLog_PopBaseLine
 * @text BTLOG: Pop Base Line
 * @desc Removes the Battle Log's last added base line and 
 * all text up to its former location.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_BattleLog_PushBaseLine
 * @text BTLOG: Push Base Line
 * @desc Adds a new base line to where the Battle Log currently is at.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_BattleLog_Refresh
 * @text BTLOG: Refresh Battle Log
 * @desc Refreshes the Battle Log.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_BattleLog_UI
 * @text BTLOG: UI Show/Hide
 * @desc Shows or hides the Battle UI (including the Battle Log).
 * 
 * @arg ShowHide:eval
 * @text Show/Hide?
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Shows/hides the Battle UI.
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_BattleLog_WaitForBattleLog
 * @text BTLOG: Wait For Battle Log
 * @desc Causes the interpreter to wait for the Battle Log to finish.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_BattleLog_WaitForNewLine
 * @text BTLOG: Wait For New Line
 * @desc Causes the interpreter to wait for a new line in the Battle Log.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceSpaceCamera
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceBreakCamera
 * @text Action Sequences - Camera
 * @desc Allows you to have control over the camera.
 * Requires VisuMZ_3_ActSeqCamera!
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Camera_Clamp
 * @text CAMERA: Clamp ON/OFF
 * @desc Turns battle camera clamping on/off.
 * Requires VisuMZ_3_ActSeqCamera!
 * 
 * @arg Setting:eval
 * @text ON/OFF
 * @type boolean
 * @on ON
 * @off OFF
 * @desc Turns camera clamping on/off.
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Camera_FocusPoint
 * @text CAMERA: Focus Point
 * @desc Focus the battle camera on a certain point in the screen.
 * Requires VisuMZ_3_ActSeqCamera!
 * 
 * @arg FocusX:eval
 * @text X Coordinate
 * @desc Insert the point to focus the camera on.
 * You may use JavaScript code.
 * @default Graphics.width / 2
 * 
 * @arg FocusY:eval
 * @text Y Coordinate
 * @desc Insert the point to focus the camera on.
 * You may use JavaScript code.
 * @default Graphics.height / 2
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for camera focus change.
 * @default 60
 *
 * @arg EasingType:str
 * @text Camera Easing
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
 * Requires VisuMZ_0_CoreEngine.
 * @default InOutSine
 * 
 * @arg WaitForCamera:eval
 * @text Wait For Camera?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for camera changes to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Camera_FocusTarget
 * @text CAMERA: Focus Target(s)
 * @desc Focus the battle camera on certain battler target(s).
 * Requires VisuMZ_3_ActSeqCamera!
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to focus the battle camera on.
 * @default ["user"]
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for camera focus change.
 * @default 60
 *
 * @arg EasingType:str
 * @text Camera Easing
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
 * Requires VisuMZ_0_CoreEngine.
 * @default InOutSine
 * 
 * @arg WaitForCamera:eval
 * @text Wait For Camera?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for camera changes to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Camera_Offset
 * @text CAMERA: Offset
 * @desc Offset the battle camera from the focus target.
 * Requires VisuMZ_3_ActSeqCamera!
 * 
 * @arg OffsetX:eval
 * @text Offset X
 * @desc How much to offset the camera X by.
 * Negative: left. Positive: right.
 * @default +0
 * 
 * @arg OffsetY:eval
 * @text Offset Y
 * @desc How much to offset the camera Y by.
 * Negative: up. Positive: down.
 * @default +0
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for offset change.
 * @default 60
 *
 * @arg EasingType:str
 * @text Camera Easing
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
 * Requires VisuMZ_0_CoreEngine.
 * @default InOutSine
 * 
 * @arg WaitForCamera:eval
 * @text Wait For Camera?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for camera changes to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Camera_Reset
 * @text CAMERA: Reset
 * @desc Reset the battle camera settings.
 * Requires VisuMZ_3_ActSeqCamera!
 * 
 * @arg ResetFocus:eval
 * @text Reset Focus?
 * @type boolean
 * @on On
 * @off Off
 * @desc Reset the focus point?
 * @default true
 * 
 * @arg ResetOffset:eval
 * @text Reset Offset?
 * @type boolean
 * @on On
 * @off Off
 * @desc Reset the camera offset?
 * @default true
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for reset change.
 * @default 60
 *
 * @arg EasingType:str
 * @text Camera Easing
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
 * Requires VisuMZ_0_CoreEngine.
 * @default InOutSine
 * 
 * @arg WaitForCamera:eval
 * @text Wait For Camera?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for camera changes to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Camera_WaitForCamera
 * @text CAMERA: Wait For Camera
 * @desc Waits for camera to complete before performing next command.
 * Requires VisuMZ_3_ActSeqCamera!
 *
 * @ --------------------------------------------------------------------------
 *
 *
 * @command ActionSequenceSpaceDragonbones
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceBreaDragonbones
 * @text Action Sequences - Dragonbones
 * @desc These Action Sequences are Dragonbones-related.
 * Requires VisuMZ_2_DragonbonesUnion!
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_DB_DragonbonesMotionAni
 * @text DB: Dragonbones Animation
 * @desc Causes the unit(s) to play a Dragonbones motion animation.
 * Requires VisuMZ_2_DragonbonesUnion!
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select which unit(s) to perform a motion animation.
 * @default ["user"]
 *
 * @arg MotionAni:str
 * @text Motion Animation
 * @desc What is the name of the Dragonbones motion animation you wish to play?
 * @default attack
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_DB_DragonbonesTimeScale
 * @text DB: Dragonbones Time Scale
 * @desc Causes the unit(s) to change their Dragonbones time scale.
 * Requires VisuMZ_2_DragonbonesUnion!
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select which unit(s) to perform a motion animation.
 * @default ["user"]
 *
 * @arg TimeScale:num
 * @text Time Scale
 * @desc Change the value of the Dragonbones time scale to this.
 * @default 1.0
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceSpaceElements
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceBreakElements
 * @text Action Sequences - Elements
 * @desc These Action Sequences are related to elements.
 * Requires VisuMZ_1_ElementStatusCore!
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Element_AddElements
 * @text ELE: Add Elements
 * @desc Adds element(s) to be used when calculating damage.
 * Requires VisuMZ_1_ElementStatusCore!
 *
 * @arg Elements:arraynum
 * @text Elements
 * @type number[]
 * @min 1
 * @max 99
 * @desc Select which element ID to add onto the action.
 * Insert multiple element ID's to add multiple at once.
 * @default ["1"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Element_Clear
 * @text ELE: Clear Element Changes
 * @desc Clears all element changes made through Action Sequences.
 * Requires VisuMZ_1_ElementStatusCore!
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Element_ForceElements
 * @text ELE: Force Elements
 * @desc Forces only specific element(s) when calculating damage.
 * Requires VisuMZ_1_ElementStatusCore!
 *
 * @arg Elements:arraynum
 * @text Elements
 * @type number[]
 * @min 1
 * @max 99
 * @desc Select which element ID to force in the action.
 * Insert multiple element ID's to force multiple at once.
 * @default ["1"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Element_NullElements
 * @text ELE: Null Element
 * @desc Forces no element to be used when calculating damage.
 * Requires VisuMZ_1_ElementStatusCore!
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceSpaceHorror
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceBreakHorror
 * @text Action Sequences - Horror Effects
 * @desc These Action Sequences are Horror Effects-related.
 * Requires VisuMZ_2_HorrorEffects!
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Horror_Clear
 * @text HORROR: Clear All Filters
 * @desc Clear all Horror Effects filters on the target battler(s).
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to remove Horror Effects for.
 * @default ["user"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Horror_GlitchCreate
 * @text HORROR: Glitch Create
 * @desc Creates the glitch effect on the target battler(s).
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to create the Horror Effect for.
 * @default ["user"]
 *
 * @arg slices:num
 * @text Glitch Slices
 * @parent FilterGlitch
 * @type number
 * @min 1
 * @desc Glitch slices to be used with the target.
 * @default 10
 *
 * @arg offset:num
 * @text Glitch Offset
 * @parent FilterGlitch
 * @type number
 * @min 1
 * @desc Default offset value.
 * @default 100
 *
 * @arg animated:eval
 * @text Glitch Animated?
 * @parent FilterGlitch
 * @type boolean
 * @on Animate
 * @off Static
 * @desc Animate the glitch effect?
 * @default true
 *
 * @arg aniFrequency:num
 * @text Glitch Frequency
 * @parent FilterGlitch
 * @type number
 * @min 1
 * @desc If animated, how frequent to make the glitch effect?
 * Lower = often     Higher = rarer
 * @default 300
 *
 * @arg aniStrength:num
 * @text Glitch Strength
 * @parent FilterGlitch
 * @type number
 * @min 1
 * @desc If animated, how strong is the glitch effect?
 * Lower = weaker     Higher = stronger
 * @default 30
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Horror_GlitchRemove
 * @text HORROR: Glitch Remove
 * @desc Removes the glitch effect on the target battler(s).
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to remove the Horror Effect for.
 * @default ["user"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Horror_NoiseCreate
 * @text HORROR: Noise Create
 * @desc Creates the noise effect on the target battler(s).
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to create the Horror Effect for.
 * @default ["user"]
 *
 * @arg noise:num
 * @text Noise Rate
 * @parent FilterNoise
 * @desc Noise rate to be used with the target.
 * @default 0.3
 *
 * @arg animated:eval
 * @text Noise Animated
 * @parent FilterNoise
 * @type boolean
 * @on Animate
 * @off Static
 * @desc Animate the noise for the target?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Horror_NoiseRemove
 * @text HORROR: Noise Remove
 * @desc Removes the noise effect on the target battler(s).
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to remove the Horror Effect for.
 * @default ["user"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Horror_TVCreate
 * @text HORROR: TV Create
 * @desc Creates the TV effect on the target battler(s).
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to create the Horror Effect for.
 * @default ["user"]
 *
 * @arg lineWidth:num
 * @text TV Line Thickness
 * @parent FilterTV
 * @type number
 * @min 1
 * @desc Default TV line thickness
 * Lower = thinner     Higher = thicker
 * @default 5
 *
 * @arg vignetting:num
 * @text TV Corner Size
 * @parent FilterTV
 * @desc Default TV line corner size
 * Lower = smaller     Higher = bigger
 * @default 0.3
 *
 * @arg animated:eval
 * @text TV Animated
 * @parent FilterTV
 * @type boolean
 * @on Animate
 * @off Static
 * @desc Animate the TV?
 * @default true
 *
 * @arg aniSpeed:num
 * @text TV Speed
 * @parent FilterTV
 * @desc Speed used to animate the TV if animated
 * Lower = slower     Higher = faster
 * @default 0.25
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Horror_TVRemove
 * @text HORROR: TV Remove
 * @desc Removes the TV effect on the target battler(s).
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to remove the Horror Effect for.
 * @default ["user"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceSpaceImpact
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceBreakImpact
 * @text Action Sequences - Impact
 * @desc These Action Sequences are related to creating impact.
 * Requires VisuMZ_3_ActSeqImpact!
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Impact_ColorBreak
 * @text IMPACT: Color Break
 * @desc Breaks the colors on the screen before reassembling.
 * Requires VisuMZ_3_ActSeqImpact!
 * 
 * @arg Intensity:eval
 * @text Intensity
 * @desc What is the intensity of the color break effect?
 * @default 60
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc What is the duration of the color break effect?
 * @default 60
 *
 * @arg EasingType:str
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
 * @default OutBack
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Impact_MotionBlurScreen
 * @text IMPACT: Motion Blur Screen
 * @desc Creates a motion blur on the whole screen.
 * Requires VisuMZ_3_ActSeqImpact!
 *
 * @arg Angle:eval
 * @text Angle
 * @desc Determine what angle to make the motion blur at.
 * @default Math.randomInt(360)
 *
 * @arg Rate:eval
 * @text Intensity Rate
 * @desc This determines intensity rate of the motion blur.
 * Use a number between 0 and 1.
 * @default 0.1
 *
 * @arg Duration:num
 * @text Duration
 * @type Number
 * @min 1
 * @desc How many frames should the motion blur last?
 * What do you want to be its duration?
 * @default 30
 *
 * @arg EasingType:str
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
 * @default InOutSine
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Impact_MotionBlurTarget
 * @text IMPACT: Motion Blur Target(s)
 * @desc Creates a motion blur on selected target(s).
 * Requires VisuMZ_3_ActSeqImpact!
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to create motion blur effects for.
 * @default ["user"]
 *
 * @arg Angle:eval
 * @text Angle
 * @desc Determine what angle to make the motion blur at.
 * @default Math.randomInt(360)
 *
 * @arg Rate:eval
 * @text Intensity Rate
 * @desc This determines intensity rate of the motion blur.
 * Use a number between 0 and 1.
 * @default 0.5
 *
 * @arg Duration:num
 * @text Duration
 * @type Number
 * @min 1
 * @desc How many frames should the motion blur last?
 * What do you want to be its duration?
 * @default 30
 *
 * @arg EasingType:str
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
 * @default InOutSine
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Impact_MotionTrailCreate
 * @text IMPACT: Motion Trail Create
 * @desc Creates a motion trail effect for the target(s).
 * Requires VisuMZ_3_ActSeqImpact!
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to create motion trail effects for.
 * @default ["user"]
 *
 * @arg delay:num
 * @text Delay
 * @type Number
 * @min 1
 * @desc How many frames to delay by when creating a motion trail?
 * The higher the delay, the less after images there are.
 * @default 1
 *
 * @arg duration:num
 * @text Duration
 * @type Number
 * @min 1
 * @desc How many frames should the motion trail last?
 * What do you want to be its duration?
 * @default 30
 *
 * @arg hue:num
 * @text Hue
 * @type Number
 * @min 0
 * @max 255
 * @desc What do you want to be the hue for the motion trail?
 * @default 0
 *
 * @arg opacityStart:num
 * @text Starting Opacity
 * @type Number
 * @min 0
 * @max 255
 * @desc What starting opacity value do you want for the motion
 * trail? Opacity values decrease over time.
 * @default 200
 *
 * @arg tone:eval
 * @text Tone
 * @desc What tone do you want for the motion trail?
 * Format: [Red, Green, Blue, Gray]
 * @default [0, 0, 0, 0]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Impact_MotionTrailRemove
 * @text IMPACT: Motion Trail Remove
 * @desc Removes the motion trail effect from the target(s).
 * Requires VisuMZ_3_ActSeqImpact!
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to clear motion trail effects for.
 * @default ["user"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Impact_ShockwavePoint
 * @text IMPACT: Shockwave at Point
 * @desc Creates a shockwave at the designated coordinates.
 * Requires VisuMZ_3_ActSeqImpact!
 * 
 * @arg Coordinates
 * 
 * @arg X:eval
 * @text Point: X
 * @parent Coordinates
 * @desc What x coordinate do you want to create a shockwave at?
 * You can use JavaScript code.
 * @default Graphics.width / 2
 * 
 * @arg Y:eval
 * @text Point: Y
 * @parent Coordinates
 * @desc What y coordinate do you want to create a shockwave at?
 * You can use JavaScript code.
 * @default (Graphics.height - 200) / 2
 * 
 * @arg Amp:eval
 * @text Amplitude
 * @desc What is the aplitude of the shockwave effect?
 * @default 30
 * 
 * @arg Wave:eval
 * @text Wavelength
 * @desc What is the wavelength of the shockwave effect?
 * @default 160
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc What is the duration of the shockwave?
 * @default 60
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Impact_ShockwaveEachTargets
 * @text IMPACT: Shockwave from Each Target(s)
 * @desc Creates a shockwave at each of the target(s) location(s).
 * Requires VisuMZ_3_ActSeqImpact!
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to start a shockwave from.
 * @default ["all targets"]
 * 
 * @arg TargetLocation:str
 * @text Target Location
 * @parent Targets2:arraystr
 * @type combo
 * @option front head
 * @option front center
 * @option front base
 * @option middle head
 * @option middle center
 * @option middle base
 * @option back head
 * @option back center
 * @option back base
 * @desc Select which part target group to start a shockwave from.
 * @default middle center
 * 
 * @arg OffsetX:eval
 * @text Offset X
 * @parent TargetLocation:str
 * @desc How much to offset the shockwave X point by.
 * Negative: left. Positive: right.
 * @default +0
 * 
 * @arg OffsetY:eval
 * @text Offset Y
 * @parent TargetLocation:str
 * @desc How much to offset the shockwave Y point by.
 * Negative: up. Positive: down.
 * @default +0
 * 
 * @arg Amp:eval
 * @text Amplitude
 * @desc What is the aplitude of the shockwave effect?
 * @default 30
 * 
 * @arg Wave:eval
 * @text Wavelength
 * @desc What is the wavelength of the shockwave effect?
 * @default 160
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc What is the duration of the shockwave?
 * @default 60
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Impact_ShockwaveCenterTargets
 * @text IMPACT: Shockwave from Target(s) Center
 * @desc Creates a shockwave from the center of the target(s).
 * Requires VisuMZ_3_ActSeqImpact!
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to start a shockwave from.
 * @default ["all targets"]
 * 
 * @arg TargetLocation:str
 * @text Target Location
 * @parent Targets2:arraystr
 * @type combo
 * @option front head
 * @option front center
 * @option front base
 * @option middle head
 * @option middle center
 * @option middle base
 * @option back head
 * @option back center
 * @option back base
 * @desc Select which part target group to start a shockwave from.
 * @default middle center
 * 
 * @arg OffsetX:eval
 * @text Offset X
 * @parent TargetLocation:str
 * @desc How much to offset the shockwave X point by.
 * Negative: left. Positive: right.
 * @default +0
 * 
 * @arg OffsetY:eval
 * @text Offset Y
 * @parent TargetLocation:str
 * @desc How much to offset the shockwave Y point by.
 * Negative: up. Positive: down.
 * @default +0
 * 
 * @arg Amp:eval
 * @text Amplitude
 * @desc What is the aplitude of the shockwave effect?
 * @default 30
 * 
 * @arg Wave:eval
 * @text Wavelength
 * @desc What is the wavelength of the shockwave effect?
 * @default 160
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc What is the duration of the shockwave?
 * @default 60
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Impact_ZoomBlurPoint
 * @text IMPACT: Zoom Blur at Point
 * @desc Creates a zoom blur at the designated coordinates.
 * Requires VisuMZ_3_ActSeqImpact!
 * 
 * @arg Coordinates
 * 
 * @arg X:eval
 * @text Point: X
 * @parent Coordinates
 * @desc What x coordinate do you want to focus the zoom at?
 * You can use JavaScript code.
 * @default Graphics.width / 2
 * 
 * @arg Y:eval
 * @text Point: Y
 * @parent Coordinates
 * @desc What y coordinate do you want to focus the zoom at?
 * You can use JavaScript code.
 * @default (Graphics.height - 200) / 2
 * 
 * @arg Strength:eval
 * @text Zoom Strength
 * @desc What is the strength of the zoom effect?
 * Use a number between 0 and 1.
 * @default 0.5
 * 
 * @arg Radius:eval
 * @text Visible Radius
 * @desc How much of a radius should be visible from the center?
 * @default 0
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc What is the duration of the zoom blur?
 * @default 60
 *
 * @arg EasingType:str
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
 * @default OutSine
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Impact_ZoomBlurTargetCenter
 * @text IMPACT: Zoom Blur at Target(s) Center
 * @desc Creates a zoom blur at the center of targets.
 * Requires VisuMZ_3_ActSeqImpact!
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to start a zoom blur from.
 * @default ["user"]
 * 
 * @arg TargetLocation:str
 * @text Target Location
 * @parent Targets2:arraystr
 * @type combo
 * @option front head
 * @option front center
 * @option front base
 * @option middle head
 * @option middle center
 * @option middle base
 * @option back head
 * @option back center
 * @option back base
 * @desc Select which part target group to start a zoom blur from.
 * @default middle center
 * 
 * @arg OffsetX:eval
 * @text Offset X
 * @parent TargetLocation:str
 * @desc How much to offset the zoom blur X point by.
 * Negative: left. Positive: right.
 * @default +0
 * 
 * @arg OffsetY:eval
 * @text Offset Y
 * @parent TargetLocation:str
 * @desc How much to offset the zoom blur Y point by.
 * Negative: up. Positive: down.
 * @default +0
 * 
 * @arg Strength:eval
 * @text Zoom Strength
 * @desc What is the strength of the zoom effect?
 * Use a number between 0 and 1.
 * @default 0.5
 * 
 * @arg Radius:eval
 * @text Visible Radius
 * @desc How much of a radius should be visible from the center?
 * @default 0
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc What is the duration of the zoom blur?
 * @default 60
 *
 * @arg EasingType:str
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
 * @default OutSine
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceSpaceMechanics
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceBreakMechanics
 * @text Action Sequences - Mechanics
 * @desc These Action Sequences are related to various mechanics
 * related to the battle system.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Mechanics_ActionEffect
 * @text MECH: Action Effect
 * @desc Causes the unit(s) to take damage/healing from action and
 * incurs any changes made such as buffs and states.
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to receive the current action's effects.
 * @default ["all targets"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Mechanics_AddBuffDebuff
 * @text MECH: Add Buff/Debuff
 * @desc Adds buff(s)/debuff(s) to unit(s). 
 * Determine which parameters are affected and their durations.
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to receive the buff(s) and/or debuff(s).
 * @default ["user"]
 * 
 * @arg Buffs:arraystr
 * @text Buff Parameters
 * @type combo[]
 * @option MaxHP
 * @option MaxMP
 * @option ATK
 * @option DEF
 * @option MAT
 * @option MDF
 * @option AGI
 * @option LUK
 * @desc Select which parameter(s) to buff.
 * Insert a parameter multiple times to raise its stacks.
 * @default ["ATK"]
 *
 * @arg Debuffs:arraystr
 * @text Debuff Parameters
 * @type combo[]
 * @option MaxHP
 * @option MaxMP
 * @option ATK
 * @option DEF
 * @option MAT
 * @option MDF
 * @option AGI
 * @option LUK
 * @desc Select which parameter(s) to debuff.
 * Insert a parameter multiple times to raise its stacks.
 * @default ["DEF"]
 * 
 * @arg Turns:eval
 * @text Turns
 * @desc Number of turns to set the parameter(s) buffs to.
 * You may use JavaScript code.
 * @default 5
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Mechanics_AddState
 * @text MECH: Add State
 * @desc Adds state(s) to unit(s).
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to receive the buff(s).
 * @default ["user"]
 * 
 * @arg States:arraynum
 * @text States
 * @type state[]
 * @desc Select which state ID(s) to add to unit(s).
 * Insert multiple state ID's to add multiple at once.
 * @default ["4"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Mechanics_ArmorPenetration
 * @text MECH: Armor Penetration
 * @desc Adds an extra layer of defensive penetration/reduction.
 * You may use JavaScript code for any of these.
 *
 * @arg ArmorPenetration
 * @text Armor/Magic Penetration
 * 
 * @arg ArPenRate:eval
 * @text Rate
 * @parent ArmorPenetration
 * @desc Penetrates an extra multiplier of armor by this value.
 * @default 0.00
 * 
 * @arg ArPenFlat:eval
 * @text Flat
 * @parent ArmorPenetration
 * @desc Penetrates a flat amount of armor by this value.
 * @default 0
 *
 * @arg ArmorReduction
 * @text Armor/Magic Reduction
 * 
 * @arg ArRedRate:eval
 * @text Rate
 * @parent ArmorReduction
 * @desc Reduces an extra multiplier of armor by this value.
 * @default 0.00
 * 
 * @arg ArRedFlat:eval
 * @text Flat
 * @parent ArmorReduction
 * @desc Reduces a flat amount of armor by this value.
 * @default 0
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Mechanics_AtbGauge
 * @text MECH: ATB Gauge
 * @desc Alters the ATB/TPB Gauges.
 * Requires VisuMZ_2_BattleSystemATB!
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to alter the ATB/TPB Gauges for.
 * @default ["all targets"]
 *
 * @arg Charging
 * 
 * @arg ChargeRate:eval
 * @text Charge Rate
 * @parent Charging
 * @desc Changes made to the ATB Gauge if it is currently charging.
 * @default -0.00
 * 
 * @arg Casting
 * 
 * @arg CastRate:eval
 * @text Cast Rate
 * @parent Casting
 * @desc Changes made to the ATB Gauge if it is currently casting.
 * @default -0.00
 * 
 * @arg Interrupt:eval
 * @text Interrupt?
 * @parent Casting
 * @type boolean
 * @on Interrupt
 * @off Don't Interrupt
 * @desc Interrupt the ATB Gauge if it is currently casting?
 * @default false
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Mechanics_BtbGain
 * @text MECH: BTB Brave Points
 * @desc Alters the target(s) Brave Points to an exact value.
 * Requires VisuMZ_2_BattleSystemBTB!
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to alter the ATB/TPB Gauges for.
 * @default ["all targets"]
 * 
 * @arg BravePoints:eval
 * @text Alter Brave Points By
 * @desc Alters the target(s) Brave Points.
 * Positive for gaining BP. Negative for losing BP.
 * @default +1
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Mechanics_Collapse
 * @text MECH: Collapse
 * @desc Causes the unit(s) to perform its collapse animation
 * if the unit(s) has died.
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to process a death collapse.
 * @default ["all targets"]
 * 
 * @arg ForceDeath:eval
 * @text Force Death
 * @type boolean
 * @on On
 * @off Off
 * @desc Force death even if the unit has not reached 0 HP?
 * This will remove immortality.
 * @default false
 * 
 * @arg WaitForEffect:eval
 * @text Wait For Effect?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for the collapse effect to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Mechanics_CtbOrder
 * @text MECH: CTB Order
 * @desc Alters the CTB Turn Order.
 * Requires VisuMZ_2_BattleSystemCTB!
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to alter the CTB Turn Order for.
 * @default ["all targets"]
 *
 * @arg ChangeOrderBy:eval
 * @text Change Order By
 * @parent Charging
 * @desc Changes turn order for target(s) by this amount.
 * Positive increases wait. Negative decreases wait.
 * @default +1
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Mechanics_CtbSpeed
 * @text MECH: CTB Speed
 * @desc Alters the CTB Speed.
 * Requires VisuMZ_2_BattleSystemCTB!
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to alter the CTB Speed for.
 * @default ["all targets"]
 *
 * @arg ChargeRate:eval
 * @text Charge Rate
 * @parent Charging
 * @desc Changes made to the CTB Speed if it is currently charging.
 * @default -0.00
 * 
 * @arg CastRate:eval
 * @text Cast Rate
 * @parent Casting
 * @desc Changes made to the CTB Speed if it is currently casting.
 * @default -0.00
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Mechanics_CustomDmgFormula
 * @text MECH: Custom Damage Formula
 * @desc Changes the current action's damage formula to custom.
 * This will assume the MANUAL damage style.
 * 
 * @arg Formula:str
 * @text Formula
 * @desc Changes the current action's damage formula to custom.
 * Use 'default' to revert the damage formula.
 * @default default
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Mechanics_DamagePopup
 * @text MECH: Damage Popup
 * @desc Causes the unit(s) to display the current state of
 * damage received or healed.
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to prompt a damage popup.
 * @default ["all targets"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Mechanics_DeathBreak
 * @text MECH: Dead Label Jump
 * @desc If the active battler is dead, jump to a specific label in the common event.
 * 
 * @arg JumpToLabel:str
 * @text Jump To Label
 * @desc If the active battler is dead, jump to this specific label in the common event.
 * @default Untitled
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Mechanics_FtbAction
 * @text MECH: FTB Action Count
 * @desc Alters the subject team's available Action Count.
 * Requires VisuMZ_2_BattleSystemFTB!
 * 
 * @arg ActionCount:eval
 * @text Action Count
 * @desc Alters the subject team's available Action Count.
 * Positive for gaining actions. Negative for losing actions.
 * @default +1
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Mechanics_HpMpTp
 * @text MECH: HP, MP, TP
 * @desc Alters the HP, MP, and TP values for unit(s).
 * Positive values for healing. Negative values for damage.
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to receive the current action's effects.
 * @default ["user"]
 *
 * @arg HP
 * 
 * @arg HP_Rate:eval
 * @text HP Rate
 * @parent HP
 * @desc Changes made to HP based on rate.
 * Positive values for healing. Negative values for damage.
 * @default +0.00
 * 
 * @arg HP_Flat:eval
 * @text HP Flat
 * @parent HP
 * @desc Flat changes made to HP.
 * Positive values for healing. Negative values for damage.
 * @default +0
 * 
 * @arg MP
 * 
 * @arg MP_Rate:eval
 * @text MP Rate
 * @parent MP
 * @desc Changes made to MP based on rate.
 * Positive values for healing. Negative values for damage.
 * @default +0.00
 * 
 * @arg MP_Flat:eval
 * @text MP Flat
 * @parent MP
 * @desc Flat changes made to MP.
 * Positive values for healing. Negative values for damage.
 * @default +0
 *
 * @arg TP
 * 
 * @arg TP_Rate:eval
 * @text TP Rate
 * @parent TP
 * @desc Changes made to TP based on rate.
 * Positive values for healing. Negative values for damage.
 * @default +0.00
 * 
 * @arg TP_Flat:eval
 * @text TP Flat
 * @parent TP
 * @desc Flat changes made to TP.
 * Positive values for healing. Negative values for damage.
 * @default +0
 * 
 * @arg ShowPopup:eval
 * @text Damage Popup?
 * @type boolean
 * @on On
 * @off Off
 * @desc Display a damage popup after?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Mechanics_Immortal
 * @text MECH: Immortal
 * @desc Changes the immortal flag of targets. If immortal flag is
 * removed and a unit would die, collapse that unit.
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Alter the immortal flag of these groups. If immortal flag
 * is removed and a unit would die, collapse that unit.
 * @default ["user","all targets"]
 * 
 * @arg Immortal:eval
 * @text Immortal
 * @type boolean
 * @on On
 * @off Off
 * @desc Turn immortal flag for unit(s) on/off?
 * @default false
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Mechanics_Multipliers
 * @text MECH: Multipliers
 * @desc Changes the multipliers for the current action.
 * You may use JavaScript code for any of these.
 *
 * @arg CriticalHit
 * @text Critical Hit%
 * 
 * @arg CriticalHitRate:eval
 * @text Rate
 * @parent CriticalHit
 * @desc Affects chance to land a critical hit by this multiplier.
 * @default 1.00
 * 
 * @arg CriticalHitFlat:eval
 * @text Flat
 * @parent CriticalHit
 * @desc Affects chance to land a critical hit by this flat bonus.
 * @default +0.00
 *
 * @arg CriticalDmg
 * @text Critical Damage
 * 
 * @arg CriticalDmgRate:eval
 * @text Rate
 * @parent CriticalDmg
 * @desc Affects critical damage by this multiplier.
 * @default 1.00
 * 
 * @arg CriticalDmgFlat:eval
 * @text Flat
 * @parent CriticalDmg
 * @desc Affects critical damage by this flat bonus.
 * @default +0.00
 *
 * @arg Damage
 * @text Damage/Healing
 * 
 * @arg DamageRate:eval
 * @text Rate
 * @parent Damage
 * @desc Sets the damage/healing multiplier for current action.
 * @default 1.00
 * 
 * @arg DamageFlat:eval
 * @text Flat
 * @parent Damage
 * @desc Sets the damage/healing bonus for current action.
 * @default +0.00
 *
 * @arg HitRate
 * @text Hit Rate
 * 
 * @arg HitRate:eval
 * @text Rate
 * @parent HitRate
 * @desc Affects chance to connect attack by this multiplier.
 * @default 1.00
 * 
 * @arg HitFlat:eval
 * @text Flat
 * @parent HitRate
 * @desc Affects chance to connect attack by this flat bonus.
 * @default +0.00
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Mechanics_RemoveBuffDebuff
 * @text MECH: Remove Buff/Debuff
 * @desc Removes buff(s)/debuff(s) from unit(s). 
 * Determine which parameters are removed.
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to have the buff(s) and/or debuff(s) removed.
 * @default ["user"]
 * 
 * @arg Buffs:arraystr
 * @text Buff Parameters
 * @type combo[]
 * @option MaxHP
 * @option MaxMP
 * @option ATK
 * @option DEF
 * @option MAT
 * @option MDF
 * @option AGI
 * @option LUK
 * @desc Select which buffed parameter(s) to remove.
 * @default ["MaxHP","MaxMP","ATK","DEF","MAT","MDF","AGI","LUK"]
 *
 * @arg Debuffs:arraystr
 * @text Debuff Parameters
 * @type combo[]
 * @option MaxHP
 * @option MaxMP
 * @option ATK
 * @option DEF
 * @option MAT
 * @option MDF
 * @option AGI
 * @option LUK
 * @desc Select which debuffed parameter(s) to remove.
 * @default ["MaxHP","MaxMP","ATK","DEF","MAT","MDF","AGI","LUK"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Mechanics_RemoveState
 * @text MECH: Remove State
 * @desc Remove state(s) from unit(s).
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to have states removed from.
 * @default ["user"]
 * 
 * @arg States:arraynum
 * @text States
 * @type state[]
 * @desc Select which state ID(s) to remove from unit(s).
 * Insert multiple state ID's to remove multiple at once.
 * @default ["4"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Mechanics_StbExploit
 * @text MECH: STB Exploit Effect
 * @desc Utilize the STB Exploitation mechanics!
 * Requires VisuMZ_2_BattleSystemSTB!
 * 
 * @arg Exploited:eval
 * @text Target(s) Exploited?
 * @type boolean
 * @on Exploit
 * @off Don't
 * @desc Exploit the below targets?
 * @default true
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to become exploited.
 * @default ["all targets"]
 * 
 * @arg ForceExploited:eval
 * @text Force Exploitation
 * @type boolean
 * @on Force
 * @off Don't
 * @desc Force the exploited status?
 * @default false
 * 
 * @arg Exploiter:eval
 * @text User Exploiter?
 * @type boolean
 * @on Exploit
 * @off Don't
 * @desc Allow the user to become the exploiter?
 * @default true
 * 
 * @arg ForceExploited:eval
 * @text Force Exploitation
 * @type boolean
 * @on Force
 * @off Don't
 * @desc Force the exploiter status?
 * @default false
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Mechanics_StbExtraAction
 * @text MECH: STB Extra Action
 * @desc Adds an extra action for the currently active battler.
 * Requires VisuMZ_2_BattleSystemSTB!
 * 
 * @arg Actions:eval
 * @text Extra Actions
 * @parent Charging
 * @desc How many extra actions should the active battler gain?
 * You may use JavaScript code.
 * @default 1
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Mechanics_StbRemoveExcessActions
 * @text MECH: STB Remove Excess Actions
 * @desc Removes excess actions from the active battler.
 * Requires VisuMZ_2_BattleSystemSTB!
 * 
 * @arg Actions:eval
 * @text Remove Actions
 * @parent Charging
 * @desc How many actions to remove from the active battler?
 * You may use JavaScript code.
 * @default 99
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Mechanics_TextPopup
 * @text MECH: Text Popup
 * @desc Causes the unit(s) to display a text popup.
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to prompt a text popup.
 * @default ["target"]
 * 
 * @arg Text:str
 * @text Text
 * @desc What text do you wish to display?
 * @default Text
 * 
 * @arg TextColor:str
 * @text Text Color
 * @parent Text:str
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default #ffffff
 *
 * @arg FlashColor:eval
 * @text Flash Color
 * @parent Popups
 * @desc Adjust the popup's flash color.
 * Format: [red, green, blue, alpha]
 * @default [255, 0, 0, 160]
 * 
 * @arg FlashDuration:num
 * @text Flash Duration
 * @parent FlashColor:eval
 * @type Number
 * @desc What is the frame duration of the flash effect?
 * @default 60
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Mechanics_VariablePopup
 * @text MECH: Variable Popup
 * @desc Causes the unit(s) to display a popup using the data
 * stored inside a variable.
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select unit(s) to prompt a text popup.
 * @default ["target"]
 * 
 * @arg Variable:num
 * @text Variable ID
 * @type variable
 * @desc Get data from which variable to display as a popup?
 * @default 1
 * 
 * @arg DigitGrouping:eval
 * @text Digit Grouping
 * @parent Variable:num
 * @type boolean
 * @on Group Digits
 * @off Don't Group
 * @desc Use digit grouping to separate numbers?
 * Requires VisuMZ_0_CoreEngine!
 * @default true
 * 
 * @arg TextColor:str
 * @text Text Color
 * @parent Variable:num
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default #ffffff
 *
 * @arg FlashColor:eval
 * @text Flash Color
 * @parent Popups
 * @desc Adjust the popup's flash color.
 * Format: [red, green, blue, alpha]
 * @default [0, 0, 0, 0]
 * 
 * @arg FlashDuration:num
 * @text Flash Duration
 * @parent FlashColor:eval
 * @type Number
 * @desc What is the frame duration of the flash effect?
 * @default 60
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Mechanics_WaitForEffect
 * @text MECH: Wait For Effect
 * @desc Waits for the effects to complete before performing next command.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceSpaceMotion
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceBreakMotion
 * @text Action Sequences - Motion
 * @desc These Action Sequences allow you the ability to control
 * the motions of sideview sprites.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Motion_ClearFreezeFrame
 * @text MOTION: Clear Freeze Frame
 * @desc Clears any freeze frames from the unit(s).
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select which unit(s) to clear freeze frames for.
 * @default ["user"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Motion_FreezeMotionFrame
 * @text MOTION: Freeze Motion Frame
 * @desc Forces a freeze frame instantly at the selected motion.
 * Automatically clears with a new motion.
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select which unit(s) to freeze motions for.
 * @default ["user"]
 *
 * @arg MotionType:str
 * @text Motion Type
 * @type combo
 * @option walk
 * @option wait
 * @option chant
 * @option guard
 * @option damage
 * @option evade
 * @option attack
 * @option thrust
 * @option swing
 * @option missile
 * @option skill
 * @option spell
 * @option item
 * @option escape
 * @option victory
 * @option dying
 * @option abnormal
 * @option sleep
 * @option dead
 * @desc Freeze this motion for the unit(s).
 * @default attack
 * 
 * @arg Frame:num
 * @text Frame Index
 * @desc Which frame do you want to freeze the motion on?
 * Frame index values start at 0.
 * @default 2
 *
 * @arg ShowWeapon:eval
 * @text Show Weapon?
 * @type combo
 * @type boolean
 * @on Show
 * @off Hide
 * @desc If using 'attack', 'thrust', 'swing', or 'missile',
 * display the weapon sprite?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Motion_MotionType
 * @text MOTION: Motion Type
 * @desc Causes the unit(s) to play the selected motion.
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select which unit(s) to perform a motion.
 * @default ["user"]
 *
 * @arg MotionType:str
 * @text Motion Type
 * @type combo
 * @option walk
 * @option wait
 * @option chant
 * @option guard
 * @option damage
 * @option evade
 * @option attack
 * @option thrust
 * @option swing
 * @option missile
 * @option skill
 * @option spell
 * @option item
 * @option escape
 * @option victory
 * @option dying
 * @option abnormal
 * @option sleep
 * @option dead
 * @desc Play this motion for the unit(s).
 * @default attack
 *
 * @arg ShowWeapon:eval
 * @text Show Weapon?
 * @type combo
 * @type boolean
 * @on Show
 * @off Hide
 * @desc If using 'attack', 'thrust', 'swing', or 'missile',
 * display the weapon sprite?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Motion_PerformAction
 * @text MOTION: Perform Action
 * @desc Causes the unit(s) to play the proper motion based
 * on the current action.
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select which unit(s) to perform a motion.
 * @default ["user"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Motion_RefreshMotion
 * @text MOTION: Refresh Motion
 * @desc Cancels any set motions unit(s) has to do and use
 * their most natural motion at the moment.
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select which unit(s) to refresh their motion state.
 * @default ["user"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Motion_WaitMotionFrame
 * @text MOTION: Wait By Motion Frame
 * @desc Creates a wait equal to the number of motion frames passing.
 * Time is based on Plugin Parameters => Actors => Motion Speed.
 *
 * @arg MotionFrameWait:num
 * @text Motion Frames to Wait?
 * @type number
 * @min 1
 * @desc Each "frame" is equal to the value found in
 * Plugin Parameters => Actors => Motion Speed
 * @default 1
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceSpaceMovement
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceBreakMovement
 * @text Action Sequences - Movement
 * @desc These Action Sequences allow you the ability to control
 * the sprites of actors and enemies in battle.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Movement_BattleStep
 * @text MOVE: Battle Step
 * @desc Causes the unit(s) to move forward past their home position
 * to prepare for action.
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select which unit(s) to move.
 * @default ["user"]
 * 
 * @arg WaitForMovement:eval
 * @text Wait For Movement?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for movement to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Movement_FaceDirection
 * @text MOVE: Face Direction
 * @desc Causes the unit(s) to face forward or backward.
 * Sideview-only!
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select which unit(s) to change direction.
 * @default ["user"]
 * 
 * @arg Direction:str
 * @text Direction
 * @type combo
 * @option forward
 * @option backward
 * @option random
 * @desc Select which direction to face.
 * @default forward
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Movement_FacePoint
 * @text MOVE: Face Point
 * @desc Causes the unit(s) to face a point on the screen.
 * Sideview-only!
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select which unit(s) to change direction.
 * @default ["user"]
 * 
 * @arg Point:str
 * @text Point
 * @type combo
 * @option home
 * @option center
 * @option point x, y
 * @desc Select which point to face.
 * Replace 'x' and 'y' with coordinates
 * @default home
 * 
 * @arg FaceAway:eval
 * @text Face Away From?
 * @type boolean
 * @on Turn Away
 * @off Face Directly
 * @desc Face away from the point instead?
 * @default false
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Movement_FaceTarget
 * @text MOVE: Face Target(s)
 * @desc Causes the unit(s) to face other targets on the screen.
 * Sideview-only!
 * 
 * @arg Targets1:arraystr
 * @text Targets (facing)
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select which unit(s) to change direction.
 * @default ["user"]
 * 
 * @arg Targets2:arraystr
 * @text Targets (destination)
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select which unit(s) for the turning unit(s) to face.
 * @default ["current target"]
 * 
 * @arg FaceAway:eval
 * @text Face Away From?
 * @type boolean
 * @on Turn Away
 * @off Face Directly
 * @desc Face away from the unit(s) instead?
 * @default false
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Movement_Float
 * @text MOVE: Float
 * @desc Causes the unit(s) to float above the ground.
 * Sideview-only!
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select which unit(s) to make float.
 * @default ["user"]
 * 
 * @arg Height:eval
 * @text Desired Height
 * @desc Vertical distance to float upward.
 * You may use JavaScript code.
 * @default 100
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for total float amount.
 * @default 12
 *
 * @arg EasingType:str
 * @text Float Easing
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
 * Requires VisuMZ_0_CoreEngine.
 * @default Linear
 * 
 * @arg WaitForFloat:eval
 * @text Wait For Float?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for floating to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Movement_HomeReset
 * @text MOVE: Home Reset
 * @desc Causes the unit(s) to move back to their home position(s)
 * and face back to their original direction(s).
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select which unit(s) to move.
 * @default ["alive battlers"]
 * 
 * @arg WaitForMovement:eval
 * @text Wait For Movement?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for movement to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Movement_Jump
 * @text MOVE: Jump
 * @desc Causes the unit(s) to jump into the air.
 * Sideview-only!
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select which unit(s) to make jump.
 * @default ["user"]
 * 
 * @arg Height:eval
 * @text Desired Height
 * @desc Max jump height to go above the ground
 * You may use JavaScript code.
 * @default 100
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for total jump amount.
 * @default 12
 * 
 * @arg WaitForJump:eval
 * @text Wait For Jump?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for jumping to complete before performing next command?
 * @default false
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Movement_MoveBy
 * @text MOVE: Move Distance
 * @desc Moves unit(s) by a distance from their current position(s).
 * Sideview-only!
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select which unit(s) to move.
 * @default ["user"]
 *
 * @arg DistanceAdjust:str
 * @text Distance Adjustment
 * @type select
 * @option Normal - No adjustments made
 * @value none
 * @option Horizontal - Actors adjust left, Enemies adjust right
 * @value horz
 * @option Vertical - Actors adjust Up, Enemies adjust down
 * @value vert
 * @option Both - Applies both Horizontal and Vertical
 * @value horz + vert
 * @desc Makes adjustments to distance values to determine
 * which direction to move unit(s).
 * @default horz
 * 
 * @arg DistanceX:eval
 * @text Distance: X
 * @parent DistanceAdjust:str
 * @desc Horizontal distance to move.
 * You may use JavaScript code.
 * @default 48
 * 
 * @arg DistanceY:eval
 * @text Distance: Y
 * @parent DistanceAdjust:str
 * @desc Vertical distance to move.
 * You may use JavaScript code.
 * @default 0
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for total movement amount.
 * @default 12
 * 
 * @arg FaceDirection:eval
 * @text Face Destination?
 * @type boolean
 * @on Turn
 * @off Don't
 * @desc Turn and face the destination?
 * @default true
 *
 * @arg EasingType:str
 * @text Movement Easing
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
 * Requires VisuMZ_0_CoreEngine.
 * @default Linear
 *
 * @arg MotionType:str
 * @text Movement Motion
 * @type combo
 * @option walk
 * @option wait
 * @option chant
 * @option guard
 * @option damage
 * @option evade
 * @option thrust
 * @option swing
 * @option missile
 * @option skill
 * @option spell
 * @option item
 * @option escape
 * @option victory
 * @option dying
 * @option abnormal
 * @option sleep
 * @option dead
 * @desc Play this motion for the unit(s).
 * @default walk
 * 
 * @arg WaitForMovement:eval
 * @text Wait For Movement?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for movement to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Movement_MoveToPoint
 * @text MOVE: Move To Point
 * @desc Moves unit(s) to a designated point on the screen.
 * Sideview-only! Points based off Graphics.boxWidth/Height.
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select which unit(s) to move.
 * @default ["user"]
 * 
 * @arg Destination:str
 * @text Destination Point
 * @type combo
 * @option home
 * @option center
 * @option point x, y
 * @desc Select which point to face.
 * Replace 'x' and 'y' with coordinates
 * @default home
 *
 * @arg OffsetAdjust:str
 * @text Offset Adjustment
 * @parent Destination:str
 * @type select
 * @option Normal - No adjustments made
 * @value none
 * @option Horizontal - Actors adjust left, Enemies adjust right
 * @value horz
 * @option Vertical - Actors adjust Up, Enemies adjust down
 * @value vert
 * @option Both - Applies both Horizontal and Vertical
 * @value horz + vert
 * @desc Makes adjustments to offset values to determine
 * which direction to adjust the destination by.
 * @default horz
 * 
 * @arg OffsetX:eval
 * @text Offset: X
 * @parent OffsetAdjust:str
 * @desc Horizontal offset to move.
 * You may use JavaScript code.
 * @default 0
 * 
 * @arg OffsetY:eval
 * @text Offset: Y
 * @parent OffsetAdjust:str
 * @desc Vertical offset to move.
 * You may use JavaScript code.
 * @default 0
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for total movement amount.
 * @default 12
 * 
 * @arg FaceDirection:eval
 * @text Face Destination?
 * @type boolean
 * @on Turn
 * @off Don't
 * @desc Turn and face the destination?
 * @default true
 *
 * @arg EasingType:str
 * @text Movement Easing
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
 * Requires VisuMZ_0_CoreEngine.
 * @default Linear
 *
 * @arg MotionType:str
 * @text Movement Motion
 * @type combo
 * @option walk
 * @option wait
 * @option chant
 * @option guard
 * @option damage
 * @option evade
 * @option thrust
 * @option swing
 * @option missile
 * @option skill
 * @option spell
 * @option item
 * @option escape
 * @option victory
 * @option dying
 * @option abnormal
 * @option sleep
 * @option dead
 * @desc Play this motion for the unit(s).
 * @default walk
 * 
 * @arg WaitForMovement:eval
 * @text Wait For Movement?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for movement to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Movement_MoveToTarget
 * @text MOVE: Move To Target(s)
 * @desc Moves unit(s) to another unit(s) on the battle field.
 * Sideview-only!
 * 
 * @arg Targets1:arraystr
 * @text Targets (Moving)
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select which unit(s) to move.
 * @default ["user"]
 * 
 * @arg Targets2:arraystr
 * @text Targets (Destination)
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select which unit(s) to move to.
 * @default ["all targets"]
 * 
 * @arg TargetLocation:str
 * @text Target Location
 * @parent Targets2:arraystr
 * @type combo
 * @option front head
 * @option front center
 * @option front base
 * @option middle head
 * @option middle center
 * @option middle base
 * @option back head
 * @option back center
 * @option back base
 * @desc Select which part target group to move to.
 * @default front base
 * 
 * @arg MeleeDistance:eval
 * @text Melee Distance
 * @parent TargetLocation:str
 * @desc The melee distance away from the target location
 * in addition to the battler's width.
 * @default 24
 *
 * @arg OffsetAdjust:str
 * @text Offset Adjustment
 * @parent Targets2:arraystr
 * @type select
 * @option Normal - No adjustments made
 * @value none
 * @option Horizontal - Actors adjust left, Enemies adjust right
 * @value horz
 * @option Vertical - Actors adjust Up, Enemies adjust down
 * @value vert
 * @option Both - Applies both Horizontal and Vertical
 * @value horz + vert
 * @desc Makes adjustments to offset values to determine
 * which direction to adjust the destination by.
 * @default horz
 * 
 * @arg OffsetX:eval
 * @text Offset: X
 * @parent OffsetAdjust:str
 * @desc Horizontal offset to move.
 * You may use JavaScript code.
 * @default 0
 * 
 * @arg OffsetY:eval
 * @text Offset: Y
 * @parent OffsetAdjust:str
 * @desc Vertical offset to move.
 * You may use JavaScript code.
 * @default 0
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for total movement amount.
 * @default 12
 * 
 * @arg FaceDirection:eval
 * @text Face Destination?
 * @type boolean
 * @on Turn
 * @off Don't
 * @desc Turn and face the destination?
 * @default true
 *
 * @arg EasingType:str
 * @text Movement Easing
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
 * Requires VisuMZ_0_CoreEngine.
 * @default Linear
 *
 * @arg MotionType:str
 * @text Movement Motion
 * @type combo
 * @option walk
 * @option wait
 * @option chant
 * @option guard
 * @option damage
 * @option evade
 * @option thrust
 * @option swing
 * @option missile
 * @option skill
 * @option spell
 * @option item
 * @option escape
 * @option victory
 * @option dying
 * @option abnormal
 * @option sleep
 * @option dead
 * @desc Play this motion for the unit(s).
 * @default walk
 * 
 * @arg WaitForMovement:eval
 * @text Wait For Movement?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for movement to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Movement_Opacity
 * @text MOVE: Opacity
 * @desc Causes the unit(s) to change opacity.
 * Sideview-only!
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select which unit(s) to change opacity.
 * @default ["user"]
 * 
 * @arg Opacity:eval
 * @text Desired Opacity
 * @desc Change to this opacity value.
 * You may use JavaScript code.
 * @default 255
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames for opacity change.
 * @default 12
 *
 * @arg EasingType:str
 * @text Opacity Easing
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
 * Requires VisuMZ_0_CoreEngine.
 * @default Linear
 * 
 * @arg WaitForOpacity:eval
 * @text Wait For Opacity?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for opacity changes to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Movement_Scale
 * @text MOVE: Scale/Grow/Shrink
 * @desc Causes the unit(s) to scale, grow, or shrink?.
 * Sideview-only!
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select which unit(s) to change the scale of.
 * @default ["user"]
 * 
 * @arg ScaleX:eval
 * @text Scale X
 * @desc What target scale value do you want?
 * 1.0 is normal size.
 * @default 1.00
 * 
 * @arg ScaleY:eval
 * @text Scale Y
 * @desc What target scale value do you want?
 * 1.0 is normal size.
 * @default 1.00
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames to scale for.
 * @default 12
 *
 * @arg EasingType:str
 * @text Scale Easing
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
 * Requires VisuMZ_0_CoreEngine.
 * @default Linear
 * 
 * @arg WaitForScale:eval
 * @text Wait For Scale?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for scaling to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Movement_Skew
 * @text MOVE: Skew/Distort
 * @desc Causes the unit(s) to skew.
 * Sideview-only!
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select which unit(s) to skew.
 * @default ["user"]
 * 
 * @arg SkewX:eval
 * @text Skew X
 * @desc X variance to skew?
 * Use small values for the best results.
 * @default 0.00
 * 
 * @arg SkewY:eval
 * @text Skew Y
 * @desc Y variance to skew?
 * Use small values for the best results.
 * @default 0.00
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames to skew for.
 * @default 12
 *
 * @arg EasingType:str
 * @text Skew Easing
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
 * Requires VisuMZ_0_CoreEngine.
 * @default Linear
 * 
 * @arg WaitForSkew:eval
 * @text Wait For Skew?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for skew to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Movement_Spin
 * @text MOVE: Spin/Rotate
 * @desc Causes the unit(s) to spin.
 * Sideview-only!
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select which unit(s) to spin.
 * @default ["user"]
 * 
 * @arg Angle:eval
 * @text Angle
 * @desc How many degrees to spin?
 * @default 360
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames to spin for.
 * @default 12
 *
 * @arg EasingType:str
 * @text Spin Easing
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
 * Requires VisuMZ_0_CoreEngine.
 * @default Linear
 * 
 * @arg RevertAngle:eval
 * @text Revert Angle on Finish
 * @type boolean
 * @on Revert
 * @off Don't
 * @desc Revert angle after spinning?
 * @default true
 * 
 * @arg WaitForSpin:eval
 * @text Wait For Spin?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for spin to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Movement_WaitForFloat
 * @text MOVE: Wait For Float
 * @desc Waits for floating to complete before performing next command.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Movement_WaitForJump
 * @text MOVE: Wait For Jump
 * @desc Waits for jumping to complete before performing next command.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Movement_WaitForMovement
 * @text MOVE: Wait For Movement
 * @desc Waits for movement to complete before performing next command.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Movement_WaitForOpacity
 * @text MOVE: Wait For Opacity
 * @desc Waits for opacity changes to complete before performing next command.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Movement_WaitForScale
 * @text MOVE: Wait For Scale
 * @desc Waits for scaling to complete before performing next command.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Movement_WaitForSkew
 * @text MOVE: Wait For Skew
 * @desc Waits for skewing to complete before performing next command.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Movement_WaitForSpin
 * @text MOVE: Wait For Spin
 * @desc Waits for spinning to complete before performing next command.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceSpaceProjectile
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceBreakProjectile
 * @text Action Sequences - Projectiles
 * @desc Create projectiles on the screen and fire them off at a target.
 * Requires VisuMZ_3_ActSeqProjectiles!
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Projectile_Animation
 * @text PROJECTILE: Animation
 * @desc Create an animation projectile and fire it at a target.
 * Requires VisuMZ_3_ActSeqProjectiles!
 * 
 * @arg Coordinates
 *
 * @arg Start:struct
 * @text Start Location
 * @parent Coordinates
 * @type struct<ProjectileStart>
 * @desc Settings to determine where the projectile(s) start from.
 * @default {"Type:str":"target","Targets:arraystr":"[\"user\"]","TargetCenter:eval":"false","PointX:eval":"Graphics.width / 2","PointY:eval":"Graphics.height / 2","OffsetX:eval":"+0","OffsetY:eval":"+0"}
 *
 * @arg Goal:struct
 * @text Goal Location
 * @parent Coordinates
 * @type struct<ProjectileGoal>
 * @desc Settings to determine where the projectile(s) start from.
 * @default {"Type:str":"target","Targets:arraystr":"[\"all targets\"]","TargetCenter:eval":"false","PointX:eval":"Graphics.width / 2","PointY:eval":"Graphics.height / 2","OffsetX:eval":"+0","OffsetY:eval":"+0"}
 * 
 * @arg Settings
 *
 * @arg AnimationID:num
 * @text Animation ID
 * @parent Settings
 * @type animation
 * @desc Determine which animation to use as a projectile.
 * @default 77
 * 
 * @arg Duration:eval
 * @text Duration
 * @parent Settings
 * @desc Duration for the projectile(s) to travel.
 * @default 20
 * 
 * @arg WaitForProjectile:eval
 * @text Wait For Projectile?
 * @parent Settings
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for projectile(s) to reach their destination before
 * going onto the next command?
 * @default true
 * 
 * @arg Extra:struct
 * @text Extra Settings
 * @type struct<ProjectileExAni>
 * @desc Add extra settings to the projectile?
 * @default {"AutoAngle:eval":"true","AngleOffset:eval":"+0","Arc:eval":"0","EasingType:str":"Linear","Spin:eval":"+0.0"}
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Projectile_Icon
 * @text PROJECTILE: Icon
 * @desc Create an icon projectile and fire it at a target.
 * Requires VisuMZ_3_ActSeqProjectiles!
 * 
 * @arg Coordinates
 *
 * @arg Start:struct
 * @text Start Location
 * @parent Coordinates
 * @type struct<ProjectileStart>
 * @desc Settings to determine where the projectile(s) start from.
 * @default {"Type:str":"target","Targets:arraystr":"[\"user\"]","TargetCenter:eval":"false","PointX:eval":"Graphics.width / 2","PointY:eval":"Graphics.height / 2","OffsetX:eval":"+0","OffsetY:eval":"+0"}
 *
 * @arg Goal:struct
 * @text Goal Location
 * @parent Coordinates
 * @type struct<ProjectileGoal>
 * @desc Settings to determine where the projectile(s) start from.
 * @default {"Type:str":"target","Targets:arraystr":"[\"all targets\"]","TargetCenter:eval":"false","PointX:eval":"Graphics.width / 2","PointY:eval":"Graphics.height / 2","OffsetX:eval":"+0","OffsetY:eval":"+0"}
 * 
 * @arg Settings
 *
 * @arg Icon:eval
 * @text Icon Index
 * @parent Settings
 * @desc Determine which icon to use as a projectile.
 * You may use JavaScript code.
 * @default 118
 * 
 * @arg Duration:eval
 * @text Duration
 * @parent Settings
 * @desc Duration for the projectile(s) to travel.
 * @default 20
 * 
 * @arg WaitForProjectile:eval
 * @text Wait For Projectile?
 * @parent Settings
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for projectile(s) to reach their destination before
 * going onto the next command?
 * @default true
 * 
 * @arg Extra:struct
 * @text Extra Settings
 * @type struct<ProjectileExtra>
 * @desc Add extra settings to the projectile?
 * @default {"AutoAngle:eval":"true","AngleOffset:eval":"+0","Arc:eval":"0","BlendMode:num":"0","EasingType:str":"Linear","Hue:eval":"0","Scale:eval":"1.0","Spin:eval":"+0.0"}
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Projectile_Picture
 * @text PROJECTILE: Picture
 * @desc Create a picture projectile and fire it at a target.
 * Requires VisuMZ_3_ActSeqProjectiles!
 * 
 * @arg Coordinates
 *
 * @arg Start:struct
 * @text Start Location
 * @parent Coordinates
 * @type struct<ProjectileStart>
 * @desc Settings to determine where the projectile(s) start from.
 * @default {"Type:str":"target","Targets:arraystr":"[\"user\"]","TargetCenter:eval":"false","PointX:eval":"Graphics.width / 2","PointY:eval":"Graphics.height / 2","OffsetX:eval":"+0","OffsetY:eval":"+0"}
 *
 * @arg Goal:struct
 * @text Goal Location
 * @parent Coordinates
 * @type struct<ProjectileGoal>
 * @desc Settings to determine where the projectile(s) start from.
 * @default {"Type:str":"target","Targets:arraystr":"[\"all targets\"]","TargetCenter:eval":"false","PointX:eval":"Graphics.width / 2","PointY:eval":"Graphics.height / 2","OffsetX:eval":"+0","OffsetY:eval":"+0"}
 * 
 * @arg Settings
 *
 * @arg Picture:str
 * @text Picture Filename
 * @parent Settings
 * @type file
 * @dir img/pictures/
 * @desc Determine which picture to use as a projectile.
 * @default Untitled
 * 
 * @arg Duration:eval
 * @text Duration
 * @parent Settings
 * @desc Duration for the projectile(s) to travel.
 * @default 20
 * 
 * @arg WaitForProjectile:eval
 * @text Wait For Projectile?
 * @parent Settings
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for projectile(s) to reach their destination before
 * going onto the next command?
 * @default true
 * 
 * @arg Extra:struct
 * @text Extra Settings
 * @type struct<ProjectileExtra>
 * @desc Add extra settings to the projectile?
 * @default {"AutoAngle:eval":"true","AngleOffset:eval":"+0","Arc:eval":"0","BlendMode:num":"0","EasingType:str":"Linear","Hue:eval":"0","Scale:eval":"1.0","Spin:eval":"+0.0"}
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceSpaceSkew
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceBreakSkew
 * @text Action Sequences - Skew
 * @desc Allows you to have control over the camera skew.
 * Requires VisuMZ_3_ActSeqCamera!
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_ChangeSkew
 * @text SKEW: Change Skew
 * @desc Changes the camera skew.
 * Requires VisuMZ_3_ActSeqCamera!
 * 
 * @arg SkewX:eval
 * @text Skew X
 * @desc Change the camera skew X to this value.
 * @default 0
 * 
 * @arg SkewY:eval
 * @text Skew Y
 * @desc Change the camera skew Y to this value.
 * @default 0
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames to change camera skew.
 * @default 60
 *
 * @arg EasingType:str
 * @text Skew Easing
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
 * Requires VisuMZ_0_CoreEngine.
 * @default InOutSine
 * 
 * @arg WaitForSkew:eval
 * @text Wait For Skew?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for skew changes to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Skew_Reset
 * @text SKEW: Reset Skew
 * @desc Reset any skew settings.
 * Requires VisuMZ_3_ActSeqCamera!
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames to reset camera skew.
 * @default 60
 *
 * @arg EasingType:str
 * @text Skew Easing
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
 * Requires VisuMZ_0_CoreEngine.
 * @default InOutSine
 * 
 * @arg WaitForSkew:eval
 * @text Wait For Skew?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for skew changes to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Skew_WaitForSkew
 * @text SKEW: Wait For Skew
 * @desc Waits for skew changes to complete before performing next command.
 * Requires VisuMZ_3_ActSeqCamera!
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceSpaceTarget
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceBreakTarget
 * @text Action Sequences - Target
 * @desc If using a manual target by target Action Sequence,
 * these commands will give you full control over its usage.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Target_CurrentIndex
 * @text TARGET: Current Index
 * @desc Sets the current index to this value.
 * Then decide to jump to a label (optional).
 * 
 * @arg Index:eval
 * @text Set Index To
 * @desc Sets current targeting index to this value.
 * 0 is the starting index of a target group.
 * @default 0
 * 
 * @arg JumpToLabel:str
 * @text Jump To Label
 * @desc If a target is found after the index change,
 * jump to this label in the Common Event.
 * @default Untitled
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Target_NextTarget
 * @text TARGET: Next Target
 * @desc Moves index forward by 1 to select a new current target.
 * Then decide to jump to a label (optional).
 * 
 * @arg JumpToLabel:str
 * @text Jump To Label
 * @desc If a target is found after the index change,
 * jump to this label in the Common Event.
 * @default Untitled
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Target_PrevTarget
 * @text TARGET: Previous Target
 * @desc Moves index backward by 1 to select a new current target.
 * Then decide to jump to a label (optional).
 * 
 * @arg JumpToLabel:str
 * @text Jump To Label
 * @desc If a target is found after the index change,
 * jump to this label in the Common Event.
 * @default Untitled
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Target_RandTarget
 * @text TARGET: Random Target
 * @desc Sets index randomly to determine new currernt target.
 * Then decide to jump to a label (optional).
 * 
 * @arg ForceRandom:eval
 * @text Force Random?
 * @type boolean
 * @on On
 * @off Off
 * @desc Index cannot be its previous index amount after random.
 * @default false
 * 
 * @arg JumpToLabel:str
 * @text Jump To Label
 * @desc If a target is found after the index change,
 * jump to this label in the Common Event.
 * @default Untitled
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceSpaceWeapon
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceBreakWeapon
 * @text Action Sequences - Weapon
 * @desc Allows for finer control over Dual/Multi Wielding actors.
 * Only works for Actors.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Weapon_ClearActiveWeapon
 * @text WEAPON: Clear Weapon Slot
 * @desc Clears the active weapon slot (making others valid again).
 * Only works for Actors.
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @desc Select unit(s) to clear the active weapon slot for.
 * @default ["user"]
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Weapon_NextActiveWeapon
 * @text WEAPON: Next Weapon Slot
 * @desc Goes to next active weapon slot (making others invalid).
 * If next slot is weaponless, don't label jump.
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @desc Select unit(s) to change the next active weapon slot for.
 * @default ["user"]
 * 
 * @arg JumpToLabel:str
 * @text Jump To Label
 * @desc If a weapon is found after the index change,
 * jump to this label in the Common Event.
 * @default Untitled
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Weapon_SetActiveWeapon
 * @text WEAPON: Set Weapon Slot
 * @desc Sets the active weapon slot (making others invalid).
 * Only works for Actors.
 * 
 * @arg Targets:arraystr
 * @text Targets
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @desc Select unit(s) to change the active weapon slot for.
 * @default ["user"]
 * 
 * @arg SlotID:eval
 * @text Weapon Slot ID
 * @desc Select weapon slot to make active (making others invalid).
 * Use 0 to clear and normalize. You may use JavaScript code.
 * @default 1
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceSpaceZoom
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceBreakZoom
 * @text Action Sequences - Zoom
 * @desc Allows you to have control over the screen zoom.
 * Requires VisuMZ_3_ActSeqCamera!
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Zoom_Scale
 * @text ZOOM: Change Scale
 * @desc Changes the zoom scale.
 * Requires VisuMZ_3_ActSeqCamera!
 * 
 * @arg Scale:eval
 * @text Scale
 * @desc The zoom scale to change to.
 * @default 1.0
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames to change battle zoom.
 * @default 60
 *
 * @arg EasingType:str
 * @text Zoom Easing
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
 * Requires VisuMZ_0_CoreEngine.
 * @default InOutSine
 * 
 * @arg WaitForZoom:eval
 * @text Wait For Zoom?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for zoom changes to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Zoom_Reset
 * @text ZOOM: Reset Zoom
 * @desc Reset any zoom settings.
 * Requires VisuMZ_3_ActSeqCamera!
 * 
 * @arg Duration:eval
 * @text Duration
 * @desc Duration in frames to reset battle zoom.
 * @default 60
 *
 * @arg EasingType:str
 * @text Zoom Easing
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
 * Requires VisuMZ_0_CoreEngine.
 * @default InOutSine
 * 
 * @arg WaitForZoom:eval
 * @text Wait For Zoom?
 * @type boolean
 * @on On
 * @off Off
 * @desc Wait for zoom changes to complete before performing next command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActSeq_Zoom_WaitForZoom
 * @text ZOOM: Wait For Zoom
 * @desc Waits for zoom to complete before performing next command.
 * Requires VisuMZ_3_ActSeqCamera!
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ActionSequenceSpaceEnd
 * @text -
 * @desc -
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
 * @param BattleCore
 * @default Plugin Parameters
 *
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param AutoBattle:struct
 * @text Auto Battle Settings
 * @type struct<AutoBattle>
 * @desc Settings pertaining to Auto Battle.
 * @default {"BattleDisplay":"","AutoBattleMsg:str":"Press %1 or %2 to stop Auto Battle","AutoBattleOK:str":"OK","AutoBattleCancel:str":"Cancel","AutoBattleBgType:num":"1","AutoBattleRect:func":"\"const width = Graphics.width;\\nconst height = this.calcWindowHeight(1, false);\\nconst x = 0;\\nconst y = (Graphics.height - height) / 2;\\nreturn new Rectangle(x, y, width, height);\"","Options":"","AddOption:eval":"true","AdjustRect:eval":"true","StartName:str":"Auto Battle Start","StyleName:str":"Auto Battle Style","StyleOFF:str":"Attack","StyleON:str":"Skills"}
 *
 * @param Damage:struct
 * @text Damage Settings
 * @type struct<Damage>
 * @desc Settings pertaining to damage calculations.
 * @default {"Cap":"","EnableDamageCap:eval":"false","DefaultHardCap:num":"9999","EnableSoftCap:eval":"false","DefaultSoftCap:num":"0.80","DefaultSoftScaler:num":"0.1275","Popups":"","PopupDuration:num":"128","NewPopupBottom:eval":"true","PopupPosition:str":"base","PopupOffsetX:num":"0","PopupOffsetY:num":"0","PopupShiftX:num":"8","PopupShiftY:num":"-28","hpDamageFmt:str":"-%1","hpHealingFmt:str":"+%1","mpDamageFmt:str":"-%1 %2","mpHealingFmt:str":"+%1 %2","CriticalColor:eval":"[255, 0, 0, 160]","CriticalDuration:num":"128","Formulas":"","OverallFormulaJS:func":"\"// Declare Constants\\nconst target = arguments[0];\\nconst critical = arguments[1];\\nconst item = this.item();\\n\\n// Get Base Damage\\nconst baseValue = this.evalDamageFormula(target);\\n\\n// Calculate Element Modifiers\\nlet value = baseValue * this.calcElementRate(target);\\n\\n// Calculate Physical and Magical Modifiers\\nif (this.isPhysical()) {\\n    value *= target.pdr;\\n}\\nif (this.isMagical()) {\\n    value *= target.mdr;\\n}\\n\\n// Apply Healing Modifiers\\nif (baseValue < 0) {\\n    value *= target.rec;\\n}\\n\\n// Apply Critical Modifiers\\nif (critical) {\\n    value = this.applyCritical(value);\\n}\\n\\n// Apply Variance and Guard Modifiers\\nvalue = this.applyVariance(value, item.damage.variance);\\nvalue = this.applyGuard(value, target);\\n\\n// Finalize Damage\\nvalue = Math.round(value);\\nreturn value;\"","VarianceFormulaJS:func":"\"// Declare Constants\\nconst damage = arguments[0];\\nconst variance = arguments[1];\\n\\n// Calculate Variance\\nconst amp = Math.floor(Math.max((Math.abs(damage) * variance) / 100, 0));\\nconst v = Math.randomInt(amp + 1) + Math.randomInt(amp + 1) - amp;\\n\\n// Return Damage\\nreturn damage >= 0 ? damage + v : damage - v;\"","GuardFormulaJS:func":"\"// Declare Constants\\nconst damage = arguments[0];\\nconst target = arguments[1];\\n\\n// Return Damage Early\\nconst note = this.item().note;\\nif (note.match(/<UNBLOCKABLE>/i)) return damage;\\nif (!target.isGuard()) return damage;\\nif (damage < 0) return damage;\\n\\n// Declare Guard Rate\\nlet guardRate = 0.5;\\nguardRate /= target.grd;\\n\\n// Return Damage\\nreturn damage * guardRate;\"","Critical":"","CriticalHitRateJS:func":"\"// Declare Constants\\nconst user = this.subject();\\nconst target = arguments[0];\\n\\n// Create Base Critical Rate\\nlet rate = this.subject().cri * (1 - target.cev);\\n\\n// Apply Notetags\\nconst note = this.item().note;\\nif (note.match(/<ALWAYS CRITICAL>/i)) {\\n    return 1;\\n}\\nif (note.match(/<SET CRITICAL RATE:[ ](\\\\d+)([%％])>/i)) {\\n    return Number(RegExp.$1) / 100;\\n}\\nif (note.match(/<MODIFY CRITICAL RATE:[ ](\\\\d+)([%％])>/i)) {\\n    rate *= Number(RegExp.$1) / 100;\\n}\\nif (note.match(/<MODIFY CRITICAL RATE:[ ]([\\\\+\\\\-]\\\\d+)([%％])>/i)) {\\n    rate += Number(RegExp.$1) / 100;\\n}\\nif (note.match(/<JS CRITICAL RATE>\\\\s*([\\\\s\\\\S]*)\\\\s*<\\\\/JS CRITICAL RATE>/i)) {\\n    const code = String(RegExp.$1);\\n    try {\\n        eval(code);\\n    } catch (e) {\\n        if ($gameTemp.isPlaytest()) console.log(e);\\n    }\\n}\\n\\n// Apply LUK Buffs/Debuffs\\nconst lukStack = this.subject().buff(7);\\nrate *= 2 ** lukStack;\\n\\n// Return Rate\\nreturn rate;\"","CriticalHitMultiplier:func":"\"// Declare Constants\\nconst user = this.subject();\\nlet damage = arguments[0];\\nlet multiplier = 2.0;\\nlet bonusDamage = this.subject().luk * this.subject().cri;\\n\\n// Apply Notetags\\nconst note = this.item().note;\\nif (note.match(/<MODIFY CRITICAL MULTIPLIER:[ ](\\\\d+)([%％])>/i)) {\\n    multiplier = Number(RegExp.$1) / 100;\\n}\\nif (note.match(/<MODIFY CRITICAL MULTIPLIER:[ ]([\\\\+\\\\-]\\\\d+)([%％])>/i)) {\\n    multiplier += Number(RegExp.$1) / 100;\\n}\\nif (note.match(/<MODIFY CRITICAL BONUS DAMAGE:[ ](\\\\d+)([%％])>/i)) {\\n    bonusDamage *= Number(RegExp.$1) / 100;\\n}\\nif (note.match(/<MODIFY CRITICAL BONUS DAMAGE:[ ]([\\\\+\\\\-]\\\\d+)([%％])>/i)) {\\n    bonusDamage += bonusDamage * (RegExp.$1) / 100;\\n}\\nif (note.match(/<JS CRITICAL DAMAGE>\\\\s*([\\\\s\\\\S]*)\\\\s*<\\\\/JS CRITICAL DAMAGE>/i)) {\\n    const code = String(RegExp.$1);\\n    try {\\n        eval(code);\\n    } catch (e) {\\n        if ($gameTemp.isPlaytest()) console.log(e);\\n    }\\n}\\n\\n// Return Damage\\nreturn damage * multiplier + bonusDamage;\"","DamageStyles":"","DefaultDamageStyle:str":"Standard","DamageStyleList:arraystruct":"[\"{\\\"Name:str\\\":\\\"Standard\\\",\\\"Formula:func\\\":\\\"\\\\\\\"// Declare Constants\\\\\\\\nconst user = this.subject();\\\\\\\\nconst target = arguments[0];\\\\\\\\nconst item = this.item();\\\\\\\\nconst a = this.subject();\\\\\\\\nconst b = target;\\\\\\\\nconst v = $gameVariables._data;\\\\\\\\nconst sign = [3, 4].includes(item.damage.type) ? -1 : 1;\\\\\\\\n\\\\\\\\n// Replace Formula\\\\\\\\nlet formula = item.damage.formula;\\\\\\\\nif (SceneManager.isSceneBattle() && !this.isCertainHit()) {\\\\\\\\n    const fmt = 'Math.max(this.applyArmorModifiers(b, %1), 0)';\\\\\\\\n    formula = formula.replace(/b.def/g, fmt.format('b.def'));\\\\\\\\n    formula = formula.replace(/b.mdf/g, fmt.format('b.mdf'));\\\\\\\\n    formula = formula.replace(/b.agi/g, fmt.format('b.agi'));\\\\\\\\n    formula = formula.replace(/b.luk/g, fmt.format('b.luk'));\\\\\\\\n}\\\\\\\\n\\\\\\\\n// Calculate Damage\\\\\\\\nlet value = Math.max(eval(formula), 0);\\\\\\\\n\\\\\\\\n// Return Value\\\\\\\\nreturn (isNaN(value) ? 0 : value) * sign;\\\\\\\"\\\",\\\"ItemsEquipsCore\\\":\\\"\\\",\\\"DamageType\\\":\\\"\\\",\\\"DamageType1:str\\\":\\\"%1 Damage Multiplier\\\",\\\"DamageType2:str\\\":\\\"%1 Damage Multiplier\\\",\\\"DamageType3:str\\\":\\\"%1 Recovery Multiplier\\\",\\\"DamageType4:str\\\":\\\"%1 Recovery Multiplier\\\",\\\"DamageType5:str\\\":\\\"%1 Drain Multiplier\\\",\\\"DamageType6:str\\\":\\\"%1 Drain Multiplier\\\",\\\"DamageDisplay:func\\\":\\\"\\\\\\\"return this.getItemDamageAmountTextOriginal();\\\\\\\"\\\"}\",\"{\\\"Name:str\\\":\\\"Armor Scaling\\\",\\\"Formula:func\\\":\\\"\\\\\\\"// Declare Constants\\\\\\\\nconst user = this.subject();\\\\\\\\nconst target = arguments[0];\\\\\\\\nconst item = this.item();\\\\\\\\nconst a = this.subject();\\\\\\\\nconst b = target;\\\\\\\\nconst v = $gameVariables._data;\\\\\\\\nconst sign = [3, 4].includes(item.damage.type) ? -1 : 1;\\\\\\\\n\\\\\\\\n// Replace Formula\\\\\\\\nlet formula = item.damage.formula;\\\\\\\\nif (SceneManager.isSceneBattle() && !this.isCertainHit()) {\\\\\\\\n    const fmt = 'Math.max(this.applyArmorModifiers(b, %1), 1)';\\\\\\\\n    formula = formula.replace(/b.def/g, fmt.format('b.def'));\\\\\\\\n    formula = formula.replace(/b.mdf/g, fmt.format('b.mdf'));\\\\\\\\n    formula = formula.replace(/b.agi/g, fmt.format('b.agi'));\\\\\\\\n    formula = formula.replace(/b.luk/g, fmt.format('b.luk'));\\\\\\\\n}\\\\\\\\n\\\\\\\\n// Calculate Damage\\\\\\\\nlet value = Math.max(eval(formula), 0);\\\\\\\\n\\\\\\\\n// Apply Defender's Defense Parameter\\\\\\\\nif (this.isDamage() && !this.isCertainHit()) {\\\\\\\\n\\\\\\\\n    // Calculate Base Armor\\\\\\\\n    let armor = this.isPhysical() ? b.def : b.mdf;\\\\\\\\n    armor = this.applyArmorModifiers(target, armor);\\\\\\\\n\\\\\\\\n    // Apply Armor to Damage\\\\\\\\n    if (armor >= 0) {\\\\\\\\n        value *= 100 / (100 + armor);\\\\\\\\n    } else {\\\\\\\\n        value *= 2 - (100 / (100 - armor));\\\\\\\\n    }\\\\\\\\n}\\\\\\\\n\\\\\\\\n// Return Value\\\\\\\\nreturn (isNaN(value) ? 0 : value) * sign;\\\\\\\"\\\",\\\"ItemsEquipsCore\\\":\\\"\\\",\\\"DamageType\\\":\\\"\\\",\\\"DamageType1:str\\\":\\\"%1 Damage Multiplier\\\",\\\"DamageType2:str\\\":\\\"%1 Damage Multiplier\\\",\\\"DamageType3:str\\\":\\\"%1 Recovery Multiplier\\\",\\\"DamageType4:str\\\":\\\"%1 Recovery Multiplier\\\",\\\"DamageType5:str\\\":\\\"%1 Drain Multiplier\\\",\\\"DamageType6:str\\\":\\\"%1 Drain Multiplier\\\",\\\"DamageDisplay:func\\\":\\\"\\\\\\\"return this.getItemDamageAmountTextOriginal();\\\\\\\"\\\"}\",\"{\\\"Name:str\\\":\\\"CT\\\",\\\"Formula:func\\\":\\\"\\\\\\\"// Define Constants\\\\\\\\nconst user = this.subject();\\\\\\\\nconst target = arguments[0];\\\\\\\\nconst item = this.item();\\\\\\\\nconst a = this.subject();\\\\\\\\nconst b = target;\\\\\\\\nconst v = $gameVariables._data;\\\\\\\\nconst sign = [3, 4].includes(item.damage.type) ? -1 : 1;\\\\\\\\n\\\\\\\\n// Create Multiplier\\\\\\\\nconst multiplier = Math.max(eval(item.damage.formula), 0);\\\\\\\\n\\\\\\\\n// Declare Values\\\\\\\\nlet value = 0;\\\\\\\\nlet level = Math.max(a.level || a.luk, 1);\\\\\\\\nlet armor = this.isPhysical() ? b.def : b.mdf;\\\\\\\\narmor = Math.max(this.applyArmorModifiers(target, armor), 0);\\\\\\\\nlet attackStat = 0;\\\\\\\\nif (this.isPhysical() && (this.isDamage() || this.isDrain())) {\\\\\\\\n    attackStat = a.atk;\\\\\\\\n} else if (this.isMagical() && (this.isDamage() || this.isDrain())) {\\\\\\\\n    attackStat =  a.mat;\\\\\\\\n} else if (this.isPhysical() && this.isRecover()) {\\\\\\\\n    attackStat =  a.def;\\\\\\\\n} else if (this.isMagical() && this.isRecover()) {\\\\\\\\n    attackStat =  a.mdf;\\\\\\\\n}\\\\\\\\n\\\\\\\\n// Calculate Damage\\\\\\\\nattackStat = (attackStat * 1.75) + (level ** 2 / 45.5);\\\\\\\\nvalue = attackStat * 4;\\\\\\\\nif (this.isPhysical() && (this.isDamage() || this.isDrain())) {\\\\\\\\n    value *= Math.max(256 - armor, 0) / 256;\\\\\\\\n} else if (this.isMagical() && (this.isDamage() || this.isDrain())) {\\\\\\\\n    value *= Math.max(102.4 - armor, 0) / 128;\\\\\\\\n}\\\\\\\\nvalue *= multiplier;\\\\\\\\n\\\\\\\\n// Return Value\\\\\\\\nreturn (isNaN(value) ? 0 : value) * sign;\\\\\\\"\\\",\\\"ItemsEquipsCore\\\":\\\"\\\",\\\"DamageType\\\":\\\"\\\",\\\"DamageType1:str\\\":\\\"%1 Damage Multiplier\\\",\\\"DamageType2:str\\\":\\\"%1 Damage Multiplier\\\",\\\"DamageType3:str\\\":\\\"%1 Recovery Multiplier\\\",\\\"DamageType4:str\\\":\\\"%1 Recovery Multiplier\\\",\\\"DamageType5:str\\\":\\\"%1 Drain Multiplier\\\",\\\"DamageType6:str\\\":\\\"%1 Drain Multiplier\\\",\\\"DamageDisplay:func\\\":\\\"\\\\\\\"// Define Constants\\\\\\\\nconst item = this._item;\\\\\\\\nconst formula = item.damage.formula;\\\\\\\\nconst a = this._tempActorA;\\\\\\\\nconst b = this._tempActorB;\\\\\\\\nconst user = a;\\\\\\\\nconst target = b;\\\\\\\\n\\\\\\\\n// Return Value\\\\\\\\ntry {\\\\\\\\n    const value = Math.max(eval(formula), 0);\\\\\\\\n    return '%1%'.format(Math.round(value * 100));\\\\\\\\n} catch (e) {\\\\\\\\n    if ($gameTemp.isPlaytest()) {\\\\\\\\n        console.log('Damage Formula Error for %1'.format(this._item.name));\\\\\\\\n    }\\\\\\\\n    return '?????';\\\\\\\\n}\\\\\\\"\\\"}\",\"{\\\"Name:str\\\":\\\"D4\\\",\\\"Formula:func\\\":\\\"\\\\\\\"// Define Constants\\\\\\\\nconst user = this.subject();\\\\\\\\nconst target = arguments[0];\\\\\\\\nconst item = this.item();\\\\\\\\nconst a = this.subject();\\\\\\\\nconst b = target;\\\\\\\\nconst v = $gameVariables._data;\\\\\\\\nconst sign = [3, 4].includes(item.damage.type) ? -1 : 1;\\\\\\\\n\\\\\\\\n// Create Multiplier\\\\\\\\nconst multiplier = Math.max(eval(item.damage.formula), 0);\\\\\\\\n\\\\\\\\n// Declare Values\\\\\\\\nlet armor = this.isPhysical() ? b.def : b.mdf;\\\\\\\\narmor = this.applyArmorModifiers(target, armor);\\\\\\\\nlet stat = 0;\\\\\\\\nif (this.isPhysical() && (this.isDamage() || this.isDrain())) {\\\\\\\\n    stat = a.atk;\\\\\\\\n} else if (this.isMagical() && (this.isDamage() || this.isDrain())) {\\\\\\\\n    stat = a.mat;\\\\\\\\n} else if (this.isPhysical() && this.isRecover()) {\\\\\\\\n    stat = a.def;\\\\\\\\n    armor = 0;\\\\\\\\n} else if (this.isMagical() && this.isRecover()) {\\\\\\\\n    stat = a.mdf;\\\\\\\\n    armor = 0;\\\\\\\\n}\\\\\\\\n\\\\\\\\n// Calculate Damage \\\\\\\\nlet value = 1.5 * Math.max(2 * stat * multiplier - armor, 1) * multiplier / 5;\\\\\\\\n\\\\\\\\n// Return Value\\\\\\\\nreturn (isNaN(value) ? 0 : value) * sign;\\\\\\\"\\\",\\\"ItemsEquipsCore\\\":\\\"\\\",\\\"DamageType\\\":\\\"\\\",\\\"DamageType1:str\\\":\\\"%1 Damage Multiplier\\\",\\\"DamageType2:str\\\":\\\"%1 Damage Multiplier\\\",\\\"DamageType3:str\\\":\\\"%1 Recovery Multiplier\\\",\\\"DamageType4:str\\\":\\\"%1 Recovery Multiplier\\\",\\\"DamageType5:str\\\":\\\"%1 Drain Multiplier\\\",\\\"DamageType6:str\\\":\\\"%1 Drain Multiplier\\\",\\\"DamageDisplay:func\\\":\\\"\\\\\\\"// Define Constants\\\\\\\\nconst item = this._item;\\\\\\\\nconst formula = item.damage.formula;\\\\\\\\nconst a = this._tempActorA;\\\\\\\\nconst b = this._tempActorB;\\\\\\\\nconst user = a;\\\\\\\\nconst target = b;\\\\\\\\n\\\\\\\\n// Return Value\\\\\\\\ntry {\\\\\\\\n    const value = Math.max(eval(formula), 0);\\\\\\\\n    return '%1%'.format(Math.round(value * 100));\\\\\\\\n} catch (e) {\\\\\\\\n    if ($gameTemp.isPlaytest()) {\\\\\\\\n        console.log('Damage Formula Error for %1'.format(this._item.name));\\\\\\\\n    }\\\\\\\\n    return '?????';\\\\\\\\n}\\\\\\\"\\\"}\",\"{\\\"Name:str\\\":\\\"DQ\\\",\\\"Formula:func\\\":\\\"\\\\\\\"// Define Constants\\\\\\\\nconst user = this.subject();\\\\\\\\nconst target = arguments[0];\\\\\\\\nconst item = this.item();\\\\\\\\nconst a = this.subject();\\\\\\\\nconst b = target;\\\\\\\\nconst v = $gameVariables._data;\\\\\\\\nconst sign = [3, 4].includes(item.damage.type) ? -1 : 1;\\\\\\\\n\\\\\\\\n// Create Multiplier\\\\\\\\nlet multiplier = Math.max(eval(item.damage.formula), 0);\\\\\\\\nif (this.isCertainHit()) {\\\\\\\\n    let value = multiplier * Math.max(a.atk, a.mat);\\\\\\\\n    return (isNaN(value) ? 0 : value) * sign;\\\\\\\\n}\\\\\\\\n\\\\\\\\n// Get Primary Stats\\\\\\\\nlet armor = this.isPhysical() ? b.def : b.mdf;\\\\\\\\narmor = this.applyArmorModifiers(b, armor);\\\\\\\\nlet stat = 1;\\\\\\\\nif (this.isPhysical() && (this.isDamage() || this.isDrain())) {\\\\\\\\n    stat = a.atk;\\\\\\\\n} else if (this.isMagical() && (this.isDamage() || this.isDrain())) {\\\\\\\\n    stat = a.mat;\\\\\\\\n} else if (this.isPhysical() && this.isRecover()) {\\\\\\\\n    stat = a.def;\\\\\\\\n} else if (this.isMagical() && this.isRecover()) {\\\\\\\\n    stat = a.mdf;\\\\\\\\n}\\\\\\\\n\\\\\\\\n// Check for Recovery\\\\\\\\nif (this.isRecover()) {\\\\\\\\n    let value = stat * multiplier * sign;\\\\\\\\n    return isNaN(value) ? 0 : value;\\\\\\\\n}\\\\\\\\n\\\\\\\\n// Calculate Damage\\\\\\\\nlet value = 0;\\\\\\\\nif (stat < ((2 + armor) / 2)) {\\\\\\\\n    // Plink Damage\\\\\\\\n    let baseline = Math.max(stat - ((12 * (armor - stat + 1)) / stat), 5);\\\\\\\\n    value = baseline / 3;\\\\\\\\n} else {\\\\\\\\n    // Normal Damage\\\\\\\\n    let baseline = Math.max(stat - (armor / 2), 1);\\\\\\\\n    value = baseline / 2;\\\\\\\\n}\\\\\\\\nvalue *= multiplier;\\\\\\\\n\\\\\\\\n// Return Value\\\\\\\\nreturn isNaN(value) ? 0 : value;\\\\\\\"\\\",\\\"ItemsEquipsCore\\\":\\\"\\\",\\\"DamageType\\\":\\\"\\\",\\\"DamageType1:str\\\":\\\"%1 Damage Multiplier\\\",\\\"DamageType2:str\\\":\\\"%1 Damage Multiplier\\\",\\\"DamageType3:str\\\":\\\"%1 Recovery Multiplier\\\",\\\"DamageType4:str\\\":\\\"%1 Recovery Multiplier\\\",\\\"DamageType5:str\\\":\\\"%1 Drain Multiplier\\\",\\\"DamageType6:str\\\":\\\"%1 Drain Multiplier\\\",\\\"DamageDisplay:func\\\":\\\"\\\\\\\"// Define Constants\\\\\\\\nconst item = this._item;\\\\\\\\nconst formula = item.damage.formula;\\\\\\\\nconst a = this._tempActorA;\\\\\\\\nconst b = this._tempActorB;\\\\\\\\nconst user = a;\\\\\\\\nconst target = b;\\\\\\\\n\\\\\\\\n// Return Value\\\\\\\\ntry {\\\\\\\\n    const value = Math.max(eval(formula), 0);\\\\\\\\n    return '%1%'.format(Math.round(value * 100));\\\\\\\\n} catch (e) {\\\\\\\\n    if ($gameTemp.isPlaytest()) {\\\\\\\\n        console.log('Damage Formula Error for %1'.format(this._item.name));\\\\\\\\n    }\\\\\\\\n    return '?????';\\\\\\\\n}\\\\\\\"\\\"}\",\"{\\\"Name:str\\\":\\\"FF7\\\",\\\"Formula:func\\\":\\\"\\\\\\\"// Define Constants\\\\\\\\nconst user = this.subject();\\\\\\\\nconst target = arguments[0];\\\\\\\\nconst item = this.item();\\\\\\\\nconst a = this.subject();\\\\\\\\nconst b = target;\\\\\\\\nconst v = $gameVariables._data;\\\\\\\\nconst sign = [3, 4].includes(item.damage.type) ? -1 : 1;\\\\\\\\n\\\\\\\\n// Create Power\\\\\\\\nconst power = Math.max(eval(item.damage.formula), 0);\\\\\\\\n\\\\\\\\n// Declare base Damage\\\\\\\\nlet baseDamage = 0;\\\\\\\\nlet level = Math.max(a.level || a.luk, 1);\\\\\\\\nif (this.isPhysical() && (this.isDamage() || this.isDrain())) {\\\\\\\\n    baseDamage = a.atk + ((a.atk + level) / 32) * ((a.atk * level) / 32);\\\\\\\\n} else if (this.isMagical() && (this.isDamage() || this.isDrain())) {\\\\\\\\n    baseDamage = 6 * (a.mat + level);\\\\\\\\n} else if (this.isPhysical() && this.isRecover()) {\\\\\\\\n    baseDamage = 6 * (a.def + level);\\\\\\\\n} else if (this.isMagical() && this.isRecover()) {\\\\\\\\n    baseDamage = 6 * (a.mdf + level);\\\\\\\\n}\\\\\\\\n\\\\\\\\n// Calculate Final Damage\\\\\\\\nlet value = baseDamage;\\\\\\\\nlet armor = this.isPhysical() ? b.def : b.mdf;\\\\\\\\narmor = this.applyArmorModifiers(target, armor);\\\\\\\\nif (this.isRecover()) {\\\\\\\\n    value += 22 * power;\\\\\\\\n} else {\\\\\\\\n    value = (power * Math.max(512 - armor, 1) * baseDamage) / (16 * 512);\\\\\\\\n}\\\\\\\\n\\\\\\\\n// Return Value\\\\\\\\nreturn (isNaN(value) ? 0 : value) * sign;\\\\\\\"\\\",\\\"ItemsEquipsCore\\\":\\\"\\\",\\\"DamageType\\\":\\\"\\\",\\\"DamageType1:str\\\":\\\"%1 Damage Power\\\",\\\"DamageType2:str\\\":\\\"%1 Damage Power\\\",\\\"DamageType3:str\\\":\\\"%1 Recovery Power\\\",\\\"DamageType4:str\\\":\\\"%1 Recovery Power\\\",\\\"DamageType5:str\\\":\\\"%1 Drain Power\\\",\\\"DamageType6:str\\\":\\\"%1 Drain Power\\\",\\\"DamageDisplay:func\\\":\\\"\\\\\\\"// Define Constants\\\\\\\\nconst item = this._item;\\\\\\\\nconst formula = item.damage.formula;\\\\\\\\nconst a = this._tempActorA;\\\\\\\\nconst b = this._tempActorB;\\\\\\\\nconst user = a;\\\\\\\\nconst target = b;\\\\\\\\n\\\\\\\\n// Return Value\\\\\\\\ntry {\\\\\\\\n    return formula;\\\\\\\\n} catch (e) {\\\\\\\\n    if ($gameTemp.isPlaytest()) {\\\\\\\\n        console.log('Damage Formula Error for %1'.format(this._item.name));\\\\\\\\n    }\\\\\\\\n    return '?????';\\\\\\\\n}\\\\\\\"\\\"}\",\"{\\\"Name:str\\\":\\\"FF8\\\",\\\"Formula:func\\\":\\\"\\\\\\\"// Define Constants\\\\\\\\nconst user = this.subject();\\\\\\\\nconst target = arguments[0];\\\\\\\\nconst item = this.item();\\\\\\\\nconst a = this.subject();\\\\\\\\nconst b = target;\\\\\\\\nconst v = $gameVariables._data;\\\\\\\\nconst sign = [3, 4].includes(item.damage.type) ? -1 : 1;\\\\\\\\n\\\\\\\\n// Create Power\\\\\\\\nconst power = Math.max(eval(item.damage.formula), 0);\\\\\\\\n\\\\\\\\n// Declare Damage\\\\\\\\nlet Value = 0;\\\\\\\\nlet level = Math.max(a.level || a.luk, 1);\\\\\\\\nlet armor = this.isPhysical() ? b.def : b.mdf;\\\\\\\\narmor = this.applyArmorModifiers(target, armor);\\\\\\\\nif (this.isPhysical() && (this.isDamage() || this.isDrain())) {\\\\\\\\n    value = a.atk ** 2 / 16 + a.atk;\\\\\\\\n    value *= Math.max(265 - armor, 1) / 256;\\\\\\\\n    value *= power / 16;\\\\\\\\n} else if (this.isMagical() && (this.isDamage() || this.isDrain())) {\\\\\\\\n    value = a.mat + power;\\\\\\\\n    value *= Math.max(265 - armor, 1) / 4;\\\\\\\\n    value *= power / 256;\\\\\\\\n} else if (this.isPhysical() && this.isRecover()) {\\\\\\\\n    value = (power + a.def) * power / 2;\\\\\\\\n} else if (this.isMagical() && this.isRecover()) {\\\\\\\\n    value = (power + a.mdf) * power / 2;\\\\\\\\n}\\\\\\\\n\\\\\\\\n// Return Value\\\\\\\\nreturn (isNaN(value) ? 0 : value) * sign;\\\\\\\"\\\",\\\"ItemsEquipsCore\\\":\\\"\\\",\\\"DamageType\\\":\\\"\\\",\\\"DamageType1:str\\\":\\\"%1 Damage Power\\\",\\\"DamageType2:str\\\":\\\"%1 Damage Power\\\",\\\"DamageType3:str\\\":\\\"%1 Recovery Power\\\",\\\"DamageType4:str\\\":\\\"%1 Recovery Power\\\",\\\"DamageType5:str\\\":\\\"%1 Drain Power\\\",\\\"DamageType6:str\\\":\\\"%1 Drain Power\\\",\\\"DamageDisplay:func\\\":\\\"\\\\\\\"// Define Constants\\\\\\\\nconst item = this._item;\\\\\\\\nconst formula = item.damage.formula;\\\\\\\\nconst a = this._tempActorA;\\\\\\\\nconst b = this._tempActorB;\\\\\\\\nconst user = a;\\\\\\\\nconst target = b;\\\\\\\\n\\\\\\\\n// Return Value\\\\\\\\ntry {\\\\\\\\n    return formula;\\\\\\\\n} catch (e) {\\\\\\\\n    if ($gameTemp.isPlaytest()) {\\\\\\\\n        console.log('Damage Formula Error for %1'.format(this._item.name));\\\\\\\\n    }\\\\\\\\n    return '?????';\\\\\\\\n}\\\\\\\"\\\"}\",\"{\\\"Name:str\\\":\\\"FF9\\\",\\\"Formula:func\\\":\\\"\\\\\\\"// Define Constants\\\\\\\\nconst user = this.subject();\\\\\\\\nconst target = arguments[0];\\\\\\\\nconst item = this.item();\\\\\\\\nconst a = this.subject();\\\\\\\\nconst b = target;\\\\\\\\nconst v = $gameVariables._data;\\\\\\\\nconst sign = [3, 4].includes(item.damage.type) ? -1 : 1;\\\\\\\\n\\\\\\\\n// Create Damage Constant\\\\\\\\nconst power = Math.max(eval(item.damage.formula), 0);\\\\\\\\nif (this.isCertainHit()) {\\\\\\\\n    return (isNaN(power) ? 0 : power) * sign;\\\\\\\\n}\\\\\\\\n\\\\\\\\n// Declare Main Stats\\\\\\\\nlet armor = this.isPhysical() ? b.def : b.mdf;\\\\\\\\narmor = this.applyArmorModifiers(b, armor);\\\\\\\\nlet stat = 1;\\\\\\\\nif (this.isPhysical() && (this.isDamage() || this.isDrain())) {\\\\\\\\n    stat = a.atk;\\\\\\\\n} else if (this.isMagical() && (this.isDamage() || this.isDrain())) {\\\\\\\\n    stat = a.mat;\\\\\\\\n} else if (this.isPhysical() && this.isRecover()) {\\\\\\\\n    stat = a.def;\\\\\\\\n} else if (this.isMagical() && this.isRecover()) {\\\\\\\\n    stat = a.mdf;\\\\\\\\n}\\\\\\\\n\\\\\\\\n// Declare Base Damage\\\\\\\\nlet baseDamage = power;\\\\\\\\nif (this.isPhysical()) {\\\\\\\\n    baseDamage += stat;\\\\\\\\n}\\\\\\\\nif (this.isDamage() || this.isDrain()) {\\\\\\\\n    baseDamage -= armor;\\\\\\\\n    baseDamage = Math.max(1, baseDamage);\\\\\\\\n}\\\\\\\\n\\\\\\\\n// Declare Bonus Damage\\\\\\\\nlet bonusDamage = stat + (((a.level || a.luk) + stat) / 8);\\\\\\\\n\\\\\\\\n// Declare Final Damage\\\\\\\\nlet value = baseDamage * bonusDamage * sign;\\\\\\\\n\\\\\\\\n// Return Value\\\\\\\\nreturn isNaN(value) ? 0 : value;\\\\\\\"\\\",\\\"ItemsEquipsCore\\\":\\\"\\\",\\\"DamageType\\\":\\\"\\\",\\\"DamageType1:str\\\":\\\"%1 Damage Power\\\",\\\"DamageType2:str\\\":\\\"%1 Damage Power\\\",\\\"DamageType3:str\\\":\\\"%1 Recovery Power\\\",\\\"DamageType4:str\\\":\\\"%1 Recovery Power\\\",\\\"DamageType5:str\\\":\\\"%1 Drain Power\\\",\\\"DamageType6:str\\\":\\\"%1 Drain Power\\\",\\\"DamageDisplay:func\\\":\\\"\\\\\\\"// Define Constants\\\\\\\\nconst item = this._item;\\\\\\\\nconst formula = item.damage.formula;\\\\\\\\nconst a = this._tempActorA;\\\\\\\\nconst b = this._tempActorB;\\\\\\\\nconst user = a;\\\\\\\\nconst target = b;\\\\\\\\n\\\\\\\\n// Return Value\\\\\\\\ntry {\\\\\\\\n    return formula;\\\\\\\\n} catch (e) {\\\\\\\\n    if ($gameTemp.isPlaytest()) {\\\\\\\\n        console.log('Damage Formula Error for %1'.format(this._item.name));\\\\\\\\n    }\\\\\\\\n    return '?????';\\\\\\\\n}\\\\\\\"\\\"}\",\"{\\\"Name:str\\\":\\\"FF10\\\",\\\"Formula:func\\\":\\\"\\\\\\\"// Define Constants\\\\\\\\nconst user = this.subject();\\\\\\\\nconst target = arguments[0];\\\\\\\\nconst item = this.item();\\\\\\\\nconst a = this.subject();\\\\\\\\nconst b = target;\\\\\\\\nconst v = $gameVariables._data;\\\\\\\\nconst sign = [3, 4].includes(item.damage.type) ? -1 : 1;\\\\\\\\n\\\\\\\\n// Create Damage Constant\\\\\\\\nconst power = Math.max(eval(item.damage.formula), 0);\\\\\\\\nif (this.isCertainHit()) {\\\\\\\\n    return (isNaN(power) ? 0 : power) * sign;\\\\\\\\n}\\\\\\\\n\\\\\\\\n// Create Damage Offense Value\\\\\\\\nlet value = power;\\\\\\\\n\\\\\\\\nif (this.isPhysical() && (this.isDamage() || this.isDrain())) {\\\\\\\\n    value = (((a.atk ** 3) / 32) + 32) * power / 16;\\\\\\\\n} else if (this.isMagical() && (this.isDamage() || this.isDrain())) {\\\\\\\\n    value = power * ((a.mat ** 2 / 6) + power) / 4;\\\\\\\\n} else if (this.isPhysical() && this.isRecover()) {\\\\\\\\n    value = power * ((a.def + power) / 2);\\\\\\\\n} else if (this.isMagical() && this.isRecover()) {\\\\\\\\n    value = power * ((a.mdf + power) / 2);\\\\\\\\n}\\\\\\\\n\\\\\\\\n// Apply Damage Defense Value\\\\\\\\nif (this.isDamage() || this.isDrain()) {\\\\\\\\n    let armor = this.isPhysical() ? b.def : b.mdf;\\\\\\\\n    armor = this.applyArmorModifiers(b, armor);\\\\\\\\n    armor = Math.max(armor, 1);\\\\\\\\n    value *= ((((armor - 280.4) ** 2) / 110) / 16) / 730;\\\\\\\\n    value *= (730 - (armor * 51 - (armor ** 2) / 11) / 10) / 730;\\\\\\\\n} else if (this.isRecover()) {\\\\\\\\n    value *= -1;\\\\\\\\n}\\\\\\\\n\\\\\\\\n// Return Value\\\\\\\\nreturn isNaN(value) ? 0 : value;\\\\\\\"\\\",\\\"ItemsEquipsCore\\\":\\\"\\\",\\\"DamageType\\\":\\\"\\\",\\\"DamageType1:str\\\":\\\"%1 Damage Power\\\",\\\"DamageType2:str\\\":\\\"%1 Damage Power\\\",\\\"DamageType3:str\\\":\\\"%1 Recovery Power\\\",\\\"DamageType4:str\\\":\\\"%1 Recovery Power\\\",\\\"DamageType5:str\\\":\\\"%1 Drain Power\\\",\\\"DamageType6:str\\\":\\\"%1 Drain Power\\\",\\\"DamageDisplay:func\\\":\\\"\\\\\\\"// Define Constants\\\\\\\\nconst item = this._item;\\\\\\\\nconst formula = item.damage.formula;\\\\\\\\nconst a = this._tempActorA;\\\\\\\\nconst b = this._tempActorB;\\\\\\\\nconst user = a;\\\\\\\\nconst target = b;\\\\\\\\n\\\\\\\\n// Return Value\\\\\\\\ntry {\\\\\\\\n    return formula;\\\\\\\\n} catch (e) {\\\\\\\\n    if ($gameTemp.isPlaytest()) {\\\\\\\\n        console.log('Damage Formula Error for %1'.format(this._item.name));\\\\\\\\n    }\\\\\\\\n    return '?????';\\\\\\\\n}\\\\\\\"\\\"}\",\"{\\\"Name:str\\\":\\\"MK\\\",\\\"Formula:func\\\":\\\"\\\\\\\"// Define Constants\\\\\\\\nconst user = this.subject();\\\\\\\\nconst target = arguments[0];\\\\\\\\nconst item = this.item();\\\\\\\\nconst a = this.subject();\\\\\\\\nconst b = target;\\\\\\\\nconst v = $gameVariables._data;\\\\\\\\nconst sign = [3, 4].includes(item.damage.type) ? -1 : 1;\\\\\\\\n\\\\\\\\n// Create Multiplier\\\\\\\\nconst multiplier = Math.max(eval(item.damage.formula), 0);\\\\\\\\n\\\\\\\\n// Declare Values\\\\\\\\nlet armor = this.isPhysical() ? b.def : b.mdf;\\\\\\\\narmor = this.applyArmorModifiers(target, armor);\\\\\\\\nconst denominator = Math.max(200 + armor, 1);\\\\\\\\n\\\\\\\\n// Calculate Damage \\\\\\\\nlet value = 0;\\\\\\\\nif (this.isPhysical() && (this.isDamage() || this.isDrain())) {\\\\\\\\n    value = 200 * a.atk / denominator;\\\\\\\\n} else if (this.isMagical() && (this.isDamage() || this.isDrain())) {\\\\\\\\n    value = 200 * a.mat / denominator;\\\\\\\\n} else if (this.isPhysical() && this.isRecover()) {\\\\\\\\n    value = 200 * a.def / 200;\\\\\\\\n} else if (this.isMagical() && this.isRecover()) {\\\\\\\\n    value = 200 * a.mdf / 200;\\\\\\\\n}\\\\\\\\nvalue *= multiplier;\\\\\\\\n\\\\\\\\n// Return Value\\\\\\\\nreturn (isNaN(value) ? 0 : value) * sign;\\\\\\\"\\\",\\\"ItemsEquipsCore\\\":\\\"\\\",\\\"DamageType\\\":\\\"\\\",\\\"DamageType1:str\\\":\\\"%1 Damage Multiplier\\\",\\\"DamageType2:str\\\":\\\"%1 Damage Multiplier\\\",\\\"DamageType3:str\\\":\\\"%1 Recovery Multiplier\\\",\\\"DamageType4:str\\\":\\\"%1 Recovery Multiplier\\\",\\\"DamageType5:str\\\":\\\"%1 Drain Multiplier\\\",\\\"DamageType6:str\\\":\\\"%1 Drain Multiplier\\\",\\\"DamageDisplay:func\\\":\\\"\\\\\\\"// Define Constants\\\\\\\\nconst item = this._item;\\\\\\\\nconst formula = item.damage.formula;\\\\\\\\nconst a = this._tempActorA;\\\\\\\\nconst b = this._tempActorB;\\\\\\\\nconst user = a;\\\\\\\\nconst target = b;\\\\\\\\n\\\\\\\\n// Return Value\\\\\\\\ntry {\\\\\\\\n    const value = Math.max(eval(formula), 0);\\\\\\\\n    return '%1%'.format(Math.round(value * 100));\\\\\\\\n} catch (e) {\\\\\\\\n    if ($gameTemp.isPlaytest()) {\\\\\\\\n        console.log('Damage Formula Error for %1'.format(this._item.name));\\\\\\\\n    }\\\\\\\\n    return '?????';\\\\\\\\n}\\\\\\\"\\\"}\",\"{\\\"Name:str\\\":\\\"MOBA\\\",\\\"Formula:func\\\":\\\"\\\\\\\"// Define Constants\\\\\\\\nconst user = this.subject();\\\\\\\\nconst target = arguments[0];\\\\\\\\nconst item = this.item();\\\\\\\\nconst a = this.subject();\\\\\\\\nconst b = target;\\\\\\\\nconst v = $gameVariables._data;\\\\\\\\nconst sign = [3, 4].includes(item.damage.type) ? -1 : 1;\\\\\\\\n\\\\\\\\n// Create Damage Value\\\\\\\\nlet value = Math.max(eval(item.damage.formula), 0) * sign;\\\\\\\\n\\\\\\\\n// Apply Attacker's Offense Parameter\\\\\\\\nif (this.isPhysical() && (this.isDamage() || this.isDrain())) {\\\\\\\\n    value *= a.atk;\\\\\\\\n} else if (this.isMagical() && (this.isDamage() || this.isDrain())) {\\\\\\\\n    value *= a.mat;\\\\\\\\n} else if (this.isPhysical() && this.isRecover()) {\\\\\\\\n    value *= a.def;\\\\\\\\n} else if (this.isMagical() && this.isRecover()) {\\\\\\\\n    value *= a.mdf;\\\\\\\\n}\\\\\\\\n\\\\\\\\n// Apply Defender's Defense Parameter\\\\\\\\nif (this.isDamage() && !this.isCertainHit()) {\\\\\\\\n\\\\\\\\n    // Calculate Base Armor\\\\\\\\n    let armor = this.isPhysical() ? b.def : b.mdf;\\\\\\\\n    armor = this.applyArmorModifiers(target, armor);\\\\\\\\n\\\\\\\\n    // Apply Armor to Damage\\\\\\\\n    if (armor >= 0) {\\\\\\\\n        value *= 100 / (100 + armor);\\\\\\\\n    } else {\\\\\\\\n        value *= 2 - (100 / (100 - armor));\\\\\\\\n    }\\\\\\\\n}\\\\\\\\n\\\\\\\\n// Return Value\\\\\\\\nreturn isNaN(value) ? 0 : value;\\\\\\\"\\\",\\\"ItemsEquipsCore\\\":\\\"\\\",\\\"DamageType\\\":\\\"\\\",\\\"DamageType1:str\\\":\\\"%1 Damage Multiplier\\\",\\\"DamageType2:str\\\":\\\"%1 Damage Multiplier\\\",\\\"DamageType3:str\\\":\\\"%1 Recovery Multiplier\\\",\\\"DamageType4:str\\\":\\\"%1 Recovery Multiplier\\\",\\\"DamageType5:str\\\":\\\"%1 Drain Multiplier\\\",\\\"DamageType6:str\\\":\\\"%1 Drain Multiplier\\\",\\\"DamageDisplay:func\\\":\\\"\\\\\\\"// Define Constants\\\\\\\\nconst item = this._item;\\\\\\\\nconst formula = item.damage.formula;\\\\\\\\nconst a = this._tempActorA;\\\\\\\\nconst b = this._tempActorB;\\\\\\\\nconst user = a;\\\\\\\\nconst target = b;\\\\\\\\n\\\\\\\\n// Return Value\\\\\\\\ntry {\\\\\\\\n    const value = Math.max(eval(formula), 0);\\\\\\\\n    return '%1%'.format(Math.round(value * 100));\\\\\\\\n} catch (e) {\\\\\\\\n    if ($gameTemp.isPlaytest()) {\\\\\\\\n        console.log('Damage Formula Error for %1'.format(this._item.name));\\\\\\\\n    }\\\\\\\\n    return '?????';\\\\\\\\n}\\\\\\\"\\\"}\",\"{\\\"Name:str\\\":\\\"PKMN\\\",\\\"Formula:func\\\":\\\"\\\\\\\"// Define Constants\\\\\\\\nconst user = this.subject();\\\\\\\\nconst target = arguments[0];\\\\\\\\nconst item = this.item();\\\\\\\\nconst a = this.subject();\\\\\\\\nconst b = target;\\\\\\\\nconst v = $gameVariables._data;\\\\\\\\nconst sign = [3, 4].includes(item.damage.type) ? -1 : 1;\\\\\\\\n\\\\\\\\n// Create Power\\\\\\\\nconst power = Math.max(eval(item.damage.formula), 0);\\\\\\\\n\\\\\\\\n// Declare Values\\\\\\\\nlet value = 0;\\\\\\\\nlet level = Math.max(a.level || a.luk, 1);\\\\\\\\nlet armor = this.isPhysical() ? b.def : b.mdf;\\\\\\\\narmor = Math.max(this.applyArmorModifiers(target, armor), 0);\\\\\\\\nlet attackStat = 0;\\\\\\\\nif (this.isPhysical() && (this.isDamage() || this.isDrain())) {\\\\\\\\n    attackStat = a.atk;\\\\\\\\n} else if (this.isMagical() && (this.isDamage() || this.isDrain())) {\\\\\\\\n    attackStat =  a.mat;\\\\\\\\n} else if (this.isPhysical() && this.isRecover()) {\\\\\\\\n    attackStat =  a.def;\\\\\\\\n} else if (this.isMagical() && this.isRecover()) {\\\\\\\\n    attackStat =  a.mdf;\\\\\\\\n}\\\\\\\\n\\\\\\\\n// Calculate Damage\\\\\\\\nvalue = (((((2 * level) / 5) + 2) * power * (attackStat / armor)) / 50) + 2;\\\\\\\\n\\\\\\\\n// Return Value\\\\\\\\nreturn (isNaN(value) ? 0 : value) * sign;\\\\\\\"\\\",\\\"ItemsEquipsCore\\\":\\\"\\\",\\\"DamageType\\\":\\\"\\\",\\\"DamageType1:str\\\":\\\"%1 Damage Power\\\",\\\"DamageType2:str\\\":\\\"%1 Damage Power\\\",\\\"DamageType3:str\\\":\\\"%1 Recovery Power\\\",\\\"DamageType4:str\\\":\\\"%1 Recovery Power\\\",\\\"DamageType5:str\\\":\\\"%1 Drain Power\\\",\\\"DamageType6:str\\\":\\\"%1 Drain Power\\\",\\\"DamageDisplay:func\\\":\\\"\\\\\\\"// Define Constants\\\\\\\\nconst item = this._item;\\\\\\\\nconst formula = item.damage.formula;\\\\\\\\nconst a = this._tempActorA;\\\\\\\\nconst b = this._tempActorB;\\\\\\\\nconst user = a;\\\\\\\\nconst target = b;\\\\\\\\n\\\\\\\\n// Return Value\\\\\\\\ntry {\\\\\\\\n    return formula;\\\\\\\\n} catch (e) {\\\\\\\\n    if ($gameTemp.isPlaytest()) {\\\\\\\\n        console.log('Damage Formula Error for %1'.format(this._item.name));\\\\\\\\n    }\\\\\\\\n    return '?????';\\\\\\\\n}\\\\\\\"\\\"}\"]"}
 *
 * @param Mechanics:struct
 * @text Mechanics Settings
 * @type struct<Mechanics>
 * @desc Settings pertaining to damage calculations.
 * @default {"ActionSpeed":"","AllowRandomSpeed:eval":"false","CalcActionSpeedJS:func":"\"// Declare Constants\\nconst agi = this.subject().agi;\\n\\n// Create Speed\\nlet speed = agi;\\nif (this.allowRandomSpeed()) {\\n    speed += Math.randomInt(Math.floor(5 + agi / 4));\\n}\\nif (this.item()) {\\n    speed += this.item().speed;\\n}\\nif (this.isAttack()) {\\n    speed += this.subject().attackSpeed();\\n}\\n\\n// Return Speed\\nreturn speed;\"","BaseTroop":"","BaseTroopIDs:arraynum":"[\"1\"]","CommonEvents":"","BattleStartEvent:num":"0","BattleEndEvent:num":"0","VictoryEvent:num":"0","DefeatEvent:num":"0","EscapeSuccessEvent:num":"0","EscapeFailEvent:num":"0","Escape":"","CalcEscapeRatioJS:func":"\"// Calculate Escape Ratio\\nlet ratio = 0.5;\\nratio *= $gameParty.agility();\\nratio /= $gameTroop.agility();\\n\\n// Return Ratio\\nreturn ratio;\"","CalcEscapeRaiseJS:func":"\"// Calculate Escape Ratio\\nlet value = 0.1;\\nvalue += $gameParty.aliveMembers().length;\\n\\n// Return Value\\nreturn value;\"","BattleJS":"","PreStartBattleJS:func":"\"// Declare Constants\\nconst user = this;\\nconst target = user;\\nconst a = user;\\nconst b = user;\\n\\n// Perform Actions\\n\"","PostStartBattleJS:func":"\"// Declare Constants\\nconst user = this;\\nconst target = user;\\nconst a = user;\\nconst b = user;\\n\\n// Perform Actions\\n\"","BattleVictoryJS:func":"\"// Declare Constants\\nconst user = this;\\nconst target = user;\\nconst a = user;\\nconst b = user;\\n\\n// Perform Actions\\n\"","EscapeSuccessJS:func":"\"// Declare Constants\\nconst user = this;\\nconst target = user;\\nconst a = user;\\nconst b = user;\\n\\n// Perform Actions\\n\"","EscapeFailureJS:func":"\"// Declare Constants\\nconst user = this;\\nconst target = user;\\nconst a = user;\\nconst b = user;\\n\\n// Perform Actions\\n\"","BattleDefeatJS:func":"\"// Declare Constants\\nconst user = this;\\nconst target = user;\\nconst a = user;\\nconst b = user;\\n\\n// Perform Actions\\n\"","PreEndBattleJS:func":"\"// Declare Constants\\nconst user = this;\\nconst target = user;\\nconst a = user;\\nconst b = user;\\n\\n// Perform Actions\\n\"","PostEndBattleJS:func":"\"// Declare Constants\\nconst user = this;\\nconst target = user;\\nconst a = user;\\nconst b = user;\\n\\n// Perform Actions\\n\"","TurnJS":"","PreStartTurnJS:func":"\"// Declare Constants\\nconst user = this;\\nconst target = user;\\nconst a = user;\\nconst b = user;\\n\\n// Perform Actions\\n\"","PostStartTurnJS:func":"\"// Declare Constants\\nconst user = this;\\nconst target = user;\\nconst a = user;\\nconst b = user;\\n\\n// Perform Actions\\n\"","PreEndTurnJS:func":"\"// Declare Constants\\nconst user = this;\\nconst target = user;\\nconst a = user;\\nconst b = user;\\n\\n// Perform Actions\\n\"","PostEndTurnJS:func":"\"// Declare Constants\\nconst user = this;\\nconst target = user;\\nconst a = user;\\nconst b = user;\\n\\n// Perform Actions\\n\"","PreRegenerateJS:func":"\"// Declare Constants\\nconst user = this;\\nconst target = user;\\nconst a = user;\\nconst b = user;\\n\\n// Perform Actions\\n\"","PostRegenerateJS:func":"\"// Declare Constants\\nconst user = this;\\nconst target = user;\\nconst a = user;\\nconst b = user;\\n\\n// Perform Actions\\n\"","ActionJS":"","PreStartActionJS:func":"\"// Declare Constants\\nconst value = arguments[0];\\nconst user = this.subject();\\nconst target = user;\\nconst a = user;\\nconst b = user;\\nconst action = this;\\nconst item = this.item();\\nconst skill = this.item();\\n\\n// Perform Actions\\n\"","PostStartActionJS:func":"\"// Declare Constants\\nconst value = arguments[0];\\nconst user = this.subject();\\nconst target = user;\\nconst a = user;\\nconst b = user;\\nconst action = this;\\nconst item = this.item();\\nconst skill = this.item();\\n\\n// Perform Actions\\n\"","PreApplyJS:func":"\"// Declare Constants\\nconst value = arguments[0];\\nconst target = arguments[1];\\nconst user = this.subject();\\nconst a = user;\\nconst b = target;\\nconst action = this;\\nconst item = this.item();\\nconst skill = this.item();\\n\\n// Perform Actions\\n\\n// Return Value\\nreturn value;\"","PreDamageJS:func":"\"// Declare Constants\\nconst value = arguments[0];\\nconst target = arguments[1];\\nconst user = this.subject();\\nconst a = user;\\nconst b = target;\\nconst action = this;\\nconst item = this.item();\\nconst skill = this.item();\\n\\n// Perform Actions\\n\\n// Return Value\\nreturn value;\"","PostDamageJS:func":"\"// Declare Constants\\nconst value = arguments[0];\\nconst target = arguments[1];\\nconst user = this.subject();\\nconst a = user;\\nconst b = target;\\nconst action = this;\\nconst item = this.item();\\nconst skill = this.item();\\n\\n// Perform Actions\\n\\n// Return Value\\nreturn value;\"","PostApplyJS:func":"\"// Declare Constants\\nconst value = arguments[0];\\nconst target = arguments[1];\\nconst user = this.subject();\\nconst a = user;\\nconst b = target;\\nconst action = this;\\nconst item = this.item();\\nconst skill = this.item();\\n\\n// Perform Actions\\n\\n// Return Value\\nreturn value;\"","PreEndActionJS:func":"\"// Declare Constants\\nconst value = arguments[0];\\nconst user = this.subject();\\nconst target = user;\\nconst a = user;\\nconst b = user;\\nconst action = this;\\nconst item = this.item();\\nconst skill = this.item();\\n\\n// Perform Actions\\n\"","PostEndActionJS:func":"\"// Declare Constants\\nconst value = arguments[0];\\nconst user = this.subject();\\nconst target = user;\\nconst a = user;\\nconst b = user;\\nconst action = this;\\nconst item = this.item();\\nconst skill = this.item();\\n\\n// Perform Actions\\n\""}
 *
 * @param CmdWindows
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param BattleLayout:struct
 * @text Battle Layout Settings
 * @type struct<BattleLayout>
 * @desc Settings that adjust how the battle layout appears.
 * @default {"Style:str":"default","ListStyle":"","ShowFacesListStyle:eval":"true","CommandWidth:num":"192","XPStyle":"","XPActorCommandLines:num":"4","XPActorDefaultHeight:num":"64","XPSpriteYLocation:str":"name","PotraitStyle":"","ShowPortraits:eval":"true","PortraitScale:num":"0.5","BorderStyle":"","SkillItemBorderCols:num":"1","ShowPortraitsBorderStyle:eval":"true","PortraitScaleBorderStyle:num":"1.25","SkillItemWindows":"","SkillItemMiddleLayout:eval":"false","SkillItemStandardCols:num":"2"}
 *
 * @param BattleLog:struct
 * @text Battle Log Settings
 * @type struct<BattleLog>
 * @desc Settings that adjust how Window_BattleLog behaves.
 * @default {"General":"","BackColor:str":"#000000","MaxLines:num":"10","MessageWait:num":"16","TextAlign:str":"center","BattleLogRectJS:func":"\"const wx = 0;\\nconst wy = 0;\\nconst ww = Graphics.boxWidth;\\nconst wh = this.calcWindowHeight(10, false);\\nreturn new Rectangle(wx, wy, ww, wh);\"","StartTurn":"","StartTurnShow:eval":"true","StartTurnMsg:str":"Turn %1","StartTurnWait:num":"40","DisplayAction":"","ActionCenteredName:eval":"true","ActionSkillMsg1:eval":"false","ActionSkillMsg2:eval":"true","ActionItemMsg:eval":"false","ActionChanges":"","ShowCounter:eval":"true","ShowReflect:eval":"true","ShowSubstitute:eval":"true","ActionResults":"","ShowFailure:eval":"false","ShowCritical:eval":"false","ShowMissEvasion:eval":"false","ShowHpDmg:eval":"false","ShowMpDmg:eval":"false","ShowTpDmg:eval":"false","DisplayStates":"","ShowAddedState:eval":"false","ShowRemovedState:eval":"false","ShowCurrentState:eval":"false","ShowAddedBuff:eval":"false","ShowAddedDebuff:eval":"false","ShowRemovedBuff:eval":"false"}
 *
 * @param Battleback:struct
 * @text Battleback Scaling
 * @type struct<Battleback>
 * @desc Settings that adjust how battlebacks scale.
 * @default {"DefaultStyle:str":"MZ","jsOneForOne:func":"\"// Adjust Size\\nthis.width = Graphics.width;\\nthis.height = Graphics.height;\\n\\n// Adjust Scale\\nconst scale = 1.0;\\nthis.scale.x = scale;\\nthis.scale.y = scale;\\n\\n// Adjust Coordinates\\nthis.x = 0;\\nthis.y = 0;\"","jsScaleToFit:func":"\"// Adjust Size\\nthis.width = Graphics.width;\\nthis.height = Graphics.height;\\n\\n// Adjust Scale\\nconst ratioX = this.width / this.bitmap.width;\\nconst ratioY = this.height / this.bitmap.height;\\nconst scale = Math.max(ratioX, ratioY);\\nthis.scale.x = scale;\\nthis.scale.y = scale;\\n\\n// Adjust Coordinates\\nthis.x = (Graphics.width - this.width) / 2;\\nthis.y = Graphics.height - this.height;\"","jsScaleDown:func":"\"// Adjust Size\\nthis.width = Graphics.width;\\nthis.height = Graphics.height;\\n\\n// Adjust Scale\\nconst ratioX = Math.min(1, this.width / this.bitmap.width);\\nconst ratioY = Math.min(1, this.height / this.bitmap.height);\\nconst scale = Math.max(ratioX, ratioY);\\nthis.scale.x = scale;\\nthis.scale.y = scale;\\n\\n// Adjust Coordinates\\nthis.x = (Graphics.width - this.width) / 2;\\nthis.y = Graphics.height - this.height;\"","jsScale Up:func":"\"// Adjust Size\\nthis.width = Graphics.width;\\nthis.height = Graphics.height;\\n\\n// Adjust Scale\\nconst ratioX = Math.max(1, this.width / this.bitmap.width);\\nconst ratioY = Math.max(1, this.height / this.bitmap.height);\\nconst scale = Math.max(ratioX, ratioY);\\nthis.scale.x = scale;\\nthis.scale.y = scale;\\n\\n// Adjust Coordinates\\nthis.x = (Graphics.width - this.width) / 2;\\nthis.y = Graphics.height - this.height;\""}
 *
 * @param PartyCmd:struct
 * @text Party Command Window
 * @type struct<PartyCmd>
 * @desc Settings that alter the Party Command Window in battle.
 * @default {"Cmd":"","CmdStyle:str":"auto","CmdTextAlign:str":"left","CmdIconFight:num":"76","CommandAddAutoBattle:eval":"true","CmdIconAutoBattle:num":"78","CmdTextAutoBattle:str":"Auto","CommandAddOptions:eval":"true","CmdIconOptions:num":"83","ActiveTpbOptionsMessage:str":"Options Menu queued after action is complete.","CmdIconEscape:num":"82","Access":"","SkipPartyCmd:eval":"true","DisablePartyCmd:eval":"false","HelpWindow":"","HelpFight:str":"Select actions to fight.","HelpAutoBattle:str":"Sets party to Auto Battle mode.","HelpOptions:str":"Opens up the Options Menu.","HelpEscape:str":"Attempt to escape the battle."}
 *
 * @param ActorCmd:struct
 * @text Actor Command Window
 * @type struct<ActorCmd>
 * @desc Settings that alter the Actor Command Window in battle.
 * @default {"Cmd":"","CmdStyle:str":"auto","CmdTextAlign:str":"left","CmdIconItem:num":"176","IconStypeNorm:num":"78","IconStypeMagic:num":"79","BattleCmd":"","BattleCmdList:arraystr":"[\"attack\",\"skills\",\"guard\",\"item\",\"escape\"]","HelpWindow":"","HelpSkillType:str":"Opens up a list of skills under the \\C[16]%1\\C[0] category.","HelpItem:str":"Opens up a list of items that you can use.","HelpEscape:str":"Attempt to escape the battle.","HelpAutoBattle:str":"Automatically choose an action suitable for combat."}
 *
 * @param VisualBreak
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param Actor:struct
 * @text Actor Battler Settings
 * @type struct<Actor>
 * @desc Settings that alter various properties for actors.
 * @default {"Flinch":"","FlinchDistanceX:num":"12","FlinchDistanceY:num":"0","FlinchDuration:num":"6","SvBattlers":"","AnchorX:num":"0.5","AnchorY:num":"1.0","ChantStyle:eval":"true","OffsetX:num":"0","OffsetY:num":"0","MotionSpeed:num":"12","PrioritySortActive:eval":"true","PrioritySortActors:eval":"false","Shadow:eval":"true","SmoothImage:eval":"true","HomePosJS:func":"\"// Declare Constants\\nconst sprite = this;\\nconst actor = this._actor;\\nconst index = arguments[0];\\n\\n// Make Calculations\\nlet x = Math.round((Graphics.width / 2) + 192)\\nx -= Math.floor((Graphics.width - Graphics.boxWidth) / 2);\\nx += index * 32;\\nlet y = (Graphics.height - 200) - ($gameParty.maxBattleMembers() * 48);\\ny -= Math.floor((Graphics.height - Graphics.boxHeight) / 2);\\ny += index * 48;\\n\\n// Home Position Offsets\\nconst offsetNote = /<SIDEVIEW HOME OFFSET:[ ]([\\\\+\\\\-]\\\\d+),[ ]([\\\\+\\\\-]\\\\d+)>/i;\\nconst xOffsets = actor.traitObjects().map((obj) => (obj && obj.note.match(offsetNote) ? Number(RegExp.$1) : 0));\\nconst yOffsets = actor.traitObjects().map((obj) => (obj && obj.note.match(offsetNote) ? Number(RegExp.$2) : 0));\\nx = xOffsets.reduce((r, offset) => r + offset, x);\\ny = yOffsets.reduce((r, offset) => r + offset, y);\\n\\n// Set Home Position\\nthis.setHome(x, y);\""}
 *
 * @param Enemy:struct
 * @text Enemy Battler Settings
 * @type struct<Enemy>
 * @desc Settings that alter various properties for enemies.
 * @default {"Visual":"","AttackAnimation:num":"1","EmergeText:eval":"false","OffsetX:num":"0","OffsetY:num":"0","SmoothImage:eval":"true","SelectWindow":"","FrontViewSelect:eval":"false","SideviewSelect:eval":"true","NameFontSize:num":"22","SvBattlers":"","AllowCollapse:eval":"false","AnchorX:num":"0.5","AnchorY:num":"1.0","MotionIdle:str":"walk","Shadow:eval":"true","Width:num":"64","Height:num":"64","WtypeId:num":"0"}
 *
 * @param HpGauge:struct
 * @text HP Gauge Settings
 * @type struct<HpGauge>
 * @desc Settings that adjust the visual HP Gauge displayed in battle.
 * @default {"Display":"","ShowActorGauge:eval":"false","ShowEnemyGauge:eval":"true","RequiresDefeat:eval":"false","BTestBypass:eval":"true","Settings":"","AnchorX:num":"0.5","AnchorY:num":"1.0","Scale:num":"0.5","OffsetX:num":"0","OffsetY:num":"-3","Options":"","AddHpGaugeOption:eval":"true","AdjustRect:eval":"true","Name:str":"Show HP Gauge"}
 *
 * @param ActionSequence:struct
 * @text Action Sequence Settings
 * @type struct<ActionSequence>
 * @desc Settings that adjust how certain Action Sequences work.
 * @default {"AutoSequences":"","AutoMeleeSolo:eval":"true","AutoMeleeAoE:eval":"true","CastAnimations":"","CastCertain:num":"120","CastPhysical:num":"52","CastMagical:num":"51","CounterReflection":"","CounterPlayback:eval":"true","ReflectAnimation:num":"1","ReflectPlayback:eval":"true","Stepping":"","MeleeDistance:num":"24","StepDistanceX:num":"48","StepDistanceY:num":"0","StepDuration:num":"12"}
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
 * Auto Battle Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~AutoBattle:
 *
 * @param BattleDisplay
 * @text Battle Display
 *
 * @param AutoBattleMsg:str
 * @text Message
 * @parent BattleDisplay
 * @desc Message that's displayed when Auto Battle is on.
 * Text codes allowed. %1 - OK button, %2 - Cancel button
 * @default Press %1 or %2 to stop Auto Battle
 *
 * @param AutoBattleOK:str
 * @text OK Button
 * @parent BattleDisplay
 * @desc Text used to represent the OK button.
 * If VisuMZ_0_CoreEngine is present, ignore this.
 * @default OK
 *
 * @param AutoBattleCancel:str
 * @text Cancel Button
 * @parent BattleDisplay
 * @desc Text used to represent the Cancel button.
 * If VisuMZ_0_CoreEngine is present, ignore this.
 * @default Cancel
 *
 * @param AutoBattleBgType:num
 * @text Background Type
 * @parent BattleDisplay
 * @type select
 * @option 0 - Window
 * @value 0
 * @option 1 - Dim
 * @value 1
 * @option 2 - Transparent
 * @value 2
 * @desc Select background type for Auto Battle window.
 * @default 1
 *
 * @param AutoBattleRect:func
 * @text JS: X, Y, W, H
 * @parent BattleDisplay
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const width = Graphics.width;\nconst height = this.calcWindowHeight(1, false);\nconst x = 0;\nconst y = (Graphics.height - height) / 2;\nreturn new Rectangle(x, y, width, height);"
 *
 * @param Options
 *
 * @param AddOption:eval
 * @text Add Option?
 * @parent Options
 * @type boolean
 * @on Add
 * @off Don't Add
 * @desc Add the Auto Battle options to the Options menu?
 * @default true
 *
 * @param AdjustRect:eval
 * @text Adjust Window Height
 * @parent Options
 * @type boolean
 * @on Adjust
 * @off Don't
 * @desc Automatically adjust the options window height?
 * @default true
 *
 * @param StartName:str
 * @text Startup Name
 * @parent Options
 * @desc Command name of the option.
 * @default Auto Battle Start
 *
 * @param StyleName:str
 * @text Style Name
 * @parent Options
 * @desc Command name of the option.
 * @default Auto Battle Style
 *
 * @param StyleOFF:str
 * @text OFF
 * @parent StyleName:str
 * @desc Text displayed when Auto Battle Style is OFF.
 * @default Attack
 *
 * @param StyleON:str
 * @text ON
 * @parent StyleName:str
 * @desc Text displayed when Auto Battle Style is ON.
 * @default Skills
 *
 */
/* ----------------------------------------------------------------------------
 * Damage Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Damage:
 *
 * @param Cap
 * @text Damage Cap
 *
 * @param EnableDamageCap:eval
 * @text Enable Damage Cap?
 * @parent Cap
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Put a maximum hard damage cap on how far damage can go?
 * This can be broken through the usage of notetags.
 * @default false
 *
 * @param DefaultHardCap:num
 * @text Default Hard Cap
 * @parent EnableDamageCap:eval
 * @type number
 * @min 1
 * @desc The default hard damage cap used before applying damage.
 * @default 9999
 *
 * @param EnableSoftCap:eval
 * @text Enable Soft Cap?
 * @parent Cap
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Soft caps ease in the damage values leading up to the 
 * hard damage cap. Requires hard Damage Cap enabled.
 * @default false
 *
 * @param DefaultSoftCap:num
 * @text Base Soft Cap Rate
 * @parent EnableSoftCap:eval
 * @desc The default soft damage cap used before applying damage.
 * @default 0.80
 *
 * @param DefaultSoftScaler:num
 * @text Soft Scale Constant
 * @parent EnableSoftCap:eval
 * @desc The default soft damage cap used before applying damage.
 * @default 0.1275
 *
 * @param Popups
 *
 * @param PopupDuration:num
 * @text Popup Duration
 * @parent Popups
 * @type number
 * @min 1
 * @desc Adjusts how many frames a popup stays visible.
 * @default 128
 *
 * @param NewPopupBottom:eval
 * @text Newest Popups Bottom
 * @parent Popups
 * @type boolean
 * @on Bottom
 * @off Top
 * @desc Puts the newest popups at the bottom.
 * @default true
 *
 * @param PopupPosition:str
 * @text Appear Position
 * @parent Popups
 * @type select
 * @option Head - At the top of the battler.
 * @value head
 * @option Center - At the center of the battler.
 * @value center
 * @option Base - At the foot of the battler.
 * @value base
 * @desc Selects where you want popups to appear relative to the battler.
 * @default base
 *
 * @param PopupOffsetX:num
 * @text Offset X
 * @parent Popups
 * @desc Sets how much to offset the sprites by horizontally.
 * Negative values go left. Positive values go right.
 * @default 0
 *
 * @param PopupOffsetY:num
 * @text Offset Y
 * @parent Popups
 * @desc Sets how much to offset the sprites by vertically.
 * Negative values go up. Positive values go down.
 * @default 0
 *
 * @param PopupShiftX:num
 * @text Shift X
 * @parent Popups
 * @desc Sets how much to shift the sprites by horizontally.
 * Negative values go left. Positive values go right.
 * @default 8
 *
 * @param PopupShiftY:num
 * @text Shift Y
 * @parent Popups
 * @desc Sets how much to shift the sprites by vertically.
 * Negative values go up. Positive values go down.
 * @default -28
 *
 * @param hpDamageFmt:str
 * @text HP Damage Format
 * @parent Popups
 * @desc Determines HP damage format for popup.
 * %1 - Value, %2 - HP Text
 * @default -%1
 *
 * @param hpHealingFmt:str
 * @text HP Healing Format
 * @parent Popups
 * @desc Determines HP healing format for popup.
 * %1 - Value, %2 - HP Text
 * @default +%1
 *
 * @param mpDamageFmt:str
 * @text MP Damage Format
 * @parent Popups
 * @desc Determines MP damage format for popup.
 * %1 - Value, %2 - MP Text
 * @default -%1 %2
 *
 * @param mpHealingFmt:str
 * @text MP Healing Format
 * @parent Popups
 * @desc Determines MP healing format for popup.
 * %1 - Value, %2 - MP Text
 * @default +%1 %2
 *
 * @param CriticalColor:eval
 * @text Critical Flash Color
 * @parent Popups
 * @desc Adjust the popup's flash color.
 * Format: [red, green, blue, alpha]
 * @default [255, 0, 0, 160]
 *
 * @param CriticalDuration:num
 * @text Critical Duration
 * @parent Popups
 * @type number
 * @min 1
 * @desc Adjusts how many frames a the flash lasts.
 * @default 128
 *
 * @param Formulas
 *
 * @param OverallFormulaJS:func
 * @text JS: Overall Formula
 * @parent Formulas
 * @type note
 * @desc The overall formula used when calculating damage.
 * @default "// Declare Constants\nconst target = arguments[0];\nconst critical = arguments[1];\nconst item = this.item();\n\n// Get Base Damage\nconst baseValue = this.evalDamageFormula(target);\n\n// Calculate Element Modifiers\nlet value = baseValue * this.calcElementRate(target);\n\n// Calculate Physical and Magical Modifiers\nif (this.isPhysical()) {\n    value *= target.pdr;\n}\nif (this.isMagical()) {\n    value *= target.mdr;\n}\n\n// Apply Healing Modifiers\nif (baseValue < 0) {\n    value *= target.rec;\n}\n\n// Apply Critical Modifiers\nif (critical) {\n    value = this.applyCritical(value);\n}\n\n// Apply Variance and Guard Modifiers\nvalue = this.applyVariance(value, item.damage.variance);\nvalue = this.applyGuard(value, target);\n\n// Finalize Damage\nvalue = Math.round(value);\nreturn value;"
 *
 * @param VarianceFormulaJS:func
 * @text JS: Variance Formula
 * @parent Formulas
 * @type note
 * @desc The formula used when damage variance.
 * @default "// Declare Constants\nconst damage = arguments[0];\nconst variance = arguments[1];\n\n// Calculate Variance\nconst amp = Math.floor(Math.max((Math.abs(damage) * variance) / 100, 0));\nconst v = Math.randomInt(amp + 1) + Math.randomInt(amp + 1) - amp;\n\n// Return Damage\nreturn damage >= 0 ? damage + v : damage - v;"
 *
 * @param GuardFormulaJS:func
 * @text JS: Guard Formula
 * @parent Formulas
 * @type note
 * @desc The formula used when damage is guarded.
 * @default "// Declare Constants\nconst damage = arguments[0];\nconst target = arguments[1];\n\n// Return Damage Early\nconst note = this.item().note;\nif (note.match(/<UNBLOCKABLE>/i)) return damage;\nif (!target.isGuard()) return damage;\nif (damage < 0) return damage;\n\n// Declare Guard Rate\nlet guardRate = 0.5;\nguardRate /= target.grd;\n\n// Return Damage\nreturn damage * guardRate;"
 *
 * @param Critical
 * @text Critical Hits
 *
 * @param CriticalHitRateJS:func
 * @text JS: Rate Formula
 * @parent Critical
 * @type note
 * @desc The formula used to calculate Critical Hit Rates.
 * @default "// Declare Constants\nconst user = this.subject();\nconst target = arguments[0];\n\n// Create Base Critical Rate\nlet rate = this.subject().cri * (1 - target.cev);\n\n// Apply Notetags\nconst note = this.item().note;\nif (note.match(/<ALWAYS CRITICAL>/i)) {\n    return 1;\n}\nif (note.match(/<SET CRITICAL RATE:[ ](\\d+)([%％])>/i)) {\n    return Number(RegExp.$1) / 100;\n}\nif (note.match(/<MODIFY CRITICAL RATE:[ ](\\d+)([%％])>/i)) {\n    rate *= Number(RegExp.$1) / 100;\n}\nif (note.match(/<MODIFY CRITICAL RATE:[ ]([\\+\\-]\\d+)([%％])>/i)) {\n    rate += Number(RegExp.$1) / 100;\n}\nif (note.match(/<JS CRITICAL RATE>\\s*([\\s\\S]*)\\s*<\\/JS CRITICAL RATE>/i)) {\n    const code = String(RegExp.$1);\n    try {\n        eval(code);\n    } catch (e) {\n        if ($gameTemp.isPlaytest()) console.log(e);\n    }\n}\n\n// Apply LUK Buffs/Debuffs\nconst lukStack = this.subject().buff(7);\nrate *= 2 ** lukStack;\n\n// Return Rate\nreturn rate;"
 *
 * @param CriticalHitMultiplier:func
 * @text JS: Damage Formula
 * @parent Critical
 * @type note
 * @desc The formula used to calculate Critical Hit Damage modification.
 * @default "// Declare Constants\nconst user = this.subject();\nlet damage = arguments[0];\nlet multiplier = 2.0;\nlet bonusDamage = this.subject().luk * this.subject().cri;\n\n// Apply Notetags\nconst note = this.item().note;\nif (note.match(/<MODIFY CRITICAL MULTIPLIER:[ ](\\d+)([%％])>/i)) {\n    multiplier = Number(RegExp.$1) / 100;\n}\nif (note.match(/<MODIFY CRITICAL MULTIPLIER:[ ]([\\+\\-]\\d+)([%％])>/i)) {\n    multiplier += Number(RegExp.$1) / 100;\n}\nif (note.match(/<MODIFY CRITICAL BONUS DAMAGE:[ ](\\d+)([%％])>/i)) {\n    bonusDamage *= Number(RegExp.$1) / 100;\n}\nif (note.match(/<MODIFY CRITICAL BONUS DAMAGE:[ ]([\\+\\-]\\d+)([%％])>/i)) {\n    bonusDamage += bonusDamage * (RegExp.$1) / 100;\n}\nif (note.match(/<JS CRITICAL DAMAGE>\\s*([\\s\\S]*)\\s*<\\/JS CRITICAL DAMAGE>/i)) {\n    const code = String(RegExp.$1);\n    try {\n        eval(code);\n    } catch (e) {\n        if ($gameTemp.isPlaytest()) console.log(e);\n    }\n}\n\n// Return Damage\nreturn damage * multiplier + bonusDamage;"
 *
 * @param DamageStyles
 * @text Damage Styles
 *
 * @param DefaultDamageStyle:str
 * @text Default Style
 * @parent DamageStyles
 * @desc Which Damage Style do you want to set as default?
 * Use 'Manual' to not use any styles at all.
 * @default Standard
 *
 * @param DamageStyleList:arraystruct
 * @text Style List
 * @parent DamageStyles
 * @type struct<DamageStyle>[]
 * @desc A list of the damage styles available.
 * These are used to calculate base damage.
 * @default ["{\"Name:str\":\"Standard\",\"Formula:func\":\"\\\"// Declare Constants\\\\nconst user = this.subject();\\\\nconst target = arguments[0];\\\\nconst item = this.item();\\\\nconst a = this.subject();\\\\nconst b = target;\\\\nconst v = $gameVariables._data;\\\\nconst sign = [3, 4].includes(item.damage.type) ? -1 : 1;\\\\n\\\\n// Replace Formula\\\\nlet formula = item.damage.formula;\\\\nif (SceneManager.isSceneBattle() && !this.isCertainHit()) {\\\\n    const fmt = 'Math.max(this.applyArmorModifiers(b, %1), 0)';\\\\n    formula = formula.replace(/b.def/g, fmt.format('b.def'));\\\\n    formula = formula.replace(/b.mdf/g, fmt.format('b.mdf'));\\\\n    formula = formula.replace(/b.agi/g, fmt.format('b.agi'));\\\\n    formula = formula.replace(/b.luk/g, fmt.format('b.luk'));\\\\n}\\\\n\\\\n// Calculate Damage\\\\nlet value = Math.max(eval(formula), 0);\\\\n\\\\n// Return Value\\\\nreturn (isNaN(value) ? 0 : value) * sign;\\\"\",\"ItemsEquipsCore\":\"\",\"DamageType\":\"\",\"DamageType1:str\":\"%1 Damage Multiplier\",\"DamageType2:str\":\"%1 Damage Multiplier\",\"DamageType3:str\":\"%1 Recovery Multiplier\",\"DamageType4:str\":\"%1 Recovery Multiplier\",\"DamageType5:str\":\"%1 Drain Multiplier\",\"DamageType6:str\":\"%1 Drain Multiplier\",\"DamageDisplay:func\":\"\\\"return this.getItemDamageAmountTextOriginal();\\\"\"}","{\"Name:str\":\"Armor Scaling\",\"Formula:func\":\"\\\"// Declare Constants\\\\nconst user = this.subject();\\\\nconst target = arguments[0];\\\\nconst item = this.item();\\\\nconst a = this.subject();\\\\nconst b = target;\\\\nconst v = $gameVariables._data;\\\\nconst sign = [3, 4].includes(item.damage.type) ? -1 : 1;\\\\n\\\\n// Replace Formula\\\\nlet formula = item.damage.formula;\\\\nif (SceneManager.isSceneBattle() && !this.isCertainHit()) {\\\\n    const fmt = 'Math.max(this.applyArmorModifiers(b, %1), 1)';\\\\n    formula = formula.replace(/b.def/g, fmt.format('b.def'));\\\\n    formula = formula.replace(/b.mdf/g, fmt.format('b.mdf'));\\\\n    formula = formula.replace(/b.agi/g, fmt.format('b.agi'));\\\\n    formula = formula.replace(/b.luk/g, fmt.format('b.luk'));\\\\n}\\\\n\\\\n// Calculate Damage\\\\nlet value = Math.max(eval(formula), 0);\\\\n\\\\n// Apply Defender's Defense Parameter\\\\nif (this.isDamage() && !this.isCertainHit()) {\\\\n\\\\n    // Calculate Base Armor\\\\n    let armor = this.isPhysical() ? b.def : b.mdf;\\\\n    armor = this.applyArmorModifiers(target, armor);\\\\n\\\\n    // Apply Armor to Damage\\\\n    if (armor >= 0) {\\\\n        value *= 100 / (100 + armor);\\\\n    } else {\\\\n        value *= 2 - (100 / (100 - armor));\\\\n    }\\\\n}\\\\n\\\\n// Return Value\\\\nreturn (isNaN(value) ? 0 : value) * sign;\\\"\",\"ItemsEquipsCore\":\"\",\"DamageType\":\"\",\"DamageType1:str\":\"%1 Damage Multiplier\",\"DamageType2:str\":\"%1 Damage Multiplier\",\"DamageType3:str\":\"%1 Recovery Multiplier\",\"DamageType4:str\":\"%1 Recovery Multiplier\",\"DamageType5:str\":\"%1 Drain Multiplier\",\"DamageType6:str\":\"%1 Drain Multiplier\",\"DamageDisplay:func\":\"\\\"return this.getItemDamageAmountTextOriginal();\\\"\"}","{\"Name:str\":\"CT\",\"Formula:func\":\"\\\"// Define Constants\\\\nconst user = this.subject();\\\\nconst target = arguments[0];\\\\nconst item = this.item();\\\\nconst a = this.subject();\\\\nconst b = target;\\\\nconst v = $gameVariables._data;\\\\nconst sign = [3, 4].includes(item.damage.type) ? -1 : 1;\\\\n\\\\n// Create Multiplier\\\\nconst multiplier = Math.max(eval(item.damage.formula), 0);\\\\n\\\\n// Declare Values\\\\nlet value = 0;\\\\nlet level = Math.max(a.level || a.luk, 1);\\\\nlet armor = this.isPhysical() ? b.def : b.mdf;\\\\narmor = Math.max(this.applyArmorModifiers(target, armor), 0);\\\\nlet attackStat = 0;\\\\nif (this.isPhysical() && (this.isDamage() || this.isDrain())) {\\\\n    attackStat = a.atk;\\\\n} else if (this.isMagical() && (this.isDamage() || this.isDrain())) {\\\\n    attackStat =  a.mat;\\\\n} else if (this.isPhysical() && this.isRecover()) {\\\\n    attackStat =  a.def;\\\\n} else if (this.isMagical() && this.isRecover()) {\\\\n    attackStat =  a.mdf;\\\\n}\\\\n\\\\n// Calculate Damage\\\\nattackStat = (attackStat * 1.75) + (level ** 2 / 45.5);\\\\nvalue = attackStat * 4;\\\\nif (this.isPhysical() && (this.isDamage() || this.isDrain())) {\\\\n    value *= Math.max(256 - armor, 0) / 256;\\\\n} else if (this.isMagical() && (this.isDamage() || this.isDrain())) {\\\\n    value *= Math.max(102.4 - armor, 0) / 128;\\\\n}\\\\nvalue *= multiplier;\\\\n\\\\n// Return Value\\\\nreturn (isNaN(value) ? 0 : value) * sign;\\\"\",\"ItemsEquipsCore\":\"\",\"DamageType\":\"\",\"DamageType1:str\":\"%1 Damage Multiplier\",\"DamageType2:str\":\"%1 Damage Multiplier\",\"DamageType3:str\":\"%1 Recovery Multiplier\",\"DamageType4:str\":\"%1 Recovery Multiplier\",\"DamageType5:str\":\"%1 Drain Multiplier\",\"DamageType6:str\":\"%1 Drain Multiplier\",\"DamageDisplay:func\":\"\\\"// Define Constants\\\\nconst item = this._item;\\\\nconst formula = item.damage.formula;\\\\nconst a = this._tempActorA;\\\\nconst b = this._tempActorB;\\\\nconst user = a;\\\\nconst target = b;\\\\n\\\\n// Return Value\\\\ntry {\\\\n    const value = Math.max(eval(formula), 0);\\\\n    return '%1%'.format(Math.round(value * 100));\\\\n} catch (e) {\\\\n    if ($gameTemp.isPlaytest()) {\\\\n        console.log('Damage Formula Error for %1'.format(this._item.name));\\\\n    }\\\\n    return '?????';\\\\n}\\\"\"}","{\"Name:str\":\"D4\",\"Formula:func\":\"\\\"// Define Constants\\\\nconst user = this.subject();\\\\nconst target = arguments[0];\\\\nconst item = this.item();\\\\nconst a = this.subject();\\\\nconst b = target;\\\\nconst v = $gameVariables._data;\\\\nconst sign = [3, 4].includes(item.damage.type) ? -1 : 1;\\\\n\\\\n// Create Multiplier\\\\nconst multiplier = Math.max(eval(item.damage.formula), 0);\\\\n\\\\n// Declare Values\\\\nlet armor = this.isPhysical() ? b.def : b.mdf;\\\\narmor = this.applyArmorModifiers(target, armor);\\\\nlet stat = 0;\\\\nif (this.isPhysical() && (this.isDamage() || this.isDrain())) {\\\\n    stat = a.atk;\\\\n} else if (this.isMagical() && (this.isDamage() || this.isDrain())) {\\\\n    stat = a.mat;\\\\n} else if (this.isPhysical() && this.isRecover()) {\\\\n    stat = a.def;\\\\n    armor = 0;\\\\n} else if (this.isMagical() && this.isRecover()) {\\\\n    stat = a.mdf;\\\\n    armor = 0;\\\\n}\\\\n\\\\n// Calculate Damage \\\\nlet value = 1.5 * Math.max(2 * stat * multiplier - armor, 1) * multiplier / 5;\\\\n\\\\n// Return Value\\\\nreturn (isNaN(value) ? 0 : value) * sign;\\\"\",\"ItemsEquipsCore\":\"\",\"DamageType\":\"\",\"DamageType1:str\":\"%1 Damage Multiplier\",\"DamageType2:str\":\"%1 Damage Multiplier\",\"DamageType3:str\":\"%1 Recovery Multiplier\",\"DamageType4:str\":\"%1 Recovery Multiplier\",\"DamageType5:str\":\"%1 Drain Multiplier\",\"DamageType6:str\":\"%1 Drain Multiplier\",\"DamageDisplay:func\":\"\\\"// Define Constants\\\\nconst item = this._item;\\\\nconst formula = item.damage.formula;\\\\nconst a = this._tempActorA;\\\\nconst b = this._tempActorB;\\\\nconst user = a;\\\\nconst target = b;\\\\n\\\\n// Return Value\\\\ntry {\\\\n    const value = Math.max(eval(formula), 0);\\\\n    return '%1%'.format(Math.round(value * 100));\\\\n} catch (e) {\\\\n    if ($gameTemp.isPlaytest()) {\\\\n        console.log('Damage Formula Error for %1'.format(this._item.name));\\\\n    }\\\\n    return '?????';\\\\n}\\\"\"}","{\"Name:str\":\"DQ\",\"Formula:func\":\"\\\"// Define Constants\\\\nconst user = this.subject();\\\\nconst target = arguments[0];\\\\nconst item = this.item();\\\\nconst a = this.subject();\\\\nconst b = target;\\\\nconst v = $gameVariables._data;\\\\nconst sign = [3, 4].includes(item.damage.type) ? -1 : 1;\\\\n\\\\n// Create Multiplier\\\\nlet multiplier = Math.max(eval(item.damage.formula), 0);\\\\nif (this.isCertainHit()) {\\\\n    let value = multiplier * Math.max(a.atk, a.mat);\\\\n    return (isNaN(value) ? 0 : value) * sign;\\\\n}\\\\n\\\\n// Get Primary Stats\\\\nlet armor = this.isPhysical() ? b.def : b.mdf;\\\\narmor = this.applyArmorModifiers(b, armor);\\\\nlet stat = 1;\\\\nif (this.isPhysical() && (this.isDamage() || this.isDrain())) {\\\\n    stat = a.atk;\\\\n} else if (this.isMagical() && (this.isDamage() || this.isDrain())) {\\\\n    stat = a.mat;\\\\n} else if (this.isPhysical() && this.isRecover()) {\\\\n    stat = a.def;\\\\n} else if (this.isMagical() && this.isRecover()) {\\\\n    stat = a.mdf;\\\\n}\\\\n\\\\n// Check for Recovery\\\\nif (this.isRecover()) {\\\\n    let value = stat * multiplier * sign;\\\\n    return isNaN(value) ? 0 : value;\\\\n}\\\\n\\\\n// Calculate Damage\\\\nlet value = 0;\\\\nif (stat < ((2 + armor) / 2)) {\\\\n    // Plink Damage\\\\n    let baseline = Math.max(stat - ((12 * (armor - stat + 1)) / stat), 5);\\\\n    value = baseline / 3;\\\\n} else {\\\\n    // Normal Damage\\\\n    let baseline = Math.max(stat - (armor / 2), 1);\\\\n    value = baseline / 2;\\\\n}\\\\nvalue *= multiplier;\\\\n\\\\n// Return Value\\\\nreturn isNaN(value) ? 0 : value;\\\"\",\"ItemsEquipsCore\":\"\",\"DamageType\":\"\",\"DamageType1:str\":\"%1 Damage Multiplier\",\"DamageType2:str\":\"%1 Damage Multiplier\",\"DamageType3:str\":\"%1 Recovery Multiplier\",\"DamageType4:str\":\"%1 Recovery Multiplier\",\"DamageType5:str\":\"%1 Drain Multiplier\",\"DamageType6:str\":\"%1 Drain Multiplier\",\"DamageDisplay:func\":\"\\\"// Define Constants\\\\nconst item = this._item;\\\\nconst formula = item.damage.formula;\\\\nconst a = this._tempActorA;\\\\nconst b = this._tempActorB;\\\\nconst user = a;\\\\nconst target = b;\\\\n\\\\n// Return Value\\\\ntry {\\\\n    const value = Math.max(eval(formula), 0);\\\\n    return '%1%'.format(Math.round(value * 100));\\\\n} catch (e) {\\\\n    if ($gameTemp.isPlaytest()) {\\\\n        console.log('Damage Formula Error for %1'.format(this._item.name));\\\\n    }\\\\n    return '?????';\\\\n}\\\"\"}","{\"Name:str\":\"FF7\",\"Formula:func\":\"\\\"// Define Constants\\\\nconst user = this.subject();\\\\nconst target = arguments[0];\\\\nconst item = this.item();\\\\nconst a = this.subject();\\\\nconst b = target;\\\\nconst v = $gameVariables._data;\\\\nconst sign = [3, 4].includes(item.damage.type) ? -1 : 1;\\\\n\\\\n// Create Power\\\\nconst power = Math.max(eval(item.damage.formula), 0);\\\\n\\\\n// Declare base Damage\\\\nlet baseDamage = 0;\\\\nlet level = Math.max(a.level || a.luk, 1);\\\\nif (this.isPhysical() && (this.isDamage() || this.isDrain())) {\\\\n    baseDamage = a.atk + ((a.atk + level) / 32) * ((a.atk * level) / 32);\\\\n} else if (this.isMagical() && (this.isDamage() || this.isDrain())) {\\\\n    baseDamage = 6 * (a.mat + level);\\\\n} else if (this.isPhysical() && this.isRecover()) {\\\\n    baseDamage = 6 * (a.def + level);\\\\n} else if (this.isMagical() && this.isRecover()) {\\\\n    baseDamage = 6 * (a.mdf + level);\\\\n}\\\\n\\\\n// Calculate Final Damage\\\\nlet value = baseDamage;\\\\nlet armor = this.isPhysical() ? b.def : b.mdf;\\\\narmor = this.applyArmorModifiers(target, armor);\\\\nif (this.isRecover()) {\\\\n    value += 22 * power;\\\\n} else {\\\\n    value = (power * Math.max(512 - armor, 1) * baseDamage) / (16 * 512);\\\\n}\\\\n\\\\n// Return Value\\\\nreturn (isNaN(value) ? 0 : value) * sign;\\\"\",\"ItemsEquipsCore\":\"\",\"DamageType\":\"\",\"DamageType1:str\":\"%1 Damage Power\",\"DamageType2:str\":\"%1 Damage Power\",\"DamageType3:str\":\"%1 Recovery Power\",\"DamageType4:str\":\"%1 Recovery Power\",\"DamageType5:str\":\"%1 Drain Power\",\"DamageType6:str\":\"%1 Drain Power\",\"DamageDisplay:func\":\"\\\"// Define Constants\\\\nconst item = this._item;\\\\nconst formula = item.damage.formula;\\\\nconst a = this._tempActorA;\\\\nconst b = this._tempActorB;\\\\nconst user = a;\\\\nconst target = b;\\\\n\\\\n// Return Value\\\\ntry {\\\\n    return formula;\\\\n} catch (e) {\\\\n    if ($gameTemp.isPlaytest()) {\\\\n        console.log('Damage Formula Error for %1'.format(this._item.name));\\\\n    }\\\\n    return '?????';\\\\n}\\\"\"}","{\"Name:str\":\"FF8\",\"Formula:func\":\"\\\"// Define Constants\\\\nconst user = this.subject();\\\\nconst target = arguments[0];\\\\nconst item = this.item();\\\\nconst a = this.subject();\\\\nconst b = target;\\\\nconst v = $gameVariables._data;\\\\nconst sign = [3, 4].includes(item.damage.type) ? -1 : 1;\\\\n\\\\n// Create Power\\\\nconst power = Math.max(eval(item.damage.formula), 0);\\\\n\\\\n// Declare Damage\\\\nlet Value = 0;\\\\nlet level = Math.max(a.level || a.luk, 1);\\\\nlet armor = this.isPhysical() ? b.def : b.mdf;\\\\narmor = this.applyArmorModifiers(target, armor);\\\\nif (this.isPhysical() && (this.isDamage() || this.isDrain())) {\\\\n    value = a.atk ** 2 / 16 + a.atk;\\\\n    value *= Math.max(265 - armor, 1) / 256;\\\\n    value *= power / 16;\\\\n} else if (this.isMagical() && (this.isDamage() || this.isDrain())) {\\\\n    value = a.mat + power;\\\\n    value *= Math.max(265 - armor, 1) / 4;\\\\n    value *= power / 256;\\\\n} else if (this.isPhysical() && this.isRecover()) {\\\\n    value = (power + a.def) * power / 2;\\\\n} else if (this.isMagical() && this.isRecover()) {\\\\n    value = (power + a.mdf) * power / 2;\\\\n}\\\\n\\\\n// Return Value\\\\nreturn (isNaN(value) ? 0 : value) * sign;\\\"\",\"ItemsEquipsCore\":\"\",\"DamageType\":\"\",\"DamageType1:str\":\"%1 Damage Power\",\"DamageType2:str\":\"%1 Damage Power\",\"DamageType3:str\":\"%1 Recovery Power\",\"DamageType4:str\":\"%1 Recovery Power\",\"DamageType5:str\":\"%1 Drain Power\",\"DamageType6:str\":\"%1 Drain Power\",\"DamageDisplay:func\":\"\\\"// Define Constants\\\\nconst item = this._item;\\\\nconst formula = item.damage.formula;\\\\nconst a = this._tempActorA;\\\\nconst b = this._tempActorB;\\\\nconst user = a;\\\\nconst target = b;\\\\n\\\\n// Return Value\\\\ntry {\\\\n    return formula;\\\\n} catch (e) {\\\\n    if ($gameTemp.isPlaytest()) {\\\\n        console.log('Damage Formula Error for %1'.format(this._item.name));\\\\n    }\\\\n    return '?????';\\\\n}\\\"\"}","{\"Name:str\":\"FF9\",\"Formula:func\":\"\\\"// Define Constants\\\\nconst user = this.subject();\\\\nconst target = arguments[0];\\\\nconst item = this.item();\\\\nconst a = this.subject();\\\\nconst b = target;\\\\nconst v = $gameVariables._data;\\\\nconst sign = [3, 4].includes(item.damage.type) ? -1 : 1;\\\\n\\\\n// Create Damage Constant\\\\nconst power = Math.max(eval(item.damage.formula), 0);\\\\nif (this.isCertainHit()) {\\\\n    return (isNaN(power) ? 0 : power) * sign;\\\\n}\\\\n\\\\n// Declare Main Stats\\\\nlet armor = this.isPhysical() ? b.def : b.mdf;\\\\narmor = this.applyArmorModifiers(b, armor);\\\\nlet stat = 1;\\\\nif (this.isPhysical() && (this.isDamage() || this.isDrain())) {\\\\n    stat = a.atk;\\\\n} else if (this.isMagical() && (this.isDamage() || this.isDrain())) {\\\\n    stat = a.mat;\\\\n} else if (this.isPhysical() && this.isRecover()) {\\\\n    stat = a.def;\\\\n} else if (this.isMagical() && this.isRecover()) {\\\\n    stat = a.mdf;\\\\n}\\\\n\\\\n// Declare Base Damage\\\\nlet baseDamage = power;\\\\nif (this.isPhysical()) {\\\\n    baseDamage += stat;\\\\n}\\\\nif (this.isDamage() || this.isDrain()) {\\\\n    baseDamage -= armor;\\\\n    baseDamage = Math.max(1, baseDamage);\\\\n}\\\\n\\\\n// Declare Bonus Damage\\\\nlet bonusDamage = stat + (((a.level || a.luk) + stat) / 8);\\\\n\\\\n// Declare Final Damage\\\\nlet value = baseDamage * bonusDamage * sign;\\\\n\\\\n// Return Value\\\\nreturn isNaN(value) ? 0 : value;\\\"\",\"ItemsEquipsCore\":\"\",\"DamageType\":\"\",\"DamageType1:str\":\"%1 Damage Power\",\"DamageType2:str\":\"%1 Damage Power\",\"DamageType3:str\":\"%1 Recovery Power\",\"DamageType4:str\":\"%1 Recovery Power\",\"DamageType5:str\":\"%1 Drain Power\",\"DamageType6:str\":\"%1 Drain Power\",\"DamageDisplay:func\":\"\\\"// Define Constants\\\\nconst item = this._item;\\\\nconst formula = item.damage.formula;\\\\nconst a = this._tempActorA;\\\\nconst b = this._tempActorB;\\\\nconst user = a;\\\\nconst target = b;\\\\n\\\\n// Return Value\\\\ntry {\\\\n    return formula;\\\\n} catch (e) {\\\\n    if ($gameTemp.isPlaytest()) {\\\\n        console.log('Damage Formula Error for %1'.format(this._item.name));\\\\n    }\\\\n    return '?????';\\\\n}\\\"\"}","{\"Name:str\":\"FF10\",\"Formula:func\":\"\\\"// Define Constants\\\\nconst user = this.subject();\\\\nconst target = arguments[0];\\\\nconst item = this.item();\\\\nconst a = this.subject();\\\\nconst b = target;\\\\nconst v = $gameVariables._data;\\\\nconst sign = [3, 4].includes(item.damage.type) ? -1 : 1;\\\\n\\\\n// Create Damage Constant\\\\nconst power = Math.max(eval(item.damage.formula), 0);\\\\nif (this.isCertainHit()) {\\\\n    return (isNaN(power) ? 0 : power) * sign;\\\\n}\\\\n\\\\n// Create Damage Offense Value\\\\nlet value = power;\\\\n\\\\nif (this.isPhysical() && (this.isDamage() || this.isDrain())) {\\\\n    value = (((a.atk ** 3) / 32) + 32) * power / 16;\\\\n} else if (this.isMagical() && (this.isDamage() || this.isDrain())) {\\\\n    value = power * ((a.mat ** 2 / 6) + power) / 4;\\\\n} else if (this.isPhysical() && this.isRecover()) {\\\\n    value = power * ((a.def + power) / 2);\\\\n} else if (this.isMagical() && this.isRecover()) {\\\\n    value = power * ((a.mdf + power) / 2);\\\\n}\\\\n\\\\n// Apply Damage Defense Value\\\\nif (this.isDamage() || this.isDrain()) {\\\\n    let armor = this.isPhysical() ? b.def : b.mdf;\\\\n    armor = this.applyArmorModifiers(b, armor);\\\\n    armor = Math.max(armor, 1);\\\\n    value *= ((((armor - 280.4) ** 2) / 110) / 16) / 730;\\\\n    value *= (730 - (armor * 51 - (armor ** 2) / 11) / 10) / 730;\\\\n} else if (this.isRecover()) {\\\\n    value *= -1;\\\\n}\\\\n\\\\n// Return Value\\\\nreturn isNaN(value) ? 0 : value;\\\"\",\"ItemsEquipsCore\":\"\",\"DamageType\":\"\",\"DamageType1:str\":\"%1 Damage Power\",\"DamageType2:str\":\"%1 Damage Power\",\"DamageType3:str\":\"%1 Recovery Power\",\"DamageType4:str\":\"%1 Recovery Power\",\"DamageType5:str\":\"%1 Drain Power\",\"DamageType6:str\":\"%1 Drain Power\",\"DamageDisplay:func\":\"\\\"// Define Constants\\\\nconst item = this._item;\\\\nconst formula = item.damage.formula;\\\\nconst a = this._tempActorA;\\\\nconst b = this._tempActorB;\\\\nconst user = a;\\\\nconst target = b;\\\\n\\\\n// Return Value\\\\ntry {\\\\n    return formula;\\\\n} catch (e) {\\\\n    if ($gameTemp.isPlaytest()) {\\\\n        console.log('Damage Formula Error for %1'.format(this._item.name));\\\\n    }\\\\n    return '?????';\\\\n}\\\"\"}","{\"Name:str\":\"MK\",\"Formula:func\":\"\\\"// Define Constants\\\\nconst user = this.subject();\\\\nconst target = arguments[0];\\\\nconst item = this.item();\\\\nconst a = this.subject();\\\\nconst b = target;\\\\nconst v = $gameVariables._data;\\\\nconst sign = [3, 4].includes(item.damage.type) ? -1 : 1;\\\\n\\\\n// Create Multiplier\\\\nconst multiplier = Math.max(eval(item.damage.formula), 0);\\\\n\\\\n// Declare Values\\\\nlet armor = this.isPhysical() ? b.def : b.mdf;\\\\narmor = this.applyArmorModifiers(target, armor);\\\\nconst denominator = Math.max(200 + armor, 1);\\\\n\\\\n// Calculate Damage \\\\nlet value = 0;\\\\nif (this.isPhysical() && (this.isDamage() || this.isDrain())) {\\\\n    value = 200 * a.atk / denominator;\\\\n} else if (this.isMagical() && (this.isDamage() || this.isDrain())) {\\\\n    value = 200 * a.mat / denominator;\\\\n} else if (this.isPhysical() && this.isRecover()) {\\\\n    value = 200 * a.def / 200;\\\\n} else if (this.isMagical() && this.isRecover()) {\\\\n    value = 200 * a.mdf / 200;\\\\n}\\\\nvalue *= multiplier;\\\\n\\\\n// Return Value\\\\nreturn (isNaN(value) ? 0 : value) * sign;\\\"\",\"ItemsEquipsCore\":\"\",\"DamageType\":\"\",\"DamageType1:str\":\"%1 Damage Multiplier\",\"DamageType2:str\":\"%1 Damage Multiplier\",\"DamageType3:str\":\"%1 Recovery Multiplier\",\"DamageType4:str\":\"%1 Recovery Multiplier\",\"DamageType5:str\":\"%1 Drain Multiplier\",\"DamageType6:str\":\"%1 Drain Multiplier\",\"DamageDisplay:func\":\"\\\"// Define Constants\\\\nconst item = this._item;\\\\nconst formula = item.damage.formula;\\\\nconst a = this._tempActorA;\\\\nconst b = this._tempActorB;\\\\nconst user = a;\\\\nconst target = b;\\\\n\\\\n// Return Value\\\\ntry {\\\\n    const value = Math.max(eval(formula), 0);\\\\n    return '%1%'.format(Math.round(value * 100));\\\\n} catch (e) {\\\\n    if ($gameTemp.isPlaytest()) {\\\\n        console.log('Damage Formula Error for %1'.format(this._item.name));\\\\n    }\\\\n    return '?????';\\\\n}\\\"\"}","{\"Name:str\":\"MOBA\",\"Formula:func\":\"\\\"// Define Constants\\\\nconst user = this.subject();\\\\nconst target = arguments[0];\\\\nconst item = this.item();\\\\nconst a = this.subject();\\\\nconst b = target;\\\\nconst v = $gameVariables._data;\\\\nconst sign = [3, 4].includes(item.damage.type) ? -1 : 1;\\\\n\\\\n// Create Damage Value\\\\nlet value = Math.max(eval(item.damage.formula), 0) * sign;\\\\n\\\\n// Apply Attacker's Offense Parameter\\\\nif (this.isPhysical() && (this.isDamage() || this.isDrain())) {\\\\n    value *= a.atk;\\\\n} else if (this.isMagical() && (this.isDamage() || this.isDrain())) {\\\\n    value *= a.mat;\\\\n} else if (this.isPhysical() && this.isRecover()) {\\\\n    value *= a.def;\\\\n} else if (this.isMagical() && this.isRecover()) {\\\\n    value *= a.mdf;\\\\n}\\\\n\\\\n// Apply Defender's Defense Parameter\\\\nif (this.isDamage() && !this.isCertainHit()) {\\\\n\\\\n    // Calculate Base Armor\\\\n    let armor = this.isPhysical() ? b.def : b.mdf;\\\\n    armor = this.applyArmorModifiers(target, armor);\\\\n\\\\n    // Apply Armor to Damage\\\\n    if (armor >= 0) {\\\\n        value *= 100 / (100 + armor);\\\\n    } else {\\\\n        value *= 2 - (100 / (100 - armor));\\\\n    }\\\\n}\\\\n\\\\n// Return Value\\\\nreturn isNaN(value) ? 0 : value;\\\"\",\"ItemsEquipsCore\":\"\",\"DamageType\":\"\",\"DamageType1:str\":\"%1 Damage Multiplier\",\"DamageType2:str\":\"%1 Damage Multiplier\",\"DamageType3:str\":\"%1 Recovery Multiplier\",\"DamageType4:str\":\"%1 Recovery Multiplier\",\"DamageType5:str\":\"%1 Drain Multiplier\",\"DamageType6:str\":\"%1 Drain Multiplier\",\"DamageDisplay:func\":\"\\\"// Define Constants\\\\nconst item = this._item;\\\\nconst formula = item.damage.formula;\\\\nconst a = this._tempActorA;\\\\nconst b = this._tempActorB;\\\\nconst user = a;\\\\nconst target = b;\\\\n\\\\n// Return Value\\\\ntry {\\\\n    const value = Math.max(eval(formula), 0);\\\\n    return '%1%'.format(Math.round(value * 100));\\\\n} catch (e) {\\\\n    if ($gameTemp.isPlaytest()) {\\\\n        console.log('Damage Formula Error for %1'.format(this._item.name));\\\\n    }\\\\n    return '?????';\\\\n}\\\"\"}","{\"Name:str\":\"PKMN\",\"Formula:func\":\"\\\"// Define Constants\\\\nconst user = this.subject();\\\\nconst target = arguments[0];\\\\nconst item = this.item();\\\\nconst a = this.subject();\\\\nconst b = target;\\\\nconst v = $gameVariables._data;\\\\nconst sign = [3, 4].includes(item.damage.type) ? -1 : 1;\\\\n\\\\n// Create Power\\\\nconst power = Math.max(eval(item.damage.formula), 0);\\\\n\\\\n// Declare Values\\\\nlet value = 0;\\\\nlet level = Math.max(a.level || a.luk, 1);\\\\nlet armor = this.isPhysical() ? b.def : b.mdf;\\\\narmor = Math.max(this.applyArmorModifiers(target, armor), 0);\\\\nlet attackStat = 0;\\\\nif (this.isPhysical() && (this.isDamage() || this.isDrain())) {\\\\n    attackStat = a.atk;\\\\n} else if (this.isMagical() && (this.isDamage() || this.isDrain())) {\\\\n    attackStat =  a.mat;\\\\n} else if (this.isPhysical() && this.isRecover()) {\\\\n    attackStat =  a.def;\\\\n} else if (this.isMagical() && this.isRecover()) {\\\\n    attackStat =  a.mdf;\\\\n}\\\\n\\\\n// Calculate Damage\\\\nvalue = (((((2 * level) / 5) + 2) * power * (attackStat / armor)) / 50) + 2;\\\\n\\\\n// Return Value\\\\nreturn (isNaN(value) ? 0 : value) * sign;\\\"\",\"ItemsEquipsCore\":\"\",\"DamageType\":\"\",\"DamageType1:str\":\"%1 Damage Power\",\"DamageType2:str\":\"%1 Damage Power\",\"DamageType3:str\":\"%1 Recovery Power\",\"DamageType4:str\":\"%1 Recovery Power\",\"DamageType5:str\":\"%1 Drain Power\",\"DamageType6:str\":\"%1 Drain Power\",\"DamageDisplay:func\":\"\\\"// Define Constants\\\\nconst item = this._item;\\\\nconst formula = item.damage.formula;\\\\nconst a = this._tempActorA;\\\\nconst b = this._tempActorB;\\\\nconst user = a;\\\\nconst target = b;\\\\n\\\\n// Return Value\\\\ntry {\\\\n    return formula;\\\\n} catch (e) {\\\\n    if ($gameTemp.isPlaytest()) {\\\\n        console.log('Damage Formula Error for %1'.format(this._item.name));\\\\n    }\\\\n    return '?????';\\\\n}\\\"\"}"]
 *
 */
/* ----------------------------------------------------------------------------
 * Damage Formula Style
 * ----------------------------------------------------------------------------
 */
/*~struct~DamageStyle:
 *
 * @param Name:str
 * @text Name
 * @desc Name of this Damage Style.
 * Used for notetags and such.
 * @default Untitled
 *
 * @param Formula:func
 * @text JS: Formula
 * @parent Name:str
 * @type note
 * @desc The base formula for this Damage Style.
 * @default "// Define Constants\nconst item = this.item();\nconst a = this.subject();\nconst b = target;\nconst sign = [3, 4].includes(item.damage.type) ? -1 : 1;\n\n// Create Damage Value\nlet value = Math.max(eval(item.damage.formula), 0) * sign;\n\n// Return Value\nreturn isNaN(value) ? 0 : value;"
 *
 * @param ItemsEquipsCore
 * @text Items & Equips Core
 *
 * @param DamageType
 * @text Damage Label
 * @parent ItemsEquipsCore
 *
 * @param DamageType1:str
 * @text HP Damage
 * @parent DamageType
 * @desc Vocabulary used for this data entry.
 * @default %1 Damage Multiplier
 *
 * @param DamageType2:str
 * @text MP Damage
 * @parent DamageType
 * @desc Vocabulary used for this data entry.
 * @default %1 Damage Multiplier
 *
 * @param DamageType3:str
 * @text HP Recovery
 * @parent DamageType
 * @desc Vocabulary used for this data entry.
 * @default %1 Recovery Multiplier
 *
 * @param DamageType4:str
 * @text MP Recovery
 * @parent DamageType
 * @desc Vocabulary used for this data entry.
 * @default %1 Recovery Multiplier
 *
 * @param DamageType5:str
 * @text HP Drain
 * @parent DamageType
 * @desc Vocabulary used for this data entry.
 * @default %1 Drain Multiplier
 *
 * @param DamageType6:str
 * @text MP Drain
 * @parent DamageType
 * @desc Vocabulary used for this data entry.
 * @default %1 Drain Multiplier
 *
 * @param DamageDisplay:func
 * @text JS: Damage Display
 * @parent ItemsEquipsCore
 * @type note
 * @desc Code used the data displayed for this category.
 * @default "// Define Constants\nconst item = this._item;\nconst formula = item.damage.formula;\nconst a = this._tempActorA;\nconst b = this._tempActorB;\nconst user = a;\nconst target = b;\n\n// Return Value\ntry {\n    const value = Math.max(eval(formula), 0);\n    return '%1%'.format(Math.round(value * 100));\n} catch (e) {\n    if ($gameTemp.isPlaytest()) {\n        console.log('Damage Formula Error for %1'.format(this._item.name));\n    }\n    return '?????';\n}"
 *
 */
/* ----------------------------------------------------------------------------
 * Mechanics Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Mechanics:
 *
 * @param ActionSpeed
 * @text Action Speed
 *
 * @param AllowRandomSpeed:eval
 * @text Allow Random Speed?
 * @parent ActionSpeed
 * @type boolean
 * @on Allow
 * @off Disable
 * @desc Allow speed to be randomized base off the user's AGI?
 * @default false
 *
 * @param CalcActionSpeedJS:func
 * @text JS: Calculate
 * @parent ActionSpeed
 * @type note
 * @desc Code used to calculate action speed.
 * @default "// Declare Constants\nconst agi = this.subject().agi;\n\n// Create Speed\nlet speed = agi;\nif (this.allowRandomSpeed()) {\n    speed += Math.randomInt(Math.floor(5 + agi / 4));\n}\nif (this.item()) {\n    speed += this.item().speed;\n}\nif (this.isAttack()) {\n    speed += this.subject().attackSpeed();\n}\n\n// Return Speed\nreturn speed;"
 *
 * @param BaseTroop
 * @text Base Troop
 *
 * @param BaseTroopIDs:arraynum
 * @text Base Troop ID's
 * @parent BaseTroop
 * @type troop[]
 * @desc Select the Troop ID(s) to duplicate page events from for all other troops.
 * @default ["1"]
 *
 * @param CommonEvents
 * @text Common Events (on Map)
 *
 * @param BattleStartEvent:num
 * @text Pre-Battle Event
 * @parent CommonEvents
 * @type common_event
 * @desc Common Event to run before each battle on map.
 * Use to 0 to not run any Common Event at all.
 * @default 0
 *
 * @param BattleEndEvent:num
 * @text Post-Battle Event
 * @parent CommonEvents
 * @type common_event
 * @desc Queued Common Event to run after each battle on map.
 * Use to 0 to not run any Common Event at all.
 * @default 0
 *
 * @param VictoryEvent:num
 * @text Victory Event
 * @parent CommonEvents
 * @type common_event
 * @desc Queued Common Event to run upon victory on map.
 * Use to 0 to not run any Common Event at all.
 * @default 0
 *
 * @param DefeatEvent:num
 * @text Defeat Event
 * @parent CommonEvents
 * @type common_event
 * @desc Queued Common Event to run upon defeat on map.
 * Use to 0 to not run any Common Event at all.
 * @default 0
 *
 * @param EscapeSuccessEvent:num
 * @text Escape Success Event
 * @parent CommonEvents
 * @type common_event
 * @desc Queued Common Event to run upon escape success on map.
 * Use to 0 to not run any Common Event at all.
 * @default 0
 *
 * @param EscapeFailEvent:num
 * @text Escape Fail Event
 * @parent CommonEvents
 * @type common_event
 * @desc Queued Common Event to run upon escape failure on map.
 * Use to 0 to not run any Common Event at all.
 * @default 0
 *
 * @param Escape
 *
 * @param CalcEscapeRatioJS:func
 * @text JS: Calc Escape Ratio
 * @parent Escape
 * @type note
 * @desc Code used to calculate the escape success ratio.
 * @default "// Calculate Escape Ratio\nlet ratio = 0.5;\nratio *= $gameParty.agility();\nratio /= $gameTroop.agility();\n\n// Return Ratio\nreturn ratio;"
 *
 * @param CalcEscapeRaiseJS:func
 * @text JS: Calc Escape Raise
 * @parent Escape
 * @type note
 * @desc Code used to calculate how much the escape success ratio raises upon each failure.
 * @default "// Calculate Escape Ratio\nlet value = 0.1;\nvalue += $gameParty.aliveMembers().length;\n\n// Return Value\nreturn value;"
 *
 * @param BattleJS
 * @text JS: Battle-Related
 * 
 * @param PreStartBattleJS:func
 * @text JS: Pre-Start Battle
 * @parent BattleJS
 * @type note
 * @desc Target function: BattleManager.startBattle()
 * JavaScript code occurs before function is run.
 * @default "// Declare Constants\nconst user = this;\nconst target = user;\nconst a = user;\nconst b = user;\n\n// Perform Actions\n"
 *
 * @param PostStartBattleJS:func
 * @text JS: Post-Start Battle
 * @parent BattleJS
 * @type note
 * @desc Target function: BattleManager.startBattle()
 * JavaScript code occurs after function is run.
 * @default "// Declare Constants\nconst user = this;\nconst target = user;\nconst a = user;\nconst b = user;\n\n// Perform Actions\n"
 * 
 * @param BattleVictoryJS:func
 * @text JS: Battle Victory
 * @parent BattleJS
 * @type note
 * @desc Target function: BattleManager.processVictory()
 * JavaScript code occurs before function is run.
 * @default "// Declare Constants\nconst user = this;\nconst target = user;\nconst a = user;\nconst b = user;\n\n// Perform Actions\n"
 *
 * @param EscapeSuccessJS:func
 * @text JS: Escape Success
 * @parent BattleJS
 * @type note
 * @desc Target function: BattleManager.onEscapeSuccess()
 * JavaScript code occurs before function is run.
 * @default "// Declare Constants\nconst user = this;\nconst target = user;\nconst a = user;\nconst b = user;\n\n// Perform Actions\n"
 *
 * @param EscapeFailureJS:func
 * @text JS: Escape Failure
 * @parent BattleJS
 * @type note
 * @desc Target function: BattleManager.onEscapeFailure()
 * JavaScript code occurs before function is run.
 * @default "// Declare Constants\nconst user = this;\nconst target = user;\nconst a = user;\nconst b = user;\n\n// Perform Actions\n"
 * 
 * @param BattleDefeatJS:func
 * @text JS: Battle Defeat
 * @parent BattleJS
 * @type note
 * @desc Target function: BattleManager.processDefeat()
 * JavaScript code occurs before function is run.
 * @default "// Declare Constants\nconst user = this;\nconst target = user;\nconst a = user;\nconst b = user;\n\n// Perform Actions\n"
 * 
 * @param PreEndBattleJS:func
 * @text JS: Pre-End Battle
 * @parent BattleJS
 * @type note
 * @desc Target function: BattleManager.endBattle()
 * JavaScript code occurs before function is run.
 * @default "// Declare Constants\nconst user = this;\nconst target = user;\nconst a = user;\nconst b = user;\n\n// Perform Actions\n"
 *
 * @param PostEndBattleJS:func
 * @text JS: Post-End Battle
 * @parent BattleJS
 * @type note
 * @desc Target function: BattleManager.endBattle()
 * JavaScript code occurs after function is run.
 * @default "// Declare Constants\nconst user = this;\nconst target = user;\nconst a = user;\nconst b = user;\n\n// Perform Actions\n"
 *
 * @param TurnJS
 * @text JS: Turn-Related
 *
 * @param PreStartTurnJS:func
 * @text JS: Pre-Start Turn
 * @parent TurnJS
 * @type note
 * @desc Target function: BattleManager.startTurn()
 * JavaScript code occurs before function is run.
 * @default "// Declare Constants\nconst user = this;\nconst target = user;\nconst a = user;\nconst b = user;\n\n// Perform Actions\n"
 *
 * @param PostStartTurnJS:func
 * @text JS: Post-Start Turn
 * @parent TurnJS
 * @type note
 * @desc Target function: BattleManager.startTurn()
 * JavaScript code occurs after function is run.
 * @default "// Declare Constants\nconst user = this;\nconst target = user;\nconst a = user;\nconst b = user;\n\n// Perform Actions\n"
 *
 * @param PreEndTurnJS:func
 * @text JS: Pre-End Turn
 * @parent TurnJS
 * @type note
 * @desc Target function: Game_Battler.prototype.onTurnEnd()
 * JavaScript code occurs before function is run.
 * @default "// Declare Constants\nconst user = this;\nconst target = user;\nconst a = user;\nconst b = user;\n\n// Perform Actions\n"
 *
 * @param PostEndTurnJS:func
 * @text JS: Post-End Turn
 * @parent TurnJS
 * @type note
 * @desc Target function: Game_Battler.prototype.onTurnEnd()
 * JavaScript code occurs after function is run.
 * @default "// Declare Constants\nconst user = this;\nconst target = user;\nconst a = user;\nconst b = user;\n\n// Perform Actions\n"
 *
 * @param PreRegenerateJS:func
 * @text JS: Pre-Regenerate
 * @parent TurnJS
 * @type note
 * @desc Target function: Game_Battler.prototype.regenerateAll()
 * JavaScript code occurs before function is run.
 * @default "// Declare Constants\nconst user = this;\nconst target = user;\nconst a = user;\nconst b = user;\n\n// Perform Actions\n"
 *
 * @param PostRegenerateJS:func
 * @text JS: Post-Regenerate
 * @parent TurnJS
 * @type note
 * @desc Target function: Game_Battler.prototype.regenerateAll()
 * JavaScript code occurs after function is run.
 * @default "// Declare Constants\nconst user = this;\nconst target = user;\nconst a = user;\nconst b = user;\n\n// Perform Actions\n"
 *
 * @param ActionJS
 * @text JS: Action-Related
 *
 * @param PreStartActionJS:func
 * @text JS: Pre-Start Action
 * @parent ActionJS
 * @type note
 * @desc Target function: BattleManager.startAction()
 * JavaScript code occurs before function is run.
 * @default "// Declare Constants\nconst value = arguments[0];\nconst user = this.subject();\nconst target = user;\nconst a = user;\nconst b = user;\nconst action = this;\nconst item = this.item();\nconst skill = this.item();\n\n// Perform Actions\n"
 *
 * @param PostStartActionJS:func
 * @text JS: Post-Start Action
 * @parent ActionJS
 * @type note
 * @desc Target function: BattleManager.startAction()
 * JavaScript code occurs after function is run.
 * @default "// Declare Constants\nconst value = arguments[0];\nconst user = this.subject();\nconst target = user;\nconst a = user;\nconst b = user;\nconst action = this;\nconst item = this.item();\nconst skill = this.item();\n\n// Perform Actions\n"
 *
 * @param PreApplyJS:func
 * @text JS: Pre-Apply
 * @parent ActionJS
 * @type note
 * @desc Target function: Game_Action.prototype.apply()
 * JavaScript code occurs before function is run.
 * @default "// Declare Constants\nconst value = arguments[0];\nconst target = arguments[1];\nconst user = this.subject();\nconst a = user;\nconst b = target;\nconst action = this;\nconst item = this.item();\nconst skill = this.item();\n\n// Perform Actions\n\n// Return Value\nreturn value;"
 *
 * @param PreDamageJS:func
 * @text JS: Pre-Damage
 * @parent ActionJS
 * @type note
 * @desc Target function: Game_Action.prototype.executeDamage()
 * JavaScript code occurs before function is run.
 * @default "// Declare Constants\nconst value = arguments[0];\nconst target = arguments[1];\nconst user = this.subject();\nconst a = user;\nconst b = target;\nconst action = this;\nconst item = this.item();\nconst skill = this.item();\n\n// Perform Actions\n\n// Return Value\nreturn value;"
 *
 * @param PostDamageJS:func
 * @text JS: Post-Damage
 * @parent ActionJS
 * @type note
 * @desc Target function: Game_Action.prototype.executeDamage()
 * JavaScript code occurs after function is run.
 * @default "// Declare Constants\nconst value = arguments[0];\nconst target = arguments[1];\nconst user = this.subject();\nconst a = user;\nconst b = target;\nconst action = this;\nconst item = this.item();\nconst skill = this.item();\n\n// Perform Actions\n\n// Return Value\nreturn value;"
 *
 * @param PostApplyJS:func
 * @text JS: Post-Apply
 * @parent ActionJS
 * @type note
 * @desc Target function: Game_Action.prototype.apply()
 * JavaScript code occurs after function is run.
 * @default "// Declare Constants\nconst value = arguments[0];\nconst target = arguments[1];\nconst user = this.subject();\nconst a = user;\nconst b = target;\nconst action = this;\nconst item = this.item();\nconst skill = this.item();\n\n// Perform Actions\n\n// Return Value\nreturn value;"
 *
 * @param PreEndActionJS:func
 * @text JS: Pre-End Action
 * @parent ActionJS
 * @type note
 * @desc Target function: BattleManager.endAction()
 * JavaScript code occurs before function is run.
 * @default "// Declare Constants\nconst value = arguments[0];\nconst user = this.subject();\nconst target = user;\nconst a = user;\nconst b = user;\nconst action = this;\nconst item = this.item();\nconst skill = this.item();\n\n// Perform Actions\n"
 *
 * @param PostEndActionJS:func
 * @text JS: Post-End Action
 * @parent ActionJS
 * @type note
 * @desc Target function: BattleManager.endAction()
 * JavaScript code occurs after function is run.
 * @default "// Declare Constants\nconst value = arguments[0];\nconst user = this.subject();\nconst target = user;\nconst a = user;\nconst b = user;\nconst action = this;\nconst item = this.item();\nconst skill = this.item();\n\n// Perform Actions\n"
 *
 */
/* ----------------------------------------------------------------------------
 * Battle Layout Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~BattleLayout:
 *
 * @param Style:str
 * @text Battle Layout Style
 * @type select
 * @option Default - Shows actor faces in Battle Status.
 * @value default
 * @option List - Lists actors in Battle Status.
 * @value list
 * @option XP - Shows actor battlers in a stretched Battle Status.
 * @value xp
 * @option Portrait - Shows portraits in a stretched Battle Status.
 * @value portrait
 * @option Border - Displays windows around the screen border.
 * @value border
 * @desc The style used for the battle layout.
 * @default default
 *
 * @param ListStyle
 * @text List Style
 * @parent Style:str
 *
 * @param ShowFacesListStyle:eval
 * @text Show Faces
 * @parent ListStyle
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Shows faces in List Style?
 * @default true
 *
 * @param CommandWidth:num
 * @text Command Window Width
 * @parent ListStyle
 * @type number
 * @min 1
 * @desc Determine the window width for the Party and Actor Command
 * Windows. Affects Default and List Battle Layout styles.
 * @default 192
 *
 * @param XPStyle
 * @text XP Style
 * @parent Style:str
 *
 * @param XPActorCommandLines:num
 * @text Command Lines
 * @parent XPStyle
 * @type number
 * @min 1
 * @desc Number of action lines in the Actor Command Window for the XP Style.
 * @default 4
 *
 * @param XPActorDefaultHeight:num
 * @text Sprite Height
 * @parent XPStyle
 * @type number
 * @min 1
 * @desc Default sprite height used when if the sprite's height has not been determined yet.
 * @default 64
 *
 * @param XPSpriteYLocation:str
 * @text Sprite Base Location
 * @parent XPStyle
 * @type select
 * @option Above Name - Sprite is located above the name.
 * @value name
 * @option Bottom - Sprite is located at the bottom of the window.
 * @value bottom
 * @option Centered - Sprite is centered in the window.
 * @value center
 * @option Top - Sprite is located at the top of the window.
 * @value top
 * @desc Determine where the sprite is located on the Battle Status Window.
 * @default name
 *
 * @param PotraitStyle
 * @text Portrait Style
 * @parent Style:str
 *
 * @param ShowPortraits:eval
 * @text Show Portraits?
 * @parent PotraitStyle
 * @type boolean
 * @on Portraits
 * @off Faces
 * @desc Requires VisuMZ_1_MainMenuCore.
 * Shows the actor's portrait instead of a face.
 * @default true
 *
 * @param PortraitScale:num
 * @text Portrait Scaling
 * @parent PotraitStyle
 * @desc If portraits are used, scale them by this much.
 * @default 0.5
 *
 * @param BorderStyle
 * @text Border Style
 * @parent Style:str
 *
 * @param SkillItemBorderCols:num
 * @text Columns
 * @parent BorderStyle
 * @type number
 * @min 1
 * @desc The total number of columns for Skill & Item Windows
 * in the battle scene.
 * @default 1
 *
 * @param ShowPortraitsBorderStyle:eval
 * @text Show Portraits?
 * @parent BorderStyle
 * @type boolean
 * @on Portraits
 * @off Faces
 * @desc Requires VisuMZ_1_MainMenuCore.
 * Shows the actor's portrait at the edge of the screen.
 * @default true
 *
 * @param PortraitScaleBorderStyle:num
 * @text Portrait Scaling
 * @parent BorderStyle
 * @desc If portraits are used, scale them by this much.
 * @default 1.0
 *
 * @param SkillItemWindows
 * @text Skill & Item Windows
 *
 * @param SkillItemMiddleLayout:eval
 * @text Middle Layout
 * @parent SkillItemWindows
 * @type boolean
 * @on Middle
 * @off Bottom
 * @desc Shows the Skill & Item Windows in mid-screen?
 * @default false
 *
 * @param SkillItemStandardCols:num
 * @text Columns
 * @parent SkillItemWindows
 * @type number
 * @min 1
 * @desc The total number of columns for Skill & Item Windows
 * in the battle scene.
 * @default 2
 *
 */
/* ----------------------------------------------------------------------------
 * Battle Log Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~BattleLog:
 *
 * @param General
 *
 * @param BackColor:str
 * @text Back Color
 * @parent General
 * @desc Use #rrggbb for a hex color.
 * @default #000000
 *
 * @param MaxLines:num
 * @text Max Lines
 * @parent General
 * @type number
 * @min 1
 * @desc Maximum number of lines to be displayed.
 * @default 10
 *
 * @param MessageWait:num
 * @text Message Wait
 * @parent General
 * @type number
 * @min 1
 * @desc Number of frames for a usual message wait.
 * @default 16
 *
 * @param TextAlign:str
 * @text Text Align
 * @parent General
 * @type combo
 * @option left
 * @option center
 * @option right
 * @desc Text alignment for the Window_BattleLog.
 * @default center
 *
 * @param BattleLogRectJS:func
 * @text JS: X, Y, W, H
 * @parent General
 * @type note
 * @desc Code used to determine the dimensions for the battle log.
 * @default "const wx = 0;\nconst wy = 0;\nconst ww = Graphics.boxWidth;\nconst wh = this.calcWindowHeight(10, false);\nreturn new Rectangle(wx, wy, ww, wh);"
 *
 * @param StartTurn
 * @text Start Turn
 *
 * @param StartTurnShow:eval
 * @text Show Start Turn?
 * @parent StartTurn
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Display turn changes at the start of the turn?
 * @default false
 *
 * @param StartTurnMsg:str
 * @text Start Turn Message
 * @parent StartTurn
 * @desc Message displayed at turn start.
 * %1 - Turn Count
 * @default Turn %1
 *
 * @param StartTurnWait:num
 * @text Start Turn Wait
 * @parent StartTurn
 * @type number
 * @min 1
 * @desc Number of frames to wait after a turn started.
 * @default 40
 *
 * @param DisplayAction
 * @text Display Action
 *
 * @param ActionCenteredName:eval
 * @text Show Centered Action?
 * @parent DisplayAction
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Display a centered text of the action name?
 * @default true
 *
 * @param ActionSkillMsg1:eval
 * @text Show Skill Message 1?
 * @parent DisplayAction
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Display the 1st skill message?
 * @default false
 *
 * @param ActionSkillMsg2:eval
 * @text Show Skill Message 2?
 * @parent DisplayAction
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Display the 2nd skill message?
 * @default true
 *
 * @param ActionItemMsg:eval
 * @text Show Item Message?
 * @parent DisplayAction
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Display the item use message?
 * @default false
 *
 * @param ActionChanges
 * @text Action Changes
 *
 * @param ShowCounter:eval
 * @text Show Counter?
 * @parent ActionChanges
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Display counter text?
 * @default true
 *
 * @param ShowReflect:eval
 * @text Show Reflect?
 * @parent ActionChanges
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Display magic reflection text?
 * @default true
 *
 * @param ShowSubstitute:eval
 * @text Show Substitute?
 * @parent ActionChanges
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Display substitute text?
 * @default true
 *
 * @param ActionResults
 * @text Action Results
 *
 * @param ShowFailure:eval
 * @text Show No Effect?
 * @parent ActionResults
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Display no effect text?
 * @default false
 *
 * @param ShowCritical:eval
 * @text Show Critical?
 * @parent ActionResults
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Display critical text?
 * @default false
 *
 * @param ShowMissEvasion:eval
 * @text Show Miss/Evasion?
 * @parent ActionResults
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Display miss/evasion text?
 * @default false
 *
 * @param ShowHpDmg:eval
 * @text Show HP Damage?
 * @parent ActionResults
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Display HP Damage text?
 * @default false
 *
 * @param ShowMpDmg:eval
 * @text Show MP Damage?
 * @parent ActionResults
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Display MP Damage text?
 * @default false
 *
 * @param ShowTpDmg:eval
 * @text Show TP Damage?
 * @parent ActionResults
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Display TP Damage text?
 * @default false
 *
 * @param DisplayStates
 * @text Display States
 *
 * @param ShowAddedState:eval
 * @text Show Added States?
 * @parent DisplayStates
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Display added states text?
 * @default false
 *
 * @param ShowRemovedState:eval
 * @text Show Removed States?
 * @parent DisplayStates
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Display removed states text?
 * @default false
 *
 * @param ShowCurrentState:eval
 * @text Show Current States?
 * @parent DisplayStates
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Display the currently affected state text?
 * @default false
 *
 * @param ShowAddedBuff:eval
 * @text Show Added Buffs?
 * @parent DisplayStates
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Display added buffs text?
 * @default false
 *
 * @param ShowAddedDebuff:eval
 * @text Show Added Debuffs?
 * @parent DisplayStates
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Display added debuffs text?
 * @default false
 *
 * @param ShowRemovedBuff:eval
 * @text Show Removed Buffs?
 * @parent DisplayStates
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Display removed de/buffs text?
 * @default false
 *
 */
/* ----------------------------------------------------------------------------
 * Battleback Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Battleback:
 *
 * @param DefaultStyle:str
 * @text Default Style
 * @type select
 * @option MZ (MZ's default style)
 * @value MZ
 * @option 1:1 (No Scaling)
 * @value 1:1
 * @option Scale To Fit (Scale to screen size)
 * @value ScaleToFit
 * @option Scale Down (Scale Downward if Larger than Screen)
 * @value ScaleDown
 * @option Scale Up (Scale Upward if Smaller than Screen)
 * @value ScaleUp
 * @desc The default scaling style used for battlebacks.
 * @default MZ
 *
 * @param jsOneForOne:func
 * @text JS: 1:1
 * @type note
 * @desc This code gives you control over the scaling for this style.
 * @default "// Adjust Size\nthis.width = Graphics.width;\nthis.height = Graphics.height;\n\n// Adjust Scale\nconst scale = 1.0;\nthis.scale.x = scale;\nthis.scale.y = scale;\n\n// Adjust Coordinates\nthis.x = 0;\nthis.y = 0;"
 *
 * @param jsScaleToFit:func
 * @text JS: Scale To Fit
 * @type note
 * @desc This code gives you control over the scaling for this style.
 * @default "// Adjust Size\nthis.width = Graphics.width;\nthis.height = Graphics.height;\n\n// Adjust Scale\nconst ratioX = this.width / this.bitmap.width;\nconst ratioY = this.height / this.bitmap.height;\nconst scale = Math.max(ratioX, ratioY);\nthis.scale.x = scale;\nthis.scale.y = scale;\n\n// Adjust Coordinates\nthis.x = (Graphics.width - this.width) / 2;\nthis.y = Graphics.height - this.height;"
 *
 * @param jsScaleDown:func
 * @text JS: Scale Down
 * @type note
 * @desc This code gives you control over the scaling for this style.
 * @default "// Adjust Size\nthis.width = Graphics.width;\nthis.height = Graphics.height;\n\n// Adjust Scale\nconst ratioX = Math.min(1, this.width / this.bitmap.width);\nconst ratioY = Math.min(1, this.height / this.bitmap.height);\nconst scale = Math.max(ratioX, ratioY);\nthis.scale.x = scale;\nthis.scale.y = scale;\n\n// Adjust Coordinates\nthis.x = (Graphics.width - this.width) / 2;\nthis.y = Graphics.height - this.height;"
 *
 * @param jsScale Up:func
 * @text JS: Scale Up
 * @type note
 * @desc This code gives you control over the scaling for this style.
 * @default "// Adjust Size\nthis.width = Graphics.width;\nthis.height = Graphics.height;\n\n// Adjust Scale\nconst ratioX = Math.max(1, this.width / this.bitmap.width);\nconst ratioY = Math.max(1, this.height / this.bitmap.height);\nconst scale = Math.max(ratioX, ratioY);\nthis.scale.x = scale;\nthis.scale.y = scale;\n\n// Adjust Coordinates\nthis.x = (Graphics.width - this.width) / 2;\nthis.y = Graphics.height - this.height;"
 *
 */
/* ----------------------------------------------------------------------------
 * Party Command Window Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~PartyCmd:
 *
 * @param Cmd
 * @text Command Window
 *
 * @param CmdStyle:str
 * @text Style
 * @parent Cmd
 * @type select
 * @option Text Only
 * @value text
 * @option Icon Only
 * @value icon
 * @option Icon + Text
 * @value iconText
 * @option Automatic
 * @value auto
 * @desc How do you wish to draw commands in the Party Command Window?
 * @default auto
 *
 * @param CmdTextAlign:str
 * @text Text Align
 * @parent Cmd
 * @type combo
 * @option left
 * @option center
 * @option right
 * @desc Text alignment for the Party Command Window.
 * @default left
 *
 * @param CmdIconFight:num
 * @text Fight Icon
 * @parent Cmd
 * @desc The icon used for the Fight command.
 * @default 76
 *
 * @param CommandAddAutoBattle:eval
 * @text Add Auto Battle?
 * @parent Cmd
 * @type boolean
 * @on Add
 * @off Don't
 * @desc Add the "Auto Battle" command to the Command Window?
 * @default true
 *
 * @param CmdIconAutoBattle:num
 * @text Auto Battle Icon
 * @parent CommandAddAutoBattle:eval
 * @desc The icon used for the Auto Battle command.
 * @default 78
 *
 * @param CmdTextAutoBattle:str
 * @text Auto Battle Text
 * @parent CommandAddAutoBattle:eval
 * @desc The text used for the Auto Battle command.
 * @default Auto
 *
 * @param CommandAddOptions:eval
 * @text Add Options?
 * @parent Cmd
 * @type boolean
 * @on Add
 * @off Don't
 * @desc Add the "Options" command to the Command Window?
 * @default true
 *
 * @param CmdIconOptions:num
 * @text Options Icon
 * @parent CommandAddOptions:eval
 * @desc The icon used for the Options command.
 * @default 83
 *
 * @param ActiveTpbOptionsMessage:str
 * @text Active TPB Message
 * @parent CommandAddOptions:eval
 * @desc Message that will be displayed when selecting options during the middle of an action.
 * @default Options Menu queued after action is complete.
 *
 * @param CmdIconEscape:num
 * @text Escape Icon
 * @parent Cmd
 * @desc The icon used for the Escape command.
 * @default 82
 *
 * @param Access
 *
 * @param SkipPartyCmd:eval
 * @text Skip Party Command
 * @parent Access
 * @type boolean
 * @on Skip
 * @off Don't
 * @desc DTB: Skip Party Command selection on turn start.
 * TPB: Skip Party Command selection at battle start.
 * @default true
 *
 * @param DisablePartyCmd:eval
 * @text Disable Party Command
 * @parent Access
 * @type boolean
 * @on Disable
 * @off Don't
 * @desc Disable the Party Command Window entirely?
 * @default false
 *
 * @param HelpWindow
 * @text Help Window
 *
 * @param HelpFight:str
 * @text Fight
 * @parent HelpWindow
 * @desc Text displayed when selecting a skill type.
 * %1 - Skill Type Name
 * @default Select actions to fight.
 *
 * @param HelpAutoBattle:str
 * @text Auto Battle
 * @parent HelpWindow
 * @desc Text displayed when selecting the Auto Battle command.
 * @default Sets party to Auto Battle mode.
 *
 * @param HelpOptions:str
 * @text Options
 * @parent HelpWindow
 * @desc Text displayed when selecting the Options command.
 * @default Opens up the Options Menu.
 *
 * @param HelpEscape:str
 * @text Escape
 * @parent HelpWindow
 * @desc Text displayed when selecting the escape command.
 * @default Attempt to escape the battle.
 *
 */
/* ----------------------------------------------------------------------------
 * Actor Command Window Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ActorCmd:
 *
 * @param Cmd
 * @text Command Window
 *
 * @param CmdStyle:str
 * @text Style
 * @parent Cmd
 * @type select
 * @option Text Only
 * @value text
 * @option Icon Only
 * @value icon
 * @option Icon + Text
 * @value iconText
 * @option Automatic
 * @value auto
 * @desc How do you wish to draw commands in the Actor Command Window?
 * @default auto
 *
 * @param CmdTextAlign:str
 * @text Text Align
 * @parent Cmd
 * @type combo
 * @option left
 * @option center
 * @option right
 * @desc Text alignment for the Actor Command Window.
 * @default left
 *
 * @param CmdIconItem:num
 * @text Item Icon
 * @parent Cmd
 * @desc The icon used for the Item command.
 * @default 176
 *
 * @param IconStypeNorm:num
 * @text Normal SType Icon
 * @parent Cmd
 * @desc Icon used for normal skill types that aren't assigned any
 * icons. Ignore if VisuMZ_1_SkillsStatesCore is installed.
 * @default 78
 *
 * @param IconStypeMagic:num
 * @text Magic SType Icon
 * @parent Cmd
 * @desc Icon used for magic skill types that aren't assigned any
 * icons. Ignore if VisuMZ_1_SkillsStatesCore is installed.
 * @default 79
 *
 * @param BattleCmd
 * @text Battle Commands
 *
 * @param BattleCmdList:arraystr
 * @text Command List
 * @parent BattleCmd
 * @type combo[]
 * @option attack
 * @option skills
 * @option guard
 * @option item
 * @option party
 * @option escape
 * @option auto battle
 * @option stypes
 * @option stype: x
 * @option stype: name
 * @option all skills
 * @option skill: x
 * @option skill: name
 * @option combat log
 * @desc List of battle commands that appear by default
 * if the <Battle Commands> notetag isn't present.
 * @default ["attack","skills","guard","party","item"]
 *
 * @param HelpWindow
 * @text Help Window
 *
 * @param HelpSkillType:str
 * @text Skill Types
 * @parent HelpWindow
 * @desc Text displayed when selecting a skill type.
 * %1 - Skill Type Name
 * @default Opens up a list of skills under the \C[16]%1\C[0] category.
 *
 * @param HelpItem:str
 * @text Items
 * @parent HelpWindow
 * @desc Text displayed when selecting the item command.
 * @default Opens up a list of items that you can use.
 *
 * @param HelpEscape:str
 * @text Escape
 * @parent HelpWindow
 * @desc Text displayed when selecting the escape command.
 * @default Attempt to escape the battle.
 *
 * @param HelpAutoBattle:str
 * @text Auto Battle
 * @parent HelpWindow
 * @desc Text displayed when selecting the Auto Battle command.
 * @default Automatically choose an action suitable for combat.
 *
 */
/* ----------------------------------------------------------------------------
 * Actor Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Actor:
 *
 * @param Flinch
 *
 * @param FlinchDistanceX:num
 * @text Flinch Distance X
 * @parent Flinch
 * @desc The normal X distance when flinching.
 * @default 12
 *
 * @param FlinchDistanceY:num
 * @text Flinch Distance Y
 * @parent Flinch
 * @desc The normal Y distance when flinching.
 * @default 0
 *
 * @param FlinchDuration:num
 * @text Flinch Duration
 * @parent Flinch
 * @desc The number of frames for a flinch to complete.
 * @default 6
 *
 * @param SvBattlers
 * @text Sideview Battlers
 *
 * @param AnchorX:num
 * @text Anchor: X
 * @parent SvBattlers
 * @desc Default X anchor for Sideview Battlers.
 * Use values between 0 and 1 to be safe.
 * @default 0.5
 *
 * @param AnchorY:num
 * @text Anchor: Y
 * @parent SvBattlers
 * @desc Default Y anchor for Sideview Battlers.
 * Use values between 0 and 1 to be safe.
 * @default 1.0
 *
 * @param ChantStyle:eval
 * @text Chant Style
 * @parent SvBattlers
 * @type boolean
 * @on Magical Hit Type
 * @off Magical Skill Type
 * @desc What determines the chant motion?
 * Hit type or skill type?
 * @default true
 *
 * @param OffsetX:num
 * @text Offset: X
 * @parent SvBattlers
 * @desc Offsets X position where actor is positioned.
 * Negative values go left. Positive values go right.
 * @default 0
 *
 * @param OffsetY:num
 * @text Offset: Y
 * @parent SvBattlers
 * @desc Offsets Y position where actor is positioned.
 * Negative values go up. Positive values go down.
 * @default 0
 *
 * @param MotionSpeed:num
 * @text Motion Speed
 * @parent SvBattlers
 * @type number
 * @min 1
 * @desc The number of frames in between each motion.
 * @default 12
 *
 * @param PrioritySortActive:eval
 * @text Priority: Active
 * @parent SvBattlers
 * @type boolean
 * @on Active Actor over All Else
 * @off Active Actor is Sorted Normally
 * @desc Place the active actor on top of actor and enemy sprites.
 * @default false
 *
 * @param PrioritySortActors:eval
 * @text Priority: Actors
 * @parent SvBattlers
 * @type boolean
 * @on Actors over Enemies
 * @off Sort by Y Position
 * @desc Prioritize actors over enemies when placing sprites on top
 * of each other.
 * @default true
 *
 * @param Shadow:eval
 * @text Shadow Visible
 * @parent SvBattlers
 * @type boolean
 * @on Visible
 * @off Hidden
 * @desc Show or hide the shadow for Sideview Battlers.
 * @default true
 *
 * @param SmoothImage:eval
 * @text Smooth Image
 * @parent SvBattlers
 * @type boolean
 * @on Smooth
 * @off Pixelated
 * @desc Smooth out the battler images or pixelate them?
 * @default false
 *
 * @param HomePosJS:func
 * @text JS: Home Position
 * @parent SvBattlers
 * @type note
 * @desc Code used to calculate the home position of actors.
 * @default "// Declare Constants\nconst sprite = this;\nconst actor = this._actor;\nconst index = arguments[0];\n\n// Make Calculations\nlet x = Math.round((Graphics.width / 2) + 192)\nx -= Math.floor((Graphics.width - Graphics.boxWidth) / 2);\nx += index * 32;\nlet y = (Graphics.height - 200) - ($gameParty.maxBattleMembers() * 48);\ny -= Math.floor((Graphics.height - Graphics.boxHeight) / 2);\ny += index * 48;\n\n// Home Position Offsets\nconst offsetNote = /<SIDEVIEW HOME OFFSET:[ ]([\\+\\-]\\d+),[ ]([\\+\\-]\\d+)>/i;\nconst xOffsets = actor.traitObjects().map((obj) => (obj && obj.note.match(offsetNote) ? Number(RegExp.$1) : 0));\nconst yOffsets = actor.traitObjects().map((obj) => (obj && obj.note.match(offsetNote) ? Number(RegExp.$2) : 0));\nx = xOffsets.reduce((r, offset) => r + offset, x);\ny = yOffsets.reduce((r, offset) => r + offset, y);\n\n// Set Home Position\nthis.setHome(x, y);"
 *
 */
/* ----------------------------------------------------------------------------
 * Enemy Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Enemy:
 *
 * @param Visual
 *
 * @param AttackAnimation:num
 * @text Attack Animation
 * @parent Visual
 * @type animation
 * @desc Default attack animation used for enemies.
 * Use <Attack Animation: x> for custom animations.
 * @default 1
 *
 * @param EmergeText:eval
 * @text Emerge Text
 * @parent Visual
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show or hide the 'Enemy emerges!' text at the start of battle.
 * @default false
 *
 * @param OffsetX:num
 * @text Offset: X
 * @parent Visual
 * @desc Offsets X position where enemy is positioned.
 * Negative values go left. Positive values go right.
 * @default 0
 *
 * @param OffsetY:num
 * @text Offset: Y
 * @parent Visual
 * @desc Offsets Y position where enemy is positioned.
 * Negative values go up. Positive values go down.
 * @default 0
 *
 * @param SmoothImage:eval
 * @text Smooth Image
 * @parent Visual
 * @type boolean
 * @on Smooth
 * @off Pixelated
 * @desc Smooth out the battler images or pixelate them?
 * @default true
 *
 * @param SelectWindow
 * @text Select Window
 *
 * @param LastSelected:eval
 * @text Any: Last Selected
 * @parent SelectWindow
 * @type boolean
 * @on Last Selected
 * @off FV/SV Priority
 * @desc Prioritize last selected enemy over front view or sideview settings?
 * @default true
 *
 * @param FrontViewSelect:eval
 * @text FV: Right Priority
 * @parent SelectWindow
 * @type boolean
 * @on Right
 * @off Normal
 * @desc If using frontview, auto select the enemy furthest right.
 * @default false
 *
 * @param SideviewSelect:eval
 * @text SV: Right Priority
 * @parent SelectWindow
 * @type boolean
 * @on Right
 * @off Normal
 * @desc If using sideview, auto select the enemy furthest right.
 * @default true
 *
 * @param NameFontSize:num
 * @text Name: Font Size
 * @parent SelectWindow
 * @desc Font size used for enemy names.
 * @default 22
 *
 * @param NameOffsetX:num
 * @text Name: Offset X
 * @parent SelectWindow
 * @desc Offset the enemy name's X position by this much.
 * @default 0
 *
 * @param NameOffsetY:num
 * @text Name: Offset Y
 * @parent SelectWindow
 * @desc Offset the enemy name's Y position by this much.
 * @default 0
 *
 * @param SvBattlers
 * @text Sideview Battlers
 *
 * @param AllowCollapse:eval
 * @text Allow Collapse
 * @parent SvBattlers
 * @type boolean
 * @on Allow
 * @off Don't
 * @desc Causes defeated enemies with SV Battler graphics
 * to "fade away" when defeated?
 * @default false
 *
 * @param AnchorX:num
 * @text Anchor: X
 * @parent SvBattlers
 * @desc Default X anchor for Sideview Battlers.
 * Use values between 0 and 1 to be safe.
 * @default 0.5
 *
 * @param AnchorY:num
 * @text Anchor: Y
 * @parent SvBattlers
 * @desc Default Y anchor for Sideview Battlers.
 * Use values between 0 and 1 to be safe.
 * @default 1.0
 *
 * @param MotionIdle:str
 * @text Motion: Idle
 * @parent SvBattlers
 * @type combo
 * @option walk
 * @option wait
 * @option chant
 * @option guard
 * @option damage
 * @option evade
 * @option thrust
 * @option swing
 * @option missile
 * @option skill
 * @option spell
 * @option item
 * @option escape
 * @option victory
 * @option dying
 * @option abnormal
 * @option sleep
 * @option dead
 * @desc Sets default idle animation used by Sideview Battlers.
 * @default walk
 *
 * @param Shadow:eval
 * @text Shadow Visible
 * @parent SvBattlers
 * @type boolean
 * @on Visible
 * @off Hidden
 * @desc Show or hide the shadow for Sideview Battlers.
 * @default true
 *
 * @param Width:num
 * @text Size: Width
 * @parent SvBattlers
 * @type number
 * @min 1
 * @desc Default width for enemies that use Sideview Battlers.
 * @default 64
 *
 * @param Height:num
 * @text Size: Height
 * @parent SvBattlers
 * @type number
 * @min 1
 * @desc Default height for enemies that use Sideview Battlers.
 * @default 64
 *
 * @param WtypeId:num
 * @text Weapon Type
 * @parent SvBattlers
 * @type number
 * @min 0
 * @desc Sets default weapon type used by Sideview Battlers.
 * Use 0 for Bare Hands.
 * @default 0
 *
 */
/* ----------------------------------------------------------------------------
 * HP Gauge Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~HpGauge:
 *
 * @param Display
 * @text Show Gauges For
 *
 * @param ShowActorGauge:eval
 * @text Actors
 * @parent Display
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show HP Gauges over the actor sprites' heads?
 * Requires SV Actors to be visible.
 * @default true
 *
 * @param ShowEnemyGauge:eval
 * @text Enemies
 * @parent Display
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show HP Gauges over the enemy sprites' heads?
 * Can be bypassed with <Hide HP Gauge> notetag.
 * @default true
 *
 * @param RequiresDefeat:eval
 * @text Requires Defeat?
 * @parent ShowEnemyGauge:eval
 * @type boolean
 * @on Require Defeat First
 * @off No Requirement
 * @desc Requires defeating the enemy once to show HP Gauge?
 * Can be bypassed with <Show HP Gauge> notetag.
 * @default true
 *
 * @param BTestBypass:eval
 * @text Battle Test Bypass?
 * @parent RequiresDefeat:eval
 * @type boolean
 * @on Bypass
 * @off Don't Bypass
 * @desc Bypass the defeat requirement in battle test?
 * @default true
 *
 * @param Settings
 *
 * @param AnchorX:num
 * @text Anchor X
 * @parent Settings
 * @desc Where do you want the HP Gauge sprite's anchor X to be?
 * Use values between 0 and 1 to be safe.
 * @default 0.5
 *
 * @param AnchorY:num
 * @text Anchor Y
 * @parent Settings
 * @desc Where do you want the HP Gauge sprite's anchor Y to be?
 * Use values between 0 and 1 to be safe.
 * @default 1.0
 *
 * @param Scale:num
 * @text Scale
 * @parent Settings
 * @desc How large/small do you want the HP Gauge to be scaled?
 * @default 0.5
 *
 * @param OffsetX:num
 * @text Offset X
 * @parent Settings
 * @desc How many pixels to offset the HP Gauge's X by?
 * @default 0
 *
 * @param OffsetY:num
 * @text Offset Y
 * @parent Settings
 * @desc How many pixels to offset the HP Gauge's Y by?
 * @default -3
 *
 * @param Options
 * @text Options
 *
 * @param AddHpGaugeOption:eval
 * @text Add Option?
 * @parent Options
 * @type boolean
 * @on Add
 * @off Don't Add
 * @desc Add the 'Show HP Gauge' option to the Options menu?
 * @default true
 *
 * @param AdjustRect:eval
 * @text Adjust Window Height
 * @parent Options
 * @type boolean
 * @on Adjust
 * @off Don't
 * @desc Automatically adjust the options window height?
 * @default true
 *
 * @param Name:str
 * @text Option Name
 * @parent Options
 * @desc Command name of the option.
 * @default Show HP Gauge
 *
 */
/* ----------------------------------------------------------------------------
 * Action Sequence Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ActionSequence:
 *
 * @param AutoSequences
 * @text Automatic Sequences
 *
 * @param AutoMeleeSolo:eval
 * @text Melee Single Target
 * @parent AutoSequences
 * @type boolean
 * @on Allow
 * @off Ignore
 * @desc Allow this auto sequence for physical, single target actions?
 * @default true
 *
 * @param AutoMeleeAoE:eval
 * @text Melee Multi Target
 * @parent AutoSequences
 * @type boolean
 * @on Allow
 * @off Ignore
 * @desc Allow this auto sequence for physical, multi-target actions?
 * @default true
 *
 * @param QoL
 * @text Quality of Life
 *
 * @param AutoNotetag:eval
 * @text Auto Notetag
 * @parent QoL
 * @type boolean
 * @on Automatic
 * @off Manual
 * @desc Automatically apply the <Custom Action Sequence> notetag
 * effect to any item or skill that has a Common Event?
 * @default false
 *
 * @param CastAnimations
 * @text Cast Animations
 *
 * @param CastCertain:num
 * @text Certain Hit
 * @parent CastAnimations
 * @type animation
 * @desc Cast animation for Certain Hit skills.
 * @default 120
 *
 * @param CastPhysical:num
 * @text Physical
 * @parent CastAnimations
 * @type animation
 * @desc Cast animation for Physical skills.
 * @default 52
 *
 * @param CastMagical:num
 * @text Magical
 * @parent CastAnimations
 * @type animation
 * @desc Cast animation for Magical skills.
 * @default 51
 *
 * @param CounterReflection
 * @text Counter/Reflect
 *
 * @param CounterPlayback:eval
 * @text Counter Back
 * @parent CounterReflection
 * @type boolean
 * @on Play Back
 * @off Ignore
 * @desc Play back the attack animation used?
 * @default true
 *
 * @param ReflectAnimation:num
 * @text Reflect Animation
 * @parent CounterReflection
 * @type animation
 * @desc Animation played when an action is reflected.
 * @default 1
 *
 * @param ReflectPlayback:eval
 * @text Reflect Back
 * @parent CounterReflection
 * @type boolean
 * @on Play Back
 * @off Ignore
 * @desc Play back the attack animation used?
 * @default true
 *
 * @param Stepping
 *
 * @param MeleeDistance:num
 * @text Melee Distance
 * @parent Stepping
 * @desc Minimum distance in pixels for Movement Action Sequences.
 * @default 24
 *
 * @param StepDistanceX:num
 * @text Step Distance X
 * @parent Stepping
 * @desc The normal X distance when stepping forward.
 * @default 48
 *
 * @param StepDistanceY:num
 * @text Step Distance Y
 * @parent Stepping
 * @desc The normal Y distance when stepping forward.
 * @default 0
 *
 * @param StepDuration:num
 * @text Step Duration
 * @parent Stepping
 * @desc The number of frames for a stepping action to complete.
 * @default 12
 *
 */
/* ----------------------------------------------------------------------------
 * Projectile Start Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ProjectileStart:
 * 
 * @param Type:str
 * @text Type
 * @type select
 * @option Target - Start from battler target(s)
 * @value target
 * @option Point - Start from a point on the screen
 * @value point
 * @desc Select where the projectile should start from.
 * @default target
 * 
 * @param Targets:arraystr
 * @text Target(s)
 * @parent Type:str
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select which unit(s) to start the projectile from.
 * @default ["user"]
 * 
 * @param TargetCenter:eval
 * @text Centralize
 * @parent Targets:arraystr
 * @type boolean
 * @on Center Projectile
 * @off Create Each
 * @desc Create one projectile at the center of the targets?
 * Or create a projectile for each target?
 * @default false
 * 
 * @param PointX:eval
 * @text Point X
 * @parent Type:str
 * @desc Insert the X coordinate to start the projectile at.
 * You may use JavaScript code.
 * @default Graphics.width / 2
 * 
 * @param PointY:eval
 * @text Point Y
 * @parent Type:str
 * @desc Insert the Y coordinate to start the projectile at.
 * You may use JavaScript code.
 * @default Graphics.height / 2
 * 
 * @param OffsetX:eval
 * @text Offset X
 * @desc Insert how many pixels to offset the X coordinate by.
 * You may use JavaScript code.
 * @default +0
 * 
 * @param OffsetY:eval
 * @text Offset Y
 * @desc Insert how many pixels to offset the Y coordinate by.
 * You may use JavaScript code.
 * @default +0
 *
 */
/* ----------------------------------------------------------------------------
 * Projectile Goal Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ProjectileGoal:
 * 
 * @param Type:str
 * @text Type
 * @type select
 * @option Target - Goal is battler target(s)
 * @value target
 * @option Point - Goal is a point on the screen
 * @value point
 * @desc Select where the projectile should go to.
 * @default target
 * 
 * @param Targets:arraystr
 * @text Target(s)
 * @parent Type:str
 * @type combo[]
 * @option user
 * @option current target
 * @option prev target
 * @option next target
 * @option all targets
 * @option focus
 * @option not focus
 * @option 
 * @option alive friends
 * @option alive friends not user
 * @option alive friends not target
 * @option dead friends
 * @option friend index x
 * @option 
 * @option alive opponents
 * @option alive opponents not target
 * @option dead opponents
 * @option opponent index x
 * @option 
 * @option alive actors
 * @option alive actors not user
 * @option alive actors not target
 * @option dead actors
 * @option actor index x
 * @option actor ID x
 * @option 
 * @option alive enemies
 * @option alive enemies not user
 * @option alive enemies not target
 * @option dead enemies
 * @option enemy index x
 * @option enemy ID x
 * @option 
 * @option alive battlers
 * @option alive battlers not user
 * @option alive battlers not target
 * @option dead battlers
 * @option 
 * @desc Select which unit(s) for projectile to go to.
 * @default ["all targets"]
 * 
 * @param TargetCenter:eval
 * @text Centralize
 * @parent Targets:arraystr
 * @type boolean
 * @on Center Projectile
 * @off Create Each
 * @desc Set goal in the center of targets?
 * Or create a projectile to go to each target?
 * @default false
 * 
 * @param PointX:eval
 * @text Point X
 * @parent Type:str
 * @desc Insert the X coordinate to send the projectile to.
 * You may use JavaScript code.
 * @default Graphics.width / 2
 * 
 * @param PointY:eval
 * @text Point Y
 * @parent Type:str
 * @desc Insert the Y coordinate to send the projectile to.
 * You may use JavaScript code.
 * @default Graphics.height / 2
 * 
 * @param OffsetX:eval
 * @text Offset X
 * @desc Insert how many pixels to offset the X coordinate by.
 * You may use JavaScript code.
 * @default +0
 * 
 * @param OffsetY:eval
 * @text Offset Y
 * @desc Insert how many pixels to offset the Y coordinate by.
 * You may use JavaScript code.
 * @default +0
 *
 */
/* ----------------------------------------------------------------------------
 * Projectile Extra Animation Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ProjectileExAni:
 * 
 * @param AutoAngle:eval
 * @text Auto Angle?
 * @parent Settings
 * @type boolean
 * @on Automatically Angle
 * @off Normal
 * @desc Automatically angle the projectile to tilt the direction it's moving?
 * @default true
 * 
 * @param AngleOffset:eval
 * @text Angle Offset
 * @desc Alter the projectile's tilt by this many degrees.
 * @default +0
 * 
 * @param Arc:eval
 * @text Arc Peak
 * @parent Settings
 * @desc This is the height of the project's trajectory arc
 * in pixels.
 * @default 0
 *
 * @param EasingType:str
 * @text Easing
 * @parent Settings
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
 * @desc Select which easing type to apply to the projectile's trajectory.
 * @default Linear
 * 
 * @param Spin:eval
 * @text Spin Speed
 * @parent Settings
 * @desc Determine how much angle the projectile spins per frame.
 * Does not work well with "Auto Angle".
 * @default +0.0
 *
 */
/* ----------------------------------------------------------------------------
 * Projectile Extra Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~ProjectileExtra:
 * 
 * @param AutoAngle:eval
 * @text Auto Angle?
 * @parent Settings
 * @type boolean
 * @on Automatically Angle
 * @off Normal
 * @desc Automatically angle the projectile to tilt the direction it's moving?
 * @default true
 * 
 * @param AngleOffset:eval
 * @text Angle Offset
 * @desc Alter the projectile's tilt by this many degrees.
 * @default +0
 * 
 * @param Arc:eval
 * @text Arc Peak
 * @parent Settings
 * @desc This is the height of the project's trajectory arc
 * in pixels.
 * @default 0
 *
 * @param BlendMode:num
 * @text Blend Mode
 * @type select
 * @option 0 - Normal
 * @value 0
 * @option 1 - Additive
 * @value 1
 * @option 2 - Multiply
 * @value 2
 * @option 3 - Screen
 * @value 3
 * @desc What kind of blend mode do you wish to apply to the projectile?
 * @default 0
 *
 * @param EasingType:str
 * @text Easing
 * @parent Settings
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
 * @desc Select which easing type to apply to the projectile's trajectory.
 * @default Linear
 * 
 * @param Hue:eval
 * @text Hue
 * @parent Settings
 * @desc Adjust the hue of the projectile.
 * Insert a number between 0 and 360.
 * @default 0
 * 
 * @param Scale:eval
 * @text Scale
 * @parent Settings
 * @desc Adjust the size scaling of the projectile.
 * Use decimals for exact control.
 * @default 1.0
 * 
 * @param Spin:eval
 * @text Spin Speed
 * @parent Settings
 * @desc Determine how much angle the projectile spins per frame.
 * Does not work well with "Auto Angle".
 * @default +0.0
 *
 */
//=============================================================================

const _0x595e=['alive\x20battlers','isActiveTpb','BattleLogRectJS','textColor','height','animation','substitute','_forcedBattlers','TimeScale','_createEffectsContainer','FUNC','opacityStart','randomInt','ARRAYSTRUCT','PopupShiftX','createDamageSprite','_lines','missile','displayItemMessage','animationShouldMirror','hasBeenDefeatedBefore','toUpperCase','placeBasicGauges','MDF','Scene_Battle_logWindowRect','isHiddenSkill','_updateCursorFilterArea','isSkewing','makeBattleCommand','spinBattler','exit','createEmptyBitmap','customDamageFormula','waitCount','textSizeEx','_enemyNameContainer','_animationContainer','criticalDmgFlat','isQueueOptionsMenu','20878vzClAn','angleDuration','ActSeq_Movement_Spin','Sprite_Actor_update','Sprite_Enemy_updateCollapse','turn','Scene_Map_initialize','OffsetX','commandOptions','allowCollapse','updateHelp','extraHeight','OffsetAdjust','isBattleRefreshRequested','Targets1','_skewEasing','setActiveWeaponSlot','MessageWait','isBusy','onGrowEnd','_item','gradientFillRect','_mainSprite','gainTp','BattleManager_processVictory','StartName','ActSeq_Set_SetupAction','process_VisuMZ_BattleCore_BaseTroops','calcWindowHeight','ActSeq_Angle_WaitForAngle','onBattleStartBattleCore','walk','updatePadding','charging','BattleManager_startBattle','Direction','registerCommand','_activeWeaponSlot','getBattlePortraitFilename','ActSeq_BattleLog_PopBaseLine','Window_BattleLog_displayMpDamage','mpDamageFmt','DamageFlat','PostStartBattleJS','isAutoBattleCommandEnabled','addedBuffs','DistanceAdjust','setBattlerFlip','DisplayAction','growBattler','Window_SkillList_maxCols','findTargetSprite','_baseY','MAXHP','currentClass','updateCancel','canAddSkillCommand','autoBattleWindowRect','applyVariance','icon','checkCacheKey','battleOpacity','DamageStyles','Game_Action_isForRandom','selectNextActor','setBattleCameraPoint','makeCommandList','pushBaseLine','getDualWieldTimes','_cache','HP_Rate','debuffAdd','isStateResist','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','isConfused','isItem','_hpGaugeSprite','getWtypeIdWithName','close','createPartyCommandWindowBattleCore','setupCriticalEffect','_reflectionTarget','sortDamageSprites','ActSeq_Motion_PerformAction','removeDamageSprite','DefaultDamageStyle','updatePosition','ActSeq_Animation_WaitForAnimation','checkTpbInputClose','process_VisuMZ_BattleCore_Notetags','right','isClicked','createDigits','getChildIndex','Window_BattleStatus_drawItemImage','parameters','PostRegenerateJS','faceRect','changeTurnOrderByCTB','ActSeq_Mechanics_CtbOrder','Game_Battler_clearDamagePopup','Scene_Battle_createCancelButton','drawTextEx','initVisibility','setupMotionBlurImpactFilter','PostEndBattleJS','_scene','LastSelected','battleCommands','AutoBattleCancel','Scene_Battle_terminate','_borderPortraitSprite','repositionEnemiesByResolution','initBattleCore','BattleManager_makeActionOrders','partyCommandWindowRectDefaultStyle','autoBattle','motionIdle','setVisibleUI','getSkillIdWithName','StepDistanceX','STYPES','AddOption','_wtypeIDs','_forcing','DamageType%1','regionId','ActSeq_Movement_HomeReset','ArRedFlat','setHorrorEffectSettings','playCancel','mainSpriteScaleY','clearActiveWeaponSlot','isFastForward','setup','alive\x20enemies\x20not\x20target','svAnchorX','_skewY','updateScale','_back1Sprite','ActSeq_Impact_ShockwavePoint','alive\x20enemies\x20not\x20user','applyEasing','isBattleMember','ALL\x20SKILLS','dead\x20opponents','startAction','addCommand','Scene_Battle_selectNextCommand','createPartyCommandWindow','HitRate','ActSeq_Mechanics_DamagePopup','_autoBattle','updateShadowPosition','return\x200','displayChangedBuffs','ActionEndUpdate','redraw','addFightCommand','sliceMax','push','ActSeq_Movement_WaitForFloat','isInputting','_opacityDuration','updateStateSprite','CombatLogIcon','log','extraPositionX','PostStartActionJS','escape','_battleCoreBattleStartEvent','removeState','stop','setupBattleCoreData','_phase','ShowHide','ParseAllNotetags','Class-%1-%2','_armorPenetration','applyData','StepDistanceY','_motionType','Window_Options_addGeneralOptions','MotionType','WaitForEffect','ConfigManager_makeData','checkShowHideSwitchNotetags','uiMenuStyle','setBattleZoom','waitForOpacity','updateBattlebackBitmap2','ActSeq_Element_ForceElements','EscapeFailureJS','terminate','_inputting','performJump','autoBattleAtStart','removeImmortal','padding','guard','commandNameWindowDrawText','_floatDuration','all\x20targets','Setting','Skill-%1-%2','filters','applyGuard','SvWeaponSolo-%1-%2','%1StartActionJS','HP_Flat','ResetFocus','Post','isFightCommandEnabled','Sprite_Battler_damageOffsetY','createHelpWindowBattleCore','ActSeq_Projectile_Picture','hasSkill','floatBattler','commandName','Text','resizeWindowXPStyle','VisuMZ_0_CoreEngine','WaitForCamera','itemRect','Window_BattleLog_performRecovery','cameraClamp','Scene_Battle_createActorCommandWindow','ActSeq_Impact_MotionTrailRemove','ParseActorNotetags','Sprite_Battler_damageOffsetX','isRightInputMode','ActionStart','754745kkAWAp','createAnimationSprite','ActSeq_Motion_RefreshMotion','statusWindowRectBorderStyle','_actorCommandWindow','ChargeRate','AS\x20TARGET','addChildToBack','Scene_ItemBase_applyItem','EasingType','isItemCommandEnabled','createEffectActionSet','_defeatedEnemies','performMoveToTargets','getDamageStyle','callNextMethod','itemCri','battleJump','_opacityWholeDuration','performCollapse','PostEndActionJS','hitFlat','Height','_regionBattleback1','actorCommandSingleSkill','_lastEnemy','HelpSkillType','Window_ItemList_maxCols','text','_text','Sprite_Enemy_initVisibility','addChildAt','ConvertActionSequenceTarget','BattleManager_selectNextCommand','ARRAYNUM','isBattlerFlipped','pow','wholeActionSet','_canLose','isAtbCastingState','forceSelect','createBattleFieldBattleCore','_battleLayoutStyle','%1StartTurnJS','JS\x20%1DAMAGE\x20%2','Armor-%1-%2','HelpAutoBattle','removeHorrorEffect','isDTB','isAppeared','HelpFight','loop','width','subject','singleSkill','_active','createCommandVisibleJS','setImmortal','AllowRandomSpeed','setActorHome','PostApplyAsTargetJS','action','DigitGrouping','currentExt','FocusX','isTpb','Window_BattleLog_displayCritical','battlerSmoothImage','motionType','_angleDuration','_list','createHelpWindow','isAutoBattleCommandAdded','JS\x20%1REGENERATE','_targetOpacity','isSpriteVisible','process_VisuMZ_BattleCore_CreateRegExp','DamageRate','focus','adjustPosition_ScaleDown','isDead','freezeFrame','Game_Battler_performActionStart','updateCollapse','_enemyWindow','recoverAll','currentAction','buffRemove','canAttack','actorCommandWindowRect','VisuMZ_2_BattleSystemSTB','autoBattleStyle','logActionList','arPenRate','PRE-','performActionEndMembers','_opacityEasing','_damagePopupArray','replace','getNextSubjectFromPool','updateForceAction','Game_Action_applyGlobal','onTurnEnd','cameraOffsetDuration','createChildSprite','type','onEscapeSuccess','Window_PartyCommand_initialize','PARTY','ActSeq_Horror_GlitchCreate','clearActiveWeaponSet','PreDamage%1JS','ShowEnemyGauge','createCommandNameWindow','isEffecting','endAction','getBattlePortraitOffsetY','Actor','shadow','some','Targets','isNextScene','version','startSpin','_attackAnimationId','Intensity','onJumpEnd','startFloat','die','ActSeq_Horror_TVRemove','clearDamagePopup','drawText','Sprite_Battler_updateMain','resize','Sprite_Actor_updateShadow','regenerateAllBattleCore','alive\x20opponents','_offsetY','string','isMeleeSingleTargetAction','ActSeq_Impact_ZoomBlurPoint','getSimilarSTypes','gainMp','partyCommandWindowRect','BattleStartEvent','dead\x20actors','isForOpponentBattleCore','clearWeaponAnimation','alive\x20friends','isCustomBattleScope','_preemptive','VisuMZ_4_CombatLog','XPActorDefaultHeight','waitForNewLine','getLastPluginCommandInterpreter','ActSeq_Element_Clear','_logWindow','performActionStart','effects','moveToStartPositionBattleCore','dead\x20friends','round','updateBorderSprite','nextActiveWeaponSlot','damageStyle','setHome','_jumpMaxHeight','Game_Action_itemEffectAddAttackState','displayAction','ARRAYJSON','makeDeepCopy','notFocusValid','makeActionListAutoAttack','commandEscape','_endBattle','match','Scene_Boot_onDatabaseLoaded','isSceneBattle','iconHeight','DEF','removeStatesAuto','_currentActor','onSkewEnd','isActor','createMiss','equips','ShowFacesListStyle','createBattleUIOffsetY','BattleManager_cancelActorInput','isDying','setupHpGaugeSprite','battleProjectiles','_battleCoreAddedElements','createString','processBorderActor','_homeX','_waitMode','Game_Enemy_setup','_battler','gainHp','startAttackWeaponAnimation','WaitForFloat','commandNameWindowCenter','canMove','setupTextPopup','drawItemStatusXPStyle','softDamageCapRate','Game_Action_itemEffectAddNormalState','\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20Declare\x20Arguments\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20arguments[0];\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20a\x20=\x20user;\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20b\x20=\x20user;\x0a\x20\x20\x20\x20\x20\x20\x20\x20let\x20targets\x20=\x20arguments[1];\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20Process\x20Code\x0a\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20Return\x20Value\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20targets\x20||\x20[];\x0a\x20\x20\x20\x20','note','value','loadBitmap','getDefeatedEnemies','filter','_createDamageContainer','ParseEnemyNotetags','SkillsStatesCore','PostDamage%1JS','Window_BattleLog_performCounter','ActSeq_Mechanics_HpMpTp','PartyCmd','WaitCount1','_tpbState','dataId','getAttackMotionSlot','StepDuration','clearFreezeMotionForWeapons','update','_cursorSprite','Scene_Battle_commandFight','drawItemStatus','getAttackMotion','_baseLineStack','AllowCollapse','evaded','onFloatEnd','WaitForZoom','Buffs','ActSeq_Movement_MoveToPoint','isMagicSkill','Sprite_Actor_updateFrame','maxBattleMembers','updateFrame','startBattle','forceMotion','alive\x20actors\x20not\x20target','battleEnd','helpAreaHeight','isDebuffAffected','refreshCursor','parseForcedGameTroopSettingsBattleCore','applyGlobal','_distortionSprite','WaitForJump','actor','BARE\x20HANDS','Damage','addBattleCoreAutoBattleStyleCommand','performMiss','canAttackBattleCore','isAnyoneGrowing','JS\x20%1START\x20ACTION','SkewY','%1Damage%2JS','Sprite_Battler_startMove','processRandomizedData','bottom','battleZoom','_escapeRatio','_commonEventQueue','members','isOptionsCommandAdded','Mirror','canBattlerMove','onDatabaseLoaded','battleSys','AGI','_targetSkewX','Window_BattleLog_refresh','Targets2','setupIconTextPopup','currentSymbol','onMoveEnd','_tpbSceneChangeCacheActor','actorCommandCancelTPB','enemyId','placeStateIcon','Debuffs','_battleField','_battlerHue','removeBuff','displayHpDamage','cancel','battleSpin','drawIcon','stbGainInstant','_enemies','itemEffectAddAttackState','HelpOptions','maxCols','critical','ChantStyle','createAutoBattleWindow','%1Apply%2JS','setupDamagePopup','BattleManager_isTpbMainPhase','ParseSkillNotetags','getMenuImage','PostDamageJS','updateRefresh','Window_BattleLog_performSubstitute','CmdIconItem','numTargets','changeInputWindow','finalizeScale','resetFontSettings','createBorderStylePortraitSprite','command236','Game_Battler_onBattleStart','children','VisuMZ_3_ActSeqImpact','Radius','ActSeq_Zoom_Scale','startInput','JS\x20%1APPLY\x20%2','isAnyoneFloating','bitmap','dragonbonesData','Game_System_initialize','forceEscapeSprite','DefaultStyle','autoSelectLastSelected','isDuringNonLoopingMotion','performMoveToPoint','_flipScaleX','\x5cI[%1]%2','_skillWindow','retreat','Actions','refreshMotion','isOkEnabled','Scene_Battle_startPartyCommandSelection','ActSeq_Mechanics_StbRemoveExcessActions','BattleManager_startAction','lineHeight','Scene_Battle_start','Parse_Notetags_Targets','weatherPower','commandStyle','isSideButtonLayout','isTurnBased','_svBattlerSprite','ParseClassNotetags','performEvasion','anchorY','setSvBattlerSprite','scale','_targetAngle','BattleLayout','startMove','addCustomCommands','VisuMZ_2_HorrorEffects','canUseItemCommand','createAnimationContainer','Formula','Duration','basicGaugesY','Scene_Battle_updateStatusWindowPosition','Sprite_Enemy_loadBitmap','extraPositionY','isTpbMainPhase','isSkipPartyCommandWindow','Window_BattleEnemy_initialize','_jumpDuration','callOptions','_battlerContainer','createActors','PostApply%1JS','commandNameWindowDrawBackground','_updateFilterArea','Sprite_Enemy_setBattler','hpDamage','updateBattlebackBitmap','loadPicture','isAnimationShownOnBattlePortrait','alive\x20actors\x20not\x20user','isMoving','Game_Interpreter_command301','battleSpriteSkew','useItem','TextColor','hide','message1','_effectsContainer','VisuMZ_2_BattleSystemATB','Window_ActorCommand_setup','sort','isGuardWaiting','%1EndActionJS','ActSeq_Movement_MoveToTarget','canInput','updateBossCollapse','ShowPopup','iconIndex','command119','MAXMP','float','AutoBattleBgType','_animationCount','popBaseLine','lineRect','moveBattlerDistance','EscapeSuccess','_lastPluginCommandInterpreter','collapse','mmp','_multipliers','_growWholeDuration','isAnyoneSkewing','Window_BattleLog_performActionStart','aliveMembers','messageSpeed','WaitForAnimation','makeTargets','514OIGceE','opponentsUnit','setupRgbSplitImpactFilter','Scene_Battle_onEnemyCancel','ArPenRate','ActionAnimation','Game_Battler_clearMotion','createWeather','ActSeq_Horror_GlitchRemove','skills','_commandNameWindow','skillTypes','CmdTextAlign','setSTBExploited','mpDamage','moveToStartPosition','getItemDamageAmountTextOriginal','setupWeaponAnimation','WaitCount','needsSelectionBattleCore','freezeMotion','ShowWeapon','weatherType','adjustPosition','onActorOk','updateAngleCalculations','drawBackgroundRect','isChangingOpacity','%1EndTurnJS','targetObjects','MotionAni','updateFlip','_itemWindow','_duration','changeCtbChargeTime','Skills','jumpBattler','removeAnimation','Shadow2','ARRAYEVAL','Game_Action_isForFriend','putActiveBattlerOnTop','ActSeq_Movement_FaceDirection','JS\x20ESCAPE\x20SUCCESS','Window_BattleLog_performMiss','gaugeX','commandSymbol','updateFloat','ActSeq_Impact_MotionBlurScreen','applyItem','skillItemWindowRectBorderStyle','snapForBackground','Spriteset_Battle_update','PostApplyJS','removeBuffsAuto','isFloating','addSingleSkillCommands','AnchorX','isBattleCoreTargetScope','applyBattleCoreJS','faceWidth','abnormal','ActorCmd','getBattlePortraitOffsetX','ForceDeath','ActiveTpbOptionsMessage','Sprite_Actor_setBattler','addEscapeCommand','makeSpeed','inputtingAction','drain','getItemDamageAmountLabelBattleCore','Game_Battler_performMiss','addedDebuffs','isBattleTest','itemEffectAddNormalState','initMembersBattleCore','Window_BattleLog_clear','setWaitMode','abs','Game_Battler_startTpbTurn','_immortal','Sprite_Battler_initMembers','getInputButtonString','applyDamageCaps','addActor','Game_Actor_setup','createStateIconSprite','FlashColor','Angle','atbInterrupt','autoSelect','PreStartBattleJS','ActSeq_Weapon_ClearActiveWeapon','_enemy','setBattlerBattleCore','applyTargetFilters','DamageDisplay','AutoMeleeAoE','ActSeq_Movement_Jump','isDamagePopupRequested','_iconIndex','skillId','Window_BattleStatus_initialize','AddHpGaugeOption','createBattleUIOffsetX','hpHealingFmt','addSkillTypeCommand','Game_Party_addActor','BattleEndEvent','Sprite_Battler_setHome','addOptionsCommand','placeGauge','ActSeq_BattleLog_WaitForNewLine','start','ATTACK','displayBuffs','createActorCommandWindow','active','boxWidth','isNextSceneBattleTransitionable','motionSpeed','Game_BattlerBase_die','JS\x20BATTLE\x20VICTORY','damageOffsetY','CheckSkillCommandShowSwitches','Parse_Notetags_Action','updateAction','_commonEventIDs','statusWindowRectXPStyle','MIN_SAFE_INTEGER','_handlers','statusTextAutoBattleStyle','clear','_freezeMotionData','_growDuration','status','_customDamageFormula','ActSeq_Mechanics_WaitForEffect','commandFight','auto','changeCtbCastTime','indexOf','iconWidth','isForOpponent','_animationSprites','VarianceFormulaJS','isAnyoneJumping','316357dpjejs','createTargetsJS','MP_Flat','commandStyleCheck','parse','isAnimationPlaying','isAnyoneChangingOpacity','result','WaitForSpin','map','base','battleSkew','gainBravePoints','ShowCritical','animationWait','drawItemImage','damageContainer','startEnemySelection','updatePhase','iterateBattler','ActSeq_Animation_CastAnimation','swapEnemyIDs','isForFriendBattleCore','timeScale','PostApplyAsUserJS','innerWidth','SlotID','dead','occasion','displayFailure','chant','194ilbfii','shift','_motionSpeed','missle','-%1','statusWindowRect','ActSeq_Skew_WaitForSkew','drawItemImageXPStyle','setupMotion','performReflection','damageRate','updateInterpreter','_weather','drawActorFace','waitForEffect','stepFlinch','stypeId','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','updateBattlebackBitmap1','ShowMissEvasion','DTB','isEnemy','PopupPosition','AsUser','ParseArmorNotetags','TargetLocation','%1EndBattleJS','updateStyleOpacity','Game_Action_makeTargets','addLoadListener','isBattlerGrounded','CriticalHitFlat','AutoBattleMsg','floor','ActSeq_BattleLog_AddText','Scale','performFlinch','Parse_Notetags_TraitObjects','GroupDigits','selectNextCommandTpb','Spriteset_Battle_createBattleField','showPortraits','OffsetY','HitFlat','ParseItemNotetags','ActionSequence','Game_Action_apply','isHidden','Game_Interpreter_updateWaitMode','mpHealingFmt','Game_BattlerBase_eraseState','frontviewSpriteY','item','Game_Battler_forceAction','allBattleMembers','_battlePortrait','Game_Map_battleback2Name','CmdStyle','destroyDamageSprite','requestMotionRefresh','Sprite_Enemy_updateBossCollapse','animationBaseDelay','createLowerLayer','requestAnimation','createHpGaugeSprite','isSideView','VisuMZ_2_PartySystem','Amp','initMembers','drawItem','_motionCount','cancelButtonText','Sprite_Actor_createStateSprite','isPlaytest','Sprite_Weapon_loadBitmap','_shadowSprite','Window_BattleLog_popupDamage','HomePosJS','Scene_Battle_onActorCancel','checkShowHideSkillNotetags','showHelpWindow','skillItemWindowRectMiddle','SkewX','deathStateId','createKeyJS','addAutoBattleCommand','displayRemovedStates','hue','isBattleFlipped','CalcActionSpeedJS','CriticalDuration','Enemy-%1-%2','displayMiss','drawItemStyleIcon','turnCount','VisuMZ_2_BattleSystemCTB','unshift','updateShadowBattleCore','makeTargetSelectionMoreVisible','getEnemyIdWithName','random','applyHardDamageCap','Sprite_Enemy_update','wait','processAnimationRequests','_battlerName','startOpacity','DigitGroupingDamageSprites','ActSeq_Impact_ShockwaveEachTargets','ActSeq_Target_CurrentIndex','PopupShiftY','_animation','CheckMapBattleEventValid','softDamageCap','ShowPortraits','Game_Action_itemHit','ActSeq_Set_WholeActionSet','ArPenFlat','drawItemImageListStyle','ActSeq_Mechanics_Multipliers','ShowHpDmg','ActSeq_Element_NullElements','isPreviousSceneBattleTransitionable','command283','BattleManager_endBattle','duration','repeatTargets','WaitForMovement','adjustPosition_ScaleUp','compareEnemySprite','isChanting','criticalHitRate','SkillItemBorderCols','_requestRefresh','GuardFormulaJS','ParseStateNotetags','isAnyoneMoving','smooth','setHue','processDefeat','head','ActSeq_BattleLog_DisplayAction','evalDamageFormula','ActSeq_Mechanics_CustomDmgFormula','okButtonText','_createCursorSprite','_weaponSprite','canEscape','attackAnimationId1','sliceMin','isActing','isPhysical','_preBattleCommonEvent','PopupDuration','_dimmerSprite','ActSeq_BattleLog_WaitForBattleLog','ActSeq_Mechanics_AddBuffDebuff','DamageStyleList','ActSeq_Mechanics_ActionEffect','PrioritySortActive','clearHorrorEffects','ActSeq_Movement_WaitForScale','_angleRevertOnFinish','WaitForProjectile','requestFauxAnimation','battleLayoutStyle','_baseX','ActSeq_Mechanics_BtbGain','custom','VisuMZ_1_SkillsStatesCore','displayType','_padding','stateMotionIndex','ForceRandom','Window_BattleLog_performEvasion','BTestBypass','autoMeleeMultiTargetActionSet','createActionSequenceProjectile','clearElementChanges','PostDamageAsTargetJS','waitForMovement','CastMagical','resizeWindowBorderStyle','show','_enemyIDs','isCharging','skill','addAttackCommand','isTriggered','Scene_Battle_partyCommandWindowRect','Immortal','BaseTroopIDs','updateShadowVisibility','prepareCustomActionSequence','preemptive','Scene_Battle_windowAreaHeight','dead\x20enemies','PostDamageAsUserJS','format','startActorCommandSelection','setupShockwaveImpactFilter','processVictory','autoBattleUseSkills','ActSeq_DB_DragonbonesMotionAni','setBattleSkew','actionEffect','3GLfwfb','PortraitScaleBorderStyle','isSkill','nameY','rowSpacing','isMeleeMultiTargetAction','DisablePartyCmd','windowAreaHeight','updateBitmap','ActionEnd','CalcEscapeRaiseJS','reduce','Enemy','alive\x20actors','_totalValue','guardSkillId','formula','magicReflection','isAnyProjectilePresent','ActSeq_Set_FinishAction','isImmortal','battleAnimation','_updateCursorArea','eraseState','Sprite_Battler_setBattler','refreshDimmerBitmap','stepBack','toLowerCase','updateHpGaugePosition','onEncounterBattleCore','PreDamageAsTargetJS','shouldPopupDamage','isPartyTpbInputtable','_skewX','processForcedAction','2671wUZkSN','canGuardBattleCore','contents','getItemDamageAmountTextBattleCore','battlerSprites','casting','PrioritySortActors','Interrupt','State-%1-%2','_stateSprite','PreApplyAsTargetJS','Window_BattleLog_update','WaitForOpacity','drawItemImagePortraitStyle','Opacity','BattleManager_onEscapeSuccess','refreshStatusWindow','attackAnimationIdSlot','changeBattlebacks','CastCertain','Game_Battler_performEvasion','ShowAddedState','Shadow','repositionCancelButtonBorderStyle','isCommandEnabled','createSeparateDamagePopups','noise','ApplyImmortal','battleCorePreBattleCommonEvent','delay','EscapeFail','CommandAddOptions','_borderPortraitTargetX','statusWindowRectDefaultStyle','_effectType','innerHeight','open','showNormalAnimation','bgType','actions','Window_BattleLog_popBaseLine','isPartyCommandWindowDisabled','displayTpDamage','addBuff','itemHit','refresh','makeAutoBattleActions','setupBattleback','isNonSubmenuCancel','NewPopupBottom','TextAlign','origin','ShowReflect','_back2Sprite','speed','optDisplayTp','_actions','Game_Battler_makeSpeed','displayReflectionPlayBack','AutoBattle','slice','tone','Frame','itemTextAlign','71GrCSve','hasSvBattler','_allTargets','AnchorY','setFrame','BattleDefeatJS','setHelpWindowItem','_methods','FlinchDuration','performActionMotions','CounterPlayback','skillWindowRect','isBypassDamageCap','actorId','addChild','_enemyId','updateCommandNameWindow','ActSeq_Mechanics_Immortal','Game_Actor_makeActionList','removeActor','_branch','skewBattler','visualHpGauge','useDigitGrouping','scope','BattleManager_onEncounter','zoomDuration','EnableDamageCap','worldTransform','CmdTextAutoBattle','_svBattlerData','StyleOFF','setBattleCameraTargets','WaitForAngle','updateStatusWindowPosition','battleUIOffsetX','ActionEffect','startWeaponAnimation','autoBattleStart','SkillItemStandardCols','getNextSubject','MAT','endAnimation','TPB','ActSeq_Impact_ZoomBlurTargetCenter','updateActors','updateStateSpriteBattleCore','updateMotionCount','hitRate','_skewWholeDuration','_targetGrowX','constructor','_speed','_tpbNeedsPartyCommand','setBattler','createInnerPortrait','SkipPartyCmd','drawItemStyleIconText','ActSeq_BattleLog_PushBaseLine','displayReflection','inBattle','processPostBattleCommonEvents','_effectDuration','isEscapeCommandEnabled','playEnemyAttack','_additionalSprites','%1Event','ActSeq_Animation_ActionAnimation','_index','registerDefeatedEnemy','Destination','setBattleCameraOffset','#%1','ActSeq_Mechanics_Collapse','Window_BattleLog_displayFailure','setBattleAngle','getHardDamageCap','isTickBased','attackSkillId','join','alive\x20friends\x20not\x20target','AutoBattleRect','ActSeq_Mechanics_StbExtraAction','isDeathStateAffected','svBattlerAnchorY','updateOpacity','Scene_Battle_stop','process_VisuMZ_BattleCore_DamageStyles','centerFrontViewSprite','includes','autoMeleeSingleTargetActionSet','Spriteset_Battle_updateActors','WtypeId','options','ForceExploited','CalcEscapeRatioJS','command301_PreBattleEvent','parent','adjustPosition_1for1','initBattlePortrait','loadSystem','default','addBattleCoreAutoBattleStartupCommand','XPActorCommandLines','isForOne','startSkew','_shake','_regionBattleback2','refreshActorPortrait','<%1>\x5cs*([\x5cs\x5cS]*)\x5cs*<\x5c/%1>','ShowPortraitsBorderStyle','not\x20focus','isBuffAffected','initialize','_growEasing','CriticalDmgFlat','user','weaponTypes','EVAL','swing','ActSeq_Movement_WaitForMovement','onOpacityEnd','collapseType','clearBattleCoreData','callOkHandler','attack','updateWeather','portrait','ActSeq_Mechanics_RemoveBuffDebuff','ShowRemovedBuff','partyCommandWindowRectXPStyle','activate','JumpToLabel','svBattlerAnchorX','damageFlat','actorCommandAutoBattle','itemWindowRect','isAttack','onRegeneratePlayStateAnimation','chantStyle','loadSvActor','logWindowRect','SKILLS','ScaleToFit','battleCoreResumeLaunchBattle','needsSelection','ActSeq_Horror_NoiseRemove','_motion','BattleCore','svBattlerShadowVisible','Game_BattlerBase_isStateResist','_helpWindow','command357','_jumpWholeDuration','pop','Game_Battler_performDamage','waitForJump','_windowLayer','_action','FlashDuration','Sprite_Battler_updatePosition','Strength','missed','Sprite_Battleback_adjustPosition','friendsUnit','updateSkew','enemyNames','prepareBorderActor','updateGrow','createDistortionSprite','Turns','addDamageSprite','makeHpDamageText','Linear','setupBattleCore','name','Scene_Battle_createAllWindows','_actionInputIndex','clamp','actionSplicePoint','Scene_Map_launchBattle','ActSeq_Mechanics_StbExploit','Game_Map_battleback1Name','SceneManager_isSceneChanging','FaceDirection','validTargets','helpWindowRect','Battleback','VisuMZ_3_ActSeqCamera','Window_BattleLog_performDamage','Sprite_Battler_isMoving','onEnemyOk','alive\x20enemies','AS\x20USER','ActSeq_Horror_Clear','performMagicEvasion','performAttackSlot','Scene_Battle_startEnemySelection','clearForcedGameTroopSettingsBattleCore','battleMembers','IconSet','BattleManager_startTurn','becomeSTBExploited','makeActions','startJump','Game_Action_needsSelection','_cursorArea','AutoBattleOK','getConfigValue','deadMembers','drawGauge','CommandWidth','partyCommandWindowRectBorderStyle','setBattlePortrait','requestMotion','Game_Action_evalDamageFormula','Scene_Battle_createPartyCommandWindow','JSON','_growY','description','PostStartTurnJS','ATK','battleCameraData','Window_BattleLog_pushBaseLine','alive\x20opponents\x20not\x20target','trueRandomTarget','clearFreezeMotion','isForRandomBattleCore','usePremadeActionSequence','PreApplyJS','BravePoints','JS\x20%1START\x20TURN','ActionItemMsg','ChangeOrderBy','Scene_Battle_startActorSelection','setText','1:1','ActSeq_Motion_ClearFreezeFrame','cancelTargetSelectionVisibility','_partyCommandWindow','Sprite_Battler_update','SmoothImage','_skewDuration','ConfigManager_applyData','mainSpriteHeight','ScaleUp','displayMpDamage','mainSpriteScaleX','Sprite_StateIcon_updateFrame','ActSeq_Mechanics_AddState','finishActorInput','DistanceX','Game_Party_removeActor','PreApply%1JS','ActSeq_Camera_Offset','621542ZmUAYY','evalDamageFormulaBattleCore','makeTargetsBattleCore','mainSprite','_actorSprites','hpAffected','battleFloat','_subject','finishActionSet','RegExp','message2','damage','CmdIconEscape','battleCamera','BattleManager_inputtingAction','_appeared','Game_Actor_equips','_growX','ParseWeaponNotetags','Window_ActorCommand_initialize','performActionEnd','Window_BattleLog_performActionEnd','helpWindowRectBorderStyle','Variable','iconText','attackMotions','updateWaitMode','Filename','91691pjiWjf','_angleWholeDuration','_stypeIDs','call','_cancelButton','drawSkillCost','ConvertParams','_autoBattleWindow','Game_Battler_onTurnEnd','min','svBattlerData','list','visible','SvBattlerSolo-%1-%2','thrust','loadBattleback1','compareBattlerSprites','getBattlePortrait','forceAction','battlelog','isMagical','flashDuration','Game_Interpreter_command283','Mechanics','StartTurnMsg','_floatWholeDuration','updateJump','ShowCounter','isWaiting','boxHeight','onBattleStart','battleUIOffsetY','preparePartyRefresh','setHandler','index','performWeaponAnimation','<CENTER>%1','ActSeq_Set_TargetActionSet','invokeMagicReflection','BattleManager_endAction','displayCounter','arRedRate','applyAngleChange','MaxLines','startActorSelection','changeBattlerOpacity','_visualHpGauge_JustDied','_target','ActSeq_Impact_ShockwaveCenterTargets','victory','isSceneChanging','getAttackWeaponAnimationId','SvWeaponMass-%1-%2','isForRandom','evade','addText','_floatHeight','isFlipped','endBattle','_flashDuration','applyCritical','isFriendly','PortraitScale','remove','createBattleField','EscapeSuccessJS','setMoveEasingType','fontSize','updateEventMain','helpAreaBottom','_statusWindow','OverallFormulaJS','PopupOffsetX','_executedValue','_targetFloatHeight','traitObjects','code','_angleEasing','ActSeq_Camera_FocusTarget','reserveCommonEvent','AutoMeleeSolo','processEscape','ForceExploiter','_skillIDs','svShadow','createShadowSprite','setCursorRect','AdjustRect','WaitForScale','_spriteset','checkAutoCustomActionSequenceNotetagEffect','commandAutoBattle','autoSelectPriority','Game_Action_executeDamage','+%1\x20MP','applyImmortal','Sprite_Actor_moveToStartPosition','_forcedBattleLayout','_stateIconSprite','CriticalDmgRate','isBattleSys','isSkillItemWindowsMiddle','COMBAT\x20LOG','changePaintOpacity','checkTpbInputOpen','ITEM','Settings','clearMotion','_pattern','attachSpritesToDistortionSprite','onEscapeFailure','battleAngle','displayEvasion','Sprite_Actor_setActorHome','Elements','ActSeq_Animation_AttackAnimation2','removeChild','updateBattleProcess','refreshRequest','getTraitSetKeys','QoL','JS\x20%1START\x20BATTLE','setSkill','svBattlerName','contentsOpacity','CreateActionSequenceTargets','isForFriend','damageOffsetX','displayAddedStates','setAttack','startDamagePopup','clearResult','setBattlerFacePoint','Wave','bitmapHeight','addAnimationSpriteToContainer','Game_BattlerBase_canGuard','_damageContainer','setLastPluginCommandInterpreter','animationId','isOpponent','battleMove','JS\x20BATTLE\x20DEFEAT','ActSeq_Movement_Scale','Slot','isVisualHpGaugeDisplayed','weapons','clone','bossCollapse','cancelActorInput','isJumping','Game_BattlerBase_initMembers','removedBuffs','HpGauge','RequiresDefeat','BattleManager_updatePhase','battleStatusWindowAnimationContainer','selectPreviousCommand','setupActionSet','fight','isBorderStylePortraitShown','skew','wtypeId','UNTITLED','isPreviousScene','isCancelled','onActorCancel','+%1','Name','COMBATLOG','svAnchorY','Window_BattleLog_performCollapse','performAttack','_homeY','isGuard','_floatEasing','launchBattle','StartTurnWait','_flashColor','isOnCurrentMap','performCastAnimation','setupZoomBlurImpactFilter','\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20Declare\x20Arguments\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20arguments[0];\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20skill\x20=\x20arguments[1];\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20a\x20=\x20user;\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20b\x20=\x20user;\x0a\x20\x20\x20\x20\x20\x20\x20\x20let\x20visible\x20=\x20true;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20Process\x20Code\x0a\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20//\x20Return\x20Value\x0a\x20\x20\x20\x20\x20\x20\x20\x20return\x20visible;\x0a\x20\x20\x20\x20','move','glitch','updateShadow','Spriteset_Battle_createLowerLayer','makeEscapeRatio','addCombatLogCommand','_emptyBitmap','Scene_Battle_onActorOk','maxItems','weaponImageId','performAction','updateMain','drawSingleSkillCost','BackColor','waitForAnimation','onEncounter','updateVisibility','Scene_Battle_skillWindowRect','ActSeq_Movement_FaceTarget','battleCommandIcon','isMVAnimation','arRedFlat','Sprite_Actor_updateBitmap','createEnemyNameContainer','CastAnimation','attackStates','_actor','ActSeq_Impact_MotionTrailCreate','onAllActionsEnd','CmdIconAutoBattle','createActorCommandWindowBattleCore','ActSeq_Zoom_Reset','placeTimeGauge','DefaultSoftScaler','ActSeq_Mechanics_CtbSpeed','applyGlobalCommonEventNotetags','DefaultHardCap','PostEndTurnJS','traitSet','length','charged','battleEffect','Scene_Battle_onEnemyOk','isOptionsCommandEnabled','actorCommandEscape','alive\x20friends\x20not\x20user','applySoftDamageCap','prototype','sleep','Scene_Battle_helpWindowRect','updateCustomActionSequence','ceil','Sprite_Enemy_updateStateSprite','_indent','isUndecided','playEnemyDamage','ESCAPE','addPartyCommand','_tempEquipCheck','addImmortal','ActSeq_DB_DragonbonesTimeScale','anchor','bind','Game_Map_setupBattleback','States','getStypeIdWithName','startGrow','filterArea','performSubstitute','makeDamageValue','undecided','Scene_Options_maxCommands','addNewState','top','BattleLog','NameFontSize','windowPadding','FaceAway','PerformAction','CriticalColor','canGuard','createBattleFieldContainer','Window_BattleLog_displayEvasion','actionBattleCoreJS','addSingleSkillCommand','flashColor','PreApplyAsUserJS','BattleManager_processDefeat','ActSeq_Animation_ShowAnimation','STRUCT','battleGrow','angle','createDamageContainer','isAutoBattle','targetActionSet','_createCursorArea','CriticalHitRateJS','ReflectAnimation','create','setActiveWeaponSet','isAnyoneSpinning','makeActionList','ActSeq_Horror_TVCreate','Game_BattlerBase_addNewState','clearRect','applyForcedGameTroopSettingsBattleCore','DistanceY','reverse','statusText','battleback2Name','dimColor1','isCustomActionSequence','ActSeq_Camera_Reset','Sprite_Actor_initMembers','setHelpWindow','toString','onDisabledPartyCommandSelection','LUK','PopupOffsetY','isAlive','moveBattlerToPoint','_offsetX','setEventCallback','getCommonEventIdWithName','setupBattlebackBattleCore','VisuMZ_3_ActSeqProjectiles','ActSeq_Projectile_Icon','Sprite_Enemy_setHue','pattern','applyArmorModifiers','PreEndTurnJS','randomTargets','requestDragonbonesAnimation','Window_BattleLog_displayTpDamage','ActSeq_Movement_Skew','CmdIconFight','adjustFlippedBattlefield','pages','command301','concat','performDamage','JS\x20%1END\x20BATTLE','Window_BattleLog_performAction','HelpEscape','_targetIndex','startTurn','battleCoreTpbMainPhase','process_VisuMZ_BattleCore_Failsafes','stepForward','forceWeaponAnimation','loadBattleback2','makeActionOrders','destroy','updateSpin','allowRandomSpeed','VisuMZ_2_DragonbonesUnion','MotionFrameWait','updateBattlerContainer','showAnimation','DualWield','CoreEngine','_colorType','setCustomDamageFormula','itemLineRect','createStateSprite','enemy','TP_Rate','drawLineText','createContents','createCancelButton','ActSeq_Mechanics_AtbGauge','#ffffff','Game_Interpreter_terminate','getNextDamagePopup','CastPhysical','callUpdateHelp','SvBattlerMass-%1-%2','ActSeq_Motion_MotionType','processRefresh','performRecovery','_flinched','BattleManager_startInput','isShownOnBattlePortrait','setBackgroundType','_damages','process_VisuMZ_BattleCore_Action_Notetags','transform','apply','placeActorName','CriticalHitMultiplier','gainCurrentActionsFTB','Game_Action_clear','Window_BattleLog_performMagicEvasion','_jumpHeight','ActSeq_Movement_BattleStep','inHomePosition','spell','ActSeq_BattleLog_Clear','_updateClientArea','processBattleCoreJS','_targetGrowY','mhp','makeTargetSprites','cameraDuration','anchorX','_actionBattlers','Game_Interpreter_PluginCommand','_currentAngle','MANUAL','AnimationID','itemHeight','Scene_Battle_updateBattleProcess','_dragonbonesSpriteContainer','process_VisuMZ_BattleCore_jsFunctions','onEnemyCancel','WaitForSkew','split','ActSeq_Impact_ColorBreak','Exploiter','command3011','getColor','mainSpriteWidth','_callSceneOptions','ReflectPlayback','buffAdd','Point','Window_Options_statusText','frameVisible','isFrameVisible','startMotion','regenerateAll','performSTBExploiter','VisuMZ_1_ElementStatusCore','performCounter','trim','updateBorderStyle','opacity','fillRect','ActSeq_Mechanics_VariablePopup','Width','Weapon-%1-%2','adjustPosition_ScaleToFit','ActSeq_Mechanics_RemoveState','_enemyID','hardDamageCap','battleDisplayText','_borderPortraitDuration','repeats','_targetSkewY','message4','removeAnimationFromContainer','playReflection','ActSeq_Movement_WaitForSkew','ActionSkillMsg1','updatePositionBattleCore','ActSeq_Camera_WaitForCamera','battleCommandName','okTargetSelectionVisibility','isCertainHit','MOTIONS','Game_BattlerBase_refresh','ActSeq_BattleLog_UI','battler','ElementStatusCore','startTpbTurn','BattleManager_initMembers','selectNextCommand','applyFreezeMotionFrames','center','PreRegenerateJS','Rate','PreEndActionJS','isGrowing','max','Game_Troop_setup','border','AutoNotetag','dimColor2','battleback1Name'];const _0x3559=function(_0x47bed1,_0x415901){_0x47bed1=_0x47bed1-0xfb;let _0x595e30=_0x595e[_0x47bed1];return _0x595e30;};const _0x2bbd55=_0x3559;(function(_0x156dc5,_0x44368d){const _0x50db50=_0x3559;while(!![]){try{const _0x47e848=-parseInt(_0x50db50(0x286))+parseInt(_0x50db50(0x4f1))*parseInt(_0x50db50(0x373))+-parseInt(_0x50db50(0x2a5))*-parseInt(_0x50db50(0x396))+parseInt(_0x50db50(0x4d5))+parseInt(_0x50db50(0x1f2))*-parseInt(_0x50db50(0x3d6))+parseInt(_0x50db50(0x6e6))+-parseInt(_0x50db50(0x7ce));if(_0x47e848===_0x44368d)break;else _0x156dc5['push'](_0x156dc5['shift']());}catch(_0x130dc3){_0x156dc5['push'](_0x156dc5['shift']());}}}(_0x595e,0x50187));var label='BattleCore',tier=tier||0x0,dependencies=[],pluginData=$plugins[_0x2bbd55(0x11f)](function(_0x55e6ee){const _0x3c341c=_0x2bbd55;return _0x55e6ee[_0x3c341c(0x27a)]&&_0x55e6ee[_0x3c341c(0x4b1)][_0x3c341c(0x42f)]('['+label+']');})[0x0];VisuMZ[label][_0x2bbd55(0x55b)]=VisuMZ[label][_0x2bbd55(0x55b)]||{},VisuMZ[_0x2bbd55(0x4f7)]=function(_0x4d5b6a,_0x2be5b2){const _0x5e7bbb=_0x2bbd55;for(const _0xa206d0 in _0x2be5b2){if(_0xa206d0[_0x5e7bbb(0x87d)](/(.*):(.*)/i)){const _0x492876=String(RegExp['$1']),_0x5f3b3b=String(RegExp['$2'])[_0x5e7bbb(0x6d4)]()['trim']();let _0x381546,_0x54a584,_0xfdfb55;switch(_0x5f3b3b){case'NUM':_0x381546=_0x2be5b2[_0xa206d0]!==''?Number(_0x2be5b2[_0xa206d0]):0x0;break;case _0x5e7bbb(0x7f0):_0x54a584=_0x2be5b2[_0xa206d0]!==''?JSON['parse'](_0x2be5b2[_0xa206d0]):[],_0x381546=_0x54a584[_0x5e7bbb(0x28f)](_0x49882e=>Number(_0x49882e));break;case _0x5e7bbb(0x44c):_0x381546=_0x2be5b2[_0xa206d0]!==''?eval(_0x2be5b2[_0xa206d0]):null;break;case _0x5e7bbb(0x219):_0x54a584=_0x2be5b2[_0xa206d0]!==''?JSON['parse'](_0x2be5b2[_0xa206d0]):[],_0x381546=_0x54a584[_0x5e7bbb(0x28f)](_0x3af0bf=>eval(_0x3af0bf));break;case _0x5e7bbb(0x4af):_0x381546=_0x2be5b2[_0xa206d0]!==''?JSON['parse'](_0x2be5b2[_0xa206d0]):'';break;case _0x5e7bbb(0x877):_0x54a584=_0x2be5b2[_0xa206d0]!==''?JSON[_0x5e7bbb(0x28a)](_0x2be5b2[_0xa206d0]):[],_0x381546=_0x54a584['map'](_0x10b08d=>JSON[_0x5e7bbb(0x28a)](_0x10b08d));break;case _0x5e7bbb(0x6c9):_0x381546=_0x2be5b2[_0xa206d0]!==''?new Function(JSON[_0x5e7bbb(0x28a)](_0x2be5b2[_0xa206d0])):new Function(_0x5e7bbb(0x780));break;case'ARRAYFUNC':_0x54a584=_0x2be5b2[_0xa206d0]!==''?JSON[_0x5e7bbb(0x28a)](_0x2be5b2[_0xa206d0]):[],_0x381546=_0x54a584[_0x5e7bbb(0x28f)](_0x4cb94b=>new Function(JSON[_0x5e7bbb(0x28a)](_0x4cb94b)));break;case'STR':_0x381546=_0x2be5b2[_0xa206d0]!==''?String(_0x2be5b2[_0xa206d0]):'';break;case'ARRAYSTR':_0x54a584=_0x2be5b2[_0xa206d0]!==''?JSON[_0x5e7bbb(0x28a)](_0x2be5b2[_0xa206d0]):[],_0x381546=_0x54a584[_0x5e7bbb(0x28f)](_0x1dee58=>String(_0x1dee58));break;case _0x5e7bbb(0x601):_0xfdfb55=_0x2be5b2[_0xa206d0]!==''?JSON['parse'](_0x2be5b2[_0xa206d0]):{},_0x4d5b6a[_0x492876]={},VisuMZ[_0x5e7bbb(0x4f7)](_0x4d5b6a[_0x492876],_0xfdfb55);continue;case _0x5e7bbb(0x6cc):_0x54a584=_0x2be5b2[_0xa206d0]!==''?JSON[_0x5e7bbb(0x28a)](_0x2be5b2[_0xa206d0]):[],_0x381546=_0x54a584['map'](_0x56e1fe=>VisuMZ['ConvertParams']({},JSON[_0x5e7bbb(0x28a)](_0x56e1fe)));break;default:continue;}_0x4d5b6a[_0x492876]=_0x381546;}}return _0x4d5b6a;},(_0x2a5def=>{const _0x31b083=_0x2bbd55,_0x3f6b3b=_0x2a5def[_0x31b083(0x485)];for(const _0x92aa79 of dependencies){if(!Imported[_0x92aa79]){alert(_0x31b083(0x72f)[_0x31b083(0x36b)](_0x3f6b3b,_0x92aa79)),SceneManager['exit']();break;}}const _0x38dbb2=_0x2a5def[_0x31b083(0x4b1)];if(_0x38dbb2[_0x31b083(0x87d)](/\[Version[ ](.*?)\]/i)){const _0x366b68=Number(RegExp['$1']);_0x366b68!==VisuMZ[label][_0x31b083(0x848)]&&(alert(_0x31b083(0x2b6)[_0x31b083(0x36b)](_0x3f6b3b,_0x366b68)),SceneManager['exit']());}if(_0x38dbb2['match'](/\[Tier[ ](\d+)\]/i)){const _0x5d0740=Number(RegExp['$1']);_0x5d0740<tier?(alert('%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.'['format'](_0x3f6b3b,_0x5d0740,tier)),SceneManager[_0x31b083(0x6dd)]()):tier=Math['max'](_0x5d0740,tier);}VisuMZ[_0x31b083(0x4f7)](VisuMZ[label]['Settings'],_0x2a5def[_0x31b083(0x745)]);})(pluginData),VisuMZ[_0x2bbd55(0x56e)]=function(_0x55a2f9){const _0x382374=_0x2bbd55;let _0x3f32e7=[];for(const _0x547bf5 of _0x55a2f9){_0x3f32e7=_0x3f32e7['concat'](VisuMZ[_0x382374(0x7ee)](_0x547bf5));}return _0x3f32e7[_0x382374(0x11f)](_0x513c9e=>_0x513c9e);},VisuMZ['ConvertActionSequenceTarget']=function(_0x304b39){const _0x56d47a=_0x2bbd55,_0x3cbf82=BattleManager[_0x56d47a(0x2db)]()['filter'](_0x39412a=>_0x39412a&&_0x39412a[_0x56d47a(0x7ff)]()),_0x29ee93=BattleManager[_0x56d47a(0x4dc)],_0x2342a6=BattleManager['_target'],_0x43574b=BattleManager[_0x56d47a(0x3d8)]?BattleManager[_0x56d47a(0x3d8)]['slice'](0x0):_0x3cbf82;_0x304b39=_0x304b39[_0x56d47a(0x38e)]()[_0x56d47a(0x692)]();if(_0x304b39===_0x56d47a(0x44a))return[_0x29ee93];else{if(_0x304b39==='current\x20target')return[_0x2342a6];else{if(_0x304b39==='prev\x20target'){if(_0x2342a6){const _0x386535=_0x43574b[_0x56d47a(0x280)](_0x2342a6);return _0x386535>=0x0?[_0x43574b[_0x386535-0x1]||_0x2342a6]:[_0x2342a6];}}else{if(_0x304b39==='text\x20target'){if(_0x2342a6){const _0x506401=_0x43574b['indexOf'](_0x2342a6);return _0x506401>=0x0?[_0x43574b[_0x506401+0x1]||_0x2342a6]:[_0x2342a6];}}else{if(_0x304b39===_0x56d47a(0x7b0))return _0x43574b;else{if(_0x304b39===_0x56d47a(0x81c))return[_0x29ee93][_0x56d47a(0x633)](_0x43574b);else{if(_0x304b39===_0x56d47a(0x445))return _0x3cbf82[_0x56d47a(0x11f)](_0x2ddf0d=>_0x2ddf0d!==_0x29ee93&&!_0x43574b[_0x56d47a(0x42f)](_0x2ddf0d)&&_0x2ddf0d[_0x56d47a(0x879)]());}}}}}}if(_0x29ee93){if(_0x304b39===_0x56d47a(0x862))return _0x29ee93['friendsUnit']()[_0x56d47a(0x1ee)]();else{if(_0x304b39===_0x56d47a(0x5d5))return _0x29ee93[_0x56d47a(0x47a)]()[_0x56d47a(0x1ee)]()[_0x56d47a(0x11f)](_0x3d926f=>_0x3d926f!==_0x29ee93);else{if(_0x304b39===_0x56d47a(0x426))return _0x29ee93[_0x56d47a(0x47a)]()[_0x56d47a(0x1ee)]()[_0x56d47a(0x11f)](_0x3f1378=>_0x3f1378!==_0x2342a6);else{if(_0x304b39===_0x56d47a(0x86e))return _0x29ee93['friendsUnit']()[_0x56d47a(0x4a7)]();else{if(_0x304b39[_0x56d47a(0x87d)](/FRIEND INDEX (\d+)/i)){const _0x2fb3d3=Number(RegExp['$1']);return[_0x29ee93[_0x56d47a(0x47a)]()[_0x56d47a(0x158)]()[_0x2fb3d3]];}}}}}if(_0x304b39===_0x56d47a(0x856))return _0x29ee93[_0x56d47a(0x1f3)]()[_0x56d47a(0x1ee)]();else{if(_0x304b39===_0x56d47a(0x4b6))return _0x29ee93[_0x56d47a(0x1f3)]()[_0x56d47a(0x1ee)]()[_0x56d47a(0x11f)](_0x3e2b34=>_0x3e2b34!==_0x2342a6);else{if(_0x304b39===_0x56d47a(0x777))return _0x29ee93[_0x56d47a(0x1f3)]()[_0x56d47a(0x4a7)]();else{if(_0x304b39[_0x56d47a(0x87d)](/OPPONENT INDEX (\d+)/i)){const _0x276179=Number(RegExp['$1']);return[_0x29ee93[_0x56d47a(0x1f3)]()[_0x56d47a(0x158)]()[_0x276179]];}}}}}if(_0x304b39===_0x56d47a(0x380))return $gameParty['aliveMembers']();else{if(_0x304b39===_0x56d47a(0x1cb))return $gameParty[_0x56d47a(0x1ee)]()[_0x56d47a(0x11f)](_0x3fe5b6=>_0x3fe5b6!==_0x29ee93);else{if(_0x304b39===_0x56d47a(0x13f))return $gameParty['aliveMembers']()[_0x56d47a(0x11f)](_0x4efa64=>_0x4efa64!==_0x2342a6);else{if(_0x304b39===_0x56d47a(0x85f))return $gameParty[_0x56d47a(0x4a7)]();else{if(_0x304b39[_0x56d47a(0x87d)](/ACTOR INDEX (\d+)/i)){const _0x4ae321=Number(RegExp['$1']);return[$gameParty['members']()[_0x4ae321]];}else{if(_0x304b39['match'](/ACTOR ID (\d+)/i)){const _0x498cd4=Number(RegExp['$1']);return[$gameActors[_0x56d47a(0x148)](_0x498cd4)];}}}}}}if(_0x304b39===_0x56d47a(0x496))return $gameTroop[_0x56d47a(0x1ee)]();else{if(_0x304b39===_0x56d47a(0x773))return $gameTroop['aliveMembers']()[_0x56d47a(0x11f)](_0x1a71ba=>_0x1a71ba!==_0x29ee93);else{if(_0x304b39===_0x56d47a(0x76d))return $gameTroop[_0x56d47a(0x1ee)]()[_0x56d47a(0x11f)](_0x1d5c9f=>_0x1d5c9f!==_0x2342a6);else{if(_0x304b39===_0x56d47a(0x369))return $gameTroop['deadMembers']();else{if(_0x304b39[_0x56d47a(0x87d)](/ENEMY INDEX (\d+)/i)){const _0x5967d4=Number(RegExp['$1']);return[$gameTroop[_0x56d47a(0x158)]()[_0x5967d4]];}else{if(_0x304b39[_0x56d47a(0x87d)](/ENEMY ID (\d+)/i)){const _0x3b28e4=Number(RegExp['$1']);return $gameTroop[_0x56d47a(0x1ee)]()[_0x56d47a(0x11f)](_0x550d00=>_0x550d00[_0x56d47a(0x167)]()===_0x3b28e4);}}}}}}if(_0x304b39===_0x56d47a(0x6bf))return _0x3cbf82[_0x56d47a(0x11f)](_0x40ca3e=>_0x40ca3e['isAlive']());else{if(_0x304b39==='alive\x20battlers\x20not\x20user')return _0x3cbf82['filter'](_0x5cdb53=>_0x5cdb53['isAlive']()&&_0x5cdb53!==_0x29ee93);else{if(_0x304b39==='alive\x20battlers\x20not\x20target')return _0x3cbf82[_0x56d47a(0x11f)](_0x38f08e=>_0x38f08e['isAlive']()&&_0x38f08e!==_0x2342a6);else{if(_0x304b39==='dead\x20battlers')return _0x3cbf82[_0x56d47a(0x11f)](_0x5304da=>_0x5304da[_0x56d47a(0x81e)]());}}}return[];},PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x700),_0x5a2804=>{const _0x107507=_0x2bbd55;if(!SceneManager[_0x107507(0xfb)]())return;VisuMZ[_0x107507(0x4f7)](_0x5a2804,_0x5a2804);const _0x2261f5=$gameTemp[_0x107507(0x868)](),_0x435b65=BattleManager[_0x107507(0x474)],_0x4fe75f=BattleManager[_0x107507(0x4dc)],_0x1f6a66=BattleManager[_0x107507(0x3d8)]?BattleManager[_0x107507(0x3d8)][_0x107507(0x3d2)](0x0):[],_0x335b25=BattleManager['_logWindow'];if(!_0x2261f5||!_0x435b65||!_0x4fe75f)return;if(!_0x435b65[_0x107507(0x2d9)]())return;if(_0x5a2804[_0x107507(0x716)])_0x335b25[_0x107507(0x876)](_0x4fe75f,_0x435b65[_0x107507(0x2d9)]());_0x5a2804[_0x107507(0x3b1)]&&_0x335b25[_0x107507(0x786)](_0x107507(0x550),_0x4fe75f,_0x1f6a66,!![]);if(_0x5a2804[_0x107507(0x7cd)])_0x335b25[_0x107507(0x786)](_0x107507(0x86b),_0x4fe75f,_0x435b65);if(_0x5a2804[_0x107507(0x324)])_0x335b25[_0x107507(0x786)]('waitForMovement');if(_0x5a2804[_0x107507(0x5c0)])_0x335b25[_0x107507(0x786)]('performCastAnimation',_0x4fe75f,_0x435b65);if(_0x5a2804[_0x107507(0x1f0)])_0x335b25[_0x107507(0x786)](_0x107507(0x5b6));_0x2261f5[_0x107507(0x240)](_0x107507(0x504));}),PluginManager['registerCommand'](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x319),_0x141edb=>{const _0x1ca435=_0x2bbd55;if(!SceneManager['isSceneBattle']())return;VisuMZ[_0x1ca435(0x4f7)](_0x141edb,_0x141edb);const _0x48ab32=$gameTemp[_0x1ca435(0x868)](),_0x5ec57c=BattleManager[_0x1ca435(0x474)],_0x4625fa=BattleManager[_0x1ca435(0x4dc)],_0x2c75e3=BattleManager['_allTargets']?BattleManager[_0x1ca435(0x3d8)]['slice'](0x0):[],_0xf7d7ab=BattleManager[_0x1ca435(0x86a)],_0x4c0f48=_0x141edb[_0x1ca435(0x647)]??![];if(!_0x48ab32||!_0x5ec57c||!_0x4625fa)return;if(!_0x5ec57c[_0x1ca435(0x2d9)]())return;let _0x1947a9=_0x4c0f48?_0xf7d7ab[_0x1ca435(0x72a)](_0x4625fa):0x1;for(let _0x50619e=0x0;_0x50619e<_0x1947a9;_0x50619e++){_0x4c0f48&&_0x4625fa['isActor']()&&_0xf7d7ab[_0x1ca435(0x786)](_0x1ca435(0x60b),_0x4625fa,_0x50619e);if(_0x141edb[_0x1ca435(0x5f6)])_0xf7d7ab['push'](_0x1ca435(0x5b2),_0x4625fa,_0x5ec57c);if(_0x141edb[_0x1ca435(0x204)]>0x0)_0xf7d7ab['push'](_0x1ca435(0x6e0),_0x141edb[_0x1ca435(0x204)]);if(_0x141edb[_0x1ca435(0x1f7)])_0xf7d7ab[_0x1ca435(0x786)](_0x1ca435(0x646),_0x4625fa,_0x2c75e3,_0x5ec57c['item']()['animationId']);if(_0x141edb[_0x1ca435(0x1f0)])_0xf7d7ab[_0x1ca435(0x786)](_0x1ca435(0x5b6));for(const _0x42faac of _0x2c75e3){if(!_0x42faac)continue;if(_0x141edb[_0x1ca435(0x3fa)])_0xf7d7ab[_0x1ca435(0x786)](_0x1ca435(0x372),_0x4625fa,_0x42faac);}}_0x4c0f48&&_0x4625fa[_0x1ca435(0x101)]()&&_0xf7d7ab[_0x1ca435(0x786)](_0x1ca435(0x83c),_0x4625fa);if(_0x141edb[_0x1ca435(0x3b1)])_0xf7d7ab['push']('applyImmortal',_0x4625fa,_0x2c75e3,![]);_0x48ab32[_0x1ca435(0x240)](_0x1ca435(0x504));}),PluginManager['registerCommand'](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x516),_0xbc4761=>{const _0x20b5b5=_0x2bbd55;if(!SceneManager[_0x20b5b5(0xfb)]())return;VisuMZ[_0x20b5b5(0x4f7)](_0xbc4761,_0xbc4761);const _0x57edbf=$gameTemp[_0x20b5b5(0x868)](),_0x43e496=BattleManager['_action'],_0x241be6=BattleManager[_0x20b5b5(0x4dc)],_0x1c1550=BattleManager[_0x20b5b5(0x3d8)]?BattleManager['_allTargets']['slice'](0x0):[],_0x33b634=BattleManager['_logWindow'],_0x522f9c=_0xbc4761['DualWield']??![];if(!_0x57edbf||!_0x43e496||!_0x241be6)return;if(!_0x43e496[_0x20b5b5(0x2d9)]())return;let _0xdad2ff=_0x522f9c?_0x33b634[_0x20b5b5(0x72a)](_0x241be6):0x1;for(let _0x57473b=0x0;_0x57473b<_0xdad2ff;_0x57473b++){for(const _0x5c31a2 of _0x1c1550){if(!_0x5c31a2)continue;_0x522f9c&&_0x241be6[_0x20b5b5(0x101)]()&&_0x33b634[_0x20b5b5(0x786)]('setActiveWeaponSet',_0x241be6,_0x57473b);if(_0xbc4761[_0x20b5b5(0x5f6)])_0x33b634['push'](_0x20b5b5(0x5b2),_0x241be6,_0x43e496);if(_0xbc4761[_0x20b5b5(0x127)]>0x0)_0x33b634['push'](_0x20b5b5(0x6e0),_0xbc4761[_0x20b5b5(0x127)]);if(_0xbc4761['ActionAnimation'])_0x33b634['push']('showAnimation',_0x241be6,[_0x5c31a2],_0x43e496['item']()['animationId']);if(_0xbc4761['WaitCount2']>0x0)_0x33b634[_0x20b5b5(0x786)](_0x20b5b5(0x6e0),_0xbc4761['WaitCount2']);if(_0xbc4761[_0x20b5b5(0x3fa)])_0x33b634['push']('actionEffect',_0x241be6,_0x5c31a2);}}_0x522f9c&&_0x241be6[_0x20b5b5(0x101)]()&&_0x33b634[_0x20b5b5(0x786)](_0x20b5b5(0x83c),_0x241be6);if(_0xbc4761['ApplyImmortal'])_0x33b634['push'](_0x20b5b5(0x550),_0x241be6,_0x1c1550,![]);_0x57edbf[_0x20b5b5(0x240)](_0x20b5b5(0x504));}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x386),_0x4b9564=>{const _0x2d6337=_0x2bbd55;if(!SceneManager['isSceneBattle']())return;VisuMZ['ConvertParams'](_0x4b9564,_0x4b9564);const _0xf77b79=$gameTemp[_0x2d6337(0x868)](),_0xa46d62=BattleManager['_action'],_0x2fdf0a=BattleManager[_0x2d6337(0x4dc)],_0x417496=BattleManager[_0x2d6337(0x3d8)]?BattleManager[_0x2d6337(0x3d8)][_0x2d6337(0x3d2)](0x0):[],_0x13b5a6=BattleManager[_0x2d6337(0x86a)];if(!_0xf77b79||!_0xa46d62||!_0x2fdf0a)return;if(!_0xa46d62[_0x2d6337(0x2d9)]())return;if(_0x4b9564[_0x2d6337(0x3b1)])_0x13b5a6[_0x2d6337(0x786)]('applyImmortal',_0x2fdf0a,_0x417496,![]);if(_0x4b9564['WaitForNewLine'])_0x13b5a6['push']('waitForNewLine');if(_0x4b9564[_0x2d6337(0x79e)])_0x13b5a6['push'](_0x2d6337(0x2b3));if(_0x4b9564['ClearBattleLog'])_0x13b5a6[_0x2d6337(0x786)](_0x2d6337(0x277));if(_0x4b9564[_0x2d6337(0x37c)])_0x13b5a6[_0x2d6337(0x786)](_0x2d6337(0x4e9),_0x2fdf0a);if(_0x4b9564[_0x2d6337(0x324)])_0x13b5a6[_0x2d6337(0x786)](_0x2d6337(0x359));_0xf77b79['setWaitMode']('battlelog');}),PluginManager[_0x2bbd55(0x70a)](pluginData['name'],'ActSeq_ChangeAngle',_0x2dd1dc=>{const _0x4551bd=_0x2bbd55;if(!SceneManager[_0x4551bd(0xfb)]())return;if(!Imported[_0x4551bd(0x492)])return;VisuMZ[_0x4551bd(0x4f7)](_0x2dd1dc,_0x2dd1dc);const _0x1c8f04=$gameTemp['getLastPluginCommandInterpreter'](),_0x53905c=_0x2dd1dc['WaitForAngle'];if(!_0x1c8f04)return;$gameScreen['setBattleAngle'](_0x2dd1dc[_0x4551bd(0x24b)],_0x2dd1dc[_0x4551bd(0x1b7)],_0x2dd1dc[_0x4551bd(0x7d7)]);if(_0x53905c)_0x1c8f04[_0x4551bd(0x240)](_0x4551bd(0x560));}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],'ActSeq_Angle_Reset',_0x2a5524=>{const _0x362709=_0x2bbd55;if(!SceneManager['isSceneBattle']())return;if(!Imported[_0x362709(0x492)])return;VisuMZ[_0x362709(0x4f7)](_0x2a5524,_0x2a5524);const _0x1f6722=$gameTemp['getLastPluginCommandInterpreter'](),_0x5475b0=_0x2a5524[_0x362709(0x3f7)];if(!_0x1f6722)return;$gameScreen[_0x362709(0x421)](0x0,_0x2a5524[_0x362709(0x1b7)],_0x2a5524[_0x362709(0x7d7)]);if(_0x5475b0)_0x1f6722[_0x362709(0x240)](_0x362709(0x560));}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x703),_0x455548=>{const _0x2d230f=_0x2bbd55;if(!SceneManager[_0x2d230f(0xfb)]())return;if(!Imported[_0x2d230f(0x492)])return;const _0x544fb=$gameTemp[_0x2d230f(0x868)]();if(!_0x544fb)return;_0x544fb[_0x2d230f(0x240)](_0x2d230f(0x560));}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x419),_0x797c4d=>{const _0x13c5ef=_0x2bbd55;if(!SceneManager['isSceneBattle']())return;VisuMZ[_0x13c5ef(0x4f7)](_0x797c4d,_0x797c4d);const _0x4ffc83=$gameTemp[_0x13c5ef(0x868)](),_0x5861fa=BattleManager[_0x13c5ef(0x474)],_0x2822b3=BattleManager[_0x13c5ef(0x4dc)],_0x181f8e=VisuMZ[_0x13c5ef(0x56e)](_0x797c4d[_0x13c5ef(0x846)]),_0x57f086=_0x797c4d[_0x13c5ef(0x15a)],_0x1e97ae=BattleManager[_0x13c5ef(0x86a)];if(!_0x4ffc83||!_0x5861fa||!_0x2822b3)return;if(!_0x5861fa[_0x13c5ef(0x2d9)]())return;let _0x40b6ff=_0x5861fa[_0x13c5ef(0x2d9)]()[_0x13c5ef(0x57c)];if(_0x40b6ff<0x0)_0x40b6ff=_0x2822b3[_0x13c5ef(0x339)]();$gameTemp[_0x13c5ef(0x2e4)](_0x181f8e,_0x40b6ff,_0x57f086),_0x797c4d['WaitForAnimation']&&_0x4ffc83[_0x13c5ef(0x240)](_0x13c5ef(0x388));}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],'ActSeq_Animation_AttackAnimation',_0x27cd32=>{const _0x18d63d=_0x2bbd55;if(!SceneManager['isSceneBattle']())return;VisuMZ[_0x18d63d(0x4f7)](_0x27cd32,_0x27cd32);const _0x9ad279=$gameTemp[_0x18d63d(0x868)](),_0xe1dff8=BattleManager[_0x18d63d(0x4dc)],_0x40fea9=VisuMZ[_0x18d63d(0x56e)](_0x27cd32[_0x18d63d(0x846)]),_0x4c64f1=_0x27cd32[_0x18d63d(0x15a)],_0x1e3fa3=BattleManager[_0x18d63d(0x86a)];if(!_0x9ad279||!_0xe1dff8)return;const _0xbee5dd=_0xe1dff8['attackAnimationId1']();$gameTemp[_0x18d63d(0x2e4)](_0x40fea9,_0xbee5dd,_0x4c64f1),_0x27cd32[_0x18d63d(0x1f0)]&&_0x9ad279[_0x18d63d(0x240)](_0x18d63d(0x388));}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x564),_0x43775c=>{const _0x5b0ac4=_0x2bbd55;if(!SceneManager[_0x5b0ac4(0xfb)]())return;VisuMZ[_0x5b0ac4(0x4f7)](_0x43775c,_0x43775c);const _0x2be45c=_0x56fc20[_0x5b0ac4(0x3a7)](_0x43775c[_0x5b0ac4(0x581)]);if(_0x2be45c<=0x0)return;const _0x9c198f=$gameTemp[_0x5b0ac4(0x868)](),_0x56fc20=BattleManager[_0x5b0ac4(0x4dc)],_0x3182de=VisuMZ[_0x5b0ac4(0x56e)](_0x43775c[_0x5b0ac4(0x846)]),_0x2123d3=_0x43775c[_0x5b0ac4(0x15a)],_0x3672d1=BattleManager['_logWindow'];if(!_0x9c198f||!_0x56fc20)return;$gameTemp[_0x5b0ac4(0x2e4)](_0x3182de,_0x2be45c,_0x2123d3),_0x43775c[_0x5b0ac4(0x1f0)]&&_0x9c198f[_0x5b0ac4(0x240)]('battleAnimation');}),PluginManager[_0x2bbd55(0x70a)](pluginData['name'],_0x2bbd55(0x29a),_0x20ee3c=>{const _0x4a67de=_0x2bbd55;if(!SceneManager[_0x4a67de(0xfb)]())return;VisuMZ[_0x4a67de(0x4f7)](_0x20ee3c,_0x20ee3c);const _0x3da9e1=$gameTemp[_0x4a67de(0x868)](),_0x4bb0dc=BattleManager[_0x4a67de(0x474)],_0x21a40=_0x20ee3c[_0x4a67de(0x15a)],_0x30798c=VisuMZ[_0x4a67de(0x56e)](_0x20ee3c['Targets']);if(!_0x3da9e1||!_0x4bb0dc)return;if(!_0x4bb0dc[_0x4a67de(0x2d9)]())return;for(const _0x5dc41d of _0x30798c){if(!_0x5dc41d)continue;_0x5dc41d[_0x4a67de(0x5a5)](_0x4bb0dc,_0x21a40);}if(_0x20ee3c[_0x4a67de(0x1f0)])_0x3da9e1[_0x4a67de(0x240)](_0x4a67de(0x388));}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],'ActSeq_Animation_ChangeBattlePortrait',_0x40f1b5=>{const _0x11933e=_0x2bbd55;VisuMZ[_0x11933e(0x4f7)](_0x40f1b5,_0x40f1b5);const _0x48fea7=$gameTemp['getLastPluginCommandInterpreter'](),_0x23d525=VisuMZ[_0x11933e(0x56e)](_0x40f1b5[_0x11933e(0x846)]),_0x303f72=_0x40f1b5[_0x11933e(0x4f0)];if(!_0x303f72)return;for(const _0x320ddb of _0x23d525){if(!_0x320ddb)continue;if(!_0x320ddb['isActor']())continue;_0x320ddb[_0x11933e(0x4ab)](_0x303f72);}}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x600),_0x582ecc=>{const _0x57ad66=_0x2bbd55;if(!SceneManager['isSceneBattle']())return;VisuMZ[_0x57ad66(0x4f7)](_0x582ecc,_0x582ecc);const _0x4ba515=$gameTemp[_0x57ad66(0x868)](),_0x22146d=VisuMZ[_0x57ad66(0x56e)](_0x582ecc[_0x57ad66(0x846)]),_0x1b52c1=_0x582ecc[_0x57ad66(0x679)],_0x20f514=_0x582ecc[_0x57ad66(0x15a)];if(!_0x4ba515)return;$gameTemp[_0x57ad66(0x2e4)](_0x22146d,_0x1b52c1,_0x20f514);if(_0x582ecc['WaitForAnimation'])_0x4ba515[_0x57ad66(0x240)](_0x57ad66(0x388));}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x73d),_0x29e611=>{const _0x5f073a=_0x2bbd55;if(!SceneManager[_0x5f073a(0xfb)]())return;const _0x384e1b=$gameTemp['getLastPluginCommandInterpreter']();if(!_0x384e1b)return;_0x384e1b['setWaitMode'](_0x5f073a(0x388));}),PluginManager['registerCommand'](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x2c7),_0xa0a2e=>{const _0x2eae5b=_0x2bbd55;if(!SceneManager['isSceneBattle']())return;VisuMZ[_0x2eae5b(0x4f7)](_0xa0a2e,_0xa0a2e);const _0x3965de=BattleManager[_0x2eae5b(0x86a)],_0x41a716=_0xa0a2e['CopyCombatLog']&&Imported[_0x2eae5b(0x865)];_0x3965de[_0x2eae5b(0x528)](_0xa0a2e[_0x2eae5b(0x7c1)]),_0x41a716&&Imported[_0x2eae5b(0x865)]&&$gameSystem['addTextToCombatLog'](_0xa0a2e['Text']||'',_0xa0a2e[_0x2eae5b(0x78b)]||0x0);}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x66d),_0x41cd72=>{const _0x249f38=_0x2bbd55;if(!SceneManager[_0x249f38(0xfb)]())return;const _0x1cbf47=BattleManager[_0x249f38(0x86a)];_0x1cbf47[_0x249f38(0x277)]();}),PluginManager[_0x2bbd55(0x70a)](pluginData['name'],_0x2bbd55(0x332),_0x59c0c1=>{const _0x578eb9=_0x2bbd55;if(!SceneManager['isSceneBattle']())return;const _0x265cf3=$gameTemp[_0x578eb9(0x868)](),_0x323079=BattleManager[_0x578eb9(0x474)],_0x2f9d13=BattleManager['_subject'],_0x570aa3=BattleManager[_0x578eb9(0x86a)];if(!_0x265cf3||!_0x323079||!_0x2f9d13)return;if(!_0x323079['item']())return;_0x570aa3[_0x578eb9(0x876)](_0x2f9d13,_0x323079[_0x578eb9(0x2d9)]()),_0x265cf3[_0x578eb9(0x240)](_0x578eb9(0x504));}),PluginManager['registerCommand'](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x70d),_0x2b11cd=>{const _0x2488bb=_0x2bbd55;if(!SceneManager[_0x2488bb(0xfb)]())return;const _0x532dd8=BattleManager['_logWindow'];_0x532dd8[_0x2488bb(0x1e3)]();}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x410),_0x5a9d12=>{const _0x5949ec=_0x2bbd55;if(!SceneManager[_0x5949ec(0xfb)]())return;const _0x3bc3fa=BattleManager['_logWindow'];_0x3bc3fa[_0x5949ec(0x729)]();}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],'ActSeq_BattleLog_Refresh',_0x179501=>{const _0x17459a=_0x2bbd55;if(!SceneManager[_0x17459a(0xfb)]())return;const _0x499e37=BattleManager[_0x17459a(0x86a)];_0x499e37[_0x17459a(0x3c3)]();}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x6ad),_0x31e67a=>{const _0x45e9fa=_0x2bbd55;if(!SceneManager[_0x45e9fa(0xfb)]())return;VisuMZ[_0x45e9fa(0x4f7)](_0x31e67a,_0x31e67a),SceneManager[_0x45e9fa(0x750)][_0x45e9fa(0x75c)](_0x31e67a[_0x45e9fa(0x795)]);}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x340),_0x37f752=>{const _0x7d4280=_0x2bbd55;if(!SceneManager[_0x7d4280(0xfb)]())return;const _0x5b5acd=$gameTemp[_0x7d4280(0x868)]();_0x5b5acd[_0x7d4280(0x240)](_0x7d4280(0x504));}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x263),_0x2ecc54=>{const _0x8b4438=_0x2bbd55;if(!SceneManager[_0x8b4438(0xfb)]())return;const _0x5d468d=$gameTemp['getLastPluginCommandInterpreter'](),_0x12af5a=BattleManager[_0x8b4438(0x86a)];_0x12af5a['waitForNewLine'](),_0x5d468d[_0x8b4438(0x240)]('battlelog');}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],'ActSeq_Camera_Clamp',_0x2e7e11=>{const _0x479cc9=_0x2bbd55;if(!SceneManager[_0x479cc9(0xfb)]())return;if(!Imported['VisuMZ_3_ActSeqCamera'])return;VisuMZ['ConvertParams'](_0x2e7e11,_0x2e7e11);const _0x1336c8=$gameScreen[_0x479cc9(0x4b4)]();_0x1336c8[_0x479cc9(0x7c7)]=_0x2e7e11[_0x479cc9(0x7b1)];}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],'ActSeq_Camera_FocusPoint',_0x2fff0c=>{const _0x2cb988=_0x2bbd55;if(!SceneManager['isSceneBattle']())return;if(!Imported[_0x2cb988(0x492)])return;VisuMZ[_0x2cb988(0x4f7)](_0x2fff0c,_0x2fff0c);const _0x20613c=$gameTemp[_0x2cb988(0x868)](),_0x53ef68=_0x2fff0c[_0x2cb988(0x7c4)];$gameScreen[_0x2cb988(0x727)](_0x2fff0c[_0x2cb988(0x80e)],_0x2fff0c['FocusY'],_0x2fff0c[_0x2cb988(0x1b7)],_0x2fff0c[_0x2cb988(0x7d7)]);if(_0x53ef68)_0x20613c[_0x2cb988(0x240)]('battleCamera');}),PluginManager[_0x2bbd55(0x70a)](pluginData['name'],_0x2bbd55(0x53f),_0x28206f=>{const _0x487939=_0x2bbd55;if(!SceneManager[_0x487939(0xfb)]())return;if(!Imported[_0x487939(0x492)])return;VisuMZ['ConvertParams'](_0x28206f,_0x28206f);const _0x19e90a=$gameTemp[_0x487939(0x868)](),_0x20a345=VisuMZ[_0x487939(0x56e)](_0x28206f['Targets']),_0x4b3fd0=_0x28206f[_0x487939(0x7c4)];$gameScreen[_0x487939(0x3f6)](_0x20a345,_0x28206f[_0x487939(0x1b7)],_0x28206f[_0x487939(0x7d7)]);if(_0x4b3fd0)_0x19e90a[_0x487939(0x240)](_0x487939(0x4e2));}),PluginManager[_0x2bbd55(0x70a)](pluginData['name'],_0x2bbd55(0x4d4),_0x202efc=>{const _0x25da12=_0x2bbd55;if(!SceneManager['isSceneBattle']())return;if(!Imported[_0x25da12(0x492)])return;VisuMZ[_0x25da12(0x4f7)](_0x202efc,_0x202efc);const _0x4232fe=$gameTemp[_0x25da12(0x868)](),_0x3e58c6=_0x202efc[_0x25da12(0x7c4)];$gameScreen['setBattleCameraOffset'](_0x202efc[_0x25da12(0x6ed)],_0x202efc[_0x25da12(0x2cf)],_0x202efc[_0x25da12(0x1b7)],_0x202efc[_0x25da12(0x7d7)]);if(_0x3e58c6)_0x4232fe[_0x25da12(0x240)](_0x25da12(0x4e2));}),PluginManager[_0x2bbd55(0x70a)](pluginData['name'],_0x2bbd55(0x618),_0x1d8e06=>{const _0x311a65=_0x2bbd55;if(!SceneManager[_0x311a65(0xfb)]())return;if(!Imported[_0x311a65(0x492)])return;VisuMZ['ConvertParams'](_0x1d8e06,_0x1d8e06);const _0x3294af=$gameTemp[_0x311a65(0x868)](),_0x5a2158=_0x1d8e06[_0x311a65(0x7b8)],_0x3b5837=_0x1d8e06['ResetOffset'],_0x13f098=_0x1d8e06[_0x311a65(0x7c4)];if(_0x5a2158){const _0x5d2f47=Math['round'](Graphics['width']/0x2),_0x4dd011=Math[_0x311a65(0x86f)](Graphics[_0x311a65(0x6c3)]/0x2);$gameScreen[_0x311a65(0x727)](_0x5d2f47,_0x4dd011,_0x1d8e06[_0x311a65(0x1b7)],_0x1d8e06[_0x311a65(0x7d7)]);}_0x3b5837&&$gameScreen[_0x311a65(0x41d)](0x0,0x0,_0x1d8e06[_0x311a65(0x1b7)],_0x1d8e06['EasingType']);if(_0x13f098)_0x3294af[_0x311a65(0x240)](_0x311a65(0x4e2));}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x6a7),_0x2c330d=>{const _0x4d0ed2=_0x2bbd55;if(!SceneManager[_0x4d0ed2(0xfb)]())return;if(!Imported[_0x4d0ed2(0x492)])return;const _0x78683=$gameTemp[_0x4d0ed2(0x868)]();if(!_0x78683)return;_0x78683['setWaitMode']('battleCamera');}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x370),_0xbcd2e6=>{const _0xddb0a3=_0x2bbd55;if(!SceneManager[_0xddb0a3(0xfb)]())return;if(!Imported[_0xddb0a3(0x643)])return;VisuMZ[_0xddb0a3(0x4f7)](_0xbcd2e6,_0xbcd2e6);const _0x27bff4=VisuMZ['CreateActionSequenceTargets'](_0xbcd2e6[_0xddb0a3(0x846)]),_0x36865e=_0xbcd2e6[_0xddb0a3(0x210)][_0xddb0a3(0x38e)]()[_0xddb0a3(0x692)]();for(const _0x44dc04 of _0x27bff4){if(!_0x44dc04)continue;_0x44dc04[_0xddb0a3(0x62c)](_0x36865e);}}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x5e4),_0x3ea0be=>{const _0x441b3e=_0x2bbd55;if(!SceneManager[_0x441b3e(0xfb)]())return;if(!Imported[_0x441b3e(0x643)])return;VisuMZ['ConvertParams'](_0x3ea0be,_0x3ea0be);const _0x1f5e44=VisuMZ[_0x441b3e(0x56e)](_0x3ea0be[_0x441b3e(0x846)]),_0x1700f3=_0x3ea0be[_0x441b3e(0x6c7)];for(const _0x55a022 of _0x1f5e44){if(!_0x55a022)continue;_0x55a022[_0x441b3e(0x191)]()[_0x441b3e(0x29d)]=_0x1700f3;}}),PluginManager['registerCommand'](pluginData[_0x2bbd55(0x485)],'ActSeq_Element_AddElements',_0x1e6ff5=>{const _0xa55b39=_0x2bbd55;if(!SceneManager[_0xa55b39(0xfb)]())return;if(!Imported[_0xa55b39(0x690)])return;VisuMZ[_0xa55b39(0x4f7)](_0x1e6ff5,_0x1e6ff5);const _0x5d447a=BattleManager[_0xa55b39(0x474)],_0x55a4ca=_0x1e6ff5[_0xa55b39(0x563)];if(!_0x5d447a)return;_0x5d447a[_0xa55b39(0x10a)]=_0x55a4ca;}),PluginManager['registerCommand'](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x869),_0x192ab4=>{const _0x409b29=_0x2bbd55;if(!SceneManager[_0x409b29(0xfb)]())return;if(!Imported[_0x409b29(0x690)])return;const _0x546d2b=BattleManager[_0x409b29(0x474)];if(!_0x546d2b)return;_0x546d2b[_0x409b29(0x357)]();}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x7a5),_0x53f7c8=>{const _0x4ffe78=_0x2bbd55;if(!SceneManager[_0x4ffe78(0xfb)]())return;if(!Imported['VisuMZ_1_ElementStatusCore'])return;VisuMZ[_0x4ffe78(0x4f7)](_0x53f7c8,_0x53f7c8);const _0x50e6f8=BattleManager[_0x4ffe78(0x474)],_0x25d872=_0x53f7c8[_0x4ffe78(0x563)];if(!_0x50e6f8)return;_0x50e6f8['_battleCoreForcedElements']=_0x25d872;}),PluginManager[_0x2bbd55(0x70a)](pluginData['name'],_0x2bbd55(0x31e),_0x507ebd=>{const _0x183807=_0x2bbd55;if(!SceneManager[_0x183807(0xfb)]())return;if(!Imported[_0x183807(0x690)])return;const _0x501640=BattleManager[_0x183807(0x474)];if(!_0x501640)return;_0x501640['_battleCoreNoElement']=!![];}),PluginManager[_0x2bbd55(0x70a)](pluginData['name'],_0x2bbd55(0x498),_0x1aeff5=>{const _0xf344ea=_0x2bbd55;if(!Imported[_0xf344ea(0x1b3)])return;if(!SceneManager[_0xf344ea(0xfb)]())return;VisuMZ[_0xf344ea(0x4f7)](_0x1aeff5,_0x1aeff5);const _0x50e906=VisuMZ[_0xf344ea(0x56e)](_0x1aeff5['Targets']);for(const _0x297273 of _0x50e906){if(!_0x297273)continue;_0x297273[_0xf344ea(0x7fd)](_0xf344ea(0x3b0)),_0x297273[_0xf344ea(0x7fd)]('glitch'),_0x297273[_0xf344ea(0x7fd)]('tv'),_0x297273[_0xf344ea(0x345)]();}$gamePlayer[_0xf344ea(0x3c3)]();}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x83b),_0x233d66=>{const _0x1dd2c9=_0x2bbd55;if(!Imported[_0x1dd2c9(0x1b3)])return;if(!SceneManager[_0x1dd2c9(0xfb)]())return;VisuMZ[_0x1dd2c9(0x4f7)](_0x233d66,_0x233d66);const _0x3dc249=VisuMZ[_0x1dd2c9(0x56e)](_0x233d66['Targets']),_0x49fed0=_0x1dd2c9(0x5a9);_0x233d66[_0x1dd2c9(0x33a)]=Math[_0x1dd2c9(0x5db)](_0x233d66['slices']/0x2),_0x233d66[_0x1dd2c9(0x785)]=_0x233d66['slices'],_0x233d66[_0x1dd2c9(0x567)]=!![];for(const _0x4b49e9 of _0x3dc249){if(!_0x4b49e9)continue;_0x4b49e9[_0x1dd2c9(0x767)](_0x49fed0,_0x233d66);}$gamePlayer[_0x1dd2c9(0x3c3)]();}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x1fa),_0x305151=>{const _0x2c9afa=_0x2bbd55;if(!Imported[_0x2c9afa(0x1b3)])return;if(!SceneManager[_0x2c9afa(0xfb)]())return;VisuMZ['ConvertParams'](_0x305151,_0x305151);const _0x304fcd=VisuMZ[_0x2c9afa(0x56e)](_0x305151['Targets']);for(const _0x522dbe of _0x304fcd){if(!_0x522dbe)continue;_0x522dbe['removeHorrorEffect'](_0x2c9afa(0x5a9));}$gamePlayer['refresh']();}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],'ActSeq_Horror_NoiseCreate',_0x150acb=>{const _0x20cf31=_0x2bbd55;if(!Imported[_0x20cf31(0x1b3)])return;if(!SceneManager[_0x20cf31(0xfb)]())return;VisuMZ[_0x20cf31(0x4f7)](_0x150acb,_0x150acb);const _0x359ab5=VisuMZ[_0x20cf31(0x56e)](_0x150acb[_0x20cf31(0x846)]),_0x4f3fec=_0x20cf31(0x3b0);for(const _0x39bc08 of _0x359ab5){if(!_0x39bc08)continue;_0x39bc08['setHorrorEffectSettings'](_0x4f3fec,_0x150acb);}$gamePlayer['refresh']();}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x468),_0x4783c3=>{const _0x4cc662=_0x2bbd55;if(!Imported[_0x4cc662(0x1b3)])return;if(!SceneManager[_0x4cc662(0xfb)]())return;VisuMZ[_0x4cc662(0x4f7)](_0x4783c3,_0x4783c3);const _0xe25bff=VisuMZ[_0x4cc662(0x56e)](_0x4783c3[_0x4cc662(0x846)]);for(const _0x5ba2ef of _0xe25bff){if(!_0x5ba2ef)continue;_0x5ba2ef[_0x4cc662(0x7fd)](_0x4cc662(0x3b0));}$gamePlayer[_0x4cc662(0x3c3)]();}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x60e),_0x90f795=>{const _0x372b9c=_0x2bbd55;if(!Imported['VisuMZ_2_HorrorEffects'])return;if(!SceneManager[_0x372b9c(0xfb)]())return;VisuMZ[_0x372b9c(0x4f7)](_0x90f795,_0x90f795);const _0x13bcc4=VisuMZ['CreateActionSequenceTargets'](_0x90f795[_0x372b9c(0x846)]),_0x4d9b9e='tv';for(const _0x29256f of _0x13bcc4){if(!_0x29256f)continue;_0x29256f[_0x372b9c(0x767)](_0x4d9b9e,_0x90f795);}$gamePlayer[_0x372b9c(0x3c3)]();}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x84f),_0x37122f=>{const _0x42bd74=_0x2bbd55;if(!Imported[_0x42bd74(0x1b3)])return;if(!SceneManager[_0x42bd74(0xfb)]())return;VisuMZ['ConvertParams'](_0x37122f,_0x37122f);const _0x2ab9be=VisuMZ[_0x42bd74(0x56e)](_0x37122f[_0x42bd74(0x846)]);for(const _0x45c96b of _0x2ab9be){if(!_0x45c96b)continue;_0x45c96b[_0x42bd74(0x7fd)]('tv');}$gamePlayer[_0x42bd74(0x3c3)]();}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x681),_0x35fc0f=>{const _0x2851e5=_0x2bbd55;if(!SceneManager[_0x2851e5(0xfb)]())return;if(!Imported['VisuMZ_3_ActSeqImpact'])return;const _0xbb675b=SceneManager['_scene'][_0x2851e5(0x54a)];if(!_0xbb675b)return;VisuMZ['ConvertParams'](_0x35fc0f,_0x35fc0f);const _0x1b6d3e=_0x35fc0f[_0x2851e5(0x84b)]||0x1,_0x1843b3=_0x35fc0f[_0x2851e5(0x1b7)]||0x1,_0x532d1c=_0x35fc0f[_0x2851e5(0x7d7)]||_0x2851e5(0x483);_0xbb675b[_0x2851e5(0x1f4)](_0x1b6d3e,_0x1843b3,_0x532d1c);}),PluginManager['registerCommand'](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x222),_0x5c3e11=>{const _0x4bee75=_0x2bbd55;if(!SceneManager[_0x4bee75(0xfb)]())return;if(!Imported[_0x4bee75(0x18a)])return;const _0x22ed50=SceneManager[_0x4bee75(0x750)]['_spriteset'];if(!_0x22ed50)return;VisuMZ[_0x4bee75(0x4f7)](_0x5c3e11,_0x5c3e11);const _0x161928=Number(_0x5c3e11['Angle'])||0x0,_0xa6ef27=Number(_0x5c3e11['Rate']),_0x33c4fc=_0x5c3e11['Duration']||0x1,_0x4febb4=_0x5c3e11[_0x4bee75(0x7d7)]||_0x4bee75(0x483);_0x22ed50[_0x4bee75(0x74e)](_0x161928,_0xa6ef27,_0x33c4fc,_0x4febb4);}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],'ActSeq_Impact_MotionBlurTarget',_0x181703=>{const _0x209fc0=_0x2bbd55;if(!SceneManager[_0x209fc0(0xfb)]())return;if(!Imported['VisuMZ_3_ActSeqImpact'])return;const _0x97f231=SceneManager['_scene'][_0x209fc0(0x54a)];if(!_0x97f231)return;VisuMZ['ConvertParams'](_0x181703,_0x181703);const _0x3e2c9b=Number(_0x181703['Angle'])||0x0,_0x145a68=Number(_0x181703[_0x209fc0(0x6b6)]),_0x2f958c=_0x181703[_0x209fc0(0x1b7)]||0x1,_0x108c81=_0x181703[_0x209fc0(0x7d7)]||_0x209fc0(0x483),_0xcfbbdd=VisuMZ[_0x209fc0(0x56e)](_0x181703[_0x209fc0(0x846)]);for(const _0x3819bd of _0xcfbbdd){if(!_0x3819bd)continue;if(!_0x3819bd[_0x209fc0(0x6ae)]())continue;_0x3819bd['battler']()[_0x209fc0(0x74e)](_0x3e2c9b,_0x145a68,_0x2f958c,_0x108c81);}}),PluginManager['registerCommand'](pluginData['name'],_0x2bbd55(0x5c3),_0x315ca4=>{const _0x29f569=_0x2bbd55;if(!SceneManager[_0x29f569(0xfb)]())return;if(!Imported['VisuMZ_3_ActSeqImpact'])return;VisuMZ['ConvertParams'](_0x315ca4,_0x315ca4);const _0x1ea524={'delay':_0x315ca4[_0x29f569(0x3b3)],'duration':_0x315ca4[_0x29f569(0x322)],'hue':_0x315ca4[_0x29f569(0x2fc)],'opacityStart':_0x315ca4[_0x29f569(0x6ca)],'tone':_0x315ca4[_0x29f569(0x3d3)],'visible':!![]},_0x3921bb=VisuMZ[_0x29f569(0x56e)](_0x315ca4['Targets']);for(const _0x25d45f of _0x3921bb){if(!_0x25d45f)continue;_0x25d45f['setBattlerMotionTrailData'](_0x1ea524);}}),PluginManager[_0x2bbd55(0x70a)](pluginData['name'],_0x2bbd55(0x7c9),_0x534405=>{const _0x157fd9=_0x2bbd55;if(!SceneManager[_0x157fd9(0xfb)]())return;if(!Imported[_0x157fd9(0x18a)])return;VisuMZ[_0x157fd9(0x4f7)](_0x534405,_0x534405);const _0x375a19=VisuMZ[_0x157fd9(0x56e)](_0x534405[_0x157fd9(0x846)]);for(const _0x40c42e of _0x375a19){if(!_0x40c42e)continue;_0x40c42e['clearBattlerMotionTrailData']();}}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x772),_0x221b8a=>{const _0x222f39=_0x2bbd55;if(!Imported[_0x222f39(0x18a)])return;const _0x4b436c=SceneManager[_0x222f39(0x750)][_0x222f39(0x54a)];if(!_0x4b436c)return;VisuMZ[_0x222f39(0x4f7)](_0x221b8a,_0x221b8a);const _0xf8661b=_0x221b8a['X']||0x0,_0x14e815=_0x221b8a['Y']||0x0,_0x3d955d=_0x221b8a['Amp']||0x0,_0x2463a7=_0x221b8a[_0x222f39(0x576)]||0x0,_0x2bae4d=_0x221b8a[_0x222f39(0x1b7)]||0x1;_0x4b436c[_0x222f39(0x36d)](_0xf8661b,_0x14e815,_0x3d955d,_0x2463a7,_0x2bae4d);}),PluginManager['registerCommand'](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x311),_0x4a8daf=>{const _0x40b128=_0x2bbd55;if(!SceneManager['isSceneBattle']())return;if(!Imported[_0x40b128(0x18a)])return;const _0x23fe00=SceneManager[_0x40b128(0x750)]['_spriteset'];if(!_0x23fe00)return;VisuMZ[_0x40b128(0x4f7)](_0x4a8daf,_0x4a8daf);const _0xcba5d5=VisuMZ['CreateActionSequenceTargets'](_0x4a8daf[_0x40b128(0x846)]),_0x6b2ddc=_0x4a8daf['TargetLocation'],_0x489dbb=_0x4a8daf[_0x40b128(0x6ed)]||0x0,_0x52b95d=_0x4a8daf['OffsetY']||0x0,_0x47eecf=_0x4a8daf['Amp']||0x0,_0x1397f5=_0x4a8daf[_0x40b128(0x576)]||0x0,_0x48a84f=_0x4a8daf[_0x40b128(0x1b7)]||0x1;for(const _0x349ad6 of _0xcba5d5){if(!_0x349ad6)continue;if(!_0x349ad6[_0x40b128(0x6ae)]())continue;const _0x58d432=_0x349ad6['battler']();let _0x158e1a=_0x58d432[_0x40b128(0x34b)],_0x530653=_0x58d432[_0x40b128(0x71a)];_0x158e1a+=(Graphics[_0x40b128(0x802)]-Graphics['boxWidth'])/0x2,_0x530653+=(Graphics[_0x40b128(0x6c3)]-Graphics[_0x40b128(0x50e)])/0x2;if(_0x6b2ddc['match'](/front/i))_0x158e1a+=(_0x349ad6[_0x40b128(0x2ba)]()?0x1:-0x1)*_0x58d432['mainSpriteWidth']()/0x2;else _0x6b2ddc['match'](/back/i)&&(_0x158e1a+=(_0x349ad6[_0x40b128(0x2ba)]()?-0x1:0x1)*_0x58d432['mainSpriteWidth']()/0x2);if(_0x6b2ddc['match'](/head/i))_0x530653-=_0x58d432[_0x40b128(0x4ca)]();else _0x6b2ddc[_0x40b128(0x87d)](/center/i)&&(_0x530653-=_0x58d432['mainSpriteHeight']()/0x2);_0x158e1a+=_0x489dbb,_0x530653+=_0x52b95d,_0x23fe00[_0x40b128(0x36d)](_0x158e1a,_0x530653,_0x47eecf,_0x1397f5,_0x48a84f);}}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x521),_0x351704=>{const _0x5d4b4d=_0x2bbd55;if(!SceneManager[_0x5d4b4d(0xfb)]())return;if(!Imported[_0x5d4b4d(0x18a)])return;const _0x502140=SceneManager[_0x5d4b4d(0x750)][_0x5d4b4d(0x54a)];if(!_0x502140)return;VisuMZ[_0x5d4b4d(0x4f7)](_0x351704,_0x351704);const _0x42d16c=VisuMZ['CreateActionSequenceTargets'](_0x351704['Targets']),_0x51a4d4=_0x351704[_0x5d4b4d(0x2be)],_0x2abb59=_0x351704[_0x5d4b4d(0x6ed)]||0x0,_0xc99352=_0x351704[_0x5d4b4d(0x2cf)]||0x0,_0x167af9=_0x351704[_0x5d4b4d(0x2e8)]||0x0,_0x4064dc=_0x351704['Wave']||0x0,_0x4b37f9=_0x351704[_0x5d4b4d(0x1b7)]||0x1,_0x1a72b1=Math[_0x5d4b4d(0x4fa)](..._0x42d16c['map'](_0x389d2d=>_0x389d2d['battler']()[_0x5d4b4d(0x34b)]-_0x389d2d[_0x5d4b4d(0x6ae)]()[_0x5d4b4d(0x685)]()/0x2)),_0x46eebf=Math[_0x5d4b4d(0x6b9)](..._0x42d16c['map'](_0x8b3de3=>_0x8b3de3[_0x5d4b4d(0x6ae)]()[_0x5d4b4d(0x34b)]+_0x8b3de3[_0x5d4b4d(0x6ae)]()['mainSpriteWidth']()/0x2)),_0x5198b5=Math['min'](..._0x42d16c['map'](_0x12a241=>_0x12a241['battler']()[_0x5d4b4d(0x71a)]-_0x12a241[_0x5d4b4d(0x6ae)]()[_0x5d4b4d(0x4ca)]())),_0x2d0898=Math['max'](..._0x42d16c[_0x5d4b4d(0x28f)](_0x4a2f79=>_0x4a2f79[_0x5d4b4d(0x6ae)]()[_0x5d4b4d(0x71a)])),_0x11c4df=_0x42d16c['filter'](_0x4bf4b2=>_0x4bf4b2['isActor']())[_0x5d4b4d(0x5cf)],_0x22ad8f=_0x42d16c[_0x5d4b4d(0x11f)](_0x2e327c=>_0x2e327c[_0x5d4b4d(0x2ba)]())['length'];let _0x4da258=0x0,_0x3b0074=0x0;if(_0x51a4d4[_0x5d4b4d(0x87d)](/front/i))_0x4da258=_0x11c4df>=_0x22ad8f?_0x1a72b1:_0x46eebf;else{if(_0x51a4d4['match'](/middle/i))_0x4da258=(_0x1a72b1+_0x46eebf)/0x2,melee=-0x1;else _0x51a4d4[_0x5d4b4d(0x87d)](/back/i)&&(_0x4da258=_0x11c4df>=_0x22ad8f?_0x46eebf:_0x1a72b1);}if(_0x51a4d4[_0x5d4b4d(0x87d)](/head/i))_0x3b0074=_0x5198b5;else{if(_0x51a4d4[_0x5d4b4d(0x87d)](/center/i))_0x3b0074=(_0x5198b5+_0x2d0898)/0x2;else _0x51a4d4[_0x5d4b4d(0x87d)](/base/i)&&(_0x3b0074=_0x2d0898);}_0x4da258+=(Graphics['width']-Graphics[_0x5d4b4d(0x269)])/0x2,_0x3b0074+=(Graphics[_0x5d4b4d(0x6c3)]-Graphics['boxHeight'])/0x2,_0x4da258+=_0x2abb59,_0x3b0074+=_0xc99352,_0x502140[_0x5d4b4d(0x36d)](_0x4da258,_0x3b0074,_0x167af9,_0x4064dc,_0x4b37f9);}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x85a),_0x54593c=>{const _0x5db57b=_0x2bbd55;if(!Imported['VisuMZ_3_ActSeqImpact'])return;const _0x42c047=SceneManager['_scene'][_0x5db57b(0x54a)];if(!_0x42c047)return;VisuMZ[_0x5db57b(0x4f7)](_0x54593c,_0x54593c);const _0x4c0ed5=_0x54593c['X']||0x0,_0x27c753=_0x54593c['Y']||0x0,_0x328f46=_0x54593c[_0x5db57b(0x477)]||0x0,_0x396406=_0x54593c[_0x5db57b(0x18b)]||0x0,_0x136a0f=_0x54593c['Duration']||0x1,_0x56387f=_0x54593c[_0x5db57b(0x7d7)]||_0x5db57b(0x483);_0x42c047[_0x5db57b(0x5a6)](_0x328f46,_0x4c0ed5,_0x27c753,_0x396406,_0x136a0f,_0x56387f);}),PluginManager[_0x2bbd55(0x70a)](pluginData['name'],_0x2bbd55(0x402),_0x20c78e=>{const _0x4b8ad7=_0x2bbd55;if(!Imported['VisuMZ_3_ActSeqImpact'])return;const _0x137a9f=SceneManager[_0x4b8ad7(0x750)][_0x4b8ad7(0x54a)];if(!_0x137a9f)return;VisuMZ[_0x4b8ad7(0x4f7)](_0x20c78e,_0x20c78e);const _0x2de305=VisuMZ[_0x4b8ad7(0x56e)](_0x20c78e['Targets']),_0x585873=_0x20c78e[_0x4b8ad7(0x2be)],_0x3fd49b=_0x20c78e['OffsetX']||0x0,_0x43bdb8=_0x20c78e[_0x4b8ad7(0x2cf)]||0x0,_0xc138c=_0x20c78e[_0x4b8ad7(0x477)]||0x0,_0x2dbf8e=_0x20c78e[_0x4b8ad7(0x18b)]||0x0,_0x35fe79=_0x20c78e[_0x4b8ad7(0x1b7)]||0x1,_0x5bf61c=_0x20c78e[_0x4b8ad7(0x7d7)]||_0x4b8ad7(0x483),_0x461e85=Math[_0x4b8ad7(0x4fa)](..._0x2de305[_0x4b8ad7(0x28f)](_0x21d707=>_0x21d707[_0x4b8ad7(0x6ae)]()[_0x4b8ad7(0x34b)]-_0x21d707[_0x4b8ad7(0x6ae)]()[_0x4b8ad7(0x685)]()/0x2)),_0x1b78e7=Math['max'](..._0x2de305[_0x4b8ad7(0x28f)](_0x39471c=>_0x39471c[_0x4b8ad7(0x6ae)]()[_0x4b8ad7(0x34b)]+_0x39471c[_0x4b8ad7(0x6ae)]()[_0x4b8ad7(0x685)]()/0x2)),_0x4434af=Math[_0x4b8ad7(0x4fa)](..._0x2de305[_0x4b8ad7(0x28f)](_0x29a39e=>_0x29a39e[_0x4b8ad7(0x6ae)]()[_0x4b8ad7(0x71a)]-_0x29a39e[_0x4b8ad7(0x6ae)]()[_0x4b8ad7(0x4ca)]())),_0xaa6df5=Math[_0x4b8ad7(0x6b9)](..._0x2de305[_0x4b8ad7(0x28f)](_0x366a8b=>_0x366a8b[_0x4b8ad7(0x6ae)]()[_0x4b8ad7(0x71a)])),_0x548fb6=_0x2de305[_0x4b8ad7(0x11f)](_0x32d085=>_0x32d085[_0x4b8ad7(0x101)]())[_0x4b8ad7(0x5cf)],_0x299921=_0x2de305['filter'](_0x4dd3bb=>_0x4dd3bb[_0x4b8ad7(0x2ba)]())[_0x4b8ad7(0x5cf)];let _0x4a6ba1=0x0,_0x3e91a4=0x0;if(_0x585873[_0x4b8ad7(0x87d)](/front/i))_0x4a6ba1=_0x548fb6>=_0x299921?_0x461e85:_0x1b78e7;else{if(_0x585873['match'](/middle/i))_0x4a6ba1=(_0x461e85+_0x1b78e7)/0x2,melee=-0x1;else _0x585873['match'](/back/i)&&(_0x4a6ba1=_0x548fb6>=_0x299921?_0x1b78e7:_0x461e85);}if(_0x585873[_0x4b8ad7(0x87d)](/head/i))_0x3e91a4=_0x4434af;else{if(_0x585873['match'](/center/i))_0x3e91a4=(_0x4434af+_0xaa6df5)/0x2;else _0x585873['match'](/base/i)&&(_0x3e91a4=_0xaa6df5);}_0x4a6ba1+=(Graphics['width']-Graphics[_0x4b8ad7(0x269)])/0x2,_0x3e91a4+=(Graphics[_0x4b8ad7(0x6c3)]-Graphics[_0x4b8ad7(0x50e)])/0x2,_0x4a6ba1+=_0x3fd49b,_0x3e91a4+=_0x43bdb8,_0x137a9f[_0x4b8ad7(0x5a6)](_0xc138c,_0x4a6ba1,_0x3e91a4,_0x2dbf8e,_0x35fe79,_0x5bf61c);}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x343),_0x3a6dbb=>{const _0x2d9e70=_0x2bbd55;if(!SceneManager[_0x2d9e70(0xfb)]())return;VisuMZ['ConvertParams'](_0x3a6dbb,_0x3a6dbb);const _0x49d72f=$gameTemp[_0x2d9e70(0x868)](),_0x2618d2=BattleManager[_0x2d9e70(0x474)],_0x4b5c4f=BattleManager[_0x2d9e70(0x4dc)],_0x216e48=BattleManager[_0x2d9e70(0x86a)];if(!_0x49d72f||!_0x2618d2||!_0x4b5c4f)return;if(!_0x2618d2[_0x2d9e70(0x2d9)]())return;const _0x1b154b=VisuMZ[_0x2d9e70(0x56e)](_0x3a6dbb[_0x2d9e70(0x846)]);for(const _0x11cd1 of _0x1b154b){if(!_0x11cd1)continue;_0x216e48[_0x2d9e70(0x786)](_0x2d9e70(0x372),_0x4b5c4f,_0x11cd1);}_0x49d72f[_0x2d9e70(0x240)](_0x2d9e70(0x504));}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x341),_0x18487f=>{const _0x277d3d=_0x2bbd55;if(!SceneManager[_0x277d3d(0xfb)]())return;VisuMZ[_0x277d3d(0x4f7)](_0x18487f,_0x18487f);const _0x3771b2=[_0x277d3d(0x71b),_0x277d3d(0x1df),_0x277d3d(0x4b3),_0x277d3d(0xfd),_0x277d3d(0x3ff),'MDF','AGI',_0x277d3d(0x61d)],_0x1b46e8=_0x18487f['Buffs'],_0x46bb98=_0x18487f[_0x277d3d(0x169)],_0x3cc9de=_0x18487f[_0x277d3d(0x480)],_0x87c8d3=VisuMZ['CreateActionSequenceTargets'](_0x18487f[_0x277d3d(0x846)]);for(const _0x5ae3c8 of _0x87c8d3){if(!_0x5ae3c8)continue;for(const _0x1fd71a of _0x1b46e8){const _0x5b99b8=_0x3771b2[_0x277d3d(0x280)](_0x1fd71a[_0x277d3d(0x6d4)]()[_0x277d3d(0x692)]());_0x5b99b8>=0x0&&_0x5b99b8<=0x7&&_0x5ae3c8[_0x277d3d(0x3c1)](_0x5b99b8,_0x3cc9de);}for(const _0x176e9a of _0x46bb98){const _0xba4fe5=_0x3771b2[_0x277d3d(0x280)](_0x176e9a['toUpperCase']()[_0x277d3d(0x692)]());_0xba4fe5>=0x0&&_0xba4fe5<=0x7&&_0x5ae3c8['addDebuff'](_0xba4fe5,_0x3cc9de);}}}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x4cf),_0x3f8617=>{const _0xc4d7b7=_0x2bbd55;if(!SceneManager[_0xc4d7b7(0xfb)]())return;VisuMZ[_0xc4d7b7(0x4f7)](_0x3f8617,_0x3f8617);const _0xcb224d=_0x3f8617[_0xc4d7b7(0x5e8)],_0x276bba=VisuMZ[_0xc4d7b7(0x56e)](_0x3f8617[_0xc4d7b7(0x846)]);for(const _0x3bb52f of _0x276bba){if(!_0x3bb52f)continue;for(const _0x406fff of _0xcb224d){_0x3bb52f['addState'](_0x406fff);}}}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],'ActSeq_Mechanics_ArmorPenetration',_0x13507b=>{const _0x51a10c=_0x2bbd55;if(!SceneManager[_0x51a10c(0xfb)]())return;VisuMZ[_0x51a10c(0x4f7)](_0x13507b,_0x13507b);const _0x544e19=BattleManager[_0x51a10c(0x474)],_0x5cf970={'arPenRate':_0x13507b[_0x51a10c(0x1f6)],'arPenFlat':_0x13507b[_0x51a10c(0x31a)],'arRedRate':_0x13507b['ArRedRate'],'arRedFlat':_0x13507b[_0x51a10c(0x766)]};_0x544e19[_0x51a10c(0x798)]=_0x5cf970;}),PluginManager['registerCommand'](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x652),_0x1ce77a=>{const _0x1274c7=_0x2bbd55;if(!SceneManager[_0x1274c7(0xfb)]())return;if(!Imported[_0x1274c7(0x1d4)])return;VisuMZ[_0x1274c7(0x4f7)](_0x1ce77a,_0x1ce77a);const _0x289433=VisuMZ[_0x1274c7(0x56e)](_0x1ce77a['Targets']),_0x51993b=_0x1ce77a[_0x1274c7(0x7d3)],_0x45d74e=_0x1ce77a[_0x1274c7(0x7d3)],_0x2095af=_0x1ce77a[_0x1274c7(0x39d)];for(const _0x2335b2 of _0x289433){if(!_0x2335b2)continue;if(_0x2335b2['isAtbChargingState']())_0x2335b2['changeAtbChargeTime'](_0x51993b);else{if(_0x2335b2[_0x1274c7(0x7f5)]()){_0x2335b2['changeAtbCastTime'](_0x45d74e);if(_0x2095af)_0x2335b2[_0x1274c7(0x24c)]();}}}}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x34c),_0x4e72e6=>{const _0x1b576c=_0x2bbd55;if(!SceneManager['isSceneBattle']())return;if(!Imported['VisuMZ_2_BattleSystemBTB'])return;VisuMZ[_0x1b576c(0x4f7)](_0x4e72e6,_0x4e72e6);const _0x39fda2=VisuMZ['CreateActionSequenceTargets'](_0x4e72e6[_0x1b576c(0x846)]),_0x514eed=_0x4e72e6[_0x1b576c(0x4bc)];for(const _0x57454e of _0x39fda2){if(!_0x57454e)continue;_0x57454e[_0x1b576c(0x292)](_0x514eed);}}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x41f),_0x203ff4=>{const _0x2148c7=_0x2bbd55;if(!SceneManager[_0x2148c7(0xfb)]())return;VisuMZ[_0x2148c7(0x4f7)](_0x203ff4,_0x203ff4);const _0x59b9f0=$gameTemp[_0x2148c7(0x868)](),_0x2c741b=BattleManager[_0x2148c7(0x474)],_0x3ec64f=BattleManager[_0x2148c7(0x4dc)];if(!_0x59b9f0||!_0x2c741b||!_0x3ec64f)return;if(!_0x2c741b[_0x2148c7(0x2d9)]())return;const _0x106f29=VisuMZ['CreateActionSequenceTargets'](_0x203ff4[_0x2148c7(0x846)]);for(const _0x1cb1e3 of _0x106f29){if(!_0x1cb1e3)continue;_0x203ff4[_0x2148c7(0x232)]&&(_0x1cb1e3['removeImmortal'](),_0x1cb1e3['addState'](_0x1cb1e3[_0x2148c7(0x2f8)]())),_0x1cb1e3['isDeathStateAffected']()&&_0x1cb1e3[_0x2148c7(0x7e1)]();}_0x59b9f0[_0x2148c7(0x240)](_0x2148c7(0x5d1));}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x749),_0x44042f=>{const _0x58f214=_0x2bbd55;if(!SceneManager[_0x58f214(0xfb)]())return;if(!Imported[_0x58f214(0x304)])return;VisuMZ[_0x58f214(0x4f7)](_0x44042f,_0x44042f);const _0x36d7a6=VisuMZ['CreateActionSequenceTargets'](_0x44042f[_0x58f214(0x846)]),_0x5e383f=_0x44042f[_0x58f214(0x4bf)];for(const _0x32dedf of _0x36d7a6){if(!_0x32dedf)continue;_0x32dedf[_0x58f214(0x748)](_0x5e383f);}}),PluginManager['registerCommand'](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x5ca),_0x24484b=>{const _0x47bd67=_0x2bbd55;if(!SceneManager[_0x47bd67(0xfb)]())return;if(!Imported[_0x47bd67(0x304)])return;VisuMZ[_0x47bd67(0x4f7)](_0x24484b,_0x24484b);const _0x5ad4a9=VisuMZ['CreateActionSequenceTargets'](_0x24484b['Targets']),_0x588ee4=_0x24484b['ChargeRate'],_0x37fa45=_0x24484b[_0x47bd67(0x7d3)];for(const _0x24f0de of _0x5ad4a9){if(!_0x24f0de)continue;if(_0x24f0de[_0x47bd67(0x128)]===_0x47bd67(0x707))_0x24f0de[_0x47bd67(0x214)](_0x588ee4);else _0x24f0de[_0x47bd67(0x128)]===_0x47bd67(0x39b)&&_0x24f0de[_0x47bd67(0x27f)](_0x37fa45);}}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x334),_0x563f77=>{const _0x18d884=_0x2bbd55;if(!SceneManager[_0x18d884(0xfb)]())return;VisuMZ[_0x18d884(0x4f7)](_0x563f77,_0x563f77);const _0x101bd6=BattleManager[_0x18d884(0x474)];if(!_0x101bd6)return;let _0x572504=_0x563f77[_0x18d884(0x1b6)];_0x101bd6[_0x18d884(0x64a)](_0x572504);}),PluginManager['registerCommand'](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x77d),_0x1b3943=>{const _0x54f833=_0x2bbd55;if(!SceneManager[_0x54f833(0xfb)]())return;VisuMZ['ConvertParams'](_0x1b3943,_0x1b3943);const _0x26645d=VisuMZ[_0x54f833(0x56e)](_0x1b3943[_0x54f833(0x846)]);for(const _0x5ca8a8 of _0x26645d){if(!_0x5ca8a8)continue;if(_0x5ca8a8[_0x54f833(0x392)]())_0x5ca8a8[_0x54f833(0x573)]();}}),PluginManager['registerCommand'](pluginData[_0x2bbd55(0x485)],'ActSeq_Mechanics_DeathBreak',_0x18bed2=>{const _0x1d6c5e=_0x2bbd55;if(!SceneManager['isSceneBattle']())return;VisuMZ[_0x1d6c5e(0x4f7)](_0x18bed2,_0x18bed2);const _0xc7a4b4=$gameTemp[_0x1d6c5e(0x868)](),_0x562ce8=BattleManager[_0x1d6c5e(0x4dc)],_0x3c92f6=_0x18bed2['JumpToLabel'];if(!_0xc7a4b4)return;if(!_0x562ce8)return;_0x562ce8&&_0x562ce8['isDead']()&&_0x3c92f6['toUpperCase']()[_0x1d6c5e(0x692)]()!==_0x1d6c5e(0x594)&&_0xc7a4b4[_0x1d6c5e(0x1de)]([_0x3c92f6]);}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],'ActSeq_Mechanics_FtbAction',_0x3c31f0=>{const _0x230878=_0x2bbd55;if(!SceneManager[_0x230878(0xfb)]())return;if(!Imported['VisuMZ_2_BattleSystemFTB'])return;VisuMZ[_0x230878(0x4f7)](_0x3c31f0,_0x3c31f0);const _0x565d45=_0x3c31f0['ActionCount'];BattleManager[_0x230878(0x4dc)]&&BattleManager['_subject'][_0x230878(0x47a)]()[_0x230878(0x666)](_0x565d45);}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x125),_0x5454c3=>{const _0x3b2fd1=_0x2bbd55;if(!SceneManager[_0x3b2fd1(0xfb)]())return;VisuMZ[_0x3b2fd1(0x4f7)](_0x5454c3,_0x5454c3);const _0x3ad369=VisuMZ[_0x3b2fd1(0x56e)](_0x5454c3[_0x3b2fd1(0x846)]),_0x28f4a9=_0x5454c3[_0x3b2fd1(0x72c)],_0x508614=_0x5454c3[_0x3b2fd1(0x7b7)],_0x4efb5b=_0x5454c3['MP_Rate'],_0x147e66=_0x5454c3[_0x3b2fd1(0x288)],_0x49c892=_0x5454c3[_0x3b2fd1(0x64e)],_0x1363ae=_0x5454c3['TP_Flat'],_0x1884e4=_0x5454c3[_0x3b2fd1(0x1dc)];for(const _0x232f70 of _0x3ad369){if(!_0x232f70)continue;const _0xa18eb3=_0x232f70[_0x3b2fd1(0x61f)](),_0x4bb226=Math[_0x3b2fd1(0x86f)](_0x28f4a9*_0x232f70[_0x3b2fd1(0x671)]+_0x508614),_0x2b0177=Math['round'](_0x4efb5b*_0x232f70[_0x3b2fd1(0x1e9)]+_0x147e66),_0x30db22=Math[_0x3b2fd1(0x86f)](_0x49c892*_0x232f70['maxTp']()+_0x1363ae);if(_0x4bb226!==0x0)_0x232f70[_0x3b2fd1(0x111)](_0x4bb226);if(_0x2b0177!==0x0)_0x232f70[_0x3b2fd1(0x85c)](_0x2b0177);if(_0x30db22!==0x0)_0x232f70[_0x3b2fd1(0x6fd)](_0x30db22);if(_0x1884e4)_0x232f70[_0x3b2fd1(0x573)]();_0xa18eb3&&_0x232f70['isDead']()&&_0x232f70['performCollapse']();}}),PluginManager['registerCommand'](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x3e7),_0x423483=>{const _0x33af32=_0x2bbd55;if(!SceneManager[_0x33af32(0xfb)]())return;VisuMZ[_0x33af32(0x4f7)](_0x423483,_0x423483);const _0x572183=VisuMZ['CreateActionSequenceTargets'](_0x423483[_0x33af32(0x846)]);for(const _0x495093 of _0x572183){if(!_0x495093)continue;_0x495093[_0x33af32(0x807)](_0x423483[_0x33af32(0x363)]);}}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x31c),_0x2ab15d=>{const _0x2d6c6b=_0x2bbd55;if(!SceneManager[_0x2d6c6b(0xfb)]())return;VisuMZ['ConvertParams'](_0x2ab15d,_0x2ab15d);const _0x1f084e=BattleManager[_0x2d6c6b(0x474)],_0x47afc1={'criticalHitRate':_0x2ab15d['CriticalHitRate'],'criticalHitFlat':_0x2ab15d[_0x2d6c6b(0x2c4)],'criticalDmgRate':_0x2ab15d[_0x2d6c6b(0x554)],'criticalDmgFlat':_0x2ab15d[_0x2d6c6b(0x449)],'damageRate':_0x2ab15d[_0x2d6c6b(0x81b)],'damageFlat':_0x2ab15d[_0x2d6c6b(0x710)],'hitRate':_0x2ab15d[_0x2d6c6b(0x77c)],'hitFlat':_0x2ab15d[_0x2d6c6b(0x2d0)]};_0x1f084e[_0x2d6c6b(0x1ea)]=_0x47afc1;}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x456),_0x433050=>{const _0x10a23b=_0x2bbd55;if(!SceneManager[_0x10a23b(0xfb)]())return;VisuMZ['ConvertParams'](_0x433050,_0x433050);const _0x29f9a5=[_0x10a23b(0x71b),'MAXMP',_0x10a23b(0x4b3),_0x10a23b(0xfd),_0x10a23b(0x3ff),_0x10a23b(0x6d6),_0x10a23b(0x15e),_0x10a23b(0x61d)],_0x17247e=_0x433050[_0x10a23b(0x137)],_0x606832=_0x433050['Debuffs'],_0x5d6481=VisuMZ[_0x10a23b(0x56e)](_0x433050[_0x10a23b(0x846)]);for(const _0x98f96f of _0x5d6481){if(!_0x98f96f)continue;for(const _0x5cbab4 of _0x17247e){const _0x1b6883=_0x29f9a5[_0x10a23b(0x280)](_0x5cbab4[_0x10a23b(0x6d4)]()['trim']());_0x1b6883>=0x0&&_0x1b6883<=0x7&&_0x98f96f[_0x10a23b(0x446)](_0x1b6883)&&_0x98f96f['removeBuff'](_0x1b6883);}for(const _0x465bfc of _0x606832){const _0x343ed6=_0x29f9a5[_0x10a23b(0x280)](_0x465bfc[_0x10a23b(0x6d4)]()[_0x10a23b(0x692)]());_0x343ed6>=0x0&&_0x343ed6<=0x7&&_0x98f96f[_0x10a23b(0x142)](_0x343ed6)&&_0x98f96f[_0x10a23b(0x16c)](_0x343ed6);}}}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x69a),_0x405d8b=>{const _0x8e456f=_0x2bbd55;if(!SceneManager[_0x8e456f(0xfb)]())return;VisuMZ[_0x8e456f(0x4f7)](_0x405d8b,_0x405d8b);const _0x2abdaa=_0x405d8b['States'],_0xf4a2e=VisuMZ[_0x8e456f(0x56e)](_0x405d8b[_0x8e456f(0x846)]);for(const _0x4dfe00 of _0xf4a2e){if(!_0x4dfe00)continue;for(const _0x24cef4 of _0x2abdaa){_0x4dfe00[_0x8e456f(0x791)](_0x24cef4);}}}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x48b),_0x3b9e30=>{const _0x3f36c8=_0x2bbd55;if(!SceneManager[_0x3f36c8(0xfb)]())return;if(!Imported['VisuMZ_2_BattleSystemSTB'])return;VisuMZ[_0x3f36c8(0x4f7)](_0x3b9e30,_0x3b9e30);const _0x283076=_0x3b9e30['Exploited'],_0x5c8708=VisuMZ[_0x3f36c8(0x56e)](_0x3b9e30[_0x3f36c8(0x846)]),_0x3ca91c=_0x3b9e30[_0x3f36c8(0x434)],_0x1326a7=_0x3b9e30[_0x3f36c8(0x682)],_0x563067=_0x3b9e30[_0x3f36c8(0x543)],_0x5cdbe8=BattleManager['_action'];if(_0x283076)for(const _0x448574 of _0x5c8708){if(!_0x448574)continue;if(_0x448574===user)continue;if(_0x3ca91c)_0x448574[_0x3f36c8(0x1ff)](![]);_0x448574[_0x3f36c8(0x4a0)](BattleManager['_subject'],_0x5cdbe8);}if(_0x1326a7&&BattleManager['_subject']){if(_0x563067)BattleManager[_0x3f36c8(0x4dc)]['setSTBExploited'](![]);const _0x4f4423=_0x5c8708[0x0];BattleManager[_0x3f36c8(0x68f)](_0x4f4423,_0x5cdbe8);}}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x428),_0x16c7c6=>{const _0xcef008=_0x2bbd55;if(!SceneManager[_0xcef008(0xfb)]())return;if(!Imported[_0xcef008(0x828)])return;VisuMZ[_0xcef008(0x4f7)](_0x16c7c6,_0x16c7c6);const _0x3f99eb=_0x16c7c6[_0xcef008(0x19c)];BattleManager['_subject']&&BattleManager[_0xcef008(0x4dc)][_0xcef008(0x171)](_0x3f99eb);}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x1a0),_0x1a208e=>{const _0x4ee585=_0x2bbd55;if(!SceneManager['isSceneBattle']())return;if(!Imported[_0x4ee585(0x828)])return;VisuMZ[_0x4ee585(0x4f7)](_0x1a208e,_0x1a208e);let _0x2059ec=_0x1a208e[_0x4ee585(0x19c)];if(BattleManager[_0x4ee585(0x4dc)]){BattleManager[_0x4ee585(0x4dc)][_0x4ee585(0x3ce)]=BattleManager['_subject'][_0x4ee585(0x3ce)]||[];while(_0x2059ec--){if(BattleManager['_subject']['_actions'][_0x4ee585(0x5cf)]<=0x0)break;BattleManager['_subject'][_0x4ee585(0x3ce)][_0x4ee585(0x2a6)]();}}}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],'ActSeq_Mechanics_TextPopup',_0x5544ee=>{const _0x5f3fea=_0x2bbd55;if(!SceneManager[_0x5f3fea(0xfb)]())return;VisuMZ[_0x5f3fea(0x4f7)](_0x5544ee,_0x5544ee);const _0x35ed12=VisuMZ[_0x5f3fea(0x56e)](_0x5544ee[_0x5f3fea(0x846)]),_0x3bcb34=_0x5544ee[_0x5f3fea(0x7c1)],_0x45b89e={'textColor':ColorManager['getColor'](_0x5544ee[_0x5f3fea(0x1d0)]),'flashColor':_0x5544ee[_0x5f3fea(0x24a)],'flashDuration':_0x5544ee[_0x5f3fea(0x475)]};for(const _0x216dc0 of _0x35ed12){if(!_0x216dc0)continue;_0x216dc0[_0x5f3fea(0x116)](_0x3bcb34,_0x45b89e);}}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x696),_0x1f42db=>{const _0x4b884c=_0x2bbd55;if(!SceneManager[_0x4b884c(0xfb)]())return;VisuMZ['ConvertParams'](_0x1f42db,_0x1f42db);const _0x2ee4cf=VisuMZ[_0x4b884c(0x56e)](_0x1f42db['Targets']);let _0xb1687d=$gameVariables['value'](_0x1f42db[_0x4b884c(0x4ec)]);Imported['VisuMZ_0_CoreEngine']&&_0x1f42db[_0x4b884c(0x80c)]&&(_0xb1687d=VisuMZ[_0x4b884c(0x2cb)](_0xb1687d));const _0x3d5458=String(_0xb1687d),_0xe151a9={'textColor':ColorManager[_0x4b884c(0x684)](_0x1f42db[_0x4b884c(0x1d0)]),'flashColor':_0x1f42db[_0x4b884c(0x24a)],'flashDuration':_0x1f42db['FlashDuration']};for(const _0x41b103 of _0x2ee4cf){if(!_0x41b103)continue;_0x41b103['setupTextPopup'](_0x3d5458,_0xe151a9);}}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x27c),_0x3bca93=>{const _0x4f32f1=_0x2bbd55;if(!SceneManager[_0x4f32f1(0xfb)]())return;const _0x27075b=$gameTemp[_0x4f32f1(0x868)]();if(!_0x27075b)return;_0x27075b[_0x4f32f1(0x240)](_0x4f32f1(0x5d1));}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x4c3),_0xb21f96=>{const _0x5377ec=_0x2bbd55;if(!SceneManager['isSceneBattle']())return;VisuMZ[_0x5377ec(0x4f7)](_0xb21f96,_0xb21f96);const _0x160d2a=VisuMZ[_0x5377ec(0x56e)](_0xb21f96[_0x5377ec(0x846)]);for(const _0x180cee of _0x160d2a){if(!_0x180cee)continue;_0x180cee[_0x5377ec(0x4b8)]();}}),PluginManager[_0x2bbd55(0x70a)](pluginData['name'],'ActSeq_Motion_FreezeMotionFrame',_0x4b1b63=>{const _0x2ac9e8=_0x2bbd55;if(!SceneManager[_0x2ac9e8(0xfb)]())return;VisuMZ['ConvertParams'](_0x4b1b63,_0x4b1b63);const _0xc36de0=VisuMZ[_0x2ac9e8(0x56e)](_0x4b1b63[_0x2ac9e8(0x846)]),_0x157ee2=_0x4b1b63[_0x2ac9e8(0x79d)][_0x2ac9e8(0x38e)]()['trim'](),_0x482044=_0x4b1b63[_0x2ac9e8(0x207)],_0x1a0d01=_0x4b1b63[_0x2ac9e8(0x3d4)];for(const _0x5af612 of _0xc36de0){if(!_0x5af612)continue;_0x5af612[_0x2ac9e8(0x206)](_0x157ee2,_0x482044,_0x1a0d01);}}),PluginManager['registerCommand'](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x659),_0xaf4de7=>{const _0x311501=_0x2bbd55;if(!SceneManager[_0x311501(0xfb)]())return;VisuMZ[_0x311501(0x4f7)](_0xaf4de7,_0xaf4de7);const _0xbba936=VisuMZ['CreateActionSequenceTargets'](_0xaf4de7[_0x311501(0x846)]),_0xbdb611=_0xaf4de7['MotionType'][_0x311501(0x38e)]()['trim'](),_0xf64652=_0xaf4de7[_0x311501(0x207)];for(const _0x1c42fc of _0xbba936){if(!_0x1c42fc)continue;if(_0xbdb611[_0x311501(0x87d)](/ATTACK[ ](\d+)/i))_0x1c42fc[_0x311501(0x49a)](Number(RegExp['$1']));else _0xbdb611===_0x311501(0x453)?_0x1c42fc[_0x311501(0x59d)]():_0x1c42fc[_0x311501(0x4ac)](_0xbdb611);if(!_0xf64652)_0x1c42fc[_0x311501(0x3fb)](0x0);else{if(_0xf64652&&[_0x311501(0x4ff),'swing',_0x311501(0x2a8)]['includes'](_0xbdb611)){}}}}),PluginManager[_0x2bbd55(0x70a)](pluginData['name'],_0x2bbd55(0x739),_0xbb1f6=>{const _0x5b58e2=_0x2bbd55;if(!SceneManager[_0x5b58e2(0xfb)]())return;VisuMZ[_0x5b58e2(0x4f7)](_0xbb1f6,_0xbb1f6);const _0x303f81=BattleManager['_action'];if(!_0x303f81)return;if(!_0x303f81[_0x5b58e2(0x2d9)]())return;const _0x579563=VisuMZ['CreateActionSequenceTargets'](_0xbb1f6['Targets']);for(const _0x45f4c6 of _0x579563){if(!_0x45f4c6)continue;_0x45f4c6[_0x5b58e2(0x5b2)](_0x303f81);}}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x7d0),_0x229deb=>{const _0x1f8ad3=_0x2bbd55;if(!SceneManager[_0x1f8ad3(0xfb)]())return;VisuMZ[_0x1f8ad3(0x4f7)](_0x229deb,_0x229deb);const _0x70872f=VisuMZ['CreateActionSequenceTargets'](_0x229deb[_0x1f8ad3(0x846)]);for(const _0x2a1931 of _0x70872f){if(!_0x2a1931)continue;if(!_0x2a1931[_0x1f8ad3(0x6ae)]())continue;_0x2a1931[_0x1f8ad3(0x6ae)]()[_0x1f8ad3(0x19d)]();}}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],'ActSeq_Motion_WaitMotionFrame',_0xdae0d7=>{const _0xe9b644=_0x2bbd55;if(!SceneManager[_0xe9b644(0xfb)]())return;VisuMZ[_0xe9b644(0x4f7)](_0xdae0d7,_0xdae0d7);const _0x5e02bf=$gameTemp[_0xe9b644(0x868)](),_0x4a1b1a=_0xdae0d7[_0xe9b644(0x644)]*Sprite_Battler['_motionSpeed'];_0x5e02bf[_0xe9b644(0x30c)](_0x4a1b1a);}),PluginManager['registerCommand'](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x66a),_0x28c9b2=>{const _0x18d55e=_0x2bbd55;if(!SceneManager[_0x18d55e(0xfb)]())return;VisuMZ[_0x18d55e(0x4f7)](_0x28c9b2,_0x28c9b2);const _0x1442d2=$gameTemp[_0x18d55e(0x868)](),_0x2d77d4=BattleManager[_0x18d55e(0x474)];if(!_0x1442d2||!_0x2d77d4)return;if(!_0x2d77d4['item']())return;const _0x43852f=VisuMZ[_0x18d55e(0x56e)](_0x28c9b2[_0x18d55e(0x846)]);for(const _0x1bc868 of _0x43852f){if(!_0x1bc868)continue;_0x1bc868['performActionStart'](_0x2d77d4);}if(_0x28c9b2[_0x18d55e(0x324)])_0x1442d2[_0x18d55e(0x240)](_0x18d55e(0x57e));}),PluginManager['registerCommand'](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x21c),_0x51f7df=>{const _0x38bc69=_0x2bbd55;if(!SceneManager[_0x38bc69(0xfb)]())return;if(!$gameSystem[_0x38bc69(0x2e6)]())return;VisuMZ['ConvertParams'](_0x51f7df,_0x51f7df);const _0x3351c1=VisuMZ[_0x38bc69(0x56e)](_0x51f7df[_0x38bc69(0x846)]);let _0x3e25b3=_0x51f7df[_0x38bc69(0x709)][_0x38bc69(0x87d)](/back/i);for(const _0x442d3a of _0x3351c1){if(!_0x442d3a)continue;if(_0x51f7df[_0x38bc69(0x709)][_0x38bc69(0x87d)](/rand/i))_0x3e25b3=Math[_0x38bc69(0x6cb)](0x2);_0x442d3a[_0x38bc69(0x715)](!!_0x3e25b3);}}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],'ActSeq_Movement_FacePoint',_0x106f87=>{const _0x55ebda=_0x2bbd55;if(!SceneManager[_0x55ebda(0xfb)]())return;if(!$gameSystem[_0x55ebda(0x2e6)]())return;VisuMZ[_0x55ebda(0x4f7)](_0x106f87,_0x106f87);const _0x1dc565=VisuMZ[_0x55ebda(0x56e)](_0x106f87['Targets']);let _0x317b02=_0x106f87[_0x55ebda(0x689)];const _0x4a6e3e=_0x106f87['FaceAway'];for(const _0x1a7d66 of _0x1dc565){if(!_0x1a7d66)continue;let _0x237246=_0x1a7d66[_0x55ebda(0x6ae)]()[_0x55ebda(0x34b)],_0x1cd0eb=_0x1a7d66[_0x55ebda(0x6ae)]()['_baseY'];if(_0x317b02['match'](/home/i))_0x237246=_0x1a7d66[_0x55ebda(0x6ae)]()[_0x55ebda(0x10d)],_0x1cd0eb=_0x1a7d66['battler']()['_homeY'];else{if(_0x317b02[_0x55ebda(0x87d)](/center/i))_0x237246=Graphics[_0x55ebda(0x269)]/0x2,_0x1cd0eb=Graphics[_0x55ebda(0x50e)]/0x2;else _0x317b02[_0x55ebda(0x87d)](/point (\d+), (\d+)/i)&&(_0x237246=Number(RegExp['$1']),_0x1cd0eb=Number(RegExp['$2']));}_0x1a7d66[_0x55ebda(0x575)](Math[_0x55ebda(0x86f)](_0x237246),Math[_0x55ebda(0x86f)](_0x1cd0eb),!!_0x4a6e3e);}}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x5ba),_0xfc3266=>{const _0x14bbaa=_0x2bbd55;if(!SceneManager[_0x14bbaa(0xfb)]())return;if(!$gameSystem['isSideView']())return;VisuMZ[_0x14bbaa(0x4f7)](_0xfc3266,_0xfc3266);const _0x5996f0=VisuMZ[_0x14bbaa(0x56e)](_0xfc3266[_0x14bbaa(0x6f4)]),_0x779d47=VisuMZ['CreateActionSequenceTargets'](_0xfc3266[_0x14bbaa(0x161)]),_0x44cc06=_0x779d47[_0x14bbaa(0x28f)](_0x2535d8=>_0x2535d8&&_0x2535d8[_0x14bbaa(0x6ae)]()?_0x2535d8['battler']()[_0x14bbaa(0x34b)]:0x0)/(_0x779d47[_0x14bbaa(0x5cf)]||0x1),_0x5da537=_0x779d47[_0x14bbaa(0x28f)](_0x38fbe7=>_0x38fbe7&&_0x38fbe7[_0x14bbaa(0x6ae)]()?_0x38fbe7[_0x14bbaa(0x6ae)]()[_0x14bbaa(0x71a)]:0x0)/(_0x779d47[_0x14bbaa(0x5cf)]||0x1),_0x9d2a72=_0xfc3266[_0x14bbaa(0x5f5)];for(const _0x5e8686 of _0x5996f0){if(!_0x5e8686)continue;_0x5e8686[_0x14bbaa(0x575)](Math[_0x14bbaa(0x86f)](_0x44cc06),Math[_0x14bbaa(0x86f)](_0x5da537),!!_0x9d2a72);}}),PluginManager[_0x2bbd55(0x70a)](pluginData['name'],'ActSeq_Movement_Float',_0x8f9f84=>{const _0x13bb2d=_0x2bbd55;if(!SceneManager[_0x13bb2d(0xfb)]())return;VisuMZ[_0x13bb2d(0x4f7)](_0x8f9f84,_0x8f9f84);const _0xafff5d=$gameTemp[_0x13bb2d(0x868)](),_0x1e8d78=VisuMZ[_0x13bb2d(0x56e)](_0x8f9f84[_0x13bb2d(0x846)]),_0x379fc8=_0x8f9f84[_0x13bb2d(0x7e4)],_0x231442=_0x8f9f84['Duration'],_0x1da0d8=_0x8f9f84[_0x13bb2d(0x7d7)],_0x1b0d7e=_0x8f9f84[_0x13bb2d(0x113)];if(!_0xafff5d)return;for(const _0x3faf33 of _0x1e8d78){if(!_0x3faf33)continue;_0x3faf33[_0x13bb2d(0x7bf)](_0x379fc8,_0x231442,_0x1da0d8);}if(_0x1b0d7e)_0xafff5d[_0x13bb2d(0x240)](_0x13bb2d(0x4db));}),PluginManager[_0x2bbd55(0x70a)](pluginData['name'],_0x2bbd55(0x765),_0x59e71e=>{const _0x510ea2=_0x2bbd55;if(!SceneManager['isSceneBattle']())return;VisuMZ[_0x510ea2(0x4f7)](_0x59e71e,_0x59e71e);const _0x16e17e=$gameTemp[_0x510ea2(0x868)]();if(!_0x16e17e)return;const _0xdcdad=VisuMZ['CreateActionSequenceTargets'](_0x59e71e[_0x510ea2(0x846)]);for(const _0x5cea04 of _0xdcdad){if(!_0x5cea04)continue;_0x5cea04[_0x510ea2(0x4e9)](),_0x5cea04[_0x510ea2(0x82d)]();}if(_0x59e71e['WaitForMovement'])_0x16e17e[_0x510ea2(0x240)](_0x510ea2(0x57e));}),PluginManager['registerCommand'](pluginData['name'],_0x2bbd55(0x255),_0x36a45d=>{const _0x51ad54=_0x2bbd55;if(!SceneManager[_0x51ad54(0xfb)]())return;VisuMZ[_0x51ad54(0x4f7)](_0x36a45d,_0x36a45d);const _0x1335a8=$gameTemp[_0x51ad54(0x868)](),_0x5a6106=VisuMZ['CreateActionSequenceTargets'](_0x36a45d[_0x51ad54(0x846)]),_0x424b0f=_0x36a45d['Height'],_0x53c48c=_0x36a45d[_0x51ad54(0x1b7)],_0x2d1c1f=_0x36a45d[_0x51ad54(0x147)];if(!_0x1335a8)return;for(const _0x197585 of _0x5a6106){if(!_0x197585)continue;_0x197585[_0x51ad54(0x216)](_0x424b0f,_0x53c48c);}if(_0x2d1c1f)_0x1335a8['setWaitMode'](_0x51ad54(0x7df));}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],'ActSeq_Movement_MoveBy',_0xebb07b=>{const _0x59be1d=_0x2bbd55;if(!SceneManager['isSceneBattle']())return;if(!$gameSystem['isSideView']())return;VisuMZ['ConvertParams'](_0xebb07b,_0xebb07b);const _0x1cb3f1=$gameTemp[_0x59be1d(0x868)](),_0x25a68b=VisuMZ['CreateActionSequenceTargets'](_0xebb07b[_0x59be1d(0x846)]),_0x1f034b=_0xebb07b[_0x59be1d(0x714)],_0x25201d=_0xebb07b[_0x59be1d(0x4d1)],_0x502b87=_0xebb07b[_0x59be1d(0x612)],_0x41f2c2=_0xebb07b['Duration'],_0x1ef7ae=_0xebb07b['FaceDirection'],_0x13962e=_0xebb07b[_0x59be1d(0x7d7)],_0x1b9bfa=_0xebb07b['MotionType'],_0x46d6cd=_0xebb07b[_0x59be1d(0x324)];if(!_0x1cb3f1)return;for(const _0xd55a37 of _0x25a68b){if(!_0xd55a37)continue;let _0x4c33e6=_0x25201d,_0x56ac05=_0x502b87;if(_0x1f034b[_0x59be1d(0x87d)](/horz/i))_0x4c33e6*=_0xd55a37[_0x59be1d(0x101)]()?-0x1:0x1;if(_0x1f034b[_0x59be1d(0x87d)](/vert/i))_0x56ac05*=_0xd55a37['isActor']()?-0x1:0x1;_0xd55a37[_0x59be1d(0x1e5)](_0x4c33e6,_0x56ac05,_0x41f2c2,_0x1ef7ae,_0x13962e),_0xd55a37[_0x59be1d(0x4ac)](_0x1b9bfa);}if(_0x46d6cd)_0x1cb3f1['setWaitMode'](_0x59be1d(0x57e));}),PluginManager['registerCommand'](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x138),_0x2cbcee=>{const _0x117c11=_0x2bbd55;if(!SceneManager[_0x117c11(0xfb)]())return;if(!$gameSystem[_0x117c11(0x2e6)]())return;VisuMZ[_0x117c11(0x4f7)](_0x2cbcee,_0x2cbcee);const _0x441342=$gameTemp[_0x117c11(0x868)](),_0x5bc070=VisuMZ[_0x117c11(0x56e)](_0x2cbcee[_0x117c11(0x846)]),_0x1f32c9=_0x2cbcee[_0x117c11(0x41c)],_0x5a0d2c=_0x2cbcee[_0x117c11(0x6f2)],_0x47ab26=_0x2cbcee[_0x117c11(0x6ed)],_0x3e78aa=_0x2cbcee[_0x117c11(0x2cf)],_0x24413b=_0x2cbcee[_0x117c11(0x1b7)],_0x21ec02=_0x2cbcee[_0x117c11(0x48e)],_0x166f07=_0x2cbcee[_0x117c11(0x7d7)],_0x1f7396=_0x2cbcee['MotionType'],_0x1b055a=_0x2cbcee[_0x117c11(0x324)];if(!_0x441342)return;for(const _0x595f00 of _0x5bc070){if(!_0x595f00)continue;let _0x3dfa95=_0x595f00[_0x117c11(0x6ae)]()[_0x117c11(0x34b)],_0x4235cd=_0x595f00[_0x117c11(0x6ae)]()[_0x117c11(0x71a)];if(_0x1f32c9[_0x117c11(0x87d)](/home/i))_0x3dfa95=_0x595f00[_0x117c11(0x6ae)]()['_homeX'],_0x4235cd=_0x595f00[_0x117c11(0x6ae)]()[_0x117c11(0x59e)];else{if(_0x1f32c9[_0x117c11(0x87d)](/center/i))_0x3dfa95=Graphics[_0x117c11(0x269)]/0x2,_0x4235cd=Graphics[_0x117c11(0x50e)]/0x2;else _0x1f32c9[_0x117c11(0x87d)](/point (\d+), (\d+)/i)&&(_0x3dfa95=Number(RegExp['$1']),_0x4235cd=Number(RegExp['$2']));}if(_0x5a0d2c['match'](/none/i))_0x3dfa95+=_0x47ab26,_0x4235cd+=_0x3e78aa;else{if(_0x5a0d2c[_0x117c11(0x87d)](/horz/i)&&_0x5a0d2c['match'](/vert/i))_0x3dfa95+=_0x595f00[_0x117c11(0x101)]()?-_0x47ab26:_0x47ab26,_0x4235cd+=_0x595f00['isActor']()?-_0x3e78aa:_0x3e78aa;else{if(_0x5a0d2c[_0x117c11(0x87d)](/horz/i))_0x3dfa95+=_0x595f00[_0x117c11(0x101)]()?-_0x47ab26:_0x47ab26,_0x4235cd+=_0x3e78aa;else _0x5a0d2c['match'](/vert/i)&&(_0x3dfa95+=_0x47ab26,_0x4235cd+=_0x595f00[_0x117c11(0x101)]()?-_0x3e78aa:_0x3e78aa);}}_0x595f00[_0x117c11(0x620)](_0x3dfa95,_0x4235cd,_0x24413b,_0x21ec02,_0x166f07,-0x1),_0x595f00[_0x117c11(0x4ac)](_0x1f7396);}if(_0x1b055a)_0x441342[_0x117c11(0x240)](_0x117c11(0x57e));}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x1d9),_0x2f5c13=>{const _0x3751fc=_0x2bbd55;if(!SceneManager[_0x3751fc(0xfb)]())return;if(!$gameSystem[_0x3751fc(0x2e6)]())return;VisuMZ[_0x3751fc(0x4f7)](_0x2f5c13,_0x2f5c13);const _0x35e9e2=$gameTemp[_0x3751fc(0x868)](),_0x5e2aa8=VisuMZ['CreateActionSequenceTargets'](_0x2f5c13['Targets1']),_0x1361ca=VisuMZ['CreateActionSequenceTargets'](_0x2f5c13[_0x3751fc(0x161)]),_0x451c25=_0x2f5c13[_0x3751fc(0x2be)];let _0xb0ab8e=_0x2f5c13['MeleeDistance'];const _0x1b0519=_0x2f5c13[_0x3751fc(0x6f2)],_0x3b5440=_0x2f5c13[_0x3751fc(0x6ed)],_0x33c5d7=_0x2f5c13[_0x3751fc(0x2cf)],_0x29f37d=_0x2f5c13['Duration'],_0x296ab6=_0x2f5c13[_0x3751fc(0x48e)],_0x39f5cf=_0x2f5c13[_0x3751fc(0x7d7)],_0x595adb=_0x2f5c13[_0x3751fc(0x79d)],_0x2609db=_0x2f5c13['WaitForMovement'],_0x5026ec=Math[_0x3751fc(0x4fa)](..._0x1361ca[_0x3751fc(0x28f)](_0x324ea2=>_0x324ea2[_0x3751fc(0x6ae)]()[_0x3751fc(0x34b)]-_0x324ea2[_0x3751fc(0x6ae)]()[_0x3751fc(0x685)]()/0x2)),_0x3398f8=Math[_0x3751fc(0x6b9)](..._0x1361ca['map'](_0x2dd7a1=>_0x2dd7a1['battler']()[_0x3751fc(0x34b)]+_0x2dd7a1[_0x3751fc(0x6ae)]()[_0x3751fc(0x685)]()/0x2)),_0x57cf58=Math[_0x3751fc(0x4fa)](..._0x1361ca['map'](_0x3d6fd0=>_0x3d6fd0['battler']()[_0x3751fc(0x71a)]-_0x3d6fd0[_0x3751fc(0x6ae)]()[_0x3751fc(0x4ca)]())),_0x18cba5=Math[_0x3751fc(0x6b9)](..._0x1361ca['map'](_0x28b7b8=>_0x28b7b8[_0x3751fc(0x6ae)]()[_0x3751fc(0x71a)])),_0x560af3=_0x1361ca[_0x3751fc(0x11f)](_0x2a4b92=>_0x2a4b92[_0x3751fc(0x101)]())[_0x3751fc(0x5cf)],_0x2db60c=_0x1361ca[_0x3751fc(0x11f)](_0x3d39d3=>_0x3d39d3['isEnemy']())[_0x3751fc(0x5cf)];let _0x245314=0x0,_0x191a66=0x0;if(_0x451c25[_0x3751fc(0x87d)](/front/i))_0x245314=_0x560af3>=_0x2db60c?_0x5026ec:_0x3398f8;else{if(_0x451c25[_0x3751fc(0x87d)](/middle/i))_0x245314=(_0x5026ec+_0x3398f8)/0x2,_0xb0ab8e=-0x1;else _0x451c25['match'](/back/i)&&(_0x245314=_0x560af3>=_0x2db60c?_0x3398f8:_0x5026ec);}if(_0x451c25['match'](/head/i))_0x191a66=_0x57cf58;else{if(_0x451c25[_0x3751fc(0x87d)](/center/i))_0x191a66=(_0x57cf58+_0x18cba5)/0x2;else _0x451c25['match'](/base/i)&&(_0x191a66=_0x18cba5);}if(!_0x35e9e2)return;for(const _0x298251 of _0x5e2aa8){if(!_0x298251)continue;let _0x2404dd=_0x245314,_0x420478=_0x191a66;if(_0x1b0519[_0x3751fc(0x87d)](/none/i))_0x2404dd+=_0x3b5440,_0x420478+=_0x33c5d7;else{if(_0x1b0519[_0x3751fc(0x87d)](/horz/i)&&_0x1b0519[_0x3751fc(0x87d)](/vert/i))_0x2404dd+=_0x298251[_0x3751fc(0x101)]()?-_0x3b5440:_0x3b5440,_0x420478+=_0x298251[_0x3751fc(0x101)]()?-_0x33c5d7:_0x33c5d7;else{if(_0x1b0519['match'](/horz/i))_0x2404dd+=_0x298251[_0x3751fc(0x101)]()?-_0x3b5440:_0x3b5440,_0x420478+=_0x33c5d7;else _0x1b0519[_0x3751fc(0x87d)](/vert/i)&&(_0x2404dd+=_0x3b5440,_0x420478+=_0x298251[_0x3751fc(0x101)]()?-_0x33c5d7:_0x33c5d7);}}_0x298251[_0x3751fc(0x620)](_0x2404dd,_0x420478,_0x29f37d,_0x296ab6,_0x39f5cf,_0xb0ab8e),_0x298251[_0x3751fc(0x4ac)](_0x595adb);}if(_0x2609db)_0x35e9e2[_0x3751fc(0x240)](_0x3751fc(0x57e));}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],'ActSeq_Movement_Opacity',_0x259607=>{const _0x578951=_0x2bbd55;if(!SceneManager[_0x578951(0xfb)]())return;VisuMZ[_0x578951(0x4f7)](_0x259607,_0x259607);const _0x115c58=$gameTemp[_0x578951(0x868)](),_0xaa782c=VisuMZ['CreateActionSequenceTargets'](_0x259607['Targets']),_0x4e6e23=_0x259607[_0x578951(0x3a4)],_0x1c0da5=_0x259607['Duration'],_0x348732=_0x259607['EasingType'],_0x48ac6b=_0x259607[_0x578951(0x3a2)];if(!_0x115c58)return;for(const _0x489ad5 of _0xaa782c){if(!_0x489ad5)continue;_0x489ad5[_0x578951(0x51e)](_0x4e6e23,_0x1c0da5,_0x348732);}if(_0x48ac6b)_0x115c58[_0x578951(0x240)]('battleOpacity');}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x580),_0x3f82d3=>{const _0x1521b5=_0x2bbd55;if(!SceneManager[_0x1521b5(0xfb)]())return;VisuMZ[_0x1521b5(0x4f7)](_0x3f82d3,_0x3f82d3);const _0x4ac7f1=$gameTemp[_0x1521b5(0x868)](),_0x1a860d=VisuMZ['CreateActionSequenceTargets'](_0x3f82d3[_0x1521b5(0x846)]),_0x1c1ab3=_0x3f82d3['ScaleX'],_0x3a8452=_0x3f82d3['ScaleY'],_0x4202a7=_0x3f82d3['Duration'],_0xe64786=_0x3f82d3[_0x1521b5(0x7d7)],_0x20bef0=_0x3f82d3[_0x1521b5(0x549)];if(!_0x4ac7f1)return;for(const _0x57113c of _0x1a860d){if(!_0x57113c)continue;_0x57113c[_0x1521b5(0x717)](_0x1c1ab3,_0x3a8452,_0x4202a7,_0xe64786);}if(_0x20bef0)_0x4ac7f1['setWaitMode'](_0x1521b5(0x602));}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x62e),_0x892543=>{const _0x382c36=_0x2bbd55;if(!SceneManager[_0x382c36(0xfb)]())return;VisuMZ[_0x382c36(0x4f7)](_0x892543,_0x892543);const _0x186f24=$gameTemp[_0x382c36(0x868)](),_0x98dc98=VisuMZ[_0x382c36(0x56e)](_0x892543[_0x382c36(0x846)]),_0x2f8a7a=_0x892543[_0x382c36(0x2f7)],_0xf6cf82=_0x892543[_0x382c36(0x150)],_0x43902e=_0x892543[_0x382c36(0x1b7)],_0x27a697=_0x892543[_0x382c36(0x7d7)],_0x544acf=_0x892543[_0x382c36(0x67f)];if(!_0x186f24)return;for(const _0x19a576 of _0x98dc98){if(!_0x19a576)continue;_0x19a576[_0x382c36(0x3eb)](_0x2f8a7a,_0xf6cf82,_0x43902e,_0x27a697);}if(_0x544acf)_0x186f24['setWaitMode']('battleSpriteSkew');}),PluginManager['registerCommand'](pluginData['name'],_0x2bbd55(0x6e8),_0x1bacac=>{const _0x1e3d3c=_0x2bbd55;if(!SceneManager[_0x1e3d3c(0xfb)]())return;VisuMZ['ConvertParams'](_0x1bacac,_0x1bacac);const _0x435b83=$gameTemp[_0x1e3d3c(0x868)](),_0x49a3b4=VisuMZ[_0x1e3d3c(0x56e)](_0x1bacac[_0x1e3d3c(0x846)]),_0x19e6dd=_0x1bacac[_0x1e3d3c(0x24b)],_0xfb903d=_0x1bacac[_0x1e3d3c(0x1b7)],_0x546a3f=_0x1bacac[_0x1e3d3c(0x7d7)],_0x39c73d=_0x1bacac['RevertAngle'],_0x29e6cd=_0x1bacac[_0x1e3d3c(0x28e)];if(!_0x435b83)return;for(const _0x192e47 of _0x49a3b4){if(!_0x192e47)continue;_0x192e47[_0x1e3d3c(0x6dc)](_0x19e6dd,_0xfb903d,_0x546a3f,_0x39c73d);}if(_0x29e6cd)_0x435b83[_0x1e3d3c(0x240)](_0x1e3d3c(0x16f));}),PluginManager[_0x2bbd55(0x70a)](pluginData['name'],_0x2bbd55(0x787),_0x522154=>{const _0x131405=_0x2bbd55;if(!SceneManager[_0x131405(0xfb)]())return;const _0x2e45ad=$gameTemp[_0x131405(0x868)]();if(!_0x2e45ad)return;_0x2e45ad[_0x131405(0x240)]('battleFloat');}),PluginManager['registerCommand'](pluginData['name'],'ActSeq_Movement_WaitForJump',_0x17f65a=>{const _0x119788=_0x2bbd55;if(!SceneManager['isSceneBattle']())return;const _0x515e43=$gameTemp[_0x119788(0x868)]();if(!_0x515e43)return;_0x515e43[_0x119788(0x240)](_0x119788(0x7df));}),PluginManager[_0x2bbd55(0x70a)](pluginData['name'],_0x2bbd55(0x44e),_0x24ac59=>{const _0x1c0a99=_0x2bbd55;if(!SceneManager[_0x1c0a99(0xfb)]())return;const _0x165672=$gameTemp['getLastPluginCommandInterpreter']();if(!_0x165672)return;_0x165672[_0x1c0a99(0x240)](_0x1c0a99(0x57e));}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],'ActSeq_Movement_WaitForOpacity',_0x315ac4=>{const _0x3aa3d1=_0x2bbd55;if(!SceneManager[_0x3aa3d1(0xfb)]())return;const _0xef1d2d=$gameTemp[_0x3aa3d1(0x868)]();if(!_0xef1d2d)return;_0xef1d2d[_0x3aa3d1(0x240)]('battleOpacity');}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x346),_0x2a8c0=>{const _0x1eba8a=_0x2bbd55;if(!SceneManager[_0x1eba8a(0xfb)]())return;const _0x572539=$gameTemp[_0x1eba8a(0x868)]();if(!_0x572539)return;_0x572539['setWaitMode']('battleGrow');}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x6a4),_0x57026f=>{const _0x152e63=_0x2bbd55;if(!SceneManager['isSceneBattle']())return;const _0x6608de=$gameTemp[_0x152e63(0x868)]();if(!_0x6608de)return;_0x6608de[_0x152e63(0x240)](_0x152e63(0x1ce));}),PluginManager['registerCommand'](pluginData[_0x2bbd55(0x485)],'ActSeq_Movement_WaitForSpin',_0x136fd7=>{const _0xcc8522=_0x2bbd55;if(!SceneManager[_0xcc8522(0xfb)]())return;const _0x39def2=$gameTemp[_0xcc8522(0x868)]();if(!_0x39def2)return;_0x39def2[_0xcc8522(0x240)](_0xcc8522(0x16f));}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],'ActSeq_Projectile_Animation',_0x50ae88=>{const _0x62b1fa=_0x2bbd55;if(!SceneManager[_0x62b1fa(0xfb)]())return;if(!Imported[_0x62b1fa(0x625)])return;VisuMZ[_0x62b1fa(0x4f7)](_0x50ae88,_0x50ae88);const _0x3c9413=$gameTemp[_0x62b1fa(0x868)](),_0x2f0990=_0x50ae88['WaitForProjectile'];if(!_0x3c9413)return;const _0xd43b89=BattleManager[_0x62b1fa(0x54a)];if(!_0xd43b89)return;_0xd43b89[_0x62b1fa(0x356)](_0x50ae88);if(_0x2f0990)_0x3c9413[_0x62b1fa(0x240)](_0x62b1fa(0x109));}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x626),_0x3a114c=>{const _0xf00a0e=_0x2bbd55;if(!SceneManager['isSceneBattle']())return;if(!Imported[_0xf00a0e(0x625)])return;VisuMZ[_0xf00a0e(0x4f7)](_0x3a114c,_0x3a114c);const _0x23fc3b=$gameTemp['getLastPluginCommandInterpreter'](),_0x2211bc=_0x3a114c[_0xf00a0e(0x348)];if(!_0x23fc3b)return;const _0x33d0a1=BattleManager[_0xf00a0e(0x54a)];if(!_0x33d0a1)return;_0x33d0a1[_0xf00a0e(0x356)](_0x3a114c);if(_0x2211bc)_0x23fc3b['setWaitMode'](_0xf00a0e(0x109));}),PluginManager['registerCommand'](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x7bd),_0x4218ed=>{const _0x376631=_0x2bbd55;if(!SceneManager[_0x376631(0xfb)]())return;if(!Imported[_0x376631(0x625)])return;VisuMZ[_0x376631(0x4f7)](_0x4218ed,_0x4218ed);const _0x309a8b=$gameTemp[_0x376631(0x868)](),_0x17901b=_0x4218ed['WaitForProjectile'];if(!_0x309a8b)return;const _0x1de2a9=BattleManager[_0x376631(0x54a)];if(!_0x1de2a9)return;_0x1de2a9[_0x376631(0x356)](_0x4218ed);if(_0x17901b)_0x309a8b['setWaitMode'](_0x376631(0x109));}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],'ActSeq_ChangeSkew',_0x2f0900=>{const _0x50e389=_0x2bbd55;if(!SceneManager[_0x50e389(0xfb)]())return;if(!Imported['VisuMZ_3_ActSeqCamera'])return;VisuMZ[_0x50e389(0x4f7)](_0x2f0900,_0x2f0900);const _0x3d01ea=$gameTemp[_0x50e389(0x868)](),_0x101684=_0x2f0900[_0x50e389(0x67f)];if(!_0x3d01ea)return;$gameScreen[_0x50e389(0x371)](_0x2f0900[_0x50e389(0x2f7)],_0x2f0900['SkewY'],_0x2f0900['Duration'],_0x2f0900[_0x50e389(0x7d7)]);if(_0x101684)_0x3d01ea[_0x50e389(0x240)](_0x50e389(0x291));}),PluginManager[_0x2bbd55(0x70a)](pluginData['name'],'ActSeq_Skew_Reset',_0x340995=>{const _0x331553=_0x2bbd55;if(!SceneManager[_0x331553(0xfb)]())return;if(!Imported[_0x331553(0x492)])return;VisuMZ[_0x331553(0x4f7)](_0x340995,_0x340995);const _0x30f369=$gameTemp[_0x331553(0x868)](),_0x4f7779=_0x340995[_0x331553(0x67f)];if(!_0x30f369)return;$gameScreen[_0x331553(0x371)](0x0,0x0,_0x340995[_0x331553(0x1b7)],_0x340995[_0x331553(0x7d7)]);if(_0x4f7779)_0x30f369[_0x331553(0x240)](_0x331553(0x291));}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x2ab),_0x3f6735=>{const _0x4f1b2f=_0x2bbd55;if(!SceneManager[_0x4f1b2f(0xfb)]())return;if(!Imported[_0x4f1b2f(0x492)])return;const _0xac74f8=$gameTemp['getLastPluginCommandInterpreter']();if(!_0xac74f8)return;_0xac74f8[_0x4f1b2f(0x240)]('battleSkew');}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x312),_0x119795=>{const _0x5b8192=_0x2bbd55;if(!SceneManager[_0x5b8192(0xfb)]())return;VisuMZ[_0x5b8192(0x4f7)](_0x119795,_0x119795);const _0x1e048e=$gameTemp[_0x5b8192(0x868)](),_0x34a145=_0x119795['Index'],_0x225632=_0x119795[_0x5b8192(0x45a)];if(!_0x1e048e)return;BattleManager[_0x5b8192(0x638)]=_0x34a145,BattleManager[_0x5b8192(0x520)]=BattleManager[_0x5b8192(0x3d8)]?BattleManager[_0x5b8192(0x3d8)][BattleManager[_0x5b8192(0x638)]]||null:null,BattleManager['_target']&&_0x225632[_0x5b8192(0x6d4)]()['trim']()!=='UNTITLED'&&_0x1e048e[_0x5b8192(0x1de)]([_0x225632]);}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],'ActSeq_Target_NextTarget',_0x2b7621=>{const _0xb11d78=_0x2bbd55;if(!SceneManager[_0xb11d78(0xfb)]())return;VisuMZ[_0xb11d78(0x4f7)](_0x2b7621,_0x2b7621);const _0x808411=$gameTemp['getLastPluginCommandInterpreter'](),_0x5337f9=_0x2b7621[_0xb11d78(0x45a)];if(!_0x808411)return;BattleManager['_targetIndex']++,BattleManager[_0xb11d78(0x520)]=BattleManager[_0xb11d78(0x3d8)][BattleManager[_0xb11d78(0x638)]]||null,BattleManager[_0xb11d78(0x520)]&&_0x5337f9['toUpperCase']()[_0xb11d78(0x692)]()!==_0xb11d78(0x594)&&_0x808411[_0xb11d78(0x1de)]([_0x5337f9]);}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],'ActSeq_Target_PrevTarget',_0x6d970e=>{const _0x16c3d9=_0x2bbd55;if(!SceneManager[_0x16c3d9(0xfb)]())return;VisuMZ[_0x16c3d9(0x4f7)](_0x6d970e,_0x6d970e);const _0xff0b15=$gameTemp[_0x16c3d9(0x868)](),_0x3ac48f=_0x6d970e[_0x16c3d9(0x45a)];if(!_0xff0b15)return;BattleManager[_0x16c3d9(0x638)]--,BattleManager[_0x16c3d9(0x520)]=BattleManager[_0x16c3d9(0x3d8)][BattleManager[_0x16c3d9(0x638)]]||null,BattleManager[_0x16c3d9(0x520)]&&_0x3ac48f[_0x16c3d9(0x6d4)]()['trim']()!=='UNTITLED'&&_0xff0b15[_0x16c3d9(0x1de)]([_0x3ac48f]);}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],'ActSeq_Target_RandTarget',_0x2db299=>{const _0x51dd66=_0x2bbd55;if(!SceneManager[_0x51dd66(0xfb)]())return;VisuMZ[_0x51dd66(0x4f7)](_0x2db299,_0x2db299);const _0x3f11fe=$gameTemp['getLastPluginCommandInterpreter'](),_0x25b588=_0x2db299[_0x51dd66(0x352)],_0x40626b=_0x2db299[_0x51dd66(0x45a)];if(!_0x3f11fe)return;const _0x3f40ef=BattleManager['_targetIndex'];for(;;){BattleManager[_0x51dd66(0x638)]=Math[_0x51dd66(0x6cb)](BattleManager[_0x51dd66(0x3d8)][_0x51dd66(0x5cf)]);if(!_0x25b588)break;if(BattleManager[_0x51dd66(0x638)]!==_0x3f40ef)break;if(BattleManager[_0x51dd66(0x3d8)][_0x51dd66(0x5cf)]<=0x1){BattleManager[_0x51dd66(0x638)]=0x0;break;}}BattleManager[_0x51dd66(0x520)]=BattleManager[_0x51dd66(0x3d8)][BattleManager[_0x51dd66(0x638)]]||null,BattleManager['_target']&&_0x40626b[_0x51dd66(0x6d4)]()[_0x51dd66(0x692)]()!==_0x51dd66(0x594)&&_0x3f11fe['command119']([_0x40626b]);}),PluginManager['registerCommand'](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x24f),_0x3c5d88=>{const _0x4b9089=_0x2bbd55;if(!SceneManager[_0x4b9089(0xfb)]())return;VisuMZ['ConvertParams'](_0x3c5d88,_0x3c5d88);const _0xfa9752=VisuMZ['CreateActionSequenceTargets'](_0x3c5d88[_0x4b9089(0x846)]);for(const _0x7c9862 of _0xfa9752){if(!_0x7c9862)continue;if(!_0x7c9862['isActor']())continue;_0x7c9862[_0x4b9089(0x76a)]();}}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],'ActSeq_Weapon_NextActiveWeapon',_0x386dd9=>{const _0x514e92=_0x2bbd55;if(!SceneManager[_0x514e92(0xfb)]())return;VisuMZ[_0x514e92(0x4f7)](_0x386dd9,_0x386dd9);const _0x485316=$gameTemp['getLastPluginCommandInterpreter']();let _0x22c129=![];const _0x48cb44=_0x386dd9[_0x514e92(0x45a)],_0x4c108d=VisuMZ[_0x514e92(0x56e)](_0x386dd9[_0x514e92(0x846)]);for(const _0x56f00e of _0x4c108d){if(!_0x56f00e)continue;if(!_0x56f00e[_0x514e92(0x101)]())continue;_0x56f00e[_0x514e92(0x871)](),_0x56f00e[_0x514e92(0x583)]()[_0x514e92(0x5cf)]>0x0?_0x22c129=!![]:_0x56f00e[_0x514e92(0x76a)]();}_0x22c129&&_0x48cb44[_0x514e92(0x6d4)]()['trim']()!==_0x514e92(0x594)&&_0x485316[_0x514e92(0x1de)]([_0x48cb44]);}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],'ActSeq_Weapon_SetActiveWeapon',_0x1c09d2=>{const _0xd8dbd3=_0x2bbd55;if(!SceneManager['isSceneBattle']())return;VisuMZ[_0xd8dbd3(0x4f7)](_0x1c09d2,_0x1c09d2);let _0x41b46d=_0x1c09d2[_0xd8dbd3(0x2a0)];_0x41b46d--,_0x41b46d=Math[_0xd8dbd3(0x6b9)](_0x41b46d,0x0);const _0x41849c=VisuMZ[_0xd8dbd3(0x56e)](_0x1c09d2['Targets']);for(const _0x5c3823 of _0x41849c){if(!_0x5c3823)continue;if(!_0x5c3823[_0xd8dbd3(0x101)]())continue;_0x5c3823['setActiveWeaponSlot'](_0x41b46d);}}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x18c),_0x33127d=>{const _0xf21837=_0x2bbd55;if(!SceneManager['isSceneBattle']())return;if(!Imported[_0xf21837(0x492)])return;VisuMZ[_0xf21837(0x4f7)](_0x33127d,_0x33127d);const _0x4dc349=$gameTemp[_0xf21837(0x868)](),_0x20d061=_0x33127d[_0xf21837(0x136)];if(!_0x4dc349)return;$gameScreen[_0xf21837(0x7a2)](_0x33127d['Scale'],_0x33127d[_0xf21837(0x1b7)],_0x33127d['EasingType']);if(_0x20d061)_0x4dc349[_0xf21837(0x240)]('battleZoom');}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],_0x2bbd55(0x5c7),_0x6b4eed=>{const _0x49753f=_0x2bbd55;if(!SceneManager[_0x49753f(0xfb)]())return;if(!Imported[_0x49753f(0x492)])return;VisuMZ[_0x49753f(0x4f7)](_0x6b4eed,_0x6b4eed);const _0x1f7213=$gameTemp['getLastPluginCommandInterpreter'](),_0x5f0807=_0x6b4eed[_0x49753f(0x136)];if(!_0x1f7213)return;$gameScreen[_0x49753f(0x7a2)](0x1,_0x6b4eed[_0x49753f(0x1b7)],_0x6b4eed[_0x49753f(0x7d7)]);if(_0x5f0807)_0x1f7213[_0x49753f(0x240)](_0x49753f(0x155));}),PluginManager[_0x2bbd55(0x70a)](pluginData[_0x2bbd55(0x485)],'ActSeq_Zoom_WaitForZoom',_0x233186=>{const _0x32ccd6=_0x2bbd55;if(!SceneManager[_0x32ccd6(0xfb)]())return;if(!Imported[_0x32ccd6(0x492)])return;const _0x1d5a02=$gameTemp[_0x32ccd6(0x868)]();if(!_0x1d5a02)return;_0x1d5a02[_0x32ccd6(0x240)]('battleZoom');}),VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x87e)]=Scene_Boot[_0x2bbd55(0x5d7)][_0x2bbd55(0x15c)],Scene_Boot[_0x2bbd55(0x5d7)][_0x2bbd55(0x15c)]=function(){const _0x433837=_0x2bbd55;this[_0x433837(0x63b)](),this['process_VisuMZ_BattleCore_PluginParams'](),this[_0x433837(0x42d)](),this[_0x433837(0x81a)](),VisuMZ[_0x433837(0x46a)]['Scene_Boot_onDatabaseLoaded'][_0x433837(0x4f4)](this),this[_0x433837(0x73f)](),this[_0x433837(0x701)]();},Scene_Boot[_0x2bbd55(0x5d7)][_0x2bbd55(0x73f)]=function(){const _0x5d5868=_0x2bbd55;if(VisuMZ[_0x5d5868(0x796)])return;this[_0x5d5868(0x661)](),this['process_VisuMZ_BattleCore_TraitObject_Notetags'](),this['process_VisuMZ_BattleCore_jsFunctions']();},Scene_Boot[_0x2bbd55(0x5d7)][_0x2bbd55(0x63b)]=function(){const _0x921cc4=_0x2bbd55,_0x1993c5=$dataSystem[_0x921cc4(0x44b)][_0x921cc4(0x5cf)];for(let _0x15cce4=0x0;_0x15cce4<_0x1993c5;_0x15cce4++){const _0x4730fd=$dataSystem[_0x921cc4(0x4ee)][_0x15cce4];if(_0x4730fd)continue;$dataSystem['attackMotions'][_0x15cce4]=JsonEx[_0x921cc4(0x878)]($dataSystem[_0x921cc4(0x4ee)][0x0]);}},Scene_Boot['prototype']['process_VisuMZ_BattleCore_PluginParams']=function(){const _0x324e96=_0x2bbd55,_0x3d884e=VisuMZ[_0x324e96(0x46a)][_0x324e96(0x55b)];_0x3d884e[_0x324e96(0x14a)][_0x324e96(0x2bb)]===undefined&&(_0x3d884e[_0x324e96(0x14a)]['PopupPosition']=_0x324e96(0x290)),_0x3d884e[_0x324e96(0x843)][_0x324e96(0x4c7)]===undefined&&(_0x3d884e['Actor'][_0x324e96(0x4c7)]=![]),_0x3d884e['Enemy']['SmoothImage']===undefined&&(_0x3d884e['Enemy']['SmoothImage']=!![]),_0x3d884e['Actor'][_0x324e96(0x344)]===undefined&&(_0x3d884e['Actor']['PrioritySortActive']=![]),_0x3d884e[_0x324e96(0x843)][_0x324e96(0x39c)]===undefined&&(_0x3d884e[_0x324e96(0x843)][_0x324e96(0x39c)]=!![]);},VisuMZ[_0x2bbd55(0x724)]={},Scene_Boot[_0x2bbd55(0x5d7)][_0x2bbd55(0x42d)]=function(){const _0x67f7f0=_0x2bbd55;for(const _0x22468d of VisuMZ[_0x67f7f0(0x46a)][_0x67f7f0(0x55b)]['Damage'][_0x67f7f0(0x342)]){if(!_0x22468d)continue;const _0x534c80=_0x22468d['Name']['toUpperCase']()[_0x67f7f0(0x692)]();VisuMZ[_0x67f7f0(0x724)][_0x534c80]=_0x22468d;}},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x4de)]={},Scene_Boot[_0x2bbd55(0x5d7)][_0x2bbd55(0x81a)]=function(){const _0x37cf4c=_0x2bbd55,_0x3b3d66=VisuMZ[_0x37cf4c(0x46a)][_0x37cf4c(0x4de)],_0x45e3d0=_0x37cf4c(0x443),_0x9b2baa=[['Pre',_0x37cf4c(0x82c)],[_0x37cf4c(0x7b9),'POST-']],_0x4ad92b=[[_0x37cf4c(0x179),_0x37cf4c(0x18e)],[_0x37cf4c(0x151),_0x37cf4c(0x7fa)]],_0x55e8d3=[['',''],[_0x37cf4c(0x2bc),_0x37cf4c(0x497)],['AsTarget',_0x37cf4c(0x7d4)]];for(const _0x4fd173 of _0x4ad92b){for(const _0x1cbee1 of _0x55e8d3){for(const _0x2504be of _0x9b2baa){const _0x12b1c3=_0x4fd173[0x0][_0x37cf4c(0x36b)](_0x2504be[0x0],_0x1cbee1[0x0]),_0x5cce33=_0x4fd173[0x1][_0x37cf4c(0x36b)](_0x2504be[0x1],_0x1cbee1[0x1])[_0x37cf4c(0x692)](),_0x4cdba6=new RegExp(_0x45e3d0[_0x37cf4c(0x36b)](_0x5cce33),'i');_0x3b3d66[_0x12b1c3]=_0x4cdba6;}}}const _0x2174a0=[[_0x37cf4c(0x7b6),_0x37cf4c(0x14f)],[_0x37cf4c(0x1d8),'JS\x20%1END\x20ACTION']];for(const _0xb06ac0 of _0x2174a0){for(const _0x1f2b16 of _0x9b2baa){const _0x138fa0=_0xb06ac0[0x0]['format'](_0x1f2b16[0x0]),_0x3af4db=_0xb06ac0[0x1][_0x37cf4c(0x36b)](_0x1f2b16[0x1]),_0x1434a9=new RegExp(_0x45e3d0[_0x37cf4c(0x36b)](_0x3af4db),'i');_0x3b3d66[_0x138fa0]=_0x1434a9;}}const _0x224682=[['%1StartBattleJS',_0x37cf4c(0x56a)],[_0x37cf4c(0x2bf),_0x37cf4c(0x635)],['BattleVictoryJS',_0x37cf4c(0x26d)],[_0x37cf4c(0x3db),_0x37cf4c(0x57f)],[_0x37cf4c(0x532),_0x37cf4c(0x21d)],[_0x37cf4c(0x7a6),'JS\x20ESCAPE\x20FAILURE'],[_0x37cf4c(0x7f9),_0x37cf4c(0x4bd)],[_0x37cf4c(0x20e),'JS\x20%1END\x20TURN'],['%1RegenerateJS',_0x37cf4c(0x817)]];for(const _0x25f7a9 of _0x224682){for(const _0x6438e3 of _0x9b2baa){const _0x2eb443=_0x25f7a9[0x0][_0x37cf4c(0x36b)](_0x6438e3[0x0]),_0x587e85=_0x25f7a9[0x1]['format'](_0x6438e3[0x1]),_0x2790cd=new RegExp(_0x45e3d0[_0x37cf4c(0x36b)](_0x587e85),'i');_0x3b3d66[_0x2eb443]=_0x2790cd;}}},Scene_Boot[_0x2bbd55(0x5d7)][_0x2bbd55(0x661)]=function(){const _0x34d60d=_0x2bbd55,_0x4e5bb7=$dataSkills[_0x34d60d(0x633)]($dataItems);for(const _0x3294e4 of _0x4e5bb7){if(!_0x3294e4)continue;VisuMZ['BattleCore'][_0x34d60d(0x270)](_0x3294e4);}},Scene_Boot[_0x2bbd55(0x5d7)]['process_VisuMZ_BattleCore_TraitObject_Notetags']=function(){const _0x3b1af4=_0x2bbd55,_0x2261ff=$dataActors[_0x3b1af4(0x633)]($dataClasses,$dataWeapons,$dataArmors,$dataEnemies,$dataStates);for(const _0x2b3245 of _0x2261ff){if(!_0x2b3245)continue;VisuMZ[_0x3b1af4(0x46a)][_0x3b1af4(0x2ca)](_0x2b3245);}},Scene_Boot['prototype'][_0x2bbd55(0x701)]=function(){const _0x507629=_0x2bbd55,_0x467c6b=VisuMZ[_0x507629(0x46a)][_0x507629(0x55b)][_0x507629(0x508)][_0x507629(0x364)],_0x51a57f=[];for(const _0x4833a1 of _0x467c6b){const _0x5b631c=$dataTroops[_0x4833a1];if(_0x5b631c)_0x51a57f[_0x507629(0x786)](JsonEx[_0x507629(0x878)](_0x5b631c));}for(const _0x5d548f of $dataTroops){if(!_0x5d548f)continue;for(const _0x6bfed5 of _0x51a57f){if(_0x6bfed5['id']===_0x5d548f['id'])continue;_0x5d548f[_0x507629(0x631)]=_0x5d548f[_0x507629(0x631)][_0x507629(0x633)](_0x6bfed5[_0x507629(0x631)]);}}},Scene_Boot[_0x2bbd55(0x5d7)][_0x2bbd55(0x67d)]=function(){const _0x4552ac=_0x2bbd55,_0x3fce84=$dataSkills[_0x4552ac(0x633)]($dataItems);for(const _0x499c0f of _0x3fce84){if(!_0x499c0f)continue;VisuMZ['BattleCore'][_0x4552ac(0x1a4)](_0x499c0f);}},VisuMZ[_0x2bbd55(0x46a)]['ParseActorNotetags']=VisuMZ['ParseActorNotetags'],VisuMZ['ParseActorNotetags']=function(_0x2131e5){const _0x23e620=_0x2bbd55;VisuMZ['BattleCore'][_0x23e620(0x7ca)]&&VisuMZ[_0x23e620(0x46a)]['ParseActorNotetags'][_0x23e620(0x4f4)](this,_0x2131e5),VisuMZ['BattleCore'][_0x23e620(0x2ca)](_0x2131e5);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x1aa)]=VisuMZ[_0x2bbd55(0x1aa)],VisuMZ[_0x2bbd55(0x1aa)]=function(_0x5d9b26){const _0x524c5f=_0x2bbd55;VisuMZ['BattleCore']['ParseClassNotetags']&&VisuMZ[_0x524c5f(0x46a)]['ParseClassNotetags'][_0x524c5f(0x4f4)](this,_0x5d9b26),VisuMZ[_0x524c5f(0x46a)][_0x524c5f(0x2ca)](_0x5d9b26);},VisuMZ['BattleCore']['ParseSkillNotetags']=VisuMZ[_0x2bbd55(0x17c)],VisuMZ['ParseSkillNotetags']=function(_0x45cdf6){const _0x5889b0=_0x2bbd55;VisuMZ['BattleCore'][_0x5889b0(0x17c)]&&VisuMZ[_0x5889b0(0x46a)][_0x5889b0(0x17c)][_0x5889b0(0x4f4)](this,_0x45cdf6),VisuMZ[_0x5889b0(0x46a)][_0x5889b0(0x270)](_0x45cdf6),VisuMZ[_0x5889b0(0x46a)]['Parse_Notetags_Targets'](_0x45cdf6);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x2d1)]=VisuMZ['ParseItemNotetags'],VisuMZ[_0x2bbd55(0x2d1)]=function(_0x22a0ed){const _0x3c78a7=_0x2bbd55;VisuMZ[_0x3c78a7(0x46a)][_0x3c78a7(0x2d1)]&&VisuMZ[_0x3c78a7(0x46a)][_0x3c78a7(0x2d1)][_0x3c78a7(0x4f4)](this,_0x22a0ed),VisuMZ['BattleCore'][_0x3c78a7(0x270)](_0x22a0ed),VisuMZ['BattleCore']['Parse_Notetags_Targets'](_0x22a0ed);},VisuMZ[_0x2bbd55(0x46a)]['ParseWeaponNotetags']=VisuMZ[_0x2bbd55(0x4e7)],VisuMZ[_0x2bbd55(0x4e7)]=function(_0xd568c1){const _0x324adf=_0x2bbd55;VisuMZ[_0x324adf(0x46a)][_0x324adf(0x4e7)]&&VisuMZ[_0x324adf(0x46a)][_0x324adf(0x4e7)][_0x324adf(0x4f4)](this,_0xd568c1),VisuMZ[_0x324adf(0x46a)][_0x324adf(0x2ca)](_0xd568c1);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x2bd)]=VisuMZ[_0x2bbd55(0x2bd)],VisuMZ[_0x2bbd55(0x2bd)]=function(_0x573869){const _0x5be9b9=_0x2bbd55;VisuMZ[_0x5be9b9(0x46a)]['ParseArmorNotetags']&&VisuMZ['BattleCore']['ParseArmorNotetags'][_0x5be9b9(0x4f4)](this,_0x573869),VisuMZ[_0x5be9b9(0x46a)][_0x5be9b9(0x2ca)](_0x573869);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x121)]=VisuMZ[_0x2bbd55(0x121)],VisuMZ[_0x2bbd55(0x121)]=function(_0x5f3b3e){const _0x9c8f06=_0x2bbd55;VisuMZ[_0x9c8f06(0x46a)][_0x9c8f06(0x121)]&&VisuMZ[_0x9c8f06(0x46a)]['ParseEnemyNotetags']['call'](this,_0x5f3b3e),VisuMZ[_0x9c8f06(0x46a)][_0x9c8f06(0x2ca)](_0x5f3b3e);},VisuMZ['BattleCore'][_0x2bbd55(0x32c)]=VisuMZ[_0x2bbd55(0x32c)],VisuMZ[_0x2bbd55(0x32c)]=function(_0x1e45a5){const _0x4a0c84=_0x2bbd55;VisuMZ[_0x4a0c84(0x46a)][_0x4a0c84(0x32c)]&&VisuMZ['BattleCore']['ParseStateNotetags']['call'](this,_0x1e45a5),VisuMZ[_0x4a0c84(0x46a)]['Parse_Notetags_TraitObjects'](_0x1e45a5);},VisuMZ[_0x2bbd55(0x46a)]['Parse_Notetags_Action']=function(_0x2565be){const _0x533c5f=_0x2bbd55,_0x582ad0=[_0x533c5f(0x4bb),_0x533c5f(0x227),'PreDamageJS',_0x533c5f(0x17e),'PreStartActionJS',_0x533c5f(0x78e),_0x533c5f(0x6b7),_0x533c5f(0x7e2)];for(const _0x1061b2 of _0x582ad0){VisuMZ[_0x533c5f(0x46a)]['createJS'](_0x2565be,_0x1061b2);}const _0x3faaab=_0x2565be[_0x533c5f(0x11b)];_0x3faaab[_0x533c5f(0x87d)](/<ALWAYS CRITICAL/i)&&(_0x2565be[_0x533c5f(0x4e0)]['critical']=!![]),_0x3faaab[_0x533c5f(0x87d)](/<(?:REPEAT|REPEATS|REPEAT HITS):[ ](\d+)/i)&&(_0x2565be[_0x533c5f(0x69f)]=Math['max'](0x1,Number(RegExp['$1']))),_0x3faaab['match'](/<TARGET:[ ](.*)>/i)&&(_0x2565be[_0x533c5f(0x3ee)]=String(RegExp['$1'])['toUpperCase']()[_0x533c5f(0x692)]());},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x2ca)]=function(_0xa4b1ca){const _0x2f2f79=_0x2bbd55,_0x229279=[_0x2f2f79(0x5fe),_0x2f2f79(0x29e),'PreDamageAsUserJS',_0x2f2f79(0x36a),_0x2f2f79(0x3a0),_0x2f2f79(0x80a),_0x2f2f79(0x391),_0x2f2f79(0x358),'PreStartActionJS','PostStartActionJS',_0x2f2f79(0x6b7),_0x2f2f79(0x7e2),_0x2f2f79(0x24e),_0x2f2f79(0x711),'PreEndBattleJS','PostEndBattleJS','BattleVictoryJS',_0x2f2f79(0x3db),_0x2f2f79(0x532),_0x2f2f79(0x7a6),'PreStartTurnJS',_0x2f2f79(0x4b2),'PreEndTurnJS','PostEndTurnJS',_0x2f2f79(0x6b5),_0x2f2f79(0x746)];for(const _0x269c10 of _0x229279){VisuMZ[_0x2f2f79(0x46a)]['createJS'](_0xa4b1ca,_0x269c10);}},VisuMZ['BattleCore']['Parse_Notetags_Targets']=function(_0xa74589){const _0x3ba0ec=_0x2bbd55,_0x24c7cf=_0xa74589[_0x3ba0ec(0x11b)];if(_0x24c7cf[_0x3ba0ec(0x87d)](/<JS TARGETS>\s*([\s\S]*)\s*<\/JS TARGETS>/i)){const _0x31ca28=String(RegExp['$1']),_0x4c2002=VisuMZ[_0x3ba0ec(0x46a)]['createKeyJS'](_0xa74589,_0x3ba0ec(0x846));VisuMZ['BattleCore'][_0x3ba0ec(0x287)](_0x31ca28,_0x4c2002);}if(_0x24c7cf[_0x3ba0ec(0x87d)](/<JS COMMAND (?:VISIBLE|SHOW|HIDE)>\s*([\s\S]*)\s*<\/JS COMMAND (?:VISIBLE|SHOW|HIDE)>/i)){const _0x179e80=String(RegExp['$1']),_0x100134=VisuMZ[_0x3ba0ec(0x46a)][_0x3ba0ec(0x2f9)](_0xa74589,'CommandVisible');VisuMZ['BattleCore'][_0x3ba0ec(0x806)](_0x179e80,_0x100134);}},VisuMZ[_0x2bbd55(0x46a)]['JS']={},VisuMZ[_0x2bbd55(0x46a)]['createJS']=function(_0x2a52df,_0x4c4e03){const _0x1fc708=_0x2bbd55,_0x2c5f08=_0x2a52df[_0x1fc708(0x11b)];if(_0x2c5f08[_0x1fc708(0x87d)](VisuMZ[_0x1fc708(0x46a)][_0x1fc708(0x4de)][_0x4c4e03])){const _0x4f54af=RegExp['$1'],_0x31c85b='\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20Declare\x20Arguments\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20arguments[0];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20target\x20=\x20arguments[1];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20obj\x20=\x20arguments[2];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20value\x20=\x20arguments[3]\x20||\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20originalValue\x20=\x20value;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20Declare\x20Constants\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20action\x20=\x20(this.constructor\x20===\x20Game_Action)\x20?\x20this\x20:\x20user.currentAction();\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20a\x20=\x20user;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20b\x20=\x20target;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20attacker\x20=\x20user;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20defender\x20=\x20target;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20healer\x20=\x20user;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20receiver\x20=\x20target;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20actor\x20=\x20obj;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20currentClass\x20=\x20obj;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20skill\x20=\x20(this.constructor\x20===\x20Game_Action)\x20?\x20this.item()\x20:\x20obj;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20item\x20=\x20(this.constructor\x20===\x20Game_Action)\x20?\x20this.item()\x20:\x20obj;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20weapon\x20=\x20obj;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20armor\x20=\x20obj;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20enemy\x20=\x20obj;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20state\x20=\x20obj;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20Create\x20Compatibility\x20Variables\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20origin\x20=\x20user;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(Imported.VisuMZ_1_SkillsStatesCore\x20&&\x20$dataStates.includes(obj))\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20origin\x20=\x20target.getStateOrigin(obj.id);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20Process\x20Code\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20NaN\x20Check\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20(isNaN(value)){\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20console.log(\x27NaN\x20value\x20created\x20by\x20%2\x27.format(\x27\x27,obj.name));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20console.log(\x27Restoring\x20value\x20to\x20%2\x27.format(\x27\x27,originalValue));\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20=\x20originalValue;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20Return\x20Value\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20value;\x0a\x20\x20\x20\x20\x20\x20\x20\x20'[_0x1fc708(0x36b)](_0x4f54af),_0x248551=VisuMZ[_0x1fc708(0x46a)][_0x1fc708(0x2f9)](_0x2a52df,_0x4c4e03);VisuMZ[_0x1fc708(0x46a)]['JS'][_0x248551]=new Function(_0x31c85b);}},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x2f9)]=function(_0x2c1b94,_0x3dd67f){const _0x2172da=_0x2bbd55;let _0x10e36e='';if($dataActors[_0x2172da(0x42f)](_0x2c1b94))_0x10e36e='Actor-%1-%2'[_0x2172da(0x36b)](_0x2c1b94['id'],_0x3dd67f);if($dataClasses['includes'](_0x2c1b94))_0x10e36e=_0x2172da(0x797)[_0x2172da(0x36b)](_0x2c1b94['id'],_0x3dd67f);if($dataSkills[_0x2172da(0x42f)](_0x2c1b94))_0x10e36e=_0x2172da(0x7b2)['format'](_0x2c1b94['id'],_0x3dd67f);if($dataItems[_0x2172da(0x42f)](_0x2c1b94))_0x10e36e='Item-%1-%2'[_0x2172da(0x36b)](_0x2c1b94['id'],_0x3dd67f);if($dataWeapons[_0x2172da(0x42f)](_0x2c1b94))_0x10e36e=_0x2172da(0x698)[_0x2172da(0x36b)](_0x2c1b94['id'],_0x3dd67f);if($dataArmors[_0x2172da(0x42f)](_0x2c1b94))_0x10e36e=_0x2172da(0x7fb)[_0x2172da(0x36b)](_0x2c1b94['id'],_0x3dd67f);if($dataEnemies[_0x2172da(0x42f)](_0x2c1b94))_0x10e36e=_0x2172da(0x300)[_0x2172da(0x36b)](_0x2c1b94['id'],_0x3dd67f);if($dataStates['includes'](_0x2c1b94))_0x10e36e=_0x2172da(0x39e)[_0x2172da(0x36b)](_0x2c1b94['id'],_0x3dd67f);return _0x10e36e;},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x287)]=function(_0xbc9e1e,_0x39d06f){const _0x15b1f5=_0x2bbd55,_0x1088ac=_0x15b1f5(0x11a)[_0x15b1f5(0x36b)](_0xbc9e1e);VisuMZ[_0x15b1f5(0x46a)]['JS'][_0x39d06f]=new Function(_0x1088ac);},VisuMZ[_0x2bbd55(0x46a)]['createCommandVisibleJS']=function(_0x51b46c,_0x53633e){const _0x101973=_0x2bbd55,_0xbf9583=_0x101973(0x5a7)['format'](_0x51b46c);VisuMZ[_0x101973(0x46a)]['JS'][_0x53633e]=new Function(_0xbf9583);},TextManager[_0x2bbd55(0x75a)]=VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x55b)][_0x2bbd55(0x126)][_0x2bbd55(0x3f3)],TextManager['autoBattleStart']=VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x55b)][_0x2bbd55(0x3d1)][_0x2bbd55(0x6ff)],TextManager[_0x2bbd55(0x829)]=VisuMZ[_0x2bbd55(0x46a)]['Settings'][_0x2bbd55(0x3d1)]['StyleName'],TextManager['visualHpGauge']=VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x55b)][_0x2bbd55(0x58a)][_0x2bbd55(0x599)],ColorManager[_0x2bbd55(0x684)]=function(_0x33ceb6){const _0x144244=_0x2bbd55;return _0x33ceb6=String(_0x33ceb6),_0x33ceb6[_0x144244(0x87d)](/#(.*)/i)?_0x144244(0x41e)[_0x144244(0x36b)](String(RegExp['$1'])):this['textColor'](Number(_0x33ceb6));},DataManager[_0x2bbd55(0x7dc)]=function(_0x418796){const _0x50c55e=_0x2bbd55;if(_0x418796[_0x50c55e(0x11b)][_0x50c55e(0x87d)](/<DAMAGE STYLE:[ ](.*)>/i)){const _0x2e110c=String(RegExp['$1'])[_0x50c55e(0x6d4)]()[_0x50c55e(0x692)]();if(_0x2e110c===_0x50c55e(0x678))return _0x50c55e(0x678);if(VisuMZ[_0x50c55e(0x724)][_0x2e110c])return _0x2e110c;}const _0x56d6b2=VisuMZ['BattleCore'][_0x50c55e(0x55b)][_0x50c55e(0x14a)][_0x50c55e(0x73b)][_0x50c55e(0x6d4)]()[_0x50c55e(0x692)]();if(VisuMZ[_0x50c55e(0x724)][_0x56d6b2])return _0x56d6b2;return _0x50c55e(0x678);},DataManager[_0x2bbd55(0x5e9)]=function(_0x398221){const _0x285030=_0x2bbd55;_0x398221=_0x398221[_0x285030(0x6d4)]()[_0x285030(0x692)](),this[_0x285030(0x4f3)]=this[_0x285030(0x4f3)]||{};if(this[_0x285030(0x4f3)][_0x398221])return this[_0x285030(0x4f3)][_0x398221];for(let _0x463d37=0x1;_0x463d37<0x64;_0x463d37++){if(!$dataSystem[_0x285030(0x1fd)][_0x463d37])continue;let _0x12a470=$dataSystem[_0x285030(0x1fd)][_0x463d37][_0x285030(0x6d4)]()[_0x285030(0x692)]();_0x12a470=_0x12a470[_0x285030(0x830)](/\x1I\[(\d+)\]/gi,''),_0x12a470=_0x12a470[_0x285030(0x830)](/\\I\[(\d+)\]/gi,''),this['_stypeIDs'][_0x12a470]=_0x463d37;}return this['_stypeIDs'][_0x398221]||0x0;},DataManager[_0x2bbd55(0x75d)]=function(_0x3f6edb){const _0x2b4655=_0x2bbd55;_0x3f6edb=_0x3f6edb[_0x2b4655(0x6d4)]()[_0x2b4655(0x692)](),this['_skillIDs']=this['_skillIDs']||{};if(this[_0x2b4655(0x544)][_0x3f6edb])return this[_0x2b4655(0x544)][_0x3f6edb];for(const _0x44dd36 of $dataSkills){if(!_0x44dd36)continue;this[_0x2b4655(0x544)][_0x44dd36['name']['toUpperCase']()['trim']()]=_0x44dd36['id'];}return this[_0x2b4655(0x544)][_0x3f6edb]||0x0;},DataManager[_0x2bbd55(0x308)]=function(_0x25a90c){const _0x321320=_0x2bbd55;_0x25a90c=_0x25a90c['toUpperCase']()[_0x321320(0x692)](),this[_0x321320(0x35d)]=this['_enemyIDs']||{};if(this[_0x321320(0x35d)][_0x25a90c])return this[_0x321320(0x35d)][_0x25a90c];for(const _0x304c54 of $dataEnemies){if(!_0x304c54)continue;this[_0x321320(0x35d)][_0x304c54['name']['toUpperCase']()[_0x321320(0x692)]()]=_0x304c54['id'];}return this['_enemyIDs'][_0x25a90c]||0x0;},DataManager['getWtypeIdWithName']=function(_0xc5f81c){const _0x237f47=_0x2bbd55;_0xc5f81c=_0xc5f81c[_0x237f47(0x6d4)]()[_0x237f47(0x692)](),this['_wtypeIDs']=this[_0x237f47(0x761)]||{};if(this[_0x237f47(0x761)][_0xc5f81c])return this[_0x237f47(0x761)][_0xc5f81c];for(let _0x1de468=0x1;_0x1de468<0x64;_0x1de468++){if(!$dataSystem[_0x237f47(0x44b)][_0x1de468])continue;let _0x2dc042=$dataSystem[_0x237f47(0x44b)][_0x1de468][_0x237f47(0x6d4)]()[_0x237f47(0x692)]();_0x2dc042=_0x2dc042['replace'](/\x1I\[(\d+)\]/gi,''),_0x2dc042=_0x2dc042[_0x237f47(0x830)](/\\I\[(\d+)\]/gi,''),this[_0x237f47(0x761)][_0x2dc042]=_0x1de468;}return this[_0x237f47(0x761)][_0x237f47(0x149)]=0x0,this['_wtypeIDs'][_0xc5f81c]||0x0;},DataManager[_0x2bbd55(0x69d)]=function(_0x3a1f63){const _0x20fd52=_0x2bbd55,_0x5c07f0=_0x20fd52(0x199);let _0xc5b725=_0x3a1f63['iconIndex'],_0xd1496b=_0x3a1f63[_0x20fd52(0x485)];const _0x58c43c=_0x3a1f63[_0x20fd52(0x11b)];return _0x58c43c['match'](/<DISPLAY ICON: (\d+)>/i)&&(_0xc5b725=Number(RegExp['$1'])),_0x58c43c[_0x20fd52(0x87d)](/<DISPLAY TEXT: (.*)>/i)&&(_0xd1496b=String(RegExp['$1'])),_0x5c07f0['format'](_0xc5b725,_0xd1496b);},DataManager[_0x2bbd55(0x6a8)]=function(_0xcb8b43){const _0x1e50de=_0x2bbd55;return _0xcb8b43[_0x1e50de(0x11b)][_0x1e50de(0x87d)](/<COMMAND TEXT: (.*)>/i)?String(RegExp['$1']):_0xcb8b43[_0x1e50de(0x485)];},DataManager['battleCommandIcon']=function(_0x224133){const _0x3ea5c4=_0x2bbd55;return _0x224133[_0x3ea5c4(0x11b)][_0x3ea5c4(0x87d)](/<COMMAND ICON: (\d+)>/i)?Number(RegExp['$1']):_0x224133[_0x3ea5c4(0x1dd)];},DataManager['swapEnemyIDs']=function(_0x4cbf61){const _0x11fd25=_0x2bbd55,_0x684618=$dataEnemies[_0x4cbf61];if(_0x684618){if(_0x684618['note'][_0x11fd25(0x87d)](/<SWAP ENEMIES>\s*([\s\S]*)\s*<\/SWAP ENEMIES>/i)){const _0x157a3a=String(RegExp['$1'])[_0x11fd25(0x680)](/[\r\n]+/)[_0x11fd25(0x530)](''),_0xd98807=this[_0x11fd25(0x153)](_0x157a3a);_0x4cbf61=this['getEnemyIdWithName'](_0xd98807)||_0x4cbf61,_0x4cbf61=DataManager[_0x11fd25(0x29b)](_0x4cbf61);}}return _0x4cbf61;},DataManager[_0x2bbd55(0x153)]=function(_0xca9951){const _0x34f03e=_0x2bbd55;let _0x5a406b=0x0;const _0x1adb99={};for(const _0x19aea8 of _0xca9951){if(_0x19aea8[_0x34f03e(0x87d)](/(.*):[ ](\d+)/i)){const _0x5f1f36=String(RegExp['$1'])[_0x34f03e(0x692)](),_0x26fac4=Number(RegExp['$2']);_0x1adb99[_0x5f1f36]=_0x26fac4,_0x5a406b+=_0x26fac4;}else{if(_0x19aea8[_0x34f03e(0x87d)](/(.*):[ ](\d+\.?\d+)/i)){const _0x598734=String(RegExp['$1'])[_0x34f03e(0x692)](),_0x198e07=Number(RegExp['$2']);_0x1adb99[_0x598734]=_0x198e07,_0x5a406b+=_0x198e07;}else _0x19aea8!==''&&(_0x1adb99[_0x19aea8]=0x1,_0x5a406b++);}}if(_0x5a406b<=0x0)return'';let _0x4c9127=Math[_0x34f03e(0x309)]()*_0x5a406b;for(const _0x1ecc5c in _0x1adb99){_0x4c9127-=_0x1adb99[_0x1ecc5c];if(_0x4c9127<=0x0)return _0x1ecc5c;}return'';},DataManager[_0x2bbd55(0x54b)]=function(_0x4586bd){const _0x18a337=_0x2bbd55;if(!_0x4586bd)return![];if(!VisuMZ['BattleCore'][_0x18a337(0x55b)][_0x18a337(0x2d2)][_0x18a337(0x6bc)])return![];if(_0x4586bd[_0x18a337(0x11b)][_0x18a337(0x87d)](/<AUTO ACTION SEQUENCE>/i))return![];if(_0x4586bd[_0x18a337(0x11b)]['match'](/<COMMON (?:EVENT|EVENTS):[ ](.*)>/gi))return!![];for(const _0x58830e of _0x4586bd[_0x18a337(0x86c)]){if(!_0x58830e)continue;if(_0x58830e[_0x18a337(0x53d)]===Game_Action['EFFECT_COMMON_EVENT'])return!![];}return![];},ConfigManager[_0x2bbd55(0x7aa)]=![],ConfigManager[_0x2bbd55(0x36f)]=![],ConfigManager['visualHpGauge']=!![],VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x79f)]=ConfigManager['makeData'],ConfigManager['makeData']=function(){const _0x5f097c=_0x2bbd55,_0x8cb7d=VisuMZ['BattleCore'][_0x5f097c(0x79f)]['call'](this);return _0x8cb7d['autoBattleAtStart']=this[_0x5f097c(0x7aa)],_0x8cb7d[_0x5f097c(0x36f)]=this['autoBattleUseSkills'],_0x8cb7d[_0x5f097c(0x3ec)]=this[_0x5f097c(0x3ec)],_0x8cb7d;},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x4c9)]=ConfigManager[_0x2bbd55(0x799)],ConfigManager['applyData']=function(_0x8ce9b9){const _0x23466f=_0x2bbd55;VisuMZ['BattleCore'][_0x23466f(0x4c9)]['call'](this,_0x8ce9b9),_0x23466f(0x7aa)in _0x8ce9b9?this['autoBattleAtStart']=_0x8ce9b9['autoBattleAtStart']:this['autoBattleAtStart']=![],'autoBattleUseSkills'in _0x8ce9b9?this[_0x23466f(0x36f)]=_0x8ce9b9['autoBattleUseSkills']:this[_0x23466f(0x36f)]=![],_0x23466f(0x3ec)in _0x8ce9b9?this[_0x23466f(0x3ec)]=_0x8ce9b9[_0x23466f(0x3ec)]:this[_0x23466f(0x3ec)]=!![];},VisuMZ['BattleCore'][_0x2bbd55(0x6b1)]=BattleManager[_0x2bbd55(0x2e9)],BattleManager['initMembers']=function(){const _0x3960cf=_0x2bbd55;VisuMZ[_0x3960cf(0x46a)][_0x3960cf(0x6b1)]['call'](this),this[_0x3960cf(0x6c6)]=[];},BattleManager['refreshStatusWindow']=function(){const _0x60dd1b=_0x2bbd55;if(!SceneManager[_0x60dd1b(0xfb)]())return;const _0x1a0122=SceneManager['_scene'][_0x60dd1b(0x537)];if(_0x1a0122)_0x1a0122['requestRefresh']();},BattleManager[_0x2bbd55(0x15d)]=function(){const _0x2a2da0=_0x2bbd55;if(BattleManager['isTpb']())return _0x2a2da0(0x401);return _0x2a2da0(0x2b9);},BattleManager[_0x2bbd55(0x555)]=function(_0xf82a4c){const _0xf4eb1=_0x2bbd55;return _0xf82a4c=_0xf82a4c['toUpperCase']()[_0xf4eb1(0x692)](),this[_0xf4eb1(0x15d)]()===_0xf82a4c;},BattleManager[_0x2bbd55(0x7fe)]=function(){const _0x5bb332=_0x2bbd55;return this['isBattleSys'](_0x5bb332(0x2b9));},BattleManager[_0x2bbd55(0x1a8)]=function(){return this['isDTB']();},BattleManager[_0x2bbd55(0x423)]=function(){const _0x278583=_0x2bbd55;return!this[_0x278583(0x1a8)]();},BattleManager['isTeamBased']=function(){const _0x603038=_0x2bbd55;return!this[_0x603038(0x1a8)]()&&!this['isTickBased']();},BattleManager[_0x2bbd55(0x66f)]=function(_0x2ad0e3){const _0x57faf1=_0x2bbd55;$gameParty[_0x57faf1(0x66f)](_0x2ad0e3),$gameTroop[_0x57faf1(0x66f)](_0x2ad0e3);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x708)]=BattleManager['startBattle'],BattleManager[_0x2bbd55(0x13d)]=function(){const _0xfddc1f=_0x2bbd55;this[_0xfddc1f(0x87c)]=![],this['_autoBattle']=ConfigManager['autoBattleAtStart'],this['processBattleCoreJS']('PreStartBattleJS'),VisuMZ[_0xfddc1f(0x46a)][_0xfddc1f(0x708)][_0xfddc1f(0x4f4)](this),this[_0xfddc1f(0x66f)](_0xfddc1f(0x711));},BattleManager[_0x2bbd55(0x413)]=function(_0x4e9618){const _0x44938b=_0x2bbd55,_0x24788a=VisuMZ[_0x44938b(0x46a)][_0x44938b(0x55b)][_0x44938b(0x508)];_0x24788a[_0x44938b(0x25f)]&&VisuMZ['BattleCore'][_0x44938b(0x315)](_0x24788a['BattleEndEvent'])&&$gameTemp['reserveCommonEvent'](_0x24788a[_0x44938b(0x25f)]);const _0xc09d69=_0x44938b(0x418)[_0x44938b(0x36b)](_0x4e9618);_0x24788a[_0xc09d69]&&VisuMZ[_0x44938b(0x46a)]['CheckMapBattleEventValid'](_0x24788a[_0xc09d69])&&$gameTemp[_0x44938b(0x540)](_0x24788a[_0xc09d69]);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x6fe)]=BattleManager[_0x2bbd55(0x36e)],BattleManager['processVictory']=function(){const _0x5cbe1b=_0x2bbd55;this['processBattleCoreJS']('BattleVictoryJS'),VisuMZ[_0x5cbe1b(0x46a)][_0x5cbe1b(0x6fe)][_0x5cbe1b(0x4f4)](this),this['processPostBattleCommonEvents']('Victory');},VisuMZ['BattleCore'][_0x2bbd55(0x5ff)]=BattleManager['processDefeat'],BattleManager[_0x2bbd55(0x330)]=function(){const _0x467fac=_0x2bbd55;this[_0x467fac(0x66f)](_0x467fac(0x3db)),VisuMZ[_0x467fac(0x46a)]['BattleManager_processDefeat'][_0x467fac(0x4f4)](this),this[_0x467fac(0x413)]('Defeat');},VisuMZ['BattleCore']['BattleManager_endBattle']=BattleManager['endBattle'],BattleManager[_0x2bbd55(0x52b)]=function(_0x1ea3c1){const _0x555b7c=_0x2bbd55;this[_0x555b7c(0x87c)]=!![],this['_autoBattle']=![],this[_0x555b7c(0x66f)]('PreEndBattleJS'),VisuMZ[_0x555b7c(0x46a)][_0x555b7c(0x321)][_0x555b7c(0x4f4)](this,_0x1ea3c1),this['processBattleCoreJS'](_0x555b7c(0x74f));},VisuMZ['BattleCore'][_0x2bbd55(0x49f)]=BattleManager['startTurn'],BattleManager[_0x2bbd55(0x639)]=function(){const _0x8a2215=_0x2bbd55;if(this[_0x8a2215(0x1a8)]())this['processBattleCoreJS']('PreStartTurnJS');VisuMZ[_0x8a2215(0x46a)][_0x8a2215(0x49f)][_0x8a2215(0x4f4)](this);if(this['isTurnBased']())this[_0x8a2215(0x66f)]('PostStartTurnJS');},VisuMZ['BattleCore'][_0x2bbd55(0x1a1)]=BattleManager[_0x2bbd55(0x778)],BattleManager[_0x2bbd55(0x778)]=function(){const _0x73ba6d=_0x2bbd55,_0x36fe3b=this[_0x73ba6d(0x4dc)][_0x73ba6d(0x824)]();if(_0x36fe3b)_0x36fe3b[_0x73ba6d(0x5fb)]('PreStartActionJS');VisuMZ[_0x73ba6d(0x46a)][_0x73ba6d(0x1a1)][_0x73ba6d(0x4f4)](this);if(_0x36fe3b)_0x36fe3b['actionBattleCoreJS']('PostStartActionJS');},VisuMZ['BattleCore'][_0x2bbd55(0x518)]=BattleManager['endAction'],BattleManager['endAction']=function(){const _0x3a5e66=_0x2bbd55,_0x3b3f54=this[_0x3a5e66(0x474)];_0x3b3f54&&_0x3b3f54['actionBattleCoreJS'](_0x3a5e66(0x6b7)),VisuMZ[_0x3a5e66(0x46a)][_0x3a5e66(0x518)][_0x3a5e66(0x4f4)](this),_0x3b3f54&&_0x3b3f54[_0x3a5e66(0x5fb)]('PostEndActionJS'),this['refreshBattlerMotions'](this[_0x3a5e66(0x2db)]());},BattleManager['refreshBattlerMotions']=function(_0x31aa56){const _0x288ed3=_0x2bbd55;for(const _0x5e67b6 of _0x31aa56){if(!_0x5e67b6)continue;if(!_0x5e67b6[_0x288ed3(0x6ae)]())continue;_0x5e67b6['battler']()[_0x288ed3(0x19d)]();}},BattleManager[_0x2bbd55(0x271)]=function(){const _0x4153ff=_0x2bbd55;!this[_0x4153ff(0x86a)][_0x4153ff(0x6f8)]()&&this[_0x4153ff(0x841)]();},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x5c4)]=function(){const _0x351cb7=_0x2bbd55;this[_0x351cb7(0x574)]();if(Imported['VisuMZ_1_SkillsStatesCore']){const _0x5ac0ee=VisuMZ[_0x351cb7(0x122)][_0x351cb7(0x55b)][_0x351cb7(0x5e8)];_0x5ac0ee&&_0x5ac0ee[_0x351cb7(0x782)]===![]&&this['removeStatesAuto'](0x1);}else this[_0x351cb7(0xfe)](0x1);this[_0x351cb7(0x228)]();},BattleManager[_0x2bbd55(0x5ac)]=function(){const _0xef0577=_0x2bbd55;this[_0xef0577(0x156)]=VisuMZ['BattleCore'][_0xef0577(0x55b)][_0xef0577(0x508)][_0xef0577(0x435)][_0xef0577(0x4f4)](this);},VisuMZ['BattleCore'][_0x2bbd55(0x3a5)]=BattleManager['onEscapeSuccess'],BattleManager[_0x2bbd55(0x838)]=function(){const _0x203e03=_0x2bbd55;this['processBattleCoreJS']('EscapeSuccessJS'),BattleManager['_spriteset'][_0x203e03(0x542)](),VisuMZ['BattleCore'][_0x203e03(0x3a5)]['call'](this),this[_0x203e03(0x413)](_0x203e03(0x1e6));},VisuMZ[_0x2bbd55(0x46a)]['BattleManager_onEscapeFailure']=BattleManager[_0x2bbd55(0x55f)],BattleManager[_0x2bbd55(0x55f)]=function(){const _0x3200dd=_0x2bbd55;this[_0x3200dd(0x66f)](_0x3200dd(0x7a6));const _0x5555c2=this[_0x3200dd(0x156)];VisuMZ[_0x3200dd(0x46a)]['BattleManager_onEscapeFailure']['call'](this),this['_escapeRatio']=_0x5555c2+VisuMZ[_0x3200dd(0x46a)][_0x3200dd(0x55b)][_0x3200dd(0x508)][_0x3200dd(0x37d)]['call'](this),this['processPostBattleCommonEvents'](_0x3200dd(0x3b4));},BattleManager['displayStartMessages']=function(){const _0x4f96ec=_0x2bbd55;let _0x3262ef=![];if(this['isDisplayEmergedEnemies']())for(const _0x2f8174 of $gameTroop[_0x4f96ec(0x47c)]()){this[_0x4f96ec(0x86a)]['push'](_0x4f96ec(0x528),TextManager['emerge'][_0x4f96ec(0x36b)](_0x2f8174)),this[_0x4f96ec(0x86a)][_0x4f96ec(0x786)]('wait'),_0x3262ef=!![];}if(this[_0x4f96ec(0x864)])this[_0x4f96ec(0x86a)]['push'](_0x4f96ec(0x528),TextManager[_0x4f96ec(0x367)][_0x4f96ec(0x36b)]($gameParty[_0x4f96ec(0x485)]())),this[_0x4f96ec(0x86a)]['push']('wait');else this['_surprise']&&(this[_0x4f96ec(0x86a)][_0x4f96ec(0x786)](_0x4f96ec(0x528),TextManager['surprise'][_0x4f96ec(0x36b)]($gameParty[_0x4f96ec(0x485)]())),this[_0x4f96ec(0x86a)][_0x4f96ec(0x786)]('wait'));_0x3262ef&&(this[_0x4f96ec(0x86a)][_0x4f96ec(0x786)]('wait'),this[_0x4f96ec(0x86a)]['push']('clear')),this[_0x4f96ec(0x80f)]()&&this['isSkipPartyCommandWindow']()&&(this[_0x4f96ec(0x40b)]=![]);},BattleManager['isDisplayEmergedEnemies']=function(){const _0x557e26=_0x2bbd55;if(BattleManager[_0x557e26(0x77e)])return![];return VisuMZ['BattleCore']['Settings']['Enemy']['EmergeText'];},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x65d)]=BattleManager[_0x2bbd55(0x18d)],BattleManager[_0x2bbd55(0x18d)]=function(){const _0x10a9c8=_0x2bbd55;VisuMZ[_0x10a9c8(0x46a)][_0x10a9c8(0x65d)]['call'](this),this[_0x10a9c8(0x7fe)]()&&this[_0x10a9c8(0x1bd)]()&&!this['_surprise']&&$gameParty[_0x10a9c8(0x1da)]()&&this[_0x10a9c8(0x6b2)]();},BattleManager[_0x2bbd55(0x1bd)]=function(){const _0x284020=_0x2bbd55;return VisuMZ[_0x284020(0x46a)][_0x284020(0x55b)][_0x284020(0x126)][_0x284020(0x40e)];},BattleManager[_0x2bbd55(0x559)]=function(){const _0x3cde6a=_0x2bbd55;this[_0x3cde6a(0x393)]()&&this[_0x3cde6a(0x6b2)]();},VisuMZ[_0x2bbd55(0x46a)]['Scene_Battle_startActorCommandSelection']=Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x36c)],Scene_Battle['prototype']['startActorCommandSelection']=function(){const _0xe0ab18=_0x2bbd55;VisuMZ[_0xe0ab18(0x46a)]['Scene_Battle_startActorCommandSelection'][_0xe0ab18(0x4f4)](this),BattleManager[_0xe0ab18(0x80f)]()&&BattleManager[_0xe0ab18(0x40b)]&&(BattleManager['_tpbNeedsPartyCommand']=![],this[_0xe0ab18(0x166)]());},BattleManager[_0x2bbd55(0x517)]=function(_0x5e15ab,_0x191252){const _0x28ee33=_0x2bbd55;this['_action'][_0x28ee33(0x737)]=_0x191252,this[_0x28ee33(0x86a)]['displayReflection'](_0x191252),this[_0x28ee33(0x86a)][_0x28ee33(0x3d0)](_0x5e15ab,this[_0x28ee33(0x474)]),this['_action'][_0x28ee33(0x663)](_0x5e15ab),this[_0x28ee33(0x86a)]['displayActionResults'](_0x5e15ab,_0x5e15ab);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x758)]=BattleManager[_0x2bbd55(0x63f)],BattleManager[_0x2bbd55(0x63f)]=function(){const _0x187501=_0x2bbd55;VisuMZ[_0x187501(0x46a)][_0x187501(0x758)][_0x187501(0x4f4)](this),this['_actionBattlers']=this[_0x187501(0x675)][_0x187501(0x11f)](_0x501bb9=>_0x501bb9&&_0x501bb9[_0x187501(0x7ff)]());},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x58c)]=BattleManager[_0x2bbd55(0x298)],BattleManager['updatePhase']=function(_0x4acc42){const _0x363f27=_0x2bbd55;if(this[_0x363f27(0x794)]===_0x363f27(0x34d))this[_0x363f27(0x5da)]();else this[_0x363f27(0x794)]===_0x363f27(0x503)?this[_0x363f27(0x832)]():VisuMZ[_0x363f27(0x46a)][_0x363f27(0x58c)][_0x363f27(0x4f4)](this,_0x4acc42);},BattleManager[_0x2bbd55(0x366)]=function(){const _0x215e4f=_0x2bbd55;this[_0x215e4f(0x3d8)]=this['_targets'][_0x215e4f(0x3d2)](0x0),this[_0x215e4f(0x638)]=0x0,this[_0x215e4f(0x520)]=this['_allTargets'][0x0]||null,this['_phase']=_0x215e4f(0x34d);},BattleManager[_0x2bbd55(0x5da)]=function(){const _0x1fa268=_0x2bbd55;!this[_0x1fa268(0x535)]()&&!this[_0x1fa268(0x86a)][_0x1fa268(0x6f8)]()&&(this[_0x1fa268(0x794)]=_0x1fa268(0x80b));},BattleManager[_0x2bbd55(0x503)]=function(_0x1a96f4){const _0x5ca539=_0x2bbd55;this['_actionBattlers'][_0x5ca539(0x530)](_0x1a96f4);if(_0x1a96f4===this[_0x5ca539(0x4dc)])return;const _0x3cbb72=JsonEx[_0x5ca539(0x878)](_0x1a96f4[_0x5ca539(0x824)]());this[_0x5ca539(0x6c6)][_0x5ca539(0x786)]([_0x1a96f4,_0x3cbb72]);},BattleManager[_0x2bbd55(0x395)]=function(){},BattleManager['updateStart']=function(){const _0x2e4e74=_0x2bbd55;if(this[_0x2e4e74(0x80f)]())this[_0x2e4e74(0x794)]=_0x2e4e74(0x6eb);else this['_forcedBattlers'][_0x2e4e74(0x5cf)]>0x0?this[_0x2e4e74(0x794)]=_0x2e4e74(0x6eb):this[_0x2e4e74(0x18d)]();},BattleManager[_0x2bbd55(0x3fe)]=function(){const _0x437ab5=_0x2bbd55,_0x26e0a9=this[_0x437ab5(0x4dc)];_0x26e0a9&&this[_0x437ab5(0x80f)]()&&_0x26e0a9['setActionState'](_0x437ab5(0x5ee));for(;;){const _0x133154=this[_0x437ab5(0x831)]();if(!_0x133154)return null;if(_0x133154[_0x437ab5(0x775)]()&&_0x133154[_0x437ab5(0x61f)]())return _0x133154;}},BattleManager[_0x2bbd55(0x831)]=function(){const _0x4ec490=_0x2bbd55;if(this[_0x4ec490(0x6c6)][_0x4ec490(0x5cf)]>0x0){const _0x117ad3=this[_0x4ec490(0x6c6)][_0x4ec490(0x2a6)](),_0x58d2f9=_0x117ad3[0x0];return _0x58d2f9[_0x4ec490(0x3ce)]=_0x58d2f9[_0x4ec490(0x3ce)]||[],_0x58d2f9['_actions'][0x0]=_0x117ad3[0x1],_0x58d2f9;}else return this['_actionBattlers'][_0x4ec490(0x2a6)]();},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x2da)]=Game_Battler['prototype'][_0x2bbd55(0x503)],Game_Battler[_0x2bbd55(0x5d7)]['forceAction']=function(_0x435c45,_0x4931e0){const _0x303221=_0x2bbd55;VisuMZ[_0x303221(0x46a)][_0x303221(0x2da)][_0x303221(0x4f4)](this,_0x435c45,_0x4931e0),this['_actions'][this[_0x303221(0x3ce)][_0x303221(0x5cf)]-0x1]['_forceAction']=!![];},Game_Interpreter['prototype']['command339']=function(_0xfb7caf){const _0x15d8b0=_0x2bbd55;return this[_0x15d8b0(0x299)](_0xfb7caf[0x0],_0xfb7caf[0x1],_0x1254e4=>{const _0x453dc6=_0x15d8b0;!_0x1254e4[_0x453dc6(0x429)]()&&(_0x1254e4[_0x453dc6(0x503)](_0xfb7caf[0x2],_0xfb7caf[0x3]),BattleManager[_0x453dc6(0x503)](_0x1254e4));}),!![];},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x3cf)]=Game_Battler['prototype'][_0x2bbd55(0x236)],Game_Battler['prototype']['makeSpeed']=function(){const _0x122c64=_0x2bbd55;VisuMZ[_0x122c64(0x46a)][_0x122c64(0x3cf)][_0x122c64(0x4f4)](this),this[_0x122c64(0x3ce)][_0x122c64(0x5cf)]<=0x0&&(this[_0x122c64(0x40a)]=Number[_0x122c64(0x274)]);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x7ef)]=BattleManager[_0x2bbd55(0x6b2)],BattleManager[_0x2bbd55(0x6b2)]=function(){const _0x1cae45=_0x2bbd55;this[_0x1cae45(0x80f)]()?this[_0x1cae45(0x2cc)]():VisuMZ['BattleCore'][_0x1cae45(0x7ef)]['call'](this);},BattleManager[_0x2bbd55(0x2cc)]=function(){const _0x159d0b=_0x2bbd55;if(this[_0x159d0b(0xff)]){if(this[_0x159d0b(0xff)][_0x159d0b(0x6b2)]())return;this['finishActorInput'](),this[_0x159d0b(0x73e)](),!this[_0x159d0b(0x4dc)]&&!this[_0x159d0b(0xff)]&&SceneManager[_0x159d0b(0x750)][_0x159d0b(0x566)]();}else!this[_0x159d0b(0x4dc)]&&this[_0x159d0b(0x726)]();},BattleManager[_0x2bbd55(0x73e)]=function(){const _0x38747f=_0x2bbd55;(!this[_0x38747f(0x393)]()||this['needsActorInputCancel']())&&(this[_0x38747f(0x165)]&&(!$gameParty['battleMembers']()['includes'](this[_0x38747f(0x165)])&&(this[_0x38747f(0x165)]=null)),!this[_0x38747f(0x165)]?(this[_0x38747f(0x586)](),this[_0x38747f(0xff)]=null,this[_0x38747f(0x7a8)]=![]):(this[_0x38747f(0xff)]=this[_0x38747f(0x165)],this['_currentActor'][_0x38747f(0x128)]=_0x38747f(0x5d0),this[_0x38747f(0x7a8)]=!![],this['_tpbSceneChangeCacheActor']=null));},VisuMZ['BattleCore'][_0x2bbd55(0x17b)]=BattleManager[_0x2bbd55(0x1bc)],BattleManager[_0x2bbd55(0x1bc)]=function(){const _0x400687=_0x2bbd55;return this['_phase']===_0x400687(0x34d)?this[_0x400687(0x63a)]():VisuMZ[_0x400687(0x46a)][_0x400687(0x17b)]['call'](this);},BattleManager['battleCoreTpbMainPhase']=function(){return this['isActiveTpb']();},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x106)]=BattleManager[_0x2bbd55(0x586)],BattleManager[_0x2bbd55(0x586)]=function(){const _0x43414c=_0x2bbd55;this[_0x43414c(0x80f)]()&&this[_0x43414c(0x794)]===_0x43414c(0x140)&&(this[_0x43414c(0xff)]=null),VisuMZ[_0x43414c(0x46a)]['BattleManager_cancelActorInput'][_0x43414c(0x4f4)](this);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x4e3)]=BattleManager['inputtingAction'],BattleManager[_0x2bbd55(0x237)]=function(){const _0x34d713=_0x2bbd55,_0x5c30e1=this[_0x34d713(0xff)];if(_0x5c30e1&&!_0x5c30e1['inputtingAction']()){const _0x8fbfda=_0x5c30e1[_0x34d713(0x487)];_0x5c30e1[_0x34d713(0x3ce)][_0x8fbfda]=new Game_Action(_0x5c30e1);}return VisuMZ['BattleCore']['BattleManager_inputtingAction']['call'](this);},SceneManager[_0x2bbd55(0xfb)]=function(){const _0x1e6a77=_0x2bbd55;return this[_0x1e6a77(0x750)]&&this['_scene']['constructor']===Scene_Battle;},SceneManager[_0x2bbd55(0x2fd)]=function(){const _0x32f5ed=_0x2bbd55;return Spriteset_Battle[_0x32f5ed(0x5d7)]['isFlipped']();},SceneManager[_0x2bbd55(0x31f)]=function(){const _0x354b34=_0x2bbd55;if(SceneManager[_0x354b34(0x595)](Scene_Options))return!![];return![];},SceneManager[_0x2bbd55(0x26a)]=function(){const _0xdc1b2b=_0x2bbd55;if(SceneManager[_0xdc1b2b(0x847)](Scene_Options))return!![];return![];},VisuMZ[_0x2bbd55(0x46a)]['Game_Temp_requestAnimation']=Game_Temp[_0x2bbd55(0x5d7)][_0x2bbd55(0x2e4)],Game_Temp[_0x2bbd55(0x5d7)][_0x2bbd55(0x2e4)]=function(_0x4204e1,_0x5b53fe,_0x1d4c61){const _0x20ef3a=_0x2bbd55;_0x4204e1=_0x4204e1[_0x20ef3a(0x11f)]((_0xa8c3d6,_0xff2137,_0x40aad6)=>_0x40aad6['indexOf'](_0xa8c3d6)===_0xff2137),SceneManager[_0x20ef3a(0xfb)]()&&SceneManager[_0x20ef3a(0x2fd)]()&&(_0x1d4c61=!_0x1d4c61),VisuMZ[_0x20ef3a(0x46a)]['Game_Temp_requestAnimation'][_0x20ef3a(0x4f4)](this,_0x4204e1,_0x5b53fe,_0x1d4c61),SceneManager[_0x20ef3a(0xfb)]()&&BattleManager[_0x20ef3a(0x54a)][_0x20ef3a(0x30d)]();},Game_Temp['prototype']['setLastPluginCommandInterpreter']=function(_0x28004f){const _0x1ffa4b=_0x2bbd55;this[_0x1ffa4b(0x1e7)]=_0x28004f;},Game_Temp[_0x2bbd55(0x5d7)][_0x2bbd55(0x868)]=function(){const _0x473e34=_0x2bbd55;return this[_0x473e34(0x1e7)];},Game_Temp[_0x2bbd55(0x5d7)][_0x2bbd55(0x49c)]=function(){this['_forcedBattleLayout']=undefined;},Game_Temp['prototype'][_0x2bbd55(0x611)]=function(_0x3e1ff0){const _0x1f7c61=_0x2bbd55;$gameMap&&$dataMap&&$dataMap[_0x1f7c61(0x11b)]&&this['parseForcedGameTroopSettingsBattleCore']($dataMap[_0x1f7c61(0x11b)]);const _0x2cb76e=$dataTroops[_0x3e1ff0];_0x2cb76e&&this[_0x1f7c61(0x144)](_0x2cb76e[_0x1f7c61(0x485)]);},Game_Temp[_0x2bbd55(0x5d7)][_0x2bbd55(0x144)]=function(_0x9e5dd3){const _0x118e9d=_0x2bbd55;if(!_0x9e5dd3)return;if(_0x9e5dd3[_0x118e9d(0x87d)](/<(?:BATTLELAYOUT|BATTLE LAYOUT|LAYOUT):[ ](.*)>/i)){const _0xa6ed9a=String(RegExp['$1']);if(_0xa6ed9a[_0x118e9d(0x87d)](/DEFAULT/i))this[_0x118e9d(0x552)]=_0x118e9d(0x43b);else{if(_0xa6ed9a[_0x118e9d(0x87d)](/LIST/i))this[_0x118e9d(0x552)]=_0x118e9d(0x4fc);else{if(_0xa6ed9a[_0x118e9d(0x87d)](/XP/i))this[_0x118e9d(0x552)]='xp';else{if(_0xa6ed9a['match'](/PORTRAIT/i))this[_0x118e9d(0x552)]=_0x118e9d(0x455);else _0xa6ed9a['match'](/BORDER/i)&&(this['_forcedBattleLayout']=_0x118e9d(0x6bb));}}}}},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x192)]=Game_System['prototype'][_0x2bbd55(0x447)],Game_System[_0x2bbd55(0x5d7)][_0x2bbd55(0x447)]=function(){const _0x315c17=_0x2bbd55;VisuMZ['BattleCore'][_0x315c17(0x192)][_0x315c17(0x4f4)](this),this[_0x315c17(0x757)]();},Game_System[_0x2bbd55(0x5d7)][_0x2bbd55(0x757)]=function(){const _0x1ddb9f=_0x2bbd55;this['_defeatedEnemies']=this[_0x1ddb9f(0x7da)]||[];},Game_System[_0x2bbd55(0x5d7)][_0x2bbd55(0x11e)]=function(){const _0x3fa7a0=_0x2bbd55;if(this[_0x3fa7a0(0x7da)]===undefined)this[_0x3fa7a0(0x757)]();return this[_0x3fa7a0(0x7da)];},Game_System[_0x2bbd55(0x5d7)]['registerDefeatedEnemy']=function(_0x4c6bc1){const _0x2c8406=_0x2bbd55;if(this['_defeatedEnemies']===undefined)this['initBattleCore']();if(!_0x4c6bc1)return;if(this[_0x2c8406(0x7da)][_0x2c8406(0x42f)](_0x4c6bc1))return;this['_defeatedEnemies'][_0x2c8406(0x786)](_0x4c6bc1),this[_0x2c8406(0x7da)]['sort']((_0x2edc34,_0x5a3ad7)=>_0x2edc34-_0x5a3ad7);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x60f)]=Game_BattlerBase[_0x2bbd55(0x5d7)]['addNewState'],Game_BattlerBase[_0x2bbd55(0x5d7)][_0x2bbd55(0x5f0)]=function(_0x4f0b0f){const _0x5ded4c=_0x2bbd55,_0x3af22f=this[_0x5ded4c(0x61f)](),_0xec0ff8=this[_0x5ded4c(0x351)]();VisuMZ[_0x5ded4c(0x46a)][_0x5ded4c(0x60f)][_0x5ded4c(0x4f4)](this,_0x4f0b0f),this['isEnemy']()&&_0x3af22f&&this[_0x5ded4c(0x81e)]()&&(this[_0x5ded4c(0x51f)]=!this[_0x5ded4c(0x6d3)](),$gameSystem[_0x5ded4c(0x41b)](this['enemyId']())),SceneManager['isSceneBattle']()&&_0xec0ff8!==this['stateMotionIndex']()&&(this[_0x5ded4c(0x6ae)]()&&this[_0x5ded4c(0x6ae)]()[_0x5ded4c(0x19d)]());},Game_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x6d3)]=function(){const _0x544947=_0x2bbd55;return $gameSystem[_0x544947(0x11e)]()['includes'](this[_0x544947(0x3e5)]);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x2d7)]=Game_BattlerBase[_0x2bbd55(0x5d7)][_0x2bbd55(0x38a)],Game_BattlerBase[_0x2bbd55(0x5d7)][_0x2bbd55(0x38a)]=function(_0xa27a91){const _0x1754c9=_0x2bbd55;VisuMZ[_0x1754c9(0x46a)]['Game_BattlerBase_eraseState']['call'](this,_0xa27a91),this[_0x1754c9(0x2ba)]()&&_0xa27a91===this[_0x1754c9(0x2f8)]()&&this['isAlive']()&&(this['_visualHpGauge_JustDied']=![]),SceneManager['isSceneBattle']()&&this[_0x1754c9(0x2e0)]();},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x667)]=Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x277)],Game_Action[_0x2bbd55(0x5d7)]['clear']=function(){const _0x5148b4=_0x2bbd55;VisuMZ[_0x5148b4(0x46a)][_0x5148b4(0x667)][_0x5148b4(0x4f4)](this),this['_armorPenetration']={'arPenRate':0x0,'arPenFlat':0x0,'arRedRate':0x0,'arRedFlat':0x0},this[_0x5148b4(0x1ea)]={'criticalHitRate':0x1,'criticalHitFlat':0x0,'criticalDmgRate':0x1,'criticalDmgFlat':0x0,'damageRate':0x1,'damageFlat':0x0,'hitRate':0x1,'hitFlat':0x0},this[_0x5148b4(0x27b)]=_0x5148b4(0x43b);},Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x5ed)]=function(_0x3dbfc5,_0x5d4d4d){const _0x4eb9e7=_0x2bbd55;return VisuMZ[_0x4eb9e7(0x46a)][_0x4eb9e7(0x55b)]['Damage'][_0x4eb9e7(0x538)]['call'](this,_0x3dbfc5,_0x5d4d4d);},Game_Action['prototype'][_0x2bbd55(0x720)]=function(_0x148710,_0x32bde6){const _0x2024dd=_0x2bbd55;return VisuMZ[_0x2024dd(0x46a)][_0x2024dd(0x55b)][_0x2024dd(0x14a)][_0x2024dd(0x284)][_0x2024dd(0x4f4)](this,_0x148710,_0x32bde6);},Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x7b4)]=function(_0x2ce44a,_0x41a13b){const _0x23608f=_0x2bbd55;return VisuMZ[_0x23608f(0x46a)][_0x23608f(0x55b)][_0x23608f(0x14a)][_0x23608f(0x32b)]['call'](this,_0x2ce44a,_0x41a13b);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x318)]=Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x3c2)],Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x3c2)]=function(_0x22b4bd){const _0x9f73f6=_0x2bbd55,_0x5714c3=this[_0x9f73f6(0x2d9)]()[_0x9f73f6(0x11b)];if(_0x5714c3[_0x9f73f6(0x87d)](/<ALWAYS HIT>/i))return 0x1;else{if(_0x5714c3[_0x9f73f6(0x87d)](/<ALWAYS HIT RATE: (\d+)([%％])>/i))return Number(RegExp['$1'])/0x64;else{let _0x33b312=VisuMZ[_0x9f73f6(0x46a)][_0x9f73f6(0x318)][_0x9f73f6(0x4f4)](this,_0x22b4bd);return _0x33b312=this[_0x9f73f6(0x1ea)][_0x9f73f6(0x406)]*_0x33b312+this['_multipliers'][_0x9f73f6(0x7e3)],_0x33b312;}}},Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x7de)]=function(_0x3149ac){const _0x144f83=_0x2bbd55;if(!this[_0x144f83(0x2d9)]()[_0x144f83(0x4e0)][_0x144f83(0x176)])return 0x0;let _0x54e83e=VisuMZ[_0x144f83(0x46a)][_0x144f83(0x55b)]['Damage'][_0x144f83(0x608)]['call'](this,_0x3149ac);return _0x54e83e=this[_0x144f83(0x1ea)][_0x144f83(0x328)]*_0x54e83e+this[_0x144f83(0x1ea)]['criticalHitFlat'],_0x54e83e;},Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x52d)]=function(_0x22d63b){const _0x36b6f1=_0x2bbd55;return _0x22d63b=VisuMZ['BattleCore'][_0x36b6f1(0x55b)]['Damage'][_0x36b6f1(0x665)][_0x36b6f1(0x4f4)](this,_0x22d63b),_0x22d63b=this['_multipliers']['criticalDmgRate']*_0x22d63b+this[_0x36b6f1(0x1ea)][_0x36b6f1(0x6e4)],_0x22d63b;},VisuMZ['BattleCore']['Game_Action_evalDamageFormula']=Game_Action[_0x2bbd55(0x5d7)]['evalDamageFormula'],Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x333)]=function(_0x1597c1){const _0x1e2738=_0x2bbd55;if(this['_customDamageFormula']!=='default')return this[_0x1e2738(0x6df)](_0x1597c1);else return DataManager[_0x1e2738(0x7dc)](this[_0x1e2738(0x2d9)]())===_0x1e2738(0x678)?VisuMZ['BattleCore'][_0x1e2738(0x4ad)]['call'](this,_0x1597c1):this[_0x1e2738(0x4d6)](_0x1597c1);},Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x64a)]=function(_0x2147ac){const _0x4a23ed=_0x2bbd55;this[_0x4a23ed(0x27b)]=_0x2147ac;},Game_Action['prototype'][_0x2bbd55(0x6df)]=function(_0x5c322f){const _0x262acc=_0x2bbd55,_0x5b6a7e=this['item'](),_0x4bddaf=_0x5b6a7e[_0x262acc(0x4e0)][_0x262acc(0x383)];_0x5b6a7e['damage']['formula']=this[_0x262acc(0x27b)];let _0xf27199=VisuMZ[_0x262acc(0x46a)][_0x262acc(0x4ad)][_0x262acc(0x4f4)](this,_0x5c322f);return _0x5b6a7e['damage']['formula']=_0x4bddaf,_0xf27199;},Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x872)]=function(){const _0x3b3a65=_0x2bbd55;if(this[_0x3b3a65(0x2d9)]()[_0x3b3a65(0x11b)]['match'](/<DAMAGE STYLE:[ ](.*)>/i)){const _0x2f4b01=String(RegExp['$1'])[_0x3b3a65(0x6d4)]()[_0x3b3a65(0x692)]();return _0x2f4b01;}return _0x3b3a65(0x678);},Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x4d6)]=function(_0x423d35){const _0x1ed1e1=_0x2bbd55,_0x24b2af=DataManager[_0x1ed1e1(0x7dc)](this[_0x1ed1e1(0x2d9)]()),_0x25064f=VisuMZ[_0x1ed1e1(0x724)][_0x24b2af];try{return _0x25064f['Formula']['call'](this,_0x423d35);}catch(_0x2f0191){if($gameTemp[_0x1ed1e1(0x2ee)]())console[_0x1ed1e1(0x78c)](_0x2f0191);return VisuMZ['BattleCore']['Game_Action_evalDamageFormula'][_0x1ed1e1(0x4f4)](this);}},Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x629)]=function(_0x379cde,_0x46fa24){const _0x5e1fe0=_0x2bbd55;if(this[_0x5e1fe0(0x6aa)]())return _0x46fa24;const _0x456637=this[_0x5e1fe0(0x803)](),_0x12f27f=_0x379cde;let _0x8d534c=[],_0x20af87=[];_0x8d534c[_0x5e1fe0(0x786)](this[_0x5e1fe0(0x798)]['arPenFlat'],this[_0x5e1fe0(0x798)][_0x5e1fe0(0x5bd)]),_0x20af87[_0x5e1fe0(0x786)](this[_0x5e1fe0(0x798)][_0x5e1fe0(0x82b)],this[_0x5e1fe0(0x798)][_0x5e1fe0(0x51a)]);const _0x4b0403=this[_0x5e1fe0(0x33c)]()?/<ARMOR REDUCTION:[ ](\d+\.?\d*)>/i:/<MAGIC REDUCTION:[ ](\d+\.?\d*)>/i,_0x35846b=this['isPhysical']()?/<ARMOR REDUCTION:[ ](\d+\.?\d*)([%％])>/i:/<MAGIC REDUCTION:[ ](\d+\.?\d*)([%％])>/i,_0x52cac8=this[_0x5e1fe0(0x33c)]()?/<ARMOR PENETRATION:[ ](\d+\.?\d*)>/i:/<MAGIC PENETRATION:[ ](\d+\.?\d*)>/i,_0x2b8ca5=this[_0x5e1fe0(0x33c)]()?/<ARMOR PENETRATION:[ ](\d+\.?\d*)([%％])>/i:/<MAGIC PENETRATION:[ ](\d+\.?\d*)([%％])>/i;return _0x8d534c=_0x8d534c[_0x5e1fe0(0x633)](_0x12f27f[_0x5e1fe0(0x53c)]()['map'](_0x191b67=>_0x191b67&&_0x191b67[_0x5e1fe0(0x11b)][_0x5e1fe0(0x87d)](_0x4b0403)?Number(RegExp['$1']):0x0)),_0x20af87=_0x20af87['concat'](_0x12f27f[_0x5e1fe0(0x53c)]()[_0x5e1fe0(0x28f)](_0x27ccaa=>_0x27ccaa&&_0x27ccaa[_0x5e1fe0(0x11b)][_0x5e1fe0(0x87d)](_0x35846b)?Number(RegExp['$1'])/0x64:0x0)),_0x8d534c=_0x8d534c[_0x5e1fe0(0x633)](_0x456637[_0x5e1fe0(0x53c)]()[_0x5e1fe0(0x28f)](_0x9688e6=>_0x9688e6&&_0x9688e6['note'][_0x5e1fe0(0x87d)](_0x52cac8)?Number(RegExp['$1']):0x0)),_0x20af87=_0x20af87[_0x5e1fe0(0x633)](_0x456637[_0x5e1fe0(0x53c)]()['map'](_0xddebd=>_0xddebd&&_0xddebd[_0x5e1fe0(0x11b)][_0x5e1fe0(0x87d)](_0x2b8ca5)?Number(RegExp['$1'])/0x64:0x0)),this[_0x5e1fe0(0x2d9)]()[_0x5e1fe0(0x11b)][_0x5e1fe0(0x87d)](_0x52cac8)&&_0x8d534c[_0x5e1fe0(0x786)](Number(RegExp['$1'])),this[_0x5e1fe0(0x2d9)]()['note'][_0x5e1fe0(0x87d)](_0x2b8ca5)&&_0x20af87[_0x5e1fe0(0x786)](Number(RegExp['$1'])),_0x46fa24=_0x8d534c[_0x5e1fe0(0x37e)]((_0x9f08de,_0xf8cc6d)=>_0x9f08de-_0xf8cc6d,_0x46fa24),_0x46fa24>0x0&&(_0x46fa24=_0x20af87['reduce']((_0x81fac0,_0x42be56)=>_0x81fac0*(0x1-_0x42be56),_0x46fa24)),_0x46fa24;},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x54e)]=Game_Action[_0x2bbd55(0x5d7)]['executeDamage'],Game_Action[_0x2bbd55(0x5d7)]['executeDamage']=function(_0x3587de,_0x162576){const _0x4cf367=_0x2bbd55;_0x162576=_0x162576*this[_0x4cf367(0x1ea)][_0x4cf367(0x2af)],_0x162576+=this[_0x4cf367(0x1ea)][_0x4cf367(0x45c)]*(_0x162576>=0x0?0x1:-0x1),_0x162576=this[_0x4cf367(0x22d)](_0x4cf367(0x83d),_0x3587de,_0x162576,![]),_0x162576=this[_0x4cf367(0x246)](_0x162576),_0x162576=Math[_0x4cf367(0x86f)](_0x162576),this[_0x4cf367(0x53a)]=_0x162576,this[_0x4cf367(0x381)]=this[_0x4cf367(0x381)]||0x0,this[_0x4cf367(0x381)]+=_0x162576,VisuMZ[_0x4cf367(0x46a)][_0x4cf367(0x54e)][_0x4cf367(0x4f4)](this,_0x3587de,_0x162576),this['applyBattleCoreJS'](_0x4cf367(0x123),_0x3587de,_0x162576,!![]);},Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x246)]=function(_0x397300){const _0x25950a=_0x2bbd55;if(this[_0x25950a(0x3e2)]())return _0x397300;return _0x397300=this[_0x25950a(0x5d6)](_0x397300),_0x397300=this[_0x25950a(0x30a)](_0x397300),_0x397300;},Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x3e2)]=function(){const _0x5be5da=_0x2bbd55,_0x46ff02=/<BYPASS DAMAGE CAP>/i;if(this[_0x5be5da(0x2d9)]()[_0x5be5da(0x11b)][_0x5be5da(0x87d)](_0x46ff02))return!![];if(this[_0x5be5da(0x803)]()['traitObjects']()['some'](_0x385453=>_0x385453&&_0x385453[_0x5be5da(0x11b)][_0x5be5da(0x87d)](_0x46ff02)))return!![];return!VisuMZ[_0x5be5da(0x46a)]['Settings'][_0x5be5da(0x14a)][_0x5be5da(0x3f1)];},Game_Action['prototype'][_0x2bbd55(0x5d6)]=function(_0x2ad995){const _0x1b89d9=_0x2bbd55;if(!VisuMZ[_0x1b89d9(0x46a)][_0x1b89d9(0x55b)][_0x1b89d9(0x14a)]['EnableSoftCap'])return _0x2ad995;const _0x57bfdf=/<BYPASS SOFT DAMAGE CAP>/i;if(this[_0x1b89d9(0x2d9)]()['note']['match'](_0x57bfdf))return!![];if(this[_0x1b89d9(0x803)]()[_0x1b89d9(0x53c)]()[_0x1b89d9(0x845)](_0x58ba8c=>_0x58ba8c&&_0x58ba8c[_0x1b89d9(0x11b)]['match'](_0x57bfdf)))return!![];const _0x11233d=_0x2ad995<0x0?-0x1:0x1;_0x2ad995=Math[_0x1b89d9(0x241)](_0x2ad995);let _0xc8b0a1=this[_0x1b89d9(0x803)]()[_0x1b89d9(0x118)]();this[_0x1b89d9(0x2d9)]()[_0x1b89d9(0x11b)][_0x1b89d9(0x87d)](/<SOFT DAMAGE CAP:[ ]([\+\-]\d+)([%％])>/i)&&(_0xc8b0a1+=Number(RegExp['$1'])/0x64);_0xc8b0a1=_0xc8b0a1[_0x1b89d9(0x488)](0.01,0x1);const _0x202d6e=this[_0x1b89d9(0x422)](),_0x361abc=_0xc8b0a1*_0x202d6e;if(_0x2ad995>_0x361abc&&_0x202d6e>_0x361abc){_0x2ad995-=_0x361abc;const _0x5dbe57=VisuMZ[_0x1b89d9(0x46a)]['Settings'][_0x1b89d9(0x14a)][_0x1b89d9(0x5c9)],_0x5c1918=Math[_0x1b89d9(0x6b9)](0x1-_0x2ad995/((_0x202d6e-_0x361abc)*_0x5dbe57+_0x2ad995),0.01);_0x2ad995*=_0x5c1918,_0x2ad995+=_0x361abc;}return _0x2ad995*_0x11233d;},Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x422)]=function(){const _0x356bd8=_0x2bbd55;return this['item']()[_0x356bd8(0x11b)][_0x356bd8(0x87d)](/<DAMAGE CAP:[ ](\d+)>/i)?Number(RegExp['$1']):this[_0x356bd8(0x803)]()[_0x356bd8(0x69c)]();},Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x30a)]=function(_0xae6480){const _0x49df8f=_0x2bbd55;let _0x9abd5e=this[_0x49df8f(0x422)]();return _0xae6480[_0x49df8f(0x488)](-_0x9abd5e,_0x9abd5e);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x2d3)]=Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x663)],Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x663)]=function(_0x2fd877){const _0x5b6348=_0x2bbd55;this[_0x5b6348(0x22d)](_0x5b6348(0x4d3),_0x2fd877,0x0,!![]),VisuMZ['BattleCore']['Game_Action_apply'][_0x5b6348(0x4f4)](this,_0x2fd877),this['applyBattleCoreJS'](_0x5b6348(0x1c3),_0x2fd877,this[_0x5b6348(0x53a)]||0x0,!![]);},Game_Action[_0x2bbd55(0x5d7)]['applyBattleCoreJS']=function(_0x5c0277,_0x31e59c,_0x5af3a5,_0x8acde6){const _0x3a0ec7=_0x2bbd55;_0x5af3a5=_0x5af3a5||0x0;const _0x4b302f=_0x5af3a5,_0x46e021=VisuMZ['BattleCore'][_0x3a0ec7(0x55b)][_0x3a0ec7(0x508)],_0x146b03=_0x5c0277[_0x3a0ec7(0x36b)]('');if(_0x46e021[_0x146b03]){_0x5af3a5=_0x46e021[_0x146b03][_0x3a0ec7(0x4f4)](this,_0x5af3a5,_0x31e59c);if(_0x8acde6)_0x5af3a5=_0x4b302f;}let _0x3b08f1=VisuMZ['BattleCore'][_0x3a0ec7(0x2f9)](this[_0x3a0ec7(0x2d9)](),_0x5c0277[_0x3a0ec7(0x36b)](''));if(VisuMZ[_0x3a0ec7(0x46a)]['JS'][_0x3b08f1]){_0x5af3a5=VisuMZ[_0x3a0ec7(0x46a)]['JS'][_0x3b08f1][_0x3a0ec7(0x4f4)](this,this[_0x3a0ec7(0x803)](),_0x31e59c,this[_0x3a0ec7(0x2d9)](),_0x5af3a5);if(_0x8acde6)_0x5af3a5=_0x4b302f;}for(const _0xc31af3 of this[_0x3a0ec7(0x803)]()[_0x3a0ec7(0x53c)]()){if(!_0xc31af3)continue;_0x3b08f1=VisuMZ[_0x3a0ec7(0x46a)][_0x3a0ec7(0x2f9)](_0xc31af3,_0x5c0277[_0x3a0ec7(0x36b)](_0x3a0ec7(0x2bc)));if(VisuMZ[_0x3a0ec7(0x46a)]['JS'][_0x3b08f1]){_0x5af3a5=VisuMZ[_0x3a0ec7(0x46a)]['JS'][_0x3b08f1][_0x3a0ec7(0x4f4)](this,this[_0x3a0ec7(0x803)](),_0x31e59c,_0xc31af3,_0x5af3a5);if(_0x8acde6)_0x5af3a5=_0x4b302f;}}for(const _0x29e58c of _0x31e59c[_0x3a0ec7(0x53c)]()){if(!_0x29e58c)continue;_0x3b08f1=VisuMZ[_0x3a0ec7(0x46a)][_0x3a0ec7(0x2f9)](_0x29e58c,_0x5c0277[_0x3a0ec7(0x36b)]('AsTarget'));if(VisuMZ['BattleCore']['JS'][_0x3b08f1]){_0x5af3a5=VisuMZ[_0x3a0ec7(0x46a)]['JS'][_0x3b08f1]['call'](this,this[_0x3a0ec7(0x803)](),_0x31e59c,_0x29e58c,_0x5af3a5);if(_0x8acde6)_0x5af3a5=_0x4b302f;}}return _0x5af3a5;},Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x5fb)]=function(_0x1253df){const _0x5df46f=_0x2bbd55,_0x209b73=this[_0x5df46f(0x381)]||0x0,_0x5719b8=VisuMZ[_0x5df46f(0x46a)]['Settings'][_0x5df46f(0x508)],_0x41ed9e=_0x1253df['format']('');_0x5719b8[_0x41ed9e]&&_0x5719b8[_0x41ed9e]['call'](this,_0x209b73);let _0x40fb6e=VisuMZ[_0x5df46f(0x46a)][_0x5df46f(0x2f9)](this[_0x5df46f(0x2d9)](),_0x1253df);VisuMZ[_0x5df46f(0x46a)]['JS'][_0x40fb6e]&&VisuMZ[_0x5df46f(0x46a)]['JS'][_0x40fb6e][_0x5df46f(0x4f4)](this,this[_0x5df46f(0x803)](),this[_0x5df46f(0x803)](),this[_0x5df46f(0x2d9)](),_0x209b73);for(const _0x1f9299 of this[_0x5df46f(0x803)]()[_0x5df46f(0x53c)]()){if(!_0x1f9299)continue;_0x40fb6e=VisuMZ[_0x5df46f(0x46a)]['createKeyJS'](_0x1f9299,_0x1253df),VisuMZ[_0x5df46f(0x46a)]['JS'][_0x40fb6e]&&VisuMZ['BattleCore']['JS'][_0x40fb6e]['call'](this,this['subject'](),this[_0x5df46f(0x803)](),_0x1f9299,_0x209b73);}},Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x3cc)]=function(){const _0x29cce6=_0x2bbd55;return VisuMZ[_0x29cce6(0x46a)][_0x29cce6(0x55b)]['Mechanics'][_0x29cce6(0x2fe)][_0x29cce6(0x4f4)](this);},Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x642)]=function(){const _0x527fd1=_0x2bbd55;return VisuMZ['BattleCore']['Settings'][_0x527fd1(0x508)][_0x527fd1(0x808)];},Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x863)]=function(){const _0x2971c0=_0x2bbd55;return this[_0x2971c0(0x2d9)]()[_0x2971c0(0x11b)][_0x2971c0(0x87d)](/<JS TARGETS>/i);},Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x22c)]=function(){const _0x27e312=_0x2bbd55;if(!this[_0x27e312(0x762)]&&this[_0x27e312(0x803)]()[_0x27e312(0x730)]())return![];if(this['isCustomBattleScope']())return!![];return typeof this[_0x27e312(0x2d9)]()[_0x27e312(0x3ee)]===_0x27e312(0x858);},VisuMZ[_0x2bbd55(0x46a)]['Game_Action_isForOpponent']=Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x282)],Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x282)]=function(){const _0xeef27f=_0x2bbd55;return this[_0xeef27f(0x22c)]()&&!this[_0xeef27f(0x863)]()?this[_0xeef27f(0x860)]():VisuMZ['BattleCore']['Game_Action_isForOpponent'][_0xeef27f(0x4f4)](this);},Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x860)]=function(){const _0xe0d908=_0x2bbd55,_0x2560db=this[_0xe0d908(0x2d9)]()[_0xe0d908(0x3ee)];return _0x2560db['match'](/(?:ENEMY|ENEMIES|FOE|FOES)/i);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x21a)]=Game_Action[_0x2bbd55(0x5d7)]['isForFriend'],Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x56f)]=function(){const _0x11a67d=_0x2bbd55;return this[_0x11a67d(0x22c)]()&&!this[_0x11a67d(0x863)]()?this[_0x11a67d(0x29c)]():VisuMZ['BattleCore'][_0x11a67d(0x21a)][_0x11a67d(0x4f4)](this);},Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x29c)]=function(){const _0x1975bd=_0x2bbd55,_0x38d1b8=this[_0x1975bd(0x2d9)]()[_0x1975bd(0x3ee)];return _0x38d1b8['match'](/(?:ALLY|ALLIES|FRIEND|FRIENDS)/i);},VisuMZ[_0x2bbd55(0x46a)]['Game_Action_isForRandom']=Game_Action['prototype'][_0x2bbd55(0x526)],Game_Action['prototype'][_0x2bbd55(0x526)]=function(){const _0x43b665=_0x2bbd55;return this[_0x43b665(0x22c)]()&&!this['isCustomBattleScope']()?this['isForRandomBattleCore']():VisuMZ['BattleCore'][_0x43b665(0x725)][_0x43b665(0x4f4)](this);},Game_Action['prototype'][_0x2bbd55(0x4b9)]=function(){const _0x58b009=_0x2bbd55,_0x521431=this[_0x58b009(0x2d9)]()[_0x58b009(0x3ee)];return _0x521431[_0x58b009(0x87d)](/(?:RAND|RANDOM)/i);},VisuMZ[_0x2bbd55(0x46a)]['Game_Action_needsSelection']=Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x467)],Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x467)]=function(){const _0xd08889=_0x2bbd55;return this[_0xd08889(0x22c)]()&&!this[_0xd08889(0x863)]()?this[_0xd08889(0x205)]():VisuMZ[_0xd08889(0x46a)][_0xd08889(0x4a3)][_0xd08889(0x4f4)](this);},Game_Action['prototype'][_0x2bbd55(0x205)]=function(){const _0x1dff9a=_0x2bbd55,_0x7a8aea=this['item']()[_0x1dff9a(0x3ee)];if(_0x7a8aea[_0x1dff9a(0x87d)](/RANDOM/i))return![];return VisuMZ['BattleCore'][_0x1dff9a(0x4a3)][_0x1dff9a(0x4f4)](this);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x2c1)]=Game_Action['prototype'][_0x2bbd55(0x1f1)],Game_Action['prototype'][_0x2bbd55(0x1f1)]=function(){const _0x8201ab=_0x2bbd55;let _0x377081=[];return this['isBattleCoreTargetScope']()?_0x377081=this[_0x8201ab(0x4d7)]():_0x377081=VisuMZ['BattleCore']['Game_Action_makeTargets'][_0x8201ab(0x4f4)](this),_0x377081=this[_0x8201ab(0x252)](_0x377081),_0x377081;},Game_Action['prototype'][_0x2bbd55(0x4d7)]=function(){const _0x275a1d=_0x2bbd55;let _0x30ffb5=[];const _0x241348=String(this[_0x275a1d(0x2d9)]()['scope']),_0x2d4903=VisuMZ[_0x275a1d(0x46a)][_0x275a1d(0x2f9)](this[_0x275a1d(0x2d9)](),_0x275a1d(0x846));if(VisuMZ['BattleCore']['JS'][_0x2d4903]){const _0x362e46=VisuMZ[_0x275a1d(0x46a)]['createKeyJS'](this[_0x275a1d(0x2d9)](),_0x275a1d(0x846));return _0x30ffb5=VisuMZ[_0x275a1d(0x46a)]['JS'][_0x362e46][_0x275a1d(0x4f4)](this,this[_0x275a1d(0x803)](),_0x30ffb5),this['repeatTargets'](_0x30ffb5);}if(_0x241348[_0x275a1d(0x87d)](/(\d+) RANDOM ANY/i)){let _0x535c9b=Number(RegExp['$1']);while(_0x535c9b--){const _0x1f73d2=Math[_0x275a1d(0x6cb)](0x2)===0x0?this[_0x275a1d(0x1f3)]():this['friendsUnit']();_0x30ffb5[_0x275a1d(0x786)](_0x1f73d2[_0x275a1d(0x4b7)]());}return this[_0x275a1d(0x323)](_0x30ffb5);}if(_0x241348[_0x275a1d(0x87d)](/(\d+) RANDOM (?:ENEMY|ENEMIES|FOE|FOES)/i)){let _0xe3ffc2=Number(RegExp['$1']);while(_0xe3ffc2--){_0x30ffb5[_0x275a1d(0x786)](this['opponentsUnit']()[_0x275a1d(0x4b7)]());}return this[_0x275a1d(0x323)](_0x30ffb5);}if(_0x241348['match'](/(\d+) RANDOM (?:ALLY|ALLIES|FRIEND|FRIENDS)/i)){let _0x20402e=Number(RegExp['$1']);while(_0x20402e--){_0x30ffb5[_0x275a1d(0x786)](this[_0x275a1d(0x47a)]()[_0x275a1d(0x4b7)]());}return this[_0x275a1d(0x323)](_0x30ffb5);}if(_0x241348[_0x275a1d(0x87d)](/ALL (?:ALLY|ALLIES|FRIEND|FRIENDS) (?:BUT|EXCEPT) (?:USER|SELF)/i))return _0x30ffb5['push'](...this['friendsUnit']()[_0x275a1d(0x1ee)]()[_0x275a1d(0x11f)](_0x40cd44=>_0x40cd44!==this[_0x275a1d(0x803)]())),this[_0x275a1d(0x323)](_0x30ffb5);return VisuMZ[_0x275a1d(0x46a)]['Game_Action_makeTargets'][_0x275a1d(0x4f4)](this);},Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x62b)]=function(_0x562a83){const _0x916748=_0x2bbd55,_0x39df78=[];for(let _0x30333b=0x0;_0x30333b<this[_0x916748(0x182)]();_0x30333b++){_0x39df78[_0x916748(0x786)](_0x562a83['trueRandomTarget']());}return _0x39df78;},Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x252)]=function(_0x142719){const _0xd8d0d=_0x2bbd55;if(!this[_0xd8d0d(0x2d9)]())return _0x142719;const _0x5f3d13=this[_0xd8d0d(0x2d9)]()[_0xd8d0d(0x11b)];return _0x142719;},VisuMZ['BattleCore'][_0x2bbd55(0x875)]=Game_Action['prototype'][_0x2bbd55(0x173)],Game_Action['prototype'][_0x2bbd55(0x173)]=function(_0x5f1578,_0xfa2941){const _0x3bb2b5=_0x2bbd55,_0x1992ba=_0x5f1578['isImmortal']();this[_0x3bb2b5(0x803)]()[_0x3bb2b5(0x5c1)]()[_0x3bb2b5(0x42f)](_0x5f1578['deathStateId']())&&_0x5f1578['setImmortal'](![]),VisuMZ[_0x3bb2b5(0x46a)][_0x3bb2b5(0x875)][_0x3bb2b5(0x4f4)](this,_0x5f1578,_0xfa2941),_0x5f1578['setImmortal'](_0x1992ba);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x119)]=Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x23d)],Game_Action[_0x2bbd55(0x5d7)]['itemEffectAddNormalState']=function(_0x46cf48,_0x42b21c){const _0x402fd3=_0x2bbd55,_0x524e8d=_0x46cf48[_0x402fd3(0x387)]();_0x42b21c[_0x402fd3(0x129)]===_0x46cf48[_0x402fd3(0x2f8)]()&&_0x46cf48[_0x402fd3(0x807)](![]),VisuMZ['BattleCore'][_0x402fd3(0x119)]['call'](this,_0x46cf48,_0x42b21c),_0x46cf48[_0x402fd3(0x807)](_0x524e8d);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x833)]=Game_Action[_0x2bbd55(0x5d7)]['applyGlobal'],Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x145)]=function(){const _0x36b52d=_0x2bbd55;VisuMZ[_0x36b52d(0x46a)][_0x36b52d(0x833)][_0x36b52d(0x4f4)](this),this[_0x36b52d(0x5cb)]();},Game_Action[_0x2bbd55(0x5d7)][_0x2bbd55(0x5cb)]=function(){const _0x5278b8=_0x2bbd55;if(!SceneManager[_0x5278b8(0xfb)]())return;const _0xe5e2f1=/<COMMON (?:EVENT|EVENTS):[ ](.*)>/gi,_0x44106e=this[_0x5278b8(0x2d9)]()[_0x5278b8(0x11b)][_0x5278b8(0x87d)](_0xe5e2f1);if(_0x44106e)for(const _0x59bbe3 of _0x44106e){if(!_0x59bbe3)continue;_0x59bbe3['match'](_0xe5e2f1);const _0x320904=String(RegExp['$1'])[_0x5278b8(0x680)](',')[_0x5278b8(0x28f)](_0x3cb438=>String(_0x3cb438)[_0x5278b8(0x692)]()),_0x39338f=_0x320904[_0x5278b8(0x28f)](_0x1f9657=>DataManager[_0x5278b8(0x623)](_0x1f9657));for(const _0x4e97eb of _0x39338f){const _0x96db92=$dataCommonEvents[_0x4e97eb];_0x96db92&&$gameTemp[_0x5278b8(0x540)](_0x4e97eb);}}},DataManager['getCommonEventIdWithName']=function(_0x30d631){const _0x19a47a=_0x2bbd55;_0x30d631=_0x30d631[_0x19a47a(0x6d4)]()['trim'](),this[_0x19a47a(0x272)]=this[_0x19a47a(0x272)]||{};if(this[_0x19a47a(0x272)][_0x30d631])return this[_0x19a47a(0x272)][_0x30d631];for(const _0x402f63 of $dataCommonEvents){if(!_0x402f63)continue;let _0x306562=_0x402f63[_0x19a47a(0x485)];_0x306562=_0x306562[_0x19a47a(0x830)](/\x1I\[(\d+)\]/gi,''),_0x306562=_0x306562[_0x19a47a(0x830)](/\\I\[(\d+)\]/gi,''),this[_0x19a47a(0x272)][_0x306562[_0x19a47a(0x6d4)]()[_0x19a47a(0x692)]()]=_0x402f63['id'];}return this[_0x19a47a(0x272)][_0x30d631]||0x0;},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x588)]=Game_BattlerBase[_0x2bbd55(0x5d7)][_0x2bbd55(0x2e9)],Game_BattlerBase['prototype'][_0x2bbd55(0x2e9)]=function(){const _0x5ed725=_0x2bbd55;VisuMZ['BattleCore'][_0x5ed725(0x588)][_0x5ed725(0x4f4)](this),this[_0x5ed725(0x23e)]();},Game_BattlerBase[_0x2bbd55(0x5d7)][_0x2bbd55(0x23e)]=function(){const _0x573570=_0x2bbd55;this[_0x573570(0x243)]=![];},VisuMZ[_0x2bbd55(0x46a)]['Game_BattlerBase_refresh']=Game_BattlerBase['prototype'][_0x2bbd55(0x3c3)],Game_BattlerBase[_0x2bbd55(0x5d7)][_0x2bbd55(0x3c3)]=function(){const _0x249b68=_0x2bbd55;this[_0x249b68(0x72b)]={},VisuMZ[_0x249b68(0x46a)][_0x249b68(0x6ac)][_0x249b68(0x4f4)](this);},Game_BattlerBase['prototype'][_0x2bbd55(0x722)]=function(_0x1d3403){const _0x64672f=_0x2bbd55;return this[_0x64672f(0x72b)]=this[_0x64672f(0x72b)]||{},this[_0x64672f(0x72b)][_0x1d3403]!==undefined;},Game_BattlerBase[_0x2bbd55(0x5d7)][_0x2bbd55(0x69c)]=function(){const _0x3e962a=_0x2bbd55;if(this[_0x3e962a(0x72b)][_0x3e962a(0x69c)]!==undefined)return this[_0x3e962a(0x72b)][_0x3e962a(0x69c)];const _0x135a00=/<DAMAGE CAP:[ ](\d+)>/i,_0x58307e=this[_0x3e962a(0x53c)]()[_0x3e962a(0x28f)](_0x40fcb0=>_0x40fcb0&&_0x40fcb0[_0x3e962a(0x11b)]['match'](_0x135a00)?Number(RegExp['$1']):0x0);let _0x2ea796=_0x58307e[_0x3e962a(0x5cf)]>0x0?Math['max'](..._0x58307e):0x0;if(_0x2ea796<=0x0)_0x2ea796=VisuMZ[_0x3e962a(0x46a)][_0x3e962a(0x55b)]['Damage'][_0x3e962a(0x5cc)];return this[_0x3e962a(0x72b)][_0x3e962a(0x69c)]=_0x2ea796,this[_0x3e962a(0x72b)]['hardDamageCap'];},Game_BattlerBase[_0x2bbd55(0x5d7)]['softDamageCapRate']=function(){const _0x391726=_0x2bbd55;if(this[_0x391726(0x72b)]['softDamageCap']!==undefined)return this[_0x391726(0x72b)][_0x391726(0x316)];let _0xfd8a51=VisuMZ[_0x391726(0x46a)][_0x391726(0x55b)][_0x391726(0x14a)]['DefaultSoftCap'];const _0x2b050f=/<SOFT DAMAGE CAP:[ ]([\+\-]\d+)([%％])>/i,_0x5efcda=this[_0x391726(0x53c)]()[_0x391726(0x28f)](_0x2f23ed=>_0x2f23ed&&_0x2f23ed[_0x391726(0x11b)][_0x391726(0x87d)](_0x2b050f)?Number(RegExp['$1'])/0x64:0x0);return _0xfd8a51=_0x5efcda[_0x391726(0x37e)]((_0x31e89d,_0x8c3241)=>_0x31e89d+_0x8c3241,_0xfd8a51),this[_0x391726(0x72b)]['softDamageCap']=_0xfd8a51,this['_cache'][_0x391726(0x316)][_0x391726(0x488)](0.01,0x1);},VisuMZ['BattleCore'][_0x2bbd55(0x26c)]=Game_BattlerBase[_0x2bbd55(0x5d7)][_0x2bbd55(0x84e)],Game_BattlerBase['prototype'][_0x2bbd55(0x84e)]=function(){const _0x46e150=_0x2bbd55;VisuMZ[_0x46e150(0x46a)][_0x46e150(0x26c)][_0x46e150(0x4f4)](this),SceneManager['isSceneBattle']()&&this[_0x46e150(0x4ac)](_0x46e150(0x2a1));},Game_BattlerBase[_0x2bbd55(0x5d7)][_0x2bbd55(0x6ae)]=function(){const _0x7da67f=_0x2bbd55;if(!SceneManager[_0x7da67f(0xfb)]())return null;if(!SceneManager[_0x7da67f(0x750)][_0x7da67f(0x54a)])return null;return SceneManager['_scene']['_spriteset'][_0x7da67f(0x719)](this);},Game_BattlerBase['prototype'][_0x2bbd55(0x45b)]=function(){const _0x3de1e5=_0x2bbd55;return VisuMZ['BattleCore'][_0x3de1e5(0x55b)][_0x3de1e5(0x843)][_0x3de1e5(0x22b)];},Game_BattlerBase[_0x2bbd55(0x5d7)][_0x2bbd55(0x42a)]=function(){const _0x49c236=_0x2bbd55;return VisuMZ[_0x49c236(0x46a)][_0x49c236(0x55b)][_0x49c236(0x843)][_0x49c236(0x3d9)];},Game_BattlerBase[_0x2bbd55(0x5d7)][_0x2bbd55(0x46b)]=function(){const _0x21904b=_0x2bbd55;return this[_0x21904b(0x101)]&&this[_0x21904b(0x101)]()?VisuMZ[_0x21904b(0x46a)]['Settings'][_0x21904b(0x843)][_0x21904b(0x3ac)]:VisuMZ[_0x21904b(0x46a)][_0x21904b(0x55b)][_0x21904b(0x37f)][_0x21904b(0x3ac)];},Game_BattlerBase[_0x2bbd55(0x5d7)]['battlerSmoothImage']=function(){return!![];},Game_BattlerBase[_0x2bbd55(0x5d7)][_0x2bbd55(0x3f9)]=function(){return 0x0;},Game_BattlerBase['prototype'][_0x2bbd55(0x510)]=function(){return 0x0;},Game_BattlerBase[_0x2bbd55(0x5d7)][_0x2bbd55(0x25b)]=function(_0x4d3bc0){const _0x58780d=_0x2bbd55;if(!_0x4d3bc0)return 0x0;let _0x143790=0x0;const _0x6e5c25=_0x4d3bc0[_0x58780d(0x11b)];return _0x6e5c25[_0x58780d(0x87d)](/<BATTLE UI OFFSET X:[ ]([\+\-]\d+)>/i)&&(_0x143790+=Number(RegExp['$1'])),_0x6e5c25[_0x58780d(0x87d)](/<BATTLE UI OFFSET:[ ]([\+\-]\d+),[ ]([\+\-]\d+)>/i)&&(_0x143790+=Number(RegExp['$1'])),_0x143790;},Game_BattlerBase['prototype'][_0x2bbd55(0x105)]=function(_0x40bc1c){const _0x349ee6=_0x2bbd55;if(!_0x40bc1c)return 0x0;let _0x8ee938=0x0;const _0x2ac218=_0x40bc1c[_0x349ee6(0x11b)];return _0x2ac218[_0x349ee6(0x87d)](/<BATTLE UI OFFSET Y:[ ]([\+\-]\d+)>/i)&&(_0x8ee938+=Number(RegExp['$1'])),_0x2ac218[_0x349ee6(0x87d)](/<BATTLE UI OFFSET:[ ]([\+\-]\d+),[ ]([\+\-]\d+)>/i)&&(_0x8ee938+=Number(RegExp['$2'])),_0x8ee938;},VisuMZ['BattleCore'][_0x2bbd55(0x46c)]=Game_BattlerBase[_0x2bbd55(0x5d7)][_0x2bbd55(0x72e)],Game_BattlerBase[_0x2bbd55(0x5d7)][_0x2bbd55(0x72e)]=function(_0x4b5bf5){const _0x31847b=_0x2bbd55;if(_0x4b5bf5===this[_0x31847b(0x2f8)]()&&this[_0x31847b(0x387)]())return!![];return VisuMZ['BattleCore'][_0x31847b(0x46c)][_0x31847b(0x4f4)](this,_0x4b5bf5);},Game_BattlerBase[_0x2bbd55(0x5d7)][_0x2bbd55(0x387)]=function(){const _0x1fa7d4=_0x2bbd55;return this[_0x1fa7d4(0x243)];},Game_BattlerBase['prototype']['setImmortal']=function(_0x366a3b){const _0x585c11=_0x2bbd55;_0x366a3b?this[_0x585c11(0x5e3)]():this['removeImmortal']();},Game_BattlerBase['prototype'][_0x2bbd55(0x5e3)]=function(){const _0x65826f=_0x2bbd55;if(this[_0x65826f(0x81e)]())return;this['_immortal']=!![];},Game_BattlerBase['prototype'][_0x2bbd55(0x7ab)]=function(){const _0x55144f=_0x2bbd55,_0x19bccd=this[_0x55144f(0x61f)]();this['_immortal']=![],this[_0x55144f(0x3c3)](),this['isDead']()&&_0x19bccd&&(this[_0x55144f(0x7e1)](),this[_0x55144f(0x2e0)]());},VisuMZ[_0x2bbd55(0x46a)]['Game_BattlerBase_canAttack']=Game_BattlerBase[_0x2bbd55(0x5d7)][_0x2bbd55(0x826)],Game_BattlerBase['prototype']['canAttack']=function(){const _0x283633=_0x2bbd55;if(!this[_0x283633(0x14d)]())return![];return VisuMZ[_0x283633(0x46a)]['Game_BattlerBase_canAttack'][_0x283633(0x4f4)](this);},Game_BattlerBase[_0x2bbd55(0x5d7)][_0x2bbd55(0x14d)]=function(){const _0x5e0d6d=_0x2bbd55;for(const _0x37794a of this['traitObjects']()){if(!_0x37794a)continue;if(_0x37794a[_0x5e0d6d(0x11b)][_0x5e0d6d(0x87d)](/<(?:ATTACK SEAL|SEAL ATTACK)>/i))return![];}return!![];},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x579)]=Game_BattlerBase[_0x2bbd55(0x5d7)][_0x2bbd55(0x5f8)],Game_BattlerBase[_0x2bbd55(0x5d7)][_0x2bbd55(0x5f8)]=function(){const _0x57eee3=_0x2bbd55;if(!this[_0x57eee3(0x397)]())return![];return VisuMZ[_0x57eee3(0x46a)][_0x57eee3(0x579)][_0x57eee3(0x4f4)](this);},Game_BattlerBase['prototype'][_0x2bbd55(0x397)]=function(){const _0x157cce=_0x2bbd55;for(const _0x30c520 of this[_0x157cce(0x53c)]()){if(!_0x30c520)continue;if(_0x30c520[_0x157cce(0x11b)][_0x157cce(0x87d)](/<(?:GUARD SEAL|SEAL GUARD)>/i))return![];}return!![];},Game_BattlerBase['prototype'][_0x2bbd55(0x1b4)]=function(){const _0x53e8c2=_0x2bbd55;for(const _0x214219 of this[_0x53e8c2(0x53c)]()){if(!_0x214219)continue;if(_0x214219[_0x53e8c2(0x11b)][_0x53e8c2(0x87d)](/<(?:ITEM SEAL|SEAL ITEM|SEAL ITEMS)>/i))return![];}return!![];},VisuMZ[_0x2bbd55(0x46a)]['Game_Battler_regenerateAll']=Game_Battler['prototype'][_0x2bbd55(0x68e)],Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x68e)]=function(){const _0x413e54=_0x2bbd55;if(SceneManager[_0x413e54(0xfb)]()&&$gameTroop[_0x413e54(0x303)]()<=0x0)return;this['processBattleCoreJS'](_0x413e54(0x6b5)),VisuMZ[_0x413e54(0x46a)]['Game_Battler_regenerateAll']['call'](this),this[_0x413e54(0x855)](),this[_0x413e54(0x66f)](_0x413e54(0x746));},Game_Battler['prototype'][_0x2bbd55(0x855)]=function(){const _0x306e42=_0x2bbd55;if(SceneManager[_0x306e42(0xfb)]())for(const _0x3cf820 of this[_0x306e42(0x53c)]()){if(!_0x3cf820)continue;this[_0x306e42(0x460)](_0x3cf820);}},Game_Battler[_0x2bbd55(0x5d7)]['onRegeneratePlayStateAnimation']=function(_0x594351){const _0x25d507=_0x2bbd55;if(!Imported[_0x25d507(0x7c3)])return;if(!SceneManager[_0x25d507(0xfb)]())return;if(this['isDead']())return;if(this[_0x25d507(0x2d4)]())return;if(_0x594351['note'][_0x25d507(0x87d)](/<(?:REGENERATE|REGEN|DEGEN|DOT|SLIP)[ ]ANIMATION:[ ](\d+)>/i)){const _0x5d5d06=Number(RegExp['$1']);$gameTemp[_0x25d507(0x349)]([this],_0x5d5d06,![],![]);}},VisuMZ['BattleCore'][_0x2bbd55(0x242)]=Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x6b0)],Game_Battler[_0x2bbd55(0x5d7)]['startTpbTurn']=function(){const _0x47c16a=_0x2bbd55;this[_0x47c16a(0x66f)]('PreStartTurnJS'),VisuMZ[_0x47c16a(0x46a)][_0x47c16a(0x242)][_0x47c16a(0x4f4)](this),this['processBattleCoreJS'](_0x47c16a(0x4b2));},VisuMZ['BattleCore'][_0x2bbd55(0x4f9)]=Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x834)],Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x834)]=function(){const _0x5abc19=_0x2bbd55;this[_0x5abc19(0x66f)](_0x5abc19(0x62a)),VisuMZ[_0x5abc19(0x46a)][_0x5abc19(0x4f9)][_0x5abc19(0x4f4)](this),this['processBattleCoreJS'](_0x5abc19(0x5cd));},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x66f)]=function(_0x135254){const _0x1d7669=_0x2bbd55,_0x5845e7=VisuMZ[_0x1d7669(0x46a)][_0x1d7669(0x55b)][_0x1d7669(0x508)];if(_0x5845e7[_0x135254])_0x5845e7[_0x135254]['call'](this);for(const _0x35724f of this[_0x1d7669(0x53c)]()){if(!_0x35724f)continue;key=VisuMZ[_0x1d7669(0x46a)][_0x1d7669(0x2f9)](_0x35724f,_0x135254),VisuMZ[_0x1d7669(0x46a)]['JS'][key]&&VisuMZ[_0x1d7669(0x46a)]['JS'][key][_0x1d7669(0x4f4)](this,this,this,_0x35724f,0x0);}},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x461)]=function(){const _0x23fa0c=_0x2bbd55;return VisuMZ[_0x23fa0c(0x46a)][_0x23fa0c(0x55b)][_0x23fa0c(0x843)][_0x23fa0c(0x177)]||![];},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x327)]=function(){const _0x31e16b=_0x2bbd55;if(this[_0x31e16b(0x50d)]()){if(this['chantStyle']()){if(this[_0x31e16b(0x3ce)]['some'](_0x1920e6=>_0x1920e6['item']()&&_0x1920e6[_0x31e16b(0x505)]()))return!![];}else{if(this[_0x31e16b(0x3ce)]['some'](_0x1ecbd4=>_0x1ecbd4['item']()&&_0x1ecbd4['isMagicSkill']()))return!![];}}if(BattleManager[_0x31e16b(0x80f)]()&&this[_0x31e16b(0x128)]==='casting')return this[_0x31e16b(0x461)]()?this[_0x31e16b(0x824)]()&&this[_0x31e16b(0x824)]()['item']()&&this[_0x31e16b(0x824)]()['isMagical']():this[_0x31e16b(0x824)]()&&this['currentAction']()[_0x31e16b(0x2d9)]()&&this[_0x31e16b(0x824)]()[_0x31e16b(0x139)]();return![];},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x35e)]=function(){const _0x2fb998=_0x2bbd55;if(BattleManager[_0x2fb998(0x80f)]()&&this[_0x2fb998(0x128)]===_0x2fb998(0x39b))return this[_0x2fb998(0x461)]()?this[_0x2fb998(0x824)]()&&this['currentAction']()[_0x2fb998(0x2d9)]()&&!this['currentAction']()[_0x2fb998(0x505)]():this[_0x2fb998(0x824)]()&&this[_0x2fb998(0x824)]()[_0x2fb998(0x2d9)]()&&!this[_0x2fb998(0x824)]()[_0x2fb998(0x139)]();return![];},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x74a)]=Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x850)],Game_Battler['prototype']['clearDamagePopup']=function(){const _0x43996d=_0x2bbd55;VisuMZ['BattleCore'][_0x43996d(0x74a)][_0x43996d(0x4f4)](this),this[_0x43996d(0x82f)]=[];},Game_Battler['prototype'][_0x2bbd55(0x256)]=function(){const _0x577296=_0x2bbd55;if(!this['_damagePopupArray'])this[_0x577296(0x850)]();return this[_0x577296(0x82f)]['length']>0x0;},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x573)]=function(){const _0x2ae5b4=_0x2bbd55;if(!SceneManager[_0x2ae5b4(0xfb)]())return;if(!this['_damagePopupArray'])this['clearDamagePopup']();this['createSeparateDamagePopups']();const _0xa6217a=this[_0x2ae5b4(0x6ae)]();if(_0xa6217a)_0xa6217a[_0x2ae5b4(0x17a)]();},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x3af)]=function(){const _0x3dab7b=_0x2bbd55,_0x4db5b5=this['result']();if(_0x4db5b5[_0x3dab7b(0x478)]||_0x4db5b5[_0x3dab7b(0x134)]){const _0x3b2522=JsonEx['makeDeepCopy'](_0x4db5b5);_0x3b2522['hpAffected']=![],_0x3b2522[_0x3dab7b(0x200)]=0x0,this[_0x3dab7b(0x82f)][_0x3dab7b(0x786)](_0x3b2522);}if(_0x4db5b5[_0x3dab7b(0x4da)]){const _0x15a84c=JsonEx[_0x3dab7b(0x878)](_0x4db5b5);_0x15a84c[_0x3dab7b(0x478)]=![],_0x15a84c[_0x3dab7b(0x134)]=![],_0x15a84c[_0x3dab7b(0x200)]=0x0,this[_0x3dab7b(0x82f)]['push'](_0x15a84c);}if(_0x4db5b5[_0x3dab7b(0x200)]!==0x0){const _0x44adf6=JsonEx[_0x3dab7b(0x878)](_0x4db5b5);_0x44adf6['missed']=![],_0x44adf6[_0x3dab7b(0x134)]=![],_0x44adf6[_0x3dab7b(0x4da)]=![],this['_damagePopupArray']['push'](_0x44adf6);}},Game_Battler[_0x2bbd55(0x5d7)]['getNextDamagePopup']=function(){const _0x355831=_0x2bbd55;if(!this['_damagePopupArray'])this[_0x355831(0x850)]();return VisuMZ['BattleCore'][_0x355831(0x55b)]['Damage'][_0x355831(0x3c7)]?this[_0x355831(0x82f)][_0x355831(0x2a6)]():this[_0x355831(0x82f)][_0x355831(0x470)]();},Game_Battler['prototype'][_0x2bbd55(0x116)]=function(_0x47726a,_0x525ccc){const _0x563463=_0x2bbd55;if(!SceneManager[_0x563463(0xfb)]())return;if(!this[_0x563463(0x6ae)]())return;if(_0x47726a[_0x563463(0x5cf)]<=0x0)return;_0x525ccc=_0x525ccc||{},_0x525ccc[_0x563463(0x6c2)]=_0x525ccc[_0x563463(0x6c2)]||_0x563463(0x653),_0x525ccc[_0x563463(0x5fd)]=_0x525ccc[_0x563463(0x5fd)]||[0x0,0x0,0x0,0x0],_0x525ccc[_0x563463(0x506)]=_0x525ccc[_0x563463(0x506)]||0x0,this['battler']()[_0x563463(0x116)](_0x47726a,_0x525ccc);},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x162)]=function(_0xa4095f,_0xc611f1,_0x2bd91f){const _0x1c80f2=_0x2bbd55;if(!SceneManager['isSceneBattle']())return;if(!this[_0x1c80f2(0x6ae)]())return;if(_0xc611f1['length']<=0x0)return;_0x2bd91f=_0x2bd91f||{},_0x2bd91f['textColor']=_0x2bd91f['textColor']||'#ffffff',_0x2bd91f['flashColor']=_0x2bd91f[_0x1c80f2(0x5fd)]||[0x0,0x0,0x0,0x0],_0x2bd91f[_0x1c80f2(0x506)]=_0x2bd91f[_0x1c80f2(0x506)]||0x0,this[_0x1c80f2(0x6ae)]()['setupIconTextPopup'](_0xa4095f,_0xc611f1,_0x2bd91f);},Game_Battler['prototype'][_0x2bbd55(0x879)]=function(){const _0x487e0a=_0x2bbd55;if(this[_0x487e0a(0x2d4)]())return![];if(this['isAlive']()&&this[_0x487e0a(0x7ff)]())return!![];if(this[_0x487e0a(0x2ba)]()&&this[_0x487e0a(0x3d7)]()){if(this['isDead']()&&this[_0x487e0a(0x6ef)]())return![];}else{if(this['isDead']())return![];}return!![];},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x1f8)]=Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x55c)],Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x55c)]=function(){const _0x30e150=_0x2bbd55;VisuMZ['BattleCore'][_0x30e150(0x1f8)][_0x30e150(0x4f4)](this),this[_0x30e150(0x4b8)]();},Game_Battler['prototype'][_0x2bbd55(0x15b)]=function(){return!![];},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x2c3)]=function(){return![];},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x188)]=Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x50f)],Game_Battler['prototype'][_0x2bbd55(0x50f)]=function(_0x6fd442){const _0x9129be=_0x2bbd55;VisuMZ[_0x9129be(0x46a)]['Game_Battler_onBattleStart'][_0x9129be(0x4f4)](this,_0x6fd442),this[_0x9129be(0x704)](_0x6fd442);},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x704)]=function(_0xf47398){this['setBattlerFlip'](![]);},VisuMZ['BattleCore'][_0x2bbd55(0x820)]=Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x86b)],Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x86b)]=function(_0x389637){const _0x1a5635=_0x2bbd55;VisuMZ[_0x1a5635(0x46a)]['Game_Battler_performActionStart'][_0x1a5635(0x4f4)](this,_0x389637);if(!_0x389637[_0x1a5635(0x59f)]()){const _0x3441c1=this[_0x1a5635(0x6ae)]();if(_0x3441c1)_0x3441c1[_0x1a5635(0x63c)]();}this[_0x1a5635(0x715)](![]);},Game_Battler['prototype'][_0x2bbd55(0x82d)]=function(){const _0x356bfe=_0x2bbd55,_0x5c0cd0=this[_0x356bfe(0x65c)];this[_0x356bfe(0x65c)]=![];if(BattleManager[_0x356bfe(0x6c0)]()&&this[_0x356bfe(0x788)]()){const _0x4ef510=this[_0x356bfe(0x6ae)]();if(_0x4ef510&&_0x5c0cd0)_0x4ef510[_0x356bfe(0x63c)]();return;}const _0x4cd172=this[_0x356bfe(0x6ae)]();if(_0x4cd172)_0x4cd172[_0x356bfe(0x38d)]();this[_0x356bfe(0x715)](![]),this[_0x356bfe(0x2e0)]();},Game_Battler['prototype'][_0x2bbd55(0x3df)]=function(_0x453112){const _0x509427=_0x2bbd55;if(_0x453112[_0x509427(0x45f)]())this[_0x509427(0x59d)]();else{if(_0x453112[_0x509427(0x59f)]())this[_0x509427(0x4ac)](_0x509427(0x7ad));else{if(_0x453112['isMagical']())this[_0x509427(0x4ac)](_0x509427(0x66c));else{if(_0x453112[_0x509427(0x375)]())_0x453112[_0x509427(0x2d9)]()[_0x509427(0x4e0)][_0x509427(0x837)]>0x0?this['performAttack']():this[_0x509427(0x4ac)]('skill');else _0x453112['isItem']()&&this[_0x509427(0x4ac)](_0x509427(0x2d9));}}}},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x131)]=function(){const _0x1d4e35=_0x2bbd55;return $dataSystem[_0x1d4e35(0x4ee)][0x0];},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x524)]=function(){const _0x146873=_0x2bbd55,_0x9687d3=this['getAttackMotion']();return _0x9687d3?_0x9687d3[_0x146873(0x5b1)]:0x0;},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x5ec)]=function(_0x566d92){const _0x4ffe4c=_0x2bbd55;if(!$gameSystem[_0x4ffe4c(0x2e6)]())return;const _0x5dc197=this[_0x4ffe4c(0x6ae)](),_0x35bc26=_0x566d92[_0x4ffe4c(0x6ae)]();if(!_0x5dc197||!_0x35bc26)return;const _0x49484c=_0x35bc26[_0x4ffe4c(0x34b)],_0x37ceb2=_0x35bc26['_baseY'];this[_0x4ffe4c(0x620)](_0x49484c,_0x37ceb2,0x0,![],_0x4ffe4c(0x483),-0x1),_0x5dc197[_0x4ffe4c(0x73c)]();const _0x43daa8=VisuMZ[_0x4ffe4c(0x46a)][_0x4ffe4c(0x55b)]['ActionSequence'];let _0x1cc421=(_0x35bc26[_0x4ffe4c(0x802)]+_0x5dc197['width'])/0x2;_0x1cc421*=this['isActor']()?0x1:-0x1;let _0xd3e45d=_0x43daa8[_0x4ffe4c(0x79a)]*(this[_0x4ffe4c(0x101)]()?0x1:-0x1);_0x566d92[_0x4ffe4c(0x1e5)](_0x1cc421,_0xd3e45d,0x0,![],'Linear'),_0x35bc26['updatePosition']();},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x4ac)]=function(_0x4ee109){const _0x1c0c4b=_0x2bbd55;if(SceneManager[_0x1c0c4b(0xfb)]()){const _0x5ab3cb=this['battler']();_0x5ab3cb&&(_0x5ab3cb[_0x1c0c4b(0x13e)](_0x4ee109),['swing',_0x1c0c4b(0x4ff),_0x1c0c4b(0x6d0)][_0x1c0c4b(0x42f)](_0x4ee109)&&this[_0x1c0c4b(0x514)]());}this[_0x1c0c4b(0x4b8)]();},Game_Battler['prototype'][_0x2bbd55(0x514)]=function(){},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x3fb)]=function(_0x8794e1){const _0x108e82=_0x2bbd55;if(SceneManager['isSceneBattle']()){const _0x178177=this['battler']();if(_0x178177)_0x178177[_0x108e82(0x63d)](_0x8794e1);}},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x112)]=function(){const _0x13ff24=_0x2bbd55;if(SceneManager[_0x13ff24(0xfb)]()){const _0x568756=this['getAttackWeaponAnimationId']();this[_0x13ff24(0x3fb)](_0x568756);}},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x5a5)]=function(_0x30aea4,_0x382165){const _0xadbdf1=_0x2bbd55;if(!_0x30aea4)return;if(!_0x30aea4[_0xadbdf1(0x2d9)]())return;if(_0x30aea4[_0xadbdf1(0x45f)]())return;if(_0x30aea4[_0xadbdf1(0x59f)]())return;if(_0x30aea4[_0xadbdf1(0x731)]())return;let _0x533030=0x0;const _0x3ccbf8=VisuMZ[_0xadbdf1(0x46a)][_0xadbdf1(0x55b)][_0xadbdf1(0x2d2)],_0x385404=_0x30aea4['item']()[_0xadbdf1(0x11b)];if(_0x385404['match'](/<CAST ANIMATION: (\d+)>/i))_0x533030=Number(RegExp['$1']);else{if(_0x385404[_0xadbdf1(0x87d)](/<NO CAST ANIMATION>/i))return;else{if(_0x30aea4[_0xadbdf1(0x6aa)]())_0x533030=_0x3ccbf8[_0xadbdf1(0x3a9)];else{if(_0x30aea4[_0xadbdf1(0x33c)]())_0x533030=_0x3ccbf8[_0xadbdf1(0x656)];else _0x30aea4[_0xadbdf1(0x505)]()&&(_0x533030=_0x3ccbf8[_0xadbdf1(0x35a)]);}}}_0x533030>0x0&&$gameTemp['requestAnimation']([this],_0x533030,!!_0x382165);},Game_Battler['prototype'][_0x2bbd55(0x2ae)]=function(){const _0x30aba0=_0x2bbd55;SoundManager[_0x30aba0(0x6a3)]();let _0x6b0157=VisuMZ[_0x30aba0(0x46a)]['Settings'][_0x30aba0(0x2d2)][_0x30aba0(0x609)];_0x6b0157>0x0&&$gameTemp[_0x30aba0(0x2e4)]([this],_0x6b0157);},VisuMZ['BattleCore'][_0x2bbd55(0x471)]=Game_Battler['prototype']['performDamage'],Game_Battler[_0x2bbd55(0x5d7)]['performDamage']=function(){const _0x2c10aa=_0x2bbd55;VisuMZ[_0x2c10aa(0x46a)][_0x2c10aa(0x471)]['call'](this),this[_0x2c10aa(0x2c9)]();},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x23a)]=Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x14c)],Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x14c)]=function(){const _0x30f59e=_0x2bbd55;VisuMZ[_0x30f59e(0x46a)][_0x30f59e(0x23a)][_0x30f59e(0x4f4)](this),this['performFlinch']();},VisuMZ['BattleCore'][_0x2bbd55(0x3aa)]=Game_Battler['prototype'][_0x2bbd55(0x1ab)],Game_Battler['prototype'][_0x2bbd55(0x1ab)]=function(){const _0x321e40=_0x2bbd55;VisuMZ[_0x321e40(0x46a)][_0x321e40(0x3aa)][_0x321e40(0x4f4)](this),this[_0x321e40(0x2c9)]();},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x2c9)]=function(){const _0x43af42=_0x2bbd55;if(!$gameSystem[_0x43af42(0x2e6)]())return;if(this[_0x43af42(0x65c)])return;this[_0x43af42(0x65c)]=!![];const _0x178f2d=this['battler']();if(_0x178f2d)_0x178f2d['stepFlinch']();},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x2e0)]=function(){const _0x38d5c8=_0x2bbd55;if(this[_0x38d5c8(0x81e)]()&&this[_0x38d5c8(0x79b)]!=='dead'){this[_0x38d5c8(0x4ac)](_0x38d5c8(0x2a1));return;}if(this[_0x38d5c8(0x81e)]()&&this[_0x38d5c8(0x79b)]===_0x38d5c8(0x2a1))return;if(!!this[_0x38d5c8(0x278)])return;if(this[_0x38d5c8(0x2ba)]()){if(!this['isDuringNonLoopingMotion']())this[_0x38d5c8(0x6ae)]()[_0x38d5c8(0x19d)]();this[_0x38d5c8(0x4b8)]();return;}if(this[_0x38d5c8(0x79b)]===_0x38d5c8(0x522))return;if(this[_0x38d5c8(0x79b)]===_0x38d5c8(0x78f)&&!BattleManager['isInputting']())return;if(this[_0x38d5c8(0x79b)]===_0x38d5c8(0x7ad)&&!BattleManager[_0x38d5c8(0x788)]())return;this[_0x38d5c8(0x55c)]();if(this[_0x38d5c8(0x6ae)]()&&BattleManager[_0x38d5c8(0x788)]()){this[_0x38d5c8(0x6ae)]()[_0x38d5c8(0x19d)](),this[_0x38d5c8(0x4b8)]();return;}},Game_Enemy['prototype'][_0x2bbd55(0x196)]=function(){const _0x28292b=_0x2bbd55;if(!this[_0x28292b(0x3d7)]())return![];const _0x4f275a=this[_0x28292b(0x6ae)]();if(!_0x4f275a)return![];const _0xd4dc3=_0x4f275a['_svBattlerSprite'];if(!_0xd4dc3)return![];const _0x100c1d=_0xd4dc3[_0x28292b(0x469)];return _0x100c1d&&!_0x100c1d[_0x28292b(0x801)];},Game_Battler[_0x2bbd55(0x5d7)]['isBattlerFlipped']=function(){return this['_isBattlerFlipped'];},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x715)]=function(_0x366bcd){const _0x5afd02=_0x2bbd55;if(!$gameSystem[_0x5afd02(0x2e6)]())return;this['_isBattlerFlipped']=_0x366bcd;const _0xd04556=this[_0x5afd02(0x6ae)]();if(_0xd04556)_0xd04556[_0x5afd02(0x211)]();},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x575)]=function(_0x36b538,_0x5dad9f,_0x2ea4df){const _0x3c4343=_0x2bbd55;if(!$gameSystem['isSideView']())return;const _0x17d97e=this[_0x3c4343(0x6ae)]();if(!_0x17d97e)return;if(_0x36b538===_0x17d97e[_0x3c4343(0x34b)])return;let _0x1747ee=![];if(this[_0x3c4343(0x101)]()){if(_0x36b538>_0x17d97e[_0x3c4343(0x34b)])_0x1747ee=!![];if(_0x36b538<_0x17d97e[_0x3c4343(0x34b)])_0x1747ee=![];}else{if(this[_0x3c4343(0x2ba)]()){if(_0x36b538>_0x17d97e[_0x3c4343(0x34b)])_0x1747ee=![];if(_0x36b538<_0x17d97e['_baseX'])_0x1747ee=!![];}};this[_0x3c4343(0x715)](_0x2ea4df?!_0x1747ee:_0x1747ee),_0x17d97e[_0x3c4343(0x211)]();},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x1e5)]=function(_0x297010,_0x2b7a59,_0x53111c,_0x47e1b3,_0x73e685){const _0x1457d4=_0x2bbd55;if(!$gameSystem[_0x1457d4(0x2e6)]())return;const _0x20b2c8=this[_0x1457d4(0x6ae)]();if(!_0x20b2c8)return;if(_0x47e1b3)this[_0x1457d4(0x575)](_0x297010+_0x20b2c8[_0x1457d4(0x34b)],_0x2b7a59+_0x20b2c8[_0x1457d4(0x71a)],![]);_0x297010+=_0x20b2c8[_0x1457d4(0x34b)]-_0x20b2c8[_0x1457d4(0x10d)],_0x2b7a59+=_0x20b2c8[_0x1457d4(0x71a)]-_0x20b2c8[_0x1457d4(0x59e)],_0x20b2c8[_0x1457d4(0x1b1)](_0x297010,_0x2b7a59,_0x53111c);if(Imported['VisuMZ_0_CoreEngine'])_0x20b2c8[_0x1457d4(0x533)](_0x73e685||_0x1457d4(0x483));},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x620)]=function(_0x32f313,_0x1dcfae,_0xa189a2,_0x2bb67e,_0x2b1dde,_0x5372a8){const _0x3ea0b0=_0x2bbd55;if(!$gameSystem[_0x3ea0b0(0x2e6)]())return;const _0x26924f=this[_0x3ea0b0(0x6ae)]();if(!_0x26924f)return;_0x5372a8=_0x5372a8||0x0;if(_0x5372a8>0x0){if(_0x26924f['_baseX']>_0x32f313)_0x32f313+=_0x26924f[_0x3ea0b0(0x802)]/0x2+_0x5372a8;if(_0x26924f[_0x3ea0b0(0x34b)]<_0x32f313)_0x32f313-=_0x26924f[_0x3ea0b0(0x802)]/0x2+_0x5372a8;}if(_0x2bb67e)this[_0x3ea0b0(0x575)](_0x32f313,_0x1dcfae,![]);_0x32f313-=_0x26924f[_0x3ea0b0(0x10d)],_0x1dcfae-=_0x26924f['_homeY'],_0x26924f[_0x3ea0b0(0x1b1)](_0x32f313,_0x1dcfae,_0xa189a2);if(Imported[_0x3ea0b0(0x7c3)])_0x26924f[_0x3ea0b0(0x533)](_0x2b1dde||_0x3ea0b0(0x483));},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x7bf)]=function(_0x409c00,_0x40274c,_0x4d46e1){const _0x4dea7c=_0x2bbd55;if(!$gameSystem['isSideView']())return;const _0xad46de=this[_0x4dea7c(0x6ae)]();if(!_0xad46de)return;_0xad46de[_0x4dea7c(0x84d)](_0x409c00,_0x40274c,_0x4d46e1);},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x216)]=function(_0x5a0c0a,_0x53788e){const _0x25968f=_0x2bbd55;if(!$gameSystem['isSideView']())return;const _0x431381=this[_0x25968f(0x6ae)]();if(!_0x431381)return;_0x431381[_0x25968f(0x4a2)](_0x5a0c0a,_0x53788e);},Game_Battler[_0x2bbd55(0x5d7)]['spinBattler']=function(_0x4ae9f1,_0x1794bd,_0x342702,_0x2e1bf6){const _0x4c05a3=_0x2bbd55;if(!$gameSystem[_0x4c05a3(0x2e6)]())return;const _0x54e6da=this['battler']();if(!_0x54e6da)return;_0x54e6da[_0x4c05a3(0x849)](_0x4ae9f1,_0x1794bd,_0x342702,_0x2e1bf6);},Game_Battler['prototype'][_0x2bbd55(0x3eb)]=function(_0x48d302,_0x487e1d,_0x52ee4d,_0x2e4810){const _0x21a424=_0x2bbd55;if(!$gameSystem[_0x21a424(0x2e6)]())return;const _0x212ac9=this[_0x21a424(0x6ae)]();if(!_0x212ac9)return;this[_0x21a424(0x101)]()&&(_0x48d302*=-0x1,_0x487e1d*=-0x1),_0x212ac9[_0x21a424(0x43f)](_0x48d302,_0x487e1d,_0x52ee4d,_0x2e4810);},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x717)]=function(_0x2a32c4,_0x346424,_0x22c01b,_0x1bd8ab){const _0x4bedd2=_0x2bbd55;if(!$gameSystem[_0x4bedd2(0x2e6)]())return;const _0x323c6b=this[_0x4bedd2(0x6ae)]();if(!_0x323c6b)return;_0x323c6b['startGrow'](_0x2a32c4,_0x346424,_0x22c01b,_0x1bd8ab);},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x51e)]=function(_0xdb96b1,_0x52ddbb,_0x5aa2a2){const _0x423b76=_0x2bbd55;if(!$gameSystem[_0x423b76(0x2e6)]())return;const _0x58d0c8=this[_0x423b76(0x6ae)]();if(!_0x58d0c8)return;_0x58d0c8[_0x423b76(0x30f)](_0xdb96b1,_0x52ddbb,_0x5aa2a2);},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x4b8)]=function(){const _0x1a6998=_0x2bbd55,_0x23afc0=!!this[_0x1a6998(0x278)];this[_0x1a6998(0x278)]=undefined,_0x23afc0&&(this[_0x1a6998(0x2e0)](),this['clearFreezeMotionForWeapons']());},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x12c)]=function(){const _0x343c6f=_0x2bbd55;if(!SceneManager[_0x343c6f(0xfb)]())return;const _0x38e8ae=this['battler']();if(!_0x38e8ae)return;let _0x141e1f=this[_0x343c6f(0x101)]()?_0x38e8ae[_0x343c6f(0x337)]:_0x38e8ae[_0x343c6f(0x1a9)]['_weaponSprite'];_0x141e1f&&_0x141e1f['setup'](0x0);},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x206)]=function(_0x3f1886,_0x496027,_0x459164){const _0x476a3e=_0x2bbd55;if(this[_0x476a3e(0x2ba)]()&&!this['hasSvBattler']())return;let _0x15fb5a=0x0,_0x42b005=0x0;_0x3f1886[_0x476a3e(0x87d)](/ATTACK[ ](\d+)/i)&&(_0x42b005=Number(RegExp['$1']),_0x42b005--);if(this[_0x476a3e(0x101)]()){const _0x269a9a=this['weapons']();_0x15fb5a=_0x269a9a[_0x42b005]?_0x269a9a[_0x42b005][_0x476a3e(0x593)]:0x0;}else this[_0x476a3e(0x2ba)]()&&(_0x15fb5a=this['svBattlerData']()[_0x476a3e(0x593)]||0x0);const _0x393258=$dataSystem[_0x476a3e(0x4ee)][_0x15fb5a];_0x3f1886[_0x476a3e(0x87d)](/attack/i)&&(_0x3f1886=[_0x476a3e(0x4ff),_0x476a3e(0x44d),_0x476a3e(0x6d0)][_0x393258[_0x476a3e(0x837)]]||_0x476a3e(0x44d)),this[_0x476a3e(0x278)]={'motionType':_0x3f1886,'weaponImageId':_0x496027?_0x393258['weaponImageId']:0x0,'pattern':_0x459164};},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x52e)]=function(_0x3a620b){const _0x3989ce=_0x2bbd55;if(!_0x3a620b)return![];return _0x3a620b[_0x3989ce(0x47a)]()===this[_0x3989ce(0x47a)]();},Game_Battler['prototype'][_0x2bbd55(0x57d)]=function(_0x40b1cb){const _0x13f563=_0x2bbd55;if(!_0x40b1cb)return![];return _0x40b1cb[_0x13f563(0x1f3)]()===this[_0x13f563(0x47a)]();},VisuMZ['BattleCore'][_0x2bbd55(0x248)]=Game_Actor['prototype'][_0x2bbd55(0x76c)],Game_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x76c)]=function(_0x101c42){const _0x378c55=_0x2bbd55;VisuMZ[_0x378c55(0x46a)][_0x378c55(0x248)]['call'](this,_0x101c42),this[_0x378c55(0x439)]();},Game_Actor[_0x2bbd55(0x5d7)]['initBattlePortrait']=function(){const _0x14bdc5=_0x2bbd55;this[_0x14bdc5(0x2dc)]='',this[_0x14bdc5(0x148)]()&&this[_0x14bdc5(0x148)]()[_0x14bdc5(0x11b)]['match'](/<BATTLE (?:IMAGE|PORTRAIT):[ ](.*)>/i)&&(this[_0x14bdc5(0x2dc)]=String(RegExp['$1']));},Game_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x70c)]=function(){const _0x5782af=_0x2bbd55;if(this[_0x5782af(0x502)]()!=='')return this['getBattlePortrait']();else{if(Imported['VisuMZ_1_MainMenuCore']&&this[_0x5782af(0x17d)]()!=='')return this[_0x5782af(0x17d)]();}return'';},Game_Actor['prototype'][_0x2bbd55(0x502)]=function(){const _0x2b48a6=_0x2bbd55;if(this[_0x2b48a6(0x2dc)]===undefined)this['initBattlePortrait']();return this[_0x2b48a6(0x2dc)];},Game_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x4ab)]=function(_0x1f2b02){const _0x34c37e=_0x2bbd55;if(this['_battlePortrait']===undefined)this[_0x34c37e(0x439)]();this['_battlePortrait']=_0x1f2b02;if(SceneManager[_0x34c37e(0xfb)]()&&$gameParty[_0x34c37e(0x49d)]()[_0x34c37e(0x42f)](this)){const _0x54df27=SceneManager[_0x34c37e(0x750)][_0x34c37e(0x537)];if(_0x54df27)_0x54df27['refreshActorPortrait'](this);}},Game_Actor[_0x2bbd55(0x5d7)]['isSpriteVisible']=function(){return!![];},Game_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x605)]=function(){const _0x35210b=_0x2bbd55;if(!this[_0x35210b(0x730)]()&&BattleManager[_0x35210b(0x77e)])return!![];return Game_Battler[_0x35210b(0x5d7)][_0x35210b(0x605)][_0x35210b(0x4f4)](this);},VisuMZ['BattleCore'][_0x2bbd55(0x3e8)]=Game_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x60d)],Game_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x60d)]=function(){const _0xd34f59=_0x2bbd55;if(BattleManager[_0xd34f59(0x77e)]&&!ConfigManager[_0xd34f59(0x36f)])return this[_0xd34f59(0x87a)]();else{return VisuMZ[_0xd34f59(0x46a)][_0xd34f59(0x3e8)][_0xd34f59(0x4f4)](this);;}},Game_Actor[_0x2bbd55(0x5d7)]['makeActionListAutoAttack']=function(){const _0x306e91=_0x2bbd55,_0x4f7666=[],_0x1f7dcb=new Game_Action(this);return _0x1f7dcb[_0x306e91(0x572)](),_0x4f7666['push'](_0x1f7dcb),_0x4f7666;},Game_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x752)]=function(){const _0x177819=_0x2bbd55;return this[_0x177819(0x71c)]()[_0x177819(0x11b)][_0x177819(0x87d)](/<BATTLE COMMANDS>\s*([\s\S]*)\s*<\/BATTLE COMMANDS>/i)?String(RegExp['$1'])[_0x177819(0x680)](/[\r\n]+/):VisuMZ[_0x177819(0x46a)][_0x177819(0x55b)][_0x177819(0x230)]['BattleCmdList'];},Game_Actor[_0x2bbd55(0x5d7)]['svBattlerAnchorX']=function(){const _0x40f619=_0x2bbd55;if(this[_0x40f619(0x72b)][_0x40f619(0x76e)]!==undefined)return this[_0x40f619(0x72b)][_0x40f619(0x76e)];return this[_0x40f619(0x148)]()[_0x40f619(0x11b)][_0x40f619(0x87d)](/<SIDEVIEW ANCHOR: (.*), (.*)>/i)?(this[_0x40f619(0x72b)][_0x40f619(0x76e)]=eval(RegExp['$1']),this[_0x40f619(0x72b)]['svAnchorY']=eval(RegExp['$2'])):this[_0x40f619(0x72b)][_0x40f619(0x76e)]=Game_Battler[_0x40f619(0x5d7)][_0x40f619(0x45b)]['call'](this),this[_0x40f619(0x72b)][_0x40f619(0x76e)];},Game_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x42a)]=function(){const _0xd16387=_0x2bbd55;if(this[_0xd16387(0x72b)][_0xd16387(0x59b)]!==undefined)return this[_0xd16387(0x72b)][_0xd16387(0x59b)];return this[_0xd16387(0x148)]()[_0xd16387(0x11b)]['match'](/<SIDEVIEW ANCHOR: (.*), (.*)>/i)?(this[_0xd16387(0x72b)]['svAnchorX']=eval(RegExp['$1']),this['_cache'][_0xd16387(0x59b)]=eval(RegExp['$2'])):this[_0xd16387(0x72b)]['svAnchorY']=Game_Battler[_0xd16387(0x5d7)]['svBattlerAnchorY']['call'](this),this[_0xd16387(0x72b)][_0xd16387(0x59b)];},Game_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x46b)]=function(){const _0x2ba2d0=_0x2bbd55;if(this['_cache'][_0x2ba2d0(0x545)]!==undefined)return this[_0x2ba2d0(0x72b)][_0x2ba2d0(0x545)];if(this[_0x2ba2d0(0x148)]()['note'][_0x2ba2d0(0x87d)](/<SIDEVIEW SHOW SHADOW>/i))this[_0x2ba2d0(0x72b)]['svShadow']=!![];else this['actor']()[_0x2ba2d0(0x11b)][_0x2ba2d0(0x87d)](/<SIDEVIEW HIDE SHADOW>/i)?this[_0x2ba2d0(0x72b)][_0x2ba2d0(0x545)]=![]:this[_0x2ba2d0(0x72b)][_0x2ba2d0(0x545)]=Game_Battler['prototype'][_0x2ba2d0(0x46b)]['call'](this);return this[_0x2ba2d0(0x72b)][_0x2ba2d0(0x545)];},Game_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x811)]=function(){const _0x308e43=_0x2bbd55;return VisuMZ[_0x308e43(0x46a)]['Settings'][_0x308e43(0x843)][_0x308e43(0x4c7)];},Game_Actor[_0x2bbd55(0x5d7)]['performWeaponAnimation']=function(){const _0x5f2fbd=_0x2bbd55,_0x5263b9=this['weapons'](),_0x422773=_0x5263b9[0x0]?_0x5263b9[0x0][_0x5f2fbd(0x593)]:0x0,_0x41d1e0=$dataSystem[_0x5f2fbd(0x4ee)][_0x422773];_0x41d1e0&&this[_0x5f2fbd(0x3fb)](_0x41d1e0['weaponImageId']);},Game_Actor[_0x2bbd55(0x5d7)]['performAction']=function(_0x5a249f){const _0x318a92=_0x2bbd55;Game_Battler[_0x318a92(0x5d7)]['performAction'][_0x318a92(0x4f4)](this,_0x5a249f),this[_0x318a92(0x3df)](_0x5a249f);},Game_Actor[_0x2bbd55(0x5d7)]['getAttackMotion']=function(){const _0x41db97=_0x2bbd55,_0x3ece01=this[_0x41db97(0x583)](),_0x4be415=_0x3ece01[0x0]?_0x3ece01[0x0][_0x41db97(0x593)]:0x0;return $dataSystem[_0x41db97(0x4ee)][_0x4be415];},Game_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x3a7)]=function(_0x116c0f){const _0x5a5ca8=_0x2bbd55;_0x116c0f=_0x116c0f||0x1,_0x116c0f--;const _0xc588cf=this[_0x5a5ca8(0x583)]();return _0xc588cf[_0x116c0f]?_0xc588cf[_0x116c0f][_0x5a5ca8(0x57c)]:0x0;},Game_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x12a)]=function(_0x2338f1){const _0x8f7a07=_0x2bbd55;_0x2338f1=_0x2338f1||0x1,_0x2338f1--;const _0x134c45=this['weapons'](),_0x193cbb=_0x134c45[_0x2338f1]?_0x134c45[_0x2338f1][_0x8f7a07(0x593)]:0x0;return $dataSystem[_0x8f7a07(0x4ee)][_0x193cbb];},Game_Actor['prototype']['performAttackSlot']=function(_0x1a6399){const _0xd46aae=_0x2bbd55;_0x1a6399=_0x1a6399||0x1,_0x1a6399--;const _0x1d408c=this['weapons'](),_0x1253c9=_0x1d408c[_0x1a6399]?_0x1d408c[_0x1a6399]['wtypeId']:0x0,_0x477e49=$dataSystem['attackMotions'][_0x1253c9];if(_0x477e49){if(_0x477e49[_0xd46aae(0x837)]===0x0)this['requestMotion'](_0xd46aae(0x4ff));else{if(_0x477e49[_0xd46aae(0x837)]===0x1)this['requestMotion']('swing');else _0x477e49[_0xd46aae(0x837)]===0x2&&this['requestMotion'](_0xd46aae(0x6d0));}this[_0xd46aae(0x3fb)](_0x477e49[_0xd46aae(0x5b1)]);}},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x6f6)]=function(_0x107fdb){const _0x13565e=_0x2bbd55;this[_0x13565e(0x70b)]=_0x107fdb||0x0;},Game_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x871)]=function(){const _0x357f3b=_0x2bbd55;this[_0x357f3b(0x70b)]=this[_0x357f3b(0x70b)]||0x0,this[_0x357f3b(0x70b)]++;},Game_Battler[_0x2bbd55(0x5d7)]['clearActiveWeaponSlot']=function(){this['_activeWeaponSlot']=undefined;},VisuMZ[_0x2bbd55(0x46a)]['Game_Actor_equips']=Game_Actor['prototype'][_0x2bbd55(0x103)],Game_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x103)]=function(){const _0x65d2cd=_0x2bbd55;let _0x48cc86=VisuMZ[_0x65d2cd(0x46a)][_0x65d2cd(0x4e5)][_0x65d2cd(0x4f4)](this);if(this[_0x65d2cd(0x5e2)])return _0x48cc86;if(this['_activeWeaponSlot']!==undefined){this[_0x65d2cd(0x5e2)]=!![];const _0x109c21=this['equipSlots']();for(let _0x1a2be2=0x0;_0x1a2be2<_0x109c21[_0x65d2cd(0x5cf)];_0x1a2be2++){_0x109c21[_0x1a2be2]===0x1&&this[_0x65d2cd(0x70b)]!==_0x1a2be2&&(_0x48cc86[_0x1a2be2]=null);}this[_0x65d2cd(0x5e2)]=undefined;}return _0x48cc86;},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x72a)]=function(_0x5c059c){const _0x291781=_0x2bbd55;return _0x5c059c[_0x291781(0x101)]()?_0x5c059c[_0x291781(0x583)]()[_0x291781(0x5cf)]||0x1:0x1;},Window_BattleLog[_0x2bbd55(0x5d7)]['setActiveWeaponSet']=function(_0x185aae,_0x45fb72){const _0x386c73=_0x2bbd55;_0x185aae&&_0x185aae[_0x386c73(0x101)]()&&_0x185aae[_0x386c73(0x6f6)](_0x45fb72),this[_0x386c73(0x7dd)]();},Window_BattleLog[_0x2bbd55(0x5d7)]['clearActiveWeaponSet']=function(_0x8fce01){const _0x4b7cc0=_0x2bbd55;_0x8fce01&&_0x8fce01['isActor']()&&_0x8fce01[_0x4b7cc0(0x76a)](),this[_0x4b7cc0(0x7dd)]();},Game_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x3f9)]=function(){const _0x42e44c=_0x2bbd55;let _0x280795=_0x42e44c(0x3f9);if(this['checkCacheKey'](_0x280795))return this['_cache'][_0x280795];return this[_0x42e44c(0x72b)][_0x280795]=this[_0x42e44c(0x25b)](this[_0x42e44c(0x148)]()),this[_0x42e44c(0x72b)][_0x280795];},Game_Actor[_0x2bbd55(0x5d7)]['battleUIOffsetY']=function(){const _0x44c376=_0x2bbd55;let _0x5147d9=_0x44c376(0x510);if(this[_0x44c376(0x722)](_0x5147d9))return this['_cache'][_0x5147d9];return this[_0x44c376(0x72b)][_0x5147d9]=this[_0x44c376(0x105)](this[_0x44c376(0x148)]()),this[_0x44c376(0x72b)][_0x5147d9];},VisuMZ[_0x2bbd55(0x46a)]['Game_Enemy_setup']=Game_Enemy[_0x2bbd55(0x5d7)]['setup'],Game_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x76c)]=function(_0x2385ae,_0x213aa9,_0x444532){const _0x1d32ee=_0x2bbd55;_0x2385ae=DataManager[_0x1d32ee(0x29b)](_0x2385ae),VisuMZ['BattleCore'][_0x1d32ee(0x10f)][_0x1d32ee(0x4f4)](this,_0x2385ae,_0x213aa9,_0x444532),Imported[_0x1d32ee(0x690)]&&this['initElementStatusCore'](),this[_0x1d32ee(0x451)](),this[_0x1d32ee(0x793)](),Imported[_0x1d32ee(0x690)]&&this[_0x1d32ee(0x823)]();},Game_Enemy['prototype'][_0x2bbd55(0x451)]=function(){const _0x4212ab=_0x2bbd55,_0x3d661c=VisuMZ[_0x4212ab(0x46a)][_0x4212ab(0x55b)][_0x4212ab(0x37f)];this['_attackAnimationId']=_0x3d661c['AttackAnimation'],this[_0x4212ab(0x3f4)]={};},Game_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x793)]=function(){const _0x53b453=_0x2bbd55,_0x503f6d=VisuMZ[_0x53b453(0x46a)][_0x53b453(0x55b)]['Enemy'],_0x242e8b=this[_0x53b453(0x64d)]()[_0x53b453(0x11b)];this['_svBattlerData']={'name':'','wtypeId':_0x503f6d[_0x53b453(0x432)],'collapse':_0x503f6d[_0x53b453(0x133)],'motionIdle':_0x503f6d['MotionIdle'],'width':_0x503f6d[_0x53b453(0x697)]||0x40,'height':_0x503f6d[_0x53b453(0x7e4)]||0x40,'anchorX':_0x503f6d[_0x53b453(0x22b)]||0x0,'anchorY':_0x503f6d[_0x53b453(0x3d9)]||0x0,'shadow':_0x503f6d[_0x53b453(0x3ac)]};_0x242e8b[_0x53b453(0x87d)](/<ATTACK ANIMATION:[ ](\d+)>/i)&&(this[_0x53b453(0x84a)]=Number(RegExp['$1']));const _0x4a3887=this[_0x53b453(0x3f4)];if(_0x242e8b[_0x53b453(0x87d)](/<SIDEVIEW BATTLER: (.*)>/i))_0x4a3887[_0x53b453(0x485)]=String(RegExp['$1']);else{if(_0x242e8b[_0x53b453(0x87d)](/<SIDEVIEW BATTLERS>\s*([\s\S]*)\s*<\/SIDEVIEW BATTLERS>/i)){const _0x1ce769=String(RegExp['$1'])[_0x53b453(0x680)](/[\r\n]+/)[_0x53b453(0x530)]('');_0x4a3887['name']=DataManager[_0x53b453(0x153)](_0x1ce769);}}_0x242e8b[_0x53b453(0x87d)](/<SIDEVIEW ANCHOR: (.*), (.*)>/i)&&(_0x4a3887['anchorX']=eval(RegExp['$1']),_0x4a3887['anchorY']=eval(RegExp['$2']));if(_0x242e8b[_0x53b453(0x87d)](/<SIDEVIEW COLLAPSE>/i))_0x4a3887[_0x53b453(0x1e8)]=!![];else _0x242e8b['match'](/<SIDEVIEW NO COLLAPSE>/i)&&(_0x4a3887[_0x53b453(0x1e8)]=![]);if(_0x242e8b[_0x53b453(0x87d)](/<SIDEVIEW SHOW SHADOW>/i))_0x4a3887[_0x53b453(0x844)]=!![];else _0x242e8b[_0x53b453(0x87d)](/<SIDEVIEW HIDE SHADOW>/i)&&(_0x4a3887[_0x53b453(0x844)]=![]);if(_0x242e8b[_0x53b453(0x87d)](/<SIDEVIEW IDLE MOTION: (.*)>/i))_0x4a3887['motionIdle']=String(RegExp['$1'])[_0x53b453(0x38e)]()[_0x53b453(0x692)]();else{if(_0x242e8b[_0x53b453(0x87d)](/<SIDEVIEW IDLE MOTIONS>\s*([\s\S]*)\s*<\/SIDEVIEW IDLE MOTIONS>/i)){const _0x1323c5=String(RegExp['$1'])['split'](/[\r\n]+/)['remove']('');_0x4a3887[_0x53b453(0x75b)]=DataManager[_0x53b453(0x153)](_0x1323c5);}}_0x242e8b[_0x53b453(0x87d)](/<SIDEVIEW SIZE: (\d+), (\d+)>/i)&&(_0x4a3887[_0x53b453(0x802)]=Number(RegExp['$1']),_0x4a3887[_0x53b453(0x6c3)]=Number(RegExp['$2']));if(_0x242e8b[_0x53b453(0x87d)](/<SIDEVIEW WEAPON: (.*)>/i))_0x4a3887[_0x53b453(0x593)]=DataManager[_0x53b453(0x733)](RegExp['$1']);else{if(_0x242e8b[_0x53b453(0x87d)](/<SIDEVIEW WEAPONS>\s*([\s\S]*)\s*<\/SIDEVIEW WEAPONS>/i)){const _0x193c1b=String(RegExp['$1'])['split'](/[\r\n]+/)[_0x53b453(0x530)](''),_0x2c5271=DataManager[_0x53b453(0x153)](_0x193c1b);_0x4a3887[_0x53b453(0x593)]=DataManager['getWtypeIdWithName'](_0x2c5271);}}if(Imported[_0x53b453(0x690)]){const _0x3d6be3=this[_0x53b453(0x568)]();for(const _0x39ca3d of _0x3d6be3){const _0x5317e9=this[_0x53b453(0x5ce)](_0x39ca3d)[_0x53b453(0x599)][_0x53b453(0x6d4)]()['trim'](),_0x50f8d7=_0x39ca3d[_0x53b453(0x6d4)]()[_0x53b453(0x692)]();if(_0x242e8b['match'](VisuMZ[_0x53b453(0x6af)][_0x53b453(0x4de)][_0x53b453(0x4fe)[_0x53b453(0x36b)](_0x50f8d7,_0x5317e9)]))_0x4a3887[_0x53b453(0x485)]=String(RegExp['$1']);else{if(_0x242e8b[_0x53b453(0x87d)](VisuMZ[_0x53b453(0x6af)][_0x53b453(0x4de)][_0x53b453(0x658)[_0x53b453(0x36b)](_0x50f8d7,_0x5317e9)])){const _0x242b16=String(RegExp['$1'])[_0x53b453(0x680)](/[\r\n]+/)['remove']('');_0x4a3887['name']=DataManager[_0x53b453(0x153)](_0x242b16);}}if(_0x242e8b['match'](VisuMZ[_0x53b453(0x6af)][_0x53b453(0x4de)][_0x53b453(0x7b5)[_0x53b453(0x36b)](_0x50f8d7,_0x5317e9)]))_0x4a3887['wtypeId']=DataManager[_0x53b453(0x733)](RegExp['$1']);else{if(_0x242e8b[_0x53b453(0x87d)](VisuMZ[_0x53b453(0x6af)][_0x53b453(0x4de)][_0x53b453(0x525)[_0x53b453(0x36b)](_0x50f8d7,_0x5317e9)])){const _0x44690=String(RegExp['$1'])[_0x53b453(0x680)](/[\r\n]+/)['remove'](''),_0x2697c0=DataManager['processRandomizedData'](_0x44690);_0x4a3887[_0x53b453(0x593)]=DataManager[_0x53b453(0x733)](_0x2697c0);}}if(_0x242e8b[_0x53b453(0x87d)](VisuMZ[_0x53b453(0x6af)][_0x53b453(0x4de)]['SvMotionIdleSolo-%1-%2'[_0x53b453(0x36b)](_0x50f8d7,_0x5317e9)]))_0x4a3887[_0x53b453(0x75b)]=String(RegExp['$1'])[_0x53b453(0x38e)]()[_0x53b453(0x692)]();else{if(_0x242e8b[_0x53b453(0x87d)](VisuMZ['ElementStatusCore'][_0x53b453(0x4de)]['SvMotionIdleMass-%1-%2'[_0x53b453(0x36b)](_0x50f8d7,_0x5317e9)])){const _0x1f9f62=String(RegExp['$1'])[_0x53b453(0x680)](/[\r\n]+/)['remove']('');_0x4a3887[_0x53b453(0x75b)]=DataManager[_0x53b453(0x153)](_0x1f9f62);}}}}},Game_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x339)]=function(){return this['_attackAnimationId']||0x0;},Game_Enemy['prototype']['attackAnimationId2']=function(){const _0x19d28=_0x2bbd55;return this[_0x19d28(0x339)]();},Game_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x3a7)]=function(_0x2d7a16){const _0x7e90b9=_0x2bbd55;return this[_0x7e90b9(0x339)]();},Game_Enemy['prototype'][_0x2bbd55(0x15b)]=function(){const _0x10471a=_0x2bbd55;if(this['enemy']()[_0x10471a(0x11b)][_0x10471a(0x87d)](/<BATTLER SPRITE CANNOT MOVE>/i))return![];return Game_Battler[_0x10471a(0x5d7)][_0x10471a(0x15b)][_0x10471a(0x4f4)](this);},Game_Enemy['prototype'][_0x2bbd55(0x2c3)]=function(){const _0x50ebec=_0x2bbd55;if(this[_0x50ebec(0x64d)]()['note'][_0x50ebec(0x87d)](/<BATTLER SPRITE GROUNDED>/i))return!![];return![];},Game_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x1fb)]=function(){const _0x32ef0d=_0x2bbd55,_0x324fa4=[];for(const _0x20446b of this[_0x32ef0d(0x64d)]()[_0x32ef0d(0x3bd)]){const _0xfe402b=$dataSkills[_0x20446b[_0x32ef0d(0x258)]];if(_0xfe402b&&!_0x324fa4['includes'](_0xfe402b))_0x324fa4[_0x32ef0d(0x786)](_0xfe402b);}return _0x324fa4;},Game_Enemy['prototype']['battleUIOffsetX']=function(){const _0x514375=_0x2bbd55;let _0x245f3e=_0x514375(0x3f9);if(this[_0x514375(0x722)](_0x245f3e))return this[_0x514375(0x72b)][_0x245f3e];return this[_0x514375(0x72b)][_0x245f3e]=this[_0x514375(0x25b)](this['enemy']()),this['_cache'][_0x245f3e];},Game_Enemy[_0x2bbd55(0x5d7)]['battleUIOffsetY']=function(){const _0x4da0af=_0x2bbd55;let _0x58d0c4=_0x4da0af(0x510);if(this[_0x4da0af(0x722)](_0x58d0c4))return this[_0x4da0af(0x72b)][_0x58d0c4];return this[_0x4da0af(0x72b)][_0x58d0c4]=this[_0x4da0af(0x105)](this[_0x4da0af(0x64d)]()),this[_0x4da0af(0x72b)][_0x58d0c4];},Game_Enemy[_0x2bbd55(0x5d7)]['svBattlerData']=function(){const _0x3ce4c9=_0x2bbd55;if(this[_0x3ce4c9(0x3f4)]!==undefined)return this[_0x3ce4c9(0x3f4)];return this['setupBattleCoreData'](),this[_0x3ce4c9(0x3f4)];},Game_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x3d7)]=function(){const _0x2d10b4=_0x2bbd55;return this[_0x2d10b4(0x4fb)]()['name']!=='';},Game_Enemy[_0x2bbd55(0x5d7)]['svBattlerName']=function(){const _0x226065=_0x2bbd55;return this[_0x226065(0x4fb)]()[_0x226065(0x485)];},Game_Enemy['prototype'][_0x2bbd55(0x811)]=function(){const _0x49b14f=_0x2bbd55;return this['hasSvBattler']()?VisuMZ['BattleCore']['Settings'][_0x49b14f(0x843)][_0x49b14f(0x4c7)]:VisuMZ[_0x49b14f(0x46a)][_0x49b14f(0x55b)][_0x49b14f(0x37f)]['SmoothImage'];},Game_Enemy['prototype']['performAction']=function(_0x1e02ca){const _0x5a6b06=_0x2bbd55;Game_Battler['prototype']['performAction'][_0x5a6b06(0x4f4)](this,_0x1e02ca);if(this[_0x5a6b06(0x3d7)]())this[_0x5a6b06(0x3df)](_0x1e02ca);},Game_Enemy[_0x2bbd55(0x5d7)]['performAttack']=function(){const _0x28a415=_0x2bbd55,_0x4325a4=this[_0x28a415(0x4fb)]()['wtypeId']||0x0,_0x385361=$dataSystem['attackMotions'][_0x4325a4];if(_0x385361){if(_0x385361[_0x28a415(0x837)]===0x0)this[_0x28a415(0x4ac)](_0x28a415(0x4ff));else{if(_0x385361['type']===0x1)this[_0x28a415(0x4ac)](_0x28a415(0x44d));else _0x385361[_0x28a415(0x837)]===0x2&&this[_0x28a415(0x4ac)](_0x28a415(0x6d0));}}},Game_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x514)]=function(){const _0x4a30d4=_0x2bbd55,_0x51433d=this[_0x4a30d4(0x4fb)]()['wtypeId']||0x0,_0x32f66a=$dataSystem[_0x4a30d4(0x4ee)][_0x51433d];_0x32f66a&&this[_0x4a30d4(0x3fb)](_0x32f66a[_0x4a30d4(0x5b1)]);},Game_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x131)]=function(){const _0x225e0b=_0x2bbd55,_0x559bd7=this[_0x225e0b(0x4fb)]()[_0x225e0b(0x593)]||0x0;return $dataSystem[_0x225e0b(0x4ee)][_0x559bd7];},Game_Enemy[_0x2bbd55(0x5d7)]['getAttackMotionSlot']=function(_0x175e5a){const _0x4be346=_0x2bbd55;return this[_0x4be346(0x131)]();},Game_Enemy['prototype'][_0x2bbd55(0x634)]=function(){const _0x38fdcc=_0x2bbd55;Game_Battler[_0x38fdcc(0x5d7)][_0x38fdcc(0x634)][_0x38fdcc(0x4f4)](this),this[_0x38fdcc(0x819)]()&&this[_0x38fdcc(0x3d7)]()&&this[_0x38fdcc(0x4ac)](_0x38fdcc(0x4e0)),SoundManager[_0x38fdcc(0x5df)]();},Game_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x1ab)]=function(){const _0x5bf99f=_0x2bbd55;Game_Battler[_0x5bf99f(0x5d7)]['performEvasion'][_0x5bf99f(0x4f4)](this),this[_0x5bf99f(0x4ac)]('evade');},Game_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x499)]=function(){const _0x4533f4=_0x2bbd55;Game_Battler[_0x4533f4(0x5d7)][_0x4533f4(0x499)]['call'](this),this[_0x4533f4(0x4ac)](_0x4533f4(0x527));},Game_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x691)]=function(){const _0x786f73=_0x2bbd55;Game_Battler[_0x786f73(0x5d7)][_0x786f73(0x691)]['call'](this),this[_0x786f73(0x59d)]();},Game_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x6ef)]=function(){const _0x2993f3=_0x2bbd55;if(this[_0x2993f3(0x3d7)]()){if(this[_0x2993f3(0x450)]()>=0x1)return!![];return this['svBattlerData']()[_0x2993f3(0x1e8)];}else return!![];},Game_Enemy[_0x2bbd55(0x5d7)]['svBattlerAnchorX']=function(){const _0x34f428=_0x2bbd55;return this[_0x34f428(0x4fb)]()[_0x34f428(0x674)];},Game_Enemy['prototype'][_0x2bbd55(0x42a)]=function(){const _0x103df7=_0x2bbd55;return this[_0x103df7(0x4fb)]()[_0x103df7(0x1ac)];},Game_Enemy[_0x2bbd55(0x5d7)]['svBattlerShadowVisible']=function(){const _0x53b448=_0x2bbd55;return this[_0x53b448(0x4fb)]()[_0x53b448(0x844)];},VisuMZ[_0x2bbd55(0x46a)]['Game_Enemy_transform']=Game_Enemy['prototype']['transform'],Game_Enemy['prototype'][_0x2bbd55(0x662)]=function(_0x167cf0){const _0x1a8c00=_0x2bbd55;VisuMZ[_0x1a8c00(0x46a)]['Game_Enemy_transform']['call'](this,_0x167cf0),this[_0x1a8c00(0x451)](),this[_0x1a8c00(0x793)]();const _0x249ce6=this[_0x1a8c00(0x6ae)]();if(_0x249ce6)_0x249ce6[_0x1a8c00(0x40c)](this);},Game_Unit[_0x2bbd55(0x5d7)][_0x2bbd55(0x66f)]=function(_0x50d7ee){const _0x5ebbed=_0x2bbd55;for(const _0x5ac12c of this[_0x5ebbed(0x158)]()){if(_0x5ac12c)_0x5ac12c[_0x5ebbed(0x66f)](_0x50d7ee);}},Game_Unit[_0x2bbd55(0x5d7)][_0x2bbd55(0x4b7)]=function(){const _0x350845=_0x2bbd55,_0x1b96e2=this[_0x350845(0x1ee)]();return _0x1b96e2[Math[_0x350845(0x6cb)](_0x1b96e2[_0x350845(0x5cf)])];},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x25e)]=Game_Party[_0x2bbd55(0x5d7)]['addActor'],Game_Party[_0x2bbd55(0x5d7)][_0x2bbd55(0x247)]=function(_0x514c53){const _0x197391=_0x2bbd55;VisuMZ[_0x197391(0x46a)][_0x197391(0x25e)][_0x197391(0x4f4)](this,_0x514c53),BattleManager['refreshStatusWindow']();},VisuMZ['BattleCore'][_0x2bbd55(0x4d2)]=Game_Party[_0x2bbd55(0x5d7)][_0x2bbd55(0x3e9)],Game_Party[_0x2bbd55(0x5d7)][_0x2bbd55(0x3e9)]=function(_0x431e95){const _0x11bffd=_0x2bbd55;VisuMZ['BattleCore']['Game_Party_removeActor']['call'](this,_0x431e95),BattleManager[_0x11bffd(0x3a6)]();},VisuMZ['BattleCore'][_0x2bbd55(0x6ba)]=Game_Troop[_0x2bbd55(0x5d7)][_0x2bbd55(0x76c)],Game_Troop[_0x2bbd55(0x5d7)][_0x2bbd55(0x76c)]=function(_0x58e560){const _0x4bc447=_0x2bbd55;$gameTemp[_0x4bc447(0x49c)](),$gameTemp[_0x4bc447(0x611)](_0x58e560),VisuMZ[_0x4bc447(0x46a)][_0x4bc447(0x6ba)][_0x4bc447(0x4f4)](this,_0x58e560);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x5e7)]=Game_Map[_0x2bbd55(0x5d7)][_0x2bbd55(0x3c5)],Game_Map[_0x2bbd55(0x5d7)][_0x2bbd55(0x3c5)]=function(){const _0x2818bd=_0x2bbd55;VisuMZ['BattleCore'][_0x2818bd(0x5e7)]['call'](this),this['setupBattlebackBattleCore']();},Game_Map[_0x2bbd55(0x5d7)][_0x2bbd55(0x624)]=function(){const _0x4ae1c0=_0x2bbd55;this[_0x4ae1c0(0x7e5)]={},this[_0x4ae1c0(0x441)]={};if(!$dataMap)return;const _0x5b1be7=$dataMap['note'];if(!_0x5b1be7)return;const _0x38b697=_0x5b1be7['match'](/<REGION (\d+) BATTLEBACK(\d+): (.*)>/gi);if(_0x38b697)for(const _0x559aa6 of _0x38b697){_0x559aa6[_0x4ae1c0(0x87d)](/<REGION (\d+) BATTLEBACK(\d+): (.*)>/i);const _0x1d5491=Number(RegExp['$1']),_0x1ad255=Number(RegExp['$2']),_0x27794d=_0x1ad255===0x1?this[_0x4ae1c0(0x7e5)]:this['_regionBattleback2'],_0x53cde7=String(RegExp['$3']);_0x27794d[_0x1d5491]=_0x53cde7;}},VisuMZ['BattleCore'][_0x2bbd55(0x48c)]=Game_Map[_0x2bbd55(0x5d7)][_0x2bbd55(0x6be)],Game_Map[_0x2bbd55(0x5d7)]['battleback1Name']=function(){const _0x297850=_0x2bbd55;if(!BattleManager[_0x297850(0x23c)]()){const _0x347ef7=$gamePlayer[_0x297850(0x764)]($gamePlayer['x'],$gamePlayer['y']);if(this[_0x297850(0x7e5)]&&this['_regionBattleback1'][_0x347ef7])return this[_0x297850(0x7e5)][_0x347ef7];}return VisuMZ[_0x297850(0x46a)][_0x297850(0x48c)][_0x297850(0x4f4)](this);},VisuMZ['BattleCore'][_0x2bbd55(0x2dd)]=Game_Map[_0x2bbd55(0x5d7)][_0x2bbd55(0x615)],Game_Map[_0x2bbd55(0x5d7)]['battleback2Name']=function(){const _0x2aa12b=_0x2bbd55;if(!BattleManager[_0x2aa12b(0x23c)]()){const _0x5b62cc=$gamePlayer[_0x2aa12b(0x764)]($gamePlayer['x'],$gamePlayer['y']);if(this[_0x2aa12b(0x7e5)]&&this[_0x2aa12b(0x441)][_0x5b62cc])return this[_0x2aa12b(0x441)][_0x5b62cc];}return VisuMZ[_0x2aa12b(0x46a)][_0x2aa12b(0x2dd)][_0x2aa12b(0x4f4)](this);},VisuMZ[_0x2bbd55(0x46a)]['Game_Interpreter_PluginCommand']=Game_Interpreter[_0x2bbd55(0x5d7)][_0x2bbd55(0x46e)],Game_Interpreter[_0x2bbd55(0x5d7)][_0x2bbd55(0x46e)]=function(_0x41cff3){const _0x37cb54=_0x2bbd55;return $gameTemp[_0x37cb54(0x57b)](this),VisuMZ[_0x37cb54(0x46a)][_0x37cb54(0x676)][_0x37cb54(0x4f4)](this,_0x41cff3);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x2d5)]=Game_Interpreter[_0x2bbd55(0x5d7)]['updateWaitMode'],Game_Interpreter['prototype'][_0x2bbd55(0x4ef)]=function(){const _0x53ab83=_0x2bbd55;if(SceneManager['isSceneBattle']())switch(this[_0x53ab83(0x10e)]){case _0x53ab83(0x560):if(Imported[_0x53ab83(0x492)]){if($gameScreen[_0x53ab83(0x4b4)]()[_0x53ab83(0x6e7)]>0x0)return!![];this[_0x53ab83(0x10e)]='';}break;case _0x53ab83(0x388):if(BattleManager[_0x53ab83(0x54a)]['isAnimationPlaying']())return!![];this['_waitMode']='';break;case _0x53ab83(0x4e2):if(Imported[_0x53ab83(0x492)]){if($gameScreen[_0x53ab83(0x4b4)]()[_0x53ab83(0x673)]>0x0)return!![];if($gameScreen[_0x53ab83(0x4b4)]()[_0x53ab83(0x835)]>0x0)return!![];this['_waitMode']='';}break;case _0x53ab83(0x5d1):if(BattleManager[_0x53ab83(0x54a)][_0x53ab83(0x840)]())return!![];this[_0x53ab83(0x10e)]='';break;case _0x53ab83(0x4db):if(BattleManager[_0x53ab83(0x54a)]['isAnyoneFloating']())return!![];this['_waitMode']='';break;case _0x53ab83(0x7df):if(BattleManager[_0x53ab83(0x54a)][_0x53ab83(0x285)]())return!![];this[_0x53ab83(0x10e)]='';break;case _0x53ab83(0x504):if(BattleManager[_0x53ab83(0x86a)][_0x53ab83(0x6f8)]())return!![];this[_0x53ab83(0x10e)]='';break;case _0x53ab83(0x57e):if(BattleManager[_0x53ab83(0x54a)][_0x53ab83(0x32d)]())return!![];this[_0x53ab83(0x10e)]='';break;case _0x53ab83(0x723):if(BattleManager[_0x53ab83(0x54a)][_0x53ab83(0x28c)]())return!![];this['_waitMode']='';break;case _0x53ab83(0x602):if(BattleManager['_spriteset'][_0x53ab83(0x14e)]())return!![];this[_0x53ab83(0x10e)]='';break;case'battleSpriteSkew':if(BattleManager[_0x53ab83(0x54a)][_0x53ab83(0x1ec)]())return!![];this[_0x53ab83(0x10e)]='';break;case _0x53ab83(0x109):if(Imported[_0x53ab83(0x625)]){if(BattleManager[_0x53ab83(0x54a)][_0x53ab83(0x385)]())return!![];this[_0x53ab83(0x10e)]='';}break;case _0x53ab83(0x291):if(Imported[_0x53ab83(0x492)]){if($gameScreen[_0x53ab83(0x4b4)]()['skewDuration']>0x0)return!![];this[_0x53ab83(0x10e)]='';}break;case _0x53ab83(0x16f):if(BattleManager[_0x53ab83(0x54a)][_0x53ab83(0x60c)]())return!![];this[_0x53ab83(0x10e)]='';break;case'battleZoom':if(Imported[_0x53ab83(0x492)]){if($gameScreen[_0x53ab83(0x4b4)]()[_0x53ab83(0x3f0)]>0x0)return!![];this[_0x53ab83(0x10e)]='';}break;}return VisuMZ['BattleCore'][_0x53ab83(0x2d5)][_0x53ab83(0x4f4)](this);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x1cd)]=Game_Interpreter['prototype']['command301'],Game_Interpreter[_0x2bbd55(0x5d7)][_0x2bbd55(0x632)]=function(_0x353583){const _0x4927e8=_0x2bbd55;return!$gameParty[_0x4927e8(0x412)]()?this[_0x4927e8(0x436)](_0x353583):VisuMZ[_0x4927e8(0x46a)][_0x4927e8(0x1cd)][_0x4927e8(0x4f4)](this,_0x353583);},Game_Interpreter[_0x2bbd55(0x5d7)][_0x2bbd55(0x683)]=function(_0x518c2e){const _0x80a632=_0x2bbd55;return VisuMZ[_0x80a632(0x46a)]['Game_Interpreter_command301'][_0x80a632(0x4f4)](this,_0x518c2e),BattleManager[_0x80a632(0x622)](_0x43e236=>{const _0x1e3245=_0x80a632;this[_0x1e3245(0x3ea)][this[_0x1e3245(0x5dd)]]=_0x43e236;}),!![];},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x315)]=function(_0x25ff3b){const _0x267316=_0x2bbd55,_0x34ddcb=$dataCommonEvents[_0x25ff3b];if(!_0x34ddcb)return![];if(_0x34ddcb[_0x267316(0x4fc)][_0x267316(0x5cf)]<=0x1)return![];return!![];},Game_Interpreter[_0x2bbd55(0x5d7)][_0x2bbd55(0x436)]=function(_0x308641){const _0x18550a=_0x2bbd55,_0x1455c5=VisuMZ[_0x18550a(0x46a)][_0x18550a(0x55b)]['Mechanics'],_0x1ae1b8=_0x1455c5['BattleStartEvent'],_0x5ca0ec=$dataCommonEvents[_0x1ae1b8];if(_0x5ca0ec&&VisuMZ[_0x18550a(0x46a)][_0x18550a(0x315)](_0x1ae1b8)){const _0x2ffcc5=this[_0x18550a(0x5a4)]()?this['_eventId']:0x0,_0x225328=_0x5ca0ec[_0x18550a(0x4fc)];this['setupChild'](_0x225328,_0x2ffcc5),this[_0x18550a(0x814)]=JsonEx['makeDeepCopy'](this[_0x18550a(0x814)]);const _0x1f9bfd={'code':0xbc3,'indent':0x0,'parameters':JsonEx[_0x18550a(0x878)](_0x308641)};return this[_0x18550a(0x814)]['splice'](this[_0x18550a(0x41a)]+0x1,0x0,_0x1f9bfd),!![];}else return VisuMZ[_0x18550a(0x46a)][_0x18550a(0x1cd)][_0x18550a(0x4f4)](this,_0x308641);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x3ef)]=BattleManager['onEncounter'],BattleManager[_0x2bbd55(0x5b7)]=function(){const _0x4e0a45=_0x2bbd55;VisuMZ[_0x4e0a45(0x46a)][_0x4e0a45(0x3ef)][_0x4e0a45(0x4f4)](this),this[_0x4e0a45(0x390)]();},BattleManager[_0x2bbd55(0x390)]=function(){const _0x5f0ee0=_0x2bbd55,_0x167337=VisuMZ[_0x5f0ee0(0x46a)][_0x5f0ee0(0x55b)]['Mechanics'],_0x2c6397=_0x167337['BattleStartEvent'];_0x2c6397&&VisuMZ[_0x5f0ee0(0x46a)][_0x5f0ee0(0x315)](_0x2c6397)&&(this[_0x5f0ee0(0x790)]=!![],$gameTemp[_0x5f0ee0(0x540)](_0x167337[_0x5f0ee0(0x85e)]),$gameMap[_0x5f0ee0(0x2b0)](),$gameMap['_interpreter'][_0x5f0ee0(0x33d)]=!![]),_0x167337['DefeatEvent']>0x0&&(this[_0x5f0ee0(0x7f4)]=!![]);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x48a)]=Scene_Map[_0x2bbd55(0x5d7)][_0x2bbd55(0x5a1)],Scene_Map[_0x2bbd55(0x5d7)][_0x2bbd55(0x5a1)]=function(){const _0x217184=_0x2bbd55;BattleManager[_0x217184(0x790)]?this[_0x217184(0x3b2)]():VisuMZ['BattleCore'][_0x217184(0x48a)][_0x217184(0x4f4)](this);},Scene_Map['prototype']['battleCorePreBattleCommonEvent']=function(){const _0x234a76=_0x2bbd55;this[_0x234a76(0x805)]=!![];},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x48d)]=SceneManager[_0x2bbd55(0x523)],SceneManager[_0x2bbd55(0x523)]=function(){const _0xf371a=_0x2bbd55;if(BattleManager['_battleCoreBattleStartEvent'])return![];return VisuMZ[_0xf371a(0x46a)][_0xf371a(0x48d)][_0xf371a(0x4f4)](this);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x654)]=Game_Interpreter[_0x2bbd55(0x5d7)]['terminate'],Game_Interpreter[_0x2bbd55(0x5d7)][_0x2bbd55(0x7a7)]=function(){const _0x24abb7=_0x2bbd55;VisuMZ['BattleCore'][_0x24abb7(0x654)]['call'](this),this['_preBattleCommonEvent']&&(this['_preBattleCommonEvent']=undefined,SceneManager[_0x24abb7(0x750)][_0x24abb7(0x466)]());},Scene_Map[_0x2bbd55(0x5d7)]['battleCoreResumeLaunchBattle']=function(){const _0x183d37=_0x2bbd55;BattleManager['_battleCoreBattleStartEvent']=undefined,this[_0x183d37(0x792)]();},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x6ec)]=Scene_Map[_0x2bbd55(0x5d7)][_0x2bbd55(0x447)],Scene_Map[_0x2bbd55(0x5d7)][_0x2bbd55(0x447)]=function(){const _0x2cd002=_0x2bbd55;VisuMZ['BattleCore'][_0x2cd002(0x6ec)][_0x2cd002(0x4f4)](this),$gameTemp['clearForcedGameTroopSettingsBattleCore']();},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x7d6)]=Scene_ItemBase[_0x2bbd55(0x5d7)][_0x2bbd55(0x223)],Scene_ItemBase[_0x2bbd55(0x5d7)]['applyItem']=function(){const _0x261cee=_0x2bbd55;VisuMZ[_0x261cee(0x46a)]['Scene_ItemBase_applyItem'][_0x261cee(0x4f4)](this),this[_0x261cee(0x2d9)]()[_0x261cee(0x11b)][_0x261cee(0x87d)](/<CUSTOM ACTION SEQUENCE>/i)&&($gameTemp['_commonEventQueue']=[]),DataManager['checkAutoCustomActionSequenceNotetagEffect'](this['item']())&&($gameTemp[_0x261cee(0x157)]=[]);},VisuMZ[_0x2bbd55(0x46a)]['Scene_Options_maxCommands']=Scene_Options[_0x2bbd55(0x5d7)]['maxCommands'],Scene_Options[_0x2bbd55(0x5d7)]['maxCommands']=function(){const _0x476b89=_0x2bbd55;let _0x13d805=VisuMZ[_0x476b89(0x46a)][_0x476b89(0x5ef)][_0x476b89(0x4f4)](this);const _0xae461e=VisuMZ[_0x476b89(0x46a)][_0x476b89(0x55b)];if(_0xae461e[_0x476b89(0x3d1)][_0x476b89(0x760)]&&_0xae461e[_0x476b89(0x3d1)][_0x476b89(0x548)])_0x13d805+=0x2;if(_0xae461e[_0x476b89(0x58a)]['AddOption']&&_0xae461e[_0x476b89(0x58a)][_0x476b89(0x548)])_0x13d805+=0x1;return _0x13d805;},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x1a3)]=Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x264)],Scene_Battle[_0x2bbd55(0x5d7)]['start']=function(){const _0xc3b19b=_0x2bbd55;SceneManager[_0xc3b19b(0x31f)]()?(Scene_Message['prototype'][_0xc3b19b(0x264)][_0xc3b19b(0x4f4)](this),this[_0xc3b19b(0x54a)]&&this[_0xc3b19b(0x54a)]['update']()):VisuMZ['BattleCore'][_0xc3b19b(0x1a3)][_0xc3b19b(0x4f4)](this);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x42c)]=Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x792)],Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x792)]=function(){const _0x7ae894=_0x2bbd55;SceneManager[_0x7ae894(0x26a)]()?Scene_Message[_0x7ae894(0x5d7)][_0x7ae894(0x792)][_0x7ae894(0x4f4)](this):VisuMZ[_0x7ae894(0x46a)][_0x7ae894(0x42c)]['call'](this);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x754)]=Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x7a7)],Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x7a7)]=function(){const _0x1d006a=_0x2bbd55;SceneManager[_0x1d006a(0x26a)]()?Scene_Message[_0x1d006a(0x5d7)][_0x1d006a(0x7a7)][_0x1d006a(0x4f4)](this):VisuMZ[_0x1d006a(0x46a)][_0x1d006a(0x754)][_0x1d006a(0x4f4)](this);},Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x7cc)]=function(){const _0x42fd0b=_0x2bbd55;if(ConfigManager[_0x42fd0b(0x7a1)]&&ConfigManager['uiInputPosition']!==undefined)return ConfigManager['uiInputPosition'];else{if(this[_0x42fd0b(0x34a)]()==='border')return![];else{return Scene_Message[_0x42fd0b(0x5d7)][_0x42fd0b(0x7cc)]['call'](this);;}}},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x486)]=Scene_Battle[_0x2bbd55(0x5d7)]['createAllWindows'],Scene_Battle[_0x2bbd55(0x5d7)]['createAllWindows']=function(){const _0x12a736=_0x2bbd55;this[_0x12a736(0x5bf)](),VisuMZ['BattleCore'][_0x12a736(0x486)][_0x12a736(0x4f4)](this),this[_0x12a736(0x178)]();},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x74b)]=Scene_Battle['prototype'][_0x2bbd55(0x651)],Scene_Battle[_0x2bbd55(0x5d7)]['createCancelButton']=function(){const _0xa25d04=_0x2bbd55;VisuMZ['BattleCore'][_0xa25d04(0x74b)][_0xa25d04(0x4f4)](this),this[_0xa25d04(0x34a)]()===_0xa25d04(0x6bb)&&this['repositionCancelButtonBorderStyle']();},Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x75c)]=function(_0x4a4084){const _0x19bfe4=_0x2bbd55;_0x4a4084?(this['_windowLayer']['x']=(Graphics[_0x19bfe4(0x802)]-Graphics[_0x19bfe4(0x269)])/0x2,this[_0x19bfe4(0x473)]['y']=(Graphics['height']-Graphics['boxHeight'])/0x2):(this[_0x19bfe4(0x473)]['x']=Graphics['width']*0xa,this[_0x19bfe4(0x473)]['y']=Graphics['height']*0xa);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x77a)]=Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x6b2)],Scene_Battle[_0x2bbd55(0x5d7)]['selectNextCommand']=function(){const _0x229366=_0x2bbd55,_0x2e9666=BattleManager[_0x229366(0x148)]();VisuMZ[_0x229366(0x46a)][_0x229366(0x77a)][_0x229366(0x4f4)](this);if(_0x2e9666){if(_0x2e9666===BattleManager[_0x229366(0x148)]())return;if(_0x2e9666===BattleManager[_0x229366(0x4dc)])return;if(_0x2e9666[_0x229366(0x6ae)]())_0x2e9666[_0x229366(0x6ae)]()[_0x229366(0x38d)]();}},VisuMZ[_0x2bbd55(0x46a)]['Scene_Battle_selectPreviousCommand']=Scene_Battle['prototype'][_0x2bbd55(0x58e)],Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x58e)]=function(){const _0x546c9a=_0x2bbd55,_0x4b2b08=BattleManager['actor']();if(_0x4b2b08&&_0x4b2b08[_0x546c9a(0x6ae)])_0x4b2b08[_0x546c9a(0x6ae)]()['stepBack']();VisuMZ[_0x546c9a(0x46a)]['Scene_Battle_selectPreviousCommand']['call'](this);},VisuMZ[_0x2bbd55(0x46a)]['Scene_Battle_logWindowRect']=Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x463)],Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x463)]=function(){const _0x3e1850=_0x2bbd55;if(VisuMZ[_0x3e1850(0x46a)]['Settings']['BattleLog']['BattleLogRectJS'])return VisuMZ[_0x3e1850(0x46a)][_0x3e1850(0x55b)][_0x3e1850(0x5f2)][_0x3e1850(0x6c1)][_0x3e1850(0x4f4)](this);return VisuMZ[_0x3e1850(0x46a)][_0x3e1850(0x6d7)][_0x3e1850(0x4f4)](this);},VisuMZ['BattleCore'][_0x2bbd55(0x4ae)]=Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x77b)],Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x77b)]=function(){const _0x47d36b=_0x2bbd55;VisuMZ[_0x47d36b(0x46a)][_0x47d36b(0x4ae)][_0x47d36b(0x4f4)](this),this[_0x47d36b(0x735)]();},Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x735)]=function(){const _0x5e249d=_0x2bbd55,_0xb26002=this[_0x5e249d(0x4c5)];_0xb26002[_0x5e249d(0x512)](_0x5e249d(0x75a),this[_0x5e249d(0x54c)][_0x5e249d(0x5e6)](this)),_0xb26002[_0x5e249d(0x512)](_0x5e249d(0x433),this[_0x5e249d(0x6ee)][_0x5e249d(0x5e6)](this));const _0x184e9b=this['battleLayoutStyle']();switch(_0x184e9b){case'xp':case _0x5e249d(0x455):return this[_0x5e249d(0x4c5)][_0x5e249d(0x65f)](0x1);break;}},Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x54c)]=function(){const _0x3bebaa=_0x2bbd55;BattleManager[_0x3bebaa(0x77e)]=!![],$gameParty[_0x3bebaa(0x4a1)](),this[_0x3bebaa(0x6b2)](),BattleManager[_0x3bebaa(0x80f)]()&&(BattleManager[_0x3bebaa(0x7a8)]=![]);},Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x6ee)]=function(){const _0x3046e9=_0x2bbd55;this[_0x3046e9(0x6e5)]()?(this[_0x3046e9(0x686)]=!![],this[_0x3046e9(0x86a)]['push']('addText',VisuMZ[_0x3046e9(0x46a)][_0x3046e9(0x55b)][_0x3046e9(0x126)][_0x3046e9(0x233)])):this[_0x3046e9(0x1c0)]();},Scene_Battle['prototype'][_0x2bbd55(0x6e5)]=function(){const _0x15e472=_0x2bbd55;return BattleManager[_0x15e472(0x6c0)]();},Scene_Battle['prototype']['callOptions']=function(){const _0x44f737=_0x2bbd55;this['_callSceneOptions']=![],this[_0x44f737(0x54a)][_0x44f737(0x12d)](),this['_windowLayer'][_0x44f737(0x4fd)]=![];if(BattleManager[_0x44f737(0x23c)]())($dataSystem[_0x44f737(0x6be)]||$dataSystem[_0x44f737(0x615)])&&SceneManager[_0x44f737(0x225)]();else($gameMap['battleback1Name']()||$gameMap[_0x44f737(0x615)]())&&SceneManager['snapForBackground']();SceneManager['push'](Scene_Options),BattleManager[_0x44f737(0x80f)]()&&(BattleManager['_tpbSceneChangeCacheActor']=BattleManager['actor']());},VisuMZ['BattleCore'][_0x2bbd55(0x67b)]=Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x566)],Scene_Battle['prototype'][_0x2bbd55(0x566)]=function(){const _0x531fb2=_0x2bbd55;VisuMZ['BattleCore'][_0x531fb2(0x67b)][_0x531fb2(0x4f4)](this);if(this['_callSceneOptions']&&!BattleManager[_0x531fb2(0x4dc)])this['callOptions']();},Scene_Battle['prototype'][_0x2bbd55(0x178)]=function(){const _0x14ed9c=_0x2bbd55,_0x5f124b=this[_0x14ed9c(0x71f)]();this['_autoBattleWindow']=new Window_AutoBattleCancel(_0x5f124b),this[_0x14ed9c(0x4f8)]['hide'](),this[_0x14ed9c(0x3e4)](this[_0x14ed9c(0x4f8)]);},Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x71f)]=function(){const _0x3da27e=_0x2bbd55;return VisuMZ[_0x3da27e(0x46a)][_0x3da27e(0x55b)][_0x3da27e(0x3d1)][_0x3da27e(0x427)]['call'](this);},Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x3bf)]=function(){const _0x565508=_0x2bbd55;return VisuMZ['BattleCore'][_0x565508(0x55b)][_0x565508(0x126)][_0x565508(0x379)];},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x19f)]=Scene_Battle[_0x2bbd55(0x5d7)]['startPartyCommandSelection'],Scene_Battle[_0x2bbd55(0x5d7)]['startPartyCommandSelection']=function(){const _0x57564a=_0x2bbd55;this[_0x57564a(0x3bf)]()?this[_0x57564a(0x61c)]():VisuMZ['BattleCore'][_0x57564a(0x19f)]['call'](this);},Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x61c)]=function(){const _0x5ddb95=_0x2bbd55;if(BattleManager[_0x5ddb95(0x7fe)]())this[_0x5ddb95(0x6b2)]();else BattleManager['isTpb']()&&VisuMZ['BattleCore'][_0x5ddb95(0x19f)][_0x5ddb95(0x4f4)](this);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x12f)]=Scene_Battle[_0x2bbd55(0x5d7)]['commandFight'],Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x27d)]=function(){const _0x4b040b=_0x2bbd55;BattleManager['isTpb']()?this[_0x4b040b(0x36c)]():VisuMZ[_0x4b040b(0x46a)][_0x4b040b(0x12f)][_0x4b040b(0x4f4)](this);},VisuMZ['BattleCore']['Scene_Battle_createActorCommandWindow']=Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x267)],Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x267)]=function(){const _0x36ea5f=_0x2bbd55;VisuMZ[_0x36ea5f(0x46a)][_0x36ea5f(0x7c8)][_0x36ea5f(0x4f4)](this),this[_0x36ea5f(0x5c6)]();},Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x5c6)]=function(){const _0x3a06e5=_0x2bbd55,_0x2caafc=this['_actorCommandWindow'];_0x2caafc[_0x3a06e5(0x512)](_0x3a06e5(0x78f),this[_0x3a06e5(0x5d4)][_0x3a06e5(0x5e6)](this)),_0x2caafc[_0x3a06e5(0x512)]('autoBattle',this[_0x3a06e5(0x45d)][_0x3a06e5(0x5e6)](this)),_0x2caafc[_0x3a06e5(0x512)](_0x3a06e5(0x804),this[_0x3a06e5(0x7e6)]['bind'](this)),BattleManager['isTpb']()&&(this[_0x3a06e5(0x3bf)]()?delete _0x2caafc[_0x3a06e5(0x275)][_0x3a06e5(0x16e)]:_0x2caafc[_0x3a06e5(0x512)]('cancel',this[_0x3a06e5(0x166)]['bind'](this)));},Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x5d4)]=function(){const _0x56c998=_0x2bbd55;this[_0x56c998(0x87b)]();},Scene_Battle['prototype'][_0x2bbd55(0x45d)]=function(){const _0x1b7e33=_0x2bbd55;BattleManager[_0x1b7e33(0x148)]()[_0x1b7e33(0x3c4)](),BattleManager[_0x1b7e33(0x4d0)](),BattleManager[_0x1b7e33(0x726)](),this[_0x1b7e33(0x183)]();},Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x7e6)]=function(){const _0x543958=_0x2bbd55,_0x59220d=BattleManager[_0x543958(0x237)]();_0x59220d[_0x543958(0x56b)](this[_0x543958(0x7d2)][_0x543958(0x80d)]()),this['onSelectAction']();},Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x166)]=function(){const _0x18107a=_0x2bbd55;this[_0x18107a(0x4c5)]['setup'](),this['_actorCommandWindow'][_0x18107a(0x734)]();},VisuMZ['BattleCore']['Scene_Battle_createHelpWindow']=Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x815)],Scene_Battle['prototype'][_0x2bbd55(0x815)]=function(){const _0x436a22=_0x2bbd55;VisuMZ[_0x436a22(0x46a)]['Scene_Battle_createHelpWindow'][_0x436a22(0x4f4)](this),this[_0x436a22(0x7bc)]();},Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x7bc)]=function(){const _0x510013=_0x2bbd55;this[_0x510013(0x7d2)][_0x510013(0x61a)](this[_0x510013(0x46d)]),this['_partyCommandWindow'][_0x510013(0x61a)](this[_0x510013(0x46d)]);},Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x34a)]=function(){const _0x475df0=_0x2bbd55;if($gameTemp[_0x475df0(0x552)]!==undefined)return $gameTemp['_forcedBattleLayout'];if(this[_0x475df0(0x7f8)])return this['_battleLayoutStyle'];return this['_battleLayoutStyle']=VisuMZ[_0x475df0(0x46a)][_0x475df0(0x55b)][_0x475df0(0x1b0)]['Style'][_0x475df0(0x38e)]()['trim'](),this[_0x475df0(0x7f8)];},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x368)]=Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x37a)],Scene_Battle[_0x2bbd55(0x5d7)]['windowAreaHeight']=function(){const _0x10255a=_0x2bbd55,_0x9820bf=this['battleLayoutStyle']();switch(_0x9820bf){case _0x10255a(0x4fc):return this[_0x10255a(0x702)](Math[_0x10255a(0x6b9)](0x1,$gameParty[_0x10255a(0x13b)]()),!![]);break;default:return VisuMZ[_0x10255a(0x46a)][_0x10255a(0x368)]['call'](this);break;}},VisuMZ[_0x2bbd55(0x46a)]['Scene_Battle_helpWindowRect']=Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x490)],Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x490)]=function(){const _0x426cd0=_0x2bbd55,_0x174838=this[_0x426cd0(0x34a)]();switch(_0x174838){case _0x426cd0(0x6bb):return this['helpWindowRectBorderStyle']();break;case _0x426cd0(0x43b):case _0x426cd0(0x4fc):case'xp':case _0x426cd0(0x455):default:return VisuMZ['BattleCore'][_0x426cd0(0x5d9)]['call'](this);break;}},Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x2aa)]=function(){const _0x17f701=_0x2bbd55,_0x45eff2=this['battleLayoutStyle']();switch(_0x45eff2){case'xp':case _0x17f701(0x455):return this[_0x17f701(0x273)]();break;case _0x17f701(0x6bb):return this['statusWindowRectBorderStyle']();break;case _0x17f701(0x43b):case'list':default:return this[_0x17f701(0x3b7)]();break;}},VisuMZ['BattleCore'][_0x2bbd55(0x362)]=Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x85d)],Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x85d)]=function(){const _0x205c2d=_0x2bbd55,_0x1a97e1=this[_0x205c2d(0x34a)]();switch(_0x1a97e1){case'xp':case _0x205c2d(0x455):return this[_0x205c2d(0x458)]();break;case _0x205c2d(0x6bb):return this[_0x205c2d(0x4aa)]();case _0x205c2d(0x43b):case _0x205c2d(0x4fc):default:return this['partyCommandWindowRectDefaultStyle']();break;}},Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x759)]=function(){const _0xe206a3=_0x2bbd55,_0x162b05=VisuMZ[_0xe206a3(0x46a)][_0xe206a3(0x55b)][_0xe206a3(0x1b0)],_0x413ae5=_0x162b05[_0xe206a3(0x4a9)]||0xc0,_0x1c448c=this[_0xe206a3(0x37a)](),_0xcb0aa5=this[_0xe206a3(0x7cc)]()?Graphics[_0xe206a3(0x269)]-_0x413ae5:0x0,_0x3abeb5=Graphics[_0xe206a3(0x50e)]-_0x1c448c;return new Rectangle(_0xcb0aa5,_0x3abeb5,_0x413ae5,_0x1c448c);},Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x827)]=function(){const _0x1e667d=_0x2bbd55;return this[_0x1e667d(0x85d)]();},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x1b9)]=Scene_Battle['prototype'][_0x2bbd55(0x3f8)],Scene_Battle['prototype']['updateStatusWindowPosition']=function(){const _0x54c8f2=_0x2bbd55,_0x29a705=this[_0x54c8f2(0x34a)]();switch(_0x29a705){case'xp':case _0x54c8f2(0x455):case _0x54c8f2(0x6bb):break;case _0x54c8f2(0x43b):case _0x54c8f2(0x4fc):default:VisuMZ['BattleCore'][_0x54c8f2(0x1b9)][_0x54c8f2(0x4f4)](this);break;}},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x4c0)]=Scene_Battle['prototype'][_0x2bbd55(0x51d)],Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x51d)]=function(){const _0x4c1ee7=_0x2bbd55;VisuMZ[_0x4c1ee7(0x46a)][_0x4c1ee7(0x4c0)][_0x4c1ee7(0x4f4)](this),this[_0x4c1ee7(0x307)]();},VisuMZ['BattleCore']['Scene_Battle_startEnemySelection']=Scene_Battle['prototype'][_0x2bbd55(0x297)],Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x297)]=function(){const _0x267f89=_0x2bbd55;VisuMZ[_0x267f89(0x46a)][_0x267f89(0x49b)][_0x267f89(0x4f4)](this),this[_0x267f89(0x822)][_0x267f89(0x24d)](),this[_0x267f89(0x307)]();},Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x307)]=function(){const _0x26c3d6=_0x2bbd55,_0x218800=this[_0x26c3d6(0x34a)]();['xp','portrait','border'][_0x26c3d6(0x42f)](_0x218800)&&this[_0x26c3d6(0x7d2)][_0x26c3d6(0x734)](),(_0x218800===_0x26c3d6(0x6bb)||this[_0x26c3d6(0x556)]())&&(this[_0x26c3d6(0x19a)][_0x26c3d6(0x734)](),this['_itemWindow']['close']());},VisuMZ['BattleCore'][_0x2bbd55(0x5af)]=Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x20a)],Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x20a)]=function(){const _0x3199d9=_0x2bbd55;VisuMZ[_0x3199d9(0x46a)][_0x3199d9(0x5af)][_0x3199d9(0x4f4)](this),this[_0x3199d9(0x6a9)]();},Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x3c6)]=function(){const _0x40b0e4=_0x2bbd55;return[_0x40b0e4(0x453),_0x40b0e4(0x7ad),_0x40b0e4(0x804)][_0x40b0e4(0x42f)](this['_actorCommandWindow']['currentSymbol']());},VisuMZ['BattleCore']['Scene_Battle_onActorCancel']=Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x597)],Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x597)]=function(){const _0x59fab4=_0x2bbd55;this['isNonSubmenuCancel']()?(this[_0x59fab4(0x537)][_0x59fab4(0x35c)](),this['_actorWindow'][_0x59fab4(0x1d1)](),this[_0x59fab4(0x7d2)]['activate']()):VisuMZ['BattleCore'][_0x59fab4(0x2f3)][_0x59fab4(0x4f4)](this),this[_0x59fab4(0x4c4)]();},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x5d2)]=Scene_Battle[_0x2bbd55(0x5d7)]['onEnemyOk'],Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x495)]=function(){const _0x193fe3=_0x2bbd55;VisuMZ[_0x193fe3(0x46a)]['Scene_Battle_onEnemyOk'][_0x193fe3(0x4f4)](this),this[_0x193fe3(0x6a9)]();},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x1f5)]=Scene_Battle['prototype'][_0x2bbd55(0x67e)],Scene_Battle['prototype'][_0x2bbd55(0x67e)]=function(){const _0x323ada=_0x2bbd55;this[_0x323ada(0x3c6)]()?(this[_0x323ada(0x537)]['show'](),this[_0x323ada(0x822)][_0x323ada(0x1d1)](),this[_0x323ada(0x7d2)][_0x323ada(0x459)]()):VisuMZ[_0x323ada(0x46a)][_0x323ada(0x1f5)][_0x323ada(0x4f4)](this),this[_0x323ada(0x4c4)]();},Scene_Battle[_0x2bbd55(0x5d7)]['okTargetSelectionVisibility']=function(){const _0xcffc10=_0x2bbd55,_0xa472e4=this[_0xcffc10(0x34a)]();(_0xa472e4===_0xcffc10(0x6bb)||this['isSkillItemWindowsMiddle']())&&(this['_skillWindow'][_0xcffc10(0x3ba)](),this[_0xcffc10(0x19a)][_0xcffc10(0x268)]&&this[_0xcffc10(0x19a)][_0xcffc10(0x35c)](),this[_0xcffc10(0x212)][_0xcffc10(0x3ba)](),this[_0xcffc10(0x212)][_0xcffc10(0x268)]&&this[_0xcffc10(0x212)][_0xcffc10(0x35c)]());},Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x4c4)]=function(){const _0x3fece5=_0x2bbd55,_0x34cb06=this['battleLayoutStyle']();['xp',_0x3fece5(0x455),'border']['includes'](_0x34cb06)&&this[_0x3fece5(0x7d2)][_0x3fece5(0x3ba)](),this[_0x3fece5(0x6a9)]();},Scene_Battle['prototype'][_0x2bbd55(0x3b7)]=function(){const _0x39d37a=_0x2bbd55,_0x2bb9a4=VisuMZ[_0x39d37a(0x46a)][_0x39d37a(0x55b)][_0x39d37a(0x1b0)],_0x460ec1=Window_BattleStatus['prototype'][_0x39d37a(0x6f1)](),_0x335362=Graphics['boxWidth']-(_0x2bb9a4['CommandWidth']||0xc0),_0x220301=this[_0x39d37a(0x37a)]()+_0x460ec1,_0x223859=this[_0x39d37a(0x7cc)]()?0x0:Graphics[_0x39d37a(0x269)]-_0x335362,_0x19e570=Graphics[_0x39d37a(0x50e)]-_0x220301+_0x460ec1;return new Rectangle(_0x223859,_0x19e570,_0x335362,_0x220301);},Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x273)]=function(){const _0x4638a4=_0x2bbd55,_0x371cd3=Window_BattleStatus[_0x4638a4(0x5d7)][_0x4638a4(0x6f1)](),_0x3b9c5d=Graphics[_0x4638a4(0x269)],_0x13eda3=this['windowAreaHeight']()+_0x371cd3,_0x4019aa=0x0,_0x3eb997=Graphics[_0x4638a4(0x50e)]-_0x13eda3+_0x371cd3;return new Rectangle(_0x4019aa,_0x3eb997,_0x3b9c5d,_0x13eda3);},Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x458)]=function(){const _0x4a641f=_0x2bbd55,_0x1f097c=Graphics['boxWidth']/0x2,_0x34e81c=this[_0x4a641f(0x702)](VisuMZ['BattleCore'][_0x4a641f(0x55b)][_0x4a641f(0x1b0)]['XPActorCommandLines'],!![]),_0x50602f=Math[_0x4a641f(0x86f)]((Graphics[_0x4a641f(0x269)]-_0x1f097c)/0x2),_0x264b04=Graphics[_0x4a641f(0x50e)]-_0x34e81c-this['statusWindowRectXPStyle']()[_0x4a641f(0x6c3)];return new Rectangle(_0x50602f,_0x264b04,_0x1f097c,_0x34e81c);},Scene_Battle['prototype'][_0x2bbd55(0x4eb)]=function(){const _0x2108b4=_0x2bbd55,_0x44e091=Graphics[_0x2108b4(0x802)],_0x4944b6=Math[_0x2108b4(0x86f)]((Graphics[_0x2108b4(0x269)]-_0x44e091)/0x2),_0x3df668=this[_0x2108b4(0x141)](),_0x192d67=(Graphics[_0x2108b4(0x6c3)]-Graphics[_0x2108b4(0x50e)])/-0x2;return new Rectangle(_0x4944b6,_0x192d67,_0x44e091,_0x3df668);},Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x7d1)]=function(){const _0x3f711e=_0x2bbd55,_0x594cc1=Graphics['width'],_0x6616c1=Math[_0x3f711e(0x86f)]((Graphics[_0x3f711e(0x269)]-_0x594cc1)/0x2),_0x13c6bb=this[_0x3f711e(0x702)](0x4,!![]),_0x2630f8=Graphics[_0x3f711e(0x50e)]-_0x13c6bb+(Graphics['height']-Graphics['boxHeight'])/0x2;return new Rectangle(_0x6616c1,_0x2630f8,_0x594cc1,_0x13c6bb);},Scene_Battle[_0x2bbd55(0x5d7)]['partyCommandWindowRectBorderStyle']=function(){const _0x20a523=_0x2bbd55,_0x50af55=Math[_0x20a523(0x2c6)](Graphics[_0x20a523(0x802)]/0x3),_0x2b9ff3=this['isRightInputMode']()?(Graphics[_0x20a523(0x802)]+Graphics[_0x20a523(0x269)])/0x2-_0x50af55:(Graphics[_0x20a523(0x802)]-Graphics[_0x20a523(0x269)])/-0x2,_0x21c3fb=this['helpWindowRectBorderStyle'](),_0x47cc6b=_0x21c3fb['y']+_0x21c3fb[_0x20a523(0x6c3)],_0x179a1d=this[_0x20a523(0x7d1)](),_0x54db58=_0x179a1d['y']-_0x47cc6b;return new Rectangle(_0x2b9ff3,_0x47cc6b,_0x50af55,_0x54db58);},Scene_Battle[_0x2bbd55(0x5d7)]['skillItemWindowRectBorderStyle']=function(){const _0x115fc8=_0x2bbd55,_0x1c46e1=Math[_0x115fc8(0x5db)](Graphics['width']/0x3),_0x418f36=Math['round']((Graphics[_0x115fc8(0x269)]-_0x1c46e1)/0x2),_0x3132f7=this['partyCommandWindowRectBorderStyle'](),_0x4ffc95=_0x3132f7['y'],_0x5169a9=_0x3132f7[_0x115fc8(0x6c3)];return new Rectangle(_0x418f36,_0x4ffc95,_0x1c46e1,_0x5169a9);},Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x3ad)]=function(){const _0x4764c1=_0x2bbd55;this['_cancelButton']['y']=this['_helpWindow']['y']+this[_0x4764c1(0x46d)][_0x4764c1(0x6c3)],this['isRightInputMode']()?this[_0x4764c1(0x34a)]()===_0x4764c1(0x6bb)?this['_cancelButton']['x']=0x8:this[_0x4764c1(0x4f5)]['x']=-this[_0x4764c1(0x4f5)][_0x4764c1(0x802)]-0x4:this[_0x4764c1(0x4f5)]['x']=Graphics[_0x4764c1(0x802)]-(Graphics[_0x4764c1(0x802)]-Graphics[_0x4764c1(0x269)])/0x2-this[_0x4764c1(0x4f5)][_0x4764c1(0x802)]-0x4;},VisuMZ[_0x2bbd55(0x46a)]['Scene_Battle_skillWindowRect']=Scene_Battle['prototype'][_0x2bbd55(0x3e1)],Scene_Battle['prototype'][_0x2bbd55(0x3e1)]=function(){const _0x26e8f8=_0x2bbd55;if(this['battleLayoutStyle']()==='border')return this[_0x26e8f8(0x224)]();else return this[_0x26e8f8(0x556)]()?this[_0x26e8f8(0x2f6)]():VisuMZ[_0x26e8f8(0x46a)][_0x26e8f8(0x5b9)][_0x26e8f8(0x4f4)](this);},VisuMZ[_0x2bbd55(0x46a)]['Scene_Battle_itemWindowRect']=Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x45e)],Scene_Battle[_0x2bbd55(0x5d7)]['itemWindowRect']=function(){const _0x4e776a=_0x2bbd55;if(this[_0x4e776a(0x34a)]()===_0x4e776a(0x6bb))return this[_0x4e776a(0x224)]();else return this[_0x4e776a(0x556)]()?this[_0x4e776a(0x2f6)]():VisuMZ[_0x4e776a(0x46a)]['Scene_Battle_itemWindowRect'][_0x4e776a(0x4f4)](this);},Scene_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x556)]=function(){const _0x439c49=_0x2bbd55;return VisuMZ['BattleCore'][_0x439c49(0x55b)]['BattleLayout']['SkillItemMiddleLayout'];},Scene_Battle['prototype'][_0x2bbd55(0x2f6)]=function(){const _0x262ee6=_0x2bbd55,_0x35bf0a=Sprite_Button[_0x262ee6(0x5d7)]['blockWidth']()*0x2+0x4;let _0x36523c=Graphics['boxWidth']-_0x35bf0a;Imported[_0x262ee6(0x7c3)]&&SceneManager[_0x262ee6(0x1a7)]()&&(_0x36523c+=_0x35bf0a);const _0x313dfc=this[_0x262ee6(0x536)](),_0x28ab31=Graphics[_0x262ee6(0x50e)]-_0x313dfc-this[_0x262ee6(0x2aa)]()[_0x262ee6(0x6c3)]+Window_BattleStatus['prototype'][_0x262ee6(0x6f1)](),_0x3390f0=0x0;return new Rectangle(_0x3390f0,_0x313dfc,_0x36523c,_0x28ab31);},Scene_Battle[_0x2bbd55(0x5d7)]['createEnemyNameContainer']=function(){const _0x10f29f=_0x2bbd55;this[_0x10f29f(0x6e2)]=new Sprite(),this[_0x10f29f(0x6e2)]['x']=this[_0x10f29f(0x473)]['x'],this['_enemyNameContainer']['y']=this['_windowLayer']['y'];const _0x3d9a8e=this['children'][_0x10f29f(0x280)](this[_0x10f29f(0x473)]);this['addChildAt'](this[_0x10f29f(0x6e2)],_0x3d9a8e);for(let _0x57a87e=0x0;_0x57a87e<0x8;_0x57a87e++){const _0x125e8d=new Window_EnemyName(_0x57a87e);this[_0x10f29f(0x6e2)]['addChild'](_0x125e8d);}},Sprite_Battler[_0x2bbd55(0x2a7)]=VisuMZ['BattleCore'][_0x2bbd55(0x55b)][_0x2bbd55(0x843)]['MotionSpeed'],VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x244)]=Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x2e9)],Sprite_Battler[_0x2bbd55(0x5d7)]['initMembers']=function(){const _0xbd8c8c=_0x2bbd55;VisuMZ['BattleCore'][_0xbd8c8c(0x244)][_0xbd8c8c(0x4f4)](this),this[_0xbd8c8c(0x23e)]();if(this[_0xbd8c8c(0x409)]===Sprite_Enemy)this[_0xbd8c8c(0x546)]();this[_0xbd8c8c(0x47f)]();},Sprite_Battler[_0x2bbd55(0x5d7)]['initMembersBattleCore']=function(){const _0x4022bb=_0x2bbd55;this[_0x4022bb(0x34b)]=0x0,this[_0x4022bb(0x71a)]=0x0,this[_0x4022bb(0x529)]=0x0,this['_targetFloatHeight']=0x0,this['_floatDuration']=0x0,this[_0x4022bb(0x50a)]=0x0,this[_0x4022bb(0x5a0)]=_0x4022bb(0x483),this['_jumpHeight']=0x0,this[_0x4022bb(0x874)]=0x0,this['_jumpDuration']=0x0,this[_0x4022bb(0x46f)]=0x0,this[_0x4022bb(0x818)]=0xff,this['_opacityDuration']=0x0,this[_0x4022bb(0x7e0)]=0x0,this[_0x4022bb(0x82e)]='Linear',this[_0x4022bb(0x677)]=0x0,this[_0x4022bb(0x1af)]=0x0,this[_0x4022bb(0x813)]=0x0,this[_0x4022bb(0x4f2)]=0x0,this['_angleEasing']='Linear',this[_0x4022bb(0x347)]=!![],this[_0x4022bb(0x394)]=0x0,this[_0x4022bb(0x76f)]=0x0,this[_0x4022bb(0x15f)]=0x0,this['_targetSkewY']=0x0,this['_skewDuration']=0x0,this[_0x4022bb(0x407)]=0x0,this[_0x4022bb(0x6f5)]='Linear',this['_growX']=0x1,this[_0x4022bb(0x4b0)]=0x1,this[_0x4022bb(0x408)]=0x1,this[_0x4022bb(0x670)]=0x1,this[_0x4022bb(0x279)]=0x0,this[_0x4022bb(0x1eb)]=0x0,this[_0x4022bb(0x448)]=_0x4022bb(0x483),this[_0x4022bb(0x198)]=0x1;},Sprite_Battler['prototype'][_0x2bbd55(0x546)]=function(){const _0x2c1d86=_0x2bbd55;this['_shadowSprite']=new Sprite(),this[_0x2c1d86(0x2f0)][_0x2c1d86(0x190)]=ImageManager[_0x2c1d86(0x43a)](_0x2c1d86(0x218)),this[_0x2c1d86(0x2f0)][_0x2c1d86(0x190)]['smooth']=VisuMZ[_0x2c1d86(0x46a)]['Settings']['Actor'][_0x2c1d86(0x4c7)],this[_0x2c1d86(0x2f0)][_0x2c1d86(0x5e5)]['x']=0.5,this['_shadowSprite']['anchor']['y']=0.5,this[_0x2c1d86(0x2f0)]['y']=-0x2,this[_0x2c1d86(0x2f0)]['visible']=![],this[_0x2c1d86(0x3e4)](this[_0x2c1d86(0x2f0)]);},Sprite_Battler['prototype'][_0x2bbd55(0x47f)]=function(){const _0x4ee970=_0x2bbd55;this[_0x4ee970(0x146)]=new Sprite(),this[_0x4ee970(0x146)][_0x4ee970(0x5e5)]['x']=0.5,this[_0x4ee970(0x146)][_0x4ee970(0x5e5)]['y']=0.5,this['addChild'](this[_0x4ee970(0x146)]);},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x55e)]=function(){const _0x38c4a2=_0x2bbd55;if(!this['_distortionSprite'])return;if(this[_0x38c4a2(0x2f0)]){const _0x34fd45=this[_0x38c4a2(0x743)](this[_0x38c4a2(0x146)]);this['addChildAt'](this[_0x38c4a2(0x2f0)],_0x34fd45),this['updateShadowVisibility']();}this['_svBattlerSprite']&&this[_0x38c4a2(0x146)]['addChild'](this[_0x38c4a2(0x1a9)]),this[_0x38c4a2(0x337)]&&this['_distortionSprite']['addChild'](this[_0x38c4a2(0x337)]),this[_0x38c4a2(0x6fc)]&&this[_0x38c4a2(0x146)]['addChild'](this[_0x38c4a2(0x6fc)]),this[_0x38c4a2(0x67c)]&&this['_distortionSprite'][_0x38c4a2(0x3e4)](this[_0x38c4a2(0x67c)]);},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x365)]=function(){const _0xecba84=_0x2bbd55;if(!this[_0xecba84(0x2f0)])return;if(this[_0xecba84(0x110)]&&this['_battler'][_0xecba84(0x46b)]()){const _0x3e8eb4=this[_0xecba84(0x2f0)][_0xecba84(0x190)];this[_0xecba84(0x2f0)][_0xecba84(0x3da)](0x0,0x0,_0x3e8eb4['width'],_0x3e8eb4['height']);}else this['_shadowSprite'][_0xecba84(0x3da)](0x0,0x0,0x0,0x0);},Sprite_Battler['prototype'][_0x2bbd55(0x296)]=function(){const _0x228c85=_0x2bbd55;return SceneManager['isSceneBattle']()?SceneManager[_0x228c85(0x750)]['_spriteset'][_0x228c85(0x57a)]:this[_0x228c85(0x437)];},Sprite_Battler['prototype'][_0x2bbd55(0x116)]=function(_0x19ac93,_0x1539e0){const _0x543066=_0x2bbd55;if(!this[_0x543066(0x110)]['isSpriteVisible']())return;const _0x464f80=VisuMZ[_0x543066(0x46a)][_0x543066(0x55b)]['Damage'],_0x266552=new Sprite_Damage();_0x266552[_0x543066(0x213)]=_0x464f80[_0x543066(0x33e)],this[_0x543066(0x738)](_0x266552),_0x266552[_0x543066(0x116)](_0x19ac93,_0x1539e0),this[_0x543066(0x481)](_0x266552);},Sprite_Battler[_0x2bbd55(0x5d7)]['setupIconTextPopup']=function(_0x33bcf4,_0x46cfb2,_0xf36eed){const _0x4a83e8=_0x2bbd55;if(!this['_battler']['isSpriteVisible']())return;const _0x419645=VisuMZ[_0x4a83e8(0x46a)][_0x4a83e8(0x55b)][_0x4a83e8(0x14a)],_0x27b5c3=new Sprite_Damage();_0x27b5c3[_0x4a83e8(0x213)]=_0x419645[_0x4a83e8(0x33e)],this[_0x4a83e8(0x738)](_0x27b5c3),_0x27b5c3[_0x4a83e8(0x162)](_0x33bcf4,_0x46cfb2,_0xf36eed),this[_0x4a83e8(0x481)](_0x27b5c3);},Sprite_Battler[_0x2bbd55(0x5d7)]['setupDamagePopup']=function(){const _0x5a5b7e=_0x2bbd55;if(!this[_0x5a5b7e(0x110)]['isDamagePopupRequested']())return;while(this['_battler'][_0x5a5b7e(0x256)]()){this[_0x5a5b7e(0x110)][_0x5a5b7e(0x819)]()&&this[_0x5a5b7e(0x6ce)]();}this[_0x5a5b7e(0x110)][_0x5a5b7e(0x850)](),this[_0x5a5b7e(0x110)][_0x5a5b7e(0x574)]();},Sprite_Battler[_0x2bbd55(0x5d7)]['createDamageSprite']=function(){const _0x523670=_0x2bbd55,_0x74f5c1=VisuMZ[_0x523670(0x46a)][_0x523670(0x55b)]['Damage'],_0x2a122d=new Sprite_Damage();_0x2a122d['_duration']=_0x74f5c1[_0x523670(0x33e)],this['sortDamageSprites'](_0x2a122d),_0x2a122d[_0x523670(0x76c)](this[_0x523670(0x110)]),_0x2a122d[_0x523670(0x484)](this['_battler']),this[_0x523670(0x481)](_0x2a122d);},Sprite_Battler['prototype'][_0x2bbd55(0x481)]=function(_0x1841b7){const _0x1acc02=_0x2bbd55;this[_0x1acc02(0x660)][_0x1acc02(0x786)](_0x1841b7);if(this[_0x1acc02(0x65e)]())SceneManager[_0x1acc02(0x750)]['_statusWindow'][_0x1acc02(0x481)](_0x1841b7,this[_0x1acc02(0x110)]);else{this[_0x1acc02(0x296)]()['addChild'](_0x1841b7);if(SceneManager['isBattleFlipped']())_0x1841b7[_0x1acc02(0x1ae)]['x']=-0x1;}},Sprite_Battler[_0x2bbd55(0x5d7)]['isShownOnBattlePortrait']=function(){const _0x191f19=_0x2bbd55;return!$gameSystem[_0x191f19(0x2e6)]()&&this['_battler']&&this[_0x191f19(0x110)][_0x191f19(0x101)]();},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x738)]=function(_0x15f682){const _0x2e0996=_0x2bbd55,_0x148a03=VisuMZ['BattleCore']['Settings'][_0x2e0996(0x14a)],_0x511ca8=SceneManager[_0x2e0996(0x2fd)]()?-0x1:0x1;let _0x1cf123=this['x'],_0x4cfe76=this['y'];const _0x5c35c8=SceneManager[_0x2e0996(0x750)][_0x2e0996(0x537)];if(_0x5c35c8&&this[_0x2e0996(0x437)]===_0x5c35c8){_0x1cf123+=_0x5c35c8['x']-this[_0x2e0996(0x570)]();const _0x488d44=_0x5c35c8[_0x2e0996(0x1a2)]()*0x3/0x4;_0x4cfe76=_0x5c35c8['y']+_0x488d44,_0x4cfe76=Math[_0x2e0996(0x4fa)](_0x4cfe76,_0x5c35c8['y']+this['y']-this['height']+_0x488d44);}_0x15f682['x']=Math['round'](_0x1cf123+this[_0x2e0996(0x570)]()*_0x511ca8),_0x15f682['y']=Math[_0x2e0996(0x86f)](_0x4cfe76+this['damageOffsetY']());if(_0x148a03[_0x2e0996(0x3c7)])for(const _0x9538f3 of this['_damages']){_0x9538f3['x']+=_0x148a03['PopupShiftX']*_0x511ca8,_0x9538f3['y']+=_0x148a03[_0x2e0996(0x313)];}else{const _0x32e881=this['_damages'][this[_0x2e0996(0x660)][_0x2e0996(0x5cf)]-0x1];_0x32e881&&(_0x15f682['x']=_0x32e881['x']+_0x148a03[_0x2e0996(0x6cd)]*_0x511ca8,_0x15f682['y']=_0x32e881['y']+_0x148a03[_0x2e0996(0x313)]);}},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x7cb)]=Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x570)],Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x570)]=function(){const _0x5ad1f4=_0x2bbd55;let _0x26d79a=VisuMZ['BattleCore']['Sprite_Battler_damageOffsetX']['call'](this),_0x20f4fb=VisuMZ[_0x5ad1f4(0x46a)][_0x5ad1f4(0x55b)]['Damage'][_0x5ad1f4(0x539)]||0x0;return Math['round'](_0x26d79a+_0x20f4fb);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x7bb)]=Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x26e)],Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x26e)]=function(){const _0xab0151=_0x2bbd55;let _0xd42d45=VisuMZ[_0xab0151(0x46a)][_0xab0151(0x7bb)][_0xab0151(0x4f4)](this);switch(VisuMZ['BattleCore'][_0xab0151(0x55b)]['Damage'][_0xab0151(0x2bb)]){case _0xab0151(0x331):_0xd42d45-=this[_0xab0151(0x6c3)]*this[_0xab0151(0x1ae)]['y'];break;case'center':_0xd42d45-=this[_0xab0151(0x6c3)]*this[_0xab0151(0x1ae)]['y']*0.5;break;}let _0x4d6bcb=VisuMZ[_0xab0151(0x46a)][_0xab0151(0x55b)][_0xab0151(0x14a)][_0xab0151(0x61e)]||0x0;return Math['round'](_0xd42d45+_0x4d6bcb);},Sprite_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x570)]=function(){const _0x3dd412=_0x2bbd55;return Sprite_Battler[_0x3dd412(0x5d7)][_0x3dd412(0x570)]['call'](this);},Sprite_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x26e)]=function(){const _0x346594=_0x2bbd55;return Sprite_Battler[_0x346594(0x5d7)][_0x346594(0x26e)][_0x346594(0x4f4)](this);},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x2df)]=function(_0x50af81){const _0x56817b=_0x2bbd55;this['isShownOnBattlePortrait']()?SceneManager['_scene'][_0x56817b(0x537)]['removeDamageSprite'](_0x50af81):(this['damageContainer']()[_0x56817b(0x565)](_0x50af81),this[_0x56817b(0x660)][_0x56817b(0x530)](_0x50af81),_0x50af81[_0x56817b(0x640)]());},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x260)]=Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x873)],Sprite_Battler[_0x2bbd55(0x5d7)]['setHome']=function(_0x284633,_0x364355){const _0x5aa18b=_0x2bbd55,_0x1ea2cf=VisuMZ[_0x5aa18b(0x46a)][_0x5aa18b(0x55b)];if(this[_0x5aa18b(0x409)]===Sprite_Actor)_0x284633+=_0x1ea2cf[_0x5aa18b(0x843)][_0x5aa18b(0x6ed)]||0x0,_0x364355+=_0x1ea2cf[_0x5aa18b(0x843)][_0x5aa18b(0x2cf)]||0x0;else this['constructor']===Sprite_Enemy&&(_0x284633+=_0x1ea2cf[_0x5aa18b(0x37f)][_0x5aa18b(0x6ed)]||0x0,_0x364355+=_0x1ea2cf[_0x5aa18b(0x37f)][_0x5aa18b(0x2cf)]||0x0);VisuMZ[_0x5aa18b(0x46a)][_0x5aa18b(0x260)][_0x5aa18b(0x4f4)](this,_0x284633,_0x364355);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x4c6)]=Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x12d)],Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x12d)]=function(){const _0x624e01=_0x2bbd55;VisuMZ['BattleCore'][_0x624e01(0x4c6)][_0x624e01(0x4f4)](this),!this[_0x624e01(0x110)]&&this[_0x624e01(0x732)]&&(this[_0x624e01(0x732)][_0x624e01(0x4fd)]=![]);},VisuMZ[_0x2bbd55(0x46a)]['Sprite_Battler_updateMain']=Sprite_Battler[_0x2bbd55(0x5d7)]['updateMain'],Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x5b3)]=function(){const _0x24eecf=_0x2bbd55;this[_0x24eecf(0x770)](),this['updateSkew'](),this[_0x24eecf(0x641)](),this['updateFlip'](),this[_0x24eecf(0x38f)](),VisuMZ['BattleCore'][_0x24eecf(0x852)][_0x24eecf(0x4f4)](this);if(this[_0x24eecf(0x409)]===Sprite_Enemy)this[_0x24eecf(0x5aa)]();},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x476)]=Sprite_Battler['prototype'][_0x2bbd55(0x73c)],Sprite_Battler[_0x2bbd55(0x5d7)]['updatePosition']=function(){const _0xd2cf17=_0x2bbd55;VisuMZ['BattleCore'][_0xd2cf17(0x476)][_0xd2cf17(0x4f4)](this),this['updatePositionBattleCore'](),this[_0xd2cf17(0x42b)]();},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x6a6)]=function(){const _0x1be704=_0x2bbd55;this[_0x1be704(0x34b)]=this['x'],this['_baseY']=this['y'],this[_0x1be704(0x221)](),this[_0x1be704(0x50b)](),this['x']+=this[_0x1be704(0x78d)](),this['y']+=this[_0x1be704(0x1bb)](),this['x']=Math[_0x1be704(0x86f)](this['x']),this['y']=Math[_0x1be704(0x86f)](this['y']);},Sprite_Battler['prototype'][_0x2bbd55(0x78d)]=function(){let _0x319c37=0x0;return _0x319c37;},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x1bb)]=function(){const _0x25a982=_0x2bbd55;let _0x4d4415=0x0;this[_0x25a982(0x110)]&&!this['_battler'][_0x25a982(0x2c3)]()&&(_0x4d4415-=this[_0x25a982(0x529)],_0x4d4415-=this[_0x25a982(0x669)]);if(this['_distortionSprite']&&this[_0x25a982(0x409)]!==Sprite_SvEnemy){const _0x3084da=this['_distortionSprite'][_0x25a982(0x1ae)]['y'];_0x4d4415-=(_0x3084da-0x1)*this[_0x25a982(0x6c3)];}return _0x4d4415;},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x211)]=function(){const _0x106857=_0x2bbd55,_0x1cd910=this['_battler']&&this[_0x106857(0x110)][_0x106857(0x7f1)]();this[_0x106857(0x198)]=(_0x1cd910?-0x1:0x1)*Math[_0x106857(0x241)](this['scale']['x']);},Sprite_Battler['prototype']['startFloat']=function(_0x4cf19e,_0xfdec2c,_0x3c54b1){const _0x3321ad=_0x2bbd55;if(!this['canMove']())return;if(this[_0x3321ad(0x53b)]===_0x4cf19e)return;this[_0x3321ad(0x53b)]=_0x4cf19e,this[_0x3321ad(0x7af)]=_0xfdec2c,this[_0x3321ad(0x50a)]=_0xfdec2c,this['_floatEasing']=_0x3c54b1||_0x3321ad(0x483);if(_0xfdec2c<=0x0)this[_0x3321ad(0x529)]=_0x4cf19e;},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x221)]=function(){const _0x3511b6=_0x2bbd55;if(this[_0x3511b6(0x7af)]<=0x0)return;const _0x25de9b=this['_floatDuration'],_0xe21ebe=this[_0x3511b6(0x50a)],_0x3713ff=this['_floatEasing'];Imported['VisuMZ_0_CoreEngine']?this[_0x3511b6(0x529)]=this['applyEasing'](this['_floatHeight'],this[_0x3511b6(0x53b)],_0x25de9b,_0xe21ebe,_0x3713ff):this['_floatHeight']=(this['_floatHeight']*(_0x25de9b-0x1)+this[_0x3511b6(0x53b)])/_0x25de9b;this[_0x3511b6(0x7af)]--;if(this[_0x3511b6(0x7af)]<=0x0)this[_0x3511b6(0x135)]();},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x135)]=function(){this['_floatHeight']=this['_targetFloatHeight'];},Sprite_Battler[_0x2bbd55(0x5d7)]['isFloating']=function(){const _0x1cf574=_0x2bbd55;return this[_0x1cf574(0x7af)]>0x0;},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x4a2)]=function(_0x35f0e1,_0xb31fcf){const _0x3c2360=_0x2bbd55;if(!this[_0x3c2360(0x115)]())return;if(_0xb31fcf<=0x0)return;this[_0x3c2360(0x874)]=_0x35f0e1,this[_0x3c2360(0x1bf)]=_0xb31fcf,this['_jumpWholeDuration']=_0xb31fcf;},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x50b)]=function(){const _0x119fc9=_0x2bbd55;if(this[_0x119fc9(0x1bf)]<=0x0)return;const _0x27b88b=this[_0x119fc9(0x46f)]-this['_jumpDuration'],_0x106ecb=this['_jumpWholeDuration']/0x2,_0x376ccc=this[_0x119fc9(0x874)],_0x4ed478=-_0x376ccc/Math[_0x119fc9(0x7f2)](_0x106ecb,0x2);this[_0x119fc9(0x669)]=_0x4ed478*Math[_0x119fc9(0x7f2)](_0x27b88b-_0x106ecb,0x2)+_0x376ccc,this[_0x119fc9(0x1bf)]--;if(this[_0x119fc9(0x1bf)]<=0x0)return this['onJumpEnd']();},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x84c)]=function(){const _0x317004=_0x2bbd55;this[_0x317004(0x669)]=0x0;},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x587)]=function(){return this['_jumpDuration']>0x0;},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x30f)]=function(_0x1b4384,_0x5b6fec,_0x321e9b){const _0x11c918=_0x2bbd55;if(this[_0x11c918(0x818)]===_0x1b4384)return;this['_targetOpacity']=_0x1b4384,this['_opacityDuration']=_0x5b6fec,this['_opacityWholeDuration']=_0x5b6fec,this[_0x11c918(0x82e)]=_0x321e9b||_0x11c918(0x483);if(_0x5b6fec<=0x0)this['opacity']=_0x1b4384;},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x42b)]=function(){const _0xfab89b=_0x2bbd55;if(this[_0xfab89b(0x789)]<=0x0)return;const _0x983ec0=this[_0xfab89b(0x789)],_0x36b3aa=this[_0xfab89b(0x7e0)],_0x351bfd=this[_0xfab89b(0x82e)];Imported[_0xfab89b(0x7c3)]?this[_0xfab89b(0x694)]=this[_0xfab89b(0x774)](this[_0xfab89b(0x694)],this[_0xfab89b(0x818)],_0x983ec0,_0x36b3aa,_0x351bfd):this['opacity']=(this['opacity']*(_0x983ec0-0x1)+this[_0xfab89b(0x818)])/_0x983ec0;this[_0xfab89b(0x789)]--;if(this[_0xfab89b(0x789)]<=0x0)this[_0xfab89b(0x44f)]();},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x44f)]=function(){const _0x811ff9=_0x2bbd55;this[_0x811ff9(0x694)]=this[_0x811ff9(0x818)];},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x20d)]=function(){const _0x52ba65=_0x2bbd55;return this[_0x52ba65(0x789)]>0x0;},Sprite_Battler['prototype'][_0x2bbd55(0x5aa)]=function(){const _0x3310ba=_0x2bbd55;this[_0x3310ba(0x2f0)][_0x3310ba(0x4fd)]=this[_0x3310ba(0x110)][_0x3310ba(0x3d7)](),this[_0x3310ba(0x77f)]();},Sprite_Battler['prototype'][_0x2bbd55(0x77f)]=function(){const _0x4ad37a=_0x2bbd55;if(!this[_0x4ad37a(0x2f0)])return;this[_0x4ad37a(0x2f0)]['y']=Math['round'](-this[_0x4ad37a(0x1bb)]()-0x2);},Sprite_Battler['prototype']['updateScale']=function(){const _0x148aa7=_0x2bbd55;if(this['constructor']===Sprite_SvEnemy)return;this[_0x148aa7(0x47e)](),this[_0x148aa7(0x184)]();},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x184)]=function(){const _0x1172ff=_0x2bbd55,_0x330a0c=this['_distortionSprite'];_0x330a0c&&(_0x330a0c[_0x1172ff(0x1ae)]['x']=this[_0x1172ff(0x4cd)](),_0x330a0c[_0x1172ff(0x1ae)]['y']=this[_0x1172ff(0x769)]());},Sprite_Battler[_0x2bbd55(0x5d7)]['mainSpriteScaleX']=function(){const _0x2c9855=_0x2bbd55;let _0xfb517a=0x1;return _0xfb517a*=this[_0x2c9855(0x198)],_0xfb517a*=this[_0x2c9855(0x4e6)],_0xfb517a;},Sprite_Battler[_0x2bbd55(0x5d7)]['mainSpriteScaleY']=function(){const _0x3a97fe=_0x2bbd55;return 0x1*this[_0x3a97fe(0x4b0)];},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x685)]=function(){const _0x774ecd=_0x2bbd55;return this[_0x774ecd(0x802)]*this[_0x774ecd(0x4cd)]();},Sprite_Battler[_0x2bbd55(0x5d7)]['mainSpriteHeight']=function(){return this['height']*this['mainSpriteScaleY']();},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x5ea)]=function(_0x492586,_0x41ae31,_0x3504db,_0x221f0d){const _0x368b8c=_0x2bbd55;if(!this[_0x368b8c(0x115)]())return;if(!this[_0x368b8c(0x146)])return;if(this['_targetGrowX']===_0x492586&&this[_0x368b8c(0x670)]===_0x41ae31)return;this[_0x368b8c(0x408)]=_0x492586,this[_0x368b8c(0x670)]=_0x41ae31,this[_0x368b8c(0x279)]=_0x3504db,this[_0x368b8c(0x1eb)]=_0x3504db,this[_0x368b8c(0x448)]=_0x221f0d||'Linear',_0x3504db<=0x0&&(this['_growX']=this['_targetGrowX'],this[_0x368b8c(0x4b0)]=this['_targetGrowY']);},Sprite_Battler['prototype'][_0x2bbd55(0x47e)]=function(){const _0x276091=_0x2bbd55;if(this[_0x276091(0x279)]<=0x0)return;if(!this['_distortionSprite'])return;const _0x69c5c2=this['_growDuration'],_0xbc3c95=this['_growWholeDuration'],_0x22b3cc=this['_growEasing'];Imported[_0x276091(0x7c3)]?(this[_0x276091(0x4e6)]=this['applyEasing'](this['_growX'],this[_0x276091(0x408)],_0x69c5c2,_0xbc3c95,_0x22b3cc),this[_0x276091(0x4b0)]=this[_0x276091(0x774)](this[_0x276091(0x4b0)],this['_targetGrowY'],_0x69c5c2,_0xbc3c95,_0x22b3cc)):(this[_0x276091(0x4e6)]=(this['_growX']*(_0x69c5c2-0x1)+this[_0x276091(0x408)])/_0x69c5c2,this[_0x276091(0x4b0)]=(this['_growY']*(_0x69c5c2-0x1)+this[_0x276091(0x670)])/_0x69c5c2);this[_0x276091(0x279)]--;if(this[_0x276091(0x279)]<=0x0)this[_0x276091(0x6f9)]();},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x6f9)]=function(){const _0x4f5895=_0x2bbd55;this['_growX']=this[_0x4f5895(0x408)],this[_0x4f5895(0x4b0)]=this[_0x4f5895(0x670)];},Sprite_Battler[_0x2bbd55(0x5d7)]['isGrowing']=function(){const _0x26141a=_0x2bbd55;return this[_0x26141a(0x279)]>0x0;},Sprite_Battler[_0x2bbd55(0x5d7)]['startSkew']=function(_0xacadf2,_0x188bad,_0x53df86,_0x25d824){const _0x4d1bb4=_0x2bbd55;if(!this['canMove']())return;if(!this['_distortionSprite'])return;if(this['_targetSkewX']===_0xacadf2&&this['_targetSkewY']===_0x188bad)return;this[_0x4d1bb4(0x15f)]=_0xacadf2,this['_targetSkewY']=_0x188bad,this[_0x4d1bb4(0x4c8)]=_0x53df86,this[_0x4d1bb4(0x407)]=_0x53df86,this[_0x4d1bb4(0x6f5)]=_0x25d824||'Linear',_0x53df86<=0x0&&(this['_distortionSprite'][_0x4d1bb4(0x592)]['x']=this[_0x4d1bb4(0x15f)],this['_distortionSprite'][_0x4d1bb4(0x592)]['y']=this[_0x4d1bb4(0x6a0)]);},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x47b)]=function(){const _0x1244a9=_0x2bbd55;if(this['_skewDuration']<=0x0)return;if(!this['_distortionSprite'])return;const _0x55d7f1=this[_0x1244a9(0x4c8)],_0xc46d10=this[_0x1244a9(0x407)],_0x2473a9=this[_0x1244a9(0x6f5)],_0x38bc3a=this[_0x1244a9(0x146)];Imported[_0x1244a9(0x7c3)]?(_0x38bc3a['skew']['x']=this[_0x1244a9(0x774)](_0x38bc3a[_0x1244a9(0x592)]['x'],this['_targetSkewX'],_0x55d7f1,_0xc46d10,_0x2473a9),_0x38bc3a[_0x1244a9(0x592)]['y']=this['applyEasing'](_0x38bc3a[_0x1244a9(0x592)]['y'],this[_0x1244a9(0x6a0)],_0x55d7f1,_0xc46d10,_0x2473a9)):(_0x38bc3a[_0x1244a9(0x592)]['x']=(_0x38bc3a['skew']['x']*(_0x55d7f1-0x1)+this[_0x1244a9(0x15f)])/_0x55d7f1,_0x38bc3a[_0x1244a9(0x592)]['y']=(_0x38bc3a[_0x1244a9(0x592)]['y']*(_0x55d7f1-0x1)+this[_0x1244a9(0x6a0)])/_0x55d7f1);this[_0x1244a9(0x4c8)]--;if(this['_skewDuration']<=0x0)this[_0x1244a9(0x100)]();},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x100)]=function(){const _0x8d1d51=_0x2bbd55;this[_0x8d1d51(0x146)][_0x8d1d51(0x592)]['x']=this[_0x8d1d51(0x15f)],this['_distortionSprite'][_0x8d1d51(0x592)]['y']=this[_0x8d1d51(0x6a0)];},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x6da)]=function(){const _0x4ec495=_0x2bbd55;return this[_0x4ec495(0x4c8)]>0x0;},Sprite_Battler[_0x2bbd55(0x5d7)]['startSpin']=function(_0x2b709c,_0x252e58,_0x5c80d5,_0x3601dc){const _0x5ea1f1=_0x2bbd55;if(!this[_0x5ea1f1(0x115)]())return;if(!this['_distortionSprite'])return;if(this[_0x5ea1f1(0x1af)]===_0x2b709c)return;this['_targetAngle']=_0x2b709c,this[_0x5ea1f1(0x813)]=_0x252e58,this[_0x5ea1f1(0x4f2)]=_0x252e58,this[_0x5ea1f1(0x53e)]=_0x5c80d5||_0x5ea1f1(0x483),this['_angleRevertOnFinish']=_0x3601dc,this[_0x5ea1f1(0x347)]===undefined&&(this[_0x5ea1f1(0x347)]=!![]),_0x252e58<=0x0&&(this[_0x5ea1f1(0x677)]=_0x2b709c,this['_angleRevertOnFinish']&&(this['_targetAngle']=0x0,this[_0x5ea1f1(0x677)]=0x0));},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x641)]=function(){const _0x423e13=_0x2bbd55;this[_0x423e13(0x20b)](),this[_0x423e13(0x51b)]();},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x20b)]=function(){const _0x8c702c=_0x2bbd55;if(this[_0x8c702c(0x813)]<=0x0)return;const _0x11214e=this[_0x8c702c(0x813)],_0x5e7798=this['_angleWholeDuration'],_0x1d725c=this[_0x8c702c(0x53e)];Imported[_0x8c702c(0x7c3)]?this['_currentAngle']=this['applyEasing'](this['_currentAngle'],this[_0x8c702c(0x1af)],_0x11214e,_0x5e7798,_0x1d725c):this[_0x8c702c(0x677)]=(this[_0x8c702c(0x677)]*(_0x11214e-0x1)+this[_0x8c702c(0x1af)])/_0x11214e;this[_0x8c702c(0x813)]--;if(this['_angleDuration']<=0x0)this['onAngleEnd']();},Sprite_Battler[_0x2bbd55(0x5d7)]['onAngleEnd']=function(){const _0x2b8a64=_0x2bbd55;this[_0x2b8a64(0x677)]=this[_0x2b8a64(0x1af)],this[_0x2b8a64(0x347)]&&(this[_0x2b8a64(0x1af)]=0x0,this['_currentAngle']=0x0);},Sprite_Battler[_0x2bbd55(0x5d7)]['isSpinning']=function(){const _0x26d672=_0x2bbd55;return this[_0x26d672(0x813)]>0x0;},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x51b)]=function(){const _0x2a5fec=_0x2bbd55;if(!this[_0x2a5fec(0x146)])return;const _0x1c575c=this[_0x2a5fec(0x677)],_0x8b3fc5=this['scale']['x'],_0x27ddec=this['_battler']['isActor']()?-0x1:0x1;this['_distortionSprite'][_0x2a5fec(0x603)]=_0x1c575c*_0x8b3fc5*_0x27ddec;const _0x33326a=this[_0x2a5fec(0x146)][_0x2a5fec(0x1ae)]['y'];this['_distortionSprite']['y']=this['height']*-0.5*(0x2-_0x33326a);const _0x34fd8c=[this[_0x2a5fec(0x6fc)],this[_0x2a5fec(0x1a9)],this[_0x2a5fec(0x67c)]];for(const _0xd62371 of _0x34fd8c){if(!_0xd62371)continue;_0xd62371['y']=this['height']*0.5;}this['_shadowSprite']&&(this[_0x2a5fec(0x2f0)][_0x2a5fec(0x1ae)]['x']=this['_distortionSprite'][_0x2a5fec(0x1ae)]['x'],this[_0x2a5fec(0x2f0)][_0x2a5fec(0x1ae)]['y']=this[_0x2a5fec(0x146)][_0x2a5fec(0x1ae)]['y']);},VisuMZ['BattleCore'][_0x2bbd55(0x2ed)]=Sprite_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x64c)],Sprite_Actor['prototype'][_0x2bbd55(0x64c)]=function(){const _0x1ca515=_0x2bbd55;VisuMZ[_0x1ca515(0x46a)]['Sprite_Actor_createStateSprite']['call'](this),VisuMZ[_0x1ca515(0x46a)]['Settings'][_0x1ca515(0x58a)]['ShowActorGauge']&&this[_0x1ca515(0x2e5)]();},VisuMZ[_0x2bbd55(0x46a)]['Sprite_Enemy_createStateIconSprite']=Sprite_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x249)],Sprite_Enemy[_0x2bbd55(0x5d7)]['createStateIconSprite']=function(){const _0x156e4f=_0x2bbd55;VisuMZ['BattleCore'][_0x156e4f(0x55b)][_0x156e4f(0x58a)][_0x156e4f(0x83e)]&&this[_0x156e4f(0x2e5)](),VisuMZ[_0x156e4f(0x46a)]['Sprite_Enemy_createStateIconSprite'][_0x156e4f(0x4f4)](this);},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x2e5)]=function(){const _0x45c02f=_0x2bbd55;if(!ConfigManager[_0x45c02f(0x3ec)])return;if(this[_0x45c02f(0x409)]===Sprite_SvEnemy)return;const _0x5ad5b7=VisuMZ[_0x45c02f(0x46a)][_0x45c02f(0x55b)][_0x45c02f(0x58a)],_0x18b21c=new Sprite_HpGauge();_0x18b21c[_0x45c02f(0x5e5)]['x']=_0x5ad5b7['AnchorX'],_0x18b21c['anchor']['y']=_0x5ad5b7['AnchorY'],_0x18b21c[_0x45c02f(0x1ae)]['x']=_0x18b21c[_0x45c02f(0x1ae)]['y']=_0x5ad5b7[_0x45c02f(0x2c8)],this[_0x45c02f(0x732)]=_0x18b21c,this[_0x45c02f(0x3e4)](this[_0x45c02f(0x732)]);},VisuMZ['BattleCore'][_0x2bbd55(0x38b)]=Sprite_Battler['prototype']['setBattler'],Sprite_Battler[_0x2bbd55(0x5d7)]['setBattler']=function(_0x41606d){const _0x4f476c=_0x2bbd55;VisuMZ['BattleCore']['Sprite_Battler_setBattler'][_0x4f476c(0x4f4)](this,_0x41606d),this[_0x4f476c(0x108)](_0x41606d);},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x108)]=function(_0x10d976){const _0x36d07a=_0x2bbd55;if(!_0x10d976)return;if(!this[_0x36d07a(0x732)])return;if(_0x10d976['isActor']()){}else{if(_0x10d976[_0x36d07a(0x2ba)]()){if(this['constructor']===Sprite_SvEnemy&&!_0x10d976[_0x36d07a(0x3d7)]())return;}}this[_0x36d07a(0x732)][_0x36d07a(0x76c)](_0x10d976,'hp');},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x38f)]=function(){const _0x3bffee=_0x2bbd55;if(!this[_0x3bffee(0x110)])return;if(!this[_0x3bffee(0x732)])return;const _0x31d94f=VisuMZ[_0x3bffee(0x46a)][_0x3bffee(0x55b)]['HpGauge'],_0x3435d2=this[_0x3bffee(0x732)];_0x3435d2[_0x3bffee(0x4fd)]=this[_0x3bffee(0x582)]();const _0x1cca44=_0x31d94f[_0x3bffee(0x6ed)],_0x2c2cbd=_0x31d94f[_0x3bffee(0x2cf)];_0x3435d2['x']=_0x1cca44,_0x3435d2['x']+=this[_0x3bffee(0x110)][_0x3bffee(0x3f9)](),_0x3435d2['y']=-this['height']+_0x2c2cbd,_0x3435d2['y']+=this['_battler'][_0x3bffee(0x510)]();},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x582)]=function(){const _0xbe6116=_0x2bbd55;if(!this[_0xbe6116(0x110)])return![];if(this[_0xbe6116(0x110)][_0xbe6116(0x101)]())return!![];const _0x27b3e7=this[_0xbe6116(0x110)][_0xbe6116(0x64d)]()[_0xbe6116(0x11b)];if(_0x27b3e7[_0xbe6116(0x87d)](/<SHOW HP GAUGE>/i))return!![];if(_0x27b3e7[_0xbe6116(0x87d)](/<HIDE HP GAUGE>/i))return![];const _0x2636e3=VisuMZ[_0xbe6116(0x46a)][_0xbe6116(0x55b)][_0xbe6116(0x58a)];if(_0x2636e3[_0xbe6116(0x58b)]){if(_0x2636e3[_0xbe6116(0x354)]&&BattleManager['isBattleTest']())return!![];if(this[_0xbe6116(0x110)][_0xbe6116(0x51f)])return![];return this['_battler']['hasBeenDefeatedBefore']();}return!![];},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x494)]=Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x1cc)],Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x1cc)]=function(){const _0x278a1c=_0x2bbd55;if(!this[_0x278a1c(0x110)])return![];return VisuMZ['BattleCore'][_0x278a1c(0x494)]['call'](this);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x152)]=Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x1b1)],Sprite_Battler[_0x2bbd55(0x5d7)]['startMove']=function(_0x8512d5,_0x34e559,_0x4a188d){const _0x1dee14=_0x2bbd55;this[_0x1dee14(0x115)]()&&VisuMZ[_0x1dee14(0x46a)][_0x1dee14(0x152)]['call'](this,_0x8512d5,_0x34e559,_0x4a188d);},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x115)]=function(){const _0x75ab4a=_0x2bbd55;if(this[_0x75ab4a(0x110)]&&this['_battler'][_0x75ab4a(0x81e)]())return![];if(this[_0x75ab4a(0x110)]&&!this[_0x75ab4a(0x110)]['canBattlerMove']())return![];return $gameSystem[_0x75ab4a(0x2e6)]();},Sprite_Battler[_0x2bbd55(0x5d7)]['stepForward']=function(){},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x38d)]=function(){this['startMove'](0x0,0x0,0xc);},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x19b)]=function(){},Sprite_Battler[_0x2bbd55(0x5d7)][_0x2bbd55(0x2b4)]=function(){const _0x2f692c=_0x2bbd55,_0x13ad64=VisuMZ[_0x2f692c(0x46a)][_0x2f692c(0x55b)]['Actor'],_0x53a685=this[_0x2f692c(0x110)]&&this[_0x2f692c(0x110)]['isActor']()?0x1:-0x1,_0x24d377=this[_0x2f692c(0x34b)]-this[_0x2f692c(0x10d)]+_0x53a685*_0x13ad64['FlinchDistanceX'],_0x3b55a3=this[_0x2f692c(0x71a)]-this[_0x2f692c(0x59e)]+_0x53a685*_0x13ad64['FlinchDistanceY'],_0x34c093=_0x13ad64[_0x2f692c(0x3de)];this[_0x2f692c(0x1b1)](_0x24d377,_0x3b55a3,_0x34c093);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x619)]=Sprite_Actor['prototype'][_0x2bbd55(0x2e9)],Sprite_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x2e9)]=function(){const _0x57c6c3=_0x2bbd55;VisuMZ['BattleCore'][_0x57c6c3(0x619)][_0x57c6c3(0x4f4)](this),this[_0x57c6c3(0x55e)]();},Sprite_Actor['prototype'][_0x2bbd55(0x4d8)]=function(){return this['_distortionSprite']||this['_mainSprite']||this;},VisuMZ[_0x2bbd55(0x46a)]['Sprite_Actor_moveToStartPosition']=Sprite_Actor[_0x2bbd55(0x5d7)]['moveToStartPosition'],Sprite_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x201)]=function(){},Sprite_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x86d)]=function(_0x43dd66){const _0x41525f=_0x2bbd55;if(SceneManager[_0x41525f(0x31f)]())return;if(!_0x43dd66)return;if(!_0x43dd66['canMove']())return;VisuMZ['BattleCore'][_0x41525f(0x551)][_0x41525f(0x4f4)](this);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x562)]=Sprite_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x809)],Sprite_Actor['prototype']['setActorHome']=function(_0x1528d7){const _0x567fe8=_0x2bbd55;VisuMZ[_0x567fe8(0x46a)][_0x567fe8(0x55b)][_0x567fe8(0x843)][_0x567fe8(0x2f2)]?VisuMZ[_0x567fe8(0x46a)][_0x567fe8(0x55b)][_0x567fe8(0x843)]['HomePosJS'][_0x567fe8(0x4f4)](this,_0x1528d7):VisuMZ[_0x567fe8(0x46a)][_0x567fe8(0x562)][_0x567fe8(0x4f4)](this,_0x1528d7);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x234)]=Sprite_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x40c)],Sprite_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x40c)]=function(_0x4a0b2a){const _0x511085=_0x2bbd55;VisuMZ[_0x511085(0x46a)][_0x511085(0x234)][_0x511085(0x4f4)](this,_0x4a0b2a),this[_0x511085(0x251)](_0x4a0b2a);},Sprite_Actor['prototype'][_0x2bbd55(0x251)]=function(_0x5d9fbf){const _0x271fd0=_0x2bbd55;if(!_0x5d9fbf)return;if(!this[_0x271fd0(0x6fc)])return;this[_0x271fd0(0x6fc)][_0x271fd0(0x5e5)]['x']=this[_0x271fd0(0x5c2)][_0x271fd0(0x45b)](),this[_0x271fd0(0x6fc)][_0x271fd0(0x5e5)]['y']=this['_actor'][_0x271fd0(0x42a)](),this[_0x271fd0(0x365)]();},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x6e9)]=Sprite_Actor['prototype'][_0x2bbd55(0x12d)],Sprite_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x12d)]=function(){const _0x7a47de=_0x2bbd55;VisuMZ[_0x7a47de(0x46a)][_0x7a47de(0x6e9)][_0x7a47de(0x4f4)](this),this['_actor']&&(this['updateStateSprite'](),this[_0x7a47de(0x2c0)]());},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x5be)]=Sprite_Actor['prototype'][_0x2bbd55(0x37b)],Sprite_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x37b)]=function(){const _0x49bb83=_0x2bbd55;VisuMZ['BattleCore'][_0x49bb83(0x5be)][_0x49bb83(0x4f4)](this),this[_0x49bb83(0x6fc)]&&this['_mainSprite'][_0x49bb83(0x190)]&&this[_0x49bb83(0x110)]&&(this[_0x49bb83(0x6fc)][_0x49bb83(0x190)][_0x49bb83(0x32e)]!==this[_0x49bb83(0x110)][_0x49bb83(0x811)]()&&(this['_mainSprite'][_0x49bb83(0x190)][_0x49bb83(0x32e)]=this[_0x49bb83(0x110)][_0x49bb83(0x811)]()));},VisuMZ['BattleCore'][_0x2bbd55(0x854)]=Sprite_Actor['prototype'][_0x2bbd55(0x5aa)],Sprite_Actor['prototype'][_0x2bbd55(0x5aa)]=function(){const _0x518f10=_0x2bbd55;VisuMZ[_0x518f10(0x46a)][_0x518f10(0x854)][_0x518f10(0x4f4)](this),this[_0x518f10(0x306)]();},Sprite_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x306)]=function(){const _0x2a2371=_0x2bbd55;if(!this['_mainSprite'])return;if(!this[_0x2a2371(0x2f0)])return;this[_0x2a2371(0x365)](),this[_0x2a2371(0x77f)]();},Sprite_Actor['prototype']['updateStateSprite']=function(){const _0x3578d4=_0x2bbd55;this[_0x3578d4(0x39f)]['scale']['x']=0x1/(this[_0x3578d4(0x1ae)]['x']||0.001),this[_0x3578d4(0x39f)][_0x3578d4(0x1ae)]['y']=0x1/(this[_0x3578d4(0x1ae)]['y']||0.001);},Sprite_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x2c0)]=function(){const _0xf43805=_0x2bbd55;if(!$gameSystem[_0xf43805(0x2e6)]()&&this[_0xf43805(0x409)]===Sprite_Actor){const _0x5d14e1=Scene_Battle[_0xf43805(0x5d7)][_0xf43805(0x34a)]();[_0xf43805(0x43b),'list',_0xf43805(0x455),_0xf43805(0x6bb)]['includes'](_0x5d14e1)&&(this[_0xf43805(0x694)]=0x0);}},Sprite_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x19d)]=function(){const _0x5d2daa=_0x2bbd55,_0x4030af=this[_0x5d2daa(0x5c2)];if(_0x4030af){const _0x28086b=_0x4030af[_0x5d2daa(0x351)]();if(_0x4030af['isInputting']()||_0x4030af[_0x5d2daa(0x33b)]())this[_0x5d2daa(0x68d)]('walk');else{if(_0x28086b===0x3)this['startMotion']('dead');else{if(_0x28086b===0x2)this[_0x5d2daa(0x68d)](_0x5d2daa(0x5d8));else{if(this[_0x5d2daa(0x193)])this[_0x5d2daa(0x68d)](_0x5d2daa(0x78f));else{if(_0x4030af[_0x5d2daa(0x35e)]())this[_0x5d2daa(0x68d)](_0x5d2daa(0x30c));else{if(_0x4030af[_0x5d2daa(0x327)]())this[_0x5d2daa(0x68d)](_0x5d2daa(0x2a4));else{if(_0x4030af[_0x5d2daa(0x59f)]()||_0x4030af[_0x5d2daa(0x1d7)]())this[_0x5d2daa(0x68d)](_0x5d2daa(0x7ad));else{if(_0x28086b===0x1)this[_0x5d2daa(0x68d)](_0x5d2daa(0x22f));else{if(_0x4030af[_0x5d2daa(0x107)]())this[_0x5d2daa(0x68d)]('dying');else{if(_0x4030af[_0x5d2daa(0x5de)]())this[_0x5d2daa(0x68d)]('walk');else _0x4030af[_0x5d2daa(0x824)]()?this[_0x5d2daa(0x68d)]('wait'):this[_0x5d2daa(0x68d)](_0x5d2daa(0x705));}}}}}}}}}}},Sprite_Actor['prototype'][_0x2bbd55(0x19b)]=function(){const _0x1f9a9d=0xa,_0x170d96=0x12c*_0x1f9a9d,_0x2a62a6=0x1e*_0x1f9a9d;this['startMove'](_0x170d96,0x0,_0x2a62a6);},Sprite_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x164)]=function(){const _0xe8ce32=_0x2bbd55;Sprite_Battler[_0xe8ce32(0x5d7)][_0xe8ce32(0x164)][_0xe8ce32(0x4f4)](this);},Sprite_Actor['prototype']['motionSpeed']=function(){const _0x154b8f=_0x2bbd55;return Sprite_Battler[_0x154b8f(0x2a7)];},Sprite_Weapon[_0x2bbd55(0x5d7)][_0x2bbd55(0x294)]=function(){const _0xc74d69=_0x2bbd55;return Sprite_Battler[_0xc74d69(0x2a7)];},Sprite_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x2ad)]=function(){},Sprite_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x203)]=function(){},Sprite_Actor['prototype'][_0x2bbd55(0x405)]=function(){const _0x337bee=_0x2bbd55;if(this[_0x337bee(0x469)]&&++this['_motionCount']>=this[_0x337bee(0x26b)]()){if(this[_0x337bee(0x469)]['loop'])this['_pattern']=(this[_0x337bee(0x55d)]+0x1)%0x4;else this[_0x337bee(0x55d)]<0x2?this[_0x337bee(0x55d)]++:this[_0x337bee(0x19d)]();this['_motionCount']=0x0;}},Sprite_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x13e)]=function(_0x4c5a32){const _0x58f532=_0x2bbd55;if(_0x4c5a32===_0x58f532(0x522))this['_checkOn']=!![];if(this[_0x58f532(0x110)]&&this[_0x58f532(0x110)][_0x58f532(0x81e)]()){this[_0x58f532(0x469)]=Sprite_Actor['MOTIONS']['dead'];return;}const _0x2b110a=Sprite_Actor[_0x58f532(0x6ab)][_0x4c5a32];this[_0x58f532(0x469)]=_0x2b110a,this[_0x58f532(0x2eb)]=0x0,this[_0x58f532(0x55d)]=0x0;},Sprite_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x63d)]=function(_0x5b207f){const _0x27af68=_0x2bbd55;this['adjustWeaponSpriteOffset'](),this['_weaponSprite'][_0x27af68(0x76c)](_0x5b207f),this[_0x27af68(0x5c2)][_0x27af68(0x861)]();},Sprite_Actor[_0x2bbd55(0x5d7)]['adjustWeaponSpriteOffset']=function(){const _0x38910b=_0x2bbd55;let _0x1055ce=-0x10,_0x348ac4=this['height']*0.5;const _0x1b16e8=/<SIDEVIEW WEAPON OFFSET:[ ]([\+\-]\d+),[ ]([\+\-]\d+)>/i,_0x29ca93=this['_battler'][_0x38910b(0x53c)]()[_0x38910b(0x28f)](_0x50fc8f=>_0x50fc8f&&_0x50fc8f[_0x38910b(0x11b)][_0x38910b(0x87d)](_0x1b16e8)?Number(RegExp['$1']):0x0),_0x39b2d6=this['_battler']['traitObjects']()[_0x38910b(0x28f)](_0x37c71a=>_0x37c71a&&_0x37c71a[_0x38910b(0x11b)][_0x38910b(0x87d)](_0x1b16e8)?Number(RegExp['$2']):0x0);_0x1055ce=_0x29ca93[_0x38910b(0x37e)]((_0x158105,_0x274bec)=>_0x158105+_0x274bec,_0x1055ce),_0x348ac4=_0x39b2d6[_0x38910b(0x37e)]((_0x6cde56,_0x449b19)=>_0x6cde56+_0x449b19,_0x348ac4),this[_0x38910b(0x337)]['x']=_0x1055ce,this[_0x38910b(0x337)]['y']=_0x348ac4,this['_weaponSprite'][_0x38910b(0x12d)]();},Sprite_Weapon[_0x2bbd55(0x5d7)][_0x2bbd55(0x76c)]=function(_0x41d0d9){const _0x3a7fea=_0x2bbd55;this['_weaponImageId']=_0x41d0d9,this[_0x3a7fea(0x1e2)]=-0x1,this[_0x3a7fea(0x55d)]=0x0,this[_0x3a7fea(0x11d)](),this['updateFrame']();},Sprite_Actor[_0x2bbd55(0x5d7)]['updateTargetPosition']=function(){},Sprite_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x63c)]=function(){const _0x580918=_0x2bbd55,_0x1d82a1=VisuMZ['BattleCore']['Settings']['ActionSequence'],_0x412380=_0x1d82a1[_0x580918(0x75e)],_0x443f44=_0x1d82a1[_0x580918(0x79a)],_0x6e8a1e=_0x1d82a1[_0x580918(0x12b)];this['startMove'](-_0x412380,-_0x443f44,_0x6e8a1e);},VisuMZ[_0x2bbd55(0x46a)]['Sprite_Actor_updateFrame']=Sprite_Actor['prototype'][_0x2bbd55(0x13c)],Sprite_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x13c)]=function(){const _0x152d07=_0x2bbd55;this[_0x152d07(0x6b3)](),VisuMZ[_0x152d07(0x46a)][_0x152d07(0x13a)]['call'](this);},Sprite_Actor[_0x2bbd55(0x5d7)]['applyFreezeMotionFrames']=function(){const _0x57b3c7=_0x2bbd55;if(this[_0x57b3c7(0x110)]&&this[_0x57b3c7(0x110)][_0x57b3c7(0x278)]){const _0x8e3d12=this[_0x57b3c7(0x110)][_0x57b3c7(0x278)];this[_0x57b3c7(0x469)]=Sprite_Actor[_0x57b3c7(0x6ab)][_0x8e3d12[_0x57b3c7(0x812)]],this[_0x57b3c7(0x55d)]=_0x8e3d12['pattern'];const _0x145434=this[_0x57b3c7(0x337)];_0x145434[_0x57b3c7(0x81f)](_0x8e3d12[_0x57b3c7(0x5b1)],_0x8e3d12[_0x57b3c7(0x628)]),this['adjustWeaponSpriteOffset']();}},Sprite_Weapon[_0x2bbd55(0x5d7)][_0x2bbd55(0x81f)]=function(_0x58a7e0,_0xce2aa0){const _0x52c323=_0x2bbd55;this['_weaponImageId']=_0x58a7e0,this[_0x52c323(0x1e2)]=-Infinity,this[_0x52c323(0x55d)]=_0xce2aa0,this[_0x52c323(0x11d)](),this[_0x52c323(0x13c)]();},Sprite_Enemy['prototype'][_0x2bbd55(0x2e9)]=function(){const _0x164b74=_0x2bbd55;Sprite_Battler['prototype'][_0x164b74(0x2e9)][_0x164b74(0x4f4)](this),this['_enemy']=null,this['_appeared']=![],this[_0x164b74(0x30e)]='',this[_0x164b74(0x16b)]=0x0,this[_0x164b74(0x3b8)]=null,this[_0x164b74(0x414)]=0x0,this[_0x164b74(0x440)]=0x0,this['createMainSprite'](),this['createStateIconSprite']();},VisuMZ['BattleCore'][_0x2bbd55(0x30b)]=Sprite_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x12d)],Sprite_Enemy[_0x2bbd55(0x5d7)]['update']=function(){const _0x47e717=_0x2bbd55;VisuMZ[_0x47e717(0x46a)][_0x47e717(0x30b)][_0x47e717(0x4f4)](this),this[_0x47e717(0x365)]();},Sprite_Enemy['prototype']['createMainSprite']=function(){const _0x481661=_0x2bbd55;this[_0x481661(0x6fc)]=new Sprite(),this['_mainSprite']['anchor']['x']=0.5,this[_0x481661(0x6fc)][_0x481661(0x5e5)]['y']=0x1,this['addChild'](this[_0x481661(0x6fc)]),this['attachSpritesToDistortionSprite']();},Sprite_Enemy[_0x2bbd55(0x5d7)]['mainSprite']=function(){const _0x39cf45=_0x2bbd55;return this[_0x39cf45(0x146)]||this[_0x39cf45(0x6fc)]||this;},Sprite_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x11d)]=function(_0x48a1a2){const _0x3f37c4=_0x2bbd55;this['bitmap']=new Bitmap(0x1,0x1),$gameSystem['isSideView']()?this['_mainSprite']['bitmap']=ImageManager['loadSvEnemy'](_0x48a1a2):this[_0x3f37c4(0x6fc)][_0x3f37c4(0x190)]=ImageManager['loadEnemy'](_0x48a1a2),this[_0x3f37c4(0x6fc)][_0x3f37c4(0x190)][_0x3f37c4(0x2c2)](this[_0x3f37c4(0x6de)][_0x3f37c4(0x5e6)](this));},Sprite_Enemy['prototype'][_0x2bbd55(0x6de)]=function(){const _0x4754ec=_0x2bbd55,_0x45636b=this['_mainSprite'][_0x4754ec(0x190)];_0x45636b&&(this[_0x4754ec(0x190)]=new Bitmap(_0x45636b[_0x4754ec(0x802)],_0x45636b[_0x4754ec(0x6c3)]));},VisuMZ['BattleCore'][_0x2bbd55(0x627)]=Sprite_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x32f)],Sprite_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x32f)]=function(_0x23cba7){const _0x1aa404=_0x2bbd55;this[_0x1aa404(0x6fc)]&&this[_0x1aa404(0x6fc)]['setHue'](_0x23cba7);},VisuMZ[_0x2bbd55(0x46a)]['Sprite_Enemy_initVisibility']=Sprite_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x74d)],Sprite_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x74d)]=function(){const _0x1ee8ad=_0x2bbd55;this[_0x1ee8ad(0x6ef)]()?VisuMZ[_0x1ee8ad(0x46a)][_0x1ee8ad(0x7ec)][_0x1ee8ad(0x4f4)](this):(this[_0x1ee8ad(0x4e4)]=!this[_0x1ee8ad(0x250)][_0x1ee8ad(0x2d4)](),!this[_0x1ee8ad(0x4e4)]&&(this['opacity']=0x0));},VisuMZ[_0x2bbd55(0x46a)]['Sprite_Enemy_updateCollapse']=Sprite_Enemy[_0x2bbd55(0x5d7)]['updateCollapse'],Sprite_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x821)]=function(){const _0x1a97ec=_0x2bbd55;if(this[_0x1a97ec(0x6ef)]())VisuMZ[_0x1a97ec(0x46a)][_0x1a97ec(0x6ea)]['call'](this);},Sprite_Enemy['prototype']['updateFrame']=function(){const _0x10f379=_0x2bbd55;Sprite_Battler[_0x10f379(0x5d7)][_0x10f379(0x13c)][_0x10f379(0x4f4)](this);const _0xf37095=this[_0x10f379(0x4d8)]()||this;if(!_0xf37095)return;!_0xf37095[_0x10f379(0x190)]&&(_0xf37095['bitmap']=new Bitmap(this['width'],this[_0x10f379(0x6c3)])),this[_0x10f379(0x3b8)]===_0x10f379(0x585)?this[_0x10f379(0x6fc)][_0x10f379(0x3da)](0x0,0x0,this[_0x10f379(0x6fc)]['width'],this[_0x10f379(0x414)]):_0xf37095[_0x10f379(0x3da)](0x0,0x0,_0xf37095[_0x10f379(0x190)][_0x10f379(0x802)],this[_0x10f379(0x190)][_0x10f379(0x6c3)]);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x2e1)]=Sprite_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x1db)],Sprite_Enemy['prototype'][_0x2bbd55(0x1db)]=function(){const _0x223f5e=_0x2bbd55;if(this[_0x223f5e(0x6ef)]())VisuMZ[_0x223f5e(0x46a)][_0x223f5e(0x2e1)]['call'](this);},Sprite_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x1cc)]=function(){const _0x139307=_0x2bbd55;return Sprite_Battler['prototype'][_0x139307(0x1cc)][_0x139307(0x4f4)](this);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x5dc)]=Sprite_Enemy['prototype'][_0x2bbd55(0x78a)],Sprite_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x78a)]=function(){const _0x2ac521=_0x2bbd55;VisuMZ['BattleCore']['Sprite_Enemy_updateStateSprite'][_0x2ac521(0x4f4)](this),this[_0x2ac521(0x404)]();},Sprite_Enemy['prototype'][_0x2bbd55(0x404)]=function(){const _0x1722c6=_0x2bbd55;this[_0x1722c6(0x553)]['x']=0x0,this[_0x1722c6(0x553)]['x']+=this[_0x1722c6(0x110)][_0x1722c6(0x3f9)](),this[_0x1722c6(0x553)]['y']=-this[_0x1722c6(0x190)][_0x1722c6(0x6c3)]-this[_0x1722c6(0x553)][_0x1722c6(0x6c3)],this[_0x1722c6(0x553)]['y']+=this[_0x1722c6(0x110)]['battleUIOffsetY'](),this['_stateIconSprite']['scale']['x']=0x1/(this[_0x1722c6(0x1ae)]['x']||0.001),this[_0x1722c6(0x553)]['scale']['y']=0x1/(this[_0x1722c6(0x1ae)]['y']||0.001),this['hasSvBattler']()&&(this[_0x1722c6(0x1a9)]['_stateSprite'][_0x1722c6(0x1ae)]['x']=-0x1/(this[_0x1722c6(0x1ae)]['x']||0.001),this['_svBattlerSprite'][_0x1722c6(0x39f)]['scale']['y']=0x1/(this[_0x1722c6(0x1ae)]['y']||0.001));},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x1c6)]=Sprite_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x40c)],Sprite_Enemy['prototype'][_0x2bbd55(0x40c)]=function(_0x502af8){const _0x20943a=_0x2bbd55;VisuMZ[_0x20943a(0x46a)]['Sprite_Enemy_setBattler']['call'](this,_0x502af8),this[_0x20943a(0x1ad)](_0x502af8);},Sprite_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x1ad)]=function(_0xc0d6e2){const _0x2962c2=_0x2bbd55;!this[_0x2962c2(0x1a9)]&&(this['_svBattlerSprite']=new Sprite_SvEnemy(_0xc0d6e2),this['attachSpritesToDistortionSprite']()),this['_svBattlerSprite']['setBattler'](_0xc0d6e2);},Sprite_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x3d7)]=function(){const _0xadad71=_0x2bbd55;return this['_enemy']&&this[_0xadad71(0x250)][_0xadad71(0x3d7)]();},VisuMZ[_0x2bbd55(0x46a)]['Sprite_Enemy_loadBitmap']=Sprite_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x11d)],Sprite_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x11d)]=function(_0x1402ff){const _0x267d25=_0x2bbd55;if(this[_0x267d25(0x3d7)]()){const _0x4889d2=this[_0x267d25(0x250)]['svBattlerData']();this[_0x267d25(0x190)]=new Bitmap(_0x4889d2[_0x267d25(0x802)],_0x4889d2[_0x267d25(0x6c3)]);}else VisuMZ[_0x267d25(0x46a)][_0x267d25(0x1ba)][_0x267d25(0x4f4)](this,_0x1402ff);},Sprite_Enemy['prototype']['allowCollapse']=function(){const _0x595b4b=_0x2bbd55;return this[_0x595b4b(0x3d7)]()?this[_0x595b4b(0x250)]['allowCollapse']():!![];},Sprite_Enemy['prototype'][_0x2bbd55(0x19d)]=function(){const _0x1f72f7=_0x2bbd55;this[_0x1f72f7(0x3d7)]()&&this[_0x1f72f7(0x1a9)][_0x1f72f7(0x19d)]();},Sprite_Enemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x13e)]=function(_0xb87f0b){const _0x27ed88=_0x2bbd55;if(this[_0x27ed88(0x3d7)]())this[_0x27ed88(0x1a9)][_0x27ed88(0x13e)](_0xb87f0b);},Sprite_Enemy['prototype'][_0x2bbd55(0x63d)]=function(_0x13e9d7){const _0x3c4f71=_0x2bbd55;if(this[_0x3c4f71(0x3d7)]())this['_svBattlerSprite'][_0x3c4f71(0x63d)](_0x13e9d7);},Sprite_Enemy['prototype']['stepForward']=function(){const _0x4a04dc=_0x2bbd55,_0xa1e42a=VisuMZ[_0x4a04dc(0x46a)]['Settings'][_0x4a04dc(0x2d2)],_0x36f6bf=_0xa1e42a['StepDistanceX'],_0x33bf66=_0xa1e42a[_0x4a04dc(0x79a)],_0x42d0a8=_0xa1e42a[_0x4a04dc(0x12b)];this[_0x4a04dc(0x1b1)](_0x36f6bf,_0x33bf66,_0x42d0a8);};function Sprite_SvEnemy(){this['initialize'](...arguments);}Sprite_SvEnemy['prototype']=Object[_0x2bbd55(0x60a)](Sprite_Actor['prototype']),Sprite_SvEnemy[_0x2bbd55(0x5d7)]['constructor']=Sprite_SvEnemy,Sprite_SvEnemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x447)]=function(_0x237ada){const _0x554985=_0x2bbd55;Sprite_Actor[_0x554985(0x5d7)]['initialize'][_0x554985(0x4f4)](this,_0x237ada),this[_0x554985(0x1ae)]['x']=-0x1,this[_0x554985(0x39f)][_0x554985(0x1ae)]['x']=-0x1;},Sprite_SvEnemy[_0x2bbd55(0x5d7)]['createShadowSprite']=function(){},Sprite_SvEnemy[_0x2bbd55(0x5d7)]['moveToStartPosition']=function(){},Sprite_SvEnemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x809)]=function(_0x35dd74){},Sprite_SvEnemy['prototype']['updateShadow']=function(){},Sprite_SvEnemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x77f)]=function(){},Sprite_SvEnemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x78a)]=function(){const _0x5eacee=_0x2bbd55;this[_0x5eacee(0x39f)]['visible']=![];},Sprite_SvEnemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x37b)]=function(){const _0x28062e=_0x2bbd55;Sprite_Battler[_0x28062e(0x5d7)][_0x28062e(0x37b)][_0x28062e(0x4f4)](this);const _0x507ca5=this['_actor'][_0x28062e(0x56c)]();this[_0x28062e(0x30e)]!==_0x507ca5&&(this[_0x28062e(0x30e)]=_0x507ca5,this[_0x28062e(0x6fc)][_0x28062e(0x190)]=ImageManager[_0x28062e(0x462)](_0x507ca5)),this['_mainSprite']&&this[_0x28062e(0x6fc)]['bitmap']&&this[_0x28062e(0x110)]&&(this[_0x28062e(0x6fc)][_0x28062e(0x190)]['smooth']!==this[_0x28062e(0x110)][_0x28062e(0x811)]()&&(this[_0x28062e(0x6fc)][_0x28062e(0x190)][_0x28062e(0x32e)]=this[_0x28062e(0x110)][_0x28062e(0x811)]()));},Sprite_SvEnemy[_0x2bbd55(0x5d7)]['retreat']=function(){},Sprite_SvEnemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x1b1)]=function(_0x18468a,_0x2992ea,_0x38f995){const _0x3458c8=_0x2bbd55;if(this[_0x3458c8(0x437)])this['parent'][_0x3458c8(0x1b1)](_0x18468a,_0x2992ea,_0x38f995);},Sprite_SvEnemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x19d)]=function(){const _0x14d1be=_0x2bbd55,_0x2ad217=this[_0x14d1be(0x5c2)];if(_0x2ad217){const _0x4428c3=_0x2ad217[_0x14d1be(0x351)]();if(_0x2ad217[_0x14d1be(0x788)]()||_0x2ad217[_0x14d1be(0x33b)]())this[_0x14d1be(0x68d)]('walk');else{if(_0x4428c3===0x3)this[_0x14d1be(0x68d)](_0x14d1be(0x2a1));else{if(_0x4428c3===0x2)this['startMotion'](_0x14d1be(0x5d8));else{if(_0x2ad217[_0x14d1be(0x327)]())this['startMotion'](_0x14d1be(0x2a4));else{if(_0x2ad217['isGuard']()||_0x2ad217[_0x14d1be(0x1d7)]())this[_0x14d1be(0x68d)](_0x14d1be(0x7ad));else{if(_0x4428c3===0x1)this[_0x14d1be(0x68d)]('abnormal');else{if(_0x2ad217[_0x14d1be(0x107)]())this[_0x14d1be(0x68d)]('dying');else _0x2ad217['isUndecided']()?this[_0x14d1be(0x68d)](_0x14d1be(0x705)):this[_0x14d1be(0x68d)](_0x2ad217['svBattlerData']()['motionIdle']||_0x14d1be(0x705));}}}}}}}},Sprite_SvEnemy['prototype'][_0x2bbd55(0x66b)]=function(){const _0x563991=_0x2bbd55;return this[_0x563991(0x437)]?this[_0x563991(0x437)][_0x563991(0x621)]===0x0&&this[_0x563991(0x437)][_0x563991(0x857)]===0x0:!![];},Sprite_SvEnemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x211)]=function(){},Sprite_Damage[_0x2bbd55(0x5d7)]['setupBattleCore']=function(_0x5522c9){const _0x30908f=_0x2bbd55,_0x4ce062=_0x5522c9[_0x30908f(0x655)]()||_0x5522c9['result']();if(_0x4ce062[_0x30908f(0x478)]||_0x4ce062['evaded'])this[_0x30908f(0x649)]=0x0,this[_0x30908f(0x102)]();else{if(_0x4ce062['hpAffected'])this['_colorType']=_0x4ce062[_0x30908f(0x1c7)]>=0x0?0x0:0x1,this[_0x30908f(0x742)](_0x4ce062['hpDamage']);else _0x5522c9['isAlive']()&&_0x4ce062[_0x30908f(0x200)]!==0x0&&(this[_0x30908f(0x649)]=_0x4ce062['mpDamage']>=0x0?0x2:0x3,this[_0x30908f(0x742)](_0x4ce062[_0x30908f(0x200)]));}_0x4ce062['critical']&&this[_0x30908f(0x736)]();},Sprite_Damage[_0x2bbd55(0x5d7)][_0x2bbd55(0x76c)]=function(_0x35c5b5){},Sprite_Damage[_0x2bbd55(0x5d7)][_0x2bbd55(0x742)]=function(_0xc9a597){const _0xf95f94=_0x2bbd55;let _0x506e86=this[_0xf95f94(0x10b)](_0xc9a597);const _0x1464fe=this['fontSize'](),_0x389334=Math['floor'](_0x1464fe*0.75);for(let _0xd38150=0x0;_0xd38150<_0x506e86['length'];_0xd38150++){const _0x3bf4c9=this[_0xf95f94(0x836)](_0x389334,_0x1464fe);_0x3bf4c9[_0xf95f94(0x190)][_0xf95f94(0x851)](_0x506e86[_0xd38150],0x0,0x0,_0x389334,_0x1464fe,_0xf95f94(0x6b4)),_0x3bf4c9['x']=(_0xd38150-(_0x506e86[_0xf95f94(0x5cf)]-0x1)/0x2)*_0x389334,_0x3bf4c9['dy']=-_0xd38150;}},Sprite_Damage[_0x2bbd55(0x5d7)][_0x2bbd55(0x10b)]=function(_0x181443){const _0x597fa1=_0x2bbd55;let _0x4ed931=Math[_0x597fa1(0x241)](_0x181443)[_0x597fa1(0x61b)]();this[_0x597fa1(0x3ed)]()&&(_0x4ed931=VisuMZ[_0x597fa1(0x2cb)](_0x4ed931));const _0x155247=VisuMZ[_0x597fa1(0x46a)][_0x597fa1(0x55b)][_0x597fa1(0x14a)];let _0x29c9af='',_0x4d616d='';switch(this[_0x597fa1(0x649)]){case 0x0:_0x29c9af=_0x155247['hpDamageFmt']||_0x597fa1(0x2a9),_0x4d616d=TextManager['hp'];if(_0x181443===0x0)_0x29c9af='%1';break;case 0x1:_0x29c9af=_0x155247[_0x597fa1(0x25c)]||_0x597fa1(0x598),_0x4d616d=TextManager['hp'];break;case 0x2:_0x29c9af=_0x155247[_0x597fa1(0x70f)]||'-%1\x20MP',_0x4d616d=TextManager['mp'];break;case 0x3:_0x29c9af=_0x155247[_0x597fa1(0x2d6)]||_0x597fa1(0x54f),_0x4d616d=TextManager['mp'];break;}return _0x29c9af[_0x597fa1(0x36b)](_0x4ed931,_0x4d616d)[_0x597fa1(0x692)]();},Sprite_Damage[_0x2bbd55(0x5d7)][_0x2bbd55(0x3ed)]=function(){const _0x120084=_0x2bbd55;return Imported[_0x120084(0x7c3)]?VisuMZ[_0x120084(0x648)]['Settings'][_0x120084(0x569)][_0x120084(0x310)]:![];},Sprite_Damage[_0x2bbd55(0x5d7)][_0x2bbd55(0x736)]=function(){const _0x2ad0a3=_0x2bbd55,_0x4658b0=VisuMZ[_0x2ad0a3(0x46a)][_0x2ad0a3(0x55b)][_0x2ad0a3(0x14a)];this[_0x2ad0a3(0x5a3)]=_0x4658b0[_0x2ad0a3(0x5f7)][_0x2ad0a3(0x3d2)](0x0),this[_0x2ad0a3(0x52c)]=_0x4658b0[_0x2ad0a3(0x2ff)];},Sprite_Damage['prototype'][_0x2bbd55(0x116)]=function(_0x28a2c7,_0x1dfd9b){const _0x5b1e42=_0x2bbd55;this['_flashColor']=_0x1dfd9b[_0x5b1e42(0x5fd)]||[0x0,0x0,0x0,0x0],this[_0x5b1e42(0x5a3)]=JsonEx[_0x5b1e42(0x878)](this[_0x5b1e42(0x5a3)]),this[_0x5b1e42(0x52c)]=_0x1dfd9b[_0x5b1e42(0x506)]||0x0;const _0x42e2d0=this[_0x5b1e42(0x534)](),_0x165d22=Math[_0x5b1e42(0x2c6)](_0x42e2d0*0x1e),_0x55bf8c=this[_0x5b1e42(0x836)](_0x165d22,_0x42e2d0);_0x55bf8c[_0x5b1e42(0x190)][_0x5b1e42(0x6c2)]=ColorManager[_0x5b1e42(0x684)](_0x1dfd9b['textColor']),_0x55bf8c[_0x5b1e42(0x190)][_0x5b1e42(0x851)](_0x28a2c7,0x0,0x0,_0x165d22,_0x42e2d0,'center'),_0x55bf8c['dy']=0x0;},Sprite_Damage[_0x2bbd55(0x5d7)][_0x2bbd55(0x162)]=function(_0x4d977c,_0x5a00bf,_0x40aab0){const _0x4b37ee=_0x2bbd55,_0x3c923e=Math['max'](this[_0x4b37ee(0x534)](),ImageManager[_0x4b37ee(0xfc)]),_0x478a61=Math['floor'](_0x3c923e*0x1e),_0x49c8d0=this['createChildSprite'](_0x478a61,_0x3c923e),_0x364e5c=ImageManager[_0x4b37ee(0x281)]/0x2,_0x37cc86=_0x49c8d0[_0x4b37ee(0x190)]['measureTextWidth'](_0x5a00bf+'\x20');_0x49c8d0[_0x4b37ee(0x190)][_0x4b37ee(0x6c2)]=ColorManager[_0x4b37ee(0x684)](_0x40aab0['textColor']),_0x49c8d0[_0x4b37ee(0x190)]['drawText'](_0x5a00bf,_0x364e5c,0x0,_0x478a61-_0x364e5c,_0x3c923e,_0x4b37ee(0x6b4));const _0x5f119b=Math[_0x4b37ee(0x86f)]((_0x3c923e-ImageManager[_0x4b37ee(0xfc)])/0x2),_0x1f8724=_0x478a61/0x2-ImageManager[_0x4b37ee(0x281)]-_0x37cc86/0x2+_0x364e5c/0x2,_0x3605b4=ImageManager[_0x4b37ee(0x43a)](_0x4b37ee(0x49e)),_0x7741a0=ImageManager[_0x4b37ee(0x281)],_0x53d371=ImageManager['iconHeight'],_0x464856=_0x4d977c%0x10*_0x7741a0,_0x13cffe=Math['floor'](_0x4d977c/0x10)*_0x53d371;_0x49c8d0[_0x4b37ee(0x190)]['blt'](_0x3605b4,_0x464856,_0x13cffe,_0x7741a0,_0x53d371,_0x1f8724,_0x5f119b),this['_flashColor']=_0x40aab0[_0x4b37ee(0x5fd)]||[0x0,0x0,0x0,0x0],this['_flashColor']=JsonEx['makeDeepCopy'](this[_0x4b37ee(0x5a3)]),this[_0x4b37ee(0x52c)]=_0x40aab0[_0x4b37ee(0x506)]||0x0,_0x49c8d0['dy']=0x0;},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x4ce)]=Sprite_StateIcon[_0x2bbd55(0x5d7)][_0x2bbd55(0x13c)],Sprite_StateIcon[_0x2bbd55(0x5d7)]['updateFrame']=function(){const _0x561558=_0x2bbd55;VisuMZ[_0x561558(0x46a)]['Sprite_StateIcon_updateFrame'][_0x561558(0x4f4)](this),this[_0x561558(0x4fd)]=this[_0x561558(0x257)]>0x0?!![]:![];},VisuMZ['BattleCore'][_0x2bbd55(0x2ef)]=Sprite_Weapon['prototype'][_0x2bbd55(0x11d)],Sprite_Weapon[_0x2bbd55(0x5d7)][_0x2bbd55(0x11d)]=function(){const _0x4beb50=_0x2bbd55;VisuMZ[_0x4beb50(0x46a)][_0x4beb50(0x2ef)]['call'](this),this[_0x4beb50(0x190)]&&(this[_0x4beb50(0x190)]['smooth']=VisuMZ[_0x4beb50(0x46a)][_0x4beb50(0x55b)][_0x4beb50(0x843)][_0x4beb50(0x4c7)]);};function Sprite_HpGauge(){const _0x4a2585=_0x2bbd55;this[_0x4a2585(0x447)](...arguments);}Sprite_HpGauge['prototype']=Object[_0x2bbd55(0x60a)](Sprite_Gauge[_0x2bbd55(0x5d7)]),Sprite_HpGauge[_0x2bbd55(0x5d7)][_0x2bbd55(0x409)]=Sprite_HpGauge,Sprite_HpGauge[_0x2bbd55(0x5d7)][_0x2bbd55(0x447)]=function(){const _0x2d5158=_0x2bbd55;Sprite_Gauge[_0x2d5158(0x5d7)][_0x2d5158(0x447)]['call'](this);},Sprite_HpGauge[_0x2bbd55(0x5d7)][_0x2bbd55(0x21f)]=function(){return 0x0;},Sprite_HpGauge[_0x2bbd55(0x5d7)][_0x2bbd55(0x783)]=function(){const _0x41057b=_0x2bbd55;this['bitmap'][_0x41057b(0x277)]();const _0x5140ca=this['currentValue']();!isNaN(_0x5140ca)&&this[_0x41057b(0x4a8)]();},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x479)]=Sprite_Battleback[_0x2bbd55(0x5d7)]['adjustPosition'],Sprite_Battleback[_0x2bbd55(0x5d7)][_0x2bbd55(0x209)]=function(){const _0x47096d=_0x2bbd55,_0x4acea0=VisuMZ['BattleCore'][_0x47096d(0x55b)][_0x47096d(0x491)];if(!_0x4acea0)return VisuMZ[_0x47096d(0x46a)][_0x47096d(0x479)][_0x47096d(0x4f4)](this);const _0x3f0289=String(_0x4acea0[_0x47096d(0x194)])||'MZ';switch(_0x3f0289){case'MZ':VisuMZ['BattleCore']['Sprite_Battleback_adjustPosition'][_0x47096d(0x4f4)](this);break;case _0x47096d(0x4c2):this['adjustPosition_1for1']();break;case _0x47096d(0x465):this['adjustPosition_ScaleToFit']();break;case'ScaleDown':this[_0x47096d(0x81d)]();break;case _0x47096d(0x4cb):this[_0x47096d(0x325)]();break;}},Sprite_Battleback[_0x2bbd55(0x5d7)][_0x2bbd55(0x438)]=function(){const _0x2f7d3e=_0x2bbd55;this[_0x2f7d3e(0x802)]=Graphics[_0x2f7d3e(0x802)],this['height']=Graphics[_0x2f7d3e(0x6c3)];const _0x3b6a4a=0x1;this['scale']['x']=_0x3b6a4a,this[_0x2f7d3e(0x1ae)]['y']=_0x3b6a4a,this['x']=0x0,this['y']=0x0;},Sprite_Battleback[_0x2bbd55(0x5d7)][_0x2bbd55(0x699)]=function(){const _0x242201=_0x2bbd55;this[_0x242201(0x802)]=Graphics[_0x242201(0x802)],this['height']=Graphics[_0x242201(0x6c3)];const _0x4f3be8=this[_0x242201(0x802)]/this[_0x242201(0x190)][_0x242201(0x802)],_0x1066c7=this[_0x242201(0x6c3)]/this[_0x242201(0x190)][_0x242201(0x6c3)],_0x1256d9=Math['max'](_0x4f3be8,_0x1066c7);this[_0x242201(0x1ae)]['x']=_0x1256d9,this['scale']['y']=_0x1256d9,this['x']=(Graphics[_0x242201(0x802)]-this['width'])/0x2,this['y']=Graphics['height']-this[_0x242201(0x6c3)];},Sprite_Battleback[_0x2bbd55(0x5d7)][_0x2bbd55(0x81d)]=function(){const _0x13a1c6=_0x2bbd55;this[_0x13a1c6(0x802)]=Graphics[_0x13a1c6(0x802)],this[_0x13a1c6(0x6c3)]=Graphics[_0x13a1c6(0x6c3)];const _0x48a91b=Math['min'](0x1,this[_0x13a1c6(0x802)]/this[_0x13a1c6(0x190)][_0x13a1c6(0x802)]),_0xd884ef=Math[_0x13a1c6(0x4fa)](0x1,this['height']/this[_0x13a1c6(0x190)][_0x13a1c6(0x6c3)]),_0x29852b=Math['max'](_0x48a91b,_0xd884ef);this[_0x13a1c6(0x1ae)]['x']=_0x29852b,this['scale']['y']=_0x29852b,this['x']=(Graphics[_0x13a1c6(0x802)]-this[_0x13a1c6(0x802)])/0x2,this['y']=Graphics[_0x13a1c6(0x6c3)]-this[_0x13a1c6(0x6c3)];},Sprite_Battleback[_0x2bbd55(0x5d7)][_0x2bbd55(0x325)]=function(){const _0x3120f7=_0x2bbd55;this[_0x3120f7(0x802)]=Graphics[_0x3120f7(0x802)],this['height']=Graphics[_0x3120f7(0x6c3)];const _0x55c8f4=Math['max'](0x1,this[_0x3120f7(0x802)]/this['bitmap'][_0x3120f7(0x802)]),_0x152a28=Math['max'](0x1,this[_0x3120f7(0x6c3)]/this[_0x3120f7(0x190)][_0x3120f7(0x6c3)]),_0x34f3ae=Math[_0x3120f7(0x6b9)](_0x55c8f4,_0x152a28);this[_0x3120f7(0x1ae)]['x']=_0x34f3ae,this['scale']['y']=_0x34f3ae,this['x']=(Graphics[_0x3120f7(0x802)]-this[_0x3120f7(0x802)])/0x2,this['y']=Graphics['height']-this[_0x3120f7(0x6c3)];},Spriteset_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x52a)]=function(){const _0x472669=_0x2bbd55;if(!$gameSystem[_0x472669(0x2e6)]())return![];return![];},Spriteset_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x2e2)]=function(){return 0x0;},Spriteset_Battle['prototype']['animationNextDelay']=function(){return 0x0;},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x5ab)]=Spriteset_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x2e3)],Spriteset_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x2e3)]=function(){const _0x4f233c=_0x2bbd55;VisuMZ[_0x4f233c(0x46a)][_0x4f233c(0x5ab)][_0x4f233c(0x4f4)](this),this[_0x4f233c(0x1f9)]();},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x226)]=Spriteset_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x12d)],Spriteset_Battle['prototype'][_0x2bbd55(0x12d)]=function(){const _0x5accec=_0x2bbd55;VisuMZ[_0x5accec(0x46a)][_0x5accec(0x226)][_0x5accec(0x4f4)](this),this['updateWeather']();},Spriteset_Battle['prototype'][_0x2bbd55(0x1f9)]=function(){const _0x17125e=_0x2bbd55;this[_0x17125e(0x2b1)]=new Weather(),this[_0x17125e(0x16a)]['addChild'](this[_0x17125e(0x2b1)]);},Spriteset_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x454)]=function(){const _0x45b8b9=_0x2bbd55;this[_0x45b8b9(0x2b1)]['type']=$gameScreen[_0x45b8b9(0x208)](),this[_0x45b8b9(0x2b1)]['power']=$gameScreen[_0x45b8b9(0x1a5)]();},Game_Interpreter['prototype'][_0x2bbd55(0x187)]=function(_0x3c4036){const _0x598037=_0x2bbd55;$gameScreen['changeWeather'](_0x3c4036[0x0],_0x3c4036[0x1],_0x3c4036[0x2]);if(_0x3c4036[0x3])this[_0x598037(0x30c)](_0x3c4036[0x2]);return!![];},VisuMZ['BattleCore'][_0x2bbd55(0x507)]=Game_Interpreter['prototype'][_0x2bbd55(0x320)],Game_Interpreter[_0x2bbd55(0x5d7)][_0x2bbd55(0x320)]=function(_0x6e5832){const _0x4080a3=_0x2bbd55;return SceneManager[_0x4080a3(0xfb)]()?(SceneManager[_0x4080a3(0x750)][_0x4080a3(0x54a)][_0x4080a3(0x3a8)](_0x6e5832[0x0],_0x6e5832[0x1]),!![]):VisuMZ[_0x4080a3(0x46a)]['Game_Interpreter_command283'][_0x4080a3(0x4f4)](this,_0x6e5832);},Spriteset_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x1c8)]=function(_0x29fb8b,_0x2876e3){_0x29fb8b['bitmap']=_0x2876e3;},Spriteset_Battle['prototype'][_0x2bbd55(0x3a8)]=function(_0x24dad3,_0x4d8618){const _0x4f4380=_0x2bbd55;_0x24dad3=_0x24dad3||'',_0x4d8618=_0x4d8618||'';_0x24dad3===''&&_0x4d8618===''&&(_0x24dad3=this['_back1Sprite'][_0x4f4380(0x6be)](),_0x4d8618=this[_0x4f4380(0x3cb)][_0x4f4380(0x615)]());const _0x246474=ImageManager[_0x4f4380(0x500)](_0x24dad3),_0x1d8d59=ImageManager[_0x4f4380(0x63e)](_0x4d8618);_0x246474[_0x4f4380(0x2c2)](this[_0x4f4380(0x2b7)][_0x4f4380(0x5e6)](this,this[_0x4f4380(0x771)],this[_0x4f4380(0x3cb)],_0x246474,_0x1d8d59));},Spriteset_Battle[_0x2bbd55(0x5d7)]['updateBattlebackBitmap1']=function(_0x3b57d9,_0x568653,_0x5f407f,_0x4ff10d){const _0x21445e=_0x2bbd55;_0x4ff10d[_0x21445e(0x2c2)](this[_0x21445e(0x7a4)][_0x21445e(0x5e6)](this,_0x3b57d9,_0x568653,_0x5f407f,_0x4ff10d));},Spriteset_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x7a4)]=function(_0x22134d,_0x474bb8,_0x2d2554,_0x32e696){const _0x52f8ad=_0x2bbd55;_0x22134d[_0x52f8ad(0x190)]=_0x2d2554,_0x474bb8[_0x52f8ad(0x190)]=_0x32e696,_0x22134d[_0x52f8ad(0x209)](),_0x474bb8[_0x52f8ad(0x209)]();},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x2cd)]=Spriteset_Battle['prototype'][_0x2bbd55(0x531)],Spriteset_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x531)]=function(){const _0x134f1d=_0x2bbd55;VisuMZ[_0x134f1d(0x46a)][_0x134f1d(0x2cd)]['call'](this),this[_0x134f1d(0x7f7)]();},Spriteset_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x7f7)]=function(){const _0xdb6891=_0x2bbd55;this[_0xdb6891(0x5f9)](),this[_0xdb6891(0x1b5)](),this[_0xdb6891(0x604)](),this[_0xdb6891(0x630)]();},Spriteset_Battle[_0x2bbd55(0x5d7)]['createBattleFieldContainer']=function(){const _0x4b272c=_0x2bbd55;this[_0x4b272c(0x1c1)]=new Sprite(),this[_0x4b272c(0x16a)][_0x4b272c(0x3e4)](this[_0x4b272c(0x1c1)]);},Spriteset_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x1b5)]=function(){const _0x4fed38=_0x2bbd55;this[_0x4fed38(0x6e3)]=new Sprite(),this['_battleField'][_0x4fed38(0x3e4)](this['_animationContainer']);},Spriteset_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x604)]=function(){const _0x233a0e=_0x2bbd55;this['_damageContainer']=new Sprite(),this[_0x233a0e(0x57a)]['x']=this[_0x233a0e(0x16a)]['x'],this[_0x233a0e(0x57a)]['y']=this[_0x233a0e(0x16a)]['y'],this['addChild'](this[_0x233a0e(0x57a)]);},Spriteset_Battle['prototype'][_0x2bbd55(0x630)]=function(){const _0x4cf984=_0x2bbd55;if(!this[_0x4cf984(0x52a)]())return;this[_0x4cf984(0x1c1)][_0x4cf984(0x1ae)]['x']=-0x1,this[_0x4cf984(0x1c1)]['x']=this['_battleField'][_0x4cf984(0x802)],this['_animationContainer']['scale']['x']=-0x1,this[_0x4cf984(0x6e3)]['x']=this[_0x4cf984(0x16a)][_0x4cf984(0x802)],this['_damageContainer']['scale']['x']=-0x1,this[_0x4cf984(0x57a)]['x']=this[_0x4cf984(0x16a)]['x']+this['_battleField'][_0x4cf984(0x802)];},Spriteset_Battle[_0x2bbd55(0x5d7)]['createEnemies']=function(){const _0xf6a637=_0x2bbd55;Imported[_0xf6a637(0x7c3)]&&VisuMZ[_0xf6a637(0x648)][_0xf6a637(0x55b)]['UI']['RepositionEnemies']&&this[_0xf6a637(0x756)]();const _0x33d98c=$gameTroop[_0xf6a637(0x158)](),_0x3ee3a2=[];for(const _0x345950 of _0x33d98c){_0x3ee3a2[_0xf6a637(0x786)](new Sprite_Enemy(_0x345950));}_0x3ee3a2[_0xf6a637(0x1d6)](this[_0xf6a637(0x326)][_0xf6a637(0x5e6)](this));for(const _0x3c4a26 of _0x3ee3a2){this['_battlerContainer'][_0xf6a637(0x3e4)](_0x3c4a26);}this['_enemySprites']=_0x3ee3a2;},Spriteset_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x1c2)]=function(){const _0x822fa9=_0x2bbd55;this[_0x822fa9(0x4d9)]=[];for(let _0x4bc4a8=0x0;_0x4bc4a8<$gameParty['maxBattleMembers']();_0x4bc4a8++){const _0x4a26db=$gameParty[_0x822fa9(0x49d)]()[_0x4bc4a8],_0x555a13=new Sprite_Actor();_0x555a13['moveToStartPositionBattleCore'](_0x4a26db),_0x555a13[_0x822fa9(0x40c)](_0x4a26db),_0x555a13[_0x822fa9(0x12d)](),this[_0x822fa9(0x4d9)][_0x822fa9(0x786)](_0x555a13),this[_0x822fa9(0x1c1)][_0x822fa9(0x3e4)](_0x555a13);}},Spriteset_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x7cf)]=function(_0x4320cc,_0x58689a,_0x1bf130,_0x2974b1){const _0x4f31a8=_0x2bbd55,_0x5d2eea=this[_0x4f31a8(0x5bc)](_0x58689a),_0x22663d=new(_0x5d2eea?Sprite_AnimationMV:Sprite_Animation)(),_0xca3994=this[_0x4f31a8(0x672)](_0x4320cc);this[_0x4f31a8(0x6d2)](_0x4320cc[0x0])&&(_0x1bf130=!_0x1bf130),_0x22663d[_0x4f31a8(0x20f)]=_0x4320cc,_0x22663d[_0x4f31a8(0x76c)](_0xca3994,_0x58689a,_0x1bf130,_0x2974b1),this[_0x4f31a8(0x578)](_0x22663d);},Spriteset_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x578)]=function(_0x53f524){const _0x819a2=_0x2bbd55;this[_0x819a2(0x1ca)](_0x53f524)?this[_0x819a2(0x58d)]()['addChild'](_0x53f524):this[_0x819a2(0x6e3)][_0x819a2(0x3e4)](_0x53f524),this[_0x819a2(0x283)][_0x819a2(0x786)](_0x53f524);},Spriteset_Battle['prototype'][_0x2bbd55(0x1ca)]=function(_0x1b4992){const _0x2d3023=_0x2bbd55;if(!_0x1b4992)return![];if(!_0x1b4992[_0x2d3023(0x314)])return![];if(_0x1b4992[_0x2d3023(0x314)][_0x2d3023(0x34f)]!==0x0)return![];if(!_0x1b4992['targetObjects'][0x0])return![];if(!_0x1b4992[_0x2d3023(0x20f)][0x0][_0x2d3023(0x101)]())return![];if($gameSystem[_0x2d3023(0x2e6)]())return![];if(!this['battleStatusWindowAnimationContainer']())return![];return Window_BattleStatus['prototype'][_0x2d3023(0x34a)]()===_0x2d3023(0x455);},Spriteset_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x58d)]=function(){const _0x10a62e=_0x2bbd55;if(!SceneManager[_0x10a62e(0x750)])return;if(!SceneManager[_0x10a62e(0x750)][_0x10a62e(0x537)])return;if(!SceneManager[_0x10a62e(0x750)][_0x10a62e(0x537)][_0x10a62e(0x1d3)])return;return SceneManager[_0x10a62e(0x750)][_0x10a62e(0x537)][_0x10a62e(0x1d3)];},Spriteset_Battle['prototype'][_0x2bbd55(0x217)]=function(_0x4b601f){const _0x435b43=_0x2bbd55;this['removeAnimationFromContainer'](_0x4b601f);for(const _0x35446c of _0x4b601f[_0x435b43(0x20f)]){_0x35446c[_0x435b43(0x400)]&&_0x35446c[_0x435b43(0x400)]();}_0x4b601f['destroy']();},Spriteset_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x6a2)]=function(_0x9fe8b6){const _0x56f6fc=_0x2bbd55;this['_animationSprites'][_0x56f6fc(0x530)](_0x9fe8b6),this['isAnimationShownOnBattlePortrait'](_0x9fe8b6)?this['battleStatusWindowAnimationContainer']()[_0x56f6fc(0x565)](_0x9fe8b6):this[_0x56f6fc(0x6e3)][_0x56f6fc(0x565)](_0x9fe8b6);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x431)]=Spriteset_Battle['prototype'][_0x2bbd55(0x403)],Spriteset_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x403)]=function(){const _0x168c6d=_0x2bbd55;VisuMZ[_0x168c6d(0x46a)][_0x168c6d(0x431)][_0x168c6d(0x4f4)](this),this[_0x168c6d(0x645)]();},Spriteset_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x645)]=function(){const _0x59d574=_0x2bbd55;this[_0x59d574(0x1c1)]['children'][_0x59d574(0x1d6)](this[_0x59d574(0x501)][_0x59d574(0x5e6)](this)),this[_0x59d574(0x21b)]();},Spriteset_Battle['prototype']['compareBattlerSprites']=function(_0x428417,_0x131d45){const _0x763177=_0x2bbd55;if(VisuMZ[_0x763177(0x46a)]['Settings'][_0x763177(0x843)]['PrioritySortActors']){if(_0x428417[_0x763177(0x110)]&&_0x131d45['_battler']){if(_0x428417['_battler'][_0x763177(0x101)]()&&_0x131d45[_0x763177(0x110)][_0x763177(0x2ba)]())return 0x1;else{if(_0x131d45[_0x763177(0x110)]['isActor']()&&_0x428417['_battler'][_0x763177(0x2ba)]())return-0x1;}}}return _0x428417[_0x763177(0x71a)]!==_0x131d45[_0x763177(0x71a)]?_0x428417[_0x763177(0x71a)]-_0x131d45['_baseY']:_0x131d45['spriteId']-_0x428417['spriteId'];},Spriteset_Battle['prototype'][_0x2bbd55(0x21b)]=function(){const _0x55918f=_0x2bbd55;if(!VisuMZ[_0x55918f(0x46a)][_0x55918f(0x55b)][_0x55918f(0x843)]['PrioritySortActive'])return;const _0x59a43d=BattleManager['_subject'];if(_0x59a43d){if(_0x59a43d[_0x55918f(0x101)]()&&!$gameSystem[_0x55918f(0x2e6)]())return;const _0x1ddc07=_0x59a43d[_0x55918f(0x6ae)]();if(_0x1ddc07&&_0x59a43d[_0x55918f(0x101)]())this['_battlerContainer'][_0x55918f(0x3e4)](_0x1ddc07);}},Spriteset_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x542)]=function(){const _0x15a565=_0x2bbd55;for(const _0x1145ef of $gameParty[_0x15a565(0x1ee)]()){if(!_0x1145ef)continue;if(!_0x1145ef['battler']())continue;_0x1145ef[_0x15a565(0x6ae)]()[_0x15a565(0x193)]=!![],_0x1145ef[_0x15a565(0x6ae)]()[_0x15a565(0x19b)]();}},Spriteset_Battle['prototype']['isBusy']=function(){return![];},Spriteset_Battle['prototype'][_0x2bbd55(0x18f)]=function(){const _0x1d329b=_0x2bbd55;return this[_0x1d329b(0x39a)]()[_0x1d329b(0x845)](_0x134fec=>_0x134fec[_0x1d329b(0x229)]());},Spriteset_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x285)]=function(){const _0x41add1=_0x2bbd55;return this[_0x41add1(0x39a)]()[_0x41add1(0x845)](_0x204a2=>_0x204a2[_0x41add1(0x587)]());},Spriteset_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x14e)]=function(){const _0x553b45=_0x2bbd55;return this[_0x553b45(0x39a)]()[_0x553b45(0x845)](_0xaaadf8=>_0xaaadf8[_0x553b45(0x6b8)]());},Spriteset_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x1ec)]=function(){const _0x1e310f=_0x2bbd55;return this[_0x1e310f(0x39a)]()[_0x1e310f(0x845)](_0x24ab1d=>_0x24ab1d[_0x1e310f(0x6da)]());},Spriteset_Battle[_0x2bbd55(0x5d7)]['isAnyoneSpinning']=function(){const _0x59654b=_0x2bbd55;return this[_0x59654b(0x39a)]()[_0x59654b(0x845)](_0x54a021=>_0x54a021['isSpinning']());},Spriteset_Battle[_0x2bbd55(0x5d7)][_0x2bbd55(0x28c)]=function(){const _0x35681f=_0x2bbd55;return this[_0x35681f(0x39a)]()[_0x35681f(0x845)](_0x37fe5b=>_0x37fe5b[_0x35681f(0x20d)]());},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x7e9)]=Window_ItemList[_0x2bbd55(0x5d7)][_0x2bbd55(0x175)],Window_ItemList[_0x2bbd55(0x5d7)][_0x2bbd55(0x175)]=function(){const _0x5d6258=_0x2bbd55;return SceneManager[_0x5d6258(0xfb)]()?SceneManager[_0x5d6258(0x750)][_0x5d6258(0x34a)]()==='border'?VisuMZ[_0x5d6258(0x46a)]['Settings'][_0x5d6258(0x1b0)][_0x5d6258(0x329)]:VisuMZ[_0x5d6258(0x46a)][_0x5d6258(0x55b)][_0x5d6258(0x1b0)]['SkillItemStandardCols']:VisuMZ[_0x5d6258(0x46a)][_0x5d6258(0x7e9)][_0x5d6258(0x4f4)](this);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x718)]=Window_SkillList[_0x2bbd55(0x5d7)][_0x2bbd55(0x175)],Window_SkillList[_0x2bbd55(0x5d7)][_0x2bbd55(0x175)]=function(){const _0x18b986=_0x2bbd55;return SceneManager['isSceneBattle']()?SceneManager[_0x18b986(0x750)]['battleLayoutStyle']()===_0x18b986(0x6bb)?VisuMZ[_0x18b986(0x46a)][_0x18b986(0x55b)]['BattleLayout'][_0x18b986(0x329)]:VisuMZ[_0x18b986(0x46a)][_0x18b986(0x55b)][_0x18b986(0x1b0)][_0x18b986(0x3fd)]:VisuMZ[_0x18b986(0x46a)][_0x18b986(0x718)][_0x18b986(0x4f4)](this);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x79c)]=Window_Options['prototype']['addGeneralOptions'],Window_Options['prototype']['addGeneralOptions']=function(){const _0xfd404f=_0x2bbd55;VisuMZ[_0xfd404f(0x46a)][_0xfd404f(0x79c)][_0xfd404f(0x4f4)](this),this['addAutoBattleCommands'](),this['addShowHpGaugeCommand']();},Window_Options['prototype']['addAutoBattleCommands']=function(){const _0x358ba9=_0x2bbd55;VisuMZ[_0x358ba9(0x46a)]['Settings'][_0x358ba9(0x3d1)][_0x358ba9(0x760)]&&(this[_0x358ba9(0x43c)](),this[_0x358ba9(0x14b)]());},Window_Options[_0x2bbd55(0x5d7)]['addShowHpGaugeCommand']=function(){const _0x540826=_0x2bbd55;if(!VisuMZ[_0x540826(0x46a)][_0x540826(0x55b)][_0x540826(0x58a)][_0x540826(0x25a)])return;const _0x5b5d65=TextManager[_0x540826(0x3ec)],_0x3910f4=_0x540826(0x3ec);this[_0x540826(0x779)](_0x5b5d65,_0x3910f4);},Window_Options['prototype'][_0x2bbd55(0x43c)]=function(){const _0x19ab46=_0x2bbd55,_0x1fe5b9=TextManager[_0x19ab46(0x3fc)],_0x5793bf='autoBattleAtStart';this[_0x19ab46(0x779)](_0x1fe5b9,_0x5793bf);},Window_Options[_0x2bbd55(0x5d7)][_0x2bbd55(0x14b)]=function(){const _0x11a4b5=_0x2bbd55,_0x1faef8=TextManager[_0x11a4b5(0x829)],_0x126a65=_0x11a4b5(0x36f);this['addCommand'](_0x1faef8,_0x126a65);},VisuMZ['BattleCore'][_0x2bbd55(0x68a)]=Window_Options[_0x2bbd55(0x5d7)][_0x2bbd55(0x614)],Window_Options[_0x2bbd55(0x5d7)][_0x2bbd55(0x614)]=function(_0x302540){const _0x4a66d1=_0x2bbd55,_0x440b91=this[_0x4a66d1(0x220)](_0x302540);return _0x440b91==='autoBattleUseSkills'?this[_0x4a66d1(0x276)]():VisuMZ['BattleCore']['Window_Options_statusText'][_0x4a66d1(0x4f4)](this,_0x302540);},Window_Options['prototype'][_0x2bbd55(0x276)]=function(){const _0xa6d6ac=_0x2bbd55,_0x547a42=VisuMZ[_0xa6d6ac(0x46a)]['Settings'][_0xa6d6ac(0x3d1)],_0x15a9ae=this[_0xa6d6ac(0x4a6)](_0xa6d6ac(0x36f));return _0x15a9ae?_0x547a42['StyleON']:_0x547a42[_0xa6d6ac(0x3f5)];},Window_ShopStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x239)]=function(){const _0x41b17c=_0x2bbd55,_0x21d4fa=DataManager[_0x41b17c(0x7dc)](this[_0x41b17c(0x6fa)]),_0x391fa4=VisuMZ[_0x41b17c(0x724)][_0x21d4fa];if(!_0x391fa4)return this['getItemDamageAmountLabelOriginal']();const _0x2ab4a9=_0x41b17c(0x763)[_0x41b17c(0x36b)](this['_item'][_0x41b17c(0x4e0)][_0x41b17c(0x837)]),_0x50be08=[null,TextManager['hp'],TextManager['mp'],TextManager['hp'],TextManager['mp'],TextManager['hp'],TextManager['mp']][this['_item']['damage']['type']];return _0x391fa4[_0x2ab4a9][_0x41b17c(0x36b)](_0x50be08);},Window_ShopStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x399)]=function(){const _0x30f433=_0x2bbd55,_0x343015=DataManager[_0x30f433(0x7dc)](this['_item']),_0x51f392=VisuMZ['DamageStyles'][_0x343015];if(!_0x51f392)return this[_0x30f433(0x202)]();return _0x51f392[_0x30f433(0x253)][_0x30f433(0x4f4)](this);},VisuMZ['BattleCore'][_0x2bbd55(0x839)]=Window_PartyCommand[_0x2bbd55(0x5d7)]['initialize'],Window_PartyCommand['prototype']['initialize']=function(_0x3d6b47){const _0x268ce3=_0x2bbd55;VisuMZ['BattleCore'][_0x268ce3(0x839)][_0x268ce3(0x4f4)](this,_0x3d6b47),this[_0x268ce3(0x83f)](_0x3d6b47);},Window_PartyCommand[_0x2bbd55(0x5d7)]['createCommandNameWindow']=function(_0x1d7ec8){const _0x1dd241=_0x2bbd55,_0x475231=new Rectangle(0x0,0x0,_0x1d7ec8[_0x1dd241(0x802)],_0x1d7ec8[_0x1dd241(0x6c3)]);this[_0x1dd241(0x1fc)]=new Window_Base(_0x475231),this[_0x1dd241(0x1fc)][_0x1dd241(0x694)]=0x0,this[_0x1dd241(0x3e4)](this[_0x1dd241(0x1fc)]),this['updateCommandNameWindow']();},Window_PartyCommand[_0x2bbd55(0x5d7)]['callUpdateHelp']=function(){const _0x17d27c=_0x2bbd55;Window_Command[_0x17d27c(0x5d7)][_0x17d27c(0x657)][_0x17d27c(0x4f4)](this);if(this[_0x17d27c(0x1fc)])this[_0x17d27c(0x3e6)]();},Window_PartyCommand['prototype'][_0x2bbd55(0x3e6)]=function(){const _0x9bc2f=_0x2bbd55,_0x1e0983=this[_0x9bc2f(0x1fc)];_0x1e0983[_0x9bc2f(0x398)]['clear']();const _0x4e57ff=this[_0x9bc2f(0x289)](this[_0x9bc2f(0x513)]());if(_0x4e57ff===_0x9bc2f(0x721)&&this[_0x9bc2f(0x5b0)]()>0x0){const _0x1e3f43=this[_0x9bc2f(0x64b)](this[_0x9bc2f(0x513)]());let _0x65e71b=this[_0x9bc2f(0x7c0)](this[_0x9bc2f(0x513)]());_0x65e71b=_0x65e71b[_0x9bc2f(0x830)](/\\I\[(\d+)\]/gi,''),_0x1e0983[_0x9bc2f(0x185)](),this[_0x9bc2f(0x1c4)](_0x65e71b,_0x1e3f43),this[_0x9bc2f(0x7ae)](_0x65e71b,_0x1e3f43),this[_0x9bc2f(0x114)](_0x65e71b,_0x1e3f43);}},Window_PartyCommand['prototype'][_0x2bbd55(0x1c4)]=function(_0xa3d6e3,_0x854c2e){},Window_PartyCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x7ae)]=function(_0x2145fb,_0x562430){const _0x2fdfa5=_0x2bbd55,_0x5c91fc=this[_0x2fdfa5(0x1fc)];_0x5c91fc[_0x2fdfa5(0x851)](_0x2145fb,0x0,_0x562430['y'],_0x5c91fc[_0x2fdfa5(0x29f)],'center');},Window_PartyCommand['prototype'][_0x2bbd55(0x114)]=function(_0x2e9cba,_0x64714f){const _0x2a8633=_0x2bbd55,_0x58a15d=this['_commandNameWindow'],_0x33a751=$gameSystem[_0x2a8633(0x5f4)](),_0x40ee42=_0x64714f['x']+Math[_0x2a8633(0x2c6)](_0x64714f['width']/0x2)+_0x33a751;_0x58a15d['x']=_0x58a15d['width']/-0x2+_0x40ee42,_0x58a15d['y']=Math[_0x2a8633(0x2c6)](_0x64714f[_0x2a8633(0x6c3)]/0x2);},Window_PartyCommand['prototype'][_0x2bbd55(0x728)]=function(){const _0x2e7c2f=_0x2bbd55;this[_0x2e7c2f(0x784)](),this[_0x2e7c2f(0x2fa)](),this[_0x2e7c2f(0x1b2)](),this[_0x2e7c2f(0x261)](),this['addEscapeCommand']();},Window_PartyCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x784)]=function(){const _0x1e9978=_0x2bbd55,_0x53b811=this['commandStyle'](),_0x53a0a7=VisuMZ[_0x1e9978(0x46a)]['Settings'][_0x1e9978(0x126)][_0x1e9978(0x62f)],_0xbab3a5=_0x53b811===_0x1e9978(0x7ea)?TextManager['fight']:_0x1e9978(0x199)['format'](_0x53a0a7,TextManager['fight']),_0x5ea6af=this['isFightCommandEnabled']();this[_0x1e9978(0x779)](_0xbab3a5,_0x1e9978(0x590),_0x5ea6af);},Window_PartyCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x7ba)]=function(){return!![];},Window_PartyCommand['prototype'][_0x2bbd55(0x2fa)]=function(){const _0x50e311=_0x2bbd55;if(!this['isAutoBattleCommandAdded']())return;const _0x50015a=this[_0x50e311(0x1a6)](),_0x4fae61=VisuMZ[_0x50e311(0x46a)][_0x50e311(0x55b)][_0x50e311(0x126)]['CmdIconAutoBattle'],_0xc2aeef=_0x50015a===_0x50e311(0x7ea)?TextManager[_0x50e311(0x75a)]:_0x50e311(0x199)[_0x50e311(0x36b)](_0x4fae61,TextManager[_0x50e311(0x75a)]),_0x42e79d=this[_0x50e311(0x712)]();this[_0x50e311(0x779)](_0xc2aeef,'autoBattle',_0x42e79d);},Window_PartyCommand['prototype'][_0x2bbd55(0x816)]=function(){const _0x234d73=_0x2bbd55;return VisuMZ[_0x234d73(0x46a)][_0x234d73(0x55b)][_0x234d73(0x126)]['CommandAddAutoBattle'];},Window_PartyCommand['prototype'][_0x2bbd55(0x712)]=function(){return!![];},Window_PartyCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x1b2)]=function(){},Window_PartyCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x261)]=function(){const _0x4584d3=_0x2bbd55;if(!this['isOptionsCommandAdded']())return;const _0x59c106=this['commandStyle'](),_0x161e50=VisuMZ[_0x4584d3(0x46a)][_0x4584d3(0x55b)][_0x4584d3(0x126)]['CmdIconOptions'],_0x101291=_0x59c106===_0x4584d3(0x7ea)?TextManager[_0x4584d3(0x433)]:_0x4584d3(0x199)[_0x4584d3(0x36b)](_0x161e50,TextManager[_0x4584d3(0x433)]),_0x5c9aba=this[_0x4584d3(0x5d3)]();this[_0x4584d3(0x779)](_0x101291,_0x4584d3(0x433),_0x5c9aba);},Window_PartyCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x159)]=function(){const _0x298dc3=_0x2bbd55;return VisuMZ[_0x298dc3(0x46a)][_0x298dc3(0x55b)][_0x298dc3(0x126)][_0x298dc3(0x3b5)];},Window_PartyCommand[_0x2bbd55(0x5d7)]['isOptionsCommandEnabled']=function(){return!![];},Window_PartyCommand['prototype'][_0x2bbd55(0x235)]=function(){const _0x2f907f=_0x2bbd55,_0x22ea9c=this[_0x2f907f(0x1a6)](),_0x4bcb0c=VisuMZ[_0x2f907f(0x46a)][_0x2f907f(0x55b)][_0x2f907f(0x126)][_0x2f907f(0x4e1)],_0x3294f0=_0x22ea9c===_0x2f907f(0x7ea)?TextManager['escape']:_0x2f907f(0x199)[_0x2f907f(0x36b)](_0x4bcb0c,TextManager[_0x2f907f(0x78f)]),_0x3b4022=this['isEscapeCommandEnabled']();this[_0x2f907f(0x779)](_0x3294f0,'escape',_0x3b4022);},Window_PartyCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x415)]=function(){const _0x3664a6=_0x2bbd55;return BattleManager[_0x3664a6(0x338)]();},Window_PartyCommand['prototype'][_0x2bbd55(0x3d5)]=function(){const _0xfeac72=_0x2bbd55;return VisuMZ['BattleCore'][_0xfeac72(0x55b)]['PartyCmd'][_0xfeac72(0x1fe)];},Window_PartyCommand['prototype'][_0x2bbd55(0x2ea)]=function(_0x11e4d4){const _0x40b39c=_0x2bbd55,_0x2209b9=this[_0x40b39c(0x289)](_0x11e4d4);if(_0x2209b9===_0x40b39c(0x4ed))this['drawItemStyleIconText'](_0x11e4d4);else _0x2209b9===_0x40b39c(0x721)?this['drawItemStyleIcon'](_0x11e4d4):Window_Command['prototype'][_0x40b39c(0x2ea)][_0x40b39c(0x4f4)](this,_0x11e4d4);},Window_PartyCommand[_0x2bbd55(0x5d7)]['commandStyle']=function(){const _0x7acb09=_0x2bbd55;return VisuMZ[_0x7acb09(0x46a)]['Settings'][_0x7acb09(0x126)][_0x7acb09(0x2de)];},Window_PartyCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x289)]=function(_0x1c9445){const _0x57b5a1=_0x2bbd55;if(_0x1c9445<0x0)return _0x57b5a1(0x7ea);const _0x3baece=this[_0x57b5a1(0x1a6)]();if(_0x3baece!==_0x57b5a1(0x27e))return _0x3baece;else{if(this['maxItems']()>0x0){const _0x47ad15=this[_0x57b5a1(0x7c0)](_0x1c9445);if(_0x47ad15[_0x57b5a1(0x87d)](/\\I\[(\d+)\]/i)){const _0x4c9446=this[_0x57b5a1(0x64b)](_0x1c9445),_0x2b7b4e=this[_0x57b5a1(0x6e1)](_0x47ad15)[_0x57b5a1(0x802)];return _0x2b7b4e<=_0x4c9446[_0x57b5a1(0x802)]?_0x57b5a1(0x4ed):_0x57b5a1(0x721);}}}return _0x57b5a1(0x7ea);},Window_PartyCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x40f)]=function(_0x43c9b4){const _0xbe18b5=_0x2bbd55,_0x581e52=this[_0xbe18b5(0x64b)](_0x43c9b4),_0x5bf18e=this[_0xbe18b5(0x7c0)](_0x43c9b4),_0x351c86=this[_0xbe18b5(0x6e1)](_0x5bf18e)[_0xbe18b5(0x802)];this[_0xbe18b5(0x558)](this[_0xbe18b5(0x3ae)](_0x43c9b4));const _0x1bf772=this[_0xbe18b5(0x3d5)]();if(_0x1bf772===_0xbe18b5(0x740))this['drawTextEx'](_0x5bf18e,_0x581e52['x']+_0x581e52[_0xbe18b5(0x802)]-_0x351c86,_0x581e52['y'],_0x351c86);else{if(_0x1bf772===_0xbe18b5(0x6b4)){const _0x26af06=_0x581e52['x']+Math[_0xbe18b5(0x2c6)]((_0x581e52['width']-_0x351c86)/0x2);this[_0xbe18b5(0x74c)](_0x5bf18e,_0x26af06,_0x581e52['y'],_0x351c86);}else this[_0xbe18b5(0x74c)](_0x5bf18e,_0x581e52['x'],_0x581e52['y'],_0x351c86);}},Window_PartyCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x302)]=function(_0x34299c){const _0x514bca=_0x2bbd55;this[_0x514bca(0x7c0)](_0x34299c)['match'](/\\I\[(\d+)\]/i);const _0x17a27b=Number(RegExp['$1'])||0x0,_0x2e5388=this[_0x514bca(0x64b)](_0x34299c),_0x49b19b=_0x2e5388['x']+Math[_0x514bca(0x2c6)]((_0x2e5388['width']-ImageManager[_0x514bca(0x281)])/0x2),_0xc26b2a=_0x2e5388['y']+(_0x2e5388[_0x514bca(0x6c3)]-ImageManager['iconHeight'])/0x2;this[_0x514bca(0x170)](_0x17a27b,_0x49b19b,_0xc26b2a);},Window_PartyCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x1d1)]=function(){},Window_PartyCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x459)]=function(){const _0x46f406=_0x2bbd55;Window_Command[_0x46f406(0x5d7)][_0x46f406(0x459)][_0x46f406(0x4f4)](this);const _0x4c5a83=this[_0x46f406(0x34a)]();_0x4c5a83===_0x46f406(0x6bb)&&this[_0x46f406(0x2f5)]();},Window_PartyCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x34a)]=function(){const _0x347ccb=_0x2bbd55;if(this[_0x347ccb(0x7f8)])return this['_battleLayoutStyle'];return this[_0x347ccb(0x7f8)]=SceneManager[_0x347ccb(0x750)][_0x347ccb(0x34a)](),this[_0x347ccb(0x7f8)];},Window_PartyCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x6f0)]=function(){const _0x1c489b=_0x2bbd55,_0x126da4=VisuMZ[_0x1c489b(0x46a)][_0x1c489b(0x55b)][_0x1c489b(0x126)],_0x27bb5b=this['currentSymbol']();switch(_0x27bb5b){case _0x1c489b(0x590):this[_0x1c489b(0x46d)][_0x1c489b(0x4c1)](_0x126da4[_0x1c489b(0x800)]);break;case _0x1c489b(0x75a):this[_0x1c489b(0x46d)]['setText'](_0x126da4[_0x1c489b(0x7fc)]);break;case _0x1c489b(0x433):this[_0x1c489b(0x46d)][_0x1c489b(0x4c1)](_0x126da4[_0x1c489b(0x174)]);break;case _0x1c489b(0x78f):this['_helpWindow'][_0x1c489b(0x4c1)](_0x126da4[_0x1c489b(0x637)]);break;default:this[_0x1c489b(0x46d)][_0x1c489b(0x4c1)]('');break;}},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x4e8)]=Window_ActorCommand['prototype'][_0x2bbd55(0x447)],Window_ActorCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x447)]=function(_0x6055af){const _0x4f1f56=_0x2bbd55;VisuMZ['BattleCore'][_0x4f1f56(0x4e8)][_0x4f1f56(0x4f4)](this,_0x6055af),this[_0x4f1f56(0x83f)](_0x6055af);},Window_ActorCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x83f)]=function(_0xde38a){const _0x2a1f5d=_0x2bbd55,_0x19ff1a=new Rectangle(0x0,0x0,_0xde38a[_0x2a1f5d(0x802)],_0xde38a[_0x2a1f5d(0x6c3)]);this['_commandNameWindow']=new Window_Base(_0x19ff1a),this[_0x2a1f5d(0x1fc)][_0x2a1f5d(0x694)]=0x0,this[_0x2a1f5d(0x3e4)](this[_0x2a1f5d(0x1fc)]),this['updateCommandNameWindow']();},Window_ActorCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x657)]=function(){const _0x9073b8=_0x2bbd55;Window_Command[_0x9073b8(0x5d7)][_0x9073b8(0x657)][_0x9073b8(0x4f4)](this);if(this[_0x9073b8(0x1fc)])this[_0x9073b8(0x3e6)]();},Window_ActorCommand['prototype'][_0x2bbd55(0x3e6)]=function(){const _0x4bc85f=_0x2bbd55,_0x450330=this[_0x4bc85f(0x1fc)];_0x450330[_0x4bc85f(0x398)][_0x4bc85f(0x277)]();const _0x36cff7=this['commandStyleCheck'](this[_0x4bc85f(0x513)]());if(_0x36cff7===_0x4bc85f(0x721)&&this[_0x4bc85f(0x5b0)]()>0x0){const _0x22d013=this[_0x4bc85f(0x64b)](this[_0x4bc85f(0x513)]());let _0x1339d5=this[_0x4bc85f(0x7c0)](this[_0x4bc85f(0x513)]());_0x1339d5=_0x1339d5[_0x4bc85f(0x830)](/\\I\[(\d+)\]/gi,''),_0x450330[_0x4bc85f(0x185)](),this[_0x4bc85f(0x1c4)](_0x1339d5,_0x22d013),this[_0x4bc85f(0x7ae)](_0x1339d5,_0x22d013),this[_0x4bc85f(0x114)](_0x1339d5,_0x22d013);}},Window_ActorCommand[_0x2bbd55(0x5d7)]['commandNameWindowDrawBackground']=function(_0x32cdeb,_0x315e4f){},Window_ActorCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x7ae)]=function(_0x5bb486,_0x12728b){const _0x209556=_0x2bbd55,_0x3ca82c=this['_commandNameWindow'];_0x3ca82c['drawText'](_0x5bb486,0x0,_0x12728b['y'],_0x3ca82c[_0x209556(0x29f)],_0x209556(0x6b4));},Window_ActorCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x114)]=function(_0x246fdb,_0x266e30){const _0x44fca0=_0x2bbd55,_0x379b43=this['_commandNameWindow'],_0x172983=$gameSystem['windowPadding'](),_0x28d4f4=_0x266e30['x']+Math[_0x44fca0(0x2c6)](_0x266e30[_0x44fca0(0x802)]/0x2)+_0x172983;_0x379b43['x']=_0x379b43[_0x44fca0(0x802)]/-0x2+_0x28d4f4,_0x379b43['y']=Math[_0x44fca0(0x2c6)](_0x266e30[_0x44fca0(0x6c3)]/0x2);},Window_ActorCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x728)]=function(){const _0x546f3f=_0x2bbd55;if(!this[_0x546f3f(0x5c2)])return;const _0xbf2ef3=this[_0x546f3f(0x5c2)]['battleCommands']();for(const _0x442e8b of _0xbf2ef3){this[_0x546f3f(0x6db)](_0x442e8b[_0x546f3f(0x6d4)]()[_0x546f3f(0x692)]());}},Window_ActorCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x6db)]=function(_0x4c619a){const _0x125c06=_0x2bbd55;_0x4c619a===_0x125c06(0x265)&&this[_0x125c06(0x360)]();[_0x125c06(0x75f),_0x125c06(0x464)]['includes'](_0x4c619a)&&this['addSkillCommands']();_0x4c619a==='GUARD'&&this['addGuardCommand']();_0x4c619a===_0x125c06(0x55a)&&this['addItemCommand']();_0x4c619a===_0x125c06(0x5e0)&&this[_0x125c06(0x235)]();_0x4c619a==='AUTO\x20BATTLE'&&this[_0x125c06(0x2fa)]();if(_0x4c619a[_0x125c06(0x87d)](/STYPE: (\d+)/i)){const _0x2d21e5=Number(RegExp['$1']);this[_0x125c06(0x25d)](_0x2d21e5);}else{if(_0x4c619a['match'](/STYPE: (.*)/i)){const _0x3e13f6=DataManager[_0x125c06(0x5e9)](RegExp['$1']);this[_0x125c06(0x25d)](_0x3e13f6);}}_0x4c619a===_0x125c06(0x776)&&this[_0x125c06(0x22a)]();if(_0x4c619a['match'](/SKILL: (\d+)/i)){const _0x167f91=Number(RegExp['$1']);this[_0x125c06(0x5fc)]($dataSkills[_0x167f91]);}else{if(_0x4c619a[_0x125c06(0x87d)](/SKILL: (.*)/i)){const _0x11963e=DataManager[_0x125c06(0x75d)](RegExp['$1']);this['addSingleSkillCommand']($dataSkills[_0x11963e]);}}_0x4c619a===_0x125c06(0x83a)&&Imported[_0x125c06(0x2e7)]&&this[_0x125c06(0x5e1)](),[_0x125c06(0x59a),_0x125c06(0x557)][_0x125c06(0x42f)](_0x4c619a)&&Imported[_0x125c06(0x865)]&&this[_0x125c06(0x5ad)]();},Window_ActorCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x360)]=function(){const _0x5a717e=_0x2bbd55,_0x4af0e3=$dataSkills[this['_actor'][_0x5a717e(0x424)]()];if(!_0x4af0e3)return;if(!this[_0x5a717e(0x71e)](_0x4af0e3))return;const _0x4c7ae2=this['commandStyle'](),_0x155382=DataManager[_0x5a717e(0x6a8)](_0x4af0e3),_0x131ecb=DataManager[_0x5a717e(0x5bb)](_0x4af0e3),_0x59b5ba=_0x4c7ae2===_0x5a717e(0x7ea)?_0x155382:_0x5a717e(0x199)[_0x5a717e(0x36b)](_0x131ecb,_0x155382);this[_0x5a717e(0x779)](_0x59b5ba,'attack',this[_0x5a717e(0x5c2)][_0x5a717e(0x826)]());},Window_ActorCommand[_0x2bbd55(0x5d7)]['addGuardCommand']=function(){const _0x1b85c6=_0x2bbd55,_0x19176b=$dataSkills[this[_0x1b85c6(0x5c2)][_0x1b85c6(0x382)]()];if(!_0x19176b)return;if(!this[_0x1b85c6(0x71e)](_0x19176b))return;const _0x16c7c0=this[_0x1b85c6(0x1a6)](),_0x20b9eb=DataManager[_0x1b85c6(0x6a8)](_0x19176b),_0x172f11=DataManager[_0x1b85c6(0x5bb)](_0x19176b),_0x4bea7c=_0x16c7c0===_0x1b85c6(0x7ea)?_0x20b9eb:_0x1b85c6(0x199)[_0x1b85c6(0x36b)](_0x172f11,_0x20b9eb);this[_0x1b85c6(0x779)](_0x4bea7c,_0x1b85c6(0x7ad),this[_0x1b85c6(0x5c2)][_0x1b85c6(0x5f8)]());},Window_ActorCommand['prototype']['addItemCommand']=function(){const _0x2b991f=_0x2bbd55,_0x462df9=this[_0x2b991f(0x1a6)](),_0x49f477=VisuMZ[_0x2b991f(0x46a)]['Settings'][_0x2b991f(0x230)][_0x2b991f(0x181)],_0x3af1b2=_0x462df9===_0x2b991f(0x7ea)?TextManager[_0x2b991f(0x2d9)]:_0x2b991f(0x199)[_0x2b991f(0x36b)](_0x49f477,TextManager[_0x2b991f(0x2d9)]),_0x1f3307=this[_0x2b991f(0x7d8)]();this[_0x2b991f(0x779)](_0x3af1b2,_0x2b991f(0x2d9),_0x1f3307);},Window_ActorCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x7d8)]=function(){const _0x13c5f0=_0x2bbd55;return this[_0x13c5f0(0x5c2)]&&this[_0x13c5f0(0x5c2)][_0x13c5f0(0x1b4)]();},Window_ActorCommand['prototype']['addSkillCommands']=function(){const _0x2dc489=_0x2bbd55,_0x3ad411=this[_0x2dc489(0x5c2)][_0x2dc489(0x1fd)]();for(const _0x497696 of _0x3ad411){this[_0x2dc489(0x25d)](_0x497696);}},Window_ActorCommand[_0x2bbd55(0x5d7)]['addSkillTypeCommand']=function(_0x313a32){const _0x24184f=_0x2bbd55;let _0x5f166b=$dataSystem['skillTypes'][_0x313a32];if(!_0x5f166b)return;let _0x5d2e01=_0x5f166b;const _0x59ffbf=this['commandStyle']();if(_0x59ffbf===_0x24184f(0x7ea))_0x5d2e01=_0x5d2e01['replace'](/\x1I\[(\d+)\]/gi,''),_0x5d2e01=_0x5d2e01[_0x24184f(0x830)](/\\I\[(\d+)\]/gi,'');else{if(!_0x5f166b[_0x24184f(0x87d)](/\\I\[(\d+)\]/i)){const _0x4b69ad=Imported[_0x24184f(0x34e)]?VisuMZ['SkillsStatesCore'][_0x24184f(0x55b)][_0x24184f(0x215)]:VisuMZ['BattleCore'][_0x24184f(0x55b)]['ActorCmd'],_0x2c324f=$dataSystem['magicSkills'][_0x24184f(0x42f)](_0x313a32),_0xa7798d=_0x2c324f?_0x4b69ad['IconStypeMagic']:_0x4b69ad['IconStypeNorm'];_0x5d2e01=_0x24184f(0x199)[_0x24184f(0x36b)](_0xa7798d,_0x5f166b);}}this[_0x24184f(0x779)](_0x5d2e01,_0x24184f(0x35f),!![],_0x313a32);},Window_ActorCommand[_0x2bbd55(0x5d7)]['addSingleSkillCommands']=function(){const _0x1a0a15=_0x2bbd55,_0x5efc00=this[_0x1a0a15(0x5c2)][_0x1a0a15(0x1fd)](),_0x11e827=this['_actor'][_0x1a0a15(0x1fb)]();for(const _0x2e0037 of _0x11e827){if(!_0x2e0037)continue;if(Imported['VisuMZ_1_SkillsStatesCore']){if(this[_0x1a0a15(0x85b)](_0x2e0037))continue;if(this[_0x1a0a15(0x6d8)](_0x2e0037))continue;}else{if(!_0x5efc00[_0x1a0a15(0x42f)](_0x2e0037[_0x1a0a15(0x2b5)]))continue;}this[_0x1a0a15(0x5fc)](_0x2e0037);}},Window_ActorCommand[_0x2bbd55(0x5d7)]['getSimilarSTypes']=function(_0x2a806e){const _0x3aa259=_0x2bbd55,_0x325bb6=this[_0x3aa259(0x5c2)]['skillTypes'](),_0x37827a=_0x325bb6['filter'](_0x141b19=>DataManager['getSkillTypes'](_0x2a806e)[_0x3aa259(0x42f)](_0x141b19));return _0x37827a[_0x3aa259(0x5cf)]<=0x0;},Window_ActorCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x6d8)]=function(_0x3c493b){const _0x371a8d=_0x2bbd55;if(!Window_SkillList[_0x371a8d(0x5d7)]['checkShowHideBattleNotetags'][_0x371a8d(0x4f4)](this,_0x3c493b))return!![];if(!Window_SkillList[_0x371a8d(0x5d7)][_0x371a8d(0x7a0)][_0x371a8d(0x4f4)](this,_0x3c493b))return!![];if(!Window_SkillList['prototype'][_0x371a8d(0x2f4)]['call'](this,_0x3c493b))return!![];return![];},Window_ActorCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x5fc)]=function(_0x241fd6){const _0x34da2d=_0x2bbd55;if(!_0x241fd6)return;if(!this[_0x34da2d(0x71e)](_0x241fd6))return;const _0x160613=this[_0x34da2d(0x1a6)](),_0x581d0e=DataManager[_0x34da2d(0x6a8)](_0x241fd6),_0x4d1161=DataManager['battleCommandIcon'](_0x241fd6),_0x453d71=_0x160613===_0x34da2d(0x7ea)?_0x581d0e:_0x34da2d(0x199)[_0x34da2d(0x36b)](_0x4d1161,_0x581d0e),_0x5ceb18=this[_0x34da2d(0x5c2)]['canUse'](_0x241fd6);this[_0x34da2d(0x779)](_0x453d71,_0x34da2d(0x804),_0x5ceb18,_0x241fd6['id']);},Window_ActorCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x71e)]=function(_0x3116a3){const _0x80bad3=_0x2bbd55,_0x1b55ba=_0x3116a3[_0x80bad3(0x11b)];if(_0x1b55ba[_0x80bad3(0x87d)](/<COMMAND REQUIRE LEARN>/i)){if(!this[_0x80bad3(0x5c2)]['isLearnedSkill'](_0x3116a3['id']))return![];}if(_0x1b55ba[_0x80bad3(0x87d)](/<COMMAND REQUIRE ACCESS>/i)){if(!this[_0x80bad3(0x5c2)][_0x80bad3(0x7be)](_0x3116a3['id']))return![];}const _0x200b7f=VisuMZ[_0x80bad3(0x46a)]['createKeyJS'](_0x3116a3,'CommandVisible');if(VisuMZ['BattleCore']['JS'][_0x200b7f]){if(!VisuMZ[_0x80bad3(0x46a)]['JS'][_0x200b7f][_0x80bad3(0x4f4)](this,this[_0x80bad3(0x5c2)],_0x3116a3))return![];}return VisuMZ[_0x80bad3(0x46a)][_0x80bad3(0x26f)](_0x3116a3);},VisuMZ[_0x2bbd55(0x46a)]['CheckSkillCommandShowSwitches']=function(_0x21eab8){const _0xb0563f=_0x2bbd55,_0x51ee73=_0x21eab8['note'];if(_0x51ee73['match'](/<COMMAND SHOW[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x19dfba=JSON[_0xb0563f(0x28a)]('['+RegExp['$1'][_0xb0563f(0x87d)](/\d+/g)+']');for(const _0x338111 of _0x19dfba){if(!$gameSwitches[_0xb0563f(0x11c)](_0x338111))return![];}return!![];}if(_0x51ee73[_0xb0563f(0x87d)](/<COMMAND SHOW ALL[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x39187f=JSON[_0xb0563f(0x28a)]('['+RegExp['$1'][_0xb0563f(0x87d)](/\d+/g)+']');for(const _0x2ef5c8 of _0x39187f){if(!$gameSwitches[_0xb0563f(0x11c)](_0x2ef5c8))return![];}return!![];}if(_0x51ee73[_0xb0563f(0x87d)](/<COMMAND SHOW ANY[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x34caa7=JSON['parse']('['+RegExp['$1'][_0xb0563f(0x87d)](/\d+/g)+']');for(const _0xa188fd of _0x34caa7){if($gameSwitches[_0xb0563f(0x11c)](_0xa188fd))return!![];}return![];}if(_0x51ee73[_0xb0563f(0x87d)](/<COMMAND HIDE[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x1bead9=JSON[_0xb0563f(0x28a)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0xa76d13 of _0x1bead9){if(!$gameSwitches[_0xb0563f(0x11c)](_0xa76d13))return!![];}return![];}if(_0x51ee73[_0xb0563f(0x87d)](/<COMMAND HIDE ALL[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x51677c=JSON[_0xb0563f(0x28a)]('['+RegExp['$1'][_0xb0563f(0x87d)](/\d+/g)+']');for(const _0x67c75 of _0x51677c){if(!$gameSwitches[_0xb0563f(0x11c)](_0x67c75))return!![];}return![];}if(_0x51ee73['match'](/<COMMAND HIDE ANY[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x391f34=JSON[_0xb0563f(0x28a)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0xe1fa6a of _0x391f34){if($gameSwitches[_0xb0563f(0x11c)](_0xe1fa6a))return![];}return!![];}return!![];},Window_ActorCommand[_0x2bbd55(0x5d7)]['addEscapeCommand']=function(){const _0x7445d3=_0x2bbd55,_0x51b4b9=this[_0x7445d3(0x1a6)](),_0x35d87c=VisuMZ[_0x7445d3(0x46a)][_0x7445d3(0x55b)][_0x7445d3(0x126)][_0x7445d3(0x4e1)],_0x5ba679=_0x51b4b9==='text'?TextManager[_0x7445d3(0x78f)]:_0x7445d3(0x199)[_0x7445d3(0x36b)](_0x35d87c,TextManager[_0x7445d3(0x78f)]),_0x192330=this[_0x7445d3(0x415)]();this['addCommand'](_0x5ba679,'escape',_0x192330);},Window_ActorCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x415)]=function(){const _0x380100=_0x2bbd55;return BattleManager[_0x380100(0x338)]();},Window_ActorCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x2fa)]=function(){const _0x5b7088=_0x2bbd55,_0x2a60cd=this[_0x5b7088(0x1a6)](),_0x159596=VisuMZ['BattleCore'][_0x5b7088(0x55b)][_0x5b7088(0x126)][_0x5b7088(0x5c5)],_0x217917=_0x2a60cd===_0x5b7088(0x7ea)?TextManager[_0x5b7088(0x75a)]:_0x5b7088(0x199)[_0x5b7088(0x36b)](_0x159596,TextManager[_0x5b7088(0x75a)]),_0x42be0f=this[_0x5b7088(0x712)]();this[_0x5b7088(0x779)](_0x217917,_0x5b7088(0x75a),_0x42be0f);},Window_ActorCommand['prototype'][_0x2bbd55(0x712)]=function(){return!![];},Window_ActorCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x3d5)]=function(){const _0x19cc32=_0x2bbd55;return VisuMZ[_0x19cc32(0x46a)][_0x19cc32(0x55b)][_0x19cc32(0x230)][_0x19cc32(0x1fe)];},Window_ActorCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x2ea)]=function(_0x29dc4a){const _0x4349b6=_0x2bbd55,_0x5e9a95=this['commandStyleCheck'](_0x29dc4a);if(_0x5e9a95===_0x4349b6(0x4ed))this['drawItemStyleIconText'](_0x29dc4a);else _0x5e9a95==='icon'?this[_0x4349b6(0x302)](_0x29dc4a):Window_Command['prototype']['drawItem'][_0x4349b6(0x4f4)](this,_0x29dc4a);this[_0x4349b6(0x5b4)](_0x29dc4a);},Window_ActorCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x1a6)]=function(){const _0x350b4b=_0x2bbd55;return VisuMZ[_0x350b4b(0x46a)][_0x350b4b(0x55b)][_0x350b4b(0x230)][_0x350b4b(0x2de)];},Window_ActorCommand['prototype'][_0x2bbd55(0x289)]=function(_0x4a3e2a){const _0x5413d7=_0x2bbd55;if(_0x4a3e2a<0x0)return _0x5413d7(0x7ea);const _0x511f08=this['commandStyle']();if(_0x511f08!==_0x5413d7(0x27e))return _0x511f08;else{if(this['maxItems']()>0x0){const _0x59391c=this[_0x5413d7(0x7c0)](_0x4a3e2a);if(_0x59391c[_0x5413d7(0x87d)](/\\I\[(\d+)\]/i)){const _0x29f7b9=this[_0x5413d7(0x64b)](_0x4a3e2a),_0x918ff8=this['textSizeEx'](_0x59391c)[_0x5413d7(0x802)];return _0x918ff8<=_0x29f7b9[_0x5413d7(0x802)]?_0x5413d7(0x4ed):_0x5413d7(0x721);}}}return _0x5413d7(0x7ea);},Window_ActorCommand[_0x2bbd55(0x5d7)]['drawItemStyleIconText']=function(_0x256fd6){const _0x4d8541=_0x2bbd55,_0x3c215a=this[_0x4d8541(0x64b)](_0x256fd6),_0x12338b=this[_0x4d8541(0x7c0)](_0x256fd6),_0x227caf=this[_0x4d8541(0x6e1)](_0x12338b)[_0x4d8541(0x802)];this[_0x4d8541(0x558)](this[_0x4d8541(0x3ae)](_0x256fd6));const _0x5dbc45=this[_0x4d8541(0x3d5)]();if(_0x5dbc45===_0x4d8541(0x740))this[_0x4d8541(0x74c)](_0x12338b,_0x3c215a['x']+_0x3c215a['width']-_0x227caf,_0x3c215a['y'],_0x227caf);else{if(_0x5dbc45===_0x4d8541(0x6b4)){const _0x4ee2e1=_0x3c215a['x']+Math['floor']((_0x3c215a[_0x4d8541(0x802)]-_0x227caf)/0x2);this[_0x4d8541(0x74c)](_0x12338b,_0x4ee2e1,_0x3c215a['y'],_0x227caf);}else this[_0x4d8541(0x74c)](_0x12338b,_0x3c215a['x'],_0x3c215a['y'],_0x227caf);}},Window_ActorCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x302)]=function(_0x4bcfa2){const _0x2ac30f=_0x2bbd55;this[_0x2ac30f(0x7c0)](_0x4bcfa2)['match'](/\\I\[(\d+)\]/i);const _0x363785=Number(RegExp['$1'])||0x0,_0x511928=this[_0x2ac30f(0x64b)](_0x4bcfa2),_0x30a711=_0x511928['x']+Math[_0x2ac30f(0x2c6)]((_0x511928[_0x2ac30f(0x802)]-ImageManager[_0x2ac30f(0x281)])/0x2),_0x24c5d6=_0x511928['y']+(_0x511928['height']-ImageManager[_0x2ac30f(0xfc)])/0x2;this[_0x2ac30f(0x170)](_0x363785,_0x30a711,_0x24c5d6);},Window_ActorCommand['prototype'][_0x2bbd55(0x5b4)]=function(_0x5f4317){const _0x5eb935=_0x2bbd55,_0xbb7834=this[_0x5eb935(0x220)](_0x5f4317);if(![_0x5eb935(0x453),'guard',_0x5eb935(0x804)]['includes'](_0xbb7834))return;const _0x56cd8d=this[_0x5eb935(0x64b)](_0x5f4317);let _0x4cf218=null;if(_0xbb7834===_0x5eb935(0x453))_0x4cf218=$dataSkills[this[_0x5eb935(0x5c2)][_0x5eb935(0x424)]()];else _0xbb7834===_0x5eb935(0x7ad)?_0x4cf218=$dataSkills[this[_0x5eb935(0x5c2)][_0x5eb935(0x382)]()]:_0x4cf218=$dataSkills[this[_0x5eb935(0x814)][_0x5f4317]['ext']];this[_0x5eb935(0x4f6)](this[_0x5eb935(0x5c2)],_0x4cf218,_0x56cd8d['x'],_0x56cd8d['y'],_0x56cd8d[_0x5eb935(0x802)]);},Window_ActorCommand['prototype'][_0x2bbd55(0x4f6)]=function(_0x239666,_0x2f1aef,_0x17bce4,_0x46f8c3,_0x562eff){const _0x46631c=_0x2bbd55;if(!_0x2f1aef)return;Imported['VisuMZ_1_SkillsStatesCore']?Window_Command['prototype'][_0x46631c(0x4f6)][_0x46631c(0x4f4)](this,_0x239666,_0x2f1aef,_0x17bce4,_0x46f8c3,_0x562eff):Window_SkillList['prototype'][_0x46631c(0x4f6)]['call'](this,_0x2f1aef,_0x17bce4,_0x46f8c3,_0x562eff);},Window_ActorCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x1d1)]=function(){},Window_ActorCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x459)]=function(){const _0x905c83=_0x2bbd55;Window_Command[_0x905c83(0x5d7)][_0x905c83(0x459)][_0x905c83(0x4f4)](this);const _0x57af58=this[_0x905c83(0x34a)]();_0x57af58==='border'&&this['showHelpWindow']();},Window_ActorCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x34a)]=function(){const _0x5352c1=_0x2bbd55;if(this[_0x5352c1(0x7f8)])return this[_0x5352c1(0x7f8)];return this[_0x5352c1(0x7f8)]=SceneManager['_scene'][_0x5352c1(0x34a)](),this['_battleLayoutStyle'];},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x1d5)]=Window_ActorCommand[_0x2bbd55(0x5d7)]['setup'],Window_ActorCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x76c)]=function(_0x2d014f){const _0x263638=_0x2bbd55,_0xc67668=this['battleLayoutStyle']();if(_0x2d014f&&['xp','portrait'][_0x263638(0x42f)](_0xc67668))this[_0x263638(0x7c2)](_0x2d014f);else _0x2d014f&&[_0x263638(0x6bb)][_0x263638(0x42f)](_0xc67668)&&(this[_0x263638(0x35b)](_0x2d014f),this[_0x263638(0x2f5)]());VisuMZ[_0x263638(0x46a)]['Window_ActorCommand_setup'][_0x263638(0x4f4)](this,_0x2d014f),_0x2d014f&&$gameTroop[_0x263638(0x1ee)]()[_0x263638(0x5cf)]>0x0&&_0x2d014f['battler']()&&_0x2d014f[_0x263638(0x6ae)]()['stepForward']();},Window_ActorCommand[_0x2bbd55(0x5d7)]['resizeWindowXPStyle']=function(_0x1b46c9){const _0x5c219e=_0x2bbd55,_0x57ef56=Math['round'](Graphics[_0x5c219e(0x269)]/0x3),_0x181e58=Math[_0x5c219e(0x86f)](Graphics[_0x5c219e(0x269)]/$gameParty[_0x5c219e(0x49d)]()[_0x5c219e(0x5cf)]),_0x4e02c7=Math[_0x5c219e(0x4fa)](_0x57ef56,_0x181e58),_0x4cfd58=this['fittingHeight'](VisuMZ['BattleCore'][_0x5c219e(0x55b)][_0x5c219e(0x1b0)][_0x5c219e(0x43d)]),_0x36fbf8=_0x181e58*_0x1b46c9['index']()+(_0x181e58-_0x4e02c7)/0x2,_0x37461e=SceneManager[_0x5c219e(0x750)][_0x5c219e(0x537)]['y']-_0x4cfd58;this['move'](_0x36fbf8,_0x37461e,_0x4e02c7,_0x4cfd58),this['createContents'](),this[_0x5c219e(0x65f)](0x1);},Window_ActorCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x35b)]=function(_0x4d9c93){const _0x31505e=_0x2bbd55,_0xb90e95=SceneManager[_0x31505e(0x750)][_0x31505e(0x4aa)]();this[_0x31505e(0x5a8)](_0xb90e95['x'],_0xb90e95['y'],_0xb90e95[_0x31505e(0x802)],_0xb90e95[_0x31505e(0x6c3)]),this[_0x31505e(0x650)](),this[_0x31505e(0x65f)](0x0);},Window_ActorCommand[_0x2bbd55(0x5d7)][_0x2bbd55(0x38c)]=function(){const _0x5de796=_0x2bbd55;if(this['_dimmerSprite']){const _0x45eed2=this[_0x5de796(0x33f)][_0x5de796(0x190)],_0x2fb834=this['width']-0x8,_0x267ae5=this['height'],_0x351a71=this[_0x5de796(0x7ac)],_0x2ca670=ColorManager[_0x5de796(0x616)](),_0x57477b=ColorManager[_0x5de796(0x6bd)]();this[_0x5de796(0x33f)]['x']=0x4,_0x45eed2[_0x5de796(0x853)](_0x2fb834,_0x267ae5),_0x45eed2[_0x5de796(0x6fb)](0x0,0x0,_0x2fb834,_0x351a71,_0x57477b,_0x2ca670,!![]),_0x45eed2[_0x5de796(0x695)](0x0,_0x351a71,_0x2fb834,_0x267ae5-_0x351a71*0x2,_0x2ca670),_0x45eed2['gradientFillRect'](0x0,_0x267ae5-_0x351a71,_0x2fb834,_0x351a71,_0x2ca670,_0x57477b,!![]),this[_0x5de796(0x33f)]['setFrame'](0x0,0x0,_0x2fb834,_0x267ae5);}},Window_ActorCommand['prototype'][_0x2bbd55(0x6f0)]=function(){const _0x509666=_0x2bbd55;if(!this[_0x509666(0x5c2)])return;const _0x38f28e=VisuMZ[_0x509666(0x46a)][_0x509666(0x55b)][_0x509666(0x230)],_0x5ac817=this[_0x509666(0x163)]();switch(_0x5ac817){case _0x509666(0x453):this['setHelpWindowItem']($dataSkills[this[_0x509666(0x5c2)]['attackSkillId']()]);break;case _0x509666(0x7ad):this[_0x509666(0x3dc)]($dataSkills[this[_0x509666(0x5c2)][_0x509666(0x382)]()]);break;case'skill':const _0x364fe6=_0x38f28e[_0x509666(0x7e8)],_0x5410a7=_0x364fe6[_0x509666(0x36b)]($dataSystem['skillTypes'][this[_0x509666(0x80d)]()]);this[_0x509666(0x46d)][_0x509666(0x4c1)](_0x5410a7);break;case _0x509666(0x804):this[_0x509666(0x3dc)]($dataSkills[this['currentExt']()]);break;case _0x509666(0x2d9):this['_helpWindow'][_0x509666(0x4c1)](_0x38f28e['HelpItem']);break;case _0x509666(0x78f):this['_helpWindow'][_0x509666(0x4c1)](_0x38f28e[_0x509666(0x637)]);break;case _0x509666(0x75a):this[_0x509666(0x46d)]['setText'](_0x38f28e['HelpAutoBattle']);break;default:this[_0x509666(0x46d)][_0x509666(0x4c1)]('');break;}},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x259)]=Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x447)],Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x447)]=function(_0x163122){const _0x42f02d=_0x2bbd55;VisuMZ[_0x42f02d(0x46a)][_0x42f02d(0x259)]['call'](this,_0x163122),this['initBattleCore']();},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x757)]=function(){const _0x33c351=_0x2bbd55;this[_0x33c351(0x68b)]=this[_0x33c351(0x68c)]();},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x34a)]=function(){const _0x3cb702=_0x2bbd55;if(this[_0x3cb702(0x7f8)])return this[_0x3cb702(0x7f8)];return this[_0x3cb702(0x7f8)]=SceneManager[_0x3cb702(0x750)][_0x3cb702(0x34a)](),this[_0x3cb702(0x7f8)];},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x68c)]=function(){const _0x34e156=_0x2bbd55,_0x4942b2=this['battleLayoutStyle']();switch(_0x4942b2){case'list':case _0x34e156(0x6bb):return!![];break;case _0x34e156(0x43b):case'xp':case'portrait':default:return![];break;}},Window_BattleStatus['prototype'][_0x2bbd55(0x6f1)]=function(){return this['isFrameVisible']()?0x0:0xa;},Window_BattleStatus['prototype'][_0x2bbd55(0x175)]=function(){const _0x206439=_0x2bbd55,_0x5f09db=this[_0x206439(0x34a)]();switch(_0x5f09db){case _0x206439(0x4fc):return 0x1;break;case'xp':case _0x206439(0x455):return $gameParty[_0x206439(0x49d)]()[_0x206439(0x5cf)];break;case _0x206439(0x43b):default:return $gameParty[_0x206439(0x13b)]();break;}},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x67a)]=function(){const _0x291cef=_0x2bbd55,_0x54a265=this[_0x291cef(0x34a)]();switch(_0x54a265){case _0x291cef(0x4fc):return Window_StatusBase[_0x291cef(0x5d7)][_0x291cef(0x67a)][_0x291cef(0x4f4)](this);break;case _0x291cef(0x43b):case'xp':case _0x291cef(0x455):default:return this[_0x291cef(0x3b9)];break;}},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x377)]=function(){const _0x3b5d85=_0x2bbd55,_0x4e6841=this[_0x3b5d85(0x34a)]();switch(_0x4e6841){case _0x3b5d85(0x4fc):return Window_StatusBase['prototype']['rowSpacing'][_0x3b5d85(0x4f4)](this);break;case _0x3b5d85(0x43b):case'xp':case _0x3b5d85(0x455):default:return 0x0;break;}},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x706)]=function(){const _0x3ab213=_0x2bbd55;this[_0x3ab213(0x68c)]()?Window_StatusBase[_0x3ab213(0x5d7)][_0x3ab213(0x706)][_0x3ab213(0x4f4)](this):this[_0x3ab213(0x7ac)]=0x8;},Window_BattleStatus[_0x2bbd55(0x5d7)]['requestRefresh']=function(){const _0xb370ae=_0x2bbd55;this[_0xb370ae(0x32a)]=!![];},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x12d)]=function(){const _0x4c3420=_0x2bbd55;Window_StatusBase[_0x4c3420(0x5d7)][_0x4c3420(0x12d)][_0x4c3420(0x4f4)](this),this[_0x4c3420(0x17f)](),this['updateEffectContainers']();if(this[_0x4c3420(0x34a)]()===_0x4c3420(0x6bb))this[_0x4c3420(0x693)]();},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x17f)]=function(){const _0x4f031c=_0x2bbd55;if($gameTemp[_0x4f031c(0x6f3)]())this[_0x4f031c(0x511)](),this[_0x4f031c(0x32a)]=![];else this[_0x4f031c(0x32a)]&&(this[_0x4f031c(0x32a)]=![],this['refresh']());},Window_BattleStatus['prototype'][_0x2bbd55(0x35c)]=function(){const _0x3d11e8=_0x2bbd55;Window_StatusBase['prototype'][_0x3d11e8(0x35c)][_0x3d11e8(0x4f4)](this);if(!$gameSystem['isSideView']())this[_0x3d11e8(0x3c3)]();},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x1d1)]=function(){const _0x2734cd=_0x2bbd55;if(this[_0x2734cd(0x409)]===Window_BattleStatus)return;Window_StatusBase[_0x2734cd(0x5d7)][_0x2734cd(0x1d1)][_0x2734cd(0x4f4)](this);},Window_BattleStatus[_0x2bbd55(0x5d7)]['drawBackgroundRect']=function(_0x341932){const _0x5ccdfc=_0x2bbd55,_0xc217a6=this[_0x5ccdfc(0x34a)]();switch(_0xc217a6){case'xp':case _0x5ccdfc(0x455):break;case _0x5ccdfc(0x43b):case _0x5ccdfc(0x4fc):case _0x5ccdfc(0x6bb):default:return Window_StatusBase[_0x5ccdfc(0x5d7)][_0x5ccdfc(0x20c)][_0x5ccdfc(0x4f4)](this,_0x341932);break;}},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x744)]=Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x295)],Window_BattleStatus[_0x2bbd55(0x5d7)]['drawItemImage']=function(_0x4ec55b){const _0x575ce9=_0x2bbd55,_0x149623=this['battleLayoutStyle']();switch(_0x149623){case _0x575ce9(0x4fc):this[_0x575ce9(0x31b)](_0x4ec55b);break;case'xp':this[_0x575ce9(0x2ac)](_0x4ec55b);break;case _0x575ce9(0x455):this[_0x575ce9(0x3a3)](_0x4ec55b);break;case'default':case _0x575ce9(0x6bb):default:VisuMZ['BattleCore']['Window_BattleStatus_drawItemImage'][_0x575ce9(0x4f4)](this,_0x4ec55b);break;}},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x130)]=function(_0x42ba2e){const _0x274784=_0x2bbd55,_0x19d6d9=this['battleLayoutStyle']();if(!$gameSystem[_0x274784(0x2e6)]())this[_0x274784(0x42e)](_0x42ba2e);switch(_0x19d6d9){case _0x274784(0x4fc):this['drawItemStatusListStyle'](_0x42ba2e);break;case'xp':case'portrait':case _0x274784(0x43b):case _0x274784(0x6bb):default:this['drawItemStatusXPStyle'](_0x42ba2e);break;}},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x143)]=function(){const _0x1cbe82=_0x2bbd55,_0x2e6cbd=this[_0x1cbe82(0x34a)]();if(['xp']['includes'](_0x2e6cbd)&&!$gameSystem[_0x1cbe82(0x2e6)]()){this[_0x1cbe82(0x547)](0x0,0x0,0x0,0x0);return;}Window_StatusBase[_0x1cbe82(0x5d7)][_0x1cbe82(0x143)][_0x1cbe82(0x4f4)](this);},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x42e)]=function(_0x4a7a6d){const _0x59fe59=_0x2bbd55,_0xa47c8f=this['actor'](_0x4a7a6d)['battler']();if(!_0xa47c8f)return;const _0x543db5=this[_0x59fe59(0x34a)](),_0x3de8ed=this['itemRect'](_0x4a7a6d);let _0x43b41a=Math['round'](_0x3de8ed['x']+_0x3de8ed[_0x59fe59(0x802)]/0x2);[_0x59fe59(0x4fc)][_0x59fe59(0x42f)](_0x543db5)&&(_0x43b41a=_0x3de8ed[_0x59fe59(0x802)]/$gameParty['battleMembers']()[_0x59fe59(0x5cf)],_0x43b41a*=_0x4a7a6d,_0x43b41a+=_0x3de8ed[_0x59fe59(0x802)]/$gameParty[_0x59fe59(0x49d)]()[_0x59fe59(0x5cf)]/0x2);let _0x31162a=Math[_0x59fe59(0x86f)](this[_0x59fe59(0x2d8)](_0x4a7a6d,_0xa47c8f,_0x3de8ed));_0xa47c8f[_0x59fe59(0x873)](_0x43b41a,_0x31162a),this[_0x59fe59(0x7ed)](_0xa47c8f,0x1),_0xa47c8f[_0x59fe59(0x35c)]();},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x2d8)]=function(_0x1cdf05,_0x51bbc6,_0x337871){const _0x5acd5f=_0x2bbd55,_0x371604=VisuMZ[_0x5acd5f(0x46a)][_0x5acd5f(0x55b)][_0x5acd5f(0x1b0)],_0x37d56c=this['battleLayoutStyle']();if(_0x37d56c==='xp'){const _0x2a11aa=_0x371604['XPSpriteYLocation'];switch(_0x2a11aa[_0x5acd5f(0x38e)]()['trim']()){case _0x5acd5f(0x154):return _0x337871[_0x5acd5f(0x6c3)]-_0x51bbc6[_0x5acd5f(0x2f0)][_0x5acd5f(0x6c3)]/0x4;break;case'center':const _0x3e3c59=_0x371604[_0x5acd5f(0x866)];return(_0x337871[_0x5acd5f(0x6c3)]+(_0x51bbc6[_0x5acd5f(0x6c3)]||_0x3e3c59))/0x2;break;case _0x5acd5f(0x5f1):return 0x0;case _0x5acd5f(0x485):default:return this['nameY'](_0x337871);break;}}else{if(_0x37d56c===_0x5acd5f(0x455)){}}return _0x51bbc6[_0x5acd5f(0x6c3)];},Window_BattleStatus['prototype'][_0x2bbd55(0x31b)]=function(_0x46a9a5){const _0xa557e4=_0x2bbd55;if(!VisuMZ[_0xa557e4(0x46a)][_0xa557e4(0x55b)][_0xa557e4(0x1b0)]['ShowFacesListStyle'])return;const _0x1124ab=this['actor'](_0x46a9a5),_0x445521=this[_0xa557e4(0x7c5)](_0x46a9a5);_0x445521[_0xa557e4(0x802)]=ImageManager[_0xa557e4(0x22e)],_0x445521['height']-=0x2,this['drawActorFace'](_0x1124ab,_0x445521['x']+0x1,_0x445521['y']+0x1,_0x445521[_0xa557e4(0x802)],_0x445521['height']);},Window_BattleStatus['prototype']['drawItemStatusListStyle']=function(_0x4fb01f){const _0x4574d6=_0x2bbd55,_0x1bd1fa=$dataSystem['optDisplayTp']?0x4:0x3,_0x4df617=_0x1bd1fa*0x80+(_0x1bd1fa-0x1)*0x8+0x4,_0x513779=this['actor'](_0x4fb01f),_0x307195=this[_0x4574d6(0x7c5)](_0x4fb01f);let _0x453a53=_0x307195['x']+this[_0x4574d6(0x7ac)];VisuMZ[_0x4574d6(0x46a)]['Settings'][_0x4574d6(0x1b0)][_0x4574d6(0x104)]?_0x453a53=_0x307195['x']+ImageManager[_0x4574d6(0x22e)]+0x8:_0x453a53+=ImageManager['iconWidth'];const _0x5c9519=Math[_0x4574d6(0x86f)](Math[_0x4574d6(0x4fa)](_0x307195['x']+_0x307195[_0x4574d6(0x802)]-_0x4df617,_0x453a53)),_0x42fcda=Math[_0x4574d6(0x86f)](_0x307195['y']+(_0x307195['height']-Sprite_Name['prototype'][_0x4574d6(0x577)]())/0x2),_0x52209e=Math[_0x4574d6(0x86f)](_0x5c9519-ImageManager[_0x4574d6(0x281)]/0x2-0x4),_0x57c5b8=Math['round'](_0x307195['y']+(_0x307195['height']-ImageManager[_0x4574d6(0xfc)])/0x2+ImageManager[_0x4574d6(0xfc)]/0x2);let _0x5b502a=_0x5c9519+0x88;const _0x4b96bd=_0x42fcda;this[_0x4574d6(0x5c8)](_0x513779,_0x5c9519-0x4,_0x42fcda),this[_0x4574d6(0x664)](_0x513779,_0x5c9519,_0x42fcda),this[_0x4574d6(0x168)](_0x513779,_0x52209e,_0x57c5b8),this[_0x4574d6(0x262)](_0x513779,'hp',_0x5b502a+0x88*0x0,_0x4b96bd),this[_0x4574d6(0x262)](_0x513779,'mp',_0x5b502a+0x88*0x1,_0x4b96bd),$dataSystem[_0x4574d6(0x3cd)]&&this[_0x4574d6(0x262)](_0x513779,'tp',_0x5b502a+0x88*0x2,_0x4b96bd);},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x2ac)]=function(_0x23684f){const _0x46c7db=_0x2bbd55;if(!$gameSystem[_0x46c7db(0x2e6)]())return;VisuMZ['BattleCore'][_0x46c7db(0x744)][_0x46c7db(0x4f4)](this,_0x23684f);},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x117)]=function(_0x30f1d1){const _0x17e4d3=_0x2bbd55,_0xbf1df4=this[_0x17e4d3(0x148)](_0x30f1d1),_0x5520fd=this[_0x17e4d3(0x7c5)](_0x30f1d1),_0x4c0a56=Math['round'](_0x5520fd['x']+(_0x5520fd[_0x17e4d3(0x802)]-0x80)/0x2),_0xb861bb=this[_0x17e4d3(0x376)](_0x5520fd);let _0x14023e=_0x4c0a56-ImageManager[_0x17e4d3(0x281)]/0x2-0x4,_0x345104=_0xb861bb+ImageManager[_0x17e4d3(0xfc)]/0x2;_0x14023e-ImageManager[_0x17e4d3(0x281)]/0x2<_0x5520fd['x']&&(_0x14023e=_0x4c0a56+ImageManager[_0x17e4d3(0x281)]/0x2-0x4,_0x345104=_0xb861bb-ImageManager[_0x17e4d3(0xfc)]/0x2);const _0x3bc901=_0x4c0a56,_0x26adc7=this[_0x17e4d3(0x1b8)](_0x5520fd);this[_0x17e4d3(0x5c8)](_0xbf1df4,_0x4c0a56,_0xb861bb),this[_0x17e4d3(0x664)](_0xbf1df4,_0x4c0a56,_0xb861bb),this[_0x17e4d3(0x168)](_0xbf1df4,_0x14023e,_0x345104),this[_0x17e4d3(0x6d5)](_0xbf1df4,_0x3bc901,_0x26adc7);},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x2ce)]=function(_0x18a728){const _0x554d00=_0x2bbd55;if(!VisuMZ[_0x554d00(0x46a)][_0x554d00(0x55b)]['BattleLayout'][_0x554d00(0x317)])return![];if(_0x18a728['getBattlePortrait']())return!![];return Imported['VisuMZ_1_MainMenuCore']&&_0x18a728[_0x554d00(0x17d)]();},Game_Actor['prototype'][_0x2bbd55(0x231)]=function(){const _0x476f11=_0x2bbd55;if(this[_0x476f11(0x148)]()[_0x476f11(0x11b)][_0x476f11(0x87d)](/<BATTLE (?:IMAGE|PORTRAIT) OFFSET X:[ ]([\+\-]\d+)>/i))return Number(RegExp['$1']);else{if(this[_0x476f11(0x148)]()[_0x476f11(0x11b)][_0x476f11(0x87d)](/<BATTLE (?:IMAGE|PORTRAIT) OFFSET:[ ]([\+\-]\d+),[ ]([\+\-]\d+)>/i))return Number(RegExp['$1']);}return 0x0;},Game_Actor[_0x2bbd55(0x5d7)][_0x2bbd55(0x842)]=function(){const _0x47bc66=_0x2bbd55;if(this[_0x47bc66(0x148)]()[_0x47bc66(0x11b)][_0x47bc66(0x87d)](/<BATTLE (?:IMAGE|PORTRAIT) OFFSET Y:[ ]([\+\-]\d+)>/i))return Number(RegExp['$1']);else{if(this[_0x47bc66(0x148)]()[_0x47bc66(0x11b)][_0x47bc66(0x87d)](/<BATTLE (?:IMAGE|PORTRAIT) OFFSET:[ ]([\+\-]\d+),[ ]([\+\-]\d+)>/i))return Number(RegExp['$2']);}return 0x0;},Window_BattleStatus[_0x2bbd55(0x5d7)]['drawItemImagePortraitStyle']=function(_0x32f7c9){const _0x4a16f5=_0x2bbd55,_0x16ef8b=this[_0x4a16f5(0x148)](_0x32f7c9);if(this[_0x4a16f5(0x2ce)](_0x16ef8b)){const _0x35c937='actor%1-portrait'[_0x4a16f5(0x36b)](_0x16ef8b[_0x4a16f5(0x3e3)]()),_0x5bf03a=this['createInnerPortrait'](_0x35c937,Sprite),_0x542ea6=_0x16ef8b[_0x4a16f5(0x70c)]();_0x542ea6!==''?_0x5bf03a[_0x4a16f5(0x190)]=ImageManager[_0x4a16f5(0x1c9)](_0x542ea6):_0x5bf03a[_0x4a16f5(0x190)]=ImageManager['_emptyBitmap'];const _0x25e9b2=this[_0x4a16f5(0x7c5)](_0x32f7c9);_0x5bf03a[_0x4a16f5(0x5e5)]['x']=0.5,_0x5bf03a[_0x4a16f5(0x5e5)]['y']=0x1;let _0xc3d4b9=Math[_0x4a16f5(0x86f)](_0x25e9b2['x']+_0x25e9b2['width']/0x2)+this[_0x4a16f5(0x7ac)];_0xc3d4b9+=_0x16ef8b[_0x4a16f5(0x231)]();let _0x37aa13=Math[_0x4a16f5(0x86f)](this['height']);_0x37aa13+=_0x16ef8b[_0x4a16f5(0x842)](),_0x5bf03a[_0x4a16f5(0x5a8)](_0xc3d4b9,_0x37aa13);const _0x4540b9=VisuMZ[_0x4a16f5(0x46a)][_0x4a16f5(0x55b)][_0x4a16f5(0x1b0)][_0x4a16f5(0x52f)];_0x5bf03a[_0x4a16f5(0x1ae)]['x']=_0x4540b9,_0x5bf03a[_0x4a16f5(0x1ae)]['y']=_0x4540b9,_0x5bf03a[_0x4a16f5(0x35c)]();}else{const _0x10e8f5=this[_0x4a16f5(0x747)](_0x32f7c9);this[_0x4a16f5(0x2b2)](_0x16ef8b,_0x10e8f5['x'],_0x10e8f5['y'],_0x10e8f5[_0x4a16f5(0x802)],_0x10e8f5['height']);}},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x40d)]=function(_0x14d830,_0x5568d2){const _0x1299da=_0x2bbd55,_0x13ae12=this[_0x1299da(0x417)];if(_0x13ae12[_0x14d830])return _0x13ae12[_0x14d830];else{const _0x1686ce=new _0x5568d2();return _0x13ae12[_0x14d830]=_0x1686ce,this[_0x1299da(0x7d5)](_0x1686ce),this[_0x1299da(0x7d5)](this[_0x1299da(0x4a4)]),_0x1686ce;}},Window_BattleStatus[_0x2bbd55(0x5d7)]['_createClientArea']=function(){const _0x4fad68=_0x2bbd55;this[_0x4fad68(0x607)](),this[_0x4fad68(0x6c8)](),Window_StatusBase[_0x4fad68(0x5d7)]['_createClientArea']['call'](this),this[_0x4fad68(0x120)]();},Window_BattleStatus['prototype'][_0x2bbd55(0x607)]=function(){const _0x2a252a=_0x2bbd55;this['_cursorArea']=new Sprite(),this['_cursorArea'][_0x2a252a(0x7b3)]=[new PIXI['filters']['AlphaFilter']()],this[_0x2a252a(0x4a4)][_0x2a252a(0x5eb)]=new Rectangle(),this[_0x2a252a(0x4a4)][_0x2a252a(0x5a8)](this[_0x2a252a(0x350)],this[_0x2a252a(0x350)]),this[_0x2a252a(0x3e4)](this['_cursorArea']);},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x6c8)]=function(){const _0x5ba6eb=_0x2bbd55;this[_0x5ba6eb(0x1d3)]=new Sprite(),this[_0x5ba6eb(0x3e4)](this[_0x5ba6eb(0x1d3)]);},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x120)]=function(){const _0x128fb6=_0x2bbd55;this['_damageContainer']=new Sprite(),this[_0x128fb6(0x3e4)](this[_0x128fb6(0x57a)]);},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x336)]=function(){const _0x27c37d=_0x2bbd55;this[_0x27c37d(0x12e)]=new Sprite();for(let _0x27f543=0x0;_0x27f543<0x9;_0x27f543++){this['_cursorSprite'][_0x27c37d(0x3e4)](new Sprite());}this[_0x27c37d(0x4a4)]['addChild'](this[_0x27c37d(0x12e)]);},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x66e)]=function(){const _0x28b940=_0x2bbd55;Window_StatusBase[_0x28b940(0x5d7)][_0x28b940(0x66e)]['call'](this),this[_0x28b940(0x389)]();},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x389)]=function(){const _0x4795cb=_0x2bbd55,_0x1f4745=this[_0x4795cb(0x350)];this['_cursorArea'][_0x4795cb(0x5a8)](_0x1f4745,_0x1f4745),this['_cursorArea']['x']=_0x1f4745-this[_0x4795cb(0x3c9)]['x'],this[_0x4795cb(0x4a4)]['y']=_0x1f4745-this[_0x4795cb(0x3c9)]['y'],this[_0x4795cb(0x29f)]>0x0&&this['innerHeight']>0x0?this[_0x4795cb(0x4a4)][_0x4795cb(0x4fd)]=this['isOpen']():this[_0x4795cb(0x4a4)]['visible']=![];},Window_BattleStatus['prototype'][_0x2bbd55(0x1c5)]=function(){const _0x33e651=_0x2bbd55;Window_StatusBase[_0x33e651(0x5d7)]['_updateFilterArea'][_0x33e651(0x4f4)](this),this[_0x33e651(0x6d9)]();},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x6d9)]=function(){const _0x1c9966=_0x2bbd55,_0x5dd8c0=this[_0x1c9966(0x4a4)][_0x1c9966(0x3f2)][_0x1c9966(0x663)](new Point(0x0,0x0)),_0x580a14=this[_0x1c9966(0x4a4)][_0x1c9966(0x5eb)];_0x580a14['x']=_0x5dd8c0['x']+this[_0x1c9966(0x3c9)]['x'],_0x580a14['y']=_0x5dd8c0['y']+this[_0x1c9966(0x3c9)]['y'],_0x580a14['width']=this['innerWidth'],_0x580a14[_0x1c9966(0x6c3)]=this[_0x1c9966(0x3b9)];},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x442)]=function(_0x552a4e){const _0x517bba=_0x2bbd55;if(this[_0x517bba(0x34a)]()!==_0x517bba(0x455))return;this[_0x517bba(0x3a3)](_0x552a4e[_0x517bba(0x513)]());},Window_BattleStatus['prototype'][_0x2bbd55(0x481)]=function(_0x3e5580,_0x47eb52){const _0x107a51=_0x2bbd55;if(!this[_0x107a51(0x57a)])return;if(!_0x3e5580)return;if(!_0x47eb52)return;const _0x252484=this[_0x107a51(0x7c5)](_0x47eb52[_0x107a51(0x513)]());_0x252484['x']+=_0x252484['width']/0x2+this[_0x107a51(0x7ac)],_0x3e5580['x']=_0x252484['x'],_0x3e5580['y']=_0x252484['y'],this[_0x107a51(0x57a)]['addChild'](_0x3e5580);},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x73a)]=function(_0x3773b8){const _0x5c6116=_0x2bbd55;if(!this[_0x5c6116(0x57a)])return;if(!_0x3773b8)return;this[_0x5c6116(0x57a)][_0x5c6116(0x565)](_0x3773b8);},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x693)]=function(){const _0x373ef9=_0x2bbd55;if(!this[_0x373ef9(0x591)]())return;if(!this[_0x373ef9(0x755)])this[_0x373ef9(0x186)]();this[_0x373ef9(0x47d)](),this['updateBorderSprite']();},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x591)]=function(){const _0x407a8c=_0x2bbd55;if(this[_0x407a8c(0x409)]!==Window_BattleStatus)return![];if(!SceneManager[_0x407a8c(0xfb)]())return![];return VisuMZ['BattleCore']['Settings'][_0x407a8c(0x1b0)][_0x407a8c(0x444)];},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x186)]=function(){const _0x4089a0=_0x2bbd55;this['_borderPortraitSprite']=new Sprite();const _0x7d0032=SceneManager['_scene'],_0x196869=_0x7d0032[_0x4089a0(0x189)][_0x4089a0(0x280)](_0x7d0032[_0x4089a0(0x473)]);_0x7d0032[_0x4089a0(0x7ed)](this[_0x4089a0(0x755)],_0x196869),this[_0x4089a0(0x755)][_0x4089a0(0x5e5)]['x']=0.5,this['_borderPortraitSprite'][_0x4089a0(0x5e5)]['y']=0x1;const _0x4bf102=VisuMZ['BattleCore'][_0x4089a0(0x55b)][_0x4089a0(0x1b0)][_0x4089a0(0x374)];this[_0x4089a0(0x755)][_0x4089a0(0x1ae)]['x']=_0x4bf102,this[_0x4089a0(0x755)][_0x4089a0(0x1ae)]['y']=_0x4bf102,this[_0x4089a0(0x755)]['y']=this['y']+this['height'],this['_borderPortraitDuration']=0x0;},Window_BattleStatus[_0x2bbd55(0x5d7)]['prepareBorderActor']=function(){const _0x240c21=_0x2bbd55;this['_borderPortraitSprite'][_0x240c21(0x4fd)]=BattleManager[_0x240c21(0x788)]();const _0x358484=BattleManager[_0x240c21(0x148)]();if(_0x358484===this[_0x240c21(0x755)][_0x240c21(0x148)])return;this['_borderPortraitSprite'][_0x240c21(0x148)]=_0x358484||this[_0x240c21(0x755)][_0x240c21(0x148)];if(!_0x358484)return;else{if(_0x358484['getBattlePortraitFilename']()===''){this[_0x240c21(0x755)][_0x240c21(0x190)]=ImageManager[_0x240c21(0x5ae)];return;}else{const _0x2851c0=ImageManager['loadPicture'](_0x358484['getBattlePortraitFilename']());_0x2851c0[_0x240c21(0x2c2)](this[_0x240c21(0x10c)][_0x240c21(0x5e6)](this,_0x2851c0));}}},Window_BattleStatus[_0x2bbd55(0x5d7)]['processBorderActor']=function(_0x34bc3d){const _0x57815f=_0x2bbd55;this[_0x57815f(0x69e)]=0x14,this[_0x57815f(0x755)]['bitmap']=_0x34bc3d;SceneManager[_0x57815f(0x750)][_0x57815f(0x7cc)]()?(this[_0x57815f(0x755)]['x']=0x0,this['_borderPortraitTargetX']=Math['ceil'](_0x34bc3d[_0x57815f(0x802)]/0x2)):(this[_0x57815f(0x755)]['x']=this[_0x57815f(0x802)],this[_0x57815f(0x3b6)]=this[_0x57815f(0x802)]*0x3/0x4);this[_0x57815f(0x755)][_0x57815f(0x694)]=0x0,this['_borderPortraitSprite']['y']=this['y']+this[_0x57815f(0x6c3)];const _0x34dfe5=BattleManager[_0x57815f(0x148)]();_0x34dfe5&&(this[_0x57815f(0x3b6)]+=_0x34dfe5['getBattlePortraitOffsetX'](),this['_borderPortraitSprite']['y']+=_0x34dfe5[_0x57815f(0x842)]());},Window_BattleStatus[_0x2bbd55(0x5d7)][_0x2bbd55(0x870)]=function(){const _0x2df13c=_0x2bbd55;if(this[_0x2df13c(0x69e)]>0x0){const _0x2d0030=this['_borderPortraitDuration'],_0x44dfd7=this['_borderPortraitSprite'];_0x44dfd7['x']=(_0x44dfd7['x']*(_0x2d0030-0x1)+this['_borderPortraitTargetX'])/_0x2d0030,_0x44dfd7[_0x2df13c(0x694)]=(_0x44dfd7[_0x2df13c(0x694)]*(_0x2d0030-0x1)+0xff)/_0x2d0030,this[_0x2df13c(0x69e)]--;}},Window_BattleStatus[_0x2bbd55(0x5d7)]['updateEffectContainers']=function(){const _0x378a4a=_0x2bbd55;return;this['_effectsContainer']&&(this[_0x378a4a(0x1d3)]['x']=this['x'],this[_0x378a4a(0x1d3)]['y']=this['y']),this[_0x378a4a(0x57a)]&&(this[_0x378a4a(0x57a)]['x']=this['x'],this[_0x378a4a(0x57a)]['y']=this['y']);},Window_BattleActor[_0x2bbd55(0x5d7)][_0x2bbd55(0x19e)]=function(){const _0x28191a=_0x2bbd55;return Window_BattleStatus[_0x28191a(0x5d7)][_0x28191a(0x19e)]['call'](this)&&this['isActionSelectionValid']();},Window_BattleActor[_0x2bbd55(0x5d7)]['isActionSelectionValid']=function(){const _0x119ce8=_0x2bbd55,_0x3d4029=BattleManager[_0x119ce8(0x237)](),_0x5eb41d=this['actor'](this[_0x119ce8(0x513)]());if(!_0x3d4029)return!![];if(!_0x3d4029['item']())return!![];const _0x480b7b=_0x3d4029[_0x119ce8(0x2d9)]()[_0x119ce8(0x11b)];if(_0x480b7b[_0x119ce8(0x87d)](/<CANNOT TARGET (?:USER|SELF)>/i)){if(_0x5eb41d===BattleManager[_0x119ce8(0x148)]())return![];}return!![];},VisuMZ[_0x2bbd55(0x46a)]['Window_BattleEnemy_initialize']=Window_BattleEnemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x447)],Window_BattleEnemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x447)]=function(_0x15a49d){const _0x2950eb=_0x2bbd55;this['_lastEnemy']=null,VisuMZ[_0x2950eb(0x46a)][_0x2950eb(0x1be)][_0x2950eb(0x4f4)](this,_0x15a49d);},Window_BattleEnemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x175)]=function(){const _0x57ec87=_0x2bbd55;return this[_0x57ec87(0x5b0)]();},VisuMZ[_0x2bbd55(0x46a)]['Window_BattleEnemy_show']=Window_BattleEnemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x35c)],Window_BattleEnemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x35c)]=function(){const _0x17fa00=_0x2bbd55;VisuMZ['BattleCore']['Window_BattleEnemy_show'][_0x17fa00(0x4f4)](this),this['y']=Graphics[_0x17fa00(0x6c3)]*0xa;},Window_BattleEnemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x48f)]=function(){const _0x31c901=_0x2bbd55;return $gameTroop[_0x31c901(0x1ee)]()[_0x31c901(0x3d2)](0x0);},Window_BattleEnemy[_0x2bbd55(0x5d7)]['refresh']=function(){const _0x26bf2b=_0x2bbd55;this[_0x26bf2b(0x172)]=this['validTargets'](),this['sortEnemies'](),Window_Selectable['prototype'][_0x26bf2b(0x3c3)]['call'](this);},Window_BattleEnemy[_0x2bbd55(0x5d7)]['sortEnemies']=function(){const _0x55f806=_0x2bbd55;this[_0x55f806(0x172)][_0x55f806(0x1d6)]((_0x5968c6,_0x329903)=>{const _0x49d09b=_0x55f806;return _0x5968c6[_0x49d09b(0x6ae)]()[_0x49d09b(0x34b)]===_0x329903[_0x49d09b(0x6ae)]()[_0x49d09b(0x34b)]?_0x5968c6[_0x49d09b(0x6ae)]()['_baseY']-_0x329903[_0x49d09b(0x6ae)]()[_0x49d09b(0x71a)]:_0x5968c6[_0x49d09b(0x6ae)]()[_0x49d09b(0x34b)]-_0x329903[_0x49d09b(0x6ae)]()[_0x49d09b(0x34b)];}),SceneManager[_0x55f806(0x2fd)]()&&this[_0x55f806(0x172)][_0x55f806(0x613)]();},Window_BattleEnemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x24d)]=function(){const _0x42d648=_0x2bbd55,_0x56b661=VisuMZ[_0x42d648(0x46a)]['Settings'][_0x42d648(0x37f)];_0x56b661[_0x42d648(0x751)]?this[_0x42d648(0x195)]():this[_0x42d648(0x54d)]();},Window_BattleEnemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x195)]=function(){const _0xe39889=_0x2bbd55;if(this[_0xe39889(0x7e7)]&&this[_0xe39889(0x172)][_0xe39889(0x42f)](this['_lastEnemy'])){const _0x3b3dd7=this[_0xe39889(0x172)][_0xe39889(0x280)](this['_lastEnemy']);this[_0xe39889(0x7f6)](_0x3b3dd7);}else this['autoSelectPriority']();},Window_BattleEnemy[_0x2bbd55(0x5d7)][_0x2bbd55(0x54d)]=function(){const _0x53a855=_0x2bbd55,_0x155df7=VisuMZ[_0x53a855(0x46a)][_0x53a855(0x55b)][_0x53a855(0x37f)];let _0x344283=![];$gameSystem['isSideView']()?_0x344283=_0x155df7['SideviewSelect']:_0x344283=_0x155df7['FrontViewSelect'],this[_0x53a855(0x7f6)](_0x344283?this['maxItems']()-0x1:0x0);},Window_BattleEnemy['prototype']['callOkHandler']=function(){const _0x291890=_0x2bbd55;Window_Selectable[_0x291890(0x5d7)][_0x291890(0x452)]['call'](this),this[_0x291890(0x7e7)]=this[_0x291890(0x64d)]();},Window_BattleItem[_0x2bbd55(0x5d7)][_0x2bbd55(0x42f)]=function(_0x1bbbb0){const _0x19a2eb=_0x2bbd55;if(!_0x1bbbb0)return![];return _0x1bbbb0[_0x19a2eb(0x2a2)]===0x0||_0x1bbbb0[_0x19a2eb(0x2a2)]===0x1;};function Window_AutoBattleCancel(){this['initialize'](...arguments);}Window_AutoBattleCancel[_0x2bbd55(0x5d7)]=Object[_0x2bbd55(0x60a)](Window_Base['prototype']),Window_AutoBattleCancel[_0x2bbd55(0x5d7)][_0x2bbd55(0x409)]=Window_AutoBattleCancel,Window_AutoBattleCancel[_0x2bbd55(0x5d7)]['initialize']=function(_0x4b0cd1){const _0x5a382f=_0x2bbd55;Window_Base['prototype'][_0x5a382f(0x447)]['call'](this,_0x4b0cd1),this[_0x5a382f(0x65f)](this[_0x5a382f(0x3bc)]()),this[_0x5a382f(0x3c3)]();},Window_AutoBattleCancel[_0x2bbd55(0x5d7)][_0x2bbd55(0x3bc)]=function(){const _0x341842=_0x2bbd55;return VisuMZ[_0x341842(0x46a)][_0x341842(0x55b)][_0x341842(0x3d1)][_0x341842(0x1e1)];},Window_AutoBattleCancel[_0x2bbd55(0x5d7)]['refresh']=function(){const _0x3dc875=_0x2bbd55;this[_0x3dc875(0x398)][_0x3dc875(0x277)]();const _0xeae14a=VisuMZ['BattleCore'][_0x3dc875(0x55b)]['AutoBattle'][_0x3dc875(0x2c5)],_0x25b9c8=_0xeae14a[_0x3dc875(0x36b)](this['okButtonText'](),this[_0x3dc875(0x2ec)]()),_0xa37b9e=this['textSizeEx'](_0x25b9c8)[_0x3dc875(0x802)],_0x244b81=Math[_0x3dc875(0x2c6)]((this['innerWidth']-_0xa37b9e)/0x2);this['drawTextEx'](_0x25b9c8,_0x244b81,0x0,_0xa37b9e);},Window_AutoBattleCancel[_0x2bbd55(0x5d7)][_0x2bbd55(0x335)]=function(){const _0x347c41=_0x2bbd55;return Imported[_0x347c41(0x7c3)]?TextManager[_0x347c41(0x245)]('ok'):VisuMZ[_0x347c41(0x46a)][_0x347c41(0x55b)][_0x347c41(0x3d1)][_0x347c41(0x4a5)];},Window_AutoBattleCancel[_0x2bbd55(0x5d7)][_0x2bbd55(0x2ec)]=function(){const _0x12b977=_0x2bbd55;return Imported[_0x12b977(0x7c3)]?TextManager[_0x12b977(0x245)](_0x12b977(0x16e)):VisuMZ[_0x12b977(0x46a)]['Settings'][_0x12b977(0x3d1)][_0x12b977(0x753)];},Window_AutoBattleCancel[_0x2bbd55(0x5d7)][_0x2bbd55(0x12d)]=function(){const _0x92317b=_0x2bbd55;Window_Base['prototype'][_0x92317b(0x12d)][_0x92317b(0x4f4)](this),this['updateVisibility'](),this[_0x92317b(0x71d)]();},Window_AutoBattleCancel[_0x2bbd55(0x5d7)][_0x2bbd55(0x5b8)]=function(){const _0x33dee0=_0x2bbd55;this[_0x33dee0(0x4fd)]=BattleManager[_0x33dee0(0x77e)];},Window_AutoBattleCancel['prototype'][_0x2bbd55(0x71d)]=function(){const _0x41e9b8=_0x2bbd55;if(!BattleManager['_autoBattle'])return;(Input[_0x41e9b8(0x361)]('ok')||Input['isTriggered']('cancel')||TouchInput[_0x41e9b8(0x741)]()||TouchInput[_0x41e9b8(0x596)]())&&(SoundManager[_0x41e9b8(0x768)](),BattleManager[_0x41e9b8(0x77e)]=![],Input[_0x41e9b8(0x277)](),TouchInput[_0x41e9b8(0x277)]());};function Window_EnemyName(){const _0x211485=_0x2bbd55;this[_0x211485(0x447)](...arguments);}Window_EnemyName[_0x2bbd55(0x5d7)]=Object['create'](Window_Base['prototype']),Window_EnemyName[_0x2bbd55(0x5d7)][_0x2bbd55(0x409)]=Window_EnemyName,Window_EnemyName[_0x2bbd55(0x5d7)]['initialize']=function(_0x1e6ddb){const _0x3f7ee0=_0x2bbd55;this[_0x3f7ee0(0x69b)]=_0x1e6ddb,this['_text']='';const _0x59918c=new Rectangle(0x0,0x0,Graphics[_0x3f7ee0(0x269)],this[_0x3f7ee0(0x1a2)]()*0x4);Window_Base[_0x3f7ee0(0x5d7)][_0x3f7ee0(0x447)][_0x3f7ee0(0x4f4)](this,_0x59918c),this[_0x3f7ee0(0x65f)](0x2),this[_0x3f7ee0(0x56d)]=0x0;},Window_EnemyName[_0x2bbd55(0x5d7)][_0x2bbd55(0x706)]=function(){const _0x25d569=_0x2bbd55;this[_0x25d569(0x7ac)]=0x0;},Window_EnemyName[_0x2bbd55(0x5d7)][_0x2bbd55(0x64d)]=function(){const _0xf4f5a0=_0x2bbd55;return $gameTroop[_0xf4f5a0(0x158)]()[this[_0xf4f5a0(0x69b)]];},Window_EnemyName[_0x2bbd55(0x5d7)][_0x2bbd55(0x12d)]=function(){const _0x96c1cf=_0x2bbd55;Window_Base[_0x96c1cf(0x5d7)][_0x96c1cf(0x12d)]['call'](this);if(this['enemy']()&&this[_0x96c1cf(0x64d)]()[_0x96c1cf(0x485)]()!==this[_0x96c1cf(0x7eb)])this[_0x96c1cf(0x3c3)]();this['updateOpacity'](),this[_0x96c1cf(0x73c)]();},Window_EnemyName[_0x2bbd55(0x5d7)][_0x2bbd55(0x42b)]=function(){const _0x2f4dec=_0x2bbd55;if(!this['enemy']()){if(this[_0x2f4dec(0x56d)]>0x0)this[_0x2f4dec(0x56d)]-=0x10;}else{if(this['enemy']()['isDead']()){if(this['contentsOpacity']>0x0)this[_0x2f4dec(0x56d)]-=0x10;}else{if(SceneManager[_0x2f4dec(0x750)][_0x2f4dec(0x822)]&&SceneManager['_scene'][_0x2f4dec(0x822)][_0x2f4dec(0x268)]&&SceneManager[_0x2f4dec(0x750)][_0x2f4dec(0x822)][_0x2f4dec(0x172)][_0x2f4dec(0x42f)](this[_0x2f4dec(0x64d)]())){if(this[_0x2f4dec(0x56d)]<0xff)this[_0x2f4dec(0x56d)]+=0x10;}else this[_0x2f4dec(0x56d)]>0x0&&(this[_0x2f4dec(0x56d)]-=0x10);}}},Window_EnemyName[_0x2bbd55(0x5d7)][_0x2bbd55(0x73c)]=function(){const _0x175bd3=_0x2bbd55;if(!this[_0x175bd3(0x64d)]())return;SceneManager[_0x175bd3(0x2fd)]()?this['x']=Graphics[_0x175bd3(0x269)]-this[_0x175bd3(0x64d)]()[_0x175bd3(0x6ae)]()[_0x175bd3(0x34b)]:this['x']=this['enemy']()[_0x175bd3(0x6ae)]()[_0x175bd3(0x34b)];this['x']-=Math['round'](this[_0x175bd3(0x802)]/0x2),this['y']=this[_0x175bd3(0x64d)]()[_0x175bd3(0x6ae)]()[_0x175bd3(0x71a)]-Math[_0x175bd3(0x86f)](this['lineHeight']()*1.5);const _0x161b66=VisuMZ[_0x175bd3(0x46a)][_0x175bd3(0x55b)][_0x175bd3(0x37f)];this['x']+=_0x161b66['NameOffsetX']||0x0,this['y']+=_0x161b66['NameOffsetY']||0x0;},Window_EnemyName['prototype'][_0x2bbd55(0x185)]=function(){const _0x113541=_0x2bbd55;Window_Base[_0x113541(0x5d7)]['resetFontSettings'][_0x113541(0x4f4)](this),this[_0x113541(0x398)][_0x113541(0x534)]=VisuMZ[_0x113541(0x46a)][_0x113541(0x55b)][_0x113541(0x37f)][_0x113541(0x5f3)];},Window_EnemyName[_0x2bbd55(0x5d7)][_0x2bbd55(0x3c3)]=function(){const _0x2501fc=_0x2bbd55;this[_0x2501fc(0x398)][_0x2501fc(0x277)]();if(!this[_0x2501fc(0x64d)]())return;this['_text']=this[_0x2501fc(0x64d)]()['name']();const _0x34bdd0=this[_0x2501fc(0x6e1)](this['_text'])[_0x2501fc(0x802)],_0x1481fc=Math[_0x2501fc(0x86f)]((this['innerWidth']-_0x34bdd0)/0x2);this[_0x2501fc(0x74c)](this['_text'],_0x1481fc,0x0,_0x34bdd0+0x8);},Window_BattleLog[_0x2bbd55(0x5d7)]['maxLines']=function(){const _0x1cae15=_0x2bbd55;return VisuMZ[_0x1cae15(0x46a)]['Settings']['BattleLog'][_0x1cae15(0x51c)];},Window_BattleLog['prototype'][_0x2bbd55(0x1ef)]=function(){const _0x1f3742=_0x2bbd55;return VisuMZ['BattleCore'][_0x1f3742(0x55b)][_0x1f3742(0x5f2)][_0x1f3742(0x6f7)];},Window_BattleLog[_0x2bbd55(0x5d7)]['backColor']=function(){const _0x3e1d46=_0x2bbd55;return VisuMZ[_0x3e1d46(0x46a)][_0x3e1d46(0x55b)][_0x3e1d46(0x5f2)][_0x3e1d46(0x5b5)];},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x76b)]=function(){return![];},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x372)]=function(_0x513db5,_0xbdc8cc){const _0x258ecb=_0x2bbd55;this[_0x258ecb(0x305)](_0x258ecb(0x489)),BattleManager['invokeAction'](_0x513db5,_0xbdc8cc),this[_0x258ecb(0x7dd)]();},Window_BattleLog[_0x2bbd55(0x5d7)]['actionSplicePoint']=function(){const _0x21c52b=_0x2bbd55;this[_0x21c52b(0x7dd)]();},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x786)]=function(_0x4306a9){const _0x5031cb=_0x2bbd55,_0x195bd6=Array[_0x5031cb(0x5d7)][_0x5031cb(0x3d2)][_0x5031cb(0x4f4)](arguments,0x1),_0x551109={'name':_0x4306a9,'params':_0x195bd6},_0x3c9c5f=this[_0x5031cb(0x3dd)][_0x5031cb(0x28f)](_0x187750=>_0x187750[_0x5031cb(0x485)])[_0x5031cb(0x280)](_0x5031cb(0x489));_0x3c9c5f>=0x0?this['_methods']['splice'](_0x3c9c5f,0x0,_0x551109):this[_0x5031cb(0x3dd)][_0x5031cb(0x786)](_0x551109);},Window_BattleLog['prototype'][_0x2bbd55(0x305)]=function(_0x2584c7){const _0x1304b9=_0x2bbd55,_0x52a4c5=Array[_0x1304b9(0x5d7)]['slice']['call'](arguments,0x1);this['_methods'][_0x1304b9(0x305)]({'name':_0x2584c7,'params':_0x52a4c5});},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x82a)]=function(){const _0x27058b=_0x2bbd55;if(!$gameTemp[_0x27058b(0x2ee)]())return;console[_0x27058b(0x78c)](this[_0x27058b(0x3dd)][_0x27058b(0x28f)](_0x562d6b=>_0x562d6b[_0x27058b(0x485)])[_0x27058b(0x425)]('\x0a'));},VisuMZ['BattleCore'][_0x2bbd55(0x160)]=Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x3c3)],Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x3c3)]=function(){const _0x2ed19f=_0x2bbd55;this[_0x2ed19f(0x32a)]=!![];},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x3a1)]=Window_BattleLog['prototype']['update'],Window_BattleLog[_0x2bbd55(0x5d7)]['update']=function(){const _0x344ba1=_0x2bbd55;VisuMZ[_0x344ba1(0x46a)][_0x344ba1(0x3a1)][_0x344ba1(0x4f4)](this);if(this[_0x344ba1(0x32a)])this[_0x344ba1(0x65a)]();},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x65a)]=function(){const _0x235251=_0x2bbd55;this[_0x235251(0x32a)]=![],VisuMZ[_0x235251(0x46a)][_0x235251(0x160)][_0x235251(0x4f4)](this);},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x64f)]=function(_0x4ac74d){const _0x522d88=_0x2bbd55;let _0xa4c18=VisuMZ[_0x522d88(0x46a)][_0x522d88(0x55b)][_0x522d88(0x5f2)][_0x522d88(0x3c8)][_0x522d88(0x38e)]()[_0x522d88(0x692)](),_0x593c66=this[_0x522d88(0x6cf)][_0x4ac74d];if(_0x593c66[_0x522d88(0x87d)](/<LEFT>/i))_0xa4c18='left';else{if(_0x593c66[_0x522d88(0x87d)](/<CENTER>/i))_0xa4c18='center';else _0x593c66[_0x522d88(0x87d)](/<RIGHT>/i)&&(_0xa4c18=_0x522d88(0x740));}_0x593c66=_0x593c66['replace'](/<(?:LEFT|CENTER|RIGHT)>/gi,''),_0x593c66=_0x593c66[_0x522d88(0x830)](/\\I\[0\]/gi,'');const _0xb49e56=this[_0x522d88(0x1e4)](_0x4ac74d);this[_0x522d88(0x398)][_0x522d88(0x610)](_0xb49e56['x'],_0xb49e56['y'],_0xb49e56['width'],_0xb49e56[_0x522d88(0x6c3)]);const _0x4d1a44=this[_0x522d88(0x6e1)](_0x593c66)['width'];let _0x227e49=_0xb49e56['x'];if(_0xa4c18===_0x522d88(0x6b4))_0x227e49+=(_0xb49e56[_0x522d88(0x802)]-_0x4d1a44)/0x2;else _0xa4c18===_0x522d88(0x740)&&(_0x227e49+=_0xb49e56['width']-_0x4d1a44);this[_0x522d88(0x74c)](_0x593c66,_0x227e49,_0xb49e56['y'],_0x4d1a44+0x8);},Window_BattleLog['prototype'][_0x2bbd55(0x528)]=function(_0x59b008){const _0x432e28=_0x2bbd55;this[_0x432e28(0x6cf)][_0x432e28(0x786)](_0x59b008),this[_0x432e28(0x3c3)](),this[_0x432e28(0x7dd)]();},Window_BattleLog['prototype'][_0x2bbd55(0x4ef)]=function(){const _0x5e2ef2=_0x2bbd55;let _0x428add=![];switch(this['_waitMode']){case'effect':_0x428add=this[_0x5e2ef2(0x54a)]['isEffecting']();break;case'movement':_0x428add=this[_0x5e2ef2(0x54a)][_0x5e2ef2(0x32d)]();break;case _0x5e2ef2(0x6c4):_0x428add=this[_0x5e2ef2(0x54a)][_0x5e2ef2(0x28b)]();break;case'float':_0x428add=this['_spriteset']['isAnyoneFloating']();break;case'jump':_0x428add=this[_0x5e2ef2(0x54a)][_0x5e2ef2(0x285)]();break;case'opacity':_0x428add=this[_0x5e2ef2(0x54a)][_0x5e2ef2(0x28c)]();break;}return!_0x428add&&(this['_waitMode']=''),_0x428add;},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x5b6)]=function(){const _0x12ea77=_0x2bbd55;this[_0x12ea77(0x240)](_0x12ea77(0x6c4));},Window_BattleLog[_0x2bbd55(0x5d7)]['waitForFloat']=function(){const _0x4202b0=_0x2bbd55;this[_0x4202b0(0x240)](_0x4202b0(0x1e0));},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x472)]=function(){const _0x298adb=_0x2bbd55;this[_0x298adb(0x240)]('jump');},Window_BattleLog['prototype'][_0x2bbd55(0x7a3)]=function(){const _0x2fce73=_0x2bbd55;this[_0x2fce73(0x240)]('opacity');},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x639)]=function(){const _0x24c530=_0x2bbd55,_0x59ccbc=VisuMZ[_0x24c530(0x46a)]['Settings'][_0x24c530(0x5f2)];if(!_0x59ccbc['StartTurnShow'])return;this[_0x24c530(0x786)]('addText',_0x59ccbc[_0x24c530(0x509)][_0x24c530(0x36b)]($gameTroop[_0x24c530(0x303)]())),this[_0x24c530(0x786)](_0x24c530(0x6e0),_0x59ccbc[_0x24c530(0x5a2)]),this[_0x24c530(0x786)](_0x24c530(0x277));},Window_BattleLog['prototype'][_0x2bbd55(0x778)]=function(_0x59e31c,_0x14d795,_0x1bfb6f){const _0x1b874f=_0x2bbd55;this[_0x1b874f(0x617)](_0x14d795)?BattleManager['prepareCustomActionSequence']():this['usePremadeActionSequence'](_0x59e31c,_0x14d795,_0x1bfb6f);},Window_BattleLog['prototype'][_0x2bbd55(0x617)]=function(_0x2291ca){const _0x3e8f48=_0x2bbd55;if(!SceneManager[_0x3e8f48(0xfb)]())return![];if(!_0x2291ca)return![];if(!_0x2291ca[_0x3e8f48(0x2d9)]())return![];if(_0x2291ca[_0x3e8f48(0x2d9)]()[_0x3e8f48(0x11b)][_0x3e8f48(0x87d)](/<CUSTOM ACTION SEQUENCE>/i))return!![];if(DataManager['checkAutoCustomActionSequenceNotetagEffect'](_0x2291ca['item']()))return!![];return![];},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x4ba)]=function(_0x1eaf22,_0x87bc24,_0x282667){const _0x2bd307=_0x2bbd55,_0x248465=_0x87bc24['item']();this['setupActionSet'](_0x1eaf22,_0x87bc24,_0x282667),this[_0x2bd307(0x7d9)](_0x1eaf22,_0x87bc24,_0x282667),this[_0x2bd307(0x4dd)](_0x1eaf22,_0x87bc24,_0x282667);},Window_BattleLog[_0x2bbd55(0x5d7)]['displayAction']=function(_0x20e883,_0x2027ef){const _0x1ada47=_0x2bbd55,_0xfb9d91=VisuMZ[_0x1ada47(0x46a)][_0x1ada47(0x55b)]['BattleLog'];_0xfb9d91['ActionCenteredName']&&this[_0x1ada47(0x786)](_0x1ada47(0x528),_0x1ada47(0x515)[_0x1ada47(0x36b)](DataManager[_0x1ada47(0x69d)](_0x2027ef)));if(DataManager[_0x1ada47(0x375)](_0x2027ef)){if(_0xfb9d91[_0x1ada47(0x6a5)])this['displayItemMessage'](_0x2027ef[_0x1ada47(0x1d2)],_0x20e883,_0x2027ef);if(_0xfb9d91['ActionSkillMsg2'])this[_0x1ada47(0x6d1)](_0x2027ef[_0x1ada47(0x4df)],_0x20e883,_0x2027ef);}else{if(_0xfb9d91[_0x1ada47(0x4be)])this['displayItemMessage'](TextManager[_0x1ada47(0x1cf)],_0x20e883,_0x2027ef);}},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x58f)]=function(_0x33583a,_0x154f54,_0x40bca3){const _0x1957a3=_0x2bbd55,_0x35dd5e=_0x154f54[_0x1957a3(0x2d9)]();this[_0x1957a3(0x876)](_0x33583a,_0x35dd5e),this['push'](_0x1957a3(0x550),_0x33583a,_0x40bca3,!![]),this[_0x1957a3(0x786)](_0x1957a3(0x86b),_0x33583a,_0x154f54),this[_0x1957a3(0x786)]('waitForMovement'),this[_0x1957a3(0x786)](_0x1957a3(0x5a5),_0x33583a,_0x154f54),this['push'](_0x1957a3(0x5b6));},Window_BattleLog['prototype']['createEffectActionSet']=function(_0x3cab62,_0x5f31fa,_0x371cce){const _0x268b37=_0x2bbd55;if(this[_0x268b37(0x859)](_0x5f31fa))this['autoMeleeSingleTargetActionSet'](_0x3cab62,_0x5f31fa,_0x371cce);else{if(this[_0x268b37(0x378)](_0x5f31fa))this[_0x268b37(0x355)](_0x3cab62,_0x5f31fa,_0x371cce);else _0x5f31fa[_0x268b37(0x526)]()?this[_0x268b37(0x606)](_0x3cab62,_0x5f31fa,_0x371cce):this[_0x268b37(0x7f3)](_0x3cab62,_0x5f31fa,_0x371cce);}},Window_BattleLog[_0x2bbd55(0x5d7)]['isMeleeSingleTargetAction']=function(_0x15b489){const _0x7a2e89=_0x2bbd55;if(!_0x15b489[_0x7a2e89(0x33c)]())return![];if(!_0x15b489[_0x7a2e89(0x43e)]())return![];if(!_0x15b489['isForOpponent']())return![];return VisuMZ['BattleCore']['Settings'][_0x7a2e89(0x2d2)][_0x7a2e89(0x541)];},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x430)]=function(_0x2ec5d3,_0x53330a,_0x441d9d){const _0x95e264=_0x2bbd55,_0x3ec95e=_0x2ec5d3[_0x95e264(0x131)]()[_0x95e264(0x837)]<0x2,_0x7068ea=0x14,_0x3a4237=0x30;_0x3ec95e&&(this[_0x95e264(0x786)]('performJump',[_0x2ec5d3],_0x3a4237,_0x7068ea),this['push'](_0x95e264(0x7db),_0x2ec5d3,_0x441d9d,'front\x20base',_0x7068ea,!![],_0x95e264(0x483),!![]),this[_0x95e264(0x786)]('requestMotion',[_0x2ec5d3],'walk'),this[_0x95e264(0x786)](_0x95e264(0x359)));let _0x168e34=_0x53330a['isAttack']()?this['getDualWieldTimes'](_0x2ec5d3):0x1;for(let _0x47d9dd=0x0;_0x47d9dd<_0x168e34;_0x47d9dd++){_0x53330a[_0x95e264(0x45f)]()&&_0x2ec5d3[_0x95e264(0x101)]()&&this[_0x95e264(0x786)](_0x95e264(0x60b),_0x2ec5d3,_0x47d9dd),_0x53330a[_0x95e264(0x2d9)]()[_0x95e264(0x57c)]<0x0?this[_0x95e264(0x606)](_0x2ec5d3,_0x53330a,_0x441d9d):this['wholeActionSet'](_0x2ec5d3,_0x53330a,_0x441d9d);}_0x53330a['isAttack']()&&_0x2ec5d3[_0x95e264(0x101)]()&&this[_0x95e264(0x786)](_0x95e264(0x83c),_0x2ec5d3);this[_0x95e264(0x786)](_0x95e264(0x550),_0x2ec5d3,_0x441d9d,![]);if(_0x3ec95e){const _0x23afd7=_0x2ec5d3['battler']();this[_0x95e264(0x786)](_0x95e264(0x7a9),[_0x2ec5d3],_0x3a4237,_0x7068ea),this[_0x95e264(0x786)]('performMoveToPoint',_0x2ec5d3,_0x23afd7[_0x95e264(0x10d)],_0x23afd7[_0x95e264(0x59e)],_0x7068ea,![],_0x95e264(0x483)),this[_0x95e264(0x786)](_0x95e264(0x4ac),[_0x2ec5d3],_0x95e264(0x527)),this[_0x95e264(0x786)]('waitForMovement'),this[_0x95e264(0x786)](_0x95e264(0x4ac),[_0x2ec5d3],_0x95e264(0x705));}},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x378)]=function(_0x43a912){const _0x213487=_0x2bbd55;if(!_0x43a912[_0x213487(0x33c)]())return![];if(!_0x43a912['isForAll']())return![];if(!_0x43a912[_0x213487(0x282)]())return![];return VisuMZ[_0x213487(0x46a)][_0x213487(0x55b)][_0x213487(0x2d2)][_0x213487(0x254)];},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x355)]=function(_0x52012c,_0x32c037,_0x1c77d0){const _0x2f1e3f=_0x2bbd55,_0xbb03d8=_0x52012c[_0x2f1e3f(0x131)]()['type']<0x2,_0x4b9480=0x14,_0x1898c8=0x30;_0xbb03d8&&(this[_0x2f1e3f(0x786)](_0x2f1e3f(0x7a9),[_0x52012c],_0x1898c8,_0x4b9480),this[_0x2f1e3f(0x786)]('performMoveToTargets',_0x52012c,_0x1c77d0,'front\x20center',_0x4b9480,!![],_0x2f1e3f(0x483),!![]),this[_0x2f1e3f(0x786)](_0x2f1e3f(0x4ac),[_0x52012c],_0x2f1e3f(0x705)),this['push'](_0x2f1e3f(0x359)));let _0x33c394=_0x32c037[_0x2f1e3f(0x45f)]()?this[_0x2f1e3f(0x72a)](_0x52012c):0x1;for(let _0x2e5925=0x0;_0x2e5925<_0x33c394;_0x2e5925++){_0x32c037[_0x2f1e3f(0x45f)]()&&_0x52012c[_0x2f1e3f(0x101)]()&&this[_0x2f1e3f(0x786)](_0x2f1e3f(0x60b),_0x52012c,_0x2e5925),this[_0x2f1e3f(0x7f3)](_0x52012c,_0x32c037,_0x1c77d0);}_0x32c037[_0x2f1e3f(0x45f)]()&&_0x52012c[_0x2f1e3f(0x101)]()&&this['push'](_0x2f1e3f(0x83c),_0x52012c);this[_0x2f1e3f(0x786)](_0x2f1e3f(0x550),_0x52012c,_0x1c77d0,![]);if(_0xbb03d8){const _0x52148c=_0x52012c[_0x2f1e3f(0x6ae)]();this[_0x2f1e3f(0x786)](_0x2f1e3f(0x7a9),[_0x52012c],_0x1898c8,_0x4b9480),this[_0x2f1e3f(0x786)](_0x2f1e3f(0x197),_0x52012c,_0x52148c[_0x2f1e3f(0x10d)],_0x52148c[_0x2f1e3f(0x59e)],_0x4b9480,![],_0x2f1e3f(0x483)),this[_0x2f1e3f(0x786)](_0x2f1e3f(0x4ac),[_0x52012c],_0x2f1e3f(0x527)),this['push'](_0x2f1e3f(0x359)),this[_0x2f1e3f(0x786)](_0x2f1e3f(0x4ac),[_0x52012c],_0x2f1e3f(0x705));}},Window_BattleLog['prototype'][_0x2bbd55(0x606)]=function(_0x4b745b,_0x392269,_0x373a05){const _0x438bad=_0x2bbd55,_0x5db68c=_0x392269[_0x438bad(0x2d9)]();for(const _0x16b44b of _0x373a05){if(!_0x16b44b)continue;this['push'](_0x438bad(0x5b2),_0x4b745b,_0x392269),this[_0x438bad(0x786)](_0x438bad(0x6e0),Sprite_Battler[_0x438bad(0x2a7)]),this[_0x438bad(0x786)](_0x438bad(0x646),_0x4b745b,[_0x16b44b],_0x5db68c['animationId']),this[_0x438bad(0x786)](_0x438bad(0x6e0),0x18),this[_0x438bad(0x786)]('actionEffect',_0x4b745b,_0x16b44b);}},Window_BattleLog[_0x2bbd55(0x5d7)]['wholeActionSet']=function(_0x1e0dd8,_0x1f6e0a,_0x5c37f7){const _0x553d34=_0x2bbd55,_0x6b8976=_0x1f6e0a['item']();this[_0x553d34(0x786)](_0x553d34(0x5b2),_0x1e0dd8,_0x1f6e0a),this[_0x553d34(0x786)](_0x553d34(0x6e0),Sprite_Battler[_0x553d34(0x2a7)]),this['push'](_0x553d34(0x646),_0x1e0dd8,_0x5c37f7[_0x553d34(0x584)](),_0x6b8976[_0x553d34(0x57c)]),this[_0x553d34(0x786)](_0x553d34(0x5b6));for(const _0x3b1da9 of _0x5c37f7){if(!_0x3b1da9)continue;this[_0x553d34(0x786)](_0x553d34(0x372),_0x1e0dd8,_0x3b1da9);}},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x4dd)]=function(_0x401b10,_0x247f00,_0x595ddd){const _0x2c7cf4=_0x2bbd55,_0x34a356=_0x247f00[_0x2c7cf4(0x2d9)]();this[_0x2c7cf4(0x786)](_0x2c7cf4(0x550),_0x401b10,_0x595ddd,![]),this[_0x2c7cf4(0x786)]('waitForNewLine'),this[_0x2c7cf4(0x786)](_0x2c7cf4(0x2b3)),this[_0x2c7cf4(0x786)]('clear'),this['push'](_0x2c7cf4(0x4e9),_0x401b10),this[_0x2c7cf4(0x786)]('waitForMovement');},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x841)]=function(_0x2d0377){},VisuMZ[_0x2bbd55(0x46a)]['Window_BattleLog_displayCurrentState']=Window_BattleLog[_0x2bbd55(0x5d7)]['displayCurrentState'],Window_BattleLog[_0x2bbd55(0x5d7)]['displayCurrentState']=function(_0x257ab7){const _0x14bb4f=_0x2bbd55;if(!VisuMZ[_0x14bb4f(0x46a)][_0x14bb4f(0x55b)][_0x14bb4f(0x5f2)]['ShowCurrentState'])return;VisuMZ[_0x14bb4f(0x46a)]['Window_BattleLog_displayCurrentState'][_0x14bb4f(0x4f4)](this,_0x257ab7);},Window_BattleLog['prototype'][_0x2bbd55(0x519)]=function(_0x269d0f){const _0x1f75e1=_0x2bbd55;this['push']('performCounter',_0x269d0f);VisuMZ[_0x1f75e1(0x46a)][_0x1f75e1(0x55b)][_0x1f75e1(0x2d2)][_0x1f75e1(0x3e0)]&&this[_0x1f75e1(0x786)](_0x1f75e1(0x646),_0x269d0f,[BattleManager[_0x1f75e1(0x4dc)]],-0x1);if(!VisuMZ[_0x1f75e1(0x46a)][_0x1f75e1(0x55b)][_0x1f75e1(0x5f2)][_0x1f75e1(0x50c)])return;this[_0x1f75e1(0x786)](_0x1f75e1(0x528),TextManager['counterAttack']['format'](_0x269d0f['name']()));},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x411)]=function(_0x5ceb4f){const _0x363221=_0x2bbd55;this['push'](_0x363221(0x2ae),_0x5ceb4f);if(!VisuMZ['BattleCore'][_0x363221(0x55b)][_0x363221(0x5f2)][_0x363221(0x3ca)])return;this[_0x363221(0x786)](_0x363221(0x528),TextManager[_0x363221(0x384)][_0x363221(0x36b)](_0x5ceb4f[_0x363221(0x485)]()));},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x3d0)]=function(_0x27c945,_0x52d491){const _0x434b91=_0x2bbd55;if(VisuMZ[_0x434b91(0x46a)][_0x434b91(0x55b)][_0x434b91(0x2d2)][_0x434b91(0x687)]){const _0x5afaec=_0x52d491[_0x434b91(0x2d9)]();this[_0x434b91(0x786)](_0x434b91(0x646),_0x27c945,[_0x27c945],_0x5afaec['animationId']);}},Window_BattleLog[_0x2bbd55(0x5d7)]['displaySubstitute']=function(_0x1d5d77,_0x5d8735){const _0x2ca3ad=_0x2bbd55;this['push']('performSubstitute',_0x1d5d77,_0x5d8735);if(!VisuMZ[_0x2ca3ad(0x46a)]['Settings'][_0x2ca3ad(0x5f2)]['ShowSubstitute'])return;const _0x33d699=_0x1d5d77[_0x2ca3ad(0x485)](),_0x4416fc=TextManager[_0x2ca3ad(0x6c5)][_0x2ca3ad(0x36b)](_0x33d699,_0x5d8735[_0x2ca3ad(0x485)]());this[_0x2ca3ad(0x786)]('addText',_0x4416fc);},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x420)]=Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x2a3)],Window_BattleLog[_0x2bbd55(0x5d7)]['displayFailure']=function(_0x45770d){const _0x3003d6=_0x2bbd55;if(!VisuMZ['BattleCore'][_0x3003d6(0x55b)][_0x3003d6(0x5f2)]['ShowFailure'])return;VisuMZ[_0x3003d6(0x46a)][_0x3003d6(0x420)][_0x3003d6(0x4f4)](this,_0x45770d);},VisuMZ[_0x2bbd55(0x46a)]['Window_BattleLog_displayCritical']=Window_BattleLog['prototype']['displayCritical'],Window_BattleLog['prototype']['displayCritical']=function(_0x4cca25){const _0x589813=_0x2bbd55;if(!VisuMZ[_0x589813(0x46a)][_0x589813(0x55b)]['BattleLog'][_0x589813(0x293)])return;VisuMZ[_0x589813(0x46a)][_0x589813(0x810)][_0x589813(0x4f4)](this,_0x4cca25);},VisuMZ[_0x2bbd55(0x46a)]['Window_BattleLog_displayMiss']=Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x301)],Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x301)]=function(_0x11c009){const _0x52dd58=_0x2bbd55;!VisuMZ[_0x52dd58(0x46a)][_0x52dd58(0x55b)][_0x52dd58(0x5f2)][_0x52dd58(0x2b8)]?this['push'](_0x52dd58(0x14c),_0x11c009):VisuMZ[_0x52dd58(0x46a)]['Window_BattleLog_displayMiss'][_0x52dd58(0x4f4)](this,_0x11c009);},VisuMZ['BattleCore'][_0x2bbd55(0x5fa)]=Window_BattleLog['prototype']['displayEvasion'],Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x561)]=function(_0x5532ab){const _0x2e05b3=_0x2bbd55;!VisuMZ[_0x2e05b3(0x46a)][_0x2e05b3(0x55b)][_0x2e05b3(0x5f2)][_0x2e05b3(0x2b8)]?_0x5532ab[_0x2e05b3(0x28d)]()['physical']?this[_0x2e05b3(0x786)](_0x2e05b3(0x1ab),_0x5532ab):this['push'](_0x2e05b3(0x499),_0x5532ab):VisuMZ[_0x2e05b3(0x46a)][_0x2e05b3(0x5fa)][_0x2e05b3(0x4f4)](this,_0x5532ab);},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x16d)]=function(_0x1181bf){const _0xc60b97=_0x2bbd55;_0x1181bf[_0xc60b97(0x28d)]()[_0xc60b97(0x4da)]&&(_0x1181bf[_0xc60b97(0x28d)]()[_0xc60b97(0x1c7)]>0x0&&!_0x1181bf[_0xc60b97(0x28d)]()[_0xc60b97(0x238)]&&this[_0xc60b97(0x786)]('performDamage',_0x1181bf),_0x1181bf[_0xc60b97(0x28d)]()[_0xc60b97(0x1c7)]<0x0&&this[_0xc60b97(0x786)](_0xc60b97(0x65b),_0x1181bf),VisuMZ[_0xc60b97(0x46a)][_0xc60b97(0x55b)][_0xc60b97(0x5f2)][_0xc60b97(0x31d)]&&this[_0xc60b97(0x786)]('addText',this[_0xc60b97(0x482)](_0x1181bf)));},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x70e)]=Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x4cc)],Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x4cc)]=function(_0x2e2986){const _0x3e4a7b=_0x2bbd55;if(!VisuMZ[_0x3e4a7b(0x46a)]['Settings'][_0x3e4a7b(0x5f2)]['ShowMpDmg'])return;VisuMZ[_0x3e4a7b(0x46a)][_0x3e4a7b(0x70e)][_0x3e4a7b(0x4f4)](this,_0x2e2986);},VisuMZ['BattleCore']['Window_BattleLog_displayTpDamage']=Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x3c0)],Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x3c0)]=function(_0x29d160){const _0x286fd6=_0x2bbd55;if(!VisuMZ[_0x286fd6(0x46a)]['Settings'][_0x286fd6(0x5f2)]['ShowTpDmg'])return;VisuMZ['BattleCore'][_0x286fd6(0x62d)]['call'](this,_0x29d160);},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x571)]=function(_0x4502f4){const _0xd26650=_0x2bbd55,_0x2a8053=_0x4502f4[_0xd26650(0x28d)](),_0x598b64=_0x2a8053['addedStateObjects']();for(const _0x1a64b7 of _0x598b64){const _0xad0460=_0x4502f4[_0xd26650(0x101)]()?_0x1a64b7[_0xd26650(0x1d2)]:_0x1a64b7[_0xd26650(0x4df)];_0xad0460&&VisuMZ[_0xd26650(0x46a)]['Settings'][_0xd26650(0x5f2)][_0xd26650(0x3ab)]&&(this[_0xd26650(0x786)](_0xd26650(0x1e3)),this[_0xd26650(0x786)](_0xd26650(0x729)),this[_0xd26650(0x786)](_0xd26650(0x528),_0xad0460[_0xd26650(0x36b)](_0x4502f4[_0xd26650(0x485)]())),this[_0xd26650(0x786)](_0xd26650(0x30c))),_0x1a64b7['id']===_0x4502f4['deathStateId']()&&this[_0xd26650(0x786)]('performCollapse',_0x4502f4);}},Window_BattleLog['prototype'][_0x2bbd55(0x2fb)]=function(_0xbaf3b6){const _0x495c11=_0x2bbd55;if(!VisuMZ[_0x495c11(0x46a)][_0x495c11(0x55b)][_0x495c11(0x5f2)]['ShowRemovedState'])return;const _0xf5791c=_0xbaf3b6[_0x495c11(0x28d)](),_0x4eb66f=_0xf5791c['removedStateObjects']();for(const _0x28064c of _0x4eb66f){_0x28064c[_0x495c11(0x6a1)]&&(this['push']('popBaseLine'),this[_0x495c11(0x786)](_0x495c11(0x729)),this[_0x495c11(0x786)](_0x495c11(0x528),_0x28064c['message4'][_0x495c11(0x36b)](_0xbaf3b6[_0x495c11(0x485)]())),this[_0x495c11(0x786)](_0x495c11(0x30c)));}},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x781)]=function(_0x12d205){const _0x102db2=_0x2bbd55,_0x5b457f=VisuMZ[_0x102db2(0x46a)][_0x102db2(0x55b)]['BattleLog'],_0x27762e=_0x12d205[_0x102db2(0x28d)]();if(_0x5b457f['ShowAddedBuff'])this[_0x102db2(0x266)](_0x12d205,_0x27762e[_0x102db2(0x713)],TextManager[_0x102db2(0x688)]);if(_0x5b457f['ShowAddedDebuff'])this[_0x102db2(0x266)](_0x12d205,_0x27762e[_0x102db2(0x23b)],TextManager[_0x102db2(0x72d)]);if(_0x5b457f[_0x102db2(0x457)])this[_0x102db2(0x266)](_0x12d205,_0x27762e[_0x102db2(0x589)],TextManager[_0x102db2(0x825)]);},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x266)]=function(_0x34c6ea,_0xda062b,_0x103398){const _0x41e592=_0x2bbd55;for(const _0x11c104 of _0xda062b){const _0x2153d9=_0x103398['format'](_0x34c6ea['name'](),TextManager['param'](_0x11c104));this[_0x41e592(0x786)]('popBaseLine'),this[_0x41e592(0x786)](_0x41e592(0x729)),this['push'](_0x41e592(0x528),_0x2153d9),this[_0x41e592(0x786)](_0x41e592(0x30c));}},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x23f)]=Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x277)],Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x277)]=function(){const _0x4ebba3=_0x2bbd55;VisuMZ[_0x4ebba3(0x46a)][_0x4ebba3(0x23f)][_0x4ebba3(0x4f4)](this),this['callNextMethod']();},VisuMZ[_0x2bbd55(0x46a)]['Window_BattleLog_pushBaseLine']=Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x729)],Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x729)]=function(){const _0x5b2aa5=_0x2bbd55;VisuMZ[_0x5b2aa5(0x46a)][_0x5b2aa5(0x4b5)]['call'](this),this[_0x5b2aa5(0x7dd)]();},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x3be)]=Window_BattleLog['prototype'][_0x2bbd55(0x1e3)],Window_BattleLog['prototype'][_0x2bbd55(0x1e3)]=function(){const _0x209ff4=_0x2bbd55;VisuMZ[_0x209ff4(0x46a)][_0x209ff4(0x3be)]['call'](this),this['refresh'](),this[_0x209ff4(0x7dd)]();},VisuMZ['BattleCore'][_0x2bbd55(0x2f1)]=Window_BattleLog[_0x2bbd55(0x5d7)]['popupDamage'],Window_BattleLog[_0x2bbd55(0x5d7)]['popupDamage']=function(_0x52194b){const _0x998ef2=_0x2bbd55;VisuMZ[_0x998ef2(0x46a)][_0x998ef2(0x2f1)][_0x998ef2(0x4f4)](this,_0x52194b),this[_0x998ef2(0x7dd)]();},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x867)]=function(){const _0x180623=_0x2bbd55;let _0x57af76=0x0;this[_0x180623(0x132)][_0x180623(0x5cf)]>0x0&&(_0x57af76=this['_baseLineStack'][this[_0x180623(0x132)]['length']-0x1]),this[_0x180623(0x6cf)][_0x180623(0x5cf)]>_0x57af76?this[_0x180623(0x30c)]():this[_0x180623(0x7dd)]();},VisuMZ['BattleCore'][_0x2bbd55(0x1ed)]=Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x86b)],Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x86b)]=function(_0x1911da,_0x38893f){const _0x1bc5bb=_0x2bbd55;VisuMZ[_0x1bc5bb(0x46a)][_0x1bc5bb(0x1ed)][_0x1bc5bb(0x4f4)](this,_0x1911da,_0x38893f),this['callNextMethod']();},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x636)]=Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x5b2)],Window_BattleLog['prototype']['performAction']=function(_0x1371e2,_0xa306f7){const _0x48284a=_0x2bbd55;VisuMZ[_0x48284a(0x46a)][_0x48284a(0x636)][_0x48284a(0x4f4)](this,_0x1371e2,_0xa306f7),this[_0x48284a(0x7dd)]();},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x4ea)]=Window_BattleLog[_0x2bbd55(0x5d7)]['performActionEnd'],Window_BattleLog[_0x2bbd55(0x5d7)]['performActionEnd']=function(_0x538f60){const _0x402e56=_0x2bbd55;VisuMZ[_0x402e56(0x46a)]['Window_BattleLog_performActionEnd']['call'](this,_0x538f60);for(const _0x25c3bc of BattleManager[_0x402e56(0x2db)]()){if(!_0x25c3bc)continue;if(_0x25c3bc[_0x402e56(0x81e)]())continue;_0x25c3bc[_0x402e56(0x82d)]();}this[_0x402e56(0x7dd)]();},VisuMZ['BattleCore'][_0x2bbd55(0x493)]=Window_BattleLog['prototype'][_0x2bbd55(0x634)],Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x634)]=function(_0x109157){const _0x5d36a6=_0x2bbd55;VisuMZ[_0x5d36a6(0x46a)]['Window_BattleLog_performDamage'][_0x5d36a6(0x4f4)](this,_0x109157),this[_0x5d36a6(0x7dd)]();},VisuMZ['BattleCore']['Window_BattleLog_performMiss']=Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x14c)],Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x14c)]=function(_0x4df12e){const _0x5ba119=_0x2bbd55;VisuMZ[_0x5ba119(0x46a)][_0x5ba119(0x21e)]['call'](this,_0x4df12e),this[_0x5ba119(0x7dd)]();},VisuMZ[_0x2bbd55(0x46a)]['Window_BattleLog_performRecovery']=Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x65b)],Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x65b)]=function(_0x1455c2){const _0x700fdc=_0x2bbd55;VisuMZ[_0x700fdc(0x46a)][_0x700fdc(0x7c6)][_0x700fdc(0x4f4)](this,_0x1455c2),this[_0x700fdc(0x7dd)]();},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x353)]=Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x1ab)],Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x1ab)]=function(_0x3bb1e3){const _0x56722b=_0x2bbd55;VisuMZ[_0x56722b(0x46a)][_0x56722b(0x353)][_0x56722b(0x4f4)](this,_0x3bb1e3),this[_0x56722b(0x7dd)]();},VisuMZ[_0x2bbd55(0x46a)]['Window_BattleLog_performMagicEvasion']=Window_BattleLog['prototype'][_0x2bbd55(0x499)],Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x499)]=function(_0x7c30bb){const _0x17d6d5=_0x2bbd55;VisuMZ['BattleCore'][_0x17d6d5(0x668)]['call'](this,_0x7c30bb),this['callNextMethod']();},VisuMZ['BattleCore']['Window_BattleLog_performCounter']=Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x691)],Window_BattleLog[_0x2bbd55(0x5d7)]['performCounter']=function(_0x278bbe){const _0x28c0d0=_0x2bbd55;VisuMZ[_0x28c0d0(0x46a)][_0x28c0d0(0x124)][_0x28c0d0(0x4f4)](this,_0x278bbe),this[_0x28c0d0(0x7dd)]();},VisuMZ[_0x2bbd55(0x46a)]['Window_BattleLog_performReflection']=Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x2ae)],Window_BattleLog[_0x2bbd55(0x5d7)]['performReflection']=function(_0xaa8362){const _0x1e382e=_0x2bbd55;VisuMZ['BattleCore']['Window_BattleLog_performReflection'][_0x1e382e(0x4f4)](this,_0xaa8362),this[_0x1e382e(0x7dd)]();},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x180)]=Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x5ec)],Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x5ec)]=function(_0x3b1ad3,_0x28806e){const _0x5654ac=_0x2bbd55;VisuMZ['BattleCore'][_0x5654ac(0x180)][_0x5654ac(0x4f4)](this,_0x3b1ad3,_0x28806e),this[_0x5654ac(0x7dd)]();},VisuMZ[_0x2bbd55(0x46a)][_0x2bbd55(0x59c)]=Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x7e1)],Window_BattleLog['prototype'][_0x2bbd55(0x7e1)]=function(_0x17ec10){const _0x45f4fe=_0x2bbd55;VisuMZ[_0x45f4fe(0x46a)]['Window_BattleLog_performCollapse'][_0x45f4fe(0x4f4)](this,_0x17ec10),this[_0x45f4fe(0x7dd)]();},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x5a5)]=function(_0x5b10a7,_0x36e5ae){const _0x1bea2a=_0x2bbd55;_0x5b10a7[_0x1bea2a(0x5a5)](_0x36e5ae),this[_0x1bea2a(0x7dd)]();},Window_BattleLog[_0x2bbd55(0x5d7)]['showEnemyAttackAnimation']=function(_0x333020,_0x3a4bac){const _0x595591=_0x2bbd55,_0x5798af=_0x333020[_0x595591(0x339)]();_0x5798af<=0x0?SoundManager[_0x595591(0x416)]():this[_0x595591(0x3bb)](_0x3a4bac,_0x5798af);},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x550)]=function(_0x352ee2,_0x4a1a0a,_0x3c70d3){const _0x23885e=_0x2bbd55,_0x1816e4=[_0x352ee2][_0x23885e(0x633)](_0x4a1a0a);for(const _0x3b33a5 of _0x1816e4){if(!_0x3b33a5)continue;_0x3b33a5[_0x23885e(0x807)](_0x3c70d3);}this['callNextMethod']();},Window_BattleLog[_0x2bbd55(0x5d7)]['waitCount']=function(_0x34030c){this['_waitCount']=_0x34030c;},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x4ac)]=function(_0x354cfd,_0x5d0100){const _0x4715f9=_0x2bbd55;for(const _0x2bb643 of _0x354cfd){if(!_0x2bb643)continue;_0x2bb643[_0x4715f9(0x4ac)](_0x5d0100);}this[_0x4715f9(0x7dd)]();},Window_BattleLog[_0x2bbd55(0x5d7)][_0x2bbd55(0x197)]=function(_0x29f5ea,_0x376651,_0xe417e7,_0x402a6a,_0x2b40b8,_0x527f40){const _0x134db5=_0x2bbd55;_0x29f5ea[_0x134db5(0x620)](_0x376651,_0xe417e7,_0x402a6a,_0x2b40b8,_0x527f40,-0x1),this['callNextMethod']();},Window_BattleLog[_0x2bbd55(0x5d7)]['performMoveToTargets']=function(_0x455a77,_0x436dce,_0x4bb8f3,_0x24d987,_0x76633b,_0x5b42e3,_0x1c4e7f){const _0x28f443=_0x2bbd55,_0x469098=Math[_0x28f443(0x4fa)](..._0x436dce[_0x28f443(0x28f)](_0x3ea1b7=>_0x3ea1b7[_0x28f443(0x6ae)]()[_0x28f443(0x34b)]-_0x3ea1b7[_0x28f443(0x6ae)]()[_0x28f443(0x685)]()/0x2)),_0x391256=Math[_0x28f443(0x6b9)](..._0x436dce[_0x28f443(0x28f)](_0x574582=>_0x574582[_0x28f443(0x6ae)]()[_0x28f443(0x34b)]+_0x574582[_0x28f443(0x6ae)]()[_0x28f443(0x685)]()/0x2)),_0x2cb8f6=Math['min'](..._0x436dce[_0x28f443(0x28f)](_0x38c88f=>_0x38c88f[_0x28f443(0x6ae)]()[_0x28f443(0x71a)]-_0x38c88f[_0x28f443(0x6ae)]()[_0x28f443(0x4ca)]())),_0x3fbb01=Math['max'](..._0x436dce[_0x28f443(0x28f)](_0x11cbda=>_0x11cbda[_0x28f443(0x6ae)]()[_0x28f443(0x71a)])),_0x3624a3=_0x436dce[_0x28f443(0x11f)](_0x345205=>_0x345205[_0x28f443(0x101)]())[_0x28f443(0x5cf)],_0x511d4b=_0x436dce['filter'](_0x45b0f8=>_0x45b0f8['isEnemy']())[_0x28f443(0x5cf)];let _0x388d4d=0x0,_0x10bbd7=0x0;if(_0x4bb8f3[_0x28f443(0x87d)](/front/i))_0x388d4d=_0x3624a3>=_0x511d4b?_0x469098:_0x391256;else{if(_0x4bb8f3[_0x28f443(0x87d)](/middle/i))_0x388d4d=(_0x469098+_0x391256)/0x2,_0x1c4e7f=-0x1;else _0x4bb8f3[_0x28f443(0x87d)](/back/i)&&(_0x388d4d=_0x3624a3>=_0x511d4b?_0x391256:_0x469098);}if(_0x4bb8f3['match'](/head/i))_0x10bbd7=_0x2cb8f6;else{if(_0x4bb8f3[_0x28f443(0x87d)](/center/i))_0x10bbd7=(_0x2cb8f6+_0x3fbb01)/0x2;else _0x4bb8f3[_0x28f443(0x87d)](/base/i)&&(_0x10bbd7=_0x3fbb01);}_0x455a77[_0x28f443(0x620)](_0x388d4d,_0x10bbd7,_0x24d987,_0x76633b,_0x5b42e3,_0x1c4e7f),this[_0x28f443(0x7dd)]();},Window_BattleLog['prototype'][_0x2bbd55(0x7a9)]=function(_0x24103b,_0x35825a,_0x373775){const _0x2f17ec=_0x2bbd55;for(const _0xdb938b of _0x24103b){if(!_0xdb938b)continue;_0xdb938b[_0x2f17ec(0x216)](_0x35825a,_0x373775);}this[_0x2f17ec(0x7dd)]();};