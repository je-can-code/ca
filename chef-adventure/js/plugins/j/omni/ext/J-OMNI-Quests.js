//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v2.0.3 OMNI-QUEST] Extends the Omnipedia with a Questopedia entry.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-Omnipedia
 * @orderAfter J-Base
 * @orderAfter J-Omnipedia
 * @orderAfter J-HUD
 * @orderAfter J-MessageTextCodes
 * @orderAfter J-ABS
 * @orderAfter J-ABS-InputManager
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin extends the Omnipedia by adding a new entry: The Questopedia.
 *
 * Integrates with others of mine plugins:
 * - J-Base             : always required for my plugins.
 * - J-Messages         : adds \quest[questKey] message codes.
 * - J-HUD              : adds a quest tracker window.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * "The Questopedia" is another module for the Omnipedia.
 * It provides a log for tracking and managing quests in a somewhat organized
 * fashion.
 *
 * Quests are described by a collection of data points in the config file.
 * (see the IMPORTANT NOTE down below)
 * These data points together define the metadata of a quest. They include:
 * - name
 * - key
 * - categoryKey
 * - tagKeys
 * - unknownHint
 * - overview
 * - recommendedLevel
 * - objectives
 *   - id
 *   - type
 *   - description
 *   - fulfillmentData
 *   - fulfillmentQuestKeys
 *   - hiddenByDefault
 *   - isOptional
 *   - logs
 *     - discovered
 *     - completed
 *     - failed
 *     - missed
 *
 * You can see that there is a lot of data, but this is what you need to know:
 * A Quest consists of a series of objectives.
 * Each objective should be identifiable as a single distinct task.
 * Each objective can be categorized into one of five categories of objective.
 *
 * Remembering the above will keep you in the right mindset to fill in the
 * rest of the details. Some of the rest of the details are just text you'll
 * find across the GUI for the system. The rest of the rest of the details are
 * a means to link objectives and quest data together.
 *
 * Read the "BUILDING A QUEST" section for more information about the details.
 *
 * IMPORTANT NOTE:
 * The Quest data is derived from an external file rather than the plugin's
 * parameters. This file lives in the "/data" directory of your project, and
 * is called "config.quest.json". You can absolutely generate/modify this file
 * by hand, but you'll probably want to visit my GitHub and swipe the
 * rmmz-data-editor project I've built that provides a convenient GUI for
 * generating and modifying quests in just about every way you could need.
 *
 * If this configuration file is missing, the game will not run.
 *
 * Additionally, due to the way RMMZ base code is designed, by loading external
 * files for configuration like this, a project made with this plugin will
 * simply crash when attempting to load in a web context with an error akin to:
 *    "ReferenceError require is not defined"
 * This error is a result of attempting to leverage nodejs' "require" loader
 * to load the "fs" (file system) library to then load the plugin's config
 * file. Normally a web deployed game will alternatively use "forage" instead
 * to handle things that need to be read or saved, but because the config file
 * is just that- a file sitting in the /data directory rather than loaded into
 * forage storage- it becomes inaccessible.
 * ============================================================================
 * BUILDING A QUEST
 * Ever want to build and manage quests in your RPG Maker MZ game? Well now you
 * can! By constructing the correct JSON to match your heart's deepest desires
 * for quests, you too can do questopedic things!
 *
 * TLDR;
 * Use my "rmmz-data-editor" to actually construct the data, please don't try
 * to hack this together manually by writing JSON.
 *
 * ============================================================================
 * QUEST-GATED EVENT PAGES AND CHOICES:
 * Beyond the JSON-authored quest data itself, this plugin adds tags that
 * gate event pages and "Show Choices" branches behind quest/objective
 * state, similar in spirit to J-MessageTextCodes' leader/switch choice
 * conditionals.
 *
 * NOTE ABOUT THE THREE ARGUMENT SHAPES:
 * All six tags below accept the array in one of three shapes, and behave
 * accordingly:
 *  [QUEST_KEY]
 *   Valid while the quest itself is active (any objective).
 *  [QUEST_KEY, OBJECTIVE_ID]
 *   Valid while that specific objective is active.
 *  [QUEST_KEY, OBJECTIVE_ID, STATE]
 *   Valid while that specific objective is in the given STATE, where STATE
 *   is one of: inactive, active, completed, failed, missed.
 *
 * TAG USAGE:
 * - Event pages (comment, gates the whole page like a normal page condition)
 * - "Show Choices" branches (comment, gates a single choice)
 *
 * TAG FORMAT:
 *  <pageQuestCondition:[QUEST_KEY]>
 *  <pageQuestCondition:[QUEST_KEY, OBJECTIVE_ID]>
 *  <pageQuestCondition:[QUEST_KEY, OBJECTIVE_ID, STATE]>
 *    Gates an entire event page.
 *
 *  <choiceQuestCondition:[QUEST_KEY]>
 *  <choiceQuestCondition:[QUEST_KEY, OBJECTIVE_ID]>
 *  <choiceQuestCondition:[QUEST_KEY, OBJECTIVE_ID, STATE]>
 *    Gates a single "Show Choices" branch.
 *
 * TAG EXAMPLES:
 *  <pageQuestCondition:[herbalist_delivery]>
 * This event page is only active while the "herbalist_delivery" quest is
 * active (in any objective state).
 *
 *  <pageQuestCondition:[herbalist_delivery, 2]>
 * This event page is only active while objective 2 of that quest is active.
 *
 *  <choiceQuestCondition:[herbalist_delivery, 2, completed]>
 * This choice is only shown while objective 2 of that quest is completed.
 * ============================================================================
 * CHANGELOG:
 * - 2.0.3
 *    Fixed quest choice conditionals not hiding branches inside called common
 *    events. Dropped the dead commonEventId accessor.
 * - 2.0.2
 *    Routed every quest and objective warning and error through J-Base's new
 *    Diagnostics, so each names J-OMNI-Quests. Removed the console.log lines
 *    narrating category changes, tracking toggles, index moves, quest additions
 *    and no-op state refreshes; none reported a fault.
 * - 2.0.1
 *    Repointed quest and objective update announcements at J-Log's new
 *    $mapLogs registry. The $diaLogManager global these called is gone.
 *    Requires J-Log 3.0.0 when J-Log is installed at all.
 * - 2.0.0
 *    Renamed from J-Omni-Questopedia to J-OMNI-Quests. The shipped file is
 *    renamed with it, so an existing plugins.js entry must be updated or the
 *    plugin will simply not load.
 * - 1.2.2
 *    Removed two console logs left over from testing.
 * - 1.2.1
 *    The questopedia description window no longer declares private members. A
 *    window's constructor reaches initialize, and through it the drawing
 *    hooks, before a derived class installs its own members- so anything
 *    private was being touched on an object that did not yet have it.
 * - 1.2.0
 *    The questopedia lookup cache is no longer written to savefiles. It held
 *    the same entries as the saveables it is built from, keyed for lookup,
 *    which made it the single largest thing in a savefile - 44,109 characters
 *    in a real one. It now rebuilds from the saveables on load.
 *    The destination timer is no longer written either; the map gets a fresh
 *    one, since it measures nothing the player can observe.
 * - 1.1.0
 *    Added <pageQuestCondition>/<choiceQuestCondition>, gating an event
 *    page or a single "Show Choices" branch behind quest/objective state
 *    (active quest, active objective, or a specific objective STATE:
 *    inactive/active/completed/failed/missed).
 * - 1.0.3
 *    Updated to accommodate for mapping shortcut to view quest log.
 *    Added flag for showing external file load info.
 * - 1.0.2
 *    Adapted for updates to J-ABS-InputManager (input namespace).
 * - 1.0.1
 *    Adds support for JABS-based input remapping.
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 *
 * @param parentConfig
 * @text SETUP
 *
 * @param menu-switch
 * @parent parentConfig
 * @type switch
 * @text Menu Switch ID
 * @desc When this switch is ON, then this command is visible in the menu.
 * @default 101
 *
 *
 * @command unlock-quests
 * @text Unlock Quest(s)
 * @desc Unlocks a new quest for the player.
 * @arg keys
 * @type string[]
 * @desc The unique keys for the quests that will be unlocked.
 * 
 * @command progress-quest
 * @text Progress Quest
 * @desc Progresses a given quest through by completing its current objective.
 * @arg key
 * @type string
 * @desc The unique key for the quest to progress.
 * 
 * @command finalize-quest
 * @text Finalize Quest
 * @desc Flags a quest as a given finalized state.
 * @arg key
 * @type string
 * @desc The unique key for the quest to progress.
 * @arg state
 * @text Finalized State
 * @desc The state to finalize the quest as.
 * @type select
 * @option Completed
 * @value 0
 * @option Failed
 * @value 1
 * @option Missed
 * @value 2
 * 
 * @command set-quest-tracking
 * @text Set Quest Tracking
 * @desc Sets whether or not a given quest is tracked.
 * @arg key
 * @type string
 * @desc The unique key for the quest to progress.
 * @arg trackingState
 * @desc True if the quest should be tracked, false otherwise.
 * @type boolean
 * @default true
 * @on Start Tracking Quest
 * @off Stop Tracking Quest
 * 
 */
//endregion annotations

//#region src/plugins/omni/ext/quest/__models/fulfillment/IndiscriminateData.js
/**
* The data representing the fulfillment requirements for indiscriminate objectives.
*/
var IndiscriminateData = class {
	hint = null;
};

//#endregion
//#region src/plugins/omni/ext/quest/__models/fulfillment/DestinationData.js
/**
* The data representing the fulfillment requirements for destination-based objectives.
*/
var DestinationData = class {
	mapId = -1;
	x1 = -1;
	y1 = -1;
	x2 = -1;
	y2 = -1;
};

//#endregion
//#region src/plugins/omni/ext/quest/__models/fulfillment/FetchData.js
/**
* The data representing the fulfillment requirements for fetch-based objectives.
*/
var FetchData = class {
	type = -1;
	id = -1;
	amount = 0;
};

//#endregion
//#region src/plugins/omni/ext/quest/__models/fulfillment/SlayData.js
/**
* The data representing the fulfillment requirements for slay-based objectives.
*/
var SlayData = class {
	id = -1;
	amount = 0;
};

//#endregion
//#region src/plugins/omni/ext/quest/__models/fulfillment/QuestData.js
/**
* The data representing the fulfillment requirements for quest-based objectives.
*/
var QuestData = class {
	/**
	* The quest keys that must be completed to consider the objective complete.
	* @type {string[]}
	*/
	keys = [];
};

//#endregion
//#region src/plugins/omni/ext/quest/__models/OmniFulfillmentData.js
/**
* A class representing the data shape of the fulfillment requirements for a single objective on a quest.
*/
var OmniFulfillmentData = class {
	/**
	* The fulfillment details for objectives that cannot be categorized by any one of the other objective types.
	* @type {IndiscriminateData}
	*/
	indiscriminate = null;
	/**
	* The fulfillment details for objectives that require the player to reach a certain destination.
	* @type {DestinationData}
	*/
	destination = null;
	/**
	* The fulfillment details for fetch-based objectives.
	* @type {FetchData}
	*/
	fetch = null;
	/**
	* The fulfillment details for enemy-slaying-based objectives.
	* @type {SlayData}
	*/
	slay = null;
	/**
	* The fulfillment details for quest-completion-based objectives.
	* @type {QuestData}
	*/
	quest = null;
	/**
	* @constructor
	* @param {IndiscriminateData=} indiscriminate The indiscriminate data; defaults to null.
	* @param {DestinationData=} destination The destination data; defaults to null.
	* @param {FetchData=} fetch The fetch data; defaults to null.
	* @param {SlayData=} slay The slay data; defaults to null.
	* @param {QuestData=} quest The quest data; defaults to null.
	*/
	constructor(indiscriminate = null, destination = null, fetch = null, slay = null, quest = null) {
		this.indiscriminate = indiscriminate ?? new IndiscriminateData();
		this.destination = destination ?? new DestinationData();
		this.fetch = fetch ?? new FetchData();
		this.slay = slay ?? new SlayData();
		this.quest = quest ?? new QuestData();
	}
};

//#endregion
//#region src/plugins/omni/ext/quest/__models/OmniObjectiveLogs.js
/**
* A class representing the data shape of the various log messages associated with the state of an objective. These will
* reflect in the quest log when reviewing the quest in question.
*/
var OmniObjectiveLogs = class {
	/**
	* The text displayed in the log when the objective hasn't yet been discovered by the player. Generally this won't be
	* shown, but if the objective is also hidden, it will.
	* @type {string}
	*/
	inactive = String.empty;
	/**
	* The text displayed in the log while the objective is still unfulfilled but ongoing.
	* @type {string}
	*/
	active = String.empty;
	/**
	* The text displayed in the log after this objective is fulfilled successfully.
	* @type {string}
	*/
	completed = String.empty;
	/**
	* The text displayed in the log after this objective is failed.
	* @type {string}
	*/
	failed = String.empty;
	/**
	* The text displayed in the log after this objective is missed.
	* @type {string}
	*/
	missed = String.empty;
	/**
	* @constructor
	* @param {string} unknown The log text for when this objective is yet to be discovered.
	* @param {string} discovered The log text for when this objective is made active.
	* @param {string} completed The log text for when this objective is completed successfully.
	* @param {string} failed The log text for when this objective is failed.
	* @param {string} missed The log text for when this objective is missed.
	*/
	constructor(unknown, discovered, completed, failed, missed) {
		this.inactive = unknown;
		this.active = discovered;
		this.completed = completed;
		this.failed = failed;
		this.missed = missed;
	}
};

//#endregion
//#region src/plugins/omni/ext/quest/__models/OmniObjective.js
/**
* A class representing the data shape of a single objective on a quest.
*/
var OmniObjective = class OmniObjective {
	/**
	* The various types that a quest objective can be.
	* <pre>
	*     Indiscriminate: -1
	*     Destination: 0
	*     Fetch: 1
	*     Slay: 2
	*     Quest: 3
	* </pre>
	*/
	static Types = {
		/**
		* An objective that is of type "indiscriminate" means that it does not have any known fulfillment criteria as far
		* as the player is concerned, and thus must be manually handled by the developer with events and/or plugin
		* commands.
		*/
		Indiscriminate: "Indiscriminate",
		/**
		* An objective that is of type "destination" means that to fulfill the objective, the player must arrive at a
		* particular mapId, usually within a set of coordinates on a given map. These types of quests will stop being
		* monitored once the objective has been achieved.
		*/
		Destination: "Destination",
		/**
		* An objective that is of type "fetch" means that to fulfill the objective, the player must acquire one or more of
		* a specified item/weapon/armor in their inventory at a given time. These types of quests are perpetually monitored
		* until the quest is turned in, so the objective can potentially go in and out of a "completed" state.
		*/
		Fetch: "Fetch",
		/**
		* An objective that is of type "slay" means that to fulfill the objective, the player must defeat one or more of a
		* specified enemy after the objective has been made active. Once the enemy has been defeated X times, the objective
		* will be identified as completed and will cease being monitored.
		*/
		Slay: "Slay",
		/**
		* An objective that is of type "quest" means that to fulfill the objective, the player must fully complete another
		* quest. Once the quest in question is completed, this objective will also be completed, however, if the target
		* quest is failed, this objective will be considered failed as well, usually resulting in the quest this objective
		* belonging to being considered failed.
		*/
		Quest: "Quest"
	};
	/**
	* The various states that an objective can be in.
	* <pre>
	*     Inactive: 0
	*     Active: 1
	*     Completed: 2
	*     Failed: 3
	*     Missed: 4
	* </pre>
	* @type {{Active: number, Failed: number, Completed: number, Inactive: number, Missed: number}}
	*/
	static States = {
		/**
		* When an objective is in the "inactive" state, it means it has yet to be discovered by the player so it will not
		* show up in the questopedia.
		*/
		Inactive: 0,
		/**
		* When an objective is in the "active" state, it means it is currently being tracked, whatever the objective is.
		*/
		Active: 1,
		/**
		* When an objective is in the "completed" state, it means it was was successfully completed and the next objective
		* in the quest should be or already is activated.
		*/
		Completed: 2,
		/**
		* When an objective is in the "failed" state, it means it was activated, but the fulfillment critera were not met.
		* Typically a failed objective means the quest is a failure.
		*/
		Failed: 3,
		/**
		* When an objective is in the "missed" state, it means it was activated either intentionally or otherwise, and the
		* fulfillment criteria were not met. However, missed objectives typically don't fail quests.
		*/
		Missed: 4
	};
	static FetchTypes = {
		/**
		* The default state for a fetch objective before a real type has been chosen.
		*/
		Unset: -1,
		Item: 0,
		Weapon: 1,
		Armor: 2
	};
	/**
	* The id of this objective. This is typically used to indicate order between objectives within a single quest.
	* @type {number}
	*/
	id = -1;
	/**
	* The type of objective this is, defining how the fulfillment criteria is monitored.
	* @type {number}
	*/
	type = OmniObjective.Types.Indiscriminate;
	/**
	* The contextual description that will be displayed in the objective itself regarding why the objective should be
	* completed.
	* @type {string}
	*/
	description = String.empty;
	/**
	* The log information associated with the different states of this objective.
	* @type {OmniObjectiveLogs}
	*/
	logs = null;
	/**
	* The various data points that define how the objective can be fulfilled.
	* @type {OmniFulfillmentData}
	*/
	fulfillment = null;
	/**
	* Whether or not this objective is hidden by default.
	* @type {boolean}
	*/
	hiddenByDefault = true;
	/**
	* Whether or not this objective is considered "optional", in that it is not strictly required to complete the parent
	* quest. Typically these objectives will end up "missed" if not completed rather than "failed".
	* @type {boolean}
	*/
	isOptional = false;
	/**
	* Constructor.
	* @param {number} id The id of this objective.
	* @param {number} type The common classification of this objective.
	* @param {string} description The contextural description of this objective.
	* @param {OmniObjectiveLogs} logs The log information associated with the different states of this objective.
	* @param {OmniFulfillmentData} fulfillment The fulfillment data for this objective.
	* @param {boolean=} hiddenByDefault Whether or not this objective will be hidden upon activating the parent quest.
	* @param {boolean=} isOptional Whether or not this objective is optional for its parent quest.
	*/
	constructor(id, type, description, logs, fulfillment, hiddenByDefault = true, isOptional = false) {
		this.id = id;
		this.type = type;
		this.description = description;
		this.logs = logs;
		this.fulfillment = fulfillment;
		this.hiddenByDefault = hiddenByDefault;
		this.isOptional = isOptional;
	}
	/**
	* The various fulfillment string templates that are re-used based on the type of template the objective is. For each
	* of the {@link OmniObjective.Types}, the expected templateDetails shape varies as described below.
	* <pre>
	*   Indiscriminate: Should be a single string representing what the UI will display for this objective.
	*   Destination: Should be three elements, a string destination, and the x,y coordinates as numbers.
	*   Fetch: Should be the number to fetch, and the thing to fetch the number of.
	*   Slay: Should be the number to defeat, and the enemy to defeat the number of times.
	*   Quest: Should be the name of the quest or some other clue to fulfill the objective.
	* </pre>
	* @param {number} type The type that aligns with one of {@link OmniObjective.Types}.
	* @param {(string|number)[]} templateDetails The details plugged into the template; the slots vary by type.
	* @returns {string} The templated fulfillment for this objective.
	*/
	static FulfillmentTemplate(type, templateDetails) {
		switch (type) {
			case OmniObjective.Types.Indiscriminate: return templateDetails.at(0);
			case OmniObjective.Types.Destination: return `Navigate to ${templateDetails.at(0)} at [${templateDetails.at(1)}, ${templateDetails.at(2)}].`;
			case OmniObjective.Types.Fetch: return `Acquire \\*${templateDetails.at(0)}\\* ${templateDetails.at(1)}.`;
			case OmniObjective.Types.Slay: return `Defeat \\*${templateDetails.at(0)}\\* \\Enemy[${templateDetails.at(1)}].`;
			case OmniObjective.Types.Quest: return `Complete the other quest(s): ${templateDetails.at(0)}.`;
			default: return "This objective is not defined.";
		}
	}
};

//#endregion
//#region src/plugins/omni/ext/quest/__models/OmniCategory.js
/**
* A class representing the data shape of a single category a quest can belong to.
*/
var OmniCategory = class {
	/**
	* The primary key of the category. This is a unique representation used for accessing the category data.
	* @type {string}
	*/
	key = String.empty;
	/**
	* The name of the category.
	* @type {string}
	*/
	name = String.empty;
	/**
	* The icon index for the category.
	* @type {number}
	*/
	iconIndex = 0;
	/**
	* Constructor.
	* @param {string} key The key of the category.
	* @param {string} name The name of the category.
	* @param {number} iconIndex The icon index of the category.
	*/
	constructor(key, name, iconIndex) {
		this.key = key;
		this.name = name;
		this.iconIndex = iconIndex;
	}
};

//#endregion
//#region src/plugins/omni/ext/quest/__models/OmniTag.js
/**
* A class representing the data shape of a single tag a quest can be associated with.
*/
var OmniTag = class {
	/**
	* The primary key of the tag. This is a unique representation used for accessing the tag data.
	* @type {string}
	*/
	key = String.empty;
	/**
	* The name of the tag.
	* @type {string}
	*/
	name = String.empty;
	/**
	* The icon index for the tag.
	* @type {number}
	*/
	iconIndex = 0;
	/**
	* Constructor.
	* @param {string} key The key of the category.
	* @param {string} name The name of the category.
	* @param {number} iconIndex The icon index of the category.
	*/
	constructor(key, name, iconIndex) {
		this.key = key;
		this.name = name;
		this.iconIndex = iconIndex;
	}
};

//#endregion
//#region src/plugins/omni/ext/quest/__models/OmniQuestBuilder.js
/**
* A builder for creating {@link OmniQuest}s.
*/
var OmniQuestBuilder = class {
	#name = String.empty;
	#key = String.empty;
	#categoryKey = String.empty;
	#tagKeys = Array.empty;
	#unknownHint = String.empty;
	#overview = String.empty;
	#recommendedLevel = 0;
	#objectives = Array.empty;
	build() {
		const omniquest = new OmniQuest(this.#name, this.#key, this.#categoryKey, this.#tagKeys, this.#unknownHint, this.#overview, this.#recommendedLevel, this.#objectives);
		this.clear();
		return omniquest;
	}
	clear() {
		this.#name = String.empty;
		this.#key = String.empty;
		this.#categoryKey = String.empty;
		this.#tagKeys = Array.empty;
		this.#unknownHint = String.empty;
		this.#overview = String.empty;
		this.#recommendedLevel = 0;
		this.#objectives = Array.empty;
	}
	name(name) {
		this.#name = name;
		return this;
	}
	key(key) {
		this.#key = key;
		return this;
	}
	categoryKey(categoryKeys) {
		this.#categoryKey = categoryKeys;
		return this;
	}
	tagKeys(tagKeys) {
		this.#tagKeys = tagKeys;
		return this;
	}
	unknownHint(unknownHint) {
		this.#unknownHint = unknownHint;
		return this;
	}
	overview(overview) {
		this.#overview = overview;
		return this;
	}
	recommendedLevel(recommendedLevel) {
		this.#recommendedLevel = recommendedLevel;
		return this;
	}
	objectives(objectives) {
		this.#objectives = objectives;
		return this;
	}
};

//#endregion
//#region src/plugins/omni/ext/quest/__models/OmniQuest.js
/**
* A class representing the data shape of a single quest.
*/
var OmniQuest = class OmniQuest {
	/**
	* The various states that a quest can be in.
	* <pre>
	*     Inactive: 0
	*     Active: 1
	*     Completed: 2
	*     Failed: 3
	*     Missed: 4
	* </pre>
	*/
	static States = {
		/**
		* When a quest is in the "inactive" state, it means it has yet to be discovered by the player so it will not show
		* up in the questopedia by its name or reveal any objectives, but instead reveal only a general "this is where
		* this quest can be found/unlocked", if anything at all.
		*/
		Inactive: 0,
		/**
		* When a quest is in the "active" state, it means it has been discovered and the player has a non-zero number of
		* objectives available for completion.
		*/
		Active: 1,
		/**
		* When a quest is in the "completed" state, it means the quest was discovered and had a non-zero number of its
		* objectives executed satisfactorily and can no longer be modified.
		*/
		Completed: 2,
		/**
		* When a quest is in the "failed" state, it means the quest was discovered but the objectives were not
		* satisfactorily completed, and now the quest is closed and can no longer be modified.
		*/
		Failed: 3,
		/**
		* When a quest is in the "missed" state, it means the quest was never discovered, but due to some reason, will
		* never be discoverable and cannot be modified.
		*/
		Missed: 4
	};
	/**
	* Converts a string descriptor of a quest state to its numeric counterpart.
	* @param {string} questStateDescriptor The quest state descriptor driving this step.
	* @returns {number}
	* @constructor
	*/
	static FromStringToStateId = (questStateDescriptor) => {
		switch (questStateDescriptor.toLowerCase()) {
			case "inactive": return OmniQuest.States.Inactive;
			case "active": return OmniQuest.States.Active;
			case "completed": return OmniQuest.States.Completed;
			case "failed": return OmniQuest.States.Failed;
			case "missed": return OmniQuest.States.Missed;
			default: throw new Error(`unknown quest state being translated: ${questStateDescriptor}`);
		}
	};
	/**
	* The name of the quest.
	* @type {string}
	*/
	name = String.empty;
	/**
	* The primary key of the quest. This is a unique representation used for managing the quest.
	* @type {string}
	*/
	key = String.empty;
	/**
	* The category key of the quest. This is used for organizing where in the UI the quest will show up.
	* @type {string}
	*/
	categoryKey = String.empty;
	/**
	* The tag keys this quest is associated with. This is used for relating a quest with various common data points
	* between quests, such as quest type or location.
	* @type {string[]}
	*/
	tagKeys = Array.empty;
	/**
	* When this quest is yet to be discovered and not missed, this is the description that will reveal to the player.
	* @type {string}
	*/
	unknownHint = String.empty;
	/**
	* Once the quest is discovered, the overview is presented in the questopedia for the player to review as a
	* high-level for what the quest is about.
	* @type {string}
	*/
	overview = String.empty;
	/**
	* The recommended level for the player to take on the quest.
	* @type {number}
	*/
	recommendedLevel = 0;
	/**
	* The various objectives that can/must be fulfilled in order to complete the quest.
	* @type {OmniObjective[]}
	*/
	objectives = Array.empty;
	/**
	* Constructor.
	* @param {string} name The name of this quest.
	* @param {string} key The primary key of this quest.
	* @param {string} categoryKey The category key of this quest.
	* @param {string[]} tagKeys The tag keys this quest is associated with.
	* @param {string} unknownHint The hint displayed while this quest is still unknown.
	* @param {string} overview The general overview of the quest after being activated.
	* @param {number} recommendedLevel The recommended level for the player to take this quest on.
	* @param {OmniObjective[]} objectives The various objectives required to complete this quest.
	*/
	constructor(name, key, categoryKey, tagKeys, unknownHint, overview, recommendedLevel, objectives) {
		this.name = name;
		this.key = key;
		this.categoryKey = categoryKey;
		this.tagKeys = tagKeys;
		this.unknownHint = unknownHint;
		this.overview = overview;
		this.recommendedLevel = recommendedLevel;
		this.objectives = objectives;
	}
	/**
	* A factory that generates builders for creating {@link OmniQuest}s.
	* @returns {OmniQuestBuilder}
	*/
	static Builder = () => new OmniQuestBuilder();
};

//#endregion
//#region src/plugins/omni/ext/quest/__models/OmniConditional.js
var OmniConditional = class {
	questKey = String.empty;
	objectiveId = null;
	state = 0;
	constructor(questKey, objectiveId = null, state = OmniQuest.States.Active) {
		this.questKey = questKey;
		this.objectiveId = objectiveId;
		this.state = state;
	}
};

//#endregion
//#region src/plugins/omni/ext/quest/managers/QuestManager.js
/**
* A manager layer for convenient static methods that check various data points or perform common actions.
*/
var QuestManager = class {
	/**
	* The constructor is not designed to be called.
	* This is a static class.
	*/
	constructor() {
		throw new Error("This is a static class.");
	}
	/**
	* Gets the quest by its given key.
	* @param {string} key The key of the quest to retrieve.
	* @returns {TrackedOmniQuest}
	*/
	static quest(key) {
		const tracking = $gameParty.getQuestopediaEntryByKey(key);
		if (!tracking) {
			Diagnostics.error("J-OMNI-Quests", `the key of ${key} was not found in the list of quests.`);
			throw new Error(`Attempted to leverage a non-existent quest with the key of: ${key}.`);
		}
		return tracking;
	}
	/**
	* Gets all quest metadata as a map from the plugin's metadata.
	* @returns {Map<string, OmniQuest>}
	*/
	static questMetadatas() {
		return J.OMNI.EXT.QUEST.Metadata.questsMap;
	}
	/**
	* Gets all quests that are currently being tracked.
	* @returns {TrackedOmniQuest[]}
	*/
	static trackedQuests() {
		const allQuests = $gameParty.getQuestopediaEntriesCache().values();
		return Array.from(allQuests).filter((quest) => quest.isTracked());
	}
	/**
	* Sets whether or not a quest is being tracked to the given state.
	* @param {string} key The key of the quest to modify tracking for.
	* @param {boolean} trackedState The tracking state for this quest.
	*/
	static setQuestTrackingByKey(key, trackedState) {
		const quest = this.quest(key);
		quest.toggleTracked(trackedState);
	}
	/**
	* Gets the quest category metadata by its given key.
	* @param {string} key The key of the category.
	* @returns {OmniCategory}
	*/
	static category(key) {
		const category = J.OMNI.EXT.QUEST.Metadata.categoriesMap.get(key);
		if (!category) {
			Diagnostics.error("J-OMNI-Quests", `the key of ${key} was not found in the list of quest categories.`);
			throw new Error(`Attempted to leverage a non-existent quest category with the key of: ${key}.`);
		}
		return category;
	}
	/**
	* Gets all quest category metadatas from the plugin's metadata.
	* @param {boolean=} asMap Whether or not to fetch the categories as a map or an array; defaults to true- as a map.
	* @returns {Map<string, OmniCategory>|OmniCategory[]}
	*/
	static categories(asMap = true) {
		return asMap ? J.OMNI.EXT.QUEST.Metadata.categoriesMap : J.OMNI.EXT.QUEST.Metadata.categories;
	}
	/**
	* Gets the quest tag metadata by its given key.
	* @param {string} key The key of the tag.
	* @returns {OmniTag}
	*/
	static tag(key) {
		const tag = J.OMNI.EXT.QUEST.Metadata.tagsMap.get(key);
		if (!tag) {
			Diagnostics.error("J-OMNI-Quests", `the key of ${key} was not found in the list of quest tags.`);
			throw new Error(`Attempted to leverage a non-existent quest tag with the key of: ${key}.`);
		}
		return tag;
	}
	/**
	* Gets all quest tag metadatas from the plugin's metadata.
	* @param {boolean=} asMap Whether or not to fetch the tags as a map or an array; defaults to true- as a map.
	* @returns {Map<string, OmniTag>|OmniTag[]}
	*/
	static tags(asMap = true) {
		return asMap ? J.OMNI.EXT.QUEST.Metadata.tagsMap : J.OMNI.EXT.QUEST.Metadata.tags;
	}
	/**
	* Unlocks a questopedia entry by its key.
	* @param {string} questKey The key of the quest to unlock.
	*/
	static unlockQuestByKey(questKey) {
		const quest = this.quest(questKey);
		quest.unlock();
	}
	/**
	* A script-friendly "if" conditional function that can be used in events to check if a particular objective on a
	* particular quest can be executed. If no objective id is provided, the fallback will be used (immediate >> first).
	* @param {string} questKey The key of the quest to check the objective of.
	* @param {?number} objectiveId The objective id to interrogate.
	* @returns {boolean}
	*/
	static canDoObjective(questKey, objectiveId = null) {
		const quest = this.quest(questKey);
		return quest.canExecuteObjectiveById(objectiveId);
	}
	/**
	* Checks if a quest is active.
	* @param {string} questKey The key of the quest to check for completion.
	* @returns {boolean}
	*/
	static isQuestActive(questKey) {
		const quest = this.quest(questKey);
		return quest.isActive();
	}
	/**
	* Checks if a quest is unlocked (aka not inactive).
	* @param {string} questKey The key of the quest to check for completion.
	* @returns {boolean}
	*/
	static isQuestUnlocked(questKey) {
		const quest = this.quest(questKey);
		return !quest.isInactive();
	}
	/**
	* Checks if a quest is completed.
	* @param {string} questKey The key of the quest to check for completion.
	* @returns {boolean}
	*/
	static isQuestCompleted(questKey) {
		const quest = this.quest(questKey);
		return quest.state === OmniQuest.States.Completed;
	}
	/**
	* A script-friendly "if" conditional function that can be used in events to check if a particular objective on a
	* particular quest is already completed. If no objective id is provided, the fallback will be used
	* (immediate >> first).
	* @param {string} questKey The key of the quest to check the objective of.
	* @param {?number} objectiveId The objective id to interrogate.
	* @returns {boolean}
	*/
	static isObjectiveCompleted(questKey, objectiveId = null) {
		const quest = this.quest(questKey);
		return quest.isObjectiveCompleted(objectiveId);
	}
	/**
	* Progresses the quest through its current objective and activates the next. If there is no "next" objective, then
	* the quest will be completed instead.
	* @param {string} questKey the key of the quest to progress.
	*/
	static progressQuest(questKey) {
		const quest = this.quest(questKey);
		quest.progressObjectives();
	}
	/**
	* Gets all valid destination objectives currently available to be progressed.
	* @returns {TrackedOmniObjective[]}
	*/
	static getValidDestinationObjectives() {
		const quests = $gameParty.getQuestopediaEntriesCache().values();
		const evaluateableStates = [OmniQuest.States.Inactive, OmniQuest.States.Active];
		const destinationObjectives = [];
		quests.forEach((quest) => {
			if (!evaluateableStates.includes(quest.state)) return;
			const validObjectives = quest.objectives.filter((objective) => {
				if (!objective.isValid(OmniObjective.Types.Destination)) return false;
				if ($gameMap.mapId() !== objective.destinationData().at(0)) {
					return false;
				}
				return true;
			});
			if (validObjectives.length === 0) return;
			destinationObjectives.push(...validObjectives);
		});
		return destinationObjectives;
	}
	/**
	* Gets all valid fetch objectives currently available to be progressed.
	* @returns {TrackedOmniObjective[]}
	*/
	static getValidFetchObjectives() {
		const quests = $gameParty.getQuestopediaEntriesCache().values();
		const evaluateableStates = [OmniQuest.States.Inactive, OmniQuest.States.Active];
		const fetchObjectives = [];
		quests.forEach((quest) => {
			if (!evaluateableStates.includes(quest.state)) return;
			const validObjectives = quest.objectives.filter((objective) => {
				if (!objective.isValid(OmniObjective.Types.Fetch)) return false;
				return true;
			});
			if (validObjectives.length === 0) return;
			fetchObjectives.push(...validObjectives);
		});
		return fetchObjectives;
	}
	/**
	* Gets all valid slay objectives currently available to be progressed.
	* @returns {TrackedOmniObjective[]}
	*/
	static getValidSlayObjectives() {
		const quests = $gameParty.getQuestopediaEntriesCache().values();
		const evaluateableStates = [OmniQuest.States.Inactive, OmniQuest.States.Active];
		const slayObjectives = [];
		quests.forEach((quest) => {
			if (!evaluateableStates.includes(quest.state)) return;
			const validObjectives = quest.objectives.filter((objective) => {
				if (!objective.isValid(OmniObjective.Types.Slay)) return false;
				return true;
			});
			if (validObjectives.length === 0) return;
			slayObjectives.push(...validObjectives);
		});
		return slayObjectives;
	}
	/**
	* Gets all valid quest objectives currently available to be progressed.
	* @returns {TrackedOmniObjective[]}
	*/
	static getValidQuestCompletionObjectives() {
		const quests = $gameParty.getQuestopediaEntriesCache().values();
		const evaluateableStates = [OmniQuest.States.Inactive, OmniQuest.States.Active];
		const questCompletionObjectives = [];
		quests.forEach((quest) => {
			if (!evaluateableStates.includes(quest.state)) return;
			const validObjectives = quest.objectives.filter((objective) => {
				if (!objective.isValid(OmniObjective.Types.Quest)) return false;
				if (objective.questCompletionData().length === 0) {
					const objectiveRef = `quest of ${objective.questKey} has objective of id ${objective.id}`;
					const problem = `set to "quest completion", but lacks 'fulfillmentQuestKeys'.`;
					Diagnostics.warn("J-OMNI-Quests", `${objectiveRef} ${problem}`);
					return false;
				}
				return true;
			});
			if (validObjectives.length === 0) return;
			questCompletionObjectives.push(...validObjectives);
		});
		return questCompletionObjectives;
	}
};

//#endregion
//#region src/plugins/omni/ext/quest/__models/TrackedOmniObjective.js
/**
* A class representing the tracking for a single objective of a quest.
* Serialized into party save data via {@link JsonEx}; registered so bundled restores keep prototype methods.
*/
var TrackedOmniObjective = class {
	/**
	* Gets the indiscriminate target data.
	* @returns {string} The indiscriminateTargetData.
	*/
	indiscriminateTargetData() {
		return this._indiscriminateTargetData;
	}
	/**
	* Sets the indiscriminate target data.
	* @param {string} newIndiscriminateTargetData The new indiscriminateTargetData.
	*/
	setIndiscriminateTargetData(newIndiscriminateTargetData) {
		this._indiscriminateTargetData = newIndiscriminateTargetData;
	}
	/**
	* Gets the target map id.
	* @returns {number} The targetMapId.
	*/
	targetMapId() {
		return this._targetMapId;
	}
	/**
	* Sets the target map id.
	* @param {number} newTargetMapId The new targetMapId.
	*/
	setTargetMapId(newTargetMapId) {
		this._targetMapId = newTargetMapId;
	}
	/**
	* Gets the target coordinate range.
	* @returns {[[number, number],[number, number]]} The targetCoordinateRange.
	*/
	targetCoordinateRange() {
		return this._targetCoordinateRange;
	}
	/**
	* Sets the target coordinate range.
	* @param {[[number, number],[number, number]]} newTargetCoordinateRange The new targetCoordinateRange.
	*/
	setTargetCoordinateRange(newTargetCoordinateRange) {
		this._targetCoordinateRange = newTargetCoordinateRange;
	}
	/**
	* Gets the target item type.
	* @returns {number} The targetItemType.
	*/
	targetItemType() {
		return this._targetItemType;
	}
	/**
	* Sets the target item type.
	* @param {number} newTargetItemType The new targetItemType.
	*/
	setTargetItemType(newTargetItemType) {
		this._targetItemType = newTargetItemType;
	}
	/**
	* Gets the target item id.
	* @returns {number} The targetItemId.
	*/
	targetItemId() {
		return this._targetItemId;
	}
	/**
	* Sets the target item id.
	* @param {number} newTargetItemId The new targetItemId.
	*/
	setTargetItemId(newTargetItemId) {
		this._targetItemId = newTargetItemId;
	}
	/**
	* Gets the target item fetch quantity.
	* @returns {number} The targetItemFetchQuantity.
	*/
	targetItemFetchQuantity() {
		return this._targetItemFetchQuantity;
	}
	/**
	* Sets the target item fetch quantity.
	* @param {number} newTargetItemFetchQuantity The new targetItemFetchQuantity.
	*/
	setTargetItemFetchQuantity(newTargetItemFetchQuantity) {
		this._targetItemFetchQuantity = newTargetItemFetchQuantity;
	}
	/**
	* Gets the target enemy id.
	* @returns {number} The targetEnemyId.
	*/
	targetEnemyId() {
		return this._targetEnemyId;
	}
	/**
	* Sets the target enemy id.
	* @param {number} newTargetEnemyId The new targetEnemyId.
	*/
	setTargetEnemyId(newTargetEnemyId) {
		this._targetEnemyId = newTargetEnemyId;
	}
	/**
	* Gets the target enemy amount.
	* @returns {number} The targetEnemyAmount.
	*/
	targetEnemyAmount() {
		return this._targetEnemyAmount;
	}
	/**
	* Sets the target enemy amount.
	* @param {number} newTargetEnemyAmount The new targetEnemyAmount.
	*/
	setTargetEnemyAmount(newTargetEnemyAmount) {
		this._targetEnemyAmount = newTargetEnemyAmount;
	}
	/**
	* Gets the target quest keys.
	* @returns {string[]} The targetQuestKeys.
	*/
	targetQuestKeys() {
		return this._targetQuestKeys;
	}
	/**
	* Sets the target quest keys.
	* @param {string[]} newTargetQuestKeys The new targetQuestKeys.
	*/
	setTargetQuestKeys(newTargetQuestKeys) {
		this._targetQuestKeys = newTargetQuestKeys;
	}
	/**
	* Gets the current item fetch quantity.
	* @returns {number} The currentItemFetchQuantity.
	*/
	currentItemFetchQuantity() {
		return this._currentItemFetchQuantity;
	}
	/**
	* Sets the current item fetch quantity.
	* @param {number} newCurrentItemFetchQuantity The new currentItemFetchQuantity.
	*/
	setCurrentItemFetchQuantity(newCurrentItemFetchQuantity) {
		this._currentItemFetchQuantity = newCurrentItemFetchQuantity;
	}
	/**
	* Gets the current enemy amount.
	* @returns {number} The currentEnemyAmount.
	*/
	currentEnemyAmount() {
		return this._currentEnemyAmount;
	}
	/**
	* Sets the current enemy amount.
	* @param {number} newCurrentEnemyAmount The new currentEnemyAmount.
	*/
	setCurrentEnemyAmount(newCurrentEnemyAmount) {
		this._currentEnemyAmount = newCurrentEnemyAmount;
	}
	/**
	* Initialize an objective tracker for an quest.
	* @param {number} id The id of this objective.
	* @param {string} questKey The key of the quest that owns this objective.
	* @param {OmniFulfillmentData} omniFulfillmentData The extraneous data on how this objective is to be fulfilled.
	* @param {boolean} hidden Whether or not this objective is hidden.
	* @param {boolean} optional Whether or not this objective is optional for its parent quest.
	*/
	constructor(questKey, id, omniFulfillmentData, hidden, optional) {
		/**
		* The key of the quest that owns this objective. This is mostly used for metadata lookup.
		* @type {string}
		*/
		this.questKey = questKey;
		/**
		* The id of this objective. This is typically used to indicate order between objectives within a single quest.
		* @type {number}
		*/
		this.id = id;
		/**
		* Whether or not this objective is currently hidden.
		* @type {boolean}
		*/
		this.hidden = hidden;
		/**
		* Whether or not this objective is considered "optional", in that it is not strictly required to complete the parent
		* quest. Typically these objectives will end up "missed" if not completed rather than "failed".
		* @type {boolean}
		*/
		this.optional = optional;
		/**
		* The current state of this objective, effectively a tracking of its progress.
		* @type {number}
		*/
		this.state = OmniObjective.States.Inactive;
		this.initializeFulfillmentData();
		this.populateFulfillmentData(omniFulfillmentData);
	}
	/**
	* Initialize the fulfillment data properties to default values.
	*/
	initializeFulfillmentData() {
		/**
		* The indiscriminate detail for completing this objective.
		* @type {string}
		*/
		this._indiscriminateTargetData = String.empty;
		/**
		* The target mapId that the target coordinates reside for a destination-type objective.
		* @type {number}
		*/
		this._targetMapId = -1;
		/**
		* The target coordinate range this objective requires the player to reach in order to fulfill the objective. This is
		* designed to be a pair of coordinates that the player must reach within- and will be calculated as a rectangle
		* which means if the player is anywhere within the coordinate range, then the objective will be considered fulfilled.
		* @type {[[number, number],[number, number]]}
		*/
		this._targetCoordinateRange = [];
		/**
		* The target item type that the player must acquire {@link _targetItemFetchQuantity} quantity of in order to fulfill
		* the objective.
		* @type {number}
		*/
		this._targetItemType = -1;
		/**
		* The target item id that the player must acquire.
		* @type {number}
		*/
		this._targetItemId = -1;
		/**
		* The target quantity to fetch of item of type {@link _targetItemType} in order to fulfill the objective.
		* @type {number}
		*/
		this._targetItemFetchQuantity = -1;
		/**
		* The current quantity of the target item to fetch.
		* @type {number}
		*/
		this._currentItemFetchQuantity = 0;
		/**
		* The target enemyId of which the player must defeat {@link _targetEnemyAmount} quantity of in order to fulfill the
		* objective.
		* @type {number}
		*/
		this._targetEnemyId = 0;
		/**
		* The target quantity to slay of enemy of id {@link _targetEnemyId} in order to fulfill the objective.
		* @type {number}
		*/
		this._targetEnemyAmount = 0;
		/**
		* The current quantity of the target enemy to slay.
		* @type {number}
		*/
		this._currentEnemyAmount = 0;
		/**
		* The target quest keys to complete in order to fulfill this objective.
		* @type {string[]}
		*/
		this._targetQuestKeys = [];
	}
	/**
	* Populates the this objective's fulfillment requirements.
	* @param {OmniFulfillmentData} omniFulfillmentData The omni fulfillment data driving this step.
	*/
	populateFulfillmentData(omniFulfillmentData) {
		switch (this.type()) {
			case OmniObjective.Types.Indiscriminate:
				this.setIndiscriminateTargetData(omniFulfillmentData.indiscriminate.hint ?? "No indiscriminate objective instructions provided.");
				return;
			case OmniObjective.Types.Destination:
				const { mapId, x1, y1, x2, y2 } = omniFulfillmentData.destination;
				this.setTargetMapId(mapId);
				const point1 = [x1, y1];
				const point2 = [x2, y2];
				this.setTargetCoordinateRange([point1, point2]);
				break;
			case OmniObjective.Types.Fetch:
				this.setTargetItemType(omniFulfillmentData.fetch.type);
				this.setTargetItemId(omniFulfillmentData.fetch.id);
				this.setTargetItemFetchQuantity(omniFulfillmentData.fetch.amount);
				break;
			case OmniObjective.Types.Slay:
				this.setTargetEnemyId(omniFulfillmentData.slay.id);
				this.setTargetEnemyAmount(omniFulfillmentData.slay.amount);
				break;
			case OmniObjective.Types.Quest:
				this.setTargetQuestKeys([...omniFulfillmentData.quest.keys]);
				break;
		}
	}
	/**
	* Returns whether or not this objective has moved beyond being {@link OmniObjective.States.Inactive}.
	* @returns {boolean}
	*/
	isKnown() {
		if (!this.hidden && this.isInactive()) return true;
		if (!this.isInactive()) return true;
		return false;
	}
	/**
	* Returns whether or not this objective has had some form of finalization from another state. This most commonly will
	* be completed, failed, or missed.
	* @returns {boolean}
	*/
	isFinalized() {
		if (this.isCompleted()) return true;
		if (this.isFailed()) return true;
		if (this.isMissed()) return true;
		return false;
	}
	/**
	* Returns whether or not this objective is {@link OmniObjective.States.Inactive}.
	* @returns {boolean}
	*/
	isInactive() {
		return this.state === OmniObjective.States.Inactive;
	}
	/**
	* Returns whether or not this objective is {@link OmniObjective.States.Active}.
	* @returns {boolean}
	*/
	isActive() {
		return this.state === OmniObjective.States.Active;
	}
	/**
	* Returns whether or not this objective is {@link OmniObjective.States.Completed}.
	* @returns {boolean}
	*/
	isCompleted() {
		return this.state === OmniObjective.States.Completed;
	}
	/**
	* Returns whether or not this objective is {@link OmniObjective.States.Failed}.
	* @returns {boolean}
	*/
	isFailed() {
		return this.state === OmniObjective.States.Failed;
	}
	/**
	* Returns whether or not this objective is {@link OmniObjective.States.Missed}.
	* @returns {boolean}
	*/
	isMissed() {
		return this.state === OmniObjective.States.Missed;
	}
	/**
	* Returns whether or not this objective is hidden.<br/>
	* Objectives that are NOT hidden will show up in the questopedia and can be completed to activate the owning quest.
	* @returns {boolean}
	*/
	isHidden() {
		return this.hidden === true;
	}
	/**
	* Determines whether or not this objective is valid in the sense that it can be updated and completed.
	* @param {OmniObjective.Types} targetType One of the {@link OmniObjective.Types} to validate against.
	* @returns {boolean}
	*/
	isValid(targetType) {
		if (this.isCompleted() || this.isFailed() || this.isMissed()) return false;
		if (!this.isActive() && this.isHidden()) return false;
		return this.type() === targetType;
	}
	/**
	* Check if this objective is fulfilled- whatever type that it is.
	* @returns {boolean}
	*/
	isFulfilled() {
		switch (this.type()) {
			case OmniObjective.Types.Indiscriminate: return false;
			case OmniObjective.Types.Destination: return this.isPlayerWithinDestinationRange();
			case OmniObjective.Types.Fetch:
				this.synchronizeFetchTargetItemQuantity();
				return this.hasFetchedEnoughItems();
			case OmniObjective.Types.Slay: return this.hasSlainEnoughEnemies();
			case OmniObjective.Types.Quest: return this.hasCompletedAllQuests();
		}
	}
	/**
	* Gets the metadata for the quest that owns this objective.
	* @returns {OmniQuest}
	*/
	parentQuestMetadata() {
		return J.OMNI.EXT.QUEST.Metadata.questsMap.get(this.questKey);
	}
	/**
	* Gets the metadata for this objective.
	* @returns {OmniObjective}
	*/
	objectiveMetadata() {
		return this.parentQuestMetadata().objectives.at(this.id);
	}
	/**
	* Gets the description of this objective.
	* @returns {string}
	*/
	description() {
		const { description } = this.objectiveMetadata();
		return description;
	}
	/**
	* Gets the log represented by the current state of this objective.
	* @returns {string}
	*/
	log() {
		const { inactive, active, completed, failed, missed } = this.objectiveMetadata().logs;
		switch (this.state) {
			case OmniObjective.States.Inactive: return inactive;
			case OmniObjective.States.Active: return active;
			case OmniObjective.States.Completed: return completed;
			case OmniObjective.States.Failed: return failed;
			case OmniObjective.States.Missed: return missed;
		}
	}
	/**
	* Gets the {@link OmniObjective.Types} of objective this is to determine how it must be fulfilled.
	* @returns {number}
	*/
	type() {
		const { type } = this.objectiveMetadata();
		return type;
	}
	/**
	* Gets the textual description of what it takes to fulfill the objective based on its type.
	* @returns {string}
	*/
	fulfillmentText() {
		const enoughColor = 24;
		const notEnoughColor = 25;
		switch (this.type()) {
			case OmniObjective.Types.Indiscriminate: return OmniObjective.FulfillmentTemplate(this.type(), [this.indiscriminateTargetData()]);
			case OmniObjective.Types.Destination:
				const point1 = `${this.targetCoordinateRange().at(0)}`;
				const point2 = `${this.targetCoordinateRange().at(1)}`;
				return OmniObjective.FulfillmentTemplate(this.type(), [
					$gameMap.displayName(),
					point1,
					point2
				]);
			case OmniObjective.Types.Fetch:
				const fetchColor = this.currentItemFetchQuantity() < this.targetItemFetchQuantity() ? notEnoughColor : enoughColor;
				const targetItemText = `${this.fetchDataSourceTextPrefix()}[${this.targetItemId()}]`;
				const quantity = `\\C[${fetchColor}]${this.currentItemFetchQuantity()} / ${this.targetItemFetchQuantity()}\\C[0]`;
				return OmniObjective.FulfillmentTemplate(this.type(), [quantity, targetItemText]);
			case OmniObjective.Types.Slay:
				const slayColor = this.currentEnemyAmount() < this.targetEnemyAmount() ? notEnoughColor : enoughColor;
				const targetEnemyText = `\\C[${slayColor}]${this.currentEnemyAmount()} / ${this.targetEnemyAmount()}\\C[0]`;
				return OmniObjective.FulfillmentTemplate(this.type(), [targetEnemyText, this.targetEnemyId()]);
			case OmniObjective.Types.Quest:
				const questNames = this.targetQuestKeys().map((questKey) => `'\\quest[${questKey}]'`);
				const questNamesWithCommas = questNames.join(", ");
				return OmniObjective.FulfillmentTemplate(this.type(), [questNamesWithCommas]);
		}
	}
	/**
	* Gets the icon index derived from the state of this objective.
	* @returns {number}
	*/
	iconIndexByState() {
		switch (this.state) {
			case OmniObjective.States.Inactive: return 93;
			case OmniObjective.States.Active: return 92;
			case OmniObjective.States.Completed: return 91;
			case OmniObjective.States.Failed: return 90;
			case OmniObjective.States.Missed: return 95;
		}
	}
	/**
	* Changes the state of this objective to a new state and processes the {@link onObjectiveUpdate} hook. If the state
	* does not actually change to something new, the hook will not trigger.
	* @param {number} newState The new {@link OmniObjective.States} to set this state to.
	*/
	setState(newState) {
		if (this.state !== newState) {
			this.state = newState;
			this.onObjectiveUpdate();
		}
	}
	/**
	* Gets the destination data for this objective. The response shape will contain the mapId, and the coordinate range.
	* <pre>
	*     [ mapId, [[x1,y1], [x2,y2]] ]
	* </pre>
	* @returns {[number,[[number,number],[number,number]]]}
	*/
	destinationData() {
		return [this.targetMapId(), this.targetCoordinateRange()];
	}
	/**
	* Checks if the player is presently standing within the rectangle derived from the coordinate range for this objective.
	*/
	isPlayerWithinDestinationRange() {
		const [mapId, range] = this.destinationData();
		if ($gameMap.mapId() !== mapId) return false;
		const [x1, y1] = range.at(0);
		const [x2, y2] = range.at(1);
		const playerX = $gamePlayer.x;
		const playerY = $gamePlayer.y;
		const isInCoordinateRange = playerX >= x1 && playerX <= x2 && playerY >= y1 && playerY <= y2;
		this.onObjectiveUpdate();
		return isInCoordinateRange;
	}
	/**
	* The data points associated with fetch-related objectives.
	* @returns {[number,number]}
	*/
	fetchData() {
		return [this.targetItemId(), this.targetItemFetchQuantity()];
	}
	/**
	* Determines whether or not the given item is the target of this fetch objective.
	* @param {RPG_Item|RPG_Weapon|RPG_Armor} entry The entry driving this step.
	* @returns {boolean}
	*/
	isFetchTarget(entry) {
		const objectiveType = this.type();
		if (objectiveType !== OmniObjective.Types.Fetch) return false;
		if (this.targetItemType() === 0 && !entry.isItem()) return false;
		if (this.targetItemType() === 1 && !entry.isWeapon()) return false;
		if (this.targetItemType() === 2 && !entry.isArmor()) return false;
		return entry.id === this.targetItemId();
	}
	/**
	* Gets the escape code for displaying text in a window based on the given target item type to fetch.
	* @returns {string}
	*/
	fetchDataSourceTextPrefix() {
		switch (this.targetItemType()) {
			case OmniObjective.FetchTypes.Item: return `\\Item`;
			case OmniObjective.FetchTypes.Weapon: return `\\Weapon`;
			case OmniObjective.FetchTypes.Armor: return `\\Armor`;
			default: throw new Error(`unknown target item type: ${this.targetItemType()}`);
		}
	}
	/**
	* Returns the datasource of the fetch objective data.
	* @returns {RPG_Item[]|RPG_Weapon[]|RPG_Armor[]}
	*/
	fetchItemDataSource() {
		switch (this.targetItemType()) {
			case OmniObjective.FetchTypes.Item: return $dataItems;
			case OmniObjective.FetchTypes.Weapon: return $dataWeapons;
			case OmniObjective.FetchTypes.Armor: return $dataArmors;
			default: throw new Error(`unknown target item type: ${this.targetItemType()}`);
		}
	}
	/**
	* Synchronizes the number of items the player has in their possession with this objective.
	*/
	synchronizeFetchTargetItemQuantity() {
		const targetDataSource = this.fetchItemDataSource();
		const targetItem = targetDataSource.at(this.targetItemId());
		this.setCurrentItemFetchQuantity($gameParty.numItems(targetItem));
		this.onObjectiveUpdate();
	}
	/**
	* Checks whether or not the player has collected enough of the target fetched item. This always returns false for
	* objectives that are not of type {@link OmniObjective.Types.Fetch}.
	* @returns {boolean}
	*/
	hasFetchedEnoughItems() {
		if (this.type() !== OmniObjective.Types.Fetch) return false;
		return this.currentItemFetchQuantity() >= this.targetItemFetchQuantity();
	}
	/**
	* The data points associated with slay-related objectives.
	* @returns {[number,number]}
	*/
	slayData() {
		return [this.targetEnemyId(), this.targetEnemyAmount()];
	}
	/**
	* Increments the counter for how many of the required enemies the player has slain.
	*/
	incrementSlayTargetEnemyAmount() {
		this.setCurrentEnemyAmount(this.currentEnemyAmount() + 1);
		this.onObjectiveUpdate();
	}
	/**
	* Checks whether or not the player has collected enough of the target fetched item. This always returns false for
	* objectives that are not of type {@link OmniObjective.Types.Fetch}.
	* @returns {boolean}
	*/
	hasSlainEnoughEnemies() {
		if (this.type() !== OmniObjective.Types.Slay) return false;
		return this.currentEnemyAmount() >= this.targetEnemyAmount();
	}
	questCompletionData() {
		return this.targetQuestKeys();
	}
	hasCompletedAllQuests() {
		const requiredQuestKeys = this.questCompletionData();
		if (requiredQuestKeys.length === 0) return true;
		return requiredQuestKeys.every((requiredQuestKey) => QuestManager.quest(requiredQuestKey).isCompleted());
	}
	/**
	* An event hook for when objective progress is updated, like an enemy is slain for the objective or an item is
	* acquired towards the fetch goal.
	*/
	onObjectiveUpdate() {
		if (J.LOG) {
			this.handleObjectiveUpdateLog();
		}
	}
	/**
	* Generate a dialog indicating the quest objectives have been updated.
	*/
	handleObjectiveUpdateLog() {
		if (!this.isFinalized()) return;
		const objectiveMessage = [`\\C[1][${this.parentQuestMetadata().name}]\\C[0] updated.`];
		switch (this.state) {
			case OmniObjective.States.Completed:
				objectiveMessage.push("Objective completed.");
				break;
			case OmniObjective.States.Failed:
				objectiveMessage.push("Objective failed.");
				break;
			case OmniObjective.States.Missed:
				objectiveMessage.push("Objective missed.");
				break;
			default: throw new Error("Unknown finalization state for objective update message.");
		}
		const log = new DiaLogBuilder().setLines(objectiveMessage).build();
		$mapLogs.dialog.addLog(log);
	}
};
SerializableRegistry.register(TrackedOmniObjective);

//#endregion
//#region src/plugins/omni/ext/quest/__models/TrackedOmniQuest.js
/**
* A class representing the tracking for a single quest.
* Serialized into party save data via {@link JsonEx}; registered so bundled restores keep prototype methods.
*/
var TrackedOmniQuest = class {
	/**
	* Initialize a tracker for a quest.
	* @param {string} key The primary key of this quest.
	* @param {string} categoryKey The category key of this quest.
	* @param {TrackedOmniObjective[]} objectives The various objectives required to complete this quest.
	*/
	constructor(key, categoryKey, objectives) {
		/**
		* The primary key of the quest. This is a unique representation used for managing the quest.
		* @type {string}
		*/
		this.key = key;
		/**
		* The category key of the quest. This is used for organizing where in the UI the quest will show up.
		* @type {string}
		*/
		this.categoryKey = categoryKey;
		/**
		* The various objectives that can/must be fulfilled in order to complete the quest. These are sorted by id from
		* lowest to highest, indicating sequence.
		* @type {TrackedOmniObjective[]}
		*/
		this.objectives = objectives.sort((a, b) => a.id - b.id);
		this.initMembers();
	}
	/**
	* Initialize all members of this quest.
	*/
	initMembers() {
		/**
		* The current state of this quest.
		* @type {number}
		*/
		this.state = OmniQuest.States.Inactive;
		/**
		* Whether or not this quest is being tracked.
		* @type {boolean}
		*/
		this.tracked = false;
	}
	/**
	* Determines whether or not this quest can be tracked.
	* @returns {boolean}
	*/
	canBeTracked() {
		if (this.isActive()) return true;
		return this.objectives.some((objective) => !objective.isHidden());
	}
	/**
	* Whether or not this quest is being tracked.
	* @returns {boolean}
	*/
	isTracked() {
		return this.tracked === true || this.tracked === "true";
	}
	/**
	* Toggles whether or not the quest is being tracked.
	* @param {?boolean} forcedState If provided, then will force tracking to the designated boolean.
	*/
	toggleTracked(forcedState = null) {
		if (forcedState !== null) {
			this.tracked = forcedState;
			return;
		}
		this.tracked = !this.tracked;
	}
	/**
	* Gets the metadata for this {@link TrackedOmniQuest}.
	* @returns {OmniQuest}
	*/
	questMetadata() {
		return J.OMNI.EXT.QUEST.Metadata.questsMap.get(this.key);
	}
	/**
	* The name of the quest- but its computed since its just read from the data file.
	* @returns {string} The name of the quest from the data source.
	*/
	name() {
		const { name } = this.questMetadata();
		return name;
	}
	/**
	* The recommended level for the quest- but its computed since its just read from the data file.
	* @returns {number} The recommended level to complete the quest.
	*/
	recommendedLevel() {
		const { recommendedLevel } = this.questMetadata();
		return recommendedLevel;
	}
	/**
	* The tag keys on the quest- but its computed since its just read from the data file.
	* @returns {string[]} The tag keys associated with the quest.
	*/
	tagKeys() {
		const { tagKeys } = this.questMetadata();
		return tagKeys ?? [];
	}
	/**
	* Gets the {@link OmniTag}s that correspond with the tag keys on the quest.
	* @returns {OmniTag[]}
	*/
	tags() {
		return this.tagKeys().map((tagKey) => J.OMNI.EXT.QUEST.Metadata.tagsMap.get(tagKey));
	}
	/**
	* Gets the hint provided when a quest has yet to be discovered.
	* @returns {string}
	*/
	unknownHint() {
		const { unknownHint } = this.questMetadata();
		return unknownHint;
	}
	/**
	* The journaling of the quest- but its computed since its a combination of all started objectives' descriptions that
	* are just read from the data file.
	* @returns {string[]}
	*/
	overview() {
		const { overview } = this.questMetadata();
		return overview;
	}
	/**
	* Check if the target objective by its id is completed already. This falls back to the immediate, or the first if no
	* objective id was provided.
	* @param {?number} objectiveId The objective id to check for completion.
	* @returns {boolean}
	*/
	isObjectiveCompleted(objectiveId = null) {
		return this.isObjectiveInState(OmniObjective.States.Completed, objectiveId);
	}
	/**
	* Check if an objective is the specified state.
	* @param {number} targetState The state from {@link OmniObjective.States} to check if the objective is in.
	* @param {?number} objectiveId The objective id to check the state of; falls back to immediate >> first.
	* @returns {boolean} True if the objective is in the specified state, false otherwise.
	*/
	isObjectiveInState(targetState, objectiveId = null) {
		const actualObjectiveId = this.getFallbackObjectiveId(objectiveId);
		const objective = this.objectives.find((o) => o.id === actualObjectiveId);
		if (objective) {
			return objective.state === targetState;
		}
		return false;
	}
	/**
	* Determines whether or not an objective is able to be executed. This does not consider the state of the quest itself,
	* only the objective. If no objective id is provided, then the fallback will be referred to.
	* @param {?number} objectiveId The id of the objective to interrogate.
	* @returns {boolean}
	*/
	canExecuteObjectiveById(objectiveId = null) {
		const actualObjectiveId = this.getFallbackObjectiveId(objectiveId);
		const objective = this.objectives.find((o) => o.id === actualObjectiveId);
		if (objective === undefined) return false;
		return objective.state === OmniObjective.States.Active;
	}
	/**
	* A "known" quest is one that is no longer undiscovered/inactive. This includes completed/failed/missed quests.
	* @returns {boolean}
	*/
	isKnown() {
		return !this.isInactive();
	}
	/**
	* An {@link OmniQuest.States.Inactive} quest is one that has yet to be unlocked/discovered by the player.
	* @returns {boolean}
	*/
	isInactive() {
		return this.isInState(OmniQuest.States.Inactive);
	}
	/**
	* An {@link OmniQuest.States.Active} quest is one that has already been unlocked/discovered by the player.
	* @returns {boolean}
	*/
	isActive() {
		return this.isInState(OmniQuest.States.Active);
	}
	/**
	* A {@link OmniQuest.States.Completed} quest is one that had all of its objectives completed with some possibly missed.
	* This is considered a finalized state.
	* @returns {boolean}
	*/
	isCompleted() {
		return this.isInState(OmniQuest.States.Completed);
	}
	/**
	* A {@link OmniQuest.States.Failed} quest is one that had one or more of its objectives placed into a failed state.
	* This is considered a finalized state.
	* @returns {boolean}
	*/
	isFailed() {
		return this.isInState(OmniQuest.States.Failed);
	}
	/**
	* A {@link OmniQuest.States.Missed} quest is one the world closed off before it could finish: every objective still
	* open was placed into a missed state, either because nothing was ever completed (a quest the player walked past) or
	* because it was finalized as missed outright (a questgiver gone for good). Objectives the player had already
	* completed stay completed in the journal; the verdict on the quest is missed regardless.
	* @returns {boolean}
	*/
	isMissed() {
		return this.isInState(OmniQuest.States.Missed);
	}
	/**
	* A "Finalized" quest is one that has been completed/failed/missed.
	* @returns {boolean}
	*/
	isFinalized() {
		if (this.isCompleted()) return true;
		if (this.isFailed()) return true;
		if (this.isMissed()) return true;
		return false;
	}
	/**
	* Checks if the quest is in a particular {@link OmniQuest.States}.
	* @param {number} targetState The {@link OmniQuest.States} to compare the current state against.
	* @returns {boolean}
	*/
	isInState(targetState) {
		return this.state === targetState;
	}
	/**
	* Unlocks this quest and actives the target objective. If no objectiveId is provided, then the first objective will be
	* made {@link OmniObjective.States.Active}.
	* @param {?number} objectiveId The id of the objective to initialize as active; defaults to the immediate or first.
	*/
	unlock(objectiveId = null) {
		if (!this.canBeUnlocked()) {
			const attempt = `attempted to unlock quest with key ${this.key}`;
			Diagnostics.warn("J-OMNI-Quests", `${attempt}, but it cannot be unlocked from state ${this.state}.`);
			return;
		}
		this.flagObjectiveAsActive(objectiveId);
		this.refreshState();
	}
	/**
	* Resets this quest back to being completely unknown.<br/>
	* Note that objectives that are still not-hidden will be visible.
	*/
	reset() {
		this.setState(OmniQuest.States.Inactive);
		this.objectives.forEach((objective) => objective.state = OmniObjective.States.Inactive);
	}
	/**
	* Determines whether or not the quest can be unlocked.
	* @returns {boolean}
	*/
	canBeUnlocked() {
		if (this.isKnown()) return false;
		return true;
	}
	/**
	* Automatically progress the current objective to complete and active the next objective in the list. If no objectives
	* are active, then the next objective in the sequence will be activated. If there are no other objectives to activate,
	* then the quest will be completed.
	*
	* If multiple objectives are active, this function will not work- multiple active objectives must be handled manually
	* and individually.
	*
	* Normally, this is triggered as a result of programmatic detection of an objective being achieved, but can also be a
	* manual action if desiring to move a quest along.
	*/
	progressObjectives() {
		const activeObjectives = this.activeObjectives();
		if (activeObjectives.length > 1) {
			Diagnostics.warn("J-OMNI-Quests", "multiple quest objectives are currently active and must be finalized manually by id.");
			return;
		}
		if (activeObjectives.length === 1) {
			const objectiveId = activeObjectives.at(0).id;
			this.flagObjectiveAsCompleted(objectiveId);
		}
		this._fastForwardToNextObjective();
	}
	/**
	* Fast-forwards to the next objective in the list and changes it from inactive to active. If the newly activated
	* objective is completable immediately, complete it and keep taking one more inactive objective sequentially until we
	* stop immediately completing them and leave the player with an active objective on the quest, or by running out of
	* inactive objectives to activate translating to the quest being officially complete.
	*/
	_fastForwardToNextObjective() {
		let needsNextObjective;
		do {
			const nextObjective = this.objectives.find((objective) => objective.state === OmniObjective.States.Inactive);
			if (nextObjective) {
				if (nextObjective.isFulfilled()) {
					this.flagObjectiveAsCompleted(nextObjective.id);
					needsNextObjective = true;
				} else {
					this.flagObjectiveAsActive(nextObjective.id);
					needsNextObjective = false;
				}
			} else {
				needsNextObjective = false;
			}
		} while (needsNextObjective);
		const hasAnymoreActiveObjectives = this.objectives.some((objective) => objective.isActive());
		if (hasAnymoreActiveObjectives) return;
		this.flagAsCompleted();
	}
	/**
	* Gets all objectives currently tracked as {@link OmniObjective.States.Active}.
	* @returns {TrackedOmniObjective[]}
	*/
	activeObjectives() {
		return this.objectives.filter((objective) => objective.state === OmniObjective.States.Active);
	}
	/**
	* Gets the first-most objective that is currently tracked as {@link OmniObjective.States.Active}.
	* @returns {TrackedOmniObjective}
	*/
	immediateObjective() {
		return this.activeObjectives().at(0);
	}
	/**
	* Flags the given objective by its id as {@link OmniObjective.States.Active}. If no objectiveId is provided, then the
	* immediate objective will be flagged instead (that being the lowest-id active objective, if any), or the very first
	* objective will be flagged.
	* @param {?number} objectiveId The id of the objective to flag as missed; defaults to the immediate or first.
	*/
	flagObjectiveAsActive(objectiveId = null) {
		this.changeTargetObjectiveState(objectiveId, OmniObjective.States.Active);
	}
	/**
	* Completes the objective matching the objectiveId.
	* @param {?number} objectiveId The id of the objective to complete.
	*/
	flagObjectiveAsCompleted(objectiveId = null) {
		this.changeTargetObjectiveState(objectiveId, OmniObjective.States.Completed);
	}
	/**
	* Flags the given objective by its id as {@link OmniObjective.States.Missed}. If no objectiveId is provided, then the
	* immediate objective will be flagged instead (that being the lowest-id active objective, if any), or the very first
	* objective will be flagged.
	* @param {?number} objectiveId The id of the objective to flag as missed; defaults to the immediate or first.
	*/
	flagObjectiveAsMissed(objectiveId = null) {
		this.changeTargetObjectiveState(objectiveId, OmniObjective.States.Missed);
	}
	/**
	* Change the target objective by its id to a new state.
	* @param {number} objectiveId The objective id driving this step.
	* @param {number} newState The new {@link OmniObjective.States} to change the objective to.
	*/
	changeTargetObjectiveState(objectiveId, newState) {
		const actualObjectiveId = this.getFallbackObjectiveId(objectiveId);
		const objective = this.objectives.find((o) => o.id === actualObjectiveId);
		if (objective && objective.state !== newState) {
			objective.setState(newState);
			this.refreshState();
		}
	}
	/**
	* Captures an objectiveId provided (if provided) and provides fallback options if there was no provided id. If there
	* is no id provided, then the immediate objective's id will be provided. If there is no immediate objective, then the
	* quest's first objective will be provided.
	* @param {?number} objectiveId The objective id to provide fallback options for.
	* @returns {number}
	*/
	getFallbackObjectiveId(objectiveId = null) {
		if (objectiveId !== null) return objectiveId;
		const immediate = this.immediateObjective() ?? null;
		if (immediate !== null) return immediate.id;
		return 0;
	}
	/**
	* Flags this quest as missed, which automatically miss all active and inactive objectives and miss the quest.
	*/
	flagAsMissed() {
		this.objectives.forEach((objective) => {
			if (objective.isActive() || objective.isInactive()) {
				objective.setState(OmniObjective.States.Missed);
			}
		});
		this.setState(OmniQuest.States.Missed);
	}
	/**
	* Flags this quest as failed, which automatically fail all active and inactive objectives and fail the quest.
	*/
	flagAsFailed() {
		this.objectives.forEach((objective) => {
			if (objective.isActive() || objective.isInactive()) {
				objective.setState(OmniObjective.States.Failed);
			}
		});
		this.refreshState();
	}
	/**
	* Flags this quest as completed, which automatically complete all active objectives, and misses all inactive ones.
	*/
	flagAsCompleted() {
		this.objectives.forEach((objective) => {
			if (objective.isActive()) {
				objective.setState(OmniObjective.States.Completed);
			}
			if (objective.isInactive()) {
				objective.setState(OmniObjective.States.Missed);
			}
		});
		this.refreshState();
		this._processQuestCompletionQuestsCheck();
	}
	/**
	* Evaluate all active quest completion objectives that reside applicable to this quest.
	*/
	_processQuestCompletionQuestsCheck() {
		const activeQuestCompletionObjectives = QuestManager.getValidQuestCompletionObjectives();
		if (activeQuestCompletionObjectives.length === 0) return;
		activeQuestCompletionObjectives.forEach((objective) => {
			if (!objective.hasCompletedAllQuests()) return;
			const questToProgress = QuestManager.quest(objective.questKey);
			questToProgress.flagObjectiveAsCompleted(objective.id);
			questToProgress.progressObjectives();
		}, this);
	}
	/**
	* Refreshes the state of the quest based on the state of its objectives.
	*/
	refreshState() {
		const anyFailed = this.objectives.some((objective) => objective.isFailed());
		if (anyFailed) {
			this.setState(OmniObjective.States.Failed);
			return;
		}
		const allUnknown = this.objectives.every((objective) => objective.isInactive());
		if (allUnknown) {
			this.setState(OmniObjective.States.Inactive);
			return;
		}
		const someActive = this.objectives.some((objective) => objective.isActive());
		if (someActive) {
			this.setState(OmniObjective.States.Active);
			return;
		}
		const allMissed = this.objectives.every((objective) => objective.isMissed());
		if (allMissed) {
			this.setState(OmniQuest.States.Missed);
			return;
		}
		const enoughComplete = this.objectives.every((objective) => objective.isCompleted() || objective.isMissed());
		if (enoughComplete) {
			this.setState(OmniObjective.States.Completed);
			return;
		}
	}
	/**
	* Sets the state of the quest to a designated state regardless of objectives' status.<br/>
	* It is normally recommended to use {@link #refreshState} if desiring to change state so that the objectives determine
	* the quest state when managing the state programmatically. Unexpected behavior may occur if this is executed from
	* outside of state refresh.
	* @param {number} newState The new state to set this quest to.
	*/
	setState(newState) {
		if (newState < 0 || newState > 4) {
			Diagnostics.error("J-OMNI-Quests", `attempted to set invalid state for this quest: ${newState}.`);
			throw new Error("Invalid quest state provided for setting of state.");
		}
		if (this.state === newState) return;
		this.state = newState;
		this.onQuestStateChange();
	}
	/**
	* The hook for when the state of the quest changes.
	*/
	onQuestStateChange() {
		if (J.LOG) {
			this.handleQuestUpdateLog();
		}
	}
	/**
	* Generate a dialog indicating the quest state has been updated.
	*/
	handleQuestUpdateLog() {
		if (this.state === OmniQuest.States.Inactive) return;
		const questUpdatedLines = [`\\C[1][${this.name()}]\\C[0]`];
		switch (this.state) {
			case OmniQuest.States.Active:
				questUpdatedLines.push("Quest unlocked.");
				break;
			case OmniQuest.States.Completed:
				questUpdatedLines.push("Quest completed.");
				break;
			case OmniQuest.States.Failed:
				questUpdatedLines.push("Quest failed.");
				break;
			case OmniQuest.States.Missed:
				questUpdatedLines.push("Quest missed.");
				break;
			default:
				Diagnostics.warn("J-OMNI-Quests", `unexpected state change for logging: ${this.state}`);
				return;
		}
		const log = new DiaLogBuilder().setLines(questUpdatedLines).build();
		$mapLogs.dialog.addLog(log);
	}
};
SerializableRegistry.register(TrackedOmniQuest);

//#endregion
//#region src/plugins/omni/ext/quest/__models/OmniConfiguration.js
/**
* A class representing the data shape of the Questopedia configuration.
*/
var OmniConfiguration = class {
	/**
	* The quest metadata from the config file.
	* @type {OmniQuest[]}
	*/
	quests = Array.empty;
	/**
	* The tag metadata from the config file.
	* @type {OmniTag[]}
	*/
	tags = Array.empty;
	/**
	* The category metadata from the config file.
	* @type {OmniCategory[]}
	*/
	categories = Array.empty;
	/**
	*
	* @param {OmniQuest[]} quests The quest metadata.
	* @param {OmniTag[]} tags The tag metadata.
	* @param {OmniCategory[]} categories The category metadata.
	*/
	constructor(quests, tags, categories) {
		this.quests = quests;
		this.tags = tags;
		this.categories = categories;
	}
};

//#endregion
//#region src/plugins/omni/ext/quest/_metadata/_pluginMetadata.js
var J_QUEST_PluginMetadata = class J_QUEST_PluginMetadata extends PluginMetadata {
	/**
	* The path where the config for quests is located.
	* @type {string}
	*/
	static CONFIG_PATH = "data/config.quest.json";
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	static classifyQuests(parsedBlob) {
		const parsedQuests = [];
		/** @param {OmniQuest} parsedQuest */
		const foreacher = (parsedQuest) => {
			const questName = parsedQuest.name;
			if (questName.startsWith("__")) return;
			if (questName.startsWith("==")) return;
			if (questName.startsWith("--")) return;
			const builtQuest = OmniQuest.Builder().name(parsedQuest.name).key(parsedQuest.key).categoryKey(parsedQuest.categoryKey).tagKeys(parsedQuest.tagKeys).unknownHint(parsedQuest.unknownHint).overview(parsedQuest.overview).recommendedLevel(parsedQuest.recommendedLevel).objectives(parsedQuest.objectives).build();
			parsedQuests.push(builtQuest);
		};
		parsedBlob.forEach(foreacher, this);
		return parsedQuests;
	}
	/**
	*  Extends {@link #postInitialize}.<br>
	*  Includes translation of plugin parameters.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeQuests();
		this.initializeMetadata();
	}
	initializeQuests() {
		const canLogLoadInfo = J_QUEST_PluginMetadata.#hasMinimumBaseVersion();
		const summarize = canLogLoadInfo ? (result) => [
			`- ${result.quests.length} quests`,
			`- ${result.categories.length} categories`,
			`- ${result.tags.length} tags`
		] : null;
		const options = ExternalJsonConfigLoaderOptions.Builder().pluginName("J-OMNI-Quests").configName("quest configuration").logSummary(summarize).build();
		const parsedConfiguration = ExternalJsonConfigLoader.load(J_QUEST_PluginMetadata.CONFIG_PATH, options);
		const classifiedQuests = J_QUEST_PluginMetadata.classifyQuests(parsedConfiguration.quests);
		/**
		* A collection of all defined quests.
		* @type {OmniQuest[]}
		*/
		this.quests = classifiedQuests;
		const questMap = new Map();
		this.quests.forEach((quest) => questMap.set(quest.key, quest));
		/**
		* A key:quest map of all defined quests.
		* @type {Map<string, OmniQuest>}
		*/
		this.questsMap = questMap;
		/**
		* A collection of all defined quest categories.
		* @type {OmniCategory[]}
		*/
		this.categories = parsedConfiguration.categories;
		const categoryMap = new Map();
		this.categories.forEach((category) => categoryMap.set(category.key, category));
		/**
		* A key:questCategory map of all defined categories.
		* @type {Map<string, OmniCategory>}
		*/
		this.categoriesMap = categoryMap;
		/**
		* A collection of all defined quest tags.
		* @type {OmniTag[]}
		*/
		this.tags = parsedConfiguration.tags;
		const tagMap = new Map();
		this.tags.forEach((tag) => tagMap.set(tag.key, tag));
		/**
		* A key:questTag map of all defined tags.
		* @type {Map<string, OmniTag>}
		*/
		this.tagsMap = tagMap;
	}
	/**
	* Initializes the metadata associated with this plugin.
	*/
	initializeMetadata() {
		/**
		* The id of a switch that represents whether or not this system is accessible in the menu.
		* @type {number}
		*/
		this.menuSwitchId = J.BASE.Helpers.parsePluginInt(this.parsedPluginParameters["menu-switch"], 0);
		/**
		* When this switch is enabled, the command will be rendered into the command list as well.
		* @type {number}
		*/
		this.enabledSwitchId = 104;
		/**
		* The data associated with rendering this plugin's command in a command list.
		*/
		this.Command = {
			/**
			* The name of the command when viewed from the Omnipedia.
			*/
			Name: "Questopedia",
			/**
			* The symbol of the command in the command list.
			*/
			Symbol: "quest-pedia",
			/**
			* The icon for the command anywhere it is viewed.
			*/
			IconIndex: 2564
		};
	}
	/**
	* Checks if the BASE plugin meets the minimum version requirement for this plugin.
	* @return {boolean}
	*/
	static #hasMinimumBaseVersion() {
		const minimumVersion = this.#minimumBaseVersion();
		const actualVersion = new PluginVersion(J.BASE.Metadata.Version);
		const meetsThreshold = actualVersion.satisfiesPluginVersion(minimumVersion);
		if (!meetsThreshold) return false;
		return true;
	}
	/**
	* Gets the current minimum version of the J-BASE system this plugin requires.
	* @returns {PluginVersion}
	*/
	static #minimumBaseVersion() {
		return PluginVersion.builder.major("2").minor("3").patch("1").build();
	}
};

//#endregion
//#region src/plugins/omni/ext/quest/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.2.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (hasBaseRequirement === false) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
	const requiredOmniVersion = "1.0.0";
	const hasOmniRequirement = J.BASE.Helpers.satisfies(J.OMNI.Metadata.version.version(), requiredOmniVersion);
	if (hasOmniRequirement === false) {
		throw new Error(`Either missing J-Omnipedia or has a lower version than the required: ${requiredOmniVersion}`);
	}
})();
/**
* The plugin umbrella that governs all extensions related to the parent.
*/
J.OMNI.EXT ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.OMNI.EXT.QUEST = {};
/**
* The metadata associated with this plugin.
*/
J.OMNI.EXT.QUEST.Metadata = new J_QUEST_PluginMetadata("J-OMNI-Quests", "2.0.3");
/**
* A collection of all aliased methods for this plugin.
*/
J.OMNI.EXT.QUEST.Aliased = {};
J.OMNI.EXT.QUEST.Aliased.DataManager = new Map();
J.OMNI.EXT.QUEST.Aliased.Game_Enemy = new Map();
J.OMNI.EXT.QUEST.Aliased.Game_Event = new Map();
J.OMNI.EXT.QUEST.Aliased.Game_Interpreter = new Map();
J.OMNI.EXT.QUEST.Aliased.Game_Map = new Map();
J.OMNI.EXT.QUEST.Aliased.Game_Party = new Map();
J.OMNI.EXT.QUEST.Aliased.Game_System = new Map();
J.OMNI.EXT.QUEST.Aliased.JABS_StandardController = new Map();
J.OMNI.EXT.QUEST.Aliased.Scene_Omnipedia = new Map();
J.OMNI.EXT.QUEST.Aliased.Window_OmnipediaList = new Map();
J.OMNI.EXT.QUEST.Aliased.Window_JabsRemapActions = new Map();
/**
* All regular expressions used by this plugin.
*/
J.OMNI.EXT.QUEST.RegExp = {};
J.OMNI.EXT.QUEST.RegExp.EventQuest = /<pageQuestCondition:[ ]?(\[[\w.-]+])>/i;
J.OMNI.EXT.QUEST.RegExp.EventQuestObjective = /<pageQuestCondition:[ ]?(\[([\w.-]+),[ ]?\d+])>/i;
J.OMNI.EXT.QUEST.RegExp.EventQuestObjectiveForState = /<pageQuestCondition:[ ]?(\[([\w.-]+),[ ]?(-?\d+),[ ]?(inactive|active|completed|failed|missed)])>/i;
J.OMNI.EXT.QUEST.RegExp.ChoiceQuest = /<choiceQuestCondition:[ ]?(\[[\w.-]+])>/i;
J.OMNI.EXT.QUEST.RegExp.ChoiceQuestObjective = /<choiceQuestCondition:[ ]?(\[([\w.-]+),[ ]?\d+])>/i;
J.OMNI.EXT.QUEST.RegExp.ChoiceQuestObjectiveForState = /<choiceQuestCondition:[ ]?(\[([\w.-]+),[ ]?(-?\d+),[ ]?(inactive|active|completed|failed|missed)])>/i;

//#endregion
//#region src/plugins/omni/ext/quest/managers/DataManager.js
/**
* Extends {@link #createGameObjects}.<br/>
* Also registers J.OMNI.QUEST input actions and defaults.
*/
J.OMNI.EXT.QUEST.Aliased.DataManager.set("createGameObjects", DataManager.createGameObjects);
DataManager.createGameObjects = function() {
	J.OMNI.EXT.QUEST.Aliased.DataManager.get("createGameObjects").call(this);
	DataManager.registerQuestopediaInputActions();
};
/**
* Registers the quest actions and seeds defaults into the engine-owned Input registry.
* Called each time game objects are (re)created.
*/
DataManager.registerQuestopediaInputActions = function() {
	if (!J.ABS || !J.ABS.EXT.INPUT) return;
	Input.registerAction("J.OMNI.QUEST", {
		key: "open-quest-log",
		label: "Open Quest Log",
		defaults: [J.ABS.EXT.INPUT.Symbols.DPadRight],
		category: "ui"
	});
	Input.seedDefaultBindings("J.OMNI.QUEST", { "open-quest-log": [J.ABS.EXT.INPUT.Symbols.DPadRight] });
	Input.getAllBindings("J.OMNI.QUEST");
};

//#endregion
//#region src/plugins/omni/ext/quest/managers/QuestNameTruncator.js
/**
* Shortens a quest name until it fits a measured width, marking the cut with an ellipsis.
*
* The quest list draws a tracking marker at the right edge of a row, and the engine paints a
* command's name at full length underneath it. A name that runs into the marker is unreadable in
* exactly the rows the player cares most about- the ones they chose to track- so the list reserves
* the marker's room and asks this to make the name respect it. Words are dropped from the end rather
* than characters, because a name may carry escape codes and a cut inside one corrupts the draw.
*/
var QuestNameTruncator = class QuestNameTruncator {
	/**
	* The mark appended to a shortened name.
	* @type {string}
	*/
	static ELLIPSIS = "…";
	/**
	* The constructor is not designed to be called.
	* This is a static class.
	*/
	constructor() {
		throw new Error("This is a static class.");
	}
	/**
	* Shortens the name by whole words until the fit predicate accepts it.
	*
	* A name that fits is returned untouched, so short names carry no ellipsis. A single word that
	* still does not fit is returned with the ellipsis anyway: there is nothing left to drop, and an
	* overrun is more honest than an empty row.
	* @param {string} name The name to fit.
	* @param {function(string): boolean} fits Answers whether a candidate fits the available width.
	* @returns {string}
	*/
	static fit(name, fits) {
		if (fits(name)) return name;
		const words = name.split(" ");
		while (words.length > 1) {
			words.pop();
			const candidate = `${words.join(" ")}${QuestNameTruncator.ELLIPSIS}`;
			if (fits(candidate)) return candidate;
		}
		return `${words.at(0)}${QuestNameTruncator.ELLIPSIS}`;
	}
};

//#endregion
//#region src/plugins/omni/ext/quest/windows/Window_QuestopediaList.js
/**
* The list of quests in the category being browsed, one row per quest.
*
* Rows render a touch smaller than body copy: quest names are authored long, and the column has
* to leave room at its right edge for the tracking marker without the two ever meeting.
*/
var Window_QuestopediaList = class extends Window_Command {
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Overrides {@link Window_Base.resetFontSize}.<br/>
	* Every row of this list, marker included, renders a little smaller than body copy.
	*
	* This is the one seam that shrinks the name, the marker and the measurements together; wrapping
	* each name in a size code would leave the marker at full size beside a smaller name.
	*/
	resetFontSize() {
		this.contents.fontSize = $gameSystem.mainFontSize() - this.fontSizeReduction();
	}
	/**
	* How much smaller than body copy this list renders.
	* @returns {number}
	*/
	fontSizeReduction() {
		return 4;
	}
	/**
	* The text drawn at the right edge of a tracked quest's row.
	* @returns {string}
	*/
	trackedMarker() {
		return "🔍";
	}
	/**
	* The width the command name is indented by to leave room for its icon.
	*
	* This mirrors the indent the shared command drawing applies before the name; it is not read from
	* there because the drawing has no reason to expose it, and the name is fitted here before the
	* drawing ever sees it.
	* @returns {number}
	*/
	commandNameIndent() {
		return 40;
	}
	/**
	* The room reserved at the right edge of a row for the tracking marker, whether or not the row is
	* tracked. Reserving it unconditionally keeps every name fitted to the same width, so tracking a
	* quest never shortens its name.
	* @returns {number}
	*/
	markerGutterWidth() {
		const markerWidth = this.textSizeEx(this.trackedMarker()).width;
		return markerWidth + this.itemPadding();
	}
	/**
	* The width a quest name may occupy before it would reach the marker's gutter.
	* @returns {number}
	*/
	nameAvailableWidth() {
		const rowWidth = this.innerWidth - this.itemPadding() * 2;
		return rowWidth - this.commandNameIndent() - this.markerGutterWidth();
	}
	/**
	* Fits a quest name into the room a row leaves for it.
	* @param {string} name The name, possibly carrying escape codes.
	* @returns {string}
	*/
	fitQuestName(name) {
		const available = this.nameAvailableWidth();
		const fits = (candidate) => this.textSizeEx(candidate).width <= available;
		return QuestNameTruncator.fit(name, fits);
	}
	/**
	* Implements {@link Window_Command.initMembers}.<br/>
	* Initializes the members of this window.
	*
	* This cannot be a class field declaration: JavaScript applies those only after `super()` returns,
	* by which point the command list has already been built from it and found it undefined.
	*/
	initMembers() {
		/**
		* The category that this list is being filtered by. When an empty string, no filter is applied.
		* @type {string}
		*/
		this._currentCategoryKey = String.empty;
	}
	/**
	* Gets the current category key of quests being displayed in this list.
	* @returns {string}
	*/
	getCurrentCategoryKey() {
		return this._currentCategoryKey;
	}
	/**
	* Sets the current category of quests to display in this list.
	* @param {string} categoryKey The quest category key.
	*/
	setCurrentCategoryKey(categoryKey) {
		this._currentCategoryKey = categoryKey;
	}
	/**
	* Implements {@link #makeCommandList}.<br/>
	* Creates the command list of all known quests in this window.
	*/
	makeCommandList() {
		const commands = this.buildCommands();
		commands.forEach(this.addBuiltCommand, this);
	}
	/**
	* Builds all commands for this command window.
	* Adds all known quests to the list that are known.
	* @returns {BuiltWindowCommand[]}
	*/
	buildCommands() {
		const questEntries = $gameParty.getQuestopediaEntries();
		const filteredQuests = questEntries.filter(this._questFiltering, this);
		if (filteredQuests.length === 0) return [];
		return filteredQuests.map(this.buildCommand, this);
	}
	/**
	* Determines whether or not this quest should be shown in the current list.
	* @param {TrackedOmniQuest} quest The quest in question.
	* @returns {boolean}
	*/
	_questFiltering(quest) {
		const currentCategory = this.getCurrentCategoryKey();
		if (currentCategory === String.empty) return true;
		if (quest.categoryKey === currentCategory) return true;
		return false;
	}
	/**
	* Builds a {@link BuiltWindowCommand} based on the quest data.
	* @param {TrackedOmniQuest} questopediaEntry The quest data.
	* @returns {BuiltWindowCommand} The built command based on this quest.
	*/
	buildCommand(questopediaEntry) {
		const rawName = questopediaEntry.isKnown() ? questopediaEntry.name() : J.BASE.Helpers.maskString(questopediaEntry.name());
		const questName = this.fitQuestName(rawName);
		const trackedText = questopediaEntry.isTracked() ? this.trackedMarker() : String.empty;
		const canBeTracked = questopediaEntry.canBeTracked();
		if (!canBeTracked && questopediaEntry.isTracked()) {
			questopediaEntry.toggleTracked();
		}
		return new WindowCommandBuilder(questName).setSymbol(questopediaEntry.key).setExtensionData(questopediaEntry).setIconIndex(this.determineQuestStateIcon(questopediaEntry)).setRightText(trackedText).setEnabled(canBeTracked).build();
	}
	/**
	* Translates a quest entry's state into the icon.
	* @param {TrackedOmniQuest} questopediaEntry The quest data.
	*/
	determineQuestStateIcon(questopediaEntry) {
		switch (questopediaEntry.state) {
			case OmniQuest.States.Inactive: return 93;
			case OmniQuest.States.Active: return 92;
			case OmniQuest.States.Completed: return 91;
			case OmniQuest.States.Failed: return 90;
			case OmniQuest.States.Missed: return 95;
		}
	}
};

//#endregion
//#region src/plugins/omni/ext/quest/managers/QuestOverviewWrapper.js
/**
* Breaks a quest overview into lines that fit a measured width.
*
* An overview is authored as one paragraph, with the occasional deliberate line break, and the pane it
* lands in is whatever width the layout hands it that day. Breaking by character count only ever fits
* one font at one width, which is how the questopedia came to run its text off the right edge of the
* screen. So the caller hands over the measurement- a predicate answering whether a candidate line
* fits- and this decides where the breaks go without knowing anything about pixels or fonts.
*/
var QuestOverviewWrapper = class QuestOverviewWrapper {
	/**
	* The constructor is not designed to be called.
	* This is a static class.
	*/
	constructor() {
		throw new Error("This is a static class.");
	}
	/**
	* Breaks the overview into lines, each of which satisfies the given fit predicate.
	*
	* A blank token- what a doubled space or a newline in the source becomes once split on
	* whitespace- is an authored line break and ends the line in progress. Two blanks in a row still
	* yield only one empty line, because a paragraph gap is a paragraph gap however many times it was
	* typed.
	* @param {string} overview The paragraph to break into lines.
	* @param {function(string): boolean} fits Answers whether a candidate line fits the available width.
	* @returns {string[]}
	*/
	static wrap(overview, fits) {
		const lines = [];
		let currentLine = String.empty;
		overview.split(/\s/).forEach((word) => {
			if (word === String.empty) {
				currentLine = QuestOverviewWrapper._breakLine(lines, currentLine);
				return;
			}
			const candidate = currentLine === String.empty ? word : `${currentLine} ${word}`;
			if (fits(candidate)) {
				currentLine = candidate;
				return;
			}
			if (currentLine !== String.empty) {
				lines.push(currentLine);
			}
			currentLine = word;
		});
		if (currentLine !== String.empty) {
			lines.push(currentLine);
		}
		return lines;
	}
	/**
	* Finishes the line in progress at an authored break and inserts the gap it asked for.
	* @param {string[]} lines The lines finished so far, which this appends to.
	* @param {string} currentLine The line in progress.
	* @returns {string} The new, empty line in progress.
	*/
	static _breakLine(lines, currentLine) {
		if (currentLine !== String.empty) {
			lines.push(currentLine);
		}
		const lastLine = lines.at(-1);
		if (lastLine !== String.empty) {
			lines.push(String.empty);
		}
		return String.empty;
	}
};

//#endregion
//#region src/plugins/omni/ext/quest/windows/Window_QuestopediaDescription.js
/**
* The pane describing the highlighted quest: its name, recommended level, tags and overview.
*
* The objectives live in their own pane beneath this one, so this window never draws them. Keeping
* the two apart is what lets each be sized for its own content rather than one window guessing at
* where the other's text will end.
*/
var Window_QuestopediaDescription = class extends Window_Base {
	/**
	* The current selected quest in the quest list window.
	* @type {TrackedOmniQuest}
	*/
	_currentQuest = null;
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Gets the quest currently being displayed.
	* @returns {TrackedOmniQuest}
	*/
	getCurrentQuest() {
		return this._currentQuest;
	}
	/**
	* Sets the quest currently being displayed.
	* @param {TrackedOmniQuest} quest The quest to display data for.
	*/
	setCurrentQuest(quest) {
		this._currentQuest = quest;
	}
	/**
	* Implements {@link Window_Base.drawContent}.<br/>
	* Draws the name, recommended level, tags and overview of the current quest, top to bottom.
	*/
	drawContent() {
		const quest = this.getCurrentQuest();
		if (quest === null) return;
		const [x, y] = [0, 0];
		const lh = this.lineHeight();
		this.drawQuestName(x, y);
		const recommendedLevelY = y + lh;
		this.drawQuestRecommendedLevel(x, recommendedLevelY);
		const tagIconsY = y + lh * 2;
		this.drawQuestTagIcons(x, tagIconsY);
		const overviewY = y + lh * 3;
		this.drawQuestOverview(x, overviewY);
	}
	/**
	* Renders the quest name, if it is known. If it is not, it will be masked.
	* @param {number} x The origin x.
	* @param {number} y The origin y.
	*/
	drawQuestName(x, y) {
		const quest = this.getCurrentQuest();
		const questName = quest.name();
		const possiblyMaskedName = quest.isKnown() ? questName : J.BASE.Helpers.maskString(questName);
		const resizedText = this.modFontSizeForText(10, possiblyMaskedName);
		const textWidth = this.textWidth(resizedText);
		this.drawTextEx(resizedText, x, y, textWidth);
	}
	/**
	* Renders the recommended level of the quest, masked while the quest is unknown or the level is
	* deliberately unset.
	* @param {number} x The origin x.
	* @param {number} y The origin y.
	*/
	drawQuestRecommendedLevel(x, y) {
		const quest = this.getCurrentQuest();
		const questRecommendedLevel = quest.recommendedLevel();
		const possiblyMaskedLevel = quest.isKnown() && questRecommendedLevel >= 0 ? questRecommendedLevel.toString() : "???";
		const combinedText = `Recommended Level: ${possiblyMaskedLevel}`;
		const resizedText = this.modFontSizeForText(-2, combinedText);
		const textWidth = this.textWidth(resizedText);
		this.drawTextEx(resizedText, x, y, textWidth);
	}
	/**
	* Renders one icon per tag on the quest, left to right, once the quest is known.
	* @param {number} x The origin x.
	* @param {number} y The origin y.
	*/
	drawQuestTagIcons(x, y) {
		const quest = this.getCurrentQuest();
		if (!quest.isKnown()) return;
		const tags = quest.tags();
		if (tags.length === 0) return;
		tags.forEach((tag, index) => {
			const tagX = x + ImageManager.iconWidth * index;
			this.drawIcon(tag.iconIndex, tagX, y);
		});
	}
	/**
	* Renders the quest overview, if the quest is unlocked. If the quest is still locked, the overview will be replaced
	* with the "unknown hint" instead.
	* @param {number} x The origin x.
	* @param {number} y The origin y.
	*/
	drawQuestOverview(x, y) {
		const quest = this.getCurrentQuest();
		const overview = quest.isKnown() ? quest.overview() : quest.unknownHint();
		if (overview.length === 0) {
			this.drawTextEx("???", x, y, this.innerWidth);
			return;
		}
		const lines = this.buildQuestOverviewLines(overview);
		const overviewLineHeight = this.lineHeight() - 10;
		lines.forEach((line, index) => {
			const lineY = y + index * overviewLineHeight;
			this.drawTextEx(line, x, lineY, this.innerWidth);
		});
	}
	/**
	* Breaks the overview into lines no wider than this window's content area.
	*
	* The measurement is this window's own, so the same overview breaks differently in a narrower pane
	* or a larger font, which is the whole point of measuring rather than counting characters.
	* @param {string} overview The overview to be chopped into lines.
	* @returns {string[]} The overview chopped up into lines.
	*/
	buildQuestOverviewLines(overview) {
		const fits = (line) => this.textSizeEx(line).width <= this.innerWidth;
		return QuestOverviewWrapper.wrap(overview, fits);
	}
};

//#endregion
//#region src/plugins/omni/ext/quest/windows/Window_QuestopediaObjectives.js
/**
* The pane listing the objectives of the highlighted quest that the player knows about.
*
* Each row is one objective: the state icon and the description on the first line, then how it is
* fulfilled and what the protagonists made of it beneath. The rows are read, never chosen- the scene
* keeps the cursor on the quest list- but a command window is still the right shape, because it
* already knows how to draw a block of lines per entry and to scroll when there are more than fit.
*/
var Window_QuestopediaObjectives = class extends Window_Command {
	/**
	* Constructor.
	* @param {Rectangle} rect The rectangle that represents this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Implements {@link Window_Command.initMembers}.<br/>
	* Initializes the members of this window.
	*
	* This cannot be a class field declaration: JavaScript applies those only after `super()` returns,
	* by which point the command list has already been built from it and found it undefined.
	*/
	initMembers() {
		/**
		* The quest objectives currently being rendered.
		* @type {TrackedOmniObjective[]}
		*/
		this._currentObjectives = [];
	}
	/**
	* Overwrites {@link #itemHeight}.<br/>
	* Each row carries the objective's description and two lines of subtext beneath it, so the row is
	* two lines tall to hold the block once it is centered.
	* @returns {number}
	*/
	itemHeight() {
		return this.lineHeight() * 2;
	}
	/**
	* Gets the quest objectives currently being rendered.
	* @returns {TrackedOmniObjective[]}
	*/
	getCurrentObjectives() {
		return this._currentObjectives;
	}
	/**
	* Sets the quest objectives currently being rendered.
	* @param {TrackedOmniObjective[]} questObjectives The quest objectives to render in this list.
	*/
	setCurrentObjectives(questObjectives) {
		this._currentObjectives = questObjectives;
	}
	/**
	* Implements {@link #makeCommandList}.<br/>
	* Creates one row per known objective, or a single row saying there are none.
	*/
	makeCommandList() {
		const commands = this.buildCommands();
		if (commands.length === 0) {
			commands.push(this.buildNoObjectivesCommand());
		}
		commands.forEach(this.addBuiltCommand, this);
	}
	/**
	* Builds the rows for every objective the player knows about.
	*
	* An objective is known once it has been activated, or when it was never hidden in the first
	* place; a hidden objective that has not started yet is a spoiler and stays out of the pane.
	* @returns {BuiltWindowCommand[]}
	*/
	buildCommands() {
		const objectives = this.getCurrentObjectives();
		return objectives.filter((objective) => objective.isKnown()).map(this.buildCommand, this);
	}
	/**
	* Builds a {@link BuiltWindowCommand} based on the quest objective.
	* @param {TrackedOmniObjective} questObjective The quest objective data.
	* @returns {BuiltWindowCommand} The built command based on this objective.
	*/
	buildCommand(questObjective) {
		const description = this.modFontSizeForText(-4, questObjective.description());
		return new WindowCommandBuilder(description).setSymbol(questObjective.id).setExtensionData(questObjective).setIconIndex(questObjective.iconIndexByState()).addTextLine(questObjective.fulfillmentText()).addTextLine(questObjective.log()).build();
	}
	/**
	* Builds the single row shown when the quest has no objectives the player knows about.
	* @returns {BuiltWindowCommand}
	*/
	buildNoObjectivesCommand() {
		return new WindowCommandBuilder(String.empty).setSymbol(0).setExtensionData(null).addTextLine("No known objectives for this quest.").build();
	}
};

//#endregion
//#region src/plugins/omni/ext/quest/scenes/Scene_Questopedia.js
/**
* A scene for perusing the quests the player knows about, and choosing which to track.
*
* Built on the facet skeleton rather than laid out from scratch, so it shares the control legend and
* the bounded region every other menu in the ecosystem draws inside. The left column is a strip
* naming the category being browsed with the quests of that category beneath it; the right side is
* the highlighted quest's description above its objectives. The shoulder triggers walk the
* categories, and confirming a quest toggles whether it is tracked on the map.
*/
var Scene_Questopedia = class extends Scene_MenuFacetBase {
	/**
	* Constructor.
	*/
	constructor() {
		super();
		this.initialize();
	}
	/**
	* Pushes this current scene onto the stack, forcing it into action.
	*/
	static callScene() {
		SceneManager.push(this);
	}
	/**
	* Extends {@link #initMembers}.<br/>
	* Also initializes the questopedia's own members.
	*/
	initMembers() {
		super.initMembers();
		/**
		* A grouping of all properties associated with the omnipedia.
		*/
		this._j._omni = {};
		/**
		* A grouping of all properties associated with the questopedia.
		* The questopedia is a subcategory of the omnipedia.
		*/
		this._j._omni._quest = {};
		/**
		* The L2/R2 ring of quest categories this scene pages through.
		* @type {FilterCycle}
		*/
		this._j._omni._quest._categoryFilter = new FilterCycle(this.buildCategoryPositions());
		/**
		* The strip naming whichever category is currently being browsed.
		* @type {Window_FilterStrip}
		*/
		this._j._omni._quest._categoryStrip = null;
		/**
		* The window that shows the list of known quests.
		* @type {Window_QuestopediaList}
		*/
		this._j._omni._quest._pediaList = null;
		/**
		* The window that shows the description of the selected quest.
		* @type {Window_QuestopediaDescription}
		*/
		this._j._omni._quest._pediaDescription = null;
		/**
		* The window that shows the objectives of the selected quest.
		* @type {Window_QuestopediaObjectives}
		*/
		this._j._omni._quest._pediaObjectives = null;
	}
	/**
	* The positions of the category ring, in the order the categories were authored.
	*
	* A category already carries a key, a name and an icon, which is exactly what a ring position is.
	* @returns {{key: string, name: string, iconIndex: number}[]}
	*/
	buildCategoryPositions() {
		return QuestManager.categories(false);
	}
	/**
	* Extends {@link #create}.<br/>
	* Also creates this scene's own windows.
	*/
	create() {
		super.create();
		this.createCategoryStripWindow();
		this.createQuestopediaListWindow();
		this.createQuestopediaDescriptionWindow();
		this.createQuestopediaObjectivesWindow();
		this.applyActiveCategory();
		this.getQuestopediaListWindow().activate();
	}
	/**
	* Overwrites {@link Scene_MenuBase.prototype.createBackground}.<br/>
	* Keeps the map faintly visible behind the pedia.
	*/
	createBackground() {
		this.setBackgroundFilter(new PIXI.filters.AlphaFilter(.1));
		this.setBackgroundSprite(new Sprite());
		this.backgroundSprite().bitmap = SceneManager.backgroundBitmap();
		this.backgroundSprite().filters = [this.backgroundFilter()];
		this.addChild(this.backgroundSprite());
	}
	/**
	* Overrides {@link #hasHelpWindow}.<br/>
	* The description pane is this scene's help; a strip across the top would only repeat it.
	* @returns {boolean}
	*/
	hasHelpWindow() {
		return false;
	}
	/**
	* Overrides {@link #commandColumnRatio}.<br/>
	* Quest names run long, so the column is wider than the base's default.
	* @returns {number}
	*/
	commandColumnRatio() {
		return .28;
	}
	/**
	* How many lines of text the description pane is sized for: the name, the level, the tag icons,
	* and room for the overview to wrap beneath them.
	*
	* The longest authored overview runs to about seven wrapped lines at this pane's width in the
	* game's monospace font, and the overview lines are drawn tighter than a full line, so seven fit
	* inside the seven full lines left after the three header lines.
	* @returns {number}
	*/
	descriptionLineCount() {
		return 10;
	}
	/**
	* The rectangle for the category strip, crowning the left column.
	* @returns {Rectangle}
	*/
	categoryStripRectangle() {
		const facetArea = this.facetAreaRect();
		const height = this.calcWindowHeight(1, false);
		return new Rectangle(facetArea.x, facetArea.y, this.commandColumnWidth(), height);
	}
	/**
	* The rectangle for the quest list, filling the left column beneath the strip.
	* @returns {Rectangle}
	*/
	questopediaListRectangle() {
		const facetArea = this.facetAreaRect();
		const stripRectangle = this.categoryStripRectangle();
		const y = stripRectangle.y + stripRectangle.height;
		const height = facetArea.y + facetArea.height - y;
		return new Rectangle(facetArea.x, y, this.commandColumnWidth(), height);
	}
	/**
	* The rectangle for the description pane, across the top of the right side.
	* @returns {Rectangle}
	*/
	questopediaDescriptionRectangle() {
		const facetArea = this.facetAreaRect();
		const x = facetArea.x + this.commandColumnWidth();
		const width = facetArea.x + facetArea.width - x;
		const height = this.calcWindowHeight(this.descriptionLineCount(), false);
		return new Rectangle(x, facetArea.y, width, height);
	}
	/**
	* The rectangle for the objectives pane, filling whatever the description left of the right side.
	* @returns {Rectangle}
	*/
	questopediaObjectivesRectangle() {
		const facetArea = this.facetAreaRect();
		const descriptionRectangle = this.questopediaDescriptionRectangle();
		const y = descriptionRectangle.y + descriptionRectangle.height;
		const height = facetArea.y + facetArea.height - y;
		return new Rectangle(descriptionRectangle.x, y, descriptionRectangle.width, height);
	}
	/**
	* Implements {@link #controlLegendEntries}.<br/>
	* Teaches the two controls that leave no mark on screen until pressed: the shoulder triggers that
	* walk the categories, and confirm, which tracks a quest rather than opening anything.
	* @returns {{semantic: (string|string[]), label: string}[]}
	*/
	controlLegendEntries() {
		return [{
			semantic: ["content-prev", "content-next"],
			label: "category"
		}, {
			semantic: "ok",
			label: "track"
		}];
	}
	/**
	* Creates the strip naming the active category.
	*/
	createCategoryStripWindow() {
		const window = this.buildCategoryStripWindow();
		this.setCategoryStripWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the category strip window.
	* @returns {Window_FilterStrip}
	*/
	buildCategoryStripWindow() {
		const rectangle = this.categoryStripRectangle();
		return new Window_FilterStrip(rectangle);
	}
	/**
	* Gets the currently tracked category strip window.
	* @returns {Window_FilterStrip}
	*/
	getCategoryStripWindow() {
		return this._j._omni._quest._categoryStrip;
	}
	/**
	* Sets the currently tracked category strip window.
	* @param {Window_FilterStrip} stripWindow The category strip window to track.
	*/
	setCategoryStripWindow(stripWindow) {
		this._j._omni._quest._categoryStrip = stripWindow;
	}
	/**
	* Creates the list of quests the player can potentially complete.
	*/
	createQuestopediaListWindow() {
		const window = this.buildQuestopediaListWindow();
		this.setQuestopediaListWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the questopedia listing window.
	* @returns {Window_QuestopediaList}
	*/
	buildQuestopediaListWindow() {
		const rectangle = this.questopediaListRectangle();
		const window = new Window_QuestopediaList(rectangle);
		window.setHandler("ok", this.onQuestopediaListSelection.bind(this));
		window.setHandler("cancel", this.onCancelQuestopedia.bind(this));
		window.setHandler("content-next", this.cycleQuestCategories.bind(this, true));
		window.setHandler("content-prev", this.cycleQuestCategories.bind(this, false));
		window.onIndexChange = this.onQuestopediaIndexChange.bind(this);
		return window;
	}
	/**
	* Gets the currently tracked questopedia list window.
	* @returns {Window_QuestopediaList}
	*/
	getQuestopediaListWindow() {
		return this._j._omni._quest._pediaList;
	}
	/**
	* Sets the currently tracked questopedia list window to the given window.
	* @param {Window_QuestopediaList} listWindow The questopedia list window to track.
	*/
	setQuestopediaListWindow(listWindow) {
		this._j._omni._quest._pediaList = listWindow;
	}
	/**
	* Creates the pane describing the highlighted quest.
	*/
	createQuestopediaDescriptionWindow() {
		const window = this.buildQuestopediaDescriptionWindow();
		this.setQuestopediaDescriptionWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the questopedia description window.
	* @returns {Window_QuestopediaDescription}
	*/
	buildQuestopediaDescriptionWindow() {
		const rectangle = this.questopediaDescriptionRectangle();
		return new Window_QuestopediaDescription(rectangle);
	}
	/**
	* Gets the currently tracked questopedia description window.
	* @returns {Window_QuestopediaDescription}
	*/
	getQuestopediaDescriptionWindow() {
		return this._j._omni._quest._pediaDescription;
	}
	/**
	* Sets the currently tracked questopedia description window to the given window.
	* @param {Window_QuestopediaDescription} descriptionWindow The questopedia description window to track.
	*/
	setQuestopediaDescriptionWindow(descriptionWindow) {
		this._j._omni._quest._pediaDescription = descriptionWindow;
	}
	/**
	* Creates the pane listing the highlighted quest's known objectives.
	*/
	createQuestopediaObjectivesWindow() {
		const window = this.buildQuestopediaObjectivesWindow();
		this.setQuestopediaObjectivesWindow(window);
		this.addWindow(window);
	}
	/**
	* Sets up and defines the questopedia objectives window.
	* @returns {Window_QuestopediaObjectives}
	*/
	buildQuestopediaObjectivesWindow() {
		const rectangle = this.questopediaObjectivesRectangle();
		const window = new Window_QuestopediaObjectives(rectangle);
		window.deactivate();
		window.deselect();
		return window;
	}
	/**
	* Gets the currently tracked questopedia objectives window.
	* @returns {Window_QuestopediaObjectives}
	*/
	getQuestopediaObjectivesWindow() {
		return this._j._omni._quest._pediaObjectives;
	}
	/**
	* Sets the currently tracked questopedia objectives window to the given window.
	* @param {Window_QuestopediaObjectives} objectivesWindow The questopedia objectives window to track.
	*/
	setQuestopediaObjectivesWindow(objectivesWindow) {
		this._j._omni._quest._pediaObjectives = objectivesWindow;
	}
	/**
	* The category ring this scene pages through.
	* @returns {FilterCycle}
	*/
	getCategoryFilter() {
		return this._j._omni._quest._categoryFilter;
	}
	/**
	* Points the strip and the list at whichever category is now selected, then the panes at whatever
	* the list lands on.
	*/
	applyActiveCategory() {
		const categoryFilter = this.getCategoryFilter();
		const activePosition = categoryFilter.activePosition();
		this.getCategoryStripWindow().setPosition(activePosition);
		const listWindow = this.getQuestopediaListWindow();
		listWindow.setCurrentCategoryKey(activePosition.key);
		listWindow.refresh();
		listWindow.select(0);
		this.onQuestopediaIndexChange();
	}
	/**
	* Walks the category ring, wrapping at either end.
	* @param {boolean} isForward Whether to walk forwards.
	*/
	cycleQuestCategories(isForward) {
		const categoryFilter = this.getCategoryFilter();
		const listWindow = this.getQuestopediaListWindow();
		if (!categoryFilter.canCycle()) {
			SoundManager.playBuzzer();
			listWindow.activate();
			return;
		}
		if (isForward) {
			categoryFilter.next();
		} else {
			categoryFilter.previous();
		}
		SoundManager.playCursor();
		this.applyActiveCategory();
		listWindow.activate();
	}
	/**
	* Synchronizes the description and objectives panes with the highlighted quest.
	*/
	onQuestopediaIndexChange() {
		const listWindow = this.getQuestopediaListWindow();
		const descriptionWindow = this.getQuestopediaDescriptionWindow();
		const objectivesWindow = this.getQuestopediaObjectivesWindow();
		const highlightedQuest = listWindow.currentExt();
		if (highlightedQuest === null) {
			descriptionWindow.setCurrentQuest(null);
			descriptionWindow.refresh();
			objectivesWindow.setCurrentObjectives([]);
			objectivesWindow.refresh();
			return;
		}
		descriptionWindow.setCurrentQuest(highlightedQuest);
		descriptionWindow.refresh();
		objectivesWindow.setCurrentObjectives(highlightedQuest.objectives);
		objectivesWindow.refresh();
	}
	/**
	* Toggles whether the highlighted quest is tracked on the map.
	*
	* The quest is never null here: a row that cannot be tracked is disabled, and an empty list has no
	* current item, so in both cases the engine buzzes instead of calling this handler.
	*/
	onQuestopediaListSelection() {
		const listWindow = this.getQuestopediaListWindow();
		/** @type {TrackedOmniQuest} */
		const highlightedQuest = listWindow.currentExt();
		highlightedQuest.toggleTracked();
		listWindow.refresh();
		listWindow.activate();
	}
	/**
	* Closes the questopedia and returns to the omnipedia.
	*/
	onCancelQuestopedia() {
		SceneManager.pop();
	}
};

//#endregion
//#region src/plugins/omni/ext/quest/managers/JABS_InputAdapter.js
if (J.ABS) {
	/**
	* Calls the questopedia directly on the map.
	*/
	JABS_InputAdapter.performQuestopediaAction = function() {
		if (!this._canPerformQuestopediaAction()) return;
		Scene_Questopedia.callScene();
	};
	/**
	* Determines whether or not the player can pull up the questopedia menu.
	* @returns {boolean}
	* @private
	*/
	JABS_InputAdapter._canPerformQuestopediaAction = function() {
		if (!SceneManager._scene.isMapScene()) {
			return false;
		}
		if ($gameMessage.isBusy()) {
			return false;
		}
		if ($gamePlayer.isTransferring()) {
			return false;
		}
		return true;
	};
}

//#endregion
//#region src/plugins/omni/ext/quest/objects/Game_Party.js
/**
* Extends {@link #initOmnipediaMembers}.<br/>
* Includes monsterpedia members.
*/
J.OMNI.EXT.QUEST.Aliased.Game_Party.set("initOmnipediaMembers", Game_Party.prototype.initOmnipediaMembers);
Game_Party.prototype.initOmnipediaMembers = function() {
	J.OMNI.EXT.QUEST.Aliased.Game_Party.get("initOmnipediaMembers").call(this);
	this.initQuestopediaMembers();
	this.populateQuestopediaTrackings();
};
/**
* Initialize members related to the omnipedia's questopedia.
*/
Game_Party.prototype.initQuestopediaMembers = function() {
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* The grouping of all properties related to the omnipedia.
	*/
	this._j._omni ||= {};
	/**
	* A collection of the current quests and their state.
	* @type {TrackedOmniQuest[]}
	*/
	this._j._omni._questopediaSaveables = [];
	/**
	* A more friendly cache of quests to work with.
	* This is what is kept up-to-date until saving.
	*
	* This is keyed by the quest key.
	* @type {Map<string, TrackedOmniQuest>}
	*/
	this._j._omni._questopediaCache = new Map();
};
/**
* Initialize the trackables for the questopedia.
*/
Game_Party.prototype.populateQuestopediaTrackings = function() {
	const trackedOmniquests = J.OMNI.EXT.QUEST.Metadata.quests.map(this.toTrackedOmniQuest, this);
	trackedOmniquests.forEach((trackedOmniquest) => {
		this.getQuestopediaEntriesCache().set(trackedOmniquest.key, trackedOmniquest);
	});
};
/**
* Maps an {@link OmniQuest} to a {@link TrackedOmniQuest}.
* @param {OmniQuest} omniquest The omniquest to map.
* @returns {TrackedOmniQuest}
*/
Game_Party.prototype.toTrackedOmniQuest = function(omniquest) {
	const objectivesMapper = (omniObjective) => new TrackedOmniObjective(omniquest.key, omniObjective.id, omniObjective.fulfillment, omniObjective.hiddenByDefault, omniObjective.isOptional);
	const trackedObjectives = omniquest.objectives.map(objectivesMapper, this);
	return new TrackedOmniQuest(omniquest.key, omniquest.categoryKey, trackedObjectives);
};
/**
* Updates the tracking of {@link TrackedOmniQuest}s from the latest metadata- in case there have been updates since
* the game has been last loaded. This likely only happens during a game's development.
*/
Game_Party.prototype.updateTrackedOmniQuestsFromConfig = function() {
	const trackings = this.getSavedQuestopediaEntries();
	J.OMNI.EXT.QUEST.Metadata.quests.forEach((omniquest) => {
		if (!this.canGainEntry(omniquest.key) || !this.canGainEntry(omniquest.name)) return;
		const foundTracking = trackings.find((tracking) => tracking.key === omniquest.key);
		const newTracking = this.toTrackedOmniQuest(omniquest);
		if (foundTracking) {
			foundTracking.categoryKey = omniquest.categoryKey;
			if (omniquest.objectives.length > foundTracking.objectives.length) {
				const objectivesToAdd = newTracking.objectives.slice(foundTracking.objectives.length);
				foundTracking.objectives.splice(foundTracking.objectives.length, 0, ...objectivesToAdd);
			}
			foundTracking.objectives.forEach((objective, index) => {
				if (!omniquest.objectives.at(index)) return;
				const sourceObjective = omniquest.objectives.at(index);
				objective.populateFulfillmentData(sourceObjective.fulfillment);
				const newObjective = newTracking.objectives.at(index);
				objective.hidden = newObjective.hidden;
				objective.optional = newObjective.optional;
			});
		} else {
			trackings.push(newTracking);
		}
	});
	trackings.sort((a, b) => a.key.localeCompare(b.key));
};
/**
* Gets all questopedia entries.
* @returns {TrackedOmniQuest[]}
*/
Game_Party.prototype.getSavedQuestopediaEntries = function() {
	return this._j._omni._questopediaSaveables;
};
/**
* Sets the questopedia entries to the given entries.
* @param {TrackedOmniQuest[]} entries The new collection of quests.
*/
Game_Party.prototype.setSavedQuestopediaEntries = function(entries) {
	this._j._omni._questopediaSaveables = entries;
};
/**
* Gets the cache of questopedia entries.
* The cache is keyed by the quest key.
* @returns {Map<string, TrackedOmniQuest>}
*/
Game_Party.prototype.getQuestopediaEntriesCache = function() {
	return this._j._omni._questopediaCache;
};
/**
* Sets the cache of questopedia entries.
* @param {Map<string, TrackedOmniQuest>} cache The cache to set over the old cache.
*/
Game_Party.prototype.setQuestopediaEntriesCache = function(cache) {
	this._j._omni._questopediaCache = cache;
};
/**
* Updates the saveable questopedia entries collection with the latest from the running cache of entries.
*/
Game_Party.prototype.translateQuestopediaCacheToSaveables = function() {
	const cache = this.getQuestopediaEntriesCache();
	const updatedQuestopediaEntries = Array.from(cache.values());
	this.setSavedQuestopediaEntries(updatedQuestopediaEntries);
};
/**
* Updates the questopedia cache with the data from the saveables.
*/
Game_Party.prototype.translateQuestopediaSaveablesToCache = function() {
	const savedQuestopediaEntries = this.getSavedQuestopediaEntries();
	const cache = new Map();
	savedQuestopediaEntries.forEach((questopediaEntry) => {
		cache.set(questopediaEntry.key, questopediaEntry);
	}, this);
	this.setQuestopediaEntriesCache(cache);
};
/**
* Synchronizes the questopedia cache into the saveable datas.
*/
Game_Party.prototype.synchronizeQuestopediaDataBeforeSave = function() {
	this.translateQuestopediaCacheToSaveables();
	this.translateQuestopediaSaveablesToCache();
};
/**
* Synchronize the questopedia saveable datas into the cache.
*/
Game_Party.prototype.synchronizeQuestopediaAfterLoad = function() {
	this.translateQuestopediaSaveablesToCache();
	this.translateQuestopediaCacheToSaveables();
};
/**
* Gets the questopedia entry for a given quest key.
* @param {string} questKey The key of the quest to find the entry for.
* @returns {TrackedOmniQuest} The questopedia entry matching that key.
*/
Game_Party.prototype.getQuestopediaEntryByKey = function(questKey) {
	const cache = this.getQuestopediaEntriesCache();
	return cache.get(questKey);
};
/**
* Gets all the questopedia entries available as an array from the cache.
* @returns {TrackedOmniQuest[]}
*/
Game_Party.prototype.getQuestopediaEntries = function() {
	const entries = this.getQuestopediaEntriesCache().values();
	return Array.from(entries);
};
if (!Game_Party.prototype.canGainEntry) {
	/**
	* Whether or not a named entry should be unlockable.
	* This is mostly for skipping recipe names that are used as dividers in the list.
	* @param {string} name The name of the entry.
	* @return {boolean} True if the entry can be gained, false otherwise.
	*/
	Game_Party.prototype.canGainEntry = function(name) {
		if (name === null) return false;
		if (name.trim().length === 0) return false;
		if (name.startsWith("_")) return false;
		if (name.startsWith("==")) return false;
		if (name.includes("-- empty --")) return false;
		return true;
	};
}
/**
* Extends {@link processItemGain}.<br/>
* Also synchronizes the item count with any relevant quests.
* @param {RPG_Item|RPG_Weapon|RPG_Armor} item The item to modify the quantity of.
* @param {number} amount The amount to modify the quantity by.
* @param {boolean} includeEquip Whether or not to include equipped items for equipment.
*/
J.OMNI.EXT.QUEST.Aliased.Game_Party.set("processItemGain", Game_Party.prototype.processItemGain);
Game_Party.prototype.processItemGain = function(item, amount, includeEquip) {
	J.OMNI.EXT.QUEST.Aliased.Game_Party.get("processItemGain").call(this, item, amount, includeEquip);
	this.processItemCheck(item);
};
/**
* Process an item being gained and update any relevant quest objectives.
* @param {RPG_Base} item The item being gained.
*/
Game_Party.prototype.processItemCheck = function(item) {
	const fetchObjectives = QuestManager.getValidFetchObjectives();
	if (fetchObjectives.length === 0) return;
	fetchObjectives.filter((objective) => {
		if (!objective.isFetchTarget(item)) return false;
		return true;
	}).forEach((objective) => {
		objective.synchronizeFetchTargetItemQuantity();
		if (objective.hasFetchedEnoughItems()) {
			const questToProgress = QuestManager.quest(objective.questKey);
			questToProgress.flagObjectiveAsCompleted(objective.id);
			questToProgress.progressObjectives();
		}
	});
};

//#endregion
//#region src/plugins/omni/ext/quest/objects/Game_System.js
/**
* Update the saved data with the running cache.
*/
J.OMNI.EXT.QUEST.Aliased.Game_System.set("onBeforeSave", Game_System.prototype.onBeforeSave);
Game_System.prototype.onBeforeSave = function() {
	J.OMNI.EXT.QUEST.Aliased.Game_System.get("onBeforeSave").call(this);
	$gameParty.synchronizeQuestopediaDataBeforeSave();
};
/**
* Extends {@link #onAfterLoad}.<br/>
* Updates the database with the tracked refined equips.
*/
J.OMNI.EXT.QUEST.Aliased.Game_System.set("onAfterLoad", Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function() {
	J.OMNI.EXT.QUEST.Aliased.Game_System.get("onAfterLoad").call(this);
	$gameParty.updateTrackedOmniQuestsFromConfig();
	$gameParty.synchronizeQuestopediaAfterLoad();
};

//#endregion
//#region src/plugins/omni/ext/quest/objects/Game_Enemy.js
/**
* Extends {@link onDeath}.<br/>
* Also processes quest checks for slain enemies.
*/
J.OMNI.EXT.QUEST.Aliased.Game_Enemy.set("onDeath", Game_Enemy.prototype.onDeath);
Game_Enemy.prototype.onDeath = function() {
	J.OMNI.EXT.QUEST.Aliased.Game_Enemy.get("onDeath").call(this);
	this.processSlayQuestsCheck();
};
/**
* Evaluate all active slay objectives that relate to this particular enemy.
*/
Game_Enemy.prototype.processSlayQuestsCheck = function() {
	const activeSlayObjectives = QuestManager.getValidSlayObjectives();
	if (activeSlayObjectives.length === 0) return;
	activeSlayObjectives.forEach((objective) => {
		const [enemyId] = objective.slayData();
		if (this.enemyId() !== enemyId) return;
		objective.incrementSlayTargetEnemyAmount();
		if (!objective.hasSlainEnoughEnemies()) return;
		const questToProgress = QuestManager.quest(objective.questKey);
		questToProgress.flagObjectiveAsCompleted(objective.id);
		questToProgress.progressObjectives();
	});
};

//#endregion
//#region src/plugins/omni/ext/quest/objects/Game_Event.js
/**
* Extends {@link meetsConditions}.<br/>
* Also includes the custom conditions that relate to a quest.
* @param {any} page The page driving this step.
* @returns {boolean}
*/
J.OMNI.EXT.QUEST.Aliased.Game_Event.set("meetsConditions", Game_Event.prototype.meetsConditions);
Game_Event.prototype.meetsConditions = function(page) {
	const metOtherPageConditions = J.OMNI.EXT.QUEST.Aliased.Game_Event.get("meetsConditions").call(this, page);
	if (!metOtherPageConditions) return false;
	const commentCommandList = Game_Event.getValidCommentCommandsFromPage(page);
	if (commentCommandList.length === 0) return true;
	const questConditionals = Game_Event.toQuestConditionals(commentCommandList);
	if (questConditionals.length === 0) return true;
	return questConditionals.every(Game_Event.questConditionalMet, this);
};
/**
* Filters the comment commands to only quest conditionals- should any exist in the collection.
* @param {RPG_EventListCommand[]} commentCommandList The comment commands to potentially convert to conditionals.
* @returns {OmniConditional[]}
*/
Game_Event.toQuestConditionals = function(commentCommandList) {
	const questCommentCommands = commentCommandList.filter(Game_Event.filterCommentCommandsByEventQuestConditional, this);
	if (questCommentCommands.length === 0) return [];
	return questCommentCommands.map(Game_Event.toQuestConditional, this);
};
/**
* Converts a known comment event command into a conditional for quest control.
* @param {RPG_EventListCommand} commentCommand The comment command to parse into a conditional.
* @returns {OmniConditional}
*/
Game_Event.toQuestConditional = function(commentCommand) {
	const [comment] = commentCommand.parameters;
	let result = null;
	switch (true) {
		case J.OMNI.EXT.QUEST.RegExp.EventQuest.test(comment):
			result = J.OMNI.EXT.QUEST.RegExp.EventQuest.exec(comment);
			break;
		case J.OMNI.EXT.QUEST.RegExp.EventQuestObjective.test(comment):
			result = J.OMNI.EXT.QUEST.RegExp.EventQuestObjective.exec(comment);
			break;
		case J.OMNI.EXT.QUEST.RegExp.EventQuestObjectiveForState.test(comment):
			result = J.OMNI.EXT.QUEST.RegExp.EventQuestObjectiveForState.exec(comment);
			break;
		case J.OMNI.EXT.QUEST.RegExp.ChoiceQuest.test(comment):
			result = J.OMNI.EXT.QUEST.RegExp.ChoiceQuest.exec(comment);
			break;
		case J.OMNI.EXT.QUEST.RegExp.ChoiceQuestObjective.test(comment):
			result = J.OMNI.EXT.QUEST.RegExp.ChoiceQuestObjective.exec(comment);
			break;
		case J.OMNI.EXT.QUEST.RegExp.ChoiceQuestObjectiveForState.test(comment):
			result = J.OMNI.EXT.QUEST.RegExp.ChoiceQuestObjectiveForState.exec(comment);
			break;
	}
	const [, val] = result;
	const parsedVal = JsonMapper.parseObject(val);
	switch (parsedVal.length) {
		case 1: return new OmniConditional(parsedVal.at(0), null, OmniQuest.States.Active);
		case 2: return new OmniConditional(parsedVal.at(0), parsedVal.at(1), OmniQuest.States.Active);
		case 3:
			const targetQuestState = OmniQuest.FromStringToStateId(parsedVal.at(2));
			return new OmniConditional(parsedVal.at(0), parsedVal.at(1), targetQuestState);
		default: throw new Error(`unknown parsedVal length in quest event tag: ${comment}`);
	}
};
/**
* A filter function for only including comment event commands relevant to quests.
* @param {RPG_EventListCommand} command The command being evaluated.
* @returns {boolean}
*/
Game_Event.filterCommentCommandsByEventQuestConditional = function(command) {
	const [comment] = command.parameters;
	if (!comment) return false;
	const { EventQuest, EventQuestObjective, EventQuestObjectiveForState } = J.OMNI.EXT.QUEST.RegExp;
	return [
		EventQuest,
		EventQuestObjective,
		EventQuestObjectiveForState
	].some((regex) => regex.test(comment));
};
/**
* A filter function for only including comment event commands relevant to quests.
* @param {RPG_EventListCommand} command The command being evaluated.
* @returns {boolean}
*/
Game_Event.filterCommentCommandsByChoiceQuestConditional = function(command) {
	const [comment] = command.parameters;
	if (!comment) return false;
	const { ChoiceQuest, ChoiceQuestObjective, ChoiceQuestObjectiveForState } = J.OMNI.EXT.QUEST.RegExp;
	return [
		ChoiceQuest,
		ChoiceQuestObjective,
		ChoiceQuestObjectiveForState
	].some((regex) => regex.test(comment));
};
/**
* Evaluates a {@link OmniConditional} to see if its requirements are currently met.
* @param {OmniConditional} questConditional The quest conditional to evaluate satisfaction of.
* @returns {boolean}
*/
Game_Event.questConditionalMet = function(questConditional) {
	const quest = QuestManager.quest(questConditional.questKey);
	if (questConditional.objectiveId !== null && questConditional.objectiveId >= 0) {
		return quest.isObjectiveInState(questConditional.state, questConditional.objectiveId);
	} else {
		return quest.state === questConditional.state;
	}
};

//#endregion
//#region src/plugins/omni/ext/quest/objects/Game_Interpreter.js
/**
* Extends {@link shouldHideChoiceBranch}.<br/>
* Includes possibility of hiding quest-related options.
* @param {number} subChoiceCommandIndex The index in the list of commands of an event that represents this branch.
* @returns {boolean}
*/
J.OMNI.EXT.QUEST.Aliased.Game_Interpreter.set("shouldHideChoiceBranch", Game_Interpreter.prototype.shouldHideChoiceBranch);
Game_Interpreter.prototype.shouldHideChoiceBranch = function(subChoiceCommandIndex) {
	const defaultShow = J.OMNI.EXT.QUEST.Aliased.Game_Interpreter.get("shouldHideChoiceBranch").call(this, subChoiceCommandIndex);
	if (defaultShow) return true;
	const currentPageCommands = this.list();
	const subEventCommand = currentPageCommands.at(subChoiceCommandIndex);
	if (!Game_Event.filterInvalidEventCommand(subEventCommand)) return false;
	if (!Game_Event.filterCommentCommandsByChoiceQuestConditional(subEventCommand)) return false;
	const conditional = Game_Event.toQuestConditional(subEventCommand);
	const met = Game_Event.questConditionalMet(conditional);
	if (met) return false;
	return true;
};

//#endregion
//#region src/plugins/omni/ext/quest/objects/Game_Map.js
/**
* Extends {@link initialize}.<br/>
* Also initializes the questopedia members.
*/
J.OMNI.EXT.QUEST.Aliased.Game_Map.set("initMembers", Game_Map.prototype.initMembers);
Game_Map.prototype.initMembers = function() {
	J.OMNI.EXT.QUEST.Aliased.Game_Map.get("initMembers").call(this);
	this.initQuestopediaMembers();
};
/**
* Initialize the members specific to the questopedia.
*/
Game_Map.prototype.initQuestopediaMembers = function() {
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with the omnipedia.
	*/
	this._j._omni ||= {};
	/**
	* A grouping of all properties associated with the questopedia portion of the omnipedia.
	*/
	this._j._omni._quest = {};
	/**
	* The timer for tracking when to check the destination- prevents expensive repeated coordinate checking.
	* @type {J_Timer}
	* @private
	*/
	this._j._omni._quest._destinationTimer = new J_Timer(15);
};
/**
* Gets the timer for checking the destination completion.
* @returns {J_Timer}
*/
Game_Map.prototype.getDestinationTimer = function() {
	return this._j._omni._quest._destinationTimer;
};
/**
* Extends {@link update}.<br/>
* Also evaluates destination-based {@link OmniConditional}s.
*/
J.OMNI.EXT.QUEST.Aliased.Game_Map.set("update", Game_Map.prototype.update);
Game_Map.prototype.update = function(sceneActive) {
	J.OMNI.EXT.QUEST.Aliased.Game_Map.get("update").call(this, sceneActive);
	this.processDestinationCheck();
};
/**
* Checks if the destination timer is ready for an evaluation of destination objectives checking.
*/
Game_Map.prototype.processDestinationCheck = function() {
	const timer = this.getDestinationTimer();
	if (timer.isTimerComplete()) {
		this.evaluateDestinationObjectives();
		timer.reset();
	} else {
		timer.update();
	}
};
/**
* Evaluate all active destination objectives that reside on this map.
*/
Game_Map.prototype.evaluateDestinationObjectives = function() {
	const activeDestinationObjectives = QuestManager.getValidDestinationObjectives();
	if (activeDestinationObjectives.length === 0) return;
	activeDestinationObjectives.forEach((objective) => {
		const [, coordinateRange] = objective.destinationData();
		if (objective.isPlayerWithinDestinationRange(coordinateRange)) {
			const questToProgress = QuestManager.quest(objective.questKey);
			questToProgress.flagObjectiveAsCompleted(objective.id);
			questToProgress.progressObjectives();
		}
	});
};

//#endregion
//#region src/plugins/omni/ext/quest/objects/JABS_StandardController.js
/**
* Extends {@link #update}.<br/>
* Also handles input detection for the questopedia shortcut key.
*/
J.OMNI.EXT.QUEST.Aliased.JABS_StandardController.set("update", JABS_StandardController.prototype.update);
JABS_StandardController.prototype.update = function() {
	J.OMNI.EXT.QUEST.Aliased.JABS_StandardController.get("update").call(this);
	this.updateQuestopediaAction();
};
/**
* Monitors and takes action based on player input regarding the questopedia shortcut key.
*/
JABS_StandardController.prototype.updateQuestopediaAction = function() {
	if (this.isQuestopediaActionTriggered()) {
		this.performQuestopediaAction();
	}
};
/**
* Checks the inputs of the questopedia action.
* @returns {boolean}
*/
JABS_StandardController.prototype.isQuestopediaActionTriggered = function() {
	if (Input.isActionTriggered("J.OMNI.QUEST", "open-quest-log")) {
		return true;
	}
	return false;
};
/**
* Executes the questopedia action.
*/
JABS_StandardController.prototype.performQuestopediaAction = function() {
	JABS_InputAdapter.performQuestopediaAction();
};

//#endregion
//#region src/plugins/omni/ext/quest/windows/Window_JabsRemapActions.js
/**
* Extends {@link #buildPostExtensionGroups}.<br/>
* Also appends a "Quest Actions" section for external (J.OMNI.QUEST) actions.
* @param {BuiltWindowCommand[]} rows The rows being built.
* @param {Set<string>} can The set of assignable logical action keys.
*/
J.OMNI.EXT.QUEST.Aliased.Window_JabsRemapActions.set("buildPostExtensionGroups", Window_JabsRemapActions.prototype.buildPostExtensionGroups);
Window_JabsRemapActions.prototype.buildPostExtensionGroups = function(rows, can) {
	J.OMNI.EXT.QUEST.Aliased.Window_JabsRemapActions.get("buildPostExtensionGroups").call(this, rows, can);
	rows.push(this.buildHeaderCommand("Quest Actions"));
	rows.push(this.buildExternalActionCommand("J.OMNI.QUEST", "open-quest-log", "Open Quest Log", 186));
};

//#endregion
//#region src/plugins/omni/ext/quest/windows/Window_Base.js
/**
* Overwrites {@link Window_Base#translateQuestTextCode}.
* Supplies the real quest translation now that the Questopedia system is present.
* @param {string} text The text that has a text code in it.
* @returns {string} The new text to parse.
*/
Window_Base.prototype.translateQuestTextCode = function(text) {
	return text.replace(/\\quest\[([\w.-]+)]/gi, (_, p1) => {
		const questKey = p1 ?? String.empty;
		if (!questKey) return text;
		const quest = QuestManager.quest(questKey);
		if (!quest) return text;
		const questName = quest.name();
		const questIconIndex = QuestManager.category(quest.categoryKey).iconIndex;
		return `\\I[${questIconIndex}]\\C[1]${questName}\\C[0]`;
	});
};

//#endregion
//#region src/plugins/omni/ext/quest/windows/Window_OmnipediaList.js
/**
* Extends {@link #buildCommands}.<br/>
* Adds the questopedia command to the list of commands in the omnipedia.
*/
J.OMNI.EXT.QUEST.Aliased.Window_OmnipediaList.set("buildCommands", Window_OmnipediaList.prototype.buildCommands);
Window_OmnipediaList.prototype.buildCommands = function() {
	const originalCommands = J.OMNI.EXT.QUEST.Aliased.Window_OmnipediaList.get("buildCommands").call(this);
	if (this.canAddMonsterpediaCommand()) {
		const questopediaCommand = new WindowCommandBuilder(J.OMNI.EXT.QUEST.Metadata.Command.Name).setSymbol(J.OMNI.EXT.QUEST.Metadata.Command.Symbol).addTextLine("A fine binding full of pages that contain details of known quests.").addTextLine("It won't contain anything you don't actually know about.").setIconIndex(J.OMNI.EXT.QUEST.Metadata.Command.IconIndex).build();
		originalCommands.push(questopediaCommand);
	}
	return originalCommands;
};
/**
* Determines whether or not the monsterpedia command should be added to the Omnipedia.
* @returns {boolean}
*/
Window_OmnipediaList.prototype.canAddMonsterpediaCommand = function() {
	if (!$gameSwitches.value(J.OMNI.EXT.QUEST.Metadata.enabledSwitchId)) return false;
	return true;
};

//#endregion
//#region src/plugins/omni/ext/quest/scenes/Scene_Omnipedia.js
/**
* Extends {@link #onRootPediaSelection}.<br/>
* When the monsterpedia is selected, open the monsterpedia.
*/
J.OMNI.EXT.QUEST.Aliased.Scene_Omnipedia.set("onRootPediaSelection", Scene_Omnipedia.prototype.onRootPediaSelection);
Scene_Omnipedia.prototype.onRootPediaSelection = function() {
	const currentSelection = this.getRootOmnipediaKey();
	if (currentSelection === J.OMNI.EXT.QUEST.Metadata.Command.Symbol) {
		this.questopediaSelected();
	} else {
		J.OMNI.EXT.QUEST.Aliased.Scene_Omnipedia.get("onRootPediaSelection").call(this);
	}
};
/**
* Switch to the questopedia when selected from the root omnipedia list.
*/
Scene_Omnipedia.prototype.questopediaSelected = function() {
	this.closeRootPediaWindows();
	Scene_Questopedia.callScene();
};

//#endregion
//#region src/plugins/omni/ext/quest/_metadata/pluginCommands.js
/**
* Plugin command for unlocking quests by their keys.
*/
PluginManager.registerCommand(J.OMNI.EXT.QUEST.Metadata.name, "unlock-quests", (args) => {
	const { keys } = args;
	const questKeys = JSON.parse(keys);
	questKeys.forEach((questKey) => QuestManager.unlockQuestByKey(questKey));
});
/**
* Plugin command for progressing a quest of a given key.
*/
PluginManager.registerCommand(J.OMNI.EXT.QUEST.Metadata.name, "progress-quest", (args) => {
	const { key } = args;
	QuestManager.progressQuest(key);
});
/**
* Plugin command for finalizing a quest of a given key with the specified state .
*/
PluginManager.registerCommand(J.OMNI.EXT.QUEST.Metadata.name, "finalize-quest", (args) => {
	const { key, state } = args;
	const quest = QuestManager.quest(key);
	const finalizedState = parseInt(state);
	switch (finalizedState) {
		case 0:
			quest.flagAsCompleted();
			break;
		case 1:
			quest.flagAsFailed();
			break;
		case 2:
			quest.flagAsMissed();
			break;
	}
});
/**
* Plugin command for setting the tracking state of a quest by its key.
*/
PluginManager.registerCommand(J.OMNI.EXT.QUEST.Metadata.name, "set-quest-tracking", (args) => {
	const { key, trackingState } = args;
	const shouldTrack = trackingState === "true";
	QuestManager.setQuestTrackingByKey(key, shouldTrack);
});

//#endregion
//#region src/plugins/omni/ext/quest/registerOmniQuestSaveCodecs.js
/**
* The destination timer throttles how often the questopedia checks the player's coordinates against
* a tracked destination. It measures nothing the player can observe, so it is never written and the
* map gets a fresh one on load.
*
* `Game_Map` is the host, which is easy to miss: this is the one plugin slice living on the map
* object itself rather than on the system, the party, or a character.
*/
SerializableRegistry.extend(Game_Map, { transients: { "_j._omni._quest._destinationTimer": () => new J_Timer(15) } });
/**
* The questopedia cache is the same entries as `_questopediaSaveables`, keyed for lookup - the whole
* collection, written to the file a second time. It was the single largest thing in a savefile.
*
* It rebuilds here rather than coming back empty, because nothing reads it through a guard: the
* lookups call `.get()` on it directly, so an empty cache reads as "this party knows no quests"
* rather than as "this has not been built yet". Every saveable it needs has already decoded by the
* time a transient factory runs.
*/
SerializableRegistry.extend(Game_Party, { transients: { "_j._omni._questopediaCache": (party) => {
	const keyedEntries = party.getSavedQuestopediaEntries().map((entry) => [entry.key, entry]);
	return new Map(keyedEntries);
} } });

//#endregion
//# sourceMappingURL=J-OMNI-Quests.js.map