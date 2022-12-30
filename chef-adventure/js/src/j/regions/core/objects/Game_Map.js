//region Game_Map
/**
 * Extends {@link #initialize}.
 * Also initializes the region effects properties.
 */
J.REGIONS.Aliased.Game_Map.set('initialize', Game_Map.prototype.initialize);
Game_Map.prototype.initialize = function()
{
  // perform original logic.
  J.REGIONS.Aliased.Game_Map.get('initialize').call(this);

  // initialize the region effects.
  this.initRegionEffectsMembers();
};

//region properties
/**
 * Initializes all region effects properties for the map.
 */
Game_Map.prototype.initRegionEffectsMembers = function()
{
  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * The grouping of all properties related to region effects.
   */
  this._j._regions = {};

  /**
   * The collection of region ids that deny passage.
   * @type {number[]}
   */
  this._j._regions._deny = Array.empty;

  /**
   * The collection of region ids that allow passage.
   * @type {number[]}
   */
  this._j._regions._allow = Array.empty;
};

//region allow
/**
 * Get the collection of passage-allowing region ids.
 * @returns {number[]}
 */
Game_Map.prototype.getAllowEffectRegionIds = function()
{
  return this._j._regions._allow;
};

/**
 * Adds the region id to the list of passage-allowing ids.
 * @param {number} allowRegionId The region id to add.
 */
Game_Map.prototype.addAllowEffectRegionId = function(allowRegionId)
{
  // grab the current collection of region ids.
  const allowRegionIds = this.getAllowEffectRegionIds();

  // if this id is already being tracked, don't track it again.
  if (allowRegionIds.includes(allowRegionId)) return;

  // track this region id.
  allowRegionIds.push(allowRegionId);
};

/**
 * Clears the region ids for allowing passage from this map.
 */
Game_Map.prototype.clearAllowEffectRegionIds = function()
{
  this._j._regions._allow = Array.empty;
};
//endregion allow

//region deny
/**
 * Get the collection of passage-denying region ids.
 * @returns {number[]}
 */
Game_Map.prototype.getDenyEffectRegionIds = function()
{
  return this._j._regions._deny;
};

/**
 * Adds the region id to the list of passage-denying ids.
 * @param {number} denyRegionId The region id to add.
 */
Game_Map.prototype.addDenyEffectRegionId = function(denyRegionId)
{
  // grab the current collection of region ids.
  const denyRegionIds = this.getDenyEffectRegionIds();

  // if this id is already being tracked, don't track it again.
  if (denyRegionIds.includes(denyRegionId)) return;

  // track this region id.
  denyRegionIds.push(denyRegionId);
};

/**
 * Clears the region ids for denying passage from this map.
 */
Game_Map.prototype.clearDenyEffectRegionIds = function()
{
  this._j._regions._deny = Array.empty;
};
//endregion deny
//endregion properties

/**
 * Extends {@link #setup}.
 * Also initializes this map's allow/deny region ids.
 */
J.REGIONS.Aliased.Game_Map.set('setup', Game_Map.prototype.setup);
Game_Map.prototype.setup = function(mapId)
{
  // perform original logic.
  J.REGIONS.Aliased.Game_Map.get('setup').call(this, mapId);

  // update rare/named enemy variable.
  this.setupRegionEffects();
};

/**
 * Sets up the region effects based on tags for this map.
 */
Game_Map.prototype.setupRegionEffects = function()
{
  // clear the existing effects.
  this.clearRegionEffects();

  // refresh for new effects.
  this.refreshRegionEffects();
};

/**
 * Clears all region effects from cache.
 */
Game_Map.prototype.clearRegionEffects = function()
{
  this.clearAllowEffectRegionIds();
  this.clearDenyEffectRegionIds();
};

/**
 * Refreshes all region effects and stores them in the cache.
 */
Game_Map.prototype.refreshRegionEffects = function()
{
  // if we cannot refresh right now, then do not.
  if (!this.canRefreshRegionEffects()) return;

  // refresh the region effects.
  this.refreshAllowRegionEffects();
  this.refreshDenyRegionEffects();

  // check if using cyclone movement.
  if (CycloneMovement)
  {
    // refresh the collision after the region effects are refreshed.
    CycloneMovement.setupCollision();
  }
};

/**
 * Determines whether or not the region effects can be refreshed.
 * @returns {boolean}
 */
Game_Map.prototype.canRefreshRegionEffects = function()
{
  // if there is no datamap, then we cannot refresh.
  if (!$dataMap) return false;

  // refresh the regions!
  return true;
};

/**
 * Refreshes the allow region effects for the map.
 */
Game_Map.prototype.refreshAllowRegionEffects = function()
{
  // grab the regions.
  const allowedRegions = RPGManager.getArrayFromNotesByRegex(
    this.note(),
    J.REGIONS.RegExp.AllowRegions)

  // stop processing if there was nothing found.
  if (!allowedRegions) return;

  // add each of the regions found to the list for this map.
  allowedRegions.forEach(this.addAllowEffectRegionId, this);
};

/**
 * Refreshes the deny region effects for the map.
 */
Game_Map.prototype.refreshDenyRegionEffects = function()
{
  // grab the regions.
  const deniedRegions = RPGManager.getArrayFromNotesByRegex(
    this.note(),
    J.REGIONS.RegExp.DenyRegions)

  // stop processing if there was nothing found.
  if (!deniedRegions) return;

  // add each of the regions found to the list for this map.
  deniedRegions.forEach(this.addDenyEffectRegionId, this);
};

/**
 * Extends {@link #isPassable}.
 * Also considers region effects for passability.
 */
J.REGIONS.Aliased.Game_Map.set('isPassable', Game_Map.prototype.isPassable);
Game_Map.prototype.isPassable = function(x, y, d)
{
  // project the coordinates.
  const [ projectedX, projectedY ] = this.projectCoordinatesByDirection(x, y, d);

  // grab the current region id of the projected coordinates.
  const regionId = this.regionId(projectedX, projectedY);

  // check if we're blocked by a region for that tile.
  if (this.isDenyRegionId(regionId))
  {
    // can't pass through region-restricted tiles.
    return false;
  }

  // check if we're permitted by a region for that tile.
  if (this.isAllowRegionId(regionId))
  {
    // always pass through region-permitted tiles.
    return true;
  }

  // if we reached here, then perform original logic and return that value.
  return J.REGIONS.Aliased.Game_Map.get('isPassable').call(this, x, y, d);
};

/**
 * Determines whether or not the given region id is a deny region id.
 * @param {number} regionId The given region id.
 * @returns {boolean} True if the region id will deny passage, false otherwise.
 */
Game_Map.prototype.isDenyRegionId = function(regionId)
{
  // grab the global region ids.
  const globalDenyRegionIds = J.REGIONS.Metadata.GlobalDenyRegions;

  // grab the region ids.
  const currentDenyRegionIds = this.getDenyEffectRegionIds();

  // combine all region ids.
  const allDenyRegionIds = globalDenyRegionIds.concat(currentDenyRegionIds);

  // check if the given id is included.
  const isDenied = allDenyRegionIds.includes(regionId);

  // return what we found.
  return isDenied;
};

/**
 * Determines whether or not the given region id is an allow region id.
 * @param {number} regionId The given region id.
 * @returns {boolean} True if the region id will allow passage, false otherwise.
 */
Game_Map.prototype.isAllowRegionId = function(regionId)
{
  // grab the global region ids.
  const globalAllowRegionIds = J.REGIONS.Metadata.GlobalAllowRegions;

  // grab this map's region ids.
  const currentAllowRegionIds = this.getAllowEffectRegionIds();

  // combine all region ids.
  const allAllowRegionIds = globalAllowRegionIds.concat(currentAllowRegionIds);

  // check if the given id is included.
  const isAllowed = allAllowRegionIds.includes(regionId);

  // return what we found.
  return isAllowed;
};

/**
 * Calculates the coordinates of where the player will step next based on their
 * current location and trajectory.
 * @param {number} x The x coordinate.
 * @param {number} y The y coordinate.
 * @param {number} d The direction faced.
 * @returns {[number, number]} An array of the projected x and y coordinates.
 */
Game_Map.prototype.projectCoordinatesByDirection = function(x, y, d)
{
  // accommodate cyclone movement if available.
  const increment = CycloneMovement
    ? (1 / CycloneMovement.stepCount)
    : 1;

  // default the projected coordinates to the current.
  let projectedX = x;
  let projectedY = y;

  // pivot on the direction headed.
  switch (d)
  {
    case 2:
      projectedY += increment;
      break;
    case 4:
      projectedX -= increment;
      break;
    case 6:
      projectedX += increment*2; // not sure why only this requires 2x?
      break;
    case 8:
      projectedY += increment;
      break;
  }

  // return the projected results.
  return [projectedX, projectedY];
};
//endregion Game_Map