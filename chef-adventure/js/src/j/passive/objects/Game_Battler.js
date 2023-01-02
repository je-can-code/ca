//region Game_Battler
/**
 * Extends {@link #initMembers}.
 * Also initializes the passive states properties for this battler.
 */
J.PASSIVE.Aliased.Game_BattlerBase.set('initMembers', Game_Battler.prototype.initMembers);
Game_Battler.prototype.initMembers = function()
{
  // perform original logic.
  J.PASSIVE.Aliased.Game_BattlerBase.get('initMembers').call(this);

  // initialize the passive states properties.
  this.initPassiveStatesMembers();
};

/**
 * Initializes the passives collection
 */
Game_Battler.prototype.initPassiveStatesMembers = function()
{
  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with passive states.
   */
  this._j._passive ||= {};

  /**
   * A cached list of all currently applied passive state ids.
   * @type {number[]|null}
   */
  this._j._passive._stateIds = [];
};

/**
 * Get all currently known passive state ids this battler has.
 * @returns {number[]}
 */
Game_Battler.prototype.getPassiveStateIds = function()
{
  return this._j._passive._stateIds;
};

/**
 * Checks whether or not this battler currently has a given passive state applied.
 * @param {number} stateId The id of the state to check for.
 * @returns {boolean} True if this battler has the passive state applied, false otherwise.
 */
Game_Battler.prototype.hasPassiveStateId = function(stateId)
{
  return this.getPassiveStateIds().includes(stateId);
};

/**
 * Adds the given state id to the passive state ids collection for this battler.
 * If `allowDuplicates` is `false`, then the adding of the state id will be ignored
 * if the battler already has the id.
 * @param {number} stateId The id of the state to add.
 * @param {boolean=} allowDuplicates Whether or not duplicate state ids is permitted; defaults to true.
 */
Game_Battler.prototype.addPassiveStateId = function(stateId, allowDuplicates = true)
{
  // check if we disallow duplicates and already have the state tracked.
  if (!this.canAddPassiveStateId(stateId, allowDuplicates)) return;

  // grab the passive state id collection.
  const passiveStateIds = this.getPassiveStateIds();

  // add the stateId to the collection.
  passiveStateIds.push(stateId);
};

/**
 * Determines whether or not a given stateId can be added to the list
 * @param {number} stateId The id of the state to add.
 * @param {boolean=} allowDuplicates Whether or not duplicate state ids is permitted; defaults to true.
 * @returns {boolean} True if the state id can be added to the passives collection, false otherwise.
 */
Game_Battler.prototype.canAddPassiveStateId = function(stateId, allowDuplicates)
{
  // if we don't allow duplicates and already are have this stateId, then don't add it.
  if (!allowDuplicates && this.getPassiveStateIds().includes(stateId)) return false;

  // TODO: check for blacklisted ids as well.

  // we can add this stateId!
  return true;
};

/**
 * Gets the converted {@link RPG_State} form of all currently applied passive states.
 * @returns {RPG_State[]}
 */
Game_Battler.prototype.getPassiveStates = function()
{
  return this.getPassiveStateIds().map(this.state, this);
};

/**
 * Clears all passive state data currently tracked.
 */
Game_Battler.prototype.clearPassiveStates = function()
{
  // empty the state tracker.
  this._j._passive._stateIds = [];
};

/**
 * Clears and updates the passive state tracker with the latest.
 */
Game_Battler.prototype.refreshPassiveStates = function()
{
  // remove all currently tracked passive states.
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
 * Gets all unique passive state ids that are present across all sources this
 * battler owns.
 * @returns {Set<number>}
 */
Game_Battler.prototype.getAllUniquePassiveStateIds = function()
{
  // initialize the set of unique ids; there can only be one!
  const uniquePassiveStateIds = new Set();

  // grab all objects to get unique passive state ids from.
  const everything = this.getPassiveStateSources();

  // iterate over all the things.
  everything.forEach(baseItem =>
  {
    // grab the unique ids from the item.
    const uniqueIds = baseItem.uniquePassiveStateIds;

    // check if we need to include passive state ids, too.
    if (baseItem instanceof RPG_EquipItem)
    {
      // add the equip-only passive state ids.
      uniqueIds.push(...baseItem.uniqueEquippedPassiveStateIds);
    }

    // add them uniquely to the set.
    uniqueIds.forEach(id => uniquePassiveStateIds.add(id));
  });

  // return the completed unique set.
  return uniquePassiveStateIds;
};

/**
 * Gets all stackable passive state ids that are present across all sources this
 * battler owns.
 * @returns {Map<number, number>}
 */
Game_Battler.prototype.getAllStackablePassiveStateIds = function()
{
  // initialize the map of stackable ids; each one can have many.
  /** @type {Map<number, number>} */
  const stackablePassiveStateIds = new Map();

  // grab all objects to get stackable passive state ids from.
  const everything = this.getPassiveStateSources();

  // iterate over all the things.
  everything.forEach(baseItem =>
  {
    // grab the stackable ids from the item.
    const stackableIds = baseItem.passiveStateIds;

    // check if we need to include passive state ids, too.
    if (baseItem instanceof RPG_EquipItem)
    {
      // add the equip-only passive state ids.
      stackableIds.push(...baseItem.equippedPassiveStateIds);
    }

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
 * Gets all sources from which this battler can derive passive state from.
 *
 * This does include a reference call to potentially getting passive states, but due
 * to control flows, this should always come back with no passive states in the list.
 * @returns {(RPG_Actor|RPG_Enemy|RPG_Class|RPG_Skill|RPG_EquipItem|RPG_State)[]}
 */
Game_Battler.prototype.getPassiveStateSources = function()
{
  // define all sources from which passive states can come from.
  const battlerSources = [
    // ones own data from the database, such as the actor or enemy data.
    this.databaseData(),

    // all states currently applied to the battler- this won't include own any passive states.
    ...this.allStates(),

    // all skills available to this battler.
    ...this.skills(),
  ];

  // return this collection of stuff.
  return battlerSources;
};

/**
 * Determines whether or not the state id is a passive state or not.
 * @param {number} stateId The state id to check.
 * @returns {boolean} True if it is identified as passive, false otherwise.
 */
Game_Battler.prototype.isPassiveState = function(stateId)
{
  // then the answer lies in whether or not the given state id is in that list.
  return this._j._passive._stateIds.includes(stateId);
};

/**
 * Extends {@link #allStates}.
 * Includes states from passive skills as well.
 * @returns {RPG_State[]}
 */
J.PASSIVE.Aliased.Game_Battler.set('allStates', Game_Battler.prototype.allStates);
Game_Battler.prototype.allStates = function()
{
  // get all original states.
  const states = J.PASSIVE.Aliased.Game_Battler.get('allStates').call(this);

  // add in all passive skill states.
  states.push(...this.getPassiveStates());

  // return that combined collection.
  return states;
};

/**
 * Extends {@link #isStateAddable}.
 * Prevents adding states if they are identified as passive.
 */
J.PASSIVE.Aliased.Game_Battler.set('isStateAddable', Game_Battler.prototype.isStateAddable);
Game_Battler.prototype.isStateAddable = function(stateId)
{
  // skip adding if it is a passive state.
  if (this.isPassiveState(stateId)) return false;

  // otherwise, check as normal.
  return J.PASSIVE.Aliased.Game_Battler.get('isStateAddable').call(this, stateId);
};

/**
 * Extends {@link #onStateAdded}.
 * Triggers a refresh of passive states when a state is added.
 * @param {number} stateId The state id being added.
 */
J.PASSIVE.Aliased.Game_Battler.set('onStateAdded', Game_Battler.prototype.onStateAdded);
Game_Battler.prototype.onStateAdded = function(stateId)
{
  // perform original logic.
  J.PASSIVE.Aliased.Game_Battler.get('onStateAdded').call(this, stateId);

  // refresh our passive state list.
  this.refreshPassiveStates();
};

/**
 * Extends {@link #removeState}.
 * Prevent removal of states if they are identified as passive.
 */
J.PASSIVE.Aliased.Game_Battler.set('removeState', Game_Battler.prototype.removeState);
Game_Battler.prototype.removeState = function(stateId)
{
  // skip removal if it is a passive state.
  if (this.isPassiveState(stateId)) return;

  // otherwise, remove as normal.
  J.PASSIVE.Aliased.Game_Battler.get('removeState').call(this, stateId);
};

/**
 * Extends {@link #onStateRemoval}.
 * Triggers a refresh of passive states when a state is removed.
 * @param {number} stateId The state id being removed.
 */
J.PASSIVE.Aliased.Game_Battler.set('onStateRemoval', Game_Battler.prototype.onStateRemoval);
Game_Battler.prototype.onStateRemoval = function(stateId)
{
  // perform original logic.
  J.PASSIVE.Aliased.Game_Battler.get('onStateRemoval').call(this, stateId);

  // refresh our passive state list.
  this.refreshPassiveStates();
};
//endregion Game_Battler