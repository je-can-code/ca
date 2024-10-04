//region DestinationData
/**
 * The data representing the fulfillment requirements for destination-based objectives.
 */
class DestinationData
{
  mapId = -1;
  x1 = -1;
  y1 = -1;
  x2 = -1;
  y2 = -1;
}
//endregion DestinationData

//region FetchData
/**
 * The data representing the fulfillment requirements for fetch-based objectives.
 */
class FetchData
{
  type = -1;
  id = -1;
  amount = 0;
}

//endregion FetchData

//region IndiscriminateData
/**
 * The data representing the fulfillment requirements for indiscriminate objectives.
 */
class IndiscriminateData
{
  hint = null;
}

//endregion IndiscriminateData

//region QuestData
/**
 * The data representing the fulfillment requirements for quest-based objectives.
 */
class QuestData
{
  keys = [];
}

//endregion QuestData

//region SlayData
/**
 * The data representing the fulfillment requirements for slay-based objectives.
 */
class SlayData
{
  id = -1;
  amount = 0;
}
//endregion SlayData

//region OmniCategory
/**
 * A class representing the data shape of a single category a quest can belong to.
 */
class OmniCategory
{
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
  constructor(key, name, iconIndex)
  {
    this.key = key;
    this.name = name;
    this.iconIndex = iconIndex;
  }
}
//endregion OmniCategory

//region OmniConfiguration
/**
 * A class representing the data shape of the Questopedia configuration.
 */
class OmniConfiguration
{
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
  constructor(quests, tags, categories)
  {
    this.quests = quests;
    this.tags = tags;
    this.categories = categories;
  }
}

//endregion OmniConfiguration

//region OmniFulfillment
/**
 * A class representing the data shape of the fulfillment requirements for a single objective on a quest.
 */
class OmniFulfillmentData
{
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
  constructor(indiscriminate = null, destination = null, fetch = null, slay = null, quest = null)
  {
    this.indiscriminate = indiscriminate ?? new IndiscriminateData();
    this.destination = destination ?? new DestinationData(-1, -1, -1, -1, -1);
    this.fetch = fetch ?? new FetchData(OmniObjectiveFetchType.Unset, 0, 0);
    this.slay = slay ?? new SlayData(0, 0);
    this.quest = quest ?? new QuestData([]);
  }
}

//endregion OmniFulfillment

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
    Quest: "Quest",
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
    Missed: 4,
  }

  static FetchTypes = {
    Item: "Item",
    Weapon: "Weapon",
    Armor: "Armor",
  }

  //region properties
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

  //endregion properties

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
  constructor(
    id,
    type,
    description,
    logs,
    fulfillment,
    hiddenByDefault = true,
    isOptional = false)
  {
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
        return `Navigate to ${templateDetails.at(0)} at [${templateDetails.at(1)}, ${templateDetails.at(2)}].`;

      case OmniObjective.Types.Fetch:
        return `Acquire \\*${templateDetails.at(0)}\\* ${templateDetails.at(1)}.`;

      case OmniObjective.Types.Slay:
        return `Defeat \\*${templateDetails.at(0)}\\* \\Enemy[${templateDetails.at(1)}].`;

      case OmniObjective.Types.Quest:
        return `Complete the other quest(s): ${templateDetails.at(0)}.`;

      default:
        return 'This objective is not defined.';
    }

  }
}

//endregion OmniObjective

//region OmniObjectiveLogs
/**
 * A class representing the data shape of the various log messages associated with the state of an objective. These will
 * reflect in the quest log when reviewing the quest in question.
 */
class OmniObjectiveLogs
{
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
  constructor(unknown, discovered, completed, failed, missed)
  {
    this.inactive = unknown;
    this.active = discovered;
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
   *     Inactive: 0
   *     Active: 1
   *     Completed: 2
   *     Failed: 3
   *     Missed: 4
   * </pre>
   */
  static States = {
    /**
     * When a quest is in the "inactive" state, it means it has yet to be discovered by the player so it will not show up
     * in the questopedia by its name or reveal any objectives, but instead reveal only a general "this is where this
     * quest can be found/unlocked", if anything at all.
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
    Missed: 4,
  }

  /**
   * Converts a string descriptor of a quest state to its numeric counterpart.
   * @param {string} questStateDescriptor
   * @returns {number}
   * @constructor
   */
  static FromStringToStateId = questStateDescriptor =>
  {
    switch (questStateDescriptor.toLowerCase())
    {
      case "inactive":
        return OmniQuest.States.Inactive;
      case "active":
        return OmniQuest.States.Active;
      case "completed":
        return OmniQuest.States.Completed;
      case "failed":
        return OmniQuest.States.Failed;
      case "missed":
        return OmniQuest.States.Missed;
      default:
        throw new Error(`unknown quest state being translated: ${questStateDescriptor}`);
    }
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
  constructor(name, key, categoryKey, tagKeys, unknownHint, overview, recommendedLevel, objectives)
  {
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
  #tagKeys = Array.empty;
  #unknownHint = String.empty;
  #overview = String.empty;
  #recommendedLevel = 0;
  #objectives = Array.empty;

  build()
  {
    const omniquest = new OmniQuest(
      this.#name,
      this.#key,
      this.#categoryKey,
      this.#tagKeys,
      this.#unknownHint,
      this.#overview,
      this.#recommendedLevel,
      this.#objectives);
    this.clear();
    return omniquest;
  }

  clear()
  {
    this.#name = String.empty;
    this.#key = String.empty;
    this.#categoryKey = Array.empty;
    this.#tagKeys = Array.empty;
    this.#unknownHint = String.empty;
    this.#overview = String.empty;
    this.#recommendedLevel = 0;
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

  categoryKey(categoryKeys)
  {
    this.#categoryKey = categoryKeys;
    return this;
  }

  tagKeys(tagKeys)
  {
    this.#tagKeys = tagKeys;
    return this;
  }

  unknownHint(unknownHint)
  {
    this.#unknownHint = unknownHint;
    return this;
  }

  overview(overview)
  {
    this.#overview = overview;
    return this;
  }

  recommendedLevel(recommendedLevel)
  {
    this.#recommendedLevel = recommendedLevel;
    return this;
  }

  objectives(objectives)
  {
    this.#objectives = objectives;
    return this;
  }
}

//endregion OmniQuestBuilder

//region OmniConditional
class OmniConditional
{
  questKey = String.empty;
  objectiveId = null;
  state = 0;

  constructor(questKey, objectiveId = null, state = OmniQuest.States.Active)
  {
    this.questKey = questKey;
    this.objectiveId = objectiveId;
    this.state = state;
  }
}
//endregion OmniConditional

//region OmniTag
/**
 * A class representing the data shape of a single tag a quest can be associated with.
 */
class OmniTag
{
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
   * The description of the tag.
   * @type {string}
   */
  description = String.empty;

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
  constructor(key, name, iconIndex)
  {
    this.key = key;
    this.name = name;
    this.iconIndex = iconIndex;
  }
}
//endregion OmniTag

//region TrackedOmniObjective
/**
 * A class representing the tracking for a single objective of a quest.
 */
function TrackedOmniObjective(questKey, id, omniFulfillmentData, hidden, optional)
{
  this.initialize(questKey, id, omniFulfillmentData, hidden, optional);
}

TrackedOmniObjective.prototype = {};
TrackedOmniObjective.prototype.constructor = TrackedOmniObjective;

//region init
/**
 * Initialize an objective tracker for an quest.
 * @param {number} id The id of this objective.
 * @param {string} questKey The key of the quest that owns this objective.
 * @param {OmniFulfillmentData} omniFulfillmentData The extraneous data on how this objective is to be fulfilled.
 * @param {boolean} hidden Whether or not this objective is hidden.
 * @param {boolean} optional Whether or not this objective is optional for its parent quest.
 */
TrackedOmniObjective.prototype.initialize = function(questKey, id, omniFulfillmentData, hidden, optional)
{
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
};

/**
 * Initialize the fulfillment data properties to default values.
 */
TrackedOmniObjective.prototype.initializeFulfillmentData = function()
{
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
};

/**
 * Populates the this objective's fulfillment requirements.
 * @param {OmniFulfillmentData} omniFulfillmentData
 */
TrackedOmniObjective.prototype.populateFulfillmentData = function(omniFulfillmentData)
{
  // pivot based on the type of objective this is from the metadata.
  switch (this.type())
  {
    // if the type is indiscriminate, then it is event-controlled and not automagical.
    case OmniObjective.Types.Indiscriminate:
      this._indiscriminateTargetData = omniFulfillmentData.indiscriminate.hint ?? "No indiscriminate objective instructions provided.";
      return;

    // if the fulfillment is of type 'destination', then fill in the data.
    case OmniObjective.Types.Destination:
      const { mapId, x1, y1, x2, y2 } = omniFulfillmentData.destination;
      this._targetMapId = mapId;
      const point1 = [ x1, y1 ];
      const point2 = [ x2, y2 ];
      this._targetCoordinateRange.push(point1, point2);
      break;

    // if the fulfillment is of type 'fetch', then fill in the data.
    case OmniObjective.Types.Fetch:
      this._targetItemType = omniFulfillmentData.fetch.type;
      this._targetItemId = omniFulfillmentData.fetch.id;
      this._targetItemFetchQuantity = omniFulfillmentData.fetch.amount;
      break;

    // if the fulfillment is of type 'slay', then fill in the data.
    case OmniObjective.Types.Slay:
      this._targetEnemyId = omniFulfillmentData.slay.id;
      this._targetEnemyAmount = omniFulfillmentData.slay.amount;
      break;

    // if the fulfillment is of type 'quest', then fill in the data.
    case OmniObjective.Types.Quest:
      this._targetQuestKeys.push(omniFulfillmentData.quest.keys);
      break;
  }
};
//endregion init

//region state check
/**
 * Returns whether or not this objective has moved beyond being {@link OmniObjective.States.Inactive}.
 * @returns {boolean}
 */
TrackedOmniObjective.prototype.isKnown = function()
{
  // objectives that are inactive but NOT hidden are "known".
  if (!this.hidden && this.isInactive()) return true;

  // objectives that have been at least started or even finished count as "known".
  if (!this.isInactive()) return true;

  // the objective is unknown at this time.
  return false;
};

/**
 * Returns whether or not this objective has had some form of finalization from another state. This most commonly will
 * be completed, failed, or missed.
 * @returns {boolean}
 */
TrackedOmniObjective.prototype.isFinalized = function()
{
  // completed/failed/missed are all forms of finalization.
  if (this.isCompleted()) return true;
  if (this.isFailed()) return true;
  if (this.isMissed()) return true;

  // active/inactive are not considered finalized.
  return false;
};

/**
 * Returns whether or not this objective is {@link OmniObjective.States.Inactive}.
 * @returns {boolean}
 */
TrackedOmniObjective.prototype.isInactive = function()
{
  return this.state === OmniObjective.States.Inactive;
};

/**
 * Returns whether or not this objective is {@link OmniObjective.States.Active}.
 * @returns {boolean}
 */
TrackedOmniObjective.prototype.isActive = function()
{
  return this.state === OmniObjective.States.Active;
};

/**
 * Returns whether or not this objective is {@link OmniObjective.States.Completed}.
 * @returns {boolean}
 */
TrackedOmniObjective.prototype.isCompleted = function()
{
  return this.state === OmniObjective.States.Completed;
};

/**
 * Returns whether or not this objective is {@link OmniObjective.States.Failed}.
 * @returns {boolean}
 */
TrackedOmniObjective.prototype.isFailed = function()
{
  return this.state === OmniObjective.States.Failed;
};

/**
 * Returns whether or not this objective is {@link OmniObjective.States.Missed}.
 * @returns {boolean}
 */
TrackedOmniObjective.prototype.isMissed = function()
{
  return this.state === OmniObjective.States.Missed;
};

/**
 * Returns whether or not this objective is hidden.<br/>
 * Objectives that are NOT hidden will show up in the questopedia and can be completed to activate the owning quest.
 * @returns {boolean}
 */
TrackedOmniObjective.prototype.isHidden = function()
{
  return this.hidden === true;
};

/**
 * Determines whether or not this objective is valid in the sense that it can be updated and completed.
 * @param {OmniObjective.Types} targetType One of the {@link OmniObjective.Types} to validate against.
 * @returns {boolean}
 */
TrackedOmniObjective.prototype.isValid = function(targetType)
{
  // cannot execute on objectives that have already been finalized.
  if (this.isCompleted() || this.isFailed() || this.isMissed()) return false;

  // cannot execute on non-active objectives if they are hidden.
  if (!this.isActive() && this.isHidden()) return false;

  // make sure the types match.
  return this.type() === targetType;
};

/**
 * Check if this objective is fulfilled- whatever type that it is.
 * @returns {boolean}
 */
TrackedOmniObjective.prototype.isFulfilled = function()
{
  switch (this.type())
  {
    // indiscriminate quests can only be completed manually by the developer and can't programmatically be fulfilled.
    case OmniObjective.Types.Indiscriminate:
      return false;

    case OmniObjective.Types.Destination:
      return this.isPlayerWithinDestinationRange();

    case OmniObjective.Types.Fetch:
      this.synchronizeFetchTargetItemQuantity();
      return this.hasFetchedEnoughItems();

    case OmniObjective.Types.Slay:
      return this.hasSlainEnoughEnemies();

    case OmniObjective.Types.Quest:
      return this.hasCompletedAllQuests();
  }
};
//endregion state check

//region metadata
/**
 * Gets the metadata for the quest that owns this objective.
 * @returns {OmniQuest}
 */
TrackedOmniObjective.prototype.parentQuestMetadata = function()
{
  return J.OMNI.EXT.QUEST.Metadata.questsMap.get(this.questKey);
};

/**
 * Gets the metadata for this objective.
 * @returns {OmniObjective}
 */
TrackedOmniObjective.prototype.objectiveMetadata = function()
{
  return this.parentQuestMetadata()
    .objectives
    .at(this.id);
};

/**
 * Gets the description of this objective.
 * @returns {string}
 */
TrackedOmniObjective.prototype.description = function()
{
  const { description } = this.objectiveMetadata();
  return description;
};
//endregion metadata

/**
 * Gets the log represented by the current state of this objective.
 * @returns {string}
 */
TrackedOmniObjective.prototype.log = function()
{
  // deconstruct the logs out of the metadata.
  const { inactive, active, completed, failed, missed } = this.objectiveMetadata().logs;

  switch (this.state)
  {
    case OmniObjective.States.Inactive:
      return inactive;

    case OmniObjective.States.Active:
      return active;

    case OmniObjective.States.Completed:
      return completed;

    case OmniObjective.States.Failed:
      return failed;

    case OmniObjective.States.Missed:
      return missed;
  }
};

/**
 * Gets the type of objective this is to determine how it must be fulfilled.
 * @returns {OmniObjective.Types}
 */
TrackedOmniObjective.prototype.type = function()
{
  const { type } = this.objectiveMetadata();
  return type;
};

/**
 * Gets the textual description of what it takes to fulfill the objective based on its type.
 * @returns {string}
 */
TrackedOmniObjective.prototype.fulfillmentText = function()
{
  const enoughColor = 24; //ColorManager.powerUpColor();
  const notEnoughColor = 25; //ColorManager.powerDownColor();

  switch (this.type())
  {
    case OmniObjective.Types.Indiscriminate:
      return OmniObjective.FulfillmentTemplate(this.type(), this._indiscriminateTargetData);

    case OmniObjective.Types.Destination:
      // TODO: validate this stringifies as intended.
      const point1 = `${this._targetCoordinateRange.at(0)}`;
      const point2 = `${this._targetCoordinateRange.at(1)}`;
      return OmniObjective.FulfillmentTemplate(this.type(), $gameMap.displayName(), point1, point2);

    case OmniObjective.Types.Fetch:
      const fetchColor = (this._currentItemFetchQuantity < this._targetItemFetchQuantity)
        ? notEnoughColor
        : enoughColor;

      const targetItemText = `${this.fetchDataSourceTextPrefix()}[${this._targetItemId}]`;
      const quantity = `\\C[${fetchColor}]${this._currentItemFetchQuantity} / ${this._targetItemFetchQuantity}\\C[0]`;
      return OmniObjective.FulfillmentTemplate(this.type(), quantity, targetItemText);

    case OmniObjective.Types.Slay:
      const slayColor = (this._currentEnemyAmount < this._targetEnemyAmount)
        ? notEnoughColor
        : enoughColor;
      const targetEnemyText = `\\C[${slayColor}]${this._currentEnemyAmount} / ${this._targetEnemyAmount}\\C[0]`;
      const template = OmniObjective.FulfillmentTemplate(this.type(), targetEnemyText, this._targetEnemyId);
      return template;

    case OmniObjective.Types.Quest:
      const questNames = this._targetQuestKeys
        .map(questKey => `'\\quest[${questKey}]'`);
      const questNamesWithCommas = questNames.join(', ');
      return OmniObjective.FulfillmentTemplate(this.type(), questNamesWithCommas);
  }
};

/**
 * Gets the icon index derived from the state of this objective.
 * @returns {number}
 */
TrackedOmniObjective.prototype.iconIndexByState = function()
{
  switch (this.state)
  {
    // TODO: parameterize this.
    case OmniObjective.States.Inactive:
      return 93;
    case OmniObjective.States.Active:
      return 92;
    case OmniObjective.States.Completed:
      return 91;
    case OmniObjective.States.Failed:
      return 90;
    case OmniObjective.States.Missed:
      return 95;
  }
};

/**
 * Changes the state of this objective to a new state and processes the {@link onObjectiveUpdate} hook. If the state
 * does not actually change to something new, the hook will not trigger.
 * @param {number} newState The new {@link OmniObjective.States} to set this state to.
 */
TrackedOmniObjective.prototype.setState = function(newState)
{
  // check if the state actually differed.
  if (this.state !== newState)
  {
    // apply the changed state.
    this.state = newState;

    // notify a change happened with this objective.
    this.onObjectiveUpdate();
  }
};

//region destination data
/**
 * Gets the destination data for this objective. The response shape will contain the mapId, and the coordinate range.
 * <pre>
 *     [ mapId, [[x1,y1], [x2,y2]] ]
 * </pre>
 * @returns {[number,[[number,number],[number,number]]]}
 */
TrackedOmniObjective.prototype.destinationData = function()
{
  return [
    this._targetMapId, this._targetCoordinateRange ];
};

/**
 * Checks if the player is presently standing within the rectangle derived from the coordinate range for this objective.
 */
TrackedOmniObjective.prototype.isPlayerWithinDestinationRange = function()
{
  // grab the coordinate range from this objective.
  const [ mapId, range ] = this.destinationData();

  // validate the map is the correct map before assessing coordinates.
  if ($gameMap.mapId() !== mapId) return false;

  // deconstruct the points from the coordinate range.
  const [ x1, y1 ] = range.at(0);
  const [ x2, y2 ] = range.at(1);

  // identify the location of the player.
  const playerX = $gamePlayer.x;
  const playerY = $gamePlayer.y;

  // check if the player within the coordinate range.
  const isInCoordinateRange = playerX >= x1 && playerX <= x2 && playerY >= y1 && playerY <= y2;

  // process the event hook.
  this.onObjectiveUpdate();

  // return our findings.
  return isInCoordinateRange;
};
//endregion destination data

//region fetch data
/**
 * The data points associated with fetch-related objectives.
 * @returns {[number,number]}
 */
TrackedOmniObjective.prototype.fetchData = function()
{
  return [
    this._targetItemId, this._targetItemFetchQuantity ];
};

/**
 * Determines whether or not the given item is the target of this fetch objective.
 * @param {RPG_Item|RPG_Weapon|RPG_Armor} entry
 * @returns {boolean}
 */
TrackedOmniObjective.prototype.isFetchTarget = function(entry)
{
  // identify the type of objective this is.
  const objectiveType = this.type();

  // if this isn't a fetch objective, then it'll never be a fetch target.
  if (objectiveType !== OmniObjective.Types.Fetch) return false;

  // validate the target item type aligns with the corresponding entry.
  if (this._targetItemType === 0 && !entry.isItem()) return false;
  if (this._targetItemType === 1 && !entry.isWeapon()) return false;
  if (this._targetItemType === 2 && !entry.isArmor()) return false;

  // check if the id matches the target item id.
  return entry.id === this._targetItemId;
};

/**
 * Gets the escape code for displaying text in a window based on the given target item type to fetch.
 * @returns {string}
 */
TrackedOmniObjective.prototype.fetchDataSourceTextPrefix = function()
{
  switch (this._targetItemType)
  {
    case OmniObjective.FetchTypes.Item:
      return `\\Item`;
    case OmniObjective.FetchTypes.Weapon:
      return `\\Weapon`;
    case OmniObjective.FetchTypes.Armor:
      return `\\Armor`;
    default:
      throw new Error(`unknown target item type: ${this._targetItemType}`);
  }
};

/**
 * Returns the datasource of the fetch objective data.
 * @returns {RPG_Item[]|RPG_Weapon[]|RPG_Armor[]}
 */
TrackedOmniObjective.prototype.fetchItemDataSource = function()
{
  switch (this._targetItemType)
  {
    case OmniObjective.FetchTypes.Item:
      return $dataItems;
    case OmniObjective.FetchTypes.Weapon:
      return $dataWeapons;
    case OmniObjective.FetchTypes.Armor:
      return $dataArmors;
    default:
      throw new Error(`unknown target item type: ${this._targetItemType}`);
  }
};

/**
 * Synchronizes the number of items the player has in their possession with this objective.
 */
TrackedOmniObjective.prototype.synchronizeFetchTargetItemQuantity = function()
{
  // determine the current amount of the item in possession.
  const targetDataSource = this.fetchItemDataSource();
  const targetItem = targetDataSource.at(this._targetItemId);
  const targetItemQuantity = $gameParty.numItems(targetItem);

  // align the tracked amount with the actual amount.
  this._currentItemFetchQuantity = targetItemQuantity;

  // process the event hook.
  this.onObjectiveUpdate();
};

/**
 * Checks whether or not the player has collected enough of the target fetched item. This always returns false for
 * objectives that are not of type {@link OmniObjective.Types.Fetch}.
 * @returns {boolean}
 */
TrackedOmniObjective.prototype.hasFetchedEnoughItems = function()
{
  // non-fetch objectives can never fetch enough items.
  if (this.type() !== OmniObjective.Types.Fetch) return false;

  // return the evaluation.
  return this._currentItemFetchQuantity >= this._targetItemFetchQuantity;
};
//endregion fetch data

//region slay data
/**
 * The data points associated with slay-related objectives.
 * @returns {[number,number]}
 */
TrackedOmniObjective.prototype.slayData = function()
{
  return [
    this._targetEnemyId, this._targetEnemyAmount ];
};

/**
 * Increments the counter for how many of the required enemies the player has slain.
 */
TrackedOmniObjective.prototype.incrementSlayTargetEnemyAmount = function()
{
  // we increment by +1 in this land.
  this._currentEnemyAmount++;

  // process the event hook.
  this.onObjectiveUpdate();
};

/**
 * Checks whether or not the player has collected enough of the target fetched item. This always returns false for
 * objectives that are not of type {@link OmniObjective.Types.Fetch}.
 * @returns {boolean}
 */
TrackedOmniObjective.prototype.hasSlainEnoughEnemies = function()
{
  // non-fetch objectives can never fetch enough items.
  if (this.type() !== OmniObjective.Types.Slay) return false;

  // return the evaluation.
  return this._currentEnemyAmount >= this._targetEnemyAmount;
};
//endregion slay data

//region quest completion data
TrackedOmniObjective.prototype.questCompletionData = function()
{
  return this._targetQuestKeys;
};

TrackedOmniObjective.prototype.hasCompletedAllQuests = function()
{
  // grab all the quest keys for this objective.
  const requiredQuestKeys = this.questCompletionData();

  // if there are no keys, then technically there are no quests to complete for this quest complete objective.
  if (requiredQuestKeys.length === 0) return true;

  // validate all required quests have been completed.
  return requiredQuestKeys
    .every(requiredQuestKey => QuestManager.quest(requiredQuestKey)
      .isCompleted())
};
//endregion quest completion data

/**
 * An event hook for when objective progress is updated, like an enemy is slain for the objective or an item is
 * acquired towards the fetch goal.
 */
TrackedOmniObjective.prototype.onObjectiveUpdate = function()
{
};

//endregion TrackedOmniObjective

//region TrackedOmniQuest
/**
 * A class representing the tracking for a single quest.
 */
function TrackedOmniQuest(key, categoryKey, objectives)
{
  this.initialize(key, categoryKey, objectives);
}

TrackedOmniQuest.prototype = {};
TrackedOmniQuest.prototype.constructor = TrackedOmniQuest;

/**
 * Initialize a tracker for a quest.
 * @param {string} key The primary key of this quest.
 * @param {string} categoryKey The category key of this quest.
 * @param {TrackedOmniObjective[]} objectives The various objectives required to complete this quest.
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
   * The various objectives that can/must be fulfilled in order to complete the quest. These are sorted by id from
   * lowest to highest, indicating sequence.
   * @type {TrackedOmniObjective[]}
   */
  this.objectives = objectives.sort((a, b) => a.id - b.id);

  this.initMembers();
};

/**
 * Initialize all members of this quest.
 */
TrackedOmniQuest.prototype.initMembers = function()
{
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
};

/**
 * Determines whether or not this quest can be tracked.
 * @returns {boolean}
 */
TrackedOmniQuest.prototype.canBeTracked = function()
{
  // quests that are currently active can always be tracked.
  if (this.isActive()) return true;

  // quests that are inactive, but have hidden objectives can be tracked.
  return this.objectives.some(objective => !objective.isHidden());
};

/**
 * Whether or not this quest is being tracked.
 * @returns {boolean}
 */
TrackedOmniQuest.prototype.isTracked = function()
{
  return this.tracked === true || this.tracked === "true";
};

/**
 * Toggles whether or not the quest is being tracked.
 * @param {?boolean} forcedState If provided, then will force tracking to the designated boolean.
 */
TrackedOmniQuest.prototype.toggleTracked = function(forcedState = null)
{
  // check if providing a forced value to track.
  if (forcedState !== null)
  {
    // set the quest to the forced state.
    this.tracked = forcedState;
    
    // stop processing.
    return;
  }
  
  // toggle the quest's tracking state.
  this.tracked = !this.tracked;
};

//region metadata
/**
 * Gets the metadata for this {@link TrackedOmniQuest}.
 * @returns {OmniQuest}
 */
TrackedOmniQuest.prototype.questMetadata = function()
{
  return J.OMNI.EXT.QUEST.Metadata.questsMap.get(this.key);
};

/**
 * The name of the quest- but its computed since its just read from the data file.
 * @returns {string} The name of the quest from the data source.
 */
TrackedOmniQuest.prototype.name = function()
{
  const { name } = this.questMetadata();
  return name;
};

/**
 * The recommended level for the quest- but its computed since its just read from the data file.
 * @returns {number} The recommended level to complete the quest.
 */
TrackedOmniQuest.prototype.recommendedLevel = function()
{
  const { recommendedLevel } = this.questMetadata();
  return recommendedLevel;
};

/**
 * The tag keys on the quest- but its computed since its just read from the data file.
 * @returns {string[]} The tag keys associated with the quest.
 */
TrackedOmniQuest.prototype.tagKeys = function()
{
  const { tagKeys } = this.questMetadata();
  return tagKeys ?? [];
};

/**
 * Gets the {@link OmniTag}s that correspond with the tag keys on the quest.
 * @returns {OmniTag[]}
 */
TrackedOmniQuest.prototype.tags = function()
{
  return this.tagKeys()
    .map(tagKey => J.OMNI.EXT.QUEST.Metadata.tagsMap.get(tagKey));
};

/**
 * Gets the hint provided when a quest has yet to be discovered.
 * @returns {string}
 */
TrackedOmniQuest.prototype.unknownHint = function()
{
  const { unknownHint } = this.questMetadata();
  return unknownHint;
};

/**
 * The journaling of the quest- but its computed since its a combination of all started objectives' descriptions that
 * are just read from the data file.
 * @returns {string[]}
 */
TrackedOmniQuest.prototype.overview = function()
{
  const { overview } = this.questMetadata();
  return overview;
};
//endregion metadata

//region state check
/**
 * Check if the target objective by its id is completed already. This falls back to the immediate, or the first if no
 * objective id was provided.
 * @param {?number} objectiveId The objective id to check for completion.
 * @returns {boolean}
 */
TrackedOmniQuest.prototype.isObjectiveCompleted = function(objectiveId = null)
{
  return this.isObjectiveInState(OmniObjective.States.Completed, objectiveId);
};

/**
 * Check if an objective is the specified state.
 * @param {number} targetState The state from {@link OmniObjective.States} to check if the objective is in.
 * @param {?number} objectiveId The objective id to check the state of; falls back to immediate >> first.
 * @returns {boolean} True if the objective is in the specified state, false otherwise.
 */
TrackedOmniQuest.prototype.isObjectiveInState = function(targetState, objectiveId = null)
{
  // if no objectiveId is provided, then assume: immediate >> first.
  const actualObjectiveId = this.getFallbackObjectiveId(objectiveId);

  // get either the objective of the id provided, or the immediate objective.
  const objective = this.objectives.find(objective => objective.id === actualObjectiveId);

  // validate we have an objective.
  if (objective)
  {
    // return whether or not the state of this objective matches.
    return objective.state === targetState;
  }

  // the objective didn't exist, so the state won't match, period.
  return false;
};

/**
 * Determines whether or not an objective is able to be executed. This does not consider the state of the quest itself,
 * only the objective. If no objective id is provided, then the fallback will be referred to.
 * @param {?number} objectiveId The id of the objective to interrogate.
 * @returns {boolean}
 */
TrackedOmniQuest.prototype.canExecuteObjectiveById = function(objectiveId = null)
{
  // if no objectiveId is provided, then assume: immediate >> first.
  const actualObjectiveId = this.getFallbackObjectiveId(objectiveId);

  // get either the objective of the id provided, or the immediate objective.
  const objective = this.objectives.find(objective => objective.id === actualObjectiveId);

  // validate the objective in question is in the state of active, regardless of the quest.
  return objective?.state === OmniObjective.States.Active;
};

/**
 * A "known" quest is one that is no longer undiscovered/inactive. This includes completed/failed/missed quests.
 * @returns {boolean}
 */
TrackedOmniQuest.prototype.isKnown = function()
{
  return !this.isInactive();
};

/**
 * An {@link OmniQuest.States.Inactive} quest is one that has yet to be unlocked/discovered by the player.
 * @returns {boolean}
 */
TrackedOmniQuest.prototype.isInactive = function()
{
  return this.isInState(OmniQuest.States.Inactive);
};

/**
 * An {@link OmniQuest.States.Active} quest is one that has already been unlocked/discovered by the player.
 * @returns {boolean}
 */
TrackedOmniQuest.prototype.isActive = function()
{
  return this.isInState(OmniQuest.States.Active);
};

/**
 * A {@link OmniQuest.States.Completed} quest is one that had all of its objectives completed with some possibly missed.
 * This is considered a finalized state.
 * @returns {boolean}
 */
TrackedOmniQuest.prototype.isCompleted = function()
{
  return this.isInState(OmniQuest.States.Completed);
};

/**
 * A {@link OmniQuest.States.Failed} quest is one that had one or more of its objectives placed into a failed state.
 * This is considered a finalized state.
 * @returns {boolean}
 */
TrackedOmniQuest.prototype.isFailed = function()
{
  return this.isInState(OmniQuest.States.Failed);
};

/**
 * A {@link OmniQuest.States.Missed} quest is one that had one or more of its objectives placed into a missed state, and
 * none of the objectives marked as completed. This most likely will happen to a quest that may or may not have a
 * non-hidden objective to the player but the objective was never completed resulting in the quest being missed.
 * @returns {boolean}
 */
TrackedOmniQuest.prototype.isMissed = function()
{
  return this.isInState(OmniQuest.States.Missed);
};

/**
 * A "Finalized" quest is one that has been completed/failed/missed.
 * @returns {boolean}
 */
TrackedOmniQuest.prototype.isFinalized = function()
{
  // completed/failed/missed are all forms of finalization.
  if (this.isCompleted()) return true;
  if (this.isFailed()) return true;
  if (this.isMissed()) return true;

  // active/inactive are not considered finalized.
  return false;
};

/**
 * Checks if the quest is in a particular {@link OmniQuest.States}.
 * @param {number} targetState The {@link OmniQuest.States} to compare the current state against.
 * @returns {boolean}
 */
TrackedOmniQuest.prototype.isInState = function(targetState)
{
  return this.state === targetState;
};
//endregion state check

//region actions
/**
 * Unlocks this quest and actives the target objective. If no objectiveId is provided, then the first objective will be
 * made {@link OmniObjective.States.Active}.
 * @param {?number} objectiveId The id of the objective to initialize as active; defaults to the immediate or first.
 */
TrackedOmniQuest.prototype.unlock = function(objectiveId = null)
{
  // validate this quest can be unlocked.
  if (!this.canBeUnlocked())
  {
    console.warn(`Attempted to unlock quest with key ${this.key}, but it cannot be unlocked from state ${this.state}.`);
    return;
  }

  // active the target objective- though one likely won't be provided, activating the first objective in the quest.
  this.flagObjectiveAsActive(objectiveId);

  // refresh the state of the quest.
  this.refreshState();
};

/**
 * Resets this quest back to being completely unknown.<br/>
 * Note that objectives that are still not-hidden will be visible.
 */
TrackedOmniQuest.prototype.reset = function()
{
  // revert the quest to unknown.
  this.state = OmniObjective.States.Unknown;

  // revert all the objectives to inactive.
  this.objectives.forEach(objective => objective.state = OmniObjective.States.Inactive);
};

/**
 * Determines whether or not the quest can be unlocked.
 * @returns {boolean}
 */
TrackedOmniQuest.prototype.canBeUnlocked = function()
{
  // only not-yet-unlocked quests can be unlocked.
  if (this.isKnown()) return false;

  // the quest can be unlocked.
  return true;
};

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
TrackedOmniQuest.prototype.progressObjectives = function()
{
  // grab all the active objectives.
  const activeObjectives = this.activeObjectives();

  // there could be multiple active objectives.
  if (activeObjectives.length > 1)
  {
    // don't complete them, they must be completed individually!
    console.warn(`multiple quest objectives are currently active and must be finalized manually by id.`);
    return;
  }

  // check if there is only one- this is probably the most common.
  if (activeObjectives.length === 1)
  {
    // complete the objective.
    const objectiveId = activeObjectives.at(0).id;
    this.flagObjectiveAsCompleted(objectiveId);
  }

  // NOTE: at this point, we should have zero active objectives, so we should seek to activate the next one in sequence.

  // fast-forward through the quest objectives as-necessary.
  this._fastForwardToNextObjective();
};

/**
 * Fast-forwards to the next objective in the list and changes it from inactive to active. If the newly activated
 * objective is completable immediately, complete it and keep taking one more inactive objective sequentially until we
 * stop immediately completing them and leave the player with an active objective on the quest, or by running out of
 * inactive objectives to activate translating to the quest being officially complete.
 */
TrackedOmniQuest.prototype._fastForwardToNextObjective = function()
{
  let needsNextObjective = false;
  do
  {
    // identify the sequentially-next inactive objective in the quest.
    const nextObjective = this.objectives.find(objective => objective.state === OmniObjective.States.Inactive);

    // validate there was a next objective.
    if (nextObjective)
    {
      // check if the objective is fulfilled already.
      if (nextObjective.isFulfilled())
      {
        // flag it as completed and cycle to the next one.
        this.flagObjectiveAsCompleted(nextObjective.id);
        needsNextObjective = true;
      }
      // the objective hasn't already been fulfilled, so lets activate it.
      else
      {
        // flag it as active and stop looking for a next objective.
        this.flagObjectiveAsActive(nextObjective.id);
        needsNextObjective = false;
      }
    }
    // we have no available next inactive objective.
    else
    {
      // stop looping.
      needsNextObjective = false;
    }
  }
    // keep taking one objective while we have them- one must be active!
  while (needsNextObjective);

  // check if there are any additional active objectives.
  const hasAnymoreActiveObjectives = this.objectives.some(objective => objective.isActive());

  // if there are still active objectives, then we are done processing for now.
  if (hasAnymoreActiveObjectives) return;

  // then there were no more inactive objectives to activate, nor are there any active objectives- quest complete!
  this.flagAsCompleted();
};
//endregion actions

//region state management
/**
 * Gets all objectives currently tracked as {@link OmniObjective.States.Active}.
 * @returns {TrackedOmniObjective[]}
 */
TrackedOmniQuest.prototype.activeObjectives = function()
{
  return this.objectives
    .filter(objective => objective.state === OmniObjective.States.Active);
};

/**
 * Gets the first-most objective that is currently tracked as {@link OmniObjective.States.Active}.
 * @returns {TrackedOmniObjective}
 */
TrackedOmniQuest.prototype.immediateObjective = function()
{
  return this.activeObjectives()
    ?.at(0);
};

/**
 * Flags the given objective by its id as {@link OmniObjective.States.Active}. If no objectiveId is provided, then the
 * immediate objective will be flagged instead (that being the lowest-id active objective, if any), or the very first
 * objective will be flagged.
 * @param {?number} objectiveId The id of the objective to flag as missed; defaults to the immediate or first.
 */
TrackedOmniQuest.prototype.flagObjectiveAsActive = function(objectiveId = null)
{
  this.changeTargetObjectiveState(objectiveId, OmniObjective.States.Active);
};

/**
 * Completes the objective matching the objectiveId.
 * @param {?number} objectiveId The id of the objective to complete.
 */
TrackedOmniQuest.prototype.flagObjectiveAsCompleted = function(objectiveId = null)
{
  this.changeTargetObjectiveState(objectiveId, OmniObjective.States.Completed);
};

/**
 * Flags the given objective by its id as {@link OmniObjective.States.Missed}. If no objectiveId is provided, then the
 * immediate objective will be flagged instead (that being the lowest-id active objective, if any), or the very first
 * objective will be flagged.
 * @param {?number} objectiveId The id of the objective to flag as missed; defaults to the immediate or first.
 */
TrackedOmniQuest.prototype.flagObjectiveAsMissed = function(objectiveId = null)
{
  this.changeTargetObjectiveState(objectiveId, OmniObjective.States.Missed);
};

/**
 * Change the target objective by its id to a new state.
 * @param {number} objectiveId
 * @param {number} newState The new {@link OmniObjective.States} to change the objective to.
 */
TrackedOmniQuest.prototype.changeTargetObjectiveState = function(objectiveId, newState)
{
  // if no objectiveId is provided, then assume: immediate >> first.
  const actualObjectiveId = this.getFallbackObjectiveId(objectiveId);

  // get either the objective of the id provided, or the immediate objective.
  const objective = this.objectives.find(objective => objective.id === actualObjectiveId);

  // validate we have an objective to flag that isn't already the given state.
  if (objective && objective.state !== newState)
  {
    // flag the objective as the new state.
    objective.setState(newState);

    // refresh the state of the quest.
    this.refreshState();
  }
};

/**
 * Captures an objectiveId provided (if provided) and provides fallback options if there was no provided id. If there
 * is no id provided, then the immediate objective's id will be provided. If there is no immediate objective, then the
 * quest's first objective will be provided.
 * @param {?number} objectiveId The objective id to provide fallback options for.
 * @returns {number}
 */
TrackedOmniQuest.prototype.getFallbackObjectiveId = function(objectiveId = null)
{
  if (objectiveId !== null) return objectiveId;

  const immediate = this.immediateObjective() ?? null;
  if (immediate !== null) return immediate.id;

  return 0;
};

/**
 * Flags this quest as missed, which automatically miss all active and inactive objectives and miss the quest.
 */
TrackedOmniQuest.prototype.flagAsMissed = function()
{
  // flag all the objectives as missed.
  this.objectives.forEach(objective =>
  {
    // currently-active and yet-to-be active objectives are updated.
    if (objective.isActive() || objective.isInactive())
    {
      // flag the objective as missed.
      objective.setState(OmniObjective.States.Missed);
    }
  });

  // refresh the state resulting in the quest becoming missed.
  this.refreshState();
};

/**
 * Flags this quest as failed, which automatically fail all active and inactive objectives and fail the quest.
 */
TrackedOmniQuest.prototype.flagAsFailed = function()
{
  // flag all the objectives as missed.
  this.objectives.forEach(objective =>
  {
    // currently-active and yet-to-be active objectives are updated.
    if (objective.isActive() || objective.isInactive())
    {
      // flag the objective as failed.
      objective.setState(OmniObjective.States.Failed);
    }
  });

  // refresh the state resulting in the quest becoming failed.
  this.refreshState();
};

/**
 * Flags this quest as completed, which automatically complete all active objectives, and misses all inactive ones.
 */
TrackedOmniQuest.prototype.flagAsCompleted = function()
{
  // forcefully flag all the objectives as missed and at once.
  this.objectives.forEach(objective =>
  {
    // all remaining active objectives will be flagged as completed.
    if (objective.isActive())
    {
      objective.setState(OmniObjective.States.Completed);
    }

    // all remaining inactive objectives will be flagged as missed- but this doesn't prevent a quest from completing.
    if (objective.isInactive())
    {
      objective.setState(OmniObjective.States.Missed);
    }
  });

  // refresh the state resulting in the quest becoming completed.
  this.refreshState();

  // check if the change of state was to "completed".
  if (this.isCompleted())
  {
    // evaluate if the quest quest being completed checked any boxes.
    this._processQuestCompletionQuestsCheck();
  }
};

/**
 * Evaluate all active quest completion objectives that reside applicable to this quest.
 */
TrackedOmniQuest.prototype._processQuestCompletionQuestsCheck = function()
{
  // grab all the valid objectives.
  const activeQuestCompletionObjectives = QuestManager.getValidQuestCompletionObjectives();

  // if there are none, don't try to process this.
  if (activeQuestCompletionObjectives.length === 0) return;

  // iterate over each of the destination objectives.
  activeQuestCompletionObjectives.forEach(objective =>
  {
    // extract the coordinate range from the objective.
    const targetQuestKeys = objective.questCompletionData();

    // if the quest keys for the objective don't align, then don't worry about that quest.
    if (!targetQuestKeys.includes(this.key)) return;

    // grab the quest for reference.
    const questToProgress = QuestManager.quest(objective.questKey);

    // flag the quest objective as completed.
    questToProgress.flagObjectiveAsCompleted(objective.id);

    // progress the quest to active its next objective.
    questToProgress.progressObjectives();
  }, this);

};

/**
 * Refreshes the state of the quest based on the state of its objectives.
 */
TrackedOmniQuest.prototype.refreshState = function()
{
  // first handle the possibility that any of the objectives are failed- which fail the quest.
  const anyFailed = this.objectives.some(objective => objective.isFailed());
  if (anyFailed)
  {
    this.state = OmniQuest.States.Failed;
    return;
  }

  // second handle the possibility that all the objectives are unknown, aka this is an unknown quest still.
  const allUnknown = this.objectives.every(objective => objective.isInactive());
  if (allUnknown)
  {
    this.state = OmniQuest.States.Inactive;
    return;
  }

  // third handle the possibility that the quest is ongoing because some objectives are still active.
  const someActive = this.objectives.some(objective => objective.isActive());
  if (someActive)
  {
    this.state = OmniObjective.States.Active;
    return;
  }

  // fourth handle the possibility that the quest is completed because all objectives are complete, or missed.
  const enoughComplete = this.objectives
    .every(objective => objective.isCompleted() || objective.isMissed());
  if (enoughComplete)
  {
    this.state = OmniObjective.States.Completed;
    return;
  }

  console.info(`refreshed state without changing state for quest key: ${this.key}`);
};

/**
 * Sets the state of the quest to a designated state regardless of objectives' status. It is normally recommended to use
 * {@link #refreshState} if desiring to change state so that the objectives determine the quest state when managing the
 * state programmatically.
 * @param {number} newState The new state to set this quest to.
 */
TrackedOmniQuest.prototype.setState = function(newState)
{
  // validate your inputs!
  if (newState < 0 || newState > 4)
  {
    console.error(`Attempted to set invalid state for this quest: ${newState}.`);
    throw new Error('Invalid quest state provided for manual setting of state.');
  }

  this.state = newState;
};
//endregion state management

//endregion TrackedOmniQuest

//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 OMNI-QUEST] Extends the Omnipedia with a Questopedia entry.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-Omnipedia
 * @orderAfter J-Base
 * @orderAfter J-MessageTextCodes
 * @orderAfter J-Omnipedia
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
        .tagKeys(parsedQuest.tagKeys)
        .unknownHint(parsedQuest.unknownHint)
        .overview(parsedQuest.overview)
        .recommendedLevel(parsedQuest.recommendedLevel)
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
    /** @type {OmniConfiguration} */
    const parsedConfiguration = JSON.parse(StorageManager.fsReadFile(J_QUEST_PluginMetadata.CONFIG_PATH));
    if (parsedConfiguration === null)
    {
      console.error('no quest configuration was found in the /data directory of the project.');
      console.error('Consider adding configuration using the J-MZ data editor, or hand-writing one.');
      throw new Error('OmniQuest plugin is being used, but no config file is present.');
    }

    // classify each panel to skip ones that invalid or not applicable.
    const classifiedQuests = J_QUEST_PluginMetadata.classifyQuests(parsedConfiguration.quests);

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

    /**
     * A collection of all defined quest categories.
     * @type {OmniCategory[]}
     */
    this.categories = parsedConfiguration.categories;

    const categoryMap = new Map();
    this.categories.forEach(category => categoryMap.set(category.key, category));

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
    this.tags.forEach(tag => tagMap.set(tag.key, tag));

    /**
     * A key:questTag map of all defined tags.
     * @type {Map<string, OmniTag>}
     */
    this.tagsMap = tagMap;

    console.log(`loaded:
      - ${this.quests.length} quests
      - ${this.categories.length} categories
      - ${this.tags.length} tags
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
J.OMNI.EXT.QUEST.Aliased.Game_Enemy = new Map();
J.OMNI.EXT.QUEST.Aliased.Game_Event = new Map();
J.OMNI.EXT.QUEST.Aliased.Game_Interpreter = new Map();
J.OMNI.EXT.QUEST.Aliased.Game_Map = new Map();
J.OMNI.EXT.QUEST.Aliased.Game_Party = new Map();
J.OMNI.EXT.QUEST.Aliased.Game_System = new Map();
J.OMNI.EXT.QUEST.Aliased.JABS_InputController = new Map();
J.OMNI.EXT.QUEST.Aliased.Scene_Omnipedia = new Map();
J.OMNI.EXT.QUEST.Aliased.Window_OmnipediaList = new Map();

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
//endregion initialization

//region plugin commands
/**
 * Plugin command for unlocking quests by their keys.
 */
PluginManager.registerCommand(
  J.OMNI.EXT.QUEST.Metadata.name,
  "unlock-quests",
  args =>
  {
    const { keys } = args;
    const questKeys = JSON.parse(keys);
    questKeys.forEach(questKey => QuestManager.unlockQuestByKey(questKey));
  });

/**
 * Plugin command for progressing a quest of a given key.
 */
PluginManager.registerCommand(
    J.OMNI.EXT.QUEST.Metadata.name,
    "progress-quest",
    args =>
    {
      const { key } = args;
      QuestManager.progressQuest(key);
    });

/**
 * Plugin command for finalizing a quest of a given key with the specified state .
 */
PluginManager.registerCommand(
    J.OMNI.EXT.QUEST.Metadata.name,
    "finalize-quest",
    args =>
    {
      const { key, state } = args;
      const quest = QuestManager.quest(key);
      switch (state)
      {
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
PluginManager.registerCommand(
  J.OMNI.EXT.QUEST.Metadata.name,
  "set-quest-tracking",
  args =>
  {
    const { key, trackingState } = args;
    QuestManager.setQuestTrackingByKey(key, trackingState);
  });
//endregion plugin commands

//region JABS_InputAdapter
// only setup this shortcut key if we're using JABS.
if (J.ABS)
{
  /**
   * Calls the questopedia directly on the map.
   */
  JABS_InputAdapter.performQuestopediaAction = function()
  {
    // if we cannot call the questopedia, then do not.
    if (!this._canPerformQuestopediaAction()) return;

    // call up the menu.
    Scene_Questopedia.callScene();
  };

  /**
   * Determines whether or not the player can pull up the questopedia menu.
   * @returns {boolean}
   * @private
   */
  JABS_InputAdapter._canPerformQuestopediaAction = function()
  {
    // TODO: check if questopedia is accessible.
    return true;
  };
}
//endregion JABS_InputAdapter

//region QuestManager
/**
 * A manager layer for convenient static methods that check various data points or perform common actions.
 */
class QuestManager
{
  /**
   * The constructor is not designed to be called.
   * This is a static class.
   */
  constructor()
  {
    throw new Error("This is a static class.");
  }

  /**
   * Gets the quest by its given key.
   * @param {string} key The key of the quest to retrieve.
   * @returns {TrackedOmniQuest}
   */
  static quest(key)
  {
    // grab the quest tracking.
    const tracking = $gameParty.getQuestopediaEntryByKey(key);

    // if such a tracking doesn't exist, then we can't do that.
    if (!tracking)
    {
      // stop processing.
      console.error(`The key of ${key} was not found in the list of quests.`);
      throw new Error(`Attempted to leverage a non-existent quest with the key of: ${key}.`);
    }

    // return the quest.
    return tracking;
  }

  /**
   * Gets all quest metadata as a map from the plugin's metadata.
   * @returns {Map<string, OmniQuest>}
   */
  static questMetadatas()
  {
    return J.OMNI.EXT.QUEST.Metadata.questsMap;
  }

  /**
   * Gets all quests that are currently being tracked.
   * @returns {TrackedOmniQuest[]}
   */
  static trackedQuests()
  {
    const allQuests = $gameParty.getQuestopediaEntriesCache()
      .values();
    return Array.from(allQuests)
      .filter(quest => quest.isTracked());
  }

  /**
   * Sets whether or not a quest is being tracked to the given state.
   * @param {string} key The key of the quest to modify tracking for.
   * @param {boolean} trackedState The tracking state for this quest.
   */
  static setQuestTrackingByKey(key, trackedState)
  {
    // grab the quest to modify tracking for.
    const quest = this.quest(key);

    // set the tracking state to the given state.
    quest.toggleTracked(trackedState);
  }

  /**
   * Gets the quest category metadata by its given key.
   * @param {string} key The key of the category.
   * @returns {OmniCategory}
   */
  static category(key)
  {
    // grab the category metadata.
    const category = J.OMNI.EXT.QUEST.Metadata.categoriesMap.get(key);

    // if such a metadata doesn't exist, then we can't do that.
    if (!category)
    {
      // stop processing.
      console.error(`The key of ${key} was not found in the list of quest categories.`);
      throw new Error(`Attempted to leverage a non-existent quest category with the key of: ${key}.`);
    }

    // return the category.
    return category;
  }

  /**
   * Gets all quest category metadatas from the plugin's metadata.
   * @param {boolean=} asMap Whether or not to fetch the categories as a map or an array; defaults to true- as a map.
   * @returns {Map<string, OmniCategory>|OmniCategory[]}
   */
  static categories(asMap = true)
  {
    return asMap
      ? J.OMNI.EXT.QUEST.Metadata.categoriesMap
      : J.OMNI.EXT.QUEST.Metadata.categories;
  }

  /**
   * Gets the quest tag metadata by its given key.
   * @param {string} key The key of the tag.
   * @returns {OmniTag}
   */
  static tag(key)
  {
    // grab the tag metadata.
    const tag = J.OMNI.EXT.QUEST.Metadata.tagsMap.get(key);

    // if such a metadata doesn't exist, then we can't do that.
    if (!tag)
    {
      // stop processing.
      console.error(`The key of ${key} was not found in the list of quest tags.`);
      throw new Error(`Attempted to leverage a non-existent quest tag with the key of: ${key}.`);
    }

    // return the tag.
    return tag;
  }

  /**
   * Gets all quest tag metadatas from the plugin's metadata.
   * @param {boolean=} asMap Whether or not to fetch the tags as a map or an array; defaults to true- as a map.
   * @returns {Map<string, OmniTag>|OmniTag[]}
   */
  static tags(asMap = true)
  {
    return asMap
      ? J.OMNI.EXT.QUEST.Metadata.tagsMap
      : J.OMNI.EXT.QUEST.Metadata.tags;
  }

  /**
   * Unlocks a questopedia entry by its key.
   * @param {string} questKey The key of the quest to unlock.
   */
  static unlockQuestByKey(questKey)
  {
    // grab the quest.
    const quest = this.quest(questKey);

    // unlock it.
    quest.unlock();
  }

  /**
   * A script-friendly "if" conditional function that can be used in events to check if a particular objective on a
   * particular quest can be executed. If no objective id is provided, the fallback will be used (immediate >> first).
   * @param {string} questKey The key of the quest to check the objective of.
   * @param {?number} objectiveId The objective id to interrogate.
   * @returns {boolean}
   */
  static canDoObjective(questKey, objectiveId = null)
  {
    // grab the quest.
    const quest = this.quest(questKey);

    // return if the objective can be executed.
    return quest.canExecuteObjectiveById(objectiveId);
  };

  /**
   * Checks if a quest is active.
   * @param {string} questKey The key of the quest to check for completion.
   * @returns {boolean}
   */
  static isQuestActive(questKey)
  {
    // grab the quest.
    const quest = this.quest(questKey);

    // return if the quest is currently active.
    return quest.state === OmniQuest.States.Active;
  }

  /**
   * Checks if a quest is completed.
   * @param {string} questKey The key of the quest to check for completion.
   * @returns {boolean}
   */
  static isQuestCompleted(questKey)
  {
    // grab the quest.
    const quest = this.quest(questKey);

    // return if the quest is already completed.
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
  static isObjectiveCompleted(questKey, objectiveId = null)
  {
    // grab the quest.
    const quest = this.quest(questKey);

    // return if the objective for this quest is already completed.
    return quest.isObjectiveCompleted(objectiveId);
  }

  /**
   * Progresses the quest through its current objective and activates the next. If there is no "next" objective, then
   * the quest will be completed instead.
   * @param {string} questKey the key of the quest to progress.
   */
  static progressQuest(questKey)
  {
    // grab the quest.
    const quest = this.quest(questKey);

    // progress it.
    quest.progressObjectives();
  }

  /**
   * Gets all valid destination objectives currently available to be progressed.
   * @returns {TrackedOmniObjective[]}
   */
  static getValidDestinationObjectives()
  {
    // grab all quests that are tracked.
    const quests = $gameParty.getQuestopediaEntriesCache()
      .values();

    const evaluateableStates = [ OmniQuest.States.Inactive, OmniQuest.States.Active ];
    const destinationObjectives = [];

    quests.forEach(quest =>
    {
      // do not evaluate the state if its not one of the ones that can be evaluated.
      if (!evaluateableStates.includes(quest.state)) return;

      // identify all the currently-active destination objectives on this quest.
      const validObjectives = quest.objectives
        .filter(objective =>
        {
          // validate the objective is the correct type.
          if (!objective.isValid(OmniObjective.Types.Destination)) return false;

          // validate the player is on the current objective's map.
          if ($gameMap.mapId() !== objective.destinationData()
            .at(0)) return false;

          // this is an objective to check!
          return true;
        });

      // if there are none, don't process them.
      if (validObjectives.length === 0) return;

      // add them to the running list.
      destinationObjectives.push(...validObjectives);
    });

    return destinationObjectives;
  }

  /**
   * Gets all valid fetch objectives currently available to be progressed.
   * @returns {TrackedOmniObjective[]}
   */
  static getValidFetchObjectives()
  {
    // grab all quests that are tracked.
    const quests = $gameParty.getQuestopediaEntriesCache()
      .values();

    const evaluateableStates = [ OmniQuest.States.Inactive, OmniQuest.States.Active ];
    const fetchObjectives = [];

    quests.forEach(quest =>
    {
      // do not evaluate the state if its not one of the ones that can be evaluated.
      if (!evaluateableStates.includes(quest.state)) return;

      // identify all the currently-active destination objectives on this quest.
      const validObjectives = quest.objectives
        .filter(objective =>
        {
          // validate the objective is the correct type.
          if (!objective.isValid(OmniObjective.Types.Fetch)) return false;

          // this is an objective to check!
          return true;
        });

      // if there are none, don't process them.
      if (validObjectives.length === 0) return;

      // add them to the running list.
      fetchObjectives.push(...validObjectives);
    });

    return fetchObjectives;
  }

  /**
   * Gets all valid slay objectives currently available to be progressed.
   * @returns {TrackedOmniObjective[]}
   */
  static getValidSlayObjectives()
  {
    // grab all quests that are tracked.
    const quests = $gameParty.getQuestopediaEntriesCache()
      .values();

    const evaluateableStates = [ OmniQuest.States.Inactive, OmniQuest.States.Active ];
    const slayObjectives = [];

    quests.forEach(quest =>
    {
      // do not evaluate the state if its not one of the ones that can be evaluated.
      if (!evaluateableStates.includes(quest.state)) return;

      // identify all the currently-active slay objectives on this quest.
      const validObjectives = quest.objectives
        .filter(objective =>
        {
          // validate the objective is the correct type.
          if (!objective.isValid(OmniObjective.Types.Slay)) return false;

          // this is an objective to check!
          return true;
        });

      // if there are none, don't process them.
      if (validObjectives.length === 0) return;

      // add them to the running list.
      slayObjectives.push(...validObjectives);
    });

    return slayObjectives;
  }

  /**
   * Gets all valid quest objectives currently available to be progressed.
   * @returns {TrackedOmniObjective[]}
   */
  static getValidQuestCompletionObjectives()
  {
    // grab all quests that are tracked.
    const quests = $gameParty.getQuestopediaEntriesCache()
      .values();

    const evaluateableStates = [ OmniQuest.States.Inactive, OmniQuest.States.Active ];
    const questCompletionObjectives = [];

    quests.forEach(quest =>
    {
      // do not evaluate the state if its not one of the ones that can be evaluated.
      if (!evaluateableStates.includes(quest.state)) return;

      // identify all the currently-active destination objectives on this quest.
      const validObjectives = quest.objectives
        .filter(objective =>
        {
          // validate the objective is the correct type.
          if (!objective.isValid(OmniObjective.Types.Quest)) return false;

          // validate the objective isn't an empty collection of questkeys for some reason- that doesn't count.
          if (objective.questCompletionData().length === 0)
          {
            console.warn(`quest of ${objective.questKey} has objective of id ${objective.id} set to "quest completion", but lacks 'fulfillmentQuestKeys'}.`);
            return false;
          }

          // this is an objective to check!
          return true;
        });

      // if there are none, don't process them.
      if (validObjectives.length === 0) return;

      // add them to the running list.
      questCompletionObjectives.push(...validObjectives);
    });

    return questCompletionObjectives;
  }
}

//endregion QuestManager

//region Game_Enemy
/**
 * Extends {@link onDeath}.<br/>
 *
 */
J.OMNI.EXT.QUEST.Aliased.Game_Enemy.set('onDeath', Game_Enemy.prototype.onDeath);
Game_Enemy.prototype.onDeath = function()
{
  // perform original logic.
  J.OMNI.EXT.QUEST.Aliased.Game_Enemy.get('onDeath').call(this);

  // process the quest checking for slaying enemies.
  this.processSlayQuestsCheck();
};

/**
 * Evaluate all active slay objectives that relate to this particular enemy.
 */
Game_Enemy.prototype.processSlayQuestsCheck = function()
{
  // grab all the valid objectives.
  const activeSlayObjectives = QuestManager.getValidSlayObjectives();

  // if there are none, don't try to process this.
  if (activeSlayObjectives.length === 0) return;

  // iterate over each of the destination objectives.
  activeSlayObjectives.forEach(objective =>
  {
    // extract the target enemyId from the objective.
    const [ enemyId, ] = objective.slayData();

    // if this isn't the right enemy, then it doesn't count.
    if (this.enemyId() !== enemyId) return;

    // increment the slay counter.
    objective.incrementSlayTargetEnemyAmount();

    // check if we've exceeded the number of required enemies to slay for the objective.
    if (!objective.hasSlainEnoughEnemies()) return;

    console.log(`player has completed the slay objective: ${objective.id} for quest: ${objective.questKey}.`);

    // grab the quest for reference.
    const questToProgress = QuestManager.quest(objective.questKey);

    // flag the quest objective as completed.
    questToProgress.flagObjectiveAsCompleted(objective.id);

    // progress the quest to active its next objective.
    questToProgress.progressObjectives();
  });
};
//endregion Game_Enemy

//region Game_Event
/**
 * Extends {@link meetsConditions}.<br/>
 * Also includes the custom conditions that relate to a quest.
 * @param {any} page
 * @returns {boolean}
 */
J.OMNI.EXT.QUEST.Aliased.Game_Event.set('meetsConditions', Game_Event.prototype.meetsConditions);
Game_Event.prototype.meetsConditions = function(page)
{
  // check original conditions.
  const metOtherPageConditions = J.OMNI.EXT.QUEST.Aliased.Game_Event.get('meetsConditions')
    .call(this, page);

  // if other conditions aren't met, then quest conditions don't override that.
  if (!metOtherPageConditions) return false;

  // grab the list of valid comments.
  //const commentCommandList = this.getValidCommentCommands();
  const commentCommandList = this.getValidCommentCommandsFromPage(page);

  // there aren't any comments on this event at all.
  if (commentCommandList.length === 0) return true;

  // gather all quest comments from the comment commands of this event.
  const questConditionals = this.toQuestConditionals(commentCommandList);

  // if there are none, then this event is fine to proceed!
  if (questConditionals.length === 0) return true;

  // determine if all the quest conditionals are satisfied.
  const questConditionalsMet = questConditionals.every(this.questConditionalMet, this);

  // return whether or not the quest conditionals were satisfied.
  return questConditionalsMet;
};

/**
 * Filters the comment commands to only quest conditionals- should any exist in the collection.
 * @param {rm.types.EventCommand[]} commentCommandList The comment commands to potentially convert to conditionals.
 * @returns {OmniConditional[]}
 */
Game_Event.prototype.toQuestConditionals = function(commentCommandList)
{
  // gather all quest comments from the comment commands of this event.
  const questCommentCommands = commentCommandList
    .filter(this.filterCommentCommandsByEventQuestConditional, this);

  // if there are no quest conditionals available for parsing, don't bother.
  if (questCommentCommands.length === 0) return [];

  // map all the quest conditionals from the parsed regex.
  return questCommentCommands.map(this.toQuestConditional, this);
};

/**
 * Converts a known comment event command into a conditional for quest control.
 * @param {rm.types.EventCommand} commentCommand The comment command to parse into a conditional.
 * @returns {OmniConditional}
 */
Game_Event.prototype.toQuestConditional = function(commentCommand)
{
  // shorthand the comment into a variable.
  const [ comment, ] = commentCommand.parameters;

  let result = null;

  switch (true)
  {
    // FOR WHOLE EVENTS:
    // check if its a basic "while this quest is active" condition.
    case J.OMNI.EXT.QUEST.RegExp.EventQuest.test(comment):
      result = J.OMNI.EXT.QUEST.RegExp.EventQuest.exec(comment);
      break;
    // check if its a specific "while this quest is active AND this objective is active.
    case J.OMNI.EXT.QUEST.RegExp.EventQuestObjective.test(comment):
      result = J.OMNI.EXT.QUEST.RegExp.EventQuestObjective.exec(comment);
      break;
    // check if its a specific "while this quest is active AND this objective is active.
    case J.OMNI.EXT.QUEST.RegExp.EventQuestObjectiveForState.test(comment):
      result = J.OMNI.EXT.QUEST.RegExp.EventQuestObjectiveForState.exec(comment);
      break;

    // JUST FOR CHOICES:
    // check if its a basic "while this quest is active" condition.
    case J.OMNI.EXT.QUEST.RegExp.ChoiceQuest.test(comment):
      result = J.OMNI.EXT.QUEST.RegExp.ChoiceQuest.exec(comment);
      break;
    // check if its a specific "while this quest is active AND this objective is active.
    case J.OMNI.EXT.QUEST.RegExp.ChoiceQuestObjective.test(comment):
      result = J.OMNI.EXT.QUEST.RegExp.ChoiceQuestObjective.exec(comment);
      break;
    // check if its a specific "while this quest is active AND this objective is active.
    case J.OMNI.EXT.QUEST.RegExp.ChoiceQuestObjectiveForState.test(comment):
      result = J.OMNI.EXT.QUEST.RegExp.ChoiceQuestObjectiveForState.exec(comment);
      break;
  }

  // parse the value out of the regex capture group.
  const [ , val ] = result;
  const parsedVal = JsonMapper.parseObject(val);

  // different sizes result in building conditionals differently.
  switch (parsedVal.length)
  {
    // the quest tag will result in the event page being valid while the quest remains active.
    case 1:
      return new OmniConditional(parsedVal.at(0), null, OmniQuest.States.Active);

    // the quest tag will result in the event page being valid while the objective remains active.
    case 2:
      return new OmniConditional(parsedVal.at(0), parsedVal.at(1), OmniQuest.States.Active);

    // the quest tag will result in the event page being valid while the objective remains in the target state.
    case 3:
      const targetQuestState = OmniQuest.FromStringToStateId(parsedVal.at(2));
      return new OmniConditional(parsedVal.at(0), parsedVal.at(1), targetQuestState);

    default:
      throw new Error(`unknown parsedVal length in quest event tag: ${comment}`);
  }
};

/**
 * A filter function for only including comment event commands relevant to quests.
 * @param {rm.types.EventCommand} command The command being evaluated.
 * @returns {boolean}
 */
Game_Event.prototype.filterCommentCommandsByEventQuestConditional = function(command)
{
  // identify the actual comment being evaluated.
  const [ comment, ] = command.parameters;

  // in case the command isn't even valid for comment-validation.
  if (!comment) return false;

  // extract the types of regex we will be considering.
  const { EventQuest, EventQuestObjective, EventQuestObjectiveForState } = J.OMNI.EXT.QUEST.RegExp;
  return [ EventQuest, EventQuestObjective, EventQuestObjectiveForState, ].some(regex => regex.test(comment));
};

/**
 * A filter function for only including comment event commands relevant to quests.
 * @param {rm.types.EventCommand} command The command being evaluated.
 * @returns {boolean}
 */
Game_Event.prototype.filterCommentCommandsByChoiceQuestConditional = function(command)
{
  // identify the actual comment being evaluated.
  const [ comment, ] = command.parameters;

  // in case the command isn't even valid for comment-validation.
  if (!comment) return false;

  // extract the types of regex we will be considering.
  const { ChoiceQuest, ChoiceQuestObjective, ChoiceQuestObjectiveForState } = J.OMNI.EXT.QUEST.RegExp;
  return [ ChoiceQuest, ChoiceQuestObjective, ChoiceQuestObjectiveForState, ].some(regex => regex.test(comment));
};

/**
 * Evaluates a {@link OmniConditional} to see if its requirements are currently met.
 * @param {OmniConditional} questConditional The quest conditional to evaluate satisfaction of.
 * @returns {boolean}
 */
Game_Event.prototype.questConditionalMet = function(questConditional)
{
  // grab reference to this quest.
  const quest = QuestManager.quest(questConditional.questKey);

  // check if there was an objectiveId from the conditional.
  if (questConditional.objectiveId !== null && questConditional.objectiveId >= 0)
  {
    // validate the quest objective is in the target state- which defaults to active.
    return quest.isObjectiveInState(questConditional.state, questConditional.objectiveId);
  }
  // the conditional didn't have an objective, or it was negative (which translates to quest state evaluation).
  else
  {
    // make sure the quest itself is in the target state.
    return quest.state === questConditional.state;
  }
};
//endregion Game_Event

//region Game_Interpreter
/**
 * Extends {@link shouldHideChoiceBranch}.<br/>
 * Includes possibility of hiding quest-related options.
 * @param {number} subChoiceCommandIndex The index in the list of commands of an event that represents this branch.
 * @returns {boolean}
 */
J.OMNI.EXT.QUEST.Aliased.Game_Interpreter.set(
  'shouldHideChoiceBranch',
  Game_Interpreter.prototype.shouldHideChoiceBranch);
Game_Interpreter.prototype.shouldHideChoiceBranch = function(subChoiceCommandIndex)
{
  // perform original logic to see if this branch was already hidden.
  const defaultShow = J.OMNI.EXT.QUEST.Aliased.Game_Interpreter.get('shouldHideChoiceBranch')
    .call(this, subChoiceCommandIndex);

  // if there is another reason to hide this branch, then do not process quest reasons.
  if (defaultShow) return true;

  // grab some metadata about the event.
  const eventMetadata = $gameMap.event(this.eventId());
  const currentPage = eventMetadata.page();

  // grab the event subcommand.
  const subEventCommand = currentPage.list.at(subChoiceCommandIndex);

  // ignore non-comment event commands.
  if (!eventMetadata.filterInvalidEventCommand(subEventCommand)) return false;

  // ignore non-quest comment commands.
  if (!eventMetadata.filterCommentCommandsByChoiceQuestConditional(subEventCommand)) return false;

  // convert the known-quest-command to a conditional.
  const conditional = eventMetadata.toQuestConditional(subEventCommand);

  // if the condition is met, then we don't need to hide.
  const met = eventMetadata.questConditionalMet(conditional);
  if (met) return false;

  // the conditional isn't met, hide the group.
  return true;
};
//endregion Game_Interpreter

//region Game_Map
/**
 * Extends {@link initialize}.<br/>
 * Also initializes the questopedia members.
 */
J.OMNI.EXT.QUEST.Aliased.Game_Map.set('initialize', Game_Map.prototype.initialize);
Game_Map.prototype.initialize = function()
{
  // perform original logic.
  J.OMNI.EXT.QUEST.Aliased.Game_Map.get('initialize').call(this);

  // also initialize our members.
  this.initQuestopediaMembers();
};

/**
 * Initialize the members specific to the questopedia.
 */
Game_Map.prototype.initQuestopediaMembers = function()
{
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
Game_Map.prototype.getDestinationTimer = function()
{
  return this._j._omni._quest._destinationTimer;
};

/**
 * Extends {@link update}.<br/>
 * Also evaluates destination-based {@link OmniConditional}s.
 */
J.OMNI.EXT.QUEST.Aliased.Game_Map.set('update', Game_Map.prototype.update);
Game_Map.prototype.update = function(sceneActive)
{
  // perform original logic.
  J.OMNI.EXT.QUEST.Aliased.Game_Map.get('update').call(this, sceneActive);

  // process the quest checking for reaching destinations.
  this.processDestinationCheck();
};

/**
 * Checks if the destination timer is ready for an evaluation of destination objectives checking.
 */
Game_Map.prototype.processDestinationCheck = function()
{
  // grab the timer.
  const timer = this.getDestinationTimer();

  // checks if the timer is complete.
  if (timer.isTimerComplete())
  {
    // evaluate the destination objectives.
    this.evaluateDestinationObjectives();

    // and reset the timer.
    timer.reset();
  }
  // the timer is not completed.
  else
  {
    // tick tock!
    timer.update();
  }
};

/**
 * Evaluate all active destination objectives that reside on this map.
 */
Game_Map.prototype.evaluateDestinationObjectives = function()
{
  // grab all the valid destination objectives.
  const activeDestinationObjectives = QuestManager.getValidDestinationObjectives();

  // if there are none, don't try to process this.
  if (activeDestinationObjectives.length === 0) return;

  // iterate over each of the destination objectives.
  activeDestinationObjectives.forEach(objective =>
  {
    // extract the coordinate range from the objective.
    const [ , coordinateRange ] = objective.destinationData();

    // check if the player within the coordinate range.
    if (objective.isPlayerWithinDestinationRange(coordinateRange))
    {
      console.log(`player has achieved the objective! ${objective.questKey}`);

      // grab the quest for reference.
      const questToProgress = QuestManager.quest(objective.questKey);

      // flag the quest objective as completed.
      questToProgress.flagObjectiveAsCompleted(objective.id);

      // progress the quest to active its next objective.
      questToProgress.progressObjectives();
    }
  });
};
//endregion Game_Map

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

  // initialize the questopedia.
  this.initQuestopediaMembers();

  // populate the trackings for the first time.
  this.populateQuestopediaTrackings();
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
 * Initialize the trackables for the questopedia.
 */
Game_Party.prototype.populateQuestopediaTrackings = function()
{
  // convert all the metadata into trackables.
  const trackedOmniquests = J.OMNI.EXT.QUEST.Metadata.quests.map(this.toTrackedOmniQuest, this);

  // populate the cache so it gets updated upon saving.
  trackedOmniquests.forEach(trackedOmniquest =>
  {
    this._j._omni._questopediaCache.set(trackedOmniquest.key, trackedOmniquest);
  });
};

/**
 * Maps an {@link OmniQuest} to a {@link TrackedOmniQuest}.
 * @param {OmniQuest} omniquest The omniquest to map.
 * @returns {TrackedOmniQuest}
 */
Game_Party.prototype.toTrackedOmniQuest = function(omniquest)
{
  const objectivesMapper = omniObjective => new TrackedOmniObjective(
    omniquest.key,
    omniObjective.id,
    omniObjective.fulfillment,
    omniObjective.hiddenByDefault,
    omniObjective.isOptional);

  const trackedObjectives = omniquest.objectives.map(objectivesMapper, this);

  return new TrackedOmniQuest(omniquest.key, omniquest.categoryKey, trackedObjectives);
};

/**
 * Updates the tracking of {@link TrackedOmniQuest}s from the latest metadata- in case there have been updates since
 * the game has been last loaded. This likely only happens during a game's development.
 */
Game_Party.prototype.updateTrackedOmniQuestsFromConfig = function()
{
  // grab the current list of trackings by reference.
  const trackings = this.getSavedQuestopediaEntries();

  // iterate over all of the ones defined in the plugin metadata.
  J.OMNI.EXT.QUEST.Metadata.quests.forEach(omniquest =>
  {
    // skip ones that we shouldn't be adding.
    if (!this.canGainEntry(omniquest.key) || !this.canGainEntry(omniquest.name)) return;

    // find one by the same key in the existing trackings.
    const foundTracking = trackings.find(tracking => tracking.key === omniquest.key);

    const newTracking = this.toTrackedOmniQuest(omniquest);
    
    // if the tracking already exists, it should be updated.
    if (foundTracking)
    {
      console.log(`updating existing quest; ${omniquest.key}`);

      // update the category.
      foundTracking.categoryKey = omniquest.categoryKey;
      
      // if the objective length hasn't changed, then don't process anymore.
      if (foundTracking.objectives.length <= omniquest.objectives.length) return;

      // concat the new objectives onto the existing tracking.
      const objectivesToAdd = newTracking.objectives.slice(foundTracking.objectives.length);
      foundTracking.objectives.splice(foundTracking.objectives.length, 0, ...objectivesToAdd);
    }
    // if the tracking doesn't exist yet, it should be added.
    else
    {
      console.log(`adding new quest; ${omniquest.key}`);

      // we didn't find one, so create and add a new tracking.
      trackings.push(newTracking);
    }
  });

  // sort the quests by their key, in-place.
  trackings.sort((a, b) => a.key - b.key);
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
 * Sets the questopedia entries to the given entries.
 * @param {TrackedOmniQuest[]} entries The new collection of quests.
 */
Game_Party.prototype.setSavedQuestopediaEntries = function(entries)
{
  this._j._omni._questopediaSaveables = entries;
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
Game_Party.prototype.translateQuestopediaCacheToSaveables = function()
{
  // grab the cache we've been maintaining.
  const cache = this.getQuestopediaEntriesCache();
  
  // determine the updated entries.
  const updatedQuestopediaEntries = Array.from(cache.values());
  
  // update the quests from the cache.
  this.setSavedQuestopediaEntries(updatedQuestopediaEntries);
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
  this.translateQuestopediaCacheToSaveables();

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
  this.translateQuestopediaCacheToSaveables();

  console.log('executed "synchronizeQuestopediaAfterLoad".');
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
  return Array.from(this.getQuestopediaEntriesCache()
    .values());
};

// TODO: relocate this to a more central location.
if (!Game_Party.prototype.canGainEntry)
{
  /**
   * Whether or not a named entry should be unlockable.
   * This is mostly for skipping recipe names that are used as dividers in the list.
   * @param {string} name The name of the entry.
   * @return {boolean} True if the entry can be gained, false otherwise.
   */
  Game_Party.prototype.canGainEntry = function(name)
  {
    // skip entries that are null.
    if (name === null) return false;

    // skip entries with empty names.
    if (name.trim().length === 0) return false;

    // skip entries that start with an underscore (arbitrary).
    if (name.startsWith('_')) return false;

    // skip entries that start with a multiple equals (arbitrary).
    if (name.startsWith('==')) return false;

    // skip entries that are the "empty" name (arbitrary).
    if (name.includes('-- empty --')) return false;

    // we can gain it!
    return true;
  };
}

//endregion questopedia

//region evaluation
/**
 * Extends {@link processItemGain}.<br/>
 * Also synchronizes the item count with any relevant quests.
 * @param {RPG_Item|RPG_Weapon|RPG_Armor} item The item to modify the quantity of.
 * @param {number} amount The amount to modify the quantity by.
 * @param {boolean} includeEquip Whether or not to include equipped items for equipment.
 */
J.OMNI.EXT.QUEST.Aliased.Game_Party.set('processItemGain', Game_Party.prototype.processItemGain);
Game_Party.prototype.processItemGain = function(item, amount, includeEquip)
{
  // perform original logic.
  J.OMNI.EXT.QUEST.Aliased.Game_Party.get('processItemGain')
    .call(this, item, amount, includeEquip);

  // also evaluate the item being gained/lost for quest objectives.
  this.processItemCheck(item);
};

/**
 * Process an item being gained and update any relevant quest objectives.
 * @param {RPG_Base} item The item being gained.
 */
Game_Party.prototype.processItemCheck = function(item)
{
  // grab all fetch objectives currently active.
  const fetchObjectives = QuestManager.getValidFetchObjectives();

  // if there are none, don't try to process this.
  if (fetchObjectives.length === 0) return;

  fetchObjectives
    // filter out irrelevant items being gained.
    .filter(objective =>
    {
      // validate the data sources match.
      if (!objective.isFetchTarget(item)) return false;

      // this objective can be updated!
      return true;
    })
    // iterate over whats left to sync and update.
    .forEach(objective =>
    {
      // synchronize the current with target quantities for this object.
      objective.synchronizeFetchTargetItemQuantity();

      if (objective.hasFetchedEnoughItems())
      {
        // grab the quest for reference.
        const questToProgress = QuestManager.quest(objective.questKey);

        // flag the quest objective as completed.
        questToProgress.flagObjectiveAsCompleted(objective.id);

        // progress the quest to active its next objective.
        questToProgress.progressObjectives();
      }
    });
};
//endregion evaluation
//endregion Game_Party

//region Game_System
/**
 * Update the saved data with the running cache.
 */
J.OMNI.EXT.QUEST.Aliased.Game_System.set('onBeforeSave', Game_System.prototype.onBeforeSave);
Game_System.prototype.onBeforeSave = function()
{
  // perform original logic.
  J.OMNI.EXT.QUEST.Aliased.Game_System.get('onBeforeSave').call(this);

  // update the cache into saveable data.
  $gameParty.synchronizeQuestopediaDataBeforeSave();
};

/**
 * Extends {@link #onAfterLoad}.<br>
 * Updates the database with the tracked refined equips.
 */
J.OMNI.EXT.QUEST.Aliased.Game_System.set('onAfterLoad', Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function()
{
  // perform original logic.
  J.OMNI.EXT.QUEST.Aliased.Game_System.get('onAfterLoad').call(this);

  // update the quests.
  $gameParty.updateTrackedOmniQuestsFromConfig();
  $gameParty.synchronizeQuestopediaAfterLoad();
};
//endregion Game_System

//region JABS_InputController
/**
 * Extends {@link #update}.<br/>
 * Also handles input detection for the questopedia shortcut key.
 */
J.OMNI.EXT.QUEST.Aliased.JABS_InputController.set('update', JABS_InputController.prototype.update);
JABS_InputController.prototype.update = function()
{
  // perform original logic.
  J.OMNI.EXT.QUEST.Aliased.JABS_InputController.get('update').call(this);
  
  // update input for the questopedia shortcut key.
  this.updateQuestopediaAction();
};

/**
 * Monitors and takes action based on player input regarding the questopedia shortcut key.
 */
JABS_InputController.prototype.updateQuestopediaAction = function()
{
  // check if the action's input requirements have been met.
  if (this.isQuestopediaActionTriggered())
  {
    // execute the action.
    this.performQuestopediaAction();
  }
  
};

/**
 * Checks the inputs of the questopedia action.
 * @returns {boolean}
 */
JABS_InputController.prototype.isQuestopediaActionTriggered = function()
{
  // this action requires the right stick button to be triggered.
  if (Input.isTriggered(J.ABS.Input.R3))
  {
    return true;
  }

  // input was not triggered.
  return false;
}

/**
 * Executes the questopedia action.
 */
JABS_InputController.prototype.performQuestopediaAction = function()
{
  JABS_InputAdapter.performQuestopediaAction();
}
//endregion JABS_InputController

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
     * The window that shows the categories a quest can be associated with.
     * @type {Window_QuestopediaCategories}
     */
    this._j._omni._quest._pediaCategories = null;

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
    // create the list of quest categories.
    this.createQuestopediaCategoriesWindow();

    // create the list of quests that are known.
    this.createQuestopediaListWindow();

    // create the description of the selected quest.
    this.createQuestopediaDescriptionWindow();

    // create the known list of unfinished and completed objectives of the selected quest.
    //this.createQuestopediaObjectivesWindow();


    const categoriesWindow = this.getQuestopediaCategoriesWindow();
    categoriesWindow.onIndexChange();

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
  //region categories window
  /**
   * Creates the quest categories window.
   */
  createQuestopediaCategoriesWindow()
  {
    // create the window.
    const window = this.buildQuestopediaCategoriesWindow();

    // update the tracker with the new window.
    this.setQuestopediaCategoriesWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the questopedia categories window.
   * @returns {Window_QuestopediaCategories}
   */
  buildQuestopediaCategoriesWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.questopediaCategoriesRectangle();

    // create the window with the rectangle.
    const window = new Window_QuestopediaCategories(rectangle);

    // overwrite the onIndexChange hook with our local onQuestopediaIndexChange hook.
    window.onIndexChange = this.onQuestopediaCategoryChange.bind(this);

    window.deactivate();

    // return the built and configured omnipedia list window.
    return window;
  }

  /**
   * Gets the rectangle associated with the questopedia list command window.
   * @returns {Rectangle}
   */
  questopediaCategoriesRectangle()
  {
    // the list window's origin coordinates are the box window's origin as well.
    const [ x, y ] = Graphics.boxOrigin;

    // define the width of the categories.
    const width = 500;

    // define the height of the categories.
    const height = (Graphics.boxHeight * 0.08) - (Graphics.verticalPadding * 2);

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked questopedia categories window.
   * @returns {Window_QuestopediaCategories}
   */
  getQuestopediaCategoriesWindow()
  {
    return this._j._omni._quest._pediaCategories;
  }

  /**
   * Set the currently tracked questopedia categories window to the given window.
   * @param {Window_QuestopediaCategories} categoriesWindow The questopedia categories window to track.
   */
  setQuestopediaCategoriesWindow(categoriesWindow)
  {
    this._j._omni._quest._pediaCategories = categoriesWindow;
  }

  //endregion categories window

  //region list window
  /**
   * Creates the list of quests the player can potentially complete.
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

    window.setHandler('pagedown', this.cycleQuestCategories.bind(this, true));
    window.setHandler('pageup', this.cycleQuestCategories.bind(this, false));

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
    const categoriesRectangle = this.questopediaCategoriesRectangle();

    // the list x coordinate is aligned with the categories window.
    const x = categoriesRectangle.x;

    // the list y coordinate is below the categories window.
    const y = categoriesRectangle.height + Graphics.verticalPadding;

    // define the width of the list.
    const width = categoriesRectangle.width;

    // define the height of the list.
    const height = Graphics.boxHeight - Graphics.verticalPadding - y;

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

    window.deactivate();
    window.deselect();

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
    // grab the questopedia list window.
    const listWindow = this.getQuestopediaListWindow();

    // calculate the X for where the origin of the list window should be.
    const x = listWindow.x + listWindow.width;

    // calculate the Y for where the origin of the list window should be.
    const y = (Graphics.boxHeight / 2);

    // define the width of the list.
    const width = Graphics.boxWidth - listWindow.width - (Graphics.horizontalPadding * 2);

    // define the height of the list.
    const height = (Graphics.boxHeight / 2) - Graphics.verticalPadding;

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

    // grab the objectives window.
    // const objectivesWindow = this.getQuestopediaObjectivesWindow();

    // grab the highlighted enemy's extra data, their observations.
    const highlightedQuestEntry = listWindow.currentExt();

    // check if there was no highlighted option.
    if (!highlightedQuestEntry)
    {
      // empty the contents of the detail and objectives.
      detailWindow.clearContent();
      //objectivesWindow.clearContent();
      return;
    }

    // sync the detail window with the currently-highlighted quest.
    detailWindow.setCurrentQuest(highlightedQuestEntry);
    detailWindow.refresh();

    // sync the objectives window with the currently-highlighted quest.
    // objectivesWindow.setCurrentObjectives(highlightedQuestEntry.objectives);
    // objectivesWindow.refresh();
  }

  onQuestopediaCategoryChange()
  {
    // grab the categories window.
    const categoriesWindow = this.getQuestopediaCategoriesWindow();

    // grab the list window.
    const listWindow = this.getQuestopediaListWindow();

    // update the list window with the new category.
    listWindow.setCurrentCategoryKey(categoriesWindow.currentSymbol());

    listWindow.refresh();

    // trigger a potential questopedia index change.
    this.onQuestopediaIndexChange();

    console.log(`changed to category: ${categoriesWindow.currentSymbol()}`);
  }

  /**
   * Triggered when the player hits the OK button on a quest.<br/>
   * This marks a quest as "tracked".
   */
  onQuestopediaListSelection()
  {
    // grab the list window of quests.
    const listWindow = this.getQuestopediaListWindow();

    // check the currently highlighted quest.
    const highlighted = listWindow.currentExt();

    // validate we have a selection and its not an empty list.
    if (highlighted)
    {
      // toggle whether or not this quest is tracked.
      highlighted.toggleTracked();
      console.log(`quest ${highlighted.key} is tracked: ${highlighted.isTracked()}`);
    }

    // refresh and reactivate the list.
    listWindow.refresh();
    listWindow.activate();
  }

  /**
   * Cycles forward or back through quest categories available.
   * @param {boolean} isForward True if cycling up(right) through the index, false if cycling down(left).
   */
  cycleQuestCategories(isForward = true)
  {
    // do not cycle quest categories if there is only one.
    if (QuestManager.categories().size <= 1) return;

    // grab the categories window.
    const categoriesWindow = this.getQuestopediaCategoriesWindow();
    const currentIndex = categoriesWindow.index();

    // cycle to the next.
    if (isForward)
    {
      // check if we are at the end of the list.
      if (categoriesWindow._list.length === currentIndex + 1)
      {
        categoriesWindow.select(0);
      }
      // this isn't the end of the list, so select the next entry.
      else
      {
        categoriesWindow.select(currentIndex + 1);
      }
    }
    // cycle to the previous.
    else
    {
      // check if we are at the beginning of the list.
      if (currentIndex === 0)
      {
        categoriesWindow.select(categoriesWindow._list.length - 1)
      }
      // this isn't the beginning of the list, so select the previous entry.
      else
      {
        categoriesWindow.select(currentIndex - 1);
      }
    }

    this.getQuestopediaListWindow()
      .activate();

    console.log(`old index: ${currentIndex}; new index: ${categoriesWindow.index()}.`);
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

//region Window_QuestopediaCategories
class Window_QuestopediaCategories extends Window_HorzCommand
{
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
   * Adds all categories to the list.
   * @returns {BuiltWindowCommand[]}
   */
  buildCommands()
  {
    // grab all possible categories.
    const questCategories = QuestManager.categories(false);

    // compile the list of commands.
    const commands = questCategories.map(this.buildCommand, this);

    // return the compiled list of commands.
    return commands;
  }

  /**
   * Builds a {@link BuiltWindowCommand} based on the category data.
   * @param {OmniCategory} omniCategory The category data.
   * @returns {BuiltWindowCommand} The built command based on this category.
   */
  buildCommand(omniCategory)
  {
    // build a command based on the category.
    // NOTE: the name is left empty because this is an icon-based list.
    return new WindowCommandBuilder(omniCategory.name)
      .setSymbol(omniCategory.key)
      .setExtensionData(omniCategory)
      .setIconIndex(omniCategory.iconIndex)
      .build();
  }

  /**
   * Overrides {@link maxCols}.<br/>
   * Sets the column count to be the number of categories there are.
   * @returns {number}
   */
  maxCols()
  {
    return QuestManager.categories(false).length;
  };
}

//endregion Window_QuestopediaCategories

class Window_QuestopediaDescription extends Window_Base
{
  /**
   * The current selected quest in the quest list window.
   * @type {TrackedOmniQuest}
   */
  #currentQuest = null;

  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Gets the quest currently being displayed.
   * @returns {TrackedOmniQuest}
   */
  getCurrentQuest()
  {
    return this.#currentQuest;
  }

  /**
   * Sets the quest currently being displayed.
   * @param {TrackedOmniQuest} quest The quest to display data for.
   */
  setCurrentQuest(quest)
  {
    this.#currentQuest = quest;
  }

  drawContent()
  {
    // grab the current quest.
    const quest = this.getCurrentQuest();
    if (!quest) return;

    // define the origin x,y coordinates.
    const [ x, y ] = [ 0, 0 ];

    // shorthand the lineHeight.
    const lh = this.lineHeight();

    // draw the name of the quest.
    this.drawQuestName(x, y);

    // draw the recommended level for the quest.
    const recommendedLevelY = y + lh;
    this.drawQuestRecommendedLevel(x, recommendedLevelY);

    // draw the icons for each tag on this quest.
    const tagIconsY = y + (lh * 2);
    this.drawQuestTagIcons(x, tagIconsY);

    // draw the overview of the quest.
    const overviewY = y + (lh * 3);
    this.drawQuestOverview(x, overviewY);

    // draw the various logs of the quest.
    const logsY = y + (lh * 9);
    this.drawQuestLogs(x, logsY);
  }

  /**
   * Renders the quest name, if it is known. If it is not, it will be masked.
   * @param {number} x The origin x.
   * @param {number} y The origin y.
   */
  drawQuestName(x, y)
  {
    // grab the current quest.
    const quest = this.getCurrentQuest();

    // grab the name of the quest.
    const questName = quest.name();

    // potentially mask the name depending on whether or not the player knows it.
    const possiblyMaskedName = quest.isKnown()
      ? questName
      : J.BASE.Helpers.maskString(questName);

    // determine the width of the text.
    const resizedText = this.modFontSizeForText(10, possiblyMaskedName);
    const textWidth = this.textWidth(resizedText);

    // draw the text.
    this.drawTextEx(resizedText, x, y, textWidth);
  }

  drawQuestRecommendedLevel(x, y)
  {
    // grab the current quest.
    const quest = this.getCurrentQuest();

    // grab the recommended level for the quest.
    const questRecommendedLevel = quest.recommendedLevel();

    // if no valid level is provided or is intentionally invalid, or the quest is unknown, it should be masked.
    const possiblyMaskedLevel = (quest.isKnown() && questRecommendedLevel >= 0)
      ? questRecommendedLevel.toString()
      : "???";

    // determine the width of the text.
    const combinedText = `Recommended Level: ${possiblyMaskedLevel}`;
    const resizedText = this.modFontSizeForText(-2, combinedText);
    const textWidth = this.textWidth(resizedText);

    // draw the text.
    this.drawTextEx(resizedText, x, y, textWidth);
  }

  drawQuestTagIcons(x, y)
  {
    // grab the current quest.
    const quest = this.getCurrentQuest();

    // don't render the icons if the quest is unknown, period.
    if (!quest.isKnown()) return;

    const tags = quest.tags();

    // don't render the tags if there are none.
    if (tags.length === 0) return;

    // iterate over each of the tags for rendering.
    tags.forEach((tag, index) =>
    {
      // accommodate multiple tag icons being draw sequentially.
      const tagX = x + (ImageManager.iconWidth * index);

      // render the tag icon.
      this.drawIcon(tag.iconIndex, tagX, y);
    });
  }

  /**
   * Renders the quest overview, if the quest is unlocked. If the quest is still locked, the overview will be replaced
   * with the "unknown hint" instead.
   * @param {number} x The origin x.
   * @param {number} y The origin y.
   */
  drawQuestOverview(x, y)
  {
    // grab the current quest.
    const quest = this.getCurrentQuest();

    // TODO: this may need adjustment to text height.
    // grab the text to display for the quest description.
    let overview = quest.isKnown()
      ? quest.overview()
      : quest.unknownHint();

    // validate there was not an empty string.
    if (overview.length === 0)
    {
      // no empty strings allowed!
      overview = '???';

      // measure accordingly.
      const textWidth = this.textWidth(overview);

      // draw the overview.
      this.drawTextEx(overview, x, y, textWidth);

      // done.
      return;
    }

    // convert the quest overview into length-limited lines with words not sliced up.
    const lines = this.buildQuestOverviewLines(overview, 128);

    // the text lines for the overview should be tighter.
    const overviewLineHeight = this.lineHeight() - 10;

    // iterate over each line and draw it.
    lines.forEach((line, index) =>
    {
      // determine the y coordinate for the line.
      const lineY = y + (index * overviewLineHeight);

      // measure accordingly.
      const textWidth = this.textWidth(overview);

      // draw the overview.
      this.drawTextEx(line, x, lineY, textWidth);
    });
  }

  /**
   * Chops up the very long overview string into multiple lines based on the given max line length.
   * @param {string} overview The overview to be chopped into lines.
   * @param {number=} [maxLineLength=128] The maximum line length for any one line.
   * @returns {string[]} The overview chopped up into lines.
   */
  buildQuestOverviewLines(overview, maxLineLength = 128)
  {
    // split the text blob into words based on spaces.
    const words = overview.split(/\s/);

    // start with an empty collection for the lines.
    const lines = [];

    // reduce the words into lines by size, and capture the final line.
    const finalLine = words.reduce((currentLine, word) =>
    {
      // check if the word was translated to an empty string- the indicator it was a newline.
      if (word === String.empty)
      {
        // check if we even have a current line currently.
        if (currentLine.length > 0)
        {
          // finish the previous line.
          lines.push(currentLine);
        }

        // arbitrary check to prevent two or more new lines in a row.
        if (lines.length >= 2 && lines.at(-1) === String.empty)
        {
          return String.empty;
        }

        // manually add a new and empty line.
        lines.push(String.empty);

        // start a new line with the word- sans the new line indicators.
        return String.empty;
      }

      // the first word of a line doesn't need a space in front of it.
      if (currentLine.length === 0) return word;

      // translate the word if necessary- as escape codes are shorter than most actual words.
      const translatedWord = this.convertEscapeCharacters(word);

      // check the current line with the new word to see if the line is too long.
      const testLine = `${currentLine} ${translatedWord}`;

      // if the line does not exceed 120 characters, then keep going.
      if (testLine.length <= maxLineLength) return `${currentLine} ${word}`;

      // adding the new word would go beyond the fixed length of 120, so capture the line.
      lines.push(currentLine);

      // and start a new line.
      return word;

      // start with an empty string.
    }, String.empty);

    // add the last line to the running list.
    lines.push(finalLine);

    // return the lines of the text.
    return lines;
  }

  /**
   * Renders the quest logs, the notes that the protagonist observes as they complete the objectives.
   * @param {number} x The origin x.
   * @param {number} y The origin y.
   */
  drawQuestLogs(x, y)
  {
    // grab the current quest.
    const quest = this.getCurrentQuest();

    // shorthand the lineHeight.
    const lh = this.lineHeight();

    quest.objectives
      .filter(objective =>
      {
        // objectives that have had action are included.
        if (objective.isKnown()) return true;

        // un-hidden but inactive objectives are also included.
        if (!objective.hidden && objective.isInactive()) return true;

        // objectives still in the 'InActive' status and also hidden (default) are explicitly not rendered.
        return false;
      })
      .forEach((objective, index) =>
      {
        // determine the y for the log.
        const logY = y + ((lh * 2) * index);

        // draw the log of the current state of fulfillment.
        this.drawQuestObjectiveLog(objective, x, logY);
      });
  }

  /**
   * Renders the log of the objective based on its current state.
   * @param {TrackedOmniObjective} objective The objective with the log to render.
   * @param {number} x The origin x.
   * @param {number} y The origin y.
   */
  drawQuestObjectiveLog(objective, x, y)
  {
    // the description is a header to the log.
    const descriptionText = this.modFontSizeForText(-4, objective.description());
    const description = `▫ ${descriptionText}`;
    const descriptionWidth = this.textWidth(description);

    // draw the log of the static description of the objective.
    this.drawTextEx(description, x, y, descriptionWidth);

    // the fulfillment text is a subheader to the log.
    const fulfillmentText = this.modFontSizeForText(-4, objective.fulfillmentText());
    const fulfillment = `    ${fulfillmentText}`;
    const fulfillmentWidth = this.textWidth(fulfillment);

    // draw the fulfillment text for the objective.
    const fulfillmentY = y + (this.lineHeight() / 2);
    this.drawTextEx(fulfillment, x, fulfillmentY, fulfillmentWidth);

    // the log has no special sizing or anything, but is slightly indented.
    const logText = objective.log();
    const logWidth = this.textWidth(logText);

    // draw the log of the current state of fulfillment.
    const logX = x + 40;
    const logY = y + this.lineHeight();
    this.drawTextEx(logText, logX, logY, logWidth);

    // and draw the icon indicating state.
    this.drawIcon(objective.iconIndexByState(), x, logY);
  }
}

//region Window_QuestopediaList
class Window_QuestopediaList extends Window_Command
{
  /**
   * The category that this list is being filtered by. When an empty string, no filter is applied.
   * @type {string}
   */
  _currentCategoryKey = String.empty;

  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Gets the current category key of quests being displayed in this list.
   * @returns {string}
   */
  getCurrentCategoryKey()
  {
    return this._currentCategoryKey;
  }

  /**
   * Sets the current category of quests to display in this list.
   * @param {string} categoryKey The quest category key.
   */
  setCurrentCategoryKey(categoryKey)
  {
    this._currentCategoryKey = categoryKey;
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
    // grab all possible quests.
    const questEntries = $gameParty.getQuestopediaEntries();

    // filter the quests by various criteria.
    const filteredQuests = questEntries.filter(this._questFiltering, this);

    // no quests to display.
    if (filteredQuests.length === 0) return [];

    // compile the list of commands.
    const commands = filteredQuests.map(this.buildCommand, this);

    // return the compiled list of commands.
    return commands;
  }

  /**
   * Determines whether or not this quest should be shown in the current list.
   * @param {TrackedOmniQuest} quest The quest in question.
   * @returns {boolean}
   */
  _questFiltering(quest)
  {
    const currentCategory = this.getCurrentCategoryKey();

    // if the current category is unset or empty, then no filtering is applied.
    if (currentCategory === String.empty) return true;

    // if the category key matches the current category, then this quest should be rendered.
    if (quest.categoryKey === currentCategory) return true;

    // this quest should not be rendered.
    return false;
  }

  /**
   * Builds a {@link BuiltWindowCommand} based on the quest data.
   * @param {TrackedOmniQuest} questopediaEntry The quest data.
   * @returns {BuiltWindowCommand} The built command based on this quest.
   */
  buildCommand(questopediaEntry)
  {
    // determine the name based on whether its known or not.
    const questName = questopediaEntry.isKnown()
      ? questopediaEntry.name()
      : J.BASE.Helpers.maskString(questopediaEntry.name());

    // if the quest is being tracked already, add a little emoji to indicate such.
    const trackedText = questopediaEntry.isTracked()
      ? "🔍"
      : String.empty;

    // check if the quest can actually be tracked in its current state.
    const canBeTracked = questopediaEntry.canBeTracked();

    // just-in-case cleanup of quests that can't be tracked any longer.
    if (!canBeTracked && questopediaEntry.isTracked())
    {
      questopediaEntry.toggleTracked();
    }

    // build a command based on the enemy.
    return new WindowCommandBuilder(questName)
      .setSymbol(questopediaEntry.key)
      .setExtensionData(questopediaEntry)
      .setIconIndex(this.determineQuestStateIcon(questopediaEntry))
      .setRightText(trackedText)
      .setEnabled(canBeTracked)
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
      case OmniQuest.States.Inactive:
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

//region Window_QuestopediaObjectives
class Window_QuestopediaObjectives extends Window_Command
{
  _currentObjectives = [];

  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Overrides {@link #itemHeight}.<br>
   * Makes the command rows bigger so there can be additional lines.
   * @returns {number}
   */
  itemHeight()
  {
    return this.lineHeight() * 2;
  }

  /**
   * Gets the quest objectives currently being rendered.
   * @returns {TrackedOmniObjective[]}
   */
  getCurrentObjectives()
  {
    return this._currentObjectives ?? [];
  }

  /**
   * Sets the quest objectives currently being rendered.
   * @param {TrackedOmniObjective[]} questObjectives The quest objectives to render in this list.
   */
  setCurrentObjectives(questObjectives)
  {
    this._currentObjectives = questObjectives ?? [];
  }

  /**
   * Implements {@link #makeCommandList}.<br>
   * Creates the command list of all known quests in this window.
   */
  makeCommandList()
  {
    // grab all the omnipedia listings available.
    const commands = this.buildCommands();

    if (commands.length === 0)
    {
      commands.push(this.buildNoObjectivesCommand());
    }


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
    // grab the current quest objectives.
    const objectives = this.getCurrentObjectives();
    if (objectives.length === 0) return [];

    // compile the list of commands.
    const commands = objectives
      // if an objective is inactive, it shouldn't be rendered at all.
      .filter(objective => objective.state !== OmniObjective.States.Inactive)
      .map(this.buildCommand, this);

    // return the compiled list of commands.
    return commands;
  }

  /**
   * Builds a {@link BuiltWindowCommand} based on the quest objective.
   * @param {TrackedOmniObjective} questObjective The quest objective data.
   * @returns {BuiltWindowCommand} The built command based on this objective.
   */
  buildCommand(questObjective)
  {
    // fix the size a bit.
    const text = this.modFontSizeForText(-4, questObjective.description());

    // build a command based on the enemy.
    return new WindowCommandBuilder(text)
      .setSymbol(questObjective.id)
      .setExtensionData(questObjective)
      .setIconIndex(questObjective.iconIndexByState())
      .addTextLine(questObjective.fulfillmentText() ?? String.empty)
      .flagAsMultiline()
      .build();
  }

  buildNoObjectivesCommand()
  {
    return new WindowCommandBuilder(String.empty)
      .setSymbol(0)
      .setExtensionData(null)
      .addTextLine("No known objectives for this quest.")
      .flagAsSubText()
      .build();
  }
}

//endregion Window_QuestopediaObjectives