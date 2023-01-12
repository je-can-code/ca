//region Game_Battler
/**
 * Gets the skill associated with the given skill id.
 * By default, we simply get the skill from the database with no modifications.
 * @param {number} skillId The skill id to get the skill for.
 * @returns {RPG_Skill}
 */
Game_Battler.prototype.skill = function(skillId)
{
  return $dataSkills[skillId];
};

/**
 * Gets all skills this battler has available to it.
 * @returns {RPG_Skill[]}
 */
Game_Battler.prototype.skills = function()
{
  return Array.empty;
};

/**
 * The underlying database data for this battler.
 *
 * This allows operations to be performed against both actor and enemy indifferently.
 * @returns {number}
 */
Game_Battler.prototype.battlerId = function()
{
  return 1;
};

/**
 * The underlying database data for this battler.
 *
 * This allows operations to be performed against both actor and enemy indifferently.
 * @returns {RPG_Enemy|RPG_Actor}
 */
Game_Battler.prototype.databaseData = function()
{
  return null;
};

/**
 * Gets the class associated with the given class id.
 * By default, we simply get the class from the database with no modifications.
 * @param {number} classId The class id to get the class for.
 * @returns {RPG_Class}
 */
Game_Battler.prototype.class = function(classId)
{
  return $dataClasses.at(classId);
};

/**
 * Gets everything that this battler has with notes on it.
 * All battlers have their own database data, along with all their states.
 * Actors also get their class, skills, and equips added.
 * Enemies also get their skills added.
 * @returns {(RPG_Actor|RPG_Enemy|RPG_Class|RPG_Skill|RPG_EquipItem|RPG_State)[]}
 */
Game_Battler.prototype.getAllNotes = function()
{
  // initialize the container.
  const objectsWithNotes = this.getNotesSources();

  // return this combined collection of note-containing objects.
  return objectsWithNotes;
};

/**
 * Gets all database objects from which notes can be derived for this battler.
 * @returns {RPG_BaseItem[]}
 */
Game_Battler.prototype.getNotesSources = function()
{
  return [
    // add the actor/enemy to the source list.
    this.databaseData(),

    // add all skills for the actor/enemy to the source list.
    ...this.skills(),

    // add all currently applied states to the source list.
    ...this.allStates(),
  ];
};

/**
 * Adds a hook for performing actions when some part of the battler's data has changed.
 * All battlers will trigger this hook when states are added or removed.
 *
 * Unlike {@link Game_Battler.refresh}, this does not trigger when hp/mp/tp changes.
 */
Game_Battler.prototype.onBattlerDataChange = function()
{
};

//region state management
/**
 * Gets the state associated with the given state id.
 * By abstracting this, we can modify the underlying state before it reaches its destination.
 * @param {number} stateId The state id to get data for.
 * @returns {RPG_State}
 */
Game_Battler.prototype.state = function(stateId)
{
  return $dataStates[stateId];
};

/**
 * Overwrites {@link #states}.
 * Returns all states from the view of this battler.
 * @returns {RPG_State[]}
 */
Game_Battler.prototype.states = function()
{
  return this._states.map(stateId => this.state(stateId), this);
};

/**
 * Extends {@link #eraseState}.
 * Adds a hook for performing actions when a state is removed from the battler.
 */
J.BASE.Aliased.Game_Battler.set('eraseState', Game_Battler.prototype.eraseState);
Game_Battler.prototype.eraseState = function(stateId)
{
  // grab a snapshot of what the equips looked like before changing.
  const oldStates = Array.from(this._states);

  // perform original logic.
  J.BASE.Aliased.Game_Battler.get('eraseState').call(this, stateId);

  // determine if the states array changed from what it was before original logic.
  const isChanged = !oldStates.equals(this._states);

  // check if we did actually have change.
  if (isChanged)
  {
    // triggers the on-removal hook.
    this.onStateRemoval(stateId);
  }
};

/**
 * An event hook fired when this battler has a state removed.
 * @param {number} stateId The state id being removed.
 */
Game_Battler.prototype.onStateRemoval = function(stateId)
{
  // flag this battler for needing a data update.
  this.onBattlerDataChange();
};

/**
 * Extends {@link #addNewState}.
 * Adds a hook for performing actions when a state is added on the battler.
 */
J.BASE.Aliased.Game_Battler.set('addNewState', Game_Battler.prototype.addNewState);
Game_Battler.prototype.addNewState = function(stateId)
{
  // grab a snapshot of what the equips looked like before changing.
  const oldStates = Array.from(this._states);

  // perform original logic.
  J.BASE.Aliased.Game_Battler.get('addNewState').call(this, stateId);

  // determine if the states array changed from what it was before original logic.
  const isChanged = !oldStates.equals(this._states);

  // check if we did actually have change.
  if (isChanged)
  {
    // triggers the on-added hook.
    this.onStateAdded(stateId);
  }
};

/**
 * An event hook fired when this battler has a state added.
 * @param {number} stateId The state id being added.
 */
Game_Battler.prototype.onStateAdded = function(stateId)
{
  // flag this battler for needing a data update.
  this.onBattlerDataChange();
};

/**
 * Gets all states on the battler.
 * This can include other states from other plugins, too.
 * @returns {RPG_State[]}
 */
Game_Battler.prototype.allStates = function()
{
  // initialize our state collection.
  const states = [];

  // add in all base states.
  states.push(...this.states());

  // return that combined collection.
  return states;
};
//endregion state management

/**
 * Gets the current health percent of this battler.
 * @returns {number}
 */
Game_Battler.prototype.currentHpPercent = function()
{
  return parseFloat((this.hp / this.mhp).toFixed(2));
};

/**
 * Gets the current health percent of this battler as a base-100 integer.
 * @returns {number}
 */
Game_Battler.prototype.currentHpPercent100 = function()
{
  // return the whole base-100 version of the hp percent.
  return Math.round(this.currentHpPercent() * 100);
};
//endregion Game_Battler