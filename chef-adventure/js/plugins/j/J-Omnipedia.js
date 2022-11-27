/*  BUNDLED TIME: Sat Nov 26 2022 18:09:31 GMT-0800 (Pacific Standard Time)  */

//#region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [vWIP OMNI] Enables the "omnipedia" data-centric scene.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @help
 * ============================================================================
 * OVERVIEW:
 * This plugin enables a new scene called the "Omnipedia".
 * This scene is designed with extendability in mind, and can/will/does
 * contain a number of other sub-datasets, such as:
 * - Bestiary
 * - Items
 * - Weapons
 * - Armors
 *
 * Integrates with others of mine plugins:
 * - J-ControlledDrops; enables viewing of dropped loot in the bestiary.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */
//#endregion Introduction

//#region Metadata
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.OMNI = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.OMNI.Metadata = {};

/**
 * The name of this plugin.
 */
J.OMNI.Metadata.Name = 'J-Omnipedia';

/**
 * The version of this plugin.
 */
J.OMNI.Metadata.Version = '1.0.0';

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.OMNI.PluginParameters = PluginManager.parameters(J.OMNI.Metadata.Name);

/**
 * A collection of all aliased methods for this plugin.
 */
J.OMNI.Aliased = {};
J.OMNI.Aliased.DataManager = new Map();
J.OMNI.Aliased.Game_Enemy = new Map();
J.OMNI.Aliased.Game_Party = new Map();
J.OMNI.Aliased.Game_System = new Map();

/**
 * All regular expressions used by this plugin.
 */
J.OMNI.RegExp = {};
J.OMNI.RegExp.HideFromMonsterpedia = /<hideFromMonsterpedia>/i;
J.OMNI.RegExp.MonsterpediaFamilyIcon = /<monsterFamilyIcon:[ ]?(\d+)>/i;
J.OMNI.RegExp.MonsterpediaRegion = /<region:[ ]?([\w\s.?!,'"]+)>/i;
J.OMNI.RegExp.MonsterpediaDescription = /<descriptionLine:[ ]?([\w\s.?!,'"]+)>/i;
//#endregion Metadata

//#region MonsterpediaObservations
/**
 * A monsterpedia entry of observations about a particular monster.
 * This data drives the visibility of data within a given monsterpedia entry.
 */
class MonsterpediaObservations
{
  //#region properties
  /**
   * The id of the monster in the monsterpedia.
   * @type {number}
   */
  id = 0;

  /**
   * The number of this monster that has been defeated by the player.
   * @type {number}
   */
  numberDefeated = 0;

  /**
   * Whether or not the player knows the name of this monster.
   * When the name is unknown, it'll be masked.
   * @type {boolean}
   */
  knowsName = false;

  /**
   * Whether or not the player knows the family this monster belongs to.
   * When the family is unknown, the icon will be omitted from the list and
   * the family will be masked in the detail.
   * @type {boolean}
   */
  knowsFamily = true;

  /**
   * Whether or not the player knows the description of this monster.
   * When the description is unknown, it'll be masked.
   * @type {boolean}
   */
  knowsDescription = false;

  /**
   * Whether or not the player knows the regions this monster is found in.
   * When the regions are unknown, it'll simply be blank.
   * @type {boolean}
   */
  knowsRegions = false;

  /**
   * Whether or not the player knows the parameters of this monster.
   * When the parameters are unknown, they will be masked.
   * @type {boolean}
   */
  knowsParameters = true;

  /**
   * Whether or not the player knows the ailmentalistics of this monster.
   * When the ailmentalistics are unknown, they will be masked.
   * @type {boolean}
   */
  knowsAilmentistics = false;

  /**
   * Whether or not the player knows the elementalistics of this monster.
   * When the elementalistics are unknown, they will be masked.
   * @type {boolean}
   */
  knowsElementalistics = false;
  //#endregion properties

  /**
   * Constructor.
   * @param {number} enemyId The enemy id of this set of monster observations.
   */
  constructor(enemyId)
  {
    this.id = enemyId;
  }
}
//#endregion MonsterpediaObservations

//#region RPG_Enemy
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
  return this.getBooleanFromNotesByRegex(J.OMNI.RegExp.HideFromMonsterpedia);
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
  return this.getNumberFromNotesByRegex(J.OMNI.RegExp.MonsterpediaFamilyIcon);
};

/**
 * The description of the enemy for the monsterpedia.
 * @type {string[]}
 */
Object.defineProperty(RPG_Enemy.prototype, "monsterpediaDescription",
  {
    get: function()
    {
      return this.getMonsterFamilyIconIndex();
    },
  });

/**
 * Gets the description of this enemy for the monsterpedia.
 * @returns {string[]}
 */
RPG_Enemy.prototype.getMonsterpediaDescription = function()
{
  return this.getStringsFromNotesByRegex(J.OMNI.RegExp.MonsterpediaDescription);
};
//#endregion RPG_Enemy

//#region Game_Enemy
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
 * Extends {@link #onDeath}.
 * Also updates the monsterpedia observations for this enemy.
 */
J.OMNI.Aliased.Game_Enemy.set('die', Game_Enemy.prototype.die);
Game_Enemy.prototype.onDeath = function()
{
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
//#endregion Game_Enemy

//#region Game_Party
J.OMNI.Aliased.Game_Party.set('initialize', Game_Party.prototype.initialize);
Game_Party.prototype.initialize = function()
{
  // perform original logic.
  J.OMNI.Aliased.Game_Party.get('initialize').call(this);

  // initialize all omnipedia-related members.
  this.initOmnipediaMembers();
};

/**
 * Initializes all members related to the omnipedia.
 */
Game_Party.prototype.initOmnipediaMembers = function()
{
  // initialize the monsterpedia.
  this.initMonsterpediaMembers();
};

//#region monsterpedia
/**
 * Initialize members related to the omnipedia's monsterpedia.
 */
Game_Party.prototype.initMonsterpediaMembers = function()
{
  /**
   * The over-arching J object to contain all additional plugin parameters.
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
//#endregion monsterpedia
//#endregion Game_Party

//#region Game_System
/**
 * Calls the omnipedia scene if possible.
 * @param {boolean=} force Whether or not to force-call the scene; defaults to false.
 */
Game_System.prototype.callOmnipediaScene = function(force = false)
{
  // check if the omnipedia scene can be called.
  if (this.canCallOmnipediaScene() || force)
  {
    // call it.
    Scene_Omnipedia.callScene();
  }
  // cannot call the omnipedia scene.
  else
  {
    // sorry!
    SoundManager.playBuzzer();
  }
};

/**
 * Determines whether or not the omnipedia scene can be called.
 * @returns {boolean}
 */
Game_System.prototype.canCallOmnipediaScene = function()
{
  // peek at the omnipedia!
  return true;
};

/**
 * Update the saved data with the running cache.
 */
J.OMNI.Aliased.Game_System.set('onBeforeSave', Game_System.prototype.onBeforeSave);
Game_System.prototype.onBeforeSave = function()
{
  // perform original logic.
  J.OMNI.Aliased.Game_System.get('onBeforeSave').call(this);

  // update the cache into saveable data.
  $gameParty.synchronizeMonsterpediaDataBeforeSave();
};

/**
 * Setup the caches to work with from the saved data.
 */
J.OMNI.Aliased.Game_System.set('onAfterLoad', Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function()
{
  // perform original logic.
  J.OMNI.Aliased.Game_System.get('onAfterLoad').call(this);

  // update the savable data into the cache.
  $gameParty.synchronizeMonsterpediaAfterLoad();
};
//#endregion Game_System

//#region Scene_Omnipedia
class Scene_Omnipedia extends Scene_MenuBase
{
  /**
   * Calls this scene to start processing.
   */
  static callScene()
  {
    SceneManager.push(this);
  }

  static unlockAllMonsterpediaEntries()
  {
    $dataEnemies.forEach(enemy =>
    {
      if (!enemy) return;

      const gameEnemy = $gameEnemies.enemy(enemy.id);

      gameEnemy.updateMonsterpediaObservation();
    });
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

  //#region init
  /**
   * Initialize the window and all properties required by the scene.
   */
  initialize()
  {
    // perform original logic.
    super.initialize(this);

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

    // initialize the main omnipedia base list of pedias.
    this.initPrimaryMembers();

    // initialize the nested pedias listed within the omnipedia.
    this.initSecondaryMembers();
  }

  /**
   * The core properties of this scene are the root namespace definitions for this plugin.
   */
  initCoreMembers()
  {
    /**
     * The over-arching J object to contain all additional plugin parameters.
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
     * The window that shows the list of available pedias.
     * @type {Window_OmnipediaList}
     */
    this._j._omni._pediaList = null;

    /**
     * The window that displays at the top while the omnipedia list is active.
     * @type {Window_OmnipediaListHeader}
     */
    this._j._omni._pediaListHeader = null;
  }

  /**
   * The secondary properties of the scene are the individual pedia property namespace setup,
   * such as the Monsterpedia.
   */
  initSecondaryMembers()
  {
    // initialize the monsterpedia members.
    this.initMonsterpediaMembers();
  }

  /**
   * Initializes all members of the monsterpedia.
   */
  initMonsterpediaMembers()
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
  //#endregion init

  //#region start
  start()
  {
    super.start();

    // on-ready logic goes here.
  }
  //#endregion start

  /**
   * Initialize all resources required for this scene.
   */
  create()
  {
    // perform original logic.
    super.create();

    // create all our windows.
    this.createAllWindows();
  }

  /**
   * Creates all windows associated with this scene.
   */
  createAllWindows()
  {
    // create all root windows for the main listing.
    this.createOmnipediaRootWindows();

    // create all monsterpedia windows.
    this.createMonsterpediaWindows();
  }

  //#region windows management
  //#region root windows
  /**
   * Creates the root-level omnipedia windows.
   */
  createOmnipediaRootWindows()
  {
    // create the root omnipedia list of pedias.
    this.createOmnipediaListWindow();

    // create the header window.
    this.createOmnipediaListHeaderWindow();
  }

  //#region header window
  /**
   * Creates a header window for the omnipedia list.
   */
  createOmnipediaListHeaderWindow()
  {
    // create the window.
    const window = this.buildOmnipediaListHeaderWindow();

    // update the tracker with the new window.
    this.setOmnipediaListHeaderWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the omnipedia list header window.
   * @returns {Window_OmnipediaListHeader}
   */
  buildOmnipediaListHeaderWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.omnipediaListHeaderRectangle();

    // create the window with the rectangle.
    const window = new Window_OmnipediaListHeader(rectangle);

    window.refresh();

    // return the built and configured omnipedia list window.
    return window;
  }

  /**
   * Gets the rectangle associated with the omnipedia list header window.
   * @returns {Rectangle}
   */
  omnipediaListHeaderRectangle()
  {
    // define the width of the list.
    const width = 1000;

    // determine the x based on the width.
    const x = (Graphics.boxWidth / 2) - (width * 0.5);

    // define the height of the rectangle.
    const height = 100;

    // arbitrarily decide the y.
    const y = 100;

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked omnipedia list header window.
   * @returns {Window_OmnipediaListHeader}
   */
  getOmnipediaListHeaderWindow()
  {
    return this._j._omni._pediaListHeader;
  }

  /**
   * Set the currently tracked omnipedia list header window to the given window.
   * @param {Window_OmnipediaListHeader} listHeaderWindow The omnipedia list header window to track.
   */
  setOmnipediaListHeaderWindow(listHeaderWindow)
  {
    this._j._omni._pediaListHeader = listHeaderWindow;
  }

  /**
   * Opens the root header window.
   */
  openRootHeaderWindow()
  {
    // grab the root header window.
    const rootHeaderWindow = this.getOmnipediaListHeaderWindow();

    // open and show the root header window.
    rootHeaderWindow.open();
    rootHeaderWindow.show();
  }

  /**
   * Closes the root header window.
   */
  closeRootHeaderWindow()
  {
    // grab the root header window.
    const rootHeaderWindow = this.getOmnipediaListHeaderWindow();

    // close and hide the root header window.
    rootHeaderWindow.close();
    rootHeaderWindow.hide();
  }
  //#endregion header window

  //#region list window
  /**
   * Creates the list of pedias available to the player to peruse.
   */
  createOmnipediaListWindow()
  {
    // create the window.
    const window = this.buildOmnipediaListWindow();

    // update the tracker with the new window.
    this.setOmnipediaListWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the omnipedia listing window.
   * @returns {Window_OmnipediaList}
   */
  buildOmnipediaListWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.omnipediaListRectangle();

    // create the window with the rectangle.
    const window = new Window_OmnipediaList(rectangle);

    // assign cancel functionality.
    window.setHandler('cancel', this.popScene.bind(this));

    // assign on-select functionality.
    window.setHandler('ok', this.onRootPediaSelection.bind(this));

    // return the built and configured omnipedia list window.
    return window;
  }

  /**
   * Gets the rectangle associated with the omnipedia list command window.
   * @returns {Rectangle}
   */
  omnipediaListRectangle()
  {
    // define the width of the list.
    const width = 800;

    // calculate the X for where the origin of the list window should be.
    const x = (Graphics.boxWidth / 2) - (width * 0.5);

    // define the height of the list.
    const height = 400;

    // calculate the Y for where the origin of the list window should be.
    const y = (Graphics.boxHeight / 2) - (height * 0.5);

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the currently tracked omnipedia list window.
   * @returns {Window_OmnipediaList}
   */
  getOmnipediaListWindow()
  {
    return this._j._omni._pediaList;
  }

  /**
   * Set the currently tracked omnipedia list window to the given window.
   * @param {Window_OmnipediaList} listWindow The omnipedia list window to track.
   */
  setOmnipediaListWindow(listWindow)
  {
    this._j._omni._pediaList = listWindow;
  }

  /**
   * Opens the root list window and activates it.
   */
  openRootListWindow()
  {
    // grab the root omnipedia list window.
    const rootListWindow = this.getOmnipediaListWindow();

    // open, show, and activate the root list window.
    rootListWindow.open();
    rootListWindow.show();
    rootListWindow.activate();
  }

  /**
   * Closes the root list window.
   */
  closeRootListWindow()
  {
    // grab the root omnipedia list window.
    const rootListWindow = this.getOmnipediaListWindow();

    // close and deactivate the root list window.
    rootListWindow.close();
    rootListWindow.deactivate();
  }

  /**
   * Gets the current symbol of the root omnipedia.
   * This is effectively the currently highlighted selection's key of that window.
   * @returns {string}
   */
  getRootOmnipediaKey()
  {
    return this.getOmnipediaListWindow().currentSymbol();
  }
  //#endregion list window

  /**
   * Opens all windows associated with the root omnipedia.
   */
  openRootPediaWindows()
  {
    // open the root list window.
    this.openRootListWindow();

    // open the root header window.
    this.openRootHeaderWindow();
  }

  /**
   * Closes all windows associated with the root omnipedia.
   */
  closeRootPediaWindows()
  {
    // close the list window.
    this.closeRootListWindow();

    // close the header window.
    this.closeRootHeaderWindow();
  }
  //#endregion root windows

  //#region monsterpedia windows
  /**
   * Creates all windows for the monsterpedia.
   */
  createMonsterpediaWindows()
  {
    // create the list of monsters that have been perceived.
    this.createMonsterpediaListWindow();

    // create the detail of a highlighted monster that has been perceived.
    this.createMonsterpediaDetailWindow();

    // by default we do not start on the monsterpedia.
    this.closeMonsterpediaWindows();
  }

  //#region monsterpedia list window
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
   * @returns {Window_OmnipediaList}
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

  /**
   * Opens the monsterpedia list window.
   */
  openMonsterpediaListWindow()
  {
    // grab the monsterpedia list window.
    const pediaListWindow = this.getMonsterpediaListWindow();

    // open, show, and activate the monsterpedia list.
    pediaListWindow.open();
    pediaListWindow.show();
    pediaListWindow.activate();
  }

  /**
   * Closes the monsterpedia list window.
   */
  closeMonsterpediaListWindow()
  {
    // grab the monsterpedia list window.
    const pediaListWindow = this.getMonsterpediaListWindow();

    // close, hide, and deactivate the monsterpedia list.
    pediaListWindow.close();
    pediaListWindow.hide();
    pediaListWindow.deactivate();
  }
  //#endregion monsterpedia list window

  //#region monsterpedia detail window
  /**
   * Creates the detail of a single monster the player has perceived.
   */
  createMonsterpediaDetailWindow()
  {
    // create the window.
    const window = this.buildMonsterpediaDetailWindow();

    // update the tracker with the new window.
    this.setMonsterpediaDetailWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  /**
   * Sets up and defines the monsterpedia detail window.
   * @returns {Window_OmnipediaList}
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
  //#endregion monsterpedia detail window

  /**
   * Opens all windows associated with the monsterpedia.
   */
  openMonsterpediaWindows()
  {
    // open the monsterpedia list window.
    this.openMonsterpediaListWindow();

    // open the monsterpedia detail window.
    this.openMonsterpediaDetailWindow();
  }

  /**
   * Closes all windows associated with the monsterpedia.
   */
  closeMonsterpediaWindows()
  {
    // close the monsterpedia list window.
    this.closeMonsterpediaListWindow();

    // close the monsterpedia detail window.
    this.closeMonsterpediaDetailWindow();
  }
  //#endregion monsterpedia windows
  //#endregion windows management

  //#region actions
  //#region root actions
  /**
   * When a choice is made, execute this logic.
   */
  onRootPediaSelection()
  {
    // grab which pedia was selected.
    const currentSelection = this.getRootOmnipediaKey();

    // determine which of the pedias to open.
    switch (currentSelection)
    {
      case "monster-pedia":
        this.monsterpediaSelected();
        break;
      default:
        this.invalidSelected(currentSelection);
        break;
    }
  }

  /**
   * Switch to the monsterpedia when selected from the root omnipedia list.
   */
  monsterpediaSelected()
  {
    // close the root omnipedia windows.
    this.closeRootPediaWindows();

    // open up the monsterpedia windows.
    this.openMonsterpediaWindows();

    // grab the monsterpedia's list window.
    const monsterpediaListWindow = this.getMonsterpediaListWindow();

    // initial refresh the detail window by way of force-changing the index.
    monsterpediaListWindow.onIndexChange();
  }

  /**
   * When an invalid selection occurs from the root omnipedia list, do nothing.
   * @param {any} currentSelection The given selection that was invalid.
   */
  invalidSelected(currentSelection)
  {
    console.warn(`The invalid symbol of: [${currentSelection.toString()}] was selected.`);
    SoundManager.playBuzzer();
    this.getOmnipediaListWindow().activate();
  }
  //#endregion root actions

  //#region monsterpedia actions
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
    // close the monsterpedia windows.
    this.closeMonsterpediaWindows();

    // open and activate the root omnipedia windows.
    this.openRootPediaWindows();
  }
  //#endregion monsterpedia actions
  //#endregion actions
}
//#endregion Scene_Omnipedia

class Window_MonsterpediaDetail extends Window_Base
{
  /**
   * The player's observations of the currently highlighted enemy.
   * @type {MonsterpediaObservations|null}
   */
  #currentObservations = null;

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

  /**
   * Implements {@link Window_Base.drawContent}.
   * Draws a header and some detail for the omnipedia list header.
   */
  drawContent()
  {
    // grab the currently-highlighted observation.
    const observations = this.getObservations();

    // if we have no observations, do not draw.
    if (!observations) return;

    const { id } = observations;

    const databaseEnemy = $dataEnemies.at(id);

    const gameEnemy = $gameEnemies.enemy(id);

    // define the origin x,y coordinates.
    const [x, y] = [0, 0];

    // shorthand the lineHeight.
    const lh = this.lineHeight();

    // draw the enemyId of the enemy.
    this.drawEnemyId(x, y);

    // draw the enemy name.
    const enemyNameX = x + 100;
    this.drawEnemyName(enemyNameX, y);
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
    const valueY = y + 8;
    this.drawEnemyDefeatCountValue(valueX, valueY);

    // reduce font size for a tiny "DEFEATED".
    const keyY = y - 4;
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
    this.modFontSize(-6);

    // force bold for the key.
    this.toggleBold(true);

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

  /*
  TODO:
  sections include
  - id
  - description
  - regions found
  - parameters
  - ailmentalistics
  - elementalistics
   */
}

//#region Window_MonsterpediaList
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
   * Implements {@link #makeCommandList}.
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
//#endregion Window_MonsterpediaList

//#region Window_OmnipediaList
class Window_OmnipediaList extends Window_Command
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
   * Implements {@link #makeCommandList}.
   * Creates the command list of omnipedia entries available for this window.
   */
  makeCommandList()
  {
    // grab all the omnipedia listings available.
    const commands = this.buildCommands();

    commands.forEach(this.addBuiltCommand, this);
  }

  /**
   * Builds all commands for this command window.
   * Adds all omnipedia commands to the list that are available.
   * @returns {BuiltWindowCommand[]}
   */
  buildCommands()
  {
    const monsterpediaCommand = new WindowCommandBuilder("Monsterpedia")
      .setSymbol("monster-pedia")
      .addSubTextLine("Your standard fare in monsterologies across the universe.")
      .addSubTextLine("It is adapted to the local monsterology of Erocia.")
      .setIconIndex(14)
      .build();

    const weaponpediaCommand = new WindowCommandBuilder("Weapon-pedia")
      .setSymbol("weapon-pedia")
      .addSubTextLine("It has your weapon information in it, duh.")
      .addSubTextLine("You can review various weapon attributes within.")
      .setIconIndex(112)
      .build();

    const armorpediaCommand = new WindowCommandBuilder("Armor-pedia")
      .setSymbol("armor-pedia")
      .addSubTextLine("Your armor information is in this thing.")
      .addSubTextLine("You can review various armor attributes within.")
      .setIconIndex(482)
      .build();

    const itempediaCommand = new WindowCommandBuilder("Item-pedia")
      .setSymbol("item-pedia")
      .addSubTextLine("Your item data is all stored in here.")
      .addSubTextLine("You can review various details about consumables.")
      .setIconIndex(208)
      .build();

    return [
      monsterpediaCommand,
      itempediaCommand,
      weaponpediaCommand,
      armorpediaCommand,
    ];
  }

  itemHeight()
  {
    return this.lineHeight() * 2;
  }
}
//#endregion Window_OmnipediaList

//#region Window_OmnipediaListHeader
class Window_OmnipediaListHeader extends Window_Base
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
   * Implements {@link Window_Base.drawContent}.
   * Draws a header and some detail for the omnipedia list header.
   */
  drawContent()
  {
    // define the origin x,y coordinates.
    const [x, y] = [0, 0];

    // shorthand the lineHeight.
    const lh = this.lineHeight();

    // draw the header.
    this.drawHeader(x, y);

    // draw the detail under the header.
    const detailY = y + (lh * 1);
    this.drawDetail(x, detailY);
  }

  /**
   * Draws the header text.
   * @param {number} x The base x coordinate for this section.
   * @param {number} y The base y coordinate for this section.
   */
  drawHeader(x, y)
  {
    // make the font size nice and big.
    this.modFontSize(10);

    // define the text for this section.
    const headerText = `The Omnipedia`;

    // when using "center"-alignment, you center across the width of the window.
    const headerTextWidth = this.width;

    // enable italics.
    this.toggleBold(true);

    // render the headline title text.
    this.drawText(headerText, x, y, headerTextWidth, "center");

    // reset any lingering font settings.
    this.resetFontSettings();
  }

  /**
   * Draws the detail text.
   * @param {number} x The base x coordinate for this section.
   * @param {number} y The base y coordinate for this section.
   */
  drawDetail(x, y)
  {
    // define the text for this section.
    const detailText = `Where you can find a pedia for everything.`;

    // when using "center"-alignment, you center across the width of the window.
    const detailTextWidth = this.width;

    // enable italics.
    this.toggleItalics(true);

    // render the headline title text.
    this.drawText(detailText, x, y, detailTextWidth, "center");

    // reset any lingering font settings.
    this.resetFontSettings();
  }
}
//#endregion Window_OmnipediaListHeader