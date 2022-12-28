//region Game_Party
/**
 * Extends {@link #initialize}.
 * Includes our custom members as well.
 */
J.PASSIVE.Aliased.Game_Party.set('initialize', Game_Party.prototype.initialize);
Game_Party.prototype.initialize = function()
{
  // perform original logic.
  J.PASSIVE.Aliased.Game_Party.get('initialize').call(this);

  // initialize our members as well.
  this.initPassiveItemStates();
};

/**
 * Initializes the passive state members for this class.
 */
Game_Party.prototype.initPassiveItemStates = function()
{
  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * The grouping of all properties related to passive states.
   */
  this._j._passive ||= {};

  /**
   * The tracker for all passive states ids the party has.
   * @type {number[]}
   */
  this._j._passive._states = [];

  /**
   * The cache for passive states that have been converted.
   * @type {RPG_State[]}
   */
  this._j._passive._cachedStates = [];
};

/**
 * Gets all passive states ids currently applied to the party.
 * @returns {number[]}
 */
Game_Party.prototype.passiveStateIds = function()
{
  return this._j._passive._states;
};

/**
 * Gets an array of all passive states currently applied to the party.
 * @returns {RPG_State[]}
 */
Game_Party.prototype.passiveStates = function()
{
  return this._j._passive._cachedStates;
};

/**
 * Gets the party's interpretation of the state based on its id.
 * @param {number} stateId The state id.
 * @returns {RPG_State}
 */
Game_Party.prototype.state = function(stateId)
{
  return $dataStates.at(stateId);
};

/**
 * Clears all passive state data currently tracked.
 */
Game_Party.prototype.clearPassiveStates = function()
{
  // empty the state tracker.
  this._j._passive._states = [];

  // empty the cached states, too.
  this._j._passive._cachedStates = [];
};

/**
 * Adds a passive state id to the list for tracking.
 * @param {number} stateId The state id to add.
 * @param {boolean=} allowDuplicates Whether or not to allow duplicate passive state ids; defaults to true.
 */
Game_Party.prototype.addPassiveStateId = function(stateId, allowDuplicates = true)
{
  // check if we disallow duplicates and already have the state tracked.
  if (!allowDuplicates && this._j._passive._states.has(stateId)) return;

  // add the state id to the tracker for passive states.
  this._j._passive._states.push(stateId);

  // add the converted state object to the cache.
  this._j._passive._cachedStates.push(this.state(stateId));
};

/**
 * Clears and updates the passive state tracker with the latest.
 */
Game_Party.prototype.refreshPassiveStates = function()
{
  // clear all current passive states tracked.
  this.clearPassiveStates();

  // grab all the unique ids.
  const uniqueIds = this.getAllUniquePassiveStateIds();

  // grab all the stackable ids.
  const stackableIds = this.getAllStackablePassiveStateIds();

  // add all the unique ids to the tracker.
  uniqueIds.forEach(stateId => this.addPassiveStateId(stateId, false), this);

  // add all the stackable ids to the tracker.
  stackableIds.forEach((stackCount, stateId) =>
  {
    // don't re-add unique passive states.
    if (uniqueIds.has(stateId)) return;

    // capture the number of times to duplicate the state object.
    let times = stackCount;

    // while we have times left, keep going.
    while (times > 0)
    {
      // add the stackable passive state id.
      this.addPassiveStateId(stateId);

      // decrement the counter.
      times--;
    }
  });
};

/**
 * Gets all unique passive state ids that are present across everything the
 * party owns at the moment.
 * @returns {Set<number>}
 */
Game_Party.prototype.getAllUniquePassiveStateIds = function()
{
  // initialize the set of unique ids; there can only be one!
  const uniquePassiveStateIds = new Set();

  // grab all currently owned items/weapons/armors.
  const everything = this.allItemsQuantified();

  // iterate over all the things.
  everything.forEach(baseItem =>
  {
    // grab the unique ids from the item.
    const uniqueIds = baseItem.uniquePassiveStateIds;

    // add them uniquely to the set.
    uniqueIds.forEach(id => uniquePassiveStateIds.add(id));
  });

  // return the completed unique set.
  return uniquePassiveStateIds;
};

/**
 * Gets all stackable passive state ids that are present across everything the
 * party owns at the moment.
 * @returns {Map<number, number>}
 */
Game_Party.prototype.getAllStackablePassiveStateIds = function()
{
  // initialize the map of stackable ids; each one can have many.
  /** @type {Map<number, number>} */
  const stackablePassiveStateIds = new Map();

  // grab all currently owned items/weapons/armors.
  const everything = this.allItemsQuantified();

  // iterate over all the things.
  everything.forEach(baseItem =>
  {
    // grab the stackable ids from the item.
    const stackableIds = baseItem.passiveStateIds;

    // iterate over each of the stackable passive state ids on this item.
    stackableIds.forEach(id =>
    {
      // check if we are already tracking this passive state id.
      if (stackablePassiveStateIds.has(id))
      {
        // grab the running stack total for this passive state id.
        const stack = stackablePassiveStateIds.get(id);

        // increment the stack.
        stackablePassiveStateIds.set(id, stack+1);
      }
      // we aren't tracking this passive state id yet.
      else
      {
        // start the stack for this passive state id at 1.
        stackablePassiveStateIds.set(id, 1);
      }
    });
  });

  // return the completed stackable map.
  return stackablePassiveStateIds;
};

/**
 * Extends {@link #gainItem}.
 * Also refreshes the passive states for the party.
 * @param {RPG_Item|RPG_Weapon|RPG_Armor} item The item to modify the quantity of.
 * @param {number} amount The amount to modify the quantity by.
 * @param {boolean} includeEquip Whether or not to include equipped items for equipment.
 */
J.PASSIVE.Aliased.Game_Party.set('gainItem', Game_Party.prototype.gainItem);
Game_Party.prototype.gainItem = function(item, amount, includeEquip)
{
  // perform original logic.
  J.PASSIVE.Aliased.Game_Party.get('gainItem').call(this, item, amount, includeEquip);

  // also refresh our passive states tracker.
  this.refreshPassiveStates();
};
//endregion Game_Party