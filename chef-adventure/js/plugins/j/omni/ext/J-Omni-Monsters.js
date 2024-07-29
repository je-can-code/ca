//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.1 OMNI-MON] Extends the Omnipedia with a Monsterpedia entry.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-DropsControl
 * @base J-Elementalistics
 * @base J-SDP
 * @base J-Omnipedia
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin extends the Omnipedia by adding a new entry: The Monsterpedia.
 *
 * Due to rendering a large amount of data, there are a number of other plugins
 * required to use this plugin:
 * - J-Base             : always required for my plugins.
 * - J-ABS              : enables the tracking of most data points.
 * - J-DropsControl     : renders loot drop data and tracking.
 * - J-Elementalistics  : renders elemental data and tracking.
 * - J-SDP              : renders SDP points earned and panel drop rate.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.1
 *    Added support for auto-generating target frame icons where applicable.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */
//endregion Introduction

//region Metadata
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//endregion version check

/**
 * The over-arching extensions collection for this plugin.
 */
J.OMNI.EXT ||= {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.OMNI.EXT.MONSTER = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.OMNI.EXT.MONSTER.Metadata = {};

/**
 * The name of this plugin.
 */
J.OMNI.EXT.MONSTER.Metadata.Name = 'J-Omni-Monsterpedia';

/**
 * The version of this plugin.
 */
J.OMNI.EXT.MONSTER.Metadata.Version = '1.0.1';

/**
 * The plugin parameters for this plugin.
 */
J.OMNI.EXT.MONSTER.PluginParameters = PluginManager.parameters(J.OMNI.EXT.MONSTER.Metadata.Name);

/**
 * The various data points that define the command for the Omnipedia.
 */
J.OMNI.EXT.MONSTER.Metadata.Command = {};
J.OMNI.EXT.MONSTER.Metadata.Command.Name = "Monsterpedia";
J.OMNI.EXT.MONSTER.Metadata.Command.Symbol = "monster-pedia";
J.OMNI.EXT.MONSTER.Metadata.Command.IconIndex = 14;

/**
 * The id of the switch that will represent whether or not the command
 * should be visible in the Omnipedia menu.
 * @type {number}
 */
J.OMNI.EXT.MONSTER.Metadata.EnabledSwitch = 103;

/**
 * A collection of all aliased methods for this plugin.
 */
J.OMNI.EXT.MONSTER.Aliased = {};
J.OMNI.EXT.MONSTER.Aliased.Game_Enemy = new Map();
J.OMNI.EXT.MONSTER.Aliased.Game_Party = new Map();
J.OMNI.EXT.MONSTER.Aliased.Game_System = new Map();
J.OMNI.EXT.MONSTER.Aliased.JABS_Battler = new Map();
J.OMNI.EXT.MONSTER.Aliased.JABS_Engine = new Map();
J.OMNI.EXT.MONSTER.Aliased.Scene_Omnipedia = new Map();
J.OMNI.EXT.MONSTER.Aliased.Window_OmnipediaList = new Map();

/**
 * All regular expressions used by this plugin.
 */
J.OMNI.EXT.MONSTER.RegExp = {};
J.OMNI.EXT.MONSTER.RegExp.HideFromMonsterpedia = /<hideFromMonsterpedia>/i;
J.OMNI.EXT.MONSTER.RegExp.MonsterpediaFamilyIcon = /<monsterFamilyIcon:[ ]?(\d+)>/i;
J.OMNI.EXT.MONSTER.RegExp.MonsterpediaDescription = /<descriptionLine:[ ]?([\w\s.?!,\-'"]+)>/i;
J.OMNI.EXT.MONSTER.RegExp.MonsterpediaRegion = /<region:[ ]?([\w\s.?!,'"]+)>/i;
//endregion Metadata

//region JABS_Battler
if (J.HUD && J.HUD.EXT.TARGET)
{
  /**
   * Gets the target frame icon from the underlying character.
   * @returns {number}
   */
  J.OMNI.EXT.MONSTER.Aliased.JABS_Battler.set('getTargetFrameIcon', JABS_Battler.prototype.getTargetFrameIcon);
  JABS_Battler.prototype.getTargetFrameIcon = function()
  {
    // perform original logic to get the target frame icon.
    const originalTargetFrameIcon = J.OMNI.EXT.MONSTER.Aliased.JABS_Battler.get('getTargetFrameIcon').call(this);

    // if a target frame icon was provided, then just use that.
    if (originalTargetFrameIcon !== 0) return originalTargetFrameIcon;

    // if this isn't an enemy, then they don't get target frame icons.
    const enemy = this.getBattler().enemy();

    // check for a monster family icon instead.
    const monsterFamilyIconIndex = enemy.monsterFamilyIcon;

    // validate we have a monster family icon, too.
    if (monsterFamilyIconIndex)
    {
      // return the monster family icon by default.
      return monsterFamilyIconIndex;
    }

    // there is no freebie icons for this enemy.
    return 0;
  };
}
//endregion JABS_Battler

//region MonsterpediaObservations
/**
 * A monsterpedia entry of observations about a particular monster.
 * This data drives the visibility of data within a given monsterpedia entry.
 * @param {number} enemyId The id of the enemy these observations are for.
 */
function MonsterpediaObservations(enemyId)
{
  this.initialize(enemyId);
}

MonsterpediaObservations.prototype = {};
MonsterpediaObservations.prototype.constructor = MonsterpediaObservations;

/**
 * Initialize a set of observations for a new enemy.
 * @param {number} enemyId The id of the enemy these observations are for.
 */
MonsterpediaObservations.prototype.initialize = function(enemyId)
{
  /**
   * The id of the monster in the monsterpedia.
   * @type {number}
   */
  this.id = enemyId;

  // initialize other properties.
  this.initMembers();
};

/**
 * Initialize other observations that cannot be initialized with parameters.
 */
MonsterpediaObservations.prototype.initMembers = function()
{
  /**
   * The number of this monster that has been defeated by the player.
   * @type {number}
   */
  this.numberDefeated = 0;

  /**
   * Whether or not the player knows the name of this monster.
   * When the name is unknown, it'll be masked.
   * @type {boolean}
   */
  this.knowsName = false;

  /**
   * Whether or not the player knows the family this monster belongs to.
   * When the family is unknown, the icon will be omitted from the list and
   * the family will be masked in the detail.
   * @type {boolean}
   */
  this.knowsFamily = true;

  /**
   * Whether or not the player knows the description of this monster.
   * When the description is unknown, it'll be masked.
   * @type {boolean}
   */
  this.knowsDescription = false;

  /**
   * Whether or not the player knows the regions this monster is found in.
   * When the regions are unknown, it'll simply be blank.
   * @type {boolean}
   */
  this.knowsRegions = false;

  /**
   * Whether or not the player knows the parameters of this monster.
   * When the parameters are unknown, they will be masked.
   * @type {boolean}
   */
  this.knowsParameters = false;

  /**
   * Whether or not the player knows the ailmentalistics of this monster.
   * When the ailmentalistics are unknown, they will be masked.
   * @type {boolean}
   */
  this.knowsAilmentalistics = false;

  /**
   * All drops observed to be lootable from this enemy.
   * @type {[i|w|a, number][]}
   */
  this.knownDrops = [];

  /**
   * All element ids that have been observed in-action against this enemy.
   * @type {number[]}
   */
  this.knownElementalistics = [];
};

/**
 * Adds an observed drop to this monster's observations.
 * @param {i|w|a} dropType The type of loot drop observed.
 * @param {number} dropId The id of the drop.
 */
MonsterpediaObservations.prototype.addKnownDrop = function(dropType, dropId)
{
  this.knownDrops.push([dropType, dropId]);
};

/**
 * Determines whether or not a given drop is known.
 * @param {i|w|a} dropType The type of drop this is.
 * @param {number} dropId The id of the drop.
 * @returns {boolean} True if the drop is known, false otherwise.
 */
MonsterpediaObservations.prototype.isDropKnown = function(dropType, dropId)
{
  // a finder function for seeing if this drop is known.
  const finder = drop =>
  {
    // deconstruct the drop data.
    const [type, id] = drop;

    // if we have this entry in the list of known drops, then the drop is known.
    if (type === dropType && id === dropId) return true;

    // we do not have the drop in the list of known drops.
    return false;
  };

  // check if we found the item amongst the known drops.
  const found = this.knownDrops.find(finder, this);

  // return the boolean of whether or not we found it.
  return !!found;
};

MonsterpediaObservations.prototype.addKnownElementalistic = function(elementId)
{
  this.knownElementalistics.push(elementId);
};

MonsterpediaObservations.prototype.isElementalisticKnown = function(elementId)
{
  return this.knownElementalistics.includes(elementId);
};
//endregion MonsterpediaObservations

//region RPG_Enemy
/**
 * Whether or not this enemy should be hidden from the monsterpedia.
 * @type {boolean} True if the enemy should be hidden, false otherwise.
 */
Object.defineProperty(RPG_Enemy.prototype, "hideFromMonsterpedia",
  {
    get: function()
    {
      return this.shouldHideFromMonsterpedia();
    },
  });

/**
 * Determines whether or not this enemy should be hidden from the monsterpedia.
 * @returns {boolean} True if the enemy should be hidden, false otherwise.
 */
RPG_Enemy.prototype.shouldHideFromMonsterpedia = function()
{
  return this.getBooleanFromNotesByRegex(J.OMNI.EXT.MONSTER.RegExp.HideFromMonsterpedia);
};

/**
 * The icon index of the monster family this enemy belongs to.
 * @type {number}
 */
Object.defineProperty(RPG_Enemy.prototype, "monsterFamilyIcon",
  {
    get: function()
    {
      return this.getMonsterFamilyIconIndex();
    },
  });

/**
 * Gets the icon index representing the monster family of this enemy.
 * @returns {number}
 */
RPG_Enemy.prototype.getMonsterFamilyIconIndex = function()
{
  return this.getNumberFromNotesByRegex(J.OMNI.EXT.MONSTER.RegExp.MonsterpediaFamilyIcon);
};

/**
 * The description of the enemy for the monsterpedia.
 * @type {string[]}
 */
Object.defineProperty(RPG_Enemy.prototype, "monsterpediaDescription",
  {
    get: function()
    {
      return this.getMonsterpediaDescription();
    },
  });

/**
 * Gets the description of this enemy for the monsterpedia.
 * @returns {string[]}
 */
RPG_Enemy.prototype.getMonsterpediaDescription = function()
{
  return this.getStringsFromNotesByRegex(J.OMNI.EXT.MONSTER.RegExp.MonsterpediaDescription);
};
//endregion RPG_Enemy

//region JABS_Engine
/**
 * Processes the various on-hit effects against the target.
 * @param {JABS_Action} action The `JABS_Action` containing the action data.
 * @param {JABS_Battler} target The target having the action applied against.
 */
J.OMNI.EXT.MONSTER.Aliased.JABS_Engine.set('processOnHitEffects', JABS_Engine.prototype.processOnHitEffects);
JABS_Engine.prototype.processOnHitEffects = function(action, target)
{
  // perform original logic.
  J.OMNI.EXT.MONSTER.Aliased.JABS_Engine.get('processOnHitEffects').call(this, action, target);

  // check if the target is an enemy.
  if (target.isEnemy())
  {
    // observe elementalistics!
    this.processElementalisticObservations(action, target);
  }
};

/**
 * Observes all elements associated with an action against a given enemy.
 * @param {JABS_Action} action The action to observe elements for.
 * @param {JABS_Battler} target The enemy target to observe elements against.
 */
JABS_Engine.prototype.processElementalisticObservations = function(action, target)
{
  // grab the underlying skill from the action.
  const baseSkill = action.getBaseSkill();

  // the core element of the action.
  const baseElement = baseSkill.damage.elementId;

  // initialize elements collection for this action.
  const elements = [];

  // add any extra elements the action has.
  const addedElements = Game_Action.extractElementsFromAction(baseSkill);
  elements.push(...addedElements);

  // grab the caster of the action.
  const caster = action.getCaster();

  // check if the base element was "normal attack".
  if (baseElement === -1)
  {
    // pile in the attacker's elements.
    elements.push(...caster.getBattler().attackElements());
  }
  // don't add the "normal attack" element into the mix.
  else
  {
    // add the element of the skill instead.
    elements.push(baseElement);
  }

  // grab the enemy itself.
  const enemy = target.getBattler();

  // observe all of the elements against the enemy.
  elements.forEach(elementId => enemy.observeElement(elementId));
};
//endregion JABS_Engine

//region Game_Enemy
/**
 * Gets the {@link MonsterpediaObservations} associated with this enemy.
 * If none exists yet, one will be initialized.
 * @returns {MonsterpediaObservations}
 */
Game_Enemy.prototype.getMonsterPediaObservations = function()
{
  return $gameParty.getOrCreateMonsterpediaObservationsById(this.battlerId());
};

/**
 * Extends {@link #onDeath}.<br>
 * Also updates the monsterpedia observations for this enemy.
 */
J.OMNI.EXT.MONSTER.Aliased.Game_Enemy.set('onDeath', Game_Enemy.prototype.onDeath);
Game_Enemy.prototype.onDeath = function()
{
  // perform original logic.
  J.OMNI.EXT.MONSTER.Aliased.Game_Enemy.get('onDeath').call(this);

  // increment the counter for how many times we've defeated this enemy.
  this.updateMonsterpediaObservation();
};

/**
 * Updates the monsterpedia observation associated with this enemy on-death.
 */
Game_Enemy.prototype.updateMonsterpediaObservation = function()
{
  // increment the counter for how many times we've defeated this enemy.
  this.incrementDefeatCount();

  // learn the name of the enemy in the monsterpedia.
  this.learnMonsterpediaName();

  // deduce the monster family of the enemy.
  this.learnMonsterpediaFamily();

  // discern a description of the enemy.
  this.learnMonsterpediaDescription();

  // project the parameters of the enemy.
  this.learnMonsterpediaParameters();
};

/**
 * Increment the death counter for this particular enemy.
 */
Game_Enemy.prototype.incrementDefeatCount = function()
{
  // grab the observations for this enemy.
  const observations = this.getMonsterPediaObservations();

  // increment the defeat count.
  observations.numberDefeated++;
};

/**
 * Enables the visibility of the enemy's name in the monsterpedia
 * for this monster.
 */
Game_Enemy.prototype.learnMonsterpediaName = function()
{
  // grab the observations for this enemy.
  const observations = this.getMonsterPediaObservations();

  // identify the name of the enemy.
  observations.knowsName = true;
};

/**
 * Enables the visibility of the enemy's family in the monsterpedia
 * for this monster.
 */
Game_Enemy.prototype.learnMonsterpediaFamily = function()
{
  // grab the observations for this enemy.
  const observations = this.getMonsterPediaObservations();

  // deduce the monster family of the enemy.
  observations.knowsFamily = true;
};

/**
 * Enables the visibility of the enemy's description in the monsterpedia
 * for this monster.
 */
Game_Enemy.prototype.learnMonsterpediaDescription = function()
{
  // grab the observations for this enemy.
  const observations = this.getMonsterPediaObservations();

  // discern a description of the enemy.
  observations.knowsDescription = true;
};

/**
 * Enables the visibility of the enemy's parameters in the monsterpedia
 * for this monster.
 */
Game_Enemy.prototype.learnMonsterpediaParameters = function()
{
  // grab the observations for this enemy.
  const observations = this.getMonsterPediaObservations();

  // project the parameters of the enemy.
  observations.knowsParameters = true;
};

/**
 * Extends {@link #makeDropItems}.<br>
 * Also observes each drop dropped for monsterpedia purposes.
 */
J.OMNI.EXT.MONSTER.Aliased.Game_Enemy.set('makeDropItems', Game_Enemy.prototype.makeDropItems);
Game_Enemy.prototype.makeDropItems = function()
{
  // perform original logic to retrieve original drops.
  const drops = J.OMNI.EXT.MONSTER.Aliased.Game_Enemy.get('makeDropItems').call(this);

  // validate we have drops.
  if (drops.length)
  {
    // observe the drops.
    drops.forEach(this.observeDrop, this);
  }

  // return all earned loot!
  return drops;
};

/**
 * Observes a given drop, and records it in the monsterpedia if applicable.
 * @param {RPG_Item|RPG_Weapon|RPG_Armor} drop The drop to observe.
 */
Game_Enemy.prototype.observeDrop = function(drop)
{
  // grab the observations of this monster.
  const observations = this.getMonsterPediaObservations();

  // extract the drop data.
  const { kind: dropType, id: dropId } = drop;

  // don't process the drop if its already known.
  if (observations.isDropKnown(dropType, dropId)) return;

  // observe the drop.
  observations.addKnownDrop(dropType, dropId);
};

/**
 * Observes a given element, and records it in the monsterpedia if applicable.
 * @param {number} elementId The element id to observe.
 */
Game_Enemy.prototype.observeElement = function(elementId)
{
  // grab the observations of this monster.
  const observations = this.getMonsterPediaObservations();

  // don't process the element if its already known.
  if (observations.isElementalisticKnown(elementId)) return;

  // observe the element.
  observations.addKnownElementalistic(elementId);
};
//endregion Game_Enemy

//region Game_Party
/**
 * Extends {@link #initOmnipediaMembers}.<br>
 * Includes monsterpedia members.
 */
J.OMNI.EXT.MONSTER.Aliased.Game_Party.set('initOmnipediaMembers', Game_Party.prototype.initOmnipediaMembers);
Game_Party.prototype.initOmnipediaMembers = function()
{
  // perform original logic.
  J.OMNI.EXT.MONSTER.Aliased.Game_Party.get('initOmnipediaMembers').call(this);

  // initialize the monsterpedia.
  this.initMonsterpediaMembers();
};

//region monsterpedia
/**
 * Initialize members related to the omnipedia's monsterpedia.
 */
Game_Party.prototype.initMonsterpediaMembers = function()
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
   * A collection of the current observations of all monsters perceived.
   * @type {MonsterpediaObservations[]}
   */
  this._j._omni._monsterpediaObservationsSaveables = [];

  /**
   * A more friendly cache of monster observations to work with.
   * This is what is kept up-to-date until saving.
   *
   * This is keyed by the enemyId.
   * @type {Map<number, MonsterpediaObservations>}
   */
  this._j._omni._monsterpediaObservationsCache = new Map();
};

/**
 * Determines whether or not the omnipedia has been initialized.
 * @returns {boolean}
 */
Game_Party.prototype.isOmnipediaInitialized = function()
{
  return !!this._j._omni;
};

/**
 * Gets all monsterpedia observations perceived by the party.
 * @returns {MonsterpediaObservations[]}
 */
Game_Party.prototype.getSavedMonsterpediaObservations = function()
{
  return this._j._omni._monsterpediaObservationsSaveables;
};

/**
 * Gets the cache of monsterpedia observations.
 * The cache is keyed by enemyId.
 * @returns {Map<number, MonsterpediaObservations>}
 */
Game_Party.prototype.getMonsterpediaObservationsCache = function()
{
  return this._j._omni._monsterpediaObservationsCache;
};

/**
 * Sets the cache of the monsterpedia observations.
 * @param {Map<number, MonsterpediaObservations>} cache The cache to set over the old cache.
 */
Game_Party.prototype.setMonsterpediaObservationsCache = function(cache)
{
  this._j._omni._monsterpediaObservationsCache = cache;
};

/**
 * Updates the saveable monsterpedia observations collection with the latest
 * from the running cache of observations.
 */
Game_Party.prototype.translateMonsterpediaCacheForSaving = function()
{
  // grab the observation collection that is saveable.
  const saveableObservations = this.getSavedMonsterpediaObservations();

  // grab the cache of observations we've been maintaining.
  const cache = this.getMonsterpediaObservationsCache();

  // an iterator function for building out the monsterpedia saveables.
  const forEacher = (observation, enemyId) =>
  {
    // update the saveable observations with the cached data.
    saveableObservations[enemyId] = observation;
  };

  // iterate over each cached item.
  cache.forEach(forEacher, this);
};

/**
 * Synchronizes the monsterpedia cache into the saveable datas.
 */
Game_Party.prototype.synchronizeMonsterpediaDataBeforeSave = function()
{
  // validate the omnipedia is initialized.
  if (!this.isOmnipediaInitialized())
  {
    // initialize the omnipedia if it wasn't already.
    this.initOmnipediaMembers();
  }

  // translate the cache into saveables.
  this.translateMonsterpediaCacheForSaving();

  // translate the saveables into cache.
  this.translateMonsterpediaSaveablesToCache();
};

/**
 * Synchronize the monsterpedia saveable datas into the cache.
 */
Game_Party.prototype.synchronizeMonsterpediaAfterLoad = function()
{
  // validate the omnipedia is initialized.
  if (!this.isOmnipediaInitialized())
  {
    // initialize the omnipedia if it wasn't already.
    this.initOmnipediaMembers();
  }

  // translate the saveables into cache.
  this.translateMonsterpediaSaveablesToCache();

  // translate the cache into saveables.
  this.translateMonsterpediaCacheForSaving();
};

/**
 * Updates the monsterpedia observations cache with the data from the saveables.
 */
Game_Party.prototype.translateMonsterpediaSaveablesToCache = function()
{
  // grab the observation collection that is saveable.
  const saveableObservations = this.getSavedMonsterpediaObservations();

  // grab the cache of observations we've been maintaining.
  const cache = new Map();

  // iterate over each saved item.
  saveableObservations.forEach((observation, enemyId) =>
  {
    // if the observation is invalid, do not store it in the cache.
    if (!observation) return;

    // update the cache with the saveable.
    cache.set(enemyId, observation);
  }, this);

  // update the cache with the latest saveable datas.
  this.setMonsterpediaObservationsCache(cache);
};

/**
 * Gets or creates the monsterpedia observations for a given enemyId.
 * @param {number} enemyId The id of the enemy to find observations for.
 * @returns {MonsterpediaObservations} The observation for that enemyId.
 */
Game_Party.prototype.getOrCreateMonsterpediaObservationsById = function(enemyId)
{
  // grab all observations.
  const observations = this.getMonsterpediaObservationsCache();

  // find the observation of the given enemy id.
  const foundObservation = observations.get(enemyId);

  // check if we found the observation.
  if (foundObservation)
  {
    // return what we found.
    return foundObservation;
  }

  // if unfound, create one anew.
  const createdObservations = new MonsterpediaObservations(enemyId);

  // and add it to the collection.
  observations.set(enemyId, createdObservations);

  // return the newly created observations.
  return createdObservations;
};
//endregion monsterpedia
//endregion Game_Party

//region Game_System
/**
 * Update the saved data with the running cache.
 */
J.OMNI.EXT.MONSTER.Aliased.Game_System.set('onBeforeSave', Game_System.prototype.onBeforeSave);
Game_System.prototype.onBeforeSave = function()
{
  // perform original logic.
  J.OMNI.EXT.MONSTER.Aliased.Game_System.get('onBeforeSave').call(this);

  // update the cache into saveable data.
  $gameParty.synchronizeMonsterpediaDataBeforeSave();
};

/**
 * Setup the caches to work with from the saved data.
 */
J.OMNI.EXT.MONSTER.Aliased.Game_System.set('onAfterLoad', Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function()
{
  // perform original logic.
  J.OMNI.EXT.MONSTER.Aliased.Game_System.get('onAfterLoad').call(this);

  // update the savable data into the cache.
  $gameParty.synchronizeMonsterpediaAfterLoad();
};
//endregion Game_System

/**
 * A scene containing access to all available and implemented pedia entries.
 */
class Scene_Monsterpedia extends Scene_MenuBase
{
  /**
   * Pushes this current scene onto the stack, forcing it into action.
   */
  static callScene()
  {
    SceneManager.push(this);
  }

  /**
   * A debug function that unlocks everything in the monsterpedia.
   */
  static unlockAllMonsterpediaEntries()
  {
    // an iterator function for unlocking all observations associated with all monsters in the database.
    const forEacher = enemy =>
    {
      // skip null enemies.
      if (!enemy) return;

      // grab the database data of the enemy.
      const gameEnemy = $gameEnemies.enemy(enemy.id);

      // update their respective monsterpedia observations.
      gameEnemy.updateMonsterpediaObservation();

      // grab their observations.
      const observations = $gameParty.getOrCreateMonsterpediaObservationsById(enemy.id);

      // grab all drops available from this enemy.
      const allDrops = gameEnemy.getDropItems();

      // iterate over each potential drop and add it as being observed.
      allDrops.forEach(drop => observations.addKnownDrop(drop.kind, drop.dataId), this);

      // iterate over all standard elements in the context of CA.
      [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(id => observations.addKnownElementalistic(id), this);
    };

    // iterate over every enemy.
    $dataEnemies.forEach(forEacher, this);
  }

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

    // initialize the monsterpedia members.
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
     * A grouping of all properties associated with the monsterpedia.
     * The monsterpedia is a subcategory of the omnipedia..
     */
    this._j._omni._monster = {};

    /**
     * The window that shows the list of percieved monsters.
     * @type {Window_MonsterpediaList}
     */
    this._j._omni._monster._pediaList = null;

    /**
     * The window that shows the details observed of a perceived monster.
     * @type {Window_MonsterpediaDetail}
     */
    this._j._omni._monster._pediaDetail = null;

    /**
     * The window that shows the teriary information of a perceived monster.
     * @type {Window_MonsterpediaList}
     */
    this._j._omni._monster._pediaHelp = null;
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
   * Creates all monsterpedia windows.
   */
  createAllWindows()
  {
    // create the list of monsters that have been perceived.
    this.createMonsterpediaListWindow();

    // create the detail of a highlighted monster that has been perceived.
    this.createMonsterpediaDetailWindow();

    // grab the list window for refreshing.
    const listWindow = this.getMonsterpediaListWindow();

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
    this._backgroundSprite.filters = [this._backgroundFilter];
    this.addChild(this._backgroundSprite);
    //this.setBackgroundOpacity(220);
  }
  //endregion create

  //region windows
  //region list window
  /**
   * Creates the list of monsters the player has perceived.
   */
  createMonsterpediaListWindow()
  {
    // create the window.
    const window = this.buildMonsterpediaListWindow();
  
    // update the tracker with the new window.
    this.setMonsterpediaListWindow(window);
  
    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the monsterpedia listing window.
   * @returns {Window_OmnipediaList}
   */
  buildMonsterpediaListWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.monsterpediaListRectangle();
  
    // create the window with the rectangle.
    const window = new Window_MonsterpediaList(rectangle);
  
    // assign cancel functionality.
    window.setHandler('cancel', this.onCancelMonsterpedia.bind(this));
  
    // assign on-select functionality.
    window.setHandler('ok', this.onMonsterpediaListSelection.bind(this));
  
    // overwrite the onIndexChange hook with our local onMonsterpediaIndexChange hook.
    window.onIndexChange = this.onMonsterpediaIndexChange.bind(this);
  
    // return the built and configured omnipedia list window.
    return window;
  }

  /**
   * Gets the rectangle associated with the monsterpedia list command window.
   * @returns {Rectangle}
   */
  monsterpediaListRectangle()
  {
    // the list window's origin coordinates are the box window's origin as well.
    const [x, y] = Graphics.boxOrigin;
  
    // define the width of the list.
    const width = 400;
  
    // define the height of the list.
    const height = Graphics.boxHeight - (Graphics.verticalPadding * 2);
  
    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked monsterpedia list window.
   * @returns {Window_MonsterpediaList}
   */
  getMonsterpediaListWindow()
  {
    return this._j._omni._monster._pediaList;
  }

  /**
   * Set the currently tracked monsterpedia list window to the given window.
   * @param {Window_MonsterpediaList} listWindow The monsterpedia list window to track.
   */
  setMonsterpediaListWindow(listWindow)
  {
    this._j._omni._monster._pediaList = listWindow;
  }
  //endregion list window

  //region detail window
  /**
   * Creates the detail of a single monster the player has perceived.
   */
  createMonsterpediaDetailWindow()
  {
    // create the window.
    const window = this.buildMonsterpediaDetailWindow();
  
    // update the tracker with the new window.
    this.setMonsterpediaDetailWindow(window);
  
    // populate all image sprites used in this window.
    window.populateImageCache();
  
    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the monsterpedia detail window.
   * @returns {Window_MonsterpediaDetail}
   */
  buildMonsterpediaDetailWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.monsterpediaDetailRectangle();
  
    // create the window with the rectangle.
    const window = new Window_MonsterpediaDetail(rectangle);
  
    // return the built and configured omnipedia list window.
    return window;
  }

  /**
   * Gets the rectangle associated with the monsterpedia detail command window.
   * @returns {Rectangle}
   */
  monsterpediaDetailRectangle()
  {
    // grab the monsterpedia list window.
    const listWindow = this.getMonsterpediaListWindow();
  
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
   * Gets the currently tracked monsterpedia detail window.
   * @returns {Window_MonsterpediaDetail}
   */
  getMonsterpediaDetailWindow()
  {
    return this._j._omni._monster._pediaDetail;
  }

  /**
   * Set the currently tracked monsterpedia detail window to the given window.
   * @param {Window_MonsterpediaDetail} detailWindow The monsterpedia detail window to track.
   */
  setMonsterpediaDetailWindow(detailWindow)
  {
    this._j._omni._monster._pediaDetail = detailWindow;
  }

  /**
   * Opens the monsterpedia detail window.
   */
  openMonsterpediaDetailWindow()
  {
    // grab the window.
    const window = this.getMonsterpediaDetailWindow();

    // open and show the window.
    window.open();
    window.show();
  }

  /**
   * Closes the monsterpedia detail window.
   */
  closeMonsterpediaDetailWindow()
  {
    // grab the monsterpedia list window.
    const window = this.getMonsterpediaDetailWindow();

    // close and hide the window.
    window.close();
    window.hide();
  }
  //endregion detail window
  //endregion windows

  //region actions
  /**
   * Synchronize the detail window with the list window of the monsterpedia.
   */
  onMonsterpediaIndexChange()
  {
    // grab the list window.
    const listWindow = this.getMonsterpediaListWindow();
  
    // grab the detail window.
    const detailWindow = this.getMonsterpediaDetailWindow();
  
    // grab the highlighted enemy's extra data, their observations.
    const highlightedEnemyObservations = listWindow.currentExt();
  
    // sync the detail window with the currently-highlighted enemy.
    detailWindow.setObservations(highlightedEnemyObservations);
  
    // refresh the window for the content update.
    detailWindow.refresh();
  }

  /**
   * TODO: do something when a monster is selected?
   */
  onMonsterpediaListSelection()
  {
    const listWindow = this.getMonsterpediaListWindow();
  
    console.log(`monster selected index: [${listWindow.index()}].`);
  
    listWindow.activate();
  }

  /**
   * Close the monsterpedia and return to the main omnipedia.
   */
  onCancelMonsterpedia()
  {
    // revert to the previous scene.
    SceneManager.pop();
  }
  //endregion actions
}

//region Scene_Omnipedia
//region root actions
/**
 * Extends {@link #onRootPediaSelection}.<br>
 * When the monsterpedia is selected, open the monsterpedia.
 */
J.OMNI.EXT.MONSTER.Aliased.Scene_Omnipedia.set('onRootPediaSelection', Scene_Omnipedia.prototype.onRootPediaSelection);
Scene_Omnipedia.prototype.onRootPediaSelection = function()
{
  // grab which pedia was selected.
  const currentSelection = this.getRootOmnipediaKey();

  // check if the current selection is the monsterpedia.
  if (currentSelection === "monster-pedia")
  {
    // execute the monsterpedia.
    this.monsterpediaSelected();
  }
  // the current selection is not the monsterpedia.
  else
  {
    // possibly activate other choices.
    J.OMNI.EXT.MONSTER.Aliased.Scene_Omnipedia.get('onRootPediaSelection').call(this);
  }
}

/**
 * Switch to the monsterpedia when selected from the root omnipedia list.
 */
Scene_Omnipedia.prototype.monsterpediaSelected = function()
{
  // close the root omnipedia windows.
  this.closeRootPediaWindows();

  // call the monsterpedia scene.
  Scene_Monsterpedia.callScene();
}
//endregion root actions
//endregion Scene_Omnipedia

class Window_MonsterpediaDetail extends Window_Base
{
  //region properties
  /**
   * The player's observations of the currently highlighted enemy.
   * @type {MonsterpediaObservations|null}
   */
  #currentObservations = null;

  /**
   * A cache of all sprites associated with enemies in the monsterpedia.
   * @type {Map<number, Sprite_Enemy>}
   */
  #battlerImageCache = new Map();

  /**
   * A cache of all sprites associated with base parameters.
   * @type {Map<number, Sprite_Icon>}
   */
  #baseParameterIconCache = new Map();

  /**
   * A cache of all sprites associated with sp parameters.
   * @type {Map<number, Sprite_Icon>}
   */
  #spParameterIconCache = new Map();

  /**
   * A cache of all sprites associated with ex parameters.
   * @type {Map<number, Sprite_Icon>}
   */
  #exParameterIconCache = new Map();
  //endregion properties

  /**
   * Constructor.
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
  }

  /**
   * Gets the current enemy observations for this window.
   * @returns {MonsterpediaObservations|null}
   */
  getObservations()
  {
    return this.#currentObservations;
  }

  /**
   * Sets the current enemy observations for this window.
   * @param {MonsterpediaObservations} observations
   */
  setObservations(observations)
  {
    this.#currentObservations = observations;
  }

  //region image caching
  /**
   * Gets the battler image cache.
   * @returns {Map<number, Sprite_Enemy>}
   */
  getEnemyImageCache()
  {
    return this.#battlerImageCache;
  }

  /**
   * Gets the b-parameter icon image cache.
   * @returns {Map<number, Sprite_Icon>}
   */
  getBaseParameterIconCache()
  {
    return this.#baseParameterIconCache;
  }

  /**
   * Gets the s-parameter icon image cache.
   * @returns {Map<number, Sprite_Icon>}
   */
  getSpParameterIconCache()
  {
    return this.#spParameterIconCache;
  }

  /**
   * Gets the x-parameter icon image cache.
   * @returns {Map<number, Sprite_Icon>}
   */
  getExParameterIconCache()
  {
    return this.#exParameterIconCache;
  }

  /**
   * Populates the sprite cache ahead of rendering.
   */
  populateImageCache()
  {
    // populate enemy battler sprites into the cache.
    this.populateEnemySpriteImageCache();

    // populate all icon sprites into the cache.
    this.populateParameterIconSpriteCache();
  }

  /**
   * Caches all enemy battler sprites that have been at least perceived once.
   */
  populateEnemySpriteImageCache()
  {
    // grab the current list of observations.
    const monsterpediaCache = $gameParty.getMonsterpediaObservationsCache();

    // an iterator function for caching enemy sprites.
    const forEacherEnemySprites = (_, enemyId) => this.getOrCreateEnemySprite(enemyId);

    // iterate over each of them and cache the sprites.
    monsterpediaCache.forEach(forEacherEnemySprites, this);
  }

  /**
   * Caches all sprites associated with parameters icons.
   */
  populateParameterIconSpriteCache()
  {
    // cache the b-param icon sprites.
    this.populateBaseParameterIconSpriteCache();

    // cache the s-param icon sprites.
    this.populateSpParameterIconSpriteCache();

    // cache the x-param icon sprites.
    this.populateExParameterIconSpriteCache();
  }

  /**
   * Caches all base parameter icon sprites.
   */
  populateBaseParameterIconSpriteCache()
  {
    // define the parameter ids that qualify as b-params.
    const bparamIds = Game_BattlerBase.knownBaseParameterIds().concat(30);

    // an iterator function for creating base parameter icon sprites.
    const forEacher = (_, bParamId) => this.getOrCreateBaseParameterIconSprite(bParamId);

    // cache all sprites.
    bparamIds.forEach(forEacher, this);
  }

  /**
   * Caches all sp parameter icon sprites.
   */
  populateSpParameterIconSpriteCache()
  {
    // define the parameter ids that qualify as s-params.
    const sparamIds = Game_BattlerBase.knownSpParameterIds();

    // an iterator function for creating sp parameter icon sprites.
    const forEacher = (_, sParamId) => this.getOrCreateSpParameterIconSprite(sParamId);

    // cache all sprites.
    sparamIds.forEach(forEacher, this);
  }

  /**
   * Caches all ex parameter icon sprites.
   */
  populateExParameterIconSpriteCache()
  {
    // define the parameter ids that qualify as x-params.
    const xparamIds = Game_BattlerBase.knownExParameterIds();

    // an iterator function for creating ex parameter icon sprites.
    const forEacher = (_, xParamId) => this.getOrCreateExParameterIconSprite(xParamId);

    // cache all sprites.
    xparamIds.forEach(forEacher, this);
  }

  /**
   * Gets the enemy's sprite. If it is already cached, the cached one will be
   * returned, otherwise it'll be created and then cached.
   * @param {number} enemyId The id of the battler to retrieve the sprite for.
   * @returns {Sprite_Enemy}
   */
  getOrCreateEnemySprite(enemyId)
  {
    // grab the cache.
    const cache = this.getEnemyImageCache();

    // check if the key already maps to a cached sprite.
    if (cache.has(enemyId))
    {
      // if it does, just return that.
      return cache.get(enemyId);
    }

    // determine the battler associated with the enemy sprite.
    const battler = new Game_Enemy(enemyId, 0, 0);

    // TODO: replace this with a non-battle version of the sprite.
    // create a new sprite.
    const sprite = new Sprite_Enemy(battler);

    // cache the sprite.
    cache.set(enemyId, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Gets the base parameter icon sprite. If it is already cached, the cached one will be
   * returned, otherwise it'll be created and then cached.
   * @param {number} bParamId The id of the parameter to retrieve the sprite for.
   * @returns {Sprite_Icon}
   */
  getOrCreateBaseParameterIconSprite(bParamId)
  {
    // grab the cache.
    const cache = this.getBaseParameterIconCache();

    // check if the key already maps to a cached sprite.
    if (cache.has(bParamId))
    {
      // if it does, just return that.
      return cache.get(bParamId);
    }

    // determine the icon index for this b-parameter.
    // for the sake of the monsterpedia, we are categorizing "maxTp"(30) as a base param.
    const iconIndex = bParamId === 30
      ? IconManager.maxTp()
      : IconManager.param(bParamId);

    // create a new sprite.
    const sprite = new Sprite_Icon(iconIndex);

    // cache the sprite.
    cache.set(bParamId, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Gets the sp parameter icon sprite. If it is already cached, the cached one will be
   * returned, otherwise it'll be created and then cached.
   * @param {number} sParamId The id of the parameter to retrieve the sprite for.
   * @returns {Sprite_Icon}
   */
  getOrCreateSpParameterIconSprite(sParamId)
  {
    // grab the cache.
    const cache = this.getSpParameterIconCache();

    // check if the key already maps to a cached sprite.
    if (cache.has(sParamId))
    {
      // if it does, just return that.
      return cache.get(sParamId);
    }

    // determine the icon index for this s-parameter.
    const iconIndex = IconManager.sparam(sParamId);

    // create a new sprite.
    const sprite = new Sprite_Icon(iconIndex);

    // cache the sprite.
    cache.set(sParamId, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }

  /**
   * Gets the ex parameter icon sprite. If it is already cached, the cached one will be
   * returned, otherwise it'll be created and then cached.
   * @param {number} xParamId The id of the parameter to retrieve the sprite for.
   * @returns {Sprite_Icon}
   */
  getOrCreateExParameterIconSprite(xParamId)
  {
    // grab the cache.
    const cache = this.getExParameterIconCache();

    // check if the key already maps to a cached sprite.
    if (cache.has(xParamId))
    {
      // if it does, just return that.
      return cache.get(xParamId);
    }

    // determine the icon index for this x-parameter.
    const iconIndex = IconManager.xparam(xParamId);

    // create a new sprite.
    const sprite = new Sprite_Icon(iconIndex);

    // cache the sprite.
    cache.set(xParamId, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  }
  //endregion image caching

  /**
   * Extends {@link #clearContent}.<br>
   * Also hides all cached images.
   */
  clearContent()
  {
    // perform original logic.
    super.clearContent();

    // grab the cache of enemy images.
    const cache = this.getEnemyImageCache();

    // hide all of them.
    cache.forEach(sprite => sprite.hide());
  }

  /**
   * Implements {@link Window_Base.drawContent}.<br>
   * Draws a header and some detail for the omnipedia list header.
   */
  drawContent()
  {
    // grab the currently-highlighted observation.
    const observations = this.getObservations();

    // if we have no observations, do not draw.
    if (!observations) return;

    // define the origin x,y coordinates.
    const [x, y] = [0, 0];

    // shorthand the lineHeight.
    const lh = this.lineHeight();

    // draw the enemyId of the enemy.
    this.drawEnemyId(x, y);

    // draw the enemy name.
    const enemyNameX = x + 100;
    this.drawEnemyName(enemyNameX, y);

    // draw the battler image for the enemy.
    const enemySpriteY = y + (lh * 3);
    this.drawEnemySprite(x, enemySpriteY);

    // draw the parameters for the enemy.
    const parametersX = this.width - 300;
    this.drawEnemyParameters(parametersX, y);

    // draw the drops for the enemy.
    const dropsX = this.width - 550;
    this.drawEnemyDrops(dropsX, y);

    // draw the description of the enemy.
    const descriptionY = this.height - (lh * 6);
    this.drawDescription(x, descriptionY);

    // draw the enemy's elementalistics.
    const elementalisticsX = this.width - 300;
    const elementalisticsY = this.height - (lh * 9);
    this.drawElementalistics(elementalisticsX, elementalisticsY);
  }

  /**
   * Draws the enemy's id at the given point.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawEnemyId(x, y)
  {
    // clear residual font modifications.
    const valueX = x + 12;
    this.drawEnemyDefeatCountValue(valueX, y);

    // reduce font size for a tiny "DEFEATED".
    const keyY = y - 14;
    this.drawEnemyDefeatCountKey(x, keyY);
  }

  /**
   * Draws the enemy's defeated count value at the given point.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawEnemyDefeatCountValue(x, y)
  {
    // clear residual font modifications.
    this.resetFontSettings();

    // boost the font size, headers are big!
    this.modFontSize(6);

    // grab the id out of the current observations.
    const { numberDefeated } = this.getObservations();

    // pad the id with zeroes to ensure we always have at least 3 digits.
    const paddedNumberDefeated = numberDefeated.padZero(4);

    // calculate the text width.
    const textWidth = this.textWidth(paddedNumberDefeated);

    // render the "ID" text.
    this.drawText(`${paddedNumberDefeated}`, x, y, textWidth, Window_Base.TextAlignments.Left);
  }

  /**
   * Draws the enemy's defeated count key at the given point.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawEnemyDefeatCountKey(x, y)
  {
    // clear residual font modifications.
    this.resetFontSettings();

    // reduce font size for a tiny "ID".
    this.modFontSize(-10);

    // force bold for the key.
    this.toggleItalics(true);

    // capture the text to render.
    const defeatCounterText = "DEFEATED";

    // determine the text width for the key.
    const textWidth = this.textWidth(defeatCounterText);

    // render the text.
    this.drawText(defeatCounterText, x, y, textWidth, Window_Base.TextAlignments.Left);
  }

  /**
   * Draws the enemy's name at the given point.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawEnemyName(x, y)
  {
    // clear residual font modifications.
    this.resetFontSettings();

    // boost the font size, headers are big!
    this.modFontSize(14);

    // bold the header.
    this.toggleBold(true);

    // grab the id out of the current observations.
    const { id, knowsName } = this.getObservations();

    // pull the enemy's database data out.
    const databaseEnemy = $dataEnemies.at(id);

    // define the name.
    const { name } = databaseEnemy;

    // potentially mask the name depending on whether or not the player knows it.
    const possiblyMaskedName = knowsName
      ? name
      : J.BASE.Helpers.maskString(name);

    // determine the width of the enemy's name.
    const textWidth = this.textWidth(name);

    // draw the header.
    this.drawText(possiblyMaskedName, x, y, textWidth, Window_Base.TextAlignments.Left);
  }

  /**
   * Draws the enemy's battler sprite at the given point.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawEnemySprite(x, y)
  {
    // grab the id out of the current observations.
    const { id, numberDefeated } = this.getObservations();

    // don't render the sprite if we have never defeated it.
    if (numberDefeated < 1) return;

    // get the sprite from the cache.
    const sprite = this.getOrCreateEnemySprite(id);

    // determine the home coordinates for this enemy sprite.
    let homeX = x + sprite.width;
    const homeY = y + sprite.height;

    // check if this is a "larger" sprite.
    if (sprite.width > 300)
    {
      // create a proportionate modifier against the X to move the image to the left.
      const xModifier = (sprite.width * 0.4);

      // move the sprite to the left.
      homeX -= xModifier;
    }

    // show it where it needs to be shown.
    sprite.setHome(homeX, homeY);
    sprite.show();
  }

  /**
   * Draws the primary parameters of the enemy.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawEnemyParameters(x, y)
  {
    // shorthand the lineHeight.
    const lh = this.lineHeight() - 10;

    // draw the level of the enemy.
    this.drawLevelParameter(x, y);

    // draw the resources of the enemy.
    const resourcesY = lh * 2;
    this.drawResourceParameters(x, resourcesY);

    // draw the parameters of the enemy.
    const parametersY = lh * 6;
    this.drawCoreParameters(x, parametersY);
  }

  /**
   * Draws the level of the enemy.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawLevelParameter(x, y)
  {
    // clear residual font modifications.
    this.resetFontSettings();

    // reduce the font size a bit for these params.
    this.modFontSize(-4);

    // grab the id out of the current observations.
    const { id, knowsParameters } = this.getObservations();

    // grab a reference to the enemy for database analysis.
    const gameEnemy = $gameEnemies.enemy(id);

    // extract the parameters to draw from this enemy.
    const { level, } = gameEnemy;

    // draw the level parameter.
    this.drawEnemyParameter(
      x,
      y,
      IconManager.level(),
      TextManager.level,
      level,
      !knowsParameters,
      4);
  }

  /**
   * Draws the resource parameters of the enemy, such as HP/MP/TP.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawResourceParameters(x, y)
  {
    // clear residual font modifications.
    this.resetFontSettings();

    // shorthand the lineHeight.
    const lh = this.lineHeight() - 10;

    // reduce the font size a bit for these params.
    this.modFontSize(-4);

    // grab the id out of the current observations.
    const { id, knowsParameters } = this.getObservations();

    // grab a reference to the enemy for database analysis.
    const gameEnemy = $gameEnemies.enemy(id);

    // extract the parameters to draw from this enemy.
    const { mhp, mmp, mtp, } = gameEnemy;

    const maxRemover = parameterName =>
    {
      return parameterName.replace('Max ', String.empty)
    };

    // draw the max hp parameter.
    const maxHpName = maxRemover(TextManager.param(0));
    this.drawEnemyParameter(
      x,
      y,
      IconManager.param(0),
      maxHpName,
      mhp,
      !knowsParameters);

    // draw the max mp parameter.
    const maxMpName = maxRemover(TextManager.param(1));
    const maxMpXPlus = 12;
    const maxMpYPlus = lh * 1;
    this.drawEnemyParameter(
      x + maxMpXPlus,
      y + maxMpYPlus,
      IconManager.param(1),
      maxMpName,
      mmp,
      !knowsParameters,
      6);

    // draw the max tp parameter.
    const maxTpName = maxRemover(TextManager.maxTp());
    const maxTpXPlus = 24;
    const maxTpYPlus = lh * 2;
    this.drawEnemyParameter(
      x + maxTpXPlus,
      y + maxTpYPlus,
      IconManager.maxTp(),
      maxTpName,
      mtp,
      !knowsParameters,
      6);
  }

  /**
   * Draws the core parameters of the enemy, such as atk/def/mat/mdf/agi/luk.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawCoreParameters(x, y)
  {
    // clear residual font modifications.
    this.resetFontSettings();

    // shorthand the lineHeight.
    const lh = this.lineHeight() - 10;

    // reduce the font size a bit for these params.
    this.modFontSize(-4);

    // grab the id out of the current observations.
    const { id, knowsParameters } = this.getObservations();

    // grab a reference to the enemy for database analysis.
    const gameEnemy = $gameEnemies.enemy(id);

    // extract the parameters to draw from this enemy.
    const {
      atk, def, pdr,
      mat, mdf, mdr,
      agi, hit, cnt,
      luk, cri, cev,
    } = gameEnemy;

    // the modifier for where the left column begins.
    const leftColumnX = 8;

    // draw the attack parameter.
    const atkXPlus = leftColumnX;
    this.drawEnemyParameter(
      x + atkXPlus,
      y,
      IconManager.param(2),
      TextManager.param(2),
      atk,
      !knowsParameters,
      4);

    // draw the endurance parameter.
    const defXPlus = leftColumnX + 8;
    const defYPlus = lh * 1;
    this.drawEnemyParameter(
      x + defXPlus,
      y + defYPlus,
      IconManager.param(3),
      TextManager.param(3),
      def,
      !knowsParameters,
      4);

    // draw the phys dmg down parameter.
    const pdrXPlus = leftColumnX + 8;
    const pdrYPlus = lh * 2;
    const pdrValue = (pdr * 100) - 100;
    this.drawEnemyParameter(
      x + pdrXPlus,
      y + pdrYPlus,
      IconManager.sparam(6),
      TextManager.sparam(6),
      pdrValue,
      !knowsParameters,
      3);

    // draw the force parameter.
    const matXPlus = leftColumnX;
    const matYPlus = lh * 3;
    this.drawEnemyParameter(
      x + matXPlus,
      y + matYPlus,
      IconManager.param(4),
      TextManager.param(4),
      mat,
      !knowsParameters,
      4);

    // draw the resist parameter.
    const mdfXPlus = leftColumnX + 8;
    const mdfYPlus = lh * 4;
    this.drawEnemyParameter(
      x + mdfXPlus,
      y + mdfYPlus,
      IconManager.param(5),
      TextManager.param(5),
      mdf,
      !knowsParameters,
      4);

    // draw the magi def down parameter.
    const mdrXPlus = leftColumnX + 8;
    const mdrYPlus = lh * 5;
    const mdrValue = (mdr * 100) - 100;
    this.drawEnemyParameter(
      x + mdrXPlus,
      y + mdrYPlus,
      IconManager.sparam(7),
      TextManager.sparam(7),
      mdrValue,
      !knowsParameters,
      3);

    // draw the speed parameter.
    const agiXPlus = leftColumnX;
    const agiYPlus = lh * 6;
    this.drawEnemyParameter(
      x + agiXPlus,
      y + agiYPlus,
      IconManager.param(6),
      TextManager.param(6),
      agi,
      !knowsParameters,
      4);

    // draw the hit rate parameter.
    const hitXPlus = leftColumnX + 8;
    const hitYPlus = lh * 7;
    const hitValue = (hit * 100);
    this.drawEnemyParameter(
      x + hitXPlus,
      y + hitYPlus,
      IconManager.xparam(0),
      TextManager.xparam(0),
      hitValue,
      !knowsParameters,
      4);

    // draw the autocounter parameter.
    const cntXPlus = leftColumnX + 8;
    const cntYPlus = lh * 8;
    const cntValue = (cnt * 100);
    this.drawEnemyParameter(
      x + cntXPlus,
      y + cntYPlus,
      IconManager.xparam(6),
      TextManager.xparam(6),
      cntValue,
      !knowsParameters,
      3);

    // draw the b-param parameter.
    const lukXPlus = leftColumnX;
    const lukYPlus = lh * 9;
    this.drawEnemyParameter(
      x + lukXPlus,
      y + lukYPlus,
      IconManager.param(7),
      TextManager.param(7),
      luk,
      !knowsParameters,
      4);

    // draw the crit chance parameter.
    const criXPlus = leftColumnX + 8;
    const criYPlus = lh * 10;
    const criValue = (cri * 100);
    this.drawEnemyParameter(
      x + criXPlus,
      y + criYPlus,
      IconManager.xparam(2),
      TextManager.xparam(2),
      criValue,
      !knowsParameters,
      4);

    // draw the cev parameter.
    const cevXPlus = leftColumnX + 8;
    const cevYPlus = lh * 11;
    const cevValue = (cev * 100);
    this.drawEnemyParameter(
      x + cevXPlus,
      y + cevYPlus,
      IconManager.xparam(3),
      TextManager.xparam(3),
      cevValue,
      !knowsParameters,
      4);
  }

  /**
   * Draws the enemy parameter with the given data at the designated point's coordinates.
   *
   * If the parameter name is {@link String.empty}, the name will be omitted entirely from drawing.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   * @param {number} iconIndex The icon index of the parameter.
   * @param {string} parameterName The name of the parameter.
   * @param {number} parameterValue The numeric value of the parameter.
   * @param {boolean=} maskValue Whether or not to mask the parameter value; defaults to false.
   * @param {number=} padZeroCount The number of zeroes to pad a masked parameter value with.
   * @param {number=} spacePlus Additional space to add between the name and value of this parameter.
   */
  drawEnemyParameter(
    x,
    y,
    iconIndex,
    parameterName,
    parameterValue,
    maskValue = false,
    padZeroCount = 8,
    spacePlus = 0)
  {
    // determine the padding for prefixing with an icon.
    const iconWidthPadding = iconIndex === 0
      ? 0   // no padding for no icon.
      : 40; // padding if we have an icon.

    // a small space between parameter name and value.
    const nameValueSpace = 48 + spacePlus;

    // draw the icon for the parameter.
    this.drawIcon(iconIndex, x, y);

    // calculate the x coordinate for the parameter name.
    const parameterNameX = x + iconWidthPadding;

    // calculate the parameter width.
    const parameterNameWidth = (parameterName !== String.empty)
      ? 300
      : 0;

    // start the parameter value x coordinate where the name is, in case we are skipping the name.
    let parameterValueX = parameterNameX;

    // check if we're adding the name.
    if (parameterName !== String.empty)
    {
      // names are bold!
      this.toggleBold(true);

      // draw the parameter name.
      this.drawText(`${parameterName}`, parameterNameX, y, parameterNameWidth, Window_Base.TextAlignments.Left);

      // disable bold when done writing.
      this.toggleBold(false);

      // the name was drawn, add the name plus x.
      parameterValueX += nameValueSpace;
    }

    // mask the value if we are commanded.
    const possiblyMaskedValue = maskValue
      ? J.BASE.Helpers.maskString(parameterValue.padZero(padZeroCount))
      : parameterValue.padZero(padZeroCount);

    // determine the width of the value.
    //const parameterValueWidth = this.textWidth(possiblyMaskedValue);
    const parameterValueWidth = (parameterName !== String.empty)
      ? 120
      : this.textWidth(possiblyMaskedValue);

    // draw the parameter value.
    this.drawEnemyParameterValue(parameterValueX, y, possiblyMaskedValue, parameterValueWidth)
  }

  /**
   * Draws an enemy's parameter value.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   * @param {string} value The stringified parameter value, possibly masked.
   * @param {number} width The width to work with.
   */
  drawEnemyParameterValue(x, y, value, width)
  {
    let isBold = false;
    this.changeTextColor(ColorManager.textColor(8))
    const charWidth = this.textWidth(value.charAt(0));
    const totalCharWidth = value.length * charWidth;
    [...value].forEach((char, index) =>
    {
      if (char !== "0")
      {
        isBold = true;
        this.changeTextColor(ColorManager.normalColor());
      }

      this.toggleBold(isBold);

      const charX = x + (index * charWidth) - totalCharWidth;

      this.drawText(char, charX, y, width, Window_Base.TextAlignments.Right);

      this.toggleBold(false);
    });

    this.changeTextColor(ColorManager.normalColor());
  }

  /**
   * Draws the list of an enemy's potential loot drops.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawEnemyDrops(x, y)
  {
    // shorthand the lineHeight.
    const lh = this.lineHeight() - 10;

    // draw the core rewards, like experience/gold/sdp earned.
    this.drawBasicRewards(x, y);

    // draw the sdp drop data.
    const sdpYPlus = lh * 4;
    this.drawSdpDrop(x, sdpYPlus);

    // draw the standard drops information.
    const dropsYPlus = lh * 6;
    this.drawStandardDrops(x, dropsYPlus);
  }

  /**
   * Draws the basic rewards such as exp/gold/sdp.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawBasicRewards(x, y)
  {
    // clear residual font modifications.
    this.resetFontSettings();

    // reduce the font size just a hair.
    this.modFontSize(0);

    // shorthand the lineHeight.
    const lh = this.lineHeight() - 10;

    // we'll need the entire observations object for drops.
    const observations = this.getObservations();

    // grab the id out of the current observations.
    const { id, knowsParameters } = observations;

    // grab a reference to the enemy for database analysis.
    const gameEnemy = $gameEnemies.enemy(id);

    // draw the experience data.
    const expIcon = IconManager.rewardParam(0);
    const expName = TextManager.rewardParam(0);
    const expValue = gameEnemy.exp();
    this.drawEnemyParameter(
      x,
      y,
      expIcon,
      expName,
      expValue,
      !knowsParameters,
      0);

    // draw the gold data.
    const goldIcon = IconManager.rewardParam(1);
    const goldName = TextManager.rewardParam(1);
    const goldValue = gameEnemy.gold();
    const goldYPlus = lh * 1;
    this.drawEnemyParameter(
      x,
      y + goldYPlus,
      goldIcon,
      goldName,
      goldValue,
      !knowsParameters,
      0);

    // draw the SDP data.
    const sdpIcon = IconManager.rewardParam(4);
    const sdpName = TextManager.rewardParam(4);
    const sdpValue = gameEnemy.sdpPoints();
    const sdpYPlus = lh * 2;
    this.drawEnemyParameter(
      x,
      y + sdpYPlus,
      sdpIcon,
      sdpName,
      sdpValue,
      !knowsParameters,
      0);
  }

  /**
   * Draws the sdp drop.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawSdpDrop(x, y)
  {
    // clear residual font modifications.
    this.resetFontSettings();

    // reduce the font size just a hair.
    this.modFontSize(-6);

    // we'll need the entire observations object for drops.
    const observations = this.getObservations();

    // grab the id out of the current observations.
    const { id, knowsParameters } = observations;

    // grab a reference to the enemy for database analysis.
    const gameEnemy = $gameEnemies.enemy(id);

    // grab the list of possible drops this foe has.
    const sdpDropData = gameEnemy.getSdpDropData();

    if (sdpDropData === null || sdpDropData.at(0) === String.empty)
    {
      // draw the blurb about no SDP drop.
      const noSdpDropsText = `No SDP to unlock.`;
      const noSdpDropsTextWidth = this.textWidth(noSdpDropsText);
      this.drawText(noSdpDropsText, x, y, noSdpDropsTextWidth);

      // stop processing.
      return;
    }

    // extract the data from the sdp drop.
    const [ sdpKey, sdpDropChance, sdpItemId ] = sdpDropData;

    // grab the corresponding panel with this key.
    const panel = $gameParty.getSdpByKey(sdpKey);

    // if there is no panel, then don't try to render it.
    if (!panel) return;

    // translate the drop chance to a percent.
    let dropText = `${sdpDropChance}%`;

    // check if the panel is also already unlocked.
    if (panel.isUnlocked())
    {
      // flip the text to a checkbox to indicate no need to seek it out.
      dropText = `✅`;
    }

    // extract the item data associated with the panel.
    const { name, iconIndex } = $dataItems.at(sdpItemId);

    // mask the name if applicable.
    const panelName = knowsParameters
      ? name
      : J.BASE.Helpers.maskString(name);

    // render the parameter.
    this.drawEnemyParameter(
      x,
      y,
      iconIndex,
      panelName,
      dropText,
      false,
      0,
      20);
  }

  /**
   * Draws the standard list of all loot that this enemy can drop.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawStandardDrops(x, y)
  {
    // clear residual font modifications.
    this.resetFontSettings();

    // shorthand the lineHeight.
    const lh = this.lineHeight() - 10;

    // reduce the font size just a hair.
    this.modFontSize(-6);

    // we'll need the entire observations object for drops.
    const observations = this.getObservations();

    // grab the id out of the current observations.
    const { id, numberDefeated } = observations;

    // grab a reference to the enemy for database analysis.
    const gameEnemy = $gameEnemies.enemy(id);

    // grab the list of possible drops this foe has.
    const drops = gameEnemy.getDropItems();

    // if we have no drops, do not render them.
    if (!drops.length)
    {
      // render a "no drops" text blob.
      const noDropsText = `No standard drops to acquire.`;
      const noDropsTextWidth = this.textWidth(noDropsText);
      this.drawText(noDropsText, x, y, noDropsTextWidth);

      // stop processing.
      return;
    }

    // we skip healing drops like berries, so lets track how many were skipped.
    let numberSkipped = 0;

    // an iterator function for drawing drops if applicable.
    const forEacher = (drop, index) =>
    {
      if (this.isSkippableDrop(drop))
      {
        // add to the number of items we skipped.
        numberSkipped++;

        return;
      }

      // grab the implementation.
      const implementation = drop.toImplementation();

      // extract the data out of the drop with more accurate naming.
      const {
        dataId: dropId,
        denominator: dropChance,
        kind: dropType
      } = drop;

      // determine if we know this drop.
      const isDropKnown = observations.isDropKnown(dropType, dropId) || numberDefeated > 100;

      // the icon is determined by whether or not we know of this drop.
      const dropIcon = isDropKnown
        ? implementation.iconIndex
        : 93; // the question mark icon.

      // the name is masked if we haven't observed this drop.
      const dropName = isDropKnown
        ? implementation.name
        : J.BASE.Helpers.maskString(implementation.name);

      // draw the loot drop.
      const dropYPlus = (index - numberSkipped) * lh;
      this.drawEnemyParameter(
        x,
        y + dropYPlus,
        dropIcon,
        dropName,
        `${dropChance}%`,
        false,
        4);
    };

    // draw all the drops.
    drops.forEach(forEacher, this);
  }

  /**
   * Determines whether or not the drop should be drawn in the monsterpedia.
   * @param {RPG_DropItem} drop The drop to inspect.
   * @returns {boolean} True if this drop should be skipped, false otherwise.
   */
  isSkippableDrop(drop)
  {
    // SDP drops don't show up in this list.
    if (drop.isSdpDrop()) return true;

    // skippable items don't show up in this list.
    if (drop.kind === RPG_DropItem.Types.Item)
    {
      return this.skippableItemIds().includes(drop.dataId);
    }

    // skippable weapons don't show up in this list.
    if (drop.kind === RPG_DropItem.Types.Weapon)
    {
      return this.skippableWeaponIds().includes(drop.dataId);
    }

    // skippable armors don't show up in this list.
    if (drop.kind === RPG_DropItem.Types.Armor)
    {
      return this.skippableArmorIds().includes(drop.dataId);
    }

    return true;
  }

  /**
   * A list of item ids that shouldn't be drawn in the list of loot.
   * @returns {number[]}
   */
  skippableItemIds()
  {
    return [2, 3, 4, 8, 9];
  }

  /**
   * A list of weapon ids that shouldn't be drawn in the list of loot.
   * @returns {number[]}
   */
  skippableWeaponIds()
  {
    return [];
  }

  /**
   * A list of armor ids that shouldn't be drawn in the list of loot.
   * @returns {number[]}
   */
  skippableArmorIds()
  {
    return [];
  }

  /**
   * Draws the description text of an enemy.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawDescription(x, y)
  {
    // clear residual font modifications.
    this.resetFontSettings();

    // shorthand the lineHeight.
    const lh = this.lineHeight() - 10;

    // we'll need the entire observations object for drops.
    const observations = this.getObservations();

    // grab the id out of the current observations.
    const { id, knowsDescription } = observations;

    // grab a reference to the enemy for database analysis.
    const { monsterpediaDescription } = $dataEnemies.at(id);

    // reduce the font size for the description text.
    this.modFontSize(-4);

    // check to make sure we have a description.
    if (!monsterpediaDescription.length)
    {
      // render the missing description text if there is no description.
      const missingDescriptionText = "There is no description for this enemy.";
      const missingDescriptionTextWidth = this.textWidth(missingDescriptionText);
      this.drawText(missingDescriptionText, x, y, missingDescriptionTextWidth);

      // stop processing.
      return;
    }

    // iterate over each of the description lines and draw them.
    monsterpediaDescription.forEach((line, index) =>
    {
      const lineText = knowsDescription
        ? line
        : J.BASE.Helpers.maskString(line);
      const lineY = y + (lh * index);
      const lineWidth = this.textWidth(lineText);
      this.drawText(lineText, x, lineY, lineWidth);
    });
  }

  /**
   * Draws the elementalistics of an enemy.
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   */
  drawElementalistics(x, y)
  {
    // clear residual font modifications.
    this.resetFontSettings();

    // shorthand the lineHeight.
    const lh = this.lineHeight() - 10;

    // we'll need the entire observations object for drops.
    const observations = this.getObservations();

    // grab the id out of the current observations.
    const { id } = observations;

    // grab a reference to the enemy for database analysis.
    const gameEnemy = $gameEnemies.enemy(id);

    // reduce the font size for the description text.
    this.modFontSize(-4);

    const validElementIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    validElementIds.forEach((elementId, index) =>
    {
      this.changeTextColor(ColorManager.normalColor());

      const elementIcon = IconManager.element(elementId);

      const elementName = TextManager.element(elementId);

      let elementRate = gameEnemy.elementRate(elementId) * 100;

      const knowsElementalistic = observations.isElementalisticKnown(elementId);

      if (!knowsElementalistic)
      {
        elementRate = J.BASE.Helpers.maskString(elementRate.padZero(4));
      }
      else
      {
        if (elementRate === 100)
        {
          this.changeTextColor(ColorManager.normalColor());
        }
        else if (elementRate > 100)
        {
          this.changeTextColor(ColorManager.textColor(10));
        }
        else if (elementRate < 100 && elementRate > 0)
        {
          this.changeTextColor(ColorManager.textColor(17));
        }
        else if (elementRate === 0)
        {
          this.changeTextColor(ColorManager.textColor(8));
        }
        else if (elementRate < 0)
        {
          this.changeTextColor(ColorManager.textColor(23));
        }
      }

      const elementYPlus = lh * index;
      this.drawEnemyParameter(
        x,
        y + elementYPlus,
        elementIcon,
        elementName,
        elementRate,
        false,
        4);
    });
  }

  /*
  TODO:
  sections include
  - regions found
  - ailmentalistics
  - elementalistics
   */
}

//region Window_MonsterpediaList
/**
 * A window containing the list of all enemies perceived for the monsterpedia.
 */
class Window_MonsterpediaList extends Window_Command
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
   * Creates the command list of omnipedia entries available for this window.
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
   * Adds all omnipedia commands to the list that are available.
   * @returns {BuiltWindowCommand[]}
   */
  buildCommands()
  {
    // grab all valid enemies.
    const enemies = [];

    // an iterator function for filtering out enemies.
    const forEacher = enemy =>
    {
      // if the enemy is invalid, we don't process it.
      if (!this.isValidEnemy(enemy)) return;

      // push the enemy by its index.
      enemies.push(enemy);
    };

    // build the list of enemies.
    $dataEnemies.forEach(forEacher, this);

    // compile the list of commands.
    const commands = enemies.map(this.buildCommand, this);

    // return the compiled list of commands.
    return commands;
  }

  /**
   * Determines whether or not the enemy is a valid enemy.
   * @param {RPG_Enemy} enemy The enemy database data.
   * @returns {boolean} True if the enemy should be listed in the monsterpedia, false otherwise.
   */
  isValidEnemy(enemy)
  {
    // if the enemy is null/undefined, then the enemy is invalid.
    if (!enemy) return false;

    // if the enemy has no name, then the enemy is invalid.
    if (!enemy.name) return false;

    // if an enemy is explicitly hidden, then the enemy is invalid.
    if (enemy.hideFromMonsterpedia) return false;

    // the enemy is valid!
    return true;
  }

  /**
   * Builds a {@link BuiltWindowCommand} based on the enemy data.
   * @param {RPG_Enemy} enemy The enemy database data.
   * @returns {BuiltWindowCommand} The built command based on this enemy.
   */
  buildCommand(enemy)
  {
    // deconstruct data points out for building the list.
    const { id, name } = enemy;

    // grab the observations associated with this enemy id.
    const observations = $gameParty.getOrCreateMonsterpediaObservationsById(id);

    // default the name to the enemy's name.
    let enemyName = name;

    // validate the player knows the name of this monster.
    if (!observations.knowsName)
    {
      // mask the name if it isn't known.
      enemyName = J.BASE.Helpers.maskString(enemyName);
    }

    let enemyMonsterFamilyIconIndex = enemy.monsterFamilyIcon;

    // check if the player doesn't know the family, or has never defeated the monster.
    if (!observations.knowsFamily || observations.numberDefeated === 0)
    {
      // TODO: parameterize this.
      // the icon is a question mark.
      enemyMonsterFamilyIconIndex = 93;
    }

    // build a command based on the enemy.
    return new WindowCommandBuilder(enemyName)
      .setSymbol(`${id}-${name}`)
      .setExtensionData(observations)
      .setIconIndex(enemyMonsterFamilyIconIndex)
      .build();
  }
}
//endregion Window_MonsterpediaList

/**
 * Extends {@link #buildCommands}.<br>
 * Adds the monsterpedia command to the list of commands in the omnipedia.
 */
J.OMNI.EXT.MONSTER.Aliased.Window_OmnipediaList.set('buildCommands', Window_OmnipediaList.prototype.buildCommands);
Window_OmnipediaList.prototype.buildCommands = function()
{
  // perform original logic.
  const originalCommands = J.OMNI.EXT.MONSTER.Aliased.Window_OmnipediaList.get('buildCommands').call(this);

  // check if the monsterpedia command should be added.
  if (this.canAddMonsterpediaCommand())
  {
    // build the monsterpedia command.
    const monsterpediaCommand = new WindowCommandBuilder(J.OMNI.EXT.MONSTER.Metadata.Command.Name)
      .setSymbol(J.OMNI.EXT.MONSTER.Metadata.Command.Symbol)
      .addTextLine("Your standard fare in monsterologies across the universe.")
      .addTextLine("It is adapted to the local monsterology of Erocia.")
      .setIconIndex(J.OMNI.EXT.MONSTER.Metadata.Command.IconIndex)
      .build();

    // add the monsterpedia command to the running list.
    originalCommands.push(monsterpediaCommand);
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
  if (!$gameSwitches.value(J.OMNI.EXT.MONSTER.Metadata.EnabledSwitch)) return false;

  // add the command!
  return true;
};