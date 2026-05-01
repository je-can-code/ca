//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 PASSIVE-OTIB] One-Time Item Boosts as permanent passive states.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-Passive
 * @orderAfter J-Base
 * @orderAfter J-Passive
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is an extension of J-Passive that implements One-Time Item
 * Boosts (OTIB): consuming a tagged item permanently grants the actor one
 * or more database States whose Traits carry the actual stat effects.
 *
 * Those states are fed through J-Passive's pipeline so they appear alongside
 * all other passive contributors and can be inspected in Scene_Passive.
 *
 * Integrates with others of mine plugins:
 * - J-Base; required by all JE plugins.
 * - J-Passive; provides the passive state pipeline and the Passive Viewer.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * Unlike the legacy OTIB implementation, this plugin does NOT patch param /
 * xparam / sparam directly. All stat effects are expressed through database
 * State Traits, giving designers full control over what each item unlocks.
 *
 * Unlock records are persisted on each actor as plain JSON-safe data and are
 * rebuilt into the passive pipeline on every refreshPassiveStates() call,
 * so no custom serialization classes are needed.
 *
 * ============================================================================
 * ITEM BOOST NOTETAG
 * To make an item grant permanent passive states when consumed, apply the
 * following notetag to the item in the database.
 *
 * TAG USAGE:
 * - Items (consumable, "All" or "Battle / Menu" occasion)
 *
 * TAG FORMAT:
 *  <otib:[STATE_ID]>
 *  <otib:[STATE_ID, STATE_ID, ...]>
 *    Where STATE_ID is the numeric id of a database State.
 *    Multiple ids are supported; all will be unlocked on first consume.
 *
 * TAG EXAMPLES:
 *  <otib:[42]>
 *    Consuming this item permanently grants State 42 as a passive.
 *
 *  <otib:[42, 55]>
 *    Consuming this item permanently grants both State 42 and State 55.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 */
//endregion annotations

//region plugin metadata
class JPassiveOTIB_PluginMetadata
  extends PluginMetadata
{
  /**
   * Constructor.
   */
  constructor(name, version)
  {
    super(name, version);
  }

  /**
   * Extends {@link #postInitialize}.<br>
   * Includes translation of plugin parameters.
   */
  postInitialize()
  {
    // execute original logic.
    super.postInitialize();

    // initialize this plugin from configuration.
    this.initializeMetadata();
  }

  /**
   * Initializes the metadata associated with this plugin.
   */
  initializeMetadata()
  {
    /**
     * The id of a switch that represents whether or not this scene is accessible in the menu.
     * @type {number}
     */
    this.menuSwitchId = parseInt(this.parsedPluginParameters['menu-switch']);
  }
}

//endregion plugin metadata

//region initialization
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.PASSIVE.EXT.OTIB = {};

/**
 * The metadata associated with this plugin.
 */
J.PASSIVE.EXT.OTIB.Metadata = new JPassiveOTIB_PluginMetadata('J-Passive-OTIB', '1.0.0');

/**
 * A collection of all aliased methods for this plugin.
 */
J.PASSIVE.EXT.OTIB.Aliased = {};
J.PASSIVE.EXT.OTIB.Aliased.Game_Actor = new Map();
J.PASSIVE.EXT.OTIB.Aliased.Game_Battler = new Map();
J.PASSIVE.EXT.OTIB.Aliased.Scene_Boot = new Map();

/**
 * All regular expressions used by this plugin.
 */
J.PASSIVE.EXT.OTIB.RegExp = {};

/**
 * The tag for one-time item boost state ids on an item.
 * Expected format: <otib:[STATE_ID, ...]>
 */
J.PASSIVE.EXT.OTIB.RegExp.OtibStateIds = /<otib:[ ]?(\[[\d, ]+])>/i;
//endregion initialization

//region plugin commands
// no plugin commands for this extension.
//endregion plugin commands

//region OtibUnlockRecord
/**
 * Represents a single OTIB unlock: the item that was consumed and the state ids it granted.
 *
 * Stored as-is in the actor's save data; the fields are plain JSON-safe primitives so
 * no custom JsonEx serialization class is needed.
 */
class OtibUnlockRecord
{
  /**
   * Constructor.
   * @param {number} itemId The id of the item that was consumed to earn this unlock.
   * @param {number[]} stateIds The passive state ids permanently granted by consuming that item.
   */
  constructor(itemId, stateIds)
  {
    /**
     * The id of the database item that triggered this unlock.
     * @type {number}
     */
    this.itemId = itemId;

    /**
     * The passive state ids granted by this unlock.
     * Derived from the item's <otib:[...]> notetag at the time of consumption.
     * @type {number[]}
     */
    this.stateIds = stateIds;
  }
}

SerializableRegistry.register(OtibUnlockRecord);

//endregion OtibUnlockRecord

//region RPG_Item
//region otib state ids
/**
 * The state ids to be permanently granted as passives when this item is consumed.
 * Reads the <otib:[N, ...]> notetag from the item's notebox.
 * An empty array means this item has no OTIB unlock associated with it.
 * @type {number[]}
 */
Object.defineProperty(RPG_Item.prototype, "otibStateIds", {
  get: function()
  {
    return RPGManager.getNumbersFromNoteByRegex(this, J.PASSIVE.EXT.OTIB.RegExp.OtibStateIds);
  },
});
//endregion otib state ids
//endregion RPG_Item

//region Game_Actor
/**
 * Extends {@link #initMembers}.<br>
 * Also initializes the OTIB unlock storage for this actor.
 */
J.PASSIVE.EXT.OTIB.Aliased.Game_Actor.set('initMembers', Game_Actor.prototype.initMembers);
Game_Actor.prototype.initMembers = function()
{
  // perform original logic.
  J.PASSIVE.EXT.OTIB.Aliased.Game_Actor.get('initMembers')
    .call(this);

  // initialize the otib properties.
  this.initOtibMembers();
};

/**
 * Initializes the OTIB unlock storage on this actor.
 */
Game_Actor.prototype.initOtibMembers = function()
{
  this._j ||= {};

  /**
   * A grouping of all properties associated with OTIB.
   */
  this._j._otib ||= {};

  /**
   * The persisted list of all OTIB unlocks earned by this actor.
   * Each entry is an {@link OtibUnlockRecord} mapping an item id to the states it granted.
   * @type {OtibUnlockRecord[]}
   */
  this._j._otib._unlocks ||= [];
};

/**
 * Gets all OTIB unlock records for this actor.
 * @returns {OtibUnlockRecord[]}
 */
Game_Actor.prototype.otibUnlocks = function()
{
  return this._j._otib._unlocks;
};

/**
 * Adds a new unlock record to this actor's OTIB history.
 * @param {OtibUnlockRecord} record The unlock record to persist.
 */
Game_Actor.prototype.addOtibUnlock = function(record)
{
  this.otibUnlocks()
    .push(record);
};

/**
 * Gets a flat array of all state ids currently granted to this actor via OTIB.
 * Used by the passive viewer's tab filter to identify which passive states came from OTIB.
 * @returns {number[]}
 */
Game_Actor.prototype.otibPassiveStateIds = function()
{
  return this.otibUnlocks()
    .flatMap(unlock => unlock.stateIds);
};

/**
 * Determines whether or not this actor has already unlocked the OTIB for the given item.
 * @param {number} itemId The id of the item to check.
 * @returns {boolean} True if the unlock record exists for this item, false otherwise.
 */
Game_Actor.prototype.isOtibUnlocked = function(itemId)
{
  return this.otibUnlocks()
    .some(unlock => unlock.itemId === itemId);
};

/**
 * Overrides {@link Game_Battler#handleOtibUnlock} with the real actor implementation.<br>
 * Checks whether this item has an OTIB notetag and, if so, persists the unlock record
 * and refreshes the passive pipeline so the granted states take effect immediately.
 * When J-Log is present, fires a DiaLog message for each newly unlocked state.
 * @param {RPG_Item} item The item that was consumed.
 */
Game_Actor.prototype.handleOtibUnlock = function(item)
{
  // items with no OTIB notetag are not part of this system.
  const stateIds = item.otibStateIds;
  if (stateIds.length === 0) return;

  // skip if this actor already earned the unlock for this item.
  if (this.isOtibUnlocked(item.id)) return;

  // persist the unlock record so it survives save/load.
  this.addOtibUnlock(new OtibUnlockRecord(item.id, stateIds));

  // rebuild the passive pipeline to include the newly unlocked states.
  this.refreshPassiveStates();

  // notify the player of each newly unlocked state via DiaLog when J-Log is loaded.
  if (J.LOG && $diaLogManager)
  {
    this.notifyOtibUnlock(item, stateIds);
  }
};

/**
 * Fires one DiaLog message per unlocked state, telling the player what was gained.
 * Falls through silently if $diaLogManager is not yet available on the scene.
 * @param {RPG_Item} item The item that triggered the unlock.
 * @param {number[]} stateIds The state ids that were just unlocked.
 */
Game_Actor.prototype.notifyOtibUnlock = function(item, stateIds)
{
  stateIds.forEach(stateId =>
  {
    const state = $dataStates[stateId];
    const stateName = state ? state.name : `unknown effect`;
    const message = `Consuming the ${item.name} unlocked ${stateName} effect!`;
    const log = new DiaLogBuilder()
      .addLine(message)
      .build();
    $diaLogManager.addLog(log);
  });
};

/**
 * Extends {@link #getPassiveStateSources}.<br>
 * Injects OTIB-derived synthetic passive sources so the pipeline picks them up
 * on every refresh without needing to persist RPG_BaseItem instances.
 * @returns {(RPG_Actor|RPG_Class|RPG_Skill|RPG_EquipItem|RPG_State|RPG_BaseItem)[]}
 */
J.PASSIVE.EXT.OTIB.Aliased.Game_Actor.set('getPassiveStateSources', Game_Actor.prototype.getPassiveStateSources);
Game_Actor.prototype.getPassiveStateSources = function()
{
  // perform original logic.
  const sources = J.PASSIVE.EXT.OTIB.Aliased.Game_Actor.get('getPassiveStateSources')
    .call(this);

  // append one synthetic source per OTIB unlock so the passive pipeline sees them.
  sources.push(...this.buildOtibPassiveSources());

  // return the combined source list.
  return sources;
};

/**
 * Builds a synthetic {@link RPG_BaseItem} per OTIB unlock so the passive pipeline
 * can derive state ids from them via the standard <passive:[...]> note format.
 * @returns {RPG_BaseItem[]}
 */
Game_Actor.prototype.buildOtibPassiveSources = function()
{
  return this.otibUnlocks()
    .map(unlock => this.buildSourceFromStateIds(unlock.stateIds));
};
//endregion Game_Actor

//region Game_Battler
/**
 * A no-op base implementation of the OTIB unlock handler for non-actor battlers.
 * Enemies and other non-actor battlers do not participate in the OTIB system,
 * so consuming an item on their behalf never triggers an unlock.
 * @param {RPG_Item} item The item that was consumed.
 */
// eslint-disable-next-line no-unused-vars
Game_Battler.prototype.handleOtibUnlock = function(item)
{
};

/**
 * Extends {@link #consumeItem}.<br>
 * After the item is consumed, gives this battler a chance to handle any OTIB unlock.
 * Actors override {@link #handleOtibUnlock} with the real unlock logic; all others no-op.
 * @param {RPG_Item} item The item being consumed.
 */
J.PASSIVE.EXT.OTIB.Aliased.Game_Battler.set('consumeItem', Game_Battler.prototype.consumeItem);
Game_Battler.prototype.consumeItem = function(item)
{
  // perform original logic.
  J.PASSIVE.EXT.OTIB.Aliased.Game_Battler.get('consumeItem')
    .call(this, item);

  // delegate to the battler-type-specific OTIB handler.
  this.handleOtibUnlock(item);
};
//endregion Game_Battler

//region Scene_Boot
/**
 * Extends {@link #onDatabaseLoaded}.<br>
 * Registers the OTIB tab with the passive viewer once the database is available.
 */
J.PASSIVE.EXT.OTIB.Aliased.Scene_Boot.set('onDatabaseLoaded', Scene_Boot.prototype.onDatabaseLoaded);
Scene_Boot.prototype.onDatabaseLoaded = function()
{
  // perform original logic.
  J.PASSIVE.EXT.OTIB.Aliased.Scene_Boot.get('onDatabaseLoaded')
    .call(this);

  // register the OTIB tab so Scene_Passive can display it.
  Scene_Passive.registerTab({
    key: 'otib',
    label: 'Item Boosts',

    // filter function: a passive state qualifies for this tab if the actor
    // earned it through an OTIB unlock rather than equipment, class, or skills.
    filter: (stateId, actor) => actor.otibPassiveStateIds()
      .includes(stateId),
  });
};
//endregion Scene_Boot

//# sourceMappingURL=J-Passive-OTIB.js.map
