//region Game_Battler
/**
 * Extends {@link Game_Battler.initMembers}.
 * Includes JABS parameter initialization.
 */
J.ABS.Aliased.Game_Battler.set('initMembers', Game_Battler.prototype.initMembers);
Game_Battler.prototype.initMembers = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Battler.get('initMembers').call(this);

  // initialize our custom members.
  this.initJabsMembers();
};

/**
 * Initializes additional parameters related to JABS for this battler.
 */
Game_Battler.prototype.initJabsMembers = function()
{
  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with JABS.
   */
  this._j._abs ||= {};

  /**
   * The unique identifier of this battler.
   * This is typically 6 characters long, including two pairs of 3 characters.
   * The characters used are one of the 16 available hexadecimal characters.
   * This includes `0-9` and `A-F`.
   * An example might be something like `a40-1f7`.
   * @type {string}
   */
  this._j._abs._uuid = J.BASE.Helpers.shortUuid();

  /**
   * The number of bonus hits this actor currently has.
   * @type {number}
   */
  this._j._abs._bonusHits = 0;

  /**
   * All equipped skills on this battler.
   * @type {JABS_SkillSlotManager}
   */
  this._j._abs._equippedSkills = new JABS_SkillSlotManager();
};

//region JABS battler properties
/**
 * Gets the `uuid` of this battler.
 * The default uuid for battlers is their name and the uuid connected by a hyphen.
 * @returns {string}
 */
Game_Battler.prototype.getUuid = function()
{
  // build the custom uuid including the name.
  const modifiedUuid = `${this.name()}_${this._j._abs._uuid}`;

  // return the name-based uuid.
  return modifiedUuid;
};

/**
 * Sets the `uuid` of this battler.
 * @param {string} uuid The `uuid` to assign to this battler.
 */
Game_Battler.prototype.setUuid = function(uuid)
{
  this._j._abs._uuid = uuid;
};

/**
 * Gets the underlying id of the battler from the database.
 * @returns {number}
 */
Game_Battler.prototype.battlerId = function()
{
  return 0;
};

/**
 * All battlers have a prepare time.
 * At this level, returns default 180 frames.
 * @returns {number}
 */
Game_Battler.prototype.prepareTime = function()
{
  return 180;
};

/**
 * Gets the battler's basic attack skill id.
 * This is defined by the first "Attack Skill" trait on a battler.
 * If there are multiple traits of this kind, only the first found will be used.
 * @returns {number}
 */
Game_Battler.prototype.basicAttackSkillId = function()
{
  // get the data from the database of this battler.
  const databaseData = this.databaseData();

  // the battler's basic attack is their first found "Attack Skill" trait.
  const attackSkillTrait = databaseData.traits
    .find(trait => trait.code === J.BASE.Traits.ATTACK_SKILLID);

  // check to make sure we found a trait.
  if (attackSkillTrait)
  {
    // return the traits underlying skill id.
    return attackSkillTrait.dataId;
  }

  // we didn't find a trait so just return 1.
  return 0;
};

/**
 * All battlers have a default sight range.
 * @returns {number}
 */
Game_Battler.prototype.sightRange = function()
{
  return 4;
};

/**
 * All battlers have a default alerted sight boost.
 * @returns {number}
 */
Game_Battler.prototype.alertedSightBoost = function()
{
  return 2;
};

/**
 * All battlers have a default pursuit range.
 * @returns {number}
 */
Game_Battler.prototype.pursuitRange = function()
{
  return 6;
};

/**
 * A multiplier against the vision of an enemy target.
 * This may increase/decrease the sight and pursuit range of an enemy attempting to
 * perceive the actor.
 * @returns {number}
 */
Game_Battler.prototype.getVisionModifier = function()
{
  // grab all the notes.
  const objectsToCheck = this.getAllNotes();

  // define the base vision rate for this battler.
  const baseVisionRate = 100;

  // get the vision multiplier from anything this battler has available.
  const visionMultiplier = RPGManager.getSumFromAllNotesByRegex(
    objectsToCheck,
    J.ABS.RegExp.VisionMultiplier);

  // calculate the multiplier.
  const totalVisionMultiplier = baseVisionRate + visionMultiplier;

  // constrain the multiplier to never go below 0.
  const constrainedVisionMultiplier = Math.max((totalVisionMultiplier / 100), 0);

  // return our constrainted multiplier.
  return constrainedVisionMultiplier;
};

/**
 * All battlers have a default alerted pursuit boost.
 * @returns {number}
 */
Game_Battler.prototype.alertedPursuitBoost = function()
{
  return 4;
};

/**
 * All battlers have a default alert duration.
 * @returns {number}
 */
Game_Battler.prototype.alertDuration = function()
{
  return 300;
};

/**
 * All battlers have a default team id.
 * At this level, the default team id is 1 (the default for enemies).
 * @returns {number}
 */
Game_Battler.prototype.teamId = function()
{
  return JABS_Battler.enemyTeamId();
};

/**
 * All battlers have a default AI.
 * @returns {JABS_EnemyAI}
 */
Game_Battler.prototype.ai = function()
{
  return new JABS_EnemyAI();
};

/**
 * All battlers can idle by default.
 * @returns {boolean}
 */
Game_Battler.prototype.canIdle = function()
{
  return true;
};

/**
 * All battlers will show their hp bar by default.
 * @returns {boolean}
 */
Game_Battler.prototype.showHpBar = function()
{
  return true;
};

/**
 * All battlers will show their danger indicator by default.
 * @returns {boolean}
 */
Game_Battler.prototype.showDangerIndicator = function()
{
  return true;
};

/**
 * All battlers will show their database name by default.
 * @returns {boolean}
 */
Game_Battler.prototype.showBattlerName = function()
{
  return true;
};

/**
 * All battlers can be invincible, but are not by default.
 * @returns {boolean}
 */
Game_Battler.prototype.isInvincible = function()
{
  return false;
};

/**
 * All battlers can be inanimate, but are not by default.
 * @returns {boolean}
 */
Game_Battler.prototype.isInanimate = function()
{
  return false;
};

/**
 * Gets whether or not the aggro is locked for this battler.
 * Locked aggro means their aggro cannot be modified in any way.
 * @returns {boolean}
 */
Game_Battler.prototype.isAggroLocked = function()
{
  return this.states().some(state => state.jabsAggroLock ?? false);
};
//endregion JABS battler properties

//region JABS skill slot management
/**
 * Gets the battler's skill slot manager directly.
 * @returns {JABS_SkillSlotManager}
 */
Game_Battler.prototype.getSkillSlotManager = function()
{
  return this._j._abs._equippedSkills;
};

/**
 * Retrieves all skills that are currently equipped on this actor.
 * @returns {JABS_SkillSlot[]}
 */
Game_Battler.prototype.getAllEquippedSkills = function()
{
  return this.getSkillSlotManager().getAllSlots();
};

/**
 * Gets the key to the slot that the provided skill id lives within.
 * @param {number} skillIdToFind The skill id to find amidst all equipped skills.
 * @returns {JABS_SkillSlot}
 */
Game_Battler.prototype.findSlotForSkillId = function(skillIdToFind)
{
  return this.getSkillSlotManager().getSlotBySkillId(skillIdToFind);
};

/**
 * Gets the currently-equipped skill id in the specified slot.
 * @param {string} slot The slot to retrieve an equipped skill for.
 * @returns {number}
 */
Game_Battler.prototype.getEquippedSkillId = function(slot)
{
  return this.getSkillSlot(slot).id;
};

/**
 * Gets the slot associated with a key.
 * @param {string} slot The slot to retrieve a slot for.
 * @returns {JABS_SkillSlot}
 */
Game_Battler.prototype.getSkillSlot = function(slot)
{
  return this.getSkillSlotManager().getSkillSlotByKey(slot);
};

/**
 * Gets all secondary slots that are unassigned.
 * @returns {JABS_SkillSlot[]}
 */
Game_Battler.prototype.getEmptySecondarySkills = function()
{
  return this.getSkillSlotManager().getEmptySecondarySlots();
};

/**
 * Sets the skill id to the specified slot with an option to lock the skill into the slot.
 * @param {string} slot The slot to retrieve an equipped skill for.
 * @param {number} skillId The skill id to assign to the specified slot.
 * @param {boolean} locked Whether or not the skill is locked onto this slot.
 */
Game_Battler.prototype.setEquippedSkill = function(slot, skillId, locked = false)
{
  // shorthand the skill slot manager.
  const skillSlotManager = this.getSkillSlotManager();

  // do nothing if we don't have skill slots to work with.
  if (!skillSlotManager) return;

  // check if we need to actually update the slot.
  if (this.needsSlotUpdate(slot, skillId, locked))
  {
    // update the slot.
    skillSlotManager.setSlot(slot, skillId, locked);

    // check if we're using the hud's input frame.
    if (J.HUD && J.HUD.EXT.INPUT)
    {
      // flag the slot for refresh.
      skillSlotManager.getSkillSlotByKey(slot).flagSkillSlotForRefresh();

      // request an update to the input frame.
      $hudManager.requestRefreshInputFrame();
    }
  }
};

/**
 * Whether or not this actor requires the given slot to be updated.
 * @param {string} slot The slot to retrieve an equipped skill for.
 * @param {number} skillId The skill id to assign to the specified slot.
 * @param {boolean} locked Whether or not the skill is locked onto this slot.
 * @returns {boolean} True if this slot needs to be updated, false otherwise.
 */
Game_Battler.prototype.needsSlotUpdate = function(slot, skillId, locked)
{
  // grab the slot in question.
  const currentSlot = this.getSkillSlot(slot);

  // if we have no slot currently, we need to update it.
  if (!currentSlot) return true;

  // if the locked states don't match, we need to update it.
  if (currentSlot.isLocked() !== locked) return true;

  // if the skill ids don't match, we need to udpate it.
  if (currentSlot.id !== skillId) return true;

  // guess we didn't need to update it after all.
  return false;
};

/**
 * Checks if a slot is locked or not.
 * @param {string} slot The slot being checked to see if it is locked.
 * @returns {boolean}
 */
Game_Battler.prototype.isSlotLocked = function(slot)
{
  return this.getSkillSlotManager()
    .getSkillSlotByKey(slot)
    .isLocked();
};

/**
 * Unlocks a slot that was forcefully assigned.
 * @param {string} slot The slot to unlock.
 */
Game_Battler.prototype.unlockSlot = function(slot)
{
  this.getSkillSlotManager()
    .getSkillSlotByKey(slot)
    .unlock();
};

/**
 * Unlocks all slots that were forcefully assigned.
 */
Game_Battler.prototype.unlockAllSlots = function()
{
  this.getSkillSlotManager().unlockAllSlots();
};
//endregion JABS skill slot management

//region on-chance effects
/**
 * Gets all retaliation skills associated with this battler.
 * @returns {JABS_OnChanceEffect[]}
 */
Game_Battler.prototype.retaliationSkills = function()
{
  // get all things that have notes.
  const objectsToCheck = this.getAllNotes();

  // get all retaliation skills from the notes.
  const retaliations = RPGManager.getOnChanceEffectsFromDatabaseObjects(
    objectsToCheck,
    J.ABS.RegExp.Retaliate);

  // return what was found.
  return retaliations;
};

/**
 * Gets all on-own-defeat skills associated with this battler.
 * @returns {JABS_OnChanceEffect[]}
 */
Game_Battler.prototype.onOwnDefeatSkillIds = function()
{
  // get all things that have notes.
  const objectsToCheck = this.getAllNotes();

  // get all on-own-defeat skills from the notes.
  const onOwnDeaths = RPGManager.getOnChanceEffectsFromDatabaseObjects(
    objectsToCheck,
    J.ABS.RegExp.OnOwnDefeat);

  // return what was found.
  return onOwnDeaths;
};

/**
 * Gets all on-target-defeat skills associated with this battler.
 * @returns {JABS_OnChanceEffect[]}
 */
Game_Battler.prototype.onTargetDefeatSkillIds = function()
{
  // get all things that have notes.
  const objectsToCheck = this.getAllNotes();

  // get all on-target-defeat skills from the notes.
  const onTargetKills = RPGManager.getOnChanceEffectsFromDatabaseObjects(
    objectsToCheck,
    J.ABS.RegExp.onTargetDefeat);

  // return what was found.
  return onTargetKills;
};
//endregion on-chance effects

//region JABS state management
/**
 * OVERWRITE Rewrites the handling for state application. The attacker is
 * now relevant to the state being applied.
 * @param {number} stateId The state id to potentially apply.
 * @param {Game_Battler} attacker The battler who is applying this state.
 */
J.ABS.Aliased.Game_Battler.set('addState', Game_Battler.prototype.addState);
Game_Battler.prototype.addState = function(stateId, attacker)
{
  // if we're missing an attacker or the engine is disabled, perform as usual.
  if (!attacker || !$jabsEngine._absEnabled)
  {
    // perform original logic.
    J.ABS.Aliased.Game_Battler.get('addState').call(this, stateId);

    // stop processing this state.
    return;
  }

  // check if we can add the state to the battler.
  if (this.isStateAddable(stateId))
  {
    // check to make sure we're not already afflicted with the state.
    if (!this.isStateAffected(stateId))
    {
      // add the new state with the attacker data.
      this.addNewState(stateId, attacker);

      // refresh this battler.
      this.refresh();
    }

    // reset the state counts for the battler.
    this.resetStateCounts(stateId, attacker);

    // add the new state to the action result on this battler.
    this._result.pushAddedState(stateId);
  }
};

/**
 * Extends this function to add the state to the JABS state tracker.
 * @param {number} stateId The state id to track.
 * @param {Game_Battler} attacker The battler who is applying this state.
 */
J.ABS.Aliased.Game_Battler.set('addNewState', Game_Battler.prototype.addNewState);
Game_Battler.prototype.addNewState = function(stateId, attacker)
{
  // perform original logic.
  J.ABS.Aliased.Game_Battler.get('addNewState').call(this, stateId);

  // add the jabs state.
  this.addJabsState(stateId, attacker);
};

/**
 * Refreshes the battler's state that is being re-applied.
 * @param {number} stateId The state id to track.
 * @param {Game_Battler} attacker The battler who is applying this state.
 */
J.ABS.Aliased.Game_Battler.set('resetStateCounts', Game_Battler.prototype.resetStateCounts);
Game_Battler.prototype.resetStateCounts = function(stateId, attacker)
{
  // perform original logic.
  J.ABS.Aliased.Game_Battler.get('resetStateCounts').call(this, stateId);

  // add the state to the battler.
  this.addJabsState(stateId, attacker);
};

/**
 * Extends `removeState()` to also expire the state in the JABS state tracker.
 * @param {number} stateId
 */
J.ABS.Aliased.Game_Battler.set('removeState', Game_Battler.prototype.removeState);
Game_Battler.prototype.removeState = function(stateId)
{
  // perform original logic.
  J.ABS.Aliased.Game_Battler.get('removeState').call(this, stateId);

  // query for the state to remove from the engine.
  const trackedState = $jabsEngine.getJabsStateByUuidAndStateId(this.getUuid(), stateId);

  // check if we found anything.
  if (trackedState)
  {
    // expire the found state if it is being removed.
    trackedState.expired = true;
  }
};

/**
 * Adds a particular state to become tracked by the tracker for this battler.
 * @param {number} stateId The state id to track.
 * @param {Game_Battler|Game_Actor|Game_Enemy} attacker The battler who is applying this state.
 */
Game_Battler.prototype.addJabsState = function(stateId, attacker)
{
  // reassign the incoming parameter because we are good developers.
  let assailant = attacker;

  // check if we're missing an actor due to external application of state.
  if (!attacker)
  {
    // typically, this condition occurs when an enemy applies to an actor.
    assailant = this;
  }

  // grab the state from the attacker's perspective.
  const state = assailant.state(stateId);

  // extract the base duration and icon index.
  const { removeByWalking, stepsToRemove: baseDuration, iconIndex } = state;

  // calculate the total duration of the state.
  let totalDuration = baseDuration;

  // check if the state is removable by duration.
  if (removeByWalking)
  {
    // extend our states per the one applying the states.
    totalDuration += assailant.getStateDurationBoost(baseDuration);
  }
  // the state is not removable, so it is an eternal state.
  else
  {
    // set the duration to -1 to flag it as an eternal state.
    totalDuration = -1;
  }

  // TODO: get this from the state?
  const stacks = 1;

  // build the new state.
  const jabsState = new JABS_State(this, stateId, iconIndex, totalDuration, stacks, assailant);

  // add the state to the engine's tracker.
  $jabsEngine.addOrUpdateStateByUuid(this.getUuid(), jabsState);
};

/**
 * Determines the various state duration boosts available to this battler.
 * @param {number} baseDuration The base duration of the state.
 * @returns {number} The number of bonus frames to add to the duration of negative states.
 */
Game_Battler.prototype.getStateDurationBoost = function(baseDuration)
{
  // TODO: update annotations file with new regex and usage?
  // grab everything with notes.
  const objectsToCheck = this.getAllNotes();

  // sum together all the state duration boost flat modifiers.
  const flat = RPGManager.getSumFromAllNotesByRegex(
    objectsToCheck,
    J.ABS.RegExp.StateDurationFlatPlus);

  // calculate the flat duration boost.
  const percent = RPGManager.getSumFromAllNotesByRegex(
    objectsToCheck,
    J.ABS.RegExp.StateDurationPercentPlus);

  // calculate the percent duration boost.
  const percentBoost = Math.round(baseDuration * (percent / 100));

  // calculate the formulai duration boost.
  const formulaiBoost = RPGManager.getResultsFromAllNotesByRegex(
    objectsToCheck,
    J.ABS.RegExp.StateDurationFormulaPlus,
    baseDuration,
    this);

  // sum the boosts together to get the total boost.
  const durationBoost = flat + percentBoost + formulaiBoost;

  // format it kindly because javascript floating point numbers suck.
  const formattedDurationBoost = parseFloat(durationBoost.toFixed(2));

  // return the total state duration boost.
  return formattedDurationBoost;
};
//endregion JABS state management

//region JABS bonus hits
/**
 * Updates the bonus hit count for this actor based on equipment.
 *
 * NOTE:
 * This is explicitly not using `this.getAllNotes()` so that we can
 * also parse out the repeats from all the relevant sources as well.
 */
Game_Battler.prototype.refreshBonusHits = function()
{
  // default to zero bonus hits.
  let bonusHits = 0;

  // collection of collections of sources from which bonus hits may reside.
  const sourceCollections = this.getBonusHitsSources();

  // iterate over the source collections.
  sourceCollections.forEach(sourceCollection =>
  {
    // add up all the bonus hits available.
    bonusHits += this.getBonusHitsFromSources(sourceCollection);
  });

  // set the bonus hits to the total amount found everywhere.
  this.setBonusHits(bonusHits);
};

/**
 * Gets all collections of sources that will be scanned for bonus hits.
 * @returns {RPG_BaseItem[][]}
 */
Game_Battler.prototype.getBonusHitsSources = function()
{
  return [
    this.states(),
    [this.databaseData()],
  ];
};

/**
 * Gets the bonus hits for this battler.
 * @returns {number}
 */
Game_Battler.prototype.getBonusHits = function()
{
  return this._j._abs._bonusHits;
};

/**
 * Sets the bonus hits to the given value.
 * @param {number} bonusHits The new bonus hits value.
 */
Game_Battler.prototype.setBonusHits = function(bonusHits)
{
  this._j._abs._bonusHits = bonusHits;
};

/**
 * Extracts all bonus hits from a collection of traited sources.
 * @param {RPG_Traited[]|RPG_BaseBattler[]|RPG_Class[]|RPG_Skill[]} sources The collection to iterate over.
 * @returns {number}
 */
Game_Battler.prototype.getBonusHitsFromSources = function(sources)
{
  // set this counter to zero.
  let bonusHits = 0;

  // reducer function for adding repeat traits up as bonus hits.
  const addHitsReducer = (runningTotal, trait) => runningTotal + trait.value;

  // filter function for getting only "attack repeats" traits off this item.
  const isHitsTrait = trait => trait.code === J.BASE.Traits.ATTACK_REPEATS;

  // foreach function for collecting bonus hits from the given source.
  const collectBonusHitsForEacher = source =>
  {
    // if the slot is empty, don't process it.
    if (!source) return;

    // grab the bonus hits from
    bonusHits += source.jabsBonusHits;

    // stop processing if the source has no traits.
    if (!source.traits) return;

    // also grab from traits if applicable.
    bonusHits += source.traits
      .filter(isHitsTrait)
      .reduce(addHitsReducer, 0);
  }

  // iterate over all equips.
  sources.forEach(collectBonusHitsForEacher);

  // return the bonus hits from some traited sources.
  return bonusHits;
};
//endregion JABS bonus hits

/**
 * Checks all states to see if we have anything that grants parry ignore.
 * @returns {boolean}
 */
Game_Battler.prototype.ignoreAllParry = function()
{
  // grab all the notes.
  const objectsToCheck = this.getAllNotes();

  // check if any of the note objects possibly could be granting ignore parry.
  const unparryable = RPGManager.checkForBooleanFromAllNotesByRegex(
    objectsToCheck,
    J.ABS.RegExp.Unparryable) ?? false;

  // return what we found.
  return unparryable;
};

/**
 * Disables native RMMZ regeneration.
 */
Game_Battler.prototype.regenerateAll = function()
{
};
//endregion Game_Battler