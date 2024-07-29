//region RegionSkillData
/**
 * A data class containing the various data points associated with a region that
 * may execute a skill while standing upon it.
 */
class RegionSkillData
{
  /**
   * The regionId this data class stores data for.
   * @type {number}
   */
  regionId = -1;

  /**
   * The skillId that can be executed while within this regionId.
   * @type {number}
   */
  skillId = 0;

  /**
   * The 1-100 integer percent chance of skill execution while within this regionId.
   * @type {number}
   */
  chance = 0;

  /**
   * The id of the enemy whose stats will power this skill execution.
   * @type {number}
   */
  casterId = 0;

  /**
   * Whether or not this region skill execution is considered friendly towards the player.
   * @type {boolean}
   */
  isFriendly = false;

  /**
   * Constructor.
   */
  constructor(regionId, stateId, chanceOfApplication = 100, casterId = 0, isFriendly = false)
  {
    this.regionId = regionId;
    this.skillId = stateId;
    this.chance = chanceOfApplication;
    this.casterId = casterId;
    this.isFriendly = isFriendly;
  }
}
//endregion RegionSkillData

//region annoations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 REGIONS-SKILLS] Enables execution of skills via region ids.
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
 * This plugin enables the ability to attempt to auto-execute skills based on
 * the region that a given character is standing upon while on the map.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * At set intervals while any charater on the map stands upon a given regionId,
 * the plugin will attempt to repeatedly execute a given skill or skills
 * against the battler.
 *
 * This plugin probably could've been developed to work without JABS to some
 * extent, but this was designed FOR JABS, so it is a required dependency.
 * ============================================================================
 * TODO: Fill this in with details.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 * @param execution-delay
 * @type number
 * @text Execute Skill Delay
 * @desc The number of frames between skill executions.
 * Adjust this to make skills execute more or less frequently.
 * @default 60
 */
//endregion annotations

//region plugin metadata
class J_RegionSkillsPluginMetadata extends PluginMetadata
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

    // initialize this plugin from configuration.
    this.initializeMetadata();
  }

  /**
   * Initializes the metadata associated with this plugin.
   */
  initializeMetadata()
  {
    /**
     * The number of frames between executing while standing on the given regionId.<br>
     * Lower this to increase frequency of skill execution.<br>
     * Raise this to reduce frequency of skill execution.<br>
     * This only applies while a battler is standing on a tile with a valid region skill.
     * @type {number}
     */
    this.delayBetweenExecutions = this.parsedPluginParameters['execution-delay'] ?? 60;
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
J.REGIONS.EXT.SKILLS = {};

/**
 * The plugin umbrella that governs all extensions related to the parent.
 */
J.REGIONS.EXT.SKILLS.EXT ||= {};

/**
 * The metadata associated with this plugin.
 */
J.REGIONS.EXT.SKILLS.Metadata = new J_RegionSkillsPluginMetadata('J-Region-Skills', '1.0.0');

/**
 * A collection of all aliased methods for this plugin.
 */
J.REGIONS.EXT.SKILLS.Aliased = {};
J.REGIONS.EXT.SKILLS.Aliased.Game_Character = new Map();
J.REGIONS.EXT.SKILLS.Aliased.Game_Map = new Map();
J.REGIONS.EXT.SKILLS.Aliased.Game_System = new Map();

/**
 * All regular expressions used by this plugin.
 */
J.REGIONS.EXT.SKILLS.RegExp = {};
J.REGIONS.EXT.SKILLS.RegExp.RegionSkill = /<regionSkill:[ ]?(\[\d+, ?\d+, ?\d+, ?\d+, ?(true|false)])>/gi;
//endregion initialization

//region plugin commands

//endregion plugin commands

//region JABS_Engine

/**
 * The enemy used by the engine for map damage skill executions.
 * @type {JABS_Battler}
 */
JABS_Engine.prototype.mapDamageBattler = null;

/**
 * The enemy used by the engine for map damage skill executions.
 * @type {JABS_Battler}
 */
JABS_Engine.prototype.getMapDamageBattler = function()
{
  return this.mapDamageBattler;
};

/**
 * Initializes a new {@link JABS_Battler} based on the given id.<br/>
 * This dummy enemy is used for things like forced skill executions on
 * the map needing an enemy to execute.
 * @param {number} dummyEnemyId The id of the enemy in the database to represent the dummy.
 * @param {boolean} isFriendly Whether or not this dummy is an allied dummy.
 */
JABS_Engine.prototype.setMapDamageBattler = function(dummyEnemyId, isFriendly)
{
  const coreData = JABS_BattlerCoreData.Builder()
    .setBattlerId(dummyEnemyId)
    .isDummy(isFriendly)
    .build();
  this.mapDamageBattler = new JABS_Battler(
    $gamePlayer, // irrelevant, but should be some event/character on the current map.
    $gameEnemies.enemy(dummyEnemyId),
    coreData);
};
//endregion JABS_Engine

//region Game_Character
/**
 * Extends {@link #initMembers}.<br>
 * Also initializes the region skills members.
 */
J.REGIONS.EXT.SKILLS.Aliased.Game_Character.set('initMembers', Game_Character.prototype.initMembers);
Game_Character.prototype.initMembers = function()
{
  // perform original logic.
  J.REGIONS.EXT.SKILLS.Aliased.Game_Character.get('initMembers')
    .call(this);

  // initialize the additional members.
  this.initRegionSkillsMembers();
};

/**
 * Initializes all members associated with region states.
 */
Game_Character.prototype.initRegionSkillsMembers = function()
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
   * A grouping of all properties associated with the region skills plugin extension.
   */
  this._j._regions._skills = {};

  /**
   * The timer that manages the (re)execution of region-derived skills.
   * @type {JABS_Timer}
   */
  this._j._regions._skills._timer = new JABS_Timer(J.REGIONS.EXT.SKILLS.Metadata.delayBetweenExecutions);
};

/**
 * Gets the region skills timer for this character.
 * @return {JABS_Timer}
 */
Game_Character.prototype.getRegionSkillsTimer = function()
{
  return this._j._regions._skills._timer;
};

/**
 * Extends {@link #update}.<br>
 * Also handles region skills updates for the character.
 */
J.REGIONS.EXT.SKILLS.Aliased.Game_Character.set('update', Game_Character.prototype.update);
Game_Character.prototype.update = function()
{
  // perform original logic.
  J.REGIONS.EXT.SKILLS.Aliased.Game_Character.get('update')
    .call(this);

  // execute the various region skills if applicable.
  this.handleRegionSkills();
};

/**
 * Handles processing of the region states functionality.
 */
Game_Character.prototype.handleRegionSkills = function()
{
  // check to make sure we can even process region states for this character.
  if (!this.canHandleRegionSkills()) return;

  // grab the timer.
  const timer = this.getRegionSkillsTimer();

  // first, update it.
  timer.update();

  // now check if the timer is complete.
  if (timer.isTimerComplete())
  {
    // reset completed timers.
    timer.reset();

    // attempt to apply all the region states.
    this.executeRegionSkills();
  }
};

/**
 * Checks if this character should process their own region skills.
 * @return {boolean}
 */
Game_Character.prototype.canHandleRegionSkills = function()
{
  // if this character is a vehicle, then they cannot handle region skills.
  if (this.isVehicle()) return false;

  // if this character has no battler, then they cannot handle region skills.
  if (!this.hasJabsBattler()) return false;

  // they probably can have region skills executed!
  return true;
};

/**
 * Executes all relevant region skills based on their regionId.
 */
Game_Character.prototype.executeRegionSkills = function()
{
  // grab all the current region states by this regionId.
  const regionSkillDatas = this.getRegionSkillsByCurrentRegionId();

  // if there are no region states to apply, then they cannot handle region states.
  if (regionSkillDatas.length === 0) return;

  // grab the battler associated with this character.
  const targetJabsBattler = this.getJabsBattler();

  // iterate over each of the region states to apply it.
  regionSkillDatas.forEach(regionSkillData =>
  {
    // deconstruct the region skill data.
    const { skillId, chance, casterId, isFriendly } = regionSkillData;

    // roll the dice and see if we should even execute it.
    if (!RPGManager.chanceIn100(chance)) return;

    // grab the current dummy for inspection.
    const currentDummyCaster = $jabsEngine.getMapDamageBattler();

    // validations for whether or not we need to update the dummy casting the skill.
    const correctCaster = currentDummyCaster?.getBattlerId() === casterId;
    const correctTeam = currentDummyCaster?.isFriendlyTeam(targetJabsBattler.getTeam()) === isFriendly;

    // make sure we're using the right dummy.
    if (!correctCaster || !correctTeam)
    {
      // we weren't using the right dummy, so update it.
      $jabsEngine.setMapDamageBattler(casterId, isFriendly);
    }

    // execute the skill.
    $jabsEngine.forceMapAction(
      $jabsEngine.getMapDamageBattler(),
      skillId,
      false,
      targetJabsBattler.getX(),
      targetJabsBattler.getY(),
      true);
  });
};

/**
 * Gets all {@link RegionSkillData}s associated with this character's current regionId.
 * @return {RegionSkillData[]}
 */
Game_Character.prototype.getRegionSkillsByCurrentRegionId = function()
{
  // grab the current regionId.
  const regionId = this.regionId();

  // return all found region states by the current regionId.
  return $gameMap.getRegionSkillsByRegionId(regionId);
};
//endregion Game_Character

//region Game_Map
/**
 * Extends {@link #initialize}.<br>
 * Also initializes the region skills properties.
 */
J.REGIONS.EXT.SKILLS.Aliased.Game_Map.set('initialize', Game_Map.prototype.initialize);
Game_Map.prototype.initialize = function()
{
  // perform original logic.
  J.REGIONS.EXT.SKILLS.Aliased.Game_Map.get('initialize')
    .call(this);

  // initialize the region states.
  this.initRegionSkillsMembers();
};

//region properties
/**
 * Initializes all region states properties for the map.
 */
Game_Map.prototype.initRegionSkillsMembers = function()
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
   * The grouping of all properties related specifically to the region skills extension.
   */
  this._j._regions._skills = {};

  /**
   * A map keyed by regionId of all {@link RegionSkillData}s that apply while the character is on a tile
   * marked by the keyed regionId.
   * @type {Map<number,RegionSkillData[]>}
   */
  this._j._regions._skills._map = new Map();
};

/**
 * Gets the dictionary currently tracking the regions and skill data executions for the map.
 * @return {Map<number,RegionSkillData[]>}
 */
Game_Map.prototype.getRegionSkills = function()
{
  return this._j._regions._skills._map;
};

/**
 * Gets all skillIds to be executed against characters standing on the given regionId.
 * @return {RegionSkillData[]}
 */
Game_Map.prototype.getRegionSkillsByRegionId = function(regionId)
{
  return this.getRegionSkills()
    .get(regionId) ?? Array.empty;
};

/**
 * Sets the skillIds to the given regionId.
 * @param {number} regionId The regionId to update with new stateIds.
 * @param {RegionSkillData} regionSkillData The new region state data to add to the regionId.
 */
Game_Map.prototype.addRegionSkillDataByRegionId = function(regionId, regionSkillData)
{
  // grab the current tracker.
  const regionSkills = this.getRegionSkills();

  // check if the regionId has yet to be added to the tracker.
  if (!regionSkills.has(regionId))
  {
    // add it with the given stateIds.
    regionSkills.set(regionId, [ regionSkillData ]);
  }
  // the regionId is already being tracked.
  else
  {
    // grab the current stateIds.
    const currentRegionSkillDatas = regionSkills.get(regionId);

    // add the new and the old- they stack if the dev wants them to.
    const newRegionSkillDatas = currentRegionSkillDatas.concat(regionSkillData);

    // reassign the regionId with the added stateIds.
    regionSkills.set(regionId, newRegionSkillDatas);
  }
};
//endregion properties

/**
 * Extends {@link #setup}.<br>
 * Also initializes this map's region-skill data.
 */
J.REGIONS.EXT.SKILLS.Aliased.Game_Map.set('setup', Game_Map.prototype.setup);
Game_Map.prototype.setup = function(mapId)
{
  // perform original logic.
  J.REGIONS.EXT.SKILLS.Aliased.Game_Map.get('setup')
    .call(this, mapId);

  // setup the region state data.
  this.setupRegionSkills();
};

/**
 * Sets up the region skills based on tags for this map.
 */
Game_Map.prototype.setupRegionSkills = function()
{
  // clear the existing states.
  this.clearRegionSkills();

  // refresh the existing states.
  this.refreshRegionSkills();
};

/**
 * Clears all region skills that have been configured for this map.
 */
Game_Map.prototype.clearRegionSkills = function()
{
  // grab the current tracker.
  const regionSkills = this.getRegionSkills();

  // clear all the tracking.
  regionSkills.clear();
};

/**
 * Refreshes the region skills on this map.
 */
Game_Map.prototype.refreshRegionSkills = function()
{
  // if we cannot refresh region effects, we cannot refresh region skills, either.
  if (!this.canRefreshRegionEffects()) return;

  // grab the region data.
  const regionSkillsData = RPGManager.getArraysFromNotesByRegex(
    { note: this.note() },
    J.REGIONS.EXT.SKILLS.RegExp.RegionSkill,
    true);

  // stop processing if there was nothing found.
  if (!regionSkillsData || !regionSkillsData.length) return;

  // iterate over all the found datas for processing.
  regionSkillsData.forEach(regionSkillData =>
  {
    // deconstruct the data.
    const [ regionId, skillId, chanceOfApplication, casterId, isFriendly ] = regionSkillData;

    // generate the new data based on the tag.
    const newRegionSkillData = new RegionSkillData(regionId, skillId, chanceOfApplication, casterId, isFriendly);

    // add the new data.
    this.addRegionSkillDataByRegionId(regionId, newRegionSkillData);
  });
};
//endregion Game_Map

//region Game_System
/**
 * Updates the region skills after loading a game.
 */
J.REGIONS.EXT.SKILLS.Aliased.Game_System.set('onAfterLoad', Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function()
{
  // perform original logic.
  J.REGIONS.EXT.SKILLS.Aliased.Game_System.get('onAfterLoad').call(this);

  // update from the latest plugin metadata.
  this.updateRegionSkillsAfterLoad();
};

/**
 * Re-initializes the region skills for the map and characters.
 */
Game_System.prototype.updateRegionSkillsAfterLoad = function()
{
  $gameMap.initRegionSkillsMembers();
  $gameMap.setupRegionSkills();
  $gamePlayer.initRegionSkillsMembers();
  $gamePlayer.followers().data().forEach(follower => follower.initRegionSkillsMembers());
};

//endregion Game_System