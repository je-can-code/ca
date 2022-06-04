/*:
 * @target MZ
 * @plugindesc 
 * [v3.0 JABS] Mods/Adds for the various game object classes.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-ABS
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * A component of JABS.
 * This is a cluster of all changes/overwrites/additions to the objects that
 * would otherwise be found in the rmmz_objects.js, such as Game_Map. This also
 * contains updates to the new wrapper objects, such as RPG_Skill.
 * ============================================================================
 */

//#region Game objects
//#region Game_Actor
/**
 * Adds in the jabs tracking object for equipped skills.
 */
J.ABS.Aliased.Game_Actor.set('initMembers', Game_Actor.prototype.initMembers);
Game_Actor.prototype.initMembers = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Actor.get('initMembers').call(this);

  /**
   * The master reference to the `_j` object containing all plugin properties.
   * @type {{}}
   */
  this._j ||= {};

  /**
   * The master reference to all JABS-related added properties on this class.
   * @type {{}}
   */
  this._j._abs ||= {};

  /**
   * The total speed boosts currently applied to this actor.
   * @type {number}
   */
  this._j._abs._speedBoosts = 0;

  /**
   * The number of bonus hits this actor currently has.
   * @type {number}
   */
  this._j._abs._bonusHits = 0;

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
 * Gets the prepare time for this actor.
 * Actors are not gated by prepare times, only by post-action cooldowns.
 * @returns {number}
 */
Game_Actor.prototype.prepareTime = function()
{
  return 1;
};

/**
 * Gets the skill id for this actor.
 * Actors don't use this functionality, they have equipped skills instead.
 * @returns {null}
 */
Game_Actor.prototype.skillId = function()
{
  return null;
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
  return new JABS_BattlerAI(true, true);
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
 * Gets all skills that are executed when this actor defeats a target.
 * @returns {JABS_OnChanceEffect[]}
 */
Game_Actor.prototype.onTargetDefeatSkillIds = function()
{
  const objectsToCheck = this.getCurrentWithNotes();
  const structure = /<onTargetDefeat:[ ]?(\[\d+,[ ]?\d+])>/i;
  const skills = [];
  objectsToCheck.forEach(obj =>
  {
    const innerSkills = J.BASE.Helpers.parseSkillChance(structure, obj);
    skills.push(...innerSkills);
  });

  return skills;
};

/**
 * Gets all skills that are executed when this actor is defeated.
 * @returns {JABS_OnChanceEffect[]}
 */
Game_Actor.prototype.onOwnDefeatSkillIds = function()
{
  const objectsToCheck = this.getCurrentWithNotes();
  const structure = /<onOwnDefeat:[ ]?(\[\d+,[ ]?\d+])>/i;
  const skills = [];
  objectsToCheck.forEach(obj =>
  {
    const innerSkills = J.BASE.Helpers.parseSkillChance(structure, obj);
    skills.push(...innerSkills);
  });

  return skills;
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

/**
 * Actors have fixed `uuid`s, and thus it can be calculated as-is.
 * @returns {string}
 */
Game_Actor.prototype.getUuid = function()
{
  if (this.actor())
  {
    return `actor-${this.actorId()}`;
  }

  console.warn("no uuid currently available.");
  return "";
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
  const jabsBattler = $gameMap.getBattlerByUuid(this.getUuid());

  // validate the existance of the battler before using.
  if (!jabsBattler) return;

  // turn off the dying effect.
  jabsBattler.setDying(false);
};

/**
 * Initializes the JABS equipped skills based on equipment.
 */
Game_Actor.prototype.initAbsSkills = function()
{
  this.refreshEquipmentSkills();
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
 * Gets all skills that are executed by this battler when it is defeated.
 * @returns {JABS_OnChanceEffect}
 */
Game_Battler.prototype.onOwnDefeatSkillIds = function()
{
  return [];
};

/**
 * Retrieves all skills that are currently equipped on this actor.
 * @returns {JABS_SkillSlot[]}
 */
Game_Battler.prototype.getAllEquippedSkills = function()
{
  return this._j._equippedSkills.getAllSlots();
};

/**
 * Gets all skill slots identified as "primary".
 * @returns {JABS_SkillSlot[]}
 */
Game_Actor.prototype.getAllPrimarySkills = function()
{
  return this._j._equippedSkills.getAllPrimarySlots();
};

/**
 * Gets all skill slots identified as "secondary".
 * @returns {JABS_SkillSlot[]}
 */
Game_Actor.prototype.getAllSecondarySkills = function()
{
  return this._j._equippedSkills.getAllSecondarySlots();
};

/**
 * Gets the skill dedicated to the tool slot.
 * @returns {JABS_SkillSlot}
 */
Game_Actor.prototype.getToolSkill = function()
{
  return this._j._equippedSkills.getToolSlot();
};

/**
 * Gets the skill dedicated to the dodge slot.
 * @returns {JABS_SkillSlot}
 */
Game_Actor.prototype.getDodgeSkill = function()
{
  return this._j._equippedSkills.getDodgeSlot();
};

/**
 * Gets all skill slots that have skills assigned to them.
 * @returns {JABS_SkillSlot[]}
 */
Game_Actor.prototype.getValidEquippedSkillSlots = function()
{
  return this._j._equippedSkills.getEquippedSlots();
};

/**
 * Gets all skill slots that have skills assigned to them- excluding the tool slot.
 * @returns {JABS_SkillSlot[]}
 */
Game_Actor.prototype.getValidSkillSlotsForAlly = function()
{
  return this._j._equippedSkills.getEquippedAllySlots();
};

/**
 * Gets all skill slots that have skills that are upgradable.
 * @returns {JABS_SkillSlot[]}
 */
Game_Actor.prototype.getUpgradableSkillSlots = function()
{
  return this
    .getValidEquippedSkillSlots()
    .filter(skillSlot =>
    {
      if (!skillSlot.canBeAutocleared())
      {
        // skip the main/off/tool slots.
        return false;
      }

      if (skillSlot.isLocked())
      {
        // skip locked slots.
        return false;
      }

      const skillData = this.skill(skillSlot.id);
      if (!skillData.meta || !skillData.meta["Hide if learned Skill"])
      {
        // skip skills that don't "upgrade" per yanfly's plugin.
        return false;
      }

      return true;
    });
};

/**
 * Gets the key to the slot that the provided skill id lives within.
 * @param {number} skillIdToFind The skill id to find amidst all equipped skills.
 * @returns {JABS_SkillSlot}
 */
Game_Battler.prototype.findSlotForSkillId = function(skillIdToFind)
{
  return this._j._equippedSkills.getSlotBySkillId(skillIdToFind);
};

/**
 * Gets the currently-equipped skill id in the specified slot.
 * @param {string} slot The slot to retrieve an equipped skill for.
 * @returns {number}
 */
Game_Actor.prototype.getEquippedSkill = function(slot)
{
  return this.getSkillSlot(slot).id;
};

/**
 * Gets the slot associated with a key.
 * @param {string} slot The slot to retrieve a slot for.
 * @returns {JABS_SkillSlot}
 */
Game_Actor.prototype.getSkillSlot = function(slot)
{
  return this._j._equippedSkills.getSkillBySlot(slot);
};

/**
 * Gets all secondary slots that are unassigned.
 * @returns {JABS_SkillSlot[]}
 */
Game_Actor.prototype.getEmptySecondarySkills = function()
{
  return this._j._equippedSkills.getEmptySecondarySlots();
};

/**
 * Sets the skill id to the specified slot with an option to lock the skill into the slot.
 * @param {string} slot The slot to retrieve an equipped skill for.
 * @param {number} skillId The skill id to assign to the specified slot.
 * @param {boolean} locked Whether or not the skill is locked onto this slot.
 */
Game_Actor.prototype.setEquippedSkill = function(slot, skillId, locked = false)
{
  // check if we need to actually update the slot.
  if (this.needsSlotUpdate(slot, skillId, locked))
  {
    // update the slot.
    this._j._equippedSkills.setSlot(slot, skillId, locked);

    // check if we're using the hud's input frame.
    if (J.HUD && J.HUD.EXT_INPUT)
    {
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
Game_Actor.prototype.needsSlotUpdate = function(slot, skillId, locked)
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
Game_Actor.prototype.isSlotLocked = function(slot)
{
  return this._j._equippedSkills
    .getSkillBySlot(slot)
    .isLocked();
};

/**
 * Unlocks a slot that was forcefully assigned.
 * @param {string} slot The slot to unlock.
 */
Game_Actor.prototype.unlockSlot = function(slot)
{
  this._j._equippedSkills
    .getSkillBySlot(slot)
    .unlock();
};

/**
 * Unlocks all slots that were forcefully assigned.
 */
Game_Actor.prototype.unlockAllSlots = function()
{
  this._j._equippedSkills.unlockAllSlots();
};

/**
 * Refreshes the JABS skills that are currently equipped.
 * If any are no longer valid, they will be removed.
 */
Game_Actor.prototype.refreshEquipmentSkills = function()
{
  // remove all unequippable skills from their slots.
  this.releaseUnequippableSkills();

  // update the mainhand skill slot.
  this.updateMainhandSkill();

  // update the offhand skill slot.
  this.updateOffhandSkill();
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
 * Updates the mainhand skill slot with the most up-to-date value.
 */
Game_Actor.prototype.updateMainhandSkill = function()
{
  // determine the current main and offhand skills.
  const mainhandSkill = this.getMainhandSkill();

  // update the main and offhand skill slots.
  this.setEquippedSkill(JABS_Button.Main, mainhandSkill);
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
Game_Actor.prototype.releaseUnequippableSkills = function()
{
  this._j._equippedSkills
    .getAllSlots()
    .forEach(skillSlot =>
    {
      if (!this.hasSkill(skillSlot.id))
      {
        skillSlot.autoclear();
      }
    });
};

/**
 * Extends {@link #onBattlerDataChange}.
 * Adds a hook for performing actions when a state is removed from the battler.
 */
J.ABS.Aliased.Game_Actor.set('onBattlerDataChange', Game_Actor.prototype.onBattlerDataChange);
Game_Actor.prototype.onBattlerDataChange = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Actor.get('onBattlerDataChange').call(this);

  // update JABS-related things.
  this.jabsRefresh();
};

/**
 * Refreshes aspects associated with this battler in the context of JABS.
 */
Game_Actor.prototype.jabsRefresh = function()
{
  // refresh the currently equipped skills to ensure they are still valid.
  this.refreshEquipmentSkills();

  // refresh the speed boosts to ensure they are still accurate.
  this.refreshSpeedBoosts();

  // refresh the bonus hits to ensure they are still accurate.
  this.refreshBonusHits();
};

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
  this.upgradeSkillIfUpgraded(skillId);

  // autoassign skills if necessary.
  this.autoAssignSkillsIfRequired(skillId);

  // flag skills on the skillslot manager for refreshing.
  this.getSkillSlotManager().flagAllSkillSlotsForRefresh();
};

/**
 * If a skill that was upgraded is equipped currently, upgrade it.
 * @param {number} skillId The skill id to upgrade.
 */
Game_Actor.prototype.upgradeSkillIfUpgraded = function(skillId)
{
  const upgradableSkillsSlots = this.getUpgradableSkillSlots();
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
 * If the actor has a tag/note somewhere for auto-assignment, then this will
 * attempt to automatically slot the learned skill into an otherwise empty
 * skill slot.
 *
 * This will only attempt to assign skills to one of the 8 secondary slots.
 *
 * If all slots are full, no action is taken.
 * @param {number} skillId The skill id to auto-assign to a slot.
 */
Game_Actor.prototype.autoAssignSkillsIfRequired = function(skillId)
{
  if (this.autoAssignOnLevelup())
  {
    const emptySlots = this.getEmptySecondarySkills();
    if (!emptySlots.length)
    {
      return;
    }

    const slotKey = emptySlots[0].key;
    this.setEquippedSkill(slotKey, skillId);
  }
};

/**
 * Updates the speed boost scale for this actor based on equipment.
 */
Game_Actor.prototype.refreshSpeedBoosts = function()
{
  // default to 0 of speed boost.
  let speedBoosts = 0;

  // iterate over all equips.
  this.equips().forEach(equip =>
  {
    // if the equip is invalid, don't process.
    if (!equip) return;

    // check to make sure there is a speed boost before adding.
    if (equip.jabsSpeedBoost)
    {
      // add the speed boost.
      speedBoosts += equip.jabsSpeedBoost;
    }
  });

  // iterate over all states.
  this.states().forEach(state =>
  {
    // check to make sure there is a speed boost before adding.
    if (state.jabsSpeedBoost)
    {
      // add the speed boost.
      speedBoosts += state.jabsSpeedBoost;
    }
  });

  this._j._abs._speedBoosts = speedBoosts;
};

/**
 * Gets the current speed boost scale for this actor.
 * @returns {number}
 */
Game_Actor.prototype.getSpeedBoosts = function()
{
  return this._j._abs._speedBoosts;
};

/**
 * Updates the bonus hit count for this actor based on equipment.
 *
 * NOTE:
 * This is explicitly not using `this.getAllNotes()` so that we can
 * also parse out the repeats from all the relevant sources as well.
 */
Game_Actor.prototype.refreshBonusHits = function()
{
  // default to zero bonus hits.
  let bonusHits = 0;

  // iterate over all equips.
  bonusHits += this.getBonusHitsFromTraitedSources(this.equips());

  // iterate over all states.
  bonusHits += this.getBonusHitsFromTraitedSources(this.states());

  // add your own actor data as a source.
  bonusHits += this.getBonusHitsFromTraitedSources([this.actor()]);

  // add your own class data as a source.
  bonusHits += this.getBonusHitsFromTraitedSources([this.currentClass()]);

  // iterate over all skills learned; concept as "passive skills", not bonus hits per skill.
  bonusHits += this.getBonusHitsFromNonTraitedSources(this.skills());

  // set the bonus hits to the total amount found everywhere.
  this._j._abs._bonusHits = bonusHits;
};

/**
 * Gets the current number of bonus hits for this actor.
 * @returns {number}
 */
Game_Actor.prototype.getBonusHits = function()
{
  return this._j._abs._bonusHits;
};

/**
 * Determines the various state duration boosts available to this actor.
 * @param {number} baseDuration The base duration of the state.
 * @param {Game_Battler} attacker The attacker- for use with formulai.
 * @returns {number}
 */
Game_Actor.prototype.getStateDurationBoost = function(baseDuration, attacker)
{
  // initialize the running tally.
  let durationBoost = 0;

  // grab all the things to check.
  const objectsToCheck = this.getAllNotes();

  // iterate over each of the things to check.
  objectsToCheck.forEach(obj =>
  {
    // add the flat boosts.
    durationBoost += this.getStateDurationFlatPlus(obj);

    // add the percent boosts, using the base duration.
    durationBoost += this.getStateDurationPercPlus(obj, baseDuration);

    // add the formula-driven boosts, using the base duration and the attacker.
    durationBoost += this.getStateDurationFormulaPlus(obj, baseDuration, attacker);
  });

  // reduce to 2 decimal places.
  const fixedDurationBoost = parseFloat(durationBoost.toFixed(2));

  // return our calculated state duration boosts.
  return fixedDurationBoost;
};

/**
 * Gets the combined amount of flat state duration boosts from all sources.
 * @param {RPG_BaseItem} noteObject The database object.
 * @returns {number}
 */
Game_Actor.prototype.getStateDurationFlatPlus = function(noteObject)
{
  // determine the structure.
  const structure = J.ABS.RegExp.StateDurationFlatPlus;

  // extract the amount from the object.
  const flatDurationBoost = noteObject.getNumberFromNotesByRegex(structure);

  // return was found.
  return flatDurationBoost;
};

/**
 * Gets the combined amount of percent-based state duration boosts from all sources.
 * @param {RPG_BaseItem} noteObject The database object.
 * @param {number} baseDuration The base duration of the state.
 * @returns {number}
 */
Game_Actor.prototype.getStateDurationPercPlus = function(noteObject, baseDuration)
{
  // determine the structure.
  const structure = J.ABS.RegExp.StateDurationPercentPlus;

  // extract the amount from the object.
  const percDurationBoost = noteObject.getNumberFromNotesByRegex(structure);

  // perform the calculation.
  const calculatedBoost = Math.round(baseDuration * (percDurationBoost / 100));

  // return the calculated amount.
  return calculatedBoost;
};

/**
 * Gets the combined amount of formula-based state duration boosts from all sources.
 * @param {RPG_BaseItem} noteObject The database object.
 * @param {number} baseDuration The base duration of the state.
 * @param {Game_Actor|Game_Enemy} attacker The attacker applying the state.
 * @returns {number}
 */
Game_Actor.prototype.getStateDurationFormulaPlus = function(noteObject, baseDuration, attacker)
{
  // determine the structure.
  const structure = J.ABS.RegExp.StateDurationFormulaPlus;

  // get the note data from this skill.
  const lines = noteObject.getFilteredNotesByRegex(structure);

  // if we have no matching notes, then short circuit.
  if (!lines.length)
  {
    // return null or 0 depending on provided options.
    return 0;
  }

  // initialize the base boost.
  let formulaDurationBoost = 0;

  // establish some variables for eval scope access.
  const a = this;  // the one who applied the state.
  const b = attacker; // this battler, afflicted by the state.
  const v = $gameVariables._data; // access to variables if you need it.
  const d = baseDuration;

  // iterate over each valid line of the note.
  lines.forEach(line =>
  {
    // extract the captured formula.
    // eslint-disable-next-line prefer-destructuring
    const result = structure.exec(line)[1];

    // regular parse it and add it to the running total.
    formulaDurationBoost += JSON.parse(eval(result));
  });

  // return our evaluated amounts.
  return formulaDurationBoost;
};
//#endregion Game_Actor

//#region Game_Action
/**
 * OVERWRITE In the context of this `Game_Action`, for non-allies, it should
 * instead return the $dataEnemies data instead of the $gameTroop data because
 * the troop doesn't exist on the map.
 */
Game_Action.prototype.subject = function()
{
  let subject;
  if (this._subjectActorId > 0)
  {
    subject = $gameActors.actor(this._subjectActorId)
  }
  else
  {
    subject = $gameEnemies.enemy(this._subjectEnemyIndex);
  }
  return subject;
};

/**
 * OVERWRITE In the context of this `Game_Action`, overwrites the function for
 * setting the subject to reference the $dataEnemies, a new global object reference
 * for the database tab of enemies instead of referencing the troop.
 * @param {Game_Actor|Game_Enemy} subject The subject to work with.
 */
Game_Action.prototype.setSubject = function(subject)
{
  if (subject.isActor())
  {
    this._subjectActorId = subject.actorId();
    this._subjectEnemyIndex = -1;
  }
  else if (subject.isEnemy())
  {
    this._subjectEnemyIndex = subject.enemyId();
    this._subjectActorId = 0;
  }
};

/**
 * Gets the parry rate for a given battler.
 * @param {Game_Battler} target The target to check the parry rate for.
 */
Game_Action.prototype.itemPar = function(target)
{
  return (target.grd - 1).toFixed(3);
};

/**
 * Rounds the result of the damage calculations when executing skills.
 */
J.ABS.Aliased.Game_Action.makeDamageValue = Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue = function(target, critical)
{
  let base = J.ABS.Aliased.Game_Action.makeDamageValue.call(this, target, critical);

  const player = $jabsEngine.getPlayer1();
  const isPlayer = player.getBattler() === target;
  if (isPlayer)
  {
    // currently, only the player can properly defend like this.
    base = this.handleGuardEffects(base, player);
  }

  return base;
};

/**
 * OVERWRITE Rewrites the handling of applying states to targets.
 *
 * Passes the attacker as another data point to the application of state.
 * @param {Game_Battler} target The target.
 * @param {rm.types.Effect} effect The potential effect to add.
 */
Game_Action.prototype.itemEffectAddAttackState = function(target, effect)
{
  for (const stateId of this.subject()
    .attackStates())
  {
    let chance = effect.value1;
    chance *= target.stateRate(stateId);
    chance *= this.subject()
      .attackStatesRate(stateId);
    chance *= this.lukEffectRate(target);
    if (Math.random() < chance)
    {
      target.addState(stateId, this.subject());
      this.makeSuccess(target);
    }
  }
};

/**
 * OVERWRITE Rewrites the handling of applying states to targets.
 *
 * Passes the attacker as another data point to the application of state.
 * @param {Game_Battler} target The target.
 * @param {rm.types.Effect} effect The potential effect to add.
 */
Game_Action.prototype.itemEffectAddNormalState = function(target, effect)
{
  let chance = effect.value1;
  if (!this.isCertainHit())
  {
    chance *= target.stateRate(effect.dataId);
    chance *= this.lukEffectRate(target);
  }
  if (Math.random() < chance)
  {
    target.addState(effect.dataId, this.subject());
    this.makeSuccess(target);
  }
};

/**
 * Intercepts the action result and prevents adding states entirely if precise-parried
 * by the player.
 */
J.ABS.Aliased.Game_Action.itemEffectAddState = Game_Action.prototype.itemEffectAddState;
Game_Action.prototype.itemEffectAddState = function(target, effect)
{
  const player = $jabsEngine.getPlayer1();
  const isPlayer = player.getBattler() === target;
  if (isPlayer)
  {
    // if it is the player, peek at the result before applying.
    const result = player.getBattler()
      .result();
    if (result.preciseParried)
    {
      // if the player precise-parried the action, no status effects applied.
      return;
    }
  }

  // if the precise-parry-state-prevention wasn't successful, apply as usual.
  J.ABS.Aliased.Game_Action.itemEffectAddState.call(this, target, effect);
};

/**
 * Reduces
 * @param {number} damage The amount of damage before damage reductions.
 * @param {JABS_Battler} player The player's `JABS_Battler`.
 * @returns {number} The amount of damage after damage reductions from guarding.
 */
Game_Action.prototype.handleGuardEffects = function(damage, player)
{
  // if the player is parrying...
  if (player.parrying())
  {
    const playerBattler = player.getBattler();
    const result = playerBattler.result();

    // nullify the result via parry.
    result.parried = true;
    result.preciseParried = true;
    damage = 0;
    player.getCharacter()
      .requestAnimation(0, true, true);

    // handle tp generation from precise-parrying.
    const skillId = player.getGuardSkillId();
    if (skillId)
    {
      const skill = OverlayManager.getExtendedSkill(playerBattler, skillId);
      playerBattler.gainTp(skill.tpGain);
    }

    // reset the player's guarding.
    player.setParryWindow(0);
    player.setGuardSkillId(0);
  }

  // if the player is guarding...
  else if (player.guarding())
  {
    // reduce the damage accordingly per the guard data.
    damage = this.percDamageReduction(damage, player);
    damage = this.flatDamageReduction(damage, player);
  }

  return damage;
};

/**
 * Reduces damage of a value if defending- by a flat amount.
 * @param {number} base The base damage value to modify.
 * @param {JABS_Battler} player The player's JABS battler.
 */
Game_Action.prototype.flatDamageReduction = function(base, player)
{
  const reduction = parseFloat(player.flatGuardReduction());
  const result = player.getBattler()
    .result();
  result.reduced += reduction;
  base = Math.max((base + reduction), 0);
  return base;
};

/**
 * Reduces damage of a value if defending- by a percent amount.
 * @param {number} base The base damage value to modify.
 * @param {JABS_Battler} player The player's JABS battler.
 */
Game_Action.prototype.percDamageReduction = function(base, player)
{
  const reduction = parseFloat(base - ((100 + player.percGuardReduction()) / 100) * base);
  const result = player.getBattler()
    .result();
  result.reduced -= reduction;
  base = Math.max((base - reduction), 0);
  return base;
};

/**
 * OVERWRITE Replaces the hitrate formula with a standardized one that
 * makes it so the default is NOT to miss with half of your swings just
 * because you don't have +100% hit rate on every single skill.
 * @returns {number}
 */
Game_Action.prototype.itemHit = function()
{
  return (this.item().successRate * 0.01 * (this.subject().hit));
};

/**
 * OVERWRITE Alters this functionality to be determined by attacker's hit vs target's evade.
 * @param {Game_Battler} target The target of this action.
 * @returns {number}
 */
Game_Action.prototype.itemEva = function(target)
{
  switch (true)
  {
    case (this.isPhysical()):
      return target.eva;
    case (this.isMagical()):
      return target.mev;
    default:
      return 0;
  }
};

/**
 * OVERWRITE Adjusts how a skill is applied against the target in the context of JABS.
 */
J.ABS.Aliased.Game_Action.apply = Game_Action.prototype.apply;
Game_Action.prototype.apply = function(target)
{
  if ($jabsEngine._absEnabled)
  {
    this.applySkill(target);
  }
  else
  {
    J.ABS.Aliased.Game_Action.apply.call(this, target);
  }
};

/**
 * Applies a skill against the target.
 * This is effectively Game_Action.apply, but with some adjustments to accommodate
 * the fact that we're using this in an action battle system instead.
 *
 * "Missed" is no longer a possibility. It is false 100% of the time.
 * @param {Game_Battler} target The target the skill is being applied to.
 */
Game_Action.prototype.applySkill = function(target)
{
  const result = target.result();
  this.subject().clearResult();
  result.clear();
  result.used = this.testApply(target);
  result.evaded = !this.calculateHitSuccess(target);
  result.physical = this.isPhysical();
  result.drain = this.isDrain();
  if (result.isHit())
  {
    if (this.item().damage.type > 0)
    {
      result.critical = Math.random() < this.itemCri(target);
      const value = this.makeDamageValue(target, result.critical);
      this.executeDamage(target, value);
    }

    // add the subject who is applying the state as a parameter for tracking purposes.
    this.item().effects.forEach(effect => this.applyItemEffect(target, effect));
    this.applyItemUserEffect(target);
  }

  // also update the last target hit.
  this.updateLastTarget(target);
};

/**
 * Calculates whether or not the attacker was precise enough to land the hit.
 * If this returns false, the result is that the skill was evaded.
 * @param {Game_Battler} target The target the skill is being applied to.
 * @returns {boolean}
 */
Game_Action.prototype.calculateHitSuccess = function(target)
{
  const hitRate = Math.random() + this.itemHit();
  const evadeRate = this.itemEva(target);
  const success = (hitRate - evadeRate) > 0;
  return success;
};
//#endregion Game_Action

//#region Game_ActionResult
/**
 * Injects additional possible results into all `Game_ActionResult`s.
 */
J.ABS.Aliased.Game_ActionResult.initialize = Game_ActionResult.prototype.initialize;
Game_ActionResult.prototype.initialize = function()
{
  this.parried = false;
  this.preciseParried = false;
  this.reduced = 0;
  J.ABS.Aliased.Game_ActionResult.initialize.call(this);
};

/**
 * Extends `.clear()` to include wiping the custom properties.
 */
J.ABS.Aliased.Game_ActionResult.clear = Game_ActionResult.prototype.clear;
Game_ActionResult.prototype.clear = function()
{
  J.ABS.Aliased.Game_ActionResult.clear.call(this);
  this.parried = false;
  this.preciseParried = false;
  this.reduced = 0;
};

/**
 * OVERWRITE Removes the check for "hit vs rng", and adds in parry instead.
 */
Game_ActionResult.prototype.isHit = function()
{
  return this.used && !this.parried && !this.evaded && !this.preciseParried;
};
//#endregion Game_ActionResult

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
  return 1;
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
 * All battlers have a default of no retaliation skills.
 * @returns {JABS_OnChanceEffect[]}
 */
Game_Battler.prototype.retaliationSkills = function()
{
  return [];
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
  this._j._equippedSkills ||= new JABS_SkillSlotManager(this);
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
 * @param {RPG_TraitItem[]|RPG_BaseBattler[]|RPG_Class[]} sources The collection to iterate over.
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
 * Gets the current speed boost scale for this actor.
 * At the Game_Battler level will always return 0.
 * @returns {number}
 */
Game_Battler.prototype.getSpeedBoosts = function()
{
  return 0;
};

/**
 * Gets the currently-equipped skill id in the specified slot.
 * At the Game_Battler level will always return 0.
 * @returns {number}
 */
Game_Battler.prototype.getEquippedSkill = function(slot)
{
  return 0;
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
//#endregion Game_Battler

//#region Game_Character
/**
 * Hooks into the `Game_Character.initMembers` and adds in action sprite properties.
 */
J.ABS.Aliased.Game_Character.initMembers = Game_Character.prototype.initMembers;
Game_Character.prototype.initMembers = function()
{
  this._j = this._j || {};
  J.ABS.Aliased.Game_Character.initMembers.call(this);
  this.initActionSpriteProperties();
  this.initLootSpriteProperties();
};

/**
 * Initializes the action sprite properties for this character.
 */
Game_Character.prototype.initActionSpriteProperties = function()
{
  this._j._action = {
    actionData: null,
    needsAdding: false,
    needsRemoving: false,
    battlerUuid: String.empty,
  }
};

/**
 * Initializes the loot sprite properties.
 */
Game_Character.prototype.initLootSpriteProperties = function()
{
  this._j._loot = {
    _needsAdding: false,
    _needsRemoving: false,
    _data: null,
  };
};

/**
 * Gets the loot sprite properties for this event.
 * @returns {object}
 */
Game_Character.prototype.getLootSpriteProperties = function()
{
  return this._j._loot;
};

/**
 * Whether or not this character is/has loot.
 */
Game_Character.prototype.isLoot = function()
{
  return !!this.getLootData();
};

/**
 * Gets whether or not this loot needs rendering onto the map.
 * @returns {boolean} True if needing rendering, false otherwise.
 */
Game_Character.prototype.getLootNeedsAdding = function()
{
  const loot = this.getLootSpriteProperties();
  return loot._needsAdding;
};

/**
 * Sets the loot to need rendering onto the map.
 * @param {boolean} needsAdding Whether or not this loot needs adding.
 */
Game_Character.prototype.setLootNeedsAdding = function(needsAdding = true)
{
  const loot = this.getLootSpriteProperties();
  loot._needsAdding = needsAdding;
};

/**
 * Gets whether or not this loot object is flagged for removal.
 */
Game_Character.prototype.getLootNeedsRemoving = function()
{
  const loot = this.getLootSpriteProperties();
  return loot._needsRemoving;
};

/**
 * Sets the loot object to be flagged for removal.
 * @param {boolean} needsRemoving True if we want to remove the loot, false otherwise.
 */
Game_Character.prototype.setLootNeedsRemoving = function(needsRemoving = true)
{
  const loot = this.getLootSpriteProperties();
  loot._needsRemoving = needsRemoving;
};

/**
 * Gets the loot data for this character/event.
 * @returns {JABS_LootDrop}
 */
Game_Character.prototype.getLootData = function()
{
  const loot = this.getLootSpriteProperties();
  return loot._data;
};

/**
 * Gets whether or not this loot data is use-on-pickup or not.
 * @returns {boolean}
 */
Game_Character.prototype.isUseOnPickupLoot = function()
{
  return this.getLootData().useOnPickup;
};

/**
 * Sets the loot data to the provided loot.
 * @param {object} data The loot data to assign to this character/event.
 */
Game_Character.prototype.setLootData = function(data)
{
  const loot = this.getLootSpriteProperties();
  loot._data = data;
};

/**
 * Gets all action sprite properties for this event.
 */
Game_Character.prototype.getActionSpriteProperties = function()
{
  return this._j._action;
};

/**
 * Gets whether or not this character is an action.
 * @returns {boolean} True if this is an action, false otherwise.
 */
Game_Character.prototype.isAction = function()
{
  return !!this.getMapActionData();
};

/**
 * If the event has a `JABS_Action` associated with it, return that.
 * @returns {JABS_Action}
 */
Game_Character.prototype.getMapActionData = function()
{
  const actionSpriteProperties = this.getActionSpriteProperties();
  if (actionSpriteProperties.actionData)
  {
    return actionSpriteProperties.actionData;
  }
  else
  {
    return null;
  }
};

/**
 * Gets whether or not the underlying `JABS_Action` requires removal from the map.
 * @returns {boolean} True if removal is required, false otherwise.
 */
Game_Character.prototype.getJabsActionNeedsRemoving = function()
{
  // if it is not an action, don't remove whatever it is.
  if (!this.isAction()) return false;

  // return whether or not the removal is needed.
  return this.getMapActionData().getNeedsRemoval();
};

/**
 * Gets the `uuid` of this event's underlying action, if it exists.
 * @returns {string}
 */
Game_Character.prototype.getMapActionUuid = function()
{
  const actionData = this.getMapActionData();
  if (actionData)
  {
    return actionData.getUuid();
  }
  else
  {
    return null;
  }
};

/**
 * Gets the `uuid` of this `JABS_Battler`.
 */
Game_Character.prototype.getActionUuid = function()
{
  const jabsAction = this.getMapActionData();
  return jabsAction.getUuid();
};

/**
 * Gets the `JABS_Battler` associated with this character.
 * @returns {JABS_Battler}
 */
Game_Character.prototype.getMapBattler = function()
{
  const uuid = this.getMapBattlerUuid();
  return $gameMap.getBattlerByUuid(uuid);
};

/**
 * Gets the `uuid` of this `JABS_Battler`.
 */
Game_Character.prototype.getMapBattlerUuid = function()
{
  const asp = this.getActionSpriteProperties();
  return asp.battlerUuid;
};

/**
 * Sets the provided `JABS_Battler` to this character.
 * @param {string} uuid The uuid of the `JABS_Battler` to set to this character.
 */
Game_Character.prototype.setMapBattler = function(uuid)
{
  const actionSpriteProperties = this.getActionSpriteProperties();
  actionSpriteProperties.battlerUuid = uuid;
};

Game_Character.prototype.clearMapBattler = function()
{
  const actionSpriteProperties = this.getActionSpriteProperties();
  actionSpriteProperties.battlerUuid = String.empty;
};

/**
 * Gets whether or not this character has a `JABS_Battler` attached to it.
 */
Game_Character.prototype.hasJabsBattler = function()
{
  const asp = this.getActionSpriteProperties();
  const uuid = asp.battlerUuid;
  if (!uuid) return false;

  const battler = $gameMap.getBattlerByUuid(uuid);
  if (!battler) return false;

  return true;
};

/**
 * Gets the `needsAdding` property from the `actionSpriteProperties` for this event.
 */
Game_Character.prototype.getActionSpriteNeedsAdding = function()
{
  const actionSpriteProperties = this.getActionSpriteProperties();
  return actionSpriteProperties.needsAdding;
};

/**
 * Sets the `needsAdding` property from the `actionSpriteProperties` for this event.
 * @param {boolean} addSprite True if you want this event to be added, false otherwise (default: true).
 */
Game_Character.prototype.setActionSpriteNeedsAdding = function(addSprite = true)
{
  const actionSpriteProperties = this.getActionSpriteProperties();
  actionSpriteProperties.needsAdding = addSprite;
};

/**
 * Gets the `needsRemoving` property from the `actionSpriteProperties` for this event.
 */
Game_Character.prototype.getActionSpriteNeedsRemoving = function()
{
  const actionSpriteProperties = this.getActionSpriteProperties();
  return actionSpriteProperties.needsRemoving;
};

/**
 * Sets the `needsRemoving` property from the `actionSpriteProperties` for this event.
 * @param {boolean} removeSprite True if you want this event to be removed, false otherwise (default: true).
 */
Game_Character.prototype.setActionSpriteNeedsRemoving = function(removeSprite = true)
{
  const actionSpriteProperties = this.getActionSpriteProperties();
  return actionSpriteProperties.needsRemoving = removeSprite;
};

/**
 * Execute an animation of a provided id upon this character.
 * @param {number} animationId The animation id to execute on this character.
 * @param {boolean} parried Whether or not the animation being requested was parried.
 * @param {boolean} preciseParried Whether or not the animation being requested was precise-parried.
 */
Game_Character.prototype.requestAnimation = function(animationId, parried = false, preciseParried = false)
{
  if (parried)
  {
    const parryAnimationId = preciseParried ? 132 : 122;
    $gameTemp.requestAnimation([this], parryAnimationId);
  }
  else
  {
    $gameTemp.requestAnimation([this], animationId);
  }
};

J.ABS.Aliased.Game_Character.isMovementSucceeded = Game_Character.prototype.isMovementSucceeded;
Game_Character.prototype.isMovementSucceeded = function()
{
  const battler = this.getMapBattler();
  if (battler && !battler.canBattlerMove())
  {
    return false;
  }
  else
  {
    return J.ABS.Aliased.Game_Character.isMovementSucceeded.call(this);
  }
};

/**
 * Determines if a numeric directional input is diagonal.
 * @param {number} direction The direction to check.
 * @returns {boolean} True if the input is diagonal, false otherwise.
 */
Game_Character.prototype.isDiagonalDirection = function(direction)
{
  return [1, 3, 7, 9].contains(direction);
};

/**
 * Determines if a numeric directional input is straight.
 * @param {number} direction The direction to check.
 * @returns {boolean} True if the input is straight, false otherwise.
 */
Game_Character.prototype.isStraightDirection = function(direction)
{
  return [2, 4, 6, 8].contains(direction);
};

/**
 * Determines the horz/vert directions to move based on a diagonal direction.
 * @param {number} direction The diagonal-only numeric direction to move.
 */
Game_Character.prototype.getDiagonalDirections = function(direction)
{
  switch (direction)
  {
    case 1:
      return [4, 2];
    case 3:
      return [6, 2];
    case 7:
      return [4, 8];
    case 9:
      return [6, 8];
  }
};

/**
 * Intelligently determines the next step to take on a path to the destination `x,y`.
 * @param {number} goalX The `x` coordinate trying to be reached.
 * @param {number} goalY The `y` coordinate trying to be reached.
 */
/* eslint-disable */
Game_Character.prototype.findDiagonalDirectionTo = function(goalX, goalY)
{
  const searchLimit = this.searchLimit();
  const mapWidth = $gameMap.width();
  const nodeList = [];
  const openList = [];
  const closedList = [];
  const start = {};
  let best = start;
  let goaled = false;

  if (this.x === goalX && this.y === goalY)
  {
    return 0;
  }

  start.parent = null;
  start.x = this.x;
  start.y = this.y;
  start.g = 0;
  start.f = $gameMap.distance(start.x, start.y, goalX, goalY);
  nodeList.push(start);
  openList.push(start.y * mapWidth + start.x);

  while (nodeList.length > 0)
  {
    var bestIndex = 0;
    for (var i = 0; i < nodeList.length; i++)
    {
      if (nodeList[i].f < nodeList[bestIndex].f)
      {
        bestIndex = i;
      }
    }

    const current = nodeList[bestIndex];
    const x1 = current.x;
    const y1 = current.y;
    const pos1 = y1 * mapWidth + x1;
    const g1 = current.g;

    nodeList.splice(bestIndex, 1);
    openList.splice(openList.indexOf(pos1), 1);
    closedList.push(pos1);

    if (current.x === goalX && current.y === goalY)
    {
      best = current;
      goaled = true;
      break;
    }

    if (g1 >= searchLimit)
    {
      continue;
    }

    for (var j = 1; j <= 9; j++)
    {
      if (j === 5)
      {
        continue;
      }
      var directions;
      if (this.isDiagonalDirection(j))
      {
        directions = this.getDiagonalDirections(j);
      }
      else
      {
        directions = [j, j];
      }

      const horz = directions[0];
      const vert = directions[1];
      const x2 = $gameMap.roundXWithDirection(x1, horz);
      const y2 = $gameMap.roundYWithDirection(y1, vert);
      const pos2 = y2 * mapWidth + x2;

      if (closedList.contains(pos2))
      {
        continue;
      }

      if (this.isStraightDirection(j))
      {
        if (!this.canPass(x1, y1, j))
        {
          continue;
        }
      }
      else if (this.isDiagonalDirection(j))
      {
        if (!this.canPassDiagonally(x1, y1, horz, vert))
        {
          continue;
        }
      }

      var g2 = g1 + 1;
      var index2 = openList.indexOf(pos2);

      if (index2 < 0 || g2 < nodeList[index2].g)
      {
        var neighbor;
        if (index2 >= 0)
        {
          neighbor = nodeList[index2];
        }
        else
        {
          neighbor = {};
          nodeList.push(neighbor);
          openList.push(pos2);
        }
        neighbor.parent = current;
        neighbor.x = x2;
        neighbor.y = y2;
        neighbor.g = g2;
        neighbor.f = g2 + $gameMap.distance(x2, y2, goalX, goalY);
        if (!best || neighbor.f - neighbor.g < best.f - best.g)
        {
          best = neighbor;
        }
      }
    }
  }

  let node = best;
  while (node.parent && node.parent !== start)
  {
    node = node.parent;
  }

  const deltaX1 = $gameMap.deltaX(node.x, start.x);
  const deltaY1 = $gameMap.deltaY(node.y, start.y);
  if (deltaY1 > 0)
  {
    return deltaX1 === 0 ? 2 : deltaX1 > 0 ? 3 : 1;
  }
  else if (deltaY1 < 0)
  {
    return deltaX1 === 0 ? 8 : deltaX1 > 0 ? 9 : 7;
  }
  else
  {
    if (deltaX1 !== 0)
    {
      return deltaX1 > 0 ? 6 : 4;
    }
  }

  const deltaX2 = this.deltaXFrom(goalX);
  const deltaY2 = this.deltaYFrom(goalY);
  if (Math.abs(deltaX2) > Math.abs(deltaY2))
  {
    if (deltaX2 > 0)
    {
      return deltaY2 === 0 ? 4 : deltaY2 > 0 ? 7 : 1;
    }
    else if (deltaX2 < 0)
    {
      return deltaY2 === 0 ? 6 : deltaY2 > 0 ? 9 : 3;
    }
    else
    {
      return deltaY2 === 0 ? 0 : deltaY2 > 0 ? 8 : 2;
    }
  }
  else
  {
    if (deltaY2 > 0)
    {
      return deltaX2 === 0 ? 8 : deltaX2 > 0 ? 7 : 9;
    }
    else if (deltaY2 < 0)
    {
      return deltaX2 === 0 ? 2 : deltaX2 > 0 ? 1 : 3;
    }
    else
    {
      return deltaX2 === 0 ? 0 : deltaX2 > 0 ? 4 : 6;
    }
  }
};
/* eslint-enable */
//#endregion Game_Character

//#region Game_CharacterBase
/**
 * Extends the `initMembers()` to allow custom move speeds and dashing.
 */
J.ABS.Aliased.Game_CharacterBase.initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function()
{
  J.ABS.Aliased.Game_CharacterBase.initMembers.call(this);

  /**
   * The real
   * @type {number}
   * @private
   */
  this._realMoveSpeed = 4;
  this._wasDodging = false;
  this._dodgeBoost = 0;
};

/**
 * OVERWRITE Replaces the "real move speed" value to return
 * our custom real move speed instead, along with dash boosts as necessary.
 * @returns {number}
 */
Game_CharacterBase.prototype.realMoveSpeed = function()
{
  let realMoveSpeed = this._realMoveSpeed;
  const dashBoost = (this.isDashing()
    ? this.dashSpeed()
    : 0);
  realMoveSpeed += dashBoost;
  return realMoveSpeed;
};

/**
 * Default speed boost for all characters when dashing.
 */
Game_CharacterBase.prototype.dashSpeed = function()
{
  return J.ABS.Metadata.DashSpeedBoost;
};

/**
 * Extends the `setMoveSpeed()` to also modify custom move speeds.
 */
J.ABS.Aliased.Game_CharacterBase.setMoveSpeed = Game_CharacterBase.prototype.setMoveSpeed;
Game_CharacterBase.prototype.setMoveSpeed = function(moveSpeed)
{
  J.ABS.Aliased.Game_CharacterBase.setMoveSpeed.call(this, moveSpeed);
  this._realMoveSpeed = moveSpeed;
};

/**
 * Sets the boost gained when dodging to a specified amount.
 * @param {number} dodgeMoveSpeed The boost gained when dodging.
 */
Game_CharacterBase.prototype.setDodgeBoost = function(dodgeMoveSpeed)
{
  this._dodgeBoost = dodgeMoveSpeed;
};

/**
 * Extends the update to allow for custom values while dashing.
 */
J.ABS.Aliased.Game_CharacterBase.update = Game_CharacterBase.prototype.update;
Game_CharacterBase.prototype.update = function()
{
  J.ABS.Aliased.Game_CharacterBase.update.call(this);
  this.updateDodging();
};

/**
 * Whether or not the player has executed a dodge skill.
 */
Game_CharacterBase.prototype.isDodging = function()
{
  const player = $jabsEngine.getPlayer1();
  return player.isDodging();
};

/**
 * Alters the speed when dodging (and when dodging is finished).
 */
Game_CharacterBase.prototype.updateDodging = function()
{
  // get the current state of the player's dodge.
  const isDodging = this.isDodging();

  this.handleDodgeStart(isDodging);
  this.handleDodgeEnd(isDodging);

  this._wasDodging = isDodging;
};

/**
 * Handles the start of dodging, if necessary.
 * If the player's current dodge state is active, then modify the move speed accordingly.
 * @param {boolean} isDodging True if the player is dodging right now, false otherwise.
 */
Game_CharacterBase.prototype.handleDodgeStart = function(isDodging)
{
  // if are currently dodging, update our move speed to the dodge speed instead.
  if (!this._wasDodging && isDodging)
  {
    this.setMoveSpeed(this._moveSpeed + this._dodgeBoost);
  }
};

/**
 * Handles the end of dodging, if necessary.
 * If the player's current dodge state is inactive, then return the move speed to normal.
 * @param {boolean} isDodging True if the player is dodging right now, false otherwise.
 */
Game_CharacterBase.prototype.handleDodgeEnd = function(isDodging)
{
  // if we are no longer doding, but were before, reduce the move speed back to normal.
  if (this._wasDodging && !isDodging)
  {
    this.setMoveSpeed(this._moveSpeed - this._dodgeBoost);
  }
};
//#endregion Game_CharacterBase

//#region Game_Enemies
/**
 * A class for retrieving a particular enemy.
 */
function Game_Enemies()
{
  this.initialize(...arguments);
}

/**
 * Initializes this `Game_Enemies` class.
 */
Game_Enemies.prototype.initialize = function()
{
  this._data = [];
};

/**
 * Looks up and caches an enemy of the given id.
 * @param {number} enemyId The id to look up an enemy for.
 * @returns {Game_Enemy}
 */
Game_Enemies.prototype.enemy = function(enemyId)
{
  // check to make sure there is a matching enemy in the database.
  if ($dataEnemies[enemyId])
  {
    // check if our cache has this enemy entry.
    if (!this._data[enemyId])
    {
      this._data[enemyId] = new Game_Enemy(enemyId, null, null);
    }

    return this._data[enemyId];
  }
  return null;
};
//#endregion Game_Enemies

//#region Game_Enemy
/**
 * Gets the battler id of this enemy from the database.
 * @returns {number}
 */
Game_Enemy.prototype.battlerId = function()
{
  return this.enemyId();
};

/**
 * Gets all skills that are executed by this enemy when it is defeated.
 * @returns {JABS_OnChanceEffect}
 */
Game_Enemy.prototype.onOwnDefeatSkillIds = function()
{
  const structure = /<onOwnDefeat:[ ]?(\[\d+,[ ]?\d+])>/i;
  return J.BASE.Helpers.parseSkillChance(structure, this.enemy());
};

/**
 * Gets all skills that are executed by this enemy when it defeats its target.
 * @returns {JABS_OnChanceEffect}
 */
Game_Enemy.prototype.onTargetDefeatSkillIds = function()
{
  const structure = /<onTargetDefeat:[ ]?(\[\d+,[ ]?\d+])>/i;
  return J.BASE.Helpers.parseSkillChance(structure, this.enemy());
};

/**
 * Gets the current number of bonus hits for this enemy.
 * @returns {number}
 */
Game_Enemy.prototype.getBonusHits = function()
{
  let bonusHits = 0;
  const structure = /<bonusHits:[ ]?(\d+)>/i;
  const objectsToCheck = this.getAllNotes();
  objectsToCheck.forEach(obj =>
  {
    const notedata = obj.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        bonusHits = parseInt(RegExp.$1);
      }
    });
  });

  return bonusHits;
};

/**
 * Gets the enemy's prepare time from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {number}
 */
Game_Enemy.prototype.prepareTime = function()
{
  const referenceData = this.enemy();

  const prepareTimeTrait = referenceData.traits
    .find(trait => trait.code === J.BASE.Traits.ATTACK_SPEED);
  if (prepareTimeTrait)
  {
    return prepareTimeTrait.value;
  }

  const prepareFromNotes = this.getPrepareTimeFromNotes(referenceData);
  if (prepareFromNotes)
  {
    return prepareFromNotes;
  }

  return J.ABS.Metadata.DefaultEnemyPrepareTime;
};

/**
 * Gets the prepare time from the notes of the provided reference data.
 * @param {RPG_Enemy} referenceData
 * @returns {number}
 */
Game_Enemy.prototype.getPrepareTimeFromNotes = function(referenceData)
{
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.PrepareTime])
  {
    // if its in the metadata, then grab it from there.
    return parseInt(referenceData.meta[J.BASE.Notetags.PrepareTime]);
  }
  else
  {
    // if its not in the metadata, then check the notes proper.
    let prepareTime = 0;
    const structure = /<prepare:[ ]?([0-9]*)>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        prepareTime = parseInt(RegExp.$1);
      }
    });

    return prepareTime;
  }
};

/**
 * Gets the enemy's basic attack skill id.
 * This is defined by the first "Attack Skill" trait on an enemy.
 * If there are multiple traits of this kind, only the first found will be used.
 * @returns {number}
 */
J.ABS.Aliased.Game_Enemy.set('basicAttackSkillId', Game_Enemy.prototype.basicAttackSkillId);
Game_Enemy.prototype.basicAttackSkillId = function()
{
  // check our enemy to see if we found a custom basic attack skill id.
  const basicAttackSkillId = J.ABS.Aliased.Game_Enemy.get('basicAttackSkillId').call(this);

  // if we didn't find one, return the default instead.
  return basicAttackSkillId ?? J.ABS.Metadata.DefaultEnemyAttackSkillId;
};

/**
 * Gets the enemy's sight range from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {number}
 */
Game_Enemy.prototype.sightRange = function()
{
  let val = J.ABS.Metadata.DefaultEnemySightRange;

  const referenceData = this.enemy();
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Sight])
  {
    // if its in the metadata, then grab it from there.
    val = referenceData.meta[J.BASE.Notetags.Sight];
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
        val = RegExp.$1;
      }
    });
  }

  return parseInt(val);
};

/**
 * Gets the enemy's boost to sight range when alerted from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {number}
 */
Game_Enemy.prototype.alertedSightBoost = function()
{
  let val = J.ABS.Metadata.DefaultEnemyAlertedSightBoost;

  const referenceData = this.enemy();
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertSightBoost])
  {
    // if its in the metadata, then grab it from there.
    val = referenceData.meta[J.BASE.Notetags.AlertSightBoost];
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
        val = RegExp.$1;
      }
    });
  }

  return parseInt(val);
};

/**
 * Gets the enemy's pursuit range from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {number}
 */
Game_Enemy.prototype.pursuitRange = function()
{
  let val = J.ABS.Metadata.DefaultEnemyPursuitRange;

  const referenceData = this.enemy();
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Pursuit])
  {
    // if its in the metadata, then grab it from there.
    val = referenceData.meta[J.BASE.Notetags.Pursuit];
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
        val = RegExp.$1;
      }
    });
  }

  return parseInt(val);
};

/**
 * Gets the enemy's boost to pursuit range when alerted from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {number}
 */
Game_Enemy.prototype.alertedPursuitBoost = function()
{
  let val = J.ABS.Metadata.DefaultEnemyAlertedPursuitBoost;

  const referenceData = this.enemy();
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertPursuitBoost])
  {
    // if its in the metadata, then grab it from there.
    val = referenceData.meta[J.BASE.Notetags.AlertPursuitBoost];
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
        val = RegExp.$1;
      }
    });
  }

  return parseInt(val);
};

/**
 * Gets the enemy's duration for being alerted from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {number}
 */
Game_Enemy.prototype.alertDuration = function()
{
  let val = J.ABS.Metadata.DefaultEnemyAlertDuration;

  const referenceData = this.enemy();
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.AlertDuration])
  {
    // if its in the metadata, then grab it from there.
    val = referenceData.meta[J.BASE.Notetags.AlertDuration];
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
        val = RegExp.$1;
      }
    });
  }

  return parseInt(val);
};

/**
 * Gets the enemy's team id from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {number}
 */
Game_Enemy.prototype.teamId = function()
{
  let val = JABS_Battler.enemyTeamId();

  const referenceData = this.enemy();
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
 * Gets the enemy's ai from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {JABS_BattlerAI}
 */
Game_Enemy.prototype.ai = function()
{
  let careful = false;
  let executor = false;
  let reckless = false;
  let healer = false;
  let follower = false;
  let leader = false;

  const referenceData = this.enemy();
  const notedata = referenceData.note.split(/[\r\n]+/);
  notedata.forEach(note =>
  {
    // check if this battler has the "careful" ai trait.
    if (/<(?:ai|aiTrait):[ ]?(careful)>/i.test(note))
    {
      // parse the value out of the regex capture group.
      careful = true;
    }

    // check if this battler has the "executor" ai trait.
    if (/<(?:ai|aiTrait):[ ]?(executor)>/i.test(note))
    {
      // parse the value out of the regex capture group.
      executor = true;
    }

    // check if this battler has the "reckless" ai trait.
    if (/<(?:ai|aiTrait):[ ]?(reckless)>/i.test(note))
    {
      // parse the value out of the regex capture group.
      reckless = true;
    }

    // check if this battler has the "healer" ai trait.
    if (/<(?:ai|aiTrait):[ ]?(healer)>/i.test(note))
    {
      // parse the value out of the regex capture group.
      healer = true;
    }

    // check if this battler has the "follower" ai trait.
    if (/<(?:ai|aiTrait):[ ]?(follower)>/i.test(note))
    {
      // parse the value out of the regex capture group.
      follower = true;
    }

    // check if this battler has the "leader" ai trait.
    if (/<(?:ai|aiTrait):[ ]?(leader)>/i.test(note))
    {
      // if the value is present, then it must be
      leader = true;
    }
  });

  // check if we found exactly zero bonus ai traits.
  if (!careful && !executor && !reckless && !healer && !follower && !leader)
  {
    // if we found none, scan for legacy code format.
    const legacyAi = this.translateLegacyAi();

    // check if we found an AI built off the legacy code format.
    if (legacyAi)
    {
      // return the legacy AI instead of an empty AI.
      return legacyAi;
    }
  }

  // return what we found, or didn't find.
  return new JABS_BattlerAI(careful, executor, reckless, healer, follower, leader);
};

/**
 * Parses out the battler ai based on legacy code format.
 * The basic/defensive traits are no longer valid, and their
 * equivalent ai traits are ignored.
 * @returns {JABS_BattlerAI|null} The legacy-built battler ai, or null if none was found.
 */
Game_Enemy.prototype.translateLegacyAi = function()
{
  // all variables gotta start somewhere.
  let code = J.ABS.Metadata.DefaultEnemyAiCode;

  // check all the valid event commands to see if we have any ai traits.
  const referenceData = this.enemy();
  const notedata = referenceData.note.split(/[\r\n]+/);
  notedata.forEach(note =>
  {
    // check if this battler has the "careful" ai trait.
    if (/<ai:[ ]?([0|1]{8})>/i.test(note))
    {
      // parse the value out of the regex capture group.
      code = RegExp.$1;
    }
  });

  // build the new AI based on the old code.
  return new JABS_BattlerAI(
    //Boolean(parseInt(code[0]) === 1) || false, // basic, but no longer a feature.
    Boolean(parseInt(code[1]) === 1) || false, // careful
    Boolean(parseInt(code[2]) === 1) || false, // executor
    Boolean(parseInt(code[3]) === 1) || false, // reckless
    //Boolean(parseInt(code[4]) === 1) || false, // defensive, but no longer a feature.
    Boolean(parseInt(code[5]) === 1) || false, // healer
    Boolean(parseInt(code[6]) === 1) || false, // follower
    Boolean(parseInt(code[7]) === 1) || false, // leader
  );
};

/**
 * Gets whether or not an enemy can idle about from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {boolean}
 */
Game_Enemy.prototype.canIdle = function()
{
  let val = J.ABS.Metadata.DefaultEnemyCanIdle;

  const referenceData = this.enemy();
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.NoIdle])
  {
    // if its in the metadata, then grab it from there.
    val = false;
  }
  else
  {
    const structure = /<noIdle>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        val = false;
      }
    });
  }

  return val;
};

/**
 * Gets whether or not an enemy has a visible hp bar from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {boolean}
 */
Game_Enemy.prototype.showHpBar = function()
{
  let val = J.ABS.Metadata.DefaultEnemyShowHpBar;

  const referenceData = this.enemy();
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.NoHpBar])
  {
    // if its in the metadata, then grab it from there.
    val = false;
  }
  else
  {
    const structure = /<noHpBar>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        val = false;
      }
    });
  }

  return val;
};

/**
 * Gets whether or not an enemy has a visible battler name from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {boolean}
 */
Game_Enemy.prototype.showBattlerName = function()
{
  let val = J.ABS.Metadata.DefaultEnemyShowBattlerName;

  const referenceData = this.enemy();
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.NoBattlerName])
  {
    // if its in the metadata, then grab it from there.
    val = false;
  }
  else
  {
    const structure = /<noName>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        val = false;
      }
    });
  }

  return val;
};

/**
 * Gets whether or not an enemy is invincible from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {boolean}
 */
Game_Enemy.prototype.isInvincible = function()
{
  let val = J.ABS.Metadata.DefaultEnemyIsInvincible;

  const referenceData = this.enemy();
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Invincible])
  {
    // if its in the metadata, then grab it from there.
    val = true;
  }
  else
  {
    const structure = /<invincible>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        val = true;
      }
    });
  }

  return val;
};

/**
 * Gets whether or not an enemy is invincible from their notes.
 * This will be overwritten by values provided from an event.
 * @returns {boolean}
 */
Game_Enemy.prototype.isInanimate = function()
{
  let val = J.ABS.Metadata.DefaultEnemyIsInanimate;

  const referenceData = this.enemy();
  if (referenceData.meta && referenceData.meta[J.BASE.Notetags.Inanimate])
  {
    // if its in the metadata, then grab it from there.
    val = true;
  }
  else
  {
    const structure = /<inanimate>/i;
    const notedata = referenceData.note.split(/[\r\n]+/);
    notedata.forEach(note =>
    {
      if (note.match(structure))
      {
        val = true;
      }
    });
  }

  return val;
};
//#endregion Game_Enemy

//#region Game_Event
J.ABS.Aliased.Game_Event.initMembers = Game_Event.prototype.initMembers;
Game_Event.prototype.initMembers = function()
{
  this._j = this._j || {};

  /**
   * The various parameters extracted from the event on the field.
   * These parameters describe a battler's core data points so that
   * their `JABS_Battler` can be constructed.
   * @type {JABS_BattlerCoreData}
   */
  this._j._battlerData = null;

  /**
   * The initial direction this event is facing.
   */
  this._j._initialDirection = 0;

  /**
   * The direction the player was facing when the skill was executed.
   * Only applicable to action events.
   * @type {number}
   */
  this._j._castedDirection = 0;
  J.ABS.Aliased.Game_Event.initMembers.call(this);
};

/**
 * Binds a `JABS_Action` to a `Game_Event`.
 * @param {JABS_Action} action The action to assign to this `Game_Event`.
 */
Game_Event.prototype.setMapActionData = function(action)
{
  this._j._action.actionData = action;
};

/**
 * Sets the initial direction being faced on this event's creation.
 * @param {number} direction The initial direction faced on creation.
 */
Game_Event.prototype.setCustomDirection = function(direction)
{
  // don't turn if direction is fixed.
  if (this.isDirectionFixed()) return;

  this._j._initialDirection = direction;
};

/**
 * Gets the initial direction being faced on this event's creation.
 * @returns {number}
 */
Game_Event.prototype.getCustomDirection = function()
{
  return this._j._initialDirection;
};

/**
 * Sets the initial direction being faced on this event's creation.
 * @param {number} direction The initial direction faced on creation.
 */
Game_Event.prototype.setCastedDirection = function(direction)
{
  // don't turn if direction is fixed.
  if (this.isDirectionFixed()) return;

  this._j._castedDirection = direction;
};

/**
 * Gets the initial direction being faced on this event's creation.
 * @returns {number}
 */
Game_Event.prototype.getCastedDirection = function()
{
  return this._j._castedDirection;
};

/**
 * Modifies the `.event` method of `Game_Event` to return the data from the
 * $actionMap if it isn't a normal event.
 */
J.ABS.Aliased.Game_Event.event = Game_Event.prototype.event;
Game_Event.prototype.event = function()
{
  if (this.isAction())
  {
    return $jabsEngine.event(this.getMapActionUuid());
  }

  return J.ABS.Aliased.Game_Event.event.call(this);
};

/**
 * Adds an extra catch so that if there is a failure, then the failure is
 * silently ignored because bad timing is just bad luck!
 */
J.ABS.Aliased.Game_Event.findProperPageIndex = Game_Event.prototype.findProperPageIndex;
Game_Event.prototype.findProperPageIndex = function()
{
  try
  {
    const test = J.ABS.Aliased.Game_Event.findProperPageIndex.call(this);
    if (Number.isInteger(test)) return test;
  }
  catch (err)
  {
    return -1;
  }
};

/**
 * OVERWRITE When an map battler is hidden by something like a switch or some
 * other condition, unveil it upon meeting such conditions.
 */
J.ABS.Aliased.Game_Event.refresh = Game_Event.prototype.refresh;
Game_Event.prototype.refresh = function()
{
  if ($jabsEngine.absEnabled)
  {
    // don't refresh loot.
    if (this.isLoot()) return;

    const newPageIndex = this._erased ? -1 : this.findProperPageIndex();
    if (this._pageIndex !== newPageIndex)
    {
      this._pageIndex = newPageIndex;
      this.setupPage();
      this.transformBattler();
    }
  }
  else
  {
    J.ABS.Aliased.Game_Event.refresh.call(this);
  }
};

/**
 * Extends this method to accommodate for the possibility of that one
 * error propping up where an attempt to update an event that is no longer
 * available for updating causing the game to crash.
 */
J.ABS.Aliased.Game_Event.page = Game_Event.prototype.page;
Game_Event.prototype.page = function()
{
  if (this.event())
  {
    return J.ABS.Aliased.Game_Event.page.call(this);
  }

  /*
  console.log($dataMap.events);
  console.log($gameMap._events);
  console.warn(this);
  console.warn('that thing happened again, you should probably look into this.');
  */
  return null;
};

/**
 * Reveals a battler that was hidden.
 */
Game_Event.prototype.transformBattler = function()
{
  const battler = this.getMapBattler();
  if (battler)
  {
    battler.revealHiddenBattler();
  }

  $gameMap.refreshOneBattler(this);
};

/**
 * Extends the pagesettings for events and adds on custom parameters to this event.
 */
J.ABS.Aliased.Game_Event.setupPageSettings = Game_Event.prototype.setupPageSettings;
Game_Event.prototype.setupPageSettings = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Event.setupPageSettings.call(this);

  // parse the comments on the event to potentially transform it into a battler.
  this.parseEnemyComments();
};

/**
 * Parses the comments of this event to extract battler core data if available.
 *
 * JABS parameters are prioritized in this order:
 *  1) from the comments on the event page itself.
 *  2) from the notes of the enemy in the database (requires at least enemy id in comments).
 *  3) from the defaults of all enemies.
 */
Game_Event.prototype.parseEnemyComments = function()
{
  // apply the custom move speeds from this event if any are available.
  this.applyCustomMoveSpeed();

  // if there is something stopping us from parsing comments, then do not.
  if (!this.canParseEnemyComments())
  {
    this.initializeCoreData(null);
    return;
  }

  //  determine our overrides.
  const battlerId = this.getBattlerIdOverrides();
  let teamId = this.getTeamIdOverrides();
  const ai = this.getBattlerAiOverrides();
  const sightRange = this.getSightRangeOverrides();
  const alertedSightBoost = this.getAlertedSightBoostOverrides();
  const pursuitRange = this.getPursuitRangeOverrides();
  const alertedPursuitBoost = this.getAlertedPursuitBoostOverrides();
  const alertDuration = this.getAlertDurationOverrides();
  let canIdle = this.getCanIdleOverrides();
  let showHpBar = this.getShowHpBarOverrides();
  let showBattlerName = this.getShowBattlerNameOverrides();
  const isInvincible = this.getInvincibleOverrides();
  const isInanimate = this.getInanimateOverrides();

  // if inanimate, override the overrides with these instead.
  if (isInanimate)
  {
    // inanimate objects belong to the neutral team.
    teamId = JABS_Battler.neutralTeamId();

    // inanimate objects cannot idle, lack hp bars, and won't display their name.
    canIdle = false;
    showHpBar = false;
    showBattlerName = false;
  }

  // setup the core data and assign it.
  const enemyBattler = $gameEnemies.enemy(battlerId);
  const battlerCoreData = new JABS_CoreDataBuilder(battlerId)
    .setTeamId(teamId ?? enemyBattler.teamId())
    .setBattlerAi(ai ?? enemyBattler.ai())
    .setSightRange(sightRange ?? enemyBattler.sightRange())
    .setAlertedSightBoost(alertedSightBoost ?? enemyBattler.alertedSightBoost())
    .setPursuitRange(pursuitRange ?? enemyBattler.pursuitRange())
    .setAlertedPursuitBoost(alertedPursuitBoost ?? enemyBattler.alertedPursuitBoost())
    .setAlertDuration(alertDuration ?? enemyBattler.alertDuration())
    .setCanIdle(canIdle ?? enemyBattler.canIdle())
    .setShowHpBar(showHpBar ?? enemyBattler.showHpBar())
    .setShowBattlerName(showBattlerName ?? enemyBattler.showBattlerName())
    .setIsInvincible(isInvincible ?? enemyBattler.isInvincible())
    .setIsInanimate(isInanimate ?? enemyBattler.isInanimate())
    .build();

  // build the core data based on this.
  this.initializeCoreData(battlerCoreData);
};

//#region overrides
/**
 * Parses out the enemy id from a list of event commands.
 * @returns {number} The found battler id, or 0 if not found.
 */
Game_Event.prototype.getBattlerIdOverrides = function()
{
  // all variables gotta start somewhere.
  let battlerId = 0;

  // check all the valid event commands to see what our battler id is.
  this.getValidCommentCommands().forEach(command =>
    {
      // shorthand the comment into a variable.
      const comment = command.parameters[0];

      // check if this is a matching line.
      if (/<(?:e|enemy|enemyId):[ ]?([0-9]*)>/i.test(comment))
      {
        // parse the value out of the regex capture group.
        battlerId = parseInt(RegExp.$1);
      }
    });

  // return what we found.
  return battlerId;
};

/**
 * Parses out the team id from a list of event commands.
 * @returns {number|null} The found team id, or null if not found.
 */
Game_Event.prototype.getTeamIdOverrides = function()
{
  // all variables gotta start somewhere.
  let teamId = 1;

  // check all the valid event commands to see if we have an override for team.
  this.getValidCommentCommands().forEach(command =>
    {
      // shorthand the comment into a variable.
      const comment = command.parameters[0];

      // check if this is a matching line.
      if (/<(?:team|teamId):[ ]?([0-9]*)>/i.test(comment))
      {
        // parse the value out of the regex capture group.
        teamId = parseInt(RegExp.$1);
      }
    });

  // return what we found.
  return teamId;
};

/**
 * Parses out the battler ai including their bonus ai traits.
 * @returns {JABS_BattlerAI} The constructed battler AI.
 */
Game_Event.prototype.getBattlerAiOverrides = function()
{
  // default to not having any ai traits.
  let careful = false;
  let executor = false;
  let reckless = false;
  let healer = false;
  let follower = false;
  let leader = false;

  // check all the valid event commands to see if we have any ai traits.
  this.getValidCommentCommands().forEach(command =>
    {
      // shorthand the comment into a variable.
      const [comment,] = command.parameters;

      // check if this battler has the "careful" ai trait.
      if (/<(?:ai|aiTrait):[ ]?(careful)>/i.test(comment))
      {
        // parse the value out of the regex capture group.
        careful = true;
      }

      // check if this battler has the "executor" ai trait.
      if (/<(?:ai|aiTrait):[ ]?(executor)>/i.test(comment))
      {
        // parse the value out of the regex capture group.
        executor = true;
      }

      // check if this battler has the "reckless" ai trait.
      if (/<(?:ai|aiTrait):[ ]?(reckless)>/i.test(comment))
      {
        // parse the value out of the regex capture group.
        reckless = true;
      }

      // check if this battler has the "healer" ai trait.
      if (/<(?:ai|aiTrait):[ ]?(healer)>/i.test(comment))
      {
        // parse the value out of the regex capture group.
        healer = true;
      }

      // check if this battler has the "follower" ai trait.
      if (/<(?:ai|aiTrait):[ ]?(follower)>/i.test(comment))
      {
        // parse the value out of the regex capture group.
        follower = true;
      }

      // check if this battler has the "leader" ai trait.
      if (/<(?:ai|aiTrait):[ ]?(leader)>/i.test(comment))
      {
        // if the value is present, then it must be
        leader = true;
      }
    });

  // check if we found exactly zero bonus ai traits.
  if (!careful && !executor && !reckless && !healer && !follower && !leader)
  {
    // if we found none, scan for legacy code format.
    const legacyAi = this.getBattlerAiOverridesLegacy();

    // check if we found an AI built off the legacy code format.
    if (legacyAi)
    {
      // return the legacy AI instead of an empty AI.
      return legacyAi;
    }

    // we have absolutely no ai trait overrides.
    return null;
  }

  // return the overridden battler ai.
  return new JABS_BattlerAI(careful, executor, reckless, healer, follower, leader);
};

/**
 * Parses out the battler ai based on legacy code format.
 * The basic/defensive traits are no longer valid, and their
 * equivalent ai traits are ignored.
 * @returns {JABS_BattlerAI|null} The legacy-built battler ai, or null if none was found.
 */
Game_Event.prototype.getBattlerAiOverridesLegacy = function()
{
  // all variables gotta start somewhere.
  let code = String.empty;

  // check all the valid event commands to see if we have any ai traits.
  this.getValidCommentCommands()
    .forEach(command =>
    {
      // shorthand the comment into a variable.
      const comment = command.parameters[0];

      // check if this battler has ai traits.
      if (/<ai:[ ]?([0|1]{8})>/i.test(comment))
      {
        // parse the value out of the regex capture group.
        code = RegExp.$1;
      }
    });

  // if we found a legacy AI code, we'll accept that... for now...
  if (code !== String.empty)
  {
    //const basic = parseInt(code[0]) === 1; // no longer a feature.
    const careful = parseInt(code[1]) === 1;
    const executor = parseInt(code[2]) === 1;
    const reckless = parseInt(code[3]) === 1;
    //const defensive = parseInt(code[4]) === 1; // no longer a feature.
    const healer = parseInt(code[5]) === 1;
    const follower = parseInt(code[6]) === 1;
    const leader = parseInt(code[7]) === 1;

    // build the new AI based on the old code.
    return new JABS_BattlerAI(careful, executor, reckless, healer, follower, leader);
  }

  // if we found nothing, thats okay, we just legit have no overrides.
  return null;
};

/**
 * Parses out the sight range from a list of event commands.
 * @returns {number|null} The found sight range, or null if not found.
 */
Game_Event.prototype.getSightRangeOverrides = function()
{
  // all variables gotta start somewhere.
  let sightRange = null;

  // check all the valid event commands to see if we have an override for sight.
  this.getValidCommentCommands()
    .forEach(command =>
    {
      // shorthand the comment into a variable.
      const comment = command.parameters[0];

      // check if this is a matching line.
      if (/<(?:s|sight|sightRange):[ ]?([0-9]*)>/i.test(comment))
      {
        // parse the value out of the regex capture group.
        sightRange = parseInt(RegExp.$1);
      }
    });

  // return what we found.
  return sightRange;
};

/**
 * Parses out the alerted sight boost from a list of event commands.
 * @returns {number|null} The found alerted sight boost range, or null if not found.
 */
Game_Event.prototype.getAlertedSightBoostOverrides = function()
{
  // all variables gotta start somewhere.
  let alertedSightBoost = null;

  // check all the valid event commands to see if we have an override for this.
  this.getValidCommentCommands()
    .forEach(command =>
    {
      // shorthand the comment into a variable.
      const comment = command.parameters[0];

      // check if this is a matching line.
      if (/<(?:as|alertedSight|alertedSightBoost):[ ]?([0-9]*)>/i.test(comment))
      {
        // parse the value out of the regex capture group.
        alertedSightBoost = parseInt(RegExp.$1);
      }
    });

  // return what we found.
  return alertedSightBoost;
};

/**
 * Parses out the pursuit range from a list of event commands.
 * @returns {number|null} The found pursuit range, or null if not found.
 */
Game_Event.prototype.getPursuitRangeOverrides = function()
{
  // all variables gotta start somewhere.
  let pursuitRange = null;

  // check all the valid event commands to see if we have an override for this.
  this.getValidCommentCommands()
    .forEach(command =>
    {
      // shorthand the comment into a variable.
      const comment = command.parameters[0];

      // check if this is a matching line.
      if (/<(?:p|pursuit|pursuitRange):[ ]?([0-9]*)>/i.test(comment))
      {
        // parse the value out of the regex capture group.
        pursuitRange = parseInt(RegExp.$1);
      }
    });

  // return what we found.
  return pursuitRange;
};

/**
 * Parses out the alerted pursuit boost from a list of event commands.
 * @returns {number|null} The found alerted pursuit boost range, or null if not found.
 */
Game_Event.prototype.getAlertedPursuitBoostOverrides = function()
{
  // all variables gotta start somewhere.
  let alertedPursuitBoost = null;

  // check all the valid event commands to see if we have an override for this.
  this.getValidCommentCommands()
    .forEach(command =>
    {
      // shorthand the comment into a variable.
      const comment = command.parameters[0];

      // check if this is a matching line.
      if (/<(?:ap|alertedPursuit|alertedPursuitBoost):[ ]?([0-9]*)>/i.test(comment))
      {
        // parse the value out of the regex capture group.
        alertedPursuitBoost = parseInt(RegExp.$1);
      }
    });

  // return what we found.
  return alertedPursuitBoost;
};

/**
 * Parses out the alert duration from a list of event commands.
 * @returns {number|null} The found alert duration, or null if not found.
 */
Game_Event.prototype.getAlertDurationOverrides = function()
{
  // all variables gotta start somewhere.
  let alertDuration = null;

  // check all the valid event commands to see if we have an override for this.
  this.getValidCommentCommands()
    .forEach(command =>
    {
      // shorthand the comment into a variable.
      const comment = command.parameters[0];

      // check if this is a matching line.
      if (/<(?:ad|alertDuration):[ ]?([0-9]*)>/i.test(comment))
      {
        // parse the value out of the regex capture group.
        alertDuration = parseInt(RegExp.$1);
      }
    });

  // return what we found.
  return alertDuration;
};

/**
 * Parses out the override for whether or not this battler can idle about.
 * @returns {boolean|null} True if we force-allow idling, false if we force-disallow, null if no overrides.
 */
Game_Event.prototype.getCanIdleOverrides = function()
{
  // all variables gotta start somewhere.
  let canIdle = null;

  // check all the valid event commands to see if we have any ai traits.
  this.getValidCommentCommands()
    .forEach(command =>
    {
      // shorthand the comment into a variable.
      const comment = command.parameters[0];

      // check if this is a matching line.
      if (/<(?:cfg|config|jabsConfig)?:?[ ]?(noIdle)>/i.test(comment))
      {
        // parse the value out of the regex capture group.
        canIdle = false;
      }

      // check if this is a matching line.
      if (/<(?:cfg|config|jabsConfig)?:?[ ]?(canIdle)>/i.test(comment))
      {
        // parse the value out of the regex capture group.
        canIdle = true;
      }
    });

  // return the truth.
  return canIdle;
};

/**
 * Parses out the override for whether or not this battler can show its hp bar.
 * @returns {boolean|null} True if we force-allow showing, false if we force-disallow, null if no overrides.
 */
Game_Event.prototype.getShowHpBarOverrides = function()
{
  // all variables gotta start somewhere.
  let showHpBar = null;

  // check all the valid event commands to see if we have any ai traits.
  this.getValidCommentCommands()
    .forEach(command =>
    {
      // shorthand the comment into a variable.
      const comment = command.parameters[0];

      // check if this is a matching line.
      if (/<(?:cfg|config|jabsConfig)?:?[ ]?(noHpBar)>/i.test(comment))
      {
        // parse the value out of the regex capture group.
        showHpBar = false;
      }

      // check if this is a matching line.
      if (/<(?:cfg|config|jabsConfig)?:?[ ]?(showHpBar)>/i.test(comment))
      {
        // parse the value out of the regex capture group.
        showHpBar = true;
      }
    });

  // return the truth.
  return showHpBar;
};
//#endregion overrides

/**
 * Parses out the override for whether or not this battler is inanimate.
 * @returns {boolean|null} True if we force-inanimate, false if we force-un-inanimate, null if no overrides.
 */
Game_Event.prototype.getInanimateOverrides = function()
{
  // all variables gotta start somewhere.
  let inanimate = null;

  // check all the valid event commands to see if we have any ai traits.
  this.getValidCommentCommands()
    .forEach(command =>
    {
      // shorthand the comment into a variable.
      const comment = command.parameters[0];

      // check if this is a matching line.
      if (/<(?:cfg|config|jabsConfig)?:?[ ]?(inanimate)>/i.test(comment))
      {
        // parse the value out of the regex capture group.
        inanimate = true;
      }

      // check if this is a matching line.
      if (/<(?:cfg|config|jabsConfig)?:?[ ]?(notInanimate)>/i.test(comment))
      {
        // parse the value out of the regex capture group.
        inanimate = false;
      }
    });

  // return the truth.
  return inanimate;
};

/**
 * Parses out the override for whether or not this battler is invincible.
 * @returns {boolean|null} True if we force-invincibile, false if we force-un-invincible, null if no overrides.
 */
Game_Event.prototype.getInvincibleOverrides = function()
{
  // all variables gotta start somewhere.
  let isInvincible = null;

  // check all the valid event commands to see if we have any ai traits.
  this.getValidCommentCommands()
    .forEach(command =>
    {
      // shorthand the comment into a variable.
      const comment = command.parameters[0];

      // check if this is a matching line.
      if (/<(?:cfg|config|jabsConfig)?:?[ ]?(invincible)>/i.test(comment))
      {
        // parse the value out of the regex capture group.
        isInvincible = true;
      }

      // check if this is a matching line.
      if (/<(?:cfg|config|jabsConfig)?:?[ ]?(notInvincible)>/i.test(comment))
      {
        // parse the value out of the regex capture group.
        isInvincible = false;
      }
    });

  // return the truth.
  return isInvincible;
};

/**
 * Parses out the override for whether or not this battler can show its name.
 * @returns {boolean|null} True if we force-allow showing, false if we force-disallow, null if no overrides.
 */
Game_Event.prototype.getShowBattlerNameOverrides = function()
{
  // all variables gotta start somewhere.
  let showBattlerName = null;

  // check all the valid event commands to see if we have any ai traits.
  this.getValidCommentCommands()
    .forEach(command =>
    {
      // shorthand the comment into a variable.
      const comment = command.parameters[0];

      // check if this is a matching line.
      if (/<(?:cfg|config|jabsConfig)?:?[ ]?(noName)>/i.test(comment))
      {
        // parse the value out of the regex capture group.
        showBattlerName = false;
      }

      // check if this is a matching line.
      if (/<(?:cfg|config|jabsConfig)?:?[ ]?(showName)>/i.test(comment))
      {
        // parse the value out of the regex capture group.
        showBattlerName = true;
      }
    });

  // return the truth.
  return showBattlerName;
};

/**
 * Binds the initial core battler data to the event.
 * @param {JABS_BattlerCoreData|null} battlerCoreData The core data of this battler.
 */
Game_Event.prototype.initializeCoreData = function(battlerCoreData)
{
  this.setBattlerCoreData(battlerCoreData);
};

/**
 * Checks to see if this event [page] can have its comments parsed to
 * transform it into a `JABS_Battler`.
 * @returns {boolean} True if the event can be parsed, false otherwise.
 */
Game_Event.prototype.canParseEnemyComments = function()
{
  // if somehow it is less than -1, then do not. Weird things happen.
  if (this.findProperPageIndex() < -1) return false;

  // grab the event command list for analysis.
  const commentCommandList = this.getValidCommentCommands();

  // if we do not have a list of comments to parse, then do not.
  if (!commentCommandList.length) return false;

  // check all the commands to make sure a battler id is among them.
  const hasBattlerId = commentCommandList.some(command =>
  {
    // grab the comment and check to make sure it matches our notetag-like pattern.
    const comment = command.parameters[0];

    // check if the comment matches the pattern we expect.
    return comment.match(/<(?:e|enemyId):[ ]?([0-9]*)>/i);
  });

  // if there is no battler id among the comments, then don't parse.
  if (!hasBattlerId) return false;

  // we are clear to parse out those comments!
  return true;
};

/**
 * Gets all valid JABS-shaped comment event commands.
 * @returns {rm.types.EventCommand[]}
 */
Game_Event.prototype.getValidCommentCommands = function()
{
  // don't process if we have no event commands.
  if (this.list().length === 0) return [];

  // otherwise, return the filtered list.
  return this.list().filter(command =>
  {
    // if it is not a comment, then don't include it.
    const isComment = this.matchesControlCode(command.code);
    if (!isComment) return false;

    // make sure it has a valid structure.
    const comment = command.parameters[0];
    if (!comment.match(/^<[\w :"'.!+\-*/\\]+>$/i)) return false;

    // it is a valid comment worth parsing!
    return true;
  }, this);
};

/**
 * Applies the custom move speed if available.
 */
Game_Event.prototype.applyCustomMoveSpeed = function()
{
  // grab the list of valid comments.
  const commentCommandList = this.getValidCommentCommands();

  // iterate over the comments.
  commentCommandList.forEach(command =>
  {
    // check if the comment matches our structure.
    const comment = command.parameters[0];

    // check if this is a matching line.
    if (/<(?:ms|moveSpeed):[ ]?((0|([1-9][0-9]*))(\.[0-9]+)?)>/i.test(comment))
    {
      // parse the value out of the regex capture group.
      this.setMoveSpeed(parseFloat(RegExp.$1));
    }
  });
};

/**
 * Get the move speed of the current active page on this event.
 * @returns {number}
 */
Game_Event.prototype.getEventCurrentMovespeed = function()
{
  return this.event().pages[this.findProperPageIndex()].moveSpeed;
};

/**
 * Gets the core battler data for this event.
 * @returns {JABS_BattlerCoreData}
 */
Game_Event.prototype.getBattlerCoreData = function()
{
  return this._j._battlerData;
};

/**
 * Sets the core battler data for this event.
 * @param {JABS_BattlerCoreData} data The core data of the battler this event represents.
 */
Game_Event.prototype.setBattlerCoreData = function(data)
{
  this._j._battlerData = data;
};

/**
 * Gets whether or not this event is a JABS battler.
 * @returns {boolean}
 */
Game_Event.prototype.isJabsBattler = function()
{
  const data = this.getBattlerCoreData();
  return !!data;
};

/**
 * Gets the battler's id from their core data.
 * @returns {number}
 */
Game_Event.prototype.getBattlerId = function()
{
  const data = this.getBattlerCoreData();
  if (!data) return 0;

  return data.battlerId();
};

J.ABS.Aliased.Game_Event.moveStraight = Game_Event.prototype.moveStraight;
Game_Event.prototype.moveStraight = function(direction)
{
  J.ABS.Aliased.Game_Event.moveStraight.call(this, direction);
};
//#endregion Game_Event

//#region Game_Interpreter
/**
 * Enables setting move routes of `Game_Character`s on the map with JABS.
 * @param {number} param The character/event id to get the data for.
 * @returns {Game_Character}
 */
J.ABS.Aliased.Game_Interpreter.character = Game_Interpreter.prototype.character;
Game_Interpreter.prototype.character = function(param)
{
  if ($jabsEngine.absEnabled)
  {
    if (param < 0)
    {
      return $gamePlayer;
    }
    else if (this.isOnCurrentMap())
    {
      const id = param > 0 ? param : this._eventId;
      return $gameMap.event(id);
    }
    else
    {
      return null;
    }
  }
  else
  {
    return J.ABS.Aliased.Game_Interpreter.character.call(this, param);
  }
};

/**
 * Enables transferring with JABS.
 * Removed the check for seeing if the player is in-battle, because the player
 * is technically ALWAYS in-battle while the ABS is enabled.
 */
J.ABS.Aliased.Game_Interpreter.command201 = Game_Interpreter.prototype.command201;
Game_Interpreter.prototype.command201 = function(params)
{
  if ($jabsEngine.absEnabled)
  {
    if ($gameMessage.isBusy()) return false;

    let mapId;
    let x;
    let y;
    if (params[0] === 0)
    {
      mapId = params[1];
      x = params[2];
      y = params[3];
    }
    else
    {
      mapId = $gameVariables.value(params[1]);
      x = $gameVariables.value(params[2]);
      y = $gameVariables.value(params[3]);
    }

    $gamePlayer.reserveTransfer(mapId, x, y, params[4], params[5]);
    this.setWaitMode("transfer");
    return true;
  }
  else
  {
    return J.ABS.Aliased.Game_Interpreter.command201.call(this, params);
  }
};

/**
 * Enables map scrolling with JABS.
 * Removed the check for seeing if the player is in-battle, because the player
 * is technically ALWAYS in-battle while the ABS is enabled.
 */
J.ABS.Aliased.Game_Interpreter.command204 = Game_Interpreter.prototype.command204;
Game_Interpreter.prototype.command204 = function(params)
{
  if ($jabsEngine.absEnabled)
  {
    if ($gameMap.isScrolling())
    {
      this.setWaitMode("scroll");
      return false;
    }

    $gameMap.startScroll(params[0], params[1], params[2]);
    if (params[3])
    {
      this.setWaitMode("scroll");
    }

    return true;
  }
  else
  {
    return J.ABS.Aliased.Game_Interpreter.command204.call(this, params);
  }
};

/**
 * Enables default battles with JABS.
 * Removed the check for seeing if the player is in-battle, because the player
 * is technically ALWAYS in-battle while the ABS is enabled.
 *
 * NOTE: Though the battling is enabled, the battles may not behave as one would
 * expect from a default battle system when using an ABS as well.
 */
J.ABS.Aliased.Game_Interpreter.command301 = Game_Interpreter.prototype.command301;
Game_Interpreter.prototype.command301 = function(params)
{
  if ($jabsEngine.absEnabled)
  {
    let troopId;
    switch (params[0])
    {
      case 0:
        // Direct designation
        troopId = params[1];
        break;
      case 1:
        // Designation with a variable
        troopId = $gameVariables.value(params[1]);
        break;
      default:
        // Same as Random Encounters
        troopId = $gamePlayer.makeEncounterTroopId();
        break;
    }

    if ($dataTroops[troopId])
    {
      BattleManager.setup(troopId, params[2], params[3]);
      BattleManager.setEventCallback(n => this._branch[this._indent] = n);
      $gamePlayer.makeEncounterCount();
      SceneManager.push(Scene_Battle);
    }

    return true;
  }
  else
  {
    return J.ABS.Aliased.Game_Interpreter.command301.call(this, params);
  }
};

/**
 * Enables the shop scene with JABS.
 * Removed the check for seeing if the player is in-battle, because the player is
 * technically ALWAYS in-battle while the ABS is enabled.
 */
J.ABS.Aliased.Game_Interpreter.command302 = Game_Interpreter.prototype.command302;
Game_Interpreter.prototype.command302 = function(params)
{
  if ($jabsEngine.absEnabled)
  {
    const goods = [params];
    while (this.nextEventCode() === 605)
    {
      this._index++;
      goods.push(this.currentCommand().parameters);
    }

    SceneManager.push(Scene_Shop);
    SceneManager.prepareNextScene(goods, params[4]);
    return true;
  }
  else
  {
    return J.ABS.Aliased.Game_Interpreter.command302.call(this, params);
  }
};

/**
 * Enables the name input processing with JABS.
 * Removed the check for seeing if the player is in-battle, because the player is
 * technically ALWAYS in-battle while the ABS is enabled.
 */
J.ABS.Aliased.Game_Interpreter.command303 = Game_Interpreter.prototype.command303;
Game_Interpreter.prototype.command303 = function(params)
{
  if ($jabsEngine.absEnabled)
  {
    if ($dataActors[params[0]]) 
    {
      SceneManager.push(Scene_Name);
      SceneManager.prepareNextScene(params[0], params[1]);
    }

    return true;
  }

  return J.ABS.Aliased.Game_Interpreter.command303.call(this, params);
};

/**
 * Enables saving with JABS.
 * Removed the check for seeing if the player is in-battle, because the player is
 * technically ALWAYS in-battle while the ABS is enabled.
 */
J.ABS.Aliased.Game_Interpreter.command352 = Game_Interpreter.prototype.command352;
Game_Interpreter.prototype.command352 = function()
{
  if ($jabsEngine.absEnabled)
  {
    SceneManager.push(Scene_Save);
    return true;
  }
  else
  {
    return J.ABS.Aliased.Game_Interpreter.command352.call(this);
  }
};
//#endregion Game_Interpreter

//#region Game_Map
/**
 * Hooks into `Game_Map.initialize()` to add the JABS object for tracking
 * all things related to the ABS system.
 */
J.ABS.Aliased.Game_Map.set('initialize', Game_Map.prototype.initialize);
Game_Map.prototype.initialize = function()
{
  // perform original logic.
  J.ABS.Aliased.Game_Map.get('initialize').call(this);

  // initialize jabs properties.
  this.initJabsMembers();
};

/**
 * Initializes properties of this class related to JABS.
 */
Game_Map.prototype.initJabsMembers = function()
{
  /**
   * The over-arching J object to contain all additional plugin parameters.
   */
  this._j ||= {};

  /**
   * A tracking list of all current battlers on this map.
   * @type {JABS_Battler[]}
   */
  this._j._allBattlers = [];
};

/**
 * Extends `Game_Map.setup()` to parse out battlers and populate enemies.
 */
J.ABS.Aliased.Game_Map.set('setup', Game_Map.prototype.setup);
Game_Map.prototype.setup = function(mapId)
{
  // perform original logic.
  J.ABS.Aliased.Game_Map.get('setup').call(this, mapId);

  // initialize all JABS-related data.
  this.initJabsEngine();
};

/**
 * Initializes all enemies and the battle map for JABS.
 */
Game_Map.prototype.initJabsEngine = function()
{
  // don't do things if we aren't using JABS.
  if (!$jabsEngine.absEnabled) return;

  // initialize the battle map for this map.
  $jabsEngine.initialize();

  // refresh all the battlers on this map.
  this.refreshAllBattlers();
};

/**
 * Refresh all battlers on the map. This only affects existing enemies on the map.
 * If an enemy was defeated and thus removed, that enemy is gone until the map is
 * reinitialized.
 */
Game_Map.prototype.refreshAllBattlers = function()
{
  /**
   * A collection of all existing battlers on the current map.
   * @type {JABS_Battler[]}
   */
  this._j._allBattlers = this.parseBattlers();
};

/**
 * Refreshes a single battler on this map. Only affects existing enemies on the map.
 * This is used almost exclusively with conditional event rendering.
 * @param {Game_Event} event The event to refresh.
 */
Game_Map.prototype.refreshOneBattler = function(event)
{
  // get the index of the battler by uuid, assuming they exist in the collection.
  const [battler, targetIndex] = this.findBattlerByUuid(event.getMapBattlerUuid());

  // if we found a match, it is update/delete.
  const newBattler = this.convertOneToEnemy(event);
  if (battler)
  {
    // check to see if the new page is an enemy.
    if (newBattler === null)
    {
      // if not an enemy, delete it from the battler tracking.
      this.destroyBattler(battler, true);
    }
    else
    {
      // if it is an enemy, update the old enemy with the new one.
      this._j._allBattlers[targetIndex] = newBattler;
    }
  }

  // if we didn't find a match, then its create or do nothing.
  else
  {
    // the next page is an enemy, create a new one and add to the list.
    if (!(newBattler === null))
    {
      this._j._allBattlers.push(newBattler);
    }
    // the next page is not an enemy, do nothing.
  }
};

/**
 * Hooks into `Game_Map.update()` to add the battle map's update.
 */
J.ABS.Aliased.Game_Map.set('update', Game_Map.prototype.update);
Game_Map.prototype.update = function(sceneActive)
{
  // perform original logic.
  J.ABS.Aliased.Game_Map.get('update').call(this, sceneActive);

  // update JABS-related things.
  this.updateJabs();
};

/**
 * Updates things related to JABS.
 */
Game_Map.prototype.updateJabs = function()
{
  // update JABS battle map.
  $jabsEngine.update();
};

/**
 * Gets all action events that have yet to have a `Sprite_Character` generated for them.
 * @returns {Game_Event[]} A list of all newly added action events.
 */
Game_Map.prototype.newActionEvents = function()
{
  // the filter function for only retrieving newly-added action events.
  const filtering = event =>
  {
    // we only care about actions that also need adding.
    if (event.getActionSpriteNeedsAdding()) return true;

    // it must have already had a sprite created for this action.
    return false;
  };

  // return the new-action-filtered event list.
  return this.actionEvents().filter(filtering);
};

/**
 * Gets all action events that have reached their expiration and need removal.
 * @returns {Game_Event[]} A list of all expired action events.
 */
Game_Map.prototype.expiredActionEvents = function()
{
  // the filter function for only retrieving expired action events.
  const filtering = event =>
  {
    // we only care about actions that are past their prime.
    if (event.getJabsActionNeedsRemoving()) return true;

    // the action must still be valid.
    return false;
  };

  // return the expired-action-filtered event list.
  return this.actionEvents().filter(filtering);
};

/**
 * Gets all action events that have reached their expiration and need removal.
 * @returns {rm.types.Event[]} All relevant action metadatas.
 */
Game_Map.prototype.actionEventsFromDataMapByUuid = function(uuid)
{
  // the filter function for retrieving action metadatas from the datamap.
  /** @param {rm.types.Event} metadata */
  const filtering = metadata =>
  {
    // don't include invalid or non-action event metadatas.
    if (!metadata || !metadata.actionIndex) return false;

    // don't include actions metadatas that aren't related to the removed one.
    const actionMetadata = $jabsEngine.event(uuid);
    if (metadata.actionIndex !== actionMetadata.actionIndex) return false;

    // we want this metadata!
    return true;
  };

  // return the action-metadata-filtered event list.
  return $dataMap.events.filter(filtering);
};

/**
 * Gets all events that have a `JABS_Action` associated with them on the current map.
 * @returns {Game_Event[]} A list of events that have a `JABS_Action`.
 */
Game_Map.prototype.actionEvents = function()
{
  // the filter function for only retrieving action events.
  const filtering = event =>
  {
    // the only thing that matters is if we explicitly flagged it as an action.
    if (event.isAction) return true;

    // it must not be a real action.
    return false;
  };

  // return the action-filtered event list.
  return this.events().filter(filtering);
};

/**
 * Gets all loot events that have yet to have a `Sprite_Character` generated for them.
 * @returns {Game_Event[]} A list of all newly added loot events.
 */
Game_Map.prototype.newLootEvents = function()
{
  // the filter function for only retrieving newly-added loot events.
  const filtering = event =>
  {
    // we only care about loot that also needs adding.
    if (event.getLootNeedsAdding()) return true;

    // it must have already had a sprite created for this loot.
    return false;
  };

  // return the new-loot-filtered event list.
  return this.lootEvents().filter(filtering);
};

/**
 * Gets all loot events that have reached their expiration and need removal.
 * @returns {Game_Event[]} A list of all expired loot events.
 */
Game_Map.prototype.expiredLootEvents = function()
{
  // the filter function for only retrieving newly-added loot events.
  const filtering = event =>
  {
    // we only care about loot that is past its prime.
    if (event.getLootNeedsRemoving()) return true;

    // the loot must still be valid.
    return false;
  };

  // return the expired-loot-filtered event list.
  return this.lootEvents().filter(filtering);
};

/**
 * Gets all loot event metadatas that bear the same `uuid` as requested.
 * @returns {rm.types.Event[]} All relevant loot metadatas.
 */
Game_Map.prototype.lootEventsFromDataMapByUuid = function(uuid)
{
  // the filter function for retrieving loot metadatas from the datamap.
  /** @param {rm.types.Event} metadata */
  const filtering = metadata =>
  {
    // don't include invalid or non-action event metadatas.
    if (!metadata || !metadata.uuid) return false;

    // don't include loot metadatas that aren't related to the removed one.
    if (metadata.uuid !== uuid) return false;

    // we want this metadata!
    return true;
  };

  // return the action-metadata-filtered event list.
  return $dataMap.events.filter(filtering);
};

/**
 * Gets all events that have a `JABS_LootDrop` associated with them on the current map.
 * @returns {Game_Event[]} A list of events that have a `JABS_LootDrop`.
 */
Game_Map.prototype.lootEvents = function()
{
  // the filter function for only retrieving action events.
  const filtering = event =>
  {
    // only check if they are loot.
    if (event.isLoot()) return true;

    // it must not be loot.
    return false;
  };

  // return the loot-filtered event list.
  return this.events().filter(filtering);
};

/**
 * Gets all battlers on the current battle map.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getBattlers = function()
{
  if (this._j._allBattlers === null) return [];

  return this._j._allBattlers.filter(battler =>
  {
    const exists = !!battler;
    return exists && !battler.getCharacter()._erased;
  });
};

/**
 * Gets all battlers on the current battle map, including the player.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getAllBattlers = function()
{
  const battlers = this.getBattlers();
  if ($jabsEngine.getPlayer1())
  {
    battlers.push($jabsEngine.getPlayer1());
  }
  return battlers;
};

/**
 * Gets all battlers on the current map, and orders them by distance in relation to
 * a given "origin" battler. It simply uses the given battler's coordinates as the
 * origin and calculates distance from there for all battlers present.
 * @param {JABS_Battler} originBattler
 * @returns
 */
Game_Map.prototype.getAllBattlersDistanceSortedFromPlayer = function(originBattler)
{
  const battlers = this.getAllBattlers();
  return this.orderBattlersByDistanceFromBattler(battlers, originBattler);
};

/**
 * Sorts a collection of battlers by their distance from an origin battler.
 * @param {JABS_Battler[]} battlers The collection of battlers to sort.
 * @param {JABS_Battler} originBattler The origin battler to check distance against.
 * @returns
 */
Game_Map.prototype.orderBattlersByDistanceFromBattler = function(battlers, originBattler)
{
  return battlers.sort((battlerA, battlerB) =>
  {
    const distanceA = originBattler.distanceToDesignatedTarget(battlerA);
    const distanceB = originBattler.distanceToDesignatedTarget(battlerB);
    return distanceA - distanceB;
  });
};

/**
 * Find a battler on this map by their `uuid`.
 * @param {string} uuid The unique identifier of a battler to find.
 * @returns {(JABS_Battler|null)}
 */
Game_Map.prototype.getBattlerByUuid = function(uuid)
{
  const battlers = this.getAllBattlers();
  const jabsBattler = battlers.find(battler => battler.getUuid() === uuid);
  return jabsBattler
    ? jabsBattler
    : null;
};

/**
 * Checks whether or not a particular battler exists on the map.
 * @param {JABS_Battler} battlerToCheck The battler to check the existence of.
 * @returns {boolean}
 */
Game_Map.prototype.battlerExists = function(battlerToCheck)
{
  return !!this.getAllBattlers()
    .find(battler => battler.getUuid() === battlerToCheck.getUuid());
};

/**
 * Gets all battlers within a given range of another battler.
 * @param {JABS_Battler} user The user containing the base coordinates.
 * @param {number} maxDistance The maximum distance that we check battlers for.
 * @param {boolean} includePlayer Whether or not to include the player among battlers within range.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getBattlersWithinRange = function(user, maxDistance, includePlayer = true)
{
  const battlers = this.getBattlers();
  if (includePlayer)
  {
    battlers.push($jabsEngine.getPlayer1());
  }

  return battlers.filter(battler => user.distanceToDesignatedTarget(battler) <= maxDistance);
};

/**
 * Gets all nearby battlers that have an ai trait of `follower`.
 * @param {JABS_Battler} jabsBattler The battler to get all nearby followers for.
 * @returns {JABS_Battler[]} All ai-traited `follower` battlers.
 */
Game_Map.prototype.getNearbyFollowers = function(jabsBattler)
{
  const range = jabsBattler.getSightRadius() + jabsBattler.getPursuitRadius();
  const nearbyBattlers = $gameMap.getBattlersWithinRange(jabsBattler, range);

  // the filter function for determining if a battler is a follower to this leader.
  const filtering = battler =>
  {
    // grab the ai of the nearby battler.
    const ai = battler.getAiMode();

    // check if they can become a follower to the designated leader.
    const canLead = !battler.hasLeader() || (jabsBattler.getUuid() === battler.getLeader());

    // return the answer to that.
    return (ai.follower && !ai.leader && canLead);
  };

  return nearbyBattlers.filter(filtering);
};

/**
 * Clears leader data from another battler by it's `uuid`.
 * @param {string} followerUuid The `uuid` of the battler to clear leader data for.
 */
Game_Map.prototype.clearLeaderDataByUuid = function(followerUuid)
{
  const battler = this.getBattlerByUuid(followerUuid);
  if (battler)
  {
    battler.clearLeaderData();
  }
};

/**
 * Gets all battlers that are on a different team from the designated battler.
 * @param {JABS_Battler} user The battler to find opponents for.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getOpposingBattlers = function(user)
{
  const battlers = this.getBattlers();
  const player = $jabsEngine.getPlayer1();
  if (!user.isSameTeam(player.getTeam()))
  {
    battlers.push(player);
  }

  return battlers.filter(battler =>
  {
    const isNotSameTeam = !user.isSameTeam(battler.getTeam());
    const isNotNeutral = battler.getTeam() !== JABS_Battler.neutralTeamId();
    return isNotSameTeam && isNotNeutral;
  });
};

/**
 * Gets all battlers that are on a different team from the designated battler
 * within a given range.
 * @param {JABS_Battler} user The battler to find opponents for.
 * @param {number} maxDistance The max range to find opponents within.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getOpposingBattlersWithinRange = function(user, maxDistance)
{
  const battlers = this.getOpposingBattlers(user);
  return battlers.filter(battler => user.distanceToDesignatedTarget(battler) <= maxDistance);
};

/**
 * Gets all non-enemy battlers on the current battle map.
 * @returns {JABS_Battler[]} A list of allied battlers.
 */
Game_Map.prototype.getActorBattlers = function()
{
  return this.getAllBattlers()
    .filter(battler => battler.isActor());
};

/**
 * Gets all battlers that share the same team as the target.
 * @param {JABS_Battler} target The battler to compare for allies.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getAllyBattlers = function(target)
{
  const battlers = this.getAllBattlers();
  return battlers.filter(battler => target.isSameTeam(battler.getTeam()));
};

/**
 * Gets all battlers that share the same team as the target within a given range.
 * @param {JABS_Battler} target The battler to find opponents for.
 * @param {number} maxDistance The max range to find opponents within.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.getAllyBattlersWithinRange = function(target, maxDistance)
{
  const battlers = this.getAllyBattlers(target);
  return battlers.filter(battler => target.distanceToDesignatedTarget(battler) <= maxDistance);
};

/**
 * Gets all non-ally battlers on the current battle map.
 * @returns {JABS_Battler[]} A list of enemy battlers.
 */
Game_Map.prototype.getEnemyBattlers = function()
{
  const battlers = this.getBattlers();
  const enemyBattlers = [];
  battlers.forEach(battler =>
  {
    if (battler.isEnemy())
    {
      enemyBattlers.push(battler);
    }
  });

  return enemyBattlers;
};

/**
 * Retrieves all events that are identified as loot on the map currently.
 */
Game_Map.prototype.getLootDrops = function()
{
  return this.events()
    .filter(event => event.isLoot());
};

/**
 * Parses out all enemies from the array of events on the map.
 * @returns {JABS_Battler[]} A `Game_Enemy[]`.
 */
Game_Map.prototype.parseBattlers = function()
{
  const evs = this.events();
  if (evs === undefined || evs === null || evs.length < 1)
  {
    return [];
  }

  try
  {
    const battlerEvents = evs.filter(event => event.isJabsBattler());
    return this.convertAllToEnemies(battlerEvents);
  }
  catch (err)
  {
    console.error(err);
    // for a brief moment when leaving the menu, these are all null.
    return [];
  }
};

/**
 * Converts all provided `Game_Event`s into `Game_Enemy`s.
 * @param {Game_Event[]} events A `Game_Event[]`.
 * @returns {JABS_Battler[]}
 */
Game_Map.prototype.convertAllToEnemies = function(events)
{
  return events.map(event => this.convertOneToEnemy(event));
};

/**
 * Converts a single `Game_Event` into a `Game_Enemy`.
 * @param {Game_Event} event The `Game_Event` to convert to a `JABS_Battler`.
 * @returns {JABS_Battler}
 */
Game_Map.prototype.convertOneToEnemy = function(event)
{
  if (!event.isJabsBattler())
  {
    // if the battler has no id, it is likely being hidden/transformed to non-battler.
    event.setMapBattler("");
    return null;
  }

  const battlerCoreData = event.getBattlerCoreData();
  const battlerId = event.getBattlerId();
  const battler = new Game_Enemy(battlerId, null, null);
  const mapBattler = new JABS_Battler(event, battler, battlerCoreData);
  const uuid = mapBattler.getUuid();
  event.setMapBattler(uuid);
  return mapBattler;
};

/**
 * Finds the battler and its index in the collection by its `uuid`.
 *
 * The result of this is intended to be destructured from the array.
 * @param {string} uuid The `uuid` of the battler to find.
 * @returns {[JABS_Battler, number]}
 */
Game_Map.prototype.findBattlerByUuid = function(uuid)
{
  let targetIndex = -1;
  const foundBattler = this._j._allBattlers.find((battler, index) =>
  {
    const result = battler.getUuid() === uuid;
    if (result) targetIndex = index;
    return result;
  });

  return [foundBattler, targetIndex];
};

/**
 * Finds the battler and its index in the collection by its `_eventId`.
 *
 * The result of this is intended to be destructured from the array.
 * If no result is found, the battler will be null, and index will be -1.
 * @param {number} eventId The `_eventId` of the battler to find.
 * @returns {[JABS_Battler, number]}
 */
Game_Map.prototype.findBattlerByEventId = function(eventId)
{
  let targetIndex = -1;
  const foundBattler = this._j._allBattlers.find((battler, index) =>
  {
    // do not process non-enemies.
    if (!battler.isEnemy()) return false;

    // check if the enemy matches the event we're looking for.
    const isTargetEvent = battler.getCharacter().eventId() === eventId;

    // if it isn't the event we're looking for, keep looking.
    if (!isTargetEvent) return false;

    // grab the index in the collection.
    targetIndex = index;

    // we found a match!
    return true;
  });

  // return the results.
  return [foundBattler, targetIndex];
};

/**
 * Removes a battler from tracking by its index in the master tracking list.
 * @param {number} index The index to splice away.
 */
Game_Map.prototype.deleteBattlerByIndex = function(index)
{
  this._j._allBattlers.splice(index, 1);
};

/**
 * Deletes and removes a `JABS_Battler` from this map's tracking.
 * @param {JABS_Battler} targetBattler The map battler to destroy.
 * @param {boolean} holdSprite Whether or not to actually destroy the sprite of the battler.
 */
Game_Map.prototype.destroyBattler = function(targetBattler, holdSprite = false)
{
  const uuid = targetBattler.getUuid();
  const targetIndex = this._j._allBattlers.findIndex(battler => battler.getUuid() === uuid);

  // if the battler exists, then lets handle it.
  if (targetIndex > -1)
  {
    // shorthand reference to the event/sprite of the battler.
    const event = targetBattler.getCharacter();

    if (!holdSprite)
    {
      // if we're not holding the sprite, then erase it.
      event.erase();

      // set the visual component to be removed, too.
      event.setActionSpriteNeedsRemoving();
    }

    // we always remove the battler from tracking when destroying.
    this.deleteBattlerByIndex(targetIndex);
  }
};

/**
 * Adds a provided event to the current map's event list.
 * @param {Game_Event} event The `Game_Event` to add to this map.
 */
Game_Map.prototype.addEvent = function(event)
{
  this._events.push(event);
};

/**
 * Removes a provided event from the current map's event list.
 * @param {Game_Event} eventToRemove The `Game_Event` to remove from this map.
 */
Game_Map.prototype.removeEvent = function(eventToRemove)
{
  // find the index of the event we're trying to remove.
  const eventIndex = this._events.findIndex(event => event === eventToRemove);

  // confirm we found the event to remove.
  if (eventIndex > -1)
  {
    // remove it if it's an action event.
    this.handleActionEventRemoval(eventToRemove);

    // remove it if it's a loot event.
    this.handleLootEventRemoval(eventToRemove);

    // delete the event from tracking.
    delete this._events[eventIndex];
  }
};

/**
 * Handles the removal of events with an underlying `JABS_Action` from the map.
 * @param {Game_Event} actionToRemove The `Game_Event` to remove from this map.
 */
Game_Map.prototype.handleActionEventRemoval = function(actionToRemove)
{
  // don't process if this event isn't an action.
  if (!actionToRemove.isAction()) return;

  // get the relevant metadatas for the action.
  const actionMetadatas = this.actionEventsFromDataMapByUuid(actionToRemove.getActionUuid());

  // all removed events get erased.
  actionToRemove.erase();

  // command the battle map to cleanup the jabs action.
  $jabsEngine.cleanupAction(actionToRemove.getMapActionData());

  // and also to cleanup the current list of active jabs action events.
  $jabsEngine.clearActionEvents();

  // iterate over each of the metadatas for deletion.
  actionMetadatas.forEach(actionMetadata =>
  {
    // purge the action metadata from the datamap.
    delete $dataMap.events[actionMetadata.actionIndex];
  });
};

/**
 * Handles the removal of events with an underlying `JABS_LootDrop` from the map.
 * @param {Game_Event} lootToRemove The `Game_Event` to remove from this map.
 */
Game_Map.prototype.handleLootEventRemoval = function(lootToRemove)
{
  // don't process if this event isn't an action.
  if (!lootToRemove.isLoot()) return;

  // get the relevant metadatas for the loot.
  const lootMetadatas = this.lootEventsFromDataMapByUuid(lootToRemove.getLootData().uuid);

  // iterate over each of the metadatas for deletion.
  lootMetadatas.forEach(lootMetadata =>
  {
    // purge the loot metadata from the datamap.
    delete $dataMap.events[lootMetadata.lootIndex];
  });
};

/**
 * Removes all actions on the map that have been flagged for removal.
 */
Game_Map.prototype.clearExpiredJabsActionEvents = function()
{
  // grab the list of expired action events.
  const expiredActionEvents = this.expiredActionEvents();

  // get all the game_event sprites that need removing.
  expiredActionEvents.forEach(this.clearExpiredJabsActionEvent, this);
};

/**
 * Clears a particular action event from the map.
 * @param {Game_Event} event The action event to clear.
 */
Game_Map.prototype.clearExpiredJabsActionEvent = function(event)
{
  this.removeEvent(event);
};

/**
 * Removes all loot on the map that has been flagged for removal.
 */
Game_Map.prototype.clearExpiredLootEvents = function()
{
  // grab the list of expired loot events.
  const expiredLootEvents = this.expiredLootEvents();

  // get all the game_event sprites that need removing.
  expiredLootEvents.forEach(this.clearExpiredLootEvent, this);
};

/**
 * Clears a particular loot event from the map.
 * @param {Game_Event} lootEvent The loot event to clear.
 */
Game_Map.prototype.clearExpiredLootEvent = function(lootEvent)
{
  this.removeEvent(lootEvent);
};

/**
 * Handles event interaction for events in front of the player. If they exist,
 * and the player meets the criteria to interact with the event, then do so.
 * It also prevents the player from swinging their weapon willy nilly at NPCs.
 * @param {JABS_Battler} jabsBattler The battler to check the fore-facing events of.
 * @returns {boolean} True if there is an event infront of the player, false otherwise.
 */
Game_Map.prototype.hasInteractableEventInFront = function(jabsBattler)
{
  const player = jabsBattler.getCharacter();
  const direction = player.direction();
  const x1 = player.x;
  const y1 = player.y;
  const x2 = $gameMap.roundXWithDirection(x1, direction);
  const y2 = $gameMap.roundYWithDirection(y1, direction);
  const triggers = [0, 1, 2];

  // look over events directly infront of the player.
  for (const event of $gameMap.eventsXy(x2, y2))
  {
    // if the player is mashing the button at an enemy, let them continue.
    if (event.isJabsBattler()) return false;

    if (event.isTriggerIn(triggers) && event.isNormalPriority() === true)
    {
      return true;
    }
  }

  // if we're looking over a counter, address events a space away instead.
  if ($gameMap.isCounter(x2, y2))
  {
    const x3 = $gameMap.roundXWithDirection(x2, direction);
    const y3 = $gameMap.roundYWithDirection(y2, direction);
    for (const event of $gameMap.eventsXy(x3, y3))
    {
      // if the player is mashing the button at an enemy, let them continue.
      if (event.isJabsBattler()) return false;

      if (event.isTriggerIn(triggers) && event.isNormalPriority() === true)
      {
        return true;
      }
    }
  }

  return false;
};
//#endregion Game_Map

//#region Game_Party
/**
 * Extends the initialize to include additional objects for JABS.
 */
J.ABS.Aliased.Game_Party.initialize = Game_Party.prototype.initialize;
Game_Party.prototype.initialize = function()
{
  J.ABS.Aliased.Game_Party.initialize.call(this);
  this.initJabsPartyData();
};

/**
 * Initializes the stuff related to tracking JABS party cycle capabilities.
 */
Game_Party.prototype.initJabsPartyData = function()
{
  this._j = this._j || {};
  if (this._j._canPartyCycle === undefined)
  {
    this._j._canPartyCycle = true;
  }
};

/**
 * (re-)Enables the JABS party cycle functionality.
 */
Game_Party.prototype.enablePartyCycling = function()
{
  this.initJabsPartyData();
  this._j._canPartyCycle = true;
};

/**
 * Disables the JABS party cycle functionality.
 */
Game_Party.prototype.disablePartyCycling = function()
{
  this.initJabsPartyData();
  this._j._canPartyCycle = false;
};

/**
 * Gets whether or not the party can cycle between members.
 * @returns {boolean} True if party cycling is enabled, false otherwise.
 */
Game_Party.prototype.canPartyCycle = function()
{
  if (this._j === undefined)
  {
    this.initJabsPartyData();
  }

  return this._j._canPartyCycle;
};
//#endregion Game_Party

//#region Game_Player
/**
 * OVERWRITE Changes the button detection to look for a different button instead of SHIFT.
 */
Game_Player.prototype.isDashButtonPressed = function()
{
  const shift = Input.isPressed(J.ABS.Input.Dash);
  if (ConfigManager.alwaysDash)
  {
    return !shift;
  }
  else
  {
    return shift;
  }
};

/**
 * While JABS is enabled, don't try to interact with events if they are enemies.
 */
J.ABS.Aliased.Game_Player.startMapEvent = Game_Player.prototype.startMapEvent;
Game_Player.prototype.startMapEvent = function(x, y, triggers, normal)
{
  if ($jabsEngine.absEnabled)
  {
    if (!$gameMap.isEventRunning())
    {
      for (const event of $gameMap.eventsXy(x, y))
      {
        if (
          !event._erased &&
          event.isTriggerIn(triggers) &&
          event.isNormalPriority() === normal &&
          !event.getMapBattler()
        )
        {
          event.start();
        }
      }
    }
  }
  else
  {
    J.ABS.Aliased.Game_Player.startMapEvent.call(this, x, y, triggers, normal);
  }

};

/**
 * If the Abs menu is pulled up, the player shouldn't be able to move.
 */
J.ABS.Aliased.Game_Player.canMove = Game_Player.prototype.canMove;
Game_Player.prototype.canMove = function()
{
  const isMenuRequested = $jabsEngine.requestAbsMenu;
  const isAbsPaused = $jabsEngine.absPause;
  const isPlayerCasting = $jabsEngine.getPlayer1()
    .isCasting();
  if (isMenuRequested || isAbsPaused || isPlayerCasting)
  {
    return false;
  }
  else
  {
    return J.ABS.Aliased.Game_Player.canMove.call(this);
  }
};

J.ABS.Aliased.Game_Player.isDebugThrough = Game_Player.prototype.isDebugThrough;
Game_Player.prototype.isDebugThrough = function()
{
  if ($jabsEngine.absEnabled)
  {
    return Input.isPressed(J.ABS.Input.Debug) && $gameTemp.isPlaytest();
  }
  else
  {
    return J.ABS.Aliased.Game_Player.isDebugThrough.call(this);
  }
};

/**
 * Initializes the player's `JABS_Battler` if it was not already initialized.
 */
J.ABS.Aliased.Game_Player.refresh = Game_Player.prototype.refresh;
Game_Player.prototype.refresh = function()
{
  J.ABS.Aliased.Game_Player.refresh.call(this);
  $jabsEngine.initializePlayer1();
};

/**
 * Hooks into the distance per frame algorithm and extends it for custom move speeds
 * based on equipment for the player.
 * @return {number} The modified distance per frame to move.
 */
J.ABS.Aliased.Game_Player.distancePerFrame = Game_Player.prototype.distancePerFrame;
Game_Player.prototype.distancePerFrame = function()
{
  const base = J.ABS.Aliased.Game_Player.distancePerFrame.call(this);
  const bonus = this.calculateMovespeedMultiplier(base);
  return (base + bonus);
};

/**
 * Determines the bonus (or penalty) move speed for the player based on equipment.
 * @param {number} baseMoveSpeed The base distance per frame.
 */
Game_Player.prototype.calculateMovespeedMultiplier = function(baseMoveSpeed)
{
  // if we don't have a player to work with, don't do this.
  const player = $jabsEngine.getPlayer1();
  if (!player) return 0;

  const scale = player.getSpeedBoosts();
  if (scale === 0) return 0;

  const multiplier = (scale > 0)
    ? this.translatePositiveSpeedBoost(scale)
    : this.translateNegativeSpeedBoost(scale);

  return baseMoveSpeed * multiplier;
};

/**
 * Translates a scale of positive points into bonus move speed multiplier.
 * @param {number} scale The scale of points to translate into bonus move speed.
 * @returns {number} The multiplier against the base move speed.
 */
Game_Player.prototype.translatePositiveSpeedBoost = function(scale)
{
  let boost = 0.00000;

  // tier 1 boost = 10% per scale for 5 ranks (max +50%).
  if (scale > 5)
  {
    boost += 0.5;
    scale -= 5;
  }
  else
  {
    boost += (scale * 0.1);
    return boost;
  }

  // tier 2 boost = 5% per scale for 5 ranks (max +25%).
  if (scale > 5)
  {
    boost += 0.25;
    scale -= 5;
  }
  else
  {
    boost += (scale * 0.05);
    return boost;
  }

  // tier 3 boost = 2.5% per scale for all remaining ranks.
  boost += (scale * 0.025);
  return boost;
};

/**
 * Translates a scale of positive points into penalty move speed multiplier.
 * @param {number} scale The scale of points to translate into penalty move speed.
 * @returns {number} The multiplier against the base move speed.
 */
Game_Player.prototype.translateNegativeSpeedBoost = function(scale)
{
  // normalize the scale because its easier that way.
  scale = Math.abs(scale);
  let boost = 0.00000;

  // tier 1 boost = 3% per scale for 5 ranks (max -15%).
  const t1scale = 0.03;
  if (scale > 5)
  {
    boost -= (t1scale * 5);
    scale -= 5;
  }
  else
  {
    boost -= (scale * t1scale);
    return boost;
  }

  // tier 2 boost = 2% per scale for 5 ranks (max -10%) again.
  const t2scale = 0.02;
  if (scale > 5)
  {
    boost -= (t2scale * 5);
    scale -= 5;
  }
  else
  {
    boost += (scale * t2scale);
    return boost;
  }

  // tier 3 boost = 1% per scale for all remaining ranks.
  const t3scale = 0.01;
  boost += (scale * t3scale);
  return boost;
};

/**
 * Checks whether or not the player is picking up loot drops.
 */
J.ABS.Aliased.Game_Player.updateMove = Game_Player.prototype.updateMove;
Game_Player.prototype.updateMove = function()
{
  J.ABS.Aliased.Game_Player.updateMove.call(this);
  this.checkForLoot();
};

/**
 * Checks to see if the player coordinates are intercepting with any loot
 * currently on the ground.
 */
Game_Player.prototype.checkForLoot = function()
{
  // get all the loot drops on the map.
  const lootDrops = $gameMap.getLootDrops();

  // make sure we have any loot to work with before processing.
  if (lootDrops.length)
  {
    // process the loot collection.
    this.processLootCollection(lootDrops);
  }
};

/**
 * Processes a collection of loot to determine what to do with it.
 * @param {Game_Event[]} lootDrops The list of all loot drops.
 */
Game_Player.prototype.processLootCollection = function(lootDrops)
{
  // for events picked up and stored all at once.
  const lootCollected = [];

  // iterate over each of the loots to see what we can do with them.
  lootDrops.forEach(lootDrop =>
  {
    // don't pick it up if we cannot pick it up.
    if (!this.canCollectLoot(lootDrop)) return;

    // check if the loot is to be used immediately on-pickup.
    if (lootDrop.isUseOnPickupLoot())
    {
      // use and remove it from tracking if it is.
      this.useOnPickup(lootDrop.getLootData().lootData);
      this.removeLoot(lootDrop);
      return;
    }

    // add it to our group pickup tracker for additional processing.
    lootCollected.push(lootDrop);
  });

  // don't try to pick up collections that don't exist.
  if (!lootCollected.length) return;

  // pick up all the remaining loot.
  this.pickupLootCollection(lootCollected);
};

Game_Player.prototype.canCollectLoot = function(lootEvent)
{
  // we cannot collect loot events that have already been erased.
  if (lootEvent._erased) return false;

  // we cannot collect loot that isn't close enough.
  if (!this.isTouchingLoot(lootEvent)) return false;

  // we can pick it up!
  return true;
};

/**
 * Picks up all loot at the same time that is to be stored.
 * @param {Game_Event[]} lootCollected The list of loot that was collected.
 */
Game_Player.prototype.pickupLootCollection = function(lootCollected)
{
  const lootPickedUp = [];

  // iterate over and pickup all loot collected.
  lootCollected.forEach(loot =>
  {
    // get the underlying loot item.
    const {lootData} = loot.getLootData();

    // store the loot on-pickup.
    this.storeOnPickup(lootData);

    // note that the loot was picked up.
    lootPickedUp.push(lootData);

    // remove loot now that we're done with it.
    this.removeLoot(loot);
  });

  // generate all popups for the loot collected.
  $jabsEngine.generatePopItemBulk(lootPickedUp, this);

  // oh yeah, and play a sound because you picked things up.
  SoundManager.playUseItem();
};

/**
 * Whether or not the player is "touching" the this loot drop.
 * @param {Game_Event} lootDrop The event representing the loot drop.
 * @returns {boolean}
 */
Game_Player.prototype.isTouchingLoot = function(lootDrop)
{
  const distance = $gameMap.distance(lootDrop._realX, lootDrop._realY, this._realX, this._realY);
  return distance <= J.ABS.Metadata.LootPickupRange;
};

/**
 * Collects the loot drop off the ground.
 * @param {Game_Event} lootEvent The event representing this loot.
 */
Game_Player.prototype.pickupLoot = function(lootEvent)
{
  // extract the loot data.
  const lootMetadata = lootEvent.getLootData();
  const {lootData} = lootMetadata;
  lootMetadata.useOnPickup
    ? this.useOnPickup(lootData)
    : this.storeOnPickup(lootData);
};

/**
 * Uses the loot as soon as it is collected.
 * @param {RPG_BaseItem} lootData An object representing the loot.
 */
Game_Player.prototype.useOnPickup = function(lootData)
{
  const player = $jabsEngine.getPlayer1();
  player.applyToolEffects(lootData.id, true);
};

/**
 * Picks up the loot and stores it in the player's inventory.
 * @param {RPG_BaseItem} lootData The loot database data itself.
 */
Game_Player.prototype.storeOnPickup = function(lootData)
{
  // add the loot to your inventory.
  $gameParty.gainItem(lootData, 1, true);

  // generate a log for the loot collected.
  $jabsEngine.createLootLog(lootData);
};

/**
 * Removes the loot drop event from the map.
 * @param {Game_Event} lootEvent The loot to remove from the map.
 */
Game_Player.prototype.removeLoot = function(lootEvent)
{
  lootEvent.setLootNeedsRemoving(true);
  $jabsEngine.requestClearLoot = true;
};
//#endregion Game_Player

//#region Game_Unit
/**
 * OVERWRITE If Jabs is enabled, then you are always "in battle"!
 * Otherwise, it is dependent on the default method.
 */
J.ABS.Aliased.Game_Unit.inBattle = Game_Unit.prototype.inBattle;
Game_Unit.prototype.inBattle = function()
{
  return $jabsEngine.absEnabled
    ? true
    : J.ABS.Aliased.Game_Unit.inBattle.call(this);
}
//#endregion Game_Unit
//#endregion Game objects

//#region RPG objects
//#region RPG base classes
//#region RPG_BaseBattler
//#region bonusHits
/**
 * The number of additional bonus hits this battler adds to their basic attacks.
 * @type {number}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsBonusHits",
  {
    get: function()
    {
      return this.getJabsBonusHits();
    },
  });

/**
 * Gets the JABS bonus hits of this battler.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.getJabsBonusHits = function()
{
  return this.extractJabsBonusHits();
};

/**
 * Extracts the value from the notes.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.extractJabsBonusHits = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.BonusHits, true);
};
//#endregion bonusHits
//#endregion RPG_BaseBattler

//#region RPG_EquipItem
//#region skillId
/**
 * The skill id associated with this equipment.
 * This is typically found on weapons and offhand armors.
 * @type {number|null}
 */
Object.defineProperty(RPG_EquipItem.prototype, "jabsSkillId",
  {
    get: function()
    {
      return this.getJabsSkillId();
    },
  });

/**
 * Gets the JABS skill id for this equip.
 * @returns {number|null}
 */
RPG_EquipItem.prototype.getJabsSkillId = function()
{
  return this.extractJabsSkillId();
};

/**
 * Gets the value from its notes.
 * @returns {number|null}
 */
RPG_EquipItem.prototype.extractJabsSkillId = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SkillId, true);
};
//#endregion skillId

//#region offhand skillId
/**
 * The offhand skill id override from this equip.
 * @type {number}
 */
Object.defineProperty(RPG_EquipItem.prototype, "jabsOffhandSkillId",
  {
    get: function()
    {
      return this.getJabsOffhandSkillId();
    },
  });

/**
 * Gets the JABS offhand skill id override for this equip.
 * @returns {number}
 */
RPG_EquipItem.prototype.getJabsOffhandSkillId = function()
{
  return this.extractJabsOffhandSkillId()
};

/**
 * Gets the value from its notes.
 */
RPG_EquipItem.prototype.extractJabsOffhandSkillId = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.OffhandSkillId, true);
};
//#endregion offhand skillId

//#region speedBoost
/**
 * The movement speed modifier from this equip.
 * @type {number|null}
 */
Object.defineProperty(RPG_EquipItem.prototype, "jabsSpeedBoost",
  {
    get: function()
    {
      return this.getJabsSpeedBoost();
    },
  });

/**
 * Gets the movement speed modifier from this equip.
 * @returns {number|null}
 */
RPG_EquipItem.prototype.getJabsSpeedBoost = function()
{
  return this.extractJabsSpeedBoost()
};

/**
 * Gets the value from its notes.
 * @returns {number|null}
 */
RPG_EquipItem.prototype.extractJabsSpeedBoost = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SpeedBoost, true);
};
//#endregion speedBoost

//#region useOnPickup
/**
 * Normally defines whether or not an item will be automatically used
 * upon being picked up, however, equipment cannot be "used".
 * @type {false}
 */
Object.defineProperty(RPG_EquipItem.prototype, "jabsUseOnPickup",
  {
    get: function()
    {
      return false;
    },
  });
//#endregion useOnPickup

//#region expiration
/**
 * The expiration time in frames for this equip drop.
 * @type {number|null}
 */
Object.defineProperty(RPG_EquipItem.prototype, "jabsExpiration",
  {
    get: function()
    {
      return this.getJabsExpirationFrames();
    },
  });

/**
 * Gets the expiration time in frames.
 * @returns {number|null}
 */
RPG_EquipItem.prototype.getJabsExpirationFrames = function()
{
  return this.extractJabsExpirationFrames();
};

/**
 * Gets the value from its notes.
 * @returns {number|null}
 */
RPG_EquipItem.prototype.extractJabsExpirationFrames = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Expires, true);
};
//#endregion expiration
//#endregion RPG_EquipItem

//#region RPG_TraitItem
//#region bonusHits
/**
 * A new property for retrieving the JABS bonusHits from this traited item.
 * @type {number}
 */
Object.defineProperty(RPG_TraitItem.prototype, "jabsBonusHits",
  {
    get: function()
    {
      return this.getJabsBonusHits();
    },
  });

/**
 * Gets the JABS bonus hits of this traited item.
 * @returns {number|null}
 */
RPG_TraitItem.prototype.getJabsBonusHits = function()
{
  return this.extractJabsBonusHits();
};

/**
 * Extracts the value from the notes.
 * @returns {number|null}
 */
RPG_TraitItem.prototype.extractJabsBonusHits = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.BonusHits, true);
};
//#endregion bonusHits
//#endregion RPG_TraitItem

//#region RPG_UsableItem
//#region bonusHits
/**
 * The number of additional bonus hits this skill or item adds to their basic attacks.
 * @type {number}
 */
Object.defineProperty(RPG_UsableItem.prototype, "jabsBonusHits",
  {
    get: function()
    {
      return this.getJabsBonusHits();
    },
  });

/**
 * Gets the JABS bonus hits of this skill or item.
 * @returns {number|null}
 */
RPG_UsableItem.prototype.getJabsBonusHits = function()
{
  return this.extractJabsBonusHits();
};

/**
 * Extracts the value from the notes.
 * @returns {number|null}
 */
RPG_UsableItem.prototype.extractJabsBonusHits = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.BonusHits, true);
};
//#endregion bonusHits

//#region cooldown
/**
 * The JABS cooldown when using this skill or item.
 * @type {number}
 */
Object.defineProperty(RPG_UsableItem.prototype, "jabsCooldown",
  {
    get: function()
    {
      return this.getJabsCooldown();
    },
  });

/**
 * Gets the JABS cooldown for this skill or item.
 * @returns {number}
 */
RPG_UsableItem.prototype.getJabsCooldown = function()
{
  return this.extractJabsCooldown()
};

/**
 * Gets the value from the notes.
 */
RPG_UsableItem.prototype.extractJabsCooldown = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Cooldown, true);
};
//#endregion cooldown
//#endregion RPG_UsableItem
//#endregion RPG base classes

//#region RPG implementations
//#region RPG_Class
//#region bonusHits
/**
 * The number of additional bonus hits this battler adds to their basic attacks.
 * @type {number}
 */
Object.defineProperty(RPG_Class.prototype, "jabsBonusHits",
  {
    get: function()
    {
      return this.getJabsBonusHits();
    },
  });

/**
 * Gets the JABS bonus hits of this battler.
 * @returns {number|null}
 */
RPG_Class.prototype.getJabsBonusHits = function()
{
  return this.extractJabsBonusHits();
};

/**
 * Extracts the value from the notes.
 * @returns {number|null}
 */
RPG_Class.prototype.extractJabsBonusHits = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.BonusHits, true);
};
//#endregion bonusHits
//#endregion RPG_Class

//#region RPG_Item
//#region skillId
/**
 * The skill id associated with this item or tool.
 * @type {number|null}
 */
Object.defineProperty(RPG_Item.prototype, "jabsSkillId",
  {
    get: function()
    {
      return this.getJabsSkillId();
    },
  });

/**
 * Gets the JABS skill id for this item or tool.
 * @returns {number|null}
 */
RPG_Item.prototype.getJabsSkillId = function()
{
  return this.extractJabsSkillId();
};

/**
 * Gets the value from its notes.
 * @returns {number|null}
 */
RPG_Item.prototype.extractJabsSkillId = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SkillId, true);
};
//#endregion skillId

//#region useOnPickup
/**
 * Whether or not this item will be automatically executed upon being picked up.
 * @type {boolean|null}
 */
Object.defineProperty(RPG_Item.prototype, "jabsUseOnPickup",
  {
    get: function()
    {
      return this.getJabsUseOnPickup();
    },
  });

/**
 * Gets whether or not this item will be used on pickup.
 * @returns {boolean|null}
 */
RPG_Item.prototype.getJabsUseOnPickup = function()
{
  return this.extractJabsUseOnPickup();
};

/**
 * Extracts the boolean from the notes.
 * @returns {boolean|null}
 */
RPG_Item.prototype.extractJabsUseOnPickup = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.UseOnPickup, true);
};
//#endregion useOnPickup

//#region expiration
/**
 * The expiration time in frames for this loot drop.
 * @type {number|null}
 */
Object.defineProperty(RPG_Item.prototype, "jabsExpiration",
  {
    get: function()
    {
      return this.getJabsExpirationFrames();
    },
  });

/**
 * Gets the expiration time in frames.
 * @returns {number|null}
 */
RPG_Item.prototype.getJabsExpirationFrames = function()
{
  return this.extractJabsExpirationFrames();
};

/**
 * Gets the value from its notes.
 * @returns {number|null}
 */
RPG_Item.prototype.extractJabsExpirationFrames = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Expires, true);
};
//#endregion expiration
//#endregion RPG_Item

//#region RPG_Skill effects
//#region range
/**
 * The JABS range for this skill.
 * This range determines the number of tiles the skill can reach in the
 * context of collision with targets.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsRange",
  {
    get: function()
    {
      return this.getJabsRange();
    },
  });

/**
 * Gets the JABS range for this skill.
 * @returns {number}
 */
RPG_Skill.prototype.getJabsRange = function()
{
  return this.extractJabsRange();
};

/**
 * Extracts the JABS range for this skill from its notes.
 */
RPG_Skill.prototype.extractJabsRange = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Range, true);
};
//#endregion range

//#region proximity
/**
 * A new property for retrieving the JABS proximity from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsProximity",
  {
    get: function()
    {
      return this.getJabsProximity();
    },
  });

/**
 * Gets the JABS proximity this skill.
 * @returns {number}
 */
RPG_Skill.prototype.getJabsProximity = function()
{
  return this.extractJabsProximity();
};

/**
 * Extracts the JABS proximity for this skill from its notes.
 */
RPG_Skill.prototype.extractJabsProximity = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Proximity, true);
};
//#endregion proximity

//#region actionId
/**
 * A new property for retrieving the JABS actionId from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsActionId",
  {
    get: function()
    {
      return this.getJabsActionId();
    },
  });

/**
 * Gets the JABS actionId this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsActionId = function()
{
  return this.extractJabsActionId();
};

/**
 * Extracts the JABS actionId for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsActionId = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.ActionId, true);
};
//#endregion actionId

//#region duration
/**
 * A new property for retrieving the JABS duration from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsDuration",
  {
    get: function()
    {
      return this.getJabsDuration();
    },
  });

/**
 * Gets the JABS duration this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsDuration = function()
{
  return this.extractJabsDuration();
};

/**
 * Extracts the JABS duration for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsDuration = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Duration, true);
};
//#endregion duration

//#region shape
/**
 * A new property for retrieving the JABS shape from this skill.
 * @type {string}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsShape",
  {
    get: function()
    {
      return this.getJabsShape();
    },
  });

/**
 * Gets the JABS shape this skill.
 * @returns {string|null}
 */
RPG_Skill.prototype.getJabsShape = function()
{
  return this.extractJabsShape();
};

/**
 * Extracts the JABS shape for this skill from its notes.
 * @returns {string|null}
 */
RPG_Skill.prototype.extractJabsShape = function()
{
  return this.getStringFromNotesByRegex(J.ABS.RegExp.Shape, true);
};
//#endregion shape

//#region knockback
/**
 * A new property for retrieving the JABS knockback from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsKnockback",
  {
    get: function()
    {
      return this.getJabsKnockback();
    },
  });

/**
 * Gets the JABS knockback this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsKnockback = function()
{
  return this.extractJabsKnockback();
};

/**
 * Extracts the JABS knockback for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsKnockback = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Knockback, true);
};
//#endregion knockback

//#region castAnimation
/**
 * A new property for retrieving the JABS castAnimation id from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsCastAnimation",
  {
    get: function()
    {
      return this.getJabsCastAnimation();
    },
  });

/**
 * Gets the JABS castAnimation this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsCastAnimation = function()
{
  return this.extractJabsCastAnimation();
};

/**
 * Extracts the JABS castAnimation for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsCastAnimation = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.CastAnimation, true);
};
//#endregion castAnimation

//#region castTime
/**
 * A new property for retrieving the JABS castTime from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsCastTime",
  {
    get: function()
    {
      return this.getJabsCastTime();
    },
  });

/**
 * Gets the JABS castTime this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsCastTime = function()
{
  return this.extractJabsCastTime();
};

/**
 * Extracts the JABS castTime for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsCastTime = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.CastTime, true);
};
//#endregion castTime

//#region freeCombo
/**
 * Whether or not this skill has the "free combo" trait on it.
 * Skills with "free combo" can continuously be executed regardless of
 * the actual timing factor for combos.
 * @type {boolean|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsFreeCombo",
  {
    get: function()
    {
      return this.getJabsFreeCombo();
    },
  });

/**
 * Gets the JABS freeCombo this skill.
 * @returns {boolean|null}
 */
RPG_Skill.prototype.getJabsFreeCombo = function()
{
  return this.extractJabsFreeCombo();
};

/**
 * Extracts the JABS freeCombo for this skill from its notes.
 * @returns {boolean|null}
 */
RPG_Skill.prototype.extractJabsFreeCombo = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.FreeCombo, true);
};
//#endregion freeCombo

//#region direct
/**
 * A new property for retrieving the JABS direct from this skill.
 * @type {boolean}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsDirect",
  {
    get: function()
    {
      return this.getJabsDirect();
    },
  });

/**
 * Gets the JABS direct this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsDirect = function()
{
  return this.extractJabsDirect();
};

/**
 * Extracts the JABS direct for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsDirect = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.Direct, true);
};
//#endregion direct

//#region bonusAggro
/**
 * A new property for retrieving the JABS bonusAggro from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsBonusAggro",
  {
    get: function()
    {
      return this.getJabsBonusAggro();
    },
  });

/**
 * Gets the JABS bonusAggro this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsBonusAggro = function()
{
  return this.extractJabsBonusAggro();
};

/**
 * Extracts the JABS bonusAggro for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsBonusAggro = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.BonusAggro, true);
};
//#endregion bonusAggro

//#region aggroMultiplier
/**
 * A new property for retrieving the JABS aggroMultiplier from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsAggroMultiplier",
  {
    get: function()
    {
      return this.getJabsAggroMultiplier();
    },
  });

/**
 * Gets the JABS aggroMultiplier this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsAggroMultiplier = function()
{
  return this.extractJabsAggroMultiplier();
};

/**
 * Extracts the JABS aggroMultiplier for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsAggroMultiplier = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.AggroMultiplier, true);
};
//#endregion aggroMultiplier

//#region jabsGuardData
/**
 * The `JABS_GuardData` of this skill.
 * Will return null if there is no guard tag available on this
 * @type {JABS_GuardData}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsGuardData",
  {
    get: function()
    {
      return this.getJabsGuardData();
    },
  });

/**
 * Gets the JABS guard this skill.
 * @returns {[number, number]|null}
 */
RPG_Skill.prototype.getJabsGuardData = function()
{
  return new JABS_GuardData(
    this.id,
    this.jabsGuardFlat,
    this.jabsGuardPercent,
    this.jabsCounterGuard,
    this.jabsCounterParry,
    this.jabsParry)
};
//#endregion jabsGuardData

//#region guard
/**
 * A new property for retrieving the JABS guard from this skill.
 * @type {[number, number]}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsGuard",
  {
    get: function()
    {
      return this.getJabsGuard();
    },
  });

/**
 * The flat amount of damage reduced by this skill when guarding.
 * Should be negative.
 * If positive, this flat damage will instead be added on while guarding.
 * @type {number|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsGuardFlat",
  {
    get: function()
    {
      return this.jabsGuard[0];
    },
  });

/**
 * The percent amount of damage reduced by this skill when guarding.
 * Should be negative.
 * If positive, this percent damage will instead be added on while guarding.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsGuardPercent",
  {
    get: function()
    {
      return this.jabsGuard[1];
    },
  });

/**
 * Gets the JABS guard this skill.
 * @returns {[number, number]|null}
 */
RPG_Skill.prototype.getJabsGuard = function()
{
  return this.extractJabsGuard();
};

/**
 * Extracts the JABS guard for this skill from its notes.
 * @returns {[number, number]|null}
 */
RPG_Skill.prototype.extractJabsGuard = function()
{
  return this.getArrayFromNotesByRegex(J.ABS.RegExp.Guard);
};
//#endregion guard

//#region parry
/**
 * The number of frames that the precise-parry window is available
 * when first guarding.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsParry",
  {
    get: function()
    {
      return this.getJabsParryFrames();
    },
  });

/**
 * Gets the JABS parry this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsParryFrames = function()
{
  return this.extractJabsParryFrames();
};

/**
 * Extracts the JABS parry for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsParryFrames = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Parry, true);
};
//#endregion parry

//#region counterParry
/**
 * When performing a precise-parry, this skill id will be automatically
 * executed in retaliation.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsCounterParry",
  {
    get: function()
    {
      return this.getJabsCounterParry();
    },
  });

/**
 * Gets the JABS counterParry this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsCounterParry = function()
{
  return this.extractJabsCounterParry();
};

/**
 * Extracts the JABS counterParry for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsCounterParry = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.CounterParry, true);
};
//#endregion counterParry

//#region counterGuard
/**
 * While guarding, this skill id will be automatically executed in retaliation.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsCounterGuard",
  {
    get: function()
    {
      return this.getJabsCounterGuard();
    },
  });

/**
 * Gets the JABS counterGuard this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsCounterGuard = function()
{
  return this.extractJabsCounterGuard();
};

/**
 * Extracts the JABS counterGuard for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsCounterGuard = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.CounterGuard, true);
};
//#endregion counterGuard

//#region projectile
/**
 * A new property for retrieving the JABS projectile frames from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsProjectile",
  {
    get: function()
    {
      return this.getJabsProjectile();
    },
  });

/**
 * Gets the JABS projectile this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsProjectile = function()
{
  return this.extractJabsProjectile();
};

/**
 * Extracts the JABS projectile for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsProjectile = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.Projectile, true);
};
//#endregion projectile

//#region uniqueCooldown
/**
 * A new property for retrieving the JABS uniqueCooldown from this skill.
 * @type {boolean}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsUniqueCooldown",
  {
    get: function()
    {
      return this.getJabsUniqueCooldown();
    },
  });

/**
 * Gets the JABS uniqueCooldown this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsUniqueCooldown = function()
{
  return this.extractJabsUniqueCooldown();
};

/**
 * Extracts the JABS uniqueCooldown for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsUniqueCooldown = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.UniqueCooldown, true);
};
//#endregion uniqueCooldown

//#region moveType
/**
 * The direction that this dodge skill will move.
 * @type {string}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsMoveType",
  {
    get: function()
    {
      return this.getJabsMoveType();
    },
  });

/**
 * Gets the JABS moveType this skill.
 * @returns {string|null}
 */
RPG_Skill.prototype.getJabsMoveType = function()
{
  return this.extractJabsMoveType();
};

/**
 * Extracts the JABS moveType for this skill from its notes.
 * @returns {string|null}
 */
RPG_Skill.prototype.extractJabsMoveType = function()
{
  return this.getStringFromNotesByRegex(J.ABS.RegExp.MoveType, true);
};
//#endregion moveType

//#region invincibleDodge
/**
 * Whether or not the battler is invincible for the duration of this
 * skill's dodge movement.
 * @type {boolean}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsInvincibleDodge",
  {
    get: function()
    {
      return this.getJabsInvincibileDodge();
    },
  });

/**
 * Gets the dodge invincibility flag for this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsInvincibileDodge = function()
{
  return this.extractJabsInvincibleDodge();
};

/**
 * Extracts the JABS invincibleDodge for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsInvincibleDodge = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.InvincibleDodge, true);
};
//#endregion invincibleDodge

//#region comboAction
/**
 * The JABS combo data for this skill.
 *
 * The zeroth index is the combo skill id
 * The first index is the delay in frames until the combo can be triggered.
 *
 * Will be null if the combo tag is missing from the skill.
 * @type {[number, number]|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsComboAction",
  {
    get: function()
    {
      return this.getJabsComboAction();
    },
  });

/**
 * The JABS combo skill id that this skill can lead into if the skill is learned
 * by the caster.
 * @type {number|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsComboSkillId",
  {
    get: function()
    {
      return this.jabsComboAction[0];
    },
  });

/**
 * The JABS combo delay in frames before the combo skill can be triggered.
 * @type {number|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsComboDelay",
  {
    get: function()
    {
      return this.jabsComboAction[1];
    },
  });

/**
 * Gets the JABS combo this skill.
 * @returns {[number, number]|null}
 */
RPG_Skill.prototype.getJabsComboAction = function()
{
  return this.extractJabsComboAction();
};

/**
 * Extracts the JABS combo for this skill from its notes.
 * @returns {[number, number]|null}
 */
RPG_Skill.prototype.extractJabsComboAction = function()
{
  return this.getArrayFromNotesByRegex(J.ABS.RegExp.ComboAction);
};
//#endregion comboAction

//#region piercing
/**
 * The JABS piercing data for this skill.
 *
 * The zeroth index is the number of times to repeatedly pierce targets.
 * The first index is the delay in frames between each pierce hit.
 *
 * Will be null if the piercing tag is missing from the skill.
 * @type {[number, number]|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsPiercingData",
  {
    get: function()
    {
      const piercingData = this.getJabsPiercingData();
      if (!piercingData)
      {
        return [1, 0];
      }

      return piercingData;
    },
  });

/**
 * The number of times this skill can hit targets.
 * @type {number|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsPierceCount",
  {
    get: function()
    {
      return this.jabsPiercingData[0];
    },
  });

/**
 * The delay in frames between each pierce hit on targets.
 * @type {number|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsPierceDelay",
  {
    get: function()
    {
      return this.jabsPiercingData[1];
    },
  });

/**
 * Gets the JABS combo this skill.
 * @returns {[number, number]|null}
 */
RPG_Skill.prototype.getJabsPiercingData = function()
{
  return this.extractJabsPiercingData();
};

/**
 * Extracts the JABS combo for this skill from its notes.
 * @returns {[number, number]|null}
 */
RPG_Skill.prototype.extractJabsPiercingData = function()
{
  return this.getArrayFromNotesByRegex(J.ABS.RegExp.PiercingData);
};
//#endregion piercing

//#region knockbackResist
//#region RPG_BaseBattler
/**
 * A new property for retrieving the JABS castTime from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_BaseBattler.prototype, "jabsKnockbackResist",
  {
    get: function()
    {
      return this.getJabsKnockbackResist();
    },
  });

/**
 * Gets the JABS castTime this skill.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.getJabsKnockbackResist = function()
{
  return this.extractJabsKnockbackResist();
};

/**
 * Extracts the JABS castTime for this skill from its notes.
 * @returns {number|null}
 */
RPG_BaseBattler.prototype.extractJabsKnockbackResist = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.KnockbackResist, true);
};
//#endregion RPG_BaseBattler

//#region RPG_BaseItem
/**
 * A new property for retrieving the JABS castTime from this skill.
 * @type {number}
 */
Object.defineProperty(RPG_BaseItem.prototype, "jabsKnockbackResist",
  {
    get: function()
    {
      return this.getJabsKnockbackResist();
    },
  });

/**
 * Gets the JABS castTime this skill.
 * @returns {number|null}
 */
RPG_BaseItem.prototype.getJabsKnockbackResist = function()
{
  return this.extractJabsKnockbackResist();
};

/**
 * Extracts the JABS castTime for this skill from its notes.
 * @returns {number|null}
 */
RPG_BaseItem.prototype.extractJabsKnockbackResist = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.KnockbackResist, true);
};
//#endregion RPG_BaseItem
//#endregion knockbackResist

//#region poseSuffix
/**
 * Gets the JABS pose suffix data for this skill.
 *
 * The zeroth index is the string suffix itself (no quotes needed).
 * The first index is the index on the suffixed character sheet.
 * The second index is the number of frames to spend in this pose.
 * @type {[string, number, number]|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsPoseData",
  {
    get: function()
    {
      return this.getJabsPoseData();
    },
  });

/**
 * Gets the JABS pose suffix for this skill.
 * @type {string}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsPoseSuffix",
  {
    get: function()
    {
      return this.jabsPoseData[0];
    },
  });

/**
 * Gets the JABS pose index for this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsPoseIndex",
  {
    get: function()
    {
      return this.jabsPoseData[1];
    },
  });

/**
 * Gets the JABS pose duration for this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsPoseDuration",
  {
    get: function()
    {
      return this.jabsPoseData[2];
    },
  });

/**
 * Gets the JABS pose suffix data for this skill.
 * @returns {number|null}
 */
RPG_Skill.prototype.getJabsPoseData = function()
{
  return this.extractJabsPoseData();
};

/**
 * Extracts the JABS pose suffix data for this skill from its notes.
 * @returns {number|null}
 */
RPG_Skill.prototype.extractJabsPoseData = function()
{
  return this.getArrayFromNotesByRegex(J.ABS.RegExp.PoseSuffix, true);
};
//#endregion poseSuffix

//#region ignoreParry
/**
 * The amount of parry rating ignored by this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsIgnoreParry",
  {
    get: function()
    {
      return this.getJabsIgnoreParry();
    },
  });

/**
 * Gets the ignore parry amount for this skill.
 * @returns {number}
 */
RPG_Skill.prototype.getJabsIgnoreParry = function()
{
  return this.extractJabsIgnoreParry()
};

/**
 * Gets the value from the notes.
 */
RPG_Skill.prototype.extractJabsIgnoreParry = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.IgnoreParry, true);
};
//#endregion ignoreParry

//#region unparryable
//#region RPG_Skill
/**
 * Whether or not this skill is completely unparryable by the target.
 * @type {boolean}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsUnparryable",
  {
    get: function()
    {
      return this.getJabsUnparryable();
    },
  });

/**
 * Gets whether or not this skill is unparryable.
 * @returns {boolean|null}
 */
RPG_Skill.prototype.getJabsUnparryable = function()
{
  return this.extractJabsUnparryable();
};

/**
 * Extracts the boolean from the notes.
 * @returns {boolean|null}
 */
RPG_Skill.prototype.extractJabsUnparryable = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.Unparryable, true);
};
//#endregion RPG_Skill

//#region RPG_State
/**
 * Whether or not the battler afflicted with this state is unparryable in
 * any action it takes.
 * @type {boolean}
 */
Object.defineProperty(RPG_State.prototype, "jabsUnparryable",
  {
    get: function()
    {
      return this.getJabsUnparryable();
    },
  });

/**
 * Gets whether or not this state will provide the unparryable status
 * to its afflictee.
 * @returns {boolean|null}
 */
RPG_State.prototype.getJabsUnparryable = function()
{
  return this.extractJabsUnparryable();
};

/**
 * Extracts the boolean from the notes.
 * @returns {boolean|null}
 */
RPG_State.prototype.extractJabsUnparryable = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.Unparryable, true);
};
//#endregion RPG_State
//#endregion unparryable

//#region selfAnimation
/**
 * The animation id to play on oneself when executing this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsSelfAnimationId",
  {
    get: function()
    {
      return this.getJabsSelfAnimationId();
    },
  });

/**
 * Gets the JABS self animation id.
 * @returns {number}
 */
RPG_Skill.prototype.getJabsSelfAnimationId = function()
{
  return this.extractJabsSelfAnimationId();
};

/**
 * Extracts the value from the notes.
 */
RPG_Skill.prototype.extractJabsSelfAnimationId = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SelfAnimationId, true);
};
//#endregion range

//#region delay
/**
 * The JABS delay data for this skill.
 *
 * The zeroth index is the number of frames to delay the execution of the skill by.
 * The first index is whether or not to execute regardless of delay by touch.
 *
 * Will be null if the delay tag is missing from the skill.
 * @type {[number, boolean]|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsDelayData",
  {
    get: function()
    {
      const delayData = this.getJabsDelayData();
      if (!delayData)
      {
        return [0, false];
      }

      return delayData;
    },
  });

/**
 * The duration in frames before this skill's action will trigger.
 * @type {number|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsDelayDuration",
  {
    get: function()
    {
      return this.jabsDelayData[0];
    },
  });

/**
 * Whether or not the delay will be ignored if an enemy touches this skill's action.
 * @type {boolean|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsDelayTriggerByTouch",
  {
    get: function()
    {
      return this.jabsDelayData[1];
    },
  });

/**
 * Gets the JABS delay data for this skill.
 * @returns {[number, boolean]|null}
 */
RPG_Skill.prototype.getJabsDelayData = function()
{
  return this.extractJabsDelayData();
};

/**
 * Extracts the data from the notes.
 * @returns {[number, boolean]|null}
 */
RPG_Skill.prototype.extractJabsDelayData = function()
{
  return this.getArrayFromNotesByRegex(J.ABS.RegExp.DelayData);
};
//#endregion delay
//#endregion RPG_Skill effects

//#region RPG_State effects
//#region paralysis
/**
 * Whether or not this state is also a JABS paralysis state.
 * Paralysis is the same as being rooted & muted & disarmed simultaneously.
 * @type {boolean}
 */
Object.defineProperty(RPG_State.prototype, "jabsParalyzed",
  {
    get: function()
    {
      return this.getJabsParalyzed();
    },
  });

/**
 * Gets whether or not this is a JABS paralysis state.
 * @returns {boolean}
 */
RPG_State.prototype.getJabsParalyzed = function()
{
  return this.extractJabsParalyzed()
};

/**
 * Extracts the boolean information from the notes.
 * @returns {boolean}
 */
RPG_State.prototype.extractJabsParalyzed = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.Paralyzed, true);
};
//#endregion paralysis

//#region rooted
/**
 * Whether or not this state is also a JABS rooted state.
 * Rooted battlers are unable to move on the map.
 * @type {boolean}
 */
Object.defineProperty(RPG_State.prototype, "jabsRooted",
  {
    get: function()
    {
      return this.getJabsRooted();
    },
  });

/**
 * Gets whether or not this is a JABS rooted state.
 * @returns {boolean}
 */
RPG_State.prototype.getJabsRooted = function()
{
  return this.extractJabsRooted()
};

/**
 * Extracts the boolean information from the notes.
 * @returns {boolean}
 */
RPG_State.prototype.extractJabsRooted = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.Rooted, true);
};
//#endregion rooted

//#region muted
/**
 * Whether or not this state is also a JABS muted state.
 * Muted battlers are unable to use their combat skills.
 * @type {boolean}
 */
Object.defineProperty(RPG_State.prototype, "jabsMuted",
  {
    get: function()
    {
      return this.getJabsMuted();
    },
  });

/**
 * Gets whether or not this is a JABS muted state.
 * @returns {boolean}
 */
RPG_State.prototype.getJabsMuted = function()
{
  return this.extractJabsMuted()
};

/**
 * Extracts the boolean information from the notes.
 * @returns {boolean}
 */
RPG_State.prototype.extractJabsMuted = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.Muted, true);
};
//#endregion muted

//#region disarmed
/**
 * Whether or not this state is also a JABS disarmed state.
 * Disarmed battlers are unable to use their basic attacks.
 * @type {boolean}
 */
Object.defineProperty(RPG_State.prototype, "jabsDisarmed",
  {
    get: function()
    {
      return this.getJabsDisarmed();
    },
  });

/**
 * Gets whether or not this is a JABS disarmed state.
 * @returns {boolean}
 */
RPG_State.prototype.getJabsDisarmed = function()
{
  return this.extractJabsDisarmed()
};

/**
 * Extracts the boolean information from the notes.
 * @returns {boolean}
 */
RPG_State.prototype.extractJabsDisarmed = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.Disarmed, true);
};
//#endregion disarmed

//#region negative
/**
 * Whether or not this state is considered "negative" for the purpose
 * of AI action decision-making. Ally AI set to Support or enemy AI set
 * to Healing will attempt to remove "negative" states if possible.
 * @type {boolean}
 */
Object.defineProperty(RPG_State.prototype, "jabsNegative",
  {
    get: function()
    {
      return this.getJabsNegative();
    },
  });

/**
 * Gets whether or not this is a JABS negative state.
 * @returns {boolean}
 */
RPG_State.prototype.getJabsNegative = function()
{
  return this.extractJabsNegative()
};

/**
 * Extracts the boolean information from the notes.
 * @returns {boolean}
 */
RPG_State.prototype.extractJabsNegative = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.Negative);
};
//#endregion disarmed

//#region aggroInAmp
/**
 * Multiply incoming aggro by this amount.
 * @type {number|null}
 */
Object.defineProperty(RPG_State.prototype, "jabsAggroInAmp",
  {
    get: function()
    {
      return this.getJabsAggroInAmp();
    },
  });

/**
 * Gets the incoming aggro amplifier.
 * @returns {number|null}
 */
RPG_State.prototype.getJabsAggroInAmp = function()
{
  return this.extractJabsAggroInAmp()
};

/**
 * Gets the value from its notes.
 * @returns {number|null}
 */
RPG_State.prototype.extractJabsAggroInAmp = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.AggroInAmp, true);
};
//#endregion aggroInAmp

//#region aggroOutAmp
/**
 * Multiply outgoing aggro by this amount.
 * @type {number|null}
 */
Object.defineProperty(RPG_State.prototype, "jabsAggroOutAmp",
  {
    get: function()
    {
      return this.getJabsAggroOutAmp();
    },
  });

/**
 * Gets the outgoing aggro amplifier.
 * @returns {number|null}
 */
RPG_State.prototype.getJabsAggroOutAmp = function()
{
  return this.extractJabsAggroOutAmp()
};

/**
 * Gets the value from its notes.
 * @returns {number|null}
 */
RPG_State.prototype.extractJabsAggroOutAmp = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.AggroOutAmp, true);
};
//#endregion aggroOutAmp

//#region aggroLock
/**
 * Whether or not this state locks aggro. Battlers with this state applied
 * can neither gain nor lose aggro for the duration of the state.
 * @type {boolean|null}
 */
Object.defineProperty(RPG_State.prototype, "jabsAggroLock",
  {
    get: function()
    {
      return this.getJabsAggroLock();
    },
  });

/**
 * Gets whether or not this is a JABS aggro-locking state.
 * @returns {boolean|null}
 */
RPG_State.prototype.getJabsAggroLock = function()
{
  return this.extractJabsAggroLock()
};

/**
 * Extracts the boolean information from the notes.
 * @returns {boolean|null}
 */
RPG_State.prototype.extractJabsAggroLock = function()
{
  return this.getBooleanFromNotesByRegex(J.ABS.RegExp.AggroLock, true);
};
//#endregion aggroLock

//#region offhand skillId
/**
 * The offhand skill id override from this state.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsOffhandSkillId",
  {
    get: function()
    {
      return this.getJabsOffhandSkillId();
    },
  });

/**
 * Gets the JABS offhand skill id override for this state.
 * @returns {number}
 */
RPG_State.prototype.getJabsOffhandSkillId = function()
{
  return this.extractJabsOffhandSkillId()
};

/**
 * Gets the value from its notes.
 */
RPG_State.prototype.extractJabsOffhandSkillId = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.OffhandSkillId, true);
};
//#endregion offhand skillId

//#region speedBoost
/**
 * The movement speed modifier from this state.
 * @type {number|null}
 */
Object.defineProperty(RPG_State.prototype, "jabsSpeedBoost",
  {
    get: function()
    {
      return this.getJabsSpeedBoost();
    },
  });

/**
 * Gets the movement speed modifier from this state.
 * @returns {number|null}
 */
RPG_State.prototype.getJabsSpeedBoost = function()
{
  return this.extractJabsSpeedBoost()
};

/**
 * Gets the value from its notes.
 * @returns {number|null}
 */
RPG_State.prototype.extractJabsSpeedBoost = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SpeedBoost, true);
};
//#endregion speedBoost

//#region slipHp
//#region flat
/**
 * The flat slip hp amount- per 5 seconds.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipHpFlatPerFive",
  {
    get: function()
    {
      return this.getJabsSlipHpFlatPer5();
    },
  });

/**
 * The flat slip hp amount- per second.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipHpFlatPerSecond",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipHpFlatPerFive / 5);
    },
  });

/**
 * The flat slip hp amount- per tick, aka 1/4 second (15 frames).
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipHpFlatPerTick",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipHpFlatPerFive / 20);
    },
  });

/**
 * Gets the per5 flat slip hp amount for this state.
 * @returns {number}
 */
RPG_State.prototype.getJabsSlipHpFlatPer5 = function()
{
  return this.extractJabsSlipHpFlatPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipHpFlatPer5 = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SlipHpFlat);
};
//#endregion flat

//#region percent
/**
 * The percent slip hp amount- per 5 seconds.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipHpPercentPerFive",
  {
    get: function()
    {
      return this.getJabsSlipHpPercentPer5();
    },
  });

/**
 * The percent slip hp amount- per second.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipHpPercentPerSecond",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipHpPercentPerFive / 5);
    },
  });

/**
 * The percent slip hp amount- per tick, aka 1/4 second (15 frames).
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipHpPercentPerTick",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipHpPercentPerFive / 20);
    },
  });

/**
 * Gets the per5 percent slip hp amount for this state.
 * @returns {number}
 */
RPG_State.prototype.getJabsSlipHpPercentPer5 = function()
{
  return this.extractJabsSlipHpPercentPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipHpPercentPer5 = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SlipHpPercent);
};
//#endregion percent

//#region formula
/**
 * The formula slip hp amount- per 5 seconds.
 * This does NOT `eval()` the formula, as there is no additional variables
 * available for context.
 * @type {string|null}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipHpFormulaPerFive",
  {
    get: function()
    {
      return this.getJabsSlipHpFormulaPer5();
    },
  });

/**
 * Gets the per5 formula slip hp amount for this state.
 * @returns {string|null}
 */
RPG_State.prototype.getJabsSlipHpFormulaPer5 = function()
{
  return this.extractJabsSlipHpFormulaPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipHpFormulaPer5 = function()
{
  return this.getStringFromNotesByRegex(J.ABS.RegExp.SlipHpFormula);
};
//#endregion formula
//#endregion slipHp

//#region slipMp
//#region flat
/**
 * The flat slip mp amount- per 5 seconds.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipMpFlatPerFive",
  {
    get: function()
    {
      return this.getJabsSlipMpFlatPer5();
    },
  });

/**
 * The flat slip mp amount- per second.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipMpFlatPerSecond",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipMpFlatPerFive / 5);
    },
  });

/**
 * The flat slip mp amount- per tick, aka 1/4 second (15 frames).
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipMpFlatPerTick",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipMpFlatPerFive / 20);
    },
  });

/**
 * Gets the per5 flat slip mp amount for this state.
 * @returns {number}
 */
RPG_State.prototype.getJabsSlipMpFlatPer5 = function()
{
  return this.extractJabsSlipMpFlatPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipMpFlatPer5 = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SlipMpFlat);
};
//#endregion flat

//#region percent
/**
 * The percent slip mp amount- per 5 seconds.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipMpPercentPerFive",
  {
    get: function()
    {
      return this.getJabsSlipMpPercentPer5();
    },
  });

/**
 * The percent slip mp amount- per second.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipMpPercentPerSecond",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipMpPercentPerFive / 5);
    },
  });

/**
 * The percent slip mp amount- per tick, aka 1/4 second (15 frames).
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipMpPercentPerTick",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipMpPercentPerFive / 20);
    },
  });

/**
 * Gets the per5 percent slip mp amount for this state.
 * @returns {number}
 */
RPG_State.prototype.getJabsSlipMpPercentPer5 = function()
{
  return this.extractJabsSlipMpPercentPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipMpPercentPer5 = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SlipMpPercent);
};
//#endregion percent

//#region formula
/**
 * The formula slip mp amount- per 5 seconds.
 * This does NOT `eval()` the formula, as there is no additional variables
 * available for context.
 * @type {string|null}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipMpFormulaPerFive",
  {
    get: function()
    {
      return this.getJabsSlipMpFormulaPer5();
    },
  });

/**
 * Gets the per5 formula slip mp amount for this state.
 * @returns {string|null}
 */
RPG_State.prototype.getJabsSlipMpFormulaPer5 = function()
{
  return this.extractJabsSlipMpFormulaPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipMpFormulaPer5 = function()
{
  return this.getStringFromNotesByRegex(J.ABS.RegExp.SlipMpFormula);
};
//#endregion formula
//#endregion slipMp

//#region slipTp
//#region flat
/**
 * The flat slip tp amount- per 5 seconds.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipTpFlatPerFive",
  {
    get: function()
    {
      return this.getJabsSlipTpFlatPer5();
    },
  });

/**
 * The flat slip tp amount- per second.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipTpFlatPerSecond",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipTpFlatPerFive / 5);
    },
  });

/**
 * The flat slip tp amount- per tick, aka 1/4 second (15 frames).
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipTpFlatPerTick",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipTpFlatPerFive / 20);
    },
  });

/**
 * Gets the per5 flat slip tp amount for this state.
 * @returns {number}
 */
RPG_State.prototype.getJabsSlipTpFlatPer5 = function()
{
  return this.extractJabsSlipTpFlatPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipTpFlatPer5 = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SlipTpFlat);
};
//#endregion flat

//#region percent
/**
 * The percent slip tp amount- per 5 seconds.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipTpPercentPerFive",
  {
    get: function()
    {
      return this.getJabsSlipTpPercentPer5();
    },
  });

/**
 * The percent slip tp amount- per second.
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipTpPercentPerSecond",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipTpPercentPerFive / 5);
    },
  });

/**
 * The percent slip tp amount- per tick, aka 1/4 second (15 frames).
 * @type {number}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipTpPercentPerTick",
  {
    get: function()
    {
      return Math.ceil(this.jabsSlipTpPercentPerFive / 20);
    },
  });

/**
 * Gets the per5 percent slip tp amount for this state.
 * @returns {number}
 */
RPG_State.prototype.getJabsSlipTpPercentPer5 = function()
{
  return this.extractJabsSlipTpPercentPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipTpPercentPer5 = function()
{
  return this.getNumberFromNotesByRegex(J.ABS.RegExp.SlipTpPercent);
};
//#endregion percent

//#region formula
/**
 * The formula slip tp amount- per 5 seconds.
 * This does NOT `eval()` the formula, as there is no additional variables
 * available for context.
 * @type {string|null}
 */
Object.defineProperty(RPG_State.prototype, "jabsSlipTpFormulaPerFive",
  {
    get: function()
    {
      return this.getJabsSlipTpFormulaPer5();
    },
  });

/**
 * Gets the per5 formula slip tp amount for this state.
 * @returns {string|null}
 */
RPG_State.prototype.getJabsSlipTpFormulaPer5 = function()
{
  return this.extractJabsSlipTpFormulaPer5();
};

/**
 * Gets the value from its notes.
 * @returns {number}
 */
RPG_State.prototype.extractJabsSlipTpFormulaPer5 = function()
{
  return this.getStringFromNotesByRegex(J.ABS.RegExp.SlipTpFormula);
};
//#endregion formula
//#endregion slipTp
//#endregion RPG_State effects
//#endregion RPG implementations
//#endregion RPG objects

//ENDFILE