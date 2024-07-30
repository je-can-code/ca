//region OmniObjective
/**
 * A class representing the data shape of a single objective on a quest.
 */
class OmniObjective
{
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
    Indiscriminate: -1,

    /**
     * An objective that is of type "destination" means that to fulfill the objective, the player must arrive at a
     * particular mapId, usually within a set of coordinates on a given map. These types of quests will stop being
     * monitored once the objective has been achieved.
     */
    Destination: 0,

    /**
     * An objective that is of type "fetch" means that to fulfill the objective, the player must acquire one or more of
     * a specified item/weapon/armor in their inventory at a given time. These types of quests are perpetually monitored
     * until the quest is turned in, so the objective can potentially go in and out of a "completed" state.
     */
    Fetch: 1,

    /**
     * An objective that is of type "slay" means that to fulfill the objective, the player must defeat one or more of a
     * specified enemy after the objective has been made active. Once the enemy has been defeated X times, the objective
     * will be identified as completed and will cease being monitored.
     */
    Slay: 2,

    /**
     * An objective that is of type "quest" means that to fulfill the objective, the player must fully complete another
     * quest. Once the quest in question is completed, this objective will also be completed, however, if the target
     * quest is failed, this objective will be considered failed as well, usually resulting in the quest this objective
     * belonging to being considered failed.
     */
    Quest: 3,
  }

  /**
   * The various states that an objective can be in.
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
    Missed: 4,
  }

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
   * @param {boolean=} hiddenByDefault Whether or not this objective will be hidden upon activating the parent quest.
   * @param {boolean=} isOptional Whether or not this objective is optional for its parent quest.
   */
  constructor(id, type, description, logs, hiddenByDefault = true, isOptional = false)
  {
    this.id = id;
    this.type = type;
    this.description = description;
    this.logs = logs;

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
   * @param {string[]=} templateDetails The details to plug into the fulfillment template- varies by what type it is.
   * @returns {string} The templated fulfillment for this objective.
   */
  static FulfillmentTemplate(type, ...templateDetails)
  {
    switch (type)
    {
      case OmniObjective.Types.Indiscriminate:
        return templateDetails.at(0);
      case OmniObjective.Types.Destination:
        return `Navigate to ${templateDetails.at(0)} at [${templateDetails.at(1)}x, ${templateDetails.at(2)}y].`;
      case OmniObjective.Types.Fetch:
        return `Acquire x${templateDetails.at(0)} of ${templateDetails.at(1)}.`;
      case OmniObjective.Types.Slay:
        return `Defeat ${templateDetails.at(0)}x of the enemy [${templateDetails.at(1)}].`;
      case OmniObjective.Types.Quest:
        return `Complete the other quest: '${templateDetails.at(0)}'`;
      default:
        return 'This objective is not defined.';
    }

  }
}

//endregion OmniObjective

//region OmniObjectiveLogs
/**
 * A class representing the data shape of the various log messages associated with the state of an objective.
 */
class OmniObjectiveLogs
{
  /**
   * The text displayed in the log while the objective is still unfulfilled but ongoing.
   * @type {string}
   */
  discovered = String.empty;

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
   * Constructor.
   * @param {string} discovered The log text for when this objective is made active.
   * @param {string} completed The log text for when this objective is completed successfully.
   * @param {string} failed The log text for when this objective is failed.
   * @param {string} missed The log text for when this objective is missed.
   */
  constructor(discovered, completed, failed, missed)
  {
    this.discovered = discovered;
    this.completed = completed;
    this.failed = failed;
    this.missed = missed;
  }
}
//endregion OmniObjectiveLogs

//region OmniQuest
/**
 * A class representing the data shape of a single quest.
 */
class OmniQuest
{
  /**
   * The various states that a quest can be in.
   * <pre>
   *     Unknown: 0
   *     Active: 1
   *     Completed: 2
   *     Failed: 3
   * </pre>
   */
  static States = {
    /**
     * When a quest is in the "unknown" state, it means it has yet to be discovered by the player so it will not show up
     * in the questopedia by its name or reveal any objectives, but instead reveal only a general "this is where this
     * quest can be found/unlocked", if anything at all.
     */
    Unknown: 0,

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
    Missed: 4,
  }

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
   * When this quest is yet to be discovered and not missed, this is the description that will reveal to the player.
   * @type {string}
   */
  unknownHint = String.empty;

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
   * @param {string} unknownHint The hint displayed while this quest is still unknown.
   * @param {OmniObjective[]} objectives The various objectives required to complete this quest.
   */
  constructor(name, key, categoryKey, unknownHint, objectives)
  {
    this.name = name;
    this.key = key;
    this.categoryKey = categoryKey;
    this.unknownHint = unknownHint;
    this.objectives = objectives;
  }

  /**
   * A factory that generates builders for creating {@link OmniQuest}s.
   * @returns {OmniQuestBuilder}
   */
  static Builder = () => new OmniQuestBuilder();
}

//endregion OmniQuest

//region OmniQuestBuilder
/**
 * A builder for creating {@link OmniQuest}s.
 */
class OmniQuestBuilder
{
  #name = String.empty;
  #key = String.empty;
  #categoryKey = String.empty;
  #unknownHint = String.empty;
  #objectives = Array.empty;

  build()
  {
    const omniquest = new OmniQuest(this.#name, this.#key, this.#categoryKey, this.#unknownHint, this.#objectives);
    this.clear();
    return omniquest;
  }

  clear()
  {
    this.#name = String.empty;
    this.#key = String.empty;
    this.#categoryKey = String.empty;
    this.#unknownHint = String.empty;
    this.#objectives = Array.empty;
  }

  name(name)
  {
    this.#name = name;
    return this;
  }

  key(key)
  {
    this.#key = key;
    return this;
  }

  categoryKey(categoryKey)
  {
    this.#categoryKey = categoryKey;
    return this;
  }

  unknownHint(unknownHint)
  {
    this.#unknownHint = unknownHint;
    return this;
  }

  objectives(objectives)
  {
    this.#objectives = objectives;
    return this;
  }
}

//endregion OmniQuestBuilder

//region TrackedOmniObjective
/**
 * A class representing the tracking for a single objective of a quest.
 */
function TrackedOmniObjective(id, type, description, fulfillment, hiddenByDefault)
{
  this.initialize(id, type, description, fulfillment, hiddenByDefault);
}

TrackedOmniObjective.prototype = {};
TrackedOmniObjective.prototype.constructor = TrackedOmniObjective;

/**
 * Initialize an objective tracker for an quest.
 * @param {number} id The id of this objective.
 * @param {number} type The common classification of this objective.
 * @param {string} description The contextural description of this objective.
 * @param {string} fulfillment The templated fulfillment requirements of this objective.
 * @param {boolean} hidden Whether or not this objective is hidden.
 * @param {boolean} optional Whether or not this objective is optional for its parent quest.
 */
TrackedOmniObjective.prototype.initialize = function(id, type, description, fulfillment, hidden, optional)
{
  /**
   * The id of this objective. This is typically used to indicate order between objectives within a single quest.
   * @type {number}
   */
  this.id = id;

  /**
   * The contextual description that will be displayed in the objective itself regarding why the objective should be
   * completed.
   * @type {string}
   */
  this.description = description;

  /**
   * The uniform fulfillment criteria for this objective.
   * @type {string}
   */
  this.fulfillment = fulfillment;

  /**
   * The type of objective this is, defining how the fulfillment criteria is monitored.
   * @type {number}
   */
  this.type = type;

  /**
   * Whether or not this objective is hidden by default.
   * @type {boolean}
   */
  this.hidden = hidden;

  /**
   * Whether or not this objective is considered "optional", in that it is not strictly required to complete the parent
   * quest. Typically these objectives will end up "missed" if not completed rather than "failed".
   * @type {boolean}
   */
  this.optional = optional;
};

// TODO: implement methods for updating self.

//endregion TrackedOmniObjective

//region TrackedOmniQuest
/**
 * A class representing the tracking for a single quest.
 */
function TrackedOmniQuest(name, key, categoryKey, objectives)
{
  this.initialize(name, key, categoryKey, objectives);
}

TrackedOmniQuest.prototype = {};
TrackedOmniQuest.prototype.constructor = TrackedOmniQuest;

/**
 * Initialize a tracker for a quest.
 * @param {string} key The primary key of this quest.
 * @param {string} categoryKey The category key of this quest.
 * @param {OmniObjective[]} objectives The various objectives required to complete this quest.
 */
TrackedOmniQuest.prototype.initialize = function(key, categoryKey, objectives)
{
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
   * The various objectives that can/must be fulfilled in order to complete the quest.
   * @type {OmniObjective[]}
   */
  this.objectives = objectives;

  this.initMembers();
};

TrackedOmniQuest.prototype.initMembers = function()
{
  /**
   * The current state of this quest.
   * @type {number}
   */
  this.state = OmniQuest.States.Unknown;
};

/**
 * The name of the quest- but its computed since its just read from the data file.
 * @returns {string} The name of the quest from the data source.
 */
TrackedOmniQuest.prototype.name = function()
{
  // TODO: implement lookup in metadata for retrieving this by key.
};

/**
 * The journaling of the quest- but its computed since its a combination of all started objectives' descriptions that
 * are just read from the data file.
 * @returns {string[]}
 */
TrackedOmniQuest.prototype.journal = function()
{
  // TODO: implement lookup in metadata for retrieving this by concatenating objective description details.
};

// TODO: implement methods for updating objectives and such.

//endregion TrackedOmniQuest

//region annoations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 OMNI-QUEST] Extends the Omnipedia with a Questopedia entry.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-Omnipedia
 * @orderAfter J-Base
 * @orderAfter J-Omnipedia
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin extends the Omnipedia by adding a new entry: The Questopedia.
 *
 * Integrates with others of mine plugins:
 * - J-Base             : always required for my plugins.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * Cool details about this cool plugin go here.
 *
 * ============================================================================
 * SOMETHING KEY TO THIS PLUGIN:
 * Ever want to do something cool? Well now you can! By applying the
 * appropriate tag to across the various database locations, you too can do
 * cool things that only others with this plugin can do.
 *
 * TAG USAGE:
 * - Actors
 * - Enemies
 * - Skills
 * - etc.
 *
 * TAG FORMAT:
 *  <tag:VALUE>
 *    Where VALUE represents the amount to do.
 *
 * TAG EXAMPLES:
 *  <tag:100>
 * 100 of something will occur when this is triggered.
 * ============================================================================
 * CHANGELOG:
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
 * @command do-the-thing
 * @text Add/Remove points
 * @desc Adds or removes a designated amount of points from all members of the current party.
 * @arg points
 * @type number
 * @min -99999999
 * @max 99999999
 * @desc The number of points to modify by. Negative will remove points. Cannot go below 0.
 */
//endregion annotations

//region plugin metadata
class J_QUEST_PluginMetadata extends PluginMetadata
{
  /**
   * The path where the config for quests is located.
   * @type {string}
   */
  static CONFIG_PATH = 'data/config.quest.json';

  /**
   * Constructor.
   */
  constructor(name, version)
  {
    super(name, version);
  }

  static classifyQuests(parsedBlob)
  {
    const parsedQuests = [];

    /** @param {OmniQuest} parsedQuest */
    const foreacher = parsedQuest =>
    {
      // validate the name is not one of the organizational names for the editor-only.
      const questName = parsedQuest.name;
      if (questName.startsWith("__")) return;
      if (questName.startsWith("==")) return;
      if (questName.startsWith("--")) return;

      const builtQuest = OmniQuest.Builder()
        .name(parsedQuest.name)
        .key(parsedQuest.key)
        .categoryKey(parsedQuest.categoryKey)
        .unknownHint(parsedQuest.unknownHint)
        .objectives(parsedQuest.objectives)
        .build();

      parsedQuests.push(builtQuest)
    };

    parsedBlob.forEach(foreacher, this);

    return parsedQuests;
  }

  /**
   *  Extends {@link #postInitialize}.<br>
   *  Includes translation of plugin parameters.
   */
  postInitialize()
  {
    // execute original logic.
    super.postInitialize();

    // initialize the quests from plugin configuration.
    this.initializeQuests();

    // initialize this plugin from configuration.
    this.initializeMetadata();
  }

  initializeQuests()
  {
    const parsedQuests = JSON.parse(StorageManager.fsReadFile(J_QUEST_PluginMetadata.CONFIG_PATH));
    if (parsedQuests === null)
    {
      console.error('no quest configuration was found in the /data directory of the project.');
      console.error('Consider adding configuration using the J-MZ data editor, or hand-writing one.');
      throw new Error('OmniQuest plugin is being used, but no config file is present.');
    }

    // classify each panel.
    const classifiedQuests = J_QUEST_PluginMetadata.classifyQuests(parsedQuests);

    /**
     * A collection of all defined quests.
     * @type {OmniQuest[]}
     */
    this.quests = classifiedQuests;

    const questMap = new Map();
    this.quests.forEach(quest => questMap.set(quest.key, quest));

    /**
     * A key:quest map of all defined quests.
     * @type {Map<string, OmniQuest>}
     */
    this.questsMap = questMap;

    console.log(`loaded:
      - ${this.quests.length} quests
      from file ${J_QUEST_PluginMetadata.CONFIG_PATH}.`);
  }

  /**
   * Initializes the metadata associated with this plugin.
   */
  initializeMetadata()
  {
    /**
     * The id of a switch that represents whether or not this system is accessible in the menu.
     * @type {number}
     */
    this.menuSwitchId = parseInt(this.parsedPluginParameters['menu-switch']);

    /**
     * When this switch is enabled, the command will be rendered into the command list as well.
     * @type {number}
     */
    this.enabledSwitchId = 104; //parseInt(this.parsedPluginParameters['enabled-switch-id']);

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
      IconIndex: 2564,
    };
  }
}
//endregion plugin metadata

//region initialization
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

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
J.OMNI.EXT.QUEST.Metadata = new J_QUEST_PluginMetadata('J-Omni-Questopedia', '1.0.0');

/**
 * A collection of all aliased methods for this plugin.
 */
J.OMNI.EXT.QUEST.Aliased = {};
J.OMNI.EXT.QUEST.Aliased.Game_Party = new Map();
J.OMNI.EXT.QUEST.Aliased.Game_System = new Map();
J.OMNI.EXT.QUEST.Aliased.Scene_Omnipedia = new Map();
J.OMNI.EXT.QUEST.Aliased.Window_OmnipediaList = new Map();

/**
 * All regular expressions used by this plugin.
 */
J.OMNI.EXT.QUEST.RegExp = {};
J.OMNI.EXT.QUEST.RegExp.Points = /<tag:[ ]?(\d+)>/i;
//endregion initialization

//region plugin commands
/**
 * Plugin command for doing the thing.
 */
PluginManager.registerCommand(
  J.OMNI.EXT.QUEST.Metadata.name,
  "do-the-thing",
  args =>
  {
    console.log('did the thing.');
  });
//endregion plugin commands

//region OmniQuestManager
class OmniQuestManager
{
  // TODO: implement.
}
//endregion OmniQuestManager

//region Game_Party
/**
 * Extends {@link #initOmnipediaMembers}.<br>
 * Includes monsterpedia members.
 */
J.OMNI.EXT.QUEST.Aliased.Game_Party.set('initOmnipediaMembers', Game_Party.prototype.initOmnipediaMembers);
Game_Party.prototype.initOmnipediaMembers = function()
{
  // perform original logic.
  J.OMNI.EXT.QUEST.Aliased.Game_Party.get('initOmnipediaMembers')
    .call(this);

  // initialize the monsterpedia.
  this.initQuestopediaMembers();
};

//region questopedia
/**
 * Initialize members related to the omnipedia's questopedia.
 */
Game_Party.prototype.initQuestopediaMembers = function()
{
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
 * Gets all questopedia entries.
 * @returns {TrackedOmniQuest[]}
 */
Game_Party.prototype.getSavedQuestopediaEntries = function()
{
  return this._j._omni._questopediaSaveables;
};

/**
 * Gets the cache of questopedia entries.
 * The cache is keyed by the quest key.
 * @returns {Map<string, TrackedOmniQuest>}
 */
Game_Party.prototype.getQuestopediaEntriesCache = function()
{
  return this._j._omni._questopediaCache;
};

/**
 * Sets the cache of questopedia entries.
 * @param {Map<string, TrackedOmniQuest>} cache The cache to set over the old cache.
 */
Game_Party.prototype.setQuestopediaEntriesCache = function(cache)
{
  this._j._omni._questopediaCache = cache;
};

/**
 * Updates the saveable questopedia entries collection with the latest from the running cache of entries.
 */
Game_Party.prototype.translateQuestopediaCacheForSaving = function()
{
  // grab the collection that is saveable.
  const savedQuestopediaEntries = this.getSavedQuestopediaEntries();

  // grab the cache we've been maintaining.
  const cache = this.getQuestopediaEntriesCache();

  // an iterator function for building out the saveables.
  const forEacher = (questopediaEntry, key) =>
  {
    // update the saveable observations with the cached data.
    savedQuestopediaEntries[key] = questopediaEntry;
  };

  // iterate over each cached item.
  cache.forEach(forEacher, this);
};

/**
 * Updates the questopedia cache with the data from the saveables.
 */
Game_Party.prototype.translateQuestopediaSaveablesToCache = function()
{
  // grab the collection that is saveable.
  const savedQuestopediaEntries = this.getSavedQuestopediaEntries();

  // grab the cache of observations we've been maintaining.
  const cache = new Map();

  // iterate over each saved item.
  savedQuestopediaEntries.forEach(questopediaEntry =>
  {
    // if the entry is invalid, do not store it in the cache.
    if (!questopediaEntry) return;

    // update the cache with the saveable.
    cache.set(questopediaEntry.key, questopediaEntry);
  }, this);

  // update the cache with the latest saveable datas.
  this.setQuestopediaEntriesCache(cache);
};

/**
 * Synchronizes the questopedia cache into the saveable datas.
 */
Game_Party.prototype.synchronizeQuestopediaDataBeforeSave = function()
{
  // validate the omnipedia is initialized.
  if (!this.isOmnipediaInitialized())
  {
    // initialize the omnipedia if it wasn't already.
    this.initOmnipediaMembers();
  }

  // translate the cache into saveables.
  this.translateQuestopediaCacheForSaving();

  // translate the saveables into cache.
  this.translateQuestopediaSaveablesToCache();
};

/**
 * Synchronize the questopedia saveable datas into the cache.
 */
Game_Party.prototype.synchronizeQuestopediaAfterLoad = function()
{
  // validate the omnipedia is initialized.
  if (!this.isOmnipediaInitialized())
  {
    // initialize the omnipedia if it wasn't already.
    this.initOmnipediaMembers();
  }

  // translate the saveables into cache.
  this.translateQuestopediaSaveablesToCache();

  // translate the cache into saveables.
  this.translateQuestopediaCacheForSaving();
};

/**
 * Gets the questopedia entry for a given quest key.
 * @param {string} questKey The key of the quest to find the entry for.
 * @returns {TrackedOmniQuest} The questopedia entry matching that key.
 */
Game_Party.prototype.getQuestopediaEntryByKey = function(questKey)
{
  // grab the cache for querying.
  const cache = this.getQuestopediaEntriesCache();

  // find the observation of the given enemy id.
  return cache.get(questKey);
};

/**
 * Gets all the questopedia entries available as an array from the cache.
 * @returns {TrackedOmniQuest[]}
 */
Game_Party.prototype.getQuestopediaEntries = function()
{
  return Array.from(this.getQuestopediaEntriesCache().values());
};

//endregion questopedia
//endregion Game_Party

//region Game_System
/**
 * Extends {@link #onAfterLoad}.<br>
 * Updates the database with the tracked refined equips.
 */
J.OMNI.EXT.QUEST.Aliased.Game_System.set('onAfterLoad', Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function()
{
  // perform original logic.
  J.OMNI.EXT.QUEST.Aliased.Game_System.get('onAfterLoad').call(this);

  // update the recipes & categories.
  $gameParty.synchronizeQuestopediaAfterLoad();
};
//endregion Game_System

//region Scene_Omnipedia
//region root actions
/**
 * Extends {@link #onRootPediaSelection}.<br>
 * When the monsterpedia is selected, open the monsterpedia.
 */
J.OMNI.EXT.QUEST.Aliased.Scene_Omnipedia.set('onRootPediaSelection', Scene_Omnipedia.prototype.onRootPediaSelection);
Scene_Omnipedia.prototype.onRootPediaSelection = function()
{
  // grab which pedia was selected.
  const currentSelection = this.getRootOmnipediaKey();

  // check if the current selection is the questopedia.
  if (currentSelection === J.OMNI.EXT.QUEST.Metadata.Command.Symbol)
  {
    // execute the questopedia.
    this.questopediaSelected();
  }
  // the current selection is not the questopedia.
  else
  {
    // possibly activate other choices.
    J.OMNI.EXT.QUEST.Aliased.Scene_Omnipedia.get('onRootPediaSelection').call(this);
  }
}

/**
 * Switch to the questopedia when selected from the root omnipedia list.
 */
Scene_Omnipedia.prototype.questopediaSelected = function()
{
  // close the root omnipedia windows.
  this.closeRootPediaWindows();

  // call the questopedia scene.
  Scene_Questopedia.callScene();
}
//endregion root actions
//endregion Scene_Omnipedia

//region Scene_Questopedia
/**
 * A scene for interacting with the Questopedia.
 */
class Scene_Questopedia extends Scene_MenuBase
{
  /**
   * Constructor.
   */
  constructor()
  {
    // call super when having extended constructors.
    super();

    // jumpstart initialization on creation.
    this.initialize();
  }

  /**
   * Pushes this current scene onto the stack, forcing it into action.
   */
  static callScene()
  {
    SceneManager.push(this);
  }

  //region init
  /**
   * Initialize the window and all properties required by the scene.
   */
  initialize()
  {
    // perform original logic.
    super.initialize();

    // also initialize our scene properties.
    this.initMembers();
  }

  /**
   * Initialize all properties for our omnipedia.
   */
  initMembers()
  {
    // initialize the root-namespace definition members.
    this.initCoreMembers();

    // initialize the questopedia members.
    this.initPrimaryMembers();
  }

  /**
   * The core properties of this scene are the root namespace definitions for this plugin.
   */
  initCoreMembers()
  {
    /**
     * The shared root namespace for all of J's plugin data.
     */
    this._j ||= {};

    /**
     * A grouping of all properties associated with the omnipedia.
     */
    this._j._omni = {};
  }

  /**
   * The primary properties of the scene are the initial properties associated with
   * the main list containing all pedias unlocked by the player along with some subtext of
   * what the pedia entails.
   */
  initPrimaryMembers()
  {
    /**
     * A grouping of all properties associated with the questopedia.
     * The questopedia is a subcategory of the omnipedia.
     */
    this._j._omni._quest = {};

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
     * The window that shows the list of objectives for the selected quest.
     * @type {Window_QuestopediaObjectives}
     */
    this._j._omni._quest._pediaObjectives = null;
  }
  //endregion init

  //region create
  /**
   * Initialize all resources required for this scene.
   */
  create()
  {
    // perform original logic.
    super.create();

    // create the various display objects on the screen.
    this.createDisplayObjects();
  }

  /**
   * Creates the display objects for this scene.
   */
  createDisplayObjects()
  {
    // create all our windows.
    this.createAllWindows();
  }

  /**
   * Creates all questopedia windows.
   */
  createAllWindows()
  {
    // create the list of quests that are known.
    this.createQuestopediaListWindow();

    // create the description of the selected quest.
    this.createQuestopediaDescriptionWindow();

    // create the known list of unfinished and completed objectives of the selected quest.
    this.createQuestopediaObjectivesWindow();

    // grab the list window for refreshing.
    const listWindow = this.getQuestopediaListWindow();

    // initial refresh the detail window by way of force-changing the index.
    listWindow.onIndexChange();
  }

  /**
   * Overrides {@link Scene_MenuBase.prototype.createBackground}.<br>
   * Changes the filter to a different type from {@link PIXI.filters}.<br>
   */
  createBackground()
  {
    this._backgroundFilter = new PIXI.filters.AlphaFilter(0.1);
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this._backgroundSprite.filters = [ this._backgroundFilter ];
    this.addChild(this._backgroundSprite);
  }
  //endregion create

  //region windows
  //region list window
  /**
   * Creates the list of monsters the player has perceived.
   */
  createQuestopediaListWindow()
  {
    // create the window.
    const window = this.buildQuestopediaListWindow();

    // update the tracker with the new window.
    this.setQuestopediaListWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the questopedia listing window.
   * @returns {Window_OmnipediaList}
   */
  buildQuestopediaListWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.questopediaListRectangle();

    // create the window with the rectangle.
    const window = new Window_QuestopediaList(rectangle);

    // assign cancel functionality.
    window.setHandler('cancel', this.onCancelQuestopedia.bind(this));

    // assign on-select functionality.
    window.setHandler('ok', this.onQuestopediaListSelection.bind(this));

    // overwrite the onIndexChange hook with our local onQuestopediaIndexChange hook.
    window.onIndexChange = this.onQuestopediaIndexChange.bind(this);

    // return the built and configured omnipedia list window.
    return window;
  }

  /**
   * Gets the rectangle associated with the questopedia list command window.
   * @returns {Rectangle}
   */
  questopediaListRectangle()
  {
    // the list window's origin coordinates are the box window's origin as well.
    const [ x, y ] = Graphics.boxOrigin;

    // define the width of the list.
    const width = 400;

    // define the height of the list.
    const height = Graphics.boxHeight - (Graphics.verticalPadding * 2);

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked questopedia list window.
   * @returns {Window_QuestopediaList}
   */
  getQuestopediaListWindow()
  {
    return this._j._omni._quest._pediaList;
  }

  /**
   * Set the currently tracked questopedia list window to the given window.
   * @param {Window_QuestopediaList} listWindow The questopedia list window to track.
   */
  setQuestopediaListWindow(listWindow)
  {
    this._j._omni._quest._pediaList = listWindow;
  }

  //endregion list window

  //region description window
  /**
   * Creates the description of a single quest the player has discovered.
   */
  createQuestopediaDescriptionWindow()
  {
    // create the window.
    const window = this.buildQuestopediaDetailWindow();

    // update the tracker with the new window.
    this.setQuestopediaDetailWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the questopedia detail window.
   * @returns {Window_QuestopediaDescription}
   */
  buildQuestopediaDetailWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.questopediaDetailRectangle();

    // create the window with the rectangle.
    const window = new Window_QuestopediaDescription(rectangle);

    // return the built and configured omnipedia list window.
    return window;
  }

  /**
   * Gets the rectangle associated with the questopedia detail command window.
   * @returns {Rectangle}
   */
  questopediaDetailRectangle()
  {
    // grab the questopedia list window.
    const listWindow = this.getQuestopediaListWindow();

    // calculate the X for where the origin of the list window should be.
    const x = listWindow.x + listWindow.width;

    // calculate the Y for where the origin of the list window should be.
    const y = Graphics.verticalPadding;

    // define the width of the list.
    const width = Graphics.boxWidth - listWindow.width - (Graphics.horizontalPadding * 2);

    // define the height of the list.
    const height = Graphics.boxHeight - (Graphics.verticalPadding * 2);

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked questopedia description window.
   * @returns {Window_QuestopediaDescription}
   */
  getQuestopediaDetailWindow()
  {
    return this._j._omni._quest._pediaDescription;
  }

  /**
   * Set the currently tracked questopedia description window to the given window.
   * @param {Window_QuestopediaDescription} descriptionWindow The questopedia description window to track.
   */
  setQuestopediaDetailWindow(descriptionWindow)
  {
    this._j._omni._quest._pediaDescription = descriptionWindow;
  }

  //endregion description window

  //region objectives window
  /**
   * Creates the list of objectives for the current quest that the player knows about.
   */
  createQuestopediaObjectivesWindow()
  {
    // create the window.
    const window = this.buildQuestopediaObjectivesWindow();

    // update the tracker with the new window.
    this.setQuestopediaObjectivesWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the questopedia objectives window.
   * @returns {Window_QuestopediaObjectives}
   */
  buildQuestopediaObjectivesWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.questopediaObjectivesRectangle();

    // create the window with the rectangle.
    const window = new Window_QuestopediaObjectives(rectangle);

    // assign cancel functionality.
    // window.setHandler('cancel', this.onCancelQuestopediaObjectives.bind(this));

    // assign on-select functionality.
    // TODO: should the player even be able to "select" an objective?
    // window.setHandler('ok', this.onQuestopediaObjectiveSelection.bind(this));

    // overwrite the onIndexChange hook with our local onQuestopediaObjectivesIndexChange hook.
    // TODO: is there even any logic required for perusing objectives?
    // window.onIndexChange = this.onQuestopediaObjectivesIndexChange.bind(this);

    // return the built and configured objectives window.
    return window;
  }

  /**
   * Gets the rectangle associated with the questopedia objectives command window.
   * @returns {Rectangle}
   */
  questopediaObjectivesRectangle()
  {
    // the list window's origin coordinates are the box window's origin as well.
    const [ x, y ] = Graphics.boxOrigin;

    // define the width of the list.
    const width = 400;

    // define the height of the list.
    const height = Graphics.boxHeight - (Graphics.verticalPadding * 2);

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked questopedia objectives window.
   * @returns {Window_QuestopediaObjectives}
   */
  getQuestopediaObjectivesWindow()
  {
    return this._j._omni._quest._pediaObjectives;
  }

  /**
   * Set the currently tracked questopedia objectives window to the given window.
   * @param {Window_QuestopediaObjectives} listWindow The questopedia objectives window to track.
   */
  setQuestopediaObjectivesWindow(listWindow)
  {
    this._j._omni._quest._pediaObjectives = listWindow;
  }

  //endregion objectives window
  //endregion windows

  /**
   * Synchronize the detail window with the list window of the questopedia.
   */
  onQuestopediaIndexChange()
  {
    // grab the list window.
    const listWindow = this.getQuestopediaListWindow();

    // grab the detail window.
    const detailWindow = this.getQuestopediaDetailWindow();

    // grab the highlighted enemy's extra data, their observations.
    const highlightedQuestEntry = listWindow.currentExt();

    // sync the detail window with the currently-highlighted enemy.
    //detailWindow.setObservations(highlightedQuestEntry);

    // refresh the window for the content update.
    detailWindow.refresh();
  }

  /**
   * TODO: implement
   */
  onQuestopediaListSelection()
  {
    const listWindow = this.getQuestopediaListWindow();

    console.log(`quest selected index: [${listWindow.index()}].`);

    listWindow.activate();
  }

  /**
   * Close the questopedia and return to the main omnipedia.
   */
  onCancelQuestopedia()
  {
    // revert to the previous scene.
    SceneManager.pop();
  }
}

//endregion Scene_Questopedia

/**
 * Extends {@link #buildCommands}.<br>
 * Adds the questopedia command to the list of commands in the omnipedia.
 */
J.OMNI.EXT.QUEST.Aliased.Window_OmnipediaList.set('buildCommands', Window_OmnipediaList.prototype.buildCommands);
Window_OmnipediaList.prototype.buildCommands = function()
{
  // perform original logic.
  const originalCommands = J.OMNI.EXT.QUEST.Aliased.Window_OmnipediaList.get('buildCommands').call(this);

  // check if the monsterpedia command should be added.
  if (this.canAddMonsterpediaCommand())
  {
    // build the monsterpedia command.
    const questopediaCommand = new WindowCommandBuilder(J.OMNI.EXT.QUEST.Metadata.Command.Name)
      .setSymbol(J.OMNI.EXT.QUEST.Metadata.Command.Symbol)
      .addTextLine("A fine binding full of pages that contain details of known quests.")
      .addTextLine("It won't contain anything you don't actually know about.")
      .setIconIndex(J.OMNI.EXT.QUEST.Metadata.Command.IconIndex)
      .build();

    // add the monsterpedia command to the running list.
    originalCommands.push(questopediaCommand);
  }

  // return all the commands.
  return originalCommands;
};

/**
 * Determines whether or not the monsterpedia command should be added to the Omnipedia.
 * @returns {boolean}
 */
Window_OmnipediaList.prototype.canAddMonsterpediaCommand = function()
{
  // if the necessary switch isn't ON, don't render the command at all.
  if (!$gameSwitches.value(J.OMNI.EXT.QUEST.Metadata.enabledSwitchId)) return false;

  // add the command!
  return true;
};

class Window_QuestopediaDescription extends Window_Base
{
}

//region Window_QuestopediaList
class Window_QuestopediaList extends Window_Command
{
  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Implements {@link #makeCommandList}.<br>
   * Creates the command list of all known quests in this window.
   */
  makeCommandList()
  {
    // grab all the omnipedia listings available.
    const commands = this.buildCommands();

    // build all the commands.
    commands.forEach(this.addBuiltCommand, this);
  }

  /**
   * Builds all commands for this command window.
   * Adds all known quests to the list that are known.
   * @returns {BuiltWindowCommand[]}
   */
  buildCommands()
  {

    // TODO: implement the tracking so that we can grab tracked quest data.


    // grab all valid enemies.
    const questEntries = $gameParty.getQuestopediaEntries();

    // compile the list of commands.
    const commands = questEntries.map(this.buildCommand, this);

    // return the compiled list of commands.
    return commands;
  }

  /**
   * Builds a {@link BuiltWindowCommand} based on the quest data.
   * @param {TrackedOmniQuest} questopediaEntry The quest data.
   * @returns {BuiltWindowCommand} The built command based on this quest.
   */
  buildCommand(questopediaEntry)
  {
    // build a command based on the enemy.
    return new WindowCommandBuilder(questopediaEntry.name())
      .setSymbol(questopediaEntry.key)
      .setExtensionData(questopediaEntry)
      .setIconIndex(this.determineQuestStateIcon(questopediaEntry))
      .build();
  }

  /**
   * Translates a quest entry's state into the icon.
   * @param {TrackedOmniQuest} questopediaEntry The quest data.
   */
  determineQuestStateIcon(questopediaEntry)
  {
    switch (questopediaEntry.state)
    {
      // TODO: parameterize this.
      case OmniQuest.States.Unknown:
        return 93;
      case OmniQuest.States.Active:
        return 92;
      case OmniQuest.States.Completed:
        return 91;
      case OmniQuest.States.Failed:
        return 90;
      case OmniQuest.States.Missed:
        return 95;
    }
  }
}

//endregion Window_QuestopediaList

class Window_QuestopediaObjectives extends Window_Command
{
}