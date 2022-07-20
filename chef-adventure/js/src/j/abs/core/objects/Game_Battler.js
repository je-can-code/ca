//#region Game_Battler
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
 * @returns {JABS_BattlerAI}
 */
Game_Battler.prototype.ai = function()
{
  return new JABS_BattlerAI();
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
Game_Battler.prototype.getEquippedSkill = function(slot)
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
    if (J.HUD && J.HUD.EXT_INPUT)
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

/**
 * All battlers have a default of no retaliation skills.
 * @returns {JABS_OnChanceEffect[]}
 */
Game_Battler.prototype.retaliationSkills = function()
{
  const structure = /<retaliate:[ ]?(\[\d+,[ ]?\d+])>/i;
  const objectsToCheck = this.getAllNotes();
  const skills = [];
  objectsToCheck.forEach(obj =>
  {
    const innerSkills = J.BASE.Helpers.parseSkillChance(structure, obj);
    skills.push(...innerSkills);
  });

  return skills;
};

/**
 * All battlers have a default of no on-own-defeat skill ids.
 * @returns {JABS_OnChanceEffect[]}
 */
Game_Battler.prototype.onOwnDefeatSkillIds = function()
{
  return [];
};

/**
 * All battlers have a default of no on-defeating-a-target skill ids.
 * @returns {JABS_OnChanceEffect[]}
 */
Game_Battler.prototype.onTargetDefeatSkillIds = function()
{
  return [];
};

/**
 * A multiplier against the vision of an enemy target.
 * This may increase/decrease the sight and pursuit range of an enemy attempting to
 * perceive the actor.
 * @returns {number}
 */
Game_Battler.prototype.getVisionModifier = function()
{
  let visionMultiplier = 100;
  const objectsToCheck = this.getAllNotes();
  objectsToCheck.forEach(obj => (visionMultiplier += this.extractVisionModifiers(obj)));

  return Math.max((visionMultiplier / 100), 0);
};

/**
 * Gets all modifiers related to vision from this database object.
 * @param referenceData
 * @returns {number}
 */
Game_Battler.prototype.extractVisionModifiers = function(referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return 0;

  const notedata = referenceData.note.split(/[\r\n]+/);
  const structure = /<visionMultiplier:[ ]?(-?[\d]+)>/i;
  let visionMultiplier = 0;
  notedata.forEach(line =>
  {
    if (line.match(structure))
    {
      const multiplier = parseInt(RegExp.$1);
      visionMultiplier += multiplier;
    }
  });

  return visionMultiplier;
};

/**
 * Adds the `uuid` to the battler class.
 */
J.ABS.Aliased.Game_Battler.initMembers = Game_Battler.prototype.initMembers;
Game_Battler.prototype.initMembers = function()
{
  J.ABS.Aliased.Game_Battler.initMembers.call(this);
  /**
   * All modifications to the battler lives within this object.
   * @type {any}
   */
  this._j = this._j || {
    /**
     * The `uuid` of this battler.
     * @type {string}
     */
    _uuid: J.BASE.Helpers.generateUuid(),
  };

  /**
   * All equipped skills on this battler.
   * @type {JABS_SkillSlotManager}
   */
  this._j._equippedSkills = new JABS_SkillSlotManager();
};

/**
 * Gets the `uuid` of this battler.
 * At this level, only returns an empty string.
 * @returns {string}
 */
Game_Battler.prototype.getUuid = function()
{
  return this._j._uuid;
};

/**
 * Sets the `uuid` of this battler.
 * @param {string} uuid The `uuid` to assign to this battler.
 */
Game_Battler.prototype.setUuid = function(uuid)
{
  this._j._uuid = uuid;
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
 * Gets the battler's skill slot manager directly.
 * @returns {JABS_SkillSlotManager}
 */
Game_Battler.prototype.getSkillSlotManager = function()
{
  return this._j._equippedSkills;
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

/**
 * OVERWRITE Rewrites the handling for state application. The attacker is
 * now relevant to the state being applied.
 * @param {number} stateId The state id to potentially apply.
 * @param {Game_Battler} attacker The battler who is applying this state.
 */
J.ABS.Aliased.Game_Battler.addState = Game_Battler.prototype.addState;
Game_Battler.prototype.addState = function(stateId, attacker)
{
  // if we're missing an attacker or the engine is disabled, perform as usual.
  if (!attacker || !$jabsEngine._absEnabled)
  {
    // perform original logic.
    J.ABS.Aliased.Game_Battler.addState.call(this, stateId);

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
J.ABS.Aliased.Game_Battler.addNewState = Game_Battler.prototype.addNewState;
Game_Battler.prototype.addNewState = function(stateId, attacker)
{
  // perform original logic.
  J.ABS.Aliased.Game_Battler.addNewState.call(this, stateId);

  // add the jabs state.
  this.addJabsState(stateId, attacker);
};

/**
 * Refreshes the battler's state that is being re-applied.
 * @param {number} stateId The state id to track.
 * @param {Game_Battler} attacker The battler who is applying this state.
 */
J.ABS.Aliased.Game_Battler.resetStateCounts = Game_Battler.prototype.resetStateCounts;
Game_Battler.prototype.resetStateCounts = function(stateId, attacker)
{
  // perform original logic.
  J.ABS.Aliased.Game_Battler.resetStateCounts.call(this, stateId);

  // add the state to the battler.
  this.addJabsState(stateId, attacker);
};

/**
 * Extends `removeState()` to also expire the state in the JABS state tracker.
 * @param {number} stateId
 */
J.ABS.Aliased.Game_Battler.removeState = Game_Battler.prototype.removeState;
Game_Battler.prototype.removeState = function(stateId)
{
  // perform original logic.
  J.ABS.Aliased.Game_Battler.removeState.call(this, stateId);

  // query for the state to remove from the engine.
  const stateTracker = $jabsEngine.findStateTrackerByBattlerAndState(this, stateId);

  // check if we found anything.
  if (stateTracker)
  {
    // expire the found state if it is being removed.
    stateTracker.expired = true;
  }
};

/**
 * Adds a particular state to become tracked by the tracker for this battler.
 * @param {number} stateId The state id to track.
 * @param {Game_Battler} attacker The battler who is applying this state.
 */
Game_Battler.prototype.addJabsState = function(stateId, attacker)
{
  // check if we're missing an actor due to external application of state.
  if (!attacker)
  {
    // assign the attacker to be oneself if none otherwise exists.
    attacker = this;
  }

  // grab the state from the attacker's perspective.
  const state = attacker.state(stateId);

  // grab the duration out of the state.
  let duration = state.stepsToRemove;

  // check if we should extend our incoming positive states.
  if (this.isActor() && !state.jabsNegative)
  {
    // extend our incoming positive states!
    duration += this.getStateDurationBoost(duration, attacker);
  }
  // check if we should extend our outgoing negative states.
  else if (this.isEnemy() && attacker && attacker.isActor() && state.jabsNegative)
  {
    // extend our outgoing negative states!
    duration += attacker.getStateDurationBoost(duration, this);
  }

  // build a new state tracker based on the given data.
  const stateTracker = new JABS_TrackedState({
    battler: this,
    stateId: stateId,
    iconIndex: state.iconIndex,
    duration: duration,
    source: attacker
  });

  // add the state to the engine's tracker.
  $jabsEngine.addStateTracker(stateTracker);
};

/**
 * Determines the various state duration boosts available to this battler.
 * @param {number} baseDuration The base duration of the state.
 * @param {Game_Battler} attacker The attacker- for use with formulai.
 * @returns {number}
 */
Game_Battler.prototype.getStateDurationBoost = function(baseDuration, attacker)
{
  return 0;
};

/**
 * Gets the numeric representation of this battler's strength.
 * @returns {number}
 */
Game_Battler.prototype.getPowerLevel = function()
{
  let powerLevel = 0;
  let counter = 2;
  // skip HP/MP
  const bparams = [2, 3, 4, 5, 6, 7];
  const xparams = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  const sparams = [18, 19, 20, 21, 22, 23, 24, 25];
  while (counter < 28)
  {
    if (bparams.includes(counter))
    {
      powerLevel += this.param(counter);
    }

    if (xparams.includes(counter))
    {
      powerLevel += this.xparam(counter - 8) * 100;
    }

    if (sparams.includes(counter))
    {
      powerLevel += (this.sparam(counter - 18) * 100 - 100);
    }

    counter++;
  }

  if (Number.isNaN(powerLevel))
  {
    console.warn('what happened');
  }

  powerLevel += (this.level ** 2);
  return Math.round(powerLevel);
};

/**
 * Gets the current number of bonus hits for this actor.
 * At the Game_Battler level will always return 0.
 * @returns {number}
 */
Game_Battler.prototype.getBonusHits = function()
{
  return 0;
};

/**
 * Extracts all bonus hits from a collection of traited sources.
 * @param {RPG_Traited[]|RPG_BaseBattler[]|RPG_Class[]} sources The collection to iterate over.
 * @returns {number}
 */
Game_Battler.prototype.getBonusHitsFromTraitedSources = function(sources)
{
  // set this counter to zero.
  let bonusHits = 0;

  // build the reducer for adding repeat traits up as bonus hits.
  const reducer = (previousValue, currentValue) => previousValue + currentValue.value;
  const isHitsTrait = trait => trait.code === J.BASE.Traits.ATTACK_REPEATS;

  // iterate over all equips.
  sources.forEach(source =>
  {
    // if the slot is empty, don't process it.
    if (!source) return;

    // grab the bonus hits from
    bonusHits += source.jabsBonusHits;
    bonusHits += source.traits
      .filter(isHitsTrait)
      .reduce(reducer, 0);
  });

  // return the bonus hits from some traited sources.
  return bonusHits;
};

/**
 * Extracts all bonus hits from a collection of non-traited sources.
 * @param {RPG_Skill[]|RPG_Item[]} sources The collection to iterate over.
 * @returns {number}
 */
Game_Battler.prototype.getBonusHitsFromNonTraitedSources = function(sources)
{
  // set this counter to zero.
  let bonusHits = 0;

  // iterate over all non-traited sources.
  sources.forEach(source =>
  {
    // grab the bonus hits from the source.
    bonusHits += source.jabsBonusHits;
  });

  // return the bonus hits from non-traited sources.
  return bonusHits;
};

/**
 * Gets the current health percent of this battler.
 * @returns {number}
 */
Game_Battler.prototype.currentHpPercent = function()
{
  return parseFloat((this.hp / this.mhp).toFixed(2));
};

Game_Battler.prototype.extractBonusHits = function(notedata)
{
  return 0;
};

/**
 * Checks all states to see if we have anything that grants parry ignore.
 * @returns {boolean}
 */
Game_Battler.prototype.ignoreAllParry = function()
{
  const objectsToCheck = this.states();
  if (J.PASSIVE)
  {
    objectsToCheck.push(...this.passiveSkillStates());
  }

  const unparryable = objectsToCheck.some(obj => obj.jabsUnparryable);

  return unparryable;
};

/**
 * Overwrites {@link Game_Battler.regenerateAll}.
 * JABS manages its own regeneration, so we don't want this interfering.
 */
Game_Battler.prototype.regenerateAll = function()
{
};
//#endregion Game_Battler