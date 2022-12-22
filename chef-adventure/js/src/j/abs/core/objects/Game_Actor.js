//region Game_Actor
/**
 * Extends {@link #initJabsMembers}.
 * Includes additional actor-specific members.
 */
J.ABS.Aliased.Game_Actor.set('initJabsMembers', Game_Actor.prototype.initJabsMembers);
Game_Actor.prototype.initJabsMembers = function()
{
  // perform original logic.
  Game_Battler.prototype.initJabsMembers.call(this);

  /**
   * The over-arching J object to contain all additional plugin parameters.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with JABS.
   */
  this._j._abs ||= {};

  /**
   * Whether or not the death effect has been performed.
   * The death effect is defined as "death animation".
   * @type {boolean}
   */
  this._j._abs._deathEffect = false;
};

/**
 * Extends `.setup()` and initializes the jabs equipped skills.
 */
J.ABS.Aliased.Game_Actor.set('setup', Game_Actor.prototype.setup);
Game_Actor.prototype.setup = function(actorId)
{
  // perform original logic.
  J.ABS.Aliased.Game_Actor.get('setup').call(this, actorId);

  // setup all the JABS skill slots for the first time.
  this.initAbsSkills();

  // execute the first refresh for JABS-related things.
  this.jabsRefresh();
};

/**
 * Refreshes aspects associated with this battler in the context of JABS.
 */
Game_Actor.prototype.jabsRefresh = function()
{
  // refresh the currently equipped skills to ensure they are still valid.
  this.refreshBasicAttackSkills();

  // refresh the bonus hits to ensure they are still accurate.
  this.refreshBonusHits();
};

/**
 * Extends {@link #onBattlerDataChange}.
 * Adds a hook for performing actions when the battler's data hase changed.
 */
J.ABS.Aliased.Game_Actor.set('onBattlerDataChange', Game_Actor.prototype.onBattlerDataChange);
Game_Actor.prototype.onBattlerDataChange = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Actor.get('onBattlerDataChange').call(this);

  // update JABS-related things.
  this.jabsRefresh();
};

//region JABS basic attack skills
/**
 * Initializes the JABS equipped skills based on equipment.
 */
Game_Actor.prototype.initAbsSkills = function()
{
  // setup the skill slots for the first time.
  this.getSkillSlotManager().setupSlots(this);

  // update them with data.
  this.refreshBasicAttackSkills();

  // update the auto-equippable skills if applicable.
  this.refreshAutoEquippedSkills();
};

/**
 * Refreshes the JABS skills that are currently equipped.
 * If any are no longer valid, they will be removed.
 */
Game_Actor.prototype.refreshBasicAttackSkills = function()
{
  // don't refresh if setup hasn't been completed.
  if (!this.canRefreshBasicAttackSkills()) return;

  // update the mainhand skill slot.
  this.updateMainhandSkill();

  // update the offhand skill slot.
  this.updateOffhandSkill();

  // remove all unequippable skills from their slots.
  this.removeInvalidSkills();
};

/**
 * Determines whether or not basic attack skills can be refreshed.
 * @returns {boolean} True if they can be refreshed, false otherwise.
 */
Game_Actor.prototype.canRefreshBasicAttackSkills = function()
{
  // don't refresh if the initialization hasn'te ven been completed.
  if (!this.getSkillSlotManager()) return false;

  // don't refresh if setup hasn't been completed.
  if (!this.getSkillSlotManager().isSetupComplete()) return false;

  // refresh!
  return true;
};

/**
 * Updates the mainhand skill slot with the most up-to-date value.
 */
Game_Actor.prototype.updateMainhandSkill = function()
{
  // determine the current main and offhand skills.
  const mainhandSkill = this.getMainhandSkill();

  // update the main and offhand skill slots.
  this.setEquippedSkill(JABS_Button.Mainhand, mainhandSkill);
};

/**
 * Gets the mainhand skill for this actor.
 * @returns {number}
 */
Game_Actor.prototype.getMainhandSkill = function()
{
  // grab the mainhand of the actor.
  const [mainhand,] = this.equips();

  // default the mainhand skill to 0.
  let mainhandSkill = 0;

  // check if we have something in our mainhand.
  if (mainhand)
  {
    // assign the skill id tag from the mainhand.
    mainhandSkill = mainhand.jabsSkillId ?? 0;
  }

  // return what we found.
  return mainhandSkill
};

/**
 * Updates the offhand skill slot with the most up-to-date value.
 */
Game_Actor.prototype.updateOffhandSkill = function()
{
  // determine the current main and offhand skills.
  const offhandSkill = this.getOffhandSkill();

  // update the offhand skill slot.
  this.setEquippedSkill(JABS_Button.Offhand, offhandSkill);
};

/**
 * Gets the offhand skill for this actor.
 *
 * Takes into consideration the possibility of an offhand override
 * from the mainhand or some states.
 * @returns {number} The offhand skill id.
 */
Game_Actor.prototype.getOffhandSkill = function()
{
  // grab the offhand skill override if one exists.
  const offhandOverride = this.offhandSkillOverride();

  // check if there is an offhand override skill to use instead.
  if (offhandOverride)
  {
    // return the override.
    return offhandOverride;
  }

  // grab the offhand of the actor.
  const [,offhand] = this.equips();

  // default the offhand skill to 0.
  let offhandSkill = 0;

  // check if we have something in our offhand.
  if (offhand)
  {
    // assign the skill id tag from the offhand.
    offhandSkill = offhand.jabsSkillId ?? 0;
  }

  // return what we found.
  return offhandSkill;
};

/**
 * Gets the offhand skill id override if one exists from
 * any states.
 * @returns {number}
 */
Game_Actor.prototype.offhandSkillOverride = function()
{
  // default to override of skill id 0.
  let overrideSkillId = 0;

  // grab all states to start.
  const objectsToCheck = [...this.states()];

  // grab the weapon of the actor.
  const [weapon,] = this.equips();

  // check if we have a weapon.
  if (weapon)
  {
    // add the weapon on for possible offhand overrides.
    objectsToCheck.unshift(weapon);
  }

  // iterate over all sources.
  objectsToCheck.forEach(obj =>
  {
    // check if we have an offhand skill id override.
    if (obj.jabsOffhandSkillId)
    {
      // assign it if we do.
      overrideSkillId = obj.jabsOffhandSkillId;
    }
  });

  // return the last override skill found, if any.
  return overrideSkillId;
};

/**
 * Automatically removes all skills that are no longer available.
 * This most commonly will occur when a skill is bound to equipment that is
 * no longer equipped to the character. Skills that are "forced" will not be removed.
 */
Game_Actor.prototype.removeInvalidSkills = function()
{
  // grab all the slots this actor has.
  const slots = this.getSkillSlotManager().getAllSlots();

  // iterate over each of them.
  slots.forEach(skillSlot =>
  {
    // check if we currently know this skill.
    if (!this.hasSkill(skillSlot.id))
    {
      // remove it if we don't.
      skillSlot.autoclear();
    }
  });
};
//endregion JABS basic attack skills

//region JABS battler properties
/**
 * Actors have fixed `uuid`s, and thus it can be calculated as-is.
 * @returns {string}
 */
Game_Actor.prototype.getUuid = function()
{
  // validate we have an actor.
  if (this.actor())
  {
    // return the actor's constant uuid.
    return `actor-${this.actorId()}`;
  }

  console.warn("no uuid currently available for this actor.", this);
  return String.empty;
};

/**
 * Gets the prepare time for this actor.
 * Actors are not gated by prepare times, only by post-action cooldowns.
 * @returns {number}
 */
Game_Actor.prototype.prepareTime = function()
{
  return 1;
};

/**
 * Gets the sight range for this actor.
 * Looks first to the class, then the actor for the tag.
 * If neither are present, then it returns the default.
 * @returns {number}
 */
Game_Actor.prototype.sightRange = function()
{
  let val = Game_Battler.prototype.sightRange.call(this);
  const referenceData = this.actor();

  // if there is a class prepare tag, we want that first.
  const referenceDataClass = $dataClasses[referenceData.classId];
  if (referenceDataClass.meta && referenceDataClass.meta[J.BASE.Notetags.Sight])
  {
    return parseInt(referenceDataClass.meta[J.BASE.Notetags.Sight]);
  }

  // if there is no class prepare tag, then look to the actor.
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Sight])
  {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.Sight]);
  }
  else
  {
    // if its not in the metadata, then check the notes proper.
    const structure = /<s:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        val = parseInt(RegExp.$1);
      }
    })
  }

  return val;
};

/**
 * Gets the alerted sight boost for this actor.
 * Looks first to the class, then the actor for a skill id tag.
 * If neither are present, then it returns the default.
 * @returns {number}
 */
Game_Actor.prototype.alertedSightBoost = function()
{
  let val = Game_Battler.prototype.alertedSightBoost.call(this);
  const referenceData = this.actor();

  // if there is a class prepare tag, we want that first.
  const referenceDataClass = $dataClasses[referenceData.classId];
  if (referenceDataClass.meta && referenceDataClass.meta[J.BASE.Notetags.AlertSightBoost])
  {
    return parseInt(referenceDataClass.meta[J.BASE.Notetags.AlertSightBoost]);
  }

  // if there is no class prepare tag, then look to the actor.
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertSightBoost])
  {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.AlertSightBoost]);
  }
  else
  {
    // if its not in the metadata, then check the notes proper.
    const structure = /<as:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        val = parseInt(RegExp.$1);
      }
    })
  }

  return val;
};

/**
 * Gets the alerted pursuit boost for this actor.
 * Looks first to the class, then the actor for a skill id tag.
 * If neither are present, then it returns the default.
 * @returns {number}
 */
Game_Actor.prototype.pursuitRange = function()
{
  let val = Game_Battler.prototype.pursuitRange.call(this);
  const referenceData = this.actor();

  // if there is a class prepare tag, we want that first.
  const referenceDataClass = $dataClasses[referenceData.classId];
  if (referenceDataClass.meta && referenceDataClass.meta[J.BASE.Notetags.Pursuit])
  {
    return parseInt(referenceDataClass.meta[J.BASE.Notetags.Pursuit]);
  }

  // if there is no class prepare tag, then look to the actor.
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Pursuit])
  {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.Pursuit]);
  }
  else
  {
    // if its not in the metadata, then check the notes proper.
    const structure = /<p:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        val = parseInt(RegExp.$1);
      }
    })
  }

  return val;
};

/**
 * Gets the alerted pursuit boost for this actor.
 * Looks first to the class, then the actor for a skill id tag.
 * If neither are present, then it returns the default.
 * @returns {number}
 */
Game_Actor.prototype.alertedPursuitBoost = function()
{
  let val = Game_Battler.prototype.alertedPursuitBoost.call(this);
  const referenceData = this.actor();

  // if there is a class prepare tag, we want that first.
  const referenceDataClass = $dataClasses[referenceData.classId];
  if (referenceDataClass.meta && referenceDataClass.meta[J.BASE.Notetags.AlertPursuitBoost])
  {
    return parseInt(referenceDataClass.meta[J.BASE.Notetags.AlertPursuitBoost]);
  }

  // if there is no class prepare tag, then look to the actor.
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertPursuitBoost])
  {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.AlertPursuitBoost]);
  }
  else
  {
    // if its not in the metadata, then check the notes proper.
    const structure = /<ap:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        val = parseInt(RegExp.$1);
      }
    })
  }

  return val;
};

/**
 * Gets the alert duration for this actor.
 * Looks first to the class, then the actor for a skill id tag.
 * If neither are present, then it returns the default.
 * @returns {number}
 */
Game_Actor.prototype.alertDuration = function()
{
  let val = Game_Battler.prototype.alertDuration.call(this);
  const referenceData = this.actor();

  // if there is a class prepare tag, we want that first.
  const referenceDataClass = $dataClasses[referenceData.classId];
  if (referenceDataClass.meta && referenceDataClass.meta[J.BASE.Notetags.AlertDuration])
  {
    return parseInt(referenceDataClass.meta[J.BASE.Notetags.AlertDuration]);
  }

  // if there is no class prepare tag, then look to the actor.
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertDuration])
  {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.AlertDuration]);
  }
  else
  {
    // if its not in the metadata, then check the notes proper.
    const structure = /<ad:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        val = parseInt(RegExp.$1);
      }
    })
  }

  return val;
};

/**
 * Gets the ai of the actor.
 * Though allies leverage ally ai for action decision making, this AI does
 * have one effect: how to move around and stuff throughout the phases.
 * @returns {null}
 */
Game_Actor.prototype.ai = function()
{
  return new JABS_EnemyAI();
};

/**
 * Gets whether or not the actor can idle.
 * Actors can never idle.
 * @returns {boolean}
 */
Game_Actor.prototype.canIdle = function()
{
  return false;
};

/**
 * Gets whether or not the actor's hp bar will show.
 * Actors never show their hp bar (they use HUDs for that).
 * @returns {boolean}
 */
Game_Actor.prototype.showHpBar = function()
{
  return false;
};

/**
 * Gets whether or not the actor's name will show below their character.
 * Actors never show their name (the use HUDs for that).
 * @returns {boolean}
 */
Game_Actor.prototype.showBattlerName = function()
{
  return false;
};

/**
 * Gets whether or not the actor is invincible.
 * Actors are never invincible by this means.
 * @returns {boolean}
 */
Game_Actor.prototype.isInvincible = function()
{
  return false;
};

/**
 * Gets whether or not the actor is inanimate.
 * Actors are never inanimate (duh).
 * @returns {boolean}
 */
Game_Actor.prototype.isInanimate = function()
{
  return false;
};

/**
 * The team id of this actor.
 * Defaults to the default ally team id.
 * @returns {number}
 */
Game_Actor.prototype.teamId = function()
{
  let val = JABS_Battler.allyTeamId();

  const referenceData = this.databaseData();
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Team])
  {
    // if its in the metadata, then grab it from there.
    val = referenceData.meta[J.BASE.Notetags.Team];
  }
  else
  {
    const structure = /<team:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        val = RegExp.$1;
      }
    });
  }

  return parseInt(val);
};

/**
 * Checks all possible places for whether or not the actor is able to
 * be switched to.
 * @returns {boolean}
 */
Game_Actor.prototype.switchLocked = function()
{
  const objectsToCheck = this.getAllNotes();
  const structure = /<noSwitch>/i;
  let switchLocked = false;
  objectsToCheck.forEach(obj =>
  {
    const notedata = obj.note.split(/[\r\n]+/);
    notedata.forEach(line =>
    {
      if (line.match(structure))
      {
        switchLocked = true;
      }
    });
  });

  return switchLocked;
};
//endregion JABS battler properties

//region ondeath management
/**
 * Gets whether or not this actor needs a death effect.
 * @returns {boolean}
 */
Game_Actor.prototype.needsDeathEffect = function()
{
  return this._j._abs._deathEffect;
};

/**
 * Toggles this actor's need for a death effect.
 */
Game_Actor.prototype.toggleDeathEffect = function()
{
  this._j._abs._deathEffect = !this._j._abs._deathEffect;
};

/**
 * Toggles the death effect for this actor when they die.
 */
J.ABS.Aliased.Game_Actor.set('onDeath', Game_Actor.prototype.onDeath);
Game_Actor.prototype.onDeath = function()
{
  // toggle the on-death flag for tracking if death has occurred or not.
  this.toggleDeathEffect();
};

/**
 * Reverts the death effect toggle when they are revived.
 */
J.ABS.Aliased.Game_Actor.set('onRevive', Game_Actor.prototype.onRevive);
Game_Actor.prototype.onRevive = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Actor.get('onRevive').call(this);

  // stops this battler from being flagged as dead by JABS.
  this.stopDying();
};

/**
 * Stops this actor from being in the death effect flagged state.
 */
Game_Actor.prototype.stopDying = function()
{
  // grab the battler that is revived.
  const jabsBattler = JABS_AiManager.getBattlerByUuid(this.getUuid());

  // validate the existance of the battler before using.
  if (!jabsBattler) return;

  // turn off the dying effect.
  jabsBattler.setDying(false);
};
//endregion ondeath management

//region JABS skill slot access
/**
 * Gets all skill slots identified as "primary".
 * @returns {JABS_SkillSlot[]}
 */
Game_Actor.prototype.getAllPrimarySkills = function()
{
  return this.getSkillSlotManager().getAllPrimarySlots();
};

/**
 * Gets all skill slots identified as "secondary".
 * @returns {JABS_SkillSlot[]}
 */
Game_Actor.prototype.getAllSecondarySkills = function()
{
  return this.getSkillSlotManager().getAllSecondarySlots();
};

/**
 * Gets the skill dedicated to the tool slot.
 * @returns {JABS_SkillSlot}
 */
Game_Actor.prototype.getToolSkill = function()
{
  return this.getSkillSlotManager().getToolSlot();
};

/**
 * Gets the skill dedicated to the dodge slot.
 * @returns {JABS_SkillSlot}
 */
Game_Actor.prototype.getDodgeSkill = function()
{
  return this.getSkillSlotManager().getDodgeSlot();
};

/**
 * Gets all skill slots that have skills assigned to them.
 * @returns {JABS_SkillSlot[]}
 */
Game_Actor.prototype.getValidEquippedSkillSlots = function()
{
  // don't try to get slots if we are not setup yet.
  if (!this.getSkillSlotManager()) return [];

  return this.getSkillSlotManager().getEquippedSlots();
};

/**
 * Gets all skill slots that have skills that are upgradable.
 * @returns {JABS_SkillSlot[]}
 */
Game_Actor.prototype.getUpgradableSkillSlots = function()
{
  // a filtering function for whether or not a skill slot is upgradable.
  const filtering = skillSlot =>
  {
    // if the slot is not autoclearable, then it isn't upgradable.
    if (!skillSlot.canBeAutocleared()) return false;

    // if the slot is locked, then it isn't upgradable.
    if (skillSlot.isLocked()) return false;

    // the slot is upgradable!
    return true;
  };

  // determine the slots that are valid and upgradable.
  const upgradableSkillSlots = this.getValidEquippedSkillSlots()
    .filter(filtering, this);

  // return our valid upgradable slots.
  return upgradableSkillSlots;
};
//endregion JABS skill slot access

//region leveling
/**
 * OVERWRITE Replaces the levelup display on the map to not display a message.
 */
Game_Actor.prototype.shouldDisplayLevelUp = function()
{
  return false;
};

/**
 * Executes the JABS level up process.
 */
J.ABS.Aliased.Game_Actor.set('onLevelUp', Game_Actor.prototype.onLevelUp);
Game_Actor.prototype.onLevelUp = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Actor.get('onLevelUp').call(this);

  // perform JABS-related things for leveling up.
  this.jabsLevelUp();
};

/**
 * Do JABS-related things for leveling up.
 */
Game_Actor.prototype.jabsLevelUp = function()
{
  // refresh the sprite if they need it.
  $jabsEngine.requestSpriteRefresh = true;

  // command the JABS engine to do the JABS-related things for leveling up.
  $jabsEngine.battlerLevelup(this.getUuid());
};

/**
 * Extends {@link #onLevelDown}.
 * Also refresh sprites' danger indicator.
 */
J.ABS.Aliased.Game_Actor.set('onLevelDown', Game_Actor.prototype.onLevelDown);
Game_Actor.prototype.onLevelDown = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Actor.get('onLevelDown').call(this);

  // perform JABS-related things for leveling down.
  this.jabsLevelDown();
};

/**
 * Do JABS-related things for leveling down.
 */
Game_Actor.prototype.jabsLevelDown = function()
{
  // if this isn't the leader, then don't worry about leveling down.
  if (!this.isLeader()) return;

  // this is the leader so refresh the battler sprite!
  $jabsEngine.requestSpriteRefresh = true;
};
//endregion leveling

//region learning
/**
 * A hook for performing actions when a battler learns a new skill.
 * @param {number} skillId The skill id of the skill learned.
 */
J.ABS.Aliased.Game_Actor.set('onLearnNewSkill', Game_Actor.prototype.onLearnNewSkill);
Game_Actor.prototype.onLearnNewSkill = function(skillId)
{
  // perform original logic.
  J.ABS.Aliased.Game_Actor.get('onLearnNewSkill').call(this, skillId);

  // perform JABS-related things for learning a new skill.
  this.jabsLearnNewSkill(skillId);
};

/**
 * Do JABS-related things for leveling down.
 * @param {number} skillId The skill id being learned.
 */
Game_Actor.prototype.jabsLearnNewSkill = function(skillId)
{
  // if the skill id is invalid, do not do JABS things.
  if (!skillId) return;

  // show the popup for the skill learned on the battler.
  $jabsEngine.battlerSkillLearn(this.skill(skillId), this.getUuid());

  // upgrade the skill if permissable.
  this.jabsProcessLearnedSkill(skillId);
};

/**
 * Performs various JABS-related logic upon learning the given skill.
 * @param {number} skillId The id of the skill being learnt.
 */
Game_Actor.prototype.jabsProcessLearnedSkill = function(skillId)
{
  // upgrade the skill if permissable.
  this.upgradeSkillIfUpgraded(skillId);

  // autoassign skills if necessary.
  this.autoAssignSkillsIfRequired(skillId);

  // do nothing if we don't have a slot manager to work with.
  if (!this.getSkillSlotManager()) return;

  // flag skills on the skillslot manager for refreshing.
  this.getSkillSlotManager().flagAllSkillSlotsForRefresh();
};

/**
 * If a skill that was upgraded is equipped currently, upgrade it.
 * "Upgrading" a skill is defined as "has the yanfly tag for hiding if another
 * skill id happens to be learned", in which case it'll replace that slot.
 * @param {number} skillId The skill id to upgrade.
 */
Game_Actor.prototype.upgradeSkillIfUpgraded = function(skillId)
{
  // grab all the upgradable skill slots.
  const upgradableSkillsSlots = this.getUpgradableSkillSlots();

  //
  if (!upgradableSkillsSlots)
  {
    return;
  }

  upgradableSkillsSlots.forEach(skillSlot =>
  {
    const skillData = this.skill(skillSlot.id);
    const upgradeSkillId = parseInt(skillData.meta["Hide if learned Skill"]);
    if (upgradeSkillId === skillId)
    {
      this.setEquippedSkill(skillSlot.key, skillId);
    }
  }, this);
};

/**
 * Gets whether or not there are notes that indicate skills should be autoassigned
 * when leveling up.
 * @returns {boolean}
 */
Game_Actor.prototype.autoAssignOnLevelup = function()
{
  const objectsToCheck = this.getAllNotes();
  const structure = /<autoAssignSkills>/i;
  let autoAssign = false;
  objectsToCheck.forEach(obj =>
  {
    const notedata = obj.note.split(/[\r\n]+/);
    notedata.forEach(line =>
    {
      if (line.match(structure))
      {
        autoAssign = true;
      }
    });
  });

  return autoAssign;
};

/**
 * Attempts to assign the given skillId into the first unassigned combat skill slot.
 *
 * If all slots are full, no action is taken.
 * @param {number} skillId The skillId to auto-assign to a slot.
 */
Game_Actor.prototype.autoAssignSkillsIfRequired = function(skillId)
{
  // if we are not auto-assigning, then do not.
  if (!this.autoAssignOnLevelup()) return;

  // grab all the empty combat skill slots.
  const emptySlots = this.getEmptySecondarySkills();

  // if we have no additional empty slots, then do not auto-assign.
  if (emptySlots.length === 0) return;

  // extract the key of the empty slot to be assigned.
  const { key } = emptySlots.at(0).key;

  // assign the given skill to the slot.
  this.setEquippedSkill(key, skillId);
};

/**
 * Refreshes all auto-equippable skills available to this battler.
 */
Game_Actor.prototype.refreshAutoEquippedSkills = function()
{
  // iterate over each of the skills and auto-assign/equip them where applicable.
  this.skills().forEach(this.jabsProcessLearnedSkill, this);
};
//endregion learning

//region JABS bonus hits
/**
 * Gets all collections of sources that will be scanned for bonus hits.
 *
 * For actors, this includes:
 *   - All applied states
 *   - The actor's own data
 *   - All of the actor's equips
 *   - The actor's applied class
 * @returns {RPG_BaseItem[][]}
 */
Game_Actor.prototype.getBonusHitsSources = function()
{
  return [
    // states may contain bonus hits.
    this.states(),

    // the actor itself may contain bonus hits.
    [this.databaseData()],

    // the equipment may contain bonus hits.
    this.equips(),

    // the class may contain bonus hits.
    [this.currentClass()],
  ];
};
//endregion JABS bonus hits

//region map effects
/**
 * Replaces the map damage with JABS' version of the map damage.
 */
J.ABS.Aliased.Game_Actor.set('performMapDamage', Game_Actor.prototype.performMapDamage);
Game_Actor.prototype.performMapDamage = function()
{
  // check if JABS is disabled.
  if (!$jabsEngine.absEnabled)
  {
    // perform original logic.
    J.ABS.Aliased.Game_Actor.get('performMapDamage').call(this);
  }
  // JABS is definitely enabled.
  else
  {
    // let JABS handle it.
    this.performJabsFloorDamage();
  }
};

/**
 * Handles how an actor is treated when they are taking floor damage on the map.
 */
Game_Actor.prototype.performJabsFloorDamage = function()
{
  // just flash the screen, the damage is applied by other means.
  $gameScreen.startFlashForDamage();
};

/**
 * Disable built-in on-turn-end effects while JABS is active.
 * (built-in effects include regeneration and poison, but those are
 * already handled elsewhere in the engine)
 */
J.ABS.Aliased.Game_Actor.set('turnEndOnMap', Game_Actor.prototype.turnEndOnMap);
Game_Actor.prototype.turnEndOnMap = function()
{
  // if JABS is enabled, the fun never stops!
  if (!$jabsEngine.absEnabled) return;

  // do normal turn-end things while JABS is disabled.
  J.ABS.Aliased.Game_Actor.get('turnEndOnMap').call(this);
};
//endregion map effects
//endregion Game_Actor