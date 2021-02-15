//=============================================================================
// VisuStella MZ - Quest Journal System
// VisuMZ_2_QuestSystem.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_2_QuestSystem = true;

var VisuMZ = VisuMZ || {};
VisuMZ.QuestSystem = VisuMZ.QuestSystem || {};
VisuMZ.QuestSystem.version = 1.11;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 2] [Version 1.11] [QuestSystem]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Quest_Journal_System_VisuStella_MZ
 * @orderAfter VisuMZ_0_CoreEngine
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * A quest journal is a very important tool provided by game developers for the
 * players. It lists various quests, missions, and objectives that the player
 * can pursue in order to progress further into the game. This can be helpful
 * in reminding the player what needs to be done in the event the player can
 * forget what things there are to do in a vast and large RPG world.
 *
 * This plugin places a quest journal system into your RPG Maker MZ game. You
 * can set up how the quest journal appears, move its windows around and/or
 * reshape them to fit your game.
 *
 * You can adjust the quest's title, display a difficulty level, remind the
 * player who the quest is from, where that quest is from, various dynamic
 * descriptions explaining the quest, a list of objectives to make, a list of
 * rewards that will be given to the player once the quest is complete, and any
 * subtext footnotes and quotes you may wish to insert into each quest.
 *
 * *NOTE*
 *
 * Keep in mind that while this plugin does enable a quest journal system into
 * your game, this plugin will NOT automate it. If you have a quest enabled, it
 * is still up to you to add the quest properly into the journal, set its many
 * objectives, when the other objectives appear, what the rewards are, and then
 * giving out the rewards yourself manually. The purpose of this plugin is to
 * simply serve as a visual record for your player to see what quests have been
 * handed down to him or her.
 *
 * Features include all (but not limited to) the following:
 * 
 * * Unlimited quest categories.
 * * Unlimited quest slots.
 * * Full control over what appears in the quest journal system and how it
 *   appears in-game.
 * * Update quest descriptions, objectives, rewards, subtexts, etc. mid-game
 *   through the use of Plugin Commands.
 * * A dedicated quest menu that's accessible from the Main Menu or by
 *   Plugin Command call.
 * * A quest tracker that appears in the map scene to keep the player updated
 *   on how far they are progressing in their current quest.
 * * Options for the player to show/hide the quest tracker and reposition its
 *   location on the screen.
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
 * Explanation - Categories and Quests
 * ============================================================================
 *
 * The following is an explanation on the differences between Categories and
 * Quests for the usage of this plugin.
 *
 * ---
 *
 * Categories
 *
 * Quest Categories separate the quest types in your game. These can be used to
 * help players differentiate which are story-driven quests, which are optional
 * quests, recurring quests, etc. These have limited settings, but serve as
 * containers for quests that fall under its category.
 *
 * ---
 *
 * Plugin Parameters > Categories > Category Name:
 *
 * This is the category's name. It appears however you type it using text
 * codes, allowing you to color-code it if needed.
 *
 * ---
 *
 * Plugin Parameters > Categories > Quests:
 * 
 * These contain the quests that are listed under this category. Enter in as
 * many as needed/desired.
 *
 * ---
 *
 * Quests
 *
 * Each Quest Category will contain a list of quests that can appear in-game.
 * These individual quests make up the meat and bones of the Quest System and
 * will serve to relay information to the player on what he/she needs to do in
 * order to make progress in your game.
 *
 * ---
 *
 * Plugin Parameters > General > Log Window > Quest Log
 *
 * This determines how the template used by the quest logs to parse information
 * regarding the quests themselves. By default, they are formatted like such:
 *
 * ---
 *
 * \{[[Title]]\}
 * \c[4]Level:\c[0] [[Difficulty]]
 * \c[4]From:\c[0] [[From]]
 * \c[4]Location:\c[0] [[Location]]
 * 
 * \c[4]Description:\c[0]
 * [[Description]]
 * 
 * \c[4]Objectives:\c[0]
 * [[Objectives]]
 * 
 * \c[4]Rewards:\c[0]
 * [[Rewards]]
 * 
 * [[Subtext]]
 * 
 * [[Quote]]
 *
 * ---
 * 
 * Each [[Marker]] is to be replaced by the quest date related to them.
 *
 * - [[Title]] - Inserts the title of the quest.
 * 
 * - [[RawTitle]] - Inserts the title of the quest without any text codes
 *   removed. Keep in mind that icons do NOT resize based on the text size.
 *
 * - [[Difficulty]] - Inserts the quest difficulty text.
 *
 * - [[From]] - Inserts the quest origin text.
 *
 * - [[Location]] - Inserts the quest location text.
 *
 * - [[Description]] - Inserts the currently active quest description.
 *   - The quest description can change depending on which Description ID
 *     is currently active for that quest.
 *
 * - [[Objectives]] - Inserts a list of the visible quest objectives.
 *   - The quest objectives visible to the player will be determined by
 *     the quest's Visible Objectives settings and any Plugin Commands
 *     used to alter which objectives are visible and what state they are
 *     currently in (known, completed, failed).
 *
 * - [[Rewards]] - Inserts a list of visible quest rewards.
 *   - The quest rewards visible to the player will be determined by the
 *     quest's Visible Rewards settings and any Plugin Commands used to
 *     alter which rewards are visible and what state they are currently
 *     in (known, claimed, denied).
 *
 * - [[Subtext]] - Inserts the currently active quest subtext.
 *   - The quest subtext can change depending on which Subtext ID is
 *     currently active for that quest.
 *
 * - [[Quote]] - Inserts the currently active quest quote.
 *   - The quest quote can change depending on which Quote ID is
 *     currently active for that quest.
 *
 * ---
 *
 * Each of the following aspects of the quests can be changed through the usage
 * of Plugin Commands:
 *
 * - Description
 * - Objectives
 * - Rewards
 * - Subtext
 * - Quote
 *
 * The following are the Plugin Commands that can change them:
 *
 * - Quest: Description Change
 * - Quest: Objectives Change
 * - Quest: Rewards Change
 * - Quest: Subtext Change
 * - Quest: Quote Change
 *
 * ---
 *
 * More information will be explained in their respective Plugin Parameter
 * sections further down in the help file.
 *
 * ============================================================================
 * Control Variable and Conditional Branch Usage
 * ============================================================================
 * 
 * For those wanting to use Control Variable event commands and/or Conditional
 * Branch event commands with the Quest Journal System plugin, you can insert
 * the following functions into the "Script" input fields of the respective
 * event commands.
 * 
 * These are new JavaScript functions added through this plugin and will not
 * work without it.
 * 
 * ---
 * 
 * === Control Variable Script Functions ===
 * 
 * These are newly added JavaScript functions that return a numeric value.
 * The functions are best used with the Control Variable script input field.
 * 
 * ---
 * 
 * totalQuestsAvailable()
 * 
 * - Returns the total number of quests available for the player.
 * 
 * ---
 * 
 * totalQuestsCompleted()
 * 
 * - Returns the total number of quests completed by the player.
 * 
 * ---
 * 
 * totalQuestsFailed()
 * 
 * - Returns the total number of quests failed by the player.
 * 
 * ---
 * 
 * totalQuestsRevealed()
 * 
 * - Returns the total number of quests visible to the player.
 * 
 * ---
 * 
 * totalQuestsInGame()
 * 
 * - Returns the total number of quests available in-game.
 * 
 * ---
 * 
 * getQuestDescriptionIndex(questKey)
 * 
 * - Returns the select quest's current description index ID.
 * - Replace 'questKey' with the 'Quest ID Key' of the desired quest to gather
 *   data from. You can find out what the 'Quest ID Key' is in the plugin's
 *   parameters > Quest Categories > target category > Quests > selected quest
 *   > Quest ID Key.
 * - Insert quotes around the 'questKey' to ensure it works.
 * - Example: getQuestDescriptionIndex('Welcome')
 * 
 * ---
 * 
 * totalVisibleQuestObjectives(questKey)
 * 
 * - Returns the total number of visible quest objectives for selected quest.
 * - Replace 'questKey' with the 'Quest ID Key' of the desired quest to gather
 *   data from. You can find out what the 'Quest ID Key' is in the plugin's
 *   parameters > Quest Categories > target category > Quests > selected quest
 *   > Quest ID Key.
 * - Insert quotes around the 'questKey' to ensure it works.
 * - Example: totalVisibleQuestObjectives('Welcome')
 * 
 * ---
 * 
 * totalQuestObjectives(questKey)
 * 
 * - Returns the total number of quest objectives for selected quest.
 * - Replace 'questKey' with the 'Quest ID Key' of the desired quest to gather
 *   data from. You can find out what the 'Quest ID Key' is in the plugin's
 *   parameters > Quest Categories > target category > Quests > selected quest
 *   > Quest ID Key.
 * - Insert quotes around the 'questKey' to ensure it works.
 * - Example: totalQuestObjectives('Welcome')
 * 
 * ---
 * 
 * totalVisibleQuestRewards(questKey)
 * 
 * - Returns the total number of visible quest rewards for selected quest.
 * - Replace 'questKey' with the 'Quest ID Key' of the desired quest to gather
 *   data from. You can find out what the 'Quest ID Key' is in the plugin's
 *   parameters > Quest Categories > target category > Quests > selected quest
 *   > Quest ID Key.
 * - Insert quotes around the 'questKey' to ensure it works.
 * - Example: totalVisibleQuestRewards('Welcome')
 * 
 * ---
 * 
 * totalQuestRewards(questKey)
 * 
 * - Returns the total number of quest rewards for selected quest.
 * - Replace 'questKey' with the 'Quest ID Key' of the desired quest to gather
 *   data from. You can find out what the 'Quest ID Key' is in the plugin's
 *   parameters > Quest Categories > target category > Quests > selected quest
 *   > Quest ID Key.
 * - Insert quotes around the 'questKey' to ensure it works.
 * - Example: totalQuestRewards('Welcome')
 * 
 * ---
 * 
 * getQuestSubtextIndex(questKey)
 * 
 * - Returns the select quest's current subtext index ID.
 * - Replace 'questKey' with the 'Quest ID Key' of the desired quest to gather
 *   data from. You can find out what the 'Quest ID Key' is in the plugin's
 *   parameters > Quest Categories > target category > Quests > selected quest
 *   > Quest ID Key.
 * - Insert quotes around the 'questKey' to ensure it works.
 * - Example: getQuestSubtextIndex('Welcome')
 * 
 * ---
 * 
 * getQuestQuoteIndex(questKey)
 * 
 * - Returns the select quest's current subtext index ID.
 * - Replace 'questKey' with the 'Quest ID Key' of the desired quest to gather
 *   data from. You can find out what the 'Quest ID Key' is in the plugin's
 *   parameters > Quest Categories > target category > Quests > selected quest
 *   > Quest ID Key.
 * - Insert quotes around the 'questKey' to ensure it works.
 * - Example: getQuestQuoteIndex('Welcome')
 * 
 * ---
 * 
 * === Conditional Branch Script Functions ===
 * 
 * These are newly added JavaScript functions that return a true/false value.
 * The functions are best used with the Conditional Branch script input field.
 * 
 * ---
 * 
 * isQuestObjectiveCompleted(questKey, objectiveID)
 * 
 * - Returns a true/false value depending on the selected quest's objective
 *   and if it is completed.
 * - Replace 'questKey' with the 'Quest ID Key' of the desired quest to gather
 *   data from. You can find out what the 'Quest ID Key' is in the plugin's
 *   parameters > Quest Categories > target category > Quests > selected quest
 *   > Quest ID Key.
 * - Insert quotes around the 'questKey' to ensure it works.
 * - Replace 'objectiveID' with the numeric ID of the quest objective you want
 *   to check.
 * - Example: isQuestObjectiveCompleted('Welcome', 1)
 * 
 * ---
 * 
 * isQuestObjectiveFailed(questKey, objectiveID)
 * 
 * - Returns a true/false value depending on the selected quest's objective
 *   and if it is failed.
 * - Replace 'questKey' with the 'Quest ID Key' of the desired quest to gather
 *   data from. You can find out what the 'Quest ID Key' is in the plugin's
 *   parameters > Quest Categories > target category > Quests > selected quest
 *   > Quest ID Key.
 * - Insert quotes around the 'questKey' to ensure it works.
 * - Replace 'objectiveID' with the numeric ID of the quest objective you want
 *   to check.
 * - Example: isQuestObjectiveFailed('Welcome', 1)
 * 
 * ---
 * 
 * isQuestObjectiveUncleared(questKey, objectiveID)
 * 
 * - Returns a true/false value depending on the selected quest's objective
 *   and if it is uncleared.
 * - Replace 'questKey' with the 'Quest ID Key' of the desired quest to gather
 *   data from. You can find out what the 'Quest ID Key' is in the plugin's
 *   parameters > Quest Categories > target category > Quests > selected quest
 *   > Quest ID Key.
 * - Insert quotes around the 'questKey' to ensure it works.
 * - Replace 'objectiveID' with the numeric ID of the quest objective you want
 *   to check.
 * - Example: isQuestObjectiveUncleared('Welcome', 1)
 * 
 * ---
 * 
 * isQuestRewardClaimed(questKey, rewardID)
 * 
 * - Returns a true/false value depending on the selected quest's reward
 *   and if it is claimed.
 * - Replace 'questKey' with the 'Quest ID Key' of the desired quest to gather
 *   data from. You can find out what the 'Quest ID Key' is in the plugin's
 *   parameters > Quest Categories > target category > Quests > selected quest
 *   > Quest ID Key.
 * - Insert quotes around the 'questKey' to ensure it works.
 * - Replace 'objectiveID' with the numeric ID of the quest reward you want
 *   to check.
 * - Example: isQuestRewardClaimed('Welcome', 1)
 * 
 * ---
 * 
 * isQuestRewardDenied(questKey, rewardID)
 * 
 * - Returns a true/false value depending on the selected quest's reward
 *   and if it is denied.
 * - Replace 'questKey' with the 'Quest ID Key' of the desired quest to gather
 *   data from. You can find out what the 'Quest ID Key' is in the plugin's
 *   parameters > Quest Categories > target category > Quests > selected quest
 *   > Quest ID Key.
 * - Insert quotes around the 'questKey' to ensure it works.
 * - Replace 'objectiveID' with the numeric ID of the quest reward you want
 *   to check.
 * - Example: isQuestRewardDenied('Welcome', 1)
 * 
 * ---
 * 
 * isQuestRewardUnclaimed(questKey, rewardID)
 * 
 * - Returns a true/false value depending on the selected quest's reward
 *   and if it is unclaimed.
 * - Replace 'questKey' with the 'Quest ID Key' of the desired quest to gather
 *   data from. You can find out what the 'Quest ID Key' is in the plugin's
 *   parameters > Quest Categories > target category > Quests > selected quest
 *   > Quest ID Key.
 * - Insert quotes around the 'questKey' to ensure it works.
 * - Replace 'objectiveID' with the numeric ID of the quest reward you want
 *   to check.
 * - Example: isQuestRewardUnclaimed('Welcome', 1)
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
 * === Action Tracking-Related Notetags ===
 * 
 * ---
 *
 * <Variable id On Use: +x>
 * <Variable id On Use: -x>
 *
 * - Used for: Skill, Item Notetags
 * - Whenever any actor uses this specific skill or item, increase or decrease
 *   the target variable by a certain amount.
 * - Replace 'id' with the Variable ID you wish to alter.
 * - Replace 'x' with the increase or decrease in value for the variable.
 *
 * ---
 * 
 * === Enemy Tracking-Related Notetags ===
 * 
 * ---
 *
 * <Variable id On Death: +x>
 * <Variable id On Death: -x>
 *
 * - Used for: Enemy Notetags
 * - Whenever this specific enemy dies, increase or decrease the target
 *   variable by a certain amount.
 * - Replace 'id' with the Variable ID you wish to alter.
 * - Replace 'x' with the increase or decrease in value for the variable.
 *
 * ---
 * 
 * === Item Tracking-Related Notetags ===
 * 
 * ---
 *
 * <Variable id On Gain: +x>
 * <Variable id On Gain: -x>
 *
 * - Used Item, Weapon, Armor Notetags
 * - Whenever the party gains the specific item, weapon, or armor, increase or
 *   decrease the target variable by a certai amount.
 * - Replace 'id' with the Variable ID you wish to alter.
 * - Replace 'x' with the increase or decrease in value for the variable.
 * 
 * ---
 *
 * <Variable id On Lose: +x>
 * <Variable id On Lose: -x>
 *
 * - Used Item, Weapon, Armor Notetags
 * - Whenever the party loses the specific item, weapon, or armor, increase or
 *   decrease the target variable by a certai amount.
 * - Replace 'id' with the Variable ID you wish to alter.
 * - Replace 'x' with the increase or decrease in value for the variable.
 *
 * ---
 *
 * <Track With Variable id>
 *
 * - Used Item, Weapon, Armor Notetags
 * - Whenever there is a change made to the specific item, weapon, or armor,
 *   set the value of the target variable to the number of items owned.
 * - Replace 'id' with the Variable ID you wish to alter.
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
 * === Quest Plugin Commands ===
 * 
 * ---
 *
 * Quest: Add/Complete/Fail/Remove
 * - Adds quest(s) to be known/completed/failed.
 * - Or removes them.
 *
 *   Quest Keys:
 *   - Insert the quest key(s) here.
 *   - Each quest key must be unique.
 *
 *   Status:
 *   - Change the status to this.
 *     - Add to Known
 *     - Add to Completed
 *     - Add to Failed
 *     - Remove from All
 *
 * ---
 *
 * Quest: Description Change
 * - Changes the description of the quest(s) to a ID.
 *
 *   Quest Keys:
 *   - Insert the quest key(s) here.
 *   - Each quest key must be unique.
 *
 *   Description ID:
 *   - Change the description of the quest(s) to a different ID.
 *   - You may use JavaScript code.
 *
 * ---
 *
 * Quest: Objectives Change
 * - Changes the objective(s) status of the quest(s).
 *
 *   Quest Keys:
 *   - Insert the quest key(s) here.
 *   - Each quest key must be unique.
 *
 *   Objective ID(s):
 *   - Select the objective ID(s) to change.
 *   - You may use JavaScript code.
 *
 *   Status:
 *   - Change the status of the objective(s) to this.
 *     - Show Objective(s)
 *     - Complete Objective(s)
 *     - Fail Objective(s)
 *     - Remove Objective(s)
 *
 * ---
 *
 * Quest: Quote Change
 * - Changes the quote of the quest(s) to a ID.
 *
 *   Quest Keys:
 *   - Insert the quest key(s) here.
 *   - Each quest key must be unique.
 *
 *   Subtext ID:
 *   - Change the quote of the quest(s) to a different ID.
 *   - You may use JavaScript code.
 *
 * ---
 *
 * Quest: Rewards Change
 * - Changes the reward(s) status of the quest(s).
 *
 *   Quest Keys:
 *   - Insert the quest key(s) here.
 *   - Each quest key must be unique.
 *
 *   Reward ID(s):
 *   - Select the reward ID(s) to change.
 *   - You may use JavaScript code.
 *
 *   Status:
 *   - Change the status of the reward(s) to this.
 *     - Show Reward(s)
 *     - Claim Reward(s)
 *     - Deny Reward(s)
 *     - Remove Reward(s)
 *
 * ---
 *
 * Quest: Subtext Change
 * - Changes the subtext of the quest(s) to a ID.
 *
 *   Quest Keys:
 *   - Insert the quest key(s) here.
 *   - Each quest key must be unique.
 *
 *   Subtext ID:
 *   - Change the subtext of the quest(s) to a different ID.
 *   - You may use JavaScript code.
 *
 * ---
 * 
 * === Tracker Plugin Commands ===
 * 
 * ---
 *
 * Tracker: Change Quest
 * - Changes the tracked quest.
 *
 *   Quest Key:
 *   - Insert the quest key here.
 *
 * ---
 *
 * Tracker: Refresh Window
 * - Refreshes the quest tracker window.
 *
 * ---
 *
 * Tracker: Show/Hide Window
 * - Can forcefully hide window.
 * - Showing will depend on the player's Options setting.
 *
 *   Show/Hide?:
 *   - Shows/hides the tracker window on the map.
 *
 * ---
 * 
 * === System Plugin Commands ===
 * 
 * ---
 *
 * System: Call Scene_Quest
 * - Opens Scene_Quest for the player.
 * - Does not work in battle.
 *
 * ---
 *
 * System: Enable Quests in Menu?
 * - Enables/disables quest menu inside the main menu.
 *
 *   Enable/Disable?:
 *   - Enables/disables quest menu inside the main menu.
 *
 * ---
 *
 * System: Show Quests in Menu?
 * - Shows/hides quest menu inside the main menu.
 *
 *   Show/Hide?:
 *   - Shows/hides quest menu inside the main menu.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: General Settings
 * ============================================================================
 *
 * The general settings determine various aspects of the Quest System plugin
 * from the quests that appear at the start of the game to how it's displayed
 * inside menus.
 *
 * ---
 *
 * Starting Quests
 * 
 *   Known Quests:
 *   - Which quests are known at the start of the game?
 *   - Insert their keys here.
 * 
 *   Completed Quests:
 *   - Which quests are completed at the start of the game?
 *   - Insert their keys here.
 * 
 *   Failed Quests:
 *   - Which quests are failed at the start of the game?
 *   - Insert their keys here.
 * 
 *   Tracked Quest:
 *   - Which quest is tracked at the start of the game?
 *
 * ---
 *
 * Scene_Quest
 *
 * ---
 * 
 * Scene_Quest > Background Settings:
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
 * Scene_Quest > Vocab
 *
 * ---
 * 
 * Scene_Quest > Vocab > Command Window
 * 
 *   Command: Known:
 *   - Text used to display known quests.
 *
 *   Command: Completed:
 *   - Text used to display completed quests.
 * 
 *   Command: Failed:
 *   - Text used to display failed quests.
 *
 * ---
 *
 * Scene_Quest > Vocab > Label Window
 * 
 *   Empty Title:
 *   - Text displayed in the Label Window when no quest is selected.
 *
 * ---
 *
 * Scene_Quest > Vocab > List Window
 * 
 *   Open Categories:
 *   - Text format for an open category.
 *   - %1 - Category Name, %2 - Quest Amount
 * 
 *   Closed Categories:
 *   - Text format for a closed category.
 *   - %1 - Category Name, %2 - Quest Amount
 * 
 *   No Quest Listed:
 *   - Text when no quest is listed.
 * 
 *   Tracked Quest:
 *   - Text format for a tracked quest.
 *   - %1 - Tracked Quest's Name
 *
 * ---
 *
 * Scene_Quest > Vocab > Log Window
 * 
 *   Empty Message:
 *   - Text displayed when no quest is selected.
 *
 *     JS: On Load:
 *     - Runs code upon making the empty message.
 *     - Useful for setting up variables.
 * 
 *   Quest Log:
 *   - Text format for Quest Log Window.
 *   - Instructions:
 *     - Insert the [[Keyword]] marks in the text where you want certain parts
 *       of the quest to appear.
 *
 *       - [[Title]] - Inserts the title of the quest.
 *
 *       - [[Difficulty]] - Inserts the quest difficulty text.
 *
 *       - [[From]] - Inserts the quest origin text.
 *
 *       - [[Location]] - Inserts the quest location text.
 *
 *       - [[Description]] - Inserts the currently active quest description.
 *         - The quest description can change depending on which Description ID
 *           is currently active for that quest.
 *
 *       - [[Objectives]] - Inserts a list of the visible quest objectives.
 *         - The quest objectives visible to the player will be determined by
 *           the quest's Visible Objectives settings and any Plugin Commands
 *           used to alter which objectives are visible and what state they are
 *           currently in (known, completed, failed).
 *
 *       - [[Rewards]] - Inserts a list of visible quest rewards.
 *         - The quest rewards visible to the player will be determined by the
 *           quest's Visible Rewards settings and any Plugin Commands used to
 *           alter which rewards are visible and what state they are currently
 *           in (known, claimed, denied).
 *
 *       - [[Subtext]] - Inserts the currently active quest subtext.
 *         - The quest subtext can change depending on which Subtext ID is
 *           currently active for that quest.
 *
 *       - [[Quote]] - Inserts the currently active quest quote.
 *         - The quest quote can change depending on which Quote ID is
 *           currently active for that quest.
 * 
 *   Objective (Known):
 *   - Text format for known objectives.
 *   - %1 - Objective Text
 * 
 *   Objective (Done):
 *   - Text format for complete objectives.
 *   - %1 - Objective Text
 * 
 *   Objective (Failed):
 *   - Text format for failed objectives.
 *   - %1 - Objective Text
 * 
 *   Reward (Known):
 *   - Text format for normal rewards.
 *   - %1 - Reward Text
 * 
 *   Reward (Claimed):
 *   - Text format for claimed rewards.
 *   - %1 - Reward Text
 * 
 *   Reward (Denied):
 *   - Text format for denied rewards.
 *   - %1 - Reward Text
 *
 * ---
 *
 * Scene_Quest > Vocab > Button Assist Window
 * 
 *   Scroll Up/Down:
 *   - Text for Page Up/Down to scroll log window.
 *   - Requires VisuMZ_0_CoreEngine!
 * 
 *   Tracker:
 *   - Text for tracking quests.
 *   - Requires VisuMZ_0_CoreEngine!
 * 
 *   Expand:
 *   - Text for expanding categories.
 *   - Requires VisuMZ_0_CoreEngine!
 * 
 *   Collapse:
 *   - Text for collapsing categories.
 *   - Requires VisuMZ_0_CoreEngine!
 *
 * ---
 *
 * Scene_Quest > Icons
 * 
 *   Icon: Known:
 *   - Icon used for this command.
 * 
 *   Icon: Completed:
 *   - Icon used for this command.
 * 
 *   Icon: Failed:
 *   - Icon used for this command.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Quest Category Settings
 * ============================================================================
 *
 * Quest Categories separate the quest types in your game. These can be used to
 * help players differentiate which are story-driven quests, which are optional
 * quests, recurring quests, etc. These have limited settings, but serve as
 * containers for quests that fall under its category.
 *
 * ---
 *
 * Category
 * 
 *   Category Name:
 *   - This category's name.
 *   - You may use text codes.
 * 
 *   Quests:
 *   - A list of quests listed under this category.
 *   - Quests will be listed in the same order as this parameter.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Quest Settings
 * ============================================================================
 *
 * Each Quest Category will contain a list of quests that can appear in-game.
 * These individual quests make up the meat and bones of the Quest System and
 * will serve to relay information to the player on what he/she needs to do in
 * order to make progress in your game.
 *
 * ---
 *
 * Quest
 * 
 *   Quest ID Key:
 *   - This quest's identification key. Quests require unique keys for the
 *     plugin to differentiate them.
 *   - It is VERY important that you keep this key unique from other quests in
 *     order for the Quest System to operate properly in your game.
 *
 * ---
 *
 * Header
 * 
 *   Title:
 *   - The quest of the title. This is what appears in-game.
 *   - You may use text codes.
 *   - In Plugin Parameters => General => Vocab => Log Window => Quest Log,
 *     this will replace the [[Title]] marker.
 * 
 *   Difficulty:
 *   - Difficulty level for this quest.
 *   - You may use text codes.
 *   - In Plugin Parameters => General => Vocab => Log Window => Quest Log,
 *     this will replace the [[Difficulty]] marker.
 * 
 *   From:
 *   - Insert the name of the one who issued this quest.
 *   - You may use text codes.
 *   - In Plugin Parameters => General => Vocab => Log Window => Quest Log,
 *     this will replace the [[From]] marker.
 * 
 *   Location:
 *   - Insert location name where this quest was issued.
 *   - You may use text codes.
 *   - In Plugin Parameters => General => Vocab => Log Window => Quest Log,
 *     this will replace the [[Location]] marker.
 * 
 *   Description:
 *   - Type out the description(s) used for this quest.
 *   - You may use text codes.
 *   - In Plugin Parameters => General => Vocab => Log Window => Quest Log,
 *     this will replace the [[Description]] marker.
 *   - The displayed description will depend on the Description ID set through
 *     Plugin Command.
 *   - If no Description ID is set through Plugin Commands, it will default to
 *     a default ID value of 1.
 *
 * ---
 *
 * Lists
 * 
 *   Objectives List:
 *   - The objectives to be completed for this quest.
 *   - You may use text codes.
 *   - In Plugin Parameters => General => Vocab => Log Window => Quest Log,
 *     this will replace the [[Objectives]] marker.
 *   - Depending on which ID's are set to visible, a list will created at the
 *     marker displaying each of the objectives.
 *    - This can be done thorugh the Visible Objectives parameter or through
 *      Plugin Commands.
 * 
 *   Visible Objectives:
 *   - The objectives that are visible from the start.
 * 
 *   Rewards List:
 *   - The reward list for this quest.
 *   - You may use text codes.
 *   - In Plugin Parameters => General => Vocab => Log Window => Quest Log,
 *     this will replace the [[Rewards]] marker.
 *   - Depending on which ID's are set to visible, a list will created at the
 *     marker displaying each of the rewards.
 *    - This can be done thorugh the Visible Rewards parameter or through
 *      Plugin Commands.
 * 
 *   Visible Rewards:
 *   - The rewards that are visible from the start.
 *
 * ---
 *
 * Footer
 * 
 *   Subtext:
 *   - Subtext to be displayed with the quest.
 *   - You may use text codes.
 *   - In Plugin Parameters => General => Vocab => Log Window => Quest Log,
 *     this will replace the [[Subtext]] marker.
 *   - The displayed description will depend on the Subtext ID set through
 *     Plugin Command.
 *   - If no Subtext ID is set through Plugin Commands, it will default to
 *     a default ID value of 1.
 * 
 *   Quotes:
 *   - Quotes to be displayed with the quest.
 *   - You may use text codes.
 *   - In Plugin Parameters => General => Vocab => Log Window => Quest Log,
 *     this will replace the [[Quote]] marker.
 *   - The displayed description will depend on the Quote ID set through
 *     Plugin Command.
 *   - If no Quote ID is set through Plugin Commands, it will default to
 *     a default ID value of 1.
 *
 * ---
 *
 * JavaScript
 * 
 *   JS: On Load:
 *   - Runs code upon loading the quest in Scene_Quest.
 *   - Useful for setting up variables.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Quest Tracker Settings
 * ============================================================================
 *
 * The Quest Tracker Window is a window that appears on the map scene to
 * display the objectives (and other desired information) of the currently
 * tracked quest decided by the player.
 *
 * ---
 *
 * General
 *
 *   Tracker Format:
 *   - Text format for Quest Tracker Window.
 *   - Read help file for instructions.
 *
 * ---
 *
 * Options
 * 
 *   Adjust Window Height:
 *   - Automatically adjust the options window height?
 * 
 *   Add Show Tracker?:
 *   - Add the 'Show Tracker' option to the Options menu?
 * 
 *     Option Name:
 *     - Command name of the option.
 * 
 *   Add Position Tracker?:
 *   - Add the 'Position Tracker' option to the Options menu?
 * 
 *     Option Name:
 *     - Command name of the option.
 * 
 *     Option OFF:
 *     - Text displayed when the option is OFF.
 * 
 *     Option ON:
 *     - Text displayed when the option is ON.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Main Menu Settings
 * ============================================================================
 *
 * Set up the main menu defaults.
 *
 * ---
 *
 * Main Menu Settings
 * 
 *   Command Name:
 *   - Name of the 'Quest' option in the Main Menu.
 * 
 *   Show in Main Menu?:
 *   - Add the 'Quest' option to the Main Menu by default?
 * 
 *   Enable in Main Menu?:
 *   - Enable the 'Quest' option to the Main Menu by default?
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Background Settings
 * ============================================================================
 *
 * Background settings for Scene_Quest.
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
 * Plugin Parameters: Window Settings
 * ============================================================================
 *
 * These settings let you control the various windows that appear in the
 * Scene_Quest menu and the Quest Tracker Window that appears in Scene_Map.
 *
 * ---
 *
 * Command Window
 * 
 *   Show Failed Quests?:
 *   - Show/hide Failed Quests in the command window.
 * 
 *   Style:
 *   - How do you wish to draw commands in the Command Window?
 *   - Text Only: Display only the text.
 *   - Icon Only: Display only the icon.
 *   - Icon + Text: Display the icon first, then the text.
 *   - Auto: Determine which is better to use based on the size of the cell.
 * 
 *   Text Align:
 *   - Text alignment for the Command Window.
 * 
 *   Background Type:
 *   - Select background type for this window.
 * 
 *   JS: X, Y, W, H:
 *   - Code used to determine the dimensions for this window.
 *
 * ---
 *
 * Quest Label
 * 
 *   Background Type:
 *   - Select background type for this window.
 * 
 *   JS: X, Y, W, H:
 *   - Code used to determine the dimensions for this window.
 *
 * ---
 *
 * Log Window
 * 
 *   PageUp/Down Speed:
 *   - Scroll speed for PageUp/Down.
 * 
 *   Background Type:
 *   - Select background type for this window.
 * 
 *   JS: X, Y, W, H:
 *   - Code used to determine the dimensions for this window.
 * 
 *   EXPERIMENTAL:
 * 
 *     Automatic Word Wrap?:
 *     - Enables/disables automatic word wrap.
 *     - Requires VisuMZ_1_MessageCore!
 *     - This feature is experimental. Word Wrap does not worth perfectly
 *       with the Log Window, although it performs well enough. This feature
 *       will be updated and completed at a later point in the future. Use it
 *       at your own discretion.
 *
 * ---
 *
 * List Window
 * 
 *   Background Type:
 *   - Select background type for this window.
 * 
 *   JS: X, Y, W, H:
 *   - Code used to determine the dimensions for this window.
 *
 * ---
 *
 * Tracker Window
 * 
 *   Window Scale:
 *   - How much do you want to scale the Tracker Window's size by?
 * 
 *   Background Type:
 *   - Select background type for this window.
 * 
 *   JS: X, Y, W, H:
 *   - Code used to determine the dimensions for this window.
 *
 * ---
 *
 * ============================================================================
 * JavaScript Functions
 * ============================================================================
 *
 * These are some new JavaScript functions that you can use for the
 * 'JS: On Load' Plugin Parameter found in the Quest settings.
 *
 * Using these require you to have an adequate understanding of how JavaScript
 * works in order to successfully use it.
 *
 * ---
 *
 * $gameSystem.setQuestStatus(key, status)
 * - Changes the quest's completion status.
 * - Replace 'key' with Quest Key (include quotes).
 * - Replace 'status' with one of the following strings (include quotes):
 *   - 'known'
 *   - 'completed'
 *   - 'failed'
 *   - 'removed'
 *
 * Example: $gameSystem.setQuestStatus('exampleName', 'completed')
 *
 * ---
 *
 * $gameSystem.setQuestDescription(key, id)
 * - Changes the quest's description.
 * - Replace 'key' with Quest Key (include quotes).
 * - Replace 'id' with description ID to use.
 *
 * Example: $gameSystem.setQuestDescription('exampleName', 2)
 *
 * ---
 *
 * $gameSystem.setQuestObjectives(key, ids, status)
 * - Changes the quest's objectives.
 * - Replace 'key' with Quest Key (include quotes).
 * - Replace 'ids' with an array of ID's to use.
 * - Replace 'status' with one of the following strings (include quotes):
 *   - 'known'
 *   - 'completed'
 *   - 'failed'
 *   - 'removed'
 *
 * Example: $gameSystem.setQuestDescription('exampleName', [1, 2, 3], 'failed')
 *
 * ---
 *
 * $gameSystem.setQuestRewards(key, ids, status)
 * - Changes the quest's rewards.
 * - Replace 'key' with Quest Key (include quotes).
 * - Replace 'ids' with an array of ID's to use.
 * - Replace 'status' with one of the following strings (include quotes):
 *   - 'known'
 *   - 'claimed'
 *   - 'denied'
 *   - 'removed'
 *
 * Example: $gameSystem.setQuestRewards('exampleName', [1, 3, 5], 'claimed')
 *
 * ---
 *
 * $gameSystem.setQuestSubtext(key, id)
 * - Changes the quest's subtext.
 * - Replace 'key' with Quest Key (include quotes).
 * - Replace 'id' with subtext ID to use.
 *
 * Example: $gameSystem.questSubtext('exampleName', 3)
 *
 * ---
 *
 * $gameSystem.setQuestQuote(key, id)
 * - Changes the quest's quote.
 * - Replace 'key' with Quest Key (include quotes).
 * - Replace 'id' with quote ID to use.
 *
 * Example: $gameSystem.setQuestQuote('exampleName', 4)
 *
 * ---
 *
 * DISCLAIMER:
 *
 * Keep in mind that VisuStella is NOT responsible for your proficiency (or
 * otherwise) of JavaScript.
 *
 * If you get any errors with the custom code, it is up to YOU to fix it.
 * 
 * If you do not understand how any of this section works, do not be afraid.
 * It's not the end of the world.
 * 
 * You can still change the status of the quests and its objectives through the
 * usage of Plugin Commands.
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
 * - Yanfly
 * - Arisu
 * - Olivia
 * - Irina
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * 
 * Version 1.11: January 15, 2021
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * New Feature!
 * ** Added new [[Marker]] to Quest Log format and Quest Tracker formats.
 * *** [[RawTitle]] - Inserts the title of the quest without any text codes
 *     removed. Keep in mind that icons do NOT resize based on the text size.
 * 
 * Version 1.10: December 11, 2020
 * * Bugs Fixed!
 * ** Quest tracking should now automatically remove itself once a quest is
 *    dubbed complete, failed, or removed. Fix made by Yanfly.
 * 
 * Version 1.09: November 29, 2020
 * * Bug Fixed!
 * ** The Button Assist Window will now properly display the text for expanding
 *    and collapsing quest categories. Fix made by Arisu.
 * 
 * Version 1.08: November 15, 2020
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.07: November 1, 2020
 * * Documentation Update!
 * ** Added documentation for new feature(s)!
 * * Feature Updates!
 * ** When multiple parallel events are occuring, they will no longer cause lag
 *    by inducing multiple refreshes at a time. Update by Olivia.
 * * New Features!
 * ** New Plugin Parameter added by Irina!
 * *** Plugin Parameters > Quest Tracker Settings > Tracker Format
 * **** Text format for Quest Tracker Window. This lets you customize the text
 *      that appears in the Quest Tracker instead of just having the title and
 *      the objectives.
 * 
 * Version 1.06: October 25, 2020
 * * Feature Update!
 * ** If Message Core is not detected, <ColorLock> and </ColorLock> notetags
 *    will be automatically removed. Added by Arisu.
 * 
 * Version 1.05: October 11, 2020
 * * Documentation Update!
 * ** "Control Variable and Conditional Branch Usage" section added for those
 *    who wish to gather data for the script input fields of the mentioned
 *    event commands.
 * 
 * Version 1.04: October 4, 2020
 * * Bug Fixes!
 * ** Quest Tracker window refreshes should no longer cause infinite loops when
 *    used with specific script calls. Fix made by Yanfly.
 * 
 * Version 1.03: September 20, 2020
 * * Documentation Update!
 * ** For all the new features!
 * * New Features!
 * ** New notetags added by Olivia!
 * ** <Variable id On Death: +x> and <Variable id On Death: -x> for enemies.
 * ** <Variable id On Gain: +x> and <Variable id On Gain: -x> for items,
 *    weapons, and armors.
 * ** <Variable id On Lose: +x> and <Variable id On Lose: -x> for items,
 *    weapons, and armors.
 * ** <Track With Variable id> for items, weapons, and armors.
 * ** <Variable id On Use: +x> and <Variable id On Use: -x> for items & skills.
 * 
 * Version 1.02: September 13, 2020
 * * Bugs Fixed!:
 * ** Quest Tracker Window should no longer flicker.
 * 
 * Version 1.01: September 6, 2020
 * * Bug Fixed!
 * ** Disabled track windows no longer appear on the screen for one frame after
 *    leaving a menu of any sort. Fix made by Yanfly.
 * ** Viewing the failed quests no longer crash the game. Fix made by Yanfly.
 * * Feature Update!
 * ** The following Plugin Commands will now automatically update the tracker
 *    if needed. Feature update by Yanfly.
 * *** Quest: Add/Complete/Fail/Remove
 * *** Quest: Description Change
 * *** Quest: Objectives Change
 * *** Quest: Quote Change
 * *** Quest: Rewards Change
 * *** Quest: Subtext Change
 *
 * Version 1.00: August 31, 2020
 * * Finished Plugin!
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 *
 * @ --------------------------------------------------------------------------
 *
 * @command QuestSet
 * @text Quest: Add/Complete/Fail/Remove
 * @desc Adds quest(s) to be known/completed/failed.
 * Or removes them.
 *
 * @arg Keys:arraystr
 * @text Quest Keys
 * @type string[]
 * @desc Insert the quest key(s) here.
 * Each quest key must be unique.
 * @default []
 *
 * @arg Status:str
 * @text Status
 * @type select
 * @option Add to Known
 * @value known
 * @option Add to Completed
 * @value completed
 * @option Add to Failed
 * @value failed
 * @option Remove from All
 * @value remove
 * @desc Change the status to this.
 * @default known
 *
 * @ --------------------------------------------------------------------------
 *
 * @command QuestDescription
 * @text Quest: Description Change
 * @desc Changes the description of the quest(s) to a ID.
 *
 * @arg Keys:arraystr
 * @text Quest Keys
 * @type string[]
 * @desc Insert the quest key(s) here.
 * Each quest key must be unique.
 * @default []
 *
 * @arg TargetID:eval
 * @text Description ID
 * @desc Change the description of the quest(s) to a different ID.
 * You may use JavaScript code.
 * @default 1
 *
 * @ --------------------------------------------------------------------------
 *
 * @command QuestObjectives
 * @text Quest: Objectives Change
 * @desc Changes the objective(s) status of the quest(s).
 *
 * @arg Keys:arraystr
 * @text Quest Keys
 * @type string[]
 * @desc Insert the quest key(s) here.
 * Each quest key must be unique.
 * @default []
 *
 * @arg TargetIDs:arrayeval
 * @text Objective ID(s)
 * @type string[]
 * @desc Select the objective ID(s) to change.
 * You may use JavaScript code.
 * @default ["1"]
 *
 * @arg Status:str
 * @text Status
 * @type select
 * @option Show Objective(s)
 * @value show
 * @option Complete Objective(s)
 * @value complete
 * @option Fail Objective(s)
 * @value fail
 * @option Remove Objective(s)
 * @value remove
 * @desc Change the status of the objective(s) to this.
 * @default show
 *
 * @ --------------------------------------------------------------------------
 *
 * @command QuestQuote
 * @text Quest: Quote Change
 * @desc Changes the quote of the quest(s) to a ID.
 *
 * @arg Keys:arraystr
 * @text Quest Keys
 * @type string[]
 * @desc Insert the quest key(s) here.
 * Each quest key must be unique.
 * @default []
 *
 * @arg TargetID:eval
 * @text Quote ID
 * @desc Change the quote of the quest(s) to a different ID.
 * You may use JavaScript code.
 * @default 1
 *
 * @ --------------------------------------------------------------------------
 *
 * @command QuestRewards
 * @text Quest: Rewards Change
 * @desc Changes the reward(s) status of the quest(s).
 *
 * @arg Keys:arraystr
 * @text Quest Keys
 * @type string[]
 * @desc Insert the quest key(s) here.
 * Each quest key must be unique.
 * @default []
 *
 * @arg TargetIDs:arrayeval
 * @text Reward ID(s)
 * @type string[]
 * @desc Select the reward ID(s) to change.
 * You may use JavaScript code.
 * @default ["1"]
 *
 * @arg Status:str
 * @text Status
 * @type select
 * @option Show Reward(s)
 * @value show
 * @option Claim Reward(s)
 * @value claim
 * @option Deny Reward(s)
 * @value deny
 * @option Remove Reward(s)
 * @value remove
 * @desc Change the status of the reward(s) to this.
 * @default show
 *
 * @ --------------------------------------------------------------------------
 *
 * @command QuestSubtext
 * @text Quest: Subtext Change
 * @desc Changes the subtext of the quest(s) to a ID.
 *
 * @arg Keys:arraystr
 * @text Quest Keys
 * @type string[]
 * @desc Insert the quest key(s) here.
 * Each quest key must be unique.
 * @default []
 *
 * @arg TargetID:eval
 * @text Subtext ID
 * @desc Change the subtext of the quest(s) to a different ID.
 * You may use JavaScript code.
 * @default 1
 *
 * @ --------------------------------------------------------------------------
 *
 * @command TrackerChangeQuest
 * @text Tracker: Change Quest
 * @desc Changes the tracked quest.
 *
 * @arg Key:str
 * @text Quest Key
 * @desc Insert the quest key here.
 * @default Example
 *
 * @ --------------------------------------------------------------------------
 *
 * @command TrackerRefreshWindow
 * @text Tracker: Refresh Window
 * @desc Refreshes the quest tracker window.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command TrackerShowHide
 * @text Tracker: Show/Hide Window
 * @desc Can forcefully hide window.
 * Showing will depend on the player's Options setting.
 *
 * @arg Show:eval
 * @text Show/Hide?
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Shows/hides the tracker window on the map.
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SystemCallSceneQuest
 * @text System: Call Scene_Quest
 * @desc Opens Scene_Quest for the player.
 * Does not work in battle.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SystemEnableQuestMenu
 * @text System: Enable Quests in Menu?
 * @desc Enables/disables quest menu inside the main menu.
 *
 * @arg Enable:eval
 * @text Enable/Disable?
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables/disables quest menu inside the main menu.
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SystemShowQuestMenu
 * @text System: Show Quests in Menu?
 * @desc Shows/hides quest menu inside the main menu.
 *
 * @arg Show:eval
 * @text Show/Hide?
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Shows/hides quest menu inside the main menu.
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
 * @param QuestSystem
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
 * @desc General settings for the Quest System.
 * @default {"StartingQuests":"","KnownQuests:arraystr":"[\"Welcome\",\"Example\",\"Plugin_Tutorial_Title\",\"Plugin_Tutorial_Difficulty\",\"Plugin_Tutorial_From\",\"Plugin_Tutorial_Description\",\"Plugin_Tutorial_Objectives\",\"Plugin_Tutorial_Rewards\",\"Plugin_Tutorial_Subtext\",\"Plugin_Tutorial_Quote\",\"Challenge_Plugin_Variables\",\"Challenge_Plugin_Switches\"]","CompletedQuests:arraystr":"[]","FailedQuests:arraystr":"[]","TrackedQuest:str":"Welcome","SceneQuest":"","Vocab":"","VocabCommandWindow":"","CommandWindow_Known_Text:str":"Available","CommandWindow_Completed_Text:str":"Completed","CommandWindow_Failed_Text:str":"Failed","VocabLabelWindow":"","EmptyTitleLabel:str":"\\i[186]Quest Journal","VocabListWindow":"","ListWindowCategoryOpenFmt:str":"- %1(%2)","ListWindowCategoryCloseFmt:str":"+ %1(%2)","NoQuestListed:str":"(No Quests Listed)","ListWindowTrackedQuest:str":"\\c[17]%1\\c[0]","VocabLogWindow":"","LogEmpty:json":"\"\\\\c[5]Main Quests\\\\c[0] are quests that must be\\ncompleted in order to progress further\\ninto the game's story.\\n\\n\\\\c[6]Side Quests\\\\c[0] are optional quests that can\\nbe completed at your discretion. Upon\\ncompleting a side quest, you can receive\\nuseful rewards that may assist you on\\nyour journey.\"","OnLoadQuestJS:func":"\"// Insert JavaScript code here.\"","LogFmt:json":"\"\\\\{[[Title]]\\\\}\\n\\\\c[4]Level:\\\\c[0] [[Difficulty]]\\n\\\\c[4]From:\\\\c[0] [[From]]\\n\\\\c[4]Location:\\\\c[0] [[Location]]\\n\\n\\\\c[4]Description:\\\\c[0]\\n[[Description]]\\n\\n\\\\c[4]Objectives:\\\\c[0]\\n[[Objectives]]\\n\\n\\\\c[4]Rewards:\\\\c[0]\\n[[Rewards]]\\n\\n[[Subtext]]\\n\\n[[Quote]]\"","Objective_Normal_Fmt:str":"◎%1","Objective_Completed_Fmt:str":"\\c[24]<ColorLock>✔%1</ColorLock>\\c[0]","Objective_Failed_Fmt:str":"\\c[25]<ColorLock>✘%1</ColorLock>\\c[0]","Reward_Normal_Fmt:str":"◎%1","Reward_Completed_Fmt:str":"\\c[24]<ColorLock>✔%1</ColorLock>\\c[0]","Reward_Failed_Fmt:str":"\\c[25]<ColorLock>✘%1</ColorLock>\\c[0]","ButtonAssistWindow":"","ButtonAssistPageUpDown:str":"Scroll Up/Down","questButtonAssistActive:str":"Track","ButtonAssistExpand:str":"Expand","ButtonAssistCollapse:str":"Collapse","CommandWindowIcons":"","CommandWindow_Known_Icon:num":"193","CommandWindow_Completed_Icon:num":"192","CommandWindow_Failed_Icon:num":"194"}
 *
 * @param Categories:arraystruct
 * @text Quest Categories
 * @type struct<Category>[]
 * @desc A list of categories and their quests.
 * @default ["{\"CategoryName:str\":\"\\\\C[5]Main Quests\",\"Quests:arraystruct\":\"[\\\"{\\\\\\\"Key:str\\\\\\\":\\\\\\\"Welcome\\\\\\\",\\\\\\\"Header\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Title:str\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\\i[87]Welcome Quest\\\\\\\",\\\\\\\"Difficulty:str\\\\\\\":\\\\\\\"Easy\\\\\\\",\\\\\\\"From:str\\\\\\\":\\\\\\\"VisuStella\\\\\\\",\\\\\\\"Location:str\\\\\\\":\\\\\\\"RPG Maker MZ\\\\\\\",\\\\\\\"Description:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Thank you for using the \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Quest System\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nplugin made by \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]VisuStella MZ\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nThis is an example quest to demonstrate\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nhow the \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Quest System\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] works. It functions\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nprimarily as a log book for the various\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nadventures inside your game.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Lists\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Objectives:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Take a look at the \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Quest\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] menu.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Change \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]tracked quest\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] to something else.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"VisibleObjectives:arraynum\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Rewards:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\i[186]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Quest System\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] for your game!\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\i[84]Helping support \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]VisuStella\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]!\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"VisibleRewards:arraynum\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Footer\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Subtext:arrayjson\\\\\\\":\\\\\\\"[]\\\\\\\",\\\\\\\"Quotes:arrayjson\\\\\\\":\\\\\\\"[]\\\\\\\",\\\\\\\"JavaScript\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"OnLoadQuestJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"// Insert JavaScript code here.\\\\\\\\\\\\\\\"\\\\\\\"}\\\",\\\"{\\\\\\\"Key:str\\\\\\\":\\\\\\\"Example\\\\\\\",\\\\\\\"Header\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Title:str\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\\i[87]Example Quest\\\\\\\",\\\\\\\"Difficulty:str\\\\\\\":\\\\\\\"Easy\\\\\\\",\\\\\\\"From:str\\\\\\\":\\\\\\\"VisuStella\\\\\\\",\\\\\\\"Location:str\\\\\\\":\\\\\\\"RPG Maker MZ\\\\\\\",\\\\\\\"Description:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"This is where the quest \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]description\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ngoes. Type in whatever text you need\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nhere in order to explain to the player\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nabout the quest.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Lists\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Objectives:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Describe each of the quest \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]objectives\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nhere for the player.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"You can have multiple quest \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]objectives\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nout at once.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"If you do, make sure you have the\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Visible Objectives\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] list the ID's of\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nthe objectives you want visible from\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nthe very beginning.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"VisibleObjectives:arraynum\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"3\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Rewards:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Here, you can list all the rewards the\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ngame will give the player upon the\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ncompletion of the quest.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"You can list the rewards however you\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nlike, but do keep it concise.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"You can list multiple rewards, too.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"If you do, make sure you have the\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Visible Rewards\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] list the ID's of the\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nrewards you want visible from the\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nvery beginning.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"VisibleRewards:arraynum\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"3\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"4\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Footer\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Subtext:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"This is a \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]subtext\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]. It is used as extra\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ntext that you may want to place on your\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nquest journal that differs from the\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]description\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Quotes:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"We learn by example and by direct\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nexperience because there are real limits\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nto the adequacy of verbal instruction.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n~Malcolm Gladwell\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"JavaScript\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"OnLoadQuestJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"// Insert JavaScript code here.\\\\\\\\\\\\\\\"\\\\\\\"}\\\"]\"}","{\"CategoryName:str\":\"\\\\c[6]Side Quests\",\"Quests:arraystruct\":\"[\\\"{\\\\\\\"Key:str\\\\\\\":\\\\\\\"Plugin_Tutorial_Title\\\\\\\",\\\\\\\"Header\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Title:str\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\\i[193]Titles\\\\\\\",\\\\\\\"Difficulty:str\\\\\\\":\\\\\\\"Easy\\\\\\\",\\\\\\\"From:str\\\\\\\":\\\\\\\"VisuStella\\\\\\\",\\\\\\\"Location:str\\\\\\\":\\\\\\\"RPG Maker MZ\\\\\\\",\\\\\\\"Description:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"The quest's \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]title\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] is listed in three\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ndifferent places in the \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Quest Scene\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n1. The top of the screen.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n2. The top of the quest log entry.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n3. The quest list on the side.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nBe sure to put some thought in deciding\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nyour titles as they are there to convey\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nwhat the quest is all about.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Lists\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Objectives:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Change the title through the quest's\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]Title\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Parameter\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"VisibleObjectives:arraynum\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Rewards:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\i[79]Mastery of \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Parameter\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]Title\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"VisibleRewards:arraynum\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Footer\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Subtext:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"You can use icons in the quest title by\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nusing the \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\i[x]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] text code. Keep in mind\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nthat the icon will be removed from the\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nquest log entry.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Quotes:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"A good title is the title of a\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nsuccessful book.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n~Raymond Chandler\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"JavaScript\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"OnLoadQuestJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"// Insert JavaScript code here.\\\\\\\\\\\\\\\"\\\\\\\"}\\\",\\\"{\\\\\\\"Key:str\\\\\\\":\\\\\\\"Plugin_Tutorial_Difficulty\\\\\\\",\\\\\\\"Header\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Title:str\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\\i[193]Difficulty\\\\\\\",\\\\\\\"Difficulty:str\\\\\\\":\\\\\\\"Easy\\\\\\\",\\\\\\\"From:str\\\\\\\":\\\\\\\"VisuStella\\\\\\\",\\\\\\\"Location:str\\\\\\\":\\\\\\\"RPG Maker MZ\\\\\\\",\\\\\\\"Description:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"A quest's \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]difficulty\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] can be used to\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nconvey what kinds of expectations they\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nshould have regarding challenge.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nThese can range from star ratings like:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\i[87]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\i[87]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\i[88]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\i[88]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\i[88]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nto\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nLevel ranges like:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[24]Level 20+\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Lists\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Objectives:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Change the difficulty through the\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nquest's \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]Difficulty\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Parameter\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"VisibleObjectives:arraynum\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Rewards:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\i[79]Mastery of \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Parameter\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]Difficulty\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"VisibleRewards:arraynum\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Footer\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Subtext:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"A quest's difficulty is often used to\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nrelay the expected level of conflict a\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nplayer may face.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Quotes:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"A pessimist sees the difficulty in\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nevery opportunity; an optimist sees the\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nopportunity in every difficulty.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n~Winston Churchill\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"JavaScript\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"OnLoadQuestJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"// Insert JavaScript code here.\\\\\\\\\\\\\\\"\\\\\\\"}\\\",\\\"{\\\\\\\"Key:str\\\\\\\":\\\\\\\"Plugin_Tutorial_From\\\\\\\",\\\\\\\"Header\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Title:str\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\\i[193]From\\\\\\\",\\\\\\\"Difficulty:str\\\\\\\":\\\\\\\"Easy\\\\\\\",\\\\\\\"From:str\\\\\\\":\\\\\\\"VisuStella\\\\\\\",\\\\\\\"Location:str\\\\\\\":\\\\\\\"RPG Maker MZ\\\\\\\",\\\\\\\"Description:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Explaining which \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]NPC\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] the quest is from\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ncan help remind the player its origin\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nand also help save the player some time\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nin trying to find that \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]NPC\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] again when\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ngoing to claim the quest \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]rewards\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Lists\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Objectives:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Change the \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"from\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\" text through the\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nquest's \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]From\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Parameter\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"VisibleObjectives:arraynum\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Rewards:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\i[79]Mastery of \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Parameter\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]From\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"VisibleRewards:arraynum\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Footer\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Subtext:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Use the \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Quest System\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] as a means to\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nstreamline your player's experience.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Quotes:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"More important than the quest for\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ncertainty is the quest for clarity.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n~Francois Gautier\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"JavaScript\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"OnLoadQuestJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"// Insert JavaScript code here.\\\\\\\\\\\\\\\"\\\\\\\"}\\\",\\\"{\\\\\\\"Key:str\\\\\\\":\\\\\\\"Plugin_Tutorial_Description\\\\\\\",\\\\\\\"Header\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Title:str\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\\i[193]Descriptions\\\\\\\",\\\\\\\"Difficulty:str\\\\\\\":\\\\\\\"Medium\\\\\\\",\\\\\\\"From:str\\\\\\\":\\\\\\\"VisuStella\\\\\\\",\\\\\\\"Location:str\\\\\\\":\\\\\\\"RPG Maker MZ\\\\\\\",\\\\\\\"Description:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Insert the quest's \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Description\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] here.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nThe displayed \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]quest description\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] will\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ndepend on the \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Description ID\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] that is\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ncurrently active for the quest.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"This is the updated quest description. This\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ncan only be seen when it is Description ID #2.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Lists\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Objectives:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"You can change the Description ID by\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nusing the \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]Quest: Description Change\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Parameter\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Try changing it to \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]2\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] through the\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Command\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] see what it becomes.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"VisibleObjectives:arraynum\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Rewards:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\i[79]Mastery of \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Parameter\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]Description\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\i[79]Mastery of \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Command\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]Quest: Description Change\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"VisibleRewards:arraynum\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Footer\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Subtext:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Descriptions are valuable tools that can\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nbe used to help remind the player the\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\npurpose of the quest.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Quotes:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Description begins in the writer's\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nimagination but should finish in the\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nreader's.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n~Stephen King\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"JavaScript\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"OnLoadQuestJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"// Insert JavaScript code here.\\\\\\\\\\\\\\\"\\\\\\\"}\\\",\\\"{\\\\\\\"Key:str\\\\\\\":\\\\\\\"Plugin_Tutorial_Objectives\\\\\\\",\\\\\\\"Header\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Title:str\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\\i[193]Objectives\\\\\\\",\\\\\\\"Difficulty:str\\\\\\\":\\\\\\\"Medium-Hard\\\\\\\",\\\\\\\"From:str\\\\\\\":\\\\\\\"VisuStella\\\\\\\",\\\\\\\"Location:str\\\\\\\":\\\\\\\"RPG Maker MZ\\\\\\\",\\\\\\\"Description:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Quest \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]objectives\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] are used to streamline\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nthe goals the player needs to achieve in\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\norder to make progress.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Lists\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Objectives:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"You can change the status of each\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Quest Objective\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] to \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Known\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0], \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[24]Completed\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0],\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nor \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[25]Failed\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"You can also \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]remove\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] objectives from\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nbeing viewed.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"You can determine the default \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]quest\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nobjectives\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] through the \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]Visible\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nObjectives \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Parameter\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"You can reveal new \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]quest objectives\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nthrough the use of \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Command\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]Quest: Objectives Change\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]The following are examples:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Known Objective\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Completed Objective\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Failed Objective\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"VisibleObjectives:arraynum\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"3\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"4\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"5\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"6\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"7\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Rewards:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\i[79]Mastery of \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Parameter\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]Objectives\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\i[79]Mastery of \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Command\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]Quest: Objectives Change\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"VisibleRewards:arraynum\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Footer\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Subtext:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Treat \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]quest objectives\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] like a set of\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ninstructions or outline for the player\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nto follow in order to get the desired\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nresult both of you want.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Quotes:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"People with objectives succeed because\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nthey know where they're going.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n~Earl Nightingale\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"JavaScript\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"OnLoadQuestJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"// Insert JavaScript code here.\\\\\\\\\\\\\\\\nconst key = 'Plugin_Tutorial_Objectives';\\\\\\\\\\\\\\\\n$gameSystem.setQuestObjectives(key, [5], 'show');\\\\\\\\\\\\\\\\n$gameSystem.setQuestObjectives(key, [6], 'complete');\\\\\\\\\\\\\\\\n$gameSystem.setQuestObjectives(key, [7], 'fail');\\\\\\\\\\\\\\\"\\\\\\\"}\\\",\\\"{\\\\\\\"Key:str\\\\\\\":\\\\\\\"Plugin_Tutorial_Rewards\\\\\\\",\\\\\\\"Header\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Title:str\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\\i[193]Rewards\\\\\\\",\\\\\\\"Difficulty:str\\\\\\\":\\\\\\\"Medium-Hard\\\\\\\",\\\\\\\"From:str\\\\\\\":\\\\\\\"VisuStella\\\\\\\",\\\\\\\"Location:str\\\\\\\":\\\\\\\"RPG Maker MZ\\\\\\\",\\\\\\\"Description:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Quest rewards\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] are the goodies that are\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\npromised to be given to the player upon\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nthe completion of the quest.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Lists\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Objectives:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"You can change the status of each\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Quest Reward\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] to \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Known\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0], \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[24]Claimed\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0],\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nor \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[25]Denied\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"You can also \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]remove\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] rewardsfrom\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nbeing viewed.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"You can determine the default \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]quest\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nrewards\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] through the \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]Visible\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nRewards \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Parameter\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"VisibleObjectives:arraynum\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"3\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Rewards:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\i[79]Mastery of \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Parameter\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]Rewards\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\i[79]Mastery of \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Command\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]Quest: Rewards Change\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"You can reveal new \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]quest rewards\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nthrough the use of \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Command\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]Quest: Rewards Change\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]The following are examples:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Known Reward\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Claimed Reward\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Denied Reward\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"VisibleRewards:arraynum\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"3\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"4\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"5\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"6\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Footer\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Subtext:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Rewards are incentives for the player to\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ncomplete them, especially quests of\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nhigher difficulty levels.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Quotes:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Reward the behavior you want repeated.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n~Larry Winget\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"JavaScript\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"OnLoadQuestJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"// Insert JavaScript code here.\\\\\\\\\\\\\\\\nconst key = 'Plugin_Tutorial_Rewards';\\\\\\\\\\\\\\\\n$gameSystem.setQuestRewards(key, [4], 'show');\\\\\\\\\\\\\\\\n$gameSystem.setQuestRewards(key, [5], 'claim');\\\\\\\\\\\\\\\\n$gameSystem.setQuestRewards(key, [6], 'deny');\\\\\\\\\\\\\\\"\\\\\\\"}\\\",\\\"{\\\\\\\"Key:str\\\\\\\":\\\\\\\"Plugin_Tutorial_Subtext\\\\\\\",\\\\\\\"Header\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Title:str\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\\i[193]Subtexts\\\\\\\",\\\\\\\"Difficulty:str\\\\\\\":\\\\\\\"Medium\\\\\\\",\\\\\\\"From:str\\\\\\\":\\\\\\\"VisuStella\\\\\\\",\\\\\\\"Location:str\\\\\\\":\\\\\\\"RPG Maker MZ\\\\\\\",\\\\\\\"Description:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"The \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]subtext\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] section can be used in a\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nnumber of ways, from hints to summaries,\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nto warnings.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nAnd like the quest \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]description\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0], you can\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nchange the text displayed in the \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]subtext\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nthrough changing the \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Subtext ID\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Lists\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Objectives:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"You can change the Subtext ID by\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nusing the \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]Quest: Subtext Change\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Parameter\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Try changing it to \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]2\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] through the\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Command\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] see what it becomes.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"VisibleObjectives:arraynum\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Rewards:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\i[79]Mastery of \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Parameter\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]Subtext\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\i[79]Mastery of \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Command\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]Quest: Subtext Change\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"VisibleRewards:arraynum\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Footer\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Subtext:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Subtexts\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] can serve as hints, summaries,\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nwarnings, reminders, you name it.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"After all, reminding a player to do\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nsomething only means you want them to\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nsucceed at it.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Quotes:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"A discerning eye needs only a hint, and\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nunderstatement leaves the imagination\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nfree to build its own elaborations.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n~Russell Page\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"JavaScript\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"OnLoadQuestJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"// Insert JavaScript code here.\\\\\\\\\\\\\\\"\\\\\\\"}\\\",\\\"{\\\\\\\"Key:str\\\\\\\":\\\\\\\"Plugin_Tutorial_Quote\\\\\\\",\\\\\\\"Header\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Title:str\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\\i[193]Quotes\\\\\\\",\\\\\\\"Difficulty:str\\\\\\\":\\\\\\\"Medium\\\\\\\",\\\\\\\"From:str\\\\\\\":\\\\\\\"VisuStella\\\\\\\",\\\\\\\"Location:str\\\\\\\":\\\\\\\"RPG Maker MZ\\\\\\\",\\\\\\\"Description:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Quotes\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] can be used to reference specific\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nlines of dialogue that could help the\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nplayer understand what's needed to be\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ndone.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nOr they could just be \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]quotes\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] made by\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\njust about anyone.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nAnd like quest \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]descriptions and quest\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]subtexts\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0], the quest quotes can also be\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nchanged to display something else based\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\non the quest's \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Quote ID\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Lists\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Objectives:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"You can change the Quote ID by\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nusing the \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]Quest: Quote Change\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Parameter\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Try changing it to \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]2\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] through the\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Command\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] see what it becomes.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"VisibleObjectives:arraynum\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Rewards:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\i[79]Mastery of \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Parameter\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]Subtext\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\i[79]Mastery of \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Command\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]Quest: Subtext Change\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"VisibleRewards:arraynum\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Footer\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Subtext:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"How you want to use them is up to you.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Quotes:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"You miss 100% of the shots you\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ndon't take.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n~Micahel Scott\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"If at first you don't succeed, then\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nskydiving definitely isn't for you.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n~Steven Wright\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"JavaScript\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"OnLoadQuestJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"// Insert JavaScript code here.\\\\\\\\\\\\\\\"\\\\\\\"}\\\"]\"}","{\"CategoryName:str\":\"\\\\c[2]Challenge Quests\",\"Quests:arraystruct\":\"[\\\"{\\\\\\\"Key:str\\\\\\\":\\\\\\\"Challenge_Plugin_Variables\\\\\\\",\\\\\\\"Header\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Title:str\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\\i[5]Variables\\\\\\\",\\\\\\\"Difficulty:str\\\\\\\":\\\\\\\"Hard\\\\\\\",\\\\\\\"From:str\\\\\\\":\\\\\\\"VisuStella\\\\\\\",\\\\\\\"Location:str\\\\\\\":\\\\\\\"RPG Maker MZ\\\\\\\",\\\\\\\"Description:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Using the \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]JS: On Load \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Parameter\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0],\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nyou can run \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]JavaScript\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] code prior to the\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ncreation of the text written here.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nIn this example, game variables are set\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nup to automatically equal the number of\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nof the \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]first item\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] in the inventory.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nThe \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]objective\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] will automatically set\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nitself to completed if the variable's\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nvalue is determined to be over 10.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Lists\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Objectives:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Obtain \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\v[1]/10x First Database Item!\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"VisibleObjectives:arraynum\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Rewards:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\i[79]Knowledge for \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]JS: On Load\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Parameter\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"VisibleRewards:arraynum\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Footer\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Subtext:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[2]DISCLAIMER:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nKeep in mind that \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]VisuStella\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] is NOT\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nresponsible for your proficiency (or\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\notherwise) of \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]JavaScript\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nIf you get any errors with the custom\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ncode, it is up to \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]you\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] to fix it.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nIf you do not understand how any of this\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nsection works, do not be afraid. It's\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nnot the end of the world.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nYou can still change the status of the\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]quests\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] and its \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]objectives\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] through the\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nusage of \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Commands\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Quotes:arrayjson\\\\\\\":\\\\\\\"[]\\\\\\\",\\\\\\\"JavaScript\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"OnLoadQuestJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"// Insert JavaScript code here.\\\\\\\\\\\\\\\\nconst value = $gameParty.numItems($dataItems[1])\\\\\\\\\\\\\\\\nconst status = value >= 10 ? 'completed' : 'known';\\\\\\\\\\\\\\\\nconst key = 'Challenge_Plugin_Variables';\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\n$gameVariables.setValue(1, value);\\\\\\\\\\\\\\\\n$gameSystem.setQuestObjectives(key, [1], status)\\\\\\\\\\\\\\\"\\\\\\\"}\\\",\\\"{\\\\\\\"Key:str\\\\\\\":\\\\\\\"Challenge_Plugin_Switches\\\\\\\",\\\\\\\"Header\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Title:str\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\\i[5]Switches\\\\\\\",\\\\\\\"Difficulty:str\\\\\\\":\\\\\\\"Hard\\\\\\\",\\\\\\\"From:str\\\\\\\":\\\\\\\"VisuStella\\\\\\\",\\\\\\\"Location:str\\\\\\\":\\\\\\\"RPG Maker MZ\\\\\\\",\\\\\\\"Description:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Using the \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]JS: On Load \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Parameter\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0],\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nyou can run \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]JavaScript\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] code prior to the\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ncreation of the text written here.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nIn this example, game switch 1's ON/OFF\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nstatus will determine which description\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nthis quest will use.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nGame Switch 1 is now \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[25]OFF\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]!\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nDescription ID \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]1\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] is being used.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Using the \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]JS: On Load \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Parameter\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0],\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nyou can run \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]JavaScript\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] code prior to the\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ncreation of the text written here.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nIn this example, game switch 1's ON/OFF\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nstatus will determine which description\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nthis quest will use.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nGame Switch 1 is now \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[24]ON\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]!\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nDescription ID \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]2\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] is being used.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Lists\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Objectives:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"Change Switch 1's ON/OFF status.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"View this quest's \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]description\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"VisibleObjectives:arraynum\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"2\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Rewards:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\i[79]Knowledge for \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[6]JS: On Load\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Parameter\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"VisibleRewards:arraynum\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Footer\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"Subtext:arrayjson\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[2]DISCLAIMER:\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0]\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nKeep in mind that \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]VisuStella\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] is NOT\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nresponsible for your proficiency (or\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\notherwise) of \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]JavaScript\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nIf you get any errors with the custom\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ncode, it is up to \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]you\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] to fix it.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nIf you do not understand how any of this\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nsection works, do not be afraid. It's\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nnot the end of the world.\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nYou can still change the status of the\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]quests\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] and its \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]objectives\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0] through the\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\nusage of \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[4]Plugin Commands\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\c[0].\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"Quotes:arrayjson\\\\\\\":\\\\\\\"[]\\\\\\\",\\\\\\\"JavaScript\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"OnLoadQuestJS:func\\\\\\\":\\\\\\\"\\\\\\\\\\\\\\\"// Insert JavaScript code here.\\\\\\\\\\\\\\\\nconst key = 'Challenge_Plugin_Switches';\\\\\\\\\\\\\\\\nconst id = $gameSwitches.value(1) ? 2 : 1;\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\n$gameSystem.setQuestDescription(key, id)\\\\\\\\\\\\\\\"\\\\\\\"}\\\"]\"}"]
 *
 * @param Tracker:struct
 * @text Quest Tracker Settings
 * @type struct<Tracker>
 * @desc Setup how all the quest tracker works.
 * @default {"General":"","TrackerFmt:json":"\"\\\\{[[Title]]\\\\}\\n[[Objectives]]\"","Options":"","AdjustRect:eval":"true","AddShowOption:eval":"true","ShowName:str":"Show Quest Tracker","AddPositionOption:eval":"true","PositionName:str":"Quest Tracker Position","PositionOff:str":"←","PositionOn:str":"→"}
 *
 * @param MainMenu:struct
 * @text Main Menu Settings
 * @type struct<MainMenu>
 * @desc Set up the main menu defaults.
 * @default {"Name:str":"Quest","ShowMainMenu:eval":"true","EnableMainMenu:eval":"true"}
 *
 * @param BgSettings:struct
 * @text Background Settings
 * @type struct<BgSettings>
 * @desc Background settings for Scene_Quest.
 * @default {"SnapshotOpacity:num":"192","BgFilename1:str":"","BgFilename2:str":""}
 *
 * @param Window:struct
 * @text Window Settings
 * @type struct<Window>
 * @desc Setup how all the windows appear in-game.
 * @default {"CommandWindow":"","ShowFailed:eval":"true","CmdStyle:str":"auto","CmdTextAlign:str":"center","CommandWindow_BgType:num":"0","CommandWindow_Rect:func":"\"const ww = this.mainCommandWidth();\\nconst wh = this.calcWindowHeight(Window_QuestCommand.prototype.totalCommands(), true);\\nconst wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;\\nconst wy = this.mainAreaTop();\\nreturn new Rectangle(wx, wy, ww, wh);\"","QuestLabel":"","QuestLabel_BgType:num":"0","QuestLabel_Rect:func":"\"const ww = Graphics.boxWidth - this.mainCommandWidth();\\nconst wh = this.calcWindowHeight(1, false);\\nconst wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;\\nconst wy = this.mainAreaTop();\\nreturn new Rectangle(wx, wy, ww, wh);\"","LogWindow":"","LogWindow_Auto_WordWrap:eval":"false","LogWindow_ScrollSpeed:num":"0.20","LogWindow_BgType:num":"0","LogWindow_Rect:func":"\"const ww = Graphics.boxWidth - this.mainCommandWidth();\\nconst wh = this.mainAreaHeight() - this.questLabelWindowRect().height;\\nconst wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;\\nconst wy = this.mainAreaTop() + this.questLabelWindowRect().height;\\nreturn new Rectangle(wx, wy, ww, wh);\"","ListWindow":"","ListWindow_BgType:num":"0","ListWindow_Rect:func":"\"const ww = this.mainCommandWidth();\\nconst wh = this.mainAreaHeight() - this.commandWindowRect().height;\\nconst wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;\\nconst wy = this.mainAreaTop() + this.commandWindowRect().height;\\nreturn new Rectangle(wx, wy, ww, wh);\"","TrackerWindow":"","TrackerWindow_Scale:num":"0.50","TrackerWindow_BgType:num":"0","TrackerWindow_Rect:func":"\"const ww = 560;\\nconst wh = Graphics.height / Window_QuestTracker.scale;\\nconst wx = this.questTrackerOnRight() ? Graphics.width - Math.ceil(ww * Window_QuestTracker.scale) : 0;\\nconst wy = this.buttonAreaHeight() + 8;\\nreturn new Rectangle(wx, wy, ww, wh);\""}
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
 * @param StartingQuests
 * @text Starting Quests
 *
 * @param KnownQuests:arraystr
 * @text Known Quests
 * @parent StartingQuests
 * @type string[]
 * @desc Which quests are known at the start of the game?
 * Insert their keys here.
 * @default ["Welcome","Example","Plugin_Tutorial_Title","Plugin_Tutorial_Difficulty","Plugin_Tutorial_From","Plugin_Tutorial_Description","Plugin_Tutorial_Objectives","Plugin_Tutorial_Rewards","Plugin_Tutorial_Subtext","Plugin_Tutorial_Quote","Challenge_Plugin_Variables","Challenge_Plugin_Switches"]
 *
 * @param CompletedQuests:arraystr
 * @text Completed Quests
 * @parent StartingQuests
 * @type string[]
 * @desc Which quests are completed at the start of the game?
 * Insert their keys here.
 * @default []
 *
 * @param FailedQuests:arraystr
 * @text Failed Quests
 * @parent StartingQuests
 * @type string[]
 * @desc Which quests are failed at the start of the game?
 * Insert their keys here.
 * @default []
 *
 * @param TrackedQuest:str
 * @text Tracked Quest
 * @parent StartingQuests
 * @desc Which quest is tracked at the start of the game?
 * @default Welcome
 *
 * @param SceneQuest
 * @text Scene_Quest
 *
 * @param Vocab
 * @parent SceneQuest
 *
 * @param VocabCommandWindow
 * @text Command Window
 * @parent Vocab
 *
 * @param CommandWindow_Known_Text:str
 * @text Command: Known
 * @parent VocabCommandWindow
 * @desc Text used to display known quests.
 * @default Available
 *
 * @param CommandWindow_Completed_Text:str
 * @text Command: Completed
 * @parent VocabCommandWindow
 * @desc Text used to display completed quests.
 * @default Completed
 *
 * @param CommandWindow_Failed_Text:str
 * @text Command: Failed
 * @parent VocabCommandWindow
 * @desc Text used to display failed quests.
 * @default Failed
 *
 * @param VocabLabelWindow
 * @text Label Window
 * @parent Vocab
 *
 * @param EmptyTitleLabel:str
 * @text Empty Title
 * @parent VocabLabelWindow
 * @desc Text displayed in the Label Window when no quest is selected.
 * @default \i[186]Quest Journal
 *
 * @param VocabListWindow
 * @text List Window
 * @parent Vocab
 *
 * @param ListWindowCategoryOpenFmt:str
 * @text Open Categories
 * @parent VocabListWindow
 * @desc Text format for an open category.
 * %1 - Category Name, %2 - Quest Amount
 * @default - %1(%2)
 *
 * @param ListWindowCategoryCloseFmt:str
 * @text Closed Categories
 * @parent VocabListWindow
 * @desc Text format for a closed category.
 * %1 - Category Name, %2 - Quest Amount
 * @default + %1(%2)
 *
 * @param NoQuestListed:str
 * @text No Quest Listed
 * @parent VocabListWindow
 * @desc Text when no quest is listed.
 * @default (No Quests Listed)
 *
 * @param ListWindowTrackedQuest:str
 * @text Tracked Quest
 * @parent VocabListWindow
 * @desc Text format for a tracked quest.
 * %1 - Tracked Quest's Name
 * @default \c[17]%1\c[0]
 *
 * @param VocabLogWindow
 * @text Log Window
 * @parent Vocab
 *
 * @param LogEmpty:json
 * @text Empty Message
 * @parent VocabLogWindow
 * @type note
 * @desc Text displayed when no quest is selected.
 * @default "\\c[5]Main Quests\\c[0] are quests that must be\ncompleted in order to progress further\ninto the game's story.\n\n\\c[6]Side Quests\\c[0] are optional quests that can\nbe completed at your discretion. Upon\ncompleting a side quest, you can receive\nuseful rewards that may assist you on\nyour journey."
 *
 * @param OnLoadQuestJS:func
 * @text JS: On Load
 * @parent LogEmpty:json
 * @type note
 * @desc Runs code upon making the empty message.
 * Useful for setting up variables.
 * @default "// Insert JavaScript code here."
 *
 * @param LogFmt:json
 * @text Quest Log
 * @parent VocabLogWindow
 * @type note
 * @desc Text format for Quest Log Window.
 * Read help file for instructions.
 * @default "\\{[[Title]]\\}\n\\c[4]Level:\\c[0] [[Difficulty]]\n\\c[4]From:\\c[0] [[From]]\n\\c[4]Location:\\c[0] [[Location]]\n\n\\c[4]Description:\\c[0]\n[[Description]]\n\n\\c[4]Objectives:\\c[0]\n[[Objectives]]\n\n\\c[4]Rewards:\\c[0]\n[[Rewards]]\n\n[[Subtext]]\n\n[[Quote]]"
 *
 * @param Objective_Normal_Fmt:str
 * @text Objective (Known)
 * @parent LogFmt:json
 * @desc Text format for known objectives.
 * %1 - Objective Text
 * @default ◎%1
 *
 * @param Objective_Completed_Fmt:str
 * @text Objective (Done)
 * @parent LogFmt:json
 * @desc Text format for complete objectives.
 * %1 - Objective Text
 * @default \c[24]<ColorLock>✔%1</ColorLock>\c[0]
 *
 * @param Objective_Failed_Fmt:str
 * @text Objective (Failed)
 * @parent LogFmt:json
 * @desc Text format for failed objectives.
 * %1 - Objective Text
 * @default \c[25]<ColorLock>✘%1</ColorLock>\c[0]
 *
 * @param Reward_Normal_Fmt:str
 * @text Reward (Known)
 * @parent LogFmt:json
 * @desc Text format for normal rewards.
 * %1 - Reward Text
 * @default ◎%1
 *
 * @param Reward_Completed_Fmt:str
 * @text Reward (Claimed)
 * @parent LogFmt:json
 * @desc Text format for claimed rewards.
 * %1 - Reward Text
 * @default \c[24]<ColorLock>✔%1</ColorLock>\c[0]
 *
 * @param Reward_Failed_Fmt:str
 * @text Reward (Denied)
 * @parent LogFmt:json
 * @desc Text format for denied rewards.
 * %1 - Reward Text
 * @default \c[25]<ColorLock>✘%1</ColorLock>\c[0]
 *
 * @param ButtonAssistWindow
 * @text Button Assist Window
 * @parent Vocab
 *
 * @param ButtonAssistPageUpDown:str
 * @text Scroll Up/Down
 * @parent ButtonAssistWindow
 * @desc Text for Page Up/Down to scroll log window.
 * Requires VisuMZ_0_CoreEngine!
 * @default Scroll Up/Down
 *
 * @param questButtonAssistActive:str
 * @text Tracker
 * @parent ButtonAssistWindow
 * @desc Text for tracking quests.
 * Requires VisuMZ_0_CoreEngine!
 * @default Track
 *
 * @param ButtonAssistExpand:str
 * @text Expand
 * @parent ButtonAssistWindow
 * @desc Text for expanding categories.
 * Requires VisuMZ_0_CoreEngine!
 * @default Expand
 *
 * @param ButtonAssistCollapse:str
 * @text Collapse
 * @parent ButtonAssistWindow
 * @desc Text for collapsing categories.
 * Requires VisuMZ_0_CoreEngine!
 * @default Collapse
 *
 * @param CommandWindowIcons
 * @text Icons
 * @parent SceneQuest
 *
 * @param CommandWindow_Known_Icon:num
 * @text Icon: Known
 * @parent CommandWindowIcons
 * @desc Icon used for this command.
 * @default 193
 *
 * @param CommandWindow_Completed_Icon:num
 * @text Icon: Completed
 * @parent CommandWindowIcons
 * @desc Icon used for this command.
 * @default 192
 *
 * @param CommandWindow_Failed_Icon:num
 * @text Icon: Failed
 * @parent CommandWindowIcons
 * @desc Icon used for this command.
 * @default 194
 *
 */
/* ----------------------------------------------------------------------------
 * Quest Category Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Category:
 *
 * @param CategoryName:str
 * @text Category Name
 * @desc This category's name.
 * You may use text codes.
 * @default Untitled
 *
 * @param Quests:arraystruct
 * @text Quests
 * @type struct<Quest>[]
 * @desc A list of quests listed under this category.
 * @default []
 *
 */
/* ----------------------------------------------------------------------------
 * Individual Quest Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Quest:
 *
 * @param Key:str
 * @text Quest ID Key
 * @desc This quest's identification key. Quests require
 * unique keys for the plugin to differentiate them.
 * @default (Needs Key)
 *
 * @param Header
 *
 * @param Title:str
 * @text Title
 * @parent Header
 * @desc The quest of the title. This is what appears in-game.
 * You may use text codes.
 * @default \i[87]Untitled Quest
 *
 * @param Difficulty:str
 * @text Difficulty
 * @parent Header
 * @desc Difficulty level for this quest.
 * You may use text codes.
 * @default Easy Peasy
 *
 * @param From:str
 * @text From
 * @parent Header
 * @desc Insert the name of the one who issued this quest.
 * You may use text codes.
 * @default NPC Name
 *
 * @param Location:str
 * @text Location
 * @parent Header
 * @desc Insert location name where this quest was issued.
 * You may use text codes.
 * @default Location Name
 *
 * @param Description:arrayjson
 * @text Description
 * @parent Header
 * @type note[]
 * @desc Type out the description(s) used for this quest.
 * You may use text codes.
 * @default ["\"This is the \\\\c[4]default\\\\c[0] quest description.\"","\"This is the \\\\c[4]default\\\\c[0] quest description.\\n\\nYou can insert multiple description entries in case you\\never want to update the quest description midway while the\\nquest is in progress.\""]
 *
 * @param Lists
 *
 * @param Objectives:arrayjson
 * @text Objectives List
 * @parent Lists
 * @type note[]
 * @desc The objectives to be completed for this quest.
 * You may use text codes.
 * @default ["\"\\\\c[4]First\\\\c[0] objective to be cleared.\"","\"\\\\c[4]Second\\\\c[0] objective, but it's hidden.\"","\"To make other objectives appear,\\nenable them through the \\\\c[4]'Visible\\nObjectives'\\\\c[0] plugin parameter or by\\nusing a plugin command to make\\nthem appear\""]
 *
 * @param VisibleObjectives:arraynum
 * @text Visible Objectives
 * @parent Objectives:arrayjson
 * @type number[]
 * @min 1
 * @desc The objectives that are visible from the start.
 * @default ["1"]
 *
 * @param Rewards:arrayjson
 * @text Rewards List
 * @parent Lists
 * @type note[]
 * @desc The reward list for this quest.
 * You may use text codes.
 * @default ["\"\\\\i[176]Potion x5\"","\"\\\\i[178]Ether x3\"","\"To make other rewards appear,\\nenable them through the \\\\c[4]'Visible\\nRewards'\\\\c[0] plugin parameter or by\\nusing a plugin command to make\\nthem appear\""]
 *
 * @param VisibleRewards:arraynum
 * @text Visible Rewards
 * @parent Rewards:arrayjson
 * @type number[]
 * @min 1
 * @desc The rewards that are visible from the start.
 * @default ["1"]
 *
 * @param Footer
 *
 * @param Subtext:arrayjson
 * @text Subtext
 * @parent Footer
 * @type note[]
 * @desc Subtext to be displayed with the quest.
 * You may use text codes.
 * @default ["\"\"","\"This is a \\\\c[4]subtext\\\\c[0]. It is used as extra\\ntext that you may want to place on your\\nquest journal that differs from the\\n\\\\c[4]description\\\\c[0].\""]
 *
 * @param Quotes:arrayjson
 * @text Quotes
 * @parent Footer
 * @type note[]
 * @desc Quotes to be displayed with the quest.
 * You may use text codes.
 * @default ["\"\"","\"Insert the quotes of NPC's here.\""]
 *
 * @param JavaScript
 *
 * @param OnLoadQuestJS:func
 * @text JS: On Load
 * @parent JavaScript
 * @type note
 * @desc Runs code upon loading the quest in Scene_Quest.
 * Useful for setting up variables.
 * @default "// Insert JavaScript code here."
 *
 */
/* ----------------------------------------------------------------------------
 * Quest Tracker Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Tracker:
 *
 * @param General
 *
 * @param TrackerFmt:json
 * @text Tracker Format
 * @parent General
 * @type note
 * @desc Text format for Quest Tracker Window.
 * Read help file for instructions.
 * @default "\\{[[Title]]\\}\n[[Objectives]]"
 *
 * @param Options
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
 * @param AddShowOption:eval
 * @text Add Show Tracker?
 * @parent Options
 * @type boolean
 * @on Add
 * @off Don't Add
 * @desc Add the 'Show Tracker' option to the Options menu?
 * @default true
 *
 * @param ShowName:str
 * @text Option Name
 * @parent AddShowOption:eval
 * @desc Command name of the option.
 * @default Show Quest Tracker
 *
 * @param AddPositionOption:eval
 * @text Add Position Tracker?
 * @parent Options
 * @type boolean
 * @on Add
 * @off Don't Add
 * @desc Add the 'Position Tracker' option to the Options menu?
 * @default true
 *
 * @param PositionName:str
 * @text Option Name
 * @parent AddPositionOption:eval
 * @desc Command name of the option.
 * @default Quest Tracker Position
 *
 * @param PositionOff:str
 * @text Option OFF
 * @parent AddPositionOption:eval
 * @desc Text displayed when the option is OFF.
 * @default ←
 *
 * @param PositionOn:str
 * @text Option ON
 * @parent AddPositionOption:eval
 * @desc Text displayed when the option is ON.
 * @default →
 *
 */
/* ----------------------------------------------------------------------------
 * MainMenu Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~MainMenu:
 *
 * @param Name:str
 * @text Command Name
 * @parent Options
 * @desc Name of the 'Quest' option in the Main Menu.
 * @default Quest
 *
 * @param ShowMainMenu:eval
 * @text Show in Main Menu?
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Add the 'Quest' option to the Main Menu by default?
 * @default true
 *
 * @param EnableMainMenu:eval
 * @text Enable in Main Menu?
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enable the 'Quest' option to the Main Menu by default?
 * @default true
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
 * Window Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Window:
 *
 * @param CommandWindow
 * @text Command Window
 *
 * @param ShowFailed:eval
 * @text Show Failed Quests?
 * @parent CommandWindow
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Show/hide Failed Quests in the command window.
 * @default true
 *
 * @param CmdStyle:str
 * @text Style
 * @parent CommandWindow
 * @type select
 * @option Text Only
 * @value text
 * @option Icon Only
 * @value icon
 * @option Icon + Text
 * @value iconText
 * @option Automatic
 * @value auto
 * @desc How do you wish to draw commands in the Command Window?
 * @default auto
 *
 * @param CmdTextAlign:str
 * @text Text Align
 * @parent CommandWindow
 * @type combo
 * @option left
 * @option center
 * @option right
 * @desc Text alignment for the Command Window.
 * @default center
 *
 * @param CommandWindow_BgType:num
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
 * @param CommandWindow_Rect:func
 * @text JS: X, Y, W, H
 * @parent CommandWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const ww = this.mainCommandWidth();\nconst wh = this.calcWindowHeight(Window_QuestCommand.prototype.totalCommands(), true);\nconst wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;\nconst wy = this.mainAreaTop();\nreturn new Rectangle(wx, wy, ww, wh);"
 *
 * @param QuestLabel
 * @text Quest Label
 *
 * @param QuestLabel_BgType:num
 * @text Background Type
 * @parent QuestLabel
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
 * @param QuestLabel_Rect:func
 * @text JS: X, Y, W, H
 * @parent QuestLabel
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const ww = Graphics.boxWidth - this.mainCommandWidth();\nconst wh = this.calcWindowHeight(1, false);\nconst wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;\nconst wy = this.mainAreaTop();\nreturn new Rectangle(wx, wy, ww, wh);"
 *
 * @param LogWindow
 * @text Log Window
 *
 * @param LogWindow_ScrollSpeed:num
 * @text PageUp/Down Speed
 * @parent LogWindow
 * @desc Scroll speed for PageUp/Down.
 * @default 0.20
 *
 * @param LogWindow_BgType:num
 * @text Background Type
 * @parent LogWindow
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
 * @param LogWindow_Rect:func
 * @text JS: X, Y, W, H
 * @parent LogWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const ww = Graphics.boxWidth - this.mainCommandWidth();\nconst wh = this.mainAreaHeight() - this.questLabelWindowRect().height;\nconst wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;\nconst wy = this.mainAreaTop() + this.questLabelWindowRect().height;\nreturn new Rectangle(wx, wy, ww, wh);"
 *
 * @param LogWindowExperimental
 * @text EXPERIMENTAL
 * @parent LogWindow
 *
 * @param LogWindow_Auto_WordWrap:eval
 * @text Automatic Word Wrap?
 * @parent LogWindowExperimental
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables/disables automatic word wrap.
 * Requires VisuMZ_1_MessageCore!
 * @default false
 *
 * @param ListWindow
 * @text List Window
 *
 * @param ListWindow_BgType:num
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
 * @param ListWindow_Rect:func
 * @text JS: X, Y, W, H
 * @parent ListWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const ww = this.mainCommandWidth();\nconst wh = this.mainAreaHeight() - this.commandWindowRect().height;\nconst wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;\nconst wy = this.mainAreaTop() + this.commandWindowRect().height;\nreturn new Rectangle(wx, wy, ww, wh);"
 *
 * @param TrackerWindow
 * @text Tracker Window
 *
 * @param TrackerWindow_Scale:num
 * @text Window Scale
 * @parent TrackerWindow
 * @desc How much do you want to scale the Tracker Window's size by?
 * @default 0.50
 *
 * @param TrackerWindow_BgType:num
 * @text Background Type
 * @parent TrackerWindow
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
 * @param TrackerWindow_Rect:func
 * @text JS: X, Y, W, H
 * @parent TrackerWindow
 * @type note
 * @desc Code used to determine the dimensions for this window.
 * @default "const ww = 560;\nconst wh = Graphics.height / Window_QuestTracker.scale;\nconst wx = this.questTrackerOnRight() ? Graphics.width - Math.ceil(ww * Window_QuestTracker.scale) : 0;\nconst wy = this.buttonAreaHeight() + 8;\nreturn new Rectangle(wx, wy, ww, wh);"
 *
 */
//=============================================================================

const _0x5ec9=['right','lineHeight','itemLineRect','95413tMoqqM','questTrackerShow','join','activeBgType','_logWindow','setLabelWindow','questsFailed','BgFilename1','questFailedCmd','setHandler','currentExt','uiMenuStyle','currentCategory','Title','EnableMainMenu','deny','replace','ARRAYJSON','_categoryFilter','Quests','addGeneralOptions','Show','commandName','_backSprite2','createQuestListWindow','addQuestSystemquestTrackerShowCommand','createCustomBackgroundImages','createQuestObjectives','makeData','100dOmKtg','Name','quest','center','Difficulty','useItem','setQuestForQuestTrackerWindow','addCompletedQuestsCommand','claim','initQuestSystem','auto','toUpperCase','buttonAssistText4','rewards','Window_MenuCommand_addOriginalCommands','setQuestRewards','_delayDraw','parameters','questTrackerPosOff','_scene','FUNC','NUM','numItems','questsKnown','ListWindow_BgType','remove','isEnemy','TrackerShowHide','questJournalSystemUseItem','height','return\x200','TrackerWindow_Scale','questListWindowRect','filter','QuestSubtext','isFailedQuestsEnabled','BgFilename2','Game_System_initialize','itemPadding','createSpriteset','max','FailedQuests','innerWidth','completed','questTrackedQuestFmt','buttonAssistText1','_questTrackerWindow','scrollSpeed','joinQuestEntries','sort','rewardsClaimed','addFailedQuestsCommand','setQuestSubtext','makeQuestList','questRewardsClaimed','\x5cI[%1]%2','VisuMZ_1_MessageCore','questCommandName','createQuestQuote','registerCommand','<BR>','getConfigValue','quotes','Window_Options_addGeneralOptions','ConfigManager_applyData','Game_Map_requestRefresh','commandNameWindowDrawText','gainItem','adjustSprite','questQuote','createQuestTrackerWindow','drawItem','changePaintOpacity','drawTextEx','questRewardsDenied','tracked','getEmptyLogFmt','TrackedQuest','ARRAYSTR','smoothScrollUp','Key','shown','7908xSGNMn','questTrackerWindow','QuestOrder','addKnownQuestsCommand','questObjectiveClearedFmt','VisibleObjectives','isQuestFailed','addChild','iconWidth','Reward_Normal_Fmt','refreshQuestTrackerWindow','push','isCurrentCategoryOpen','addLoadListener','LogFmt','resetFontSettings','commandSymbol','iconText','refresh','addQuestCommand','STRUCT','AddShowOption','LineBreakSpace','questLogWindowRect','questObjectiveNormalFmt','makeDeepCopy','trim','ShowMainMenu','TargetIDs','Location','_labelWindow','currentSymbol','isPressed','failed','updatePageUpDownScroll','callUpdateHelp','QuestSystem','cursorPageup','createContents','Window_Options_statusText','54827ApgVeK','isQuestCompleted','version','isCompletedQuestsEnabled','Scene_Options_maxCommands','update','commandStyle','showTracker','_backSprite1','smoothSelect','addOriginalCommands','setBackgroundType','applyData','categoryList','questRewardsDeniedFmt','setLogWindow','objectivesCompleted','active','bitmap','CommandWindow_Completed_Text','initCategories','LogWindow_ScrollSpeed','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','LogWindow_Auto_WordWrap','_commandWindow','parse','questButtonAssistExpand','getTotalCategoryQuests','objectivesFailed','name','Window','commandNameWindowCenter','LogWindow_Rect','isAlive','questButtonAssistCollapse','commandWindowRect','iconHeight','ARRAYSTRUCT','icon','isKnownQuestsEnabled','boxWidth','createCommandWindow','Subtext','scaleSprite','_scrollBaseX','scale','ButtonAssistCollapse','SystemCallSceneQuest','deselect','questJournalSystemAddDeath','324196GwcuRa','TargetID','CommandWindow_Rect','popScene','applyWordWrap','concat','QuestRewards','TrackerFmt','ShowName','complete','openCloseCurrentCategory','length','setListWindow','ARRAYFUNC','Quotes','questTrackerFmt','scrollBlockHeight','requestRefresh','Scene_Map_createSpriteset','isCategoryOpen','createCommandNameWindow','createQuestLabelWindow','setQuestTrackerVisible','createQuestDescription','_quest','defaultQuestTrackerFmt','KnownQuests','_quests','setQuestStatus','ConfigManager_makeData','ListWindowCategoryOpenFmt','_categoryStatus','QuestLabel_Rect','setCategoryFilter','<WORDWRAP>%1','openness','makeCommandList','noQuestsListed','237718MxcOxV','paint','pagedown','cancel','format','commandNameWindowDrawBackground','AddPositionOption','_hasDiedBefore','General','includes','CompletedQuests','call','clamp','setTrackedQuest','questData','questsCompleted','statusText','clear','getQuestLogFmt','Scene_Menu_createCommandWindow','create','ButtonAssistExpand','isCommandEnabled','LogEmpty','doesCategoryHaveQuestsAvailable','questTrackerPosition','Game_Party_gainItem','Keys','ConvertParams','fail','addQuestCommandAutomatically','claimed','enabled','rewardsDenied','_scrollY','211118pmYMCM','QuestData','isquestMenuShown','description','processWheelScroll','convertLineBreaksForWordWrap','1fMHBXT','_listWindow','ListWindowCategoryCloseFmt','origin','setQuestDescription','Reward_Completed_Fmt','windowPadding','createEmptyText','ARRAYNUM','floor','QuestDescription','applyWordWrapEntry','questObjectiveFailedFmt','addCommand','Settings','questCategoryClosedFmt','activate','\x1bWrapBreak[0]','bind','updateCommandNameWindow','questCompletedIcon','itemTextAlign','_textHeight','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','_messageWindow','onListQuest','createQuestText','initialize','questButtonAssistActive','Rewards','pageup','AdjustRect','left','questKnownIcon','note','tradeItemWithParty','VisuMZ_1_MainMenuCore','QuestQuote','onListCategory','removed','addWindow','Objectives','addQuestSystemCommands','value','questFailedIcon','addNoQuestsListedCommand','isOkEnabled','addQuestSystemquestTrackerPositionCommand','setValue','questSubtext','isSceneMap','drawIcon','drawItemStyleIcon','maxItems','createQuestSubtext','questCompletedCmd','finalizeWordWrapSupport','ARRAYEVAL','questButtonAssistPageUpDn','createQuestRewards','Enable','updateDelayRefresh','Reward_Failed_Fmt','match','WordWrap','uiInputPosition','questRewardsClaimedFmt','TrackerChangeQuest','trackedQuest','getBackgroundOpacity','ShowFailed','questObjectivesFailed','setQuestObjectives','isQuestCommandVisible','ListWindow_Rect','VisibleRewards','noQuestsLabel','_doodadEditorMode','visibilityLevel','Scene_Boot_onDatabaseLoaded','opacity','onListCancel','Status','QuestObjectives','_commandNameWindow','setQuestQuote','category','questRewards','updateVisibility','_scrollX','smoothScrollDown','NoQuestListed','wordWrapSupport','show','index','deathStateId','baseTextRect','map','questKnownCmd','ButtonAssistPageUpDown','Game_BattlerBase_addNewState','prototype','isQuestKnown','CommandWindow_Completed_Icon','setBackgroundOpacity','isQuestTrackerVisible','objectives','questCategoryOpenedFmt','text','contentsHeight','createBackground','Categories','TrackerRefreshWindow','SystemEnableQuestMenu','exit','drawItemStyleIconText','inBattle','innerHeight','MainMenu','Game_Battler_useItem','isFailedQuestsVisible','unshift','constructor','questTrackerPosOn','commandQuest','addNewState','138386jVutqQ','deactivate','width','subtext','drawText','_tradeItemWithParty','questObjectivesCompleted','Tracker','updateLabelWindow','OnLoadQuestJS','CommandWindow_Known_Text','BgSettings','questDescription','isQuestCommandEnabled','questObjectives','setQuest','TrackerWindow_BgType','updateScrollBase','known','isquestMenuEnabled','STR','_isRefreshingQuestTrackerWindow','contents','SnapshotOpacity','process_VisuMZ_QuestSystem_Data','From','ListWindowTrackedQuest','textSizeEx','createQuestLogWindow','_questTrackerRefresh','isRightInputMode','commandStyleCheck','questLogFmt','CategoryName','loadTitle1','onCommandOk','questRewardsNormalFmt','Objective_Failed_Fmt','currentQuest','Game_Map_refresh'];const _0x4185=function(_0x304112,_0x2d463b){_0x304112=_0x304112-0x1d8;let _0x5ec920=_0x5ec9[_0x304112];return _0x5ec920;};const _0x528891=_0x4185;(function(_0x8583c2,_0x2e4443){const _0x432b92=_0x4185;while(!![]){try{const _0x271903=-parseInt(_0x432b92(0x272))+parseInt(_0x432b92(0x2c1))*parseInt(_0x432b92(0x33f))+parseInt(_0x432b92(0x2bb))+-parseInt(_0x432b92(0x36a))+parseInt(_0x432b92(0x218))*parseInt(_0x432b92(0x387))+-parseInt(_0x432b92(0x298))+-parseInt(_0x432b92(0x240));if(_0x271903===_0x2e4443)break;else _0x8583c2['push'](_0x8583c2['shift']());}catch(_0x2b9470){_0x8583c2['push'](_0x8583c2['shift']());}}}(_0x5ec9,0x68876));var label=_0x528891(0x23c),tier=tier||0x0,dependencies=[],pluginData=$plugins[_0x528891(0x1e7)](function(_0x428d64){const _0xcb46a1=_0x528891;return _0x428d64['status']&&_0x428d64[_0xcb46a1(0x2be)][_0xcb46a1(0x2a1)]('['+label+']');})[0x0];VisuMZ[label][_0x528891(0x2cf)]=VisuMZ[label][_0x528891(0x2cf)]||{},VisuMZ[_0x528891(0x2b4)]=function(_0xff974a,_0x2d959f){const _0x51d3fe=_0x528891;for(const _0x13f1c9 in _0x2d959f){if(_0x13f1c9['match'](/(.*):(.*)/i)){const _0x1269db=String(RegExp['$1']),_0x465351=String(RegExp['$2'])[_0x51d3fe(0x392)]()['trim']();let _0x1b7101,_0x751d3,_0x276517;switch(_0x465351){case _0x51d3fe(0x1db):_0x1b7101=_0x2d959f[_0x13f1c9]!==''?Number(_0x2d959f[_0x13f1c9]):0x0;break;case _0x51d3fe(0x2c9):_0x751d3=_0x2d959f[_0x13f1c9]!==''?JSON[_0x51d3fe(0x259)](_0x2d959f[_0x13f1c9]):[],_0x1b7101=_0x751d3[_0x51d3fe(0x322)](_0x18e944=>Number(_0x18e944));break;case'EVAL':_0x1b7101=_0x2d959f[_0x13f1c9]!==''?eval(_0x2d959f[_0x13f1c9]):null;break;case _0x51d3fe(0x2fa):_0x751d3=_0x2d959f[_0x13f1c9]!==''?JSON[_0x51d3fe(0x259)](_0x2d959f[_0x13f1c9]):[],_0x1b7101=_0x751d3[_0x51d3fe(0x322)](_0x2b9641=>eval(_0x2b9641));break;case'JSON':_0x1b7101=_0x2d959f[_0x13f1c9]!==''?JSON[_0x51d3fe(0x259)](_0x2d959f[_0x13f1c9]):'';break;case _0x51d3fe(0x37b):_0x751d3=_0x2d959f[_0x13f1c9]!==''?JSON['parse'](_0x2d959f[_0x13f1c9]):[],_0x1b7101=_0x751d3['map'](_0x142e28=>JSON['parse'](_0x142e28));break;case _0x51d3fe(0x1da):_0x1b7101=_0x2d959f[_0x13f1c9]!==''?new Function(JSON[_0x51d3fe(0x259)](_0x2d959f[_0x13f1c9])):new Function(_0x51d3fe(0x1e4));break;case _0x51d3fe(0x27f):_0x751d3=_0x2d959f[_0x13f1c9]!==''?JSON[_0x51d3fe(0x259)](_0x2d959f[_0x13f1c9]):[],_0x1b7101=_0x751d3[_0x51d3fe(0x322)](_0x595142=>new Function(JSON[_0x51d3fe(0x259)](_0x595142)));break;case _0x51d3fe(0x353):_0x1b7101=_0x2d959f[_0x13f1c9]!==''?String(_0x2d959f[_0x13f1c9]):'';break;case _0x51d3fe(0x214):_0x751d3=_0x2d959f[_0x13f1c9]!==''?JSON['parse'](_0x2d959f[_0x13f1c9]):[],_0x1b7101=_0x751d3[_0x51d3fe(0x322)](_0x4fa152=>String(_0x4fa152));break;case _0x51d3fe(0x22c):_0x276517=_0x2d959f[_0x13f1c9]!==''?JSON[_0x51d3fe(0x259)](_0x2d959f[_0x13f1c9]):{},_0x1b7101=VisuMZ[_0x51d3fe(0x2b4)]({},_0x276517);break;case _0x51d3fe(0x265):_0x751d3=_0x2d959f[_0x13f1c9]!==''?JSON[_0x51d3fe(0x259)](_0x2d959f[_0x13f1c9]):[],_0x1b7101=_0x751d3[_0x51d3fe(0x322)](_0x3c61da=>VisuMZ[_0x51d3fe(0x2b4)]({},JSON[_0x51d3fe(0x259)](_0x3c61da)));break;default:continue;}_0xff974a[_0x1269db]=_0x1b7101;}}return _0xff974a;},(_0x33928d=>{const _0x3dd31e=_0x528891,_0x31cddc=_0x33928d[_0x3dd31e(0x25d)];for(const _0x4ee7c2 of dependencies){if(!Imported[_0x4ee7c2]){alert(_0x3dd31e(0x2d8)[_0x3dd31e(0x29c)](_0x31cddc,_0x4ee7c2)),SceneManager[_0x3dd31e(0x333)]();break;}}const _0x2e9f50=_0x33928d[_0x3dd31e(0x2be)];if(_0x2e9f50[_0x3dd31e(0x300)](/\[Version[ ](.*?)\]/i)){const _0x26107e=Number(RegExp['$1']);_0x26107e!==VisuMZ[label][_0x3dd31e(0x242)]&&(alert(_0x3dd31e(0x256)[_0x3dd31e(0x29c)](_0x31cddc,_0x26107e)),SceneManager[_0x3dd31e(0x333)]());}if(_0x2e9f50[_0x3dd31e(0x300)](/\[Tier[ ](\d+)\]/i)){const _0x50f75d=Number(RegExp['$1']);_0x50f75d<tier?(alert('%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.'[_0x3dd31e(0x29c)](_0x31cddc,_0x50f75d,tier)),SceneManager[_0x3dd31e(0x333)]()):tier=Math['max'](_0x50f75d,tier);}VisuMZ[_0x3dd31e(0x2b4)](VisuMZ[label][_0x3dd31e(0x2cf)],_0x33928d[_0x3dd31e(0x398)]);})(pluginData),PluginManager[_0x528891(0x201)](pluginData[_0x528891(0x25d)],'QuestSet',_0x4969ff=>{const _0x357835=_0x528891;VisuMZ[_0x357835(0x2b4)](_0x4969ff,_0x4969ff);const _0x3f808d=_0x4969ff[_0x357835(0x2b3)],_0xd3ec01=_0x4969ff[_0x357835(0x313)];for(const _0x47ed0e of _0x3f808d){$gameSystem[_0x357835(0x28e)](_0x47ed0e,_0xd3ec01);}SceneManager[_0x357835(0x2f3)]()&&SceneManager[_0x357835(0x1d9)][_0x357835(0x222)]();}),PluginManager[_0x528891(0x201)](pluginData['name'],_0x528891(0x2cb),_0x4b3116=>{const _0x473737=_0x528891;VisuMZ[_0x473737(0x2b4)](_0x4b3116,_0x4b3116);const _0x2fb237=_0x4b3116[_0x473737(0x2b3)],_0x13dc98=_0x4b3116['TargetID'];for(const _0x4c0baf of _0x2fb237){$gameSystem['setQuestDescription'](_0x4c0baf,_0x13dc98);}SceneManager[_0x473737(0x2f3)]()&&SceneManager[_0x473737(0x1d9)][_0x473737(0x222)]();}),PluginManager[_0x528891(0x201)](pluginData[_0x528891(0x25d)],_0x528891(0x314),_0x15233b=>{const _0x32135b=_0x528891;VisuMZ[_0x32135b(0x2b4)](_0x15233b,_0x15233b);const _0x23de50=_0x15233b['Keys'],_0x3c9e7d=_0x15233b['TargetIDs'],_0x4bbad4=_0x15233b[_0x32135b(0x313)];for(const _0x2896f5 of _0x23de50){$gameSystem[_0x32135b(0x309)](_0x2896f5,_0x3c9e7d,_0x4bbad4);}SceneManager[_0x32135b(0x2f3)]()&&SceneManager[_0x32135b(0x1d9)][_0x32135b(0x222)]();}),PluginManager['registerCommand'](pluginData['name'],_0x528891(0x2e6),_0x1213e0=>{const _0x28bf70=_0x528891;VisuMZ[_0x28bf70(0x2b4)](_0x1213e0,_0x1213e0);const _0x412efb=_0x1213e0['Keys'],_0x5c9d74=_0x1213e0['TargetID'];for(const _0x408047 of _0x412efb){$gameSystem[_0x28bf70(0x316)](_0x408047,_0x5c9d74);}SceneManager[_0x28bf70(0x2f3)]()&&SceneManager[_0x28bf70(0x1d9)][_0x28bf70(0x222)]();}),PluginManager[_0x528891(0x201)](pluginData[_0x528891(0x25d)],_0x528891(0x278),_0x1df3da=>{const _0x52091d=_0x528891;VisuMZ[_0x52091d(0x2b4)](_0x1df3da,_0x1df3da);const _0x465869=_0x1df3da[_0x52091d(0x2b3)],_0x18f137=_0x1df3da[_0x52091d(0x234)],_0x52a2cf=_0x1df3da[_0x52091d(0x313)];for(const _0x1821be of _0x465869){$gameSystem[_0x52091d(0x396)](_0x1821be,_0x18f137,_0x52a2cf);}SceneManager[_0x52091d(0x2f3)]()&&SceneManager[_0x52091d(0x1d9)][_0x52091d(0x222)]();}),PluginManager[_0x528891(0x201)](pluginData['name'],_0x528891(0x1e8),_0x7b5d55=>{const _0x1e92f7=_0x528891;VisuMZ['ConvertParams'](_0x7b5d55,_0x7b5d55);const _0x56821c=_0x7b5d55[_0x1e92f7(0x2b3)],_0x4ba808=_0x7b5d55[_0x1e92f7(0x273)];for(const _0x1aeae5 of _0x56821c){$gameSystem['setQuestSubtext'](_0x1aeae5,_0x4ba808);}SceneManager[_0x1e92f7(0x2f3)]()&&SceneManager[_0x1e92f7(0x1d9)][_0x1e92f7(0x222)]();}),PluginManager['registerCommand'](pluginData[_0x528891(0x25d)],_0x528891(0x304),_0x1abd2a=>{const _0x3bad83=_0x528891;VisuMZ[_0x3bad83(0x2b4)](_0x1abd2a,_0x1abd2a);const _0x1145f8=_0x1abd2a[_0x3bad83(0x216)];$gameSystem[_0x3bad83(0x2a5)](_0x1145f8),SceneManager['isSceneMap']()&&SceneManager[_0x3bad83(0x1d9)][_0x3bad83(0x222)]();}),PluginManager[_0x528891(0x201)](pluginData[_0x528891(0x25d)],_0x528891(0x331),_0x5524fb=>{const _0x3a540f=_0x528891;if(!SceneManager[_0x3a540f(0x2f3)]())return;SceneManager['_scene']['refreshQuestTrackerWindow']();}),PluginManager[_0x528891(0x201)](pluginData[_0x528891(0x25d)],_0x528891(0x1e1),_0x54c6cb=>{const _0xed0d81=_0x528891;VisuMZ[_0xed0d81(0x2b4)](_0x54c6cb,_0x54c6cb),$gameSystem[_0xed0d81(0x288)](_0x54c6cb[_0xed0d81(0x37f)]),SceneManager['isSceneMap']()&&SceneManager[_0xed0d81(0x1d9)]['refreshQuestTrackerWindow']();}),PluginManager[_0x528891(0x201)](pluginData[_0x528891(0x25d)],_0x528891(0x26f),_0x1bc350=>{const _0x127893=_0x528891;if($gameParty[_0x127893(0x335)]())return;SceneManager['push'](Scene_Quest);}),PluginManager['registerCommand'](pluginData[_0x528891(0x25d)],_0x528891(0x332),_0x24dec0=>{const _0x44f98e=_0x528891;VisuMZ[_0x44f98e(0x2b4)](_0x24dec0,_0x24dec0),$gameSystem[_0x44f98e(0x2a6)]()[_0x44f98e(0x2b8)]=_0x24dec0[_0x44f98e(0x2fd)];}),PluginManager[_0x528891(0x201)](pluginData['name'],'SystemShowQuestMenu',_0x4225fc=>{const _0x478ede=_0x528891;VisuMZ[_0x478ede(0x2b4)](_0x4225fc,_0x4225fc),$gameSystem[_0x478ede(0x2a6)]()[_0x478ede(0x217)]=_0x4225fc[_0x478ede(0x37f)];}),VisuMZ[_0x528891(0x23c)][_0x528891(0x310)]=Scene_Boot[_0x528891(0x326)]['onDatabaseLoaded'],Scene_Boot[_0x528891(0x326)]['onDatabaseLoaded']=function(){const _0x22a763=_0x528891;VisuMZ[_0x22a763(0x23c)]['Scene_Boot_onDatabaseLoaded'][_0x22a763(0x2a3)](this),this[_0x22a763(0x357)]();},VisuMZ[_0x528891(0x23c)]['QuestOrder']=[],VisuMZ[_0x528891(0x23c)][_0x528891(0x2bc)]={},Scene_Boot['prototype'][_0x528891(0x357)]=function(){const _0x5ec90f=_0x528891;for(const _0xc16305 of VisuMZ[_0x5ec90f(0x23c)][_0x5ec90f(0x2cf)][_0x5ec90f(0x330)]){if(!_0xc16305)continue;for(const _0x4db2db of _0xc16305[_0x5ec90f(0x37d)]){if(!_0x4db2db)continue;_0x4db2db[_0x5ec90f(0x317)]=_0xc16305,_0x4db2db['Description'][_0x5ec90f(0x33a)](''),_0x4db2db[_0x5ec90f(0x2ea)][_0x5ec90f(0x33a)](''),_0x4db2db[_0x5ec90f(0x2de)][_0x5ec90f(0x33a)](''),_0x4db2db[_0x5ec90f(0x26a)][_0x5ec90f(0x33a)](''),_0x4db2db['Quotes'][_0x5ec90f(0x33a)]('');const _0x5b3756=_0x4db2db[_0x5ec90f(0x216)][_0x5ec90f(0x392)]()['trim']();VisuMZ[_0x5ec90f(0x23c)][_0x5ec90f(0x21a)]['push'](_0x5b3756),VisuMZ[_0x5ec90f(0x23c)][_0x5ec90f(0x2bc)][_0x5b3756]=_0x4db2db;}}},ConfigManager[_0x528891(0x36b)]=!![],ConfigManager['questTrackerPosition']=!![],VisuMZ[_0x528891(0x23c)][_0x528891(0x28f)]=ConfigManager[_0x528891(0x386)],ConfigManager[_0x528891(0x386)]=function(){const _0x4f4f58=_0x528891,_0x5515e3=VisuMZ[_0x4f4f58(0x23c)]['ConfigManager_makeData']['call'](this);return _0x5515e3['questTrackerShow']=this[_0x4f4f58(0x36b)],_0x5515e3['questTrackerPosition']=this['questTrackerPosition'],_0x5515e3;},VisuMZ['QuestSystem'][_0x528891(0x206)]=ConfigManager[_0x528891(0x24c)],ConfigManager[_0x528891(0x24c)]=function(_0x407e9b){const _0x3cc3e2=_0x528891;VisuMZ[_0x3cc3e2(0x23c)]['ConfigManager_applyData'][_0x3cc3e2(0x2a3)](this,_0x407e9b),_0x3cc3e2(0x36b)in _0x407e9b?this[_0x3cc3e2(0x36b)]=_0x407e9b['questTrackerShow']:this['questTrackerShow']=!![],_0x3cc3e2(0x2b1)in _0x407e9b?this[_0x3cc3e2(0x2b1)]=_0x407e9b[_0x3cc3e2(0x2b1)]:this['questTrackerPosition']=!![];},ImageManager[_0x528891(0x2e2)]=VisuMZ[_0x528891(0x23c)]['Settings'][_0x528891(0x2a0)]['CommandWindow_Known_Icon'],ImageManager[_0x528891(0x2d5)]=VisuMZ['QuestSystem'][_0x528891(0x2cf)][_0x528891(0x2a0)][_0x528891(0x328)],ImageManager[_0x528891(0x2ed)]=VisuMZ[_0x528891(0x23c)][_0x528891(0x2cf)]['General']['CommandWindow_Failed_Icon'],TextManager[_0x528891(0x1ff)]=VisuMZ[_0x528891(0x23c)]['Settings'][_0x528891(0x337)][_0x528891(0x388)],TextManager[_0x528891(0x323)]=VisuMZ['QuestSystem'][_0x528891(0x2cf)]['General'][_0x528891(0x349)],TextManager[_0x528891(0x2f8)]=VisuMZ[_0x528891(0x23c)][_0x528891(0x2cf)]['General'][_0x528891(0x253)],TextManager[_0x528891(0x372)]=VisuMZ[_0x528891(0x23c)][_0x528891(0x2cf)][_0x528891(0x2a0)]['CommandWindow_Failed_Text'],TextManager[_0x528891(0x32c)]=VisuMZ['QuestSystem'][_0x528891(0x2cf)]['General'][_0x528891(0x290)],TextManager[_0x528891(0x2d0)]=VisuMZ[_0x528891(0x23c)]['Settings'][_0x528891(0x2a0)][_0x528891(0x2c3)],TextManager[_0x528891(0x30d)]=VisuMZ[_0x528891(0x23c)][_0x528891(0x2cf)][_0x528891(0x2a0)]['EmptyTitleLabel'],TextManager[_0x528891(0x297)]=VisuMZ[_0x528891(0x23c)][_0x528891(0x2cf)][_0x528891(0x2a0)][_0x528891(0x31c)],TextManager[_0x528891(0x35f)]=VisuMZ[_0x528891(0x23c)][_0x528891(0x2cf)]['General'][_0x528891(0x226)],TextManager['questEmptyText']=VisuMZ[_0x528891(0x23c)]['Settings'][_0x528891(0x2a0)][_0x528891(0x2af)],TextManager[_0x528891(0x230)]=VisuMZ[_0x528891(0x23c)][_0x528891(0x2cf)]['General']['Objective_Normal_Fmt'],TextManager[_0x528891(0x21c)]=VisuMZ['QuestSystem'][_0x528891(0x2cf)][_0x528891(0x2a0)]['Objective_Completed_Fmt'],TextManager[_0x528891(0x2cd)]=VisuMZ['QuestSystem']['Settings']['General'][_0x528891(0x364)],TextManager[_0x528891(0x363)]=VisuMZ[_0x528891(0x23c)][_0x528891(0x2cf)][_0x528891(0x2a0)][_0x528891(0x221)],TextManager['questRewardsClaimedFmt']=VisuMZ[_0x528891(0x23c)]['Settings'][_0x528891(0x2a0)][_0x528891(0x2c6)],TextManager['questRewardsDeniedFmt']=VisuMZ[_0x528891(0x23c)][_0x528891(0x2cf)][_0x528891(0x2a0)][_0x528891(0x2ff)],TextManager['questButtonAssistPageUpDn']=VisuMZ[_0x528891(0x23c)]['Settings'][_0x528891(0x2a0)][_0x528891(0x324)],TextManager['questButtonAssistActive']=VisuMZ[_0x528891(0x23c)][_0x528891(0x2cf)][_0x528891(0x2a0)][_0x528891(0x2dd)],TextManager[_0x528891(0x25a)]=VisuMZ[_0x528891(0x23c)]['Settings']['General'][_0x528891(0x2ad)],TextManager[_0x528891(0x262)]=VisuMZ[_0x528891(0x23c)][_0x528891(0x2cf)][_0x528891(0x2a0)][_0x528891(0x26e)],TextManager[_0x528891(0x28b)]='\x0a\x5c{[[Title]]\x5c}\x0a[[Objectives]]\x0a',TextManager['questTrackerFmt']=VisuMZ[_0x528891(0x23c)][_0x528891(0x2cf)][_0x528891(0x346)][_0x528891(0x279)]||TextManager['defaultQuestTrackerFmt'],TextManager[_0x528891(0x1f2)]=VisuMZ['QuestSystem']['Settings'][_0x528891(0x2a0)][_0x528891(0x359)],TextManager['questTrackerShow']=VisuMZ[_0x528891(0x23c)][_0x528891(0x2cf)][_0x528891(0x346)][_0x528891(0x27a)],TextManager[_0x528891(0x2b1)]=VisuMZ[_0x528891(0x23c)][_0x528891(0x2cf)][_0x528891(0x346)]['PositionName'],TextManager[_0x528891(0x1d8)]=VisuMZ['QuestSystem'][_0x528891(0x2cf)][_0x528891(0x346)]['PositionOff'],TextManager[_0x528891(0x33c)]=VisuMZ['QuestSystem']['Settings'][_0x528891(0x346)]['PositionOn'],SceneManager[_0x528891(0x2f3)]=function(){const _0x438adf=_0x528891;return this['_scene']&&this[_0x438adf(0x1d9)][_0x438adf(0x33b)]===Scene_Map;},VisuMZ['QuestSystem'][_0x528891(0x1eb)]=Game_System[_0x528891(0x326)][_0x528891(0x2dc)],Game_System[_0x528891(0x326)]['initialize']=function(){const _0x3a2451=_0x528891;VisuMZ[_0x3a2451(0x23c)][_0x3a2451(0x1eb)]['call'](this),this[_0x3a2451(0x390)]();},Game_System[_0x528891(0x326)][_0x528891(0x390)]=function(){const _0x24c69a=_0x528891,_0x33e5d8=VisuMZ[_0x24c69a(0x23c)][_0x24c69a(0x2cf)][_0x24c69a(0x2a0)],_0x4c9264=VisuMZ['QuestSystem'][_0x24c69a(0x2cf)]['MainMenu'];this['_quests']={'shown':_0x4c9264[_0x24c69a(0x233)],'enabled':_0x4c9264[_0x24c69a(0x378)],'known':[],'completed':[],'failed':[],'description':{},'objectives':{},'objectivesCompleted':{},'objectivesFailed':{},'rewards':{},'rewardsClaimed':{},'rewardsDenied':{},'subtext':{},'quotes':{},'tracked':_0x33e5d8[_0x24c69a(0x213)][_0x24c69a(0x392)]()[_0x24c69a(0x232)](),'showTracker':!![]};for(const _0x49db18 of _0x33e5d8[_0x24c69a(0x28c)]){this[_0x24c69a(0x28e)](_0x49db18,_0x24c69a(0x351));}for(const _0x4f0113 of _0x33e5d8[_0x24c69a(0x2a2)]){this['setQuestStatus'](_0x4f0113,_0x24c69a(0x1f1));}for(const _0x3fa27c of _0x33e5d8[_0x24c69a(0x1ef)]){this[_0x24c69a(0x28e)](_0x3fa27c,_0x24c69a(0x239));}},Game_System[_0x528891(0x326)][_0x528891(0x389)]=function(_0x568461){const _0x226edb=_0x528891;return _0x568461=_0x568461[_0x226edb(0x392)]()[_0x226edb(0x232)](),VisuMZ[_0x226edb(0x23c)][_0x226edb(0x2bc)][_0x568461];},Game_System['prototype'][_0x528891(0x2a6)]=function(){const _0x568b21=_0x528891;if(this[_0x568b21(0x28d)]===undefined)this[_0x568b21(0x390)]();return this[_0x568b21(0x28d)];},Game_System[_0x528891(0x326)]['isquestMenuShown']=function(){const _0x4b4e6f=_0x528891;return this[_0x4b4e6f(0x2a6)]()[_0x4b4e6f(0x217)];},Game_System['prototype'][_0x528891(0x352)]=function(){const _0x3f5bfa=_0x528891;return this[_0x3f5bfa(0x2a6)]()[_0x3f5bfa(0x2b8)];},Game_System[_0x528891(0x326)]['setQuestStatus']=function(_0x36f893,_0x1a03ca){const _0x336ae5=_0x528891;_0x36f893=_0x36f893[_0x336ae5(0x392)]()['trim']();if(!VisuMZ['QuestSystem'][_0x336ae5(0x2bc)][_0x36f893])return;const _0x43eb82=this[_0x336ae5(0x2a6)]();_0x43eb82[_0x336ae5(0x351)]=_0x43eb82[_0x336ae5(0x351)]||[],_0x43eb82[_0x336ae5(0x1f1)]=_0x43eb82['completed']||[],_0x43eb82[_0x336ae5(0x239)]=_0x43eb82[_0x336ae5(0x239)]||[],_0x43eb82[_0x336ae5(0x351)]['remove'](_0x36f893),_0x43eb82[_0x336ae5(0x1f1)]['remove'](_0x36f893),_0x43eb82[_0x336ae5(0x239)][_0x336ae5(0x1df)](_0x36f893);if(_0x1a03ca!=='remove')_0x43eb82[_0x1a03ca][_0x336ae5(0x223)](_0x36f893);_0x36f893===_0x43eb82['tracked'][_0x336ae5(0x392)]()[_0x336ae5(0x232)]()&&(_0x1a03ca!==_0x336ae5(0x351)&&this[_0x336ae5(0x2a5)](''));},Game_System[_0x528891(0x326)]['questsKnown']=function(){const _0x2f2b77=_0x528891,_0x72cfb3=this['questData']();return _0x72cfb3[_0x2f2b77(0x351)]=_0x72cfb3[_0x2f2b77(0x351)]||[],_0x72cfb3['known'][_0x2f2b77(0x322)](_0x4c094b=>this[_0x2f2b77(0x389)](_0x4c094b))[_0x2f2b77(0x1df)](null);},Game_System[_0x528891(0x326)][_0x528891(0x327)]=function(_0x5bdeb8){const _0x461ded=_0x528891,_0x589b6d=this[_0x461ded(0x2a6)]();return _0x589b6d['known']=_0x589b6d[_0x461ded(0x351)]||[],_0x5bdeb8=_0x5bdeb8[_0x461ded(0x392)]()[_0x461ded(0x232)](),_0x589b6d[_0x461ded(0x351)]['includes'](_0x5bdeb8);},Game_System[_0x528891(0x326)][_0x528891(0x2a7)]=function(){const _0x200123=_0x528891,_0xbb3054=this[_0x200123(0x2a6)]();return _0xbb3054['completed']=_0xbb3054[_0x200123(0x1f1)]||[],_0xbb3054[_0x200123(0x1f1)]['map'](_0x355ea9=>this[_0x200123(0x389)](_0x355ea9))['remove'](null);},Game_System[_0x528891(0x326)][_0x528891(0x241)]=function(_0x40eb73){const _0x1b4245=_0x528891,_0x51957a=this['questData']();return _0x51957a[_0x1b4245(0x1f1)]=_0x51957a['completed']||[],_0x40eb73=_0x40eb73[_0x1b4245(0x392)]()['trim'](),_0x51957a['completed']['includes'](_0x40eb73);},Game_System[_0x528891(0x326)][_0x528891(0x370)]=function(){const _0x45dba9=_0x528891,_0x1c03d7=this['questData']();return _0x1c03d7[_0x45dba9(0x239)]=_0x1c03d7[_0x45dba9(0x239)]||[],_0x1c03d7[_0x45dba9(0x239)][_0x45dba9(0x322)](_0x78bba4=>this['quest'](_0x78bba4))[_0x45dba9(0x1df)](null);},Game_System[_0x528891(0x326)][_0x528891(0x21e)]=function(_0x5091cb){const _0x48893c=_0x528891,_0x8fdeb6=this[_0x48893c(0x2a6)]();return _0x8fdeb6['failed']=_0x8fdeb6[_0x48893c(0x239)]||[],_0x5091cb=_0x5091cb[_0x48893c(0x392)]()['trim'](),_0x8fdeb6['failed']['includes'](_0x5091cb);},Game_System[_0x528891(0x326)][_0x528891(0x34b)]=function(_0x18391e){const _0xd47328=_0x528891;_0x18391e=_0x18391e['toUpperCase']()['trim']();const _0x41de94=this[_0xd47328(0x389)](_0x18391e);if(!_0x41de94)return'';const _0x334b79=this[_0xd47328(0x2a6)]()[_0xd47328(0x2be)];_0x334b79[_0x18391e]=_0x334b79[_0x18391e]||0x1;const _0x37b2c2=_0x334b79[_0x18391e];return _0x41de94['Description'][_0x37b2c2]||'';},Game_System[_0x528891(0x326)][_0x528891(0x2c5)]=function(_0x4b60ef,_0x440be7){const _0x850c6e=_0x528891;_0x4b60ef=_0x4b60ef[_0x850c6e(0x392)]()[_0x850c6e(0x232)]();const _0x56fad6=this['quest'](_0x4b60ef);if(!_0x56fad6)return'';const _0x26c268=this['questData']()[_0x850c6e(0x2be)];_0x26c268[_0x4b60ef]=_0x440be7;},Game_System[_0x528891(0x326)][_0x528891(0x34d)]=function(_0x23ec87){const _0x93d762=_0x528891;_0x23ec87=_0x23ec87[_0x93d762(0x392)]()[_0x93d762(0x232)]();const _0x570eb8=this[_0x93d762(0x389)](_0x23ec87);if(!_0x570eb8)return'';const _0x1a630a=this['questData']();return _0x1a630a[_0x93d762(0x32b)]=_0x1a630a[_0x93d762(0x32b)]||{},!_0x1a630a['objectives'][_0x23ec87]&&(_0x1a630a[_0x93d762(0x32b)][_0x23ec87]=JsonEx['makeDeepCopy'](_0x570eb8[_0x93d762(0x21d)])),_0x1a630a[_0x93d762(0x32b)][_0x23ec87][_0x93d762(0x1f7)]((_0x4c40a8,_0x3be431)=>_0x4c40a8-_0x3be431);},Game_System['prototype'][_0x528891(0x309)]=function(_0x425902,_0x1d3b65,_0x36d35b){const _0x241981=_0x528891;_0x425902=_0x425902[_0x241981(0x392)]()[_0x241981(0x232)]();const _0x5db8a6=this[_0x241981(0x389)](_0x425902);if(!_0x5db8a6)return'';const _0x3c8e9b=this[_0x241981(0x2a6)]();_0x3c8e9b[_0x241981(0x32b)]=_0x3c8e9b[_0x241981(0x32b)]||{};!_0x3c8e9b['objectives'][_0x425902]&&(_0x3c8e9b[_0x241981(0x32b)][_0x425902]=JsonEx[_0x241981(0x231)](_0x5db8a6[_0x241981(0x21d)]));_0x3c8e9b[_0x241981(0x32b)][_0x425902]=_0x3c8e9b[_0x241981(0x32b)][_0x425902]||[],_0x3c8e9b[_0x241981(0x250)][_0x425902]=_0x3c8e9b[_0x241981(0x250)][_0x425902]||[],_0x3c8e9b[_0x241981(0x25c)][_0x425902]=_0x3c8e9b['objectivesFailed'][_0x425902]||[];for(const _0x324e3a of _0x1d3b65){_0x3c8e9b[_0x241981(0x32b)][_0x425902][_0x241981(0x1df)](_0x324e3a),_0x3c8e9b[_0x241981(0x250)][_0x425902][_0x241981(0x1df)](_0x324e3a),_0x3c8e9b['objectivesFailed'][_0x425902][_0x241981(0x1df)](_0x324e3a);switch(_0x36d35b){case _0x241981(0x31e):case _0x241981(0x351):_0x3c8e9b[_0x241981(0x32b)][_0x425902][_0x241981(0x223)](_0x324e3a);break;case _0x241981(0x27b):case _0x241981(0x1f1):_0x3c8e9b[_0x241981(0x250)][_0x425902][_0x241981(0x223)](_0x324e3a);break;case _0x241981(0x2b5):case'failed':_0x3c8e9b[_0x241981(0x25c)][_0x425902][_0x241981(0x223)](_0x324e3a);break;case'remove':case _0x241981(0x2e8):break;}}},Game_System[_0x528891(0x326)][_0x528891(0x345)]=function(_0x5d4086){const _0x1bec93=_0x528891;_0x5d4086=_0x5d4086[_0x1bec93(0x392)]()[_0x1bec93(0x232)]();const _0x9224c0=this[_0x1bec93(0x389)](_0x5d4086);if(!_0x9224c0)return'';const _0x4f4e8f=this['questData']();return _0x4f4e8f[_0x1bec93(0x250)]=_0x4f4e8f[_0x1bec93(0x250)]||{},_0x4f4e8f[_0x1bec93(0x250)][_0x5d4086]=_0x4f4e8f['objectivesCompleted'][_0x5d4086]||[],_0x4f4e8f[_0x1bec93(0x250)][_0x5d4086]['sort']((_0x18e120,_0x3c1f35)=>_0x18e120-_0x3c1f35);},Game_System[_0x528891(0x326)][_0x528891(0x308)]=function(_0x18a01a){const _0x3d7c76=_0x528891;_0x18a01a=_0x18a01a[_0x3d7c76(0x392)]()[_0x3d7c76(0x232)]();const _0x5eda41=this[_0x3d7c76(0x389)](_0x18a01a);if(!_0x5eda41)return'';const _0x24a1d7=this[_0x3d7c76(0x2a6)]();return _0x24a1d7['objectivesFailed']=_0x24a1d7[_0x3d7c76(0x25c)]||{},_0x24a1d7['objectivesFailed'][_0x18a01a]=_0x24a1d7[_0x3d7c76(0x25c)][_0x18a01a]||[],_0x24a1d7[_0x3d7c76(0x25c)][_0x18a01a][_0x3d7c76(0x1f7)]((_0x5f57bc,_0x51d62e)=>_0x5f57bc-_0x51d62e);},Game_System['prototype'][_0x528891(0x318)]=function(_0x45541f){const _0x48224c=_0x528891;_0x45541f=_0x45541f[_0x48224c(0x392)]()[_0x48224c(0x232)]();const _0x13d0ab=this[_0x48224c(0x389)](_0x45541f);if(!_0x13d0ab)return'';const _0x492a25=this[_0x48224c(0x2a6)]();return _0x492a25['rewards']=_0x492a25[_0x48224c(0x394)]||{},!_0x492a25[_0x48224c(0x394)][_0x45541f]&&(_0x492a25['rewards'][_0x45541f]=JsonEx[_0x48224c(0x231)](_0x13d0ab[_0x48224c(0x30c)])),_0x492a25[_0x48224c(0x394)][_0x45541f][_0x48224c(0x1f7)]((_0x5268da,_0x4e70ae)=>_0x5268da-_0x4e70ae);},Game_System[_0x528891(0x326)][_0x528891(0x396)]=function(_0x21ae78,_0x367407,_0x4d31d8){const _0x11ff53=_0x528891;_0x21ae78=_0x21ae78[_0x11ff53(0x392)]()[_0x11ff53(0x232)]();const _0x372411=this[_0x11ff53(0x389)](_0x21ae78);if(!_0x372411)return'';const _0x4efe50=this[_0x11ff53(0x2a6)]();_0x4efe50['rewards']=_0x4efe50[_0x11ff53(0x394)]||{};!_0x4efe50[_0x11ff53(0x394)][_0x21ae78]&&(_0x4efe50[_0x11ff53(0x394)][_0x21ae78]=JsonEx['makeDeepCopy'](_0x372411[_0x11ff53(0x30c)]));_0x4efe50[_0x11ff53(0x394)][_0x21ae78]=_0x4efe50[_0x11ff53(0x394)][_0x21ae78]||[],_0x4efe50['rewardsClaimed'][_0x21ae78]=_0x4efe50[_0x11ff53(0x1f8)][_0x21ae78]||[],_0x4efe50[_0x11ff53(0x2b9)][_0x21ae78]=_0x4efe50[_0x11ff53(0x2b9)][_0x21ae78]||[];for(const _0x202381 of _0x367407){_0x4efe50[_0x11ff53(0x394)][_0x21ae78][_0x11ff53(0x1df)](_0x202381),_0x4efe50[_0x11ff53(0x1f8)][_0x21ae78]['remove'](_0x202381),_0x4efe50[_0x11ff53(0x2b9)][_0x21ae78][_0x11ff53(0x1df)](_0x202381);switch(_0x4d31d8){case _0x11ff53(0x31e):case'known':_0x4efe50['rewards'][_0x21ae78][_0x11ff53(0x223)](_0x202381);break;case _0x11ff53(0x38f):case _0x11ff53(0x2b7):_0x4efe50[_0x11ff53(0x1f8)][_0x21ae78][_0x11ff53(0x223)](_0x202381);break;case _0x11ff53(0x379):case'denied':_0x4efe50[_0x11ff53(0x2b9)][_0x21ae78][_0x11ff53(0x223)](_0x202381);break;case _0x11ff53(0x1df):case _0x11ff53(0x2e8):break;}}},Game_System[_0x528891(0x326)][_0x528891(0x1fc)]=function(_0x17ca80){const _0x113cd2=_0x528891;_0x17ca80=_0x17ca80[_0x113cd2(0x392)]()[_0x113cd2(0x232)]();const _0x4c9350=this[_0x113cd2(0x389)](_0x17ca80);if(!_0x4c9350)return'';const _0x12521b=this['questData']();return _0x12521b[_0x113cd2(0x1f8)]=_0x12521b[_0x113cd2(0x1f8)]||{},_0x12521b[_0x113cd2(0x1f8)][_0x17ca80]=_0x12521b[_0x113cd2(0x1f8)][_0x17ca80]||[],_0x12521b[_0x113cd2(0x1f8)][_0x17ca80][_0x113cd2(0x1f7)]((_0x2d2f36,_0x596597)=>_0x2d2f36-_0x596597);},Game_System[_0x528891(0x326)][_0x528891(0x210)]=function(_0x13aae7){const _0x389e2c=_0x528891;_0x13aae7=_0x13aae7[_0x389e2c(0x392)]()['trim']();const _0x4829e3=this[_0x389e2c(0x389)](_0x13aae7);if(!_0x4829e3)return'';const _0x4e7230=this[_0x389e2c(0x2a6)]();return _0x4e7230[_0x389e2c(0x2b9)]=_0x4e7230[_0x389e2c(0x2b9)]||{},_0x4e7230[_0x389e2c(0x2b9)][_0x13aae7]=_0x4e7230['rewardsDenied'][_0x13aae7]||[],_0x4e7230[_0x389e2c(0x2b9)][_0x13aae7][_0x389e2c(0x1f7)]((_0x57bab6,_0xa6eb81)=>_0x57bab6-_0xa6eb81);},Game_System[_0x528891(0x326)][_0x528891(0x2f2)]=function(_0x371ca6){const _0x42949f=_0x528891;_0x371ca6=_0x371ca6[_0x42949f(0x392)]()['trim']();const _0x787ef5=this[_0x42949f(0x389)](_0x371ca6);if(!_0x787ef5)return'';const _0x54c30b=this[_0x42949f(0x2a6)]()['subtext'];_0x54c30b[_0x371ca6]=_0x54c30b[_0x371ca6]||0x1;const _0x1c370c=_0x54c30b[_0x371ca6];return _0x787ef5[_0x42949f(0x26a)][_0x1c370c]||'';},Game_System['prototype'][_0x528891(0x1fa)]=function(_0xcf815d,_0xeafa05){const _0x5aad86=_0x528891;_0xcf815d=_0xcf815d[_0x5aad86(0x392)]()[_0x5aad86(0x232)]();const _0x454b13=this[_0x5aad86(0x389)](_0xcf815d);if(!_0x454b13)return'';const _0x28d31f=this[_0x5aad86(0x2a6)]()[_0x5aad86(0x342)];_0x28d31f[_0xcf815d]=_0xeafa05;},Game_System['prototype'][_0x528891(0x20b)]=function(_0x58f46b){const _0x1632b4=_0x528891;_0x58f46b=_0x58f46b[_0x1632b4(0x392)]()['trim']();const _0x18f7ce=this[_0x1632b4(0x389)](_0x58f46b);if(!_0x18f7ce)return'';const _0x425cca=this['questData']()[_0x1632b4(0x204)];_0x425cca[_0x58f46b]=_0x425cca[_0x58f46b]||0x1;const _0x1e5a60=_0x425cca[_0x58f46b];return _0x18f7ce[_0x1632b4(0x280)][_0x1e5a60]||'';},Game_System[_0x528891(0x326)]['setQuestQuote']=function(_0x19d10f,_0x5a06f2){const _0x2bc082=_0x528891;_0x19d10f=_0x19d10f['toUpperCase']()[_0x2bc082(0x232)]();const _0x5dcdcc=this[_0x2bc082(0x389)](_0x19d10f);if(!_0x5dcdcc)return'';const _0x9a950e=this[_0x2bc082(0x2a6)]()['quotes'];_0x9a950e[_0x19d10f]=_0x5a06f2;},Game_System[_0x528891(0x326)][_0x528891(0x305)]=function(){const _0xb3c377=_0x528891,_0x4c3740=this[_0xb3c377(0x2a6)]();return this[_0xb3c377(0x389)](_0x4c3740[_0xb3c377(0x211)]);},Game_System[_0x528891(0x326)][_0x528891(0x2a5)]=function(_0x58ae99,_0x55cb19){const _0x4771e7=_0x528891,_0x1628b8=this[_0x4771e7(0x2a6)]();if(_0x55cb19&&_0x1628b8[_0x4771e7(0x211)]===_0x58ae99)_0x58ae99='';_0x1628b8[_0x4771e7(0x211)]=_0x58ae99,SceneManager['isSceneMap']()&&SceneManager[_0x4771e7(0x1d9)][_0x4771e7(0x38d)](_0x58ae99);},Game_System[_0x528891(0x326)][_0x528891(0x32a)]=function(){const _0x24e9ac=_0x528891,_0x5ee4ed=this[_0x24e9ac(0x2a6)]();return _0x5ee4ed[_0x24e9ac(0x247)];},Game_System['prototype'][_0x528891(0x288)]=function(_0x23a10c){const _0x1acafb=_0x528891,_0x202977=this[_0x1acafb(0x2a6)]();_0x202977[_0x1acafb(0x247)]=_0x23a10c;},VisuMZ[_0x528891(0x23c)][_0x528891(0x325)]=Game_BattlerBase[_0x528891(0x326)][_0x528891(0x33e)],Game_BattlerBase[_0x528891(0x326)][_0x528891(0x33e)]=function(_0x5291b5){const _0x218581=_0x528891,_0x3fa251=this[_0x218581(0x261)]();VisuMZ[_0x218581(0x23c)][_0x218581(0x325)]['call'](this,_0x5291b5),this[_0x218581(0x271)](_0x5291b5,_0x3fa251);},Game_BattlerBase[_0x528891(0x326)]['questJournalSystemAddDeath']=function(_0x2af075,_0x151528){const _0x510182=_0x528891;if(_0x2af075!==this[_0x510182(0x320)]())return;if(!this[_0x510182(0x1e0)]())return;if(!_0x151528)return;if(!this['isDead']())return;if(this[_0x510182(0x29f)])return;this[_0x510182(0x29f)]=!![];const _0x4835e8=this['enemy']()[_0x510182(0x2e3)],_0x5758d6=_0x4835e8[_0x510182(0x300)](/<VARIABLE (\d+) ON DEATH: ([\+\-]\d+)>/gi);if(_0x5758d6)for(const _0x2247e0 of _0x5758d6){_0x2247e0[_0x510182(0x300)](/<VARIABLE (\d+) ON DEATH: ([\+\-]\d+)>/i);const _0x4b401e=Number(RegExp['$1']),_0x2f4957=Number(RegExp['$2']),_0x535a33=$gameVariables[_0x510182(0x2ec)](_0x4b401e);$gameVariables[_0x510182(0x2f1)](_0x4b401e,_0x535a33+_0x2f4957);}},VisuMZ['QuestSystem'][_0x528891(0x338)]=Game_Battler[_0x528891(0x326)][_0x528891(0x38c)],Game_Battler[_0x528891(0x326)][_0x528891(0x38c)]=function(_0x487a3c){const _0x2b7ca6=_0x528891;VisuMZ[_0x2b7ca6(0x23c)][_0x2b7ca6(0x338)]['call'](this,_0x487a3c),this[_0x2b7ca6(0x1e2)](_0x487a3c);},Game_Battler[_0x528891(0x326)][_0x528891(0x1e2)]=function(_0x4dcffc){const _0x327a12=_0x528891;if(!_0x4dcffc)return;if(!this['isActor']())return;const _0x134a4f=_0x4dcffc[_0x327a12(0x2e3)],_0x93b2af=_0x134a4f['match'](/<VARIABLE (\d+) ON USE: ([\+\-]\d+)>/gi);if(_0x93b2af)for(const _0x4b4d96 of _0x93b2af){_0x4b4d96['match'](/<VARIABLE (\d+) ON USE: ([\+\-]\d+)>/i);const _0x33557a=Number(RegExp['$1']),_0x4634e1=Number(RegExp['$2']),_0x2647d3=$gameVariables[_0x327a12(0x2ec)](_0x33557a);$gameVariables[_0x327a12(0x2f1)](_0x33557a,_0x2647d3+_0x4634e1);}},VisuMZ[_0x528891(0x23c)]['Game_Actor_tradeItemWithParty']=Game_Actor[_0x528891(0x326)][_0x528891(0x2e4)],Game_Actor[_0x528891(0x326)][_0x528891(0x2e4)]=function(_0x37c0c9,_0x1711a0){const _0x148c85=_0x528891;$gameTemp[_0x148c85(0x344)]=!![];const _0x42d147=VisuMZ[_0x148c85(0x23c)]['Game_Actor_tradeItemWithParty'][_0x148c85(0x2a3)](this,_0x37c0c9,_0x1711a0);return $gameTemp[_0x148c85(0x344)]=undefined,_0x42d147;},VisuMZ['QuestSystem'][_0x528891(0x2b2)]=Game_Party[_0x528891(0x326)][_0x528891(0x209)],Game_Party['prototype'][_0x528891(0x209)]=function(_0x3c9c55,_0x9f63ee,_0x335d77){const _0x54f53f=_0x528891;VisuMZ[_0x54f53f(0x23c)][_0x54f53f(0x2b2)][_0x54f53f(0x2a3)](this,_0x3c9c55,_0x9f63ee,_0x335d77),this['questJournalSystemGainItem'](_0x3c9c55,_0x9f63ee);},Game_Party[_0x528891(0x326)]['questJournalSystemGainItem']=function(_0x106684,_0x493914){const _0x4a9044=_0x528891;if(!_0x106684)return;if($gameTemp[_0x4a9044(0x344)])return;const _0x34964f=_0x106684['note'];if(_0x493914>0x0){const _0x7c331c=_0x34964f[_0x4a9044(0x300)](/<VARIABLE (\d+) ON GAIN: ([\+\-]\d+)>/gi);if(_0x7c331c)for(const _0x14879b of _0x7c331c){_0x14879b[_0x4a9044(0x300)](/<VARIABLE (\d+) ON GAIN: ([\+\-]\d+)>/i);const _0x122f5a=Number(RegExp['$1']),_0x10156d=Number(RegExp['$2'])*_0x493914,_0x53f1cc=$gameVariables[_0x4a9044(0x2ec)](_0x122f5a);$gameVariables[_0x4a9044(0x2f1)](_0x122f5a,_0x53f1cc+_0x10156d);}}else{if(_0x493914<0x0){const _0x4b76e6=_0x34964f[_0x4a9044(0x300)](/<VARIABLE (\d+) ON LOSE: ([\+\-]\d+)>/gi);if(_0x4b76e6)for(const _0x50cf07 of _0x4b76e6){_0x50cf07['match'](/<VARIABLE (\d+) ON LOSE: ([\+\-]\d+)>/i);const _0x176294=Number(RegExp['$1']),_0x29689e=Number(RegExp['$2'])*_0x493914,_0x252669=$gameVariables[_0x4a9044(0x2ec)](_0x176294);$gameVariables['setValue'](_0x176294,_0x252669+_0x29689e);}}}const _0xcdfe47=_0x34964f[_0x4a9044(0x300)](/<TRACK WITH VARIABLE (\d+)>/gi);if(_0xcdfe47)for(const _0x1a2e56 of _0xcdfe47){_0x1a2e56['match'](/<TRACK WITH VARIABLE (\d+)>/i);const _0x96b32d=Number(RegExp['$1']),_0xbb1976=$gameParty[_0x4a9044(0x1dc)](_0x106684);$gameVariables[_0x4a9044(0x2f1)](_0x96b32d,_0xbb1976);}},VisuMZ['QuestSystem'][_0x528891(0x207)]=Game_Map[_0x528891(0x326)][_0x528891(0x283)],Game_Map[_0x528891(0x326)][_0x528891(0x283)]=function(){const _0x5cfce4=_0x528891;VisuMZ[_0x5cfce4(0x23c)]['Game_Map_requestRefresh'][_0x5cfce4(0x2a3)](this),SceneManager[_0x5cfce4(0x2f3)]()&&!this['_isRefreshingQuestTrackerWindow']&&(this['_isRefreshingQuestTrackerWindow']=!![]);},VisuMZ[_0x528891(0x23c)][_0x528891(0x366)]=Game_Map['prototype']['refresh'],Game_Map['prototype']['refresh']=function(){const _0x38261a=_0x528891;VisuMZ[_0x38261a(0x23c)]['Game_Map_refresh']['call'](this),SceneManager[_0x38261a(0x2f3)]()&&this[_0x38261a(0x354)]&&(SceneManager[_0x38261a(0x1d9)]['refreshQuestTrackerWindow'](),this[_0x38261a(0x354)]=![]);},VisuMZ['QuestSystem'][_0x528891(0x284)]=Scene_Map[_0x528891(0x326)][_0x528891(0x1ed)],Scene_Map[_0x528891(0x326)]['createSpriteset']=function(){const _0x3f2932=_0x528891;VisuMZ['QuestSystem'][_0x3f2932(0x284)][_0x3f2932(0x2a3)](this),this[_0x3f2932(0x20c)]();},Scene_Map['prototype'][_0x528891(0x20c)]=function(){const _0x5b61e7=_0x528891;if(!SceneManager['isSceneMap']())return;const _0x40933d=this['questTrackerWindow'](),_0x1e681a=new Window_QuestTracker(_0x40933d);this['addChild'](_0x1e681a),this[_0x5b61e7(0x1f4)]=_0x1e681a;},Scene_Map[_0x528891(0x326)]['questTrackerOnRight']=function(){const _0x33699a=_0x528891;return ConfigManager[_0x33699a(0x2b1)];},Scene_Map[_0x528891(0x326)][_0x528891(0x219)]=function(){const _0x35192b=_0x528891;return VisuMZ[_0x35192b(0x23c)][_0x35192b(0x2cf)][_0x35192b(0x25e)]['TrackerWindow_Rect'][_0x35192b(0x2a3)](this);},Scene_Map['prototype'][_0x528891(0x222)]=function(){const _0x40b8f4=_0x528891;if(!this['_questTrackerWindow'])return;this[_0x40b8f4(0x1f4)][_0x40b8f4(0x22a)]();},Scene_Map[_0x528891(0x326)][_0x528891(0x38d)]=function(_0x200c2c){const _0x8875b2=_0x528891;if(!this[_0x8875b2(0x1f4)])return;_0x200c2c=_0x200c2c['toUpperCase']()['trim']();const _0x818f9d=$gameSystem['quest'](_0x200c2c);this[_0x8875b2(0x1f4)]['setQuest'](_0x818f9d);},VisuMZ[_0x528891(0x23c)]['Scene_Menu_createCommandWindow']=Scene_Menu['prototype'][_0x528891(0x269)],Scene_Menu[_0x528891(0x326)][_0x528891(0x269)]=function(){const _0x4a5ea7=_0x528891;VisuMZ[_0x4a5ea7(0x23c)][_0x4a5ea7(0x2ab)]['call'](this),this[_0x4a5ea7(0x258)][_0x4a5ea7(0x373)]('quest',this[_0x4a5ea7(0x33d)][_0x4a5ea7(0x2d3)](this));},Scene_Menu[_0x528891(0x326)][_0x528891(0x33d)]=function(){const _0x3eb66f=_0x528891;SceneManager[_0x3eb66f(0x223)](Scene_Quest);},VisuMZ[_0x528891(0x23c)]['Scene_Options_maxCommands']=Scene_Options[_0x528891(0x326)]['maxCommands'],Scene_Options[_0x528891(0x326)]['maxCommands']=function(){const _0x4eeed1=_0x528891;let _0x50c9f7=VisuMZ[_0x4eeed1(0x23c)][_0x4eeed1(0x244)][_0x4eeed1(0x2a3)](this);if(VisuMZ[_0x4eeed1(0x23c)][_0x4eeed1(0x2cf)]['Tracker'][_0x4eeed1(0x2e0)]){if(VisuMZ[_0x4eeed1(0x23c)][_0x4eeed1(0x2cf)]['Tracker'][_0x4eeed1(0x22d)])_0x50c9f7++;if(VisuMZ['QuestSystem'][_0x4eeed1(0x2cf)][_0x4eeed1(0x346)][_0x4eeed1(0x29e)])_0x50c9f7++;}return _0x50c9f7;};function Scene_Quest(){const _0x30fe1c=_0x528891;this[_0x30fe1c(0x2dc)](...arguments);}Scene_Quest[_0x528891(0x326)]=Object['create'](Scene_MenuBase[_0x528891(0x326)]),Scene_Quest[_0x528891(0x326)][_0x528891(0x33b)]=Scene_Quest,Scene_Quest['prototype']['initialize']=function(){const _0x26981e=_0x528891;Scene_MenuBase[_0x26981e(0x326)][_0x26981e(0x2dc)]['call'](this);},Scene_Quest[_0x528891(0x326)]['helpAreaHeight']=function(){return 0x0;},Scene_Quest[_0x528891(0x326)][_0x528891(0x35d)]=function(){const _0x78efe6=_0x528891;if(ConfigManager['uiMenuStyle']&&ConfigManager[_0x78efe6(0x302)]!==undefined)return ConfigManager['uiInputPosition'];else return ConfigManager[_0x78efe6(0x375)]===![]?![]:Scene_MenuBase[_0x78efe6(0x326)][_0x78efe6(0x35d)][_0x78efe6(0x2a3)](this);},Scene_Quest['prototype']['mainCommandWidth']=function(){const _0x1a7519=_0x528891;return(Graphics[_0x1a7519(0x268)]-0x230)[_0x1a7519(0x2a4)](0xf0,Math['floor'](Graphics['boxWidth']/0x2));},Scene_Quest[_0x528891(0x326)][_0x528891(0x2ac)]=function(){const _0x2c4502=_0x528891;Scene_MenuBase[_0x2c4502(0x326)][_0x2c4502(0x2ac)]['call'](this),this['createCommandWindow'](),this[_0x2c4502(0x287)](),this[_0x2c4502(0x35b)](),this[_0x2c4502(0x382)]();},Scene_Quest['prototype']['createCommandWindow']=function(){const _0x703896=_0x528891,_0x5a9706=this[_0x703896(0x263)](),_0x429104=new Window_QuestCommand(_0x5a9706);_0x429104[_0x703896(0x373)](_0x703896(0x351),this[_0x703896(0x362)][_0x703896(0x2d3)](this)),_0x429104[_0x703896(0x373)]('completed',this['onCommandOk'][_0x703896(0x2d3)](this)),_0x429104[_0x703896(0x373)](_0x703896(0x239),this[_0x703896(0x362)][_0x703896(0x2d3)](this)),_0x429104['setHandler']('cancel',this[_0x703896(0x275)][_0x703896(0x2d3)](this)),this[_0x703896(0x2e9)](_0x429104),this[_0x703896(0x258)]=_0x429104,_0x429104[_0x703896(0x24b)](VisuMZ['QuestSystem'][_0x703896(0x2cf)][_0x703896(0x25e)]['CommandWindow_BgType']);},Scene_Quest[_0x528891(0x326)]['commandWindowRect']=function(){const _0x5e6f7f=_0x528891;return VisuMZ[_0x5e6f7f(0x23c)]['Settings'][_0x5e6f7f(0x25e)][_0x5e6f7f(0x274)][_0x5e6f7f(0x2a3)](this);},Scene_Quest[_0x528891(0x326)][_0x528891(0x287)]=function(){const _0x3db8e4=_0x528891,_0x16a848=this['questLabelWindowRect'](),_0x4e8e07=new Window_Base(_0x16a848);this[_0x3db8e4(0x2e9)](_0x4e8e07),this[_0x3db8e4(0x236)]=_0x4e8e07,_0x4e8e07[_0x3db8e4(0x24b)](VisuMZ[_0x3db8e4(0x23c)][_0x3db8e4(0x2cf)][_0x3db8e4(0x25e)]['QuestLabel_BgType']);},Scene_Quest[_0x528891(0x326)]['questLabelWindowRect']=function(){const _0x356889=_0x528891;return VisuMZ[_0x356889(0x23c)]['Settings']['Window'][_0x356889(0x292)]['call'](this);},Scene_Quest[_0x528891(0x326)]['createQuestLogWindow']=function(){const _0x5ab53e=_0x528891,_0x59efb0=this[_0x5ab53e(0x22f)](),_0x4f8d58=new Window_QuestLog(_0x59efb0);this['addWindow'](_0x4f8d58),this[_0x5ab53e(0x36e)]=_0x4f8d58,_0x4f8d58[_0x5ab53e(0x24b)](VisuMZ[_0x5ab53e(0x23c)][_0x5ab53e(0x2cf)][_0x5ab53e(0x25e)]['LogWindow_BgType']);},Scene_Quest[_0x528891(0x326)][_0x528891(0x22f)]=function(){const _0x3ca7ea=_0x528891;return VisuMZ[_0x3ca7ea(0x23c)]['Settings'][_0x3ca7ea(0x25e)][_0x3ca7ea(0x260)][_0x3ca7ea(0x2a3)](this);},Scene_Quest[_0x528891(0x326)]['createQuestListWindow']=function(){const _0x7d032b=_0x528891,_0xacd20a=this[_0x7d032b(0x1e6)](),_0x21f240=new Window_QuestList(_0xacd20a);_0x21f240[_0x7d032b(0x373)]('category',this[_0x7d032b(0x2e7)][_0x7d032b(0x2d3)](this)),_0x21f240[_0x7d032b(0x373)](_0x7d032b(0x389),this[_0x7d032b(0x2da)][_0x7d032b(0x2d3)](this)),_0x21f240[_0x7d032b(0x373)](_0x7d032b(0x29b),this[_0x7d032b(0x312)]['bind'](this)),this[_0x7d032b(0x2e9)](_0x21f240),this[_0x7d032b(0x2c2)]=_0x21f240,_0x21f240[_0x7d032b(0x24b)](VisuMZ[_0x7d032b(0x23c)][_0x7d032b(0x2cf)][_0x7d032b(0x25e)][_0x7d032b(0x1de)]),this[_0x7d032b(0x258)][_0x7d032b(0x27e)](this[_0x7d032b(0x2c2)]),this[_0x7d032b(0x2c2)][_0x7d032b(0x36f)](this[_0x7d032b(0x236)]),this[_0x7d032b(0x2c2)][_0x7d032b(0x24f)](this[_0x7d032b(0x36e)]);},Scene_Quest[_0x528891(0x326)][_0x528891(0x1e6)]=function(){const _0x420fe8=_0x528891;return VisuMZ[_0x420fe8(0x23c)][_0x420fe8(0x2cf)][_0x420fe8(0x25e)][_0x420fe8(0x30b)][_0x420fe8(0x2a3)](this);},Scene_Quest[_0x528891(0x326)]['onCommandOk']=function(){const _0x18bb4d=_0x528891;this['_listWindow'][_0x18bb4d(0x2d1)](),this[_0x18bb4d(0x2c2)][_0x18bb4d(0x249)](0x0);},Scene_Quest[_0x528891(0x326)]['onListCategory']=function(){const _0x416d7b=_0x528891;this[_0x416d7b(0x2c2)][_0x416d7b(0x27c)](),this[_0x416d7b(0x2c2)][_0x416d7b(0x2d1)]();},Scene_Quest[_0x528891(0x326)][_0x528891(0x2da)]=function(){const _0x2f52aa=_0x528891,_0xf31ec1=this['_listWindow'][_0x2f52aa(0x365)](),_0x58e5af=_0xf31ec1['Key'][_0x2f52aa(0x392)]()[_0x2f52aa(0x232)]();$gameSystem['setTrackedQuest'](_0x58e5af,!![]),this[_0x2f52aa(0x2c2)]['refresh'](),this[_0x2f52aa(0x2c2)][_0x2f52aa(0x2d1)]();},Scene_Quest[_0x528891(0x326)][_0x528891(0x312)]=function(){const _0xc93d26=_0x528891;this['_listWindow'][_0xc93d26(0x270)](),this[_0xc93d26(0x258)][_0xc93d26(0x2d1)]();},Scene_Quest[_0x528891(0x326)][_0x528891(0x1f3)]=function(){const _0x4fcf45=_0x528891;return TextManager[_0x4fcf45(0x2fb)];},Scene_Quest[_0x528891(0x326)][_0x528891(0x393)]=function(){const _0xc652c3=_0x528891;if(this[_0xc652c3(0x2c2)]&&this['_listWindow'][_0xc652c3(0x251)]){if(this[_0xc652c3(0x2c2)][_0xc652c3(0x365)]())return this[_0xc652c3(0x2c2)]['isOkEnabled']()?TextManager[_0xc652c3(0x2dd)]:'';else return this[_0xc652c3(0x2c2)][_0xc652c3(0x224)]()?TextManager[_0xc652c3(0x262)]:TextManager['questButtonAssistExpand'];}return Scene_MenuBase[_0xc652c3(0x326)][_0xc652c3(0x393)][_0xc652c3(0x2a3)](this);},Scene_Quest[_0x528891(0x326)][_0x528891(0x32f)]=function(){const _0x4dd33e=_0x528891;Scene_MenuBase['prototype'][_0x4dd33e(0x32f)][_0x4dd33e(0x2a3)](this),this[_0x4dd33e(0x329)](this[_0x4dd33e(0x306)]()),this[_0x4dd33e(0x384)]();},Scene_Quest[_0x528891(0x326)][_0x528891(0x306)]=function(){const _0x4aa775=_0x528891;return VisuMZ[_0x4aa775(0x23c)][_0x4aa775(0x2cf)][_0x4aa775(0x34a)][_0x4aa775(0x356)];},Scene_Quest[_0x528891(0x326)]['createCustomBackgroundImages']=function(){const _0x2fddd7=_0x528891,_0x2453e8={'BgFilename1':VisuMZ[_0x2fddd7(0x23c)][_0x2fddd7(0x2cf)][_0x2fddd7(0x34a)]['BgFilename1'],'BgFilename2':VisuMZ['QuestSystem'][_0x2fddd7(0x2cf)][_0x2fddd7(0x34a)]['BgFilename2']};_0x2453e8&&(_0x2453e8['BgFilename1']!==''||_0x2453e8['BgFilename2']!=='')&&(this[_0x2fddd7(0x248)]=new Sprite(ImageManager[_0x2fddd7(0x361)](_0x2453e8[_0x2fddd7(0x371)])),this[_0x2fddd7(0x381)]=new Sprite(ImageManager['loadTitle2'](_0x2453e8[_0x2fddd7(0x1ea)])),this[_0x2fddd7(0x21f)](this['_backSprite1']),this[_0x2fddd7(0x21f)](this[_0x2fddd7(0x381)]),this[_0x2fddd7(0x248)]['bitmap']['addLoadListener'](this[_0x2fddd7(0x20a)]['bind'](this,this[_0x2fddd7(0x248)])),this[_0x2fddd7(0x381)][_0x2fddd7(0x252)][_0x2fddd7(0x225)](this[_0x2fddd7(0x20a)][_0x2fddd7(0x2d3)](this,this[_0x2fddd7(0x381)])));},Scene_Quest['prototype'][_0x528891(0x20a)]=function(_0x30382f){const _0x2b0a26=_0x528891;this[_0x2b0a26(0x26b)](_0x30382f),this['centerSprite'](_0x30382f);},VisuMZ['QuestSystem'][_0x528891(0x395)]=Window_MenuCommand[_0x528891(0x326)][_0x528891(0x24a)],Window_MenuCommand[_0x528891(0x326)][_0x528891(0x24a)]=function(){const _0x2a1aeb=_0x528891;VisuMZ['QuestSystem']['Window_MenuCommand_addOriginalCommands']['call'](this),this[_0x2a1aeb(0x22b)]();},Window_MenuCommand[_0x528891(0x326)][_0x528891(0x22b)]=function(){const _0xaa028b=_0x528891;if(!this[_0xaa028b(0x2b6)]())return;if(!this['isQuestCommandVisible']())return;const _0x4304be=TextManager[_0xaa028b(0x1ff)],_0x546867=this[_0xaa028b(0x34c)]();this[_0xaa028b(0x2ce)](_0x4304be,'quest',_0x546867);},Window_MenuCommand['prototype'][_0x528891(0x2b6)]=function(){const _0x141840=_0x528891;return Imported[_0x141840(0x2e5)]?![]:!![];},Window_MenuCommand['prototype'][_0x528891(0x30a)]=function(){const _0x3567e3=_0x528891;return $gameSystem[_0x3567e3(0x2bd)]();},Window_MenuCommand[_0x528891(0x326)][_0x528891(0x34c)]=function(){const _0x3eb8b6=_0x528891;return $gameSystem[_0x3eb8b6(0x352)]();},VisuMZ['QuestSystem']['Window_Options_addGeneralOptions']=Window_Options[_0x528891(0x326)][_0x528891(0x37e)],Window_Options['prototype']['addGeneralOptions']=function(){const _0x56d21f=_0x528891;VisuMZ[_0x56d21f(0x23c)][_0x56d21f(0x205)]['call'](this),this[_0x56d21f(0x2eb)]();},Window_Options[_0x528891(0x326)][_0x528891(0x2eb)]=function(){const _0x3a9b3d=_0x528891;VisuMZ[_0x3a9b3d(0x23c)][_0x3a9b3d(0x2cf)][_0x3a9b3d(0x346)][_0x3a9b3d(0x22d)]&&this[_0x3a9b3d(0x383)](),VisuMZ[_0x3a9b3d(0x23c)]['Settings'][_0x3a9b3d(0x346)][_0x3a9b3d(0x29e)]&&this[_0x3a9b3d(0x2f0)]();},Window_Options[_0x528891(0x326)][_0x528891(0x383)]=function(){const _0x3fcb10=_0x528891,_0x2b13ae=TextManager[_0x3fcb10(0x36b)],_0x1817c0=_0x3fcb10(0x36b);this[_0x3fcb10(0x2ce)](_0x2b13ae,_0x1817c0);},Window_Options[_0x528891(0x326)]['addQuestSystemquestTrackerPositionCommand']=function(){const _0x2f321d=_0x528891,_0x58063c=TextManager['questTrackerPosition'],_0x105b9f=_0x2f321d(0x2b1);this[_0x2f321d(0x2ce)](_0x58063c,_0x105b9f);},VisuMZ['QuestSystem'][_0x528891(0x23f)]=Window_Options[_0x528891(0x326)][_0x528891(0x2a8)],Window_Options[_0x528891(0x326)][_0x528891(0x2a8)]=function(_0x4effa5){const _0x40cd11=_0x528891,_0xb75118=this[_0x40cd11(0x228)](_0x4effa5);if(_0xb75118===_0x40cd11(0x2b1)){const _0x19a669=this[_0x40cd11(0x203)](_0xb75118);return _0x19a669?TextManager[_0x40cd11(0x33c)]:TextManager[_0x40cd11(0x1d8)];}return VisuMZ[_0x40cd11(0x23c)][_0x40cd11(0x23f)][_0x40cd11(0x2a3)](this,_0x4effa5);};function Window_QuestCommand(){const _0x1b872f=_0x528891;this[_0x1b872f(0x2dc)](...arguments);}Window_QuestCommand[_0x528891(0x326)]=Object[_0x528891(0x2ac)](Window_Command[_0x528891(0x326)]),Window_QuestCommand[_0x528891(0x326)][_0x528891(0x33b)]=Window_QuestCommand,Window_QuestCommand[_0x528891(0x326)][_0x528891(0x2dc)]=function(_0x5b5fac){const _0x633362=_0x528891;Window_Command[_0x633362(0x326)][_0x633362(0x2dc)][_0x633362(0x2a3)](this,_0x5b5fac),this[_0x633362(0x286)](_0x5b5fac);},Window_QuestCommand['prototype'][_0x528891(0x286)]=function(_0x3fdfe9){const _0x10a0aa=_0x528891,_0xf8acf9=new Rectangle(0x0,0x0,_0x3fdfe9[_0x10a0aa(0x341)],_0x3fdfe9[_0x10a0aa(0x1e3)]);this[_0x10a0aa(0x315)]=new Window_Base(_0xf8acf9),this[_0x10a0aa(0x315)][_0x10a0aa(0x311)]=0x0,this['addChild'](this[_0x10a0aa(0x315)]),this[_0x10a0aa(0x2d4)]();},Window_QuestCommand[_0x528891(0x326)][_0x528891(0x23b)]=function(){const _0x58d0e4=_0x528891;Window_Command[_0x58d0e4(0x326)][_0x58d0e4(0x23b)]['call'](this);if(this[_0x58d0e4(0x315)])this[_0x58d0e4(0x2d4)]();if(this[_0x58d0e4(0x2c2)])this[_0x58d0e4(0x2c2)][_0x58d0e4(0x293)](this[_0x58d0e4(0x237)]());},Window_QuestCommand[_0x528891(0x326)]['updateCommandNameWindow']=function(){const _0x292bfe=_0x528891,_0x26a23e=this[_0x292bfe(0x315)];_0x26a23e[_0x292bfe(0x355)][_0x292bfe(0x2a9)]();const _0xf3cfac=this['commandStyleCheck'](this[_0x292bfe(0x31f)]());if(_0xf3cfac===_0x292bfe(0x266)){const _0x488ed2=this[_0x292bfe(0x369)](this['index']());let _0x5d8bad=this[_0x292bfe(0x380)](this[_0x292bfe(0x31f)]());_0x5d8bad=_0x5d8bad[_0x292bfe(0x37a)](/\\I\[(\d+)\]/gi,''),_0x26a23e[_0x292bfe(0x227)](),this[_0x292bfe(0x29d)](_0x5d8bad,_0x488ed2),this[_0x292bfe(0x208)](_0x5d8bad,_0x488ed2),this[_0x292bfe(0x25f)](_0x5d8bad,_0x488ed2);}},Window_QuestCommand[_0x528891(0x326)][_0x528891(0x29d)]=function(_0x59bd4c,_0x3f07db){},Window_QuestCommand['prototype'][_0x528891(0x208)]=function(_0x6d7bae,_0x144efe){const _0x24d416=_0x528891,_0xf80857=this[_0x24d416(0x315)];_0xf80857[_0x24d416(0x343)](_0x6d7bae,0x0,_0x144efe['y'],_0xf80857[_0x24d416(0x1f0)],_0x24d416(0x38a));},Window_QuestCommand[_0x528891(0x326)][_0x528891(0x25f)]=function(_0x3d7609,_0x322548){const _0x4a06dd=_0x528891,_0x1bb22f=this[_0x4a06dd(0x315)],_0x2a9ab3=$gameSystem[_0x4a06dd(0x2c7)](),_0x15db4b=_0x322548['x']+Math['floor'](_0x322548[_0x4a06dd(0x341)]/0x2)+_0x2a9ab3;_0x1bb22f['x']=_0x1bb22f[_0x4a06dd(0x341)]/-0x2+_0x15db4b,_0x1bb22f['y']=Math[_0x4a06dd(0x2ca)](_0x322548[_0x4a06dd(0x1e3)]/0x2);},Window_QuestCommand[_0x528891(0x326)]['makeCommandList']=function(){const _0x135387=_0x528891;this[_0x135387(0x21b)](),this[_0x135387(0x38e)](),this[_0x135387(0x1f9)]();},Window_QuestCommand['prototype'][_0x528891(0x21b)]=function(){const _0x3e0ca6=_0x528891,_0x1fe522=_0x3e0ca6(0x351),_0x106c83=ImageManager[_0x3e0ca6(0x2e2)];let _0x52c357=TextManager[_0x3e0ca6(0x323)];_0x106c83>0x0&&this[_0x3e0ca6(0x246)]()!==_0x3e0ca6(0x32d)&&(_0x52c357=_0x3e0ca6(0x1fd)[_0x3e0ca6(0x29c)](_0x106c83,_0x52c357));const _0x601911=this['isKnownQuestsEnabled']();this[_0x3e0ca6(0x2ce)](_0x52c357,_0x1fe522,_0x601911);},Window_QuestCommand[_0x528891(0x326)][_0x528891(0x267)]=function(){const _0x56c365=_0x528891;return $gameSystem[_0x56c365(0x1dd)]()[_0x56c365(0x27d)]>0x0;},Window_QuestCommand[_0x528891(0x326)][_0x528891(0x38e)]=function(){const _0x1ee856=_0x528891,_0x1aba61=_0x1ee856(0x1f1),_0x304397=ImageManager[_0x1ee856(0x2d5)];let _0x582e9e=TextManager['questCompletedCmd'];_0x304397>0x0&&this[_0x1ee856(0x246)]()!==_0x1ee856(0x32d)&&(_0x582e9e=_0x1ee856(0x1fd)[_0x1ee856(0x29c)](_0x304397,_0x582e9e));const _0x3f2d25=this[_0x1ee856(0x243)]();this[_0x1ee856(0x2ce)](_0x582e9e,_0x1aba61,_0x3f2d25);},Window_QuestCommand[_0x528891(0x326)][_0x528891(0x243)]=function(){const _0x25ef41=_0x528891;return $gameSystem['questsCompleted']()[_0x25ef41(0x27d)]>0x0;},Window_QuestCommand[_0x528891(0x326)]['addFailedQuestsCommand']=function(){const _0x5d956e=_0x528891;if(!this[_0x5d956e(0x339)]())return;const _0x19d8e1='failed',_0x5417c7=ImageManager['questFailedIcon'];let _0x536eca=TextManager[_0x5d956e(0x372)];_0x5417c7>0x0&&this[_0x5d956e(0x246)]()!==_0x5d956e(0x32d)&&(_0x536eca=_0x5d956e(0x1fd)[_0x5d956e(0x29c)](_0x5417c7,_0x536eca));const _0x389868=this[_0x5d956e(0x1e9)]();this[_0x5d956e(0x2ce)](_0x536eca,_0x19d8e1,_0x389868);},Window_QuestCommand[_0x528891(0x326)][_0x528891(0x339)]=function(){const _0x53b91a=_0x528891;return VisuMZ['QuestSystem'][_0x53b91a(0x2cf)][_0x53b91a(0x25e)][_0x53b91a(0x307)];},Window_QuestCommand[_0x528891(0x326)]['isFailedQuestsEnabled']=function(){const _0x5a32bf=_0x528891;return $gameSystem['questsFailed']()[_0x5a32bf(0x27d)]>0x0;},Window_QuestCommand[_0x528891(0x326)]['totalCommands']=function(){const _0x45e70f=_0x528891;return this[_0x45e70f(0x339)]()?0x3:0x2;},Window_QuestCommand[_0x528891(0x326)][_0x528891(0x2d6)]=function(){const _0x14115a=_0x528891;return VisuMZ[_0x14115a(0x23c)][_0x14115a(0x2cf)][_0x14115a(0x25e)]['CmdTextAlign'];},Window_QuestCommand[_0x528891(0x326)][_0x528891(0x20d)]=function(_0x889cdd){const _0x18ee14=_0x528891,_0x178cfb=this[_0x18ee14(0x35e)](_0x889cdd);if(_0x178cfb===_0x18ee14(0x229))this[_0x18ee14(0x334)](_0x889cdd);else _0x178cfb===_0x18ee14(0x266)?this[_0x18ee14(0x2f5)](_0x889cdd):Window_HorzCommand[_0x18ee14(0x326)][_0x18ee14(0x20d)][_0x18ee14(0x2a3)](this,_0x889cdd);},Window_QuestCommand['prototype'][_0x528891(0x246)]=function(){const _0x1d9c75=_0x528891;return VisuMZ[_0x1d9c75(0x23c)]['Settings']['Window']['CmdStyle'];},Window_QuestCommand['prototype'][_0x528891(0x35e)]=function(_0x1fe784){const _0x538afc=_0x528891;if(_0x1fe784<0x0)return _0x538afc(0x32d);const _0x51e20d=this[_0x538afc(0x246)]();if(_0x51e20d!==_0x538afc(0x391))return _0x51e20d;else{if(this[_0x538afc(0x2f6)]()>0x0){const _0x1cd03b=this[_0x538afc(0x380)](_0x1fe784);if(_0x1cd03b['match'](/\\I\[(\d+)\]/i)){const _0x1fcf89=this[_0x538afc(0x369)](_0x1fe784),_0x6de345=this[_0x538afc(0x35a)](_0x1cd03b)['width'];return _0x6de345<=_0x1fcf89[_0x538afc(0x341)]?_0x538afc(0x229):_0x538afc(0x266);}}}return'text';},Window_QuestCommand[_0x528891(0x326)]['drawItemStyleIconText']=function(_0x223795){const _0x2d6199=_0x528891,_0x237df9=this['itemLineRect'](_0x223795),_0x5d5d07=this['commandName'](_0x223795),_0x38bc29=this[_0x2d6199(0x35a)](_0x5d5d07)[_0x2d6199(0x341)];this[_0x2d6199(0x20e)](this[_0x2d6199(0x2ae)](_0x223795));const _0x3d92a5=this['itemTextAlign']();if(_0x3d92a5===_0x2d6199(0x367))this[_0x2d6199(0x20f)](_0x5d5d07,_0x237df9['x']+_0x237df9['width']-_0x38bc29,_0x237df9['y'],_0x38bc29);else{if(_0x3d92a5==='center'){const _0x255bbf=_0x237df9['x']+Math[_0x2d6199(0x2ca)]((_0x237df9[_0x2d6199(0x341)]-_0x38bc29)/0x2);this[_0x2d6199(0x20f)](_0x5d5d07,_0x255bbf,_0x237df9['y'],_0x38bc29);}else this[_0x2d6199(0x20f)](_0x5d5d07,_0x237df9['x'],_0x237df9['y'],_0x38bc29);}},Window_QuestCommand['prototype'][_0x528891(0x2f5)]=function(_0x47c80c){const _0x1864f1=_0x528891;this[_0x1864f1(0x380)](_0x47c80c)[_0x1864f1(0x300)](/\\I\[(\d+)\]/i);const _0x10ddac=Number(RegExp['$1'])||0x0,_0x1cad1c=this[_0x1864f1(0x369)](_0x47c80c),_0x50dd6a=_0x1cad1c['x']+Math['floor']((_0x1cad1c[_0x1864f1(0x341)]-ImageManager['iconWidth'])/0x2),_0x24ae63=_0x1cad1c['y']+(_0x1cad1c[_0x1864f1(0x1e3)]-ImageManager[_0x1864f1(0x264)])/0x2;this[_0x1864f1(0x2f4)](_0x10ddac,_0x50dd6a,_0x24ae63);},Window_QuestCommand[_0x528891(0x326)]['setListWindow']=function(_0x19a76a){const _0x21ad60=_0x528891;this[_0x21ad60(0x2c2)]=_0x19a76a,this[_0x21ad60(0x23b)]();};function Window_QuestList(){this['initialize'](...arguments);}Window_QuestList[_0x528891(0x24d)]=VisuMZ['QuestSystem'][_0x528891(0x2cf)]['Categories'],Window_QuestList['prototype']=Object[_0x528891(0x2ac)](Window_Command[_0x528891(0x326)]),Window_QuestList[_0x528891(0x326)][_0x528891(0x33b)]=Window_QuestList,Window_QuestList[_0x528891(0x326)][_0x528891(0x2dc)]=function(_0x279b98){const _0x3f3369=_0x528891;this[_0x3f3369(0x254)](),Window_Command[_0x3f3369(0x326)][_0x3f3369(0x2dc)][_0x3f3369(0x2a3)](this,_0x279b98),this[_0x3f3369(0x286)](_0x279b98),this[_0x3f3369(0x340)](),this[_0x3f3369(0x270)]();},Window_QuestList[_0x528891(0x326)][_0x528891(0x254)]=function(){const _0x445ce4=_0x528891;this[_0x445ce4(0x291)]={};for(const _0x2305c1 of VisuMZ[_0x445ce4(0x23c)][_0x445ce4(0x2cf)][_0x445ce4(0x330)]){this['_categoryStatus'][_0x2305c1[_0x445ce4(0x360)]]=!![];}this[_0x445ce4(0x37c)]=_0x445ce4(0x351);},Window_QuestList[_0x528891(0x326)][_0x528891(0x293)]=function(_0x291f15){const _0x371f2c=_0x528891;if(this[_0x371f2c(0x37c)]===_0x291f15)return;this['_categoryFilter']=_0x291f15,this['refresh']();},Window_QuestList[_0x528891(0x326)]['openCloseCurrentCategory']=function(){const _0xc311bc=_0x528891,_0x5b78c9=this[_0xc311bc(0x376)]();this[_0xc311bc(0x291)][_0x5b78c9[_0xc311bc(0x360)]]=!this[_0xc311bc(0x291)][_0x5b78c9[_0xc311bc(0x360)]],this[_0xc311bc(0x22a)](),this[_0xc311bc(0x23b)]();},Window_QuestList[_0x528891(0x326)]['isCurrentCategoryOpen']=function(){const _0x239c71=_0x528891,_0xd8dd8c=this[_0x239c71(0x376)]();return _0xd8dd8c&&this['_categoryStatus'][_0xd8dd8c[_0x239c71(0x360)]];},Window_QuestList[_0x528891(0x326)][_0x528891(0x286)]=function(_0x165650){const _0x57ff5f=_0x528891,_0x147a8f=new Rectangle(0x0,0x0,_0x165650['width'],_0x165650[_0x57ff5f(0x1e3)]);this['_commandNameWindow']=new Window_Base(_0x147a8f),this['_commandNameWindow'][_0x57ff5f(0x311)]=0x0,this[_0x57ff5f(0x21f)](this[_0x57ff5f(0x315)]),this['updateCommandNameWindow']();},Window_QuestList[_0x528891(0x326)]['callUpdateHelp']=function(){const _0x359ff7=_0x528891;Window_Command[_0x359ff7(0x326)]['callUpdateHelp'][_0x359ff7(0x2a3)](this);if(this[_0x359ff7(0x315)])this[_0x359ff7(0x2d4)]();if(this[_0x359ff7(0x236)])this[_0x359ff7(0x347)]();if(this[_0x359ff7(0x36e)])this['updateLogWindow']();},Window_QuestList[_0x528891(0x326)][_0x528891(0x2d4)]=function(){const _0x583354=_0x528891,_0x5698ab=this[_0x583354(0x315)];_0x5698ab[_0x583354(0x355)][_0x583354(0x2a9)]();const _0x1c4449=this[_0x583354(0x35e)](this[_0x583354(0x31f)]());if(_0x1c4449==='icon'){const _0x4841af=this['itemLineRect'](this['index']());let _0x181efa=this['commandName'](this[_0x583354(0x31f)]());_0x181efa=_0x181efa['replace'](/\\I\[(\d+)\]/gi,''),_0x5698ab[_0x583354(0x227)](),this[_0x583354(0x29d)](_0x181efa,_0x4841af),this[_0x583354(0x208)](_0x181efa,_0x4841af),this[_0x583354(0x25f)](_0x181efa,_0x4841af);}},Window_QuestList[_0x528891(0x326)][_0x528891(0x29d)]=function(_0x3dbe23,_0x50b30e){},Window_QuestList[_0x528891(0x326)][_0x528891(0x208)]=function(_0x5eb8e2,_0x461b41){const _0x3eeedd=_0x528891,_0x564567=this[_0x3eeedd(0x315)];_0x564567[_0x3eeedd(0x343)](_0x5eb8e2,0x0,_0x461b41['y'],_0x564567['innerWidth'],_0x3eeedd(0x38a));},Window_QuestList[_0x528891(0x326)]['commandNameWindowCenter']=function(_0x46ec36,_0x465d83){const _0x4ee39c=_0x528891,_0x2f1c35=this['_commandNameWindow'],_0x43d000=$gameSystem[_0x4ee39c(0x2c7)](),_0x3fc9fe=_0x465d83['x']+Math['floor'](_0x465d83[_0x4ee39c(0x341)]/0x2)+_0x43d000;_0x2f1c35['x']=_0x2f1c35['width']/-0x2+_0x3fc9fe,_0x2f1c35['y']=Math[_0x4ee39c(0x2ca)](_0x465d83[_0x4ee39c(0x1e3)]/0x2);},Window_QuestList[_0x528891(0x326)][_0x528891(0x296)]=function(){const _0x251307=_0x528891;for(const _0x1a584e of Window_QuestList[_0x251307(0x24d)]){if(!_0x1a584e)continue;if(!this[_0x251307(0x2b0)](_0x1a584e))continue;this['addCategoryCommand'](_0x1a584e),this[_0x251307(0x1fb)](_0x1a584e);}this['_list'][_0x251307(0x27d)]<=0x0&&this[_0x251307(0x2ee)]();},Window_QuestList[_0x528891(0x326)]['addNoQuestsListedCommand']=function(){const _0x444e7b=_0x528891;this['addCommand'](TextManager[_0x444e7b(0x297)],_0x444e7b(0x29b),![]);},Window_QuestList[_0x528891(0x326)][_0x528891(0x2b0)]=function(_0xdf2cac){const _0x3d2bb4=_0x528891;for(const _0x368acc of _0xdf2cac[_0x3d2bb4(0x37d)]){if(!_0x368acc)continue;switch(this[_0x3d2bb4(0x37c)]){case _0x3d2bb4(0x351):if($gameSystem[_0x3d2bb4(0x327)](_0x368acc['Key']))return!![];break;case _0x3d2bb4(0x1f1):if($gameSystem[_0x3d2bb4(0x241)](_0x368acc[_0x3d2bb4(0x216)]))return!![];break;case _0x3d2bb4(0x239):if($gameSystem[_0x3d2bb4(0x21e)](_0x368acc[_0x3d2bb4(0x216)]))return!![];break;}}return![];},Window_QuestList[_0x528891(0x326)]['addCategoryCommand']=function(_0x4fc310){const _0x46cfab=_0x528891,_0x253751=this['isCategoryOpen'](_0x4fc310)?TextManager['questCategoryOpenedFmt']:TextManager['questCategoryClosedFmt'],_0x5150f4=this['getTotalCategoryQuests'](_0x4fc310)[_0x46cfab(0x27d)],_0x1e4230=_0x253751[_0x46cfab(0x29c)](_0x4fc310['CategoryName'],_0x5150f4);this[_0x46cfab(0x2ce)](_0x1e4230,'category',!![],_0x4fc310);},Window_QuestList[_0x528891(0x326)][_0x528891(0x25b)]=function(_0x3fc989){const _0x8af708=_0x528891;switch(this['_categoryFilter']){case _0x8af708(0x351):return $gameSystem[_0x8af708(0x1dd)]()[_0x8af708(0x1e7)](_0x4ed1cb=>_0x4ed1cb[_0x8af708(0x317)]===_0x3fc989);break;case _0x8af708(0x1f1):return $gameSystem[_0x8af708(0x2a7)]()['filter'](_0x435540=>_0x435540['category']===_0x3fc989);break;case _0x8af708(0x239):return $gameSystem['questsFailed']()[_0x8af708(0x1e7)](_0x9ea667=>_0x9ea667[_0x8af708(0x317)]===_0x3fc989);break;}return[];},Window_QuestList[_0x528891(0x326)][_0x528891(0x1fb)]=function(_0x5a1973){const _0x52fde1=_0x528891;if(!this[_0x52fde1(0x285)](_0x5a1973))return;for(const _0xbd5715 of _0x5a1973[_0x52fde1(0x37d)]){if(!_0xbd5715)continue;switch(this[_0x52fde1(0x37c)]){case _0x52fde1(0x351):if($gameSystem[_0x52fde1(0x327)](_0xbd5715[_0x52fde1(0x216)]))this[_0x52fde1(0x22b)](_0xbd5715);break;case _0x52fde1(0x1f1):if($gameSystem[_0x52fde1(0x241)](_0xbd5715[_0x52fde1(0x216)]))this[_0x52fde1(0x22b)](_0xbd5715);break;case _0x52fde1(0x239):if($gameSystem[_0x52fde1(0x21e)](_0xbd5715[_0x52fde1(0x216)]))this['addQuestCommand'](_0xbd5715);break;}}},Window_QuestList[_0x528891(0x326)]['isCategoryOpen']=function(_0x12ff3a){const _0x4ffd88=_0x528891;return this['_categoryStatus'][_0x12ff3a[_0x4ffd88(0x360)]];},Window_QuestList['prototype'][_0x528891(0x22b)]=function(_0x2d10c3){const _0x2d8103=_0x528891;let _0x3b4705=_0x2d10c3[_0x2d8103(0x377)];_0x2d10c3===$gameSystem[_0x2d8103(0x305)]()&&(_0x3b4705=TextManager[_0x2d8103(0x1f2)][_0x2d8103(0x29c)](_0x3b4705)),this[_0x2d8103(0x2ce)](_0x3b4705,_0x2d8103(0x389),!![],_0x2d10c3);},Window_QuestList[_0x528891(0x326)][_0x528891(0x2d6)]=function(){const _0x5924ca=_0x528891;return _0x5924ca(0x2e1);},Window_QuestList[_0x528891(0x326)][_0x528891(0x20d)]=function(_0x246172){const _0x3d37c6=_0x528891,_0x32471a=this['commandStyleCheck'](_0x246172);if(_0x32471a===_0x3d37c6(0x229))this[_0x3d37c6(0x334)](_0x246172);else _0x32471a===_0x3d37c6(0x266)?this[_0x3d37c6(0x2f5)](_0x246172):Window_HorzCommand[_0x3d37c6(0x326)][_0x3d37c6(0x20d)][_0x3d37c6(0x2a3)](this,_0x246172);},Window_QuestList[_0x528891(0x326)]['commandStyle']=function(){return'iconText';},Window_QuestList[_0x528891(0x326)][_0x528891(0x35e)]=function(_0x11abe3){const _0x36d7bb=_0x528891;if(_0x11abe3<0x0)return _0x36d7bb(0x32d);const _0x3053e9=this[_0x36d7bb(0x246)]();if(_0x3053e9!=='auto')return _0x3053e9;else{if(this['maxItems']()>0x0){const _0x1f95a6=this[_0x36d7bb(0x380)](_0x11abe3);if(_0x1f95a6[_0x36d7bb(0x300)](/\\I\[(\d+)\]/i)){const _0x149557=this[_0x36d7bb(0x369)](_0x11abe3),_0x507e4b=this[_0x36d7bb(0x35a)](_0x1f95a6)[_0x36d7bb(0x341)];return _0x507e4b<=_0x149557['width']?_0x36d7bb(0x229):_0x36d7bb(0x266);}}}return _0x36d7bb(0x32d);},Window_QuestList[_0x528891(0x326)][_0x528891(0x334)]=function(_0xc5bfdf){const _0x20d6ac=_0x528891,_0x33b371=this[_0x20d6ac(0x369)](_0xc5bfdf),_0x4e7737=this[_0x20d6ac(0x380)](_0xc5bfdf),_0x21efec=this[_0x20d6ac(0x35a)](_0x4e7737)[_0x20d6ac(0x341)];this[_0x20d6ac(0x20e)](this[_0x20d6ac(0x2ae)](_0xc5bfdf));const _0x106b42=this[_0x20d6ac(0x2d6)]();if(_0x106b42===_0x20d6ac(0x367))this[_0x20d6ac(0x20f)](_0x4e7737,_0x33b371['x']+_0x33b371[_0x20d6ac(0x341)]-_0x21efec,_0x33b371['y'],_0x21efec);else{if(_0x106b42===_0x20d6ac(0x38a)){const _0x30f855=_0x33b371['x']+Math['floor']((_0x33b371[_0x20d6ac(0x341)]-_0x21efec)/0x2);this[_0x20d6ac(0x20f)](_0x4e7737,_0x30f855,_0x33b371['y'],_0x21efec);}else this[_0x20d6ac(0x20f)](_0x4e7737,_0x33b371['x'],_0x33b371['y'],_0x21efec);}},Window_QuestList['prototype'][_0x528891(0x2f5)]=function(_0x250ea4){const _0x80df61=_0x528891;this[_0x80df61(0x380)](_0x250ea4)[_0x80df61(0x300)](/\\I\[(\d+)\]/i);const _0x2c35ac=Number(RegExp['$1'])||0x0,_0x3eb566=this['itemLineRect'](_0x250ea4),_0x355b61=_0x3eb566['x']+Math[_0x80df61(0x2ca)]((_0x3eb566[_0x80df61(0x341)]-ImageManager[_0x80df61(0x220)])/0x2),_0x4d47e2=_0x3eb566['y']+(_0x3eb566[_0x80df61(0x1e3)]-ImageManager[_0x80df61(0x264)])/0x2;this['drawIcon'](_0x2c35ac,_0x355b61,_0x4d47e2);},Window_QuestList[_0x528891(0x326)][_0x528891(0x376)]=function(){const _0x59c5a1=_0x528891;return this[_0x59c5a1(0x237)]()===_0x59c5a1(0x317)?this[_0x59c5a1(0x374)]():null;},Window_QuestList[_0x528891(0x326)][_0x528891(0x365)]=function(){const _0x35e485=_0x528891;return this[_0x35e485(0x237)]()==='quest'?this['currentExt']():null;},Window_QuestList[_0x528891(0x326)][_0x528891(0x36f)]=function(_0x38a344){const _0x409391=_0x528891;this[_0x409391(0x236)]=_0x38a344,this[_0x409391(0x23b)]();},Window_QuestList['prototype']['updateLabelWindow']=function(){const _0x5a64dd=_0x528891,_0xc65ba3=this[_0x5a64dd(0x365)](),_0x1d4e80=this['_labelWindow'];_0x1d4e80[_0x5a64dd(0x355)][_0x5a64dd(0x2a9)]();const _0x11ec6c=_0xc65ba3?_0xc65ba3[_0x5a64dd(0x377)]:TextManager['noQuestsLabel'],_0x9a02c8=_0x1d4e80[_0x5a64dd(0x35a)](_0x11ec6c)[_0x5a64dd(0x341)],_0x1f05da=_0x1d4e80[_0x5a64dd(0x1ec)]()+Math['round']((_0x1d4e80[_0x5a64dd(0x1f0)]-_0x9a02c8)/0x2);_0x1d4e80[_0x5a64dd(0x20f)](_0x11ec6c,_0x1f05da,0x0,_0x1d4e80[_0x5a64dd(0x1f0)]);},Window_QuestList[_0x528891(0x326)][_0x528891(0x24f)]=function(_0x3efd16){const _0x359a03=_0x528891;this[_0x359a03(0x36e)]=_0x3efd16,this[_0x359a03(0x23b)]();},Window_QuestList[_0x528891(0x326)]['updateLogWindow']=function(){const _0x176d92=_0x528891,_0x4d4297=this['currentQuest'](),_0x5b9b0b=this['_logWindow'];_0x5b9b0b[_0x176d92(0x34e)](_0x4d4297);},Window_QuestList[_0x528891(0x326)]['cursorPagedown']=function(){},Window_QuestList[_0x528891(0x326)][_0x528891(0x23d)]=function(){},Window_QuestList[_0x528891(0x326)][_0x528891(0x2ef)]=function(){const _0x444987=_0x528891;return this[_0x444987(0x365)]()?this['_categoryFilter']===_0x444987(0x351):Window_Command[_0x444987(0x326)][_0x444987(0x2ef)][_0x444987(0x2a3)](this);};function Window_QuestLog(){const _0x584b1f=_0x528891;this[_0x584b1f(0x2dc)](...arguments);}Window_QuestLog[_0x528891(0x31d)]=VisuMZ[_0x528891(0x23c)][_0x528891(0x2cf)][_0x528891(0x25e)][_0x528891(0x257)],Window_QuestLog[_0x528891(0x1f5)]=VisuMZ[_0x528891(0x23c)][_0x528891(0x2cf)]['Window'][_0x528891(0x255)],Window_QuestLog[_0x528891(0x326)]=Object[_0x528891(0x2ac)](Window_Scrollable[_0x528891(0x326)]),Window_QuestLog[_0x528891(0x326)]['constructor']=Window_QuestLog,Window_QuestLog['_delayDraw']=0x19,Window_QuestLog[_0x528891(0x326)][_0x528891(0x2dc)]=function(_0xb931ca){const _0x1dde77=_0x528891;this[_0x1dde77(0x2d7)]=0x0,this['_delayDraw']=0x0,Window_Scrollable[_0x1dde77(0x326)]['initialize'][_0x1dde77(0x2a3)](this,_0xb931ca),this[_0x1dde77(0x28a)]=null,this['refresh']();},Window_QuestLog[_0x528891(0x326)]['contentsHeight']=function(){const _0x2307f2=_0x528891;return Math[_0x2307f2(0x1ee)](this[_0x2307f2(0x336)],this[_0x2307f2(0x2d7)]);},Window_QuestLog[_0x528891(0x326)]['overallHeight']=function(){const _0x47c1d7=_0x528891;return this[_0x47c1d7(0x32e)]();},Window_QuestLog[_0x528891(0x326)][_0x528891(0x245)]=function(){const _0x4b69aa=_0x528891;Window_Scrollable[_0x4b69aa(0x326)][_0x4b69aa(0x245)][_0x4b69aa(0x2a3)](this),this[_0x4b69aa(0x2fe)]();},Window_QuestLog['prototype'][_0x528891(0x2fe)]=function(){const _0x1bf20a=_0x528891;if(this[_0x1bf20a(0x397)]--===0x0)this[_0x1bf20a(0x22a)]();},Window_QuestLog['prototype']['updateOrigin']=function(){const _0x15a3ae=_0x528891,_0x5510e4=this['scrollBlockWidth']()||0x1,_0x91072=this[_0x15a3ae(0x282)]()||0x1,_0xbcea65=this[_0x15a3ae(0x31a)]-this[_0x15a3ae(0x31a)]%_0x5510e4,_0x38bc88=this['_scrollY']-this[_0x15a3ae(0x2ba)]%_0x91072;(_0xbcea65!==this[_0x15a3ae(0x26c)]||_0x38bc88!==this['_scrollBaseY'])&&(this[_0x15a3ae(0x350)](_0xbcea65,_0x38bc88),this[_0x15a3ae(0x299)]()),this[_0x15a3ae(0x2c4)]['x']=this[_0x15a3ae(0x31a)],this[_0x15a3ae(0x2c4)]['y']=this[_0x15a3ae(0x2ba)];},Window_QuestLog[_0x528891(0x326)][_0x528891(0x2bf)]=function(){const _0x3a35fb=_0x528891;Window_Scrollable[_0x3a35fb(0x326)]['processWheelScroll'][_0x3a35fb(0x2a3)](this),this[_0x3a35fb(0x23a)]();},Window_QuestLog[_0x528891(0x326)]['updatePageUpDownScroll']=function(){const _0x55fc3e=_0x528891;Input[_0x55fc3e(0x238)](_0x55fc3e(0x29a))&&this[_0x55fc3e(0x31b)](Window_QuestLog[_0x55fc3e(0x1f5)]),Input[_0x55fc3e(0x238)](_0x55fc3e(0x2df))&&this[_0x55fc3e(0x215)](Window_QuestLog['scrollSpeed']);},Window_QuestLog['prototype'][_0x528891(0x34e)]=function(_0x572807){const _0x19f1f8=_0x528891;if(this[_0x19f1f8(0x28a)]===_0x572807)return;this['_quest']=_0x572807,this[_0x19f1f8(0x397)]=Window_QuestLog[_0x19f1f8(0x397)];},Window_QuestLog[_0x528891(0x326)][_0x528891(0x22a)]=function(){const _0x2bb5d7=_0x528891;this[_0x2bb5d7(0x355)]['clear']();const _0x26475c=this[_0x2bb5d7(0x321)](),_0x57b903=this[_0x2bb5d7(0x28a)]?this[_0x2bb5d7(0x2db)]():this['createEmptyText'](),_0x53f5c4=this[_0x2bb5d7(0x35a)](_0x57b903[_0x2bb5d7(0x232)]());this['_textHeight']=_0x53f5c4['height'],this[_0x2bb5d7(0x33b)]===Window_QuestLog&&(this[_0x2bb5d7(0x2d7)]+=this[_0x2bb5d7(0x368)](),Window_QuestLog['wordWrapSupport']&&(this[_0x2bb5d7(0x2d7)]+=this[_0x2bb5d7(0x368)]()*0x4)),this[_0x2bb5d7(0x23e)](),this[_0x2bb5d7(0x20f)](_0x57b903,_0x26475c['x'],_0x26475c['y'],_0x26475c['width']),this[_0x2bb5d7(0x2ba)]=0x0,this[_0x2bb5d7(0x2c4)]['y']=0x0;},Window_QuestLog[_0x528891(0x326)][_0x528891(0x2c8)]=function(){const _0xaf65eb=_0x528891;VisuMZ[_0xaf65eb(0x23c)][_0xaf65eb(0x2cf)][_0xaf65eb(0x2a0)]['OnLoadQuestJS']();let _0xc73039=this['getEmptyLogFmt']();return _0xc73039=VisuMZ[_0xaf65eb(0x23c)][_0xaf65eb(0x276)](_0xc73039),_0xc73039=VisuMZ[_0xaf65eb(0x23c)][_0xaf65eb(0x2f9)](_0xc73039),_0xc73039;},Window_QuestLog[_0x528891(0x326)][_0x528891(0x212)]=function(){return TextManager['questEmptyText'];},Window_QuestLog[_0x528891(0x326)][_0x528891(0x2db)]=function(){const _0x534836=_0x528891,_0x4d5a5d=this[_0x534836(0x28a)],_0x21f281=_0x4d5a5d[_0x534836(0x216)][_0x534836(0x392)]()[_0x534836(0x232)]();if(_0x4d5a5d[_0x534836(0x348)])_0x4d5a5d[_0x534836(0x348)][_0x534836(0x2a3)](this);let _0x23d280=this[_0x534836(0x2aa)]();return _0x23d280=VisuMZ[_0x534836(0x23c)][_0x534836(0x2c0)](_0x23d280),_0x23d280=_0x23d280['replace'](/\[\[RAWTITLE\]\]/gi,_0x4d5a5d['Title']),_0x23d280=_0x23d280[_0x534836(0x37a)](/\[\[TITLE\]\]/gi,_0x4d5a5d[_0x534836(0x377)][_0x534836(0x37a)](/\\I\[(\d+)\]/gi,'')[_0x534836(0x232)]()),_0x23d280=_0x23d280[_0x534836(0x37a)](/\[\[DIFFICULTY\]\]/gi,_0x4d5a5d[_0x534836(0x38b)][_0x534836(0x232)]()),_0x23d280=_0x23d280['replace'](/\[\[FROM\]\]/gi,_0x4d5a5d[_0x534836(0x358)]['trim']()),_0x23d280=_0x23d280[_0x534836(0x37a)](/\[\[LOCATION\]\]/gi,_0x4d5a5d[_0x534836(0x235)]['trim']()),_0x23d280=_0x23d280[_0x534836(0x37a)](/\[\[DESCRIPTION\]\]/gi,this[_0x534836(0x289)](_0x21f281)),_0x23d280=_0x23d280[_0x534836(0x37a)](/\[\[OBJECTIVES\]\]/gi,this[_0x534836(0x385)](_0x4d5a5d,_0x21f281)),_0x23d280=_0x23d280[_0x534836(0x37a)](/\[\[REWARDS\]\]/gi,this[_0x534836(0x2fc)](_0x4d5a5d,_0x21f281)),_0x23d280=_0x23d280[_0x534836(0x37a)](/\[\[SUBTEXT\]\]/gi,this[_0x534836(0x2f7)](_0x21f281)),_0x23d280=_0x23d280['replace'](/\[\[QUOTE\]\]/gi,this[_0x534836(0x200)](_0x21f281)),_0x23d280=VisuMZ['QuestSystem'][_0x534836(0x2f9)](_0x23d280),_0x23d280=VisuMZ[_0x534836(0x23c)]['noMessageCoreRemoveEscapeCodes'](_0x23d280),_0x23d280[_0x534836(0x232)]();},Window_QuestLog[_0x528891(0x326)][_0x528891(0x2aa)]=function(){const _0x4c3151=_0x528891;return TextManager[_0x4c3151(0x35f)];},Window_QuestLog[_0x528891(0x326)][_0x528891(0x289)]=function(_0x3f06be){const _0x63ac6f=_0x528891;let _0x54b015=$gameSystem[_0x63ac6f(0x34b)](_0x3f06be);return _0x54b015=VisuMZ[_0x63ac6f(0x23c)][_0x63ac6f(0x2f9)](_0x54b015),_0x54b015[_0x63ac6f(0x232)]();},Window_QuestLog['prototype'][_0x528891(0x385)]=function(_0xa1282c,_0x25b525){const _0x5eac8c=_0x528891,_0x752e54=[],_0x4c8789=$gameSystem[_0x5eac8c(0x34d)](_0x25b525),_0x4db6d7=$gameSystem['questObjectivesCompleted'](_0x25b525),_0x1eb46b=$gameSystem[_0x5eac8c(0x308)](_0x25b525),_0x5ea2ae=_0x4c8789[_0x5eac8c(0x277)](_0x4db6d7)['concat'](_0x1eb46b)[_0x5eac8c(0x1f7)]((_0x1a9b2e,_0x530578)=>_0x1a9b2e-_0x530578);for(const _0x41a639 of _0x5ea2ae){if(!_0xa1282c[_0x5eac8c(0x2ea)][_0x41a639])continue;const _0x41194e=_0xa1282c[_0x5eac8c(0x2ea)][_0x41a639];let _0xa5b7b3=TextManager['questObjectiveNormalFmt'];if(_0x4db6d7['includes'](_0x41a639))_0xa5b7b3=TextManager[_0x5eac8c(0x21c)];if(_0x1eb46b[_0x5eac8c(0x2a1)](_0x41a639))_0xa5b7b3=TextManager['questObjectiveFailedFmt'];_0x752e54[_0x5eac8c(0x223)](VisuMZ[_0x5eac8c(0x23c)][_0x5eac8c(0x2cc)](_0xa5b7b3[_0x5eac8c(0x29c)](_0x41194e)[_0x5eac8c(0x232)]()));}let _0x2db4d5=VisuMZ[_0x5eac8c(0x23c)][_0x5eac8c(0x1f6)](_0x752e54);return _0x2db4d5;},Window_QuestLog[_0x528891(0x326)][_0x528891(0x2fc)]=function(_0x490b6a,_0x4cf892){const _0x421a57=_0x528891,_0x5158e9=[],_0x5c677e=$gameSystem[_0x421a57(0x318)](_0x4cf892),_0x4c62f0=$gameSystem['questRewardsClaimed'](_0x4cf892),_0x4d4b3b=$gameSystem[_0x421a57(0x210)](_0x4cf892),_0x51ddd3=_0x5c677e['concat'](_0x4c62f0)[_0x421a57(0x277)](_0x4d4b3b)[_0x421a57(0x1f7)]((_0x5d7875,_0xd6978f)=>_0x5d7875-_0xd6978f);for(const _0x2c2181 of _0x51ddd3){if(!_0x490b6a[_0x421a57(0x2de)][_0x2c2181])continue;const _0xdecb04=_0x490b6a[_0x421a57(0x2de)][_0x2c2181];let _0x1ddd0e=TextManager[_0x421a57(0x363)];if(_0x4c62f0[_0x421a57(0x2a1)](_0x2c2181))_0x1ddd0e=TextManager[_0x421a57(0x303)];if(_0x4d4b3b[_0x421a57(0x2a1)](_0x2c2181))_0x1ddd0e=TextManager[_0x421a57(0x24e)];_0x5158e9['push'](VisuMZ['QuestSystem'][_0x421a57(0x2cc)](_0x1ddd0e[_0x421a57(0x29c)](_0xdecb04)[_0x421a57(0x232)]()));}let _0x1cdba9=VisuMZ['QuestSystem']['joinQuestEntries'](_0x5158e9);return _0x1cdba9;},Window_QuestLog['prototype'][_0x528891(0x2f7)]=function(_0x5bcff5){const _0x1611e2=_0x528891;let _0x568ec0=$gameSystem[_0x1611e2(0x2f2)](_0x5bcff5);return _0x568ec0=VisuMZ[_0x1611e2(0x23c)]['finalizeWordWrapSupport'](_0x568ec0),_0x568ec0[_0x1611e2(0x232)]();},Window_QuestLog[_0x528891(0x326)][_0x528891(0x200)]=function(_0x378c4d){const _0x16da10=_0x528891;let _0x5f1c5f=$gameSystem[_0x16da10(0x20b)](_0x378c4d);return _0x5f1c5f=VisuMZ[_0x16da10(0x23c)][_0x16da10(0x2f9)](_0x5f1c5f),_0x5f1c5f[_0x16da10(0x232)]();};function Window_QuestTracker(){const _0x57cbe3=_0x528891;this[_0x57cbe3(0x2dc)](...arguments);}Window_QuestTracker[_0x528891(0x326)]=Object[_0x528891(0x2ac)](Window_QuestLog[_0x528891(0x326)]),Window_QuestTracker[_0x528891(0x326)][_0x528891(0x33b)]=Window_QuestTracker,Window_QuestTracker[_0x528891(0x26d)]=VisuMZ[_0x528891(0x23c)][_0x528891(0x2cf)]['Window'][_0x528891(0x1e5)],Window_QuestTracker[_0x528891(0x36d)]=VisuMZ[_0x528891(0x23c)]['Settings'][_0x528891(0x25e)][_0x528891(0x34f)],Window_QuestTracker['prototype'][_0x528891(0x2dc)]=function(_0x4df52b){const _0x1356f5=_0x528891;Window_QuestLog[_0x1356f5(0x326)]['initialize']['call'](this,_0x4df52b),this['setQuest']($gameSystem[_0x1356f5(0x305)]()),this[_0x1356f5(0x26d)]['x']=this[_0x1356f5(0x26d)]['y']=Window_QuestTracker[_0x1356f5(0x26d)],this[_0x1356f5(0x319)]();},Window_QuestTracker[_0x528891(0x326)]['contentsHeight']=function(){const _0x5d47c5=_0x528891;return this[_0x5d47c5(0x2d7)]||0x0;},Window_QuestTracker[_0x528891(0x326)][_0x528891(0x212)]=function(){return'';},Window_QuestTracker['prototype'][_0x528891(0x2aa)]=function(){const _0x16b07f=_0x528891;return TextManager[_0x16b07f(0x281)];},Window_QuestTracker[_0x528891(0x326)][_0x528891(0x23e)]=function(){const _0x5e3d09=_0x528891;this['height']=this[_0x5e3d09(0x32e)]()+$gameSystem['windowPadding']()*0x2,Window_QuestLog[_0x5e3d09(0x326)][_0x5e3d09(0x23e)]['call'](this);},Window_QuestTracker[_0x528891(0x326)][_0x528891(0x34e)]=function(_0x2bf724){const _0x4e7709=_0x528891;if(this[_0x4e7709(0x28a)]===_0x2bf724)return;this[_0x4e7709(0x28a)]=_0x2bf724,this[_0x4e7709(0x22a)]();},Window_QuestTracker[_0x528891(0x326)][_0x528891(0x22a)]=function(){const _0x45b2a3=_0x528891;if($gameTemp[_0x45b2a3(0x35c)])return;$gameTemp['_questTrackerRefresh']=!![],Window_QuestLog[_0x45b2a3(0x326)][_0x45b2a3(0x22a)][_0x45b2a3(0x2a3)](this),this[_0x45b2a3(0x24b)](this[_0x45b2a3(0x28a)]?Window_QuestTracker['activeBgType']:0x2),$gameTemp[_0x45b2a3(0x35c)]=![];},Window_QuestTracker[_0x528891(0x326)][_0x528891(0x245)]=function(){const _0x3d1b96=_0x528891;Window_QuestLog['prototype']['update'][_0x3d1b96(0x2a3)](this),this[_0x3d1b96(0x319)]();},Window_QuestTracker[_0x528891(0x326)][_0x528891(0x319)]=function(){const _0x280294=_0x528891,_0x4f06bc=this[_0x280294(0x30f)]();this['openness']=_0x4f06bc;},Window_QuestTracker[_0x528891(0x326)][_0x528891(0x30f)]=function(){const _0x58a146=_0x528891;if(!ConfigManager[_0x58a146(0x36b)])return 0x0;if($gameTemp[_0x58a146(0x30e)])return 0x0;const _0x2e9821=SceneManager[_0x58a146(0x1d9)];if(_0x2e9821&&_0x2e9821[_0x58a146(0x2d9)]){if(_0x2e9821[_0x58a146(0x2d9)][_0x58a146(0x295)]>0x0)return 0x0;}if(!this[_0x58a146(0x28a)])return 0x0;return $gameSystem[_0x58a146(0x32a)]()?0xff:0x0;},VisuMZ[_0x528891(0x23c)][_0x528891(0x2f9)]=function(_0x4f4dcf){const _0x9ecc94=_0x528891;if(!Window_QuestLog['wordWrapSupport'])return _0x4f4dcf;if(!Imported[_0x9ecc94(0x1fe)])return _0x4f4dcf;return _0x4f4dcf=_0x9ecc94(0x294)[_0x9ecc94(0x29c)](_0x4f4dcf),_0x4f4dcf;},VisuMZ['QuestSystem']['noMessageCoreRemoveEscapeCodes']=function(_0x1b7749){const _0x1a41ab=_0x528891;if(Imported[_0x1a41ab(0x1fe)])return _0x1b7749;return _0x1b7749=_0x1b7749[_0x1a41ab(0x37a)](/<COLORLOCK>/gi,''),_0x1b7749=_0x1b7749[_0x1a41ab(0x37a)](/<\/COLORLOCK>/gi,''),_0x1b7749;},VisuMZ[_0x528891(0x23c)][_0x528891(0x276)]=function(_0x19953b){const _0x5aedbc=_0x528891;if(!Window_QuestLog['wordWrapSupport'])return _0x19953b['replace'](/<(?:BR|LINEBREAK)>/gi,'');if(!Imported[_0x5aedbc(0x1fe)])return _0x19953b['replace'](/<(?:BR|LINEBREAK)>/gi,'');return VisuMZ['MessageCore'][_0x5aedbc(0x2cf)][_0x5aedbc(0x301)][_0x5aedbc(0x22e)]?_0x19953b=_0x19953b[_0x5aedbc(0x37a)](/[\n\r]+/g,_0x5aedbc(0x2d2)):_0x19953b=_0x19953b[_0x5aedbc(0x37a)](/[\n\r]+/g,''),_0x19953b;},VisuMZ[_0x528891(0x23c)]['convertLineBreaksForWordWrap']=function(_0x16e035){const _0x385f2c=_0x528891;if(!Window_QuestLog['wordWrapSupport'])return _0x16e035;if(!Imported[_0x385f2c(0x1fe)])return _0x16e035;return _0x16e035['trim']()[_0x385f2c(0x37a)](/[\n\r]/g,_0x385f2c(0x202));},VisuMZ[_0x528891(0x23c)]['applyWordWrapEntry']=function(_0x401951){const _0x2aa05c=_0x528891;if(!Window_QuestLog['wordWrapSupport'])return _0x401951;if(!Imported['VisuMZ_1_MessageCore'])return _0x401951;return VisuMZ[_0x2aa05c(0x23c)][_0x2aa05c(0x276)](_0x401951[_0x2aa05c(0x232)]());},VisuMZ[_0x528891(0x23c)][_0x528891(0x1f6)]=function(_0x2d1b70){const _0x1d0eb3=_0x528891;if(!Window_QuestLog['wordWrapSupport'])return _0x2d1b70[_0x1d0eb3(0x36c)]('\x0a')['trim']();if(!Imported[_0x1d0eb3(0x1fe)])return _0x2d1b70[_0x1d0eb3(0x36c)]('\x0a')[_0x1d0eb3(0x232)]();return _0x2d1b70[_0x1d0eb3(0x36c)]('<BR>')['trim']();},totalQuestsAvailable=function(){const _0x9a2148=_0x528891;return $gameSystem['questData']()[_0x9a2148(0x351)][_0x9a2148(0x27d)];},totalQuestsCompleted=function(){const _0x200a51=_0x528891;return $gameSystem['questData']()[_0x200a51(0x1f1)][_0x200a51(0x27d)];},totalQuestsFailed=function(){const _0x4c2d8a=_0x528891;return $gameSystem[_0x4c2d8a(0x2a6)]()[_0x4c2d8a(0x239)][_0x4c2d8a(0x27d)];},totalQuestsRevealed=function(){return totalQuestsAvailable()+totalQuestsCompleted()+totalQuestsFailed();},totalQuestsInGame=function(){const _0x229972=_0x528891;return VisuMZ[_0x229972(0x23c)][_0x229972(0x21a)][_0x229972(0x27d)];},getQuestDescriptionIndex=function(_0x35bb6c){const _0x3c17fa=_0x528891;_0x35bb6c=_0x35bb6c['toUpperCase']()[_0x3c17fa(0x232)]();const _0xd5f8d7=$gameSystem[_0x3c17fa(0x389)](_0x35bb6c);if(!_0xd5f8d7)return-0x1;$gameSystem['questDescription'](_0x35bb6c);const _0x4e8e9b=$gameSystem[_0x3c17fa(0x2a6)]()[_0x3c17fa(0x2be)];return _0x4e8e9b[_0x35bb6c]||0x0;},totalVisibleQuestObjectives=function(_0x42970e){const _0x382a9b=_0x528891;_0x42970e=_0x42970e[_0x382a9b(0x392)]()['trim']();const _0x130fff=$gameSystem[_0x382a9b(0x389)](_0x42970e);if(!_0x130fff)return-0x1;$gameSystem[_0x382a9b(0x34d)](_0x42970e);const _0x13f131=$gameSystem[_0x382a9b(0x2a6)]()[_0x382a9b(0x32b)]||{};if(!_0x13f131[_0x42970e])return 0x0;return _0x13f131[_0x42970e][_0x382a9b(0x27d)];},totalQuestObjectives=function(_0x1b7b03){const _0x14e7d0=_0x528891;_0x1b7b03=_0x1b7b03[_0x14e7d0(0x392)]()[_0x14e7d0(0x232)]();const _0x1d1e7e=$gameSystem[_0x14e7d0(0x389)](_0x1b7b03);return _0x1d1e7e?_0x1d1e7e[_0x14e7d0(0x2ea)][_0x14e7d0(0x27d)]-0x1:0x0;},totalVisibleQuestRewards=function(_0x289f0e){const _0xef199d=_0x528891;_0x289f0e=_0x289f0e[_0xef199d(0x392)]()[_0xef199d(0x232)]();const _0xadeb32=$gameSystem[_0xef199d(0x389)](_0x289f0e);if(!_0xadeb32)return-0x1;$gameSystem['questRewards'](_0x289f0e);const _0x886826=$gameSystem['questData']()[_0xef199d(0x394)]||{};if(!_0x886826[_0x289f0e])return 0x0;return _0x886826[_0x289f0e]['length'];},totalQuestRewards=function(_0x173c13){const _0x2992b8=_0x528891;_0x173c13=_0x173c13[_0x2992b8(0x392)]()[_0x2992b8(0x232)]();const _0x3c9de6=$gameSystem[_0x2992b8(0x389)](_0x173c13);return _0x3c9de6?_0x3c9de6[_0x2992b8(0x2de)]['length']-0x1:0x0;},getQuestSubtextIndex=function(_0xd27248){const _0x1006d3=_0x528891;_0xd27248=_0xd27248['toUpperCase']()[_0x1006d3(0x232)]();const _0x153580=$gameSystem[_0x1006d3(0x389)](_0xd27248);if(!_0x153580)return-0x1;$gameSystem[_0x1006d3(0x2f2)](_0xd27248);const _0x4e73aa=$gameSystem['questData']()[_0x1006d3(0x342)];return _0x4e73aa[_0xd27248]||0x0;},getQuestQuoteIndex=function(_0x48df05){const _0x3ff139=_0x528891;_0x48df05=_0x48df05['toUpperCase']()[_0x3ff139(0x232)]();const _0x3fa158=$gameSystem[_0x3ff139(0x389)](_0x48df05);if(!_0x3fa158)return-0x1;$gameSystem[_0x3ff139(0x20b)](_0x48df05);const _0x4be489=$gameSystem[_0x3ff139(0x2a6)]()[_0x3ff139(0x204)];return _0x4be489[_0x48df05]||0x0;},isQuestObjectiveCompleted=function(_0x1da4e3,_0x166b7d){const _0x370e49=_0x528891;_0x1da4e3=_0x1da4e3[_0x370e49(0x392)]()[_0x370e49(0x232)]();const _0x5b2e14=$gameSystem[_0x370e49(0x389)](_0x1da4e3);if(!_0x5b2e14)return![];$gameSystem[_0x370e49(0x34d)](_0x1da4e3);const _0x538677=$gameSystem[_0x370e49(0x2a6)]()['objectivesCompleted'];if(!_0x538677[_0x1da4e3])return![];return _0x538677[_0x1da4e3]['includes'](_0x166b7d);},isQuestObjectiveFailed=function(_0x57566f,_0x97bcbf){const _0x526a00=_0x528891;_0x57566f=_0x57566f['toUpperCase']()['trim']();const _0x4fcf03=$gameSystem[_0x526a00(0x389)](_0x57566f);if(!_0x4fcf03)return![];$gameSystem[_0x526a00(0x34d)](_0x57566f);const _0xd805e0=$gameSystem[_0x526a00(0x2a6)]()[_0x526a00(0x25c)];if(!_0xd805e0[_0x57566f])return![];return _0xd805e0[_0x57566f]['includes'](_0x97bcbf);},isQuestObjectiveUncleared=function(_0x137630,_0x2de2f4){const _0x59e85d=_0x528891;_0x137630=_0x137630[_0x59e85d(0x392)]()['trim']();const _0x155d27=$gameSystem[_0x59e85d(0x389)](_0x137630);if(!_0x155d27)return![];$gameSystem[_0x59e85d(0x34d)](_0x137630);const _0x3e33d6=$gameSystem[_0x59e85d(0x2a6)]()[_0x59e85d(0x32b)];if(!_0x3e33d6[_0x137630])return![];return _0x3e33d6[_0x137630][_0x59e85d(0x2a1)](_0x2de2f4);},isQuestRewardClaimed=function(_0x5a7305,_0x24c09f){const _0x842789=_0x528891;_0x5a7305=_0x5a7305['toUpperCase']()['trim']();const _0x30ccb6=$gameSystem[_0x842789(0x389)](_0x5a7305);if(!_0x30ccb6)return![];$gameSystem[_0x842789(0x318)](_0x5a7305);const _0x40feea=$gameSystem[_0x842789(0x2a6)]()[_0x842789(0x1f8)];if(!_0x40feea[_0x5a7305])return![];return _0x40feea[_0x5a7305][_0x842789(0x2a1)](_0x24c09f);},isQuestRewardDenied=function(_0x56678d,_0x519988){const _0x5a470f=_0x528891;_0x56678d=_0x56678d[_0x5a470f(0x392)]()[_0x5a470f(0x232)]();const _0x9eb19a=$gameSystem[_0x5a470f(0x389)](_0x56678d);if(!_0x9eb19a)return![];$gameSystem[_0x5a470f(0x318)](_0x56678d);const _0x4ac3bc=$gameSystem[_0x5a470f(0x2a6)]()['rewardsDenied'];if(!_0x4ac3bc[_0x56678d])return![];return _0x4ac3bc[_0x56678d][_0x5a470f(0x2a1)](_0x519988);},isQuestRewardUnclaimed=function(_0x1292a5,_0x5a329b){const _0x3b4c10=_0x528891;_0x1292a5=_0x1292a5[_0x3b4c10(0x392)]()['trim']();const _0x1a8284=$gameSystem[_0x3b4c10(0x389)](_0x1292a5);if(!_0x1a8284)return![];$gameSystem[_0x3b4c10(0x318)](_0x1292a5);const _0x4961=$gameSystem[_0x3b4c10(0x2a6)]()[_0x3b4c10(0x394)];if(!_0x4961[_0x1292a5])return![];return _0x4961[_0x1292a5][_0x3b4c10(0x2a1)](_0x5a329b);};