//region Game_Party
/**
 * Extends {@link #initOmnipediaMembers}.
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