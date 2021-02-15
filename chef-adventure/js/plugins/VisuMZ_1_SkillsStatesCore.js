//=============================================================================
// VisuStella MZ - Skills & States Core
// VisuMZ_1_SkillsStatesCore.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_1_SkillsStatesCore = true;

var VisuMZ = VisuMZ || {};
VisuMZ.SkillsStatesCore = VisuMZ.SkillsStatesCore || {};
VisuMZ.SkillsStatesCore.version = 1.11;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 1] [Version 1.11] [SkillsStatesCore]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Skills_and_States_Core_VisuStella_MZ
 * @orderAfter VisuMZ_0_CoreEngine
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * The Skills & States Core plugin extends and builds upon the functionality of
 * RPG Maker MZ's inherent skill, state, and buff functionalities and allows
 * game devs to customize its various aspects.
 *
 * Features include all (but not limited to) the following:
 * 
 * * Assigning multiple Skill Types to Skills.
 * * Making custom Skill Cost Types (such as HP, Gold, and Items).
 * * Allowing Skill Costs to become percentile-based or dynamic either directly
 *   through the Skills themselves or through trait-like notetags.
 * * Replacing gauges for different classes to display different types of
 *   Skill Cost Type resources.
 * * Hiding/Showing and enabling/disabling skills based on switches, learned
 *   skills, and code.
 * * Setting rulings for states, including if they're cleared upon death, how
 *   reapplying the state affects their turn count, and more.
 * * Allowing states to be categorized and affected by categories, too.
 * * Displaying turn counts on states drawn in the window or on sprites.
 * * Manipulation of state, buff, and debuff turns through skill and item
 *   effect notetags.
 * * Create custom damage over time state calculations through notetags.
 * * Allow database objects to apply passive states to its user.
 * * Passive states can have conditions before they become active as well.
 * * Updated Skill Menu Scene layout to fit more modern appearances.
 * * Added bonus if Items & Equips Core is installed to utilize the Shop Status
 *   Window to display skill data inside the Skill Menu.
 * * Control over various aspects of the Skill Menu Scene.
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
 * Buff & Debuff Level Management
 *
 * - In RPG Maker MZ, buffs and debuffs when applied to one another will shift
 * the buff modifier level up or down. This plugin will add an extra change to
 * the mechanic by making it so that once the buff modifier level reaches a
 * neutral point, the buff or debuff is removed altogether and resets the buff
 * and debuff turn counter for better accuracy.
 *
 * ---
 *
 * Skill Costs
 *
 * - In RPG Maker MZ, skill costs used to be hard-coded. Now, all Skill Cost
 * Types are now moved to the Plugin Parameters, including MP and TP. This
 * means that from payment to checking for them, it's all done through the
 * options available.
 *
 * - By default in RPG Maker MZ, displayed skill costs would only display only
 * one type: TP if available, then MP. If a skill costs both TP and MP, then
 * only TP was displayed. This plugin changes that aspect by displaying all the
 * cost types available in order of the Plugin Parameter Skill Cost Types.
 *
 * - By default in RPG Maker MZ, displayed skill costs were only color-coded.
 * This plugin changes that aspect by displaying the Skill Cost Type's name
 * alongside the cost. This is to help color-blind players distinguish what
 * costs a skill has.
 *
 * ---
 *
 * Sprite Gauges
 *
 * - Sprite Gauges in RPG Maker MZ by default are hard-coded and only work for
 * HP, MP, TP, and Time (used for ATB). This plugin makes it possible for them
 * to be customized through the use of Plugin Parameters under the Skill Cost
 * Types and their related-JavaScript entries.
 *
 * ---
 * 
 * State Displays
 * 
 * - To put values onto states and display them separately from the state turns
 * you can use the following script calls.
 * 
 *   battler.getStateDisplay(stateId)
 *   - This returns whatever value is stored for the specified battler under
 *     that specific state value.
 *   - If there is no value to be returned it will return an empty string.
 * 
 *   battler.setStateDisplay(stateId, value)
 *   - This sets the display for the battler's specific state to whatever you
 *     declared as the value.
 *   - The value is best used as a number or a string.
 * 
 *   battler.clearStateDisplay(stateId)
 *   - This clears the display for the battler's specific state.
 *   - In short, this sets the stored display value to an empty string.
 * 
 * ---
 *
 * Window Functions Moved
 *
 * - Some functions found in RPG Maker MZ's default code for Window_StatusBase
 * and Window_SkillList are now moved to Window_Base to make the functions
 * available throughout all windows for usage.
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
 * === General Skill Notetags ===
 *
 * The following are general notetags that are skill-related.
 *
 * ---
 *
 * <Skill Type: x>
 * <Skill Types: x,x,x>
 *
 * <Skill Type: name>
 * <Skill Types: name, name, name>
 *
 * - Used for: Skill Notetags
 * - Marks the skill to have multiple Skill Types, meaning they would appear
 *   under different skill types without needing to create duplicate skills.
 * - Replace 'x' with a number value representing the Skill Type's ID.
 * - If using 'name' notetag variant, replace 'name' with the Skill Type(s)
 *   name desired to be added.
 *
 * ---
 *
 * === Skill Cost Notetags ===
 *
 * The following are notetags that can be used to adjust skill costs. Some of
 * these notetags are added through the Plugin Parameter: Skill Cost Types and
 * can be altered there. This also means that some of these notetags can have
 * their functionality altered and/or removed.
 *
 * ---
 *
 * <type Cost: x>
 * <type Cost: x%>
 *
 * - Used for: Skill Notetags
 * - These notetags are used to designate costs of custom or already existing
 *   types that cannot be made by the Database Editor.
 * - Replace 'type' with a resource type. Existing ones found in the Plugin
 *   Parameters are 'HP', 'MP', 'TP', 'Gold', and 'Potion'. More can be added.
 * - Replace 'x' with a number value to determine the exact type cost value.
 *   This lets you bypass the Database Editor's limit of 9,999 MP and 100 TP.
 * - The 'x%' version is replaced with a percentile value to determine a cost
 *   equal to a % of the type's maximum quantity limit.
 * - Functionality for these notetags can be altered in the Plugin Parameters.
 *
 * Examples:
 *   <HP Cost: 500>
 *   <MP Cost: 25%>
 *   <Gold Cost: 3000>
 *   <Potion Cost: 5>
 *
 * ---
 *
 * <type Cost Max: x>
 * <type Cost Min: x>
 *
 * - Used for: Skill Notetags
 * - These notetags are used to ensure conditional and % costs don't become too
 *   large or too small.
 * - Replace 'type' with a resource type. Existing ones found in the Plugin
 *   Parameters are 'HP', 'MP', 'TP', 'Gold', and 'Potion'. More can be added.
 * - Replace 'x' with a number value to determine the maximum or minimum values
 *   that the cost can be.
 * - Functionality for these notetags can be altered in the Plugin Parameters.
 *
 * Examples:
 *   <HP Cost Max: 1500>
 *   <MP Cost Min: 5>
 *   <Gold Cost Max: 10000>
 *   <Potion Cost Min: 3>
 *
 * ---
 *
 * <type Cost: +x>
 * <type Cost: -x>
 *
 * <type Cost: x%>
 *
 * - Used for: Actor, Class, Weapon, Armor, Enemy, State Notetags
 * - Replace 'type' with a resource type. Existing ones found in the Plugin
 *   Parameters are 'HP', 'MP', 'TP', 'Gold', and 'Potion'. More can be added.
 * - For % notetag variant: Replace 'x' with a number value to determine the
 *   rate to adjust the Skill Cost Type by as a flat value. This is applied
 *   before <type Cost: +x> and <type Cost: -x> notetags.
 * - For + and - notetag variants: Replace 'x' with a number value to determine
 *   how much to adjust the Skill Cost Type by as a flat value. This is applied
 *   after <type Cost: x%> notetags.
 * - Functionality for these notetags can be altered in the Plugin Parameters.
 *
 * Examples:
 *   <HP Cost: +20>
 *   <MP Cost: -10>
 *   <Gold Cost: 50%>
 *   <Potion Cost: 200%>
 *
 * ---
 *
 * <Custom Cost Text>
 *  text
 * </Custom Cost Text>
 *
 * - Used for: Skill Notetags
 * - Allows you to insert custom text into the skill's cost area towards the
 *   end of the costs.
 * - Replace 'text' with the text you wish to display.
 * - Text codes may be used.
 *
 * ---
 *
 * === JavaScript Notetags: Skill Costs ===
 *
 * The following are notetags made for users with JavaScript knowledge to
 * determine any dynamic Skill Cost Types used for particular skills.
 *
 * ---
 *
 * <JS type Cost>
 *  code
 *  code
 *  cost = code;
 * </JS type Cost>
 *
 * - Used for: Skill Notetags
 * - Replace 'type' with a resource type. Existing ones found in the Plugin
 *   Parameters are 'HP', 'MP', 'TP', 'Gold', and 'Potion'. More can be added.
 * - Replace 'code' to determine the type 'cost' of the skill.
 * - Insert the final type cost into the 'cost' variable.
 * - The 'user' variable refers to the user about to perform the skill.
 * - The 'skill' variable refers to the skill being used.
 * - Functionality for the notetag can be altered in the Plugin Parameters.
 *
 * ---
 *
 * === Gauge Replacement Notetags ===
 *
 * Certain classes can have their gauges swapped out for other Skill Cost
 * Types. This is especially helpful for the classes that don't utilize those
 * Skill Cost Types. You can mix and match them however you want.
 *
 * ---
 *
 * <Replace HP Gauge: type>
 * <Replace MP Gauge: type>
 * <Replace TP Gauge: type>
 *
 * - Used for: Class Notetags
 * - Replaces the HP (1st), MP (2nd), or TP (3rd) gauge with a different Skill
 *   Cost Type.
 * - Replace 'type' with a resource type. Existing ones found in the Plugin
 *   Parameters are 'HP', 'MP', 'TP', 'Gold', and 'Potion'. More can be added.
 * - Replace 'type' with 'none' to not display any gauges there.
 * - The <Replace TP Gauge: type> will require 'Display TP in Window' setting
 *   to be on in the Database > System 1 tab.
 * - Functionality for the notetags can be altered by changes made to the
 *   Skill & States Core Plugin Parameters.
 *
 * ---
 *
 * === Skill Accessibility Notetags ===
 *
 * Sometimes, you don't want all skills to be visible whether it be to hide
 * menu-only skills during battle, until certain switches are turned ON/OFF, or
 * until certain skills have been learned.
 *
 * ---
 *
 * <Hide in Battle>
 * <Hide outside Battle>
 *
 * - Used for: Skill Notetags
 * - Makes the specific skill visible or hidden depending on whether or not the
 *   player is currently in battle.
 *
 * ---
 *
 * <Show Switch: x>
 *
 * <Show All Switches: x,x,x>
 * <Show Any Switches: x,x,x>
 *
 * - Used for: Skill Notetags
 * - Determines the visibility of the skill based on switches.
 * - Replace 'x' with the switch ID to determine the skill's visibility.
 * - If 'All' notetag variant is used, skill will be hidden until all switches
 *   are ON. Then, it would be shown.
 * - If 'Any' notetag variant is used, skill will be shown if any of the
 *   switches are ON. Otherwise, it would be hidden.
 *
 * ---
 *
 * <Hide Switch: x>
 *
 * <Hide All Switches: x,x,x>
 * <Hide Any Switches: x,x,x>
 *
 * - Used for: Skill Notetags
 * - Determines the visibility of the skill based on switches.
 * - Replace 'x' with the switch ID to determine the skill's visibility.
 * - If 'All' notetag variant is used, skill will be shown until all switches
 *   are ON. Then, it would be hidden.
 * - If 'Any' notetag variant is used, skill will be hidden if any of the
 *   switches are ON. Otherwise, it would be shown.
 *
 * ---
 *
 * <Show if learned Skill: x>
 *
 * <Show if learned All Skills: x,x,x>
 * <Show if learned Any Skills: x,x,x>
 *
 * <Show if learned Skill: name>
 *
 * <Show if learned All Skills: name, name, name>
 * <Show if learned Any Skills: name, name, name>
 *
 * - Used for: Skill Notetags
 * - Determines the visibility of the skill based on skills learned.
 * - This does not apply to skills added by traits on actors, classes, any
 *   equipment, or states. These are not considered learned skills. They are
 *   considered temporary skills.
 * - Replace 'x' with the skill ID to determine the skill's visibility.
 * - If 'name' notetag viarant is used, replace 'name' with the skill's name to
 *   be checked for the notetag.
 * - If 'All' notetag variant is used, skill will be hidden until all skills
 *   are learned. Then, it would be shown.
 * - If 'Any' notetag variant is used, skill will be shown if any of the skills
 *   are learned. Otherwise, it would be hidden.
 *
 * ---
 *
 * <Hide if learned Skill: x>
 *
 * <Hide if learned All Skills: x,x,x>
 * <Hide if learned Any Skills: x,x,x>
 *
 * <Hide if learned Skill: name>
 *
 * <Hide if learned All Skills: name, name, name>
 * <Hide if learned Any Skills: name, name, name>
 *
 * - Used for: Skill Notetags
 * - Determines the visibility of the skill based on skills learned.
 * - This does not apply to skills added by traits on actors, classes, any
 *   equipment, or states. These are not considered learned skills. They are
 *   considered temporary skills.
 * - Replace 'x' with the skill ID to determine the skill's visibility.
 * - If 'name' notetag viarant is used, replace 'name' with the skill's name to
 *   be checked for the notetag.
 * - If 'All' notetag variant is used, skill will be shown until all skills
 *   are learned. Then, it would be hidden.
 * - If 'Any' notetag variant is used, skill will be hidden if any of the
 *   skills are learned. Otherwise, it would be shown.
 *
 * ---
 *
 * <Show if has Skill: x>
 *
 * <Show if have All Skills: x,x,x>
 * <Show if have Any Skills: x,x,x>
 *
 * <Show if has Skill: name>
 *
 * <Show if have All Skills: name, name, name>
 * <Show if have Any Skills: name, name, name>
 *
 * - Used for: Skill Notetags
 * - Determines the visibility of the skill based on skills available.
 * - This applies to both skills that have been learned and/or temporarily
 *   added through traits on actors, classes, equipment, or states.
 * - Replace 'x' with the skill ID to determine the skill's visibility.
 * - If 'name' notetag viarant is used, replace 'name' with the skill's name to
 *   be checked for the notetag.
 * - If 'All' notetag variant is used, skill will be hidden until all skills
 *   are learned. Then, it would be shown.
 * - If 'Any' notetag variant is used, skill will be shown if any of the skills
 *   are learned. Otherwise, it would be hidden.
 *
 * ---
 *
 * <Hide if has Skill: x>
 *
 * <Hide if have All Skills: x,x,x>
 * <Hide if have Any Skills: x,x,x>
 *
 * <Hide if has Skill: name>
 *
 * <Hide if have All Skills: name, name, name>
 * <Hide if have Any Skills: name, name, name>
 *
 * - Used for: Skill Notetags
 * - Determines the visibility of the skill based on skills available.
 * - This applies to both skills that have been learned and/or temporarily
 *   added through traits on actors, classes, equipment, or states.
 * - Replace 'x' with the skill ID to determine the skill's visibility.
 * - If 'name' notetag viarant is used, replace 'name' with the skill's name to
 *   be checked for the notetag.
 * - If 'All' notetag variant is used, skill will be shown until all skills
 *   are learned. Then, it would be hidden.
 * - If 'Any' notetag variant is used, skill will be hidden if any of the
 *   skills are learned. Otherwise, it would be shown.
 *
 * ---
 *
 * <Enable Switch: x>
 *
 * <Enable All Switches: x,x,x>
 * <Enable Any Switches: x,x,x>
 *
 * - Used for: Skill Notetags
 * - Determines the enabled status of the skill based on switches.
 * - Replace 'x' with the switch ID to determine the skill's enabled status.
 * - If 'All' notetag variant is used, skill will be disabled until all
 *   switches are ON. Then, it would be enabled.
 * - If 'Any' notetag variant is used, skill will be enabled if any of the
 *   switches are ON. Otherwise, it would be disabled.
 *
 * ---
 *
 * <Disable Switch: x>
 *
 * <Disable All Switches: x,x,x>
 * <Disable Any Switches: x,x,x>
 *
 * - Used for: Skill Notetags
 * - Determines the enabled status of the skill based on switches.
 * - Replace 'x' with the switch ID to determine the skill's enabled status.
 * - If 'All' notetag variant is used, skill will be enabled until all switches
 *   are ON. Then, it would be disabled.
 * - If 'Any' notetag variant is used, skill will be disabled if any of the
 *   switches are ON. Otherwise, it would be enabled.
 *
 * ---
 *
 * === JavaScript Notetags: Skill Accessibility ===
 *
 * The following are notetags made for users with JavaScript knowledge to
 * determine if a skill can be accessible visibly or through usage.
 *
 * ---
 *
 * <JS Skill Visible>
 *  code
 *  code
 *  visible = code;
 * </JS Skill Visible>
 *
 * - Used for: Skill Notetags
 * - Determines the visibility of the skill based on JavaScript code.
 * - Replace 'code' to determine the type visibility of the skill.
 * - The 'visible' variable returns a boolean (true/false) to determine if the
 *   skill will be visible or not.
 * - The 'user' variable refers to the user with the skill.
 * - The 'skill' variable refers to the skill being checked.
 * - All other visibility conditions must be met for this code to count.
 *
 * ---
 *
 * <JS Skill Enable>
 *  code
 *  code
 *  enabled = code;
 * </JS Skill Enable>
 *
 * - Used for: Skill Notetags
 * - Determines the enabled status of the skill based on JavaScript code.
 * - Replace 'code' to determine the type enabled status of the skill.
 * - The 'enabled' variable returns a boolean (true/false) to determine if the
 *   skill will be enabled or not.
 * - The 'user' variable refers to the user with the skill.
 * - The 'skill' variable refers to the skill being checked.
 * - All other skill conditions must be met in order for this to code to count.
 *
 * ---
 *
 * === General State-Related Notetags ===
 *
 * The following notetags are centered around states, such as how their turn
 * counts are displayed, items and skills that affect state turns, if the state
 * can avoid removal by death state, etc.
 *
 * ---
 *
 * <No Death Clear>
 *
 * - Used for: State Notetags
 * - Prevents this state from being cleared upon death.
 * - This allows this state to be added to an already dead battler, too.
 *
 * ---
 *
 * <No Recover All Clear>
 *
 * - Used for: State Notetags
 * - Prevents this state from being cleared upon using the Recover All command.
 *
 * ---
 *
 * <Group Defeat>
 *
 * - Used for: State Notetags
 * - If an entire party is affected by states with the <Group Defeat> notetag,
 *   they are considered defeated.
 * - Usage for this includes party-wide petrification, frozen, etc.
 *
 * ---
 *
 * <Reapply Rules: Ignore>
 * <Reapply Rules: Reset>
 * <Reapply Rules: Greater>
 * <Reapply Rules: Add>
 *
 * - Used for: State Notetags
 * - Choose what kind of rules this state follows if the state is being applied
 *   to a target that already has the state. This affects turns specifically.
 * - 'Ignore' will bypass any turn changes.
 * - 'Reset' will recalculate the state's turns.
 * - 'Greater' will choose to either keep the current turn count if it's higher
 *   than the reset amount or reset it if the current turn count is lower.
 * - 'Add' will add the state's turn count to the applied amount.
 * - If this notetag isn't used, it will use the rules set in the States >
 *   Plugin Parameters.
 *
 * ---
 *
 * <Positive State>
 * <Negative State>
 *
 * - Used for: State Notetags
 * - Marks the state as a positive state or negative state, also altering the
 *   state's turn count color to match the Plugin Parameter settings.
 * - This also puts the state into either the 'Positive' category or
 *   'Negative' category.
 *
 * ---
 *
 * <Category: name>
 * <Category: name, name, name>
 *
 * - Used for: State Notetags
 * - Arranges states into certain/multiple categories.
 * - Replace 'name' with a category name to mark this state as.
 * - Insert multiples of this to mark the state with  multiple categories.
 *
 * ---
 *
 * <Categories>
 *  name
 *  name
 * </Categories>
 *
 * - Used for: State Notetags
 * - Arranges states into certain/multiple categories.
 * - Replace each 'name' with a category name to mark this state as.
 *
 * ---
 *
 * <State x Category Remove: y>
 * 
 * <State x Category Remove: All>
 *
 * - Used for: Skill, Item Notetags
 * - Allows the skill/item to remove 'y' states from specific category 'x'.
 * - Replace 'x' with a category name to remove from.
 * - Replace 'y' with the number of times to remove from that category.
 * - Use the 'All' variant to remove all of the states of that category.
 * - Insert multiples of this to remove different types of categories.
 *
 * ---
 *
 * <Hide State Turns>
 *
 * - Used for: State Notetags
 * - Hides the state turns from being shown at all.
 * - This will by pass any Plugin Parameter settings.
 *
 * ---
 *
 * <Turn Color: x>
 * <Turn Color: #rrggbb>
 *
 * - Used for: State Notetags
 * - Hides the state turns from being shown at all.
 * - Determines the color of the state's turn count.
 * - Replace 'x' with a number value depicting a window text color.
 * - Replace 'rrggbb' with a hex color code for a more custom color.
 *
 * ---
 *
 * <State id Turns: +x>
 * <State id Turns: -x>
 *
 * <Set State id Turns: x>
 *
 * <State name Turns: +x>
 * <State name Turns: -x>
 *
 * <Set State name Turns: x>
 *
 * - Used for: Skill, Item Notetags
 * - If the target is affected by state 'id' or state 'name', change the state
 *   turn duration for target.
 * - For 'id' variant, replace 'id' with the ID of the state to modify.
 * - For 'name' variant, replace 'name' with the name of the state to modify.
 * - Replace 'x' with the value you wish to increase, decrease, or set to.
 * - Insert multiples of this notetag to affect multiple states at once.
 *
 * ---
 *
 * <param Buff Turns: +x>
 * <param Buff Turns: -x>
 *
 * <Set param Buff Turns: x>
 *
 * - Used for: Skill, Item Notetags
 * - If the target is affected by a 'param' buff, change that buff's turn
 *   duration for target.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter buff to modify.
 * - Replace 'x' with the value you wish to increase, decrease, or set to.
 * - Insert multiples of this notetag to affect multiple parameters at once.
 *
 * ---
 *
 * <param Debuff Turns: +x>
 * <param Debuff Turns: -x>
 *
 * <Set param Debuff Turns: x>
 *
 * - Used for: Skill, Item Notetags
 * - If the target is affected by a 'param' debuff, change that debuff's turn
 *   duration for target.
 * - Replace 'param' with 'MaxHP', 'MaxMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI',
 *   or 'LUK' to determine which parameter debuff to modify.
 * - Replace 'x' with the value you wish to increase, decrease, or set to.
 * - Insert multiples of this notetag to affect multiple parameters at once.
 *
 * ---
 *
 * === JavaScript Notetags: On Add/Erase/Expire ===
 *
 * Using JavaScript code, you can use create custom effects that occur when a
 * state has bee added, erased, or expired.
 * 
 * ---
 *
 * <JS On Add State>
 *  code
 *  code
 * </JS On Add State>
 *
 * - Used for: State Notetags
 * - When a state is added, run the code added by this notetag.
 * - The 'user' variable refers to the current active battler.
 * - The 'target' variable refers to the battler affected by this state.
 * - The 'origin' variable refers to the one who applied this state.
 * - The 'state' variable refers to the current state being affected.
 *
 * ---
 *
 * <JS On Erase State>
 *  code
 *  code
 * </JS On Erase State>
 *
 * - Used for: State Notetags
 * - When a state is erased, run the code added by this notetag.
 * - The 'user' variable refers to the current active battler.
 * - The 'target' variable refers to the battler affected by this state.
 * - The 'origin' variable refers to the one who applied this state.
 * - The 'state' variable refers to the current state being affected.
 *
 * ---
 *
 * <JS On Expire State>
 *  code
 *  code
 * </JS On Expire State>
 *
 * - Used for: State Notetags
 * - When a state has expired, run the code added by this notetag.
 * - The 'user' variable refers to the current active battler.
 * - The 'target' variable refers to the battler affected by this state.
 * - The 'origin' variable refers to the one who applied this state.
 * - The 'state' variable refers to the current state being affected.
 *
 * ---
 *
 * === JavaScript Notetags: Slip Damage/Healing ===
 *
 * Slip Damage, in RPG Maker vocabulary, refers to damage over time. The
 * following notetags allow you to perform custom slip damage/healing.
 *
 * ---
 *
 * <JS type Slip Damage>
 *  code
 *  code
 *  damage = code;
 * </JS type Slip Damage>
 *
 * - Used for: State Notetags
 * - Code used to determine how much slip damage is dealt to the affected unit
 *   during each regeneration phase.
 * - Replace 'type' with 'HP', 'MP', or 'TP'.
 * - Replace 'code' with the calculations on what to determine slip damage.
 * - The 'user' variable refers to the origin of the state.
 * - The 'target' variable refers to the affected unit receiving the damage.
 * - The 'state' variable refers to the current state being affected.
 * - The 'damage' variable is the finalized slip damage to be dealt.
 *
 * ---
 *
 * <JS type Slip Heal>
 *  code
 *  code
 *  heal = code;
 * </JS type Slip Heal>
 *
 * - Used for: State Notetags
 * - Code used to determine how much slip healing is dealt to the affected unit
 *   during each regeneration phase.
 * - Replace 'type' with 'HP', 'MP', or 'TP'.
 * - Replace 'code' with the calculations on what to determine slip healing.
 * - The 'user' variable refers to the origin of the state.
 * - The 'target' variable refers to the affected unit receiving the healing.
 * - The 'state' variable refers to the current state being affected.
 * - The 'heal' variable is the finalized slip healing to be recovered.
 *
 * ---
 *
 * === Passive State Notetags ===
 *
 * Passive States are states that are always applied to actors and enemies
 * provided that their conditions have been met. These can be granted through
 * database objects or through the Passive States Plugin Parameters.
 * 
 * ---
 * 
 * For those using the code "a.isStateAffected(10)" to check if a target is
 * affected by a state or not, this does NOT check passive states. This only
 * checks for states that were directly applied to the target.
 * 
 * Instead, use "a.states().includes($dataStates[10])" to check for them. This
 * code will search for both directly applied states and passive states alike.
 *
 * ---
 *
 * <Passive State: x>
 * <Passive States: x,x,x>
 *
 * <Passive State: name>
 * <Passive States: name, name, name>
 *
 * - Used for: Actor, Class, Skill, Item, Weapon, Armor, Enemy Notetags
 * - Adds passive state(s) x to trait object, applying it to related actor or
 *   enemy unit(s).
 * - Replace 'x' with a number to determine which state to add as a passive.
 * - If using 'name' notetag variant, replace 'name' with the name of the
 *   state(s) to add as a passive.
 * - Note: If you plan on applying a passive state through a skill, it must be
 *   through a skill that has been learned by the target and not a skill that
 *   is given through a trait.
 *
 * ---
 *
 * <Passive Stackable>
 *
 * - Used for: State Notetags
 * - Makes it possible for this passive state to be added multiple times.
 * - Otherwise, only one instance of the passive state can be available.
 *
 * ---
 *
 * <Passive Condition Class: id>
 * <Passive Condition Classes: id, id, id>
 *
 * <Passive Condition Class: name>
 * <Passive Condition Classes: name, name, name>
 *
 * - Used for: State Notetags
 * - Determines the passive condition of the passive state based on the actor's
 *   current class. As long as the actor's current class matches one of the
 *   data entries, the passive condition is considered passed.
 * - For 'id' variant, replace 'id' with a number representing class's ID.
 * - For 'name' variant, replace 'name' with the class's name.
 *
 * ---
 *
 * <Passive Condition Multiclass: id>
 * <Passive Condition Multiclass: id, id, id>
 *
 * <Passive Condition Multiclass: name>
 * <Passive Condition Multiclass: name, name, name>
 *
 * - Used for: State Notetags
 * - Requires VisuMZ_2_ClassChangeSystem!
 * - Determines the passive condition of the passive state based on the actor's
 *   multiclasses. As long as the actor has any of the matching classes
 *   assigned as a multiclass, the passive condition is considered passed.
 * - For 'id' variant, replace 'id' with a number representing class's ID.
 * - For 'name' variant, replace 'name' with the class's name.
 *
 * ---
 *
 * <Passive Condition Switch ON: x>
 *
 * <Passive Condition All Switches ON: x,x,x>
 * <Passive Condition Any Switch ON: x,x,x>
 *
 * - Used for: State Notetags
 * - Determines the passive condition of the passive state based on switches.
 * - Replace 'x' with the switch ID to determine the state's passive condition.
 * - If 'All' notetag variant is used, conditions will not be met until all
 *   switches are ON. Then, it would be met.
 * - If 'Any' notetag variant is used, conditions will be met if any of the
 *   switches are ON. Otherwise, it would not be met.
 *
 * ---
 *
 * <Passive Condition Switch OFF: x>
 *
 * <Passive Condition All Switches OFF: x,x,x>
 * <Passive Condition Any Switch OFF: x,x,x>
 *
 * - Used for: State Notetags
 * - Determines the passive condition of the passive state based on switches.
 * - Replace 'x' with the switch ID to determine the state's passive condition.
 * - If 'All' notetag variant is used, conditions will not be met until all
 *   switches are OFF. Then, it would be met.
 * - If 'Any' notetag variant is used, conditions will be met if any of the
 *   switches are OFF. Otherwise, it would not be met.
 *
 * ---
 *
 * === JavaScript Notetags: Passive State ===
 *
 * The following is a notetag made for users with JavaScript knowledge to
 * determine if a passive state's condition can be met.
 *
 * ---
 *
 * <JS Passive Condition>
 *  code
 *  code
 *  condition = code;
 * </JS Passive Condition>
 *
 * - Used for: State Notetags
 * - Determines the passive condition of the state based on JavaScript code.
 * - Replace 'code' to determine if a passive state's condition has been met.
 * - The 'condition' variable returns a boolean (true/false) to determine if
 *   the passive state's condition is met or not.
 * - The 'user' variable refers to the user affected by the passive state.
 * - The 'state' variable refers to the passive state being checked.
 * - All other passive conditions must be met for this code to count.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: General Skill Settings
 * ============================================================================
 *
 * These Plugin Parameters adjust various aspects of the game regarding skills
 * from the custom Skill Menu Layout to global custom effects made in code.
 *
 * ---
 *
 * General
 * 
 *   Use Updated Layout:
 *   - Use the Updated Skill Menu Layout provided by this plugin?
 *   - This will automatically enable the Status Window.
 *   - This will override the Core Engine windows settings.
 *
 *   Layout Style:
 *   - If using an updated layout, how do you want to style the menu scene?
 *     - Upper Help, Left Input
 *     - Upper Help, Right Input
 *     - Lower Help, Left Input
 *     - Lower Help, Right Input
 *
 * ---
 *
 * Skill Type Window
 * 
 *   Style:
 *   - How do you wish to draw commands in the Skill Type Window?
 *   - Text Only: Display only the text.
 *   - Icon Only: Display only the icon.
 *   - Icon + Text: Display the icon first, then the text.
 *   - Auto: Determine which is better to use based on the size of the cell.
 * 
 *   Text Align:
 *   - Text alignment for the Skill Type Window.
 *
 * ---
 *
 * List Window
 * 
 *   Columns:
 *   - Number of maximum columns.
 *
 * ---
 *
 * Shop Status Window
 * 
 *   Show in Skill Menu?:
 *   - Show the Shop Status Window in the Skill Menu?
 *   - This is enabled if the Updated Layout is on.
 * 
 *   Adjust List Window?:
 *   - Automatically adjust the Skill List Window in the Skill Menu if using
 *     the Shop Status Window?
 * 
 *   Background Type:
 *   - Select background type for this window.
 *     - 0 - Window
 *     - 1 - Dim
 *     - 2 - Transparent
 * 
 *   JS: X, Y, W, H:
 *   - Code used to determine the dimensions for this Shop Status Window in the
 *     Skill Menu.
 *
 * ---
 *
 * Skill Types
 * 
 *   Hidden Skill Types:
 *   - Insert the ID's of the Skill Types you want hidden from view ingame.
 * 
 *   Hidden During Battle:
 *   - Insert the ID's of the Skill Types you want hidden during battle only.
 * 
 *   Icon: Normal Type:
 *   - Icon used for normal skill types that aren't assigned any icons.
 *   - To assign icons to skill types, simply insert \I[x] into the
 *     skill type's name in the Database > Types tab.
 * 
 *   Icon: Magic Type:
 *   - Icon used for magic skill types that aren't assigned any icons.
 *   - To assign icons to skill types, simply insert \I[x] into the
 *     skill type's name in the Database > Types tab.
 *
 * ---
 *
 * Global JS Effects
 * 
 *   JS: Skill Conditions:
 *   - JavaScript code for a global-wide skill condition check.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Skill Cost Types
 * ============================================================================
 *
 * Skill Cost Types are the resources that are used for your skills. These can
 * range from the default MP and TP resources to the newly added HP, Gold, and
 * Potion resources.
 *
 * ---
 *
 * Settings
 * 
 *   Name:
 *   - A name for this Skill Cost Type.
 * 
 *   Icon:
 *   - Icon used for this Skill Cost Type.
 *   - Use 0 for no icon.
 * 
 *   Font Color:
 *   - Text Color used to display this cost.
 *   - For a hex color, use #rrggbb with VisuMZ_1_MessageCore
 * 
 *   Font Size:
 *   - Font size used to display this cost.
 *
 * ---
 *
 * Cost Processing
 * 
 *   JS: Cost Calculation:
 *   - Code on how to calculate this resource cost for the skill.
 * 
 *   JS: Can Pay Cost?:
 *   - Code on calculating whether or not the user is able to pay the cost.
 * 
 *   JS: Paying Cost:
 *   - Code for if met, this is the actual process of paying of the cost.
 *
 * ---
 *
 * Window Display
 * 
 *   JS: Show Cost?:
 *   - Code for determining if the cost is shown or not.
 * 
 *   JS: Cost Text:
 *   - Code to determine the text (with Text Code support) used for the
 *     displayed cost.
 *
 * ---
 *
 * Gauge Display
 * 
 *   JS: Maximum Value:
 *   - Code to determine the maximum value used for this Skill Cost resource
 *     for gauges.
 * 
 *   JS: Current Value:
 *   - Code to determine the current value used for this Skill Cost resource
 *     for gauges.
 * 
 *   JS: Draw Gauge:
 *   - Code to determine how to draw the Skill Cost resource for this 
 *     gauge type.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: General State Settings
 * ============================================================================
 *
 * These are general settings regarding RPG Maker MZ's state-related aspects
 * from how turns are reapplied to custom code that's ran whenever states are
 * added, erased, or expired.
 *
 * ---
 *
 * General
 * 
 *   Reapply Rules:
 *   - These are the rules when reapplying states.
 *   - Ignore: State doesn't get added.
 *   - Reset: Turns get reset.
 *   - Greater: Turns take greater value (current vs reset).
 *   - Add: Turns add upon existing turns.
 * 
 *   Maximum Turns:
 *   - Maximum number of turns to let states go up to.
 *   - This can be changed with the <Max Turns: x> notetag.
 *
 * ---
 *
 * Turn Display
 * 
 *   Show Turns?:
 *   - Display state turns on top of window icons and sprites?
 * 
 *   Turn Font Size:
 *   - Font size used for displaying turns.
 * 
 *   Offset X:
 *   - Offset the X position of the turn display.
 * 
 *   Offset Y:
 *   - Offset the Y position of the turn display.
 * 
 *   Turn Font Size:
 *   - Font size used for displaying turns.
 * 
 *   Turn Color: Neutral:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 * 
 *   Turn Color: Positive:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 * 
 *   Turn Color: Negative:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 *
 * ---
 *
 * Data Display
 * 
 *   Show Data?:
 *   - Display state data on top of window icons and sprites?
 * 
 *   Data Font Size:
 *   - Font size used for displaying state data.
 * 
 *   Offset X:
 *   - Offset the X position of the state data display.
 * 
 *   Offset Y:
 *   - Offset the Y position of the state data display.
 *
 * ---
 *
 * Global JS Effects
 * 
 *   JS: On Add State:
 *   - JavaScript code for a global-wide custom effect whenever a state
 *     is added.
 * 
 *   JS: On Erase State:
 *   - JavaScript code for a global-wide custom effect whenever a state
 *     is erased.
 * 
 *   JS: On Expire State:
 *   - JavaScript code for a global-wide custom effect whenever a state
 *     has expired.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: General Buff/Debuff Settings
 * ============================================================================
 *
 * Buffs and debuffs don't count as states by RPG Maker MZ's mechanics, but
 * they do function close enough for them to be added to this plugin for
 * adjusting. Change these settings to make buffs and debuffs work to your
 * game's needs.
 *
 * ---
 *
 * General
 * 
 *   Reapply Rules:
 *   - These are the rules when reapplying buffs/debuffs.
 *   - Ignore: Buff/Debuff doesn't get added.
 *   - Reset: Turns get reset.
 *   - Greater: Turns take greater value (current vs reset).
 *   - Add: Turns add upon existing turns.
 * 
 *   Maximum Turns:
 *   - Maximum number of turns to let buffs and debuffs go up to.
 *
 * ---
 *
 * Stacking
 * 
 *   Max Stacks: Buff:
 *   - Maximum number of stacks for buffs.
 * 
 *   Max Stacks: Debuff:
 *   - Maximum number of stacks for debuffs.
 * 
 *   JS: Buff/Debuff Rate:
 *   - Code to determine how much buffs and debuffs affect parameters.
 *
 * ---
 *
 * Turn Display
 * 
 *   Show Turns?:
 *   - Display buff and debuff turns on top of window icons and sprites?
 * 
 *   Turn Font Size:
 *   - Font size used for displaying turns.
 * 
 *   Offset X:
 *   - Offset the X position of the turn display.
 * 
 *   Offset Y:
 *   - Offset the Y position of the turn display.
 * 
 *   Turn Color: Buffs:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 * 
 *   Turn Color: Debuffs:
 *   - Use #rrggbb for custom colors or regular numbers for text colors from
 *     the Window Skin.
 *
 * ---
 *
 * Rate Display
 * 
 *   Show Rate?:
 *   - Display buff and debuff rate on top of window icons and sprites?
 * 
 *   Rate Font Size:
 *   - Font size used for displaying rate.
 * 
 *   Offset X:
 *   - Offset the X position of the rate display.
 * 
 *   Offset Y:
 *   - Offset the Y position of the rate display.
 *
 * ---
 *
 * Global JS Effects
 * 
 *   JS: On Add Buff:
 *   - JavaScript code for a global-wide custom effect whenever a
 *     buff is added.
 * 
 *   JS: On Add Debuff:
 *   - JavaScript code for a global-wide custom effect whenever a
 *     debuff is added.
 * 
 *   JS: On Erase Buff:
 *   - JavaScript code for a global-wide custom effect whenever a
 *     buff is added.
 * 
 *   JS: On Erase Debuff:
 *   - JavaScript code for a global-wide custom effect whenever a
 *     debuff is added.
 * 
 *   JS: On Expire Buff:
 *   - JavaScript code for a global-wide custom effect whenever a
 *     buff is added.
 * 
 *   JS: On Expire Debuff:
 *   - JavaScript code for a global-wide custom effect whenever a
 *     debuff is added.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Passive State Settings
 * ============================================================================
 *
 * These Plugin Parameters adjust passive states that can affect all actors and
 * enemies as well as have global conditions.
 * 
 * ---
 * 
 * For those using the code "a.isStateAffected(10)" to check if a target is
 * affected by a state or not, this does NOT check passive states. This only
 * checks for states that were directly applied to the target.
 * 
 * Instead, use "a.states().includes($dataStates[10])" to check for them. This
 * code will search for both directly applied states and passive states alike.
 *
 * ---
 *
 * ---
 *
 * List
 * 
 *   Global Passives:
 *   - A list of passive states to affect actors and enemies.
 * 
 *   Actor-Only Passives:
 *   - A list of passive states to affect actors only.
 * 
 *   Enemy Passives:
 *   - A list of passive states to affect enemies only.
 *
 * ---
 *
 * Global JS Effects
 * 
 *   JS: Condition Check:
 *   - JavaScript code for a global-wide passive condition check.
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
 * - Yanfly
 * - Arisu
 * - Olivia
 * - Irina
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * 
 * Version 1.11: February 12, 2021
 * * Bug Fixes!
 * ** Added a check to prevent passive states from infinitely stacking. Fix
 *    made by Olivia.
 * 
 * Version 1.10: January 15, 2021
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Feature!
 * ** New Plugin Parameters added
 * *** Plugin Parameters > Skill Settings > Background Type
 * 
 * Version 1.09: January 1, 2021
 * * Bug Fixes!
 * ** Custom JS TP slip damage and healing should now work properly.
 *    Fix made by Yanfly.
 * 
 * Version 1.08: December 25, 2020
 * * Bug Fixes!
 * ** <JS On Add State> should no longer trigger multiple times for the death
 *    state. Fix made by Yanfly.
 * * Documentation Update!
 * ** Added documentation for updated feature(s)!
 * * Feature Update!
 * ** <No Death Clear> can now allow the affected state to be added to an
 *    already dead battler. Update made by Yanfly.
 * 
 * Version 1.07: December 18, 2020
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * New Features!
 * ** New notetags added by Yanfly:
 * *** <Passive Condition Multiclass: id>
 * *** <Passive Condition Multiclass: id, id, id>
 * *** <Passive Condition Multiclass: name>
 * *** <Passive Condition Multiclass: name, name, name>
 * ** New Plugin Parameter added by Yanfly.
 * *** Plugin Parameters > States > General > Action End Update
 * **** States with "Action End" auto-removal will also update turns at the end
 *      of each action instead of all actions.
 * ***** Turn this off if you wish for state turn updates to function like they
 *       do by default for "Action End".
 * 
 * Version 1.06: December 4, 2020
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.05: November 15, 2020
 * * Bug Fixes!
 * ** The alignment of the Skill Type Window is now fixed and will reflect upon
 *    the default settings. Fix made by Yanfly.
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * New Features!
 * ** <State x Category Remove: All> notetag added by Yanfly.
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.04: September 27, 2020
 * * Documentation Update
 * ** "Use Updated Layout" plugin parameters now have the added clause:
 *    "This will override the Core Engine windows settings." to reduce
 *    confusion. Added by Irina.
 * 
 * Version 1.03: September 13, 2020
 * * Bug Fixes!
 * ** <JS type Slip Damage> custom notetags now work for passive states. Fix
 *    made by Olivia.
 * ** Setting the Command Window style to "Text Only" will no longer add in
 *    the icon text codes. Bug fixed by Yanfly.
 * 
 * Version 1.02: August 30, 2020
 * * Bug Fixes!
 * ** The JS Notetags for Add, Erase, and Expire states are now fixed. Fix made
 *    by Yanfly.
 * * Documentation Update!
 * ** <Show if learned Skill: x> and <Hide if learned Skill: x> notetags have
 *    the following added to their descriptions:
 * *** This does not apply to skills added by traits on actors, classes, any
 *     equipment, or states. These are not considered learned skills. They are
 *     considered temporary skills.
 * * New Features!
 * ** Notetags added by Yanfly:
 * *** <Show if has Skill: x>
 * *** <Show if have All Skills: x,x,x>
 * *** <Show if have Any Skills: x,x,x>
 * *** <Show if has Skill: name>
 * *** <Show if have All Skills: name, name, name>
 * *** <Show if have Any Skills: name, name, name>
 * *** <Hide if has Skill: x>
 * *** <Hide if have All Skills: x,x,x>
 * *** <Hide if have Any Skills: x,x,x>
 * *** <Hide if has Skill: name>
 * *** <Hide if have All Skills: name, name, name>
 * *** <Hide if have Any Skills: name, name, name>
 * *** These have been added to remove the confusion regarding learned skills
 *     as skills added through trait effects are not considered learned skills
 *     by RPG Maker MZ.
 * 
 * Version 1.01: August 23, 2020
 * * Bug Fixes!
 * ** Passive states from Elements & Status Menu Core are now functional.
 *    Fix made by Olivia.
 * * Compatibility Update
 * ** Extended functions to allow for better compatibility.
 * * Updated documentation
 * ** Explains that passive states are not directly applied and are therefore
 *    not affected by code such as "a.isStateAffected(10)".
 * ** Instead, use "a.states().includes($dataStates[10])"
 * ** "Use #rrggbb for a hex color." lines now replaced with
 *    "For a hex color, use #rrggbb with VisuMZ_1_MessageCore"
 *
 * Version 1.00: August 20, 2020
 * * Finished Plugin!
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 *
 * @ ==========================================================================
 * @ Plugin Parameters
 * @ ==========================================================================
 *
 * @param BreakHead
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param SkillsStatesCore
 * @default Plugin Parameters
 *
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param Skills:struct
 * @text Skill Settings
 * @type struct<Skills>
 * @desc Adjust general skill settings here.
 * @default {"General":"","EnableLayout:eval":"true","LayoutStyle:str":"upper/left","SkillTypeWindow":"","CmdStyle:str":"auto","CmdTextAlign:str":"left","ListWindow":"","ListWindowCols:num":"1","ShopStatusWindow":"","ShowShopStatus:eval":"true","SkillSceneAdjustSkillList:eval":"true","SkillMenuStatusRect:func":"\"const ww = this.shopStatusWidth();\\nconst wh = this._itemWindow.height;\\nconst wx = Graphics.boxWidth - this.shopStatusWidth();\\nconst wy = this._itemWindow.y;\\nreturn new Rectangle(wx, wy, ww, wh);\"","SkillTypes":"","HiddenSkillTypes:arraynum":"[]","BattleHiddenSkillTypes:arraynum":"[]","IconStypeNorm:num":"78","IconStypeMagic:num":"79","CustomJS":"","SkillConditionJS:func":"\"// Declare Variables\\nconst skill = arguments[0];\\nconst user = this;\\nconst target = this;\\nconst a = this;\\nconst b = this;\\nlet enabled = true;\\n\\n// Perform Checks\\n\\n\\n// Return boolean\\nreturn enabled;\""}
 *
 * @param Costs:arraystruct
 * @text Skill Cost Types
 * @parent Skills:struct
 * @type struct<Cost>[]
 * @desc A list of all the skill cost types added by this plugin
 * and the code that controls them in-game.
 * @default ["{\"Name:str\":\"HP\",\"Settings\":\"\",\"Icon:num\":\"0\",\"FontColor:str\":\"20\",\"FontSize:num\":\"22\",\"Cost\":\"\",\"CalcJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nlet cost = 0;\\\\n\\\\n// Calculations\\\\nconst note = skill.note;\\\\nif (note.match(/<HP COST:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost += Number(RegExp.$1);\\\\n}\\\\nif (note.match(/<HP COST:[ ](\\\\\\\\d+)([%％])>/i)) {\\\\n    cost += Math.ceil(Number(RegExp.$1) * user.mhp / 100);\\\\n}\\\\nif (note.match(/<JS HP COST>\\\\\\\\s*([\\\\\\\\s\\\\\\\\S]*)\\\\\\\\s*<\\\\\\\\/JS HP COST>/i)) {\\\\n    const code = String(RegExp.$1);\\\\n    eval(code);\\\\n}\\\\n\\\\n// Apply Trait Cost Alterations\\\\nif (cost > 0) {\\\\n    const rateNote = /<HP COST:[ ](\\\\\\\\d+\\\\\\\\.?\\\\\\\\d*)([%％])>/i;\\\\n    const rates = user.traitObjects().map((obj) => (obj && obj.note.match(rateNote) ? Number(RegExp.$1) / 100 : 1));\\\\n    const flatNote = /<HP COST:[ ]([\\\\\\\\+\\\\\\\\-]\\\\\\\\d+)>/i;\\\\n    const flats = user.traitObjects().map((obj) => (obj && obj.note.match(flatNote) ? Number(RegExp.$1) : 0));\\\\n    cost = rates.reduce((r, rate) => r * rate, cost);\\\\n    cost = flats.reduce((r, flat) => r + flat, cost);\\\\n    cost = Math.max(1, cost);\\\\n}\\\\n\\\\n// Set Cost Limits\\\\nif (note.match(/<HP COST MAX:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.min(cost, Number(RegExp.$1));\\\\n}\\\\nif (note.match(/<HP COST MIN:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.max(cost, Number(RegExp.$1));\\\\n}\\\\n\\\\n// Return cost value\\\\nreturn Math.round(Math.max(0, cost));\\\"\",\"CanPayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nif (cost <= 0) {\\\\n    return true;\\\\n} else {\\\\n    return user._hp > cost;\\\\n}\\\"\",\"PayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Process Payment\\\\nuser._hp -= cost;\\\"\",\"Windows\":\"\",\"ShowJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nreturn cost > 0;\\\"\",\"TextJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\nconst settings = arguments[2];\\\\nconst fontSize = settings.FontSize;\\\\nconst color = settings.FontColor;\\\\nconst name = TextManager.hp;\\\\nconst icon = settings.Icon;\\\\nlet text = '';\\\\n\\\\n// Text: Change Font Size\\\\ntext += '\\\\\\\\\\\\\\\\FS[%1]'.format(fontSize);\\\\n\\\\n// Text: Add Color\\\\nif (color.match(/#(.*)/i) && Imported.VisuMZ_1_MessageCore) {\\\\n    text += '\\\\\\\\\\\\\\\\HexColor<%1>'.format(String(RegExp.$1));\\\\n} else {\\\\n    text += '\\\\\\\\\\\\\\\\C[%1]'.format(color);\\\\n}\\\\n\\\\n// Text: Add Cost\\\\ntext += '%1 %2'.format(cost, name);\\\\n\\\\n// Text: Add Icon\\\\nif (icon  > 0) {\\\\n    text += '\\\\\\\\\\\\\\\\I[%1]'.format(icon);\\\\n}\\\\n\\\\n// Return text\\\\nreturn text;\\\"\",\"Gauges\":\"\",\"GaugeMaxJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn user.mhp;\\\"\",\"GaugeCurrentJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn user.hp;\\\"\",\"GaugeDrawJS:func\":\"\\\"// Declare Variables\\\\nconst sprite = this;\\\\nconst settings = sprite._costSettings;\\\\nconst bitmap = sprite.bitmap;\\\\nconst user = sprite._battler;\\\\nconst currentValue = sprite.currentDisplayedValue();\\\\n\\\\n// Draw Gauge\\\\nconst color1 = ColorManager.hpGaugeColor1();\\\\nconst color2 = ColorManager.hpGaugeColor2();\\\\nconst gx = 0;\\\\nconst gy = sprite.bitmapHeight() - sprite.gaugeHeight();\\\\nconst gw = sprite.bitmapWidth() - gx;\\\\nconst gh = sprite.gaugeHeight();\\\\nthis.drawFullGauge(color1, color2, gx, gy, gw, gh);\\\\n\\\\n// Draw Label\\\\nconst label = TextManager.hpA;\\\\nconst lx = 4;\\\\nconst ly = 0;\\\\nconst lw = sprite.bitmapWidth();\\\\nconst lh = sprite.bitmapHeight();\\\\nsprite.setupLabelFont();\\\\nbitmap.paintOpacity = 255;\\\\nbitmap.drawText(label, lx, ly, lw, lh, \\\\\\\"left\\\\\\\");\\\\n\\\\n// Draw Value\\\\nconst vw = sprite.bitmapWidth() - 2;\\\\nconst vh = sprite.bitmapHeight();\\\\nsprite.setupValueFont();\\\\nbitmap.textColor = ColorManager.hpColor(user);\\\\nbitmap.drawText(currentValue, 0, 0, vw, vh, \\\\\\\"right\\\\\\\");\\\"\"}","{\"Name:str\":\"MP\",\"Settings\":\"\",\"Icon:num\":\"0\",\"FontColor:str\":\"23\",\"FontSize:num\":\"22\",\"Cost\":\"\",\"CalcJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nlet cost = 0;\\\\n\\\\n// Calculations\\\\nconst note = skill.note;\\\\ncost = Math.floor(skill.mpCost * user.mcr);\\\\nif (note.match(/<MP COST:[ ](\\\\\\\\d+)([%％])>/i)) {\\\\n    cost += Math.ceil(Number(RegExp.$1) * user.mmp / 100);\\\\n}\\\\nif (note.match(/<JS MP COST>\\\\\\\\s*([\\\\\\\\s\\\\\\\\S]*)\\\\\\\\s*<\\\\\\\\/JS MP COST>/i)) {\\\\n    const code = String(RegExp.$1);\\\\n    eval(code);\\\\n}\\\\n\\\\n// Apply Trait Cost Alterations\\\\nif (cost > 0) {\\\\n    const rateNote = /<MP COST:[ ](\\\\\\\\d+\\\\\\\\.?\\\\\\\\d*)([%％])>/i;\\\\n    const rates = user.traitObjects().map((obj) => (obj && obj.note.match(rateNote) ? Number(RegExp.$1) / 100 : 1));\\\\n    const flatNote = /<MP COST:[ ]([\\\\\\\\+\\\\\\\\-]\\\\\\\\d+)>/i;\\\\n    const flats = user.traitObjects().map((obj) => (obj && obj.note.match(flatNote) ? Number(RegExp.$1) : 0));\\\\n    cost = rates.reduce((r, rate) => r * rate, cost);\\\\n    cost = flats.reduce((r, flat) => r + flat, cost);\\\\n    cost = Math.max(1, cost);\\\\n}\\\\n\\\\n// Set Cost Limits\\\\nif (note.match(/<MP COST MAX:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.min(cost, Number(RegExp.$1));\\\\n}\\\\nif (note.match(/<MP COST MIN:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.max(cost, Number(RegExp.$1));\\\\n}\\\\n\\\\n// Return cost value\\\\nreturn Math.round(Math.max(0, cost));\\\"\",\"CanPayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nreturn user._mp >= cost;\\\"\",\"PayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Process Payment\\\\nuser._mp -= cost;\\\"\",\"Windows\":\"\",\"ShowJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nreturn cost > 0;\\\"\",\"TextJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\nconst settings = arguments[2];\\\\nconst fontSize = settings.FontSize;\\\\nconst color = settings.FontColor;\\\\nconst name = TextManager.mp;\\\\nconst icon = settings.Icon;\\\\nlet text = '';\\\\n\\\\n// Text: Change Font Size\\\\ntext += '\\\\\\\\\\\\\\\\FS[%1]'.format(fontSize);\\\\n\\\\n// Text: Add Color\\\\nif (color.match(/#(.*)/i) && Imported.VisuMZ_1_MessageCore) {\\\\n    text += '\\\\\\\\\\\\\\\\HexColor<#%1>'.format(String(RegExp.$1));\\\\n} else {\\\\n    text += '\\\\\\\\\\\\\\\\C[%1]'.format(color);\\\\n}\\\\n\\\\n// Text: Add Cost\\\\ntext += '%1 %2'.format(cost, name);\\\\n\\\\n// Text: Add Icon\\\\nif (icon  > 0) {\\\\n    text += '\\\\\\\\\\\\\\\\I[%1]'.format(icon);\\\\n}\\\\n\\\\n// Return text\\\\nreturn text;\\\"\",\"Gauges\":\"\",\"GaugeMaxJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn user.mmp;\\\"\",\"GaugeCurrentJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn user.mp;\\\"\",\"GaugeDrawJS:func\":\"\\\"// Declare Variables\\\\nconst sprite = this;\\\\nconst settings = sprite._costSettings;\\\\nconst bitmap = sprite.bitmap;\\\\nconst user = sprite._battler;\\\\nconst currentValue = sprite.currentDisplayedValue();\\\\n\\\\n// Draw Gauge\\\\nconst color1 = ColorManager.mpGaugeColor1();\\\\nconst color2 = ColorManager.mpGaugeColor2();\\\\nconst gx = 0;\\\\nconst gy = sprite.bitmapHeight() - sprite.gaugeHeight();\\\\nconst gw = sprite.bitmapWidth() - gx;\\\\nconst gh = sprite.gaugeHeight();\\\\nthis.drawFullGauge(color1, color2, gx, gy, gw, gh);\\\\n\\\\n// Draw Label\\\\nconst label = TextManager.mpA;\\\\nconst lx = 4;\\\\nconst ly = 0;\\\\nconst lw = sprite.bitmapWidth();\\\\nconst lh = sprite.bitmapHeight();\\\\nsprite.setupLabelFont();\\\\nbitmap.paintOpacity = 255;\\\\nbitmap.drawText(label, lx, ly, lw, lh, \\\\\\\"left\\\\\\\");\\\\n\\\\n// Draw Value\\\\nconst vw = sprite.bitmapWidth() - 2;\\\\nconst vh = sprite.bitmapHeight();\\\\nsprite.setupValueFont();\\\\nbitmap.textColor = ColorManager.mpColor(user);\\\\nbitmap.drawText(currentValue, 0, 0, vw, vh, \\\\\\\"right\\\\\\\");\\\"\"}","{\"Name:str\":\"TP\",\"Settings\":\"\",\"Icon:num\":\"0\",\"FontColor:str\":\"29\",\"FontSize:num\":\"22\",\"Cost\":\"\",\"CalcJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nlet cost = 0;\\\\n\\\\n// Calculations\\\\nconst note = skill.note;\\\\ncost = skill.tpCost;\\\\nif (note.match(/<TP COST:[ ](\\\\\\\\d+)([%％])>/i)) {\\\\n    cost += Math.ceil(Number(RegExp.$1) * user.maxTp() / 100);\\\\n}\\\\nif (note.match(/<JS TP COST>\\\\\\\\s*([\\\\\\\\s\\\\\\\\S]*)\\\\\\\\s*<\\\\\\\\/JS TP COST>/i)) {\\\\n    const code = String(RegExp.$1);\\\\n    eval(code);\\\\n}\\\\n\\\\n// Apply Trait Cost Alterations\\\\nif (cost > 0) {\\\\n    const rateNote = /<TP COST:[ ](\\\\\\\\d+\\\\\\\\.?\\\\\\\\d*)([%％])>/i;\\\\n    const rates = user.traitObjects().map((obj) => (obj && obj.note.match(rateNote) ? Number(RegExp.$1) / 100 : 1));\\\\n    const flatNote = /<TP COST:[ ]([\\\\\\\\+\\\\\\\\-]\\\\\\\\d+)>/i;\\\\n    const flats = user.traitObjects().map((obj) => (obj && obj.note.match(flatNote) ? Number(RegExp.$1) : 0));\\\\n    cost = rates.reduce((r, rate) => r * rate, cost);\\\\n    cost = flats.reduce((r, flat) => r + flat, cost);\\\\n    cost = Math.max(1, cost);\\\\n}\\\\n\\\\n// Set Cost Limits\\\\nif (note.match(/<TP COST MAX:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.min(cost, Number(RegExp.$1));\\\\n}\\\\nif (note.match(/<TP COST MIN:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.max(cost, Number(RegExp.$1));\\\\n}\\\\n\\\\n// Return cost value\\\\nreturn Math.round(Math.max(0, cost));\\\"\",\"CanPayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nreturn user._tp >= cost;\\\"\",\"PayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Process Payment\\\\nuser._tp -= cost;\\\"\",\"Windows\":\"\",\"ShowJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nreturn cost > 0;\\\"\",\"TextJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\nconst settings = arguments[2];\\\\nconst fontSize = settings.FontSize;\\\\nconst color = settings.FontColor;\\\\nconst name = TextManager.tp;\\\\nconst icon = settings.Icon;\\\\nlet text = '';\\\\n\\\\n// Text: Change Font Size\\\\ntext += '\\\\\\\\\\\\\\\\FS[%1]'.format(fontSize);\\\\n\\\\n// Text: Add Color\\\\nif (color.match(/#(.*)/i) && Imported.VisuMZ_1_MessageCore) {\\\\n    text += '\\\\\\\\\\\\\\\\HexColor<#%1>'.format(String(RegExp.$1));\\\\n} else {\\\\n    text += '\\\\\\\\\\\\\\\\C[%1]'.format(color);\\\\n}\\\\n\\\\n// Text: Add Cost\\\\ntext += '%1 %2'.format(cost, name);\\\\n\\\\n// Text: Add Icon\\\\nif (icon  > 0) {\\\\n    text += '\\\\\\\\\\\\\\\\I[%1]'.format(icon);\\\\n}\\\\n\\\\n// Return text\\\\nreturn text;\\\"\",\"Gauges\":\"\",\"GaugeMaxJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn user.maxTp();\\\"\",\"GaugeCurrentJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn user.tp;\\\"\",\"GaugeDrawJS:func\":\"\\\"// Declare Variables\\\\nconst sprite = this;\\\\nconst settings = sprite._costSettings;\\\\nconst bitmap = sprite.bitmap;\\\\nconst user = sprite._battler;\\\\nconst currentValue = sprite.currentDisplayedValue();\\\\n\\\\n// Draw Gauge\\\\nconst color1 = ColorManager.tpGaugeColor1();\\\\nconst color2 = ColorManager.tpGaugeColor2();\\\\nconst gx = 0;\\\\nconst gy = sprite.bitmapHeight() - sprite.gaugeHeight();\\\\nconst gw = sprite.bitmapWidth() - gx;\\\\nconst gh = sprite.gaugeHeight();\\\\nthis.drawFullGauge(color1, color2, gx, gy, gw, gh);\\\\n\\\\n// Draw Label\\\\nconst label = TextManager.tpA;\\\\nconst lx = 4;\\\\nconst ly = 0;\\\\nconst lw = sprite.bitmapWidth();\\\\nconst lh = sprite.bitmapHeight();\\\\nsprite.setupLabelFont();\\\\nbitmap.paintOpacity = 255;\\\\nbitmap.drawText(label, lx, ly, lw, lh, \\\\\\\"left\\\\\\\");\\\\n\\\\n// Draw Value\\\\nconst vw = sprite.bitmapWidth() - 2;\\\\nconst vh = sprite.bitmapHeight();\\\\nsprite.setupValueFont();\\\\nbitmap.textColor = ColorManager.tpColor(user);\\\\nbitmap.drawText(currentValue, 0, 0, vw, vh, \\\\\\\"right\\\\\\\");\\\"\"}","{\"Name:str\":\"Gold\",\"Settings\":\"\",\"Icon:num\":\"0\",\"FontColor:str\":\"17\",\"FontSize:num\":\"22\",\"Cost\":\"\",\"CalcJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nlet cost = 0;\\\\n\\\\n// Calculations\\\\nconst note = skill.note;\\\\nif (note.match(/<GOLD COST:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost += Number(RegExp.$1);\\\\n}\\\\nif (note.match(/<GOLD COST:[ ](\\\\\\\\d+)([%％])>/i)) {\\\\n    cost += Math.ceil(Number(RegExp.$1) * $gameParty.gold() / 100);\\\\n}\\\\nif (note.match(/<JS GOLD COST>\\\\\\\\s*([\\\\\\\\s\\\\\\\\S]*)\\\\\\\\s*<\\\\\\\\/JS GOLD COST>/i)) {\\\\n    const code = String(RegExp.$1);\\\\n    eval(code);\\\\n}\\\\n\\\\n// Apply Trait Cost Alterations\\\\nif (cost > 0) {\\\\n    const rateNote = /<GOLD COST:[ ](\\\\\\\\d+\\\\\\\\.?\\\\\\\\d*)([%％])>/i;\\\\n    const rates = user.traitObjects().map((obj) => (obj && obj.note.match(rateNote) ? Number(RegExp.$1) / 100 : 1));\\\\n    const flatNote = /<GOLD COST:[ ]([\\\\\\\\+\\\\\\\\-]\\\\\\\\d+)>/i;\\\\n    const flats = user.traitObjects().map((obj) => (obj && obj.note.match(flatNote) ? Number(RegExp.$1) : 0));\\\\n    cost = rates.reduce((r, rate) => r * rate, cost);\\\\n    cost = flats.reduce((r, flat) => r + flat, cost);\\\\n    cost = Math.max(1, cost);\\\\n}\\\\n\\\\n// Set Cost Limits\\\\nif (note.match(/<GOLD COST MAX:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.min(cost, Number(RegExp.$1));\\\\n}\\\\nif (note.match(/<GOLD COST MIN:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.max(cost, Number(RegExp.$1));\\\\n}\\\\n\\\\n// Return cost value\\\\nreturn Math.round(Math.max(0, cost));\\\"\",\"CanPayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nreturn $gameParty.gold() >= cost;\\\"\",\"PayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Process Payment\\\\n$gameParty.loseGold(cost);\\\"\",\"Windows\":\"\",\"ShowJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nreturn cost > 0;\\\"\",\"TextJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\nconst settings = arguments[2];\\\\nconst fontSize = settings.FontSize;\\\\nconst color = settings.FontColor;\\\\nconst name = TextManager.currencyUnit;\\\\nconst icon = settings.Icon;\\\\nlet text = '';\\\\n\\\\n// Text: Change Font Size\\\\ntext += '\\\\\\\\\\\\\\\\FS[%1]'.format(fontSize);\\\\n\\\\n// Text: Add Color\\\\nif (color.match(/#(.*)/i) && Imported.VisuMZ_1_MessageCore) {\\\\n    text += '\\\\\\\\\\\\\\\\HexColor<#%1>'.format(String(RegExp.$1));\\\\n} else {\\\\n    text += '\\\\\\\\\\\\\\\\C[%1]'.format(color);\\\\n}\\\\n\\\\n// Text: Add Cost\\\\ntext += '%1 %2'.format(cost, name);\\\\n\\\\n// Text: Add Icon\\\\nif (icon  > 0) {\\\\n    text += '\\\\\\\\\\\\\\\\I[%1]'.format(icon);\\\\n}\\\\n\\\\n// Return text\\\\nreturn text;\\\"\",\"Gauges\":\"\",\"GaugeMaxJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn $gameParty.maxGold();\\\"\",\"GaugeCurrentJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\n\\\\n// Return value\\\\nreturn $gameParty.gold();\\\"\",\"GaugeDrawJS:func\":\"\\\"// Declare Variables\\\\nconst sprite = this;\\\\nconst settings = sprite._costSettings;\\\\nconst bitmap = sprite.bitmap;\\\\nconst user = sprite._battler;\\\\nconst currentValue = sprite.currentDisplayedValue();\\\\n\\\\n// Draw Label\\\\nconst label = TextManager.currencyUnit;\\\\nconst lx = 4;\\\\nconst ly = 0;\\\\nconst lw = sprite.bitmapWidth();\\\\nconst lh = sprite.bitmapHeight();\\\\nsprite.setupLabelFont();\\\\nbitmap.paintOpacity = 255;\\\\nbitmap.drawText(label, lx, ly, lw, lh, \\\\\\\"left\\\\\\\");\\\\n\\\\n// Draw Value\\\\nconst vw = sprite.bitmapWidth() - 2;\\\\nconst vh = sprite.bitmapHeight();\\\\nsprite.setupValueFont();\\\\nbitmap.textColor = ColorManager.normalColor();\\\\nbitmap.drawText(currentValue, 0, 0, vw, vh, \\\\\\\"right\\\\\\\");\\\"\"}","{\"Name:str\":\"Potion\",\"Settings\":\"\",\"Icon:num\":\"176\",\"FontColor:str\":\"0\",\"FontSize:num\":\"22\",\"Cost\":\"\",\"CalcJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nlet cost = 0;\\\\n\\\\n// Calculations\\\\nconst note = skill.note;\\\\nif (note.match(/<POTION COST:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost += Number(RegExp.$1);\\\\n}\\\\nif (note.match(/<JS POTION COST>\\\\\\\\s*([\\\\\\\\s\\\\\\\\S]*)\\\\\\\\s*<\\\\\\\\/JS POTION COST>/i)) {\\\\n    const code = String(RegExp.$1);\\\\n    eval(code);\\\\n}\\\\n\\\\n// Apply Trait Cost Alterations\\\\nif (cost > 0) {\\\\n    const rateNote = /<POTION COST:[ ](\\\\\\\\d+\\\\\\\\.?\\\\\\\\d*)([%％])>/i;\\\\n    const rates = user.traitObjects().map((obj) => (obj && obj.note.match(rateNote) ? Number(RegExp.$1) / 100 : 1));\\\\n    const flatNote = /<POTION COST:[ ]([\\\\\\\\+\\\\\\\\-]\\\\\\\\d+)>/i;\\\\n    const flats = user.traitObjects().map((obj) => (obj && obj.note.match(flatNote) ? Number(RegExp.$1) : 0));\\\\n    cost = rates.reduce((r, rate) => r * rate, cost);\\\\n    cost = flats.reduce((r, flat) => r + flat, cost);\\\\n    cost = Math.max(1, cost);\\\\n}\\\\n\\\\n// Set Cost Limits\\\\nif (note.match(/<POTION COST MAX:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.min(cost, Number(RegExp.$1));\\\\n}\\\\nif (note.match(/<POTION COST MIN:[ ](\\\\\\\\d+)>/i)) {\\\\n    cost = Math.max(cost, Number(RegExp.$1));\\\\n}\\\\n\\\\n// Return cost value\\\\nreturn Math.round(Math.max(0, cost));\\\"\",\"CanPayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\nconst item = $dataItems[7];\\\\n\\\\n// Return Boolean\\\\nif (user.isActor() && cost > 0) {\\\\n    return $gameParty.numItems(item) >= cost;\\\\n} else {\\\\n    return true;\\\\n}\\\"\",\"PayJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\nconst item = $dataItems[7];\\\\n\\\\n// Process Payment\\\\nif (user.isActor()) {\\\\n    $gameParty.loseItem(item, cost);\\\\n}\\\"\",\"Windows\":\"\",\"ShowJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\n\\\\n// Return Boolean\\\\nreturn cost > 0;\\\"\",\"TextJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst item = $dataItems[7];\\\\nconst skill = arguments[0];\\\\nconst cost = arguments[1];\\\\nconst settings = arguments[2];\\\\nconst fontSize = settings.FontSize;\\\\nconst color = settings.FontColor;\\\\nconst name = settings.Name;\\\\nconst icon = settings.Icon;\\\\nlet text = '';\\\\n\\\\n// Text: Change Font Size\\\\ntext += '\\\\\\\\\\\\\\\\FS[%1]'.format(fontSize);\\\\n\\\\n// Text: Add Color\\\\nif (color.match(/#(.*)/i) && Imported.VisuMZ_1_MessageCore) {\\\\n    text += '\\\\\\\\\\\\\\\\HexColor<#%1>'.format(String(RegExp.$1));\\\\n} else {\\\\n    text += '\\\\\\\\\\\\\\\\C[%1]'.format(color);\\\\n}\\\\n\\\\n// Text: Add Cost\\\\ntext += '×%1'.format(cost);\\\\n\\\\n// Text: Add Icon\\\\ntext += '\\\\\\\\\\\\\\\\I[%1]'.format(item.iconIndex);\\\\n\\\\n// Return text\\\\nreturn text;\\\"\",\"Gauges\":\"\",\"GaugeMaxJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst item = $dataItems[7];\\\\n\\\\n// Return value\\\\nreturn $gameParty.maxItems(item);\\\"\",\"GaugeCurrentJS:func\":\"\\\"// Declare Variables\\\\nconst user = this;\\\\nconst item = $dataItems[7];\\\\n\\\\n// Return value\\\\nreturn $gameParty.numItems(item);\\\"\",\"GaugeDrawJS:func\":\"\\\"// Declare Variables\\\\nconst sprite = this;\\\\nconst settings = sprite._costSettings;\\\\nconst bitmap = sprite.bitmap;\\\\nconst user = sprite._battler;\\\\nconst item = $dataItems[7];\\\\nconst currentValue = sprite.currentDisplayedValue();\\\\n\\\\n// Draw Gauge\\\\nconst color1 = ColorManager.textColor(30);\\\\nconst color2 = ColorManager.textColor(31);\\\\nconst gx = 0;\\\\nconst gy = sprite.bitmapHeight() - sprite.gaugeHeight();\\\\nconst gw = sprite.bitmapWidth() - gx;\\\\nconst gh = sprite.gaugeHeight();\\\\nthis.drawFullGauge(color1, color2, gx, gy, gw, gh);\\\\n\\\\n// Draw Icon\\\\nconst iconIndex = item.iconIndex;\\\\nconst iconBitmap = ImageManager.loadSystem(\\\\\\\"IconSet\\\\\\\");\\\\nconst pw = ImageManager.iconWidth;\\\\nconst ph = ImageManager.iconHeight;\\\\nconst sx = (iconIndex % 16) * pw;\\\\nconst sy = Math.floor(iconIndex / 16) * ph;\\\\nbitmap.blt(iconBitmap, sx, sy, pw, ph, 0, 0, 24, 24);\\\\n\\\\n// Draw Value\\\\nconst vw = sprite.bitmapWidth() - 2;\\\\nconst vh = sprite.bitmapHeight();\\\\nsprite.setupValueFont();\\\\nbitmap.textColor = ColorManager.normalColor();\\\\nbitmap.drawText(currentValue, 0, 0, vw, vh, \\\\\\\"right\\\\\\\");\\\"\"}"]
 *
 * @param BreakSkills
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param States:struct
 * @text State Settings
 * @type struct<States>
 * @desc Adjust general state settings here.
 * @default {"General":"","ReapplyRules:str":"greater","MaxTurns:num":"99","ActionEndUpdate:eval":"true","Turns":"","ShowTurns:eval":"true","TurnFontSize:num":"16","TurnOffsetX:num":"-4","TurnOffsetY:num":"-6","ColorNeutral:str":"0","ColorPositive:str":"24","ColorNegative:str":"27","Data":"","ShowData:eval":"true","DataFontSize:num":"12","DataOffsetX:num":"0","DataOffsetY:num":"8","CustomJS":"","onAddStateJS:func":"\"// Declare Variables\\nconst stateId = arguments[0];\\nconst origin = this.getStateOrigin(stateId);\\nconst state = $dataStates[stateId];\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\"","onEraseStateJS:func":"\"// Declare Variables\\nconst stateId = arguments[0];\\nconst origin = this.getStateOrigin(stateId);\\nconst state = $dataStates[stateId];\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\\n\"","onExpireStateJS:func":"\"// Declare Variables\\nconst stateId = arguments[0];\\nconst origin = this.getStateOrigin(stateId);\\nconst state = $dataStates[stateId];\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\\n\""}
 *
 * @param Buffs:struct
 * @text Buff/Debuff Settings
 * @parent States:struct
 * @type struct<Buffs>
 * @desc Adjust general buff/debuff settings here.
 * @default {"General":"","ReapplyRules:str":"greater","MaxTurns:num":"99","Stacking":"","StackBuffMax:num":"2","StackDebuffMax:num":"2","MultiplierJS:func":"\"// Declare Variables\\nconst user = this;\\nconst paramId = arguments[0];\\nconst buffLevel = arguments[1];\\nlet rate = 1;\\n\\n// Perform Calculations\\nrate += buffLevel * 0.25;\\n\\n// Return Rate\\nreturn Math.max(0, rate);\"","Turns":"","ShowTurns:eval":"true","TurnFontSize:num":"16","TurnOffsetX:num":"-4","TurnOffsetY:num":"-6","ColorBuff:str":"24","ColorDebuff:str":"27","Data":"","ShowData:eval":"false","DataFontSize:num":"12","DataOffsetX:num":"0","DataOffsetY:num":"8","CustomJS":"","onAddBuffJS:func":"\"// Declare Variables\\nconst paramId = arguments[0];\\nconst modifier = this._buffs[paramId];\\nconst origin = this.getCurrentStateActiveUser();\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\\n\"","onAddDebuffJS:func":"\"// Declare Variables\\nconst paramId = arguments[0];\\nconst modifier = this._buffs[paramId];\\nconst origin = this.getCurrentStateActiveUser();\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\\n\"","onEraseBuffJS:func":"\"// Declare Variables\\nconst paramId = arguments[0];\\nconst modifier = this._buffs[paramId];\\nconst origin = this.getCurrentStateActiveUser();\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\\n\"","onEraseDebuffJS:func":"\"// Declare Variables\\nconst paramId = arguments[0];\\nconst modifier = this._buffs[paramId];\\nconst origin = this.getCurrentStateActiveUser();\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\\n\"","onExpireBuffJS:func":"\"// Declare Variables\\nconst paramId = arguments[0];\\nconst modifier = this._buffs[paramId];\\nconst origin = this.getCurrentStateActiveUser();\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\\n\"","onExpireDebuffJS:func":"\"// Declare Variables\\nconst paramId = arguments[0];\\nconst modifier = this._buffs[paramId];\\nconst origin = this.getCurrentStateActiveUser();\\nconst user = this.getCurrentStateActiveUser();\\nconst target = this;\\nconst a = origin;\\nconst b = this;\\n\\n// Perform Actions\\n\""}
 *
 * @param PassiveStates:struct
 * @text Passive States
 * @parent States:struct
 * @type struct<PassiveStates>
 * @desc Adjust passive state settings here.
 * @default {"List":"","Global:arraynum":"[]","Actor:arraynum":"[]","Enemy:arraynum":"[]","CustomJS":"","PassiveConditionJS:func":"\"// Declare Variables\\nconst state = arguments[0];\\nconst stateId = state.id;\\nconst user = this;\\nconst target = this;\\nconst a = this;\\nconst b = this;\\nlet condition = true;\\n\\n// Perform Checks\\n\\n\\n// Return boolean\\nreturn condition;\""}
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
 * General Skill Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Skills:
 *
 * @param General
 *
 * @param EnableLayout:eval
 * @text Use Updated Layout
 * @parent General
 * @type boolean
 * @on Use
 * @off Don't Use
 * @desc Use the Updated Skill Menu Layout provided by this plugin?
 * This will override the Core Engine windows settings.
 * @default true
 *
 * @param LayoutStyle:str
 * @text Layout Style
 * @parent General
 * @type select
 * @option Upper Help, Left Input
 * @value upper/left
 * @option Upper Help, Right Input
 * @value upper/right
 * @option Lower Help, Left Input
 * @value lower/left
 * @option Lower Help, Right Input
 * @value lower/right
 * @desc If using an updated layout, how do you want to style
 * the menu scene layout?
 * @default upper/left
 *
 * @param SkillTypeWindow
 * @text Skill Type Window
 *
 * @param CmdStyle:str
 * @text Style
 * @parent SkillTypeWindow
 * @type select
 * @option Text Only
 * @value text
 * @option Icon Only
 * @value icon
 * @option Icon + Text
 * @value iconText
 * @option Automatic
 * @value auto
 * @desc How do you wish to draw commands in the Skill Type Window?
 * @default auto
 *
 * @param CmdTextAlign:str
 * @text Text Align
 * @parent SkillTypeWindow
 * @type combo
 * @option left
 * @option center
 * @option right
 * @desc Text alignment for the Skill Type Window.
 * @default left
 *
 * @param ListWindow
 * @text List Window
 *
 * @param ListWindowCols:num
 * @text Columns
 * @parent ListWindow
 * @type number
 * @min 1
 * @desc Number of maximum columns.
 * @default 1
 *
 * @param ShopStatusWindow
 * @text Shop Status Window
 *
 * @param ShowShopStatus:eval
 * @text Show in Skill Menu?
 * @parent ShopStatusWindow
 * @type boolean
 * @on Show
 * @off Don't Show
 * @desc Show the Shop Status Window in the Skill Menu?
 * This is enabled if the Updated Layout is on.
 * @default true
 *
 * @param SkillSceneAdjustSkillList:eval
 * @text Adjust List Window?
 * @parent ShopStatusWindow
 * @type boolean
 * @on Adjust
 * @off Don't
 * @desc Automatically adjust the Skill List Window in the Skill Menu if using the Shop Status Window?
 * @default true
 *
 * @param SkillSceneStatusBgType:num
 * @text Background Type
 * @parent ShopStatusWindow
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
 * @param SkillMenuStatusRect:func
 * @text JS: X, Y, W, H
 * @parent ShopStatusWindow
 * @type note
 * @desc Code used to determine the dimensions for this Shop Status Window in the Skill Menu.
 * @default "const ww = this.shopStatusWidth();\nconst wh = this._itemWindow.height;\nconst wx = Graphics.boxWidth - this.shopStatusWidth();\nconst wy = this._itemWindow.y;\nreturn new Rectangle(wx, wy, ww, wh);"
 *
 * @param SkillTypes
 * @text Skill Types
 *
 * @param HiddenSkillTypes:arraynum
 * @text Hidden Skill Types
 * @parent SkillTypes
 * @type number[]
 * @min 1
 * @max 99
 * @desc Insert the ID's of the Skill Types you want hidden from view ingame.
 * @default []
 *
 * @param BattleHiddenSkillTypes:arraynum
 * @text Hidden During Battle
 * @parent SkillTypes
 * @type number[]
 * @min 1
 * @max 99
 * @desc Insert the ID's of the Skill Types you want hidden during battle only.
 * @default []
 *
 * @param IconStypeNorm:num
 * @text Icon: Normal Type
 * @parent SkillTypes
 * @desc Icon used for normal skill types that aren't assigned any icons.
 * @default 78
 *
 * @param IconStypeMagic:num
 * @text Icon: Magic Type
 * @parent SkillTypes
 * @desc Icon used for magic skill types that aren't assigned any icons.
 * @default 79
 *
 * @param CustomJS
 * @text Global JS Effects
 *
 * @param SkillConditionJS:func
 * @text JS: Skill Conditions
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide skill condition check.
 * @default "// Declare Variables\nconst skill = arguments[0];\nconst user = this;\nconst target = this;\nconst a = this;\nconst b = this;\nlet enabled = true;\n\n// Perform Checks\n\n\n// Return boolean\nreturn enabled;"
 *
 */
/* ----------------------------------------------------------------------------
 * Skill Cost Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Cost:
 *
 * @param Name:str
 * @text Name
 * @desc A name for this Skill Cost Type.
 * @default Untitled
 *
 * @param Settings
 *
 * @param Icon:num
 * @text Icon
 * @parent Settings
 * @desc Icon used for this Skill Cost Type.
 * Use 0 for no icon.
 * @default 0
 *
 * @param FontColor:str
 * @text Font Color
 * @parent Settings
 * @desc Text Color used to display this cost.
 * For a hex color, use #rrggbb with VisuMZ_1_MessageCore
 * @default 0
 *
 * @param FontSize:num
 * @text Font Size
 * @parent Settings
 * @type number
 * @min 1
 * @desc Font size used to display this cost.
 * @default 22
 *
 * @param Cost
 * @text Cost Processing
 *
 * @param CalcJS:func
 * @text JS: Cost Calculation
 * @parent Cost
 * @type note
 * @desc Code on how to calculate this resource cost for the skill.
 * @default "// Declare Variables\nconst user = this;\nconst skill = arguments[0];\nlet cost = 0;\n\n// Return cost value\nreturn Math.round(Math.max(0, cost));"
 *
 * @param CanPayJS:func
 * @text JS: Can Pay Cost?
 * @parent Cost
 * @type note
 * @desc Code on calculating whether or not the user is able to pay the cost.
 * @default "// Declare Variables\nconst user = this;\nconst skill = arguments[0];\nconst cost = arguments[1];\n\n// Return Boolean\nreturn true;"
 *
 * @param PayJS:func
 * @text JS: Paying Cost
 * @parent Cost
 * @type note
 * @desc Code for if met, this is the actual process of paying of the cost.
 * @default "// Declare Variables\nconst user = this;\nconst skill = arguments[0];\nconst cost = arguments[1];\n\n// Process Payment\n"
 *
 * @param Windows
 * @text Window Display
 *
 * @param ShowJS:func
 * @text JS: Show Cost?
 * @parent  Windows
 * @type note
 * @desc Code for determining if the cost is shown or not.
 * @default "// Declare Variables\nconst user = this;\nconst skill = arguments[0];\nconst cost = arguments[1];\n\n// Return Boolean\nreturn cost > 0;"
 *
 * @param TextJS:func
 * @text JS: Cost Text
 * @parent  Windows
 * @type note
 * @desc Code to determine the text (with Text Code support) used for the displayed cost.
 * @default "// Declare Variables\nconst user = this;\nconst skill = arguments[0];\nconst cost = arguments[1];\nconst settings = arguments[2];\nconst fontSize = settings.FontSize;\nconst color = settings.FontColor;\nconst name = settings.Name;\nconst icon = settings.Icon;\nlet text = '';\n\n// Text: Change Font Size\ntext += '\\\\FS[%1]'.format(fontSize);\n\n// Text: Add Color\nif (color.match(/#(.*)/i) && Imported.VisuMZ_1_MessageCore) {\n    text += '\\\\HexColor<#%1>'.format(String(RegExp.$1));\n} else {\n    text += '\\\\C[%1]'.format(color);\n}\n\n// Text: Add Cost\ntext += '%1 %2'.format(cost, name);\n\n// Text: Add Icon\nif (icon  > 0) {\n    text += '\\\\I[%1]'.format(icon);\n}\n\n// Return text\nreturn text;"
 *
 * @param Gauges
 * @text Gauge Display
 *
 * @param GaugeMaxJS:func
 * @text JS: Maximum Value
 * @parent  Gauges
 * @type note
 * @desc Code to determine the maximum value used for this Skill Cost resource for gauges.
 * @default "// Declare Variables\nconst user = this;\n\n// Return value\nreturn 0;"
 *
 * @param GaugeCurrentJS:func
 * @text JS: Current Value
 * @parent  Gauges
 * @type note
 * @desc Code to determine the current value used for this Skill Cost resource for gauges.
 * @default "// Declare Variables\nconst user = this;\n\n// Return value\nreturn 0;"
 *
 * @param GaugeDrawJS:func
 * @text JS: Draw Gauge
 * @parent  Gauges
 * @type note
 * @desc Code to determine how to draw the Skill Cost resource for this gauge type.
 * @default "// Declare Variables\nconst sprite = this;\nconst settings = sprite._costSettings;\nconst bitmap = sprite.bitmap;\nconst user = sprite._battler;\nconst currentValue = sprite.currentDisplayedValue();\n\n// Draw Gauge\nconst color1 = ColorManager.textColor(30);\nconst color2 = ColorManager.textColor(31);\nconst gx = 0;\nconst gy = sprite.bitmapHeight() - sprite.gaugeHeight();\nconst gw = sprite.bitmapWidth() - gx;\nconst gh = sprite.gaugeHeight();\nthis.drawFullGauge(color1, color2, gx, gy, gw, gh);\n\n// Draw Label\nconst label = settings.Name;\nconst lx = 4;\nconst ly = 0;\nconst lw = sprite.bitmapWidth();\nconst lh = sprite.bitmapHeight();\nsprite.setupLabelFont();\nbitmap.paintOpacity = 255;\nbitmap.drawText(label, lx, ly, lw, lh, \"left\");\n\n// Draw Value\nconst vw = sprite.bitmapWidth() - 2;\nconst vh = sprite.bitmapHeight();\nsprite.setupValueFont();\nbitmap.textColor = ColorManager.normalColor();\nbitmap.drawText(currentValue, 0, 0, vw, vh, \"right\");"
 *
 */
/* ----------------------------------------------------------------------------
 * General State Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~States:
 *
 * @param General
 *
 * @param ReapplyRules:str
 * @text Reapply Rules
 * @parent General
 * @type select
 * @option Ignore: State doesn't get added.
 * @value ignore
 * @option Reset: Turns get reset.
 * @value reset
 * @option Greater: Turns take greater value (current vs reset).
 * @value greater
 * @option Add: Turns add upon existing turns.
 * @value add
 * @desc These are the rules when reapplying states.
 * @default greater
 *
 * @param MaxTurns:num
 * @text Maximum Turns
 * @parent General
 * @type number
 * @min 1
 * @desc Maximum number of turns to let states go up to.
 * This can be changed with the <Max Turns: x> notetag.
 * @default 9999
 *
 * @param ActionEndUpdate:eval
 * @text Action End Update
 * @parent General
 * @type boolean
 * @on Update Each Action
 * @off Don't Change
 * @desc States with "Action End" auto-removal will also update
 * turns at the end of each action instead of all actions.
 * @default true
 *
 * @param Turns
 * @text Turn Display
 *
 * @param ShowTurns:eval
 * @text Show Turns?
 * @parent Turns
 * @type boolean
 * @on Display
 * @off Hide
 * @desc Display state turns on top of window icons and sprites?
 * @default true
 *
 * @param TurnFontSize:num
 * @text Turn Font Size
 * @parent Turns
 * @type number
 * @min 1
 * @desc Font size used for displaying turns.
 * @default 16
 *
 * @param TurnOffsetX:num
 * @text Offset X
 * @parent Turns
 * @desc Offset the X position of the turn display.
 * @default -4
 *
 * @param TurnOffsetY:num
 * @text Offset Y
 * @parent Turns
 * @desc Offset the Y position of the turn display.
 * @default -6
 *
 * @param TurnFontSize:num
 * @text Turn Font Size
 * @parent Turns
 * @desc Font size used for displaying turns.
 * @default 16
 *
 * @param ColorNeutral:str
 * @text Turn Color: Neutral
 * @parent Turns
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 0
 *
 * @param ColorPositive:str
 * @text Turn Color: Positive
 * @parent Turns
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 24
 *
 * @param ColorNegative:str
 * @text Turn Color: Negative
 * @parent Turns
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 27
 *
 * @param Data
 * @text Data Display
 *
 * @param ShowData:eval
 * @text Show Data?
 * @parent Data
 * @type boolean
 * @on Display
 * @off Hide
 * @desc Display state data on top of window icons and sprites?
 * @default true
 *
 * @param DataFontSize:num
 * @text Data Font Size
 * @parent Data
 * @type number
 * @min 1
 * @desc Font size used for displaying state data.
 * @default 12
 *
 * @param DataOffsetX:num
 * @text Offset X
 * @parent Data
 * @desc Offset the X position of the state data display.
 * @default 0
 *
 * @param DataOffsetY:num
 * @text Offset Y
 * @parent Data
 * @desc Offset the Y position of the state data display.
 * @default 8
 *
 * @param CustomJS
 * @text Global JS Effects
 *
 * @param onAddStateJS:func
 * @text JS: On Add State
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * state is added.
 * @default "// Declare Variables\nconst stateId = arguments[0];\nconst origin = this.getStateOrigin(stateId);\nconst state = $dataStates[stateId];\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 * @param onEraseStateJS:func
 * @text JS: On Erase State
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * state is erased.
 * @default "// Declare Variables\nconst stateId = arguments[0];\nconst origin = this.getStateOrigin(stateId);\nconst state = $dataStates[stateId];\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 * @param onExpireStateJS:func
 * @text JS: On Expire State
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * state has expired.
 * @default "// Declare Variables\nconst stateId = arguments[0];\nconst origin = this.getStateOrigin(stateId);\nconst state = $dataStates[stateId];\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 */
/* ----------------------------------------------------------------------------
 * General Buff/Debuff Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Buffs:
 *
 * @param General
 *
 * @param ReapplyRules:str
 * @text Reapply Rules
 * @parent General
 * @type select
 * @option Ignore: Buff/Debuff doesn't get added.
 * @value ignore
 * @option Reset: Turns get reset.
 * @value reset
 * @option Greater: Turns take greater value (current vs reset).
 * @value greater
 * @option Add: Turns add upon existing turns.
 * @value add
 * @desc These are the rules when reapplying buffs/debuffs.
 * @default greater
 *
 * @param MaxTurns:num
 * @text Maximum Turns
 * @parent General
 * @type number
 * @min 1
 * @desc Maximum number of turns to let buffs and debuffs go up to.
 * @default 9999
 *
 * @param Stacking
 *
 * @param StackBuffMax:num
 * @text Max Stacks: Buff
 * @parent Stacking
 * @type number
 * @min 1
 * @desc Maximum number of stacks for buffs.
 * @default 2
 *
 * @param StackDebuffMax:num
 * @text Max Stacks: Debuff
 * @parent Stacking
 * @type number
 * @min 1
 * @desc Maximum number of stacks for debuffs.
 * @default 2
 *
 * @param MultiplierJS:func
 * @text JS: Buff/Debuff Rate
 * @parent Stacking
 * @type note
 * @desc Code to determine how much buffs and debuffs affect parameters.
 * @default "// Declare Variables\nconst user = this;\nconst paramId = arguments[0];\nconst buffLevel = arguments[1];\nlet rate = 1;\n\n// Perform Calculations\nrate += buffLevel * 0.25;\n\n// Return Rate\nreturn Math.max(0, rate);"
 *
 * @param Turns
 * @text Turns Display
 *
 * @param ShowTurns:eval
 * @text Show Turns?
 * @parent Turns
 * @type boolean
 * @on Display
 * @off Hide
 * @desc Display buff and debuff turns on top of window icons and sprites?
 * @default true
 *
 * @param TurnFontSize:num
 * @text Turn Font Size
 * @parent Turns
 * @type number
 * @min 1
 * @desc Font size used for displaying turns.
 * @default 16
 *
 * @param TurnOffsetX:num
 * @text Offset X
 * @parent Turns
 * @desc Offset the X position of the turn display.
 * @default -4
 *
 * @param TurnOffsetY:num
 * @text Offset Y
 * @parent Turns
 * @desc Offset the Y position of the turn display.
 * @default -6
 *
 * @param ColorBuff:str
 * @text Turn Color: Buffs
 * @parent Turns
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 24
 *
 * @param ColorDebuff:str
 * @text Turn Color: Debuffs
 * @parent Turns
 * @desc Use #rrggbb for custom colors or regular numbers
 * for text colors from the Window Skin.
 * @default 27
 *
 * @param Data
 * @text Rate Display
 *
 * @param ShowData:eval
 * @text Show Rate?
 * @parent Data
 * @type boolean
 * @on Display
 * @off Hide
 * @desc Display buff and debuff rate on top of window icons and sprites?
 * @default false
 *
 * @param DataFontSize:num
 * @text Rate Font Size
 * @parent Data
 * @type number
 * @min 1
 * @desc Font size used for displaying rate.
 * @default 12
 *
 * @param DataOffsetX:num
 * @text Offset X
 * @parent Data
 * @desc Offset the X position of the rate display.
 * @default 0
 *
 * @param DataOffsetY:num
 * @text Offset Y
 * @parent Data
 * @desc Offset the Y position of the rate display.
 * @default 8
 *
 * @param CustomJS
 * @text Global JS Effects
 *
 * @param onAddBuffJS:func
 * @text JS: On Add Buff
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * buff is added.
 * @default "// Declare Variables\nconst paramId = arguments[0];\nconst modifier = this._buffs[paramId];\nconst origin = this.getCurrentStateActiveUser();\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 * @param onAddDebuffJS:func
 * @text JS: On Add Debuff
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * debuff is added.
 * @default "// Declare Variables\nconst paramId = arguments[0];\nconst modifier = this._buffs[paramId];\nconst origin = this.getCurrentStateActiveUser();\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 * @param onEraseBuffJS:func
 * @text JS: On Erase Buff
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * buff is erased.
 * @default "// Declare Variables\nconst paramId = arguments[0];\nconst modifier = this._buffs[paramId];\nconst origin = this.getCurrentStateActiveUser();\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 * @param onEraseDebuffJS:func
 * @text JS: On Erase Debuff
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * debuff is erased.
 * @default "// Declare Variables\nconst paramId = arguments[0];\nconst modifier = this._buffs[paramId];\nconst origin = this.getCurrentStateActiveUser();\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 * @param onExpireBuffJS:func
 * @text JS: On Expire Buff
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * buff has expired.
 * @default "// Declare Variables\nconst paramId = arguments[0];\nconst modifier = this._buffs[paramId];\nconst origin = this.getCurrentStateActiveUser();\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 * @param onExpireDebuffJS:func
 * @text JS: On Expire Debuff
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide custom effect whenever a
 * debuff has expired.
 * @default "// Declare Variables\nconst paramId = arguments[0];\nconst modifier = this._buffs[paramId];\nconst origin = this.getCurrentStateActiveUser();\nconst user = this.getCurrentStateActiveUser();\nconst target = this;\nconst a = origin;\nconst b = this;\n\n// Perform Actions\n"
 *
 */
/* ----------------------------------------------------------------------------
 * Passive State Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~PassiveStates:
 *
 * @param List
 *
 * @param Global:arraynum
 * @text Global Passives
 * @parent List
 * @type state[]
 * @desc A list of passive states to affect actors and enemies.
 * @default []
 *
 * @param Actor:arraynum
 * @text Actor-Only Passives
 * @parent List
 * @type state[]
 * @desc A list of passive states to affect actors only.
 * @default []
 *
 * @param Enemy:arraynum
 * @text Enemy Passives
 * @parent List
 * @type state[]
 * @desc A list of passive states to affect enemies only.
 * @default []
 *
 * @param CustomJS
 * @text Global JS Effects
 *
 * @param PassiveConditionJS:func
 * @text JS: Condition Check
 * @parent CustomJS
 * @type note
 * @desc JavaScript code for a global-wide passive condition check.
 * @default "// Declare Variables\nconst state = arguments[0];\nconst stateId = state.id;\nconst user = this;\nconst target = this;\nconst a = this;\nconst b = this;\nlet condition = true;\n\n// Perform Checks\n\n\n// Return boolean\nreturn condition;"
 *
 */
//=============================================================================

const _0x437e=['Scene_Skill_itemWindowRect','applyDebuffTurnManipulationEffects','_result','buffTurns','_scene','Game_BattlerBase_die','onAddStateCustomJS','icon','call','uiMenuStyle','drawActorIcons','isActor','height','isAllDead','getSkillIdWithName','drawFullGauge','hasSkill','changeOutlineColor','_cache','makeCommandName','currentClass','fontSize','filter','MultiplierJS','_checkingVisuMzPassiveStateObjects','_stateDisplay','onAddStateMakeCustomSlipValues','stateData','onEraseDebuffGlobalJS','Parse_Notetags_Skill_JS','damage','Settings','totalStateCategory','updateFrame','resetFontSettings','multiclasses','Buffs','skillId','skillCostSeparator','eraseBuff','Game_Unit_isAllDead','drawExtendedSkillsStatesCoreStatus','ParseStateNotetags','statesByCategory','outlineColor','gaugeRate','iconText','HiddenSkillTypes','applyStateCategoryRemovalEffects','LayoutStyle','setActor','length','stateAddJS','mpCost','meetsStateCondition','185mGlVVN','onEraseStateJS','slice','VisuMZ_0_CoreEngine','isSkillUsableForAutoBattle','VisuMZ_1_ElementStatusCore','removeBuffsAuto','Game_Action_applyItemUserEffect','ARRAYEVAL','stateId','_categoryWindow','onEraseBuffGlobalJS','CmdTextAlign','getStateIdWithName','buffIconIndex','_skillIDs','getSkillTypes','_buffs','VisuMZ_1_MainMenuCore','TurnOffsetX','textSizeEx','removeBuff','Game_Battler_isStateAddable','removeState','CanPayJS','drawActorStateData','toUpperCase','DataOffsetX','#%1','onEraseStateGlobalJS','usableSkills','initMembers','forgetSkill','mainAreaTop','Game_BattlerBase_skillTpCost','loadBitmap','onExpireState','width','makeSuccess','isBuffAffected','gainMp','ColorNeutral','meetsPassiveStateGlobalConditionJS','learnSkill','onExpireStateCustomJS','currentValueSkillsStatesCore','_stateRetainType','StackBuffMax','ShowData','ARRAYJSON','removeStatesAuto','MAXHP','Game_BattlerBase_refresh','_currentActor','magicSkills','ARRAYFUNC','_stateTurns','TurnOffsetY','setStatusWindow','ActionEndUpdate','addDebuffTurns','meetsPassiveStateConditionSwitches','createSkillCostText','isMaxDebuffAffected','1243588ujSfqE','addState','center','SkillConditionJS','skillTypeWindowRect','checkSkillConditionsNotetags','1780dETIvZ','shopStatusWindowRect','passiveStates','drawParamText','addDebuff','recover\x20all','normalColor','createTurnDisplaySprite','death','heal','addBuffTurns','onAddDebuffJS','meetsSkillConditionsGlobalJS','CalcJS','makeCurrentTroopUniqueID','initMembersSkillsStatesCore','onAddStateGlobalJS','_stypeId','isBuffOrDebuffAffected','applySkillsStatesCoreEffects','Game_BattlerBase_initMembers','Sprite_Gauge_currentValue','Parse_Notetags_State_ApplyRemoveLeaveJS','stateMaximumTurns','isStateAffected','placeGauge','isGroupDefeatStateAffected','setStateOrigin','addPassiveStates','Sprite_StateIcon_loadBitmap','drawExtendedParameter','isPassiveStateStackable','meetsSkillConditions','removeStatesByCategoryAll','onAddState','name','priority','enemyId','useDigitGrouping','drawSkillCost','isUseSkillsStatesCoreUpdatedLayout','iconWidth','Game_BattlerBase_eraseState','Game_BattlerBase_resetStateCounts','_colorCache','itemTextAlign','ParseClassIDs','redrawSkillsStatesCore','helpWindowRectSkillsStatesCore','onExpireBuffGlobalJS','enemy','paramValueByName','inBattle','commandNameWindowDrawBackground','isPlaytest','clearStatesWithStateRetain','rgba(0,\x200,\x200,\x201)','532befLej','meetsPassiveStateConditions','1FMOpsr','Costs','format','updatedLayoutStyle','trim','passiveStateObjects','checkShowHideBattleNotetags','\x0a\x20\x20\x20\x20\x20\x20\x20\x20let\x20%2\x20=\x200;\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20origin\x20=\x20this.getStateOrigin(stateId);\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20state\x20=\x20$dataStates[stateId];\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20origin;\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20target\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20a\x20=\x20origin;\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20b\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20%2\x20=\x20Math.round(Math.max(0,\x20%2)\x20*\x20%3);\x0a\x20\x20\x20\x20\x20\x20\x20\x20this.setStateData(stateId,\x20\x27%4\x27,\x20%2);\x0a\x20\x20\x20\x20','SkillSceneStatusBgType','drawActorBuffTurns','replace','right','onAddBuffGlobalJS','Game_Troop_setup','createItemWindow','statusWidth','_itemWindow','isCommandEnabled','indexOf','drawActorIconsAllTurnCounters','createCommandNameWindow','number','CoreEngine','helpAreaTop','overwriteBuffTurns','Game_Battler_addBuff','updateStateTurns','setItem','bitmap','ignore','allowCreateShopStatusWindow','MAXMP','<member-%1>','Parse_Notetags_State_Category','contents','Sprite_Gauge_setup','process_VisuMZ_SkillsStatesCore_Notetags','MDF','stateTpSlipDamageJS','menuActor','getStateData','isDebuffAffected','stateHpSlipDamageJS','untitled','Window_SkillStatus_refresh','STR','categories','GroupDigits','<troop-%1>','229515lvdsMA','TurnFontSize','placeExactGauge','paramBuffRate','Sprite_Gauge_currentMaxValue','checkShowHideNotetags','currentDisplayedValue','uiHelpPosition','setupSkillsStatesCore','onAddDebuff','isMaxBuffAffected','groupDefeat','drawText','resetStateCounts','clearStates','redraw','States','IconStypeMagic','isPartyAllAffectedByGroupDefeatStates','exit','877304RIMLDE','Parse_Notetags_State_SlipEffectJS','ReapplyRules','meetsSkillConditionsEnableJS','ALL','stateColor','setup','SkillsStatesCore','Parse_Notetags_State_PassiveJS','onRemoveState','skills','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','isStateExpired','Game_BattlerBase_overwriteBuffTurns','greater','shopStatusWidth','isUseModernControls','version','stateMpSlipHealJS','TextJS','setStateRetainType','isBottomHelpMode','ShowJS','getStateOriginByKey','Scene_Skill_createItemWindow','currentValue','Sprite_Gauge_redraw','retrieveStateColor','ANY','paySkillCost','gaugeBackColor','Actor','isStateAddable','Window_StatusBase_drawActorIcons','ConvertParams','commandStyleCheck','checkSkillConditionsSwitchNotetags','addCommand','ATK','_stored_debuffColor','drawItem','859LMjRQW','\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20visible\x20=\x20true;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20this._actor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20target\x20=\x20this._actor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20a\x20=\x20this._actor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20b\x20=\x20this._actor;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20visible;\x0a\x20\x20\x20\x20\x20\x20\x20\x20','buffLength','prototype','helpWindowRect','ParseAllNotetags','skillVisibleJS','clearStateDisplay','add','fontBold','actorId','isLearnedSkill','setBuffTurns','isStateResist','Game_BattlerBase_recoverAll','Window_SkillType_initialize','Parse_Notetags_Skill_Cost','onExpireStateGlobalJS','constructor','_states','createShopStatusWindow','FUNC','_stypeIDs','onEraseDebuff','resetTextColor','getStateOrigin','floor','_actor','Sprite_Gauge_gaugeRate','concat','MaxTurns','removeStatesByCategory','DataFontSize','Enemy','Game_BattlerBase_eraseBuff','split','%1%','checkSkillTypeMatch','applyItemUserEffect','checkShowHideSwitchNotetags','meetsPassiveStateConditionClasses','isSkillCostShown','onEraseBuff','skill','itemWindowRect','Game_Actor_forgetSkill','drawActorBuffRates','setPassiveStateSlipDamageJS','GaugeMaxJS','commandStyle','index','checkShowHideJS','maxItems','description','increaseBuff','regenerateAllSkillsStatesCore','isStateRestrict','keys','active','ShowShopStatus','uiInputPosition','totalStateCategoryAffected','537695feXmsQ','colSpacing','clearStateData','onAddDebuffGlobalJS','statusWindowRect','BattleHiddenSkillTypes','ARRAYNUM','drawItemStyleIcon','EnableLayout','die','debuffColor','includes','Scene_Skill_statusWindowRect','autoRemovalTiming','_currentTroopUniqueID','addChild','Window_SkillList_maxCols','getStateDisplay','buff','skillTypes','parse','Skills','adjustItemWidthByShopStatus','_skills','eraseState','helpAreaHeight','Game_Battler_regenerateAll','Game_Battler_addState','stateTurns','getColor','mainAreaHeight','drawTextEx','VisuMZ_2_ClassChangeSystem','Param','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','note','VisuMZ_1_ItemsEquipsCore','state','LUK','onRegenerateCustomStateDamageOverTime','getCurrentStateOriginKey','Sprite_Gauge_initMembers','onEraseStateCustomJS','addPassiveStatesByPluginParameters','_stateIDs','ARRAYSTRUCT','textColor','itemWindowRectSkillsStatesCore','AGI','addWindow','updateCommandNameWindow','drawItemStyleIconText','remove','createAllSkillCostText','PassiveStates','skillTpCost','anchor','commandNameWindowCenter','stateEraseJS','803263yZIoQf','process_VisuMZ_SkillsStatesCore_State_Notetags','getClassIdWithName','text','PayJS','skillMpCost','isRightInputMode','skillEnableJS','Game_Battler_addDebuff','Scene_Boot_onDatabaseLoaded','changeTextColor','ListWindowCols','_costSettings','getCurrentTroopUniqueID','_classIDs','opacity','item','mainCommandWidth','ParseSkillNotetags','includesSkillsStatesCore','Sprite_StateIcon_updateFrame','isAlive','onExpireStateJS','isStateCategoryAffected','slipMp','Game_BattlerBase_states','innerWidth','success','toLowerCase','Game_Actor_learnSkill','getStateReapplyRulings','getStateRetainType','\x5cI[%1]%2','clamp','statePassiveConditionJS','buttonAssistSwitch','user','_stateMaxTurns','log','ColorDebuff','drawActorStateTurns','_shopStatusWindow','GaugeCurrentJS','_subject','itemLineRect','MAT','equips','scrollTo','hasState','%1\x20%2\x20%3','convertGaugeTypeSkillsStatesCore','stateTpSlipHealJS','getCurrentStateActiveUser','commandName','commandNameWindowDrawText','shift','GaugeDrawJS','<actor-%1>','parameters','test','states','members','_skillTypeWindow','DataOffsetY','_commandNameWindow','statusWindowRectSkillsStatesCore','meetsPassiveStateConditionJS','innerHeight','updateHelp','map','Game_BattlerBase_skillMpCost','convertTargetToStateOriginKey','DEF','addStateTurns','Game_BattlerBase_clearStates','skillTypeWindowRectSkillsStatesCore','SkillMenuStatusRect','process_VisuMZ_SkillsStatesCore_Skill_Notetags','match','refresh','canClearState','ColorNegative','drawIcon','clear','stateExpireJS','itemAt','_stateData','applyBuffTurnManipulationEffects','return\x200','Game_Actor_skillTypes','ColorPositive','_turnDisplaySprite','getColorDataFromPluginParameters','updateTurnDisplaySprite','none','shopStatusWindowRectSkillsStatesCore','_buffTurns','stateHpSlipHealJS','\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20enabled\x20=\x20true;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20target\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20a\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20b\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20enabled;\x0a\x20\x20\x20\x20\x20\x20\x20\x20','recoverAll','setStateData','push','allIcons','setStateTurns','onEraseBuffJS','updateStatesActionEnd','onDatabaseLoaded','regenerateAll','clearStateRetainType','setStypeId','clearStateOrigin','slipTp','gainHp','iconIndex','slipHp','stateMpSlipDamageJS','ShowTurns','_battler','value','max','Game_BattlerBase_buffIconIndex','onExpireDebuff','onExpireDebuffGlobalJS','gaugeLineHeight','initialize','BattleManager_endAction','\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20origin\x20=\x20this.getStateOrigin(stateId);\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20state\x20=\x20$dataStates[stateId];\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20this.getCurrentStateActiveUser();\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20target\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20a\x20=\x20origin;\x0a\x20\x20\x20\x20\x20\x20\x20\x20const\x20b\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20','currentMaxValue','setDebuffTurns','iconHeight','_stateOrigin','reset','addBuff','callUpdateHelp','Name','buffColor','_statusWindow','addPassiveStatesFromOtherPlugins','Game_BattlerBase_increaseBuff','fillRect','getStypeIdWithName','calcWindowHeight','NEGATIVE','convertPassiveStates','Window_SkillList_setActor','canPaySkillCost','boxWidth'];const _0x10cf=function(_0x3326b4,_0x528c3e){_0x3326b4=_0x3326b4-0x178;let _0x437eec=_0x437e[_0x3326b4];return _0x437eec;};const _0x3bcbd5=_0x10cf;(function(_0x1a3ec0,_0x4e11ee){const _0x4cc993=_0x10cf;while(!![]){try{const _0x1af6e0=-parseInt(_0x4cc993(0x1c4))+parseInt(_0x4cc993(0x1ff))+parseInt(_0x4cc993(0x38f))+parseInt(_0x4cc993(0x30f))*parseInt(_0x4cc993(0x2c9))+-parseInt(_0x4cc993(0x186))*-parseInt(_0x4cc993(0x348))+-parseInt(_0x4cc993(0x37b))+-parseInt(_0x4cc993(0x34a))*parseInt(_0x4cc993(0x309));if(_0x1af6e0===_0x4e11ee)break;else _0x1a3ec0['push'](_0x1a3ec0['shift']());}catch(_0x3758f2){_0x1a3ec0['push'](_0x1a3ec0['shift']());}}}(_0x437e,0x6f579));var label=_0x3bcbd5(0x396),tier=tier||0x0,dependencies=[],pluginData=$plugins[_0x3bcbd5(0x2a8)](function(_0x48be6d){const _0x11a0c3=_0x3bcbd5;return _0x48be6d['status']&&_0x48be6d[_0x11a0c3(0x1bb)][_0x11a0c3(0x1cf)]('['+label+']');})[0x0];VisuMZ[label][_0x3bcbd5(0x2b1)]=VisuMZ[label][_0x3bcbd5(0x2b1)]||{},VisuMZ[_0x3bcbd5(0x17f)]=function(_0x4edd94,_0x33284e){const _0x2b4689=_0x3bcbd5;for(const _0xf18af2 in _0x33284e){if(_0xf18af2[_0x2b4689(0x24d)](/(.*):(.*)/i)){const _0x1eef54=String(RegExp['$1']),_0x147e5e=String(RegExp['$2'])[_0x2b4689(0x2e3)]()[_0x2b4689(0x34e)]();let _0x3d7153,_0x131bf6,_0x8dc79;switch(_0x147e5e){case'NUM':_0x3d7153=_0x33284e[_0xf18af2]!==''?Number(_0x33284e[_0xf18af2]):0x0;break;case _0x2b4689(0x1ca):_0x131bf6=_0x33284e[_0xf18af2]!==''?JSON[_0x2b4689(0x1d8)](_0x33284e[_0xf18af2]):[],_0x3d7153=_0x131bf6[_0x2b4689(0x244)](_0x2cc2c2=>Number(_0x2cc2c2));break;case'EVAL':_0x3d7153=_0x33284e[_0xf18af2]!==''?eval(_0x33284e[_0xf18af2]):null;break;case _0x2b4689(0x2d1):_0x131bf6=_0x33284e[_0xf18af2]!==''?JSON[_0x2b4689(0x1d8)](_0x33284e[_0xf18af2]):[],_0x3d7153=_0x131bf6['map'](_0x27f687=>eval(_0x27f687));break;case'JSON':_0x3d7153=_0x33284e[_0xf18af2]!==''?JSON[_0x2b4689(0x1d8)](_0x33284e[_0xf18af2]):'';break;case _0x2b4689(0x2fa):_0x131bf6=_0x33284e[_0xf18af2]!==''?JSON['parse'](_0x33284e[_0xf18af2]):[],_0x3d7153=_0x131bf6[_0x2b4689(0x244)](_0x42f708=>JSON[_0x2b4689(0x1d8)](_0x42f708));break;case _0x2b4689(0x19b):_0x3d7153=_0x33284e[_0xf18af2]!==''?new Function(JSON['parse'](_0x33284e[_0xf18af2])):new Function(_0x2b4689(0x257));break;case _0x2b4689(0x300):_0x131bf6=_0x33284e[_0xf18af2]!==''?JSON['parse'](_0x33284e[_0xf18af2]):[],_0x3d7153=_0x131bf6[_0x2b4689(0x244)](_0x479281=>new Function(JSON['parse'](_0x479281)));break;case _0x2b4689(0x377):_0x3d7153=_0x33284e[_0xf18af2]!==''?String(_0x33284e[_0xf18af2]):'';break;case'ARRAYSTR':_0x131bf6=_0x33284e[_0xf18af2]!==''?JSON[_0x2b4689(0x1d8)](_0x33284e[_0xf18af2]):[],_0x3d7153=_0x131bf6['map'](_0x2903c1=>String(_0x2903c1));break;case'STRUCT':_0x8dc79=_0x33284e[_0xf18af2]!==''?JSON['parse'](_0x33284e[_0xf18af2]):{},_0x4edd94[_0x1eef54]={},VisuMZ[_0x2b4689(0x17f)](_0x4edd94[_0x1eef54],_0x8dc79);continue;case _0x2b4689(0x1f1):_0x131bf6=_0x33284e[_0xf18af2]!==''?JSON[_0x2b4689(0x1d8)](_0x33284e[_0xf18af2]):[],_0x3d7153=_0x131bf6[_0x2b4689(0x244)](_0x38f08c=>VisuMZ[_0x2b4689(0x17f)]({},JSON[_0x2b4689(0x1d8)](_0x38f08c)));break;default:continue;}_0x4edd94[_0x1eef54]=_0x3d7153;}}return _0x4edd94;},(_0x45eb05=>{const _0x4fc923=_0x3bcbd5,_0x176c63=_0x45eb05[_0x4fc923(0x332)];for(const _0x933d37 of dependencies){if(!Imported[_0x933d37]){alert(_0x4fc923(0x1e6)['format'](_0x176c63,_0x933d37)),SceneManager['exit']();break;}}const _0x92dd2=_0x45eb05[_0x4fc923(0x1bb)];if(_0x92dd2['match'](/\[Version[ ](.*?)\]/i)){const _0x1fa3e8=Number(RegExp['$1']);_0x1fa3e8!==VisuMZ[label][_0x4fc923(0x3a0)]&&(alert(_0x4fc923(0x39a)[_0x4fc923(0x34c)](_0x176c63,_0x1fa3e8)),SceneManager[_0x4fc923(0x38e)]());}if(_0x92dd2[_0x4fc923(0x24d)](/\[Tier[ ](\d+)\]/i)){const _0x36a530=Number(RegExp['$1']);_0x36a530<tier?(alert('%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.'[_0x4fc923(0x34c)](_0x176c63,_0x36a530,tier)),SceneManager['exit']()):tier=Math[_0x4fc923(0x276)](_0x36a530,tier);}VisuMZ[_0x4fc923(0x17f)](VisuMZ[label][_0x4fc923(0x2b1)],_0x45eb05[_0x4fc923(0x239)]);})(pluginData),VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x208)]=Scene_Boot[_0x3bcbd5(0x189)][_0x3bcbd5(0x269)],Scene_Boot[_0x3bcbd5(0x189)][_0x3bcbd5(0x269)]=function(){const _0x5154a8=_0x3bcbd5;VisuMZ[_0x5154a8(0x396)][_0x5154a8(0x208)]['call'](this),this[_0x5154a8(0x36e)]();},Scene_Boot[_0x3bcbd5(0x189)][_0x3bcbd5(0x36e)]=function(){const _0xe66397=_0x3bcbd5;if(VisuMZ[_0xe66397(0x18b)])return;this[_0xe66397(0x24c)](),this['process_VisuMZ_SkillsStatesCore_State_Notetags']();},Scene_Boot['prototype'][_0x3bcbd5(0x24c)]=function(){const _0x1403fb=_0x3bcbd5;for(const _0x5ef217 of $dataSkills){if(!_0x5ef217)continue;VisuMZ[_0x1403fb(0x396)]['Parse_Notetags_Skill_Cost'](_0x5ef217),VisuMZ[_0x1403fb(0x396)][_0x1403fb(0x2af)](_0x5ef217);}},Scene_Boot[_0x3bcbd5(0x189)][_0x3bcbd5(0x200)]=function(){const _0x39838d=_0x3bcbd5;for(const _0x2134e9 of $dataStates){if(!_0x2134e9)continue;VisuMZ['SkillsStatesCore'][_0x39838d(0x36b)](_0x2134e9),VisuMZ[_0x39838d(0x396)][_0x39838d(0x397)](_0x2134e9),VisuMZ[_0x39838d(0x396)][_0x39838d(0x390)](_0x2134e9),VisuMZ[_0x39838d(0x396)][_0x39838d(0x325)](_0x2134e9);}},VisuMZ[_0x3bcbd5(0x396)]['ParseSkillNotetags']=VisuMZ['ParseSkillNotetags'],VisuMZ[_0x3bcbd5(0x211)]=function(_0x5684b0){const _0x5e8c04=_0x3bcbd5;VisuMZ[_0x5e8c04(0x396)][_0x5e8c04(0x211)][_0x5e8c04(0x29a)](this,_0x5684b0),VisuMZ['SkillsStatesCore'][_0x5e8c04(0x196)](_0x5684b0),VisuMZ[_0x5e8c04(0x396)][_0x5e8c04(0x2af)](_0x5684b0);},VisuMZ['SkillsStatesCore'][_0x3bcbd5(0x2bc)]=VisuMZ[_0x3bcbd5(0x2bc)],VisuMZ['ParseStateNotetags']=function(_0x25dc7c){const _0x39c339=_0x3bcbd5;VisuMZ[_0x39c339(0x396)][_0x39c339(0x2bc)][_0x39c339(0x29a)](this,_0x25dc7c),VisuMZ[_0x39c339(0x396)][_0x39c339(0x36b)](_0x25dc7c),VisuMZ[_0x39c339(0x396)]['Parse_Notetags_State_PassiveJS'](_0x25dc7c),VisuMZ[_0x39c339(0x396)][_0x39c339(0x390)](_0x25dc7c),VisuMZ['SkillsStatesCore']['Parse_Notetags_State_ApplyRemoveLeaveJS'](_0x25dc7c);},VisuMZ[_0x3bcbd5(0x396)]['Parse_Notetags_Skill_Cost']=function(_0x3fc9ec){const _0x55ecdc=_0x3bcbd5,_0x32c985=_0x3fc9ec[_0x55ecdc(0x1e7)];_0x32c985[_0x55ecdc(0x24d)](/<MP COST:[ ](\d+)>/i)&&(_0x3fc9ec[_0x55ecdc(0x2c7)]=Number(RegExp['$1'])),_0x32c985[_0x55ecdc(0x24d)](/<TP COST:[ ](\d+)>/i)&&(_0x3fc9ec['tpCost']=Number(RegExp['$1']));},VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x206)]={},VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x18c)]={},VisuMZ['SkillsStatesCore']['Parse_Notetags_Skill_JS']=function(_0x46b097){const _0x5601fe=_0x3bcbd5,_0x3250e3=_0x46b097[_0x5601fe(0x1e7)];if(_0x3250e3['match'](/<JS SKILL ENABLE>\s*([\s\S]*)\s*<\/JS SKILL ENABLE>/i)){const _0x41fc72=String(RegExp['$1']),_0x1ffa4b=_0x5601fe(0x261)['format'](_0x41fc72);VisuMZ[_0x5601fe(0x396)][_0x5601fe(0x206)][_0x46b097['id']]=new Function(_0x5601fe(0x1b1),_0x1ffa4b);}if(_0x3250e3[_0x5601fe(0x24d)](/<JS SKILL VISIBLE>\s*([\s\S]*)\s*<\/JS SKILL VISIBLE>/i)){const _0x32b475=String(RegExp['$1']),_0x1982f9=_0x5601fe(0x187)[_0x5601fe(0x34c)](_0x32b475);VisuMZ['SkillsStatesCore'][_0x5601fe(0x18c)][_0x46b097['id']]=new Function(_0x5601fe(0x1b1),_0x1982f9);}},VisuMZ[_0x3bcbd5(0x396)]['Parse_Notetags_State_Category']=function(_0x504036){const _0x5632bc=_0x3bcbd5;_0x504036[_0x5632bc(0x378)]=[_0x5632bc(0x393),_0x5632bc(0x179)];const _0x5eff41=_0x504036['note'],_0x3348e0=_0x5eff41[_0x5632bc(0x24d)](/<(?:CATEGORY|CATEGORIES):[ ](.*)>/gi);if(_0x3348e0)for(const _0x4caa7d of _0x3348e0){_0x4caa7d[_0x5632bc(0x24d)](/<(?:CATEGORY|CATEGORIES):[ ](.*)>/gi);const _0xcb3286=String(RegExp['$1'])[_0x5632bc(0x2e3)]()[_0x5632bc(0x34e)]()[_0x5632bc(0x1a9)](',');for(const _0x5e2277 of _0xcb3286){_0x504036[_0x5632bc(0x378)]['push'](_0x5e2277['trim']());}}if(_0x5eff41[_0x5632bc(0x24d)](/<(?:CATEGORY|CATEGORIES)>\s*([\s\S]*)\s*<\/(?:CATEGORY|CATEGORIES)>/i)){const _0x663439=RegExp['$1'][_0x5632bc(0x1a9)](/[\r\n]+/);for(const _0x573926 of _0x663439){_0x504036[_0x5632bc(0x378)][_0x5632bc(0x264)](_0x573926[_0x5632bc(0x2e3)]()[_0x5632bc(0x34e)]());}}_0x5eff41[_0x5632bc(0x24d)](/<POSITIVE STATE>/i)&&_0x504036['categories'][_0x5632bc(0x264)]('POSITIVE'),_0x5eff41['match'](/<NEGATIVE STATE>/i)&&_0x504036[_0x5632bc(0x378)][_0x5632bc(0x264)](_0x5632bc(0x28d));},VisuMZ[_0x3bcbd5(0x396)]['statePassiveConditionJS']={},VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x397)]=function(_0xf829ca){const _0x122459=_0x3bcbd5,_0x522b41=_0xf829ca[_0x122459(0x1e7)];if(_0x522b41[_0x122459(0x24d)](/<JS PASSIVE CONDITION>\s*([\s\S]*)\s*<\/JS PASSIVE CONDITION>/i)){const _0x2bb115=String(RegExp['$1']),_0x3e7e92='\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20condition\x20=\x20true;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20target\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20a\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20b\x20=\x20this;\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20condition;\x0a\x20\x20\x20\x20\x20\x20\x20\x20'[_0x122459(0x34c)](_0x2bb115);VisuMZ[_0x122459(0x396)]['statePassiveConditionJS'][_0xf829ca['id']]=new Function(_0x122459(0x1e9),_0x3e7e92);}},VisuMZ['SkillsStatesCore'][_0x3bcbd5(0x374)]={},VisuMZ['SkillsStatesCore'][_0x3bcbd5(0x260)]={},VisuMZ['SkillsStatesCore'][_0x3bcbd5(0x272)]={},VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x3a1)]={},VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x370)]={},VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x232)]={},VisuMZ['SkillsStatesCore']['Parse_Notetags_State_SlipEffectJS']=function(_0x3309a1){const _0x4acd10=_0x3bcbd5,_0x396979=_0x3309a1['note'],_0x2402cc=_0x4acd10(0x351);if(_0x396979[_0x4acd10(0x24d)](/<JS HP SLIP DAMAGE>\s*([\s\S]*)\s*<\/JS HP SLIP DAMAGE>/i)){const _0x36d2a7=String(RegExp['$1']),_0x2dca3e=_0x2402cc[_0x4acd10(0x34c)](_0x36d2a7,'damage',-0x1,_0x4acd10(0x271));VisuMZ['SkillsStatesCore'][_0x4acd10(0x374)][_0x3309a1['id']]=new Function(_0x4acd10(0x2d2),_0x2dca3e);}else{if(_0x396979['match'](/<JS HP SLIP HEAL>\s*([\s\S]*)\s*<\/JS HP SLIP HEAL>/i)){const _0x276fca=String(RegExp['$1']),_0xfe2500=_0x2402cc['format'](_0x276fca,_0x4acd10(0x318),0x1,_0x4acd10(0x271));VisuMZ[_0x4acd10(0x396)][_0x4acd10(0x260)][_0x3309a1['id']]=new Function(_0x4acd10(0x2d2),_0xfe2500);}}if(_0x396979[_0x4acd10(0x24d)](/<JS MP SLIP DAMAGE>\s*([\s\S]*)\s*<\/JS MP SLIP DAMAGE>/i)){const _0x10b8bd=String(RegExp['$1']),_0x33010d=_0x2402cc['format'](_0x10b8bd,_0x4acd10(0x2b0),-0x1,_0x4acd10(0x217));VisuMZ[_0x4acd10(0x396)][_0x4acd10(0x272)][_0x3309a1['id']]=new Function(_0x4acd10(0x2d2),_0x33010d);}else{if(_0x396979['match'](/<JS MP SLIP HEAL>\s*([\s\S]*)\s*<\/JS MP SLIP HEAL>/i)){const _0x1d0af6=String(RegExp['$1']),_0x2be939=_0x2402cc['format'](_0x1d0af6,_0x4acd10(0x318),0x1,_0x4acd10(0x217));VisuMZ['SkillsStatesCore']['stateMpSlipHealJS'][_0x3309a1['id']]=new Function(_0x4acd10(0x2d2),_0x2be939);}}if(_0x396979['match'](/<JS TP SLIP DAMAGE>\s*([\s\S]*)\s*<\/JS TP SLIP DAMAGE>/i)){const _0x1d99b6=String(RegExp['$1']),_0x1d52d1=_0x2402cc[_0x4acd10(0x34c)](_0x1d99b6,_0x4acd10(0x2b0),-0x1,'slipTp');VisuMZ[_0x4acd10(0x396)][_0x4acd10(0x370)][_0x3309a1['id']]=new Function(_0x4acd10(0x2d2),_0x1d52d1);}else{if(_0x396979['match'](/<JS TP SLIP HEAL>\s*([\s\S]*)\s*<\/JS TP SLIP HEAL>/i)){const _0x240ffc=String(RegExp['$1']),_0x2f6e6a=_0x2402cc['format'](_0x240ffc,_0x4acd10(0x318),0x1,_0x4acd10(0x26e));VisuMZ[_0x4acd10(0x396)]['stateTpSlipHealJS'][_0x3309a1['id']]=new Function('stateId',_0x2f6e6a);}}},VisuMZ['SkillsStatesCore']['stateAddJS']={},VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x1fe)]={},VisuMZ['SkillsStatesCore'][_0x3bcbd5(0x253)]={},VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x325)]=function(_0x549c6d){const _0x152d58=_0x3bcbd5,_0x1f372b=_0x549c6d['note'],_0x119e06=_0x152d58(0x27d);if(_0x1f372b['match'](/<JS ON ADD STATE>\s*([\s\S]*)\s*<\/JS ON ADD STATE>/i)){const _0x29e6f5=String(RegExp['$1']),_0x7eed3d=_0x119e06[_0x152d58(0x34c)](_0x29e6f5);VisuMZ['SkillsStatesCore'][_0x152d58(0x2c6)][_0x549c6d['id']]=new Function(_0x152d58(0x2d2),_0x7eed3d);}if(_0x1f372b[_0x152d58(0x24d)](/<JS ON ERASE STATE>\s*([\s\S]*)\s*<\/JS ON ERASE STATE>/i)){const _0x4624a4=String(RegExp['$1']),_0x40a990=_0x119e06[_0x152d58(0x34c)](_0x4624a4);VisuMZ[_0x152d58(0x396)]['stateEraseJS'][_0x549c6d['id']]=new Function(_0x152d58(0x2d2),_0x40a990);}if(_0x1f372b[_0x152d58(0x24d)](/<JS ON EXPIRE STATE>\s*([\s\S]*)\s*<\/JS ON EXPIRE STATE>/i)){const _0x4de1d1=String(RegExp['$1']),_0x58c822=_0x119e06[_0x152d58(0x34c)](_0x4de1d1);VisuMZ[_0x152d58(0x396)][_0x152d58(0x253)][_0x549c6d['id']]=new Function(_0x152d58(0x2d2),_0x58c822);}},DataManager[_0x3bcbd5(0x201)]=function(_0x1837e6){const _0x5bc69a=_0x3bcbd5;_0x1837e6=_0x1837e6[_0x5bc69a(0x2e3)]()[_0x5bc69a(0x34e)](),this[_0x5bc69a(0x20d)]=this[_0x5bc69a(0x20d)]||{};if(this[_0x5bc69a(0x20d)][_0x1837e6])return this[_0x5bc69a(0x20d)][_0x1837e6];for(const _0x3b23f6 of $dataClasses){if(!_0x3b23f6)continue;let _0xe8133e=_0x3b23f6[_0x5bc69a(0x332)];_0xe8133e=_0xe8133e[_0x5bc69a(0x354)](/\x1I\[(\d+)\]/gi,''),_0xe8133e=_0xe8133e['replace'](/\\I\[(\d+)\]/gi,''),this['_classIDs'][_0xe8133e[_0x5bc69a(0x2e3)]()[_0x5bc69a(0x34e)]()]=_0x3b23f6['id'];}return this[_0x5bc69a(0x20d)][_0x1837e6]||0x0;},DataManager[_0x3bcbd5(0x2d9)]=function(_0x164cea){const _0xfd70bf=_0x3bcbd5;this[_0xfd70bf(0x19c)]=this[_0xfd70bf(0x19c)]||{};if(this[_0xfd70bf(0x19c)][_0x164cea['id']])return this[_0xfd70bf(0x19c)][_0x164cea['id']];this[_0xfd70bf(0x19c)][_0x164cea['id']]=[_0x164cea['stypeId']];if(_0x164cea[_0xfd70bf(0x1e7)][_0xfd70bf(0x24d)](/<SKILL[ ](?:TYPE|TYPES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x382049=JSON['parse']('['+RegExp['$1'][_0xfd70bf(0x24d)](/\d+/g)+']');this[_0xfd70bf(0x19c)][_0x164cea['id']]=this[_0xfd70bf(0x19c)][_0x164cea['id']][_0xfd70bf(0x1a3)](_0x382049);}else{if(_0x164cea['note']['match'](/<SKILL[ ](?:TYPE|TYPES):[ ](.*)>/i)){const _0x423ca4=RegExp['$1'][_0xfd70bf(0x1a9)](',');for(const _0x4e891b of _0x423ca4){const _0x2e7cae=DataManager[_0xfd70bf(0x28b)](_0x4e891b);if(_0x2e7cae)this['_stypeIDs'][_0x164cea['id']][_0xfd70bf(0x264)](_0x2e7cae);}}}return this[_0xfd70bf(0x19c)][_0x164cea['id']];},DataManager[_0x3bcbd5(0x28b)]=function(_0x227f81){const _0x191f7d=_0x3bcbd5;_0x227f81=_0x227f81['toUpperCase']()['trim'](),this['_stypeIDs']=this[_0x191f7d(0x19c)]||{};if(this[_0x191f7d(0x19c)][_0x227f81])return this[_0x191f7d(0x19c)][_0x227f81];for(let _0x7472e5=0x1;_0x7472e5<0x64;_0x7472e5++){if(!$dataSystem[_0x191f7d(0x1d7)][_0x7472e5])continue;let _0x28238d=$dataSystem[_0x191f7d(0x1d7)][_0x7472e5]['toUpperCase']()[_0x191f7d(0x34e)]();_0x28238d=_0x28238d['replace'](/\x1I\[(\d+)\]/gi,''),_0x28238d=_0x28238d['replace'](/\\I\[(\d+)\]/gi,''),this[_0x191f7d(0x19c)][_0x28238d]=_0x7472e5;}return this[_0x191f7d(0x19c)][_0x227f81]||0x0;},DataManager[_0x3bcbd5(0x2a0)]=function(_0x31e8b0){const _0x134d4f=_0x3bcbd5;_0x31e8b0=_0x31e8b0[_0x134d4f(0x2e3)]()[_0x134d4f(0x34e)](),this[_0x134d4f(0x2d8)]=this[_0x134d4f(0x2d8)]||{};if(this[_0x134d4f(0x2d8)][_0x31e8b0])return this['_skillIDs'][_0x31e8b0];for(const _0x147b6c of $dataSkills){if(!_0x147b6c)continue;this[_0x134d4f(0x2d8)][_0x147b6c['name'][_0x134d4f(0x2e3)]()[_0x134d4f(0x34e)]()]=_0x147b6c['id'];}return this[_0x134d4f(0x2d8)][_0x31e8b0]||0x0;},DataManager['getStateIdWithName']=function(_0x28499b){const _0x33eb78=_0x3bcbd5;_0x28499b=_0x28499b['toUpperCase']()[_0x33eb78(0x34e)](),this[_0x33eb78(0x1f0)]=this['_stateIDs']||{};if(this['_stateIDs'][_0x28499b])return this[_0x33eb78(0x1f0)][_0x28499b];for(const _0x55a786 of $dataStates){if(!_0x55a786)continue;this[_0x33eb78(0x1f0)][_0x55a786[_0x33eb78(0x332)]['toUpperCase']()[_0x33eb78(0x34e)]()]=_0x55a786['id'];}return this[_0x33eb78(0x1f0)][_0x28499b]||0x0;},DataManager[_0x3bcbd5(0x326)]=function(_0x9bc6a8){const _0x247c29=_0x3bcbd5;this['_stateMaxTurns']=this[_0x247c29(0x224)]||{};if(this['_stateMaxTurns'][_0x9bc6a8])return this[_0x247c29(0x224)][_0x9bc6a8];return $dataStates[_0x9bc6a8][_0x247c29(0x1e7)][_0x247c29(0x24d)](/<MAX TURNS:[ ](\d+)>/i)?this['_stateMaxTurns'][_0x9bc6a8]=Number(RegExp['$1']):this['_stateMaxTurns'][_0x9bc6a8]=VisuMZ['SkillsStatesCore']['Settings'][_0x247c29(0x38b)]['MaxTurns'],this[_0x247c29(0x224)][_0x9bc6a8];},ColorManager[_0x3bcbd5(0x25b)]=function(_0x35b276,_0x1da611){const _0x5df3da=_0x3bcbd5;return _0x1da611=String(_0x1da611),this['_colorCache']=this[_0x5df3da(0x33b)]||{},_0x1da611['match'](/#(.*)/i)?this[_0x5df3da(0x33b)][_0x35b276]=_0x5df3da(0x2e5)[_0x5df3da(0x34c)](String(RegExp['$1'])):this['_colorCache'][_0x35b276]=this[_0x5df3da(0x1f2)](Number(_0x1da611)),this[_0x5df3da(0x33b)][_0x35b276];},ColorManager[_0x3bcbd5(0x1e1)]=function(_0x32ebf6){const _0x4b91dc=_0x3bcbd5;return _0x32ebf6=String(_0x32ebf6),_0x32ebf6[_0x4b91dc(0x24d)](/#(.*)/i)?_0x4b91dc(0x2e5)[_0x4b91dc(0x34c)](String(RegExp['$1'])):this[_0x4b91dc(0x1f2)](Number(_0x32ebf6));},ColorManager['stateColor']=function(_0x2c6135){const _0x34cac4=_0x3bcbd5;if(typeof _0x2c6135==='number')_0x2c6135=$dataStates[_0x2c6135];const _0xe44dc2='_stored_state-%1-color'['format'](_0x2c6135['id']);this[_0x34cac4(0x33b)]=this['_colorCache']||{};if(this[_0x34cac4(0x33b)][_0xe44dc2])return this['_colorCache'][_0xe44dc2];const _0x2a7a75=this[_0x34cac4(0x178)](_0x2c6135);return this['getColorDataFromPluginParameters'](_0xe44dc2,_0x2a7a75);},ColorManager[_0x3bcbd5(0x178)]=function(_0x13ffc3){const _0x2a3406=_0x3bcbd5,_0x79094f=_0x13ffc3[_0x2a3406(0x1e7)];if(_0x79094f[_0x2a3406(0x24d)](/<TURN COLOR:[ ](.*)>/i))return String(RegExp['$1']);else{if(_0x79094f[_0x2a3406(0x24d)](/<POSITIVE STATE>/i))return VisuMZ[_0x2a3406(0x396)][_0x2a3406(0x2b1)][_0x2a3406(0x38b)][_0x2a3406(0x259)];else return _0x79094f[_0x2a3406(0x24d)](/<NEGATIVE STATE>/i)?VisuMZ[_0x2a3406(0x396)][_0x2a3406(0x2b1)][_0x2a3406(0x38b)][_0x2a3406(0x250)]:VisuMZ['SkillsStatesCore'][_0x2a3406(0x2b1)]['States'][_0x2a3406(0x2f2)];}},ColorManager[_0x3bcbd5(0x286)]=function(){const _0x4bef41=_0x3bcbd5,_0x517ac2='_stored_buffColor';this[_0x4bef41(0x33b)]=this['_colorCache']||{};if(this[_0x4bef41(0x33b)][_0x517ac2])return this[_0x4bef41(0x33b)][_0x517ac2];const _0x427cf9=VisuMZ[_0x4bef41(0x396)][_0x4bef41(0x2b1)][_0x4bef41(0x2b6)]['ColorBuff'];return this[_0x4bef41(0x25b)](_0x517ac2,_0x427cf9);},ColorManager[_0x3bcbd5(0x1ce)]=function(){const _0x46eebe=_0x3bcbd5,_0x29ad91=_0x46eebe(0x184);this[_0x46eebe(0x33b)]=this[_0x46eebe(0x33b)]||{};if(this[_0x46eebe(0x33b)][_0x29ad91])return this[_0x46eebe(0x33b)][_0x29ad91];const _0x4a95d0=VisuMZ[_0x46eebe(0x396)][_0x46eebe(0x2b1)]['Buffs'][_0x46eebe(0x226)];return this[_0x46eebe(0x25b)](_0x29ad91,_0x4a95d0);},VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x27c)]=BattleManager['endAction'],BattleManager['endAction']=function(){const _0x5d22c5=_0x3bcbd5;this[_0x5d22c5(0x268)](),VisuMZ[_0x5d22c5(0x396)][_0x5d22c5(0x27c)]['call'](this);},BattleManager['updateStatesActionEnd']=function(){const _0x28e5e3=_0x3bcbd5,_0x1aa1f0=VisuMZ[_0x28e5e3(0x396)]['Settings']['States'];if(!_0x1aa1f0)return;if(_0x1aa1f0[_0x28e5e3(0x304)]===![])return;if(!this[_0x28e5e3(0x22a)])return;this[_0x28e5e3(0x22a)][_0x28e5e3(0x268)]();},Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x268)]=function(){const _0xbb10b8=_0x3bcbd5;for(const _0x1035a7 of this[_0xbb10b8(0x199)]){const _0x3a167d=$dataStates[_0x1035a7];if(!_0x3a167d)continue;if(_0x3a167d['autoRemovalTiming']!==0x1)continue;this[_0xbb10b8(0x301)][_0x1035a7]>0x0&&this[_0xbb10b8(0x301)][_0x1035a7]--;}this[_0xbb10b8(0x2fb)](0x1);},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x364)]=function(){const _0x1e8116=_0x3bcbd5,_0x36b290=VisuMZ[_0x1e8116(0x396)][_0x1e8116(0x2b1)]['States'];for(const _0x40dc10 of this[_0x1e8116(0x199)]){const _0x3185db=$dataStates[_0x40dc10];if(_0x36b290&&_0x36b290['ActionEndUpdate']!==![]){if(_0x3185db&&_0x3185db[_0x1e8116(0x1d1)]===0x1)continue;}this[_0x1e8116(0x301)][_0x40dc10]>0x0&&this['_stateTurns'][_0x40dc10]--;}},VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x2d0)]=Game_Action[_0x3bcbd5(0x189)][_0x3bcbd5(0x1ac)],Game_Action['prototype'][_0x3bcbd5(0x1ac)]=function(_0xd495b4){const _0x203585=_0x3bcbd5;VisuMZ[_0x203585(0x396)]['Game_Action_applyItemUserEffect'][_0x203585(0x29a)](this,_0xd495b4),this[_0x203585(0x322)](_0xd495b4);},Game_Action[_0x3bcbd5(0x189)][_0x3bcbd5(0x322)]=function(_0x247156){const _0x6d7e9b=_0x3bcbd5;this[_0x6d7e9b(0x2c2)](_0x247156),this['applyStateTurnManipulationEffects'](_0x247156),this[_0x6d7e9b(0x256)](_0x247156),this[_0x6d7e9b(0x293)](_0x247156);},Game_Action[_0x3bcbd5(0x189)][_0x3bcbd5(0x2c2)]=function(_0xfd7e44){const _0x10fb43=_0x3bcbd5;if(_0xfd7e44[_0x10fb43(0x23b)]()[_0x10fb43(0x2c5)]<=0x0)return;const _0x58b524=this['item']()[_0x10fb43(0x1e7)];if(_0x58b524[_0x10fb43(0x24d)](/<STATE[ ](.*)[ ]CATEGORY REMOVE:[ ]ALL>/i)){const _0x13d3bc=String(RegExp['$1']);_0xfd7e44[_0x10fb43(0x330)]();}const _0x2e6b53=_0x58b524[_0x10fb43(0x24d)](/<STATE[ ](.*)[ ]CATEGORY REMOVE:[ ](\d+)>/gi);if(_0x2e6b53)for(const _0x6da25 of _0x2e6b53){_0x6da25[_0x10fb43(0x24d)](/<STATE[ ](.*)[ ]CATEGORY REMOVE:[ ](\d+)>/i);const _0x4ba2cc=String(RegExp['$1']),_0xfcae54=Number(RegExp['$2']);_0xfd7e44[_0x10fb43(0x1a5)](_0x4ba2cc,_0xfcae54);}},Game_Action[_0x3bcbd5(0x189)]['applyStateTurnManipulationEffects']=function(_0x2d17f6){const _0x417f4a=_0x3bcbd5,_0x34c9e4=this['item']()[_0x417f4a(0x1e7)],_0x483d10=_0x34c9e4[_0x417f4a(0x24d)](/<SET STATE[ ](.*)[ ]TURNS:[ ](\d+)>/gi);if(_0x483d10)for(const _0x174e24 of _0x483d10){let _0x2f198f=0x0,_0x32a093=0x0;if(_0x174e24[_0x417f4a(0x24d)](/<SET STATE[ ](\d+)[ ]TURNS:[ ](\d+)>/i))_0x2f198f=Number(RegExp['$1']),_0x32a093=Number(RegExp['$2']);else _0x174e24['match'](/<SET STATE[ ](.*)[ ]TURNS:[ ](\d+)>/i)&&(_0x2f198f=DataManager['getStateIdWithName'](RegExp['$1']),_0x32a093=Number(RegExp['$2']));_0x2d17f6[_0x417f4a(0x266)](_0x2f198f,_0x32a093),this['makeSuccess'](_0x2d17f6);}const _0x5dc028=_0x34c9e4['match'](/<STATE[ ](.*)[ ]TURNS:[ ]([\+\-]\d+)>/gi);if(_0x5dc028)for(const _0x41c32d of _0x5dc028){let _0x69b07=0x0,_0x43006e=0x0;if(_0x41c32d[_0x417f4a(0x24d)](/<STATE[ ](\d+)[ ]TURNS:[ ]([\+\-]\d+)>/i))_0x69b07=Number(RegExp['$1']),_0x43006e=Number(RegExp['$2']);else _0x41c32d[_0x417f4a(0x24d)](/<STATE[ ](.*)[ ]TURNS:[ ]([\+\-]\d+)>/i)&&(_0x69b07=DataManager[_0x417f4a(0x2d6)](RegExp['$1']),_0x43006e=Number(RegExp['$2']));_0x2d17f6[_0x417f4a(0x248)](_0x69b07,_0x43006e),this[_0x417f4a(0x2ef)](_0x2d17f6);}},Game_Action[_0x3bcbd5(0x189)][_0x3bcbd5(0x256)]=function(_0x25dc26){const _0x12e81b=_0x3bcbd5,_0x536cb0=[_0x12e81b(0x2fc),_0x12e81b(0x369),_0x12e81b(0x183),_0x12e81b(0x247),_0x12e81b(0x22c),_0x12e81b(0x36f),_0x12e81b(0x1f4),'LUK'],_0x53b44e=this['item']()[_0x12e81b(0x1e7)],_0x4e70c7=_0x53b44e['match'](/<SET[ ](.*)[ ]BUFF TURNS:[ ](\d+)>/gi);if(_0x4e70c7)for(const _0x4e4ea3 of _0x4e70c7){_0x4e4ea3['match'](/<SET[ ](.*)[ ]BUFF TURNS:[ ](\d+)>/i);const _0x5df62d=_0x536cb0[_0x12e81b(0x35c)](String(RegExp['$1'])['toUpperCase']()),_0x2a0616=Number(RegExp['$2']);_0x5df62d>=0x0&&(_0x25dc26[_0x12e81b(0x192)](_0x5df62d,_0x2a0616),this['makeSuccess'](_0x25dc26));}const _0x46e43f=_0x53b44e[_0x12e81b(0x24d)](/<(.*)[ ]BUFF TURNS:[ ]([\+\-]\d+)>/gi);if(_0x46e43f)for(const _0x112c81 of _0x4e70c7){_0x112c81[_0x12e81b(0x24d)](/<(.*)[ ]BUFF TURNS:[ ]([\+\-]\d+)>/i);const _0x7f0134=_0x536cb0[_0x12e81b(0x35c)](String(RegExp['$1'])['toUpperCase']()),_0x58ef6b=Number(RegExp['$2']);_0x7f0134>=0x0&&(_0x25dc26[_0x12e81b(0x319)](_0x7f0134,_0x58ef6b),this[_0x12e81b(0x2ef)](_0x25dc26));}},Game_Action[_0x3bcbd5(0x189)][_0x3bcbd5(0x293)]=function(_0x234fa8){const _0x31db03=_0x3bcbd5,_0x1dd193=[_0x31db03(0x2fc),'MAXMP',_0x31db03(0x183),_0x31db03(0x247),_0x31db03(0x22c),_0x31db03(0x36f),_0x31db03(0x1f4),_0x31db03(0x1ea)],_0x4ea95c=this[_0x31db03(0x20f)]()[_0x31db03(0x1e7)],_0x4e6a67=_0x4ea95c[_0x31db03(0x24d)](/<SET[ ](.*)[ ]DEBUFF TURNS:[ ](\d+)>/gi);if(_0x4e6a67)for(const _0x1aedfa of _0x4e6a67){_0x1aedfa[_0x31db03(0x24d)](/<SET[ ](.*)[ ]DEBUFF TURNS:[ ](\d+)>/i);const _0x38154c=_0x1dd193[_0x31db03(0x35c)](String(RegExp['$1'])['toUpperCase']()),_0x5c86b1=Number(RegExp['$2']);_0x38154c>=0x0&&(_0x234fa8[_0x31db03(0x27f)](_0x38154c,_0x5c86b1),this[_0x31db03(0x2ef)](_0x234fa8));}const _0x2e18cc=_0x4ea95c[_0x31db03(0x24d)](/<(.*)[ ]DEBUFF TURNS:[ ]([\+\-]\d+)>/gi);if(_0x2e18cc)for(const _0x24c1ba of _0x4e6a67){_0x24c1ba[_0x31db03(0x24d)](/<(.*)[ ]DEBUFF TURNS:[ ]([\+\-]\d+)>/i);const _0x23ecfb=_0x1dd193[_0x31db03(0x35c)](String(RegExp['$1'])[_0x31db03(0x2e3)]()),_0x1715d5=Number(RegExp['$2']);_0x23ecfb>=0x0&&(_0x234fa8['addDebuffTurns'](_0x23ecfb,_0x1715d5),this[_0x31db03(0x2ef)](_0x234fa8));}},VisuMZ[_0x3bcbd5(0x396)]['Game_BattlerBase_initMembers']=Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x2e8)],Game_BattlerBase['prototype'][_0x3bcbd5(0x2e8)]=function(){const _0x7d9cb5=_0x3bcbd5;this[_0x7d9cb5(0x2a4)]={},this[_0x7d9cb5(0x31e)](),VisuMZ['SkillsStatesCore'][_0x7d9cb5(0x323)][_0x7d9cb5(0x29a)](this);},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x31e)]=function(){const _0x90b153=_0x3bcbd5;this['_stateRetainType']='',this['_stateData']={},this[_0x90b153(0x2ab)]={},this[_0x90b153(0x281)]={};},Game_BattlerBase[_0x3bcbd5(0x189)]['checkCacheKey']=function(_0x278c5a){const _0x1286e6=_0x3bcbd5;return this[_0x1286e6(0x2a4)]=this[_0x1286e6(0x2a4)]||{},this['_cache'][_0x278c5a]!==undefined;},VisuMZ[_0x3bcbd5(0x396)]['Game_BattlerBase_refresh']=Game_BattlerBase[_0x3bcbd5(0x189)]['refresh'],Game_BattlerBase[_0x3bcbd5(0x189)]['refresh']=function(){const _0x31e6d5=_0x3bcbd5;this['_cache']={},VisuMZ[_0x31e6d5(0x396)][_0x31e6d5(0x2fd)][_0x31e6d5(0x29a)](this);},VisuMZ['SkillsStatesCore'][_0x3bcbd5(0x339)]=Game_BattlerBase['prototype'][_0x3bcbd5(0x1dc)],Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x1dc)]=function(_0x17e01e){const _0x24d960=_0x3bcbd5;let _0x2e9f29=this[_0x24d960(0x327)](_0x17e01e);VisuMZ[_0x24d960(0x396)][_0x24d960(0x339)]['call'](this,_0x17e01e);if(_0x2e9f29&&!this['isStateAffected'](_0x17e01e))this[_0x24d960(0x398)](_0x17e01e);},Game_BattlerBase['prototype'][_0x3bcbd5(0x398)]=function(_0x4636dd){const _0x22be71=_0x3bcbd5;this['clearStateData'](_0x4636dd),this[_0x22be71(0x18d)](_0x4636dd),this[_0x22be71(0x26d)](_0x4636dd);},VisuMZ['SkillsStatesCore'][_0x3bcbd5(0x33a)]=Game_BattlerBase['prototype'][_0x3bcbd5(0x388)],Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x388)]=function(_0x323aa0){const _0x168036=_0x3bcbd5,_0x14c6a3=$dataStates[_0x323aa0],_0xd8163d=this[_0x168036(0x1e0)](_0x323aa0),_0x174b4c=this[_0x168036(0x21d)](_0x14c6a3)['toLowerCase']()[_0x168036(0x34e)]();switch(_0x174b4c){case _0x168036(0x367):if(_0xd8163d<=0x0)VisuMZ[_0x168036(0x396)]['Game_BattlerBase_resetStateCounts'][_0x168036(0x29a)](this,_0x323aa0);break;case'reset':VisuMZ[_0x168036(0x396)][_0x168036(0x33a)][_0x168036(0x29a)](this,_0x323aa0);break;case _0x168036(0x39d):VisuMZ['SkillsStatesCore'][_0x168036(0x33a)][_0x168036(0x29a)](this,_0x323aa0),this[_0x168036(0x301)][_0x323aa0]=Math[_0x168036(0x276)](this[_0x168036(0x301)][_0x323aa0],_0xd8163d);break;case _0x168036(0x18e):VisuMZ['SkillsStatesCore'][_0x168036(0x33a)][_0x168036(0x29a)](this,_0x323aa0),this[_0x168036(0x301)][_0x323aa0]+=_0xd8163d;break;default:VisuMZ[_0x168036(0x396)][_0x168036(0x33a)][_0x168036(0x29a)](this,_0x323aa0);break;}},Game_BattlerBase[_0x3bcbd5(0x189)]['getStateReapplyRulings']=function(_0x686d4a){const _0xd5cbce=_0x3bcbd5,_0x5445cb=_0x686d4a[_0xd5cbce(0x1e7)];return _0x5445cb[_0xd5cbce(0x24d)](/<REAPPLY RULES:[ ](.*)>/i)?String(RegExp['$1']):VisuMZ['SkillsStatesCore'][_0xd5cbce(0x2b1)][_0xd5cbce(0x38b)][_0xd5cbce(0x391)];},VisuMZ['SkillsStatesCore'][_0x3bcbd5(0x39c)]=Game_BattlerBase['prototype'][_0x3bcbd5(0x362)],Game_BattlerBase[_0x3bcbd5(0x189)]['overwriteBuffTurns']=function(_0x4b5ff9,_0x28307b){const _0x3fcec5=_0x3bcbd5,_0x1877ac=VisuMZ[_0x3fcec5(0x396)][_0x3fcec5(0x2b1)][_0x3fcec5(0x2b6)][_0x3fcec5(0x391)],_0x19729c=this[_0x3fcec5(0x295)](_0x4b5ff9);switch(_0x1877ac){case'ignore':if(_0x19729c<=0x0)this[_0x3fcec5(0x25f)][_0x4b5ff9]=_0x28307b;break;case _0x3fcec5(0x282):this[_0x3fcec5(0x25f)][_0x4b5ff9]=_0x28307b;break;case _0x3fcec5(0x39d):this[_0x3fcec5(0x25f)][_0x4b5ff9]=Math[_0x3fcec5(0x276)](_0x19729c,_0x28307b);break;case'add':this[_0x3fcec5(0x25f)][_0x4b5ff9]+=_0x28307b;break;default:VisuMZ[_0x3fcec5(0x396)]['Game_BattlerBase_overwriteBuffTurns'][_0x3fcec5(0x29a)](this,_0x4b5ff9,_0x28307b);break;}const _0x264e20=VisuMZ[_0x3fcec5(0x396)][_0x3fcec5(0x2b1)][_0x3fcec5(0x2b6)][_0x3fcec5(0x1a4)];this[_0x3fcec5(0x25f)][_0x4b5ff9]=this['_buffTurns'][_0x4b5ff9][_0x3fcec5(0x220)](0x0,_0x264e20);},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x329)]=function(){const _0x2d2c8d=_0x3bcbd5;if(this[_0x2d2c8d(0x2a4)][_0x2d2c8d(0x386)]!==undefined)return this[_0x2d2c8d(0x2a4)]['groupDefeat'];this['_cache'][_0x2d2c8d(0x386)]=![];const _0x29e72e=this[_0x2d2c8d(0x23b)]();for(const _0x4d556b of _0x29e72e){if(!_0x4d556b)continue;if(_0x4d556b['note']['match'](/<GROUP DEFEAT>/i)){this[_0x2d2c8d(0x2a4)][_0x2d2c8d(0x386)]=!![];break;}}return this[_0x2d2c8d(0x2a4)][_0x2d2c8d(0x386)];},VisuMZ[_0x3bcbd5(0x396)]['Game_BattlerBase_clearStates']=Game_BattlerBase['prototype'][_0x3bcbd5(0x389)],Game_BattlerBase['prototype'][_0x3bcbd5(0x389)]=function(){const _0x1a8b60=_0x3bcbd5;this[_0x1a8b60(0x21e)]()!==''?this['clearStatesWithStateRetain']():(VisuMZ[_0x1a8b60(0x396)][_0x1a8b60(0x249)][_0x1a8b60(0x29a)](this),this[_0x1a8b60(0x31e)]());},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x346)]=function(){const _0x1654c3=_0x3bcbd5,_0x4da82d=this[_0x1654c3(0x23b)]();for(const _0x95253a of _0x4da82d){if(_0x95253a&&this[_0x1654c3(0x24f)](_0x95253a))this['eraseState'](_0x95253a['id']);}this[_0x1654c3(0x2a4)]={};},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x24f)]=function(_0x2570e2){const _0x27adde=_0x3bcbd5,_0x4cdb34=this[_0x27adde(0x21e)]();if(_0x4cdb34!==''){const _0x2f29ce=_0x2570e2[_0x27adde(0x1e7)];if(_0x4cdb34===_0x27adde(0x317)&&_0x2f29ce[_0x27adde(0x24d)](/<NO DEATH CLEAR>/i))return![];if(_0x4cdb34===_0x27adde(0x314)&&_0x2f29ce['match'](/<NO RECOVER ALL CLEAR>/i))return![];}return this['isStateAffected'](_0x2570e2['id']);},Game_BattlerBase[_0x3bcbd5(0x189)]['getStateRetainType']=function(){const _0x554717=_0x3bcbd5;return this[_0x554717(0x2f7)];},Game_BattlerBase[_0x3bcbd5(0x189)]['setStateRetainType']=function(_0x5cd6f8){const _0x199ff4=_0x3bcbd5;this[_0x199ff4(0x2f7)]=_0x5cd6f8;},Game_BattlerBase[_0x3bcbd5(0x189)]['clearStateRetainType']=function(){this['_stateRetainType']='';},VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x297)]=Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x1cd)],Game_BattlerBase['prototype'][_0x3bcbd5(0x1cd)]=function(){const _0x2a353e=_0x3bcbd5;this[_0x2a353e(0x3a3)]('death'),VisuMZ['SkillsStatesCore'][_0x2a353e(0x297)][_0x2a353e(0x29a)](this),this[_0x2a353e(0x26b)]();},VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x194)]=Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x262)],Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x262)]=function(){const _0x26333d=_0x3bcbd5;this[_0x26333d(0x3a3)](_0x26333d(0x314)),VisuMZ[_0x26333d(0x396)][_0x26333d(0x194)][_0x26333d(0x29a)](this),this[_0x26333d(0x26b)]();},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x290)]=function(_0x109a8c){const _0x4ee2a1=_0x3bcbd5;for(settings of VisuMZ[_0x4ee2a1(0x396)][_0x4ee2a1(0x2b1)]['Costs']){const _0x33c5cf=settings[_0x4ee2a1(0x31c)][_0x4ee2a1(0x29a)](this,_0x109a8c);if(!settings[_0x4ee2a1(0x2e1)][_0x4ee2a1(0x29a)](this,_0x109a8c,_0x33c5cf))return![];}return!![];},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x17a)]=function(_0x3e45a4){const _0x231956=_0x3bcbd5;for(settings of VisuMZ['SkillsStatesCore']['Settings'][_0x231956(0x34b)]){const _0xf7810c=settings[_0x231956(0x31c)][_0x231956(0x29a)](this,_0x3e45a4);settings[_0x231956(0x203)][_0x231956(0x29a)](this,_0x3e45a4,_0xf7810c);}},VisuMZ['SkillsStatesCore']['Game_BattlerBase_meetsSkillConditions']=Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x32f)],Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x32f)]=function(_0x503514){const _0xe54347=_0x3bcbd5;if(!_0x503514)return![];if(!VisuMZ['SkillsStatesCore']['Game_BattlerBase_meetsSkillConditions'][_0xe54347(0x29a)](this,_0x503514))return![];if(!this[_0xe54347(0x30e)](_0x503514))return![];if(!this[_0xe54347(0x392)](_0x503514))return![];if(!this[_0xe54347(0x31b)](_0x503514))return![];return!![];},Game_BattlerBase[_0x3bcbd5(0x189)]['checkSkillConditionsNotetags']=function(_0x4c57b7){const _0x4a411c=_0x3bcbd5;if(!this[_0x4a411c(0x181)](_0x4c57b7))return![];return!![];},Game_BattlerBase['prototype'][_0x3bcbd5(0x181)]=function(_0x3ef8e5){const _0x4d35ea=_0x3bcbd5,_0x5b849f=_0x3ef8e5[_0x4d35ea(0x1e7)];if(_0x5b849f[_0x4d35ea(0x24d)](/<ENABLE[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x1a43be=JSON[_0x4d35ea(0x1d8)]('['+RegExp['$1'][_0x4d35ea(0x24d)](/\d+/g)+']');for(const _0x11948d of _0x1a43be){if(!$gameSwitches['value'](_0x11948d))return![];}return!![];}if(_0x5b849f[_0x4d35ea(0x24d)](/<ENABLE ALL[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x42a517=JSON[_0x4d35ea(0x1d8)]('['+RegExp['$1'][_0x4d35ea(0x24d)](/\d+/g)+']');for(const _0x33d257 of _0x42a517){if(!$gameSwitches[_0x4d35ea(0x275)](_0x33d257))return![];}return!![];}if(_0x5b849f[_0x4d35ea(0x24d)](/<ENABLE ANY[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x307fa8=JSON[_0x4d35ea(0x1d8)]('['+RegExp['$1'][_0x4d35ea(0x24d)](/\d+/g)+']');for(const _0xd565ed of _0x307fa8){if($gameSwitches[_0x4d35ea(0x275)](_0xd565ed))return!![];}return![];}if(_0x5b849f[_0x4d35ea(0x24d)](/<DISABLE[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x43288e=JSON[_0x4d35ea(0x1d8)]('['+RegExp['$1'][_0x4d35ea(0x24d)](/\d+/g)+']');for(const _0x523749 of _0x43288e){if(!$gameSwitches[_0x4d35ea(0x275)](_0x523749))return!![];}return![];}if(_0x5b849f[_0x4d35ea(0x24d)](/<DISABLE ALL[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x5489eb=JSON['parse']('['+RegExp['$1'][_0x4d35ea(0x24d)](/\d+/g)+']');for(const _0x5b7427 of _0x5489eb){if(!$gameSwitches[_0x4d35ea(0x275)](_0x5b7427))return!![];}return![];}if(_0x5b849f['match'](/<DISABLE ANY[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x42d1ee=JSON[_0x4d35ea(0x1d8)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x14277f of _0x42d1ee){if($gameSwitches[_0x4d35ea(0x275)](_0x14277f))return![];}return!![];}return!![];},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x392)]=function(_0x545b8e){const _0x69b8ee=_0x3bcbd5,_0x5cf300=_0x545b8e[_0x69b8ee(0x1e7)],_0xc7417b=VisuMZ['SkillsStatesCore'][_0x69b8ee(0x206)];return _0xc7417b[_0x545b8e['id']]?_0xc7417b[_0x545b8e['id']][_0x69b8ee(0x29a)](this,_0x545b8e):!![];},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x31b)]=function(_0x40aaa8){const _0x662bd2=_0x3bcbd5;return VisuMZ[_0x662bd2(0x396)][_0x662bd2(0x2b1)]['Skills'][_0x662bd2(0x30c)]['call'](this,_0x40aaa8);},VisuMZ[_0x3bcbd5(0x396)]['Game_BattlerBase_skillMpCost']=Game_BattlerBase['prototype'][_0x3bcbd5(0x204)],Game_BattlerBase[_0x3bcbd5(0x189)]['skillMpCost']=function(_0x150a9f){const _0x498eec=_0x3bcbd5;for(settings of VisuMZ[_0x498eec(0x396)][_0x498eec(0x2b1)][_0x498eec(0x34b)]){if(settings['Name']['toUpperCase']()==='MP')return settings[_0x498eec(0x31c)][_0x498eec(0x29a)](this,_0x150a9f);}return VisuMZ[_0x498eec(0x396)][_0x498eec(0x245)]['call'](this,_0x150a9f);},VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x2eb)]=Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x1fb)],Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x1fb)]=function(_0x2840ae){const _0x472eac=_0x3bcbd5;for(settings of VisuMZ[_0x472eac(0x396)]['Settings']['Costs']){if(settings[_0x472eac(0x285)][_0x472eac(0x2e3)]()==='TP')return settings[_0x472eac(0x31c)][_0x472eac(0x29a)](this,_0x2840ae);}return VisuMZ['SkillsStatesCore']['Game_BattlerBase_skillTpCost'][_0x472eac(0x29a)](this,_0x2840ae);},Game_BattlerBase[_0x3bcbd5(0x189)]['hasState']=function(_0x1912ea){const _0x56477d=_0x3bcbd5;if(typeof _0x1912ea===_0x56477d(0x35f))_0x1912ea=$dataStates[_0x1912ea];return this[_0x56477d(0x23b)]()['includes'](_0x1912ea);},VisuMZ[_0x3bcbd5(0x396)]['Game_BattlerBase_states']=Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x23b)],Game_BattlerBase['prototype'][_0x3bcbd5(0x23b)]=function(){const _0x3d9661=_0x3bcbd5;let _0x242e9a=VisuMZ[_0x3d9661(0x396)][_0x3d9661(0x218)][_0x3d9661(0x29a)](this);return this['addPassiveStates'](_0x242e9a),_0x242e9a;},Game_BattlerBase['prototype'][_0x3bcbd5(0x32b)]=function(_0x415ed4){const _0x2b9622=_0x3bcbd5,_0x44b3ed=this[_0x2b9622(0x311)]();for(state of _0x44b3ed){if(!state)continue;if(!this[_0x2b9622(0x32e)](state)&&_0x415ed4[_0x2b9622(0x1cf)](state))continue;_0x415ed4[_0x2b9622(0x264)](state);}_0x44b3ed[_0x2b9622(0x2c5)]>0x0&&_0x415ed4['sort']((_0x5d3c03,_0x4f122d)=>{const _0x5b5f38=_0x2b9622,_0x1759ae=_0x5d3c03[_0x5b5f38(0x333)],_0x237a75=_0x4f122d[_0x5b5f38(0x333)];if(_0x1759ae!==_0x237a75)return _0x237a75-_0x1759ae;return _0x5d3c03-_0x4f122d;});},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x32e)]=function(_0x589c79){const _0x5e33ac=_0x3bcbd5;return _0x589c79[_0x5e33ac(0x1e7)]['match'](/<PASSIVE STACKABLE>/i);},Game_BattlerBase['prototype']['convertPassiveStates']=function(){const _0x1c47f3=_0x3bcbd5,_0x1bade0=[];for(const _0x4ace0e of this[_0x1c47f3(0x2a4)]['passiveStates']){const _0x1b9a68=$dataStates[_0x4ace0e];if(!_0x1b9a68)continue;if(!this[_0x1c47f3(0x349)](_0x1b9a68))continue;_0x1bade0[_0x1c47f3(0x264)](_0x1b9a68);}return _0x1bade0;},Game_BattlerBase['prototype'][_0x3bcbd5(0x349)]=function(_0x323cb8){const _0x4f296d=_0x3bcbd5;if(!this['meetsPassiveStateConditionClasses'](_0x323cb8))return![];if(!this[_0x4f296d(0x306)](_0x323cb8))return![];if(!this[_0x4f296d(0x241)](_0x323cb8))return![];if(!this[_0x4f296d(0x2f3)](_0x323cb8))return![];return!![];},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x1ae)]=function(_0x31b92b){return!![];},Game_Actor[_0x3bcbd5(0x189)][_0x3bcbd5(0x1ae)]=function(_0x5c7c68){const _0x341d1e=_0x3bcbd5,_0x3aeead=_0x5c7c68[_0x341d1e(0x1e7)];if(_0x3aeead['match'](/<PASSIVE CONDITION[ ](?:CLASS|CLASSES):[ ](.*)>/i)){const _0x4921ce=String(RegExp['$1'])[_0x341d1e(0x1a9)](',')['map'](_0x147ec8=>_0x147ec8[_0x341d1e(0x34e)]()),_0x4b021f=VisuMZ[_0x341d1e(0x396)]['ParseClassIDs'](_0x4921ce);return _0x4b021f[_0x341d1e(0x1cf)](this[_0x341d1e(0x2a6)]());}if(_0x3aeead[_0x341d1e(0x24d)](/<PASSIVE CONDITION[ ](?:MULTICLASS|MULTICLASSES):[ ](.*)>/i)){const _0x8f34=String(RegExp['$1'])[_0x341d1e(0x1a9)](',')['map'](_0x34292f=>_0x34292f[_0x341d1e(0x34e)]()),_0xc302ee=VisuMZ['SkillsStatesCore'][_0x341d1e(0x33d)](_0x8f34);let _0x12bbb1=[this[_0x341d1e(0x2a6)]()];return Imported[_0x341d1e(0x1e4)]&&this[_0x341d1e(0x2b5)]&&(_0x12bbb1=this[_0x341d1e(0x2b5)]()),_0xc302ee[_0x341d1e(0x2a8)](_0x1af534=>_0x12bbb1[_0x341d1e(0x1cf)](_0x1af534))[_0x341d1e(0x2c5)]>0x0;}return Game_BattlerBase[_0x341d1e(0x189)][_0x341d1e(0x1ae)][_0x341d1e(0x29a)](this,_0x5c7c68);},VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x33d)]=function(_0x34530b){const _0x1e8986=_0x3bcbd5,_0x35d51f=[];for(let _0xebb254 of _0x34530b){_0xebb254=(String(_0xebb254)||'')[_0x1e8986(0x34e)]();const _0x2de6f9=/^\d+$/[_0x1e8986(0x23a)](_0xebb254);_0x2de6f9?_0x35d51f[_0x1e8986(0x264)](Number(_0xebb254)):_0x35d51f[_0x1e8986(0x264)](DataManager[_0x1e8986(0x201)](_0xebb254));}return _0x35d51f[_0x1e8986(0x244)](_0xf896f5=>$dataClasses[Number(_0xf896f5)])[_0x1e8986(0x1f8)](null);},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x306)]=function(_0x4d3352){const _0x56aa8a=_0x3bcbd5,_0x21bde6=_0x4d3352[_0x56aa8a(0x1e7)];if(_0x21bde6[_0x56aa8a(0x24d)](/<PASSIVE CONDITION[ ](?:SWITCH|SWITCHES)[ ]ON:[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x3dfead=JSON[_0x56aa8a(0x1d8)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x3da0c9 of _0x3dfead){if(!$gameSwitches[_0x56aa8a(0x275)](_0x3da0c9))return![];}return!![];}if(_0x21bde6[_0x56aa8a(0x24d)](/<PASSIVE CONDITION ALL[ ](?:SWITCH|SWITCHES)[ ]ON:[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x28ec87=JSON[_0x56aa8a(0x1d8)]('['+RegExp['$1'][_0x56aa8a(0x24d)](/\d+/g)+']');for(const _0x484252 of _0x28ec87){if(!$gameSwitches['value'](_0x484252))return![];}return!![];}if(_0x21bde6['match'](/<PASSIVE CONDITION ANY[ ](?:SWITCH|SWITCHES)[ ]ON:[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x31f65e=JSON[_0x56aa8a(0x1d8)]('['+RegExp['$1'][_0x56aa8a(0x24d)](/\d+/g)+']');for(const _0x2c3fdd of _0x31f65e){if($gameSwitches[_0x56aa8a(0x275)](_0x2c3fdd))return!![];}return![];}if(_0x21bde6[_0x56aa8a(0x24d)](/<PASSIVE CONDITION[ ](?:SWITCH|SWITCHES)[ ]OFF:[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0xefd7f2=JSON[_0x56aa8a(0x1d8)]('['+RegExp['$1'][_0x56aa8a(0x24d)](/\d+/g)+']');for(const _0x3d3240 of _0xefd7f2){if(!$gameSwitches[_0x56aa8a(0x275)](_0x3d3240))return!![];}return![];}if(_0x21bde6[_0x56aa8a(0x24d)](/<PASSIVE CONDITION ALL[ ](?:SWITCH|SWITCHES)[ ]OFF:[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x32bdaa=JSON[_0x56aa8a(0x1d8)]('['+RegExp['$1'][_0x56aa8a(0x24d)](/\d+/g)+']');for(const _0x2703f3 of _0x32bdaa){if(!$gameSwitches[_0x56aa8a(0x275)](_0x2703f3))return!![];}return![];}if(_0x21bde6[_0x56aa8a(0x24d)](/<PASSIVE CONDITION ANY[ ](?:SWITCH|SWITCHES)[ ]OFF:[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x557c02=JSON['parse']('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x75abdf of _0x557c02){if($gameSwitches[_0x56aa8a(0x275)](_0x75abdf))return![];}return!![];}return!![];},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x241)]=function(_0x148f0d){const _0x4270ce=_0x3bcbd5,_0x50e217=VisuMZ[_0x4270ce(0x396)][_0x4270ce(0x221)];if(_0x50e217[_0x148f0d['id']]&&!_0x50e217[_0x148f0d['id']][_0x4270ce(0x29a)](this,_0x148f0d))return![];return!![];},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x2f3)]=function(_0x333a68){const _0x33fd3a=_0x3bcbd5;return VisuMZ['SkillsStatesCore'][_0x33fd3a(0x2b1)][_0x33fd3a(0x1fa)]['PassiveConditionJS'][_0x33fd3a(0x29a)](this,_0x333a68);},Game_BattlerBase[_0x3bcbd5(0x189)]['passiveStates']=function(){const _0x5cdb4b=_0x3bcbd5;if(this[_0x5cdb4b(0x2aa)])return[];this[_0x5cdb4b(0x2aa)]=!![];if(this['checkCacheKey'](_0x5cdb4b(0x311)))return this[_0x5cdb4b(0x28e)]();return this[_0x5cdb4b(0x2a4)][_0x5cdb4b(0x311)]=[],this[_0x5cdb4b(0x288)](),this['addPassiveStatesByNotetag'](),this[_0x5cdb4b(0x1ef)](),this[_0x5cdb4b(0x2aa)]=undefined,this[_0x5cdb4b(0x28e)]();},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x288)]=function(){const _0x3db207=_0x3bcbd5;if(Imported[_0x3db207(0x2ce)])this['addPassiveStatesTraitSets']();},Game_BattlerBase['prototype']['passiveStateObjects']=function(){return[];},Game_BattlerBase[_0x3bcbd5(0x189)]['addPassiveStatesByNotetag']=function(){const _0x560792=_0x3bcbd5,_0x5a4318=this[_0x560792(0x34f)]();for(const _0x7a01b6 of _0x5a4318){if(!_0x7a01b6)continue;const _0x4d47e4=_0x7a01b6[_0x560792(0x1e7)]['match'](/<PASSIVE (?:STATE|STATES):[ ](.*)>/gi);if(_0x4d47e4)for(const _0x4dd8af of _0x4d47e4){_0x4dd8af[_0x560792(0x24d)](/<PASSIVE (?:STATE|STATES):[ ](.*)>/i);const _0x140701=RegExp['$1'];if(_0x140701[_0x560792(0x24d)](/(\d+(?:\s*,\s*\d+)*)/i)){const _0x659d6c=JSON[_0x560792(0x1d8)]('['+RegExp['$1'][_0x560792(0x24d)](/\d+/g)+']');this['_cache'][_0x560792(0x311)]=this[_0x560792(0x2a4)][_0x560792(0x311)][_0x560792(0x1a3)](_0x659d6c);}else{const _0x258dcb=_0x140701['split'](',');for(const _0x4c2715 of _0x258dcb){const _0x782928=DataManager[_0x560792(0x2d6)](_0x4c2715);if(_0x782928)this['_cache'][_0x560792(0x311)][_0x560792(0x264)](_0x782928);}}}}},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x1ef)]=function(){const _0x5f1638=_0x3bcbd5,_0x1e385b=VisuMZ[_0x5f1638(0x396)][_0x5f1638(0x2b1)][_0x5f1638(0x1fa)]['Global'];this[_0x5f1638(0x2a4)][_0x5f1638(0x311)]=this[_0x5f1638(0x2a4)][_0x5f1638(0x311)][_0x5f1638(0x1a3)](_0x1e385b);},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x1e0)]=function(_0xc23277){const _0x151f26=_0x3bcbd5;if(typeof _0xc23277!==_0x151f26(0x35f))_0xc23277=_0xc23277['id'];return this[_0x151f26(0x301)][_0xc23277]||0x0;},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x266)]=function(_0x1a9ec1,_0x258d04){const _0x425081=_0x3bcbd5;if(typeof _0x1a9ec1!=='number')_0x1a9ec1=_0x1a9ec1['id'];if(this[_0x425081(0x327)](_0x1a9ec1)){const _0x3d526d=DataManager[_0x425081(0x326)](_0x1a9ec1);this['_stateTurns'][_0x1a9ec1]=_0x258d04[_0x425081(0x220)](0x0,_0x3d526d);if(this[_0x425081(0x301)][_0x1a9ec1]<=0x0)this[_0x425081(0x2e0)](_0x1a9ec1);}},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x248)]=function(_0x14eddb,_0x2a7b21){const _0x28feaa=_0x3bcbd5;if(typeof _0x14eddb!==_0x28feaa(0x35f))_0x14eddb=_0x14eddb['id'];this['isStateAffected'](_0x14eddb)&&(_0x2a7b21+=this[_0x28feaa(0x1e0)](_0x14eddb),this['setStateTurns'](_0x14eddb,_0x2a7b21));},VisuMZ[_0x3bcbd5(0x396)]['Game_BattlerBase_eraseBuff']=Game_BattlerBase['prototype'][_0x3bcbd5(0x2b9)],Game_BattlerBase['prototype'][_0x3bcbd5(0x2b9)]=function(_0x4bda87){const _0x32e980=_0x3bcbd5,_0x589779=this[_0x32e980(0x2da)][_0x4bda87];VisuMZ['SkillsStatesCore'][_0x32e980(0x1a8)][_0x32e980(0x29a)](this,_0x4bda87);if(_0x589779>0x0)this['onEraseBuff'](_0x4bda87);if(_0x589779<0x0)this[_0x32e980(0x19d)](_0x4bda87);},VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x289)]=Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x1bc)],Game_BattlerBase['prototype'][_0x3bcbd5(0x1bc)]=function(_0x489b90){const _0x26f654=_0x3bcbd5;VisuMZ[_0x26f654(0x396)][_0x26f654(0x289)][_0x26f654(0x29a)](this,_0x489b90);if(!this['isBuffOrDebuffAffected'](_0x489b90))this['eraseBuff'](_0x489b90);},VisuMZ[_0x3bcbd5(0x396)]['Game_BattlerBase_decreaseBuff']=Game_BattlerBase['prototype']['decreaseBuff'],Game_BattlerBase[_0x3bcbd5(0x189)]['decreaseBuff']=function(_0x7ddc8){const _0x43dac8=_0x3bcbd5;VisuMZ[_0x43dac8(0x396)]['Game_BattlerBase_decreaseBuff']['call'](this,_0x7ddc8);if(!this[_0x43dac8(0x321)](_0x7ddc8))this[_0x43dac8(0x2b9)](_0x7ddc8);},Game_BattlerBase['prototype'][_0x3bcbd5(0x1b0)]=function(_0x58c63e){},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x19d)]=function(_0x1884d7){},Game_BattlerBase['prototype'][_0x3bcbd5(0x385)]=function(_0x1d24b2){const _0x90da9b=_0x3bcbd5;return this[_0x90da9b(0x2da)][_0x1d24b2]===VisuMZ[_0x90da9b(0x396)]['Settings'][_0x90da9b(0x2b6)][_0x90da9b(0x2f8)];},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x308)]=function(_0x4315b6){const _0x55fe0b=_0x3bcbd5;return this['_buffs'][_0x4315b6]===-VisuMZ['SkillsStatesCore'][_0x55fe0b(0x2b1)][_0x55fe0b(0x2b6)]['StackDebuffMax'];},VisuMZ['SkillsStatesCore']['Game_BattlerBase_buffIconIndex']=Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x2d7)],Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x2d7)]=function(_0x2b049d,_0x78823e){const _0x7dd85c=_0x3bcbd5;return _0x2b049d=_0x2b049d[_0x7dd85c(0x220)](-0x2,0x2),VisuMZ[_0x7dd85c(0x396)][_0x7dd85c(0x277)]['call'](this,_0x2b049d,_0x78823e);},Game_BattlerBase['prototype']['paramBuffRate']=function(_0x845e62){const _0x9b3e6=_0x3bcbd5,_0x1588e0=this[_0x9b3e6(0x2da)][_0x845e62];return VisuMZ['SkillsStatesCore'][_0x9b3e6(0x2b1)]['Buffs'][_0x9b3e6(0x2a9)][_0x9b3e6(0x29a)](this,_0x845e62,_0x1588e0);},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x295)]=function(_0x38c434){const _0x5234b0=_0x3bcbd5;return this[_0x5234b0(0x25f)][_0x38c434]||0x0;},Game_BattlerBase[_0x3bcbd5(0x189)]['debuffTurns']=function(_0x125f01){const _0x70f5bf=_0x3bcbd5;return this[_0x70f5bf(0x295)](_0x125f01);},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x192)]=function(_0x5600b3,_0x3da590){const _0x23b1fd=_0x3bcbd5;if(this[_0x23b1fd(0x2f0)](_0x5600b3)){const _0x3bb858=VisuMZ[_0x23b1fd(0x396)][_0x23b1fd(0x2b1)][_0x23b1fd(0x2b6)]['MaxTurns'];this['_buffTurns'][_0x5600b3]=_0x3da590[_0x23b1fd(0x220)](0x0,_0x3bb858);}},Game_BattlerBase[_0x3bcbd5(0x189)]['addBuffTurns']=function(_0x58cb48,_0x4b39bb){const _0x1b65ad=_0x3bcbd5;this[_0x1b65ad(0x2f0)](_0x58cb48)&&(_0x4b39bb+=this[_0x1b65ad(0x295)](stateId),this['setStateTurns'](_0x58cb48,_0x4b39bb));},Game_BattlerBase['prototype'][_0x3bcbd5(0x27f)]=function(_0x11d65a,_0x4cd39f){const _0x2d8a19=_0x3bcbd5;if(this[_0x2d8a19(0x373)](_0x11d65a)){const _0x28588c=VisuMZ['SkillsStatesCore']['Settings'][_0x2d8a19(0x2b6)][_0x2d8a19(0x1a4)];this[_0x2d8a19(0x25f)][_0x11d65a]=_0x4cd39f[_0x2d8a19(0x220)](0x0,_0x28588c);}},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x305)]=function(_0x137ad4,_0x2b1706){const _0x17bf5c=_0x3bcbd5;this[_0x17bf5c(0x373)](_0x137ad4)&&(_0x2b1706+=this[_0x17bf5c(0x295)](stateId),this[_0x17bf5c(0x266)](_0x137ad4,_0x2b1706));},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x2ad)]=function(_0x226e79){const _0x14110a=_0x3bcbd5;if(typeof _0x226e79!=='number')_0x226e79=_0x226e79['id'];return this['_stateData']=this[_0x14110a(0x255)]||{},this[_0x14110a(0x255)][_0x226e79]=this[_0x14110a(0x255)][_0x226e79]||{},this['_stateData'][_0x226e79];},Game_BattlerBase[_0x3bcbd5(0x189)]['getStateData']=function(_0x5aeb2c,_0x5085b8){const _0x3b1fc3=_0x3bcbd5;if(typeof _0x5aeb2c!==_0x3b1fc3(0x35f))_0x5aeb2c=_0x5aeb2c['id'];const _0x21caea=this[_0x3b1fc3(0x2ad)](_0x5aeb2c);return _0x21caea[_0x5085b8];},Game_BattlerBase['prototype'][_0x3bcbd5(0x263)]=function(_0x438772,_0x174f02,_0x16dbc0){const _0x51c77d=_0x3bcbd5;if(typeof _0x438772!==_0x51c77d(0x35f))_0x438772=_0x438772['id'];const _0x4600f9=this[_0x51c77d(0x2ad)](_0x438772);_0x4600f9[_0x174f02]=_0x16dbc0;},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x1c6)]=function(_0x78c2d6){const _0x3b292d=_0x3bcbd5;if(typeof _0x78c2d6!==_0x3b292d(0x35f))_0x78c2d6=_0x78c2d6['id'];this[_0x3b292d(0x255)]=this[_0x3b292d(0x255)]||{},this[_0x3b292d(0x255)][_0x78c2d6]={};},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x1d5)]=function(_0x53f5be){const _0x4a8ce1=_0x3bcbd5;if(typeof _0x53f5be!=='number')_0x53f5be=_0x53f5be['id'];return this[_0x4a8ce1(0x2ab)]=this['_stateDisplay']||{},this[_0x4a8ce1(0x2ab)][_0x53f5be]===undefined&&(this[_0x4a8ce1(0x2ab)][_0x53f5be]=''),this['_stateDisplay'][_0x53f5be];},Game_BattlerBase[_0x3bcbd5(0x189)]['setStateDisplay']=function(_0x136d8f,_0x3dde6f){const _0x4607f7=_0x3bcbd5;if(typeof _0x136d8f!==_0x4607f7(0x35f))_0x136d8f=_0x136d8f['id'];this[_0x4607f7(0x2ab)]=this['_stateDisplay']||{},this[_0x4607f7(0x2ab)][_0x136d8f]=_0x3dde6f;},Game_BattlerBase['prototype'][_0x3bcbd5(0x18d)]=function(_0x524ae7){const _0x43a483=_0x3bcbd5;if(typeof _0x524ae7!==_0x43a483(0x35f))_0x524ae7=_0x524ae7['id'];this['_stateDisplay']=this['_stateDisplay']||{},this[_0x43a483(0x2ab)][_0x524ae7]='';},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x19f)]=function(_0x4834a5){const _0x340ad5=_0x3bcbd5;if(typeof _0x4834a5!=='number')_0x4834a5=_0x4834a5['id'];this[_0x340ad5(0x281)]=this[_0x340ad5(0x281)]||{},this['_stateOrigin'][_0x4834a5]=this[_0x340ad5(0x281)][_0x4834a5]||_0x340ad5(0x223);const _0x2087f2=this[_0x340ad5(0x281)][_0x4834a5];return this[_0x340ad5(0x3a6)](_0x2087f2);},Game_BattlerBase['prototype'][_0x3bcbd5(0x32a)]=function(_0x505c86,_0x3ec32d){const _0x33cf08=_0x3bcbd5;this['_stateOrigin']=this[_0x33cf08(0x281)]||{};const _0x263b35=_0x3ec32d?this[_0x33cf08(0x246)](_0x3ec32d):this[_0x33cf08(0x1ec)]();this['_stateOrigin'][_0x505c86]=_0x263b35;},Game_BattlerBase['prototype'][_0x3bcbd5(0x26d)]=function(_0x7a950a){const _0x4d7405=_0x3bcbd5;this[_0x4d7405(0x281)]=this['_stateOrigin']||{},delete this['_stateOrigin'][_0x7a950a];},Game_BattlerBase['prototype'][_0x3bcbd5(0x1ec)]=function(){const _0x221279=_0x3bcbd5,_0x43b19e=this[_0x221279(0x233)]();return this['convertTargetToStateOriginKey'](_0x43b19e);},Game_BattlerBase['prototype'][_0x3bcbd5(0x233)]=function(){const _0x104a5d=_0x3bcbd5;if($gameParty[_0x104a5d(0x343)]()){if(BattleManager[_0x104a5d(0x22a)])return BattleManager['_subject'];else{if(BattleManager[_0x104a5d(0x2fe)])return BattleManager[_0x104a5d(0x2fe)];}}else{const _0x1f1d27=SceneManager[_0x104a5d(0x296)];if(![Scene_Map,Scene_Item][_0x104a5d(0x1cf)](_0x1f1d27[_0x104a5d(0x198)]))return $gameParty[_0x104a5d(0x371)]();}return this;},Game_BattlerBase['prototype']['convertTargetToStateOriginKey']=function(_0x5a21a8){const _0x1b8863=_0x3bcbd5;if(!_0x5a21a8)return _0x1b8863(0x223);if(_0x5a21a8[_0x1b8863(0x29d)]())return _0x1b8863(0x238)['format'](_0x5a21a8[_0x1b8863(0x190)]());else{const _0x46ca1e='<enemy-%1>'[_0x1b8863(0x34c)](_0x5a21a8[_0x1b8863(0x334)]()),_0x71fa69=_0x1b8863(0x36a)['format'](_0x5a21a8[_0x1b8863(0x1b8)]()),_0x331bbd=_0x1b8863(0x37a)['format']($gameTroop[_0x1b8863(0x20c)]());return _0x1b8863(0x230)['format'](_0x46ca1e,_0x71fa69,_0x331bbd);}return _0x1b8863(0x223);},Game_BattlerBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x3a6)]=function(_0x5ce718){const _0xa82861=_0x3bcbd5;if(_0x5ce718==='user')return this;else{if(_0x5ce718[_0xa82861(0x24d)](/<actor-(\d+)>/i))return $gameActors['actor'](Number(RegExp['$1']));else{if($gameParty['inBattle']()&&_0x5ce718['match'](/<troop-(\d+)>/i)){const _0x503d9a=Number(RegExp['$1']);if(_0x503d9a===$gameTroop[_0xa82861(0x20c)]()){if(_0x5ce718[_0xa82861(0x24d)](/<member-(\d+)>/i))return $gameTroop[_0xa82861(0x23c)]()[Number(RegExp['$1'])];}}if(_0x5ce718['match'](/<enemy-(\d+)>/i))return new Game_Enemy(Number(RegExp['$1']),-0x1f4,-0x1f4);}}return this;},VisuMZ[_0x3bcbd5(0x396)]['Game_Battler_addState']=Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x30a)],Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x30a)]=function(_0x308739){const _0x27aa09=_0x3bcbd5,_0x594d28=this[_0x27aa09(0x17d)](_0x308739);VisuMZ['SkillsStatesCore'][_0x27aa09(0x1df)]['call'](this,_0x308739);if(_0x594d28&&this['hasState']($dataStates[_0x308739])){this[_0x27aa09(0x331)](_0x308739);;}},VisuMZ['SkillsStatesCore'][_0x3bcbd5(0x2df)]=Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x17d)],Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x17d)]=function(_0x198e06){const _0x42a6d0=_0x3bcbd5,_0x46aca3=$dataStates[_0x198e06];if(_0x46aca3&&_0x46aca3[_0x42a6d0(0x1e7)][_0x42a6d0(0x24d)](/<NO DEATH CLEAR>/i))return!this[_0x42a6d0(0x193)](_0x198e06)&&!this[_0x42a6d0(0x1be)](_0x198e06)&&!this[_0x42a6d0(0x294)]['isStateRemoved'](_0x198e06);return VisuMZ[_0x42a6d0(0x396)][_0x42a6d0(0x2df)][_0x42a6d0(0x29a)](this,_0x198e06);},Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x331)]=function(_0x93e310){const _0x315ce1=_0x3bcbd5;this[_0x315ce1(0x32a)](_0x93e310),this[_0x315ce1(0x2ac)](_0x93e310),this[_0x315ce1(0x298)](_0x93e310),this[_0x315ce1(0x31f)](_0x93e310);},Game_Battler['prototype']['onRemoveState']=function(_0x5d5915){const _0x3b7800=_0x3bcbd5;Game_BattlerBase[_0x3b7800(0x189)][_0x3b7800(0x398)][_0x3b7800(0x29a)](this,_0x5d5915),this[_0x3b7800(0x1ee)](_0x5d5915),this[_0x3b7800(0x2e6)](_0x5d5915);},Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x2fb)]=function(_0x108e13){const _0x486c08=_0x3bcbd5;for(const _0x45b050 of this[_0x486c08(0x23b)]()){this[_0x486c08(0x39b)](_0x45b050['id'])&&_0x45b050[_0x486c08(0x1d1)]===_0x108e13&&(this[_0x486c08(0x2e0)](_0x45b050['id']),this[_0x486c08(0x2ed)](_0x45b050['id']),this[_0x486c08(0x197)](_0x45b050['id']));}},Game_Battler[_0x3bcbd5(0x189)]['onExpireState']=function(_0xf59c07){const _0x2d84d8=_0x3bcbd5;this[_0x2d84d8(0x2f5)](_0xf59c07);},Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x298)]=function(_0x47fd37){const _0x4ca7a3=_0x3bcbd5,_0xca9704=VisuMZ[_0x4ca7a3(0x396)][_0x4ca7a3(0x2c6)];if(_0xca9704[_0x47fd37])_0xca9704[_0x47fd37][_0x4ca7a3(0x29a)](this,_0x47fd37);},Game_Battler[_0x3bcbd5(0x189)]['onEraseStateCustomJS']=function(_0x45a76c){const _0x25522a=_0x3bcbd5,_0x43a73b=VisuMZ[_0x25522a(0x396)][_0x25522a(0x1fe)];if(_0x43a73b[_0x45a76c])_0x43a73b[_0x45a76c][_0x25522a(0x29a)](this,_0x45a76c);},Game_Battler[_0x3bcbd5(0x189)]['onExpireStateCustomJS']=function(_0x25c765){const _0x259e2e=_0x3bcbd5,_0x3af8ce=VisuMZ[_0x259e2e(0x396)]['stateExpireJS'];if(_0x3af8ce[_0x25c765])_0x3af8ce[_0x25c765][_0x259e2e(0x29a)](this,_0x25c765);},Game_Battler['prototype'][_0x3bcbd5(0x31f)]=function(_0x22d6e3){const _0x4414da=_0x3bcbd5;try{VisuMZ[_0x4414da(0x396)]['Settings'][_0x4414da(0x38b)]['onAddStateJS'][_0x4414da(0x29a)](this,_0x22d6e3);}catch(_0x46cf20){if($gameTemp[_0x4414da(0x345)]())console[_0x4414da(0x225)](_0x46cf20);}},Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x2e6)]=function(_0x3062f2){const _0x5e1714=_0x3bcbd5;try{VisuMZ['SkillsStatesCore'][_0x5e1714(0x2b1)][_0x5e1714(0x38b)][_0x5e1714(0x2ca)]['call'](this,_0x3062f2);}catch(_0x21215f){if($gameTemp[_0x5e1714(0x345)]())console[_0x5e1714(0x225)](_0x21215f);}},Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x197)]=function(_0x33867d){const _0x1d9b8d=_0x3bcbd5;try{VisuMZ[_0x1d9b8d(0x396)]['Settings'][_0x1d9b8d(0x38b)][_0x1d9b8d(0x215)][_0x1d9b8d(0x29a)](this,_0x33867d);}catch(_0x20bd4e){if($gameTemp['isPlaytest']())console[_0x1d9b8d(0x225)](_0x20bd4e);}},Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x2bd)]=function(_0xa87546){const _0x56aada=_0x3bcbd5;return _0xa87546=_0xa87546[_0x56aada(0x2e3)]()[_0x56aada(0x34e)](),this[_0x56aada(0x23b)]()[_0x56aada(0x2a8)](_0x485480=>_0x485480[_0x56aada(0x378)][_0x56aada(0x1cf)](_0xa87546));},Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x1a5)]=function(_0x38e071,_0x3a3531){const _0x4a6aca=_0x3bcbd5;_0x38e071=_0x38e071['toUpperCase']()['trim'](),_0x3a3531=_0x3a3531||0x0;const _0x36d6a5=this[_0x4a6aca(0x2bd)](_0x38e071),_0x1bf650=[];for(const _0x2c9e03 of _0x36d6a5){if(!_0x2c9e03)continue;if(_0x3a3531<=0x0)return;_0x1bf650[_0x4a6aca(0x264)](_0x2c9e03['id']),this[_0x4a6aca(0x294)][_0x4a6aca(0x21a)]=!![],_0x3a3531--;}while(_0x1bf650[_0x4a6aca(0x2c5)]>0x0){this[_0x4a6aca(0x2e0)](_0x1bf650[_0x4a6aca(0x236)]());}},Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x330)]=function(_0x4bba9f){const _0x27e098=_0x3bcbd5;_0x4bba9f=_0x4bba9f[_0x27e098(0x2e3)]()[_0x27e098(0x34e)]();const _0xc142ea=this[_0x27e098(0x2bd)](_0x4bba9f),_0x511b79=[];for(const _0x55adf3 of _0xc142ea){if(!_0x55adf3)continue;_0x511b79[_0x27e098(0x264)](_0x55adf3['id']),this['_result'][_0x27e098(0x21a)]=!![];}while(_0x511b79[_0x27e098(0x2c5)]>0x0){this[_0x27e098(0x2e0)](_0x511b79[_0x27e098(0x236)]());}},Game_Battler['prototype'][_0x3bcbd5(0x216)]=function(_0x47480d){const _0x103774=_0x3bcbd5;return this[_0x103774(0x1c3)](_0x47480d)>0x0;},Game_Battler[_0x3bcbd5(0x189)]['hasStateCategory']=function(_0x6ae05){const _0x1f5417=_0x3bcbd5;return this[_0x1f5417(0x2b2)](_0x6ae05)>0x0;},Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x1c3)]=function(_0xcdd2f2){const _0x4635e2=_0x3bcbd5,_0x1804d8=this[_0x4635e2(0x2bd)](_0xcdd2f2)[_0x4635e2(0x2a8)](_0x2af992=>this[_0x4635e2(0x327)](_0x2af992['id']));return _0x1804d8[_0x4635e2(0x2c5)];},Game_Battler[_0x3bcbd5(0x189)]['totalStateCategory']=function(_0x1b6ac1){const _0x1c5bb7=_0x3bcbd5,_0x59424c=this[_0x1c5bb7(0x2bd)](_0x1b6ac1);return _0x59424c[_0x1c5bb7(0x2c5)];},VisuMZ['SkillsStatesCore'][_0x3bcbd5(0x363)]=Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x283)],Game_Battler[_0x3bcbd5(0x189)]['addBuff']=function(_0x63136a,_0x4a3f9d){const _0x294440=_0x3bcbd5;VisuMZ['SkillsStatesCore'][_0x294440(0x363)][_0x294440(0x29a)](this,_0x63136a,_0x4a3f9d),this['isBuffAffected'](_0x63136a)&&this['onAddBuff'](_0x63136a,_0x4a3f9d);},VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x207)]=Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x313)],Game_Battler['prototype'][_0x3bcbd5(0x313)]=function(_0x5259c7,_0x592d65){const _0x2aedde=_0x3bcbd5;VisuMZ[_0x2aedde(0x396)][_0x2aedde(0x207)]['call'](this,_0x5259c7,_0x592d65),this[_0x2aedde(0x373)](_0x5259c7)&&this[_0x2aedde(0x384)](_0x5259c7,_0x592d65);},Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x2cf)]=function(){const _0x1348fa=_0x3bcbd5;for(let _0x4c37a5=0x0;_0x4c37a5<this[_0x1348fa(0x188)]();_0x4c37a5++){if(this['isBuffExpired'](_0x4c37a5)){const _0x25abf9=this[_0x1348fa(0x2da)][_0x4c37a5];this[_0x1348fa(0x2de)](_0x4c37a5);if(_0x25abf9>0x0)this['onExpireBuff'](_0x4c37a5);if(_0x25abf9<0x0)this[_0x1348fa(0x278)](_0x4c37a5);}}},Game_Battler[_0x3bcbd5(0x189)]['onAddBuff']=function(_0x4624bb,_0x543af0){const _0x5dc400=_0x3bcbd5;this[_0x5dc400(0x356)](_0x4624bb,_0x543af0);},Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x384)]=function(_0x15e95d,_0x4e9b3c){const _0x342964=_0x3bcbd5;this[_0x342964(0x1c7)](_0x15e95d,_0x4e9b3c);},Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x1b0)]=function(_0xc3ce3){const _0x3e18a9=_0x3bcbd5;Game_BattlerBase['prototype']['onEraseBuff'][_0x3e18a9(0x29a)](this,_0xc3ce3),this[_0x3e18a9(0x2d4)](_0xc3ce3);},Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x19d)]=function(_0x4f5e9f){const _0x32a81e=_0x3bcbd5;Game_BattlerBase[_0x32a81e(0x189)][_0x32a81e(0x19d)][_0x32a81e(0x29a)](this,_0x4f5e9f),this[_0x32a81e(0x2ae)](_0x4f5e9f);},Game_Battler['prototype']['onExpireBuff']=function(_0x2289be){const _0x186c24=_0x3bcbd5;this[_0x186c24(0x340)](_0x2289be);},Game_Battler['prototype'][_0x3bcbd5(0x278)]=function(_0x3c75cb){const _0x4953f4=_0x3bcbd5;this[_0x4953f4(0x279)](_0x3c75cb);},Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x356)]=function(_0x4cd6ad,_0x332c87){const _0x4630c0=_0x3bcbd5;VisuMZ['SkillsStatesCore'][_0x4630c0(0x2b1)][_0x4630c0(0x2b6)]['onAddBuffJS'][_0x4630c0(0x29a)](this,_0x4cd6ad,_0x332c87);},Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x1c7)]=function(_0x3db31e,_0x238338){const _0x2c6105=_0x3bcbd5;VisuMZ[_0x2c6105(0x396)][_0x2c6105(0x2b1)][_0x2c6105(0x2b6)][_0x2c6105(0x31a)][_0x2c6105(0x29a)](this,_0x3db31e,_0x238338);},Game_BattlerBase['prototype'][_0x3bcbd5(0x2d4)]=function(_0x368d91){const _0x53b402=_0x3bcbd5;VisuMZ[_0x53b402(0x396)][_0x53b402(0x2b1)][_0x53b402(0x2b6)][_0x53b402(0x267)][_0x53b402(0x29a)](this,_0x368d91);},Game_BattlerBase['prototype'][_0x3bcbd5(0x2ae)]=function(_0xec5335){const _0x4199df=_0x3bcbd5;VisuMZ[_0x4199df(0x396)][_0x4199df(0x2b1)][_0x4199df(0x2b6)]['onEraseDebuffJS']['call'](this,_0xec5335);},Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x340)]=function(_0x5a7554){const _0x45a2bc=_0x3bcbd5;VisuMZ[_0x45a2bc(0x396)]['Settings']['Buffs']['onExpireBuffJS'][_0x45a2bc(0x29a)](this,_0x5a7554);},Game_Battler['prototype'][_0x3bcbd5(0x279)]=function(_0x19ae72){const _0x8e8bab=_0x3bcbd5;VisuMZ[_0x8e8bab(0x396)]['Settings'][_0x8e8bab(0x2b6)]['onExpireDebuffJS'][_0x8e8bab(0x29a)](this,_0x19ae72);},Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x2ac)]=function(_0x4a0962){const _0x546bd2=_0x3bcbd5,_0x35c0b1=VisuMZ[_0x546bd2(0x396)],_0x752ad3=[_0x546bd2(0x374),_0x546bd2(0x260),_0x546bd2(0x272),_0x546bd2(0x3a1),_0x546bd2(0x370),_0x546bd2(0x232)];for(const _0x2d3350 of _0x752ad3){_0x35c0b1[_0x2d3350][_0x4a0962]&&_0x35c0b1[_0x2d3350][_0x4a0962][_0x546bd2(0x29a)](this,_0x4a0962);}},VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x1de)]=Game_Battler[_0x3bcbd5(0x189)]['regenerateAll'],Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x26a)]=function(){const _0x598f60=_0x3bcbd5;VisuMZ['SkillsStatesCore']['Game_Battler_regenerateAll'][_0x598f60(0x29a)](this),this[_0x598f60(0x1b5)](),this['regenerateAllSkillsStatesCore']();},Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x1b5)]=function(){const _0x416e0c=_0x3bcbd5;for(const _0x468cf6 of this[_0x416e0c(0x311)]()){if(!_0x468cf6)continue;this['onAddStateMakeCustomSlipValues'](_0x468cf6['id']);}},Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x1bd)]=function(){const _0x59010e=_0x3bcbd5;if(!this[_0x59010e(0x214)]())return;const _0x4d3119=this['states']();for(const _0x444c0f of _0x4d3119){if(!_0x444c0f)continue;this['onRegenerateCustomStateDamageOverTime'](_0x444c0f);}},Game_Battler[_0x3bcbd5(0x189)][_0x3bcbd5(0x1eb)]=function(_0x2cc2e1){const _0x20546d=_0x3bcbd5,_0x6f1663=this[_0x20546d(0x372)](_0x2cc2e1['id'],'slipHp')||0x0,_0x38f05a=-this['maxSlipDamage'](),_0x4aa471=Math[_0x20546d(0x276)](_0x6f1663,_0x38f05a);if(_0x4aa471!==0x0)this[_0x20546d(0x26f)](_0x4aa471);const _0x107b23=this['getStateData'](_0x2cc2e1['id'],_0x20546d(0x217))||0x0;if(_0x107b23!==0x0)this[_0x20546d(0x2f1)](_0x107b23);const _0x1b8b5e=this[_0x20546d(0x372)](_0x2cc2e1['id'],_0x20546d(0x26e))||0x0;if(_0x1b8b5e!==0x0)this['gainSilentTp'](_0x1b8b5e);},VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x258)]=Game_Actor[_0x3bcbd5(0x189)][_0x3bcbd5(0x1d7)],Game_Actor[_0x3bcbd5(0x189)]['skillTypes']=function(){const _0x2419cf=_0x3bcbd5,_0x3aafae=VisuMZ['SkillsStatesCore'][_0x2419cf(0x258)][_0x2419cf(0x29a)](this),_0x2834a1=VisuMZ[_0x2419cf(0x396)][_0x2419cf(0x2b1)][_0x2419cf(0x1d9)];let _0x24f225=_0x2834a1[_0x2419cf(0x2c1)];return $gameParty[_0x2419cf(0x343)]()&&(_0x24f225=_0x24f225[_0x2419cf(0x1a3)](_0x2834a1[_0x2419cf(0x1c9)])),_0x3aafae[_0x2419cf(0x2a8)](_0x49dcf6=>!_0x24f225['includes'](_0x49dcf6));},Game_Actor[_0x3bcbd5(0x189)][_0x3bcbd5(0x2e7)]=function(){const _0x1e21dd=_0x3bcbd5;return this['skills']()[_0x1e21dd(0x2a8)](_0x39ae3b=>this[_0x1e21dd(0x2cd)](_0x39ae3b));},Game_Actor[_0x3bcbd5(0x189)]['isSkillUsableForAutoBattle']=function(_0x35f13e){const _0x5b1608=_0x3bcbd5;if(!this['canUse'](_0x35f13e))return![];const _0x7a14fc=this[_0x5b1608(0x1d7)](),_0xe0dc5d=DataManager['getSkillTypes'](_0x35f13e),_0x3965d3=_0x7a14fc[_0x5b1608(0x2a8)](_0x33288c=>_0xe0dc5d['includes'](_0x33288c));return _0x3965d3[_0x5b1608(0x2c5)]>0x0;},Game_Actor[_0x3bcbd5(0x189)]['passiveStateObjects']=function(){const _0x309419=_0x3bcbd5;let _0x27de7b=[this['actor'](),this[_0x309419(0x2a6)]()];_0x27de7b=_0x27de7b[_0x309419(0x1a3)](this[_0x309419(0x22d)]()[_0x309419(0x2a8)](_0x28ce8d=>_0x28ce8d));for(const _0x41ff27 of this[_0x309419(0x1db)]){const _0x45e0b8=$dataSkills[_0x41ff27];if(_0x45e0b8)_0x27de7b[_0x309419(0x264)](_0x45e0b8);}return _0x27de7b;},Game_Actor[_0x3bcbd5(0x189)][_0x3bcbd5(0x1ef)]=function(){const _0x5e0370=_0x3bcbd5;Game_Battler[_0x5e0370(0x189)][_0x5e0370(0x1ef)][_0x5e0370(0x29a)](this);const _0x16447b=VisuMZ[_0x5e0370(0x396)][_0x5e0370(0x2b1)][_0x5e0370(0x1fa)][_0x5e0370(0x17c)];this[_0x5e0370(0x2a4)]['passiveStates']=this[_0x5e0370(0x2a4)][_0x5e0370(0x311)]['concat'](_0x16447b);},VisuMZ['SkillsStatesCore'][_0x3bcbd5(0x21c)]=Game_Actor[_0x3bcbd5(0x189)][_0x3bcbd5(0x2f4)],Game_Actor[_0x3bcbd5(0x189)][_0x3bcbd5(0x2f4)]=function(_0x1ee9c9){const _0x5636e8=_0x3bcbd5;VisuMZ['SkillsStatesCore'][_0x5636e8(0x21c)][_0x5636e8(0x29a)](this,_0x1ee9c9),this['_cache']={};},VisuMZ['SkillsStatesCore'][_0x3bcbd5(0x1b3)]=Game_Actor['prototype'][_0x3bcbd5(0x2e9)],Game_Actor['prototype']['forgetSkill']=function(_0x3efc1a){const _0x2d2a6a=_0x3bcbd5;VisuMZ['SkillsStatesCore']['Game_Actor_forgetSkill'][_0x2d2a6a(0x29a)](this,_0x3efc1a),this['_cache']={};},Game_Enemy[_0x3bcbd5(0x189)][_0x3bcbd5(0x34f)]=function(){const _0x237ecc=_0x3bcbd5;let _0x5ddfc8=[this[_0x237ecc(0x341)]()];return _0x5ddfc8[_0x237ecc(0x1a3)](this[_0x237ecc(0x399)]());},Game_Enemy[_0x3bcbd5(0x189)][_0x3bcbd5(0x1ef)]=function(){const _0x30d4de=_0x3bcbd5;Game_Battler[_0x30d4de(0x189)][_0x30d4de(0x1ef)]['call'](this);const _0xf3f67f=VisuMZ[_0x30d4de(0x396)][_0x30d4de(0x2b1)][_0x30d4de(0x1fa)][_0x30d4de(0x1a7)];this[_0x30d4de(0x2a4)]['passiveStates']=this[_0x30d4de(0x2a4)]['passiveStates'][_0x30d4de(0x1a3)](_0xf3f67f);},Game_Enemy[_0x3bcbd5(0x189)][_0x3bcbd5(0x399)]=function(){const _0x36e1b9=_0x3bcbd5,_0x5accb8=[];for(const _0x3a754d of this[_0x36e1b9(0x341)]()['actions']){const _0x5b7530=$dataSkills[_0x3a754d[_0x36e1b9(0x2b7)]];if(_0x5b7530&&!_0x5accb8[_0x36e1b9(0x1cf)](_0x5b7530))_0x5accb8[_0x36e1b9(0x264)](_0x5b7530);}return _0x5accb8;},Game_Enemy['prototype'][_0x3bcbd5(0x2c8)]=function(_0x500710){const _0x449279=_0x3bcbd5;return this[_0x449279(0x22f)]($dataStates[_0x500710]);},VisuMZ['SkillsStatesCore'][_0x3bcbd5(0x2ba)]=Game_Unit[_0x3bcbd5(0x189)][_0x3bcbd5(0x29f)],Game_Unit['prototype'][_0x3bcbd5(0x29f)]=function(){const _0x45c9cb=_0x3bcbd5;if(this[_0x45c9cb(0x38d)]())return!![];return VisuMZ[_0x45c9cb(0x396)][_0x45c9cb(0x2ba)][_0x45c9cb(0x29a)](this);},Game_Unit[_0x3bcbd5(0x189)][_0x3bcbd5(0x38d)]=function(){const _0x5a38f9=_0x3bcbd5,_0x587857=this['aliveMembers']();for(const _0x2aca82 of _0x587857){if(!_0x2aca82[_0x5a38f9(0x329)]())return![];}return!![];},VisuMZ['SkillsStatesCore'][_0x3bcbd5(0x357)]=Game_Troop[_0x3bcbd5(0x189)][_0x3bcbd5(0x395)],Game_Troop[_0x3bcbd5(0x189)][_0x3bcbd5(0x395)]=function(_0x3e28f8){const _0x33c53e=_0x3bcbd5;VisuMZ[_0x33c53e(0x396)]['Game_Troop_setup'][_0x33c53e(0x29a)](this,_0x3e28f8),this[_0x33c53e(0x31d)]();},Game_Troop['prototype'][_0x3bcbd5(0x31d)]=function(){this['_currentTroopUniqueID']=Graphics['frameCount'];},Game_Troop[_0x3bcbd5(0x189)][_0x3bcbd5(0x20c)]=function(){const _0x175eb7=_0x3bcbd5;return this[_0x175eb7(0x1d2)]=this['_currentTroopUniqueID']||Graphics['frameCount'],this[_0x175eb7(0x1d2)];},Scene_Skill[_0x3bcbd5(0x189)][_0x3bcbd5(0x3a4)]=function(){const _0x5a3b83=_0x3bcbd5;if(ConfigManager[_0x5a3b83(0x29b)]&&ConfigManager[_0x5a3b83(0x382)]!==undefined)return ConfigManager['uiHelpPosition'];else{if(this[_0x5a3b83(0x337)]())return this[_0x5a3b83(0x34d)]()[_0x5a3b83(0x24d)](/LOWER/i);else Scene_ItemBase[_0x5a3b83(0x189)]['isRightInputMode'][_0x5a3b83(0x29a)](this);}},Scene_Skill['prototype'][_0x3bcbd5(0x205)]=function(){const _0x4c4bcf=_0x3bcbd5;if(ConfigManager[_0x4c4bcf(0x29b)]&&ConfigManager[_0x4c4bcf(0x1c2)]!==undefined)return ConfigManager['uiInputPosition'];else return this['isUseSkillsStatesCoreUpdatedLayout']()?this[_0x4c4bcf(0x34d)]()[_0x4c4bcf(0x24d)](/RIGHT/i):Scene_ItemBase['prototype'][_0x4c4bcf(0x205)]['call'](this);},Scene_Skill[_0x3bcbd5(0x189)][_0x3bcbd5(0x34d)]=function(){const _0x179c76=_0x3bcbd5;return VisuMZ[_0x179c76(0x396)][_0x179c76(0x2b1)][_0x179c76(0x1d9)][_0x179c76(0x2c3)];},Scene_Skill[_0x3bcbd5(0x189)]['isUseModernControls']=function(){const _0x1c712f=_0x3bcbd5;return this[_0x1c712f(0x2d3)]&&this[_0x1c712f(0x2d3)][_0x1c712f(0x39f)]();},Scene_Skill['prototype'][_0x3bcbd5(0x337)]=function(){const _0x132f17=_0x3bcbd5;return VisuMZ['SkillsStatesCore'][_0x132f17(0x2b1)]['Skills'][_0x132f17(0x1cc)];},VisuMZ[_0x3bcbd5(0x396)]['Scene_Skill_helpWindowRect']=Scene_Skill[_0x3bcbd5(0x189)][_0x3bcbd5(0x18a)],Scene_Skill[_0x3bcbd5(0x189)]['helpWindowRect']=function(){const _0x4ce470=_0x3bcbd5;return this[_0x4ce470(0x337)]()?this[_0x4ce470(0x33f)]():VisuMZ[_0x4ce470(0x396)]['Scene_Skill_helpWindowRect'][_0x4ce470(0x29a)](this);},Scene_Skill[_0x3bcbd5(0x189)][_0x3bcbd5(0x33f)]=function(){const _0x4a8e98=_0x3bcbd5,_0x1fa6c8=0x0,_0x57f545=this[_0x4a8e98(0x361)](),_0x478e63=Graphics[_0x4a8e98(0x291)],_0x284e00=this[_0x4a8e98(0x1dd)]();return new Rectangle(_0x1fa6c8,_0x57f545,_0x478e63,_0x284e00);},VisuMZ[_0x3bcbd5(0x396)]['Scene_Skill_skillTypeWindowRect']=Scene_Skill[_0x3bcbd5(0x189)][_0x3bcbd5(0x30d)],Scene_Skill[_0x3bcbd5(0x189)][_0x3bcbd5(0x30d)]=function(){const _0x40e19f=_0x3bcbd5;return this[_0x40e19f(0x337)]()?this[_0x40e19f(0x24a)]():VisuMZ['SkillsStatesCore']['Scene_Skill_skillTypeWindowRect'][_0x40e19f(0x29a)](this);},Scene_Skill[_0x3bcbd5(0x189)][_0x3bcbd5(0x24a)]=function(){const _0x1038e8=_0x3bcbd5,_0xd46c46=this[_0x1038e8(0x210)](),_0x948998=this[_0x1038e8(0x28c)](0x3,!![]),_0x22bd0e=this['isRightInputMode']()?Graphics[_0x1038e8(0x291)]-_0xd46c46:0x0,_0x5deed5=this[_0x1038e8(0x2ea)]();return new Rectangle(_0x22bd0e,_0x5deed5,_0xd46c46,_0x948998);},VisuMZ['SkillsStatesCore'][_0x3bcbd5(0x1d0)]=Scene_Skill['prototype']['statusWindowRect'],Scene_Skill['prototype'][_0x3bcbd5(0x1c8)]=function(){const _0x134eea=_0x3bcbd5;return this[_0x134eea(0x337)]()?this[_0x134eea(0x240)]():VisuMZ[_0x134eea(0x396)][_0x134eea(0x1d0)]['call'](this);},Scene_Skill[_0x3bcbd5(0x189)][_0x3bcbd5(0x240)]=function(){const _0x4b2679=_0x3bcbd5,_0x5e1028=Graphics[_0x4b2679(0x291)]-this[_0x4b2679(0x210)](),_0x2e1d1c=this['_skillTypeWindow'][_0x4b2679(0x29e)],_0x598f84=this['isRightInputMode']()?0x0:Graphics[_0x4b2679(0x291)]-_0x5e1028,_0xff5e25=this[_0x4b2679(0x2ea)]();return new Rectangle(_0x598f84,_0xff5e25,_0x5e1028,_0x2e1d1c);},VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x3a7)]=Scene_Skill[_0x3bcbd5(0x189)]['createItemWindow'],Scene_Skill[_0x3bcbd5(0x189)][_0x3bcbd5(0x358)]=function(){const _0x361bbe=_0x3bcbd5;VisuMZ[_0x361bbe(0x396)]['Scene_Skill_createItemWindow']['call'](this),this[_0x361bbe(0x368)]()&&this[_0x361bbe(0x19a)]();},VisuMZ['SkillsStatesCore'][_0x3bcbd5(0x292)]=Scene_Skill['prototype']['itemWindowRect'],Scene_Skill[_0x3bcbd5(0x189)][_0x3bcbd5(0x1b2)]=function(){const _0xa3c99=_0x3bcbd5;if(this['isUseSkillsStatesCoreUpdatedLayout']())return this[_0xa3c99(0x1f3)]();else{const _0x25e7e8=VisuMZ['SkillsStatesCore'][_0xa3c99(0x292)][_0xa3c99(0x29a)](this);return this[_0xa3c99(0x368)]()&&this[_0xa3c99(0x1da)]()&&(_0x25e7e8[_0xa3c99(0x2ee)]-=this[_0xa3c99(0x39e)]()),_0x25e7e8;}},Scene_Skill[_0x3bcbd5(0x189)][_0x3bcbd5(0x1f3)]=function(){const _0x2c8f14=_0x3bcbd5,_0x2b0188=Graphics[_0x2c8f14(0x291)]-this[_0x2c8f14(0x39e)](),_0x1011f0=this[_0x2c8f14(0x1e2)]()-this[_0x2c8f14(0x287)][_0x2c8f14(0x29e)],_0x56ebf5=this[_0x2c8f14(0x205)]()?Graphics[_0x2c8f14(0x291)]-_0x2b0188:0x0,_0x4acb1c=this[_0x2c8f14(0x287)]['y']+this[_0x2c8f14(0x287)][_0x2c8f14(0x29e)];return new Rectangle(_0x56ebf5,_0x4acb1c,_0x2b0188,_0x1011f0);},Scene_Skill[_0x3bcbd5(0x189)][_0x3bcbd5(0x368)]=function(){const _0x10b268=_0x3bcbd5;if(!Imported[_0x10b268(0x1e8)])return![];else return this['isUseSkillsStatesCoreUpdatedLayout']()?!![]:VisuMZ[_0x10b268(0x396)][_0x10b268(0x2b1)][_0x10b268(0x1d9)][_0x10b268(0x1c1)];},Scene_Skill['prototype']['adjustItemWidthByShopStatus']=function(){const _0x3e71b2=_0x3bcbd5;return VisuMZ[_0x3e71b2(0x396)]['Settings']['Skills']['SkillSceneAdjustSkillList'];},Scene_Skill[_0x3bcbd5(0x189)][_0x3bcbd5(0x19a)]=function(){const _0x2f0195=_0x3bcbd5,_0x277764=this[_0x2f0195(0x310)]();this['_shopStatusWindow']=new Window_ShopStatus(_0x277764),this[_0x2f0195(0x1f5)](this[_0x2f0195(0x228)]),this[_0x2f0195(0x35a)][_0x2f0195(0x303)](this[_0x2f0195(0x228)]);const _0xd7e64a=VisuMZ[_0x2f0195(0x396)][_0x2f0195(0x2b1)][_0x2f0195(0x1d9)][_0x2f0195(0x352)];this[_0x2f0195(0x228)]['setBackgroundType'](_0xd7e64a||0x0);},Scene_Skill[_0x3bcbd5(0x189)][_0x3bcbd5(0x310)]=function(){const _0x430d01=_0x3bcbd5;return this['isUseSkillsStatesCoreUpdatedLayout']()?this['shopStatusWindowRectSkillsStatesCore']():VisuMZ['SkillsStatesCore']['Settings']['Skills'][_0x430d01(0x24b)]['call'](this);},Scene_Skill[_0x3bcbd5(0x189)][_0x3bcbd5(0x25e)]=function(){const _0x5f2cf6=_0x3bcbd5,_0x33ea81=this[_0x5f2cf6(0x39e)](),_0x3e1af6=this[_0x5f2cf6(0x35a)]['height'],_0x5ded28=this[_0x5f2cf6(0x205)]()?0x0:Graphics[_0x5f2cf6(0x291)]-this['shopStatusWidth'](),_0x3261e6=this[_0x5f2cf6(0x35a)]['y'];return new Rectangle(_0x5ded28,_0x3261e6,_0x33ea81,_0x3e1af6);},Scene_Skill[_0x3bcbd5(0x189)][_0x3bcbd5(0x39e)]=function(){const _0x172c44=_0x3bcbd5;return Imported['VisuMZ_1_ItemsEquipsCore']?Scene_Shop['prototype'][_0x172c44(0x359)]():0x0;},Scene_Skill[_0x3bcbd5(0x189)]['buttonAssistText1']=function(){const _0x15dd17=_0x3bcbd5;return this[_0x15dd17(0x23d)]&&this[_0x15dd17(0x23d)][_0x15dd17(0x1c0)]?TextManager[_0x15dd17(0x222)]:'';},VisuMZ['SkillsStatesCore'][_0x3bcbd5(0x1ed)]=Sprite_Gauge['prototype'][_0x3bcbd5(0x2e8)],Sprite_Gauge['prototype'][_0x3bcbd5(0x2e8)]=function(){const _0x37e0cf=_0x3bcbd5;VisuMZ[_0x37e0cf(0x396)][_0x37e0cf(0x1ed)][_0x37e0cf(0x29a)](this),this['_costSettings']=null;},VisuMZ['SkillsStatesCore']['Sprite_Gauge_setup']=Sprite_Gauge['prototype'][_0x3bcbd5(0x395)],Sprite_Gauge[_0x3bcbd5(0x189)][_0x3bcbd5(0x395)]=function(_0x17662d,_0x4b94f7){const _0xe6f560=_0x3bcbd5;this[_0xe6f560(0x383)](_0x17662d,_0x4b94f7),_0x4b94f7=_0x4b94f7[_0xe6f560(0x21b)](),VisuMZ[_0xe6f560(0x396)][_0xe6f560(0x36d)][_0xe6f560(0x29a)](this,_0x17662d,_0x4b94f7);},Sprite_Gauge[_0x3bcbd5(0x189)]['setupSkillsStatesCore']=function(_0x490369,_0x5649c7){const _0x4b4368=_0x3bcbd5,_0x57cd52=VisuMZ[_0x4b4368(0x396)][_0x4b4368(0x2b1)][_0x4b4368(0x34b)][_0x4b4368(0x2a8)](_0xa81ebd=>_0xa81ebd[_0x4b4368(0x285)]['toUpperCase']()===_0x5649c7[_0x4b4368(0x2e3)]());_0x57cd52['length']>=0x1?this[_0x4b4368(0x20b)]=_0x57cd52[0x0]:this[_0x4b4368(0x20b)]=null;},VisuMZ['SkillsStatesCore'][_0x3bcbd5(0x324)]=Sprite_Gauge[_0x3bcbd5(0x189)]['currentValue'],Sprite_Gauge[_0x3bcbd5(0x189)]['currentValue']=function(){const _0x2e4b1f=_0x3bcbd5;return this[_0x2e4b1f(0x274)]&&this[_0x2e4b1f(0x20b)]?this['currentValueSkillsStatesCore']():VisuMZ[_0x2e4b1f(0x396)][_0x2e4b1f(0x324)][_0x2e4b1f(0x29a)](this);},Sprite_Gauge[_0x3bcbd5(0x189)][_0x3bcbd5(0x2f6)]=function(){const _0x3e52fb=_0x3bcbd5;return this['_costSettings'][_0x3e52fb(0x229)][_0x3e52fb(0x29a)](this[_0x3e52fb(0x274)]);},VisuMZ[_0x3bcbd5(0x396)]['Sprite_Gauge_currentMaxValue']=Sprite_Gauge[_0x3bcbd5(0x189)][_0x3bcbd5(0x27e)],Sprite_Gauge[_0x3bcbd5(0x189)][_0x3bcbd5(0x27e)]=function(){const _0x23af6b=_0x3bcbd5;return this[_0x23af6b(0x274)]&&this['_costSettings']?this['currentMaxValueSkillsStatesCore']():VisuMZ['SkillsStatesCore'][_0x23af6b(0x37f)][_0x23af6b(0x29a)](this);},Sprite_Gauge[_0x3bcbd5(0x189)]['currentMaxValueSkillsStatesCore']=function(){const _0x30e3bf=_0x3bcbd5;return this[_0x30e3bf(0x20b)][_0x30e3bf(0x1b6)]['call'](this[_0x30e3bf(0x274)]);},VisuMZ['SkillsStatesCore']['Sprite_Gauge_gaugeRate']=Sprite_Gauge['prototype'][_0x3bcbd5(0x2bf)],Sprite_Gauge[_0x3bcbd5(0x189)][_0x3bcbd5(0x2bf)]=function(){const _0x56fc86=_0x3bcbd5,_0x28345a=VisuMZ[_0x56fc86(0x396)][_0x56fc86(0x1a2)][_0x56fc86(0x29a)](this);return _0x28345a[_0x56fc86(0x220)](0x0,0x1);},VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x3a9)]=Sprite_Gauge[_0x3bcbd5(0x189)]['redraw'],Sprite_Gauge[_0x3bcbd5(0x189)][_0x3bcbd5(0x38a)]=function(){const _0x2911e2=_0x3bcbd5;this[_0x2911e2(0x274)]&&this[_0x2911e2(0x20b)]?(this[_0x2911e2(0x366)][_0x2911e2(0x252)](),this[_0x2911e2(0x33e)]()):VisuMZ[_0x2911e2(0x396)][_0x2911e2(0x3a9)]['call'](this);},Sprite_Gauge[_0x3bcbd5(0x189)][_0x3bcbd5(0x381)]=function(){const _0x58f0d0=_0x3bcbd5;let _0x299527=this[_0x58f0d0(0x3a8)]();return Imported[_0x58f0d0(0x2cc)]&&this[_0x58f0d0(0x335)]()&&(_0x299527=VisuMZ[_0x58f0d0(0x379)](_0x299527)),_0x299527;},Sprite_Gauge[_0x3bcbd5(0x189)][_0x3bcbd5(0x33e)]=function(){const _0x518127=_0x3bcbd5;this[_0x518127(0x20b)][_0x518127(0x237)][_0x518127(0x29a)](this);},Sprite_Gauge[_0x3bcbd5(0x189)][_0x3bcbd5(0x2a1)]=function(_0x324ee3,_0x138c06,_0x483fef,_0x14cfc6,_0x555d7b,_0x5441b1){const _0x3a98e0=_0x3bcbd5,_0x3471e5=this[_0x3a98e0(0x2bf)](),_0x20cafc=Math[_0x3a98e0(0x1a0)]((_0x555d7b-0x2)*_0x3471e5),_0x145dad=_0x5441b1-0x2,_0x23a4a5=this[_0x3a98e0(0x17b)]();this[_0x3a98e0(0x366)][_0x3a98e0(0x28a)](_0x483fef,_0x14cfc6,_0x555d7b,_0x5441b1,_0x23a4a5),this[_0x3a98e0(0x366)]['gradientFillRect'](_0x483fef+0x1,_0x14cfc6+0x1,_0x20cafc,_0x145dad,_0x324ee3,_0x138c06);},VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x32c)]=Sprite_StateIcon[_0x3bcbd5(0x189)][_0x3bcbd5(0x2ec)],Sprite_StateIcon[_0x3bcbd5(0x189)][_0x3bcbd5(0x2ec)]=function(){const _0x56a66a=_0x3bcbd5;VisuMZ['SkillsStatesCore'][_0x56a66a(0x32c)]['call'](this),this[_0x56a66a(0x316)]();},Sprite_StateIcon['prototype'][_0x3bcbd5(0x316)]=function(){const _0x309b9e=_0x3bcbd5,_0x5c8b7d=Window_Base[_0x309b9e(0x189)]['lineHeight']();this[_0x309b9e(0x25a)]=new Sprite(),this[_0x309b9e(0x25a)][_0x309b9e(0x366)]=new Bitmap(ImageManager[_0x309b9e(0x338)],_0x5c8b7d),this[_0x309b9e(0x25a)][_0x309b9e(0x1fc)]['x']=this[_0x309b9e(0x1fc)]['x'],this[_0x309b9e(0x25a)][_0x309b9e(0x1fc)]['y']=this[_0x309b9e(0x1fc)]['y'],this[_0x309b9e(0x1d3)](this[_0x309b9e(0x25a)]),this[_0x309b9e(0x36c)]=this[_0x309b9e(0x25a)][_0x309b9e(0x366)];},VisuMZ['SkillsStatesCore'][_0x3bcbd5(0x213)]=Sprite_StateIcon[_0x3bcbd5(0x189)][_0x3bcbd5(0x2b3)],Sprite_StateIcon[_0x3bcbd5(0x189)][_0x3bcbd5(0x2b3)]=function(){const _0xc06813=_0x3bcbd5;VisuMZ[_0xc06813(0x396)][_0xc06813(0x213)]['call'](this),this[_0xc06813(0x25c)]();},Sprite_StateIcon['prototype'][_0x3bcbd5(0x387)]=function(_0x4e2331,_0x512d03,_0x6a2ead,_0x4f183f,_0x429d08){const _0x3ee7f5=_0x3bcbd5;this[_0x3ee7f5(0x36c)]['drawText'](_0x4e2331,_0x512d03,_0x6a2ead,_0x4f183f,this[_0x3ee7f5(0x36c)][_0x3ee7f5(0x29e)],_0x429d08);},Sprite_StateIcon[_0x3bcbd5(0x189)]['updateTurnDisplaySprite']=function(){const _0x254704=_0x3bcbd5;this['resetFontSettings'](),this[_0x254704(0x36c)][_0x254704(0x252)]();const _0x53035e=this[_0x254704(0x274)];if(!_0x53035e)return;const _0x3baa98=_0x53035e[_0x254704(0x23b)]()[_0x254704(0x2a8)](_0x296907=>_0x296907[_0x254704(0x270)]>0x0),_0x42e3a5=[...Array(0x8)[_0x254704(0x1bf)]()]['filter'](_0x4c4662=>_0x53035e[_0x254704(0x1d6)](_0x4c4662)!==0x0),_0x5829b0=this['_animationIndex'],_0x1005d1=_0x3baa98[_0x5829b0];if(_0x1005d1)Window_Base[_0x254704(0x189)][_0x254704(0x227)][_0x254704(0x29a)](this,_0x53035e,_0x1005d1,0x0,0x0),Window_Base[_0x254704(0x189)][_0x254704(0x2e2)]['call'](this,_0x53035e,_0x1005d1,0x0,0x0);else{const _0x2f7a12=_0x42e3a5[_0x5829b0-_0x3baa98['length']];if(!_0x2f7a12)return;Window_Base[_0x254704(0x189)][_0x254704(0x353)][_0x254704(0x29a)](this,_0x53035e,_0x2f7a12,0x0,0x0),Window_Base[_0x254704(0x189)][_0x254704(0x1b4)][_0x254704(0x29a)](this,_0x53035e,_0x2f7a12,0x0,0x0);}},Sprite_StateIcon[_0x3bcbd5(0x189)][_0x3bcbd5(0x2b4)]=function(){const _0x5f0075=_0x3bcbd5;this[_0x5f0075(0x36c)]['fontFace']=$gameSystem['mainFontFace'](),this[_0x5f0075(0x36c)][_0x5f0075(0x2a7)]=$gameSystem['mainFontSize'](),this[_0x5f0075(0x19e)]();},Sprite_StateIcon[_0x3bcbd5(0x189)][_0x3bcbd5(0x19e)]=function(){const _0x4e84fe=_0x3bcbd5;this[_0x4e84fe(0x209)](ColorManager[_0x4e84fe(0x315)]()),this[_0x4e84fe(0x2a3)](ColorManager[_0x4e84fe(0x2be)]());},Sprite_StateIcon[_0x3bcbd5(0x189)]['changeTextColor']=function(_0x22b1f6){const _0x2c7e2e=_0x3bcbd5;this['contents'][_0x2c7e2e(0x1f2)]=_0x22b1f6;},Sprite_StateIcon['prototype'][_0x3bcbd5(0x2a3)]=function(_0x27e415){const _0x5cae1a=_0x3bcbd5;this['contents'][_0x5cae1a(0x2be)]=_0x27e415;},Window_Base[_0x3bcbd5(0x189)][_0x3bcbd5(0x336)]=function(_0x3962d2,_0x210c81,_0xe2f722,_0x5c5b5c,_0x1631f3){const _0x5f0b10=_0x3bcbd5,_0x1cb17b=this['createAllSkillCostText'](_0x3962d2,_0x210c81),_0x43ca9d=this[_0x5f0b10(0x2dd)](_0x1cb17b,_0xe2f722,_0x5c5b5c,_0x1631f3),_0x5ad7c4=_0xe2f722+_0x1631f3-_0x43ca9d[_0x5f0b10(0x2ee)];this[_0x5f0b10(0x1e3)](_0x1cb17b,_0x5ad7c4,_0x5c5b5c,_0x1631f3),this[_0x5f0b10(0x2b4)]();},Window_Base[_0x3bcbd5(0x189)][_0x3bcbd5(0x1f9)]=function(_0x38db15,_0x5bcfa9){const _0x18b5b9=_0x3bcbd5;let _0xf6b2cf='';for(settings of VisuMZ['SkillsStatesCore'][_0x18b5b9(0x2b1)][_0x18b5b9(0x34b)]){if(!this['isSkillCostShown'](_0x38db15,_0x5bcfa9,settings))continue;if(_0xf6b2cf['length']>0x0)_0xf6b2cf+=this[_0x18b5b9(0x2b8)]();_0xf6b2cf+=this['createSkillCostText'](_0x38db15,_0x5bcfa9,settings);}_0xf6b2cf=this['makeAdditionalSkillCostText'](_0x38db15,_0x5bcfa9,_0xf6b2cf);if(_0x5bcfa9[_0x18b5b9(0x1e7)]['match'](/<CUSTOM COST TEXT>\s*([\s\S]*)\s*<\/CUSTOM COST TEXT>/i)){if(_0xf6b2cf['length']>0x0)_0xf6b2cf+=this[_0x18b5b9(0x2b8)]();_0xf6b2cf+=String(RegExp['$1']);}return _0xf6b2cf;},Window_Base[_0x3bcbd5(0x189)]['makeAdditionalSkillCostText']=function(_0x4f1243,_0x1457ec,_0x54f6e2){return _0x54f6e2;},Window_Base[_0x3bcbd5(0x189)][_0x3bcbd5(0x1af)]=function(_0x66c323,_0xa540cf,_0x5f1020){const _0x37e023=_0x3bcbd5,_0x1027b9=_0x5f1020[_0x37e023(0x31c)]['call'](_0x66c323,_0xa540cf);return _0x5f1020[_0x37e023(0x3a5)][_0x37e023(0x29a)](_0x66c323,_0xa540cf,_0x1027b9,_0x5f1020);},Window_Base['prototype'][_0x3bcbd5(0x307)]=function(_0x68dfc5,_0xf1176c,_0x25a07d){const _0x507621=_0x3bcbd5,_0x242593=_0x25a07d[_0x507621(0x31c)][_0x507621(0x29a)](_0x68dfc5,_0xf1176c);return _0x25a07d[_0x507621(0x3a2)][_0x507621(0x29a)](_0x68dfc5,_0xf1176c,_0x242593,_0x25a07d);},Window_Base['prototype']['skillCostSeparator']=function(){return'\x20';},Window_Base['prototype'][_0x3bcbd5(0x29c)]=function(_0x1a5272,_0x415283,_0x88cef,_0xece945){const _0x28442c=_0x3bcbd5;if(!_0x1a5272)return;VisuMZ['SkillsStatesCore'][_0x28442c(0x17e)]['call'](this,_0x1a5272,_0x415283,_0x88cef,_0xece945),this[_0x28442c(0x35d)](_0x1a5272,_0x415283,_0x88cef,_0xece945);},Window_Base[_0x3bcbd5(0x189)]['drawActorIconsAllTurnCounters']=function(_0x16f3ac,_0x5797cb,_0x37e21a,_0x1067d9){const _0x2f01d6=_0x3bcbd5;_0x1067d9=_0x1067d9||0x90;const _0x597f37=ImageManager[_0x2f01d6(0x338)],_0x3c5200=_0x16f3ac[_0x2f01d6(0x265)]()[_0x2f01d6(0x2cb)](0x0,Math[_0x2f01d6(0x1a0)](_0x1067d9/_0x597f37)),_0xfee3dd=_0x16f3ac[_0x2f01d6(0x23b)]()[_0x2f01d6(0x2a8)](_0x252d3b=>_0x252d3b[_0x2f01d6(0x270)]>0x0),_0x5ac758=[...Array(0x8)['keys']()][_0x2f01d6(0x2a8)](_0x579e7b=>_0x16f3ac[_0x2f01d6(0x1d6)](_0x579e7b)!==0x0),_0x56470e=[];let _0x5013e6=_0x5797cb;for(let _0x5d8af7=0x0;_0x5d8af7<_0x3c5200[_0x2f01d6(0x2c5)];_0x5d8af7++){this['resetFontSettings']();const _0x53417a=_0xfee3dd[_0x5d8af7];if(_0x53417a)!_0x56470e[_0x2f01d6(0x1cf)](_0x53417a)&&this[_0x2f01d6(0x227)](_0x16f3ac,_0x53417a,_0x5013e6,_0x37e21a),this[_0x2f01d6(0x2e2)](_0x16f3ac,_0x53417a,_0x5013e6,_0x37e21a),_0x56470e['push'](_0x53417a);else{const _0x52f52a=_0x5ac758[_0x5d8af7-_0xfee3dd[_0x2f01d6(0x2c5)]];this[_0x2f01d6(0x353)](_0x16f3ac,_0x52f52a,_0x5013e6,_0x37e21a),this['drawActorBuffRates'](_0x16f3ac,_0x52f52a,_0x5013e6,_0x37e21a);}_0x5013e6+=_0x597f37;}},Window_Base[_0x3bcbd5(0x189)][_0x3bcbd5(0x227)]=function(_0x13b42f,_0x14eebf,_0x395812,_0x44e782){const _0x192a05=_0x3bcbd5;if(!VisuMZ['SkillsStatesCore'][_0x192a05(0x2b1)][_0x192a05(0x38b)][_0x192a05(0x273)])return;if(!_0x13b42f[_0x192a05(0x327)](_0x14eebf['id']))return;if(_0x14eebf[_0x192a05(0x1d1)]===0x0)return;if(_0x14eebf[_0x192a05(0x1e7)][_0x192a05(0x24d)](/<HIDE STATE TURNS>/i))return;const _0x15ec76=_0x13b42f[_0x192a05(0x1e0)](_0x14eebf['id']),_0x5a42b1=ImageManager[_0x192a05(0x338)],_0x3095a2=ColorManager[_0x192a05(0x394)](_0x14eebf);this[_0x192a05(0x209)](_0x3095a2),this[_0x192a05(0x2a3)](_0x192a05(0x347)),this[_0x192a05(0x36c)][_0x192a05(0x18f)]=!![],this[_0x192a05(0x36c)][_0x192a05(0x2a7)]=VisuMZ[_0x192a05(0x396)][_0x192a05(0x2b1)][_0x192a05(0x38b)][_0x192a05(0x37c)],_0x395812+=VisuMZ[_0x192a05(0x396)][_0x192a05(0x2b1)]['States']['TurnOffsetX'],_0x44e782+=VisuMZ[_0x192a05(0x396)]['Settings'][_0x192a05(0x38b)]['TurnOffsetY'],this[_0x192a05(0x387)](_0x15ec76,_0x395812,_0x44e782,_0x5a42b1,_0x192a05(0x355)),this['contents']['fontBold']=![],this[_0x192a05(0x2b4)]();},Window_Base[_0x3bcbd5(0x189)][_0x3bcbd5(0x2e2)]=function(_0x416507,_0x13ccef,_0x33a63e,_0x51d941){const _0x23dc57=_0x3bcbd5;if(!VisuMZ['SkillsStatesCore'][_0x23dc57(0x2b1)][_0x23dc57(0x38b)][_0x23dc57(0x2f9)])return;const _0x2a7150=ImageManager[_0x23dc57(0x338)],_0x40f48f=ImageManager[_0x23dc57(0x280)]/0x2,_0x50c6f0=ColorManager[_0x23dc57(0x315)]();this[_0x23dc57(0x209)](_0x50c6f0),this[_0x23dc57(0x2a3)](_0x23dc57(0x347)),this[_0x23dc57(0x36c)][_0x23dc57(0x18f)]=!![],this['contents'][_0x23dc57(0x2a7)]=VisuMZ[_0x23dc57(0x396)][_0x23dc57(0x2b1)][_0x23dc57(0x38b)][_0x23dc57(0x1a6)],_0x33a63e+=VisuMZ[_0x23dc57(0x396)][_0x23dc57(0x2b1)][_0x23dc57(0x38b)]['DataOffsetX'],_0x51d941+=VisuMZ[_0x23dc57(0x396)][_0x23dc57(0x2b1)][_0x23dc57(0x38b)][_0x23dc57(0x23e)];const _0x1a0916=String(_0x416507[_0x23dc57(0x1d5)](_0x13ccef['id']));this['drawText'](_0x1a0916,_0x33a63e,_0x51d941,_0x2a7150,_0x23dc57(0x30b)),this[_0x23dc57(0x36c)][_0x23dc57(0x18f)]=![],this[_0x23dc57(0x2b4)]();},Window_Base[_0x3bcbd5(0x189)][_0x3bcbd5(0x353)]=function(_0x3fd169,_0x4bbd32,_0xc2ed2a,_0x5b253a){const _0x10be49=_0x3bcbd5;if(!VisuMZ[_0x10be49(0x396)]['Settings'][_0x10be49(0x2b6)][_0x10be49(0x273)])return;const _0x598782=_0x3fd169[_0x10be49(0x1d6)](_0x4bbd32);if(_0x598782===0x0)return;const _0x4e675a=_0x3fd169['buffTurns'](_0x4bbd32),_0x5ee177=ImageManager[_0x10be49(0x338)],_0x59ac3b=_0x598782>0x0?ColorManager[_0x10be49(0x286)]():ColorManager[_0x10be49(0x1ce)]();this[_0x10be49(0x209)](_0x59ac3b),this[_0x10be49(0x2a3)](_0x10be49(0x347)),this[_0x10be49(0x36c)][_0x10be49(0x18f)]=!![],this[_0x10be49(0x36c)][_0x10be49(0x2a7)]=VisuMZ['SkillsStatesCore'][_0x10be49(0x2b1)][_0x10be49(0x2b6)][_0x10be49(0x37c)],_0xc2ed2a+=VisuMZ[_0x10be49(0x396)]['Settings'][_0x10be49(0x2b6)][_0x10be49(0x2dc)],_0x5b253a+=VisuMZ[_0x10be49(0x396)][_0x10be49(0x2b1)][_0x10be49(0x2b6)][_0x10be49(0x302)],this[_0x10be49(0x387)](_0x4e675a,_0xc2ed2a,_0x5b253a,_0x5ee177,_0x10be49(0x355)),this['contents'][_0x10be49(0x18f)]=![],this[_0x10be49(0x2b4)]();},Window_Base['prototype'][_0x3bcbd5(0x1b4)]=function(_0x48e588,_0x22d294,_0x5287aa,_0x2f73cf){const _0x19e37e=_0x3bcbd5;if(!VisuMZ[_0x19e37e(0x396)][_0x19e37e(0x2b1)][_0x19e37e(0x2b6)]['ShowData'])return;const _0x1fc867=_0x48e588[_0x19e37e(0x37e)](_0x22d294),_0x16f53b=_0x48e588[_0x19e37e(0x1d6)](_0x22d294),_0x1ddf49=ImageManager[_0x19e37e(0x338)],_0xe47c5=ImageManager['iconHeight']/0x2,_0x3b5b39=_0x16f53b>0x0?ColorManager['buffColor']():ColorManager['debuffColor']();this[_0x19e37e(0x209)](_0x3b5b39),this[_0x19e37e(0x2a3)](_0x19e37e(0x347)),this[_0x19e37e(0x36c)][_0x19e37e(0x18f)]=!![],this[_0x19e37e(0x36c)][_0x19e37e(0x2a7)]=VisuMZ[_0x19e37e(0x396)][_0x19e37e(0x2b1)][_0x19e37e(0x2b6)][_0x19e37e(0x1a6)],_0x5287aa+=VisuMZ[_0x19e37e(0x396)][_0x19e37e(0x2b1)][_0x19e37e(0x2b6)][_0x19e37e(0x2e4)],_0x2f73cf+=VisuMZ[_0x19e37e(0x396)][_0x19e37e(0x2b1)][_0x19e37e(0x2b6)]['DataOffsetY'];const _0x215e8c=_0x19e37e(0x1aa)['format'](Math['round'](_0x1fc867*0x64));this['drawText'](_0x215e8c,_0x5287aa,_0x2f73cf,_0x1ddf49,'center'),this[_0x19e37e(0x36c)][_0x19e37e(0x18f)]=![],this['resetFontSettings']();},VisuMZ[_0x3bcbd5(0x396)]['Window_StatusBase_placeGauge']=Window_StatusBase[_0x3bcbd5(0x189)]['placeGauge'],Window_StatusBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x328)]=function(_0x547efb,_0x25efd4,_0x504ba4,_0x57b86e){const _0x3357f3=_0x3bcbd5;if(_0x547efb[_0x3357f3(0x29d)]())_0x25efd4=this['convertGaugeTypeSkillsStatesCore'](_0x547efb,_0x25efd4);this[_0x3357f3(0x37d)](_0x547efb,_0x25efd4,_0x504ba4,_0x57b86e);},Window_StatusBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x37d)]=function(_0x413ab2,_0x316c0f,_0x3cef9b,_0x3eca74){const _0x4bb5a4=_0x3bcbd5;if([_0x4bb5a4(0x25d),_0x4bb5a4(0x375)][_0x4bb5a4(0x1cf)](_0x316c0f[_0x4bb5a4(0x21b)]()))return;VisuMZ[_0x4bb5a4(0x396)]['Window_StatusBase_placeGauge'][_0x4bb5a4(0x29a)](this,_0x413ab2,_0x316c0f,_0x3cef9b,_0x3eca74);},Window_StatusBase[_0x3bcbd5(0x189)][_0x3bcbd5(0x231)]=function(_0x5245d3,_0x3f6bb8){const _0x5938e8=_0x3bcbd5,_0x373b76=_0x5245d3[_0x5938e8(0x2a6)]()[_0x5938e8(0x1e7)];if(_0x3f6bb8==='hp'&&_0x373b76[_0x5938e8(0x24d)](/<REPLACE HP GAUGE:[ ](.*)>/i))return String(RegExp['$1']);else{if(_0x3f6bb8==='mp'&&_0x373b76['match'](/<REPLACE MP GAUGE:[ ](.*)>/i))return String(RegExp['$1']);else return _0x3f6bb8==='tp'&&_0x373b76['match'](/<REPLACE TP GAUGE:[ ](.*)>/i)?String(RegExp['$1']):_0x3f6bb8;}},VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x17e)]=Window_StatusBase[_0x3bcbd5(0x189)]['drawActorIcons'],Window_StatusBase['prototype'][_0x3bcbd5(0x29c)]=function(_0x511b5b,_0x2cb017,_0x1bdd0a,_0x2ba38e){const _0x28449e=_0x3bcbd5;if(!_0x511b5b)return;Window_Base[_0x28449e(0x189)][_0x28449e(0x29c)]['call'](this,_0x511b5b,_0x2cb017,_0x1bdd0a,_0x2ba38e);},VisuMZ['SkillsStatesCore'][_0x3bcbd5(0x195)]=Window_SkillType['prototype'][_0x3bcbd5(0x27b)],Window_SkillType[_0x3bcbd5(0x189)][_0x3bcbd5(0x27b)]=function(_0x394db4){const _0x2fe9b7=_0x3bcbd5;VisuMZ['SkillsStatesCore'][_0x2fe9b7(0x195)][_0x2fe9b7(0x29a)](this,_0x394db4),this[_0x2fe9b7(0x35e)](_0x394db4);},Window_SkillType[_0x3bcbd5(0x189)][_0x3bcbd5(0x35e)]=function(_0x1b9fc2){const _0x15931f=_0x3bcbd5,_0x592be0=new Rectangle(0x0,0x0,_0x1b9fc2[_0x15931f(0x2ee)],_0x1b9fc2[_0x15931f(0x29e)]);this[_0x15931f(0x23f)]=new Window_Base(_0x592be0),this[_0x15931f(0x23f)][_0x15931f(0x20e)]=0x0,this['addChild'](this[_0x15931f(0x23f)]),this['updateCommandNameWindow']();},Window_SkillType[_0x3bcbd5(0x189)][_0x3bcbd5(0x284)]=function(){const _0x598b3b=_0x3bcbd5;Window_Command[_0x598b3b(0x189)][_0x598b3b(0x284)][_0x598b3b(0x29a)](this);if(this[_0x598b3b(0x23f)])this[_0x598b3b(0x1f6)]();},Window_SkillType['prototype'][_0x3bcbd5(0x1f6)]=function(){const _0x2d9e82=_0x3bcbd5,_0x3e42e8=this[_0x2d9e82(0x23f)];_0x3e42e8[_0x2d9e82(0x36c)][_0x2d9e82(0x252)]();const _0x3b08bb=this[_0x2d9e82(0x180)](this[_0x2d9e82(0x1b8)]());if(_0x3b08bb===_0x2d9e82(0x299)&&this[_0x2d9e82(0x1ba)]()>0x0){const _0x119a93=this[_0x2d9e82(0x22b)](this[_0x2d9e82(0x1b8)]());let _0x539d28=this[_0x2d9e82(0x234)](this[_0x2d9e82(0x1b8)]());_0x539d28=_0x539d28[_0x2d9e82(0x354)](/\\I\[(\d+)\]/gi,''),_0x3e42e8['resetFontSettings'](),this[_0x2d9e82(0x344)](_0x539d28,_0x119a93),this[_0x2d9e82(0x235)](_0x539d28,_0x119a93),this['commandNameWindowCenter'](_0x539d28,_0x119a93);}},Window_SkillType[_0x3bcbd5(0x189)][_0x3bcbd5(0x344)]=function(_0x501026,_0x137ebf){},Window_SkillType['prototype']['commandNameWindowDrawText']=function(_0x1f7b7f,_0x4bf8ea){const _0x454a00=_0x3bcbd5,_0x33e00c=this[_0x454a00(0x23f)];_0x33e00c[_0x454a00(0x387)](_0x1f7b7f,0x0,_0x4bf8ea['y'],_0x33e00c[_0x454a00(0x219)],'center');},Window_SkillType[_0x3bcbd5(0x189)][_0x3bcbd5(0x1fd)]=function(_0x4da51a,_0xa3543d){const _0x3475c4=_0x3bcbd5,_0x446bbe=this[_0x3475c4(0x23f)],_0xcee346=$gameSystem['windowPadding'](),_0x16382a=_0xa3543d['x']+Math[_0x3475c4(0x1a0)](_0xa3543d['width']/0x2)+_0xcee346;_0x446bbe['x']=_0x446bbe[_0x3475c4(0x2ee)]/-0x2+_0x16382a,_0x446bbe['y']=Math[_0x3475c4(0x1a0)](_0xa3543d[_0x3475c4(0x29e)]/0x2);},Window_SkillType[_0x3bcbd5(0x189)][_0x3bcbd5(0x39f)]=function(){const _0x332f77=_0x3bcbd5;return Imported[_0x332f77(0x2cc)]&&Window_Command[_0x332f77(0x189)][_0x332f77(0x39f)][_0x332f77(0x29a)](this);},Window_SkillType[_0x3bcbd5(0x189)]['makeCommandList']=function(){const _0x2c3fc9=_0x3bcbd5;if(!this[_0x2c3fc9(0x1a1)])return;const _0x4cfcde=this[_0x2c3fc9(0x1a1)][_0x2c3fc9(0x1d7)]();for(const _0x487562 of _0x4cfcde){const _0x4aeffd=this[_0x2c3fc9(0x2a5)](_0x487562);this[_0x2c3fc9(0x182)](_0x4aeffd,_0x2c3fc9(0x1b1),!![],_0x487562);}},Window_SkillType['prototype']['makeCommandName']=function(_0x32bd11){const _0x3e44f3=_0x3bcbd5;let _0x563b67=$dataSystem[_0x3e44f3(0x1d7)][_0x32bd11];if(_0x563b67[_0x3e44f3(0x24d)](/\\I\[(\d+)\]/i))return _0x563b67;if(this[_0x3e44f3(0x1b7)]()==='text')return _0x563b67;const _0x3912bc=VisuMZ[_0x3e44f3(0x396)][_0x3e44f3(0x2b1)][_0x3e44f3(0x1d9)],_0x594ff7=$dataSystem[_0x3e44f3(0x2ff)][_0x3e44f3(0x1cf)](_0x32bd11),_0x43d2e8=_0x594ff7?_0x3912bc[_0x3e44f3(0x38c)]:_0x3912bc['IconStypeNorm'];return _0x3e44f3(0x21f)[_0x3e44f3(0x34c)](_0x43d2e8,_0x563b67);},Window_SkillType[_0x3bcbd5(0x189)][_0x3bcbd5(0x33c)]=function(){const _0x5e2acb=_0x3bcbd5;return VisuMZ[_0x5e2acb(0x396)][_0x5e2acb(0x2b1)][_0x5e2acb(0x1d9)][_0x5e2acb(0x2d5)];},Window_SkillType[_0x3bcbd5(0x189)][_0x3bcbd5(0x185)]=function(_0x31fb9c){const _0x2f32dd=_0x3bcbd5,_0x518be6=this[_0x2f32dd(0x180)](_0x31fb9c);if(_0x518be6===_0x2f32dd(0x2c0))this['drawItemStyleIconText'](_0x31fb9c);else _0x518be6===_0x2f32dd(0x299)?this['drawItemStyleIcon'](_0x31fb9c):Window_Command['prototype'][_0x2f32dd(0x185)][_0x2f32dd(0x29a)](this,_0x31fb9c);},Window_SkillType[_0x3bcbd5(0x189)]['commandStyle']=function(){const _0x419e3a=_0x3bcbd5;return VisuMZ[_0x419e3a(0x396)]['Settings']['Skills']['CmdStyle'];},Window_SkillType['prototype'][_0x3bcbd5(0x180)]=function(_0x1d9acf){const _0x382062=_0x3bcbd5;if(_0x1d9acf<0x0)return _0x382062(0x202);const _0x4d0cfb=this[_0x382062(0x1b7)]();if(_0x4d0cfb!=='auto')return _0x4d0cfb;else{if(this['maxItems']()>0x0){const _0x5f5844=this[_0x382062(0x234)](_0x1d9acf);if(_0x5f5844[_0x382062(0x24d)](/\\I\[(\d+)\]/i)){const _0x42be41=this['itemLineRect'](_0x1d9acf),_0x4d4472=this[_0x382062(0x2dd)](_0x5f5844)['width'];return _0x4d4472<=_0x42be41[_0x382062(0x2ee)]?_0x382062(0x2c0):_0x382062(0x299);}}}return _0x382062(0x202);},Window_SkillType[_0x3bcbd5(0x189)][_0x3bcbd5(0x1f7)]=function(_0x307091){const _0x512854=_0x3bcbd5,_0x1542b2=this[_0x512854(0x22b)](_0x307091),_0x55da37=this[_0x512854(0x234)](_0x307091),_0x223903=this['textSizeEx'](_0x55da37)[_0x512854(0x2ee)];this['changePaintOpacity'](this[_0x512854(0x35b)](_0x307091));const _0x4a9851=this[_0x512854(0x33c)]();if(_0x4a9851==='right')this[_0x512854(0x1e3)](_0x55da37,_0x1542b2['x']+_0x1542b2['width']-_0x223903,_0x1542b2['y'],_0x223903);else{if(_0x4a9851==='center'){const _0x5a05b1=_0x1542b2['x']+Math[_0x512854(0x1a0)]((_0x1542b2[_0x512854(0x2ee)]-_0x223903)/0x2);this[_0x512854(0x1e3)](_0x55da37,_0x5a05b1,_0x1542b2['y'],_0x223903);}else this['drawTextEx'](_0x55da37,_0x1542b2['x'],_0x1542b2['y'],_0x223903);}},Window_SkillType[_0x3bcbd5(0x189)][_0x3bcbd5(0x1cb)]=function(_0x3f8013){const _0x52fd52=_0x3bcbd5;this[_0x52fd52(0x234)](_0x3f8013)[_0x52fd52(0x24d)](/\\I\[(\d+)\]/i);const _0x30f183=Number(RegExp['$1'])||0x0,_0x39ae36=this['itemLineRect'](_0x3f8013),_0x4594c8=_0x39ae36['x']+Math[_0x52fd52(0x1a0)]((_0x39ae36[_0x52fd52(0x2ee)]-ImageManager['iconWidth'])/0x2),_0x54c15f=_0x39ae36['y']+(_0x39ae36[_0x52fd52(0x29e)]-ImageManager['iconHeight'])/0x2;this[_0x52fd52(0x251)](_0x30f183,_0x4594c8,_0x54c15f);},VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x376)]=Window_SkillStatus['prototype'][_0x3bcbd5(0x24e)],Window_SkillStatus[_0x3bcbd5(0x189)]['refresh']=function(){const _0x421b63=_0x3bcbd5;VisuMZ[_0x421b63(0x396)][_0x421b63(0x376)]['call'](this);if(this[_0x421b63(0x1a1)])this['drawExtendedSkillsStatesCoreStatus']();},Window_SkillStatus['prototype'][_0x3bcbd5(0x2bb)]=function(){const _0x200d82=_0x3bcbd5;if(!Imported[_0x200d82(0x2cc)])return;if(!Imported[_0x200d82(0x2db)])return;const _0xe614ad=this[_0x200d82(0x27a)]();let _0x29636e=this[_0x200d82(0x1c5)]()/0x2+0xb4+0xb4+0xb4,_0x1a1d7f=this[_0x200d82(0x219)]-_0x29636e-0x2;if(_0x1a1d7f>=0x12c){const _0x496b2e=VisuMZ[_0x200d82(0x360)][_0x200d82(0x2b1)][_0x200d82(0x1e5)]['DisplayedParams'],_0x50f98e=Math[_0x200d82(0x1a0)](_0x1a1d7f/0x2)-0x18;let _0x423c8b=_0x29636e,_0x1227c5=Math[_0x200d82(0x1a0)]((this[_0x200d82(0x242)]-Math['ceil'](_0x496b2e[_0x200d82(0x2c5)]/0x2)*_0xe614ad)/0x2),_0xcf5f2a=0x0;for(const _0x5ad0a6 of _0x496b2e){this[_0x200d82(0x32d)](_0x423c8b,_0x1227c5,_0x50f98e,_0x5ad0a6),_0xcf5f2a++,_0xcf5f2a%0x2===0x0?(_0x423c8b=_0x29636e,_0x1227c5+=_0xe614ad):_0x423c8b+=_0x50f98e+0x18;}}this[_0x200d82(0x2b4)]();},Window_SkillStatus['prototype']['drawExtendedParameter']=function(_0x30d840,_0x3059f9,_0x18f688,_0x37cde1){const _0x4ff0d9=_0x3bcbd5,_0xbe1799=this[_0x4ff0d9(0x27a)]();this[_0x4ff0d9(0x2b4)](),this[_0x4ff0d9(0x312)](_0x30d840,_0x3059f9,_0x18f688,_0x37cde1,!![]),this[_0x4ff0d9(0x19e)](),this[_0x4ff0d9(0x36c)][_0x4ff0d9(0x2a7)]-=0x8;const _0x43e047=this['_actor'][_0x4ff0d9(0x342)](_0x37cde1,!![]);this[_0x4ff0d9(0x36c)][_0x4ff0d9(0x387)](_0x43e047,_0x30d840,_0x3059f9,_0x18f688,_0xbe1799,'right');},VisuMZ['SkillsStatesCore']['Window_SkillList_includes']=Window_SkillList['prototype']['includes'],Window_SkillList[_0x3bcbd5(0x189)]['includes']=function(_0x120c0a){const _0x299a1e=_0x3bcbd5;return this[_0x299a1e(0x212)](_0x120c0a);},VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x1d4)]=Window_SkillList[_0x3bcbd5(0x189)]['maxCols'],Window_SkillList['prototype']['maxCols']=function(){const _0x3abed4=_0x3bcbd5;return SceneManager[_0x3abed4(0x296)][_0x3abed4(0x198)]===Scene_Battle?VisuMZ[_0x3abed4(0x396)]['Window_SkillList_maxCols']['call'](this):VisuMZ['SkillsStatesCore']['Settings'][_0x3abed4(0x1d9)][_0x3abed4(0x20a)];},VisuMZ[_0x3bcbd5(0x396)][_0x3bcbd5(0x28f)]=Window_SkillList['prototype'][_0x3bcbd5(0x2c4)],Window_SkillList[_0x3bcbd5(0x189)][_0x3bcbd5(0x2c4)]=function(_0x51d506){const _0xcb6300=_0x3bcbd5,_0xb559b7=this[_0xcb6300(0x1a1)]!==_0x51d506;VisuMZ[_0xcb6300(0x396)][_0xcb6300(0x28f)]['call'](this,_0x51d506),_0xb559b7&&(this[_0xcb6300(0x287)]&&this['_statusWindow']['constructor']===Window_ShopStatus&&this[_0xcb6300(0x287)][_0xcb6300(0x365)](this[_0xcb6300(0x254)](0x0)));},Window_SkillList[_0x3bcbd5(0x189)][_0x3bcbd5(0x26c)]=function(_0x39ea45){const _0x2a64a2=_0x3bcbd5;if(this['_stypeId']===_0x39ea45)return;this['_stypeId']=_0x39ea45,this[_0x2a64a2(0x24e)](),this[_0x2a64a2(0x22e)](0x0,0x0),this[_0x2a64a2(0x287)]&&this[_0x2a64a2(0x287)][_0x2a64a2(0x198)]===Window_ShopStatus&&this[_0x2a64a2(0x287)][_0x2a64a2(0x365)](this[_0x2a64a2(0x254)](0x0));},Window_SkillList[_0x3bcbd5(0x189)]['includesSkillsStatesCore']=function(_0x4572eb){const _0x36c8e7=_0x3bcbd5;if(!_0x4572eb)return VisuMZ[_0x36c8e7(0x396)]['Window_SkillList_includes'][_0x36c8e7(0x29a)](this,_0x4572eb);if(!this[_0x36c8e7(0x1ab)](_0x4572eb))return![];if(!this[_0x36c8e7(0x380)](_0x4572eb))return![];if(!this[_0x36c8e7(0x1b9)](_0x4572eb))return![];return!![];},Window_SkillList['prototype'][_0x3bcbd5(0x1ab)]=function(_0x47744f){const _0x192de9=_0x3bcbd5;return DataManager['getSkillTypes'](_0x47744f)[_0x192de9(0x1cf)](this[_0x192de9(0x320)]);},Window_SkillList[_0x3bcbd5(0x189)][_0x3bcbd5(0x380)]=function(_0x193dd0){const _0x291832=_0x3bcbd5;if(!this['checkShowHideBattleNotetags'](_0x193dd0))return![];if(!this[_0x291832(0x1ad)](_0x193dd0))return![];if(!this['checkShowHideSkillNotetags'](_0x193dd0))return![];return!![];},Window_SkillList[_0x3bcbd5(0x189)][_0x3bcbd5(0x350)]=function(_0x1f29f0){const _0x3180fb=_0x3bcbd5,_0x395b85=_0x1f29f0[_0x3180fb(0x1e7)];if(_0x395b85['match'](/<HIDE IN BATTLE>/i)&&$gameParty[_0x3180fb(0x343)]())return![];else return _0x395b85[_0x3180fb(0x24d)](/<HIDE OUTSIDE BATTLE>/i)&&!$gameParty[_0x3180fb(0x343)]()?![]:!![];},Window_SkillList[_0x3bcbd5(0x189)][_0x3bcbd5(0x1ad)]=function(_0x478eac){const _0x3b52a7=_0x3bcbd5,_0x9763a0=_0x478eac[_0x3b52a7(0x1e7)];if(_0x9763a0[_0x3b52a7(0x24d)](/<SHOW[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x44782c=JSON[_0x3b52a7(0x1d8)]('['+RegExp['$1'][_0x3b52a7(0x24d)](/\d+/g)+']');for(const _0x18693f of _0x44782c){if(!$gameSwitches[_0x3b52a7(0x275)](_0x18693f))return![];}return!![];}if(_0x9763a0[_0x3b52a7(0x24d)](/<SHOW ALL[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x16c770=JSON[_0x3b52a7(0x1d8)]('['+RegExp['$1'][_0x3b52a7(0x24d)](/\d+/g)+']');for(const _0x4c848a of _0x16c770){if(!$gameSwitches[_0x3b52a7(0x275)](_0x4c848a))return![];}return!![];}if(_0x9763a0[_0x3b52a7(0x24d)](/<SHOW ANY[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x41ab18=JSON[_0x3b52a7(0x1d8)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x4667cb of _0x41ab18){if($gameSwitches[_0x3b52a7(0x275)](_0x4667cb))return!![];}return![];}if(_0x9763a0[_0x3b52a7(0x24d)](/<HIDE[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x27f906=JSON[_0x3b52a7(0x1d8)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x4793dd of _0x27f906){if(!$gameSwitches[_0x3b52a7(0x275)](_0x4793dd))return!![];}return![];}if(_0x9763a0['match'](/<HIDE ALL[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x234c2c=JSON[_0x3b52a7(0x1d8)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x335af7 of _0x234c2c){if(!$gameSwitches[_0x3b52a7(0x275)](_0x335af7))return!![];}return![];}if(_0x9763a0['match'](/<HIDE ANY[ ](?:SW|SWITCH|SWITCHES):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x37f6ed=JSON['parse']('['+RegExp['$1'][_0x3b52a7(0x24d)](/\d+/g)+']');for(const _0x4d46e7 of _0x37f6ed){if($gameSwitches[_0x3b52a7(0x275)](_0x4d46e7))return![];}return!![];}return!![];},Window_SkillList[_0x3bcbd5(0x189)]['checkShowHideSkillNotetags']=function(_0x6ad577){const _0xcfd27e=_0x3bcbd5,_0x10491f=_0x6ad577[_0xcfd27e(0x1e7)];if(_0x10491f[_0xcfd27e(0x24d)](/<SHOW IF LEARNED[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x459719=JSON['parse']('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x2a36d6 of _0x459719){if(!this[_0xcfd27e(0x1a1)][_0xcfd27e(0x191)](_0x2a36d6))return![];}return!![];}else{if(_0x10491f[_0xcfd27e(0x24d)](/<SHOW IF LEARNED[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x136200=RegExp['$1'][_0xcfd27e(0x1a9)](',');for(const _0x68a2cf of _0x136200){const _0x564663=DataManager[_0xcfd27e(0x2a0)](_0x68a2cf);if(!_0x564663)continue;if(!this[_0xcfd27e(0x1a1)]['isLearnedSkill'](_0x564663))return![];}return!![];}}if(_0x10491f[_0xcfd27e(0x24d)](/<SHOW IF LEARNED ALL[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x1540e4=JSON[_0xcfd27e(0x1d8)]('['+RegExp['$1'][_0xcfd27e(0x24d)](/\d+/g)+']');for(const _0x197676 of _0x1540e4){if(!this[_0xcfd27e(0x1a1)][_0xcfd27e(0x191)](_0x197676))return![];}return!![];}else{if(_0x10491f['match'](/<SHOW IF LEARNED ALL[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x1bd2c4=RegExp['$1'][_0xcfd27e(0x1a9)](',');for(const _0x579285 of _0x1bd2c4){const _0x40a2a8=DataManager['getSkillIdWithName'](_0x579285);if(!_0x40a2a8)continue;if(!this[_0xcfd27e(0x1a1)][_0xcfd27e(0x191)](_0x40a2a8))return![];}return!![];}}if(_0x10491f['match'](/<SHOW IF LEARNED ANY[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x2f0583=JSON[_0xcfd27e(0x1d8)]('['+RegExp['$1'][_0xcfd27e(0x24d)](/\d+/g)+']');for(const _0x1cdbf7 of _0x2f0583){if(this[_0xcfd27e(0x1a1)][_0xcfd27e(0x191)](_0x1cdbf7))return!![];}return![];}else{if(_0x10491f[_0xcfd27e(0x24d)](/<SHOW IF LEARNED ANY[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x5ddc8b=RegExp['$1'][_0xcfd27e(0x1a9)](',');for(const _0xaa9910 of _0x5ddc8b){const _0x5c7a60=DataManager[_0xcfd27e(0x2a0)](_0xaa9910);if(!_0x5c7a60)continue;if(this['_actor'][_0xcfd27e(0x191)](_0x5c7a60))return!![];}return![];}}if(_0x10491f[_0xcfd27e(0x24d)](/<HIDE IF LEARNED[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x452890=JSON[_0xcfd27e(0x1d8)]('['+RegExp['$1'][_0xcfd27e(0x24d)](/\d+/g)+']');for(const _0x1f9c3c of _0x452890){if(!this['_actor'][_0xcfd27e(0x191)](_0x1f9c3c))return!![];}return![];}else{if(_0x10491f[_0xcfd27e(0x24d)](/<HIDE IF LEARNED[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x1f98f8=RegExp['$1']['split'](',');for(const _0x576423 of _0x1f98f8){const _0x27bcd3=DataManager[_0xcfd27e(0x2a0)](_0x576423);if(!_0x27bcd3)continue;if(!this[_0xcfd27e(0x1a1)][_0xcfd27e(0x191)](_0x27bcd3))return!![];}return![];}}if(_0x10491f[_0xcfd27e(0x24d)](/<HIDE IF LEARNED ALL[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x19e43b=JSON[_0xcfd27e(0x1d8)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x31225a of _0x19e43b){if(!this[_0xcfd27e(0x1a1)][_0xcfd27e(0x191)](_0x31225a))return!![];}return![];}else{if(_0x10491f[_0xcfd27e(0x24d)](/<HIDE IF LEARNED ALL[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x4fd958=RegExp['$1'][_0xcfd27e(0x1a9)](',');for(const _0x269d95 of _0x4fd958){const _0x3e5406=DataManager[_0xcfd27e(0x2a0)](_0x269d95);if(!_0x3e5406)continue;if(!this[_0xcfd27e(0x1a1)][_0xcfd27e(0x191)](_0x3e5406))return!![];}return![];}}if(_0x10491f['match'](/<HIDE IF LEARNED ANY[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x1fd1bb=JSON[_0xcfd27e(0x1d8)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x46b6f0 of _0x1fd1bb){if(this[_0xcfd27e(0x1a1)][_0xcfd27e(0x191)](_0x46b6f0))return![];}return!![];}else{if(_0x10491f[_0xcfd27e(0x24d)](/<HIDE IF LEARNED ANY[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0xf24537=RegExp['$1'][_0xcfd27e(0x1a9)](',');for(const _0x721e24 of _0xf24537){const _0x2affcd=DataManager[_0xcfd27e(0x2a0)](_0x721e24);if(!_0x2affcd)continue;if(this[_0xcfd27e(0x1a1)][_0xcfd27e(0x191)](_0x2affcd))return![];}return!![];}}if(_0x10491f['match'](/<SHOW IF (?:HAS|HAVE)[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x7c6864=JSON['parse']('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0xf62c53 of _0x7c6864){if(!this['_actor'][_0xcfd27e(0x2a2)](_0xf62c53))return![];}return!![];}else{if(_0x10491f[_0xcfd27e(0x24d)](/<SHOW IF (?:HAS|HAVE)[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x19beea=RegExp['$1'][_0xcfd27e(0x1a9)](',');for(const _0x65742e of _0x19beea){const _0x20e4eb=DataManager[_0xcfd27e(0x2a0)](_0x65742e);if(!_0x20e4eb)continue;if(!this[_0xcfd27e(0x1a1)][_0xcfd27e(0x2a2)](_0x20e4eb))return![];}return!![];}}if(_0x10491f[_0xcfd27e(0x24d)](/<SHOW IF (?:HAS|HAVE) ALL[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x38b5f1=JSON[_0xcfd27e(0x1d8)]('['+RegExp['$1'][_0xcfd27e(0x24d)](/\d+/g)+']');for(const _0x1f1966 of _0x38b5f1){if(!this[_0xcfd27e(0x1a1)]['hasSkill'](_0x1f1966))return![];}return!![];}else{if(_0x10491f[_0xcfd27e(0x24d)](/<SHOW IF (?:HAS|HAVE) ALL[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x2c59b5=RegExp['$1'][_0xcfd27e(0x1a9)](',');for(const _0x3ac116 of _0x2c59b5){const _0xd24cac=DataManager[_0xcfd27e(0x2a0)](_0x3ac116);if(!_0xd24cac)continue;if(!this[_0xcfd27e(0x1a1)][_0xcfd27e(0x2a2)](_0xd24cac))return![];}return!![];}}if(_0x10491f[_0xcfd27e(0x24d)](/<SHOW IF (?:HAS|HAVE) ANY[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x5382cc=JSON[_0xcfd27e(0x1d8)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x4c3362 of _0x5382cc){if(this[_0xcfd27e(0x1a1)]['hasSkill'](_0x4c3362))return!![];}return![];}else{if(_0x10491f[_0xcfd27e(0x24d)](/<SHOW IF (?:HAS|HAVE) ANY[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x174f39=RegExp['$1'][_0xcfd27e(0x1a9)](',');for(const _0x2426f4 of _0x174f39){const _0x18f54e=DataManager[_0xcfd27e(0x2a0)](_0x2426f4);if(!_0x18f54e)continue;if(this[_0xcfd27e(0x1a1)][_0xcfd27e(0x2a2)](_0x18f54e))return!![];}return![];}}if(_0x10491f[_0xcfd27e(0x24d)](/<HIDE IF (?:HAS|HAVE)[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x3f57a1=JSON[_0xcfd27e(0x1d8)]('['+RegExp['$1']['match'](/\d+/g)+']');for(const _0x3206f0 of _0x3f57a1){if(!this[_0xcfd27e(0x1a1)][_0xcfd27e(0x2a2)](_0x3206f0))return!![];}return![];}else{if(_0x10491f[_0xcfd27e(0x24d)](/<HIDE IF (?:HAS|HAVE)[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x44c611=RegExp['$1'][_0xcfd27e(0x1a9)](',');for(const _0xbee17d of _0x44c611){const _0x103ff4=DataManager['getSkillIdWithName'](_0xbee17d);if(!_0x103ff4)continue;if(!this[_0xcfd27e(0x1a1)][_0xcfd27e(0x2a2)](_0x103ff4))return!![];}return![];}}if(_0x10491f[_0xcfd27e(0x24d)](/<HIDE IF (?:HAS|HAVE) ALL[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x4e8018=JSON[_0xcfd27e(0x1d8)]('['+RegExp['$1'][_0xcfd27e(0x24d)](/\d+/g)+']');for(const _0x40f8ae of _0x4e8018){if(!this[_0xcfd27e(0x1a1)][_0xcfd27e(0x2a2)](_0x40f8ae))return!![];}return![];}else{if(_0x10491f[_0xcfd27e(0x24d)](/<HIDE IF (?:HAS|HAVE) ALL[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x221038=RegExp['$1'][_0xcfd27e(0x1a9)](',');for(const _0x18d262 of _0x221038){const _0x231def=DataManager['getSkillIdWithName'](_0x18d262);if(!_0x231def)continue;if(!this[_0xcfd27e(0x1a1)]['hasSkill'](_0x231def))return!![];}return![];}}if(_0x10491f[_0xcfd27e(0x24d)](/<HIDE IF (?:HAS|HAVE) ANY[ ](?:SKILL|SKILLS):[ ]*(\d+(?:\s*,\s*\d+)*)>/i)){const _0x3ea78d=JSON[_0xcfd27e(0x1d8)]('['+RegExp['$1'][_0xcfd27e(0x24d)](/\d+/g)+']');for(const _0x929db5 of _0x3ea78d){if(this[_0xcfd27e(0x1a1)][_0xcfd27e(0x2a2)](_0x929db5))return![];}return!![];}else{if(_0x10491f[_0xcfd27e(0x24d)](/<HIDE IF (?:HAS|HAVE) ANY[ ](?:SKILL|SKILLS):[ ](.*)>/i)){const _0x3c64e7=RegExp['$1'][_0xcfd27e(0x1a9)](',');for(const _0x4e9bfe of _0x3c64e7){const _0x351e01=DataManager[_0xcfd27e(0x2a0)](_0x4e9bfe);if(!_0x351e01)continue;if(this[_0xcfd27e(0x1a1)][_0xcfd27e(0x2a2)](_0x351e01))return![];}return!![];}}return!![];},Window_SkillList[_0x3bcbd5(0x189)][_0x3bcbd5(0x1b9)]=function(_0x34e459){const _0x30b3ef=_0x3bcbd5,_0x40db0d=_0x34e459[_0x30b3ef(0x1e7)],_0xa4038f=VisuMZ[_0x30b3ef(0x396)]['skillVisibleJS'];return _0xa4038f[_0x34e459['id']]?_0xa4038f[_0x34e459['id']][_0x30b3ef(0x29a)](this,_0x34e459):!![];},Window_SkillList[_0x3bcbd5(0x189)][_0x3bcbd5(0x336)]=function(_0x21bb5b,_0x277e01,_0x5bbaa7,_0x627046){const _0x4e81a0=_0x3bcbd5;Window_Base[_0x4e81a0(0x189)][_0x4e81a0(0x336)][_0x4e81a0(0x29a)](this,this['_actor'],_0x21bb5b,_0x277e01,_0x5bbaa7,_0x627046);},Window_SkillList[_0x3bcbd5(0x189)][_0x3bcbd5(0x303)]=function(_0x299f03){const _0x2d98d7=_0x3bcbd5;this[_0x2d98d7(0x287)]=_0x299f03,this[_0x2d98d7(0x284)]();},VisuMZ[_0x3bcbd5(0x396)]['Window_SkillList_updateHelp']=Window_SkillList[_0x3bcbd5(0x189)][_0x3bcbd5(0x243)],Window_SkillList['prototype']['updateHelp']=function(){const _0x2d3454=_0x3bcbd5;VisuMZ[_0x2d3454(0x396)]['Window_SkillList_updateHelp'][_0x2d3454(0x29a)](this),this[_0x2d3454(0x287)]&&this[_0x2d3454(0x287)][_0x2d3454(0x198)]===Window_ShopStatus&&this['_statusWindow'][_0x2d3454(0x365)](this[_0x2d3454(0x20f)]());};