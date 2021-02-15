//=============================================================================
// VisuStella MZ - Skill Learn System
// VisuMZ_2_SkillLearnSystem.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_2_SkillLearnSystem = true;

var VisuMZ = VisuMZ || {};
VisuMZ.SkillLearnSystem = VisuMZ.SkillLearnSystem || {};
VisuMZ.SkillLearnSystem.version = 1.05;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 2] [Version 1.05] [SkillLearnSystem]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Skill_Learn_System_VisuStella_MZ
 * @orderAfter VisuMZ_0_CoreEngine
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin lets your game's actors have an alternative way of learning
 * skills aside from leveling up. Instead, they can learn skills through the
 * in-game skill menu, where they can trade gold, items, or the brand new
 * resources made available by this plugin: Ability Points and/or Skill Points.
 * 
 * Ability Points and Skill Points are new resources provided by this plugin
 * that can be acquired in a variety of ways, of which, you can set through its
 * mechanical settings in the Plugin Parameters. These can be through leveling
 * up, performing actions, and/or defeating enemies.
 * 
 * When learning skills through this plugin's in-game system, skills can have
 * a variety of costs and requirements. These requirements can come in the form
 * of needing to be at a certain level, having specific skills learned, and/or
 * having certain switches on.
 *
 * Features include all (but not limited to) the following:
 * 
 * * Actors can now learn new skills from the in-game skill menu under the
 *   new "Learn" command.
 * * In this new menu, actors can spend various resources to learn new skills.
 * * These resources can be Ability Points, Skill Points, items, and more.
 * * Ability Points and Skill Points are brand new resources added through this
 *   plugin which can be acquired through a variety a means ranging from
 *   participating in battle, defeating enemies, and/or leveling up.
 * * Learnable skills may have requirements that need to be first met even if
 *   the actor has the available resources.
 * * Skill learning requirements can include levels, having other skills
 *   learned, and/or enabled switches.
 * * Play animations upon learning a new skill inside the menu.
 *
 * ============================================================================
 * Requirements
 * ============================================================================
 *
 * This plugin is made for RPG Maker MZ. This will not work in other iterations
 * of RPG Maker.
 *
 * ------ Tier 2 ------
 *
 * This plugin is a Tier 2 plugin. Place it under other plugins of lower tier
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
 * Battle Test
 *
 * When doing a battle test through the database, all of an actor's learnable
 * skills through the Skill Learn System's notetags will become available for
 * the test battle to reduce the need to manually add them.
 *
 * ---
 *
 * VisuMZ_3_VictoryAftermath
 *
 * If VisuStella MZ's Victory Aftermath plugin is installed, the amount of
 * Skill Points and Ability Points earned can be visibly shown in the rewards
 * window.
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
 * ---
 * 
 * === Ability Points-Related Notetags ===
 * 
 * ---
 *
 * <Starting AP: x>
 *
 * - Used for: Actor Notetags
 * - Determines the amount of Ability Points the actor starts with in his/her
 *   starting class.
 * - Replace 'x' with a numeric value representing the amount of Ability Points
 *   to start out with.
 *
 * ---
 *
 * <Class id Starting AP: x>
 * <Class name Starting AP: x>
 *
 * - Used for: Actor Notetags
 * - Determines the amount of Ability Points the actor starts with in a
 *   specific class if Ability Points aren't shared across all classes.
 * - Replace 'x' with a numeric value representing the amount of Ability Points
 *   to start out with.
 * - Replace 'id' with the ID of the class to set starting Ability Points for.
 * - Replace 'name' with the name of the class to set starting Ability
 *   Points for.
 *
 * ---
 *
 * <AP Gain: x>
 * <User AP Gain: x>
 *
 * - Used for: Skill, Item Notetags
 * - When this skill/item is used in battle, the user will acquire 'x' amount
 *   of Ability Points.
 * - Replace 'x' with a number representing the amount of Ability Points for
 *   the user to earn upon usage.
 * - This effect will trigger each time per "hit".
 * - This effect will take over the "Per Action Hit" Ability Points gain from
 *   the Plugin Parameters.
 *
 * ---
 *
 * <Target AP Gain: x>
 *
 * - Used for: Skill, Item Notetags
 * - When this skill/item is used in battle, the target will acquire 'x' amount
 *   of Ability Points.
 * - Replace 'x' with a number representing the amount of Ability Points for
 *   the target to earn upon usage.
 * - This effect will trigger each time per "hit".
 *
 * ---
 *
 * <AP: x>
 *
 * - Used for: Enemy Notetags
 * - Determines the amount of Ability Points the enemy will give the player's
 *   party upon being defeated.
 * - Replace 'x' with a number representing the amount of Ability Points to
 *   grant the player's party each.
 * - This effect will take over the "Per Enemy" Ability Points gain from the
 *   Plugin Parameters.
 *
 * ---
 *
 * <AP Rate: x%>
 *
 * - Used for: Actor, Class, Weapon, Armor, State Notetags
 * - Increases the amount of Ability Points the affected battler will gain by a
 *   percentile value.
 * - Replace 'x' with a percentage number representing the amount of Ability
 *   Points that will be acquired.
 * - This stacks multiplicatively with each other.
 * - This does not apply when Ability Points are directly added, lost, or set.
 *
 * ---
 * 
 * === Skill Points-Related Notetags ===
 * 
 * ---
 *
 * <Starting SP: x>
 *
 * - Used for: Actor Notetags
 * - Determines the amount of Skill Points the actor starts with in his/her
 *   starting class.
 * - Replace 'x' with a numeric value representing the amount of Skill Points
 *   to start out with.
 *
 * ---
 *
 * <Class id Starting SP: x>
 * <Class name Starting SP: x>
 *
 * - Used for: Actor Notetags
 * - Determines the amount of Skill Points the actor starts with in a specific
 *   class if Skill Points aren't shared across all classes.
 * - Replace 'x' with a numeric value representing the amount of Skill Points
 *   to start out with.
 * - Replace 'id' with the ID of the class to set starting Skill Points for.
 * - Replace 'name' with the name of the class to set starting Skill
 *   Points for.
 *
 * ---
 *
 * <SP Gain: x>
 * <User SP Gain: x>
 *
 * - Used for: Skill, Item Notetags
 * - When this skill/item is used in battle, the user will acquire 'x' amount
 *   of Skill Points.
 * - Replace 'x' with a number representing the amount of Skill Points for the
 *   user to earn upon usage.
 * - This effect will trigger each time per "hit".
 * - This effect will take over the "Per Action Hit" Skill Points gain from the
 *   Plugin Parameters.
 *
 * ---
 *
 * <Target SP Gain: x>
 *
 * - Used for: Skill, Item Notetags
 * - When this skill/item is used in battle, the target will acquire 'x' amount
 *   of Skill Points.
 * - Replace 'x' with a number representing the amount of Skill Points for the
 *   target to earn upon usage.
 * - This effect will trigger each time per "hit".
 *
 * ---
 *
 * <SP: x>
 *
 * - Used for: Enemy Notetags
 * - Determines the amount of Skill Points the enemy will give the player's
 *   party upon being defeated.
 * - Replace 'x' with a number representing the amount of Skill Points to grant
 *   the player's party each.
 * - This effect will take over the "Per Enemy" Skill Points gain from the
 *   Plugin Parameters.
 *
 * ---
 *
 * <SP Rate: x%>
 *
 * - Used for: Actor, Class, Weapon, Armor, State Notetags
 * - Increases the amount of Skill Points the affected battler will gain by a
 *   percentile value.
 * - Replace 'x' with a percentage number representing the amount of Skill
 *   Points that will be acquired.
 * - This stacks multiplicatively with each other.
 * - This does not apply when Skill Points are directly added, lost, or set.
 *
 * ---
 * 
 * === Learnable Skills-Related Notetags ===
 * 
 * ---
 *
 * <Learn Skill: id>
 * <Learn Skills: id, id, id>
 * 
 * <Learn Skill: name>
 * <Learn Skills: name, name, name>
 *
 * - Used for: Class Notetags
 * - Determines what skills the class can learn through the Skill Learn System.
 * - Replace 'id' with a number representing the ID of the skill that can be
 *   learned through the Skill Learn System menu.
 * - Replace 'name' with the name of the skill that can be learned through the
 *   Skill Learn System menu.
 * - Multiple entries are permited.
 *
 * ---
 *
 * <Learn Skills>
 *  id
 *  id
 *  id
 *  name
 *  name
 *  name
 * <Learn Skills>
 *
 * - Used for: Class
 * - Determines what skills the class can learn through the Skill Learn System.
 * - Replace 'id' with a number representing the ID of the skill that can be
 *   learned through the Skill Learn System menu.
 * - Replace 'name' with the name of the skill that can be learned through the
 *   Skill Learn System menu.
 * - Multiple middle entries are permited.
 *
 * ---
 * 
 * === Skill Learn Cost-Related Notetags ===
 * 
 * ---
 *
 * <Learn AP Cost: x>
 *
 * - Used for: Skill Notetags
 * - Determines the Ability Point cost needed for an actor to learn the skill
 *   through the Skill Learn System.
 * - Replace 'x' with a number representing the amount of Ability Points needed
 *   to learn this skill.
 * - If this notetag is not used, then the Ability Point cost will default to
 *   the value found in the settings.
 *
 * ---
 *
 * <Learn CP Cost: x>
 *
 * - Used for: Skill Notetags
 * - Requires VisuMZ_2_ClassChangeSystem
 * - Determines the Class Point cost needed for an actor to learn the skill
 *   through the Skill Learn System.
 * - Replace 'x' with a number representing the amount of Skill Points needed
 *   to learn this skill.
 * - If this notetag is not used, then the Skill Point cost will default to
 *   the value found in the settings.
 *
 * ---
 *
 * <Learn JP Cost: x>
 *
 * - Used for: Skill Notetags
 * - Requires VisuMZ_2_ClassChangeSystem
 * - Determines the Job Point cost needed for an actor to learn the skill
 *   through the Skill Learn System.
 * - Replace 'x' with a number representing the amount of Skill Points needed
 *   to learn this skill.
 * - If this notetag is not used, then the Skill Point cost will default to
 *   the value found in the settings.
 *
 * ---
 *
 * <Learn SP Cost: x>
 *
 * - Used for: Skill Notetags
 * - Determines the Skill Point cost needed for an actor to learn the skill
 *   through the Skill Learn System.
 * - Replace 'x' with a number representing the amount of Skill Points needed
 *   to learn this skill.
 * - If this notetag is not used, then the Skill Point cost will default to
 *   the value found in the settings.
 *
 * ---
 *
 * <Learn Item id Cost: x>
 * <Learn Item name Cost: x>
 *
 * - Used for: Skill Notetags
 * - Determines the items needed to be consumed for an actor to learn the skill
 *   through the Skill Learn System.
 * - Replace 'id' with a number representing the ID of the item needed to be 
 *   consumed.
 * - Replace 'name' with the name of the item needed to be consumed.
 * - Replace 'x' with a number representing the amount of the item needed
 *   to learn this skill.
 * - You may insert multiple copies of this notetag.
 *
 * ---
 *
 * <Learn Weapon id Cost: x>
 * <Learn Weapon name Cost: x>
 *
 * - Used for: Skill Notetags
 * - Determines the weapons needed to be consumed for an actor to learn the
 *   skill through the Skill Learn System.
 * - Replace 'id' with a number representing the ID of the weapon needed to be 
 *   consumed.
 * - Replace 'name' with the name of the weapon needed to be consumed.
 * - Replace 'x' with a number representing the amount of the weapon needed
 *   to learn this skill.
 * - You may insert multiple copies of this notetag.
 *
 * ---
 *
 * <Learn Armor id Cost: x>
 * <Learn Armor name Cost: x>
 *
 * - Used for: Skill Notetags
 * - Determines the armors needed to be consumed for an actor to learn the
 *   skill through the Skill Learn System.
 * - Replace 'id' with a number representing the ID of the armor needed to be 
 *   consumed.
 * - Replace 'name' with the name of the armor needed to be consumed.
 * - Replace 'x' with a number representing the amount of the armor needed
 *   to learn this skill.
 * - You may insert multiple copies of this notetag.
 *
 * ---
 *
 * <Learn Gold Cost: x>
 *
 * - Used for: Skill Notetags
 * - Determines the gold cost needed for an actor to learn the skill through
 *   the Skill Learn System.
 * - Replace 'x' with a number representing the amount of gold needed to learn
 *   this skill.
 * - If this notetag is not used, then the gold cost will default to the value
 *   found in the settings.
 *
 * ---
 *
 * <Learn Skill Costs>
 *  AP: x
 * 
 *  SP: x
 * 
 *  Item id: x
 *  Item name: x
 * 
 *  Weapon id: x
 *  Weapon name: x
 * 
 *  Armor id: x
 *  Armor name: x
 *  
 *  Gold: x
 * </Learn Skill Costs>
 *
 * - Used for: Skill Notetags
 * - Determines a group of resources needed for an actor to learn the skill
 *   through the Skill Learn System.
 * - Replace 'id' with the ID's of items, weapons, armors to be consumed.
 * - Replace 'name' with the names of items, weapons, armors to be consumed.
 * - Replace 'x' with the quantities of the designated resource to be consumed.
 * - Insert multiple entries of items, weapons, and armors inside the notetags
 *   to add more resource entries.
 *
 * ---
 * 
 * === JavaScript Notetags: Skill Costs ===
 *
 * The following are notetags made for users with JavaScript knowledge to
 * create dynamic Ability Point and Skill Point costs.
 * 
 * ---
 *
 * <JS Learn AP Cost>
 *  code
 *  code
 *  cost = code;
 * </JS Learn AP Cost>
 *
 * - Used for: Skill Notetags
 * - Replace 'code' with JavaScript code to create dynamically calculated cost
 *   for the required Ability Points in order to learn this skill.
 * - The 'cost' variable will be returned to determine the finalized Ability
 *   Points cost to learn this skill.
 * - The 'user' variable can be used to reference the actor who will be
 *   learning the skill.
 * - The 'skill' variable can be used to reference the skill that will be
 *   learned by the actor.
 * - If the <Learn AP Cost: x> is present, this notetag will be ignored.
 *
 * ---
 *
 * <JS Learn CP Cost>
 *  code
 *  code
 *  cost = code;
 * </JS Learn CP Cost>
 *
 * - Used for: Skill Notetags
 * - Requires VisuMZ_2_ClassChangeSystem
 * - Replace 'code' with JavaScript code to create dynamically calculated cost
 *   for the required Class Points in order to learn this skill.
 * - The 'cost' variable will be returned to determine the finalized Skill
 *   Points cost to learn this skill.
 * - The 'user' variable can be used to reference the actor who will be
 *   learning the skill.
 * - The 'skill' variable can be used to reference the skill that will be
 *   learned by the actor.
 * - If the <Learn CP Cost: x> is present, this notetag will be ignored.
 *
 * ---
 *
 * <JS Learn JP Cost>
 *  code
 *  code
 *  cost = code;
 * </JS Learn JP Cost>
 *
 * - Used for: Skill Notetags
 * - Requires VisuMZ_2_ClassChangeSystem
 * - Replace 'code' with JavaScript code to create dynamically calculated cost
 *   for the required Job Points in order to learn this skill.
 * - The 'cost' variable will be returned to determine the finalized Skill
 *   Points cost to learn this skill.
 * - The 'user' variable can be used to reference the actor who will be
 *   learning the skill.
 * - The 'skill' variable can be used to reference the skill that will be
 *   learned by the actor.
 * - If the <Learn JP Cost: x> is present, this notetag will be ignored.
 *
 * ---
 *
 * <JS Learn SP Cost>
 *  code
 *  code
 *  cost = code;
 * </JS Learn SP Cost>
 *
 * - Used for: Skill Notetags
 * - Replace 'code' with JavaScript code to create dynamically calculated cost
 *   for the required Skill Points in order to learn this skill.
 * - The 'cost' variable will be returned to determine the finalized Skill
 *   Points cost to learn this skill.
 * - The 'user' variable can be used to reference the actor who will be
 *   learning the skill.
 * - The 'skill' variable can be used to reference the skill that will be
 *   learned by the actor.
 * - If the <Learn SP Cost: x> is present, this notetag will be ignored.
 *
 * ---
 * 
 * === Show Condition-Related Notetags ===
 * 
 * ---
 *
 * <Learn Show Level: x>
 *
 * - Used for: Skill Notetags
 * - Actors must be at least the required level in order for the skill to even
 *   appear visibly in the Skill Learn System menu.
 * - Replace 'x' with a number representing the required level for the actor
 *   in order for the skill to visibly appear.
 *
 * ---
 *
 * <Learn Show Skill: id>
 * <Learn Show Skill: name>
 * 
 * <Learn Show All Skills: id, id, id>
 * <Learn Show All Skills: name, name, name>
 * 
 * <Learn Show Any Skills: id, id, id>
 * <Learn Show Any Skills: name, name, name>
 *
 * - Used for: Skill Notetags
 * - The actor must have already learned the above skills in order for the
 *   learnable skill to appear visibly in the Skill Learn System menu.
 * - Replace 'id' with a number representing the ID of the skill required to be
 *   known by the actor in order to appear visibly in the menu.
 * - Replace 'name' with the name of the skill required to be known by the
 *   actor in order to appear visibly in the menu.
 * - The 'All' notetag variant requires all of the listed skills to be known
 *   before the learnable skill will appear visibly in the menu.
 * - The 'Any' notetag variant requires any of the listed skills to be known
 *   before the learnable skill will appear visibly in the menu.
 *
 * ---
 *
 * <Learn Show Switch: x>
 * 
 * <Learn Show All Switches: x, x, x>
 * 
 * <Learn Show Any Switches: x, x, x>
 *
 * - Used for: Skill Notetags
 * - The switches must be in the ON position in order for the learnable skill
 *   to appear visibly in the Skill Learn System menu.
 * - Replace 'x' with a number representing the ID of the switch required to be
 *   in the ON position in order to appear visibly in the menu.
 * - The 'All' notetag variant requires all of the switches to be in the ON
 *   position before the learnable skill will appear visibly in the menu.
 * - The 'Any' notetag variant requires any of the switches to be in the ON
 *   position before the learnable skill will appear visibly in the menu.
 *
 * ---
 * 
 * === JavaScript Notetags: Show Conditions ===
 *
 * The following are notetags made for users with JavaScript knowledge to
 * create dynamic determined show conditions.
 * 
 * ---
 *
 * <JS Learn Show>
 *  code
 *  code
 *  visible = code;
 * </JS Learn Show>
 *
 * - Used for: Skill Notetags
 * - Replace 'code' with JavaScript code to determine if the skill will be
 *   visibly shown in the Skill Learn System menu.
 * - The 'visible' variable must result in a 'true' or 'false' value to
 *   determine if the skill will be visible.
 * - The 'user' variable can be used to reference the actor who will be
 *   learning the skill.
 * - The 'skill' variable can be used to reference the skill that will be
 *   learned by the actor.
 * - Any other show conditions must be met, too.
 *
 * ---
 *
 * <JS Learn Show List Text>
 *  code
 *  code
 *  text = code;
 * </JS Learn Show List Text>
 *
 * - Used for: Skill Notetags
 * - Replace 'code' with JavaScript code to create custom text that will be
 *   displayed when the skill is shown in the Skill Learn System skill list.
 * - The 'text' variable will determine the text to be shown if it is a string.
 * - The 'user' variable can be used to reference the actor who will be
 *   learning the skill.
 * - The 'skill' variable can be used to reference the skill that will be
 *   learned by the actor.
 *
 * ---
 *
 * <JS Learn Show Detail Text>
 *  code
 *  code
 *  text = code;
 * </JS Learn Show Detail Text>
 *
 * - Used for: Skill Notetags
 * - Replace 'code' with JavaScript code to create custom text that will be
 *   displayed when the skill is selected and the Detailed Skill Learn System
 *   resource cost window is opened.
 * - The 'text' variable will determine the text to be shown if it is a string.
 * - The 'user' variable can be used to reference the actor who will be
 *   learning the skill.
 * - The 'skill' variable can be used to reference the skill that will be
 *   learned by the actor.
 *
 * ---
 * 
 * === Require Condition-Related Notetags ===
 * 
 * ---
 *
 * <Learn Require Level: x>
 *
 * - Used for: Skill Notetags
 * - Actors must be at least the required level in order for the skill to be
 *   enabled in the Skill Learn System menu.
 * - Replace 'x' with a number representing the required level for the actor
 *   in order for the skill to visibly appear.
 *
 * ---
 *
 * <Learn Require Skill: id>
 * <Learn Require Skill: name>
 * 
 * <Learn Require All Skills: id, id, id>
 * <Learn Require All Skills: name, name, name>
 * 
 * <Learn Require Any Skills: id, id, id>
 * <Learn Require Any Skills: name, name, name>
 *
 * - Used for: Skill Notetags
 * - The actor must have already learned the above skills in order for the
 *   learnable skill to be enabled in the Skill Learn System menu.
 * - Replace 'id' with a number representing the ID of the skill required to be
 *   known by the actor in order to be enabled in the menu.
 * - Replace 'name' with the name of the skill required to be known by the
 *   actor in order to be enabled in the menu.
 * - The 'All' notetag variant requires all of the listed skills to be known
 *   before the learnable skill will be enabled in the menu.
 * - The 'Any' notetag variant requires any of the listed skills to be known
 *   before the learnable skill will be enabled in the menu.
 *
 * ---
 *
 * <Learn Require Switch: x>
 * 
 * <Learn Require All Switches: x, x, x>
 * 
 * <Learn Require Any Switches: x, x, x>
 *
 * - Used for: Skill Notetags
 * - The switches must be in the ON position in order for the learnable skill
 *   to be enabled in the Skill Learn System menu.
 * - Replace 'x' with a number representing the ID of the switch required to be
 *   in the ON position in order to be enabled in the menu.
 * - The 'All' notetag variant requires all of the switches to be in the ON
 *   position before the learnable skill will be enabled in the menu.
 * - The 'Any' notetag variant requires any of the switches to be in the ON
 *   position before the learnable skill will be enabled in the menu.
 *
 * ---
 * 
 * === JavaScript Notetags: Requirement Conditions ===
 *
 * The following are notetags made for users with JavaScript knowledge to
 * create dynamic determined learning requirement conditions.
 * 
 * ---
 *
 * <JS Learn Requirements>
 *  code
 *  code
 *  enabled = code;
 * </JS Learn Requirements>
 *
 * - Used for: Skill Notetags
 * - Replace 'code' with JavaScript code to determine if the skill will be
 *   enabled for learning in the Skill Learn System menu.
 * - The 'enabled' variable must result in a 'true' or 'false' value to
 *   determine if the skill will be enabled.
 * - The 'user' variable can be used to reference the actor who will be
 *   learning the skill.
 * - The 'skill' variable can be used to reference the skill that will be
 *   learned by the actor.
 * - Any other requirement conditions must be met, too.
 *
 * ---
 *
 * <JS Learn Requirements List Text>
 *  code
 *  code
 *  text = code;
 * </JS Learn Requirements List Text>
 *
 * - Used for: Skill Notetags
 * - Replace 'code' with JavaScript code to create custom text that will be
 *   displayed when the skill is shown in the Skill Learn System skill list
 *   as long as the requirements have to be met.
 * - The 'text' variable will determine the text to be shown if it is a string.
 * - The 'user' variable can be used to reference the actor who will be
 *   learning the skill.
 * - The 'skill' variable can be used to reference the skill that will be
 *   learned by the actor.
 *
 * ---
 *
 * <JS Learn Requirements Detail Text>
 *  code
 *  code
 *  text = code;
 * </JS Learn Requirements Detail Text>
 *
 * - Used for: Skill Notetags
 * - Replace 'code' with JavaScript code to create custom text that will be
 *   displayed when the skill is selected and the Detailed Skill Learn System
 *   resource cost window is opened as long as the requirements have to be met.
 * - The 'text' variable will determine the text to be shown if it is a string.
 * - The 'user' variable can be used to reference the actor who will be
 *   learning the skill.
 * - The 'skill' variable can be used to reference the skill that will be
 *   learned by the actor.
 *
 * ---
 * 
 * === Animation-Related Notetags ===
 * 
 * ---
 *
 * <Learn Skill Animation: id>
 * <Learn Skill Animation: id, id, id>
 * 
 * - Used for: Skill Notetags
 * - Plays the animation(s) when this skill is learned through the Skill Learn
 *   System's menu.
 * - This will override the default animation settings found in the plugin
 *   parameters and use the unique one set through notetags instead.
 * - Replace 'id' with the ID of the animation you wish to play.
 * - If multiple ID's are found, then each animation will play one by one in
 *   the order they are listed.
 *
 * ---
 * 
 * <Learn Skill Fade Speed: x>
 * 
 * - Used for: Skill Notetags
 * - This determines the speed at which the skill's icon fades in during the
 *   skill learning animation.
 * - Replace 'x' with a number value to determine how fast the icon fades in.
 * - Use lower numbers for slower fade speeds and higher numbers for faster
 *   fade speeds.
 * 
 * ---
 * 
 * <Learn Skill Picture: filename>
 * <Picture: filename>
 * 
 * - Used for: Skill Notetags
 * - Uses a picture from your project's /img/pictures/ folder instead of the
 *   skill's icon during learning instead.
 * - Replace 'filename' with the filename of the image.
 *   - Do not include the file extension.
 * - Scaling will not apply to the picture.
 * - Use the <Picture: filename> version for any other plugins that may be
 *   using this as an image outside of learning skills, too.
 * - The size used for the image will vary based on your game's resolution.
 * 
 * ---
 * 
 * === JavaScript Notetags: On Learning Conditions ===
 *
 * The following are notetags made for users with JavaScript knowledge to
 * produce special effects when the skill is learned.
 * 
 * ---
 *
 * <JS On Learn Skill>
 *  code
 *  code
 *  code
 * </JS On Learn Skill>
 *
 * - Used for: Skill Notetags
 * - Replace 'code' with JavaScript code to perform the desired actions when
 *   the skill is learned.
 * - This will apply to any time the skill is learned by an actor, even if it
 *   is through natural leveling or through the Skill Learn System menu.
 * - The 'user' variable can be used to reference the actor who will be
 *   learning the skill.
 * - The 'skill' variable can be used to reference the skill that will be
 *   learned by the actor.
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
 * === Ability Points Plugin Commands ===
 * 
 * ---
 *
 * Ability Points: Gain
 * - The target actor(s) gains Ability Points.
 * - Gained amounts are affected by Ability Point bonus rates.
 *
 *   Actor ID(s):
 *   - Select which Actor ID(s) to affect.
 *
 *   Class ID(s):
 *   - Select which Class ID(s) to gain Ability Points for.
 *   - Use "0" for the current class.
 *
 *   Ability Points:
 *   - Determine how many Ability Points will be gained.
 *   - You may use code.
 *
 * ---
 *
 * Ability Points: Add
 * - The target actor(s) receives Ability Points.
 * - Received amounts are NOT affected by Ability Point bonus rates.
 *
 *   Actor ID(s):
 *   - Select which Actor ID(s) to affect.
 *
 *   Class ID(s):
 *   - Select which Class ID(s) to receive Ability Points for.
 *   - Use "0" for the current class.
 *
 *   Ability Points:
 *   - Determine how many Ability Points will be added.
 *   - You may use code.
 *
 * ---
 *
 * Ability Points: Lose
 * - The target actor(s) loses Ability Points.
 * - Lost amounts are NOT affected by Ability Point bonus rates.
 *
 *   Actor ID(s):
 *   - Select which Actor ID(s) to affect.
 *
 *   Class ID(s):
 *   - Select which Class ID(s) to lose Ability Points for.
 *   - Use "0" for the current class.
 *
 *   Ability Points:
 *   - Determine how many Ability Points will be lost.
 *   - You may use code.
 *
 * ---
 *
 * Ability Points: Set
 * - Changes the exact Ability Points for the target actor(s).
 * - Changed amounts are NOT affected by Ability Point bonus rates.
 *
 *   Actor ID(s):
 *   - Select which Actor ID(s) to affect.
 *
 *   Class ID(s):
 *   - Select which Class ID(s) to change Ability Points for.
 *   - Use "0" for the current class.
 *
 *   Ability Points:
 *   - Determine how many Ability Points will be set exactly to.
 *   - You may use code.
 *
 * ---
 * 
 * === Skill Points Plugin Commands ===
 * 
 * ---
 *
 * Skill Points: Gain
 * - The target actor(s) gains Skill Points.
 * - Gained amounts are affected by Skill Point bonus rates.
 *
 *   Actor ID(s):
 *   - Select which Actor ID(s) to affect.
 *
 *   Class ID(s):
 *   - Select which Class ID(s) to gain Skill Points for.
 *   - Use "0" for the current class.
 *
 *   Skill Points:
 *   - Determine how many Skill Points will be gained.
 *   - You may use code.
 *
 * ---
 *
 * Skill Points: Add
 * - The target actor(s) receives Skill Points.
 * - Received amounts are NOT affected by Skill Point bonus rates.
 *
 *   Actor ID(s):
 *   - Select which Actor ID(s) to affect.
 *
 *   Class ID(s):
 *   - Select which Class ID(s) to receive Skill Points for.
 *   - Use "0" for the current class.
 *
 *   Skill Points:
 *   - Determine how many Skill Points will be added.
 *   - You may use code.
 *
 * ---
 *
 * Skill Points: Lose
 * - The target actor(s) loses Skill Points.
 * - Lost amounts are NOT affected by Skill Point bonus rates.
 *
 *   Actor ID(s):
 *   - Select which Actor ID(s) to affect.
 *
 *   Class ID(s):
 *   - Select which Class ID(s) to lose Skill Points for.
 *   - Use "0" for the current class.
 *
 *   Skill Points:
 *   - Determine how many Skill Points will be lost.
 *   - You may use code.
 *
 * ---
 *
 * Skill Points: Set
 * - Changes the exact Skill Points for the target actor(s).
 * - Changed amounts are NOT affected by Skill Point bonus rates.
 *
 *   Actor ID(s):
 *   - Select which Actor ID(s) to affect.
 *
 *   Class ID(s):
 *   - Select which Class ID(s) to change Skill Points for.
 *   - Use "0" for the current class.
 *
 *   Skill Points:
 *   - Determine how many Skill Points will be set exactly to.
 *   - You may use code.
 *
 * ---
 * 
 * === System Plugin Commands ===
 * 
 * ---
 *
 * System: Show Skill Learn in Skill Menu?
 * - Shows/hides Skill Learn inside the skill menu.
 *
 *   Show/Hide?:
 *   - Shows/hides Skill Learn inside the skill menu.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: General Settings
 * ============================================================================
 *
 * General settings for the Skill Learn System. These determine the settings
 * that are used for the Skill Learn System menu's main screen.
 *
 * ---
 *
 * Visual
 * 
 *   Displayed Costs:
 *   - Select which cost types to display in the skill entry.
 *   - This also determines the order they are displayed.
 *     - AP - Ability Points
 *     - SP - Skill Points
 *     - Item - Item Costs
 *     - Weapon - Weapon Costs
 *     - Armor - Armor Costs
 *     - Gold - Gold Costs
 * 
 *   JS: Draw Status:
 *   - JavaScript code used to draw in Window_SkillStatus when the Skill Learn
 *     System is active.
 *
 * ---
 *
 * Vocabulary
 * 
 *   Learned Text:
 *   - This is the text that appears if the skill has been learned.
 *   - You may use text codes.
 * 
 *   Requirements
 * 
 *     Requirement Header:
 *     - Header for requirements.
 *     - %1 - Requirements (all of them)
 * 
 *     Separation Format:
 *     - This determines how the requirements are separated.
 *     - %1 - Previous Requirement, %2 - Second Requirement
 * 
 *     Level Format:
 *     - This how level is displayed.
 *     - %1 - Level, %2 - Full Level Term, %3 - Abbr Level Term
 * 
 *     Skill Format:
 *     - This how required skills are displayed.
 *     - %1 - Icon, %2 - Skill Name
 * 
 *     Switch Format:
 *     - This how required switches are displayed.
 *     - %1 - Switch Name
 * 
 *   Costs
 * 
 *     Separation Format:
 *     - This determines how the costs are separated from one another.
 *     - %1 - Previous Cost, %2 - Second Cost
 * 
 *     Item Format:
 *     - Determine how items are displayed as a cost.
 *     - %1 - Quantity, %2 - Icon, %3 - Item Name
 * 
 *     Weapon Format:
 *     - Determine how weapons are displayed as a cost.
 *     - %1 - Quantity, %2 - Icon, %3 - Weapon Name
 * 
 *     Armor Format:
 *     - Determine how armors are displayed as a cost.
 *     - %1 - Quantity, %2 - Icon, %3 - Armor Name
 * 
 *     Gold Format:
 *     - Determine how gold is displayed as a cost.
 *     - %1 - Quantity, %2 - Icon, %3 - Currency Vocabulary
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Main Access Settings
 * ============================================================================
 *
 * Menu Access settings for Skill Learn System. The Skill Learn System is
 * accessible normally through the in-game Skill menu.
 *
 * ---
 *
 * Main Access Settings
 * 
 *   Command Name:
 *   - Name of the 'Skill Learn' option in the Menu.
 * 
 *   Icon:
 *   - What is the icon you want to use to represent Skill Learn?
 * 
 *   Show in Menu?:
 *   - Add the 'Skill Learn' option to the Menu by default?
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Animation Settings
 * ============================================================================
 *
 * Animation settings for the Skill Learn System. By default, an animation will
 * be played upon learning a skill through the Skill Learn System's menu in
 * order to provide player feedback about learning the said skill.
 *
 * ---
 *
 * General
 * 
 *   Show Animations?:
 *   - Show animations when learning a skill?
 * 
 *   Show Windows?:
 *   - Show windows during a skill learn animation?
 * 
 *   Default Animations:
 *   - Default animation(s) do you want to play when learning.
 *
 * ---
 *
 * Skill Sprite
 * 
 *   Scale:
 *   - How big do you want the skill sprite to be on screen?
 * 
 *   Fade Speed:
 *   - How fast do you want the icon to fade in?
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Sound Settings
 * ============================================================================
 *
 * Settings for the sound effect played when learning a new skill through the
 * Skill Learn System.
 *
 * ---
 *
 * Settings
 * 
 *   Filename:
 *   - Filename of the sound effect played.
 * 
 *   Volume:
 *   - Volume of the sound effect played.
 * 
 *   Pitch:
 *   - Pitch of the sound effect played.
 * 
 *   Pan:
 *   - Pan of the sound effect played.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Window Settings
 * ============================================================================
 *
 * Window settings for the Skill Learn System. There are two new windows added
 * into the Skill menu through this plugin: the Detail Window and the Confirm
 * Window.
 * 
 * The Detail Window will list the required costs of learning a skill in detail
 * in case the icons provided are not clear enough to show what's needed.
 * 
 * The Confirm Window is a window that appears towards the bottom to let the
 * player make a confirmation before deciding to learn the skill.
 *
 * ---
 *
 * Detail Window
 * 
 *   Requirements
 * 
 *     Requirement Title:
 *     - Text used when drawing the learning requirements.
 *     - %1 - Skill Icon, %2 - Skill Name
 * 
 *     Requirement Met:
 *     - This how met requirements look.
 *     - %1 - Requirement Text
 * 
 *     Requirement Not Met:
 *     - This how met requirements look.
 *     - %1 - Requirement Text
 * 
 *     Requirement Level:
 *     - This how level is displayed.
 *     - %1 - Level, %2 - Full Level Term, %3 - Abbr Level Term
 * 
 *     Requirement Skill:
 *     - This how required skills are displayed.
 *     - %1 - Icon, %2 - Skill Name
 * 
 *     Requirement Switch:
 *     - This how required switches are displayed.
 *     - %1 - Switch Name
 * 
 *   Costs
 * 
 *     Cost Title:
 *     - Text used when drawing the learning costs.
 *     - %1 - Skill Icon, %2 - Skill Name
 * 
 *     Cost Name:
 *     - Text used to label the resource being consumed.
 * 
 *     Cost Quantity:
 *     - Text used to label the cost of the resource.
 * 
 *     Cost of Owned:
 *     - Text used to label the amount of the resource in possession.
 * 
 *   Background Type:
 *   - Select background type for this window.
 *     - 0 - Window
 *     - 1 - Dim
 *     - 2 - Transparent
 * 
 *   JS: X, Y, W, H:
 *   - Code used to determine the dimensions for this window.
 *
 * ---
 *
 * Confirm Window
 * 
 *   Confirm Text:
 *   - Text used for the Confirm command.
 *   - Text codes can be used.
 * 
 *   Cancel Text:
 *   - Text used for the Cancel command.
 *   - Text codes can be used.
 * 
 *   Background Type:
 *   - Select background type for this window.
 *     - 0 - Window
 *     - 1 - Dim
 *     - 2 - Transparent
 * 
 *   JS: X, Y, W, H:
 *   - Code used to determine the dimensions for this window.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Ability Points Settings
 * ============================================================================
 *
 * Ability Points are an actor-only resource used as a currency for this
 * plugin. You can determine how they appear in-game, how they're earned, and
 * what kind of mechanics are involved with them. Ability Points can also be 
 * used in other VisuStella plugins.
 *
 * ---
 *
 * Mechanics
 * 
 *   Shared Ability Points:
 *   - Do you want Ability Points to be shared across all classes?
 *   - Or do you want all classes to have their own?
 * 
 *   Maximum:
 *   - What's the maximum amount of Ability Points an actor can have?
 *   - Use 0 for unlimited Ability Points.
 *
 * ---
 *
 * Visual
 * 
 *   Show In Menus?:
 *   - Do you wish to show Ability Points in menus that allow them?
 * 
 *   Icon:
 *   - What is the icon you want to use to represent Ability Points?
 *
 * ---
 *
 * Vocabulary
 * 
 *   Full Text:
 *   - The full text of how Ability Points appears in-game.
 * 
 *   Abbreviated Text:
 *   - The abbreviation of how Ability Points appears in-game.
 * 
 *   Menu Text Format:
 *   - What is the text format for it to be displayed in windows.
 *   - %1 - Value, %2 - Abbr, %3 - Icon, %4 - Full Text
 *
 * ---
 *
 * Gain
 * 
 *   Per Action Hit:
 *   - How many Ability Points should an actor gain per action?
 *   - You may use code.
 * 
 *   Per Level Up:
 *   - How many Ability Points should an actor gain per level up?
 *   - You may use code.
 * 
 *   Per Enemy Defeated:
 *   - How many Ability Points should an actor gain per enemy?
 *   - You may use code.
 * 
 *     Alive Actors?:
 *     - Do actors have to be alive to receive Ability Points from
 *       defeated enemies?
 *
 * ---
 *
 * Victory
 * 
 *   Show During Victory?:
 *   - Show how much AP an actor has earned in battle during the victory phase?
 * 
 *   Victory Text:
 *   - For no Victory Aftermath, this is the text that appears.
 *   - %1 - Actor, %2 - Earned, %3 - Abbr, %4 - Full Text
 * 
 *   Aftermath Display?:
 *   - Requires VisuMZ_3_VictoryAftermath. 
 *   - Show Ability Points as the main acquired resource in the actor windows?
 * 
 *   Aftermath Text:
 *   - For no Victory Aftermath, this is the text that appears.
 *   - %1 - Earned, %2 - Abbr, %3 - Full Text
 *
 * ---
 * 
 * For those who wish to display how many Ability Points an actor has for a
 * specific class, you can use the following JavaScript code inside of a
 * window object.
 * 
 *   this.drawAbilityPoints(value, x, y, width, align);
 *   - The 'value' variable refers to the number you wish to display.
 *   - The 'x' variable refers to the x coordinate to draw at.
 *   - The 'y' variable refers to the y coordinate to draw at.
 *   - The 'width' variable refers to the width of the data area.
 *   - Replace 'align' with a string saying 'left', 'center', or 'right' to
 *     determine how you want the data visibly aligned.
 * 
 *   this.drawActorAbilityPoints(actor, classID, x, y, width, align);
 *   - The 'actor' variable references the actor to get data from.
 *   - The 'classID' variable is the class to get data from.
 *     - Use 0 if Ability Points aren't shared or if you want the Ability
 *       Points from the actor's current class.
 *   - The 'x' variable refers to the x coordinate to draw at.
 *   - The 'y' variable refers to the y coordinate to draw at.
 *   - The 'width' variable refers to the width of the data area.
 *   - Replace 'align' with a string saying 'left', 'center', or 'right' to
 *     determine how you want the data visibly aligned.
 * 
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Skill Points Settings
 * ============================================================================
 *
 * Skill Points are an actor-only resource used as a currency for this plugin.
 * You can determine how they appear in-game, how they're earned, and what kind
 * of mechanics are involved with them. Skill Points can also be used in other
 * VisuStella plugins.
 *
 * ---
 *
 * Mechanics
 * 
 *   Shared Skill Points:
 *   - Do you want Skill Points to be shared across all classes?
 *   - Or do you want all classes to have their own?
 * 
 *   Maximum:
 *   - What's the maximum amount of Skill Points an actor can have?
 *   - Use 0 for unlimited Skill Points.
 *
 * ---
 *
 * Visual
 * 
 *   Show In Menus?:
 *   - Do you wish to show Skill Points in menus that allow them?
 * 
 *   Icon:
 *   - What is the icon you want to use to represent Skill Points?
 *
 * ---
 *
 * Vocabulary
 * 
 *   Full Text:
 *   - The full text of how Skill Points appears in-game.
 * 
 *   Abbreviated Text:
 *   - The abbreviation of how Skill Points appears in-game.
 * 
 *   Menu Text Format:
 *   - What is the text format for it to be displayed in windows.
 *   - %1 - Value, %2 - Abbr, %3 - Icon, %4 - Full Text
 *
 * ---
 *
 * Gain
 * 
 *   Per Action Hit:
 *   - How many Skill Points should an actor gain per action?
 *   - You may use code.
 * 
 *   Per Level Up:
 *   - How many Skill Points should an actor gain per level up?
 *   - You may use code.
 * 
 *   Per Enemy Defeated:
 *   - How many Skill Points should an actor gain per enemy?
 *   - You may use code.
 * 
 *     Alive Actors?:
 *     - Do actors have to be alive to receive Skill Points from
 *       defeated enemies?
 *
 * ---
 *
 * Victory
 * 
 *   Show During Victory?:
 *   - Show how much SP an actor has earned in battle during the victory phase?
 * 
 *   Victory Text:
 *   - For no Victory Aftermath, this is the text that appears.
 *   - %1 - Actor, %2 - Earned, %3 - Abbr, %4 - Full Text
 * 
 *   Aftermath Display?:
 *   - Requires VisuMZ_3_VictoryAftermath. 
 *   - Show Skill Points as the main acquired resource in the actor windows?
 * 
 *   Aftermath Text:
 *   - For no Victory Aftermath, this is the text that appears.
 *   - %1 - Earned, %2 - Abbr, %3 - Full Text
 *
 * ---
 * 
 * For those who wish to display how many Skill Points an actor has for a
 * specific class, you can use the following JavaScript code inside of a
 * window object.
 * 
 *   this.drawSkillPoints(value, x, y, width, align);
 *   - The 'value' variable refers to the number you wish to display.
 *   - The 'x' variable refers to the x coordinate to draw at.
 *   - The 'y' variable refers to the y coordinate to draw at.
 *   - The 'width' variable refers to the width of the data area.
 *   - Replace 'align' with a string saying 'left', 'center', or 'right' to
 *     determine how you want the data visibly aligned.
 * 
 *   this.drawActorSkillPoints(actor, classID, x, y, width, align);
 *   - The 'actor' variable references the actor to get data from.
 *   - The 'classID' variable is the class to get data from.
 *     - Use 0 if Skill Points aren't shared or if you want the Skill
 *       Points from the actor's current class.
 *   - The 'x' variable refers to the x coordinate to draw at.
 *   - The 'y' variable refers to the y coordinate to draw at.
 *   - The 'width' variable refers to the width of the data area.
 *   - Replace 'align' with a string saying 'left', 'center', or 'right' to
 *     determine how you want the data visibly aligned.
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
 * Version 1.05: December 25, 2020
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New notetag added by Yanfly.
 * *** <Learn Skill Picture: filename> and <Picture: filename>
 * **** Uses a picture from your project's /img/pictures/ folder instead of the
 *      skill's icon during learning instead.
 * 
 * Version 1.04: December 18, 2020
 * * Bug Fixes!
 * ** Notetags that utilize multiple numeric ID's instead of skill names should
 *    now be working properly. Fix made by Yanfly.
 * 
 * Version 1.03: December 11, 2020
 * * Compatibility Update
 * ** Added compatibility functionality for future plugins.
 * * Documentation Update!
 * ** Help file updated for new features.
 * * Feature Updates!
 * ** The Plugin Parameter for "Displayed Costs" have been updated to contain
 *    compatibility for a future plugin.
 * ** The Plugin Parameter for "JS: Draw Status" has been updated to contain
 *    compatibility for a future plugin.
 * *** To quickly acquire the new changes for the above Plugin Parameters,
 *     delete the "General" settings from the main Plugin Parameters page, then
 *     open them up again. These settings will be defaulted to the new
 *     additions added for the plugin. Warning! Old settings will be lost.
 * * New Features!
 * ** Added <Learn CP Cost: x>, <Learn JP Cost: x>, <JS Learn CP Cost>,
 *    <JS Learn JP Cost> notetags. Added by Arisu.
 * 
 * Version 1.02: November 29, 2020
 * * Bug Fixes!
 * ** The plugin should no longer be dependent on Skills & States Core. Fix
 *    made by Arisu.
 * 
 * Version 1.01: November 22, 2020
 * * Bug Fixes!
 * ** Game no longer crashes when displaying AP/SP rewards for those without
 *    the Victory Aftermath plugin. Fix made by Yanfly.
 *
 * Version 1.00: November 30, 2020
 * * Finished Plugin!
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 *
 * @ --------------------------------------------------------------------------
 *
 * @command AbilityPointsGain
 * @text Ability Points: Gain
 * @desc The target actor(s) gains Ability Points.
 * Gained amounts are affected by Ability Point bonus rates.
 *
 * @arg Actors:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which Actor ID(s) to affect.
 * @default ["1"]
 *
 * @arg Classes:arraynum
 * @text Class ID(s)
 * @type class[]
 * @desc Select which Class ID(s) to gain Ability Points for.
 * Use "0" for the current class.
 * @default ["0"]
 *
 * @arg Points:eval
 * @text Ability Points
 * @desc Determine how many Ability Points will be gained.
 * You may use code.
 * @default 100
 *
 * @ --------------------------------------------------------------------------
 *
 * @command AbilityPointsAdd
 * @text Ability Points: Add
 * @desc The target actor(s) receives Ability Points.
 * Received amounts are NOT affected by Ability Point bonus rates.
 *
 * @arg Actors:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which Actor ID(s) to affect.
 * @default ["1"]
 *
 * @arg Classes:arraynum
 * @text Class ID(s)
 * @type class[]
 * @desc Select which Class ID(s) to receive Ability Points for.
 * Use "0" for the current class.
 * @default ["0"]
 *
 * @arg Points:eval
 * @text Ability Points
 * @desc Determine how many Ability Points will be added.
 * You may use code.
 * @default 100
 *
 * @ --------------------------------------------------------------------------
 *
 * @command AbilityPointsLose
 * @text Ability Points: Lose
 * @desc The target actor(s) loses Ability Points.
 * Lost amounts are NOT affected by Ability Point bonus rates.
 *
 * @arg Actors:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which Actor ID(s) to affect.
 * @default ["1"]
 *
 * @arg Classes:arraynum
 * @text Class ID(s)
 * @type class[]
 * @desc Select which Class ID(s) to lose Ability Points for.
 * Use "0" for the current class.
 * @default ["0"]
 *
 * @arg Points:eval
 * @text Ability Points
 * @desc Determine how many Ability Points will be lost.
 * You may use code.
 * @default 100
 *
 * @ --------------------------------------------------------------------------
 *
 * @command AbilityPointsSet
 * @text Ability Points: Set
 * @desc Changes the exact Ability Points for the target actor(s).
 * Changed amounts are NOT affected by Ability Point bonus rates.
 *
 * @arg Actors:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which Actor ID(s) to affect.
 * @default ["1"]
 *
 * @arg Classes:arraynum
 * @text Class ID(s)
 * @type class[]
 * @desc Select which Class ID(s) to change Ability Points for.
 * Use "0" for the current class.
 * @default ["0"]
 *
 * @arg Points:eval
 * @text Ability Points
 * @desc Determine how many Ability Points will be set exactly to.
 * You may use code.
 * @default 100
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SkillPointsGain
 * @text Skill Points: Gain
 * @desc The target actor(s) gains Skill Points.
 * Gained amounts are affected by Skill Point bonus rates.
 *
 * @arg Actors:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which Actor ID(s) to affect.
 * @default ["1"]
 *
 * @arg Classes:arraynum
 * @text Class ID(s)
 * @type class[]
 * @desc Select which Class ID(s) to gain Skill Points for.
 * Use "0" for the current class.
 * @default ["0"]
 *
 * @arg Points:eval
 * @text Skill Points
 * @desc Determine how many Skill Points will be gained.
 * You may use code.
 * @default 100
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SkillPointsAdd
 * @text Skill Points: Add
 * @desc The target actor(s) receives Skill Points.
 * Received amounts are NOT affected by Skill Point bonus rates.
 *
 * @arg Actors:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which Actor ID(s) to affect.
 * @default ["1"]
 *
 * @arg Classes:arraynum
 * @text Class ID(s)
 * @type class[]
 * @desc Select which Class ID(s) to receive Skill Points for.
 * Use "0" for the current class.
 * @default ["0"]
 *
 * @arg Points:eval
 * @text Skill Points
 * @desc Determine how many Skill Points will be added.
 * You may use code.
 * @default 100
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SkillPointsLose
 * @text Skill Points: Lose
 * @desc The target actor(s) loses Skill Points.
 * Lost amounts are NOT affected by Skill Point bonus rates.
 *
 * @arg Actors:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which Actor ID(s) to affect.
 * @default ["1"]
 *
 * @arg Classes:arraynum
 * @text Class ID(s)
 * @type class[]
 * @desc Select which Class ID(s) to lose Skill Points for.
 * Use "0" for the current class.
 * @default ["0"]
 *
 * @arg Points:eval
 * @text Skill Points
 * @desc Determine how many Skill Points will be lost.
 * You may use code.
 * @default 100
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SkillPointsSet
 * @text Skill Points: Set
 * @desc Changes the exact Skill Points for the target actor(s).
 * Changed amounts are NOT affected by Skill Point bonus rates.
 *
 * @arg Actors:arraynum
 * @text Actor ID(s)
 * @type actor[]
 * @desc Select which Actor ID(s) to affect.
 * @default ["1"]
 *
 * @arg Classes:arraynum
 * @text Class ID(s)
 * @type class[]
 * @desc Select which Class ID(s) to change Skill Points for.
 * Use "0" for the current class.
 * @default ["0"]
 *
 * @arg Points:eval
 * @text Skill Points
 * @desc Determine how many Skill Points will be set exactly to.
 * You may use code.
 * @default 100
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SystemShowSkillLearnSystemMenu
 * @text System: Show Skill Learn in Skill Menu?
 * @desc Shows/hides Skill Learn inside the skill menu.
 *
 * @arg Show:eval
 * @text Show/Hide?
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Shows/hides Skill Learn inside the skill menu.
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
 * @param SkillLearnSystem
 * @default Plugin Parameters
 *
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 * 
 * @param Scene_SkillLearn
 *
 * @param General:struct
 * @text General Settings
 * @parent Scene_SkillLearn
 * @type struct<General>
 * @desc General settings for the Skill Learn System.
 * @default {"Visual":"","DisplayedCosts:arraystr":"[\"AP\",\"SP\",\"Item\",\"Weapon\",\"Armor\",\"Gold\"]","StatusWindowDrawJS:func":"\"// Draw Face\\nconst fx = this.colSpacing() / 2;\\nconst fh = this.innerHeight;\\nconst fy = fh / 2 - this.lineHeight() * 1.5;\\nthis.drawActorFace(this._actor, fx + 1, 0, 144, fh);\\nthis.drawActorSimpleStatus(this._actor, fx + 180, fy);\\n\\n// Return if Window Size is Too Small\\nlet sx = (this.colSpacing() / 2) + 180 + 180 + 180;\\nlet sw = this.innerWidth - sx - 2;\\nif (sw < 300) return;\\n\\n// Draw Costs\\n// Compatibility Target\\nconst costs = this.getSkillLearnDisplayedCosts();\\nconst maxEntries = Math.floor(this.innerHeight / this.lineHeight());\\nconst maxCol = Math.ceil(costs.length / maxEntries);\\nlet cx = sx;\\nlet cy = Math.max(Math.round((this.innerHeight - (this.lineHeight() * Math.ceil(costs.length / maxCol))) / 2), 0);\\nconst by = cy;\\nlet cw = (this.innerWidth - cx - (this.itemPadding() * 2 * maxCol)) / maxCol;\\nif (maxCol === 1) {\\n    cw = Math.min(ImageManager.faceWidth, cw);\\n    cx += Math.round((this.innerWidth - cx - (this.itemPadding() * 2) - cw) / 2);\\n}\\nfor (const cost of costs) {\\n    switch (cost) {\\n\\n        case 'AP':\\n            this.drawActorAbilityPoints(this._actor, this._actor.currentClass().id, cx, cy, cw, 'right');\\n            break;\\n\\n        case 'CP':\\n            if (Imported.VisuMZ_2_ClassChangeSystem) {\\n                this.drawActorClassPoints(this._actor, this._actor.currentClass().id, cx, cy, cw, 'right');\\n            }\\n            break;\\n\\n        case 'JP':\\n            if (Imported.VisuMZ_2_ClassChangeSystem) {\\n                this.drawActorJobPoints(this._actor, this._actor.currentClass().id, cx, cy, cw, 'right');\\n            }\\n            break;\\n\\n        case 'SP':\\n            this.drawActorSkillPoints(this._actor, this._actor.currentClass().id, cx, cy, cw, 'right');\\n            break;\\n\\n        case 'Gold':\\n            this.drawCurrencyValue($gameParty.gold(), TextManager.currencyUnit, cx, cy, cw);\\n            break;\\n\\n        default:\\n            continue;\\n    }\\n    cy += this.lineHeight();\\n    if (cy + this.lineHeight() > this.innerHeight) {\\n        cy = by;\\n        cx += cw + (this.itemPadding() * 2);\\n    }\\n}\"","Vocabulary":"","Learned:str":"Learned","Requirements":"","RequireFmt:str":"Requires %1","ReqSeparateFmt:str":"%1, %2","ReqLevelFmt:str":"\\C[16]%3\\C[0]%1","ReqSkillFmt:str":"%1\\C[16]%2\\C[0]","ReqSwitchFmt:str":"\\C[16]%1\\C[0]","Costs":"","SeparationFmt:str":"%1  %2","ItemFmt:str":"×%1%2","WeaponFmt:str":"×%1%2","ArmorFmt:str":"×%1%2","GoldFmt:str":"×%1%2"}
 *
 * @param MenuAccess:struct
 * @text Menu Access Settings
 * @parent Scene_SkillLearn
 * @type struct<MenuAccess>
 * @desc Menu Access settings for Skill Learn System.
 * @default {"Name:str":"Learn","Icon:num":"87","ShowMenu:eval":"true"}
 *
 * @param Animation:struct
 * @text Animation Settings
 * @parent Scene_SkillLearn
 * @type struct<Animation>
 * @desc Animation settings for the Skill Learn System.
 * @default {"General":"","ShowAnimations:eval":"true","ShowWindows:eval":"true","Animations:arraynum":"[\"40\",\"48\"]","Sprite":"","Scale:num":"8.0","FadeSpeed:num":"4"}
 *
 * @param Sound:struct
 * @text Learn Sound Effect
 * @parent Scene_SkillLearn
 * @type struct<Sound>
 * @desc Settings for the sound effect played when learning a new skill through the Skill Learn System.
 * @default {"name:str":"Skill3","volume:num":"90","pitch:num":"100","pan:num":"0"}
 *
 * @param Window:struct
 * @text Window Settings
 * @parent Scene_SkillLearn
 * @type struct<Window>
 * @desc Window settings for the Skill Learn System.
 * @default {"DetailWindow":"","Requirements":"","RequirementTitle:str":"\\C[16]%1%2 Requirements\\C[0]","ReqMetFmt:str":"\\C[24]✔ %1\\C[0]","ReqNotMetFmt:str":"\\C[0]✘ %1\\C[0]","ReqLevelFmt:str":"\\I[87]%2 %1 Reached","ReqSkillFmt:str":"%1%2 Learned","ReqSwitchFmt:str":"\\I[160]%1","Costs":"","LearningTitle:str":"\\C[16]Learning\\C[0] %1%2","IngredientName:str":"\\C[16]Resource\\C[0]","IngredientCost:str":"\\C[16]Cost\\C[0]","IngredientOwned:str":"\\C[16]Owned\\C[0]","DetailWindow_BgType:num":"0","DetailWindow_RectJS:func":"\"const skillWindowRect = this.itemWindowRect();\\nconst wx = skillWindowRect.x;\\nconst wy = skillWindowRect.y;\\nconst ww = skillWindowRect.width;\\nconst wh = skillWindowRect.height - this.calcWindowHeight(2, false);\\nreturn new Rectangle(wx, wy, ww, wh);\"","ConfirmWindow":"","ConfirmCmd:str":"\\I[164]Learn","CancelCmd:str":"\\I[168]Cancel","ConfirmWindow_BgType:num":"0","ConfirmWindow_RectJS:func":"\"const skillWindowRect = this.itemWindowRect();\\nconst ww = skillWindowRect.width;\\nconst wh = this.calcWindowHeight(2, false);\\nconst wx = skillWindowRect.x;\\nconst wy = skillWindowRect.y + skillWindowRect.height - wh;\\nreturn new Rectangle(wx, wy, ww, wh);\""}
 * 
 * @param Resources
 *
 * @param AbilityPoints:struct
 * @text Ability Points Settings
 * @parent Resources
 * @type struct<AbilityPoints>
 * @desc Settings for Ability Points and how they work in-game.
 * @default {"Mechanics":"","SharedResource:eval":"true","DefaultCost:num":"0","MaxResource:num":"0","Visual":"","ShowInMenus:eval":"true","Icon:num":"78","Vocabulary":"","FullText:str":"Ability Points","AbbrText:str":"AP","TextFmt:str":"%1 \\c[5]%2\\c[0]%3","Gain":"","PerAction:str":"10 + Math.randomInt(5)","PerLevelUp:str":"0","PerEnemy:str":"50 + Math.randomInt(10)","AliveActors:eval":"true","Victory":"","ShowVictory:eval":"true","VictoryText:str":"%1 gains %2 %3!","AftermathActorDisplay:eval":"true","AftermathText:str":"+%1 %2"}
 *
 * @param SkillPoints:struct
 * @text Skill Points Settings
 * @parent Resources
 * @type struct<SkillPoints>
 * @desc Settings for Skill Points and how they work in-game.
 * @default {"Mechanics":"","SharedResource:eval":"false","DefaultCost:num":"1","MaxResource:num":"0","Visual":"","ShowInMenus:eval":"true","Icon:num":"79","Vocabulary":"","FullText:str":"Skill Points","AbbrText:str":"SP","TextFmt:str":"%1 \\c[5]%2\\c[0]%3","Gain":"","PerAction:str":"0","PerLevelUp:str":"100","PerEnemy:str":"0","AliveActors:eval":"true","Victory":"","ShowVictory:eval":"false","VictoryText:str":"%1 gains %2 %3!","AftermathActorDisplay:eval":"false","AftermathText:str":"+%1 %2"}
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
 * @param Visual
 * 
 * @param DisplayedCosts:arraystr
 * @text Displayed Costs
 * @parent Visual
 * @type select[]
 * @option AP - Ability Points
 * @value AP
 * @option CP - Class Points (Requires VisuMZ_2_ClassChangeSystem)
 * @value CP
 * @option JP - Job Points (Requires VisuMZ_2_ClassChangeSystem)
 * @value JP
 * @option SP - Skill Points
 * @value SP
 * @option Item - Item Costs
 * @value Item
 * @option Weapon - Weapon Costs
 * @value Weapon
 * @option Armor - Armor Costs
 * @value Armor
 * @option Gold - Gold Costs
 * @value Gold
 * @desc Select which cost types to display in the skill entry.
 * This also determines the order they are displayed.
 * @default ["AP","SP","Item","Weapon","Armor","Gold"]
 *
 * @param StatusWindowDrawJS:func
 * @text JS: Draw Status
 * @parent Visual
 * @type note
 * @desc JavaScript code used to draw in Window_SkillStatus when the Skill Learn System is active.
 * @default "// Draw Face\nconst fx = this.colSpacing() / 2;\nconst fh = this.innerHeight;\nconst fy = fh / 2 - this.lineHeight() * 1.5;\nthis.drawActorFace(this._actor, fx + 1, 0, 144, fh);\nthis.drawActorSimpleStatus(this._actor, fx + 180, fy);\n\n// Return if Window Size is Too Small\nlet sx = (this.colSpacing() / 2) + 180 + 180 + 180;\nlet sw = this.innerWidth - sx - 2;\nif (sw < 300) return;\n\n// Draw Costs\n// Compatibility Target\nconst costs = this.getSkillLearnDisplayedCosts();\nconst maxEntries = Math.floor(this.innerHeight / this.lineHeight());\nconst maxCol = Math.ceil(costs.length / maxEntries);\nlet cx = sx;\nlet cy = Math.max(Math.round((this.innerHeight - (this.lineHeight() * Math.ceil(costs.length / maxCol))) / 2), 0);\nconst by = cy;\nlet cw = (this.innerWidth - cx - (this.itemPadding() * 2 * maxCol)) / maxCol;\nif (maxCol === 1) {\n    cw = Math.min(ImageManager.faceWidth, cw);\n    cx += Math.round((this.innerWidth - cx - (this.itemPadding() * 2) - cw) / 2);\n}\nfor (const cost of costs) {\n    switch (cost) {\n\n        case 'AP':\n            this.drawActorAbilityPoints(this._actor, this._actor.currentClass().id, cx, cy, cw, 'right');\n            break;\n\n        case 'CP':\n            if (Imported.VisuMZ_2_ClassChangeSystem) {\n                this.drawActorClassPoints(this._actor, this._actor.currentClass().id, cx, cy, cw, 'right');\n            }\n            break;\n\n        case 'JP':\n            if (Imported.VisuMZ_2_ClassChangeSystem) {\n                this.drawActorJobPoints(this._actor, this._actor.currentClass().id, cx, cy, cw, 'right');\n            }\n            break;\n\n        case 'SP':\n            this.drawActorSkillPoints(this._actor, this._actor.currentClass().id, cx, cy, cw, 'right');\n            break;\n\n        case 'Gold':\n            this.drawCurrencyValue($gameParty.gold(), TextManager.currencyUnit, cx, cy, cw);\n            break;\n\n        default:\n            continue;\n    }\n    cy += this.lineHeight();\n    if (cy + this.lineHeight() > this.innerHeight) {\n        cy = by;\n        cx += cw + (this.itemPadding() * 2);\n    }\n}"
 *
 * @param Vocabulary
 *
 * @param Learned:str
 * @text Learned Text
 * @parent Vocabulary
 * @desc This is the text that appears if the skill has been
 * learned. You may use text codes.
 * @default Learned
 *
 * @param Requirements
 * @parent Vocabulary
 *
 * @param RequireFmt:str
 * @text Requirement Header
 * @parent Requirements
 * @desc Header for requirements.
 * %1 - Requirements (all of them)
 * @default Requires %1
 *
 * @param ReqSeparateFmt:str
 * @text Separation Format
 * @parent Requirements
 * @desc This determines how the requirements are separated.
 * %1 - Previous Requirement, %2 - Second Requirement
 * @default %1, %2
 *
 * @param ReqLevelFmt:str
 * @text Level Format
 * @parent Requirements
 * @desc This how level is displayed.
 * %1 - Level, %2 - Full Level Term, %3 - Abbr Level Term
 * @default \C[16]%3\C[0]%1
 *
 * @param ReqSkillFmt:str
 * @text Skill Format
 * @parent Requirements
 * @desc This how required skills are displayed.
 * %1 - Icon, %2 - Skill Name
 * @default %1\C[16]%2\C[0]
 *
 * @param ReqSwitchFmt:str
 * @text Switch Format
 * @parent Requirements
 * @desc This how required switches are displayed.
 * %1 - Switch Name
 * @default \C[16]%1\C[0]
 *
 * @param Costs
 * @parent Vocabulary
 *
 * @param SeparationFmt:str
 * @text Separation Format
 * @parent Costs
 * @desc This determines how the costs are separated from one another.
 * %1 - Previous Cost, %2 - Second Cost
 * @default %1  %2
 *
 * @param ItemFmt:str
 * @text Item Format
 * @parent Costs
 * @desc Determine how items are displayed as a cost.
 * %1 - Quantity, %2 - Icon, %3 - Item Name
 * @default ×%1%2
 *
 * @param WeaponFmt:str
 * @text Weapon Format
 * @parent Costs
 * @desc Determine how weapons are displayed as a cost.
 * %1 - Quantity, %2 - Icon, %3 - Weapon Name
 * @default ×%1%2
 *
 * @param ArmorFmt:str
 * @text Armor Format
 * @parent Costs
 * @desc Determine how armors are displayed as a cost.
 * %1 - Quantity, %2 - Icon, %3 - Armor Name
 * @default ×%1%2
 *
 * @param GoldFmt:str
 * @text Gold Format
 * @parent Costs
 * @desc Determine how gold is displayed as a cost.
 * %1 - Quantity, %2 - Icon, %3 - Currency Vocabulary
 * @default ×%1%2
 *
 */
/* ----------------------------------------------------------------------------
 * MenuAccess Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~MenuAccess:
 *
 * @param Name:str
 * @text Command Name
 * @desc Name of the 'Skill Learn' option in the Menu.
 * @default Learn
 *
 * @param Icon:num
 * @text Icon
 * @desc What is the icon you want to use to represent Skill Learn?
 * @default 87
 *
 * @param ShowMenu:eval
 * @text Show in Menu?
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Add the 'Skill Learn' option to the Menu by default?
 * @default true
 *
 */
/* ----------------------------------------------------------------------------
 * Animation Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Animation:
 *
 * @param General
 *
 * @param ShowAnimations:eval
 * @text Show Animations?
 * @parent General
 * @type boolean
 * @on Show
 * @off Skip
 * @desc Show animations when learning a skill?
 * @default true
 *
 * @param ShowWindows:eval
 * @text Show Windows?
 * @parent General
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show windows during a skill learn animation?
 * @default false
 *
 * @param Animations:arraynum
 * @text Default Animations
 * @parent General
 * @type animation[]
 * @desc Default animation(s) do you want to play when learning.
 * @default ["40","48"]
 *
 * @param Sprite
 * @text Skill Sprite
 *
 * @param Scale:num
 * @text Scale
 * @parent Sprite
 * @desc How big do you want the skill sprite to be on screen?
 * @default 8.0
 *
 * @param FadeSpeed:num
 * @text Fade Speed
 * @parent Sprite
 * @type number
 * @min 1
 * @desc How fast do you want the icon to fade in?
 * @default 4
 *
 */
/* ----------------------------------------------------------------------------
 * Sound Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Sound:
 *
 * @param name:str
 * @text Filename
 * @type file
 * @dir audio/se/
 * @desc Filename of the sound effect played.
 * @default Skill3
 *
 * @param volume:num
 * @text Volume
 * @type number
 * @max 100
 * @desc Volume of the sound effect played.
 * @default 90
 *
 * @param pitch:num
 * @text Pitch
 * @type number
 * @desc Pitch of the sound effect played.
 * @default 100
 *
 * @param pan:num
 * @text Pan
 * @desc Pan of the sound effect played.
 * @default 0
 *
 */
/* ----------------------------------------------------------------------------
 * Window Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Window:
 *
 * @param DetailWindow
 * @text Detail Window
 * 
 * @param Requirements
 * @parent DetailWindow
 *
 * @param RequirementTitle:str
 * @text Requirement Title
 * @parent Requirements
 * @desc Text used when drawing the learning requirements.
 * %1 - Skill Icon, %2 - Skill Name
 * @default \C[16]%1%2 Requirements\C[0]
 *
 * @param ReqMetFmt:str
 * @text Requirement Met
 * @parent Requirements
 * @desc This how met requirements look.
 * %1 - Requirement Text
 * @default \C[24]✔ %1\C[0]
 *
 * @param ReqNotMetFmt:str
 * @text Requirement Not Met
 * @parent Requirements
 * @desc This how met requirements look.
 * %1 - Requirement Text
 * @default \C[0]✘ %1\C[0]
 *
 * @param ReqLevelFmt:str
 * @text Requirement Level
 * @parent Requirements
 * @desc This how level is displayed.
 * %1 - Level, %2 - Full Level Term, %3 - Abbr Level Term
 * @default \I[87]%2 %1 Reached
 *
 * @param ReqSkillFmt:str
 * @text Requirement Skill
 * @parent Requirements
 * @desc This how required skills are displayed.
 * %1 - Icon, %2 - Skill Name
 * @default %1%2 Learned
 *
 * @param ReqSwitchFmt:str
 * @text Requirement Switch
 * @parent Requirements
 * @desc This how required switches are displayed.
 * %1 - Switch Name
 * @default \I[160]%1
 * 
 * @param Costs
 * @parent DetailWindow
 *
 * @param LearningTitle:str
 * @text Cost Title
 * @parent Costs
 * @desc Text used when drawing the learning costs.
 * %1 - Skill Icon, %2 - Skill Name
 * @default \C[16]Learning\C[0] %1%2
 *
 * @param IngredientName:str
 * @text Cost Name
 * @parent Costs
 * @desc Text used to label the resource being consumed.
 * @default \C[16]Resource\C[0]
 *
 * @param IngredientCost:str
 * @text Cost Quantity
 * @parent Costs
 * @desc Text used to label the cost of the resource.
 * @default \C[16]Cost\C[0]
 *
 * @param IngredientOwned:str
 * @text Cost of Owned
 * @parent Costs
 * @desc Text used to label the amount of the resource in possession.
 * @default \C[16]Owned\C[0]
 *
 * @param DetailWindow_BgType:num
 * @text Background Type
 * @parent DetailWindow
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
 * @param DetailWindow_RectJS:func
 * @text JS: X, Y, W, H
 * @parent DetailWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const skillWindowRect = this.itemWindowRect();\nconst wx = skillWindowRect.x;\nconst wy = skillWindowRect.y;\nconst ww = skillWindowRect.width;\nconst wh = skillWindowRect.height - this.calcWindowHeight(2, false);\nreturn new Rectangle(wx, wy, ww, wh);"
 *
 * @param ConfirmWindow
 * @text Confirm Window
 *
 * @param ConfirmCmd:str
 * @text Confirm Text
 * @parent ConfirmWindow
 * @desc Text used for the Confirm command.
 * Text codes can be used.
 * @default \I[164]Learn
 *
 * @param CancelCmd:str
 * @text Cancel Text
 * @parent ConfirmWindow
 * @desc Text used for the Cancel command.
 * Text codes can be used.
 * @default \I[168]Cancel
 *
 * @param ConfirmWindow_BgType:num
 * @text Background Type
 * @parent ConfirmWindow
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
 * @param ConfirmWindow_RectJS:func
 * @text JS: X, Y, W, H
 * @parent ConfirmWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const skillWindowRect = this.itemWindowRect();\nconst ww = skillWindowRect.width;\nconst wh = this.calcWindowHeight(2, false);\nconst wx = skillWindowRect.x;\nconst wy = skillWindowRect.y + skillWindowRect.height - wh;\nreturn new Rectangle(wx, wy, ww, wh);"
 *
 */
/* ----------------------------------------------------------------------------
 * Ability Points Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~AbilityPoints:
 *
 * @param Mechanics
 *
 * @param SharedResource:eval
 * @text Shared Ability Points
 * @parent Mechanics
 * @type boolean
 * @on Shared Across Classes
 * @off Classes Separate
 * @desc Do you want Ability Points to be shared across all classes?
 * Or do you want all classes to have their own?
 * @default true
 *
 * @param DefaultCost:num
 * @text Default Cost
 * @parent Mechanics
 * @type Number
 * @desc What's the default AP cost of a skill when trying to learn
 * it through the Skill Learn System?
 * @default 0
 *
 * @param MaxResource:num
 * @text Maximum
 * @parent Mechanics
 * @type Number
 * @desc What's the maximum amount of Ability Points an actor can have?
 * Use 0 for unlimited Ability Points.
 * @default 0
 *
 * @param Visual
 *
 * @param ShowInMenus:eval
 * @text Show In Menus?
 * @parent Visual
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Do you wish to show Ability Points in menus that allow them?
 * @default true
 *
 * @param Icon:num
 * @text Icon
 * @parent Visual
 * @desc What is the icon you want to use to represent Ability Points?
 * @default 78
 *
 * @param Vocabulary
 *
 * @param FullText:str
 * @text Full Text
 * @parent Vocabulary
 * @desc The full text of how Ability Points appears in-game.
 * @default Ability Points
 *
 * @param AbbrText:str
 * @text Abbreviated Text
 * @parent Vocabulary
 * @desc The abbreviation of how Ability Points appears in-game.
 * @default AP
 *
 * @param TextFmt:str
 * @text Menu Text Format
 * @parent Vocabulary
 * @desc What is the text format for it to be displayed in windows.
 * %1 - Value, %2 - Abbr, %3 - Icon, %4 - Full Text
 * @default %1 \c[5]%2\c[0]%3
 *
 * @param Gain
 *
 * @param PerAction:str
 * @text Per Action Hit
 * @parent Gain
 * @desc How many Ability Points should an actor gain per action?
 * You may use code.
 * @default 10 + Math.randomInt(5)
 *
 * @param PerLevelUp:str
 * @text Per Level Up
 * @parent Gain
 * @desc How many Ability Points should an actor gain per level up?
 * You may use code.
 * @default 0
 *
 * @param PerEnemy:str
 * @text Per Enemy Defeated
 * @parent Gain
 * @desc How many Ability Points should an actor gain per enemy?
 * You may use code.
 * @default 50 + Math.randomInt(10)
 *
 * @param AliveActors:eval
 * @text Alive Actors?
 * @parent PerEnemy:str
 * @type boolean
 * @on Alive Requirement
 * @off No Requirement
 * @desc Do actors have to be alive to receive Ability Points from
 * defeated enemies?
 * @default true
 *
 * @param Victory
 *
 * @param ShowVictory:eval
 * @text Show During Victory?
 * @parent Victory
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show how much AP an actor has earned in battle during the
 * victory phase?
 * @default true
 *
 * @param VictoryText:str
 * @text Victory Text
 * @parent Victory
 * @desc For no Victory Aftermath, this is the text that appears.
 * %1 - Actor, %2 - Earned, %3 - Abbr, %4 - Full Text
 * @default %1 gains %2 %3!
 *
 * @param AftermathActorDisplay:eval
 * @text Aftermath Display?
 * @parent Victory
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Requires VisuMZ_3_VictoryAftermath. Show Ability Points as
 * the main acquired resource in the actor windows?
 * @default true
 *
 * @param AftermathText:str
 * @text Aftermath Text
 * @parent Victory
 * @desc For no Victory Aftermath, this is the text that appears.
 * %1 - Earned, %2 - Abbr, %3 - Full Text
 * @default +%1 %2
 *
 */
/* ----------------------------------------------------------------------------
 * Skill Points Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~SkillPoints:
 *
 * @param Mechanics
 *
 * @param SharedResource:eval
 * @text Shared Skill Points
 * @parent Mechanics
 * @type boolean
 * @on Shared Across Classes
 * @off Classes Separate
 * @desc Do you want Skill Points to be shared across all classes?
 * Or do you want all classes to have their own?
 * @default false
 *
 * @param DefaultCost:num
 * @text Default Cost
 * @parent Mechanics
 * @type Number
 * @desc What's the default SP cost of a skill when trying to learn
 * it through the Skill Learn System?
 * @default 1
 *
 * @param MaxResource:num
 * @text Maximum
 * @parent Mechanics
 * @type Number
 * @desc What's the maximum amount of Skill Points an actor can have?
 * Use 0 for unlimited Skill Points.
 * @default 0
 *
 * @param Visual
 *
 * @param ShowInMenus:eval
 * @text Show In Menus?
 * @parent Visual
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Do you wish to show Skill Points in menus that allow them?
 * @default true
 *
 * @param Icon:num
 * @text Icon
 * @parent Visual
 * @desc What is the icon you want to use to represent Skill Points?
 * @default 79
 *
 * @param Vocabulary
 *
 * @param FullText:str
 * @text Full Text
 * @parent Vocabulary
 * @desc The full text of how Skill Points appears in-game.
 * @default Skill Points
 *
 * @param AbbrText:str
 * @text Abbreviated Text
 * @parent Vocabulary
 * @desc The abbreviation of how Skill Points appears in-game.
 * @default SP
 *
 * @param TextFmt:str
 * @text Menu Text Format
 * @parent Vocabulary
 * @desc What is the text format for it to be displayed in windows.
 * %1 - Value, %2 - Abbr, %3 - Icon, %4 - Full Text
 * @default %1 \c[4]%2\c[0]%3
 *
 * @param Gain
 *
 * @param PerAction:str
 * @text Per Action Hit
 * @parent Gain
 * @desc How many Skill Points should an actor gain per action?
 * You may use code.
 * @default 0
 *
 * @param PerLevelUp:str
 * @text Per Level Up
 * @parent Gain
 * @desc How many Skill Points should an actor gain per level up?
 * You may use code.
 * @default 100
 *
 * @param PerEnemy:str
 * @text Per Enemy Defeated
 * @parent Gain
 * @desc How many Skill Points should an actor gain per enemy?
 * You may use code.
 * @default 0
 *
 * @param AliveActors:eval
 * @text Alive Actors?
 * @parent PerEnemy:str
 * @type boolean
 * @on Alive Requirement
 * @off No Requirement
 * @desc Do actors have to be alive to receive Skill Points from
 * defeated enemies?
 * @default true
 *
 * @param Victory
 *
 * @param ShowVictory:eval
 * @text Show During Victory?
 * @parent Victory
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show how much SP an actor has earned in battle during the
 * victory phase?
 * @default false
 *
 * @param VictoryText:str
 * @text Victory Text
 * @parent Victory
 * @desc For no Victory Aftermath, this is the text that appears.
 * %1 - Actor, %2 - Earned, %3 - Abbr, %4 - Full Text
 * @default %1 gains %2 %3!
 *
 * @param AftermathActorDisplay:eval
 * @text Aftermath Display?
 * @parent Victory
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Requires VisuMZ_3_VictoryAftermath. Show Skill Points as
 * the main acquired resource in the actor windows?
 * @default false
 *
 * @param AftermathText:str
 * @text Aftermath Text
 * @parent Victory
 * @desc For no Victory Aftermath, this is the text that appears.
 * %1 - Earned, %2 - Abbr, %3 - Full Text
 * @default +%1 %2
 *
 */
//=============================================================================

const _0x1b68=['ShowWindows','applySkillLearnSystemUserEffect','Game_Party_setupBattleTestMembers','Points','Skill-%1-%2','LearnReqSwitchesAll','\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20Declare\x20Variables\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20arguments[0];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20skill\x20=\x20arguments[1];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20enabled\x20=\x20true;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20Process\x20Code\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20Return\x20Condition\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20enabled;\x0a\x20\x20\x20\x20\x20\x20\x20\x20','LearnReqSkillsAll','remove','PerAction','StartClassAbilityPoints','ConfirmWindow_BgType','jobPointsIcon','gainStartingSkillPoints','contents','removeChild','LearnSkillA','skillPointsFmt','addAbilityPoints','currencyUnit','UserGainSkillPoints','opacity','reduce','makeRewards','ShowAnimations','innerWidth','version','initSkillLearnSystemMenuAccess','inBattle','constructor','shift','includes','_itemWindow','changePaintOpacity','isCommandEnabled','\x5cI[%1]%2','SWITCHES','skillLearnAlreadyLearned','calcWindowHeight','skillPointsRate','isSkillLearnEnabled','ceil','ArmorFmt','skillLearnReqSeparatorFmt','LEVEL','shouldDrawSkillLearnRequirements','LearnJpCost','isConfirmEnabled','PerLevelUp','Gold','Window_SkillList_maxCols','initialize','Sound','skillLearnConfirmWindow','isAlive','Game_Action_applyItemUserEffect','map','applyAbilityPoints','user','createSkillLearnCostText','drawJobPoints','_SkillLearnSystem_MenuAccess','_skillLearnBitmapSprite','abilityPointsFmt','setSkillLearnSkillSpritePosition','skillLearnGoldFmt','hide','skillLearnReqHeaderFmt','exit','process_VisuMZ_SkillLearnSystem_Notetags','VisuMZ_0_CoreEngine','makeItemList','TargetGainAbilityPoints','setSkillLearnSkillSpriteBitmap','Actor-%1-%2','createSkillLearnIngredientsWindow','name','playSkillLearn','ClassChangeSystem','destroy','isSkill','Actors','registerCommand','skillLearnItemFmt','RequireFmt','LearnShowSkillsAny','jsLearnShowDetailTxt','isPlaytest','getSkillPoints','RequirementTitle','skillLearnConfirmCmd','round','LearnReqLevel','push','LearnReqSkillsAny','applyItemUserEffect','getArmorIdWithName','create','skillLearnReqTitle','prototype','_skillLearnAnimationWait','initSkillPoints','skillLearnReqListSkill','getSkillLearnClassPointCost','skillLearnReqSkillFmt','loseAbilityPoints','_statusWindow','Animations','Game_Battler_onBattleStart','\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20Declare\x20Variables\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20arguments[0];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20skill\x20=\x20arguments[1];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20cost\x20=\x200;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20Process\x20Code\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20Return\x20Cost\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20cost;\x0a\x20\x20\x20\x20\x20\x20\x20\x20','numItems','BattleManager_displayRewards','abilityPointsAbbr','setFrame','abilityPointsFull','Custom','LearnWeaponCost','isSkillLearnMode','gainStartingAbilityPoints','Window_SkillList_makeItemList','clamp','BattleManager_makeRewards','skillLearnCmd','isActor','earnedAbilityPoints','updateSkillLearnSpriteOpacity','destroySkillLearnSprite','currentClass','Scene_Skill_update','Ability','anchor','commandName','IngredientName','parse','setupBattleTestMembers','startSkillLearnAnimation','commandStyle','isBattleMember','SkillPointsLose','playStaticSe','note','ReqSwitchFmt','ARRAYSTR','Window_SkillList_isEnabled','GoldIcon','Scene_Skill_create','_skillPoints','drawTextExRightAlign','skillLearningName','StartClassSkillPoints','Game_Actor_levelUp','item','ARRAYFUNC','skillLearnIncludes','iconHeight','Window_SkillStatus_refresh','makeDeepCopy','gainRewardsAbilityPoints','Window_SkillType_makeCommandList','ReqSeparateFmt','_actor','shouldDrawRequirements','AbilityPointsRate','Classes','getSkillLearnArmorCost','quantity','bitmap','setBackgroundType','makeCommandList','ReqMetFmt','left','sort','getJobPoints','Window_SkillList_drawItem','_itemIDs','playOkSound','onLoadBattleTestSkillLearnSystem','refresh','skillLearnSystemCommandName','isTriggered','jsLearnJpCost','itemLineRect','drawActorAbilityPoints','Armor','EVAL','drawTextExCenterAlign','jobPointsAbbr','skillLearnReqListLevel','onItemOk','Item','_weaponIDs','SKILLS','getSkillLearnItemCost','_classIDs','IconSet','Class-%1-%2','_skillLearnIngredientsWindow','activate','add','currentSymbol','max','Armor-%1-%2','canPayForSkillLearnSystem','finishSkillLearnAnimation','abilityPointsVisible','abilityPointsTotal','%1%2','EnemySkillPoints','skillPoints','gainSkillPointsForMulticlasses','drawItem','isReleased','updateSkillLearnAnimationSprite','loseSkillPoints','loadSystem','getSkillLearnSkillsFromClass','DisplayedCosts','AbilityPoints','isPlaying','LearnCostBatch','WeaponFmt','Weapon','Window','getSkillLearnSkillPointCost','_skillLearnSystem_drawItemMode','createKeyJS','Game_Actor_setup','show','setup','toUpperCase','skillLearnReqListSwitch','jsLearnReqListTxt','LearnShowSwitchesAny','Animation','onSkillLearnConfirmCancel','MenuAccess','skillPointsVisible','ShowVictory','frames','EnemyAbilityPoints','skillLearningCost','LearningTitle','scale','\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20Declare\x20Variables\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20arguments[0];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20skill\x20=\x20arguments[1];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20visible\x20=\x20true;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20Process\x20Code\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20Return\x20Visible\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20visible;\x0a\x20\x20\x20\x20\x20\x20\x20\x20','StatusWindowDrawJS','addChild','addSkillPoints','resetTextColor','cancel','classPointsAbbr','learnPicture','maxCols','switches','skillLearnReqLevelFmt','AbbrText','GoldFmt','getSkillLearnCostText','changeClass','jsLearnReq','skillLearn','description','ClassPoints','filter','_windowLayer','SystemShowSkillLearnSystemMenu','Scene_Skill_onItemOk','_learnPicture','ARMOR','skillLearnReqMet','loseClassPoints','createVisibleJS','return\x200','JobPoints','setAbilityPoints','_skillLearnIconSpriteOpacitySpeed','createSkillLearnSkillSprite','drawSkillCost','VisuMZ_2_ClassChangeSystem','width','makeRewardsAbilityPoints','processFinishSkillLearnAnimation','gold','isMVAnimation','loseItem','_skillLearnConfirmWindow','Learned','isEnabled','skillPointsTotal','colSpacing','getSkillLearnAbilityPointCost','jobPointsFull','TextFmt','onDatabaseLoaded','_skillLearnIconSprite','_scene','_armorIDs','jsOnLearn','jsLearnReqDetailTxt','log','members','LearnCpCost','trim','setHandler','jsLearnApCost','abilityPoints','SharedResource','setSkillPoints','text','height','length','onBattleStart','AbilityPointsSet','LearnItemCost','_rewards','ParseSkillNotetags','AbilityPointsGain','skillLearnIngredientsWindowRect','itemPadding','drawRequirements','Window_SkillList_drawSkillCost','Weapon-%1-%2','TargetGainSkillPoints','Scene_Boot_onDatabaseLoaded','_earnedSkillPoints','min','processPayForSkillLearnSystem','IngredientCost','STR','ReqSkillFmt','setSkillLearnSkillSpriteFrame','destroySkillLearnAnimationSprite','drawActorSimpleStatus','match','itemHeight','process_VisuMZ_SkillLearnSystem_JS','traitObjects','Window_SkillList_includes','_data','textSizeEx','STRUCT','drawSkillLearnCost','onSkillLearnItemOk','levelUp','AbilityPointsAdd','smooth','ARRAYEVAL','classPointsFull','makeSkillLearnList','right','abilityPointsRate','meetRequirementsForSkillLearnSystem','DetailWindow_BgType','drawSkillPoints','onSkillLearnConfirmOk','CUSTOM','levelUpGainAbilityPoints','refreshSkillLearnSystem','createSkillLearnConfirmWindow','SkillPoints','learnSkill','ReqLevelFmt','_skillLearnAnimationSprite','SkillPointsSet','format','_earnedAbilityPoints','update','getAbilityPoints','setSkillLearnSkillSpriteOpacity','skillPointsFull','ITEM','SkillLearnSystem','ConvertParams','setupBattleTestMembersSkillLearnSystem','getSkillLearnRequirementText','drawClassPoints','Parse_Notetags_CreateJS','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','getClassIdWithName','updateSkillLearnAnimation','setStypeId','ARRAYJSON','displayRewardsAbilityPoints','isLearnedSkill','status','gainSkillPoints','AliveActors','isFinishedSkillLearnAnimating','RegExp','ParseAllNotetags','test','MAX_SAFE_INTEGER','_skillIDs','bind','drawActorSkillPoints','lineHeight','DefaultCost','ConfirmWindow_RectJS','skillLearnCancelCmd','replace','setSkillLearnSystemMenuAccess','applyItemSkillLearnSystemUserEffect','VictoryText','\x5cI[%1]','drawTextEx','jsLearnSpCost','Game_System_initialize','addCommand','skillPointsAbbr','jsLearnShowListTxt','loadPicture','innerHeight','itemWindowRect','resetFontSettings','LearnReqSwitchesAny','createSkillLearnAnimation','StartingAbilityPoints','getItemIdWithName','FUNC','createTextJS','subject','skillTypes','level','isSkillLearnSystemMenuAccess','getSkillIdWithName','addSkillLearnSystemCommand','ARRAYSTRUCT','Game_Actor_changeClass','_skillLearnAnimationIDs','getSkillLearnWeaponCost','allMembers','skillLearnArmorFmt','drawAbilityPoints','skillLearningOwned','bigPicture','floor','getSkillLearnDisplayedCosts','skillPointsIcon','SkillPointsRate','createSkillLearnAnimationIDs','_SkillLearnSystem_preventLevelUpGain','_abilityPoints','General','ShowMenu','LearnSkillB','value','createConditionJS','levelA','initAbilityPoints','center','UserGainAbilityPoints','%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','earnedSkillPoints','skillLearnReqSwitchFmt','drawCurrencyValue','gainAbilityPointsForMulticlasses','getSkillLearnJobPointCost','LearnArmorCost','skillLearnReqNotMet','faceWidth','iconIndex','addWindow','select','displayRewards','visible','actor','concat','abilityPointsIcon','levelUpGainSkillPoints','gainAbilityPoints','split','skillLearningTitle','drawItemName','JSON','deadMembers','drawActorJobPoints','GOLD','enemy','createCostJS','Game_Actor_learnSkill','displayRewardsSkillPoints','clear','jsLearnShow','call','MaxResource','Settings','skillLearnWeaponFmt','classPointsIcon','CoreEngine','SkillPointsGain','skillLearnSeparationFmt','getSkillLearnGoldCost','_skillLearnAnimationPlaying','loseGold','getWeaponIdWithName','\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20Declare\x20Variables\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20arguments[0];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20skill\x20=\x20arguments[1];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20let\x20text\x20=\x20\x27\x27;\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20Process\x20Code\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20Return\x20Text\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20return\x20text;\x0a\x20\x20\x20\x20\x20\x20\x20\x20','Window_SkillList_setStypeId','LearnShowSkillsAll','Icon','drawSkillLearnRequirements','WEAPON','optExtraExp'];(function(_0x5674de,_0xcc6093){const _0x1b6823=function(_0x34f9ed){while(--_0x34f9ed){_0x5674de['push'](_0x5674de['shift']());}};_0x1b6823(++_0xcc6093);}(_0x1b68,0x8a));const _0x34f9=function(_0x5674de,_0xcc6093){_0x5674de=_0x5674de-0x15e;let _0x1b6823=_0x1b68[_0x5674de];return _0x1b6823;};const _0x19b8c2=_0x34f9;var label=_0x19b8c2(0x246),tier=tier||0x0,dependencies=[],pluginData=$plugins[_0x19b8c2(0x1da)](function(_0x412a2e){const _0x28ec52=_0x19b8c2;return _0x412a2e[_0x28ec52(0x253)]&&_0x412a2e[_0x28ec52(0x1d8)][_0x28ec52(0x2e9)]('['+label+']');})[0x0];VisuMZ[label]['Settings']=VisuMZ[label][_0x19b8c2(0x2b9)]||{},VisuMZ[_0x19b8c2(0x247)]=function(_0x2c8aa6,_0x41262b){const _0x3c6dd3=_0x19b8c2;for(const _0x22ceab in _0x41262b){if(_0x22ceab['match'](/(.*):(.*)/i)){const _0x101501=String(RegExp['$1']),_0x371f53=String(RegExp['$2'])[_0x3c6dd3(0x1b9)]()[_0x3c6dd3(0x201)]();let _0x56c5dd,_0x18c009,_0x271348;switch(_0x371f53){case'NUM':_0x56c5dd=_0x41262b[_0x22ceab]!==''?Number(_0x41262b[_0x22ceab]):0x0;break;case'ARRAYNUM':_0x18c009=_0x41262b[_0x22ceab]!==''?JSON[_0x3c6dd3(0x34f)](_0x41262b[_0x22ceab]):[],_0x56c5dd=_0x18c009['map'](_0x5b101a=>Number(_0x5b101a));break;case _0x3c6dd3(0x18c):_0x56c5dd=_0x41262b[_0x22ceab]!==''?eval(_0x41262b[_0x22ceab]):null;break;case _0x3c6dd3(0x22d):_0x18c009=_0x41262b[_0x22ceab]!==''?JSON['parse'](_0x41262b[_0x22ceab]):[],_0x56c5dd=_0x18c009[_0x3c6dd3(0x302)](_0x42db8d=>eval(_0x42db8d));break;case _0x3c6dd3(0x2ad):_0x56c5dd=_0x41262b[_0x22ceab]!==''?JSON[_0x3c6dd3(0x34f)](_0x41262b[_0x22ceab]):'';break;case _0x3c6dd3(0x250):_0x18c009=_0x41262b[_0x22ceab]!==''?JSON[_0x3c6dd3(0x34f)](_0x41262b[_0x22ceab]):[],_0x56c5dd=_0x18c009[_0x3c6dd3(0x302)](_0x32ed43=>JSON[_0x3c6dd3(0x34f)](_0x32ed43));break;case _0x3c6dd3(0x275):_0x56c5dd=_0x41262b[_0x22ceab]!==''?new Function(JSON[_0x3c6dd3(0x34f)](_0x41262b[_0x22ceab])):new Function(_0x3c6dd3(0x1e3));break;case _0x3c6dd3(0x16c):_0x18c009=_0x41262b[_0x22ceab]!==''?JSON['parse'](_0x41262b[_0x22ceab]):[],_0x56c5dd=_0x18c009[_0x3c6dd3(0x302)](_0x51dab0=>new Function(JSON[_0x3c6dd3(0x34f)](_0x51dab0)));break;case _0x3c6dd3(0x21b):_0x56c5dd=_0x41262b[_0x22ceab]!==''?String(_0x41262b[_0x22ceab]):'';break;case _0x3c6dd3(0x162):_0x18c009=_0x41262b[_0x22ceab]!==''?JSON[_0x3c6dd3(0x34f)](_0x41262b[_0x22ceab]):[],_0x56c5dd=_0x18c009[_0x3c6dd3(0x302)](_0xf8b0c6=>String(_0xf8b0c6));break;case _0x3c6dd3(0x227):_0x271348=_0x41262b[_0x22ceab]!==''?JSON[_0x3c6dd3(0x34f)](_0x41262b[_0x22ceab]):{},_0x56c5dd=VisuMZ[_0x3c6dd3(0x247)]({},_0x271348);break;case _0x3c6dd3(0x27d):_0x18c009=_0x41262b[_0x22ceab]!==''?JSON[_0x3c6dd3(0x34f)](_0x41262b[_0x22ceab]):[],_0x56c5dd=_0x18c009[_0x3c6dd3(0x302)](_0x1fd524=>VisuMZ['ConvertParams']({},JSON[_0x3c6dd3(0x34f)](_0x1fd524)));break;default:continue;}_0x2c8aa6[_0x101501]=_0x56c5dd;}}return _0x2c8aa6;},(_0xd6056d=>{const _0x157e93=_0x19b8c2,_0x1071db=_0xd6056d[_0x157e93(0x316)];for(const _0x16bb21 of dependencies){if(!Imported[_0x16bb21]){alert(_0x157e93(0x297)[_0x157e93(0x23f)](_0x1071db,_0x16bb21)),SceneManager['exit']();break;}}const _0x54c591=_0xd6056d[_0x157e93(0x1d8)];if(_0x54c591[_0x157e93(0x220)](/\[Version[ ](.*?)\]/i)){const _0x3134ba=Number(RegExp['$1']);_0x3134ba!==VisuMZ[label][_0x157e93(0x2e4)]&&(alert(_0x157e93(0x24c)['format'](_0x1071db,_0x3134ba)),SceneManager[_0x157e93(0x30e)]());}if(_0x54c591['match'](/\[Tier[ ](\d+)\]/i)){const _0x18005e=Number(RegExp['$1']);_0x18005e<tier?(alert(_0x157e93(0x296)['format'](_0x1071db,_0x18005e,tier)),SceneManager[_0x157e93(0x30e)]()):tier=Math[_0x157e93(0x19c)](_0x18005e,tier);}VisuMZ['ConvertParams'](VisuMZ[label]['Settings'],_0xd6056d['parameters']);})(pluginData),PluginManager[_0x19b8c2(0x31c)](pluginData[_0x19b8c2(0x316)],_0x19b8c2(0x20f),_0xc168dd=>{const _0x5a6bc6=_0x19b8c2;VisuMZ['ConvertParams'](_0xc168dd,_0xc168dd);const _0x1db175=_0xc168dd[_0x5a6bc6(0x31b)][_0x5a6bc6(0x302)](_0x2d1391=>$gameActors[_0x5a6bc6(0x2a5)](_0x2d1391)),_0x45beee=_0xc168dd[_0x5a6bc6(0x177)],_0x390fb7=_0xc168dd['Points'];for(const _0x2eb4de of _0x1db175){if(!_0x2eb4de)continue;for(const _0x4ce5bb of _0x45beee){_0x2eb4de['gainAbilityPoints'](_0x390fb7,_0x4ce5bb);}}}),PluginManager[_0x19b8c2(0x31c)](pluginData[_0x19b8c2(0x316)],_0x19b8c2(0x22b),_0x5e82f3=>{const _0x253d28=_0x19b8c2;VisuMZ['ConvertParams'](_0x5e82f3,_0x5e82f3);const _0xc96d6=_0x5e82f3['Actors'][_0x253d28(0x302)](_0x394ac0=>$gameActors[_0x253d28(0x2a5)](_0x394ac0)),_0x55690b=_0x5e82f3['Classes'],_0x3bc50a=_0x5e82f3[_0x253d28(0x2cd)];for(const _0x312c93 of _0xc96d6){if(!_0x312c93)continue;for(const _0x4b07f1 of _0x55690b){_0x312c93[_0x253d28(0x2dc)](_0x3bc50a,_0x4b07f1);}}}),PluginManager['registerCommand'](pluginData[_0x19b8c2(0x316)],'AbilityPointsLose',_0x12b3a4=>{const _0x32d62c=_0x19b8c2;VisuMZ[_0x32d62c(0x247)](_0x12b3a4,_0x12b3a4);const _0x46b72b=_0x12b3a4[_0x32d62c(0x31b)][_0x32d62c(0x302)](_0x3a4ea6=>$gameActors[_0x32d62c(0x2a5)](_0x3a4ea6)),_0x58a864=_0x12b3a4['Classes'],_0x4920af=_0x12b3a4['Points'];for(const _0x51970d of _0x46b72b){if(!_0x51970d)continue;for(const _0x3bd9c3 of _0x58a864){_0x51970d['loseAbilityPoints'](_0x4920af,_0x3bd9c3);}}}),PluginManager['registerCommand'](pluginData[_0x19b8c2(0x316)],_0x19b8c2(0x20b),_0x2a972f=>{const _0x377fd2=_0x19b8c2;VisuMZ[_0x377fd2(0x247)](_0x2a972f,_0x2a972f);const _0x1330b7=_0x2a972f[_0x377fd2(0x31b)][_0x377fd2(0x302)](_0x555afd=>$gameActors['actor'](_0x555afd)),_0x2ee0d8=_0x2a972f['Classes'],_0x2d54a7=_0x2a972f['Points'];for(const _0x4b9c84 of _0x1330b7){if(!_0x4b9c84)continue;for(const _0x47ea07 of _0x2ee0d8){_0x4b9c84['setAbilityPoints'](_0x2d54a7,_0x47ea07);}}}),PluginManager[_0x19b8c2(0x31c)](pluginData[_0x19b8c2(0x316)],_0x19b8c2(0x2bd),_0x361281=>{const _0x3ccd9f=_0x19b8c2;VisuMZ[_0x3ccd9f(0x247)](_0x361281,_0x361281);const _0x2e7356=_0x361281[_0x3ccd9f(0x31b)]['map'](_0x2f5c14=>$gameActors[_0x3ccd9f(0x2a5)](_0x2f5c14)),_0x5b32f7=_0x361281[_0x3ccd9f(0x177)],_0x17ce79=_0x361281['Points'];for(const _0x4bfc0a of _0x2e7356){if(!_0x4bfc0a)continue;for(const _0x233aeb of _0x5b32f7){_0x4bfc0a['gainSkillPoints'](_0x17ce79,_0x233aeb);}}}),PluginManager[_0x19b8c2(0x31c)](pluginData['name'],'SkillPointsAdd',_0xc15cee=>{const _0x1e357e=_0x19b8c2;VisuMZ[_0x1e357e(0x247)](_0xc15cee,_0xc15cee);const _0x3b10b8=_0xc15cee[_0x1e357e(0x31b)]['map'](_0x2cf427=>$gameActors[_0x1e357e(0x2a5)](_0x2cf427)),_0x4b23e4=_0xc15cee[_0x1e357e(0x177)],_0x318869=_0xc15cee[_0x1e357e(0x2cd)];for(const _0x53d0b6 of _0x3b10b8){if(!_0x53d0b6)continue;for(const _0x3f7482 of _0x4b23e4){_0x53d0b6[_0x1e357e(0x1ca)](_0x318869,_0x3f7482);}}}),PluginManager[_0x19b8c2(0x31c)](pluginData[_0x19b8c2(0x316)],_0x19b8c2(0x15e),_0x486adc=>{const _0x1f950f=_0x19b8c2;VisuMZ[_0x1f950f(0x247)](_0x486adc,_0x486adc);const _0xc6b921=_0x486adc[_0x1f950f(0x31b)][_0x1f950f(0x302)](_0x5901e9=>$gameActors[_0x1f950f(0x2a5)](_0x5901e9)),_0x500a0a=_0x486adc[_0x1f950f(0x177)],_0x3ab142=_0x486adc[_0x1f950f(0x2cd)];for(const _0x47be1d of _0xc6b921){if(!_0x47be1d)continue;for(const _0x29da9c of _0x500a0a){_0x47be1d[_0x1f950f(0x1a9)](_0x3ab142,_0x29da9c);}}}),PluginManager['registerCommand'](pluginData[_0x19b8c2(0x316)],_0x19b8c2(0x23e),_0x393a7f=>{const _0x7a1660=_0x19b8c2;VisuMZ['ConvertParams'](_0x393a7f,_0x393a7f);const _0x564bcd=_0x393a7f[_0x7a1660(0x31b)][_0x7a1660(0x302)](_0x1adc5f=>$gameActors['actor'](_0x1adc5f)),_0x1e8a3d=_0x393a7f[_0x7a1660(0x177)],_0x45ede3=_0x393a7f['Points'];for(const _0x5c3d80 of _0x564bcd){if(!_0x5c3d80)continue;for(const _0x37b121 of _0x1e8a3d){_0x5c3d80[_0x7a1660(0x206)](_0x45ede3,_0x37b121);}}}),PluginManager[_0x19b8c2(0x31c)](pluginData[_0x19b8c2(0x316)],_0x19b8c2(0x1dc),_0x26656b=>{const _0x3c4d88=_0x19b8c2;VisuMZ[_0x3c4d88(0x247)](_0x26656b,_0x26656b),$gameSystem['setSkillLearnSystemMenuAccess'](_0x26656b['Show']);}),VisuMZ['SkillLearnSystem']['Scene_Boot_onDatabaseLoaded']=Scene_Boot[_0x19b8c2(0x32d)][_0x19b8c2(0x1f8)],Scene_Boot[_0x19b8c2(0x32d)][_0x19b8c2(0x1f8)]=function(){const _0x290d06=_0x19b8c2;VisuMZ[_0x290d06(0x246)][_0x290d06(0x216)][_0x290d06(0x2b7)](this),this[_0x290d06(0x30f)]();},Scene_Boot['prototype']['process_VisuMZ_SkillLearnSystem_Notetags']=function(){const _0x3b16f4=_0x19b8c2;if(VisuMZ[_0x3b16f4(0x258)])return;this[_0x3b16f4(0x222)]();},VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x257)]={'StartingAbilityPoints':/<STARTING (?:ABILITY POINTS|AP):[ ](.*)>/i,'StartClassAbilityPoints':/<CLASS (.*) STARTING (?:ABILITY POINTS|AP):[ ](.*)>/gi,'UserGainAbilityPoints':/<(?:ABILITY POINTS|AP|USER ABILITY POINTS|USER AP) GAIN:[ ](.*)>/i,'TargetGainAbilityPoints':/<TARGET (?:ABILITY POINTS|AP) GAIN:[ ](.*)>/i,'EnemyAbilityPoints':/<(?:ABILITY POINTS|AP):[ ](.*)>/i,'AbilityPointsRate':/<(?:ABILITY POINTS|AP) RATE:[ ](\d+)([%％])>/i,'StartingSkillPoints':/<STARTING (?:SKILL POINTS|SP):[ ](.*)>/i,'StartClassSkillPoints':/<CLASS (.*) STARTING (?:SKILL POINTS|SP):[ ](.*)>/gi,'UserGainSkillPoints':/<(?:SKILL POINTS|SP|USER SKILL POINTS|USER SP) GAIN:[ ](.*)>/i,'TargetGainSkillPoints':/<TARGET (?:SKILL POINTS|SP) GAIN:[ ](.*)>/i,'EnemySkillPoints':/<(?:SKILL POINTS|SP):[ ](.*)>/i,'SkillPointsRate':/<(?:SKILL POINTS|SP) RATE:[ ](\d+)([%％])>/i,'LearnSkillA':/<LEARN (?:SKILL|SKILLS):[ ](.*)>/gi,'LearnSkillB':/<LEARN (?:SKILL|SKILLS)>\s*([\s\S]*)\s*<\/LEARN (?:SKILL|SKILLS)>/i,'LearnApCost':/<LEARN (?:ABILITY POINTS|AP) COST:[ ](\d+)>/i,'LearnCpCost':/<LEARN (?:CLASS POINTS|CP) COST:[ ](\d+)>/i,'LearnJpCost':/<LEARN (?:JOB POINTS|JP) COST:[ ](\d+)>/i,'LearnSpCost':/<LEARN (?:SKILL POINTS|SP) COST:[ ](\d+)>/i,'LearnItemCost':/<LEARN ITEM (.*) COST:[ ](\d+)>/gi,'LearnWeaponCost':/<LEARN WEAPON (.*) COST:[ ](\d+)>/gi,'LearnArmorCost':/<LEARN ARMOR (.*) COST:[ ](\d+)>/gi,'LearnGoldCost':/<LEARN GOLD COST:[ ](\d+)>/i,'LearnCostBatch':/<LEARN SKILL (?:COST|COSTS)>\s*([\s\S]*)\s*<\/LEARN SKILL (?:COST|COSTS)>/i,'LearnShowLevel':/<LEARN SHOW LEVEL:[ ](\d+)>/i,'LearnShowSkillsAll':/<LEARN SHOW (?:SKILL|SKILLS|ALL SKILL|ALL SKILLS):[ ](.*)>/i,'LearnShowSkillsAny':/<LEARN SHOW ANY (?:SKILL|SKILLS):[ ](.*)>/i,'LearnShowSwitchesAll':/<LEARN SHOW (?:SWITCH|SWITCHES|ALL SWITCH|ALL SWITCHES):[ ](.*)>/i,'LearnShowSwitchesAny':/<LEARN SHOW ANY (?:SWITCH|SWITCHES):[ ](.*)>/i,'LearnReqLevel':/<LEARN REQUIRE LEVEL:[ ](\d+)>/i,'LearnReqSkillsAll':/<LEARN REQUIRE (?:SKILL|SKILLS|ALL SKILL|ALL SKILLS):[ ](.*)>/i,'LearnReqSkillsAny':/<LEARN REQUIRE ANY (?:SKILL|SKILLS):[ ](.*)>/i,'LearnReqSwitchesAll':/<LEARN REQUIRE (?:SWITCH|SWITCHES|ALL SWITCH|ALL SWITCHES):[ ](.*)>/i,'LearnReqSwitchesAny':/<LEARN REQUIRE ANY (?:SWITCH|SWITCHES):[ ](.*)>/i,'animationIDs':/<LEARN SKILL (?:ANIMATION|ANIMATIONS|ANI):[ ](.*)>/i,'opacitySpeed':/<LEARN SKILL FADE SPEED:[ ](\d+)>/i,'learnPicture':/<LEARN SKILL (?:PICTURE|FILENAME):[ ](.*)>/i,'bigPicture':/<PICTURE:[ ](.*)>/i,'jsLearnApCost':/<JS LEARN (?:ABILITY POINTS|AP) COST>\s*([\s\S]*)\s*<\/JS LEARN (?:ABILITY POINTS|AP) COST>/i,'jsLearnCpCost':/<JS LEARN (?:CLASS POINTS|CP) COST>\s*([\s\S]*)\s*<\/JS LEARN (?:CLASS POINTS|CP) COST>/i,'jsLearnJpCost':/<JS LEARN (?:JOB POINTS|JP) COST>\s*([\s\S]*)\s*<\/JS LEARN (?:JOB POINTS|JP) COST>/i,'jsLearnSpCost':/<JS LEARN (?:SKILL POINTS|SP) COST>\s*([\s\S]*)\s*<\/JS LEARN (?:SKILL POINTS|SP) COST>/i,'jsLearnShow':/<JS LEARN (?:SHOW|VISIBLE)>\s*([\s\S]*)\s*<\/JS LEARN (?:SHOW|VISIBLE)>/i,'jsLearnShowListTxt':/<JS LEARN (?:SHOW|VISIBLE) LIST TEXT>\s*([\s\S]*)\s*<\/JS LEARN (?:SHOW|VISIBLE) LIST TEXT>/i,'jsLearnShowDetailTxt':/<JS LEARN (?:SHOW|VISIBLE) DETAIL TEXT>\s*([\s\S]*)\s*<\/JS LEARN (?:SHOW|VISIBLE) DETAIL TEXT>/i,'jsLearnReq':/<JS LEARN (?:REQUIREMENT|REQUIREMENTS)>\s*([\s\S]*)\s*<\/JS LEARN (?:REQUIREMENT|REQUIREMENTS)>/i,'jsLearnReqListTxt':/<JS LEARN (?:REQUIREMENT|REQUIREMENTS) LIST TEXT>\s*([\s\S]*)\s*<\/JS LEARN (?:REQUIREMENT|REQUIREMENTS) LIST TEXT>/i,'jsLearnReqDetailTxt':/<JS LEARN (?:REQUIREMENT|REQUIREMENTS) DETAIL TEXT>\s*([\s\S]*)\s*<\/JS LEARN (?:REQUIREMENT|REQUIREMENTS) DETAIL TEXT>/i,'jsOnLearn':/<JS ON LEARN SKILL>\s*([\s\S]*)\s*<\/JS ON LEARN SKILL>/i},VisuMZ[_0x19b8c2(0x246)]['JS']={},Scene_Boot[_0x19b8c2(0x32d)][_0x19b8c2(0x222)]=function(){const _0x4c57c9=_0x19b8c2,_0x275b1c=$dataActors[_0x4c57c9(0x2a6)]($dataSkills);for(const _0xd2cc8a of _0x275b1c){if(!_0xd2cc8a)continue;VisuMZ['SkillLearnSystem'][_0x4c57c9(0x24b)](_0xd2cc8a);}},VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x20e)]=VisuMZ[_0x19b8c2(0x20e)],VisuMZ[_0x19b8c2(0x20e)]=function(_0x2f000b){const _0x40b31f=_0x19b8c2;VisuMZ[_0x40b31f(0x246)][_0x40b31f(0x20e)][_0x40b31f(0x2b7)](this,_0x2f000b),VisuMZ[_0x40b31f(0x246)][_0x40b31f(0x24b)](_0x2f000b);},VisuMZ[_0x19b8c2(0x246)]['Parse_Notetags_CreateJS']=function(_0x44178d){const _0x240456=_0x19b8c2,_0x5b6560=VisuMZ[_0x240456(0x246)][_0x240456(0x257)];VisuMZ[_0x240456(0x246)][_0x240456(0x2b2)](_0x44178d,_0x240456(0x203),_0x5b6560[_0x240456(0x203)]),VisuMZ[_0x240456(0x246)]['createCostJS'](_0x44178d,'jsLearnCpCost',_0x5b6560['jsLearnCpCost']),VisuMZ[_0x240456(0x246)]['createCostJS'](_0x44178d,_0x240456(0x188),_0x5b6560[_0x240456(0x188)]),VisuMZ[_0x240456(0x246)][_0x240456(0x2b2)](_0x44178d,'jsLearnSpCost',_0x5b6560[_0x240456(0x268)]),VisuMZ[_0x240456(0x246)][_0x240456(0x1e2)](_0x44178d,'jsLearnShow',_0x5b6560[_0x240456(0x2b6)]),VisuMZ[_0x240456(0x246)][_0x240456(0x291)](_0x44178d,_0x240456(0x1d6),_0x5b6560[_0x240456(0x1d6)]),VisuMZ['SkillLearnSystem']['createTextJS'](_0x44178d,'jsLearnShowListTxt',_0x5b6560[_0x240456(0x26c)]),VisuMZ['SkillLearnSystem'][_0x240456(0x276)](_0x44178d,_0x240456(0x320),_0x5b6560[_0x240456(0x320)]),VisuMZ[_0x240456(0x246)][_0x240456(0x276)](_0x44178d,_0x240456(0x1bb),_0x5b6560[_0x240456(0x1bb)]),VisuMZ[_0x240456(0x246)]['createTextJS'](_0x44178d,_0x240456(0x1fd),_0x5b6560[_0x240456(0x1fd)]),VisuMZ['SkillLearnSystem']['createActionJS'](_0x44178d,'jsOnLearn',_0x5b6560[_0x240456(0x1fc)]);},VisuMZ[_0x19b8c2(0x246)]['createCostJS']=function(_0x2b37eb,_0x430ad6,_0x13c657){const _0x208761=_0x19b8c2,_0x1bef22=_0x2b37eb[_0x208761(0x160)];if(_0x1bef22[_0x208761(0x220)](_0x13c657)){const _0x32134a=String(RegExp['$1']),_0x3c7e83=_0x208761(0x337)['format'](_0x32134a),_0x293b6d=VisuMZ[_0x208761(0x246)][_0x208761(0x1b5)](_0x2b37eb,_0x430ad6);VisuMZ[_0x208761(0x246)]['JS'][_0x293b6d]=new Function(_0x3c7e83);}},VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x1e2)]=function(_0x466787,_0x581d91,_0x5d4101){const _0x4bab12=_0x19b8c2,_0x2740a7=_0x466787['note'];if(_0x2740a7['match'](_0x5d4101)){const _0x164be8=String(RegExp['$1']),_0x2589e8=_0x4bab12(0x1c7)[_0x4bab12(0x23f)](_0x164be8),_0x491e11=VisuMZ['SkillLearnSystem'][_0x4bab12(0x1b5)](_0x466787,_0x581d91);VisuMZ[_0x4bab12(0x246)]['JS'][_0x491e11]=new Function(_0x2589e8);}},VisuMZ['SkillLearnSystem'][_0x19b8c2(0x291)]=function(_0x4d7158,_0x5c4e33,_0x178662){const _0x379aa9=_0x19b8c2,_0xa3256=_0x4d7158[_0x379aa9(0x160)];if(_0xa3256[_0x379aa9(0x220)](_0x178662)){const _0x487ce5=String(RegExp['$1']),_0x1bec0b=_0x379aa9(0x2d0)[_0x379aa9(0x23f)](_0x487ce5),_0x106178=VisuMZ[_0x379aa9(0x246)][_0x379aa9(0x1b5)](_0x4d7158,_0x5c4e33);VisuMZ[_0x379aa9(0x246)]['JS'][_0x106178]=new Function(_0x1bec0b);}},VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x276)]=function(_0xd760f6,_0x5d42ec,_0xf2802f){const _0x379da5=_0x19b8c2,_0x4f29f2=_0xd760f6[_0x379da5(0x160)];if(_0x4f29f2[_0x379da5(0x220)](_0xf2802f)){const _0xe3f3e1=String(RegExp['$1']),_0x4fd365=_0x379da5(0x2c3)[_0x379da5(0x23f)](_0xe3f3e1),_0x280046=VisuMZ[_0x379da5(0x246)][_0x379da5(0x1b5)](_0xd760f6,_0x5d42ec);VisuMZ[_0x379da5(0x246)]['JS'][_0x280046]=new Function(_0x4fd365);}},VisuMZ[_0x19b8c2(0x246)]['createActionJS']=function(_0x3e13a2,_0x271aaf,_0x5e21ae){const _0x2427ed=_0x19b8c2,_0x24bc60=_0x3e13a2[_0x2427ed(0x160)];if(_0x24bc60[_0x2427ed(0x220)](_0x5e21ae)){const _0x417383=String(RegExp['$1']),_0x5c9224='\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20Declare\x20Variables\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20user\x20=\x20arguments[0];\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20const\x20skill\x20=\x20arguments[1];\x0a\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20//\x20Process\x20Code\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20try\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20%1\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x20catch\x20(e)\x20{\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20if\x20($gameTemp.isPlaytest())\x20console.log(e);\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20}\x0a\x20\x20\x20\x20\x20\x20\x20\x20'['format'](_0x417383),_0x30befb=VisuMZ[_0x2427ed(0x246)][_0x2427ed(0x1b5)](_0x3e13a2,_0x271aaf);VisuMZ['SkillLearnSystem']['JS'][_0x30befb]=new Function(_0x5c9224);}},VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x1b5)]=function(_0x29a373,_0x130c56){const _0x52eb62=_0x19b8c2;let _0x302a15='';if($dataActors[_0x52eb62(0x2e9)](_0x29a373))_0x302a15=_0x52eb62(0x314)[_0x52eb62(0x23f)](_0x29a373['id'],_0x130c56);if($dataClasses[_0x52eb62(0x2e9)](_0x29a373))_0x302a15=_0x52eb62(0x197)[_0x52eb62(0x23f)](_0x29a373['id'],_0x130c56);if($dataSkills[_0x52eb62(0x2e9)](_0x29a373))_0x302a15=_0x52eb62(0x2ce)[_0x52eb62(0x23f)](_0x29a373['id'],_0x130c56);if($dataItems[_0x52eb62(0x2e9)](_0x29a373))_0x302a15='Item-%1-%2'[_0x52eb62(0x23f)](_0x29a373['id'],_0x130c56);if($dataWeapons['includes'](_0x29a373))_0x302a15=_0x52eb62(0x214)[_0x52eb62(0x23f)](_0x29a373['id'],_0x130c56);if($dataArmors[_0x52eb62(0x2e9)](_0x29a373))_0x302a15=_0x52eb62(0x19d)['format'](_0x29a373['id'],_0x130c56);if($dataEnemies[_0x52eb62(0x2e9)](_0x29a373))_0x302a15='Enemy-%1-%2'[_0x52eb62(0x23f)](_0x29a373['id'],_0x130c56);if($dataStates[_0x52eb62(0x2e9)](_0x29a373))_0x302a15='State-%1-%2'[_0x52eb62(0x23f)](_0x29a373['id'],_0x130c56);return _0x302a15;},DataManager[_0x19b8c2(0x24d)]=function(_0x183bba){const _0x395f85=_0x19b8c2;_0x183bba=_0x183bba[_0x395f85(0x1b9)]()[_0x395f85(0x201)](),this[_0x395f85(0x195)]=this[_0x395f85(0x195)]||{};if(this['_classIDs'][_0x183bba])return this[_0x395f85(0x195)][_0x183bba];for(const _0x1c0609 of $dataClasses){if(!_0x1c0609)continue;let _0x5eec75=_0x1c0609[_0x395f85(0x316)];_0x5eec75=_0x5eec75[_0x395f85(0x262)](/\x1I\[(\d+)\]/gi,''),_0x5eec75=_0x5eec75[_0x395f85(0x262)](/\\I\[(\d+)\]/gi,''),this[_0x395f85(0x195)][_0x5eec75[_0x395f85(0x1b9)]()[_0x395f85(0x201)]()]=_0x1c0609['id'];}return this[_0x395f85(0x195)][_0x183bba]||0x0;},DataManager['getSkillIdWithName']=function(_0x4c6750){const _0x3d88c2=_0x19b8c2;_0x4c6750=_0x4c6750[_0x3d88c2(0x1b9)]()['trim'](),this[_0x3d88c2(0x25b)]=this[_0x3d88c2(0x25b)]||{};if(this[_0x3d88c2(0x25b)][_0x4c6750])return this[_0x3d88c2(0x25b)][_0x4c6750];for(const _0x5e2238 of $dataSkills){if(!_0x5e2238)continue;this[_0x3d88c2(0x25b)][_0x5e2238[_0x3d88c2(0x316)]['toUpperCase']()[_0x3d88c2(0x201)]()]=_0x5e2238['id'];}return this[_0x3d88c2(0x25b)][_0x4c6750]||0x0;},DataManager[_0x19b8c2(0x274)]=function(_0x36ca09){const _0x7fca34=_0x19b8c2;_0x36ca09=_0x36ca09['toUpperCase']()[_0x7fca34(0x201)](),this[_0x7fca34(0x182)]=this[_0x7fca34(0x182)]||{};if(this[_0x7fca34(0x182)][_0x36ca09])return this['_itemIDs'][_0x36ca09];for(const _0x5467b4 of $dataItems){if(!_0x5467b4)continue;this[_0x7fca34(0x182)][_0x5467b4[_0x7fca34(0x316)]['toUpperCase']()[_0x7fca34(0x201)]()]=_0x5467b4['id'];}return this[_0x7fca34(0x182)][_0x36ca09]||0x0;},DataManager[_0x19b8c2(0x2c2)]=function(_0x5dbaf3){const _0x2f5ad1=_0x19b8c2;_0x5dbaf3=_0x5dbaf3['toUpperCase']()[_0x2f5ad1(0x201)](),this[_0x2f5ad1(0x192)]=this[_0x2f5ad1(0x192)]||{};if(this[_0x2f5ad1(0x192)][_0x5dbaf3])return this[_0x2f5ad1(0x192)][_0x5dbaf3];for(const _0x2cb685 of $dataWeapons){if(!_0x2cb685)continue;this[_0x2f5ad1(0x192)][_0x2cb685[_0x2f5ad1(0x316)][_0x2f5ad1(0x1b9)]()[_0x2f5ad1(0x201)]()]=_0x2cb685['id'];}return this[_0x2f5ad1(0x192)][_0x5dbaf3]||0x0;},DataManager[_0x19b8c2(0x32a)]=function(_0x293534){const _0x1175b3=_0x19b8c2;_0x293534=_0x293534[_0x1175b3(0x1b9)]()[_0x1175b3(0x201)](),this[_0x1175b3(0x1fb)]=this[_0x1175b3(0x1fb)]||{};if(this[_0x1175b3(0x1fb)][_0x293534])return this[_0x1175b3(0x1fb)][_0x293534];for(const _0x386587 of $dataArmors){if(!_0x386587)continue;this[_0x1175b3(0x1fb)][_0x386587[_0x1175b3(0x316)]['toUpperCase']()[_0x1175b3(0x201)]()]=_0x386587['id'];}return this['_armorIDs'][_0x293534]||0x0;},DataManager[_0x19b8c2(0x1ab)]=function(_0x9a10d){const _0xc4ea3c=_0x19b8c2;if(!$dataClasses[_0x9a10d])return[];const _0x31813e=[],_0x349dd1=$dataClasses[_0x9a10d][_0xc4ea3c(0x160)],_0x4a9d50=VisuMZ[_0xc4ea3c(0x246)]['RegExp'],_0x31f39b=_0x349dd1[_0xc4ea3c(0x220)](_0x4a9d50[_0xc4ea3c(0x2da)]);if(_0x31f39b)for(const _0x361cc5 of _0x31f39b){if(!_0x361cc5)continue;_0x361cc5[_0xc4ea3c(0x220)](_0x4a9d50[_0xc4ea3c(0x2da)]);const _0x25d5d8=String(RegExp['$1'])[_0xc4ea3c(0x2aa)](',')[_0xc4ea3c(0x302)](_0x1b8e38=>_0x1b8e38[_0xc4ea3c(0x201)]());;for(let _0x1d0a42 of _0x25d5d8){_0x1d0a42=(String(_0x1d0a42)||'')[_0xc4ea3c(0x201)]();const _0x46bb75=/^\d+$/[_0xc4ea3c(0x259)](_0x1d0a42);_0x46bb75?_0x31813e['push'](Number(_0x1d0a42)):_0x31813e[_0xc4ea3c(0x327)](DataManager[_0xc4ea3c(0x27b)](_0x1d0a42));}}const _0x207da0=_0x349dd1[_0xc4ea3c(0x220)](_0x4a9d50[_0xc4ea3c(0x28f)]);if(_0x207da0)for(const _0xefec16 of _0x207da0){if(!_0xefec16)continue;_0xefec16[_0xc4ea3c(0x220)](_0x4a9d50[_0xc4ea3c(0x2da)]);const _0x18e50e=String(RegExp['$1'])[_0xc4ea3c(0x2aa)](/[\r\n]+/);for(let _0x5a967b of _0x18e50e){_0x5a967b=(String(_0x5a967b)||'')[_0xc4ea3c(0x201)]();const _0x3e350e=/^\d+$/[_0xc4ea3c(0x259)](_0x5a967b);_0x3e350e?_0x31813e['push'](Number(_0x5a967b)):_0x31813e[_0xc4ea3c(0x327)](DataManager[_0xc4ea3c(0x27b)](_0x5a967b));}}return _0x31813e[_0xc4ea3c(0x17f)]((_0x47e787,_0x29dc92)=>_0x47e787-_0x29dc92)[_0xc4ea3c(0x1da)]((_0x1c9fc8,_0x17aef5,_0x200d0b)=>_0x200d0b['indexOf'](_0x1c9fc8)===_0x17aef5);},DataManager[_0x19b8c2(0x1f5)]=function(_0x554a39){const _0x4412b1=_0x19b8c2;if(!_0x554a39)return 0x0;if(!DataManager[_0x4412b1(0x31a)](_0x554a39))return 0x0;const _0x1caa9a=VisuMZ[_0x4412b1(0x246)][_0x4412b1(0x257)],_0x2baf64=_0x554a39[_0x4412b1(0x160)];if(_0x2baf64[_0x4412b1(0x220)](_0x1caa9a['LearnApCost']))return Number(RegExp['$1']);if(_0x2baf64[_0x4412b1(0x220)](_0x1caa9a[_0x4412b1(0x1af)])){const _0x1efb35=String(RegExp['$1'])[_0x4412b1(0x2aa)](/[\r\n]+/);for(const _0xe3585c of _0x1efb35){if(_0xe3585c[_0x4412b1(0x220)](/(?:ABILITY POINTS|AP):[ ](\d+)/gi))return Number(RegExp['$1']);}}const _0x3b21ea=VisuMZ[_0x4412b1(0x246)][_0x4412b1(0x1b5)](_0x554a39,_0x4412b1(0x203));if(VisuMZ[_0x4412b1(0x246)]['JS'][_0x3b21ea]){const _0x289628=SceneManager[_0x4412b1(0x1fa)][_0x4412b1(0x304)]();return VisuMZ[_0x4412b1(0x246)]['JS'][_0x3b21ea]['call'](this,_0x289628,_0x554a39);}return VisuMZ[_0x4412b1(0x246)][_0x4412b1(0x2b9)]['AbilityPoints'][_0x4412b1(0x25f)];},DataManager[_0x19b8c2(0x331)]=function(_0x48a144){const _0x2636ad=_0x19b8c2;if(!_0x48a144)return 0x0;if(!DataManager[_0x2636ad(0x31a)](_0x48a144))return 0x0;const _0x3dea45=VisuMZ[_0x2636ad(0x246)][_0x2636ad(0x257)],_0x2bd8d1=_0x48a144['note'];if(_0x2bd8d1['match'](_0x3dea45[_0x2636ad(0x200)]))return Number(RegExp['$1']);if(_0x2bd8d1[_0x2636ad(0x220)](_0x3dea45[_0x2636ad(0x1af)])){const _0x248026=String(RegExp['$1'])[_0x2636ad(0x2aa)](/[\r\n]+/);for(const _0x46d0c6 of _0x248026){if(_0x46d0c6[_0x2636ad(0x220)](/(?:CLASS POINTS|CP):[ ](\d+)/gi))return Number(RegExp['$1']);}}const _0x3aa0a3=VisuMZ[_0x2636ad(0x246)][_0x2636ad(0x1b5)](_0x48a144,'jsLearnCpCost');if(VisuMZ[_0x2636ad(0x246)]['JS'][_0x3aa0a3]){const _0x19a7b9=SceneManager[_0x2636ad(0x1fa)][_0x2636ad(0x304)]();return VisuMZ[_0x2636ad(0x246)]['JS'][_0x3aa0a3][_0x2636ad(0x2b7)](this,_0x19a7b9,_0x48a144);}return VisuMZ['ClassChangeSystem'][_0x2636ad(0x2b9)][_0x2636ad(0x1d9)][_0x2636ad(0x25f)];},DataManager[_0x19b8c2(0x29c)]=function(_0x1c5247){const _0x588d11=_0x19b8c2;if(!_0x1c5247)return 0x0;if(!DataManager['isSkill'](_0x1c5247))return 0x0;const _0x19a560=VisuMZ['SkillLearnSystem'][_0x588d11(0x257)],_0x34187d=_0x1c5247[_0x588d11(0x160)];if(_0x34187d[_0x588d11(0x220)](_0x19a560[_0x588d11(0x2f8)]))return Number(RegExp['$1']);if(_0x34187d['match'](_0x19a560[_0x588d11(0x1af)])){const _0xf773d7=String(RegExp['$1'])[_0x588d11(0x2aa)](/[\r\n]+/);for(const _0x5d6deb of _0xf773d7){if(_0x5d6deb[_0x588d11(0x220)](/(?:JOB POINTS|JP):[ ](\d+)/gi))return Number(RegExp['$1']);}}const _0x3ec8b4=VisuMZ[_0x588d11(0x246)]['createKeyJS'](_0x1c5247,_0x588d11(0x188));if(VisuMZ[_0x588d11(0x246)]['JS'][_0x3ec8b4]){const _0x20d0f3=SceneManager['_scene']['user']();return VisuMZ[_0x588d11(0x246)]['JS'][_0x3ec8b4][_0x588d11(0x2b7)](this,_0x20d0f3,_0x1c5247);}return VisuMZ[_0x588d11(0x318)][_0x588d11(0x2b9)][_0x588d11(0x1e4)][_0x588d11(0x25f)];},DataManager[_0x19b8c2(0x1b3)]=function(_0x14c3f0){const _0x4ab974=_0x19b8c2;if(!_0x14c3f0)return 0x0;if(!DataManager['isSkill'](_0x14c3f0))return 0x0;const _0x2d353b=VisuMZ['SkillLearnSystem'][_0x4ab974(0x257)],_0x31c6fb=_0x14c3f0[_0x4ab974(0x160)];if(_0x31c6fb[_0x4ab974(0x220)](_0x2d353b['LearnSpCost']))return Number(RegExp['$1']);if(_0x31c6fb[_0x4ab974(0x220)](_0x2d353b['LearnCostBatch'])){const _0x124307=String(RegExp['$1'])[_0x4ab974(0x2aa)](/[\r\n]+/);for(const _0x17bed2 of _0x124307){if(_0x17bed2['match'](/(?:SKILL POINTS|SP):[ ](\d+)/gi))return Number(RegExp['$1']);}}const _0x8811f2=VisuMZ[_0x4ab974(0x246)][_0x4ab974(0x1b5)](_0x14c3f0,'jsLearnSpCost');if(VisuMZ[_0x4ab974(0x246)]['JS'][_0x8811f2]){const _0x33481c=SceneManager[_0x4ab974(0x1fa)]['user']();return VisuMZ[_0x4ab974(0x246)]['JS'][_0x8811f2][_0x4ab974(0x2b7)](this,_0x33481c,_0x14c3f0);}return VisuMZ['SkillLearnSystem'][_0x4ab974(0x2b9)]['SkillPoints'][_0x4ab974(0x25f)];},DataManager[_0x19b8c2(0x194)]=function(_0x3256b3){const _0x42a241=_0x19b8c2;if(!_0x3256b3)return 0x0;if(!DataManager[_0x42a241(0x31a)](_0x3256b3))return 0x0;const _0x1bd5ba=VisuMZ[_0x42a241(0x246)]['RegExp'],_0x498708=_0x3256b3[_0x42a241(0x160)],_0x14efb8=[],_0xf70ae4=_0x498708['match'](_0x1bd5ba[_0x42a241(0x20c)]);if(_0xf70ae4)for(const _0x532319 of _0xf70ae4){if(!_0x532319)continue;_0x532319['match'](_0x1bd5ba[_0x42a241(0x20c)]);const _0x4a934c=String(RegExp['$1']),_0x5adc1e={'id':0x0,'quantity':Number(RegExp['$2'])},_0x3b0a39=/^\d+$/[_0x42a241(0x259)](_0x4a934c);_0x3b0a39?_0x5adc1e['id']=Number(_0x4a934c):_0x5adc1e['id']=DataManager['getItemIdWithName'](_0x4a934c),_0x5adc1e['id']>0x0&&_0x14efb8[_0x42a241(0x327)](_0x5adc1e);}if(_0x498708[_0x42a241(0x220)](_0x1bd5ba[_0x42a241(0x1af)])){const _0xfc12ba=String(RegExp['$1'])[_0x42a241(0x2aa)](/[\r\n]+/);for(const _0x2d4287 of _0xfc12ba){if(_0x2d4287[_0x42a241(0x220)](/ITEM[ ](.*):[ ](\d+)/gi)){const _0x46f344=String(RegExp['$1']),_0x425f32={'id':0x0,'quantity':Number(RegExp['$2'])},_0x32fcca=/^\d+$/[_0x42a241(0x259)](_0x46f344);_0x32fcca?_0x425f32['id']=Number(_0x46f344):_0x425f32['id']=DataManager[_0x42a241(0x274)](_0x46f344),_0x425f32['id']>0x0&&_0x14efb8[_0x42a241(0x327)](_0x425f32);}}}return _0x14efb8;},DataManager[_0x19b8c2(0x280)]=function(_0x41563b){const _0x1a8155=_0x19b8c2;if(!_0x41563b)return 0x0;if(!DataManager['isSkill'](_0x41563b))return 0x0;const _0x3d1e79=VisuMZ[_0x1a8155(0x246)][_0x1a8155(0x257)],_0x30c4d7=_0x41563b[_0x1a8155(0x160)],_0x558a30=[],_0x5c5d6e=_0x30c4d7['match'](_0x3d1e79[_0x1a8155(0x33e)]);if(_0x5c5d6e)for(const _0x53cefe of _0x5c5d6e){if(!_0x53cefe)continue;_0x53cefe[_0x1a8155(0x220)](_0x3d1e79[_0x1a8155(0x33e)]);const _0x49e505=String(RegExp['$1']),_0x3fe4d8={'id':0x0,'quantity':Number(RegExp['$2'])},_0x3410d5=/^\d+$/['test'](_0x49e505);_0x3410d5?_0x3fe4d8['id']=Number(_0x49e505):_0x3fe4d8['id']=DataManager['getWeaponIdWithName'](_0x49e505),_0x3fe4d8['id']>0x0&&_0x558a30[_0x1a8155(0x327)](_0x3fe4d8);}if(_0x30c4d7[_0x1a8155(0x220)](_0x3d1e79[_0x1a8155(0x1af)])){const _0x3771be=String(RegExp['$1'])[_0x1a8155(0x2aa)](/[\r\n]+/);for(const _0x564964 of _0x3771be){if(_0x564964[_0x1a8155(0x220)](/WEAPON[ ](.*):[ ](\d+)/gi)){const _0x2ae3c6=String(RegExp['$1']),_0x4d1384={'id':0x0,'quantity':Number(RegExp['$2'])},_0x5bee19=/^\d+$/[_0x1a8155(0x259)](_0x2ae3c6);_0x5bee19?_0x4d1384['id']=Number(_0x2ae3c6):_0x4d1384['id']=DataManager[_0x1a8155(0x2c2)](_0x2ae3c6),_0x4d1384['id']>0x0&&_0x558a30[_0x1a8155(0x327)](_0x4d1384);}}}return _0x558a30;},DataManager[_0x19b8c2(0x178)]=function(_0x739b91){const _0x4c73e1=_0x19b8c2;if(!_0x739b91)return 0x0;if(!DataManager[_0x4c73e1(0x31a)](_0x739b91))return 0x0;const _0x1c395d=VisuMZ[_0x4c73e1(0x246)][_0x4c73e1(0x257)],_0x55cf99=_0x739b91[_0x4c73e1(0x160)],_0x18911a=[],_0x58c53b=_0x55cf99[_0x4c73e1(0x220)](_0x1c395d[_0x4c73e1(0x29d)]);if(_0x58c53b)for(const _0x3cb112 of _0x58c53b){if(!_0x3cb112)continue;_0x3cb112[_0x4c73e1(0x220)](_0x1c395d[_0x4c73e1(0x29d)]);const _0x273a4f=String(RegExp['$1']),_0x38af6e={'id':0x0,'quantity':Number(RegExp['$2'])},_0x312ed1=/^\d+$/['test'](_0x273a4f);_0x312ed1?_0x38af6e['id']=Number(_0x273a4f):_0x38af6e['id']=DataManager['getArmorIdWithName'](_0x273a4f),_0x38af6e['id']>0x0&&_0x18911a[_0x4c73e1(0x327)](_0x38af6e);}if(_0x55cf99[_0x4c73e1(0x220)](_0x1c395d['LearnCostBatch'])){const _0xfc8d13=String(RegExp['$1'])[_0x4c73e1(0x2aa)](/[\r\n]+/);for(const _0x1e811d of _0xfc8d13){if(_0x1e811d[_0x4c73e1(0x220)](/ARMOR[ ](.*):[ ](\d+)/gi)){const _0x18c9a8=String(RegExp['$1']),_0x198a32={'id':0x0,'quantity':Number(RegExp['$2'])},_0x35e7aa=/^\d+$/[_0x4c73e1(0x259)](_0x18c9a8);_0x35e7aa?_0x198a32['id']=Number(_0x18c9a8):_0x198a32['id']=DataManager[_0x4c73e1(0x32a)](_0x18c9a8),_0x198a32['id']>0x0&&_0x18911a[_0x4c73e1(0x327)](_0x198a32);}}}return _0x18911a;},DataManager[_0x19b8c2(0x2bf)]=function(_0x5e2ddc){const _0x12a8ad=_0x19b8c2;if(!_0x5e2ddc)return 0x0;if(!DataManager[_0x12a8ad(0x31a)](_0x5e2ddc))return 0x0;const _0x3a0576=VisuMZ['SkillLearnSystem'][_0x12a8ad(0x257)],_0x5a8eb1=_0x5e2ddc['note'];if(_0x5a8eb1[_0x12a8ad(0x220)](_0x3a0576['LearnGoldCost']))return Number(RegExp['$1']);if(_0x5a8eb1[_0x12a8ad(0x220)](_0x3a0576['LearnCostBatch'])){const _0x5052dc=String(RegExp['$1'])['split'](/[\r\n]+/);for(const _0x3c6b46 of _0x5052dc){if(_0x3c6b46['match'](/GOLD:[ ](\d+)/gi))return Number(RegExp['$1']);}}return 0x0;},TextManager['skillLearnIcon']=VisuMZ['SkillLearnSystem'][_0x19b8c2(0x2b9)]['MenuAccess']['Icon'],ImageManager['abilityPointsIcon']=VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x2b9)][_0x19b8c2(0x1ad)][_0x19b8c2(0x2c6)],ImageManager[_0x19b8c2(0x288)]=VisuMZ['SkillLearnSystem'][_0x19b8c2(0x2b9)][_0x19b8c2(0x23a)][_0x19b8c2(0x2c6)],SoundManager['playSkillLearn']=function(){const _0x4f5012=_0x19b8c2;AudioManager[_0x4f5012(0x15f)](VisuMZ[_0x4f5012(0x246)]['Settings'][_0x4f5012(0x2fe)]);},TextManager[_0x19b8c2(0x2ef)]=VisuMZ['SkillLearnSystem'][_0x19b8c2(0x2b9)][_0x19b8c2(0x28d)][_0x19b8c2(0x1f1)],TextManager[_0x19b8c2(0x30d)]=VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x2b9)][_0x19b8c2(0x28d)][_0x19b8c2(0x31e)],TextManager[_0x19b8c2(0x2f5)]=VisuMZ['SkillLearnSystem'][_0x19b8c2(0x2b9)][_0x19b8c2(0x28d)][_0x19b8c2(0x173)],TextManager[_0x19b8c2(0x1d1)]=VisuMZ[_0x19b8c2(0x246)]['Settings'][_0x19b8c2(0x28d)][_0x19b8c2(0x23c)],TextManager[_0x19b8c2(0x332)]=VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x2b9)][_0x19b8c2(0x28d)][_0x19b8c2(0x21c)],TextManager[_0x19b8c2(0x299)]=VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x2b9)][_0x19b8c2(0x28d)][_0x19b8c2(0x161)],TextManager[_0x19b8c2(0x2be)]=VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x2b9)][_0x19b8c2(0x28d)]['SeparationFmt'],TextManager['skillLearnItemFmt']=VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x2b9)][_0x19b8c2(0x28d)]['ItemFmt'],TextManager[_0x19b8c2(0x2ba)]=VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x2b9)][_0x19b8c2(0x28d)][_0x19b8c2(0x1b0)],TextManager[_0x19b8c2(0x282)]=VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x2b9)][_0x19b8c2(0x28d)][_0x19b8c2(0x2f4)],TextManager[_0x19b8c2(0x30b)]=VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x2b9)]['General'][_0x19b8c2(0x1d3)],TextManager[_0x19b8c2(0x344)]=VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x2b9)]['MenuAccess']['Name'],TextManager['skillLearnReqTitle']=VisuMZ[_0x19b8c2(0x246)]['Settings'][_0x19b8c2(0x1b2)][_0x19b8c2(0x323)],TextManager[_0x19b8c2(0x1e0)]=VisuMZ[_0x19b8c2(0x246)]['Settings'][_0x19b8c2(0x1b2)][_0x19b8c2(0x17d)],TextManager[_0x19b8c2(0x29e)]=VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x2b9)][_0x19b8c2(0x1b2)]['ReqNotMetFmt'],TextManager['skillLearnReqListLevel']=VisuMZ[_0x19b8c2(0x246)]['Settings'][_0x19b8c2(0x1b2)][_0x19b8c2(0x23c)],TextManager['skillLearnReqListSkill']=VisuMZ[_0x19b8c2(0x246)]['Settings'][_0x19b8c2(0x1b2)][_0x19b8c2(0x21c)],TextManager[_0x19b8c2(0x1ba)]=VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x2b9)][_0x19b8c2(0x1b2)][_0x19b8c2(0x161)],TextManager[_0x19b8c2(0x2ab)]=VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x2b9)][_0x19b8c2(0x1b2)][_0x19b8c2(0x1c5)],TextManager[_0x19b8c2(0x168)]=VisuMZ[_0x19b8c2(0x246)]['Settings'][_0x19b8c2(0x1b2)][_0x19b8c2(0x34e)],TextManager[_0x19b8c2(0x1c4)]=VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x2b9)][_0x19b8c2(0x1b2)][_0x19b8c2(0x21a)],TextManager[_0x19b8c2(0x284)]=VisuMZ[_0x19b8c2(0x246)]['Settings'][_0x19b8c2(0x1b2)]['IngredientOwned'],TextManager[_0x19b8c2(0x324)]=VisuMZ['SkillLearnSystem'][_0x19b8c2(0x2b9)]['Window']['ConfirmCmd'],TextManager['skillLearnCancelCmd']=VisuMZ[_0x19b8c2(0x246)]['Settings'][_0x19b8c2(0x1b2)]['CancelCmd'],TextManager['abilityPointsFull']=VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x2b9)][_0x19b8c2(0x1ad)]['FullText'],TextManager[_0x19b8c2(0x33a)]=VisuMZ[_0x19b8c2(0x246)]['Settings'][_0x19b8c2(0x1ad)][_0x19b8c2(0x1d2)],TextManager['abilityPointsFmt']=VisuMZ['SkillLearnSystem'][_0x19b8c2(0x2b9)]['AbilityPoints'][_0x19b8c2(0x1f7)],TextManager['skillPointsFull']=VisuMZ[_0x19b8c2(0x246)]['Settings'][_0x19b8c2(0x23a)]['FullText'],TextManager['skillPointsAbbr']=VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x2b9)]['SkillPoints'][_0x19b8c2(0x1d2)],TextManager[_0x19b8c2(0x2db)]=VisuMZ['SkillLearnSystem']['Settings'][_0x19b8c2(0x23a)][_0x19b8c2(0x1f7)],VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x343)]=BattleManager[_0x19b8c2(0x2e1)],BattleManager[_0x19b8c2(0x2e1)]=function(){const _0x2a7a62=_0x19b8c2;VisuMZ['SkillLearnSystem']['BattleManager_makeRewards'][_0x2a7a62(0x2b7)](this),this[_0x2a7a62(0x1eb)](),this[_0x2a7a62(0x171)](),this['makeRewardsSkillPoints'](),this['gainRewardsSkillPoints']();},VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x339)]=BattleManager[_0x19b8c2(0x2a3)],BattleManager[_0x19b8c2(0x2a3)]=function(){const _0x405837=_0x19b8c2;VisuMZ[_0x405837(0x246)][_0x405837(0x339)][_0x405837(0x2b7)](this),this[_0x405837(0x251)](),this[_0x405837(0x2b4)]();},BattleManager[_0x19b8c2(0x1eb)]=function(){const _0x59291c=_0x19b8c2;this[_0x59291c(0x20d)]['abilityPoints']=$gameTroop[_0x59291c(0x1a1)]();},BattleManager['displayRewardsAbilityPoints']=function(){const _0x1e18d5=_0x19b8c2;if(!this[_0x1e18d5(0x1a0)]())return;$gameMessage['newPage']();const _0x5c8381=$gameParty[_0x1e18d5(0x1ff)](),_0x5f0462=VisuMZ['SkillLearnSystem']['Settings'][_0x1e18d5(0x1ad)],_0xf7df32=_0x5f0462[_0x1e18d5(0x265)];for(const _0x47e67c of _0x5c8381){if(!_0x47e67c)continue;const _0x4cfe86=_0xf7df32['format'](_0x47e67c[_0x1e18d5(0x316)](),_0x47e67c[_0x1e18d5(0x346)](),TextManager['abilityPointsAbbr'],TextManager[_0x1e18d5(0x309)]);$gameMessage[_0x1e18d5(0x19a)]('\x5c.'+_0x4cfe86);}},BattleManager[_0x19b8c2(0x171)]=function(){const _0x9863ae=_0x19b8c2;this[_0x9863ae(0x20d)][_0x9863ae(0x204)]=this[_0x9863ae(0x20d)][_0x9863ae(0x204)]||0x0;let _0x1ebed3=$gameParty[_0x9863ae(0x281)]();VisuMZ[_0x9863ae(0x246)]['Settings'][_0x9863ae(0x1ad)][_0x9863ae(0x255)]&&(_0x1ebed3=_0x1ebed3[_0x9863ae(0x1da)](_0x24d791=>_0x24d791[_0x9863ae(0x300)]()));for(const _0x24b51a of _0x1ebed3){if(!_0x24b51a)continue;if(!$dataSystem[_0x9863ae(0x2c9)]&&!_0x24b51a['isBattleMember']())continue;_0x24b51a[_0x9863ae(0x2a9)](this[_0x9863ae(0x20d)][_0x9863ae(0x204)]),_0x24b51a['gainAbilityPointsForMulticlasses'](this[_0x9863ae(0x20d)][_0x9863ae(0x204)]);}},BattleManager['abilityPointsVisible']=function(){const _0xc68af8=_0x19b8c2;return VisuMZ[_0xc68af8(0x246)][_0xc68af8(0x2b9)]['AbilityPoints'][_0xc68af8(0x1c1)];},BattleManager['makeRewardsSkillPoints']=function(){const _0x418757=_0x19b8c2;this[_0x418757(0x20d)][_0x418757(0x1a4)]=$gameTroop[_0x418757(0x1f3)]();},BattleManager[_0x19b8c2(0x2b4)]=function(){const _0xd5b147=_0x19b8c2;if(!this[_0xd5b147(0x1c0)]())return;$gameMessage['newPage']();const _0x3997fb=$gameParty[_0xd5b147(0x1ff)](),_0x49195d=VisuMZ[_0xd5b147(0x246)][_0xd5b147(0x2b9)][_0xd5b147(0x23a)],_0x1da5a6=_0x49195d[_0xd5b147(0x265)];for(const _0x170ef5 of _0x3997fb){if(!_0x170ef5)continue;const _0x5380a4=_0x1da5a6[_0xd5b147(0x23f)](_0x170ef5['name'](),_0x170ef5[_0xd5b147(0x298)](),TextManager[_0xd5b147(0x26b)],TextManager[_0xd5b147(0x2db)]);$gameMessage[_0xd5b147(0x19a)]('\x5c.'+_0x5380a4);}},BattleManager['gainRewardsSkillPoints']=function(){const _0x198f00=_0x19b8c2;this[_0x198f00(0x20d)][_0x198f00(0x1a4)]=this[_0x198f00(0x20d)]['skillPoints']||0x0;let _0x1d088a=$gameParty[_0x198f00(0x281)]();VisuMZ[_0x198f00(0x246)][_0x198f00(0x2b9)][_0x198f00(0x23a)][_0x198f00(0x255)]&&(_0x1d088a=_0x1d088a[_0x198f00(0x1da)](_0x2ad1b0=>_0x2ad1b0[_0x198f00(0x300)]()));for(const _0x56bcb3 of _0x1d088a){if(!_0x56bcb3)continue;if(!$dataSystem['optExtraExp']&&!_0x56bcb3[_0x198f00(0x353)]())continue;_0x56bcb3[_0x198f00(0x254)](this[_0x198f00(0x20d)][_0x198f00(0x1a4)]),_0x56bcb3[_0x198f00(0x1a5)](this[_0x198f00(0x20d)][_0x198f00(0x1a4)]);}},BattleManager[_0x19b8c2(0x1c0)]=function(){const _0x27b9b9=_0x19b8c2;return VisuMZ[_0x27b9b9(0x246)][_0x27b9b9(0x2b9)]['SkillPoints']['ShowVictory'];},VisuMZ['SkillLearnSystem'][_0x19b8c2(0x269)]=Game_System['prototype'][_0x19b8c2(0x2fd)],Game_System[_0x19b8c2(0x32d)][_0x19b8c2(0x2fd)]=function(){const _0x56711c=_0x19b8c2;VisuMZ[_0x56711c(0x246)][_0x56711c(0x269)][_0x56711c(0x2b7)](this),this[_0x56711c(0x2e5)]();},Game_System[_0x19b8c2(0x32d)][_0x19b8c2(0x2e5)]=function(){const _0x195968=_0x19b8c2;this[_0x195968(0x307)]=VisuMZ[_0x195968(0x246)][_0x195968(0x2b9)][_0x195968(0x1bf)][_0x195968(0x28e)];},Game_System['prototype']['isSkillLearnSystemMenuAccess']=function(){const _0x242797=_0x19b8c2;return this[_0x242797(0x307)]===undefined&&this['initSkillLearnSystemMenuAccess'](),this[_0x242797(0x307)];},Game_System['prototype'][_0x19b8c2(0x263)]=function(_0x7972d){const _0x3b7e25=_0x19b8c2;this[_0x3b7e25(0x307)]===undefined&&this[_0x3b7e25(0x2e5)](),this['_SkillLearnSystem_MenuAccess']=_0x7972d;},VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x301)]=Game_Action[_0x19b8c2(0x32d)][_0x19b8c2(0x329)],Game_Action['prototype'][_0x19b8c2(0x329)]=function(_0x5d4600){const _0x3fdad7=_0x19b8c2;VisuMZ[_0x3fdad7(0x246)][_0x3fdad7(0x301)]['call'](this,_0x5d4600),this[_0x3fdad7(0x2cb)](_0x5d4600);},Game_Action[_0x19b8c2(0x32d)][_0x19b8c2(0x2cb)]=function(_0x23f808){if(this['item']())this['applyItemSkillLearnSystemUserEffect'](_0x23f808);},Game_Action[_0x19b8c2(0x32d)][_0x19b8c2(0x264)]=function(_0x407c50){const _0x559195=_0x19b8c2,_0x39d71e=VisuMZ[_0x559195(0x246)][_0x559195(0x257)],_0x8a9a10=this['item']()[_0x559195(0x160)];if($gameParty[_0x559195(0x2e6)]()){if(this[_0x559195(0x277)]()[_0x559195(0x345)]()&&_0x8a9a10[_0x559195(0x220)](_0x39d71e[_0x559195(0x295)])){const _0x5cca33=eval(RegExp['$1']);this[_0x559195(0x277)]()[_0x559195(0x2a9)](_0x5cca33);}else this[_0x559195(0x303)]();if(_0x407c50[_0x559195(0x345)]()&&_0x8a9a10[_0x559195(0x220)](_0x39d71e[_0x559195(0x312)])){const _0xf13daf=eval(RegExp['$1']);_0x407c50[_0x559195(0x2a9)](_0xf13daf);}}if($gameParty[_0x559195(0x2e6)]()){if(this[_0x559195(0x277)]()[_0x559195(0x345)]()&&_0x8a9a10[_0x559195(0x220)](_0x39d71e[_0x559195(0x2de)])){const _0x414e17=eval(RegExp['$1']);this[_0x559195(0x277)]()[_0x559195(0x254)](_0x414e17);}else this['applySkillPoints']();if(_0x407c50['isActor']()&&_0x8a9a10[_0x559195(0x220)](_0x39d71e[_0x559195(0x215)])){const _0x28336f=eval(RegExp['$1']);_0x407c50['gainSkillPoints'](_0x28336f);}}if(_0x8a9a10[_0x559195(0x220)](/<NOTETAG>/i)){}},Game_Action[_0x19b8c2(0x32d)][_0x19b8c2(0x303)]=function(){const _0x181bb6=_0x19b8c2;if(!$gameParty[_0x181bb6(0x2e6)]())return;if(!this['subject']()[_0x181bb6(0x345)]())return;const _0x2b1063=VisuMZ[_0x181bb6(0x246)][_0x181bb6(0x2b9)]['AbilityPoints'];let _0x5d6fde=0x0;try{_0x5d6fde=eval(_0x2b1063['PerAction']);}catch(_0x2cac4c){if($gameTemp[_0x181bb6(0x321)]())console['log'](_0x2cac4c);}this['subject']()[_0x181bb6(0x2a9)](_0x5d6fde);},Game_Action[_0x19b8c2(0x32d)]['applySkillPoints']=function(){const _0x46ccf1=_0x19b8c2;if(!$gameParty[_0x46ccf1(0x2e6)]())return;if(!this['subject']()[_0x46ccf1(0x345)]())return;const _0x1bf50b=VisuMZ[_0x46ccf1(0x246)][_0x46ccf1(0x2b9)][_0x46ccf1(0x23a)];let _0x2239f2=0x0;try{_0x2239f2=eval(_0x1bf50b[_0x46ccf1(0x2d3)]);}catch(_0x4aa81f){if($gameTemp[_0x46ccf1(0x321)]())console['log'](_0x4aa81f);}this['subject']()[_0x46ccf1(0x254)](_0x2239f2);},VisuMZ[_0x19b8c2(0x246)]['Game_Battler_onBattleStart']=Game_Battler['prototype'][_0x19b8c2(0x20a)],Game_Battler[_0x19b8c2(0x32d)][_0x19b8c2(0x20a)]=function(_0x25e959){const _0x328ac8=_0x19b8c2;VisuMZ['SkillLearnSystem'][_0x328ac8(0x336)][_0x328ac8(0x2b7)](this,_0x25e959),this[_0x328ac8(0x345)]()&&(this[_0x328ac8(0x240)]=this[_0x328ac8(0x242)](),this[_0x328ac8(0x217)]=this[_0x328ac8(0x322)]());},VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x1b6)]=Game_Actor[_0x19b8c2(0x32d)][_0x19b8c2(0x1b8)],Game_Actor[_0x19b8c2(0x32d)][_0x19b8c2(0x1b8)]=function(_0x229a3c){const _0xa19878=_0x19b8c2;VisuMZ[_0xa19878(0x246)][_0xa19878(0x1b6)][_0xa19878(0x2b7)](this,_0x229a3c),this['initAbilityPoints'](),this[_0xa19878(0x340)](),this[_0xa19878(0x32f)](),this['gainStartingSkillPoints']();},VisuMZ[_0x19b8c2(0x246)]['Game_Actor_changeClass']=Game_Actor['prototype'][_0x19b8c2(0x1d5)],Game_Actor['prototype'][_0x19b8c2(0x1d5)]=function(_0x328e3e,_0x3a66df){const _0x2814d9=_0x19b8c2;this[_0x2814d9(0x28b)]=!![],VisuMZ['SkillLearnSystem'][_0x2814d9(0x27e)][_0x2814d9(0x2b7)](this,_0x328e3e,_0x3a66df),this[_0x2814d9(0x28b)]=undefined;},VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x16a)]=Game_Actor['prototype']['levelUp'],Game_Actor[_0x19b8c2(0x32d)][_0x19b8c2(0x22a)]=function(){const _0x4c3b57=_0x19b8c2;VisuMZ[_0x4c3b57(0x246)]['Game_Actor_levelUp'][_0x4c3b57(0x2b7)](this),this[_0x4c3b57(0x237)](this[_0x4c3b57(0x349)]()['id']),this['levelUpGainSkillPoints'](this[_0x4c3b57(0x349)]()['id']);},Game_Actor[_0x19b8c2(0x32d)][_0x19b8c2(0x293)]=function(){const _0x5e0e10=_0x19b8c2;this[_0x5e0e10(0x28c)]={};},Game_Actor[_0x19b8c2(0x32d)]['gainStartingAbilityPoints']=function(){const _0x2fb229=_0x19b8c2,_0x4738bb=VisuMZ[_0x2fb229(0x246)][_0x2fb229(0x257)],_0x4ae5b6=this[_0x2fb229(0x2a5)]()['note'];if(_0x4ae5b6['match'](_0x4738bb[_0x2fb229(0x273)])){const _0x41b460=eval(RegExp['$1']);this[_0x2fb229(0x2a9)](_0x41b460);}const _0xd2de89=VisuMZ[_0x2fb229(0x246)][_0x2fb229(0x2b9)][_0x2fb229(0x1ad)];if(!_0xd2de89[_0x2fb229(0x205)])return;const _0x54c8fe=_0x4ae5b6[_0x2fb229(0x220)](_0x4738bb['StartClassAbilityPoints']);if(_0x54c8fe)for(const _0x1f022d of _0x54c8fe){if(!_0x1f022d)continue;_0x1f022d[_0x2fb229(0x220)](_0x4738bb[_0x2fb229(0x2d4)]);const _0x3aff08=String(RegExp['$1']),_0x2f2a0e=eval(RegExp['$2']),_0x3749b6=/^\d+$/[_0x2fb229(0x259)](_0x3aff08);let _0x4c30cc=0x0;_0x3749b6?_0x4c30cc=Number(_0x3aff08):_0x4c30cc=DataManager[_0x2fb229(0x24d)](_0x3aff08),this[_0x2fb229(0x2a9)](_0x2f2a0e,_0x4c30cc);}},Game_Actor[_0x19b8c2(0x32d)][_0x19b8c2(0x242)]=function(_0x34ff8e){const _0x44723b=_0x19b8c2;this[_0x44723b(0x28c)]===undefined&&this[_0x44723b(0x293)]();const _0x450068=VisuMZ['SkillLearnSystem'][_0x44723b(0x2b9)][_0x44723b(0x1ad)];return _0x450068[_0x44723b(0x205)]?_0x34ff8e=0x0:_0x34ff8e=_0x34ff8e||this[_0x44723b(0x349)]()['id'],this[_0x44723b(0x28c)][_0x34ff8e]=this[_0x44723b(0x28c)][_0x34ff8e]||0x0,Math[_0x44723b(0x325)](this[_0x44723b(0x28c)][_0x34ff8e]);},Game_Actor[_0x19b8c2(0x32d)][_0x19b8c2(0x1e5)]=function(_0x18f4d2,_0x1deada){const _0x363478=_0x19b8c2;this['_abilityPoints']===undefined&&this[_0x363478(0x293)]();const _0x4dade3=VisuMZ[_0x363478(0x246)][_0x363478(0x2b9)][_0x363478(0x1ad)];_0x4dade3[_0x363478(0x205)]?_0x1deada=0x0:_0x1deada=_0x1deada||this[_0x363478(0x349)]()['id'];this[_0x363478(0x28c)][_0x1deada]=this[_0x363478(0x28c)][_0x1deada]||0x0,this[_0x363478(0x28c)][_0x1deada]=Math['round'](_0x18f4d2||0x0);const _0x1a1a2d=_0x4dade3[_0x363478(0x2b8)]||Number[_0x363478(0x25a)];this[_0x363478(0x28c)][_0x1deada]=this[_0x363478(0x28c)][_0x1deada][_0x363478(0x342)](0x0,_0x1a1a2d);},Game_Actor['prototype'][_0x19b8c2(0x2a9)]=function(_0x40371c,_0x4a386b){const _0x18e658=_0x19b8c2;_0x40371c>0x0&&(_0x40371c*=this[_0x18e658(0x231)]()),this[_0x18e658(0x2dc)](_0x40371c,_0x4a386b);},Game_Actor[_0x19b8c2(0x32d)][_0x19b8c2(0x29b)]=function(_0x3a7f93){const _0x36ccd3=_0x19b8c2;if(!Imported[_0x36ccd3(0x1e9)])return;_0x3a7f93>0x0&&(_0x3a7f93*=this[_0x36ccd3(0x231)]()),this['gainMulticlassRewardPoints'](_0x3a7f93,_0x36ccd3(0x34b));},Game_Actor['prototype'][_0x19b8c2(0x2dc)]=function(_0x47ed3a,_0x11e956){const _0x45e4aa=_0x19b8c2,_0x15ae5e=VisuMZ[_0x45e4aa(0x246)][_0x45e4aa(0x2b9)][_0x45e4aa(0x1ad)];_0x15ae5e[_0x45e4aa(0x205)]?_0x11e956=0x0:_0x11e956=_0x11e956||this[_0x45e4aa(0x349)]()['id'],_0x47ed3a+=this[_0x45e4aa(0x242)](_0x11e956),this['setAbilityPoints'](_0x47ed3a,_0x11e956);},Game_Actor['prototype'][_0x19b8c2(0x333)]=function(_0x4acee7,_0x3896be){const _0x1cd708=_0x19b8c2;this[_0x1cd708(0x2dc)](-_0x4acee7,_0x3896be);},Game_Actor[_0x19b8c2(0x32d)][_0x19b8c2(0x231)]=function(){const _0x43eba4=_0x19b8c2;return this[_0x43eba4(0x223)]()[_0x43eba4(0x2e0)]((_0x21d45c,_0x419da7)=>{const _0x4c55c5=_0x43eba4;return _0x419da7&&_0x419da7['note']['match'](VisuMZ[_0x4c55c5(0x246)]['RegExp'][_0x4c55c5(0x176)])?_0x21d45c*(Number(RegExp['$1'])*0.01):_0x21d45c;},0x1);},Game_Actor[_0x19b8c2(0x32d)][_0x19b8c2(0x237)]=function(_0x10e703){const _0x41a932=_0x19b8c2;if(this[_0x41a932(0x28b)])return;const _0x13976f=VisuMZ[_0x41a932(0x246)][_0x41a932(0x2b9)]['AbilityPoints'];let _0x48e68c=0x0;try{_0x48e68c=eval(_0x13976f[_0x41a932(0x2fa)]);}catch(_0x20fe8e){if($gameTemp[_0x41a932(0x321)]())console[_0x41a932(0x1fe)](_0x20fe8e);}this[_0x41a932(0x2a9)](_0x48e68c,_0x10e703);},Game_Actor[_0x19b8c2(0x32d)][_0x19b8c2(0x346)]=function(){const _0x8d9c70=_0x19b8c2;return this['_earnedAbilityPoints']=this[_0x8d9c70(0x240)]||0x0,this[_0x8d9c70(0x242)]()-this[_0x8d9c70(0x240)];},Game_Actor['prototype'][_0x19b8c2(0x32f)]=function(){const _0xf621be=_0x19b8c2;this[_0xf621be(0x166)]={};},Game_Actor['prototype'][_0x19b8c2(0x2d7)]=function(){const _0x1e8e96=_0x19b8c2,_0x191fb3=VisuMZ['SkillLearnSystem']['RegExp'],_0x778605=this['actor']()['note'];if(_0x778605[_0x1e8e96(0x220)](_0x191fb3['StartingSkillPoints'])){const _0x46284f=eval(RegExp['$1']);this['gainSkillPoints'](_0x46284f);}const _0x2002c3=VisuMZ['SkillLearnSystem'][_0x1e8e96(0x2b9)][_0x1e8e96(0x23a)];if(!_0x2002c3[_0x1e8e96(0x205)])return;const _0x3c92c2=_0x778605[_0x1e8e96(0x220)](_0x191fb3[_0x1e8e96(0x169)]);if(_0x3c92c2)for(const _0xd8e8cf of _0x3c92c2){if(!_0xd8e8cf)continue;_0xd8e8cf['match'](_0x191fb3[_0x1e8e96(0x169)]);const _0x6f166d=String(RegExp['$1']),_0x2f4c34=eval(RegExp['$2']),_0x4da7d0=/^\d+$/[_0x1e8e96(0x259)](_0x6f166d);let _0x5e52e9=0x0;_0x4da7d0?_0x5e52e9=Number(_0x6f166d):_0x5e52e9=DataManager[_0x1e8e96(0x24d)](_0x6f166d),this[_0x1e8e96(0x254)](_0x2f4c34,_0x5e52e9);}},Game_Actor['prototype'][_0x19b8c2(0x322)]=function(_0x3fa338){const _0x24115d=_0x19b8c2;this[_0x24115d(0x166)]===undefined&&this[_0x24115d(0x32f)]();const _0x1fd81b=VisuMZ[_0x24115d(0x246)][_0x24115d(0x2b9)][_0x24115d(0x23a)];return _0x1fd81b[_0x24115d(0x205)]?_0x3fa338=0x0:_0x3fa338=_0x3fa338||this[_0x24115d(0x349)]()['id'],this[_0x24115d(0x166)][_0x3fa338]=this[_0x24115d(0x166)][_0x3fa338]||0x0,Math[_0x24115d(0x325)](this[_0x24115d(0x166)][_0x3fa338]);},Game_Actor['prototype']['setSkillPoints']=function(_0x1e88aa,_0x3aed3a){const _0xcfe142=_0x19b8c2;this[_0xcfe142(0x166)]===undefined&&this[_0xcfe142(0x32f)]();const _0x59ad3d=VisuMZ['SkillLearnSystem'][_0xcfe142(0x2b9)][_0xcfe142(0x23a)];_0x59ad3d[_0xcfe142(0x205)]?_0x3aed3a=0x0:_0x3aed3a=_0x3aed3a||this[_0xcfe142(0x349)]()['id'];this[_0xcfe142(0x166)][_0x3aed3a]=this['_skillPoints'][_0x3aed3a]||0x0,this[_0xcfe142(0x166)][_0x3aed3a]=Math[_0xcfe142(0x325)](_0x1e88aa||0x0);const _0x507a02=_0x59ad3d[_0xcfe142(0x2b8)]||Number[_0xcfe142(0x25a)];this[_0xcfe142(0x166)][_0x3aed3a]=this[_0xcfe142(0x166)][_0x3aed3a][_0xcfe142(0x342)](0x0,_0x507a02);},Game_Actor[_0x19b8c2(0x32d)][_0x19b8c2(0x254)]=function(_0x4f8887,_0xc9c1e1){const _0x3f234b=_0x19b8c2;_0x4f8887>0x0&&(_0x4f8887*=this[_0x3f234b(0x2f1)]()),this[_0x3f234b(0x1ca)](_0x4f8887,_0xc9c1e1);},Game_Actor[_0x19b8c2(0x32d)][_0x19b8c2(0x1a5)]=function(_0x1284c3){const _0xf5ff9f=_0x19b8c2;if(!Imported['VisuMZ_2_ClassChangeSystem'])return;_0x1284c3>0x0&&(_0x1284c3*=this[_0xf5ff9f(0x2f1)]()),this['gainMulticlassRewardPoints'](_0x1284c3,'Skill');},Game_Actor[_0x19b8c2(0x32d)][_0x19b8c2(0x1ca)]=function(_0x19b0be,_0x2a4739){const _0x2cee8c=_0x19b8c2,_0x4133ee=VisuMZ[_0x2cee8c(0x246)][_0x2cee8c(0x2b9)][_0x2cee8c(0x23a)];_0x4133ee['SharedResource']?_0x2a4739=0x0:_0x2a4739=_0x2a4739||this[_0x2cee8c(0x349)]()['id'],_0x19b0be+=this[_0x2cee8c(0x322)](_0x2a4739),this['setSkillPoints'](_0x19b0be,_0x2a4739);},Game_Actor[_0x19b8c2(0x32d)]['loseSkillPoints']=function(_0x2ccf11,_0x837785){const _0x22b2ea=_0x19b8c2;this[_0x22b2ea(0x1ca)](-_0x2ccf11,_0x837785);},Game_Actor['prototype'][_0x19b8c2(0x2f1)]=function(){const _0x5cb317=_0x19b8c2;return this[_0x5cb317(0x223)]()['reduce']((_0x418433,_0x33c28e)=>{const _0x81b663=_0x5cb317;return _0x33c28e&&_0x33c28e['note'][_0x81b663(0x220)](VisuMZ[_0x81b663(0x246)][_0x81b663(0x257)][_0x81b663(0x289)])?_0x418433*(Number(RegExp['$1'])*0.01):_0x418433;},0x1);},Game_Actor[_0x19b8c2(0x32d)][_0x19b8c2(0x2a8)]=function(_0x4d6dc6){const _0x4084c6=_0x19b8c2;if(this[_0x4084c6(0x28b)])return;const _0x1c5951=VisuMZ[_0x4084c6(0x246)]['Settings']['SkillPoints'];let _0x579f2b=0x0;try{_0x579f2b=eval(_0x1c5951['PerLevelUp']);}catch(_0x4ac999){if($gameTemp[_0x4084c6(0x321)]())console[_0x4084c6(0x1fe)](_0x4ac999);}this[_0x4084c6(0x254)](_0x579f2b,_0x4d6dc6);},Game_Actor[_0x19b8c2(0x32d)][_0x19b8c2(0x298)]=function(){const _0x54d128=_0x19b8c2;return this['_earnedSkillPoints']=this['_earnedSkillPoints']||0x0,this[_0x54d128(0x322)]()-this[_0x54d128(0x217)];},Game_Actor[_0x19b8c2(0x32d)][_0x19b8c2(0x232)]=function(_0x158572){const _0x5bbf2e=_0x19b8c2;if(!_0x158572)return![];const _0x2a69db=VisuMZ[_0x5bbf2e(0x246)][_0x5bbf2e(0x1b5)](_0x158572,_0x5bbf2e(0x1d6));if(VisuMZ[_0x5bbf2e(0x246)]['JS'][_0x2a69db]){if(!VisuMZ[_0x5bbf2e(0x246)]['JS'][_0x2a69db][_0x5bbf2e(0x2b7)](this,this,_0x158572))return![];}const _0x2029ba=VisuMZ[_0x5bbf2e(0x246)][_0x5bbf2e(0x257)],_0x411fd2=_0x158572[_0x5bbf2e(0x160)];if(_0x411fd2[_0x5bbf2e(0x220)](_0x2029ba['LearnReqLevel'])){const _0x206bb3=Number(RegExp['$1']);if(_0x206bb3>this[_0x5bbf2e(0x279)])return![];}if(_0x411fd2[_0x5bbf2e(0x220)](_0x2029ba[_0x5bbf2e(0x2d1)])){const _0x8ace59=String(RegExp['$1'])['split'](',')[_0x5bbf2e(0x302)](_0x5e054e=>_0x5e054e['trim']());for(const _0xf187f4 of _0x8ace59){let _0x27edac=0x0;const _0x2b38e6=/^\d+$/[_0x5bbf2e(0x259)](_0xf187f4);_0x2b38e6?_0x27edac=Number(_0xf187f4):_0x27edac=DataManager[_0x5bbf2e(0x27b)](_0xf187f4);if(!this[_0x5bbf2e(0x252)](_0x27edac))return![];}}if(_0x411fd2[_0x5bbf2e(0x220)](_0x2029ba[_0x5bbf2e(0x328)])){const _0x1c4e9a=String(RegExp['$1'])[_0x5bbf2e(0x2aa)](',')['map'](_0x352342=>_0x352342[_0x5bbf2e(0x201)]());let _0x211ac2=![];for(const _0x447333 of _0x1c4e9a){let _0x2e7453=0x0;const _0x5798bc=/^\d+$/[_0x5bbf2e(0x259)](_0x447333);_0x5798bc?_0x2e7453=Number(_0x447333):_0x2e7453=DataManager[_0x5bbf2e(0x27b)](_0x447333);if($dataSkills[_0x2e7453])console[_0x5bbf2e(0x1fe)]($dataSkills[_0x2e7453]['name'],this[_0x5bbf2e(0x252)](_0x2e7453));if(this['isLearnedSkill'](_0x2e7453)){_0x211ac2=!![];break;}}if(!_0x211ac2)return![];}if(_0x411fd2[_0x5bbf2e(0x220)](_0x2029ba[_0x5bbf2e(0x2cf)])){const _0x43f627=String(RegExp['$1'])[_0x5bbf2e(0x2aa)](',')[_0x5bbf2e(0x302)](_0x197873=>Number(_0x197873));for(const _0x172430 of _0x43f627){if(!$gameSwitches[_0x5bbf2e(0x290)](_0x172430))return![];}}if(_0x411fd2['match'](_0x2029ba['LearnReqSwitchesAny'])){const _0x2aa304=String(RegExp['$1'])[_0x5bbf2e(0x2aa)](',')[_0x5bbf2e(0x302)](_0x95e5ee=>Number(_0x95e5ee));let _0x48066c=![];for(const _0x2866f4 of _0x2aa304){if($gameSwitches[_0x5bbf2e(0x290)](_0x2866f4)){_0x48066c=!![];break;}}if(!_0x48066c)return![];}return!![];},Game_Actor[_0x19b8c2(0x32d)][_0x19b8c2(0x19e)]=function(_0x562a59){const _0x45d212=_0x19b8c2;if(!_0x562a59)return![];const _0x28581d=DataManager['getSkillLearnAbilityPointCost'](_0x562a59);if(_0x28581d>this[_0x45d212(0x242)]())return![];const _0x925cd8=DataManager[_0x45d212(0x1b3)](_0x562a59);if(_0x925cd8>this[_0x45d212(0x322)]())return![];const _0x301342=DataManager[_0x45d212(0x2bf)](_0x562a59);if(_0x301342>$gameParty['gold']())return![];if(Imported[_0x45d212(0x1e9)]){const _0x4851d5=DataManager['getSkillLearnClassPointCost'](_0x562a59);if(_0x4851d5>this['getClassPoints']())return![];const _0x2f6ec4=DataManager[_0x45d212(0x29c)](_0x562a59);if(_0x2f6ec4>this[_0x45d212(0x180)]())return![];}const _0x45cdf5=DataManager[_0x45d212(0x194)](_0x562a59);for(const _0x345a2a of _0x45cdf5){if(!_0x345a2a)continue;const _0x1e3217=$dataItems[_0x345a2a['id']];if(_0x1e3217&&_0x345a2a[_0x45d212(0x179)]>$gameParty[_0x45d212(0x338)](_0x1e3217))return![];}const _0x2e002a=DataManager[_0x45d212(0x280)](_0x562a59);for(const _0x51f61a of _0x2e002a){if(!_0x51f61a)continue;const _0x4d397c=$dataWeapons[_0x51f61a['id']];if(_0x4d397c&&_0x51f61a[_0x45d212(0x179)]>$gameParty[_0x45d212(0x338)](_0x4d397c))return![];}const _0x22453d=DataManager[_0x45d212(0x178)](_0x562a59);for(const _0x2553d3 of _0x22453d){if(!_0x2553d3)continue;const _0x5ad294=$dataArmors[_0x2553d3['id']];if(_0x5ad294&&_0x2553d3['quantity']>$gameParty['numItems'](_0x5ad294))return![];}return!![];},Game_Actor[_0x19b8c2(0x32d)]['processPayForSkillLearnSystem']=function(_0x48c6e7){const _0x223c79=_0x19b8c2;if(!_0x48c6e7)return;const _0x246276=DataManager['getSkillLearnAbilityPointCost'](_0x48c6e7);this[_0x223c79(0x333)](_0x246276);const _0x23cd4d=DataManager[_0x223c79(0x1b3)](_0x48c6e7);this[_0x223c79(0x1a9)](_0x23cd4d);const _0x29b9ec=DataManager[_0x223c79(0x2bf)](_0x48c6e7);$gameParty[_0x223c79(0x2c1)](_0x29b9ec);if(Imported['VisuMZ_2_ClassChangeSystem']){const _0x6abdbc=DataManager[_0x223c79(0x331)](_0x48c6e7);this[_0x223c79(0x1e1)](_0x6abdbc);const _0x38d4ce=DataManager[_0x223c79(0x29c)](_0x48c6e7);this['loseJobPoints'](_0x38d4ce);}const _0x591869=DataManager[_0x223c79(0x194)](_0x48c6e7);for(const _0x3a3a16 of _0x591869){if(!_0x3a3a16)continue;const _0xab317=$dataItems[_0x3a3a16['id']],_0x552731=_0x3a3a16[_0x223c79(0x179)];$gameParty[_0x223c79(0x1ef)](_0xab317,_0x552731);}const _0x54c62f=DataManager[_0x223c79(0x280)](_0x48c6e7);for(const _0x246d2c of _0x54c62f){if(!_0x246d2c)continue;const _0xa7d1f6=$dataWeapons[_0x246d2c['id']],_0x180412=_0x246d2c['quantity'];$gameParty[_0x223c79(0x1ef)](_0xa7d1f6,_0x180412);}const _0x558d6f=DataManager[_0x223c79(0x178)](_0x48c6e7);for(const _0x58e059 of _0x558d6f){if(!_0x58e059)continue;const _0x35a712=$dataArmors[_0x58e059['id']],_0x164671=_0x58e059[_0x223c79(0x179)];$gameParty[_0x223c79(0x1ef)](_0x35a712,_0x164671);}this[_0x223c79(0x23b)](_0x48c6e7['id']),this[_0x223c79(0x185)]();},VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x2b3)]=Game_Actor['prototype'][_0x19b8c2(0x23b)],Game_Actor[_0x19b8c2(0x32d)][_0x19b8c2(0x23b)]=function(_0x517d01){const _0x4b4363=_0x19b8c2,_0x3d5e99=!this[_0x4b4363(0x252)](_0x517d01);VisuMZ[_0x4b4363(0x246)][_0x4b4363(0x2b3)]['call'](this,_0x517d01);if(_0x3d5e99&&this['isLearnedSkill'](_0x517d01)){const _0x3df16b=$dataSkills[_0x517d01],_0x476ef8=VisuMZ[_0x4b4363(0x246)][_0x4b4363(0x1b5)](_0x3df16b,_0x4b4363(0x1fc));VisuMZ[_0x4b4363(0x246)]['JS'][_0x476ef8]&&VisuMZ[_0x4b4363(0x246)]['JS'][_0x476ef8][_0x4b4363(0x2b7)](this,this,_0x3df16b);}},Game_Actor['prototype'][_0x19b8c2(0x184)]=function(){const _0x59d56a=_0x19b8c2,_0x41d785=DataManager[_0x59d56a(0x1ab)](this[_0x59d56a(0x349)]()['id']);for(const _0x214586 of _0x41d785){const _0x5899ae=$dataSkills[_0x214586];if(!_0x5899ae)continue;if(_0x5899ae[_0x59d56a(0x316)][_0x59d56a(0x201)]()==='')continue;if(_0x5899ae['name'][_0x59d56a(0x220)](/-----/i))continue;this[_0x59d56a(0x23b)](_0x214586);}},Game_Enemy[_0x19b8c2(0x32d)][_0x19b8c2(0x204)]=function(){const _0x34f7e2=_0x19b8c2,_0x4cb995=VisuMZ[_0x34f7e2(0x246)][_0x34f7e2(0x2b9)][_0x34f7e2(0x1ad)],_0x1a1d9c=VisuMZ[_0x34f7e2(0x246)][_0x34f7e2(0x257)],_0x4e9327=this[_0x34f7e2(0x2b1)]()['note'];if(_0x4e9327[_0x34f7e2(0x220)](_0x1a1d9c[_0x34f7e2(0x1c3)]))try{return eval(RegExp['$1']);}catch(_0x2db0f5){if($gameTemp['isPlaytest']())console[_0x34f7e2(0x1fe)](_0x2db0f5);return 0x0;}try{return eval(_0x4cb995['PerEnemy']);}catch(_0x387c4c){if($gameTemp[_0x34f7e2(0x321)]())console['log'](_0x387c4c);return 0x0;}},Game_Enemy[_0x19b8c2(0x32d)]['skillPoints']=function(){const _0x1b3e97=_0x19b8c2,_0x1d7cb6=VisuMZ[_0x1b3e97(0x246)][_0x1b3e97(0x2b9)][_0x1b3e97(0x23a)],_0x4c5f09=VisuMZ['SkillLearnSystem'][_0x1b3e97(0x257)],_0x2ad748=this[_0x1b3e97(0x2b1)]()[_0x1b3e97(0x160)];if(_0x2ad748['match'](_0x4c5f09[_0x1b3e97(0x1a3)]))try{return eval(RegExp['$1']);}catch(_0x5518b9){if($gameTemp[_0x1b3e97(0x321)]())console[_0x1b3e97(0x1fe)](_0x5518b9);return 0x0;}try{return eval(_0x1d7cb6['PerEnemy']);}catch(_0xef4022){if($gameTemp[_0x1b3e97(0x321)]())console[_0x1b3e97(0x1fe)](_0xef4022);return 0x0;}},VisuMZ['SkillLearnSystem'][_0x19b8c2(0x2cc)]=Game_Party[_0x19b8c2(0x32d)][_0x19b8c2(0x350)],Game_Party[_0x19b8c2(0x32d)]['setupBattleTestMembers']=function(){const _0xf4f4c=_0x19b8c2;VisuMZ[_0xf4f4c(0x246)][_0xf4f4c(0x2cc)][_0xf4f4c(0x2b7)](this),this[_0xf4f4c(0x248)]();},Game_Party['prototype']['setupBattleTestMembersSkillLearnSystem']=function(){const _0x18f979=_0x19b8c2;for(const _0x146bb6 of this['allMembers']()){if(!_0x146bb6)continue;_0x146bb6[_0x18f979(0x184)]();}},Game_Troop[_0x19b8c2(0x32d)][_0x19b8c2(0x1a1)]=function(){const _0x20f6e1=_0x19b8c2;return this['deadMembers']()['reduce']((_0x12eec3,_0x1b737b)=>_0x12eec3+_0x1b737b[_0x20f6e1(0x204)](),0x0);},Game_Troop['prototype'][_0x19b8c2(0x1f3)]=function(){const _0x38919d=_0x19b8c2;return this[_0x38919d(0x2ae)]()[_0x38919d(0x2e0)]((_0x31bf55,_0x3be915)=>_0x31bf55+_0x3be915[_0x38919d(0x1a4)](),0x0);},VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x165)]=Scene_Skill[_0x19b8c2(0x32d)][_0x19b8c2(0x32b)],Scene_Skill[_0x19b8c2(0x32d)][_0x19b8c2(0x32b)]=function(){const _0x463704=_0x19b8c2;VisuMZ['SkillLearnSystem'][_0x463704(0x165)][_0x463704(0x2b7)](this),this['createSkillLearnSystemWindows']();},Scene_Skill[_0x19b8c2(0x32d)]['createSkillLearnSystemWindows']=function(){const _0x461459=_0x19b8c2;this[_0x461459(0x315)](),this[_0x461459(0x239)]();},Scene_Skill[_0x19b8c2(0x32d)]['createSkillLearnIngredientsWindow']=function(){const _0x508109=_0x19b8c2,_0x52e1e0=this[_0x508109(0x210)]();this[_0x508109(0x198)]=new Window_SkillLearnIngredients(_0x52e1e0),this[_0x508109(0x2a1)](this[_0x508109(0x198)]),this['_skillLearnIngredientsWindow']['hide']();const _0x50425c=VisuMZ[_0x508109(0x246)][_0x508109(0x2b9)][_0x508109(0x1b2)][_0x508109(0x233)];this[_0x508109(0x198)][_0x508109(0x17b)](_0x50425c);},Scene_Skill[_0x19b8c2(0x32d)][_0x19b8c2(0x210)]=function(){const _0x55dce7=_0x19b8c2;if(VisuMZ[_0x55dce7(0x246)][_0x55dce7(0x2b9)][_0x55dce7(0x1b2)]['DetailWindow_RectJS'])return VisuMZ[_0x55dce7(0x246)][_0x55dce7(0x2b9)][_0x55dce7(0x1b2)]['DetailWindow_RectJS'][_0x55dce7(0x2b7)](this);const _0x2592ef=this[_0x55dce7(0x26f)](),_0x8ad69d=_0x2592ef['x'],_0x5864b5=_0x2592ef['y'],_0x3b684b=_0x2592ef['width'],_0xfe80b4=_0x2592ef[_0x55dce7(0x208)]-this[_0x55dce7(0x2f0)](0x2,![]);return new Rectangle(_0x8ad69d,_0x5864b5,_0x3b684b,_0xfe80b4);},Scene_Skill['prototype'][_0x19b8c2(0x239)]=function(){const _0x100c3a=_0x19b8c2,_0x399f7a=this[_0x100c3a(0x2ff)]();this['_skillLearnConfirmWindow']=new Window_SkillLearnConfirm(_0x399f7a),this[_0x100c3a(0x2a1)](this[_0x100c3a(0x1f0)]),this[_0x100c3a(0x1f0)][_0x100c3a(0x202)]('ok',this[_0x100c3a(0x235)][_0x100c3a(0x25c)](this)),this[_0x100c3a(0x1f0)]['setHandler'](_0x100c3a(0x1cc),this[_0x100c3a(0x1be)][_0x100c3a(0x25c)](this)),this[_0x100c3a(0x1f0)][_0x100c3a(0x30c)]();const _0x27ad0c=VisuMZ[_0x100c3a(0x246)][_0x100c3a(0x2b9)]['Window'][_0x100c3a(0x2d5)];this[_0x100c3a(0x1f0)][_0x100c3a(0x17b)](_0x27ad0c);},Scene_Skill[_0x19b8c2(0x32d)][_0x19b8c2(0x2ff)]=function(){const _0x42ae95=_0x19b8c2;if(VisuMZ['SkillLearnSystem'][_0x42ae95(0x2b9)][_0x42ae95(0x1b2)][_0x42ae95(0x260)])return VisuMZ[_0x42ae95(0x246)][_0x42ae95(0x2b9)][_0x42ae95(0x1b2)][_0x42ae95(0x260)][_0x42ae95(0x2b7)](this);const _0x1f238b=this[_0x42ae95(0x26f)](),_0x246313=_0x1f238b[_0x42ae95(0x1ea)],_0x34f4da=this[_0x42ae95(0x2f0)](0x2,![]),_0x198efa=_0x1f238b['x'],_0x442b2e=_0x1f238b['y']+_0x1f238b[_0x42ae95(0x208)]-_0x34f4da;return new Rectangle(_0x198efa,_0x442b2e,_0x246313,_0x34f4da);},VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x1dd)]=Scene_Skill[_0x19b8c2(0x32d)]['onItemOk'],Scene_Skill[_0x19b8c2(0x32d)][_0x19b8c2(0x190)]=function(){const _0x54d78e=_0x19b8c2;this[_0x54d78e(0x2ea)][_0x54d78e(0x33f)]()?this[_0x54d78e(0x229)]():VisuMZ[_0x54d78e(0x246)][_0x54d78e(0x1dd)]['call'](this);},Scene_Skill[_0x19b8c2(0x32d)][_0x19b8c2(0x229)]=function(){const _0x308574=_0x19b8c2;this[_0x308574(0x2ea)][_0x308574(0x30c)](),this[_0x308574(0x198)][_0x308574(0x1b7)](),this[_0x308574(0x198)][_0x308574(0x185)](),this['_skillLearnConfirmWindow']['show'](),this[_0x308574(0x1f0)][_0x308574(0x185)](),this[_0x308574(0x1f0)]['activate'](),this[_0x308574(0x1f0)][_0x308574(0x2a2)](0x0);},Scene_Skill[_0x19b8c2(0x32d)][_0x19b8c2(0x235)]=function(){const _0x2617d5=_0x19b8c2;VisuMZ[_0x2617d5(0x246)][_0x2617d5(0x2b9)]['Animation'][_0x2617d5(0x2e2)]?this[_0x2617d5(0x351)]():this['finishSkillLearnAnimation']();},Scene_Skill['prototype'][_0x19b8c2(0x1be)]=function(){const _0x3a197e=_0x19b8c2;this[_0x3a197e(0x2ea)][_0x3a197e(0x1b7)](),this[_0x3a197e(0x2ea)][_0x3a197e(0x199)](),this['_skillLearnIngredientsWindow'][_0x3a197e(0x30c)](),this[_0x3a197e(0x1f0)][_0x3a197e(0x30c)]();},Scene_Skill[_0x19b8c2(0x32d)][_0x19b8c2(0x19f)]=function(){const _0x33aa94=_0x19b8c2;this[_0x33aa94(0x1db)]['visible']=!![],this[_0x33aa94(0x2c0)]=![],SoundManager[_0x33aa94(0x317)](),this[_0x33aa94(0x304)]()[_0x33aa94(0x219)](this[_0x33aa94(0x16b)]()),this[_0x33aa94(0x1be)](),this[_0x33aa94(0x2ea)][_0x33aa94(0x185)](),this[_0x33aa94(0x334)][_0x33aa94(0x185)]();},VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x34a)]=Scene_Skill[_0x19b8c2(0x32d)][_0x19b8c2(0x241)],Scene_Skill[_0x19b8c2(0x32d)][_0x19b8c2(0x241)]=function(){const _0x5d0449=_0x19b8c2;VisuMZ['SkillLearnSystem']['Scene_Skill_update'][_0x5d0449(0x2b7)](this),this[_0x5d0449(0x24e)]();},Scene_Skill[_0x19b8c2(0x32d)]['startSkillLearnAnimation']=function(){const _0x2fde43=_0x19b8c2;this[_0x2fde43(0x2c0)]=!![],this[_0x2fde43(0x32e)]=0x14,this[_0x2fde43(0x1db)][_0x2fde43(0x2a4)]=VisuMZ['SkillLearnSystem'][_0x2fde43(0x2b9)][_0x2fde43(0x1bd)][_0x2fde43(0x2ca)]||![],this['createSkillLearnSkillSprite']();},Scene_Skill[_0x19b8c2(0x32d)][_0x19b8c2(0x1e7)]=function(){const _0x4c5051=_0x19b8c2;this[_0x4c5051(0x1f9)]=new Sprite(),this[_0x4c5051(0x1c9)](this[_0x4c5051(0x1f9)]),this[_0x4c5051(0x313)](),this[_0x4c5051(0x21d)](),this[_0x4c5051(0x30a)](),this[_0x4c5051(0x243)](),this[_0x4c5051(0x28a)](),this['createSkillLearnAnimation'](this[_0x4c5051(0x27f)]['shift']());},Scene_Skill['prototype'][_0x19b8c2(0x313)]=function(){const _0x197395=_0x19b8c2,_0x1aa23b=VisuMZ['SkillLearnSystem']['RegExp'],_0x176fa9=this[_0x197395(0x16b)]()[_0x197395(0x160)];this[_0x197395(0x1de)]='';if(_0x176fa9['match'](_0x1aa23b[_0x197395(0x1ce)]))this[_0x197395(0x1de)]=String(RegExp['$1']);else _0x176fa9[_0x197395(0x220)](_0x1aa23b[_0x197395(0x285)])&&(this[_0x197395(0x1de)]=String(RegExp['$1']));this[_0x197395(0x308)]=new Sprite();this['_learnPicture']?this[_0x197395(0x308)][_0x197395(0x17a)]=ImageManager[_0x197395(0x26d)](this[_0x197395(0x1de)]):(this['_skillLearnBitmapSprite'][_0x197395(0x17a)]=ImageManager[_0x197395(0x1aa)](_0x197395(0x196)),this[_0x197395(0x308)][_0x197395(0x17a)][_0x197395(0x22c)]=![]);this[_0x197395(0x308)][_0x197395(0x34c)]['x']=0.5,this[_0x197395(0x308)]['anchor']['y']=0.5;if(!this[_0x197395(0x1de)]){const _0x57d79a=VisuMZ[_0x197395(0x246)][_0x197395(0x2b9)][_0x197395(0x1bd)]['Scale']||0x8;this[_0x197395(0x308)][_0x197395(0x1c6)]['x']=_0x57d79a,this['_skillLearnBitmapSprite'][_0x197395(0x1c6)]['y']=_0x57d79a;}this['_skillLearnIconSprite'][_0x197395(0x1c9)](this['_skillLearnBitmapSprite']);},Scene_Skill['prototype']['setSkillLearnSkillSpriteFrame']=function(){const _0xb557da=_0x19b8c2;if(this[_0xb557da(0x1de)])return;const _0x4bde5d=this[_0xb557da(0x16b)](),_0x58baf1=_0x4bde5d['iconIndex'],_0x5de5db=ImageManager['iconWidth'],_0x4aecc3=ImageManager[_0xb557da(0x16e)],_0x3404db=_0x58baf1%0x10*_0x5de5db,_0x306b0a=Math[_0xb557da(0x286)](_0x58baf1/0x10)*_0x4aecc3;this['_skillLearnBitmapSprite'][_0xb557da(0x33b)](_0x3404db,_0x306b0a,_0x5de5db,_0x4aecc3);},Scene_Skill[_0x19b8c2(0x32d)][_0x19b8c2(0x30a)]=function(){const _0x484f85=_0x19b8c2;this['_skillLearnIconSprite']['x']=Math[_0x484f85(0x325)](Graphics['width']/0x2);const _0x246085=Math[_0x484f85(0x325)](ImageManager['iconHeight']*this[_0x484f85(0x1f9)][_0x484f85(0x1c6)]['y']);this['_skillLearnIconSprite']['y']=Math[_0x484f85(0x325)]((Graphics[_0x484f85(0x208)]+_0x246085)/0x2);},Scene_Skill['prototype']['setSkillLearnSkillSpriteOpacity']=function(){const _0xe2f02a=_0x19b8c2;this[_0xe2f02a(0x1e6)]=VisuMZ[_0xe2f02a(0x246)][_0xe2f02a(0x2b9)]['Animation']['FadeSpeed']||0x1,this['item']()[_0xe2f02a(0x160)][_0xe2f02a(0x220)](VisuMZ[_0xe2f02a(0x246)]['RegExp']['opacitySpeed'])&&(this['_skillLearnIconSpriteOpacitySpeed']=Math[_0xe2f02a(0x19c)](Number(RegExp['$1']),0x1)),this[_0xe2f02a(0x1f9)][_0xe2f02a(0x2df)]=0x0;},Scene_Skill[_0x19b8c2(0x32d)][_0x19b8c2(0x28a)]=function(){const _0x352e6c=_0x19b8c2;this[_0x352e6c(0x27f)]=[],this[_0x352e6c(0x16b)]()['note'][_0x352e6c(0x220)](VisuMZ[_0x352e6c(0x246)][_0x352e6c(0x257)]['animationIDs'])?this['_skillLearnAnimationIDs']=RegExp['$1'][_0x352e6c(0x2aa)](',')['map'](_0x47d0c9=>Number(_0x47d0c9)):this[_0x352e6c(0x27f)]=this[_0x352e6c(0x27f)][_0x352e6c(0x2a6)](VisuMZ[_0x352e6c(0x246)][_0x352e6c(0x2b9)]['Animation'][_0x352e6c(0x335)]);},Scene_Skill['prototype']['createSkillLearnAnimation']=function(_0x2f40f9){const _0x326578=_0x19b8c2,_0x387d4d=$dataAnimations[_0x2f40f9];if(!_0x387d4d)return;const _0x4df354=this[_0x326578(0x1ee)](_0x387d4d);this[_0x326578(0x23d)]=new(_0x4df354?Sprite_AnimationMV:Sprite_Animation)();const _0x457682=[this[_0x326578(0x1f9)]],_0x5ea978=0x0;this[_0x326578(0x23d)][_0x326578(0x1b8)](_0x457682,_0x387d4d,![],_0x5ea978,null),this[_0x326578(0x1c9)](this[_0x326578(0x23d)]);},Scene_Skill[_0x19b8c2(0x32d)][_0x19b8c2(0x1ee)]=function(_0x4647a0){const _0x19edc4=_0x19b8c2;return!!_0x4647a0[_0x19edc4(0x1c2)];},Scene_Skill[_0x19b8c2(0x32d)][_0x19b8c2(0x24e)]=function(){const _0x5c6f17=_0x19b8c2;if(!this[_0x5c6f17(0x2c0)])return;this[_0x5c6f17(0x347)](),this['updateSkillLearnAnimationSprite'](),this[_0x5c6f17(0x256)]()&&this[_0x5c6f17(0x1ec)]();},Scene_Skill[_0x19b8c2(0x32d)][_0x19b8c2(0x347)]=function(){const _0x1ae6f2=_0x19b8c2;this[_0x1ae6f2(0x1f9)]['opacity']+=this['_skillLearnIconSpriteOpacitySpeed'];},Scene_Skill[_0x19b8c2(0x32d)][_0x19b8c2(0x1a8)]=function(){const _0x3f5ff5=_0x19b8c2;if(!this[_0x3f5ff5(0x23d)])return;if(this['_skillLearnAnimationSprite'][_0x3f5ff5(0x1ae)]())return;this[_0x3f5ff5(0x21e)](),this[_0x3f5ff5(0x272)](this[_0x3f5ff5(0x27f)][_0x3f5ff5(0x2e8)]());},Scene_Skill[_0x19b8c2(0x32d)][_0x19b8c2(0x21e)]=function(){const _0x443392=_0x19b8c2;if(!this[_0x443392(0x23d)])return;this[_0x443392(0x2d9)](this[_0x443392(0x23d)]),this[_0x443392(0x23d)][_0x443392(0x319)](),this[_0x443392(0x23d)]=undefined;},Scene_Skill[_0x19b8c2(0x32d)][_0x19b8c2(0x348)]=function(){const _0x430870=_0x19b8c2;if(!this['_skillLearnIconSprite'])return;this[_0x430870(0x2d9)](this[_0x430870(0x1f9)]),this[_0x430870(0x1f9)]['destroy'](),this[_0x430870(0x1f9)]=undefined;},Scene_Skill[_0x19b8c2(0x32d)][_0x19b8c2(0x256)]=function(){const _0x2532c8=_0x19b8c2;if(TouchInput[_0x2532c8(0x1a7)]())return!![];if(Input['isTriggered']('ok'))return!![];if(Input[_0x2532c8(0x187)](_0x2532c8(0x1cc)))return!![];if(this[_0x2532c8(0x1f9)][_0x2532c8(0x2df)]<0xff)return![];if(this[_0x2532c8(0x23d)])return![];return this[_0x2532c8(0x32e)]--<=0x0;},Scene_Skill[_0x19b8c2(0x32d)][_0x19b8c2(0x1ec)]=function(){const _0x18640d=_0x19b8c2;this['destroySkillLearnAnimationSprite'](),this['destroySkillLearnSprite'](),this[_0x18640d(0x19f)](),TouchInput[_0x18640d(0x2b5)](),Input[_0x18640d(0x2b5)]();},Window_Base['prototype'][_0x19b8c2(0x283)]=function(_0x312914,_0x3e22d8,_0x1d0f31,_0x2750b8,_0x16af97){const _0x2b3f02=_0x19b8c2;_0x16af97=_0x16af97||_0x2b3f02(0x17e);const _0x36a42f=_0x2b3f02(0x266)[_0x2b3f02(0x23f)](ImageManager[_0x2b3f02(0x2a7)]),_0x34abff=TextManager['abilityPointsFmt'],_0x2c5422=_0x34abff['format'](_0x312914,TextManager[_0x2b3f02(0x33a)],_0x36a42f,TextManager[_0x2b3f02(0x33c)]),_0x50783a=this['textSizeEx'](_0x2c5422)[_0x2b3f02(0x1ea)];if(_0x16af97===_0x2b3f02(0x17e))_0x3e22d8+=0x0;else _0x16af97===_0x2b3f02(0x294)?_0x3e22d8+=Math[_0x2b3f02(0x325)]((_0x2750b8-_0x50783a)/0x2):_0x3e22d8+=_0x2750b8-_0x50783a;this['drawTextEx'](_0x2c5422,_0x3e22d8,_0x1d0f31);},Window_Base[_0x19b8c2(0x32d)][_0x19b8c2(0x18a)]=function(_0x314bf4,_0x477e13,_0x4af395,_0x1f7dff,_0x854b36,_0x36f9d3){const _0x51fd32=_0x19b8c2,_0x4c5a33=_0x314bf4['getAbilityPoints'](_0x477e13);this[_0x51fd32(0x283)](_0x4c5a33,_0x4af395,_0x1f7dff,_0x854b36,_0x36f9d3);},Window_Base[_0x19b8c2(0x32d)][_0x19b8c2(0x234)]=function(_0x3464d3,_0x176537,_0x5b5785,_0x1f7d66,_0x351b15){const _0x2247a9=_0x19b8c2;_0x351b15=_0x351b15||_0x2247a9(0x17e);const _0x11e07c=_0x2247a9(0x266)[_0x2247a9(0x23f)](ImageManager['skillPointsIcon']),_0x247dac=TextManager[_0x2247a9(0x2db)],_0x5f004d=_0x247dac[_0x2247a9(0x23f)](_0x3464d3,TextManager[_0x2247a9(0x26b)],_0x11e07c,TextManager['skillPointsFull']),_0x52eedf=this[_0x2247a9(0x226)](_0x5f004d)[_0x2247a9(0x1ea)];if(_0x351b15===_0x2247a9(0x17e))_0x176537+=0x0;else _0x351b15===_0x2247a9(0x294)?_0x176537+=Math[_0x2247a9(0x325)]((_0x1f7d66-_0x52eedf)/0x2):_0x176537+=_0x1f7d66-_0x52eedf;this[_0x2247a9(0x267)](_0x5f004d,_0x176537,_0x5b5785);},Window_Base[_0x19b8c2(0x32d)][_0x19b8c2(0x25d)]=function(_0x2397e4,_0xfc151,_0x3fea80,_0x5351ff,_0x1eb5aa,_0x4a77eb){const _0x2adfb2=_0x19b8c2,_0x4b7843=_0x2397e4[_0x2adfb2(0x322)](_0xfc151);this[_0x2adfb2(0x234)](_0x4b7843,_0x3fea80,_0x5351ff,_0x1eb5aa,_0x4a77eb);},VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x172)]=Window_SkillType[_0x19b8c2(0x32d)][_0x19b8c2(0x17c)],Window_SkillType['prototype']['makeCommandList']=function(){const _0xe9b429=_0x19b8c2;VisuMZ['SkillLearnSystem'][_0xe9b429(0x172)]['call'](this),this['addSkillLearnSystemCommand']();},Window_SkillType['prototype'][_0x19b8c2(0x27c)]=function(){const _0x574d5b=_0x19b8c2;if(!$gameSystem[_0x574d5b(0x27a)]())return;if(!this['_actor'])return;let _0x25823d=this['skillLearnSystemCommandName']();const _0x4b2016=this[_0x574d5b(0x174)][_0x574d5b(0x278)]()[0x0];this[_0x574d5b(0x26a)](_0x25823d,'skill',!![],_0x574d5b(0x1d7));},Window_SkillType[_0x19b8c2(0x32d)][_0x19b8c2(0x186)]=function(){const _0x18c405=_0x19b8c2;let _0x5ed945=TextManager['skillLearnCmd'];if(_0x5ed945[_0x18c405(0x220)](/\\I\[(\d+)\]/i))return _0x5ed945;if(!Imported['VisuMZ_1_SkillsStatesCore'])return _0x5ed945;if(this[_0x18c405(0x352)]()===_0x18c405(0x207))return _0x5ed945;const _0x34d213=TextManager['skillLearnIcon'];return _0x18c405(0x2ed)[_0x18c405(0x23f)](_0x34d213,_0x5ed945);},VisuMZ[_0x19b8c2(0x246)]['Window_SkillStatus_refresh']=Window_SkillStatus[_0x19b8c2(0x32d)][_0x19b8c2(0x185)],Window_SkillStatus['prototype']['refresh']=function(){const _0x271878=_0x19b8c2;this['resetFontSettings'](),this[_0x271878(0x33f)]()?this[_0x271878(0x238)]():VisuMZ[_0x271878(0x246)][_0x271878(0x16f)][_0x271878(0x2b7)](this);},Window_SkillStatus[_0x19b8c2(0x32d)][_0x19b8c2(0x33f)]=function(){const _0x1cbecb=_0x19b8c2,_0x3057d5=SceneManager['_scene'];if(!_0x3057d5)return![];const _0x22e4f0=_0x3057d5['_itemWindow'];if(!_0x22e4f0)return![];return _0x22e4f0[_0x1cbecb(0x33f)]&&_0x22e4f0[_0x1cbecb(0x33f)]();},Window_SkillStatus[_0x19b8c2(0x32d)][_0x19b8c2(0x238)]=function(){const _0x261594=_0x19b8c2;if(!this['_actor'])return;Window_StatusBase[_0x261594(0x32d)][_0x261594(0x185)][_0x261594(0x2b7)](this);if(VisuMZ[_0x261594(0x246)][_0x261594(0x2b9)][_0x261594(0x28d)][_0x261594(0x1c8)]){VisuMZ[_0x261594(0x246)][_0x261594(0x2b9)][_0x261594(0x28d)]['StatusWindowDrawJS']['call'](this);return;}const _0x5f589e=this['colSpacing']()/0x2,_0xb2306=this['innerHeight'],_0x9b7e09=_0xb2306/0x2-this[_0x261594(0x25e)]()*1.5;this['drawActorFace'](this[_0x261594(0x174)],_0x5f589e+0x1,0x0,0x90,_0xb2306),this[_0x261594(0x21f)](this[_0x261594(0x174)],_0x5f589e+0xb4,_0x9b7e09);let _0x435bf5=this[_0x261594(0x1f4)]()/0x2+0xb4+0xb4+0xb4,_0x5062ac=this[_0x261594(0x2e3)]-_0x435bf5-0x2;if(_0x5062ac<0x12c)return;const _0x1a42c3=this['getSkillLearnDisplayedCosts'](),_0x194ebd=Math[_0x261594(0x286)](this[_0x261594(0x26e)]/this[_0x261594(0x25e)]()),_0x1a0191=Math['ceil'](_0x1a42c3[_0x261594(0x209)]/_0x194ebd);let _0x20f36=_0x435bf5,_0x35821f=Math[_0x261594(0x19c)](Math['round']((this[_0x261594(0x26e)]-this['lineHeight']()*Math[_0x261594(0x2f3)](_0x1a42c3[_0x261594(0x209)]/_0x1a0191))/0x2),0x0);const _0x40bfd6=_0x35821f;let _0x1decff=(this[_0x261594(0x2e3)]-_0x20f36-this[_0x261594(0x211)]()*0x2*_0x1a0191)/_0x1a0191;_0x1a0191===0x1&&(_0x1decff=Math[_0x261594(0x218)](ImageManager[_0x261594(0x29f)],_0x1decff),_0x20f36+=Math[_0x261594(0x325)]((this[_0x261594(0x2e3)]-_0x20f36-this[_0x261594(0x211)]()*0x2-_0x1decff)/0x2));for(const _0x54ef50 of _0x1a42c3){switch(_0x54ef50){case'AP':this['drawActorAbilityPoints'](this['_actor'],this[_0x261594(0x174)]['currentClass']()['id'],_0x20f36,_0x35821f,_0x1decff,'right');break;case'CP':Imported[_0x261594(0x1e9)]&&this['drawActorClassPoints'](this['_actor'],this[_0x261594(0x174)]['currentClass']()['id'],_0x20f36,_0x35821f,_0x1decff,_0x261594(0x230));break;case'JP':Imported['VisuMZ_2_ClassChangeSystem']&&this[_0x261594(0x2af)](this[_0x261594(0x174)],this[_0x261594(0x174)][_0x261594(0x349)]()['id'],_0x20f36,_0x35821f,_0x1decff,_0x261594(0x230));break;case'SP':this[_0x261594(0x25d)](this['_actor'],this[_0x261594(0x174)][_0x261594(0x349)]()['id'],_0x20f36,_0x35821f,_0x1decff,_0x261594(0x230));break;case'Gold':this['drawCurrencyValue']($gameParty[_0x261594(0x1ed)](),TextManager[_0x261594(0x2dd)],_0x20f36,_0x35821f,_0x1decff);break;default:continue;}_0x35821f+=this[_0x261594(0x25e)](),_0x35821f+this[_0x261594(0x25e)]()>this[_0x261594(0x26e)]&&(_0x35821f=_0x40bfd6,_0x20f36+=_0x1decff+this['itemPadding']()*0x2);}},Window_SkillStatus[_0x19b8c2(0x32d)][_0x19b8c2(0x287)]=function(){const _0x2399c6=_0x19b8c2,_0x3e4ba6=JsonEx['makeDeepCopy'](VisuMZ[_0x2399c6(0x246)][_0x2399c6(0x2b9)][_0x2399c6(0x28d)][_0x2399c6(0x1ac)]);return!Imported[_0x2399c6(0x1e9)]&&(_0x3e4ba6[_0x2399c6(0x2d2)]('CP'),_0x3e4ba6[_0x2399c6(0x2d2)]('JP')),_0x3e4ba6[_0x2399c6(0x2d2)](_0x2399c6(0x191))[_0x2399c6(0x2d2)](_0x2399c6(0x1b1))['remove'](_0x2399c6(0x18b));},Window_SkillList['prototype']['isSkillLearnMode']=function(){const _0x40fd84=_0x19b8c2;return this['_stypeId']===_0x40fd84(0x1d7);},VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x2c4)]=Window_SkillList[_0x19b8c2(0x32d)][_0x19b8c2(0x24f)],Window_SkillList['prototype']['setStypeId']=function(_0xf51cb5){const _0x33f28f=_0x19b8c2,_0x108c9a=this['isSkillLearnMode']();VisuMZ[_0x33f28f(0x246)][_0x33f28f(0x2c4)]['call'](this,_0xf51cb5);if(_0x108c9a!==this[_0x33f28f(0x33f)]()){const _0x5d92ff=SceneManager[_0x33f28f(0x1fa)];if(!_0x5d92ff)return;const _0x118b38=_0x5d92ff[_0x33f28f(0x334)];if(_0x118b38)_0x118b38['refresh']();}},VisuMZ[_0x19b8c2(0x246)]['Window_SkillList_maxCols']=Window_SkillList['prototype'][_0x19b8c2(0x1cf)],Window_SkillList['prototype']['maxCols']=function(){const _0x46e249=_0x19b8c2;return this[_0x46e249(0x33f)]()?0x1:VisuMZ[_0x46e249(0x246)][_0x46e249(0x2fc)][_0x46e249(0x2b7)](this);},VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x341)]=Window_SkillList[_0x19b8c2(0x32d)][_0x19b8c2(0x311)],Window_SkillList[_0x19b8c2(0x32d)][_0x19b8c2(0x311)]=function(){const _0x1f3d18=_0x19b8c2;this[_0x1f3d18(0x174)]&&this[_0x1f3d18(0x33f)]()?this[_0x1f3d18(0x22f)]():VisuMZ['SkillLearnSystem'][_0x1f3d18(0x341)]['call'](this);},Window_SkillList[_0x19b8c2(0x32d)][_0x19b8c2(0x22f)]=function(){const _0x5acbb6=_0x19b8c2,_0x1a16e4=DataManager[_0x5acbb6(0x1ab)](this[_0x5acbb6(0x174)][_0x5acbb6(0x349)]()['id']);this[_0x5acbb6(0x225)]=_0x1a16e4[_0x5acbb6(0x302)](_0x416816=>$dataSkills[_0x416816])[_0x5acbb6(0x1da)](_0x1e97b3=>this[_0x5acbb6(0x2e9)](_0x1e97b3));},VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x224)]=Window_SkillList['prototype'][_0x19b8c2(0x2e9)],Window_SkillList[_0x19b8c2(0x32d)][_0x19b8c2(0x2e9)]=function(_0x184d5f){const _0x2f9633=_0x19b8c2;return this[_0x2f9633(0x33f)]()?this[_0x2f9633(0x16d)](_0x184d5f):VisuMZ[_0x2f9633(0x246)][_0x2f9633(0x224)][_0x2f9633(0x2b7)](this,_0x184d5f);},Window_SkillList[_0x19b8c2(0x32d)][_0x19b8c2(0x16d)]=function(_0x104ac0){const _0x24e563=_0x19b8c2;if(!_0x104ac0)return![];if(_0x104ac0[_0x24e563(0x316)][_0x24e563(0x209)]<=0x0)return![];if(_0x104ac0[_0x24e563(0x316)][_0x24e563(0x220)](/-----/i))return![];const _0x24f615=VisuMZ[_0x24e563(0x246)][_0x24e563(0x1b5)](_0x104ac0,_0x24e563(0x2b6));if(VisuMZ[_0x24e563(0x246)]['JS'][_0x24f615]){if(!VisuMZ[_0x24e563(0x246)]['JS'][_0x24f615][_0x24e563(0x2b7)](this,this[_0x24e563(0x174)],_0x104ac0))return![];}const _0x33a38d=VisuMZ['SkillLearnSystem']['RegExp'],_0x788413=_0x104ac0[_0x24e563(0x160)];if(_0x788413[_0x24e563(0x220)](_0x33a38d['LearnShowLevel'])){const _0x2b873a=Number(RegExp['$1']);if(_0x2b873a>this['_actor'][_0x24e563(0x279)])return![];}if(_0x788413[_0x24e563(0x220)](_0x33a38d[_0x24e563(0x2c5)])){const _0x5e435f=String(RegExp['$1'])['split'](',')[_0x24e563(0x302)](_0x6cb222=>_0x6cb222[_0x24e563(0x201)]());;for(const _0x314036 of _0x5e435f){let _0x1328c1=0x0;const _0x30aa4f=/^\d+$/['test'](_0x314036);_0x30aa4f?_0x1328c1=Number(_0x314036):_0x1328c1=DataManager[_0x24e563(0x27b)](_0x314036);if(!this[_0x24e563(0x174)][_0x24e563(0x252)](_0x1328c1))return![];}}if(_0x788413[_0x24e563(0x220)](_0x33a38d[_0x24e563(0x31f)])){const _0x2f05f5=String(RegExp['$1'])[_0x24e563(0x2aa)](',')[_0x24e563(0x302)](_0x5c9514=>_0x5c9514[_0x24e563(0x201)]());;let _0x28a96d=![];for(const _0x53745e of _0x2f05f5){let _0x123504=0x0;const _0x3e7a57=/^\d+$/[_0x24e563(0x259)](_0x53745e);_0x3e7a57?_0x123504=Number(_0x53745e):_0x123504=DataManager[_0x24e563(0x27b)](_0x53745e);if(this[_0x24e563(0x174)][_0x24e563(0x252)](_0x123504)){_0x28a96d=!![];break;}}if(!_0x28a96d)return![];}if(_0x788413[_0x24e563(0x220)](_0x33a38d['LearnShowSwitchesAll'])){const _0x369f71=String(RegExp['$1'])[_0x24e563(0x2aa)](',')[_0x24e563(0x302)](_0x4cfcdb=>Number(_0x4cfcdb));for(const _0x1e7fe6 of _0x369f71){if(!$gameSwitches[_0x24e563(0x290)](_0x1e7fe6))return![];}}if(_0x788413[_0x24e563(0x220)](_0x33a38d[_0x24e563(0x1bc)])){const _0x239c94=String(RegExp['$1'])[_0x24e563(0x2aa)](',')[_0x24e563(0x302)](_0x5703e0=>Number(_0x5703e0));let _0x1308e2=![];for(const _0x5b372f of _0x239c94){if($gameSwitches['value'](_0x5b372f)){_0x1308e2=!![];break;}}if(!_0x1308e2)return![];}return _0x104ac0;},VisuMZ[_0x19b8c2(0x246)][_0x19b8c2(0x163)]=Window_SkillList['prototype']['isEnabled'],Window_SkillList['prototype'][_0x19b8c2(0x1f2)]=function(_0x586e6a){const _0x58c8e4=_0x19b8c2;return this[_0x58c8e4(0x174)]&&this['isSkillLearnMode']()?this[_0x58c8e4(0x2f2)](_0x586e6a):VisuMZ[_0x58c8e4(0x246)][_0x58c8e4(0x163)][_0x58c8e4(0x2b7)](this,_0x586e6a);},VisuMZ['SkillLearnSystem']['Window_SkillList_drawItem']=Window_SkillList[_0x19b8c2(0x32d)]['drawItem'],Window_SkillList[_0x19b8c2(0x32d)][_0x19b8c2(0x1a6)]=function(_0x25c71c){const _0x121e49=_0x19b8c2;this[_0x121e49(0x1b4)]=this[_0x121e49(0x33f)](),VisuMZ[_0x121e49(0x246)][_0x121e49(0x181)]['call'](this,_0x25c71c),this[_0x121e49(0x1b4)]=![];},Window_SkillList[_0x19b8c2(0x32d)][_0x19b8c2(0x2f2)]=function(_0x3fd66e){const _0x1469b3=_0x19b8c2;if(!_0x3fd66e)return![];if(_0x3fd66e[_0x1469b3(0x316)][_0x1469b3(0x209)]<=0x0)return![];if(_0x3fd66e[_0x1469b3(0x316)][_0x1469b3(0x220)](/-----/i))return![];if(this[_0x1469b3(0x174)]['isLearnedSkill'](_0x3fd66e['id']))return![];if(this[_0x1469b3(0x1b4)]){if(!this['_actor'][_0x1469b3(0x232)](_0x3fd66e))return![];return this[_0x1469b3(0x174)][_0x1469b3(0x19e)](_0x3fd66e);}return!![];},VisuMZ['SkillLearnSystem']['Window_SkillList_drawSkillCost']=Window_SkillList[_0x19b8c2(0x32d)][_0x19b8c2(0x1e8)],Window_SkillList[_0x19b8c2(0x32d)][_0x19b8c2(0x1e8)]=function(_0x192840,_0x417d2c,_0x38c3b4,_0x4239d3){const _0x4d7726=_0x19b8c2;this['isSkillLearnMode']()?this['shouldDrawSkillLearnRequirements'](_0x192840)?this[_0x4d7726(0x2c7)](_0x192840,_0x417d2c,_0x38c3b4,_0x4239d3):this[_0x4d7726(0x228)](_0x192840,_0x417d2c,_0x38c3b4,_0x4239d3):VisuMZ[_0x4d7726(0x246)][_0x4d7726(0x213)][_0x4d7726(0x2b7)](this,_0x192840,_0x417d2c,_0x38c3b4,_0x4239d3);},Window_SkillList[_0x19b8c2(0x32d)][_0x19b8c2(0x2f7)]=function(_0x4642d4){const _0x3832b6=_0x19b8c2;return this[_0x3832b6(0x174)]&&!this[_0x3832b6(0x174)]['meetRequirementsForSkillLearnSystem'](_0x4642d4);},Window_SkillList[_0x19b8c2(0x32d)][_0x19b8c2(0x2c7)]=function(_0x1b8488,_0x2c80d0,_0x175281,_0x582162){const _0x5a1b2b=_0x19b8c2,_0x14d33e=this[_0x5a1b2b(0x249)](_0x1b8488),_0x5b7f4d=this['textSizeEx'](_0x14d33e)[_0x5a1b2b(0x1ea)];_0x2c80d0+=_0x582162-_0x5b7f4d,this[_0x5a1b2b(0x267)](_0x14d33e,_0x2c80d0,_0x175281);},Window_SkillList[_0x19b8c2(0x32d)][_0x19b8c2(0x249)]=function(_0x4c314e){const _0x495a21=_0x19b8c2,_0x51f794=VisuMZ[_0x495a21(0x246)]['Settings'][_0x495a21(0x28d)],_0x400dd1=TextManager[_0x495a21(0x2f5)],_0xc9f539=VisuMZ[_0x495a21(0x246)]['RegExp'],_0x36383e=_0x4c314e[_0x495a21(0x160)];let _0x29959b='',_0x536d5a='';const _0x4be3c2=[_0x495a21(0x2f6),_0x495a21(0x193),_0x495a21(0x2ee),_0x495a21(0x236)];for(const _0x3f6926 of _0x4be3c2){switch(_0x3f6926){case _0x495a21(0x2f6):if(_0x36383e[_0x495a21(0x220)](_0xc9f539[_0x495a21(0x326)])){const _0x187217=Number(RegExp['$1']);_0x536d5a=TextManager[_0x495a21(0x1d1)][_0x495a21(0x23f)](_0x187217,TextManager[_0x495a21(0x279)],TextManager[_0x495a21(0x292)]),_0x536d5a['length']>0x0&&(_0x29959b!==''?_0x29959b=_0x400dd1[_0x495a21(0x23f)](_0x29959b,_0x536d5a):_0x29959b=_0x536d5a);}break;case _0x495a21(0x193):if(_0x36383e[_0x495a21(0x220)](_0xc9f539[_0x495a21(0x2d1)])){const _0x559020=String(RegExp['$1'])[_0x495a21(0x2aa)](',')[_0x495a21(0x302)](_0x6d8c55=>_0x6d8c55[_0x495a21(0x201)]());;for(const _0x488bdb of _0x559020){let _0x541982=0x0;const _0x4c68c0=/^\d+$/[_0x495a21(0x259)](_0x488bdb);_0x4c68c0?_0x541982=Number(_0x488bdb):_0x541982=DataManager[_0x495a21(0x27b)](_0x488bdb);if($dataSkills[_0x541982]){const _0x5f486d=$dataSkills[_0x541982];_0x536d5a=TextManager[_0x495a21(0x332)][_0x495a21(0x23f)](_0x495a21(0x266)[_0x495a21(0x23f)](_0x5f486d['iconIndex']),_0x5f486d[_0x495a21(0x316)]),_0x536d5a['length']>0x0&&(_0x29959b!==''?_0x29959b=_0x400dd1[_0x495a21(0x23f)](_0x29959b,_0x536d5a):_0x29959b=_0x536d5a);}}}if(_0x36383e[_0x495a21(0x220)](_0xc9f539['LearnReqSkillsAny'])){const _0x3bcd6b=String(RegExp['$1'])[_0x495a21(0x2aa)](',')[_0x495a21(0x302)](_0x1e922c=>_0x1e922c[_0x495a21(0x201)]());;for(const _0x1c2434 of _0x3bcd6b){let _0x473a50=0x0;const _0x151be8=/^\d+$/['test'](_0x1c2434);_0x151be8?_0x473a50=Number(_0x1c2434):_0x473a50=DataManager[_0x495a21(0x27b)](_0x1c2434);if($dataSkills[_0x473a50]){const _0x132ac5=$dataSkills[_0x473a50];_0x536d5a=TextManager[_0x495a21(0x332)][_0x495a21(0x23f)](_0x495a21(0x266)[_0x495a21(0x23f)](_0x132ac5[_0x495a21(0x2a0)]),_0x132ac5[_0x495a21(0x316)]),_0x536d5a[_0x495a21(0x209)]>0x0&&(_0x29959b!==''?_0x29959b=_0x400dd1[_0x495a21(0x23f)](_0x29959b,_0x536d5a):_0x29959b=_0x536d5a);}}}break;case _0x495a21(0x2ee):if(_0x36383e['match'](_0xc9f539[_0x495a21(0x2cf)])){const _0xfcf742=String(RegExp['$1'])[_0x495a21(0x2aa)](',')[_0x495a21(0x302)](_0x225222=>_0x225222[_0x495a21(0x201)]());;for(const _0xe68430 of _0xfcf742){$dataSystem['switches'][_0xe68430]&&(_0x536d5a=TextManager['skillLearnReqSwitchFmt']['format']($dataSystem[_0x495a21(0x1d0)][_0xe68430]||''),_0x536d5a[_0x495a21(0x209)]>0x0&&(_0x29959b!==''?_0x29959b=_0x400dd1[_0x495a21(0x23f)](_0x29959b,_0x536d5a):_0x29959b=_0x536d5a));}}if(_0x36383e[_0x495a21(0x220)](_0xc9f539[_0x495a21(0x271)])){const _0x1bc2e1=String(RegExp['$1'])[_0x495a21(0x2aa)](',')[_0x495a21(0x302)](_0x126293=>_0x126293[_0x495a21(0x201)]());;for(const _0x1e83e7 of _0x1bc2e1){$dataSystem['switches'][_0x1e83e7]&&(_0x536d5a=TextManager[_0x495a21(0x299)][_0x495a21(0x23f)]($dataSystem['switches'][_0x1e83e7]||''),_0x536d5a[_0x495a21(0x209)]>0x0&&(_0x29959b!==''?_0x29959b=_0x400dd1['format'](_0x29959b,_0x536d5a):_0x29959b=_0x536d5a));}}break;case'CUSTOM':const _0x4fa1d3=VisuMZ['SkillLearnSystem'][_0x495a21(0x1b5)](_0x4c314e,_0x495a21(0x1bb));VisuMZ[_0x495a21(0x246)]['JS'][_0x4fa1d3]&&(_0x536d5a=VisuMZ[_0x495a21(0x246)]['JS'][_0x4fa1d3][_0x495a21(0x2b7)](this,this['_actor'],_0x4c314e),_0x536d5a[_0x495a21(0x209)]>0x0&&(_0x29959b!==''?_0x29959b=_0x400dd1[_0x495a21(0x23f)](_0x29959b,_0x536d5a):_0x29959b=_0x536d5a));break;}}return _0x29959b=TextManager[_0x495a21(0x30d)][_0x495a21(0x23f)](_0x29959b),_0x29959b[_0x495a21(0x201)]();},Window_SkillList[_0x19b8c2(0x32d)]['drawSkillLearnCost']=function(_0x2a9b6a,_0x57aba3,_0x1ae890,_0x17976c){const _0x1abc66=_0x19b8c2,_0x1dd2c5=this[_0x1abc66(0x1d4)](_0x2a9b6a),_0x7ab5da=this[_0x1abc66(0x226)](_0x1dd2c5)[_0x1abc66(0x1ea)];_0x57aba3+=_0x17976c-_0x7ab5da,this[_0x1abc66(0x267)](_0x1dd2c5,_0x57aba3,_0x1ae890);},Window_SkillList['prototype'][_0x19b8c2(0x1d4)]=function(_0x104f4c){const _0x213e35=_0x19b8c2;if(this[_0x213e35(0x174)]&&this[_0x213e35(0x174)][_0x213e35(0x252)](_0x104f4c['id']))return TextManager[_0x213e35(0x2ef)];const _0x17b925=VisuMZ['SkillLearnSystem'][_0x213e35(0x2b9)][_0x213e35(0x28d)],_0x4b0894=TextManager[_0x213e35(0x2be)];let _0x184312='';const _0x4fd3dd=JsonEx['makeDeepCopy'](_0x17b925[_0x213e35(0x1ac)]);_0x4fd3dd[_0x213e35(0x327)](_0x213e35(0x33d));for(const _0x8071d5 of _0x4fd3dd){if(!_0x8071d5)continue;const _0x429995=this[_0x213e35(0x305)](_0x104f4c,_0x8071d5)['trim']();_0x429995['length']>0x0&&(_0x184312!==''?_0x184312=_0x4b0894[_0x213e35(0x23f)](_0x184312,_0x429995):_0x184312=_0x429995);}return _0x184312[_0x213e35(0x201)]();},Window_SkillList['prototype'][_0x19b8c2(0x305)]=function(_0x430dc8,_0x4dd2f7){const _0x474a31=_0x19b8c2;let _0x458d23=0x0,_0x2d21c5='',_0x282664='';switch(_0x4dd2f7['toUpperCase']()[_0x474a31(0x201)]()){case'AP':_0x458d23=DataManager[_0x474a31(0x1f5)](_0x430dc8);if(_0x458d23>0x0)return _0x2d21c5=TextManager[_0x474a31(0x309)],_0x2d21c5[_0x474a31(0x23f)](_0x458d23,TextManager[_0x474a31(0x33a)],'\x5cI[%1]'[_0x474a31(0x23f)](ImageManager['abilityPointsIcon']),TextManager[_0x474a31(0x33c)]);break;case'SP':_0x458d23=DataManager['getSkillLearnSkillPointCost'](_0x430dc8);if(_0x458d23>0x0)return _0x2d21c5=TextManager[_0x474a31(0x2db)],_0x2d21c5[_0x474a31(0x23f)](_0x458d23,TextManager[_0x474a31(0x26b)],'\x5cI[%1]'[_0x474a31(0x23f)](ImageManager['skillPointsIcon']),TextManager[_0x474a31(0x244)]);break;case _0x474a31(0x245):_0x458d23=DataManager[_0x474a31(0x194)](_0x430dc8),_0x2d21c5=TextManager[_0x474a31(0x31d)];for(const _0x5de18d of _0x458d23){if(!_0x5de18d)continue;const _0x4778c5=$dataItems[_0x5de18d['id']];if(!_0x4778c5)continue;const _0x569815=_0x2d21c5[_0x474a31(0x23f)](_0x5de18d['quantity'],_0x474a31(0x266)[_0x474a31(0x23f)](_0x4778c5[_0x474a31(0x2a0)]),_0x4778c5[_0x474a31(0x316)]);_0x282664!==''?_0x282664=TextManager['skillLearnSeparationFmt'][_0x474a31(0x23f)](_0x282664,_0x569815):_0x282664=_0x569815;}return _0x282664;case _0x474a31(0x2c8):_0x458d23=DataManager['getSkillLearnWeaponCost'](_0x430dc8),_0x2d21c5=TextManager[_0x474a31(0x2ba)];for(const _0x5c73e3 of _0x458d23){if(!_0x5c73e3)continue;const _0x5eb7f9=$dataWeapons[_0x5c73e3['id']];if(!_0x5eb7f9)continue;const _0x41050a=_0x2d21c5[_0x474a31(0x23f)](_0x5c73e3['quantity'],_0x474a31(0x266)[_0x474a31(0x23f)](_0x5eb7f9[_0x474a31(0x2a0)]),_0x5eb7f9[_0x474a31(0x316)]);_0x282664!==''?_0x282664=TextManager[_0x474a31(0x2be)]['format'](_0x282664,_0x41050a):_0x282664=_0x41050a;}return _0x282664;case _0x474a31(0x1df):_0x458d23=DataManager[_0x474a31(0x178)](_0x430dc8),_0x2d21c5=TextManager[_0x474a31(0x282)];for(const _0x35c457 of _0x458d23){if(!_0x35c457)continue;const _0x42cfac=$dataArmors[_0x35c457['id']];if(!_0x42cfac)continue;const _0x348a6b=_0x2d21c5[_0x474a31(0x23f)](_0x35c457['quantity'],'\x5cI[%1]'[_0x474a31(0x23f)](_0x42cfac[_0x474a31(0x2a0)]),_0x42cfac['name']);_0x282664!==''?_0x282664=TextManager[_0x474a31(0x2be)][_0x474a31(0x23f)](_0x282664,_0x348a6b):_0x282664=_0x348a6b;}return _0x282664;case _0x474a31(0x2b0):_0x458d23=DataManager[_0x474a31(0x2bf)](_0x430dc8);if(_0x458d23>0x0)return _0x2d21c5=TextManager['skillLearnGoldFmt'],_0x2d21c5['format'](_0x458d23,Imported['VisuMZ_0_CoreEngine']?_0x474a31(0x266)[_0x474a31(0x23f)](VisuMZ[_0x474a31(0x2bc)]['Settings'][_0x474a31(0x2fb)][_0x474a31(0x164)]):TextManager[_0x474a31(0x2dd)],TextManager['currencyUnit']);break;case _0x474a31(0x236):const _0x2e1384=VisuMZ[_0x474a31(0x246)][_0x474a31(0x1b5)](_0x430dc8,'jsLearnShowListTxt');if(VisuMZ[_0x474a31(0x246)]['JS'][_0x2e1384])return VisuMZ[_0x474a31(0x246)]['JS'][_0x2e1384][_0x474a31(0x2b7)](this,this[_0x474a31(0x174)],_0x430dc8);break;case'CP':if(Imported[_0x474a31(0x1e9)]){_0x458d23=DataManager['getSkillLearnClassPointCost'](_0x430dc8);if(_0x458d23>0x0)return _0x2d21c5=TextManager['classPointsFmt'],_0x2d21c5['format'](_0x458d23,TextManager[_0x474a31(0x1cd)],_0x474a31(0x266)[_0x474a31(0x23f)](ImageManager[_0x474a31(0x2bb)]),TextManager[_0x474a31(0x22e)]);break;}case'JP':if(Imported[_0x474a31(0x1e9)]){_0x458d23=DataManager[_0x474a31(0x29c)](_0x430dc8);if(_0x458d23>0x0)return _0x2d21c5=TextManager['jobPointsFmt'],_0x2d21c5[_0x474a31(0x23f)](_0x458d23,TextManager[_0x474a31(0x18e)],_0x474a31(0x266)[_0x474a31(0x23f)](ImageManager[_0x474a31(0x2d6)]),TextManager['jobPointsFull']);break;}}return'';};function Window_SkillLearnIngredients(){const _0x374f03=_0x19b8c2;this[_0x374f03(0x2fd)](...arguments);}Window_SkillLearnIngredients['prototype']=Object[_0x19b8c2(0x32b)](Window_Base['prototype']),Window_SkillLearnIngredients['prototype'][_0x19b8c2(0x2e7)]=Window_SkillLearnIngredients,Window_SkillLearnIngredients[_0x19b8c2(0x32d)][_0x19b8c2(0x2fd)]=function(_0x3b3455){const _0xa56f64=_0x19b8c2;Window_Base['prototype'][_0xa56f64(0x2fd)][_0xa56f64(0x2b7)](this,_0x3b3455);},Window_SkillLearnIngredients[_0x19b8c2(0x32d)][_0x19b8c2(0x185)]=function(){const _0xa7ade9=_0x19b8c2;this[_0xa7ade9(0x2d8)]['clear'](),this[_0xa7ade9(0x270)](),this[_0xa7ade9(0x175)]()?this[_0xa7ade9(0x212)]():this['drawIngredients']();},Window_SkillLearnIngredients[_0x19b8c2(0x32d)][_0x19b8c2(0x18d)]=function(_0x1e6056,_0x5b9645,_0x42b444,_0x57fd3a){const _0x26fe99=_0x19b8c2,_0x27c5f0=this[_0x26fe99(0x226)](_0x1e6056)[_0x26fe99(0x1ea)],_0x470cfe=_0x5b9645+Math[_0x26fe99(0x325)]((_0x57fd3a-_0x27c5f0)/0x2);this['drawTextEx'](_0x1e6056,_0x470cfe,_0x42b444);},Window_SkillLearnIngredients['prototype'][_0x19b8c2(0x167)]=function(_0x4942ff,_0x54d320,_0x1b569d,_0x1280de){const _0x16a861=_0x19b8c2,_0x11137f=this['textSizeEx'](_0x4942ff)[_0x16a861(0x1ea)],_0x56f726=_0x54d320+Math[_0x16a861(0x325)](_0x1280de-_0x11137f);this[_0x16a861(0x267)](_0x4942ff,_0x56f726,_0x1b569d);},Window_SkillLearnIngredients[_0x19b8c2(0x32d)][_0x19b8c2(0x175)]=function(){const _0x13f6e2=_0x19b8c2,_0x1eed33=SceneManager[_0x13f6e2(0x1fa)]['item'](),_0x1aed72=SceneManager['_scene'][_0x13f6e2(0x304)]();return _0x1aed72&&!_0x1aed72[_0x13f6e2(0x232)](_0x1eed33);},Window_SkillLearnIngredients[_0x19b8c2(0x32d)][_0x19b8c2(0x212)]=function(){const _0x304365=_0x19b8c2,_0x4c847c=SceneManager[_0x304365(0x1fa)][_0x304365(0x16b)](),_0x42383a=VisuMZ[_0x304365(0x246)][_0x304365(0x257)],_0x1b6584=_0x4c847c[_0x304365(0x160)],_0x578646=SceneManager['_scene'][_0x304365(0x304)](),_0x27df20=this[_0x304365(0x25e)](),_0x142bc6=TextManager[_0x304365(0x1e0)],_0x457c87=TextManager['skillLearnReqNotMet'];let _0x95d170=0x0,_0x21b679=0x0;const _0x3eec0a=_0x304365(0x266)[_0x304365(0x23f)](_0x4c847c[_0x304365(0x2a0)]),_0x25edc0=TextManager[_0x304365(0x32c)][_0x304365(0x23f)](_0x3eec0a,_0x4c847c['name']);this[_0x304365(0x18d)](_0x25edc0,_0x95d170,_0x21b679,this[_0x304365(0x2e3)]),_0x21b679+=Math[_0x304365(0x325)](_0x27df20*1.5);let _0x2b665c='';if(_0x1b6584[_0x304365(0x220)](_0x42383a['LearnReqLevel'])){const _0x655a97=Number(RegExp['$1']),_0x3f9152=TextManager[_0x304365(0x18f)][_0x304365(0x23f)](_0x655a97,TextManager[_0x304365(0x279)],TextManager[_0x304365(0x292)]),_0x1c61d9=_0x578646['level']>=_0x655a97?_0x142bc6:_0x457c87;_0x2b665c+=_0x1c61d9['format'](_0x3f9152)+'\x0a';}if(_0x1b6584[_0x304365(0x220)](_0x42383a[_0x304365(0x2d1)])){const _0x251921=String(RegExp['$1'])[_0x304365(0x2aa)](',')['map'](_0xa1a4c9=>_0xa1a4c9['trim']());;for(const _0x37e091 of _0x251921){let _0x5d5dac=0x0;const _0x3688d5=/^\d+$/[_0x304365(0x259)](_0x37e091);_0x3688d5?_0x5d5dac=Number(_0x37e091):_0x5d5dac=DataManager[_0x304365(0x27b)](_0x37e091);const _0x5dc75a=$dataSkills[_0x5d5dac];if(_0x5dc75a){const _0x1e7400=TextManager[_0x304365(0x330)]['format']('\x5cI[%1]'[_0x304365(0x23f)](_0x5dc75a[_0x304365(0x2a0)]),_0x5dc75a['name']),_0x45aaa9=_0x578646[_0x304365(0x252)](_0x5d5dac)?_0x142bc6:_0x457c87;_0x2b665c+=_0x45aaa9['format'](_0x1e7400)+'\x0a';}}}if(_0x1b6584[_0x304365(0x220)](_0x42383a[_0x304365(0x328)])){const _0x1f4312=String(RegExp['$1'])[_0x304365(0x2aa)](',')[_0x304365(0x302)](_0x445067=>_0x445067[_0x304365(0x201)]());;for(const _0x37bd9a of _0x1f4312){let _0x227ca7=0x0;const _0x5ce900=/^\d+$/[_0x304365(0x259)](_0x37bd9a);_0x5ce900?_0x227ca7=Number(_0x37bd9a):_0x227ca7=DataManager[_0x304365(0x27b)](_0x37bd9a);const _0x30943e=$dataSkills[_0x227ca7];if(_0x30943e){const _0x2384dc=TextManager[_0x304365(0x330)][_0x304365(0x23f)](_0x304365(0x266)[_0x304365(0x23f)](_0x30943e[_0x304365(0x2a0)]),_0x30943e['name']),_0x1b2e7b=_0x578646[_0x304365(0x252)](_0x227ca7)?_0x142bc6:_0x457c87;_0x2b665c+=_0x1b2e7b[_0x304365(0x23f)](_0x2384dc)+'\x0a';}}}if(_0x1b6584[_0x304365(0x220)](_0x42383a[_0x304365(0x2cf)])){const _0x82f412=String(RegExp['$1'])[_0x304365(0x2aa)](',')['map'](_0x5b4db9=>Number(_0x5b4db9));for(const _0x257f77 of _0x82f412){const _0x2244e0=$dataSystem[_0x304365(0x1d0)][_0x257f77],_0x1d50d1=$gameSwitches[_0x304365(0x290)](_0x257f77)?_0x142bc6:_0x457c87;_0x2b665c+=_0x1d50d1['format'](_0x2244e0)+'\x0a';}}if(_0x1b6584[_0x304365(0x220)](_0x42383a[_0x304365(0x271)])){const _0x574b90=String(RegExp['$1'])[_0x304365(0x2aa)](',')[_0x304365(0x302)](_0x4451f7=>Number(_0x4451f7));for(const _0x284aec of _0x574b90){const _0x342f34=$dataSystem[_0x304365(0x1d0)][_0x284aec],_0x68ffb1=$gameSwitches['value'](_0x284aec)?_0x142bc6:_0x457c87;_0x2b665c+=_0x68ffb1[_0x304365(0x23f)](_0x342f34)+'\x0a';}}const _0x1a9fa4=VisuMZ[_0x304365(0x246)][_0x304365(0x1b5)](_0x4c847c,'jsLearnReqDetailTxt');if(VisuMZ[_0x304365(0x246)]['JS'][_0x1a9fa4]){const _0x5dde34=VisuMZ[_0x304365(0x246)]['JS'][_0x1a9fa4][_0x304365(0x2b7)](this,_0x578646,_0x4c847c);_0x2b665c+=_0x5dde34+'\x0a';}this['drawTextExCenterAlign'](_0x2b665c,_0x95d170,_0x21b679,this[_0x304365(0x2e3)]);},Window_SkillLearnIngredients['prototype']['drawIngredients']=function(){const _0x1619b1=_0x19b8c2,_0x238ca9=SceneManager['_scene'][_0x1619b1(0x16b)](),_0xd8c200=SceneManager[_0x1619b1(0x1fa)][_0x1619b1(0x304)](),_0x2a051a=this[_0x1619b1(0x287)]();let _0x39fca0=0x0,_0xa31b3a=0x0;const _0x3399e0=this[_0x1619b1(0x25e)](),_0x4d548e=Math[_0x1619b1(0x325)](this[_0x1619b1(0x2e3)]/0x2),_0x105488=Math[_0x1619b1(0x325)](this[_0x1619b1(0x2e3)]/0x4),_0x538b8a=0x0,_0x1e5c46=_0x4d548e,_0x2008b6=_0x4d548e+_0x105488,_0x1c0210=_0x1619b1(0x266)[_0x1619b1(0x23f)](_0x238ca9[_0x1619b1(0x2a0)]),_0x109e8b=TextManager['skillLearningTitle'][_0x1619b1(0x23f)](_0x1c0210,_0x238ca9['name']);this[_0x1619b1(0x18d)](_0x109e8b,_0x39fca0,_0xa31b3a,this['innerWidth']),_0xa31b3a+=_0x3399e0,this[_0x1619b1(0x18d)](TextManager[_0x1619b1(0x168)],_0x538b8a,_0xa31b3a,_0x4d548e),this[_0x1619b1(0x18d)](TextManager[_0x1619b1(0x1c4)],_0x1e5c46,_0xa31b3a,_0x105488),this[_0x1619b1(0x18d)](TextManager[_0x1619b1(0x284)],_0x2008b6,_0xa31b3a,_0x105488),_0xa31b3a+=_0x3399e0;const _0x568ff3=_0x538b8a+this[_0x1619b1(0x211)]();for(const _0x1db594 of _0x2a051a){this[_0x1619b1(0x270)]();let _0x447c85='',_0x181db3=0x0,_0x306fc7=0x0,_0x1bcd58='';switch(_0x1db594[_0x1619b1(0x1b9)]()[_0x1619b1(0x201)]()){case'AP':_0x181db3=DataManager[_0x1619b1(0x1f5)](_0x238ca9);if(_0x181db3<=0x0)continue;this[_0x1619b1(0x283)](_0x181db3,_0x1e5c46,_0xa31b3a,_0x105488,_0x1619b1(0x230)),_0x447c85=_0x1619b1(0x2ed)[_0x1619b1(0x23f)](ImageManager[_0x1619b1(0x2a7)],TextManager[_0x1619b1(0x33c)]),this['drawTextEx'](_0x447c85,_0x568ff3,_0xa31b3a),_0x306fc7=_0xd8c200[_0x1619b1(0x242)](),this['drawAbilityPoints'](_0x306fc7,_0x2008b6,_0xa31b3a,_0x105488-this[_0x1619b1(0x211)](),_0x1619b1(0x230));break;case'SP':_0x181db3=DataManager['getSkillLearnSkillPointCost'](_0x238ca9);if(_0x181db3<=0x0)continue;this[_0x1619b1(0x234)](_0x181db3,_0x1e5c46,_0xa31b3a,_0x105488,_0x1619b1(0x230)),_0x447c85=_0x1619b1(0x2ed)[_0x1619b1(0x23f)](ImageManager[_0x1619b1(0x288)],TextManager[_0x1619b1(0x244)]),this[_0x1619b1(0x267)](_0x447c85,_0x568ff3,_0xa31b3a),_0x306fc7=_0xd8c200['getSkillPoints'](),this['drawSkillPoints'](_0x306fc7,_0x2008b6,_0xa31b3a,_0x105488-this['itemPadding'](),_0x1619b1(0x230));break;case _0x1619b1(0x2b0):_0x181db3=DataManager[_0x1619b1(0x2bf)](_0x238ca9);if(_0x181db3<=0x0)continue;this[_0x1619b1(0x29a)](_0x181db3,TextManager[_0x1619b1(0x2dd)],_0x1e5c46,_0xa31b3a,_0x105488);const _0x2d4a2c=Imported[_0x1619b1(0x310)]?_0x1619b1(0x266)['format'](VisuMZ[_0x1619b1(0x2bc)]['Settings'][_0x1619b1(0x2fb)]['GoldIcon']):TextManager['currencyUnit'];_0x447c85=_0x1619b1(0x1a2)[_0x1619b1(0x23f)](_0x2d4a2c,TextManager[_0x1619b1(0x2dd)]),this[_0x1619b1(0x267)](_0x447c85,_0x568ff3,_0xa31b3a),_0x306fc7=$gameParty[_0x1619b1(0x1ed)](),this[_0x1619b1(0x29a)](_0x306fc7,TextManager[_0x1619b1(0x2dd)],_0x2008b6,_0xa31b3a,_0x105488-this[_0x1619b1(0x211)]());break;case _0x1619b1(0x245):const _0x299faf=DataManager[_0x1619b1(0x194)](_0x238ca9);if(_0x299faf['length']<=0x0)continue;for(const _0x576dc7 of _0x299faf){if(!_0x576dc7)continue;const _0xcebb7b=$dataItems[_0x576dc7['id']];_0x1bcd58=TextManager[_0x1619b1(0x31d)],this[_0x1619b1(0x2ac)](_0xcebb7b,_0x568ff3,_0xa31b3a,_0x4d548e-_0x568ff3),_0x447c85=_0x1bcd58[_0x1619b1(0x23f)](_0x576dc7[_0x1619b1(0x179)],_0x1619b1(0x266)[_0x1619b1(0x23f)](_0xcebb7b['iconIndex']),_0xcebb7b[_0x1619b1(0x316)]),this[_0x1619b1(0x167)](_0x447c85,_0x1e5c46,_0xa31b3a,_0x105488),_0x447c85=_0x1bcd58['format']($gameParty[_0x1619b1(0x338)](_0xcebb7b),_0x1619b1(0x266)['format'](_0xcebb7b['iconIndex']),_0xcebb7b[_0x1619b1(0x316)]),this[_0x1619b1(0x167)](_0x447c85,_0x2008b6,_0xa31b3a,_0x105488-this['itemPadding']()),_0xa31b3a+=_0x3399e0;if(_0xa31b3a+_0x3399e0>this[_0x1619b1(0x26e)])return;}continue;case'WEAPON':const _0x536e90=DataManager[_0x1619b1(0x280)](_0x238ca9);if(_0x536e90['length']<=0x0)continue;for(const _0x102c8c of _0x536e90){if(!_0x102c8c)continue;const _0x6a4238=$dataWeapons[_0x102c8c['id']];_0x1bcd58=TextManager[_0x1619b1(0x2ba)],this[_0x1619b1(0x2ac)](_0x6a4238,_0x568ff3,_0xa31b3a,_0x4d548e-_0x568ff3),_0x447c85=_0x1bcd58[_0x1619b1(0x23f)](_0x102c8c[_0x1619b1(0x179)],_0x1619b1(0x266)[_0x1619b1(0x23f)](_0x6a4238[_0x1619b1(0x2a0)]),_0x6a4238['name']),this[_0x1619b1(0x167)](_0x447c85,_0x1e5c46,_0xa31b3a,_0x105488),_0x447c85=_0x1bcd58[_0x1619b1(0x23f)]($gameParty[_0x1619b1(0x338)](_0x6a4238),'\x5cI[%1]'['format'](_0x6a4238['iconIndex']),_0x6a4238[_0x1619b1(0x316)]),this[_0x1619b1(0x167)](_0x447c85,_0x2008b6,_0xa31b3a,_0x105488-this[_0x1619b1(0x211)]()),_0xa31b3a+=_0x3399e0;if(_0xa31b3a+_0x3399e0>this[_0x1619b1(0x26e)])return;}continue;case _0x1619b1(0x1df):const _0xafabfc=DataManager[_0x1619b1(0x178)](_0x238ca9);if(_0xafabfc['length']<=0x0)continue;for(const _0x312454 of _0xafabfc){if(!_0x312454)continue;const _0x5a4a31=$dataArmors[_0x312454['id']];_0x1bcd58=TextManager[_0x1619b1(0x282)],this['drawItemName'](_0x5a4a31,_0x568ff3,_0xa31b3a,_0x4d548e-_0x568ff3),_0x447c85=_0x1bcd58[_0x1619b1(0x23f)](_0x312454[_0x1619b1(0x179)],_0x1619b1(0x266)[_0x1619b1(0x23f)](_0x5a4a31[_0x1619b1(0x2a0)]),_0x5a4a31['name']),this['drawTextExRightAlign'](_0x447c85,_0x1e5c46,_0xa31b3a,_0x105488),_0x447c85=_0x1bcd58[_0x1619b1(0x23f)]($gameParty['numItems'](_0x5a4a31),_0x1619b1(0x266)[_0x1619b1(0x23f)](_0x5a4a31['iconIndex']),_0x5a4a31['name']),this[_0x1619b1(0x167)](_0x447c85,_0x2008b6,_0xa31b3a,_0x105488-this[_0x1619b1(0x211)]()),_0xa31b3a+=_0x3399e0;if(_0xa31b3a+_0x3399e0>this[_0x1619b1(0x26e)])return;}continue;case _0x1619b1(0x236):const _0x369476=VisuMZ[_0x1619b1(0x246)][_0x1619b1(0x1b5)](_0x238ca9,_0x1619b1(0x320));if(VisuMZ[_0x1619b1(0x246)]['JS'][_0x369476])_0x447c85=VisuMZ[_0x1619b1(0x246)]['JS'][_0x369476][_0x1619b1(0x2b7)](this,_0xd8c200,_0x238ca9),this[_0x1619b1(0x267)](_0x447c85,_0x568ff3,_0xa31b3a);else continue;break;case'CP':if(Imported[_0x1619b1(0x1e9)]){_0x181db3=DataManager[_0x1619b1(0x331)](_0x238ca9);if(_0x181db3<=0x0)continue;this[_0x1619b1(0x24a)](_0x181db3,_0x1e5c46,_0xa31b3a,_0x105488,_0x1619b1(0x230)),_0x447c85=_0x1619b1(0x2ed)[_0x1619b1(0x23f)](ImageManager['classPointsIcon'],TextManager[_0x1619b1(0x22e)]),this[_0x1619b1(0x267)](_0x447c85,_0x568ff3,_0xa31b3a),_0x306fc7=_0xd8c200['getClassPoints'](),this[_0x1619b1(0x24a)](_0x306fc7,_0x2008b6,_0xa31b3a,_0x105488-this['itemPadding'](),_0x1619b1(0x230));}break;case'JP':if(Imported[_0x1619b1(0x1e9)]){_0x181db3=DataManager['getSkillLearnJobPointCost'](_0x238ca9);if(_0x181db3<=0x0)continue;this[_0x1619b1(0x306)](_0x181db3,_0x1e5c46,_0xa31b3a,_0x105488,'right'),_0x447c85=_0x1619b1(0x2ed)[_0x1619b1(0x23f)](ImageManager[_0x1619b1(0x2d6)],TextManager[_0x1619b1(0x1f6)]),this['drawTextEx'](_0x447c85,_0x568ff3,_0xa31b3a),_0x306fc7=_0xd8c200[_0x1619b1(0x180)](),this[_0x1619b1(0x306)](_0x306fc7,_0x2008b6,_0xa31b3a,_0x105488-this[_0x1619b1(0x211)](),_0x1619b1(0x230));}break;default:continue;}_0xa31b3a+=_0x3399e0;if(_0xa31b3a+_0x3399e0>this[_0x1619b1(0x26e)])return;}},Window_SkillLearnIngredients[_0x19b8c2(0x32d)][_0x19b8c2(0x287)]=function(){const _0x4bd9fa=_0x19b8c2,_0x5ae97f=JsonEx[_0x4bd9fa(0x170)](VisuMZ['SkillLearnSystem']['Settings']['General'][_0x4bd9fa(0x1ac)]);return _0x5ae97f[_0x4bd9fa(0x327)](_0x4bd9fa(0x33d)),_0x5ae97f;};function Window_SkillLearnConfirm(){const _0x17a6ff=_0x19b8c2;this[_0x17a6ff(0x2fd)](...arguments);}Window_SkillLearnConfirm[_0x19b8c2(0x32d)]=Object[_0x19b8c2(0x32b)](Window_HorzCommand[_0x19b8c2(0x32d)]),Window_SkillLearnConfirm['prototype']['constructor']=Window_SkillLearnConfirm,Window_SkillLearnConfirm[_0x19b8c2(0x32d)]['initialize']=function(_0x4b74c6){const _0x16663f=_0x19b8c2;Window_HorzCommand[_0x16663f(0x32d)][_0x16663f(0x2fd)][_0x16663f(0x2b7)](this,_0x4b74c6);},Window_SkillLearnConfirm[_0x19b8c2(0x32d)][_0x19b8c2(0x1cf)]=function(){return 0x2;},Window_SkillLearnConfirm['prototype'][_0x19b8c2(0x221)]=function(){return this['innerHeight'];},Window_SkillLearnConfirm[_0x19b8c2(0x32d)]['makeCommandList']=function(){const _0x273f1f=_0x19b8c2;this[_0x273f1f(0x26a)](TextManager[_0x273f1f(0x324)],'ok',this[_0x273f1f(0x2f9)]()),this['addCommand'](TextManager[_0x273f1f(0x261)],_0x273f1f(0x1cc));},Window_SkillLearnConfirm['prototype'][_0x19b8c2(0x2f9)]=function(){const _0x44d447=_0x19b8c2,_0x51506e=SceneManager['_scene'];if(!_0x51506e)return![];const _0x3ab8b8=_0x51506e[_0x44d447(0x304)]();if(!_0x3ab8b8)return![];const _0x57862a=_0x51506e[_0x44d447(0x16b)]();if(!_0x57862a)return![];if(!_0x3ab8b8[_0x44d447(0x232)](_0x57862a))return![];return _0x3ab8b8[_0x44d447(0x19e)](_0x57862a);},Window_SkillLearnConfirm[_0x19b8c2(0x32d)][_0x19b8c2(0x1a6)]=function(_0x1d6071){const _0x1af177=_0x19b8c2,_0x1039f7=this[_0x1af177(0x189)](_0x1d6071);this[_0x1af177(0x1cb)](),this[_0x1af177(0x2eb)](this[_0x1af177(0x2ec)](_0x1d6071));const _0x41974f=this[_0x1af177(0x34d)](_0x1d6071),_0x36e57b=this['textSizeEx'](_0x41974f)[_0x1af177(0x1ea)];_0x1039f7['x']+=Math[_0x1af177(0x325)]((_0x1039f7[_0x1af177(0x1ea)]-_0x36e57b)/0x2),this[_0x1af177(0x267)](_0x41974f,_0x1039f7['x'],_0x1039f7['y'],_0x36e57b);},Window_SkillLearnConfirm[_0x19b8c2(0x32d)]['playOkSound']=function(){const _0x559cb2=_0x19b8c2;if(this[_0x559cb2(0x19b)]()==='ok'){}else Window_HorzCommand[_0x559cb2(0x32d)][_0x559cb2(0x183)][_0x559cb2(0x2b7)](this);};