//region RegionStateData
/**
 * A data class containing the various data points associated with a region that
 * may apply a state while standing upon it.
 */
class RegionStateData
{
  /**
   * The regionId this data class stores data for.
   * @type {number}
   */
  regionId = -1;

  /**
   * The stateId that can be applied when within this regionId.
   * @type {number}
   */
  stateId = 0;

  /**
   * The 1-100 integer percent chance of state application while within this regionId.
   * @type {number}
   */
  chance = 0;

  /**
   * The animationId to play when the state is infact applied.
   * @type {number}
   */
  animationId = 0;

  /**
   * Constructor.
   */
  constructor(regionId, stateId, chanceOfApplication = 100, animationId = 0)
  {
    this.regionId = regionId;
    this.stateId = stateId;
    this.chance = chanceOfApplication;
    this.animationId = animationId;
  }
}

//endregion RegionStateData

//region annotations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 REGIONS-STATES] Enables application of states via region ids.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-RegionEffects
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-RegionEffects
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin enables the ability to attempt to autoapply states based on the
 * region that a given character is standing upon while on the map.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * At set intervals while any charater on the map stands upon a given regionId,
 * the plugin will attempt to repeatedly apply a given state or states to the
 * character's battler.
 *
 * This plugin probably could've been developed to work without JABS to some
 * extent, but this was designed FOR JABS, so it is a required dependency.
 * ============================================================================
 * PLUGIN PARAMETERS:
 *  - Apply State Delay:
 *      The number of frames between states being applied.
 *      The lower this number, the more frequently states will be applied
 *        while standing on a tile with a region that applies states.
 *      Defaults to 15, aka roughly 4 times per second.
 * ============================================================================
 * REGION ADD STATE IDS:
 * Have you ever wanted to set some regionIds to apply states to characters on
 * the map? Well now you can! By applying the appropriate tags to the map
 * properties, you too can have states repeatedly applied to various battlers
 * on the map!
 *
 * NOTE ABOUT DUPLICATE TAGS:
 * Duplicate tags are allowed, in that they will stack not in effectiveness,
 * but instead in application. Having multiple tags for the same region, and
 * even the same stateId, will tell the plugin to simply attempt to apply the
 * state multiple times.
 *
 * NOTE ABOUT STATE APPLICATIONS:
 * The CHANCE component of the tag as described below represents the "default"
 * chance of application of a state against a battler. It is important to note
 * that this chance does not include potential resistances or weaknesses to the
 * state, meaning if a battler had a severe weakness (1000% chance) to a given
 * stateId but the tag was less than 100%, the math may work out in such a way
 * that the calculated chance of application is actually higher, potentially
 * guaranteeing success of application despite putting less than 100% chance in
 * the tag.
 *
 * NOTE ABOUT ANIMATION IDS:
 * It is important to note that large amounts of animations playing on the
 * screen simultaneously is incredibly non-performant. Do be cautious when
 * slapping these tags on maps with the ANIMATION_ID value provided. It may be
 * a good idea to consider using low percentage of application when also using
 * the ANIMATION_ID functionality so it does not trigger constantly.
 *
 * TAG USAGE:
 * - Map [Properties]
 *
 * TAG FORMAT:
 *  <regionAddState:[REGION_ID, STATE_ID, CHANCE?, ANIMATION_ID?]>
 * Where REGION_ID is the region that can apply the state.
 * Where STATE_ID is the state being applied by the region.
 * Where CHANCE? is an 1-100 integer chance of applying the state.
 *  (the CHANCE can be omitted and it will default to 100% application chance)
 *  (if setting an animation id is desired, CHANCE cannot be omitted)
 * Where ANIMATION_ID? is the id of the animation to play upon application.
 *  (the ANIMATION_ID can be omitted and it will default to no animation)
 *
 * TAG EXAMPLES:
 *  <regionAddState:[1, 3, 25, 4]>
 * A tile marked with the region id of 1, will apply state of id 3,
 * with a (default) 25% chance of success. The animation of id 4 will be
 * played on the character upon application.
 *
 *  <regionAddState:[1, 3, 25]>
 *  <regionAddState:[1, 4, 30]>
 *  <regionAddState:[1, 4, 50]>
 *  <regionAddState:[2, 4, 100]>
 * A tile marked with the region id of 1, will apply state 3 at 25% chance,
 * will apply state 4 at 30% chance, and again apply state 4 at a higher 50%
 * chance.
 * A tile marked with the region id of 2 will apply state 4 at a 100% chance.
 * No animations will play upon application of any of these states.
 *
 *  <regionAddState:[12, 40]>
 * A tile marked with region id of 12 will apply state of id 40 with 100%
 * chance while the player  continues to stand upon it.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 * @param application-delay
 * @type number
 * @text Apply State Delay
 * @desc The number of frames between state applications.
 * Adjust this to make states apply more or less frequently.
 * @default 15
 */
//endregion annotations

//region plugin metadata
class J_RegionStatesPluginMetadata extends PluginMetadata
{
  /**
   * Constructor.
   */
  constructor(name, version)
  {
    super(name, version);
  }

  /**
   *  Extends {@link #postInitialize}.<br>
   *  Includes translation of plugin parameters.
   */
  postInitialize()
  {
    // execute original logic.
    super.postInitialize();

    //this.version.satisfiesPluginVersion(J_RegionPluginMetadata.version);

    /**
     * The number of frames between applying the state associated with the given regionId.<br>
     * Lower this to increase frequency of state application.<br>
     * Raise this to reduce frequency of state application.<br>
     * This only applies while a battler is standing on a tile with a valid region state.
     * @type {number}
     */
    this.delayBetweenApplications = this.parsedPluginParameters['application-delay'] ?? 15;
  }
}

//endregion plugin metadata

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all extensions related to the parent.
 */
J.REGIONS.EXT ||= {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.REGIONS.EXT.STATES = {};

/**
 * The metadata associated with this plugin, such as name and version.
 */
J.REGIONS.EXT.STATES.Metadata = new J_RegionStatesPluginMetadata('J-Region-States', '1.0.0');

/**
 * A collection of all aliased methods for this plugin.
 */
J.REGIONS.EXT.STATES.Aliased = {};
J.REGIONS.EXT.STATES.Aliased.Game_Character = new Map();
J.REGIONS.EXT.STATES.Aliased.Game_Map = new Map();
J.REGIONS.EXT.STATES.Aliased.Game_System = new Map();

/**
 * All regular expressions used by this plugin.
 */
J.REGIONS.EXT.STATES.RegExp = {};
J.REGIONS.EXT.STATES.RegExp.RegionState = /<regionAddState:[ ]?(\[\d+, ?\d+, ?\d+, ?\d+])>/gi;


//region Game_Character
/**
 * Extends {@link #initMembers}.<br>
 * Also initializes the region states members.
 */
J.REGIONS.EXT.STATES.Aliased.Game_Character.set('initMembers', Game_Character.prototype.initMembers);
Game_Character.prototype.initMembers = function()
{
  // perform original logic.
  J.REGIONS.EXT.STATES.Aliased.Game_Character.get('initMembers')
    .call(this);

  // initialize the additional members.
  this.initRegionStatesMembers();
};

/**
 * Initializes all members associated with region states.
 */
Game_Character.prototype.initRegionStatesMembers = function()
{
  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with REGIONS.
   */
  this._j._regions ||= {};

  /**
   * A grouping of all properties associated with the region states plugin extension.
   */
  this._j._regions._states = {};

  /**
   * The timer that manages the (re)application of region-derived states.
   * @type {JABS_Timer}
   */
  this._j._regions._states._timer = new JABS_Timer(J.REGIONS.EXT.STATES.Metadata.delayBetweenApplications);
};

/**
 * Gets the region states timer for this character.
 * @return {JABS_Timer}
 */
Game_Character.prototype.getRegionStatesTimer = function()
{
  return this._j._regions._states._timer;
};

/**
 * Extends {@link #update}.<br>
 * Also handles region states updates for the character.
 */
J.REGIONS.EXT.STATES.Aliased.Game_Character.set('update', Game_Character.prototype.update);
Game_Character.prototype.update = function()
{
  // perform original logic.
  J.REGIONS.EXT.STATES.Aliased.Game_Character.get('update')
    .call(this);

  // apply the various region states if applicable.
  this.handleRegionStates();
};

/**
 * Handles processing of the region states functionality.
 */
Game_Character.prototype.handleRegionStates = function()
{
  // check to make sure we can even process region states for this character.
  if (!this.canHandleRegionStates()) return;

  // grab the timer.
  const timer = this.getRegionStatesTimer();

  // first, update it.
  timer.update();

  // now check if the timer is complete.
  if (timer.isTimerComplete())
  {
    // reset completed timers.
    timer.reset();

    // attempt to apply all the region states.
    this.applyRegionStates();
  }
};

/**
 * Checks if this character should process their own region states.
 * @return {boolean}
 */
Game_Character.prototype.canHandleRegionStates = function()
{
  // if this character is a vehicle, then they cannot handle region states.
  if (this.isVehicle()) return false;

  // if this character has no battler, then they cannot handle region states.
  if (!this.hasJabsBattler()) return false;

  // they probably can have region states applied!
  return true;
};

/**
 * Applies all relevant region states based on their regionId.
 */
Game_Character.prototype.applyRegionStates = function()
{
  // grab all the current region states by this regionId.
  const regionStateDatas = this.getRegionStatesByCurrentRegionId();

  // if there are no region states to apply, then they cannot handle region states.
  if (regionStateDatas.length === 0) return;

  // grab the battler associated with this character.
  const battler = this.getJabsBattler()
    .getBattler();

  // iterate over each of the region states to apply it.
  regionStateDatas.forEach(regionStateData =>
  {
    // deconstruct the region state data.
    const { stateId, chance, animationId } = regionStateData;

    // get the calculated rate for the state being applied.
    const calculatedChance = battler.stateRate(stateId) * chance;

    // roll the dice and see if we should even apply it.
    if (!RPGManager.chanceIn100(calculatedChance)) return;

    // apply the state.
    battler.addState(stateId);

    // check if there is a valid animation to play.
    if (animationId > 0)
    {
      // trigger the animation.
      this.requestAnimation(animationId);
    }
  });
};

/**
 * Gets all {@link RegionStateData}s associated with this character's current regionId.
 * @return {RegionStateData[]}
 */
Game_Character.prototype.getRegionStatesByCurrentRegionId = function()
{
  // grab the current regionId.
  const regionId = this.regionId();

  // return all found region states by the current regionId.
  return $gameMap.getRegionStatesByRegionId(regionId);
};
//endregion Game_Character

//region Game_Map
/**
 * Extends {@link #initialize}.<br>
 * Also initializes the region states properties.
 */
J.REGIONS.EXT.STATES.Aliased.Game_Map.set('initialize', Game_Map.prototype.initialize);
Game_Map.prototype.initialize = function()
{
  // perform original logic.
  J.REGIONS.EXT.STATES.Aliased.Game_Map.get('initialize')
    .call(this);

  // initialize the region states.
  this.initRegionStatesMembers();
};

//region properties
/**
 * Initializes all region states properties for the map.
 */
Game_Map.prototype.initRegionStatesMembers = function()
{
  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * The grouping of all properties related to region effects.
   */
  this._j._regions ||= {};

  /**
   * The grouping of all properties related specifically to the region states extension.
   */
  this._j._regions._states = {};

  /**
   * A map keyed by regionId of all stateIds that are applied while the character is
   * on a tile marked by the keyed regionId.
   * @type {Map<number,RegionStateData[]>}
   */
  this._j._regions._states._map = new Map();
};

/**
 * Gets the dictionary currently tracking the regionId:stateId[] for the map.
 * @return {Map<number,RegionStateData[]>}
 */
Game_Map.prototype.getRegionStates = function()
{
  return this._j._regions._states._map;
};

/**
 * Gets all stateIds to be applied on characters standing on the given regionId.
 * @return {RegionStateData[]}
 */
Game_Map.prototype.getRegionStatesByRegionId = function(regionId)
{
  return this.getRegionStates()
    .get(regionId) ?? Array.empty;
};

/**
 * Sets the stateIds to the given regionId.
 * @param {number} regionId The regionId to update with new stateIds.
 * @param {RegionStateData} regionStateData The new region state data to add to the regionId.
 */
Game_Map.prototype.addRegionStateDataByRegionId = function(regionId, regionStateData)
{
  // grab the current tracker.
  const regionStates = this.getRegionStates();

  // check if the regionId has yet to be added to the tracker.
  if (!regionStates.has(regionId))
  {
    // add it with the given stateIds.
    regionStates.set(regionId, [ regionStateData ]);
  }
  // the regionId is already being tracked.
  else
  {
    // grab the current stateIds.
    const currentRegionStateDatas = regionStates.get(regionId);

    // add the new and the old- they stack if the dev wants them to.
    const newRegionStateDatas = currentRegionStateDatas.concat(regionStateData);

    // reassign the regionId with the added stateIds.
    regionStates.set(regionId, newRegionStateDatas);
  }
};
//endregion properties

/**
 * Extends {@link #setup}.<br>
 * Also initializes this map's region-state data.
 */
J.REGIONS.EXT.STATES.Aliased.Game_Map.set('setup', Game_Map.prototype.setup);
Game_Map.prototype.setup = function(mapId)
{
  // perform original logic.
  J.REGIONS.EXT.STATES.Aliased.Game_Map.get('setup')
    .call(this, mapId);

  // setup the region state data.
  this.setupRegionStates();
};

/**
 * Sets up the region states based on tags for this map.
 */
Game_Map.prototype.setupRegionStates = function()
{
  // clear the existing states.
  this.clearRegionStates();

  // refresh the existing states.
  this.refreshRegionStates();
};

/**
 * Clears all region states that have been configured for this map.
 */
Game_Map.prototype.clearRegionStates = function()
{
  // grab the current tracker.
  const regionStates = this.getRegionStates();

  // clear all the tracking.
  regionStates.clear();
};

/**
 * Refreshes the region states on this map.
 */
Game_Map.prototype.refreshRegionStates = function()
{
  // if we cannot refresh region effects, we cannot refresh region states, either.
  if (!this.canRefreshRegionEffects()) return;

  // grab the region data.
  const regionStatesData = RPGManager.getArraysFromNotesByRegex({ note: this.note() },
    J.REGIONS.EXT.STATES.RegExp.RegionState,
    true);

  // stop processing if there was nothing found.
  if (!regionStatesData || !regionStatesData.length) return;

  // iterate over all the found datas for processing.
  regionStatesData.forEach(regionStateData =>
  {
    // deconstruct the data.
    const [ regionId, stateId, chanceOfApplication, animationId ] = regionStateData;

    // generate the new data based on the tag.
    const newRegionStateData = new RegionStateData(regionId, stateId, chanceOfApplication, animationId);

    // add the new data.
    this.addRegionStateDataByRegionId(regionId, newRegionStateData);
  });
};
//endregion Game_Map

//region Game_System
/**
 * Updates the region states after loading a game.
 */
J.REGIONS.EXT.STATES.Aliased.Game_System.set('onAfterLoad', Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function()
{
  // perform original logic.
  J.REGIONS.EXT.STATES.Aliased.Game_System.get('onAfterLoad')
    .call(this);

  // update from the latest plugin metadata.
  this.updateRegionStatesAfterLoad();
};

/**
 * Re-initializes the region states for the map and characters.
 */
Game_System.prototype.updateRegionStatesAfterLoad = function()
{
  $gameMap.initRegionStatesMembers();
  $gameMap.setupRegionStates();
  $gamePlayer.initRegionStatesMembers();
  $gamePlayer.followers()
    .data()
    .forEach(follower => follower.initRegionStatesMembers());
};

//endregion Game_System